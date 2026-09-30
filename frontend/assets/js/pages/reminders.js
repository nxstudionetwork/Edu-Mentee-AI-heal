window.renderPage = window.renderPage || {};

(function() {
  var store = window.Store;
  var utils = window.Utils;

  if (!window._remDelegateAdded) {
    window._remDelegateAdded = true;
    document.addEventListener('click', function(e) {
      var t = e.target.closest('[data-action^="rem:"]');
      if (!t) return;
      var p = t.getAttribute('data-action').split(':');
      var c = p[1], arg = p.slice(2).join(':');
      if (c === 'add') { showAddForm(); }
      else if (c === 'save') { saveReminder(); }
      else if (c === 'cancelAdd') { hideAddForm(); }
      else if (c === 'complete' && arg) { toggleComplete(arg); }
      else if (c === 'delete' && arg) { deleteReminder(arg); }
      else if (c === 'filter' && arg) { currentFilter = arg; renderRemindersView(); }
      else if (c === 'sort' && arg) { currentSort = arg; renderRemindersView(); }
    });
  }

  var DEFAULT_REMINDERS = [
    { id: 'rem1', title: 'Math homework submission', date: '2026-07-14T09:00:00', priority: 'high', completed: false, created: '2026-07-10T10:00:00Z' },
    { id: 'rem2', title: 'Physics lab report', date: '2026-07-15T14:00:00', priority: 'high', completed: false, created: '2026-07-09T08:00:00Z' },
    { id: 'rem3', title: 'Study for Chemistry test', date: '2026-07-16T08:00:00', priority: 'high', completed: false, created: '2026-07-08T12:00:00Z' },
    { id: 'rem4', title: 'Read English chapter 7', date: '2026-07-13T18:00:00', priority: 'medium', completed: false, created: '2026-07-11T09:00:00Z' },
    { id: 'rem5', title: 'Practice Python exercises', date: '2026-07-14T16:00:00', priority: 'medium', completed: true, created: '2026-07-10T11:00:00Z' },
    { id: 'rem6', title: 'Submit history project', date: '2026-07-18T10:00:00', priority: 'medium', completed: false, created: '2026-07-07T14:00:00Z' },
    { id: 'rem7', title: 'Review Biology notes', date: '2026-07-13T20:00:00', priority: 'low', completed: false, created: '2026-07-12T08:00:00Z' },
    { id: 'rem8', title: 'Update study planner', date: '2026-07-12T22:00:00', priority: 'low', completed: true, created: '2026-07-10T15:00:00Z' }
  ];

  var currentFilter = 'all';
  var currentSort = 'date';
  var addFormVisible = false;

  function getReminders() {
    var reminders = store.get('reminders');
    if (!reminders || reminders.length === 0) {
      reminders = DEFAULT_REMINDERS;
      store.set('reminders', reminders);
    }
    return reminders;
  }

  function saveReminders(reminders) {
    store.set('reminders', reminders);
  }

  function showAddForm() {
    addFormVisible = true;
    renderRemindersView();
    setTimeout(function() {
      var input = document.getElementById('rem-title-input');
      if (input) input.focus();
    }, 100);
  }

  function hideAddForm() {
    addFormVisible = false;
    renderRemindersView();
  }

  function saveReminder() {
    var titleEl = document.getElementById('rem-title-input');
    var dateEl = document.getElementById('rem-date-input');
    var priorityEl = document.getElementById('rem-priority-input');
    if (!titleEl || !dateEl || !priorityEl) return;
    var title = titleEl.value.trim();
    var date = dateEl.value;
    var priority = priorityEl.value;
    if (!title) {
      window.showToast && window.showToast('Please enter a title', 'error');
      return;
    }
    if (!date) {
      window.showToast && window.showToast('Please select a date/time', 'error');
      return;
    }
    var reminders = getReminders();
    reminders.unshift({
      id: 'rem_' + Date.now().toString(36),
      title: title,
      date: date,
      priority: priority,
      completed: false,
      created: new Date().toISOString()
    });
    saveReminders(reminders);
    addFormVisible = false;
    window.showToast && window.showToast('Reminder created!', 'success');
    renderRemindersView();
  }

  function toggleComplete(remId) {
    var reminders = getReminders();
    for (var i = 0; i < reminders.length; i++) {
      if (reminders[i].id === remId) {
        reminders[i].completed = !reminders[i].completed;
        break;
      }
    }
    saveReminders(reminders);
    window.showToast && window.showToast(reminders.filter(function(r) { return r.completed; })[0] ? 'Reminder completed!' : 'Reminder uncompleted', 'success');
    renderRemindersView();
  }

  function deleteReminder(remId) {
    var reminders = getReminders();
    var filtered = [];
    for (var i = 0; i < reminders.length; i++) {
      if (reminders[i].id !== remId) filtered.push(reminders[i]);
    }
    saveReminders(filtered);
    window.showToast && window.showToast('Reminder deleted', 'success');
    renderRemindersView();
  }

  function sortReminders(reminders) {
    var arr = reminders.slice();
    arr.sort(function(a, b) {
      if (currentSort === 'date') {
        return new Date(a.date) - new Date(b.date);
      } else if (currentSort === 'priority') {
        var pOrder = { high: 0, medium: 1, low: 2 };
        return (pOrder[a.priority] || 1) - (pOrder[b.priority] || 1);
      }
      return 0;
    });
    return arr;
  }

  function formatDate(dateStr) {
    if (!dateStr) return '';
    var d = new Date(dateStr);
    if (isNaN(d.getTime())) return dateStr;
    var now = new Date();
    var today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    var targetDay = new Date(d.getFullYear(), d.getMonth(), d.getDate());
    var diffDays = Math.floor((targetDay - today) / 86400000);
    var timeStr = '';
    var h = d.getHours();
    var m = d.getMinutes();
    var ampm = h >= 12 ? 'PM' : 'AM';
    if (h > 12) h -= 12;
    if (h === 0) h = 12;
    timeStr = h + ':' + (m < 10 ? '0' : '') + m + ' ' + ampm;

    if (diffDays === 0) return 'Today, ' + timeStr;
    if (diffDays === 1) return 'Tomorrow, ' + timeStr;
    if (diffDays === -1) return 'Yesterday, ' + timeStr;
    return utils.formatDate(d, 'dd MMM') + ', ' + timeStr;
  }

  function isOverdue(dateStr) {
    if (!dateStr) return false;
    return new Date(dateStr) < new Date();
  }

  function renderRemindersView() {
    var mc = document.getElementById('main-content');
    if (!mc) return;
    var reminders = getReminders();
    var filtered = [];
    for (var fi = 0; fi < reminders.length; fi++) {
      if (currentFilter === 'all') filtered.push(reminders[fi]);
      else if (currentFilter === 'active' && !reminders[fi].completed) filtered.push(reminders[fi]);
      else if (currentFilter === 'completed' && reminders[fi].completed) filtered.push(reminders[fi]);
    }
    var sorted = sortReminders(filtered);

    var activeCount = 0;
    var completedCount = 0;
    var overdueCount = 0;
    for (var ri = 0; ri < reminders.length; ri++) {
      if (reminders[ri].completed) completedCount++;
      else { activeCount++; if (isOverdue(reminders[ri].date)) overdueCount++; }
    }

    var html = '<div style="padding:var(--space-5);max-width:800px;margin:0 auto;">';
    html += '<div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:var(--space-5);flex-wrap:wrap;gap:var(--space-3)">';
    html += '<div><h2 style="font-size:var(--text-xl);font-weight:700;color:var(--text-primary);margin:0">&#x1F514; Reminders</h2>';
    html += '<p style="font-size:var(--text-sm);color:var(--text-tertiary);margin:var(--space-1) 0 0 0">' + activeCount + ' active \u2022 ' + completedCount + ' completed' + (overdueCount > 0 ? ' \u2022 <span style="color:var(--accent-red)">' + overdueCount + ' overdue</span>' : '') + '</p></div>';
    html += '<button class="btn btn-primary btn-sm" data-action="rem:add">+ New Reminder</button>';
    html += '</div>';

    html += '<div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:var(--space-4);flex-wrap:wrap;gap:var(--space-2)">';
    html += '<div style="display:flex;gap:var(--space-2)">';
    var filters = [
      { id: 'all', label: 'All' },
      { id: 'active', label: 'Active' },
      { id: 'completed', label: 'Completed' }
    ];
    for (var ffi = 0; ffi < filters.length; ffi++) {
      html += '<button class="btn ' + (currentFilter === filters[ffi].id ? 'btn-primary' : 'btn-ghost') + ' btn-sm" data-action="rem:filter:' + filters[ffi].id + '">' + filters[ffi].label + '</button>';
    }
    html += '</div>';
    html += '<div style="display:flex;align-items:center;gap:var(--space-2)">';
    html += '<span style="font-size:var(--text-xs);color:var(--text-tertiary)">Sort:</span>';
    html += '<select class="input-field" style="width:auto;padding:4px 28px 4px 8px;font-size:var(--text-xs)" onchange="document.querySelector(\'[data-action=rem:sort:\'+this.value+\']\') && document.querySelector(\'[data-action=rem:sort:\'+this.value+\']\').click()">';
    html += '<option value="date"' + (currentSort === 'date' ? ' selected' : '') + '>Date</option>';
    html += '<option value="priority"' + (currentSort === 'priority' ? ' selected' : '') + '>Priority</option>';
    html += '</select>';
    html += '</div>';
    html += '</div>';

    if (addFormVisible) {
      html += '<div class="glass-card" style="padding:var(--space-4);margin-bottom:var(--space-4);border-left:4px solid var(--accent-blue)">';
      html += '<div style="font-weight:600;color:var(--text-primary);margin-bottom:var(--space-3);font-size:var(--text-sm)">New Reminder</div>';
      html += '<div style="display:grid;grid-template-columns:1fr 1fr 120px;gap:var(--space-3);margin-bottom:var(--space-3)">';
      html += '<input type="text" class="input-field" id="rem-title-input" placeholder="Reminder title" style="padding:var(--space-2) var(--space-3);font-size:var(--text-sm)">';
      html += '<input type="datetime-local" class="input-field" id="rem-date-input" style="padding:var(--space-2) var(--space-3);font-size:var(--text-sm)">';
      html += '<select class="input-field" id="rem-priority-input" style="padding:var(--space-2) var(--space-3);font-size:var(--text-sm)">';
      html += '<option value="high">High</option>';
      html += '<option value="medium" selected>Medium</option>';
      html += '<option value="low">Low</option>';
      html += '</select>';
      html += '</div>';
      html += '<div style="display:flex;gap:var(--space-2);justify-content:flex-end">';
      html += '<button class="btn btn-ghost btn-sm" data-action="rem:cancelAdd">Cancel</button>';
      html += '<button class="btn btn-primary btn-sm" data-action="rem:save">Save Reminder</button>';
      html += '</div></div>';
    }

    if (sorted.length === 0) {
      html += '<div style="text-align:center;padding:var(--space-8) 0">';
      html += '<div style="font-size:48px;margin-bottom:var(--space-3)">&#x1F514;</div>';
      html += '<div style="font-weight:600;color:var(--text-primary);margin-bottom:var(--space-2)">' + (currentFilter === 'completed' ? 'No completed reminders' : 'No reminders') + '</div>';
      html += '<div style="font-size:var(--text-sm);color:var(--text-tertiary);margin-bottom:var(--space-4)">Stay organized with reminders</div>';
      if (!addFormVisible) html += '<button class="btn btn-primary" data-action="rem:add">+ Create Reminder</button>';
      html += '</div>';
    } else {
      var priorityColors = { high: 'var(--accent-red)', medium: 'var(--accent-yellow)', low: 'var(--accent-green)' };
      var priorityBg = { high: 'rgba(239,68,68,0.08)', medium: 'rgba(245,158,11,0.08)', low: 'rgba(16,185,129,0.08)' };
      for (var si = 0; si < sorted.length; si++) {
        var rem = sorted[si];
        var overdue = !rem.completed && isOverdue(rem.date);
        html += '<div class="glass-card" style="padding:var(--space-4);margin-bottom:var(--space-3);' + (rem.completed ? 'opacity:0.6;' : '') + (overdue ? 'border-left:4px solid var(--accent-red);' : 'border-left:4px solid ' + priorityColors[rem.priority] + ';') + '">';
        html += '<div style="display:flex;align-items:center;gap:var(--space-3)">';
        html += '<div style="width:28px;height:28px;border-radius:50%;border:2px solid ' + (rem.completed ? 'var(--accent-green)' : priorityColors[rem.priority]) + ';display:flex;align-items:center;justify-content:center;cursor:pointer;flex-shrink:0;transition:all 0.2s" data-action="rem:complete:' + rem.id + '">';
        if (rem.completed) html += '<span style="color:var(--accent-green);font-size:12px">&#10003;</span>';
        html += '</div>';
        html += '<div style="flex:1;min-width:0">';
        html += '<div style="font-weight:600;color:var(--text-primary);font-size:var(--text-sm);' + (rem.completed ? 'text-decoration:line-through;opacity:0.7' : '') + '">' + utils.sanitizeHTML(rem.title) + '</div>';
        html += '<div style="display:flex;align-items:center;gap:var(--space-2);margin-top:2px">';
        html += '<span style="font-size:var(--text-xs);color:' + (overdue ? 'var(--accent-red)' : 'var(--text-tertiary)') + '">' + formatDate(rem.date) + '</span>';
        html += '<span class="badge badge-' + (rem.priority === 'high' ? 'red' : rem.priority === 'medium' ? 'yellow' : 'green') + '" style="font-size:10px;padding:1px 6px">' + rem.priority + '</span>';
        if (overdue) html += '<span style="font-size:10px;color:var(--accent-red);font-weight:600">OVERDUE</span>';
        html += '</div></div>';
        html += '<button class="btn btn-ghost btn-sm" style="padding:4px 8px;font-size:var(--text-xs);color:var(--accent-red);flex-shrink:0" data-action="rem:delete:' + rem.id + '">&#x1F5D1;&#xFE0F;</button>';
        html += '</div></div>';
      }
    }

    html += '</div>';
    mc.innerHTML = html;
  }

  window.renderPage.reminders = function() {
    currentFilter = 'all';
    currentSort = 'date';
    addFormVisible = false;
    renderRemindersView();
  };
})();
