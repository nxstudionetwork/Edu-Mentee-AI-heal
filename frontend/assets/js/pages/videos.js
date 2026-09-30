window.renderPage = window.renderPage || {};

(function() {
  var store = window.Store;
  var utils = window.Utils;
  var md = window.mockData;
  var PAGE_SIZE = 24;
  var drawerStylesInjected = false;
  var sectionStylesInjected = false;
  var currentSpeed = 1;
  var captionsVisible = false;
  var speeds = [0.5, 0.75, 1, 1.25, 1.5, 2];

  document.addEventListener('click', function(e) {
    var t = e.target.closest('[data-action^="video:"]');
    if (!t) return;
    if (t.getAttribute('data-stop') !== null) { e.stopPropagation(); }
    var p = t.getAttribute('data-action').split(':');
    var c = p[1], a = p[2], b = p[3];
    if (c === 'play' && a) { window.renderPage.openVideoDrawer(a); }
    if (c === 'filter') { window.renderPage.openFilterDrawer(); }
    if (c === 'bookmark' && a) { window.renderPage.toggleVideoBookmark(a); }
    if (c === 'drawerBookmark' && a) { window.renderPage.toggleDrawerBookmark(a); }
    if (c === 'related' && a) { window.renderPage.closeVideoDrawer(); setTimeout(function(){ window.renderPage.openVideoDrawer(a); }, 100); }
    if (c === 'removeChip' && a) { window.renderPage.removeFilterChip(a, b); }
    if (c === 'sort' && a) { window.renderPage.updateFilter('sort', a); }
    if (c === 'view' && a) { window.renderPage.updateFilter('view', a); }
    if (c === 'category' && a) { window.renderPage.setCategory(a); }
    if (c === 'scrollTo' && a) { window.renderPage.scrollTo(a); }
    if (c === 'close') { window.renderPage.closeVideoDrawer(); }
    if (c === 'cc') { window.renderPage.toggleDrawerCaptions(); }
    if (c === 'pip') { window.renderPage.toggleDrawerPip(); }
    if (c === 'speed' && a) { window.renderPage.setDrawerSpeed(parseFloat(a)); }
    if (c === 'share' && a) { window.renderPage.shareVideo(a); }
    if (c === 'download' && a) { window.renderPage.downloadVideo(a); }
    if (c === 'page' && a) { window.renderPage.goToVideoPage(parseInt(a, 10)); }
    if (c === 'playlist') { window.renderPage.togglePlaylist(a); }
    if (c === 'reload') { location.reload(); }
  });

  document.addEventListener('keydown', function(e) {
    if (e.key === 'Enter' && e.target.classList.contains('v-search-input')) {
      window.renderPage.updateFilter('search', e.target.value);
      e.preventDefault();
    }
  });

  document.addEventListener('input', function(e) {
    var t = e.target.closest('[data-action^="video:saveNote:"]');
    if (t) {
      var parts = t.getAttribute('data-action').split(':');
      window.renderPage.saveDrawerNote(parts[2], t.value);
    }
    var searchInput = e.target.closest('.v-search-input');
    if (searchInput) {
      clearTimeout(window._searchDebounce);
      window._searchDebounce = setTimeout(function() {
        window.renderPage.updateFilter('search', searchInput.value);
      }, 400);
    }
  });

  function showToastMsg(msg, icon) {
    var t = document.createElement('div');
    t.className = 'c-fixed c-z-1000 c-flex-center c-flex-gap-2 c-bg-card c-text-primary c-shadow-lg c-p-3 c-radius-md';
    t.style.bottom = '2rem';
    t.style.left = '50%';
    t.style.transform = 'translateX(-50%)';
    t.style.animation = 'fadeInUp 0.3s ease';
    t.innerHTML = (icon || '') + msg;
    document.body.appendChild(t);
    setTimeout(function() { t.remove(); }, 2500);
  }

  var filterState = {
    search: '',
    subjects: [],
    duration: '',
    difficulty: '',
    languages: [],
    category: '',
    sort: 'newest',
    view: 'grid',
    page: 1
  };

  var mockSubtitleLines = [
    'Welcome to this educational video lesson.',
    'Today we will explore the key concepts.',
    'Let us begin with the fundamentals.',
    'Pay close attention to these important points.',
    'Now we move on to a practical example.',
    'This concept is frequently asked in exams.',
    'Let us summarize what we have learned so far.',
    'Practice these problems on your own.',
    'In the next section we will go deeper.',
    'Thank you for watching, see you in the next lesson.'
  ];

  function getFilteredVideos() {
    var user = store.get('user');
    var userClass = user ? user.class : null;
    var userStream = user ? user.stream : null;
    if (!userClass) return (md.videos || []).slice();
    var all = md.videos || [];
    var subjectIds = [];
    var subjects = md.subjects || [];
    for (var i = 0; i < subjects.length; i++) {
      var s = subjects[i];
      if (s.class == userClass) {
        if (!userStream || !s.stream || s.stream === userStream) {
          subjectIds.push(s.id);
        }
      }
    }
    return all.filter(function(v) {
      if (!v.subjectId) return true;
      return subjectIds.indexOf(v.subjectId) !== -1;
    });
  }

  function getUserSubjects() {
    var user = store.get('user');
    var userClass = user ? user.class : null;
    var userStream = user ? user.stream : null;
    if (!userClass) return md.subjects || [];
    var subjects = md.subjects || [];
    var result = [];
    for (var i = 0; i < subjects.length; i++) {
      var s = subjects[i];
      if (s.class == userClass) {
        if (!userStream || !s.stream || s.stream === userStream) {
          result.push(s);
        }
      }
    }
    return result;
  }

  function getBookmarks() {
    return store.get('videoBookmarks') || [];
  }

  function isBookmarked(id) {
    var bms = getBookmarks();
    for (var i = 0; i < bms.length; i++) {
      if (bms[i] === id) return true;
    }
    return false;
  }

  function toggleBookmark(id) {
    var bms = getBookmarks();
    var idx = -1;
    for (var i = 0; i < bms.length; i++) {
      if (bms[i] === id) { idx = i; break; }
    }
    if (idx > -1) {
      bms.splice(idx, 1);
    } else {
      bms.push(id);
    }
    store.set('videoBookmarks', bms);
  }

  function getSubjectName(id) {
    if (!id) return '';
    var subjects = md.subjects || [];
    for (var i = 0; i < subjects.length; i++) {
      if (subjects[i].id === id) return subjects[i].name;
    }
    return '';
  }

  function getSubjectIcon(id) {
    if (!id) return '\uD83C\uDFAC';
    var subjects = md.subjects || [];
    for (var i = 0; i < subjects.length; i++) {
      if (subjects[i].id === id) return subjects[i].icon || '\uD83C\uDFAC';
    }
    return '\uD83C\uDFAC';
  }

  function getSubjectClass(id) {
    if (!id) return null;
    var subjects = md.subjects || [];
    for (var i = 0; i < subjects.length; i++) {
      if (subjects[i].id === id) return subjects[i].class;
    }
    return null;
  }

  function getSubjectColor(id) {
    if (!id) return '#3b82f6';
    var subjects = md.subjects || [];
    for (var i = 0; i < subjects.length; i++) {
      if (subjects[i].id === id) return subjects[i].color || '#3b82f6';
    }
    return '#3b82f6';
  }

  function applyFilters(videos) {
    var result = videos.slice();
    if (filterState.search) {
      var q = filterState.search.toLowerCase();
      result = result.filter(function(v) {
        return v.title.toLowerCase().indexOf(q) !== -1 || (v.instructor || '').toLowerCase().indexOf(q) !== -1 || (v.channelName || '').toLowerCase().indexOf(q) !== -1;
      });
    }
    if (filterState.subjects && filterState.subjects.length > 0) {
      result = result.filter(function(v) {
        return filterState.subjects.indexOf(v.subjectId) !== -1;
      });
    }
    if (filterState.duration) {
      result = result.filter(function(v) {
        var d = v.duration || 0;
        if (filterState.duration === 'short') return d < 10;
        if (filterState.duration === 'medium') return d >= 10 && d <= 30;
        if (filterState.duration === 'long') return d > 30;
        return true;
      });
    }
    if (filterState.difficulty) {
      result = result.filter(function(v) {
        var lvl = (v.level || '').toLowerCase();
        return lvl === filterState.difficulty.toLowerCase();
      });
    }
    if (filterState.languages && filterState.languages.length > 0) {
      result = result.filter(function(v) {
        return filterState.languages.indexOf(v.language) !== -1;
      });
    }
    if (filterState.category) {
      result = result.filter(function(v) {
        return v.subjectId === filterState.category;
      });
    }
    return result;
  }

  function sortVideos(videos, sortBy) {
    var sorted = videos.slice();
    if (sortBy === 'newest') {
      sorted.sort(function() { return 0.5 - Math.random(); });
    } else if (sortBy === 'popular' || sortBy === 'popularity') {
      sorted.sort(function(a, b) { return (b.views || 0) - (a.views || 0); });
    } else if (sortBy === 'duration') {
      sorted.sort(function(a, b) { return (a.duration || 0) - (b.duration || 0); });
    } else if (sortBy === 'rating') {
      sorted.sort(function(a, b) { return parseFloat(b.rating || 0) - parseFloat(a.rating || 0); });
    }
    return sorted;
  }

  function buildUrl(paramsObj) {
    var parts = [];
    if (paramsObj.search) parts.push('search=' + encodeURIComponent(paramsObj.search));
    if (paramsObj.sort && paramsObj.sort !== 'newest') parts.push('sort=' + encodeURIComponent(paramsObj.sort));
    if (paramsObj.page && paramsObj.page > 1) parts.push('page=' + paramsObj.page);
    if (paramsObj.view && paramsObj.view !== 'grid') parts.push('view=' + encodeURIComponent(paramsObj.view));
    if (paramsObj.duration) parts.push('duration=' + encodeURIComponent(paramsObj.duration));
    if (paramsObj.difficulty) parts.push('difficulty=' + encodeURIComponent(paramsObj.difficulty));
    if (paramsObj.languages) parts.push('languages=' + encodeURIComponent(paramsObj.languages));
    if (paramsObj.category) parts.push('category=' + encodeURIComponent(paramsObj.category));
    return '#/videos' + (parts.length > 0 ? '?' + parts.join('&') : '');
  }

  function getActiveFilterCount() {
    var count = 0;
    if (filterState.search) count++;
    if (filterState.subjects && filterState.subjects.length > 0) count += filterState.subjects.length;
    if (filterState.duration) count++;
    if (filterState.difficulty) count++;
    if (filterState.languages && filterState.languages.length > 0) count += filterState.languages.length;
    if (filterState.category) count++;
    return count;
  }

  function renderFilterChips() {
    var html = '';
    if (filterState.search) {
      html += '<span class="filter-chip" data-action="video:filter"><span class="filter-chip-label">Search: &quot;' + utils.sanitizeHTML(filterState.search) + '&quot;</span><button class="filter-chip-remove" data-action="video:removeChip:search" data-stop title="Remove">\u2715</button></span>';
    }
    if (filterState.subjects && filterState.subjects.length > 0) {
      for (var i = 0; i < filterState.subjects.length; i++) {
        var sid = filterState.subjects[i];
        var sname = getSubjectName(sid) || sid;
        html += '<span class="filter-chip" data-action="video:filter"><span class="filter-chip-label">' + utils.sanitizeHTML(sname) + '</span><button class="filter-chip-remove" data-action="video:removeChip:subjects:' + sid.replace(/'/g, "%27") + '" data-stop title="Remove">\u2715</button></span>';
      }
    }
    if (filterState.duration) {
      var durLabels = { 'short': '< 10 min', 'medium': '10-30 min', 'long': '> 30 min' };
      html += '<span class="filter-chip" data-action="video:filter"><span class="filter-chip-label">Duration: ' + (durLabels[filterState.duration] || filterState.duration) + '</span><button class="filter-chip-remove" data-action="video:removeChip:duration" data-stop title="Remove">\u2715</button></span>';
    }
    if (filterState.difficulty) {
      html += '<span class="filter-chip" data-action="video:filter"><span class="filter-chip-label">Difficulty: ' + filterState.difficulty + '</span><button class="filter-chip-remove" data-action="video:removeChip:difficulty" data-stop title="Remove">\u2715</button></span>';
    }
    if (filterState.languages && filterState.languages.length > 0) {
      for (var li = 0; li < filterState.languages.length; li++) {
        var langVal = filterState.languages[li];
        html += '<span class="filter-chip" data-action="video:filter"><span class="filter-chip-label">' + utils.sanitizeHTML(langVal) + '</span><button class="filter-chip-remove" data-action="video:removeChip:languages:' + langVal.replace(/'/g, "%27") + '" data-stop title="Remove">\u2715</button></span>';
      }
    }
    if (filterState.category) {
      var catName = getSubjectName(filterState.category) || filterState.category;
      html += '<span class="filter-chip" data-action="video:filter"><span class="filter-chip-label">' + utils.sanitizeHTML(catName) + '</span><button class="filter-chip-remove" data-action="video:removeChip:category" data-stop title="Remove">\u2715</button></span>';
    }
    if (html) {
      html = '<div class="filter-chips">' + html + '</div>';
    }
    return html;
  }

  function openFilterDrawer() {
    var userSubjects = getUserSubjects();
    window.FilterDrawer.openDrawer({
      title: 'Filter Videos',
      filters: [
        {
          id: 'search',
          label: 'Search',
          type: 'search',
          value: filterState.search || '',
          placeholder: 'Search videos...'
        },
        {
          id: 'subject',
          label: 'Subject',
          type: 'checkbox',
          options: userSubjects.map(function(s) { return { value: s.id, label: s.name, icon: s.icon }; }),
          value: filterState.subjects && filterState.subjects.length > 0 ? filterState.subjects.slice() : []
        },
        {
          id: 'duration',
          label: 'Duration',
          type: 'radio',
          options: [
            { value: '', label: 'Any' },
            { value: 'short', label: '< 10 min' },
            { value: 'medium', label: '10-30 min' },
            { value: 'long', label: '> 30 min' }
          ],
          value: filterState.duration || ''
        },
        {
          id: 'difficulty',
          label: 'Difficulty',
          type: 'radio',
          options: [
            { value: '', label: 'All' },
            { value: 'Beginner', label: 'Beginner' },
            { value: 'Intermediate', label: 'Intermediate' },
            { value: 'Advanced', label: 'Advanced' }
          ],
          value: filterState.difficulty || ''
        },
        {
          id: 'language',
          label: 'Language',
          type: 'checkbox',
          options: ['English', 'Hindi', 'Hinglish'].map(function(l) { return { value: l, label: l }; }),
          value: filterState.languages && filterState.languages.length > 0 ? filterState.languages.slice() : []
        }
      ],
      onApply: function(allValues) {
        if (allValues.search !== undefined) filterState.search = allValues.search || '';
        if (allValues.subject !== undefined) filterState.subjects = allValues.subject || [];
        if (allValues.duration !== undefined) filterState.duration = allValues.duration || '';
        if (allValues.difficulty !== undefined) filterState.difficulty = allValues.difficulty || '';
        if (allValues.language !== undefined) filterState.languages = allValues.language || [];
        filterState.page = 1;
        window.renderPage.videos(window.Router.getParams());
      },
      onReset: function() {
        filterState.search = '';
        filterState.subjects = [];
        filterState.duration = '';
        filterState.difficulty = '';
        filterState.languages = [];
        filterState.page = 1;
        window.renderPage.videos(window.Router.getParams());
      }
    });
  }

  function injectSectionStyles() {
    if (sectionStylesInjected) return;
    sectionStylesInjected = true;
    var style = document.createElement('style');
    style.textContent = '\
.videos-scroll-row { display:flex; gap:1rem; overflow-x:auto; padding-bottom:0.75rem; scroll-snap-type:x mandatory; -webkit-overflow-scrolling:touch; }\
.videos-scroll-row::-webkit-scrollbar { height:4px; }\
.videos-scroll-row::-webkit-scrollbar-thumb { background:var(--border-color); border-radius:4px; }\
.videos-scroll-row::-webkit-scrollbar-track { background:transparent; }\
.videos-scroll-row .video-card-wrapper { flex:0 0 auto; scroll-snap-align:start; }\
.category-chips { display:flex; flex-wrap:wrap; gap:0.5rem; margin-bottom:1.5rem; }\
.category-chip { padding:0.4rem 1rem; border-radius:999px; font-size:0.8125rem; font-weight:500; cursor:pointer; transition:all 0.15s; background:var(--bg-glass); border:1px solid var(--border-color); color:var(--text-secondary); }\
.category-chip:hover { background:var(--bg-glass-hover); color:var(--text-primary); border-color:var(--border-hover); }\
.category-chip.active { background:var(--gradient-primary); color:#fff; border-color:transparent; }\
.top-bar { display:flex; align-items:center; gap:0.75rem; flex-wrap:wrap; padding:1.25rem 0; }\
.search-bar-wrap { position:relative; flex:1; min-width:200px; max-width:480px; }\
.search-bar-wrap input { width:100%; padding:0.625rem 1rem 0.625rem 2.5rem; background:var(--bg-tertiary); border:1px solid var(--border-color); border-radius:var(--radius-full); color:var(--text-primary); font-size:0.875rem; outline:none; transition:border-color 0.2s; }\
.search-bar-wrap input:focus { border-color:var(--accent-blue); }\
.search-bar-wrap input::placeholder { color:var(--text-tertiary); }\
.search-bar-icon { position:absolute; left:14px; top:50%; transform:translateY(-50%); color:var(--text-tertiary); font-size:0.875rem; pointer-events:none; }\
.sort-btns { display:flex; gap:0.25rem; background:var(--bg-glass-strong); border-radius:var(--radius-full); padding:3px; }\
.sort-btn { padding:0.35rem 0.85rem; font-size:0.75rem; font-weight:500; border-radius:999px; cursor:pointer; transition:all 0.15s; color:var(--text-tertiary); background:transparent; border:none; white-space:nowrap; }\
.sort-btn:hover { color:var(--text-secondary); }\
.sort-btn.active { background:var(--gradient-primary); color:#fff; }\
.view-toggle { display:flex; border:1px solid var(--border-color); border-radius:var(--radius-md); overflow:hidden; flex-shrink:0; }\
.view-toggle button { padding:0.45rem 0.65rem; background:transparent; border:none; color:var(--text-tertiary); cursor:pointer; font-size:1rem; transition:all 0.15s; line-height:1; }\
.view-toggle button:hover { background:var(--bg-glass); }\
.view-toggle button.active { color:var(--accent-blue); background:var(--bg-glass-hover); }\
.filter-btn-wrap { position:relative; flex-shrink:0; }\
.filter-btn-wrap .filter-count-badge { position:absolute; top:-6px; right:-6px; min-width:18px; height:18px; border-radius:999px; background:var(--accent-blue); color:#fff; font-size:0.65rem; font-weight:600; display:flex; align-items:center; justify-content:center; padding:0 5px; }\
.playlist-card { flex:0 0 auto; width:240px; border-radius:var(--radius-md); overflow:hidden; cursor:pointer; transition:all 0.2s; background:var(--bg-glass); border:1px solid var(--border-color); }\
.playlist-card:hover { transform:translateY(-2px); border-color:var(--border-hover); box-shadow:var(--shadow-md); }\
.playlist-card-thumb { height:120px; display:flex; align-items:center; justify-content:center; position:relative; overflow:hidden; }\
.playlist-card-thumb .playlist-count { position:absolute; bottom:8px; right:8px; background:rgba(0,0,0,0.65); color:#fff; font-size:0.7rem; padding:2px 8px; border-radius:999px; }\
.playlist-card-body { padding:0.75rem; }\
.playlist-card-body h4 { font-size:0.8125rem; font-weight:600; margin-bottom:0.25rem; display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden; }\
.playlist-card-body p { font-size:0.7rem; color:var(--text-tertiary); }\
.playlist-expanded { margin-bottom:1rem; }\
.section-label { display:flex; align-items:center; justify-content:space-between; margin-bottom:0.75rem; }\
.section-label h3 { font-size:1.1rem; font-weight:700; }\
.section-label a { font-size:0.8125rem; color:var(--accent-blue); cursor:pointer; }\
.section-label a:hover { text-decoration:underline; }\
.row-section { margin-bottom:1.75rem; }\
.scroll-gradient-mask { position:relative; }\
.scroll-gradient-mask::after { content:""; position:absolute; right:0; top:0; bottom:0; width:48px; background:linear-gradient(to right,transparent,var(--bg-primary)); pointer-events:none; }\
.content-fade-in { opacity:0; transition:opacity 0.3s ease; }\
.content-fade-in.show { opacity:1; }\
@media (max-width:480px) { .video-grid { grid-template-columns:1fr !important; } .v-search-input { font-size:16px; } .top-bar .sort-btns { order:10; width:100%; } .view-toggle { display:none; } }\
';
    document.head.appendChild(style);
  }

  function es(icon, title, msg) {
    return '<div class="empty-state c-text-center c-p-6"><div class="empty-state-icon" style="font-size:3rem;margin-bottom:var(--space-3)">' + icon + '</div><div class="empty-state-title c-fs-lg c-fw-semibold c-text-primary c-mb-2">' + title + '</div><div class="empty-state-text c-fs-sm c-text-secondary">' + msg + '</div></div>';
  }

  function renderEmptyState(icon, title, message) {
    return '<div class="empty-state c-text-center c-p-3"><div class="empty-state-icon" style="font-size:2rem;margin-bottom:var(--space-2)">' + icon + '</div><div class="empty-state-title c-fw-semibold c-mb-1">' + title + '</div><div class="empty-state-text c-fs-sm c-text-secondary">' + message + '</div></div>';
  }

  function renderSkeleton() {
    var html = '<div class="animate-fadeInUp">';
    html += '<div class="search-bar-wrap" style="margin-bottom:1.5rem;max-width:100%"><div class="skeleton" style="height:42px;border-radius:999px"></div></div>';
    html += '<div style="display:flex;gap:0.5rem;margin-bottom:1.5rem">';
    for (var ci = 0; ci < 5; ci++) {
      html += '<div class="skeleton" style="height:32px;width:80px;border-radius:999px"></div>';
    }
    html += '</div>';
    html += '<div class="grid grid-cols-auto gap-4">';
    for (var i = 0; i < 8; i++) {
      html += '<div class="glass-card overflow-hidden"><div class="skeleton" style="height:150px;border-radius:0"></div><div class="p-3"><div class="skeleton" style="width:85%;height:14px;margin-bottom:8px;border-radius:4px"></div><div class="skeleton" style="width:60%;height:10px;margin-bottom:6px;border-radius:4px"></div><div class="skeleton" style="width:40%;height:10px;border-radius:4px"></div></div></div>';
    }
    html += '</div></div>';
    return html;
  }

  function renderVideoCard(video, progress, viewMode) {
    var isBm = isBookmarked(video.id);
    var subjName = getSubjectName(video.subjectId);
    var subjColor = getSubjectColor(video.subjectId);
    var grad = utils.getGradient(parseInt((video.subjectId || 's0').replace('s', ''), 10) || 0);
    var durStr = utils.formatDuration(video.duration || 0);

    if (viewMode === 'list') {
      return '<div class="glass-card overflow-hidden mb-3 c-pointer" data-action="video:play:' + video.id + '"><div class="flex"><div class="c-w-40" style="height:112px;flex-shrink:0;background:' + grad + ';display:flex;align-items:center;justify-content:center;position:relative"><div style="width:40px;height:40px;border-radius:50%;background:rgba(255,255,255,0.2);display:flex;align-items:center;justify-content:center;font-size:1.25rem;color:white">\u25B6</div><span class="badge" style="position:absolute;bottom:6px;right:6px;background:rgba(0,0,0,0.65);color:white;font-size:10px;padding:1px 6px">' + durStr + '</span></div><div class="flex-1 p-4"><div class="flex items-start justify-between"><div class="flex-1 min-w-0 mr-4"><h4 class="text-sm font-semibold mb-1">' + utils.sanitizeHTML(video.title) + '</h4><div class="c-fs-xs c-text-tertiary c-mb-1">ID: VID-' + video.id + '</div><div class="flex items-center gap-2 text-xs text-tertiary mb-2 flex-wrap"><span>' + utils.sanitizeHTML(video.instructor || '') + '</span><span>\xb7</span><span>' + utils.sanitizeHTML(subjName) + '</span><span>\xb7</span><span>' + utils.formatNumber(video.views || 0) + ' views</span><span>\xb7</span><span>' + (video.rating || '0') + ' \u2605</span></div>' + (progress > 0 && progress < 100 ? '<div class="progress-bar mt-2" style="height:3px"><div class="progress-bar-fill progress-fill-blue" style="width:' + progress + '%"></div></div><div class="text-xs text-tertiary mt-1">' + progress + '% watched</div>' : '') + '</div><div class="c-fs-lg c-pointer c-text-tertiary c-flex-shrink-0" data-action="video:bookmark:' + video.id + '" data-stop>' + (isBm ? '\u2B50' : '\u2606') + '</div></div></div></div></div>';
    }

    return '<div class="glass-card overflow-hidden c-pointer" data-action="video:play:' + video.id + '">\
  <div style="height:150px;background:' + grad + ';display:flex;align-items:center;justify-content:center;position:relative">\
    <div class="c-pointer" style="width:56px;height:56px;border-radius:50%;background:rgba(255,255,255,0.2);display:flex;align-items:center;justify-content:center;font-size:1.5rem;color:white;backdrop-filter:blur(4px);transition:all 0.2s">\u25B6</div>\
    <span class="badge" style="position:absolute;bottom:10px;right:10px;background:rgba(0,0,0,0.65);color:white;font-size:11px;padding:2px 8px">' + durStr + '</span>\
    <div class="c-fs-lg c-z-2 c-text-tertiary" style="position:absolute;top:8px;left:10px" data-action="video:bookmark:' + video.id + '" data-stop>' + (isBm ? '\u2B50' : '\u2606') + '</div>\
    ' + (progress > 0 && progress < 100 ? '<div style="position:absolute;bottom:0;left:0;right:0;height:3px;background:rgba(0,0,0,0.3)"><div style="height:100%;width:' + progress + '%;background:var(--gradient-primary);transition:width 0.3s"></div></div><div style="position:absolute;bottom:16px;left:10px;background:rgba(0,0,0,0.6);color:#fff;font-size:0.65rem;padding:1px 6px;border-radius:4px">' + progress + '%</div>' : '') + '\
  </div>\
  <div class="p-3">\
    <h4 class="text-sm font-semibold mb-1" style="display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden;min-height:2.5em">' + utils.sanitizeHTML(video.title) + '</h4>\
    <div class="c-fs-xs c-text-tertiary c-mb-1">ID: VID-' + video.id + '</div>\
    <div class="flex items-center gap-2 text-xs text-tertiary mb-1">\
      <span>' + utils.sanitizeHTML(video.instructor || '') + '</span>\
      <span style="font-size:0.65rem;color:var(--text-muted)">\u2022 ' + utils.formatNumber(video.views || 0) + '</span>\
    </div>\
    <div class="flex items-center justify-between text-xs text-tertiary">\
      <span style="color:var(--accent-yellow)">\u2605 ' + (video.rating || '0') + '</span>\
      <span style="font-size:0.65rem;color:var(--text-muted)">' + utils.sanitizeHTML(video.channelName || '') + '</span>\
    </div>\
  </div>\
</div>';
  }

  function renderMiniCard(video) {
    var grad = utils.getGradient(parseInt((video.subjectId || 's0').replace('s', ''), 10) || 0);
    return '<div class="video-card-wrapper" style="width:220px" data-action="video:play:' + video.id + '">\
      <div class="glass-card overflow-hidden c-pointer">\
        <div style="height:124px;background:' + grad + ';display:flex;align-items:center;justify-content:center;position:relative">\
          <div style="width:36px;height:36px;border-radius:50%;background:rgba(255,255,255,0.2);display:flex;align-items:center;justify-content:center;font-size:1rem;color:white">\u25B6</div>\
          <span style="position:absolute;bottom:6px;right:6px;background:rgba(0,0,0,0.65);color:white;font-size:9px;padding:1px 5px;border-radius:4px">' + utils.formatDuration(video.duration || 0) + '</span>\
        </div>\
        <div class="p-2">\
          <h4 style="font-size:0.75rem;font-weight:600;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden;margin-bottom:2px">' + utils.sanitizeHTML(video.title) + '</h4>\
          <div style="font-size:0.65rem;color:var(--text-tertiary)">' + utils.sanitizeHTML(video.instructor || '') + ' \u2022 ' + utils.formatNumber(video.views || 0) + '</div>\
        </div>\
      </div>\
    </div>';
  }

  function renderPlaylistCard(playlist, index) {
    var grad = utils.getGradient(index);
    return '<div class="playlist-card" data-action="video:playlist:' + playlist.id + '">\
      <div class="playlist-card-thumb" style="background:' + grad + '">\
        <div style="font-size:2rem;color:rgba(255,255,255,0.3)">\uD83D\uDCC1</div>\
        <span class="playlist-count">' + playlist.count + ' videos</span>\
      </div>\
      <div class="playlist-card-body">\
        <h4>' + utils.sanitizeHTML(playlist.name) + '</h4>\
        <p>' + utils.sanitizeHTML(playlist.subject || '') + '</p>\
      </div>\
    </div>';
  }

  function renderPagination(currentPage, totalPages) {
    if (totalPages <= 1) return '';
    var html = '<div class="pagination">';
    html += '<button class="page-btn"' + (currentPage <= 1 ? ' disabled' : ' data-action="video:page:' + (currentPage - 1) + '"') + '>\u2039</button>';
    var start = Math.max(1, currentPage - 2);
    var end = Math.min(totalPages, currentPage + 2);
    if (start > 1) {
      html += '<button class="page-btn" data-action="video:page:1">1</button>';
      if (start > 2) html += '<span class="page-btn c-pointer-none">...</span>';
    }
    for (var pi = start; pi <= end; pi++) {
      html += '<button class="page-btn' + (pi === currentPage ? ' active' : '') + '" data-action="video:page:' + pi + '">' + pi + '</button>';
    }
    if (end < totalPages) {
      if (end < totalPages - 1) html += '<span class="page-btn c-pointer-none">...</span>';
      html += '<button class="page-btn" data-action="video:page:' + totalPages + '">' + totalPages + '</button>';
    }
    html += '<button class="page-btn"' + (currentPage >= totalPages ? ' disabled' : ' data-action="video:page:' + (currentPage + 1) + '"') + '>\u203A</button>';
    html += '</div>';
    return html;
  }

  function generateMockPlaylists(videos) {
    var playlists = [];
    var seen = {};
    for (var i = 0; i < videos.length; i++) {
      var v = videos[i];
      var key = v.subjectId || 'gen';
      if (!seen[key]) {
        seen[key] = { id: 'pl_' + key, name: getSubjectName(key) || 'General', subject: getSubjectName(key) || '', count: 0, videos: [] };
        playlists.push(seen[key]);
      }
      if (seen[key].videos.length < 10) {
        seen[key].videos.push(v);
        seen[key].count++;
      }
    }
    return playlists;
  }

  function renderPageContent(mainContent, params) {
    injectSectionStyles();

    var allVideos = getFilteredVideos();
    var userSubjects = getUserSubjects();

    if (params.search !== undefined) filterState.search = params.search || '';
    if (params.subjectId) filterState.subjects = [params.subjectId];
    if (params.duration) filterState.duration = params.duration;
    if (params.difficulty) filterState.difficulty = params.difficulty;
    if (params.languages) filterState.languages = params.languages.split(',');
    if (params.category) filterState.category = params.category;
    if (params.sort) filterState.sort = params.sort;
    if (params.view) filterState.view = params.view;
    var currentPage = params.page ? parseInt(params.page, 10) : filterState.page;
    if (isNaN(currentPage) || currentPage < 1) currentPage = 1;
    filterState.page = currentPage;

    var sortBy = filterState.sort;
    var viewMode = filterState.view;
    var perPage = PAGE_SIZE;
    var progressData = store.get('videoProgress') || {};
    var bookmarkIds = getBookmarks();
    var historyData = store.get('videoHistory') || [];

    var filteredVideos = applyFilters(allVideos);
    filteredVideos = sortVideos(filteredVideos, sortBy);

    var totalVideos = filteredVideos.length;
    var totalPages = Math.max(1, Math.ceil(totalVideos / perPage));
    if (currentPage > totalPages) currentPage = totalPages;
    filterState.page = currentPage;
    var pageStart = (currentPage - 1) * perPage;
    var pageVideos = filteredVideos.slice(pageStart, pageStart + perPage);

    var continueVideos = [];
    for (var vi = 0; vi < allVideos.length; vi++) {
      var p = progressData[allVideos[vi].id];
      if (p && p > 0 && p < 100) {
        continueVideos.push(allVideos[vi]);
      }
    }

    var bookmarkedVideos = [];
    for (var bi = 0; bi < allVideos.length; bi++) {
      if (bookmarkIds.indexOf(allVideos[bi].id) !== -1) {
        bookmarkedVideos.push(allVideos[bi]);
      }
    }

    var recentlyWatchedVideos = [];
    var historyMap = {};
    for (var hi = 0; hi < historyData.length; hi++) {
      historyMap[historyData[hi].id] = true;
    }
    for (var ri = 0; ri < allVideos.length; ri++) {
      if (historyMap[allVideos[ri].id]) {
        recentlyWatchedVideos.push(allVideos[ri]);
      }
    }
    var historyOrder = {};
    for (var hi2 = 0; hi2 < historyData.length; hi2++) {
      historyOrder[historyData[hi2].id] = hi2;
    }
    recentlyWatchedVideos.sort(function(a, b) {
      return (historyOrder[a.id] || 999) - (historyOrder[b.id] || 999);
    });

    var recommendedVideos = allVideos.slice().sort(function() { return 0.5 - Math.random(); }).slice(0, 20);

    var playlists = generateMockPlaylists(allVideos);

    var filterCount = getActiveFilterCount();

    var categorySubjects = [{ id: '', name: 'All' }].concat(userSubjects);

    var expandedPlaylist = store.get('expandedPlaylist') || null;

    var html = '<div class="animate-fadeInUp">';

    html += '<div class="top-bar">';
    html += '<div class="search-bar-wrap"><span class="search-bar-icon">\uD83D\uDD0D</span><input type="text" class="v-search-input" placeholder="Search videos..." value="' + utils.sanitizeHTML(filterState.search || '') + '"></div>';
    html += '<div class="filter-btn-wrap"><button class="btn btn-secondary btn-sm" data-action="video:filter">\uD83D\uDD0D Filters' + (filterCount > 0 ? '<span class="filter-count-badge">' + filterCount + '</span>' : '') + '</button></div>';
    html += '<div class="view-toggle">';
    html += '<button class="' + (viewMode === 'grid' ? 'active' : '') + '" data-action="video:view:grid" title="Grid View">\u229E</button>';
    html += '<button class="' + (viewMode === 'list' ? 'active' : '') + '" data-action="video:view:list" title="List View">\u2630</button>';
    html += '</div>';
    html += '</div>';

    if (filterCount > 0) {
      html += renderFilterChips();
    }

    html += '<div class="category-chips">';
    for (var cci = 0; cci < categorySubjects.length; cci++) {
      var cs = categorySubjects[cci];
      var isActive = filterState.category === cs.id;
      html += '<span class="category-chip' + (isActive ? ' active' : '') + '" data-action="video:category:' + cs.id + '">' + (cs.icon ? cs.icon + ' ' : '') + utils.sanitizeHTML(cs.name) + '</span>';
    }
    html += '</div>';

    if (!filterState.category && !filterState.search && filterState.subjects.length === 0) {
      html += '<div class="row-section"><div class="section-label"><h3>\u25B6 Continue Watching</h3></div>';
      if (continueVideos.length > 0) {
        html += '<div class="videos-scroll-row">';
        for (var ci = 0; ci < Math.min(continueVideos.length, 15); ci++) {
          html += renderMiniCard(continueVideos[ci]);
        }
        html += '</div>';
      } else {
        html += renderEmptyState('\u25B6', 'No videos in progress', 'Start watching videos to see them here.');
      }
      html += '</div>';
    }

    if (recommendedVideos.length > 0 && !filterState.category && !filterState.search) {
      html += '<div class="row-section"><div class="section-label"><h3>\uD83D\uDCA1 Recommended for You</h3></div><div class="videos-scroll-row">';
      for (var rvi = 0; rvi < Math.min(recommendedVideos.length, 15); rvi++) {
        html += renderMiniCard(recommendedVideos[rvi]);
      }
      html += '</div></div>';
    }

    html += '<div class="row-section"><div class="section-label"><h3>\uD83D\uDCC1 Playlists</h3></div>';
    if (playlists.length === 0) {
      html += es('\uD83D\uDCC1', 'No playlists available', 'Playlists will appear here once videos are added.');
    } else {
      html += '<div class="videos-scroll-row">';
      for (var pli = 0; pli < playlists.length; pli++) {
        html += renderPlaylistCard(playlists[pli], pli);
      }
      html += '</div>';
    }
    html += '</div>';

    if (!filterState.category && !filterState.search) {
      html += '<div class="row-section"><div class="section-label"><h3>\uD83D\uDD50 Recently Watched</h3></div>';
      if (recentlyWatchedVideos.length > 0) {
        html += '<div class="videos-scroll-row">';
        for (var rwvi = 0; rwvi < Math.min(recentlyWatchedVideos.length, 15); rwvi++) {
          html += renderMiniCard(recentlyWatchedVideos[rwvi]);
        }
        html += '</div>';
      } else {
        html += renderEmptyState('\uD83D\uDD50', 'No recently watched', 'Videos you watch will appear here.');
      }
      html += '</div>';
    }

    html += '<div id="all-videos" class="row-section"><div class="section-label"><h3>\uD83C\uDFAC All Videos</h3><span class="text-sm text-tertiary">' + totalVideos + ' video' + (totalVideos !== 1 ? 's' : '') + '</span></div>';

    if (pageVideos.length === 0) {
      if (filterState.search) {
        html += '<div class="empty-state"><div class="empty-state-icon">\uD83D\uDD0D</div><h3 class="empty-state-title">No results found</h3><p class="empty-state-text">No videos match &quot;' + utils.sanitizeHTML(filterState.search) + '&quot;. Try a different search.</p></div>';
      } else {
        html += '<div class="empty-state"><div class="empty-state-icon">\uD83C\uDFAC</div><h3 class="empty-state-title">No Videos Found</h3><p class="empty-state-text">Try adjusting your search or filters.</p></div>';
      }
    } else {
      html += '<div class="' + (viewMode === 'list' ? 'flex flex-col gap-3' : 'grid grid-cols-auto video-grid gap-4') + '">';
      for (var ai = 0; ai < pageVideos.length; ai++) {
        html += renderVideoCard(pageVideos[ai], progressData[pageVideos[ai].id] || 0, viewMode);
      }
      html += '</div>';
    }

    html += renderPagination(currentPage, totalPages);
    html += '</div>';

    html += '</div>';
    mainContent.innerHTML = html;
    mainContent.className = 'content-fade-in';
    setTimeout(function() { mainContent.classList.add('show'); }, 50);
  }

  function injectDrawerStyles() {
    if (drawerStylesInjected) return;
    drawerStylesInjected = true;
    var style = document.createElement('style');
    style.textContent = '\
.video-fullscreen-overlay { position:fixed; inset:0; background:#000; z-index:10000; display:flex; flex-direction:column; animation:fadeIn 0.2s ease; }\
.video-fullscreen-header { display:flex; align-items:center; justify-content:space-between; padding:0.75rem 1.5rem; background:rgba(0,0,0,0.8); flex-shrink:0; }\
.video-fullscreen-header h2 { font-size:1rem; font-weight:600; color:#fff; white-space:nowrap; overflow:hidden; text-overflow:ellipsis; margin-right:1rem; }\
.video-fullscreen-header .fs-close { color:#fff; background:transparent; border:none; font-size:1.5rem; cursor:pointer; padding:0.25rem 0.5rem; }\
.video-fullscreen-body { flex:1; display:flex; overflow:hidden; }\
.video-fullscreen-main { flex:1; display:flex; flex-direction:column; overflow-y:auto; }\
.video-fs-player-wrap { width:100%; aspect-ratio:16/9; background:#111; display:flex; align-items:center; justify-content:center; position:relative; flex-shrink:0; }\
.video-fs-player-wrap .play-btn-big { width:72px; height:72px; border-radius:50%; background:rgba(255,255,255,0.15); display:flex; align-items:center; justify-content:center; font-size:2rem; color:#fff; cursor:pointer; transition:all 0.2s; z-index:2; }\
.video-fs-player-wrap .play-btn-big:hover { transform:scale(1.1); background:rgba(255,255,255,0.25); }\
.video-fs-player-wrap .duration-badge { position:absolute; bottom:12px; right:12px; background:rgba(0,0,0,0.7); color:#fff; font-size:0.8125rem; padding:2px 10px; border-radius:var(--radius-full); z-index:2; }\
.video-fs-controls { display:flex; align-items:center; gap:0.5rem; padding:0.5rem 1.5rem; background:rgba(0,0,0,0.8); flex-wrap:wrap; }\
.video-fs-controls .fs-ctrl-btn { width:36px; height:36px; border-radius:var(--radius-sm); display:flex; align-items:center; justify-content:center; color:#aaa; cursor:pointer; transition:all 0.15s; background:transparent; border:none; }\
.video-fs-controls .fs-ctrl-btn:hover { color:#fff; background:rgba(255,255,255,0.1); }\
.video-fs-controls .fs-ctrl-btn.active { color:var(--accent-blue); }\
.fs-progress-wrap { flex:1; height:4px; min-width:60px; background:rgba(255,255,255,0.2); border-radius:var(--radius-full); cursor:pointer; position:relative; }\
.fs-progress-fill { height:100%; border-radius:var(--radius-full); background:var(--accent-blue); transition:width 0.3s ease; }\
.fs-time { font-size:0.75rem; color:#aaa; white-space:nowrap; font-variant-numeric:tabular-nums; }\
.fs-speed-btn { padding:2px 8px; border-radius:var(--radius-sm); font-size:0.75rem; font-weight:600; color:#aaa; cursor:pointer; transition:all 0.15s; border:1px solid rgba(255,255,255,0.2); background:transparent; }\
.fs-speed-btn:hover { color:#fff; }\
.fs-speed-btn.active { color:var(--accent-blue); border-color:var(--accent-blue); }\
.fs-speed-btns { display:flex; gap:4px; flex-wrap:wrap; }\
.fs-captions-overlay { position:absolute; bottom:48px; left:0; right:0; text-align:center; z-index:3; pointer-events:none; }\
.fs-captions-overlay span { display:inline-block; background:rgba(0,0,0,0.75); color:#fff; font-size:0.875rem; padding:4px 16px; border-radius:var(--radius-sm); }\
.video-fs-info { padding:1rem 1.5rem; }\
.video-fs-info h3 { font-size:1.125rem; font-weight:700; color:#fff; margin-bottom:0.5rem; }\
.video-fs-info .fs-meta { display:flex; flex-wrap:wrap; gap:0.5rem; font-size:0.8125rem; color:#aaa; margin-bottom:1rem; }\
.video-fs-info .fs-meta span { background:rgba(255,255,255,0.08); padding:0.25rem 0.75rem; border-radius:var(--radius-full); }\
.video-fs-info .fs-desc { font-size:0.875rem; color:#aaa; line-height:1.6; margin-bottom:1rem; }\
.video-fs-actions { display:flex; gap:0.75rem; flex-wrap:wrap; margin-bottom:1rem; }\
.video-fs-actions .fs-action-btn { display:flex; align-items:center; gap:0.5rem; padding:0.4rem 1rem; border-radius:var(--radius-md); font-size:0.8125rem; font-weight:500; cursor:pointer; transition:all 0.15s; border:1px solid rgba(255,255,255,0.15); background:rgba(255,255,255,0.05); color:#ccc; }\
.video-fs-actions .fs-action-btn:hover { background:rgba(255,255,255,0.1); color:#fff; }\
.video-fs-actions .fs-action-btn.active { border-color:var(--accent-yellow); color:var(--accent-yellow); }\
.fs-notes-section { margin-bottom:1rem; }\
.fs-notes-section textarea { width:100%; min-height:80px; padding:0.75rem; border-radius:var(--radius-md); background:rgba(255,255,255,0.05); border:1px solid rgba(255,255,255,0.15); color:#fff; font-size:0.8125rem; resize:vertical; outline:none; }\
.fs-notes-section textarea:focus { border-color:var(--accent-blue); }\
.fs-notes-section .fs-notes-label { display:flex; align-items:center; justify-content:space-between; margin-bottom:0.5rem; }\
.fs-notes-section .fs-notes-label span { font-size:0.8125rem; font-weight:600; color:#aaa; }\
.fs-sidebar { width:320px; flex-shrink:0; border-left:1px solid rgba(255,255,255,0.1); padding:1rem 1.5rem; overflow-y:auto; background:rgba(0,0,0,0.3); }\
.fs-sidebar h4 { font-size:0.875rem; font-weight:600; margin-bottom:1rem; color:#aaa; text-transform:uppercase; letter-spacing:0.05em; }\
.fs-related-item { display:flex; gap:0.75rem; padding:0.5rem; border-radius:var(--radius-md); cursor:pointer; transition:background 0.15s; margin-bottom:0.5rem; }\
.fs-related-item:hover { background:rgba(255,255,255,0.08); }\
.fs-related-thumb { width:140px; height:78px; border-radius:var(--radius-sm); display:flex; align-items:center; justify-content:center; flex-shrink:0; font-size:1.25rem; color:#fff; }\
.fs-related-info { flex:1; min-width:0; }\
.fs-related-info .fr-title { font-size:0.8125rem; font-weight:600; color:#fff; white-space:nowrap; overflow:hidden; text-overflow:ellipsis; margin-bottom:0.25rem; }\
.fs-related-info .fr-meta { font-size:0.75rem; color:#888; }\
.fs-sidebar .fs-next-btn { display:block; width:100%; padding:0.5rem; margin-bottom:1rem; border-radius:var(--radius-md); background:var(--accent-blue); color:#fff; font-size:0.8125rem; font-weight:600; text-align:center; cursor:pointer; border:none; transition:opacity 0.15s; }\
.fs-sidebar .fs-next-btn:hover { opacity:0.9; }\
.fs-video-id { font-size:0.7rem; color:#666; margin-bottom:0.5rem; }\
@media (max-width:768px) { .video-fullscreen-body { flex-direction:column; } .fs-sidebar { width:100%; border-left:none; border-top:1px solid rgba(255,255,255,0.1); } .video-fs-player-wrap { aspect-ratio:16/9; max-height:50vh; } }\
@media (max-width:480px) { .video-fullscreen-header h2 { font-size:0.875rem; } .video-fs-controls { gap:0.25rem; } .fs-time { font-size:0.65rem; } .fs-sidebar { padding:0.75rem 1rem; } }\
';
    document.head.appendChild(style);
  }

  window.renderPage.videos = function(params) {
    var mainContent = document.getElementById('main-content');
    if (!mainContent) return;
    mainContent.innerHTML = renderSkeleton();
    setTimeout(function() {
      try {
        renderPageContent(mainContent, params || {});
      } catch (e) {
        mainContent.innerHTML = '<div class="page-container"><div class="empty-state"><div class="empty-state-icon">\u26A0\uFE0F</div><h2 class="empty-state-title">Something went wrong</h2><p class="empty-state-text">Try refreshing the page</p><button class="btn btn-primary" data-action="video:reload">Retry</button></div></div>';
      }
    }, 150);
  };

  window.renderPage.openFilterDrawer = openFilterDrawer;

  window.renderPage.removeFilterChip = function(type, value) {
    if (type === 'search') {
      filterState.search = '';
    } else if (type === 'subjects') {
      if (filterState.subjects) {
        var idx = filterState.subjects.indexOf(value);
        if (idx !== -1) filterState.subjects.splice(idx, 1);
      }
    } else if (type === 'duration') {
      filterState.duration = '';
    } else if (type === 'difficulty') {
      filterState.difficulty = '';
    } else if (type === 'languages') {
      if (filterState.languages) {
        var li = filterState.languages.indexOf(value);
        if (li !== -1) filterState.languages.splice(li, 1);
      }
    } else if (type === 'category') {
      filterState.category = '';
    }
    filterState.page = 1;
    window.renderPage.videos(window.Router.getParams());
  };

  window.renderPage.clearFilters = function() {
    filterState.search = '';
    filterState.subjects = [];
    filterState.duration = '';
    filterState.difficulty = '';
    filterState.languages = [];
    filterState.category = '';
    filterState.page = 1;
    window.renderPage.videos(window.Router.getParams());
  };

  window.renderPage.updateFilter = function(key, value) {
    filterState[key] = value;
    filterState.page = 1;
    window.renderPage.videos(window.Router.getParams());
  };

  window.renderPage.setCategory = function(categoryId) {
    filterState.category = categoryId;
    filterState.page = 1;
    window.renderPage.videos(window.Router.getParams());
  };

  window.renderPage.goToVideoPage = function(page) {
    if (page < 1) return;
    filterState.page = page;
    var p = {
      search: filterState.search,
      sort: filterState.sort,
      view: filterState.view,
      page: filterState.page,
      duration: filterState.duration,
      difficulty: filterState.difficulty,
      languages: filterState.languages.length > 0 ? filterState.languages.join(',') : '',
      category: filterState.category
    };
    window.location.hash = buildUrl(p);
  };

  window.renderPage.toggleVideoBookmark = function(id) {
    toggleBookmark(id);
    window.renderPage.videos(window.Router.getParams());
  };

  window.renderPage.toggleVideoFav = window.renderPage.toggleVideoBookmark;

  window.renderPage.togglePlaylist = function(playlistId) {
    var current = store.get('expandedPlaylist');
    if (current === playlistId) {
      store.set('expandedPlaylist', null);
    } else {
      store.set('expandedPlaylist', playlistId || null);
    }
    window.renderPage.videos(window.Router.getParams());
  };

  window.renderPage.scrollTo = function(id) {
    var el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  window.renderPage.openVideoDrawer = function(videoId) {
    var videos = md.videos || [];
    var video = null;
    for (var i = 0; i < videos.length; i++) {
      if (videos[i].id === videoId) { video = videos[i]; break; }
    }
    if (!video) return;

    injectDrawerStyles();

    var related = [];
    var nextVideo = null;
    for (var ri = 0; ri < videos.length; ri++) {
      if (videos[ri].id !== video.id && videos[ri].subjectId === video.subjectId) {
        if (!nextVideo) nextVideo = videos[ri];
        related.push(videos[ri]);
        if (related.length >= 6) break;
      }
    }

    var subject = null;
    for (var si = 0; si < md.subjects.length; si++) {
      if (md.subjects[si].id === video.subjectId) { subject = md.subjects[si]; break; }
    }

    var isBm = isBookmarked(video.id);
    var subjName = getSubjectName(video.subjectId);
    var subjIcon = getSubjectIcon(video.subjectId);
    var grad = utils.getGradient(parseInt((video.subjectId || 's0').replace('s', ''), 10) || 0);

    var allNotes = store.get('videoNotes') || {};
    var existingNote = allNotes[video.id] || '';

    var vidDisplayId = 'VID-' + video.id.toUpperCase();

    var overlay = document.createElement('div');
    overlay.className = 'video-fullscreen-overlay';
    overlay.id = 'video-drawer';
    overlay.innerHTML = '\
<div class="video-fullscreen-header">\
  <h2>' + utils.sanitizeHTML(video.title) + '</h2>\
  <div class="c-flex-center c-flex-gap-2">\
    <span style="color:#666;font-size:0.75rem">' + vidDisplayId + '</span>\
    <button class="fs-close" data-action="video:close" title="Close">\u2715</button>\
  </div>\
</div>\
<div class="video-fullscreen-body">\
  <div class="video-fullscreen-main">\
    <div class="video-fs-player-wrap" style="background:' + grad + '" id="drawer-player-area">\
      <div class="play-btn-big" id="drawer-play-btn">\u25B6</div>\
      <span class="duration-badge">' + utils.formatDuration(video.duration || 0) + '</span>\
      <div style="position:absolute;top:12px;right:12px;font-size:1.5rem;opacity:0.3">' + subjIcon + '</div>\
      <div class="fs-captions-overlay" id="drawer-captions" style="display:none"><span>' + mockSubtitleLines[0] + '</span></div>\
    </div>\
    <div class="video-fs-controls">\
      <span class="fs-time" id="drawer-current-time">0:00</span>\
      <div class="fs-progress-wrap" id="drawer-progress"><div class="fs-progress-fill" id="drawer-progress-fill" style="width:0%"></div></div>\
      <span class="fs-time" id="drawer-total-time">' + utils.formatDuration(video.duration || 0) + '</span>\
      <span class="fs-time" style="margin-left:0.25rem">Speed:</span>\
      <div class="fs-speed-btns">';
    for (var spi = 0; spi < speeds.length; spi++) {
      overlay.innerHTML += '<button class="fs-speed-btn' + (currentSpeed === speeds[spi] ? ' active' : '') + '" data-action="video:speed:' + speeds[spi] + '">' + speeds[spi] + 'x</button>';
    }
    overlay.innerHTML += '\
      </div>\
      <button class="fs-ctrl-btn' + (captionsVisible ? ' active' : '') + '" id="drawer-cc-btn" data-action="video:cc" title="Captions">CC</button>\
    </div>\
    <div class="video-fs-info">\
      <h3>' + utils.sanitizeHTML(video.title) + '</h3>\
      <div class="fs-meta">\
        <span>' + utils.sanitizeHTML(video.instructor || 'Instructor') + '</span>\
        <span>' + utils.sanitizeHTML(subjName) + '</span>\
        <span>' + utils.formatDuration(video.duration || 0) + '</span>\
        <span>' + utils.formatNumber(video.views || 0) + ' views</span>\
        <span>' + (video.rating || '0') + ' \u2605</span>\
        <span>' + utils.sanitizeHTML(video.language || 'English') + '</span>\
      </div>\
      <div class="fs-desc">' + utils.sanitizeHTML(video.description || video.title) + '</div>\
      <div class="video-fs-actions">\
        <button class="fs-action-btn' + (isBm ? ' active' : '') + '" id="drawer-bookmark-btn" data-action="video:drawerBookmark:' + video.id + '">' + (isBm ? '\u2B50' : '\u2606') + ' ' + (isBm ? 'Bookmarked' : 'Bookmark') + '</button>\
        <button class="fs-action-btn" data-action="video:share:' + video.id + '">\uD83D\uDD17 Share</button>\
        <button class="fs-action-btn" data-action="video:download:' + video.id + '">\u2B07\uFE0F Download</button>\
      </div>\
      <div class="fs-notes-section">\
        <div class="fs-notes-label"><span>\uD83D\uDCDD Notes</span><span style="font-size:0.7rem;color:#666" id="drawer-notes-status">' + (existingNote ? 'Saved' : '') + '</span></div>\
        <textarea id="drawer-notes-textarea" placeholder="Write your notes here..." data-action="video:saveNote:' + video.id + '">' + utils.sanitizeHTML(existingNote) + '</textarea>\
      </div>\
    </div>\
  </div>\
  <div class="fs-sidebar">\
    <h4>Related Videos</h4>';
    if (nextVideo) {
      overlay.innerHTML += '<button class="fs-next-btn" data-action="video:related:' + nextVideo.id + '">Next Video \u2192</button>';
    }
    for (var ri2 = 0; ri2 < related.length; ri2++) {
      var rv = related[ri2];
      var rGrad = utils.getGradient(ri2);
      overlay.innerHTML += '<div class="fs-related-item" data-action="video:related:' + rv.id + '"><div class="fs-related-thumb" style="background:' + rGrad + '">\u25B6</div><div class="fs-related-info"><div class="fr-title">' + utils.sanitizeHTML(rv.title) + '</div><div class="fr-meta">' + utils.sanitizeHTML(rv.instructor || '') + ' \xb7 ' + utils.formatDuration(rv.duration || 0) + '</div></div></div>';
    }
    overlay.innerHTML += '\
  </div>\
</div>';

    overlay.addEventListener('click', function(e) {
      if (e.target === overlay) window.renderPage.closeVideoDrawer();
    });
    document.body.appendChild(overlay);

    document.addEventListener('keydown', function(e) {
      if (e.key === 'Escape') {
        window.renderPage.closeVideoDrawer();
      }
    });

    var progress = store.get('videoProgress') || {};
    var current = progress[video.id] || 0;
    var newProgress = current;
    if (current < 100) {
      newProgress = Math.min(100, current + Math.floor(Math.random() * 20) + 5);
      if (newProgress > 100) newProgress = 100;
      progress[video.id] = newProgress;
      store.set('videoProgress', progress);
    }

    setTimeout(function() {
      var fill = document.getElementById('drawer-progress-fill');
      if (fill) {
        fill.style.width = Math.min(newProgress, 100) + '%';
      }
    }, 500);

    var history = store.get('videoHistory') || [];
    for (var hi3 = 0; hi3 < history.length; hi3++) {
      if (history[hi3].id === video.id) { history.splice(hi3, 1); break; }
    }
    history.unshift({ id: video.id, title: video.title, subjectId: video.subjectId, instructor: video.instructor, duration: video.duration, timestamp: Date.now() });
    if (history.length > 20) history = history.slice(0, 20);
    store.set('videoHistory', history);
  };

  window.renderPage.closeVideoDrawer = function() {
    var overlay = document.getElementById('video-drawer');
    if (overlay) overlay.remove();
  };

  window.renderPage.toggleDrawerBookmark = function(id) {
    toggleBookmark(id);
    var overlay = document.getElementById('video-drawer');
    if (overlay) {
      window.renderPage.closeVideoDrawer();
      window.renderPage.openVideoDrawer(id);
    }
  };

  window.renderPage.shareVideo = function(videoId) {
    var videos = md.videos || [];
    var video = null;
    for (var i = 0; i < videos.length; i++) {
      if (videos[i].id === videoId) { video = videos[i]; break; }
    }
    if (!video) return;
    if (navigator.share) {
      navigator.share({ title: video.title, text: 'Check out this video: ' + video.title, url: window.location.href });
    } else {
      var inp = document.createElement('input');
      inp.value = window.location.href.split('?')[0] + '?video=' + video.id;
      document.body.appendChild(inp);
      inp.select();
      try { document.execCommand('copy'); } catch(e) {}
      document.body.removeChild(inp);
      var toast = document.createElement('div');
      toast.style.cssText = 'position:fixed;bottom:2rem;left:50%;transform:translateX(-50%);background:var(--bg-tertiary);color:var(--text-primary);padding:0.75rem 1.5rem;border-radius:var(--radius-md);border:1px solid var(--border-color);box-shadow:var(--shadow-lg);z-index:1000;font-size:0.875rem;animation:fadeInUp 0.3s ease';
      toast.textContent = 'Link copied to clipboard!';
      document.body.appendChild(toast);
      setTimeout(function() { toast.remove(); }, 2500);
    }
  };

  window.renderPage.downloadVideo = function(videoId) {
    var videos = md.videos || [];
    var video = null;
    for (var i = 0; i < videos.length; i++) {
      if (videos[i].id === videoId) { video = videos[i]; break; }
    }
    if (!video) return;
    var toast = document.createElement('div');
    toast.style.cssText = 'position:fixed;bottom:2rem;left:50%;transform:translateX(-50%);background:var(--bg-tertiary);color:var(--text-primary);padding:0.75rem 1.5rem;border-radius:var(--radius-md);border:1px solid var(--border-color);box-shadow:var(--shadow-lg);z-index:1000;font-size:0.875rem;animation:fadeInUp 0.3s ease;display:flex;align-items:center;gap:0.5rem';
    toast.innerHTML = '\u2B07\uFE0F Downloading "' + utils.sanitizeHTML(video.title) + '"...';
    document.body.appendChild(toast);
    setTimeout(function() { toast.remove(); }, 2500);
  };

  window.renderPage.openVideoModal = window.renderPage.openVideoDrawer;

  window.renderPage.saveDrawerNote = function(videoId, note) {
    var notes = store.get('videoNotes') || {};
    notes[videoId] = note;
    store.set('videoNotes', notes);
    var statusEl = document.getElementById('drawer-notes-status');
    if (statusEl) {
      if (note) {
        statusEl.textContent = 'Saving...';
        clearTimeout(statusEl._noteTimer);
        statusEl._noteTimer = setTimeout(function() {
          statusEl.textContent = 'Saved';
        }, 300);
      } else {
        statusEl.textContent = '';
      }
    }
  };

  window.renderPage.setDrawerSpeed = function(speed) {
    currentSpeed = speed;
    var btns = document.querySelectorAll('#video-drawer .speed-btn');
    for (var i = 0; i < btns.length; i++) {
      var val = parseFloat(btns[i].textContent);
      btns[i].className = 'speed-btn' + (val === speed ? ' active' : '');
    }
  };

  window.renderPage.cycleDrawerSpeed = function() {
    var idx = speeds.indexOf(currentSpeed);
    if (idx === -1 || idx === speeds.length - 1) {
      currentSpeed = speeds[0];
    } else {
      currentSpeed = speeds[idx + 1];
    }
    var btn = document.getElementById('drawer-speed-btn');
    if (btn) btn.textContent = currentSpeed + 'x';
  };

  window.renderPage.toggleDrawerCaptions = function() {
    captionsVisible = !captionsVisible;
    var overlay = document.getElementById('drawer-captions');
    var btn = document.getElementById('drawer-cc-btn');
    if (overlay) overlay.style.display = captionsVisible ? 'block' : 'none';
    if (btn) {
      btn.className = 'ctrl-btn' + (captionsVisible ? ' active' : '');
    }
    if (captionsVisible) {
      var captionEl = document.getElementById('drawer-captions');
      if (captionEl) {
        var lineIdx = Math.floor(Math.random() * mockSubtitleLines.length);
        captionEl.innerHTML = '<span>' + mockSubtitleLines[lineIdx] + '</span>';
      }
    }
  };

  window.renderPage.toggleDrawerPip = function() {
    var toast = document.createElement('div');
    toast.style.cssText = 'position:fixed;bottom:2rem;left:50%;transform:translateX(-50%);background:var(--bg-tertiary);color:var(--text-primary);padding:0.75rem 1.5rem;border-radius:var(--radius-md);border:1px solid var(--border-color);box-shadow:var(--shadow-lg);z-index:1000;font-size:0.875rem;animation:fadeInUp 0.3s ease;display:flex;align-items:center;gap:0.5rem';
    toast.innerHTML = '\uD83D\uDCF9 Picture-in-Picture mode activated';
    document.body.appendChild(toast);
    setTimeout(function() { toast.remove(); }, 2500);
  };

})();
