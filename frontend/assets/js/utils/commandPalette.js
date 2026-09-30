(function() {
  var styleId = 'cp-styles';
  if (!document.getElementById(styleId)) {
    var style = document.createElement('style');
    style.id = styleId;
    style.textContent = '\
#command-palette-overlay {\
  position: fixed;\
  inset: 0;\
  z-index: 9999;\
  background: rgba(0,0,0,0.6);\
  display: flex;\
  align-items: flex-start;\
  justify-content: center;\
  padding-top: 10vh;\
  opacity: 0;\
  transition: opacity 0.2s ease;\
}\
#command-palette-overlay.open {\
  opacity: 1;\
}\
#command-palette-overlay.open #command-palette-modal {\
  transform: translateY(0);\
}\
#command-palette-modal {\
  width: 100%;\
  max-width: 600px;\
  max-height: 70vh;\
  background: rgba(30,30,40,0.95);\
  backdrop-filter: blur(16px);\
  -webkit-backdrop-filter: blur(16px);\
  border-radius: 16px;\
  box-shadow: 0 16px 48px rgba(0,0,0,0.4), 0 0 0 1px rgba(255,255,255,0.06);\
  display: flex;\
  flex-direction: column;\
  overflow: hidden;\
  transform: translateY(-20px);\
  transition: transform 0.2s ease;\
}\
.cp-input-wrap {\
  padding: 16px 20px 12px;\
  border-bottom: 1px solid rgba(255,255,255,0.08);\
}\
.cp-input {\
  width: 100%;\
  font-size: 18px;\
  padding: 10px 0;\
  border: none;\
  background: transparent;\
  color: #fff;\
  outline: none;\
  font-family: inherit;\
}\
.cp-input::placeholder {\
  color: rgba(255,255,255,0.35);\
}\
.cp-results {\
  flex: 1;\
  overflow-y: auto;\
  padding: 8px 0;\
}\
.cp-results::-webkit-scrollbar {\
  width: 6px;\
}\
.cp-results::-webkit-scrollbar-track {\
  background: transparent;\
}\
.cp-results::-webkit-scrollbar-thumb {\
  background: rgba(255,255,255,0.15);\
  border-radius: 3px;\
}\
.cp-section-header {\
  padding: 8px 20px 4px;\
  font-size: 11px;\
  font-weight: 700;\
  text-transform: uppercase;\
  letter-spacing: 0.08em;\
  color: rgba(255,255,255,0.35);\
}\
.cp-item {\
  display: flex;\
  align-items: center;\
  padding: 8px 20px;\
  cursor: pointer;\
  transition: background 0.1s;\
  gap: 12px;\
}\
.cp-item:hover,\
.cp-item.active {\
  background: rgba(255,255,255,0.08);\
}\
.cp-item-icon {\
  font-size: 16px;\
  width: 24px;\
  text-align: center;\
  flex-shrink: 0;\
}\
.cp-item-label {\
  flex: 1;\
  font-size: 14px;\
  color: #e0e0e0;\
  white-space: nowrap;\
  overflow: hidden;\
  text-overflow: ellipsis;\
}\
.cp-item-label var.highlight {\
  display: inline;\
}\
.cp-highlight {\
  color: #60a5fa;\
  font-style: normal;\
}\
.cp-item-shortcut {\
  font-size: 11px;\
  color: rgba(255,255,255,0.3);\
  background: rgba(255,255,255,0.08);\
  padding: 2px 6px;\
  border-radius: 4px;\
  font-family: inherit;\
  flex-shrink: 0;\
}\
.cp-empty {\
  padding: 32px 20px;\
  text-align: center;\
  color: rgba(255,255,255,0.35);\
  font-size: 14px;\
}\
@media (max-width: 640px) {\
  #command-palette-overlay {\
    padding-top: 0;\
    align-items: stretch;\
  }\
  #command-palette-modal {\
    max-width: 100%;\
    max-height: 100vh;\
    border-radius: 0;\
    transform: none;\
  }\
}';
    document.head.appendChild(style);
  }

  var store = window.Store;
  var router = window.Router;
  var utils = window.Utils;

  var activeIndex = -1;
  var currentResults = [];
  var overlay = null;

  function getUserClass() {
    var user = store.get('user');
    return user && user.class ? user.class : 6;
  }

  var commands = [
    { section: 'Navigation', icon: '\uD83D\uDCCA', label: 'Go to Dashboard', path: '/dashboard' },
    { section: 'Navigation', icon: '\uD83D\uDCDA', label: 'Open Subjects', path: '/dashboard/' + getUserClass() },
    { section: 'Navigation', icon: '\uD83C\uDFAC', label: 'Go to Videos', path: '/videos' },
    { section: 'Navigation', icon: '\uD83D\uDCC4', label: 'Go to Resources', path: '/resources' },
    { section: 'Navigation', icon: '\uD83D\uDCDD', label: 'Go to Quizzes', path: '/quizzes' },
    { section: 'Navigation', icon: '\uD83D\uDCCB', label: 'Go to Exams', path: '/exams' },
    { section: 'Navigation', icon: '\uD83D\uDECD\uFE0F', label: 'Go to Marketplace', path: '/marketplace' },
    { section: 'Navigation', icon: '\uD83D\uDCAC', label: 'Go to Community', path: '/community' },
    { section: 'Navigation', icon: '\uD83D\uDCF1', label: 'Go to Social Feed', path: '/feed' },
    { section: 'Navigation', icon: '\uD83D\uDCC5', label: 'Go to Calendar', path: '/calendar' },
    { section: 'Navigation', icon: '\uD83E\uDD16', label: 'Open AI Helper', path: '/ai-helper' },
    { section: 'Navigation', icon: '\uD83D\uDC68\u200D\uD83C\uDFEB', label: 'Ask Teacher', path: '/ask-teacher' },
    { section: 'Navigation', icon: '\uD83D\uDCC8', label: 'Go to Analytics', path: '/analytics' },
    { section: 'Navigation', icon: '\uD83C\uDFAF', label: 'Go to Career', path: '/career' },
    { section: 'Navigation', icon: '\uD83C\uDF93', label: 'Go to Scholarships', path: '/scholarship' },
    { section: 'Navigation', icon: '\uD83D\uDC64', label: 'View Profile', path: '/profile' },
    { section: 'Navigation', icon: '\u2699\uFE0F', label: 'Open Settings', path: '/settings' },
    { section: 'Navigation', icon: '\uD83D\uDD14', label: 'View Notifications', path: '/notifications' },
    { section: 'Navigation', icon: '\u2709\uFE0F', label: 'Open Messages', path: '/messages' },
    { section: 'Navigation', icon: '\uD83D\uDCFA', label: 'Live Classes', path: '/live-classes' },
    { section: 'Actions', icon: '\uD83C\uDF19', label: 'Toggle Theme', action: 'toggleTheme' },
    { section: 'Actions', icon: '\uD83D\uDEAA', label: 'Logout', action: 'logout' },
    { section: 'Actions', icon: '\u2753', label: 'Show Keyboard Shortcuts', action: 'showShortcuts' },
    { section: 'Quick Search', icon: '\uD83D\uDD0D', label: 'Search Resources...', action: 'focusSearch' },
    { section: 'Quick Search', icon: '\uD83C\uDFAC', label: 'Search Videos...', action: 'focusSearch' },
    { section: 'Quick Search', icon: '\uD83D\uDC65', label: 'Search Community...', action: 'focusSearch' }
  ];

  function getClassPath() {
    return '/dashboard/' + getUserClass();
  }

  function highlightText(text, query) {
    if (!query || !query.trim()) return utils.sanitizeHTML(text);
    var lower = text.toLowerCase();
    var q = query.toLowerCase();
    var idx = lower.indexOf(q);
    if (idx === -1) return utils.sanitizeHTML(text);
    var before = utils.sanitizeHTML(text.slice(0, idx));
    var match = utils.sanitizeHTML(text.slice(idx, idx + q.length));
    var after = utils.sanitizeHTML(text.slice(idx + q.length));
    return before + '<span class="cp-highlight">' + match + '</span>' + after;
  }

  function filterCommands(query) {
    var q = (query || '').trim().toLowerCase();
    if (!q) return commands;
    var result = [];
    for (var i = 0; i < commands.length; i++) {
      var cmd = commands[i];
      var labelLower = cmd.label.toLowerCase();
      var sectionLower = cmd.section.toLowerCase();
      if (labelLower.indexOf(q) !== -1 || sectionLower.indexOf(q) !== -1) {
        result.push(cmd);
      }
    }
    return result;
  }

  function executeCommand(cmd) {
    closePalette();
    if (cmd.path) {
      var targetPath = cmd.path;
      if (targetPath.indexOf('/dashboard/') === 0 && targetPath === '/dashboard/' + getUserClass() && cmd.label === 'Open Subjects') {
        targetPath = getClassPath();
      }
      router.navigate(targetPath);
    } else if (cmd.action === 'toggleTheme') {
      window.App.toggleTheme();
    } else if (cmd.action === 'logout') {
      window.App.logout();
    } else if (cmd.action === 'showShortcuts') {
      var hint = document.getElementById('shortcut-hint');
      if (hint) hint.classList.add('open');
    } else if (cmd.action === 'focusSearch') {
      var searchInput = document.querySelector('.header-search input');
      if (searchInput) {
        window.App.openSearch();
      } else {
        window.App.openSearch();
      }
    }
  }

  function closePalette() {
    activeIndex = -1;
    currentResults = [];
    if (overlay) {
      overlay.classList.remove('open');
      var self = overlay;
      setTimeout(function() {
        if (self.parentNode) self.parentNode.removeChild(self);
      }, 200);
      overlay = null;
    }
  }

  function renderResults(results, query) {
    var html = '';
    var currentSection = '';
    for (var i = 0; i < results.length; i++) {
      var cmd = results[i];
      if (cmd.section !== currentSection) {
        currentSection = cmd.section;
        html += '<div class="cp-section-header">' + utils.sanitizeHTML(currentSection) + '</div>';
      }
      var labelHtml = highlightText(cmd.label, query);
      html += '<div class="cp-item" data-action="cp:select" data-index="' + i + '">\
  <span class="cp-item-icon">' + cmd.icon + '</span>\
  <span class="cp-item-label">' + labelHtml + '</span>\
  <span class="cp-item-shortcut">Go</span>\
</div>';
    }
    if (results.length === 0) {
      html += '<div class="cp-empty">No results found</div>';
    }
    return html;
  }

  function updateActive(container, index) {
    var items = container.querySelectorAll('.cp-item');
    for (var i = 0; i < items.length; i++) {
      items[i].classList.toggle('active', i === index);
    }
    if (index >= 0 && items[index]) {
      items[index].scrollIntoView({ block: 'nearest' });
    }
  }

  window.CommandPalette = {
    _click: function(index) {
      if (currentResults[index]) {
        executeCommand(currentResults[index]);
      }
    },
    open: function() {
      if (store.get('isAuthenticated') !== true) return;
      if (overlay) {
        closePalette();
        return;
      }
      activeIndex = -1;
      currentResults = commands.slice();
      var subjectsCmd = null;
      for (var i = 0; i < commands.length; i++) {
        if (commands[i].label === 'Open Subjects') {
          subjectsCmd = commands[i];
          break;
        }
      }
      if (subjectsCmd) subjectsCmd.path = getClassPath();

      overlay = document.createElement('div');
      overlay.id = 'command-palette-overlay';
      overlay.innerHTML = '\
<div id="command-palette-modal">\
  <div class="cp-input-wrap">\
    <input type="text" class="cp-input" id="cp-input" placeholder="Type a command or search..." autofocus>\
  </div>\
  <div class="cp-results" id="cp-results">\
    ' + renderResults(currentResults, '') + '\
  </div>\
</div>';
      document.body.appendChild(overlay);

      requestAnimationFrame(function() {
        overlay.classList.add('open');
      });

      overlay.addEventListener('click', function(e) {
        if (e.target === overlay) closePalette();
      });

      var input = document.getElementById('cp-input');
      var resultsContainer = document.getElementById('cp-results');

      if (input) {
        setTimeout(function() { input.focus(); }, 50);
        resultsContainer.addEventListener('click', function(e) {
          var item = e.target.closest('.cp-item');
          if (item) {
            var idx = parseInt(item.getAttribute('data-index'));
            if (!isNaN(idx) && currentResults[idx]) {
              executeCommand(currentResults[idx]);
            }
          }
        });
        input.addEventListener('input', function() {
          var query = input.value;
          currentResults = filterCommands(query);
          resultsContainer.innerHTML = renderResults(currentResults, query);
          activeIndex = -1;
          updateActive(resultsContainer, -1);
        });
        input.addEventListener('keydown', function(e) {
          if (e.key === 'Escape') {
            e.preventDefault();
            closePalette();
            return;
          }
          if (e.key === 'ArrowDown') {
            e.preventDefault();
            if (currentResults.length === 0) return;
            activeIndex = (activeIndex + 1) % currentResults.length;
            updateActive(resultsContainer, activeIndex);
            return;
          }
          if (e.key === 'ArrowUp') {
            e.preventDefault();
            if (currentResults.length === 0) return;
            activeIndex = activeIndex <= 0 ? currentResults.length - 1 : activeIndex - 1;
            updateActive(resultsContainer, activeIndex);
            return;
          }
          if (e.key === 'Enter') {
            e.preventDefault();
            if (activeIndex >= 0 && activeIndex < currentResults.length) {
              executeCommand(currentResults[activeIndex]);
            } else if (currentResults.length > 0) {
              executeCommand(currentResults[0]);
            }
            return;
          }
        });
      }
    }
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initShortcut);
  } else {
    initShortcut();
  }

  function initShortcut() {
    if (document._cpKeyboardInitialized) return;
    document._cpKeyboardInitialized = true;
    document.addEventListener('keydown', function(e) {
      if ((e.ctrlKey || e.metaKey) && (e.key === 'k' || e.key === 'K')) {
        e.preventDefault();
        e.stopImmediatePropagation();
        window.CommandPalette.open();
      }
    });
  }
})();
