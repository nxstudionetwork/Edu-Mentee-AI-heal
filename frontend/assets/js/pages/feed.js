window.renderPage.feed = function(params) {
  var container = document.getElementById('main-content');
  if (!container) return;
  var md = window.mockData;
  var utils = window.Utils;
  var store = window.Store;
  var api = window.API;

  var currentFilter = 'all';
  var postsLoaded = 10;
  var postsPerLoad = 5;
  var feedPosts = [];
  var topicFilter = '';
  var isLoading = true;
  var hasMorePosts = true;
  var sortOrder = 'latest';

  var trendingTopics = [
    { topic: '#BoardExam2026', posts: 1250 },
    { topic: '#JEEMainPrep', posts: 890 },
    { topic: '#NEETPreparation', posts: 765 },
    { topic: '#StudyMotivation', posts: 654 },
    { topic: '#MathTricks', posts: 543 },
    { topic: '#ScienceExperiments', posts: 432 },
    { topic: '#EnglishGrammar', posts: 321 },
    { topic: '#TimeManagement', posts: 298 },
    { topic: '#CodingForKids', posts: 276 },
    { topic: '#Scholarship2026', posts: 245 }
  ];

  var suggestedUsers = [
    { id: 'su1', name: 'Neha Kapoor', mutual: 5, badge: 'Student' },
    { id: 'su2', name: 'Arjun Reddy', mutual: 3, badge: 'Student' },
    { id: 'su3', name: 'Kavita Nair', mutual: 8, badge: 'Teacher' },
    { id: 'su4', name: 'Rohit Joshi', mutual: 2, badge: 'Mentor' },
    { id: 'su5', name: 'Sneha Iyer', mutual: 6, badge: 'Student' },
    { id: 'su6', name: 'Dr. Meera Sharma', mutual: 4, badge: 'Teacher' },
    { id: 'su7', name: 'Vikram Patel', mutual: 1, badge: 'Mentor' }
  ];

  var upcomingEvents = [
    { title: 'Mathematics Olympiad Workshop', date: 'Jul 12, 2026', time: '4:00 PM', type: 'Workshop' },
    { title: 'NEET Mock Test Series', date: 'Jul 15, 2026', time: '10:00 AM', type: 'Test' },
    { title: 'Coding Bootcamp - Python Basics', date: 'Jul 18, 2026', time: '3:00 PM', type: 'Bootcamp' },
    { title: 'English Essay Writing Contest', date: 'Jul 22, 2026', time: '11:00 AM', type: 'Contest' }
  ];

  var userGroups = [
    { name: 'JEE Advanced 2027 Prep', members: 3420, color: '#3b82f6' },
    { name: 'CBSE Class 12 Study Group', members: 5890, color: '#8b5cf6' },
    { name: 'NEET Aspirants India', members: 7650, color: '#10b981' },
    { name: 'Coding for Beginners', members: 2100, color: '#f59e0b' },
    { name: 'English Literature Club', members: 1560, color: '#ec4899' }
  ];

  var dailyStudyTip = {
    text: 'Use the Feynman Technique: Explain a concept in simple language as if teaching a child. If you can\'t explain it simply, you don\'t understand it well enough.',
    author: 'Richard Feynman',
    subject: 'Study Methods'
  };

  var studyQuotes = [
    { text: 'The secret of getting ahead is getting started.', author: 'Mark Twain' },
    { text: 'Education is the most powerful weapon to change the world.', author: 'Nelson Mandela' },
    { text: 'Success is the sum of small efforts repeated day in and day out.', author: 'Robert Collier' },
    { text: 'The only way to do great work is to love what you do.', author: 'Steve Jobs' },
    { text: 'Believe you can and you\'re halfway there.', author: 'Theodore Roosevelt' }
  ];

  var postTypeMeta = {
    achievement: { label: 'Achievement', icon: '🏆', color: '#f59e0b' },
    question: { label: 'Question', icon: '❓', color: '#3b82f6' },
    tip: { label: 'Study Tip', icon: '💡', color: '#10b981' },
    resource: { label: 'Resource', icon: '📄', color: '#8b5cf6' },
    milestone: { label: 'Milestone', icon: '🎯', color: '#06b6d4' },
    update: { label: 'Update', icon: '📢', color: '#f97316' },
    poll: { label: 'Poll', icon: '📊', color: '#ec4899' }
  };

  var filterLabels = {
    all: 'For You',
    following: 'Following',
    trending: 'Trending',
    achievement: 'Achievements',
    question: 'Questions',
    tip: 'Study Tips',
    resource: 'Resources'
  };

  var filterKeys = ['all', 'following', 'trending', 'achievement', 'question', 'tip', 'resource'];

  var modalPostType = 'tip';
  var commentData = {};
  var subjectOptions = [];

  function getSubjectList() {
    var subjectsData = md.subjects || [];
    var seen = {};
    var list = [];
    for (var i = 0; i < subjectsData.length; i++) {
      var name = subjectsData[i].name;
      if (!seen[name]) {
        seen[name] = true;
        list.push(name);
      }
    }
    return list;
  }

  function persistLikes() {
    var likes = [];
    for (var i = 0; i < feedPosts.length; i++) {
      if (feedPosts[i].isLiked) likes.push(feedPosts[i].id);
    }
    store.set('feedLikes', likes);
  }

  function persistBookmarks() {
    var marks = [];
    for (var i = 0; i < feedPosts.length; i++) {
      if (feedPosts[i].bookmarked) marks.push(feedPosts[i].id);
    }
    store.set('feedBookmarks', marks);
  }

  function persistCreatedPosts() {
    var created = [];
    for (var i = 0; i < feedPosts.length; i++) {
      if (feedPosts[i]._isCreated) created.push(feedPosts[i]);
    }
    store.set('feedCreatedPosts', created);
  }

  function showToast(msg, type) {
    if (!type) type = 'success';
    var icons = { success: '✅', error: '❌', info: 'ℹ️', warning: '⚠️' };
    var toast = document.createElement('div');
    toast.className = 'c-bg-card c-border c-radius-md c-flex c-flex-gap-2 c-mt-2';
    toast.style.cssText = 'padding:12px 20px;box-shadow:0 8px 32px rgba(0,0,0,0.3);font-size:14px;animation:slideUp 0.3s ease';
    toast.innerHTML = '<span class="c-fs-base">' + (icons[type] || '✅') + '</span> ' + msg;
    var tc = document.getElementById('toast-container');
    if (tc) {
      tc.appendChild(toast);
      setTimeout(function() {
        if (toast.parentNode) toast.remove();
      }, 2500);
    }
  }

  function getUserBadge(name) {
    if (!name) return 'Student';
    var n = name.toLowerCase();
    if (n.indexOf('dr') === 0 || n.indexOf('prof') === 0) return 'Teacher';
    if (n.indexOf('mentor') !== -1) return 'Mentor';
    return 'Student';
  }

  function getBadgeColor(badge) {
    if (badge === 'Teacher') return 'var(--accent-blue)';
    if (badge === 'Mentor') return 'var(--accent-purple)';
    return 'var(--accent-green)';
  }

  function init() {
    subjectOptions = getSubjectList();
    var likesData = store.get('feedLikes') || [];
    var bookmarksData = store.get('feedBookmarks') || [];
    var commentsData = store.get('feedComments') || {};
    var createdPosts = store.get('feedCreatedPosts') || [];

    feedPosts = (md.feedPosts || []).slice().sort(function(a, b) {
      return new Date(b.createdAt) - new Date(a.createdAt);
    });

    for (var i = 0; i < createdPosts.length; i++) {
      feedPosts.unshift(createdPosts[i]);
    }

    for (var i = 0; i < feedPosts.length; i++) {
      feedPosts[i].comments = Array.isArray(feedPosts[i].comments) ? feedPosts[i].comments : [];
      feedPosts[i].expanded = false;
      feedPosts[i].isLiked = likesData.indexOf(feedPosts[i].id) !== -1;
      feedPosts[i].bookmarked = bookmarksData.indexOf(feedPosts[i].id) !== -1;
      if (commentsData[feedPosts[i].id]) {
        feedPosts[i].comments = feedPosts[i].comments.concat(commentsData[feedPosts[i].id]);
      }
      if (!feedPosts[i].shares) feedPosts[i].shares = 0;
      if (!feedPosts[i].hashtags) feedPosts[i].hashtags = [];
      if (!feedPosts[i].pinned) feedPosts[i].pinned = false;
      if (feedPosts[i].comments.length === 0 && feedPosts[i].type === 'tip') {
        feedPosts[i].comments = [
          { author: 'Priya Sharma', text: 'Great tip! Thanks for sharing!', createdAt: new Date(Date.now() - 86400000).toISOString() },
          { author: 'Amit Verma', text: 'This really helps with my study routine.', createdAt: new Date(Date.now() - 43200000).toISOString() }
        ];
      }
    }

    renderSkeleton();
    setTimeout(function() {
      isLoading = false;
      render();
    }, 300);
  }

  function renderSkeleton() {
    var html = '<div class="page-container animate-fadeInUp">';
    html += '<div class="c-feed-wrapper">';
    html += '<div class="c-feed-grid">';

    html += '<div class="feed-left">';
    html += '<div class="glass-card c-p-6"><div class="skeleton skeleton-line w-32 mb-3"></div><div class="skeleton skeleton-line w-24 mb-2"></div><div class="skeleton skeleton-line w-40"></div></div>';
    html += '<div class="glass-card c-p-6 c-mt-3"><div class="skeleton skeleton-line w-36 mb-3"></div><div class="skeleton skeleton-line w-28 mb-2"></div><div class="skeleton skeleton-line w-28"></div></div>';
    html += '</div>';

    html += '<div class="feed-center">';
    html += '<div class="glass-card mb-4 c-p-4"><div class="skeleton skeleton-line w-full mb-2"></div></div>';
    for (var i = 0; i < 3; i++) {
      html += '<div class="glass-card mb-4 c-p-5">';
      html += '<div class="flex items-start gap-3 mb-3"><div class="skeleton skeleton-avatar"></div><div class="flex-1"><div class="skeleton skeleton-line w-32 mb-2"></div><div class="skeleton skeleton-line w-full mb-2"></div><div class="skeleton skeleton-line w-3/4"></div></div></div>';
      html += '<div class="skeleton skeleton-line w-48 mb-2"></div>';
      html += '<div class="flex gap-4 mt-3 pt-3 border-t border-[var(--border-color)]"><div class="skeleton skeleton-btn"></div><div class="skeleton skeleton-btn"></div><div class="skeleton skeleton-btn"></div></div>';
      html += '</div>';
    }
    html += '</div>';

    html += '<div class="feed-right">';
    html += '<div class="glass-card c-p-6"><div class="skeleton skeleton-line w-40 mb-3"></div><div class="skeleton skeleton-line w-32 mb-2"></div><div class="skeleton skeleton-line w-36"></div></div>';
    html += '</div>';

    html += '</div></div></div>';
    container.innerHTML = html;
  }

  function render() {
    var user = store.get('user');
    var userBadge = user ? getUserBadge(user.name) : 'Student';
    var xp = store.get('xp') || 0;
    var level = utils.calculateLevel ? utils.calculateLevel(xp) : Math.floor(xp / 100) + 1;

    var html = '<div class="page-container animate-fadeInUp">';
    html += '<div class="c-feed-wrapper">';
    html += '<div class="c-feed-grid">';

    html += renderLeftSidebar(user, userBadge, level, xp);
    html += renderFeedCenter(user, userBadge);
    html += renderRightSidebar(user);

    html += '</div></div></div>';

    html += renderModal();
    html += '<div id="toast-container" class="c-fixed c-z-1000 c-flex c-flex-col" style="bottom:24px;right:24px;flex-direction:column-reverse;gap:8px"></div>';

    container.innerHTML = html;
    if (!document.getElementById('toast-container')) {
      var tc2 = document.createElement('div');
      tc2.id = 'toast-container';
      tc2.className = 'c-fixed c-z-1000 c-flex c-flex-col';
      tc2.style.cssText = 'bottom:24px;right:24px;flex-direction:column-reverse;gap:8px';
      document.body.appendChild(tc2);
    }
    bindEvents();
  }

  function renderLeftSidebar(user, userBadge, level, xp) {
    var html = '<div class="c-feed-sidebar">';

    if (user) {
      var badgeColor = getBadgeColor(userBadge);
      var followingData = store.get('feedFollowing') || [];
      var userPostCount = feedPosts.filter(function(p) { return p.author === user.name; }).length;

      html += '<div class="glass-card c-p-5 c-text-center" style="border-radius:16px;overflow:hidden">';
      html += '<div class="c-relative" style="height:60px;background:var(--gradient-primary);margin:-20px -20px 0;border-radius:0 0 24px 24px"></div>';
      html += '<div class="avatar avatar-lg c-relative c-z-1" style="margin:-34px auto 8px;background:' + utils.getGradient(0) + ';width:68px;height:68px;font-size:1.5rem;border:3px solid var(--bg-card)">' + utils.getInitials(user.name) + '</div>';
      html += '<div class="font-semibold text-sm">' + utils.sanitizeHTML(user.name) + '</div>';
      html += '<div class="text-xs text-tertiary mt-1">' + (user.class || '12') + ' ' + (user.stream || 'Science') + ' · ' + (user.school || 'DPS') + '</div>';
      html += '<div class="flex items-center justify-center gap-1 mt-1"><span class="text-xs" style="color:' + badgeColor + '">● ' + userBadge + '</span></div>';
      html += '<div class="flex justify-center gap-4 mt-3 pt-3 border-t border-[var(--border-color)]">';
      html += '<div class="text-center"><div class="font-bold text-sm c-text-accent">' + userPostCount + '</div><div class="text-xs text-tertiary">Posts</div></div>';
      html += '<div class="text-center"><div class="font-bold text-sm c-text-accent">' + followingData.length + '</div><div class="text-xs text-tertiary">Following</div></div>';
      html += '<div class="text-center"><div class="font-bold text-sm c-text-accent">' + level + '</div><div class="text-xs text-tertiary">Level</div></div>';
      html += '</div>';
      if (xp > 0) {
        html += '<div class="c-overflow-hidden" style="background:var(--bg-glass-strong);border-radius:99px;height:4px;margin-top:8px">';
        var xpProgress = (xp % 100) || 0;
        html += '<div class="c-h-full c-grad-primary" style="width:' + xpProgress + '%;border-radius:99px;transition:width 0.5s ease"></div>';
        html += '</div>';
      }
      html += '</div>';
    }

    html += '<div class="glass-card c-p-3 c-px-4 c-radius-lg">';
    html += '<div class="c-flex c-flex-col c-flex-gap-1">';
    html += '<div class="c-flex c-flex-gap-3 c-py-2 c-px-3 rounded-lg c-pointer hover-bg-glass feed-nav-link active c-fs-sm c-text-primary c-fw-semibold" data-filter="all"><span class="c-fs-lg c-text-center c-w-24">📰</span> My Feed</div>';
    html += '<div class="c-flex c-flex-gap-3 c-py-2 c-px-3 rounded-lg c-pointer hover-bg-glass feed-nav-link c-fs-sm c-text-secondary c-fw-medium" data-filter="my-posts"><span class="c-fs-lg c-text-center c-w-24">✍️</span> My Posts</div>';
    html += '<div class="c-flex c-flex-gap-3 c-py-2 c-px-3 rounded-lg c-pointer hover-bg-glass feed-nav-link c-fs-sm c-text-secondary c-fw-medium" data-filter="bookmarks"><span class="c-fs-lg c-text-center c-w-24">🔖</span> Bookmarks</div>';
    html += '<div class="c-flex c-flex-gap-3 c-py-2 c-px-3 rounded-lg c-pointer hover-bg-glass feed-nav-link c-fs-sm c-text-secondary c-fw-medium" data-filter="liked"><span class="c-fs-lg c-text-center c-w-24">❤️</span> Liked Posts</div>';
    html += '</div>';
    html += '</div>';

    html += '<div class="glass-card c-px-4 c-py-4 c-radius-lg">';
    html += '<div class="c-fs-xs c-fw-semibold text-tertiary uppercase tracking-wide c-mb-3 c-flex c-flex-gap-2">👥 Your Groups</div>';
    html += '<div class="c-flex c-flex-col c-flex-gap-2">';
    for (var i = 0; i < userGroups.length; i++) {
      html += '<div class="c-flex c-flex-gap-3 c-py-1 c-px-1 rounded-lg">';
      html += '<div class="c-flex-center c-flex-shrink-0 c-fw-bold" style="width:32px;height:32px;border-radius:10px;background:' + userGroups[i].color + '20;font-size:0.75rem;color:' + userGroups[i].color + '">' + utils.getInitials(userGroups[i].name) + '</div>';
      html += '<div class="c-flex-1 c-min-width-0"><div class="text-sm font-medium truncate">' + userGroups[i].name + '</div><div class="c-fs-xs c-text-tertiary">' + utils.formatNumber(userGroups[i].members) + ' members</div></div>';
      html += '</div>';
    }
    html += '</div>';
    html += '</div>';

    html += '<div class="glass-card c-px-4 c-py-4 c-radius-lg">';
    html += '<div class="c-fs-xs c-fw-semibold text-tertiary uppercase tracking-wide c-mb-3">⚡ Quick Links</div>';
    html += '<div class="c-flex c-flex-col c-flex-gap-2">';
    html += '<a href="#subjects" class="c-flex c-flex-gap-3 c-py-1 c-px-1 rounded-lg c-fs-sm c-text-secondary c-text-decoration-none"><span class="c-fs-lg c-text-center c-w-24">📚</span> Subjects</a>';
    html += '<a href="#videos" class="c-flex c-flex-gap-3 c-py-1 c-px-1 rounded-lg c-fs-sm c-text-secondary c-text-decoration-none"><span class="c-fs-lg c-text-center c-w-24">🎬</span> Videos</a>';
    html += '<a href="#resources" class="c-flex c-flex-gap-3 c-py-1 c-px-1 rounded-lg c-fs-sm c-text-secondary c-text-decoration-none"><span class="c-fs-lg c-text-center c-w-24">📄</span> Resources</a>';
    html += '<a href="#bookmarks" class="c-flex c-flex-gap-3 c-py-1 c-px-1 rounded-lg c-fs-sm c-text-secondary c-text-decoration-none"><span class="c-fs-lg c-text-center c-w-24">🔖</span> Bookmarks</a>';
    html += '</div>';
    html += '</div>';

    html += '<div class="c-p-1 c-px-1 c-text-center c-fs-xs c-text-tertiary">';
    html += '<span class="c-pointer hover-text-primary" style="margin:0 6px">About</span>·';
    html += '<span class="c-pointer hover-text-primary" style="margin:0 6px">Help</span>·';
    html += '<span class="c-pointer hover-text-primary" style="margin:0 6px">Privacy</span>·';
    html += '<span class="c-pointer hover-text-primary" style="margin:0 6px">Terms</span>';
    html += '<div class="c-mt-1">Edu-Mentee &copy; 2026</div>';
    html += '</div>';

    html += '</div>';
    return html;
  }

  function renderFeedCenter(user, userBadge) {
    var html = '<div class="c-min-width-0">';

    html += '<div class="glass-card mb-4 c-px-4 c-py-4 c-radius-lg">';
    html += '<div class="c-flex c-flex-gap-3 items-center">';
    html += '<div class="avatar avatar-sm c-flex-shrink-0" style="background:' + utils.getGradient(0) + ';width:40px;height:40px;font-size:0.9rem">' + (user ? utils.getInitials(user.name) : '?') + '</div>';
    html += '<button class="c-flex-1 c-text-left feed-create-input c-bg-glass c-border c-radius-full c-text-tertiary c-fs-sm c-pointer c-transition" id="btn-share-learning" style="padding:10px 18px">What\'s on your mind, ' + (user ? user.name.split(' ')[0] : 'Student') + '?</button>';
    html += '</div>';
    html += '<div class="flex gap-1 mt-3 pt-3 border-t border-[var(--border-color)] justify-between">';
    html += '<button class="c-flex c-flex-gap-1 c-fs-xs c-text-tertiary hover-text-primary feed-action-btn c-feed-action-btn" data-action="photo"><span class="c-fs-lg">📷</span><span class="hidden-sm">Photo</span></button>';
    html += '<button class="c-flex c-flex-gap-1 c-fs-xs c-text-tertiary hover-text-primary feed-action-btn c-feed-action-btn" data-action="document"><span class="c-fs-lg">📄</span><span class="hidden-sm">Document</span></button>';
    html += '<button class="c-flex c-flex-gap-1 c-fs-xs c-text-tertiary hover-text-primary feed-action-btn c-feed-action-btn" data-action="achievement"><span class="c-fs-lg">🏆</span><span class="hidden-sm">Achievement</span></button>';
    html += '<button class="c-flex c-flex-gap-1 c-fs-xs c-text-tertiary hover-text-primary feed-action-btn c-feed-action-btn" data-action="resource"><span class="c-fs-lg">📎</span><span class="hidden-sm">Resource</span></button>';
    html += '</div>';
    html += '</div>';

    html += '<div class="c-flex-between c-mb-4 c-px-1">';
    html += '<div class="c-flex c-flex-gap-1 c-flex-wrap" id="feed-tabs">';
    for (var i = 0; i < filterKeys.length; i++) {
      html += '<div class="feed-tab c-feed-tab' + (filterKeys[i] === currentFilter ? ' c-feed-tab-active' : ' c-feed-tab-inactive') + '" data-filter="' + filterKeys[i] + '">' + filterLabels[filterKeys[i]] + '</div>';
    }
    html += '</div>';
    html += '<div class="flex items-center gap-1">';
    html += '<button id="sort-latest" class="sort-btn c-sort-btn' + (sortOrder === 'latest' ? ' c-sort-active' : ' c-sort-inactive') + '">Latest</button>';
    html += '<button id="sort-popular" class="sort-btn c-sort-btn' + (sortOrder === 'popular' ? ' c-sort-active' : ' c-sort-inactive') + '">Popular</button>';
    html += '</div>';
    html += '</div>';

    if (topicFilter) {
      html += '<div class="c-flex c-flex-gap-2 c-mb-3 c-px-1">';
      html += '<span class="c-fs-xs c-text-secondary">Filtering by:</span>';
      html += '<span class="feed-filter-chip c-flex c-flex-gap-1 c-bg-glass-strong c-border c-radius-full c-fs-sm c-text-accent" style="padding:3px 10px">' + topicFilter + ' <span class="c-pointer c-text-tertiary" id="clear-topic-filter" style="margin-left:2px">✕</span></span>';
      html += '</div>';
    }

    html += '<div id="feed-posts">';
    html += renderFeedPosts();
    html += '</div>';

    html += '<div class="text-center mt-5 mb-6" id="load-more-container">';
    var filtered = getFilteredPosts();
    if (postsLoaded < filtered.length) {
      html += '<button class="btn btn-secondary c-radius-full" id="btn-load-more" style="padding:10px 32px">Load More Posts</button>';
    } else if (filtered.length > 0) {
      html += '<div class="text-sm text-tertiary">You\'ve seen all posts</div>';
    }
    html += '</div>';

    html += '</div>';
    return html;
  }

  function renderRightSidebar(user) {
    var followingData = store.get('feedFollowing') || [];
    var html = '<div class="c-feed-sidebar">';

    html += '<div class="glass-card c-px-4 c-py-4 c-radius-lg">';
    html += '<div class="c-fs-xs c-fw-semibold text-tertiary uppercase tracking-wide c-mb-3">🔥 Trending Topics</div>';
    html += '<div class="c-flex c-flex-wrap c-flex-gap-2">';
    for (var i = 0; i < trendingTopics.length; i++) {
      html += '<span class="trending-topic c-pointer c-bg-glass c-border c-radius-full c-fs-sm c-text-accent c-fw-medium c-transition c-flex c-flex-gap-1" data-topic="' + trendingTopics[i].topic + '" style="padding:4px 12px;color:var(--accent-blue)">' + trendingTopics[i].topic + ' <span class="c-fs-xs c-text-tertiary c-fw-normal">' + utils.formatNumber(trendingTopics[i].posts) + '</span></span>';
    }
    html += '</div>';
    html += '</div>';

    html += '<div class="glass-card c-px-4 c-py-4 c-radius-lg">';
    html += '<div class="c-flex-between c-mb-3"><div class="c-fs-xs c-fw-semibold text-tertiary uppercase tracking-wide">👥 Suggested Users</div></div>';
    html += '<div class="c-flex c-flex-col c-flex-gap-3">';
    for (var i = 0; i < suggestedUsers.length; i++) {
      var isFollowing = followingData.indexOf(suggestedUsers[i].id) !== -1;
      html += '<div class="c-flex c-flex-gap-3">';
      html += '<div class="avatar avatar-sm c-flex-shrink-0" style="background:' + utils.getGradient(i + 5) + ';width:36px;height:36px;font-size:0.7rem">' + utils.getInitials(suggestedUsers[i].name) + '</div>';
      html += '<div class="c-flex-1 c-min-width-0"><div class="c-fs-sm c-fw-medium text-truncate">' + suggestedUsers[i].name + '</div><div class="c-fs-xs c-text-tertiary">' + suggestedUsers[i].mutual + ' mutual connections</div></div>';
      html += '<button class="feed-follow-btn c-follow-btn' + (isFollowing ? ' c-follow-ing' : ' c-follow-not') + '" data-id="' + suggestedUsers[i].id + '">' + (isFollowing ? 'Following' : '+ Follow') + '</button>';
      html += '</div>';
    }
    html += '</div>';
    html += '</div>';

    html += '<div class="glass-card c-px-4 c-py-4 c-radius-lg">';
    html += '<div class="c-fs-xs c-fw-semibold text-tertiary uppercase tracking-wide c-mb-3">📅 Upcoming Events</div>';
    html += '<div class="c-flex c-flex-col c-flex-gap-3">';
    for (var i = 0; i < upcomingEvents.length; i++) {
      var ev = upcomingEvents[i];
      var dateParts = ev.date.split(' ');
      html += '<div class="c-flex c-flex-gap-3 items-start c-pointer hover-bg-glass c-transition" style="padding:6px 4px;border-radius:10px">';
      html += '<div class="c-flex-center c-flex-shrink-0" style="width:40px;height:40px;border-radius:10px;background:var(--gradient-glass);flex-direction:column;font-size:0.6rem;line-height:1.2"><div class="c-fw-bold c-text-accent" style="font-size:0.85rem">' + dateParts[0] + '</div><div class="c-text-tertiary">' + (dateParts[1] ? dateParts[1].replace(',', '') : '') + '</div></div>';
      html += '<div class="c-flex-1 c-min-width-0"><div class="c-fs-sm c-fw-medium text-truncate">' + ev.title + '</div><div class="c-flex c-flex-gap-2 c-mt-1"><span class="c-fs-xs c-text-tertiary">🕐 ' + ev.time + '</span><span class="c-fs-xs" style="padding:1px 6px;border-radius:4px;background:var(--accent-blue)10;color:var(--accent-blue)">' + ev.type + '</span></div></div>';
      html += '</div>';
    }
    html += '</div>';
    html += '</div>';

    html += '<div class="glass-card c-px-4 c-py-4 c-radius-lg" style="background:var(--gradient-glass);border-color:var(--accent-green)20">';
    html += '<div class="c-flex c-flex-gap-2 c-mb-3"><span class="c-fs-xl">💡</span><div class="c-fs-xs c-fw-semibold text-tertiary uppercase tracking-wide">Today\'s Study Tip</div></div>';
    html += '<div class="c-fs-sm" style="line-height:1.6;color:var(--text-primary)">' + dailyStudyTip.text + '</div>';
    html += '<div class="c-flex-between c-mt-3 c-border-top" style="padding-top:12px"><span class="c-fs-xs c-text-tertiary">— ' + dailyStudyTip.author + '</span><span class="c-fs-xs" style="color:var(--accent-green);background:var(--accent-green)10;padding:2px 8px;border-radius:4px">' + dailyStudyTip.subject + '</span></div>';
    html += '</div>';

    html += '<div class="glass-card c-px-4 c-py-4 c-radius-lg">';
    html += '<div class="c-fs-xs c-fw-semibold text-tertiary uppercase tracking-wide c-mb-3">📌 Pinned Posts</div>';
    var pinnedPosts = feedPosts.filter(function(p) { return p.pinned; }).slice(0, 2);
    if (pinnedPosts.length === 0) {
      pinnedPosts = feedPosts.slice(0, 2);
    }
    for (var i = 0; i < pinnedPosts.length; i++) {
      var pp = pinnedPosts[i];
      html += '<div class="c-flex c-flex-gap-2 items-start c-mb-3" style="border-bottom:' + (i < pinnedPosts.length - 1 ? '1px solid var(--border-light)' : 'none') + ';padding-bottom:12px">';
      html += '<div class="avatar avatar-sm c-flex-shrink-0" style="background:' + utils.getGradient(i) + ';width:28px;height:28px;font-size:0.6rem">' + utils.getInitials(pp.author) + '</div>';
      html += '<div class="c-flex-1 c-min-width-0"><div class="c-fs-xs c-fw-medium text-truncate c-text-primary">' + utils.sanitizeHTML(pp.author) + '</div><div class="c-fs-xs c-text-tertiary text-truncate">' + utils.sanitizeHTML((pp.content || '').slice(0, 60)) + '...</div></div>';
      html += '</div>';
    }
    html += '</div>';

    html += '</div>';
    return html;
  }

  function renderModal() {
    var types = [
      { value: 'tip', label: '💡 Study Tip' },
      { value: 'achievement', label: '🏆 Achievement' },
      { value: 'question', label: '❓ Question' },
      { value: 'resource', label: '📄 Resource' },
      { value: 'milestone', label: '🎯 Milestone' }
    ];
    var html = '<div class="modal-overlay c-fixed c-z-1000 c-flex-center c-hidden" id="create-post-modal-overlay" style="background:rgba(0,0,0,0.5);backdrop-filter:blur(4px)">';
    html += '<div class="modal c-bg-card" style="max-width:540px;width:90%;border-radius:20px">';
    html += '<div class="modal-header c-flex-between c-border-bottom" style="padding:16px 24px"><h2 class="c-fs-lg c-fw-semibold">Create Post</h2>';
    html += '<button class="btn btn-icon btn-ghost c-fs-xl c-flex-center c-bg-glass c-pointer c-border-0" id="modal-close-btn" style="width:32px;height:32px;border-radius:50%">✕</button></div>';
    html += '<div class="modal-body" style="padding:20px 24px">';
    html += '<div class="c-mb-4"><label class="c-fs-sm c-fw-medium c-mb-2 c-block c-text-secondary">Post Type</label>';
    html += '<div class="c-flex c-flex-wrap c-flex-gap-2" id="modal-type-selector">';
    for (var i = 0; i < types.length; i++) {
      html += '<button class="btn btn-sm modal-type-btn c-type-btn' + (types[i].value === 'tip' ? ' c-type-active' : ' c-type-inactive') + '" data-type="' + types[i].value + '">' + types[i].label + '</button>';
    }
    html += '</div></div>';
    html += '<div class="c-mb-4"><textarea class="input-field c-w-full c-bg-glass c-border c-text-primary c-fs-sm" id="modal-post-content" placeholder="What would you like to share?" style="min-height:120px;resize:vertical;padding:12px 16px;border-radius:12px;outline:none;font-family:inherit" rows="4"></textarea></div>';
    html += '<div class="c-mb-3"><label class="c-fs-xs c-fw-medium c-mb-1 c-block c-text-tertiary">Subject <span class="c-text-tertiary">(optional)</span></label>';
    html += '<select class="input-field c-w-full c-bg-glass c-border c-text-primary c-fs-sm" id="modal-post-subject" style="padding:10px 14px;border-radius:12px;outline:none">';
    html += '<option value="">Select a subject</option>';
    for (var s = 0; s < subjectOptions.length; s++) {
      html += '<option value="' + subjectOptions[s] + '">' + subjectOptions[s] + '</option>';
    }
    html += '</select></div>';
    html += '<div class="c-mb-3"><label class="c-fs-xs c-fw-medium c-mb-1 c-block c-text-tertiary">Image URL <span class="c-text-tertiary">(optional)</span></label>';
    html += '<input class="input-field c-w-full c-bg-glass c-border c-text-primary c-fs-sm" id="modal-post-media" type="url" placeholder="https://..." style="padding:10px 14px;border-radius:12px;outline:none"></div>';
    html += '<div class="c-mb-3"><label class="c-fs-xs c-fw-medium c-mb-1 c-block c-text-tertiary">Hashtags <span class="c-text-tertiary">(comma separated)</span></label>';
    html += '<input class="input-field c-w-full c-bg-glass c-border c-text-primary c-fs-sm" id="modal-post-hashtags" type="text" placeholder="e.g. math, studytips" style="padding:10px 14px;border-radius:12px;outline:none"></div>';
    html += '</div>';
    html += '<div class="modal-footer c-flex c-border-top" style="justify-content:flex-end;gap:12px;padding:16px 24px"><button class="btn btn-secondary c-radius-full c-fs-sm c-pointer" id="modal-cancel-btn" style="padding:10px 24px">Cancel</button>';
    html += '<button class="btn btn-primary c-radius-full c-fs-sm c-fw-semibold c-pointer c-border-0" id="modal-submit-btn" style="padding:10px 28px">Post</button></div>';
    html += '</div></div>';
    return html;
  }

  function openModal() {
    var overlay = document.getElementById('create-post-modal-overlay');
    if (overlay) { overlay.classList.remove('c-hidden'); overlay.classList.add('c-flex'); }
    var btns = document.querySelectorAll('.modal-type-btn');
    modalPostType = 'tip';
    for (var i = 0; i < btns.length; i++) {
      btns[i].classList.remove('c-type-active', 'c-type-inactive');
      btns[i].classList.add('c-type-inactive');
      if (btns[i].dataset.type === 'tip') {
        btns[i].classList.remove('c-type-inactive');
        btns[i].classList.add('c-type-active');
      }
    }
  }

  function closeModal() {
    var overlay = document.getElementById('create-post-modal-overlay');
    if (overlay) { overlay.classList.remove('c-flex'); overlay.classList.add('c-hidden'); }
    var textarea = document.getElementById('modal-post-content');
    if (textarea) textarea.value = '';
    var media = document.getElementById('modal-post-media');
    if (media) media.value = '';
    var subject = document.getElementById('modal-post-subject');
    if (subject) subject.value = '';
    var hashtags = document.getElementById('modal-post-hashtags');
    if (hashtags) hashtags.value = '';
  }

  function getFilteredPosts() {
    var filtered = feedPosts;
    if (currentFilter === 'my-posts') {
      var user = store.get('user');
      var userName = user ? user.name : '';
      filtered = filtered.filter(function(p) { return p.author === userName || p._isCreated; });
    } else if (currentFilter === 'bookmarks') {
      filtered = filtered.filter(function(p) { return p.bookmarked; });
    } else if (currentFilter === 'liked') {
      filtered = filtered.filter(function(p) { return p.isLiked; });
    } else if (currentFilter === 'trending') {
      filtered = filtered.filter(function(p) { return (p.likes || 0) >= 50; });
    } else if (currentFilter !== 'all') {
      if (currentFilter === 'following') {
        var followingData = store.get('feedFollowing') || [];
        var followingNames = {};
        for (var i = 0; i < suggestedUsers.length; i++) {
          if (followingData.indexOf(suggestedUsers[i].id) !== -1) {
            followingNames[suggestedUsers[i].name.toLowerCase()] = true;
          }
        }
        filtered = filtered.filter(function(p) {
          return followingNames[p.author.toLowerCase()];
        });
      } else {
        filtered = filtered.filter(function(p) { return p.type === currentFilter; });
      }
    }
    if (topicFilter) {
      var term = topicFilter.replace('#', '').toLowerCase();
      filtered = filtered.filter(function(p) {
        var content = (p.content || '').toLowerCase();
        var hashtagsArr = (p.hashtags || []).join(' ').toLowerCase();
        return content.indexOf(term) !== -1 || hashtagsArr.indexOf(term) !== -1;
      });
    }
    var sorted = filtered.slice();
    if (sortOrder === 'popular') {
      sorted.sort(function(a, b) { return (b.likes || 0) - (a.likes || 0); });
    } else {
      sorted.sort(function(a, b) { return new Date(b.createdAt) - new Date(a.createdAt); });
    }
    return sorted;
  }

  function renderFeedPosts() {
    var filtered = getFilteredPosts();
    var toShow = filtered.slice(0, postsLoaded);
    if (toShow.length === 0) {
      return '<div class="empty-state"><div class="c-fs-xl c-mb-3" style="font-size:3rem">📭</div><div class="text-lg font-semibold mb-2">No posts yet</div><div class="text-sm text-tertiary">Be the first to share something with the community!</div></div>';
    }
    var html = '';
    for (var i = 0; i < toShow.length; i++) {
      html += renderSinglePost(toShow[i], i);
    }
    return html;
  }

  function renderSinglePost(p, idx) {
    var meta = postTypeMeta[p.type] || { label: 'Update', icon: '📌', color: '#3b82f6' };
    var user = store.get('user');
    var badge = getUserBadge(p.author);
    var badgeColor = getBadgeColor(badge);
    var isPinned = p.pinned || false;
    var isTrending = (p.likes || 0) >= 80 && !isPinned;

    var html = '<div class="glass-card feed-post mb-4" data-id="' + p.id + '" style="padding:0;overflow:hidden;border-radius:16px;transition:all 0.2s">';

    if (isPinned) {
      html += '<div class="c-flex c-flex-gap-1 c-fw-semibold" style="padding:6px 20px;background:var(--gradient-glass);font-size:0.7rem;color:var(--accent-blue)">📌 Pinned Post</div>';
    } else if (isTrending) {
      html += '<div class="c-flex c-flex-gap-1 c-fw-semibold" style="padding:6px 20px;background:var(--gradient-glass);font-size:0.7rem;color:var(--accent-red)">🔥 Trending</div>';
    }

    html += '<div style="padding:16px 20px 12px">';
    html += '<div class="c-flex c-flex-gap-3 items-start">';
    html += '<div class="avatar avatar-sm c-flex-shrink-0 c-transition-fast" style="background:' + utils.getGradient(idx % 6) + ';width:44px;height:44px;font-size:0.85rem">' + utils.getInitials(p.author) + '</div>';
    html += '<div class="c-flex-1 c-min-width-0">';
    html += '<div class="c-flex c-flex-gap-2 c-flex-wrap">';
    html += '<span class="c-fw-semibold c-fs-sm hover-text-primary c-pointer c-text-primary">' + utils.sanitizeHTML(p.author) + '</span>';
    if (p.author === (user ? user.name : '')) {
      html += '<span class="c-fs-xs c-fw-medium c-text-accent">(You)</span>';
    }
    html += '<span class="feed-badge c-badge" style="background:' + badgeColor + '20;color:' + badgeColor + '">' + badge + '</span>';
    html += '<span class="text-xs text-tertiary">· ' + utils.formatRelativeTime(p.createdAt) + '</span>';
    html += '</div>';

    if (p.type && postTypeMeta[p.type]) {
      html += '<div class="c-flex c-flex-gap-2 c-mt-1"><span class="feed-type-badge c-badge" style="background:' + postTypeMeta[p.type].color + '20;color:' + postTypeMeta[p.type].color + '">' + postTypeMeta[p.type].icon + ' ' + postTypeMeta[p.type].label + '</span>';
      if (p.subject) {
        html += '<span class="c-fs-xs c-text-tertiary">📖 ' + p.subject + '</span>';
      }
      html += '</div>';
    }

    html += '<div class="c-mt-2 c-fs-sm c-text-primary" style="white-space:pre-wrap;line-height:1.6">' + utils.sanitizeHTML(p.content) + '</div>';

    if (p.hashtags && p.hashtags.length > 0) {
      html += '<div class="c-flex c-flex-wrap c-flex-gap-1 c-mt-2">';
      for (var h = 0; h < p.hashtags.length; h++) {
        html += '<span class="feed-hashtag c-pointer c-fs-sm c-text-accent c-fw-medium c-transition-fast" data-tag="' + p.hashtags[h] + '">#' + p.hashtags[h] + '</span>';
      }
      html += '</div>';
    }

    if (p.mediaUrl) {
      html += '<div class="c-mt-3 c-overflow-hidden c-radius-md c-border">';
      if (p.mediaUrl.match(/\.(jpg|jpeg|png|gif|webp|svg)$/i)) {
        html += '<img src="' + p.mediaUrl + '" alt="Post media" style="max-width:100%;display:block;max-height:400px;object-fit:cover;width:100%;border-radius:12px" onerror="this.style.display=\'none\'">';
      } else {
        html += '<div class="c-p-4 c-flex c-flex-gap-3 c-bg-glass"><span class="c-fs-xl">📄</span><div><div class="c-fs-sm c-fw-medium">Attachment</div><div class="c-fs-xs c-text-tertiary">Click to open</div></div></div>';
      }
      html += '</div>';
    }

    if (p.type === 'poll' && p.pollOptions) {
      html += '<div class="c-mt-3 c-flex c-flex-col c-flex-gap-2">';
      var totalVotes = 0;
      for (var o = 0; o < p.pollOptions.length; o++) {
        totalVotes += p.pollOptions[o].votes || 0;
      }
      for (var o = 0; o < p.pollOptions.length; o++) {
        var opt = p.pollOptions[o];
        var pct = totalVotes > 0 ? Math.round((opt.votes || 0) / totalVotes * 100) : 0;
        html += '<div class="feed-poll-option c-pointer c-poll-option" data-poll-id="' + p.id + '" data-opt-idx="' + o + '">';
        html += '<div class="c-absolute c-z-1 c-transition-fast" style="top:0;left:0;bottom:0;width:' + pct + '%;background:' + (p.pollVotedOption === o ? 'var(--accent-blue)' : 'var(--bg-glass-strong)') + ';opacity:0.2"></div>';
        html += '<div class="c-relative c-z-1 c-flex-between items-center">';
        html += '<span class="c-fs-sm c-fw-medium">' + opt.text + '</span>';
        html += '<span class="c-fs-sm c-text-secondary c-fw-semibold">' + pct + '%</span>';
        html += '</div></div>';
      }
      html += '<div class="c-fs-xs c-text-tertiary c-text-right">' + totalVotes + ' votes</div>';
      html += '</div>';
    }

    html += '</div></div>';

    html += '<div class="c-feed-post-actions">';

    html += '<span class="c-flex c-flex-gap-1 c-pointer feed-action-icon like-btn-feed c-post-action" data-id="' + p.id + '" style="color:' + (p.isLiked ? 'var(--accent-red)' : 'var(--text-tertiary)') + '">';
    html += '<span class="c-fs-base">' + (p.isLiked ? '❤️' : '🤍') + '</span>';
    html += '<span class="like-count-feed" data-id="' + p.id + '">' + (p.likes || 0) + '</span></span>';

    html += '<span class="c-flex c-flex-gap-1 c-pointer feed-action-icon comment-toggle c-post-action" data-id="' + p.id + '" style="color:var(--text-tertiary)">';
    html += '<span class="c-fs-base">💬</span>';
    html += '<span>' + (p.comments ? p.comments.length : 0) + '</span></span>';

    html += '<span class="c-flex c-flex-gap-1 c-pointer feed-action-icon share-btn c-post-action" data-id="' + p.id + '" style="color:var(--text-tertiary)">';
    html += '<span class="c-fs-base">🔗</span><span class="hidden-sm c-fs-xs">Share</span></span>';

    html += '<span class="c-flex c-flex-gap-1 c-pointer feed-action-icon bookmark-btn c-post-action c-ml-auto" data-id="' + p.id + '" style="color:' + (p.bookmarked ? 'var(--accent-yellow)' : 'var(--text-tertiary)') + '">';
    html += '<span class="c-fs-base">' + (p.bookmarked ? '🔖' : '🔖') + '</span></span>';

    html += '</div>';

    var commentsExpanded = p.expanded;
    if (commentsExpanded) {
      html += '<div class="c-feed-comment-block">';
      html += '<div class="c-flex c-flex-col c-flex-gap-3 c-mb-3" id="comments-' + p.id + '">';
      if (p.comments && p.comments.length > 0) {
        for (var c = 0; c < p.comments.length; c++) {
          var cm = p.comments[c];
          html += '<div class="c-flex c-flex-gap-2 items-start">';
          html += '<div class="avatar avatar-sm c-flex-shrink-0" style="background:' + utils.getGradient(c) + ';width:28px;height:28px;font-size:0.55rem">' + utils.getInitials(cm.author) + '</div>';
          html += '<div class="c-flex-1 c-bg-card c-min-width-0" style="padding:8px 12px;border-radius:12px">';
          html += '<div class="c-flex c-flex-gap-2 c-mb-1"><span class="c-fs-xs c-fw-semibold c-text-primary">' + cm.author + '</span><span class="c-fs-xs c-text-tertiary">' + utils.formatRelativeTime(cm.createdAt) + '</span></div>';
          html += '<div class="c-fs-sm c-text-primary">' + utils.sanitizeHTML(cm.text) + '</div>';
          html += '<div class="c-flex c-flex-gap-3 c-mt-1"><span class="c-fs-xs c-text-tertiary c-pointer hover-text-primary reply-comment-btn c-fw-medium" data-post-id="' + p.id + '" data-author="' + cm.author + '">Reply</span><span class="c-fs-xs c-text-tertiary c-pointer hover-text-primary">❤️ Like</span></div>';
          if (cm.replies && cm.replies.length > 0) {
            for (var r = 0; r < cm.replies.length; r++) {
              var rp = cm.replies[r];
              html += '<div class="c-flex c-flex-gap-2 c-mt-2 items-start" style="margin-left:16px">';
              html += '<div class="avatar avatar-sm c-flex-shrink-0" style="background:' + utils.getGradient(r + 10) + ';width:22px;height:22px;font-size:0.5rem">' + utils.getInitials(rp.author) + '</div>';
              html += '<div class="c-flex-1 c-bg-glass c-min-width-0" style="padding:6px 10px;border-radius:8px">';
              html += '<div class="c-flex c-flex-gap-2 c-mb-1"><span class="c-fs-xs c-fw-semibold">' + rp.author + '</span><span class="c-fs-xs c-text-tertiary">' + utils.formatRelativeTime(rp.createdAt) + '</span></div>';
              html += '<div class="c-fs-sm">' + utils.sanitizeHTML(rp.text) + '</div>';
              html += '</div></div>';
            }
          }
          html += '</div></div>';
        }
      }
      html += '</div>';
      html += '<div class="c-flex c-flex-gap-2 items-center">';
      html += '<div class="avatar avatar-sm c-flex-shrink-0" style="background:' + utils.getGradient(0) + ';width:28px;height:28px;font-size:0.55rem">' + (user ? utils.getInitials(user.name) : '?') + '</div>';
      html += '<div class="c-flex-1 c-flex c-flex-gap-2"><input type="text" class="comment-input c-comment-input" data-id="' + p.id + '" placeholder="Write a reply...">';
      html += '<button class="comment-submit c-comment-submit" data-id="' + p.id + '">Post</button></div>';
      html += '</div>';
      html += '</div>';
    }

    html += '</div>';
    return html;
  }

  function refreshFeed() {
    var feedContainer = document.getElementById('feed-posts');
    var loadMoreContainer = document.getElementById('load-more-container');
    if (feedContainer) feedContainer.innerHTML = renderFeedPosts();
    if (loadMoreContainer) {
      var filtered = getFilteredPosts();
      if (postsLoaded < filtered.length) {
        loadMoreContainer.innerHTML = '<button class="btn btn-secondary c-radius-full" id="btn-load-more" style="padding:10px 32px">Load More Posts</button>';
      } else if (filtered.length > 0) {
        loadMoreContainer.innerHTML = '<div class="text-sm text-tertiary">You\'ve seen all posts</div>';
      } else {
        loadMoreContainer.innerHTML = '';
      }
    }
    bindEvents();
  }

  function bindEvents() {
    var tabEls = document.querySelectorAll('.feed-tab');
    for (var i = 0; i < tabEls.length; i++) {
      tabEls[i].addEventListener('click', function() {
        currentFilter = this.dataset.filter;
        topicFilter = '';
        postsLoaded = 10;
        var tabs = document.querySelectorAll('.feed-tab');
        for (var t = 0; t < tabs.length; t++) {
          tabs[t].className = tabs[t].className.replace(/ c-feed-tab-active|c-feed-tab-inactive/g, '') + ' c-feed-tab c-feed-tab-inactive';
        }
        this.className = this.className.replace(/ c-feed-tab-active|c-feed-tab-inactive/g, '') + ' c-feed-tab c-feed-tab-active';
        refreshFeed();
      });
    }

    var navLinks = document.querySelectorAll('.feed-nav-link');
    for (var i = 0; i < navLinks.length; i++) {
      navLinks[i].addEventListener('click', function() {
        var links = document.querySelectorAll('.feed-nav-link');
        for (var l = 0; l < links.length; l++) {
          links[l].style.color = 'var(--text-secondary)';
          links[l].style.fontWeight = '500';
        }
        this.style.color = 'var(--text-primary)';
        this.style.fontWeight = '600';
        currentFilter = this.dataset.filter;
        topicFilter = '';
        postsLoaded = 10;
        var tabs = document.querySelectorAll('.feed-tab');
        for (var t = 0; t < tabs.length; t++) {
          tabs[t].className = tabs[t].className.replace(/ c-feed-tab-active|c-feed-tab-inactive/g, '') + ' c-feed-tab c-feed-tab-inactive';
          if (tabs[t].dataset.filter === currentFilter) {
            tabs[t].className = tabs[t].className.replace(/ c-feed-tab-active|c-feed-tab-inactive/g, '') + ' c-feed-tab c-feed-tab-active';
          }
        }
        if (currentFilter === 'bookmarks' || currentFilter === 'liked') {
          var feedContainer = document.getElementById('feed-posts');
          if (feedContainer) feedContainer.innerHTML = renderFeedPosts();
          var loadMoreContainer = document.getElementById('load-more-container');
          if (loadMoreContainer) {
            var filtered = getFilteredPosts();
            if (postsLoaded < filtered.length) {
              loadMoreContainer.innerHTML = '<button class="btn btn-secondary c-radius-full" id="btn-load-more" style="padding:10px 32px">Load More Posts</button>';
            } else if (filtered.length === 0) {
              loadMoreContainer.innerHTML = '';
            } else {
              loadMoreContainer.innerHTML = '<div class="text-sm text-tertiary">You\'ve seen all posts</div>';
            }
          }
          bindEvents();
        } else {
          refreshFeed();
        }
      });
    }

    var shareLearning = document.getElementById('btn-share-learning');
    if (shareLearning) {
      shareLearning.addEventListener('click', function() {
        openModal();
      });
    }

    var feedActionBtns = document.querySelectorAll('.feed-action-btn');
    for (var i = 0; i < feedActionBtns.length; i++) {
      feedActionBtns[i].addEventListener('click', function() {
        openModal();
      });
    }

    var modalCloseBtn = document.getElementById('modal-close-btn');
    if (modalCloseBtn) modalCloseBtn.addEventListener('click', closeModal);
    var modalCancelBtn = document.getElementById('modal-cancel-btn');
    if (modalCancelBtn) modalCancelBtn.addEventListener('click', closeModal);
    var modalOverlay = document.getElementById('create-post-modal-overlay');
    if (modalOverlay) {
      modalOverlay.addEventListener('click', function(e) {
        if (e.target === modalOverlay) closeModal();
      });
    }

    var modalTypeBtns = document.querySelectorAll('.modal-type-btn');
    for (var i = 0; i < modalTypeBtns.length; i++) {
      modalTypeBtns[i].addEventListener('click', function() {
        var btns = document.querySelectorAll('.modal-type-btn');
        for (var b = 0; b < btns.length; b++) {
          btns[b].className = btns[b].className.replace(/ c-type-active|c-type-inactive/g, '') + ' c-type-btn c-type-inactive';
        }
        this.className = this.className.replace(/ c-type-active|c-type-inactive/g, '') + ' c-type-btn c-type-active';
        modalPostType = this.dataset.type;
      });
    }

    var modalSubmit = document.getElementById('modal-submit-btn');
    if (modalSubmit) {
      modalSubmit.addEventListener('click', function() {
        var textarea = document.getElementById('modal-post-content');
        var media = document.getElementById('modal-post-media');
        var subject = document.getElementById('modal-post-subject');
        var hashtagsInput = document.getElementById('modal-post-hashtags');
        if (!textarea || !textarea.value.trim()) return;
        var user = store.get('user');
        var hashArr = [];
        if (hashtagsInput && hashtagsInput.value.trim()) {
          hashArr = hashtagsInput.value.split(',').map(function(s) { return s.trim(); }).filter(function(s) { return s.length > 0; });
        }
        var newPost = {
          id: 'fp_' + Date.now(),
          content: textarea.value.trim(),
          type: modalPostType,
          author: user ? user.name : 'Anonymous',
          authorAvatar: user ? user.avatar : null,
          likes: 0,
          comments: [],
          shares: 0,
          createdAt: new Date().toISOString(),
          isLiked: false,
          bookmarked: false,
          expanded: false,
          hashtags: hashArr,
          pinned: false,
          _isCreated: true
        };
        if (media && media.value.trim()) newPost.mediaUrl = media.value.trim();
        if (subject && subject.value) newPost.subject = subject.value;
        feedPosts.unshift(newPost);
        persistCreatedPosts();
        closeModal();
        refreshFeed();
        showToast('Post shared successfully!');
      });
    }

    var sortLatest = document.getElementById('sort-latest');
    if (sortLatest) {
      sortLatest.addEventListener('click', function() {
        sortOrder = 'latest';
        var btns = document.querySelectorAll('.sort-btn');
        for (var s = 0; s < btns.length; s++) {
          btns[s].className = btns[s].className.replace(/ c-sort-active|c-sort-inactive/g, '') + ' c-sort-btn c-sort-inactive';
        }
        this.className = this.className.replace(/ c-sort-active|c-sort-inactive/g, '') + ' c-sort-btn c-sort-active';
        refreshFeed();
      });
    }

    var sortPopular = document.getElementById('sort-popular');
    if (sortPopular) {
      sortPopular.addEventListener('click', function() {
        sortOrder = 'popular';
        var btns = document.querySelectorAll('.sort-btn');
        for (var s = 0; s < btns.length; s++) {
          btns[s].className = btns[s].className.replace(/ c-sort-active|c-sort-inactive/g, '') + ' c-sort-btn c-sort-inactive';
        }
        this.className = this.className.replace(/ c-sort-active|c-sort-inactive/g, '') + ' c-sort-btn c-sort-active';
        refreshFeed();
      });
    }

    var loadMore = document.getElementById('btn-load-more');
    if (loadMore) {
      loadMore.addEventListener('click', function() {
        postsLoaded += postsPerLoad;
        refreshFeed();
      });
    }

    var likeBtns = document.querySelectorAll('.like-btn-feed');
    for (var i = 0; i < likeBtns.length; i++) {
      likeBtns[i].addEventListener('click', function() {
        var id = this.dataset.id;
        var post = findPost(id);
        if (!post) return;
        post.isLiked = !post.isLiked;
        post.likes = post.isLiked ? (post.likes || 0) + 1 : Math.max(0, (post.likes || 0) - 1);
        this.style.color = post.isLiked ? 'var(--accent-red)' : 'var(--text-tertiary)';
        var icon = this.querySelector('span:first-child');
        if (icon) icon.textContent = post.isLiked ? '❤️' : '🤍';
        var countEl = document.querySelector('.like-count-feed[data-id="' + id + '"]');
        if (countEl) countEl.textContent = post.likes;
        persistLikes();
      });
    }

    var commentToggles = document.querySelectorAll('.comment-toggle');
    for (var i = 0; i < commentToggles.length; i++) {
      commentToggles[i].addEventListener('click', function() {
        var id = this.dataset.id;
        var post = findPost(id);
        if (!post) return;
        post.expanded = !post.expanded;
        refreshFeed();
        if (post.expanded) {
          var input = document.querySelector('.comment-input[data-id="' + id + '"]');
          if (input) setTimeout(function() { input.focus(); }, 100);
        }
      });
    }

    var commentSubmits = document.querySelectorAll('.comment-submit');
    for (var i = 0; i < commentSubmits.length; i++) {
      commentSubmits[i].addEventListener('click', function() {
        var id = this.dataset.id;
        var input = document.querySelector('.comment-input[data-id="' + id + '"]');
        if (!input || !input.value.trim()) return;
        var post = findPost(id);
        if (!post) return;
        var user = store.get('user');
        var newComment = { author: user ? user.name : 'Anonymous', text: input.value.trim(), createdAt: new Date().toISOString(), replies: [] };
        post.comments = post.comments || [];
        post.comments.push(newComment);
        var commentsData = store.get('feedComments') || {};
        if (!commentsData[id]) commentsData[id] = [];
        commentsData[id].push(newComment);
        store.set('feedComments', commentsData);
        input.value = '';
        refreshFeed();
      });
    }

    var commentInputs = document.querySelectorAll('.comment-input');
    for (var i = 0; i < commentInputs.length; i++) {
      (function(el) {
        el.addEventListener('keydown', function(e) {
          if (e.key === 'Enter') {
            e.preventDefault();
            var id = el.dataset.id;
            var btn = document.querySelector('.comment-submit[data-id="' + id + '"]');
            if (btn) btn.click();
          }
        });
      })(commentInputs[i]);
    }

    var replyBtns = document.querySelectorAll('.reply-comment-btn');
    for (var i = 0; i < replyBtns.length; i++) {
      replyBtns[i].addEventListener('click', function() {
        var postId = this.dataset.postId;
        var author = this.dataset.author;
        var input = document.querySelector('.comment-input[data-id="' + postId + '"]');
        if (input) {
          input.value = '@' + author + ' ';
          input.focus();
        }
      });
    }

    var shareBtns = document.querySelectorAll('.share-btn');
    for (var i = 0; i < shareBtns.length; i++) {
      shareBtns[i].addEventListener('click', function() {
        var id = this.dataset.id;
        var post = findPost(id);
        if (!post) return;
        if (navigator.clipboard && navigator.clipboard.writeText) {
          navigator.clipboard.writeText(post.content).then(function() {
            showToast('Link copied to clipboard!');
          }).catch(function() {
            showToast('Link copied to clipboard!');
          });
        } else {
          showToast('Link copied to clipboard!');
        }
      });
    }

    var bookmarkBtns = document.querySelectorAll('.bookmark-btn');
    for (var i = 0; i < bookmarkBtns.length; i++) {
      bookmarkBtns[i].addEventListener('click', function() {
        var id = this.dataset.id;
        var post = findPost(id);
        if (!post) return;
        post.bookmarked = !post.bookmarked;
        this.style.color = post.bookmarked ? 'var(--accent-yellow)' : 'var(--text-tertiary)';
        persistBookmarks();
      });
    }

    var trending = document.querySelectorAll('.trending-topic');
    for (var i = 0; i < trending.length; i++) {
      trending[i].addEventListener('click', function() {
        topicFilter = this.dataset.topic;
        postsLoaded = 10;
        refreshFeed();
      });
    }

    var clearTopic = document.getElementById('clear-topic-filter');
    if (clearTopic) {
      clearTopic.addEventListener('click', function() {
        topicFilter = '';
        postsLoaded = 10;
        refreshFeed();
      });
    }

    var followBtns = document.querySelectorAll('.feed-follow-btn');
    for (var i = 0; i < followBtns.length; i++) {
      followBtns[i].addEventListener('click', function() {
        var id = this.dataset.id;
        var following = store.get('feedFollowing') || [];
        var idx = following.indexOf(id);
        if (idx === -1) {
          following.push(id);
          this.textContent = 'Following';
          this.className = this.className.replace(/ c-follow-not|c-follow-ing/g, '') + ' c-follow-btn c-follow-ing';
          this.classList.add('following');
        } else {
          following.splice(idx, 1);
          this.textContent = '+ Follow';
          this.className = this.className.replace(/ c-follow-not|c-follow-ing/g, '') + ' c-follow-btn c-follow-not';
          this.classList.remove('following');
        }
        store.set('feedFollowing', following);
      });
    }

    var hashtagEls = document.querySelectorAll('.feed-hashtag');
    for (var i = 0; i < hashtagEls.length; i++) {
      hashtagEls[i].addEventListener('click', function() {
        topicFilter = '#' + this.dataset.tag;
        postsLoaded = 10;
        refreshFeed();
      });
    }

    var pollOptions = document.querySelectorAll('.feed-poll-option');
    for (var i = 0; i < pollOptions.length; i++) {
      pollOptions[i].addEventListener('click', function() {
        var pollId = this.dataset.pollId;
        var optIdx = parseInt(this.dataset.optIdx, 10);
        var post = findPost(pollId);
        if (!post || !post.pollOptions) return;
        post.pollVotedOption = optIdx;
        post.pollOptions[optIdx].votes = (post.pollOptions[optIdx].votes || 0) + 1;
        refreshFeed();
      });
    }
  }

  function findPost(id) {
    for (var i = 0; i < feedPosts.length; i++) {
      if (feedPosts[i].id === id) return feedPosts[i];
    }
    return null;
  }

  var fs = document.createElement('style');
  fs.textContent =
    '@media (max-width:992px){.c-feed-grid{grid-template-columns:1fr 300px}}' +
    '@media (max-width:768px){.c-feed-grid{grid-template-columns:1fr}.c-feed-sidebar{display:none}}';
  document.head.appendChild(fs);

  init();
};
