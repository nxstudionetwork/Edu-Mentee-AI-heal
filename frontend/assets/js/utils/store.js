window.Store = (function() {
  var STORAGE_KEY = 'edumentee_state';
  var listeners = {};
  var state = {};

  var defaultState = {
    user: null,
    isAuthenticated: false,
    theme: 'dark',
    sidebarCollapsed: false,
    notifications: [],
    xp: 0,
    coins: 0,
    level: 1,
    achievements: [],
    badges: [],
    enrolledClasses: [],
    progress: {},
    cart: [],
    wishlist: [],
    studyPlan: null,
    settings: {
      language: 'en',
      emailNotifications: true,
      pushNotifications: true,
      soundEffects: true,
      autoPlay: true,
      downloadQuality: 'auto'
    }
  };

  function loadState() {
    try {
      var saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        var parsed = JSON.parse(saved);
        return mergeDeep({}, defaultState, parsed);
      }
    } catch (e) {}
    return deepCopy(defaultState);
  }

  function saveState() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch (e) {}
  }

  function mergeDeep(target) {
    for (var i = 1; i < arguments.length; i++) {
      var source = arguments[i];
      if (source && typeof source === 'object') {
        for (var key in source) {
          if (source.hasOwnProperty(key)) {
            if (source[key] && typeof source[key] === 'object' && !Array.isArray(source[key])) {
              if (!target[key] || typeof target[key] !== 'object') target[key] = {};
              mergeDeep(target[key], source[key]);
            } else {
              target[key] = source[key];
            }
          }
        }
      }
    }
    return target;
  }

  function deepCopy(obj) {
    return JSON.parse(JSON.stringify(obj));
  }

  state = loadState();

  return {
    set: function(key, value) {
      state[key] = value;
      saveState();
      if (listeners[key]) {
        for (var i = 0; i < listeners[key].length; i++) {
          listeners[key][i](value);
        }
      }
    },
    get: function(key, defaultVal) {
      if (defaultVal === void 0) defaultVal = null;
      return key in state ? state[key] : defaultVal;
    },
    remove: function(key) {
      delete state[key];
      saveState();
    },
    clear: function() {
      for (var key in localStorage) {
        if (key.indexOf('edumentee') === 0) {
          localStorage.removeItem(key);
        }
      }
      state = deepCopy(defaultState);
      saveState();
    },
    on: function(key, callback) {
      if (!listeners[key]) listeners[key] = [];
      listeners[key].push(callback);
      return function() {
        if (listeners[key]) {
          listeners[key] = listeners[key].filter(function(cb) { return cb !== callback; });
        }
      };
    },
    emit: function(key, value) {
      if (listeners[key]) {
        for (var i = 0; i < listeners[key].length; i++) {
          listeners[key][i](value);
        }
      }
    },
    getState: function() {
      return deepCopy(state);
    },
    resetState: function() {
      state = deepCopy(defaultState);
      saveState();
    }
  };
})();
