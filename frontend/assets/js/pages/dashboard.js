window.renderPage = window.renderPage || {};

var defaultWidgets = [
  { id: 'welcome' },
  { id: 'continueLearning' },
  { id: 'stats' },
  { id: 'missions' },
  { id: 'studyPlan' },
  { id: 'recentlyViewed' },
  { id: 'schedule' },
  { id: 'activity' },
  { id: 'leaderboard' },
  { id: 'quickActions' },
  { id: 'events' },
  { id: 'announcements' },
  { id: 'recommendations' },
  { id: 'studyTools' }
];

window.renderPage.dashboard = function(params) {
  var mc = document.getElementById('main-content');
  if (!mc) return;
  var user = window.Store.get('user');
  if (!user) { window.Router.navigate('/login'); return; }
  var md = window.mockData || {};
  var U = window.Utils;
  if (!U) return;

  if (!window._dashDelegateAdded) {
    window._dashDelegateAdded = true;
    document.addEventListener('click', function(e) {
      var target = e.target.closest('[data-action^="dashboard:"]');
      if (!target) return;
      var action = target.getAttribute('data-action');
      var parts = action.split(':');
      var cmd = parts[1];
      var arg = parts.slice(2).join(':');
      if (cmd === 'navigate' && arg) { location.hash = '#' + arg; return; }
      if (cmd === 'updateMission' && arg) { if (window.App && window.App.updateMissionProgress) window.App.updateMissionProgress(arg, 1); return; }
      if (cmd === 'openTimer') { if (window.EduFeatures) window.EduFeatures._openTimerModal(); return; }

      if (cmd === 'closePomodoro') { var m = document.getElementById('ef-pomodoro-modal'); if (m) m.style.display = 'none'; return; }
      if (cmd === 'closeOverlay') { if (target.style.display) target.style.display = 'none'; return; }
      if (cmd === 'addToCart') { e.stopPropagation(); var all = window.mockData && window.mockData.marketplace || []; for (var aci = 0; aci < all.length; aci++) { if (all[aci].id == arg && window.API && window.API.addToCart) { window.API.addToCart(all[aci]).then(function(){alert('Added to cart!')}); break; } } return; }

    });
  }

  var hour = new Date().getHours();
  var greeting = hour < 12 ? 'Good Morning' : hour < 17 ? 'Good Afternoon' : 'Good Evening';
  var xp = user.xp || 0;
  var coins = user.coins || 0;
  var level = user.level || 1;
  var xpForNextLevel = 1000;
  var xpInCurrentLevel = xp % xpForNextLevel;
  var userClass = user.class || 6;
  var achievements = window.Store.get('achievements') || [];
  var notifications = window.Store.get('notifications') || [];
  var cart = window.Store.get('cart') || [];
  var wishlist = window.Store.get('wishlist') || [];
  var settings = window.Store.get('settings') || {};
  var activityLog = window.Store.get('activityLog') || [];
  var studyPlan = window.Store.get('studyPlan');
  var continueWatching = window.Store.get('continueWatching') || [];
  var recentDownloads = window.Store.get('recentDownloads') || [];
  var quizResults = window.Store.get('quizResults') || [];
  var videoHistory = window.Store.get('videoHistory') || [];
  var recentlyViewed = window.Store.get('recentlyViewed') || [];
  var attendance = window.Store.get('attendance') || [];
  var dailyStats = { xp: 0, coins: 0, studyMinutes: 0 };
  if (window.App && window.App.getDailyStats) { dailyStats = window.App.getDailyStats(); }
  var dailyMissions = [];
  if (window.App && window.App.getDailyMissions) { dailyMissions = window.App.getDailyMissions(); }
  var leaderboard = md.leaderboard || [];
  var eventsList = md.events || [];
  var announcementsList = md.announcements || [];
  var assignmentsList = md.assignments || [];
  var subjects = md.subjects || [];
  var videos = md.videos || [];
  var resources = md.resources || [];
  var quizzes = md.quizzes || [];
  var courses = md.courses || [];
  var marketplace = md.marketplace || [];
  var enrolledClasses = md.enrolledClasses || [];
  var streak = (leaderboard.length > 0) ? (leaderboard[0].streak || 0) : 0;
  var userCourses = courses.filter(function(c) { return c.class == userClass || !c.class; });
  var enrolled = enrolledClasses.filter(function(e) { return e.userId === user.id; });
  var userBadges = user.badges || [];
  var userSubjects = subjects.filter(function(s) { return s.class == userClass; });
  if ((userClass == 11 || userClass == 12) && user.stream) {
    userSubjects = userSubjects.filter(function(s) { return !s.stream || s.stream === user.stream; });
  }
  if (userSubjects.length === 0 && U.classSubjects && U.classSubjects[userClass]) {
    userSubjects = U.classSubjects[userClass].map(function(n, idx) {
      return { id: 'cs_' + idx, name: n, icon: '\ud83d\udcda', color: ['#3b82f6','#8b5cf6','#06b6d4','#10b981','#f59e0b','#ec4899','#f97316'][idx % 7], chapters: 0 };
    });
  }
  var userSubjectIds = userSubjects.map(function(s) { return s.id; });
  var userVideos = videos.filter(function(v) { return userSubjectIds.indexOf(v.subjectId) !== -1; });
  var userResources = resources.filter(function(r) { return userSubjectIds.indexOf(r.subjectId) !== -1; });
  var userQuizzes = quizzes.filter(function(q) { return userSubjectIds.indexOf(q.subjectId) !== -1; });
  var topLeaderboard = leaderboard.slice(0, 5);
  var marketItems = marketplace.slice(0, 4);
  var enrolledCoursesCount = userCourses.length;
  var videosWatchedCount = videoHistory.length;
  var resourcesDownloadedCount = recentDownloads.length;
  var quizzesCompletedCount = quizResults.length;
  var assignmentsSubmittedCount = 0;
  for (var asi = 0; asi < assignmentsList.length; asi++) {
    var asn = assignmentsList[asi];
    if (asn.class == userClass && (asn.status === 'submitted' || asn.status === 'graded')) {
      assignmentsSubmittedCount++;
    }
  }
  var xpThisWeek = dailyStats.xp || 0;
  var hoursThisWeek = dailyStats.studyMinutes ? Math.round(dailyStats.studyMinutes / 60) : 0;
  var missionsCompleted = 0;
  for (var mci = 0; mci < dailyMissions.length; mci++) {
    if (dailyMissions[mci].progress >= dailyMissions[mci].target) { missionsCompleted++; }
  }



  function skeletonHTML() {
    return '\
<div class="page-container dashboard-page">\
  <div class="skeleton" style="height:180px;margin-bottom:var(--space-6);border-radius:var(--radius-lg)"></div>\
  <div class="skeleton" style="height:60px;margin-bottom:var(--space-6);border-radius:var(--radius-lg)"></div>\
  <div class="stats-grid" style="grid-template-columns:repeat(4,1fr)">\
    <div class="skeleton skeleton-card"></div>\
    <div class="skeleton skeleton-card"></div>\
    <div class="skeleton skeleton-card"></div>\
    <div class="skeleton skeleton-card"></div>\
    <div class="skeleton skeleton-card"></div>\
    <div class="skeleton skeleton-card"></div>\
    <div class="skeleton skeleton-card"></div>\
    <div class="skeleton skeleton-card"></div>\
  </div>\
  <div class="skeleton" style="height:200px;margin-top:var(--space-6);border-radius:var(--radius-lg)"></div>\
  <div class="skeleton" style="height:160px;margin-top:var(--space-6);border-radius:var(--radius-lg)"></div>\
</div>';
  }

  mc.innerHTML = skeletonHTML();

  setTimeout(function() {
    var fullHtml = buildDashboardHTML();
    mc.innerHTML = fullHtml;
    animateWidgets(mc);
    initCountUp(mc);
    initParticles(mc);
    if (window.EduFeatures) {
      window.EduFeatures.renderDailyGoals('ef-daily-goals');
      window.EduFeatures.renderQuickNotes('ef-quick-notes');
      window.EduFeatures.renderMotivationalQuote('ef-motivational-quote');
    }
  }, 500);

  function iconBg(c) {
    var m = { blue: 'rgba(59,130,246,0.15)', purple: 'rgba(139,92,246,0.15)', cyan: 'rgba(6,182,212,0.15)', green: 'rgba(16,185,129,0.15)', yellow: 'rgba(245,158,11,0.15)', pink: 'rgba(236,72,153,0.15)' };
    return m[c] || 'rgba(59,130,246,0.15)';
  }
  function iconClr(c) {
    var m = { blue: '#3b82f6', purple: '#8b5cf6', cyan: '#06b6d4', green: '#10b981', yellow: '#f59e0b', pink: '#ec4899' };
    return m[c] || '#3b82f6';
  }

  function getMotivationalMsg(s) {
    if (s >= 30) return 'Incredible dedication! You\'re unstoppable! \ud83d\udd25';
    if (s >= 14) return 'Amazing consistency! Two weeks strong! \ud83c\udf1f';
    if (s >= 7) return 'Great habit! One week streak and going! \u2b50';
    if (s >= 3) return 'Nice momentum building! Keep it up! \ud83d\udcaa';
    return 'Start your learning streak today! \ud83c\udfaf';
  }

  function getProfileHint() {
    var missing = [];
    if (!user.name || user.name === 'Student') missing.push('name');
    if (!user.email) missing.push('email');
    if (!user.avatar) missing.push('avatar');
    if (missing.length === 0) return '';
    return '<div class="c-mt-2 c-px-3 c-py-2 c-fs-xs c-flex-gap-2 c-pointer c-text-warning" style="background:rgba(245,158,11,0.1);border-radius:var(--radius-md)" data-action="dashboard:navigate:/settings">\u26a0\ufe0f Complete your profile: add ' + missing.join(', ') + ' <span class="c-text-accent">Go to Settings \u2192</span></div>';
  }

  function renderSummaryStrip() {
    var tasksDue = 0;
    for (var ti = 0; ti < assignmentsList.length; ti++) {
      var ta = assignmentsList[ti];
      if (ta.class == userClass && ta.dueDate && new Date(ta.dueDate) >= new Date() && ta.status !== 'submitted' && ta.status !== 'graded') {
        tasksDue++;
      }
    }
    var pct = xpForNextLevel > 0 ? Math.round((xpInCurrentLevel / xpForNextLevel) * 100) : 0;
    return '\
<div class="summary-strip c-flex-wrap c-p-3 c-px-4 c-mb-6 c-bg-glass c-border c-radius-lg c-fs-xs c-flex-center">\
  <div class="c-flex-gap-2"><span>\ud83d\udd25</span><span>Streak: <strong>' + streak + '</strong> days</span></div>\
  <div class="c-flex-gap-2"><span>\u2b50</span><span>XP: <strong>' + U.formatNumber(xp) + '</strong> / ' + U.formatNumber(xpForNextLevel) + ' (Lvl ' + level + ' \u2192 ' + (level + 1) + ': ' + pct + '%)</span></div>\
  <div class="c-flex-gap-2"><span>\ud83d\udcda</span><span>Courses: <strong>' + enrolledCoursesCount + '</strong> active</span></div>\
  <div class="c-flex-gap-2"><span>\u2705</span><span>Tasks: <strong>' + tasksDue + '</strong> due today</span></div>\
</div>';
  }

  function renderUserTagline() {
    var parts = [];
    if (user.class) parts.push('Class ' + user.class);
    if (user.stream) parts.push(user.stream);
    if (user.school) parts.push(user.school);
    else if (user.board) parts.push(user.board);
    if (parts.length === 0) return 'Happy learning! \ud83c\udf89';
    return '<span class="welcome-tagline-chip">' + parts.join('</span><span class="welcome-tagline-chip">') + '</span>';
  }

  function renderWelcomeHeader() {
    var streakMsg = getMotivationalMsg(streak);
    var profileHint = getProfileHint();
    var xpPct = xpForNextLevel > 0 ? Math.round((xpInCurrentLevel / xpForNextLevel) * 100) : 0;
    var userInitial = user.name ? user.name.charAt(0).toUpperCase() : 'S';
    return '\
<div class="dashboard-welcome widget-content c-relative c-overflow-hidden" data-widget="welcome">\
  <div class="welcome-particles c-absolute" id="welcome-particles" style="inset:0;pointer-events:none;overflow:hidden"></div>\
  <div class="c-relative c-z-1">\
    <div class="c-flex-wrap" style="display:flex;align-items:flex-start;justify-content:space-between;gap:var(--space-4)">\
      <div style="flex:1;min-width:200px">\
        <div class="c-flex-gap-3 c-mb-2">\
          <div style="width:52px;height:52px;border-radius:var(--radius-full);background:var(--gradient-primary);display:flex;align-items:center;justify-content:center;font-size:1.5rem;font-weight:700;color:#fff;flex-shrink:0;box-shadow:0 0 20px rgba(59,130,246,0.3)">' + userInitial + '</div>\
          <div>\
            <div class="welcome-title c-fw-bold" style="font-size:var(--text-2xl);margin-bottom:2px">' + greeting + ', ' + U.sanitizeHTML(user.name) + '!</div>\
            <div class="welcome-tagline c-fs-sm">' + renderUserTagline() + '</div>\
            <div class="welcome-text c-fs-sm c-text-secondary">' + streakMsg + '</div>\
          </div>\
        </div>\
        ' + profileHint + '\
      </div>\
      <div class="c-text-center" style="flex-shrink:0">\
        <div style="width:72px;height:72px;border-radius:var(--radius-full);background:var(--gradient-gold);display:flex;flex-direction:column;align-items:center;justify-content:center;box-shadow:0 0 30px rgba(245,158,11,0.3);animation:glow 2s ease-in-out infinite">\
          <div class="c-fs-xs c-fw-semibold" style="color:rgba(255,255,255,0.9)">LEVEL</div>\
          <div class="c-fw-bold" style="font-size:var(--text-2xl);color:#fff;line-height:1">' + level + '</div>\
        </div>\
      </div>\
    </div>\
    <div style="margin-top:var(--space-5);margin-bottom:var(--space-4)">\
      <div class="flex items-center justify-between text-xs text-secondary c-mb-2">\
        <span>Level ' + level + ' \u2192 ' + (level + 1) + '</span>\
        <span>' + xpPct + '% \u2022 ' + U.formatNumber(xp) + ' / ' + U.formatNumber(xpForNextLevel) + ' XP</span>\
      </div>\
      <div class="progress-bar" style="height:10px;background:var(--bg-glass-strong)">\
        <div class="progress-bar-fill progress-fill-blue xp-bar-fill" style="width:' + xpPct + '%"></div>\
      </div>\
    </div>\
    <div class="welcome-streak">\
      <div class="welcome-streak-item">\ud83d\udd25 <span class="welcome-streak-value">' + streak + '</span> Day Streak</div>\
      <div class="welcome-streak-item">\u2b50 <span class="welcome-streak-value">' + U.formatNumber(xp) + '</span> XP</div>\
      <div class="welcome-streak-item">\ud83e\ude99 <span class="welcome-streak-value">' + U.formatNumber(coins) + '</span> Coins</div>\
    </div>\
    <div class="flex gap-3 c-mt-2 c-flex-wrap">\
      <button class="btn btn-primary" data-action="dashboard:navigate:/subject/' + (userSubjectIds.length > 0 ? userSubjectIds[0] : '6') + '">Continue Learning</button>\
      <button class="btn btn-secondary" data-action="dashboard:navigate:/quizzes">Take Quiz</button>\
      <button class="btn btn-secondary" data-action="dashboard:navigate:/live-classes">Join Live Class</button>\
      <button class="btn btn-secondary" data-action="dashboard:navigate:/marketplace">Visit Marketplace</button>\
    </div>\
  </div>\
</div>';
  }

  function renderDailyStatsBar() {
    return '\
<div class="glass-card widget-content c-p-4 c-mb-6 c-flex-wrap c-flex-center" data-widget="stats-bar" style="gap:var(--space-4)">\
  <div class="c-text-center">\
    <div class="c-fw-bold c-text-accent" style="font-size:1.5rem">' + U.formatNumber(dailyStats.xp || 0) + '</div>\
    <div class="c-fs-xs c-text-tertiary">Today\'s XP</div>\
  </div>\
  <div class="c-text-center">\
    <div class="c-fw-bold c-text-warning" style="font-size:1.5rem">' + U.formatNumber(dailyStats.coins || 0) + '</div>\
    <div class="c-fs-xs c-text-tertiary">Coins Earned</div>\
  </div>\
  <div class="c-text-center">\
    <div class="c-fw-bold c-text-success" style="font-size:1.5rem">' + streak + '</div>\
    <div class="c-fs-xs c-text-tertiary">Study Streak</div>\
  </div>\
  <div class="c-text-center">\
    <div class="c-fw-bold" style="font-size:1.5rem;color:var(--accent-purple)">' + missionsCompleted + '/' + dailyMissions.length + '</div>\
    <div class="c-fs-xs c-text-tertiary">Missions Done</div>\
  </div>\
</div>';
  }

  function generateMiniChart() {
    var bars = '';
    for (var bi = 0; bi < 7; bi++) {
      var h = Math.floor(Math.random() * 60) + 10;
      bars += '<div class="c-radius-sm" style="width:6px;height:' + h + 'px;background:var(--accent-blue);opacity:0.' + (Math.floor(Math.random() * 5) + 3) + '"></div>';
    }
    return '<div class="c-mt-2" style="display:flex;align-items:flex-end;gap:2px;height:40px">' + bars + '</div>';
  }

  function statsNavPath(label) {
    var m = {
      'Enrolled Courses': '/subjects',
      'Videos Watched': '/videos',
      'Resources Downloaded': '/resources',
      'Quizzes Completed': '/quizzes',
      'Assignments Submitted': '/assignments',
      'Study Streak': '/profile',
      'XP This Week': '/analytics',
      'Hours Studied': '/analytics'
    };
    return m[label] || '/subjects';
  }

  function renderStatsGrid() {
    var items = [
      { label: 'Enrolled Courses', value: enrolledCoursesCount, icon: '\ud83d\udcda', color: 'blue' },
      { label: 'Videos Watched', value: videosWatchedCount, icon: '\ud83c\udfac', color: 'purple' },
      { label: 'Resources Downloaded', value: resourcesDownloadedCount, icon: '\ud83d\udcc4', color: 'cyan' },
      { label: 'Quizzes Completed', value: quizzesCompletedCount, icon: '\ud83d\udcdd', color: 'green' },
      { label: 'Assignments Submitted', value: assignmentsSubmittedCount, icon: '\u2705', color: 'yellow' },
      { label: 'Study Streak', value: streak, icon: '\ud83d\udd25', color: 'pink' },
      { label: 'XP This Week', value: U.formatNumber(xpThisWeek), icon: '\u2b50', color: 'blue' },
      { label: 'Hours Studied', value: hoursThisWeek + 'h', icon: '\u23f1\ufe0f', color: 'purple' }
    ];
    var html = '';
    for (var i = 0; i < items.length; i++) {
      var b = items[i];
      var rawVal = typeof b.value === 'number' ? b.value : parseInt(b.value, 10) || 0;
      var displayVal = b.value;
      html += '\
<div class="stat-card widget-content c-pointer" data-widget="stats" style="animation-delay:' + (i * 60) + 'ms" data-action="dashboard:navigate:' + statsNavPath(b.label) + '">\
  <div class="stat-icon" style="background:' + iconBg(b.color) + ';color:' + iconClr(b.color) + '">' + b.icon + '</div>\
  <div class="stat-value count-up" data-target="' + rawVal + '">' + displayVal + '</div>\
  <div class="stat-label">' + b.label + '</div>\
  <div class="c-mt-2" style="opacity:0.6">\
    <div style="display:flex;align-items:flex-end;gap:2px;height:28px">\
      <div style="width:4px;height:' + (Math.floor(Math.random() * 16) + 6) + 'px;border-radius:2px;background:' + iconClr(b.color) + ';opacity:0.4"></div>\
      <div style="width:4px;height:' + (Math.floor(Math.random() * 20) + 8) + 'px;border-radius:2px;background:' + iconClr(b.color) + ';opacity:0.5"></div>\
      <div style="width:4px;height:' + (Math.floor(Math.random() * 24) + 10) + 'px;border-radius:2px;background:' + iconClr(b.color) + ';opacity:0.6"></div>\
      <div style="width:4px;height:' + (Math.floor(Math.random() * 28) + 12) + 'px;border-radius:2px;background:' + iconClr(b.color) + ';opacity:0.7"></div>\
      <div style="width:4px;height:' + (Math.floor(Math.random() * 24) + 10) + 'px;border-radius:2px;background:' + iconClr(b.color) + ';opacity:0.6"></div>\
      <div style="width:4px;height:' + (Math.floor(Math.random() * 20) + 8) + 'px;border-radius:2px;background:' + iconClr(b.color) + ';opacity:0.5"></div>\
      <div style="width:4px;height:' + (Math.floor(Math.random() * 16) + 6) + 'px;border-radius:2px;background:' + iconClr(b.color) + ';opacity:0.4"></div>\
    </div>\
  </div>\
</div>';
    }
    return '\
<div class="stats-grid widget-content" data-widget="stats" style="grid-template-columns:repeat(auto-fill,minmax(220px,1fr))">' + html + '</div>';
  }

  function renderDailyMissions() {
    if (dailyMissions.length === 0) {
      return '\
<div class="glass-card widget-content" data-widget="missions" style="padding:var(--space-5);margin-bottom:var(--space-6)">\
  <div style="text-align:center;padding:var(--space-4)">\
    <div style="font-size:2rem;margin-bottom:var(--space-2)">\ud83c\udfaf</div>\
    <div style="font-size:var(--text-sm);color:var(--text-tertiary)">No missions available today. Check back tomorrow!</div>\
  </div>\
</div>';
    }
    var allDone = missionsCompleted === dailyMissions.length && dailyMissions.length > 0;
    var html = '\
<div class="glass-card widget-content" data-widget="missions" style="padding:var(--space-5);margin-bottom:var(--space-6)">\
  <div class="c-flex-between c-mb-4">\
    <h3 class="c-fs-lg c-fw-semibold">\ud83c\udfaf Daily Missions</h3>\
    <span class="c-fs-xs c-text-tertiary">' + missionsCompleted + '/' + dailyMissions.length + ' completed' + (allDone ? ' \u2705' : '') + '</span>\
  </div>';
    if (allDone) {
      html += '\
  <div class="c-text-center c-p-3 c-mb-4 c-radius-md c-text-success c-fs-sm c-fw-semibold" style="background:rgba(16,185,129,0.1)">\
    <span>\u2705 All missions complete! Great work!</span>\
  </div>';
    }
    for (var i = 0; i < dailyMissions.length; i++) {
      var m = dailyMissions[i];
      var pct = Math.min(100, Math.round((m.progress / m.target) * 100));
      var done = m.progress >= m.target;
      html += '\
  <div class="mission-item-wrapper widget-content c-flex-gap-3 c-mb-3 c-pointer" data-widget="missions" data-action="dashboard:updateMission:' + m.type + '">\
    <div style="width:36px;height:36px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:1.25rem;background:' + (done ? 'rgba(16,185,129,0.15)' : 'var(--bg-glass)') + '">' + m.icon + '</div>\
    <div style="flex:1">\
      <div class="c-fs-sm c-fw-medium" style="color:' + (done ? 'var(--accent-green)' : 'var(--text-primary)') + '">' + U.sanitizeHTML(m.title) + '</div>\
      <div class="c-fs-xs c-text-tertiary">' + U.sanitizeHTML(m.desc) + ' (' + m.xp + ' XP, ' + m.coins + ' coins)</div>\
      <div class="progress-bar" style="margin-top:4px;height:6px"><div class="progress-bar-fill ' + (done ? 'progress-fill-green' : 'progress-fill-blue') + '" style="width:' + pct + '%"></div></div>\
    </div>\
    <div class="c-fs-xs c-fw-semibold" style="color:' + (done ? 'var(--accent-green)' : 'var(--text-tertiary)') + '">' + m.progress + '/' + m.target + '</div>\
  </div>';
    }
    html += '\
</div>';
    return html;
  }

  function renderStudyPlan() {
    if (studyPlan && studyPlan.schedule && studyPlan.schedule.length > 0) {
      var today = new Date().getDay() || 7;
      var dayPlan = studyPlan.schedule[today - 1] || studyPlan.schedule[0];
      if (!dayPlan) { return renderNoStudyPlan(); }
      var sessions = dayPlan.sessions || [];
      if (sessions.length === 0) return renderNoStudyPlan();
      var html = '';
      for (var i = 0; i < sessions.length; i++) {
        var sess = sessions[i];
        var sp = Math.floor(Math.random() * 40) + 30;
        html += '\
<div class="glass-card widget-content c-p-4 c-mb-3" data-widget="studyPlan">\
  <div class="flex items-center gap-3">\
    <div class="c-radius-md c-bg-glass" style="width:40px;height:40px;display:flex;align-items:center;justify-content:center;font-size:1.25rem">\ud83d\udcd6</div>\
    <div class="flex-1">\
      <div class="text-sm font-semibold">' + U.sanitizeHTML(sess.subject || 'Study') + '</div>\
      <div class="text-xs text-secondary">' + U.sanitizeHTML(sess.topic || 'Chapter Review') + ' &middot; ' + U.formatDuration(sess.duration || 60) + '</div>\
    </div>\
    <div style="width:60px;text-align:right">\
      <div class="text-sm font-bold c-text-success">' + sp + '%</div>\
    </div>\
  </div>\
  <div class="progress-bar c-mt-2">\
    <div class="progress-bar-fill progress-fill-green" style="width:' + sp + '%"></div>\
  </div>\
</div>';
      }
      return html;
    }
    return renderNoStudyPlan();
  }

  function renderNoStudyPlan() {
    return '\
<div class="empty-state widget-content" data-widget="studyPlan" style="padding:var(--space-8)">\
  <div class="empty-state-icon" style="width:60px;height:60px;font-size:1.5rem;margin-bottom:var(--space-4)">\ud83e\udd16</div>\
  <h3 class="empty-state-title c-fs-lg">No Study Plan Yet</h3>\
  <p class="empty-state-text c-fs-sm c-mb-4">Let AI create a personalized study plan for you!</p>\
  <button class="btn btn-primary btn-sm" data-action="dashboard:navigate:/ai-route">+ Create Study Plan</button>\
</div>';
  }

  function renderContinueLearning() {
    if (continueWatching.length === 0 && recentDownloads.length === 0 && quizResults.length === 0) {
      return '\
<div class="empty-state widget-content" data-widget="continueLearning" style="padding:var(--space-6)">\
  <div class="empty-state-text c-fs-sm">Start watching videos, downloading resources, or taking quizzes to see your progress here!</div>\
  <div class="c-mt-2"><a href="#/subjects" class="c-text-accent c-fs-sm c-fw-medium">Explore Subjects \u2192</a></div>\
</div>';
    }
    var html = '';
    var cnt = 0;
    var maxCnt = 4;
    for (var j = 0; j < continueWatching.length && cnt < maxCnt; j++) {
      var v = continueWatching[j];
      html += '\
<div class="content-card widget-content" data-widget="continueLearning" style="min-width:240px;flex-shrink:0" data-action="dashboard:navigate:/videos">\
  <div class="content-card-image" style="height:100px;background:' + U.getGradient(j) + ';display:flex;align-items:center;justify-content:center;font-size:2rem">\ud83c\udfac</div>\
  <div class="content-card-body">\
    <div class="content-card-title">' + U.sanitizeHTML(v.title || 'Video') + '</div>\
    <div class="content-card-text text-xs">' + (v.progress || 0) + '% complete</div>\
  </div>\
  <div class="progress-bar" style="margin:0 var(--space-5) var(--space-4)">\
    <div class="progress-bar-fill progress-fill-blue" style="width:' + (v.progress || 0) + '%"></div>\
  </div>\
</div>';
      cnt++;
    }
    for (var k = 0; k < recentDownloads.length && cnt < maxCnt; k++) {
      var r = recentDownloads[k];
      html += '\
<div class="content-card widget-content" data-widget="continueLearning" style="min-width:240px;flex-shrink:0" data-action="dashboard:navigate:/resources">\
  <div class="content-card-image" style="height:100px;background:var(--gradient-secondary);display:flex;align-items:center;justify-content:center;font-size:2rem">\ud83d\udcc4</div>\
  <div class="content-card-body">\
    <div class="content-card-title">' + U.sanitizeHTML(r.title || 'Resource') + '</div>\
    <div class="content-card-text text-xs">Downloaded</div>\
  </div>\
</div>';
      cnt++;
    }
    for (var l = 0; l < quizResults.length && cnt < maxCnt; l++) {
      var quiz = quizResults[l];
      html += '\
<div class="content-card widget-content" data-widget="continueLearning" style="min-width:240px;flex-shrink:0" data-action="dashboard:navigate:/quizzes">\
  <div class="content-card-image" style="height:100px;background:var(--gradient-primary);display:flex;align-items:center;justify-content:center;font-size:2rem">\ud83d\udcdd</div>\
  <div class="content-card-body">\
    <div class="content-card-title">' + U.sanitizeHTML(quiz.title || 'Quiz') + '</div>\
    <div class="content-card-text text-xs">Score: ' + (quiz.score || 0) + '/' + (quiz.total || 0) + '</div>\
  </div>\
</div>';
      cnt++;
    }
    return '\
<div class="flex widget-content c-scroll-y" data-widget="continueLearning" style="gap:var(--space-4);padding-bottom:var(--space-2)">' + html + '</div>';
  }

  function renderRecentlyViewed() {
    if (recentlyViewed.length === 0) {
      return '\
<div class="empty-state widget-content" data-widget="recentlyViewed" style="padding:var(--space-6)">\
  <div class="empty-state-text c-fs-sm">No recently viewed pages yet. Start exploring the platform!</div>\
  <div class="c-mt-2"><a href="#/subjects" class="c-text-accent c-fs-sm c-fw-medium">Explore Subjects \u2192</a></div>\
</div>';
    }
    var html = '';
    var count = Math.min(recentlyViewed.length, 5);
    var icons = { '/subjects': '\ud83d\udcda', '/videos': '\ud83c\udfac', '/quizzes': '\ud83d\udcdd', '/resources': '\ud83d\udcc4', '/marketplace': '\ud83d\udecd\ufe0f', '/profile': '\ud83d\udc64', '/schedule': '\ud83d\udcc5', '/live-classes': '\ud83c\udf99\ufe0f', '/virtual-labs': '\ud83d\udd2c', '/gamification': '\ud83c\udfc6', '/community': '\ud83d\udcac', '/notifications': '\ud83d\udd14', '/feed': '\ud83d\udcf1' };
    for (var i = 0; i < count; i++) {
      var rv = recentlyViewed[i];
      var path = rv.path || '/subjects';
      var icon = icons[path] || '\ud83d\udccc';
      html += '\
<div class="glass-card widget-content c-p-4 c-mb-3 c-pointer" data-widget="recentlyViewed" data-action="dashboard:navigate:' + path + '">\
  <div class="flex items-center gap-3">\
    <div class="c-radius-md c-bg-glass" style="width:40px;height:40px;display:flex;align-items:center;justify-content:center;font-size:1.25rem;flex-shrink:0">' + icon + '</div>\
    <div class="flex-1" style="min-width:0">\
      <div class="text-sm font-semibold">' + U.sanitizeHTML(rv.title || 'Page') + '</div>\
      <div class="text-xs text-secondary">' + (rv.time ? U.formatRelativeTime(rv.time) : 'Recently') + '</div>\
    </div>\
  </div>\
</div>';
    }
    return '\
<div class="widget-content" data-widget="recentlyViewed">' + html + '</div>';
  }

  function renderUpcomingSchedule() {
    var todayStr = new Date().toISOString().split('T')[0];
    var todayEvents = [];
    for (var ei = 0; ei < eventsList.length; ei++) {
      var ev = eventsList[ei];
      if (ev.date === todayStr || (ev.date && ev.date.indexOf(todayStr) === 0)) {
        todayEvents.push(ev);
      }
    }
    if (todayEvents.length === 0) { todayEvents = eventsList.slice(0, 3); }
    if (todayEvents.length === 0) {
      return '\
<div class="glass-card widget-content" data-widget="schedule" style="padding:var(--space-5);margin-bottom:var(--space-6)">\
  <div class="empty-state-text text-sm c-mb-2">No events scheduled for today.</div>\
  <button class="btn btn-secondary btn-sm" data-action="dashboard:navigate:/schedule">+ Add Event</button>\
</div>';
    }
    var html = '\
<div class="glass-card widget-content c-p-4 c-mb-6" data-widget="schedule">\
  <div class="c-flex-between c-mb-3">\
    <h3 class="c-fs-lg c-fw-semibold">\ud83d\udcc5 Today\'s Schedule</h3>\
  </div>';
    for (var ei2 = 0; ei2 < Math.min(todayEvents.length, 4); ei2++) {
      var ev2 = todayEvents[ei2];
      html += '\
  <div class="schedule-item flex items-center gap-3 widget-content c-p-3 c-border-bottom c-pointer" data-widget="schedule" data-action="dashboard:navigate:/schedule">\
    <div class="c-radius-md c-bg-glass" style="width:44px;height:44px;display:flex;align-items:center;justify-content:center;font-size:1.25rem">\ud83d\udccb</div>\
    <div class="flex-1">\
      <div class="text-sm font-semibold">' + U.sanitizeHTML(ev2.title || ev2.name || 'Event') + '</div>\
      <div class="text-xs text-secondary">' + (ev2.time ? U.sanitizeHTML(ev2.time) + ' &middot; ' : '') + (ev2.location ? U.sanitizeHTML(ev2.location) : (ev2.type || '')) + '</div>\
    </div>\
  </div>';
    }
    html += '\
</div>';
    return html;
  }

  function renderRecentActivity() {
    if (activityLog.length === 0) {
      return '\
<div class="glass-card widget-content" data-widget="activity" style="padding:var(--space-5);margin-bottom:var(--space-6)">\
  <div class="empty-state-text text-sm">Start learning to see your activity here!</div>\
</div>';
    }
    var html = '\
<div class="glass-card widget-content c-p-4 c-mb-6" data-widget="activity">\
  <div class="c-flex-between c-mb-3">\
    <h3 class="c-fs-lg c-fw-semibold">\ud83d\udcf1 Recent Activity</h3>\
    <span class="section-action text-xs c-pointer" data-action="dashboard:navigate:/feed">View All &rarr;</span>\
  </div>';
    var items = activityLog.slice(-5).reverse();
    for (var i = 0; i < items.length; i++) {
      var act = items[i];
      var icon = act.icon || '\ud83d\udccc';
      var ts = act.timestamp || act.createdAt || '';
      html += '\
  <div class="flex items-start gap-3 widget-content c-p-3 c-border-bottom" data-widget="activity">\
    <div class="c-radius-md c-bg-glass" style="width:36px;height:36px;display:flex;align-items:center;justify-content:center;flex-shrink:0;font-size:1rem">' + icon + '</div>\
    <div class="flex-1" style="min-width:0">\
      <div class="text-sm">' + U.sanitizeHTML(act.description || '') + '</div>\
      <div class="text-xs text-secondary" style="margin-top:2px">' + U.formatRelativeTime(ts) + '</div>\
    </div>\
  </div>';
    }
    html += '\
</div>';
    return html;
  }

  function renderLeaderboard() {
    if (topLeaderboard.length === 0) {
      return '\
<div class="empty-state-text widget-content" data-widget="leaderboard" style="padding:var(--space-4)">\
  <div class="text-sm c-mb-2">No leaderboard data available yet.</div>\
  <button class="btn btn-secondary btn-sm" data-action="dashboard:navigate:/subjects">Start Learning &rarr;</button>\
</div>';
    }
    var html = '';
    for (var i = 0; i < topLeaderboard.length; i++) {
      var entry = topLeaderboard[i];
      var rankCls = '';
      if (entry.rank === 1) rankCls = ' gold';
      else if (entry.rank === 2) rankCls = ' silver';
      else if (entry.rank === 3) rankCls = ' bronze';
      var avHtml = entry.avatar ? '<img src="' + U.sanitizeHTML(entry.avatar) + '" class="avatar" style="width:36px;height:36px">' : '<div class="avatar c-fs-xs" style="width:36px;height:36px">' + U.getInitials(entry.name) + '</div>';
      html += '\
<div class="leaderboard-item widget-content" data-widget="leaderboard">\
  <div class="leaderboard-rank' + rankCls + '">#' + entry.rank + '</div>\
  ' + avHtml + '\
  <div class="leaderboard-info">\
    <div class="leaderboard-name">' + U.sanitizeHTML(entry.name) + '</div>\
    <div class="leaderboard-points">Level ' + (entry.level || 1) + ' &middot; ' + (entry.streak || 0) + ' day streak</div>\
  </div>\
  <div class="leaderboard-xp">' + U.formatNumber(entry.xp || 0) + ' XP</div>\
</div>';
    }
    return html;
  }

  function renderQuickActions() {
    var actions = [
      { label: 'Take a Quiz', icon: '\ud83d\udcdd', path: '/quizzes', color: '#3b82f6' },
      { label: 'Watch Videos', icon: '\ud83c\udfac', path: '/videos', color: '#8b5cf6' },
      { label: 'Virtual Labs', icon: '\ud83d\udd2c', path: '/virtual-labs', color: '#10b981' },
      { label: 'Gamification', icon: '\ud83c\udfc6', path: '/gamification', color: '#f59e0b' },
      { label: 'Join Community', icon: '\ud83d\udcac', path: '/community', color: '#06b6d4' },
      { label: 'Visit Marketplace', icon: '\ud83d\udecd\ufe0f', path: '/marketplace', color: '#ec4899' }
    ];
    var html = '';
    for (var i = 0; i < actions.length; i++) {
      var qa = actions[i];
      html += '\
<div class="glass-card quick-action-item widget-content c-p-5 c-text-center c-pointer c-transition" data-widget="quickActions" data-action="dashboard:navigate:' + qa.path + '" style="--hover-border-color:' + qa.color + '40">\
  <div style="font-size:2rem;margin-bottom:var(--space-2)">' + qa.icon + '</div>\
  <div class="text-sm font-semibold">' + qa.label + '</div>\
</div>';
    }
    return '\
<div class="stats-grid widget-content" data-widget="quickActions" style="grid-template-columns:repeat(auto-fill,minmax(160px,1fr))">' + html + '</div>';
  }

  function renderUpcomingEvents() {
    var upcoming = [];
    var now = new Date();
    for (var ei = 0; ei < eventsList.length; ei++) {
      var ev = eventsList[ei];
      if (!ev.date) continue;
      var evDate = new Date(ev.date);
      if (evDate >= now || ev.date === now.toISOString().split('T')[0]) {
        upcoming.push(ev);
      }
    }
    upcoming.sort(function(a, b) { return new Date(a.date) - new Date(b.date); });
    var top3 = upcoming.slice(0, 3);
    if (top3.length === 0) {
      return '\
<div class="glass-card widget-content c-p-4 c-mb-3" data-widget="events">\
  <div class="empty-state-text text-sm">No upcoming events.</div>\
</div>';
    }
    var html = '';
    for (var i2 = 0; i2 < top3.length; i2++) {
      var ev2 = top3[i2];
      var evDate2 = new Date(ev2.date + 'T10:00:00');
      var dName = U.formatDate ? U.formatDate(ev2.date, 'ddd') : '';
      var dNum = evDate2.getDate() || '';
      var mon = U.formatDate ? U.formatDate(ev2.date, 'mmm') : '';
      html += '\
<div class="event-item flex items-center gap-4 glass-card widget-content c-p-4 c-mb-3 c-pointer" data-widget="events" data-action="dashboard:navigate:/schedule">\
  <div class="c-radius-md c-bg-glass" style="width:56px;height:56px;display:flex;flex-direction:column;align-items:center;justify-content:center;flex-shrink:0">\
    <div class="text-xs text-secondary">' + U.sanitizeHTML(dName) + '</div>\
    <div class="text-lg font-bold">' + dNum + '</div>\
    <div class="text-xs text-secondary">' + U.sanitizeHTML(mon) + '</div>\
  </div>\
  <div class="flex-1">\
    <div class="text-sm font-semibold">' + U.sanitizeHTML(ev2.title || ev2.name || 'Event') + '</div>\
    <div class="text-xs text-secondary">' + (ev2.organizer ? U.sanitizeHTML(ev2.organizer) + ' &middot; ' : '') + (ev2.time ? U.sanitizeHTML(ev2.time) + ' &middot; ' : '') + (ev2.type || '') + '</div>\
  </div>\
  <div class="c-radius-full" style="width:8px;height:8px;background:var(--accent-green);flex-shrink:0"></div>\
</div>';
    }
    return html;
  }

  function renderAnnouncements() {
    var anns = announcementsList.slice(0, 2);
    if (anns.length === 0) {
      return '\
<div class="glass-card widget-content c-p-4 c-mb-3" data-widget="announcements">\
  <div class="empty-state-text text-sm">No announcements.</div>\
</div>';
    }
    var html = '';
    for (var i = 0; i < anns.length; i++) {
      var ann = anns[i];
      var msg = ann.content || ann.message || '';
      html += '\
<div class="ann-item glass-card widget-content c-p-4 c-mb-3 c-pointer" data-widget="announcements" data-action="dashboard:navigate:/notifications">\
  <div class="flex items-start gap-3">\
    <div class="c-radius-md" style="width:40px;height:40px;background:var(--gradient-primary);display:flex;align-items:center;justify-content:center;flex-shrink:0;font-size:1.25rem">\ud83d\udce2</div>\
    <div class="flex-1" style="min-width:0">\
      <div class="text-sm font-semibold">' + U.sanitizeHTML(ann.title || 'Update') + '</div>\
      <div class="text-xs text-secondary" style="margin-top:2px">' + U.sanitizeHTML(U.truncate(msg, 100)) + '</div>\
      <div class="text-xs text-tertiary" style="margin-top:4px">' + U.formatRelativeTime(ann.date) + '</div>\
    </div>\
  </div>\
</div>';
    }
    return html;
  }

  function renderRecommendedForYou() {
    var recs = [];
    for (var i = 0; i < marketplace.length && recs.length < 4; i++) {
      var item = marketplace[i];
      if (item.class === undefined || item.class == userClass) {
        recs.push({ id: item.id, title: item.title, price: item.price, originalPrice: item.originalPrice, category: item.category, rating: item.rating, reviews: item.reviews, type: 'market' });
      }
    }
    for (var ri = 0; ri < userResources.length && recs.length < 4; ri++) {
      var res = userResources[ri];
      recs.push({ id: 'rec_' + ri, title: res.title, type: 'resource', category: res.type || 'Resource' });
    }
    if (recs.length === 0) {
      return '\
<div class="glass-card widget-content c-p-4 c-mb-3" data-widget="recommendations">\
  <div class="empty-state-text text-sm">No recommendations available yet. Explore more content!</div>\
  <div class="c-mt-2"><a href="#/subjects" class="c-text-accent c-fs-sm c-fw-medium">Explore Subjects \u2192</a></div>\
</div>';
    }
    var html = '';
    for (var i2 = 0; i2 < recs.length; i2++) {
      var it = recs[i2];
      if (it.type === 'market') {
        var disc = it.originalPrice > it.price ? Math.round((1 - it.price / it.originalPrice) * 100) : 0;
        html += '\
<div class="content-card rec-item widget-content" data-widget="recommendations" style="min-width:200px;flex-shrink:0" data-action="dashboard:navigate:/marketplace/product/' + it.id + '">\
  <div class="content-card-image" style="height:100px;font-size:2rem;background:var(--gradient-card);display:flex;align-items:center;justify-content:center">\
    ' + (disc > 0 ? '<span class="content-card-badge c-absolute c-fs-xs c-fw-semibold" style="top:8px;left:8px;background:var(--accent-green);color:white;padding:2px 8px;border-radius:var(--radius-sm)">-' + disc + '%</span>' : '') + '\
    \ud83d\udecd\ufe0f\
  </div>\
  <div class="content-card-body">\
    <div class="content-card-title c-fs-sm">' + U.sanitizeHTML(U.truncate(it.title, 40)) + '</div>\
    <div class="content-card-text text-xs">' + U.formatCurrency(it.price) + '</div>\
  </div>\
</div>';
      } else {
        html += '\
<div class="content-card rec-item widget-content" data-widget="recommendations" style="min-width:200px;flex-shrink:0" data-action="dashboard:navigate:/resources">\
  <div class="content-card-image" style="height:100px;font-size:2rem;background:var(--gradient-secondary);display:flex;align-items:center;justify-content:center">\ud83d\udcc4</div>\
  <div class="content-card-body">\
    <div class="content-card-title c-fs-sm">' + U.sanitizeHTML(U.truncate(it.title, 40)) + '</div>\
    <div class="content-card-text text-xs">' + U.sanitizeHTML(it.category) + '</div>\
  </div>\
</div>';
      }
    }
    return '\
<div class="flex widget-content c-scroll-y" data-widget="recommendations" style="gap:var(--space-4);padding-bottom:var(--space-2)">' + html + '</div>';
  }

  function renderMarketplace() {
    if (marketItems.length === 0) {
      return '\
<div class="empty-state-text widget-content" data-widget="marketplace" style="padding:var(--space-4)">\
  <div class="text-sm">No products available.</div>\
  <a href="#/marketplace" class="c-text-accent c-fs-sm c-fw-medium c-mt-2 c-inline-block">Browse Marketplace \u2192</a>\
</div>';
    }
    var html = '';
    for (var i = 0; i < marketItems.length; i++) {
      var item = marketItems[i];
      var disc = item.originalPrice > item.price ? Math.round((1 - item.price / item.originalPrice) * 100) : 0;
      html += '\
<div class="product-card widget-content" data-widget="marketplace" data-action="dashboard:navigate:/marketplace/product/' + item.id + '">\
  <div class="product-image" style="height:140px;font-size:2.5rem;background:var(--gradient-card)">\
    ' + (disc > 0 ? '<div class="product-badge"><span class="content-card-badge c-fs-xs c-fw-semibold c-text-success" style="position:static;padding:2px 8px;border-radius:var(--radius-sm)">-' + disc + '%</span></div>' : '') + '\
    \ud83d\udecd\ufe0f\
  </div>\
  <div class="product-body">\
    <div class="product-category">' + (item.category || 'General') + '</div>\
    <div class="product-title">' + U.sanitizeHTML(U.truncate(item.title, 40)) + '</div>\
    <div class="product-rating">\u2b50 ' + (item.rating || '0') + ' (' + (item.reviews || 0) + ')</div>\
    <div class="product-footer">\
      <div><span class="text-lg font-bold">' + U.formatCurrency(item.price) + '</span>' + (item.originalPrice > item.price ? ' <span class="text-xs text-tertiary" style="text-decoration:line-through">' + U.formatCurrency(item.originalPrice) + '</span>' : '') + '</div>\
      <button class="btn btn-primary btn-sm" data-action="dashboard:addToCart:' + item.id + '">Add to Cart</button>\
    </div>\
  </div>\
</div>';
    }
    return '\
<div class="stats-grid widget-content c-grid" data-widget="marketplace" style="grid-template-columns:repeat(auto-fill,minmax(240px,1fr))">' + html + '</div>';
  }

  function renderStudyTools() {
    return '\
<div class="widget-content" data-widget="studyTools">\
<div class="section-header c-mt-2">\
  <div>\
    <div class="section-title">\ud83d\udd27 Study Tools</div>\
    <div class="section-subtitle">Productivity tools to enhance your learning</div>\
  </div>\
</div>\
<div class="stats-grid c-grid" style="grid-template-columns:repeat(auto-fill,minmax(280px,1fr))">\
  <div class="glass-card c-p-5">\
    <div class="c-flex-between c-mb-4">\
      <h4 class="c-fs-sm c-fw-semibold c-text-primary" style="margin:0">\u23f1\ufe0f Pomodoro Timer</h4>\
      <button class="btn btn-primary btn-sm" data-action="dashboard:openTimer">Open Timer</button>\
    </div>\
    <div class="c-fs-xs c-text-tertiary">Stay focused with timed study sessions</div>\
  </div>\
  <div class="glass-card c-p-5">\
    <div id="ef-daily-goals"></div>\
  </div>\
  <div class="glass-card c-p-5">\
    <div id="ef-quick-notes"></div>\
  </div>\
  <div class="glass-card c-p-5">\
    <div id="ef-motivational-quote"></div>\
  </div>\
</div>\
<div id="ef-pomodoro-modal" class="ef-modal-overlay c-fixed c-z-1000" style="display:none;inset:0;background:rgba(0,0,0,0.7);align-items:center;justify-content:center" data-action="dashboard:closeOverlay">\
  <div class="c-relative c-radius-xl c-scroll-y" style="background:var(--bg-secondary);padding:var(--space-6);max-width:500px;width:90%;max-height:90vh">\
    <button class="c-absolute c-pointer c-z-1" style="top:var(--space-3);right:var(--space-3);background:none;border:none;font-size:1.5rem;color:var(--text-tertiary)" data-action="dashboard:closePomodoro">&times;</button>\
    <div id="ef-pomodoro-timer"></div>\
  </div>\
</div>\
</div>';
  }

  function buildDashboardHTML() {
    var headerHtml = '\
<div class="page-container dashboard-page">\
  <div class="c-flex-between c-mb-6 c-flex-wrap" style="gap:var(--space-3)">\
    <div>\
      <div class="page-title" style="font-size:var(--text-2xl)">Dashboard</div>\
      <div class="page-subtitle c-fs-sm c-text-secondary">Welcome back, ' + U.sanitizeHTML(user.name) + '!</div>\
    </div>\
  </div>';

    var summaryHtml = renderSummaryStrip();

    var bodyHtml = '';

    for (var wi = 0; wi < defaultWidgets.length; wi++) {
      var w = defaultWidgets[wi];
      var id = w.id;
      var content = '';

      if (id === 'welcome') {
        content = renderWelcomeHeader();
      } else if (id === 'stats') {
        bodyHtml += renderDailyStatsBar();
        content = renderStatsGrid();
      } else if (id === 'missions') {
        content = renderDailyMissions();
      } else if (id === 'studyPlan') {
        content = '\
<div class="section-header widget-content c-mt-2" data-widget="studyPlan">\
  <div>\
    <div class="section-title">\ud83d\udcda Today\'s Study Plan</div>\
    <div class="section-subtitle">Your personalized learning schedule</div>\
  </div>\
  <span class="section-action c-pointer" data-action="dashboard:navigate:/ai-route">View Full Plan &rarr;</span>\
</div>' + renderStudyPlan();
      } else if (id === 'continueLearning') {
        content = '\
<div class="section-header widget-content c-mt-2" data-widget="continueLearning">\
  <div>\
    <div class="section-title">\ud83d\udcd6 Continue Learning</div>\
    <div class="section-subtitle">Pick up where you left off</div>\
  </div>\
  <span class="section-action c-pointer" data-action="dashboard:navigate:/subject/' + (userSubjectIds.length > 0 ? userSubjectIds[0] : '6') + '">View All &rarr;</span>\
</div>' + renderContinueLearning();
      } else if (id === 'recentlyViewed') {
        content = '\
<div class="section-header widget-content c-mt-2" data-widget="recentlyViewed">\
  <div>\
    <div class="section-title">\ud83d\udcd1 Recently Viewed</div>\
    <div class="section-subtitle">Your last visited pages</div>\
  </div>\
</div>' + renderRecentlyViewed();
      } else if (id === 'schedule') {
        bodyHtml += renderUpcomingSchedule();
        continue;
      } else if (id === 'activity') {
        bodyHtml += renderRecentActivity();
        continue;
      } else if (id === 'leaderboard') {
        content = '\
<div class="section-header widget-content c-mt-2" data-widget="leaderboard">\
  <div>\
    <div class="section-title">\ud83c\udfc6 Leaderboard</div>\
    <div class="section-subtitle">Top performers this week</div>\
  </div>\
  <span class="section-action c-pointer" data-action="dashboard:navigate:/profile">View Full Leaderboard &rarr;</span>\
</div>\
<div class="glass-card widget-content c-p-4" data-widget="leaderboard">' + renderLeaderboard() + '</div>';
      } else if (id === 'quickActions') {
        content = '\
<div class="section-header widget-content c-mt-2" data-widget="quickActions">\
  <div>\
    <div class="section-title">\u26a1 Quick Actions</div>\
    <div class="section-subtitle">Frequently used tools</div>\
  </div>\
</div>' + renderQuickActions();
      } else if (id === 'events') {
        content = '\
<div class="section-header widget-content c-mt-2" data-widget="events">\
  <div>\
    <div class="section-title">\ud83d\udcc5 Upcoming Events</div>\
    <div class="section-subtitle">Scheduled classes and assessments</div>\
  </div>\
  <span class="section-action c-pointer" data-action="dashboard:navigate:/schedule">View Schedule &rarr;</span>\
</div>' + renderUpcomingEvents();
      } else if (id === 'announcements') {
        content = '\
<div class="section-header widget-content c-mt-2" data-widget="announcements">\
  <div>\
    <div class="section-title">\ud83d\udce2 Announcements</div>\
    <div class="section-subtitle">Latest updates from EduMentee</div>\
  </div>\
  <span class="section-action c-pointer" data-action="dashboard:navigate:/notifications">View All &rarr;</span>\
</div>' + renderAnnouncements();
      } else if (id === 'recommendations') {
        content = '\
<div class="section-header widget-content c-mt-2" data-widget="recommendations">\
  <div>\
    <div class="section-title">\ud83c\udf81 Recommended For You</div>\
    <div class="section-subtitle">Handpicked resources for class ' + userClass + '</div>\
  </div>\
  <span class="section-action c-pointer" data-action="dashboard:navigate:/marketplace">Browse All &rarr;</span>\
</div>' + renderRecommendedForYou() + '\
<div class="section-header widget-content c-mt-2" data-widget="recommendations">\
  <div>\
    <div class="section-title">\ud83d\udecd\ufe0f Marketplace Recommendations</div>\
    <div class="section-subtitle">Products and courses for you</div>\
  </div>\
  <span class="section-action c-pointer" data-action="dashboard:navigate:/marketplace">Visit Marketplace &rarr;</span>\
</div>' + renderMarketplace();
      } else if (id === 'studyTools') {
        content = renderStudyTools();
      }

      if (content) {
        bodyHtml += content;
      }
    }

    var layoutClass = '';
    return headerHtml + summaryHtml + '<div class="dashboard-body' + layoutClass + '" id="dashboard-body">' + bodyHtml + '</div></div>';
  }

  function animateWidgets(container) {
    var widgets = container.querySelectorAll('.widget-content');
    for (var ai = 0; ai < widgets.length; ai++) {
      widgets[ai].style.animationDelay = (ai * 40) + 'ms'; /* dynamic, keep inline */
      widgets[ai].classList.add('animate-fadeInUp');
    }
  }

  function initCountUp(container) {
    var els = container.querySelectorAll('.count-up');
    for (var ci = 0; ci < els.length; ci++) {
      var el = els[ci];
      var target = parseInt(el.getAttribute('data-target'), 10);
      if (isNaN(target)) continue;
      var duration = 800;
      var startTime = null;
      function step(timestamp) {
        if (!startTime) startTime = timestamp;
        var progress = Math.min((timestamp - startTime) / duration, 1);
        var eased = 1 - Math.pow(1 - progress, 3);
        var current = Math.round(eased * target);
        el.textContent = current.toLocaleString();
        if (progress < 1) {
          requestAnimationFrame(step);
        } else {
          el.textContent = target.toLocaleString();
        }
      }
      requestAnimationFrame(step);
    }
  }

  function initParticles(container) {
    var particleContainer = container.querySelector('#welcome-particles');
    if (!particleContainer) return;
    var colors = ['#3b82f6', '#8b5cf6', '#06b6d4', '#10b981', '#f59e0b'];
    for (var pi = 0; pi < 12; pi++) {
      var dot = document.createElement('div');
      var size = Math.floor(Math.random() * 6) + 3;
      var x = Math.random() * 100;
      var y = Math.random() * 100;
      var dur = (Math.random() * 4 + 3) + 's';
      var delay = (Math.random() * 2) + 's';
      var color = colors[Math.floor(Math.random() * colors.length)];
      dot.style.cssText = 'position:absolute;width:' + size + 'px;height:' + size + 'px;border-radius:50%;background:' + color + ';left:' + x + '%;top:' + y + '%;opacity:0.3;animation:float ' + dur + ' ease-in-out infinite;animation-delay:' + delay + ';pointer-events:none';
      particleContainer.appendChild(dot);
    }
  }

};

window.renderPage.dashboardClass = function(params) {
  var mainContent = document.getElementById('main-content');
  if (!mainContent) return;
  var user = window.Store.get('user');
  if (!user) { window.Router.navigate('/login'); return; }
  var classId = params && params.classId ? params.classId : (user.class || 6);
  var isSelfLearner = classId === 'self-learner';
  var classNum = isSelfLearner ? 0 : parseInt(classId, 10);
  var md = window.mockData;
  var Utils = window.Utils;

  var className = isSelfLearner ? 'Self Learner' : 'Class ' + classNum;
  var classSubjects = [];
  var subjectNames = [];

  if (isSelfLearner) {
    var interests = ['Mathematics', 'Science', 'English', 'Programming', 'General Knowledge', 'Art & Craft'];
    subjectNames = interests;
    classSubjects = [];
  } else if (classNum >= 1 && classNum <= 12) {
    var allSubjects = md.subjects || [];
    classSubjects = allSubjects.filter(function(s) { return s.class == classNum; });
    if ((classNum == 11 || classNum == 12) && user.stream) {
      classSubjects = classSubjects.filter(function(s) { return !s.stream || s.stream === user.stream; });
    }
    if (classSubjects.length === 0 && Utils.classSubjects[classNum]) {
      subjectNames = Utils.classSubjects[classNum];
    }
  }

  if (classSubjects.length === 0 && subjectNames.length === 0) {
    if (classNum >= 1 && classNum <= 10 && Utils.classSubjects[classNum]) {
      subjectNames = Utils.classSubjects[classNum];
    } else if (classNum >= 11 && classNum <= 12 && user.stream && Utils.streamSubjects[user.stream] && Utils.streamSubjects[user.stream][classNum]) {
      subjectNames = Utils.streamSubjects[user.stream][classNum];
    } else {
      subjectNames = ['Mathematics', 'Science', 'English', 'Social Studies'];
    }
  }

  var classSubjectIds = classSubjects.map(function(s) { return s.id; });
  var classVideos = md.videos ? md.videos.filter(function(v) { return classSubjectIds.indexOf(v.subjectId) !== -1; }) : [];
  var classResources = md.resources ? md.resources.filter(function(r) { return classSubjectIds.indexOf(r.subjectId) !== -1; }) : [];
  var classQuizzes = md.quizzes ? md.quizzes.filter(function(q) { return classSubjectIds.indexOf(q.subjectId) !== -1; }) : [];
  var classCourses = md.courses ? md.courses.filter(function(c) { return c.class == classNum || !c.class; }) : [];
  var classMarketItems = md.marketplace ? md.marketplace.slice(0, 4) : [];
  var classAchievements = md.achievements ? md.achievements.slice(0, 6) : [];
  var planExists = window.Store.get('studyPlan') !== null;

  function renderSubjectsGrid() {
    var items = classSubjects.length > 0 ? classSubjects : subjectNames.map(function(name, idx) {
      return { id: 'sub_' + idx, name: name, icon: '\ud83d\udcda', color: ['#3b82f6','#8b5cf6','#06b6d4','#10b981','#f59e0b','#ec4899','#f97316'][idx % 7], chapters: 0 };
    });
    var html = '';
    for (var i = 0; i < items.length; i++) {
      var sub = items[i];
      var progress = Math.floor(Math.random() * 70) + 10;
      var fillClass = ['progress-fill-blue','progress-fill-purple','progress-fill-cyan','progress-fill-green'][i % 4];
      var chCount = sub.chapters || Math.floor(Math.random() * 15) + 5;
      var subIcon = sub.icon || '\ud83d\udcda';
      html += '\
<div class="content-card" data-action="dashboard:navigate:/subject/' + sub.id + '">\
  <div class="content-card-image" style="height:100px;background:linear-gradient(135deg,' + (sub.color || '#3b82f6') + '44,transparent);display:flex;align-items:center;justify-content:center;font-size:2rem">' + subIcon + '</div>\
  <div class="content-card-body">\
    <div class="content-card-title">' + Utils.sanitizeHTML(sub.name) + '</div>\
    <div class="content-card-text">' + chCount + ' chapters</div>\
  </div>\
  <div style="padding:0 var(--space-5) var(--space-4)">\
    <div class="flex items-center justify-between text-xs text-secondary c-mb-2">\
      <span>Progress</span>\
      <span>' + progress + '%</span>\
    </div>\
    <div class="progress-bar">\
      <div class="progress-bar-fill ' + fillClass + '" style="width:' + progress + '%"></div>\
    </div>\
  </div>\
  <div class="content-card-footer">\
    <span class="text-accent-blue text-sm font-semibold">View Chapters &rarr;</span>\
  </div>\
</div>';
    }
    return '\
<div class="stats-grid c-grid" style="grid-template-columns:repeat(auto-fill,minmax(220px,1fr))">' + html + '</div>';
  }

  function renderSection(title, subtitle, link, linkText, items, renderFn) {
    if (!items || items.length === 0) return '';
    var sectionHtml = '\
<div class="section-header c-mt-2">\
  <div>\
    <div class="section-title">' + title + '</div>\
    <div class="section-subtitle">' + subtitle + '</div>\
  </div>\
  <span class="section-action c-pointer" data-action="dashboard:navigate:' + link + '">' + linkText + ' &rarr;</span>\
</div>';
    sectionHtml += renderFn(items);
    return sectionHtml;
  }

  function renderVideoCards(items) {
    var html = '';
    var count = Math.min(items.length, 4);
    for (var i = 0; i < count; i++) {
      var v = items[i];
      html += '\
<div class="content-card c-pointer" data-action="dashboard:navigate:/videos" style="min-width:200px;flex-shrink:0">\
  <div class="content-card-image" style="height:110px;background:' + Utils.getGradient(i) + ';display:flex;align-items:center;justify-content:center;font-size:2rem">\ud83c\udfac</div>\
  <div class="content-card-body">\
    <div class="content-card-title c-fs-sm">' + Utils.sanitizeHTML(Utils.truncate(v.title, 50)) + '</div>\
    <div class="content-card-text text-xs">' + (v.duration || 0) + ' min &middot; ' + (v.level || 'beginner') + '</div>\
  </div>\
</div>';
    }
    return '\
<div class="flex c-scroll-y" style="gap:var(--space-4);padding-bottom:var(--space-2)">' + html + '</div>';
  }

  function renderResourceCards(items) {
    var html = '';
    var count = Math.min(items.length, 4);
    var typeIcons = { pdf: '\ud83d\udcc4', notes: '\ud83d\udcdd', worksheet: '\ud83d\udccb', reference: '\ud83d\udcd6', solution: '\u2705' };
    for (var i = 0; i < count; i++) {
      var r = items[i];
      var rIcon = typeIcons[r.type] || '\ud83d\udcc4';
      html += '\
<div class="glass-card c-p-4 c-mb-3 c-pointer" data-action="dashboard:navigate:/resources">\
  <div class="flex items-center gap-3">\
    <div style="font-size:1.5rem">' + rIcon + '</div>\
    <div class="flex-1" style="min-width:0">\
      <div class="text-sm font-semibold">' + Utils.sanitizeHTML(r.title) + '</div>\
      <div class="text-xs text-secondary">' + (r.type || 'pdf') + ' &middot; ' + (r.size || '0 MB') + ' &middot; ' + (r.downloads || 0) + ' downloads</div>\
    </div>\
    <div class="text-xs text-accent-blue font-semibold">' + (r.isFree ? 'Free' : Utils.formatCurrency(r.price || 0)) + '</div>\
  </div>\
</div>';
    }
    return html;
  }

  function renderQuizCards(items) {
    var html = '';
    var count = Math.min(items.length, 3);
    var diffColors = { easy: 'var(--accent-green)', medium: 'var(--accent-yellow)', hard: 'var(--accent-red)' };
    for (var i = 0; i < count; i++) {
      var q = items[i];
      html += '\
<div class="glass-card c-p-4 c-mb-3 c-pointer" data-action="dashboard:navigate:/quiz/' + q.id + '">\
  <div class="flex items-center gap-3">\
    <div class="c-radius-md" style="width:44px;height:44px;background:var(--gradient-secondary);display:flex;align-items:center;justify-content:center;font-size:1.25rem">\ud83d\udcdd</div>\
    <div class="flex-1">\
      <div class="text-sm font-semibold">' + Utils.sanitizeHTML(q.title) + '</div>\
      <div class="text-xs text-secondary">' + (q.questions ? q.questions.length : 0) + ' questions &middot; ' + (q.timeLimit || 0) + ' min</div>\
    </div>\
    <div style="color:' + (diffColors[q.difficulty] || 'var(--text-tertiary)') + '" class="text-xs font-semibold">' + (q.difficulty || 'medium').toUpperCase() + '</div>\
  </div>\
</div>';
    }
    return html;
  }

  function renderMarketCards(items) {
    var html = '';
    var count = Math.min(items.length, 4);
    for (var i = 0; i < count; i++) {
      var item = items[i];
      html += '\
<div class="product-card" data-action="dashboard:navigate:/marketplace/product/' + item.id + '">\
  <div class="product-image" style="height:120px;font-size:2rem;background:var(--gradient-card)">\ud83d\udecd\ufe0f</div>\
  <div class="product-body">\
    <div class="product-category">' + (item.category || 'General') + '</div>\
    <div class="product-title c-fs-sm">' + Utils.sanitizeHTML(Utils.truncate(item.title, 35)) + '</div>\
    <div class="product-footer">\
      <div class="text-base font-bold">' + Utils.formatCurrency(item.price) + '</div>\
    </div>\
  </div>\
</div>';
    }
    return '\
<div class="stats-grid c-grid" style="grid-template-columns:repeat(auto-fill,minmax(200px,1fr))">' + html + '</div>';
  }

  function renderAchievements(items) {
    var html = '';
    for (var i = 0; i < items.length; i++) {
      var a = items[i];
      html += '\
<div class="badge-card" data-action="dashboard:navigate:/profile">\
  <div style="font-size:1.5rem">' + (a.icon || '\ud83c\udfc6') + '</div>\
  <div class="text-xs text-secondary c-text-center">' + Utils.sanitizeHTML(a.name) + '</div>\
</div>';
    }
    return '\
<div class="flex flex-wrap gap-3 c-mt-2">' + html + '</div>';
  }

  function renderPlanner() {
    if (planExists) {
      return '\
<div class="glass-card c-p-5 c-text-center">\
  <div style="font-size:2rem;margin-bottom:var(--space-3)">\ud83d\udccb</div>\
  <div class="text-base font-semibold">Study Plan Active</div>\
  <div class="text-sm text-secondary c-mb-4">You have an active study plan. Stay on track!</div>\
  <button class="btn btn-primary btn-sm" data-action="dashboard:navigate:/ai-route">View Plan</button>\
</div>';
    }
    return '\
<div class="glass-card c-p-5 c-text-center">\
  <div style="font-size:2rem;margin-bottom:var(--space-3)">\ud83e\udd16</div>\
  <div class="text-base font-semibold">No Study Plan</div>\
  <div class="text-sm text-secondary c-mb-4">Create a personalized study plan with AI</div>\
  <button class="btn btn-primary btn-sm" data-action="dashboard:navigate:/ai-route">Generate Plan</button>\
</div>';
  }

  var html = '\
<div class="page-container dashboard-page">\
  <div class="dashboard-welcome">\
    <div class="welcome-title">\ud83d\udcda ' + Utils.sanitizeHTML(className) + ' Dashboard</div>\
    <div class="welcome-text">Explore subjects, resources, and track your progress for ' + (isSelfLearner ? 'your personalized learning path' : className) + '.</div>\
    <div class="flex gap-3 c-mt-2 c-flex-wrap">\
      <button class="btn btn-primary" data-action="dashboard:navigate:/videos">Start Learning</button>\
      <button class="btn btn-secondary" data-action="dashboard:navigate:/quizzes">Take a Quiz</button>\
      <button class="btn btn-secondary" data-action="dashboard:navigate:/resources">View Resources</button>\
    </div>\
  </div>';

  html += '\
  <div class="section-header c-mt-2">\
    <div>\
      <div class="section-title">\ud83d\udcd6 Subjects</div>\
      <div class="section-subtitle">' + (isSelfLearner ? 'Your interest areas' : (classNum >= 11 && classNum <= 12 && user.stream ? 'Stream: ' + user.stream.charAt(0).toUpperCase() + user.stream.slice(1) : 'Core curriculum')) + '</div>\
    </div>\
  </div>\
  ' + renderSubjectsGrid();

  if (classVideos.length > 0) {
    html += renderSection('\ud83c\udfac Videos', 'Video lessons for this class', '/videos', 'View All', classVideos, renderVideoCards);
  }

  if (classResources.length > 0) {
    html += renderSection('\ud83d\udcc4 Resources', 'Study materials and worksheets', '/resources', 'View All', classResources, renderResourceCards);
  }

  if (classQuizzes.length > 0) {
    html += renderSection('\ud83d\udcdd Quizzes', 'Test your knowledge', '/quizzes', 'View All', classQuizzes, renderQuizCards);
  }

  html += renderSection('\ud83d\udecd\ufe0f Marketplace', 'Products and courses for you', '/marketplace', 'Browse All', classMarketItems, renderMarketCards);

  html += '\
  <div class="section-header c-mt-2">\
    <div>\
      <div class="section-title">\ud83d\udccb Study Planner</div>\
      <div class="section-subtitle">Plan your study schedule</div>\
    </div>\
    <span class="section-action c-pointer" data-action="dashboard:navigate:/ai-route">AI Route &rarr;</span>\
  </div>\
  ' + renderPlanner();

  html += '\
  <div class="section-header c-mt-2">\
    <div>\
      <div class="section-title">\ud83c\udfc5 Achievements</div>\
      <div class="section-subtitle">Milestones and rewards</div>\
    </div>\
    <span class="section-action c-pointer" data-action="dashboard:navigate:/profile">View All &rarr;</span>\
  </div>\
  ' + renderAchievements(classAchievements) + '\
</div>';

  mainContent.innerHTML = html;
};
