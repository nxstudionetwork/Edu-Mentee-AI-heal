window.renderPage.profile = function(params) {
  var store = window.Store;
  var utils = window.Utils;
  var api = window.API;
  var mc = document.getElementById('main-content');
  if (!mc) return;

  function getTypeIcon(type) {
    var icons = { quiz: '📝', achievement: '🏆', exam: '📋', resource: '📄', course: '📚', community: '💬', announcement: '📢', meeting: '🎥', system: '⚙️' };
    return icons[type] || '📌';
  }

  var rawUser = store.get('user') || {};
  var defaults = {
    name: 'Student',
    email: 'student@edumentee.com',
    phone: '-',
    bio: 'A passionate learner exploring new horizons every day.',
    school: 'Not enrolled',
    board: 'CBSE',
    class: 6,
    stream: '',
    city: 'New Delhi',
    state: 'Delhi',
    country: 'India',
    avatarColor: 'var(--gradient-primary)',
    joinDate: new Date().toISOString().split('T')[0],
    xp: 0,
    coins: 0
  };
  var user = {};
  for (var dk in defaults) {
    if (defaults.hasOwnProperty(dk)) {
      user[dk] = (rawUser[dk] !== undefined && rawUser[dk] !== null && rawUser[dk] !== '') ? rawUser[dk] : defaults[dk];
    }
  }
  for (var rk in rawUser) {
    if (rawUser.hasOwnProperty(rk) && !user.hasOwnProperty(rk)) {
      user[rk] = rawUser[rk];
    }
  }

  var xp = user.xp || 0;
  var coins = user.coins || 0;
  var level = utils.calculateLevel(xp);
  var xpForCurrent = Math.pow(level, 2) * 100;
  var xpForNext = Math.pow(level + 1, 2) * 100;
  var xpInLevel = xp - xpForCurrent;
  var xpNeeded = xpForNext - xpForCurrent;
  var progressPct = Math.min(100, Math.round((xpInLevel / xpNeeded) * 100));

  var achievements = store.get('achievements') || [];
  var unlockedCount = 0;
  for (var ai = 0; ai < achievements.length; ai++) {
    if (achievements[ai].unlocked) unlockedCount++;
  }

  var certificates = store.get('certificates') || [];
  if (!certificates || certificates.length === 0) {
    certificates = [
      { id: 'cert1', course: 'Mathematics Basics', date: '2026-03-15', grade: 'A+', issuer: 'EduMentee' },
      { id: 'cert2', course: 'Science Fundamentals', date: '2026-02-20', grade: 'A', issuer: 'EduMentee' },
      { id: 'cert3', course: 'English Language Proficiency', date: '2026-04-10', grade: 'A', issuer: 'EduMentee' },
      { id: 'cert4', course: 'Computer Science Essentials', date: '2026-01-05', grade: 'B+', issuer: 'EduMentee' }
    ];
  }

  var activityLog = store.get('activityLog') || [];
  if (activityLog.length === 0) {
    activityLog = [
      { id: 'act1', type: 'quiz', title: 'Completed Mathematics Quiz', desc: 'Scored 90% on Algebra Basics', time: new Date(Date.now() - 2 * 3600000).toISOString() },
      { id: 'act2', type: 'achievement', title: 'Earned Badge: Fast Learner', desc: 'Completed 5 lessons in a day', time: new Date(Date.now() - 24 * 3600000).toISOString() },
      { id: 'act3', type: 'exam', title: 'Mock Test - Science', desc: 'Passed with 85/100 marks', time: new Date(Date.now() - 3 * 86400000).toISOString() },
      { id: 'act4', type: 'resource', title: 'Downloaded Physics Notes', desc: 'Chapter 5: Work and Energy', time: new Date(Date.now() - 5 * 86400000).toISOString() },
      { id: 'act5', type: 'course', title: 'Started Science Bundle', desc: 'Enrolled in Physics, Chemistry, Biology', time: new Date(Date.now() - 7 * 86400000).toISOString() }
    ];
  }

  var bookmarks = store.get('bookmarks') || [];
  var bookmarkResources = 0;
  var bookmarkVideos = 0;
  var bookmarkCommunity = 0;
  for (var bi = 0; bi < bookmarks.length; bi++) {
    if (bookmarks[bi].type === 'resource') bookmarkResources++;
    else if (bookmarks[bi].type === 'video') bookmarkVideos++;
    else if (bookmarks[bi].type === 'community') bookmarkCommunity++;
  }
  var totalBookmarks = bookmarkResources + bookmarkVideos + bookmarkCommunity;

  var downloadsData = store.get('downloads') || [];
  var downloadsCount = downloadsData.length;
  var enrolledData = store.get('enrolledClasses') || [];
  var enrolledCount = enrolledData.length;
  var streak = store.get('streak') || Math.floor(Math.random() * 15) + 1;

  var initials = utils.getInitials(user.name);
  var streamDisplay = user.stream ? user.stream.charAt(0).toUpperCase() + user.stream.slice(1) + ' - ' : '';
  var joinDateFormatted = utils.formatDate(user.joinDate, 'mmmm yyyy') || user.joinDate || 'January 2026';

  function closeDrawer(el) {
    if (!el) return;
    var panel = el.querySelector('.drawer-panel');
    if (panel) panel.style.transform = 'translateX(100%)';
    setTimeout(function() { if (el.parentNode) el.parentNode.removeChild(el); }, 300);
  }

  function showEditDrawer() {
    var existing = document.querySelector('.profile-edit-drawer');
    if (existing) closeDrawer(existing);

    var classes = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
    var streams = ['science', 'commerce', 'arts'];
    var boards = ['CBSE', 'ICSE', 'State Board'];
    var showStream = user.class >= 11;

    var overlay = document.createElement('div');
    overlay.className = 'profile-edit-drawer c-fixed c-z-1000 c-flex';
    overlay.style.inset = '0';
    overlay.style.justifyContent = 'flex-end';
    overlay.style.background = 'rgba(0,0,0,0.4)';
    overlay.addEventListener('click', function(e) {
      if (e.target === overlay) closeDrawer(overlay);
    });

    var classOpts = '';
    for (var ci = 0; ci < classes.length; ci++) {
      var sel = (user.class === classes[ci]) ? ' selected' : '';
      classOpts += '<option value="' + classes[ci] + '"' + sel + '>' + classes[ci] + '</option>';
    }
    var streamOpts = '';
    for (var si = 0; si < streams.length; si++) {
      var ssel = (user.stream === streams[si]) ? ' selected' : '';
      streamOpts += '<option value="' + streams[si] + '"' + ssel + '>' + streams[si].charAt(0).toUpperCase() + streams[si].slice(1) + '</option>';
    }
    var boardOpts = '';
    for (var bi2 = 0; bi2 < boards.length; bi2++) {
      var bsel = (user.board === boards[bi2]) ? ' selected' : '';
      boardOpts += '<option value="' + boards[bi2] + '"' + bsel + '>' + boards[bi2] + '</option>';
    }

    var panelHtml = '';
    panelHtml += '<div class="drawer-panel" style="width:440px;max-width:92vw;background:var(--bg-primary);height:100%;overflow-y:auto;transform:translateX(100%);transition:transform 0.3s ease;box-shadow:-4px 0 24px rgba(0,0,0,0.2)">';
    panelHtml += '<div class="flex items-center justify-between p-4" style="border-bottom:1px solid var(--border-color)">';
    panelHtml += '<h3 style="font-size:1.1rem;font-weight:600">Edit Profile</h3>';
    panelHtml += '<button class="btn btn-icon" id="drawer-close-btn" style="width:36px;height:36px;border:none;background:var(--bg-glass);border-radius:var(--radius-full);cursor:pointer;font-size:1.2rem">\u2715</button>';
    panelHtml += '</div>';
    panelHtml += '<div class="p-4 flex flex-col" style="gap:1rem">';

    panelHtml += '<div class="flex items-center gap-4 mb-2">';
    panelHtml += '<div class="avatar-xl" id="edit-avatar-preview" style="background:' + user.avatarColor + ';width:72px;height:72px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:1.5rem;font-weight:700;color:white;cursor:pointer">' + initials + '</div>';
    panelHtml += '<div><button class="btn btn-sm btn-secondary" id="edit-avatar-btn">Change Photo</button><div class="text-xs text-secondary mt-1">Click to upload (mock)</div></div>';
    panelHtml += '</div>';

    panelHtml += '<div class="input-group"><label class="input-label">Full Name</label><input type="text" class="input-field" id="edit-name" value="' + utils.sanitizeHTML(user.name) + '"></div>';
    panelHtml += '<div class="input-group"><label class="input-label">Email</label><input type="email" class="input-field" id="edit-email" value="' + utils.sanitizeHTML(user.email) + '"></div>';
    panelHtml += '<div class="input-group"><label class="input-label">Phone</label><input type="tel" class="input-field" id="edit-phone" value="' + utils.sanitizeHTML(user.phone === '-' ? '' : user.phone) + '"></div>';
    panelHtml += '<div class="input-group"><label class="input-label">Bio</label><textarea class="input-field" id="edit-bio" rows="3" style="resize:vertical">' + utils.sanitizeHTML(user.bio) + '</textarea></div>';
    panelHtml += '<div class="input-group"><label class="input-label">School</label><input type="text" class="input-field" id="edit-school" value="' + utils.sanitizeHTML(user.school === 'Not enrolled' ? '' : user.school) + '"></div>';

    panelHtml += '<div class="grid grid-cols-2 gap-3">';
    panelHtml += '<div class="input-group"><label class="input-label">Board</label><select class="input-field" id="edit-board">' + boardOpts + '</select></div>';
    panelHtml += '<div class="input-group"><label class="input-label">Class</label><select class="input-field" id="edit-class">' + classOpts + '</select></div>';
    panelHtml += '</div>';

    panelHtml += '<div class="input-group" id="edit-stream-group" style="display:' + (showStream ? 'block' : 'none') + '">';
    panelHtml += '<label class="input-label">Stream</label><select class="input-field" id="edit-stream">' + streamOpts + '</select>';
    panelHtml += '</div>';

    panelHtml += '<div class="grid grid-cols-2 gap-3">';
    panelHtml += '<div class="input-group"><label class="input-label">City</label><input type="text" class="input-field" id="edit-city" value="' + utils.sanitizeHTML(user.city) + '"></div>';
    panelHtml += '<div class="input-group"><label class="input-label">State</label><input type="text" class="input-field" id="edit-state" value="' + utils.sanitizeHTML(user.state) + '"></div>';
    panelHtml += '</div>';

    panelHtml += '<div class="input-group"><label class="input-label">Country</label><input type="text" class="input-field" id="edit-country" value="' + utils.sanitizeHTML(user.country) + '"></div>';

    panelHtml += '<div class="flex gap-3 mt-2">';
    panelHtml += '<button class="btn btn-secondary flex-1" id="drawer-cancel-btn">Cancel</button>';
    panelHtml += '<button class="btn btn-primary flex-1" id="save-profile-btn">Save Changes</button>';
    panelHtml += '</div>';

    panelHtml += '</div></div>';

    overlay.innerHTML = panelHtml;
    document.body.appendChild(overlay);

    var panel = overlay.querySelector('.drawer-panel');
    setTimeout(function() { panel.style.transform = 'translateX(0)'; }, 10);


    document.getElementById('drawer-close-btn').addEventListener('click', function() { closeDrawer(overlay); });
    document.getElementById('drawer-cancel-btn').addEventListener('click', function() { closeDrawer(overlay); });

    document.getElementById('edit-avatar-btn').addEventListener('click', function() {
      alert('Avatar upload will be available soon. For now, you can change the avatar color in the profile.');
    });
    document.getElementById('edit-avatar-preview').addEventListener('click', function() {
      alert('Avatar upload will be available soon.');
    });

    document.getElementById('edit-class').addEventListener('change', function() {
      var grp = document.getElementById('edit-stream-group');
      if (grp) { grp.classList.toggle('c-block', parseInt(this.value) >= 11); grp.classList.toggle('c-hidden', parseInt(this.value) < 11); }
    });

    document.getElementById('save-profile-btn').addEventListener('click', function() {
      var name = document.getElementById('edit-name').value.trim();
      var email = document.getElementById('edit-email').value.trim();
      var phone = document.getElementById('edit-phone').value.trim();
      var bio = document.getElementById('edit-bio').value.trim();
      var school = document.getElementById('edit-school').value.trim();
      var board = document.getElementById('edit-board').value;
      var cls = parseInt(document.getElementById('edit-class').value);
      var stream = document.getElementById('edit-stream').value;
      var city = document.getElementById('edit-city').value.trim();
      var state = document.getElementById('edit-state').value.trim();
      var country = document.getElementById('edit-country').value.trim();

      if (!name) { alert('Name is required.'); return; }
      if (!email) { alert('Email is required.'); return; }

      var updated = {
        name: name,
        email: email,
        phone: phone || '-',
        bio: bio || defaults.bio,
        school: school || 'Not enrolled',
        board: board,
        class: cls,
        stream: cls >= 11 ? stream : '',
        city: city || 'New Delhi',
        state: state || 'Delhi',
        country: country || 'India'
      };

      var btn = document.getElementById('save-profile-btn');
      btn.textContent = 'Saving...';
      btn.disabled = true;

      api.updateProfile(updated).then(function(res) {
          if (res.success) {
            closeDrawer(overlay);
            if (window.App && window.App.refreshUserDisplay) {
              window.App.refreshUserDisplay();
            }
            window.renderPage.profile(params);
        } else {
          alert(res.error || 'Failed to save profile.');
          btn.textContent = 'Save Changes';
          btn.disabled = false;
        }
      });
    });
  }

  function renderActivityCards(items, limit) {
    if (!limit) limit = 5;
    var count = items.length < limit ? items.length : limit;
    var h = '';
    for (var i = 0; i < count; i++) {
      var a = items[i];
      h += '<div class="flex items-start gap-3" style="padding:0.6rem 0;border-bottom:1px solid var(--border-light)">';
      h += '<div class="flex items-center justify-center" style="width:32px;height:32px;font-size:0.9rem;border-radius:50%;background:var(--bg-glass);flex-shrink:0">' + getTypeIcon(a.type) + '</div>';
      h += '<div class="flex-1" style="min-width:0">';
      h += '<div class="text-sm font-medium" style="white-space:nowrap;overflow:hidden;text-overflow:ellipsis">' + utils.sanitizeHTML(a.title) + '</div>';
      h += '<div class="text-xs text-secondary">' + (a.desc ? utils.sanitizeHTML(a.desc) : '') + '</div></div>';
      h += '<div class="text-xs text-tertiary" style="flex-shrink:0;white-space:nowrap">' + utils.formatRelativeTime(a.time) + '</div>';
      h += '</div>';
    }
    if (count === 0) {
      h = '<div class="flex items-center justify-center p-4 text-sm text-secondary">No recent activity</div>';
    }
    return h;
  }

  function renderContent() {
    var h = '';

    h += '<div class="profile-page">';

    h += '<div class="profile-cover" style="background:linear-gradient(135deg, var(--accent-blue), var(--accent-purple));border-radius:var(--radius-xl);height:200px;position:relative;overflow:hidden;margin-bottom:72px">';
    h += '<div style="position:absolute;inset:0;background:url(data:image/svg+xml,%3Csvg width=\'60\' height=\'60\' viewBox=\'0 0 60 60\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'none\' fill-rule=\'evenodd\'%3E%3Cg fill=\'%23ffffff\' fill-opacity=\'0.05\'%3E%3Cpath d=\'M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z\'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E);opacity:0.3"></div>';
    h += '<div style="position:absolute;bottom:-48px;left:var(--space-6);display:flex;align-items:flex-end;gap:var(--space-4)">';
    h += '<div class="avatar-xl" style="background:' + user.avatarColor + ';width:96px;height:96px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:2rem;font-weight:700;color:white;border:4px solid var(--bg-primary);box-shadow:0 4px 16px rgba(0,0,0,0.2);flex-shrink:0">' + initials + '</div>';
    h += '<div style="margin-bottom:8px">';
    h += '<h1 class="text-xl font-bold">' + utils.sanitizeHTML(user.name) + '</h1>';
    h += '<div class="flex items-center gap-2 mt-1 flex-wrap">';
    h += '<span class="text-sm" style="color:rgba(255,255,255,0.85)">' + streamDisplay + 'Class ' + user.class + '</span>';
    h += '<span class="badge badge-blue" style="font-size:0.7rem;padding:2px 10px;border-radius:var(--radius-full)">' + user.board + '</span>';
    if (user.school && user.school !== 'Not enrolled') {
      h += '<span class="text-sm" style="color:rgba(255,255,255,0.65)">' + utils.sanitizeHTML(user.school) + '</span>';
    }
    h += '</div></div>';
    h += '<button class="btn btn-sm" id="edit-profile-btn" style="margin-bottom:8px;background:rgba(255,255,255,0.18);border:1px solid rgba(255,255,255,0.25);color:white;backdrop-filter:blur(8px);cursor:pointer">\u270F\uFE0F Edit Profile</button>';
    h += '</div></div>';

    h += '<div class="stats-grid" style="display:grid;grid-template-columns:repeat(auto-fit,minmax(120px,1fr));gap:var(--space-3);margin-bottom:var(--space-4)">';
    h += '<div class="stat-card glass-card" style="text-align:center;padding:var(--space-4)"><div class="stat-icon" style="background:rgba(59,130,246,0.15);margin:0 auto var(--space-2)">\u26A1</div><div class="stat-value text-lg font-bold">' + utils.formatNumber(xp) + '</div><div class="stat-label text-xs text-secondary">XP</div></div>';
    h += '<div class="stat-card glass-card" style="text-align:center;padding:var(--space-4)"><div class="stat-icon" style="background:rgba(245,158,11,0.15);margin:0 auto var(--space-2)">\uD83E\uDE99</div><div class="stat-value text-lg font-bold">' + utils.formatNumber(coins) + '</div><div class="stat-label text-xs text-secondary">Coins</div></div>';
    h += '<div class="stat-card glass-card" style="text-align:center;padding:var(--space-4)"><div class="stat-icon" style="background:rgba(139,92,246,0.15);margin:0 auto var(--space-2)">\uD83D\uDCCA</div><div class="stat-value text-lg font-bold">' + level + '</div><div class="stat-label text-xs text-secondary">Level</div></div>';
    h += '<div class="stat-card glass-card" style="text-align:center;padding:var(--space-4)"><div class="stat-icon" style="background:rgba(16,185,129,0.15);margin:0 auto var(--space-2)">\uD83C\uDFC6</div><div class="stat-value text-lg font-bold">' + unlockedCount + '</div><div class="stat-label text-xs text-secondary">Achievements</div></div>';
    h += '<div class="stat-card glass-card" style="text-align:center;padding:var(--space-4)"><div class="stat-icon" style="background:rgba(236,72,153,0.15);margin:0 auto var(--space-2)">\uD83D\uDCDC</div><div class="stat-value text-lg font-bold">' + certificates.length + '</div><div class="stat-label text-xs text-secondary">Certificates</div></div>';
    h += '<div class="stat-card glass-card" style="text-align:center;padding:var(--space-4)"><div class="stat-icon" style="background:rgba(251,146,60,0.15);margin:0 auto var(--space-2)">\uD83D\uDD25</div><div class="stat-value text-lg font-bold">' + streak + '</div><div class="stat-label text-xs text-secondary">Day Streak</div></div>';
    h += '<div class="stat-card glass-card" style="text-align:center;padding:var(--space-4)"><div class="stat-icon" style="background:rgba(6,182,212,0.15);margin:0 auto var(--space-2)">\uD83D\uDCDA</div><div class="stat-value text-lg font-bold">' + enrolledCount + '</div><div class="stat-label text-xs text-secondary">Enrolled</div></div>';
    h += '</div>';

    h += '<div class="glass-card p-3 mb-4">';
    h += '<div class="flex items-center justify-between mb-1">';
    h += '<span class="text-sm font-medium">Progress to Level ' + (level + 1) + '</span>';
    h += '<span class="text-xs text-secondary">' + xpInLevel + ' / ' + xpNeeded + ' XP</span>';
    h += '</div>';
    h += '<div class="progress-bar"><div class="progress-bar-fill progress-fill-blue" style="width:' + progressPct + '%"></div></div>';
    h += '</div>';

    h += '<div class="grid grid-cols-1 gap-4" style="grid-template-columns:1fr">';
    h += '<div style="display:grid;grid-template-columns:1fr 1.8fr;gap:var(--space-4)">';

    h += '<div class="flex flex-col gap-4">';

    h += '<div class="glass-card p-4">';
    h += '<div class="section-header mb-3"><h3 class="section-title">About</h3></div>';
    h += '<div class="flex flex-col gap-3">';
    h += '<div class="flex items-center gap-2"><span style="font-size:1.2rem">\uD83D\uDC4B</span><div><div class="text-sm font-medium">' + utils.sanitizeHTML(user.name) + '</div><div class="text-xs text-secondary">' + utils.sanitizeHTML(user.email) + '</div><div class="text-xs text-tertiary c-mt-1">Student ID: STU-' + (user.email ? user.email.replace(/[^a-zA-Z0-9]/g, '').slice(0, 8) : '001') + '</div><div class="text-xs text-tertiary">Login ID: LOGIN-' + (user.email ? user.email.replace(/[^a-zA-Z0-9]/g, '').slice(0, 8) : '001') + '</div></div></div>';
    h += '<div><div class="text-xs text-secondary mb-1">Bio</div><div class="text-sm">' + utils.sanitizeHTML(user.bio) + '</div></div>';
    h += '<div class="grid grid-cols-2 gap-2">';
    h += '<div><div class="text-xs text-secondary">Phone</div><div class="text-sm">' + utils.sanitizeHTML(user.phone) + '</div></div>';
    h += '<div><div class="text-xs text-secondary">Board</div><div class="text-sm">' + user.board + '</div></div>';
    h += '<div><div class="text-xs text-secondary">Class</div><div class="text-sm">' + user.class + (user.stream ? ' - ' + user.stream.charAt(0).toUpperCase() + user.stream.slice(1) : '') + '</div></div>';
    h += '<div><div class="text-xs text-secondary">School</div><div class="text-sm">' + utils.sanitizeHTML(user.school) + '</div></div>';
    h += '<div><div class="text-xs text-secondary">City</div><div class="text-sm">' + utils.sanitizeHTML(user.city) + '</div></div>';
    h += '<div><div class="text-xs text-secondary">State</div><div class="text-sm">' + utils.sanitizeHTML(user.state) + '</div></div>';
    h += '<div><div class="text-xs text-secondary">Country</div><div class="text-sm">' + utils.sanitizeHTML(user.country) + '</div></div>';
    h += '</div>';
    h += '<div class="text-xs text-tertiary pt-2" style="border-top:1px solid var(--border-light)">';
    h += 'Member since ' + joinDateFormatted;
    h += '</div>';
    h += '</div></div>';

    h += '</div>';

    h += '<div class="flex flex-col gap-4">';

    h += '<div class="glass-card p-4">';
    h += '<div class="section-header mb-3"><h3 class="section-title">Achievements <span class="badge badge-blue text-xs">' + unlockedCount + '/' + achievements.length + '</span></h3></div>';
    if (achievements.length === 0) {
      h += '<div class="flex flex-col items-center justify-center p-3 text-sm text-secondary">';
      h += '<div style="font-size:2rem;margin-bottom:0.5rem">\uD83C\uDFC6</div>';
      h += '<div>No achievements yet. Start learning to unlock!</div>';
      h += '</div>';
    } else {
      h += '<div class="grid grid-cols-3 gap-2">';
      for (var aii = 0; aii < achievements.length; aii++) {
        var ach = achievements[aii];
        var unlocked = ach.unlocked === true;
        h += '<div class="flex flex-col items-center text-center gap-1 p-2" style="border-radius:var(--radius-md);background:var(--bg-glass);border:1px solid var(--border-color);' + (unlocked ? '' : 'opacity:0.45;filter:grayscale(0.8)') + '">';
        h += '<div style="font-size:1.5rem">' + (ach.icon || '\uD83C\uDFC6') + '</div>';
        h += '<div class="text-xs font-medium" style="line-height:1.2">' + utils.sanitizeHTML(ach.name || 'Achievement') + '</div>';
        h += '<span class="badge ' + (unlocked ? 'badge-green' : 'badge-gray') + '" style="font-size:0.6rem;padding:1px 6px">' + (unlocked ? '\u2713' : '\uD83D\uDD12') + '</span>';
        h += '</div>';
      }
      h += '</div>';
    }
    h += '</div>';

    h += '<div class="glass-card p-4">';
    h += '<div class="section-header mb-3"><h3 class="section-title">Recent Activity</h3></div>';
    h += '<div class="timeline">' + renderActivityCards(activityLog, 5) + '</div>';
    h += '</div>';

    h += '<div class="glass-card p-4">';
    h += '<div class="section-header mb-3"><h3 class="section-title">Bookmarks & Downloads</h3></div>';
    h += '<div class="grid grid-cols-2 gap-3">';
    h += '<div class="flex flex-col items-center p-3" style="border-radius:var(--radius-md);background:var(--bg-glass)">';
    h += '<div style="font-size:1.5rem;margin-bottom:0.25rem">\uD83D\uDCC4</div>';
    h += '<div class="text-lg font-bold">' + bookmarkResources + '</div>';
    h += '<div class="text-xs text-secondary">Resources</div>';
    h += '</div>';
    h += '<div class="flex flex-col items-center p-3" style="border-radius:var(--radius-md);background:var(--bg-glass)">';
    h += '<div style="font-size:1.5rem;margin-bottom:0.25rem">\uD83C\uDFAC</div>';
    h += '<div class="text-lg font-bold">' + bookmarkVideos + '</div>';
    h += '<div class="text-xs text-secondary">Videos</div>';
    h += '</div>';
    h += '<div class="flex flex-col items-center p-3" style="border-radius:var(--radius-md);background:var(--bg-glass)">';
    h += '<div style="font-size:1.5rem;margin-bottom:0.25rem">\uD83D\uDCAC</div>';
    h += '<div class="text-lg font-bold">' + bookmarkCommunity + '</div>';
    h += '<div class="text-xs text-secondary">Community</div>';
    h += '</div>';
    h += '<div class="flex flex-col items-center p-3" style="border-radius:var(--radius-md);background:var(--bg-glass)">';
    h += '<div style="font-size:1.5rem;margin-bottom:0.25rem">\u2B07\uFE0F</div>';
    h += '<div class="text-lg font-bold">' + downloadsCount + '</div>';
    h += '<div class="text-xs text-secondary">Downloads</div>';
    h += '</div>';
    h += '</div>';
    h += '</div>';

    h += '<div class="glass-card p-4">';
    h += '<div class="flex items-center justify-between">';
    h += '<div class="flex items-center gap-3">';
    h += '<div style="font-size:1.5rem">\u2699\uFE0F</div>';
    h += '<div><div class="text-sm font-medium">Settings</div><div class="text-xs text-secondary">Manage your preferences</div></div>';
    h += '</div>';
    h += '<button class="btn btn-sm btn-secondary" data-action="profile:navigate:settings">Open Settings</button>';
    h += '</div>';
    h += '</div>';

    h += '<div class="glass-card p-4">';
    h += '<div class="flex items-center justify-between">';
    h += '<div class="flex items-center gap-3">';
    h += '<div style="font-size:1.5rem">\uD83C\uDFC6</div>';
    h += '<div><div class="text-sm font-medium">Rank & Leaderboard</div><div class="text-xs text-secondary">View your class and school rankings</div></div>';
    h += '</div>';
    h += '<button class="btn btn-sm btn-primary" data-action="profile:navigate:rank">View Rank</button>';
    h += '</div>';
    h += '</div>';

    h += '</div>';
    h += '</div>';
    h += '</div>';
    h += '</div>';

    mc.innerHTML = h;

    document.getElementById('edit-profile-btn').addEventListener('click', showEditDrawer);

    document.addEventListener('click', function(e) {
      var t = e.target.closest('[data-action^="profile:"]');
      if (!t) return;
      var p = t.getAttribute('data-action').split(':');
      var a = p[1];
      if (a === 'navigate' && p[2] === 'settings') { window.location.hash = '#/settings'; }
      if (a === 'navigate' && p[2] === 'rank') { window.location.hash = '#/rank'; }
    });
  }

  renderContent();
};
