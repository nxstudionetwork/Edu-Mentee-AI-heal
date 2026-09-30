window.renderPage = window.renderPage || {};

(function() {
  var store = window.Store;
  var utils = window.Utils;

  if (!window._timerDelegateAdded) {
    window._timerDelegateAdded = true;
    document.addEventListener('click', function(e) {
      var t = e.target.closest('[data-action^="timer:"]');
      if (!t) return;
      var p = t.getAttribute('data-action').split(':');
      var c = p[1], arg = p.slice(2).join(':');
      if (c === 'start') { startTimer(); }
      else if (c === 'pause') { pauseTimer(); }
      else if (c === 'reset') { resetTimer(); }
      else if (c === 'setMode' && arg) { setMode(arg); }
      else if (c === 'applyCustom') { applyCustomTime(); }
      else if (c === 'clearHistory') { clearSessionHistory(); }
    });
  }

  var MODES = {
    focus: { label: 'Focus', duration: 25 * 60, color: 'var(--accent-blue)' },
    shortBreak: { label: 'Short Break', duration: 5 * 60, color: 'var(--accent-green)' },
    longBreak: { label: 'Long Break', duration: 15 * 60, color: 'var(--accent-purple)' }
  };

  var currentMode = 'focus';
  var totalSeconds = MODES.focus.duration;
  var remainingSeconds = totalSeconds;
  var timerInterval = null;
  var isRunning = false;
  var sessionTask = '';
  var animFrameId = null;

  function getState() {
    return store.get('timerState') || {
      pomodorosToday: 0,
      lastPomDate: '',
      focusTimeToday: 0,
      focusTimeWeek: 0,
      focusTimeAllTime: 0,
      weekStart: '',
      history: []
    };
  }

  function saveTimerState(s) {
    store.set('timerState', s);
  }

  function ensureToday(s) {
    var today = new Date().toDateString();
    if (s.lastPomDate !== today) {
      s.pomodorosToday = 0;
      s.lastPomDate = today;
      var now = new Date();
      var weekStart = new Date(now);
      weekStart.setDate(now.getDate() - now.getDay());
      weekStart.setHours(0, 0, 0, 0);
      if (s.weekStart !== weekStart.toDateString()) {
        s.focusTimeWeek = 0;
        s.weekStart = weekStart.toDateString();
      }
      saveTimerState(s);
    }
    return s;
  }

  function formatTime(seconds) {
    var m = Math.floor(seconds / 60);
    var s = seconds % 60;
    return (m < 10 ? '0' : '') + m + ':' + (s < 10 ? '0' : '') + s;
  }

  function formatMinutes(seconds) {
    var m = Math.floor(seconds / 60);
    if (m < 60) return m + ' min';
    var h = Math.floor(m / 60);
    var rm = m % 60;
    return h + 'h ' + rm + 'm';
  }

  function playBeep() {
    try {
      var ctx = new (window.AudioContext || window.webkitAudioContext)();
      var osc = ctx.createOscillator();
      var gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.type = 'sine';
      osc.frequency.value = 800;
      gain.gain.value = 0.3;
      osc.start();
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.5);
      osc.stop(ctx.currentTime + 0.5);
      setTimeout(function() {
        var osc2 = ctx.createOscillator();
        var gain2 = ctx.createGain();
        osc2.connect(gain2);
        gain2.connect(ctx.destination);
        osc2.type = 'sine';
        osc2.frequency.value = 1000;
        gain2.gain.value = 0.3;
        osc2.start();
        gain2.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.5);
        osc2.stop(ctx.currentTime + 0.5);
      }, 200);
    } catch (e) {}
  }

  function tickTimer() {
    if (remainingSeconds <= 0) {
      timerComplete();
      return;
    }
    remainingSeconds--;
    updateTimerDisplay();
  }

  function timerComplete() {
    clearInterval(timerInterval);
    timerInterval = null;
    isRunning = false;
    playBeep();

    var s = ensureToday(getState());
    if (currentMode === 'focus') {
      s.pomodorosToday = (s.pomodorosToday || 0) + 1;
      var focusMins = Math.floor(MODES.focus.duration / 60);
      s.focusTimeToday = (s.focusTimeToday || 0) + focusMins;
      s.focusTimeWeek = (s.focusTimeWeek || 0) + focusMins;
      s.focusTimeAllTime = (s.focusTimeAllTime || 0) + focusMins;
      s.history.unshift({
        mode: 'focus',
        task: sessionTask || 'Focus Session',
        duration: MODES.focus.duration,
        completedAt: new Date().toISOString()
      });
      if (s.history.length > 50) s.history = s.history.slice(0, 50);
      if (window.App && window.App.awardXP) window.App.awardXP(25);
      if (window.App && window.App.awardCoins) window.App.awardCoins(5);
    }
    saveTimerState(s);

    window.showToast && window.showToast('Timer complete! ' + (currentMode === 'focus' ? '+25 XP earned!' : 'Take a break!'), 'success');
    renderTimerView();
  }

  function startTimer() {
    if (isRunning) return;
    isRunning = true;
    timerInterval = setInterval(tickTimer, 1000);
    renderTimerView();
  }

  function pauseTimer() {
    clearInterval(timerInterval);
    timerInterval = null;
    isRunning = false;
    renderTimerView();
  }

  function resetTimer() {
    clearInterval(timerInterval);
    timerInterval = null;
    isRunning = false;
    remainingSeconds = totalSeconds;
    renderTimerView();
  }

  function setMode(mode) {
    if (!MODES[mode]) return;
    clearInterval(timerInterval);
    timerInterval = null;
    isRunning = false;
    currentMode = mode;
    totalSeconds = MODES[mode].duration;
    remainingSeconds = totalSeconds;
    renderTimerView();
  }

  function applyCustomTime() {
    var input = document.getElementById('timer-custom-minutes');
    if (!input) return;
    var val = parseInt(input.value, 10);
    if (isNaN(val) || val < 1 || val > 180) {
      window.showToast && window.showToast('Enter a value between 1 and 180 minutes', 'error');
      return;
    }
    clearInterval(timerInterval);
    timerInterval = null;
    isRunning = false;
    currentMode = 'focus';
    totalSeconds = val * 60;
    remainingSeconds = totalSeconds;
    window.showToast && window.showToast('Timer set to ' + val + ' minutes', 'success');
    renderTimerView();
  }

  function clearSessionHistory() {
    var s = getState();
    s.history = [];
    saveTimerState(s);
    window.showToast && window.showToast('History cleared', 'success');
    renderTimerView();
  }

  function updateTimerDisplay() {
    var timeEl = document.getElementById('timer-display');
    if (timeEl) timeEl.textContent = formatTime(remainingSeconds);

    var svgCircle = document.getElementById('timer-progress-circle');
    if (svgCircle) {
      var progress = totalSeconds > 0 ? (totalSeconds - remainingSeconds) / totalSeconds : 0;
      var circumference = 2 * Math.PI * 140;
      svgCircle.style.strokeDashoffset = circumference - (progress * circumference);
    }

    var progText = document.getElementById('timer-prog-text');
    if (progText) progText.textContent = Math.round(((totalSeconds - remainingSeconds) / totalSeconds) * 100) + '%';

    var titleText = formatTime(remainingSeconds) + ' - ' + MODES[currentMode].label;
    if (document.title) document.title = titleText;
  }

  function renderTimerView() {
    var mc = document.getElementById('main-content');
    if (!mc) return;
    var s = ensureToday(getState());
    var circumference = 2 * Math.PI * 140;
    var progress = totalSeconds > 0 ? (totalSeconds - remainingSeconds) / totalSeconds : 0;
    var offset = circumference - (progress * circumference);
    var modeColor = MODES[currentMode].color;
    var progressPct = Math.round(progress * 100);

    var html = '<div style="padding:var(--space-5);max-width:800px;margin:0 auto;">';
    html += '<h2 style="font-size:var(--text-xl);font-weight:700;color:var(--text-primary);margin:0 0 var(--space-2) 0">&#x23F1;&#xFE0F; Study Timer</h2>';
    html += '<p style="font-size:var(--text-sm);color:var(--text-tertiary);margin:0 0 var(--space-5) 0">Pomodoro focus sessions with progress tracking</p>';

    html += '<div style="display:grid;grid-template-columns:1fr 1fr;gap:var(--space-5);align-items:start">';

    html += '<div class="glass-card" style="padding:var(--space-5);display:flex;flex-direction:column;align-items:center">';

    html += '<div style="display:flex;gap:var(--space-2);margin-bottom:var(--space-5);width:100%">';
    var modeKeys = ['focus', 'shortBreak', 'longBreak'];
    for (var mi = 0; mi < modeKeys.length; mi++) {
      var mk = modeKeys[mi];
      var isActive = mk === currentMode;
      html += '<button class="btn ' + (isActive ? 'btn-primary' : 'btn-ghost') + ' btn-sm" style="flex:1;min-width:0;font-size:var(--text-xs)" data-action="timer:setMode:' + mk + '">' + MODES[mk].label + '</button>';
    }
    html += '</div>';

    html += '<div style="position:relative;width:200px;height:200px;margin-bottom:var(--space-4)">';
    html += '<svg width="200" height="200" style="transform:rotate(-90deg)">';
    html += '<circle cx="100" cy="100" r="90" fill="none" stroke="var(--bg-glass-strong)" stroke-width="10"/>';
    html += '<circle id="timer-progress-circle" cx="100" cy="100" r="90" fill="none" stroke="' + modeColor + '" stroke-width="10" stroke-linecap="round" stroke-dasharray="' + circumference + '" stroke-dashoffset="' + offset + '" style="transition:stroke-dashoffset 0.3s ease"/>';
    html += '</svg>';
    html += '<div style="position:absolute;inset:0;display:flex;flex-direction:column;align-items:center;justify-content:center">';
    html += '<div id="timer-display" style="font-size:36px;font-weight:700;color:var(--text-primary);font-variant-numeric:tabular-nums">' + formatTime(remainingSeconds) + '</div>';
    html += '<div id="timer-prog-text" style="font-size:var(--text-xs);color:var(--text-tertiary)">' + progressPct + '%</div>';
    html += '</div></div>';

    html += '<div style="width:100%;margin-bottom:var(--space-4)">';
    html += '<label style="font-size:var(--text-xs);color:var(--text-secondary);display:block;margin-bottom:var(--space-1)">What are you studying?</label>';
    html += '<input type="text" class="input-field" placeholder="e.g., Chapter 5: Thermodynamics" value="' + utils.sanitizeHTML(sessionTask) + '" onchange="this.setAttribute(\'data-val\',this.value)" style="font-size:var(--text-sm)">';
    html += '</div>';

    html += '<div style="display:flex;gap:var(--space-3);width:100%">';
    if (!isRunning) {
      html += '<button class="btn btn-primary btn-sm" style="flex:1" data-action="timer:start">&#9654; Start</button>';
    } else {
      html += '<button class="btn btn-secondary btn-sm" style="flex:1" data-action="timer:pause">&#9208; Pause</button>';
    }
    html += '<button class="btn btn-ghost btn-sm" style="flex:1" data-action="timer:reset">&#8635; Reset</button>';
    html += '</div>';

    html += '<div style="width:100%;margin-top:var(--space-4);padding-top:var(--space-4);border-top:1px solid var(--border-color)">';
    html += '<div style="display:flex;align-items:center;gap:var(--space-2);margin-bottom:var(--space-2)">';
    html += '<input type="number" id="timer-custom-minutes" class="input-field" placeholder="Minutes" min="1" max="180" style="flex:1;padding:var(--space-2) var(--space-3);font-size:var(--text-xs)">';
    html += '<button class="btn btn-ghost btn-sm" data-action="timer:applyCustom">Apply</button>';
    html += '</div></div>';

    html += '</div>';

    html += '<div style="display:flex;flex-direction:column;gap:var(--space-4)">';
    html += '<div class="glass-card" style="padding:var(--space-4)">';
    html += '<div style="font-weight:600;color:var(--text-primary);margin-bottom:var(--space-3);font-size:var(--text-sm)">Session Stats</div>';
    var stats = [
      { label: 'Pomodoros Today', value: s.pomodorosToday || 0, icon: '\uD83C\uDF45' },
      { label: 'Focus Time Today', value: formatMinutes((s.focusTimeToday || 0) * 60), icon: '\uD83D\uDD34' },
      { label: 'This Week', value: formatMinutes((s.focusTimeWeek || 0) * 60), icon: '\uD83D\uDD35' },
      { label: 'All Time', value: formatMinutes((s.focusTimeAllTime || 0) * 60), icon: '\uD83D\uDFE0' }
    ];
    for (var sti = 0; sti < stats.length; sti++) {
      var st = stats[sti];
      html += '<div style="display:flex;align-items:center;gap:var(--space-3);padding:var(--space-2) 0' + (sti < stats.length - 1 ? ';border-bottom:1px solid var(--border-color)' : '') + '">';
      html += '<span>' + st.icon + '</span>';
      html += '<span style="flex:1;font-size:var(--text-xs);color:var(--text-secondary)">' + st.label + '</span>';
      html += '<span style="font-weight:600;color:var(--text-primary);font-size:var(--text-sm)">' + st.value + '</span>';
      html += '</div>';
    }
    html += '</div>';

    html += '<div class="glass-card" style="padding:var(--space-4)">';
    html += '<div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:var(--space-3)">';
    html += '<span style="font-weight:600;color:var(--text-primary);font-size:var(--text-sm)">Session History</span>';
    html += '<button class="btn btn-ghost btn-sm" style="font-size:var(--text-xs);padding:2px 8px" data-action="timer:clearHistory">Clear</button>';
    html += '</div>';
    var history = s.history || [];
    if (history.length === 0) {
      html += '<div style="text-align:center;padding:var(--space-4);color:var(--text-tertiary);font-size:var(--text-xs)">No sessions yet. Start your first focus session!</div>';
    } else {
      html += '<div style="max-height:260px;overflow-y:auto">';
      for (var hi = 0; hi < Math.min(history.length, 10); hi++) {
        var h = history[hi];
        var hDate = new Date(h.completedAt);
        html += '<div style="display:flex;align-items:center;gap:var(--space-3);padding:var(--space-2) 0' + (hi < Math.min(history.length, 10) - 1 ? ';border-bottom:1px solid var(--border-color)' : '') + '">';
        html += '<div style="width:32px;height:32px;border-radius:var(--radius-sm);background:rgba(59,130,246,0.1);display:flex;align-items:center;justify-content:center;font-size:14px">&#x23F0;</div>';
        html += '<div style="flex:1;min-width:0">';
        html += '<div style="font-size:var(--text-xs);font-weight:600;color:var(--text-primary);white-space:nowrap;overflow:hidden;text-overflow:ellipsis">' + utils.sanitizeHTML(h.task || 'Focus Session') + '</div>';
        html += '<div style="font-size:10px;color:var(--text-tertiary)">' + formatMinutes(h.duration) + ' \u2022 ' + utils.formatRelativeTime(hDate) + '</div>';
        html += '</div></div>';
      }
      html += '</div>';
    }
    html += '</div>';
    html += '</div>';
    html += '</div>';
    html += '</div>';

    mc.innerHTML = html;
  }

  if (window._currentPageCleanup) window._currentPageCleanup();
  window._currentPageCleanup = function() {
    if (timerInterval) {
      clearInterval(timerInterval);
    }
  };

  window.renderPage.studyTimer = function() {
    var s = ensureToday(getState());
    remainingSeconds = totalSeconds;
    isRunning = false;
    if (timerInterval) { clearInterval(timerInterval); timerInterval = null; }
    renderTimerView();
  };
})();
