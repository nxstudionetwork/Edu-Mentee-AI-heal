window.renderPage.scholarship = function(params) {
  var mainContent = document.getElementById('main-content');
  var store = window.Store;
  var utils = window.Utils;
  var md = window.mockData;
  var scholarships = md.scholarships || [];

  var SORT_OPTIONS = [
    { id: 'deadline', label: 'Deadline' },
    { id: 'amount', label: 'Amount' },
    { id: 'name', label: 'Name' },
    { id: 'popularity', label: 'Popularity' }
  ];

  var searchQuery = '';
  var activeSort = 'deadline';
  var activeTab = 'all';
  var currentPage = 1;
  var perPage = 12;

  var filterState = {
    search: '',
    amount: { min: '', max: '' },
    level: [],
    category: [],
    deadline: 'Any',
    status: 'All'
  };

  var user = store.get('user');
  var userClass = user ? (user.class || '') : '';
  var userStream = user ? (user.stream || '') : '';

  var detailOpen = false;
  var detailScholar = null;
  var isSkeleton = true;

  var typeToCategory = {
    merit: 'Merit', need: 'Need-based', sports: 'Sports',
    arts: 'Arts', research: 'Research', international: 'General',
    engineering: 'General', medical: 'General', commerce: 'General'
  };

  function getApplied() { return store.get('appliedScholarships') || []; }
  function getSaved() { return store.get('savedScholarships') || []; }
  function setApplied(arr) { store.set('appliedScholarships', arr); }
  function setSaved(arr) { store.set('savedScholarships', arr); }

  function getDeadlineCountdown(dateStr) {
    var rem = utils.getTimeRemaining(dateStr);
    if (rem.expired) return 'Closed';
    if (rem.days === 0) return 'Due today!';
    return rem.days + ' days left';
  }

  function getDeadlineColor(dateStr) {
    var rem = utils.getTimeRemaining(dateStr);
    if (rem.expired) return 'var(--text-tertiary)';
    if (rem.days <= 7) return 'var(--accent-red)';
    if (rem.days <= 30) return 'var(--accent-yellow)';
    return 'var(--accent-green)';
  }

  function getDeadlineStatus(dateStr) {
    var rem = utils.getTimeRemaining(dateStr);
    if (rem.expired) return 'Closed';
    if (rem.days <= 7) return 'Closing Soon';
    return 'Open';
  }

  function getEducationLevel(eligibility) {
    if (!eligibility) return 'Class 10';
    var el = eligibility.toLowerCase();
    var match = el.match(/class\s+(\d+)/i);
    if (match) {
      var cls = parseInt(match[1], 10);
      if (cls <= 10) return 'Class 10';
      if (cls <= 12) return 'Class 12';
    }
    if (/ug|undergraduate|bachelor/i.test(el)) return 'UG';
    if (/pg|postgraduate|master/i.test(el)) return 'PG';
    if (/phd|doctorate/i.test(el)) return 'PhD';
    return 'Class 10';
  }

  function getCategoryFromType(type) {
    return typeToCategory[type] || 'General';
  }

  function getEligibleCount() {
    var count = 0;
    for (var i = 0; i < scholarships.length; i++) {
      var s = scholarships[i];
      if (!s.eligibility) { count++; continue; }
      var el = s.eligibility.toLowerCase();
      var clsMatch = true;
      if (userClass) {
        var clsNum = parseInt(userClass, 10);
        var match = el.match(/class\s+(\d+)/i);
        if (match) {
          var reqCls = parseInt(match[1], 10);
          clsMatch = reqCls <= clsNum;
        }
      }
      if (clsMatch) count++;
    }
    return count;
  }

  function getStatusBadgeClass(status) {
    var map = {
      'Open': 'badge badge-green',
      'Closing Soon': 'badge badge-red',
      'Closed': 'badge badge-gray',
      'Applied': 'badge badge-yellow',
      'Saved': 'badge badge-blue',
      'In Progress': 'badge badge-cyan'
    };
    return map[status] || 'badge badge-blue';
  }

  function getLevelBadgeClass(level) {
    var map = {
      'Class 10': 'badge badge-purple',
      'Class 12': 'badge badge-cyan',
      'UG': 'badge badge-green',
      'PG': 'badge badge-blue',
      'PhD': 'badge badge-pink'
    };
    return map[level] || 'badge badge-blue';
  }

  function getCatBadgeClass(cat) {
    var map = {
      'Merit': 'badge badge-purple',
      'Need-based': 'badge badge-green',
      'Sports': 'badge badge-cyan',
      'Arts': 'badge badge-pink',
      'Research': 'badge badge-blue',
      'General': 'badge badge-gray'
    };
    return map[cat] || 'badge badge-blue';
  }

  function getActiveFilterCount() {
    var count = 0;
    if (searchQuery) count++;
    if (filterState.amount.min || filterState.amount.max) count++;
    if (filterState.level.length) count++;
    if (filterState.category.length) count++;
    if (filterState.deadline !== 'Any') count++;
    if (filterState.status !== 'All') count++;
    return count;
  }

  function filterScholarships() {
    var filtered = scholarships.slice();
    var query = searchQuery || filterState.search;
    if (query) {
      var q = query.toLowerCase();
      filtered = filtered.filter(function(s) {
        return s.name.toLowerCase().indexOf(q) !== -1 || s.provider.toLowerCase().indexOf(q) !== -1;
      });
    }
    if (filterState.amount.min !== '' || filterState.amount.max !== '') {
      var minAmt = parseFloat(filterState.amount.min) || 0;
      var maxAmt = parseFloat(filterState.amount.max) || Infinity;
      filtered = filtered.filter(function(s) { return s.amount >= minAmt && s.amount <= maxAmt; });
    }
    if (filterState.level.length > 0) {
      filtered = filtered.filter(function(s) {
        return filterState.level.indexOf(getEducationLevel(s.eligibility)) !== -1;
      });
    }
    if (filterState.category.length > 0) {
      filtered = filtered.filter(function(s) {
        return filterState.category.indexOf(getCategoryFromType(s.type)) !== -1;
      });
    }
    if (filterState.deadline !== 'Any') {
      var now = new Date();
      filtered = filtered.filter(function(s) {
        var diff = new Date(s.deadline) - now;
        var daysLeft = diff / (1000 * 60 * 60 * 24);
        if (filterState.deadline === 'This Month') return daysLeft >= 0 && daysLeft <= 30;
        if (filterState.deadline === 'Next 3 Months') return daysLeft >= 0 && daysLeft <= 90;
        if (filterState.deadline === 'This Year') return daysLeft >= 0 && daysLeft <= 365;
        return true;
      });
    }
    if (filterState.status !== 'All') {
      filtered = filtered.filter(function(s) {
        return getDeadlineStatus(s.deadline) === filterState.status;
      });
    }
    if (userClass) {
      var clsNum = parseInt(userClass, 10);
      if (!isNaN(clsNum)) {
        filtered = filtered.filter(function(s) {
          if (!s.eligibility) return true;
          var match = s.eligibility.match(/class\s+(\d+)/i);
          if (match) return parseInt(match[1], 10) <= clsNum;
          return true;
        });
      }
    }
    if (activeSort === 'amount') {
      filtered.sort(function(a, b) { return (b.amount || 0) - (a.amount || 0); });
    } else if (activeSort === 'name') {
      filtered.sort(function(a, b) { return a.name.localeCompare(b.name); });
    } else if (activeSort === 'popularity') {
      filtered.sort(function(a, b) { return (b.applicants || 0) - (a.applicants || 0); });
    } else {
      filtered.sort(function(a, b) { return new Date(a.deadline) - new Date(b.deadline); });
    }
    return filtered;
  }

  function getStats() {
    var applied = getApplied();
    var saved = getSaved();
    var deadlines = 0;
    for (var i = 0; i < scholarships.length; i++) {
      if (!utils.getTimeRemaining(scholarships[i].deadline).expired) deadlines++;
    }
    return {
      applied: applied.length,
      saved: saved.length,
      eligible: getEligibleCount(),
      deadlines: deadlines
    };
  }

  function toggleSave(id) {
    var saved = getSaved();
    var idx = saved.indexOf(id);
    if (idx === -1) saved.push(id); else saved.splice(idx, 1);
    setSaved(saved);
    if (detailOpen && detailScholar && detailScholar.id === id) renderDetailDrawer(detailScholar);
    render();
  }

  function toggleApply(id) {
    var applied = getApplied();
    var idx = applied.indexOf(id);
    if (idx === -1) {
      applied.push(id);
      setApplied(applied);
      showToast('Application submitted successfully!', 'success');
    } else {
      applied.splice(idx, 1);
      setApplied(applied);
      showToast('Application withdrawn', 'info');
    }
    render();
  }

  function showToast(msg, type) {
    var existing = document.querySelector('.scholar-toast');
    if (existing) existing.remove();
    var toast = document.createElement('div');
    toast.className = 'scholar-toast';
    toast.style.cssText = 'position:fixed;bottom:24px;right:24px;z-index:9999;padding:12px 20px;border-radius:var(--radius);font-size:var(--text-sm);font-weight:500;box-shadow:0 4px 20px rgba(0,0,0,0.3);animation:slideUp 0.3s ease;max-width:360px';
    var bg = type === 'success' ? 'var(--accent-green)' : 'var(--accent-blue)';
    toast.style.background = bg;
    toast.style.color = '#fff';
    toast.textContent = msg;
    document.body.appendChild(toast);
    setTimeout(function() { toast.remove(); }, 3000);
  }

  function shareScholar(scholar) {
    var text = scholar.name + ' - ' + utils.formatCurrency(scholar.amount) + ' scholarship at EduMentee';
    if (navigator.share) {
      navigator.share({ title: scholar.name, text: text, url: window.location.href }).catch(function() {});
    } else {
      utils.copyToClipboard(text);
      showToast('Link copied to clipboard', 'info');
    }
  }

  function openFilterDrawer() {
    window.FilterDrawer.openDrawer({
      title: 'Filter Scholarships',
      filters: [
        {
          id: 'amount', label: 'Award Amount', type: 'range',
          value: filterState.amount, min: 0, max: 500000,
          minLabel: 'Min (₹)', maxLabel: 'Max (₹)',
          minPlaceholder: 'Min (₹)', maxPlaceholder: 'Max (₹)'
        },
        {
          id: 'level', label: 'Education Level', type: 'checkbox',
          value: filterState.level,
          options: [
            { value: 'Class 10', label: 'Class 10' },
            { value: 'Class 12', label: 'Class 12' },
            { value: 'UG', label: 'UG' },
            { value: 'PG', label: 'PG' },
            { value: 'PhD', label: 'PhD' }
          ]
        },
        {
          id: 'category', label: 'Category', type: 'checkbox',
          value: filterState.category,
          options: [
            { value: 'Merit', label: 'Merit' },
            { value: 'Need-based', label: 'Need-based' },
            { value: 'Sports', label: 'Sports' },
            { value: 'Arts', label: 'Arts' },
            { value: 'Research', label: 'Research' },
            { value: 'General', label: 'General' }
          ]
        },
        {
          id: 'deadline', label: 'Deadline', type: 'radio',
          value: filterState.deadline,
          options: [
            { value: 'Any', label: 'Any' },
            { value: 'This Month', label: 'This Month' },
            { value: 'Next 3 Months', label: 'Next 3 Months' },
            { value: 'This Year', label: 'This Year' }
          ]
        },
        {
          id: 'status', label: 'Status', type: 'radio',
          value: filterState.status,
          options: [
            { value: 'All', label: 'All' },
            { value: 'Open', label: 'Open' },
            { value: 'Closing Soon', label: 'Closing Soon' },
            { value: 'Closed', label: 'Closed' }
          ]
        }
      ],
      onApply: function(values) {
        filterState.amount = values.amount || { min: '', max: '' };
        filterState.level = values.level || [];
        filterState.category = values.category || [];
        filterState.deadline = values.deadline || 'Any';
        filterState.status = values.status || 'All';
        currentPage = 1;
        render();
      },
      onReset: function() {
        filterState = {
          search: '', amount: { min: '', max: '' },
          level: [], category: [], deadline: 'Any', status: 'All'
        };
        searchQuery = '';
        currentPage = 1;
        render();
      }
    });
  }

  function getSimilarScholarships(scholar, limit) {
    if (!limit) limit = 3;
    var similar = [];
    for (var i = 0; i < scholarships.length; i++) {
      var s = scholarships[i];
      if (s.id === scholar.id) continue;
      if (s.type === scholar.type || getCategoryFromType(s.type) === getCategoryFromType(scholar.type)) {
        similar.push(s);
        if (similar.length >= limit) break;
      }
    }
    return similar;
  }

  function renderSkeleton() {
    var html = '<div class="page-container">';
    html += '<div class="flex gap-3" style="margin-bottom:var(--space-5)">';
    for (var sk = 0; sk < 4; sk++) {
      html += '<div class="skeleton-pulse" style="flex:1;height:70px;border-radius:var(--radius)"></div>';
    }
    html += '</div>';
    html += '<div class="flex items-center gap-3" style="margin-bottom:var(--space-4)">';
    html += '<div class="skeleton-pulse" style="flex:1;height:38px;border-radius:var(--radius)"></div>';
    html += '<div class="skeleton-pulse" style="width:120px;height:38px;border-radius:var(--radius)"></div>';
    html += '<div class="skeleton-pulse" style="width:80px;height:38px;border-radius:var(--radius)"></div>';
    html += '</div>';
    html += '<div class="flex gap-2" style="margin-bottom:var(--space-4)">';
    for (var sb = 0; sb < 4; sb++) {
      html += '<div class="skeleton-pulse" style="width:80px;height:30px;border-radius:20px"></div>';
    }
    html += '</div>';
    html += '<div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(320px,1fr));gap:var(--space-3)">';
    for (var sk2 = 0; sk2 < 6; sk2++) {
      html += '<div class="skeleton-pulse" style="height:140px;border-radius:var(--radius)"></div>';
    }
    html += '</div></div>';
    mainContent.innerHTML = html;
  }

  function render() {
    if (isSkeleton) {
      renderSkeleton();
      isSkeleton = false;
      setTimeout(render, 150);
      return;
    }

    var filtered = filterScholarships();
    var stats = getStats();
    var savedArr = getSaved();
    var appliedArr = getApplied();
    var activeCount = getActiveFilterCount();

    var totalPages = Math.ceil(filtered.length / perPage);
    if (currentPage > totalPages) currentPage = Math.max(1, totalPages);
    var startIdx = (currentPage - 1) * perPage;
    var pageItems = filtered.slice(startIdx, startIdx + perPage);

    if (activeTab === 'applied') {
      var appliedOnly = filtered.filter(function(s) { return appliedArr.indexOf(s.id) !== -1; });
      totalPages = Math.ceil(appliedOnly.length / perPage);
      if (currentPage > totalPages) currentPage = Math.max(1, totalPages);
      startIdx = (currentPage - 1) * perPage;
      pageItems = appliedOnly.slice(startIdx, startIdx + perPage);
    } else if (activeTab === 'saved') {
      var savedOnly = filtered.filter(function(s) { return savedArr.indexOf(s.id) !== -1; });
      totalPages = Math.ceil(savedOnly.length / perPage);
      if (currentPage > totalPages) currentPage = Math.max(1, totalPages);
      startIdx = (currentPage - 1) * perPage;
      pageItems = savedOnly.slice(startIdx, startIdx + perPage);
    } else if (activeTab === 'eligible') {
      var eligibleOnly = filtered.filter(function(s) {
        if (!s.eligibility) return true;
        var el = s.eligibility.toLowerCase();
        var match = el.match(/class\s+(\d+)/i);
        if (match && userClass) {
          return parseInt(match[1], 10) <= parseInt(userClass, 10);
        }
        return true;
      });
      totalPages = Math.ceil(eligibleOnly.length / perPage);
      if (currentPage > totalPages) currentPage = Math.max(1, totalPages);
      startIdx = (currentPage - 1) * perPage;
      pageItems = eligibleOnly.slice(startIdx, startIdx + perPage);
    }

    var html = '<div class="page-container">';

    html += '<div class="flex items-center justify-between" style="margin-bottom:var(--space-5)">';
    html += '<h1 style="font-size:var(--text-2xl);font-weight:700">🎓 Scholarships</h1>';
    html += '</div>';

    html += '<div class="flex gap-3" style="margin-bottom:var(--space-5)">';
    html += renderStatCard('📋', 'Applied', stats.applied, 'var(--accent-blue)', function() { window.renderPage.scholarship.setTab('applied'); });
    html += renderStatCard('💾', 'Saved', stats.saved, 'var(--accent-purple)', function() { window.renderPage.scholarship.setTab('saved'); });
    html += renderStatCard('✅', 'Eligible', stats.eligible, 'var(--accent-green)', function() { window.renderPage.scholarship.setTab('eligible'); });
    html += renderStatCard('⏰', 'Open', stats.deadlines, 'var(--accent-orange)', function() { window.renderPage.scholarship.setTab('all'); });
    html += '</div>';

    html += '<div class="flex items-center gap-2" style="margin-bottom:var(--space-3);flex-wrap:wrap">';
    html += '<div style="flex:1;min-width:180px;position:relative">';
    html += '<input type="text" class="input-field" style="padding-left:34px;width:100%;box-sizing:border-box" placeholder="Search scholarships..." value="' + utils.sanitizeHTML(searchQuery) + '" oninput="window.renderPage.scholarship.search(this.value)">';
    html += '<span style="position:absolute;left:10px;top:50%;transform:translateY(-50%);font-size:var(--text-sm);opacity:0.5">🔍</span>';
    html += '</div>';
    html += '<select class="input-field" style="width:auto;min-width:110px" onchange="window.renderPage.scholarship.setSort(this.value)">';
    for (var si = 0; si < SORT_OPTIONS.length; si++) {
      var selS = SORT_OPTIONS[si].id === activeSort ? ' selected' : '';
      html += '<option value="' + SORT_OPTIONS[si].id + '"' + selS + '>' + SORT_OPTIONS[si].label + '</option>';
    }
    html += '</select>';
    html += '<button class="btn btn-sm" style="position:relative;background:var(--bg-card);border:1px solid var(--border-color);border-radius:var(--radius);cursor:pointer;padding:var(--space-2) var(--space-3);font-size:var(--text-sm);color:var(--text-primary);white-space:nowrap" data-action="scholar:openFilter">';
    html += 'Filter';
    if (activeCount > 0) {
      html += '<span style="position:absolute;top:-5px;right:-5px;background:var(--accent-blue);color:#fff;font-size:10px;font-weight:700;width:18px;height:18px;border-radius:50%;display:flex;align-items:center;justify-content:center">' + activeCount + '</span>';
    }
    html += '</button>';
    html += '</div>';

    var chipsHtml = renderFilterChips();
    if (chipsHtml) {
      html += '<div class="flex items-center gap-2" style="margin-bottom:var(--space-3);flex-wrap:wrap">' + chipsHtml + '</div>';
    }

    html += '<div class="flex gap-2" style="margin-bottom:var(--space-4);flex-wrap:wrap">';
    html += '<button class="btn btn-sm ' + (activeTab === 'all' ? 'btn-primary' : 'btn-ghost') + '" data-action="scholar:setTab" data-tab="all">All Scholarships</button>';
    html += '<button class="btn btn-sm ' + (activeTab === 'applied' ? 'btn-primary' : 'btn-ghost') + '" data-action="scholar:setTab" data-tab="applied">Applied</button>';
    html += '<button class="btn btn-sm ' + (activeTab === 'saved' ? 'btn-primary' : 'btn-ghost') + '" data-action="scholar:setTab" data-tab="saved">Saved</button>';
    html += '<button class="btn btn-sm ' + (activeTab === 'eligible' ? 'btn-primary' : 'btn-ghost') + '" data-action="scholar:setTab" data-tab="eligible">Eligible</button>';
    html += '</div>';

    if (pageItems.length === 0) {
      html += '<div class="flex flex-col items-center justify-center" style="padding:var(--space-10) 0;text-align:center">';
      html += '<div style="font-size:3rem;margin-bottom:var(--space-3)">🎓</div>';
      html += '<h2 style="font-size:var(--text-lg);font-weight:600;margin-bottom:var(--space-2)">No scholarships found</h2>';
      html += '<p style="font-size:var(--text-sm);color:var(--text-secondary)">Try adjusting your search or filters</p>';
      html += '</div>';
    } else {
      html += '<div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(320px,1fr));gap:var(--space-3)">';
      for (var i = 0; i < pageItems.length; i++) {
        html += renderCard(pageItems[i], savedArr, appliedArr);
      }
      html += '</div>';
    }

    if (totalPages > 1) {
      html += renderPagination(currentPage, totalPages);
    }

    html += '</div>';

    if (!detailOpen) {
      mainContent.innerHTML = html;
    } else {
      mainContent.innerHTML = html;
      if (detailScholar) renderDetailDrawer(detailScholar);
    }
  }

  function renderStatCard(icon, label, value, color, onClick) {
    var idx = (label + value).replace(/\s/g, '');
    return '<div class="stat-card" style="flex:1;padding:var(--space-3);cursor:pointer;text-align:center;min-width:0" data-action="scholar:statClick" data-key="' + idx + '">' +
      '<div style="font-size:1.2rem;margin-bottom:2px">' + icon + '</div>' +
      '<div style="font-size:var(--text-xs);color:var(--text-secondary);margin-bottom:2px">' + label + '</div>' +
      '<div style="font-size:var(--text-lg);font-weight:700;color:' + color + '">' + value + '</div>' +
      '</div>';
  }

  function renderCard(scholar, savedArr, appliedArr) {
    var isSaved = savedArr.indexOf(scholar.id) !== -1;
    var isApplied = appliedArr.indexOf(scholar.id) !== -1;
    var countdown = getDeadlineCountdown(scholar.deadline);
    var isClosed = countdown === 'Closed';
    var dateStr = scholar.deadline ? utils.formatDate(scholar.deadline, 'dd mmm yyyy') : '';
    var status = getDeadlineStatus(scholar.deadline);
    var eduLevel = getEducationLevel(scholar.eligibility);
    var category = getCategoryFromType(scholar.type);
    var deadlineColor = getDeadlineColor(scholar.deadline);

    var html = '<div class="glass-card" style="padding:var(--space-3);cursor:pointer" data-action="scholar:openDetail" data-id="' + scholar.id + '">';

    html += '<div class="flex items-center justify-between" style="margin-bottom:var(--space-1)">';
    html += '<div class="flex items-center gap-1" style="min-width:0;flex:1">';
    html += '<span style="font-size:1rem;flex-shrink:0">🏆</span>';
    html += '<span style="font-size:var(--text-sm);font-weight:600;overflow:hidden;text-overflow:ellipsis;white-space:nowrap">' + utils.sanitizeHTML(scholar.name) + '</span>';
    html += '</div>';
    html += '<span class="' + getStatusBadgeClass(status) + '" style="font-size:10px;flex-shrink:0">' + status + '</span>';
    html += '</div>';

    html += '<div style="font-size:var(--text-xs);color:var(--text-secondary);margin-bottom:var(--space-1)">' + utils.sanitizeHTML(scholar.provider) + '</div>';

    html += '<div class="flex items-center justify-between" style="margin-bottom:var(--space-1)">';
    html += '<span style="font-size:var(--text-base);font-weight:700;color:var(--accent-green)">' + utils.formatCurrency(scholar.amount) + '</span>';
    html += '<span style="font-size:var(--text-xs);color:' + deadlineColor + ';font-weight:' + (isClosed ? '400' : '600') + '">📅 ' + countdown + '</span>';
    html += '</div>';

    html += '<div class="flex items-center gap-1" style="margin-bottom:var(--space-2);flex-wrap:wrap">';
    html += '<span class="' + getLevelBadgeClass(eduLevel) + '" style="font-size:10px">' + eduLevel + '</span>';
    html += '<span class="' + getCatBadgeClass(category) + '" style="font-size:10px">' + category + '</span>';
    if (isApplied) {
      html += '<span class="badge badge-yellow" style="font-size:10px">Applied</span>';
    }
    html += '</div>';

    html += '<div class="flex gap-2" style="margin-top:var(--space-1)">';
    html += '<button class="btn btn-sm" style="flex:1;font-size:var(--text-xs);padding:var(--space-1) var(--space-2);background:var(--bg-card);border:1px solid var(--border-color);border-radius:var(--radius);cursor:pointer;color:' + (isSaved ? 'var(--accent-yellow)' : 'var(--text-secondary)') + '" data-action="scholar:toggleSave" data-id="' + scholar.id + '">' + (isSaved ? '📌 Saved' : '📌 Save') + '</button>';
    html += '<button class="btn btn-primary btn-sm" style="flex:1;font-size:var(--text-xs);padding:var(--space-1) var(--space-2)" data-action="scholar:applyScholar" data-id="' + scholar.id + '">' + (isApplied ? 'Withdraw' : '📝 Apply') + '</button>';
    html += '</div>';

    html += '</div>';
    return html;
  }

  function renderPagination(page, total) {
    var html = '<div class="flex items-center justify-center gap-2" style="padding:var(--space-4) 0">';
    html += '<button class="btn btn-sm btn-ghost" style="min-width:70px" data-action="scholar:goToPage" data-page="' + (page - 1) + '" ' + (page <= 1 ? 'disabled' : '') + '>Previous</button>';
    var startP = Math.max(1, page - 2);
    var endP = Math.min(total, page + 2);
    if (startP > 1) {
      html += '<button class="btn btn-sm btn-ghost" data-action="scholar:goToPage" data-page="1">1</button>';
      if (startP > 2) html += '<span class="text-xs text-secondary">...</span>';
    }
    for (var p = startP; p <= endP; p++) {
      html += '<button class="btn btn-sm ' + (p === page ? 'btn-primary' : 'btn-ghost') + '" data-action="scholar:goToPage" data-page="' + p + '">' + p + '</button>';
    }
    if (endP < total) {
      if (endP < total - 1) html += '<span class="text-xs text-secondary">...</span>';
      html += '<button class="btn btn-sm btn-ghost" data-action="scholar:goToPage" data-page="' + total + '">' + total + '</button>';
    }
    html += '<button class="btn btn-sm btn-ghost" style="min-width:70px" data-action="scholar:goToPage" data-page="' + (page + 1) + '" ' + (page >= total ? 'disabled' : '') + '>Next</button>';
    html += '</div>';
    return html;
  }

  function renderFilterChips() {
    var chips = '';
    var chipStyle = 'display:inline-flex;align-items:center;gap:3px;padding:3px 8px;background:var(--bg-card);border:1px solid var(--border-color);border-radius:20px;font-size:11px;color:var(--text-secondary);cursor:pointer';
    if (searchQuery) {
      chips += '<span style="' + chipStyle + '" data-action="scholar:clearFilter" data-key="search">🔍 ' + utils.sanitizeHTML(utils.truncate(searchQuery, 20)) + ' <span style="margin-left:2px;font-size:13px;line-height:1">&times;</span></span>';
    }
    if (filterState.amount.min || filterState.amount.max) {
      var amtLabel = '₹';
      if (filterState.amount.min) amtLabel += filterState.amount.min;
      amtLabel += '-';
      if (filterState.amount.max) amtLabel += filterState.amount.max;
      chips += '<span style="' + chipStyle + '" data-action="scholar:clearFilter" data-key="amount">💰 ' + amtLabel + ' <span style="margin-left:2px;font-size:13px;line-height:1">&times;</span></span>';
    }
    for (var li = 0; li < filterState.level.length; li++) {
      chips += '<span style="' + chipStyle + '" data-action="scholar:clearFilter" data-key="level" data-value="' + filterState.level[li] + '">🎓 ' + filterState.level[li] + ' <span style="margin-left:2px;font-size:13px;line-height:1">&times;</span></span>';
    }
    for (var ci = 0; ci < filterState.category.length; ci++) {
      chips += '<span style="' + chipStyle + '" data-action="scholar:clearFilter" data-key="category" data-value="' + filterState.category[ci] + '">📂 ' + filterState.category[ci] + ' <span style="margin-left:2px;font-size:13px;line-height:1">&times;</span></span>';
    }
    if (filterState.deadline !== 'Any') {
      chips += '<span style="' + chipStyle + '" data-action="scholar:clearFilter" data-key="deadline">📅 ' + filterState.deadline + ' <span style="margin-left:2px;font-size:13px;line-height:1">&times;</span></span>';
    }
    if (filterState.status !== 'All') {
      chips += '<span style="' + chipStyle + '" data-action="scholar:clearFilter" data-key="status">📊 ' + filterState.status + ' <span style="margin-left:2px;font-size:13px;line-height:1">&times;</span></span>';
    }
    return chips;
  }

  function renderDetailDrawer(scholar) {
    if (!scholar) return;
    var existing = document.getElementById('scholar-drawer');
    if (existing) existing.remove();

    var applied = getApplied();
    var saved = getSaved();
    var isApplied = applied.indexOf(scholar.id) !== -1;
    var isSaved = saved.indexOf(scholar.id) !== -1;
    var countdown = getDeadlineCountdown(scholar.deadline);
    var isClosed = countdown === 'Closed';
    var status = getDeadlineStatus(scholar.deadline);
    var eduLevel = getEducationLevel(scholar.eligibility);
    var category = getCategoryFromType(scholar.type);
    var deadlineColor = getDeadlineColor(scholar.deadline);
    var similar = getSimilarScholarships(scholar, 3);

    var overlay = document.createElement('div');
    overlay.id = 'scholar-drawer-overlay';
    overlay.style.cssText = 'position:fixed;top:0;left:0;right:0;bottom:0;background:rgba(0,0,0,0.5);z-index:9998;opacity:0;transition:opacity 0.3s ease';

    var drawer = document.createElement('div');
    drawer.id = 'scholar-drawer';
    drawer.style.cssText = 'position:fixed;top:0;right:-520px;width:520px;max-width:100vw;height:100vh;background:var(--bg-card);z-index:9999;overflow-y:auto;box-shadow:-4px 0 30px rgba(0,0,0,0.3);transition:right 0.3s ease';

    var html = '<div style="padding:var(--space-5)">';

    html += '<div class="flex items-center justify-between" style="margin-bottom:var(--space-4)">';
    html += '<div class="flex items-center gap-2" style="flex:1;min-width:0">';
    html += '<div class="avatar avatar-sm" style="background:var(--accent-blue);color:#fff;font-weight:600">' + utils.getInitials(scholar.name) + '</div>';
    html += '<div style="min-width:0">';
    html += '<h2 style="font-size:var(--text-lg);font-weight:700;overflow:hidden;text-overflow:ellipsis;white-space:nowrap">' + utils.sanitizeHTML(scholar.name) + '</h2>';
    html += '<div class="text-xs text-secondary">' + utils.sanitizeHTML(scholar.provider) + '</div>';
    html += '</div></div>';
    html += '<button class="btn btn-sm btn-ghost" style="font-size:1.25rem;flex-shrink:0;line-height:1" data-action="scholar:closeDetail">&times;</button>';
    html += '</div>';

    html += '<div style="margin-bottom:var(--space-4)">';
    html += '<div style="font-size:var(--text-2xl);font-weight:700;color:var(--accent-green);margin-bottom:var(--space-2)">' + utils.formatCurrency(scholar.amount) + '</div>';
    html += '<div class="flex items-center gap-2" style="flex-wrap:wrap">';
    html += '<span class="' + getLevelBadgeClass(eduLevel) + '" style="font-size:var(--text-xs)">' + eduLevel + '</span>';
    html += '<span class="' + getCatBadgeClass(category) + '" style="font-size:var(--text-xs)">' + category + '</span>';
    html += '<span class="' + getStatusBadgeClass(status) + '" style="font-size:var(--text-xs)">' + status + '</span>';
    if (isApplied) html += '<span class="badge badge-yellow" style="font-size:var(--text-xs)">Applied</span>';
    html += '</div>';
    html += '</div>';

    html += '<div class="flex items-center gap-3" style="margin-bottom:var(--space-4);padding:var(--space-3);background:var(--bg-body);border-radius:var(--radius)">';
    html += '<div class="flex-1 text-center"><div style="font-size:var(--text-sm);font-weight:600;color:' + deadlineColor + '">' + countdown + '</div><div style="font-size:var(--text-xs);color:var(--text-secondary)">Deadline</div></div>';
    html += '<div class="flex-1 text-center"><div style="font-size:var(--text-sm);font-weight:600">' + utils.formatNumber(scholar.seats) + '</div><div style="font-size:var(--text-xs);color:var(--text-secondary)">Seats</div></div>';
    html += '<div class="flex-1 text-center"><div style="font-size:var(--text-sm);font-weight:600">' + utils.formatNumber(scholar.applicants) + '</div><div style="font-size:var(--text-xs);color:var(--text-secondary)">Applicants</div></div>';
    html += '</div>';

    if (scholar.eligibility) {
      html += '<div style="margin-bottom:var(--space-4)">';
      html += '<h4 style="font-weight:600;font-size:var(--text-sm);margin-bottom:var(--space-2)">✅ Eligibility Criteria</h4>';
      html += '<p class="text-sm text-secondary">' + utils.sanitizeHTML(scholar.eligibility) + '</p>';
      html += '</div>';
    }

    if (scholar.description) {
      html += '<div style="margin-bottom:var(--space-4)">';
      html += '<h4 style="font-weight:600;font-size:var(--text-sm);margin-bottom:var(--space-2)">📖 Description</h4>';
      html += '<p class="text-sm text-secondary">' + utils.sanitizeHTML(scholar.description) + '</p>';
      html += '</div>';
    }

    html += '<div style="margin-bottom:var(--space-4)">';
    html += '<h4 style="font-weight:600;font-size:var(--text-sm);margin-bottom:var(--space-2)">💰 Benefits</h4>';
    html += '<p class="text-sm text-secondary">Award of ' + utils.formatCurrency(scholar.amount) + ' to support your educational journey.</p>';
    html += '</div>';

    if (scholar.documents && scholar.documents.length) {
      var docs = scholar.documents;
      if (typeof docs[0] !== 'string' && docs[0]) docs = docs[0];
      html += '<div style="margin-bottom:var(--space-4)">';
      html += '<h4 style="font-weight:600;font-size:var(--text-sm);margin-bottom:var(--space-2)">📄 Documents Required</h4>';
      html += '<ul style="list-style:disc;padding-left:var(--space-5);font-size:var(--text-sm);color:var(--text-secondary)">';
      for (var d = 0; d < docs.length; d++) {
        html += '<li>' + utils.sanitizeHTML(docs[d]) + '</li>';
      }
      html += '</ul></div>';
    }

    if (scholar.applicationProcess) {
      html += '<div style="margin-bottom:var(--space-4)">';
      html += '<h4 style="font-weight:600;font-size:var(--text-sm);margin-bottom:var(--space-2)">📝 Application Process</h4>';
      html += '<p class="text-sm text-secondary">' + utils.sanitizeHTML(scholar.applicationProcess) + '</p>';
      html += '</div>';
    }

    html += '<div style="margin-bottom:var(--space-4)">';
    html += '<h4 style="font-weight:600;font-size:var(--text-sm);margin-bottom:var(--space-2)">📅 Important Dates</h4>';
    html += '<div style="font-size:var(--text-sm);color:var(--text-secondary)">';
    html += '<div class="flex items-center justify-between" style="padding:var(--space-1) 0"><span>Application Deadline</span><span style="font-weight:500">' + utils.formatDate(scholar.deadline, 'dd mmm yyyy') + ' (' + countdown + ')</span></div>';
    html += '</div></div>';

    if (similar.length > 0) {
      html += '<div style="margin-bottom:var(--space-4)">';
      html += '<h4 style="font-weight:600;font-size:var(--text-sm);margin-bottom:var(--space-2)">🔀 Similar Scholarships</h4>';
      html += '<div style="display:flex;flex-direction:column;gap:var(--space-2)">';
      for (var sim = 0; sim < similar.length; sim++) {
        var simS = similar[sim];
        html += '<div class="glass-card" style="padding:var(--space-2);cursor:pointer" data-action="scholar:openDetail" data-id="' + simS.id + '">';
        html += '<div style="font-size:var(--text-sm);font-weight:600;margin-bottom:2px">' + utils.sanitizeHTML(simS.name) + '</div>';
        html += '<div class="flex items-center justify-between">';
        html += '<span style="font-size:var(--text-xs);color:var(--text-secondary)">' + utils.sanitizeHTML(simS.provider) + '</span>';
        html += '<span style="font-size:var(--text-sm);font-weight:600;color:var(--accent-green)">' + utils.formatCurrency(simS.amount) + '</span>';
        html += '</div></div>';
      }
      html += '</div></div>';
    }

    html += '<div class="flex gap-2" style="position:sticky;bottom:0;padding:var(--space-3) 0;background:var(--bg-card);border-top:1px solid var(--border-color)">';
    html += '<button class="btn btn-sm" style="flex:1;background:' + (isApplied ? 'var(--accent-red)' : 'var(--accent-blue)') + ';color:#fff;border:none;border-radius:var(--radius);cursor:pointer;padding:var(--space-2) var(--space-3);font-size:var(--text-sm);font-weight:500" data-action="scholar:applyScholar" data-id="' + scholar.id + '">' + (isApplied ? 'Withdraw Application' : 'Apply Now') + '</button>';
    html += '<button class="btn btn-sm" style="background:var(--bg-card);border:1px solid var(--border-color);border-radius:var(--radius);cursor:pointer;padding:var(--space-2) var(--space-3);font-size:var(--text-sm);color:' + (isSaved ? 'var(--accent-yellow)' : 'var(--text-secondary)') + '" data-action="scholar:toggleSave" data-id="' + scholar.id + '">' + (isSaved ? '📌 Unsave' : '📌 Save') + '</button>';
    html += '<button class="btn btn-sm" style="background:var(--bg-card);border:1px solid var(--border-color);border-radius:var(--radius);cursor:pointer;padding:var(--space-2) var(--space-3);font-size:var(--text-sm);color:var(--text-secondary)" data-action="scholar:shareScholar" data-id="' + scholar.id + '">📤 Share</button>';
    html += '<button class="btn btn-sm" style="background:var(--bg-card);border:1px solid var(--border-color);border-radius:var(--radius);cursor:pointer;padding:var(--space-2) var(--space-3);font-size:var(--text-sm)" data-action="scholar:closeDetail">✕ Close</button>';
    html += '</div>';

    html += '</div>';
    drawer.innerHTML = html;

    overlay.appendChild(drawer);
    document.body.appendChild(overlay);

    requestAnimationFrame(function() {
      overlay.style.opacity = '1';
      drawer.style.right = '0';
    });

    overlay.addEventListener('click', function(e) {
      if (e.target === overlay) closeDetailDrawer(overlay, drawer);
    });
  }

  function closeDetailDrawer(overlay, drawer) {
    if (!overlay) overlay = document.getElementById('scholar-drawer-overlay');
    if (!drawer) drawer = document.getElementById('scholar-drawer');
    if (drawer) drawer.style.right = '-520px';
    if (overlay) overlay.style.opacity = '0';
    detailOpen = false;
    detailScholar = null;
    setTimeout(function() {
      if (overlay) overlay.remove();
      if (drawer) drawer.remove();
    }, 300);
  }

  window.renderPage.scholarship._statClick = function(key) {
    if (key.indexOf('Applied') === 0) { activeTab = 'applied'; }
    else if (key.indexOf('Saved') === 0) { activeTab = 'saved'; }
    else if (key.indexOf('Eligible') === 0) { activeTab = 'eligible'; }
    else { activeTab = 'all'; }
    currentPage = 1;
    render();
  };

  window.renderPage.scholarship.search = function(val) {
    searchQuery = val;
    currentPage = 1;
    render();
  };

  window.renderPage.scholarship.setSort = function(val) {
    activeSort = val;
    currentPage = 1;
    render();
  };

  window.renderPage.scholarship.setTab = function(tab) {
    activeTab = tab;
    currentPage = 1;
    render();
  };

  window.renderPage.scholarship.goToPage = function(page) {
    currentPage = page;
    render();
  };

  window.renderPage.scholarship.openFilter = function() {
    openFilterDrawer();
  };

  window.renderPage.scholarship.clearFilter = function(key, value) {
    if (key === 'search') {
      searchQuery = '';
      filterState.search = '';
    } else if (key === 'amount') {
      filterState.amount = { min: '', max: '' };
    } else if (key === 'level') {
      if (value) {
        var idx = filterState.level.indexOf(value);
        if (idx !== -1) filterState.level.splice(idx, 1);
      } else { filterState.level = []; }
    } else if (key === 'category') {
      if (value) {
        var idx2 = filterState.category.indexOf(value);
        if (idx2 !== -1) filterState.category.splice(idx2, 1);
      } else { filterState.category = []; }
    } else if (key === 'deadline') {
      filterState.deadline = 'Any';
    } else if (key === 'status') {
      filterState.status = 'All';
    }
    currentPage = 1;
    render();
  };

  window.renderPage.scholarship.toggleSave = function(id) { toggleSave(id); };
  window.renderPage.scholarship.applyScholar = function(id) {
    toggleApply(id);
    if (detailOpen && detailScholar && detailScholar.id === id) renderDetailDrawer(detailScholar);
  };
  window.renderPage.scholarship.openDetail = function(id) {
    var sch = null;
    for (var i = 0; i < scholarships.length; i++) {
      if (scholarships[i].id === id) { sch = scholarships[i]; break; }
    }
    if (sch) {
      detailOpen = true;
      detailScholar = sch;
      renderDetailDrawer(sch);
    }
  };
  window.renderPage.scholarship.shareScholar = function(id) {
    var sch = null;
    for (var i = 0; i < scholarships.length; i++) {
      if (scholarships[i].id === id) { sch = scholarships[i]; break; }
    }
    if (sch) shareScholar(sch);
  };
  window.renderPage.scholarship.closeDetail = function() { closeDetailDrawer(); };

  if (!window._scholarDelegated) {
    window._scholarDelegated = true;
    document.body.addEventListener('click', function(e) {
      var el = e.target.closest('[data-action^="scholar:"]');
      if (!el || el.getAttribute('disabled') !== null) return;
      var action = el.getAttribute('data-action');
      if (action === 'scholar:openFilter') openFilterDrawer();
      else if (action === 'scholar:setTab') window.renderPage.scholarship.setTab(el.getAttribute('data-tab'));
      else if (action === 'scholar:statClick') window.renderPage.scholarship._statClick(el.getAttribute('data-key'));
      else if (action === 'scholar:openDetail') window.renderPage.scholarship.openDetail(el.getAttribute('data-id'));
      else if (action === 'scholar:toggleSave') window.renderPage.scholarship.toggleSave(el.getAttribute('data-id'));
      else if (action === 'scholar:applyScholar') window.renderPage.scholarship.applyScholar(el.getAttribute('data-id'));
      else if (action === 'scholar:goToPage') window.renderPage.scholarship.goToPage(parseInt(el.getAttribute('data-page'), 10));
      else if (action === 'scholar:clearFilter') window.renderPage.scholarship.clearFilter(el.getAttribute('data-key'), el.getAttribute('data-value'));
      else if (action === 'scholar:closeDetail') window.renderPage.scholarship.closeDetail();
      else if (action === 'scholar:shareScholar') window.renderPage.scholarship.shareScholar(el.getAttribute('data-id'));
    });
  }

  isSkeleton = true;
  render();
};
