window.renderPage.calendar = function(params) {
  var mainContent = document.getElementById('main-content');
  var store = window.Store;
  var utils = window.Utils;
  var md = window.mockData;

  var currentView = 'month';
  var viewDate = new Date();
  var today = new Date();
  var selectedDate = new Date();
  var dragEventId = null;

  var eventColors = { study: '#3b82f6', assignment: '#f97316', exam: '#ef4444', personal: '#8b5cf6', class: '#10b981' };
  var weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  var weekDaysFull = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  var fullMonths = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  var shortMonths = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  var priorityLabels = { high: 'High', medium: 'Medium', low: 'Low' };
  var priorityColors = { high: '#ef4444', medium: '#f59e0b', low: '#10b981' };

  var hourSlots = [];
  for (var hi = 6; hi <= 22; hi++) {
    hourSlots.push(hi);
  }

  document.addEventListener('click', function(e) {
    var t = e.target.closest('[data-action^="cal:"]');
    if (!t) return;
    var a = t.getAttribute('data-action');
    var p = a.split(':');
    var c = p[1];
    if (c === 'closeModal') { var ov = t.closest('.cal-modal-overlay'); if (ov) ov.remove(); }
    else if (c === 'deleteEvent') { deleteEventById(t.getAttribute('data-event-id')); var ov2 = t.closest('.cal-modal-overlay'); if (ov2) ov2.remove(); }
    else if (c === 'editEvent') { editEvent(t.getAttribute('data-event-id')); }
    else if (c === 'saveEvent') { saveEvent(t.closest('.cal-modal-overlay')); }
    else if (c === 'updateEvent') { updateEvent(t.getAttribute('data-event-id'), t.closest('.cal-modal-overlay')); }
    else if (c === 'clickEvent') { clickEvent(t.getAttribute('data-event-id')); }
    else if (c === 'showCreateModal') { showCreateModal(t.getAttribute('data-date')); }
    else if (c === 'addEvent') { showCreateModal(); }
    else if (c === 'navigate') { navigate(parseInt(t.getAttribute('data-delta'), 10)); }
    else if (c === 'today') { goToday(); }
    else if (c === 'viewMonth') { setView('month'); }
    else if (c === 'viewWeek') { setView('week'); }
    else if (c === 'viewDay') { setView('day'); }
    else if (c === 'viewAgenda') { setView('agenda'); }
    else if (c === 'toggleTask') { toggleTask(t.getAttribute('data-task-id')); }
    else if (c === 'selectDate') { selectDate(parseInt(t.getAttribute('data-year'), 10), parseInt(t.getAttribute('data-month'), 10), parseInt(t.getAttribute('data-day'), 10)); }
    else if (c === 'clickSlot') { clickSlot(parseInt(t.getAttribute('data-year'), 10), parseInt(t.getAttribute('data-month'), 10), parseInt(t.getAttribute('data-day'), 10), parseInt(t.getAttribute('data-hour'), 10)); }
    else if (c === 'dragPick') { dragPickEvent(t.getAttribute('data-event-id')); }
    else if (c === 'dragDrop') { dragDropEvent(parseInt(t.getAttribute('data-year'), 10), parseInt(t.getAttribute('data-month'), 10), parseInt(t.getAttribute('data-day'), 10)); }
    else if (c === 'cancelDrag') { cancelDrag(); }
  });

  var subjectMap = {};
  var allSubjects = md.subjects || [];
  for (var si = 0; si < allSubjects.length; si++) {
    subjectMap[allSubjects[si].id] = allSubjects[si].name;
  }

  function getSubjectName(id) { return subjectMap[id] || 'General'; }
  function pad(n) { return (n < 10 ? '0' : '') + n; }
  function formatDateKey(y, m, d) { return y + '-' + pad(m + 1) + '-' + pad(d); }
  function formatDateKeyFromDate(d) { return formatDateKey(d.getFullYear(), d.getMonth(), d.getDate()); }
  function getTypeColor(t) { return eventColors[t] || '#3b82f6'; }
  function getTypeLabel(t) {
    var m = { study: 'Study', assignment: 'Assignment', exam: 'Exam', personal: 'Personal', class: 'Class' };
    return m[t] || 'Event';
  }
  function getTimeLabel(s) {
    if (!s) return '';
    var p = s.split(':');
    var h = parseInt(p[0], 10);
    var m = p[1] || '00';
    var a = h >= 12 ? 'PM' : 'AM';
    if (h > 12) h -= 12;
    if (h === 0) h = 12;
    return h + ':' + m + ' ' + a;
  }
  function isToday(d) { return d.getFullYear() === today.getFullYear() && d.getMonth() === today.getMonth() && d.getDate() === today.getDate(); }
  function getDaysInMonth(y, m) { return new Date(y, m + 1, 0).getDate(); }
  function getFirstDayOfMonth(y, m) { return new Date(y, m, 1).getDay(); }
  function getWeekRange(d) {
    var d2 = new Date(d);
    d2.setDate(d2.getDate() - d2.getDay());
    var s = new Date(d2);
    d2.setDate(d2.getDate() + 6);
    return { start: s, end: new Date(d2) };
  }
  function getStatusLabel(status) { var l = { pending: 'Pending', submitted: 'Submitted', overdue: 'Overdue', graded: 'Graded' }; return l[status] || status || 'Pending'; }
  function getStatusColor(status) { var c = { pending: '#f59e0b', submitted: '#10b981', overdue: '#ef4444', graded: '#3b82f6' }; return c[status] || '#6b7280'; }

  function getCalendarEvents() {
    var userEvents = store.get('calendarEvents') || [];
    var platformEvents = (md.events || []).map(function(e) {
      return { id: e.id || 'pe_' + Math.random().toString(36).slice(2), title: e.title || e.name || '', type: 'study', date: e.date || '', startTime: e.time || '09:00', description: e.description || '', color: '#3b82f6', source: 'platform' };
    });
    return userEvents.concat(platformEvents);
  }

  function getEventsForDate(year, month, day) {
    var key = formatDateKey(year, month, day);
    var all = getCalendarEvents();
    var res = [];
    for (var i = 0; i < all.length; i++) { if (all[i].date === key) res.push(all[i]); }
    res.sort(function(a, b) { return (a.startTime || '00:00').localeCompare(b.startTime || '00:00'); });
    return res;
  }
  function getUpcomingTasks() { return store.get('tasks') || []; }
  function getUpcomingAssignments() {
    var all = store.get('assignments') || [];
    var todayKey = formatDateKeyFromDate(today);
    var res = [];
    for (var i = 0; i < all.length; i++) { if (all[i].dueDate && all[i].dueDate >= todayKey) res.push(all[i]); }
    res.sort(function(a, b) { return a.dueDate.localeCompare(b.dueDate); });
    return res.slice(0, 10);
  }
  function getUpcomingExams() {
    var all = store.get('exams') || [];
    var todayKey = formatDateKeyFromDate(today);
    var res = [];
    for (var i = 0; i < all.length; i++) {
      var ex = all[i];
      if (ex.scheduledDate) {
        var exDate = ex.scheduledDate.split('T')[0];
        if (exDate >= todayKey) res.push({ id: ex.id, title: ex.title, subjectId: ex.subjectId, date: exDate, scheduledDate: ex.scheduledDate, duration: ex.duration, totalMarks: ex.totalMarks });
      }
    }
    res.sort(function(a, b) { return a.date.localeCompare(b.date); });
    return res.slice(0, 10);
  }
  function getUpcomingEvents() {
    var all = getCalendarEvents();
    var todayKey = formatDateKeyFromDate(today);
    var res = [];
    for (var i = 0; i < all.length; i++) { if (all[i].date && all[i].date >= todayKey) res.push(all[i]); }
    res.sort(function(a, b) { return a.date.localeCompare(b.date) || (a.startTime || '00:00').localeCompare(b.startTime || '00:00'); });
    return res.slice(0, 10);
  }
  function getUpcomingClasses() {
    var all = getCalendarEvents();
    var todayKey = formatDateKeyFromDate(today);
    var res = [];
    for (var i = 0; i < all.length; i++) { if (all[i].type === 'class' && all[i].date && all[i].date >= todayKey) res.push(all[i]); }
    res.sort(function(a, b) { return a.date.localeCompare(b.date) || (a.startTime || '00:00').localeCompare(b.startTime || '00:00'); });
    return res.slice(0, 5);
  }

  function toggleTask(id) {
    var tasks = getUpcomingTasks();
    for (var i = 0; i < tasks.length; i++) { if (tasks[i].id === id) { tasks[i].completed = !tasks[i].completed; break; } }
    store.set('tasks', tasks);
    render();
  }
  function setView(view) { currentView = view; render(); }
  function navigate(delta) {
    if (currentView === 'month') viewDate.setMonth(viewDate.getMonth() + delta);
    else if (currentView === 'week' || currentView === 'agenda') viewDate.setDate(viewDate.getDate() + delta * 7);
    else if (currentView === 'day') viewDate.setDate(viewDate.getDate() + delta);
    render();
  }
  function goToday() { viewDate = new Date(today); selectedDate = new Date(today); render(); }

  function showEventModal(ev) {
    var overlay = document.createElement('div');
    overlay.className = 'cal-modal-overlay';
    var tc = getTypeColor(ev.type);
    var dateLabel = '';
    if (ev.date) {
      var dp = ev.date.split('-');
      var dobj = new Date(parseInt(dp[0], 10), parseInt(dp[1], 10) - 1, parseInt(dp[2], 10));
      dateLabel = weekDaysFull[dobj.getDay()] + ', ' + dobj.getDate() + ' ' + shortMonths[dobj.getMonth()] + ' ' + dobj.getFullYear();
    }
    var html = '<div class="cal-modal">';
    html += '<div class="cal-modal-header" style="border-left:4px solid ' + tc + '">';
    html += '<div style="flex:1"><h3 style="font-size:var(--text-lg);font-weight:600;margin:0">' + utils.sanitizeHTML(ev.title) + '</h3>';
    html += '<div class="c-fs-xs c-text-tertiary c-mt-1">ID: EVT-' + ev.id + '</div>';
    html += '<div style="display:flex;align-items:center;gap:var(--space-2);margin-top:4px"><span class="cal-badge" style="background:' + tc + '20;color:' + tc + ';border:1px solid ' + tc + '40">' + getTypeLabel(ev.type) + '</span>';
    if (ev.source) html += '<span class="cal-badge" style="background:var(--bg-glass);font-size:10px">' + utils.sanitizeHTML(ev.source) + '</span>';
    html += '</div></div>';
    html += '<button class="cal-btn-close" data-action="cal:closeModal">&times;</button></div>';
    html += '<div class="cal-modal-body">';
    html += '<div class="cal-detail-row"><span class="cal-detail-icon">&#128197;</span><span>' + dateLabel + '</span></div>';
    if (ev.startTime) html += '<div class="cal-detail-row"><span class="cal-detail-icon">&#128336;</span><span>' + getTimeLabel(ev.startTime) + '</span></div>';
    if (ev.description) html += '<div class="cal-detail-desc">' + utils.sanitizeHTML(ev.description) + '</div>';
    if (ev.priority) html += '<div class="cal-detail-row"><span class="cal-detail-icon">&#9888;&#65039;</span><span style="color:' + (priorityColors[ev.priority] || '#6b7280') + '">Priority: ' + (priorityLabels[ev.priority] || ev.priority) + '</span></div>';
    html += '</div>';
    html += '<div class="cal-modal-footer">';
    if (!ev.source || ev.source === 'user') {
      html += '<button class="cal-btn cal-btn-danger" data-action="cal:deleteEvent" data-event-id="' + ev.id + '">Delete</button>';
      html += '<button class="cal-btn cal-btn-secondary" data-action="cal:editEvent" data-event-id="' + ev.id + '">Edit</button>';
      html += '<button class="cal-btn cal-btn-primary" data-action="cal:dragPick" data-event-id="' + ev.id + '">Move</button>';
    }
    html += '<button class="cal-btn cal-btn-secondary" data-action="cal:closeModal">Close</button>';
    html += '</div></div>';
    overlay.innerHTML = html;
    document.body.appendChild(overlay);
    overlay.addEventListener('click', function(e) { if (e.target === overlay) overlay.remove(); });
  }

  function showCreateModal(dateStr) {
    var overlay = document.createElement('div');
    overlay.className = 'cal-modal-overlay';
    var dateValue = dateStr || formatDateKeyFromDate(selectedDate);
    var html = '<div class="cal-modal">';
    html += '<div class="cal-modal-header"><h3 style="font-size:var(--text-lg);font-weight:600;margin:0">Add New Event</h3><button class="cal-btn-close" data-action="cal:closeModal">&times;</button></div>';
    html += '<div class="cal-modal-body">';
    html += '<div class="cal-form-group"><label class="cal-label">Title *</label><input type="text" class="cal-input" id="cal-title" placeholder="Event title"></div>';
    html += '<div class="cal-form-group"><label class="cal-label">Type</label><div class="cal-type-grid">';
    var types = [{v:'study',l:'Study',c:'#3b82f6'},{v:'assignment',l:'Assignment',c:'#f97316'},{v:'exam',l:'Exam',c:'#ef4444'},{v:'personal',l:'Personal',c:'#8b5cf6'},{v:'class',l:'Class',c:'#10b981'}];
    for (var ti = 0; ti < types.length; ti++) {
      html += '<label class="cal-type-option"><input type="radio" name="cal-type" value="' + types[ti].v + '"' + (types[ti].v === 'study' ? ' checked' : '') + '><span class="cal-type-dot" style="background:' + types[ti].c + '"></span>' + types[ti].l + '</label>';
    }
    html += '</div></div>';
    html += '<div class="cal-form-row"><div class="cal-form-group"><label class="cal-label">Date *</label><input type="date" class="cal-input" id="cal-date" value="' + dateValue + '"></div>';
    html += '<div class="cal-form-group"><label class="cal-label">Time</label><input type="time" class="cal-input" id="cal-time" value="09:00"></div></div>';
    html += '<div class="cal-form-group"><label class="cal-label">Priority</label><select class="cal-input" id="cal-priority"><option value="low">Low</option><option value="medium" selected>Medium</option><option value="high">High</option></select></div>';
    html += '<div class="cal-form-group"><label class="cal-label">Description</label><textarea class="cal-input cal-textarea" id="cal-desc" rows="3" placeholder="Add notes..."></textarea></div>';
    html += '</div>';
    html += '<div class="cal-modal-footer"><button class="cal-btn cal-btn-secondary" data-action="cal:closeModal">Cancel</button><button class="cal-btn cal-btn-primary" data-action="cal:saveEvent">Add Event</button></div></div>';
    overlay.innerHTML = html;
    document.body.appendChild(overlay);
    overlay.addEventListener('click', function(e) { if (e.target === overlay) overlay.remove(); });
  }

  function saveEvent(overlay) {
    var title = document.getElementById('cal-title').value.trim();
    var typeEls = document.getElementsByName('cal-type');
    var type = 'study';
    for (var i = 0; i < typeEls.length; i++) { if (typeEls[i].checked) { type = typeEls[i].value; break; } }
    var date = document.getElementById('cal-date').value;
    var startTime = document.getElementById('cal-time').value;
    var priority = document.getElementById('cal-priority').value;
    var description = document.getElementById('cal-desc').value.trim();
    if (!title || !date) return;
    var events = store.get('calendarEvents') || [];
    events.push({ id: utils.generateId(), title: title, type: type, date: date, startTime: startTime, priority: priority, description: description, color: getTypeColor(type), source: 'user', createdAt: new Date().toISOString() });
    store.set('calendarEvents', events);
    if (overlay) overlay.remove();
    render();
  }

  function deleteEventById(id) {
    var events = store.get('calendarEvents') || [];
    events = events.filter(function(e) { return e.id !== id; });
    store.set('calendarEvents', events);
    render();
  }

  function editEvent(id) {
    var events = store.get('calendarEvents') || [];
    var ev = null;
    for (var i = 0; i < events.length; i++) { if (events[i].id === id) { ev = events[i]; break; } }
    if (!ev) return;
    var typeKeys = ['study', 'assignment', 'exam', 'personal', 'class'];
    var typeLabels = { study: 'Study', assignment: 'Assignment', exam: 'Exam', personal: 'Personal', class: 'Class' };
    var html = '<div class="cal-modal"><div class="cal-modal-header"><h3 style="font-size:var(--text-lg);font-weight:600;margin:0">Edit Event</h3><button class="cal-btn-close" data-action="cal:closeModal">&times;</button></div>';
    html += '<div class="cal-modal-body">';
    html += '<div class="cal-form-group"><label class="cal-label">Title *</label><input type="text" class="cal-input" id="cal-edit-title" value="' + utils.sanitizeHTML(ev.title) + '"></div>';
    html += '<div class="cal-form-group"><label class="cal-label">Type</label><div class="cal-type-grid">';
    for (var ti = 0; ti < typeKeys.length; ti++) {
      html += '<label class="cal-type-option"><input type="radio" name="cal-edit-type" value="' + typeKeys[ti] + '"' + (ev.type === typeKeys[ti] ? ' checked' : '') + '><span class="cal-type-dot" style="background:' + getTypeColor(typeKeys[ti]) + '"></span>' + typeLabels[typeKeys[ti]] + '</label>';
    }
    html += '</div></div>';
    html += '<div class="cal-form-row"><div class="cal-form-group"><label class="cal-label">Date *</label><input type="date" class="cal-input" id="cal-edit-date" value="' + ev.date + '"></div>';
    html += '<div class="cal-form-group"><label class="cal-label">Time</label><input type="time" class="cal-input" id="cal-edit-time" value="' + (ev.startTime || '09:00') + '"></div></div>';
    html += '<div class="cal-form-group"><label class="cal-label">Priority</label><select class="cal-input" id="cal-edit-priority"><option value="low"' + (ev.priority === 'low' ? ' selected' : '') + '>Low</option><option value="medium"' + (ev.priority === 'medium' ? ' selected' : '') + '>Medium</option><option value="high"' + (ev.priority === 'high' ? ' selected' : '') + '>High</option></select></div>';
    html += '<div class="cal-form-group"><label class="cal-label">Description</label><textarea class="cal-input cal-textarea" id="cal-edit-desc" rows="3">' + utils.sanitizeHTML(ev.description || '') + '</textarea></div>';
    html += '</div><div class="cal-modal-footer"><button class="cal-btn cal-btn-secondary" data-action="cal:closeModal">Cancel</button><button class="cal-btn cal-btn-primary" data-action="cal:updateEvent" data-event-id="' + id + '">Save Changes</button></div></div>';
    var overlay = document.createElement('div');
    overlay.className = 'cal-modal-overlay';
    overlay.innerHTML = html;
    document.body.appendChild(overlay);
    overlay.addEventListener('click', function(e) { if (e.target === overlay) overlay.remove(); });
  }

  function updateEvent(id, overlay) {
    var events = store.get('calendarEvents') || [];
    for (var i = 0; i < events.length; i++) {
      if (events[i].id === id) {
        events[i].title = document.getElementById('cal-edit-title').value.trim();
        var typeEls = document.getElementsByName('cal-edit-type');
        for (var j = 0; j < typeEls.length; j++) { if (typeEls[j].checked) { events[i].type = typeEls[j].value; break; } }
        events[i].date = document.getElementById('cal-edit-date').value;
        events[i].startTime = document.getElementById('cal-edit-time').value;
        events[i].priority = document.getElementById('cal-edit-priority').value;
        events[i].description = document.getElementById('cal-edit-desc').value.trim();
        events[i].color = getTypeColor(events[i].type);
        break;
      }
    }
    store.set('calendarEvents', events);
    if (overlay) overlay.remove();
    render();
  }

  function clickEvent(id) {
    var all = getCalendarEvents();
    for (var i = 0; i < all.length; i++) { if (all[i].id === id) { showEventModal(all[i]); return; } }
  }

  function clickSlot(year, month, day, hour) {
    showCreateModal(formatDateKey(year, month, day));
  }

  function selectDate(year, month, day) {
    selectedDate = new Date(year, month, day);
    if (currentView === 'month') { setView('day'); viewDate = new Date(year, month, day); return; }
    render();
  }

  function dragPickEvent(id) {
    dragEventId = id;
    var ov = document.querySelector('.cal-modal-overlay');
    if (ov) ov.remove();
    showToast('Click any day cell to move this event');
    render();
  }

  function dragDropEvent(year, month, day) {
    if (!dragEventId) return;
    var newDate = formatDateKey(year, month, day);
    var events = store.get('calendarEvents') || [];
    for (var i = 0; i < events.length; i++) {
      if (events[i].id === dragEventId) { events[i].date = newDate; break; }
    }
    store.set('calendarEvents', events);
    dragEventId = null;
    showToast('Event moved successfully!');
    render();
  }

  function cancelDrag() { dragEventId = null; render(); }

  function showToast(msg) {
    var t = document.createElement('div');
    t.className = 'cal-toast';
    t.textContent = msg;
    document.body.appendChild(t);
    setTimeout(function() { t.remove(); }, 2500);
  }

  function getViewTitle() {
    if (currentView === 'month') return fullMonths[viewDate.getMonth()] + ' ' + viewDate.getFullYear();
    if (currentView === 'week') {
      var r = getWeekRange(viewDate);
      return shortMonths[r.start.getMonth()] + ' ' + r.start.getDate() + ' \u2013 ' + shortMonths[r.end.getMonth()] + ' ' + r.end.getDate() + ', ' + r.end.getFullYear();
    }
    if (currentView === 'agenda') return 'Agenda \u2013 ' + fullMonths[viewDate.getMonth()] + ' ' + viewDate.getFullYear();
    return weekDaysFull[viewDate.getDay()] + ', ' + viewDate.getDate() + ' ' + fullMonths[viewDate.getMonth()] + ' ' + viewDate.getFullYear();
  }

  function render() {
    var html = '<div class="cal-page">';
    html += '<div class="cal-top-bar">';
    html += '<div class="cal-top-left"><h1 class="cal-page-title">&#128197; Calendar</h1>';
    if (dragEventId) html += '<button class="cal-btn cal-btn-danger cal-btn-sm" data-action="cal:cancelDrag">Cancel Move</button>';
    html += '</div>';
    html += '<div class="cal-top-right"><button class="cal-btn cal-btn-primary" data-action="cal:addEvent">+ Add Event</button></div></div>';
    html += '<div class="cal-toolbar">';
    html += '<div class="cal-toolbar-left"><button class="cal-btn cal-btn-ghost" data-action="cal:navigate" data-delta="-1">&#9664;</button>';
    html += '<span class="cal-toolbar-title">' + getViewTitle() + '</span>';
    html += '<button class="cal-btn cal-btn-ghost" data-action="cal:navigate" data-delta="1">&#9654;</button>';
    html += '<button class="cal-btn cal-btn-outline" data-action="cal:today">Today</button></div>';
    html += '<div class="cal-view-switcher">';
    html += '<button class="cal-view-btn' + (currentView === 'month' ? ' active' : '') + '" data-action="cal:viewMonth">Month</button>';
    html += '<button class="cal-view-btn' + (currentView === 'week' ? ' active' : '') + '" data-action="cal:viewWeek">Week</button>';
    html += '<button class="cal-view-btn' + (currentView === 'day' ? ' active' : '') + '" data-action="cal:viewDay">Day</button>';
    html += '<button class="cal-view-btn' + (currentView === 'agenda' ? ' active' : '') + '" data-action="cal:viewAgenda">Agenda</button>';
    html += '</div></div>';
    html += '<div class="cal-body">';
    html += '<div class="cal-main">';
    if (currentView === 'month') html += renderMonthView();
    else if (currentView === 'week') html += renderWeekView();
    else if (currentView === 'day') html += renderDayView();
    else html += renderAgendaView();
    html += '</div>';
    html += '<div class="cal-sidebar">' + renderSidebar() + '</div>';
    html += '</div></div>';
    mainContent.innerHTML = html;
    injectStyles();
  }

  function renderSidebar() {
    var html = '<div class="cal-sidebar-section">';
    html += '<div class="cal-sidebar-title">&#128197; Upcoming Events</div>';
    var events = getUpcomingEvents();
    if (events.length === 0) html += '<div class="cal-sidebar-empty">No upcoming events</div>';
    for (var i = 0; i < Math.min(events.length, 5); i++) {
      var ev = events[i];
      var tc = getTypeColor(ev.type);
      var dp = ev.date.split('-');
      var dobj = new Date(parseInt(dp[0], 10), parseInt(dp[1], 10) - 1, parseInt(dp[2], 10));
      html += '<div class="cal-sidebar-item" data-action="cal:clickEvent" data-event-id="' + ev.id + '">';
      html += '<div class="cal-sidebar-dot" style="background:' + tc + '"></div>';
      html += '<div class="cal-sidebar-content"><div class="cal-sidebar-item-title">' + utils.sanitizeHTML(ev.title) + '</div>';
      html += '<div class="cal-sidebar-item-meta">' + shortMonths[dobj.getMonth()] + ' ' + dobj.getDate() + (ev.startTime ? ' \u00B7 ' + getTimeLabel(ev.startTime) : '') + '</div></div></div>';
    }
    html += '</div>';
    html += '<div class="cal-sidebar-section">';
    html += '<div class="cal-sidebar-title">&#128203; Upcoming Exams</div>';
    var exams = getUpcomingExams();
    if (exams.length === 0) html += '<div class="cal-sidebar-empty">No upcoming exams</div>';
    for (var ei = 0; ei < Math.min(exams.length, 5); ei++) {
      var ex = exams[ei];
      var ed = new Date(ex.date);
      var daysLeft = Math.round((ed - today) / 86400000);
      html += '<div class="cal-sidebar-item">';
      html += '<div class="cal-sidebar-dot" style="background:#ef4444"></div>';
      html += '<div class="cal-sidebar-content"><div class="cal-sidebar-item-title">' + utils.sanitizeHTML(ex.title) + '</div>';
      html += '<div class="cal-sidebar-item-meta">' + shortMonths[ed.getMonth()] + ' ' + ed.getDate() + ' \u00B7 ' + getSubjectName(ex.subjectId) + ' \u00B7 <span style="color:' + (daysLeft <= 3 ? '#ef4444' : daysLeft <= 7 ? '#f59e0b' : '#10b981') + '">' + daysLeft + 'd left</span></div></div></div>';
    }
    html += '</div>';
    html += '<div class="cal-sidebar-section">';
    html += '<div class="cal-sidebar-title">&#128221; Assignments</div>';
    var assignments = getUpcomingAssignments();
    if (assignments.length === 0) html += '<div class="cal-sidebar-empty">No assignments due</div>';
    for (var ai = 0; ai < Math.min(assignments.length, 5); ai++) {
      var a = assignments[ai];
      var sc = getStatusColor(a.status || 'pending');
      html += '<div class="cal-sidebar-item">';
      html += '<div class="cal-sidebar-dot" style="background:#f97316"></div>';
      html += '<div class="cal-sidebar-content"><div class="cal-sidebar-item-title">' + utils.sanitizeHTML(a.title) + '</div>';
      html += '<div class="cal-sidebar-item-meta">' + getSubjectName(a.subjectId) + ' \u00B7 <span class="cal-badge cal-badge-sm" style="background:' + sc + '20;color:' + sc + '">' + getStatusLabel(a.status) + '</span></div></div></div>';
    }
    html += '</div>';
    html += '<div class="cal-sidebar-section">';
    html += '<div class="cal-sidebar-title">&#127891; Classes</div>';
    var classes = getUpcomingClasses();
    if (classes.length === 0) html += '<div class="cal-sidebar-empty">No upcoming classes</div>';
    for (var ci = 0; ci < Math.min(classes.length, 5); ci++) {
      var cl = classes[ci];
      html += '<div class="cal-sidebar-item" data-action="cal:clickEvent" data-event-id="' + cl.id + '">';
      html += '<div class="cal-sidebar-dot" style="background:#10b981"></div>';
      html += '<div class="cal-sidebar-content"><div class="cal-sidebar-item-title">' + utils.sanitizeHTML(cl.title) + '</div>';
      html += '<div class="cal-sidebar-item-meta">' + (cl.startTime ? getTimeLabel(cl.startTime) : '') + '</div></div></div>';
    }
    html += '</div>';
    html += '<div class="cal-sidebar-section">';
    html += '<div class="cal-sidebar-title">&#128203; Tasks</div>';
    var tasks = getUpcomingTasks();
    if (tasks.length === 0) html += '<div class="cal-sidebar-empty">No tasks</div>';
    for (var ti2 = 0; ti2 < Math.min(tasks.length, 6); ti2++) {
      var t = tasks[ti2];
      html += '<div class="cal-sidebar-item">';
      html += '<input type="checkbox" ' + (t.completed ? 'checked' : '') + ' data-action="cal:toggleTask" data-task-id="' + t.id + '" class="cal-task-check">';
      html += '<div class="cal-sidebar-content"><div class="cal-sidebar-item-title" style="' + (t.completed ? 'text-decoration:line-through;color:var(--text-tertiary)' : '') + '">' + utils.sanitizeHTML(t.title) + '</div>';
      if (t.dueDate) html += '<div class="cal-sidebar-item-meta">' + t.dueDate + '</div>';
      html += '</div></div>';
    }
    html += '</div>';
    return html;
  }

  function renderMonthView() {
    var year = viewDate.getFullYear();
    var month = viewDate.getMonth();
    var daysInMonth = getDaysInMonth(year, month);
    var firstDay = getFirstDayOfMonth(year, month);
    var html = '<div class="cal-month-grid">';
    html += '<div class="cal-month-header">';
    for (var wd = 0; wd < 7; wd++) html += '<div class="cal-month-header-cell">' + weekDays[wd] + '</div>';
    html += '</div>';
    html += '<div class="cal-month-body">';
    for (var pad2 = 0; pad2 < firstDay; pad2++) html += '<div class="cal-month-cell cal-month-cell-empty"></div>';
    for (var day = 1; day <= daysInMonth; day++) {
      var dayEvents = getEventsForDate(year, month, day);
      var isT = day === today.getDate() && month === today.getMonth() && year === today.getFullYear();
      var isSel = day === selectedDate.getDate() && month === selectedDate.getMonth() && year === selectedDate.getFullYear();
      var isDragTarget = dragEventId ? ' cal-drag-target' : '';
      html += '<div class="cal-month-cell' + (isT ? ' cal-today' : '') + (isSel ? ' cal-selected' : '') + isDragTarget + '" data-action="' + (dragEventId ? 'cal:dragDrop' : 'cal:selectDate') + '" data-year="' + year + '" data-month="' + month + '" data-day="' + day + '">';
      html += '<div class="cal-month-day-num' + (isT ? ' cal-today-num' : '') + '">' + day + '</div>';
      html += '<div class="cal-month-events">';
      for (var e = 0; e < Math.min(dayEvents.length, 3); e++) {
        var ev = dayEvents[e];
        html += '<div class="cal-event-chip" style="background:' + getTypeColor(ev.type) + '20;color:' + getTypeColor(ev.type) + ';border-left:3px solid ' + getTypeColor(ev.type) + '" data-action="cal:clickEvent" data-event-id="' + ev.id + '">' + utils.sanitizeHTML(ev.title) + '</div>';
      }
      if (dayEvents.length > 3) html += '<div class="cal-more-events">+' + (dayEvents.length - 3) + ' more</div>';
      html += '</div></div>';
    }
    html += '</div></div>';
    return html;
  }

  function renderWeekView() {
    var range = getWeekRange(viewDate);
    var html = '<div class="cal-week-grid">';
    html += '<div class="cal-week-header">';
    html += '<div class="cal-week-time-gutter"></div>';
    for (var wd = 0; wd < 7; wd++) {
      var d = new Date(range.start);
      d.setDate(d.getDate() + wd);
      var isT = isToday(d);
      html += '<div class="cal-week-header-cell' + (isT ? ' cal-week-today' : '') + '">';
      html += '<div class="cal-week-day-name">' + weekDays[wd] + '</div>';
      html += '<div class="cal-week-day-num' + (isT ? ' cal-today-num' : '') + '">' + d.getDate() + '</div></div>';
    }
    html += '</div>';
    html += '<div class="cal-week-body">';
    for (var h = 0; h < hourSlots.length; h++) {
      var hr = hourSlots[h];
      var isCurHr = hr === today.getHours() && isToday(viewDate);
      html += '<div class="cal-week-row' + (isCurHr ? ' cal-current-hour' : '') + '">';
      html += '<div class="cal-week-time-gutter">' + getTimeLabel(pad(hr) + ':00') + '</div>';
      for (var wdi = 0; wdi < 7; wdi++) {
        var dd = new Date(range.start);
        dd.setDate(dd.getDate() + wdi);
        var dayEvts = getEventsForDate(dd.getFullYear(), dd.getMonth(), dd.getDate());
        var slotEvts = [];
        for (var ei = 0; ei < dayEvts.length; ei++) {
          if (dayEvts[ei].startTime && parseInt(dayEvts[ei].startTime.split(':')[0], 10) === hr) slotEvts.push(dayEvts[ei]);
        }
        html += '<div class="cal-week-cell" data-action="cal:clickSlot" data-year="' + dd.getFullYear() + '" data-month="' + dd.getMonth() + '" data-day="' + dd.getDate() + '" data-hour="' + hr + '">';
        for (var si2 = 0; si2 < Math.min(slotEvts.length, 2); si2++) {
          var se = slotEvts[si2];
          html += '<div class="cal-week-event" style="background:' + getTypeColor(se.type) + '20;border-left:3px solid ' + getTypeColor(se.type) + '" data-action="cal:clickEvent" data-event-id="' + se.id + '">' + utils.sanitizeHTML(se.title) + '</div>';
        }
        html += '</div>';
      }
      html += '</div>';
    }
    html += '</div></div>';
    return html;
  }

  function renderDayView() {
    var year = viewDate.getFullYear();
    var month = viewDate.getMonth();
    var day = viewDate.getDate();
    var dayEvents = getEventsForDate(year, month, day);
    var html = '<div class="cal-day-view">';
    html += '<div class="cal-day-header"><div><div class="cal-day-title">' + weekDaysFull[viewDate.getDay()] + ', ' + day + ' ' + fullMonths[month] + ' ' + year + '</div>';
    html += '<div class="cal-day-count">' + dayEvents.length + ' event' + (dayEvents.length !== 1 ? 's' : '') + '</div></div>';
    html += '<button class="cal-btn cal-btn-primary cal-btn-sm" data-action="cal:showCreateModal" data-date="' + formatDateKey(year, month, day) + '">+ Add</button></div>';
    html += '<div class="cal-day-timeline">';
    for (var h = 0; h < hourSlots.length; h++) {
      var hr = hourSlots[h];
      var slotEvts = [];
      for (var ei = 0; ei < dayEvents.length; ei++) {
        if (dayEvents[ei].startTime && parseInt(dayEvents[ei].startTime.split(':')[0], 10) === hr) slotEvts.push(dayEvents[ei]);
      }
      var isCurHr = hr === today.getHours() && isToday(viewDate);
      html += '<div class="cal-day-row' + (isCurHr ? ' cal-current-hour' : '') + '">';
      html += '<div class="cal-day-time">' + getTimeLabel(pad(hr) + ':00') + '</div>';
      html += '<div class="cal-day-slots">';
      for (var si3 = 0; si3 < slotEvts.length; si3++) {
        var se = slotEvts[si3];
        html += '<div class="cal-day-event" data-action="cal:clickEvent" data-event-id="' + se.id + '">';
        html += '<div class="cal-day-event-dot" style="background:' + getTypeColor(se.type) + '"></div>';
        html += '<div class="cal-day-event-content"><div class="cal-day-event-title">' + utils.sanitizeHTML(se.title) + '</div>';
        html += '<div class="cal-day-event-meta">' + getTypeLabel(se.type) + (se.priority ? ' \u00B7 ' + priorityLabels[se.priority] : '') + '</div></div></div>';
      }
      html += '<div class="cal-day-empty" data-action="cal:clickSlot" data-year="' + year + '" data-month="' + month + '" data-day="' + day + '" data-hour="' + hr + '"></div>';
      html += '</div></div>';
    }
    html += '</div></div>';
    return html;
  }

  function renderAgendaView() {
    var allEvents = getCalendarEvents();
    var todayKey = formatDateKeyFromDate(today);
    var futureEvents = [];
    for (var i = 0; i < allEvents.length; i++) { if (allEvents[i].date && allEvents[i].date >= todayKey) futureEvents.push(allEvents[i]); }
    futureEvents.sort(function(a, b) { return a.date.localeCompare(b.date) || (a.startTime || '00:00').localeCompare(b.startTime || '00:00'); });
    var html = '<div class="cal-agenda">';
    if (futureEvents.length === 0) {
      html += '<div class="cal-agenda-empty"><div class="cal-agenda-empty-icon">&#128197;</div><div class="cal-agenda-empty-text">No upcoming events</div></div>';
    } else {
      var lastDate = '';
      for (var ai2 = 0; ai2 < futureEvents.length; ai2++) {
        var ev = futureEvents[ai2];
        if (ev.date !== lastDate) {
          lastDate = ev.date;
          var dp = ev.date.split('-');
          var dobj = new Date(parseInt(dp[0], 10), parseInt(dp[1], 10) - 1, parseInt(dp[2], 10));
          var isT = isToday(dobj);
          html += '<div class="cal-agenda-date-header' + (isT ? ' cal-agenda-today' : '') + '">';
          html += '<div class="cal-agenda-date-weekday">' + weekDaysFull[dobj.getDay()] + '</div>';
          html += '<div class="cal-agenda-date-num' + (isT ? ' cal-today-num' : '') + '">' + dobj.getDate() + ' ' + shortMonths[dobj.getMonth()] + '</div></div>';
        }
        var tc = getTypeColor(ev.type);
        html += '<div class="cal-agenda-item" data-action="cal:clickEvent" data-event-id="' + ev.id + '">';
        html += '<div class="cal-agenda-time">' + (ev.startTime ? getTimeLabel(ev.startTime) : 'All day') + '</div>';
        html += '<div class="cal-agenda-dot" style="background:' + tc + '"></div>';
        html += '<div class="cal-agenda-content"><div class="cal-agenda-title">' + utils.sanitizeHTML(ev.title) + '</div>';
        html += '<div class="cal-agenda-meta"><span class="cal-badge cal-badge-sm" style="background:' + tc + '20;color:' + tc + '">' + getTypeLabel(ev.type) + '</span></div></div></div>';
      }
    }
    html += '</div>';
    return html;
  }

  function injectStyles() {
    if (document.getElementById('cal-page-styles')) return;
    var s = document.createElement('style');
    s.id = 'cal-page-styles';
    s.textContent = '\
.cal-page{padding:var(--space-4);max-width:1400px;margin:0 auto}\
.cal-top-bar{display:flex;align-items:center;justify-content:space-between;margin-bottom:var(--space-4)}\
.cal-top-left{display:flex;align-items:center;gap:var(--space-3)}\
.cal-page-title{font-size:var(--text-xl);font-weight:700;margin:0}\
.cal-toolbar{display:flex;align-items:center;justify-content:space-between;margin-bottom:var(--space-4);flex-wrap:wrap;gap:var(--space-3)}\
.cal-toolbar-left{display:flex;align-items:center;gap:var(--space-2)}\
.cal-toolbar-title{font-size:var(--text-lg);font-weight:600;min-width:200px;text-align:center}\
.cal-view-switcher{display:flex;background:var(--bg-glass);border-radius:var(--radius-lg);padding:3px;gap:2px}\
.cal-view-btn{padding:6px 16px;border:none;background:transparent;border-radius:var(--radius-md);font-size:var(--text-xs);font-weight:500;cursor:pointer;color:var(--text-secondary);transition:all 0.2s}\
.cal-view-btn.active{background:var(--accent-blue);color:white}\
.cal-view-btn:hover:not(.active){background:var(--bg-glass)}\
.cal-body{display:grid;grid-template-columns:1fr 300px;gap:var(--space-4);align-items:start}\
.cal-main{min-width:0}\
.cal-sidebar{display:flex;flex-direction:column;gap:var(--space-3)}\
.cal-sidebar-section{background:var(--bg-card);border:1px solid var(--border-light);border-radius:var(--radius-lg);padding:var(--space-3)}\
.cal-sidebar-title{font-size:var(--text-xs);font-weight:600;color:var(--text-secondary);text-transform:uppercase;letter-spacing:0.5px;margin-bottom:var(--space-2)}\
.cal-sidebar-empty{font-size:var(--text-xs);color:var(--text-tertiary);padding:var(--space-2) 0}\
.cal-sidebar-item{display:flex;align-items:flex-start;gap:var(--space-2);padding:var(--space-2);border-radius:var(--radius-sm);cursor:pointer;transition:background 0.15s}\
.cal-sidebar-item:hover{background:var(--bg-glass)}\
.cal-sidebar-dot{width:8px;height:8px;border-radius:50%;flex-shrink:0;margin-top:5px}\
.cal-sidebar-content{flex:1;min-width:0}\
.cal-sidebar-item-title{font-size:var(--text-xs);font-weight:500;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}\
.cal-sidebar-item-meta{font-size:10px;color:var(--text-tertiary);margin-top:2px}\
.cal-month-grid{background:var(--bg-card);border:1px solid var(--border-light);border-radius:var(--radius-lg);overflow:hidden}\
.cal-month-header{display:grid;grid-template-columns:repeat(7,1fr);border-bottom:1px solid var(--border-light)}\
.cal-month-header-cell{text-align:center;padding:var(--space-2);font-size:var(--text-xs);font-weight:600;color:var(--text-secondary)}\
.cal-month-body{display:grid;grid-template-columns:repeat(7,1fr)}\
.cal-month-cell{min-height:80px;padding:var(--space-1);border-right:1px solid var(--border-light);border-bottom:1px solid var(--border-light);cursor:pointer;transition:background 0.15s}\
.cal-month-cell:nth-child(7n){border-right:none}\
.cal-month-cell:hover{background:var(--bg-glass)}\
.cal-month-cell-empty{background:var(--bg-tertiary);opacity:0.3;cursor:default}\
.cal-month-cell.cal-today{background:rgba(59,130,246,0.06)}\
.cal-month-cell.cal-selected{background:rgba(59,130,246,0.12)}\
.cal-month-cell.cal-drag-target{background:rgba(59,130,246,0.08)}\
.cal-month-cell.cal-drag-target:hover{background:rgba(59,130,246,0.2)}\
.cal-month-day-num{font-size:var(--text-xs);font-weight:500;margin-bottom:2px;padding:2px 4px}\
.cal-today-num{background:var(--accent-blue);color:white;border-radius:50%;display:inline-flex;align-items:center;justify-content:center;min-width:22px;height:22px}\
.cal-month-events{display:flex;flex-direction:column;gap:1px}\
.cal-event-chip{font-size:10px;padding:1px 4px;border-radius:3px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;cursor:pointer;transition:opacity 0.15s}\
.cal-event-chip:hover{opacity:0.8}\
.cal-more-events{font-size:9px;color:var(--text-tertiary);padding:1px 4px}\
.cal-week-grid{background:var(--bg-card);border:1px solid var(--border-light);border-radius:var(--radius-lg);overflow:hidden}\
.cal-week-header{display:grid;grid-template-columns:60px repeat(7,1fr);border-bottom:1px solid var(--border-light)}\
.cal-week-header-cell{text-align:center;padding:var(--space-2) 0}\
.cal-week-day-name{font-size:10px;color:var(--text-secondary);font-weight:600}\
.cal-week-day-num{font-size:var(--text-sm);font-weight:500}\
.cal-week-today{background:rgba(59,130,246,0.06)}\
.cal-week-time-gutter{font-size:10px;color:var(--text-tertiary);text-align:right;padding:var(--space-1) var(--space-2);border-right:1px solid var(--border-light)}\
.cal-week-body{max-height:500px;overflow-y:auto}\
.cal-week-row{display:grid;grid-template-columns:60px repeat(7,1fr);min-height:36px;border-bottom:1px solid var(--border-light)}\
.cal-week-row .cal-week-time-gutter{border-right:1px solid var(--border-light)}\
.cal-week-cell{padding:1px;cursor:pointer;transition:background 0.15s}\
.cal-week-cell:hover{background:var(--bg-glass)}\
.cal-week-event{font-size:9px;padding:1px 4px;border-radius:3px;margin-bottom:1px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;cursor:pointer}\
.cal-current-hour{background:rgba(59,130,246,0.04)}\
.cal-day-view{background:var(--bg-card);border:1px solid var(--border-light);border-radius:var(--radius-lg);overflow:hidden;padding:var(--space-4)}\
.cal-day-header{display:flex;align-items:center;justify-content:space-between;margin-bottom:var(--space-3)}\
.cal-day-title{font-weight:600;font-size:var(--text-lg)}\
.cal-day-count{font-size:var(--text-xs);color:var(--text-secondary)}\
.cal-day-timeline{max-height:500px;overflow-y:auto}\
.cal-day-row{display:flex;border-bottom:1px solid var(--border-light);min-height:44px}\
.cal-day-time{width:64px;font-size:10px;color:var(--text-tertiary);text-align:right;padding:var(--space-2);flex-shrink:0}\
.cal-day-slots{flex:1;padding:2px;cursor:pointer;position:relative}\
.cal-day-slots:hover{background:var(--bg-glass)}\
.cal-day-event{display:flex;align-items:flex-start;gap:var(--space-2);padding:var(--space-1) var(--space-2);margin-bottom:2px;border-radius:var(--radius-sm);cursor:pointer;transition:background 0.15s}\
.cal-day-event:hover{background:var(--bg-glass)}\
.cal-day-event-dot{width:8px;height:8px;border-radius:50%;flex-shrink:0;margin-top:4px}\
.cal-day-event-content{flex:1}\
.cal-day-event-title{font-size:var(--text-xs);font-weight:500}\
.cal-day-event-meta{font-size:10px;color:var(--text-secondary)}\
.cal-day-empty{position:absolute;inset:0}\
.cal-agenda{background:var(--bg-card);border:1px solid var(--border-light);border-radius:var(--radius-lg);overflow:hidden}\
.cal-agenda-empty{padding:var(--space-8);text-align:center}\
.cal-agenda-empty-icon{font-size:2rem;margin-bottom:var(--space-2)}\
.cal-agenda-empty-text{font-size:var(--text-sm);color:var(--text-secondary)}\
.cal-agenda-date-header{padding:var(--space-2) var(--space-4);background:var(--bg-tertiary);border-bottom:1px solid var(--border-light);display:flex;align-items:baseline;gap:var(--space-3)}\
.cal-agenda-today{background:rgba(59,130,246,0.1)}\
.cal-agenda-date-weekday{font-size:var(--text-xs);font-weight:600;color:var(--text-secondary)}\
.cal-agenda-date-num{font-size:var(--text-sm);font-weight:600}\
.cal-agenda-item{display:flex;align-items:center;gap:var(--space-3);padding:var(--space-2) var(--space-4);border-bottom:1px solid var(--border-light);cursor:pointer;transition:background 0.15s}\
.cal-agenda-item:hover{background:var(--bg-glass)}\
.cal-agenda-time{font-size:var(--text-xs);color:var(--text-tertiary);min-width:60px}\
.cal-agenda-dot{width:8px;height:8px;border-radius:50%;flex-shrink:0}\
.cal-agenda-content{flex:1;min-width:0}\
.cal-agenda-title{font-size:var(--text-sm);font-weight:500}\
.cal-agenda-meta{margin-top:2px}\
.cal-badge{display:inline-block;padding:2px 8px;border-radius:var(--radius-sm);font-size:var(--text-xs);font-weight:500}\
.cal-badge-sm{font-size:10px;padding:1px 6px}\
.cal-task-check{accent-color:var(--accent-blue)}\
.cal-btn{padding:6px 14px;border:none;border-radius:var(--radius-md);font-size:var(--text-xs);font-weight:500;cursor:pointer;transition:all 0.2s;display:inline-flex;align-items:center;gap:var(--space-1)}\
.cal-btn-primary{background:var(--accent-blue);color:white}\
.cal-btn-primary:hover{opacity:0.9}\
.cal-btn-secondary{background:var(--bg-glass);color:var(--text-primary);border:1px solid var(--border-light)}\
.cal-btn-secondary:hover{background:var(--bg-tertiary)}\
.cal-btn-danger{background:transparent;color:var(--accent-red);border:1px solid var(--accent-red)}\
.cal-btn-danger:hover{background:rgba(239,68,68,0.1)}\
.cal-btn-outline{background:transparent;color:var(--text-primary);border:1px solid var(--border-light)}\
.cal-btn-outline:hover{background:var(--bg-glass)}\
.cal-btn-ghost{background:transparent;color:var(--text-primary);padding:4px 8px}\
.cal-btn-ghost:hover{background:var(--bg-glass)}\
.cal-btn-sm{padding:4px 10px;font-size:10px}\
.cal-btn-close{background:none;border:none;font-size:1.5rem;cursor:pointer;color:var(--text-secondary);padding:4px;line-height:1}\
.cal-modal-overlay{position:fixed;inset:0;background:rgba(0,0,0,0.5);z-index:1000;display:flex;align-items:center;justify-content:center;animation:fadeIn 0.2s ease}\
.cal-modal{background:var(--bg-card);border:1px solid var(--border-light);border-radius:var(--radius-lg);max-width:480px;width:90%;box-shadow:0 20px 60px rgba(0,0,0,0.3)}\
.cal-modal-header{display:flex;align-items:center;justify-content:space-between;padding:var(--space-4);border-bottom:1px solid var(--border-light)}\
.cal-modal-body{padding:var(--space-4)}\
.cal-modal-footer{display:flex;justify-content:flex-end;gap:var(--space-2);padding:var(--space-3) var(--space-4);border-top:1px solid var(--border-light)}\
.cal-form-group{margin-bottom:var(--space-3)}\
.cal-form-row{display:grid;grid-template-columns:1fr 1fr;gap:var(--space-3)}\
.cal-label{display:block;font-size:var(--text-xs);font-weight:600;color:var(--text-secondary);margin-bottom:4px}\
.cal-input{width:100%;padding:8px 12px;background:var(--bg-tertiary);border:1px solid var(--border-light);border-radius:var(--radius-md);color:var(--text-primary);font-size:var(--text-sm);outline:none;box-sizing:border-box}\
.cal-input:focus{border-color:var(--accent-blue)}\
.cal-textarea{resize:vertical;min-height:60px;font-family:inherit}\
.cal-type-grid{display:flex;flex-wrap:wrap;gap:var(--space-2)}\
.cal-type-option{display:flex;align-items:center;gap:4px;cursor:pointer;font-size:var(--text-xs);padding:4px 8px;border-radius:var(--radius-sm);border:1px solid var(--border-light);transition:background 0.15s}\
.cal-type-option:has(input:checked){background:var(--bg-glass);border-color:var(--accent-blue)}\
.cal-type-option input{display:none}\
.cal-type-dot{width:10px;height:10px;border-radius:3px}\
.cal-toast{position:fixed;bottom:80px;left:50%;transform:translateX(-50%);background:var(--accent-blue);color:white;padding:8px 16px;border-radius:var(--radius-md);font-size:var(--text-sm);z-index:9999;animation:fadeIn 0.3s ease;box-shadow:0 4px 12px rgba(0,0,0,0.3)}\
@media(max-width:992px){.cal-body{grid-template-columns:1fr}.cal-sidebar{display:none}}\
@media(max-width:768px){.cal-month-cell{min-height:60px}.cal-month-events{display:none}.cal-week-grid,.cal-day-view{display:none}.cal-toolbar{flex-direction:column;align-items:stretch}.cal-view-switcher{justify-content:center}}\
';
    document.head.appendChild(s);
  }

  window.renderPage.calendar.showCreateModal = showCreateModal;
  window.renderPage.calendar.saveEvent = saveEvent;
  window.renderPage.calendar.deleteEventById = deleteEventById;
  window.renderPage.calendar.editEvent = editEvent;
  window.renderPage.calendar.updateEvent = updateEvent;
  window.renderPage.calendar.setView = setView;
  window.renderPage.calendar.navigate = navigate;
  window.renderPage.calendar.goToday = goToday;
  window.renderPage.calendar.selectDate = selectDate;
  window.renderPage.calendar.clickSlot = clickSlot;
  window.renderPage.calendar.clickEvent = clickEvent;
  window.renderPage.calendar.toggleTask = toggleTask;
  window.renderPage.calendar.dragPickEvent = dragPickEvent;
  window.renderPage.calendar.dragDropEvent = dragDropEvent;
  window.renderPage.calendar.cancelDrag = cancelDrag;

  render();
};
