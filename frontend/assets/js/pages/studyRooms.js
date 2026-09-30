window.renderPage.studyRooms = function(params) {
  var container = document.getElementById('main-content');
  if (!container) return;
  var md = window.mockData;
  var utils = window.Utils;
  var store = window.Store;

  var currentCategory = 'All';
  var joinedRoomIds = [];
  var roomSearchQuery = '';
  var showJoinModal = null;

  var categories = ['All', 'Science', 'Maths', 'Languages', 'Programming', 'Exam Prep', 'General'];

  var rooms = [
    { id: 'sr1', name: 'JEE Physics Discussion', subject: 'Physics', description: 'Solve JEE Main & Advanced physics problems together. Focus on mechanics, electromagnetism and modern physics.', participants: 12, maxCapacity: 30, features: { voice: true, video: true, screenShare: true, whiteboard: true }, category: 'Exam Prep', online: 5 },
    { id: 'sr2', name: 'NEET Biology Study Hall', subject: 'Biology', description: 'Deep dive into NCERT Biology for NEET. Cover genetics, human physiology, ecology and more.', participants: 18, maxCapacity: 40, features: { voice: true, video: false, screenShare: true, whiteboard: false }, category: 'Exam Prep', online: 7 },
    { id: 'sr3', name: 'Calculus Mastery Lab', subject: 'Mathematics', description: 'Work through limits, derivatives, integrals and differential equations with peer support.', participants: 8, maxCapacity: 20, features: { voice: true, video: true, screenShare: true, whiteboard: true }, category: 'Maths', online: 4 },
    { id: 'sr4', name: 'Organic Chem Study Group', subject: 'Chemistry', description: 'Master organic chemistry reactions, mechanisms, and named products together.', participants: 15, maxCapacity: 25, features: { voice: true, video: false, screenShare: true, whiteboard: true }, category: 'Science', online: 6 },
    { id: 'sr5', name: 'Python Coding Dojo', subject: 'Computer Science', description: 'Practice Python programming from basics to advanced algorithms. Live coding sessions.', participants: 22, maxCapacity: 35, features: { voice: true, video: true, screenShare: true, whiteboard: false }, category: 'Programming', online: 9 },
    { id: 'sr6', name: 'English Grammar Lab', subject: 'English', description: 'Improve your English grammar, vocabulary, and writing skills through practice exercises.', participants: 10, maxCapacity: 25, features: { voice: true, video: false, screenShare: false, whiteboard: false }, category: 'Languages', online: 3 },
    { id: 'sr7', name: 'Class 10 Science Revision', subject: 'Science', description: 'Comprehensive revision of Class 10 Science chapters for board exams.', participants: 25, maxCapacity: 50, features: { voice: true, video: true, screenShare: true, whiteboard: true }, category: 'Exam Prep', online: 11 },
    { id: 'sr8', name: 'Data Structures & Algorithms', subject: 'Computer Science', description: 'Master DSA concepts with LeetCode problems and mock interviews.', participants: 19, maxCapacity: 30, features: { voice: true, video: true, screenShare: true, whiteboard: true }, category: 'Programming', online: 8 },
    { id: 'sr9', name: 'Quantum Physics Forum', subject: 'Physics', description: 'Explore quantum mechanics, wave-particle duality, and modern physics concepts.', participants: 7, maxCapacity: 20, features: { voice: false, video: false, screenShare: true, whiteboard: true }, category: 'Science', online: 2 },
    { id: 'sr10', name: 'Linear Algebra Study Group', subject: 'Mathematics', description: 'Work through matrices, vector spaces, eigenvalues and linear transformations.', participants: 14, maxCapacity: 25, features: { voice: true, video: true, screenShare: true, whiteboard: true }, category: 'Maths', online: 5 },
    { id: 'sr11', name: 'French Language Practice', subject: 'French', description: 'Practice French conversation, grammar, and prepare for DELF exams.', participants: 6, maxCapacity: 15, features: { voice: true, video: true, screenShare: false, whiteboard: false }, category: 'Languages', online: 3 },
    { id: 'sr12', name: 'JEE Advanced Math Prep', subject: 'Mathematics', description: 'Intensive problem solving for JEE Advanced mathematics section.', participants: 20, maxCapacity: 30, features: { voice: true, video: true, screenShare: true, whiteboard: true }, category: 'Exam Prep', online: 10 },
    { id: 'sr13', name: 'Web Development Bootcamp', subject: 'Computer Science', description: 'Build real projects with HTML, CSS, JavaScript, React and Node.js in collaborative sessions.', participants: 28, maxCapacity: 40, features: { voice: true, video: true, screenShare: true, whiteboard: false }, category: 'Programming', online: 14 },
    { id: 'sr14', name: 'Space Science & Astronomy', subject: 'Science', description: 'Discuss space exploration, astrophysics, and astronomy with fellow enthusiasts.', participants: 9, maxCapacity: 25, features: { voice: true, video: false, screenShare: true, whiteboard: false }, category: 'General', online: 4 },
    { id: 'sr15', name: 'Sanskrit Learning Circle', subject: 'Sanskrit', description: 'Learn Sanskrit from basics to advanced levels. Study shlokas and grammar.', participants: 5, maxCapacity: 15, features: { voice: true, video: false, screenShare: true, whiteboard: true }, category: 'Languages', online: 2 },
    { id: 'sr16', name: 'General Study Zone', subject: 'All Subjects', description: 'Open study space for anyone. Quiet focus sessions with optional group discussions.', participants: 32, maxCapacity: 60, features: { voice: false, video: false, screenShare: false, whiteboard: false }, category: 'General', online: 15 }
  ];

  var participantNames = [
    'Aarav Sharma', 'Priya Patel', 'Rahul Verma', 'Ananya Gupta', 'Vikram Singh',
    'Neha Kapoor', 'Arjun Reddy', 'Kavita Nair', 'Rohit Joshi', 'Sneha Iyer'
  ];

  function getInitials(name) {
    var parts = name.split(' ');
    return (parts[0] ? parts[0][0] : '') + (parts[1] ? parts[1][0] : '');
  }

  function getColor(index) {
    var colors = ['#3b82f6', '#8b5cf6', '#ec4899', '#f97316', '#10b981', '#06b6d4', '#f59e0b', '#6366f1', '#ef4444', '#14b8a6'];
    return colors[index % colors.length];
  }

  function getCategoryIcon(cat) {
    var icons = { 'Science': '🔬', 'Maths': '📐', 'Languages': '🗣️', 'Programming': '💻', 'Exam Prep': '📝', 'General': '🌐' };
    return icons[cat] || '📚';
  }

  function getFeatureBadges(features) {
    var html = '<div class="flex gap-2 mb-4">';
    if (features.voice) html += '<span class="badge badge-cyan" style="font-size:10px" title="Voice">🎤 Voice</span>';
    if (features.video) html += '<span class="badge badge-purple" style="font-size:10px" title="Video">📹 Video</span>';
    if (features.screenShare) html += '<span class="badge badge-blue" style="font-size:10px" title="Screen Share">🖥️ Share</span>';
    if (features.whiteboard) html += '<span class="badge badge-green" style="font-size:10px" title="Whiteboard">📝 Board</span>';
    html += '</div>';
    return html;
  }

  function getFilteredRooms() {
    var filtered = rooms;
    if (currentCategory !== 'All') filtered = filtered.filter(function(r) { return r.category === currentCategory; });
    if (roomSearchQuery) {
      var q = roomSearchQuery.toLowerCase();
      filtered = filtered.filter(function(r) { return r.name.toLowerCase().indexOf(q) !== -1 || r.subject.toLowerCase().indexOf(q) !== -1 || r.description.toLowerCase().indexOf(q) !== -1; });
    }
    return filtered;
  }

  function render() {
    var html = '<div class="page-container animate-fadeInUp">';
    html += '<div class="page-header"><div><h1 class="page-title">Study Rooms</h1><p class="page-subtitle">Collaborate and learn together</p></div>';
    html += '<button class="btn btn-primary" id="btn-create-room">+ Create Room</button></div>';

    var totalOnline = 0;
    for (var ri = 0; ri < rooms.length; ri++) { totalOnline += rooms[ri].online; }

    html += '<div class="flex gap-6 mb-6">';
    html += '<div class="glass-card flex-1" style="padding:var(--space-4);display:flex;align-items:center;gap:var(--space-4)">';
    html += '<div style="font-size:2rem">📚</div><div><div class="text-2xl font-bold">' + rooms.length + '</div><div class="text-xs text-secondary">Total Rooms</div></div>';
    html += '<div style="width:1px;height:30px;background:rgba(255,255,255,0.08)"></div>';
    html += '<div style="font-size:2rem">👥</div><div><div class="text-2xl font-bold">' + totalOnline + '</div><div class="text-xs text-secondary">Online Now</div></div>';
    html += '<div style="width:1px;height:30px;background:rgba(255,255,255,0.08)"></div>';
    html += '<div style="font-size:2rem">✅</div><div><div class="text-2xl font-bold">' + joinedRoomIds.length + '</div><div class="text-xs text-secondary">Joined</div></div>';
    html += '<div class="flex-1"></div>';
    html += '<div class="input-with-icon" style="width:220px"><span class="input-icon">🔍</span><input type="text" class="input-field" id="room-search" placeholder="Search rooms..." style="width:100%"></div>';
    html += '</div></div>';

    html += '<div class="tabs mb-6" id="room-categories">';
    for (var i = 0; i < categories.length; i++) {
      html += '<div class="tab' + (categories[i] === currentCategory ? ' active' : '') + '" data-cat="' + categories[i] + '">' + getCategoryIcon(categories[i]) + ' ' + categories[i] + '</div>';
    }
    html += '</div>';

    var activeRooms = rooms.filter(function(r) { return joinedRoomIds.indexOf(r.id) !== -1; });
    if (activeRooms.length > 0) {
      html += '<div class="section-header"><h2 class="section-title">📌 Active Rooms</h2></div>';
      html += '<div class="grid grid-cols-auto gap-4 mb-8">';
      for (var i = 0; i < activeRooms.length; i++) {
        html += renderRoomCard(activeRooms[i]);
      }
      html += '</div>';
    }

    html += '<div class="section-header"><h2 class="section-title">' + getCategoryIcon(currentCategory) + ' ' + currentCategory + ' Rooms</h2></div>';
    html += '<div class="grid grid-cols-auto gap-4" id="rooms-grid">';
    var filtered = getFilteredRooms();
    if (filtered.length === 0) {
      html += '<div class="empty-state" style="grid-column:1/-1"><div class="empty-state-icon">🔍</div><div class="empty-state-title">No rooms found</div><div class="empty-state-text">Try a different category or search term</div></div>';
    } else {
      for (var i = 0; i < filtered.length; i++) {
        html += renderRoomCard(filtered[i]);
      }
    }
    html += '</div>';

    html += '</div>';
    container.innerHTML = html;
    bindEvents();
  }

  function renderRoomCard(room) {
    var isJoined = joinedRoomIds.indexOf(room.id) !== -1;
    var participants = participantNames.slice(0, Math.min(4, room.online));
    var roomIdx = rooms.indexOf(room);
    var html = '<div class="glass-card room-card" data-id="' + room.id + '" style="padding:var(--space-5);display:flex;flex-direction:column">';
    html += '<div class="flex items-center justify-between mb-3"><div class="flex items-center gap-3">';
    html += '<div class="avatar avatar-md" style="background:' + getColor(roomIdx) + '">' + room.name.charAt(0) + '</div>';
    html += '<div><div class="font-semibold">' + utils.sanitizeHTML(room.name) + '</div><div class="text-xs text-secondary">' + room.subject + '</div></div></div>';
    html += '<div class="flex items-center gap-1"><div style="width:8px;height:8px;border-radius:50%;background:#10b981"></div><span class="text-xs text-secondary">' + room.online + ' online</span></div></div>';

    html += '<div class="text-sm text-secondary mb-3" style="line-height:1.5">' + utils.sanitizeHTML(room.description) + '</div>';

    html += '<div class="flex items-center gap-2 mb-3">';
    html += '<span class="badge" style="background:rgba(59,130,246,0.15);color:#60a5fa;font-size:10px">' + room.category + '</span>';
    html += '<span class="text-xs text-tertiary">👥 ' + room.participants + '/' + room.maxCapacity + '</span>';
    html += '</div>';

    html += '<div class="avatar-group mb-3">';
    for (var a = 0; a < participants.length; a++) {
      html += '<div class="avatar avatar-sm" style="background:' + getColor(a) + '" title="' + participants[a] + '">' + getInitials(participants[a]) + '</div>';
    }
    if (room.online > 4) html += '<div class="avatar avatar-sm" style="background:var(--bg-glass-strong)">+' + (room.online - 4) + '</div>';
    html += '</div>';

    html += getFeatureBadges(room.features);

    html += '<div class="mt-auto">';
    html += '<button class="btn btn-block btn-sm ' + (isJoined ? 'btn-secondary' : 'btn-primary') + ' join-room-btn" data-id="' + room.id + '">' + (isJoined ? '✓ Joined' : '+ Join Room') + '</button>';
    if (!isJoined) {
      html += '<button class="btn btn-ghost btn-sm btn-block mt-2 view-room-btn" data-id="' + room.id + '" style="font-size:11px">👥 View Participants</button>';
    }
    html += '</div></div>';
    return html;
  }

  function renderParticipantModal(room) {
    var overlay = document.createElement('div');
    overlay.className = 'modal-overlay';
    overlay.id = 'participants-overlay';
    var html = '<div class="modal" style="max-width:400px"><div class="modal-header"><h3 class="font-semibold">👥 ' + utils.sanitizeHTML(room.name) + ' - Participants</h3><button class="btn btn-ghost btn-icon-sm" id="close-participants-modal">✕</button></div><div class="modal-body"><div class="flex flex-col gap-2">';
    var count = Math.min(room.online, participantNames.length);
    for (var i = 0; i < count; i++) {
      html += '<div class="flex items-center gap-3 p-3" style="border-radius:var(--radius-sm);background:rgba(255,255,255,0.03)"><div class="avatar avatar-sm" style="background:' + getColor(i) + '">' + getInitials(participantNames[i]) + '</div><div class="flex-1"><div class="text-sm font-medium">' + participantNames[i] + '</div><div class="text-xs text-tertiary">' + (i === 0 ? '👑 Host' : 'Member') + '</div></div><div style="width:8px;height:8px;border-radius:50%;background:#10b981"></div></div>';
    }
    html += '</div></div></div>';
    overlay.innerHTML = html;
    document.body.appendChild(overlay);
    document.getElementById('close-participants-modal').addEventListener('click', function() { overlay.remove(); });
    overlay.addEventListener('click', function(e) { if (e.target === overlay) overlay.remove(); });
  }

  function switchCategory(cat) {
    currentCategory = cat;
    var tabs = document.querySelectorAll('#room-categories .tab');
    for (var i = 0; i < tabs.length; i++) {
      tabs[i].classList.toggle('active', tabs[i].dataset.cat === cat);
    }
    var grid = document.getElementById('rooms-grid');
    if (grid) {
      var filtered = getFilteredRooms();
      var html = '';
      for (var i = 0; i < filtered.length; i++) html += renderRoomCard(filtered[i]);
      grid.innerHTML = html;
      bindRoomEvents();
    }
  }

  function openCreateModal() {
    var overlay = document.createElement('div');
    overlay.className = 'modal-overlay';
    overlay.id = 'create-room-overlay';
    overlay.innerHTML = '\
<div class="modal">\
  <div class="modal-header"><h3 class="font-semibold text-lg">Create Study Room</h3><button class="btn btn-ghost btn-icon-sm" id="close-create-modal">✕</button></div>\
  <div class="modal-body"><div class="flex flex-col gap-4">\
    <div class="input-group"><label class="input-label">Room Name</label><input type="text" class="input-field" id="room-name-input" placeholder="e.g. JEE Physics Discussion"></div>\
    <div class="input-group"><label class="input-label">Subject</label><select class="input-field" id="room-subject-input"><option>Mathematics</option><option>Physics</option><option>Chemistry</option><option>Biology</option><option>Computer Science</option><option>English</option><option>French</option><option>Sanskrit</option><option>General</option></select></div>\
    <div class="input-group"><label class="input-label">Description</label><textarea class="input-field" id="room-desc-input" placeholder="Describe the purpose of this study room..." style="min-height:80px"></textarea></div>\
    <div class="flex gap-4"><div class="input-group flex-1"><label class="input-label">Max Participants</label><input type="number" class="input-field" id="room-max-input" value="25" min="5" max="100"></div>\
    <div class="input-group flex-1"><label class="input-label">Room Type</label><select class="input-field" id="room-type-input"><option value="public">Public</option><option value="private">Private</option></select></div></div>\
  </div></div>\
  <div class="modal-footer"><button class="btn btn-secondary" id="cancel-create">Cancel</button><button class="btn btn-primary" id="confirm-create">Create Room</button></div>\
</div>';
    document.body.appendChild(overlay);
    document.getElementById('close-create-modal').addEventListener('click', function() { overlay.remove(); });
    document.getElementById('cancel-create').addEventListener('click', function() { overlay.remove(); });
    overlay.addEventListener('click', function(e) { if (e.target === overlay) overlay.remove(); });
    document.getElementById('confirm-create').addEventListener('click', function() {
      var name = document.getElementById('room-name-input').value.trim();
      var subject = document.getElementById('room-subject-input').value;
      var desc = document.getElementById('room-desc-input').value.trim();
      var max = parseInt(document.getElementById('room-max-input').value) || 25;
      var type = document.getElementById('room-type-input').value;
      if (!name) { alert('Please enter a room name.'); return; }
      var newRoom = {
        id: 'sr_' + Date.now(), name: name, subject: subject,
        description: desc || 'No description provided.', participants: 1, maxCapacity: max,
        features: { voice: true, video: true, screenShare: true, whiteboard: true },
        category: 'General', online: 1
      };
      rooms.push(newRoom);
      joinedRoomIds.push(newRoom.id);
      overlay.remove();
      render();
    });
  }

  function bindRoomEvents() {
    var joinBtns = document.querySelectorAll('.join-room-btn');
    for (var i = 0; i < joinBtns.length; i++) {
      joinBtns[i].addEventListener('click', function() {
        var id = this.dataset.id;
        var idx = joinedRoomIds.indexOf(id);
        if (idx !== -1) {
          joinedRoomIds.splice(idx, 1);
        } else {
          joinedRoomIds.push(id);
        }
        render();
      });
    }

    var viewBtns = document.querySelectorAll('.view-room-btn');
    for (var i = 0; i < viewBtns.length; i++) {
      viewBtns[i].addEventListener('click', function() {
        var id = this.dataset.id;
        for (var r = 0; r < rooms.length; r++) {
          if (rooms[r].id === id) { renderParticipantModal(rooms[r]); break; }
        }
      });
    }
  }

  function bindEvents() {
    var catEls = document.querySelectorAll('#room-categories .tab');
    for (var i = 0; i < catEls.length; i++) {
      catEls[i].addEventListener('click', function() { switchCategory(this.dataset.cat); });
    }

    var searchInput = document.getElementById('room-search');
    if (searchInput) {
      searchInput.addEventListener('input', function() {
        roomSearchQuery = this.value;
        var grid = document.getElementById('rooms-grid');
        if (grid) {
          var filtered = getFilteredRooms();
          var html = '';
          for (var i = 0; i < filtered.length; i++) html += renderRoomCard(filtered[i]);
          grid.innerHTML = html;
          bindRoomEvents();
        }
      });
    }

    var createBtn = document.getElementById('btn-create-room');
    if (createBtn) createBtn.addEventListener('click', openCreateModal);

    bindRoomEvents();
  }

  render();
};
