window.FilterDrawer = (function() {
  var stylesInjected = false;

  var STYLE_ID = 'filter-drawer-styles';

  var filterValues = {};
  var currentOptions = null;

  function injectStyles() {
    if (stylesInjected) return;
    if (document.getElementById(STYLE_ID)) {
      stylesInjected = true;
      return;
    }
    var css = '\
#filter-drawer-overlay {\
  position: fixed;\
  top: 0;\
  left: 0;\
  width: 100%;\
  height: 100%;\
  background: rgba(0, 0, 0, 0.6);\
  z-index: 10000;\
  opacity: 0;\
  visibility: hidden;\
  transition: opacity 0.3s ease, visibility 0.3s ease;\
}\
#filter-drawer-overlay.open {\
  opacity: 1;\
  visibility: visible;\
}\
#filter-drawer-panel {\
  position: fixed;\
  top: 0;\
  right: -100%;\
  width: 320px;\
  height: 100%;\
  background: var(--bg-secondary, #111827);\
  border-left: 1px solid var(--border-color, rgba(255,255,255,0.08));\
  box-shadow: var(--shadow-xl, 0 16px 48px rgba(0,0,0,0.6));\
  z-index: 10001;\
  display: flex;\
  flex-direction: column;\
  transition: right 0.35s cubic-bezier(0.4, 0, 0.2, 1);\
}\
#filter-drawer-overlay.open #filter-drawer-panel {\
  right: 0;\
}\
.filter-drawer-header {\
  display: flex;\
  align-items: center;\
  justify-content: space-between;\
  padding: var(--space-5, 1.25rem) var(--space-6, 1.5rem);\
  border-bottom: 1px solid var(--border-color, rgba(255,255,255,0.08));\
  flex-shrink: 0;\
}\
.filter-drawer-header h3 {\
  margin: 0;\
  font-size: var(--text-lg, 1.125rem);\
  font-weight: 600;\
  color: var(--text-primary, #f1f5f9);\
}\
.filter-drawer-close {\
  background: none;\
  border: none;\
  color: var(--text-secondary, #94a3b8);\
  font-size: 1.25rem;\
  cursor: pointer;\
  padding: 4px 8px;\
  border-radius: var(--radius-sm, 8px);\
  transition: background 0.2s, color 0.2s;\
}\
.filter-drawer-close:hover {\
  background: var(--bg-glass-hover, rgba(255,255,255,0.1));\
  color: var(--text-primary, #f1f5f9);\
}\
.filter-drawer-body {\
  flex: 1;\
  overflow-y: auto;\
  padding: var(--space-4, 1rem) var(--space-6, 1.5rem);\
}\
.filter-drawer-body::-webkit-scrollbar {\
  width: 4px;\
}\
.filter-drawer-body::-webkit-scrollbar-track {\
  background: transparent;\
}\
.filter-drawer-body::-webkit-scrollbar-thumb {\
  background: var(--text-muted, #475569);\
  border-radius: 4px;\
}\
.filter-drawer-footer {\
  display: flex;\
  gap: var(--space-3, 0.75rem);\
  padding: var(--space-4, 1rem) var(--space-6, 1.5rem);\
  border-top: 1px solid var(--border-color, rgba(255,255,255,0.08));\
  flex-shrink: 0;\
}\
.filter-drawer-footer .btn {\
  flex: 1;\
}\
.filter-group {\
  margin-bottom: var(--space-6, 1.5rem);\
}\
.filter-group-title {\
  font-size: var(--text-sm, 0.875rem);\
  font-weight: 600;\
  color: var(--text-primary, #f1f5f9);\
  margin-bottom: var(--space-3, 0.75rem);\
  text-transform: uppercase;\
  letter-spacing: 0.5px;\
}\
.filter-search-wrapper {\
  position: relative;\
}\
.filter-search-wrapper .filter-search-icon {\
  position: absolute;\
  left: 12px;\
  top: 50%;\
  transform: translateY(-50%);\
  color: var(--text-tertiary, #64748b);\
  font-size: 0.875rem;\
  pointer-events: none;\
}\
.filter-search-wrapper input {\
  width: 100%;\
  padding: 0.625rem 0.75rem 0.625rem 2.25rem;\
  background: var(--bg-tertiary, #1a2332);\
  border: 1px solid var(--border-color, rgba(255,255,255,0.08));\
  border-radius: var(--radius-sm, 8px);\
  color: var(--text-primary, #f1f5f9);\
  font-size: var(--text-sm, 0.875rem);\
  outline: none;\
  transition: border-color 0.2s;\
  box-sizing: border-box;\
}\
.filter-search-wrapper input:focus {\
  border-color: var(--accent-blue, #3b82f6);\
}\
.filter-search-wrapper input::placeholder {\
  color: var(--text-tertiary, #64748b);\
}\
.filter-checkbox-list {\
  display: flex;\
  flex-direction: column;\
  gap: 2px;\
}\
.filter-checkbox-item {\
  display: flex;\
  align-items: center;\
  gap: var(--space-2, 0.5rem);\
  padding: 6px 8px;\
  border-radius: var(--radius-sm, 8px);\
  cursor: pointer;\
  transition: background 0.2s;\
}\
.filter-checkbox-item:hover {\
  background: var(--bg-glass, rgba(255,255,255,0.06));\
}\
.filter-checkbox-item input[type="checkbox"] {\
  accent-color: var(--accent-blue, #3b82f6);\
  flex-shrink: 0;\
}\
.filter-checkbox-item .filter-checkbox-icon {\
  font-size: 1rem;\
  flex-shrink: 0;\
}\
.filter-checkbox-item .filter-checkbox-label {\
  font-size: var(--text-sm, 0.875rem);\
  color: var(--text-primary, #f1f5f9);\
  flex: 1;\
}\
.filter-checkbox-item .filter-checkbox-count {\
  font-size: var(--text-xs, 0.75rem);\
  color: var(--text-tertiary, #64748b);\
}\
.filter-checkbox-actions {\
  display: flex;\
  gap: var(--space-3, 0.75rem);\
  margin-top: var(--space-1, 0.25rem);\
  margin-bottom: var(--space-1, 0.25rem);\
}\
.filter-checkbox-actions button {\
  background: none;\
  border: none;\
  color: var(--accent-blue, #3b82f6);\
  font-size: var(--text-xs, 0.75rem);\
  cursor: pointer;\
  padding: 2px 4px;\
}\
.filter-checkbox-actions button:hover {\
  text-decoration: underline;\
}\
.filter-radio-group {\
  display: flex;\
  flex-direction: column;\
  gap: 2px;\
}\
.filter-radio-item {\
  display: flex;\
  align-items: center;\
  gap: var(--space-2, 0.5rem);\
  padding: 6px 8px;\
  border-radius: var(--radius-sm, 8px);\
  cursor: pointer;\
  transition: background 0.2s;\
}\
.filter-radio-item:hover {\
  background: var(--bg-glass, rgba(255,255,255,0.06));\
}\
.filter-radio-item input[type="radio"] {\
  accent-color: var(--accent-blue, #3b82f6);\
  flex-shrink: 0;\
}\
.filter-radio-item .filter-radio-label {\
  font-size: var(--text-sm, 0.875rem);\
  color: var(--text-primary, #f1f5f9);\
}\
.filter-range-inputs {\
  display: flex;\
  gap: var(--space-2, 0.5rem);\
  align-items: center;\
}\
.filter-range-inputs label {\
  font-size: var(--text-xs, 0.75rem);\
  color: var(--text-secondary, #94a3b8);\
  flex-shrink: 0;\
}\
.filter-range-inputs input {\
  flex: 1;\
  padding: 0.5rem 0.625rem;\
  background: var(--bg-tertiary, #1a2332);\
  border: 1px solid var(--border-color, rgba(255,255,255,0.08));\
  border-radius: var(--radius-sm, 8px);\
  color: var(--text-primary, #f1f5f9);\
  font-size: var(--text-sm, 0.875rem);\
  outline: none;\
  transition: border-color 0.2s;\
  box-sizing: border-box;\
  width: 0;\
}\
.filter-range-inputs input:focus {\
  border-color: var(--accent-blue, #3b82f6);\
}\
.filter-range-inputs input::placeholder {\
  color: var(--text-tertiary, #64748b);\
}\
.filter-dropdown select {\
  width: 100%;\
  padding: 0.625rem 0.75rem;\
  background: var(--bg-tertiary, #1a2332);\
  border: 1px solid var(--border-color, rgba(255,255,255,0.08));\
  border-radius: var(--radius-sm, 8px);\
  color: var(--text-primary, #f1f5f9);\
  font-size: var(--text-sm, 0.875rem);\
  outline: none;\
  transition: border-color 0.2s;\
  cursor: pointer;\
  box-sizing: border-box;\
  -webkit-appearance: none;\
  -moz-appearance: none;\
  appearance: none;\
  background-image: url("data:image/svg+xml,%3Csvg xmlns=%27http://www.w3.org/2000/svg%27 width=%2712%27 height=%2712%27 viewBox=%270 0 24 24%27 fill=%27none%27 stroke=%27%2364748b%27 stroke-width=%272%27 stroke-linecap=%27round%27 stroke-linejoin=%27round%27%3E%3Cpolyline points=%276 9 12 15 18 9%27%3E%3C/polyline%3E%3C/svg%3E");\
  background-repeat: no-repeat;\
  background-position: right 10px center;\
  padding-right: 2rem;\
}\
.filter-dropdown select:focus {\
  border-color: var(--accent-blue, #3b82f6);\
}\
.filter-dropdown select option {\
  background: var(--bg-secondary, #111827);\
  color: var(--text-primary, #f1f5f9);\
}\
@media (max-width: 640px) {\
  #filter-drawer-panel {\
    width: 100%;\
    right: -100%;\
  }\
}';

    var style = document.createElement('style');
    style.id = STYLE_ID;
    style.textContent = css;
    document.head.appendChild(style);
    stylesInjected = true;
  }

  function renderCheckboxFilter(group) {
    var options = group.options || [];
    var values = group.value || [];
    if (typeof values === 'string') values = [];
    if (!Array.isArray(values)) values = [];

    var html = '<div class="filter-checkbox-actions">\
  <button type="button" data-select-all="' + group.id + '">Select All</button>\
  <button type="button" data-clear-all="' + group.id + '">Clear</button>\
</div>\
<div class="filter-checkbox-list" data-filter-group="' + group.id + '">';

    for (var i = 0; i < options.length; i++) {
      var opt = options[i];
      var checked = values.indexOf(opt.value) !== -1;
      html += '\
  <label class="filter-checkbox-item">\
    ' + (opt.icon ? '<span class="filter-checkbox-icon">' + opt.icon + '</span>' : '') + '\
    <input type="checkbox" value="' + opt.value.replace(/"/g, '&quot;') + '" ' + (checked ? 'checked' : '') + '>\
    <span class="filter-checkbox-label">' + (opt.label || opt.value) + '</span>\
    ' + (opt.count !== undefined ? '<span class="filter-checkbox-count">' + opt.count + '</span>' : '') + '\
  </label>';
    }

    html += '</div>';
    return html;
  }

  function renderRadioFilter(group) {
    var options = group.options || [];
    var value = group.value;
    if (value === undefined || value === null) value = '';

    var html = '<div class="filter-radio-group" data-filter-group="' + group.id + '">';

    for (var i = 0; i < options.length; i++) {
      var opt = options[i];
      var checked = String(opt.value) === String(value);
      html += '\
  <label class="filter-radio-item">\
    <input type="radio" name="filter-radio-' + group.id + '" value="' + opt.value.replace(/"/g, '&quot;') + '" ' + (checked ? 'checked' : '') + '>\
    <span class="filter-radio-label">' + (opt.label || opt.value) + '</span>\
  </label>';
    }

    html += '</div>';
    return html;
  }

  function renderRangeFilter(group) {
    var value = group.value || {};
    var min = value.min !== undefined ? value.min : '';
    var max = value.max !== undefined ? value.max : '';

    return '\
<div class="filter-range-inputs" data-filter-group="' + group.id + '">\
  <label>' + (group.minLabel || 'Min') + '</label>\
  <input type="number" class="filter-range-min" placeholder="' + (group.minPlaceholder || 'Min') + '" value="' + min + '">\
  <label>' + (group.maxLabel || 'Max') + '</label>\
  <input type="number" class="filter-range-max" placeholder="' + (group.maxPlaceholder || 'Max') + '" value="' + max + '">\
</div>';
  }

  function renderSearchFilter(group) {
    var value = group.value || '';

    return '\
<div class="filter-search-wrapper">\
  <span class="filter-search-icon">\uD83D\uDD0D</span>\
  <input type="text" class="filter-search-input" placeholder="' + (group.placeholder || 'Search...') + '" value="' + value.replace(/"/g, '&quot;') + '">\
</div>';
  }

  function renderDropdownFilter(group) {
    var options = group.options || [];
    var value = group.value;
    if (value === undefined || value === null) value = '';

    var html = '<div class="filter-dropdown" data-filter-group="' + group.id + '">\
  <select>\
    <option value="">' + (group.placeholder || 'Select...') + '</option>';

    for (var i = 0; i < options.length; i++) {
      var opt = options[i];
      var selected = String(opt.value) === String(value);
      html += '\
    <option value="' + opt.value.replace(/"/g, '&quot;') + '" ' + (selected ? 'selected' : '') + '>' + (opt.label || opt.value) + '</option>';
    }

    html += '\
  </select>\
</div>';
    return html;
  }

  function renderFilterGroup(group) {
    var type = group.type || 'checkbox';
    var groupHtml;

    switch (type) {
      case 'checkbox':
        groupHtml = renderCheckboxFilter(group);
        break;
      case 'radio':
        groupHtml = renderRadioFilter(group);
        break;
      case 'range':
        groupHtml = renderRangeFilter(group);
        break;
      case 'search':
        groupHtml = renderSearchFilter(group);
        break;
      case 'dropdown':
        groupHtml = renderDropdownFilter(group);
        break;
      default:
        groupHtml = '<div style="color:var(--text-secondary)">Unknown filter type: ' + type + '</div>';
    }

    return '\
<div class="filter-group" data-filter-type="' + type + '" data-filter-id="' + group.id + '">\
  <div class="filter-group-title">' + (group.label || group.id) + '</div>\
  ' + groupHtml + '\
</div>';
  }

  function collectFilterValues() {
    var panel = document.getElementById('filter-drawer-panel');
    if (!panel) return {};
    var values = {};

    var filterGroups = panel.querySelectorAll('.filter-group');
    for (var gi = 0; gi < filterGroups.length; gi++) {
      var group = filterGroups[gi];
      var id = group.getAttribute('data-filter-id');
      var type = group.getAttribute('data-filter-type');

      switch (type) {
        case 'checkbox': {
          var checked = group.querySelectorAll('.filter-checkbox-item input[type="checkbox"]:checked');
          var vals = [];
          for (var ci = 0; ci < checked.length; ci++) {
            vals.push(checked[ci].value);
          }
          values[id] = vals;
          break;
        }
        case 'radio': {
          var selected = group.querySelector('.filter-radio-item input[type="radio"]:checked');
          values[id] = selected ? selected.value : '';
          break;
        }
        case 'range': {
          var minInput = group.querySelector('.filter-range-min');
          var maxInput = group.querySelector('.filter-range-max');
          values[id] = {
            min: minInput ? minInput.value : '',
            max: maxInput ? maxInput.value : ''
          };
          break;
        }
        case 'search': {
          var input = group.querySelector('.filter-search-input');
          values[id] = input ? input.value : '';
          break;
        }
        case 'dropdown': {
          var select = group.querySelector('select');
          values[id] = select ? select.value : '';
          break;
        }
      }
    }

    return values;
  }

  function setupEventListeners(panel, options) {
    var filters = options.filters || [];

    for (var fi = 0; fi < filters.length; fi++) {
      var filter = filters[fi];

      (function(filterDef) {
        var type = filterDef.type;
        var id = filterDef.id;
        var onChange = filterDef.onChange;

        if (type === 'checkbox') {
          var checkboxes = panel.querySelectorAll('.filter-checkbox-item input[type="checkbox"]');
          for (var ci = 0; ci < checkboxes.length; ci++) {
            (function(cb) {
              cb.addEventListener('change', function() {
                var groupEl = cb.closest('.filter-group');
                if (!groupEl) return;
                var vals = [];
                var checkedBoxes = groupEl.querySelectorAll('.filter-checkbox-item input[type="checkbox"]:checked');
                for (var i = 0; i < checkedBoxes.length; i++) {
                  vals.push(checkedBoxes[i].value);
                }
                filterValues[id] = vals;
                if (typeof onChange === 'function') onChange(vals);
              });
            })(checkboxes[ci]);
          }

          var selectAll = panel.querySelector('[data-select-all="' + id + '"]');
          if (selectAll) {
            (function(sa) {
              sa.addEventListener('click', function() {
                var groupEl = sa.closest('.filter-group');
                if (!groupEl) return;
                var boxes = groupEl.querySelectorAll('.filter-checkbox-item input[type="checkbox"]');
                for (var i = 0; i < boxes.length; i++) {
                  boxes[i].checked = true;
                }
                var vals = [];
                for (var i = 0; i < boxes.length; i++) {
                  vals.push(boxes[i].value);
                }
                filterValues[id] = vals;
                if (typeof onChange === 'function') onChange(vals);
              });
            })(selectAll);
          }

          var clearAll = panel.querySelector('[data-clear-all="' + id + '"]');
          if (clearAll) {
            (function(ca) {
              ca.addEventListener('click', function() {
                var groupEl = ca.closest('.filter-group');
                if (!groupEl) return;
                var boxes = groupEl.querySelectorAll('.filter-checkbox-item input[type="checkbox"]');
                for (var i = 0; i < boxes.length; i++) {
                  boxes[i].checked = false;
                }
                filterValues[id] = [];
                if (typeof onChange === 'function') onChange([]);
              });
            })(clearAll);
          }
        } else if (type === 'radio') {
          var radios = panel.querySelectorAll('.filter-radio-item input[type="radio"]');
          for (var ri = 0; ri < radios.length; ri++) {
            (function(rb) {
              rb.addEventListener('change', function() {
                if (!rb.checked) return;
                filterValues[id] = rb.value;
                if (typeof onChange === 'function') onChange(rb.value);
              });
            })(radios[ri]);
          }
        } else if (type === 'range') {
          var groupEl = panel.querySelector('.filter-group[data-filter-id="' + id + '"]');
          if (groupEl) {
            var minInput = groupEl.querySelector('.filter-range-min');
            var maxInput = groupEl.querySelector('.filter-range-max');
            if (minInput) {
              (function(mi) {
                mi.addEventListener('change', function() {
                  var gEl = mi.closest('.filter-group');
                  var minIn = gEl ? gEl.querySelector('.filter-range-min') : null;
                  var maxIn = gEl ? gEl.querySelector('.filter-range-max') : null;
                  var val = {
                    min: minIn ? minIn.value : '',
                    max: maxIn ? maxIn.value : ''
                  };
                  filterValues[id] = val;
                  if (typeof onChange === 'function') onChange(val);
                });
              })(minInput);
            }
            if (maxInput) {
              (function(mi) {
                mi.addEventListener('change', function() {
                  var gEl = mi.closest('.filter-group');
                  var minIn = gEl ? gEl.querySelector('.filter-range-min') : null;
                  var maxIn = gEl ? gEl.querySelector('.filter-range-max') : null;
                  var val = {
                    min: minIn ? minIn.value : '',
                    max: maxIn ? maxIn.value : ''
                  };
                  filterValues[id] = val;
                  if (typeof onChange === 'function') onChange(val);
                });
              })(maxInput);
            }
          }
        } else if (type === 'search') {
          var searchInput = panel.querySelector('.filter-search-input');
          if (searchInput) {
            (function(si) {
              var debounceTimer = null;
              si.addEventListener('input', function() {
                if (debounceTimer) clearTimeout(debounceTimer);
                debounceTimer = setTimeout(function() {
                  filterValues[id] = si.value;
                  if (typeof onChange === 'function') onChange(si.value);
                }, 250);
              });
            })(searchInput);
          }
        } else if (type === 'dropdown') {
          var select = panel.querySelector('.filter-dropdown select');
          if (select) {
            (function(sel) {
              sel.addEventListener('change', function() {
                filterValues[id] = sel.value;
                if (typeof onChange === 'function') onChange(sel.value);
              });
            })(select);
          }
        }
      })(filter);
    }

    var applyBtn = panel.querySelector('.filter-drawer-apply');
    if (applyBtn && options.onApply) {
      applyBtn.addEventListener('click', function() {
        var allValues = collectFilterValues();
        options.onApply(allValues);
      });
    }

    var resetBtn = panel.querySelector('.filter-drawer-reset');
    if (resetBtn && options.onReset) {
      resetBtn.addEventListener('click', function() {
        options.onReset();
      });
    }

    var closeBtn = panel.querySelector('.filter-drawer-close');
    if (closeBtn) {
      closeBtn.addEventListener('click', function() {
        closeDrawer();
      });
    }
  }

  function getFilterInitialValues(filters) {
    var values = {};
    for (var i = 0; i < filters.length; i++) {
      var f = filters[i];
      var val = f.value;
      if (val === undefined || val === null) {
        if (f.type === 'checkbox') val = [];
        else if (f.type === 'range') val = { min: '', max: '' };
        else val = '';
      }
      values[f.id] = val;
    }
    return values;
  }

  function renderDrawerHTML(title, filtersContent) {
    return '\
<div id="filter-drawer-overlay">\
  <div id="filter-drawer-panel">\
    <div class="filter-drawer-header">\
      <h3>' + (title || 'Filters') + '</h3>\
      <button class="filter-drawer-close" title="Close">\u2715</button>\
    </div>\
    <div class="filter-drawer-body">\
      ' + filtersContent + '\
    </div>\
    <div class="filter-drawer-footer">\
      <button class="btn btn-secondary btn-sm filter-drawer-reset">Clear All</button>\
      <button class="btn btn-primary btn-sm filter-drawer-apply">Apply Filters</button>\
    </div>\
  </div>\
</div>';
  }

  function openDrawer(options) {
    if (!options) options = {};
    var title = options.title || 'Filters';
    var filters = options.filters || [];
    var width = options.width || '320px';

    injectStyles();

    closeDrawer();

    var filtersHtml = '';
    for (var i = 0; i < filters.length; i++) {
      filtersHtml += renderFilterGroup(filters[i]);
    }

    var html = renderDrawerHTML(title, filtersHtml);
    var temp = document.createElement('div');
    temp.innerHTML = html;
    var overlay = temp.firstElementChild;

    var panel = overlay.querySelector('#filter-drawer-panel');
    if (panel) {
      panel.style.width = width;
    }

    document.body.appendChild(overlay);
    currentOptions = options;
    filterValues = getFilterInitialValues(filters);

    setupEventListeners(overlay, options);

    overlay.addEventListener('click', function(e) {
      if (e.target === overlay) {
        closeDrawer();
      }
    });

    document.addEventListener('keydown', handleEscape);

    requestAnimationFrame(function() {
      overlay.classList.add('open');
    });
  }

  function handleEscape(e) {
    if (e.key === 'Escape') {
      closeDrawer();
    }
  }

  function closeDrawer() {
    var overlay = document.getElementById('filter-drawer-overlay');
    if (overlay) {
      overlay.classList.remove('open');
      setTimeout(function() {
        if (overlay.parentNode) overlay.remove();
      }, 350);
    }
    document.removeEventListener('keydown', handleEscape);
    currentOptions = null;
  }

  return {
    openDrawer: openDrawer,
    closeDrawer: closeDrawer,
    renderDrawerHTML: renderDrawerHTML
  };
})();
