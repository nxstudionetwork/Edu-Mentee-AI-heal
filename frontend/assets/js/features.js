window.EduFeatures = (function() {
  var store = window.Store;
  var utils = window.Utils;

  // Event delegation for data-action attributes (replaces inline onclick handlers)
  document.addEventListener('click', function(e) {
    var target = e.target.closest('[data-action^="features:"]');
    if (!target) return;
    var action = target.getAttribute('data-action');
    var parts = action.split(':');
    var cmd = parts[1];
    var args = parts.slice(2);
    if (cmd && typeof window.EduFeatures[cmd] === 'function') {
      window.EduFeatures[cmd].apply(window.EduFeatures, args);
    }
  });
  document.addEventListener('change', function(e) {
    var target = e.target.closest('[data-action^="features:"]');
    if (!target) return;
    var action = target.getAttribute('data-action');
    var parts = action.split(':');
    var cmd = parts[1];
    var args = parts.slice(2);
    if (target.tagName === 'TEXTAREA' || target.tagName === 'INPUT' || target.tagName === 'SELECT') {
      args.push(target.value);
    }
    if (cmd && typeof window.EduFeatures[cmd] === 'function') {
      window.EduFeatures[cmd].apply(window.EduFeatures, args);
    }
  });
  document.addEventListener('input', function(e) {
    var target = e.target.closest('[data-action^="features:"]');
    if (!target) return;
    var action = target.getAttribute('data-action');
    var parts = action.split(':');
    var cmd = parts[1];
    var args = parts.slice(2);
    if (cmd && typeof window.EduFeatures[cmd] === 'function') {
      window.EduFeatures[cmd].apply(window.EduFeatures, args);
    }
  });
  document.addEventListener('keydown', function(e) {
    if (e.key !== 'Enter') return;
    var target = e.target.closest('[data-action^="features:"]');
    if (!target) return;
    var action = target.getAttribute('data-action');
    var parts = action.split(':');
    var cmd = parts[1];
    var args = parts.slice(2);
    if (cmd && typeof window.EduFeatures[cmd] === 'function') {
      e.preventDefault();
      window.EduFeatures[cmd].apply(window.EduFeatures, args);
    }
  });

  function sanitize(str) {
    if (!str) return '';
    var map = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#x27;' };
    return String(str).replace(/[&<>"']/g, function(m) { return map[m]; });
  }

  function pad(n) {
    return n < 10 ? '0' + n : '' + n;
  }

  function todayStr() {
    var d = new Date();
    return d.getFullYear() + '-' + pad(d.getMonth() + 1) + '-' + pad(d.getDate());
  }

  var quotes = [
    'The beautiful thing about learning is that no one can take it away from you. \u2014 B.B. King',
    'Education is the most powerful weapon which you can use to change the world. \u2014 Nelson Mandela',
    'The mind is not a vessel to be filled, but a fire to be kindled. \u2014 Plutarch',
    'Live as if you were to die tomorrow. Learn as if you were to live forever. \u2014 Mahatma Gandhi',
    'The more that you read, the more things you will know. The more that you learn, the more places you\'ll go. \u2014 Dr. Seuss',
    'Education is not the filling of a pail, but the lighting of a fire. \u2014 W.B. Yeats',
    'Learning never exhausts the mind. \u2014 Leonardo da Vinci',
    'The capacity to learn is a gift; the ability to learn is a skill; the willingness to learn is a choice. \u2014 Brian Herbert',
    'Tell me and I forget. Teach me and I remember. Involve me and I learn. \u2014 Benjamin Franklin',
    'Education is not preparation for life; education is life itself. \u2014 John Dewey',
    'The roots of education are bitter, but the fruit is sweet. \u2014 Aristotle',
    'It is the mark of an educated mind to be able to entertain a thought without accepting it. \u2014 Aristotle',
    'Intelligence plus character \u2014 that is the goal of true education. \u2014 Martin Luther King Jr.',
    'The only person who is educated is the one who has learned how to learn and change. \u2014 Carl Rogers',
    'Study without desire spoils the memory, and it retains nothing that it takes in. \u2014 Leonardo da Vinci',
    'What we learn with pleasure we never forget. \u2014 Alfred Mercier',
    'Education is the key to unlock the golden door of freedom. \u2014 George Washington Carver',
    'An investment in knowledge pays the best interest. \u2014 Benjamin Franklin',
    'Learning is not attained by chance, it must be sought for with ardor and attended to with diligence. \u2014 Abigail Adams',
    'The whole purpose of education is to turn mirrors into windows. \u2014 Sydney J. Harris',
    'Teaching is the one profession that creates all other professions. \u2014 Unknown',
    'Success is the sum of small efforts repeated day in and day out. \u2014 Robert Collier'
  ];

  var roadmaps = {
    python: {
      stages: [
        { name: 'Beginner', level: 1, description: 'Syntax, variables, loops, functions', resources: ['Python.org tutorial', 'Codecademy Python', 'Automate the Boring Stuff'] },
        { name: 'Intermediate', level: 2, description: 'OOP, modules, file handling, error handling', resources: ['Real Python', 'Python Crash Course', 'Effective Python'] },
        { name: 'Advanced', level: 3, description: 'Decorators, generators, async, design patterns', resources: ['Fluent Python', 'Python Cookbook', 'Test-Driven Development'] },
        { name: 'Expert', level: 4, description: 'C extensions, performance tuning, framework internals', resources: ['CPython internals', 'PyCon talks', 'Open source contributions'] }
      ]
    },
    mathematics: {
      stages: [
        { name: 'Beginner', level: 1, description: 'Arithmetic, algebra basics, geometry', resources: ['Khan Academy', 'IXL Math', 'Brilliant basics'] },
        { name: 'Intermediate', level: 2, description: 'Calculus, linear algebra, probability', resources: ['3Blue1Brown', 'MIT OCW', 'Khan Academy advanced'] },
        { name: 'Advanced', level: 3, description: 'Real analysis, abstract algebra, topology', resources: ['Princeton math series', 'Art of Problem Solving', 'Terence Tao blog'] },
        { name: 'Expert', level: 4, description: 'Research-level mathematics, theorem proving', resources: ['arXiv', 'MathOverflow', 'Research papers'] }
      ]
    },
    javascript: {
      stages: [
        { name: 'Beginner', level: 1, description: 'Variables, functions, DOM, events', resources: ['MDN Web Docs', 'freeCodeCamp', 'JavaScript.info'] },
        { name: 'Intermediate', level: 2, description: 'Closures, prototypes, promises, async/await', resources: ['You Don\'t Know JS', 'Eloquent JavaScript', 'Frontend Masters'] },
        { name: 'Advanced', level: 3, description: 'Design patterns, performance, testing, bundlers', resources: ['Patterns.dev', 'Testing JavaScript', 'Webpack docs'] },
        { name: 'Expert', level: 4, description: 'Engine internals, spec reading, framework authoring', resources: ['V8 blog', 'TC39 proposals', 'ECMAScript spec'] }
      ]
    }
  };

  var timerInstances = {};

  function getTimerState(containerId) {
    var saved = store.get('pomodoroState') || {};
    return saved[containerId] || {
      mode: 'focus',
      remaining: 25 * 60,
      total: 25 * 60,
      isRunning: false,
      sessionCount: 0
    };
  }

  function saveTimerState(containerId, state) {
    var all = store.get('pomodoroState') || {};
    all[containerId] = state;
    store.set('pomodoroState', all);
  }

  return {
    renderTimer: function(containerId) {
      var container = document.getElementById(containerId);
      if (!container) return function() {};

      var state = getTimerState(containerId);
      var modes = {
        focus: { label: 'Focus', duration: 25 * 60, color: '#3b82f6' },
        shortBreak: { label: 'Short Break', duration: 5 * 60, color: '#10b981' },
        longBreak: { label: 'Long Break', duration: 15 * 60, color: '#8b5cf6' }
      };

      var timerInterval = null;
      var audioCtx = null;

      function persist() {
        saveTimerState(containerId, state);
      }

      function playBeep() {
        try {
          if (!audioCtx) {
            audioCtx = new (window.AudioContext || window.webkitAudioContext)();
          }
          var freq = [880, 1100, 1320];
          for (var fi = 0; fi < freq.length; fi++) {
            (function(f, delay) {
              setTimeout(function() {
                try {
                  var o = audioCtx.createOscillator();
                  var g = audioCtx.createGain();
                  o.connect(g);
                  g.connect(audioCtx.destination);
                  o.frequency.value = f;
                  o.type = 'sine';
                  g.gain.value = 0.3;
                  g.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.5);
                  o.start();
                  o.stop(audioCtx.currentTime + 0.5);
                } catch (e) {}
              }, delay);
            })(freq[fi], fi * 200);
          }
        } catch (e) {}
      }

      function switchMode(mode) {
        if (timerInterval) {
          clearInterval(timerInterval);
          timerInterval = null;
        }
        state.mode = mode;
        state.remaining = modes[mode].duration;
        state.total = modes[mode].duration;
        state.isRunning = false;
        persist();
        render();
      }

      function toggleTimer() {
        if (state.isRunning) {
          if (timerInterval) {
            clearInterval(timerInterval);
            timerInterval = null;
          }
          state.isRunning = false;
          persist();
          render();
        } else {
          if (state.remaining <= 0) return;
          state.isRunning = true;
          persist();
          render();
          if (timerInterval) clearInterval(timerInterval);
          timerInterval = setInterval(function() {
            state.remaining--;
            if (state.remaining <= 0) {
              state.remaining = 0;
              state.isRunning = false;
              clearInterval(timerInterval);
              timerInterval = null;
              playBeep();
              if (state.mode === 'focus') {
                state.sessionCount++;
                var msg = 'Pomodoro #' + state.sessionCount + ' complete! Time for a break!';
                if (window.EduFeatures && window.EduFeatures.showToast) {
                  window.EduFeatures.showToast(msg, 'success');
                }
              } else {
                if (window.EduFeatures && window.EduFeatures.showToast) {
                  window.EduFeatures.showToast('Break over! Ready to focus again?', 'info');
                }
              }
              persist();
              render();
            } else {
              persist();
              var mins = Math.floor(state.remaining / 60);
              var secs = state.remaining % 60;
              var timeEl = container.querySelector('.ef-timer-time');
              var progressEl = container.querySelector('.ef-timer-progress-ring');
              if (timeEl) timeEl.textContent = pad(mins) + ':' + pad(secs);
              if (progressEl) {
                var circumference = 2 * Math.PI * 80;
                var offset = circumference * (1 - state.remaining / state.total);
                progressEl.style.strokeDashoffset = offset;
              }
            }
          }, 1000);
        }
      }

      function resetTimer() {
        if (timerInterval) {
          clearInterval(timerInterval);
          timerInterval = null;
        }
        state.remaining = state.total;
        state.isRunning = false;
        persist();
        render();
      }

      function render() {
        var mins = Math.floor(state.remaining / 60);
        var secs = state.remaining % 60;
        var modeInfo = modes[state.mode];
        var circumference = 2 * Math.PI * 80;
        var progress = state.total > 0 ? state.remaining / state.total : 1;
        var offset = circumference * (1 - progress);

        var tabsHtml = '';
        var tabKeys = ['focus', 'shortBreak', 'longBreak'];
        for (var ti = 0; ti < tabKeys.length; ti++) {
          var tk = tabKeys[ti];
          var tm = modes[tk];
          var activeCls = tk === state.mode ? ' c-bg-accent c-text-accent' : '';
          tabsHtml += '\
<button class="ef-timer-tab c-radius-sm c-pointer c-fs-xs c-fw-semibold c-transition-fast' + activeCls + '" data-action="features:_timerSwitchMode:' + containerId + '|' + tk + '">' + tm.label + '</button>';
        }

        container.innerHTML = '\
<div class="c-bg-card c-radius-lg c-border c-text-center mx-auto" style="padding:var(--space-5);max-width:400px">\
  <div class="c-flex-gap-2" style="display:flex;gap:var(--space-1);margin-bottom:var(--space-5)">\
    ' + tabsHtml + '\
  </div>\
  <div class="c-relative" style="width:200px;height:200px;margin:0 auto var(--space-5)">\
    <svg width="200" height="200" viewBox="0 0 200 200" class="c-absolute" style="top:0;left:0;transform:rotate(-90deg)">\
      <circle cx="100" cy="100" r="80" fill="none" stroke="var(--border-color)" stroke-width="8"/>\
      <circle class="ef-timer-progress-ring" cx="100" cy="100" r="80" fill="none" stroke="' + modeInfo.color + '" stroke-width="8" stroke-linecap="round" stroke-dasharray="' + circumference + '" stroke-dashoffset="' + offset + '" style="transition:stroke-dashoffset 0.5s ease"/>\
    </svg>\
    <div class="ef-timer-time c-text-primary" style="position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);font-size:2.5rem;font-weight:700;font-family:var(--font-mono);letter-spacing:2px">' + pad(mins) + ':' + pad(secs) + '</div>\
  </div>\
  <div class="c-flex-center c-flex-gap-3" style="margin-bottom:var(--space-4)">\
    <button class="ef-timer-toggle c-pointer c-fw-semibold c-fs-sm c-transition-fast" style="padding:var(--space-2) var(--space-6);border:none;border-radius:var(--radius-md);color:#fff;background:' + (state.isRunning ? '#ef4444' : modeInfo.color) + '" data-action="features:_timerToggle:' + containerId + '">' + (state.isRunning ? 'Pause' : 'Start') + '</button>\
    <button class="c-pointer c-fw-medium c-fs-sm c-text-secondary c-transition-fast" style="padding:var(--space-2) var(--space-4);border:1px solid var(--border-color);border-radius:var(--radius-md);background:transparent" data-action="features:_timerReset:' + containerId + '">Reset</button>\
  </div>\
  <div class="c-fs-sm c-text-tertiary">Pomodoro #' + (state.sessionCount + 1) + '</div>\
</div>';
      }

      render();
      timerInstances[containerId] = { interval: timerInterval, audioCtx: audioCtx };

      return function() {
        if (timerInterval) {
          clearInterval(timerInterval);
          timerInterval = null;
        }
        if (audioCtx) {
          try { audioCtx.close(); } catch (e) {}
        }
        delete timerInstances[containerId];
      };
    },

    _timerSwitchMode: function(containerId, mode) {
      var container = document.getElementById(containerId);
      if (!container) return;
      var saved = store.get('pomodoroState') || {};
      var state = saved[containerId] || {};
      state.mode = mode;
      var durations = { focus: 25 * 60, shortBreak: 5 * 60, longBreak: 15 * 60 };
      state.remaining = durations[mode] || 25 * 60;
      state.total = state.remaining;
      state.isRunning = false;
      saved[containerId] = state;
      store.set('pomodoroState', saved);
      window.EduFeatures.renderTimer(containerId);
    },

    _timerToggle: function(containerId) {
      var saved = store.get('pomodoroState') || {};
      var state = saved[containerId];
      if (!state) return;
      state.isRunning = !state.isRunning;
      saved[containerId] = state;
      store.set('pomodoroState', saved);
      window.EduFeatures.renderTimer(containerId);
    },

    _timerReset: function(containerId) {
      var saved = store.get('pomodoroState') || {};
      var state = saved[containerId];
      if (!state) return;
      state.remaining = state.total;
      state.isRunning = false;
      saved[containerId] = state;
      store.set('pomodoroState', saved);
      window.EduFeatures.renderTimer(containerId);
    },

    renderDailyGoals: function(containerId) {
      var container = document.getElementById(containerId);
      if (!container) return;

      var today = todayStr();
      var data = store.get('dailyGoals') || {};
      if (data.date !== today) {
        data = {
          date: today,
          goals: [
            { id: 'g1', text: 'Complete 1 quiz', done: false },
            { id: 'g2', text: 'Watch 2 videos', done: false },
            { id: 'g3', text: 'Study 30 minutes', done: false }
          ]
        };
        store.set('dailyGoals', data);
      }

      function save() {
        store.set('dailyGoals', data);
      }

      function toggleGoal(id) {
        for (var gi = 0; gi < data.goals.length; gi++) {
          if (data.goals[gi].id === id) {
            data.goals[gi].done = !data.goals[gi].done;
            break;
          }
        }
        save();
        render();
      }

      function addGoal(text) {
        if (!text || text.trim() === '') return;
        data.goals.push({ id: 'g_' + Date.now(), text: text.trim(), done: false });
        save();
        render();
      }

      function removeGoal(id) {
        var newGoals = [];
        for (var gi = 0; gi < data.goals.length; gi++) {
          if (data.goals[gi].id !== id) {
            newGoals.push(data.goals[gi]);
          }
        }
        data.goals = newGoals;
        save();
        render();
      }

      function resetGoals() {
        data.date = today;
        for (var gi = 0; gi < data.goals.length; gi++) {
          data.goals[gi].done = false;
        }
        save();
        render();
      }

      function render() {
        var completed = 0;
        var goalHtml = '';
        for (var gi = 0; gi < data.goals.length; gi++) {
          var g = data.goals[gi];
          if (g.done) completed++;
          var checked = g.done ? 'checked' : '';
          var textCls = g.done ? ' c-text-tertiary' : '';
          goalHtml += '\
<div class="c-flex-center c-flex-gap-3" style="padding:var(--space-2) 0;border-bottom:1px solid var(--border-light)">\
  <input type="checkbox" ' + checked + ' data-action="features:_goalsToggle:' + containerId + '|' + g.id + '" style="width:18px;height:18px;accent-color:var(--accent-green)">\
  <span class="c-fs-sm c-text-primary' + textCls + '" style="flex:1' + (g.done ? ';text-decoration:line-through' : '') + '">' + sanitize(g.text) + '</span>\
  <button class="c-pointer c-fs-xs" data-action="features:_goalsRemove:' + containerId + '|' + g.id + '" style="background:none;border:none;color:var(--accent-red);padding:2px 6px">\u2715</button>\
</div>';
        }

        var pct = data.goals.length > 0 ? Math.round((completed / data.goals.length) * 100) : 0;

        container.innerHTML = '\
<div class="c-bg-card c-radius-lg c-border" style="padding:var(--space-5)">\
  <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:var(--space-4)">\
    <h4 class="c-fs-base c-fw-semibold c-text-primary" style="margin:0">\ud83c\udfaf Today\'s Goals</h4>\
    <button class="c-bg-glass c-radius-sm c-pointer c-fs-xs c-text-tertiary" data-action="features:_goalsReset:' + containerId + '" style="border:none;padding:4px 10px">Reset</button>\
  </div>\
  <div style="margin-bottom:var(--space-3)">\
    <div class="c-fs-xs c-text-tertiary" style="display:flex;justify-content:space-between;margin-bottom:4px">\
      <span>Progress</span><span>' + completed + '/' + data.goals.length + ' (' + pct + '%)</span>\
    </div>\
    <div class="progress-bar" style="height:6px"><div class="progress-bar-fill progress-fill-green" style="width:' + pct + '%"></div></div>\
  </div>\
  <div id="ef-goals-list">' + goalHtml + '</div>\
  <div class="c-flex-gap-2" style="display:flex;gap:var(--space-2);margin-top:var(--space-3)">\
    <input type="text" id="ef-goal-input-' + containerId + '" placeholder="Add a goal..." class="c-fs-sm" data-action="features:_goalsAdd:' + containerId + '" style="flex:1;padding:var(--space-2) var(--space-3);border:1px solid var(--border-color);border-radius:var(--radius-sm);background:var(--bg-secondary);color:var(--text-primary);outline:none">\
    <button class="c-pointer c-fw-semibold c-fs-sm" data-action="features:_goalsAdd:' + containerId + '" style="padding:var(--space-2) var(--space-4);border:none;border-radius:var(--radius-sm);color:#fff;background:var(--accent-blue)">Add</button>\
  </div>\
</div>';
      }

      render();
    },

    _goalsToggle: function(containerId, id) {
      var container = document.getElementById(containerId);
      if (!container) return;
      var data = store.get('dailyGoals') || {};
      for (var gi = 0; gi < data.goals.length; gi++) {
        if (data.goals[gi].id === id) {
          data.goals[gi].done = !data.goals[gi].done;
          break;
        }
      }
      store.set('dailyGoals', data);
      window.EduFeatures.renderDailyGoals(containerId);
    },

    _goalsAdd: function(containerId) {
      var input = document.getElementById('ef-goal-input-' + containerId);
      if (!input || !input.value.trim()) return;
      var data = store.get('dailyGoals') || {};
      if (!data.goals) data.goals = [];
      data.goals.push({ id: 'g_' + Date.now(), text: input.value.trim(), done: false });
      store.set('dailyGoals', data);
      window.EduFeatures.renderDailyGoals(containerId);
    },

    _goalsRemove: function(containerId, id) {
      var data = store.get('dailyGoals') || {};
      var newGoals = [];
      for (var gi = 0; gi < data.goals.length; gi++) {
        if (data.goals[gi].id !== id) newGoals.push(data.goals[gi]);
      }
      data.goals = newGoals;
      store.set('dailyGoals', data);
      window.EduFeatures.renderDailyGoals(containerId);
    },

    _goalsReset: function(containerId) {
      var data = store.get('dailyGoals') || {};
      for (var gi = 0; gi < data.goals.length; gi++) {
        data.goals[gi].done = false;
      }
      data.date = todayStr();
      store.set('dailyGoals', data);
      window.EduFeatures.renderDailyGoals(containerId);
    },

    renderQuickNotes: function(containerId) {
      var container = document.getElementById(containerId);
      if (!container) return;

      var notes = store.get('quickNotes') || [];

      function save() {
        store.set('quickNotes', notes);
      }

      function addNote(text) {
        if (!text || text.trim() === '') return;
        notes.unshift({ id: 'n_' + Date.now(), text: text.trim(), timestamp: new Date().toISOString() });
        if (notes.length > 50) notes = notes.slice(0, 50);
        save();
        render();
      }

      function deleteNote(id) {
        var newNotes = [];
        for (var ni = 0; ni < notes.length; ni++) {
          if (notes[ni].id !== id) newNotes.push(notes[ni]);
        }
        notes = newNotes;
        save();
        render();
      }

      function updateNote(id, text) {
        for (var ni = 0; ni < notes.length; ni++) {
          if (notes[ni].id === id) {
            notes[ni].text = text.trim();
            notes[ni].timestamp = new Date().toISOString();
            break;
          }
        }
        save();
        render();
      }

      var editingId = null;

      function render() {
        var searchQ = '';
        var searchInput = document.getElementById('ef-notes-search-' + containerId);
        if (searchInput) searchQ = searchInput.value.toLowerCase().trim();

        var listHtml = '';
        var filtered = notes;
        if (searchQ) {
          filtered = [];
          for (var ni = 0; ni < notes.length; ni++) {
            if (notes[ni].text.toLowerCase().indexOf(searchQ) !== -1) {
              filtered.push(notes[ni]);
            }
          }
        }

        for (var ni = 0; ni < filtered.length; ni++) {
          var note = filtered[ni];
          var isEditing = editingId === note.id;
          var ts = utils && utils.formatRelativeTime ? utils.formatRelativeTime(note.timestamp) : new Date(note.timestamp).toLocaleString();

          if (isEditing) {
            listHtml += '\
<div class="c-bg-glass c-radius-md" style="padding:var(--space-3);border:1px solid var(--accent-blue);margin-bottom:var(--space-2)">\
  <textarea id="ef-edit-text-' + note.id + '" class="c-fs-sm" style="width:100%;min-height:60px;padding:var(--space-2);border:1px solid var(--border-color);border-radius:var(--radius-sm);background:var(--bg-secondary);color:var(--text-primary);resize:vertical;outline:none">' + sanitize(note.text) + '</textarea>\
  <div class="c-flex-gap-2" style="display:flex;gap:var(--space-2);margin-top:var(--space-2)">\
    <button class="c-pointer c-fw-medium c-fs-xs" data-action="features:_notesSaveEdit:' + containerId + '|' + note.id + '" style="padding:var(--space-1) var(--space-3);border:none;border-radius:var(--radius-sm);color:#fff;background:var(--accent-green)">Save</button>\
    <button class="c-pointer c-fw-medium c-fs-xs c-text-secondary" data-action="features:_notesCancelEdit:' + containerId + '" style="padding:var(--space-1) var(--space-3);border:1px solid var(--border-color);border-radius:var(--radius-sm);background:transparent">Cancel</button>\
  </div>\
</div>';
          } else {
            listHtml += '\
<div class="c-radius-md c-pointer c-transition-fast" data-action="features:_notesEdit:' + containerId + '|' + note.id + '" style="padding:var(--space-3);border:1px solid var(--border-color);margin-bottom:var(--space-2)">\
  <div class="c-fs-sm c-text-primary" style="margin-bottom:var(--space-1);word-break:break-word">' + sanitize(note.text) + '</div>\
  <div class="c-flex-between" style="display:flex;justify-content:space-between;align-items:center">\
    <span class="c-fs-xs c-text-tertiary">' + sanitize(ts) + '</span>\
    <button class="c-pointer c-fs-xs" data-action="features:_notesDelete:' + containerId + '|' + note.id + '" style="background:none;border:none;color:var(--accent-red);padding:2px 6px">\u2715</button>\
  </div>\
</div>';
          }
        }

        if (filtered.length === 0) {
          listHtml = '<div class="c-text-center c-fs-sm c-text-tertiary" style="padding:var(--space-4)">' + (searchQ ? 'No notes match your search.' : 'No notes yet. Write one below!') + '</div>';
        }

        container.innerHTML = '\
<div class="c-bg-card c-radius-lg c-border" style="padding:var(--space-5)">\
  <h4 class="c-fs-base c-fw-semibold c-text-primary" style="margin:0 0 var(--space-4)">\ud83d\udcdd Quick Notes</h4>\
  <div class="c-flex-gap-2" style="display:flex;gap:var(--space-2);margin-bottom:var(--space-3)">\
    <textarea id="ef-notes-textarea-' + containerId + '" placeholder="Write a quick note..." class="c-fs-sm" style="flex:1;min-height:60px;padding:var(--space-3);border:1px solid var(--border-color);border-radius:var(--radius-sm);background:var(--bg-secondary);color:var(--text-primary);resize:vertical;outline:none"></textarea>\
  </div>\
  <div class="c-flex-gap-2" style="display:flex;gap:var(--space-2);margin-bottom:var(--space-4)">\
    <button class="c-pointer c-fw-semibold c-fs-sm" data-action="features:_notesAdd:' + containerId + '" style="padding:var(--space-2) var(--space-4);border:none;border-radius:var(--radius-sm);color:#fff;background:var(--accent-blue)">Save Note</button>\
  </div>\
  <div style="margin-bottom:var(--space-3)">\
    <input type="text" id="ef-notes-search-' + containerId + '" placeholder="Search notes..." class="c-fs-sm c-w-full" data-action="features:_notesSearch:' + containerId + '" style="padding:var(--space-2) var(--space-3);border:1px solid var(--border-color);border-radius:var(--radius-sm);background:var(--bg-secondary);color:var(--text-primary);outline:none">\
  </div>\
  <div class="c-scroll-y" style="max-height:300px">' + listHtml + '</div>\
  <div class="c-fs-xs c-text-tertiary" style="margin-top:var(--space-2)">' + notes.length + '/50 notes</div>\
</div>';
      }

      render();
    },

    _notesAdd: function(containerId) {
      var textarea = document.getElementById('ef-notes-textarea-' + containerId);
      if (!textarea || !textarea.value.trim()) return;
      var notes = store.get('quickNotes') || [];
      notes.unshift({ id: 'n_' + Date.now(), text: textarea.value.trim(), timestamp: new Date().toISOString() });
      if (notes.length > 50) notes = notes.slice(0, 50);
      store.set('quickNotes', notes);
      textarea.value = '';
      window.EduFeatures.renderQuickNotes(containerId);
    },

    _notesDelete: function(containerId, id) {
      var notes = store.get('quickNotes') || [];
      var newNotes = [];
      for (var ni = 0; ni < notes.length; ni++) {
        if (notes[ni].id !== id) newNotes.push(notes[ni]);
      }
      store.set('quickNotes', newNotes);
      window.EduFeatures.renderQuickNotes(containerId);
    },

    _notesEdit: function(containerId, id) {
      var container = document.getElementById(containerId);
      if (!container) return;
      container.setAttribute('data-editing-id', id);
      window.EduFeatures.renderQuickNotes(containerId);
    },

    _notesSaveEdit: function(containerId, id) {
      var textarea = document.getElementById('ef-edit-text-' + id);
      if (!textarea || !textarea.value.trim()) return;
      var notes = store.get('quickNotes') || [];
      for (var ni = 0; ni < notes.length; ni++) {
        if (notes[ni].id === id) {
          notes[ni].text = textarea.value.trim();
          notes[ni].timestamp = new Date().toISOString();
          break;
        }
      }
      store.set('quickNotes', notes);
      var container = document.getElementById(containerId);
      if (container) container.removeAttribute('data-editing-id');
      window.EduFeatures.renderQuickNotes(containerId);
    },

    _notesCancelEdit: function(containerId) {
      var container = document.getElementById(containerId);
      if (container) container.removeAttribute('data-editing-id');
      window.EduFeatures.renderQuickNotes(containerId);
    },

    _notesSearch: function(containerId) {
      window.EduFeatures.renderQuickNotes(containerId);
    },

    renderWeeklyChart: function(containerId) {
      var container = document.getElementById(containerId);
      if (!container) return;

      var stats = store.get('weeklyStats') || {};
      var dayNames = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
      var today = new Date().getDay();
      var mondayOffset = today === 0 ? 6 : today - 1;

      var barHtml = '';
      var totalHours = 0;
      var barColors = ['#3b82f6', '#8b5cf6', '#06b6d4', '#10b981', '#f59e0b', '#f97316', '#ec4899'];

      for (var di = 0; di < 7; di++) {
        var dayKey = 'day' + (di + 1);
        var hours = stats[dayKey] || Math.floor(Math.random() * 6) + 1;
        totalHours += hours;
        var maxHeight = 140;
        var barHeight = Math.max(4, (hours / 10) * maxHeight);
        var isToday = di === mondayOffset;
        var bgColor = barColors[di % barColors.length];

        var fwCls = isToday ? ' c-fw-semibold' : '';
        barHtml += '\
<div class="c-flex-center c-flex-gap-2" style="flex-direction:column;flex:1">\
  <div class="c-fs-xs c-text-tertiary' + fwCls + '">' + hours + 'h</div>\
  <div class="c-flex" style="width:100%;justify-content:center;align-items:flex-end;height:' + maxHeight + 'px">\
    <div class="c-transition" style="width:60%;max-width:32px;height:' + barHeight + 'px;border-radius:var(--radius-sm) var(--radius-sm) 0 0;background:linear-gradient(to top,' + bgColor + ',' + bgColor + '88);border:2px solid ' + (isToday ? bgColor : 'transparent') + '"></div>\
  </div>\
  <div class="c-fs-xs' + fwCls + '" style="color:' + (isToday ? 'var(--accent-blue)' : 'var(--text-secondary)') + '">' + dayNames[di] + '</div>\
</div>';
      }

      container.innerHTML = '\
<div class="c-bg-card c-radius-lg c-border" style="padding:var(--space-5)">\
  <h4 class="c-fs-base c-fw-semibold c-text-primary" style="margin:0 0 var(--space-5)">\ud83d\udcca Weekly Activity</h4>\
  <div style="display:flex;align-items:flex-end;gap:var(--space-1);padding-bottom:var(--space-2)">\
    ' + barHtml + '\
  </div>\
  <div class="c-text-center c-fs-sm c-fw-semibold c-text-primary" style="margin-top:var(--space-4)">This Week: ' + totalHours + ' hours total</div>\
</div>';
    },

    renderExamCountdown: function(containerId, examDate, examName) {
      var container = document.getElementById(containerId);
      if (!container) return function() {};

      if (!examDate) {
        container.innerHTML = '<div style="color:var(--accent-red);font-size:var(--text-sm)">No exam date provided.</div>';
        return function() {};
      }

      var target = new Date(examDate);
      if (isNaN(target.getTime())) {
        container.innerHTML = '<div style="color:var(--accent-red);font-size:var(--text-sm)">Invalid exam date.</div>';
        return function() {};
      }

      function getTimeRemaining() {
        var now = new Date();
        var diff = target - now;
        if (diff <= 0) return { days: 0, hours: 0, minutes: 0, seconds: 0, expired: true };
        var total = Math.floor(diff / 1000);
        return {
          days: Math.floor(total / 86400),
          hours: Math.floor((total % 86400) / 3600),
          minutes: Math.floor((total % 3600) / 60),
          seconds: total % 60,
          expired: false
        };
      }

      function render() {
        var t = getTimeRemaining();

        if (t.expired) {
          container.innerHTML = '\
<div class="c-radius-lg c-text-center c-bg-success" style="background:linear-gradient(135deg,rgba(16,185,129,0.15),rgba(59,130,246,0.15));padding:var(--space-6);border:1px solid var(--accent-green)">\
  <div style="font-size:2rem;margin-bottom:var(--space-2)">\ud83c\udf89</div>\
  <h3 class="c-fs-lg c-fw-bold c-text-success" style="margin:0 0 var(--space-2)">Exam Day!</h3>\
  <div class="c-fs-sm c-text-secondary">' + sanitize(examName || 'Exam') + '</div>\
</div>';
          return;
        }

        container.innerHTML = '\
<div class="c-bg-card c-radius-lg c-border c-text-center" style="padding:var(--space-5)">\
  <div class="c-fs-sm c-fw-semibold c-text-secondary" style="margin-bottom:var(--space-3)">\ud83d\udcc5 Exam: ' + sanitize(examName || 'Exam') + '</div>\
  <div class="c-fs-xs c-text-tertiary" style="margin-bottom:var(--space-4)">Time Remaining</div>\
  <div class="c-flex-center c-flex-gap-3" style="justify-content:center">\
    <div><div style="font-size:2rem;font-weight:700;color:var(--accent-blue);font-family:var(--font-mono)">' + pad(t.days) + '</div><div class="c-fs-xs c-text-tertiary">Days</div></div>\
    <div style="font-size:2rem;color:var(--text-tertiary)">:</div>\
    <div><div style="font-size:2rem;font-weight:700;color:var(--accent-purple);font-family:var(--font-mono)">' + pad(t.hours) + '</div><div class="c-fs-xs c-text-tertiary">Hours</div></div>\
    <div style="font-size:2rem;color:var(--text-tertiary)">:</div>\
    <div><div style="font-size:2rem;font-weight:700;color:var(--accent-cyan);font-family:var(--font-mono)">' + pad(t.minutes) + '</div><div class="c-fs-xs c-text-tertiary">Minutes</div></div>\
    <div style="font-size:2rem;color:var(--text-tertiary)">:</div>\
    <div><div style="font-size:2rem;font-weight:700;color:var(--accent-green);font-family:var(--font-mono)">' + pad(t.seconds) + '</div><div class="c-fs-xs c-text-tertiary">Seconds</div></div>\
  </div>\
</div>';
      }

      render();
      var interval = setInterval(render, 1000);

      return function() {
        clearInterval(interval);
      };
    },

    renderMotivationalQuote: function(containerId) {
      var container = document.getElementById(containerId);
      if (!container) return;

      var recentQuotes = store.get('recentQuotes') || [];

      function getRandomQuote() {
        var available = [];
        for (var qi = 0; qi < quotes.length; qi++) {
          if (recentQuotes.indexOf(qi) === -1) {
            available.push(qi);
          }
        }
        if (available.length === 0) {
          recentQuotes = [];
          store.set('recentQuotes', recentQuotes);
          for (var qi = 0; qi < quotes.length; qi++) {
            available.push(qi);
          }
        }
        var idx = available[Math.floor(Math.random() * available.length)];
        recentQuotes.push(idx);
        if (recentQuotes.length > 5) recentQuotes.shift();
        store.set('recentQuotes', recentQuotes);
        return quotes[idx];
      }

      function render() {
        var q = getRandomQuote();
        container.innerHTML = '\
<div class="c-radius-lg c-pointer c-transition" data-action="features:renderMotivationalQuote:' + containerId + '" title="Click for another quote" style="background:linear-gradient(135deg,var(--bg-card),var(--bg-glass));padding:var(--space-5);border:1px solid var(--border-color)">\
  <div style="font-size:1.5rem;margin-bottom:var(--space-2)">\u201c</div>\
  <div class="c-fs-sm c-text-primary" style="font-style:italic;line-height:1.6;margin-bottom:var(--space-3)">' + sanitize(q) + '</div>\
  <div class="c-fs-xs c-text-tertiary">Click for another quote</div>\
</div>';
      }

      render();
    },

    showToast: function(message, type) {
      var toast = document.createElement('div');
      var colors = {
        success: { bg: 'rgba(16,185,129,0.15)', border: 'var(--accent-green)', icon: '\u2705' },
        error: { bg: 'rgba(239,68,68,0.15)', border: 'var(--accent-red)', icon: '\u274c' },
        info: { bg: 'rgba(59,130,246,0.15)', border: 'var(--accent-blue)', icon: '\u2139\ufe0f' },
        warning: { bg: 'rgba(245,158,11,0.15)', border: 'var(--accent-yellow)', icon: '\u26a0\ufe0f' }
      };
      var c = colors[type] || colors.info;

      toast.className = 'ef-toast c-fixed c-radius-md c-p-3 c-text-primary c-fs-sm c-flex-center c-flex-gap-3 c-shadow-lg c-transition';
      toast.style.cssText = '\
bottom:24px;right:24px;z-index:99999;\
background:' + c.bg + ';border:1px solid ' + c.border + ';\
max-width:360px;\
transform:translateY(20px);opacity:0;\
font-family:var(--font-family)';
      toast.innerHTML = '<span>' + c.icon + '</span><span>' + sanitize(message) + '</span>';

      document.body.appendChild(toast);

      requestAnimationFrame(function() {
        toast.style.transform = 'translateY(0)';
        toast.style.opacity = '1';
      });

      var existingToasts = document.querySelectorAll('.ef-toast');
      var offset = 0;
      for (var ti = 0; ti < existingToasts.length; ti++) {
        var et = existingToasts[ti];
        if (et !== toast && et.parentNode) {
          offset += et.offsetHeight + 8;
        }
      }
      toast.style.bottom = (24 + offset) + 'px';
      toast.className = 'ef-toast';

      setTimeout(function() {
        toast.style.transform = 'translateY(20px)';
        toast.style.opacity = '0';
        setTimeout(function() {
          if (toast.parentNode) toast.parentNode.removeChild(toast);
        }, 300);
      }, 3000);
    },

    renderAchievementTimeline: function(containerId) {
      var container = document.getElementById(containerId);
      if (!container) return;

      var achievements = store.get('achievements') || [];

      if (achievements.length === 0) {
        container.innerHTML = '\
<div class="c-bg-card c-radius-lg c-border c-text-center" style="padding:var(--space-6)">\
  <div style="font-size:2rem;margin-bottom:var(--space-3)">\ud83c\udfc6</div>\
  <div class="c-fs-sm c-text-tertiary">No achievements unlocked yet. Start learning to earn achievements!</div>\
</div>';
        return;
      }

      var sorted = achievements.slice().sort(function(a, b) {
        return new Date(a.unlockedAt || 0) - new Date(b.unlockedAt || 0);
      });

      var html = '';
      for (var ai = 0; ai < sorted.length; ai++) {
        var a = sorted[ai];
        var dateStr = a.unlockedAt ? (utils && utils.formatDate ? utils.formatDate(a.unlockedAt, 'dd mmm yyyy') : new Date(a.unlockedAt).toLocaleDateString()) : 'Unknown';
        var isLast = ai === sorted.length - 1;

        html += '\
<div class="c-relative c-flex-gap-3" style="display:flex;gap:var(--space-3);padding-bottom:' + (isLast ? '0' : 'var(--space-5)') + '">\
  <div style="display:flex;flex-direction:column;align-items:center;width:24px">\
    <div class="c-radius-full c-bg-success c-border-accent" style="width:16px;height:16px;border:3px solid var(--accent-green);flex-shrink:0;z-index:1"></div>\
    ' + (isLast ? '' : '<div style="width:2px;flex:1;background:var(--border-color);margin-top:2px"></div>') + '\
  </div>\
  <div style="flex:1;padding-bottom:var(--space-2)">\
    <div class="c-fs-sm c-fw-semibold c-text-primary">' + (a.icon || '\ud83c\udfc6') + ' ' + sanitize(a.name || 'Achievement') + '</div>\
    <div class="c-fs-xs c-text-tertiary" style="margin-top:2px">' + dateStr + '</div>\
  </div>\
</div>';
      }

      container.innerHTML = '\
<div class="c-bg-card c-radius-lg c-border" style="padding:var(--space-5)">\
  <h4 class="c-fs-base c-fw-semibold c-text-primary" style="margin:0 0 var(--space-4)">\ud83c\udfc6 Achievement Timeline</h4>\
  <div>' + html + '</div>\
</div>';
    },

    renderCertificateGallery: function(containerId) {
      var container = document.getElementById(containerId);
      if (!container) return;

      var certificates = store.get('certificates') || [];

      if (certificates.length === 0) {
        var subjects = ['Mathematics', 'Science', 'English', 'Programming', 'Art'];
        for (var ci = 0; ci < 5; ci++) {
          var d = new Date();
          d.setMonth(d.getMonth() - ci * 2);
          certificates.push({
            id: 'cert_' + ci,
            name: 'Certificate of Completion: ' + subjects[ci % subjects.length],
            date: d.toISOString(),
            authority: 'EduMentee Learning Board',
            icon: ['\ud83c\udf93', '\ud83c\udf1f', '\ud83d\udcda', '\ud83d\udd2c', '\ud83c\udfa8'][ci % 5]
          });
        }
      }

      var gridHtml = '';
      for (var ci = 0; ci < certificates.length; ci++) {
        var cert = certificates[ci];
        var dateStr = cert.date ? (utils && utils.formatDate ? utils.formatDate(cert.date, 'dd mmm yyyy') : new Date(cert.date).toLocaleDateString()) : '';

        gridHtml += '\
<div class="c-bg-glass c-radius-md c-border c-text-center c-transition hover-lift" style="padding:var(--space-4)">\
  <div style="font-size:2rem;margin-bottom:var(--space-2)">' + (cert.icon || '\ud83c\udf93') + '</div>\
  <div class="c-fs-sm c-fw-semibold c-text-primary" style="margin-bottom:var(--space-1)">' + sanitize(cert.name) + '</div>\
  <div class="c-fs-xs c-text-tertiary" style="margin-bottom:var(--space-1)">' + sanitize(cert.authority || 'EduMentee') + '</div>\
  <div class="c-fs-xs text-muted" style="margin-bottom:var(--space-3)">' + dateStr + '</div>\
  <button class="c-pointer c-fs-xs c-fw-medium c-text-accent" data-action="features:showToast:Certificate downloaded: ' + sanitize(cert.name) + '|success" style="padding:var(--space-1) var(--space-4);border:1px solid var(--accent-blue);border-radius:var(--radius-sm);background:transparent">\u2b07 Download</button>\
</div>';
      }

      container.innerHTML = '\
<div class="c-bg-card c-radius-lg c-border" style="padding:var(--space-5)">\
  <h4 class="c-fs-base c-fw-semibold c-text-primary" style="margin:0 0 var(--space-4)">\ud83c\udf93 Certificates</h4>\
  <div class="c-grid" style="display:grid;grid-template-columns:repeat(auto-fill,minmax(200px,1fr));gap:var(--space-3)">\
    ' + gridHtml + '\
  </div>\
</div>';
    },

    getLearningStreak: function() {
      var today = todayStr();
      var lastDate = store.get('lastStudyDate');
      var streak = store.get('streak') || 0;

      if (!lastDate) {
        store.set('lastStudyDate', today);
        store.set('streak', 1);
        return 1;
      }

      var last = new Date(lastDate);
      var current = new Date(today);
      var diffMs = current - last;
      var diffDays = Math.round(diffMs / (1000 * 60 * 60 * 24));

      if (lastDate === today) {
        return streak;
      }

      if (diffDays === 1) {
        streak++;
        store.set('streak', streak);
        store.set('lastStudyDate', today);
      } else if (diffDays > 1) {
        streak = 1;
        store.set('streak', streak);
        store.set('lastStudyDate', today);
      }

      return streak;
    },

    renderSkillRoadmap: function(containerId, skill) {
      var container = document.getElementById(containerId);
      if (!container) return;

      var roadmap = getRoadmap(skill);

      if (!roadmap) {
        container.innerHTML = '\
<div style="background:var(--bg-card);border-radius:var(--radius-lg);padding:var(--space-5);border:1px solid var(--border-color);text-align:center">\
  <div style="font-size:var(--text-sm);color:var(--text-tertiary)">No roadmap available for "' + sanitize(skill) + '". Try: Python, Mathematics, or JavaScript.</div>\
</div>';
        return;
      }

      var currentLevel = store.get('skillLevel_' + skill) || 1;

      var stagesHtml = '';
      for (var si = 0; si < roadmap.stages.length; si++) {
        var stage = roadmap.stages[si];
        var isCurrent = stage.level === currentLevel;
        var isCompleted = stage.level < currentLevel;
        var isUpcoming = stage.level > currentLevel;

        var boxStyle = '';
        if (isCurrent) {
          boxStyle = 'border-color:var(--accent-blue);background:rgba(59,130,246,0.1)';
        } else if (isCompleted) {
          boxStyle = 'border-color:var(--accent-green);background:rgba(16,185,129,0.08)';
        } else {
          boxStyle = 'border-color:var(--border-color);background:var(--bg-glass)';
        }

        var resourcesHtml = '';
        for (var ri = 0; ri < stage.resources.length; ri++) {
          resourcesHtml += '<li class="c-fs-xs c-text-tertiary" style="margin-bottom:2px">' + sanitize(stage.resources[ri]) + '</li>';
        }

        var statusIcon = isCompleted ? '\u2705' : (isCurrent ? '\u25b6\ufe0f' : '\u23f3');
        var dotBg = isCompleted ? 'var(--accent-green)' : isCurrent ? 'var(--accent-blue)' : 'var(--text-muted)';
        var titleCls = isCompleted ? 'c-text-success' : isCurrent ? 'c-text-accent' : 'c-text-primary';

        stagesHtml += '\
<div class="c-relative" style="display:flex;gap:var(--space-3);padding-bottom:var(--space-4)">\
  <div style="display:flex;flex-direction:column;align-items:center;width:24px">\
    <div class="c-radius-full" style="width:16px;height:16px;background:' + dotBg + ';flex-shrink:0;z-index:1"></div>\
    ' + (si < roadmap.stages.length - 1 ? '<div style="width:2px;flex:1;background:var(--border-color);margin-top:2px"></div>' : '') + '\
  </div>\
  <div class="c-radius-md" style="flex:1;padding:var(--space-3);border:1px solid;' + boxStyle + '">\
    <div class="c-flex-between" style="display:flex;justify-content:space-between;align-items:center;margin-bottom:var(--space-1)">\
      <span class="c-fs-sm c-fw-semibold ' + titleCls + '">' + statusIcon + ' ' + sanitize(stage.name) + '</span>\
      <span class="c-fs-xs c-text-tertiary">Level ' + stage.level + '</span>\
    </div>\
    <div class="c-fs-xs c-text-secondary" style="margin-bottom:var(--space-2)">' + sanitize(stage.description) + '</div>\
    <ul style="margin:0;padding-left:var(--space-4)">' + resourcesHtml + '</ul>\
  </div>\
</div>';
      }

      var downLevel = Math.max(1, currentLevel - 1);
      var upLevel = Math.min(roadmap.stages.length, currentLevel + 1);

      container.innerHTML = '\
<div class="c-bg-card c-radius-lg c-border" style="padding:var(--space-5)">\
  <h4 class="c-fs-base c-fw-semibold c-text-primary" style="margin:0 0 var(--space-4)">\ud83d\udcc8 ' + sanitize(skill) + ' Roadmap</h4>\
  <div>' + stagesHtml + '</div>\
  <div class="c-flex-between" style="margin-top:var(--space-3);padding-top:var(--space-3);border-top:1px solid var(--border-color)">\
    <span class="c-fs-xs c-text-tertiary">Current Level: ' + currentLevel + ' / ' + roadmap.stages.length + '</span>\
    <div class="c-flex-gap-2" style="display:flex;gap:var(--space-2)">\
      ' + (currentLevel > 1 ? '<button class="c-pointer c-fs-xs c-text-secondary" data-action="features:_roadmapSetLevel:' + containerId + '|' + sanitize(skill) + '|' + downLevel + '" style="padding:var(--space-1) var(--space-3);border:1px solid var(--border-color);border-radius:var(--radius-sm);background:transparent">Level Down</button>' : '') + '\
      ' + (currentLevel < roadmap.stages.length ? '<button class="c-pointer c-fs-xs c-text-accent" data-action="features:_roadmapSetLevel:' + containerId + '|' + sanitize(skill) + '|' + upLevel + '" style="padding:var(--space-1) var(--space-3);border:1px solid var(--accent-blue);border-radius:var(--radius-sm);background:transparent">Level Up</button>' : '') + '\
    </div>\
  </div>\
</div>';
    },

    _roadmapSetLevel: function(containerId, skill, level) {
      store.set('skillLevel_' + skill, level);
      window.EduFeatures.renderSkillRoadmap(containerId, skill);
    },

    _openTimerModal: function() {
      var modal = document.getElementById('ef-pomodoro-modal');
      if (!modal) return;
      modal.style.display = 'flex';
      window.EduFeatures.renderTimer('ef-pomodoro-timer');
    },

    // ==================== MODAL UTILITY ====================

    _createModal: function(id, title, contentHtml, width) {
      var existing = document.getElementById(id);
      if (existing) {
        var contentEl = document.getElementById(id + '-content');
        if (contentEl) contentEl.innerHTML = contentHtml;
        existing.style.display = 'flex';
        return existing;
      }
      var modal = document.createElement('div');
      modal.id = id;
      modal.className = 'c-fixed c-flex-center c-z-1000';
      modal.style.cssText = 'display:none;top:0;left:0;right:0;bottom:0;background:rgba(0,0,0,0.7)';
      modal.onclick = function(e) {
        if (e.target === this) this.style.display = 'none';
      };
      var w = width || 600;
      modal.innerHTML = '\
<div class="c-relative c-bg-glass c-radius-xl c-overflow-auto" style="padding:var(--space-6);max-width:' + w + 'px;width:90%;max-height:90vh">\
  <div class="c-flex-between" style="display:flex;align-items:center;justify-content:space-between;margin-bottom:var(--space-4)">\
    <h3 class="c-fs-lg c-fw-bold c-text-primary" style="margin:0">' + sanitize(title) + '</h3>\
    <button class="c-pointer c-text-tertiary" data-action="features:_closeModal:' + id + '" style="background:none;border:none;font-size:1.5rem;padding:4px;line-height:1">&times;</button>\
  </div>\
  <div id="' + id + '-content">' + contentHtml + '</div>\
</div>';
      document.body.appendChild(modal);
      requestAnimationFrame(function() {
        modal.style.display = 'flex';
      });
      return modal;
    },

    // ==================== STUDY PLANNER ====================

    _plannerGetData: function() {
      var data = store.get('studyPlanner');
      if (!data) {
        data = {
          subjects: [
            { name: 'Mathematics', color: '#3b82f6' },
            { name: 'Physics', color: '#10b981' },
            { name: 'Chemistry', color: '#8b5cf6' },
            { name: 'English', color: '#f59e0b' }
          ],
          days: [
            { label: 'Monday', topics: [] },
            { label: 'Tuesday', topics: [] },
            { label: 'Wednesday', topics: [] },
            { label: 'Thursday', topics: [] },
            { label: 'Friday', topics: [] },
            { label: 'Saturday', topics: [] },
            { label: 'Sunday', topics: [] }
          ]
        };
        store.set('studyPlanner', data);
      }
      return data;
    },

    _plannerSaveData: function(data) {
      store.set('studyPlanner', data);
    },

    openStudyPlanner: function() {
      var data = window.EduFeatures._plannerGetData();
      var html = window.EduFeatures._plannerBuildHTML(data);
      window.EduFeatures._createModal('ef-planner-modal', 'Study Planner', html, 750);
      window.EduFeatures._plannerResetListeners(data);
    },

    _plannerBuildHTML: function(data) {
      var today = new Date();
      var dayIndex = (today.getDay() + 6) % 7;

        var subjectsHtml = '';
        for (var si = 0; si < data.subjects.length; si++) {
          var s = data.subjects[si];
          subjectsHtml += '\
<div class="c-flex-center c-flex-gap-2 c-border c-radius-sm" id="ef-planner-subj-' + si + '" style="padding:var(--space-2);margin-bottom:var(--space-2)">\
  <div class="c-radius-full" style="width:10px;height:10px;background:' + s.color + ';flex-shrink:0"></div>\
  <span class="c-fs-xs c-text-primary" style="flex:1">' + sanitize(s.name) + '</span>\
  <button class="c-pointer c-fs-xs" data-action="features:_plannerRemoveSubject:' + si + '" style="background:none;border:none;color:var(--accent-red);padding:2px 6px">\u2715</button>\
</div>';
      }

      var allocHtml = '';
      for (var si = 0; si < data.subjects.length; si++) {
        var s = data.subjects[si];
        var hours = s.hoursPerWeek || 0;
        allocHtml += '\
<div class="c-flex-center c-flex-gap-2" style="padding:2px 0">\
  <div class="c-radius-full" style="width:10px;height:10px;background:' + s.color + ';flex-shrink:0"></div>\
  <span class="c-fs-xs c-text-secondary" style="flex:1">' + sanitize(s.name) + '</span>\
  <input type="number" min="0" max="40" value="' + hours + '" class="ef-planner-hours-' + si + ' c-fs-xs" data-action="features:_plannerSetHours:' + si + '" style="width:50px;padding:2px 4px;border:1px solid var(--border-color);border-radius:var(--radius-sm);background:var(--bg-secondary);color:var(--text-primary);text-align:center;outline:none">\
  <span class="c-fs-xs c-text-tertiary">hrs/wk</span>\
</div>';
      }

      var daysHtml = '';
      for (var di = 0; di < data.days.length; di++) {
        var day = data.days[di];
        var topicsHtml = '';
        for (var ti = 0; ti < day.topics.length; ti++) {
          var t = day.topics[ti];
          var subj = data.subjects[t.subjectIdx] || { name: 'General', color: '#6b7280' };
          var done = t.completed ? 'line-through' : 'none';
          var op = t.completed ? '0.5' : '1';
          var topicDeco = t.completed ? 'text-decoration:line-through' : '';
          topicsHtml += '\
<div class="c-flex-gap-2 c-radius-sm" style="display:flex;align-items:center;gap:var(--space-2);padding:var(--space-1) var(--space-2);border:1px solid var(--border-light);margin-bottom:var(--space-1);opacity:' + op + '">\
  <input type="checkbox" ' + (t.completed ? 'checked' : '') + ' data-action="features:_plannerToggleTopic:' + di + '|' + ti + '" style="width:14px;height:14px;accent-color:var(--accent-green)">\
  <div class="c-radius-full" style="width:8px;height:8px;background:' + subj.color + ';flex-shrink:0"></div>\
  <span class="c-fs-xs c-text-primary" style="flex:1;' + topicDeco + '">' + sanitize(t.topic || '') + '</span>\
  <span class="c-fs-xs c-text-tertiary">' + (t.duration || 30) + 'm</span>\
  <button class="c-pointer" data-action="features:_plannerRemoveTopic:' + di + '|' + ti + '" style="background:none;border:none;color:var(--accent-red);font-size:10px;padding:2px">\u2715</button>\
</div>';
        }

        if (day.topics.length === 0) {
          topicsHtml = '<div class="c-fs-xs c-text-tertiary c-text-center" style="padding:var(--space-2)">No topics planned</div>';
        }

        var isToday = di === dayIndex;
        var borderCls = isToday ? 'border:1px solid var(--accent-blue);background:rgba(59,130,246,0.05)' : 'border:1px solid var(--border-color)';
        var dayLabel = day.label + (isToday ? ' <span class="c-text-accent c-fw-semibold">\u2022 Today</span>' : '');

        daysHtml += '\
<div class="c-radius-md" style="' + borderCls + ';padding:var(--space-3);margin-bottom:var(--space-2)">\
  <div class="c-flex-between" style="display:flex;align-items:center;justify-content:space-between;margin-bottom:var(--space-2)">\
    <div class="c-fs-sm c-fw-semibold c-text-primary">' + dayLabel + '</div>\
    <div class="c-flex-gap-2" style="display:flex;gap:var(--space-2)">\
      <select id="ef-planner-subj-' + di + '" class="c-fs-xs" style="padding:2px 4px;border:1px solid var(--border-color);border-radius:var(--radius-sm);background:var(--bg-secondary);color:var(--text-primary);outline:none">';
        for (var si = 0; si < data.subjects.length; si++) {
          daysHtml += '<option value="' + si + '">' + sanitize(data.subjects[si].name) + '</option>';
        }
        daysHtml += '\
      </select>\
      <input type="text" placeholder="Topic" id="ef-planner-topic-' + di + '" class="c-fs-xs" style="width:120px;padding:2px 6px;border:1px solid var(--border-color);border-radius:var(--radius-sm);background:var(--bg-secondary);color:var(--text-primary);outline:none">\
      <input type="number" value="30" min="5" max="240" id="ef-planner-dur-' + di + '" class="c-fs-xs" style="width:50px;padding:2px 4px;border:1px solid var(--border-color);border-radius:var(--radius-sm);background:var(--bg-secondary);color:var(--text-primary);text-align:center;outline:none">\
      <button class="c-pointer c-fs-xs c-fw-semibold" data-action="features:_plannerAddTopic:' + di + '" style="padding:2px 8px;border:none;border-radius:var(--radius-sm);color:#fff;background:var(--accent-blue)">+</button>\
    </div>\
  </div>\
  <div>' + topicsHtml + '</div>\
</div>';
      }

      var totalHours = 0;
      for (var si = 0; si < data.subjects.length; si++) {
        totalHours += parseInt(data.subjects[si].hoursPerWeek || 0, 10);
      }

      var nextDay = -1;
      var nextTopic = '';
      for (var di = dayIndex; di < data.days.length; di++) {
        for (var ti = 0; ti < data.days[di].topics.length; ti++) {
          if (!data.days[di].topics[ti].completed) {
            nextDay = di;
            nextTopic = data.days[di].topics[ti].topic || 'next topic';
            break;
          }
        }
        if (nextDay >= 0) break;
      }
      if (nextDay < 0) {
        for (var di = 0; di < dayIndex; di++) {
          for (var ti = 0; ti < data.days[di].topics.length; ti++) {
            if (!data.days[di].topics[ti].completed) {
              nextDay = di;
              nextTopic = data.days[di].topics[ti].topic || 'next topic';
              break;
            }
          }
          if (nextDay >= 0) break;
        }
      }

      var nextHtml = nextDay >= 0 ? '<div class="c-fs-xs c-text-accent" style="margin-top:var(--space-3);padding:var(--space-2);background:rgba(59,130,246,0.1);border-radius:var(--radius-sm)">Next suggested session: <strong>' + sanitize(nextTopic) + '</strong> on <strong>' + data.days[nextDay].label + '</strong></div>' : '<div class="c-fs-xs c-text-success" style="margin-top:var(--space-3);padding:var(--space-2);background:rgba(16,185,129,0.1);border-radius:var(--radius-sm)">All topics completed! Great work!</div>';

      return '\
<div class="c-flex-gap-3" style="display:flex;flex-direction:column;gap:var(--space-4)">\
  <div>\
    <div class="c-flex-between" style="display:flex;justify-content:space-between;align-items:center;margin-bottom:var(--space-2)">\
      <h4 class="c-fs-sm c-fw-semibold c-text-primary" style="margin:0">Subjects</h4>\
      <button class="c-pointer c-fs-xs c-text-secondary" data-action="features:_plannerAddSubject" style="padding:2px 10px;border:1px dashed var(--border-color);border-radius:var(--radius-sm);background:transparent">+ Add Subject</button>\
    </div>\
    <div id="ef-planner-subjects">' + subjectsHtml + '</div>\
  </div>\
  <div>\
    <div class="c-flex-between" style="display:flex;justify-content:space-between;align-items:center;margin-bottom:var(--space-2)">\
      <h4 class="c-fs-sm c-fw-semibold c-text-primary" style="margin:0">Time Allocation</h4>\
      <span class="c-fs-xs c-text-tertiary">Total: ' + totalHours + ' hrs/wk</span>\
    </div>\
    <div class="c-bg-glass c-radius-sm" style="padding:var(--space-2)">' + allocHtml + '</div>\
  </div>\
  <div>\
    <div class="c-flex-between" style="display:flex;justify-content:space-between;align-items:center;margin-bottom:var(--space-2)">\
      <h4 class="c-fs-sm c-fw-semibold c-text-primary" style="margin:0">Weekly Plan</h4>\
      <button class="c-pointer c-fs-xs c-fw-semibold" data-action="features:_plannerAutoGenerate" style="padding:2px 10px;border:none;border-radius:var(--radius-sm);color:#fff;background:var(--accent-green)">Auto-Generate</button>\
    </div>\
    <div>' + daysHtml + '</div>\
  </div>\
  ' + nextHtml + '\
</div>';
    },

    _plannerResetListeners: function(data) {
      document.getElementById('ef-planner-subjects');
    },

    _plannerAddSubject: function() {
      var data = window.EduFeatures._plannerGetData();
      var colors = ['#3b82f6', '#10b981', '#8b5cf6', '#f59e0b', '#ec4899', '#06b6d4', '#f97316', '#6b7280'];
      var name = prompt('Enter subject name:');
      if (!name || name.trim() === '') return;
      data.subjects.push({ name: name.trim(), color: colors[data.subjects.length % colors.length], hoursPerWeek: 2 });
      window.EduFeatures._plannerSaveData(data);
      window.EduFeatures.openStudyPlanner();
    },

    _plannerRemoveSubject: function(idx) {
      var data = window.EduFeatures._plannerGetData();
      if (data.subjects.length <= 1) {
        window.EduFeatures.showToast('Need at least one subject', 'warning');
        return;
      }
      data.subjects.splice(idx, 1);
      for (var di = 0; di < data.days.length; di++) {
        var newTopics = [];
        for (var ti = 0; ti < data.days[di].topics.length; ti++) {
          var t = data.days[di].topics[ti];
          if (t.subjectIdx < idx) {
            newTopics.push(t);
          } else if (t.subjectIdx > idx) {
            t.subjectIdx--;
            newTopics.push(t);
          }
        }
        data.days[di].topics = newTopics;
      }
      window.EduFeatures._plannerSaveData(data);
      window.EduFeatures.openStudyPlanner();
    },

    _plannerSetHours: function(idx, val) {
      var data = window.EduFeatures._plannerGetData();
      data.subjects[idx].hoursPerWeek = Math.max(0, parseInt(val, 10) || 0);
      window.EduFeatures._plannerSaveData(data);
    },

    _plannerAddTopic: function(dayIdx) {
      var data = window.EduFeatures._plannerGetData();
      var subjSelect = document.getElementById('ef-planner-subj-' + dayIdx);
      var topicInput = document.getElementById('ef-planner-topic-' + dayIdx);
      var durInput = document.getElementById('ef-planner-dur-' + dayIdx);
      if (!topicInput || !topicInput.value.trim()) {
        window.EduFeatures.showToast('Enter a topic name', 'warning');
        return;
      }
      data.days[dayIdx].topics.push({
        id: 't_' + Date.now(),
        subjectIdx: parseInt(subjSelect.value, 10),
        topic: topicInput.value.trim(),
        duration: parseInt(durInput.value, 10) || 30,
        completed: false
      });
      window.EduFeatures._plannerSaveData(data);
      window.EduFeatures.openStudyPlanner();
    },

    _plannerToggleTopic: function(dayIdx, topicIdx) {
      var data = window.EduFeatures._plannerGetData();
      data.days[dayIdx].topics[topicIdx].completed = !data.days[dayIdx].topics[topicIdx].completed;
      window.EduFeatures._plannerSaveData(data);
      window.EduFeatures.openStudyPlanner();
    },

    _plannerRemoveTopic: function(dayIdx, topicIdx) {
      var data = window.EduFeatures._plannerGetData();
      data.days[dayIdx].topics.splice(topicIdx, 1);
      window.EduFeatures._plannerSaveData(data);
      window.EduFeatures.openStudyPlanner();
    },

    _plannerAutoGenerate: function() {
      var data = window.EduFeatures._plannerGetData();
      for (var di = 0; di < data.days.length; di++) {
        data.days[di].topics = [];
      }
      var totalSlots = 0;
      for (var si = 0; si < data.subjects.length; si++) {
        totalSlots += parseInt(data.subjects[si].hoursPerWeek || 2, 10);
      }
      totalSlots = Math.max(totalSlots, 1);
      var slotIdx = 0;
      for (var si = 0; si < data.subjects.length; si++) {
        var hours = parseInt(data.subjects[si].hoursPerWeek || 2, 10);
        for (var hi = 0; hi < hours; hi++) {
          var dayIdx = slotIdx % 7;
          if (dayIdx > 4 && hours <= 3) {
            for (var rdi = 0; rdi < 5; rdi++) {
              if (data.days[rdi].topics.length <= data.days[dayIdx].topics.length) {
                dayIdx = rdi;
                break;
              }
            }
          }
          data.days[dayIdx].topics.push({
            id: 't_' + Date.now() + '_' + slotIdx,
            subjectIdx: si,
            topic: data.subjects[si].name + ' Session ' + (hi + 1),
            duration: 60,
            completed: false
          });
          slotIdx++;
        }
      }
      window.EduFeatures._plannerSaveData(data);
      window.EduFeatures.openStudyPlanner();
      window.EduFeatures.showToast('Weekly plan generated!', 'success');
    },

    // ==================== TODO LIST (ADVANCED) ====================

    _todoGetData: function() {
      var data = store.get('todoList');
      if (!data) {
        data = { tasks: [], nextOrder: 0 };
        store.set('todoList', data);
      }
      return data;
    },

    _todoSaveData: function(data) {
      store.set('todoList', data);
    },

    openTodoList: function() {
      var data = window.EduFeatures._todoGetData();
      var html = window.EduFeatures._todoBuildHTML(data, 'all');
      window.EduFeatures._createModal('ef-todo-modal', 'Todo List', html, 650);
      window.EduFeatures._todoAttachFilter(data);
    },

    _todoBuildHTML: function(data, filter) {
      var filterKey = filter || 'all';
      var tasks = data.tasks.slice();

      var filtered = [];
      var today = todayStr();
      var now = new Date();
      var weekEnd = new Date(now);
      weekEnd.setDate(weekEnd.getDate() + (7 - now.getDay()));

      for (var ti = 0; ti < tasks.length; ti++) {
        var t = tasks[ti];
        if (filterKey === 'completed' && !t.completed) continue;
        if (filterKey === 'today') {
          var due = t.dueDate || '';
          if (due !== today && !t.completed) continue;
          if (t.completed && filterKey !== 'completed') continue;
        }
        if (filterKey === 'week') {
          var dueStr = t.dueDate || '';
          if (dueStr && (dueStr < today || dueStr > weekEnd.toISOString().slice(0, 10))) continue;
          if (!dueStr) continue;
        }
        if (filterKey === 'overdue') {
          if (t.completed) continue;
          if (!t.dueDate || t.dueDate >= today) continue;
        }
        filtered.push(t);
      }

      var sortKey = store.get('todoSortKey') || 'order';
      filtered.sort(function(a, b) {
        if (sortKey === 'priority') {
          var p = { High: 0, Med: 1, Low: 2 };
          return (p[a.priority] || 1) - (p[b.priority] || 1);
        }
        if (sortKey === 'date') {
          var da = a.dueDate || '9999-99-99';
          var db = b.dueDate || '9999-99-99';
          return da < db ? -1 : da > db ? 1 : 0;
        }
        if (sortKey === 'category') {
          return (a.category || '').localeCompare(b.category || '');
        }
        return (a.order || 0) - (b.order || 0);
      });

      var filters = ['all', 'today', 'week', 'overdue', 'completed'];
      var filterLabels = { all: 'All', today: 'Today', week: 'This Week', overdue: 'Overdue', completed: 'Completed' };
        var filterHtml = '';
        for (var fi = 0; fi < filters.length; fi++) {
          var fk = filters[fi];
          var activeCls = fk === filterKey ? ' c-bg-accent c-text-primary' : ' c-text-secondary';
          var fwCls = fk === filterKey ? ' c-fw-semibold' : '';
          filterHtml += '\
<button class="c-radius-sm c-pointer c-fs-xs' + activeCls + fwCls + '" data-action="features:_todoSetFilter:' + fk + '" style="padding:var(--space-1) var(--space-3);border:1px solid;background:transparent;border-color:var(--border-color)">' + filterLabels[fk] + '</button>';
        }

        var sortOpts = ['order', 'priority', 'date', 'category'];
        var sortLabels = { order: 'Order', priority: 'Priority', date: 'Date', category: 'Category' };
        var sortHtml = '';
        for (var si = 0; si < sortOpts.length; si++) {
          var sk = sortOpts[si];
          var actCls = sk === sortKey ? ' c-text-accent c-fw-semibold' : ' c-text-tertiary';
          sortHtml += '\
<button class="c-pointer c-fs-xs' + actCls + '" data-action="features:_todoSetSort:' + sk + '" style="background:none;border:none">' + sortLabels[sk] + '</button>';
        }

      var taskHtml = '';
      var completedCount = 0;
      for (var ti = 0; ti < filtered.length; ti++) {
        var t = filtered[ti];
        if (t.completed) completedCount++;
        var priColors = { High: '#ef4444', Med: '#f59e0b', Low: '#6b7280' };
        var pColor = priColors[t.priority] || '#6b7280';
        var done = t.completed ? 'line-through' : 'none';
        var op = t.completed ? '0.5' : '1';
        var dueStr = t.dueDate ? utils.formatDate(t.dueDate, 'dd mmm') : '';
        var overdue = t.dueDate && t.dueDate < today && !t.completed;
        var dueColor = overdue ? 'var(--accent-red)' : 'var(--text-tertiary)';

        var titleStyle = t.completed ? 'text-decoration:line-through' : '';
        taskHtml += '\
<div class="c-flex-gap-2 c-radius-sm" style="display:flex;align-items:center;gap:var(--space-2);padding:var(--space-2);border:1px solid var(--border-light);margin-bottom:var(--space-1);opacity:' + op + '">\
  <input type="checkbox" ' + (t.completed ? 'checked' : '') + ' data-action="features:_todoToggle:' + t.id + '" style="width:16px;height:16px;accent-color:var(--accent-green)">\
  <div style="width:4px;height:24px;border-radius:2px;background:' + pColor + ';flex-shrink:0"></div>\
  <div style="flex:1;min-width:0">\
    <div class="c-fs-sm c-text-primary c-nowrap c-ellipsis" style="' + titleStyle + '">' + sanitize(t.title) + '</div>\
    <div class="c-flex-gap-2 c-fs-xs c-text-tertiary" style="display:flex;gap:var(--space-2)">\
      <span>' + sanitize(t.category || '') + '</span>\
      <span style="color:' + dueColor + '">' + sanitize(dueStr) + '</span>\
      ' + (t.tags ? '<span>' + sanitize(t.tags) + '</span>' : '') + '\
    </div>\
  </div>\
  <div class="c-flex-gap-2" style="display:flex;gap:var(--space-1)">\
    <button class="c-pointer c-text-tertiary" data-action="features:_todoMove:' + t.id + '|-1" style="background:none;border:none;font-size:12px;padding:2px">\u25b2</button>\
    <button class="c-pointer c-text-tertiary" data-action="features:_todoMove:' + t.id + '|1" style="background:none;border:none;font-size:12px;padding:2px">\u25bc</button>\
  </div>\
  <button class="c-pointer c-fs-xs" data-action="features:_todoDelete:' + t.id + '" style="background:none;border:none;color:var(--accent-red);padding:2px 6px">\u2715</button>\
</div>';
      }

      if (filtered.length === 0) {
        taskHtml = '<div class="c-text-center c-fs-sm c-text-tertiary" style="padding:var(--space-6)">No tasks yet. Create your first task!</div>';
      }

      var total = filtered.length;
      var pct = total > 0 ? Math.round((completedCount / total) * 100) : 0;

      return '\
<div class="c-flex-gap-3" style="display:flex;flex-direction:column;gap:var(--space-3)">\
  <div class="c-flex-gap-2 c-flex-wrap" style="display:flex;gap:var(--space-2);flex-wrap:wrap">\
    <input type="text" id="ef-todo-input" placeholder="Add a task..." class="c-fs-sm" data-action="features:_todoAdd" style="flex:1;min-width:150px;padding:var(--space-2) var(--space-3);border:1px solid var(--border-color);border-radius:var(--radius-sm);background:var(--bg-secondary);color:var(--text-primary);outline:none">\
    <select id="ef-todo-priority" class="c-fs-xs" style="padding:var(--space-2);border:1px solid var(--border-color);border-radius:var(--radius-sm);background:var(--bg-secondary);color:var(--text-primary);outline:none">\
      <option value="Med">Med</option>\
      <option value="High">High</option>\
      <option value="Low">Low</option>\
    </select>\
    <input type="date" id="ef-todo-date" class="c-fs-xs" style="padding:var(--space-2);border:1px solid var(--border-color);border-radius:var(--radius-sm);background:var(--bg-secondary);color:var(--text-primary);outline:none">\
    <select id="ef-todo-category" class="c-fs-xs" style="padding:var(--space-2);border:1px solid var(--border-color);border-radius:var(--radius-sm);background:var(--bg-secondary);color:var(--text-primary);outline:none">\
      <option value="Study">Study</option>\
      <option value="Personal">Personal</option>\
      <option value="Work">Work</option>\
    </select>\
    <input type="text" id="ef-todo-tags" placeholder="tags" class="c-fs-xs" style="width:80px;padding:var(--space-2);border:1px solid var(--border-color);border-radius:var(--radius-sm);background:var(--bg-secondary);color:var(--text-primary);outline:none">\
    <button class="c-pointer c-fw-semibold c-fs-sm" data-action="features:_todoAdd" style="padding:var(--space-2) var(--space-4);border:none;border-radius:var(--radius-sm);color:#fff;background:var(--accent-blue)">Add</button>\
  </div>\
  <div class="c-flex-between c-flex-wrap" style="display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:var(--space-2)">\
    <div class="c-flex-gap-2 c-flex-wrap" style="display:flex;gap:var(--space-1);flex-wrap:wrap">' + filterHtml + '</div>\
    <div class="c-flex-gap-2" style="display:flex;gap:var(--space-2);align-items:center">\
      <span class="c-fs-xs c-text-tertiary">Sort:</span>\
      <div class="c-flex-gap-2" style="display:flex;gap:var(--space-1)">' + sortHtml + '</div>\
    </div>\
  </div>\
  <div class="c-bg-glass c-radius-sm c-flex-between" style="padding:var(--space-2) var(--space-3)">\
    <span class="c-fs-xs c-text-secondary">' + completedCount + ' of ' + total + ' tasks completed</span>\
    <div class="c-flex-gap-2" style="display:flex;align-items:center;gap:var(--space-2);flex:1;max-width:200px">\
      <div class="progress-bar" style="height:6px;flex:1"><div class="progress-bar-fill progress-fill-green" style="width:' + pct + '%"></div></div>\
      <span class="c-fs-xs c-text-tertiary">' + pct + '%</span>\
    </div>\
    <div class="c-flex-gap-2" style="display:flex;gap:var(--space-2)">\
      <button class="c-pointer c-fs-xs c-text-secondary" data-action="features:_todoBatchComplete" style="padding:2px 8px;border:1px solid var(--border-color);border-radius:var(--radius-sm);background:transparent">\u2705 All</button>\
      <button class="c-pointer c-fs-xs c-text-danger" data-action="features:_todoBatchDelete" style="padding:2px 8px;border:1px solid var(--accent-red);border-radius:var(--radius-sm);background:transparent">\u2715 All</button>\
    </div>\
  </div>\
  <div class="c-scroll-y" style="max-height:400px">' + taskHtml + '</div>\
</div>';
    },

    _todoAttachFilter: function(data) {
    },

    _todoSetFilter: function(filter) {
      store.set('todoFilter', filter);
      window.EduFeatures.openTodoList();
    },

    _todoSetSort: function(sortKey) {
      store.set('todoSortKey', sortKey);
      window.EduFeatures.openTodoList();
    },

    _todoAdd: function() {
      var input = document.getElementById('ef-todo-input');
      var priSelect = document.getElementById('ef-todo-priority');
      var dateInput = document.getElementById('ef-todo-date');
      var catSelect = document.getElementById('ef-todo-category');
      var tagsInput = document.getElementById('ef-todo-tags');
      if (!input || !input.value.trim()) {
        window.EduFeatures.showToast('Enter a task title', 'warning');
        return;
      }
      var data = window.EduFeatures._todoGetData();
      data.tasks.push({
        id: 'td_' + Date.now(),
        title: input.value.trim(),
        priority: priSelect ? priSelect.value : 'Med',
        dueDate: dateInput ? dateInput.value : '',
        category: catSelect ? catSelect.value : 'Study',
        tags: tagsInput && tagsInput.value ? tagsInput.value.trim() : '',
        completed: false,
        createdAt: new Date().toISOString(),
        order: data.nextOrder++
      });
      window.EduFeatures._todoSaveData(data);
      if (input) input.value = '';
      if (tagsInput) tagsInput.value = '';
      window.EduFeatures.openTodoList();
      window.EduFeatures.showToast('Task added!', 'success');
    },

    _todoToggle: function(id) {
      var data = window.EduFeatures._todoGetData();
      for (var ti = 0; ti < data.tasks.length; ti++) {
        if (data.tasks[ti].id === id) {
          data.tasks[ti].completed = !data.tasks[ti].completed;
          break;
        }
      }
      window.EduFeatures._todoSaveData(data);
      window.EduFeatures.openTodoList();
    },

    _todoDelete: function(id) {
      var data = window.EduFeatures._todoGetData();
      data.tasks = data.tasks.filter(function(t) { return t.id !== id; });
      window.EduFeatures._todoSaveData(data);
      window.EduFeatures.openTodoList();
    },

    _todoMove: function(id, dir) {
      var data = window.EduFeatures._todoGetData();
      for (var ti = 0; ti < data.tasks.length; ti++) {
        if (data.tasks[ti].id === id) {
          var swap = ti + dir;
          if (swap < 0 || swap >= data.tasks.length) return;
          var temp = data.tasks[ti].order;
          data.tasks[ti].order = data.tasks[swap].order;
          data.tasks[swap].order = temp;
          break;
        }
      }
      window.EduFeatures._todoSaveData(data);
      window.EduFeatures.openTodoList();
    },

    _todoBatchComplete: function() {
      var filter = store.get('todoFilter') || 'all';
      var data = window.EduFeatures._todoGetData();
      for (var ti = 0; ti < data.tasks.length; ti++) {
        var t = data.tasks[ti];
        if (filter === 'all' || filter === 'today' && t.dueDate === todayStr() || filter === 'overdue' && t.dueDate && t.dueDate < todayStr() || filter === 'week') {
          if (!t.completed) t.completed = true;
        }
      }
      window.EduFeatures._todoSaveData(data);
      window.EduFeatures.openTodoList();
      window.EduFeatures.showToast('Visible tasks completed!', 'success');
    },

    _todoBatchDelete: function() {
      if (!confirm('Delete all visible tasks?')) return;
      var filter = store.get('todoFilter') || 'all';
      var data = window.EduFeatures._todoGetData();
      data.tasks = data.tasks.filter(function(t) {
        if (filter === 'all') return false;
        if (filter === 'today') return t.dueDate !== todayStr();
        if (filter === 'overdue') return !(t.dueDate && t.dueDate < todayStr());
        if (filter === 'completed') return !t.completed;
        if (filter === 'week') {
          var now = new Date();
          var weekEnd = new Date(now);
          weekEnd.setDate(weekEnd.getDate() + (7 - now.getDay()));
          var we = weekEnd.toISOString().slice(0, 10);
          return !(t.dueDate && t.dueDate >= todayStr() && t.dueDate <= we);
        }
        return true;
      });
      window.EduFeatures._todoSaveData(data);
      window.EduFeatures.openTodoList();
      window.EduFeatures.showToast('Tasks deleted!', 'success');
    },

    // ==================== HABIT TRACKER ====================

    _habitGetData: function() {
      var data = store.get('habitTracker');
      if (!data) {
        var presets = [
          { id: 'hb_study', name: 'Study 2 hours', preset: true, streak: 0, bestStreak: 0, log: {} },
          { id: 'hb_quiz', name: 'Complete quiz', preset: true, streak: 0, bestStreak: 0, log: {} },
          { id: 'hb_read', name: 'Read book', preset: true, streak: 0, bestStreak: 0, log: {} },
          { id: 'hb_exercise', name: 'Exercise', preset: true, streak: 0, bestStreak: 0, log: {} },
          { id: 'hb_meditate', name: 'Meditate', preset: true, streak: 0, bestStreak: 0, log: {} },
          { id: 'hb_sleep', name: 'Sleep 8 hours', preset: true, streak: 0, bestStreak: 0, log: {} }
        ];
        data = { habits: presets };
        store.set('habitTracker', data);
      }
      return data;
    },

    _habitSaveData: function(data) {
      store.set('habitTracker', data);
    },

    _habitRecalcStreak: function(habit) {
      var today = todayStr();
      var d = new Date();
      var streak = 0;
      var maxStreak = habit.bestStreak || 0;
      var currentStreak = 0;
      var inCurrent = true;
      for (var i = 365; i >= 0; i--) {
        var check = new Date(d);
        check.setDate(check.getDate() - i);
        var key = check.getFullYear() + '-' + pad(check.getMonth() + 1) + '-' + pad(check.getDate());
        if (key > today) continue;
        if (habit.log[key]) {
          if (inCurrent) currentStreak++;
          streak++;
          if (streak > maxStreak) maxStreak = streak;
        } else {
          if (inCurrent) inCurrent = false;
          streak = 0;
        }
      }
      habit.streak = currentStreak;
      habit.bestStreak = Math.max(maxStreak, currentStreak);
    },

    openHabitTracker: function() {
      var data = window.EduFeatures._habitGetData();
      var html = window.EduFeatures._habitBuildHTML(data);
      window.EduFeatures._createModal('ef-habit-modal', 'Habit Tracker', html, 700);
    },

    _habitBuildHTML: function(data) {
      var today = todayStr();
      var doneToday = 0;

      var habitHtml = '';
      for (var hi = 0; hi < data.habits.length; hi++) {
        var h = data.habits[hi];
        window.EduFeatures._habitRecalcStreak(h);

        var checked = h.log[today] ? 'checked' : '';
        if (h.log[today]) doneToday++;

        var daysHtml = '';
        var d = new Date();
        for (var i = 6; i >= 0; i--) {
          var check = new Date(d);
          check.setDate(check.getDate() - i);
          var key = check.getFullYear() + '-' + pad(check.getMonth() + 1) + '-' + pad(check.getDate());
          var filled = h.log[key] ? 'background:var(--accent-green);border-color:var(--accent-green)' : 'background:var(--bg-glass);border-color:var(--border-color)';
          daysHtml += '\
<div style="width:24px;height:24px;border-radius:4px;border:1px solid;' + filled + '"></div>';
        }

        habitHtml += '\
<div class="c-border c-radius-md" style="padding:var(--space-3);margin-bottom:var(--space-2)">\
  <div class="c-flex-gap-3" style="display:flex;align-items:center;gap:var(--space-3)">\
    <input type="checkbox" ' + checked + ' data-action="features:_habitToggle:' + h.id + '" style="width:18px;height:18px;accent-color:var(--accent-green)">\
    <div style="flex:1">\
      <div class="c-fs-sm c-fw-medium c-text-primary">' + sanitize(h.name) + '</div>\
      <div class="c-flex-gap-3 c-fs-xs c-text-tertiary" style="display:flex;gap:var(--space-3);margin-top:2px">\
        <span>Current streak: <strong class="c-text-success">' + h.streak + '</strong></span>\
        <span>Best: <strong class="c-text-accent">' + h.bestStreak + '</strong></span>\
      </div>\
    </div>\
    ' + (h.preset ? '' : '<button class="c-pointer c-fs-xs" data-action="features:_habitDelete:' + h.id + '" style="background:none;border:none;color:var(--accent-red);padding:2px 6px">\u2715</button>') + '\
  </div>\
  <div class="c-flex-gap-2" style="display:flex;gap:var(--space-1);margin-top:var(--space-2)">' + daysHtml + '</div>\
</div>';
      }

      var pct = data.habits.length > 0 ? Math.round((doneToday / data.habits.length) * 100) : 0;

      return '\
<div class="c-flex-gap-3" style="display:flex;flex-direction:column;gap:var(--space-3)">\
  <div class="c-flex-between" style="display:flex;align-items:center;justify-content:space-between">\
    <div class="c-fs-sm c-text-secondary">Today\'s completion: <strong>' + doneToday + '/' + data.habits.length + ' habits (' + pct + '%)</strong></div>\
    <div class="c-flex-gap-2" style="display:flex;align-items:center;gap:var(--space-2)">\
      <div class="progress-bar" style="height:6px;width:120px"><div class="progress-bar-fill progress-fill-green" style="width:' + pct + '%"></div></div>\
      <button class="c-pointer c-fs-xs c-fw-semibold" data-action="features:_habitShowAdd" style="padding:2px 10px;border:none;border-radius:var(--radius-sm);color:#fff;background:var(--accent-blue)">+ Custom</button>\
    </div>\
  </div>\
  <div class="c-bg-glass c-radius-sm c-flex-gap-2" style="display:flex;gap:var(--space-2);align-items:center;padding:var(--space-2)">\
    <span class="c-fs-xs c-text-tertiary">Last 7 days:</span>\
  </div>\
  <div>' + habitHtml + '</div>\
</div>';
    },

    _habitToggle: function(id) {
      var data = window.EduFeatures._habitGetData();
      var today = todayStr();
      for (var hi = 0; hi < data.habits.length; hi++) {
        if (data.habits[hi].id === id) {
          if (data.habits[hi].log[today]) {
            delete data.habits[hi].log[today];
          } else {
            data.habits[hi].log[today] = true;
          }
          window.EduFeatures._habitRecalcStreak(data.habits[hi]);
          break;
        }
      }
      window.EduFeatures._habitSaveData(data);
      window.EduFeatures.openHabitTracker();
    },

    _habitShowAdd: function() {
      var name = prompt('Enter custom habit name:');
      if (!name || name.trim() === '') return;
      var data = window.EduFeatures._habitGetData();
      data.habits.push({
        id: 'hb_custom_' + Date.now(),
        name: name.trim(),
        preset: false,
        streak: 0,
        bestStreak: 0,
        log: {}
      });
      window.EduFeatures._habitSaveData(data);
      window.EduFeatures.openHabitTracker();
    },

    _habitDelete: function(id) {
      var data = window.EduFeatures._habitGetData();
      data.habits = data.habits.filter(function(h) { return h.id !== id; });
      window.EduFeatures._habitSaveData(data);
      window.EduFeatures.openHabitTracker();
    },

    // ==================== STICKY NOTES ====================

    _stickyGetData: function() {
      var data = store.get('stickyNotes');
      if (!data) {
        data = { notes: [], maxZ: 1 };
        store.set('stickyNotes', data);
      }
      return data;
    },

    _stickySaveData: function(data) {
      store.set('stickyNotes', data);
    },

    openStickyNotes: function() {
      var data = window.EduFeatures._stickyGetData();
      var html = window.EduFeatures._stickyBuildHTML(data);
      window.EduFeatures._createModal('ef-sticky-modal', 'Sticky Notes', html, 750);
    },

    _stickyBuildHTML: function(data) {
      var noteHtml = '';
      for (var ni = 0; ni < data.notes.length; ni++) {
        var n = data.notes[ni];
        var colors = {
          yellow: { bg: '#fef3c7', text: '#92400e', border: '#f59e0b' },
          blue: { bg: '#dbeafe', text: '#1e40af', border: '#3b82f6' },
          green: { bg: '#d1fae5', text: '#065f46', border: '#10b981' },
          pink: { bg: '#fce7f3', text: '#9d174d', border: '#ec4899' },
          purple: { bg: '#ede9fe', text: '#5b21b6', border: '#8b5cf6' }
        };
        var c = colors[n.color] || colors.yellow;
        var pinIcon = n.pinned ? '\ud83d\udccc' : '';
        var zIdx = 10 + (n.zIndex || 0);

        noteHtml += '\
<div id="ef-sticky-' + n.id + '" class="c-relative c-radius-md" style="background:' + c.bg + ';border:1px solid ' + c.border + ';padding:0;margin-bottom:var(--space-2);width:100%;z-index:' + zIdx + '">\
  <div class="c-flex-between" style="display:flex;align-items:center;justify-content:space-between;padding:var(--space-1) var(--space-2);background:' + c.border + '22;border-bottom:1px solid ' + c.border + '44;cursor:move" onmousedown="window.EduFeatures._stickyStartDrag(event,\'' + n.id + '\')">\
    <div class="c-flex-gap-2" style="display:flex;align-items:center;gap:var(--space-1)">\
      <span style="font-size:12px">' + pinIcon + '</span>\
      <span class="c-fs-xs c-fw-medium" style="color:' + c.text + '">Note</span>\
    </div>\
    <div class="c-flex-gap-2" style="display:flex;gap:var(--space-1)">\
      <button class="c-pointer" data-action="features:_stickyTogglePin:' + n.id + '" title="Pin/Unpin" style="background:none;border:none;font-size:12px;color:' + c.text + ';padding:2px">' + (n.pinned ? '\ud83d\udccc' : '\ud83d\udccd') + '</button>\
      <button class="c-pointer" data-action="features:_stickyCycleColor:' + n.id + '" title="Change color" style="background:none;border:none;font-size:12px;color:' + c.text + ';padding:2px">\ud83c\udfa8</button>\
      <button class="c-pointer" data-action="features:_stickyDelete:' + n.id + '" title="Delete" style="background:none;border:none;font-size:12px;color:' + c.text + ';padding:2px">\u2715</button>\
    </div>\
  </div>\
  <textarea class="c-fs-sm" data-action="features:_stickySaveContent:' + n.id + '" style="width:100%;min-height:60px;padding:var(--space-2);border:none;background:transparent;color:' + c.text + ';resize:vertical;outline:none;font-family:inherit">' + sanitize(n.content) + '</textarea>\
</div>';
      }

      if (data.notes.length === 0) {
        noteHtml = '<div class="c-text-center c-fs-sm c-text-tertiary" style="padding:var(--space-6)">No sticky notes yet. Create one!</div>';
      }

      var colorOpts = ['yellow', 'blue', 'green', 'pink', 'purple'];
      var colorButtons = '';
      for (var ci = 0; ci < colorOpts.length; ci++) {
        var cl = colorOpts[ci];
        var cols = { yellow: '#fef3c7', blue: '#dbeafe', green: '#d1fae5', pink: '#fce7f3', purple: '#ede9fe' };
        colorButtons += '\
<button class="c-radius-full c-pointer" data-action="features:_stickyAdd:' + cl + '" style="width:24px;height:24px;border:2px solid var(--border-color);background:' + cols[cl] + ';padding:0"></button>';
      }

      return '\
<div class="c-flex-gap-3" style="display:flex;flex-direction:column;gap:var(--space-3)">\
  <div class="c-flex-between" style="display:flex;align-items:center;justify-content:space-between">\
    <div class="c-flex-gap-2" style="display:flex;align-items:center;gap:var(--space-2)">\
      <span class="c-fs-sm c-text-secondary">New note:</span>\
      ' + colorButtons + '\
    </div>\
    <span class="c-fs-xs c-text-tertiary">' + data.notes.length + ' notes</span>\
  </div>\
  <div id="ef-sticky-container" style="min-height:300px">' + noteHtml + '</div>\
</div>';
    },

    _stickyAdd: function(color) {
      var data = window.EduFeatures._stickyGetData();
      data.maxZ++;
      data.notes.push({
        id: 'sn_' + Date.now(),
        content: 'New note...',
        color: color || 'yellow',
        x: 0,
        y: 0,
        width: 250,
        pinned: false,
        zIndex: data.maxZ
      });
      window.EduFeatures._stickySaveData(data);
      window.EduFeatures.openStickyNotes();
    },

    _stickyDelete: function(id) {
      var data = window.EduFeatures._stickyGetData();
      var el = document.getElementById('ef-sticky-' + id);
      if (el) {
        el.style.transition = 'all 0.3s ease';
        el.style.transform = 'scale(0)';
        el.style.opacity = '0';
        setTimeout(function() {
          data.notes = data.notes.filter(function(n) { return n.id !== id; });
          window.EduFeatures._stickySaveData(data);
          window.EduFeatures.openStickyNotes();
        }, 300);
      } else {
        data.notes = data.notes.filter(function(n) { return n.id !== id; });
        window.EduFeatures._stickySaveData(data);
        window.EduFeatures.openStickyNotes();
      }
    },

    _stickySaveContent: function(id, val) {
      var data = window.EduFeatures._stickyGetData();
      for (var ni = 0; ni < data.notes.length; ni++) {
        if (data.notes[ni].id === id) {
          data.notes[ni].content = val;
          break;
        }
      }
      window.EduFeatures._stickySaveData(data);
    },

    _stickyTogglePin: function(id) {
      var data = window.EduFeatures._stickyGetData();
      for (var ni = 0; ni < data.notes.length; ni++) {
        if (data.notes[ni].id === id) {
          data.notes[ni].pinned = !data.notes[ni].pinned;
          if (data.notes[ni].pinned) {
            data.maxZ++;
            data.notes[ni].zIndex = data.maxZ;
          }
          break;
        }
      }
      window.EduFeatures._stickySaveData(data);
      window.EduFeatures.openStickyNotes();
    },

    _stickyCycleColor: function(id) {
      var colors = ['yellow', 'blue', 'green', 'pink', 'purple'];
      var data = window.EduFeatures._stickyGetData();
      for (var ni = 0; ni < data.notes.length; ni++) {
        if (data.notes[ni].id === id) {
          var idx = colors.indexOf(data.notes[ni].color);
          data.notes[ni].color = colors[(idx + 1) % colors.length];
          break;
        }
      }
      window.EduFeatures._stickySaveData(data);
      window.EduFeatures.openStickyNotes();
    },

    _stickyStartDrag: function(e, id) {
      var el = document.getElementById('ef-sticky-' + id);
      if (!el) return;
      var rect = el.getBoundingClientRect();
      var offsetX = e.clientX - rect.left;
      var offsetY = e.clientY - rect.top;
      var data = window.EduFeatures._stickyGetData();
      for (var ni = 0; ni < data.notes.length; ni++) {
        if (data.notes[ni].id === id) {
          data.maxZ++;
          data.notes[ni].zIndex = data.maxZ;
          break;
        }
      }
      window.EduFeatures._stickySaveData(data);
      el.style.zIndex = 9999 + data.maxZ;
      el.style.position = 'relative';

      function onMouseMove(ev) {
        var parent = el.parentNode;
        if (!parent) return;
        var parentRect = parent.getBoundingClientRect();
        var newX = ev.clientX - parentRect.left - offsetX;
        var newY = ev.clientY - parentRect.top - offsetY;
        el.style.left = Math.max(0, newX) + 'px';
        el.style.top = Math.max(0, newY) + 'px';
      }

      function onMouseUp() {
        document.removeEventListener('mousemove', onMouseMove);
        document.removeEventListener('mouseup', onMouseUp);
        var data = window.EduFeatures._stickyGetData();
        for (var ni = 0; ni < data.notes.length; ni++) {
          if (data.notes[ni].id === id) {
            data.notes[ni].x = parseInt(el.style.left, 10) || 0;
            data.notes[ni].y = parseInt(el.style.top, 10) || 0;
            break;
          }
        }
        window.EduFeatures._stickySaveData(data);
      }

      document.addEventListener('mousemove', onMouseMove);
      document.addEventListener('mouseup', onMouseUp);
      e.preventDefault();
    },

    // ==================== STUDY TIMER (ADVANCED) ====================

    _advTimerGetData: function() {
      var data = store.get('advStudyTimer');
      if (!data) {
        data = { sessions: [], totalToday: 0 };
        store.set('advStudyTimer', data);
      }
      return data;
    },

    _advTimerSaveData: function(data) {
      store.set('advStudyTimer', data);
    },

    openStudyTimer: function() {
      var data = window.EduFeatures._advTimerGetData();
      var html = window.EduFeatures._advTimerBuildHTML(data);
      window.EduFeatures._createModal('ef-advtimer-modal', 'Study Timer', html, 550);
    },

    _advTimerBuildHTML: function(data) {
      var today = todayStr();
      var todayTotal = 0;
      for (var si = 0; si < data.sessions.length; si++) {
        if (data.sessions[si].date === today) {
          todayTotal += data.sessions[si].duration;
        }
      }

      var timers = [
        { label: '15 min', value: 15 },
        { label: '30 min', value: 30 },
        { label: '45 min', value: 45 },
        { label: '60 min', value: 60 },
        { label: '90 min', value: 90 }
      ];

      var presetHtml = '';
      for (var ti = 0; ti < timers.length; ti++) {
        presetHtml += '\
<button class="c-pointer c-fs-xs c-text-primary c-bg-glass c-transition-fast" data-action="features:_advTimerSetPreset:' + timers[ti].value + '" style="padding:var(--space-1) var(--space-3);border:1px solid var(--border-color);border-radius:var(--radius-sm)">' + timers[ti].label + '</button>';
      }

      var recentSessions = data.sessions.slice(-20).reverse();
      var historyHtml = '';
      for (var si = 0; si < recentSessions.length; si++) {
        var s = recentSessions[si];
        historyHtml += '\
<div class="c-flex-gap-2 c-radius-sm" style="display:flex;align-items:center;gap:var(--space-2);padding:var(--space-1) var(--space-2);border:1px solid var(--border-light);margin-bottom:var(--space-1)">\
  <div class="c-fs-xs c-fw-medium c-text-primary" style="flex:1">' + sanitize(s.subject || 'General') + '</div>\
  <div class="c-fs-xs c-text-tertiary">' + s.duration + ' min</div>\
  <div class="c-fs-xs text-muted">' + (s.date === today ? 'Today' : s.date ? utils.formatDate(s.date, 'dd mmm') : '') + '</div>\
</div>';
      }

      if (recentSessions.length === 0) {
        historyHtml = '<div class="c-text-center c-fs-xs c-text-tertiary" style="padding:var(--space-3)">No sessions yet</div>';
      }

      var state = store.get('advTimerState') || { remaining: 0, total: 0, isRunning: false, subject: 'General', presetMinutes: 0 };

      var mins = Math.floor(state.remaining / 60);
      var secs = state.remaining % 60;
      var displayTime = state.total > 0 ? pad(mins) + ':' + pad(secs) : '00:00';

      return '\
<div class="c-flex-gap-3" style="display:flex;flex-direction:column;gap:var(--space-4)">\
  <div class="c-text-center">\
    <div class="c-text-primary c-fw-bold" id="ef-advtimer-display" style="font-size:3rem;font-family:var(--font-mono);letter-spacing:4px;margin-bottom:var(--space-2)">' + displayTime + '</div>\
    <div class="c-flex-center c-flex-gap-3" style="margin-bottom:var(--space-3)">\
      <select id="ef-advtimer-subject" class="c-fs-xs" style="padding:var(--space-1) var(--space-2);border:1px solid var(--border-color);border-radius:var(--radius-sm);background:var(--bg-secondary);color:var(--text-primary);outline:none">\
        <option value="General">General</option>\
        <option value="Mathematics">Mathematics</option>\
        <option value="Physics">Physics</option>\
        <option value="Chemistry">Chemistry</option>\
        <option value="Biology">Biology</option>\
        <option value="English">English</option>\
        <option value="Computer Science">Computer Science</option>\
      </select>\
      <button class="c-pointer c-fw-semibold c-fs-sm" data-action="features:_advTimerStartStop" style="padding:var(--space-2) var(--space-6);border:none;border-radius:var(--radius-md);color:#fff;background:' + (state.isRunning ? '#ef4444' : 'var(--accent-blue)') + '">' + (state.isRunning ? 'Stop' : 'Start') + '</button>\
      <button class="c-pointer c-fw-medium c-fs-sm c-text-secondary" data-action="features:_advTimerReset" style="padding:var(--space-2) var(--space-4);border:1px solid var(--border-color);border-radius:var(--radius-md);background:transparent">Reset</button>\
    </div>\
    <div class="c-flex-center c-flex-gap-2 c-flex-wrap">' + presetHtml + '</div>\
  </div>\
  <div class="c-bg-glass c-radius-sm c-flex-between" style="display:flex;justify-content:space-between;align-items:center;padding:var(--space-2) var(--space-3)">\
    <span class="c-fs-sm c-text-primary">Total study time today: <strong>' + utils.formatDuration(todayTotal) + '</strong></span>\
    <button class="c-pointer c-fs-xs c-text-danger" data-action="features:_advTimerClearHistory" style="padding:2px 8px;border:1px solid var(--accent-red);border-radius:var(--radius-sm);background:transparent">Clear History</button>\
  </div>\
  <div>\
    <h4 class="c-fs-sm c-fw-semibold c-text-primary" style="margin:0 0 var(--space-2)">Recent Sessions</h4>\
    <div class="c-scroll-y" style="max-height:200px">' + historyHtml + '</div>\
  </div>\
</div>';
    },

    _advTimerSetPreset: function(minutes) {
      var state = store.get('advTimerState') || { remaining: 0, total: 0, isRunning: false, subject: 'General', presetMinutes: 0 };
      state.remaining = minutes * 60;
      state.total = minutes * 60;
      state.isRunning = false;
      state.presetMinutes = minutes;
      store.set('advTimerState', state);
      window.EduFeatures.openStudyTimer();
    },

    _advTimerStartStop: function() {
      var state = store.get('advTimerState') || { remaining: 0, total: 0, isRunning: false, subject: 'General', presetMinutes: 0 };
      if (state.remaining <= 0 && !state.isRunning) {
        window.EduFeatures.showToast('Select a preset duration first', 'warning');
        return;
      }
      if (state.isRunning) {
        state.isRunning = false;
        store.set('advTimerState', state);
        window.EduFeatures.openStudyTimer();
        if (window._advTimerInterval) {
          clearInterval(window._advTimerInterval);
          window._advTimerInterval = null;
        }
      } else {
        state.isRunning = true;
        var subjSelect = document.getElementById('ef-advtimer-subject');
        if (subjSelect) state.subject = subjSelect.value;
        store.set('advTimerState', state);
        window.EduFeatures.openStudyTimer();
        if (window._advTimerInterval) {
          clearInterval(window._advTimerInterval);
        }
        window._advTimerInterval = setInterval(function() {
          var st = store.get('advTimerState');
          if (!st || !st.isRunning) {
            clearInterval(window._advTimerInterval);
            window._advTimerInterval = null;
            return;
          }
          st.remaining--;
          if (st.remaining <= 0) {
            st.remaining = 0;
            st.isRunning = false;
            store.set('advTimerState', st);
            clearInterval(window._advTimerInterval);
            window._advTimerInterval = null;
            var sessionDuration = st.total;
            window.EduFeatures._advTimerLogSession(st.subject || 'General', Math.round(sessionDuration / 60));
            window.EduFeatures.openStudyTimer();
            window.EduFeatures.showToast('Session complete! ' + (st.subject || 'General') + ' - ' + Math.round(sessionDuration / 60) + ' min', 'success');
          } else {
            store.set('advTimerState', st);
            var display = document.getElementById('ef-advtimer-display');
            if (display) {
              var mins = Math.floor(st.remaining / 60);
              var secs = st.remaining % 60;
              display.textContent = pad(mins) + ':' + pad(secs);
            }
          }
        }, 1000);
      }
    },

    _advTimerReset: function() {
      var state = store.get('advTimerState') || { remaining: 0, total: 0, isRunning: false, subject: 'General', presetMinutes: 0 };
      if (window._advTimerInterval) {
        clearInterval(window._advTimerInterval);
        window._advTimerInterval = null;
      }
      state.remaining = state.total;
      state.isRunning = false;
      store.set('advTimerState', state);
      window.EduFeatures.openStudyTimer();
    },

    _advTimerLogSession: function(subject, duration) {
      if (duration <= 0) return;
      var data = window.EduFeatures._advTimerGetData();
      data.sessions.push({
        id: 'as_' + Date.now(),
        subject: subject || 'General',
        duration: duration,
        date: todayStr(),
        timestamp: new Date().toISOString()
      });
      if (data.sessions.length > 500) {
        data.sessions = data.sessions.slice(-500);
      }
      window.EduFeatures._advTimerSaveData(data);
    },

    _advTimerClearHistory: function() {
      if (!confirm('Clear all session history?')) return;
      var data = window.EduFeatures._advTimerGetData();
      data.sessions = [];
      window.EduFeatures._advTimerSaveData(data);
      window.EduFeatures.openStudyTimer();
      window.EduFeatures.showToast('History cleared', 'info');
    },

    _closeModal: function(id) {
      var modal = document.getElementById(id);
      if (modal) modal.style.display = 'none';
    },

    // ==================== PRACTICE SYSTEM ====================

    _practiceGetQuestions: function(subjectId, lessonId) {
      var allPractice = window.mockData && window.mockData.practice || {};
      var subjectSets = allPractice[subjectId] || [];
      if (lessonId) {
        for (var psi = 0; psi < subjectSets.length; psi++) {
          if (subjectSets[psi].id === lessonId) {
            return subjectSets[psi].questions || [];
          }
        }
        return [];
      }
      var allQ = [];
      for (var psi = 0; psi < subjectSets.length; psi++) {
        allQ = allQ.concat(subjectSets[psi].questions || []);
      }
      return allQ;
    },

    startPractice: function(subjectId, lessonId) {
      var questions = window.EduFeatures._practiceGetQuestions(subjectId, lessonId);
      if (!questions || questions.length === 0) {
        window.EduFeatures.showToast('No practice questions available for this subject', 'warning');
        return;
      }
      var state = {
        questions: questions,
        currentIndex: 0,
        answers: {},
        startTime: Date.now(),
        subjectId: subjectId,
        lessonId: lessonId || ''
      };
      store.set('practiceState', state);
      var html = window.EduFeatures._practiceBuildHTML(state);
      window.EduFeatures._createModal('ef-practice-modal', 'Practice Session', html, 800);
      window.EduFeatures._practiceRenderQuestion(state);
    },

    _practiceBuildHTML: function(state) {
      var q = state.questions;
      var total = q.length;
      var idx = state.currentIndex;
      var progressPct = total > 0 ? Math.round(((idx + 1) / total) * 100) : 0;
      var dots = '';
      for (var di = 0; di < total; di++) {
        var dotCls = di === idx ? 'c-bg-accent' : (state.answers[state.questions[di].id] !== undefined ? 'c-bg-success' : 'c-bg-glass');
        dots += '<span class="c-radius-full ' + dotCls + '" style="display:inline-block;width:10px;height:10px;margin:0 3px;border:1px solid var(--border-color)"></span>';
      }
      return '\
<div class="c-flex-gap-3" style="display:flex;flex-direction:column;gap:var(--space-4)">\
  <div class="c-flex-between" style="display:flex;align-items:center;justify-content:space-between">\
    <span class="c-fs-xs c-text-tertiary">Question ' + (idx + 1) + ' of ' + total + '</span>\
    <span class="c-fs-xs c-text-tertiary" id="ef-practice-timer"></span>\
  </div>\
  <div class="progress-bar" style="height:4px"><div class="progress-bar-fill progress-fill-blue" style="width:' + progressPct + '%"></div></div>\
  <div class="c-text-center c-flex-gap-1" style="display:flex;gap:2px;justify-content:center;flex-wrap:wrap">' + dots + '</div>\
  <div id="ef-practice-question-area" class="c-radius-lg c-bg-glass" style="padding:var(--space-5);min-height:200px"></div>\
  <div class="c-flex-between" style="display:flex;align-items:center;justify-content:space-between">\
    <div>\
      <button class="c-pointer c-fw-medium c-fs-sm c-text-secondary" id="ef-practice-prev" data-action="features:_practicePrevQuestion" style="padding:var(--space-2) var(--space-5);border:1px solid var(--border-color);border-radius:var(--radius-md);background:transparent' + (idx === 0 ? ';opacity:0.4;cursor:not-allowed' : '') + '">\u2190 Previous</button>\
    </div>\
    <div class="c-flex-gap-2" style="display:flex;gap:var(--space-2)">\
      <button class="c-pointer c-fw-semibold c-fs-sm" id="ef-practice-next" data-action="features:_practiceNextQuestion" style="padding:var(--space-2) var(--space-5);border:none;border-radius:var(--radius-md);color:#fff;background:var(--accent-blue)' + (idx >= total - 1 ? ';display:none' : '') + '">Next \u2192</button>\
      <button class="c-pointer c-fw-semibold c-fs-sm" id="ef-practice-submit" data-action="features:_practiceSubmit" style="padding:var(--space-2) var(--space-5);border:none;border-radius:var(--radius-md);color:#fff;background:var(--accent-green)' + (idx < total - 1 ? ';display:none' : '') + '">\u2713 Submit</button>\
    </div>\
  </div>\
</div>';
    },

    _practiceRenderQuestion: function(state) {
      var area = document.getElementById('ef-practice-question-area');
      if (!area) return;
      var q = state.questions[state.currentIndex];
      if (!q) return;
      var selected = state.answers[q.id];
      var html = '';
      html += '<div class="c-fs-sm c-text-tertiary c-fw-semibold" style="margin-bottom:var(--space-2);text-transform:uppercase;letter-spacing:1px">' + sanitize(q.type.replace(/([A-Z])/g, ' $1').trim()) + '</div>';
      html += '<div class="c-fs-base c-text-primary c-fw-medium" style="margin-bottom:var(--space-4);line-height:1.6">' + sanitize(q.question) + '</div>';
      var diffColors = { easy: 'var(--accent-green)', medium: 'var(--accent-yellow)', hard: 'var(--accent-red)' };
      var diffColor = diffColors[q.difficulty] || 'var(--text-tertiary)';
      html += '<div class="c-fs-xs c-text-tertiary" style="margin-bottom:var(--space-3)"><span style="color:' + diffColor + '">' + sanitize(q.difficulty) + '</span> &middot; ' + (q.points || 5) + ' pts</div>';

      if (q.type === 'mcq') {
        var opts = q.options || [];
        for (var oi = 0; oi < opts.length; oi++) {
          var checked = selected === opts[oi] ? 'checked' : '';
          html += '\
<label class="c-pointer c-radius-sm c-flex-gap-2" style="display:flex;align-items:center;gap:var(--space-2);padding:var(--space-3);margin-bottom:var(--space-2);border:1px solid var(--border-color);border-radius:var(--radius-sm);cursor:pointer' + (selected === opts[oi] ? ';border-color:var(--accent-blue);background:rgba(59,130,246,0.08)' : '') + '">\
  <input type="radio" name="ef-practice-q" value="' + sanitize(opts[oi]) + '" ' + checked + ' data-action="features:_practiceSelectAnswer:' + q.id + '">\
  <span class="c-fs-sm c-text-primary">' + sanitize(opts[oi]) + '</span>\
</label>';
        }
      } else if (q.type === 'trueFalse') {
        var tfOpts = q.options || ['True', 'False'];
        for (var tfi = 0; tfi < tfOpts.length; tfi++) {
          var tfChecked = selected === tfOpts[tfi] ? 'checked' : '';
          html += '\
<label class="c-pointer c-radius-sm c-flex-gap-2" style="display:flex;align-items:center;gap:var(--space-2);padding:var(--space-3);margin-bottom:var(--space-2);border:1px solid var(--border-color);border-radius:var(--radius-sm);cursor:pointer' + (selected === tfOpts[tfi] ? ';border-color:var(--accent-blue);background:rgba(59,130,246,0.08)' : '') + '">\
  <input type="radio" name="ef-practice-tf" value="' + sanitize(tfOpts[tfi]) + '" ' + tfChecked + ' data-action="features:_practiceSelectAnswer:' + q.id + '">\
  <span class="c-fs-sm c-text-primary">' + sanitize(tfOpts[tfi]) + '</span>\
</label>';
        }
      } else if (q.type === 'fillBlank') {
        html += '\
<div class="c-flex-gap-2" style="display:flex;gap:var(--space-2);align-items:center">\
  <span class="c-fs-sm c-text-primary">Your answer:</span>\
  <input type="text" id="ef-practice-fill" value="' + sanitize(selected || '') + '" placeholder="Type your answer..." class="c-fs-sm" data-action="features:_practiceFillAnswer:' + q.id + '" style="flex:1;padding:var(--space-2) var(--space-3);border:1px solid var(--border-color);border-radius:var(--radius-sm);background:var(--bg-secondary);color:var(--text-primary);outline:none;font-family:var(--font-mono)">\
</div>';
      } else if (q.type === 'shortAnswer') {
        html += '\
<textarea id="ef-practice-short" placeholder="Write a brief answer..." class="c-fs-sm" data-action="features:_practiceFillAnswer:' + q.id + '" style="width:100%;min-height:100px;padding:var(--space-3);border:1px solid var(--border-color);border-radius:var(--radius-sm);background:var(--bg-secondary);color:var(--text-primary);resize:vertical;outline:none;font-family:var(--font-family)">' + sanitize(selected || '') + '</textarea>';
      } else if (q.type === 'longAnswer') {
        html += '\
<textarea id="ef-practice-long" placeholder="Write a detailed answer..." class="c-fs-sm" data-action="features:_practiceFillAnswer:' + q.id + '" style="width:100%;min-height:200px;padding:var(--space-3);border:1px solid var(--border-color);border-radius:var(--radius-sm);background:var(--bg-secondary);color:var(--text-primary);resize:vertical;outline:none;font-family:var(--font-family)">' + sanitize(selected || '') + '</textarea>';
      } else if (q.type === 'match') {
        var leftItems = q.leftItems || [];
        var rightItems = q.rightItems || [];
        var matchAnswers = selected || {};
        html += '<div class="c-flex-gap-3" style="display:flex;gap:var(--space-4);flex-wrap:wrap">';
        html += '<div style="flex:1;min-width:140px">';
        for (var li = 0; li < leftItems.length; li++) {
          html += '\
<div class="c-radius-sm c-bg-glass c-text-center c-fs-sm c-text-primary c-fw-medium" style="padding:var(--space-2) var(--space-3);margin-bottom:var(--space-2);border:1px solid var(--border-color)">' + sanitize(leftItems[li]) + '</div>';
        }
        html += '</div><div style="flex:1;min-width:140px">';
        for (var ri = 0; ri < rightItems.length; ri++) {
          var sel = matchAnswers[ri] || '';
          html += '\
<select class="c-fs-sm c-w-full" data-action="features:_practiceMatchAnswer:' + q.id + '|' + ri + '" style="padding:var(--space-2);margin-bottom:var(--space-2);border:1px solid var(--border-color);border-radius:var(--radius-sm);background:var(--bg-secondary);color:var(--text-primary);outline:none">\
  <option value="">-- Match --</option>';
          for (var lj = 0; lj < leftItems.length; lj++) {
            var s = sel === leftItems[lj] ? 'selected' : '';
            html += '<option value="' + sanitize(leftItems[lj]) + '" ' + s + '>' + sanitize(leftItems[lj]) + '</option>';
          }
          html += '</select>';
        }
        html += '</div></div>';
      }

      area.innerHTML = html;

      var modal = document.getElementById('ef-practice-modal');
      if (modal) {
        var content = modal.querySelector('[id$="-content"]');
        if (content) content.scrollTop = 0;
      }
    },

    _practiceSelectAnswer: function(questionId, value) {
      var state = store.get('practiceState');
      if (!state) return;
      state.answers[questionId] = value;
      store.set('practiceState', state);
      window.EduFeatures._practiceRefreshDots();
    },

    _practiceFillAnswer: function(questionId, value) {
      var state = store.get('practiceState');
      if (!state) return;
      state.answers[questionId] = value;
      store.set('practiceState', state);
      window.EduFeatures._practiceRefreshDots();
    },

    _practiceMatchAnswer: function(questionId, index, value) {
      var state = store.get('practiceState');
      if (!state) return;
      if (!state.answers[questionId]) state.answers[questionId] = {};
      if (typeof state.answers[questionId] === 'string') state.answers[questionId] = {};
      state.answers[questionId][index] = value;
      store.set('practiceState', state);
      window.EduFeatures._practiceRefreshDots();
    },

    _practiceRefreshDots: function() {
      var state = store.get('practiceState');
      if (!state) return;
      var total = state.questions.length;
      var area = document.getElementById('ef-practice-question-area');
      if (!area) return;
      var dotsContainer = area.parentNode && area.parentNode.querySelector('.c-flex-gap-1');
      if (!dotsContainer) return;
      var dots = '';
      for (var di = 0; di < total; di++) {
        var dotCls = di === state.currentIndex ? 'c-bg-accent' : (state.answers[state.questions[di].id] !== undefined ? 'c-bg-success' : 'c-bg-glass');
        dots += '<span class="c-radius-full ' + dotCls + '" style="display:inline-block;width:10px;height:10px;margin:0 3px;border:1px solid var(--border-color)"></span>';
      }
      dotsContainer.innerHTML = dots;
    },

    _practiceNextQuestion: function() {
      var state = store.get('practiceState');
      if (!state) return;
      if (state.currentIndex < state.questions.length - 1) {
        state.currentIndex++;
        store.set('practiceState', state);
        window.EduFeatures._practiceRebuildUI(state);
        window.EduFeatures._practiceRenderQuestion(state);
      }
    },

    _practicePrevQuestion: function() {
      var state = store.get('practiceState');
      if (!state) return;
      if (state.currentIndex > 0) {
        state.currentIndex--;
        store.set('practiceState', state);
        window.EduFeatures._practiceRebuildUI(state);
        window.EduFeatures._practiceRenderQuestion(state);
      }
    },

    _practiceRebuildUI: function(state) {
      var modal = document.getElementById('ef-practice-modal');
      if (!modal) return;
      var content = document.getElementById('ef-practice-modal-content');
      if (!content) return;
      var html = window.EduFeatures._practiceBuildHTML(state);
      content.innerHTML = html;
    },

    _practiceSubmit: function() {
      var state = store.get('practiceState');
      if (!state) return;
      var questions = state.questions;
      var answers = state.answers;
      var total = questions.length;
      var correct = 0;
      var incorrect = 0;
      var wrongTopics = [];
      var results = [];
      var totalPoints = 0;
      var earnedPoints = 0;

      for (var qi = 0; qi < total; qi++) {
        var q = questions[qi];
        var userAns = answers[q.id];
        var isCorrect = false;

        if (q.type === 'mcq' || q.type === 'trueFalse' || q.type === 'fillBlank') {
          isCorrect = userAns && userAns.toString().trim().toLowerCase() === q.correctAnswer.toString().trim().toLowerCase();
        } else if (q.type === 'shortAnswer' || q.type === 'longAnswer') {
          isCorrect = userAns && userAns.toString().trim().toLowerCase() === q.correctAnswer.toString().trim().toLowerCase();
        } else if (q.type === 'match') {
          var matchAns = userAns || {};
          var matchOk = 0;
          var matchTotal = 0;
          if (q.leftItems) {
            for (var mi = 0; mi < q.leftItems.length; mi++) {
              var expectedMatch = q.correctAnswer && q.correctAnswer[q.leftItems[mi]];
              if (expectedMatch) {
                matchTotal++;
                if (matchAns[mi] === expectedMatch) matchOk++;
              }
            }
          }
          isCorrect = matchOk === matchTotal && matchTotal > 0;
        }

        if (isCorrect) {
          correct++;
          earnedPoints += q.points || 5;
        } else {
          incorrect++;
          if (userAns && userAns.toString().trim()) {
            wrongTopics.push(q.question);
          }
        }
        totalPoints += q.points || 5;

        results.push({
          question: q.question,
          type: q.type,
          userAnswer: userAns || '(not answered)',
          correctAnswer: q.correctAnswer,
          isCorrect: isCorrect,
          explanation: q.explanation || '',
          difficulty: q.difficulty || 'medium',
          points: q.points || 5
        });
      }

      var timeTaken = Math.round((Date.now() - state.startTime) / 1000);
      var score = totalPoints > 0 ? Math.round((earnedPoints / totalPoints) * 100) : 0;

      var resultData = {
        subjectId: state.subjectId,
        lessonId: state.lessonId,
        total: total,
        correct: correct,
        incorrect: incorrect,
        score: score,
        earnedPoints: earnedPoints,
        totalPoints: totalPoints,
        timeTaken: timeTaken,
        wrongTopics: wrongTopics.slice(0, 5),
        results: results,
        timestamp: new Date().toISOString()
      };

      var modal = document.getElementById('ef-practice-modal');
      if (modal) modal.style.display = 'none';

      store.set('lastPracticeResult', resultData);
      window.EduFeatures.showPracticeResults(resultData);
    },

    showPracticeResults: function(results) {
      var mins = Math.floor(results.timeTaken / 60);
      var secs = results.timeTaken % 60;
      var timeStr = mins > 0 ? mins + 'm ' + secs + 's' : secs + 's';
      var gradeColor = results.score >= 80 ? 'var(--accent-green)' : results.score >= 50 ? 'var(--accent-yellow)' : 'var(--accent-red)';
      var gradeLabel = results.score >= 80 ? 'Excellent!' : results.score >= 60 ? 'Good Job!' : results.score >= 40 ? 'Keep Trying' : 'Needs Improvement';

      var wrongList = '';
      for (var ri = 0; ri < results.results.length; ri++) {
        var r = results.results[ri];
        if (!r.isCorrect) {
          wrongList += '\
<div class="c-radius-sm" style="padding:var(--space-3);margin-bottom:var(--space-2);border:1px solid rgba(239,68,68,0.3);background:rgba(239,68,68,0.05)">\
  <div class="c-fs-xs c-text-danger c-fw-semibold" style="margin-bottom:var(--space-1)">\u2718 ' + sanitize(r.question) + '</div>\
  <div class="c-fs-xs c-text-tertiary">Your answer: <span class="c-text-danger">' + sanitize(String(r.userAnswer)) + '</span></div>\
  <div class="c-fs-xs c-text-tertiary">Correct answer: <span class="c-text-success">' + sanitize(String(r.correctAnswer)) + '</span></div>\
  ' + (r.explanation ? '<div class="c-fs-xs c-text-info" style="margin-top:var(--space-1)">\ud83d\udca1 ' + sanitize(r.explanation) + '</div>' : '') + '\
</div>';
        }
      }
      if (!wrongList) {
        wrongList = '<div class="c-text-center c-fs-sm c-text-success" style="padding:var(--space-4)">\u2714 All questions answered correctly! Perfect score!</div>';
      }

      var suggestedTopics = '';
      if (results.wrongTopics && results.wrongTopics.length > 0) {
        suggestedTopics = '\
<div class="c-radius-sm" style="padding:var(--space-3);border:1px solid var(--border-color);background:var(--bg-glass);margin-top:var(--space-2)">\
  <div class="c-fs-xs c-fw-semibold c-text-primary" style="margin-bottom:var(--space-2)">\ud83d\udccb Suggested Revision Topics</div>\
  <ul style="margin:0;padding-left:var(--space-4)">';
        for (var si = 0; si < results.wrongTopics.length; si++) {
          suggestedTopics += '<li class="c-fs-xs c-text-tertiary" style="margin-bottom:var(--space-1)">' + sanitize(String(results.wrongTopics[si])) + '</li>';
        }
        suggestedTopics += '</ul></div>';
      }

      var html = '\
<div class="c-flex-gap-4" style="display:flex;flex-direction:column;gap:var(--space-4)">\
  <div class="c-text-center">\
    <div style="font-size:3rem;font-weight:700;color:' + gradeColor + ';margin-bottom:var(--space-1)">' + results.score + '%</div>\
    <div class="c-fs-sm c-fw-semibold c-text-primary" style="margin-bottom:var(--space-2)">' + gradeLabel + '</div>\
    <div class="c-flex-center c-flex-gap-4 c-flex-wrap" style="display:flex;justify-content:center;gap:var(--space-4);flex-wrap:wrap;margin-bottom:var(--space-3)">\
      <div class="c-text-center"><div class="c-fs-lg c-fw-bold c-text-success">' + results.correct + '</div><div class="c-fs-xs c-text-tertiary">Correct</div></div>\
      <div class="c-text-center"><div class="c-fs-lg c-fw-bold c-text-danger">' + results.incorrect + '</div><div class="c-fs-xs c-text-tertiary">Incorrect</div></div>\
      <div class="c-text-center"><div class="c-fs-lg c-fw-bold c-text-primary">' + results.total + '</div><div class="c-fs-xs c-text-tertiary">Total</div></div>\
      <div class="c-text-center"><div class="c-fs-lg c-fw-bold c-text-primary">' + timeStr + '</div><div class="c-fs-xs c-text-tertiary">Time Taken</div></div>\
    </div>\
    <div class="progress-bar" style="height:8px;max-width:300px;margin:0 auto var(--space-3)"><div class="progress-bar-fill" style="width:' + results.score + '%;background:' + gradeColor + '"></div></div>\
  </div>\
  <div>\
    <h4 class="c-fs-sm c-fw-semibold c-text-primary" style="margin:0 0 var(--space-2)">Review Incorrect Answers</h4>\
    ' + wrongList + '\
  </div>\
  ' + suggestedTopics + '\
  <div class="c-flex-center c-flex-gap-3" style="display:flex;justify-content:center;gap:var(--space-3)">\
    <button class="c-pointer c-fw-semibold c-fs-sm" data-action="features:startPractice:' + results.subjectId + '|' + results.lessonId + '" style="padding:var(--space-2) var(--space-6);border:none;border-radius:var(--radius-md);color:#fff;background:var(--accent-blue)">\ud83d\udd04 Retry</button>\
    <button class="c-pointer c-fw-medium c-fs-sm c-text-secondary" data-action="features:_closeModal:ef-practice-results-modal" style="padding:var(--space-2) var(--space-5);border:1px solid var(--border-color);border-radius:var(--radius-md);background:transparent">Close</button>\
  </div>\
</div>';

      window.EduFeatures._createModal('ef-practice-results-modal', 'Practice Results', html, 650);
    },

    showQuickQuiz: function(subjectId) {
      var pool = window.EduFeatures._practiceGetQuestions(subjectId);
      if (pool.length < 3) {
        window.EduFeatures.showToast('Not enough questions for a quiz. Try another subject.', 'warning');
        return;
      }
      var shuffled = pool.slice();
      for (var si = shuffled.length - 1; si > 0; si--) {
        var sj = Math.floor(Math.random() * (si + 1));
        var tmp = shuffled[si];
        shuffled[si] = shuffled[sj];
        shuffled[sj] = tmp;
      }
      var selected = shuffled.slice(0, Math.min(10, shuffled.length));

      var state = {
        questions: selected,
        currentIndex: 0,
        answers: {},
        startTime: Date.now(),
        subjectId: subjectId,
        lessonId: '',
        timeLimit: 300,
        isQuiz: true
      };
      store.set('practiceState', state);
      store.set('quickQuizActive', true);

      var html = '\
<div class="c-flex-gap-3" style="display:flex;flex-direction:column;gap:var(--space-4)">\
  <div class="c-flex-between" style="display:flex;align-items:center;justify-content:space-between">\
    <span class="c-fs-xs c-text-tertiary">Quick Quiz - ' + selected.length + ' questions</span>\
    <span class="c-fs-sm c-fw-bold c-text-primary" id="ef-quiz-timer" style="font-family:var(--font-mono)">05:00</span>\
  </div>\
  <div class="progress-bar" style="height:4px"><div class="progress-bar-fill progress-fill-blue" id="ef-quiz-progress" style="width:0%"></div></div>\
  <div id="ef-practice-question-area" class="c-radius-lg c-bg-glass" style="padding:var(--space-5);min-height:200px"></div>\
  <div class="c-flex-between" style="display:flex;align-items:center;justify-content:space-between">\
    <button class="c-pointer c-fw-medium c-fs-sm c-text-secondary" id="ef-quiz-prev" data-action="features:_quizPrevQuestion" style="padding:var(--space-2) var(--space-5);border:1px solid var(--border-color);border-radius:var(--radius-md);background:transparent;opacity:0.4;cursor:not-allowed">\u2190 Previous</button>\
    <button class="c-pointer c-fw-semibold c-fs-sm" id="ef-quiz-next" data-action="features:_quizNextQuestion" style="padding:var(--space-2) var(--space-5);border:none;border-radius:var(--radius-md);color:#fff;background:var(--accent-blue)">Next \u2192</button>\
  </div>\
</div>';

      window.EduFeatures._createModal('ef-practice-modal', 'Quick Quiz', html, 800);
      window.EduFeatures._quizRenderQuestion(state);

      if (window._quizTimerInterval) clearInterval(window._quizTimerInterval);
      window._quizTimerInterval = setInterval(function() {
        window.EduFeatures._quizTimerTick();
      }, 1000);
    },

    _quizTimerTick: function() {
      var state = store.get('practiceState');
      if (!state || !state.isQuiz) return;
      var elapsed = Math.round((Date.now() - state.startTime) / 1000);
      var remaining = Math.max(0, state.timeLimit - elapsed);
      var timerEl = document.getElementById('ef-quiz-timer');
      if (timerEl) {
        var mins = Math.floor(remaining / 60);
        var secs = remaining % 60;
        timerEl.textContent = pad(mins) + ':' + pad(secs);
        if (remaining <= 60) timerEl.style.color = 'var(--accent-red)';
      }
      var progressEl = document.getElementById('ef-quiz-progress');
      if (progressEl) {
        var pct = Math.min(100, (elapsed / state.timeLimit) * 100);
        progressEl.style.width = pct + '%';
        if (pct > 80) progressEl.style.background = 'var(--accent-red)';
      }
      if (remaining <= 0) {
        if (window._quizTimerInterval) {
          clearInterval(window._quizTimerInterval);
          window._quizTimerInterval = null;
        }
        window.EduFeatures.showToast('Time is up! Auto-submitting...', 'warning');
        setTimeout(function() {
          window.EduFeatures._practiceSubmit();
        }, 500);
      }
    },

    _quizRenderQuestion: function(state) {
      var area = document.getElementById('ef-practice-question-area');
      if (!area) return;
      var q = state.questions[state.currentIndex];
      if (!q) return;
      var selected = state.answers[q.id];

      var html = '';
      html += '<div class="c-fs-xs c-text-tertiary c-fw-semibold" style="margin-bottom:var(--space-2);text-transform:uppercase;letter-spacing:1px">Question ' + (state.currentIndex + 1) + ' of ' + state.questions.length + '</div>';
      html += '<div class="c-fs-base c-text-primary c-fw-medium" style="margin-bottom:var(--space-4);line-height:1.6">' + sanitize(q.question) + '</div>';

      if (q.type === 'mcq') {
        var opts = q.options || [];
        for (var oi = 0; oi < opts.length; oi++) {
          var checked = selected === opts[oi] ? 'checked' : '';
          html += '\
<label class="c-pointer c-radius-sm" style="display:flex;align-items:center;gap:var(--space-2);padding:var(--space-3);margin-bottom:var(--space-2);border:1px solid var(--border-color);border-radius:var(--radius-sm);cursor:pointer' + (selected === opts[oi] ? ';border-color:var(--accent-blue);background:rgba(59,130,246,0.08)' : '') + '">\
  <input type="radio" name="ef-quiz-q" value="' + sanitize(opts[oi]) + '" ' + checked + ' data-action="features:_quizSelectAnswer:' + q.id + '">\
  <span class="c-fs-sm c-text-primary">' + sanitize(opts[oi]) + '</span>\
</label>';
        }
      } else if (q.type === 'trueFalse') {
        var tfOpts = q.options || ['True', 'False'];
        for (var tfi = 0; tfi < tfOpts.length; tfi++) {
          var tfChecked = selected === tfOpts[tfi] ? 'checked' : '';
          html += '\
<label class="c-pointer c-radius-sm" style="display:flex;align-items:center;gap:var(--space-2);padding:var(--space-3);margin-bottom:var(--space-2);border:1px solid var(--border-color);border-radius:var(--radius-sm);cursor:pointer' + (selected === tfOpts[tfi] ? ';border-color:var(--accent-blue);background:rgba(59,130,246,0.08)' : '') + '">\
  <input type="radio" name="ef-quiz-tf" value="' + sanitize(tfOpts[tfi]) + '" ' + tfChecked + ' data-action="features:_quizSelectAnswer:' + q.id + '">\
  <span class="c-fs-sm c-text-primary">' + sanitize(tfOpts[tfi]) + '</span>\
</label>';
        }
      } else if (q.type === 'fillBlank') {
        html += '\
<div class="c-flex-gap-2" style="display:flex;gap:var(--space-2);align-items:center">\
  <span class="c-fs-sm c-text-primary">Answer:</span>\
  <input type="text" id="ef-quiz-fill" value="' + sanitize(selected || '') + '" placeholder="Type your answer..." class="c-fs-sm" data-action="features:_quizFillAnswer:' + q.id + '" style="flex:1;padding:var(--space-2) var(--space-3);border:1px solid var(--border-color);border-radius:var(--radius-sm);background:var(--bg-secondary);color:var(--text-primary);outline:none;font-family:var(--font-mono)">\
</div>';
      } else if (q.type === 'shortAnswer') {
        html += '\
<textarea id="ef-quiz-short" placeholder="Write a brief answer..." class="c-fs-sm" data-action="features:_quizFillAnswer:' + q.id + '" style="width:100%;min-height:80px;padding:var(--space-3);border:1px solid var(--border-color);border-radius:var(--radius-sm);background:var(--bg-secondary);color:var(--text-primary);resize:vertical;outline:none;font-family:var(--font-family)">' + sanitize(selected || '') + '</textarea>';
      }

      area.innerHTML = html;
    },

    _quizSelectAnswer: function(questionId, value) {
      var state = store.get('practiceState');
      if (!state) return;
      state.answers[questionId] = value;
      store.set('practiceState', state);
    },

    _quizFillAnswer: function(questionId, value) {
      var state = store.get('practiceState');
      if (!state) return;
      state.answers[questionId] = value;
      store.set('practiceState', state);
    },

    _quizNextQuestion: function() {
      var state = store.get('practiceState');
      if (!state) return;
      if (state.currentIndex < state.questions.length - 1) {
        state.currentIndex++;
        store.set('practiceState', state);
        window.EduFeatures._quizUpdateNav(state);
        window.EduFeatures._quizRenderQuestion(state);
      } else {
        window.EduFeatures._quizFinish(state);
      }
    },

    _quizPrevQuestion: function() {
      var state = store.get('practiceState');
      if (!state) return;
      if (state.currentIndex > 0) {
        state.currentIndex--;
        store.set('practiceState', state);
        window.EduFeatures._quizUpdateNav(state);
        window.EduFeatures._quizRenderQuestion(state);
      }
    },

    _quizUpdateNav: function(state) {
      var prevBtn = document.getElementById('ef-quiz-prev');
      var nextBtn = document.getElementById('ef-quiz-next');
      if (prevBtn) {
        prevBtn.style.opacity = state.currentIndex === 0 ? '0.4' : '1';
        prevBtn.style.cursor = state.currentIndex === 0 ? 'not-allowed' : 'pointer';
      }
      if (nextBtn) {
        if (state.currentIndex >= state.questions.length - 1) {
          nextBtn.textContent = '\u2713 Submit';
          nextBtn.style.background = 'var(--accent-green)';
        } else {
          nextBtn.textContent = 'Next \u2192';
          nextBtn.style.background = 'var(--accent-blue)';
        }
      }
    },

    _quizFinish: function(state) {
      if (window._quizTimerInterval) {
        clearInterval(window._quizTimerInterval);
        window._quizTimerInterval = null;
      }
      store.set('quickQuizActive', false);
      window.EduFeatures._practiceSubmit();
    }
  };
})();
