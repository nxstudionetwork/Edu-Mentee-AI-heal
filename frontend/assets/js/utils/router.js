window.Router = (function() {
  var routes = {};
  var currentParams = {};
  var currentPath = '';
  var authGuard = null;
  var loadingCallback = null;
  var authRoutes = [];

  function matchRoute(pattern, path) {
    var patternParts = pattern.split('/');
    var pathParts = path.split('/');
    if (patternParts.length !== pathParts.length) return null;
    var params = {};
    for (var i = 0; i < patternParts.length; i++) {
      if (patternParts[i].charAt(0) === ':') {
        params[patternParts[i].slice(1)] = decodeURIComponent(pathParts[i]);
      } else if (patternParts[i] !== pathParts[i]) {
        return null;
      }
    }
    return params;
  }

  function parseQueryString(qs) {
    var params = {};
    if (!qs) return params;
    var pairs = qs.split('&');
    for (var i = 0; i < pairs.length; i++) {
      var pair = pairs[i].split('=');
      var key = decodeURIComponent(pair[0] || '');
      var value = pair.length > 1 ? decodeURIComponent(pair[1] || '') : '';
      if (key) params[key] = value;
    }
    return params;
  }

  function normalizePath(path) {
    return path.replace(/\/+$/, '') || '/';
  }

  function stripQuery(path) {
    var qIdx = path.indexOf('?');
    return qIdx >= 0 ? path.substring(0, qIdx) : path;
  }

  return {
    addRoute: function(pattern, handler) {
      routes[normalizePath(pattern)] = handler;
    },
    navigate: function(path) {
      window.location.hash = '#' + normalizePath(path);
    },
    start: function() {
      var self = this;
      window.addEventListener('hashchange', function() { self.handleRoute(); });
      this.handleRoute();
    },
    getParams: function() {
      return Object.assign({}, currentParams);
    },
    getCurrentPath: function() {
      return currentPath;
    },
    handleRoute: function() {
      var hash = window.location.hash.slice(1) || '/';
      currentPath = hash;
      if (loadingCallback) loadingCallback(true);
      var pathOnly = stripQuery(hash);
      var queryString = hash.indexOf('?') >= 0 ? hash.substring(hash.indexOf('?') + 1) : '';
      var matched = false;
      for (var pattern in routes) {
        if (routes.hasOwnProperty(pattern)) {
          var params = matchRoute(pattern, pathOnly);
          if (params !== null) {
            var queryParams = parseQueryString(queryString);
            for (var k in queryParams) {
              if (queryParams.hasOwnProperty(k)) {
                params[k] = queryParams[k];
              }
            }
            currentParams = params;
            if (authGuard && !authGuard(pattern, params)) {
              if (loadingCallback) loadingCallback(false);
              return;
            }
            var self = this;
            setTimeout(function() {
              routes[pattern](params);
              if (loadingCallback) loadingCallback(false);
              currentParams = params;
              currentPath = hash;
            }, 0);
            matched = true;
            break;
          }
        }
      }
      if (!matched) {
        if (routes['404']) {
          routes['404']();
        }
        if (loadingCallback) loadingCallback(false);
      }
    },
    setAuthGuard: function(guard) {
      authGuard = guard;
    },
    markAuthRoutes: function(patterns) {
      authRoutes = patterns || [];
    },
    onLoading: function(callback) {
      loadingCallback = callback;
    },
    isAuthRoute: function(pattern) {
      for (var i = 0; i < authRoutes.length; i++) {
        var p = authRoutes[i];
        if (p === pattern) return true;
        var regex = new RegExp('^' + p.replace(/:\w+/g, '[^/]+') + '$');
        if (regex.test(pattern)) return true;
      }
      return false;
    }
  };
})();
