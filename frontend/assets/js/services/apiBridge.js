// js/services/apiBridge.js - Real backend connectivity for window.API
// Tries the FastAPI backend at http://localhost:8000/api/v1 and gracefully
// falls back to the existing mock/localStorage behaviour on network failure.
// Also hydrates window.mockData content arrays with database-backed data.

var BackendBridge = (function() {
  'use strict';

  var BASE = (window.EDU_BACKEND_URL || 'http://127.0.0.1:8001') + '/api/v1';
  var TOKEN_KEY = 'edu_mentee_token';

  function getToken() {
    try { return localStorage.getItem(TOKEN_KEY); } catch (e) { return null; }
  }
  function setToken(token) {
    try {
      if (token) localStorage.setItem(TOKEN_KEY, token);
      else localStorage.removeItem(TOKEN_KEY);
    } catch (e) {}
  }
  function getStore() { return window.Store || { get: function(){return null}, set: function(){} }; }

  function http(method, path, body, auth) {
    var headers = { 'Content-Type': 'application/json' };
    if (auth !== false) {
      var token = getToken();
      if (token) headers['Authorization'] = 'Bearer ' + token;
    }
    var opts = { method: method, headers: headers, cache: 'no-store' };
    if (body && method !== 'GET') opts.body = JSON.stringify(body);
    return fetch(BASE + '/' + path, opts).then(function(res) {
      if (res.status === 401) {
        getStore().set('isAuthenticated', false);
      }
      return res.json().catch(function() { return null; }).then(function(json) {
        if (!res.ok) {
          var err = new Error((json && json.message) || ('Request failed with status ' + res.status));
          err.status = res.status;
          err.body = json;
          throw err;
        }
        return json || {};
      });
    });
  }

  function isOnline() {
    return fetch(BASE + '/health', { method: 'GET', cache: 'no-store' })
      .then(function(r) { return r.ok; })
      .catch(function() { return false; });
  }

  // ------------------------------------------------------------------
  // Shape mapping: backend user -> frontend user object
  // ------------------------------------------------------------------
  function mapUser(u) {
    if (!u) return null;
    var cls = parseInt(String(u.class_name || '').replace(/\D/g, ''), 10);
    if (isNaN(cls)) cls = null;
    return {
      id: u.id != null ? String(u.id) : null,
      uid: u.uid,
      name: u.full_name || u.name || 'Student',
      email: u.email || '',
      phone: u.phone || '',
      school: u.school || '',
      board: u.board || '',
      class: cls,
      stream: u.stream || null,
      state: u.state || '',
      district: u.district || '',
      village_town: u.village_town || '',
      city: u.city || '',
      country: u.country || 'India',
      gender: u.gender || '',
      dateOfBirth: u.date_of_birth ? String(u.date_of_birth).slice(0, 10) : '',
      pincode: u.pincode || '',
      avatar: u.avatar_url || null,
      avatarUrl: u.avatar_url || null,
      role: u.role || 'student',
      xp: u.xp != null ? u.xp : 0,
      coins: u.coins != null ? u.coins : 0,
      level: u.level != null ? u.level : 1,
      streak: u.streak || 0,
      joinDate: u.created_at ? String(u.created_at).slice(0, 10) : new Date().toISOString().slice(0, 10),
      badges: u.badges || [],
      achievements: u.achievements || []
    };
  }

  function mapNotification(n) {
    return {
      id: n.id != null ? String(n.id) : ('n' + Date.now() + Math.random()),
      message: n.body || n.title || n.message || '',
      title: n.title || '',
      type: (n.type || 'info').toLowerCase(),
      read: !!(n.is_read || n.read),
      createdAt: n.created_at || n.createdAt || new Date().toISOString()
    };
  }

  function mapProduct(p) {
    return {
      id: p.id != null ? String(p.id) : ('p' + Date.now()),
      title: p.name || p.title || 'Product',
      name: p.name || p.title,
      price: p.price || 0,
      mrp: p.discount_price || p.mrp || 0,
      discountPrice: p.discount_price,
      category: p.category_name || p.category || 'general',
      categoryId: p.category_id,
      image: p.image_url || p.thumbnail_url || null,
      images: p.image_url ? [p.image_url] : [],
      rating: p.rating || 0,
      reviewCount: p.review_count || 0,
      stock: p.stock != null ? p.stock : 10,
      description: p.description || '',
      featured: !!p.is_featured,
      isFree: p.is_featured === false
    };
  }

  function mapScholarship(s) {
    return {
      id: s.id != null ? String(s.id) : ('s' + Date.now()),
      name: s.title || s.name || 'Scholarship',
      title: s.title || s.name,
      provider: s.organization || s.provider || 'EduMentee',
      amount: s.amount || 0,
      amountLabel: s.amount ? ('Rs ' + Number(s.amount).toLocaleString('en-IN')) : 'Variable',
      deadline: s.deadline ? String(s.deadline).slice(0, 10) : '',
      description: s.description || '',
      eligibility: s.eligibility || '',
      type: s.category || (s.eligibility ? 'merit' : 'general'),
      applicationUrl: s.application_url || '#'
    };
  }

  function mapEvent(e) {
    var t = e.start_time || e.time || '10:00 AM';
    return {
      id: e.id != null ? String(e.id) : ('ev' + Date.now()),
      title: e.title || 'Event',
      description: e.description || '',
      date: e.event_date ? String(e.event_date).slice(0, 10) : (e.date || ''),
      time: t,
      location: e.location || 'Online',
      organizer: e.organizer || 'EduMentee',
      type: e.event_type || e.type || 'study',
      eventType: e.event_type || e.type || 'study',
      color: e.color || '#3b82f6',
      isAllDay: !!e.is_all_day
    };
  }

  function mapResource(r) {
    return {
      id: r.id != null ? String(r.id) : ('r' + Date.now()),
      title: r.title || 'Resource',
      description: r.description || '',
      type: r.type || 'pdf',
      subjectId: r.subject_id != null ? String(r.subject_id) : '',
      lessonId: r.lesson_id,
      url: r.file_url || r.url || '#',
      thumbnail: r.thumbnail_url || null,
      fileSize: r.file_size || 0,
      downloadCount: r.download_count || 0,
      featured: !!r.is_featured,
      isFree: true
    };
  }

  function mapVideo(v) {
    var dur = v.duration_seconds || 0;
    var mm = Math.floor(dur / 60), ss = dur % 60;
    return {
      id: v.id != null ? String(v.id) : ('v' + Date.now()),
      title: v.title || 'Video',
      description: v.description || '',
      url: v.url || '#',
      thumbnail: v.thumbnail_url || null,
      duration: mm + ':' + (ss < 10 ? '0' : '') + ss,
      durationSeconds: dur,
      level: v.difficulty || 'easy',
      difficulty: v.difficulty || 'easy',
      subjectId: v.subject_id != null ? String(v.subject_id) : '',
      lessonId: v.lesson_id,
      isFree: true,
      featured: !!v.is_featured,
      viewCount: v.view_count || 0
    };
  }

  // ------------------------------------------------------------------
  // Content hydration: fetch backend lists and merge into window.mockData
  // ------------------------------------------------------------------
  function hydrateContent() {
    var md = window.mockData || {};
    var token = getToken();
    if (!token) return Promise.resolve(false);
    var calls = [
      http('GET', 'notifications').then(function(j) {
        var arr = (j.data || []).map(mapNotification);
        if (arr.length) md.notifications = arr;
      }).catch(function() {}),
      http('GET', 'marketplace/products').then(function(j) {
        var arr = (j.data || []).map(mapProduct);
        if (arr.length) md.marketplace = arr;
      }).catch(function() {}),
      http('GET', 'scholarships').then(function(j) {
        var arr = (j.data || []).map(mapScholarship);
        if (arr.length) md.scholarships = arr;
      }).catch(function() {}),
      http('GET', 'calendar').then(function(j) {
        var arr = (j.data || []).map(mapEvent);
        if (arr.length) {
          md.calendarEvents = arr;
          md.events = arr;
        }
      }).catch(function() {}),
      http('GET', 'resources').then(function(j) {
        var arr = (j.data || []).map(mapResource);
        if (arr.length) md.resources = arr;
      }).catch(function() {}),
      http('GET', 'videos').then(function(j) {
        var arr = (j.data || []).map(mapVideo);
        if (arr.length) md.videos = arr;
      }).catch(function() {})
    ];
    return Promise.all(calls).then(function() { return true; }).catch(function() { return false; });
  }

  // ------------------------------------------------------------------
  // Location data for the signup flow (backend -> fallback to static list)
  // ------------------------------------------------------------------
  var FALLBACK_LOCATIONS = {
    states: ['Delhi', 'Maharashtra', 'Uttar Pradesh', 'Karnataka', 'Tamil Nadu', 'Rajasthan', 'Gujarat', 'West Bengal'],
    districts: ['New Delhi', 'South Delhi', 'Mumbai Suburban', 'Pune', 'Lucknow', 'Jaipur', 'Bengaluru Urban', 'Chennai'],
    schools: ['Delhi Public School', 'Kendriya Vidyalaya', 'DAV Public School', 'Government High School']
  };

  function getStates() {
    return http('GET', 'locations/states', null, false)
      .then(function(j) { return (j.data || []).map(function(s) { return s.name; }); })
      .catch(function() { return FALLBACK_LOCATIONS.states.slice(); });
  }
  function getDistricts(state) {
    return http('GET', 'locations/' + encodeURIComponent(state) + '/districts', null, false)
      .then(function(j) { return (j.data || []).map(function(d) { return d.name; }); })
      .catch(function() { return FALLBACK_LOCATIONS.districts.slice(); });
  }
  function getSchools(state, district) {
    return http('GET', 'locations/' + encodeURIComponent(state) + '/' + encodeURIComponent(district) + '/schools', null, false)
      .then(function(j) { return (j.data || []).map(function(s) { return s.name; }); })
      .catch(function() { return FALLBACK_LOCATIONS.schools.slice(); });
  }

  // ------------------------------------------------------------------
  // Auth helpers used by the rest of the app
  // ------------------------------------------------------------------
  function persistSession(apiUser) {
    var store = getStore();
    store.set('user', apiUser);
    store.set('isAuthenticated', true);
    store.set('xp', apiUser.xp || 0);
    store.set('coins', apiUser.coins || 0);
    store.set('level', apiUser.level || 1);
    if (window.App && window.App.authStateChanged) {
      setTimeout(function() { window.App.authStateChanged(); }, 0);
    }
  }

  function login(email, password) {
    return http('POST', 'auth/login', { email: email, password: password }, false)
      .then(function(json) {
        var d = json.data || {};
        setToken(d.access_token);
        var user = mapUser(d.user);
        if (!user) { var e = new Error('Invalid credentials'); e.fallback = true; throw e; }
        persistSession(user);
        hydrateContent();
        return { success: true, data: user, message: json.message || 'Login successful' };
      })
      .catch(function(err) {
        if (err && err.fallback) throw err;
        throw new Error('fallback');
      });
  }

  function signup(data) {
    var payload = {
      full_name: data.name || data.full_name,
      email: data.email,
      password: data.password,
      phone: data.phone || '',
      school: data.school || '',
      board: data.board || '',
      class_name: data.class ? 'Class ' + data.class : data.className,
      stream: data.stream || '',
      state: data.state || '',
      district: data.district || '',
      village_town: data.village_town || '',
      city: data.city || '',
      date_of_birth: data.dateOfBirth || data.date_of_birth || '',
      gender: data.gender || '',
      country: data.country || 'India',
      pincode: data.pincode || ''
    };
    return http('POST', 'auth/register', payload, false)
      .then(function(json) {
        var d = json.data || {};
        setToken(d.access_token);
        var user = mapUser(d.user);
        persistSession(user);
        hydrateContent();
        return { success: true, data: user, message: json.message || 'Account created successfully' };
      })
      .catch(function() { throw new Error('fallback'); });
  }

  function logout() {
    setToken(null);
    return Promise.resolve({ success: true, message: 'Logged out successfully' });
  }

  function getProfile() {
    return http('GET', 'auth/me').then(function(json) {
      var user = mapUser(json.data);
      var store = getStore();
      var current = store.get('user') || {};
      user.streak = current.streak || 0;
      store.set('user', user);
      return { success: true, data: user };
    }).catch(function() { throw new Error('fallback'); });
  }

  function updateProfile(data) {
    var payload = {
      full_name: data.name !== undefined ? data.name : data.full_name,
      phone: data.phone,
      school: data.school,
      board: data.board,
      class_name: data.class ? 'Class ' + data.class : data.className,
      stream: data.stream,
      state: data.state,
      district: data.district,
      village_town: data.village_town,
      city: data.city,
      gender: data.gender,
      date_of_birth: data.dateOfBirth || data.date_of_birth,
      pincode: data.pincode
    };
    for (var k in payload) {
      if (payload[k] === undefined || payload[k] === null) delete payload[k];
    }
    return http('PUT', 'auth/me', payload).then(function(json) {
      var user = mapUser(json.data);
      getStore().set('user', user);
      return { success: true, data: user, message: json.message || 'Profile updated' };
    }).catch(function() { throw new Error('fallback'); });
  }

  function getDashboard() {
    return http('GET', 'dashboard').then(function(json) {
      var d = json.data || {};
      return {
        success: true,
        data: {
          user: mapUser(d.user) || getStore().get('user'),
          stats: d.stats || d.daily_goals || {},
          continueLearning: d.continue_learning || [],
          recentResources: d.recent_resources || [],
          upcomingExams: d.upcoming_exams || [],
          upcomingEvents: d.upcoming_events || d.calendar_events || [],
          notifications: d.notifications || [],
          coins: d.coins != null ? d.coins : 0,
          xp: d.xp != null ? d.xp : 0,
          rank: d.rank || 0,
          dailyGoals: d.daily_goals || {},
          weeklyProgress: d.weekly_progress || []
        }
      };
    }).catch(function() { throw new Error('fallback'); });
  }

  function search(query) {
    if (!query || !query.trim()) return Promise.resolve({ success: true, data: [], total: 0 });
    return http('GET', 'search?q=' + encodeURIComponent(query)).then(function(json) {
      var d = json.data || {};
      var out = [];
      (d.resources || []).forEach(function(r) { out.push(Object.assign({ type: 'resources' }, mapResource(r))); });
      (d.videos || []).forEach(function(v) { out.push(Object.assign({ type: 'videos' }, mapVideo(v))); });
      (d.subjects || []).forEach(function(s) { out.push({ type: 'subjects', title: s.name, name: s.name, id: String(s.id), description: s.description || '' }); });
      (d.products || []).forEach(function(p) { out.push(Object.assign({ type: 'marketplace' }, mapProduct(p))); });
      (d.scholarships || []).forEach(function(s) { out.push(Object.assign({ type: 'scholarships' }, mapScholarship(s))); });
      return { success: true, data: out, total: out.length };
    }).catch(function() { throw new Error('fallback'); });
  }

  function refreshSession() {
    var token = getToken();
    if (!token) return Promise.resolve(false);
    return getProfile().then(function() { return hydrateContent(); })
      .then(function() { return true; })
      .catch(function() { return false; });
  }

  // ------------------------------------------------------------------
  // Install: wrap window.API with backend-first implementations
  // ------------------------------------------------------------------
  function install() {
    var api = window.API;
    if (!api) return;

    var mockLogin = api.login.bind(api);
    var mockSignup = api.signup.bind(api);
    var mockGetProfile = api.getProfile.bind(api);
    var mockUpdateProfile = api.updateProfile.bind(api);
    var mockSearch = api.search.bind(api);

    api.login = function(email, password) {
      return login(email, password).catch(function() { return mockLogin(email, password); });
    };

    api.signup = function(data) {
      return signup(data).catch(function() { return mockSignup(data); });
    };

    api.getProfile = function() {
      return getProfile().catch(function() { return mockGetProfile(); });
    };

    api.updateProfile = function(data) {
      return updateProfile(data).catch(function() { return mockUpdateProfile(data); });
    };

    api.search = function(query) {
      return search(query).catch(function() { return mockSearch(query); });
    };

    api.logout = function() {
      logout();
      return mockLogout();
    };

    // Backend-only helpers
    api.getStates = getStates;
    api.getDistricts = getDistricts;
    api.getSchools = getSchools;
    api.hydrateContent = hydrateContent;
    api.refreshSession = refreshSession;
    api.getBackendStatus = isOnline;
    api.backendLogin = login;
    api.backendSignup = signup;
    api.getDashboard = getDashboard;
  }

  function mockLogout() {
    if (window.API && window.API._mockLogout) return window.API._mockLogout();
    return Promise.resolve({ success: true, message: 'Logged out' });
  }

  return {
    install: install,
    isOnline: isOnline,
    hydrateContent: hydrateContent,
    refreshSession: refreshSession,
    getToken: getToken,
    setToken: setToken,
    mapUser: mapUser
  };
})();

if (window.API && typeof window.API._mockLogout !== 'function') {
  var _origLogout = window.API.logout;
  window.API._mockLogout = function() {
    if (window.Store) window.Store.clear();
    return Promise.resolve({ success: true, message: 'Logged out' });
  };
}

BackendBridge.install();
