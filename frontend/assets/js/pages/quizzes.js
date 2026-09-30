window.renderPage.quizzes = function(params) {
  var mainContent = document.getElementById('main-content');
  if (!window._quizDelegated) {
    window._quizDelegated = true;
    document.addEventListener('click', function(e) {
      var t = e.target.closest('[data-action^="quiz:"]');
      if (!t) return;
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'SELECT') return;
      var p = t.getAttribute('data-action').split(':');
      var c = p[1], a = p[2], b = p[3];
      if (c === 'navigate' && a) { window.Router.navigate(a); }
      else if (c === 'reload') { location.reload(); }
      else if (c === 'openFilter') { window.renderPage.quizzes.openFilterDrawer(); }
      else if (c === 'clearFilters') { window.renderPage.quizzes.clearFilters(); }
      else if (c === 'removeChip' && a) {
        if (b) { window.renderPage.quizzes.removeFilterChip(a, b); }
        else { window.renderPage.quizzes.removeFilterChip(a); }
      }
      else if (c === 'toggleBookmark' && a) { window.renderPage.quizzes.toggleBookmark(a); }
      else if (c === 'selectAnswer' && a && b) { window.renderPage.quiz.selectAnswer(parseInt(a), b); }
      else if (c === 'goTo' && a) { window.renderPage.quiz.goTo(parseInt(a)); }
      else if (c === 'submit') { window.renderPage.quiz.submit(); }
      else if (c === 'review') { window.renderPage.quiz.review(); }
    });
  }
  var store = window.Store;
  var utils = window.Utils;
  var md = window.mockData;
  var user = store.get('user') || {};
  var rawQuizzes = (md.quizzes || []).slice();
  var subjects = md.subjects || [];
  var chapterNames = md.chapterNames || {};
  var completedQuizzes = store.get('quizHistory') || [];
  var totalTaken = completedQuizzes.length;
  var avgScore = totalTaken > 0 ? Math.round(completedQuizzes.reduce(function(s, q) { return s + (q.percentage || 0); }, 0) / totalTaken) : 0;
  var totalXp = completedQuizzes.reduce(function(s, q) { return s + (q.earnedXp || 0); }, 0);
  var bookmarks = store.get('quizBookmarks') || [];

  var quizzes = [];
  for (var i = 0; i < rawQuizzes.length; i++) {
    var rq = rawQuizzes[i];
    var chList = chapterNames[rq.subjectId] || [];
    quizzes.push({
      id: rq.id,
      title: rq.title,
      subjectId: rq.subjectId,
      questions: rq.questions || [],
      timeLimit: rq.timeLimit,
      passingScore: rq.passingScore,
      attempts: rq.attempts || 0,
      difficulty: rq.difficulty || 'medium',
      quizType: 'mcq',
      totalMarks: (rq.questions || []).length,
      durationMin: rq.timeLimit || (rq.questions || []).length,
      chapterName: chList.length > 0 ? chList[i % chList.length] : '',
      rating: parseFloat((3 + Math.random() * 2).toFixed(1))
    });
  }

  var filters = {
    search: '',
    difficulty: [],
    subject: [],
    chapter: [],
    type: '',
    duration: '',
    marksMin: 0,
    marksMax: 999,
    status: ''
  };

  var sortBy = 'newest';

  var DIFFICULTY_MAP = { easy: 0, medium: 1, hard: 2 };

  function es(icon, title, msg) {
    return '<div class="empty-state" style="text-align:center;padding:40px 20px"><div class="empty-state-icon" style="font-size:3rem;margin-bottom:16px">' + icon + '</div><div class="empty-state-title" style="font-size:1.1rem;font-weight:600;color:var(--text-primary);margin-bottom:8px">' + title + '</div><div class="empty-state-text" style="font-size:0.875rem;color:var(--text-secondary)">' + msg + '</div></div>';
  }

  function getSubjectName(subjectId) {
    for (var i = 0; i < subjects.length; i++) {
      if (subjects[i].id === subjectId) return subjects[i].name;
    }
    return 'General';
  }

  function getSubjectIcon(subjectId) {
    for (var i = 0; i < subjects.length; i++) {
      if (subjects[i].id === subjectId) return subjects[i].icon || '📚';
    }
    return '📚';
  }

  function isBookmarked(quizId) {
    for (var i = 0; i < bookmarks.length; i++) {
      if (bookmarks[i] === quizId) return true;
    }
    return false;
  }

  function isCompleted(quizId) {
    for (var i = 0; i < completedQuizzes.length; i++) {
      if (completedQuizzes[i].quizId === quizId) return true;
    }
    return false;
  }

  function getCompletionInfo(quizId) {
    for (var i = 0; i < completedQuizzes.length; i++) {
      if (completedQuizzes[i].quizId === quizId) return completedQuizzes[i];
    }
    return null;
  }

  function getDifficultyBadge(difficulty) {
    if (difficulty === 'easy') return 'badge-green';
    if (difficulty === 'hard') return 'badge-red';
    return 'badge-yellow';
  }

  function getChaptersForSubject(subjectId) {
    var chList = chapterNames[subjectId] || [];
    var unique = [];
    for (var i = 0; i < chList.length; i++) {
      if (unique.indexOf(chList[i]) === -1) unique.push(chList[i]);
    }
    return unique;
  }

  function getFilteredQuizzes() {
    var result = quizzes.filter(function(q) {
      if (filters.search && q.title.toLowerCase().indexOf(filters.search.toLowerCase()) === -1) return false;
      if (filters.difficulty.length > 0 && filters.difficulty.indexOf(q.difficulty) === -1) return false;
      if (filters.subject.length > 0 && filters.subject.indexOf(q.subjectId) === -1) return false;
      if (filters.chapter.length > 0 && filters.chapter.indexOf(q.chapterName) === -1) return false;
      if (filters.type && q.quizType !== filters.type) return false;
      if (filters.duration) {
        if (filters.duration === 'under5' && q.durationMin >= 5) return false;
        if (filters.duration === '5to10' && (q.durationMin < 5 || q.durationMin > 10)) return false;
        if (filters.duration === '10to20' && (q.durationMin < 10 || q.durationMin > 20)) return false;
        if (filters.duration === '20plus' && q.durationMin <= 20) return false;
      }
      if (q.totalMarks < filters.marksMin || q.totalMarks > filters.marksMax) return false;
      if (filters.status === 'completed' && !isCompleted(q.id)) return false;
      if (filters.status === 'notattempted' && isCompleted(q.id)) return false;
      if (filters.status === 'bookmarks' && !isBookmarked(q.id)) return false;
      return true;
    });

    result.sort(function(a, b) {
      switch (sortBy) {
        case 'popular':
          return b.attempts - a.attempts;
        case 'rating':
          return b.rating - a.rating;
        case 'difficulty':
          return (DIFFICULTY_MAP[a.difficulty] || 1) - (DIFFICULTY_MAP[b.difficulty] || 1);
        case 'newest':
        default:
          return a.id.localeCompare(b.id);
      }
    });

    return result;
  }

  function getRecentlyAttempted() {
    var recent = [];
    var seen = {};
    for (var i = completedQuizzes.length - 1; i >= 0; i--) {
      var cq = completedQuizzes[i];
      if (!seen[cq.quizId]) {
        seen[cq.quizId] = true;
        var quizData = null;
        for (var j = 0; j < quizzes.length; j++) {
          if (quizzes[j].id === cq.quizId) { quizData = quizzes[j]; break; }
        }
        if (quizData) recent.push({ quiz: quizData, result: cq });
        if (recent.length >= 5) break;
      }
    }
    return recent;
  }

  function getActiveFilterCount() {
    var count = 0;
    if (filters.search) count++;
    if (filters.difficulty.length > 0) count++;
    if (filters.subject.length > 0) count++;
    if (filters.chapter.length > 0) count++;
    if (filters.type) count++;
    if (filters.duration) count++;
    if (filters.status) count++;
    if (filters.marksMin > 0 || filters.marksMax < 999) count++;
    return count;
  }

  function getUserSubjects() {
    var userClass = user.class || null;
    var userStream = user.stream || null;
    var classSubjects = [];
    for (var i = 0; i < subjects.length; i++) {
      if (subjects[i].class == userClass) {
        if (userStream && (userClass == 11 || userClass == 12)) {
          if (!subjects[i].stream || subjects[i].stream === userStream) classSubjects.push(subjects[i]);
        } else {
          classSubjects.push(subjects[i]);
        }
      }
    }
    if (classSubjects.length === 0) classSubjects = subjects.slice();
    return classSubjects;
  }

  function renderFilterChips() {
    var html = '';
    if (filters.search) {
      html += '<span class="filter-chip">Search: ' + utils.sanitizeHTML(filters.search) + '<button class="filter-chip-remove" data-action="quiz:removeChip:search" title="Remove">\u2715</button></span>';
    }
    if (filters.difficulty.length > 0) {
      for (var d = 0; d < filters.difficulty.length; d++) {
        html += '<span class="filter-chip">' + utils.sanitizeHTML(filters.difficulty[d]) + '<button class="filter-chip-remove" data-action="quiz:removeChip:difficulty:' + filters.difficulty[d] + '" title="Remove">\u2715</button></span>';
      }
    }
    if (filters.subject.length > 0) {
      for (var s = 0; s < filters.subject.length; s++) {
        html += '<span class="filter-chip">' + utils.sanitizeHTML(getSubjectName(filters.subject[s])) + '<button class="filter-chip-remove" data-action="quiz:removeChip:subject:' + filters.subject[s] + '" title="Remove">\u2715</button></span>';
      }
    }
    if (filters.chapter.length > 0) {
      for (var c = 0; c < filters.chapter.length; c++) {
        html += '<span class="filter-chip">' + utils.sanitizeHTML(filters.chapter[c]) + '<button class="filter-chip-remove" data-action="quiz:removeChip:chapter:' + utils.sanitizeHTML(filters.chapter[c]) + '" title="Remove">\u2715</button></span>';
      }
    }
    if (filters.type) {
      html += '<span class="filter-chip">' + filters.type + '<button class="filter-chip-remove" data-action="quiz:removeChip:type" title="Remove">\u2715</button></span>';
    }
    if (filters.duration) {
      var durLabels = { under5: '< 5 min', '5to10': '5-10 min', '10to20': '10-20 min', '20plus': '20+ min' };
      html += '<span class="filter-chip">' + (durLabels[filters.duration] || filters.duration) + '<button class="filter-chip-remove" data-action="quiz:removeChip:duration" title="Remove">\u2715</button></span>';
    }
    if (filters.marksMin > 0 || filters.marksMax < 999) {
      html += '<span class="filter-chip">Marks: ' + filters.marksMin + '-' + filters.marksMax + '<button class="filter-chip-remove" data-action="quiz:removeChip:marks" title="Remove">\u2715</button></span>';
    }
    if (filters.status) {
      html += '<span class="filter-chip">' + filters.status + '<button class="filter-chip-remove" data-action="quiz:removeChip:status" title="Remove">\u2715</button></span>';
    }
    return html;
  }

  function render() {
    try {
    var filtered = getFilteredQuizzes();
    var recentAttempts = getRecentlyAttempted();
    var activeFilterCount = getActiveFilterCount();
    var classSubjects = getUserSubjects();
    var chipHtml = renderFilterChips();

    var html = '<div class="page-container">';

    html += '<div class="page-header"><div><h1 class="page-title">Quizzes</h1><p class="page-subtitle">Test your knowledge with interactive quizzes</p></div></div>';

    html += '<div class="stats-grid">';
    html += '<div class="stat-card"><div class="stat-icon" style="background:rgba(59,130,246,0.15);color:var(--accent-blue)">\uD83D\uDCDD</div><div class="stat-value">' + totalTaken + '</div><div class="stat-label">Quizzes Taken</div></div>';
    html += '<div class="stat-card"><div class="stat-icon" style="background:rgba(16,185,129,0.15);color:var(--accent-green)">\uD83C\uDFAF</div><div class="stat-value">' + avgScore + '%</div><div class="stat-label">Avg Score</div></div>';
    html += '<div class="stat-card"><div class="stat-icon" style="background:rgba(139,92,246,0.15);color:var(--accent-purple)">\u2B50</div><div class="stat-value">' + utils.formatNumber(totalXp) + '</div><div class="stat-label">XP Earned</div></div>';
    html += '</div>';

    html += '<div class="section-header" style="margin-top:var(--space-4)"><h2 class="section-title">\uD83D\uDD04 Recently Attempted</h2></div>';
    if (recentAttempts.length > 0) {
      html += '<div style="display:flex;gap:var(--space-4);overflow-x:auto;padding-bottom:var(--space-4);margin-bottom:var(--space-6)">';
      for (var ra = 0; ra < recentAttempts.length; ra++) {
        var raItem = recentAttempts[ra];
        var rq = raItem.quiz;
        var rr = raItem.result;
        html += '<div class="glass-card" style="min-width:240px;flex-shrink:0;padding:var(--space-4);cursor:pointer" data-action="quiz:navigate:/quiz/' + rq.id + '">';
        html += '<div class="flex items-center justify-between" style="margin-bottom:var(--space-2)">';
        html += '<span class="badge ' + getDifficultyBadge(rq.difficulty) + '">' + (rq.difficulty || 'medium') + '</span>';
        html += '<span class="text-sm font-semibold" style="color:var(--accent-green)">' + rr.percentage + '%</span>';
        html += '</div>';
        html += '<div style="font-weight:600;font-size:var(--text-sm);margin-bottom:var(--space-2)">' + utils.sanitizeHTML(rq.title) + '</div>';
        html += '<div style="font-size:var(--text-xs);color:var(--text-tertiary)">Score: ' + rr.score + '/' + rr.total + ' \u00B7 ' + utils.formatRelativeTime(rr.date) + '</div>';
        html += '</div>';
      }
      html += '</div>';
    } else {
      html += '<div class="empty-state" style="text-align:center;padding:1rem;margin-bottom:var(--space-6)"><div class="empty-state-icon">\uD83D\uDCDD</div><div class="empty-state-title">No quizzes attempted yet</div><div class="empty-state-text">Take a quiz to see your results here.</div></div>';
    }

    html += '<div class="flex items-center gap-3" style="margin-bottom:var(--space-4);flex-wrap:wrap">';
    html += '<div style="position:relative;flex:1;min-width:180px;max-width:320px">';
    html += '<span style="position:absolute;left:12px;top:50%;transform:translateY(-50%);color:var(--text-tertiary);font-size:0.875rem;pointer-events:none">\uD83D\uDD0D</span>';
    html += '<input type="text" class="input-field" placeholder="Search quizzes..." value="' + utils.sanitizeHTML(filters.search) + '" style="padding-left:2.25rem;width:100%" onkeydown="if(event.key===\'Enter\'){window.renderPage.quizzes.setFilter(\'search\',this.value)}">';
    html += '</div>';
    html += '<select class="input-field" style="width:auto;min-width:150px;padding:0.5rem 2rem 0.5rem 0.75rem" onchange="window.renderPage.quizzes.setSort(this.value)">';
    html += '<option value="newest"' + (sortBy === 'newest' ? ' selected' : '') + '>Sort: Newest</option>';
    html += '<option value="popular"' + (sortBy === 'popular' ? ' selected' : '') + '>Sort: Most Popular</option>';
    html += '<option value="rating"' + (sortBy === 'rating' ? ' selected' : '') + '>Sort: Highest Rated</option>';
    html += '<option value="difficulty"' + (sortBy === 'difficulty' ? ' selected' : '') + '>Sort: Difficulty</option>';
    html += '</select>';
    html += '<button class="btn btn-secondary btn-sm" data-action="quiz:openFilter" style="position:relative">\uD83D\uDD0D Filters' + (activeFilterCount > 0 ? '<span class="filter-count-badge">' + activeFilterCount + '</span>' : '') + '</button>';
    if (activeFilterCount > 0) {
      html += '<button class="btn btn-ghost btn-sm" data-action="quiz:clearFilters" title="Clear filters">\u21BA</button>';
    }
    html += '</div>';

    if (chipHtml) {
      html += '<div class="filter-chips">' + chipHtml + '</div>';
    }

    html += '<div class="flex items-center justify-between" style="margin-bottom:var(--space-4)">';
    html += '<div class="text-sm text-secondary">Showing ' + filtered.length + ' quiz' + (filtered.length !== 1 ? 'zes' : '') + '</div>';
    html += '</div>';

    if (filtered.length === 0) {
      html += '<div class="glass-card" style="padding:var(--space-10);text-align:center">';
      html += '<div style="font-size:3rem;margin-bottom:var(--space-4)">\uD83D\uDCDD</div>';
      html += '<h3 style="font-size:var(--text-lg);font-weight:600;margin-bottom:var(--space-2)">No quizzes found</h3>';
      html += '<p class="text-sm text-secondary" style="margin-bottom:var(--space-4)">Try adjusting your filters</p>';
      html += '<button class="btn btn-primary" data-action="quiz:clearFilters">Clear Filters</button>';
      html += '</div>';
    } else {
      html += '<div class="grid-cols-auto-sm" style="display:grid;gap:var(--space-4)">';
      for (var q = 0; q < filtered.length; q++) {
        var quiz = filtered[q];
        var qCount = (quiz.questions || []).length;
        var isComp = isCompleted(quiz.id);
        var isBook = isBookmarked(quiz.id);
        var compInfo = getCompletionInfo(quiz.id);
        var diffClass = getDifficultyBadge(quiz.difficulty);
        var stars = '';
        var ratingVal = quiz.rating || 0;
        for (var si = 0; si < 5; si++) {
          stars += si < Math.round(ratingVal) ? '\u2B50' : '\u2606';
        }

        html += '<div class="glass-card" style="padding:var(--space-4);display:flex;flex-direction:column;position:relative">';

        html += '<button class="btn" style="position:absolute;top:var(--space-2);right:var(--space-2);width:32px;height:32px;padding:0;display:flex;align-items:center;justify-content:center;border-radius:var(--radius-full);background:transparent;border:none;cursor:pointer;z-index:2;font-size:var(--text-lg);color:var(--accent-yellow)" data-action="quiz:toggleBookmark:' + quiz.id + '" title="' + (isBook ? 'Remove bookmark' : 'Bookmark this quiz') + '">';
        html += isBook ? '\u2B50' : '\u2606';
        html += '</button>';

        html += '<div class="flex items-center justify-between" style="margin-bottom:var(--space-2)">';
        html += '<span class="badge badge-blue">Quiz</span>';
        html += '<span class="badge ' + diffClass + '">' + (quiz.difficulty || 'medium') + '</span>';
        html += '</div>';

        html += '<h3 style="font-size:var(--text-sm);font-weight:600;margin-bottom:var(--space-1);padding-right:var(--space-6);display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden">' + utils.sanitizeHTML(quiz.title) + '</h3>';
        html += '<div class="c-fs-xs c-text-tertiary c-mb-1">ID: QUIZ-' + quiz.id + '</div>';

        html += '<div class="text-xs text-secondary" style="margin-bottom:var(--space-1)">' + getSubjectIcon(quiz.subjectId) + ' ' + getSubjectName(quiz.subjectId) + '</div>';

        html += '<div class="text-xs" style="margin-bottom:var(--space-2);color:var(--text-tertiary)">' + stars + '</div>';

        html += '<div class="flex flex-wrap gap-2 text-xs text-secondary" style="margin-bottom:var(--space-3)">';
        html += '<span>\uD83D\uDCDD ' + qCount + ' Q</span>';
        html += '<span>\u23F1\uFE0F ' + quiz.durationMin + ' min</span>';
        html += '<span>\uD83D\uDCCA ' + quiz.totalMarks + ' marks</span>';
        html += '</div>';

        if (isComp && compInfo) {
          html += '<div class="text-xs" style="margin-bottom:var(--space-2);color:var(--accent-green)">\u2705 Completed \u00B7 ' + compInfo.percentage + '%</div>';
        } else {
          html += '<div class="text-xs" style="margin-bottom:var(--space-2);color:var(--text-tertiary)">\u23F3 Not Attempted</div>';
        }

        html += '<div style="margin-top:auto">';
        html += '<button class="btn btn-primary btn-sm btn-block" data-action="quiz:navigate:/quiz/' + quiz.id + '">' + (isComp ? 'Retake' : 'Start Quiz') + '</button>';
        html += '</div>';

        html += '</div>';
      }
      html += '</div>';
    }

    html += '</div>';

    mainContent.innerHTML = html;
    mainContent.style.opacity = '0';
    mainContent.style.transition = 'opacity 0.3s ease';
    setTimeout(function() { mainContent.style.opacity = '1'; }, 50);
    } catch (e) {
      mainContent.innerHTML = '<div class="page-container"><div class="empty-state"><div class="empty-state-icon">\u26A0\uFE0F</div><h2 class="empty-state-title">Something went wrong</h2><p class="empty-state-text">Try refreshing the page</p><button class="btn btn-primary" data-action="quiz:reload">Retry</button></div></div>';
    }
  }

  window.renderPage.quizzes.setFilter = function(key, value) {
    if (key === 'search') {
      filters.search = value;
    } else {
      filters[key] = value;
      if (key === 'subject') filters.chapter = [];
    }
    render();
  };

  window.renderPage.quizzes.setSort = function(value) {
    sortBy = value;
    render();
  };

  window.renderPage.quizzes.clearFilters = function() {
    filters = {
      search: '',
      difficulty: [],
      subject: [],
      chapter: [],
      type: '',
      duration: '',
      marksMin: 0,
      marksMax: 999,
      status: ''
    };
    render();
  };

  window.renderPage.quizzes.toggleBookmark = function(quizId) {
    var idx = -1;
    for (var i = 0; i < bookmarks.length; i++) {
      if (bookmarks[i] === quizId) { idx = i; break; }
    }
    if (idx !== -1) {
      bookmarks.splice(idx, 1);
    } else {
      bookmarks.push(quizId);
    }
    store.set('quizBookmarks', bookmarks);
    render();
  };

  window.renderPage.quizzes.openFilterDrawer = function() {
    var userSubjects = getUserSubjects();
    var allChapters = [];
    var chapterSet = {};
    if (filters.subject.length > 0) {
      for (var si = 0; si < filters.subject.length; si++) {
        var chs = getChaptersForSubject(filters.subject[si]);
        for (var ci = 0; ci < chs.length; ci++) {
          if (!chapterSet[chs[ci]]) { chapterSet[chs[ci]] = true; allChapters.push(chs[ci]); }
        }
      }
    } else {
      for (var si2 = 0; si2 < userSubjects.length; si2++) {
        var chs2 = getChaptersForSubject(userSubjects[si2].id);
        for (var ci2 = 0; ci2 < chs2.length; ci2++) {
          if (!chapterSet[chs2[ci2]]) { chapterSet[chs2[ci2]] = true; allChapters.push(chs2[ci2]); }
        }
      }
    }

    window.FilterDrawer.openDrawer({
      title: 'Filter Quizzes',
      filters: [
        {
          id: 'search',
          label: 'Search',
          type: 'search',
          value: filters.search || '',
          placeholder: 'Search quizzes...'
        },
        {
          id: 'difficulty',
          label: 'Difficulty',
          type: 'checkbox',
          options: [
            { value: 'easy', label: 'Easy' },
            { value: 'medium', label: 'Medium' },
            { value: 'hard', label: 'Hard' }
          ],
          value: filters.difficulty.slice()
        },
        {
          id: 'subject',
          label: 'Subject',
          type: 'checkbox',
          options: userSubjects.map(function(s) { return { value: s.id, label: s.name }; }),
          value: filters.subject.slice()
        },
        {
          id: 'chapter',
          label: 'Chapter',
          type: 'checkbox',
          options: allChapters.map(function(ch) { return { value: ch, label: ch }; }),
          value: filters.chapter.slice()
        },
        {
          id: 'type',
          label: 'Type',
          type: 'radio',
          options: [
            { value: '', label: 'All' },
            { value: 'mcq', label: 'MCQ' },
            { value: 'truefalse', label: 'True/False' },
            { value: 'mixed', label: 'Mixed' }
          ],
          value: filters.type || ''
        },
        {
          id: 'duration',
          label: 'Duration',
          type: 'radio',
          options: [
            { value: '', label: 'Any' },
            { value: 'under5', label: '< 5 min' },
            { value: '5to10', label: '5-15 min' },
            { value: '20plus', label: '> 15 min' }
          ],
          value: filters.duration || ''
        },
        {
          id: 'marks',
          label: 'Total Marks',
          type: 'range',
          min: 0,
          max: 100,
          minLabel: 'Min',
          maxLabel: 'Max',
          minPlaceholder: '0',
          maxPlaceholder: '100',
          value: { min: filters.marksMin > 0 ? String(filters.marksMin) : '', max: filters.marksMax < 999 ? String(filters.marksMax) : '' }
        },
        {
          id: 'status',
          label: 'Status',
          type: 'radio',
          options: [
            { value: '', label: 'All' },
            { value: 'completed', label: 'Attempted' },
            { value: 'notattempted', label: 'Not Attempted' },
            { value: 'completed_passed', label: 'Passed' },
            { value: 'completed_failed', label: 'Failed' }
          ],
          value: filters.status || ''
        }
      ],
      onApply: function(allValues) {
        filters.search = allValues.search || '';
        filters.difficulty = allValues.difficulty || [];
        filters.subject = allValues.subject || [];
        filters.chapter = allValues.chapter || [];
        filters.type = allValues.type || '';
        filters.duration = allValues.duration || '';
        if (allValues.marks) {
          filters.marksMin = parseInt(allValues.marks.min) || 0;
          filters.marksMax = parseInt(allValues.marks.max) || 999;
        }
        filters.status = allValues.status || '';
        render();
      },
      onReset: function() {
        window.renderPage.quizzes.clearFilters();
        window.FilterDrawer.closeDrawer();
      }
    });
  };

  window.renderPage.quizzes.removeFilterChip = function(key, value) {
    if (key === 'search') {
      filters.search = '';
    } else if (key === 'difficulty' && value) {
      var idx = filters.difficulty.indexOf(value);
      if (idx !== -1) filters.difficulty.splice(idx, 1);
    } else if (key === 'subject' && value) {
      var idx2 = filters.subject.indexOf(value);
      if (idx2 !== -1) filters.subject.splice(idx2, 1);
    } else if (key === 'chapter' && value) {
      var idx3 = filters.chapter.indexOf(value);
      if (idx3 !== -1) filters.chapter.splice(idx3, 1);
    } else if (key === 'type') {
      filters.type = '';
    } else if (key === 'duration') {
      filters.duration = '';
    } else if (key === 'marks') {
      filters.marksMin = 0;
      filters.marksMax = 999;
    } else if (key === 'status') {
      filters.status = '';
    }
    render();
  };

  var skeletonHtml = '<div class="page-container">' +
    '<div class="page-header"><div><div class="skeleton skeleton-text skeleton-text-lg" style="width:200px"></div><div class="skeleton skeleton-text" style="width:300px;margin-top:8px"></div></div></div>' +
    '<div class="stats-grid">' +
      '<div class="stat-card"><div class="skeleton skeleton-circle" style="margin-bottom:var(--space-4)"></div><div class="skeleton skeleton-text" style="width:60px"></div><div class="skeleton skeleton-text skeleton-text-sm" style="margin-top:4px"></div></div>' +
      '<div class="stat-card"><div class="skeleton skeleton-circle" style="margin-bottom:var(--space-4)"></div><div class="skeleton skeleton-text" style="width:60px"></div><div class="skeleton skeleton-text skeleton-text-sm" style="margin-top:4px"></div></div>' +
      '<div class="stat-card"><div class="skeleton skeleton-circle" style="margin-bottom:var(--space-4)"></div><div class="skeleton skeleton-text" style="width:60px"></div><div class="skeleton skeleton-text skeleton-text-sm" style="margin-top:4px"></div></div>' +
    '</div>' +
    '<div style="display:flex;gap:var(--space-4);margin-bottom:var(--space-4)">' +
      '<div class="skeleton skeleton-text" style="width:240px;height:40px;border-radius:var(--radius-md)"></div>' +
      '<div class="skeleton skeleton-text" style="width:150px;height:40px;border-radius:var(--radius-md)"></div>' +
      '<div class="skeleton skeleton-text" style="width:120px;height:40px;border-radius:var(--radius-md)"></div>' +
    '</div>' +
    '<div class="grid-cols-auto-sm" style="display:grid;gap:var(--space-4)">' +
      '<div class="glass-card" style="padding:var(--space-4);height:200px"><div class="skeleton skeleton-text" style="width:60%"></div><div class="skeleton skeleton-text" style="width:80%;margin-top:8px"></div><div class="skeleton skeleton-text skeleton-text-sm" style="width:40%;margin-top:8px"></div></div>' +
      '<div class="glass-card" style="padding:var(--space-4);height:200px"><div class="skeleton skeleton-text" style="width:60%"></div><div class="skeleton skeleton-text" style="width:80%;margin-top:8px"></div><div class="skeleton skeleton-text skeleton-text-sm" style="width:40%;margin-top:8px"></div></div>' +
      '<div class="glass-card" style="padding:var(--space-4);height:200px"><div class="skeleton skeleton-text" style="width:60%"></div><div class="skeleton skeleton-text" style="width:80%;margin-top:8px"></div><div class="skeleton skeleton-text skeleton-text-sm" style="width:40%;margin-top:8px"></div></div>' +
    '</div>' +
  '</div>';

  mainContent.innerHTML = skeletonHtml;
  setTimeout(render, 200);
};

window.renderPage.quiz = function(params) {
  var mainContent = document.getElementById('main-content');
  var store = window.Store;
  var api = window.API;
  var utils = window.Utils;
  var md = window.mockData;
  var quizId = params.id;
  var quizzes = md.quizzes || [];
  var quiz = null;
  for (var i = 0; i < quizzes.length; i++) {
    if (quizzes[i].id === quizId) { quiz = quizzes[i]; break; }
  }

  if (!quiz) {
    mainContent.innerHTML = '<div class="page-container"><div class="flex flex-col items-center justify-center empty-state"><div class="empty-state-icon">\uD83D\uDD0D</div><h2 class="empty-state-title">Quiz not found</h2><p class="empty-state-text">The quiz you are looking for does not exist</p><button class="btn btn-primary" data-action="quiz:navigate:/quizzes">Back to Quizzes</button></div></div>';
    return;
  }

  var questions = quiz.questions || [];
  var currentIndex = 0;
  var answers = {};
  var startTime = Date.now();
  var timerInterval = null;
  var timeLimit = (quiz.timeLimit || questions.length * 2) * 60;
  var timeLeft = timeLimit;
  var submitted = false;

  function getTimeString(seconds) {
    var m = Math.floor(seconds / 60);
    var s = seconds % 60;
    return (m < 10 ? '0' : '') + m + ':' + (s < 10 ? '0' : '') + s;
  }

  function render() {
    if (submitted) return;
    var total = questions.length;
    var answeredCount = 0;
    for (var key in answers) {
      if (answers.hasOwnProperty(key) && answers[key] !== undefined && answers[key] !== null && answers[key] !== '') {
        answeredCount++;
      }
    }
    var isLast = currentIndex === total - 1;
    var q = questions[currentIndex];
    var selected = answers[currentIndex];

    var html = '<div class="page-container">';

    html += '<div class="flex items-center justify-between" style="margin-bottom:var(--space-6)">';
    html += '<div><h2 class="text-xl font-700">' + utils.sanitizeHTML(quiz.title) + '</h2></div>';
    html += '<div class="flex items-center gap-4">';
    html += '<span class="badge badge-blue" id="quiz-timer">\u23F1\uFE0F ' + getTimeString(timeLeft) + '</span>';
    html += '<span class="badge badge-purple">Q' + (currentIndex + 1) + '/' + total + '</span>';
    html += '</div>';
    html += '</div>';

    html += '<div class="progress-bar" style="margin-bottom:var(--space-6)"><div class="progress-bar-fill" style="width:' + Math.round((answeredCount / total) * 100) + '%"></div></div>';

    html += '<div class="quiz-question">';
    html += '<div class="quiz-question-number">Question ' + (currentIndex + 1) + ' of ' + total + '</div>';
    html += '<div class="quiz-question-text">' + utils.sanitizeHTML(q.text) + '</div>';
    html += '<div class="quiz-options" id="quiz-options">';
    var labels = ['A', 'B', 'C', 'D'];
    var options = q.options || [];
    for (var o = 0; o < options.length; o++) {
      var opt = options[o];
      var isSelected = selected === opt.id;
      html += '<div class="quiz-option' + (isSelected ? ' selected' : '') + '" data-opt-id="' + opt.id + '" data-action="quiz:selectAnswer:' + currentIndex + ':' + opt.id + '">';
      html += '<span class="quiz-option-letter">' + labels[o] + '</span>';
      html += '<span>' + utils.sanitizeHTML(opt.text) + '</span>';
      html += '</div>';
    }
    html += '</div>';
    html += '</div>';

    html += '<div class="flex items-center justify-between" style="margin-bottom:var(--space-6)">';
    html += '<div class="flex items-center gap-2">';
    html += '<button class="btn btn-secondary"' + (currentIndex === 0 ? ' disabled' : '') + ' data-action="quiz:goTo:' + (currentIndex - 1) + '">\u25C0 Previous</button>';
    html += '<button class="btn btn-secondary"' + (isLast ? ' disabled' : '') + ' data-action="quiz:goTo:' + (currentIndex + 1) + '">Next \u25B6</button>';
    html += '</div>';
    if (answeredCount === total && !submitted) {
      html += '<button class="btn btn-primary btn-lg" data-action="quiz:submit">Submit Quiz</button>';
    }
    html += '</div>';

    html += '<div class="flex flex-wrap items-center gap-2">';
    for (var j = 0; j < total; j++) {
      var qClass = 'page-btn';
      if (j === currentIndex) qClass += ' active';
      else if (answers[j] !== undefined && answers[j] !== null && answers[j] !== '') qClass += ' active';
      html += '<div class="' + qClass + '" data-action="quiz:goTo:' + j + '">' + (j + 1) + '</div>';
    }
    html += '</div>';

    html += '</div>';
    mainContent.innerHTML = html;
  }

  function showResults(result) {
    submitted = true;
    if (timerInterval) { clearInterval(timerInterval); timerInterval = null; }
    var timeTaken = Math.round((Date.now() - startTime) / 1000);
    var timeStr = getTimeString(timeTaken);
    var passed = result.percentage >= ((quiz.passingScore || 0) / questions.length * 100);

    var html = '<div class="page-container">';
    html += '<div class="glass-card" style="padding:var(--space-8);text-align:center;max-width:640px;margin:0 auto">';
    html += '<div style="font-size:4rem;margin-bottom:var(--space-4)">' + (passed ? '\uD83C\uDF89' : '\uD83D\uDE14') + '</div>';
    html += '<h2 style="font-size:var(--text-2xl);font-weight:700;margin-bottom:var(--space-2)">' + (passed ? 'Congratulations!' : 'Keep Trying!') + '</h2>';
    html += '<p style="color:var(--text-secondary);margin-bottom:var(--space-6)">' + (passed ? 'You passed the quiz!' : 'You didn\'t pass this time. Review and try again.') + '</p>';

    html += '<div class="stats-grid" style="max-width:480px;margin:0 auto var(--space-6)">';
    html += '<div class="stat-card"><div class="stat-value" style="color:var(--accent-blue)">' + result.score + '/' + result.total + '</div><div class="stat-label">Score</div></div>';
    html += '<div class="stat-card"><div class="stat-value" style="color:var(--accent-green)">' + result.percentage + '%</div><div class="stat-label">Percentage</div></div>';
    html += '<div class="stat-card"><div class="stat-value" style="color:var(--accent-purple)">' + timeStr + '</div><div class="stat-label">Time Taken</div></div>';
    html += '<div class="stat-card"><div class="stat-value" style="color:var(--accent-yellow)">+' + (result.earnedXp || 0) + ' XP</div><div class="stat-label">XP Earned</div></div>';
    html += '</div>';

    html += '<div class="flex items-center justify-center gap-3 flex-wrap">';
    html += '<button class="btn btn-primary" data-action="quiz:review">Review Answers</button>';
    html += '<button class="btn btn-secondary" data-action="quiz:navigate:/quiz/' + quizId + '">Try Again</button>';
    html += '<button class="btn btn-ghost" data-action="quiz:navigate:/quizzes">Back to Quizzes</button>';
    html += '</div>';
    html += '</div>';
    html += '</div>';

    mainContent.innerHTML = html;

    var history = store.get('quizHistory') || [];
    history.push({
      quizId: quizId,
      score: result.score,
      total: result.total,
      percentage: result.percentage,
      earnedXp: result.earnedXp || 0,
      earnedCoins: result.earnedCoins || 0,
      timeTaken: timeTaken,
      date: new Date().toISOString()
    });
    store.set('quizHistory', history);
  }

  window.renderPage.quiz.selectAnswer = function(index, optionId) {
    if (submitted) return;
    answers[index] = optionId;
    render();
  };

  window.renderPage.quiz.goTo = function(index) {
    if (submitted) return;
    if (index < 0 || index >= questions.length) return;
    currentIndex = index;
    render();
  };

  window.renderPage.quiz.submit = function() {
    if (submitted) return;
    var overlay = document.createElement('div');
    overlay.className = 'modal-overlay';
    overlay.innerHTML = '<div class="modal" style="max-width:400px"><div class="modal-body" style="text-align:center"><h3 style="font-size:var(--text-lg);font-weight:600;margin-bottom:var(--space-4)">Submit Quiz?</h3><p style="color:var(--text-secondary);margin-bottom:var(--space-6)">Are you sure you want to submit your answers?</p><div class="flex items-center justify-center gap-3"><button class="btn btn-primary" id="confirm-submit">Submit</button><button class="btn btn-secondary" id="cancel-submit">Cancel</button></div></div></div>';
    document.body.appendChild(overlay);
    document.getElementById('confirm-submit').addEventListener('click', function() {
      overlay.remove();
      var answerArray = [];
      for (var i = 0; i < questions.length; i++) {
        answerArray.push(answers[i] || null);
      }
      api.submitQuiz(quizId, answerArray).then(function(res) {
        if (res.success) {
          showResults(res.data);
        }
      });
    });
    document.getElementById('cancel-submit').addEventListener('click', function() { overlay.remove(); });
    overlay.addEventListener('click', function(e) { if (e.target === overlay) overlay.remove(); });
  };

  window.renderPage.quiz.review = function() {
    var html = '<div class="page-container">';
    html += '<div class="page-header"><div><h1 class="page-title">Review Answers</h1><p class="page-subtitle">' + utils.sanitizeHTML(quiz.title) + '</p></div><button class="btn btn-ghost" data-action="quiz:navigate:/quiz/' + quizId + '">Try Again</button></div>';

    for (var i = 0; i < questions.length; i++) {
      var q = questions[i];
      var selected = answers[i];
      var correct = q.correctAnswer;
      var isCorrect = selected === correct;
      var labels = ['A', 'B', 'C', 'D'];
      html += '<div class="quiz-question">';
      html += '<div class="quiz-question-number">Question ' + (i + 1) + (isCorrect ? ' \u2705' : ' \u274C') + '</div>';
      html += '<div class="quiz-question-text">' + utils.sanitizeHTML(q.text) + '</div>';
      html += '<div class="quiz-options">';
      var options = q.options || [];
      for (var o = 0; o < options.length; o++) {
        var opt = options[o];
        var cls = 'quiz-option';
        if (opt.id === correct) cls += ' correct';
        if (opt.id === selected && !isCorrect) cls += ' wrong';
        if (opt.id === selected && isCorrect) cls += ' selected';
        html += '<div class="' + cls + '"><span class="quiz-option-letter">' + labels[o] + '</span><span>' + utils.sanitizeHTML(opt.text) + '</span></div>';
      }
      html += '</div>';
      html += '</div>';
    }

    html += '<div class="flex items-center justify-center gap-3" style="margin-top:var(--space-6)">';
    html += '<button class="btn btn-primary" data-action="quiz:navigate:/quiz/' + quizId + '">Try Again</button>';
    html += '<button class="btn btn-secondary" data-action="quiz:navigate:/quizzes">Back to Quizzes</button>';
    html += '</div>';
    html += '</div>';

    mainContent.innerHTML = html;
  };

  function startTimer() {
    timerInterval = setInterval(function() {
      timeLeft--;
      var timerEl = document.getElementById('quiz-timer');
      if (timerEl) timerEl.innerHTML = '\u23F1\uFE0F ' + getTimeString(timeLeft);
      if (timeLeft <= 0) {
        clearInterval(timerInterval);
        if (!submitted) {
          var answerArray = [];
          for (var i = 0; i < questions.length; i++) {
            answerArray.push(answers[i] || null);
          }
          api.submitQuiz(quizId, answerArray).then(function(res) {
            if (res.success) showResults(res.data);
          });
        }
      }
    }, 1000);
  }

  render();
  startTimer();
};
