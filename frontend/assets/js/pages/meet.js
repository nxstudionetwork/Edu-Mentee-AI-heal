window.renderPage.meet = function(params) {
  var container = document.getElementById('main-content');
  if (!container) return;
  var md = window.mockData;
  var utils = window.Utils;
  var store = window.Store;

  var currentTab = 'upcoming';

  var meetings = [
    { id: 'm1', title: 'Doubt Session: Quadratic Equations', host: md.users[5], date: '2026-07-02', time: '4:00 PM', duration: 45, attendees: md.users.slice(0, 4), description: 'Live doubt solving session for Quadratic Equations chapter. Bring your questions!', status: 'upcoming', recording: null },
    { id: 'm2', title: 'Weekly Study Group: Organic Chem', host: md.users[0], date: '2026-07-03', time: '5:30 PM', duration: 60, attendees: md.users.slice(1, 5), description: 'Regular weekly study group meeting for Organic Chemistry.', status: 'upcoming', recording: null },
    { id: 'm3', title: 'Career Counseling Session', host: md.users[5], date: '2026-07-05', time: '11:00 AM', duration: 90, attendees: md.users.slice(0, 6), description: 'One-on-one career guidance and stream selection advice.', status: 'upcoming', recording: null },
    { id: 'm4', title: 'Math Revision: Calculus Basics', host: md.users[2], date: '2026-06-28', time: '3:00 PM', duration: 50, attendees: md.users.slice(0, 3), description: 'Revision session covering limits, derivatives and integrals.', status: 'past', recording: null },
    { id: 'm5', title: 'Physics Numerical Practice', host: md.users[5], date: '2026-06-27', time: '2:00 PM', duration: 60, attendees: md.users.slice(1, 5), description: 'Practice session for Physics numerical problems.', status: 'past', recording: null },
    { id: 'm6', title: 'English Literature Discussion', host: md.users[3], date: '2026-06-25', time: '4:30 PM', duration: 45, attendees: md.users.slice(0, 4), description: 'Group discussion on Shakespearean sonnets.', status: 'past', recording: 'https://example.com/recording/m6' },
    { id: 'm7', title: 'JEE Main Strategy Session', host: md.users[5], date: '2026-06-20', time: '6:00 PM', duration: 90, attendees: md.users.slice(0, 6), description: 'Comprehensive strategy for JEE Main 2027 preparation.', status: 'recorded', recording: 'https://example.com/recording/m7' },
    { id: 'm8', title: 'Biology: Genetics & Evolution', host: md.users[5], date: '2026-06-18', time: '5:00 PM', duration: 60, attendees: md.users.slice(1, 4), description: 'Detailed explanation of Genetics and Evolution chapters.', status: 'recorded', recording: 'https://example.com/recording/m8' }
  ];

  var calendarLinks = ['https://calendar.google.com', 'https://calendar.google.com'];

  var callState = null;

  function render() {
    var html = '<div class="page-container animate-fadeInUp">';

    html += '<div class="page-header">';
    html += '<div><h1 class="page-title">Meetings</h1><p class="page-subtitle">Schedule and join live study sessions</p></div>';
    html += '<button class="btn btn-primary" id="btn-schedule-meeting">+ Schedule New Meeting</button>';
    html += '</div>';

    html += '<div class="tabs" id="meeting-tabs">';
    html += '<div class="tab active" data-tab="upcoming">📅 Upcoming</div>';
    html += '<div class="tab" data-tab="past">⏰ Past</div>';
    html += '<div class="tab" data-tab="recorded">🎥 Recorded</div>';
    html += '</div>';

    html += '<div class="grid grid-cols-auto gap-5" id="meetings-list">';
    html += renderMeetingList();
    html += '</div>';

    html += '</div>';
    container.innerHTML = html;
    bindEvents();
  }

  function renderMeetingList() {
    var filtered = meetings.filter(function(m) { return m.status === currentTab; });
    if (filtered.length === 0) {
      return '<div class="empty-state" style="grid-column:1/-1"><div class="empty-state-icon">📅</div><div class="empty-state-title">No ' + currentTab + ' meetings</div><div class="empty-state-text">' + (currentTab === 'upcoming' ? 'Schedule a new meeting to get started!' : 'No meetings found in this category.') + '</div></div>';
    }
    var html = '';
    for (var i = 0; i < filtered.length; i++) {
      var m = filtered[i];
      var hostName = m.host ? m.host.name : 'Unknown';
      html += '<div class="glass-card meeting-card" data-id="' + m.id + '" style="padding:var(--space-5)">';
      html += '<div class="flex items-start gap-4 mb-4">';
      html += '<div class="avatar avatar-md" style="background:' + utils.getGradient(i) + '">' + (m.host ? utils.getInitials(hostName) : '?') + '</div>';
      html += '<div class="flex-1 min-w-0">';
      html += '<h3 class="font-semibold text-lg mb-1">' + m.title + '</h3>';
      html += '<div class="text-sm text-secondary">👤 Host: ' + hostName + '</div>';
      html += '<div class="flex gap-4 mt-2 text-sm text-tertiary">';
      html += '<span>📅 ' + utils.formatDate(m.date, 'dd mmm yyyy') + '</span>';
      html += '<span>⏰ ' + m.time + '</span>';
      html += '<span>⏱ ' + m.duration + ' min</span>';
      html += '</div></div></div>';

      html += '<div class="avatar-group mb-3">';
      for (var a = 0; a < Math.min(4, m.attendees.length); a++) {
        html += '<div class="avatar avatar-sm" style="background:' + utils.getGradient(a) + '" title="' + m.attendees[a].name + '">' + utils.getInitials(m.attendees[a].name) + '</div>';
      }
      if (m.attendees.length > 4) html += '<div class="avatar avatar-sm" style="background:var(--bg-glass-strong)">+' + (m.attendees.length - 4) + '</div>';
      html += '</div>';

      if (m.description) {
        html += '<div class="text-sm text-secondary mb-4">' + m.description + '</div>';
      }

      html += '<div class="flex gap-3 flex-wrap">';
      if (currentTab === 'upcoming') {
        html += '<button class="btn btn-primary btn-sm join-meeting-btn" data-id="' + m.id + '">🔗 Join Now</button>';
        html += '<button class="btn btn-ghost btn-sm calendar-link" data-link="' + (calendarLinks[i % calendarLinks.length]) + '">📅 Add to Calendar</button>';
      } else if (currentTab === 'past') {
        html += '<button class="btn btn-secondary btn-sm" disabled>Meeting Ended</button>';
      } else if (currentTab === 'recorded') {
        if (m.recording) {
          html += '<button class="btn btn-cyan btn-sm watch-recording-btn" data-link="' + m.recording + '">🎥 Watch Recording</button>';
        } else {
          html += '<button class="btn btn-secondary btn-sm" disabled>No Recording</button>';
        }
      }
      html += '</div></div>';
    }
    return html;
  }

  function renderVideoCall(meetingId) {
    var meeting = null;
    for (var i = 0; i < meetings.length; i++) {
      if (meetings[i].id === meetingId) { meeting = meetings[i]; break; }
    }
    if (!meeting) return;

    callState = { meetingId: meetingId, micOn: true, camOn: true, screenSharing: false, showChat: false, showParticipants: false, elapsed: 0, chatMessages: [{ author: 'System', text: 'Call started', time: '0:00' }] };

    var participants = [store.get('user') || { name: 'You' }].concat(meeting.attendees || []).slice(0, 6);
    while (participants.length < 4) {
      participants.push({ name: 'Waiting...' });
    }

    var overlay = document.createElement('div');
    overlay.className = 'modal-overlay';
    overlay.id = 'video-call-overlay';
    overlay.style.zIndex = '600';

    var html = '<div class="video-call-container" style="background:#0a0e1a;border-radius:var(--radius-xl);width:95%;max-width:1100px;max-height:90vh;overflow:hidden;display:flex;flex-direction:column;border:1px solid var(--border-color);box-shadow:var(--shadow-xl);animation:scaleIn 0.3s ease">';

    html += '<div class="flex items-center justify-between p-4" style="background:rgba(0,0,0,0.4);border-bottom:1px solid rgba(255,255,255,0.08)">';
    html += '<div class="flex items-center gap-3"><span class="text-sm font-semibold">' + meeting.title + '</span><span class="badge badge-red animate-pulse">● Live</span></div>';
    html += '<div class="flex items-center gap-2"><span class="text-sm text-secondary" id="call-timer">00:00</span><button class="btn btn-ghost btn-icon-sm" id="close-video-call" style="color:var(--text-tertiary)">✕</button></div>';
    html += '</div>';

    html += '<div class="flex flex-1" style="min-height:0">';

    html += '<div class="flex-1 p-4" style="overflow-y:auto">';
    html += '<div class="grid" style="grid-template-columns:repeat(auto-fill, minmax(200px, 1fr));gap:var(--space-4)">';
    for (var i = 0; i < participants.length; i++) {
      var p = participants[i];
      var isYou = i === 0;
      html += '<div class="video-participant" style="aspect-ratio:16/9;background:linear-gradient(135deg,#1a1a2e,#16213e);border-radius:var(--radius-lg);display:flex;flex-direction:column;align-items:center;justify-content:center;position:relative;border:1px solid rgba(255,255,255,0.06)">';
      html += '<div class="avatar avatar-lg" style="background:' + utils.getGradient(i) + ';width:64px;height:64px;font-size:var(--text-2xl)">' + utils.getInitials(p.name) + '</div>';
      html += '<div class="text-sm font-medium mt-3">' + p.name + '</div>';
      if (isYou) html += '<div class="text-xs text-tertiary">(You)</div>';
      if (i === 0 && !callState.camOn) html += '<div class="absolute bottom-2 right-2" style="background:rgba(0,0,0,0.6);border-radius:50%;width:28px;height:28px;display:flex;align-items:center;justify-content:center;font-size:12px">📷</div>';
      html += '</div>';
    }
    html += '</div></div>';

    html += '<div id="call-sidebar" style="display:' + (callState.showChat || callState.showParticipants ? 'flex' : 'none') + ';flex-direction:column;width:320px;border-left:1px solid rgba(255,255,255,0.08);flex-shrink:0;background:rgba(0,0,0,0.2)">';

    html += '<div id="call-chat-panel" style="display:' + (callState.showChat ? 'flex' : 'none') + ';flex-direction:column;flex:1;min-height:0">';
    html += '<div class="p-4 font-semibold text-sm border-b" style="border-color:rgba(255,255,255,0.08)">💬 Chat</div>';
    html += '<div class="flex-1 p-4 overflow-auto flex flex-col gap-3" id="chat-messages">';
    for (var c = 0; c < callState.chatMessages.length; c++) {
      var msg = callState.chatMessages[c];
      html += '<div class="text-sm"><span class="font-medium text-accent-blue">' + msg.author + ':</span> <span class="text-secondary">' + msg.text + '</span><span class="text-xs text-tertiary ml-2">' + msg.time + '</span></div>';
    }
    html += '</div>';
    html += '<div class="flex gap-2 p-4 border-t" style="border-color:rgba(255,255,255,0.08)">';
    html += '<input type="text" class="input-field" id="chat-input" placeholder="Type a message..." style="flex:1;background:rgba(255,255,255,0.06)">';
    html += '<button class="btn btn-primary btn-sm" id="chat-send">Send</button></div></div>';

    html += '<div id="call-participants-panel" style="display:' + (callState.showParticipants ? 'flex' : 'none') + ';flex-direction:column;flex:1">';
    html += '<div class="p-4 font-semibold text-sm border-b" style="border-color:rgba(255,255,255,0.08)">👥 Participants (' + participants.length + ')</div>';
    html += '<div class="flex-1 p-4 overflow-auto flex flex-col gap-2">';
    for (var i = 0; i < participants.length; i++) {
      html += '<div class="flex items-center gap-3 p-2 rounded-md hover:bg-white/5"><div class="avatar avatar-sm" style="background:' + utils.getGradient(i) + '">' + utils.getInitials(participants[i].name) + '</div><span class="text-sm">' + participants[i].name + (i === 0 ? ' (You)' : '') + '</span></div>';
    }
    html += '</div></div></div>';

    html += '</div>';

    html += '<div class="flex items-center justify-center gap-4 p-4" style="background:rgba(0,0,0,0.4);border-top:1px solid rgba(255,255,255,0.08)">';
    html += '<button class="call-control-btn" id="btn-mic" style="width:48px;height:48px;border-radius:50%;background:rgba(255,255,255,0.1);display:flex;align-items:center;justify-content:center;font-size:1.25rem;transition:all 0.2s;border:1px solid rgba(255,255,255,0.1)" title="Mic">🎤</button>';
    html += '<button class="call-control-btn" id="btn-cam" style="width:48px;height:48px;border-radius:50%;background:rgba(255,255,255,0.1);display:flex;align-items:center;justify-content:center;font-size:1.25rem;transition:all 0.2s;border:1px solid rgba(255,255,255,0.1)" title="Camera">📷</button>';
    html += '<button class="call-control-btn" id="btn-screen" style="width:48px;height:48px;border-radius:50%;background:rgba(255,255,255,0.1);display:flex;align-items:center;justify-content:center;font-size:1.25rem;transition:all 0.2s;border:1px solid rgba(255,255,255,0.1)" title="Share Screen">🖥️</button>';
    html += '<button class="call-control-btn" id="btn-chat-toggle" style="width:48px;height:48px;border-radius:50%;background:rgba(255,255,255,0.1);display:flex;align-items:center;justify-content:center;font-size:1.25rem;transition:all 0.2s;border:1px solid rgba(255,255,255,0.1)" title="Chat">💬</button>';
    html += '<button class="call-control-btn" id="btn-participants-toggle" style="width:48px;height:48px;border-radius:50%;background:rgba(255,255,255,0.1);display:flex;align-items:center;justify-content:center;font-size:1.25rem;transition:all 0.2s;border:1px solid rgba(255,255,255,0.1)" title="Participants">👥</button>';
    html += '<button class="call-control-btn" id="btn-end-call" style="width:56px;height:56px;border-radius:50%;background:var(--accent-red);display:flex;align-items:center;justify-content:center;font-size:1.25rem;transition:all 0.2s;box-shadow:0 0 20px rgba(239,68,68,0.4)" title="End Call">📞</button>';
    html += '</div>';

    html += '</div>';
    overlay.innerHTML = html;
    document.body.appendChild(overlay);
    bindCallEvents(meeting);
    startCallTimer();
  }

  function startCallTimer() {
    if (callState.timerInterval) clearInterval(callState.timerInterval);
    callState.elapsed = 0;
    var timerEl = document.getElementById('call-timer');
    callState.timerInterval = setInterval(function() {
      callState.elapsed++;
      var mins = Math.floor(callState.elapsed / 60);
      var secs = callState.elapsed % 60;
      if (timerEl) timerEl.textContent = (mins < 10 ? '0' : '') + mins + ':' + (secs < 10 ? '0' : '') + secs;
    }, 1000);
  }

  function bindCallEvents(meeting) {
    var closeBtn = document.getElementById('close-video-call');
    if (closeBtn) {
      closeBtn.addEventListener('click', function() {
        var overlay = document.getElementById('video-call-overlay');
        if (overlay) overlay.remove();
        if (callState && callState.timerInterval) clearInterval(callState.timerInterval);
        callState = null;
      });
    }

    var endBtn = document.getElementById('btn-end-call');
    if (endBtn) {
      endBtn.addEventListener('click', function() {
        var overlay = document.getElementById('video-call-overlay');
        if (overlay) overlay.remove();
        if (callState && callState.timerInterval) clearInterval(callState.timerInterval);
        callState = null;
      });
    }

    var micBtn = document.getElementById('btn-mic');
    if (micBtn) {
      micBtn.addEventListener('click', function() {
        if (!callState) return;
        callState.micOn = !callState.micOn;
        this.style.background = callState.micOn ? 'rgba(255,255,255,0.1)' : 'var(--accent-red)';
        this.title = callState.micOn ? 'Mic' : 'Mic Off';
      });
    }

    var camBtn = document.getElementById('btn-cam');
    if (camBtn) {
      camBtn.addEventListener('click', function() {
        if (!callState) return;
        callState.camOn = !callState.camOn;
        this.style.background = callState.camOn ? 'rgba(255,255,255,0.1)' : 'var(--accent-red)';
        this.title = callState.camOn ? 'Camera' : 'Camera Off';
      });
    }

    var screenBtn = document.getElementById('btn-screen');
    if (screenBtn) {
      screenBtn.addEventListener('click', function() {
        if (!callState) return;
        callState.screenSharing = !callState.screenSharing;
        this.style.background = callState.screenSharing ? 'var(--accent-green)' : 'rgba(255,255,255,0.1)';
        this.title = callState.screenSharing ? 'Stop Sharing' : 'Share Screen';
      });
    }

    var chatToggle = document.getElementById('btn-chat-toggle');
    if (chatToggle) {
      chatToggle.addEventListener('click', function() {
        if (!callState) return;
        callState.showChat = !callState.showChat;
        if (callState.showChat) callState.showParticipants = false;
        updateCallSidebar();
      });
    }

    var participantsToggle = document.getElementById('btn-participants-toggle');
    if (participantsToggle) {
      participantsToggle.addEventListener('click', function() {
        if (!callState) return;
        callState.showParticipants = !callState.showParticipants;
        if (callState.showParticipants) callState.showChat = false;
        updateCallSidebar();
      });
    }

    var chatSend = document.getElementById('chat-send');
    var chatInput = document.getElementById('chat-input');
    if (chatSend && chatInput) {
      chatSend.addEventListener('click', function() {
        sendChatMessage();
      });
      chatInput.addEventListener('keydown', function(e) {
        if (e.key === 'Enter') { e.preventDefault(); sendChatMessage(); }
      });
    }
  }

  function sendChatMessage() {
    var input = document.getElementById('chat-input');
    if (!input || !input.value.trim()) return;
    var user = store.get('user');
    var msg = { author: user ? user.name : 'You', text: input.value.trim(), time: document.getElementById('call-timer') ? document.getElementById('call-timer').textContent : '0:00' };
    callState.chatMessages.push(msg);
    input.value = '';
    var container = document.getElementById('chat-messages');
    if (container) {
      container.innerHTML += '<div class="text-sm"><span class="font-medium text-accent-blue">' + msg.author + ':</span> <span class="text-secondary">' + msg.text + '</span><span class="text-xs text-tertiary ml-2">' + msg.time + '</span></div>';
      container.scrollTop = container.scrollHeight;
    }
  }

  function updateCallSidebar() {
    var sidebar = document.getElementById('call-sidebar');
    var chatPanel = document.getElementById('call-chat-panel');
    var participantsPanel = document.getElementById('call-participants-panel');
    if (sidebar) sidebar.style.display = (callState.showChat || callState.showParticipants) ? 'flex' : 'none';
    if (chatPanel) chatPanel.style.display = callState.showChat ? 'flex' : 'none';
    if (participantsPanel) participantsPanel.style.display = callState.showParticipants ? 'flex' : 'none';
  }

  function openScheduleModal() {
    var overlay = document.createElement('div');
    overlay.className = 'modal-overlay';
    overlay.id = 'schedule-meeting-overlay';

    overlay.innerHTML = '\
<div class="modal">\
  <div class="modal-header">\
    <h3 class="font-semibold text-lg">Schedule New Meeting</h3>\
    <button class="btn btn-ghost btn-icon-sm" id="close-schedule-modal">✕</button>\
  </div>\
  <div class="modal-body">\
    <div class="flex flex-col gap-4">\
      <div class="input-group"><label class="input-label">Meeting Title</label><input type="text" class="input-field" id="meeting-title-input" placeholder="e.g. Doubt Session: Topic Name"></div>\
      <div class="flex gap-4">\
        <div class="input-group flex-1"><label class="input-label">Date</label><input type="date" class="input-field" id="meeting-date-input" value="' + new Date().toISOString().split('T')[0] + '"></div>\
        <div class="input-group flex-1"><label class="input-label">Time</label><input type="time" class="input-field" id="meeting-time-input" value="16:00"></div>\
      </div>\
      <div class="input-group"><label class="input-label">Description</label><textarea class="input-field" id="meeting-desc-input" placeholder="Meeting description and topics..." style="min-height:80px"></textarea></div>\
      <div class="input-group"><label class="input-label">Invite Participants</label>\
        <div class="flex flex-col gap-2" id="invite-participants-list">';
    for (var i = 0; i < md.users.length; i++) {
      var u = md.users[i];
      overlay.innerHTML += '<label class="checkbox-group"><input type="checkbox" value="' + u.id + '" class="invite-checkbox"> ' + u.name + ' (' + (u.role || 'student') + ')</label>';
    }
    overlay.innerHTML += '\
        </div>\
      </div>\
    </div>\
  </div>\
  <div class="modal-footer">\
    <button class="btn btn-secondary" id="cancel-schedule">Cancel</button>\
    <button class="btn btn-primary" id="confirm-schedule">Schedule Meeting</button>\
  </div>\
</div>';
    document.body.appendChild(overlay);

    document.getElementById('close-schedule-modal').addEventListener('click', function() { overlay.remove(); });
    document.getElementById('cancel-schedule').addEventListener('click', function() { overlay.remove(); });
    overlay.addEventListener('click', function(e) { if (e.target === overlay) overlay.remove(); });

    document.getElementById('confirm-schedule').addEventListener('click', function() {
      var title = document.getElementById('meeting-title-input').value.trim();
      var date = document.getElementById('meeting-date-input').value;
      var time = document.getElementById('meeting-time-input').value;
      var desc = document.getElementById('meeting-desc-input').value.trim();
      if (!title || !date || !time) { alert('Please fill in title, date, and time.'); return; }

      var checkboxes = document.querySelectorAll('.invite-checkbox:checked');
      var invited = [];
      for (var c = 0; c < checkboxes.length; c++) {
        for (var u = 0; u < md.users.length; u++) {
          if (md.users[u].id === checkboxes[c].value) { invited.push(md.users[u]); break; }
        }
      }

      var timeFormatted = new Date('2000-01-01T' + time).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
      var newMeeting = {
        id: 'm_' + Date.now(),
        title: title,
        host: store.get('user') || { name: 'You' },
        date: date,
        time: timeFormatted,
        duration: 45,
        attendees: invited,
        description: desc || 'No description provided.',
        status: 'upcoming',
        recording: null
      };
      meetings.unshift(newMeeting);
      overlay.remove();
      if (currentTab === 'upcoming') {
        var list = document.getElementById('meetings-list');
        if (list) list.innerHTML = renderMeetingList();
        bindEvents();
      }
    });
  }

  function switchTab(tab) {
    currentTab = tab;
    var tabs = document.querySelectorAll('#meeting-tabs .tab');
    for (var i = 0; i < tabs.length; i++) {
      tabs[i].classList.toggle('active', tabs[i].dataset.tab === tab);
    }
    var list = document.getElementById('meetings-list');
    if (list) list.innerHTML = renderMeetingList();
    bindEvents();
  }

  function bindEvents() {
    var tabEls = document.querySelectorAll('#meeting-tabs .tab');
    for (var i = 0; i < tabEls.length; i++) {
      tabEls[i].addEventListener('click', function() { switchTab(this.dataset.tab); });
    }

    var scheduleBtn = document.getElementById('btn-schedule-meeting');
    if (scheduleBtn) {
      scheduleBtn.addEventListener('click', openScheduleModal);
    }

    var joinBtns = document.querySelectorAll('.join-meeting-btn');
    for (var i = 0; i < joinBtns.length; i++) {
      joinBtns[i].addEventListener('click', function() {
        renderVideoCall(this.dataset.id);
      });
    }

    var calendarBtns = document.querySelectorAll('.calendar-link');
    for (var i = 0; i < calendarBtns.length; i++) {
      calendarBtns[i].addEventListener('click', function() {
        if (this.innerHTML.indexOf('✓') === -1) {
          var old = this.innerHTML;
          this.innerHTML = '✅ Added to Calendar';
          var self = this;
          setTimeout(function() { self.innerHTML = old; }, 3000);
        }
      });
    }

    var watchBtns = document.querySelectorAll('.watch-recording-btn');
    for (var i = 0; i < watchBtns.length; i++) {
      watchBtns[i].addEventListener('click', function() {
        alert('Recording playback would start: ' + this.dataset.link);
      });
    }
  }

  render();
};
