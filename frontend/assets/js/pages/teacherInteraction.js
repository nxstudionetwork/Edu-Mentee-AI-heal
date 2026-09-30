window.renderPage = window.renderPage || {};

window.renderPage.teacherInteraction = function (params) {
  var mainContent = document.getElementById('main-content');
  if (!mainContent) return;
  var Store = window.Store;
  var Utils = window.Utils;
  var user = Store.get('user') || { name: 'Student', class: 10, stream: '' };

  var TEACHERS = [
    { id: 't1', name: 'Dr. Priya Sharma', subjects: ['Mathematics', 'Physics'], qualification: 'Ph.D. in Applied Mathematics', experience: '12 years', rating: 4.8, avatar: '\uD83D\uDC69\u200D\uD83C\uDFEB', color: '#3b82f6', online: true },
    { id: 't2', name: 'Mr. Rajesh Kumar', subjects: ['Physics', 'Mathematics'], qualification: 'M.Sc. Physics, B.Ed', experience: '10 years', rating: 4.6, avatar: '\uD83D\uDC68\u200D\uD83C\uDFEB', color: '#8b5cf6', online: true },
    { id: 't3', name: 'Mrs. Ananya Patel', subjects: ['Chemistry', 'Biology'], qualification: 'M.Sc. Chemistry, Ph.D.', experience: '8 years', rating: 4.7, avatar: '\uD83D\uDC69\u200D\uD83C\uDD1C', color: '#ec4899', online: false },
    { id: 't4', name: 'Mr. Vikram Singh', subjects: ['Biology', 'Environmental Studies'], qualification: 'M.Sc. Botany, M.Ed', experience: '15 years', rating: 4.9, avatar: '\uD83E\uDDD1\u200D\uD83C\uDD1C', color: '#10b981', online: true },
    { id: 't5', name: 'Ms. Kavita Nair', subjects: ['English', 'Hindi'], qualification: 'M.A. English Literature', experience: '9 years', rating: 4.5, avatar: '\uD83D\uDC69\u200D\uD83C\uDF93', color: '#06b6d4', online: true },
    { id: 't6', name: 'Mr. Suresh Reddy', subjects: ['Hindi', 'Social Studies'], qualification: 'M.A. Hindi, B.Ed', experience: '11 years', rating: 4.4, avatar: '\uD83E\uDDD1\u200D\uD83C\uDF93', color: '#f59e0b', online: false },
    { id: 't7', name: 'Mrs. Meera Joshi', subjects: ['Social Studies', 'English'], qualification: 'M.A. History, M.Ed', experience: '14 years', rating: 4.8, avatar: '\uD83D\uDC69\u200D\uD83C\uDFEB', color: '#6366f1', online: true },
    { id: 't8', name: 'Mr. Arjun Verma', subjects: ['Computer Science', 'Mathematics'], qualification: 'B.Tech CSE, M.Tech AI', experience: '7 years', rating: 4.9, avatar: '\uD83E\uDDD1\u200D\uD83C\uDFBB', color: '#14b8a6', online: true },
    { id: 't9', name: 'Dr. Sneha Gupta', subjects: ['Mathematics', 'Computer Science'], qualification: 'Ph.D. in Mathematics', experience: '13 years', rating: 4.7, avatar: '\uD83D\uDC69\u200D\uD83C\uDFBB', color: '#f43f5e', online: false },
    { id: 't10', name: 'Mr. Rohan Deshmukh', subjects: ['Physics', 'Chemistry'], qualification: 'M.Sc. Physics, NET Qualified', experience: '6 years', rating: 4.5, avatar: '\uD83E\uDDD1\u200D\uD83C\uDD1C', color: '#0ea5e9', online: true },
    { id: 't11', name: 'Mrs. Deepika Iyer', subjects: ['Chemistry', 'Biology'], qualification: 'M.Sc. Biochemistry, Ph.D.', experience: '10 years', rating: 4.6, avatar: '\uD83D\uDC69\u200D\uD83C\uDD1C', color: '#a855f7', online: true },
    { id: 't12', name: 'Mr. Amit Saxena', subjects: ['Biology', 'Environmental Studies', 'Science'], qualification: 'M.Sc. Zoology, B.Ed', experience: '16 years', rating: 4.8, avatar: '\uD83E\uDDD1\u200D\uD83C\uDFEB', color: '#22c55e', online: false }
  ];

  var MOCK_STUDENT_NAME = user.name || 'You';
  var conversations = Store.get('teacherConversations') || [];
  var currentConversationId = null;
  var isTyping = false;
  var searchQuery = '';
  var filterState = { subject: [], status: [], teacher: [], dateFrom: '', dateTo: '' };
  var activeCategory = 'all';
  var showSearch = false;

  (function () {
    if (window._tiDelegated) return;
    window._tiDelegated = true;
    document.addEventListener('click', function (e) {
      var t = e.target.closest('[data-action^="ti:"]');
      if (!t) return;
      if (t.getAttribute('data-stop-prop') === 'true') e.stopPropagation();
      var p = t.getAttribute('data-action').split(':');
      var c = p[1], a = p[2];
      var actions = {
        'askQuestion': showNewQuestionModal, 'sendMessage': sendMessage, 'markResolved': markResolved,
        'pinConv': togglePin, 'deleteConv': deleteConversation, 'rateTeacher': showRateModal,
        'filter': openFilterDrawer, 'switchConv': switchConversation, 'setCat': setCategory,
        'submitQ': submitNewQuestion, 'attach': mockAttachment, 'mobileBack': mobileBackToList,
        'toggleSearch': toggleSearch, 'voiceMsg': mockVoiceMsg, 'scheduleMeeting': mockScheduleMeeting,
        'toggleSidebar': toggleMobileSidebar
      };
      if (actions[c]) actions[c](a);
    });
    document.addEventListener('change', function (e) {
      var t = e.target.closest('[data-action^="ti-change:"]');
      if (!t) return;
      var p = t.getAttribute('data-action').split(':');
      var c = p[1];
      if (c === 'filterByTeacher') filterByTeacher(t.value);
      if (c === 'newQSubject') onNewQSubjectChange(t.value);
    });
    document.addEventListener('input', function (e) {
      var t = e.target.closest('[data-action^="ti-input:"]');
      if (!t) return;
      var p = t.getAttribute('data-action').split(':');
      var c = p[1];
      if (c === 'onSearch') onSearch(t.value);
    });
    document.addEventListener('keydown', function (e) {
      var t = e.target.closest('[data-action^="ti-keydown:"]');
      if (!t) return;
      var p = t.getAttribute('data-action').split(':');
      var c = p[1];
      if (c === 'chatInput') handleKeyDown(e);
    });
  })();

  function generateId() { return Date.now().toString(36) + '_' + Math.random().toString(36).slice(2, 9); }
  function getSubjectsForClass() {
    var classNum = user && user.class ? parseInt(user.class) : 10;
    if (classNum >= 1 && classNum <= 5) return ['Mathematics', 'English', 'Hindi', 'Environmental Studies', 'General Knowledge'];
    if (classNum <= 8) return ['Mathematics', 'Science', 'English', 'Hindi', 'Social Studies', 'Sanskrit', 'Computer Science'];
    return ['Mathematics', 'Physics', 'Chemistry', 'Biology', 'English', 'Hindi', 'Computer Science'];
  }
  function getTeachersForSubject(subject) {
    if (!subject) return TEACHERS;
    var result = [];
    for (var i = 0; i < TEACHERS.length; i++) {
      for (var j = 0; j < TEACHERS[i].subjects.length; j++) {
        if (TEACHERS[i].subjects[j].toLowerCase() === subject.toLowerCase()) { result.push(TEACHERS[i]); break; }
      }
    }
    return result;
  }
  function getTeacherById(id) { for (var i = 0; i < TEACHERS.length; i++) { if (TEACHERS[i].id === id) return TEACHERS[i]; } return null; }
  function getCurrentConversation() {
    if (!currentConversationId) return null;
    for (var i = 0; i < conversations.length; i++) { if (conversations[i].id === currentConversationId) return conversations[i]; }
    return null;
  }
  function saveConversations() { Store.set('teacherConversations', conversations); }

  function showToast(msg, type) {
    var toast = document.createElement('div');
    var bg = type === 'green' ? 'var(--accent-green)' : type === 'red' ? 'var(--accent-red)' : 'var(--accent-orange)';
    toast.className = 'ti-toast';
    toast.style.cssText = 'background:' + bg;
    toast.textContent = msg;
    document.body.appendChild(toast);
    setTimeout(function () { toast.remove(); }, 2500);
  }

  function formatTime(iso) {
    if (!iso) return '';
    var d = new Date(iso);
    if (isNaN(d.getTime())) return '';
    var now = new Date();
    var diff = Math.floor((now - d) / 1000);
    if (diff < 60) return 'just now';
    if (diff < 3600) return Math.floor(diff / 60) + 'm ago';
    if (diff < 86400) return Math.floor(diff / 3600) + 'h ago';
    if (diff < 172800) return 'Yesterday';
    diff = Math.floor(diff / 86400);
    if (diff < 30) return diff + 'd ago';
    return Utils.formatDate(iso, 'dd mmm');
  }

  function formatChatTime(iso) {
    if (!iso) return '';
    var d = new Date(iso);
    if (isNaN(d.getTime())) return '';
    var hours = d.getHours();
    var mins = d.getMinutes();
    var ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12 || 12;
    return hours + ':' + (mins < 10 ? '0' : '') + mins + ' ' + ampm;
  }

  function sanitize(str) {
    if (!str) return '';
    var map = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#x27;' };
    return String(str).replace(/[&<>"']/g, function (m) { return map[m]; });
  }

  function scrollToBottom() {
    var container = document.getElementById('ti-chat-messages');
    if (container) container.scrollTop = container.scrollHeight;
  }

  function generateTeacherReply(question, subject, teacherName) {
    var lower = question.toLowerCase();
    var subjectLower = (subject || '').toLowerCase();
    if (subjectLower.indexOf('math') !== -1 || lower.indexOf('math') !== -1 || lower.indexOf('algebra') !== -1) {
      var replies = ['Great question! Let me walk you through this step-by-step. First, identify the key formula we need.', 'Excellent doubt! Understanding the concept is more important than memorizing formulas. Let me explain the underlying principle.', 'I see where you\'re confused. The key is to break this into smaller steps. Start by simplifying the expression.'];
      return replies[Math.floor(Math.random() * replies.length)];
    }
    if (subjectLower.indexOf('physics') !== -1 || lower.indexOf('physics') !== -1 || lower.indexOf('force') !== -1) {
      var replies = ['Interesting physics question! Let\'s apply Newton\'s laws here. Remember: F = ma.', 'Physics is all about understanding natural phenomena. Let me explain with a real-world example.', 'Great question! The key principle here is conservation of energy. Try applying this principle.'];
      return replies[Math.floor(Math.random() * replies.length)];
    }
    if (subjectLower.indexOf('chem') !== -1 || lower.indexOf('chem') !== -1 || lower.indexOf('reaction') !== -1) {
      var replies = ['Excellent chemistry question! Remember the periodic trends: atomic radius increases down a group.', 'In chemistry, understanding molecular structure helps predict properties. Let me explain how bonding works.', 'This is a fundamental concept. Think of it in terms of electron transfer or sharing.'];
      return replies[Math.floor(Math.random() * replies.length)];
    }
    if (subjectLower.indexOf('bio') !== -1 || lower.indexOf('bio') !== -1 || lower.indexOf('cell') !== -1) {
      var replies = ['Fascinating biology question! Living systems are incredibly complex and interconnected.', 'Biology is the study of life itself! The key is to see how structure relates to function.', 'Great question! Let me explain this using a diagrammatic approach.'];
      return replies[Math.floor(Math.random() * replies.length)];
    }
    var general = ['Thank you for your question! Let me explain this concept in a simple and clear way.', 'Excellent question! This is something many students find challenging. I\'ll break it down.', 'I understand your doubt. Let me address this systematically.', 'Great to see you asking questions! Here\'s a detailed explanation of your query.'];
    return general[Math.floor(Math.random() * general.length)];
  }

  function sendMessage() {
    var input = document.getElementById('ti-chat-input');
    if (!input) return;
    var text = input.value.trim();
    if (!text || isTyping) return;
    var conv = getCurrentConversation();
    if (!conv) return;
    input.value = '';
    input.style.height = 'auto';
    var msg = { id: 'msg_' + generateId(), text: text, sender: 'student', time: new Date().toISOString(), status: 'sent' };
    conv.messages.push(msg);
    conv.lastMsg = text;
    conv.lastTime = new Date().toISOString();
    conv.unread = false;
    saveConversations();
    renderChatMessages();
    scrollToBottom();
    showTypingIndicator(conv);
  }

  function showTypingIndicator(conv) {
    isTyping = true;
    var container = document.getElementById('ti-chat-messages');
    if (!container) return;
    var div = document.createElement('div');
    div.id = 'ti-typing-indicator';
    div.className = 'ti-msg ti-msg-teacher';
    div.innerHTML = '<div class="ti-msg-avatar" style="background:' + (conv.teacherColor || '#3b82f6') + '">' + (conv.teacherAvatar || '\uD83D\uDC69\u200D\uD83C\uDFEB') + '</div><div class="ti-msg-content"><div class="ti-typing-bubble"><div class="ti-typing-dots"><span></span><span></span><span></span></div></div></div>';
    container.appendChild(div);
    scrollToBottom();
    var delay = 800 + Math.random() * 2200;
    setTimeout(function () {
      hideTypingIndicator();
      if (conv && conv.id === currentConversationId) {
        var replyText = generateTeacherReply(text, conv.subject, conv.teacherName);
        var reply = { id: 'msg_' + generateId(), text: replyText, sender: 'teacher', time: new Date().toISOString(), status: 'read' };
        conv.messages.push(reply);
        conv.lastMsg = replyText;
        conv.lastTime = new Date().toISOString();
        saveConversations();
        renderChatMessages();
        scrollToBottom();
      }
    }, delay);
  }

  function hideTypingIndicator() {
    isTyping = false;
    var el = document.getElementById('ti-typing-indicator');
    if (el) el.remove();
  }

  function handleKeyDown(e) {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage(); }
  }

  function getCategoryCount(category) {
    var count = 0;
    for (var i = 0; i < conversations.length; i++) { if (matchesCategory(conversations[i], category)) count++; }
    return count;
  }

  function matchesCategory(conv, category) {
    if (category === 'all') return true;
    if (category === 'pinned') return conv.pinned;
    if (category === 'ongoing') return conv.status === 'ongoing';
    if (category === 'resolved') return conv.status === 'resolved';
    if (category === 'pending') return conv.status === 'pending';
    return true;
  }

  function getFilteredConversations() {
    var list = conversations.slice();
    if (activeCategory !== 'all') list = list.filter(function (c) { return matchesCategory(c, activeCategory); });
    if (searchQuery) {
      var q = searchQuery.toLowerCase();
      list = list.filter(function (c) { return c.title.toLowerCase().indexOf(q) !== -1 || c.teacherName.toLowerCase().indexOf(q) !== -1 || c.subject.toLowerCase().indexOf(q) !== -1; });
    }
    if (filterState.subject && filterState.subject.length > 0) list = list.filter(function (c) { return filterState.subject.indexOf(c.subject) !== -1; });
    if (filterState.status && filterState.status.length > 0) list = list.filter(function (c) { return filterState.status.indexOf(c.status) !== -1; });
    if (filterState.teacher && filterState.teacher.length > 0) list = list.filter(function (c) { return filterState.teacher.indexOf(c.teacherId) !== -1; });
    if (filterState.dateFrom) { var from = new Date(filterState.dateFrom).getTime(); list = list.filter(function (c) { return new Date(c.createdAt).getTime() >= from; }); }
    if (filterState.dateTo) { var to = new Date(filterState.dateTo).getTime() + 86400000; list = list.filter(function (c) { return new Date(c.createdAt).getTime() <= to; }); }
    list.sort(function (a, b) { return new Date(b.lastTime || b.createdAt) - new Date(a.lastTime || a.createdAt); });
    return list;
  }

  function openFilterDrawer() {
    if (!window.FilterDrawer) { showToast('Filter drawer not available', 'orange'); return; }
    window.FilterDrawer.openDrawer({
      title: 'Filter Conversations',
      filters: [
        { id: 'subject', label: 'Subject', type: 'checkbox', value: filterState.subject || [], options: getSubjectsForClass().map(function (s) { return { label: s, value: s }; }) },
        { id: 'status', label: 'Status', type: 'checkbox', value: filterState.status || [], options: [{ label: 'Ongoing', value: 'ongoing' }, { label: 'Pending', value: 'pending' }, { label: 'Resolved', value: 'resolved' }] },
        { id: 'teacher', label: 'Teacher', type: 'checkbox', value: filterState.teacher || [], options: TEACHERS.map(function (t) { return { label: t.name, value: t.id }; }) }
      ],
      onApply: function (values) {
        filterState.subject = values.subject || [];
        filterState.status = values.status || [];
        filterState.teacher = values.teacher || [];
        renderMain();
      },
      onReset: function () { filterState = { subject: [], status: [], teacher: [], dateFrom: '', dateTo: '' }; renderMain(); }
    });
  }

  function mobileBackToList() {
    var el = document.getElementById('ti-root');
    if (el) el.classList.remove('ti-show-chat');
  }

  function toggleMobileSidebar() {
    var sidebar = document.getElementById('ti-sidebar');
    var overlay = document.getElementById('ti-sidebar-overlay');
    if (sidebar) sidebar.classList.toggle('open');
    if (overlay) overlay.classList.toggle('active');
  }

  function toggleSearch() {
    showSearch = !showSearch;
    var el = document.getElementById('ti-conversation-search');
    if (el) el.style.display = showSearch ? 'flex' : 'none';
  }

  function mockVoiceMsg() { showToast('Voice message captured (mock)', 'green'); }
  function mockScheduleMeeting() { showToast('Meeting scheduled (mock)', 'green'); }

  function renderMain() {
    var filtered = getFilteredConversations();
    var html = '<div id="ti-root" class="ti-root">';
    html += '<div id="ti-sidebar-overlay" class="ti-overlay"></div>';
    html += '<div id="ti-sidebar" class="ti-sidebar">';
    html += '<div class="ti-sidebar-header">';
    html += '<h2 class="ti-sidebar-title">Ask Teacher</h2>';
    html += '<button class="ti-new-btn" data-action="ti:askQuestion">+ New</button>';
    html += '</div>';
    html += '<div class="ti-sidebar-search"><input type="text" class="ti-search-input" placeholder="Search..." value="' + sanitize(searchQuery) + '" data-action="ti-input:onSearch"><span class="ti-search-icon">&#128269;</span></div>';
    html += '<div class="ti-categories">';
    var categories = [
      { id: 'all', label: 'All', icon: '&#128172;' },
      { id: 'pinned', label: 'Pinned', icon: '&#128204;' },
      { id: 'ongoing', label: 'Active', icon: '&#128172;' },
      { id: 'pending', label: 'Pending', icon: '&#9203;' },
      { id: 'resolved', label: 'Done', icon: '&#9989;' }
    ];
    for (var ci = 0; ci < categories.length; ci++) {
      var cat = categories[ci];
      var count = getCategoryCount(cat.id);
      html += '<button class="ti-cat' + (activeCategory === cat.id ? ' active' : '') + '" data-action="ti:setCat:' + cat.id + '">' + cat.icon + ' ' + cat.label + ' <span class="ti-cat-count">' + count + '</span></button>';
    }
    html += '</div>';
    html += '<div class="ti-conv-list">';
    if (conversations.length === 0) {
      html += '<div class="ti-empty-list"><div class="ti-empty-icon">&#128218;</div><div>No questions yet</div><div class="ti-empty-sub">Ask your first doubt!</div></div>';
    } else if (filtered.length === 0) {
      html += '<div class="ti-empty-list"><div class="ti-empty-icon">&#128269;</div><div>No matches</div></div>';
    } else {
      var pinned = [];
      var unpinned = [];
      for (var fi = 0; fi < filtered.length; fi++) { if (filtered[fi].pinned) pinned.push(filtered[fi]); else unpinned.push(filtered[fi]); }
      var allItems = pinned.concat(unpinned);
      for (var ii = 0; ii < allItems.length; ii++) {
        var conv = allItems[ii];
        var isActive = conv.id === currentConversationId;
        var teacher = getTeacherById(conv.teacherId);
        var avatar = teacher ? teacher.avatar : '\uD83D\uDC69\u200D\uD83C\uDFEB';
        var color = teacher ? teacher.color : '#3b82f6';
        var online = teacher ? teacher.online : false;
        var statusIcon = conv.status === 'resolved' ? '&#9989;' : conv.status === 'pending' ? '&#9203;' : '&#128172;';
        html += '<div class="ti-conv' + (isActive ? ' active' : '') + '" data-action="ti:switchConv:' + conv.id + '">';
        html += '<div class="ti-conv-avatar" style="background:' + color + '">' + avatar;
        if (online) html += '<div class="ti-online-dot"></div>';
        html += '</div>';
        html += '<div class="ti-conv-body">';
        html += '<div class="ti-conv-top"><span class="ti-conv-name">' + sanitize(conv.title) + '</span>';
        html += '<span class="ti-conv-time">' + formatTime(conv.lastTime || conv.createdAt) + '</span></div>';
        html += '<div class="ti-conv-bottom"><span class="ti-conv-preview">' + sanitize(conv.lastMsg || 'No messages yet') + '</span>';
        html += '<span class="ti-conv-badge">' + statusIcon + '</span></div>';
        html += '<div class="ti-conv-meta"><span class="ti-conv-teacher">' + sanitize(conv.teacherName) + '</span>';
        html += '<span class="ti-conv-subject">' + sanitize(conv.subject) + '</span></div></div>';
        html += '<div class="ti-conv-actions">';
        if (conv.pinned) html += '<span class="ti-conv-pin">&#128204;</span>';
        html += '</div></div>';
      }
    }
    html += '</div>';
    html += '<div class="ti-sidebar-footer">' + conversations.length + ' questions</div>';
    html += '</div>';
    html += '<div class="ti-main">';
    var conv = getCurrentConversation();
    if (!conv) {
      html += '<div class="ti-empty-main">';
      html += '<div class="ti-empty-main-icon">&#128218;</div>';
      html += '<h3>Ask a Teacher</h3>';
      html += '<p>Select a conversation or ask a new question</p>';
      html += '<button class="ti-new-btn" data-action="ti:askQuestion">+ Ask Question</button>';
      html += '</div>';
      html += '</div></div>';
      mainContent.innerHTML = html;
      injectStyles();
      return;
    }
    var teacher = getTeacherById(conv.teacherId);
    var avatar = teacher ? teacher.avatar : '\uD83D\uDC69\u200D\uD83C\uDFEB';
    var color = teacher ? teacher.color : '#3b82f6';
    var online = teacher ? teacher.online : false;
    var statusText = conv.status === 'resolved' ? 'Resolved &#9989;' : conv.status === 'pending' ? 'Pending &#9203;' : 'Active &#128172;';
    html += '<div class="ti-chat-header">';
    html += '<button class="ti-back-btn" data-action="ti:mobileBack">&#8592;</button>';
    html += '<div class="ti-chat-header-avatar" style="background:' + color + '">' + avatar;
    if (online) html += '<div class="ti-online-dot"></div>';
    html += '</div>';
    html += '<div class="ti-chat-header-info"><div class="ti-chat-header-name">' + sanitize(conv.teacherName) + '</div>';
    html += '<div class="ti-chat-header-meta">' + sanitize(conv.subject) + ' \u00B7 <span style="color:' + (online ? 'var(--accent-green)' : 'var(--text-tertiary)') + '">' + (online ? 'Online' : 'Offline') + '</span> \u00B7 ' + statusText + '</div></div>';
    html += '<div class="ti-chat-header-actions">';
    html += '<button class="ti-header-btn" data-action="ti:toggleSearch" title="Search">&#128269;</button>';
    if (conv.status !== 'resolved') html += '<button class="ti-header-btn" data-action="ti:markResolved:' + conv.id + '" title="Resolve">&#9989;</button>';
    html += '<button class="ti-header-btn" data-action="ti:pinConv:' + conv.id + '" title="' + (conv.pinned ? 'Unpin' : 'Pin') + '">' + (conv.pinned ? '&#128204;' : '&#128278;') + '</button>';
    html += '<button class="ti-header-btn" data-action="ti:rateTeacher:' + conv.id + '" title="Rate">&#11088;</button>';
    html += '</div></div>';
    html += '<div id="ti-conversation-search" class="ti-conv-search" style="display:none"><input type="text" class="ti-search-input" placeholder="Search in conversation..." data-action="ti-input:onSearch"></div>';
    html += '<div id="ti-chat-messages" class="ti-chat-messages"></div>';
    html += '<div class="ti-chat-input-area">';
    html += '<div class="ti-input-actions">';
    html += '<button class="ti-input-btn" data-action="ti:attach:image" title="Image">&#128247;</button>';
    html += '<button class="ti-input-btn" data-action="ti:attach:pdf" title="PDF">&#128196;</button>';
    html += '<button class="ti-input-btn" data-action="ti:attach:doc" title="Document">&#128206;</button>';
    html += '<button class="ti-input-btn" data-action="ti:voiceMsg" title="Voice">&#127908;</button>';
    html += '<button class="ti-input-btn" data-action="ti:scheduleMeeting" title="Schedule">&#128197;</button>';
    html += '</div>';
    html += '<div class="ti-input-row"><textarea id="ti-chat-input" class="ti-input" placeholder="Type your doubt..." rows="1" data-action="ti-keydown:chatInput"></textarea>';
    html += '<button class="ti-send-btn" data-action="ti:sendMessage">&#10148;</button></div>';
    html += '</div>';
    html += '</div></div>';
    mainContent.innerHTML = html;
    injectStyles();
    renderChatMessages();
    scrollToBottom();
  }

  function renderChatMessages() {
    var container = document.getElementById('ti-chat-messages');
    if (!container) return;
    var conv = getCurrentConversation();
    if (!conv || !conv.messages || conv.messages.length === 0) {
      container.innerHTML = '<div class="ti-empty-messages"><div class="ti-empty-icon">&#128172;</div><div>Type your doubt below</div></div>';
      return;
    }
    var teacher = getTeacherById(conv.teacherId);
    var avatar = teacher ? teacher.avatar : '\uD83D\uDC69\u200D\uD83C\uDFEB';
    var color = teacher ? teacher.color : '#3b82f6';
    var html = '';
    for (var i = 0; i < conv.messages.length; i++) {
      var msg = conv.messages[i];
      var isStudent = msg.sender === 'student';
      var timeStr = formatChatTime(msg.time);
      if (isStudent) {
        html += '<div class="ti-msg ti-msg-student">';
        html += '<div class="ti-msg-content"><div class="ti-msg-bubble ti-msg-bubble-student">' + sanitize(msg.text) + '</div>';
        html += '<div class="ti-msg-time">' + timeStr + ' &#10003;&#10003;</div>';
        if (msg.attachment) html += '<div class="ti-msg-attachment">&#128206; ' + sanitize(msg.attachment) + '</div>';
        html += '</div>';
        html += '<div class="ti-msg-avatar" style="background:var(--accent-blue)">&#128100;</div>';
        html += '</div>';
      } else {
        html += '<div class="ti-msg ti-msg-teacher">';
        html += '<div class="ti-msg-avatar" style="background:' + color + '">' + avatar + '</div>';
        html += '<div class="ti-msg-content"><div class="ti-msg-bubble ti-msg-bubble-teacher">' + sanitize(msg.text) + '</div>';
        html += '<div class="ti-msg-time">' + sanitize(conv.teacherName) + ' \u00B7 ' + timeStr + '</div>';
        if (msg.attachment) html += '<div class="ti-msg-attachment">&#128206; ' + sanitize(msg.attachment) + '</div>';
        html += '</div></div>';
      }
    }
    container.innerHTML = html;
  }

  function newConversation(teacherId, subject, title, detail) {
    var teacher = getTeacherById(teacherId);
    if (!teacher) { showToast('Please select a teacher', 'orange'); return null; }
    var id = 'tc_' + generateId();
    var conv = {
      id: id, teacherId: teacherId, teacherName: teacher.name, teacherAvatar: teacher.avatar, teacherColor: teacher.color,
      subject: subject, title: title || 'Untitled Question', detail: detail || '', messages: [],
      createdAt: new Date().toISOString(), lastTime: new Date().toISOString(), lastMsg: title || 'New question',
      status: 'pending', pinned: false, unread: false, rating: 0
    };
    if (detail && detail.trim()) {
      conv.messages.push({ id: 'msg_' + generateId(), text: detail, sender: 'student', time: new Date().toISOString(), status: 'sent' });
      conv.lastMsg = detail;
    }
    conversations.unshift(conv);
    currentConversationId = id;
    saveConversations();
    renderMain();
    showToast('Question sent to ' + teacher.name + '!', 'green');
    return conv;
  }

  function switchConversation(id) {
    currentConversationId = id;
    var conv = getCurrentConversation();
    if (conv) conv.unread = false;
    saveConversations();
    renderMain();
  }

  function deleteConversation(id) {
    if (!confirm('Delete this conversation?')) return;
    for (var i = 0; i < conversations.length; i++) { if (conversations[i].id === id) { conversations.splice(i, 1); break; } }
    if (currentConversationId === id) currentConversationId = conversations.length > 0 ? conversations[0].id : null;
    saveConversations();
    renderMain();
  }

  function togglePin(id) {
    for (var i = 0; i < conversations.length; i++) { if (conversations[i].id === id) { conversations[i].pinned = !conversations[i].pinned; break; } }
    saveConversations();
    renderMain();
  }

  function markResolved(id) {
    for (var i = 0; i < conversations.length; i++) { if (conversations[i].id === id) { conversations[i].status = 'resolved'; break; } }
    saveConversations();
    renderMain();
    showToast('Marked as resolved!', 'green');
  }

  function setCategory(cat) { activeCategory = cat; renderMain(); }
  function onSearch(q) { searchQuery = q; renderMain(); }
  function filterByTeacher(id) { filterState.teacher = id ? [id] : []; renderMain(); }

  function showNewQuestionModal() {
    var overlay = document.createElement('div');
    overlay.className = 'ti-modal-overlay';
    var subjects = getSubjectsForClass();
    var subjectOptions = '<option value="">Select Subject</option>';
    for (var si = 0; si < subjects.length; si++) subjectOptions += '<option value="' + subjects[si] + '">' + subjects[si] + '</option>';
    var html = '<div class="ti-modal">';
    html += '<div class="ti-modal-header"><h3>Ask a New Question</h3><button class="ti-modal-close" id="newq-close-btn">&times;</button></div>';
    html += '<div class="ti-modal-body">';
    html += '<div class="ti-form-group"><label>Subject</label><select id="newq-subject" class="ti-form-input" data-action="ti-change:newQSubject">' + subjectOptions + '</select></div>';
    html += '<div class="ti-form-group"><label>Teacher</label><select id="newq-teacher" class="ti-form-input"><option value="">Select Subject First</option></select></div>';
    html += '<div class="ti-form-group"><label>Question Title *</label><input type="text" id="newq-title" class="ti-form-input" placeholder="e.g. Help with quadratic equations"></div>';
    html += '<div class="ti-form-group"><label>Question Detail</label><textarea id="newq-detail" class="ti-form-input" placeholder="Describe your doubt..." style="min-height:100px"></textarea></div>';
    html += '<div class="ti-form-group"><label>Attachments</label><div class="ti-dropzone">&#128193; Click to upload or drag files</div></div>';
    html += '<button class="ti-btn ti-btn-primary ti-btn-block" data-action="ti:submitQ">Submit Question &#10148;</button>';
    html += '</div></div>';
    overlay.innerHTML = html;
    document.body.appendChild(overlay);
    var closeBtn = document.getElementById('newq-close-btn');
    if (closeBtn) closeBtn.addEventListener('click', function () { overlay.remove(); });
    overlay.addEventListener('click', function (e) { if (e.target === overlay) overlay.remove(); });
  }

  function onNewQSubjectChange(subject) {
    var teacherSelect = document.getElementById('newq-teacher');
    if (!teacherSelect) return;
    if (!subject) { teacherSelect.innerHTML = '<option value="">Select Subject First</option>'; return; }
    var teachers = getTeachersForSubject(subject);
    var html = '<option value="">Select Teacher</option>';
    for (var i = 0; i < teachers.length; i++) html += '<option value="' + teachers[i].id + '">' + sanitize(teachers[i].name) + ' (' + teachers[i].experience + ')</option>';
    teacherSelect.innerHTML = html;
  }

  function submitNewQuestion() {
    var subject = document.getElementById('newq-subject');
    var teacherSelect = document.getElementById('newq-teacher');
    var title = document.getElementById('newq-title');
    var detail = document.getElementById('newq-detail');
    if (!subject || !teacherSelect || !title || !detail) return;
    if (!subject.value) { showToast('Please select a subject', 'orange'); return; }
    if (!teacherSelect.value) { showToast('Please select a teacher', 'orange'); return; }
    if (!title.value.trim()) { showToast('Please enter a question title', 'orange'); return; }
    var conv = newConversation(teacherSelect.value, subject.value, title.value.trim(), detail.value.trim());
    if (conv) { var overlay = subject.closest('.ti-modal-overlay'); if (overlay) overlay.remove(); }
  }

  function showRateModal(convId) {
    var overlay = document.createElement('div');
    overlay.className = 'ti-modal-overlay';
    var html = '<div class="ti-modal ti-modal-sm">';
    html += '<div class="ti-modal-header"><h3>Rate Your Teacher</h3><button class="ti-modal-close" id="rate-close-btn">&times;</button></div>';
    html += '<div class="ti-modal-body ti-text-center">';
    html += '<div class="ti-rate-stars" id="ti-rate-stars"><span class="ti-star" data-rating="1">&#11088;</span><span class="ti-star" data-rating="2">&#11088;</span><span class="ti-star" data-rating="3">&#11088;</span><span class="ti-star" data-rating="4">&#11088;</span><span class="ti-star" data-rating="5">&#11088;</span></div>';
    html += '<div class="ti-rate-label" id="ti-rate-label">Tap a star to rate</div>';
    html += '<button class="ti-btn ti-btn-primary ti-btn-block" id="ti-rate-submit" disabled>Submit Rating</button>';
    html += '</div></div>';
    overlay.innerHTML = html;
    document.body.appendChild(overlay);
    var selectedRating = 0;
    var stars = overlay.querySelectorAll('.ti-star');
    for (var si = 0; si < stars.length; si++) {
      (function (star) {
        star.addEventListener('click', function () {
          selectedRating = parseInt(this.getAttribute('data-rating'));
          for (var j = 0; j < stars.length; j++) {
            var r = parseInt(stars[j].getAttribute('data-rating'));
            stars[j].style.opacity = r <= selectedRating ? '1' : '0.3';
          }
          var label = document.getElementById('ti-rate-label');
          if (label) { var labels = ['', 'Poor', 'Fair', 'Good', 'Very Good', 'Excellent']; label.textContent = labels[selectedRating] || ''; }
          var submitBtn = document.getElementById('ti-rate-submit');
          if (submitBtn) submitBtn.disabled = false;
        });
      })(stars[si]);
    }
    var submitBtn = document.getElementById('ti-rate-submit');
    if (submitBtn) {
      submitBtn.addEventListener('click', function () {
        if (selectedRating < 1) { showToast('Please select a rating', 'orange'); return; }
        for (var i = 0; i < conversations.length; i++) { if (conversations[i].id === convId) { conversations[i].rating = selectedRating; break; } }
        saveConversations();
        overlay.remove();
        showToast('Rating submitted!', 'green');
        renderMain();
      });
    }
    var closeBtn = document.getElementById('rate-close-btn');
    if (closeBtn) closeBtn.addEventListener('click', function () { overlay.remove(); });
    overlay.addEventListener('click', function (e) { if (e.target === overlay) overlay.remove(); });
  }

  function mockAttachment(type) {
    var conv = getCurrentConversation();
    if (!conv) { showToast('Select a conversation first', 'orange'); return; }
    var names = { image: 'screenshot_' + Date.now().toString(36) + '.png', pdf: 'notes_' + Date.now().toString(36) + '.pdf', doc: 'assignment_' + Date.now().toString(36) + '.docx' };
    var msg = { id: 'msg_' + generateId(), text: '\uD83D\uDCCE ' + names[type], sender: 'student', time: new Date().toISOString(), status: 'sent', attachment: names[type] };
    conv.messages.push(msg);
    conv.lastMsg = '\uD83D\uDCCE ' + names[type];
    conv.lastTime = new Date().toISOString();
    saveConversations();
    renderChatMessages();
    scrollToBottom();
    showToast('File attached: ' + names[type], 'green');
    isTyping = true;
    setTimeout(function () {
      hideTypingIndicator();
      if (conv && conv.id === currentConversationId) {
        var replies = { image: 'Thanks for sharing! I can see the problem. Let me guide you through it.', pdf: 'I\'ve reviewed your PDF. Great work! Here are my suggestions.', doc: 'I\'ve gone through your document. Here are my comments.' };
        var replyMsg = { id: 'msg_' + generateId(), text: replies[type] || 'Thanks for the file!', sender: 'teacher', time: new Date().toISOString(), status: 'read', attachment: 'Reviewed: ' + names[type] };
        conv.messages.push(replyMsg);
        conv.lastMsg = replyMsg.text;
        conv.lastTime = new Date().toISOString();
        conv.status = 'ongoing';
        saveConversations();
        renderChatMessages();
        scrollToBottom();
      }
    }, 1200 + Math.random() * 800);
  }

  function injectStyles() {
    if (document.getElementById('ti-gchat-styles')) return;
    var s = document.createElement('style');
    s.id = 'ti-gchat-styles';
    s.textContent = '\
.ti-root{display:flex;height:calc(100vh - var(--header-height) - var(--space-8));overflow:hidden;position:relative}\
.ti-overlay{position:fixed;inset:0;background:rgba(0,0,0,0.5);z-index:100;display:none}\
.ti-overlay.active{display:block}\
.ti-sidebar{width:340px;flex-shrink:0;display:flex;flex-direction:column;background:var(--bg-card);border-right:1px solid var(--border-light);overflow:hidden}\
.ti-sidebar-header{display:flex;align-items:center;justify-content:space-between;padding:var(--space-3) var(--space-4);border-bottom:1px solid var(--border-light)}\
.ti-sidebar-title{font-size:var(--text-base);font-weight:600;margin:0}\
.ti-new-btn{padding:6px 14px;background:var(--accent-blue);color:white;border:none;border-radius:var(--radius-md);font-size:var(--text-xs);font-weight:500;cursor:pointer}\
.ti-new-btn:hover{opacity:0.9}\
.ti-sidebar-search{padding:var(--space-2) var(--space-3);position:relative;border-bottom:1px solid var(--border-light)}\
.ti-search-input{width:100%;padding:6px 10px 6px 28px;background:var(--bg-tertiary);border:1px solid var(--border-light);border-radius:var(--radius-md);color:var(--text-primary);font-size:var(--text-xs);outline:none;box-sizing:border-box}\
.ti-search-input:focus{border-color:var(--accent-blue)}\
.ti-search-icon{position:absolute;left:20px;top:50%;transform:translateY(-50%);font-size:12px;color:var(--text-tertiary)}\
.ti-categories{display:flex;padding:var(--space-2) var(--space-3);gap:var(--space-1);overflow-x:auto;border-bottom:1px solid var(--border-light)}\
.ti-cat{padding:4px 10px;border:1px solid var(--border-light);border-radius:999px;font-size:10px;background:transparent;color:var(--text-secondary);cursor:pointer;white-space:nowrap;transition:all 0.15s;display:flex;align-items:center;gap:4px}\
.ti-cat:hover{background:var(--bg-glass)}\
.ti-cat.active{background:var(--accent-blue);color:white;border-color:var(--accent-blue)}\
.ti-cat-count{font-size:9px;opacity:0.7}\
.ti-conv-list{flex:1;overflow-y:auto;padding:var(--space-2)}\
.ti-conv{display:flex;align-items:center;gap:var(--space-2);padding:var(--space-2) var(--space-3);border-radius:var(--radius-md);cursor:pointer;transition:background 0.15s;margin-bottom:2px}\
.ti-conv:hover{background:var(--bg-glass)}\
.ti-conv.active{background:var(--accent-blue);color:white}\
.ti-conv-avatar{width:40px;height:40px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:1.1rem;flex-shrink:0;position:relative}\
.ti-online-dot{position:absolute;bottom:0;right:0;width:10px;height:10px;background:#10b981;border:2px solid var(--bg-card);border-radius:50%}\
.ti-conv.active .ti-online-dot{border-color:var(--accent-blue)}\
.ti-conv-body{flex:1;min-width:0}\
.ti-conv-top{display:flex;justify-content:space-between;align-items:center}\
.ti-conv-name{font-size:var(--text-xs);font-weight:500;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}\
.ti-conv-time{font-size:9px;color:var(--text-tertiary);flex-shrink:0}\
.ti-conv.active .ti-conv-time{color:rgba(255,255,255,0.6)}\
.ti-conv-bottom{display:flex;justify-content:space-between;align-items:center;margin-top:2px}\
.ti-conv-preview{font-size:10px;color:var(--text-tertiary);overflow:hidden;text-overflow:ellipsis;white-space:nowrap;flex:1}\
.ti-conv.active .ti-conv-preview{color:rgba(255,255,255,0.6)}\
.ti-conv-badge{font-size:10px;flex-shrink:0}\
.ti-conv-meta{display:flex;gap:var(--space-2);margin-top:2px}\
.ti-conv-teacher{font-size:9px;color:var(--text-tertiary)}\
.ti-conv.active .ti-conv-teacher{color:rgba(255,255,255,0.5)}\
.ti-conv-subject{font-size:9px;color:var(--text-tertiary);background:var(--bg-glass);padding:0 6px;border-radius:999px}\
.ti-conv.active .ti-conv-subject{background:rgba(255,255,255,0.2);color:rgba(255,255,255,0.7)}\
.ti-conv-actions{flex-shrink:0;margin-left:var(--space-1)}\
.ti-conv-pin{font-size:10px}\
.ti-sidebar-footer{padding:var(--space-2) var(--space-3);border-top:1px solid var(--border-light);font-size:10px;color:var(--text-tertiary);text-align:center}\
.ti-empty-list{display:flex;flex-direction:column;align-items:center;justify-content:center;padding:var(--space-8);color:var(--text-tertiary);font-size:var(--text-xs)}\
.ti-empty-icon{font-size:2rem;margin-bottom:var(--space-2)}\
.ti-empty-sub{font-size:10px;opacity:0.7}\
.ti-main{flex:1;display:flex;flex-direction:column;min-width:0}\
.ti-empty-main{display:flex;flex-direction:column;align-items:center;justify-content:center;height:100%;text-align:center;padding:2rem;color:var(--text-secondary)}\
.ti-empty-main-icon{font-size:3rem;margin-bottom:var(--space-3);opacity:0.5}\
.ti-empty-main h3{font-size:var(--text-lg);font-weight:600;margin:0 0 var(--space-2)}\
.ti-empty-main p{font-size:var(--text-sm);margin:0 0 var(--space-4)}\
.ti-chat-header{display:flex;align-items:center;padding:var(--space-2) var(--space-4);border-bottom:1px solid var(--border-light);gap:var(--space-3);flex-shrink:0}\
.ti-back-btn{display:none;background:none;border:none;font-size:1.25rem;cursor:pointer;padding:4px;color:var(--text-primary)}\
.ti-chat-header-avatar{width:40px;height:40px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:1.1rem;flex-shrink:0;position:relative}\
.ti-chat-header-info{flex:1;min-width:0}\
.ti-chat-header-name{font-size:var(--text-sm);font-weight:600}\
.ti-chat-header-meta{font-size:var(--text-xs);color:var(--text-secondary)}\
.ti-chat-header-actions{display:flex;gap:var(--space-1)}\
.ti-header-btn{background:none;border:none;padding:6px 8px;border-radius:var(--radius-sm);cursor:pointer;font-size:1rem;color:var(--text-secondary);transition:background 0.15s}\
.ti-header-btn:hover{background:var(--bg-glass)}\
.ti-conv-search{padding:var(--space-2) var(--space-4);border-bottom:1px solid var(--border-light)}\
.ti-chat-messages{flex:1;overflow-y:auto;padding:var(--space-4)}\
.ti-msg{display:flex;gap:var(--space-2);margin-bottom:var(--space-3);animation:fadeIn 0.2s ease}\
.ti-msg-student{justify-content:flex-end}\
.ti-msg-avatar{width:32px;height:32px;border-radius:50%;display:flex;align-items:center;justify-content:center;flex-shrink:0;font-size:0.9rem;position:relative}\
.ti-msg-content{max-width:70%}\
.ti-msg-bubble{padding:10px 14px;border-radius:var(--radius-lg);font-size:var(--text-sm);line-height:1.5;word-wrap:break-word}\
.ti-msg-bubble-student{background:linear-gradient(135deg,var(--accent-blue),var(--accent-purple));color:white;border-radius:var(--radius-lg) var(--radius-lg) 0 var(--radius-lg)}\
.ti-msg-bubble-teacher{background:var(--bg-glass-strong);border-radius:var(--radius-lg) var(--radius-lg) var(--radius-lg) 0}\
.ti-msg-time{font-size:10px;color:var(--text-tertiary);margin-top:4px;padding:0 4px}\
.ti-msg-attachment{font-size:var(--text-xs);color:var(--accent-blue);background:var(--bg-glass);padding:4px 8px;border-radius:var(--radius-sm);margin-top:4px;display:inline-block}\
.ti-typing-bubble{background:var(--bg-glass-strong);padding:10px 14px;border-radius:var(--radius-lg) var(--radius-lg) var(--radius-lg) 0}\
.ti-typing-dots{display:flex;gap:4px}\
.ti-typing-dots span{width:6px;height:6px;background:var(--text-tertiary);border-radius:50%;animation:tiTypingBounce 1.4s infinite}\
.ti-typing-dots span:nth-child(2){animation-delay:0.2s}\
.ti-typing-dots span:nth-child(3){animation-delay:0.4s}\
@keyframes tiTypingBounce{0%,80%,100%{transform:translateY(0)}40%{transform:translateY(-6px)}}\
.ti-empty-messages{display:flex;flex-direction:column;align-items:center;justify-content:center;height:100%;color:var(--text-tertiary);font-size:var(--text-sm)}\
.ti-chat-input-area{border-top:1px solid var(--border-light);padding:var(--space-2) var(--space-4);flex-shrink:0}\
.ti-input-actions{display:flex;gap:var(--space-1);margin-bottom:var(--space-2)}\
.ti-input-btn{background:none;border:none;padding:4px 6px;cursor:pointer;font-size:1rem;border-radius:var(--radius-sm);color:var(--text-secondary);transition:all 0.15s}\
.ti-input-btn:hover{background:var(--bg-glass);color:var(--accent-blue)}\
.ti-input-row{display:flex;align-items:flex-end;gap:var(--space-2);background:var(--bg-tertiary);border:1px solid var(--border-light);border-radius:var(--radius-lg);padding:var(--space-2)}\
.ti-input-row:focus-within{border-color:var(--accent-blue)}\
.ti-input{flex:1;border:none;background:transparent;color:var(--text-primary);font-size:var(--text-sm);resize:none;min-height:20px;max-height:100px;outline:none;font-family:inherit;padding:4px 0}\
.ti-send-btn{width:36px;height:36px;border-radius:50%;background:var(--accent-blue);color:white;border:none;cursor:pointer;font-size:1rem;display:flex;align-items:center;justify-content:center;flex-shrink:0;transition:opacity 0.15s}\
.ti-send-btn:hover{opacity:0.9}\
.ti-modal-overlay{position:fixed;inset:0;background:rgba(0,0,0,0.5);z-index:1000;display:flex;align-items:center;justify-content:center;animation:fadeIn 0.2s ease}\
.ti-modal{background:var(--bg-card);border:1px solid var(--border-light);border-radius:var(--radius-lg);max-width:520px;width:90%;box-shadow:0 20px 60px rgba(0,0,0,0.3)}\
.ti-modal-sm{max-width:400px}\
.ti-modal-header{display:flex;align-items:center;justify-content:space-between;padding:var(--space-4);border-bottom:1px solid var(--border-light)}\
.ti-modal-header h3{margin:0;font-size:var(--text-base);font-weight:600}\
.ti-modal-close{background:none;border:none;font-size:1.5rem;cursor:pointer;color:var(--text-secondary)}\
.ti-modal-body{padding:var(--space-4)}\
.ti-text-center{text-align:center}\
.ti-form-group{margin-bottom:var(--space-3)}\
.ti-form-group label{display:block;font-size:var(--text-xs);font-weight:500;color:var(--text-secondary);margin-bottom:4px}\
.ti-form-input{width:100%;padding:8px 12px;background:var(--bg-tertiary);border:1px solid var(--border-light);border-radius:var(--radius-md);color:var(--text-primary);font-size:var(--text-sm);outline:none;box-sizing:border-box;font-family:inherit}\
.ti-form-input:focus{border-color:var(--accent-blue)}\
.ti-dropzone{padding:var(--space-4);text-align:center;border:2px dashed var(--border-color);border-radius:var(--radius-md);color:var(--text-tertiary);font-size:var(--text-sm);cursor:pointer}\
.ti-btn{padding:6px 14px;border:none;border-radius:var(--radius-md);font-size:var(--text-xs);font-weight:500;cursor:pointer;transition:all 0.15s}\
.ti-btn-primary{background:var(--accent-blue);color:white}\
.ti-btn-primary:hover{opacity:0.9}\
.ti-btn-secondary{background:var(--bg-glass);color:var(--text-primary);border:1px solid var(--border-light)}\
.ti-btn-block{width:100%;padding:10px}\
.ti-btn:disabled{opacity:0.4;cursor:not-allowed}\
.ti-rate-stars{display:flex;gap:4px;justify-content:center;margin-bottom:var(--space-3)}\
.ti-star{font-size:1.5rem;cursor:pointer;transition:transform 0.1s;display:inline-block}\
.ti-star:hover{transform:scale(1.2)}\
.ti-rate-label{font-size:var(--text-xs);color:var(--text-tertiary);margin-bottom:var(--space-3)}\
.ti-toast{position:fixed;bottom:80px;left:50%;transform:translateX(-50%);color:white;padding:8px 16px;border-radius:var(--radius-md);font-size:var(--text-sm);z-index:9999;animation:fadeIn 0.3s ease;box-shadow:0 4px 12px rgba(0,0,0,0.3)}\
@media(max-width:992px){.ti-sidebar{width:300px}}\
@media(max-width:768px){\
.ti-sidebar{position:fixed;top:0;left:0;bottom:0;z-index:100;width:280px;transform:translateX(-100%);transition:transform 0.3s}\
.ti-sidebar.open{transform:translateX(0)}\
.ti-back-btn{display:block!important}\
.ti-empty-main{display:none}\
.ti-root.ti-show-chat .ti-sidebar{display:none}\
.ti-root.ti-show-chat .ti-main{display:flex}\
}\
@media(min-width:769px){.ti-back-btn{display:none!important}.ti-overlay{display:none!important}}\
';
    document.head.appendChild(s);
  }

  window.renderPage.teacherInteraction.sendMessage = sendMessage;
  window.renderPage.teacherInteraction.handleKeyDown = handleKeyDown;
  window.renderPage.teacherInteraction.switchConversation = switchConversation;
  window.renderPage.teacherInteraction.deleteConversation = deleteConversation;
  window.renderPage.teacherInteraction.togglePin = togglePin;
  window.renderPage.teacherInteraction.markResolved = markResolved;
  window.renderPage.teacherInteraction.setCategory = setCategory;
  window.renderPage.teacherInteraction.onSearch = onSearch;
  window.renderPage.teacherInteraction.filterByTeacher = filterByTeacher;
  window.renderPage.teacherInteraction.openFilterDrawer = openFilterDrawer;
  window.renderPage.teacherInteraction.showNewQuestionModal = showNewQuestionModal;
  window.renderPage.teacherInteraction.onNewQSubjectChange = onNewQSubjectChange;
  window.renderPage.teacherInteraction.submitNewQuestion = submitNewQuestion;
  window.renderPage.teacherInteraction.showRateModal = showRateModal;
  window.renderPage.teacherInteraction.mockAttachment = mockAttachment;

  renderMain();
};
