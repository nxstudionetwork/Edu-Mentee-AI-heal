// js/services/api.js - API Service Layer
// Production-ready API client with mock data fallback

var ApiService = (function() {
  'use strict';

  var API_BASE = '';
  var API_PREFIX = '/api/v1';

  // ============================================================
  // MOCK DATA ADAPTER
  // Adapts existing window.mockData to match expected endpoint responses
  // ============================================================

  var MockAdapter = {
    _delay: function(min, max) {
      var ms = Math.floor(Math.random() * ((max || 600) - (min || 200) + 1)) + (min || 200);
      return new Promise(function(resolve) { setTimeout(resolve, ms); });
    },

    _pick: function(arr) {
      return arr[Math.floor(Math.random() * arr.length)];
    },

    _rand: function(m, n) {
      return Math.floor(Math.random() * (n - m + 1)) + m;
    },

    _md: function() { return window.mockData || {}; },

    _ok: function(data, message) {
      return { status: 200, success: true, data: data, message: message || '' };
    },

    _err: function(msg, status) {
      return { status: status || 404, success: false, data: null, message: msg };
    },

    _find: function(arr, id) {
      if (!arr) return null;
      for (var i = 0; i < arr.length; i++) {
        if (arr[i].id === id) return arr[i];
      }
      return null;
    },

    _filter: function(items, params) {
      if (!params) return items;
      var result = items.slice();
      for (var key in params) {
        if (params.hasOwnProperty(key) && params[key] !== undefined && params[key] !== null && params[key] !== '') {
          result = result.filter(function(item) {
            var v = item[key];
            if (v === undefined || v === null) return false;
            if (typeof v === 'string') return v.toLowerCase().indexOf(String(params[key]).toLowerCase()) !== -1;
            return v == params[key];
          });
        }
      }
      return result;
    },

    // ----------------------------------------------------------
    // AUTH
    // ----------------------------------------------------------
    'auth/login': function(method, data) {
      var md = this._md();
      var users = md.users || [];
      for (var i = 0; i < users.length; i++) {
        if (users[i].email === data.email && users[i].password === data.password) {
          var user = Object.assign({}, users[i]);
          delete user.password;
          return this._delay(300, 600).then(function() {
            return { status: 200, success: true, data: { user: user, token: 'mock_jwt_' + Date.now() }, message: 'Login successful' };
          });
        }
      }
      return this._delay(300, 600).then(function() {
        return { status: 401, success: false, data: null, message: 'Invalid email or password' };
      });
    },
    'auth/register': function(method, data) {
      var self = this;
      var md = this._md();
      var users = md.users || [];
      for (var i = 0; i < users.length; i++) {
        if (users[i].email === data.email) {
          return this._delay(300, 500).then(function() {
            return { status: 409, success: false, data: null, message: 'Email already registered' };
          });
        }
      }
      return this._delay(400, 800).then(function() {
        var newUser = {
          id: 'u' + (users.length + 1),
          name: data.name || 'New User',
          email: data.email,
          phone: data.phone || '',
          school: data.school || '',
          board: data.board || 'CBSE',
          class: data.class || null,
          stream: data.stream || null,
          role: 'student',
          xp: 0, coins: 0, level: 1,
          joinDate: new Date().toISOString().split('T')[0],
          badges: [], achievements: [],
          avatar: null, bio: ''
        };
        return { status: 201, success: true, data: { user: newUser, token: 'mock_jwt_' + Date.now() }, message: 'Registration successful' };
      });
    },
    'auth/logout': function() {
      return this._delay(100, 200).then(function() {
        return { status: 200, success: true, data: null, message: 'Logged out' };
      });
    },
    'auth/me': function(method) {
      var md = this._md();
      if (method === 'GET') {
        var users = md.users || [];
        var user = users.length > 0 ? Object.assign({}, users[0]) : null;
        if (user) delete user.password;
        return this._delay(100, 300).then(function() {
          return user ? { status: 200, success: true, data: user } : { status: 401, success: false, data: null, message: 'Not authenticated' };
        });
      }
      // PUT - update profile
      return this._delay(200, 400).then(function() {
        return { status: 200, success: true, data: data, message: 'Profile updated' };
      });
    },

    // ----------------------------------------------------------
    // DASHBOARD
    // ----------------------------------------------------------
    'dashboard': function() {
      var md = this._md();
      return this._delay(200, 500).then(function() {
        return {
          status: 200, success: true,
          data: {
            user: md.users ? md.users[0] : null,
            stats: { coursesEnrolled: 5, completedLessons: 42, studyHours: 128, quizzesPassed: 15, rank: 42, streak: 7 },
            recentActivity: (md.feedPosts || []).slice(0, 5),
            upcomingEvents: (md.calendarEvents || []).slice(0, 3),
            notifications: (md.notifications || []).slice(0, 5)
          }
        };
      });
    },
    'dashboard/stats': function() {
      return this._delay(200, 400).then(function() {
        return {
          status: 200, success: true,
          data: {
            totalStudents: 50000,
            activeCourses: 13,
            completionRate: 78,
            averageScore: 82,
            studyHoursThisWeek: 12,
            quizzesCompleted: 34,
            rank: 42,
            streak: 7
          }
        };
      });
    },

    // ----------------------------------------------------------
    // SUBJECTS
    // ----------------------------------------------------------
    'subjects': function(method, reqData, params) {
      var md = this._md();
      var self = this;
      return this._delay(200, 500).then(function() {
        var items = (md.subjects || []).slice();
        if (params) items = self._filter(items, params);
        return { status: 200, success: true, data: items, total: items.length };
      });
    },

    // ----------------------------------------------------------
    // LESSONS / TOPICS
    // ----------------------------------------------------------
    'lessons': function(method, reqData, params) {
      var md = this._md();
      var self = this;
      return this._delay(200, 500).then(function() {
        var items = (md.lessons || []).slice();
        if (params) items = self._filter(items, params);
        return { status: 200, success: true, data: items, total: items.length };
      });
    },
    'contents/topics': function(method, reqData, params) {
      var md = this._md();
      var self = this;
      return this._delay(200, 400).then(function() {
        var allTopics = md.topics || {};
        var items = [];
        if (params && params.lesson_id) {
          for (var sid in allTopics) {
            if (allTopics.hasOwnProperty(sid)) {
              var chs = allTopics[sid];
              for (var chId in chs) {
                if (chs.hasOwnProperty(chId)) {
                  var tp = chs[chId];
                  for (var t = 0; t < tp.length; t++) {
                    if (tp[t].chapterId === params.lesson_id) items.push(tp[t]);
                  }
                }
              }
            }
          }
        } else {
          for (var sid2 in allTopics) {
            if (allTopics.hasOwnProperty(sid2)) {
              var chs2 = allTopics[sid2];
              for (var chId2 in chs2) {
                if (chs2.hasOwnProperty(chId2)) {
                  var tp2 = chs2[chId2];
                  for (var t2 = 0; t2 < tp2.length; t2++) items.push(tp2[t2]);
                }
              }
            }
          }
          items = items.slice(0, 50);
        }
        return { status: 200, success: true, data: items, total: items.length };
      });
    },

    // ----------------------------------------------------------
    // RESOURCES
    // ----------------------------------------------------------
    'resources': function(method, reqData, params) {
      var md = this._md();
      var self = this;
      return this._delay(200, 500).then(function() {
        var items = (md.resources || []).slice();
        if (params) items = self._filter(items, params);
        return { status: 200, success: true, data: items, total: items.length };
      });
    },
    'resources/bookmarked': function() {
      var md = this._md();
      return this._delay(200, 400).then(function() {
        var items = (md.resources || []).slice(0, 20);
        return { status: 200, success: true, data: items, total: items.length };
      });
    },
    'resources/recommended': function() {
      var md = this._md();
      return this._delay(200, 500).then(function() {
        var items = (md.resources || []).slice(0, 15);
        return { status: 200, success: true, data: items, total: items.length };
      });
    },

    // ----------------------------------------------------------
    // VIDEOS
    // ----------------------------------------------------------
    'videos': function(method, reqData, params) {
      var md = this._md();
      var self = this;
      return this._delay(200, 500).then(function() {
        var items = (md.videos || []).slice();
        if (params) items = self._filter(items, params);
        return { status: 200, success: true, data: items, total: items.length };
      });
    },
    'videos/continue-watching': function() {
      var md = this._md();
      return this._delay(200, 400).then(function() {
        var items = (md.videos || []).slice(0, 10);
        return { status: 200, success: true, data: items, total: items.length };
      });
    },
    'videos/recommended': function() {
      var md = this._md();
      return this._delay(200, 500).then(function() {
        var items = (md.videos || []).slice(5, 20);
        return { status: 200, success: true, data: items, total: items.length };
      });
    },

    // ----------------------------------------------------------
    // QUIZZES
    // ----------------------------------------------------------
    'quizzes': function(method, reqData, params) {
      var md = this._md();
      var self = this;
      return this._delay(200, 500).then(function() {
        var items = (md.quizzes || []).slice();
        if (params) items = self._filter(items, params);
        return { status: 200, success: true, data: items, total: items.length };
      });
    },
    'quizzes/start': function(method, data) {
      return this._delay(300, 500).then(function() {
        return { status: 200, success: true, data: { startedAt: new Date().toISOString(), timeRemaining: 1800 }, message: 'Quiz started' };
      });
    },

    // ----------------------------------------------------------
    // EXAMS
    // ----------------------------------------------------------
    'exams': function(method, reqData, params) {
      var md = this._md();
      var self = this;
      return this._delay(200, 500).then(function() {
        var items = (md.exams || []).slice();
        if (params) items = self._filter(items, params);
        return { status: 200, success: true, data: items, total: items.length };
      });
    },
    'exams/results': function() {
      var md = this._md();
      return this._delay(200, 500).then(function() {
        return { status: 200, success: true, data: (md.examResults || []), total: (md.examResults || []).length };
      });
    },

    // ----------------------------------------------------------
    // ASSIGNMENTS
    // ----------------------------------------------------------
    'assignments': function() {
      var md = this._md();
      return this._delay(200, 500).then(function() {
        return { status: 200, success: true, data: (md.assignments || []), total: (md.assignments || []).length };
      });
    },

    // ----------------------------------------------------------
    // CALENDAR
    // ----------------------------------------------------------
    'calendar': function(method, reqData, params) {
      var md = this._md();
      var self = this;
      return this._delay(200, 400).then(function() {
        var items = (md.calendarEvents || md.events || []).slice();
        if (params) items = self._filter(items, params);
        return { status: 200, success: true, data: items, total: items.length };
      });
    },

    // ----------------------------------------------------------
    // NOTIFICATIONS
    // ----------------------------------------------------------
    'notifications': function() {
      var md = this._md();
      return this._delay(200, 400).then(function() {
        return { status: 200, success: true, data: (md.notifications || []), total: (md.notifications || []).length };
      });
    },
    'notifications/unread-count': function() {
      var md = this._md();
      return this._delay(100, 200).then(function() {
        var notifs = md.notifications || [];
        var count = 0;
        for (var i = 0; i < notifs.length; i++) { if (!notifs[i].read) count++; }
        return { status: 200, success: true, data: { count: count } };
      });
    },

    // ----------------------------------------------------------
    // INBOX / MESSAGES
    // ----------------------------------------------------------
    'inbox': function(method, reqData, params) {
      var md = this._md();
      return this._delay(200, 400).then(function() {
        return { status: 200, success: true, data: (md.communityMessages || []), total: (md.communityMessages || []).length };
      });
    },

    // ----------------------------------------------------------
    // MARKETPLACE
    // ----------------------------------------------------------
    'marketplace/categories': function() {
      return this._delay(200, 300).then(function() {
        return {
          status: 200, success: true,
          data: [
            { id: 'cat_books', name: 'Books', icon: '📚' },
            { id: 'cat_stationery', name: 'Stationery', icon: '✏️' },
            { id: 'cat_courses', name: 'Courses', icon: '🎓' },
            { id: 'cat_electronics', name: 'Electronics', icon: '💻' },
            { id: 'cat_notes', name: 'Notes', icon: '📝' },
            { id: 'cat_mock', name: 'Mock Tests', icon: '📋' }
          ]
        };
      });
    },
    'marketplace/products': function(method, reqData, params) {
      var md = this._md();
      var self = this;
      return this._delay(200, 500).then(function() {
        var items = (md.marketplace || []).slice();
        if (params) items = self._filter(items, params);
        return { status: 200, success: true, data: items, total: items.length };
      });
    },
    'cart': function(method, reqData) {
      var md = this._md();
      return this._delay(100, 300).then(function() {
        return { status: 200, success: true, data: { items: [], total: 0 } };
      });
    },
    'orders': function() {
      return this._delay(200, 400).then(function() {
        return { status: 200, success: true, data: [], total: 0 };
      });
    },
    'favorites': function(method, data) {
      return this._delay(100, 300).then(function() {
        return { status: 200, success: true, data: { added: true }, message: 'Added to favorites' };
      });
    },

    // ----------------------------------------------------------
    // COMMUNITY
    // ----------------------------------------------------------
    'community': function() {
      var md = this._md();
      return this._delay(200, 500).then(function() {
        return { status: 200, success: true, data: (md.communityMessages || []), total: (md.communityMessages || []).length };
      });
    },
    'community/posts': function(method, data) {
      return this._delay(200, 400).then(function() {
        return { status: 201, success: true, data: Object.assign({ id: 'cp_' + Date.now(), likes: 0, replies: [], createdAt: new Date().toISOString() }, data), message: 'Post created' };
      });
    },

    // ----------------------------------------------------------
    // ANALYTICS
    // ----------------------------------------------------------
    'analytics/overview': function() {
      return this._delay(300, 600).then(function() {
        return {
          status: 200, success: true,
          data: {
            studyHours: 128, quizzesCompleted: 34, averageScore: 82,
            rank: 42, streak: 7, topicsCompleted: 156,
            weeklyChange: { studyHours: 12, quizzes: 5, score: 3 }
          }
        };
      });
    },
    'analytics/study-hours': function(method, reqData, params) {
      return this._delay(200, 400).then(function() {
        var data = [];
        for (var i = 6; i >= 0; i--) {
          var d = new Date();
          d.setDate(d.getDate() - i);
          data.push({ date: d.toISOString().split('T')[0], hours: Math.floor(Math.random() * 6) + 1 });
        }
        return { status: 200, success: true, data: data };
      });
    },
    'analytics/weekly-progress': function() {
      return this._delay(200, 400).then(function() {
        return {
          status: 200, success: true,
          data: {
            week: 'This Week',
            subjects: [
              { name: 'Mathematics', progress: 75, score: 85 },
              { name: 'Physics', progress: 60, score: 78 },
              { name: 'Chemistry', progress: 45, score: 72 },
              { name: 'Biology', progress: 80, score: 88 },
              { name: 'English', progress: 90, score: 92 }
            ]
          }
        };
      });
    },
    'analytics/subject-performance': function() {
      return this._delay(200, 500).then(function() {
        return {
          status: 200, success: true,
          data: [
            { subject: 'Mathematics', score: 85, trend: 'up', quizzes: 12, studyHours: 32 },
            { subject: 'Physics', score: 78, trend: 'up', quizzes: 10, studyHours: 28 },
            { subject: 'Chemistry', score: 72, trend: 'down', quizzes: 8, studyHours: 22 },
            { subject: 'Biology', score: 88, trend: 'up', quizzes: 14, studyHours: 35 },
            { subject: 'English', score: 92, trend: 'stable', quizzes: 6, studyHours: 15 }
          ]
        };
      });
    },
    'analytics/heatmap': function() {
      return this._delay(200, 400).then(function() {
        var data = [];
        for (var i = 0; i < 365; i++) {
          var d = new Date();
          d.setDate(d.getDate() - i);
          data.push({ date: d.toISOString().split('T')[0], hours: Math.random() > 0.3 ? Math.floor(Math.random() * 8) + 1 : 0 });
        }
        return { status: 200, success: true, data: data };
      });
    },
    'analytics/weak-areas': function() {
      return this._delay(300, 500).then(function() {
        return {
          status: 200, success: true,
          data: [
            { topic: 'Organic Chemistry Reactions', subject: 'Chemistry', accuracy: 45, attempts: 20 },
            { topic: 'Trigonometric Identities', subject: 'Mathematics', accuracy: 52, attempts: 15 },
            { topic: 'Electromagnetic Induction', subject: 'Physics', accuracy: 58, attempts: 12 },
            { topic: 'Calculus - Integration', subject: 'Mathematics', accuracy: 61, attempts: 18 },
            { topic: 'Electrochemistry', subject: 'Chemistry', accuracy: 63, attempts: 10 }
          ]
        };
      });
    },
    'analytics/recommendations': function() {
      return this._delay(300, 500).then(function() {
        return {
          status: 200, success: true,
          data: [
            { type: 'study', title: 'Focus on Organic Chemistry', description: 'Your accuracy is low. Spend 30 min daily on practice.', priority: 'high' },
            { type: 'quiz', title: 'Take a Physics Quiz', description: 'Reinforce your understanding of electromagnetic concepts.', priority: 'medium' },
            { type: 'video', title: 'Watch Trigonometry Basics', description: 'Review foundational concepts before advanced topics.', priority: 'high' },
            { type: 'rest', title: 'Schedule a Break', description: 'You have been studying intensely. Take a 15-minute break.', priority: 'low' }
          ]
        };
      });
    },

    // ----------------------------------------------------------
    // GAMIFICATION
    // ----------------------------------------------------------
    'gamification': function() {
      var md = this._md();
      return this._delay(200, 400).then(function() {
        var g = md.gamification || {};
        return {
          status: 200, success: true,
          data: {
            xp: 2450, coins: 320, level: 12,
            streak: 7, longestStreak: 14,
            dailyMissions: [
              { id: 'dm1', title: 'Watch a Video', progress: 0, target: 1, xp: 50, coins: 10 },
              { id: 'dm2', title: 'Take a Quiz', progress: 0, target: 1, xp: 100, coins: 20 },
              { id: 'dm3', title: 'Study 30 Minutes', progress: 0, target: 30, xp: 75, coins: 15 }
            ]
          }
        };
      });
    },
    'gamification/achievements': function() {
      var md = this._md();
      return this._delay(200, 400).then(function() {
        return { status: 200, success: true, data: (md.achievements || []), total: (md.achievements || []).length };
      });
    },
    'gamification/badges': function() {
      return this._delay(200, 400).then(function() {
        return {
          status: 200, success: true,
          data: [
            { id: 'b1', name: 'First Steps', icon: '👣', description: 'Complete first lesson', unlocked: true },
            { id: 'b2', name: 'Quiz Master', icon: '🏆', description: 'Score 100% on any quiz', unlocked: false },
            { id: 'b3', name: 'Streak King', icon: '🔥', description: '7-day study streak', unlocked: false },
            { id: 'b4', name: 'Bookworm', icon: '📚', description: 'Read 10 resources', unlocked: false }
          ]
        };
      });
    },

    // ----------------------------------------------------------
    // LEADERBOARD
    // ----------------------------------------------------------
    'leaderboard': function(method, reqData, params) {
      var md = this._md();
      return this._delay(200, 500).then(function() {
        return { status: 200, success: true, data: (md.leaderboard || []), total: (md.leaderboard || []).length };
      });
    },
    'leaderboard/rank': function() {
      return this._delay(100, 300).then(function() {
        return { status: 200, success: true, data: { rank: 42, totalStudents: 50000, xp: 2450, percentile: 99 } };
      });
    },

    // ----------------------------------------------------------
    // SEARCH
    // ----------------------------------------------------------
    'search': function(method, reqData, params) {
      var md = this._md();
      var self = this;
      var query = (params && params.q) ? params.q.toLowerCase() : '';
      return this._delay(300, 600).then(function() {
        if (!query) return { status: 200, success: true, data: [], total: 0 };
        var results = [];
        var collections = { subjects: md.subjects, videos: md.videos, resources: md.resources, marketplace: md.marketplace, quizzes: md.quizzes };
        for (var key in collections) {
          if (!collections.hasOwnProperty(key)) continue;
          var items = collections[key] || [];
          for (var i = 0; i < items.length && results.length < 20; i++) {
            var item = items[i];
            var match = false;
            if (item.title && item.title.toLowerCase().indexOf(query) !== -1) match = true;
            if (item.name && item.name.toLowerCase().indexOf(query) !== -1) match = true;
            if (item.description && item.description.toLowerCase().indexOf(query) !== -1) match = true;
            if (match) results.push(Object.assign({ type: key }, item));
          }
        }
        return { status: 200, success: true, data: results, total: results.length };
      });
    },

    // ----------------------------------------------------------
    // SETTINGS
    // ----------------------------------------------------------
    'settings': function() {
      return this._delay(200, 300).then(function() {
        return {
          status: 200, success: true,
          data: { language: 'en', emailNotifications: true, pushNotifications: true, soundEffects: true, autoPlay: true, downloadQuality: 'auto' }
        };
      });
    },

    // ----------------------------------------------------------
    // TEACHERS
    // ----------------------------------------------------------
    'teachers': function(method, reqData, params) {
      var md = this._md();
      var self = this;
      return this._delay(200, 500).then(function() {
        var items = (md.teachers || []).slice();
        if (params) items = self._filter(items, params);
        return { status: 200, success: true, data: items, total: items.length };
      });
    },
    'teachers/messages': function(method, reqData, params) {
      return this._delay(200, 400).then(function() {
        return { status: 200, success: true, data: [], total: 0 };
      });
    },

    // ----------------------------------------------------------
    // VIRTUAL LABS
    // ----------------------------------------------------------
    'labs': function(method, reqData, params) {
      var md = this._md();
      return this._delay(300, 500).then(function() {
        var items = (md.virtualLabs || []).slice();
        if (params && params.subject_id) {
          items = items.filter(function(l) { return l.subjectId === params.subject_id; });
        }
        return { status: 200, success: true, data: items, total: items.length };
      });
    },

    // ----------------------------------------------------------
    // BOOKMARKS
    // ----------------------------------------------------------
    'bookmarks': function(method, reqData) {
      return this._delay(200, 400).then(function() {
        return { status: 200, success: true, data: [], total: 0 };
      });
    }
  };

  // ============================================================
  // ApiService CLASS
  // ============================================================

  function ApiService() {
    this.baseURL = API_BASE + API_PREFIX;
    this.tokenKey = 'edu_mentee_token';
    this.mockMode = true;
    this.cache = {};
    this._requestCount = 0;
  }

  // ----------------------------------------------------------
  // Core Request Handler
  // ----------------------------------------------------------

  ApiService.prototype.request = function(method, endpoint, data, options) {
    var self = this;
    data = data || null;
    options = options || {};

    // Normalize: strip leading slash from endpoint for mock lookup
    var cleanEndpoint = endpoint.replace(/^\/+/, '');

    // Check mock mode
    if (this.mockMode) {
      return this._mockRequest(method, cleanEndpoint, data, options);
    }

    // Build full URL
    var url = this.baseURL + '/' + cleanEndpoint;

    // Build query string from options.params
    if (options.params) {
      var qs = this._buildQueryString(options.params);
      if (qs) url += '?' + qs;
    }

    // Build headers
    var headers = { 'Content-Type': 'application/json' };
    var token = this.getToken();
    if (token) headers['Authorization'] = 'Bearer ' + token;

    // Merge custom headers
    if (options.headers) {
      for (var h in options.headers) {
        if (options.headers.hasOwnProperty(h)) headers[h] = options.headers[h];
      }
    }

    // Build fetch options
    var fetchOptions = { method: method.toUpperCase(), headers: headers };
    if (data && method.toUpperCase() !== 'GET') {
      fetchOptions.body = JSON.stringify(data);
    }

    this._requestCount++;

    return fetch(url, fetchOptions)
      .then(function(response) {
        if (response.status === 401) {
          self.clearToken();
          if (typeof Store !== 'undefined') {
            Store.set('isAuthenticated', false);
          }
          return { status: 401, success: false, data: null, message: 'Unauthorized. Please log in again.' };
        }
        if (!response.ok) {
          return response.json().catch(function() { return null; }).then(function(body) {
            return {
              status: response.status,
              success: false,
              data: body ? (body.data || null) : null,
              message: (body && body.message) ? body.message : 'Request failed with status ' + response.status
            };
          });
        }
        return response.json().catch(function() { return {}; }).then(function(body) {
          return {
            status: response.status,
            success: body.success !== false,
            data: body.data !== undefined ? body.data : body,
            message: body.message || '',
            total: body.total
          };
        });
      })
      .catch(function(err) {
        console.warn('[ApiService] Network error for ' + method + ' ' + endpoint + ', falling back to mock:', err.message);
        return self._mockRequest(method, cleanEndpoint, data, options);
      });
  };

  // ----------------------------------------------------------
  // Mock Request Handler
  // ----------------------------------------------------------

  ApiService.prototype._mockRequest = function(method, endpoint, data, options) {
    var self = this;
    var params = options.params || {};

    // Find mock handler: try exact match, then pattern match
    var handler = MockAdapter[endpoint];
    if (!handler) {
      // Try pattern matching: e.g. "subjects/s12" -> "subjects" with {id: "s12"}
      var parts = endpoint.split('/');
      if (parts.length >= 2) {
        // Try parent resource
        handler = MockAdapter[parts[0]];
        if (handler) {
          // Extract ID from path
          params.id = parts.slice(1).join('/');
        }
      }
    }

    if (handler) {
      var result = handler.call(MockAdapter, method, data, params);
      if (result && typeof result.then === 'function') {
        return result;
      }
      return Promise.resolve(result || { status: 200, success: true, data: null });
    }

    // No handler found - return generic success for POST/PUT/PATCH/DELETE
    if (method.toUpperCase() !== 'GET') {
      return MockAdapter._delay(100, 300).then(function() {
        return { status: 200, success: true, data: data, message: 'Operation completed (mock)' };
      });
    }

    // For GET, try to find the resource in mockData by the endpoint name
    var md = window.mockData || {};
    var resourceName = parts ? parts[0] : endpoint;
    var mockDataKey = this._findMockDataKey(resourceName);
    if (mockDataKey && md[mockDataKey]) {
      var items = md[mockDataKey];
      if (typeof items === 'function') items = items();
      items = items || [];
      if (!Array.isArray(items)) items = [items];
      if (Object.keys(params).length > 0) {
        items = MockAdapter._filter(items, params);
      }
      return MockAdapter._delay(200, 500).then(function() {
        return { status: 200, success: true, data: items, total: items.length };
      });
    }

    return MockAdapter._delay(200, 400).then(function() {
      return { status: 404, success: false, data: null, message: 'Resource not found: ' + endpoint };
    });
  };

  ApiService.prototype._findMockDataKey = function(endpointName) {
    var map = {
      'subjects': 'subjects', 'videos': 'videos', 'resources': 'resources',
      'quizzes': 'quizzes', 'exams': 'exams', 'courses': 'courses',
      'marketplace': 'marketplace', 'books': 'books', 'notifications': 'notifications',
      'leaderboard': 'leaderboard', 'achievements': 'achievements',
      'community': 'communityMessages', 'community-posts': 'communityPosts',
      'feed': 'feedPosts', 'scholarships': 'scholarships',
      'assignments': 'assignments', 'events': 'calendarEvents',
      'teachers': 'teachers', 'students': 'students', 'users': 'users',
      'labs': 'virtualLabs', 'bookmarks': 'bookmarks'
    };
    return map[endpointName] || null;
  };

  // ----------------------------------------------------------
  // Query String Builder
  // ----------------------------------------------------------

  ApiService.prototype._buildQueryString = function(params) {
    var parts = [];
    for (var key in params) {
      if (params.hasOwnProperty(key) && params[key] !== undefined && params[key] !== null) {
        parts.push(encodeURIComponent(key) + '=' + encodeURIComponent(params[key]));
      }
    }
    return parts.join('&');
  };

  // ----------------------------------------------------------
  // Token Management
  // ----------------------------------------------------------

  ApiService.prototype.setToken = function(token) {
    try {
      localStorage.setItem(this.tokenKey, token);
    } catch (e) { /* storage unavailable */ }
  };

  ApiService.prototype.getToken = function() {
    try {
      return localStorage.getItem(this.tokenKey);
    } catch (e) { return null; }
  };

  ApiService.prototype.clearToken = function() {
    try {
      localStorage.removeItem(this.tokenKey);
    } catch (e) { /* storage unavailable */ }
  };

  ApiService.prototype.isAuthenticated = function() {
    return !!this.getToken();
  };

  // ----------------------------------------------------------
  // Mock Mode Toggle
  // ----------------------------------------------------------

  ApiService.prototype.setMockMode = function(enabled) {
    this.mockMode = !!enabled;
  };

  // ----------------------------------------------------------
  // HTTP Verb Shortcuts
  // ----------------------------------------------------------

  ApiService.prototype.get = function(endpoint, params) {
    return this.request('GET', endpoint, null, { params: params || {} });
  };

  ApiService.prototype.post = function(endpoint, data) {
    return this.request('POST', endpoint, data);
  };

  ApiService.prototype.put = function(endpoint, data) {
    return this.request('PUT', endpoint, data);
  };

  ApiService.prototype.patch = function(endpoint, data) {
    return this.request('PATCH', endpoint, data);
  };

  ApiService.prototype.del = function(endpoint) {
    return this.request('DELETE', endpoint);
  };

  // ============================================================
  // AUTH ENDPOINTS
  // ============================================================

  ApiService.prototype.login = function(email, password) {
    var self = this;
    return this.post('auth/login', { email: email, password: password }).then(function(res) {
      if (res.success && res.data && res.data.token) {
        self.setToken(res.data.token);
        if (typeof Store !== 'undefined') {
          Store.set('user', res.data.user);
          Store.set('isAuthenticated', true);
        }
      }
      return res;
    });
  };

  ApiService.prototype.register = function(data) {
    var self = this;
    return this.post('auth/register', data).then(function(res) {
      if (res.success && res.data && res.data.token) {
        self.setToken(res.data.token);
        if (typeof Store !== 'undefined') {
          Store.set('user', res.data.user);
          Store.set('isAuthenticated', true);
        }
      }
      return res;
    });
  };

  ApiService.prototype.logout = function() {
    var self = this;
    return this.post('auth/logout').then(function() {
      self.clearToken();
      if (typeof Store !== 'undefined') {
        Store.set('isAuthenticated', false);
        Store.set('user', null);
      }
      return { status: 200, success: true, data: null, message: 'Logged out' };
    });
  };

  ApiService.prototype.getProfile = function() {
    return this.get('auth/me');
  };

  ApiService.prototype.updateProfile = function(data) {
    return this.put('auth/me', data);
  };

  // ============================================================
  // DASHBOARD
  // ============================================================

  ApiService.prototype.getDashboard = function() {
    return this.get('dashboard');
  };

  ApiService.prototype.getStats = function() {
    return this.get('dashboard/stats');
  };

  // ============================================================
  // SUBJECTS
  // ============================================================

  ApiService.prototype.getSubjects = function(params) {
    return this.get('subjects', params);
  };

  ApiService.prototype.getSubject = function(id) {
    var self = this;
    return this.get('subjects', { id: id }).then(function(res) {
      if (res.success && res.data && Array.isArray(res.data)) {
        for (var i = 0; i < res.data.length; i++) {
          if (res.data[i].id === id) return { status: 200, success: true, data: res.data[i] };
        }
        // If not found by id, return first result or error
        if (res.data.length > 0) return res;
      }
      return res;
    });
  };

  ApiService.prototype.getSubjectProgress = function(id) {
    return this.get('subjects/' + id + '/progress');
  };

  // ============================================================
  // LESSONS / TOPICS
  // ============================================================

  ApiService.prototype.getLessons = function(subjectId) {
    return this.get('lessons', { subject_id: subjectId });
  };

  ApiService.prototype.getLesson = function(id) {
    return this.get('lessons/' + id);
  };

  ApiService.prototype.getTopics = function(lessonId) {
    return this.get('contents/topics', { lesson_id: lessonId });
  };

  ApiService.prototype.completeTopic = function(topicId) {
    return this.put('contents/topics/' + topicId + '/complete');
  };

  // ============================================================
  // RESOURCES
  // ============================================================

  ApiService.prototype.getResources = function(params) {
    return this.get('resources', params);
  };

  ApiService.prototype.getResource = function(id) {
    var self = this;
    return this.get('resources', { id: id }).then(function(res) {
      if (res.success && res.data && Array.isArray(res.data)) {
        for (var i = 0; i < res.data.length; i++) {
          if (res.data[i].id === id) return { status: 200, success: true, data: res.data[i] };
        }
      }
      return res;
    });
  };

  ApiService.prototype.bookmarkResource = function(id) {
    return this.post('resources/' + id + '/bookmark');
  };

  ApiService.prototype.removeResourceBookmark = function(id) {
    return this.del('resources/' + id + '/bookmark');
  };

  ApiService.prototype.getBookmarkedResources = function() {
    return this.get('resources/bookmarked');
  };

  ApiService.prototype.getRecommendedResources = function() {
    return this.get('resources/recommended');
  };

  ApiService.prototype.trackDownload = function(id) {
    return this.post('resources/' + id + '/download');
  };

  // ============================================================
  // VIDEOS
  // ============================================================

  ApiService.prototype.getVideos = function(params) {
    return this.get('videos', params);
  };

  ApiService.prototype.getVideo = function(id) {
    var self = this;
    return this.get('videos', { id: id }).then(function(res) {
      if (res.success && res.data && Array.isArray(res.data)) {
        for (var i = 0; i < res.data.length; i++) {
          if (res.data[i].id === id) return { status: 200, success: true, data: res.data[i] };
        }
      }
      return res;
    });
  };

  ApiService.prototype.updateVideoProgress = function(id, progress) {
    return this.put('videos/' + id + '/progress', { progress: progress });
  };

  ApiService.prototype.getContinueWatching = function() {
    return this.get('videos/continue-watching');
  };

  ApiService.prototype.getRecommendedVideos = function() {
    return this.get('videos/recommended');
  };

  // ============================================================
  // QUIZZES
  // ============================================================

  ApiService.prototype.getQuizzes = function(params) {
    return this.get('quizzes', params);
  };

  ApiService.prototype.getQuiz = function(id) {
    var self = this;
    return this.get('quizzes', { id: id }).then(function(res) {
      if (res.success && res.data && Array.isArray(res.data)) {
        for (var i = 0; i < res.data.length; i++) {
          if (res.data[i].id === id) return { status: 200, success: true, data: res.data[i] };
        }
      }
      return res;
    });
  };

  ApiService.prototype.startQuiz = function(id) {
    return this.post('quizzes/' + id + '/start');
  };

  ApiService.prototype.submitQuiz = function(id, answers) {
    var md = window.mockData || {};
    var quizzes = md.quizzes || [];
    var quiz = null;
    for (var i = 0; i < quizzes.length; i++) {
      if (quizzes[i].id === id) { quiz = quizzes[i]; break; }
    }
    if (!quiz) {
      return this.post('quizzes/' + id + '/submit', { answers: answers });
    }
    // Local mock scoring
    var correct = 0;
    var total = quiz.questions ? quiz.questions.length : 0;
    if (answers && quiz.questions) {
      for (var j = 0; j < total; j++) {
        if (answers[j] && answers[j] === quiz.questions[j].correctAnswer) correct++;
      }
    }
    var percentage = total > 0 ? Math.round((correct / total) * 100) : 0;
    return new Promise(function(resolve) {
      setTimeout(function() {
        resolve({
          status: 200, success: true,
          data: {
            quizId: id, score: correct, total: total,
            percentage: percentage, passed: percentage >= 40,
            earnedXp: Math.floor(percentage * 2),
            earnedCoins: Math.floor(percentage / 10),
            answers: answers
          },
          message: 'Quiz submitted! Score: ' + correct + '/' + total
        });
      }, 400);
    });
  };

  ApiService.prototype.getQuizAttempts = function(id) {
    return this.get('quizzes/' + id + '/attempts');
  };

  // ============================================================
  // EXAMS
  // ============================================================

  ApiService.prototype.getExams = function(params) {
    return this.get('exams', params);
  };

  ApiService.prototype.getExam = function(id) {
    var self = this;
    return this.get('exams', { id: id }).then(function(res) {
      if (res.success && res.data && Array.isArray(res.data)) {
        for (var i = 0; i < res.data.length; i++) {
          if (res.data[i].id === id) return { status: 200, success: true, data: res.data[i] };
        }
      }
      return res;
    });
  };

  ApiService.prototype.registerForExam = function(id) {
    return this.post('exams/' + id + '/register');
  };

  ApiService.prototype.getExamResults = function(id) {
    return this.get('exams/' + id + '/results');
  };

  ApiService.prototype.getAllResults = function() {
    return this.get('exams/results');
  };

  // ============================================================
  // ASSIGNMENTS
  // ============================================================

  ApiService.prototype.getAssignments = function() {
    return this.get('assignments');
  };

  ApiService.prototype.getAssignment = function(id) {
    var self = this;
    return this.get('assignments').then(function(res) {
      if (res.success && res.data && Array.isArray(res.data)) {
        for (var i = 0; i < res.data.length; i++) {
          if (res.data[i].id === id) return { status: 200, success: true, data: res.data[i] };
        }
      }
      return res;
    });
  };

  ApiService.prototype.submitAssignment = function(id, data) {
    return this.post('assignments/' + id + '/submit', data);
  };

  // ============================================================
  // CALENDAR
  // ============================================================

  ApiService.prototype.getEvents = function(start, end) {
    var params = {};
    if (start) params.start_date = start;
    if (end) params.end_date = end;
    return this.get('calendar', params);
  };

  ApiService.prototype.createEvent = function(data) {
    return this.post('calendar', data);
  };

  ApiService.prototype.updateEvent = function(id, data) {
    return this.put('calendar/' + id, data);
  };

  ApiService.prototype.deleteEvent = function(id) {
    return this.del('calendar/' + id);
  };

  // ============================================================
  // NOTIFICATIONS
  // ============================================================

  ApiService.prototype.getNotifications = function() {
    return this.get('notifications');
  };

  ApiService.prototype.getUnreadCount = function() {
    return this.get('notifications/unread-count');
  };

  ApiService.prototype.markRead = function(id) {
    return this.patch('notifications/' + id + '/read');
  };

  ApiService.prototype.markAllRead = function() {
    return this.patch('notifications/read-all');
  };

  // ============================================================
  // INBOX / MESSAGES
  // ============================================================

  ApiService.prototype.getMessages = function(folder) {
    return this.get('inbox', { folder: folder });
  };

  ApiService.prototype.getMessage = function(id) {
    return this.get('inbox/' + id);
  };

  ApiService.prototype.sendMessage = function(data) {
    return this.post('inbox', data);
  };

  ApiService.prototype.toggleStar = function(id) {
    return this.patch('inbox/' + id + '/star');
  };

  ApiService.prototype.toggleImportant = function(id) {
    return this.patch('inbox/' + id + '/important');
  };

  ApiService.prototype.deleteMessage = function(id) {
    return this.del('inbox/' + id);
  };

  // ============================================================
  // MARKETPLACE
  // ============================================================

  ApiService.prototype.getCategories = function() {
    return this.get('marketplace/categories');
  };

  ApiService.prototype.getProducts = function(params) {
    return this.get('marketplace/products', params);
  };

  ApiService.prototype.getProduct = function(id) {
    var self = this;
    return this.get('marketplace/products', { id: id }).then(function(res) {
      if (res.success && res.data && Array.isArray(res.data)) {
        for (var i = 0; i < res.data.length; i++) {
          if (res.data[i].id === id) return { status: 200, success: true, data: res.data[i] };
        }
      }
      return res;
    });
  };

  ApiService.prototype.getCart = function() {
    var storeRef = (typeof Store !== 'undefined') ? Store : null;
    var cart = storeRef ? (storeRef.get('cart') || []) : [];
    var total = 0;
    for (var i = 0; i < cart.length; i++) {
      total += (cart[i].price || 0) * (cart[i].quantity || 1);
    }
    return Promise.resolve({ status: 200, success: true, data: { items: cart, total: total, itemCount: cart.length } });
  };

  ApiService.prototype.addToCart = function(data) {
    var storeRef = (typeof Store !== 'undefined') ? Store : null;
    if (storeRef) {
      var cart = storeRef.get('cart') || [];
      var exists = false;
      for (var i = 0; i < cart.length; i++) {
        if (cart[i].id === data.id) { cart[i].quantity = (cart[i].quantity || 1) + 1; exists = true; break; }
      }
      if (!exists) cart.push(Object.assign({ quantity: 1 }, data));
      storeRef.set('cart', cart);
    }
    return Promise.resolve({ status: 200, success: true, data: data, message: 'Item added to cart' });
  };

  ApiService.prototype.updateCartItem = function(id, qty) {
    var storeRef = (typeof Store !== 'undefined') ? Store : null;
    if (storeRef) {
      var cart = storeRef.get('cart') || [];
      for (var i = 0; i < cart.length; i++) {
        if (cart[i].id === id) { cart[i].quantity = qty; break; }
      }
      storeRef.set('cart', cart);
    }
    return Promise.resolve({ status: 200, success: true, data: null, message: 'Cart updated' });
  };

  ApiService.prototype.removeFromCart = function(id) {
    var storeRef = (typeof Store !== 'undefined') ? Store : null;
    if (storeRef) {
      var cart = storeRef.get('cart') || [];
      cart = cart.filter(function(item) { return item.id !== id; });
      storeRef.set('cart', cart);
    }
    return Promise.resolve({ status: 200, success: true, data: null, message: 'Item removed from cart' });
  };

  ApiService.prototype.applyCoupon = function(code) {
    var md = window.mockData || {};
    var coupons = md.coupons || [];
    var upper = (code || '').toUpperCase();
    for (var i = 0; i < coupons.length; i++) {
      if (coupons[i].code === upper) {
        return Promise.resolve({ status: 200, success: true, data: coupons[i], message: 'Coupon applied!' });
      }
    }
    return Promise.resolve({ status: 404, success: false, data: null, message: 'Invalid coupon code' });
  };

  ApiService.prototype.checkout = function(data) {
    var storeRef = (typeof Store !== 'undefined') ? Store : null;
    if (storeRef) {
      var cart = storeRef.get('cart') || [];
      var total = 0;
      for (var i = 0; i < cart.length; i++) {
        total += (cart[i].price || 0) * (cart[i].quantity || 1);
      }
      storeRef.set('cart', []);
      var user = storeRef.get('user') || {};
      user.xp = (user.xp || 0) + Math.floor(total / 10);
      user.coins = (user.coins || 0) + Math.floor(total / 100);
      storeRef.set('user', user);
      return Promise.resolve({ status: 200, success: true, data: { total: total, orderId: 'ORD' + Date.now() }, message: 'Order placed successfully!' });
    }
    return Promise.resolve({ status: 200, success: true, data: { total: 0, orderId: 'ORD' + Date.now() }, message: 'Order placed!' });
  };

  ApiService.prototype.getOrders = function() {
    return this.get('orders');
  };

  ApiService.prototype.getOrder = function(id) {
    return this.get('orders/' + id);
  };

  ApiService.prototype.addToWishlist = function(productId) {
    return this.post('favorites', { product_id: productId });
  };

  // ============================================================
  // COMMUNITY
  // ============================================================

  ApiService.prototype.getCommunities = function() {
    return this.get('community');
  };

  ApiService.prototype.getCommunity = function(id) {
    return this.get('community/' + id);
  };

  ApiService.prototype.getPosts = function(channelId) {
    return this.get('community/channels/' + channelId + '/posts');
  };

  ApiService.prototype.createPost = function(data) {
    return this.post('community/posts', data);
  };

  ApiService.prototype.addComment = function(postId, content) {
    return this.post('community/posts/' + postId + '/comments', { content: content });
  };

  // ============================================================
  // ANALYTICS
  // ============================================================

  ApiService.prototype.getAnalyticsOverview = function() {
    return this.get('analytics/overview');
  };

  ApiService.prototype.getStudyHours = function(period) {
    return this.get('analytics/study-hours', { period: period });
  };

  ApiService.prototype.getWeeklyProgress = function() {
    return this.get('analytics/weekly-progress');
  };

  ApiService.prototype.getSubjectPerformance = function() {
    return this.get('analytics/subject-performance');
  };

  ApiService.prototype.getHeatmap = function() {
    return this.get('analytics/heatmap');
  };

  ApiService.prototype.getWeakAreas = function() {
    return this.get('analytics/weak-areas');
  };

  ApiService.prototype.getRecommendations = function() {
    return this.get('analytics/recommendations');
  };

  // ============================================================
  // GAMIFICATION
  // ============================================================

  ApiService.prototype.getGamification = function() {
    return this.get('gamification');
  };

  ApiService.prototype.getAchievements = function() {
    return this.get('gamification/achievements');
  };

  ApiService.prototype.getBadges = function() {
    return this.get('gamification/badges');
  };

  ApiService.prototype.getLeaderboard = function(category) {
    return this.get('leaderboard', { category: category });
  };

  ApiService.prototype.getMyRank = function() {
    return this.get('leaderboard/rank');
  };

  // ============================================================
  // SEARCH
  // ============================================================

  ApiService.prototype.search = function(query) {
    return this.get('search', { q: query });
  };

  // ============================================================
  // SETTINGS
  // ============================================================

  ApiService.prototype.getSettings = function() {
    return this.get('settings');
  };

  ApiService.prototype.updateSettings = function(data) {
    return this.put('settings/profile', data);
  };

  ApiService.prototype.changeLanguage = function(lang) {
    return this.put('settings/language', { language: lang });
  };

  ApiService.prototype.changePassword = function(data) {
    return this.put('settings/security/password', data);
  };

  ApiService.prototype.deleteAccount = function() {
    return this.del('settings/account');
  };

  // ============================================================
  // TEACHERS
  // ============================================================

  ApiService.prototype.getTeachers = function(params) {
    return this.get('teachers', params);
  };

  ApiService.prototype.getTeacherMessages = function(teacherId) {
    return this.get('teachers/messages', { teacher_id: teacherId });
  };

  ApiService.prototype.sendTeacherMessage = function(data) {
    return this.post('teachers/messages', data);
  };

  // ============================================================
  // VIRTUAL LABS
  // ============================================================

  ApiService.prototype.getLabs = function(subjectId) {
    return this.get('labs', { subject_id: subjectId });
  };

  ApiService.prototype.getLab = function(id) {
    var self = this;
    return this.get('labs').then(function(res) {
      if (res.success && res.data && Array.isArray(res.data)) {
        for (var i = 0; i < res.data.length; i++) {
          if (res.data[i].id === id) return { status: 200, success: true, data: res.data[i] };
        }
      }
      return res;
    });
  };

  // ============================================================
  // BOOKMARKS
  // ============================================================

  ApiService.prototype.getBookmarks = function() {
    return this.get('bookmarks');
  };

  ApiService.prototype.addBookmark = function(data) {
    return this.post('bookmarks', data);
  };

  ApiService.prototype.removeBookmark = function(id) {
    return this.del('bookmarks/' + id);
  };

  return ApiService;
})();

// ============================================================
// Create and export singleton instance
// ============================================================

var api = new ApiService();

if (typeof window !== 'undefined') {
  window.api = api;
  window.ApiService = ApiService;
}
