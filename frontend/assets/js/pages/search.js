window.renderPage.search = function(params) {
  var store = window.Store;
  var utils = window.Utils;
  var api = window.API;
  var md = window.mockData;
  var mc = document.getElementById('main-content');
  if (!mc) return;

  var initialQuery = (params && params.q) || '';
  var debounceTimer = null;
  var allResults = [];
  var searchPerformed = false;
  var isLoading = false;
  var searchHistory = store.get('searchHistory') || [];
  var filterState = {
    contentType: [],
    category: [],
    class: [],
    subject: [],
    date: 'any',
    sort: 'relevance'
  };
  var activeFilterCount = 0;

  function es(icon, title, msg) {
    return '<div class="empty-state" style="text-align:center;padding:40px 20px"><div class="empty-state-icon" style="font-size:3rem;margin-bottom:16px">' + icon + '</div><div class="empty-state-title" style="font-size:1.1rem;font-weight:600;color:var(--text-primary);margin-bottom:8px">' + title + '</div><div class="empty-state-text" style="font-size:0.875rem;color:var(--text-secondary)">' + msg + '</div></div>';
  }

  var trendingSearches = [
    'Mathematics', 'Physics', 'Class 10', 'Trigonometry', 'NEET Preparation',
    'English Grammar', 'Organic Chemistry', 'CBSE Board', 'JEE Main', 'Algebra'
  ];

  var typeConfig = {
    subjects: { icon: '\uD83D\uDCDA', label: 'Subjects', badge: 'badge-purple', plural: 'Subjects', route: 'subjects' },
    courses: { icon: '\uD83D\uDCD6', label: 'Course', badge: 'badge-blue', plural: 'Courses', route: 'courses' },
    videos: { icon: '\uD83C\uDFAC', label: 'Video', badge: 'badge-cyan', plural: 'Videos', route: 'videos' },
    resources: { icon: '\uD83D\uDCC4', label: 'Resource', badge: 'badge-green', plural: 'Resources', route: 'resources' },
    quizzes: { icon: '\uD83D\uDCDD', label: 'Quiz', badge: 'badge-pink', plural: 'Quizzes', route: 'quizzes' },
    exams: { icon: '\uD83D\uDCD0', label: 'Exam', badge: 'badge-orange', plural: 'Exams', route: 'exams' },
    marketplace: { icon: '\uD83D\uDECD\uFE0F', label: 'Product', badge: 'badge-yellow', plural: 'Marketplace', route: 'marketplace' },
    community: { icon: '\uD83D\uDCAC', label: 'Post', badge: 'badge-blue', plural: 'Community', route: 'community' },
    users: { icon: '\uD83D\uDC64', label: 'User', badge: 'badge-gray', plural: 'Users', route: 'profile' },
    books: { icon: '\uD83D\uDCDA', label: 'Book', badge: 'badge-purple', plural: 'Books', route: 'books' }
  };

  var typeOrder = ['subjects', 'courses', 'videos', 'resources', 'quizzes', 'exams', 'marketplace', 'community', 'users', 'books'];

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

  function getSubjectName(id) {
    if (!id) return '';
    var subjects = md.subjects || [];
    for (var i = 0; i < subjects.length; i++) {
      if (subjects[i].id === id) return subjects[i].name;
    }
    return '';
  }

  function getTypeIcon(type) {
    return (typeConfig[type] || {}).icon || '\uD83D\uDCCC';
  }

  function getTypeLabel(type) {
    return (typeConfig[type] || {}).label || type;
  }

  function getTypePlural(type) {
    return (typeConfig[type] || {}).plural || type;
  }

  function getTypeBadgeClass(type) {
    return (typeConfig[type] || {}).badge || 'badge-gray';
  }

  function getTypeRoute(type) {
    return (typeConfig[type] || {}).route || type;
  }

  function highlightMatch(text, query) {
    if (!text || !query || query.trim().length < 2) return utils.sanitizeHTML(text);
    var sanitized = utils.sanitizeHTML(text);
    var q = utils.sanitizeHTML(query.trim());
    var idx = sanitized.toLowerCase().indexOf(q.toLowerCase());
    if (idx === -1) return sanitized;
    return sanitized.slice(0, idx) + '<mark class="search-highlight">' + sanitized.slice(idx, idx + q.length) + '</mark>' + sanitized.slice(idx + q.length);
  }

  function getMatchReason(item, query) {
    if (!query || query.trim().length < 2) return '';
    var q = query.toLowerCase().trim();
    if (item.title && item.title.toLowerCase().indexOf(q) !== -1) return 'Matched in title';
    if (item.name && item.name.toLowerCase().indexOf(q) !== -1) return 'Matched in title';
    if (item.description && item.description.toLowerCase().indexOf(q) !== -1) return 'Matched in description';
    if (item.tags) {
      var tags = typeof item.tags === 'string' ? [item.tags] : item.tags;
      for (var ti = 0; ti < tags.length; ti++) {
        if (tags[ti] && tags[ti].toLowerCase().indexOf(q) !== -1) return 'Matched in tags';
      }
    }
    if (item.author && item.author.toLowerCase().indexOf(q) !== -1) return 'Matched in author';
    if (item.instructor && item.instructor.toLowerCase().indexOf(q) !== -1) return 'Matched in instructor';
    if (item.subjectName && item.subjectName.toLowerCase().indexOf(q) !== -1) return 'Matched in subject';
    return '';
  }

  function getPreviewText(item) {
    return item.description || item.content || item.bio || item.excerpt || '';
  }

  function getItemRating(item) {
    return item.rating || item.averageRating || item.stars || null;
  }

  function getItemClass(item) {
    return item.class || item.classId || (item.subject ? item.subject.class : null) || null;
  }

  function getItemSubject(item) {
    if (item.subjectName) return item.subjectName;
    if (item.subjectId) return getSubjectName(item.subjectId);
    if (item.subject) return typeof item.subject === 'string' ? item.subject : (item.subject.name || '');
    if (item.category) return item.category;
    return '';
  }

  function getItemDuration(item) {
    return item.duration || item.durationMinutes || item.pageCount || null;
  }

  function performSearch(query) {
    if (!query || query.trim().length < 2) {
      allResults = [];
      searchPerformed = false;
      isLoading = false;
      renderResults();
      return;
    }

    var q = query.trim();
    addToHistory(q);
    isLoading = true;
    searchPerformed = true;
    renderResults();

    api.search(q).then(function(res) {
      isLoading = false;
      if (res.success && res.data) {
        allResults = res.data;
      } else {
        allResults = [];
      }
      renderResults();
    });
  }

  function addToHistory(query) {
    var history = store.get('searchHistory') || [];
    history = history.filter(function(h) { return h.toLowerCase() !== query.toLowerCase(); });
    history.unshift(query);
    if (history.length > 10) history = history.slice(0, 10);
    store.set('searchHistory', history);
    searchHistory = history;
  }

  function removeHistoryItem(query) {
    searchHistory = searchHistory.filter(function(h) { return h.toLowerCase() !== query.toLowerCase(); });
    store.set('searchHistory', searchHistory);
    renderHistoryAndTrending();
  }

  function clearHistory() {
    searchHistory = [];
    store.set('searchHistory', []);
    renderHistoryAndTrending();
  }

  function getFilteredResults() {
    var filtered = allResults.slice();

    if (filterState.contentType && filterState.contentType.length > 0) {
      filtered = filtered.filter(function(r) { return filterState.contentType.indexOf(r.type) !== -1; });
    }

    if (filterState.sort === 'newest') {
      filtered.sort(function(a, b) {
        var da = a.createdAt || a.publishedDate || a.date || '';
        var db = b.createdAt || b.publishedDate || b.date || '';
        return db.localeCompare(da);
      });
    } else if (filterState.sort === 'oldest') {
      filtered.sort(function(a, b) {
        var da = a.createdAt || a.publishedDate || a.date || '';
        var db = b.createdAt || b.publishedDate || b.date || '';
        return da.localeCompare(db);
      });
    } else if (filterState.sort === 'popular') {
      filtered.sort(function(a, b) {
        return (b.views || b.popularity || b.rating || 0) - (a.views || a.popularity || a.rating || 0);
      });
    }

    return filtered;
  }

  function groupResultsByType(results) {
    var grouped = {};
    for (var i = 0; i < typeOrder.length; i++) {
      grouped[typeOrder[i]] = [];
    }
    for (var j = 0; j < results.length; j++) {
      var r = results[j];
      var t = r.type || 'other';
      if (!grouped[t]) grouped[t] = [];
      grouped[t].push(r);
    }
    return grouped;
  }

  function renderResultCard(item, query) {
    var title = item.title || item.name || item.content || 'Untitled';
    var desc = getPreviewText(item);
    var matchReason = getMatchReason(item, query);
    var rating = getItemRating(item);
    var cls = getItemClass(item);
    var subjectName = getItemSubject(item);
    var duration = getItemDuration(item);
    var route = getTypeRoute(item.type);
    var itemId = item.id || '';
    var navPath = '#/' + route + (itemId ? '?id=' + encodeURIComponent(itemId) : '');
    var price = item.price !== undefined ? item.price : null;
    var imageUrl = item.image || item.thumbnail || item.coverImage || '';

    return '\
<div class="search-result-card glass-card" data-action="search:nav:' + encodeURIComponent(navPath) + '">\
  <div class="flex items-start gap-4">\
    <div class="search-result-card-icon" style="' + (imageUrl ? 'background-image:url(' + utils.sanitizeHTML(imageUrl) + ');background-size:cover;background-position:center' : '') + '">\
      ' + (imageUrl ? '' : getTypeIcon(item.type)) + '\
    </div>\
    <div class="flex-1 min-w-0">\
      <div class="flex items-center gap-2 mb-1 flex-wrap">\
        <span class="badge ' + getTypeBadgeClass(item.type) + '">' + getTypeIcon(item.type) + ' ' + getTypeLabel(item.type) + '</span>\
        ' + (matchReason ? '<span class="text-xs text-tertiary">\uD83D\uDD0D ' + matchReason + '</span>' : '') + '\
      </div>\
      <div class="search-result-card-title">' + highlightMatch(title, query) + '</div>\
      ' + (desc ? '<div class="search-result-card-desc">' + highlightMatch(utils.truncate(desc, 100), query) + '</div>' : '') + '\
      <div class="flex items-center gap-3 mt-2 text-xs text-tertiary flex-wrap">\
        ' + (subjectName ? '<span>' + getTypeIcon(item.type) + ' ' + utils.sanitizeHTML(subjectName) + '</span>' : '') + '\
        ' + (cls ? '<span>\uD83C\uDF93 Class ' + cls + '</span>' : '') + '\
        ' + (duration ? '<span>\u23F1 ' + (item.type === 'books' ? duration + ' pages' : utils.formatDuration(duration)) + '</span>' : '') + '\
        ' + (rating ? '<span>\u2B50 ' + rating + '</span>' : '') + '\
        ' + (price !== null ? '<span>' + utils.formatCurrency(price) + '</span>' : '') + '\
        ' + (item.views ? '<span>\uD83D\uDC41 ' + utils.formatNumber(item.views) + '</span>' : '') + '\
      </div>\
    </div>\
  </div>\
</div>';
  }

  function renderResults() {
    var container = document.getElementById('search-results-container');
    if (!container) return;

    var input = document.getElementById('search-page-input');
    var query = input ? input.value.trim() : initialQuery;
    var h = '';

    if (isLoading) {
      h += renderLoadingSkeleton();
    } else if (!searchPerformed && query.length < 2) {
      h += renderInitialState();
    } else if (searchPerformed && allResults.length === 0) {
      h += renderNoResults(query);
    } else if (searchPerformed && allResults.length > 0) {
      var filtered = getFilteredResults();
      var grouped = groupResultsByType(filtered);
      var totalResults = filtered.length;

      h += '<div class="search-results-summary">\
  <span class="text-sm text-tertiary">' + totalResults + ' result' + (totalResults !== 1 ? 's' : '') + ' for <strong>' + utils.sanitizeHTML(query) + '</strong></span>\
  ' + (activeFilterCount > 0 ? '<span class="badge badge-blue cursor-pointer" data-action="search:openFilter">\uD83D\uDD0D ' + activeFilterCount + ' filter' + (activeFilterCount !== 1 ? 's' : '') + ' active</span>' : '') + '\
</div>';

      for (var gi = 0; gi < typeOrder.length; gi++) {
        var type = typeOrder[gi];
        var items = grouped[type];
        if (!items || items.length === 0) continue;

        var config = typeConfig[type] || { icon: '\uD83D\uDCCC', plural: type };
        var showCount = 4;
        var displayItems = items.slice(0, showCount);
        var remaining = items.length - showCount;

        h += '\
<div class="search-section mt-6">\
  <div class="section-header">\
    <h3 class="section-title">' + config.icon + ' ' + config.plural + ' (' + items.length + ')</h3>\
    ' + (items.length > showCount ? '<span class="section-action cursor-pointer text-accent-blue text-sm" data-action="search:navigate:' + type + ':' + encodeURIComponent(query) + '">View all ' + items.length + ' ' + config.plural.toLowerCase() + ' \u2192</span>' : '') + '\
  </div>\
  <div class="search-results-grid">';
        for (var ri = 0; ri < displayItems.length; ri++) {
          h += renderResultCard(displayItems[ri], query);
        }
        h += '\
  </div>\
</div>';
      }
    }

    container.innerHTML = h;
  }

  function navigateToTypePage(type, query) {
    var route = getTypeRoute(type);
    window.location.hash = '#/' + route + '?search=' + encodeURIComponent(query);
  }

  function renderLoadingSkeleton() {
    var h = '<div class="search-loading">';
    for (var si = 0; si < 3; si++) {
      h += '\
  <div class="mb-6">\
    <div class="skeleton" style="width:160px;height:24px;border-radius:6px;margin-bottom:12px"></div>\
    <div class="search-results-grid">';
      for (var ci = 0; ci < 4; ci++) {
        h += '\
      <div class="glass-card p-5">\
        <div class="flex items-start gap-4">\
          <div class="skeleton" style="width:48px;height:48px;border-radius:var(--radius-md);flex-shrink:0"></div>\
          <div class="flex-1">\
            <div class="skeleton" style="width:60%;height:16px;border-radius:4px;margin-bottom:8px"></div>\
            <div class="skeleton" style="width:90%;height:12px;border-radius:4px;margin-bottom:4px"></div>\
            <div class="skeleton" style="width:40%;height:12px;border-radius:4px"></div>\
          </div>\
        </div>\
      </div>';
      }
      h += '\
    </div>\
  </div>';
    }
    h += '</div>';
    return h;
  }

  function renderInitialState() {
    return '\
<div class="search-initial-state">\
  <div class="text-center mb-6">\
    <div style="font-size:3rem;margin-bottom:1rem">\uD83D\uDD0D</div>\
    <h2 class="text-lg font-semibold mb-2">Search for anything...</h2>\
    <p class="text-sm text-tertiary">Find courses, videos, resources, quizzes, and more</p>\
  </div>\
  <div class="search-tips glass-card p-5 mb-6">\
    <h4 class="text-sm font-semibold mb-3">\uD83D\uDCA1 Search Tips</h4>\
    <ul class="text-sm text-secondary space-y-2" style="list-style:none;padding:0">\
      <li>\u2022 Type a subject name like "Mathematics" or "Physics"</li>\
      <li>\u2022 Search for specific topics like "Trigonometry" or "Organic Chemistry"</li>\
      <li>\u2022 Use class names like "Class 10" or "Class 12"</li>\
      <li>\u2022 Search for exam prep like "NEET" or "JEE Main"</li>\
    </ul>\
  </div>\
  <div class="grid grid-cols-2 gap-6">\
    <div class="glass-card p-5">\
      <div class="section-header"><h3 class="section-title">\uD83D\uDD50 Recent Searches</h3></div>\
      ' + (searchHistory.length === 0 ? '<div class="text-sm text-tertiary mt-2">No recent searches</div>' : '') + '\
      ' + (searchHistory.length > 0 ? '<div class="flex flex-col gap-1 mt-2">' : '') + '\
      ' + (function() {
        var html = '';
        for (var hi = 0; hi < searchHistory.length; hi++) {
          html += '\
        <div class="flex items-center justify-between py-2" style="border-bottom:1px solid var(--border-light)">\
          <span class="text-sm cursor-pointer search-chip-link" data-action="search:setVal:' + encodeURIComponent(searchHistory[hi]) + '">\uD83D\uDD52 ' + utils.sanitizeHTML(searchHistory[hi]) + '</span>\
          <button class="btn btn-icon-sm btn-ghost" data-action="search:removeHistory:' + encodeURIComponent(searchHistory[hi]) + '" title="Remove">\u2715</button>\
        </div>';
        }
        if (searchHistory.length > 0) {
          html += '\
        <button class="btn btn-ghost btn-sm mt-2" data-action="search:clearHistory">Clear History</button>';
        }
        return html;
      })() + '\
      ' + (searchHistory.length > 0 ? '</div>' : '') + '\
    </div>\
    <div class="glass-card p-5">\
      <div class="section-header"><h3 class="section-title">\uD83D\uDD25 Trending Searches</h3></div>\
      <div class="flex flex-wrap gap-2 mt-3">';
    for (var ti = 0; ti < trendingSearches.length; ti++) {
      h += '\
        <span class="search-trending-chip" data-action="search:setVal:' + encodeURIComponent(trendingSearches[ti]) + '">\uD83D\uDD25 ' + utils.sanitizeHTML(trendingSearches[ti]) + '</span>';
    }
    h += '\
      </div>\
    </div>\
  </div>\
</div>';
    return h;
  }

  function renderNoResults(query) {
    return '\
<div class="empty-state">\
  <div class="empty-state-icon">\uD83D\uDD0D</div>\
  <h2 class="empty-state-title">No results found</h2>\
  <p class="empty-state-text">No results found for <strong>' + utils.sanitizeHTML(query) + '</strong>. Try different keywords or browse categories.</p>\
  <div class="flex flex-wrap gap-2 mt-4 justify-center">\
    <span class="badge badge-blue cursor-pointer search-trending-chip" data-action="search:setVal:Mathematics">Mathematics</span>\
    <span class="badge badge-purple cursor-pointer search-trending-chip" data-action="search:setVal:Physics">Physics</span>\
    <span class="badge badge-cyan cursor-pointer search-trending-chip" data-action="search:setVal:Class%2010">Class 10</span>\
    <span class="badge badge-green cursor-pointer search-trending-chip" data-action="search:setVal:Trigonometry">Trigonometry</span>\
    <span class="badge badge-pink cursor-pointer search-trending-chip" data-action="search:setVal:NEET">NEET</span>\
  </div>\
  ' + (searchHistory.length > 0 ? '\
  <div class="mt-6">\
    <h4 class="text-sm font-semibold mb-2">\uD83D\uDD50 Recent Searches</h4>\
    <div class="flex flex-wrap gap-2">' : '') + '\
    ' + (function() {
      var html = '';
      for (var hi = 0; hi < Math.min(searchHistory.length, 5); hi++) {
        html += '\
      <span class="badge badge-gray cursor-pointer search-trending-chip" data-action="search:setVal:' + encodeURIComponent(searchHistory[hi]) + '">\uD83D\uDD52 ' + utils.sanitizeHTML(searchHistory[hi]) + '</span>';
      }
      return html;
    })() + '\
    ' + (searchHistory.length > 0 ? '</div></div>' : '') + '\
</div>';
  }

  function renderHistoryAndTrending() {
    var container = document.getElementById('search-results-container');
    if (container && !searchPerformed) {
      container.innerHTML = renderInitialState();
    }
  }

  function render() {
    var h = '';

    h += '<div class="search-page">';

    h += '\
<div class="search-header glass-card p-5 mb-6">\
  <div class="flex items-center gap-4">\
    <div class="search-header-icon">\uD83D\uDD0D</div>\
    <div class="flex-1">\
      <input type="text" class="search-page-input" id="search-page-input" \
        placeholder="Search courses, videos, resources, quizzes, marketplace items..." \
        value="' + utils.sanitizeHTML(initialQuery) + '" autofocus>\
    </div>\
    <button class="btn btn-secondary btn-sm" data-action="search:openFilter" style="position:relative">\
      \uD83D\uDD0D Filters\
      ' + (activeFilterCount > 0 ? '<span class="filter-count-badge">' + activeFilterCount + '</span>' : '') + '\
    </button>\
    ' + (initialQuery ? '<button class="btn btn-primary btn-sm" data-action="search:doSearch">Search</button>' : '') + '\
  </div>\
  <div class="flex flex-wrap gap-2 mt-3" id="search-trending-chips">\
    <span class="text-xs text-tertiary mr-1" style="padding-top:4px">Trending:</span>';
    for (var ts = 0; ts < Math.min(trendingSearches.length, 5); ts++) {
      h += '\
    <span class="search-trending-chip-sm" data-action="search:setVal:' + encodeURIComponent(trendingSearches[ts]) + '">' + utils.sanitizeHTML(trendingSearches[ts]) + '</span>';
    }
    h += '\
  </div>\
</div>';

    h += '<div id="search-results-container"></div>';
    h += '</div>';

    mc.innerHTML = h;

    injectStyles();

    var input = document.getElementById('search-page-input');
    if (input) {
      input.addEventListener('input', function() {
        clearTimeout(debounceTimer);
        var val = this.value;
        debounceTimer = setTimeout(function() {
          if (val.trim().length >= 2) {
            performSearch(val);
          } else if (val.trim().length === 0) {
            allResults = [];
            searchPerformed = false;
            isLoading = false;
            renderResults();
          }
        }, 350);
      });
      input.addEventListener('keydown', function(e) {
        if (e.key === 'Enter') {
          e.preventDefault();
          if (this.value.trim().length >= 2) {
            performSearch(this.value);
          }
        }
        if (e.key === 'Escape') {
          this.value = '';
          allResults = [];
          searchPerformed = false;
          isLoading = false;
          renderResults();
          this.blur();
        }
      });
      input.addEventListener('focus', function() {
        if (!searchPerformed && this.value.trim().length < 2) {
          renderResults();
        }
      });
      if (initialQuery && initialQuery.trim().length >= 2) {
        performSearch(initialQuery);
      } else {
        renderResults();
      }
    }

    document.addEventListener('keydown', function(e) {
      if (e.key === 'Escape') {
        var active = document.activeElement;
        if (active && active.id === 'search-page-input' && active.value) {
          active.value = '';
          allResults = [];
          searchPerformed = false;
          isLoading = false;
          renderResults();
          active.blur();
        }
      }
    });
  }

  function injectStyles() {
    var styleId = 'search-page-styles';
    if (document.getElementById(styleId)) return;
    var style = document.createElement('style');
    style.id = styleId;
    style.textContent = '\
.search-page-input { width:100%;background:transparent;border:none;color:var(--text-primary);font-size:var(--text-lg);outline:none }\
.search-page-input::placeholder { color:var(--text-tertiary) }\
.search-header-icon { font-size:1.5rem;color:var(--text-tertiary);flex-shrink:0 }\
.search-results-grid { display:grid;grid-template-columns:repeat(auto-fill,minmax(340px,1fr));gap:var(--space-4) }\
.search-result-card { padding:var(--space-5);cursor:pointer;transition:all 0.15s }\
.search-result-card:hover { transform:translateY(-2px);background:var(--bg-glass-hover) }\
.search-result-card-icon { width:48px;height:48px;border-radius:var(--radius-md);background:var(--bg-glass);display:flex;align-items:center;justify-content:center;font-size:1.5rem;flex-shrink:0 }\
.search-result-card-title { font-size:var(--text-sm);font-weight:600;margin-bottom:var(--space-1) }\
.search-result-card-desc { font-size:var(--text-xs);color:var(--text-secondary);display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden }\
.search-highlight { background:rgba(59,130,246,0.25);color:var(--accent-blue);padding:0 2px;border-radius:2px }\
.search-trending-chip { display:inline-flex;align-items:center;gap:4px;padding:6px 14px;background:var(--bg-glass);border:1px solid var(--border-color);border-radius:999px;font-size:0.8rem;color:var(--accent-blue);cursor:pointer;transition:all 0.15s }\
.search-trending-chip:hover { background:var(--bg-glass-hover);border-color:var(--accent-blue) }\
.search-trending-chip-sm { display:inline-flex;align-items:center;gap:4px;padding:3px 10px;background:var(--bg-glass);border:1px solid var(--border-color);border-radius:999px;font-size:0.75rem;color:var(--text-secondary);cursor:pointer;transition:all 0.15s }\
.search-trending-chip-sm:hover { background:var(--bg-glass-hover);color:var(--accent-blue) }\
.search-chip-link { color:var(--text-secondary);transition:color 0.15s }\
.search-chip-link:hover { color:var(--accent-blue) }\
.search-section { margin-bottom:var(--space-4) }\
.search-results-summary { display:flex;align-items:center;gap:var(--space-3);padding:var(--space-3) 0 }\
.filter-count-badge { position:absolute;top:-6px;right:-6px;min-width:18px;height:18px;border-radius:999px;background:var(--accent-blue,#3b82f6);color:#fff;font-size:0.65rem;font-weight:600;display:flex;align-items:center;justify-content:center;padding:0 5px }\
.search-page .section-action { font-size:var(--text-sm);cursor:pointer;color:var(--accent-blue);transition:opacity 0.15s }\
.search-page .section-action:hover { opacity:0.8 }\
.search-initial-state .search-trending-chip { font-size:0.75rem;padding:4px 10px }\
.search-tips ul li { padding:4px 0 }';
    document.head.appendChild(style);
  }

  function openFilterDrawer() {
    var userSubjects = getUserSubjects();
    var contentTypes = typeOrder.map(function(t) {
      return { value: t, label: getTypePlural(t), icon: typeConfig[t] ? typeConfig[t].icon : '' };
    });

    window.FilterDrawer.openDrawer({
      title: 'Search Filters',
      filters: [
        {
          id: 'contentType',
          label: 'Content Type',
          type: 'checkbox',
          options: contentTypes,
          value: filterState.contentType.slice()
        },
        {
          id: 'class',
          label: 'Class',
          type: 'checkbox',
          options: [
            { value: '9', label: 'Class 9' },
            { value: '10', label: 'Class 10' },
            { value: '11', label: 'Class 11' },
            { value: '12', label: 'Class 12' },
            { value: 'college', label: 'College' }
          ],
          value: filterState.class.slice()
        },
        {
          id: 'subject',
          label: 'Subject',
          type: 'checkbox',
          options: userSubjects.map(function(s) { return { value: s.id, label: s.name }; }),
          value: filterState.subject.slice()
        },
        {
          id: 'date',
          label: 'Date',
          type: 'radio',
          options: [
            { value: 'any', label: 'Any' },
            { value: 'today', label: 'Today' },
            { value: 'week', label: 'This Week' },
            { value: 'month', label: 'This Month' },
            { value: 'year', label: 'This Year' }
          ],
          value: filterState.date || 'any'
        },
        {
          id: 'sort',
          label: 'Sort By',
          type: 'radio',
          options: [
            { value: 'relevance', label: 'Relevance' },
            { value: 'newest', label: 'Newest' },
            { value: 'oldest', label: 'Oldest' },
            { value: 'popular', label: 'Most Popular' }
          ],
          value: filterState.sort || 'relevance'
        }
      ],
      onApply: function(allValues) {
        if (allValues.contentType !== undefined) filterState.contentType = allValues.contentType || [];
        if (allValues.class !== undefined) filterState.class = allValues.class || [];
        if (allValues.subject !== undefined) filterState.subject = allValues.subject || [];
        if (allValues.date !== undefined) filterState.date = allValues.date || 'any';
        if (allValues.sort !== undefined) filterState.sort = allValues.sort || 'relevance';

        activeFilterCount = 0;
        if (filterState.contentType.length > 0) activeFilterCount++;
        if (filterState.class.length > 0) activeFilterCount++;
        if (filterState.subject.length > 0) activeFilterCount++;
        if (filterState.date !== 'any') activeFilterCount++;
        if (filterState.sort !== 'relevance') activeFilterCount++;

        renderResults();
      },
      onReset: function() {
        filterState.contentType = [];
        filterState.class = [];
        filterState.subject = [];
        filterState.date = 'any';
        filterState.sort = 'relevance';
        activeFilterCount = 0;
        renderResults();
      }
    });
  }

  window.performSearchFromInput = function() {
    var input = document.getElementById('search-page-input');
    if (input && input.value.trim().length >= 2) {
      performSearch(input.value);
    }
  };

  window.setSearchValue = function(value) {
    var input = document.getElementById('search-page-input');
    if (input) {
      input.value = value;
      input.focus();
      if (value.trim().length >= 2) {
        performSearch(value);
      }
    }
  };

  window.removeHistoryItem = function(item) {
    removeHistoryItem(item);
  };

  window.clearHistory = function() {
    clearHistory();
  };

  window.openFilterDrawer = openFilterDrawer;

  window.navigateToTypePage = navigateToTypePage;

  document.addEventListener('click', function(e) {
    var t = e.target.closest('[data-action^="search:"]');
    if (!t) return;
    var p = t.getAttribute('data-action').split(':');
    var c = p[1], a = p[2], b = p[3];
    if (c === 'nav' && a) { window.location.hash = decodeURIComponent(a); }
    if (c === 'openFilter') { openFilterDrawer(); }
    if (c === 'navigate' && a && b) { navigateToTypePage(a, decodeURIComponent(b)); }
    if (c === 'setVal' && a) { setSearchValue(decodeURIComponent(a)); }
    if (c === 'removeHistory' && a) { removeHistoryItem(decodeURIComponent(a)); }
    if (c === 'clearHistory') { clearHistory(); }
    if (c === 'doSearch') { performSearchFromInput(); }
  });

  render();
};
