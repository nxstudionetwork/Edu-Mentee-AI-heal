window.UI = (function() {
  var injectedStyles = false;

  function injectStyles() {
    if (injectedStyles) return;
    injectedStyles = true;

    var css = '';
    css += '.loading-spinner{width:40px;height:40px;border:3px solid rgba(255,255,255,0.1);border-top-color:var(--accent-blue);border-radius:50%;animation:spin 0.8s linear infinite;}';
    css += '.loading-overlay{position:absolute;inset:0;display:flex;align-items:center;justify-content:center;background:rgba(10,14,26,0.6);z-index:50;flex-direction:column;gap:var(--space-3);}';
    css += '.loading-overlay-fullscreen{position:fixed;z-index:1000;}';
    css += '.loading-text{color:var(--text-secondary);font-size:var(--text-sm);}';
    css += '.skeleton-table-row{height:48px;margin-bottom:4px;width:100%;}';
    css += '.modal-close{width:36px;height:36px;display:flex;align-items:center;justify-content:center;border-radius:var(--radius-md);color:var(--text-tertiary);cursor:pointer;transition:all var(--transition-fast);font-size:18px;background:transparent;border:none;}';
    css += '.modal-close:hover{background:var(--bg-glass);color:var(--text-primary);}';
    css += '.confirm-message{color:var(--text-secondary);font-size:var(--text-sm);line-height:1.6;margin-bottom:var(--space-6);}';
    css += '.toast-message{flex:1;font-size:var(--text-sm);color:var(--text-primary);}';
    css += '.toast-dismiss{width:24px;height:24px;display:flex;align-items:center;justify-content:center;border-radius:var(--radius-sm);color:var(--text-tertiary);cursor:pointer;background:transparent;border:none;font-size:14px;transition:color var(--transition-fast);flex-shrink:0;}';
    css += '.toast-dismiss:hover{color:var(--text-primary);}';
    css += '.toast-icon{font-size:16px;flex-shrink:0;line-height:1;}';
    css += '.toast-hide{opacity:0;transform:translateX(100%);transition:opacity 0.3s ease,transform 0.3s ease;}';

    var style = document.createElement('style');
    style.textContent = css;
    document.head.appendChild(style);
  }

  var toastContainer = null;

  function ensureToastContainer() {
    if (!toastContainer) {
      toastContainer = document.createElement('div');
      toastContainer.className = 'toast-container';
      document.body.appendChild(toastContainer);
    }
    return toastContainer;
  }

  function showToast(message, type, duration) {
    if (duration === void 0) duration = 3000;
    injectStyles();
    var container = ensureToastContainer();
    var toast = document.createElement('div');
    toast.className = 'toast toast-' + (type || 'info');

    var iconMap = {
      success: '&#10003;',
      error: '&#10007;',
      info: '&#9432;',
      warning: '&#9888;'
    };
    var icon = document.createElement('span');
    icon.className = 'toast-icon';
    icon.innerHTML = iconMap[type] || iconMap.info;

    var msg = document.createElement('span');
    msg.className = 'toast-message';
    msg.textContent = message;

    var dismiss = document.createElement('button');
    dismiss.className = 'toast-dismiss';
    dismiss.innerHTML = '&#10005;';
    dismiss.addEventListener('click', function() {
      if (toast.parentNode) toast.parentNode.removeChild(toast);
    });

    toast.appendChild(icon);
    toast.appendChild(msg);
    toast.appendChild(dismiss);
    container.appendChild(toast);

    if (duration > 0) {
      setTimeout(function() {
        if (toast.parentNode) {
          toast.classList.add('toast-hide');
          setTimeout(function() {
            if (toast.parentNode) toast.parentNode.removeChild(toast);
          }, 300);
        }
      }, duration);
    }

    return toast;
  }

  function showConfirm(title, message, options) {
    if (options === void 0) options = {};
    if (typeof options === 'function') {
      options = { onConfirm: options };
    }
    injectStyles();

    var confirmText = options.confirmText || 'Confirm';
    var cancelText = options.cancelText || 'Cancel';
    var danger = options.danger === true;
    var onConfirm = options.onConfirm || null;
    var onCancel = options.onCancel || null;

    var overlay = document.createElement('div');
    overlay.className = 'modal-overlay';

    var modal = document.createElement('div');
    modal.className = 'modal';
    modal.style.maxWidth = '440px';

    var header = document.createElement('div');
    header.className = 'modal-header';
    var hTitle = document.createElement('h3');
    hTitle.textContent = title;
    var closeBtn = document.createElement('button');
    closeBtn.className = 'modal-close';
    closeBtn.innerHTML = '&#10005;';
    closeBtn.addEventListener('click', function() {
      closeModal();
      if (onCancel) onCancel();
    });
    header.appendChild(hTitle);
    header.appendChild(closeBtn);

    var body = document.createElement('div');
    body.className = 'modal-body';
    var msg = document.createElement('p');
    msg.className = 'confirm-message';
    msg.textContent = message;
    body.appendChild(msg);

    var footer = document.createElement('div');
    footer.className = 'modal-footer';

    var cancelBtn = document.createElement('button');
    cancelBtn.className = 'btn btn-secondary';
    cancelBtn.textContent = cancelText;
    cancelBtn.addEventListener('click', function() {
      closeModal();
      if (onCancel) onCancel();
    });

    var confirmBtn = document.createElement('button');
    confirmBtn.className = 'btn' + (danger ? ' btn-danger' : ' btn-primary');
    confirmBtn.textContent = confirmText;
    confirmBtn.addEventListener('click', function() {
      closeModal();
      if (onConfirm) onConfirm();
    });

    footer.appendChild(cancelBtn);
    footer.appendChild(confirmBtn);

    modal.appendChild(header);
    modal.appendChild(body);
    modal.appendChild(footer);
    overlay.appendChild(modal);
    document.body.appendChild(overlay);

    overlay.addEventListener('click', function(e) {
      if (e.target === overlay) {
        closeModal();
        if (onCancel) onCancel();
      }
    });

    function closeModal() {
      if (overlay.parentNode) overlay.parentNode.removeChild(overlay);
    }

    var promiseObj = {
      then: function(cb) {
        if (typeof cb === 'function') {
          onConfirm = cb;
        }
        return promiseObj;
      }
    };

    return promiseObj;
  }

  function showLoading(container) {
    injectStyles();
    var loader = document.createElement('div');
    loader.className = 'loading-overlay' + (container ? '' : ' loading-overlay-fullscreen');

    var spinner = document.createElement('div');
    spinner.className = 'loading-spinner';

    loader.appendChild(spinner);

    if (container) {
      container.style.position = 'relative';
      container.appendChild(loader);
    } else {
      document.body.appendChild(loader);
    }

    return {
      done: function() {
        if (loader.parentNode) loader.parentNode.removeChild(loader);
      }
    };
  }

  function showModal(title, contentHTML, width) {
    if (width === void 0) width = '560px';
    injectStyles();

    var overlay = document.createElement('div');
    overlay.className = 'modal-overlay';

    var modal = document.createElement('div');
    modal.className = 'modal';
    if (width) modal.style.maxWidth = width;

    var header = document.createElement('div');
    header.className = 'modal-header';
    var hTitle = document.createElement('h3');
    hTitle.textContent = title;
    var closeBtn = document.createElement('button');
    closeBtn.className = 'modal-close';
    closeBtn.innerHTML = '&#10005;';
    closeBtn.addEventListener('click', function() {
      closeModal();
    });
    header.appendChild(hTitle);
    header.appendChild(closeBtn);

    var body = document.createElement('div');
    body.className = 'modal-body';
    body.innerHTML = contentHTML;

    modal.appendChild(header);
    modal.appendChild(body);
    overlay.appendChild(modal);
    document.body.appendChild(overlay);

    overlay.addEventListener('click', function(e) {
      if (e.target === overlay) closeModal();
    });

    function closeModal() {
      if (overlay.parentNode) overlay.parentNode.removeChild(overlay);
    }

    return { close: closeModal };
  }

  function showSkeleton(container, count, type) {
    if (count === void 0) count = 1;
    if (type === void 0) type = 'card';
    injectStyles();
    container.innerHTML = '';

    for (var i = 0; i < count; i++) {
      if (type === 'card') {
        var card = document.createElement('div');
        card.className = 'skeleton skeleton-card';
        container.appendChild(card);
      } else if (type === 'list') {
        var lt1 = document.createElement('div');
        lt1.className = 'skeleton skeleton-title';
        container.appendChild(lt1);
        var lt2 = document.createElement('div');
        lt2.className = 'skeleton skeleton-text';
        container.appendChild(lt2);
        var lt3 = document.createElement('div');
        lt3.className = 'skeleton skeleton-text skeleton-text-sm';
        lt3.style.marginBottom = '1em';
        container.appendChild(lt3);
      } else if (type === 'detail') {
        var thumb = document.createElement('div');
        thumb.className = 'skeleton skeleton-thumbnail';
        thumb.style.width = '100%';
        thumb.style.aspectRatio = '16/9';
        thumb.style.borderRadius = 'var(--radius-md)';
        container.appendChild(thumb);
        var dt1 = document.createElement('div');
        dt1.className = 'skeleton skeleton-title';
        dt1.style.marginTop = '1em';
        container.appendChild(dt1);
        var dt2 = document.createElement('div');
        dt2.className = 'skeleton skeleton-text';
        container.appendChild(dt2);
        var dt3 = document.createElement('div');
        dt3.className = 'skeleton skeleton-text';
        container.appendChild(dt3);
        var dt4 = document.createElement('div');
        dt4.className = 'skeleton skeleton-text skeleton-text-sm';
        container.appendChild(dt4);
      } else if (type === 'text') {
        var t1 = document.createElement('div');
        t1.className = 'skeleton skeleton-text skeleton-text-lg';
        container.appendChild(t1);
        var t2 = document.createElement('div');
        t2.className = 'skeleton skeleton-text';
        container.appendChild(t2);
        var t3 = document.createElement('div');
        t3.className = 'skeleton skeleton-text skeleton-text-sm';
        container.appendChild(t3);
      } else if (type === 'table-row') {
        var row = document.createElement('div');
        row.className = 'skeleton skeleton-table-row';
        container.appendChild(row);
      }
    }
  }

  function showEmptyState(container, icon, title, message, action) {
    injectStyles();
    container.innerHTML = '';

    var wrapper = document.createElement('div');
    wrapper.className = 'empty-state';

    var iconDiv = document.createElement('div');
    iconDiv.className = 'empty-state-icon';
    iconDiv.textContent = icon;

    var titleEl = document.createElement('h3');
    titleEl.className = 'empty-state-title';
    titleEl.textContent = title;

    var msgEl = document.createElement('p');
    msgEl.className = 'empty-state-text';
    msgEl.textContent = message || '';

    wrapper.appendChild(iconDiv);
    wrapper.appendChild(titleEl);
    wrapper.appendChild(msgEl);

    if (action) {
      var btn = document.createElement('button');
      btn.className = 'btn btn-primary';
      btn.textContent = action.label || 'Action';
      btn.addEventListener('click', function(e) {
        if (action.onClick) action.onClick(e);
      });
      wrapper.appendChild(btn);
    }

    container.appendChild(wrapper);
  }

  function scrollTo(element) {
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }

  function handleError(error, context) {
    if (typeof error === 'string') {
      showToast(error, 'error');
      console.error('[UI Error] ' + (context || '') + ': ' + error);
    } else {
      var message = error.message || 'An unexpected error occurred';
      showToast(message, 'error');
      console.error('[UI Error]' + (context ? ' [' + context + ']' : ''), error);
    }
  }

  function validateField(value, rules) {
    if (!rules) return { valid: true, error: null };

    if (rules.required) {
      if (value === null || value === undefined || value === '') {
        return { valid: false, error: rules.message || 'This field is required' };
      }
    }

    if (rules.minLength !== undefined && value && value.length < rules.minLength) {
      return { valid: false, error: rules.message || 'Minimum ' + rules.minLength + ' characters required' };
    }

    if (rules.maxLength !== undefined && value && value.length > rules.maxLength) {
      return { valid: false, error: rules.message || 'Maximum ' + rules.maxLength + ' characters allowed' };
    }

    if (rules.pattern && value) {
      if (!rules.pattern.test(value)) {
        return { valid: false, error: rules.message || 'Invalid format' };
      }
    }

    return { valid: true, error: null };
  }

  function validateForm(fields) {
    var result = { valid: true, errors: {} };

    for (var i = 0; i < fields.length; i++) {
      var field = fields[i];
      var fieldResult = validateField(field.value, field.rules);
      if (!fieldResult.valid) {
        result.valid = false;
        result.errors[field.name || 'field_' + i] = fieldResult.error;
      }
    }

    return result;
  }

  return {
    showToast: showToast,
    showConfirm: showConfirm,
    showLoading: showLoading,
    showModal: showModal,
    showSkeleton: showSkeleton,
    showEmptyState: showEmptyState,
    scrollTo: scrollTo,
    handleError: handleError,
    validateField: validateField,
    validateForm: validateForm
  };
})();
