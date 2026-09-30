window.renderPage.community = function(params) {
  var container = document.getElementById('main-content');
  if (!container) return;
  var utils = window.Utils;
  var store = window.Store;
  var md = window.mockData;

  var gradients = [
    'linear-gradient(135deg,#3b82f6,#8b5cf6)',
    'linear-gradient(135deg,#8b5cf6,#ec4899)',
    'linear-gradient(135deg,#06b6d4,#3b82f6)',
    'linear-gradient(135deg,#f97316,#ec4899)',
    'linear-gradient(135deg,#10b981,#06b6d4)',
    'linear-gradient(135deg,#f59e0b,#f97316)',
    'linear-gradient(135deg,#6366f1,#a855f7)',
    'linear-gradient(135deg,#14b8a6,#06b6d4)',
    'linear-gradient(135deg,#f43f5e,#ec4899)',
    'linear-gradient(135deg,#0ea5e9,#3b82f6)'
  ];

  var currentUser = store.get('user') || { name: 'Guest', role: 'student' };
  var currentCommunityId = null;
  var currentChannelId = null;
  var searchQuery = '';
  var memberSearchQuery = '';
  var communitySearchQuery = '';
  var showPinned = true;
  var showMembers = true;

  var CATEGORIES = [
    { id: 'general', label: 'General', icon: '\uD83D\uDCE2' },
    { id: 'academic', label: 'Academic', icon: '\uD83D\uDCDA' },
    { id: 'resources', label: 'Resources', icon: '\uD83D\uDCC1' },
    { id: 'social', label: 'Social', icon: '\uD83D\uDCAC' }
  ];

  var CHANNEL_DEFS = [
    { type: 'general', label: 'General', icon: '#', category: 'general' },
    { type: 'announcements', label: 'Announcements', icon: '\uD83D\uDCE2', category: 'general' },
    { type: 'events', label: 'Events', icon: '\uD83D\uDCC5', category: 'general' },
    { type: 'homework-help', label: 'Homework Help', icon: '\uD83D\uDCDD', category: 'academic' },
    { type: 'assignments', label: 'Assignments', icon: '\uD83D\uDCCB', category: 'academic' },
    { type: 'study-group', label: 'Study Group', icon: '\uD83D\uDC65', category: 'academic' },
    { type: 'notes', label: 'Notes', icon: '\uD83D\uDCDD', category: 'resources' },
    { type: 'books', label: 'Books', icon: '\uD83D\uDCDA', category: 'resources' },
    { type: 'practice', label: 'Practice', icon: '\u270F\uFE0F', category: 'resources' },
    { type: 'random', label: 'Random', icon: '\uD83D\uDD00', category: 'social' },
    { type: 'off-topic', label: 'Off-Topic', icon: '\uD83D\uDCA4', category: 'social' }
  ];

  var CHANNEL_NAMES = {
    'general': 'general', 'announcements': 'announcements', 'events': 'events',
    'homework-help': 'homework-help', 'assignments': 'assignments', 'study-group': 'study-group',
    'notes': 'notes', 'books': 'books', 'practice': 'practice',
    'random': 'random', 'off-topic': 'off-topic'
  };

  var MOCK_NAMES = [
    'Aarav Sharma','Priya Patel','Rahul Verma','Ananya Gupta','Vikram Singh',
    'Neha Kapoor','Arjun Reddy','Kavita Nair','Rohit Joshi','Sneha Iyer',
    'Dr. Meera Joshi','Prof. Anil Kumar','Ms. Sunita Reddy','Amit Desai',
    'Deepika Malhotra','Vijay Kumar','Pooja Singh','Karthik Iyer','Nandini Rao',
    'Ravi Shastri','Shweta Jain','Akash Verma','Bhavana Reddy','Chirag Patel',
    'Divya Nair','Esha Sharma','Farhan Ali','Gauri Joshi','Harsh Gupta',
    'Ishita Kapoor','Jatin Patel','Kritika Singh','Lakshmi Iyer','Manav Reddy',
    'Navya Kumar','Omkar Joshi','Pallavi Desai','Quasim Ali','Radhika Sharma',
    'Sahil Verma','Tanvi Gupta','Uday Patel','Vaishali Singh','Yash Reddy',
    'Zara Khan','Aditya Joshi','Bhavika Nair','Chetan Kumar','Disha Patel',
    'Eknath Iyer'
  ];

  var ROLE_BADGES = {
    teacher: { label: 'Teacher', color: 'rgba(239,68,68,0.15)', textColor: '#ef4444', border: 'rgba(239,68,68,0.3)' },
    moderator: { label: 'Mod', color: 'rgba(59,130,246,0.15)', textColor: '#3b82f6', border: 'rgba(59,130,246,0.3)' },
    mentor: { label: 'Mentor', color: 'rgba(139,92,246,0.15)', textColor: '#8b5cf6', border: 'rgba(139,92,246,0.3)' },
    student: { label: 'Student', color: 'rgba(107,114,128,0.15)', textColor: '#6b7280', border: 'rgba(107,114,128,0.3)' },
    admin: { label: 'Admin', color: 'rgba(239,68,68,0.15)', textColor: '#ef4444', border: 'rgba(239,68,68,0.3)' },
    member: { label: 'Member', color: 'rgba(107,114,128,0.15)', textColor: '#6b7280', border: 'rgba(107,114,128,0.3)' }
  };

  var POLL_QUESTIONS = [
    'Which subject needs the most attention?',
    'Best time for group study?',
    'Preferred learning format?',
    'Should we have weekend study sessions?',
    'Which topic should we cover next?',
    'What type of practice problems do you prefer?',
    'How do you prefer to receive feedback?',
    'Which study resource do you find most helpful?'
  ];

  var POLL_OPTIONS_POOL = [
    ['Mathematics','Physics','Chemistry','English'],
    ['Morning 6-8 AM','Afternoon 2-4 PM','Evening 6-8 PM','Night 8-10 PM'],
    ['Video Lectures','Live Classes','Notes/PDFs','Practice Tests'],
    ['Yes, every Saturday','Yes, every Sunday','Both days','No, weekdays only'],
    ['Calculus','Organic Chemistry','Kinematics','Grammar'],
    ['Multiple Choice','Short Answer','Long Form','Numerical'],
    ['Written Comments','One-on-One','Peer Review','Auto-graded'],
    ['Textbooks','Video Tutorials','Practice Problems','Study Groups']
  ];

  var MESSAGE_TEMPLATES = [
    'I completely agree with this!',
    'Can someone explain this in more detail?',
    'Great point! Thanks for sharing.',
    'This is really helpful for my studies.',
    'Has anyone tried the practice problems?',
    'The video lecture on this topic is excellent.',
    'I found a great resource for this.',
    'Let me know if you need help with this.',
    'This cleared up my doubts, thanks!',
    'Can we have a study session on this?',
    'I solved it using a different method.',
    'Could you share the reference material?',
    'This topic is very important for exams.',
    'I have a question about this concept.',
    'Let me check my notes on this.',
    'Here is a helpful link I found.',
    'Does anyone have the notes from last class?',
    'The assignment deadline is approaching.',
    'Great discussion everyone!',
    'I found the answer in the textbook.'
  ];

  var FILE_NAMES = [
    { name: 'Chapter 5 Notes.pdf', type: 'pdf', size: '1.2MB' },
    { name: 'Practice Problems Set 3.pdf', type: 'pdf', size: '856KB' },
    { name: 'Study Guide - Final Exam.pdf', type: 'pdf', size: '2.4MB' },
    { name: 'Reference Material.zip', type: 'zip', size: '4.8MB' },
    { name: 'Lecture Slides Week 4.pptx', type: 'pptx', size: '3.1MB' },
    { name: 'Lab Report Template.docx', type: 'docx', size: '245KB' },
    { name: 'Formula Sheet.pdf', type: 'pdf', size: '512KB' },
    { name: 'Assignment 2 Solutions.pdf', type: 'pdf', size: '1.8MB' },
    { name: 'Group Project Guidelines.pdf', type: 'pdf', size: '920KB' },
    { name: 'Exam Prep Notes.pdf', type: 'pdf', size: '3.5MB' }
  ];

  var GROUP_TYPES = [
    { id: 'teacher', label: 'Teacher Groups', icon: '\uD83D\uDC68\u200D\uD83C\uDFEB' },
    { id: 'class', label: 'Class Groups', icon: '\uD83C\uDF92' },
    { id: 'subject', label: 'Subject Groups', icon: '\uD83D\uDCDA' }
  ];

  function generateId() {
    return 'id_' + Date.now().toString(36) + '_' + Math.random().toString(36).slice(2, 9);
  }

  function getInitials(name) {
    if (!name) return '?';
    var parts = name.trim().split(/\s+/);
    if (parts.length === 1) return parts[0].charAt(0).toUpperCase();
    return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase();
  }

  function getGradient(idx) {
    return gradients[idx % gradients.length];
  }

  function formatRelativeTime(iso) {
    if (!iso) return '';
    var now = new Date();
    var d = new Date(iso);
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
  }

  function formatNumber(n) {
    if (n === undefined || n === null) return '0';
    if (n >= 10000000) return (n / 10000000).toFixed(1).replace(/\.0$/, '') + 'Cr';
    if (n >= 100000) return (n / 100000).toFixed(1).replace(/\.0$/, '') + 'L';
    if (n >= 1000) return (n / 1000).toFixed(1).replace(/\.0$/, '') + 'K';
    return String(n);
  }

  function sanitizeHTML(str) {
    if (!str) return '';
    var map = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#x27;' };
    return String(str).replace(/[&<>"']/g, function(m) { return map[m]; });
  }

  function truncate(str, maxLen) {
    if (!str) return '';
    if (maxLen === void 0) maxLen = 100;
    if (str.length <= maxLen) return str;
    return str.slice(0, maxLen - 3) + '...';
  }

  function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  function pickRandom(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
  }

  function shuffleArray(arr) {
    var result = arr.slice();
    for (var i = result.length - 1; i > 0; i--) {
      var j = Math.floor(Math.random() * (i + 1));
      var tmp = result[i];
      result[i] = result[j];
      result[j] = tmp;
    }
    return result;
  }

  function getChannelTopic(type) {
    var map = {
      'general': 'General discussion for this community',
      'announcements': 'Official announcements and updates',
      'events': 'Upcoming events and meetups',
      'homework-help': 'Ask and answer homework questions',
      'assignments': 'Track assignments and deadlines',
      'study-group': 'Collaborative study sessions',
      'notes': 'Share and access study notes',
      'books': 'Recommended books and references',
      'practice': 'Practice problems and solutions',
      'random': 'Off-topic conversations',
      'off-topic': 'Casual chat and fun discussions'
    };
    return map[type] || 'General channel';
  }

  function getChannelIcon(type) {
    var map = {
      'general': '#', 'announcements': '\uD83D\uDCE2', 'events': '\uD83D\uDCC5',
      'homework-help': '\uD83D\uDCDD', 'assignments': '\uD83D\uDCCB', 'study-group': '\uD83D\uDC65',
      'notes': '\uD83D\uDCDD', 'books': '\uD83D\uDCDA', 'practice': '\u270F\uFE0F',
      'random': '\uD83D\uDD00', 'off-topic': '\uD83D\uDCA4'
    };
    return map[type] || '#';
  }

  function getChannelCategory(type) {
    for (var ci = 0; ci < CHANNEL_DEFS.length; ci++) {
      if (CHANNEL_DEFS[ci].type === type) return CHANNEL_DEFS[ci].category;
    }
    return 'general';
  }

  function getRoleBadge(role) {
    var rb = ROLE_BADGES[role] || ROLE_BADGES.member;
    return '<span class="comm-role-badge" style="font-size:10px;padding:1px 6px;background:' + rb.color + ';border:1px solid ' + rb.border + ';color:' + rb.textColor + ';border-radius:4px;font-weight:500;white-space:nowrap">' + rb.label + '</span>';
  }

  function getOnlineDot(online) {
    return online
      ? '<span style="display:inline-block;width:8px;height:8px;border-radius:50%;background:#22c55e;border:2px solid var(--bg-primary);flex-shrink:0"></span>'
      : '<span style="display:inline-block;width:8px;height:8px;border-radius:50%;background:#6b7280;border:2px solid var(--bg-primary);flex-shrink:0"></span>';
  }

  function getFileIcon(type) {
    var icons = { pdf: '\uD83D\uDCC4', docx: '\uD83D\uDCDD', pptx: '\uD83D\uDCCA', zip: '\uD83D\uDCE6', image: '\uD83D\uDCF7', doc: '\uD83D\uDCDD' };
    return icons[type] || '\uD83D\uDCC4';
  }

  function getCommunities() {
    return store.get('communities') || [];
  }

  function getMembers(communityId) {
    var members = store.get('communityMembers') || {};
    return members[communityId] || [];
  }

  function getMessages(communityId, channelId) {
    var allMsgs = store.get('communityMessages') || {};
    var key = communityId + '_' + channelId;
    return allMsgs[key] || [];
  }

  function setMessages(communityId, channelId, msgs) {
    var allMsgs = store.get('communityMessages') || {};
    allMsgs[communityId + '_' + channelId] = msgs;
    store.set('communityMessages', allMsgs);
  }

  function getUnread() {
    return store.get('communityUnread') || {};
  }

  function setUnread(communityId, channelId, count) {
    var unread = getUnread();
    unread[communityId + '_' + channelId] = count;
    store.set('communityUnread', unread);
  }

  function markRead(communityId, channelId) {
    setUnread(communityId, channelId, 0);
  }

  function getPinned(communityId, channelId) {
    var pinned = store.get('communityPinned') || {};
    var key = communityId + '_' + channelId;
    return pinned[key] || [];
  }

  function setPinned(communityId, channelId, msgIds) {
    var pinned = store.get('communityPinned') || {};
    var key = communityId + '_' + channelId;
    pinned[key] = msgIds;
    store.set('communityPinned', pinned);
  }

  function getLikedMessages() {
    return store.get('communityLiked') || {};
  }

  function toggleLike(communityId, channelId, msgId) {
    var liked = getLikedMessages();
    var key = communityId + '_' + channelId;
    if (!liked[key]) liked[key] = {};
    if (liked[key][msgId]) {
      delete liked[key][msgId];
      store.set('communityLiked', liked);
      return false;
    } else {
      liked[key][msgId] = true;
      store.set('communityLiked', liked);
      return true;
    }
  }

  function isLiked(communityId, channelId, msgId) {
    var liked = getLikedMessages();
    var key = communityId + '_' + channelId;
    return !!(liked[key] && liked[key][msgId]);
  }

  function getGroupInfo() {
    return store.get('communityGroups') || {
      teacher: [
        { id: 'grp_t1', name: 'Faculty Room', icon: '\uD83D\uDC68\u200D\uD83C\uDFEB', memberCount: 15, desc: 'Teacher discussion and collaboration', createdAt: '2024-01-15' },
        { id: 'grp_t2', name: 'Curriculum Planning', icon: '\uD83D\uDCCA', memberCount: 8, desc: 'Plan curriculum and syllabus', createdAt: '2024-02-01' }
      ],
      class: [
        { id: 'grp_c1', name: 'Class 10-A', icon: '\uD83C\uDF92', memberCount: 42, desc: 'Class 10 Section A group', createdAt: '2024-01-10' },
        { id: 'grp_c2', name: 'Class 12-B', icon: '\uD83C\uDF93', memberCount: 38, desc: 'Class 12 Section B group', createdAt: '2024-01-10' }
      ],
      subject: [
        { id: 'grp_s1', name: 'Mathematics Enthusiasts', icon: '\uD83D\uDCD0', memberCount: 65, desc: 'Math lovers discussion group', createdAt: '2024-03-01' },
        { id: 'grp_s2', name: 'Physics Lab', icon: '\u269B\uFE0F', memberCount: 52, desc: 'Physics experiments and theory', createdAt: '2024-03-05' },
        { id: 'grp_s3', name: 'Chemistry Club', icon: '\uD83E\uDDEA', memberCount: 44, desc: 'Chemistry discussions and experiments', createdAt: '2024-03-10' }
      ]
    };
  }

  function getReactions(msgId) {
    var allReactions = store.get('communityReactions') || {};
    return allReactions[msgId] || {};
  }

  function toggleReaction(msgId, emoji) {
    var allReactions = store.get('communityReactions') || {};
    if (!allReactions[msgId]) allReactions[msgId] = {};
    if (!allReactions[msgId][emoji]) allReactions[msgId][emoji] = [];
    var idx = allReactions[msgId][emoji].indexOf(currentUser.name);
    if (idx !== -1) {
      allReactions[msgId][emoji].splice(idx, 1);
      if (allReactions[msgId][emoji].length === 0) delete allReactions[msgId][emoji];
    } else {
      allReactions[msgId][emoji].push(currentUser.name);
    }
    store.set('communityReactions', allReactions);
  }

  var EMOJI_LIST = ['\u2764\uFE0F', '\uD83D\uDE00', '\uD83D\uDE0A', '\uD83D\uDE0D', '\uD83D\uDC4D', '\uD83D\uDC4E', '\uD83D\uDE02', '\uD83D\uDE2E', '\uD83D\uDE22', '\uD83D\uDE20', '\uD83D\uDE4C', '\uD83D\uDCAF', '\uD83D\uDE80', '\uD83D\uDE06', '\uD83D\uDE0F', '\uD83D\uDE4F'];

  function showToast(message, type) {
    type = type || 'info';
    var existing = document.querySelector('.toast-container');
    var toastContainer;
    if (!existing) {
      toastContainer = document.createElement('div');
      toastContainer.className = 'toast-container';
      toastContainer.style.cssText = 'position:fixed;bottom:24px;right:24px;z-index:99999;display:flex;flex-direction:column;gap:8px;max-width:360px';
      document.body.appendChild(toastContainer);
    } else {
      toastContainer = existing;
    }
    var toast = document.createElement('div');
    toast.className = 'toast toast-' + type;
    var iconMap = { success: '\u2705', error: '\u274C', info: '\u2139\uFE0F', warning: '\u26A0\uFE0F' };
    var bgMap = { success: 'rgba(16,185,129,0.15)', error: 'rgba(239,68,68,0.15)', info: 'rgba(59,130,246,0.15)', warning: 'rgba(245,158,11,0.15)' };
    var borderMap = { success: '1px solid rgba(16,185,129,0.3)', error: '1px solid rgba(239,68,68,0.3)', info: '1px solid rgba(59,130,246,0.3)', warning: '1px solid rgba(245,158,11,0.3)' };
      toast.style.cssText = 'padding:12px 16px;border-radius:12px;background:' + (bgMap[type] || bgMap.info) + ';border:' + (borderMap[type] || borderMap.info) + ';color:var(--text-primary);font-size:var(--text-sm);backdrop-filter:blur(12px);box-shadow:0 8px 32px rgba(0,0,0,0.3);animation:slideInRight 0.3s ease;transform-origin:right';
    toast.innerHTML = '<span>' + (iconMap[type] || iconMap.info) + '</span><span>' + message + '</span>';
    toastContainer.appendChild(toast);
    setTimeout(function() {
      toast.style.opacity = '0';
      toast.style.transform = 'translateX(100%)';
      toast.style.transition = 'all 0.3s ease';
      setTimeout(function() {
        if (toast.parentNode) toast.parentNode.removeChild(toast);
      }, 300);
    }, 3000);
  }

  function ensureMockData() {
    var communities = store.get('communities');
    if (communities && communities.length > 0) return;

    var names = MOCK_NAMES.slice();
    var communitiesData = [];
    var communityDefs = [
      { id: 'com_edu', name: 'Education Hub', icon: '\uD83C\uDFEB', desc: 'General academic discussions across all subjects', memberCount: 285 },
      { id: 'com_study', name: 'Study Groups', icon: '\uD83D\uDCDA', desc: 'Collaborative study circles for exam preparation', memberCount: 192 },
      { id: 'com_exam', name: 'Exam Prep', icon: '\uD83C\uDF93', desc: 'JEE, NEET, Board Exams preparation community', memberCount: 341 },
      { id: 'com_coding', name: 'Coding Club', icon: '\uD83D\uDCBB', desc: 'Learn programming and computer science together', memberCount: 156 },
      { id: 'com_career', name: 'Career Guidance', icon: '\uD83C\uDFAF', desc: 'Career paths, college admissions, and mentorship', memberCount: 123 },
      { id: 'com_science', name: 'Science Forum', icon: '\uD83D\uDD2C', desc: 'Science discussions, experiments and discoveries', memberCount: 210 },
      { id: 'com_lang', name: 'Language Learners', icon: '\uD83C\uDF0D', desc: 'Learn and practice new languages together', memberCount: 89 }
    ];

    var allMembers = {};

    for (var ci = 0; ci < communityDefs.length; ci++) {
      var def = communityDefs[ci];
      var channelList = [];
      var numChannels = 11;
      for (var chi = 0; chi < numChannels; chi++) {
        var cd = CHANNEL_DEFS[chi % CHANNEL_DEFS.length];
        var chId = def.id + '_' + cd.type;
        channelList.push({
          id: chId,
          type: cd.type,
          name: cd.label,
          icon: cd.icon,
          category: cd.category,
          topic: getChannelTopic(cd.type),
          memberCount: getRandomInt(10, def.memberCount)
        });
      }

      var adminNames = [];
      var modNames = [];
      var mentorNames = [];
      var teacherNames = [];
      for (var mi = 0; mi < 3; mi++) adminNames.push(names[(ci * 10 + mi) % names.length]);
      for (var mi = 0; mi < 4; mi++) modNames.push(names[(ci * 10 + mi + 5) % names.length]);
      for (var mi = 0; mi < 2; mi++) mentorNames.push(names[(ci * 10 + mi + 10) % names.length]);
      for (var mi = 0; mi < 2; mi++) teacherNames.push(names[(ci * 10 + mi + 15) % names.length]);

      var memberList = [];
      var usedNames = {};
      for (var mi = 0; mi < def.memberCount; mi++) {
        var n = names[mi % names.length];
        if (!usedNames[n]) {
          usedNames[n] = true;
          var role = 'student';
          if (adminNames.indexOf(n) !== -1) role = 'admin';
          else if (teacherNames.indexOf(n) !== -1) role = 'teacher';
          else if (modNames.indexOf(n) !== -1) role = 'moderator';
          else if (mentorNames.indexOf(n) !== -1) role = 'mentor';
          memberList.push({
            id: 'm_' + def.id + '_' + mi,
            name: n,
            role: role,
            online: Math.random() > 0.5,
            lastSeen: new Date(Date.now() - getRandomInt(60000, 86400000)).toISOString(),
            avatar: null
          });
        }
      }

      communitiesData.push({
        id: def.id,
        name: def.name,
        icon: def.icon,
        description: def.desc,
        memberCount: memberList.length,
        channels: channelList,
        members: memberList,
        createdAt: new Date(Date.now() - getRandomInt(30, 365) * 86400000).toISOString()
      });

      allMembers[def.id] = memberList;
    }

    store.set('communities', communitiesData);
    store.set('communityMembers', allMembers);

    var allMessages = {};

    for (var ci = 0; ci < communitiesData.length; ci++) {
      var com = communitiesData[ci];
      for (var chi = 0; chi < com.channels.length; chi++) {
        var ch = com.channels[chi];
        var key = com.id + '_' + ch.id;
        var msgs = [];
        var numMessages = getRandomInt(100, 150);
        var pinnedIds = [];

        for (var mi = 0; mi < numMessages; mi++) {
          var author = com.members[getRandomInt(0, com.members.length - 1)];
          var msgType = 'text';
          var msgContent = '';
          var msgExtra = null;
          var r = Math.random();

          if (ch.type === 'announcements' && mi < 5) {
            msgType = 'announcement';
            msgContent = pickRandom([
              '\uD83D\uDCE2 IMPORTANT: Exam schedule has been updated!',
              '\uD83D\uDCE2 New study materials are now available in the resources channel.',
              '\uD83D\uDCE2 Guest lecture this Friday at 3 PM. Attendance mandatory!',
              '\uD83D\uDCE2 Assignment submission deadline extended to next Monday.',
              '\uD83D\uDCE2 Holiday schedule for the upcoming festival season.'
            ]);
          } else if (r < 0.55) {
            msgType = 'text';
            msgContent = MESSAGE_TEMPLATES[mi % MESSAGE_TEMPLATES.length];
          } else if (r < 0.75) {
            msgType = 'poll';
            var pi = getRandomInt(0, POLL_QUESTIONS.length - 1);
            var opts = POLL_OPTIONS_POOL[pi];
            var votes = opts.map(function() { return getRandomInt(0, 50); });
            msgContent = POLL_QUESTIONS[pi];
            msgExtra = { options: opts, votes: votes, totalVotes: votes.reduce(function(a, b) { return a + b; }, 0) };
          } else if (r < 0.88) {
            msgType = 'file';
            var fi = getRandomInt(0, FILE_NAMES.length - 1);
            msgContent = FILE_NAMES[fi].name;
            msgExtra = { fileName: FILE_NAMES[fi].name, fileSize: FILE_NAMES[fi].size, fileType: FILE_NAMES[fi].type };
          } else {
            msgType = 'image';
            msgContent = 'Shared an image';
            msgExtra = { imageUrl: 'https://picsum.photos/400/300?random=' + mi };
          }

          var isPinned = mi < 3 && Math.random() > 0.6;
          if (isPinned) pinnedIds.push('msg_' + key + '_' + mi);

          msgs.push({
            id: 'msg_' + key + '_' + mi,
            type: msgType,
            author: author.name,
            authorRole: author.role,
            content: msgContent,
            extra: msgExtra,
            likes: getRandomInt(0, 15),
            likedBy: [],
            replyCount: getRandomInt(0, 8),
            isPinned: isPinned,
            createdAt: new Date(Date.now() - (numMessages - mi) * getRandomInt(60000, 3600000)).toISOString()
          });
        }
        allMessages[key] = msgs;
        store.set('communityPinned_' + key, pinnedIds);
      }
    }

    store.set('communityMessages', allMessages);
    store.set('communityUnread', {});
    store.set('communityPinned', {});
    store.set('communityReactions', {});
    store.set('communityPollVotes', {});
    store.set('communityLiked', {});
    store.set('communityGroups', getGroupInfo());
  }

  function render() {
    ensureMockData();
    renderLayout();
  }

  function renderLayout() {
    var html = '<div class="community-layout c-bg-primary c-radius-xl c-overflow-hidden" style="height:calc(100vh - var(--header-height, 64px) - 2rem)">';
    html += renderSidebar();
    html += renderCenterPanel();
    html += renderMembersPanel();
    html += '</div>';
    html += renderCreateCommunityModal();
    html += renderCreatePollModal();
    html += renderGroupInfoModal();
    html += renderPinnedMessagesModal();
    html += renderSharedFilesModal();
    html += renderMediaModal();
    html += renderChatSearchModal();
    container.innerHTML = html;
    bindEvents();
    selectDefaultChannel();
  }

  function renderSidebar() {
    var communities = getCommunities();
    var html = '<div class="community-sidebar c-flex c-overflow-hidden" id="community-sidebar" style="background:var(--bg-secondary);border-right:1px solid var(--border-color);flex-direction:column">';

    html += '<div class="c-p-4 c-border-bottom">';
    html += '<div class="c-flex-gap-2" style="margin-bottom:10px">';
    html += '<h2 class="c-fw-bold c-text-primary" style="margin:0;font-size:17px;flex:1">Communities</h2>';
    html += '<span class="c-fs-xs c-text-tertiary" style="background:var(--bg-glass-strong);padding:1px 7px;border-radius:8px">' + communities.length + '</span>';
    html += '<button class="btn btn-ghost btn-sm" id="create-community-btn" style="padding:4px 10px;font-size:16px;font-weight:600;border-radius:8px;color:var(--accent-blue);background:rgba(59,130,246,0.1)">+</button>';
    html += '</div>';
    html += '<div class="c-relative">';
    html += '<span class="c-absolute c-text-tertiary c-fs-sm" style="left:10px;top:50%;transform:translateY(-50%)">\uD83D\uDD0D</span>';
    html += '<input type="text" id="community-search-input" placeholder="Search communities..." class="c-w-full c-text-primary c-fs-sm" style="padding:7px 7px 7px 30px;background:var(--bg-glass-strong);border:1px solid var(--border-color);border-radius:8px;outline:none;box-sizing:border-box" />';
    html += '</div>';
    html += '</div>';

    html += '<div class="c-scroll-y" id="community-list" style="flex:1;padding:4px 0">';

    html += '<div class="c-fs-xs c-fw-semibold c-text-tertiary" style="padding:6px 12px 2px;text-transform:uppercase;letter-spacing:0.5px">Communities</div>';

    for (var ci = 0; ci < communities.length; ci++) {
      var com = communities[ci];
      var isActive = currentCommunityId === com.id;
      var activeStyle = isActive ? 'background:var(--bg-glass-strong);border-left:3px solid var(--accent-blue)' : 'border-left:3px solid transparent';

      html += '<div class="community-sidebar-item c-pointer" data-community="' + com.id + '" style="display:flex;align-items:center;gap:10px;padding:8px 12px;transition:background 0.15s;' + activeStyle + '">';
      html += '<div class="c-flex-center c-fs-lg" style="width:36px;height:36px;border-radius:10px;background:' + getGradient(ci) + ';flex-shrink:0">' + com.icon + '</div>';
      html += '<div style="flex:1;min-width:0">';
      html += '<div class="c-fw-semibold c-text-primary c-nowrap c-ellipsis" style="font-size:13px">' + sanitizeHTML(com.name) + '</div>';
      html += '<div class="c-fs-xs c-text-tertiary">' + formatNumber(com.memberCount) + ' members</div>';
      html += '</div>';
      var totalUnread = 0;
      for (var uci = 0; uci < com.channels.length; uci++) {
        totalUnread += getUnread()[com.id + '_' + com.channels[uci].id] || 0;
      }
      if (totalUnread > 0) {
        html += '<span class="c-fs-xs c-fw-semibold c-radius-full" style="background:var(--accent-red);color:#fff;padding:1px 7px;flex-shrink:0">' + (totalUnread > 99 ? '99+' : totalUnread) + '</span>';
      }
      html += '</div>';

      if (isActive) {
        html += '<div id="channels-' + com.id + '" style="background:var(--bg-secondary)">';

        for (var cati = 0; cati < CATEGORIES.length; cati++) {
          var cat = CATEGORIES[cati];
          var catChannels = [];
          for (var chi = 0; chi < com.channels.length; chi++) {
            if (com.channels[chi].category === cat.id) {
              catChannels.push(com.channels[chi]);
            }
          }
          if (catChannels.length === 0) continue;

          html += '<div class="c-fs-xs c-fw-semibold c-text-tertiary" style="padding:6px 12px 2px 16px;text-transform:uppercase;letter-spacing:0.5px;display:flex;align-items:center;gap:4px">';
          html += '<span>' + cat.icon + '</span><span>' + cat.label + '</span>';
          html += '</div>';

          for (var chi = 0; chi < catChannels.length; chi++) {
            var ch = catChannels[chi];
            var chActive = currentChannelId === ch.id;
            var unreadCount = getUnread()[com.id + '_' + ch.id] || 0;
            html += '<div class="channel-item c-pointer c-fs-sm" data-community="' + com.id + '" data-channel="' + ch.id + '" style="display:flex;align-items:center;gap:6px;padding:5px 12px 5px 24px;border-radius:6px;margin:1px 8px;color:' + (chActive ? 'var(--accent-blue)' : 'var(--text-secondary)') + ';background:' + (chActive ? 'rgba(59,130,246,0.1)' : 'transparent') + ';transition:all 0.1s">';
            html += '<span class="c-fs-xs" style="flex-shrink:0;width:14px;text-align:center">' + ch.icon + '</span>';
            html += '<span class="c-nowrap c-ellipsis" style="flex:1">' + sanitizeHTML(ch.name) + '</span>';
            if (unreadCount > 0) {
              html += '<span class="c-fs-xs c-fw-semibold" style="background:var(--accent-red);color:#fff;font-size:9px;padding:1px 6px;border-radius:8px">' + (unreadCount > 99 ? '99+' : unreadCount) + '</span>';
            }
            html += '</div>';
          }
        }
        html += '</div>';
      }
    }

    html += '<div class="c-fs-xs c-fw-semibold c-text-tertiary" style="padding:6px 12px 2px;text-transform:uppercase;letter-spacing:0.5px;margin-top:8px">Groups</div>';

    var groups = getGroupInfo();
    var groupKeys = ['teacher', 'class', 'subject'];
    for (var gti = 0; gti < groupKeys.length; gti++) {
      var gk = groupKeys[gti];
      var gLabel = GROUP_TYPES[gti].label;
      var gIcon = GROUP_TYPES[gti].icon;
      var gList = groups[gk] || [];
      if (gList.length === 0) continue;

      html += '<div class="c-fs-xs c-text-tertiary" style="padding:4px 12px 2px 16px;display:flex;align-items:center;gap:4px">';
      html += '<span>' + gIcon + '</span><span>' + gLabel + '</span>';
      html += '</div>';

      for (var gi = 0; gi < gList.length; gi++) {
        var grp = gList[gi];
        html += '<div class="group-item c-pointer c-fs-sm c-text-secondary" data-group="' + grp.id + '" style="display:flex;align-items:center;gap:8px;padding:6px 12px 6px 24px;border-radius:6px;margin:1px 8px">';
        html += '<span style="font-size:14px">' + grp.icon + '</span>';
        html += '<span class="c-nowrap c-ellipsis" style="flex:1">' + sanitizeHTML(grp.name) + '</span>';
        html += '<span class="c-fs-xs c-text-tertiary">' + grp.memberCount + '</span>';
        html += '</div>';
      }
    }

    html += '</div>';

    html += '<div class="c-flex-gap-2 c-border-top" style="padding:10px 12px">';
    html += '<div class="c-flex-center c-fw-semibold c-radius-full" style="width:28px;height:28px;background:' + getGradient(0) + ';font-size:11px;color:#fff;flex-shrink:0">' + getInitials(currentUser.name) + '</div>';
    html += '<div class="c-fs-sm c-text-primary c-fw-medium" style="flex:1">' + sanitizeHTML(currentUser.name) + '</div>';
    html += '<span class="c-fs-xs c-text-tertiary">' + getRoleBadge(currentUser.role || 'student') + '</span>';
    html += '</div>';

    html += '</div>';
    return html;
  }

  function renderCenterPanel() {
    var communities = getCommunities();
    var com = null;
    for (var ci = 0; ci < communities.length; ci++) {
      if (communities[ci].id === currentCommunityId) { com = communities[ci]; break; }
    }
    if (!com) return renderWelcomeScreen();
    var ch = null;
    for (var chi = 0; chi < com.channels.length; chi++) {
      if (com.channels[chi].id === currentChannelId) { ch = com.channels[chi]; break; }
    }
    if (!ch) return renderCommunityLanding(com);
    return renderChannelView(com, ch);
  }

  function renderMembersPanel() {
    var communities = getCommunities();
    var com = null;
    for (var ci = 0; ci < communities.length; ci++) {
      if (communities[ci].id === currentCommunityId) { com = communities[ci]; break; }
    }
    if (!com || !showMembers) {
      return '<div class="members-panel" id="members-panel" style="display:none;overflow:hidden;background:var(--bg-secondary);border-left:1px solid var(--border-color);transition:width 0.2s ease"></div>';
    }
    var members = getMembers(com.id);
    var onlineList = [];
    var offlineList = [];
    for (var mi = 0; mi < members.length; mi++) {
      if (members[mi].online) onlineList.push(members[mi]);
      else offlineList.push(members[mi]);
    }

    var html = '<div class="members-panel c-overflow-hidden" id="members-panel" style="background:var(--bg-secondary);border-left:1px solid var(--border-color);flex-direction:column">';

    html += '<div class="c-border-bottom" style="padding:14px 12px">';
    html += '<div class="c-flex-gap-2" style="margin-bottom:10px">';
    html += '<h3 class="c-fs-base c-fw-semibold c-text-primary" style="margin:0;flex:1">Members</h3>';
    html += '<span class="c-fs-xs c-text-tertiary" style="background:var(--bg-glass-strong);padding:1px 7px;border-radius:8px">' + members.length + '</span>';
    html += '<button class="btn btn-ghost btn-sm c-fs-base c-text-tertiary" id="close-members-btn" style="padding:2px 6px">\u2715</button>';
    html += '</div>';
    html += '<div class="c-relative">';
    html += '<span class="c-absolute c-text-tertiary c-fs-sm" style="left:10px;top:50%;transform:translateY(-50%)">\uD83D\uDD0D</span>';
    html += '<input type="text" id="member-search-input" placeholder="Search members..." class="c-w-full c-text-primary c-fs-sm" style="padding:7px 7px 7px 30px;background:var(--bg-glass-strong);border:1px solid var(--border-color);border-radius:8px;outline:none;box-sizing:border-box" />';
    html += '</div>';
    html += '</div>';

    html += '<div class="c-scroll-y" id="member-list" style="flex:1;padding:4px 0">';

    var search = memberSearchQuery.toLowerCase().trim();

    html += '<div class="c-fw-semibold c-fs-xs" style="padding:6px 12px 2px;color:var(--accent-green);display:flex;align-items:center;gap:4px">';
    html += '<span class="c-inline-block c-radius-full" style="width:6px;height:6px;background:#22c55e"></span>';
    html += 'Online \u2014 ' + onlineList.length;
    html += '</div>';

    for (var mi = 0; mi < onlineList.length; mi++) {
      var m = onlineList[mi];
      if (search && m.name.toLowerCase().indexOf(search) === -1) continue;
      html += '<div class="member-item c-pointer" data-member="' + m.id + '" style="display:flex;align-items:center;gap:8px;padding:6px 12px;border-radius:6px;margin:1px 4px">';
      html += '<div class="c-relative">';
      html += '<div class="c-flex-center c-fw-semibold c-radius-full" style="width:30px;height:30px;background:' + getGradient(mi) + ';font-size:11px;color:#fff">' + getInitials(m.name) + '</div>';
      html += '<div class="c-absolute c-radius-full" style="bottom:-1px;right:-1px;width:10px;height:10px;background:#22c55e;border:2px solid var(--bg-secondary)"></div>';
      html += '</div>';
      html += '<div style="flex:1;min-width:0">';
      html += '<div class="c-fs-sm c-fw-medium c-text-primary c-nowrap c-ellipsis">' + sanitizeHTML(m.name) + '</div>';
      html += '</div>';
      html += getRoleBadge(m.role);
      html += '</div>';
    }

    html += '<div class="c-fw-semibold c-fs-xs c-text-tertiary" style="padding:6px 12px 2px;display:flex;align-items:center;gap:4px;margin-top:4px">';
    html += '<span class="c-inline-block c-radius-full" style="width:6px;height:6px;background:#6b7280"></span>';
    html += 'Offline \u2014 ' + offlineList.length;
    html += '</div>';

    for (var mi = 0; mi < offlineList.length; mi++) {
      var m = offlineList[mi];
      if (search && m.name.toLowerCase().indexOf(search) === -1) continue;
      html += '<div class="member-item c-pointer" data-member="' + m.id + '" style="display:flex;align-items:center;gap:8px;padding:6px 12px;border-radius:6px;margin:1px 4px">';
      html += '<div class="c-relative">';
      html += '<div class="c-flex-center c-fw-semibold c-radius-full" style="width:30px;height:30px;background:' + getGradient(mi + 50) + ';font-size:11px;color:#fff">' + getInitials(m.name) + '</div>';
      html += '<div class="c-absolute c-radius-full" style="bottom:-1px;right:-1px;width:10px;height:10px;background:#6b7280;border:2px solid var(--bg-secondary)"></div>';
      html += '</div>';
      html += '<div style="flex:1;min-width:0">';
      html += '<div class="c-fs-sm c-fw-medium c-text-primary c-nowrap c-ellipsis">' + sanitizeHTML(m.name) + '</div>';
      html += '</div>';
      html += getRoleBadge(m.role);
      html += '</div>';
    }

    html += '</div></div>';
    return html;
  }

  function renderWelcomeScreen() {
    var communities = getCommunities();
    var html = '<div class="community-center c-bg-primary c-text-center" style="flex:1;display:flex;flex-direction:column;align-items:center;justify-content:center;padding:40px">';
    html += '<div class="c-mb-2" style="font-size:56px">\uD83D\uDCAC</div>';
    html += '<h2 class="c-fw-bold c-text-primary" style="margin:0 0 6px;font-size:20px">Welcome to Communities</h2>';
    html += '<p class="c-text-secondary" style="margin:0 0 20px;font-size:13px;max-width:380px">Select a community from the sidebar to start connecting with fellow students and mentors.</p>';
    html += '<div class="c-flex c-flex-wrap c-text-center" style="gap:6px;max-width:360px">';
    for (var ci = 0; ci < communities.length; ci++) {
      html += '<span class="c-fs-sm c-text-secondary" style="background:var(--bg-glass-strong);padding:5px 12px;border-radius:16px">' + communities[ci].icon + ' ' + sanitizeHTML(communities[ci].name) + '</span>';
    }
    html += '</div>';
    html += '</div>';
    return html;
  }

  function renderCommunityLanding(com) {
    var members = getMembers(com.id);
    var onlineCount = 0;
    for (var mi = 0; mi < members.length; mi++) {
      if (members[mi].online) onlineCount++;
    }
    var html = '<div class="community-center c-bg-primary c-overflow-hidden" style="flex:1;display:flex;flex-direction:column">';

    html += '<div class="c-border-bottom" style="padding:20px 24px">';
    html += '<div style="display:flex;align-items:center;gap:14px;margin-bottom:10px">';
    html += '<div class="c-flex-center c-fs-xl" style="width:48px;height:48px;border-radius:14px;background:' + getGradient(0) + ';flex-shrink:0">' + com.icon + '</div>';
    html += '<div><h2 class="c-fw-bold c-text-primary" style="margin:0;font-size:18px">' + sanitizeHTML(com.name) + '</h2>';
    html += '<div class="c-fs-xs c-text-tertiary c-mt-1">ID: COM-' + com.id + '</div>';
    html += '<p class="c-fs-sm c-text-secondary" style="margin:1px 0 0">' + sanitizeHTML(com.description) + '</p></div>';
    html += '</div>';
    html += '<div class="c-fs-sm c-text-tertiary" style="display:flex;gap:12px">';
    html += '<span>\uD83D\uDC65 ' + formatNumber(com.memberCount) + ' members</span>';
    html += '<span>\uD83D\uDDFC\uFE0F ' + com.channels.length + ' channels</span>';
    html += '<span>\uD83D\uDEE0\uFE0F ' + onlineCount + ' online</span>';
    html += '</div>';
    html += '</div>';

    html += '<div class="c-scroll-y" style="flex:1;padding:20px 24px">';
    html += '<h3 class="c-fs-base c-fw-semibold c-text-primary" style="margin:0 0 12px">Channels</h3>';
    html += '<div class="c-grid" style="grid-template-columns:repeat(auto-fill,minmax(200px,1fr));gap:10px">';
    for (var chi = 0; chi < com.channels.length; chi++) {
      var ch = com.channels[chi];
      var unread = getUnread()[com.id + '_' + ch.id] || 0;
      html += '<div class="channel-landing-card c-pointer c-relative" data-community="' + com.id + '" data-channel="' + ch.id + '" style="background:var(--bg-glass-strong);border:1px solid var(--border-color);border-radius:10px;padding:14px;transition:all 0.15s">';
      html += '<div class="c-flex-gap-2" style="margin-bottom:6px">';
      html += '<span style="font-size:16px">' + ch.icon + '</span>';
      html += '<span class="c-fw-semibold c-text-primary" style="font-size:13px">' + sanitizeHTML(ch.name) + '</span>';
      if (unread > 0) {
        html += '<span style="background:var(--accent-red);color:#fff;font-size:9px;padding:1px 6px;border-radius:8px;margin-left:auto">' + unread + '</span>';
      }
      html += '</div>';
      html += '<div class="c-fs-xs c-text-tertiary">' + getChannelTopic(ch.type) + '</div>';
      html += '<div class="c-fs-xs c-text-tertiary c-mt-2">\uD83D\uDC65 ' + formatNumber(ch.memberCount) + '</div>';
      html += '</div>';
    }
    html += '</div>';

    html += '<h3 class="c-fs-base c-fw-semibold c-text-primary" style="margin:20px 0 10px">Online Members</h3>';
    html += '<div class="c-flex c-flex-wrap" style="gap:6px">';
    var shown = {};
    var topCount = 0;
    for (var mi = 0; mi < members.length && topCount < 12; mi++) {
      var m = members[mi];
      if (!shown[m.name] && m.online) {
        shown[m.name] = true;
        topCount++;
        html += '<div class="c-fs-xs" style="display:flex;align-items:center;gap:5px;background:var(--bg-glass-strong);padding:3px 8px 3px 3px;border-radius:16px">';
        html += getOnlineDot(m.online);
        html += '<span>' + sanitizeHTML(m.name) + '</span>';
        html += getRoleBadge(m.role);
        html += '</div>';
      }
    }
    html += '</div>';
    html += '</div>';

    html += '</div>';
    return html;
  }

  function renderChannelView(com, ch) {
    var messages = getMessages(com.id, ch.id);
    var members = getMembers(com.id);
    var isAnnouncements = ch.type === 'announcements';
    var pinnedIds = getPinned(com.id, ch.id);
    var pinnedMsgs = [];
    for (var pi = 0; pi < messages.length; pi++) {
      if (messages[pi].isPinned || pinnedIds.indexOf(messages[pi].id) !== -1) {
        pinnedMsgs.push(messages[pi]);
      }
    }

    var html = '<div class="community-center c-bg-primary c-overflow-hidden" style="flex:1;display:flex;flex-direction:column">';

    html += '<div class="c-border-bottom c-bg-card" style="padding:10px 16px;display:flex;align-items:center;gap:10px;flex-shrink:0">';
    html += '<span class="c-text-center c-fs-lg" style="width:20px">' + ch.icon + '</span>';
    html += '<div style="flex:1;min-width:0">';
    html += '<div class="c-fs-base c-fw-semibold c-text-primary" style="display:flex;align-items:center;gap:6px">';
    html += '#' + sanitizeHTML(ch.name);
    if (isAnnouncements) {
      html += '<span style="font-size:9px;background:rgba(245,158,11,0.15);color:var(--accent-orange);padding:1px 5px;border-radius:3px;border:1px solid rgba(245,158,11,0.3);font-weight:500">\uD83D\uDCE2 Announcements</span>';
    }
    html += '</div>';
    html += '<div class="c-fs-xs c-text-tertiary">' + sanitizeHTML(ch.topic) + ' \u00B7 ' + formatNumber(ch.memberCount) + ' members</div>';
    html += '</div>';
    html += '<div style="display:flex;gap:2px;align-items:center">';
    html += '<button class="btn btn-ghost btn-sm action-bar-btn c-text-tertiary" id="search-channel-btn" title="Search in channel" style="padding:5px 8px;font-size:13px">\uD83D\uDD0D</button>';
    html += '<button class="btn btn-ghost btn-sm action-bar-btn c-text-tertiary" id="pinned-msgs-btn" title="Pinned Messages" style="padding:5px 8px;font-size:13px">\uD83D\uDCCC</button>';
    html += '<button class="btn btn-ghost btn-sm action-bar-btn c-text-tertiary" id="shared-files-btn" title="Shared Files" style="padding:5px 8px;font-size:13px">\uD83D\uDCCE</button>';
    html += '<button class="btn btn-ghost btn-sm action-bar-btn c-text-tertiary" id="media-btn" title="Media" style="padding:5px 8px;font-size:13px">\uD83D\uDCF7</button>';
    html += '<button class="btn btn-ghost btn-sm action-bar-btn c-text-tertiary" id="notification-btn" title="Notifications" style="padding:5px 8px;font-size:13px">\uD83D\uDD14</button>';
    html += '<button class="btn btn-ghost btn-sm action-bar-btn" id="toggle-members-btn" title="Toggle Members" style="padding:5px 8px;font-size:13px;color:var(--accent-blue)">\uD83D\uDC65</button>';
    html += '</div>';
    html += '</div>';

    if (pinnedMsgs.length > 0 && showPinned) {
      html += '<div class="c-pointer" id="pinned-bar" style="padding:6px 16px;background:rgba(234,179,8,0.06);border-bottom:1px solid rgba(234,179,8,0.12);display:flex;align-items:center;gap:8px;flex-shrink:0">';
      html += '<span class="c-fs-xs" style="color:#eab308">\uD83D\uDCCC</span>';
      html += '<span class="c-fs-xs c-text-secondary c-fw-medium">Pinned</span>';
      html += '<span class="c-fs-xs c-text-tertiary c-nowrap c-ellipsis" style="flex:1">' + sanitizeHTML(pinnedMsgs[0].content) + '</span>';
      if (pinnedMsgs.length > 1) {
        html += '<span class="c-fs-xs" style="color:var(--accent-blue)">+' + (pinnedMsgs.length - 1) + ' more</span>';
      }
      html += '<span class="c-fs-xs c-text-tertiary">\u2197</span>';
      html += '</div>';
    }

    html += '<div class="message-list c-scroll-y c-p-3" id="message-list" style="flex:1;display:flex;flex-direction:column">';
    for (var mi = 0; mi < messages.length; mi++) {
      html += renderMessage(com, ch, messages[mi], mi);
    }
    html += '<div id="typing-indicator" class="c-fs-sm c-text-tertiary" style="display:none;padding:6px 0"><span style="display:inline-flex;gap:2px"><span class="c-radius-full" style="width:5px;height:5px;background:var(--text-tertiary);animation:bounce 1.4s infinite ease-in-out"></span><span class="c-radius-full" style="width:5px;height:5px;background:var(--text-tertiary);animation:bounce 1.4s infinite ease-in-out 0.2s"></span><span class="c-radius-full" style="width:5px;height:5px;background:var(--text-tertiary);animation:bounce 1.4s infinite ease-in-out 0.4s"></span></span> Someone is typing...</div>';
    html += '</div>';

    html += '<div class="c-border-top c-bg-card" style="padding:10px 16px 12px;flex-shrink:0">';
    html += '<div style="display:flex;gap:6px;align-items:flex-end">';
    html += '<div style="display:flex;gap:1px;align-items:center;padding-bottom:4px">';
    html += '<button class="btn btn-ghost btn-sm input-tool-btn c-text-tertiary" id="attach-image-btn" title="Image" style="padding:4px 6px;font-size:15px">\uD83D\uDCF7</button>';
    html += '<button class="btn btn-ghost btn-sm input-tool-btn c-text-tertiary" id="attach-file-btn" title="File" style="padding:4px 6px;font-size:15px">\uD83D\uDCCE</button>';
    html += '<button class="btn btn-ghost btn-sm input-tool-btn c-text-tertiary" id="create-poll-btn" title="Poll" style="padding:4px 6px;font-size:15px">\uD83D\uDCCA</button>';
    html += '</div>';
    html += '<div class="c-relative" style="flex:1">';
    html += '<textarea id="message-input" placeholder="Message #' + sanitizeHTML(ch.name) + '" class="c-w-full c-text-primary c-fs-sm" style="padding:8px 10px;background:var(--bg-glass-strong);border:1px solid var(--border-color);border-radius:10px;outline:none;resize:none;max-height:100px;box-sizing:border-box;font-family:inherit" rows="1"></textarea>';
    html += '</div>';
    html += '<button class="btn btn-primary btn-sm" id="send-message-btn" style="padding:7px 12px;font-size:14px;border-radius:10px">\u27A1\uFE0F</button>';
    html += '</div>';
    html += '</div>';

    html += '</div>';
    return html;
  }

  function renderMessage(com, ch, msg, idx) {
    var liked = isLiked(com.id, ch.id, msg.id);
    var isPinned = msg.isPinned;
    var isAnnouncement = msg.type === 'announcement';
    var reactions = getReactions(msg.id);
    var reactionKeys = Object.keys(reactions);

    var html = '<div class="message-item c-flex-gap-2" data-msg="' + msg.id + '" style="padding:6px 0;animation:fadeIn 0.15s ease;' + (isPinned ? 'background:rgba(234,179,8,0.03);border-radius:6px;padding:6px 8px;margin:1px 0' : '') + '">';
    html += '<div class="c-flex-center c-fw-semibold c-radius-full c-fs-sm" style="width:32px;height:32px;background:' + getGradient(idx) + ';color:#fff;flex-shrink:0;margin-top:2px">' + getInitials(msg.author) + '</div>';
    html += '<div style="flex:1;min-width:0">';
    html += '<div class="c-flex-wrap" style="display:flex;align-items:center;gap:4px;margin-bottom:1px">';
    html += '<span class="c-fs-sm c-fw-semibold c-text-primary">' + sanitizeHTML(msg.author) + '</span>';
    html += getRoleBadge(msg.authorRole || 'student');
    html += '<span class="c-fs-xs c-text-tertiary">ID: MSG-' + msg.id + '</span>';
    html += '<span class="c-fs-xs c-text-tertiary">' + formatRelativeTime(msg.createdAt) + '</span>';
    if (isPinned) {
      html += '<span style="font-size:9px;color:#eab308">\uD83D\uDCCC</span>';
    }
    if (isAnnouncement) {
      html += '<span style="font-size:9px;background:rgba(245,158,11,0.12);color:var(--accent-orange);padding:1px 5px;border-radius:3px;font-weight:500">\uD83D\uDCE2 Announcement</span>';
    }
    html += '</div>';

    if (msg.type === 'text' || msg.type === 'announcement') {
      html += '<div class="c-fs-sm c-text-primary" style="line-height:1.45;margin-bottom:3px;word-wrap:break-word">' + sanitizeHTML(msg.content) + '</div>';
    } else if (msg.type === 'poll') {
      html += renderPollInMessage(msg);
    } else if (msg.type === 'file') {
      var fe = msg.extra || {};
      html += '<div style="display:flex;align-items:center;gap:8px;background:var(--bg-glass-strong);padding:8px 12px;border-radius:8px;margin:3px 0;max-width:300px">';
      html += '<span style="font-size:20px">' + getFileIcon(fe.fileType) + '</span>';
      html += '<div><div class="c-fs-sm c-fw-medium c-text-primary">' + sanitizeHTML(fe.fileName) + '</div>';
      html += '<div class="c-fs-xs c-text-tertiary">' + (fe.fileSize || '') + ' \u00B7 ' + (fe.fileType || '').toUpperCase() + '</div></div>';
      html += '</div>';
    } else if (msg.type === 'image') {
      html += '<div style="margin:3px 0"><div class="c-flex-center" style="width:200px;height:140px;background:' + getGradient(idx + 10) + ';border-radius:10px;font-size:32px">\uD83D\uDCF7</div></div>';
    }

    if (reactionKeys.length > 0) {
      html += '<div class="c-flex-wrap" style="display:flex;gap:4px;margin:3px 0">';
      for (var ri = 0; ri < reactionKeys.length; ri++) {
        var em = reactionKeys[ri];
        var users = reactions[em] || [];
        html += '<span class="reaction-badge c-pointer" data-msg="' + msg.id + '" data-emoji="' + em + '" style="font-size:11px;background:rgba(59,130,246,0.08);border:1px solid rgba(59,130,246,0.15);border-radius:6px;padding:1px 5px;display:flex;align-items:center;gap:2px">';
        html += '<span>' + em + '</span><span class="c-fs-xs c-text-tertiary">' + users.length + '</span>';
        html += '</span>';
      }
      html += '</div>';
    }

    html += '<div class="c-flex-gap-2 c-mt-2">';
    var likeClass = liked ? ' style="color:var(--accent-red)"' : '';
    html += '<button class="msg-action-btn like-msg-btn c-pointer" data-msg="' + msg.id + '"' + likeClass + ' style="background:none;border:none;font-size:11px;color:var(--text-tertiary);display:flex;align-items:center;gap:2px;padding:1px 3px;border-radius:4px;transition:all 0.1s">' + (liked ? '\u2764\uFE0F' : '\uD83D\uDC96') + ' <span class="c-fs-xs">' + (msg.likes || 0) + '</span></button>';
    if (!isAnnouncement) {
      html += '<button class="msg-action-btn reply-msg-btn c-pointer" data-msg="' + msg.id + '" style="background:none;border:none;font-size:11px;color:var(--text-tertiary);display:flex;align-items:center;gap:2px;padding:1px 3px;border-radius:4px;transition:all 0.1s">\uD83D\uDCAC <span class="c-fs-xs">Reply</span></button>';
    }
    html += '<button class="msg-action-btn react-msg-btn c-pointer" data-msg="' + msg.id + '" style="background:none;border:none;font-size:11px;color:var(--text-tertiary);display:flex;align-items:center;gap:2px;padding:1px 3px;border-radius:4px;transition:all 0.1s">\uD83D\uDE00 <span class="c-fs-xs">React</span></button>';
    html += '<button class="msg-action-btn share-msg-btn c-pointer" data-msg="' + msg.id + '" style="background:none;border:none;font-size:11px;color:var(--text-tertiary);display:flex;align-items:center;gap:2px;padding:1px 3px;border-radius:4px;transition:all 0.1s">\uD83D\uDCE4 <span class="c-fs-xs">Share</span></button>';
    if (msg.replyCount > 0) {
      html += '<span class="c-fs-xs c-pointer" style="color:var(--accent-blue)">' + msg.replyCount + ' replies \u2193</span>';
    }
    html += '</div>';

    html += '</div></div>';
    return html;
  }

  function renderPollInMessage(msg) {
    var extra = msg.extra || {};
    var options = extra.options || [];
    var votes = extra.votes || [];
    var totalVotes = extra.totalVotes || votes.reduce(function(a, b) { return a + b; }, 0);
    var storedPollVotes = store.get('communityPollVotes') || {};
    var voted = storedPollVotes[msg.id] !== undefined;
    var votedIdx = storedPollVotes[msg.id];

    var html = '<div class="c-border" style="background:var(--bg-glass-strong);border-radius:10px;padding:10px 12px;margin:3px 0 4px;max-width:380px">';
    html += '<div class="c-fw-semibold c-text-primary c-fs-sm" style="margin-bottom:6px">\uD83D\uDCCA ' + sanitizeHTML(msg.content) + '</div>';
    html += '<div style="display:flex;flex-direction:column;gap:4px">';
    for (var oi = 0; oi < options.length; oi++) {
      var pct = totalVotes > 0 ? Math.round((votes[oi] || 0) / totalVotes * 100) : 0;
      var isVoted = voted && oi === votedIdx;
      html += '<div class="poll-option-item c-pointer c-relative c-overflow-hidden" data-poll="' + msg.id + '" data-opt="' + oi + '" style="padding:5px 8px;border-radius:6px;background:' + (isVoted ? 'rgba(59,130,246,0.1)' : 'transparent') + ';border:1px solid ' + (isVoted ? 'rgba(59,130,246,0.25)' : 'var(--border-color)') + '">';
      if (voted) {
        html += '<div class="c-absolute" style="top:0;left:0;bottom:0;width:' + pct + '%;background:rgba(59,130,246,0.06);transition:width 0.3s ease;border-radius:6px"></div>';
      }
      html += '<div class="c-relative c-flex-between">';
      html += '<span class="c-fs-xs c-text-primary">' + sanitizeHTML(options[oi]) + '</span>';
      if (voted) {
        html += '<span class="c-fs-xs c-text-tertiary">' + (votes[oi] || 0) + ' (' + pct + '%)</span>';
      }
      html += '</div></div>';
    }
    html += '</div>';
    html += '<div class="c-fs-xs c-text-tertiary" style="margin-top:5px">' + totalVotes + ' votes' + (voted ? ' \u00B7 You voted' : ' \u00B7 Click to vote') + '</div>';
    html += '</div>';
    return html;
  }

  function renderCreateCommunityModal() {
    return '<div id="create-community-modal" class="c-fixed c-flex-center c-z-1000" style="display:none;top:0;left:0;right:0;bottom:0;background:rgba(0,0,0,0.5);backdrop-filter:blur(4px)">' +
      '<div class="c-shadow-lg" style="background:var(--bg-secondary);border-radius:14px;width:380px;max-width:90vw;padding:22px">' +
      '<h3 class="c-fw-bold c-text-primary" style="margin:0 0 14px;font-size:16px">Create Community</h3>' +
      '<div class="c-flex-gap-3" style="flex-direction:column">' +
      '<div><label class="c-fs-xs c-fw-medium c-text-secondary c-block" style="margin-bottom:3px">Community Name</label><input type="text" id="new-community-name" placeholder="e.g., Science Enthusiasts" class="c-w-full c-text-primary c-fs-sm" style="padding:9px;background:var(--bg-glass-strong);border:1px solid var(--border-color);border-radius:8px;outline:none;box-sizing:border-box"></div>' +
      '<div><label class="c-fs-xs c-fw-medium c-text-secondary c-block" style="margin-bottom:3px">Icon (emoji)</label><input type="text" id="new-community-icon" placeholder="e.g., \uD83D\uDD2C" value="\uD83D\uDD2C" class="c-w-full c-text-primary c-fs-sm" style="padding:9px;background:var(--bg-glass-strong);border:1px solid var(--border-color);border-radius:8px;outline:none;box-sizing:border-box"></div>' +
      '<div><label class="c-fs-xs c-fw-medium c-text-secondary c-block" style="margin-bottom:3px">Description</label><textarea id="new-community-desc" placeholder="What is this community about?" class="c-w-full c-text-primary c-fs-sm" style="padding:9px;background:var(--bg-glass-strong);border:1px solid var(--border-color);border-radius:8px;outline:none;resize:none;height:50px;box-sizing:border-box;font-family:inherit"></textarea></div>' +
      '<div class="c-flex-gap-2 c-mt-2">' +
      '<button class="btn btn-secondary btn-sm c-fs-sm" id="cancel-create-community" style="flex:1">Cancel</button>' +
      '<button class="btn btn-primary btn-sm c-fs-sm" id="confirm-create-community" style="flex:1">Create</button>' +
      '</div></div></div></div>';
  }

  function renderCreatePollModal() {
    var html = '<div id="create-poll-modal" class="c-fixed c-flex-center c-z-1000" style="display:none;top:0;left:0;right:0;bottom:0;background:rgba(0,0,0,0.5);backdrop-filter:blur(4px)">' +
      '<div class="c-shadow-lg" style="background:var(--bg-secondary);border-radius:14px;width:400px;max-width:90vw;padding:22px">' +
      '<h3 class="c-fw-bold c-text-primary" style="margin:0 0 14px;font-size:16px">\uD83D\uDCCA Create Poll</h3>' +
      '<div style="display:flex;flex-direction:column;gap:8px">' +
      '<div><label class="c-fs-xs c-fw-medium c-text-secondary c-block" style="margin-bottom:3px">Question</label><input type="text" id="poll-question-input" placeholder="Ask a question..." class="c-w-full c-text-primary c-fs-sm" style="padding:9px;background:var(--bg-glass-strong);border:1px solid var(--border-color);border-radius:8px;outline:none;box-sizing:border-box"></div>' +
      '<div id="poll-options-container"><label class="c-fs-xs c-fw-medium c-text-secondary c-block" style="margin-bottom:3px">Options (2-5)</label>';
    for (var poi = 0; poi < 5; poi++) {
      html += '<input type="text" class="poll-option-input c-w-full c-text-primary c-fs-sm" data-idx="' + poi + '" placeholder="Option ' + (poi + 1) + '" style="padding:7px 9px;background:var(--bg-glass-strong);border:1px solid var(--border-color);border-radius:6px;outline:none;box-sizing:border-box;margin-bottom:5px">';
    }
    html += '</div>' +
      '<div class="c-flex-gap-2 c-mt-2">' +
      '<button class="btn btn-secondary btn-sm c-fs-sm" id="cancel-create-poll" style="flex:1">Cancel</button>' +
      '<button class="btn btn-primary btn-sm c-fs-sm" id="confirm-create-poll" style="flex:1">Create Poll</button>' +
      '</div></div></div></div>';
    return html;
  }

  function renderGroupInfoModal() {
    return '<div id="group-info-modal" class="c-fixed c-flex-center c-z-1000" style="display:none;top:0;left:0;right:0;bottom:0;background:rgba(0,0,0,0.5);backdrop-filter:blur(4px)">' +
      '<div class="c-shadow-lg" style="background:var(--bg-secondary);border-radius:14px;width:340px;max-width:90vw;padding:22px">' +
      '<h3 class="c-fw-bold c-text-primary" style="margin:0 0 12px;font-size:16px" id="group-info-name"></h3>' +
      '<div class="c-fs-sm c-text-secondary" style="margin-bottom:10px" id="group-info-desc"></div>' +
      '<div class="c-fs-xs c-text-tertiary" style="margin-bottom:4px" id="group-info-created"></div>' +
      '<div class="c-fs-xs c-text-tertiary" style="margin-bottom:14px" id="group-info-members"></div>' +
      '<button class="btn btn-primary btn-sm btn-block c-fs-sm" id="close-group-info" style="width:100%">Close</button>' +
      '</div></div>';
  }

  function renderPinnedMessagesModal() {
    return '<div id="pinned-msgs-modal" class="c-fixed c-flex-center c-z-1000" style="display:none;top:0;left:0;right:0;bottom:0;background:rgba(0,0,0,0.5);backdrop-filter:blur(4px)">' +
      '<div class="c-shadow-lg c-overflow-hidden c-flex" style="background:var(--bg-secondary);border-radius:14px;width:480px;max-width:90vw;max-height:70vh;flex-direction:column">' +
      '<div class="c-flex-between c-border-bottom" style="padding:14px 18px">' +
      '<h3 class="c-fw-semibold c-text-primary" style="margin:0;font-size:15px">\uD83D\uDCCC Pinned Messages</h3>' +
      '<button class="btn btn-ghost btn-sm" id="close-pinned-modal" style="font-size:16px;padding:2px 6px">&times;</button>' +
      '</div>' +
      '<div id="pinned-msgs-content" class="c-scroll-y" style="flex:1;padding:10px 16px"></div>' +
      '</div></div>';
  }

  function renderSharedFilesModal() {
    return '<div id="shared-files-modal" class="c-fixed c-flex-center c-z-1000" style="display:none;top:0;left:0;right:0;bottom:0;background:rgba(0,0,0,0.5);backdrop-filter:blur(4px)">' +
      '<div class="c-shadow-lg c-overflow-hidden c-flex" style="background:var(--bg-secondary);border-radius:14px;width:480px;max-width:90vw;max-height:70vh;flex-direction:column">' +
      '<div class="c-flex-between c-border-bottom" style="padding:14px 18px">' +
      '<h3 class="c-fw-semibold c-text-primary" style="margin:0;font-size:15px">\uD83D\uDCCE Shared Files</h3>' +
      '<button class="btn btn-ghost btn-sm" id="close-files-modal" style="font-size:16px;padding:2px 6px">&times;</button>' +
      '</div>' +
      '<div id="shared-files-content" class="c-scroll-y" style="flex:1;padding:10px 16px"></div>' +
      '</div></div>';
  }

  function renderMediaModal() {
    return '<div id="media-modal" class="c-fixed c-flex-center c-z-1000" style="display:none;top:0;left:0;right:0;bottom:0;background:rgba(0,0,0,0.5);backdrop-filter:blur(4px)">' +
      '<div class="c-shadow-lg c-overflow-hidden c-flex" style="background:var(--bg-secondary);border-radius:14px;width:480px;max-width:90vw;max-height:70vh;flex-direction:column">' +
      '<div class="c-flex-between c-border-bottom" style="padding:14px 18px">' +
      '<h3 class="c-fw-semibold c-text-primary" style="margin:0;font-size:15px">\uD83D\uDCF7 Media</h3>' +
      '<button class="btn btn-ghost btn-sm" id="close-media-modal" style="font-size:16px;padding:2px 6px">&times;</button>' +
      '</div>' +
      '<div id="media-content" class="c-scroll-y c-grid" style="flex:1;padding:10px 16px;grid-template-columns:repeat(3,1fr);gap:8px"></div>' +
      '</div></div>';
  }

  function renderChatSearchModal() {
    return '<div id="chat-search-modal" class="c-fixed c-z-1000" style="display:none;top:0;left:0;right:0;bottom:0;background:rgba(0,0,0,0.5);backdrop-filter:blur(4px);justify-content:center;align-items:flex-start;padding-top:80px">' +
      '<div class="c-shadow-lg c-overflow-hidden c-flex" style="background:var(--bg-secondary);border-radius:14px;width:480px;max-width:90vw;max-height:70vh;flex-direction:column">' +
      '<div class="c-border-bottom" style="padding:14px 18px">' +
      '<div class="c-relative">' +
      '<span class="c-absolute c-text-tertiary c-fs-base" style="left:10px;top:50%;transform:translateY(-50%)">\uD83D\uDD0D</span>' +
      '<input type="text" id="chat-search-input" placeholder="Search in channel..." class="c-w-full c-text-primary" style="padding:9px 9px 9px 32px;background:var(--bg-glass-strong);border:1px solid var(--border-color);border-radius:8px;font-size:13px;outline:none;box-sizing:border-box" autofocus />' +
      '</div></div>' +
      '<div id="chat-search-results" class="c-scroll-y" style="flex:1;padding:6px 0"></div>' +
      '</div></div>';
  }

  function selectDefaultChannel() {
    var communities = getCommunities();
    if (!currentCommunityId && communities.length > 0) {
      currentCommunityId = communities[0].id;
    }
    var com = null;
    for (var ci = 0; ci < communities.length; ci++) {
      if (communities[ci].id === currentCommunityId) { com = communities[ci]; break; }
    }
    if (com && !currentChannelId && com.channels.length > 0) {
      currentChannelId = com.channels[0].id;
    }
    refreshCenter();
  }

  function refreshCenter() {
    var communityLayout = container.querySelector('.community-layout');
    if (communityLayout) {
      var existingCenter = communityLayout.querySelector('.community-center');
      var existingMembers = communityLayout.querySelector('.members-panel');
      var sidebar = communityLayout.querySelector('.community-sidebar');

      communityLayout.innerHTML = '';
      if (sidebar) communityLayout.appendChild(sidebar);

      var tempDiv = document.createElement('div');
      tempDiv.innerHTML = renderCenterPanel();
      while (tempDiv.firstChild) {
        communityLayout.appendChild(tempDiv.firstChild);
      }

      if (existingMembers) {
        communityLayout.appendChild(existingMembers);
      } else {
        var tempDiv2 = document.createElement('div');
        tempDiv2.innerHTML = renderMembersPanel();
        while (tempDiv2.firstChild) {
          communityLayout.appendChild(tempDiv2.firstChild);
        }
      }
    } else {
      renderLayout();
    }
    bindEvents();
    scrollToBottom();
  }

  function scrollToBottom() {
    setTimeout(function() {
      var msgList = document.getElementById('message-list');
      if (msgList) {
        msgList.scrollTop = msgList.scrollHeight;
      }
    }, 50);
  }

  function sendMessage(text) {
    if (!text || !text.trim()) return;
    var communities = getCommunities();
    var com = null;
    for (var ci = 0; ci < communities.length; ci++) {
      if (communities[ci].id === currentCommunityId) { com = communities[ci]; break; }
    }
    if (!com) return;
    var messages = getMessages(com.id, currentChannelId);
    var msg = {
      id: generateId(),
      type: 'text',
      author: currentUser.name,
      authorRole: currentUser.role || 'student',
      content: text.trim(),
      extra: null,
      likes: 0,
      likedBy: [],
      replyCount: 0,
      isPinned: false,
      createdAt: new Date().toISOString()
    };
    messages.push(msg);
    setMessages(com.id, currentChannelId, messages);
    var msgList = document.getElementById('message-list');
    if (msgList) {
      var tempDiv = document.createElement('div');
      tempDiv.innerHTML = renderMessage(com, { id: currentChannelId }, msg, messages.length - 1);
      var msgEl = tempDiv.firstChild;
      if (msgEl) {
        var typingEl = document.getElementById('typing-indicator');
        if (typingEl) {
          msgList.insertBefore(msgEl, typingEl);
        } else {
          msgList.appendChild(msgEl);
        }
        msgList.scrollTop = msgList.scrollHeight;
      }
    }
    var input = document.getElementById('message-input');
    if (input) input.value = '';
    bindEvents();
  }

  function switchCommunity(comId) {
    currentCommunityId = comId;
    currentChannelId = null;
    var communities = getCommunities();
    for (var ci = 0; ci < communities.length; ci++) {
      if (communities[ci].id === comId) {
        if (communities[ci].channels.length > 0) {
          currentChannelId = communities[ci].channels[0].id;
        }
        break;
      }
    }
    renderLayout();
  }

  function switchChannel(comId, chId) {
    currentCommunityId = comId;
    currentChannelId = chId;
    markRead(comId, chId);
    refreshCenter();
  }

  function updateSidebarSelection() {
    var items = document.querySelectorAll('.community-sidebar-item');
    for (var i = 0; i < items.length; i++) {
      var comId = items[i].dataset.community;
      if (comId === currentCommunityId) {
        items[i].style.background = 'var(--bg-glass-strong)';
        items[i].style.borderLeft = '3px solid var(--accent-blue)';
      } else {
        items[i].style.background = '';
        items[i].style.borderLeft = '3px solid transparent';
      }
    }
    var channels = document.querySelectorAll('.channel-item');
    for (var i = 0; i < channels.length; i++) {
      var chId = channels[i].dataset.channel;
      if (chId === currentChannelId) {
        channels[i].style.background = 'rgba(59,130,246,0.1)';
        channels[i].style.color = 'var(--accent-blue)';
      } else {
        channels[i].style.background = '';
        channels[i].style.color = '';
      }
    }
  }

  function bindEvents() {
    updateSidebarSelection();

    var sidebarItems = document.querySelectorAll('.community-sidebar-item');
    for (var i = 0; i < sidebarItems.length; i++) {
      sidebarItems[i].addEventListener('click', function(e) {
        var comId = this.dataset.community;
        if (comId !== currentCommunityId) {
          switchCommunity(comId);
        } else {
          var channelsEl = document.getElementById('channels-' + comId);
          if (channelsEl) {
            channelsEl.style.display = channelsEl.style.display === 'none' ? '' : 'none';
          }
        }
      });
    }

    var channelItems = document.querySelectorAll('.channel-item');
    for (var i = 0; i < channelItems.length; i++) {
      channelItems[i].addEventListener('click', function(e) {
        e.stopPropagation();
        switchChannel(this.dataset.community, this.dataset.channel);
      });
    }

    var channelLandingCards = document.querySelectorAll('.channel-landing-card');
    for (var i = 0; i < channelLandingCards.length; i++) {
      channelLandingCards[i].addEventListener('click', function() {
        switchChannel(this.dataset.community, this.dataset.channel);
      });
    }

    var groupItems = document.querySelectorAll('.group-item');
    for (var i = 0; i < groupItems.length; i++) {
      groupItems[i].addEventListener('click', function() {
        var grpId = this.dataset.group;
        var groups = getGroupInfo();
        var found = null;
        var keys = ['teacher', 'class', 'subject'];
        for (var ki = 0; ki < keys.length; ki++) {
          var list = groups[keys[ki]] || [];
          for (var gi = 0; gi < list.length; gi++) {
            if (list[gi].id === grpId) { found = list[gi]; break; }
          }
          if (found) break;
        }
        if (found) {
          document.getElementById('group-info-name').textContent = found.icon + ' ' + found.name;
          document.getElementById('group-info-desc').textContent = found.desc || '';
          document.getElementById('group-info-created').textContent = '\uD83D\uDCC5 Created: ' + (found.createdAt || 'Unknown');
          document.getElementById('group-info-members').textContent = '\uD83D\uDC65 ' + found.memberCount + ' members';
          var modal = document.getElementById('group-info-modal');
          if (modal) modal.style.display = 'flex';
        }
      });
    }

    var searchInput = document.getElementById('community-search-input');
    if (searchInput) {
      searchInput.addEventListener('input', function() {
        var q = this.value.toLowerCase().trim();
        var items = document.querySelectorAll('.community-sidebar-item');
        for (var i = 0; i < items.length; i++) {
          var nameEl = items[i].querySelector('div > div:first-child');
          if (nameEl) {
            var match = nameEl.textContent.toLowerCase().indexOf(q) !== -1;
            items[i].style.display = match || !q ? 'flex' : 'none';
          }
        }
      });
    }

    var memberSearchInput = document.getElementById('member-search-input');
    if (memberSearchInput) {
      memberSearchInput.addEventListener('input', function() {
        memberSearchQuery = this.value;
        var memberList = document.getElementById('member-list');
        if (memberList) {
          var communities = getCommunities();
          var com = null;
          for (var ci = 0; ci < communities.length; ci++) {
            if (communities[ci].id === currentCommunityId) { com = communities[ci]; break; }
          }
          if (com) {
            var members = getMembers(com.id);
            var search = memberSearchQuery.toLowerCase().trim();
            var items = memberList.querySelectorAll('.member-item');
            for (var mi = 0; mi < items.length; mi++) {
              var nameEl = items[mi].querySelector('div > div:first-child');
              if (nameEl) {
                var match = nameEl.textContent.toLowerCase().indexOf(search) !== -1;
                items[mi].style.display = match || !search ? 'flex' : 'none';
              }
            }
          }
        }
      });
    }

    var sendBtn = document.getElementById('send-message-btn');
    if (sendBtn) {
      sendBtn.addEventListener('click', function() {
        var input = document.getElementById('message-input');
        if (input) sendMessage(input.value);
      });
    }

    var msgInput = document.getElementById('message-input');
    if (msgInput) {
      msgInput.addEventListener('keydown', function(e) {
        if (e.key === 'Enter' && !e.shiftKey) {
          e.preventDefault();
          sendMessage(this.value);
        }
      });
      msgInput.addEventListener('input', function() {
        this.style.height = 'auto';
        this.style.height = Math.min(this.scrollHeight, 100) + 'px';
        var typingEl = document.getElementById('typing-indicator');
        if (typingEl) {
          typingEl.style.display = 'block';
          if (window.typingTimeout) clearTimeout(window.typingTimeout);
          window.typingTimeout = setTimeout(function() {
            if (typingEl) typingEl.style.display = 'none';
          }, 2000);
        }
      });
    }

    var toggleMembersBtn = document.getElementById('toggle-members-btn');
    if (toggleMembersBtn) {
      toggleMembersBtn.addEventListener('click', function() {
        showMembers = !showMembers;
        var panel = document.getElementById('members-panel');
        if (panel) {
          if (showMembers) {
            panel.style.display = '';
            var layout = document.querySelector('.community-layout');
            if (layout) layout.style.gridTemplateColumns = '';
            refreshCenter();
          } else {
            panel.style.display = 'none';
          }
        }
      });
    }

    var closeMembersBtn = document.getElementById('close-members-btn');
    if (closeMembersBtn) {
      closeMembersBtn.addEventListener('click', function() {
        showMembers = false;
        var panel = document.getElementById('members-panel');
        if (panel) panel.style.display = 'none';
      });
    }

    var likeBtns = document.querySelectorAll('.like-msg-btn');
    for (var i = 0; i < likeBtns.length; i++) {
      likeBtns[i].addEventListener('click', function() {
        var msgId = this.dataset.msg;
        var communities = getCommunities();
        var com = null;
        for (var ci = 0; ci < communities.length; ci++) {
          if (communities[ci].id === currentCommunityId) { com = communities[ci]; break; }
        }
        if (!com) return;
        var messages = getMessages(com.id, currentChannelId);
        for (var mi = 0; mi < messages.length; mi++) {
          if (messages[mi].id === msgId) {
            var isNowLiked = toggleLike(com.id, currentChannelId, msgId);
            if (isNowLiked) {
              messages[mi].likes = (messages[mi].likes || 0) + 1;
              this.style.color = 'var(--accent-red)';
              this.innerHTML = '\u2764\uFE0F <span>' + messages[mi].likes + '</span>';
            } else {
              messages[mi].likes = Math.max(0, (messages[mi].likes || 0) - 1);
              this.style.color = '';
              this.innerHTML = '\uD83D\uDC96 <span>' + messages[mi].likes + '</span>';
            }
            setMessages(com.id, currentChannelId, messages);
            break;
          }
        }
      });
    }

    var replyBtns = document.querySelectorAll('.reply-msg-btn');
    for (var i = 0; i < replyBtns.length; i++) {
      replyBtns[i].addEventListener('click', function() {
        var input = document.getElementById('message-input');
        if (input) {
          input.focus();
          input.value = '> Replying to message... ';
          input.setSelectionRange(input.value.length, input.value.length);
        }
      });
    }

    var reactBtns = document.querySelectorAll('.react-msg-btn');
    for (var i = 0; i < reactBtns.length; i++) {
      reactBtns[i].addEventListener('click', function(e) {
        e.stopPropagation();
        var msgId = this.dataset.msg;
        var existing = document.querySelector('.emoji-picker');
        if (existing) {
          existing.parentNode.removeChild(existing);
          return;
        }
        var picker = document.createElement('div');
        picker.className = 'emoji-picker c-absolute c-z-100 c-border c-radius-lg c-p-2 c-shadow-lg c-flex c-flex-wrap';
        picker.style.cssText = 'background:var(--bg-secondary);gap:3px;max-width:200px';
        for (var ei = 0; ei < EMOJI_LIST.length; ei++) {
          var emoji = EMOJI_LIST[ei];
          var emojiBtn = document.createElement('span');
          emojiBtn.textContent = emoji;
          emojiBtn.className = 'c-flex-center c-pointer';
          emojiBtn.style.cssText = 'width:28px;height:28px;border-radius:6px;font-size:16px';
          emojiBtn.addEventListener('mouseenter', function() { this.style.background = 'var(--bg-glass-strong)'; });
          emojiBtn.addEventListener('mouseleave', function() { this.style.background = ''; });
          emojiBtn.addEventListener('click', function(e) {
            e.stopPropagation();
            var em = this.textContent;
            toggleReaction(msgId, em);
            if (picker.parentNode) picker.parentNode.removeChild(picker);
            refreshCenter();
            showToast('Reacted with ' + em, 'success');
          });
          picker.appendChild(emojiBtn);
        }
        var rect = this.getBoundingClientRect();
        picker.style.left = Math.min(rect.left, window.innerWidth - 220) + 'px';
        picker.style.top = (rect.bottom + 4) + 'px';
        document.body.appendChild(picker);
        setTimeout(function() {
          document.addEventListener('click', function dismissPicker(ev) {
            if (picker && picker.parentNode && !picker.contains(ev.target)) {
              picker.parentNode.removeChild(picker);
              document.removeEventListener('click', dismissPicker);
            }
          });
        }, 10);
      });
    }

    var shareBtns = document.querySelectorAll('.share-msg-btn');
    for (var i = 0; i < shareBtns.length; i++) {
      shareBtns[i].addEventListener('click', function() {
        var msgId = this.dataset.msg;
        var communities = getCommunities();
        var com = null;
        for (var ci = 0; ci < communities.length; ci++) {
          if (communities[ci].id === currentCommunityId) { com = communities[ci]; break; }
        }
        if (!com) return;
        var messages = getMessages(com.id, currentChannelId);
        for (var mi = 0; mi < messages.length; mi++) {
          if (messages[mi].id === msgId) {
            var shareText = 'Check out this message from ' + com.name + ': ' + truncate(messages[mi].content, 80);
            if (navigator.clipboard && navigator.clipboard.writeText) {
              navigator.clipboard.writeText(shareText).then(function() {
                showToast('Message copied to clipboard', 'success');
              });
            } else {
              showToast('Share: ' + shareText, 'info');
            }
            break;
          }
        }
      });
    }

    var reactionBadges = document.querySelectorAll('.reaction-badge');
    for (var i = 0; i < reactionBadges.length; i++) {
      reactionBadges[i].addEventListener('click', function() {
        var msgId = this.dataset.msg;
        var emoji = this.dataset.emoji;
        toggleReaction(msgId, emoji);
        refreshCenter();
      });
    }

    var pollOptions = document.querySelectorAll('.poll-option-item');
    for (var i = 0; i < pollOptions.length; i++) {
      pollOptions[i].addEventListener('click', function() {
        var pollId = this.dataset.poll;
        var optIdx = parseInt(this.dataset.opt);
        var storedPollVotes = store.get('communityPollVotes') || {};
        if (storedPollVotes[pollId] !== undefined) {
          showToast('Already voted on this poll', 'warning');
          return;
        }
        var communities = getCommunities();
        var com = null;
        for (var ci = 0; ci < communities.length; ci++) {
          if (communities[ci].id === currentCommunityId) { com = communities[ci]; break; }
        }
        if (!com) return;
        var messages = getMessages(com.id, currentChannelId);
        storedPollVotes[pollId] = optIdx;
        store.set('communityPollVotes', storedPollVotes);
        for (var mi = 0; mi < messages.length; mi++) {
          if (messages[mi].id === pollId && messages[mi].extra) {
            messages[mi].extra.votes[optIdx] = (messages[mi].extra.votes[optIdx] || 0) + 1;
            messages[mi].extra.totalVotes = (messages[mi].extra.totalVotes || 0) + 1;
            setMessages(com.id, currentChannelId, messages);
            break;
          }
        }
        refreshCenter();
        showToast('Vote recorded!', 'success');
      });
    }

    var createCommBtn = document.getElementById('create-community-btn');
    if (createCommBtn) {
      createCommBtn.addEventListener('click', function() {
        var modal = document.getElementById('create-community-modal');
        if (modal) modal.style.display = 'flex';
      });
    }

    var cancelCreate = document.getElementById('cancel-create-community');
    if (cancelCreate) {
      cancelCreate.addEventListener('click', function() {
        var modal = document.getElementById('create-community-modal');
        if (modal) modal.style.display = 'none';
      });
    }

    var confirmCreate = document.getElementById('confirm-create-community');
    if (confirmCreate) {
      confirmCreate.addEventListener('click', function() {
        var nameInput = document.getElementById('new-community-name');
        var iconInput = document.getElementById('new-community-icon');
        var descInput = document.getElementById('new-community-desc');
        if (!nameInput || !nameInput.value.trim()) {
          showToast('Please enter a community name', 'error');
          return;
        }
        var communities = getCommunities();
        var newCom = {
          id: 'com_' + generateId(),
          name: nameInput.value.trim(),
          icon: iconInput ? iconInput.value.trim() || '\uD83D\uDD2C' : '\uD83D\uDD2C',
          description: descInput ? descInput.value.trim() || 'A new community' : 'A new community',
          memberCount: 1,
          channels: [
            { id: 'ch_' + generateId(), type: 'general', name: 'General', icon: '#', category: 'general', topic: 'General discussion', memberCount: 1 }
          ],
          members: [
            { id: 'm_' + generateId(), name: currentUser.name, role: 'admin', online: true, lastSeen: new Date().toISOString(), avatar: null }
          ],
          createdAt: new Date().toISOString()
        };
        communities.push(newCom);
        store.set('communities', communities);
        var members = store.get('communityMembers') || {};
        members[newCom.id] = newCom.members;
        store.set('communityMembers', members);
        var allMsgs = store.get('communityMessages') || {};
        allMsgs[newCom.id + '_' + newCom.channels[0].id] = [];
        store.set('communityMessages', allMsgs);
        var modal = document.getElementById('create-community-modal');
        if (modal) modal.style.display = 'none';
        switchCommunity(newCom.id);
        showToast('Community created!', 'success');
      });
    }

    var createPollBtn = document.getElementById('create-poll-btn');
    if (createPollBtn) {
      createPollBtn.addEventListener('click', function() {
        var modal = document.getElementById('create-poll-modal');
        if (modal) modal.style.display = 'flex';
      });
    }

    var cancelPoll = document.getElementById('cancel-create-poll');
    if (cancelPoll) {
      cancelPoll.addEventListener('click', function() {
        var modal = document.getElementById('create-poll-modal');
        if (modal) modal.style.display = 'none';
      });
    }

    var confirmPoll = document.getElementById('confirm-create-poll');
    if (confirmPoll) {
      confirmPoll.addEventListener('click', function() {
        var questionInput = document.getElementById('poll-question-input');
        if (!questionInput || !questionInput.value.trim()) {
          showToast('Please enter a poll question', 'error');
          return;
        }
        var options = [];
        var optionInputs = document.querySelectorAll('.poll-option-input');
        for (var pi = 0; pi < optionInputs.length; pi++) {
          var val = optionInputs[pi].value.trim();
          if (val) options.push(val);
        }
        if (options.length < 2) {
          showToast('Please add at least 2 options', 'error');
          return;
        }
        var communities = getCommunities();
        var com = null;
        for (var ci = 0; ci < communities.length; ci++) {
          if (communities[ci].id === currentCommunityId) { com = communities[ci]; break; }
        }
        if (!com) return;
        var messages = getMessages(com.id, currentChannelId);
        var pollMsg = {
          id: generateId(),
          type: 'poll',
          author: currentUser.name,
          authorRole: currentUser.role || 'student',
          content: questionInput.value.trim(),
          extra: {
            options: options,
            votes: new Array(options.length).fill(0),
            totalVotes: 0
          },
          likes: 0,
          likedBy: [],
          replyCount: 0,
          isPinned: false,
          createdAt: new Date().toISOString()
        };
        messages.push(pollMsg);
        setMessages(com.id, currentChannelId, messages);
        var modal = document.getElementById('create-poll-modal');
        if (modal) modal.style.display = 'none';
        refreshCenter();
        showToast('Poll created!', 'success');
      });
    }

    var attachImageBtn = document.getElementById('attach-image-btn');
    if (attachImageBtn) {
      attachImageBtn.addEventListener('click', function() {
        var input = document.getElementById('message-input');
        if (input) {
          input.value = input.value + ' \uD83D\uDCF7 [Image] ';
          input.focus();
        }
      });
    }

    var attachFileBtn = document.getElementById('attach-file-btn');
    if (attachFileBtn) {
      attachFileBtn.addEventListener('click', function() {
        var input = document.getElementById('message-input');
        if (input) {
          input.value = input.value + ' \uD83D\uDCCE [File] ';
          input.focus();
        }
      });
    }

    var pinnedBtn = document.getElementById('pinned-msgs-btn');
    if (pinnedBtn) {
      pinnedBtn.addEventListener('click', function() {
        var communities = getCommunities();
        var com = null;
        for (var ci = 0; ci < communities.length; ci++) {
          if (communities[ci].id === currentCommunityId) { com = communities[ci]; break; }
        }
        if (!com) return;
        var messages = getMessages(com.id, currentChannelId);
        var pinnedIds = getPinned(com.id, currentChannelId);
        var pinnedMsgs = [];
        for (var pi = 0; pi < messages.length; pi++) {
          if (messages[pi].isPinned || pinnedIds.indexOf(messages[pi].id) !== -1) {
            pinnedMsgs.push(messages[pi]);
          }
        }
        var content = document.getElementById('pinned-msgs-content');
        if (content) {
          if (pinnedMsgs.length === 0) {
            content.innerHTML = '<div class="c-text-center c-text-tertiary" style="padding:30px;font-size:13px">No pinned messages</div>';
          } else {
            var pinHtml = '';
            for (var pi = 0; pi < pinnedMsgs.length; pi++) {
              pinHtml += '<div class="c-flex-gap-2 c-border-bottom" style="padding:8px 0">';
              pinHtml += '<span style="color:#eab308;font-size:14px">\uD83D\uDCCC</span>';
              pinHtml += '<div style="flex:1">';
              pinHtml += '<div style="display:flex;align-items:center;gap:4px;margin-bottom:2px">';
              pinHtml += '<span class="c-fs-sm c-fw-semibold c-text-primary">' + sanitizeHTML(pinnedMsgs[pi].author) + '</span>';
              pinHtml += '<span class="c-fs-xs c-text-tertiary">' + formatRelativeTime(pinnedMsgs[pi].createdAt) + '</span>';
              pinHtml += '</div>';
              pinHtml += '<div class="c-fs-sm c-text-primary">' + sanitizeHTML(pinnedMsgs[pi].content) + '</div>';
              pinHtml += '</div></div>';
            }
            content.innerHTML = pinHtml;
          }
          var modal = document.getElementById('pinned-msgs-modal');
          if (modal) modal.style.display = 'flex';
        }
      });
    }

    var pinnedBar = document.getElementById('pinned-bar');
    if (pinnedBar) {
      pinnedBar.addEventListener('click', function() {
        var btn = document.getElementById('pinned-msgs-btn');
        if (btn) btn.click();
      });
    }

    var sharedFilesBtn = document.getElementById('shared-files-btn');
    if (sharedFilesBtn) {
      sharedFilesBtn.addEventListener('click', function() {
        var communities = getCommunities();
        var com = null;
        for (var ci = 0; ci < communities.length; ci++) {
          if (communities[ci].id === currentCommunityId) { com = communities[ci]; break; }
        }
        if (!com) return;
        var messages = getMessages(com.id, currentChannelId);
        var files = [];
        for (var fi = 0; fi < messages.length; fi++) {
          if (messages[fi].type === 'file' || messages[fi].type === 'image') {
            files.push(messages[fi]);
          }
        }
        var content = document.getElementById('shared-files-content');
        if (content) {
          if (files.length === 0) {
            content.innerHTML = '<div class="c-text-center c-text-tertiary" style="padding:30px;font-size:13px">No files shared</div>';
          } else {
            var fileHtml = '';
            for (var fi = 0; fi < files.length; fi++) {
              var fe = files[fi].extra || {};
              fileHtml += '<div style="display:flex;align-items:center;gap:10px;padding:8px 12px;background:var(--bg-glass-strong);border-radius:8px;margin-bottom:6px">';
              fileHtml += '<span style="font-size:22px">' + (files[fi].type === 'image' ? '\uD83D\uDCF7' : getFileIcon(fe.fileType)) + '</span>';
              fileHtml += '<div style="flex:1">';
              fileHtml += '<div class="c-fs-sm c-fw-medium c-text-primary">' + sanitizeHTML(fe.fileName || files[fi].content) + '</div>';
              fileHtml += '<div class="c-fs-xs c-text-tertiary">' + sanitizeHTML(files[fi].author) + ' \u00B7 ' + formatRelativeTime(files[fi].createdAt) + '</div>';
              fileHtml += '</div>';
              if (fe.fileSize) {
                fileHtml += '<span class="c-fs-xs c-text-tertiary">' + fe.fileSize + '</span>';
              }
              fileHtml += '</div>';
            }
            content.innerHTML = fileHtml;
          }
          var modal = document.getElementById('shared-files-modal');
          if (modal) modal.style.display = 'flex';
        }
      });
    }

    var mediaBtn = document.getElementById('media-btn');
    if (mediaBtn) {
      mediaBtn.addEventListener('click', function() {
        var communities = getCommunities();
        var com = null;
        for (var ci = 0; ci < communities.length; ci++) {
          if (communities[ci].id === currentCommunityId) { com = communities[ci]; break; }
        }
        if (!com) return;
        var messages = getMessages(com.id, currentChannelId);
        var images = [];
        for (var ii = 0; ii < messages.length; ii++) {
          if (messages[ii].type === 'image') {
            images.push(messages[ii]);
          }
        }
        var content = document.getElementById('media-content');
        if (content) {
          if (images.length === 0) {
            content.innerHTML = '<div class="c-text-center c-text-tertiary" style="padding:30px;font-size:13px;grid-column:1/-1">No media shared</div>';
          } else {
            var mediaHtml = '';
            for (var ii = 0; ii < images.length; ii++) {
              mediaHtml += '<div class="c-flex-center c-pointer" style="height:120px;background:' + getGradient(ii) + ';border-radius:8px;font-size:28px">\uD83D\uDCF7</div>';
            }
            content.innerHTML = mediaHtml;
          }
          var modal = document.getElementById('media-modal');
          if (modal) modal.style.display = 'flex';
        }
      });
    }

    var searchChannelBtn = document.getElementById('search-channel-btn');
    if (searchChannelBtn) {
      searchChannelBtn.addEventListener('click', function() {
        var modal = document.getElementById('chat-search-modal');
        if (modal) modal.style.display = 'flex';
        var input = document.getElementById('chat-search-input');
        if (input) {
          input.value = '';
          input.focus();
        }
        var results = document.getElementById('chat-search-results');
        if (results) results.innerHTML = '';
      });
    }

    var chatSearchInput = document.getElementById('chat-search-input');
    if (chatSearchInput) {
      chatSearchInput.addEventListener('input', function() {
        var q = this.value.toLowerCase().trim();
        var results = document.getElementById('chat-search-results');
        if (!results) return;
        if (!q) { results.innerHTML = ''; return; }
        var communities = getCommunities();
        var com = null;
        for (var ci = 0; ci < communities.length; ci++) {
          if (communities[ci].id === currentCommunityId) { com = communities[ci]; break; }
        }
        if (!com) return;
        var messages = getMessages(com.id, currentChannelId);
        var matches = [];
        for (var mi = 0; mi < messages.length; mi++) {
          if (messages[mi].content.toLowerCase().indexOf(q) !== -1) {
            matches.push(messages[mi]);
            if (matches.length >= 20) break;
          }
        }
        if (matches.length === 0) {
          results.innerHTML = '<div class="c-text-center c-text-tertiary c-fs-sm" style="padding:20px">No results found</div>';
        } else {
          var searchHtml = '';
          for (var mi = 0; mi < matches.length; mi++) {
            searchHtml += '<div class="c-pointer c-border-bottom" style="display:flex;gap:8px;padding:8px 16px">';
            searchHtml += '<div class="c-flex-center c-fw-semibold c-radius-full" style="width:28px;height:28px;background:' + getGradient(mi) + ';font-size:10px;color:#fff;flex-shrink:0">' + getInitials(matches[mi].author) + '</div>';
            searchHtml += '<div style="flex:1;min-width:0">';
            searchHtml += '<div style="display:flex;align-items:center;gap:4px">';
            searchHtml += '<span class="c-fs-xs c-fw-semibold c-text-primary">' + sanitizeHTML(matches[mi].author) + '</span>';
            searchHtml += '<span class="c-fs-xs c-text-tertiary">' + formatRelativeTime(matches[mi].createdAt) + '</span>';
            searchHtml += '</div>';
            searchHtml += '<div class="c-fs-sm c-text-secondary c-nowrap c-ellipsis">' + sanitizeHTML(truncate(matches[mi].content, 80)) + '</div>';
            searchHtml += '</div></div>';
          }
          results.innerHTML = searchHtml;
        }
      });
      chatSearchInput.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
          var modal = document.getElementById('chat-search-modal');
          if (modal) modal.style.display = 'none';
        }
      });
    }

    var closePinnedModal = document.getElementById('close-pinned-modal');
    if (closePinnedModal) {
      closePinnedModal.addEventListener('click', function() {
        var modal = document.getElementById('pinned-msgs-modal');
        if (modal) modal.style.display = 'none';
      });
    }

    var closeFilesModal = document.getElementById('close-files-modal');
    if (closeFilesModal) {
      closeFilesModal.addEventListener('click', function() {
        var modal = document.getElementById('shared-files-modal');
        if (modal) modal.style.display = 'none';
      });
    }

    var closeMediaModal = document.getElementById('close-media-modal');
    if (closeMediaModal) {
      closeMediaModal.addEventListener('click', function() {
        var modal = document.getElementById('media-modal');
        if (modal) modal.style.display = 'none';
      });
    }

    var closeGroupInfo = document.getElementById('close-group-info');
    if (closeGroupInfo) {
      closeGroupInfo.addEventListener('click', function() {
        var modal = document.getElementById('group-info-modal');
        if (modal) modal.style.display = 'none';
      });
    }

    var createCommunityModal = document.getElementById('create-community-modal');
    if (createCommunityModal) {
      createCommunityModal.addEventListener('click', function(e) {
        if (e.target === this) this.style.display = 'none';
      });
    }

    var createPollModal = document.getElementById('create-poll-modal');
    if (createPollModal) {
      createPollModal.addEventListener('click', function(e) {
        if (e.target === this) this.style.display = 'none';
      });
    }

    var pinnedMsgsModal = document.getElementById('pinned-msgs-modal');
    if (pinnedMsgsModal) {
      pinnedMsgsModal.addEventListener('click', function(e) {
        if (e.target === this) this.style.display = 'none';
      });
    }

    var sharedFilesModal = document.getElementById('shared-files-modal');
    if (sharedFilesModal) {
      sharedFilesModal.addEventListener('click', function(e) {
        if (e.target === this) this.style.display = 'none';
      });
    }

    var mediaModal = document.getElementById('media-modal');
    if (mediaModal) {
      mediaModal.addEventListener('click', function(e) {
        if (e.target === this) this.style.display = 'none';
      });
    }

    var groupInfoModal = document.getElementById('group-info-modal');
    if (groupInfoModal) {
      groupInfoModal.addEventListener('click', function(e) {
        if (e.target === this) this.style.display = 'none';
      });
    }

    var chatSearchModal = document.getElementById('chat-search-modal');
    if (chatSearchModal) {
      chatSearchModal.addEventListener('click', function(e) {
        if (e.target === this) this.style.display = 'none';
      });
    }

    var notificationBtn = document.getElementById('notification-btn');
    if (notificationBtn) {
      notificationBtn.addEventListener('click', function() {
        showToast('\uD83D\uDD14 Notification preferences', 'info');
      });
    }
  }

  var styleEl = document.createElement('style');
  styleEl.textContent =
    '.community-layout { box-shadow: 0 4px 24px rgba(0,0,0,0.15); border: 1px solid var(--border-color); }' +
    '.community-sidebar::-webkit-scrollbar { width: 4px; }' +
    '.community-sidebar::-webkit-scrollbar-thumb { background: var(--border-color); border-radius: 2px; }' +
    '.message-list::-webkit-scrollbar { width: 6px; }' +
    '.message-list::-webkit-scrollbar-thumb { background: var(--border-color); border-radius: 3px; }' +
    '.members-panel::-webkit-scrollbar { width: 4px; }' +
    '.members-panel::-webkit-scrollbar-thumb { background: var(--border-color); border-radius: 2px; }' +
    '.community-sidebar-item:hover { background: var(--bg-glass-strong); }' +
    '.channel-item:hover { background: rgba(255,255,255,0.04); }' +
    '.channel-landing-card:hover { border-color: var(--accent-blue); transform: translateY(-1px); box-shadow: 0 4px 12px rgba(0,0,0,0.2); }' +
    '.group-item:hover { background: rgba(255,255,255,0.04); }' +
    '.member-item:hover { background: var(--bg-glass-strong); }' +
    '.msg-action-btn:hover { background: var(--bg-glass-strong); }' +
    '.msg-action-btn:active { transform: scale(0.95); }' +
    '.action-bar-btn:hover { background: var(--bg-glass-strong) !important; }' +
    '.input-tool-btn:hover { background: var(--bg-glass-strong) !important; }' +
    '.message-item { transition: background 0.1s; }' +
    '.message-item:hover { background: rgba(255,255,255,0.015); border-radius: 6px; }' +
    '.poll-option-item:hover { border-color: var(--accent-blue); }' +
    '.reaction-badge:hover { background: rgba(59,130,246,0.15) !important; }' +
    '@keyframes fadeIn { from { opacity: 0; transform: translateY(4px); } to { opacity: 1; transform: translateY(0); } }' +
    '@keyframes bounce { 0%, 80%, 100% { transform: scale(0); } 40% { transform: scale(1); } }' +
    '.community-layout{display:grid;grid-template-columns:260px 1fr 300px;gap:0}' +
    '.community-sidebar,.members-panel{overflow-y:auto;display:flex;flex-direction:column}' +
    '.community-center{flex:1;display:flex;flex-direction:column}' +
    '@media(max-width:992px){.community-layout{grid-template-columns:260px 1fr}.members-panel{display:none}}' +
    '@media(max-width:768px){.community-layout{grid-template-columns:1fr}.community-sidebar{display:none}}';
  document.head.appendChild(styleEl);

  render();
};
