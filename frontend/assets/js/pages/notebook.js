window.renderPage = window.renderPage || {};

(function() {
  var store = window.Store;
  var utils = window.Utils;

  if (!window._nbDelegateAdded) {
    window._nbDelegateAdded = true;
    document.addEventListener('click', function(e) {
      var t = e.target.closest('[data-action^="nb:"]');
      if (!t) return;
      var p = t.getAttribute('data-action').split(':');
      var c = p[1], arg = p.slice(2).join(':');
      if (c === 'select' && arg) { selectPage(arg); }
      else if (c === 'newPage') { createNewPage(); }
      else if (c === 'deletePage' && arg) { deletePage(arg); }
      else if (c === 'renamePage') { startRename(); }
      else if (c === 'exportPage') { exportPage(); }
      else if (c === 'bold') { execCmd('bold'); }
      else if (c === 'italic') { execCmd('italic'); }
      else if (c === 'underline') { execCmd('underline'); }
      else if (c === 'insertUnorderedList') { execCmd('insertUnorderedList'); }
      else if (c === 'formatBlock' && arg) { execCmd('formatBlock', arg); }
      else if (c === 'searchPages') { var si = document.getElementById('nb-sidebar-search'); if (si) renderSidebar(si.value); }
    });
  }

  var currentPageId = null;
  var saveTimer = null;

  function getPages() {
    var pages = store.get('notebookPages');
    if (!pages || pages.length === 0) {
      pages = [
        { id: 'nb1', title: 'Welcome to Notebook', content: '<h2>Welcome!</h2><p>This is your personal notebook. Use it to jot down notes, create study materials, and organize your thoughts.</p><p><strong>Features:</strong></p><ul><li>Create and manage multiple pages</li><li>Rich text editing (bold, italic, underline, lists)</li><li>Auto-save your work</li><li>Export as text file</li></ul>', created: '2026-07-01T10:00:00Z', updated: '2026-07-12T15:00:00Z' },
        { id: 'nb2', title: 'Math Formulas', content: '<h3>Key Formulas</h3><ul><li><strong>Quadratic:</strong> x = (-b \u00B1 \u221A(b\u00B2-4ac)) / 2a</li><li><strong>Area of Circle:</strong> A = \u03C0r\u00B2</li><li><strong>Pythagorean:</strong> a\u00B2 + b\u00B2 = c\u00B2</li><li><strong>Derivative:</strong> d/dx[x\u207F] = nx\u207F\u207B\u00B9</li></ul>', created: '2026-07-05T09:00:00Z', updated: '2026-07-11T12:00:00Z' },
        { id: 'nb3', title: 'Study Plan', content: '<h3>Weekly Study Plan</h3><ul><li>Monday: Mathematics - 2 hours</li><li>Tuesday: Physics - 1.5 hours</li><li>Wednesday: Chemistry - 2 hours</li><li>Thursday: Biology - 1.5 hours</li><li>Friday: English - 1 hour</li><li>Saturday: Revision - 3 hours</li><li>Sunday: Practice tests</li></ul>', created: '2026-07-06T08:00:00Z', updated: '2026-07-10T17:00:00Z' }
      ];
      store.set('notebookPages', pages);
    }
    return pages;
  }

  function savePages(pages) {
    store.set('notebookPages', pages);
  }

  function execCmd(command, value) {
    document.execCommand(command, false, value || null);
    var editor = document.getElementById('nb-editor');
    if (editor) editor.focus();
  }

  function selectPage(pageId) {
    saveCurrentPage();
    currentPageId = pageId;
    renderNotebookView();
  }

  function createNewPage() {
    var pages = getPages();
    var newPage = {
      id: 'nb_' + Date.now().toString(36),
      title: 'Untitled Page',
      content: '<p>Start writing here...</p>',
      created: new Date().toISOString(),
      updated: new Date().toISOString()
    };
    pages.unshift(newPage);
    savePages(pages);
    currentPageId = newPage.id;
    window.showToast && window.showToast('New page created', 'success');
    renderNotebookView();
    setTimeout(function() {
      var titleInput = document.getElementById('nb-page-title');
      if (titleInput) { titleInput.focus(); titleInput.select(); }
    }, 100);
  }

  function deletePage(pageId) {
    var pages = getPages();
    if (pages.length <= 1) {
      window.showToast && window.showToast('Cannot delete the last page', 'error');
      return;
    }
    var filtered = [];
    var deletedIndex = -1;
    for (var i = 0; i < pages.length; i++) {
      if (pages[i].id === pageId) { deletedIndex = i; }
      else filtered.push(pages[i]);
    }
    savePages(filtered);
    if (currentPageId === pageId) {
      currentPageId = filtered.length > 0 ? filtered[0].id : null;
    }
    window.showToast && window.showToast('Page deleted', 'success');
    renderNotebookView();
  }

  function startRename() {
    var titleInput = document.getElementById('nb-page-title');
    if (titleInput) {
      titleInput.focus();
      titleInput.select();
    }
  }

  function exportPage() {
    var pages = getPages();
    var page = null;
    for (var i = 0; i < pages.length; i++) {
      if (pages[i].id === currentPageId) { page = pages[i]; break; }
    }
    if (!page) return;
    var tempDiv = document.createElement('div');
    tempDiv.innerHTML = page.content;
    var textContent = tempDiv.textContent || tempDiv.innerText || '';
    var fullText = page.title + '\n\n' + textContent;
    var blob = new Blob([fullText], { type: 'text/plain' });
    var url = URL.createObjectURL(blob);
    var a = document.createElement('a');
    a.href = url;
    a.download = (page.title || 'notebook-page').replace(/[^a-zA-Z0-9]/g, '_') + '.txt';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    window.showToast && window.showToast('Page exported as text', 'success');
  }

  function saveCurrentPage() {
    if (!currentPageId) return;
    var pages = getPages();
    var titleInput = document.getElementById('nb-page-title');
    var editor = document.getElementById('nb-editor');
    for (var i = 0; i < pages.length; i++) {
      if (pages[i].id === currentPageId) {
        if (titleInput) pages[i].title = titleInput.value.trim() || 'Untitled Page';
        if (editor) pages[i].content = editor.innerHTML;
        pages[i].updated = new Date().toISOString();
        break;
      }
    }
    savePages(pages);
  }

  function renderSidebar(searchQuery) {
    var sidebarEl = document.getElementById('nb-sidebar-list');
    if (!sidebarEl) return;
    var pages = getPages();
    var q = (searchQuery || '').toLowerCase().trim();
    if (q) {
      var filtered = [];
      for (var fi = 0; fi < pages.length; fi++) {
        if ((pages[fi].title || '').toLowerCase().indexOf(q) !== -1) {
          filtered.push(pages[fi]);
        }
      }
      pages = filtered;
    }

    var html = '';
    for (var i = 0; i < pages.length; i++) {
      var pg = pages[i];
      var isActive = pg.id === currentPageId;
      html += '<div style="padding:var(--space-3);border-radius:var(--radius-md);cursor:pointer;margin-bottom:var(--space-1);background:' + (isActive ? 'rgba(59,130,246,0.1)' : 'transparent') + ';border:1px solid ' + (isActive ? 'rgba(59,130,246,0.2)' : 'transparent') + ';transition:all 0.2s" data-action="nb:select:' + pg.id + '">';
      html += '<div style="font-size:var(--text-sm);font-weight:' + (isActive ? '600' : '400') + ';color:var(--text-primary);white-space:nowrap;overflow:hidden;text-overflow:ellipsis;margin-bottom:2px">' + utils.sanitizeHTML(pg.title || 'Untitled') + '</div>';
      html += '<div style="font-size:10px;color:var(--text-tertiary)">' + utils.formatRelativeTime(new Date(pg.updated)) + '</div>';
      html += '</div>';
    }
    sidebarEl.innerHTML = html;
  }

  function renderNotebookView() {
    var mc = document.getElementById('main-content');
    if (!mc) return;
    var pages = getPages();
    var currentPage = null;
    if (!currentPageId && pages.length > 0) currentPageId = pages[0].id;
    for (var i = 0; i < pages.length; i++) {
      if (pages[i].id === currentPageId) { currentPage = pages[i]; break; }
    }
    if (!currentPage && pages.length > 0) {
      currentPage = pages[0];
      currentPageId = pages[0].id;
    }

    var html = '<div style="display:flex;height:calc(100vh - var(--header-height) - 60px);overflow:hidden">';

    html += '<div id="nb-sidebar" style="width:260px;border-right:1px solid var(--border-color);background:var(--bg-secondary);display:flex;flex-direction:column;flex-shrink:0">';
    html += '<div style="padding:var(--space-4);border-bottom:1px solid var(--border-color)">';
    html += '<div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:var(--space-3)">';
    html += '<h3 style="margin:0;font-size:var(--text-sm);font-weight:600;color:var(--text-primary)">Pages</h3>';
    html += '<button class="btn btn-primary btn-sm" style="padding:2px 10px;font-size:var(--text-xs)" data-action="nb:newPage">+ New</button>';
    html += '</div>';
    html += '<input type="text" class="input-field" id="nb-sidebar-search" placeholder="Search pages..." style="padding:var(--space-2) var(--space-3);font-size:var(--text-xs)" data-action="nb:searchPages">';
    html += '</div>';
    html += '<div id="nb-sidebar-list" style="flex:1;overflow-y:auto;padding:var(--space-2)">';
    html += '</div>';
    html += '</div>';

    html += '<div style="flex:1;display:flex;flex-direction:column;overflow:hidden">';
    if (currentPage) {
      html += '<div style="padding:var(--space-3) var(--space-4);border-bottom:1px solid var(--border-color);display:flex;align-items:center;justify-content:space-between">';
      html += '<input type="text" id="nb-page-title" value="' + utils.sanitizeHTML(currentPage.title) + '" style="background:none;border:none;font-size:var(--text-lg);font-weight:600;color:var(--text-primary);flex:1;outline:none;padding:var(--space-1) 0" placeholder="Page title">';
      html += '<div style="display:flex;gap:var(--space-2);flex-shrink:0">';
      html += '<button class="btn btn-ghost btn-sm" style="padding:4px 8px;font-size:var(--text-xs)" data-action="nb:renamePage" title="Rename">&#x270F;&#xFE0F;</button>';
      html += '<button class="btn btn-ghost btn-sm" style="padding:4px 8px;font-size:var(--text-xs)" data-action="nb:exportPage" title="Export">&#x1F4E5;</button>';
      html += '<button class="btn btn-ghost btn-sm" style="padding:4px 8px;font-size:var(--text-xs);color:var(--accent-red)" data-action="nb:deletePage:' + currentPage.id + '" title="Delete">&#x1F5D1;&#xFE0F;</button>';
      html += '</div></div>';

      html += '<div style="padding:var(--space-2) var(--space-4);border-bottom:1px solid var(--border-color);display:flex;gap:var(--space-1);flex-wrap:wrap">';
      var tools = [
        { cmd: 'bold', label: '<strong>B</strong>', title: 'Bold' },
        { cmd: 'italic', label: '<em>I</em>', title: 'Italic' },
        { cmd: 'underline', label: '<u>U</u>', title: 'Underline' },
        { cmd: 'insertUnorderedList', label: '&#x2022; List', title: 'Bullet List' },
        { cmd: 'formatBlock:h2', label: 'H2', title: 'Heading' },
        { cmd: 'formatBlock:p', label: 'P', title: 'Paragraph' }
      ];
      for (var ti = 0; ti < tools.length; ti++) {
        var tool = tools[ti];
        var action = 'nb:' + tool.cmd;
        html += '<button class="btn btn-ghost btn-sm" style="padding:4px 10px;font-size:var(--text-xs);min-width:36px" data-action="' + action + '" title="' + tool.title + '">' + tool.label + '</button>';
      }
      html += '</div>';

      html += '<div id="nb-editor" contenteditable="true" style="flex:1;padding:var(--space-5);overflow-y:auto;font-size:var(--text-sm);color:var(--text-primary);line-height:1.8;outline:none;min-height:200px">' + currentPage.content + '</div>';

      html += '<div style="padding:var(--space-2) var(--space-4);border-top:1px solid var(--border-color);font-size:10px;color:var(--text-tertiary);display:flex;justify-content:space-between">';
      html += '<span>Last saved ' + utils.formatRelativeTime(new Date(currentPage.updated)) + '</span>';
      html += '<span>Auto-save enabled</span>';
      html += '</div>';
    } else {
      html += '<div style="flex:1;display:flex;align-items:center;justify-content:center;flex-direction:column">';
      html += '<div style="font-size:48px;margin-bottom:var(--space-3)">&#x1F4D3;</div>';
      html += '<div style="font-weight:600;color:var(--text-primary);margin-bottom:var(--space-2)">No pages yet</div>';
      html += '<button class="btn btn-primary" data-action="nb:newPage">Create First Page</button>';
      html += '</div>';
    }

    html += '</div></div>';

    mc.innerHTML = html;
    mc.style.padding = '0';
    mc.style.maxWidth = 'none';

    renderSidebar();

    var editor = document.getElementById('nb-editor');
    if (editor) {
      editor.addEventListener('blur', function() {
        saveCurrentPage();
        renderSidebar();
      });
      editor.addEventListener('input', function() {
        if (saveTimer) clearTimeout(saveTimer);
        saveTimer = setTimeout(function() {
          saveCurrentPage();
          renderSidebar();
        }, 1500);
      });
    }

    var titleInput = document.getElementById('nb-page-title');
    if (titleInput) {
      titleInput.addEventListener('blur', function() {
        saveCurrentPage();
        renderSidebar();
      });
      titleInput.addEventListener('keydown', function(e) {
        if (e.key === 'Enter') {
          e.preventDefault();
          titleInput.blur();
          editor && editor.focus();
        }
      });
    }
  }

  if (window._currentPageCleanup) window._currentPageCleanup();
  window._currentPageCleanup = function() {
    saveCurrentPage();
    var mc = document.getElementById('main-content');
    if (mc) { mc.style.padding = ''; mc.style.maxWidth = ''; }
    if (saveTimer) { clearTimeout(saveTimer); saveTimer = null; }
  };

  window.renderPage.notebook = function() {
    currentPageId = null;
    renderNotebookView();
  };
})();
