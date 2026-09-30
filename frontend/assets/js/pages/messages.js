window.renderPage = window.renderPage || {};

window.renderPage.messages = function(params) {
  if (!window._msgDelegated) {
    window._msgDelegated = true;
    document.addEventListener('click', function(e) {
      var el = e.target.closest('[data-action^="msg:"]');
      if (!el) return;
      var action = el.getAttribute('data-action');
      if (action === 'msg:contextAction') {
        var type = el.getAttribute('data-action-type');
        var convId = el.getAttribute('data-conv-id');
        if (type === 'pin') togglePin(convId);
        else if (type === 'markread') markAsRead(convId);
        else if (type === 'delete') deleteConversation(convId);
        var menu = document.getElementById('msg-context-menu');
        if (menu) menu.remove();
      }
    });
  }
  var container = document.getElementById('main-content');
  if (!container) return;
  var utils = window.Utils;
  var store = window.Store;

  var activeChatId = null;
  var typingTimer = null;
  var mobilePanel = 'list';
  var emojiOpen = false;
  var searchQuery = '';

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

  var avatarColors = ['#3b82f6','#8b5cf6','#ec4899','#f97316','#10b981','#06b6d4','#f59e0b','#6366f1','#14b8a6','#f43f5e'];

  var emojiList = ['😀','😃','😄','😁','😅','😂','🤣','😊','😇','🙂','😉','😌','😍','🥰','😘','😗','😋','😛','😜','🤪','😝','🤑','🤗','🤭','🤫','🤔','🤐','🤨','😐','😑','😶','😏','😒','🙄','😬','🤥','😌','😔','😪','🤤','😴','😷','🤒','🤕','🤢','🤮','🥴','😵','🤯','🤠','🥳','🥺','😢','😭','😤','😠','😡','🤬','🤡','💩','👻','💀','☠️','👋','✋','🖐️','✌️','🤞','👍','👎','👊','✊','🤛','🤜','👏','🙌','🤲','🤝','🙏','💪','🔥','⭐','❤️','💔','💖','💙','💚','💛','💜','🖤','💯','✨','🎉','🎊','🎈','🎁','🎀','🚀','💡','📚','📝','✅','❌','❓','❗','➕','➖','➗','✖️'];

  var mockUsers = [
    { name: 'Priya Patel', lastMsg: 'Did you solve the calculus problem?', online: true },
    { name: 'Rahul Verma', lastMsg: 'The organic chem notes are ready', online: true },
    { name: 'Ananya Gupta', lastMsg: 'Can we reschedule the study session?', online: false },
    { name: 'Vikram Singh', lastMsg: 'Great explanation on vectors!', online: true },
    { name: 'Neha Kapoor', lastMsg: 'Share the physics worksheet please', online: false },
    { name: 'Arjun Reddy', lastMsg: 'JEE prep link shared', online: false },
    { name: 'Kavita Nair', lastMsg: 'English grammar tips attached', online: true },
    { name: 'Rohit Joshi', lastMsg: 'When is the next group study?', online: false },
    { name: 'Sneha Iyer', lastMsg: 'Thanks for the help!', online: false },
    { name: 'Dr. Meera Joshi', lastMsg: 'Assignment deadline extended', online: true }
  ];

  var textSamples = [
    'Hey! How are you doing with the studies?',
    'I just finished the chapter on thermodynamics',
    'Can you explain the second law to me?',
    'Sure! The second law states that entropy of an isolated system always increases',
    'That makes sense now. Thank you!',
    'No problem! Do you want to practice some problems together?',
    'Yes, that would be great. When are you free?',
    'How about tomorrow at 4 PM?',
    'Perfect! I will bring my notes',
    'Great, see you then!',
    'By the way, did you check the mock test results?',
    'Not yet, are they out?',
    'Yes, I scored 85% in physics',
    'Wow, thats amazing! Congratulations!',
    'Thanks! Your math score was impressive too',
    'I need to work on calculus more',
    'I can help you with that if you want',
    'That would be really helpful',
    'Lets meet this weekend',
    'Sounds like a plan!'
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

  function formatChatTime(isoStr) {
    var d = new Date(isoStr);
    if (isNaN(d.getTime())) return '';
    var now = new Date();
    var hrs = d.getHours();
    var mins = d.getMinutes();
    var ampm = hrs >= 12 ? 'PM' : 'AM';
    hrs = hrs % 12 || 12;
    var minStr = mins < 10 ? '0' + mins : mins;
    if (d.toDateString() === now.toDateString()) return hrs + ':' + minStr + ' ' + ampm;
    var yesterday = new Date(now);
    yesterday.setDate(yesterday.getDate() - 1);
    if (d.toDateString() === yesterday.toDateString()) return 'Yesterday';
    return utils.formatDate(isoStr, 'dd mmm');
  }

  function getDateSeparator(isoStr) {
    var d = new Date(isoStr);
    if (isNaN(d.getTime())) return '';
    var now = new Date();
    if (d.toDateString() === now.toDateString()) return 'Today';
    var yesterday = new Date(now);
    yesterday.setDate(yesterday.getDate() - 1);
    if (d.toDateString() === yesterday.toDateString()) return 'Yesterday';
    return utils.formatDate(isoStr, 'dd mmmm yyyy');
  }

  function getRelativeTime(isoStr) {
    var d = new Date(isoStr);
    if (isNaN(d.getTime())) return '';
    var now = new Date();
    var diff = Math.floor((now - d) / 1000);
    if (diff < 60) return 'now';
    diff = Math.floor(diff / 60);
    if (diff < 60) return diff + 'm';
    diff = Math.floor(diff / 60);
    if (diff < 24) return diff + 'h';
    diff = Math.floor(diff / 24);
    if (diff < 7) return diff + 'd';
    return utils.formatDate(isoStr, 'dd mmm');
  }

  function sanitize(str) {
    if (!str) return '';
    var map = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#x27;' };
    return String(str).replace(/[&<>"']/g, function(m) { return map[m]; });
  }

  function getConversations() {
    return store.get('conversations') || [];
  }

  function setConversations(list) {
    store.set('conversations', list);
  }

  function getChatMessages() {
    return store.get('chatMessages') || {};
  }

  function setChatMessages(msgs) {
    store.set('chatMessages', msgs);
  }

  function getPinnedChats() {
    return store.get('pinnedChats') || [];
  }

  function setPinnedChats(list) {
    store.set('pinnedChats', list);
  }

  function initData() {
    var convs = getConversations();
    if (convs && convs.length > 0) return;
    var allMsgs = {};
    var newConvs = [];
    var baseTime = new Date();
    for (var i = 0; i < mockUsers.length; i++) {
      var u = mockUsers[i];
      var convId = 'conv_' + (i + 1);
      var msgCount = 5 + (Math.random() * 15 | 0);
      var msgs = [];
      var convTime = new Date(baseTime.getTime() - i * 7200000 - (i * 3600000));
      var isOutgoing = false;
      var lastMsgText = '';
      for (var m = 0; m < msgCount; m++) {
        var msgTime = new Date(convTime.getTime() + m * 600000);
        var sampleIdx = (i + m * 3 + Math.floor(Math.random() * 3)) % textSamples.length;
        var txt = textSamples[sampleIdx];
        msgs.push({
          id: 'msg_' + convId + '_' + m,
          text: txt,
          sender: isOutgoing ? 'me' : u.name,
          time: msgTime.toISOString(),
          status: m < msgCount - 2 ? 'read' : (m % 3 === 0 ? 'delivered' : 'sent'),
          isMine: isOutgoing
        });
        isOutgoing = !isOutgoing;
        lastMsgText = txt;
      }
      var unreadCount = 0;
      for (var k = msgs.length - 1; k >= 0; k--) {
        if (!msgs[k].isMine) { unreadCount++; if (unreadCount >= 3) break; }
      }
      allMsgs[convId] = msgs;
      newConvs.push({
        id: convId,
        name: u.name,
        lastMsg: lastMsgText,
        time: convTime.toISOString(),
        unread: i < 3 ? 1 + (i % 3) : 0,
        online: u.online
      });
    }
    setConversations(newConvs);
    setChatMessages(allMsgs);
  }

  function persistConversations() {
  }

  function persistMessages() {
  }

  function getPinnedFirst(list) {
    var pinned = getPinnedChats();
    var pinnedItems = [];
    var unpinned = [];
    for (var i = 0; i < list.length; i++) {
      if (pinned.indexOf(list[i].id) !== -1) {
        pinnedItems.push(list[i]);
      } else {
        unpinned.push(list[i]);
      }
    }
    return pinnedItems.concat(unpinned);
  }

  function render() {
    var conversations = getConversations();
    var chatMessages = getChatMessages();

    var html = '';
    html += '<div class="page-container animate-fadeInUp" style="height:calc(100vh - var(--header-height) - var(--space-8));display:flex;flex-direction:column;padding:0;overflow:hidden">';
    html += '<div class="page-header" style="padding:var(--space-4) var(--space-6) 0;flex-shrink:0;display:none"><div><h1 class="page-title">Messages</h1><p class="page-subtitle">Chat with your study community</p></div></div>';
    html += '<div class="flex flex-1" style="min-height:0;overflow:hidden;position:relative">';

    html += renderLeftPanel(conversations, chatMessages);
    html += renderRightPanel(conversations, chatMessages);

    html += '</div></div>';

    container.innerHTML = html;
    bindEvents();
    scrollToBottom();

    if (activeChatId) {
      var conv = null;
      for (var i = 0; i < conversations.length; i++) {
        if (conversations[i].id === activeChatId) { conv = conversations[i]; break; }
      }
      if (!conv) {
        activeChatId = null;
        render();
        return;
      }
    }
  }

  function renderLeftPanel(conversations, chatMessages) {
    var pinned = getPinnedChats();
    var filtered = conversations;
    if (searchQuery) {
      var q = searchQuery.toLowerCase();
      filtered = conversations.filter(function(c) { return c.name.toLowerCase().indexOf(q) !== -1; });
    }
    var ordered = getPinnedFirst(filtered);

    var html = '';
    html += '<div id="msg-left-panel" class="glass-card" style="width:320px;flex-shrink:0;display:flex;flex-direction:column;overflow:hidden;border-radius:var(--radius-lg) 0 0 var(--radius-lg);border-right:none;' + (mobilePanel === 'chat' && isMobile() ? 'display:none' : '') + '">';

    html += '<div style="padding:var(--space-3) var(--space-4);border-bottom:1px solid rgba(255,255,255,0.08);flex-shrink:0">';
    html += '<div class="input-with-icon"><span class="input-icon" style="font-size:0.875rem">🔍</span><input type="text" class="input-field" id="msg-search-input" placeholder="Search people..." value="' + sanitize(searchQuery) + '" style="width:100%;padding:0.5rem 0.75rem 0.5rem 2rem;font-size:var(--text-sm);border-radius:var(--radius-full)"></div>';
    html += '</div>';

    if (conversations.length === 0) {
      html += '<div class="flex-1 flex items-center justify-center flex-col" style="padding:var(--space-8)">';
      html += '<div style="font-size:2.5rem;opacity:0.3;margin-bottom:var(--space-4)">💬</div>';
      html += '<div class="text-sm" style="color:var(--text-tertiary);text-align:center">No conversations yet</div>';
      html += '<div class="text-xs" style="color:var(--text-muted);text-align:center;margin-top:var(--space-2)">Start a new chat to begin</div>';
      html += '</div>';
    } else {
      html += '<div class="flex-1" style="overflow-y:auto" id="msg-conv-list">';

      var shownPinned = false;
      for (var i = 0; i < ordered.length; i++) {
        var c = ordered[i];
        var isPinned = pinned.indexOf(c.id) !== -1;
        if (isPinned && !shownPinned) {
          shownPinned = true;
        }
        var msgs = chatMessages[c.id] || [];
        var unread = c.unread || 0;
        var lastMsg = c.lastMsg || '';
        var timeLabel = getRelativeTime(c.time);
        var isActive = activeChatId === c.id;

        html += '<div class="msg-conv-item" data-id="' + c.id + '" style="display:flex;gap:var(--space-3);padding:var(--space-3) var(--space-4);cursor:pointer;border-bottom:1px solid rgba(255,255,255,0.04);transition:background 0.15s;background:' + (isActive ? 'rgba(59,130,246,0.12)' : 'transparent') + '">';
        html += '<div style="position:relative;flex-shrink:0">';
        html += '<div class="avatar" style="background:' + avatarColors[i % avatarColors.length] + ';width:42px;height:42px;font-size:var(--text-sm)">' + getInitials(c.name) + '</div>';
        if (c.online) {
          html += '<div style="position:absolute;bottom:-1px;right:-1px;width:12px;height:12px;background:#10b981;border-radius:50%;border:2px solid var(--bg-secondary)"></div>';
        }
        html += '</div>';
        html += '<div class="flex-1 min-w-0" style="overflow:hidden">';
        html += '<div class="flex items-center justify-between">';
        html += '<span class="text-sm" style="font-weight:' + (unread > 0 ? '700' : '500') + ';color:var(--text-primary);white-space:nowrap;overflow:hidden;text-overflow:ellipsis">' + sanitize(c.name) + '</span>';
        html += '<div class="flex items-center gap-1" style="flex-shrink:0">';
        if (isPinned) {
          html += '<span style="font-size:11px;color:var(--accent-yellow)">📌</span>';
        }
        html += '<span class="text-xs" style="color:var(--text-tertiary);white-space:nowrap;font-size:11px">' + timeLabel + '</span>';
        html += '</div>';
        html += '</div>';
        html += '<div class="flex items-center justify-between" style="margin-top:2px">';
        html += '<span class="text-xs" style="color:var(--text-secondary);white-space:nowrap;overflow:hidden;text-overflow:ellipsis;max-width:' + (unread > 0 ? '140px' : '170px') + '">' + sanitize(lastMsg) + '</span>';
        if (unread > 0) {
          html += '<span class="badge" style="background:var(--accent-blue);color:#fff;font-size:10px;min-width:18px;height:18px;display:flex;align-items:center;justify-content:center;padding:0 5px;border-radius:var(--radius-full);flex-shrink:0;font-weight:700">' + unread + '</span>';
        }
        html += '</div>';
        html += '</div>';
        html += '<div class="flex flex-col items-center justify-center gap-1" style="flex-shrink:0;align-self:center">';
        html += '<button class="msg-pin-btn" data-id="' + c.id + '" style="font-size:11px;opacity:0.4;padding:2px;border:none;background:none;cursor:pointer;color:' + (isPinned ? 'var(--accent-yellow)' : 'var(--text-tertiary)') + '" title="' + (isPinned ? 'Unpin' : 'Pin') + '">📌</button>';
        html += '<button class="msg-delete-btn" data-id="' + c.id + '" style="font-size:10px;opacity:0.3;padding:2px;border:none;background:none;cursor:pointer;color:var(--text-tertiary)" title="Delete">🗑️</button>';
        html += '</div>';
        html += '</div>';
      }

      html += '</div>';
    }

    html += '<div style="padding:var(--space-3);border-top:1px solid rgba(255,255,255,0.08);flex-shrink:0">';
    html += '<button class="btn btn-primary btn-sm btn-block" id="msg-new-chat-btn" style="border-radius:var(--radius-full)">+ New Chat</button>';
    html += '</div>';

    html += '</div>';
    return html;
  }

  function renderRightPanel(conversations, chatMessages) {
    var html = '';
    html += '<div id="msg-right-panel" class="glass-card flex-1" style="display:flex;flex-direction:column;overflow:hidden;border-radius:0 var(--radius-lg) var(--radius-lg) 0;' + (mobilePanel === 'list' && isMobile() ? 'display:none' : '') + '">';

    if (!activeChatId) {
      html += '<div class="flex-1 flex items-center justify-center flex-col" style="padding:var(--space-8);gap:var(--space-3)">';
      html += '<div style="width:80px;height:80px;border-radius:50%;background:var(--bg-glass);display:flex;align-items:center;justify-content:center;font-size:2.5rem;color:var(--text-tertiary)">💬</div>';
      html += '<div class="text-lg font-medium" style="color:var(--text-tertiary)">Select a conversation</div>';
      html += '<div class="text-sm" style="color:var(--text-muted);text-align:center">Choose a chat from the left panel to start messaging</div>';
      html += '</div>';
      html += '</div>';
      return html;
    }

    var conv = null;
    var convIdx = -1;
    for (var i = 0; i < conversations.length; i++) {
      if (conversations[i].id === activeChatId) { conv = conversations[i]; convIdx = i; break; }
    }
    if (!conv) {
      activeChatId = null;
      html += '<div class="flex-1 flex items-center justify-center flex-col"><div class="text-lg">Conversation not found</div></div></div>';
      return html;
    }

    var msgs = chatMessages[activeChatId] || [];

    html += '<div class="flex items-center gap-3" style="padding:var(--space-3) var(--space-4);border-bottom:1px solid rgba(255,255,255,0.08);flex-shrink:0">';
    if (isMobile()) {
      html += '<button id="msg-back-btn" style="font-size:1.25rem;padding:4px;background:none;border:none;color:var(--text-secondary);cursor:pointer">←</button>';
    }
    html += '<div class="avatar avatar-sm" style="background:' + avatarColors[convIdx % avatarColors.length] + ';width:38px;height:38px">' + getInitials(conv.name) + '</div>';
    html += '<div class="flex-1 min-w-0">';
    html += '<div class="text-sm font-semibold truncate">' + sanitize(conv.name) + '</div>';
    html += '<div class="text-xs" style="color:' + (conv.online ? '#10b981' : 'var(--text-tertiary)') + '">' + (conv.online ? '● Online' : 'Offline') + '</div>';
    html += '</div>';
    html += '<input type="text" id="msg-search-in-conv" placeholder="Search..." style="width:120px;padding:0.375rem 0.75rem;background:var(--bg-glass);border:1px solid var(--border-color);border-radius:var(--radius-full);color:var(--text-primary);font-size:var(--text-xs);outline:none;display:none" oninput="window.renderPage.messages.filterMessages()">';
    html += '<button id="msg-toggle-search" class="btn btn-ghost btn-icon-sm" title="Search in conversation" style="font-size:1rem">🔍</button>';
    html += '<button id="msg-options-btn" class="btn btn-ghost btn-icon-sm" title="More options" style="font-size:1rem">⋮</button>';
    html += '</div>';

    html += '<div class="flex-1" style="overflow-y:auto;padding:var(--space-3) var(--space-4)" id="msg-messages-container">';

    var lastDate = '';
    for (var i = 0; i < msgs.length; i++) {
      var m = msgs[i];
      var dateLabel = getDateSeparator(m.time);
      if (dateLabel !== lastDate) {
        lastDate = dateLabel;
        html += '<div class="flex items-center justify-center" style="margin:var(--space-4) 0;position:relative">';
        html += '<div style="position:absolute;left:0;right:0;top:50%;height:1px;background:rgba(255,255,255,0.06)"></div>';
        html += '<span style="background:var(--bg-secondary);padding:0 var(--space-3);position:relative;z-index:1;font-size:var(--text-xs);color:var(--text-tertiary)">' + dateLabel + '</span>';
        html += '</div>';
      }
      html += renderMessage(m, conv, convIdx);
    }

    html += '<div id="msg-typing-indicator" style="display:none;margin:var(--space-2) 0">';
    html += '<div class="flex items-center gap-2">';
    html += '<div class="avatar avatar-sm" style="background:' + avatarColors[convIdx % avatarColors.length] + ';width:24px;height:24px;font-size:8px">' + getInitials(conv.name) + '</div>';
    html += '<div class="text-xs" style="color:var(--text-tertiary);font-style:italic">' + sanitize(conv.name) + ' is typing<span class="typing-dots">...</span></div>';
    html += '</div>';
    html += '</div>';

    html += '</div>';

    html += '<div style="padding:var(--space-3) var(--space-4);border-top:1px solid rgba(255,255,255,0.08);flex-shrink:0">';
    html += '<div class="flex gap-2 items-end">';
    html += '<button class="btn btn-ghost btn-icon-sm" id="msg-emoji-btn" style="font-size:1.25rem;flex-shrink:0;position:relative">😊</button>';
    html += '<button class="btn btn-ghost btn-icon-sm" id="msg-attach-btn" style="font-size:1.25rem;flex-shrink:0">📎</button>';
    html += '<div style="flex:1;position:relative">';
    html += '<textarea id="msg-input" class="input-field" placeholder="Type a message..." style="width:100%;resize:none;min-height:40px;max-height:120px;padding:0.5rem 0.75rem;border-radius:var(--radius-lg);font-size:var(--text-sm);line-height:1.4" rows="1"></textarea>';
    html += '</div>';
    html += '<button class="btn btn-primary" id="msg-send-btn" style="border-radius:50%;width:40px;height:40px;padding:0;display:flex;align-items:center;justify-content:center;flex-shrink:0;font-size:1.1rem">➤</button>';
    html += '</div>';
    html += '<div id="msg-emoji-picker" class="glass-card" style="display:none;position:absolute;bottom:60px;left:var(--space-4);padding:var(--space-3);z-index:50;max-width:320px;max-height:200px;overflow-y:auto;border-radius:var(--radius-lg)">';
    for (var ei = 0; ei < emojiList.length; ei++) {
      html += '<span class="msg-emoji-item" style="cursor:pointer;font-size:1.25rem;padding:2px 4px;display:inline-block;transition:transform 0.1s" data-emoji="' + emojiList[ei] + '">' + emojiList[ei] + '</span>';
      if ((ei + 1) % 8 === 0) html += '<br>';
    }
    html += '</div>';
    html += '</div>';

    html += '</div>';
    return html;
  }

  function renderMessage(m, conv, convIdx) {
    var html = '';
    var timeStr = formatChatTime(m.time);
    if (m.isMine) {
      html += '<div style="display:flex;justify-content:flex-end;margin-bottom:var(--space-2);padding-left:var(--space-8)">';
      html += '<div style="max-width:75%">';
      html += '<div style="background:linear-gradient(135deg,#2563eb,#1d4ed8);padding:var(--space-2) var(--space-3);border-radius:18px 18px 4px 18px;color:#fff;font-size:var(--text-sm);line-height:1.45;word-wrap:break-word">';
      html += sanitize(m.text);
      html += '</div>';
      html += '<div class="flex items-center gap-1" style="margin-top:2px;padding:0 var(--space-1);justify-content:flex-end">';
      html += '<span class="text-xs" style="color:var(--text-tertiary);font-size:10px">' + timeStr + '</span>';
      var statusIcon = m.status === 'read' ? '✓✓' : (m.status === 'delivered' ? '✓✓' : '✓');
      var statusColor = m.status === 'read' ? '#60a5fa' : 'var(--text-tertiary)';
      html += '<span class="text-xs" style="color:' + statusColor + ';font-size:10px">' + statusIcon + '</span>';
      html += '</div>';
      html += '</div>';
      html += '</div>';
    } else {
      html += '<div style="display:flex;justify-content:flex-start;margin-bottom:var(--space-2);padding-right:var(--space-8)">';
      html += '<div class="avatar avatar-sm" style="background:' + avatarColors[convIdx % avatarColors.length] + ';width:28px;height:28px;font-size:10px;margin-right:var(--space-2);flex-shrink:0;align-self:flex-end">' + getInitials(conv.name) + '</div>';
      html += '<div style="max-width:75%">';
      html += '<div style="background:var(--bg-glass);padding:var(--space-2) var(--space-3);border-radius:18px 18px 18px 4px;color:var(--text-primary);font-size:var(--text-sm);line-height:1.45;word-wrap:break-word">';
      html += sanitize(m.text);
      html += '</div>';
      html += '<div class="flex items-center gap-1" style="margin-top:2px;padding:0 var(--space-1);justify-content:flex-start">';
      html += '<span class="text-xs" style="color:var(--text-tertiary);font-size:10px">' + timeStr + '</span>';
      html += '</div>';
      html += '</div>';
      html += '</div>';
    }
    return html;
  }

  function renderSkeleton() {
    var html = '';
    html += '<div class="page-container" style="height:calc(100vh - var(--header-height) - var(--space-8));display:flex;flex-direction:column;padding:0;overflow:hidden">';
    html += '<div class="flex flex-1" style="min-height:0;overflow:hidden">';
    html += '<div class="glass-card" style="width:320px;flex-shrink:0;display:flex;flex-direction:column;overflow:hidden;border-radius:var(--radius-lg) 0 0 var(--radius-lg);border-right:none">';
    html += '<div style="padding:var(--space-3) var(--space-4);border-bottom:1px solid rgba(255,255,255,0.08)"><div class="skeleton" style="height:36px;border-radius:var(--radius-full)"></div></div>';
    html += '<div class="flex-1" style="overflow:hidden;padding:var(--space-2)">';
    for (var i = 0; i < 8; i++) {
      html += '<div class="flex gap-3" style="padding:var(--space-3) var(--space-2)">';
      html += '<div class="skeleton" style="width:42px;height:42px;border-radius:50%;flex-shrink:0"></div>';
      html += '<div class="flex-1"><div class="skeleton skeleton-text" style="width:60%"></div><div class="skeleton skeleton-text" style="width:80%;height:12px"></div></div>';
      html += '</div>';
    }
    html += '</div>';
    html += '</div>';
    html += '<div class="glass-card flex-1" style="border-radius:0 var(--radius-lg) var(--radius-lg) 0;display:flex;flex-direction:column;align-items:center;justify-content:center">';
    html += '<div class="skeleton" style="width:64px;height:64px;border-radius:50%;margin-bottom:var(--space-4)"></div>';
    html += '<div class="skeleton skeleton-text" style="width:160px"></div>';
    html += '<div class="skeleton skeleton-text" style="width:240px;height:12px"></div>';
    html += '</div>';
    html += '</div>';
    html += '</div>';
    return html;
  }

  function sendMessage() {
    var input = document.getElementById('msg-input');
    if (!input) return;
    var text = input.value.trim();
    if (!text) return;
    var conversations = getConversations();
    var chatMessages = getChatMessages();
    var conv = null;
    for (var i = 0; i < conversations.length; i++) {
      if (conversations[i].id === activeChatId) { conv = conversations[i]; break; }
    }
    if (!conv) return;
    var msgs = chatMessages[activeChatId] || [];
    msgs.push({
      id: 'msg_' + generateId(),
      text: text,
      sender: 'me',
      time: new Date().toISOString(),
      status: 'sent',
      isMine: true
    });
    chatMessages[activeChatId] = msgs;
    conv.lastMsg = text;
    conv.time = new Date().toISOString();
    conv.unread = 0;
    setConversations(conversations);
    setChatMessages(chatMessages);
    input.value = '';
    autoResizeInput(input);
    render();
    showTypingIndicator();
  }

  function simulateReply() {
    var conversations = getConversations();
    var chatMessages = getChatMessages();
    var conv = null;
    for (var i = 0; i < conversations.length; i++) {
      if (conversations[i].id === activeChatId) { conv = conversations[i]; break; }
    }
    if (!conv) return;
    var msgs = chatMessages[activeChatId] || [];
    var replyTexts = [
      'That\'s interesting! Tell me more.',
      'I agree with you on that.',
      'Let me check and get back to you.',
      'Sure, sounds good!',
      'Can you elaborate on that?',
      'Got it, thanks!',
      'I was thinking the same thing.',
      'Will do! Talk to you later.'
    ];
    var reply = replyTexts[Math.floor(Math.random() * replyTexts.length)];
    msgs.push({
      id: 'msg_' + generateId(),
      text: reply,
      sender: conv.name,
      time: new Date().toISOString(),
      status: 'read',
      isMine: false
    });
    chatMessages[activeChatId] = msgs;
    conv.lastMsg = reply;
    conv.time = new Date().toISOString();
    setConversations(conversations);
    setChatMessages(chatMessages);
    render();
  }

  function showTypingIndicator() {
    var indicator = document.getElementById('msg-typing-indicator');
    if (!indicator) return;
    indicator.style.display = 'block';
    var container = document.getElementById('msg-messages-container');
    if (container) container.scrollTop = container.scrollHeight;
    if (typingTimer) clearTimeout(typingTimer);
    typingTimer = setTimeout(function() {
      var ind = document.getElementById('msg-typing-indicator');
      if (ind) ind.style.display = 'none';
      simulateReply();
    }, 1500 + Math.random() * 1000 | 0);
  }

  function scrollToBottom() {
    var container = document.getElementById('msg-messages-container');
    if (container) container.scrollTop = container.scrollHeight;
  }

  function autoResizeInput(el) {
    if (!el) return;
    el.style.height = 'auto';
    el.style.height = Math.min(el.scrollHeight, 120) + 'px';
  }

  function isMobile() {
    return window.innerWidth < 768;
  }

  function bindEvents() {
    var searchInput = document.getElementById('msg-search-input');
    if (searchInput) {
      searchInput.addEventListener('input', function() {
        searchQuery = this.value;
        render();
      });
    }

    var convItems = document.querySelectorAll('.msg-conv-item');
    for (var i = 0; i < convItems.length; i++) {
      (function(item) {
        item.addEventListener('click', function(e) {
          if (e.target.closest('.msg-pin-btn') || e.target.closest('.msg-delete-btn')) return;
          var id = this.dataset.id;
          if (!id) return;
          var conversations = getConversations();
          for (var j = 0; j < conversations.length; j++) {
            if (conversations[j].id === id) { conversations[j].unread = 0; break; }
          }
          setConversations(conversations);
          activeChatId = id;
          if (isMobile()) mobilePanel = 'chat';
          render();
        });
      })(convItems[i]);
    }

    var pinBtns = document.querySelectorAll('.msg-pin-btn');
    for (var i = 0; i < pinBtns.length; i++) {
      (function(btn) {
        btn.addEventListener('click', function(e) {
          e.stopPropagation();
          var id = this.dataset.id;
          if (!id) return;
          var pinned = getPinnedChats();
          var idx = pinned.indexOf(id);
          if (idx === -1) {
            pinned.push(id);
          } else {
            pinned.splice(idx, 1);
          }
          setPinnedChats(pinned);
          render();
        });
      })(pinBtns[i]);
    }

    var deleteBtns = document.querySelectorAll('.msg-delete-btn');
    for (var i = 0; i < deleteBtns.length; i++) {
      (function(btn) {
        btn.addEventListener('click', function(e) {
          e.stopPropagation();
          var id = this.dataset.id;
          if (!id) return;
          if (!confirm('Delete this conversation?')) return;
          var conversations = getConversations();
          var chatMessages = getChatMessages();
          conversations = conversations.filter(function(c) { return c.id !== id; });
          delete chatMessages[id];
          var pinned = getPinnedChats();
          pinned = pinned.filter(function(p) { return p !== id; });
          setConversations(conversations);
          setChatMessages(chatMessages);
          setPinnedChats(pinned);
          if (activeChatId === id) activeChatId = null;
          render();
        });
      })(deleteBtns[i]);
    }

    var sendBtn = document.getElementById('msg-send-btn');
    var msgInput = document.getElementById('msg-input');
    if (sendBtn && msgInput) {
      sendBtn.addEventListener('click', sendMessage);
      msgInput.addEventListener('keydown', function(e) {
        if (e.key === 'Enter' && !e.shiftKey) {
          e.preventDefault();
          sendMessage();
        }
      });
      msgInput.addEventListener('input', function() { autoResizeInput(this); });
    }

    var emojiBtn = document.getElementById('msg-emoji-btn');
    var emojiPicker = document.getElementById('msg-emoji-picker');
    if (emojiBtn && emojiPicker) {
      emojiBtn.addEventListener('click', function(e) {
        e.stopPropagation();
        emojiOpen = !emojiOpen;
        emojiPicker.style.display = emojiOpen ? 'block' : 'none';
      });
      var emojiItems = document.querySelectorAll('.msg-emoji-item');
      for (var i = 0; i < emojiItems.length; i++) {
        (function(item) {
          item.addEventListener('click', function() {
            var emoji = this.dataset.emoji;
            var input = document.getElementById('msg-input');
            if (input && emoji) {
              var cursor = input.selectionStart;
              var val = input.value;
              input.value = val.slice(0, cursor) + emoji + val.slice(cursor);
              input.focus();
              var newPos = cursor + emoji.length;
              input.setSelectionRange(newPos, newPos);
              autoResizeInput(input);
            }
            emojiOpen = false;
            emojiPicker.style.display = 'none';
          });
        })(emojiItems[i]);
      }
    }

    var attachBtn = document.getElementById('msg-attach-btn');
    if (attachBtn) {
      attachBtn.addEventListener('click', function() {
        var conversations = getConversations();
        var chatMessages = getChatMessages();
        var conv = null;
        for (var i = 0; i < conversations.length; i++) {
          if (conversations[i].id === activeChatId) { conv = conversations[i]; break; }
        }
        if (!conv) return;
        var msgs = chatMessages[activeChatId] || [];
        msgs.push({
          id: 'msg_' + generateId(),
          text: '📎 File shared',
          sender: 'me',
          time: new Date().toISOString(),
          status: 'sent',
          isMine: true
        });
        chatMessages[activeChatId] = msgs;
        conv.lastMsg = '📎 File shared';
        conv.time = new Date().toISOString();
        setConversations(conversations);
        setChatMessages(chatMessages);
        render();
        showTypingIndicator();
      });
    }

    var newChatBtn = document.getElementById('msg-new-chat-btn');
    if (newChatBtn) {
      newChatBtn.addEventListener('click', showNewChatModal);
    }

    var backBtn = document.getElementById('msg-back-btn');
    if (backBtn) {
      backBtn.addEventListener('click', function() {
        mobilePanel = 'list';
        render();
      });
    }

    var toggleSearch = document.getElementById('msg-toggle-search');
    var searchInConv = document.getElementById('msg-search-in-conv');
    if (toggleSearch && searchInConv) {
      toggleSearch.addEventListener('click', function() {
        var isVisible = searchInConv.style.display !== 'none';
        searchInConv.style.display = isVisible ? 'none' : 'block';
        if (!isVisible) searchInConv.focus();
        else searchInConv.value = '';
      });
    }

    var optionsBtn = document.getElementById('msg-options-btn');
    if (optionsBtn) {
      optionsBtn.addEventListener('click', function(e) {
        showContextMenu(e, activeChatId);
      });
    }

    document.addEventListener('click', function() {
      var picker = document.getElementById('msg-emoji-picker');
      if (picker) { picker.style.display = 'none'; emojiOpen = false; }
    });
  }

  function showContextMenu(e, convId) {
    var existing = document.getElementById('msg-context-menu');
    if (existing) existing.remove();

    var menu = document.createElement('div');
    menu.id = 'msg-context-menu';
    menu.style.cssText = 'position:fixed;z-index:1000;background:var(--bg-secondary);border:1px solid var(--border-color);border-radius:var(--radius-md);box-shadow:var(--shadow-lg);padding:var(--space-1);min-width:160px;top:' + e.clientY + 'px;left:' + (e.clientX - 160) + 'px';

    var pinned = getPinnedChats();
    var isPinned = pinned.indexOf(convId) !== -1;

    var items = [
      { label: isPinned ? '📌 Unpin' : '📌 Pin', action: 'pin' },
      { label: '✅ Mark as read', action: 'markread' },
      { label: '🗑️ Delete conversation', action: 'delete' }
    ];

    for (var i = 0; i < items.length; i++) {
      (function(item) {
        var btn = document.createElement('button');
        btn.textContent = item.label;
        btn.setAttribute('data-action', 'msg:contextAction');
        btn.setAttribute('data-action-type', item.action);
        btn.setAttribute('data-conv-id', convId);
        btn.style.cssText = 'display:block;width:100%;padding:var(--space-2) var(--space-3);text-align:left;background:none;border:none;color:var(--text-primary);font-size:var(--text-sm);cursor:pointer;border-radius:var(--radius-sm)';
        btn.onmouseenter = function() { this.style.background = 'var(--bg-glass)'; };
        btn.onmouseleave = function() { this.style.background = 'none'; };
        menu.appendChild(btn);
      })(items[i]);
    }

    document.body.appendChild(menu);

    function closeMenu(ev) {
      if (!menu.contains(ev.target)) { menu.remove(); document.removeEventListener('click', closeMenu); }
    }
    setTimeout(function() { document.addEventListener('click', closeMenu); }, 10);
  }

  function togglePin(convId) {
    var pinned = getPinnedChats();
    var idx = pinned.indexOf(convId);
    if (idx === -1) pinned.push(convId);
    else pinned.splice(idx, 1);
    setPinnedChats(pinned);
    render();
  }

  function markAsRead(convId) {
    var conversations = getConversations();
    for (var i = 0; i < conversations.length; i++) {
      if (conversations[i].id === convId) { conversations[i].unread = 0; break; }
    }
    setConversations(conversations);
    render();
  }

  function deleteConversation(convId) {
    if (!confirm('Delete this conversation?')) return;
    var conversations = getConversations();
    var chatMessages = getChatMessages();
    conversations = conversations.filter(function(c) { return c.id !== convId; });
    delete chatMessages[convId];
    var pinned = getPinnedChats();
    pinned = pinned.filter(function(p) { return p !== convId; });
    setConversations(conversations);
    setChatMessages(chatMessages);
    setPinnedChats(pinned);
    if (activeChatId === convId) activeChatId = null;
    render();
  }

  function showNewChatModal() {
    var overlay = document.createElement('div');
    overlay.className = 'modal-overlay';
    overlay.style.animation = 'fadeIn 0.2s ease';

    var allPeople = [
      'Aarav Sharma', 'Bhavna Iyer', 'Chirag Mehta', 'Deepika Rajan',
      'Esha Kaur', 'Farhan Qureshi', 'Gauri Deshmukh', 'Harsh Tiwari',
      'Ishaan Kapoor', 'Jhanvi Patel', 'Karan Singh', 'Lakshmi Nair',
      'Manav Joshi', 'Nandini Reddy', 'Omkar Bhatt', 'Pooja Saxena',
      'Ravi Kumar', 'Shreya Menon', 'Tanya Agarwal', 'Uday Chopra'
    ];

    var modal = document.createElement('div');
    modal.className = 'modal';
    modal.style.maxWidth = '480px';

    modal.innerHTML = '\
<div class="modal-header">\
  <div class="font-semibold text-lg">New Conversation</div>\
  <button class="btn btn-ghost btn-icon-sm" id="newchat-close-btn">✕</button>\
</div>\
<div class="modal-body">\
  <div class="input-with-icon" style="margin-bottom:var(--space-4)">\
    <span class="input-icon">🔍</span>\
    <input type="text" class="input-field" id="newchat-search" placeholder="Search people..." style="padding-left:2.5rem">\
  </div>\
  <div id="newchat-results" style="max-height:300px;overflow-y:auto"></div>\
</div>';

    overlay.appendChild(modal);
    document.body.appendChild(overlay);

    function renderPeople(query) {
      var results = document.getElementById('newchat-results');
      if (!results) return;
      var q = (query || '').toLowerCase();
      var filtered = allPeople;
      if (q) filtered = allPeople.filter(function(p) { return p.toLowerCase().indexOf(q) !== -1; });
      var html = '';
      for (var i = 0; i < filtered.length; i++) {
        var name = filtered[i];
        var convExists = false;
        var conversations = getConversations();
        for (var j = 0; j < conversations.length; j++) {
          if (conversations[j].name.toLowerCase() === name.toLowerCase()) { convExists = true; break; }
        }
        html += '<div class="newchat-person" data-name="' + sanitize(name) + '" style="display:flex;align-items:center;gap:var(--space-3);padding:var(--space-3);cursor:pointer;border-radius:var(--radius-md);transition:background 0.15s">';
        html += '<div class="avatar avatar-sm" style="background:' + avatarColors[i % avatarColors.length] + '">' + getInitials(name) + '</div>';
        html += '<div class="flex-1"><div class="text-sm font-medium">' + sanitize(name) + '</div></div>';
        if (convExists) {
          html += '<span class="text-xs" style="color:var(--text-tertiary)">Existing</span>';
        }
        html += '</div>';
      }
      results.innerHTML = html;

      var persons = results.querySelectorAll('.newchat-person');
      for (var i = 0; i < persons.length; i++) {
        (function(el) {
          el.addEventListener('click', function() {
            var name = this.dataset.name;
            if (!name) return;
            var convs = getConversations();
            var existing = null;
            for (var j = 0; j < convs.length; j++) {
              if (convs[j].name.toLowerCase() === name.toLowerCase()) { existing = convs[j]; break; }
            }
            if (existing) {
              activeChatId = existing.id;
              if (isMobile()) mobilePanel = 'chat';
            } else {
              var newId = 'conv_' + generateId();
              convs.push({
                id: newId,
                name: name,
                lastMsg: '',
                time: new Date().toISOString(),
                unread: 0,
                online: true
              });
              var chatMessages = getChatMessages();
              chatMessages[newId] = [];
              setConversations(convs);
              setChatMessages(chatMessages);
              activeChatId = newId;
              if (isMobile()) mobilePanel = 'chat';
            }
            overlay.remove();
            render();
          });
          el.addEventListener('mouseenter', function() { this.style.background = 'var(--bg-glass)'; });
          el.addEventListener('mouseleave', function() { this.style.background = 'transparent'; });
        })(persons[i]);
      }
    }

    renderPeople('');

    var searchInput = document.getElementById('newchat-search');
    if (searchInput) {
      searchInput.addEventListener('input', function() { renderPeople(this.value); });
      setTimeout(function() { searchInput.focus(); }, 100);
    }

    var closeBtn = document.getElementById('newchat-close-btn');
    if (closeBtn) closeBtn.addEventListener('click', function() { overlay.remove(); });

    overlay.addEventListener('click', function(e) {
      if (e.target === overlay) overlay.remove();
    });
  }

  window.renderPage.messages.sendMessage = sendMessage;
  window.renderPage.messages.filterMessages = function() {};

  initData();
  var conversations = getConversations();
  if (!conversations || conversations.length === 0) {
    container.innerHTML = renderSkeleton();
    setTimeout(function() {
      initData();
      render();
    }, 600);
  } else {
    render();
  }
};
