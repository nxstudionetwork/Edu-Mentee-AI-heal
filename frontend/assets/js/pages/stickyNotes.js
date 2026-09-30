window.renderPage = window.renderPage || {};

(function() {
  var store = window.Store;
  var utils = window.Utils;

  if (!window._snDelegateAdded) {
    window._snDelegateAdded = true;
    document.addEventListener('click', function(e) {
      var t = e.target.closest('[data-action^="notes:"]');
      if (!t) return;
      var p = t.getAttribute('data-action').split(':');
      var c = p[1], arg = p.slice(2).join(':');
      if (c === 'add') { openEditor(); }
      else if (c === 'edit' && arg) { openEditor(arg); }
      else if (c === 'delete' && arg) { deleteNote(arg); }
      else if (c === 'pin' && arg) { togglePin(arg); }
      else if (c === 'save') { saveNote(); }
      else if (c === 'cancel') { closeEditor(); }
      else if (c === 'setColor' && arg) { setEditorColor(arg); }
      else if (c === 'search') { var q = document.getElementById('sn-search-input'); if (q) renderNotesList(q.value); }
    });
  }

  var COLORS = [
    { id: 'yellow', bg: 'rgba(245,158,11,0.12)', border: 'rgba(245,158,11,0.3)', accent: '#f59e0b' },
    { id: 'blue', bg: 'rgba(59,130,246,0.12)', border: 'rgba(59,130,246,0.3)', accent: '#3b82f6' },
    { id: 'green', bg: 'rgba(16,185,129,0.12)', border: 'rgba(16,185,129,0.3)', accent: '#10b981' },
    { id: 'pink', bg: 'rgba(236,72,153,0.12)', border: 'rgba(236,72,153,0.3)', accent: '#ec4899' },
    { id: 'purple', bg: 'rgba(139,92,246,0.12)', border: 'rgba(139,92,246,0.3)', accent: '#8b5cf6' },
    { id: 'orange', bg: 'rgba(249,115,22,0.12)', border: 'rgba(249,115,22,0.3)', accent: '#f97316' }
  ];

  var DEFAULT_NOTES = [
    { id: 'sn1', title: 'Quadratic Equations', content: 'ax\u00B2 + bx + c = 0\n\nQuadratic formula: x = (-b \u00B1 \u221A(b\u00B2-4ac)) / 2a\n\nDiscriminant: D = b\u00B2 - 4ac', color: 'yellow', pinned: true, created: '2026-07-10T10:00:00Z', updated: '2026-07-12T14:30:00Z' },
    { id: 'sn2', title: 'Newton\'s Laws', content: '1. Inertia: Object stays at rest or in uniform motion\n2. F = ma\n3. Every action has equal and opposite reaction', color: 'blue', pinned: false, created: '2026-07-09T08:00:00Z', updated: '2026-07-11T16:00:00Z' },
    { id: 'sn3', title: 'Chemistry Notes - Acids & Bases', content: 'pH scale: 0-14\nAcid: pH < 7\nBase: pH > 7\nNeutral: pH = 7\n\nStrong acids: HCl, H\u2082SO\u2084, HNO\u2083\nStrong bases: NaOH, KOH', color: 'green', pinned: false, created: '2026-07-08T12:00:00Z', updated: '2026-07-10T09:00:00Z' },
    { id: 'sn4', title: 'History - Mughal Empire', content: 'Founded: 1526 by Babur\nKey rulers: Akbar, Shah Jahan, Aurangzeb\nFamous monuments: Taj Mahal, Red Fort\nDecline: After Aurangzeb\'s death (1707)', color: 'pink', pinned: false, created: '2026-07-07T15:00:00Z', updated: '2026-07-09T11:00:00Z' },
    { id: 'sn5', title: 'English Grammar - Tenses', content: 'Present Simple: I study\nPresent Continuous: I am studying\nPast Simple: I studied\nPast Continuous: I was studying\nFuture Simple: I will study', color: 'purple', pinned: true, created: '2026-07-06T09:00:00Z', updated: '2026-07-08T17:00:00Z' },
    { id: 'sn6', title: 'Geography - Continents', content: '7 Continents:\n1. Asia - 44.58M km\u00B2\n2. Africa - 30.37M km\u00B2\n3. North America - 24.71M km\u00B2\n4. South America - 17.84M km\u00B2\n5. Antarctica - 14.2M km\u00B2\n6. Europe - 10.18M km\u00B2\n7. Australia - 8.53M km\u00B2', color: 'orange', pinned: false, created: '2026-07-05T14:00:00Z', updated: '2026-07-07T10:00:00Z' },
    { id: 'sn7', title: 'Python Basics', content: 'Variables: x = 10\nPrint: print("Hello")\nIf/else: if x > 5:\nFor loop: for i in range(10):\nList: arr = [1,2,3]\nFunction: def myFunc():', color: 'blue', pinned: false, created: '2026-07-04T11:00:00Z', updated: '2026-07-06T13:00:00Z' },
    { id: 'sn8', title: 'Biology - Cell Structure', content: 'Cell membrane - controls entry/exit\nNucleus - contains DNA\nMitochondria - energy production\nRibosomes - protein synthesis\nEndoplasmic reticulum - transport\nGolgi apparatus - packaging', color: 'green', pinned: false, created: '2026-07-03T16:00:00Z', updated: '2026-07-05T12:00:00Z' }
  ];

  var editingNoteId = null;
  var editorColor = 'yellow';

  function getNotes() {
    var notes = store.get('stickyNotes');
    if (!notes || notes.length === 0) {
      notes = DEFAULT_NOTES;
      store.set('stickyNotes', notes);
    }
    return notes;
  }

  function saveNotes(notes) {
    store.set('stickyNotes', notes);
  }

  function getColorData(colorId) {
    for (var i = 0; i < COLORS.length; i++) {
      if (COLORS[i].id === colorId) return COLORS[i];
    }
    return COLORS[0];
  }

  function openEditor(noteId) {
    editingNoteId = noteId || null;
    var note = null;
    if (noteId) {
      var notes = getNotes();
      for (var i = 0; i < notes.length; i++) {
        if (notes[i].id === noteId) { note = notes[i]; break; }
      }
    }
    editorColor = note ? note.color : 'yellow';

    var mc = document.getElementById('main-content');
    if (!mc) return;
    var overlay = document.createElement('div');
    overlay.className = 'modal-overlay';
    overlay.id = 'sn-editor-overlay';

    var title = note ? 'Edit Note' : 'New Note';
    var html = '<div class="modal" style="max-width:520px">';
    html += '<div class="modal-header"><h3>' + title + '</h3></div>';
    html += '<div class="modal-body">';
    html += '<div class="input-group" style="margin-bottom:var(--space-3)">';
    html += '<label class="input-label">Title</label>';
    html += '<input type="text" class="input-field" id="sn-edit-title" placeholder="Note title" value="' + (note ? utils.sanitizeHTML(note.title) : '') + '">';
    html += '</div>';
    html += '<div class="input-group" style="margin-bottom:var(--space-3)">';
    html += '<label class="input-label">Content</label>';
    html += '<textarea class="input-field" id="sn-edit-content" rows="6" placeholder="Write your note...">' + (note ? utils.sanitizeHTML(note.content) : '') + '</textarea>';
    html += '</div>';
    html += '<div class="input-group">';
    html += '<label class="input-label">Color</label>';
    html += '<div style="display:flex;gap:var(--space-2)">';
    for (var ci = 0; ci < COLORS.length; ci++) {
      var col = COLORS[ci];
      var sel = col.id === editorColor;
      html += '<div style="width:32px;height:32px;border-radius:50%;background:' + col.accent + ';cursor:pointer;border:3px solid ' + (sel ? 'white' : 'transparent') + ';transition:all 0.2s" data-action="notes:setColor:' + col.id + '"></div>';
    }
    html += '</div></div>';
    html += '</div>';
    html += '<div class="modal-footer">';
    html += '<button class="btn btn-ghost" data-action="notes:cancel">Cancel</button>';
    html += '<button class="btn btn-primary" data-action="notes:save">Save</button>';
    html += '</div></div>';

    overlay.innerHTML = html;
    document.body.appendChild(overlay);
    overlay.addEventListener('click', function(e) {
      if (e.target === overlay) closeEditor();
    });
    var titleInput = document.getElementById('sn-edit-title');
    if (titleInput) setTimeout(function() { titleInput.focus(); }, 100);
  }

  function setEditorColor(colorId) {
    editorColor = colorId;
    var overlay = document.getElementById('sn-editor-overlay');
    if (!overlay) return;
    var colorDots = overlay.querySelectorAll('[data-action^="notes:setColor:"]');
    for (var i = 0; i < colorDots.length; i++) {
      var dot = colorDots[i];
      var cid = dot.getAttribute('data-action').split(':')[2];
      dot.style.borderColor = cid === colorId ? 'white' : 'transparent';
    }
  }

  function saveNote() {
    var titleEl = document.getElementById('sn-edit-title');
    var contentEl = document.getElementById('sn-edit-content');
    if (!titleEl || !contentEl) return;
    var title = titleEl.value.trim();
    var content = contentEl.value.trim();
    if (!title) {
      window.showToast && window.showToast('Please enter a title', 'error');
      return;
    }
    var notes = getNotes();
    if (editingNoteId) {
      for (var i = 0; i < notes.length; i++) {
        if (notes[i].id === editingNoteId) {
          notes[i].title = title;
          notes[i].content = content;
          notes[i].color = editorColor;
          notes[i].updated = new Date().toISOString();
          break;
        }
      }
    } else {
      notes.unshift({
        id: 'sn_' + Date.now().toString(36),
        title: title,
        content: content,
        color: editorColor,
        pinned: false,
        created: new Date().toISOString(),
        updated: new Date().toISOString()
      });
    }
    saveNotes(notes);
    closeEditor();
    window.showToast && window.showToast(editingNoteId ? 'Note updated!' : 'Note created!', 'success');
    renderNotesList();
  }

  function deleteNote(noteId) {
    window.UI && window.UI.showConfirm
      ? window.UI.showConfirm('Delete Note', 'Are you sure you want to delete this note?', {
          confirmText: 'Delete',
          danger: true,
          onConfirm: function() {
            var notes = getNotes();
            var filtered = [];
            for (var i = 0; i < notes.length; i++) {
              if (notes[i].id !== noteId) filtered.push(notes[i]);
            }
            saveNotes(filtered);
            window.showToast && window.showToast('Note deleted', 'success');
            renderNotesList();
          }
        })
      : (function() {
          var notes = getNotes();
          var filtered = [];
          for (var i = 0; i < notes.length; i++) {
            if (notes[i].id !== noteId) filtered.push(notes[i]);
          }
          saveNotes(filtered);
          window.showToast && window.showToast('Note deleted', 'success');
          renderNotesList();
        })();
  }

  function togglePin(noteId) {
    var notes = getNotes();
    for (var i = 0; i < notes.length; i++) {
      if (notes[i].id === noteId) {
        notes[i].pinned = !notes[i].pinned;
        notes[i].updated = new Date().toISOString();
        break;
      }
    }
    saveNotes(notes);
    renderNotesList();
  }

  function closeEditor() {
    var overlay = document.getElementById('sn-editor-overlay');
    if (overlay) overlay.remove();
    editingNoteId = null;
  }

  function renderNotesList(searchQuery) {
    var mc = document.getElementById('main-content');
    if (!mc) return;
    var notes = getNotes();
    var q = (searchQuery || '').toLowerCase().trim();
    if (q) {
      var filtered = [];
      for (var fi = 0; fi < notes.length; fi++) {
        if ((notes[fi].title || '').toLowerCase().indexOf(q) !== -1 || (notes[fi].content || '').toLowerCase().indexOf(q) !== -1) {
          filtered.push(notes[fi]);
        }
      }
      notes = filtered;
    }

    var pinned = [];
    var unpinned = [];
    for (var ni = 0; ni < notes.length; ni++) {
      if (notes[ni].pinned) pinned.push(notes[ni]);
      else unpinned.push(notes[ni]);
    }
    var sorted = pinned.concat(unpinned);

    var html = '<div style="padding:var(--space-5);max-width:1200px;margin:0 auto;">';
    html += '<div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:var(--space-5);flex-wrap:wrap;gap:var(--space-3)">';
    html += '<div><h2 style="font-size:var(--text-xl);font-weight:700;color:var(--text-primary);margin:0">&#x1F4DD; Sticky Notes</h2>';
    html += '<p style="font-size:var(--text-sm);color:var(--text-tertiary);margin:var(--space-1) 0 0 0">' + notes.length + ' note' + (notes.length !== 1 ? 's' : '') + '</p></div>';
    html += '<div style="display:flex;gap:var(--space-3)">';
    html += '<input type="text" class="input-field" id="sn-search-input" placeholder="Search notes..." style="width:200px;padding:var(--space-2) var(--space-3);font-size:var(--text-sm)" value="' + (searchQuery ? utils.sanitizeHTML(searchQuery) : '') + '" data-action="notes:search">';
    html += '<button class="btn btn-primary btn-sm" data-action="notes:add">+ New Note</button>';
    html += '</div></div>';

    if (pinned.length > 0 && unpinned.length > 0) {
      html += '<div style="font-size:var(--text-xs);color:var(--text-tertiary);text-transform:uppercase;letter-spacing:1px;font-weight:600;margin-bottom:var(--space-3)">Pinned</div>';
    }

    html += '<div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(240px,1fr));gap:var(--space-4)">';

    var renderCard = function(note) {
      var col = getColorData(note.color);
      html += '<div class="glass-card" style="padding:var(--space-4);border-left:4px solid ' + col.accent + ';background:' + col.bg + ';position:relative">';
      html += '<div style="display:flex;align-items:start;justify-content:space-between;margin-bottom:var(--space-2)">';
      html += '<h4 style="margin:0;font-weight:600;color:var(--text-primary);font-size:var(--text-sm);flex:1;min-width:0;white-space:nowrap;overflow:hidden;text-overflow:ellipsis">' + utils.sanitizeHTML(note.title) + '</h4>';
      html += '<div style="display:flex;gap:var(--space-1);flex-shrink:0">';
      html += '<button class="btn btn-ghost" style="padding:2px 6px;font-size:12px" data-action="notes:pin:' + note.id + '" title="' + (note.pinned ? 'Unpin' : 'Pin') + '">' + (note.pinned ? '&#x1F4CC;' : '&#x1F4CB;') + '</button>';
      html += '<button class="btn btn-ghost" style="padding:2px 6px;font-size:12px" data-action="notes:edit:' + note.id + '" title="Edit">&#x270F;&#xFE0F;</button>';
      html += '<button class="btn btn-ghost" style="padding:2px 6px;font-size:12px;color:var(--accent-red)" data-action="notes:delete:' + note.id + '" title="Delete">&#x1F5D1;&#xFE0F;</button>';
      html += '</div></div>';
      html += '<div style="font-size:var(--text-xs);color:var(--text-secondary);line-height:1.5;white-space:pre-wrap;max-height:120px;overflow:hidden;margin-bottom:var(--space-2)">' + utils.sanitizeHTML(utils.truncate(note.content, 200)) + '</div>';
      html += '<div style="font-size:10px;color:var(--text-tertiary)">Updated ' + utils.formatRelativeTime(new Date(note.updated)) + '</div>';
      html += '</div>';
    };

    for (var pi = 0; pi < pinned.length; pi++) {
      renderCard(pinned[pi]);
    }

    if (pinned.length > 0 && unpinned.length > 0) {
      html += '</div></div>';
      html += '<div style="font-size:var(--text-xs);color:var(--text-tertiary);text-transform:uppercase;letter-spacing:1px;font-weight:600;margin:var(--space-5) 0 var(--space-3) 0">Notes</div>';
      html += '<div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(240px,1fr));gap:var(--space-4)">';
    }

    for (var ui = 0; ui < unpinned.length; ui++) {
      renderCard(unpinned[ui]);
    }

    html += '</div>';

    if (sorted.length === 0) {
      html += '<div style="text-align:center;padding:var(--space-8) 0">';
      html += '<div style="font-size:48px;margin-bottom:var(--space-3)">&#x1F4DD;</div>';
      html += '<div style="font-weight:600;color:var(--text-primary);margin-bottom:var(--space-2)">' + (q ? 'No notes found' : 'No notes yet') + '</div>';
      html += '<div style="font-size:var(--text-sm);color:var(--text-tertiary);margin-bottom:var(--space-4)">' + (q ? 'Try a different search' : 'Create your first sticky note!') + '</div>';
      if (!q) html += '<button class="btn btn-primary" data-action="notes:add">+ Create Note</button>';
      html += '</div>';
    }

    html += '</div>';
    mc.innerHTML = html;

    var searchInput = document.getElementById('sn-search-input');
    if (searchInput) {
      var doSearch = utils.debounce(function() {
        renderNotesList(searchInput.value);
      }, 300);
      searchInput.addEventListener('input', doSearch);
    }
  }

  window.renderPage.stickyNotes = function() {
    renderNotesList();
  };
})();
