window.renderPage = window.renderPage || {};

(function() {
  if (!window._resDelegated) {
    window._resDelegated = true;
    document.addEventListener('click', function(e) {
      var t = e.target.closest('[data-action^="res:"]');
      if (!t) return;
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'SELECT') return;
      var p = t.getAttribute('data-action').split(':');
      var c = p[1], a = p[2], b = p[3];
      if (c === 'preview' && a) { window.renderPage.openPreview(a); }
      else if (c === 'download' && a) { window.renderPage.downloadResource(a); }
      else if (c === 'fav' && a) { window.renderPage.toggleResourceFav(a); }
      else if (c === 'share' && a) { window.renderPage.shareResource(a); }
      else if (c === 'fullscreen') { window.renderPage.previewToggleFullscreen(); }
      else if (c === 'bookmark') { window.renderPage.previewToggleBookmark(); }
      else if (c === 'closePreview') { window.renderPage.previewClose(); }
      else if (c === 'zoomOut') { window.renderPage.previewZoomOut(); }
      else if (c === 'zoomIn') { window.renderPage.previewZoomIn(); }
      else if (c === 'navPrev' && a) { window.renderPage.previewNav(parseInt(a)); }
      else if (c === 'navNext' && a) { window.renderPage.previewNav(parseInt(a)); }
      else if (c === 'setView' && a) { window.renderPage.setView(a); }
      else if (c === 'toggleBookmarkFilter') { window.renderPage.toggleBookmarkFilter(); }
      else if (c === 'openFilter') { window.renderPage.openFilterDrawer(); }
      else if (c === 'clearFilters') { window.renderPage.clearFilters(); }
      else if (c === 'goToPage' && a) { window.renderPage.goToPage(parseInt(a)); }
      else if (c === 'removeChip' && a) {
        if (b) { window.renderPage.removeFilterChip(a, b); }
        else { window.renderPage.removeFilterChip(a); }
      }
      else if (c === 'reload') { location.reload(); }
    });
  }
  var store = window.Store;
  var router = window.Router;
  var api = window.API;
  var utils = window.Utils;
  var mockData = window.mockData;

  var PAGE_SIZE = 20;
  var STYLE_ID = 'resources-page-styles';

  var CATEGORIES = [
    { value: 'pdf', label: 'PDF' },
    { value: 'ppt', label: 'PPT' },
    { value: 'doc', label: 'DOC' },
    { value: 'docx', label: 'DOCX' },
    { value: 'notes', label: 'Essay' },
    { value: 'worksheet', label: 'Worksheet' },
    { value: 'question-bank', label: 'Question Bank' },
    { value: 'reference', label: 'Reference Book' },
    { value: 'textbook', label: 'Textbook' }
  ];

  var LANGUAGES = ['English', 'Hindi', 'Hinglish'];

  var TYPE_ICONS = {
    notes: '\uD83D\uDCDD', pdf: '\uD83D\uDCC4', ppt: '\uD83D\uDCCA',
    doc: '\uD83D\uDCC4', 'question-bank': '\u2753', assignment: '\uD83D\uDCDD',
    reference: '\uD83D\uDCDA', 'previous-paper': '\uD83D\uDCDC',
    cheatsheet: '\uD83D\uDCCA', mindmap: '\uD83E\uDDE0',
    flashcards: '\uD83D\uDD0F', book: '\uD83D\uDCDA',
    worksheet: '\uD83D\uDCCB', 'lab-manual': '\uD83D\uDD2C',
    solution: '\u2705', project: '\uD83D\uDCC1'
  };

  var TYPE_BADGES = {
    notes: 'badge-blue', pdf: 'badge-red', ppt: 'badge-orange',
    doc: 'badge-orange', 'question-bank': 'badge-purple',
    assignment: 'badge-green', reference: 'badge-cyan',
    'previous-paper': 'badge-yellow', cheatsheet: 'badge-pink',
    mindmap: 'badge-blue', flashcards: 'badge-yellow',
    book: 'badge-orange', worksheet: 'badge-green',
    'lab-manual': 'badge-cyan', solution: 'badge-blue',
    project: 'badge-orange'
  };

  var TYPE_DISPLAY = {
    notes: 'Notes', pdf: 'PDF', ppt: 'PPT', doc: 'DOC',
    'question-bank': 'Question Bank', assignment: 'Assignment',
    reference: 'Reference Book', 'previous-paper': 'Previous Paper',
    cheatsheet: 'Cheat Sheet', mindmap: 'Mind Map',
    flashcards: 'Flashcards', worksheet: 'Worksheet',
    book: 'Book', 'lab-manual': 'Lab Manual',
    project: 'Project', solution: 'Solution'
  };

  var TYPE_COLORS = {
    notes: '#3b82f6', pdf: '#ef4444', ppt: '#f97316',
    doc: '#f97316', 'question-bank': '#8b5cf6',
    assignment: '#10b981', reference: '#06b6d4',
    'previous-paper': '#f59e0b', cheatsheet: '#ec4899',
    mindmap: '#3b82f6', flashcards: '#f59e0b',
    book: '#f97316', worksheet: '#10b981',
    'lab-manual': '#06b6d4', solution: '#3b82f6',
    project: '#f97316'
  };

  function es(icon, title, msg) {
    return '<div class="empty-state" style="text-align:center;padding:40px 20px"><div class="empty-state-icon" style="font-size:3rem;margin-bottom:16px">' + icon + '</div><div class="empty-state-title" style="font-size:1.1rem;font-weight:600;color:var(--text-primary);margin-bottom:8px">' + title + '</div><div class="empty-state-text" style="font-size:0.875rem;color:var(--text-secondary)">' + msg + '</div></div>';
  }

  function getTypeIcon(type) { return TYPE_ICONS[type] || '\uD83D\uDCC4'; }
  function getTypeBadge(type) { return TYPE_BADGES[type] || 'badge-blue'; }
  function getTypeLabel(type) { return TYPE_DISPLAY[type] || type || 'Resource'; }
  function getTypeColor(type) { return TYPE_COLORS[type] || '#6b7280'; }

  function getSubjectName(subjectId) {
    if (!subjectId) return '';
    var subjects = mockData.subjects || [];
    for (var i = 0; i < subjects.length; i++) {
      if (subjects[i].id === subjectId) return subjects[i].name;
    }
    return '';
  }

  function getSubjectClass(subjectId) {
    if (!subjectId) return '';
    var subjects = mockData.subjects || [];
    for (var i = 0; i < subjects.length; i++) {
      if (subjects[i].id === subjectId) return subjects[i].class;
    }
    return '';
  }

  function showToast(message, type) {
    if (!type) type = 'info';
    var container = document.querySelector('.toast-container');
    if (!container) {
      container = document.createElement('div');
      container.className = 'toast-container';
      document.body.appendChild(container);
    }
    var toast = document.createElement('div');
    toast.className = 'toast toast-' + type;
    var icons = { success: '\u2713', error: '\u2715', info: '\u2139', warning: '\u26A0' };
    toast.innerHTML = '<span>' + (icons[type] || '\u2139') + '</span><span>' + message + '</span>';
    container.appendChild(toast);
    setTimeout(function() {
      if (toast.parentNode) toast.remove();
    }, 3000);
  }

  function getBookmarks() { return store.get('resourceBookmarks') || []; }

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
      showToast('Removed from bookmarks', 'info');
    } else {
      bms.push(id);
      showToast('Bookmarked!', 'success');
    }
    store.set('resourceBookmarks', bms);
  }

  function trackRecentResource(item) {
    if (!item) return;
    var recent = store.get('recentResources') || [];
    for (var i = 0; i < recent.length; i++) {
      if (recent[i].id === item.id) { recent.splice(i, 1); break; }
    }
    recent.unshift({ id: item.id, title: item.title, type: item.type, size: item.size || '', subjectId: item.subjectId, timestamp: Date.now() });
    if (recent.length > 20) recent = recent.slice(0, 20);
    store.set('recentResources', recent);
  }

  function getUserSubjects() {
    var user = store.get('user');
    var userClass = user ? user.class : null;
    var userStream = user ? user.stream : null;
    if (!userClass) return mockData.subjects || [];
    var subjects = mockData.subjects || [];
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

  function renderStars(rating) {
    var r = parseFloat(rating || 0);
    var count = Math.round(r);
    var html = '';
    for (var i = 0; i < 5; i++) {
      if (i < count) {
        html += '<span style="color:#f59e0b;font-size:12px">\u2605</span>';
      } else {
        html += '<span style="color:#374151;font-size:12px">\u2605</span>';
      }
    }
    return html;
  }

  function parseSizeMB(sizeStr) {
    if (!sizeStr) return 0;
    var val = parseFloat(sizeStr);
    return isNaN(val) ? 0 : val;
  }

  var filterState = {
    search: '',
    categories: [],
    subjects: [],
    languages: [],
    rating: '',
    paidType: '',
    size: { min: '', max: '' },
    sort: 'newest',
    view: 'grid',
    bookmarks: false,
    page: 1
  };

  function getActiveFilterCount() {
    var count = 0;
    if (filterState.search && filterState.search.trim()) count++;
    if (filterState.categories && filterState.categories.length > 0) count += filterState.categories.length;
    if (filterState.subjects && filterState.subjects.length > 0) count += filterState.subjects.length;
    if (filterState.languages && filterState.languages.length > 0) count += filterState.languages.length;
    if (filterState.rating && filterState.rating !== '') count++;
    if (filterState.paidType && filterState.paidType !== '') count++;
    if ((filterState.size && filterState.size.min !== '' && filterState.size.min !== undefined && filterState.size.min !== null) || (filterState.size && filterState.size.max !== '' && filterState.size.max !== undefined && filterState.size.max !== null)) count++;
    return count;
  }

  function getRatingLabel(val) {
    if (String(val) === '4') return '4+';
    if (String(val) === '3') return '3+';
    if (String(val) === '2') return '2+';
    return '';
  }

  function getFilteredResources(filters) {
    var all = mockData.resources || [];
    var user = store.get('user');
    var userClass = user ? user.class : null;
    var userStream = user ? user.stream : null;

    if (!userClass) return all;

    var subjects = mockData.subjects || [];
    var allowedSubjNames = [];
    if (userClass >= 1 && userClass <= 10) {
      allowedSubjNames = utils.classSubjects[userClass] || [];
    } else if (userClass >= 11 && userClass <= 12) {
      if (userStream && utils.streamSubjects[userStream] && utils.streamSubjects[userStream][userClass]) {
        allowedSubjNames = utils.streamSubjects[userStream][userClass];
      } else {
        allowedSubjNames = utils.classSubjects[userClass] || [];
      }
    }

    var allowedSubjectIds = {};
    var hasSubjects = false;
    for (var i = 0; i < subjects.length; i++) {
      var s = subjects[i];
      if (s.class == userClass) {
        hasSubjects = true;
        if (userClass >= 11 && userClass <= 12 && userStream && s.stream && s.stream !== userStream) continue;
        if (allowedSubjNames.length === 0 || allowedSubjNames.indexOf(s.name) !== -1) {
          allowedSubjectIds[s.id] = true;
        }
      }
    }

    if (!hasSubjects || Object.keys(allowedSubjectIds).length === 0) return all;

    var items = all.filter(function(r) {
      return r.subjectId && allowedSubjectIds[r.subjectId];
    });

    if (!filters) return items;

    if (filters.categories && filters.categories.length > 0) {
      items = items.filter(function(r) {
        return filters.categories.indexOf(r.type) !== -1;
      });
    }

    if (filters.subjects && filters.subjects.length > 0) {
      items = items.filter(function(r) {
        return filters.subjects.indexOf(r.subjectId) !== -1;
      });
    }

    if (filters.languages && filters.languages.length > 0) {
      items = items.filter(function(r) {
        return r.language && filters.languages.indexOf(r.language) !== -1;
      });
    }

    if (filters.paidType === 'free') {
      items = items.filter(function(r) { return r.isFree !== false; });
    } else if (filters.paidType === 'premium') {
      items = items.filter(function(r) { return r.isFree === false; });
    }

    if (filters.rating) {
      var minRating = parseFloat(filters.rating);
      if (!isNaN(minRating)) {
        items = items.filter(function(r) { return parseFloat(r.rating || 0) >= minRating; });
      }
    }

    if (filters.size) {
      var sizeMin = filters.size.min;
      var sizeMax = filters.size.max;
      if (sizeMin !== '' && sizeMin !== undefined && sizeMin !== null) {
        var sMin = parseFloat(sizeMin);
        if (!isNaN(sMin)) {
          items = items.filter(function(r) { return parseSizeMB(r.size) >= sMin; });
        }
      }
      if (sizeMax !== '' && sizeMax !== undefined && sizeMax !== null) {
        var sMax = parseFloat(sizeMax);
        if (!isNaN(sMax)) {
          items = items.filter(function(r) { return parseSizeMB(r.size) <= sMax; });
        }
      }
    }

    if (filters.search && filters.search.trim()) {
      var sq = filters.search.toLowerCase().trim();
      items = items.filter(function(r) {
        return (r.title && r.title.toLowerCase().indexOf(sq) !== -1) ||
               (r.description && r.description.toLowerCase().indexOf(sq) !== -1);
      });
    }

    if (filters.sort) {
      if (filters.sort === 'name') {
        items.sort(function(a, b) { return a.title.localeCompare(b.title); });
      } else if (filters.sort === 'downloads') {
        items.sort(function(a, b) { return (b.downloads || 0) - (a.downloads || 0); });
      } else if (filters.sort === 'date' || filters.sort === 'newest') {
        items.sort(function(a, b) { return (b.dateAdded || '').localeCompare(a.dateAdded || ''); });
      } else if (filters.sort === 'popular') {
        items.sort(function(a, b) { return (b.downloads || 0) - (a.downloads || 0); });
      } else if (filters.sort === 'rating') {
        items.sort(function(a, b) { return parseFloat(b.rating || 0) - parseFloat(a.rating || 0); });
      } else if (filters.sort === 'size') {
        items.sort(function(a, b) { return parseSizeMB(b.size) - parseSizeMB(a.size); });
      }
    }

    if (filters.bookmarks) {
      var curBms = getBookmarks();
      items = items.filter(function(r) { return curBms.indexOf(r.id) > -1; });
    }

    return items;
  }

  function injectStyles() {
    if (document.getElementById(STYLE_ID)) return;
    var style = document.createElement('style');
    style.id = STYLE_ID;
    style.textContent = [
      '.resources-grid{display:grid;grid-template-columns:repeat(4,1fr);gap:var(--space-4)}',
      '@media(max-width:1200px){.resources-grid{grid-template-columns:repeat(3,1fr)}}',
      '@media(max-width:768px){.resources-grid{grid-template-columns:repeat(2,1fr)}}',
      '@media(max-width:480px){.resources-grid{grid-template-columns:1fr}}',
      '.resource-card{background:var(--bg-card);border:1px solid var(--border-color);border-radius:var(--radius-lg);padding:var(--space-4);cursor:pointer;transition:all var(--transition-base);display:flex;flex-direction:column;gap:var(--space-2)}',
      '.resource-card:hover{background:var(--bg-glass);border-color:var(--border-hover);transform:translateY(-2px);box-shadow:var(--shadow-md)}',
      '.resource-card-icon{width:100%;height:80px;border-radius:var(--radius-md);display:flex;align-items:center;justify-content:center;font-size:2.5rem;background:linear-gradient(135deg,rgba(59,130,246,0.12),rgba(139,92,246,0.12));margin-bottom:var(--space-1)}',
      '.resource-card-title{font-size:var(--text-sm);font-weight:600;color:var(--text-primary);line-height:1.3;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden}',
      '.resource-card-subtitle{font-size:var(--text-xs);color:var(--text-tertiary)}',
      '.resource-card-meta{display:flex;align-items:center;gap:var(--space-2);flex-wrap:wrap;font-size:var(--text-xs);color:var(--text-secondary)}',
      '.resource-card-footer{display:flex;align-items:center;justify-content:space-between;margin-top:auto;padding-top:var(--space-2);border-top:1px solid var(--border-light)}',
      '.resource-card-stats{display:flex;align-items:center;gap:var(--space-3);font-size:var(--text-xs);color:var(--text-secondary)}',
      '.resource-card-actions{display:flex;align-items:center;gap:var(--space-1)}',
      '.resource-card .btn-icon{width:28px;height:28px;border:none;background:transparent;color:var(--text-tertiary);border-radius:var(--radius-sm);cursor:pointer;display:flex;align-items:center;justify-content:center;font-size:14px;transition:all var(--transition-fast)}',
      '.resource-card .btn-icon:hover{background:var(--bg-glass);color:var(--text-primary)}',
      '.resource-card .btn-icon.active{color:var(--accent-yellow)}',
      '.filter-chips{display:flex;flex-wrap:wrap;gap:var(--space-2);margin-bottom:var(--space-4)}',
      '.filter-chip{display:inline-flex;align-items:center;gap:var(--space-1);padding:4px 10px;background:var(--gradient-glass);border:1px solid var(--border-accent);border-radius:var(--radius-full);font-size:var(--text-xs);color:var(--accent-blue)}',
      '.filter-chip-label{max-width:160px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}',
      '.filter-chip-remove{background:none;border:none;color:var(--accent-blue);cursor:pointer;font-size:10px;padding:0 2px;opacity:0.7;line-height:1}',
      '.filter-chip-remove:hover{opacity:1}',
      '.recent-scroll{display:flex;gap:var(--space-3);overflow-x:auto;padding-bottom:var(--space-2);margin-bottom:var(--space-6);scrollbar-width:thin}',
      '.recent-scroll::-webkit-scrollbar{height:4px}',
      '.recent-scroll::-webkit-scrollbar-thumb{background:var(--text-muted);border-radius:4px}',
      '.recent-card{flex-shrink:0;width:120px;background:var(--bg-card);border:1px solid var(--border-color);border-radius:var(--radius-md);cursor:pointer;transition:all var(--transition-fast);overflow:hidden}',
      '.recent-card:hover{background:var(--bg-glass);border-color:var(--border-hover);transform:translateY(-1px)}',
      '.recent-card-bg{height:56px;display:flex;align-items:center;justify-content:center;font-size:1.5rem}',
      '.recent-card-body{padding:var(--space-2)}',
      '.recent-card-title{font-size:var(--text-xs);font-weight:600;color:var(--text-primary);white-space:nowrap;overflow:hidden;text-overflow:ellipsis}',
      '.view-toggle{display:flex;border:1px solid var(--border-color);border-radius:var(--radius-sm);overflow:hidden}',
      '.view-toggle-btn{padding:6px 10px;border:none;background:transparent;color:var(--text-tertiary);cursor:pointer;font-size:14px;transition:all var(--transition-fast)}',
      '.view-toggle-btn:hover{background:var(--bg-glass);color:var(--text-primary)}',
      '.view-toggle-btn.active{background:var(--gradient-primary);color:#fff}',
      '.resources-table-wrap{overflow-x:auto;border:1px solid var(--border-color);border-radius:var(--radius-lg)}',
      '.resources-table{width:100%;border-collapse:collapse;font-size:var(--text-sm)}',
      '.resources-table th{padding:var(--space-3) var(--space-4);text-align:left;font-weight:600;color:var(--text-secondary);background:var(--bg-tertiary);border-bottom:1px solid var(--border-color);white-space:nowrap;font-size:var(--text-xs)}',
      '.resources-table td{padding:var(--space-3) var(--space-4);border-bottom:1px solid var(--border-light);color:var(--text-primary);vertical-align:middle}',
      '.resources-table tr:hover td{background:var(--bg-glass)}',
      '.resources-table .td-icon{font-size:1.25rem}',
      '.resources-table .td-title{font-weight:600}',
      '.resources-table .td-actions{display:flex;gap:var(--space-1)}',
      '.preview-overlay{position:fixed;top:0;left:0;right:0;bottom:0;background:rgba(0,0,0,0.7);z-index:9500;opacity:0;visibility:hidden;transition:opacity 0.3s,visibility 0.3s}',
      '.preview-overlay.open{opacity:1;visibility:visible}',
      '.preview-drawer{position:fixed;top:0;right:-720px;width:700px;max-width:100vw;height:100%;background:var(--bg-secondary);border-left:1px solid var(--border-color);z-index:9501;display:flex;flex-direction:column;transition:right 0.35s cubic-bezier(0.4,0,0.2,1);box-shadow:var(--shadow-xl)}',
      '.preview-overlay.open .preview-drawer{right:0}',
      '.preview-header{display:flex;align-items:center;justify-content:space-between;padding:var(--space-4) var(--space-6);border-bottom:1px solid var(--border-color);flex-shrink:0}',
      '.preview-header-title{font-size:var(--text-lg);font-weight:600;color:var(--text-primary);white-space:nowrap;overflow:hidden;text-overflow:ellipsis;margin-right:var(--space-4);flex:1}',
      '.preview-header-actions{display:flex;align-items:center;gap:var(--space-1);flex-shrink:0}',
      '.preview-body{flex:1;overflow-y:auto;padding:var(--space-6)}',
      '.preview-body::-webkit-scrollbar{width:4px}',
      '.preview-body::-webkit-scrollbar-thumb{background:var(--text-muted);border-radius:4px}',
      '.preview-area{background:linear-gradient(135deg,#1e293b,#0f172a);border-radius:var(--radius-lg);padding:var(--space-10);display:flex;flex-direction:column;align-items:center;justify-content:center;min-height:280px;border:1px solid var(--border-color);position:relative;overflow:hidden}',
      '.preview-area-icon{font-size:4rem;margin-bottom:var(--space-4)}',
      '.preview-area-title{font-size:var(--text-xl);font-weight:700;color:var(--text-primary);text-align:center;margin-bottom:var(--space-2)}',
      '.preview-area-subtitle{font-size:var(--text-sm);color:var(--text-tertiary);text-align:center}',
      '.preview-controls{display:flex;align-items:center;justify-content:center;gap:var(--space-4);padding:var(--space-4) 0;border-bottom:1px solid var(--border-light);margin-bottom:var(--space-6)}',
      '.preview-zoom{display:flex;align-items:center;gap:var(--space-2)}',
      '.preview-zoom-btn{width:32px;height:32px;border:1px solid var(--border-color);background:var(--bg-tertiary);color:var(--text-secondary);border-radius:var(--radius-sm);cursor:pointer;display:flex;align-items:center;justify-content:center;font-size:14px;transition:all var(--transition-fast)}',
      '.preview-zoom-btn:hover{background:var(--bg-glass);color:var(--text-primary)}',
      '.preview-zoom-label{font-size:var(--text-sm);color:var(--text-secondary);min-width:40px;text-align:center}',
      '.preview-nav{display:flex;align-items:center;gap:var(--space-2)}',
      '.preview-nav-btn{width:32px;height:32px;border:1px solid var(--border-color);background:var(--bg-tertiary);color:var(--text-secondary);border-radius:var(--radius-sm);cursor:pointer;display:flex;align-items:center;justify-content:center;font-size:12px;transition:all var(--transition-fast)}',
      '.preview-nav-btn:hover:not(:disabled){background:var(--bg-glass);color:var(--text-primary)}',
      '.preview-nav-btn:disabled{opacity:0.3;cursor:not-allowed}',
      '.preview-nav-label{font-size:var(--text-sm);color:var(--text-secondary);min-width:90px;text-align:center}',
      '.preview-info{display:grid;grid-template-columns:1fr 1fr;gap:var(--space-3);margin-bottom:var(--space-6)}',
      '.preview-info-item{display:flex;flex-direction:column;gap:2px}',
      '.preview-info-label{font-size:var(--text-xs);color:var(--text-tertiary);text-transform:uppercase;letter-spacing:0.5px}',
      '.preview-info-value{font-size:var(--text-sm);color:var(--text-primary);font-weight:500}',
      '.preview-desc{font-size:var(--text-sm);color:var(--text-secondary);line-height:1.6;margin-bottom:var(--space-6)}',
      '.preview-related-title{font-size:var(--text-sm);font-weight:600;color:var(--text-primary);margin-bottom:var(--space-3)}',
      '.preview-related-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(180px,1fr));gap:var(--space-3)}',
      '.preview-related-card{background:var(--bg-card);border:1px solid var(--border-color);border-radius:var(--radius-md);padding:var(--space-3);cursor:pointer;transition:all var(--transition-fast)}',
      '.preview-related-card:hover{background:var(--bg-glass);border-color:var(--border-hover)}',
      '.preview-related-card-icon{font-size:1.25rem;margin-bottom:var(--space-1)}',
      '.preview-related-card-title{font-size:var(--text-xs);font-weight:600;color:var(--text-primary);white-space:nowrap;overflow:hidden;text-overflow:ellipsis}',
      '.preview-related-card-meta{font-size:var(--text-xs);color:var(--text-tertiary)}',
      '.filter-count-badge{position:absolute;top:-4px;right:-4px;width:18px;height:18px;border-radius:50%;background:var(--accent-red);color:#fff;font-size:10px;font-weight:700;display:flex;align-items:center;justify-content:center}',
      '.resource-card-skeleton .skeleton-pulse{background:linear-gradient(90deg,var(--bg-card) 25%,var(--bg-glass) 50%,var(--bg-card) 75%);background-size:200% 100%;animation:skeleton-shimmer 1.5s infinite}',
      '@keyframes skeleton-shimmer{0%{background-position:200% 0}100%{background-position:-200% 0}}',
      '.res-header-row{display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:var(--space-3)}',
      '.res-search-wrap{position:relative;flex:1;min-width:180px;max-width:400px}',
      '.res-search-wrap .res-search-icon{position:absolute;left:12px;top:50%;transform:translateY(-50%);color:var(--text-tertiary);pointer-events:none;font-size:14px}',
      '.res-search-wrap input{width:100%;padding:0.625rem 0.75rem 0.625rem 2.25rem}',
      '.res-right-actions{display:flex;align-items:center;gap:var(--space-2);flex-wrap:wrap}',
      '.header-strip{display:flex;align-items:center;gap:var(--space-3);margin-bottom:var(--space-4);flex-wrap:wrap}',
      '@media(max-width:640px){.preview-drawer{width:100vw;right:-100vw}}'
    ].join('\n');
    document.head.appendChild(style);
  }

  function renderSkeletonCards(count) {
    if (!count) count = 8;
    var html = '';
    for (var sk = 0; sk < count; sk++) {
      html += '<div class="resource-card resource-card-skeleton">' +
        '<div class="resource-card-icon skeleton-pulse"></div>' +
        '<div class="skeleton-text skeleton-text-lg" style="height:14px;width:80%"></div>' +
        '<div class="skeleton-text" style="width:60%;height:10px"></div>' +
        '<div class="resource-card-footer" style="margin-top:8px">' +
        '<div class="skeleton-text" style="width:50%;height:10px"></div>' +
        '<div class="skeleton-text" style="width:30%;height:10px"></div>' +
        '</div></div>';
    }
    return html;
  }

  function renderSkeleton() {
    return '<div class="page-container page-container-inner"><div class="resources-grid">' + renderSkeletonCards(8) + '</div></div>';
  }

  function renderFilterChips() {
    var html = '';
    if (filterState.search && filterState.search.trim()) {
      html += '<span class="filter-chip"><span class="filter-chip-label">Search: &quot;' + utils.sanitizeHTML(filterState.search) + '&quot;</span>' +
        '<button class="filter-chip-remove" data-action="res:removeChip:search" title="Remove">\u2715</button></span>';
    }
    if (filterState.categories) {
      for (var ci = 0; ci < filterState.categories.length; ci++) {
        var catVal = filterState.categories[ci];
        var catLabel = catVal;
        for (var cxi = 0; cxi < CATEGORIES.length; cxi++) {
          if (CATEGORIES[cxi].value === catVal) { catLabel = CATEGORIES[cxi].label; break; }
        }
        html += '<span class="filter-chip"><span class="filter-chip-label">' + utils.sanitizeHTML(catLabel) + '</span>' +
          '<button class="filter-chip-remove" data-action="res:removeChip:categories:' + catVal.replace(/'/g, "\\'") + '" title="Remove">\u2715</button></span>';
      }
    }
    if (filterState.subjects) {
      for (var si = 0; si < filterState.subjects.length; si++) {
        var subId = filterState.subjects[si];
        var subName = getSubjectName(subId) || subId;
        html += '<span class="filter-chip"><span class="filter-chip-label">' + utils.sanitizeHTML(subName) + '</span>' +
          '<button class="filter-chip-remove" data-action="res:removeChip:subjects:' + subId.replace(/'/g, "\\'") + '" title="Remove">\u2715</button></span>';
      }
    }
    if (filterState.languages) {
      for (var li = 0; li < filterState.languages.length; li++) {
        var langVal = filterState.languages[li];
        html += '<span class="filter-chip"><span class="filter-chip-label">' + utils.sanitizeHTML(langVal) + '</span>' +
          '<button class="filter-chip-remove" data-action="res:removeChip:languages:' + langVal.replace(/'/g, "\\'") + '" title="Remove">\u2715</button></span>';
      }
    }
    if (filterState.rating && filterState.rating !== '') {
      var ratingLabel = getRatingLabel(filterState.rating);
      html += '<span class="filter-chip"><span class="filter-chip-label">Rating: ' + ratingLabel + '</span>' +
        '<button class="filter-chip-remove" data-action="res:removeChip:rating" title="Remove">\u2715</button></span>';
    }
    if (filterState.paidType && filterState.paidType !== '') {
      var typeLabel = filterState.paidType === 'free' ? 'Free' : 'Premium';
      html += '<span class="filter-chip"><span class="filter-chip-label">Type: ' + typeLabel + '</span>' +
        '<button class="filter-chip-remove" data-action="res:removeChip:paidType" title="Remove">\u2715</button></span>';
    }
    if (filterState.size) {
      if (filterState.size.min !== '' && filterState.size.min !== undefined && filterState.size.min !== null) {
        html += '<span class="filter-chip"><span class="filter-chip-label">Size &ge; ' + filterState.size.min + ' MB</span>' +
          '<button class="filter-chip-remove" data-action="res:removeChip:sizeMin" title="Remove">\u2715</button></span>';
      }
      if (filterState.size.max !== '' && filterState.size.max !== undefined && filterState.size.max !== null) {
        html += '<span class="filter-chip"><span class="filter-chip-label">Size &le; ' + filterState.size.max + ' MB</span>' +
          '<button class="filter-chip-remove" data-action="res:removeChip:sizeMax" title="Remove">\u2715</button></span>';
      }
    }
    if (html) {
      html = '<div class="filter-chips">' + html + '</div>';
    }
    return html;
  }

  function renderResourceCard(resource) {
    var isBm = isBookmarked(resource.id);
    var subjName = getSubjectName(resource.subjectId);
    var subjClass = getSubjectClass(resource.subjectId);
    var typeColor = getTypeColor(resource.type);
    var typeLabel = getTypeLabel(resource.type);
    var classStr = subjClass ? 'Class ' + subjClass : '';
    var resId = 'RES-' + resource.id.toUpperCase();
    var lessonName = '';
    if (resource.chapterId) {
      var chs = mockData.chapters || {};
      for (var sid in chs) {
        var arr = chs[sid];
        for (var ci = 0; ci < arr.length; ci++) {
          if (arr[ci].id === resource.chapterId) { lessonName = arr[ci].name; break; }
        }
        if (lessonName) break;
      }
    }
    var actionBtns = '<div class="resource-card-actions">' +
      '<button class="btn-icon" data-action="res:preview:' + resource.id + '" title="Preview">\uD83D\uDCC4</button>' +
      '<button class="btn-icon" data-action="res:download:' + resource.id + '" title="Download">\u2B07</button>' +
      '<button class="btn-icon ' + (isBm ? 'active' : '') + '" data-action="res:fav:' + resource.id + '" title="' + (isBm ? 'Bookmarked' : 'Bookmark') + '">' + (isBm ? '\u2B50' : '\u2606') + '</button>' +
      '<button class="btn-icon" data-action="res:share:' + resource.id + '" title="Share">\uD83D\uDD17</button>' +
      '<button class="btn-icon" data-action="res:preview:' + resource.id + '" title="View" style="color:var(--accent-blue)">\uD83D\uDCF1</button>' +
      '</div>';
    return '<div class="resource-card">' +
      '<div class="resource-card-icon" style="background:linear-gradient(135deg,' + typeColor + '22,' + typeColor + '44)">' + getTypeIcon(resource.type) + '</div>' +
      '<div style="font-size:10px;color:var(--text-tertiary);margin-bottom:2px">' + resId + '</div>' +
      '<div class="resource-card-title">' + utils.sanitizeHTML(utils.truncate(resource.title, 50)) + '</div>' +
      '<div class="resource-card-subtitle">' + (subjName ? utils.sanitizeHTML(subjName) : '') + (subjName && classStr ? ' &bull; ' : '') + (classStr ? classStr : '') + '</div>' +
      '<div class="resource-card-meta">' +
      '<span class="badge ' + getTypeBadge(resource.type) + '" style="font-size:10px">' + typeLabel + '</span>' +
      '<span>' + (resource.pages || '?') + ' pages</span>' +
      '</div>' +
      '<div class="resource-card-subtitle c-fs-xs">' + (lessonName ? utils.sanitizeHTML(lessonName) : '') + '</div>' +
      '<div class="resource-card-footer">' + actionBtns + '</div>' +
      '</div>';
  }

  function renderResourceRow(resource) {
    var isBm = isBookmarked(resource.id);
    var subjName = getSubjectName(resource.subjectId);
    var typeLabel = getTypeLabel(resource.type);
    var resId = 'RES-' + resource.id.toUpperCase();
    var lessonName = '';
    if (resource.chapterId) {
      var chs = mockData.chapters || {};
      for (var sid in chs) {
        var arr = chs[sid];
        for (var ci = 0; ci < arr.length; ci++) {
          if (arr[ci].id === resource.chapterId) { lessonName = arr[ci].name; break; }
        }
        if (lessonName) break;
      }
    }
    return '<tr>' +
      '<td class="td-icon">' + getTypeIcon(resource.type) + '</td>' +
      '<td><div class="td-title">' + utils.sanitizeHTML(utils.truncate(resource.title, 35)) + '</div><div style="font-size:var(--text-xs);color:var(--text-tertiary)">' + resId + '</div></td>' +
      '<td><span class="badge ' + getTypeBadge(resource.type) + '" style="font-size:10px">' + typeLabel + '</span></td>' +
      '<td>' + utils.sanitizeHTML(subjName) + '</td>' +
      '<td>' + utils.sanitizeHTML(utils.truncate(lessonName, 20)) + '</td>' +
      '<td>' + (resource.pages || '?') + '</td>' +
      '<td><div class="td-actions">' +
      '<button class="btn btn-ghost btn-sm" style="font-size:11px;padding:4px 8px" data-action="res:preview:' + resource.id + '">Preview</button>' +
      '<button class="btn btn-ghost btn-sm" style="font-size:11px;padding:4px 8px" data-action="res:download:' + resource.id + '">\u2B07</button>' +
      '<button class="btn btn-ghost btn-sm" style="font-size:11px;padding:4px 8px" data-action="res:fav:' + resource.id + '">' + (isBm ? '\u2B50' : '\u2606') + '</button>' +
      '<button class="btn btn-ghost btn-sm" style="font-size:11px;padding:4px 8px" data-action="res:share:' + resource.id + '">\uD83D\uDD17</button>' +
      '<button class="btn btn-ghost btn-sm" style="font-size:11px;padding:4px 8px;color:var(--accent-blue)" data-action="res:preview:' + resource.id + '">View</button>' +
      '</div></td>' +
      '</tr>';
  }

  function openFilterDrawer() {
    var userSubjects = getUserSubjects();
    var chapterOpts = [];
    var chs = mockData.chapters || {};
    for (var sid in chs) {
      for (var ci = 0; ci < chs[sid].length; ci++) {
        chapterOpts.push({ value: chs[sid][ci].id, label: chs[sid][ci].name });
      }
    }
    window.FilterDrawer.openDrawer({
      title: 'Filter Resources',
      filters: [
        {
          id: 'search', label: 'Search', type: 'search',
          value: filterState.search || '',
          placeholder: 'Search resources...'
        },
        {
          id: 'category', label: 'File Type', type: 'checkbox',
          options: CATEGORIES.map(function(c) { return { value: c.value, label: c.label }; }),
          value: filterState.categories && filterState.categories.length > 0 ? filterState.categories.slice() : []
        },
        {
          id: 'subject', label: 'Subject', type: 'checkbox',
          options: userSubjects.map(function(s) { return { value: s.id, label: s.name }; }),
          value: filterState.subjects && filterState.subjects.length > 0 ? filterState.subjects.slice() : []
        },
        {
          id: 'chapter', label: 'Chapter', type: 'checkbox',
          options: chapterOpts,
          value: []
        }
      ],
      onApply: function(allValues) {
        if (allValues.search !== undefined) filterState.search = allValues.search || '';
        if (allValues.category !== undefined) filterState.categories = allValues.category || [];
        if (allValues.subject !== undefined) filterState.subjects = allValues.subject || [];
        filterState.page = 1;
        window.renderPage.resources(router.getParams());
      },
      onReset: function() {
        filterState.search = '';
        filterState.categories = [];
        filterState.subjects = [];
        filterState.page = 1;
        var searchInput = document.querySelector('.res-search-input');
        if (searchInput) searchInput.value = '';
        window.renderPage.resources(router.getParams());
      }
    });
  }

  window.renderPage.openFilterDrawer = openFilterDrawer;

  window.renderPage.removeFilterChip = function(type, value) {
    if (type === 'search') {
      filterState.search = '';
      var searchInput = document.querySelector('.res-search-input');
      if (searchInput) searchInput.value = '';
    } else if (type === 'categories') {
      if (filterState.categories) {
        var ci = filterState.categories.indexOf(value);
        if (ci !== -1) filterState.categories.splice(ci, 1);
      }
    } else if (type === 'subjects') {
      if (filterState.subjects) {
        var si = filterState.subjects.indexOf(value);
        if (si !== -1) filterState.subjects.splice(si, 1);
      }
    } else if (type === 'languages') {
      if (filterState.languages) {
        var li = filterState.languages.indexOf(value);
        if (li !== -1) filterState.languages.splice(li, 1);
      }
    } else if (type === 'rating') {
      filterState.rating = '';
    } else if (type === 'paidType') {
      filterState.paidType = '';
    } else if (type === 'sizeMin') {
      if (filterState.size) filterState.size.min = '';
    } else if (type === 'sizeMax') {
      if (filterState.size) filterState.size.max = '';
    }
    filterState.page = 1;
    window.renderPage.resources(router.getParams());
  };

  window.renderPage.updateFilter = function(key, value) {
    filterState[key] = value;
    filterState.page = 1;
    window.renderPage.resources(router.getParams());
  };

  window.renderPage.clearFilters = function() {
    filterState.search = '';
    filterState.categories = [];
    filterState.subjects = [];
    filterState.languages = [];
    filterState.paidType = '';
    filterState.rating = '';
    filterState.size = { min: '', max: '' };
    filterState.sort = filterState.sort || 'newest';
    filterState.view = filterState.view || 'grid';
    filterState.bookmarks = false;
    filterState.page = 1;
    var searchInput = document.querySelector('.res-search-input');
    if (searchInput) searchInput.value = '';
    window.renderPage.resources(router.getParams());
  };

  window.renderPage.downloadResource = function(id) {
    var items = mockData.resources || [];
    var item = null;
    for (var i = 0; i < items.length; i++) {
      if (items[i].id === id) { item = items[i]; break; }
    }
    trackRecentResource(item);
    var title = item ? item.title : 'Resource';
    var resId = 'RES-' + id.toUpperCase();
    showToast('Dowloading ' + title + '...', 'success');
    var dl = store.get('downloads') || [];
    dl.push({
      id: id, title: title, type: item ? item.type : 'pdf',
      size: item ? item.size : '0 MB', date: new Date().toISOString(),
      status: 'downloaded', progress: 100
    });
    store.set('downloads', dl);
  };

  function _renderReaderPageContent(item, pageNum, totalPages) {
    var typeColor = getTypeColor(item.type);
    var resId = 'RES-' + item.id.toUpperCase();
    var subjName = getSubjectName(item.subjectId);
    var subjClass = getSubjectClass(item.subjectId);
    var lines = [];
    var content = item.description || item.title;
    var words = content.split(' ');
    var lineLen = 0;
    var currentLine = '';
    for (var wi = 0; wi < words.length; wi++) {
      currentLine += words[wi] + ' ';
      lineLen += words[wi].length + 1;
      if (lineLen > 50) { lines.push(currentLine.trim()); currentLine = ''; lineLen = 0; }
    }
    if (currentLine) lines.push(currentLine.trim());
    if (lines.length < 8) {
      for (var li = lines.length; li < 10; li++) lines.push('________________________________________________________________________________');
    }
    var pageLines = [];
    var linesPerPage = 10;
    var totalPagesCalc = Math.max(1, Math.ceil(lines.length / linesPerPage));
    var startLine = (pageNum - 1) * linesPerPage;
    var endLine = Math.min(startLine + linesPerPage, lines.length);
    for (var pli = startLine; pli < endLine; pli++) pageLines.push(lines[pli]);
    return '<div class="ncert-reader-page" style="background:#fff8f0;border-radius:8px;padding:2rem;min-height:400px;position:relative;box-shadow:0 2px 12px rgba(0,0,0,0.1)">\
      <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:1rem;padding-bottom:0.5rem;border-bottom:2px solid #e0d5c7">\
        <div style="font-size:0.75rem;color:#8b7355;font-weight:600">' + resId + '</div>\
        <div style="font-size:0.75rem;color:#8b7355">Page ' + Math.min(pageNum, totalPagesCalc) + ' of ' + totalPagesCalc + '</div>\
      </div>\
      <div style="font-family:Georgia,serif;font-size:1rem;line-height:1.8;color:#3d2b1f">' + (pageLines.length > 0 ? pageLines.join('<br>') : '<em style="color:#8b7355">No content available for preview.</em>') + '</div>\
      <div style="position:absolute;bottom:1rem;left:2rem;right:2rem;display:flex;justify-content:space-between;font-size:0.7rem;color:#8b7355">\
        <span>' + utils.sanitizeHTML(subjName) + (subjClass ? ', Class ' + subjClass : '') + '</span>\
        <span>' + getTypeLabel(item.type) + '</span>\
      </div>\
    </div>';
  }

  window.renderPage.openPreview = function(id) {
    var items = mockData.resources || [];
    var item = null;
    for (var i = 0; i < items.length; i++) {
      if (items[i].id === id) { item = items[i]; break; }
    }
    if (!item) return;
    trackRecentResource(item);

    var allItems = getFilteredResources(filterState);
    var currentIdx = -1;
    for (var j = 0; j < allItems.length; j++) {
      if (allItems[j].id === id) { currentIdx = j; break; }
    }

    var subjName = getSubjectName(item.subjectId);
    var subjClass = getSubjectClass(item.subjectId);
    var typeColor = getTypeColor(item.type);
    var isBm = isBookmarked(item.id);
    var resId = 'RES-' + item.id.toUpperCase();

    var overlay = document.createElement('div');
    overlay.className = 'preview-overlay';
    overlay.id = 'preview-overlay';

    var lessonName = '';
    if (item.chapterId) {
      var chs = mockData.chapters || {};
      for (var sid in chs) {
        var arr = chs[sid];
        for (var ci = 0; ci < arr.length; ci++) {
          if (arr[ci].id === item.chapterId) { lessonName = arr[ci].name; break; }
        }
        if (lessonName) break;
      }
    }

    var readerPage = _renderReaderPageContent(item, 1);

    overlay.innerHTML = '\
<div class="preview-drawer" id="preview-drawer" style="width:100%;max-width:900px;right:-900px">\
  <div class="preview-header">\
    <div class="preview-header-title">' + utils.sanitizeHTML(utils.truncate(item.title, 50)) + '</div>\
    <div class="preview-header-actions">\
      <span style="font-size:0.7rem;color:var(--text-tertiary);margin-right:0.5rem">' + resId + '</span>\
      <button class="btn btn-ghost btn-sm preview-btn" data-action="res:bookmark" title="Bookmark" id="preview-bm-btn">' + (isBm ? '\u2B50' : '\u2606') + '</button>\
      <button class="btn btn-ghost btn-sm preview-btn" data-action="res:share:' + item.id + '" title="Share">\uD83D\uDD17</button>\
      <button class="btn btn-ghost btn-sm preview-btn" data-action="res:closePreview" title="Close">\u2715</button>\
    </div>\
  </div>\
  <div class="preview-body">\
    <div style="display:flex;flex-wrap:wrap;gap:1rem;margin-bottom:1rem">\
      <div style="flex:1;min-width:120px"><span style="font-size:0.7rem;color:var(--text-tertiary);text-transform:uppercase">Title</span><div style="font-size:0.875rem;font-weight:600;color:var(--text-primary)">' + utils.sanitizeHTML(item.title) + '</div></div>\
      <div style="min-width:80px"><span style="font-size:0.7rem;color:var(--text-tertiary);text-transform:uppercase">Type</span><div><span class="badge ' + getTypeBadge(item.type) + '">' + getTypeLabel(item.type) + '</span></div></div>\
      <div style="min-width:80px"><span style="font-size:0.7rem;color:var(--text-tertiary);text-transform:uppercase">Subject</span><div style="font-size:0.875rem;color:var(--text-primary)">' + utils.sanitizeHTML(subjName || '-') + '</div></div>\
      <div style="min-width:80px"><span style="font-size:0.7rem;color:var(--text-tertiary);text-transform:uppercase">Lesson</span><div style="font-size:0.875rem;color:var(--text-primary)">' + utils.sanitizeHTML(lessonName || '-') + '</div></div>\
      <div style="min-width:60px"><span style="font-size:0.7rem;color:var(--text-tertiary);text-transform:uppercase">Pages</span><div style="font-size:0.875rem;color:var(--text-primary)">' + (item.pages || '?') + '</div></div>\
    </div>\
    <div class="preview-controls" style="justify-content:space-between">\
      <div class="preview-zoom">\
        <button class="preview-zoom-btn" data-action="res:zoomOut" title="Zoom Out">-</button>\
        <span class="preview-zoom-label" id="preview-zoom-label">100%</span>\
        <button class="preview-zoom-btn" data-action="res:zoomIn" title="Zoom In">+</button>\
      </div>\
      <div class="preview-nav">\
        <button class="preview-nav-btn" data-action="res:navPrev:-1" id="preview-prev-btn"' + (currentIdx <= 0 ? ' disabled' : '') + '>\u2039</button>\
        <span class="preview-nav-label" id="preview-nav-label">' + (currentIdx + 1) + ' of ' + allItems.length + '</span>\
        <button class="preview-nav-btn" data-action="res:navNext:1" id="preview-next-btn"' + (currentIdx >= allItems.length - 1 ? ' disabled' : '') + '>\u203A</button>\
      </div>\
      <button class="btn btn-primary btn-sm" data-action="res:download:' + item.id + '">\u2B07 Download</button>\
    </div>\
    <div id="ncert-reader-area">' + readerPage + '</div>\
  </div>\
</div>';
    document.body.appendChild(overlay);

    window._previewState = { items: allItems, currentIdx: currentIdx, readerPage: 1 };

    overlay.addEventListener('click', function(e) {
      if (e.target === overlay) window.renderPage.previewClose();
    });

    document.addEventListener('keydown', previewKeyHandler);

    requestAnimationFrame(function() {
      overlay.classList.add('open');
    });
  };

  function previewKeyHandler(e) {
    if (e.key === 'Escape') { window.renderPage.previewClose(); }
    else if (e.key === 'ArrowLeft') { window.renderPage.previewNav(-1); }
    else if (e.key === 'ArrowRight') { window.renderPage.previewNav(1); }
  }

  window.renderPage.previewClose = function() {
    var overlay = document.getElementById('preview-overlay');
    if (overlay) {
      overlay.classList.remove('open');
      document.removeEventListener('keydown', previewKeyHandler);
      setTimeout(function() { if (overlay.parentNode) overlay.remove(); }, 350);
    }
    window._previewState = null;
  };

  window.renderPage.previewNav = function(dir) {
    if (!window._previewState) return;
    var state = window._previewState;
    var newIdx = state.currentIdx + dir;
    if (newIdx < 0 || newIdx >= state.items.length) return;
    state.currentIdx = newIdx;
    var overlay = document.getElementById('preview-overlay');
    if (overlay) overlay.remove();
    document.removeEventListener('keydown', previewKeyHandler);
    window.renderPage.openPreview(state.items[newIdx].id);
  };

  window.renderPage.previewZoomIn = function() {
    if (!window._previewState) return;
    var label = document.getElementById('preview-zoom-label');
    if (!label) return;
    var current = parseInt(label.textContent) || 100;
    var newZoom = Math.min(200, current + 10);
    label.textContent = newZoom + '%';
    var area = document.getElementById('ncert-reader-area');
    if (area) area.style.transform = 'scale(' + (newZoom / 100) + ')';
    window._previewState.zoom = newZoom;
  };

  window.renderPage.previewZoomOut = function() {
    if (!window._previewState) return;
    var label = document.getElementById('preview-zoom-label');
    if (!label) return;
    var current = parseInt(label.textContent) || 100;
    var newZoom = Math.max(50, current - 10);
    label.textContent = newZoom + '%';
    var area = document.getElementById('ncert-reader-area');
    if (area) area.style.transform = 'scale(' + (newZoom / 100) + ')';
    window._previewState.zoom = newZoom;
  };

  window.renderPage.previewToggleFullscreen = function() {
    var drawer = document.getElementById('preview-drawer');
    if (!drawer) return;
    var overlay = document.getElementById('preview-overlay');
    if (!overlay) return;
  };

  window.renderPage.previewToggleBookmark = function() {
    if (!window._previewState) return;
    var state = window._previewState;
    var item = state.items[state.currentIdx];
    if (!item) return;
    toggleBookmark(item.id);
    var btn = document.getElementById('preview-bm-btn');
    if (btn) btn.textContent = isBookmarked(item.id) ? '\u2B50' : '\u2606';
  };

  window.renderPage.shareResource = function(id) {
    var items = mockData.resources || [];
    var item = null;
    for (var i = 0; i < items.length; i++) {
      if (items[i].id === id) { item = items[i]; break; }
    }
    var title = item ? item.title : 'Resource';
    if (navigator.share) {
      navigator.share({ title: title, text: 'Check out this resource: ' + title, url: window.location.href });
    } else {
      utils.copyToClipboard(window.location.href);
      showToast('Link copied to clipboard!', 'success');
    }
  };

  window.renderPage.toggleResourceFav = function(id) {
    toggleBookmark(id);
    window.renderPage.resources(router.getParams());
  };

  window.renderPage.goToPage = function(p) {
    filterState.page = p;
    window.renderPage.resources(router.getParams());
  };

  window.renderPage.toggleBookmarkFilter = function() {
    filterState.bookmarks = !filterState.bookmarks;
    filterState.page = 1;
    window.renderPage.resources(router.getParams());
  };

  window.renderPage.setView = function(view) {
    filterState.view = view;
    window.renderPage.resources(router.getParams());
  };

  window.renderPage.resources = function(params) {
    var mainContent = document.getElementById('main-content');
    if (!mainContent) return;

    injectStyles();
    mainContent.innerHTML = renderSkeleton();

    setTimeout(function() {
      try {
      var user = store.get('user');
      if (params && params.bookmarks === 'true') filterState.bookmarks = true;
      else if (params && params.bookmarks === 'false') filterState.bookmarks = false;
      if (params && params.type) {
        filterState.categories = [params.type];
      }
      if (params && params.search) {
        filterState.search = params.search;
      }

      store.set('_currentResourcePage', 'resources');

      var allItems = getFilteredResources(filterState);

      var total = allItems.length;
      var page = filterState.page || 1;
      if (params && params.page) page = parseInt(params.page) || 1;
      filterState.page = page;
      var totalPages = Math.ceil(total / PAGE_SIZE);
      if (page > totalPages && totalPages > 0) page = totalPages;
      filterState.page = page;
      var start = (page - 1) * PAGE_SIZE;
      var end = Math.min(start + PAGE_SIZE, total);
      var pageItems = allItems.slice(start, end);

      var recentlyOpened = store.get('recentResources') || [];
      var recentFiltered = [];
      for (var ro = 0; ro < recentlyOpened.length; ro++) {
        if (recentFiltered.length >= 8) break;
        var roId = recentlyOpened[ro].id;
        var found = false;
        for (var ai = 0; ai < allItems.length; ai++) {
          if (allItems[ai].id === roId) { found = true; break; }
        }
        if (found) recentFiltered.push(recentlyOpened[ro]);
      }

      var classInfo = '';
      if (user && user.class) {
        classInfo = 'Class ' + user.class;
        if (user.stream) classInfo += ' - ' + user.stream.charAt(0).toUpperCase() + user.stream.slice(1);
      }

      var filterCount = getActiveFilterCount();
      var sortOptions = [
        { value: 'newest', label: 'Newest' },
        { value: 'popular', label: 'Popular' },
        { value: 'name', label: 'Name' },
        { value: 'size', label: 'Size' },
        { value: 'downloads', label: 'Downloads' },
        { value: 'rating', label: 'Rating' }
      ];
      var sortHtml = '';
      for (var so = 0; so < sortOptions.length; so++) {
        var opt = sortOptions[so];
        sortHtml += '<option value="' + opt.value + '"' + ((filterState.sort || 'newest') === opt.value ? ' selected' : '') + '>' + opt.label + '</option>';
      }

      var viewGridActive = (filterState.view || 'grid') === 'grid' ? ' active' : '';
      var viewListActive = (filterState.view || 'grid') === 'list' ? ' active' : '';

      var html = '<div class="page-container page-container-inner">' +
        '<div class="page-header">' +
        '<div><h1 class="page-title">Resource Center</h1>' +
        '<p class="page-subtitle">' + (classInfo ? utils.sanitizeHTML(classInfo) + ' &mdash; Study materials tailored for you' : 'Study materials, notes, worksheets and more') + '</p></div>' +
        '</div>' +

        '<div class="header-strip">' +
        '<div class="res-search-wrap">' +
        '<span class="res-search-icon">\uD83D\uDD0D</span>' +
        '<input type="text" class="input-field res-search-input" placeholder="Search notes, PDFs, textbooks..." value="' + utils.sanitizeHTML(filterState.search || '') + '"' +
        ' onkeydown="if(event.key===\'Enter\'){window.renderPage.updateFilter(\'search\',this.value)}">' +
        '</div>' +
        '<div class="res-right-actions">' +
        '<select class="input-field" style="width:auto;min-width:130px;padding:0.5rem 2rem 0.5rem 0.75rem" onchange="window.renderPage.updateFilter(\'sort\',this.value)"><option value="">Sort</option>' + sortHtml + '</select>' +
        '<div class="view-toggle">' +
        '<button class="view-toggle-btn' + viewGridActive + '" data-action="res:setView:grid" title="Grid View">\u25A6</button>' +
        '<button class="view-toggle-btn' + viewListActive + '" data-action="res:setView:list" title="List View">\u2630</button>' +
        '</div>' +
        '<button class="btn btn-ghost btn-sm ' + (filterState.bookmarks ? 'active' : '') + '" data-action="res:toggleBookmarkFilter" title="Bookmarked only" style="font-size:16px">\u2B50</button>' +
        '<button class="btn btn-secondary btn-sm" data-action="res:openFilter" style="position:relative">\uD83D\uDD0D Filters' +
        (filterCount > 0 ? '<span class="filter-count-badge">' + filterCount + '</span>' : '') +
        '</button>' +
        (filterCount > 0 ? '<button class="btn btn-ghost btn-sm" data-action="res:clearFilters" title="Clear filters">\u21BA</button>' : '') +
        '</div>' +
        '</div>' +

        renderFilterChips();

      var currentBms = getBookmarks();
      var bookmarkedItems = [];
      for (var bfi = 0; bfi < allItems.length; bfi++) {
        if (currentBms.indexOf(allItems[bfi].id) !== -1) bookmarkedItems.push(allItems[bfi]);
      }

      /* Recommended (random subset) */
      if (page <= 1 && !filterState.bookmarks && !filterState.search && filterState.categories.length === 0 && filterState.subjects.length === 0) {
        var recommended = allItems.slice().sort(function(){return 0.5-Math.random();}).slice(0, 8);
        html += '<div class="section-header" style="margin-bottom:var(--space-2)"><h2 class="section-title">\uD83D\uDCA1 Recommended</h2></div>';
        html += '<div class="recent-scroll" style="margin-bottom:var(--space-4)">';
        for (var rri2 = 0; rri2 < recommended.length; rri2++) {
          var roItem = recommended[rri2];
          var roGradient = utils.getGradient(rri2);
          html += '<div class="recent-card" data-action="res:preview:' + roItem.id + '">' +
            '<div class="recent-card-bg" style="background:' + roGradient + '">' + getTypeIcon(roItem.type) + '</div>' +
            '<div class="recent-card-body">' +
            '<div class="recent-card-title">' + utils.sanitizeHTML(utils.truncate(roItem.title, 18)) + '</div>' +
            '<div style="font-size:10px;color:var(--text-tertiary)">' + (roItem.size || '') + '</div>' +
            '</div></div>';
        }
        html += '</div>';

        html += '<div class="section-header" style="margin-bottom:var(--space-2)"><h2 class="section-title">\uD83D\uDD0D Recently Viewed</h2></div>';
        if (recentFiltered.length > 0) {
          html += '<div class="recent-scroll" style="margin-bottom:var(--space-4)">';
          for (var rri3 = 0; rri3 < recentFiltered.length; rri3++) {
            var roItem2 = recentFiltered[rri3];
            var roGradient2 = utils.getGradient(rri3 + 10);
            html += '<div class="recent-card" data-action="res:preview:' + roItem2.id + '">' +
              '<div class="recent-card-bg" style="background:' + roGradient2 + '">' + getTypeIcon(roItem2.type) + '</div>' +
              '<div class="recent-card-body">' +
              '<div class="recent-card-title">' + utils.sanitizeHTML(utils.truncate(roItem2.title, 18)) + '</div>' +
              '<div style="font-size:10px;color:var(--text-tertiary)">' + (roItem2.size || '') + '</div>' +
              '</div></div>';
          }
          html += '</div>';
        } else {
          html += '<div class="c-fs-sm c-text-tertiary c-mb-4">Recently viewed resources will appear here.</div>';
        }

        if (bookmarkedItems.length > 0) {
          html += '<div class="section-header" style="margin-bottom:var(--space-2)"><h2 class="section-title">\u2B50 Bookmarks</h2></div>';
          html += '<div class="recent-scroll" style="margin-bottom:var(--space-4)">';
          for (var bki = 0; bki < Math.min(bookmarkedItems.length, 8); bki++) {
            var bkItem = bookmarkedItems[bki];
            var bkGradient = utils.getGradient(bki + 20);
            html += '<div class="recent-card" data-action="res:preview:' + bkItem.id + '">' +
              '<div class="recent-card-bg" style="background:' + bkGradient + '">' + getTypeIcon(bkItem.type) + '</div>' +
              '<div class="recent-card-body">' +
              '<div class="recent-card-title">' + utils.sanitizeHTML(utils.truncate(bkItem.title, 18)) + '</div>' +
              '<div style="font-size:10px;color:var(--text-tertiary)">' + (bkItem.size || '') + '</div>' +
              '</div></div>';
          }
          html += '</div>';
        }
      }

      if (filterState.search) {
        html += '<div class="section-header" style="margin-top:var(--space-2)"><h2 class="section-title">\uD83D\uDD0D Search Results</h2></div>';
      } else {
        html += '<div class="section-header" style="margin-top:var(--space-2)">' +
          '<h2 class="section-title">' + (filterState.bookmarks ? '\u2B50 Bookmarked Resources' : 'All Resources') + '</h2>' +
          '</div>';
      }

      html += '<span class="c-fs-xs c-text-tertiary c-mb-3" style="display:block">Showing ' + pageItems.length + ' of ' + total + ' resource' + (total !== 1 ? 's' : '') + '</span>';

      if (pageItems.length === 0) {
        html += '<div class="empty-state">' +
          '<div class="empty-state-icon">\uD83D\uDCC4</div>' +
          '<div class="empty-state-title">No resources found</div>' +
          '<div class="empty-state-text">Try adjusting your search query or filters.</div>' +
          '<button class="btn btn-primary btn-sm" data-action="res:clearFilters">Clear Filters</button>' +
          '</div>';
      } else if ((filterState.view || 'grid') === 'grid') {
        html += '<div class="resources-grid">';
        for (var gi = 0; gi < pageItems.length; gi++) {
          html += renderResourceCard(pageItems[gi]);
        }
        html += '</div>';
      } else {
        html += '<div class="resources-table-wrap">' +
          '<table class="resources-table">' +
          '<thead><tr>' +
          '<th></th><th>Title</th><th>Type</th><th>Subject</th><th>Lesson</th><th>Pages</th><th>Actions</th>' +
          '</tr></thead><tbody>';
        for (var li = 0; li < pageItems.length; li++) {
          html += renderResourceRow(pageItems[li]);
        }
        html += '</tbody></table></div>';
      }

      if (totalPages > 1) {
        var pageNumbers = [];
        if (totalPages <= 7) {
          for (var pn = 1; pn <= totalPages; pn++) pageNumbers.push(pn);
        } else {
          pageNumbers.push(1);
          var startPage = Math.max(2, page - 1);
          var endPage = Math.min(totalPages - 1, page + 1);
          if (startPage > 2) pageNumbers.push('...');
          for (var pn2 = startPage; pn2 <= endPage; pn2++) pageNumbers.push(pn2);
          if (endPage < totalPages - 1) pageNumbers.push('...');
          pageNumbers.push(totalPages);
        }

        html += '<div class="pagination">' +
          '<button class="page-btn prev-next" data-action="res:goToPage:' + (page - 1) + '" ' + (page <= 1 ? 'disabled' : '') + '>\u2039 Previous</button>' +
          '<div class="page-numbers">';
        for (var pi = 0; pi < pageNumbers.length; pi++) {
          var pnVal = pageNumbers[pi];
          if (pnVal === '...') {
            html += '<span class="page-dots">...</span>';
          } else {
            html += '<button class="page-btn' + (pnVal === page ? ' active' : '') + '" data-action="res:goToPage:' + pnVal + '">' + pnVal + '</button>';
          }
        }
        html += '</div>' +
          '<button class="page-btn prev-next" data-action="res:goToPage:' + (page + 1) + '" ' + (page >= totalPages ? 'disabled' : '') + '>Next \u203A</button>' +
          '</div>';
      }

      html += '</div>';
      mainContent.innerHTML = html;
      mainContent.style.opacity = '0';
      mainContent.style.transition = 'opacity 0.3s ease';
      setTimeout(function() { mainContent.style.opacity = '1'; }, 50);
      } catch (e) {
        mainContent.innerHTML = '<div class="page-container"><div class="empty-state"><div class="empty-state-icon">\u26A0\uFE0F</div><h2 class="empty-state-title">Something went wrong</h2><p class="empty-state-text">Try refreshing the page</p><button class="btn btn-primary" data-action="res:reload">Retry</button></div></div>';
      }
    }, 300);
  };
})();
