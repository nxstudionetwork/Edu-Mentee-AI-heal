window.renderPage = window.renderPage || {};

(function() {
  if (!window._dlDelegated) {
    window._dlDelegated = true;
    document.addEventListener('click', function(e) {
      var t = e.target.closest('[data-action^="dl:"]');
      if (!t) return;
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'SELECT') return;
      var p = t.getAttribute('data-action').split(':');
      var c = p[1], a = p[2], b = p[3];
      if (c === 'open' && a) { window.renderPage.openDownload(a); }
      else if (c === 'share' && a) { window.renderPage.shareDownload(a); }
      else if (c === 'delete' && a) { window.renderPage.deleteDownload(a); }
      else if (c === 'historyPage' && a) { window.renderPage.changeHistoryPage(parseInt(a)); }
      else if (c === 'clearRecent') { window.renderPage.clearRecent(); }
      else if (c === 'clearHistory') { window.renderPage.clearHistory(); }
      else   if (c === 'goto' && a === 'resources') { location.hash = '#/resources'; }
      else if (c === 'confirmOk') { var co = t.closest('.modal-overlay'); if (co && co._onConfirm) { co._onConfirm(); } if (co) co.remove(); }
      else if (c === 'confirmCancel') { var co2 = t.closest('.modal-overlay'); if (co2) co2.remove(); }
      else if (c === 'filter') { var p = router.getParams(); if (p) { p.filter = t.getAttribute('data-filter'); window.renderPage.downloads(p); } }
    });
  }
  var store = window.Store;
  var router = window.Router;
  var api = window.API;
  var utils = window.Utils;
  var mockData = window.mockData;

  var FILTER_CHIPS = [
    { value: 'all', label: 'All' },
    { value: 'notes', label: 'Notes' },
    { value: 'pdf', label: 'PDFs' },
    { value: 'video', label: 'Videos' },
    { value: 'book', label: 'Books' },
    { value: 'resource', label: 'Resources' }
  ];

  var SORT_OPTIONS = [
    { value: 'newest', label: 'Newest' },
    { value: 'name', label: 'Name' },
    { value: 'size', label: 'Size' },
    { value: 'type', label: 'Type' }
  ];

  var TYPE_LABELS = {
    notes: 'Notes',
    pdf: 'PDF',
    video: 'Video',
    book: 'Book',
    resource: 'Resource'
  };

  var TYPE_ICONS = {
    notes: '📝',
    pdf: '📄',
    video: '🎬',
    book: '📚',
    resource: '📦'
  };

  var SUBJECTS = ['Mathematics', 'Physics', 'Chemistry', 'Biology', 'English', 'History', 'Geography', 'Computer Science', 'Economics', 'Political Science'];
  var CLASSES = ['Class 10', 'Class 11', 'Class 12'];
  var CHANNELS = ['EduMentee Academy', 'LearnHub', 'StudyMate Pro', 'Apex Learning', 'Bright Minds'];
  var AUTHORS = ['Dr. A. Sharma', 'Prof. M. Gupta', 'Dr. R. Patel', 'S. Kumar', 'P. Singh', 'N. Verma', 'K. Joshi'];
  var QUALITIES = ['1080p', '720p', '480p'];
  var DURATIONS = ['12:34', '45:20', '1:02:15', '28:45', '55:10', '8:30', '1:15:40', '22:18', '38:52', '1:30:00'];

  var BOOK_TITLES = [
    { title: 'Advanced Mathematics', author: 'Dr. A. Sharma', pages: 620 },
    { title: 'Fundamentals of Physics', author: 'Prof. M. Gupta', pages: 780 },
    { title: 'Organic Chemistry Guide', author: 'Dr. R. Patel', pages: 540 },
    { title: 'Molecular Biology', author: 'S. Kumar', pages: 490 },
    { title: 'English Grammar & Composition', author: 'P. Singh', pages: 350 },
    { title: 'World History Encyclopedia', author: 'N. Verma', pages: 810 },
    { title: 'Physical Geography', author: 'K. Joshi', pages: 440 },
    { title: 'Computer Science: Principles', author: 'Dr. A. Sharma', pages: 560 }
  ];

  var NOTE_TITLES = [
    'Chapter 5: Quadratic Equations',
    'Revision Notes - Periodic Table',
    'Cell Division & Genetics',
    'Chemical Bonding Summary',
    'The Renaissance Period',
    'Newton\'s Laws of Motion',
    'Organic Chemistry Reactions',
    'World War II Notes',
    'Trigonometry Formulas',
    'Thermodynamics Notes'
  ];

  var PDF_TITLES = [
    'NCERT Mathematics Textbook',
    'Physics Lab Manual',
    'Chemistry Formula Sheet',
    'Biology Diagrams Collection',
    'English Literature Guide',
    'History Timeline Chart',
    'Geography Maps Collection',
    'CS Python Reference Guide'
  ];

  var VIDEO_TITLES = [
    'Lecture 12: Integration by Parts',
    'Understanding DNA Replication',
    'Chemical Equilibrium Explained',
    'The French Revolution - Documentary',
    'Calculus Made Easy',
    'Photosynthesis in Plants',
    'Newton\'s Laws - Problem Solving',
    'English Essay Writing Tips',
    'Electromagnetic Induction',
    'Organic Chemistry - Nomenclature'
  ];

  var RESOURCE_TITLES = [
    'Practice Problems - Algebra',
    'Lab Report Template',
    'Study Planner 2026',
    'Mind Map - Ecosystem',
    'Flashcards - Periodic Table',
    'Project Guide - Solar System',
    'Worksheet - Quadratic Equations',
    'Reference Chart - Trigonometric Functions'
  ];

  function rand(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  function randDate(daysBack) {
    var d = new Date();
    d.setDate(d.getDate() - rand(0, daysBack));
    return d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0');
  }

  function randSize() {
    var sizeMB = rand(1, 500);
    if (sizeMB >= 1024) {
      return (sizeMB / 1024).toFixed(1) + ' GB';
    }
    return sizeMB + ' MB';
  }

  function pick(arr) {
    return arr[rand(0, arr.length - 1)];
  }

  function generateMockDownloads() {
    var existing = store.get('downloads');
    if (existing && existing.length > 0) {
      return existing;
    }

    var downloads = [];
    var id = 1;
    var i;

    for (i = 0; i < NOTE_TITLES.length; i++) {
      downloads.push({
        id: 'd' + (id++),
        title: NOTE_TITLES[i],
        type: 'notes',
        subject: pick(SUBJECTS),
        class: pick(CLASSES),
        size: randSize(),
        date: randDate(30),
        status: 'completed',
        bookmarked: Math.random() > 0.7
      });
    }

    for (i = 0; i < PDF_TITLES.length; i++) {
      downloads.push({
        id: 'd' + (id++),
        title: PDF_TITLES[i],
        type: 'pdf',
        subject: pick(SUBJECTS),
        class: pick(CLASSES),
        size: randSize(),
        date: randDate(30),
        status: 'completed',
        bookmarked: Math.random() > 0.7
      });
    }

    for (i = 0; i < VIDEO_TITLES.length; i++) {
      downloads.push({
        id: 'd' + (id++),
        title: VIDEO_TITLES[i],
        type: 'video',
        duration: pick(DURATIONS),
        channel: pick(CHANNELS),
        quality: pick(QUALITIES),
        size: randSize(),
        date: randDate(30),
        status: 'completed',
        bookmarked: Math.random() > 0.7
      });
    }

    for (i = 0; i < BOOK_TITLES.length; i++) {
      downloads.push({
        id: 'd' + (id++),
        title: BOOK_TITLES[i].title,
        author: BOOK_TITLES[i].author,
        pages: BOOK_TITLES[i].pages,
        type: 'book',
        size: randSize(),
        date: randDate(30),
        status: 'completed',
        bookmarked: Math.random() > 0.7
      });
    }

    for (i = 0; i < RESOURCE_TITLES.length; i++) {
      downloads.push({
        id: 'd' + (id++),
        title: RESOURCE_TITLES[i],
        type: 'resource',
        subject: pick(SUBJECTS),
        size: randSize(),
        date: randDate(30),
        status: 'completed',
        bookmarked: Math.random() > 0.7
      });
    }

    store.set('downloads', downloads);
    return downloads;
  }

  function formatDate(dateStr) {
    if (!dateStr) return '';
    var d = new Date(dateStr);
    var months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    return d.getDate() + ' ' + months[d.getMonth()] + ' ' + d.getFullYear();
  }

  function formatSize(size) {
    return size || '0 MB';
  }

  function getTypeIcon(type) {
    return TYPE_ICONS[type] || '📄';
  }

  function getTypeLabel(type) {
    return TYPE_LABELS[type] || 'File';
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
    var icons = { success: '✓', error: '✕', info: 'ℹ', warning: '⚠' };
    toast.innerHTML = '<span>' + (icons[type] || 'ℹ') + '</span><span>' + message + '</span>';
    container.appendChild(toast);
    setTimeout(function() {
      if (toast.parentNode) toast.remove();
    }, 3000);
  }

  function sanitize(str) {
    if (!str) return '';
    return String(str).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;');
  }

  function confirmDialog(message, onConfirm) {
    var overlay = document.createElement('div');
    overlay.className = 'modal-overlay';
    overlay.innerHTML = '\
<div class="modal" style="max-width:400px;text-align:center">\
  <h3 style="margin-bottom:var(--space-4)">' + sanitize(message) + '</h3>\
  <div class="flex items-center gap-3" style="justify-content:center">\
    <button class="btn btn-secondary" data-action="dl:confirmCancel">Cancel</button>\
    <button class="btn btn-primary" data-action="dl:confirmOk" style="background:var(--accent-red);border-color:var(--accent-red)">Delete</button>\
  </div>\
</div>';
    document.body.appendChild(overlay);
    overlay._onConfirm = onConfirm;
  }

  function copyToClipboard(text) {
    var ta = document.createElement('textarea');
    ta.value = text;
    ta.style.position = 'fixed';
    ta.style.left = '-9999px';
    document.body.appendChild(ta);
    ta.select();
    try {
      var ok = document.execCommand('copy');
      document.body.removeChild(ta);
      return ok;
    } catch (e) {
      document.body.removeChild(ta);
      return false;
    }
  }

  function es(icon, title, msg) {
    return '<div class="empty-state" style="text-align:center;padding:40px 20px"><div class="empty-state-icon" style="font-size:3rem;margin-bottom:16px">' + icon + '</div><div class="empty-state-title" style="font-size:1.1rem;font-weight:600;color:var(--text-primary);margin-bottom:8px">' + title + '</div><div class="empty-state-text" style="font-size:0.875rem;color:var(--text-secondary)">' + msg + '</div></div>';
  }

  function renderStorageBar() {
    var usedGB = 2.4;
    var totalGB = 10;
    var pct = (usedGB / totalGB) * 100;
    var blocks = Math.round(pct / 5);
    var bar = '';
    var i;
    for (i = 0; i < 20; i++) {
      bar += i < blocks ? '█' : '░';
    }
    return '\
<div class="card" style="padding:var(--space-4);margin-bottom:var(--space-6)">\
  <div class="flex items-center justify-between" style="margin-bottom:var(--space-2)">\
    <span class="text-sm font-semibold">Storage</span>\
    <span class="text-xs text-secondary">' + usedGB + ' GB of ' + totalGB + ' GB used</span>\
  </div>\
  <div style="font-family:monospace;font-size:1.1rem;letter-spacing:2px;color:var(--accent-primary)">' + bar + ' <span class="text-xs text-secondary">' + Math.round(pct) + '%</span></div>\
</div>';
  }

  function renderSearchSortBar(searchVal, sortVal, filterVal) {
    var i;
    var sortOpts = '';
    for (i = 0; i < SORT_OPTIONS.length; i++) {
      sortOpts += '<option value="' + SORT_OPTIONS[i].value + '"' + (SORT_OPTIONS[i].value === sortVal ? ' selected' : '') + '>' + SORT_OPTIONS[i].label + '</option>';
    }
    var chips = '';
    for (i = 0; i < FILTER_CHIPS.length; i++) {
      chips += '\
<span class="chip' + (FILTER_CHIPS[i].value === filterVal ? ' chip-active' : '') + '" data-filter="' + FILTER_CHIPS[i].value + '">' + FILTER_CHIPS[i].label + '</span>';
    }
    return '\
<div style="margin-bottom:var(--space-5)">\
  <div class="flex items-center gap-3" style="margin-bottom:var(--space-3)">\
    <div class="input-group" style="flex:1">\
      <span class="input-icon">🔍</span>\
      <input type="text" class="input" id="download-search" placeholder="Search downloads..." value="' + sanitize(searchVal) + '">\
    </div>\
    <select class="input" id="download-sort" style="width:auto">' + sortOpts + '</select>\
  </div>\
  <div class="flex items-center gap-2 flex-wrap" id="download-filters">' + chips + '</div>\
</div>';
  }

  function renderEmptyState(icon, title, subtitle, actionBtn) {
    var btnHtml = '';
    if (actionBtn) {
      btnHtml = '<button class="btn btn-primary" data-action="dl:goto:resources">' + sanitize(actionBtn) + '</button>';
    }
    return '\
<div class="empty-state">\
  <div class="empty-state-icon">' + icon + '</div>\
  <h3 class="empty-state-title">' + sanitize(title) + '</h3>' +
  (subtitle ? '<p class="text-sm text-secondary" style="margin-bottom:var(--space-3)">' + sanitize(subtitle) + '</p>' : '') + '\
  ' + btnHtml + '\
</div>';
  }

  function renderDownloadCard(item) {
    var icon = getTypeIcon(item.type);
    var date = formatDate(item.date);
    var openBtn = '<button class="btn btn-ghost btn-sm" data-action="dl:open:' + item.id + '" title="Open">📂</button>';
    var shareBtn = '<button class="btn btn-ghost btn-sm" data-action="dl:share:' + item.id + '" title="Share">🔗</button>';
    var deleteBtn = '<button class="btn btn-ghost btn-sm" data-action="dl:delete:' + item.id + '" title="Delete" style="color:var(--accent-red)">🗑️</button>';

    var metaParts = [];
    if (item.type === 'notes' || item.type === 'pdf' || item.type === 'resource') {
      if (item.subject) metaParts.push('<span class="text-xs text-secondary">' + sanitize(item.subject) + '</span>');
      if (item.class) metaParts.push('<span class="text-xs text-secondary">' + sanitize(item.class) + '</span>');
    }
    if (item.type === 'video') {
      if (item.channel) metaParts.push('<span class="text-xs text-secondary">' + sanitize(item.channel) + '</span>');
      if (item.quality) metaParts.push('<span class="badge badge-green" style="font-size:0.65rem">' + sanitize(item.quality) + '</span>');
    }
    if (item.type === 'book') {
      if (item.author) metaParts.push('<span class="text-xs text-secondary">' + sanitize(item.author) + '</span>');
      if (item.pages) metaParts.push('<span class="text-xs text-secondary">' + item.pages + ' pages</span>');
    }
    metaParts.push('<span class="text-xs text-secondary">' + formatSize(item.size) + '</span>');

    var thumbnailHtml;
    if (item.type === 'video') {
      thumbnailHtml = '\
<div style="width:100%;aspect-ratio:16/9;background:linear-gradient(135deg,var(--bg-glass),var(--bg-elevated));border-radius:var(--radius-md) var(--radius-md) 0 0;display:flex;align-items:center;justify-content:center;font-size:2.5rem;position:relative">\
  🎬\
  <span class="badge" style="position:absolute;bottom:var(--space-2);right:var(--space-2);background:rgba(0,0,0,0.7);color:#fff;font-size:0.7rem">' + (item.duration || '') + '</span>\
</div>';
    } else {
      thumbnailHtml = '\
<div style="display:flex;align-items:center;justify-content:center;font-size:2.5rem;padding:var(--space-5) 0;background:linear-gradient(135deg,var(--bg-glass),var(--bg-elevated));border-radius:var(--radius-md) var(--radius-md) 0 0">' + icon + '</div>';
    }

    return '\
<div class="card download-card" style="overflow:hidden">\
  ' + thumbnailHtml + '\
  <div style="padding:var(--space-3)">\
    <h4 class="font-semibold text-sm" style="margin-bottom:var(--space-1);overflow:hidden;text-overflow:ellipsis;white-space:nowrap" title="' + sanitize(item.title) + '">' + sanitize(item.title) + '</h4>\
    <div class="c-fs-xs c-text-tertiary c-mb-1">ID: DL-' + item.id + '</div>\
    <div class="flex items-center gap-2 flex-wrap" style="margin-bottom:var(--space-2)">' + metaParts.join('') + '</div>\
    <div class="flex items-center justify-between">\
      <span class="text-xs text-secondary">' + date + '</span>\
      <div class="flex items-center gap-1">' + openBtn + shareBtn + deleteBtn + '</div>\
    </div>\
  </div>\
</div>';
  }

  function renderMiniCard(item) {
    var icon = getTypeIcon(item.type);
    var typeLabel = getTypeLabel(item.type);
    var openBtn = '<button class="btn btn-ghost btn-xs" data-action="dl:open:' + item.id + '" title="Open">📂</button>';
    var shareBtn = '<button class="btn btn-ghost btn-xs" data-action="dl:share:' + item.id + '" title="Share">🔗</button>';
    return '\
<div class="card mini-card" style="min-width:180px;max-width:180px;padding:var(--space-3);flex-shrink:0">\
  <div style="display:flex;align-items:center;gap:var(--space-2);margin-bottom:var(--space-2)">\
    <span style="font-size:1.5rem">' + icon + '</span>\
    <span class="badge badge-blue" style="font-size:0.65rem">' + typeLabel + '</span>\
  </div>\
  <h5 class="font-semibold text-sm" style="margin-bottom:var(--space-1);overflow:hidden;text-overflow:ellipsis;white-space:nowrap" title="' + sanitize(item.title) + '">' + sanitize(item.title) + '</h5>\
  <div class="text-xs text-secondary" style="margin-bottom:var(--space-2)">' + formatDate(item.date) + ' · ' + formatSize(item.size) + '</div>\
  <div class="flex items-center gap-1">' + openBtn + shareBtn + '</div>\
</div>';
  }

  function renderHistoryRow(item) {
    var statusClass = item.status === 'completed' ? 'badge-green' : 'badge-red';
    var statusLabel = item.status === 'completed' ? 'Completed' : 'Failed';
    return '\
<tr>\
  <td class="text-sm" style="padding:var(--space-2) var(--space-3)">' + formatDate(item.date) + '</td>\
  <td class="text-sm font-semibold" style="padding:var(--space-2) var(--space-3)">' + sanitize(item.title) + '</td>\
  <td style="padding:var(--space-2) var(--space-3)"><span class="badge badge-blue">' + getTypeLabel(item.type) + '</span></td>\
  <td class="text-sm" style="padding:var(--space-2) var(--space-3)">' + formatSize(item.size) + '</td>\
  <td style="padding:var(--space-2) var(--space-3)"><span class="badge ' + statusClass + '">' + statusLabel + '</span></td>\
</tr>';
  }

  function renderBookmarkCard(item) {
    var icon = getTypeIcon(item.type);
    var typeLabel = getTypeLabel(item.type);
    var openBtn = '<button class="btn btn-ghost btn-sm" data-action="dl:open:' + item.id + '" title="Open">📂</button>';
    return '\
<div class="card" style="display:flex;align-items:center;gap:var(--space-3);padding:var(--space-3)">\
  <span style="font-size:1.5rem">' + icon + '</span>\
  <div style="flex:1;min-width:0">\
    <h5 class="font-semibold text-sm" style="overflow:hidden;text-overflow:ellipsis;white-space:nowrap">' + sanitize(item.title) + '</h5>\
    <div class="flex items-center gap-2 text-xs text-secondary">\
      <span class="badge badge-blue">' + typeLabel + '</span>\
      <span>' + formatDate(item.date) + '</span>\
    </div>\
  </div>\
  ' + openBtn + '\
</div>';
  }

  function renderSection(title, content, extraLink) {
    return '\
<div class="card" style="padding:var(--space-4);margin-bottom:var(--space-6)">\
  <div class="flex items-center justify-between" style="margin-bottom:var(--space-4)">\
    <h2 class="font-semibold">' + sanitize(title) + '</h2>\
    ' + (extraLink || '') + '\
  </div>\
  ' + content + '\
</div>';
  }

  function renderHorizontalScroll(items, emptyText) {
    if (!items || items.length === 0) {
      return renderEmptyState('⬇️', emptyText || 'No items', '', 'Browse Resources');
    }
    var html = '<div class="horizontal-scroll" style="display:flex;gap:var(--space-3);overflow-x:auto;padding-bottom:var(--space-2)">';
    for (var i = 0; i < items.length; i++) {
      html += renderMiniCard(items[i]);
    }
    html += '</div>';
    return html;
  }

  function renderGrid(items, renderFn, emptyText) {
    if (!items || items.length === 0) {
      return renderEmptyState('📦', emptyText || 'No items', '', 'Browse Resources');
    }
    var html = '<div class="grid" style="display:grid;grid-template-columns:repeat(auto-fill,minmax(240px,1fr));gap:var(--space-4)">';
    for (var i = 0; i < items.length; i++) {
      html += renderFn(items[i]);
    }
    html += '</div>';
    return html;
  }

  function filterItems(items, searchVal, filterVal, sortVal) {
    var result = items.slice();
    var i;

    if (searchVal) {
      var s = searchVal.toLowerCase();
      result = result.filter(function(item) {
        return (item.title && item.title.toLowerCase().indexOf(s) !== -1) ||
               (item.subject && item.subject.toLowerCase().indexOf(s) !== -1) ||
               (item.author && item.author.toLowerCase().indexOf(s) !== -1) ||
               (item.channel && item.channel.toLowerCase().indexOf(s) !== -1);
      });
    }

    if (filterVal && filterVal !== 'all') {
      result = result.filter(function(item) { return item.type === filterVal; });
    }

    result.sort(function(a, b) {
      var cmp = 0;
      if (sortVal === 'name') {
        cmp = (a.title || '').localeCompare(b.title || '');
      } else if (sortVal === 'size') {
        cmp = (a.size || '').localeCompare(b.size || '');
      } else if (sortVal === 'type') {
        cmp = (a.type || '').localeCompare(b.type || '');
      } else {
        cmp = (b.date || '').localeCompare(a.date || '');
      }
      return cmp;
    });

    return result;
  }

  function renderPagination(total, page, perPage) {
    var totalPages = Math.ceil(total / perPage);
    if (totalPages <= 1) return '';
    var html = '<div class="flex items-center justify-center gap-2" style="margin-top:var(--space-4)">';
    html += '<button class="btn btn-ghost btn-sm"' + (page <= 1 ? ' disabled' : ' data-action="dl:historyPage:' + (page - 1) + '"') + '>‹ Prev</button>';
    html += '<span class="text-sm text-secondary">Page ' + page + ' of ' + totalPages + '</span>';
    html += '<button class="btn btn-ghost btn-sm"' + (page >= totalPages ? ' disabled' : ' data-action="dl:historyPage:' + (page + 1) + '"') + '>Next ›</button>';
    html += '</div>';
    return html;
  }

  window.renderPage.openDownload = function(id) {
    showToast('Opening file...', 'info');
  };

  window.renderPage.shareDownload = function(id) {
    var downloads = store.get('downloads') || [];
    var item = null;
    for (var i = 0; i < downloads.length; i++) {
      if (downloads[i].id === id) {
        item = downloads[i];
        break;
      }
    }
    var title = item ? item.title : 'File';
    if (copyToClipboard('Check out this file: ' + title + ' - from EduMentee')) {
      showToast('Share link copied to clipboard!', 'success');
    } else {
      showToast('Share feature coming soon', 'info');
    }
  };

  window.renderPage.deleteDownload = function(id) {
    confirmDialog('Delete "' + (function() {
      var downloads = store.get('downloads') || [];
      for (var i = 0; i < downloads.length; i++) {
        if (downloads[i].id === id) return downloads[i].title || 'this download';
      }
      return 'this download';
    })() + '"?', function() {
      var downloads = store.get('downloads') || [];
      downloads = downloads.filter(function(d) { return d.id !== id; });
      store.set('downloads', downloads);
      showToast('File removed from downloads', 'info');
      window.renderPage.downloads(router.getParams());
    });
  };

  window.renderPage.changeHistoryPage = function(page) {
    var params = router.getParams();
    params.historyPage = page;
    window.renderPage.downloads(params);
  };

  window.renderPage.clearHistory = function() {
    confirmDialog('Clear all download history? This cannot be undone.', function() {
      store.set('downloads', []);
      showToast('Download history cleared', 'info');
      window.renderPage.downloads(router.getParams());
    });
  };

  window.renderPage.clearRecent = function() {
    var downloads = store.get('downloads') || [];
    var sorted = downloads.slice().sort(function(a, b) {
      return (b.date || '').localeCompare(a.date || '');
    });
    var recentIds = {};
    for (var i = 0; i < Math.min(5, sorted.length); i++) {
      recentIds[sorted[i].id] = true;
    }
    downloads = downloads.filter(function(d) { return !recentIds[d.id]; });
    store.set('downloads', downloads);
    showToast('Recent downloads cleared', 'info');
    window.renderPage.downloads(router.getParams());
  };

  window.renderPage.sortDownloads = function(sortVal) {
    var params = router.getParams();
    params.sort = sortVal;
    window.renderPage.downloads(params);
  };

  window.renderPage.filterDownloads = function(filterVal) {
    var params = router.getParams();
    params.filter = filterVal;
    window.renderPage.downloads(params);
  };

  window.renderPage.searchDownloads = function(searchVal) {
    var params = router.getParams();
    params.search = searchVal;
    window.renderPage.downloads(params);
  };

  window.renderPage.downloads = function(params) {
    var mainContent = document.getElementById('main-content');
    if (!mainContent) return;

    var downloads = generateMockDownloads();

    var searchVal = (params && params.search) ? params.search : '';
    var sortVal = (params && params.sort) ? params.sort : 'newest';
    var filterVal = (params && params.filter) ? params.filter : 'all';
    var historyPage = (params && params.historyPage) ? parseInt(params.historyPage, 10) || 1 : 1;
    var historyPerPage = 20;

    var sorted = downloads.slice().sort(function(a, b) {
      return (b.date || '').localeCompare(a.date || '');
    });
    var recent = sorted.slice(0, 5);

    var filtered = filterItems(downloads, searchVal, filterVal, sortVal);
    var notesItems = filterItems(downloads, searchVal, 'notes', sortVal);
    var videoItems = filterItems(downloads, searchVal, 'video', sortVal);
    var bookItems = filterItems(downloads, searchVal, 'book', sortVal);
    var resourceItems = filterItems(downloads, searchVal, 'resource', sortVal);

    var bookmarks = downloads.filter(function(d) { return d.bookmarked; });

    var historyTotal = downloads.length;
    var historyStart = (historyPage - 1) * historyPerPage;
    var historyItems = sorted.slice(historyStart, historyStart + historyPerPage);

    var html = '\
<div class="page-container-inner">\
  <div class="page-header">\
    <div>\
      <h1 class="page-title">Downloads</h1>\
      <p class="page-subtitle text-secondary text-sm">' + downloads.length + ' file' + (downloads.length !== 1 ? 's' : '') + ' on your device</p>\
    </div>\
  </div>\
  ' + renderStorageBar() + '\
  ' + renderSearchSortBar(searchVal, sortVal, filterVal) + '\
  ' + renderSection('Recent Downloads', renderHorizontalScroll(recent, 'No recent downloads'), '<span class="link text-sm" style="cursor:pointer" data-action="dl:clearRecent">Clear All</span>') + '\
  ' + renderSection('Downloaded Notes', renderGrid(notesItems, function(item) { return renderDownloadCard(item); }, 'No downloaded notes')) + '\
  ' + renderSection('Downloaded Videos', renderGrid(videoItems, function(item) { return renderDownloadCard(item); }, 'No downloaded videos')) + '\
  ' + renderSection('Downloaded Books', renderGrid(bookItems, function(item) { return renderDownloadCard(item); }, 'No downloaded books')) + '\
  ' + renderSection('Downloaded Resources', renderGrid(resourceItems, function(item) { return renderDownloadCard(item); }, 'No downloaded resources')) + '\
  <div class="card" style="padding:var(--space-4);margin-bottom:var(--space-6)">\
    <div class="flex items-center justify-between" style="margin-bottom:var(--space-4)">\
      <h2 class="font-semibold">Download History</h2>\
      <button class="btn btn-ghost btn-sm" style="color:var(--accent-red)" data-action="dl:clearHistory">🗑️ Clear History</button>\
    </div>\
    <div class="table-wrapper" style="overflow-x:auto">\
      <table class="table" style="width:100%;border-collapse:collapse">\
        <thead>\
          <tr style="border-bottom:1px solid var(--border-subtle)">\
            <th class="text-xs text-secondary font-semibold" style="padding:var(--space-2) var(--space-3);text-align:left">Date</th>\
            <th class="text-xs text-secondary font-semibold" style="padding:var(--space-2) var(--space-3);text-align:left">File</th>\
            <th class="text-xs text-secondary font-semibold" style="padding:var(--space-2) var(--space-3);text-align:left">Type</th>\
            <th class="text-xs text-secondary font-semibold" style="padding:var(--space-2) var(--space-3);text-align:left">Size</th>\
            <th class="text-xs text-secondary font-semibold" style="padding:var(--space-2) var(--space-3);text-align:left">Status</th>\
          </tr>\
        </thead>\
        <tbody>';

    if (historyItems.length === 0) {
      html += '<tr><td colspan="5" class="text-center text-secondary text-sm" style="padding:var(--space-6)">No download history</td></tr>';
    } else {
      for (var hi = 0; hi < historyItems.length; hi++) {
        html += renderHistoryRow(historyItems[hi]);
      }
    }

    html += '\
        </tbody>\
      </table>\
    </div>\
    ' + renderPagination(historyTotal, historyPage, historyPerPage) + '\
  </div>\
  <div class="card" style="padding:var(--space-4);margin-bottom:var(--space-6)">\
    <div class="flex items-center justify-between" style="margin-bottom:var(--space-4)">\
      <h2 class="font-semibold">Bookmarks <span class="text-sm text-secondary">(' + bookmarks.length + ')</span></h2>\
    </div>';

    if (bookmarks.length === 0) {
      html += renderEmptyState('🔖', 'No bookmarks yet', 'Bookmark your favorite downloads for quick access.', '');
    } else {
      html += '<div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(280px,1fr));gap:var(--space-3)">';
      for (var bi = 0; bi < bookmarks.length; bi++) {
        html += renderBookmarkCard(bookmarks[bi]);
      }
      html += '</div>';
    }

    html += '\
  </div>\
</div>';

    mainContent.innerHTML = html;

    var searchInput = document.getElementById('download-search');
    if (searchInput) {
      searchInput.oninput = function() {
        var p = router.getParams();
        p.search = this.value;
        window.renderPage.downloads(p);
      };
    }

    var sortSelect = document.getElementById('download-sort');
    if (sortSelect) {
      sortSelect.onchange = function() {
        var p = router.getParams();
        p.sort = this.value;
        window.renderPage.downloads(p);
      };
    }

    var filterChips = document.querySelectorAll('#download-filters .chip');
    for (var fc = 0; fc < filterChips.length; fc++) {
      filterChips[fc].setAttribute('data-action', 'dl:filter');
    }
  };
})();
