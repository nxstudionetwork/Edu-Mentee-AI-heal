window.addEventListener('error', function(e) {
  console.error('[EduMentee Error]', e.error ? e.error.message : e.message);
});
window.addEventListener('unhandledrejection', function(e) {
  console.error('[EduMentee Unhandled]', e.reason);
});

window.App = (function() {
  var store = window.Store;
  var router = window.Router;
  var api = window.API;
  var utils = window.Utils;

  function getCurrentUser() {
    return store.get('user');
  }

  function isAuthenticated() {
    return store.get('isAuthenticated') === true;
  }

  function renderApp() {
    var appRoot = document.getElementById('app');
    if (!appRoot) return;
    if (!isAuthenticated()) {
      appRoot.innerHTML = renderLanding();
      return;
    }
    appRoot.innerHTML = renderAppShell();
    var mainContent = document.getElementById('main-content');
    if (mainContent) {
      router.onLoading(function(loading) {
        var mc = document.getElementById('main-content');
        if (mc && loading) showLoading(mc);
      });
      router.handleRoute();
    }
    initComponents();
  }

  function renderLanding() {
    return '\
<div class="landing-page">\
  <nav class="landing-nav">\
    <div class="flex items-center gap-3" data-action="navigate:/">\
      <div class="sidebar-logo">EM</div>\
      <div class="sidebar-brand"><span>Edu</span>Mentee</div>\
    </div>\
    <div class="landing-nav-links">\
      <a class="landing-nav-link landing-nav-anchor" data-action="landing-scroll:features">Features</a>\
      <a class="landing-nav-link landing-nav-anchor" data-action="landing-scroll:how-it-works">How it Works</a>\
      <a class="landing-nav-link landing-nav-anchor" data-action="landing-scroll:subjects">Subjects</a>\
      <a class="landing-nav-link landing-nav-anchor" data-action="landing-scroll:testimonials">Testimonials</a>\
      <a class="landing-nav-link" href="#/login">Login</a>\
      <a class="landing-nav-link btn btn-primary btn-sm" href="#/signup" style="padding:6px 16px;font-size:var(--text-sm)">Sign Up</a>\
    </div>\
  </nav>\
  <section class="landing-hero" id="home">\
    <div class="landing-hero-bg">\
      <div class="landing-hero-gradient landing-hero-gradient-1"></div>\
      <div class="landing-hero-gradient landing-hero-gradient-2"></div>\
    </div>\
    <div class="landing-hero-content" style="display:flex;flex-direction:column;align-items:center;text-align:center;justify-content:center;min-height:calc(100vh - 200px)">\
      <div class="landing-hero-badge">🌟 India\'s Premier Learning Platform</div>\
      <h1 class="landing-hero-title">Learn Anything,<br><span>Anytime, Anywhere</span></h1>\
      <p class="landing-hero-text">Personalized learning paths, interactive quizzes, live classes, and expert-curated content for Classes 1-12.</p>\
      <div class="landing-hero-actions">\
        <button class="btn btn-primary btn-lg" data-action="navigate:/signup">Get Started Free</button>\
        <button class="btn btn-secondary btn-lg" data-action="navigate:/login">Sign In</button>\
      </div>\
      <div class="landing-hero-stats">\
        <div class="landing-hero-stat"><div class="landing-hero-stat-value">50K+</div><div class="landing-hero-stat-label">Active Students</div></div>\
        <div class="landing-hero-stat"><div class="landing-hero-stat-value">10K+</div><div class="landing-hero-stat-label">Video Lessons</div></div>\
        <div class="landing-hero-stat"><div class="landing-hero-stat-value">5K+</div><div class="landing-hero-stat-label">Practice Tests</div></div>\
        <div class="landing-hero-stat"><div class="landing-hero-stat-value">95%</div><div class="landing-hero-stat-label">Success Rate</div></div>\
      </div>\
      <div class="landing-boards-strip" id="boards">\
        <span class="landing-boards-label">Trusted across boards</span>\
        <span class="landing-board-chip">CBSE</span>\
        <span class="landing-board-chip">ICSE</span>\
        <span class="landing-board-chip">State Boards</span>\
        <span class="landing-board-chip">IB</span>\
        <span class="landing-board-chip">IGCSE</span>\
      </div>\
    </div>\
  </section>\
  <section class="landing-section" id="features" style="padding:3rem 2rem">\
    <h2 class="landing-section-title">Everything You Need to Excel</h2>\
    <p class="landing-section-subtitle">Video lessons, quizzes, live classes, and productivity tools for academic success.</p>\
    <div class="landing-features-grid">\
      <div class="landing-feature-card"><div class="landing-feature-icon" style="background:rgba(59,130,246,0.15);color:#3b82f6">📚</div><h3 class="landing-feature-title">Expert Curriculum</h3><p class="landing-feature-text">Comprehensive material aligned with CBSE, ICSE, and state boards for Classes 1-12.</p></div>\
      <div class="landing-feature-card"><div class="landing-feature-icon" style="background:rgba(139,92,246,0.15);color:#8b5cf6">🎯</div><h3 class="landing-feature-title">Personalized Learning</h3><p class="landing-feature-text">AI-powered study plans adapt to your pace and focus on areas needing improvement.</p></div>\
      <div class="landing-feature-card"><div class="landing-feature-icon" style="background:rgba(6,182,212,0.15);color:#06b6d4">📊</div><h3 class="landing-feature-title">Track Progress</h3><p class="landing-feature-text">Detailed analytics, streaks, and performance reports to monitor your academic growth.</p></div>\
      <div class="landing-feature-card"><div class="landing-feature-icon" style="background:rgba(16,185,129,0.15);color:#10b981">🎮</div><h3 class="landing-feature-title">Gamified Learning</h3><p class="landing-feature-text">Earn XP, coins, and badges with daily missions, challenges, and a leaderboard.</p></div>\
      <div class="landing-feature-card"><div class="landing-feature-icon" style="background:rgba(245,158,11,0.15);color:#f59e0b">🤖</div><h3 class="landing-feature-title">AI Helper & Mentor</h3><p class="landing-feature-text">Get instant doubt-solving, study plans, and career guidance from your AI copilot.</p></div>\
      <div class="landing-feature-card"><div class="landing-feature-icon" style="background:rgba(236,72,153,0.15);color:#ec4899">🔬</div><h3 class="landing-feature-title">Virtual Labs & Tools</h3><p class="landing-feature-text">Hands-on virtual experiments, flashcards, study timers, and goal trackers.</p></div>\
    </div>\
  </section>\
  <section class="landing-section landing-section-alt" id="how-it-works" style="padding:3rem 2rem">\
    <h2 class="landing-section-title">How It Works</h2>\
    <p class="landing-section-subtitle">Start learning in three simple steps.</p>\
    <div class="landing-steps-grid">\
      <div class="landing-step-card"><div class="landing-step-num">1</div><div class="landing-step-icon">📝</div><h3 class="landing-feature-title">Create Your Account</h3><p class="landing-feature-text">Sign up with your name, class, board, and school in under a minute.</p></div>\
      <div class="landing-step-card"><div class="landing-step-num">2</div><div class="landing-step-icon">🗺️</div><h3 class="landing-feature-title">Get a Study Plan</h3><p class="landing-feature-text">Receive a personalized AI learning route built around your subjects and goals.</p></div>\
      <div class="landing-step-card"><div class="landing-step-num">3</div><div class="landing-step-icon">🚀</div><h3 class="landing-feature-title">Learn & Track Progress</h3><p class="landing-feature-text">Watch lessons, take quizzes, join live classes, and watch your scores grow.</p></div>\
    </div>\
  </section>\
  <section class="landing-section" id="subjects" style="padding:3rem 2rem">\
    <h2 class="landing-section-title">Subjects for Every Class</h2>\
    <p class="landing-section-subtitle">From Class 1 to Class 12, across all streams.</p>\
    <div class="landing-subjects-wrap">\
      <div class="landing-subject-group" data-action="navigate:/signup">\
        <div class="landing-subject-group-title">Classes 1-5</div>\
        <div class="landing-subject-chips">\
          <span class="landing-subject-chip">Mathematics</span><span class="landing-subject-chip">Science</span><span class="landing-subject-chip">English</span><span class="landing-subject-chip">EVS</span>\
        </div>\
      </div>\
      <div class="landing-subject-group" data-action="navigate:/signup">\
        <div class="landing-subject-group-title">Classes 6-8</div>\
        <div class="landing-subject-chips">\
          <span class="landing-subject-chip">Maths</span><span class="landing-subject-chip">Physics</span><span class="landing-subject-chip">Chemistry</span><span class="landing-subject-chip">Biology</span><span class="landing-subject-chip">Social Science</span>\
        </div>\
      </div>\
      <div class="landing-subject-group" data-action="navigate:/signup">\
        <div class="landing-subject-group-title">Classes 9-10</div>\
        <div class="landing-subject-chips">\
          <span class="landing-subject-chip">Maths</span><span class="landing-subject-chip">Science</span><span class="landing-subject-chip">English</span><span class="landing-subject-chip">Social Science</span><span class="landing-subject-chip">Computer Science</span>\
        </div>\
      </div>\
      <div class="landing-subject-group" data-action="navigate:/signup">\
        <div class="landing-subject-group-title">Classes 11-12</div>\
        <div class="landing-subject-chips">\
          <span class="landing-subject-chip">PCM</span><span class="landing-subject-chip">PCB</span><span class="landing-subject-chip">Commerce</span><span class="landing-subject-chip">Humanities</span>\
        </div>\
      </div>\
    </div>\
  </section>\
  <section class="landing-section landing-section-alt" id="testimonials" style="padding:3rem 2rem">\
    <h2 class="landing-section-title">Loved by Students & Parents</h2>\
    <p class="landing-section-subtitle">Join thousands of happy learners across India.</p>\
    <div class="landing-testimonials-grid">\
      <div class="landing-testimonial-card"><div class="landing-testimonial-stars">⭐⭐⭐⭐⭐</div><p class="landing-feature-text">"The AI study plan completely changed how I prepare. My maths score jumped from 68% to 92% in one term!"</p><div class="landing-testimonial-author"><div class="landing-testimonial-avatar">AS</div><div><div class="c-fs-sm c-fw-semibold">Ananya Singh</div><div class="c-fs-xs c-text-tertiary">Class 10, CBSE</div></div></div></div>\
      <div class="landing-testimonial-card"><div class="landing-testimonial-stars">⭐⭐⭐⭐⭐</div><p class="landing-feature-text">"My daughter loves the daily missions and streaks. Learning has finally become a habit for her."</p><div class="landing-testimonial-author"><div class="landing-testimonial-avatar">PM</div><div><div class="c-fs-sm c-fw-semibold">Priya Mehta</div><div class="c-fs-xs c-text-tertiary">Parent, Class 7</div></div></div></div>\
      <div class="landing-testimonial-card"><div class="landing-testimonial-stars">⭐⭐⭐⭐⭐</div><p class="landing-feature-text">"The virtual labs and flashcards are amazing. I finally understand physics instead of just memorizing formulas."</p><div class="landing-testimonial-author"><div class="landing-testimonial-avatar">RK</div><div><div class="c-fs-sm c-fw-semibold">Rohan Kumar</div><div class="c-fs-xs c-text-tertiary">Class 12, IGCSE</div></div></div></div>\
    </div>\
  </section>\
  <section class="landing-cta">\
    <div class="landing-cta-inner">\
      <h2 class="landing-cta-title">Ready to Start Learning?</h2>\
      <p class="landing-cta-text">Create your free account today and unlock your full potential.</p>\
      <div class="landing-cta-actions">\
        <button class="btn btn-primary btn-lg" data-action="navigate:/signup">Get Started Free</button>\
        <button class="btn btn-secondary btn-lg" data-action="navigate:/login">Sign In</button>\
      </div>\
    </div>\
  </section>\
  <footer class="landing-footer">\
    <div class="landing-footer-grid">\
      <div>\
        <div class="landing-footer-brand"><span>Edu</span>Mentee</div>\
        <p class="landing-footer-text">India\'s premier personalized learning platform for Classes 1-12. Learn anything, anytime, anywhere.</p>\
      </div>\
      <div>\
        <div class="landing-footer-title">Platform</div>\
        <div class="landing-footer-links">\
          <span class="landing-footer-link" data-action="navigate:/login">Login</span>\
          <span class="landing-footer-link" data-action="navigate:/signup">Sign Up</span>\
          <span class="landing-footer-link landing-nav-anchor" data-action="landing-scroll:features">Features</span>\
          <span class="landing-footer-link landing-nav-anchor" data-action="landing-scroll:how-it-works">How it Works</span>\
        </div>\
      </div>\
      <div>\
        <div class="landing-footer-title">Explore</div>\
        <div class="landing-footer-links">\
          <span class="landing-footer-link" data-action="navigate:/signup">Subjects</span>\
          <span class="landing-footer-link" data-action="navigate:/signup">Quizzes</span>\
          <span class="landing-footer-link" data-action="navigate:/signup">Live Classes</span>\
          <span class="landing-footer-link" data-action="navigate:/signup">Scholarships</span>\
        </div>\
      </div>\
      <div>\
        <div class="landing-footer-title">Resources</div>\
        <div class="landing-footer-links">\
          <span class="landing-footer-link" data-action="navigate:/signup">Video Lessons</span>\
          <span class="landing-footer-link" data-action="navigate:/signup">Practice Tests</span>\
          <span class="landing-footer-link" data-action="navigate:/signup">Study Materials</span>\
          <span class="landing-footer-link" data-action="navigate:/signup">Career Guidance</span>\
        </div>\
      </div>\
      <div>\
        <div class="landing-footer-title">Contact</div>\
        <div class="landing-footer-links">\
          <span class="landing-footer-link">support@edumentee.com</span>\
          <span class="landing-footer-link">+91 90000 00000</span>\
          <span class="landing-footer-link">New Delhi, India</span>\
        </div>\
      </div>\
    </div>\
    <div class="landing-footer-bottom">\
      <span>&copy; 2026 EduMentee. All rights reserved. | IFX Group</span>\
    </div>\
  </footer>\
</div>';
  }

  function renderAppShell() {
    var user = getCurrentUser();
    var collapsed = store.get('sidebarCollapsed') ? ' collapsed' : '';
    var notifs = store.get('notifications') || [];
    var notifCount = 0;
    for (var ni = 0; ni < notifs.length; ni++) {
      if (!notifs[ni].read) notifCount++;
    }
    return '\
<div class="flex min-h-screen">\
  <aside class="app-sidebar' + collapsed + '" id="app-sidebar">\
    <div class="sidebar-header">\
      <div class="sidebar-logo" data-action="navigate:/dashboard">EM</div>\
      <div class="sidebar-brand" data-action="navigate:/dashboard"><span>Edu</span>Mentee</div>\
      <button class="sidebar-collapse-btn" data-action="toggle-sidebar" title="Toggle sidebar">\xAB</button>\
    </div>\
    <nav class="sidebar-nav" id="sidebar-nav">' + renderSidebarNav() + '</nav>\
    <div class="sidebar-footer">\
      <div class="sidebar-footer-sep"></div>\
      <div class="sidebar-footer-brand">IFX Group</div>\
    </div>\
  </aside>\
  <div class="sidebar-overlay" id="sidebar-overlay" data-action="toggle-mobile-sidebar"></div>\
  <div class="flex flex-col flex-1">\
    <header class="app-header' + (collapsed ? ' sidebar-collapsed' : '') + '" id="app-header">\
      <div class="header-left">\
        <div class="mobile-menu-btn" data-action="toggle-mobile-sidebar">\u2630</div>\
        <span class="header-breadcrumb" id="header-breadcrumb">Dashboard</span>\
      </div>\
      <div class="header-center">\
        <div class="header-search">\
          <svg class="search-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>\
          <input type="text" class="input-field" placeholder="Search courses, subjects..." onfocus="App.openSearch()" readonly>\
        </div>\
      </div>\
      <div class="header-right">\
        <div class="header-dropdown" id="notif-dropdown-container">\
          <button class="header-btn" data-action="toggle-notifications" title="Notifications">\uD83D\uDD14' + (notifCount > 0 ? '<span class="notif-badge">' + notifCount + '</span>' : '') + '</button>\
          <div class="header-dropdown-menu" id="notif-dropdown" style="display:none;right:0">\
            <div class="header-dropdown-header">\
              <span style="font-weight:600;font-size:var(--text-sm)">Notifications</span>\
              <button class="btn btn-ghost btn-xs" data-action="navigate:/notifications">View All</button>\
            </div>\
            <div id="notif-dropdown-list" style="max-height:320px;overflow-y:auto"></div>\
          </div>\
        </div>\
        <button class="header-btn" data-action="navigate:/settings" title="Settings">\u2699\uFE0F</button>\
        <div class="header-dropdown" id="profile-dropdown-container">\
          <button class="header-btn header-avatar-btn" data-action="toggle-profile-dropdown" title="Profile">\
            <div class="avatar avatar-sm">' + (user && user.name ? utils.getInitials(user.name) : '?') + '</div>\
          </button>\
          <div class="header-dropdown-menu" id="profile-dropdown" style="display:none;right:0">\
            <div class="header-dropdown-header">\
              <div class="dd-name" style="font-weight:600;font-size:var(--text-sm)">' + (user && user.name ? utils.sanitizeHTML(user.name) : 'Student') + '</div>\
              <div class="dd-email" style="font-size:var(--text-xs);color:var(--text-tertiary)">' + (user ? utils.sanitizeHTML(user.email || '') : 'student@email.com') + '</div>\
              <div class="dd-class" style="font-size:var(--text-xs);color:var(--text-tertiary)">' + (user ? 'Class ' + (user.class || 'N/A') : 'Not enrolled') + '</div>\
            </div>\
            <div class="header-dropdown-item" data-action="navigate:/profile">\uD83D\uDC64 My Profile</div>\
            <div class="header-dropdown-item" data-action="navigate:/settings">\u2699\uFE0F Settings</div>\
            <div class="header-dropdown-item" data-action="navigate:/ai-helper">\uD83E\uDD16 AI Helper</div>\
            <div class="header-dropdown-divider"></div>\
            <div class="header-dropdown-item" data-action="logout" style="color:var(--accent-red)">\uD83D\uDEAA Sign Out</div>\
            <div class="header-dropdown-divider"></div>\
            <div class="header-dropdown-footer">IFX Group</div>\
          </div>\
        </div>\
      </div>\
    </header>\
    <main class="app-main' + (collapsed ? ' sidebar-collapsed' : '') + '" id="app-main">\
      <div class="page-container" id="main-content">' + renderLoading() + '</div>\
    </main>\
  </div>\
</div>\
<div class="bottom-nav" id="bottom-nav">\
  <div class="bottom-nav-item" data-action="navigate:/dashboard" id="bn-home"><span class="bottom-nav-icon">\uD83C\uDFE0</span><span class="bottom-nav-label">Home</span></div>\
  <div class="bottom-nav-item" data-action="navigate:/resources" id="bn-resources"><span class="bottom-nav-icon">\uD83D\uDCC4</span><span class="bottom-nav-label">Resources</span></div>\
  <div class="bottom-nav-item" data-action="navigate:/marketplace" id="bn-marketplace"><span class="bottom-nav-icon">\uD83D\uDECD\uFE0F</span><span class="bottom-nav-label">Shop</span></div>\
  <div class="bottom-nav-item" data-action="navigate:/community" id="bn-community"><span class="bottom-nav-icon">\uD83D\uDCAC</span><span class="bottom-nav-label">Community</span></div>\
  <div class="bottom-nav-item" data-action="navigate:/profile" id="bn-profile"><span class="bottom-nav-icon">\uD83D\uDC64</span><span class="bottom-nav-label">Profile</span></div>\
</div>\
<div class="shortcut-hint" id="shortcut-hint">\
  <div style="font-weight:600;font-size:var(--text-sm);margin-bottom:var(--space-3)">\u2328 Keyboard Shortcuts</div>\
  <div class="shortcut-row"><span>Search</span><span><span class="shortcut-key">Ctrl</span> + <span class="shortcut-key">K</span></span></div>\
  <div class="shortcut-row"><span>Dashboard</span><span><span class="shortcut-key">Ctrl</span> + <span class="shortcut-key">D</span></span></div>\
  <div class="shortcut-row"><span>Messages</span><span><span class="shortcut-key">Ctrl</span> + <span class="shortcut-key">M</span></span></div>\
  <div class="shortcut-row"><span>Shortcut Help</span><span><span class="shortcut-key">?</span></span></div>\
  <div style="margin-top:var(--space-2);padding-top:var(--space-2);border-top:1px solid var(--border-color);font-size:var(--text-xs);color:var(--text-tertiary)">Press <span class="shortcut-key">Esc</span> to close</div>\
</div>';
  }

  function renderSidebarNav() {
    var userForSidebar = store.get('user');
    var userClassForSidebar = userForSidebar ? userForSidebar.class : null;
    var showCareer = userClassForSidebar == '10' || userClassForSidebar == '12' || !userForSidebar;
    var sections = [
      { title: 'Main', items: [
        { label: 'Dashboard', icon: '\uD83D\uDCCA', path: '/dashboard' },
        { label: 'Subjects', icon: '\uD83D\uDCDA', path: '/dashboard/' + (getCurrentUser() ? getCurrentUser().class || 6 : 6) },
        { label: 'Videos', icon: '\uD83C\uDFAC', path: '/videos' },
        { label: 'Resources', icon: '\uD83D\uDCC4', path: '/resources' }
      ]},
      { title: 'Learning', items: [
        { label: 'Quizzes', icon: '\uD83D\uDCDD', path: '/quizzes' },
        { label: 'Exams', icon: '\uD83D\uDCCB', path: '/exams' },
        { label: 'Calendar', icon: '\uD83D\uDCC5', path: '/calendar' },
        { label: 'Downloads', icon: '\u2B07\uFE0F', path: '/downloads' },
        { label: 'Virtual Labs', icon: '\uD83D\uDD2C', path: '/virtual-labs' },
        { label: 'AI Helper', icon: '\uD83E\uDD16', path: '/ai-helper' },
        { label: 'Ask Teacher', icon: '\uD83D\uDC68\u200D\uD83C\uDFEB', path: '/ask-teacher' },
        { label: 'Analytics', icon: '\uD83D\uDCC8', path: '/analytics' },
        { label: 'Gamification', icon: '\uD83C\uDFC6', path: '/gamification' },
        { label: 'Flashcards', icon: '\uD83D\uDCDA', path: '/flashcards' },
        { label: 'Learning Route', icon: '\uD83D\uDDFA\uFE0F', path: '/learning-route' },
        { label: 'Study Timer', icon: '\u23F1\uFE0F', path: '/study-timer' },
        { label: 'Goals', icon: '\uD83C\uDFAF', path: '/goals' },
        { label: 'Challenges', icon: '\uD83C\uDFC5', path: '/challenges' }
      ]},
      { title: 'Explore', items: [
        { label: 'Marketplace', icon: '\uD83D\uDECD\uFE0F', path: '/marketplace' },
        { label: 'Scholarships', icon: '\uD83C\uDF93', path: '/scholarship' },
        { label: 'Career Guidance', icon: '\uD83C\uDFAF', path: '/career' },
        { label: 'Live Classes & Meet', icon: '\uD83D\uDCFA', path: '/live-classes' }
      ]},
      { title: 'Community', items: [
        { label: 'Social Feed', icon: '\uD83D\uDCF1', path: '/feed' },
        { label: 'Community', icon: '\uD83D\uDCAC', path: '/community' },
        { label: 'Messages', icon: '\u2709\uFE0F', path: '/messages' },
        { label: 'Inbox', icon: '\uD83D\uDCE8', path: '/inbox' }
      ]},
      { title: 'Productivity', items: [
        { label: 'Notebook', icon: '\uD83D\uDCDD', path: '/notebook' },
        { label: 'Sticky Notes', icon: '\uD83D\uDCCC', path: '/sticky-notes' },
        { label: 'Reminders', icon: '\u23F0', path: '/reminders' }
      ]},
      { title: '', items: [
        { label: 'Settings', icon: '\u2699\uFE0F', path: '/settings' },
        { label: 'Logout', icon: '\uD83D\uDEAA', path: '', action: 'logout' }
      ]}
    ];
    var html = '';
    for (var s = 0; s < sections.length; s++) {
      html += '<div class="sidebar-section">';
      html += '<div class="sidebar-section-title">' + sections[s].title + '</div>';
      for (var i = 0; i < sections[s].items.length; i++) {
        var item = sections[s].items[i];
        if (item.label === 'Career Guidance' && !showCareer) continue;
        if (item.action === 'logout') {
          html += '<a class="nav-item" href="#" data-action="logout"><span class="nav-icon">' + item.icon + '</span><span class="nav-label">' + item.label + '</span></a>';
        } else {
          html += '<a class="nav-item" href="#' + item.path + '"><span class="nav-icon">' + item.icon + '</span><span class="nav-label">' + item.label + '</span></a>';
        }
      }
      html += '</div>';
    }
    return html;
  }

  function renderLoading() {
    return '\
<div class="flex flex-col items-center justify-center" style="padding:4rem">\
  <div class="animate-spin" style="width:40px;height:40px;border:3px solid var(--border-color);border-top-color:var(--accent-blue);border-radius:50%;margin-bottom:1rem"></div>\
  <div class="text-sm text-secondary">Loading...</div>\
</div>';
  }

  function showLoading(mc) {
    if (!mc) return;
    var pc = mc.querySelector('.page-container');
    if (pc) {
      pc.innerHTML = '\
<div class="flex flex-col items-center justify-center" style="padding:4rem">\
  <div class="animate-spin" style="width:40px;height:40px;border:3px solid var(--border-color);border-top-color:var(--accent-blue);border-radius:50%;margin-bottom:1rem"></div>\
  <div class="text-sm text-secondary">Loading...</div>\
</div>';
    } else {
      mc.innerHTML = renderLoading();
    }
  }

  /* ============================================================
     GAMIFICATION SYSTEM
     ============================================================ */

  function getDailyMissions() {
    var today = new Date().toDateString();
    var stored = store.get('dailyMissions');
    if (stored && stored.date === today) return stored.missions;
    var missions = [
      { id: 'dm1', title: 'Watch a Video', desc: 'Watch any educational video', icon: '\uD83C\uDFAC', xp: 50, coins: 10, progress: 0, target: 1, type: 'video' },
      { id: 'dm2', title: 'Take a Quiz', desc: 'Complete any quiz', icon: '\uD83D\uDCDD', xp: 100, coins: 20, progress: 0, target: 1, type: 'quiz' },
      { id: 'dm3', title: 'Study 30 Minutes', desc: 'Spend 30 minutes learning', icon: '\u23F1\uFE0F', xp: 75, coins: 15, progress: 0, target: 30, type: 'study' },
      { id: 'dm4', title: 'Download a Resource', desc: 'Download any resource', icon: '\u2B07\uFE0F', xp: 30, coins: 5, progress: 0, target: 1, type: 'download' },
      { id: 'dm5', title: 'Community Post', desc: 'Like or comment on a post', icon: '\uD83D\uDCAC', xp: 25, coins: 5, progress: 0, target: 1, type: 'community' }
    ];
    store.set('dailyMissions', { date: today, missions: missions });
    return missions;
  }

  function updateMissionProgress(type, amount) {
    var stored = store.get('dailyMissions');
    if (!stored) { getDailyMissions(); stored = store.get('dailyMissions'); }
    if (!stored || stored.date !== new Date().toDateString()) { getDailyMissions(); stored = store.get('dailyMissions'); }
    var missions = stored.missions;
    var changed = false;
    for (var i = 0; i < missions.length; i++) {
      if (missions[i].type === type) {
        missions[i].progress = Math.min(missions[i].target, missions[i].progress + (amount || 1));
        if (missions[i].progress >= missions[i].target && !missions[i]._completed) {
          missions[i]._completed = true;
          awardXP(missions[i].xp);
          awardCoins(missions[i].coins);
          addNotification({ message: 'Mission complete: ' + missions[i].title + '! Earned ' + missions[i].xp + ' XP', type: 'success' });
          changed = true;
        }
      }
    }
    if (changed) store.set('dailyMissions', { date: stored.date, missions: missions });
    return missions;
  }

  function awardXP(amount) {
    var user = store.get('user');
    if (!user) return;
    user.xp = (user.xp || 0) + amount;
    user.level = utils.calculateLevel(user.xp);
    store.set('user', user);
    checkAchievements(user);
    trackDailyEarned('xp', amount);
    return user.xp;
  }

  function awardCoins(amount) {
    var user = store.get('user');
    if (!user) return;
    user.coins = (user.coins || 0) + amount;
    store.set('user', user);
    trackDailyEarned('coins', amount);
    return user.coins;
  }

  function getDailyStats() {
    var today = new Date().toDateString();
    var key = 'dailyStats_' + today;
    var stats = store.get(key) || { xp: 0, coins: 0 };
    return stats;
  }

  function trackDailyEarned(type, amount) {
    var today = new Date().toDateString();
    var key = 'dailyStats_' + today;
    var stats = store.get(key) || { xp: 0, coins: 0 };
    stats[type] = (stats[type] || 0) + amount;
    store.set(key, stats);
  }

  function checkAchievements(user) {
    var achievements = store.get('achievements') || [];
    var changed = false;
    var newUnlocks = [];
    var allAchievements = window.mockData.achievements || [];
    for (var i = 0; i < allAchievements.length; i++) {
      var a = allAchievements[i];
      var already = false;
      for (var j = 0; j < achievements.length; j++) {
        if (achievements[j].id === a.id) { already = true; break; }
      }
      if (already) continue;
      var unlock = false;
      if (a.id === 'a1' && user.xp >= 50) unlock = true;
      if (a.id === 'a2' && user.xp >= 500) unlock = true;
      if (a.id === 'a3' && (user.quizScore || 0) >= 100) unlock = true;
      if (a.id === 'a4' && (store.get('streak') || 0) >= 7) unlock = true;
      if (a.id === 'a5' && (user.resourcesDownloaded || 0) >= 10) unlock = true;
      if (a.id === 'a7' && user.level >= 5) unlock = true;
      if (a.id === 'a8' && user.level >= 10) unlock = true;
      if (a.id === 'a10' && user.xp >= 1000) unlock = true;
      if (unlock) {
        achievements.push({ id: a.id, name: a.name, unlockedAt: new Date().toISOString() });
        newUnlocks.push(a);
        changed = true;
        awardXP(a.xp || 0);
        addNotification({ message: '\uD83C\uDFC6 Achievement Unlocked: ' + a.name + '!', type: 'achievement' });
      }
    }
    if (changed) store.set('achievements', achievements);
    return newUnlocks;
  }

  function addNotification(data) {
    var notifs = store.get('notifications') || [];
    notifs.unshift({
      id: 'n_' + Date.now(),
      message: data.message || '',
      type: data.type || 'info',
      read: false,
      createdAt: new Date().toISOString()
    });
    if (notifs.length > 100) notifs = notifs.slice(0, 100);
    store.set('notifications', notifs);
    var dot = document.getElementById('notif-dot');
    if (dot) dot.style.display = 'block';
    var badge = document.querySelector('.notif-badge');
    if (!badge) {
      badge = document.createElement('span');
      badge.className = 'notif-badge';
      var btn = document.querySelector('.header-btn[title="Notifications"]');
      if (btn) btn.appendChild(badge);
    }
    if (badge) badge.textContent = notifs.filter(function(n) { return !n.read; }).length;
  }

  /* ============================================================
     DAILY GOALS
     ============================================================ */

  function getDailyGoals() {
    var today = new Date().toDateString();
    var stored = store.get('dailyGoals');
    if (stored && stored.date === today) return stored.goals;
    var goals = [
      { id: 'dg1', title: 'Complete 1 Lesson', icon: '\uD83D\uDCDA', progress: 0, target: 1, type: 'lesson' },
      { id: 'dg2', title: 'Watch 1 Video', icon: '\uD83C\uDFAC', progress: 0, target: 1, type: 'video' },
      { id: 'dg3', title: 'Score 80% on a Quiz', icon: '\uD83D\uDCDD', progress: 0, target: 1, type: 'quiz' },
      { id: 'dg4', title: 'Study 30 Minutes', icon: '\u23F1\uFE0F', progress: 0, target: 30, type: 'study' }
    ];
    store.set('dailyGoals', { date: today, goals: goals });
    return goals;
  }

  function updateGoalProgress(type, amount) {
    var stored = store.get('dailyGoals');
    if (!stored || stored.date !== new Date().toDateString()) { getDailyGoals(); stored = store.get('dailyGoals'); }
    if (!stored) return;
    var goals = stored.goals;
    for (var i = 0; i < goals.length; i++) {
      if (goals[i].type === type) {
        goals[i].progress = Math.min(goals[i].target, goals[i].progress + (amount || 1));
      }
    }
    store.set('dailyGoals', { date: stored.date, goals: goals });
    return goals;
  }

  function _showDailyGoals() {
    var goals = getDailyGoals();
    var allDone = true;
    var html = '<div class="glass-card p-5 mb-4"><div class="c-flex-between c-mb-3"><h3 class="c-fw-semibold c-fs-sm">&#127919; Daily Goals</h3></div>';
    for (var i = 0; i < goals.length; i++) {
      var g = goals[i];
      var pct = Math.round((g.progress / g.target) * 100);
      if (g.progress < g.target) allDone = false;
      html += '<div class="c-flex-center c-flex-gap-3 c-py-2"><div class="c-fs-sm" style="width:24px;text-align:center">' + (g.progress >= g.target ? '&#9989;' : g.icon) + '</div><div style="flex:1"><div class="c-flex-between c-mb-1"><span class="c-fs-xs c-fw-medium">' + g.title + '</span><span class="c-fs-xs c-text-tertiary">' + Math.min(g.progress, g.target) + '/' + g.target + '</span></div><div class="progress-bar"><div class="progress-bar-fill" style="width:' + Math.min(pct, 100) + '%;background:' + (g.progress >= g.target ? 'var(--accent-green)' : 'var(--accent-blue)') + '"></div></div></div></div>';
    }
    html += '<div class="c-mt-3 c-pt-2 c-border-top c-text-center">';
    if (allDone) { html += '<span class="c-fs-xs c-fw-medium" style="color:var(--accent-green)">&#127881; All daily goals complete! Great job!</span>'; }
    else { html += '<span class="c-fs-xs c-text-tertiary">Keep going! Complete your daily goals to earn bonus XP.</span>'; }
    html += '</div></div>';
    return html;
  }

  /* ============================================================
     END DAILY GOALS
     ============================================================ */

  function highlightActiveNav() {
    var hash = window.location.hash;
    var navItems = document.querySelectorAll('.nav-item, .desktop-nav-item');
    for (var i = 0; i < navItems.length; i++) {
      navItems[i].classList.remove('active');
    }
    for (var i = 0; i < navItems.length; i++) {
      if (navItems[i].getAttribute('href') === hash) {
        navItems[i].classList.add('active');
      }
    }
  }

  function renderNotFound() {
    return '\
<div class="flex flex-col items-center justify-center empty-state">\
  <div class="empty-state-icon">\uD83D\uDD0D</div>\
  <h2 class="empty-state-title">Page Not Found</h2>\
  <p class="empty-state-text">The page you\'re looking for doesn\'t exist or has been moved.</p>\
  <button class="btn btn-primary" data-action="navigate:/dashboard">Go to Dashboard</button>\
</div>';
  }

  function initComponents() {
    var sidebar = document.getElementById('app-sidebar');
    var main = document.getElementById('app-main');
    var header = document.getElementById('app-header');
    if (sidebar && store.get('sidebarCollapsed')) {
      sidebar.classList.add('collapsed');
      if (main) main.classList.add('sidebar-collapsed');
      if (header) header.classList.add('sidebar-collapsed');
    }
    highlightActiveNav();
  }

  function ensureShell() {
    var mainContent = document.getElementById('main-content');
    if (!mainContent && isAuthenticated()) {
      var appRoot = document.getElementById('app');
      if (appRoot) {
        appRoot.innerHTML = renderAppShell();
        mainContent = document.getElementById('main-content');
        initComponents();
        router.onLoading(function(loading) {
          var mc = document.getElementById('main-content');
          if (mc && loading) showLoading(mc);
        });
      }
    }
    return mainContent;
  }

  function getBreadcrumbForPage(name) {
    var map = {
      dashboard: [{ label: 'Home', path: '/dashboard' }, { label: 'Dashboard' }],
      videos: [{ label: 'Home', path: '/dashboard' }, { label: 'Videos' }],
      resources: [{ label: 'Home', path: '/dashboard' }, { label: 'Resources' }],
      marketplace: [{ label: 'Home', path: '/dashboard' }, { label: 'Marketplace' }],
      quizzes: [{ label: 'Home', path: '/dashboard' }, { label: 'Quizzes' }],
      exams: [{ label: 'Home', path: '/dashboard' }, { label: 'Exams' }],
      community: [{ label: 'Home', path: '/dashboard' }, { label: 'Community' }],
      feed: [{ label: 'Home', path: '/dashboard' }, { label: 'Social Feed' }],
      profile: [{ label: 'Home', path: '/dashboard' }, { label: 'Profile' }],
      rank: [{ label: 'Home', path: '/dashboard' }, { label: 'Profile', path: '/profile' }, { label: 'Rank & Leaderboard' }],
      settings: [{ label: 'Home', path: '/dashboard' }, { label: 'Settings' }],
      notifications: [{ label: 'Home', path: '/dashboard' }, { label: 'Notifications' }],
      aiMentor: [{ label: 'Home', path: '/dashboard' }, { label: 'AI Mentor' }],
      aiHelper: [{ label: 'Home', path: '/dashboard' }, { label: 'AI Helper' }],
      analytics: [{ label: 'Home', path: '/dashboard' }, { label: 'Analytics' }],
      career: [{ label: 'Home', path: '/dashboard' }, { label: 'Career Guidance' }],
      aiRoute: [{ label: 'Home', path: '/dashboard' }, { label: 'AI Study Planner' }],
      scholarship: [{ label: 'Home', path: '/dashboard' }, { label: 'Scholarships' }],
      meet: [{ label: 'Home', path: '/dashboard' }, { label: 'Meet' }],
      liveClasses: [{ label: 'Home', path: '/dashboard' }, { label: 'Live Classes & Meet' }],
      downloads: [{ label: 'Home', path: '/dashboard' }, { label: 'Downloads' }],
      search: [{ label: 'Home', path: '/dashboard' }, { label: 'Search' }],
      schedule: [{ label: 'Home', path: '/dashboard' }, { label: 'Schedule' }],
      askTeacher: [{ label: 'Home', path: '/dashboard' }, { label: 'Ask Teacher' }],
      calendar: [{ label: 'Home', path: '/dashboard' }, { label: 'Calendar' }],
      messages: [{ label: 'Home', path: '/dashboard' }, { label: 'Messages' }],
      learningRoute: [{ label: 'Home', path: '/dashboard' }, { label: 'Learning Route' }],
      learningRouteSubject: [{ label: 'Home', path: '/dashboard' }, { label: 'Learning Route' }],
      learningRoutePaths: [{ label: 'Home', path: '/dashboard' }, { label: 'Learning Route' }],
      inbox: [{ label: 'Home', path: '/dashboard' }, { label: 'Inbox' }],
      flashcards: [{ label: 'Home', path: '/dashboard' }, { label: 'Flashcards' }],
      studyTimer: [{ label: 'Home', path: '/dashboard' }, { label: 'Study Timer' }],
      stickyNotes: [{ label: 'Home', path: '/dashboard' }, { label: 'Sticky Notes' }],
      goalTracker: [{ label: 'Home', path: '/dashboard' }, { label: 'Goal Tracker' }],
      challenges: [{ label: 'Home', path: '/dashboard' }, { label: 'Challenges' }],
      notebook: [{ label: 'Home', path: '/dashboard' }, { label: 'Notebook' }],
      reminders: [{ label: 'Home', path: '/dashboard' }, { label: 'Reminders' }],
      cart: [{ label: 'Home', path: '/dashboard' }, { label: 'Marketplace', path: '/marketplace' }, { label: 'Cart' }]
    };
    return map[name] || [{ label: 'Home', path: '/dashboard' }, { label: name.charAt(0).toUpperCase() + name.slice(1) }];
  }

  function callRenderer(name, params) {
    if (window._currentPageCleanup) {
      window._currentPageCleanup();
      window._currentPageCleanup = null;
    }
    var mainContent = ensureShell();
    if (!mainContent) return;
    var crumbs = getBreadcrumbForPage(name);
    var headerCrumb = document.getElementById('header-breadcrumb');
    if (headerCrumb && crumbs.length > 0) {
      headerCrumb.textContent = crumbs[crumbs.length - 1].label;
    }
    try {
      var pageContainer = document.createElement('div');
      pageContainer.innerHTML = utils.renderBreadcrumb(crumbs);
      mainContent.innerHTML = '';
      mainContent.appendChild(pageContainer.firstChild);
      if (window.renderPage && typeof window.renderPage[name] === 'function') {
        window.renderPage[name](params || {});
        highlightActiveNav();
        /* Show daily goals on dashboard */
        if (name === 'dashboard') {
          var goalsHtml = _showDailyGoals();
          if (goalsHtml) {
            var goalsContainer = document.createElement('div');
            goalsContainer.id = 'daily-goals-banner';
            mainContent.insertBefore(goalsContainer, mainContent.firstChild.nextSibling);
            goalsContainer.outerHTML = goalsHtml;
          }
        }
        /* Track recently viewed pages */
        var rv = store.get('recentlyViewed') || [];
        var title = name.charAt(0).toUpperCase() + name.slice(1);
        rv.unshift({ route: window.location.hash, title: title, time: Date.now() });
        if (rv.length > 10) rv.length = 10;
        store.set('recentlyViewed', rv);
      } else {
        mainContent.innerHTML = '\
<div class="flex flex-col items-center justify-center empty-state">\
  <div class="empty-state-icon">\uD83D\uDEA7</div>\
  <h2 class="empty-state-title">' + name.charAt(0).toUpperCase() + name.slice(1) + '</h2>\
  <p class="empty-state-text">This page is coming soon. Check back later!</p>\
  <button class="btn btn-primary" data-action="navigate:/dashboard">Go to Dashboard</button>\
</div>';
      }
    } catch (e) {
      mainContent.innerHTML = '\
<div class="flex flex-col items-center justify-center empty-state">\
  <div class="empty-state-icon">\u26A0\uFE0F</div>\
  <h2 class="empty-state-title">Something went wrong</h2>\
  <p class="empty-state-text">' + utils.sanitizeHTML(e.message || 'An error occurred') + '</p>\
  <button class="btn btn-primary" data-action="navigate:/dashboard">Go to Dashboard</button>\
</div>';
    }
  }

  function makeHandler(pageName) {
    return function(params) {
      var mc = document.getElementById('main-content');
      if (mc) {
        mc.style.opacity = '0';
        mc.style.transition = 'opacity 0.2s ease';
      }
      setTimeout(function() {
        callRenderer(pageName, params);
        if (mc) setTimeout(function() { mc.style.opacity = '1'; }, 50);
      }, 50);
    };
  }

  function authGuard(pattern, params) {
    if (!isAuthenticated()) {
      var publicPatterns = ['/', '/login', '/signup', '/forgot-password', '/otp-verification', '/reset-password'];
      for (var i = 0; i < publicPatterns.length; i++) {
        if (pattern === publicPatterns[i]) return true;
      }
      router.navigate('/login');
      return false;
    }
    return true;
  }

  return {
    init: function() {
      try {
        window.renderPage = window.renderPage || {};
      } catch (e) {
        window.renderPage = {};
      }

      var authProtected = [
        '/dashboard', '/dashboard/:classId', '/subject/:id', '/subject/:id/chapter/:chapterId',
        '/subject/:id/lesson/:lessonId', '/subject/:id/lesson/:lessonId/topic/:topicId',
        '/videos', '/resources', '/downloads', '/marketplace', '/marketplace/category/:cat',
        '/marketplace/product/:id', '/cart', '/quizzes', '/quiz/:id', '/exams', '/exam/:id',
        '/ai-route', '/ai-helper', '/scholarship', '/meet', '/live-classes', '/community', '/feed',
        '/profile', '/settings', '/notifications', '/search', '/schedule', '/calendar',
        '/ai-mentor', '/analytics', '/career', '/messages', '/ask-teacher',
        '/virtual-labs', '/gamification',
        '/learning-route', '/learning-route/:subjectId', '/learning-paths', '/inbox',
        '/flashcards', '/study-timer', '/sticky-notes', '/goals', '/challenges', '/notebook', '/reminders'
      ];
      router.markAuthRoutes(authProtected);
      router.setAuthGuard(authGuard);

      router.addRoute('/', function() {
        if (isAuthenticated()) { router.navigate('/dashboard'); return; }
        renderApp();
      });
      router.addRoute('', function() {
        if (isAuthenticated()) { router.navigate('/dashboard'); return; }
        renderApp();
      });
      router.addRoute('/login', function() {
        if (isAuthenticated()) { router.navigate('/dashboard'); return; }
        if (window.renderPage && typeof window.renderPage.login === 'function') {
          window.renderPage.login();
        }
      });
      router.addRoute('/signup', function() {
        if (isAuthenticated()) { router.navigate('/dashboard'); return; }
        if (window.renderPage && typeof window.renderPage.signup === 'function') {
          window.renderPage.signup();
        }
      });
      router.addRoute('/forgot-password', function() {
        if (isAuthenticated()) { router.navigate('/dashboard'); return; }
        if (window.renderPage && typeof window.renderPage.forgotPassword === 'function') {
          window.renderPage.forgotPassword();
        }
      });
      router.addRoute('/otp-verification', function() {
        if (isAuthenticated()) { router.navigate('/dashboard'); return; }
        if (window.renderPage && typeof window.renderPage.otpVerification === 'function') {
          window.renderPage.otpVerification();
        }
      });
      router.addRoute('/reset-password', function() {
        if (isAuthenticated()) { router.navigate('/dashboard'); return; }
        if (window.renderPage && typeof window.renderPage.resetPassword === 'function') {
          window.renderPage.resetPassword();
        }
      });
      router.addRoute('/dashboard', makeHandler('dashboard'));
      router.addRoute('/dashboard/:classId', makeHandler('dashboardClass'));
      router.addRoute('/subject/:id', makeHandler('subject'));
      router.addRoute('/subject/:id/chapter/:chapterId', makeHandler('chapter'));
      router.addRoute('/subject/:id/lesson/:lessonId', makeHandler('chapter'));
      router.addRoute('/subject/:id/lesson/:lessonId/topic/:topicId', makeHandler('topic'));
      router.addRoute('/videos', makeHandler('videos'));
      router.addRoute('/resources', makeHandler('resources'));
      router.addRoute('/downloads', makeHandler('downloads'));
      router.addRoute('/marketplace', makeHandler('marketplace'));
      router.addRoute('/marketplace/category/:cat', makeHandler('marketplaceCategory'));
      router.addRoute('/marketplace/product/:id', makeHandler('productDetail'));
      router.addRoute('/cart', makeHandler('cart'));
      router.addRoute('/quizzes', makeHandler('quizzes'));
      router.addRoute('/quiz/:id', makeHandler('quiz'));
      router.addRoute('/exams', makeHandler('exams'));
      router.addRoute('/exam/:id', makeHandler('exam'));
      router.addRoute('/ai-route', function() { router.navigate('/ai-helper'); });
      router.addRoute('/ai-helper', makeHandler('aiHelper'));
      router.addRoute('/ask-teacher', makeHandler('teacherInteraction'));
      router.addRoute('/scholarship', makeHandler('scholarship'));
      router.addRoute('/meet', function() { router.navigate('/live-classes'); });
      router.addRoute('/live-classes', makeHandler('liveClasses'));
      router.addRoute('/community', makeHandler('community'));
      router.addRoute('/feed', makeHandler('feed'));
      router.addRoute('/profile', makeHandler('profile'));
      router.addRoute('/rank', makeHandler('rank'));
      router.addRoute('/settings', makeHandler('settings'));
      router.addRoute('/notifications', makeHandler('notifications'));
      router.addRoute('/search', makeHandler('search'));
      router.addRoute('/schedule', function() { router.navigate('/calendar'); });
      router.addRoute('/calendar', makeHandler('calendar'));
      router.addRoute('/ai-mentor', function() { router.navigate('/ai-helper'); });
      router.addRoute('/analytics', makeHandler('analytics'));
      router.addRoute('/career', makeHandler('career'));
      router.addRoute('/messages', makeHandler('messages'));
      router.addRoute('/virtual-labs', makeHandler('virtualLabs'));
      router.addRoute('/gamification', makeHandler('gamification'));
      router.addRoute('/learning-route', makeHandler('learningRoute'));
      router.addRoute('/learning-route/:subjectId', makeHandler('learningRouteSubject'));
      router.addRoute('/learning-paths', function() { router.navigate('/learning-route'); });
      router.addRoute('/inbox', makeHandler('inbox'));
      router.addRoute('/flashcards', makeHandler('flashcards'));
      router.addRoute('/study-timer', makeHandler('studyTimer'));
      router.addRoute('/sticky-notes', makeHandler('stickyNotes'));
      router.addRoute('/goals', makeHandler('goalTracker'));
      router.addRoute('/challenges', makeHandler('challenges'));
      router.addRoute('/notebook', makeHandler('notebook'));
      router.addRoute('/reminders', makeHandler('reminders'));
      router.addRoute('404', function() {
        var mc = document.getElementById('main-content');
        if (mc) mc.innerHTML = renderNotFound();
      });

      router.start();
      this.initAccessibility();
      this.initKeyboardShortcuts();
      if (window.BackendBridge && typeof window.BackendBridge.refreshSession === 'function') {
        window.BackendBridge.refreshSession();
      }
      document.addEventListener('click', function(e) {
        if (!e.target.closest('.header-dropdown')) {
          document.querySelectorAll('.header-dropdown-menu').forEach(function(el) { el.style.display = 'none'; });
        }
      });
      // Global event delegation for data-action clicks
      document.addEventListener('click', function(e) {
        var target = e.target.closest('[data-action]');
        if (!target) return;
        var action = target.getAttribute('data-action');
        if (!action) return;

        if (action.indexOf('navigate:') === 0) {
          e.preventDefault();
          var overlay = document.getElementById('search-overlay');
          if (overlay) overlay.remove();
          window.Router.navigate(action.slice(9));
          return;
        }

        if (action === 'toggle-sidebar') { if (window.App) window.App.toggleSidebar(); return; }
        if (action === 'toggle-theme') { if (window.App) window.App.toggleTheme(); return; }
        if (action === 'toggle-notifications') { if (window.App) window.App.toggleNotifDropdown(); return; }
        if (action === 'toggle-profile-dropdown') { if (window.App) window.App.toggleProfileDropdown(); return; }
        if (action === 'toggle-mobile-sidebar') { if (window.App) window.App.toggleMobileSidebar(); return; }
        if (action === 'open-search') { if (window.App) window.App.openSearch(); return; }
        if (action === 'logout') { if (window.App) window.App.logout(); return; }

        if (action.indexOf('landing-scroll:') === 0) {
          e.preventDefault();
          var secId = action.slice('landing-scroll:'.length);
          var sec = document.getElementById(secId);
          if (sec) sec.scrollIntoView({ behavior: 'smooth', block: 'start' });
          return;
        }

        if (action.indexOf('window:') === 0) {
          window.open(action.slice(7), '_blank');
          return;
        }

        if (action === 'pagination') {
          e.preventDefault();
          var page = parseInt(target.getAttribute('data-page'));
          var fn = target.getAttribute('data-fn');
          if (!isNaN(page) && fn && window[fn]) {
            window[fn](page);
          }
          return;
        }
      });
    },
    initAccessibility: function() {
      var hc = store.get('highContrast');
      if (hc) document.documentElement.classList.add('high-contrast');
      var fs = store.get('fontScale') || 2;
      document.documentElement.classList.add('font-scale-' + fs);
      var mr = store.get('motionReduce');
      if (mr) document.documentElement.classList.add('motion-reduce');
    },
    toggleHighContrast: function() {
      var hc = !store.get('highContrast');
      store.set('highContrast', hc);
      document.documentElement.classList.toggle('high-contrast', hc);
    },
    setFontScale: function(level) {
      var el = document.documentElement;
      for (var i = 1; i <= 5; i++) el.classList.remove('font-scale-' + i);
      el.classList.add('font-scale-' + level);
      store.set('fontScale', level);
    },
    toggleMotionReduce: function() {
      var mr = !store.get('motionReduce');
      store.set('motionReduce', mr);
      document.documentElement.classList.toggle('motion-reduce', mr);
    },
    initKeyboardShortcuts: function() {
      if (document._keyboardInitialized) return;
      document._keyboardInitialized = true;
      var self = this;
      document.addEventListener('keydown', function(e) {
        if (e.ctrlKey || e.metaKey) {
          switch (e.key) {
            case 'k': case 'K':
              e.preventDefault();
              break;
            case 'h': case 'H':
              e.preventDefault();
              var hint = document.getElementById('shortcut-hint');
              if (hint) hint.classList.toggle('open');
              break;
            case 'd': case 'D':
              e.preventDefault();
              if (isAuthenticated()) router.navigate('/dashboard');
              break;
            case 'm': case 'M':
              e.preventDefault();
              if (isAuthenticated()) router.navigate('/messages');
              break;
            case '1': case '!':
              e.preventDefault();
              if (isAuthenticated()) router.navigate('/ai-helper');
              break;
            case '2': case '@':
              e.preventDefault();
              if (isAuthenticated()) router.navigate('/analytics');
              break;
          }
        }
        if (e.key === 'Escape') {
          e.stopImmediatePropagation();
          var topOverlay = document.querySelector('.modal-overlay, .drawer-overlay, .search-overlay');
          if (topOverlay) {
            var closeBtn = topOverlay.querySelector('.modal-close, .drawer-close, .close-btn, [onclick*="close"]');
            if (closeBtn) closeBtn.click();
            else topOverlay.remove();
            return;
          }
          var hint = document.getElementById('shortcut-hint');
          if (hint) hint.classList.remove('open');
          return;
        }
        if (e.key === '?' && !e.ctrlKey && !e.metaKey) {
          var target = e.target;
          if (target && (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA')) return;
          e.preventDefault();
          var hint = document.getElementById('shortcut-hint');
          if (hint) hint.classList.toggle('open');
        }
        if (e.altKey && e.key === 't') { e.preventDefault(); router.navigate('/ask-teacher'); return; }
      });
    },
    toggleSidebar: function() {
      var collapsed = !store.get('sidebarCollapsed');
      store.set('sidebarCollapsed', collapsed);
      var sidebar = document.getElementById('app-sidebar');
      var main = document.getElementById('app-main');
      var header = document.getElementById('app-header');
      if (sidebar) sidebar.classList.toggle('collapsed', collapsed);
      if (main) main.classList.toggle('sidebar-collapsed', collapsed);
      if (header) header.classList.toggle('sidebar-collapsed', collapsed);
      var btn = sidebar ? sidebar.querySelector('.sidebar-collapse-btn') : null;
      if (btn) btn.textContent = collapsed ? '\xBB' : '\xAB';
    },
    toggleNotifDropdown: function() {
      var dd = document.getElementById('notif-dropdown');
      if (!dd) return;
      var isOpen = dd.style.display !== 'none';
      document.querySelectorAll('.header-dropdown-menu').forEach(function(el) { el.style.display = 'none'; });
      dd.style.display = isOpen ? 'none' : 'block';
      if (!isOpen) {
        var list = document.getElementById('notif-dropdown-list');
        if (list) {
          var notifs = store.get('notifications') || [];
          var today = new Date();
          var todayStr = today.toDateString();
          var yesterday = new Date(today);
          yesterday.setDate(yesterday.getDate() - 1);
          var yesterdayStr = yesterday.toDateString();
          var todayItems = [];
          var yesterdayItems = [];
          var earlierItems = [];
          for (var i = 0; i < notifs.length; i++) {
            var n = notifs[i];
            var nDate = new Date(n.createdAt);
            var nStr = nDate.toDateString();
            if (nStr === todayStr) {
              todayItems.push(n);
            } else if (nStr === yesterdayStr) {
              yesterdayItems.push(n);
            } else {
              earlierItems.push(n);
            }
          }
          var html = '';
          if (todayItems.length > 0) {
            html += '<div class="notif-group-label">Today</div>';
            for (var j = 0; j < Math.min(todayItems.length, 5); j++) {
              var nt = todayItems[j];
              html += '<div class="notif-item" data-action="navigate:/notifications">\
                <div class="notif-item-icon">' + (nt.type === 'achievement' ? '\uD83C\uDFC6' : nt.type === 'warning' ? '\u26A0\uFE0F' : nt.type === 'success' ? '\u2705' : '\u2139\uFE0F') + '</div>\
                <div class="notif-item-content">\
                  <div class="notif-item-text">' + (nt.message || '') + '</div>\
                  <div class="notif-item-time">' + utils.timeAgo(new Date(nt.createdAt)) + '</div>\
                </div>\
              </div>';
            }
          }
          if (yesterdayItems.length > 0) {
            html += '<div class="notif-group-label">Yesterday</div>';
            for (var j = 0; j < Math.min(yesterdayItems.length, 5); j++) {
              var nt = yesterdayItems[j];
              html += '<div class="notif-item" data-action="navigate:/notifications">\
                <div class="notif-item-icon">' + (nt.type === 'achievement' ? '\uD83C\uDFC6' : nt.type === 'warning' ? '\u26A0\uFE0F' : nt.type === 'success' ? '\u2705' : '\u2139\uFE0F') + '</div>\
                <div class="notif-item-content">\
                  <div class="notif-item-text">' + (nt.message || '') + '</div>\
                  <div class="notif-item-time">' + utils.timeAgo(new Date(nt.createdAt)) + '</div>\
                </div>\
              </div>';
            }
          }
          if (earlierItems.length > 0) {
            html += '<div class="notif-group-label">Earlier</div>';
            for (var j = 0; j < Math.min(earlierItems.length, 5); j++) {
              var nt = earlierItems[j];
              html += '<div class="notif-item" data-action="navigate:/notifications">\
                <div class="notif-item-icon">' + (nt.type === 'achievement' ? '\uD83C\uDFC6' : nt.type === 'warning' ? '\u26A0\uFE0F' : nt.type === 'success' ? '\u2705' : '\u2139\uFE0F') + '</div>\
                <div class="notif-item-content">\
                  <div class="notif-item-text">' + (nt.message || '') + '</div>\
                  <div class="notif-item-time">' + utils.timeAgo(new Date(nt.createdAt)) + '</div>\
                </div>\
              </div>';
            }
          }
          if (!html) html = '<div class="p-4 text-center text-secondary text-sm">No notifications</div>';
          list.innerHTML = html;
        }
      }
    },
    toggleProfileDropdown: function() {
      var dd = document.getElementById('profile-dropdown');
      if (!dd) return;
      var isOpen = dd.style.display !== 'none';
      document.querySelectorAll('.header-dropdown-menu').forEach(function(el) { el.style.display = 'none'; });
      dd.style.display = isOpen ? 'none' : 'block';
    },
    closeAllDropdowns: function() {
      document.querySelectorAll('.header-dropdown-menu').forEach(function(el) { el.style.display = 'none'; });
    },
    toggleMobileSidebar: function() {
      var sidebar = document.getElementById('app-sidebar');
      var overlay = document.getElementById('sidebar-overlay');
      if (sidebar) sidebar.classList.toggle('mobile-open');
      if (overlay) overlay.classList.toggle('active');
    },
    toggleTheme: function() {
      var current = store.get('theme');
      var next = current === 'dark' ? 'light' : 'dark';
      store.set('theme', next);
      document.documentElement.setAttribute('data-theme', next);
    },
    openSearch: function() {
      var overlay = document.createElement('div');
      overlay.className = 'search-overlay';
      overlay.id = 'search-overlay';
      overlay.innerHTML = '\
<div class="search-modal">\
  <div class="search-modal-header">\
    <input type="text" class="search-modal-input" id="search-input" placeholder="Search courses, subjects, resources..." autofocus>\
  </div>\
  <div class="search-modal-results" id="search-results">\
    <div class="flex items-center justify-center p-6 text-secondary text-sm">Type to search...</div>\
  </div>\
</div>';
      overlay.addEventListener('click', function(e) {
        if (e.target === overlay) overlay.remove();
      });
      document.body.appendChild(overlay);
      var input = document.getElementById('search-input');
      if (input) {
        setTimeout(function() { input.focus(); }, 100);
        input.addEventListener('input', utils.debounce(function() {
          var q = input.value;
          var resultsContainer = document.getElementById('search-results');
          if (!resultsContainer) return;
          if (!q || q.trim().length < 2) {
            resultsContainer.innerHTML = '<div class="flex items-center justify-center p-6 text-secondary text-sm">Type at least 2 characters to search...</div>';
            return;
          }
          api.search(q).then(function(res) {
            if (!res.success || !res.data || res.data.length === 0) {
              resultsContainer.innerHTML = '<div class="flex items-center justify-center p-6 text-secondary text-sm">No results found for "' + utils.sanitizeHTML(q) + '"</div>';
              return;
            }
            var html = '';
            for (var i = 0; i < res.data.length; i++) {
              var item = res.data[i];
              var label = item.title || item.name || item.content || '';
              var typeLabel = item.type || '';
              html += '<div class="search-result-item" data-action="navigate:/search?q=' + encodeURIComponent(q) + '">\
  <div class="search-result-icon">' + (item.icon || '\uD83D\uDCC4') + '</div>\
  <div class="search-result-info">\
    <div class="search-result-title">' + utils.sanitizeHTML(utils.truncate(label, 60)) + '</div>\
    <div class="search-result-path">' + typeLabel + '</div>\
  </div>\
</div>';
            }
            resultsContainer.innerHTML = html;
          });
        }, 300));
        input.addEventListener('keydown', function(e) {
          if (e.key === 'Escape') overlay.remove();
        });
      }
    },
    logout: function() {
      store.clear();
      store.set('isAuthenticated', false);
      window.location.hash = '#/';
      this.closeAllDropdowns();
    },
    awardXP: awardXP,
    awardCoins: awardCoins,
    getDailyMissions: getDailyMissions,
    updateMissionProgress: updateMissionProgress,
    getDailyGoals: getDailyGoals,
    updateGoalProgress: updateGoalProgress,
    renderDailyGoals: _showDailyGoals,
    addNotification: addNotification,
    authStateChanged: function() {
      if (isAuthenticated()) {
        var appRoot = document.getElementById('app');
        if (appRoot) appRoot.innerHTML = renderAppShell();
        initComponents();
        var mainContent = document.getElementById('main-content');
        if (mainContent) {
          router.onLoading(function(loading) {
            var mc = document.getElementById('main-content');
            if (mc && loading) showLoading(mc);
          });
          router.handleRoute();
        }
      } else {
        renderApp();
      }
    },
    refreshUserDisplay: function() {
      var u = getCurrentUser();
      var avatarEl = document.querySelector('.header-avatar-btn .avatar');
      if (avatarEl) avatarEl.textContent = u && u.name ? utils.getInitials(u.name) : '?';
      var ddName = document.querySelector('#profile-dropdown .dd-name');
      if (ddName) ddName.textContent = u ? utils.sanitizeHTML(u.name || 'Student') : 'Student';
      var ddEmail = document.querySelector('#profile-dropdown .dd-email');
      if (ddEmail) ddEmail.textContent = u ? utils.sanitizeHTML(u.email || '') : 'student@email.com';
      var ddClass = document.querySelector('#profile-dropdown .dd-class');
      if (ddClass) ddClass.textContent = u ? 'Class ' + (u.class || 'N/A') : 'Not enrolled';
      var sbName = document.querySelector('.sidebar-user-name');
      if (sbName) sbName.textContent = u ? utils.sanitizeHTML(u.name || 'Student') : 'Student';
      var sbClassEl = document.querySelector('.sidebar-user-class');
      if (sbClassEl) sbClassEl.textContent = u ? 'Class ' + (u.class || 'N/A') : 'Not enrolled';
      var sbAvatar = document.querySelector('#sidebar-user .avatar');
      if (sbAvatar) sbAvatar.textContent = u && u.name ? utils.getInitials(u.name) : '?';
    },
    getDailyStats: getDailyStats,
    showToast: function(message, type) {
      if (window.UI && window.UI.showToast) {
        window.UI.showToast(message, type || 'info');
        return;
      }
      var container = document.querySelector('.toast-container');
      if (!container) {
        container = document.createElement('div');
        container.className = 'toast-container';
        document.body.appendChild(container);
      }
      var toast = document.createElement('div');
      toast.className = 'toast toast-' + (type || 'info');
      toast.innerHTML = '<span>' + message + '</span>';
      container.appendChild(toast);
      setTimeout(function() {
        toast.classList.add('toast-hide');
        setTimeout(function() { toast.remove(); }, 300);
      }, 3000);
    }
  };
})();

document.addEventListener('DOMContentLoaded', function() {
  window.App.init();
});
