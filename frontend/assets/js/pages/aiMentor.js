window.renderPage = window.renderPage || {};

window.renderPage.aiMentor = function(params) {
  var mainContent = document.getElementById('main-content');
  if (!mainContent) return;
  var Store = window.Store;
  var Utils = window.Utils;
  var API = window.API;
  var md = window.mockData;
  var Router = window.Router;
  var user = Store.get('user') || { name: 'Student' };
  var chatHistory = Store.get('aiMentorChat') || [];

  var stats = {
    questionsAsked: chatHistory.length > 0 ? Math.ceil(chatHistory.length / 2) : 12,
    topicsMastered: 8,
    studySessions: 24,
    mentorRating: '4.8'
  };

  var quickActions = [
    { label: 'Ask Doubt', icon: '❓', color: '#3b82f6' },
    { label: 'Practice Quiz', icon: '📝', color: '#8b5cf6' },
    { label: 'Study Resources', icon: '📄', color: '#10b981' },
    { label: 'Career Guidance', icon: '🎯', color: '#f59e0b' }
  ];

  var studyTips = [
    'Review yesterday\'s notes for 10 minutes before starting new topics.',
    'Take short breaks every 25 minutes — your brain needs rest to absorb info.',
    'Try teaching what you learned to someone else — the best way to master a topic.',
    'Stay hydrated! Water improves concentration and reduces fatigue.'
  ];

  var recommendedTopics = ['Quadratic Equations', 'Newton\'s Laws of Motion', 'Chemical Bonding', 'Organic Chemistry Basics'];

  var welcomeMessage = {
    text: 'Hello! I\'m your AI Mentor. I can help you with homework, exam prep, career advice, and study strategies. What would you like to learn today?',
    isUser: false,
    time: new Date().toISOString()
  };

  var prePopulatedExchanges = [
    { text: 'How do I solve quadratic equations?', isUser: true, time: new Date(Date.now() - 3600000).toISOString() },
    { text: 'I recommend practicing with our interactive math exercises. Focus on understanding the underlying concepts rather than memorizing formulas.', isUser: false, time: new Date(Date.now() - 3590000).toISOString() },
    { text: 'What\'s the best way to prepare for board exams?', isUser: true, time: new Date(Date.now() - 1800000).toISOString() },
    { text: 'Create a study schedule that covers all topics. Take regular breaks and practice with previous year papers.', isUser: false, time: new Date(Date.now() - 1790000).toISOString() },
    { text: 'How can I manage my time better?', isUser: true, time: new Date(Date.now() - 600000).toISOString() },
    { text: 'Try the Pomodoro technique: study for 25 minutes, take a 5-minute break. Adjust based on your concentration span.', isUser: false, time: new Date(Date.now() - 590000).toISOString() }
  ];

  if (chatHistory.length === 0) {
    chatHistory.push(welcomeMessage);
    for (var pi = 0; pi < prePopulatedExchanges.length; pi++) {
      chatHistory.push(prePopulatedExchanges[pi]);
    }
    Store.set('aiMentorChat', chatHistory);
  }

  function getAIResponse(message) {
    var lower = message.toLowerCase();
    if (lower.indexOf('math') !== -1 || lower.indexOf('mathematics') !== -1 || lower.indexOf('quadratic') !== -1 || lower.indexOf('algebra') !== -1 || lower.indexOf('calculus') !== -1 || lower.indexOf('geometry') !== -1) {
      return 'I recommend practicing with our interactive math exercises. Focus on understanding the underlying concepts rather than memorizing formulas.';
    }
    if (lower.indexOf('physics') !== -1 || lower.indexOf('newton') !== -1 || lower.indexOf('force') !== -1 || lower.indexOf('motion') !== -1 || lower.indexOf('energy') !== -1 || lower.indexOf('light') !== -1 || lower.indexOf('optics') !== -1) {
      return 'Physics is all about understanding the laws of nature. Try to visualize concepts and practice numerical problems regularly.';
    }
    if (lower.indexOf('chemistry') !== -1 || lower.indexOf('chemical') !== -1 || lower.indexOf('reaction') !== -1 || lower.indexOf('bonding') !== -1 || lower.indexOf('periodic') !== -1 || lower.indexOf('organic') !== -1) {
      return 'For chemistry, focus on understanding periodic trends and reaction mechanisms. Practice balancing equations.';
    }
    if (lower.indexOf('exam') !== -1 || lower.indexOf('test') !== -1 || lower.indexOf('board') !== -1 || lower.indexOf('preparation') !== -1 || lower.indexOf('prepare') !== -1) {
      return 'Create a study schedule that covers all topics. Take regular breaks and practice with previous year papers.';
    }
    if (lower.indexOf('time') !== -1 || lower.indexOf('manage') !== -1 || lower.indexOf('schedule') !== -1 || lower.indexOf('procrastinate') !== -1 || lower.indexOf('focus') !== -1) {
      return 'Try the Pomodoro technique: study for 25 minutes, take a 5-minute break. Adjust based on your concentration span.';
    }
    if (lower.indexOf('career') !== -1 || lower.indexOf('future') !== -1 || lower.indexOf('job') !== -1 || lower.indexOf('profession') !== -1 || lower.indexOf('course') !== -1 || lower.indexOf('college') !== -1) {
      return 'Explore different fields through our career guidance section. Consider your interests and strengths.';
    }
    if (lower.indexOf('hello') !== -1 || lower.indexOf('hi') !== -1 || lower.indexOf('hey') !== -1 || lower.indexOf('good morning') !== -1 || lower.indexOf('good evening') !== -1) {
      return 'Hello! How can I help you with your studies today? Feel free to ask about any subject or topic.';
    }
    if (lower.indexOf('thank') !== -1 || lower.indexOf('thanks') !== -1) {
      return 'You\'re welcome! Keep up the great work. If you have more questions, I\'m here to help.';
    }
    return 'That\'s a great question! I recommend breaking down the topic into smaller parts and mastering each one. Check our resources section for more help.';
  }

  function addMessage(text, isUser) {
    var message = { text: text, isUser: isUser, time: new Date().toISOString() };
    chatHistory.push(message);
    Store.set('aiMentorChat', chatHistory);
    renderChatMessages();
    var chatContainer = document.getElementById('ai-chat-messages');
    if (chatContainer) {
      chatContainer.scrollTop = chatContainer.scrollHeight;
    }
  }

  function sendMessage() {
    var input = document.getElementById('ai-chat-input');
    if (!input) return;
    var text = input.value.trim();
    if (!text) return;
    input.value = '';
    addMessage(text, true);
    var aiResponse = getAIResponse(text);
    setTimeout(function() {
      addMessage(aiResponse, false);
    }, 400 + Math.random() * 600);
  }

  function handleKeyPress(e) {
    if (e.key === 'Enter') {
      sendMessage();
    }
  }

  function formatMsgTime(iso) {
    if (!iso) return '';
    var d = new Date(iso);
    if (isNaN(d.getTime())) return '';
    var hours = d.getHours();
    var mins = d.getMinutes();
    var ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12 || 12;
    return hours + ':' + (mins < 10 ? '0' : '') + mins + ' ' + ampm;
  }

  function renderChatMessages() {
    var container = document.getElementById('ai-chat-messages');
    if (!container) return;
    var html = '';
    for (var i = 0; i < chatHistory.length; i++) {
      var msg = chatHistory[i];
      var isUser = msg.isUser;
      var timeStr = formatMsgTime(msg.time);
      if (isUser) {
        html += '\
<div class="flex items-start gap-3" style="justify-content:flex-end;margin-bottom:var(--space-4);animation:fadeIn 0.3s ease">\
  <div class="flex-1" style="max-width:80%">\
    <div style="background:linear-gradient(135deg,var(--accent-blue),var(--accent-purple));padding:var(--space-3) var(--space-4);border-radius:var(--radius-lg) var(--radius-lg) 0 var(--radius-lg);color:white;font-size:var(--text-sm);line-height:1.5">\
      ' + Utils.sanitizeHTML(msg.text) + '\
    </div>\
    <div class="text-xs text-tertiary" style="text-align:right;margin-top:4px;padding-right:4px">' + timeStr + '</div>\
  </div>\
  <div style="width:36px;height:36px;border-radius:50%;background:var(--accent-purple);display:flex;align-items:center;justify-content:center;font-size:0.875rem;flex-shrink:0;color:white;font-weight:600">' + Utils.getInitials(user.name) + '</div>\
</div>';
      } else {
        html += '\
<div class="flex items-start gap-3" style="margin-bottom:var(--space-4);animation:fadeIn 0.3s ease">\
  <div style="width:36px;height:36px;border-radius:50%;background:var(--gradient-primary);display:flex;align-items:center;justify-content:center;font-size:1rem;flex-shrink:0">🤖</div>\
  <div class="flex-1" style="max-width:80%">\
    <div style="background:var(--bg-glass-strong);padding:var(--space-3) var(--space-4);border-radius:var(--radius-lg) var(--radius-lg) var(--radius-lg) 0;color:var(--text-primary);font-size:var(--text-sm);line-height:1.5">\
      ' + Utils.sanitizeHTML(msg.text) + '\
    </div>\
    <div class="text-xs text-tertiary" style="margin-top:4px;padding-left:4px">AI Mentor &middot; ' + timeStr + '</div>\
  </div>\
</div>';
      }
    }
    container.innerHTML = html;
  }

  function render() {
    var html = '\
<div class="page-container" style="max-width:1200px;margin:0 auto;padding:var(--space-6)">\
  <div class="flex items-center justify-between" style="margin-bottom:var(--space-6)">\
    <div>\
      <h1 style="font-size:var(--text-2xl);font-weight:700">AI Mentor</h1>\
      <p style="color:var(--text-secondary);font-size:var(--text-sm);margin-top:4px">Your Personal Learning Assistant</p>\
    </div>\
  </div>\
  <div class="stats-grid" style="grid-template-columns:repeat(4,1fr);margin-bottom:var(--space-6)">\
    <div class="stat-card">\
      <div class="stat-icon" style="background:rgba(59,130,246,0.15);color:#3b82f6">❓</div>\
      <div class="stat-value">' + stats.questionsAsked + '</div>\
      <div class="stat-label">Questions Asked</div>\
    </div>\
    <div class="stat-card">\
      <div class="stat-icon" style="background:rgba(16,185,129,0.15);color:#10b981">🏆</div>\
      <div class="stat-value">' + stats.topicsMastered + '</div>\
      <div class="stat-label">Topics Mastered</div>\
    </div>\
    <div class="stat-card">\
      <div class="stat-icon" style="background:rgba(139,92,246,0.15);color:#8b5cf6">📚</div>\
      <div class="stat-value">' + stats.studySessions + '</div>\
      <div class="stat-label">Study Sessions</div>\
    </div>\
    <div class="stat-card">\
      <div class="stat-icon" style="background:rgba(245,158,11,0.15);color:#f59e0b">⭐</div>\
      <div class="stat-value">' + stats.mentorRating + '</div>\
      <div class="stat-label">Mentor Rating</div>\
    </div>\
  </div>\
  <div class="flex" style="gap:var(--space-6);flex-wrap:wrap">\
    <div class="glass-card" style="flex:3;min-width:0;display:flex;flex-direction:column;padding:0;overflow:hidden;min-height:500px">\
      <div style="padding:var(--space-4) var(--space-5);border-bottom:1px solid var(--border-color);background:var(--bg-glass)">\
        <div class="flex items-center gap-3">\
          <div style="width:44px;height:44px;border-radius:50%;background:var(--gradient-primary);display:flex;align-items:center;justify-content:center;font-size:1.5rem">🤖</div>\
          <div>\
            <div style="font-weight:600;font-size:var(--text-sm)">AI Mentor</div>\
            <div style="font-size:var(--text-xs);color:var(--accent-green)">● Online</div>\
          </div>\
        </div>\
      </div>\
      <div id="ai-chat-messages" style="flex:1;overflow-y:auto;padding:var(--space-4) var(--space-5)"></div>\
      <div style="padding:var(--space-3) var(--space-4);border-top:1px solid var(--border-color);background:var(--bg-glass)">\
        <div class="flex items-center gap-3">\
          <input type="text" id="ai-chat-input" class="input-field" placeholder="Ask your AI Mentor anything..." style="flex:1;border-radius:var(--radius-full);padding:var(--space-3) var(--space-4)" onkeydown="window.renderPage.aiMentor.handleKeyPress(event)">\
          <button class="btn btn-primary" style="border-radius:50%;width:44px;height:44px;padding:0;display:flex;align-items:center;justify-content:center;flex-shrink:0;font-size:1.25rem" data-action="aimentor:sendMessage">➤</button>\
        </div>\
      </div>\
    </div>\
    <div style="flex:2;min-width:280px;display:flex;flex-direction:column;gap:var(--space-4)">\
      <div class="glass-card" style="padding:var(--space-5)">\
        <div class="section-header" style="margin-bottom:var(--space-4)">\
          <div class="section-title" style="font-size:var(--text-base)">⚡ Quick Actions</div>\
        </div>\
        <div class="stats-grid" style="grid-template-columns:repeat(2,1fr);gap:var(--space-3)">';
    for (var qi = 0; qi < quickActions.length; qi++) {
      var qa = quickActions[qi];
      html += '\
          <div class="glass-card" style="padding:var(--space-4);text-align:center;cursor:pointer;transition:all var(--transition-base)" data-action="aimentor:quickAction" data-index="' + qi + '" onmouseover="this.style.borderColor=\'' + qa.color + '40\';this.style.transform=\'translateY(-2px)\'" onmouseout="this.style.borderColor=\'\';this.style.transform=\'\'">\
            <div style="font-size:1.5rem;margin-bottom:var(--space-1)">' + qa.icon + '</div>\
            <div style="font-size:var(--text-xs);font-weight:600">' + qa.label + '</div>\
          </div>';
    }
    html += '\
        </div>\
      </div>\
      <div class="glass-card" style="padding:var(--space-5)">\
        <div class="section-header" style="margin-bottom:var(--space-4)">\
          <div class="section-title" style="font-size:var(--text-base)">💡 Study Tips</div>\
        </div>\
        <div style="display:flex;flex-direction:column;gap:var(--space-3)">';
    for (var ti = 0; ti < studyTips.length; ti++) {
      html += '\
          <div class="flex items-start gap-3" style="padding:var(--space-3);background:var(--bg-glass);border-radius:var(--radius-md)">\
            <div style="font-size:1.25rem;flex-shrink:0">💡</div>\
            <div style="font-size:var(--text-xs);color:var(--text-secondary);line-height:1.5">' + studyTips[ti] + '</div>\
          </div>';
    }
    html += '\
        </div>\
      </div>\
      <div class="glass-card" style="padding:var(--space-5)">\
        <div class="section-header" style="margin-bottom:var(--space-4)">\
          <div class="section-title" style="font-size:var(--text-base)">📖 Recommended Topics</div>\
        </div>\
        <div class="flex flex-wrap gap-2">';
    for (var rti = 0; rti < recommendedTopics.length; rti++) {
      html += '\
          <span class="badge badge-blue" style="cursor:pointer;transition:all var(--transition-base);padding:var(--space-2) var(--space-3)" onmouseover="this.style.opacity=\'0.8\'" onmouseout="this.style.opacity=\'1\'" data-action="aimentor:addQuickTopic" data-topic="' + recommendedTopics[rti] + '">' + recommendedTopics[rti] + '</span>';
    }
    html += '\
        </div>\
      </div>\
    </div>\
  </div>\
</div>';
    mainContent.innerHTML = html;
    renderChatMessages();
    var chatContainer = document.getElementById('ai-chat-messages');
    if (chatContainer) {
      chatContainer.scrollTop = chatContainer.scrollHeight;
    }
  }

  window.renderPage.aiMentor.sendMessage = sendMessage;
  window.renderPage.aiMentor.handleKeyPress = handleKeyPress;
  window.renderPage.aiMentor.addMessage = addMessage;
  window.renderPage.aiMentor.getAIResponse = getAIResponse;

  window.renderPage.aiMentor.quickAction = function(index) {
    var actions = [
      'I have a doubt about my studies',
      'Generate a practice quiz for me',
      'Show me some study resources',
      'I need career guidance'
    ];
    var input = document.getElementById('ai-chat-input');
    if (input) {
      input.value = actions[index] || actions[0];
      sendMessage();
    }
  };

  window.renderPage.aiMentor.addQuickTopic = function(topic) {
    var text = 'Can you help me understand ' + topic + '?';
    var input = document.getElementById('ai-chat-input');
    if (input) {
      input.value = text;
      sendMessage();
    }
  };

  if (!window._aimentorDelegated) {
    window._aimentorDelegated = true;
    document.body.addEventListener('click', function(e) {
      var el = e.target.closest('[data-action^="aimentor:"]');
      if (!el) return;
      var action = el.getAttribute('data-action');
      if (action === 'aimentor:sendMessage') window.renderPage.aiMentor.sendMessage();
      else if (action === 'aimentor:quickAction') window.renderPage.aiMentor.quickAction(parseInt(el.getAttribute('data-index'), 10));
      else if (action === 'aimentor:addQuickTopic') window.renderPage.aiMentor.addQuickTopic(el.getAttribute('data-topic'));
    });
  }
  render();
};
