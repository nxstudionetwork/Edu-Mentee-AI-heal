window.renderPage.liveClasses = function(params) {
  var container = document.getElementById('main-content');
  if (!container) return;
  var md = window.mockData;
  var utils = window.Utils;
  var store = window.Store;

  var currentTab = 'today';
  var searchQuery = '';
  var filterState = { subject: '', class: '', teacher: '', status: '', type: '' };
  var sortBy = 'date';
  var callState = null;
  var showFilter = false;
  var user = store.get('user') || {};
  var userClass = user.class || 11;
  var userStream = user.stream || 'science';
  var attendanceStore = store.get('classAttendance') || {};
  var now = new Date();
  var todayStr = now.toISOString().split('T')[0];

  var calendarLinks = [
    'https://calendar.google.com/event?action=TEMPLATE',
    'https://outlook.live.com/calendar/0/deeplink/compose'
  ];

  var weekDays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  var weekStart = new Date(now);
  weekStart.setDate(now.getDate() - now.getDay() + 1);

  var subjectIcons = {
    'Physics': '⚡', 'Chemistry': '🧪', 'Biology': '🧬', 'Mathematics': '📐',
    'English': '📖', 'Social Studies': '🌍', 'Science': '🔬', 'Hindi': '🔤',
    'Sanskrit': '🕉️', 'Computer Science': '💻', 'Accountancy': '💰',
    'Business Studies': '🏢', 'Economics': '📊', 'History': '🏛️', 'Geography': '🗺️',
    'Political Science': '⚖️', 'Psychology': '🧠', 'Sociology': '👥'
  };

  var MOCK_TEACHERS = [
    { name: 'Dr. Meera Joshi', qualification: 'Ph.D, Physics', rating: 4.9, avatar: null, subjects: ['Physics', 'Chemistry'] },
    { name: 'Prof. Anil Kumar', qualification: 'M.Sc, Mathematics', rating: 4.8, avatar: null, subjects: ['Mathematics'] },
    { name: 'Ms. Sunita Reddy', qualification: 'M.Sc, Biology', rating: 4.7, avatar: null, subjects: ['Biology', 'Science'] },
    { name: 'Mr. Rajesh Verma', qualification: 'M.A, English', rating: 4.6, avatar: null, subjects: ['English', 'Social Studies'] },
    { name: 'Dr. Alok Sharma', qualification: 'Ph.D, Chemistry', rating: 4.9, avatar: null, subjects: ['Chemistry'] },
    { name: 'Prof. Kavita Singh', qualification: 'M.Sc, Physics', rating: 4.7, avatar: null, subjects: ['Physics'] },
    { name: 'Mr. Rohan Gupta', qualification: 'M.A, History', rating: 4.5, avatar: null, subjects: ['Social Studies', 'History'] },
    { name: 'Ms. Priya Patel', qualification: 'M.Sc, Mathematics', rating: 4.8, avatar: null, subjects: ['Mathematics'] },
    { name: 'Dr. Vikram Desai', qualification: 'Ph.D, Biology', rating: 4.6, avatar: null, subjects: ['Biology'] },
    { name: 'Prof. Sneha Iyer', qualification: 'M.A, English Literature', rating: 4.7, avatar: null, subjects: ['English'] }
  ];

  function getSubjectIcon(subject) {
    return subjectIcons[subject] || '📚';
  }

  function getTeacher(name) {
    for (var i = 0; i < MOCK_TEACHERS.length; i++) {
      if (MOCK_TEACHERS[i].name === name) return MOCK_TEACHERS[i];
    }
    return MOCK_TEACHERS[0];
  }

  function getTeacherByIndex(i) {
    return MOCK_TEACHERS[i % MOCK_TEACHERS.length];
  }

  function getTodayClasses() {
    return getFilteredClasses('today');
  }

  function render() {
    var html = '<div class="page-container animate-fadeInUp">';

    html += renderHeader();
    html += renderSearchFilterBar();
    html += renderActiveFilters();
    html += renderFilterDrawer();
    html += renderTodaySection();
    html += renderUpcomingSection();
    html += renderRecordedSection();
    html += renderTeachersSection();

    html += '</div>';
    container.innerHTML = html;
    bindEvents();
  }

  function renderHeader() {
    var todayCount = 0;
    var all = getAllClasses();
    for (var i = 0; i < all.length; i++) {
      if (all[i].date === todayStr && (all[i].status === 'live' || all[i].status === 'upcoming')) todayCount++;
    }
    var liveNow = getLiveNow();
    var html = '<div class="page-header">';
    html += '<div><h1 class="page-title">📺 Live Classes & Meet</h1><p class="page-subtitle">';
    if (liveNow) {
      html += '🔴 <span class="text-accent-red font-semibold">Live Now</span> &middot; ';
    }
    html += 'Today: <span class="text-accent-blue font-semibold">' + todayCount + ' class' + (todayCount !== 1 ? 'es' : '') + '</span></p></div>';
    html += '<div class="flex gap-3">';
    html += '<button class="btn btn-ghost btn-sm" id="btn-refresh" title="Refresh">🔄 Refresh</button>';
    html += '<button class="btn btn-primary btn-sm" id="btn-schedule-meeting">+ Schedule</button>';
    html += '</div></div>';
    return html;
  }

  function renderSearchFilterBar() {
    var html = '<div class="mb-6 flex gap-3 items-center flex-wrap">';
    html += '<div class="input-group flex-1" style="min-width:220px"><input type="text" class="input-field" id="search-classes" placeholder="🔍 Search by subject, teacher, or chapter..." value="' + utils.sanitizeHTML(searchQuery) + '" style="width:100%"></div>';
    html += '<button class="btn btn-secondary btn-sm" id="btn-filter-toggle" style="gap:4px">🔍 Filters' + (getActiveFilterCount() > 0 ? ' <span class="badge badge-red" style="font-size:10px;padding:1px 6px">' + getActiveFilterCount() + '</span>' : '') + '</button>';
    html += '<div class="flex gap-2 items-center"><span class="text-xs text-tertiary">Sort:</span>';
    var sortOptions = [
      { key: 'date', label: 'Date' },
      { key: 'subject', label: 'Subject' },
      { key: 'teacher', label: 'Teacher' }
    ];
    for (var i = 0; i < sortOptions.length; i++) {
      var so = sortOptions[i];
      html += '<button class="btn btn-sm ' + (sortBy === so.key ? 'btn-primary' : 'btn-ghost') + ' sort-btn" data-sort="' + so.key + '">' + so.label + '</button>';
    }
    html += '</div>';
    html += '</div>';
    return html;
  }

  function renderActiveFilters() {
    var count = getActiveFilterCount();
    if (count === 0) return '';
    var html = '<div class="mb-4 flex gap-2 flex-wrap items-center">';
    html += '<span class="text-xs text-tertiary">Active filters:</span>';
    var labels = { subject: 'Subject', class: 'Class', teacher: 'Teacher', status: 'Status', type: 'Type' };
    for (var key in filterState) {
      if (filterState[key]) {
        html += '<span class="badge badge-blue" style="cursor:pointer;padding:4px 10px" data-filter-key="' + key + '">' + labels[key] + ': ' + filterState[key] + ' ✕</span>';
      }
    }
    if (count > 1) {
      html += '<button class="btn btn-sm btn-ghost text-xs" id="clear-all-filters">Clear All</button>';
    }
    html += '</div>';
    return html;
  }

  function renderFilterDrawer() {
    var html = '<div id="filter-drawer" class="filter-drawer" style="display:' + (showFilter ? 'block' : 'none') + ';position:fixed;top:0;right:0;width:340px;height:100vh;background:var(--bg-primary);z-index:500;box-shadow:-4px 0 20px rgba(0,0,0,0.2);padding:var(--space-6);overflow-y:auto;border-left:1px solid var(--border-color)">';
    html += '<div class="flex items-center justify-between mb-6"><h3 class="font-semibold text-lg">Filters</h3><button class="btn btn-ghost btn-icon-sm" id="close-filter-drawer">✕</button></div>';

    html += '<div class="input-group mb-4"><label class="input-label">Subject</label><select class="input-field" id="filter-subject"><option value="">All Subjects</option>';
    var subjects = ['Physics', 'Chemistry', 'Biology', 'Mathematics', 'English', 'Social Studies', 'Science', 'Hindi', 'Sanskrit', 'Computer Science', 'Accountancy', 'Business Studies', 'Economics', 'History', 'Geography', 'Political Science', 'Psychology'];
    for (var i = 0; i < subjects.length; i++) {
      html += '<option value="' + subjects[i] + '"' + (filterState.subject === subjects[i] ? ' selected' : '') + '>' + subjects[i] + '</option>';
    }
    html += '</select></div>';

    html += '<div class="input-group mb-4"><label class="input-label">Class</label><select class="input-field" id="filter-class"><option value="">All Classes</option>';
    for (var c = 6; c <= 12; c++) {
      html += '<option value="' + c + '"' + (filterState.class === String(c) ? ' selected' : '') + '>Class ' + c + '</option>';
    }
    html += '</select></div>';

    html += '<div class="input-group mb-4"><label class="input-label">Teacher</label><input type="text" class="input-field" id="filter-teacher" placeholder="Search teacher..." value="' + utils.sanitizeHTML(filterState.teacher) + '"></div>';

    html += '<div class="input-group mb-4"><label class="input-label">Status</label><select class="input-field" id="filter-status"><option value="">All Status</option>';
    var statuses = [
      { value: 'live', label: 'Today / Live' },
      { value: 'upcoming', label: 'Upcoming' },
      { value: 'recorded', label: 'Recorded' }
    ];
    for (var s = 0; s < statuses.length; s++) {
      html += '<option value="' + statuses[s].value + '"' + (filterState.status === statuses[s].value ? ' selected' : '') + '>' + statuses[s].label + '</option>';
    }
    html += '</select></div>';

    html += '<div class="input-group mb-6"><label class="input-label">Type</label><select class="input-field" id="filter-type"><option value="">All Types</option>';
    var types = [
      { value: 'Regular', label: 'Regular Class' },
      { value: 'Doubt', label: 'Doubt Session' },
      { value: 'Workshop', label: 'Workshop' }
    ];
    for (var t = 0; t < types.length; t++) {
      html += '<option value="' + types[t].value + '"' + (filterState.type === types[t].value ? ' selected' : '') + '>' + types[t].label + '</option>';
    }
    html += '</select></div>';

    html += '<div class="flex gap-3"><button class="btn btn-primary flex-1" id="apply-filters">Apply Filters</button><button class="btn btn-ghost flex-1" id="reset-filters">Reset</button></div>';
    html += '</div>';
    html += '<div id="filter-overlay" class="filter-overlay" style="display:' + (showFilter ? 'block' : 'none') + ';position:fixed;top:0;left:0;width:100%;height:100%;background:rgba(0,0,0,0.4);z-index:499"></div>';
    return html;
  }

  function getActiveFilterCount() {
    var count = 0;
    for (var key in filterState) {
      if (filterState[key]) count++;
    }
    return count;
  }

  function renderTodaySection() {
    var html = '<div class="mb-10" id="section-today">';
    html += '<div class="section-header"><h2 class="section-title">📆 Today\'s Classes</h2><span class="text-xs text-tertiary">' + new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' }) + '</span></div>';

    var liveNow = getLiveNow();
    if (liveNow) {
      html += '<div class="mb-6">';
      html += renderLiveNowBanner(liveNow);
      html += '</div>';
    }

    var todayClasses = [];
    var all = getAllClasses();
    for (var i = 0; i < all.length; i++) {
      if (all[i].date === todayStr) todayClasses.push(all[i]);
    }

    if (todayClasses.length === 0) {
      html += '<div class="empty-state"><div class="empty-state-icon">📆</div><div class="empty-state-title">No classes today</div><div class="empty-state-text">You have no classes scheduled for today. Enjoy your day off or catch up on recorded sessions!</div></div>';
    } else {
      html += '<div class="grid grid-cols-auto gap-5">';
      for (var i = 0; i < todayClasses.length; i++) {
        html += renderClassCard(todayClasses[i], i);
      }
      html += '</div>';
    }
    html += '</div>';
    return html;
  }

  function renderLiveNowBanner(c) {
    var html = '<div class="gradient-border" style="padding:1px;border-radius:var(--radius-xl)">';
    html += '<div class="glass-card" style="border-radius:var(--radius-xl);padding:var(--space-8);display:flex;align-items:center;gap:var(--space-8);flex-wrap:wrap;background:var(--bg-secondary)">';
    html += '<div class="flex items-center gap-4 flex-1">';
    html += '<div class="avatar avatar-lg" style="background:' + utils.getGradient(0) + ';width:80px;height:80px;font-size:var(--text-3xl)">' + utils.getInitials(c.teacher.name) + '</div>';
    html += '<div><div class="flex items-center gap-3 mb-2"><span class="badge badge-red animate-pulse">● LIVE</span><span class="text-sm text-secondary">' + getSubjectIcon(c.subject) + ' ' + c.subject + '</span></div>';
    html += '<h2 class="text-2xl font-bold mb-1">' + utils.sanitizeHTML(c.chapter) + '</h2>';
    html += '<div class="flex flex-wrap gap-x-4 gap-y-1 text-sm text-tertiary">';
    html += '<span>👤 ' + utils.sanitizeHTML(c.teacher.name) + '</span>';
    html += '<span>⏱ ' + c.duration + ' min</span>';
    html += '<span>🆔 ' + (c.id || 'N/A') + '</span>';
    html += '</div>';
    if (c.description) html += '<div class="text-sm text-secondary mt-3">' + utils.sanitizeHTML(c.description) + '</div>';
    html += '</div></div>';
    html += '<div class="flex flex-col gap-3 items-end"><button class="btn btn-primary btn-lg join-live-btn" data-id="' + c.id + '" style="flex-shrink:0;font-size:1.1rem;padding:12px 28px">🔗 Join Now</button>';
    html += '<button class="btn btn-sm btn-ghost calendar-link" data-link="' + calendarLinks[0] + '">📅 Add to Calendar</button>';
    html += '</div></div></div>';
    return html;
  }

  function renderClassCard(c, idx) {
    var statusBadge = '';
    var actionBtn = '';
    if (c.status === 'live') {
      statusBadge = '<span class="badge badge-red animate-pulse">● Live</span>';
      actionBtn = '<button class="btn btn-primary btn-sm join-live-btn" data-id="' + c.id + '">🔗 Join Now</button>';
    } else if (c.status === 'upcoming' && c.date === todayStr) {
      statusBadge = '<span class="badge badge-blue">📅 Today</span>';
      actionBtn = '<button class="btn btn-primary btn-sm join-live-btn" data-id="' + c.id + '">🔗 Join Now</button>';
    } else if (c.status === 'upcoming') {
      statusBadge = '<span class="badge badge-blue">📅 Upcoming</span>';
      actionBtn = '<div class="flex gap-2"><button class="btn btn-secondary btn-sm set-reminder-btn" data-id="' + c.id + '">🔔 Remind</button><button class="btn btn-ghost btn-sm calendar-link" data-link="' + calendarLinks[idx % calendarLinks.length] + '">📅</button></div>';
    } else {
      statusBadge = '<span class="badge badge-cyan">🎥 Recorded</span>';
      actionBtn = '<div class="flex gap-2"><button class="btn btn-cyan btn-sm watch-recording-btn" data-id="' + c.id + '">▶ Watch</button><button class="btn btn-ghost btn-sm download-recording-btn" data-id="' + c.id + '" title="Download">⬇️</button></div>';
    }
    var attended = attendanceStore[c.id];
    var teacher = getTeacher(c.teacher.name);
    var teacherIdx = 0;
    for (var t = 0; t < MOCK_TEACHERS.length; t++) {
      if (MOCK_TEACHERS[t].name === c.teacher.name) { teacherIdx = t; break; }
    }

    var html = '<div class="glass-card class-card" style="padding:var(--space-5);position:relative;overflow:hidden">';
    html += '<div class="flex items-start gap-4 mb-4">';
    html += '<div class="avatar avatar-md" style="background:' + utils.getGradient(idx) + ';position:relative">' + utils.getInitials(c.teacher.name) + '</div>';
    html += '<div class="flex-1 min-w-0">';
    html += '<div class="flex items-center gap-2 mb-1 flex-wrap">' + statusBadge + '<span class="text-xs text-tertiary">' + getSubjectIcon(c.subject) + ' ' + c.subject + '</span><span class="text-xs text-tertiary">🆔 ' + (c.id || '') + '</span></div>';
    html += '<h3 class="font-semibold text-lg">' + utils.sanitizeHTML(c.subject) + ': ' + utils.sanitizeHTML(c.chapter) + '</h3>';
    html += '<div class="flex flex-wrap gap-x-4 gap-y-1 text-sm text-tertiary mt-1">';
    html += '<span>👤 ' + utils.sanitizeHTML(c.teacher.name) + '</span>';
    if (c.time) html += '<span>⏰ ' + c.time + '</span>';
    html += '<span>⏱ ' + c.duration + ' min</span>';
    if (c.date !== todayStr) html += '<span>📅 ' + utils.formatDate(c.date, 'dd mmm yyyy') + '</span>';
    html += '</div>';
    if (teacher && teacher.qualification) {
      html += '<div class="text-xs text-tertiary mt-1">🎓 ' + utils.sanitizeHTML(teacher.qualification) + ' &middot; ⭐ ' + teacher.rating + '</div>';
    }
    if (c.description) html += '<div class="text-sm text-secondary mt-3">' + utils.sanitizeHTML(c.description) + '</div>';
    html += '</div></div>';

    html += '<div class="flex gap-2 flex-wrap items-center">' + actionBtn;
    html += '<button class="btn btn-sm ' + (attended ? 'btn-green' : 'btn-ghost') + ' mark-attendance-btn" data-id="' + c.id + '" title="' + (attended ? 'Marked Attended' : 'Mark Attendance') + '">' + (attended ? '✅' : '📋') + ' ' + (attended ? 'Attended' : 'Mark') + '</button>';
    if (c.resources && c.resources.notes) html += '<button class="btn btn-sm btn-ghost resource-btn" data-type="notes" data-id="' + c.id + '">📝 Notes</button>';
    if (c.resources && c.resources.assignment) html += '<button class="btn btn-sm btn-ghost resource-btn" data-type="assignment" data-id="' + c.id + '">📋 Assignment</button>';
    html += '</div>';

    html += '</div>';
    return html;
  }

  function renderUpcomingSection() {
    var html = '<div class="mb-10" id="section-upcoming">';
    html += '<div class="section-header"><h2 class="section-title">📅 Upcoming Classes</h2></div>';

    var upcoming = [];
    var all = getAllClasses();
    for (var i = 0; i < all.length; i++) {
      if ((all[i].status === 'upcoming' || all[i].status === 'live') && all[i].date >= todayStr) {
        upcoming.push(all[i]);
      }
    }
    sortClasses(upcoming);

    if (upcoming.length === 0) {
      html += '<div class="empty-state"><div class="empty-state-icon">📅</div><div class="empty-state-title">No upcoming classes</div><div class="empty-state-text">There are no upcoming classes scheduled. Check back later or schedule your own meeting!</div></div>';
    } else {
      html += '<div class="glass-card" style="padding:var(--space-6);overflow-x:auto">';
      html += '<div style="min-width:500px">';
      for (var i = 0; i < upcoming.length; i++) {
        var c = upcoming[i];
        var isLive = c.status === 'live' && c.date === todayStr;
        var timeDisplay = c.time || 'TBA';
        var dayName = utils.formatDate(c.date, 'ddd');
        var dateNum = new Date(c.date).getDate();
        var monthShort = utils.formatDate(c.date, 'mmm');
        html += '<div class="flex items-center gap-4 py-3" style="border-bottom:1px solid var(--border-color)">';
        html += '<div style="text-align:center;min-width:50px"><div class="text-xs text-tertiary">' + dayName + '</div><div class="text-lg font-bold">' + dateNum + '</div><div class="text-xs text-tertiary">' + monthShort + '</div></div>';
        html += '<div class="flex-1 min-w-0">';
        html += '<div class="flex items-center gap-2">';
        if (isLive) html += '<span class="badge badge-red animate-pulse" style="font-size:9px;padding:1px 6px">LIVE</span>';
        html += '<span class="font-semibold text-sm">' + utils.sanitizeHTML(c.subject) + ': ' + utils.sanitizeHTML(c.chapter) + '</span>';
        html += '</div>';
        html += '<div class="flex gap-3 text-xs text-tertiary mt-1">';
        html += '<span>👤 ' + utils.sanitizeHTML(c.teacher.name) + '</span>';
        html += '<span>⏰ ' + timeDisplay + '</span>';
        html += '<span>⏱ ' + c.duration + ' min</span>';
        html += '</div>';
        html += '</div>';
        html += '<div class="flex gap-2 flex-shrink-0">';
        if (isLive) {
          html += '<button class="btn btn-primary btn-sm join-live-btn" data-id="' + c.id + '">🔗 Join</button>';
        } else {
          html += '<button class="btn btn-secondary btn-sm set-reminder-btn" data-id="' + c.id + '">🔔 Remind</button>';
          html += '<button class="btn btn-ghost btn-sm calendar-link" data-link="' + calendarLinks[i % calendarLinks.length] + '" title="Add to Calendar">📅</button>';
        }
        html += '</div>';
        html += '</div>';
      }
      html += '</div></div>';
    }
    html += '</div>';
    return html;
  }

  function renderRecordedSection() {
    var html = '<div class="mb-10" id="section-recorded">';
    html += '<div class="section-header"><h2 class="section-title">🎥 Recorded Classes</h2></div>';

    var recorded = [];
    var all = getAllClasses();
    for (var i = 0; i < all.length; i++) {
      if (all[i].status === 'recorded' || (all[i].status === 'past')) {
        recorded.push(all[i]);
      }
    }

    if (recorded.length === 0) {
      html += '<div class="empty-state"><div class="empty-state-icon">🎥</div><div class="empty-state-title">No recorded classes</div><div class="empty-state-text">Recorded sessions will appear here once available. Check back after attending live classes!</div></div>';
    } else {
      html += '<div class="grid grid-cols-auto gap-5">';
      for (var i = 0; i < recorded.length; i++) {
        var c = recorded[i];
        var teacher = getTeacher(c.teacher.name);
        var views = Math.floor(Math.random() * 500) + 50;
        html += '<div class="glass-card" style="padding:var(--space-5);overflow:hidden">';
        html += '<div style="height:140px;background:' + utils.getGradient(i) + ';border-radius:var(--radius-lg);display:flex;align-items:center;justify-content:center;margin-bottom:var(--space-4);position:relative">';
        html += '<div style="width:56px;height:56px;border-radius:50%;background:rgba(255,255,255,0.2);display:flex;align-items:center;justify-content:center;font-size:1.5rem;color:white;backdrop-filter:blur(4px)">▶</div>';
        html += '<span class="badge" style="position:absolute;bottom:10px;right:10px;background:rgba(0,0,0,0.65);color:white;font-size:10px">' + c.duration + ' min</span>';
        html += '</div>';
        html += '<div class="flex items-start gap-3 mb-3">';
        html += '<div class="avatar avatar-sm" style="background:' + utils.getGradient(i + 3) + '">' + utils.getInitials(c.teacher.name) + '</div>';
        html += '<div class="flex-1 min-w-0"><h4 class="font-semibold text-sm">' + utils.sanitizeHTML(c.subject) + ': ' + utils.sanitizeHTML(c.chapter) + '</h4>';
        html += '<div class="text-xs text-tertiary">👤 ' + utils.sanitizeHTML(c.teacher.name) + '</div>';
        html += '<div class="flex gap-3 text-xs text-tertiary mt-1">';
        html += '<span>📅 ' + utils.formatDate(c.date, 'dd mmm yyyy') + '</span>';
        html += '<span>👁️ ' + utils.formatNumber(views) + ' views</span>';
        html += '</div></div></div>';
        if (teacher && teacher.rating) {
          html += '<div class="flex items-center gap-1 text-xs text-tertiary mb-3"><span>⭐ ' + teacher.rating + '</span><span>🎓 ' + utils.sanitizeHTML(teacher.qualification) + '</span></div>';
        }
        html += '<div class="flex gap-2 flex-wrap">';
        html += '<button class="btn btn-cyan btn-sm watch-recording-btn" data-id="' + c.id + '">▶ Watch Recording</button>';
        html += '<button class="btn btn-ghost btn-sm download-recording-btn" data-id="' + c.id + '">⬇️ Download</button>';
        html += '</div>';
        html += '</div>';
      }
      html += '</div>';
    }
    html += '</div>';
    return html;
  }

  function renderTeachersSection() {
    var html = '<div class="divider-gradient mt-8 mb-8"></div>';
    html += '<div class="section-header"><h2 class="section-title">👨‍🏫 Our Teachers</h2></div>';
    html += '<div class="grid grid-cols-auto gap-5 mb-8">';
    for (var i = 0; i < MOCK_TEACHERS.length; i++) {
      var t = MOCK_TEACHERS[i];
      html += '<div class="glass-card" style="padding:var(--space-6);text-align:center">';
      html += '<div class="avatar avatar-lg mx-auto mb-3" style="background:' + utils.getGradient(i) + ';width:72px;height:72px;font-size:var(--text-xl)">' + utils.getInitials(t.name) + '</div>';
      html += '<div class="flex items-center justify-center gap-1 mb-2 flex-wrap">';
      for (var s = 0; s < t.subjects.length; s++) {
        html += '<span class="badge badge-blue">' + getSubjectIcon(t.subjects[s]) + ' ' + t.subjects[s] + '</span>';
      }
      html += '</div>';
      html += '<h3 class="font-semibold text-lg">' + utils.sanitizeHTML(t.name) + '</h3>';
      html += '<div class="text-xs text-tertiary mt-1">🎓 ' + utils.sanitizeHTML(t.qualification) + '</div>';
      html += '<div class="flex items-center justify-center gap-4 mt-3 text-sm text-tertiary">';
      html += '<span>⭐ ' + t.rating + '</span>';
      html += '</div></div>';
    }
    html += '</div>';
    return html;
  }

  function getAllClasses() {
    var result = [];

    var staticClasses = [
      { id: 'lc1', teacher: getTeacherByIndex(0), subject: 'Physics', chapter: 'Laws of Motion', date: todayStr, time: '10:00 AM', duration: 60, status: 'live', description: 'Understanding Newton\'s Laws and their applications with numerical problems.', recording: null, resources: { notes: true, assignment: true }, type: 'Regular' },
      { id: 'lc2', teacher: getTeacherByIndex(1), subject: 'Chemistry', chapter: 'Chemical Bonding', date: todayStr, time: '2:00 PM', duration: 45, status: 'upcoming', description: 'Valence bond theory, hybridization, and molecular orbital theory.', recording: null, resources: null, type: 'Regular' },
      { id: 'lc3', teacher: getTeacherByIndex(2), subject: 'Mathematics', chapter: 'Integration', date: getFutureDate(1), time: '9:00 AM', duration: 60, status: 'upcoming', description: 'Indefinite and definite integrals, substitution method.', recording: null, resources: null, type: 'Regular' },
      { id: 'lc4', teacher: getTeacherByIndex(3), subject: 'Biology', chapter: 'Genetics', date: getFutureDate(1), time: '11:00 AM', duration: 45, status: 'upcoming', description: 'Mendelian genetics, Punnett squares, and inheritance patterns.', recording: null, resources: null, type: 'Regular' },
      { id: 'lc5', teacher: getTeacherByIndex(4), subject: 'English', chapter: 'Grammar & Composition', date: getFutureDate(2), time: '3:00 PM', duration: 50, status: 'upcoming', description: 'Tenses, voice, narration and essay writing techniques.', recording: null, resources: null, type: 'Regular' },
      { id: 'lc6', teacher: getTeacherByIndex(0), subject: 'Physics', chapter: 'Thermodynamics', date: getPastDate(1), time: '10:00 AM', duration: 60, status: 'recorded', description: 'Laws of thermodynamics, heat engines, and entropy.', recording: 'https://example.com/recording/lc6', resources: { notes: true, assignment: true }, type: 'Regular' },
      { id: 'lc7', teacher: getTeacherByIndex(1), subject: 'Chemistry', chapter: 'Organic Chemistry Basics', date: getPastDate(2), time: '2:00 PM', duration: 45, status: 'recorded', description: 'Hydrocarbons, functional groups, IUPAC nomenclature.', recording: 'https://example.com/recording/lc7', resources: { notes: true, assignment: false }, type: 'Regular' },
      { id: 'lc8', teacher: getTeacherByIndex(2), subject: 'Mathematics', chapter: 'Differentiation', date: getPastDate(3), time: '9:00 AM', duration: 60, status: 'recorded', description: 'Derivatives, chain rule, and applications of derivatives.', recording: 'https://example.com/recording/lc8', resources: { notes: true, assignment: true }, type: 'Regular' },
      { id: 'lc9', teacher: getTeacherByIndex(5), subject: 'Physics', chapter: 'Electrostatics', date: getFutureDate(3), time: '10:00 AM', duration: 55, status: 'upcoming', description: 'Electric charges, fields, and potential with numerical problems.', recording: null, resources: null, type: 'Doubt' },
      { id: 'lc10', teacher: getTeacherByIndex(6), subject: 'Social Studies', chapter: 'The French Revolution', date: getFutureDate(4), time: '1:00 PM', duration: 50, status: 'upcoming', description: 'Causes, events, and impact of the French Revolution.', recording: null, resources: null, type: 'Regular' },
      { id: 'lc11', teacher: getTeacherByIndex(7), subject: 'Mathematics', chapter: 'Probability', date: getFutureDate(5), time: '11:30 AM', duration: 45, status: 'upcoming', description: 'Probability concepts, Bayes theorem, and distributions.', recording: null, resources: null, type: 'Workshop' },
      { id: 'lc12', teacher: getTeacherByIndex(8), subject: 'Biology', chapter: 'Human Physiology', date: getFutureDate(6), time: '3:30 PM', duration: 60, status: 'upcoming', description: 'Digestive, respiratory, and circulatory systems.', recording: null, resources: null, type: 'Regular' },
      { id: 'lc13', teacher: getTeacherByIndex(9), subject: 'English', chapter: 'Poetry Analysis', date: getFutureDate(7), time: '10:00 AM', duration: 40, status: 'upcoming', description: 'Analysis of famous poems, literary devices, and themes.', recording: null, resources: null, type: 'Regular' },
      { id: 'lc14', teacher: getTeacherByIndex(0), subject: 'Physics', chapter: 'Kinematics', date: getPastDate(4), time: '9:30 AM', duration: 50, status: 'recorded', description: 'Motion in one and two dimensions, projectile motion.', recording: 'https://example.com/recording/lc14', resources: { notes: true, assignment: true }, type: 'Regular' },
      { id: 'lc15', teacher: getTeacherByIndex(1), subject: 'Chemistry', chapter: 'Equilibrium', date: getPastDate(5), time: '2:30 PM', duration: 55, status: 'recorded', description: 'Chemical equilibrium, Le Chatelier\'s principle.', recording: 'https://example.com/recording/lc15', resources: { notes: true, assignment: false }, type: 'Doubt' },
      { id: 'lc16', teacher: getTeacherByIndex(2), subject: 'Mathematics', chapter: 'Vectors', date: getPastDate(6), time: '11:00 AM', duration: 60, status: 'recorded', description: 'Vector algebra, dot and cross products, applications.', recording: 'https://example.com/recording/lc16', resources: { notes: false, assignment: true }, type: 'Workshop' },
      { id: 'lc17', teacher: getTeacherByIndex(3), subject: 'Biology', chapter: 'Cell Division', date: getPastDate(7), time: '10:00 AM', duration: 45, status: 'recorded', description: 'Mitosis, meiosis, and cell cycle regulation.', recording: 'https://example.com/recording/lc17', resources: { notes: true, assignment: true }, type: 'Regular' },
      { id: 'lc18', teacher: getTeacherByIndex(4), subject: 'English', chapter: 'Essay Writing', date: getPastDate(8), time: '4:00 PM', duration: 40, status: 'recorded', description: 'Structure, arguments, and techniques for effective essays.', recording: 'https://example.com/recording/lc18', resources: { notes: true, assignment: true }, type: 'Regular' },
      { id: 'lc19', teacher: getTeacherByIndex(5), subject: 'Physics', chapter: 'Wave Optics', date: getFutureDate(8), time: '9:00 AM', duration: 55, status: 'upcoming', description: 'Interference, diffraction, and polarization of light.', recording: null, resources: null, type: 'Regular' },
      { id: 'lc20', teacher: getTeacherByIndex(6), subject: 'Social Studies', chapter: 'India\'s Constitution', date: getFutureDate(9), time: '2:00 PM', duration: 50, status: 'upcoming', description: 'Key features, fundamental rights, and directive principles.', recording: null, resources: null, type: 'Doubt' },
      { id: 'lc21', teacher: getTeacherByIndex(7), subject: 'Mathematics', chapter: 'Matrices & Determinants', date: getFutureDate(10), time: '10:30 AM', duration: 60, status: 'upcoming', description: 'Matrix operations, determinants, and their applications.', recording: null, resources: null, type: 'Regular' },
      { id: 'lc22', teacher: getTeacherByIndex(8), subject: 'Biology', chapter: 'Ecology', date: getPastDate(9), time: '11:00 AM', duration: 50, status: 'recorded', description: 'Ecosystems, food chains, biodiversity and conservation.', recording: 'https://example.com/recording/lc22', resources: { notes: true, assignment: false }, type: 'Regular' },
      { id: 'lc23', teacher: getTeacherByIndex(9), subject: 'English', chapter: 'Communication Skills', date: getPastDate(10), time: '3:00 PM', duration: 35, status: 'recorded', description: 'Verbal and non-verbal communication, presentation skills.', recording: 'https://example.com/recording/lc23', resources: { notes: true, assignment: true }, type: 'Regular' },
      { id: 'lc24', teacher: getTeacherByIndex(0), subject: 'Physics', chapter: 'Modern Physics', date: getFutureDate(11), time: '9:30 AM', duration: 60, status: 'upcoming', description: 'Quantum theory, photoelectric effect, atomic models.', recording: null, resources: null, type: 'Workshop' },
      { id: 'lc25', teacher: getTeacherByIndex(1), subject: 'Chemistry', chapter: 'Electrochemistry', date: getPastDate(11), time: '2:00 PM', duration: 50, status: 'recorded', description: 'Electrochemical cells, Nernst equation, electrolysis.', recording: 'https://example.com/recording/lc25', resources: { notes: true, assignment: true }, type: 'Regular' },
      { id: 'lc26', teacher: getTeacherByIndex(2), subject: 'Mathematics', chapter: 'Differential Equations', date: getFutureDate(12), time: '11:00 AM', duration: 55, status: 'upcoming', description: 'First and second order differential equations, applications.', recording: null, resources: null, type: 'Regular' },
      { id: 'lc27', teacher: getTeacherByIndex(3), subject: 'Biology', chapter: 'Evolution', date: getPastDate(12), time: '10:00 AM', duration: 45, status: 'recorded', description: 'Darwin\'s theory, natural selection, evidence of evolution.', recording: 'https://example.com/recording/lc27', resources: { notes: false, assignment: true }, type: 'Regular' },
      { id: 'lc28', teacher: getTeacherByIndex(4), subject: 'English', chapter: 'Drama Studies', date: getFutureDate(13), time: '4:00 PM', duration: 50, status: 'upcoming', description: 'Analysis of plays, character development, and themes.', recording: null, resources: null, type: 'Doubt' },
      { id: 'lc29', teacher: getTeacherByIndex(5), subject: 'Physics', chapter: 'Semiconductors', date: getPastDate(13), time: '9:00 AM', duration: 60, status: 'recorded', description: 'PN junctions, diodes, transistors and logic gates.', recording: 'https://example.com/recording/lc29', resources: { notes: true, assignment: true }, type: 'Regular' },
      { id: 'lc30', teacher: getTeacherByIndex(6), subject: 'Social Studies', chapter: 'Globalization', date: getPastDate(14), time: '1:00 PM', duration: 45, status: 'recorded', description: 'Economic globalization, cultural exchange, and global challenges.', recording: 'https://example.com/recording/lc30', resources: { notes: true, assignment: false }, type: 'Workshop' },
      { id: 'lc31', teacher: getTeacherByIndex(7), subject: 'Mathematics', chapter: 'Statistics', date: getFutureDate(14), time: '10:00 AM', duration: 50, status: 'upcoming', description: 'Mean, median, mode, standard deviation, and probability distributions.', recording: null, resources: null, type: 'Regular' },
      { id: 'lc32', teacher: getTeacherByIndex(8), subject: 'Biology', chapter: 'Biotechnology', date: getPastDate(15), time: '11:30 AM', duration: 55, status: 'recorded', description: 'DNA technology, genetic engineering, and applications.', recording: 'https://example.com/recording/lc32', resources: { notes: true, assignment: true }, type: 'Regular' },
      { id: 'lc33', teacher: getTeacherByIndex(9), subject: 'English', chapter: 'Report Writing', date: getPastDate(16), time: '3:30 PM', duration: 40, status: 'recorded', description: 'Formal report structure, data presentation, and analysis.', recording: 'https://example.com/recording/lc33', resources: { notes: true, assignment: true }, type: 'Regular' },
      { id: 'lc34', teacher: getTeacherByIndex(0), subject: 'Physics', chapter: 'Rotational Mechanics', date: getFutureDate(15), time: '9:00 AM', duration: 60, status: 'upcoming', description: 'Torque, angular momentum, moment of inertia.', recording: null, resources: null, type: 'Regular' },
      { id: 'lc35', teacher: getTeacherByIndex(3), subject: 'Biology', chapter: 'Plant Physiology', date: getFutureDate(16), time: '2:00 PM', duration: 50, status: 'upcoming', description: 'Photosynthesis, transpiration, and plant growth regulators.', recording: null, resources: null, type: 'Workshop' }
    ];

    for (var i = 0; i < staticClasses.length; i++) {
      result.push(staticClasses[i]);
    }

    if (md.meetings && Array.isArray(md.meetings)) {
      for (var i = 0; i < md.meetings.length; i++) {
        var m = md.meetings[i];
        if (m.class && m.class !== userClass) continue;
        var teacherObj = null;
        if (m.instructor) {
          if (typeof m.instructor === 'string') {
            teacherObj = getTeacher(m.instructor);
          } else {
            teacherObj = { name: m.instructor.name || 'Instructor' };
          }
        } else {
          teacherObj = getTeacherByIndex(i);
        }
        var isToday = m.date === todayStr;
        var isPast = m.date < todayStr;
        var status = isToday ? 'live' : (isPast ? 'recorded' : 'upcoming');
        result.push({
          id: m.id || 'mtg_' + i,
          teacher: teacherObj,
          subject: (function() { for (var k = 0; k < md.subjects.length; k++) { if (md.subjects[k].id === m.subjectId) return md.subjects[k].name; } return 'General'; })(),
          chapter: m.title || 'Session',
          date: m.date,
          time: m.time,
          duration: m.duration || 45,
          status: status,
          description: m.description || '',
          recording: null,
          resources: null,
          meetingLink: m.meetingLink || null,
          registeredCount: m.registeredCount || 0,
          type: 'Regular'
        });
      }
    }

    return result;
  }

  function getFilteredClasses(section) {
    var all = getAllClasses();
    var filtered = [];

    for (var i = 0; i < all.length; i++) {
      var c = all[i];

      if (searchQuery) {
        var q = searchQuery.toLowerCase();
        var match = (c.subject && c.subject.toLowerCase().indexOf(q) !== -1) ||
                    (c.chapter && c.chapter.toLowerCase().indexOf(q) !== -1) ||
                    (c.teacher && c.teacher.name && c.teacher.name.toLowerCase().indexOf(q) !== -1) ||
                    (c.description && c.description.toLowerCase().indexOf(q) !== -1);
        if (!match) continue;
      }

      if (filterState.subject && c.subject !== filterState.subject) continue;
      if (filterState.teacher) {
        var tq = filterState.teacher.toLowerCase();
        if (!c.teacher || !c.teacher.name || c.teacher.name.toLowerCase().indexOf(tq) === -1) continue;
      }
      if (filterState.status) {
        if (filterState.status === 'live' && c.date !== todayStr) continue;
        if (filterState.status === 'upcoming' && (c.status !== 'upcoming' || c.date < todayStr)) continue;
        if (filterState.status === 'recorded' && c.status !== 'recorded') continue;
      }
      if (filterState.type && c.type !== filterState.type) continue;

      if (section === 'today') {
        if (c.date === todayStr) filtered.push(c);
      } else if (section === 'upcoming') {
        if ((c.status === 'upcoming' || c.status === 'live') && c.date >= todayStr) filtered.push(c);
      } else if (section === 'recorded') {
        if (c.status === 'recorded') filtered.push(c);
      } else {
        filtered.push(c);
      }
    }

    sortClasses(filtered);
    return filtered;
  }

  function sortClasses(arr) {
    arr.sort(function(a, b) {
      if (sortBy === 'date') {
        if (a.date !== b.date) return a.date < b.date ? -1 : 1;
        var aTime = a.time || '00:00';
        var bTime = b.time || '00:00';
        return aTime < bTime ? -1 : 1;
      } else if (sortBy === 'subject') {
        return (a.subject || '').localeCompare(b.subject || '');
      } else if (sortBy === 'teacher') {
        return (a.teacher && a.teacher.name || '').localeCompare(b.teacher && b.teacher.name || '');
      }
      return 0;
    });
  }

  function getLiveNow() {
    var all = getAllClasses();
    for (var i = 0; i < all.length; i++) {
      if (all[i].status === 'live' && all[i].date === todayStr) return all[i];
    }
    return null;
  }

  function getFutureDate(days) {
    var d = new Date();
    d.setDate(d.getDate() + days);
    return d.toISOString().split('T')[0];
  }

  function getPastDate(days) {
    var d = new Date();
    d.setDate(d.getDate() - days);
    return d.toISOString().split('T')[0];
  }

  function renderVideoCall(meetingId) {
    var all = getAllClasses();
    var meeting = null;
    for (var i = 0; i < all.length; i++) {
      if (all[i].id === meetingId) { meeting = all[i]; break; }
    }
    if (!meeting) {
      meeting = { id: meetingId || 'custom', subject: 'Meeting', chapter: 'Session', teacher: { name: 'Host' }, date: todayStr, time: 'Now', duration: 45, description: '' };
    }

    callState = { meetingId: meetingId, micOn: true, camOn: true, screenSharing: false, showChat: false, showParticipants: false, showClassInfo: false, elapsed: 0, chatMessages: [{ author: 'System', text: 'Call started', time: '0:00' }] };

    var mockParticipants = [
      { name: 'You' },
      { name: 'Priya Sharma' },
      { name: 'Arun Patel' },
      { name: 'Sneha Kumar' },
      { name: 'Rohit Singh' },
      { name: 'Ananya Gupta' }
    ];
    var participants = mockParticipants.slice(0, 6);

    var overlay = document.createElement('div');
    overlay.className = 'modal-overlay';
    overlay.id = 'video-call-overlay';
    overlay.style.zIndex = '600';

    var html = '<div class="video-call-container" style="background:#0a0e1a;border-radius:var(--radius-xl);width:95%;max-width:1200px;max-height:95vh;overflow:hidden;display:flex;flex-direction:column;border:1px solid var(--border-color);box-shadow:var(--shadow-xl);animation:scaleIn 0.3s ease">';

    html += '<div class="flex items-center justify-between p-4" style="background:rgba(0,0,0,0.4);border-bottom:1px solid rgba(255,255,255,0.08)">';
    html += '<div class="flex items-center gap-3"><span class="text-sm font-semibold">' + utils.sanitizeHTML(meeting.subject) + ': ' + utils.sanitizeHTML(meeting.chapter) + '</span><span class="badge badge-red animate-pulse">● Live</span><span class="text-xs text-secondary" id="call-timer">00:00</span></div>';
    html += '<div class="flex items-center gap-2"><span class="text-xs text-tertiary">🆔 ' + (meeting.id || 'MTG-001') + '</span><button class="btn btn-ghost btn-icon-sm" id="close-video-call" style="color:var(--text-tertiary)">✕</button></div>';
    html += '</div>';

    html += '<div class="flex flex-1" style="min-height:0">';

    html += '<div class="flex-1 p-4" style="overflow-y:auto">';
    html += '<div class="grid" style="grid-template-columns:repeat(auto-fill, minmax(200px, 1fr));gap:var(--space-4)">';
    for (var i = 0; i < participants.length; i++) {
      var p = participants[i];
      var isYou = i === 0;
      html += '<div class="video-participant" style="aspect-ratio:16/9;background:linear-gradient(135deg,#1a1a2e,#16213e);border-radius:var(--radius-lg);display:flex;flex-direction:column;align-items:center;justify-content:center;position:relative;border:1px solid rgba(255,255,255,0.06)">';
      html += '<div class="avatar avatar-lg" style="background:' + utils.getGradient(i) + ';width:64px;height:64px;font-size:var(--text-2xl)">' + utils.getInitials(p.name) + '</div>';
      html += '<div class="text-sm font-medium mt-3">' + utils.sanitizeHTML(p.name) + '</div>';
      if (isYou) html += '<div class="text-xs text-tertiary">(You)</div>';
      if (isYou && !callState.camOn) html += '<div class="absolute bottom-2 right-2" style="background:rgba(0,0,0,0.6);border-radius:50%;width:28px;height:28px;display:flex;align-items:center;justify-content:center;font-size:12px">📷</div>';
      html += '</div>';
    }
    html += '</div></div>';

    html += '<div id="call-sidebar" style="display:' + (callState.showChat || callState.showParticipants || callState.showClassInfo ? 'flex' : 'none') + ';flex-direction:column;width:340px;border-left:1px solid rgba(255,255,255,0.08);flex-shrink:0;background:rgba(0,0,0,0.2)">';

    html += '<div id="call-chat-panel" style="display:' + (callState.showChat ? 'flex' : 'none') + ';flex-direction:column;flex:1;min-height:0">';
    html += '<div class="p-4 font-semibold text-sm border-b" style="border-color:rgba(255,255,255,0.08)">💬 Chat</div>';
    html += '<div class="flex-1 p-4 overflow-auto flex flex-col gap-3" id="chat-messages">';
    for (var c = 0; c < callState.chatMessages.length; c++) {
      var msg = callState.chatMessages[c];
      html += '<div class="text-sm"><span class="font-medium text-accent-blue">' + utils.sanitizeHTML(msg.author) + ':</span> <span class="text-secondary">' + utils.sanitizeHTML(msg.text) + '</span><span class="text-xs text-tertiary ml-2">' + msg.time + '</span></div>';
    }
    html += '</div>';
    html += '<div class="flex gap-2 p-4 border-t" style="border-color:rgba(255,255,255,0.08)">';
    html += '<input type="text" class="input-field" id="chat-input" placeholder="Type a message..." style="flex:1;background:rgba(255,255,255,0.06)">';
    html += '<button class="btn btn-primary btn-sm" id="chat-send">Send</button></div></div>';

    html += '<div id="call-participants-panel" style="display:' + (callState.showParticipants ? 'flex' : 'none') + ';flex-direction:column;flex:1">';
    html += '<div class="p-4 font-semibold text-sm border-b" style="border-color:rgba(255,255,255,0.08)">👥 Participants (' + participants.length + ')</div>';
    html += '<div class="flex-1 p-4 overflow-auto flex flex-col gap-2">';
    for (var i = 0; i < participants.length; i++) {
      html += '<div class="flex items-center gap-3 p-2 rounded-md hover:bg-white/5"><div class="avatar avatar-sm" style="background:' + utils.getGradient(i) + '">' + utils.getInitials(participants[i].name) + '</div><span class="text-sm">' + utils.sanitizeHTML(participants[i].name) + (i === 0 ? ' (You)' : '') + '</span></div>';
    }
    html += '</div></div>';

    html += '<div id="call-class-info-panel" style="display:' + (callState.showClassInfo ? 'flex' : 'none') + ';flex-direction:column;flex:1">';
    html += '<div class="p-4 font-semibold text-sm border-b" style="border-color:rgba(255,255,255,0.08)">📋 Class Info</div>';
    html += '<div class="flex-1 p-4 overflow-auto">';
    html += '<div class="mb-4"><div class="text-xs text-tertiary mb-1">Subject</div><div class="text-sm font-medium">' + utils.sanitizeHTML(meeting.subject) + '</div></div>';
    html += '<div class="mb-4"><div class="text-xs text-tertiary mb-1">Topic</div><div class="text-sm font-medium">' + utils.sanitizeHTML(meeting.chapter) + '</div></div>';
    html += '<div class="mb-4"><div class="text-xs text-tertiary mb-1">Teacher</div><div class="text-sm font-medium">' + utils.sanitizeHTML(meeting.teacher.name) + '</div></div>';
    if (meeting.description) {
      html += '<div class="mb-4"><div class="text-xs text-tertiary mb-1">Teacher Notes</div><div class="text-sm text-secondary">' + utils.sanitizeHTML(meeting.description) + '</div></div>';
    }
    html += '<div class="mb-4"><div class="text-xs text-tertiary mb-1">Duration</div><div class="text-sm font-medium">' + meeting.duration + ' minutes</div></div>';
    html += '<div class="flex gap-2 flex-wrap"><button class="btn btn-sm btn-ghost">📝 Download Notes</button><button class="btn btn-sm btn-ghost">📋 View Assignment</button></div>';
    html += '</div></div>';

    html += '</div>';
    html += '</div>';

    html += '<div class="flex items-center justify-center gap-4 p-4" style="background:rgba(0,0,0,0.4);border-top:1px solid rgba(255,255,255,0.08)">';
    html += '<button class="call-control-btn" id="btn-mic" style="width:48px;height:48px;border-radius:50%;background:rgba(255,255,255,0.1);display:flex;align-items:center;justify-content:center;font-size:1.25rem;transition:all 0.2s;border:1px solid rgba(255,255,255,0.1);cursor:pointer" title="Mic (On)">🎤</button>';
    html += '<button class="call-control-btn" id="btn-cam" style="width:48px;height:48px;border-radius:50%;background:rgba(255,255,255,0.1);display:flex;align-items:center;justify-content:center;font-size:1.25rem;transition:all 0.2s;border:1px solid rgba(255,255,255,0.1);cursor:pointer" title="Camera (On)">📷</button>';
    html += '<button class="call-control-btn" id="btn-screen" style="width:48px;height:48px;border-radius:50%;background:rgba(255,255,255,0.1);display:flex;align-items:center;justify-content:center;font-size:1.25rem;transition:all 0.2s;border:1px solid rgba(255,255,255,0.1);cursor:pointer" title="Share Screen">🖥️</button>';
    html += '<button class="call-control-btn" id="btn-chat-toggle" style="width:48px;height:48px;border-radius:50%;background:rgba(255,255,255,0.1);display:flex;align-items:center;justify-content:center;font-size:1.25rem;transition:all 0.2s;border:1px solid rgba(255,255,255,0.1);cursor:pointer" title="Chat">💬</button>';
    html += '<button class="call-control-btn" id="btn-participants-toggle" style="width:48px;height:48px;border-radius:50%;background:rgba(255,255,255,0.1);display:flex;align-items:center;justify-content:center;font-size:1.25rem;transition:all 0.2s;border:1px solid rgba(255,255,255,0.1);cursor:pointer" title="Participants">👥</button>';
    html += '<button class="call-control-btn" id="btn-class-info" style="width:48px;height:48px;border-radius:50%;background:rgba(255,255,255,0.1);display:flex;align-items:center;justify-content:center;font-size:1.25rem;transition:all 0.2s;border:1px solid rgba(255,255,255,0.1);cursor:pointer" title="Class Info">📋</button>';
    html += '<button class="call-control-btn" id="btn-end-call" style="width:56px;height:56px;border-radius:50%;background:var(--accent-red);display:flex;align-items:center;justify-content:center;font-size:1.25rem;transition:all 0.2s;box-shadow:0 0 20px rgba(239,68,68,0.4);cursor:pointer" title="End Call">📞</button>';
    html += '</div>';

    html += '</div>';
    overlay.innerHTML = html;
    document.body.appendChild(overlay);
    bindCallEvents(meeting);
    startCallTimer();
  }

  function startCallTimer() {
    if (callState.timerInterval) clearInterval(callState.timerInterval);
    callState.elapsed = 0;
    var timerEl = document.getElementById('call-timer');
    callState.timerInterval = setInterval(function() {
      callState.elapsed++;
      var mins = Math.floor(callState.elapsed / 60);
      var secs = callState.elapsed % 60;
      if (timerEl) timerEl.textContent = (mins < 10 ? '0' : '') + mins + ':' + (secs < 10 ? '0' : '') + secs;
    }, 1000);
  }

  function bindCallEvents(meeting) {
    var closeBtn = document.getElementById('close-video-call');
    if (closeBtn) {
      closeBtn.addEventListener('click', function() {
        var overlay = document.getElementById('video-call-overlay');
        if (overlay) overlay.remove();
        if (callState && callState.timerInterval) clearInterval(callState.timerInterval);
        callState = null;
      });
    }

    var endBtn = document.getElementById('btn-end-call');
    if (endBtn) {
      endBtn.addEventListener('click', function() {
        var overlay = document.getElementById('video-call-overlay');
        if (overlay) overlay.remove();
        if (callState && callState.timerInterval) clearInterval(callState.timerInterval);
        callState = null;
      });
    }

    var micBtn = document.getElementById('btn-mic');
    if (micBtn) {
      micBtn.addEventListener('click', function() {
        if (!callState) return;
        callState.micOn = !callState.micOn;
        this.style.background = callState.micOn ? 'rgba(255,255,255,0.1)' : 'var(--accent-red)';
        this.title = callState.micOn ? 'Mic (On)' : 'Mic (Off)';
      });
    }

    var camBtn = document.getElementById('btn-cam');
    if (camBtn) {
      camBtn.addEventListener('click', function() {
        if (!callState) return;
        callState.camOn = !callState.camOn;
        this.style.background = callState.camOn ? 'rgba(255,255,255,0.1)' : 'var(--accent-red)';
        this.title = callState.camOn ? 'Camera (On)' : 'Camera (Off)';
      });
    }

    var screenBtn = document.getElementById('btn-screen');
    if (screenBtn) {
      screenBtn.addEventListener('click', function() {
        if (!callState) return;
        callState.screenSharing = !callState.screenSharing;
        this.style.background = callState.screenSharing ? 'var(--accent-green)' : 'rgba(255,255,255,0.1)';
        this.title = callState.screenSharing ? 'Stop Sharing' : 'Share Screen';
      });
    }

    var chatToggle = document.getElementById('btn-chat-toggle');
    if (chatToggle) {
      chatToggle.addEventListener('click', function() {
        if (!callState) return;
        callState.showChat = !callState.showChat;
        if (callState.showChat) { callState.showParticipants = false; callState.showClassInfo = false; }
        updateCallSidebar();
      });
    }

    var participantsToggle = document.getElementById('btn-participants-toggle');
    if (participantsToggle) {
      participantsToggle.addEventListener('click', function() {
        if (!callState) return;
        callState.showParticipants = !callState.showParticipants;
        if (callState.showParticipants) { callState.showChat = false; callState.showClassInfo = false; }
        updateCallSidebar();
      });
    }

    var classInfoToggle = document.getElementById('btn-class-info');
    if (classInfoToggle) {
      classInfoToggle.addEventListener('click', function() {
        if (!callState) return;
        callState.showClassInfo = !callState.showClassInfo;
        if (callState.showClassInfo) { callState.showChat = false; callState.showParticipants = false; }
        updateCallSidebar();
      });
    }

    var chatSend = document.getElementById('chat-send');
    var chatInput = document.getElementById('chat-input');
    if (chatSend && chatInput) {
      chatSend.addEventListener('click', function() { sendChatMessage(); });
      chatInput.addEventListener('keydown', function(e) {
        if (e.key === 'Enter') { e.preventDefault(); sendChatMessage(); }
      });
    }
  }

  function sendChatMessage() {
    var input = document.getElementById('chat-input');
    if (!input || !input.value.trim()) return;
    var userObj = store.get('user');
    var msg = { author: userObj ? userObj.name : 'You', text: input.value.trim(), time: document.getElementById('call-timer') ? document.getElementById('call-timer').textContent : '0:00' };
    callState.chatMessages.push(msg);
    input.value = '';
    var container = document.getElementById('chat-messages');
    if (container) {
      container.innerHTML += '<div class="text-sm"><span class="font-medium text-accent-blue">' + utils.sanitizeHTML(msg.author) + ':</span> <span class="text-secondary">' + utils.sanitizeHTML(msg.text) + '</span><span class="text-xs text-tertiary ml-2">' + msg.time + '</span></div>';
      container.scrollTop = container.scrollHeight;
    }
  }

  function updateCallSidebar() {
    var sidebar = document.getElementById('call-sidebar');
    var chatPanel = document.getElementById('call-chat-panel');
    var participantsPanel = document.getElementById('call-participants-panel');
    var classInfoPanel = document.getElementById('call-class-info-panel');
    if (sidebar) sidebar.style.display = (callState.showChat || callState.showParticipants || callState.showClassInfo) ? 'flex' : 'none';
    if (chatPanel) chatPanel.style.display = callState.showChat ? 'flex' : 'none';
    if (participantsPanel) participantsPanel.style.display = callState.showParticipants ? 'flex' : 'none';
    if (classInfoPanel) classInfoPanel.style.display = callState.showClassInfo ? 'flex' : 'none';
  }

  function bindEvents() {
    var searchInput = document.getElementById('search-classes');
    if (searchInput) {
      searchInput.addEventListener('input', function() {
        searchQuery = this.value;
        render();
      });
    }

    var filterToggle = document.getElementById('btn-filter-toggle');
    if (filterToggle) {
      filterToggle.addEventListener('click', function() {
        showFilter = !showFilter;
        var drawer = document.getElementById('filter-drawer');
        var overlay = document.getElementById('filter-overlay');
        if (drawer) drawer.style.display = showFilter ? 'block' : 'none';
        if (overlay) overlay.style.display = showFilter ? 'block' : 'none';
      });
    }

    var closeFilter = document.getElementById('close-filter-drawer');
    if (closeFilter) {
      closeFilter.addEventListener('click', function() {
        showFilter = false;
        var drawer = document.getElementById('filter-drawer');
        var overlay = document.getElementById('filter-overlay');
        if (drawer) drawer.style.display = 'none';
        if (overlay) overlay.style.display = 'none';
      });
    }

    var filterOverlay = document.getElementById('filter-overlay');
    if (filterOverlay) {
      filterOverlay.addEventListener('click', function() {
        showFilter = false;
        var drawer = document.getElementById('filter-drawer');
        var overlay = document.getElementById('filter-overlay');
        if (drawer) drawer.style.display = 'none';
        if (overlay) overlay.style.display = 'none';
      });
    }

    var applyFilters = document.getElementById('apply-filters');
    if (applyFilters) {
      applyFilters.addEventListener('click', function() {
        var subjectEl = document.getElementById('filter-subject');
        var classEl = document.getElementById('filter-class');
        var teacherEl = document.getElementById('filter-teacher');
        var statusEl = document.getElementById('filter-status');
        var typeEl = document.getElementById('filter-type');
        filterState.subject = subjectEl ? subjectEl.value : '';
        filterState.class = classEl ? classEl.value : '';
        filterState.teacher = teacherEl ? teacherEl.value : '';
        filterState.status = statusEl ? statusEl.value : '';
        filterState.type = typeEl ? typeEl.value : '';
        showFilter = false;
        var drawer = document.getElementById('filter-drawer');
        var overlay = document.getElementById('filter-overlay');
        if (drawer) drawer.style.display = 'none';
        if (overlay) overlay.style.display = 'none';
        render();
      });
    }

    var resetFilters = document.getElementById('reset-filters');
    if (resetFilters) {
      resetFilters.addEventListener('click', function() {
        filterState = { subject: '', class: '', teacher: '', status: '', type: '' };
        showFilter = false;
        var drawer = document.getElementById('filter-drawer');
        var overlay = document.getElementById('filter-overlay');
        if (drawer) drawer.style.display = 'none';
        if (overlay) overlay.style.display = 'none';
        render();
      });
    }

    var clearAllFilters = document.getElementById('clear-all-filters');
    if (clearAllFilters) {
      clearAllFilters.addEventListener('click', function() {
        filterState = { subject: '', class: '', teacher: '', status: '', type: '' };
        render();
      });
    }

    var filterBadges = document.querySelectorAll('[data-filter-key]');
    for (var i = 0; i < filterBadges.length; i++) {
      filterBadges[i].addEventListener('click', function() {
        var key = this.dataset.filterKey;
        filterState[key] = '';
        render();
      });
    }

    var sortBtns = document.querySelectorAll('.sort-btn');
    for (var i = 0; i < sortBtns.length; i++) {
      sortBtns[i].addEventListener('click', function() {
        sortBy = this.dataset.sort;
        render();
      });
    }

    var joinLiveBtns = document.querySelectorAll('.join-live-btn');
    for (var i = 0; i < joinLiveBtns.length; i++) {
      joinLiveBtns[i].addEventListener('click', function() {
        renderVideoCall(this.dataset.id);
      });
    }

    var reminderBtns = document.querySelectorAll('.set-reminder-btn');
    for (var i = 0; i < reminderBtns.length; i++) {
      reminderBtns[i].addEventListener('click', function() {
        var self = this;
        if (self.innerHTML.indexOf('✓') === -1) {
          self.innerHTML = '🔔 ✓ Reminder Set';
          self.className = 'btn btn-sm btn-green set-reminder-btn';
        } else {
          self.innerHTML = '🔔 Remind';
          self.className = 'btn btn-sm btn-secondary set-reminder-btn';
        }
      });
    }

    var watchBtns = document.querySelectorAll('.watch-recording-btn');
    for (var i = 0; i < watchBtns.length; i++) {
      watchBtns[i].addEventListener('click', function() {
        var id = this.dataset.id;
        var all = getAllClasses();
        for (var c = 0; c < all.length; c++) {
          if (all[c].id === id && all[c].recording) {
            alert('▶ Playing recording: ' + all[c].subject + ' - ' + all[c].chapter);
            break;
          }
        }
      });
    }

    var downloadBtns = document.querySelectorAll('.download-recording-btn');
    for (var i = 0; i < downloadBtns.length; i++) {
      downloadBtns[i].addEventListener('click', function() {
        var id = this.dataset.id;
        var all = getAllClasses();
        for (var c = 0; c < all.length; c++) {
          if (all[c].id === id) {
            alert('⬇️ Downloading recording: ' + all[c].subject + ' - ' + all[c].chapter);
            break;
          }
        }
      });
    }

    var attendanceBtns = document.querySelectorAll('.mark-attendance-btn');
    for (var i = 0; i < attendanceBtns.length; i++) {
      attendanceBtns[i].addEventListener('click', function() {
        var id = this.dataset.id;
        if (attendanceStore[id]) {
          delete attendanceStore[id];
        } else {
          attendanceStore[id] = { date: todayStr, markedAt: new Date().toISOString() };
        }
        store.set('classAttendance', attendanceStore);
        render();
      });
    }

    var resourceBtns = document.querySelectorAll('.resource-btn');
    for (var i = 0; i < resourceBtns.length; i++) {
      resourceBtns[i].addEventListener('click', function() {
        var type = this.dataset.type;
        var labels = { notes: '📝 Opening Notes...', assignment: '📋 Opening Assignment...' };
        alert(labels[type] || 'Opening resource...');
      });
    }

    var calendarBtns = document.querySelectorAll('.calendar-link');
    for (var i = 0; i < calendarBtns.length; i++) {
      calendarBtns[i].addEventListener('click', function() {
        var self = this;
        if (self.innerHTML.indexOf('✓') === -1 && self.innerHTML.indexOf('Added') === -1) {
          var old = self.innerHTML;
          self.innerHTML = '📅 ✓ Added';
          setTimeout(function() { self.innerHTML = old; }, 3000);
        }
      });
    }

    var refreshBtn = document.getElementById('btn-refresh');
    if (refreshBtn) {
      refreshBtn.addEventListener('click', function() { render(); });
    }

    var scheduleBtn = document.getElementById('btn-schedule-meeting');
    if (scheduleBtn) {
      scheduleBtn.addEventListener('click', openScheduleModal);
    }
  }

  function openScheduleModal() {
    var overlay = document.createElement('div');
    overlay.className = 'modal-overlay';
    overlay.id = 'schedule-meeting-overlay';

    var modalHtml = '\
<div class="modal">\
  <div class="modal-header">\
    <h3 class="font-semibold text-lg">Schedule New Meeting</h3>\
    <button class="btn btn-ghost btn-icon-sm" id="close-schedule-modal">✕</button>\
  </div>\
  <div class="modal-body">\
    <div class="flex flex-col gap-4">\
      <div class="input-group"><label class="input-label">Meeting Title</label><input type="text" class="input-field" id="meeting-title-input" placeholder="e.g. Doubt Session: Topic Name"></div>\
      <div class="flex gap-4">\
        <div class="input-group flex-1"><label class="input-label">Date</label><input type="date" class="input-field" id="meeting-date-input" value="' + todayStr + '"></div>\
        <div class="input-group flex-1"><label class="input-label">Time</label><input type="time" class="input-field" id="meeting-time-input" value="16:00"></div>\
      </div>\
      <div class="flex gap-4">\
        <div class="input-group flex-1"><label class="input-label">Duration (min)</label><input type="number" class="input-field" id="meeting-duration-input" value="45" min="15" max="180"></div>\
        <div class="input-group flex-1"><label class="input-label">Type</label><select class="input-field" id="meeting-type-input"><option value="Regular">Regular</option><option value="Doubt">Doubt Session</option><option value="Workshop">Workshop</option></select></div>\
      </div>\
      <div class="input-group"><label class="input-label">Description</label><textarea class="input-field" id="meeting-desc-input" placeholder="Meeting description and topics..." style="min-height:80px"></textarea></div>\
    </div>\
  </div>\
  <div class="modal-footer">\
    <button class="btn btn-secondary" id="cancel-schedule">Cancel</button>\
    <button class="btn btn-primary" id="confirm-schedule">Schedule Meeting</button>\
  </div>\
</div>';
    overlay.innerHTML = modalHtml;
    document.body.appendChild(overlay);

    document.getElementById('close-schedule-modal').addEventListener('click', function() { overlay.remove(); });
    document.getElementById('cancel-schedule').addEventListener('click', function() { overlay.remove(); });
    overlay.addEventListener('click', function(e) { if (e.target === overlay) overlay.remove(); });

    document.getElementById('confirm-schedule').addEventListener('click', function() {
      var title = document.getElementById('meeting-title-input').value.trim();
      var date = document.getElementById('meeting-date-input').value;
      var time = document.getElementById('meeting-time-input').value;
      var duration = parseInt(document.getElementById('meeting-duration-input').value, 10) || 45;
      var type = document.getElementById('meeting-type-input').value;
      var desc = document.getElementById('meeting-desc-input').value.trim();
      if (!title || !date || !time) { alert('Please fill in title, date, and time.'); return; }

      var timeFormatted = new Date('2000-01-01T' + time).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
      var newMeeting = {
        id: 'm_' + Date.now(),
        teacher: store.get('user') || { name: 'You' },
        subject: 'General',
        chapter: title,
        date: date,
        time: timeFormatted,
        duration: duration,
        description: desc || 'No description provided.',
        status: 'upcoming',
        recording: null,
        resources: null,
        type: type
      };

      var all = getAllClasses();
      all.unshift(newMeeting);
      overlay.remove();
      render();
    });
  }

  render();
};
