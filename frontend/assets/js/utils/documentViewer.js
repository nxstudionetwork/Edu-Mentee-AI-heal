window.DocumentViewer = (function() {
  var container = null;
  var overlay = null;
  var panel = null;
  var currentDoc = null;
  var currentPage = 1;
  var zoomLevel = 100;
  var isFullscreen = false;
  var isSearchOpen = false;
  var isBookmarksOpen = false;
  var isInfoOpen = false;
  var bookmarks = [];
  var searchMatches = [];
  var currentMatchIndex = -1;
  var searchQuery = '';

  function injectStyles() {
    var css = '.dv-overlay{position:fixed;top:0;left:0;right:0;bottom:0;background:rgba(0,0,0,0.75);z-index:10000;display:flex;align-items:center;justify-content:center;opacity:0;transition:opacity 0.3s ease;}.dv-overlay.active{opacity:1;}.dv-panel{background:#0f1322;border:1px solid rgba(255,255,255,0.08);border-radius:16px;width:90vw;height:90vh;max-width:1400px;display:flex;flex-direction:column;overflow:hidden;box-shadow:0 25px 60px rgba(0,0,0,0.5);transform:translateY(30px) scale(0.97);transition:transform 0.35s cubic-bezier(0.16,1,0.3,1);position:relative;}.dv-overlay.active .dv-panel{transform:translateY(0) scale(1);}.dv-fullscreen .dv-panel{width:100vw;height:100vh;max-width:none;border-radius:0;border:none;}.dv-header{display:flex;align-items:center;justify-content:space-between;padding:12px 20px;border-bottom:1px solid rgba(255,255,255,0.06);background:rgba(255,255,255,0.02);flex-shrink:0;}.dv-header-title{font-size:16px;font-weight:600;color:#e8edff;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;margin-right:16px;}.dv-header-subtitle{font-size:12px;color:#6b7280;margin-left:8px;}.dv-header-close{width:36px;height:36px;border:none;background:rgba(255,255,255,0.06);color:#9ca3af;border-radius:10px;cursor:pointer;display:flex;align-items:center;justify-content:center;font-size:18px;transition:all 0.2s;flex-shrink:0;}.dv-header-close:hover{background:rgba(239,68,68,0.2);color:#ef4444;}.dv-toolbar{display:flex;align-items:center;padding:8px 16px;border-bottom:1px solid rgba(255,255,255,0.06);background:rgba(255,255,255,0.02);gap:4px;flex-shrink:0;flex-wrap:wrap;}.dv-toolbar-group{display:flex;align-items:center;gap:2px;margin-right:8px;}.dv-toolbar-sep{width:1px;height:24px;background:rgba(255,255,255,0.08);margin:0 6px;flex-shrink:0;}.dv-toolbar-btn{width:34px;height:34px;border:none;background:transparent;color:#9ca3af;border-radius:8px;cursor:pointer;display:flex;align-items:center;justify-content:center;transition:all 0.2s;position:relative;}.dv-toolbar-btn:hover{background:rgba(255,255,255,0.08);color:#e8edff;}.dv-toolbar-btn.active{background:rgba(59,130,246,0.15);color:#60a5fa;}.dv-toolbar-btn svg{width:18px;height:18px;}.dv-toolbar-label{font-size:13px;color:#e8edff;padding:0 8px;white-space:nowrap;}.dv-page-nav{display:flex;align-items:center;gap:6px;}.dv-page-nav button{width:28px;height:28px;border:none;background:rgba(255,255,255,0.06);color:#9ca3af;border-radius:6px;cursor:pointer;display:flex;align-items:center;justify-content:center;font-size:14px;transition:all 0.2s;}.dv-page-nav button:hover{background:rgba(255,255,255,0.12);color:#e8edff;}.dv-page-nav button:disabled{opacity:0.3;cursor:default;}.dv-page-label{font-size:13px;color:#9ca3af;padding:0 4px;}.dv-zoom-display{font-size:13px;color:#60a5fa;font-weight:600;min-width:40px;text-align:center;}.dv-body{display:flex;flex:1;overflow:hidden;position:relative;}.dv-content{flex:1;overflow:auto;display:flex;align-items:flex-start;justify-content:center;padding:24px;position:relative;}.dv-content-inner{transform-origin:top center;transition:transform 0.2s ease;max-width:100%;}.dv-doc-preview{background:linear-gradient(135deg,#1e293b,#0f172a);border-radius:12px;border:1px solid rgba(255,255,255,0.06);min-height:600px;width:800px;max-width:100%;padding:32px;position:relative;overflow:hidden;}.dv-doc-type-icon{width:64px;height:64px;border-radius:16px;display:flex;align-items:center;justify-content:center;margin:0 auto 16px;font-size:28px;font-weight:700;color:#fff;}.dv-doc-text-content{color:#d1d5db;font-size:14px;line-height:1.8;white-space:pre-wrap;word-wrap:break-word;}.dv-doc-text-content .highlight{background:rgba(250,204,21,0.3);border-radius:2px;padding:0 2px;}.dv-doc-text-content .highlight.active{background:rgba(250,204,21,0.6);color:#1e293b;}.dv-search-panel{width:320px;border-left:1px solid rgba(255,255,255,0.06);background:rgba(255,255,255,0.02);display:flex;flex-direction:column;flex-shrink:0;transform:translateX(100%);transition:transform 0.3s ease;position:absolute;top:0;right:0;bottom:0;z-index:10;}.dv-search-panel.open{transform:translateX(0);}.dv-search-header{padding:12px 16px;border-bottom:1px solid rgba(255,255,255,0.06);}.dv-search-input-wrap{display:flex;align-items:center;background:rgba(255,255,255,0.06);border-radius:8px;padding:0 12px;}.dv-search-input-wrap input{flex:1;background:none;border:none;outline:none;color:#e8edff;font-size:14px;padding:8px 0;}.dv-search-input-wrap input::placeholder{color:#6b7280;}.dv-search-input-wrap .dv-search-clear{background:none;border:none;color:#6b7280;cursor:pointer;padding:4px;font-size:16px;}.dv-search-info{padding:8px 16px;font-size:13px;color:#9ca3af;display:flex;align-items:center;justify-content:space-between;}.dv-search-nav{display:flex;gap:4px;}.dv-search-nav button{width:28px;height:28px;border:none;background:rgba(255,255,255,0.06);color:#9ca3af;border-radius:6px;cursor:pointer;display:flex;align-items:center;justify-content:center;font-size:12px;transition:all 0.2s;}.dv-search-nav button:hover{background:rgba(255,255,255,0.12);color:#e8edff;}.dv-search-nav button:disabled{opacity:0.3;cursor:default;}.dv-search-results{flex:1;overflow:auto;padding:8px 0;}.dv-search-result{padding:8px 16px;font-size:13px;color:#d1d5db;cursor:pointer;transition:background 0.15s;border-left:3px solid transparent;}.dv-search-result:hover,.dv-search-result.active{background:rgba(59,130,246,0.1);border-left-color:#3b82f6;}.dv-bookmarks-panel{width:300px;border-right:1px solid rgba(255,255,255,0.06);background:rgba(255,255,255,0.02);display:flex;flex-direction:column;flex-shrink:0;transform:translateX(-100%);transition:transform 0.3s ease;position:absolute;top:0;left:0;bottom:0;z-index:10;}.dv-bookmarks-panel.open{transform:translateX(0);}.dv-bookmarks-header{padding:12px 16px;border-bottom:1px solid rgba(255,255,255,0.06);font-size:14px;font-weight:600;color:#e8edff;display:flex;align-items:center;justify-content:space-between;}.dv-bookmarks-list{flex:1;overflow:auto;padding:8px 0;}.dv-bookmark-item{display:flex;align-items:center;justify-content:space-between;padding:10px 16px;cursor:pointer;transition:background 0.15s;border-left:3px solid transparent;}.dv-bookmark-item:hover{background:rgba(255,255,255,0.04);border-left-color:#f59e0b;}.dv-bookmark-item .dv-bm-label{font-size:13px;color:#d1d5db;}.dv-bookmark-item .dv-bm-remove{background:none;border:none;color:#6b7280;cursor:pointer;font-size:16px;padding:2px 4px;border-radius:4px;transition:all 0.15s;}.dv-bookmark-item .dv-bm-remove:hover{background:rgba(239,68,68,0.15);color:#ef4444;}.dv-info-sidebar{width:340px;border-left:1px solid rgba(255,255,255,0.06);background:rgba(255,255,255,0.02);display:flex;flex-direction:column;flex-shrink:0;transform:translateX(100%);transition:transform 0.3s ease;position:absolute;top:0;right:0;bottom:0;z-index:10;overflow:auto;}.dv-info-sidebar.open{transform:translateX(0);}.dv-info-section{padding:16px;border-bottom:1px solid rgba(255,255,255,0.06);}.dv-info-section:last-child{border-bottom:none;}.dv-info-section h3{font-size:13px;font-weight:600;color:#6b7280;text-transform:uppercase;letter-spacing:0.5px;margin:0 0 12px;}.dv-info-grid{display:grid;grid-template-columns:1fr 1fr;gap:10px;}.dv-info-item{}.dv-info-item .dv-info-label{font-size:11px;color:#6b7280;margin-bottom:2px;}.dv-info-item .dv-info-value{font-size:14px;color:#e8edff;}.dv-info-desc{font-size:14px;color:#d1d5db;line-height:1.6;}.dv-related-item{padding:10px 12px;background:rgba(255,255,255,0.04);border-radius:8px;margin-bottom:8px;cursor:pointer;transition:background 0.15s;}.dv-related-item:hover{background:rgba(255,255,255,0.08);}.dv-related-item .dv-rl-title{font-size:14px;color:#e8edff;font-weight:500;}.dv-related-item .dv-rl-sub{font-size:12px;color:#6b7280;margin-top:2px;}.dv-empty-state{display:flex;flex-direction:column;align-items:center;justify-content:center;padding:40px 20px;color:#6b7280;text-align:center;}.dv-empty-state .dv-empty-icon{font-size:40px;margin-bottom:12px;opacity:0.5;}.dv-empty-state .dv-empty-text{font-size:14px;}.dv-footer{display:none;}.dv-mobile-only{display:none;}@media(max-width:768px){.dv-panel{width:100vw;height:100vh;border-radius:0;border:none;}.dv-content{padding:12px;}.dv-doc-preview{width:100%;min-height:400px;padding:16px;}.dv-search-panel,.dv-bookmarks-panel,.dv-info-sidebar{width:100%;}.dv-toolbar{gap:2px;padding:6px 8px;}.dv-toolbar-label{font-size:12px;padding:0 4px;}.dv-mobile-only{display:flex;}}';
    var style = document.createElement('style');
    style.textContent = css;
    document.head.appendChild(style);
  }

  function createIcon(svg) {
    var span = document.createElement('span');
    span.innerHTML = svg;
    return span.firstChild;
  }

  function svgIcon(path, viewBox) {
    if (viewBox === void 0) viewBox = '0 0 24 24';
    return '<svg xmlns="http://www.w3.org/2000/svg" viewBox="' + viewBox + '" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="' + path + '"/></svg>';
  }

  var ICONS = {
    fullscreen: svgIcon('M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3m0 18h3a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2 2h3'),
    fullscreenExit: svgIcon('M4 14h6m0 0v6m0-6L3 21m17-11h-6m0 0V4m0 6l7-7M4 10h6m0 0V4m0 6L3 3m17 14h-6m0 0v6m0-6l7 7'),
    zoomIn: svgIcon('M21 21l-6-6m2-5a7 7 0 1 1-14 0 7 7 0 0 1 14 0z M10 7v6m-3-3h6'),
    zoomOut: svgIcon('M21 21l-6-6m2-5a7 7 0 1 1-14 0 7 7 0 0 1 14 0z M7 10h6'),
    prev: svgIcon('M15 18l-6-6 6-6'),
    next: svgIcon('M9 18l6-6-6-6'),
    search: svgIcon('M21 21l-6-6m2-5a7 7 0 1 1-14 0 7 7 0 0 1 14 0z'),
    bookmark: svgIcon('M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z'),
    bookmarkFilled: svgIcon('M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z', '0 0 24 24', true),
    print: svgIcon('M6 9V2h12v7M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2M6 14h12v8H6z'),
    download: svgIcon('M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4m7-10v10m0 0l-4-4m4 4l4-4'),
    share: svgIcon('M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8m-4-6l-4-4-4 4m4-4v12'),
    externalLink: svgIcon('M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6m4-3h6m0 0v6m0-6L10 14'),
    info: svgIcon('M13 16h-1v-4h-1m2-4h.01M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0z'),
    close: svgIcon('M18 6L6 18M6 6l12 12'),
    fileText: svgIcon('M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z M14 2v6h6 M16 13H8 M16 17H8 M10 9H8'),
    image: svgIcon('M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z M14 2v6h6 M12 13a2 2 0 1 0 0-4 2 2 0 0 0 0 4z M4 18l4-4 3 3 4-4 5 5'),
    pdf: svgIcon('M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z M14 2v6h6 M10 12h4 M10 16h4 M10 20h2')
  };

  function btn(icon, title, onClick, active) {
    var b = document.createElement('button');
    b.className = 'dv-toolbar-btn' + (active ? ' active' : '');
    b.title = title;
    b.appendChild(createIcon(icon));
    if (onClick) {
      b.addEventListener('click', function(e) { e.stopPropagation(); onClick(); });
    }
    return b;
  }

  function createHeader() {
    var header = document.createElement('div');
    header.className = 'dv-header';
    var titleWrap = document.createElement('div');
    titleWrap.style.cssText = 'display:flex;align-items:center;min-width:0;';
    var title = document.createElement('span');
    title.className = 'dv-header-title';
    title.id = 'dv-title';
    var subtitle = document.createElement('span');
    subtitle.className = 'dv-header-subtitle';
    subtitle.id = 'dv-subtitle';
    titleWrap.appendChild(title);
    titleWrap.appendChild(subtitle);
    var closeBtn = document.createElement('button');
    closeBtn.className = 'dv-header-close';
    closeBtn.innerHTML = '&#10005;';
    closeBtn.title = 'Close (Esc)';
    closeBtn.addEventListener('click', close);
    header.appendChild(titleWrap);
    header.appendChild(closeBtn);
    return header;
  }

  function createToolbar() {
    var tb = document.createElement('div');
    tb.className = 'dv-toolbar';
    var g1 = document.createElement('div');
    g1.className = 'dv-toolbar-group';
    var fsBtn = btn(ICONS.fullscreen, 'Fullscreen (F)', function() {
      toggleFullscreen();
    });
    fsBtn.id = 'dv-fs-btn';
    g1.appendChild(fsBtn);
    tb.appendChild(g1);
    tb.appendChild(sep());
    var g2 = document.createElement('div');
    g2.className = 'dv-toolbar-group';
    var zoBtn = btn(ICONS.zoomOut, 'Zoom Out (-)', function() { zoomOut(); });
    zoBtn.id = 'dv-zoom-out';
    var zd = document.createElement('span');
    zd.className = 'dv-zoom-display';
    zd.id = 'dv-zoom-display';
    zd.textContent = '100%';
    var ziBtn = btn(ICONS.zoomIn, 'Zoom In (+)', function() { zoomIn(); });
    ziBtn.id = 'dv-zoom-in';
    g2.appendChild(zoBtn);
    g2.appendChild(zd);
    g2.appendChild(ziBtn);
    tb.appendChild(g2);
    tb.appendChild(sep());
    var g3 = document.createElement('div');
    g3.className = 'dv-toolbar-group dv-page-nav';
    var ppBtn = document.createElement('button');
    ppBtn.innerHTML = '&#9664;';
    ppBtn.title = 'Previous Page (Left Arrow)';
    ppBtn.id = 'dv-page-prev';
    ppBtn.addEventListener('click', function() { navigatePage(-1); });
    var pl = document.createElement('span');
    pl.className = 'dv-page-label';
    pl.id = 'dv-page-label';
    pl.textContent = 'Page 1 of 1';
    var npBtn = document.createElement('button');
    npBtn.innerHTML = '&#9654;';
    npBtn.title = 'Next Page (Right Arrow)';
    npBtn.id = 'dv-page-next';
    npBtn.addEventListener('click', function() { navigatePage(1); });
    g3.appendChild(ppBtn);
    g3.appendChild(pl);
    g3.appendChild(npBtn);
    tb.appendChild(g3);
    tb.appendChild(sep());
    var g4 = document.createElement('div');
    g4.className = 'dv-toolbar-group';
    var srBtn = btn(ICONS.search, 'Search (Ctrl+F)', function() { toggleSearch(); });
    srBtn.id = 'dv-search-btn';
    var bmBtn = btn(ICONS.bookmark, 'Toggle Bookmark (B)', function() { toggleCurrentBookmark(); });
    bmBtn.id = 'dv-bm-btn';
    g4.appendChild(srBtn);
    g4.appendChild(bmBtn);
    tb.appendChild(g4);
    tb.appendChild(sep());
    var g5 = document.createElement('div');
    g5.className = 'dv-toolbar-group';
    var prBtn = btn(ICONS.print, 'Print', function() { window.print(); });
    var dlBtn = btn(ICONS.download, 'Download', function() {
      if (currentDoc && currentDoc.url) window.open(currentDoc.url, '_blank');
    });
    var shBtn = btn(ICONS.share, 'Share', function() {
      if (navigator.share && currentDoc) {
        navigator.share({ title: currentDoc.title, url: currentDoc.url || window.location.href });
      } else if (currentDoc && currentDoc.url) {
        var ta = document.createElement('textarea');
        ta.value = currentDoc.url;
        document.body.appendChild(ta);
        ta.select();
        document.execCommand('copy');
        document.body.removeChild(ta);
      }
    });
    var extBtn = btn(ICONS.externalLink, 'Open in new tab', function() {
      if (currentDoc && currentDoc.url) window.open(currentDoc.url, '_blank');
    });
    var infoBtn = btn(ICONS.info, 'Document Info', function() { toggleInfo(); });
    infoBtn.id = 'dv-info-btn';
    g5.appendChild(prBtn);
    g5.appendChild(dlBtn);
    g5.appendChild(shBtn);
    g5.appendChild(extBtn);
    g5.appendChild(infoBtn);
    tb.appendChild(g5);
    return tb;
  }

  function sep() {
    var s = document.createElement('div');
    s.className = 'dv-toolbar-sep';
    return s;
  }

  function createContent() {
    var body = document.createElement('div');
    body.className = 'dv-body';
    var content = document.createElement('div');
    content.className = 'dv-content';
    content.id = 'dv-content';
    var inner = document.createElement('div');
    inner.className = 'dv-content-inner';
    inner.id = 'dv-content-inner';
    var preview = document.createElement('div');
    preview.className = 'dv-doc-preview';
    preview.id = 'dv-doc-preview';
    inner.appendChild(preview);
    content.appendChild(inner);
    body.appendChild(content);
    return body;
  }

  function createSearchPanel() {
    var sp = document.createElement('div');
    sp.className = 'dv-search-panel';
    sp.id = 'dv-search-panel';
    var sh = document.createElement('div');
    sh.className = 'dv-search-header';
    var iw = document.createElement('div');
    iw.className = 'dv-search-input-wrap';
    var inp = document.createElement('input');
    inp.type = 'text';
    inp.placeholder = 'Search in document...';
    inp.id = 'dv-search-input';
    inp.addEventListener('input', function() {
      searchQuery = inp.value;
      performSearch(searchQuery);
    });
    inp.addEventListener('keydown', function(e) {
      if (e.key === 'Enter') {
        e.preventDefault();
        if (e.shiftKey) goToPrevMatch(); else goToNextMatch();
      }
    });
    var clr = document.createElement('button');
    clr.className = 'dv-search-clear';
    clr.innerHTML = '&#10005;';
    clr.title = 'Clear';
    clr.addEventListener('click', function() {
      inp.value = '';
      searchQuery = '';
      performSearch('');
      inp.focus();
    });
    iw.appendChild(inp);
    iw.appendChild(clr);
    sh.appendChild(iw);
    var si = document.createElement('div');
    si.className = 'dv-search-info';
    si.id = 'dv-search-info';
    var sc = document.createElement('span');
    sc.id = 'dv-search-count';
    sc.textContent = 'No results';
    var sn = document.createElement('div');
    sn.className = 'dv-search-nav';
    var spb = document.createElement('button');
    spb.innerHTML = '&#9650;';
    spb.title = 'Previous match';
    spb.id = 'dv-search-prev';
    spb.addEventListener('click', goToPrevMatch);
    var snb = document.createElement('button');
    snb.innerHTML = '&#9660;';
    snb.title = 'Next match';
    snb.id = 'dv-search-next';
    snb.addEventListener('click', goToNextMatch);
    sn.appendChild(spb);
    sn.appendChild(snb);
    si.appendChild(sc);
    si.appendChild(sn);
    var sr = document.createElement('div');
    sr.className = 'dv-search-results';
    sr.id = 'dv-search-results';
    sp.appendChild(sh);
    sp.appendChild(si);
    sp.appendChild(sr);
    return sp;
  }

  function createBookmarksPanel() {
    var bp = document.createElement('div');
    bp.className = 'dv-bookmarks-panel';
    bp.id = 'dv-bookmarks-panel';
    var bh = document.createElement('div');
    bh.className = 'dv-bookmarks-header';
    var bt = document.createElement('span');
    bt.textContent = 'Bookmarks';
    var bc = document.createElement('span');
    bc.id = 'dv-bm-count';
    bc.style.cssText = 'font-size:12px;color:#6b7280;font-weight:400;';
    bc.textContent = '0';
    bh.appendChild(bt);
    bh.appendChild(bc);
    var bl = document.createElement('div');
    bl.className = 'dv-bookmarks-list';
    bl.id = 'dv-bookmarks-list';
    bp.appendChild(bh);
    bp.appendChild(bl);
    return bp;
  }

  function createInfoSidebar() {
    var isb = document.createElement('div');
    isb.className = 'dv-info-sidebar';
    isb.id = 'dv-info-sidebar';
    return isb;
  }

  function getTypeIcon(type) {
    switch (type) {
      case 'pdf': return ICONS.pdf;
      case 'ppt': return ICONS.fileText;
      case 'doc': case 'docx': return ICONS.fileText;
      case 'txt': return ICONS.fileText;
      case 'image': return ICONS.image;
      default: return ICONS.fileText;
    }
  }

  function getTypeColor(type) {
    switch (type) {
      case 'pdf': return '#ef4444';
      case 'ppt': return '#f97316';
      case 'doc': case 'docx': return '#3b82f6';
      case 'txt': return '#10b981';
      case 'image': return '#8b5cf6';
      default: return '#6b7280';
    }
  }

  function getTypeLabel(type) {
    switch (type) {
      case 'pdf': return 'PDF';
      case 'ppt': return 'PPT';
      case 'doc': return 'DOC';
      case 'docx': return 'DOCX';
      case 'txt': return 'TXT';
      case 'image': return 'Image';
      default: return type.toUpperCase();
    }
  }

  function renderPreview(doc) {
    var preview = document.getElementById('dv-doc-preview');
    if (!preview) return;
    var icon = getTypeIcon(doc.type);
    var color = getTypeColor(doc.type);
    var label = getTypeLabel(doc.type);
    var html = '<div class="dv-doc-type-icon" style="background:' + color + ';">' + label + '</div>';
    html += '<div style="text-align:center;margin-bottom:20px;"><span style="font-size:24px;font-weight:700;color:#e8edff;">' + doc.title + '</span></div>';
    if (doc.type === 'txt' && doc.content) {
      html += '<div class="dv-doc-text-content" id="dv-text-content">' + escapeHTML(doc.content) + '</div>';
    } else if (doc.type === 'image') {
      html += '<div style="background:linear-gradient(135deg,' + color + '22,' + color + '44);border-radius:8px;height:400px;display:flex;align-items:center;justify-content:center;"><span style="font-size:48px;opacity:0.5;">' + label + '</span></div>';
    } else {
      var mockContent = '';
      for (var i = 0; i < 8; i++) {
        mockContent += '<div style="height:20px;background:rgba(255,255,255,0.04);border-radius:4px;margin-bottom:12px;width:' + (60 + Math.random() * 40) + '%;"></div>';
      }
      mockContent += '<div style="height:200px;background:rgba(255,255,255,0.03);border-radius:8px;display:flex;align-items:center;justify-content:center;margin-top:16px;"><span style="color:#6b7280;font-size:14px;">Preview not available</span></div>';
      html += '<div class="dv-doc-text-content">' + mockContent + '</div>';
    }
    preview.innerHTML = html;
    var pageLabel = document.getElementById('dv-page-label');
    if (pageLabel) pageLabel.textContent = 'Page ' + currentPage + ' of ' + (doc.pages || 1);
  }

  function escapeHTML(str) {
    if (!str) return '';
    var map = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#x27;' };
    return String(str).replace(/[&<>"']/g, function(m) { return map[m]; });
  }

  function updateZoomDisplay() {
    var zd = document.getElementById('dv-zoom-display');
    if (zd) zd.textContent = zoomLevel + '%';
    var inner = document.getElementById('dv-content-inner');
    if (inner) inner.style.transform = 'scale(' + (zoomLevel / 100) + ')';
  }

  function navigatePage(delta) {
    if (!currentDoc) return;
    var maxPage = currentDoc.pages || 1;
    var newPage = currentPage + delta;
    if (newPage < 1 || newPage > maxPage) return;
    currentPage = newPage;
    var label = document.getElementById('dv-page-label');
    if (label) label.textContent = 'Page ' + currentPage + ' of ' + maxPage;
    var prev = document.getElementById('dv-page-prev');
    var next = document.getElementById('dv-page-next');
    if (prev) prev.disabled = currentPage <= 1;
    if (next) next.disabled = currentPage >= maxPage;
    renderPreview(currentDoc);
  }

  function zoomIn() {
    if (zoomLevel >= 200) return;
    zoomLevel = Math.min(200, zoomLevel + 10);
    updateZoomDisplay();
  }

  function zoomOut() {
    if (zoomLevel <= 50) return;
    zoomLevel = Math.max(50, zoomLevel - 10);
    updateZoomDisplay();
  }

  function toggleFullscreen() {
    isFullscreen = !isFullscreen;
    if (container) container.classList.toggle('dv-fullscreen', isFullscreen);
    var btn = document.getElementById('dv-fs-btn');
    if (btn) {
      btn.innerHTML = '';
      btn.appendChild(createIcon(isFullscreen ? ICONS.fullscreenExit : ICONS.fullscreen));
      btn.title = isFullscreen ? 'Exit Fullscreen (F)' : 'Fullscreen (F)';
    }
  }

  function toggleSearch() {
    isSearchOpen = !isSearchOpen;
    var sp = document.getElementById('dv-search-panel');
    if (sp) sp.classList.toggle('open', isSearchOpen);
    var btn = document.getElementById('dv-search-btn');
    if (btn) btn.classList.toggle('active', isSearchOpen);
    if (isSearchOpen) {
      var inp = document.getElementById('dv-search-input');
      if (inp) setTimeout(function() { inp.focus(); }, 100);
    }
    if (isBookmarksOpen && isSearchOpen) toggleBookmarks();
    if (isInfoOpen && isSearchOpen) toggleInfo();
  }

  function toggleBookmarks() {
    isBookmarksOpen = !isBookmarksOpen;
    var bp = document.getElementById('dv-bookmarks-panel');
    if (bp) bp.classList.toggle('open', isBookmarksOpen);
    if (isSearchOpen && isBookmarksOpen) toggleSearch();
    if (isInfoOpen && isBookmarksOpen) toggleInfo();
  }

  function toggleInfo() {
    isInfoOpen = !isInfoOpen;
    var isb = document.getElementById('dv-info-sidebar');
    if (isb) isb.classList.toggle('open', isInfoOpen);
    var btn = document.getElementById('dv-info-btn');
    if (btn) btn.classList.toggle('active', isInfoOpen);
    if (isSearchOpen && isInfoOpen) toggleSearch();
    if (isBookmarksOpen && isInfoOpen) toggleBookmarks();
  }

  function toggleCurrentBookmark() {
    if (!currentDoc) return;
    var idx = -1;
    for (var i = 0; i < bookmarks.length; i++) {
      if (bookmarks[i].page === currentPage) { idx = i; break; }
    }
    if (idx !== -1) {
      bookmarks.splice(idx, 1);
    } else {
      bookmarks.push({ page: currentPage, title: 'Page ' + currentPage, docId: currentDoc.id });
    }
    updateBookmarksUI();
    updateBookmarkButton();
  }

  function updateBookmarkButton() {
    var btn = document.getElementById('dv-bm-btn');
    if (!btn) return;
    var bookmarked = false;
    for (var i = 0; i < bookmarks.length; i++) {
      if (bookmarks[i].page === currentPage) { bookmarked = true; break; }
    }
    btn.innerHTML = '';
    btn.appendChild(createIcon(bookmarked ? ICONS.bookmarkFilled : ICONS.bookmark));
    btn.classList.toggle('active', bookmarked);
  }

  function updateBookmarksUI() {
    var list = document.getElementById('dv-bookmarks-list');
    var count = document.getElementById('dv-bm-count');
    if (count) count.textContent = bookmarks.length;
    if (!list) return;
    if (bookmarks.length === 0) {
      list.innerHTML = '<div class="dv-empty-state"><div class="dv-empty-icon">&#128214;</div><div class="dv-empty-text">No bookmarks yet.<br>Press <strong>B</strong> to bookmark this page.</div></div>';
      return;
    }
    var html = '';
    for (var i = 0; i < bookmarks.length; i++) {
      var bm = bookmarks[i];
      html += '<div class="dv-bookmark-item" data-page="' + bm.page + '"><span class="dv-bm-label">' + escapeHTML(bm.title) + '</span><button class="dv-bm-remove" data-page="' + bm.page + '" title="Remove bookmark">&#10005;</button></div>';
    }
    list.innerHTML = html;
    var items = list.querySelectorAll('.dv-bookmark-item');
    for (var j = 0; j < items.length; j++) {
      (function(page) {
        items[j].addEventListener('click', function(e) {
          if (e.target.closest('.dv-bm-remove')) return;
          currentPage = page;
          if (currentDoc) {
            var maxPage = currentDoc.pages || 1;
            if (currentPage < 1) currentPage = 1;
            if (currentPage > maxPage) currentPage = maxPage;
          }
          navigatePage(0);
          updateBookmarkButton();
        });
      })(bookmarks[j].page);
    }
    var removes = list.querySelectorAll('.dv-bm-remove');
    for (var k = 0; k < removes.length; k++) {
      (function(page) {
        removes[k].addEventListener('click', function(e) {
          e.stopPropagation();
          for (var i = 0; i < bookmarks.length; i++) {
            if (bookmarks[i].page === page) { bookmarks.splice(i, 1); break; }
          }
          updateBookmarksUI();
          updateBookmarkButton();
        });
      })(bookmarks[k].page);
    }
  }

  function performSearch(query) {
    if (!query || !currentDoc || !currentDoc.content) {
      searchMatches = [];
      currentMatchIndex = -1;
      updateSearchUI();
      renderPreview(currentDoc);
      return;
    }
    var lower = query.toLowerCase();
    var content = currentDoc.content;
    var lowerContent = content.toLowerCase();
    var indices = [];
    var idx = 0;
    while ((idx = lowerContent.indexOf(lower, idx)) !== -1) {
      indices.push({ start: idx, end: idx + query.length });
      idx += query.length;
    }
    searchMatches = indices;
    currentMatchIndex = searchMatches.length > 0 ? 0 : -1;
    updateSearchUI();
    renderPreview(currentDoc);
    highlightInContent();
  }

  function highlightInContent() {
    var textContent = document.getElementById('dv-text-content');
    if (!textContent || !currentDoc || !currentDoc.content) return;
    if (!searchQuery || searchMatches.length === 0) {
      textContent.textContent = currentDoc.content;
      return;
    }
    var content = currentDoc.content;
    var lower = searchQuery.toLowerCase();
    var html = '';
    var lastIdx = 0;
    for (var i = 0; i < searchMatches.length; i++) {
      var m = searchMatches[i];
      html += escapeHTML(content.slice(lastIdx, m.start));
      var cls = 'highlight';
      if (i === currentMatchIndex) cls += ' active';
      html += '<span class="' + cls + '">' + escapeHTML(content.slice(m.start, m.end)) + '</span>';
      lastIdx = m.end;
    }
    html += escapeHTML(content.slice(lastIdx));
    textContent.innerHTML = html;
    if (currentMatchIndex >= 0) {
      var active = textContent.querySelector('.highlight.active');
      if (active) active.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }

  function updateSearchUI() {
    var count = document.getElementById('dv-search-count');
    var prev = document.getElementById('dv-search-prev');
    var next = document.getElementById('dv-search-next');
    var results = document.getElementById('dv-search-results');
    if (count) {
      if (!searchQuery) count.textContent = 'No results';
      else if (searchMatches.length === 0) count.textContent = 'No matches found';
      else count.textContent = (currentMatchIndex + 1) + ' of ' + searchMatches.length + ' matches';
    }
    if (prev) prev.disabled = searchMatches.length === 0 || currentMatchIndex <= 0;
    if (next) next.disabled = searchMatches.length === 0 || currentMatchIndex >= searchMatches.length - 1;
    if (results) {
      if (searchMatches.length === 0 || !searchQuery) {
        if (!searchQuery) results.innerHTML = '<div class="dv-empty-state"><div class="dv-empty-icon">&#128269;</div><div class="dv-empty-text">Type to search within this document</div></div>';
        else results.innerHTML = '<div class="dv-empty-state"><div class="dv-empty-icon">&#128533;</div><div class="dv-empty-text">No matches found</div></div>';
      } else {
        var html = '';
        for (var i = 0; i < Math.min(searchMatches.length, 50); i++) {
          var m = searchMatches[i];
          var ctxStart = Math.max(0, m.start - 30);
          var ctxEnd = Math.min(currentDoc.content.length, m.end + 30);
          var ctx = '';
          if (ctxStart > 0) ctx += '...';
          ctx += currentDoc.content.slice(ctxStart, m.start);
          ctx += '<strong>' + currentDoc.content.slice(m.start, m.end) + '</strong>';
          ctx += currentDoc.content.slice(m.end, ctxEnd);
          if (ctxEnd < currentDoc.content.length) ctx += '...';
          html += '<div class="dv-search-result' + (i === currentMatchIndex ? ' active' : '') + '" data-idx="' + i + '">' + escapeHTML(ctx) + '</div>';
        }
        results.innerHTML = html;
        var rItems = results.querySelectorAll('.dv-search-result');
        for (var j = 0; j < rItems.length; j++) {
          (function(idx) {
            rItems[j].addEventListener('click', function() {
              currentMatchIndex = idx;
              updateSearchUI();
              highlightInContent();
            });
          })(j);
        }
      }
    }
  }

  function goToNextMatch() {
    if (searchMatches.length === 0) return;
    currentMatchIndex = (currentMatchIndex + 1) % searchMatches.length;
    updateSearchUI();
    highlightInContent();
  }

  function goToPrevMatch() {
    if (searchMatches.length === 0) return;
    currentMatchIndex = (currentMatchIndex - 1 + searchMatches.length) % searchMatches.length;
    updateSearchUI();
    highlightInContent();
  }

  function renderInfoSidebar(doc) {
    var isb = document.getElementById('dv-info-sidebar');
    if (!isb) return;
    var html = '';
    html += '<div class="dv-info-section"><h3>Document Info</h3><div class="dv-info-grid">';
    html += infoItem('Title', doc.title);
    html += infoItem('Type', doc.type ? doc.type.toUpperCase() : '-');
    html += infoItem('Subject', doc.subject || '-');
    html += infoItem('Class', doc.class ? 'Class ' + doc.class : '-');
    html += infoItem('Author', doc.author || '-');
    html += infoItem('Size', doc.size || '-');
    html += infoItem('Pages', doc.pages ? String(doc.pages) : '-');
    html += infoItem('Created', doc.createdAt || Utils.formatDate(new Date()));
    html += '</div></div>';
    if (doc.description) {
      html += '<div class="dv-info-section"><h3>Description</h3><div class="dv-info-desc">' + escapeHTML(doc.description) + '</div></div>';
    }
    if (doc.related && doc.related.length > 0) {
      html += '<div class="dv-info-section"><h3>Related Documents</h3>';
      for (var i = 0; i < doc.related.length; i++) {
        var r = doc.related[i];
        html += '<div class="dv-related-item"><div class="dv-rl-title">' + escapeHTML(r.title) + '</div><div class="dv-rl-sub">' + escapeHTML(r.type || '') + (r.pages ? ' &middot; ' + r.pages + ' pages' : '') + '</div></div>';
      }
      html += '</div>';
    }
    isb.innerHTML = html;
  }

  function infoItem(label, value) {
    return '<div class="dv-info-item"><div class="dv-info-label">' + label + '</div><div class="dv-info-value">' + value + '</div></div>';
  }

  function handleKeydown(e) {
    if (!container || container.style.display === 'none') return;
    var tag = e.target.tagName;
    var isInput = tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT';
    switch (e.key) {
      case 'Escape':
        e.preventDefault();
        close();
        break;
      case 'f':
      case 'F':
        if (!isInput) { e.preventDefault(); toggleFullscreen(); }
        break;
      case '+':
      case '=':
        if (!isInput) { e.preventDefault(); zoomIn(); }
        break;
      case '-':
      case '_':
        if (!isInput) { e.preventDefault(); zoomOut(); }
        break;
      case 'ArrowLeft':
        if (!isInput) { e.preventDefault(); navigatePage(-1); }
        break;
      case 'ArrowRight':
        if (!isInput) { e.preventDefault(); navigatePage(1); }
        break;
      case 'b':
      case 'B':
        if (!isInput) { e.preventDefault(); toggleBookmarks(); }
        break;
    }
    if ((e.ctrlKey || e.metaKey) && (e.key === 'f' || e.key === 'F')) {
      e.preventDefault();
      toggleSearch();
    }
  }

  function buildViewer() {
    container = document.createElement('div');
    container.className = 'dv-overlay';
    container.id = 'dv-container';
    container.addEventListener('click', function(e) {
      if (e.target === container) close();
    });
    panel = document.createElement('div');
    panel.className = 'dv-panel';
    panel.appendChild(createHeader());
    panel.appendChild(createToolbar());
    panel.appendChild(createContent());
    var body = panel.querySelector('.dv-body');
    body.appendChild(createSearchPanel());
    body.appendChild(createBookmarksPanel());
    body.appendChild(createInfoSidebar());
    container.appendChild(panel);
    document.body.appendChild(container);
  }

  function open(doc) {
    injectStyles();
    currentDoc = doc;
    currentPage = 1;
    zoomLevel = 100;
    isFullscreen = false;
    isSearchOpen = false;
    isBookmarksOpen = false;
    isInfoOpen = false;
    searchQuery = '';
    searchMatches = [];
    currentMatchIndex = -1;
    if (!container) buildViewer();
    var title = document.getElementById('dv-title');
    if (title) title.textContent = doc.title;
    var subtitle = document.getElementById('dv-subtitle');
    if (subtitle) subtitle.textContent = doc.subject ? (doc.subject + (doc.class ? ' - Class ' + doc.class : '')) : '';
    updateZoomDisplay();
    var maxPage = doc.pages || 1;
    var label = document.getElementById('dv-page-label');
    if (label) label.textContent = 'Page 1 of ' + maxPage;
    var prev = document.getElementById('dv-page-prev');
    var next = document.getElementById('dv-page-next');
    if (prev) prev.disabled = true;
    if (next) next.disabled = maxPage <= 1;
    renderPreview(doc);
    renderInfoSidebar(doc);
    updateBookmarksUI();
    updateBookmarkButton();
    var sp = document.getElementById('dv-search-panel');
    if (sp) sp.classList.remove('open');
    var bp = document.getElementById('dv-bookmarks-panel');
    if (bp) bp.classList.remove('open');
    var isb = document.getElementById('dv-info-sidebar');
    if (isb) isb.classList.remove('open');
    var searchBtn = document.getElementById('dv-search-btn');
    if (searchBtn) searchBtn.classList.remove('active');
    var infoBtn = document.getElementById('dv-info-btn');
    if (infoBtn) infoBtn.classList.remove('active');
    container.style.display = 'flex';
    requestAnimationFrame(function() {
      container.classList.add('active');
    });
    document.addEventListener('keydown', handleKeydown);
  }

  function close() {
    if (!container) return;
    container.classList.remove('active');
    document.removeEventListener('keydown', handleKeydown);
    setTimeout(function() {
      container.style.display = 'none';
      currentDoc = null;
    }, 300);
  }

  return {
    open: open,
    close: close
  };
})();
