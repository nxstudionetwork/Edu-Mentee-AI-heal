window.renderPage = window.renderPage || {};

window.renderPage.aiHelper = function (params) {
  var mainContent = document.getElementById('main-content');
  if (!mainContent) return;
  var Store = window.Store;
  var Utils = window.Utils;
  var user = Store.get('user') || { name: 'Student' };
  var conversations = Store.get('aiConversations') || [];
  var currentConversationId = null;
  var isTyping = false;
  var currentTab = 'chat';
  var settingsPanelOpen = false;
  var settings = Store.get('aiHelperSettings') || { autoSuggest: true, typingAnimation: true, maxConversations: 50 };
  var flashcards = Store.get('aiFlashcards') || [];
  var currentFlashcardIndex = 0;
  var flashcardFilterSubject = 'all';
  var flashcardShuffled = false;
  var flashcardFlipped = false;
  var displayedFlashcards = [];
  var studyData = Store.get('aiStudyData') || {};
  var currentStudySubject = '';
  var currentStudyTopic = '';
  var studyTimerSeconds = 0;
  var studyTimerInterval = null;
  var studySessionActive = false;
  var studyLearnedTopics = Store.get('aiStudyLearned') || {};
  var feedbackData = Store.get('aiFeedback') || {};
  var mobileSidebarOpen = false;
  var sidebarSearchQuery = '';
  var FLASHCARD_SUBJECTS = ['Mathematics', 'Physics', 'Chemistry', 'Biology', 'English', 'Hindi', 'Social Studies', 'Computer Science', 'General Knowledge'];
  var SUGGESTED_PROMPTS = ['Help me with my homework', 'Explain quadratic equations', 'Quiz me on Science', 'Create a study plan', 'Help with essay writing', 'Solve this math problem', 'Translate this to Hindi', 'Career guidance for Class 10'];
  var STUDY_TEMPLATES = {
    Mathematics: { topics: { Algebra: { keyPoints: ['Variables and constants', 'Linear equations', 'Quadratic equations', 'Polynomials'], formulas: ['(a+b)^2 = a^2 + 2ab + b^2', 'x = (-b \u00B1 \u221A(b\u00B2-4ac)) / 2a'], questions: ['Solve for x: 2x + 5 = 13', 'Factorize: x\u00B2 + 5x + 6'] }, Geometry: { keyPoints: ['Points, lines, and angles', 'Triangles and their properties', 'Circles and chords', 'Coordinate geometry'], formulas: ['Area of triangle = \u00BD \u00D7 base \u00D7 height', 'Pythagorean theorem: a\u00B2 + b\u00B2 = c\u00B2'], questions: ['Find the area of a triangle with base 6cm and height 4cm', 'What is the sum of angles in a triangle?'] }, Trigonometry: { keyPoints: ['Sine, cosine, tangent ratios', 'Trigonometric identities', 'Heights and distances'], formulas: ['sin\u00B2\u03B8 + cos\u00B2\u03B8 = 1', 'tan\u03B8 = sin\u03B8/cos\u03B8'], questions: ['If sin\u03B8 = 3/5, find cos\u03B8', 'Find the value of tan 45\u00B0'] } } },
    Physics: { topics: { 'Laws of Motion': { keyPoints: ["Newton's three laws of motion", 'Inertia and momentum', 'Force and acceleration', 'Action-reaction pairs'], formulas: ['F = ma', 'p = mv', 'F = G(m\u2081m\u2082)/r\u00B2'], questions: ['A 5kg object accelerates at 2 m/s\u00B2. Find the force.', "State Newton's first law of motion."] }, Thermodynamics: { keyPoints: ['Heat and temperature', 'First law of thermodynamics', 'Second law of thermodynamics', 'Entropy'], formulas: ['\u0394U = Q - W', 'PV = nRT', 'Efficiency = (W/Q_H) \u00D7 100%'], questions: ['Explain the first law of thermodynamics.', 'What is entropy?'] }, Optics: { keyPoints: ['Reflection and refraction', 'Lens formula', "Snell's law", 'Optical instruments'], formulas: ['1/f = 1/v - 1/u', 'n\u2081 sin\u03B8\u2081 = n\u2082 sin\u03B8\u2082', 'Magnification = -v/u'], questions: ['An object is placed 20cm from a convex lens of focal length 10cm. Find the image position.', "State Snell's law."] } } },
    Chemistry: { topics: { 'Periodic Table': { keyPoints: ['Groups and periods', 'Periodic trends', 'Valence electrons', 'Metals, non-metals, metalloids'], formulas: ['Electron configuration: 2n\u00B2', 'Atomic radius decreases across period'], questions: ['How many periods are in the modern periodic table?', 'Explain the trend of electronegativity across a period.'] }, 'Chemical Bonding': { keyPoints: ['Ionic bonds', 'Covalent bonds', 'Metallic bonds', 'VSEPR theory'], formulas: ['Octet rule', 'Bond order = (bonding - antibonding)/2'], questions: ['Distinguish between ionic and covalent bonds.', 'What is the shape of H\u2082O?'] }, 'Organic Chemistry': { keyPoints: ['Hydrocarbons', 'Functional groups', 'IUPAC naming', 'Isomerism'], formulas: ['C\u2099H\u2082\u2099\u208A\u2082 (alkanes)', 'C\u2099H\u2082\u2099 (alkenes)'], questions: ['Name the first three alkanes.', 'What is a functional group?'] } } },
    Biology: { topics: { 'Cell Biology': { keyPoints: ['Cell theory', 'Prokaryotic vs eukaryotic cells', 'Cell organelles and functions', 'Cell division (mitosis & meiosis)'], formulas: ['Total magnification = eyepiece \u00D7 objective'], questions: ['What are the three parts of cell theory?', 'Differentiate between mitosis and meiosis.'] }, Genetics: { keyPoints: ["Mendel's laws", 'DNA structure', 'Gene expression', 'Punnett squares'], formulas: ['Monohybrid ratio: 3:1', 'Dihybrid ratio: 9:3:3:1'], questions: ['What is a Punnett square used for?', "Explain Mendel's law of segregation."] }, 'Human Physiology': { keyPoints: ['Digestive system', 'Circulatory system', 'Respiratory system', 'Nervous system'], formulas: ['Cardiac output = HR \u00D7 SV', 'Blood pressure = systolic/diastolic'], questions: ['Trace the path of blood through the heart.', 'What is the function of the small intestine?'] } } }
  };

  document.addEventListener('click', function(e) {
    var target = e.target.closest('[data-action^="ai:"]');
    if (!target) return;
    var action = target.getAttribute('data-action');
    var parts = action.split(':');
    var cmd = parts[1];
    var fnMap = {
      'sendMessage': function() { sendMessage(); },
      'newChat': function() { newConversation(); },
      'toggleSidebar': function() { toggleMobileSidebar(); },
      'switchConv': function(id) { switchConversation(id); },
      'deleteConv': function(id) { deleteConversation(id); },
      'pinConv': function(id) { togglePinConversation(id); },
      'clearChat': function() { clearAllConversations(); },
      'exportConv': function() { exportAllConversations(); },
      'setTab': function(tab) { setTab(tab); },
      'suggestPrompt': function() { selectPrompt(target.getAttribute('data-prompt') || ''); },
      'copyMsg': function() { copyMessage(target.getAttribute('data-msg-content') || ''); },
      'feedback': function(v) { submitFeedback(target.getAttribute('data-msg-content') || '', v === 'true'); },
      'toggleFlashcard': function() { flipCard(); },
      'nextCard': function() { nextCard(); },
      'prevCard': function() { prevCard(); },
      'startStudy': function() { startStudySession(); },
      'closeSettings': function() { toggleSettings(); },
      'createFlashcard': function() { createFlashcardFromForm(); },
      'showFlashcardForm': function() { showFlashcardForm(); },
      'toggleShuffle': function() { toggleShuffle(); },
      'goToFlashcard': function(idx) { goToFlashcard(parseInt(idx, 10)); },
      'toggleStar': function(id) { toggleStarFlashcard(id); },
      'deleteFlashcard': function(id) { deleteFlashcard(id); },
      'selectTopic': function() { selectStudyTopic(target.getAttribute('data-subject'), target.getAttribute('data-topic')); },
      'markLearned': function() { markTopicLearned(target.getAttribute('data-subject'), target.getAttribute('data-topic')); },
      'endStudy': function() { endStudySession(); },
      'dismissForm': function() { var el = document.querySelector('[data-overlay="modal"]'); if (el) el.remove(); },
      'voiceInput': function() { mockVoiceInput(); },
      'uploadImage': function() { mockUpload('image'); },
      'uploadPdf': function() { mockUpload('pdf'); },
      'uploadDoc': function() { mockUpload('doc'); }
    };
    if (fnMap[cmd]) {
      var arg = parts.slice(2).join(':') || undefined;
      fnMap[cmd](arg);
    }
  });

  function generateId() { return Date.now().toString(36) + '_' + Math.random().toString(36).slice(2, 9); }
  function generateTitle(messages) {
    for (var i = 0; i < messages.length; i++) {
      if (messages[i].role === 'user') {
        var text = messages[i].content;
        return text.length > 40 ? text.substring(0, 37) + '...' : text;
      }
    }
    return 'New Chat';
  }
  function getCurrentConversation() {
    if (!currentConversationId) return null;
    for (var i = 0; i < conversations.length; i++) { if (conversations[i].id === currentConversationId) return conversations[i]; }
    return null;
  }
  function saveConversations() { Store.set('aiConversations', conversations); }
  function saveFlashcards() { Store.set('aiFlashcards', flashcards); }
  function saveStudyData() { Store.set('aiStudyData', studyData); }
  function saveSettings() { Store.set('aiHelperSettings', settings); }
  function saveFeedback() { Store.set('aiFeedback', feedbackData); }
  function saveLearnedTopics() { Store.set('aiStudyLearned', studyLearnedTopics); }

  function formatTime(iso) {
    if (!iso) return '';
    var d = new Date(iso);
    if (isNaN(d.getTime())) return '';
    var hours = d.getHours();
    var mins = d.getMinutes();
    var ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12 || 12;
    return hours + ':' + (mins < 10 ? '0' : '') + mins + ' ' + ampm;
  }

  function formatTimeAgo(iso) {
    if (!iso) return '';
    var d = new Date(iso);
    var now = new Date();
    var diff = Math.floor((now - d) / 1000);
    if (diff < 60) return 'just now';
    if (diff < 3600) return Math.floor(diff / 60) + 'm ago';
    if (diff < 86400) return Math.floor(diff / 3600) + 'h ago';
    return Math.floor(diff / 86400) + 'd ago';
  }

  function showToast(msg, type) {
    var toast = document.createElement('div');
    var bg = type === 'green' ? 'var(--accent-green)' : type === 'red' ? 'var(--accent-red)' : 'var(--accent-orange)';
    toast.className = 'ai-toast';
    toast.style.cssText = 'background:' + bg;
    toast.textContent = msg;
    document.body.appendChild(toast);
    setTimeout(function () { toast.remove(); }, 2000);
  }

  function scrollToBottom() {
    var container = document.getElementById('ai-chat-messages');
    if (container) container.scrollTop = container.scrollHeight;
  }

  function getSubjectsForClass() {
    var classNum = user && user.class ? parseInt(user.class) : 10;
    if (Utils && Utils.classSubjects && Utils.classSubjects[classNum]) return Utils.classSubjects[classNum];
    if (classNum >= 1 && classNum <= 5) return ['Mathematics', 'English', 'Hindi', 'Environmental Studies', 'General Knowledge'];
    if (classNum <= 8) return ['Mathematics', 'Science', 'English', 'Hindi', 'Social Studies', 'Sanskrit', 'Computer Science'];
    return ['Mathematics', 'Physics', 'Chemistry', 'Biology', 'English', 'Hindi', 'Computer Science'];
  }

  function newConversation() {
    if (conversations.length >= settings.maxConversations) conversations = conversations.slice(0, settings.maxConversations - 1);
    var id = 'conv_' + generateId();
    var conv = { id: id, title: 'New Chat', messages: [], createdAt: new Date().toISOString(), pinned: false };
    conversations.unshift(conv);
    currentConversationId = id;
    saveConversations();
    renderAll();
    return conv;
  }

  function switchConversation(id) { currentConversationId = id; currentTab = 'chat'; renderAll(); }

  function deleteConversation(id) {
    if (!confirm('Delete this conversation?')) return;
    for (var i = 0; i < conversations.length; i++) { if (conversations[i].id === id) { conversations.splice(i, 1); break; } }
    if (currentConversationId === id) currentConversationId = conversations.length > 0 ? conversations[0].id : null;
    saveConversations();
    renderAll();
  }

  function togglePinConversation(id) {
    for (var i = 0; i < conversations.length; i++) { if (conversations[i].id === id) { conversations[i].pinned = !conversations[i].pinned; break; } }
    saveConversations();
    renderSidebar();
  }

  function searchConversations(query) {
    if (!query || query.trim() === '') return conversations;
    var q = query.toLowerCase().trim();
    var result = [];
    for (var i = 0; i < conversations.length; i++) {
      if (conversations[i].title.toLowerCase().indexOf(q) !== -1) result.push(conversations[i]);
    }
    return result;
  }

  function exportAllConversations() {
    if (conversations.length === 0) { showToast('No conversations to export', 'orange'); return; }
    var json = JSON.stringify(conversations, null, 2);
    var blob = new Blob([json], { type: 'application/json' });
    var url = URL.createObjectURL(blob);
    var a = document.createElement('a');
    a.href = url;
    a.download = 'ai-conversations-' + new Date().toISOString().slice(0, 10) + '.json';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    showToast('Conversations exported!', 'green');
  }

  function mockVoiceInput() {
    var input = document.getElementById('ai-input');
    if (input) { input.value = 'Voice input: Can you explain photosynthesis?'; input.focus(); showToast('Voice captured (mock)', 'green'); }
  }

  function mockUpload(type) {
    var labels = { image: 'Image attached (mock)', pdf: 'PDF attached (mock)', doc: 'Document attached (mock)' };
    showToast(labels[type] || 'File attached', 'green');
  }

  function addFlashcard(term, definition, subject) {
    var card = { id: generateId(), term: term.trim(), definition: definition.trim(), subject: subject || 'General', starred: false, createdAt: new Date().toISOString() };
    flashcards.unshift(card);
    saveFlashcards();
    updateDisplayedFlashcards();
    renderFlashcardsSidebar();
    renderFlashcardViewer();
    showToast('Flashcard created!', 'green');
  }

  function deleteFlashcard(id) {
    for (var i = 0; i < flashcards.length; i++) { if (flashcards[i].id === id) { flashcards.splice(i, 1); break; } }
    saveFlashcards();
    updateDisplayedFlashcards();
    if (currentFlashcardIndex >= displayedFlashcards.length) currentFlashcardIndex = Math.max(0, displayedFlashcards.length - 1);
    renderFlashcardsSidebar();
    renderFlashcardViewer();
  }

  function toggleStarFlashcard(id) {
    for (var i = 0; i < flashcards.length; i++) { if (flashcards[i].id === id) { flashcards[i].starred = !flashcards[i].starred; break; } }
    saveFlashcards();
    updateDisplayedFlashcards();
    renderFlashcardsSidebar();
    renderFlashcardViewer();
  }

  function toggleShuffle() {
    flashcardShuffled = !flashcardShuffled;
    flashcardFlipped = false;
    currentFlashcardIndex = 0;
    updateDisplayedFlashcards();
    renderFlashcardViewer();
    renderFlashcardsSidebar();
  }

  function updateDisplayedFlashcards() {
    var list = flashcards.slice();
    if (flashcardFilterSubject !== 'all') list = list.filter(function (c) { return c.subject === flashcardFilterSubject; });
    if (flashcardShuffled) { for (var i = list.length - 1; i > 0; i--) { var j = Math.floor(Math.random() * (i + 1)); var tmp = list[i]; list[i] = list[j]; list[j] = tmp; } }
    displayedFlashcards = list;
  }

  function flipCard() {
    flashcardFlipped = !flashcardFlipped;
    var inner = document.getElementById('flashcard-inner');
    if (inner) inner.classList.toggle('flipped', flashcardFlipped);
  }

  function nextCard() { if (currentFlashcardIndex < displayedFlashcards.length - 1) { currentFlashcardIndex++; flashcardFlipped = false; renderFlashcardViewer(); } }
  function prevCard() { if (currentFlashcardIndex > 0) { currentFlashcardIndex--; flashcardFlipped = false; renderFlashcardViewer(); } }

  function setFlashcardFilter(subject) {
    flashcardFilterSubject = subject;
    flashcardFlipped = false;
    currentFlashcardIndex = 0;
    updateDisplayedFlashcards();
    renderFlashcardsSidebar();
    renderFlashcardViewer();
  }

  function initStudyData(subject) {
    if (!studyData[subject]) {
      var template = STUDY_TEMPLATES[subject];
      if (template) { studyData[subject] = JSON.parse(JSON.stringify(template)); }
      else {
        studyData[subject] = { topics: {} };
        var subjects = getSubjectsForClass();
        for (var si = 0; si < subjects.length; si++) {
          if (subjects[si] === subject) studyData[subject].topics['Introduction to ' + subject] = { keyPoints: ['Core concepts of ' + subject, 'Key terminology', 'Practical applications'], formulas: [], questions: ['What are the main areas of ' + subject + '?'] };
        }
      }
      saveStudyData();
    }
  }

  function startStudySession() {
    if (!currentStudySubject || !currentStudyTopic) { showToast('Select a subject and topic first', 'orange'); return; }
    studySessionActive = true;
    studyTimerSeconds = 0;
    if (studyTimerInterval) clearInterval(studyTimerInterval);
    studyTimerInterval = setInterval(function () { studyTimerSeconds++; renderStudyRightPanel(); }, 1000);
    renderStudyRightPanel();
    showToast('Study session started!', 'green');
  }

  function endStudySession() {
    if (studyTimerInterval) { clearInterval(studyTimerInterval); studyTimerInterval = null; }
    studySessionActive = false;
    var minutes = Math.floor(studyTimerSeconds / 60);
    var secs = studyTimerSeconds % 60;
    showToast('Session ended: ' + minutes + 'm ' + secs + 's', 'green');
    renderStudyRightPanel();
    renderStudySidebar();
  }

  function markTopicLearned(subject, topic) {
    if (!studyLearnedTopics[subject]) studyLearnedTopics[subject] = {};
    studyLearnedTopics[subject][topic] = !studyLearnedTopics[subject][topic];
    saveLearnedTopics();
    renderStudySidebar();
    renderStudyRightPanel();
  }

  function getSubjectProgress(subject) {
    var data = studyData[subject];
    if (!data || !data.topics) return { completed: 0, total: 0, percent: 0 };
    var topicNames = Object.keys(data.topics);
    var total = topicNames.length;
    var completed = 0;
    var learned = studyLearnedTopics[subject] || {};
    for (var i = 0; i < topicNames.length; i++) { if (learned[topicNames[i]]) completed++; }
    return { completed: completed, total: total, percent: total > 0 ? Math.round((completed / total) * 100) : 0 };
  }

  function submitFeedback(messageContent, helpful) {
    var key = 'msg_' + btoa(encodeURIComponent(messageContent).slice(0, 50));
    if (!feedbackData[key]) feedbackData[key] = { helpful: 0, notHelpful: 0 };
    if (helpful) feedbackData[key].helpful++; else feedbackData[key].notHelpful++;
    saveFeedback();
    showToast(helpful ? 'Glad it helped!' : 'Thanks for the feedback!', 'green');
  }

  function copyMessage(text) { Utils.copyToClipboard(text); showToast('Copied!', 'green'); }

  function selectPrompt(prompt) {
    var input = document.getElementById('ai-input');
    if (input) { input.value = prompt; sendMessage(); }
  }

  function toggleMobileSidebar() {
    mobileSidebarOpen = !mobileSidebarOpen;
    var sidebar = document.getElementById('ai-sidebar');
    var overlay = document.getElementById('ai-overlay');
    if (sidebar) sidebar.classList.toggle('open', mobileSidebarOpen);
    if (overlay) overlay.classList.toggle('active', mobileSidebarOpen);
  }

  function getAIResponse(message) {
    var lower = message.toLowerCase();
    if (lower.indexOf('homework') !== -1 || lower.indexOf('assignment') !== -1) return '## Homework Help\n\nHere\'s a systematic approach to tackle your homework:\n\n### Step 1: Understand the Question\n- Read the problem carefully\n- Underline key terms and numbers\n- Identify what\'s being asked\n\n### Step 2: Break It Down\n- Divide into smaller steps\n- Solve each step sequentially\n- Show all working\n\n### Step 3: Review\n- Does the answer make sense?\n- Check units and decimal places\n\n> **Tip**: Use the Pomodoro technique \u2014 25 min focused work, 5 min break!';
    if (lower.indexOf('explain') !== -1 || lower.indexOf('what is') !== -1 || lower.indexOf('define') !== -1) return '## Explanation\n\nLet me break this concept down for you.\n\n### Core Concept\nThis topic is fundamental to understanding the subject.\n\n### Key Components\n1. **First Principle**: Start with the basic definition\n2. **Building Blocks**: Identify the main parts\n3. **Application**: How this is used in practice\n\n### Real-World Example\nConsider a practical scenario that illustrates this concept.\n\n> **Feynman Technique**: If you can\'t explain it simply, you don\'t understand it well enough!';
    if (lower.indexOf('quiz') !== -1 || lower.indexOf('test me') !== -1) return '## Quick Knowledge Quiz\n\n**Q1:** What is the chemical symbol for water?\n- A) H\u2082O\n- B) CO\u2082\n- C) NaCl\n- D) HCl\n\n**Q2:** What is the square root of 144?\n- A) 10\n- B) 11\n- C) 12\n- D) 13\n\n**Q3:** Who wrote "Romeo and Juliet"?\n- A) Charles Dickens\n- B) William Shakespeare\n- C) Jane Austen\n- D) Mark Twain\n\n---\n**Answers:** 1-A, 2-C, 3-B\n\n> **Tip**: Review each question you got wrong!';
    if (lower.indexOf('study plan') !== -1 || (lower.indexOf('plan') !== -1 && lower.indexOf('study') !== -1)) return '## Personalized Study Plan\n\n### Week-by-Week Breakdown\n| Week | Focus | Activities |\n|------|-------|-----------|\n| Week 1 | Foundation | Review core concepts |\n| Week 2 | Practice | Solve problems, quizzes |\n| Week 3 | Advanced | Difficult topics |\n| Week 4 | Revision | Mock tests |\n\n### Daily Schedule\n- **Morning**: Hardest subject\n- **Afternoon**: New topics\n- **Evening**: Revision\n\n> **Remember**: Consistency beats intensity!';
    if (lower.indexOf('essay') !== -1 || (lower.indexOf('write') !== -1 && lower.indexOf('essay') !== -1)) return '## Essay Outline\n\n### I. Introduction\n- Hook: Start with a compelling fact\n- Thesis Statement: Your main argument\n\n### II. Body Paragraphs\n**Paragraph 1**: First Main Point\n**Paragraph 2**: Second Main Point\n**Paragraph 3**: Counterargument\n\n### III. Conclusion\n- Restate thesis\n- Summarize main points\n\n> **Word Count Guide**: Intro (10%), Body (80%), Conclusion (10%)';
    if (lower.indexOf('solve') !== -1 || lower.indexOf('math') !== -1 || lower.indexOf('equation') !== -1) return '## Step-by-Step Solution\n\n### Step 1: Understand the Problem\nIdentify what we\'re solving for.\n\n### Step 2: Recall the Formula\nFor a quadratic equation ax\u00B2 + bx + c = 0:\nx = (-b \u00B1 \u221A(b\u00B2 - 4ac)) / (2a)\n\n### Step 3: Substitute and Calculate\n\n> **Pro Tip**: Show ALL working \u2014 partial credit matters!';
    if (lower.indexOf('translate') !== -1) return '## Translation\n\n| Language | Translation |\n|----------|------------|\n| Hindi | \u0928\u092E\u0938\u094D\u0924\u0947 |\n| French | Bonjour |\n| Spanish | Hola |\n\n> **Tip**: Say "Translate [text] to [language]" for custom translations!';
    if (lower.indexOf('career') !== -1 || lower.indexOf('guidance') !== -1) return '## Career Guidance\n\n### Stream-Career Options\n| Stream | Careers |\n|--------|---------|\n| Science | Engineering, Medicine |\n| Commerce | CA, Finance |\n| Arts | Law, Design |\n| Technology | Software Dev, AI |\n\n> **Remember**: The best career is where passion meets skills!';
    if (lower.indexOf('code') !== -1 || lower.indexOf('programming') !== -1) return '## Code Explanation\n\n### Concept: Functions\nA **function** is a reusable block of code.\n\n```\nfunction functionName(parameters) {\n  return result;\n}\n```\n\n### Key Benefits\n1. Reusability\n2. Modularity\n3. Readability\n\n> **Tip**: Start simple and add complexity!';
    return '## Welcome to AI Helper!\n\nI\'m your intelligent learning assistant. Here\'s how I can help:\n\n| What I Can Do | Try Saying |\n|--------------|------------|\n| Explain concepts | "Explain photosynthesis" |\n| Solve problems | "Solve quadratic equation" |\n| Study plans | "Create a study plan" |\n| Quiz you | "Quiz me on Biology" |\n| Essay help | "Write an essay outline" |\n| Translate | "Translate this to Hindi" |\n| Career advice | "Career guidance" |\n| Code help | "Explain functions in code" |\n\n**What would you like to explore today?**';
  }

  function renderMarkdown(text) {
    if (!text) return '';
    var html = '';
    var codeBlocks = [];
    var processed = text.replace(/```(\w*)\n?([\s\S]*?)```/g, function (match, lang, code) { codeBlocks.push(code.trim()); return '%%CODEBLOCK_' + (codeBlocks.length - 1) + '%%'; });
    html = Utils.sanitizeHTML(processed);
    html = html.replace(/%%CODEBLOCK_(\d+)%%/g, function (match, idx) { return '<pre><code>' + Utils.sanitizeHTML(codeBlocks[parseInt(idx)]) + '</code></pre>'; });
    html = html.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
    html = html.replace(/\*([^*]+)\*/g, '<em>$1</em>');
    html = html.replace(/^### (.+)$/gm, '<h4 style="margin:12px 0 6px;font-size:var(--text-sm);font-weight:600">$1</h4>');
    html = html.replace(/^## (.+)$/gm, '<h3 style="margin:16px 0 8px;font-size:var(--text-base);font-weight:600">$1</h3>');
    html = html.replace(/^---+$/gm, '<hr style="border:none;border-top:1px solid var(--border-light);margin:12px 0">');
    html = html.replace(/^&gt; (.+)$/gm, '<blockquote style="border-left:3px solid var(--accent-blue);padding:8px 12px;margin:8px 0;background:var(--bg-glass);border-radius:0 var(--radius-sm) var(--radius-sm) 0;font-style:italic;font-size:var(--text-sm)">$1</blockquote>');
    html = html.replace(/^- (.+)$/gm, '<li style="margin:2px 0;font-size:var(--text-sm)">$1</li>');
    html = html.replace(/^(\d+)\. (.+)$/gm, '<li style="margin:2px 0;font-size:var(--text-sm)">$2</li>');
    html = html.replace(/((?:<li[^>]*>[\s\S]*?<\/li>\n?)+)/g, '<ul style="padding-left:20px;margin:8px 0">$1</ul>');
    html = html.replace(/\n/g, '<br>');
    return html;
  }

  function addMessage(content, role) {
    var conv = getCurrentConversation();
    if (!conv) conv = newConversation();
    var msg = { role: role || 'user', content: content, time: new Date().toISOString(), id: 'msg_' + generateId() };
    conv.messages.push(msg);
    if (role === 'user' && conv.title === 'New Chat') conv.title = generateTitle(conv.messages);
    saveConversations();
    renderChatMessages();
    scrollToBottom();
  }

  function sendMessage() {
    var input = document.getElementById('ai-input');
    if (!input) return;
    var text = input.value.trim();
    if (!text || isTyping) return;
    input.value = '';
    input.style.height = 'auto';
    addMessage(text, 'user');
    if (settings.typingAnimation) showTypingIndicator();
    var delay = 500 + Math.random() * 1500;
    setTimeout(function () {
      if (settings.typingAnimation) hideTypingIndicator();
      var response = getAIResponse(text);
      addMessage(response, 'assistant');
    }, delay);
  }

  function handleKeyDown(e) {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage(); }
  }

  function showTypingIndicator() {
    isTyping = true;
    var container = document.getElementById('ai-chat-messages');
    if (!container) return;
    var div = document.createElement('div');
    div.className = 'ai-msg ai-msg-assistant ai-typing';
    div.id = 'ai-typing-indicator';
    div.innerHTML = '<div class="ai-avatar ai-avatar-ai">&#129302;</div><div class="ai-msg-body"><div class="ai-typing-dots"><span></span><span></span><span></span></div></div>';
    container.appendChild(div);
    scrollToBottom();
  }

  function hideTypingIndicator() {
    isTyping = false;
    var el = document.getElementById('ai-typing-indicator');
    if (el) el.remove();
  }

  function renderAll() {
    renderChat();
    renderSidebar();
    if (currentTab === 'flashcards') { updateDisplayedFlashcards(); renderFlashcardsSidebar(); renderFlashcardViewer(); }
    else if (currentTab === 'study') { renderStudySidebar(); renderStudyRightPanel(); }
    var rp = document.getElementById('ai-right-panel');
    if (rp) rp.style.display = (currentTab === 'flashcards' || currentTab === 'study') ? 'flex' : 'none';
    renderSettingsPanel();
  }

  function setTab(tab) { currentTab = tab; renderAll(); }

  function renderSidebar() {
    var sidebar = document.getElementById('ai-sidebar');
    if (!sidebar) return;
    var html = '<div class="ai-sidebar-inner">';
    html += '<div class="ai-sidebar-header">';
    html += '<button class="ai-new-chat-btn" data-action="ai:newChat"><span>+</span> New Chat</button>';
    html += '</div>';
    html += '<div class="ai-sidebar-tabs">';
    html += '<button class="ai-sidebar-tab' + (currentTab === 'chat' ? ' active' : '') + '" data-action="ai:setTab:chat">Chats</button>';
    html += '<button class="ai-sidebar-tab' + (currentTab === 'flashcards' ? ' active' : '') + '" data-action="ai:setTab:flashcards">Cards</button>';
    html += '<button class="ai-sidebar-tab' + (currentTab === 'study' ? ' active' : '') + '" data-action="ai:setTab:study">Study</button>';
    html += '</div>';
    if (currentTab === 'chat') {
      html += '<div class="ai-sidebar-search"><input type="text" id="ai-sidebar-search-input" class="ai-search-input" placeholder="Search chats..." oninput="window.renderPage.aiHelper.onSearchConversations(this.value)"><span class="ai-search-icon">&#128269;</span></div>';
      var searchInput = document.getElementById('ai-sidebar-search-input');
      var query = searchInput ? searchInput.value : sidebarSearchQuery;
      var list = query ? searchConversations(query) : conversations;
      var pinned = [];
      var unpinned = [];
      for (var i = 0; i < list.length; i++) { if (list[i].pinned) pinned.push(list[i]); else unpinned.push(list[i]); }
      html += '<div class="ai-chat-list">';
      if (pinned.length > 0) {
        html += '<div class="ai-chat-list-label">Pinned</div>';
        for (var p = 0; p < pinned.length; p++) html += getConvItemHTML(pinned[p]);
      }
      if (unpinned.length > 0) {
        if (pinned.length > 0) html += '<div class="ai-chat-list-label">Recent</div>';
        for (var j = 0; j < unpinned.length; j++) html += getConvItemHTML(unpinned[j]);
      }
      if (list.length === 0) html += '<div class="ai-empty-state">No conversations yet</div>';
      html += '</div>';
    } else if (currentTab === 'flashcards') {
      html += '<div id="ai-flashcards-sidebar" class="ai-tab-content"></div>';
    } else if (currentTab === 'study') {
      html += '<div id="ai-study-sidebar" class="ai-tab-content"></div>';
    }
    html += '<div class="ai-sidebar-footer">' + conversations.length + '/' + settings.maxConversations + '</div>';
    html += '</div>';
    sidebar.innerHTML = html;
  }

  function getConvItemHTML(conv) {
    var isActive = conv.id === currentConversationId;
    var lastMsg = '';
    if (conv.messages.length > 0) {
      var last = conv.messages[conv.messages.length - 1];
      lastMsg = last.content.replace(/[#*`\n]/g, ' ').substring(0, 40);
    }
    return '<div class="ai-conv-item' + (isActive ? ' active' : '') + '" data-action="ai:switchConv:' + conv.id + '">' +
      '<div class="ai-conv-icon">' + (conv.pinned ? '&#128204;' : '&#128172;') + '</div>' +
      '<div class="ai-conv-content">' +
      '<div class="ai-conv-title">' + Utils.sanitizeHTML(conv.title) + '</div>' +
      '<div class="ai-conv-preview">' + Utils.sanitizeHTML(lastMsg) + '</div>' +
      '</div>' +
      '<div class="ai-conv-actions">' +
      '<span class="ai-conv-time">' + formatTimeAgo(conv.createdAt) + '</span>' +
      '<button class="ai-conv-action-btn" data-action="ai:pinConv:' + conv.id + '" title="' + (conv.pinned ? 'Unpin' : 'Pin') + '">' + (conv.pinned ? '&#128204;' : '&#128278;') + '</button>' +
      '<button class="ai-conv-action-btn ai-conv-delete" data-action="ai:deleteConv:' + conv.id + '" title="Delete">&#128465;</button>' +
      '</div></div>';
  }

  function onSearchConversations(q) { sidebarSearchQuery = q; renderSidebar(); }

  function renderChat() {
    var area = document.getElementById('ai-chat-area');
    if (!area) return;
    var conv = getCurrentConversation();
    var convTitle = conv ? Utils.sanitizeHTML(conv.title) : 'AI Helper';
    var msgCount = conv ? conv.messages.length : 0;
    var html = '<div class="ai-chat-container">';
    html += '<div class="ai-chat-header">';
    html += '<button class="ai-hamburger" data-action="ai:toggleSidebar">&#9776;</button>';
    html += '<div class="ai-chat-header-info">';
    html += '<div class="ai-chat-header-avatar">&#129302;</div>';
    html += '<div><div class="ai-chat-header-title">' + convTitle + '</div>';
    html += '<div class="ai-chat-header-meta">' + msgCount + ' messages \u00B7 <span style="color:var(--accent-green)">&#9679; Online</span></div></div></div>';
    html += '<div class="ai-chat-header-actions">';
    html += '<button class="ai-header-btn" data-action="ai:exportConv" title="Export">&#128229;</button>';
    html += '<button class="ai-header-btn" data-action="ai:closeSettings" title="Settings">&#9881;</button>';
    html += '</div></div>';
    html += '<div id="ai-chat-messages" class="ai-chat-messages"></div>';
    html += '<div class="ai-chat-input-area">';
    html += '<div id="ai-prompt-chips" class="ai-prompt-chips"></div>';
    html += '<div class="ai-input-row">';
    html += '<div class="ai-input-actions">';
    html += '<button class="ai-input-action" data-action="ai:uploadImage" title="Upload image">&#128247;</button>';
    html += '<button class="ai-input-action" data-action="ai:uploadPdf" title="Upload PDF">&#128196;</button>';
    html += '<button class="ai-input-action" data-action="ai:uploadDoc" title="Upload document">&#128206;</button>';
    html += '<button class="ai-input-action" data-action="ai:voiceInput" title="Voice input">&#127908;</button>';
    html += '</div>';
    html += '<textarea id="ai-input" class="ai-input" placeholder="Message AI Helper..." rows="1" onkeydown="window.renderPage.aiHelper.handleKeyDown(event)"></textarea>';
    html += '<button class="ai-send-btn" data-action="ai:sendMessage">&#10148;</button>';
    html += '</div></div></div>';
    area.innerHTML = html;
    renderChatMessages();
    renderPromptChips();
    scrollToBottom();
    var textarea = document.getElementById('ai-input');
    if (textarea) textarea.addEventListener('input', function () { this.style.height = 'auto'; this.style.height = Math.min(this.scrollHeight, 120) + 'px'; });
  }

  function renderPromptChips() {
    var container = document.getElementById('ai-prompt-chips');
    if (!container) return;
    if (!settings.autoSuggest) { container.innerHTML = ''; return; }
    var conv = getCurrentConversation();
    if (conv && conv.messages.length > 0) { container.innerHTML = ''; return; }
    var html = '';
    for (var i = 0; i < SUGGESTED_PROMPTS.length; i++) {
      var safeChip = SUGGESTED_PROMPTS[i].replace(/'/g, "\\'");
      html += '<button class="ai-prompt-chip" data-action="ai:suggestPrompt" data-prompt="' + safeChip + '">' + SUGGESTED_PROMPTS[i] + '</button>';
    }
    container.innerHTML = html;
  }

  function renderChatMessages() {
    var container = document.getElementById('ai-chat-messages');
    if (!container) return;
    var conv = getCurrentConversation();
    if (!conv || conv.messages.length === 0) { renderWelcomeScreen(container); return; }
    var html = '';
    for (var i = 0; i < conv.messages.length; i++) {
      var msg = conv.messages[i];
      var isUser = msg.role === 'user';
      var timeStr = formatTime(msg.time);
      var contentHtml = isUser ? Utils.sanitizeHTML(msg.content) : renderMarkdown(msg.content);
      var safeContentAttr = (msg.content || '').replace(/\\/g, '\\\\').replace(/'/g, "\\'");
      if (isUser) {
        html += '<div class="ai-msg ai-msg-user">';
        html += '<div class="ai-msg-body ai-msg-user-body">' + contentHtml + '</div>';
        html += '<div class="ai-msg-avatar">&#128100;</div>';
        html += '</div>';
        html += '<div class="ai-msg-meta ai-msg-meta-right"><span>' + timeStr + '</span><button class="ai-msg-action" data-action="ai:copyMsg" data-msg-content="' + safeContentAttr + '" title="Copy">&#128203;</button></div>';
      } else {
        html += '<div class="ai-msg ai-msg-assistant">';
        html += '<div class="ai-msg-avatar ai-avatar-ai">&#129302;</div>';
        html += '<div class="ai-msg-body ai-msg-assistant-body">' + contentHtml + '</div>';
        html += '</div>';
        html += '<div class="ai-msg-meta"><span>AI Helper \u00B7 ' + timeStr + '</span>';
        html += '<button class="ai-msg-action" data-action="ai:feedback:true" data-msg-content="' + safeContentAttr + '" title="Helpful">&#128077;</button>';
        html += '<button class="ai-msg-action" data-action="ai:feedback:false" data-msg-content="' + safeContentAttr + '" title="Not helpful">&#128078;</button>';
        html += '<button class="ai-msg-action" data-action="ai:copyMsg" data-msg-content="' + safeContentAttr + '" title="Copy">&#128203;</button>';
        html += '</div>';
      }
    }
    container.innerHTML = html;
    scrollToBottom();
  }

  function renderWelcomeScreen(container) {
    var html = '<div class="ai-welcome">';
    html += '<div class="ai-welcome-avatar">&#129302;</div>';
    html += '<h2 class="ai-welcome-title">AI Helper</h2>';
    html += '<p class="ai-welcome-subtitle">Your intelligent learning assistant</p>';
    html += '<div class="ai-welcome-grid">';
    var features = [
      { icon: '&#128214;', label: 'Explain Concepts', prompt: 'Explain photosynthesis' },
      { icon: '&#128161;', label: 'Solve Problems', prompt: 'Solve this math problem' },
      { icon: '&#128203;', label: 'Study Plans', prompt: 'Create a study plan' },
      { icon: '&#9989;', label: 'Quiz Me', prompt: 'Quiz me on Science' },
      { icon: '&#128221;', label: 'Essay Help', prompt: 'Help with essay writing' },
      { icon: '&#127760;', label: 'Translate', prompt: 'Translate this to Hindi' },
      { icon: '&#127919;', label: 'Career Guidance', prompt: 'Career guidance for Class 10' },
      { icon: '&#128187;', label: 'Code Help', prompt: 'Explain functions in code' }
    ];
    for (var i = 0; i < features.length; i++) {
      var f = features[i];
      var safeP = f.prompt.replace(/'/g, "\\'");
      html += '<div class="ai-welcome-card" data-action="ai:suggestPrompt" data-prompt="' + safeP + '">';
      html += '<div class="ai-welcome-card-icon">' + f.icon + '</div>';
      html += '<div class="ai-welcome-card-label">' + f.label + '</div></div>';
    }
    html += '</div></div>';
    container.innerHTML = html;
  }

  function toggleSettings() {
    settingsPanelOpen = !settingsPanelOpen;
    var panel = document.getElementById('ai-settings-panel');
    var overlay = document.getElementById('ai-settings-overlay');
    if (panel) panel.classList.toggle('open', settingsPanelOpen);
    if (overlay) overlay.classList.toggle('active', settingsPanelOpen);
  }

  function renderSettingsPanel() {
    var existing = document.getElementById('ai-settings-panel');
    if (!existing) return;
    var html = '<div class="ai-settings-header"><h3>Settings</h3><button class="ai-settings-close" data-action="ai:closeSettings">&times;</button></div>';
    html += '<div class="ai-settings-body">';
    html += '<div class="ai-settings-group"><div class="ai-settings-label">Display</div>';
    html += '<label class="ai-settings-row"><span>Auto-suggest prompts</span><input type="checkbox" ' + (settings.autoSuggest ? 'checked' : '') + ' onchange="window.renderPage.aiHelper.updateSetting(\'autoSuggest\', this.checked)"></label>';
    html += '<label class="ai-settings-row"><span>Typing animation</span><input type="checkbox" ' + (settings.typingAnimation ? 'checked' : '') + ' onchange="window.renderPage.aiHelper.updateSetting(\'typingAnimation\', this.checked)"></label></div>';
    html += '<div class="ai-settings-group"><div class="ai-settings-label">Storage</div>';
    html += '<label class="ai-settings-row"><span>Max conversations</span><select onchange="window.renderPage.aiHelper.updateSetting(\'maxConversations\', parseInt(this.value))"><option value="20"' + (settings.maxConversations === 20 ? ' selected' : '') + '>20</option><option value="50"' + (settings.maxConversations === 50 ? ' selected' : '') + '>50</option><option value="100"' + (settings.maxConversations === 100 ? ' selected' : '') + '>100</option></select></label>';
    html += '<button class="ai-btn ai-btn-danger ai-btn-block" data-action="ai:clearChat">Clear All Conversations</button></div>';
    html += '<div class="ai-settings-group"><div class="ai-settings-label">Data</div>';
    html += '<button class="ai-btn ai-btn-secondary ai-btn-block" data-action="ai:exportConv">Export All Conversations</button></div>';
    html += '</div>';
    existing.innerHTML = html;
  }

  function updateSetting(key, value) {
    settings[key] = value;
    saveSettings();
    if (key === 'autoSuggest') renderPromptChips();
    if (key === 'maxConversations') { while (conversations.length > settings.maxConversations) conversations.pop(); saveConversations(); renderSidebar(); renderChat(); }
    showToast('Setting updated', 'green');
  }

  function clearAllConversations() {
    if (!confirm('Delete ALL conversations? This cannot be undone.')) return;
    conversations = [];
    currentConversationId = null;
    saveConversations();
    renderAll();
    showToast('All conversations cleared', 'green');
  }

  function renderFlashcardsSidebar() {
    var container = document.getElementById('ai-flashcards-sidebar');
    if (!container) return;
    updateDisplayedFlashcards();
    var html = '<div class="ai-tab-section">';
    html += '<div class="ai-tab-section-header"><button class="ai-btn ai-btn-primary ai-btn-sm ai-btn-block" data-action="ai:showFlashcardForm">+ New Card</button>';
    html += '<select class="ai-select" onchange="window.renderPage.aiHelper.setFlashcardFilter(this.value)">';
    for (var fi = 0; fi < FLASHCARD_SUBJECTS.length; fi++) {
      html += '<option value="' + FLASHCARD_SUBJECTS[fi] + '"' + (flashcardFilterSubject === FLASHCARD_SUBJECTS[fi] ? ' selected' : '') + '>' + FLASHCARD_SUBJECTS[fi] + '</option>';
    }
    html += '</select>';
    html += '<label class="ai-inline-check"><input type="checkbox" ' + (flashcardShuffled ? 'checked' : '') + ' onchange="window.renderPage.aiHelper.toggleShuffle()"> Shuffle</label></div>';
    html += '<div class="ai-tab-section-content">';
    html += '<div class="ai-fc-count">' + displayedFlashcards.length + ' cards</div>';
    for (var fi2 = 0; fi2 < displayedFlashcards.length; fi2++) {
      var card = displayedFlashcards[fi2];
      var isCurrent = fi2 === currentFlashcardIndex;
      html += '<div class="ai-fc-item' + (isCurrent ? ' active' : '') + '" data-action="ai:goToFlashcard:' + fi2 + '">';
      html += '<div class="ai-fc-item-header"><span class="ai-fc-item-term">' + Utils.sanitizeHTML(card.term) + '</span><span class="ai-fc-item-subject">' + Utils.sanitizeHTML(card.subject) + '</span></div>';
      html += '<div class="ai-fc-item-preview">' + Utils.sanitizeHTML(card.definition.slice(0, 40)) + '</div>';
      html += '<div class="ai-fc-item-actions"><button data-action="ai:toggleStar:' + card.id + '">' + (card.starred ? '&#11088;' : '&#9734;') + '</button><button data-action="ai:deleteFlashcard:' + card.id + '">&#10005;</button></div></div>';
    }
    if (displayedFlashcards.length === 0) html += '<div class="ai-empty-small">No flashcards yet</div>';
    html += '</div></div>';
    container.innerHTML = html;
  }

  function renderFlashcardViewer() {
    var container = document.getElementById('ai-right-panel');
    if (!container) return;
    updateDisplayedFlashcards();
    if (currentFlashcardIndex >= displayedFlashcards.length) currentFlashcardIndex = Math.max(0, displayedFlashcards.length - 1);
    var card = displayedFlashcards[currentFlashcardIndex];
    if (!card) { container.innerHTML = '<div class="ai-empty-center"><div style="font-size:2rem;margin-bottom:var(--space-3)">&#127183;</div><p>No flashcards to show</p><button class="ai-btn ai-btn-primary ai-btn-sm" data-action="ai:showFlashcardForm">Create one!</button></div>'; return; }
    var total = displayedFlashcards.length;
    var html = '<div class="ai-fc-viewer">';
    html += '<div class="ai-fc-viewer-header"><span>Card ' + (currentFlashcardIndex + 1) + ' of ' + total + '</span>';
    html += '<div><button data-action="ai:toggleStar:' + card.id + '">' + (card.starred ? '&#11088;' : '&#9734;') + '</button><button data-action="ai:toggleShuffle" title="Shuffle">&#128256;</button></div></div>';
    html += '<div class="ai-fc-container" data-action="ai:toggleFlashcard"><div id="flashcard-inner" class="ai-fc-inner' + (flashcardFlipped ? ' flipped' : '') + '">';
    html += '<div class="ai-fc-front"><div class="ai-fc-subject">' + Utils.sanitizeHTML(card.subject) + '</div><div class="ai-fc-term">' + Utils.sanitizeHTML(card.term) + '</div><div class="ai-fc-hint">Click to flip</div></div>';
    html += '<div class="ai-fc-back"><div class="ai-fc-subject">Definition</div><div class="ai-fc-def">' + Utils.sanitizeHTML(card.definition) + '</div></div>';
    html += '</div></div>';
    html += '<div class="ai-fc-nav"><button class="ai-btn ai-btn-secondary" data-action="ai:prevCard"' + (currentFlashcardIndex === 0 ? ' disabled' : '') + '>&#9664; Prev</button>';
    html += '<button class="ai-btn ai-btn-primary" data-action="ai:nextCard"' + (currentFlashcardIndex >= total - 1 ? ' disabled' : '') + '>Next &#9654;</button></div></div>';
    container.innerHTML = html;
  }

  function goToFlashcard(index) { currentFlashcardIndex = index; flashcardFlipped = false; renderFlashcardViewer(); renderFlashcardsSidebar(); }

  function showFlashcardForm() {
    var overlay = document.createElement('div');
    overlay.className = 'ai-modal-overlay';
    overlay.setAttribute('data-overlay', 'modal');
    overlay.onclick = function (e) { if (e.target === overlay) overlay.remove(); };
    var formHtml = '<div class="ai-modal"><h3>&#127183; New Flashcard</h3>';
    formHtml += '<div class="ai-form-group"><label>Term</label><input type="text" id="fc-term" class="ai-input"></div>';
    formHtml += '<div class="ai-form-group"><label>Definition</label><textarea id="fc-def" class="ai-input" style="min-height:80px"></textarea></div>';
    formHtml += '<div class="ai-form-group"><label>Subject</label><select id="fc-subject" class="ai-input">';
    for (var si = 0; si < FLASHCARD_SUBJECTS.length; si++) formHtml += '<option>' + FLASHCARD_SUBJECTS[si] + '</option>';
    formHtml += '</select></div>';
    formHtml += '<div class="ai-modal-actions"><button class="ai-btn ai-btn-secondary" data-action="ai:dismissForm">Cancel</button><button class="ai-btn ai-btn-primary" data-action="ai:createFlashcard">Create</button></div></div>';
    overlay.innerHTML = formHtml;
    document.body.appendChild(overlay);
    setTimeout(function () { var inp = document.getElementById('fc-term'); if (inp) inp.focus(); }, 100);
  }

  function createFlashcardFromForm() {
    var term = document.getElementById('fc-term');
    var def = document.getElementById('fc-def');
    var subject = document.getElementById('fc-subject');
    if (!term || !def || !subject) return;
    var termVal = term.value.trim();
    var defVal = def.value.trim();
    if (!termVal || !defVal) { showToast('Enter both term and definition', 'orange'); return; }
    addFlashcard(termVal, defVal, subject.value);
    var overlay = document.querySelector('[data-overlay="modal"]');
    if (overlay) overlay.remove();
  }

  function renderStudySidebar() {
    var container = document.getElementById('ai-study-sidebar');
    if (!container) return;
    var subjects = getSubjectsForClass();
    var html = '<div class="ai-tab-section"><div class="ai-tab-section-header">';
    html += '<select class="ai-select ai-select-full" onchange="window.renderPage.aiHelper.selectStudySubject(this.value)"><option value="">-- Select Subject --</option>';
    for (var si = 0; si < subjects.length; si++) {
      var progress = getSubjectProgress(subjects[si]);
      html += '<option value="' + subjects[si] + '"' + (currentStudySubject === subjects[si] ? ' selected' : '') + '>' + subjects[si] + ' (' + progress.completed + '/' + progress.total + ')</option>';
    }
    html += '</select></div>';
    html += '<div class="ai-tab-section-content">';
    if (currentStudySubject && studyData[currentStudySubject]) {
      var data = studyData[currentStudySubject];
      var topicNames = Object.keys(data.topics);
      var learned = studyLearnedTopics[currentStudySubject] || {};
      var progress = getSubjectProgress(currentStudySubject);
      html += '<div class="ai-study-progress"><div class="ai-study-progress-text">Progress: ' + progress.percent + '%</div><div class="ai-study-progress-bar"><div class="ai-study-progress-fill" style="width:' + progress.percent + '%"></div></div></div>';
      for (var ti = 0; ti < topicNames.length; ti++) {
        var tName = topicNames[ti];
        var isLearned = learned[tName];
        var isActive = currentStudyTopic === tName;
        html += '<div class="ai-study-topic' + (isActive ? ' active' : '') + '" data-action="ai:selectTopic" data-subject="' + currentStudySubject.replace(/'/g, "\\'") + '" data-topic="' + tName.replace(/'/g, "\\'") + '">';
        html += '<span>' + (isLearned ? '&#9989;' : '&#128214;') + '</span><span class="ai-study-topic-name">' + Utils.sanitizeHTML(tName) + '</span></div>';
      }
    } else {
      html += '<div class="ai-empty-small">Select a subject above</div>';
    }
    html += '</div></div>';
    container.innerHTML = html;
  }

  function selectStudySubject(subject) { currentStudySubject = subject; currentStudyTopic = ''; if (subject) initStudyData(subject); renderStudySidebar(); renderStudyRightPanel(); }
  function selectStudyTopic(subject, topic) { currentStudySubject = subject; currentStudyTopic = topic; renderStudySidebar(); renderStudyRightPanel(); }

  function renderStudyRightPanel() {
    var container = document.getElementById('ai-right-panel');
    if (!container) return;
    if (!currentStudySubject || !currentStudyTopic) { container.innerHTML = '<div class="ai-empty-center"><div style="font-size:2rem;margin-bottom:var(--space-3)">&#128218;</div><p>Select a subject and topic to start</p></div>'; return; }
    var data = studyData[currentStudySubject];
    if (!data || !data.topics[currentStudyTopic]) { container.innerHTML = '<div class="ai-empty-center"><p>Content not available</p></div>'; return; }
    var topic = data.topics[currentStudyTopic];
    var learned = studyLearnedTopics[currentStudySubject] || {};
    var isLearned = learned[currentStudyTopic];
    var minutes = Math.floor(studyTimerSeconds / 60);
    var secs = studyTimerSeconds % 60;
    var html = '<div class="ai-study-panel">';
    html += '<div class="ai-study-panel-header"><div><div class="ai-study-panel-subject">' + Utils.sanitizeHTML(currentStudySubject) + '</div><div class="ai-study-panel-topic">' + Utils.sanitizeHTML(currentStudyTopic) + '</div></div>';
    html += '<button class="ai-btn ai-btn-sm' + (isLearned ? ' ai-btn-success' : ' ai-btn-outline') + '" data-action="ai:markLearned" data-subject="' + currentStudySubject.replace(/'/g, "\\'") + '" data-topic="' + currentStudyTopic.replace(/'/g, "\\'") + '">' + (isLearned ? '&#9989; Learned' : '&#128204; Mark Learned') + '</button></div>';
    html += '<div class="ai-study-content">';
    html += '<div class="ai-study-section"><div class="ai-study-section-title ai-text-accent">&#128205; Key Points</div><ul>';
    for (var ki = 0; ki < topic.keyPoints.length; ki++) html += '<li>' + Utils.sanitizeHTML(topic.keyPoints[ki]) + '</li>';
    html += '</ul></div>';
    if (topic.formulas && topic.formulas.length > 0) {
      html += '<div class="ai-study-section"><div class="ai-study-section-title ai-text-warning">&#128208; Formulas</div>';
      for (var fi = 0; fi < topic.formulas.length; fi++) html += '<div class="ai-formula">' + Utils.sanitizeHTML(topic.formulas[fi]) + '</div>';
      html += '</div>';
    }
    if (topic.questions && topic.questions.length > 0) {
      html += '<div class="ai-study-section"><div class="ai-study-section-title ai-text-success">&#10067; Practice Questions</div>';
      for (var qi = 0; qi < topic.questions.length; qi++) html += '<div class="ai-practice-q">' + (qi + 1) + '. ' + Utils.sanitizeHTML(topic.questions[qi]) + '</div>';
      html += '</div>';
    }
    html += '</div>';
    html += '<div class="ai-study-footer"><div class="ai-study-timer">' + (minutes < 10 ? '0' : '') + minutes + ':' + (secs < 10 ? '0' : '') + secs + ' \u00B7 ' + (studySessionActive ? '&#128994; Active' : '&#9898; Inactive') + '</div>';
    html += '<div class="ai-study-actions"><button class="ai-btn ai-btn-primary ai-btn-sm" data-action="ai:startStudy">&#9654; Start</button><button class="ai-btn ai-btn-secondary ai-btn-sm" data-action="ai:endStudy">&#9632; End</button></div></div></div>';
    container.innerHTML = html;
  }

  var html = '<div class="ai-page">';
  html += '<div id="ai-overlay" class="ai-overlay"></div>';
  html += '<div id="ai-sidebar" class="ai-sidebar"></div>';
  html += '<div id="ai-chat-area" class="ai-chat-area"></div>';
  html += '<div id="ai-right-panel" class="ai-right-panel" style="display:none"></div>';
  html += '<div id="ai-settings-overlay" class="ai-overlay" data-action="ai:closeSettings"></div>';
  html += '<div id="ai-settings-panel" class="ai-settings-panel"></div>';
  html += '</div>';
  html += '<style>' +
    '.ai-page{display:flex;height:calc(100vh - 120px);overflow:hidden;position:relative}' +
    '.ai-overlay{position:fixed;inset:0;background:rgba(0,0,0,0.5);z-index:100;display:none}' +
    '.ai-overlay.active{display:block}' +
    '.ai-sidebar{width:280px;flex-shrink:0;display:flex;flex-direction:column;background:var(--bg-card);border-right:1px solid var(--border-light);overflow:hidden}' +
    '.ai-sidebar-inner{display:flex;flex-direction:column;height:100%}' +
    '.ai-sidebar-header{padding:var(--space-3);border-bottom:1px solid var(--border-light)}' +
    '.ai-new-chat-btn{width:100%;padding:10px 16px;background:var(--accent-blue);color:white;border:none;border-radius:var(--radius-md);font-size:var(--text-sm);font-weight:500;cursor:pointer;display:flex;align-items:center;justify-content:center;gap:var(--space-2)}' +
    '.ai-new-chat-btn:hover{opacity:0.9}' +
    '.ai-sidebar-tabs{display:flex;border-bottom:1px solid var(--border-light)}' +
    '.ai-sidebar-tab{flex:1;padding:8px;border:none;background:transparent;font-size:var(--text-xs);font-weight:500;cursor:pointer;color:var(--text-secondary);border-bottom:2px solid transparent}' +
    '.ai-sidebar-tab.active{color:var(--accent-blue);border-bottom-color:var(--accent-blue)}' +
    '.ai-sidebar-search{padding:var(--space-2) var(--space-3);position:relative}' +
    '.ai-search-input{width:100%;padding:6px 10px 6px 28px;background:var(--bg-tertiary);border:1px solid var(--border-light);border-radius:var(--radius-md);color:var(--text-primary);font-size:var(--text-xs);outline:none;box-sizing:border-box}' +
    '.ai-search-input:focus{border-color:var(--accent-blue)}' +
    '.ai-search-icon{position:absolute;left:20px;top:50%;transform:translateY(-50%);font-size:12px;color:var(--text-tertiary)}' +
    '.ai-chat-list{flex:1;overflow-y:auto;padding:var(--space-2)}' +
    '.ai-chat-list-label{font-size:10px;color:var(--text-tertiary);text-transform:uppercase;letter-spacing:0.5px;padding:var(--space-2) var(--space-2) var(--space-1);font-weight:600}' +
    '.ai-conv-item{display:flex;align-items:center;gap:var(--space-2);padding:var(--space-2);border-radius:var(--radius-md);cursor:pointer;transition:background 0.15s;margin-bottom:2px}' +
    '.ai-conv-item:hover{background:var(--bg-glass)}' +
    '.ai-conv-item.active{background:var(--accent-blue);color:white}' +
    '.ai-conv-icon{font-size:1rem;flex-shrink:0}' +
    '.ai-conv-content{flex:1;min-width:0}' +
    '.ai-conv-title{font-size:var(--text-xs);font-weight:500;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}' +
    '.ai-conv-preview{font-size:10px;color:var(--text-tertiary);overflow:hidden;text-overflow:ellipsis;white-space:nowrap;margin-top:2px}' +
    '.ai-conv-item.active .ai-conv-preview{color:rgba(255,255,255,0.7)}' +
    '.ai-conv-actions{display:flex;flex-direction:column;align-items:flex-end;gap:2px;flex-shrink:0}' +
    '.ai-conv-time{font-size:9px;color:var(--text-tertiary)}' +
    '.ai-conv-item.active .ai-conv-time{color:rgba(255,255,255,0.6)}' +
    '.ai-conv-action-btn{background:none;border:none;cursor:pointer;padding:0;font-size:10px;opacity:0.5;transition:opacity 0.15s}' +
    '.ai-conv-action-btn:hover{opacity:1}' +
    '.ai-conv-delete:hover{color:var(--accent-red)}' +
    '.ai-sidebar-footer{padding:var(--space-2) var(--space-3);border-top:1px solid var(--border-light);font-size:10px;color:var(--text-tertiary);text-align:center}' +
    '.ai-chat-area{flex:1;display:flex;flex-direction:column;min-width:0}' +
    '.ai-chat-container{display:flex;flex-direction:column;height:100%}' +
    '.ai-chat-header{display:flex;align-items:center;padding:var(--space-3) var(--space-4);border-bottom:1px solid var(--border-light);gap:var(--space-3);flex-shrink:0}' +
    '.ai-hamburger{display:none;background:none;border:none;font-size:1.25rem;cursor:pointer;padding:4px;color:var(--text-primary)}' +
    '.ai-chat-header-info{display:flex;align-items:center;gap:var(--space-2);flex:1}' +
    '.ai-chat-header-avatar{width:36px;height:36px;border-radius:50%;background:linear-gradient(135deg,var(--accent-blue),var(--accent-purple));display:flex;align-items:center;justify-content:center;font-size:1.1rem;flex-shrink:0}' +
    '.ai-chat-header-title{font-size:var(--text-sm);font-weight:600}' +
    '.ai-chat-header-meta{font-size:var(--text-xs);color:var(--text-secondary)}' +
    '.ai-chat-header-actions{display:flex;gap:var(--space-1)}' +
    '.ai-header-btn{background:none;border:none;padding:6px 8px;border-radius:var(--radius-sm);cursor:pointer;font-size:1rem;color:var(--text-secondary);transition:background 0.15s}' +
    '.ai-header-btn:hover{background:var(--bg-glass)}' +
    '.ai-chat-messages{flex:1;overflow-y:auto;padding:var(--space-4) var(--space-5)}' +
    '.ai-msg{display:flex;gap:var(--space-3);margin-bottom:var(--space-4);animation:fadeIn 0.3s ease}' +
    '.ai-msg-user{justify-content:flex-end}' +
    '.ai-msg-avatar{width:32px;height:32px;border-radius:50%;display:flex;align-items:center;justify-content:center;flex-shrink:0;font-size:0.9rem}' +
    '.ai-avatar-ai{background:linear-gradient(135deg,var(--accent-blue),var(--accent-purple))}' +
    '.ai-msg-body{max-width:75%;padding:10px 14px;border-radius:var(--radius-lg);font-size:var(--text-sm);line-height:1.5}' +
    '.ai-msg-user-body{background:linear-gradient(135deg,var(--accent-blue),var(--accent-purple));color:white;border-radius:var(--radius-lg) var(--radius-lg) 0 var(--radius-lg)}' +
    '.ai-msg-assistant-body{background:var(--bg-glass-strong);border-radius:var(--radius-lg) var(--radius-lg) var(--radius-lg) 0}' +
    '.ai-msg-meta{display:flex;align-items:center;gap:var(--space-2);font-size:10px;color:var(--text-tertiary);margin-bottom:var(--space-2);padding:0 4px}' +
    '.ai-msg-meta-right{justify-content:flex-end}' +
    '.ai-msg-action{background:none;border:none;cursor:pointer;font-size:12px;padding:2px 4px;opacity:0.6;transition:opacity 0.15s}' +
    '.ai-msg-action:hover{opacity:1}' +
    '.ai-typing-dots{display:flex;gap:4px;padding:4px 0}' +
    '.ai-typing-dots span{width:6px;height:6px;background:var(--text-tertiary);border-radius:50%;animation:aiTypingBounce 1.4s infinite}' +
    '.ai-typing-dots span:nth-child(2){animation-delay:0.2s}' +
    '.ai-typing-dots span:nth-child(3){animation-delay:0.4s}' +
    '@keyframes aiTypingBounce{0%,80%,100%{transform:translateY(0)}40%{transform:translateY(-6px)}}' +
    '.ai-chat-input-area{border-top:1px solid var(--border-light);padding:var(--space-3) var(--space-4);flex-shrink:0}' +
    '.ai-prompt-chips{display:flex;flex-wrap:wrap;gap:var(--space-1);margin-bottom:var(--space-2)}' +
    '.ai-prompt-chip{padding:4px 12px;background:var(--bg-glass);border:1px solid var(--border-light);border-radius:999px;font-size:var(--text-xs);cursor:pointer;color:var(--text-secondary);transition:all 0.15s}' +
    '.ai-prompt-chip:hover{background:var(--accent-blue);color:white;border-color:var(--accent-blue)}' +
    '.ai-input-row{display:flex;align-items:flex-end;gap:var(--space-2);background:var(--bg-tertiary);border:1px solid var(--border-light);border-radius:var(--radius-lg);padding:var(--space-2)}' +
    '.ai-input-row:focus-within{border-color:var(--accent-blue)}' +
    '.ai-input-actions{display:flex;gap:2px;flex-shrink:0}' +
    '.ai-input-action{background:none;border:none;padding:4px;cursor:pointer;font-size:1rem;border-radius:var(--radius-sm);color:var(--text-secondary);transition:all 0.15s}' +
    '.ai-input-action:hover{background:var(--bg-glass);color:var(--accent-blue)}' +
    '.ai-input{flex:1;border:none;background:transparent;color:var(--text-primary);font-size:var(--text-sm);resize:none;min-height:20px;max-height:120px;outline:none;font-family:inherit;padding:4px 0}' +
    '.ai-send-btn{width:36px;height:36px;border-radius:50%;background:var(--accent-blue);color:white;border:none;cursor:pointer;font-size:1rem;display:flex;align-items:center;justify-content:center;flex-shrink:0;transition:opacity 0.15s}' +
    '.ai-send-btn:hover{opacity:0.9}' +
    '.ai-right-panel{width:350px;flex-shrink:0;background:var(--bg-card);border-left:1px solid var(--border-light);display:none;flex-direction:column;overflow:hidden}' +
    '.ai-welcome{display:flex;flex-direction:column;align-items:center;justify-content:center;padding:2rem;min-height:100%;text-align:center}' +
    '.ai-welcome-avatar{font-size:3rem;margin-bottom:var(--space-4)}' +
    '.ai-welcome-title{font-size:var(--text-xl);font-weight:700;margin-bottom:var(--space-2)}' +
    '.ai-welcome-subtitle{color:var(--text-secondary);font-size:var(--text-sm);margin-bottom:var(--space-6)}' +
    '.ai-welcome-grid{display:grid;grid-template-columns:repeat(4,1fr);gap:var(--space-3);max-width:500px;width:100%}' +
    '.ai-welcome-card{padding:var(--space-3);background:var(--bg-glass);border:1px solid var(--border-light);border-radius:var(--radius-md);cursor:pointer;transition:all 0.2s;text-align:center}' +
    '.ai-welcome-card:hover{background:var(--accent-blue);color:white;border-color:var(--accent-blue);transform:translateY(-2px)}' +
    '.ai-welcome-card-icon{font-size:1.5rem;margin-bottom:var(--space-1)}' +
    '.ai-welcome-card-label{font-size:var(--text-xs);font-weight:500}' +
    '.ai-modal-overlay{position:fixed;inset:0;background:rgba(0,0,0,0.5);z-index:1000;display:flex;align-items:center;justify-content:center;animation:fadeIn 0.2s ease}' +
    '.ai-modal{background:var(--bg-card);border:1px solid var(--border-light);border-radius:var(--radius-lg);padding:var(--space-5);max-width:420px;width:90%;box-shadow:0 20px 60px rgba(0,0,0,0.3)}' +
    '.ai-modal h3{margin:0 0 var(--space-4);font-size:var(--text-base);font-weight:600}' +
    '.ai-form-group{margin-bottom:var(--space-3)}' +
    '.ai-form-group label{display:block;font-size:var(--text-xs);font-weight:500;color:var(--text-secondary);margin-bottom:4px}' +
    '.ai-modal-actions{display:flex;justify-content:flex-end;gap:var(--space-2);margin-top:var(--space-4)}' +
    '.ai-input,.ai-select{width:100%;padding:8px 12px;background:var(--bg-tertiary);border:1px solid var(--border-light);border-radius:var(--radius-md);color:var(--text-primary);font-size:var(--text-sm);outline:none;box-sizing:border-box}' +
    '.ai-input:focus,.ai-select:focus{border-color:var(--accent-blue)}' +
    '.ai-select-full{width:100%}' +
    '.ai-inline-check{display:flex;align-items:center;gap:var(--space-1);font-size:var(--text-xs);color:var(--text-secondary)}' +
    '.ai-btn{padding:6px 14px;border:none;border-radius:var(--radius-md);font-size:var(--text-xs);font-weight:500;cursor:pointer;transition:all 0.15s}' +
    '.ai-btn-primary{background:var(--accent-blue);color:white}' +
    '.ai-btn-secondary{background:var(--bg-glass);color:var(--text-primary);border:1px solid var(--border-light)}' +
    '.ai-btn-danger{background:var(--accent-red);color:white}' +
    '.ai-btn-success{background:var(--accent-green);color:white}' +
    '.ai-btn-outline{background:transparent;color:var(--text-primary);border:1px solid var(--border-light)}' +
    '.ai-btn-block{width:100%}' +
    '.ai-btn-sm{padding:4px 10px;font-size:10px}' +
    '.ai-btn:disabled{opacity:0.4;cursor:not-allowed}' +
    '.ai-tab-content{flex:1;overflow-y:auto}' +
    '.ai-tab-section{padding:var(--space-3)}' +
    '.ai-tab-section-header{display:flex;flex-direction:column;gap:var(--space-2);margin-bottom:var(--space-3)}' +
    '.ai-tab-section-content{overflow-y:auto}' +
    '.ai-fc-count{font-size:10px;color:var(--text-tertiary);margin-bottom:var(--space-2)}' +
    '.ai-fc-item{padding:var(--space-2);border:1px solid var(--border-light);border-radius:var(--radius-md);margin-bottom:var(--space-1);cursor:pointer;transition:all 0.15s}' +
    '.ai-fc-item:hover{background:var(--bg-glass)}' +
    '.ai-fc-item.active{border-color:var(--accent-blue);background:rgba(59,130,246,0.06)}' +
    '.ai-fc-item-header{display:flex;align-items:center;justify-content:space-between}' +
    '.ai-fc-item-term{font-size:var(--text-xs);font-weight:500}' +
    '.ai-fc-item-subject{font-size:9px;color:var(--text-tertiary);background:var(--bg-glass);padding:1px 6px;border-radius:var(--radius-sm)}' +
    '.ai-fc-item-preview{font-size:10px;color:var(--text-secondary);margin-top:2px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}' +
    '.ai-fc-item-actions{display:flex;gap:var(--space-1);margin-top:4px}' +
    '.ai-fc-item-actions button{background:none;border:none;cursor:pointer;font-size:10px;padding:2px 4px}' +
    '.ai-fc-viewer{display:flex;flex-direction:column;height:100%;padding:var(--space-4)}' +
    '.ai-fc-viewer-header{display:flex;justify-content:space-between;align-items:center;margin-bottom:var(--space-3);font-size:var(--text-xs);color:var(--text-tertiary)}' +
    '.ai-fc-viewer-header div{display:flex;gap:var(--space-1)}' +
    '.ai-fc-viewer-header button{background:none;border:none;cursor:pointer;font-size:1rem}' +
    '.ai-fc-container{flex:1;display:flex;align-items:center;justify-content:center;perspective:1000px;cursor:pointer}' +
    '.ai-fc-inner{width:100%;max-width:300px;height:200px;position:relative;transform-style:preserve-3d;transition:transform 0.6s}' +
    '.ai-fc-inner.flipped{transform:rotateY(180deg)}' +
    '.ai-fc-front,.ai-fc-back{position:absolute;inset:0;backface-visibility:hidden;background:var(--bg-glass-strong);border:1px solid var(--border-light);border-radius:var(--radius-lg);display:flex;flex-direction:column;align-items:center;justify-content:center;padding:var(--space-4);text-align:center}' +
    '.ai-fc-back{transform:rotateY(180deg)}' +
    '.ai-fc-subject{font-size:10px;color:var(--text-tertiary);background:var(--bg-glass);padding:2px 8px;border-radius:999px;margin-bottom:var(--space-2)}' +
    '.ai-fc-term{font-size:var(--text-lg);font-weight:600;line-height:1.4}' +
    '.ai-fc-def{font-size:var(--text-sm);line-height:1.5;overflow-y:auto}' +
    '.ai-fc-hint{font-size:10px;color:var(--text-tertiary);margin-top:var(--space-3)}' +
    '.ai-fc-nav{display:flex;justify-content:space-between;margin-top:var(--space-3)}' +
    '.ai-study-progress{margin-bottom:var(--space-3)}' +
    '.ai-study-progress-text{font-size:10px;color:var(--text-tertiary);margin-bottom:4px}' +
    '.ai-study-progress-bar{height:4px;background:var(--bg-tertiary);border-radius:4px;overflow:hidden}' +
    '.ai-study-progress-fill{height:100%;background:var(--accent-green);border-radius:4px;transition:width 0.3s}' +
    '.ai-study-topic{display:flex;align-items:center;gap:var(--space-2);padding:var(--space-2);border-radius:var(--radius-md);cursor:pointer;transition:background 0.15s;font-size:var(--text-xs)}' +
    '.ai-study-topic:hover{background:var(--bg-glass)}' +
    '.ai-study-topic.active{background:rgba(59,130,246,0.06);border:1px solid var(--accent-blue)}' +
    '.ai-study-topic-name{flex:1;font-weight:500}' +
    '.ai-study-panel{display:flex;flex-direction:column;height:100%;padding:var(--space-4)}' +
    '.ai-study-panel-header{display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:var(--space-3)}' +
    '.ai-study-panel-subject{font-size:10px;color:var(--text-tertiary)}' +
    '.ai-study-panel-topic{font-size:var(--text-sm);font-weight:600}' +
    '.ai-study-content{flex:1;overflow-y:auto}' +
    '.ai-study-section{margin-bottom:var(--space-4)}' +
    '.ai-study-section-title{font-size:var(--text-xs);font-weight:600;margin-bottom:var(--space-2)}' +
    '.ai-study-section ul{padding-left:16px;margin:0}' +
    '.ai-study-section li{font-size:var(--text-xs);margin-bottom:4px;line-height:1.4}' +
    '.ai-formula{background:var(--bg-glass-strong);padding:6px 12px;border-radius:var(--radius-md);margin-bottom:4px;font-size:var(--text-xs);text-align:center;font-family:monospace}' +
    '.ai-practice-q{background:var(--bg-glass);padding:6px 12px;border-radius:var(--radius-md);margin-bottom:4px;font-size:var(--text-xs)}' +
    '.ai-study-footer{border-top:1px solid var(--border-light);padding-top:var(--space-3);margin-top:auto}' +
    '.ai-study-timer{font-size:var(--text-xs);color:var(--text-tertiary);margin-bottom:var(--space-2)}' +
    '.ai-study-actions{display:flex;gap:var(--space-2)}' +
    '.ai-settings-panel{position:fixed;top:0;right:-320px;width:300px;height:100%;background:var(--bg-card);border-left:1px solid var(--border-light);z-index:201;transition:right 0.3s;display:flex;flex-direction:column;box-shadow:-4px 0 12px rgba(0,0,0,0.1)}' +
    '.ai-settings-panel.open{right:0}' +
    '.ai-settings-header{display:flex;align-items:center;justify-content:space-between;padding:var(--space-4);border-bottom:1px solid var(--border-light)}' +
    '.ai-settings-header h3{margin:0;font-size:var(--text-sm);font-weight:600}' +
    '.ai-settings-close{background:none;border:none;font-size:1.25rem;cursor:pointer;color:var(--text-secondary)}' +
    '.ai-settings-body{flex:1;overflow-y:auto;padding:var(--space-4)}' +
    '.ai-settings-group{margin-bottom:var(--space-4)}' +
    '.ai-settings-label{font-size:var(--text-xs);font-weight:600;color:var(--text-secondary);text-transform:uppercase;letter-spacing:0.5px;margin-bottom:var(--space-2)}' +
    '.ai-settings-row{display:flex;align-items:center;justify-content:space-between;padding:var(--space-2) 0;font-size:var(--text-xs)}' +
    '.ai-settings-row input[type="checkbox"]{accent-color:var(--accent-blue)}' +
    '.ai-settings-row select{padding:2px 4px;background:var(--bg-tertiary);border:1px solid var(--border-light);border-radius:var(--radius-sm);color:var(--text-primary);font-size:var(--text-xs)}' +
    '.ai-empty-state{font-size:var(--text-xs);color:var(--text-tertiary);text-align:center;padding:var(--space-6)}' +
    '.ai-empty-small{font-size:var(--text-xs);color:var(--text-tertiary);text-align:center;padding:var(--space-4)}' +
    '.ai-empty-center{display:flex;flex-direction:column;align-items:center;justify-content:center;height:100%;text-align:center;padding:2rem;color:var(--text-secondary);font-size:var(--text-sm)}' +
    '.ai-text-accent{color:var(--accent-blue)}' +
    '.ai-text-warning{color:#f59e0b}' +
    '.ai-text-success{color:var(--accent-green)}' +
    '.ai-toast{position:fixed;bottom:80px;left:50%;transform:translateX(-50%);color:white;padding:8px 16px;border-radius:var(--radius-md);font-size:var(--text-sm);z-index:9999;animation:fadeIn 0.3s ease;box-shadow:0 4px 12px rgba(0,0,0,0.3)}' +
    '@media(max-width:768px){.ai-sidebar{position:fixed;top:0;left:0;bottom:0;z-index:100;width:280px;transform:translateX(-100%);transition:transform 0.3s}.ai-sidebar.open{transform:translateX(0)}.ai-hamburger{display:block!important}.ai-right-panel{display:none!important}.ai-welcome-grid{grid-template-columns:repeat(2,1fr)}}' +
    '@media(min-width:769px){.ai-hamburger{display:none!important}.ai-overlay{display:none!important}}' +
    '</style>';

  mainContent.innerHTML = html;

  window.renderPage.aiHelper.sendMessage = sendMessage;
  window.renderPage.aiHelper.handleKeyDown = handleKeyDown;
  window.renderPage.aiHelper.newConversation = newConversation;
  window.renderPage.aiHelper.switchConversation = switchConversation;
  window.renderPage.aiHelper.deleteConversation = deleteConversation;
  window.renderPage.aiHelper.selectPrompt = selectPrompt;
  window.renderPage.aiHelper.copyMessage = copyMessage;
  window.renderPage.aiHelper.exportConversation = exportAllConversations;
  window.renderPage.aiHelper.exportAllConversations = exportAllConversations;
  window.renderPage.aiHelper.toggleMobileSidebar = toggleMobileSidebar;
  window.renderPage.aiHelper.toggleSettings = toggleSettings;
  window.renderPage.aiHelper.updateSetting = updateSetting;
  window.renderPage.aiHelper.clearAllConversations = clearAllConversations;
  window.renderPage.aiHelper.setTab = setTab;
  window.renderPage.aiHelper.onSearchConversations = onSearchConversations;
  window.renderPage.aiHelper.startRename = function() {};
  window.renderPage.aiHelper.submitFeedback = submitFeedback;
  window.renderPage.aiHelper.togglePinConversation = togglePinConversation;
  window.renderPage.aiHelper.flipCard = flipCard;
  window.renderPage.aiHelper.nextCard = nextCard;
  window.renderPage.aiHelper.prevCard = prevCard;
  window.renderPage.aiHelper.setFlashcardFilter = setFlashcardFilter;
  window.renderPage.aiHelper.toggleShuffle = toggleShuffle;
  window.renderPage.aiHelper.toggleStarFlashcard = toggleStarFlashcard;
  window.renderPage.aiHelper.deleteFlashcard = deleteFlashcard;
  window.renderPage.aiHelper.addFlashcard = addFlashcard;
  window.renderPage.aiHelper.goToFlashcard = goToFlashcard;
  window.renderPage.aiHelper.showFlashcardForm = showFlashcardForm;
  window.renderPage.aiHelper.createFlashcardFromForm = createFlashcardFromForm;
  window.renderPage.aiHelper.selectStudySubject = selectStudySubject;
  window.renderPage.aiHelper.selectStudyTopic = selectStudyTopic;
  window.renderPage.aiHelper.startStudySession = startStudySession;
  window.renderPage.aiHelper.endStudySession = endStudySession;
  window.renderPage.aiHelper.markTopicLearned = markTopicLearned;

  if (conversations.length > 0) { currentConversationId = conversations[0].id; }
  else { newConversation(); }
  renderAll();
};
