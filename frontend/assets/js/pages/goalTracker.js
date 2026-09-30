window.renderPage = window.renderPage || {};

(function() {
  var store = window.Store;
  var utils = window.Utils;

  if (!window._gtDelegateAdded) {
    window._gtDelegateAdded = true;
    document.addEventListener('click', function(e) {
      var t = e.target.closest('[data-action^="gt:"]');
      if (!t) return;
      var p = t.getAttribute('data-action').split(':');
      var c = p[1], arg = p.slice(2).join(':');
      if (c === 'toggleDaily' && arg) { toggleDailyGoal(arg); }
      else if (c === 'setWeekly' && arg) { setWeeklyProgress(arg); }
      else if (c === 'joinChallenge' && arg) { joinMonthlyChallenge(arg); }
      else if (c === 'filterTab' && arg) { currentTab = arg; renderGoalView(); }
    });
  }

  var DAILY_GOALS = [
    { id: 'dg1', title: 'Study 2 Hours', icon: '\uD83D\uDCDA', xp: 100 },
    { id: 'dg2', title: 'Complete a Quiz', icon: '\uD83D\uDCDD', xp: 50 },
    { id: 'dg3', title: 'Read a Chapter', icon: '\uD83D\uDCD6', xp: 75 },
    { id: 'dg4', title: 'Watch an Educational Video', icon: '\uD83C\uDFAC', xp: 30 },
    { id: 'dg5', title: 'Solve 10 Practice Problems', icon: '\uD83D\uDD22', xp: 60 },
    { id: 'dg6', title: 'Review Flashcards', icon: '\uD83C\uDF1F', xp: 40 },
    { id: 'dg7', title: 'Write Study Notes', icon: '\uD83D\uDCDD', xp: 50 },
    { id: 'dg8', title: 'Help a Classmate', icon: '\uD83E\uDD1D', xp: 45 },
    { id: 'dg9', title: 'Practice英语口语', icon: '\uD83C\uDFA4', xp: 35 },
    { id: 'dg10', title: 'No Phone While Studying', icon: '\uD83D\uDCF1', xp: 80 }
  ];

  var WEEKLY_TEMPLATES = [
    { id: 'wt1', title: 'Complete 5 Quizzes', target: 5, icon: '\uD83D\uDCDD', xp: 300 },
    { id: 'wt2', title: 'Study 10 Hours Total', target: 10, icon: '\u23F1\uFE0F', xp: 500 },
    { id: 'wt3', title: 'Read 3 Chapters', target: 3, icon: '\uD83D\uDCD6', xp: 200 },
    { id: 'wt4', title: 'Maintain 5-Day Streak', target: 5, icon: '\uD83D\uDD25', xp: 400 },
    { id: 'wt5', title: 'Complete 20 Practice Problems', target: 20, icon: '\uD83D\uDD22', xp: 350 }
  ];

  var MONTHLY_CHALLENGES = [
    { id: 'mc1', title: 'Complete 20 Lessons', target: 20, icon: '\uD83C\uDFAF', xp: 1500, coins: 200 },
    { id: 'mc2', title: 'Score 90%+ on 5 Quizzes', target: 5, icon: '\uD83C\uDFC6', xp: 2000, coins: 300 },
    { id: 'mc3', title: 'Study 30 Days (No Breaks)', target: 30, icon: '\uD83D\uDD25', xp: 3000, coins: 500 },
    { id: 'mc4', title: 'Complete All Subject Flashcards', target: 10, icon: '\uD83C\uDF1F', xp: 2500, coins: 400 },
    { id: 'mc5', title: 'Help 15 Classmates', target: 15, icon: '\uD83E\uDD1D', xp: 1800, coins: 250 },
    { id: 'mc6', title: 'Solve 100 Practice Problems', target: 100, icon: '\uD83D\uDD22', xp: 2200, coins: 350 },
    { id: 'mc7', title: 'Write 10 Study Notes', target: 10, icon: '\uD83D\uDCDD', xp: 1200, coins: 180 },
    { id: 'mc8', title: 'Master 3 New Subjects', target: 3, icon: '\uD83D\uDCDA', xp: 2800, coins: 450 }
  ];

  var currentTab = 'daily';

  function getDailyState() {
    var today = new Date().toDateString();
    var stored = store.get('gtDailyState');
    if (stored && stored.date === today) return stored;
    return { date: today, completed: {}, totalXP: 0 };
  }

  function saveDailyState(s) {
    store.set('gtDailyState', s);
  }

  function getWeeklyState() {
    var now = new Date();
    var weekStart = new Date(now);
    weekStart.setDate(now.getDate() - now.getDay());
    weekStart.setHours(0, 0, 0, 0);
    var ws = weekStart.toDateString();
    var stored = store.get('gtWeeklyState');
    if (stored && stored.weekStart === ws) return stored;
    return { weekStart: ws, progress: {}, totalXP: 0 };
  }

  function saveWeeklyState(s) {
    store.set('gtWeeklyState', s);
  }

  function getMonthlyState() {
    var now = new Date();
    var monthKey = now.getFullYear() + '-' + (now.getMonth() + 1);
    var stored = store.get('gtMonthlyState');
    if (stored && stored.monthKey === monthKey) return stored;
    return { monthKey: monthKey, joined: {}, progress: {}, totalXP: 0, totalCoins: 0 };
  }

  function saveMonthlyState(s) {
    store.set('gtMonthlyState', s);
  }

  function getStreak() {
    return store.get('gtStreak') || { current: 0, best: 0, lastDate: '' };
  }

  function saveStreak(st) {
    store.set('gtStreak', st);
  }

  function updateStreak() {
    var st = getStreak();
    var today = new Date().toDateString();
    if (st.lastDate === today) return st.current;
    var yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    if (st.lastDate === yesterday.toDateString()) {
      st.current++;
    } else if (st.lastDate !== today) {
      st.current = 1;
    }
    st.lastDate = today;
    if (st.current > st.best) st.best = st.current;
    saveStreak(st);
    return st.current;
  }

  function checkDailyAllComplete() {
    var ds = getDailyState();
    for (var i = 0; i < DAILY_GOALS.length; i++) {
      if (!ds.completed[DAILY_GOALS[i].id]) return false;
    }
    return true;
  }

  function toggleDailyGoal(goalId) {
    var ds = getDailyState();
    var goal = null;
    for (var i = 0; i < DAILY_GOALS.length; i++) {
      if (DAILY_GOALS[i].id === goalId) { goal = DAILY_GOALS[i]; break; }
    }
    if (!goal) return;
    if (ds.completed[goalId]) {
      delete ds.completed[goalId];
      ds.totalXP = Math.max(0, (ds.totalXP || 0) - goal.xp);
    } else {
      ds.completed[goalId] = true;
      ds.totalXP = (ds.totalXP || 0) + goal.xp;
      if (window.App && window.App.awardXP) window.App.awardXP(goal.xp);
      if (window.App && window.App.awardCoins) window.App.awardCoins(Math.floor(goal.xp / 10));
      window.showToast && window.showToast('Goal completed! +' + goal.xp + ' XP', 'success');
    }
    saveDailyState(ds);

    var allDone = checkDailyAllComplete();
    if (allDone) {
      updateStreak();
      window.showToast && window.showToast('All daily goals complete! Streak updated!', 'success');
    }
    renderGoalView();
  }

  function setWeeklyProgress(templateId) {
    var ws = getWeeklyState();
    var template = null;
    for (var i = 0; i < WEEKLY_TEMPLATES.length; i++) {
      if (WEEKLY_TEMPLATES[i].id === templateId) { template = WEEKLY_TEMPLATES[i]; break; }
    }
    if (!template) return;
    var current = ws.progress[templateId] || 0;
    if (current >= template.target) return;
    ws.progress[templateId] = current + 1;
    if (ws.progress[templateId] >= template.target && !ws.progress[templateId + '_rewarded']) {
      ws.progress[templateId + '_rewarded'] = true;
      ws.totalXP = (ws.totalXP || 0) + template.xp;
      if (window.App && window.App.awardXP) window.App.awardXP(template.xp);
      if (window.App && window.App.awardCoins) window.App.awardCoins(Math.floor(template.xp / 10));
      window.showToast && window.showToast('Weekly goal complete! +' + template.xp + ' XP', 'success');
    }
    saveWeeklyState(ws);
    renderGoalView();
  }

  function joinMonthlyChallenge(challengeId) {
    var ms = getMonthlyState();
    var challenge = null;
    for (var i = 0; i < MONTHLY_CHALLENGES.length; i++) {
      if (MONTHLY_CHALLENGES[i].id === challengeId) { challenge = MONTHLY_CHALLENGES[i]; break; }
    }
    if (!challenge) return;
    if (!ms.joined[challengeId]) {
      ms.joined[challengeId] = true;
      ms.progress[challengeId] = 0;
      window.showToast && window.showToast('Challenge joined!', 'success');
    }
    var prog = ms.progress[challengeId] || 0;
    if (prog < challenge.target) {
      ms.progress[challengeId] = prog + 1;
      if (ms.progress[challengeId] >= challenge.target && !ms.progress[challengeId + '_rewarded']) {
        ms.progress[challengeId + '_rewarded'] = true;
        ms.totalXP = (ms.totalXP || 0) + challenge.xp;
        ms.totalCoins = (ms.totalCoins || 0) + challenge.coins;
        if (window.App && window.App.awardXP) window.App.awardXP(challenge.xp);
        if (window.App && window.App.awardCoins) window.App.awardCoins(challenge.coins);
        window.showToast && window.showToast('Challenge complete! +' + challenge.xp + ' XP, +' + challenge.coins + ' Coins!', 'success');
      }
    }
    saveMonthlyState(ms);
    renderGoalView();
  }

  function renderGoalView() {
    var mc = document.getElementById('main-content');
    if (!mc) return;
    var streak = getStreak();
    var ds = getDailyState();
    var ws = getWeeklyState();
    var ms = getMonthlyState();

    var dailyCompleted = 0;
    for (var di = 0; di < DAILY_GOALS.length; di++) {
      if (ds.completed[DAILY_GOALS[di].id]) dailyCompleted++;
    }
    var dailyPct = Math.round((dailyCompleted / DAILY_GOALS.length) * 100);

    var html = '<div style="padding:var(--space-5);max-width:1000px;margin:0 auto;">';
    html += '<div style="margin-bottom:var(--space-5)">';
    html += '<h2 style="font-size:var(--text-xl);font-weight:700;color:var(--text-primary);margin:0">&#x1F3AF; Goal Tracker</h2>';
    html += '<p style="font-size:var(--text-sm);color:var(--text-tertiary);margin:var(--space-1) 0 0 0">Set goals, track progress, earn rewards</p>';
    html += '</div>';

    html += '<div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(150px,1fr));gap:var(--space-3);margin-bottom:var(--space-5)">';
    var summaryCards = [
      { label: 'Streak', value: streak.current + ' days', color: 'var(--accent-orange)', icon: '\uD83D\uDD25' },
      { label: 'Best Streak', value: streak.best + ' days', color: 'var(--accent-red)', icon: '\uD83C\uDF1F' },
      { label: 'Daily Progress', value: dailyCompleted + '/' + DAILY_GOALS.length, color: 'var(--accent-blue)', icon: '\u2705' },
      { label: 'Today XP', value: ds.totalXP || 0, color: 'var(--accent-green)', icon: '\u2B50' }
    ];
    for (var si = 0; si < summaryCards.length; si++) {
      var sc = summaryCards[si];
      html += '<div class="glass-card" style="padding:var(--space-4);text-align:center">';
      html += '<div style="font-size:24px;margin-bottom:var(--space-1)">' + sc.icon + '</div>';
      html += '<div style="font-size:var(--text-lg);font-weight:700;color:' + sc.color + '">' + sc.value + '</div>';
      html += '<div style="font-size:var(--text-xs);color:var(--text-tertiary)">' + sc.label + '</div>';
      html += '</div>';
    }
    html += '</div>';

    html += '<div style="display:flex;gap:var(--space-2);margin-bottom:var(--space-4)">';
    var tabs = [
      { id: 'daily', label: '\uD83C\uDF1F Daily Goals' },
      { id: 'weekly', label: '\uD83D\uDCC5 Weekly Goals' },
      { id: 'monthly', label: '\uD83C\uDFC6 Monthly Challenges' }
    ];
    for (var ti = 0; ti < tabs.length; ti++) {
      html += '<button class="btn ' + (currentTab === tabs[ti].id ? 'btn-primary' : 'btn-ghost') + ' btn-sm" data-action="gt:filterTab:' + tabs[ti].id + '">' + tabs[ti].label + '</button>';
    }
    html += '</div>';

    if (currentTab === 'daily') {
      html += '<div class="glass-card" style="padding:var(--space-5)">';
      html += '<div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:var(--space-4)">';
      html += '<div><h3 style="margin:0;font-weight:600;color:var(--text-primary)">Today\'s Goals</h3>';
      html += '<span style="font-size:var(--text-xs);color:var(--text-tertiary)">' + dailyCompleted + ' of ' + DAILY_GOALS.length + ' completed</span></div>';
      html += '<div class="progress-circle" style="--progress:' + dailyPct + '%"><span class="progress-circle-value">' + dailyPct + '%</span></div>';
      html += '</div>';
      html += '<div class="progress-bar" style="margin-bottom:var(--space-4)"><div class="progress-bar-fill progress-fill-blue" style="width:' + dailyPct + '%"></div></div>';
      html += '<div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(200px,1fr));gap:var(--space-3)">';
      for (var gi = 0; gi < DAILY_GOALS.length; gi++) {
        var g = DAILY_GOALS[gi];
        var done = !!ds.completed[g.id];
        html += '<div style="display:flex;align-items:center;gap:var(--space-3);padding:var(--space-3);border-radius:var(--radius-md);background:' + (done ? 'rgba(16,185,129,0.08)' : 'var(--bg-glass)') + ';cursor:pointer;border:1px solid ' + (done ? 'rgba(16,185,129,0.3)' : 'var(--border-color)') + '" data-action="gt:toggleDaily:' + g.id + '">';
        html += '<div style="width:24px;height:24px;border-radius:50%;border:2px solid ' + (done ? 'var(--accent-green)' : 'var(--text-tertiary)') + ';display:flex;align-items:center;justify-content:center;font-size:12px;color:var(--accent-green)">' + (done ? '&#10003;' : '') + '</div>';
        html += '<div style="flex:1;min-width:0"><div style="font-size:var(--text-xs);font-weight:600;color:var(--text-primary);' + (done ? 'text-decoration:line-through;opacity:0.6' : '') + '">' + g.icon + ' ' + g.title + '</div>';
        html += '<div style="font-size:10px;color:var(--text-tertiary)">+' + g.xp + ' XP</div></div>';
        html += '</div>';
      }
      html += '</div></div>';
    } else if (currentTab === 'weekly') {
      html += '<div class="glass-card" style="padding:var(--space-5)">';
      html += '<h3 style="margin:0 0 var(--space-4) 0;font-weight:600;color:var(--text-primary)">&#x1F4C5; Weekly Goals</h3>';
      for (var wi = 0; wi < WEEKLY_TEMPLATES.length; wi++) {
        var wt = WEEKLY_TEMPLATES[wi];
        var wp = ws.progress[wt.id] || 0;
        var wpct = Math.min(100, Math.round((wp / wt.target) * 100));
        var complete = wp >= wt.target;
        html += '<div style="padding:var(--space-3);margin-bottom:var(--space-3);border-radius:var(--radius-md);border:1px solid ' + (complete ? 'rgba(16,185,129,0.3)' : 'var(--border-color)') + ';background:' + (complete ? 'rgba(16,185,129,0.06)' : 'transparent') + '">';
        html += '<div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:var(--space-2)">';
        html += '<div style="display:flex;align-items:center;gap:var(--space-2)">';
        html += '<span style="font-size:18px">' + wt.icon + '</span>';
        html += '<span style="font-size:var(--text-sm);font-weight:600;color:var(--text-primary)">' + wt.title + '</span>';
        html += '</div>';
        html += '<div style="display:flex;align-items:center;gap:var(--space-2)">';
        html += '<span style="font-size:var(--text-xs);color:var(--text-tertiary)">' + wp + '/' + wt.target + '</span>';
        if (!complete) {
          html += '<button class="btn btn-primary btn-sm" style="padding:2px 10px;font-size:var(--text-xs)" data-action="gt:setWeekly:' + wt.id + '">+1</button>';
        }
        html += '</div></div>';
        html += '<div class="progress-bar"><div class="progress-bar-fill progress-fill-green" style="width:' + wpct + '%"></div></div>';
        html += '<div style="font-size:10px;color:var(--text-tertiary);margin-top:var(--space-1)">' + wt.xp + ' XP reward</div>';
        html += '</div>';
      }
      html += '<div style="margin-top:var(--space-3);padding:var(--space-3);border-radius:var(--radius-md);background:rgba(59,130,246,0.06);text-align:center">';
      html += '<span style="font-size:var(--text-xs);color:var(--text-secondary)">Weekly XP earned: <strong style="color:var(--accent-blue)">' + (ws.totalXP || 0) + '</strong></span>';
      html += '</div></div>';
    } else if (currentTab === 'monthly') {
      html += '<div class="glass-card" style="padding:var(--space-5)">';
      html += '<h3 style="margin:0 0 var(--space-4) 0;font-weight:600;color:var(--text-primary)">&#x1F3C6; Monthly Challenges</h3>';
      for (var mi = 0; mi < MONTHLY_CHALLENGES.length; mi++) {
        var mc2 = MONTHLY_CHALLENGES[mi];
        var mp = ms.progress[mc2.id] || 0;
        var mpct = Math.min(100, Math.round((mp / mc2.target) * 100));
        var mcomplete = mp >= mc2.target;
        var mjoined = !!ms.joined[mc2.id];
        html += '<div style="padding:var(--space-4);margin-bottom:var(--space-3);border-radius:var(--radius-md);border:1px solid ' + (mcomplete ? 'rgba(16,185,129,0.3)' : 'var(--border-color)') + ';background:' + (mcomplete ? 'rgba(16,185,129,0.06)' : 'transparent') + '">';
        html += '<div style="display:flex;align-items:start;justify-content:space-between;margin-bottom:var(--space-2)">';
        html += '<div style="display:flex;align-items:center;gap:var(--space-3)">';
        html += '<div style="width:40px;height:40px;border-radius:var(--radius-md);background:rgba(139,92,246,0.1);display:flex;align-items:center;justify-content:center;font-size:20px">' + mc2.icon + '</div>';
        html += '<div><div style="font-weight:600;color:var(--text-primary);font-size:var(--text-sm)">' + mc2.title + '</div>';
        html += '<div style="font-size:var(--text-xs);color:var(--text-tertiary)">' + mp + '/' + mc2.target + ' \u2022 +' + mc2.xp + ' XP, +' + mc2.coins + ' Coins</div>';
        html += '</div></div>';
        if (mjoined && !mcomplete) {
          html += '<button class="btn btn-primary btn-sm" style="padding:2px 12px;font-size:var(--text-xs)" data-action="gt:joinChallenge:' + mc2.id + '">Progress +1</button>';
        } else if (!mjoined) {
          html += '<button class="btn btn-accent btn-sm" style="padding:2px 12px;font-size:var(--text-xs)" data-action="gt:joinChallenge:' + mc2.id + '">Join</button>';
        } else {
          html += '<span class="badge badge-green">&#10003; Complete</span>';
        }
        html += '</div>';
        html += '<div class="progress-bar" style="margin-top:var(--space-2)"><div class="progress-bar-fill progress-fill-purple" style="width:' + mpct + '%"></div></div>';
        html += '</div>';
      }
      html += '<div style="margin-top:var(--space-3);padding:var(--space-3);border-radius:var(--radius-md);background:rgba(139,92,246,0.06);display:flex;justify-content:space-between;align-items:center">';
      html += '<span style="font-size:var(--text-xs);color:var(--text-secondary)">Monthly Rewards</span>';
      html += '<span style="font-size:var(--text-xs);font-weight:600;color:var(--accent-purple)">' + (ms.totalXP || 0) + ' XP \u2022 ' + (ms.totalCoins || 0) + ' Coins</span>';
      html += '</div></div>';
    }

    html += '</div>';
    mc.innerHTML = html;
  }

  window.renderPage.goalTracker = function() {
    currentTab = 'daily';
    renderGoalView();
  };
})();
