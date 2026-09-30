window.renderPage.exams = function(params) {
  if (!window._examDelegated) {
    window._examDelegated = true;
    document.addEventListener('click', function(e) {
      var t = e.target.closest('[data-action^="exam:"]');
      if (!t) return;
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'SELECT') return;
      var p = t.getAttribute('data-action').split(':');
      var c = p[1], a = p[2], b = p[3];
      if (c === 'navigate' && a) { window.Router.navigate(a); }
      else if (c === 'openFilter') { window.renderPage.exams.openFilterDrawer(); }
      else if (c === 'clearFilters') { window.renderPage.exams.clearFilters(); }
      else if (c === 'removeChip' && a) {
        if (b) { window.renderPage.exams.removeFilterChip(a, b); }
        else { window.renderPage.exams.removeFilterChip(a); }
      }
    });
  }
  var mainContent = document.getElementById('main-content');
  var store = window.Store;
  var api = window.API;
  var utils = window.Utils;
  var md = window.mockData;
  var exams = md.exams || [];
  var subjects = md.subjects || [];
  var chaptersData = md.chapters || {};
  var user = store.get('user') || {};
  var userClass = user.class ? String(user.class) : '';
  var userStream = user.stream || '';

  var filters = {
    search: '',
    subjects: [],
    classes: [],
    chapters: [],
    examType: '',
    status: '',
    duration: '',
    sort: 'newest'
  };

  var durationOptions = [
    { label: '<1 hour', min: 0, max: 60 },
    { label: '1-2 hours', min: 60, max: 120 },
    { label: '2-3 hours', min: 120, max: 180 },
    { label: '3+ hours', min: 180, max: Infinity }
  ];

  function es(icon, title, msg) {
    return '<div class="empty-state" style="text-align:center;padding:40px 20px"><div class="empty-state-icon" style="font-size:3rem;margin-bottom:16px">' + icon + '</div><div class="empty-state-title" style="font-size:1.1rem;font-weight:600;color:var(--text-primary);margin-bottom:8px">' + title + '</div><div class="empty-state-text" style="font-size:0.875rem;color:var(--text-secondary)">' + msg + '</div></div>';
  }

  function getUserSubjects() {
    var result = [];
    for (var i = 0; i < subjects.length; i++) {
      var s = subjects[i];
      if (s.class && userClass && String(s.class) === userClass) {
        if (!s.stream || !userStream || s.stream === userStream) {
          result.push(s);
        }
      }
    }
    if (result.length === 0) {
      result.push({ id: '', name: 'No subjects available' });
    }
    return result;
  }

  function getSubjectById(sid) {
    for (var i = 0; i < subjects.length; i++) {
      if (subjects[i].id === sid) return subjects[i];
    }
    return null;
  }

  function getSubjectName(subjectId) {
    var s = getSubjectById(subjectId);
    return s ? s.name : 'General';
  }

  function getExamTypeLabel(type) {
    var t = (type || '').toLowerCase();
    if (t === 'mock') return 'Mock Test';
    if (t === 'board' || t === 'competitive') return 'Competitive Exams';
    if (t === 'previous') return 'Previous Papers';
    return 'Practice Test';
  }

  function getExamStatus(exam) {
    if (!exam.scheduledDate) return 'Recommended';
    var now = new Date();
    var examDate = new Date(exam.scheduledDate);
    return examDate < now ? 'Completed' : 'Upcoming';
  }

  function getChaptersForSubject(subjectId) {
    if (!subjectId || !chaptersData[subjectId]) return [];
    return chaptersData[subjectId];
  }

  function matchesDuration(exam, durationLabel) {
    var dur = exam.duration || 0;
    for (var i = 0; i < durationOptions.length; i++) {
      var opt = durationOptions[i];
      if (opt.label === durationLabel) {
        return dur >= opt.min && dur < opt.max;
      }
    }
    return true;
  }

  function getFilteredExams() {
    var result = [];
    for (var i = 0; i < exams.length; i++) {
      var exam = exams[i];
      if (filters.search) {
        if (exam.title.toLowerCase().indexOf(filters.search.toLowerCase()) === -1) continue;
      }
      if (filters.subjects && filters.subjects.length > 0) {
        var sname = getSubjectName(exam.subjectId);
        var found = false;
        for (var si = 0; si < filters.subjects.length; si++) {
          if (sname.toLowerCase() === filters.subjects[si].toLowerCase()) { found = true; break; }
        }
        if (!found) continue;
      }
      if (filters.classes && filters.classes.length > 0) {
        var found = false;
        for (var ci = 0; ci < filters.classes.length; ci++) {
          if (String(exam.class) === filters.classes[ci]) { found = true; break; }
        }
        if (!found) continue;
      }
      if (filters.examType) {
        if ((exam.type || '').toLowerCase() !== filters.examType.toLowerCase()) continue;
      }
      if (filters.status) {
        var status = getExamStatus(exam);
        if (status.toLowerCase() !== filters.status.toLowerCase()) continue;
      }
      if (filters.duration) {
        if (!matchesDuration(exam, filters.duration)) continue;
      }
      result.push(exam);
    }
    if (filters.sort === 'newest') {
      result.sort(function(a, b) {
        var da = a.scheduledDate ? new Date(a.scheduledDate).getTime() : 0;
        var db = b.scheduledDate ? new Date(b.scheduledDate).getTime() : 0;
        return db - da;
      });
    } else if (filters.sort === 'date') {
      result.sort(function(a, b) {
        var da = a.scheduledDate ? new Date(a.scheduledDate).getTime() : 0;
        var db = b.scheduledDate ? new Date(b.scheduledDate).getTime() : 0;
        return da - db;
      });
    } else if (filters.sort === 'duration') {
      result.sort(function(a, b) { return (a.duration || 0) - (b.duration || 0); });
    } else if (filters.sort === 'difficulty') {
      var diffMap = { easy: 1, medium: 2, hard: 3 };
      result.sort(function(a, b) {
        return (diffMap[a.difficulty] || 2) - (diffMap[b.difficulty] || 2);
      });
    }
    return result;
  }

  function getUpcomingExams() {
    var upcoming = [];
    for (var i = 0; i < exams.length; i++) {
      if (getExamStatus(exams[i]) === 'Upcoming') {
        upcoming.push(exams[i]);
      }
    }
    upcoming.sort(function(a, b) {
      return new Date(a.scheduledDate) - new Date(b.scheduledDate);
    });
    return upcoming.slice(0, 3);
  }

  function getRecommendedExams() {
    var recommended = [];
    for (var i = 0; i < exams.length; i++) {
      var exam = exams[i];
      if (getExamStatus(exam) === 'Recommended') {
        if (userClass && String(exam.class) === userClass) {
          recommended.push(exam);
        } else if (!userClass) {
          recommended.push(exam);
        }
      }
    }
    return recommended;
  }

  function getCompletedExams() {
    var completed = [];
    for (var i = 0; i < exams.length; i++) {
      if (getExamStatus(exams[i]) === 'Completed') {
        completed.push(exams[i]);
      }
    }
    return completed;
  }

  function renderExamCard(exam) {
    var status = getExamStatus(exam);
    var totalQ = 0;
    var sections = exam.sections || [];
    for (var s = 0; s < sections.length; s++) {
      totalQ += sections[s].questions || 0;
    }
    var statusColor = status === 'Upcoming' ? 'badge-yellow' : status === 'Completed' ? 'badge-cyan' : 'badge-green';
    var html = '<div class="glass-card" style="padding:var(--space-5)">';
    html += '<div class="flex items-center justify-between" style="margin-bottom:var(--space-3)">';
    html += '<span class="badge badge-blue">' + getExamTypeLabel(exam.type) + '</span>';
    html += '<span class="badge ' + statusColor + '">' + status + '</span>';
    html += '</div>';
    html += '<h3 style="font-size:var(--text-lg);font-weight:600;margin-bottom:var(--space-2)">' + utils.sanitizeHTML(exam.title) + '</h3>';
    html += '<div class="c-fs-xs c-text-tertiary c-mb-1">ID: EXAM-' + exam.id + '</div>';
    html += '<div class="text-sm text-secondary" style="margin-bottom:var(--space-3)">' + getSubjectName(exam.subjectId) + ' · Class ' + exam.class + '</div>';
    html += '<div class="flex flex-wrap gap-3 text-sm text-secondary" style="margin-bottom:var(--space-4)">';
    html += '<span>\u23F1\uFE0F ' + exam.duration + ' min</span>';
    html += '<span>\uD83D\uDCDD ' + totalQ + ' questions</span>';
    html += '<span>\uD83C\uDFC6 ' + exam.totalMarks + ' marks</span>';
    html += '</div>';
    if (exam.scheduledDate) {
      html += '<div class="text-xs text-secondary" style="margin-bottom:var(--space-3)">\uD83D\uDCC5 ' + utils.formatDate(exam.scheduledDate, 'dd mmm yyyy') + '</div>';
    }
    if (status === 'Completed') {
      html += '<button class="btn btn-secondary btn-block" data-action="exam:navigate:/exam/' + exam.id + '">View Results</button>';
    } else {
      html += '<button class="btn btn-primary btn-block" data-action="exam:navigate:/exam/' + exam.id + '">Start Exam</button>';
    }
    html += '</div>';
    return html;
  }

  function renderCards(examList) {
    if (examList.length === 0) {
      return '<div class="flex flex-col items-center justify-center empty-state" style="grid-column:1/-1;padding:var(--space-8)"><div class="empty-state-icon">\uD83D\uDCCB</div><h2 class="empty-state-title">No exams found</h2><p class="empty-state-text" style="margin-bottom:var(--space-2)">Check back later for new exams</p>';
    }
    var html = '<div class="grid-cols-auto-sm" style="display:grid;gap:var(--space-4);grid-template-columns:repeat(auto-fill,minmax(280px,1fr))">';
    for (var i = 0; i < examList.length; i++) {
      html += renderExamCard(examList[i]);
    }
    html += '</div>';
    return html;
  }

  function getActiveFilterCount() {
    var count = 0;
    if (filters.search) count++;
    if (filters.subjects && filters.subjects.length > 0) count += filters.subjects.length;
    if (filters.classes && filters.classes.length > 0) count += filters.classes.length;
    if (filters.chapters && filters.chapters.length > 0) count += filters.chapters.length;
    if (filters.examType) count++;
    if (filters.status) count++;
    if (filters.duration) count++;
    return count;
  }

  function renderFilterChips() {
    var html = '';
    if (filters.search) {
      html += '<span class="filter-chip"><span class="filter-chip-label">Search: "' + utils.sanitizeHTML(filters.search) + '"</span><button class="filter-chip-remove" data-action="exam:removeChip:search" title="Remove">\u2715</button></span>';
    }
    if (filters.subjects) {
      for (var si = 0; si < filters.subjects.length; si++) {
        html += '<span class="filter-chip"><span class="filter-chip-label">' + utils.sanitizeHTML(filters.subjects[si]) + '</span><button class="filter-chip-remove" data-action="exam:removeChip:subjects:' + filters.subjects[si].replace(/'/g, "\\'") + '" title="Remove">\u2715</button></span>';
      }
    }
    if (filters.classes) {
      for (var ci = 0; ci < filters.classes.length; ci++) {
        html += '<span class="filter-chip"><span class="filter-chip-label">Class: ' + utils.sanitizeHTML(filters.classes[ci]) + '</span><button class="filter-chip-remove" data-action="exam:removeChip:classes:' + filters.classes[ci].replace(/'/g, "\\'") + '" title="Remove">\u2715</button></span>';
      }
    }
    if (filters.chapters) {
      for (var chi = 0; chi < filters.chapters.length; chi++) {
        html += '<span class="filter-chip"><span class="filter-chip-label">Chapter: ' + utils.sanitizeHTML(filters.chapters[chi]) + '</span><button class="filter-chip-remove" data-action="exam:removeChip:chapters:' + filters.chapters[chi].replace(/'/g, "\\'") + '" title="Remove">\u2715</button></span>';
      }
    }
    if (filters.examType) {
      html += '<span class="filter-chip"><span class="filter-chip-label">Type: ' + utils.sanitizeHTML(filters.examType) + '</span><button class="filter-chip-remove" data-action="exam:removeChip:type" title="Remove">\u2715</button></span>';
    }
    if (filters.status) {
      html += '<span class="filter-chip"><span class="filter-chip-label">Status: ' + utils.sanitizeHTML(filters.status) + '</span><button class="filter-chip-remove" data-action="exam:removeChip:status" title="Remove">\u2715</button></span>';
    }
    if (filters.duration) {
      html += '<span class="filter-chip"><span class="filter-chip-label">Duration: ' + utils.sanitizeHTML(filters.duration) + '</span><button class="filter-chip-remove" data-action="exam:removeChip:duration" title="Remove">\u2715</button></span>';
    }
    if (html) {
      html = '<div class="filter-chips">' + html + '</div>';
    }
    return html;
  }

  function render() {
    var filtered = getFilteredExams();
    var upcoming = getUpcomingExams();
    var recommended = getRecommendedExams();
    var completed = getCompletedExams();
    var activeFilterCount = getActiveFilterCount();

    var html = '<div class="page-container">';
    html += '<div class="page-header"><div><h1 class="page-title">Exams</h1><p class="page-subtitle">Practice tests and mock exams for exam preparation</p></div></div>';

    html += '<div class="flex items-center gap-3" style="flex-wrap:wrap;margin-bottom:var(--space-4)">';
    html += '<div style="position:relative;display:inline-block">';
    html += '<span style="position:absolute;left:10px;top:50%;transform:translateY(-50%);color:var(--text-tertiary);font-size:0.875rem;pointer-events:none">\uD83D\uDD0D</span>';
    html += '<input type="text" class="input-field exams-search-input" placeholder="Search exams..." value="' + utils.sanitizeHTML(filters.search) + '" oninput="window.renderPage.exams.updateFilter(\'search\',this.value)" style="padding-left:2.25rem;width:200px">';
    html += '</div>';
    html += '<select class="input-field" style="width:auto;min-width:140px;padding:0.5rem 2rem 0.5rem 0.75rem" onchange="window.renderPage.exams.updateFilter(\'sort\',this.value)">';
    html += '<option value="newest"' + (filters.sort === 'newest' ? ' selected' : '') + '>Sort: Newest</option>';
    html += '<option value="date"' + (filters.sort === 'date' ? ' selected' : '') + '>Sort: Date</option>';
    html += '<option value="duration"' + (filters.sort === 'duration' ? ' selected' : '') + '>Sort: Duration</option>';
    html += '<option value="difficulty"' + (filters.sort === 'difficulty' ? ' selected' : '') + '>Sort: Difficulty</option>';
    html += '</select>';
    html += '<button class="btn btn-secondary btn-sm" data-action="exam:openFilter" style="position:relative">\uD83D\uDD0D Filters' + (activeFilterCount > 0 ? '<span class="filter-count-badge">' + activeFilterCount + '</span>' : '') + '</button>';
    if (activeFilterCount > 0) {
      html += '<button class="btn btn-ghost btn-sm" data-action="exam:clearFilters" title="Clear filters">\u21BA</button>';
    }
    html += '</div>';

    html += renderFilterChips();

    html += '<div class="section-header" style="margin-top:var(--space-6);display:flex;align-items:center;justify-content:space-between;margin-bottom:var(--space-3)"><h3 class="section-title" style="font-size:var(--text-base);font-weight:600">Upcoming Exams</h3><span class="badge badge-yellow" style="font-size:var(--text-xs)">' + upcoming.length + '</span></div>';
    if (upcoming.length > 0) {
      html += renderCards(upcoming);
    } else {
      html += '<div class="empty-state" style="text-align:center;padding:1.5rem 0"><div class="empty-state-icon" style="font-size:2rem;margin-bottom:0.5rem">\uD83D\uDCC5</div><div class="empty-state-title" style="font-weight:600;margin-bottom:0.25rem">No upcoming exams</div><div class="empty-state-text" style="font-size:0.875rem;color:var(--text-secondary)">Great, you\'re all caught up!</div></div>';
    }

    if (recommended.length > 0) {
      html += '<div class="section-header" style="margin-top:var(--space-6);display:flex;align-items:center;justify-content:space-between;margin-bottom:var(--space-3)"><h3 class="section-title" style="font-size:var(--text-base);font-weight:600">Recommended for You</h3><span class="badge badge-green" style="font-size:var(--text-xs)">Based on Class ' + userClass + '</span></div>';
      html += renderCards(recommended);
    }

    html += '<div class="section-header" style="margin-top:var(--space-6);display:flex;align-items:center;justify-content:space-between;margin-bottom:var(--space-3)"><h3 class="section-title" style="font-size:var(--text-base);font-weight:600">All Exams</h3><span class="badge badge-blue" style="font-size:var(--text-xs)">' + filtered.length + ' found</span></div>';
    html += renderCards(filtered);

    if (completed.length > 0) {
      html += '<div class="section-header" style="margin-top:var(--space-6);display:flex;align-items:center;justify-content:space-between;margin-bottom:var(--space-3)"><h3 class="section-title" style="font-size:var(--text-base);font-weight:600">Completed</h3><span class="badge badge-cyan" style="font-size:var(--text-xs)">' + completed.length + ' exams</span></div>';
      html += renderCards(completed);
    }

    html += '</div>';
    mainContent.innerHTML = html;
    mainContent.style.opacity = '0';
    mainContent.style.transition = 'opacity 0.3s ease';
    setTimeout(function() { mainContent.style.opacity = '1'; }, 50);
  }

  function openFilterDrawer() {
    var userSubjects = getUserSubjects();
    var availableChapters = [];
    if (filters.subjects && filters.subjects.length > 0) {
      for (var si = 0; si < filters.subjects.length; si++) {
        var subj = null;
        for (var sxi = 0; sxi < subjects.length; sxi++) {
          if (subjects[sxi].name === filters.subjects[si]) { subj = subjects[sxi]; break; }
        }
        if (subj) {
          var chs = getChaptersForSubject(subj.id);
          for (var ci = 0; ci < chs.length; ci++) {
            availableChapters.push(chs[ci]);
          }
        }
      }
    } else {
      for (var si = 0; si < userSubjects.length; si++) {
        var chs = getChaptersForSubject(userSubjects[si].id);
        for (var ci = 0; ci < chs.length; ci++) {
          availableChapters.push(chs[ci]);
        }
      }
    }

    window.FilterDrawer.openDrawer({
      title: 'Filter Exams',
      filters: [
        {
          id: 'search',
          label: 'Search',
          type: 'search',
          value: filters.search || '',
          placeholder: 'Search exams...'
        },
        {
          id: 'subject',
          label: 'Subject',
          type: 'checkbox',
          options: userSubjects.map(function(s) { return { value: s.name, label: s.name }; }),
          value: filters.subjects.slice()
        },
        {
          id: 'class',
          label: 'Class',
          type: 'checkbox',
          options: ['9','10','11','12','College'].map(function(c) { return { value: c, label: c }; }),
          value: filters.classes.slice()
        },
        {
          id: 'chapter',
          label: 'Chapter',
          type: 'checkbox',
          options: availableChapters.length > 0 ? availableChapters.map(function(ch) { return { value: String(ch.id), label: ch.name }; }) : [{ value: '', label: 'No chapters available' }],
          value: filters.chapters.slice()
        },
        {
          id: 'type',
          label: 'Type',
          type: 'radio',
          options: ['All','Midterm','Final','Practice','Mock'].map(function(t) { return { value: t === 'All' ? '' : t, label: t }; }),
          value: filters.examType || ''
        },
        {
          id: 'status',
          label: 'Status',
          type: 'radio',
          options: ['All','Upcoming','Ongoing','Completed'].map(function(s) { return { value: s === 'All' ? '' : s, label: s }; }),
          value: filters.status || ''
        },
        {
          id: 'duration',
          label: 'Duration',
          type: 'radio',
          options: ['Any','<1 hour','1-2 hours','2-3 hours','3+ hours'].map(function(d) { return { value: d === 'Any' ? '' : d, label: d }; }),
          value: filters.duration || ''
        }
      ],
      onApply: function(allValues) {
        filters.search = allValues.search || '';
        filters.subjects = allValues.subject || [];
        filters.classes = allValues.class || [];
        filters.chapters = allValues.chapter || [];
        filters.examType = allValues.type || '';
        filters.status = allValues.status || '';
        filters.duration = allValues.duration || '';
        render();
      },
      onReset: function() {
        filters.search = '';
        filters.subjects = [];
        filters.classes = [];
        filters.chapters = [];
        filters.examType = '';
        filters.status = '';
        filters.duration = '';
        render();
      }
    });
  }

  window.renderPage.exams.updateFilter = function(key, value) {
    filters[key] = value;
    render();
  };

  window.renderPage.exams.clearFilters = function() {
    filters = {
      search: '',
      subjects: [],
      classes: [],
      chapters: [],
      examType: '',
      status: '',
      duration: '',
      sort: filters.sort
    };
    render();
  };

  window.renderPage.exams.removeFilterChip = function(type, value) {
    if (type === 'search') {
      filters.search = '';
      var searchInput = document.querySelector('.exams-search-input');
      if (searchInput) searchInput.value = '';
    } else if (type === 'subjects') {
      var si = filters.subjects.indexOf(value);
      if (si !== -1) filters.subjects.splice(si, 1);
    } else if (type === 'classes') {
      var ci = filters.classes.indexOf(value);
      if (ci !== -1) filters.classes.splice(ci, 1);
    } else if (type === 'chapters') {
      var chi = filters.chapters.indexOf(value);
      if (chi !== -1) filters.chapters.splice(chi, 1);
    } else if (type === 'type') {
      filters.examType = '';
    } else if (type === 'status') {
      filters.status = '';
    } else if (type === 'duration') {
      filters.duration = '';
    }
    render();
  };

  window.renderPage.exams.openFilterDrawer = function() {
    openFilterDrawer();
  };

  var skeletonHtml = '<div class="page-container"><div class="page-header"><div class="skeleton skeleton-text" style="width:20%;height:28px;margin-bottom:var(--space-2)"></div><div class="skeleton skeleton-text" style="width:40%;height:16px"></div></div><div class="flex items-center gap-3" style="margin-top:var(--space-4)"><div class="skeleton skeleton-text" style="width:200px;height:36px;border-radius:8px"></div><div class="skeleton skeleton-text" style="width:140px;height:36px;border-radius:8px"></div><div class="skeleton skeleton-text" style="width:100px;height:36px;border-radius:8px"></div></div><div class="grid-cols-auto-sm" style="display:grid;gap:var(--space-4);grid-template-columns:repeat(auto-fill,minmax(280px,1fr));margin-top:var(--space-6)">';
  for (var sk = 0; sk < 6; sk++) {
    skeletonHtml += '<div class="glass-card" style="padding:var(--space-5)"><div class="skeleton skeleton-text" style="width:50%;height:20px;margin-bottom:var(--space-3)"></div><div class="skeleton skeleton-text" style="width:80%;height:18px;margin-bottom:var(--space-2)"></div><div class="skeleton skeleton-text" style="width:40%;height:14px;margin-bottom:var(--space-2)"></div><div class="skeleton skeleton-text" style="width:60%;height:14px;margin-bottom:var(--space-3)"></div><div class="skeleton skeleton-text" style="width:100%;height:40px"></div></div>';
  }
  skeletonHtml += '</div></div>';
  mainContent.innerHTML = skeletonHtml;

  setTimeout(function() { render(); }, 300);
};

window.renderPage.exam = function(params) {
  var mainContent = document.getElementById('main-content');
  if (!window._examExamDelegated) {
    window._examExamDelegated = true;
    document.addEventListener('click', function(e) {
      var t = e.target.closest('[data-action^="examv:"]');
      if (!t) return;
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'SELECT') return;
      var p = t.getAttribute('data-action').split(':');
      var c = p[1], a = p[2], b = p[3];
      if (c === 'navigate' && a) { window.Router.navigate(a); }
      else if (c === 'submit') { window.renderPage.exam.confirmSubmit(); }
      else if (c === 'selectAnswer' && a && b) { window.renderPage.exam.selectAnswer(parseInt(a), b); }
      else if (c === 'goTo' && a) { window.renderPage.exam.goTo(parseInt(a)); }
      else if (c === 'start') { window.renderPage.exam.start(); }
    });
  }
  var store = window.Store;
  var api = window.API;
  var utils = window.Utils;
  var md = window.mockData;
  var examId = params.id;
  var exams = md.exams || [];
  var exam = null;
  for (var i = 0; i < exams.length; i++) {
    if (exams[i].id === examId) { exam = exams[i]; break; }
  }

  if (!exam) {
    mainContent.innerHTML = '<div class="page-container"><div class="flex flex-col items-center justify-center empty-state"><div class="empty-state-icon">\uD83D\uDD0D</div><h2 class="empty-state-title">Exam not found</h2><p class="empty-state-text">The exam you are looking for does not exist</p><button class="btn btn-primary" data-action="exam:navigate:/exams">Back to Exams</button></div></div>';
    return;
  }

  var sections = exam.sections || [];
  var totalQuestions = 0;
  for (var si = 0; si < sections.length; si++) {
    totalQuestions += sections[si].questions || 0;
  }

  var questions = [];
  var sectionMap = [];
  for (var s = 0; s < sections.length; s++) {
    var sec = sections[s];
    for (var qq = 0; qq < (sec.questions || 0); qq++) {
      var labels = ['A', 'B', 'C', 'D'];
      var opts = [];
      for (var oo = 0; oo < 4; oo++) {
        opts.push({ id: 'opt' + oo + '_' + s + '_' + qq, text: 'Option ' + labels[oo] });
      }
      questions.push({
        id: 'eq_' + s + '_' + qq,
        sectionIndex: s,
        sectionName: sec.name,
        text: sec.name + ' - Question ' + (qq + 1) + '?',
        options: opts,
        correctAnswer: 'opt' + Math.floor(Math.random() * 4) + '_' + s + '_' + qq,
        marks: Math.round(sec.marks / (sec.questions || 1))
      });
      sectionMap.push(s);
    }
  }

  var currentIndex = 0;
  var answers = {};
  var startTime = Date.now();
  var timeLeft = (exam.duration || 180) * 60;
  var timerInterval = null;
  var submitted = false;
  var started = false;
  var fullscreenRequested = false;

  function getTimeString(seconds) {
    var h = Math.floor(seconds / 3600);
    var m = Math.floor((seconds % 3600) / 60);
    var s = seconds % 60;
    return (h > 0 ? (h < 10 ? '0' : '') + h + ':' : '') + (m < 10 ? '0' : '') + m + ':' + (s < 10 ? '0' : '') + s;
  }

  function getSectionProgress(sectionIdx) {
    var count = 0;
    var total = 0;
    for (var i = 0; i < questions.length; i++) {
      if (questions[i].sectionIndex === sectionIdx) {
        total++;
        if (answers[i] !== undefined && answers[i] !== null && answers[i] !== '') count++;
      }
    }
    return { answered: count, total: total };
  }

  function renderQuestion() {
    if (submitted) return;
    var q = questions[currentIndex];
    var total = questions.length;
    var answeredCount = 0;
    for (var key in answers) {
      if (answers.hasOwnProperty(key) && answers[key] !== undefined && answers[key] !== null && answers[key] !== '') answeredCount++;
    }
    var selected = answers[currentIndex];

    var html = '<div class="page-container">';

    html += '<div class="flex items-center justify-between" style="margin-bottom:var(--space-4)">';
    html += '<div><h2 style="font-size:var(--text-lg);font-weight:600">' + utils.sanitizeHTML(exam.title) + '</h2><div class="text-xs text-secondary">' + q.sectionName + '</div></div>';
    html += '<div class="flex items-center gap-3">';
    html += '<span class="badge badge-red" id="exam-timer">\u23F1\uFE0F ' + getTimeString(timeLeft) + '</span>';
    html += '<span class="badge badge-purple">Q' + (currentIndex + 1) + '/' + total + '</span>';
    html += '<button class="btn btn-sm btn-danger" data-action="examv:submit">Submit</button>';
    html += '</div>';
    html += '</div>';

    html += '<div class="progress-bar" style="margin-bottom:var(--space-4);height:6px"><div class="progress-bar-fill" style="width:' + Math.round((answeredCount / total) * 100) + '%"></div></div>';

    html += '<div style="display:flex;gap:var(--space-6)">';
    html += '<div style="flex:1">';
    html += '<div class="quiz-question">';
    html += '<div class="quiz-question-number">Question ' + (currentIndex + 1) + ' \u00B7 ' + q.marks + ' marks</div>';
    html += '<div class="quiz-question-text">' + utils.sanitizeHTML(q.text) + '</div>';
    html += '<div class="quiz-options">';
    var labels = ['A', 'B', 'C', 'D'];
    var options = q.options || [];
    for (var o = 0; o < options.length; o++) {
      var opt = options[o];
      var isSelected = selected === opt.id;
      html += '<div class="quiz-option' + (isSelected ? ' selected' : '') + '" data-action="examv:selectAnswer:' + currentIndex + ':' + opt.id + '">';
      html += '<span class="quiz-option-letter">' + labels[o] + '</span>';
      html += '<span>' + utils.sanitizeHTML(opt.text) + '</span>';
      html += '</div>';
    }
    html += '</div>';
    html += '</div>';

    html += '<div class="flex items-center justify-between">';
    html += '<div class="flex items-center gap-2">';
html += '<button class="btn btn-secondary"' + (currentIndex === 0 ? ' disabled' : '') + ' data-action="examv:goTo:' + (currentIndex - 1) + '">\u25C0 Previous</button>';
    html += '<button class="btn btn-secondary"' + (currentIndex === total - 1 ? ' disabled' : '') + ' data-action="examv:goTo:' + (currentIndex + 1) + '">Next \u25B6</button>';

    html += '<button class="btn btn-danger" data-action="examv:submit">Submit Exam</button>';
    html += '</div>';
    html += '</div>';

    html += '<div class="glass-card" style="padding:var(--space-4);width:240px;flex-shrink:0;max-height:60vh;overflow-y:auto">';
    html += '<h4 style="font-size:var(--text-sm);font-weight:600;margin-bottom:var(--space-3)">Question Navigator</h4>';
    for (var ssec = 0; ssec < sections.length; ssec++) {
      var sec = sections[ssec];
      var secProg = getSectionProgress(ssec);
      html += '<div style="font-size:var(--text-xs);color:var(--text-secondary);margin-bottom:var(--space-2)">' + sec.name + ' (' + secProg.answered + '/' + secProg.total + ')</div>';
      html += '<div class="flex flex-wrap gap-1" style="margin-bottom:var(--space-3)">';
      for (var qidx = 0; qidx < questions.length; qidx++) {
        if (questions[qidx].sectionIndex !== ssec) continue;
        var qcls = 'page-btn';
        qcls += ' page-btn-sm';
        if (qidx === currentIndex) qcls += ' active';
        else if (answers[qidx] !== undefined && answers[qidx] !== null && answers[qidx] !== '') qcls += ' active';
        html += '<div class="' + qcls + '" style="width:32px;height:32px;font-size:var(--text-xs)" data-action="examv:goTo:' + qidx + '">' + (qidx + 1) + '</div>';
      }
      html += '</div>';
    }
    html += '<div style="font-size:var(--text-xs);color:var(--text-secondary);margin-top:var(--space-2)">Answered: ' + answeredCount + '/' + total + '</div>';
    html += '</div>';

    html += '</div>';
    html += '</div>';

    mainContent.innerHTML = html;
  }

  function showStartScreen() {
    var html = '<div class="page-container">';
    html += '<div class="glass-card" style="padding:var(--space-8);max-width:640px;margin:2rem auto">';
    html += '<div style="text-align:center;margin-bottom:var(--space-6)">';
    html += '<div style="font-size:3rem;margin-bottom:var(--space-3)">\uD83D\uDCCB</div>';
    html += '<h2 style="font-size:var(--text-2xl);font-weight:700">' + utils.sanitizeHTML(exam.title) + '</h2>';
    html += '<p class="text-secondary text-sm" style="margin-top:var(--space-2)">Class ' + exam.class + ' \u00B7 ' + exam.duration + ' minutes \u00B7 ' + exam.totalMarks + ' marks</p>';
    html += '</div>';

    html += '<div style="margin-bottom:var(--space-6)">';
    html += '<h4 style="font-weight:600;margin-bottom:var(--space-3)">Instructions</h4>';
    var instructions = exam.instructions || ['Read all questions carefully.', 'Each section has different weightage.', 'Negative marking applies for incorrect answers.'];
    html += '<ul style="list-style:disc;padding-left:var(--space-5);font-size:var(--text-sm);color:var(--text-secondary)">';
    for (var iins = 0; iins < instructions.length; iins++) {
      html += '<li style="margin-bottom:var(--space-2)">' + instructions[iins] + '</li>';
    }
    html += '</ul>';
    html += '</div>';

    html += '<div style="margin-bottom:var(--space-6)">';
    html += '<h4 style="font-weight:600;margin-bottom:var(--space-3)">Sections</h4>';
    for (var ssi = 0; ssi < sections.length; ssi++) {
      var sec = sections[ssi];
      html += '<div class="flex items-center justify-between" style="padding:var(--space-2) 0;border-bottom:1px solid var(--border-color);font-size:var(--text-sm)">';
      html += '<span>' + sec.name + '</span>';
      html += '<span class="text-secondary">' + sec.questions + ' questions \u00B7 ' + sec.marks + ' marks</span>';
      html += '</div>';
    }
    html += '</div>';

    html += '<button class="btn btn-primary btn-lg btn-block" data-action="examv:start">Start Exam</button>';
    html += '<div class="flex items-center justify-center gap-2" style="margin-top:var(--space-3)">';
    html += '<span class="text-xs text-secondary">\uD83D\uDD12 Full screen mode will be enabled</span>';
    html += '</div>';
    html += '</div>';
    html += '</div>';
    mainContent.innerHTML = html;
  }

  function showResults() {
    submitted = true;
    if (timerInterval) { clearInterval(timerInterval); timerInterval = null; }
    if (document.fullscreenElement) { document.exitFullscreen(); }

    var correct = 0;
    var total = questions.length;
    var marksObtained = 0;
    var totalMarks = 0;
    for (var i = 0; i < total; i++) {
      var qq = questions[i];
      totalMarks += qq.marks || 0;
      if (answers[i] && answers[i] === qq.correctAnswer) {
        correct++;
        marksObtained += qq.marks || 0;
      }
    }
    var percentage = Math.round((marksObtained / totalMarks) * 100);
    var timeTaken = Math.round((Date.now() - startTime) / 1000);
    var timeStr = getTimeString(timeTaken);
    var grade = utils.getGrade(percentage);

    var html = '<div class="page-container">';
    html += '<div class="page-header"><div><h1 class="page-title">Exam Results</h1><p class="page-subtitle">' + utils.sanitizeHTML(exam.title) + '</p></div><button class="btn btn-secondary" data-action="examv:navigate:/exams">Back to Exams</button></div>';

    html += '<div class="stats-grid">';
    html += '<div class="stat-card"><div class="stat-icon" style="background:rgba(59,130,246,0.15);color:var(--accent-blue)">\uD83C\uDFC6</div><div class="stat-value">' + marksObtained + '/' + totalMarks + '</div><div class="stat-label">Score</div></div>';
    html += '<div class="stat-card"><div class="stat-icon" style="background:rgba(16,185,129,0.15);color:var(--accent-green)">\uD83C\uDFAF</div><div class="stat-value">' + percentage + '%</div><div class="stat-label">Percentage</div></div>';
    html += '<div class="stat-card"><div class="stat-icon" style="background:rgba(139,92,246,0.15);color:var(--accent-purple)">\uD83D\uDCCA</div><div class="stat-value">' + grade + '</div><div class="stat-label">Grade</div></div>';
    html += '<div class="stat-card"><div class="stat-icon" style="background:rgba(245,158,11,0.15);color:var(--accent-yellow)">\u23F1\uFE0F</div><div class="stat-value">' + timeStr + '</div><div class="stat-label">Time Taken</div></div>';
    html += '</div>';

    html += '<div class="section-header"><h3 class="section-title">Subject-wise Analysis</h3></div>';
    html += '<div class="responsive-table">';
    html += '<table><thead><tr><th>Section</th><th>Marks</th><th>Correct</th><th>Total</th><th>Percentage</th></tr></thead><tbody>';
    for (var ssec = 0; ssec < sections.length; ssec++) {
      var sec = sections[ssec];
      var sc = 0;
      var st = 0;
      var sm = 0;
      for (var qw = 0; qw < questions.length; qw++) {
        if (questions[qw].sectionIndex === ssec) {
          st++;
          sm += questions[qw].marks || 0;
          if (answers[qw] && answers[qw] === questions[qw].correctAnswer) sc++;
        }
      }
      var sp = st > 0 ? Math.round((sc / st) * 100) : 0;
      html += '<tr><td>' + sec.name + '</td><td>' + sm + '</td><td>' + sc + '</td><td>' + st + '</td><td>' + sp + '%</td></tr>';
    }
    html += '</tbody></table>';
    html += '</div>';

    html += '<div style="text-align:center;margin-top:var(--space-8)">';
    html += '<button class="btn btn-primary" data-action="examv:navigate:/exam/' + examId + '">Try Again</button>';
    html += '</div>';
    html += '</div>';

    mainContent.innerHTML = html;
  }

  window.renderPage.exam.start = function() {
    started = true;
    fullscreenRequested = true;
    var el = document.documentElement;
    if (el.requestFullscreen) {
      el.requestFullscreen().catch(function() {});
    }
    renderQuestion();
    startTimer();
  };

  window.renderPage.exam.selectAnswer = function(index, optionId) {
    if (submitted) return;
    answers[index] = optionId;
    renderQuestion();
  };

  window.renderPage.exam.goTo = function(index) {
    if (submitted) return;
    if (index < 0 || index >= questions.length) return;
    currentIndex = index;
    renderQuestion();
  };

  window.renderPage.exam.confirmSubmit = function() {
    if (submitted) return;
    var overlay = document.createElement('div');
    overlay.className = 'modal-overlay';
    overlay.innerHTML = '<div class="modal" style="max-width:400px"><div class="modal-body" style="text-align:center"><h3 style="font-size:var(--text-lg);font-weight:600;margin-bottom:var(--space-4)">Submit Exam?</h3><p style="color:var(--text-secondary);margin-bottom:var(--space-6)">Are you sure you want to submit the exam? This action cannot be undone.</p><div class="flex items-center justify-center gap-3"><button class="btn btn-danger" id="confirm-exam-submit">Submit</button><button class="btn btn-secondary" id="cancel-exam-submit">Cancel</button></div></div></div>';
    document.body.appendChild(overlay);
    document.getElementById('confirm-exam-submit').addEventListener('click', function() {
      overlay.remove();
      showResults();
    });
    document.getElementById('cancel-exam-submit').addEventListener('click', function() { overlay.remove(); });
    overlay.addEventListener('click', function(e) { if (e.target === overlay) overlay.remove(); });
  };

  function startTimer() {
    timerInterval = setInterval(function() {
      timeLeft--;
      var timerEl = document.getElementById('exam-timer');
      if (timerEl) timerEl.innerHTML = '\u23F1\uFE0F ' + getTimeString(timeLeft);
      if (timeLeft <= 0) {
        clearInterval(timerInterval);
        if (!submitted) showResults();
      }
    }, 1000);
  }

  showStartScreen();
};
