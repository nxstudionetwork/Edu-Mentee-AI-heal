window.Utils = (function() {
  var gradients = [
    'linear-gradient(135deg, #3b82f6, #8b5cf6)',
    'linear-gradient(135deg, #8b5cf6, #ec4899)',
    'linear-gradient(135deg, #06b6d4, #3b82f6)',
    'linear-gradient(135deg, #f97316, #ec4899)',
    'linear-gradient(135deg, #10b981, #06b6d4)',
    'linear-gradient(135deg, #f59e0b, #f97316)'
  ];

  var MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  var FULL_MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  var DAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  var SHORT_DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  function pad(n, len) {
    if (len === void 0) len = 2;
    var s = String(n);
    while (s.length < len) s = '0' + s;
    return s;
  }

  return {
    formatDate: function(date, format) {
      if (!date) return '';
      var d = new Date(date);
      if (isNaN(d.getTime())) return '';
      if (!format) format = 'dd MMM yyyy';
      var tokens = {
        'yyyy': d.getFullYear(),
        'yy': String(d.getFullYear()).slice(-2),
        'mmmm': FULL_MONTHS[d.getMonth()],
        'mmm': MONTHS[d.getMonth()],
        'mm': pad(d.getMonth() + 1),
        'm': d.getMonth() + 1,
        'dd': pad(d.getDate()),
        'd': d.getDate(),
        'hh': pad(d.getHours()),
        'h': d.getHours(),
        'ii': pad(d.getMinutes()),
        'i': d.getMinutes(),
        'ss': pad(d.getSeconds()),
        's': d.getSeconds(),
        'dddd': DAYS[d.getDay()],
        'ddd': SHORT_DAYS[d.getDay()]
      };
      var result = format;
      for (var key in tokens) {
        if (tokens.hasOwnProperty(key)) {
          result = result.replace(new RegExp(key, 'g'), tokens[key]);
        }
      }
      return result;
    },
    formatRelativeTime: function(date) {
      if (!date) return '';
      var now = new Date();
      var d = new Date(date);
      if (isNaN(d.getTime())) return '';
      var diff = Math.floor((now - d) / 1000);
      if (diff < 0) return 'just now';
      if (diff < 60) return 'just now';
      diff = Math.floor(diff / 60);
      if (diff < 60) return diff + 'm ago';
      diff = Math.floor(diff / 60);
      if (diff < 24) return diff + 'h ago';
      diff = Math.floor(diff / 24);
      if (diff < 7) return diff + 'd ago';
      if (diff < 30) return Math.floor(diff / 7) + 'w ago';
      diff = Math.floor(diff / 30);
      if (diff < 12) return diff + 'mo ago';
      return Math.floor(diff / 12) + 'y ago';
    },
    formatNumber: function(n) {
      if (n === undefined || n === null) return '0';
      if (n >= 10000000) return (n / 10000000).toFixed(1).replace(/\.0$/, '') + 'Cr';
      if (n >= 100000) return (n / 100000).toFixed(1).replace(/\.0$/, '') + 'L';
      if (n >= 1000) return (n / 1000).toFixed(1).replace(/\.0$/, '') + 'K';
      return String(n);
    },
    formatDuration: function(minutes) {
      if (minutes === undefined || minutes === null) return '0m';
      var h = Math.floor(minutes / 60);
      var m = minutes % 60;
      if (h === 0) return m + 'm';
      if (m === 0) return h + 'h';
      return h + 'h ' + m + 'm';
    },
    renderBreadcrumb: function(items) {
      if (!items || items.length === 0) return '';
      var html = '<div class="breadcrumb">';
      for (var i = 0; i < items.length; i++) {
        var item = items[i];
        if (item.path) {
          html += '<a class="breadcrumb-item" href="#' + item.path + '">' + item.label + '</a>';
        } else {
          html += '<span class="breadcrumb-item breadcrumb-current">' + item.label + '</span>';
        }
        if (i < items.length - 1) {
          html += '<span class="breadcrumb-sep">/</span>';
        }
      }
      html += '</div>';
      return html;
    },
    generateId: function() {
      return 'id_' + Date.now().toString(36) + '_' + Math.random().toString(36).slice(2, 9);
    },
    debounce: function(fn, delay) {
      var timer = null;
      return function() {
        var args = arguments;
        var context = this;
        if (timer) clearTimeout(timer);
        timer = setTimeout(function() {
          fn.apply(context, args);
          timer = null;
        }, delay || 300);
      };
    },
    throttle: function(fn, limit) {
      var inThrottle = false;
      return function() {
        var args = arguments;
        var context = this;
        if (!inThrottle) {
          fn.apply(context, args);
          inThrottle = true;
          setTimeout(function() { inThrottle = false; }, limit || 300);
        }
      };
    },
    truncate: function(str, maxLen) {
      if (!str) return '';
      if (maxLen === void 0) maxLen = 100;
      if (str.length <= maxLen) return str;
      return str.slice(0, maxLen - 3) + '...';
    },
    sanitizeHTML: function(str) {
      if (!str) return '';
      var map = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#x27;' };
      return String(str).replace(/[&<>"']/g, function(m) { return map[m]; });
    },
    getInitials: function(name) {
      if (!name) return '?';
      var parts = name.trim().split(/\s+/);
      if (parts.length === 1) return parts[0].charAt(0).toUpperCase();
      return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase();
    },
    getGradient: function(index) {
      return gradients[index % gradients.length];
    },
    shuffleArray: function(arr) {
      if (!arr) return [];
      var result = arr.slice();
      for (var i = result.length - 1; i > 0; i--) {
        var j = Math.floor(Math.random() * (i + 1));
        var temp = result[i];
        result[i] = result[j];
        result[j] = temp;
      }
      return result;
    },
    groupBy: function(arr, key) {
      if (!arr) return {};
      var grouped = {};
      for (var i = 0; i < arr.length; i++) {
        var val = arr[i][key];
        if (!grouped[val]) grouped[val] = [];
        grouped[val].push(arr[i]);
      }
      return grouped;
    },
    sortBy: function(arr, key, desc) {
      if (!arr) return [];
      var result = arr.slice();
      result.sort(function(a, b) {
        var va = a[key], vb = b[key];
        if (typeof va === 'string') {
          va = va.toLowerCase();
          vb = (vb || '').toLowerCase();
        }
        if (va < vb) return desc ? 1 : -1;
        if (va > vb) return desc ? -1 : 1;
        return 0;
      });
      return result;
    },
    deepClone: function(obj) {
      if (obj === undefined || obj === null) return obj;
      return JSON.parse(JSON.stringify(obj));
    },
    calculateLevel: function(xp) {
      if (!xp || xp < 0) return 1;
      return Math.floor(Math.sqrt(xp / 100)) + 1;
    },
    calculateProgress: function(completed, total) {
      if (!total || total <= 0) return 0;
      return Math.min(100, Math.round((completed / total) * 100));
    },
    getGrade: function(percentage) {
      if (percentage >= 90) return 'A+';
      if (percentage >= 80) return 'A';
      if (percentage >= 70) return 'B+';
      if (percentage >= 60) return 'B';
      if (percentage >= 50) return 'C';
      if (percentage >= 40) return 'D';
      return 'F';
    },
    filterBySearch: function(items, query, fields) {
      if (!items) return [];
      if (!query || query.trim() === '') return items;
      var q = query.toLowerCase().trim();
      return items.filter(function(item) {
        for (var i = 0; i < fields.length; i++) {
          var val = item[fields[i]];
          if (val && String(val).toLowerCase().indexOf(q) !== -1) return true;
        }
        return false;
      });
    },
    classSubjects: {
      1: ['Mathematics', 'English', 'Hindi', 'Environmental Studies', 'General Knowledge', 'Art & Craft', 'Physical Education'],
      2: ['Mathematics', 'English', 'Hindi', 'Environmental Studies', 'General Knowledge', 'Art & Craft', 'Physical Education'],
      3: ['Mathematics', 'English', 'Hindi', 'Environmental Studies', 'General Knowledge', 'Art & Craft', 'Physical Education'],
      4: ['Mathematics', 'English', 'Hindi', 'Environmental Studies', 'General Knowledge', 'Art & Craft', 'Physical Education'],
      5: ['Mathematics', 'English', 'Hindi', 'Environmental Studies', 'General Knowledge', 'Art & Craft', 'Physical Education'],
      6: ['Mathematics', 'Science', 'English', 'Hindi', 'Social Studies', 'Sanskrit', 'Computer Science'],
      7: ['Mathematics', 'Science', 'English', 'Hindi', 'Social Studies', 'Sanskrit', 'Computer Science'],
      8: ['Mathematics', 'Science', 'English', 'Hindi', 'Social Studies', 'Sanskrit', 'Computer Science'],
      9: ['Mathematics', 'Physics', 'Chemistry', 'Biology', 'English', 'Hindi', 'Social Studies', 'Computer Science'],
      10: ['Mathematics', 'Physics', 'Chemistry', 'Biology', 'English', 'Hindi', 'Social Studies', 'Computer Science']
    },
    streamSubjects: {
      science: { 11: ['Physics', 'Chemistry', 'Biology', 'Mathematics', 'English', 'Computer Science'], 12: ['Physics', 'Chemistry', 'Biology', 'Mathematics', 'English', 'Computer Science'] },
      commerce: { 11: ['Accountancy', 'Business Studies', 'Economics', 'Mathematics', 'English', 'Informatics Practices'], 12: ['Accountancy', 'Business Studies', 'Economics', 'Mathematics', 'English', 'Informatics Practices'] },
      arts: { 11: ['History', 'Geography', 'Political Science', 'Psychology', 'Sociology', 'English'], 12: ['History', 'Geography', 'Political Science', 'Psychology', 'Sociology', 'English'] }
    },
    formatCurrency: function(amount) {
      if (amount === undefined || amount === null) return '₹0';
      return '₹' + Number(amount).toLocaleString('en-IN');
    },
    getTimeRemaining: function(targetDate) {
      var now = new Date();
      var target = new Date(targetDate);
      var diff = target - now;
      if (diff <= 0) return { days: 0, hours: 0, minutes: 0, seconds: 0, total: 0, expired: true };
      var total = Math.floor(diff / 1000);
      var days = Math.floor(total / 86400);
      var hours = Math.floor((total % 86400) / 3600);
      var minutes = Math.floor((total % 3600) / 60);
      var seconds = total % 60;
      return { days: days, hours: hours, minutes: minutes, seconds: seconds, total: total, expired: false };
    },
    smoothScroll: function(element) {
      if (!element) return;
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    },
    copyToClipboard: function(text) {
      if (!text) return false;
      try {
        var ta = document.createElement('textarea');
        ta.value = text;
        ta.style.position = 'fixed';
        ta.style.opacity = '0';
        document.body.appendChild(ta);
        ta.select();
        document.execCommand('copy');
        document.body.removeChild(ta);
        return true;
      } catch (e) {
        return false;
      }
    },
    randomItem: function(arr) {
      if (!arr || arr.length === 0) return null;
      return arr[Math.floor(Math.random() * arr.length)];
    },
    randomInt: function(min, max) {
      return Math.floor(Math.random() * (max - min + 1)) + min;
    },
    renderPagination: function(currentPage, totalPages, goToFn) {
      if (totalPages <= 1) return '';
      var html = '<div class="pagination">';
      if (currentPage > 1) {
        html += '<button class="btn btn-ghost btn-sm" data-action="pagination" data-page="' + (currentPage - 1) + '" data-fn="' + goToFn + '">Previous</button>';
      }
      for (var i = Math.max(1, currentPage - 2); i <= Math.min(totalPages, currentPage + 2); i++) {
        html += '<button class="btn btn-sm ' + (i === currentPage ? 'btn-primary' : 'btn-ghost') + '" data-action="pagination" data-page="' + i + '" data-fn="' + goToFn + '">' + i + '</button>';
      }
      if (currentPage < totalPages) {
        html += '<button class="btn btn-ghost btn-sm" data-action="pagination" data-page="' + (currentPage + 1) + '" data-fn="' + goToFn + '">Next</button>';
      }
      html += '</div>';
      return html;
    }
  };
})();
