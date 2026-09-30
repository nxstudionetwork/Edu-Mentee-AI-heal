window.API = (function() {
  var mockData = window.mockData || {};
  var store = window.Store || { get: function(){return null}, set: function(){}, on: function(){} };
  var helpers = window.Utils || { generateId: function(){return 'id_'+Date.now()}, sanitizeHTML: function(s){return s||''}, formatDate: function(d){return d||''}, formatRelativeTime: function(d){return d||''} };

  function delay(ms) {
    if (ms === void 0) ms = 0;
    return new Promise(function(resolve) {
      var t = ms || (Math.floor(Math.random() * 600) + 200);
      setTimeout(resolve, t);
    });
  }

  function getStoredUsers() {
    try {
      var data = localStorage.getItem('edumentee_users');
      if (data) return JSON.parse(data);
    } catch (e) {}
    return (mockData.users || []).slice();
  }

  function saveStoredUsers(users) {
    try {
      localStorage.setItem('edumentee_users', JSON.stringify(users));
    } catch (e) {}
  }

  function resolveItems(resource) {
    if (typeof resource === 'function') return resource();
    return resource || [];
  }

  function applyFilters(items, params) {
    if (!params) return items;
    var filtered = items.slice();
    for (var key in params) {
      if (params.hasOwnProperty(key) && params[key] !== undefined && params[key] !== null && params[key] !== '') {
        filtered = filtered.filter(function(item) {
          var itemVal = item[key];
          if (typeof itemVal === 'string') {
            return itemVal.toLowerCase().indexOf(String(params[key]).toLowerCase()) !== -1;
          }
          return itemVal == params[key];
        });
      }
    }
    return filtered;
  }

  function randomDelay() {
    return Math.floor(Math.random() * 600) + 200;
  }

  return {
    get: function(resource, params) {
      var self = this;
      return delay().then(function() {
        var data = mockData[resource];
        if (!data) return { success: false, error: 'Resource not found: ' + resource };
        var items = resolveItems(data);
        if (params) {
          items = applyFilters(items, params);
        }
        return { success: true, data: items, total: items.length };
      });
    },
    post: function(resource, data) {
      return delay().then(function() {
        if (resource === 'auth/login') return null;
        return { success: true, data: data, message: resource + ' created successfully' };
      });
    },
    put: function(resource, data) {
      return delay().then(function() {
        return { success: true, data: data, message: resource + ' updated successfully' };
      });
    },
    delete: function(resource) {
      return delay().then(function() {
        return { success: true, message: resource + ' deleted successfully' };
      });
    },
    login: function(email, password) {
      return delay(500).then(function() {
        var users = getStoredUsers();
        var user = null;
        for (var i = 0; i < users.length; i++) {
          if (users[i].email === email && users[i].password === password) {
            user = Object.assign({}, users[i]);
            delete user.password;
            break;
          }
        }
        if (user) {
          store.set('user', user);
          store.set('isAuthenticated', true);
          return { success: true, data: user, message: 'Login successful' };
        }
        return { success: false, error: 'Invalid email or password' };
      });
    },
    signup: function(data) {
      return delay(500).then(function() {
        var users = getStoredUsers();
        for (var i = 0; i < users.length; i++) {
          if (users[i].email === data.email) {
            return { success: false, error: 'Email already registered' };
          }
        }
        var newUser = {
          id: 'u' + (users.length + 1),
          name: data.name,
          email: data.email,
          password: data.password,
          phone: data.phone || '',
          school: data.school || '',
          board: data.board || 'CBSE',
          country: data.country || 'India',
          state: data.state || '',
          city: data.city || '',
          avatar: null,
          class: data.class || null,
          stream: data.stream || null,
          role: 'student',
          xp: 0,
          coins: 0,
          level: 1,
          joinDate: new Date().toISOString().split('T')[0],
          badges: [],
          achievements: [],
          bio: 'A passionate learner exploring new horizons every day.'
        };
        users.push(newUser);
        saveStoredUsers(users);
        var userObj = Object.assign({}, newUser);
        delete userObj.password;
        store.set('user', userObj);
        store.set('isAuthenticated', true);
        return { success: true, data: userObj, message: 'Account created successfully' };
      });
    },
    getProfile: function() {
      return delay(200).then(function() {
        var user = store.get('user');
        if (user) return { success: true, data: user };
        return { success: false, error: 'Not authenticated' };
      });
    },
    updateProfile: function(data) {
      return delay(300).then(function() {
        var user = store.get('user');
        if (!user) return { success: false, error: 'Not authenticated' };
        var updated = Object.assign({}, user, data);
        store.set('user', updated);
        var users = getStoredUsers();
        for (var i = 0; i < users.length; i++) {
          if (users[i].id === user.id) {
            users[i] = Object.assign(users[i], data);
            break;
          }
        }
        saveStoredUsers(users);
        return { success: true, data: updated, message: 'Profile updated' };
      });
    },
    getCourses: function(filters) {
      return delay(randomDelay()).then(function() {
        var items = resolveItems(mockData.courses);
        if (filters) {
          if (filters.class) items = items.filter(function(c) { return c.class == filters.class; });
          if (filters.stream) items = items.filter(function(c) { return !c.stream || c.stream === filters.stream; });
          if (filters.search) {
            var q = filters.search.toLowerCase();
            items = items.filter(function(c) { return c.title.toLowerCase().indexOf(q) !== -1 || c.description.toLowerCase().indexOf(q) !== -1; });
          }
          if (filters.isFree !== undefined) items = items.filter(function(c) { return c.isFree === filters.isFree; });
        }
        return { success: true, data: items, total: items.length };
      });
    },
    getSubjects: function(classId, stream) {
      return delay(randomDelay()).then(function() {
        var items = resolveItems(mockData.subjects);
        items = items.filter(function(s) { return s.class == classId; });
        if (stream && (classId == 11 || classId == 12)) {
          items = items.filter(function(s) { return !s.stream || s.stream === stream; });
        }
        return { success: true, data: items, total: items.length };
      });
    },
    getChapters: function(subjectId) {
      return delay(randomDelay()).then(function() {
        var items = mockData.chapters[subjectId] || [];
        return { success: true, data: items, total: items.length };
      });
    },
    getTopics: function(chapterId) {
      return delay(randomDelay()).then(function() {
        for (var sid in mockData.topics) {
          if (mockData.topics.hasOwnProperty(sid)) {
            var chTopics = mockData.topics[sid][chapterId];
            if (chTopics) return { success: true, data: chTopics, total: chTopics.length };
          }
        }
        return { success: true, data: [], total: 0 };
      });
    },
    getVideos: function(filters) {
      return delay(randomDelay()).then(function() {
        var items = resolveItems(mockData.videos);
        if (filters) {
          if (filters.subjectId) items = applyFilters(items, { subjectId: filters.subjectId });
          if (filters.level) items = applyFilters(items, { level: filters.level });
          if (filters.search) {
            var q = filters.search.toLowerCase();
            items = items.filter(function(v) { return v.title.toLowerCase().indexOf(q) !== -1; });
          }
          if (filters.isFree !== undefined) items = items.filter(function(v) { return v.isFree === filters.isFree; });
        }
        return { success: true, data: items, total: items.length };
      });
    },
    getResources: function(filters) {
      return delay(randomDelay()).then(function() {
        var items = resolveItems(mockData.resources);
        if (filters) {
          if (filters.subjectId) items = applyFilters(items, { subjectId: filters.subjectId });
          if (filters.type) items = applyFilters(items, { type: filters.type });
          if (filters.search) {
            var q = filters.search.toLowerCase();
            items = items.filter(function(r) { return r.title.toLowerCase().indexOf(q) !== -1; });
          }
        }
        return { success: true, data: items, total: items.length };
      });
    },
    getMarketplaceItems: function(filters) {
      return delay(randomDelay()).then(function() {
        var items = resolveItems(mockData.marketplace);
        if (filters) {
          if (filters.category) items = applyFilters(items, { category: filters.category });
          if (filters.search) {
            var q = filters.search.toLowerCase();
            items = items.filter(function(m) { return m.title.toLowerCase().indexOf(q) !== -1; });
          }
          if (filters.minPrice) items = items.filter(function(m) { return m.price >= filters.minPrice; });
          if (filters.maxPrice) items = items.filter(function(m) { return m.price <= filters.maxPrice; });
        }
        return { success: true, data: items, total: items.length };
      });
    },
    getQuizzes: function(filters) {
      return delay(randomDelay()).then(function() {
        var items = resolveItems(mockData.quizzes);
        if (filters) {
          if (filters.subjectId) items = applyFilters(items, { subjectId: filters.subjectId });
          if (filters.difficulty) items = applyFilters(items, { difficulty: filters.difficulty });
        }
        return { success: true, data: items, total: items.length };
      });
    },
    getExams: function(filters) {
      return delay(randomDelay()).then(function() {
        var items = resolveItems(mockData.exams);
        if (filters) {
          if (filters.class) items = applyFilters(items, { class: filters.class });
          if (filters.subjectId) items = applyFilters(items, { subjectId: filters.subjectId });
        }
        return { success: true, data: items, total: items.length };
      });
    },
    getScholarships: function(filters) {
      return delay(randomDelay()).then(function() {
        var items = resolveItems(mockData.scholarships);
        if (filters) {
          if (filters.type) items = applyFilters(items, { type: filters.type });
          if (filters.search) {
            var q = filters.search.toLowerCase();
            items = items.filter(function(s) { return s.name.toLowerCase().indexOf(q) !== -1 || s.provider.toLowerCase().indexOf(q) !== -1; });
          }
        }
        return { success: true, data: items, total: items.length };
      });
    },
    getCommunityPosts: function(filters) {
      return delay(randomDelay()).then(function() {
        var items = resolveItems(mockData.communityPosts);
        if (filters) {
          if (filters.tag) items = items.filter(function(p) { return p.tags && p.tags.indexOf(filters.tag) !== -1; });
          if (filters.search) {
            var q = filters.search.toLowerCase();
            items = items.filter(function(p) { return p.title.toLowerCase().indexOf(q) !== -1 || p.content.toLowerCase().indexOf(q) !== -1; });
          }
        }
        return { success: true, data: items, total: items.length };
      });
    },
    getFeedPosts: function() {
      return delay(randomDelay()).then(function() {
        return { success: true, data: resolveItems(mockData.feedPosts), total: (mockData.feedPosts || []).length };
      });
    },
    getNotifications: function() {
      return delay(randomDelay()).then(function() {
        return { success: true, data: resolveItems(mockData.notifications), total: (mockData.notifications || []).length };
      });
    },
    getLeaderboard: function() {
      return delay(randomDelay()).then(function() {
        return { success: true, data: resolveItems(mockData.leaderboard), total: (mockData.leaderboard || []).length };
      });
    },
    getAchievements: function() {
      return delay(randomDelay()).then(function() {
        return { success: true, data: resolveItems(mockData.achievements), total: (mockData.achievements || []).length };
      });
    },
    addToCart: function(item) {
      return delay(200).then(function() {
        var cart = store.get('cart') || [];
        var exists = false;
        for (var i = 0; i < cart.length; i++) {
          if (cart[i].id === item.id) { exists = true; break; }
        }
        if (!exists) {
          cart.push(Object.assign({ quantity: 1 }, item));
          store.set('cart', cart);
        }
        return { success: true, data: cart, message: 'Item added to cart' };
      });
    },
    removeFromCart: function(itemId) {
      return delay(200).then(function() {
        var cart = store.get('cart') || [];
        cart = cart.filter(function(item) { return item.id !== itemId; });
        store.set('cart', cart);
        return { success: true, data: cart, message: 'Item removed from cart' };
      });
    },
    applyCoupon: function(code) {
      return delay(300).then(function() {
        var coupons = mockData.coupons || [];
        for (var i = 0; i < coupons.length; i++) {
          if (coupons[i].code === code.toUpperCase()) {
            var coupon = coupons[i];
            if (coupon.used >= coupon.usageLimit) {
              return { success: false, error: 'Coupon usage limit reached' };
            }
            var now = new Date();
            var expiry = new Date(coupon.validUntil);
            if (now > expiry) {
              return { success: false, error: 'Coupon has expired' };
            }
            return { success: true, data: coupon, message: 'Coupon applied!' };
          }
        }
        return { success: false, error: 'Invalid coupon code' };
      });
    },
    checkout: function() {
      return delay(800).then(function() {
        var cart = store.get('cart') || [];
        if (cart.length === 0) return { success: false, error: 'Cart is empty' };
        var total = 0;
        for (var i = 0; i < cart.length; i++) {
          total += (cart[i].price || 0) * (cart[i].quantity || 1);
        }
        store.set('cart', []);
        var user = store.get('user') || {};
        user.xp = (user.xp || 0) + Math.floor(total / 10);
        user.coins = (user.coins || 0) + Math.floor(total / 100);
        store.set('user', user);
        store.set('xp', user.xp);
        store.set('coins', user.coins);
        return { success: true, data: { total: total, orderId: 'ORD' + Date.now() }, message: 'Order placed successfully!' };
      });
    },
    submitQuiz: function(quizId, answers) {
      return delay(600).then(function() {
        var quizzes = mockData.quizzes || [];
        var quiz = null;
        for (var i = 0; i < quizzes.length; i++) {
          if (quizzes[i].id === quizId) { quiz = quizzes[i]; break; }
        }
        if (!quiz) return { success: false, error: 'Quiz not found' };
        var correct = 0;
        var total = quiz.questions.length;
        for (var j = 0; j < total; j++) {
          if (answers[j] && answers[j] === quiz.questions[j].correctAnswer) {
            correct++;
          }
        }
        var percentage = Math.round((correct / total) * 100);
        var user = store.get('user') || {};
        var earnedXp = Math.floor(percentage * 2);
        var earnedCoins = Math.floor(percentage / 10);
        user.xp = (user.xp || 0) + earnedXp;
        user.coins = (user.coins || 0) + earnedCoins;
        store.set('user', user);
        store.set('xp', user.xp);
        store.set('coins', user.coins);
        return {
          success: true,
          data: {
            quizId: quizId,
            score: correct,
            total: total,
            percentage: percentage,
            passed: percentage >= (quiz.passingScore / total * 100),
            earnedXp: earnedXp,
            earnedCoins: earnedCoins,
            answers: answers
          },
          message: 'Quiz submitted! Score: ' + correct + '/' + total
        };
      });
    },
    generateStudyPlan: function(data) {
      return delay(1200).then(function() {
        var plan = {
          id: 'plan_' + Date.now(),
          createdAt: new Date().toISOString(),
          target: data.target || 'Exam Preparation',
          duration: data.duration || 30,
          hoursPerDay: data.hoursPerDay || 3,
          subjects: data.subjects || [],
          schedule: [],
          tips: [
            'Review your notes within 24 hours of each study session',
            'Take a 5-minute break every 25 minutes (Pomodoro technique)',
            'Practice previous year question papers regularly',
            'Stay hydrated and maintain a consistent sleep schedule'
          ]
        };
        for (var d = 1; d <= Math.min(plan.duration, 7); d++) {
          var daySchedule = [];
          for (var s = 0; s < plan.subjects.length; s++) {
            daySchedule.push({
              subject: plan.subjects[s],
              duration: Math.round(plan.hoursPerDay / plan.subjects.length * 60),
              topic: 'Study session ' + d + ' - ' + plan.subjects[s]
            });
          }
          plan.schedule.push({ day: d, sessions: daySchedule });
        }
        store.set('studyPlan', plan);
        return { success: true, data: plan, message: 'Study plan generated!' };
      });
    },
    search: function(query) {
      return delay(400).then(function() {
        if (!query || query.trim() === '') return { success: true, data: [], total: 0 };
        var q = query.toLowerCase().trim();
        var results = [];
        var collections = {
          courses: mockData.courses,
          subjects: mockData.subjects,
          videos: mockData.videos,
          resources: mockData.resources,
          marketplace: mockData.marketplace,
          quizzes: mockData.quizzes,
          scholarships: mockData.scholarships
        };
        for (var key in collections) {
          if (collections.hasOwnProperty(key)) {
            var items = resolveItems(collections[key]);
            for (var i = 0; i < items.length; i++) {
              var item = items[i];
              var match = false;
              if (item.title && item.title.toLowerCase().indexOf(q) !== -1) match = true;
              if (item.name && item.name.toLowerCase().indexOf(q) !== -1) match = true;
              if (item.description && item.description.toLowerCase().indexOf(q) !== -1) match = true;
              if (match) {
                results.push(Object.assign({ type: key }, item));
                if (results.length >= 20) break;
              }
            }
            if (results.length >= 20) break;
          }
        }
        return { success: true, data: results, total: results.length };
      });
    }
  };
})();
