window.renderPage = window.renderPage || {};

var _U = window.Utils;
var _MD = window.mockData;
var _Store = window.Store;

/* ============================================================
   LEARNING PATHS DATA
   ============================================================ */
var LP_MOCK_PATHS = [
  {
    id: 'lp1', uid: 'LP001', title: 'Mathematics Mastery', description: 'Complete journey through algebra, geometry, trigonometry and calculus fundamentals.',
    subject_id: 1, subject_name: 'Mathematics', grade_level: '10', difficulty: 'Medium', estimated_duration_days: 45, total_steps: 8, icon: '\uD83E\uDDEE', color: '#3b82f6',
    steps: [
      { uid: 'LPS001', title: 'Number Systems & Real Numbers', description: 'Rational, irrational, real numbers and their properties', step_order: 1, content_type: 'lesson', estimated_minutes: 45, is_optional: false },
      { uid: 'LPS002', title: 'Polynomials & Factorization', description: 'Polynomial operations, zeros, and factor theorem', step_order: 2, content_type: 'lesson', estimated_minutes: 60, is_optional: false },
      { uid: 'LPS003', title: 'Linear Equations in Two Variables', description: 'Graphing, solving systems, and real-world applications', step_order: 3, content_type: 'video', estimated_minutes: 30, is_optional: false },
      { uid: 'LPS004', title: 'Quadratic Equations', description: 'Solving by factoring, completing the square, and quadratic formula', step_order: 4, content_type: 'lesson', estimated_minutes: 55, is_optional: false },
      { uid: 'LPS005', title: 'Arithmetic Progressions', description: 'Sequences, series, and AP formulas', step_order: 5, content_type: 'lesson', estimated_minutes: 40, is_optional: false },
      { uid: 'LPS006', title: 'Coordinate Geometry', description: 'Distance formula, section formula, and area of triangles', step_order: 6, content_type: 'lesson', estimated_minutes: 50, is_optional: false },
      { uid: 'LPS007', title: 'Practice Test - Algebra', description: 'Comprehensive test covering algebraic concepts', step_order: 7, content_type: 'quiz', estimated_minutes: 60, is_optional: false },
      { uid: 'LPS008', title: 'Challenge Problems', description: 'Advanced problems for competitive exam preparation', step_order: 8, content_type: 'exam', estimated_minutes: 90, is_optional: true }
    ]
  },
  {
    id: 'lp2', uid: 'LP002', title: 'Science Explorer', description: 'Explore physics, chemistry and biology concepts through engaging lessons and experiments.',
    subject_id: 2, subject_name: 'Science', grade_level: '10', difficulty: 'Easy', estimated_duration_days: 30, total_steps: 6, icon: '\uD83D\uDD2C', color: '#10b981',
    steps: [
      { uid: 'LPS009', title: 'Chemical Reactions & Equations', description: 'Types of reactions, balancing equations, and indicators', step_order: 1, content_type: 'lesson', estimated_minutes: 50, is_optional: false },
      { uid: 'LPS010', title: 'Acids, Bases & Salts', description: 'pH scale, neutralization, and common salts', step_order: 2, content_type: 'lesson', estimated_minutes: 45, is_optional: false },
      { uid: 'LPS011', title: 'Life Processes', description: 'Nutrition, respiration, transportation in living organisms', step_order: 3, content_type: 'video', estimated_minutes: 35, is_optional: false },
      { uid: 'LPS012', title: 'Light - Reflection & Refraction', description: 'Mirror formulas, lens formula, and ray diagrams', step_order: 4, content_type: 'lesson', estimated_minutes: 55, is_optional: false },
      { uid: 'LPS013', title: 'Virtual Lab: Chemical Reactions', description: 'Simulate and observe different types of chemical reactions', step_order: 5, content_type: 'lab', estimated_minutes: 40, is_optional: false },
      { uid: 'LPS014', title: 'Science Assessment', description: 'Test your understanding of all science topics', step_order: 6, content_type: 'quiz', estimated_minutes: 45, is_optional: false }
    ]
  },
  {
    id: 'lp3', uid: 'LP003', title: 'English Literature Journey', description: 'Master prose, poetry, and writing skills. Analyze literature and develop critical thinking.',
    subject_id: 3, subject_name: 'English', grade_level: '10', difficulty: 'Easy', estimated_duration_days: 25, total_steps: 6, icon: '\uD83D\uDCDA', color: '#8b5cf6',
    steps: [
      { uid: 'LPS015', title: 'Prose: First Flight Chapter Study', description: 'In-depth study of prescribed prose chapters with analysis', step_order: 1, content_type: 'lesson', estimated_minutes: 50, is_optional: false },
      { uid: 'LPS016', title: 'Poetry: Figures of Speech', description: 'Metaphor, simile, alliteration, and poem analysis', step_order: 2, content_type: 'lesson', estimated_minutes: 40, is_optional: false },
      { uid: 'LPS017', title: 'Grammar: Tenses & Voice', description: 'Active-passive voice, reported speech, and tense usage', step_order: 3, content_type: 'lesson', estimated_minutes: 35, is_optional: false },
      { uid: 'LPS018', title: 'Writing Skills: Letter & Essay', description: 'Formal/informal letters, essays, and paragraph writing', step_order: 4, content_type: 'resource', estimated_minutes: 45, is_optional: false },
      { uid: 'LPS019', title: 'Literature Analysis Practice', description: 'Practice analyzing extracts and answering literature questions', step_order: 5, content_type: 'quiz', estimated_minutes: 30, is_optional: false },
      { uid: 'LPS020', title: 'Creative Writing Workshop', description: 'Write a short story or poem using literary techniques learned', step_order: 6, content_type: 'exam', estimated_minutes: 60, is_optional: true }
    ]
  },
  {
    id: 'lp4', uid: 'LP004', title: 'Social Studies Complete', description: 'History, geography, economics and civics covered comprehensively for board exam preparation.',
    subject_id: 4, subject_name: 'Social Studies', grade_level: '10', difficulty: 'Medium', estimated_duration_days: 35, total_steps: 7, icon: '\uD83C\uDF0D', color: '#f59e0b',
    steps: [
      { uid: 'LPS021', title: 'Nationalism in India', description: 'Freedom movement, non-cooperation, and civil disobedience', step_order: 1, content_type: 'lesson', estimated_minutes: 55, is_optional: false },
      { uid: 'LPS022', title: 'Resources & Development', description: 'Types of resources, land use, and sustainable development', step_order: 2, content_type: 'lesson', estimated_minutes: 45, is_optional: false },
      { uid: 'LPS023', title: 'Indian Economy', description: 'Money, banking, globalization, and consumer awareness', step_order: 3, content_type: 'video', estimated_minutes: 30, is_optional: false },
      { uid: 'LPS024', title: 'Power Sharing & Federalism', description: 'Democracy, power division, and Indian federal system', step_order: 4, content_type: 'lesson', estimated_minutes: 40, is_optional: false },
      { uid: 'LPS025', title: 'Map Skills Practice', description: 'Identify and mark important locations on India and world maps', step_order: 5, content_type: 'lab', estimated_minutes: 35, is_optional: false },
      { uid: 'LPS026', title: 'Previous Year Questions', description: 'Solve board exam questions from the last 5 years', step_order: 6, content_type: 'quiz', estimated_minutes: 60, is_optional: false },
      { uid: 'LPS027', title: 'Essay Writing Practice', description: 'Write structured essays on historical and geographical topics', step_order: 7, content_type: 'exam', estimated_minutes: 45, is_optional: true }
    ]
  },
  {
    id: 'lp5', uid: 'LP005', title: 'Hindi Sahitya Path', description: 'Hindi grammar, prose, poetry and writing skills for comprehensive language mastery.',
    subject_id: 5, subject_name: 'Hindi', grade_level: '10', difficulty: 'Easy', estimated_duration_days: 20, total_steps: 5, icon: '\uD83C\uDF38', color: '#ef4444',
    steps: [
      { uid: 'LPS028', title: 'Vyakaran: Samas & Sandhi', description: 'Compound words, joining rules, and usage in sentences', step_order: 1, content_type: 'lesson', estimated_minutes: 40, is_optional: false },
      { uid: 'LPS029', title: 'Gadya: Kshitij Prose Chapters', description: 'Detailed study of prescribed Hindi prose chapters', step_order: 2, content_type: 'lesson', estimated_minutes: 50, is_optional: false },
      { uid: 'LPS030', title: 'Padya: Hindi Poetry Analysis', description: 'Understand poetic devices and themes in Hindi poetry', step_order: 3, content_type: 'video', estimated_minutes: 35, is_optional: false },
      { uid: 'LPS031', title: 'Patra & Nibandh Lekhan', description: 'Letter writing, essay composition, and paragraph construction', step_order: 4, content_type: 'resource', estimated_minutes: 45, is_optional: false },
      { uid: 'LPS032', title: 'Hindi Practice Test', description: 'Comprehensive test on grammar and literature', step_order: 5, content_type: 'quiz', estimated_minutes: 40, is_optional: false }
    ]
  },
  {
    id: 'lp6', uid: 'LP006', title: 'Computer Science Foundations', description: 'Learn Python programming, data structures, and computational thinking from scratch.',
    subject_id: 6, subject_name: 'Computer Science', grade_level: '11', difficulty: 'Medium', estimated_duration_days: 40, total_steps: 8, icon: '\uD83D\uDCBB', color: '#06b6d4',
    steps: [
      { uid: 'LPS033', title: 'Introduction to Python', description: 'Variables, data types, input/output, and basic operators', step_order: 1, content_type: 'lesson', estimated_minutes: 45, is_optional: false },
      { uid: 'LPS034', title: 'Control Flow', description: 'If-else statements, loops (for, while), and nested conditions', step_order: 2, content_type: 'lesson', estimated_minutes: 50, is_optional: false },
      { uid: 'LPS035', title: 'Functions & Modules', description: 'Defining functions, parameters, return values, and imports', step_order: 3, content_type: 'video', estimated_minutes: 35, is_optional: false },
      { uid: 'LPS036', title: 'Data Structures: Lists & Tuples', description: 'Creating, accessing, and manipulating lists and tuples', step_order: 4, content_type: 'lesson', estimated_minutes: 55, is_optional: false },
      { uid: 'LPS037', title: 'Data Structures: Dictionaries & Sets', description: 'Key-value pairs, set operations, and practical applications', step_order: 5, content_type: 'lesson', estimated_minutes: 50, is_optional: false },
      { uid: 'LPS038', title: 'File Handling', description: 'Reading/writing files, exception handling, and context managers', step_order: 6, content_type: 'lesson', estimated_minutes: 45, is_optional: false },
      { uid: 'LPS039', title: 'Coding Practice Lab', description: 'Hands-on coding exercises with auto-evaluation', step_order: 7, content_type: 'lab', estimated_minutes: 60, is_optional: false },
      { uid: 'LPS040', title: 'Python Programming Exam', description: 'Timed programming assessment with multiple problems', step_order: 8, content_type: 'exam', estimated_minutes: 90, is_optional: false }
    ]
  },
  {
    id: 'lp7', uid: 'LP007', title: 'Physics Fundamentals', description: 'Master mechanics, waves, optics and electromagnetism with conceptual clarity and problem solving.',
    subject_id: 7, subject_name: 'Physics', grade_level: '11', difficulty: 'Hard', estimated_duration_days: 50, total_steps: 7, icon: '\u269B\uFE0F', color: '#ec4899',
    steps: [
      { uid: 'LPS041', title: 'Units & Measurements', description: 'SI units, dimensional analysis, and error measurement', step_order: 1, content_type: 'lesson', estimated_minutes: 40, is_optional: false },
      { uid: 'LPS042', title: 'Motion in a Straight Line', description: 'Distance, displacement, velocity, acceleration, and graphs', step_order: 2, content_type: 'lesson', estimated_minutes: 55, is_optional: false },
      { uid: 'LPS043', title: 'Laws of Motion', description: 'Newton\'s laws, friction, momentum, and applications', step_order: 3, content_type: 'video', estimated_minutes: 40, is_optional: false },
      { uid: 'LPS044', title: 'Work, Energy & Power', description: 'Work-energy theorem, conservation of energy, and power', step_order: 4, content_type: 'lesson', estimated_minutes: 50, is_optional: false },
      { uid: 'LPS045', title: 'Rotational Motion', description: 'Moment of inertia, torque, angular momentum', step_order: 5, content_type: 'lesson', estimated_minutes: 60, is_optional: false },
      { uid: 'LPS046', title: 'Physics Virtual Lab', description: 'Simulate Newton\'s laws and energy conservation experiments', step_order: 6, content_type: 'lab', estimated_minutes: 45, is_optional: false },
      { uid: 'LPS047', title: 'Problem Solving Marathon', description: 'Intensive problem-solving session with past year questions', step_order: 7, content_type: 'exam', estimated_minutes: 120, is_optional: false }
    ]
  },
  {
    id: 'lp8', uid: 'LP008', title: 'Chemistry Essentials', description: 'Understand atomic structure, chemical bonding, reactions and organic chemistry fundamentals.',
    subject_id: 8, subject_name: 'Chemistry', grade_level: '11', difficulty: 'Medium', estimated_duration_days: 40, total_steps: 7, icon: '\u2697\uFE0F', color: '#14b8a6',
    steps: [
      { uid: 'LPS048', title: 'Some Basic Concepts of Chemistry', description: 'Mole concept, stoichiometry, and chemical calculations', step_order: 1, content_type: 'lesson', estimated_minutes: 50, is_optional: false },
      { uid: 'LPS049', title: 'Structure of Atom', description: 'Bohr model, quantum numbers, and electronic configuration', step_order: 2, content_type: 'lesson', estimated_minutes: 55, is_optional: false },
      { uid: 'LPS050', title: 'Classification of Elements', description: 'Periodic table, periodic properties, and trends', step_order: 3, content_type: 'video', estimated_minutes: 35, is_optional: false },
      { uid: 'LPS051', title: 'Chemical Bonding', description: 'Ionic, covalent, coordinate bonds and molecular geometry', step_order: 4, content_type: 'lesson', estimated_minutes: 50, is_optional: false },
      { uid: 'LPS052', title: 'States of Matter', description: 'Gases, liquids, solids, and intermolecular forces', step_order: 5, content_type: 'lesson', estimated_minutes: 40, is_optional: false },
      { uid: 'LPS053', title: 'Chemistry Lab Simulations', description: 'Virtual experiments on titration, crystallization, and more', step_order: 6, content_type: 'lab', estimated_minutes: 50, is_optional: false },
      { uid: 'LPS054', title: 'Chemistry Assessment', description: 'Comprehensive test covering physical and inorganic chemistry', step_order: 7, content_type: 'quiz', estimated_minutes: 60, is_optional: false }
    ]
  }
];

/* ============================================================
   STATE MANAGEMENT
   ============================================================ */
function lrGetState() {
  return _Store.get('learningRoute') || { completed: {}, inProgress: {}, currentLesson: null, currentSubject: null };
}

function lrSetState(state) {
  _Store.set('learningRoute', state);
}

function lpGetState() {
  return _Store.get('learningPaths') || { enrolled: {}, completedSteps: {}, currentTab: 'browse', filters: {} };
}

function lpSetState(state) {
  _Store.set('learningPaths', state);
}

/* ============================================================
   DELEGATED EVENT HANDLER (lr: prefix)
   ============================================================ */
if (!window._lrDelegate) {
  window._lrDelegate = true;
  document.addEventListener('click', function(e) {
    var t = e.target.closest('[data-action^="lr:"]');
    if (!t) return;
    var p = t.getAttribute('data-action').split(':');
    var c = p[1], a = p[2], b = p[3], d = p[4];
    if (c === 'showTab' && a) { lrShowTab(a); }
    if (c === 'selectSubject' && a) { lrSelectSubject(a); }
    if (c === 'startLesson' && a && b !== undefined) { lrStartLesson(a, parseInt(b, 10)); }
    if (c === 'nextLesson') { lrNextLesson(); }
    if (c === 'prevLesson') { lrPrevLesson(); }
    if (c === 'markComplete' && a && b !== undefined) { lrMarkAndRefresh(a, parseInt(b, 10)); }
    if (c === 'back') { window.Router.navigate('/learning-route'); }
    if (c === 'closeModal') { lrCloseModal(); }
    if (c === 'resource' && a && b) { window.Router.navigate('/subject/' + a); }
    if (c === 'viewPath' && a) { lrViewPath(a); }
    if (c === 'enroll' && a) { lrEnroll(a); }
    if (c === 'completeStep' && a && b !== undefined) { lrCompleteLPStep(a, parseInt(b, 10)); }
    if (c === 'filterSubject' && a) { lrFilterSubject(a); }
    if (c === 'filterDifficulty' && a) { lrFilterDifficulty(a); }
    if (c === 'filterGrade' && a) { lrFilterGrade(a); }
    if (c === 'clearFilters') { lrClearFilters(); }
  });
}

/* ============================================================
   SUBJECT PROGRESS HELPERS
   ============================================================ */
function lrIsLessonComplete(subjectId, chapterIdx) {
  var state = lrGetState();
  return !!(state.completed && state.completed[subjectId + '_' + chapterIdx]);
}

function lrGetSubjectProgress(subjectId) {
  var chapters = _MD.chapters[subjectId] || [];
  var total = chapters.length;
  var done = 0;
  for (var i = 0; i < total; i++) {
    if (lrIsLessonComplete(subjectId, i)) done++;
  }
  return { done: done, total: total, pct: total > 0 ? Math.round((done / total) * 100) : 0 };
}

function lrGetLessonStatus(subjectId, chapterIdx, chapters) {
  if (lrIsLessonComplete(subjectId, chapterIdx)) return 'complete';
  var state = lrGetState();
  if (state.inProgress && state.inProgress[subjectId] === chapterIdx) return 'current';
  if (chapterIdx === 0) return 'available';
  for (var i = 0; i < chapterIdx; i++) {
    if (lrIsLessonComplete(subjectId, i)) return 'available';
  }
  return 'locked';
}

function lrGetLessonDifficulties(chapters) {
  var d = [];
  for (var i = 0; i < chapters.length; i++) {
    if (i < chapters.length * 0.3) d.push('Easy');
    else if (i < chapters.length * 0.7) d.push('Medium');
    else d.push('Hard');
  }
  return d;
}

/* ============================================================
   AI SUGGESTION GENERATORS
   ============================================================ */
function lrGenSubjectSuggestion(subject) {
  var progress = lrGetSubjectProgress(subject.id);
  if (progress.pct === 0) {
    return 'Welcome to ' + subject.name + '! Let us begin your learning journey. Start with Lesson 1 and work your way through each topic systematically.';
  }
  if (progress.pct < 30) {
    return 'You have just started ' + subject.name + '. Focus on building a strong foundation by completing each lesson carefully. Remember, consistency is key!';
  }
  if (progress.pct < 70) {
    return 'Excellent progress in ' + subject.name + '! You are over ' + progress.pct + '% through. Keep pushing forward and make sure to practice questions for each lesson.';
  }
  if (progress.pct < 100) {
    return 'Almost there! You are ' + progress.pct + '% complete in ' + subject.name + '. Finish the remaining ' + (progress.total - progress.done) + ' lesson(s) to complete this subject.';
  }
  return 'Congratulations! You have completed all lessons in ' + subject.name + '! Consider revising key topics before your exams.';
}

function lrGenLessonSuggestion(chapter, subject, chapterIdx, totalChapters) {
  var status = 'new';
  if (lrIsLessonComplete(subject.id, chapterIdx)) status = 'complete';
  else if (chapterIdx === 0 || lrIsLessonComplete(subject.id, chapterIdx - 1)) status = 'recommended';
  var map = {
    'new': 'Start this lesson by going through the Quick Notes, then watch the video. Follow up with textbook reading and practice questions.',
    'recommended': 'This is the recommended next lesson. Begin with Quick Notes, move to the textbook section, then test your understanding with the quiz.',
    'complete': 'You have completed this lesson! Consider revising the notes or attempting the mock test to reinforce your learning.'
  };
  return map[status] || map['new'];
}

/* ============================================================
   LEARNING PATHS HELPERS
   ============================================================ */
function lpGetEnrolledPaths() {
  var state = lpGetState();
  var enrolled = [];
  for (var key in state.enrolled) {
    if (!state.enrolled.hasOwnProperty(key)) continue;
    var path = null;
    for (var i = 0; i < LP_MOCK_PATHS.length; i++) {
      if (LP_MOCK_PATHS[i].id === key) { path = LP_MOCK_PATHS[i]; break; }
    }
    if (path) {
      var enr = state.enrolled[key];
      var completedCount = 0;
      for (var j = 0; j < path.steps.length; j++) {
        if (state.completedSteps[key + '_step_' + path.steps[j].step_order]) completedCount++;
      }
      enrolled.push({
        path: path, enrolled_at: enr.enrolled_at,
        completed_steps: completedCount, total_steps: path.steps.length,
        progress: path.steps.length > 0 ? Math.round((completedCount / path.steps.length) * 100) : 0,
        is_completed: completedCount >= path.steps.length
      });
    }
  }
  return enrolled;
}

function lpIsEnrolled(pathId) {
  return !!lpGetState().enrolled[pathId];
}

function lpIsStepCompleted(pathId, stepOrder) {
  return !!lpGetState().completedSteps[pathId + '_step_' + stepOrder];
}

function lrEnroll(pathId) {
  var state = lpGetState();
  if (state.enrolled[pathId]) return;
  state.enrolled[pathId] = { enrolled_at: new Date().toISOString() };
  lpSetState(state);
  if (window.UI) window.UI.showToast('Enrolled in learning path!', 'success');
  lrViewPath(pathId);
}

function lrCompleteLPStep(pathId, stepOrder) {
  var state = lpGetState();
  var key = pathId + '_step_' + stepOrder;
  if (state.completedSteps[key]) delete state.completedSteps[key];
  else state.completedSteps[key] = true;
  lpSetState(state);
  lrViewPath(pathId);
}

function lrFilterSubject(val) {
  var state = lpGetState(); state.filters.subject = val; lpSetState(state);
  lrRenderBrowseTab();
}

function lrFilterDifficulty(val) {
  var state = lpGetState(); state.filters.difficulty = val; lpSetState(state);
  lrRenderBrowseTab();
}

function lrFilterGrade(val) {
  var state = lpGetState(); state.filters.grade = val; lpSetState(state);
  lrRenderBrowseTab();
}

function lrClearFilters() {
  var state = lpGetState(); state.filters = {}; lpSetState(state);
  lrRenderBrowseTab();
}

/* ============================================================
   TAB NAVIGATION
   ============================================================ */
function lrShowTab(tab) {
  var state = lpGetState();
  state.currentTab = tab;
  lpSetState(state);
  lrRenderTabContent(tab);
}

function lrRenderTabContent(tab) {
  var mc = document.getElementById('lr-tab-content');
  if (!mc) return;
  if (tab === 'route') lrRenderRouteTab(mc);
  else if (tab === 'paths') lrRenderPathsTabContent(mc);
  else if (tab === 'recommended') lrRenderRecommendedTab(mc);
}

/* ============================================================
   TAB 1: MY ROUTE
   ============================================================ */
function lrRenderRouteTab(mc) {
  var user = _Store.get('user') || {};
  var subjects = _MD.subjects || [];
  var userClass = user.class || 6;
  var userStream = user.stream || '';

  var userSubjects = [];
  for (var i = 0; i < subjects.length; i++) {
    var sub = subjects[i];
    if (sub.class == userClass) {
      if ((userClass == 11 || userClass == 12) && sub.stream && sub.stream !== userStream) continue;
      userSubjects.push(sub);
    }
  }

  var totalDone = 0, totalLessons = 0;
  for (var si = 0; si < userSubjects.length; si++) {
    var prog = lrGetSubjectProgress(userSubjects[si].id);
    totalDone += prog.done;
    totalLessons += prog.total;
  }
  var overallPct = totalLessons > 0 ? Math.round((totalDone / totalLessons) * 100) : 0;

  var html = '<div class="glass-card" style="padding:var(--space-5);margin-bottom:var(--space-6)">';
  html += '<div style="display:flex;align-items:center;gap:var(--space-3);margin-bottom:var(--space-4)">';
  html += '<div style="width:48px;height:48px;border-radius:var(--radius-full);background:linear-gradient(135deg,#3b82f6,#8b5cf6);display:flex;align-items:center;justify-content:center;font-size:1.5rem;flex-shrink:0">&#129302;</div>';
  html += '<div style="flex:1;min-width:0">';
  html += '<div style="font-weight:600;font-size:var(--text-sm);margin-bottom:2px">AI Mentor Says:</div>';
  html += '<div style="font-size:var(--text-xs);color:var(--text-secondary);line-height:1.5">Welcome to your learning journey! Choose a subject to view your personalized roadmap. I will guide you through each lesson step by step.</div>';
  html += '</div></div>';
  html += '<div class="progress-bar" style="height:8px"><div class="progress-bar-fill" style="width:' + overallPct + '%"></div></div>';
  html += '<div style="display:flex;justify-content:space-between;margin-top:var(--space-2)">';
  html += '<span style="font-size:var(--text-xs);color:var(--text-secondary)">' + totalDone + ' of ' + totalLessons + ' lessons completed</span>';
  html += '<span style="font-size:var(--text-xs);color:var(--accent-blue)">' + overallPct + '% overall</span>';
  html += '</div></div>';

  html += '<div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(300px,1fr));gap:var(--space-4)">';

  for (var si2 = 0; si2 < userSubjects.length; si2++) {
    var subject = userSubjects[si2];
    var chapters = _MD.chapters[subject.id] || [];
    var prog2 = lrGetSubjectProgress(subject.id);
    var suggestion = lrGenSubjectSuggestion(subject);

    html += '<div class="glass-card" style="padding:var(--space-5);cursor:pointer;transition:all var(--transition-base)" data-action="lr:selectSubject:' + subject.id + '">';
    html += '<div style="display:flex;align-items:center;gap:var(--space-3);margin-bottom:var(--space-3)">';
    html += '<div style="width:48px;height:48px;border-radius:var(--radius-lg);background:' + (subject.color || '#3b82f6') + '20;display:flex;align-items:center;justify-content:center;font-size:1.5rem;flex-shrink:0;border:2px solid ' + (subject.color || '#3b82f6') + '40">' + (subject.icon || '&#128218;') + '</div>';
    html += '<div style="flex:1;min-width:0">';
    html += '<div style="font-weight:600;font-size:var(--text-sm)">' + _U.sanitizeHTML(subject.name) + '</div>';
    html += '<div style="font-size:var(--text-xs);color:var(--text-secondary)">Class ' + subject.class + ' &middot; ' + chapters.length + ' lessons</div>';
    html += '</div></div>';
    html += '<div style="margin-bottom:var(--space-3)">';
    html += '<div style="display:flex;justify-content:space-between;margin-bottom:var(--space-1)">';
    html += '<span style="font-size:var(--text-xs);color:var(--text-secondary)">' + prog2.done + '/' + prog2.total + ' lessons</span>';
    html += '<span style="font-size:var(--text-xs);font-weight:600;color:' + (subject.color || '#3b82f6') + '">' + prog2.pct + '%</span>';
    html += '</div>';
    html += '<div class="progress-bar" style="height:6px"><div class="progress-bar-fill" style="width:' + prog2.pct + '%;background:' + (subject.color || '#3b82f6') + '"></div></div>';
    html += '</div>';
    html += '<div style="font-size:var(--text-xs);color:var(--text-secondary);line-height:1.5;margin-bottom:var(--space-3);padding:var(--space-2);background:var(--bg-glass);border-radius:var(--radius-sm)">';
    html += '<span style="color:var(--accent-purple)">&#129302;</span> ' + _U.sanitizeHTML(_U.truncate(suggestion, 80));
    html += '</div>';
    html += '<button class="btn btn-sm" style="width:100%;background:' + (subject.color || '#3b82f6') + '20;color:' + (subject.color || '#3b82f6') + ';border:1px solid ' + (subject.color || '#3b82f6') + '40;font-size:var(--text-xs);font-weight:600" data-action="lr:selectSubject:' + subject.id + '">View Route &#8594;</button>';
    html += '</div>';
  }

  html += '</div>';
  mc.innerHTML = html;
}

/* ============================================================
   TAB 2: LEARNING PATHS
   ============================================================ */
function lrRenderPathsTabContent(mc) {
  var state = lpGetState();
  var activeTab = state.lpSubTab || 'browse';
  var enrolled = lpGetEnrolledPaths();
  var activeCount = 0;
  for (var i = 0; i < enrolled.length; i++) {
    if (!enrolled[i].is_completed) activeCount++;
  }

  var html = '<div class="glass-card" style="padding:var(--space-5);margin-bottom:var(--space-6)">';
  html += '<div style="display:flex;align-items:center;gap:var(--space-3);margin-bottom:var(--space-4)">';
  html += '<div style="width:48px;height:48px;border-radius:var(--radius-full);background:linear-gradient(135deg,#3b82f6,#8b5cf6);display:flex;align-items:center;justify-content:center;font-size:1.5rem;flex-shrink:0">&#129302;</div>';
  html += '<div style="flex:1;min-width:0">';
  html += '<div style="font-weight:600;font-size:var(--text-sm);margin-bottom:2px">AI Mentor</div>';
  html += '<div style="font-size:var(--text-xs);color:var(--text-secondary);line-height:1.5">Choose a learning path and follow the steps in order. Each path is curated by expert educators for maximum retention.</div>';
  html += '</div></div>';
  html += '<div style="display:grid;grid-template-columns:repeat(3,1fr);gap:var(--space-3)">';
  html += '<div style="text-align:center;padding:var(--space-3);background:var(--bg-glass);border-radius:var(--radius-md)">';
  html += '<div style="font-size:var(--text-lg);font-weight:700;color:var(--accent-blue)">' + LP_MOCK_PATHS.length + '</div>';
  html += '<div style="font-size:var(--text-xs);color:var(--text-secondary)">Total Paths</div></div>';
  html += '<div style="text-align:center;padding:var(--space-3);background:var(--bg-glass);border-radius:var(--radius-md)">';
  html += '<div style="font-size:var(--text-lg);font-weight:700;color:var(--accent-green)">' + enrolled.length + '</div>';
  html += '<div style="font-size:var(--text-xs);color:var(--text-secondary)">Enrolled</div></div>';
  html += '<div style="text-align:center;padding:var(--space-3);background:var(--bg-glass);border-radius:var(--radius-md)">';
  html += '<div style="font-size:var(--text-lg);font-weight:700;color:var(--accent-orange)">' + activeCount + '</div>';
  html += '<div style="font-size:var(--text-xs);color:var(--text-secondary)">In Progress</div></div>';
  html += '</div></div>';

  html += '<div id="lr-paths-subtabs" style="display:flex;gap:var(--space-2);margin-bottom:var(--space-5)">';
  var tabs = [
    { key: 'browse', label: '&#128218; Browse' },
    { key: 'myPaths', label: '&#128203; My Paths' + (enrolled.length > 0 ? ' (' + enrolled.length + ')' : '') },
    { key: 'recommended', label: '&#129302; Recommended' }
  ];
  for (var ti = 0; ti < tabs.length; ti++) {
    var isActive = activeTab === tabs[ti].key;
    html += '<button class="btn btn-sm" style="font-size:var(--text-xs);font-weight:600;background:' + (isActive ? 'var(--accent-blue)' : 'var(--bg-glass)') + ';color:' + (isActive ? '#fff' : 'var(--text-secondary)') + ';border:1px solid ' + (isActive ? 'var(--accent-blue)' : 'var(--border-color)') + '" data-action="lr:showTab:' + tabs[ti].key + '">' + tabs[ti].label + '</button>';
  }
  html += '</div>';

  html += '<div id="lr-paths-content"></div>';
  mc.innerHTML = html;

  var pc = document.getElementById('lr-paths-content');
  if (pc) {
    if (activeTab === 'browse') lrRenderBrowseTab(pc);
    else if (activeTab === 'myPaths') lrRenderMyPathsTab(pc);
    else if (activeTab === 'recommended') lrRenderLPRecommendedTab(pc);
  }
}

function lrRenderBrowseTab(container) {
  var mc = container || document.getElementById('lr-paths-content');
  if (!mc) return;
  var state = lpGetState();
  var paths = LP_MOCK_PATHS.slice();
  if (state.filters.subject) paths = paths.filter(function(p) { return p.subject_name === state.filters.subject; });
  if (state.filters.difficulty) paths = paths.filter(function(p) { return p.difficulty === state.filters.difficulty; });
  if (state.filters.grade) paths = paths.filter(function(p) { return p.grade_level === state.filters.grade; });

  var subjects = [], diffSet = {}, gradeSet = {};
  for (var i = 0; i < LP_MOCK_PATHS.length; i++) {
    if (subjects.indexOf(LP_MOCK_PATHS[i].subject_name) === -1) subjects.push(LP_MOCK_PATHS[i].subject_name);
    diffSet[LP_MOCK_PATHS[i].difficulty] = true;
    gradeSet[LP_MOCK_PATHS[i].grade_level] = true;
  }

  var html = '<div class="glass-card" style="padding:var(--space-4);margin-bottom:var(--space-5)">';
  html += '<div style="display:flex;align-items:center;gap:var(--space-2);flex-wrap:wrap">';
  html += '<span style="font-size:var(--text-xs);font-weight:600;color:var(--text-secondary)">&#128269; Filter by:</span>';
  html += '<select class="input-field" style="font-size:var(--text-xs);padding:4px 8px;width:auto;background:var(--bg-glass);border:1px solid var(--border-color);border-radius:var(--radius-sm);color:var(--text-primary)" data-action="lr:filterSubject:__VAL__">';
  html += '<option value="">All Subjects</option>';
  for (var si = 0; si < subjects.length; si++) {
    html += '<option value="' + subjects[si] + '"' + (state.filters.subject === subjects[si] ? ' selected' : '') + '>' + subjects[si] + '</option>';
  }
  html += '</select>';
  html += '<select class="input-field" style="font-size:var(--text-xs);padding:4px 8px;width:auto;background:var(--bg-glass);border:1px solid var(--border-color);border-radius:var(--radius-sm);color:var(--text-primary)" data-action="lr:filterDifficulty:__VAL__">';
  html += '<option value="">All Difficulties</option>';
  var diffs = Object.keys(diffSet);
  for (var di = 0; di < diffs.length; di++) {
    html += '<option value="' + diffs[di] + '"' + (state.filters.difficulty === diffs[di] ? ' selected' : '') + '>' + diffs[di] + '</option>';
  }
  html += '</select>';
  html += '<select class="input-field" style="font-size:var(--text-xs);padding:4px 8px;width:auto;background:var(--bg-glass);border:1px solid var(--border-color);border-radius:var(--radius-sm);color:var(--text-primary)" data-action="lr:filterGrade:__VAL__">';
  html += '<option value="">All Grades</option>';
  var grades = Object.keys(gradeSet);
  for (var gi = 0; gi < grades.length; gi++) {
    html += '<option value="' + grades[gi] + '"' + (state.filters.grade === grades[gi] ? ' selected' : '') + '>Class ' + grades[gi] + '</option>';
  }
  html += '</select>';
  if (state.filters.subject || state.filters.difficulty || state.filters.grade) {
    html += '<button class="btn btn-ghost btn-sm" style="font-size:var(--text-xs)" data-action="lr:clearFilters">Clear Filters</button>';
  }
  html += '</div></div>';

  html += '<div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(300px,1fr));gap:var(--space-4)">';
  for (var pi = 0; pi < paths.length; pi++) {
    var path = paths[pi];
    var enrolled = lpIsEnrolled(path.id);
    var diffColor = path.difficulty === 'Easy' ? 'var(--accent-green)' : (path.difficulty === 'Hard' ? 'var(--accent-red)' : 'var(--accent-orange)');

    html += '<div class="glass-card" style="padding:var(--space-5);cursor:pointer;transition:all var(--transition-base)" data-action="lr:viewPath:' + path.id + '">';
    html += '<div style="display:flex;align-items:center;gap:var(--space-3);margin-bottom:var(--space-3)">';
    html += '<div style="width:48px;height:48px;border-radius:var(--radius-lg);background:' + path.color + '20;display:flex;align-items:center;justify-content:center;font-size:1.5rem;flex-shrink:0;border:2px solid ' + path.color + '40">' + path.icon + '</div>';
    html += '<div style="flex:1;min-width:0">';
    html += '<div style="font-weight:600;font-size:var(--text-sm)">' + _U.sanitizeHTML(path.title) + '</div>';
    html += '<div style="font-size:var(--text-xs);color:var(--text-secondary)">' + _U.sanitizeHTML(path.subject_name) + ' &middot; Class ' + path.grade_level + '</div>';
    html += '</div>';
    if (enrolled) html += '<span style="font-size:0.65rem;padding:3px 8px;border-radius:var(--radius-full);background:rgba(16,185,129,0.15);color:var(--accent-green);font-weight:600">ENROLLED</span>';
    html += '</div>';
    html += '<div style="font-size:var(--text-xs);color:var(--text-secondary);line-height:1.5;margin-bottom:var(--space-3);display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden">' + _U.sanitizeHTML(path.description) + '</div>';
    html += '<div style="display:flex;align-items:center;gap:var(--space-3);flex-wrap:wrap;margin-bottom:var(--space-3)">';
    html += '<span style="font-size:var(--text-xs);padding:2px 8px;border-radius:var(--radius-full);background:' + diffColor + '20;color:' + diffColor + ';font-weight:500">' + path.difficulty + '</span>';
    html += '<span style="font-size:var(--text-xs);color:var(--text-secondary)">&#128218; ' + path.total_steps + ' steps</span>';
    html += '<span style="font-size:var(--text-xs);color:var(--text-secondary)">&#9200; ' + path.estimated_duration_days + ' days</span>';
    html += '</div>';
    html += '<button class="btn btn-sm" style="width:100%;background:' + path.color + '20;color:' + path.color + ';border:1px solid ' + path.color + '40;font-size:var(--text-xs);font-weight:600" data-action="lr:viewPath:' + path.id + '">' + (enrolled ? 'Continue Path &#8594;' : 'View Path &#8594;') + '</button>';
    html += '</div>';
  }
  html += '</div>';

  if (paths.length === 0) {
    html += '<div style="text-align:center;padding:var(--space-8)">';
    html += '<div style="font-size:2rem;margin-bottom:var(--space-3)">&#128269;</div>';
    html += '<div style="font-size:var(--text-sm);color:var(--text-secondary);margin-bottom:var(--space-4)">No learning paths match your filters</div>';
    html += '<button class="btn btn-primary btn-sm" data-action="lr:clearFilters">Clear Filters</button>';
    html += '</div>';
  }
  mc.innerHTML = html;
}

function lrRenderMyPathsTab(container) {
  var mc = container || document.getElementById('lr-paths-content');
  if (!mc) return;
  var enrolled = lpGetEnrolledPaths();
  var html = '';

  if (enrolled.length === 0) {
    html += '<div style="text-align:center;padding:var(--space-8)">';
    html += '<div style="font-size:2.5rem;margin-bottom:var(--space-3)">&#128218;</div>';
    html += '<h3 style="font-size:var(--text-lg);font-weight:700;margin-bottom:var(--space-2)">No Paths Yet</h3>';
    html += '<p style="font-size:var(--text-sm);color:var(--text-secondary);margin-bottom:var(--space-4)">Enroll in a learning path to start your guided learning journey.</p>';
    html += '<button class="btn btn-primary" data-action="lr:showTab:browse">Browse Paths</button>';
    html += '</div>';
    mc.innerHTML = html;
    return;
  }

  var activePaths = [], completedPaths = [];
  for (var i = 0; i < enrolled.length; i++) {
    if (enrolled[i].is_completed) completedPaths.push(enrolled[i]);
    else activePaths.push(enrolled[i]);
  }

  if (activePaths.length > 0) {
    html += '<div class="section-header" style="margin-bottom:var(--space-4)"><h3 style="font-size:var(--text-lg);font-weight:600">&#128640; In Progress (' + activePaths.length + ')</h3></div>';
    html += '<div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(300px,1fr));gap:var(--space-4);margin-bottom:var(--space-6)">';
    for (var ai = 0; ai < activePaths.length; ai++) {
      var enr = activePaths[ai], p = enr.path;
      html += '<div class="glass-card" style="padding:var(--space-5);cursor:pointer" data-action="lr:viewPath:' + p.id + '">';
      html += '<div style="display:flex;align-items:center;gap:var(--space-3);margin-bottom:var(--space-3)">';
      html += '<div style="width:48px;height:48px;border-radius:var(--radius-lg);background:' + p.color + '20;display:flex;align-items:center;justify-content:center;font-size:1.5rem;border:2px solid ' + p.color + '40">' + p.icon + '</div>';
      html += '<div style="flex:1;min-width:0">';
      html += '<div style="font-weight:600;font-size:var(--text-sm)">' + _U.sanitizeHTML(p.title) + '</div>';
      html += '<div style="font-size:var(--text-xs);color:var(--text-secondary)">' + _U.sanitizeHTML(p.subject_name) + ' &middot; Class ' + p.grade_level + '</div>';
      html += '</div></div>';
      html += '<div style="margin-bottom:var(--space-3)">';
      html += '<div style="display:flex;justify-content:space-between;margin-bottom:var(--space-1)">';
      html += '<span style="font-size:var(--text-xs);color:var(--text-secondary)">' + enr.completed_steps + '/' + enr.total_steps + ' steps</span>';
      html += '<span style="font-size:var(--text-xs);font-weight:600;color:' + p.color + '">' + enr.progress + '%</span>';
      html += '</div>';
      html += '<div class="progress-bar" style="height:6px"><div class="progress-bar-fill" style="width:' + enr.progress + '%;background:' + p.color + '"></div></div></div>';
      html += '<button class="btn btn-sm" style="width:100%;background:' + p.color + '20;color:' + p.color + ';border:1px solid ' + p.color + '40;font-size:var(--text-xs);font-weight:600" data-action="lr:viewPath:' + p.id + '">Continue &#8594;</button>';
      html += '</div>';
    }
    html += '</div>';
  }

  if (completedPaths.length > 0) {
    html += '<div class="section-header" style="margin-bottom:var(--space-4)"><h3 style="font-size:var(--text-lg);font-weight:600">&#127881; Completed (' + completedPaths.length + ')</h3></div>';
    html += '<div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(300px,1fr));gap:var(--space-4)">';
    for (var ci = 0; ci < completedPaths.length; ci++) {
      var cEnr = completedPaths[ci], cp = cEnr.path;
      html += '<div class="glass-card" style="padding:var(--space-5);cursor:pointer;border-left:3px solid var(--accent-green)" data-action="lr:viewPath:' + cp.id + '">';
      html += '<div style="display:flex;align-items:center;gap:var(--space-3);margin-bottom:var(--space-3)">';
      html += '<div style="width:48px;height:48px;border-radius:var(--radius-lg);background:' + cp.color + '20;display:flex;align-items:center;justify-content:center;font-size:1.5rem;border:2px solid var(--accent-green)">' + cp.icon + '</div>';
      html += '<div style="flex:1;min-width:0">';
      html += '<div style="font-weight:600;font-size:var(--text-sm)">' + _U.sanitizeHTML(cp.title) + '</div>';
      html += '<div style="font-size:var(--text-xs);color:var(--accent-green);font-weight:500">100% Complete</div>';
      html += '</div>';
      html += '<span style="font-size:1.2rem">&#127942;</span>';
      html += '</div>';
      html += '<button class="btn btn-sm" style="width:100%;background:rgba(16,185,129,0.1);color:var(--accent-green);border:1px solid rgba(16,185,129,0.3);font-size:var(--text-xs);font-weight:600" data-action="lr:viewPath:' + cp.id + '">Review Path &#8594;</button>';
      html += '</div>';
    }
    html += '</div>';
  }
  mc.innerHTML = html;
}

function lrRenderLPRecommendedTab(container) {
  var mc = container || document.getElementById('lr-paths-content');
  if (!mc) return;
  var recommended = [];
  for (var i = 0; i < LP_MOCK_PATHS.length; i++) {
    if (!lpIsEnrolled(LP_MOCK_PATHS[i].id)) recommended.push(LP_MOCK_PATHS[i]);
  }
  recommended.sort(function(a, b) {
    if (a.difficulty === 'Easy' && b.difficulty !== 'Easy') return -1;
    if (a.difficulty !== 'Easy' && b.difficulty === 'Easy') return 1;
    return 0;
  });

  var html = '<div class="glass-card" style="padding:var(--space-5);margin-bottom:var(--space-5)">';
  html += '<div style="display:flex;align-items:flex-start;gap:var(--space-3)">';
  html += '<div style="width:36px;height:36px;border-radius:var(--radius-full);background:linear-gradient(135deg,#3b82f6,#8b5cf6);display:flex;align-items:center;justify-content:center;font-size:1rem;flex-shrink:0">&#129302;</div>';
  html += '<div>';
  html += '<div style="font-weight:600;font-size:var(--text-sm);margin-bottom:4px">Recommended For You</div>';
  html += '<div style="font-size:var(--text-xs);color:var(--text-secondary);line-height:1.6">Based on your enrolled subjects and weak areas, we suggest these learning paths to strengthen your preparation.</div>';
  html += '</div></div></div>';

  if (recommended.length === 0) {
    html += '<div style="text-align:center;padding:var(--space-8)">';
    html += '<div style="font-size:2.5rem;margin-bottom:var(--space-3)">&#127881;</div>';
    html += '<h3 style="font-size:var(--text-lg);font-weight:700;margin-bottom:var(--space-2)">All Caught Up!</h3>';
    html += '<p style="font-size:var(--text-sm);color:var(--text-secondary)">You have enrolled in all available learning paths. Great dedication!</p>';
    html += '</div>';
    mc.innerHTML = html;
    return;
  }

  html += '<div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(300px,1fr));gap:var(--space-4)">';
  for (var ri = 0; ri < recommended.length; ri++) {
    var rp = recommended[ri];
    var diffColor = rp.difficulty === 'Easy' ? 'var(--accent-green)' : (rp.difficulty === 'Hard' ? 'var(--accent-red)' : 'var(--accent-orange)');
    html += '<div class="glass-card" style="padding:var(--space-5);cursor:pointer;transition:all var(--transition-base)" data-action="lr:viewPath:' + rp.id + '">';
    html += '<div style="display:flex;align-items:center;gap:var(--space-3);margin-bottom:var(--space-3)">';
    html += '<div style="width:48px;height:48px;border-radius:var(--radius-lg);background:' + rp.color + '20;display:flex;align-items:center;justify-content:center;font-size:1.5rem;border:2px solid ' + rp.color + '40">' + rp.icon + '</div>';
    html += '<div style="flex:1;min-width:0">';
    html += '<div style="font-weight:600;font-size:var(--text-sm)">' + _U.sanitizeHTML(rp.title) + '</div>';
    html += '<div style="font-size:var(--text-xs);color:var(--text-secondary)">' + _U.sanitizeHTML(rp.subject_name) + ' &middot; Class ' + rp.grade_level + '</div>';
    html += '</div></div>';
    html += '<div style="font-size:var(--text-xs);color:var(--text-secondary);line-height:1.5;margin-bottom:var(--space-3)">' + _U.sanitizeHTML(rp.description) + '</div>';
    html += '<div style="display:flex;align-items:center;gap:var(--space-3);flex-wrap:wrap;margin-bottom:var(--space-3)">';
    html += '<span style="font-size:var(--text-xs);padding:2px 8px;border-radius:var(--radius-full);background:' + diffColor + '20;color:' + diffColor + ';font-weight:500">' + rp.difficulty + '</span>';
    html += '<span style="font-size:var(--text-xs);color:var(--text-secondary)">&#128218; ' + rp.total_steps + ' steps</span>';
    html += '<span style="font-size:var(--text-xs);color:var(--text-secondary)">&#9200; ' + rp.estimated_duration_days + ' days</span>';
    html += '</div>';
    html += '<button class="btn btn-sm" style="width:100%;background:' + rp.color + '20;color:' + rp.color + ';border:1px solid ' + rp.color + '40;font-size:var(--text-xs);font-weight:600" data-action="lr:viewPath:' + rp.id + '">View Path &#8594;</button>';
    html += '</div>';
  }
  html += '</div>';
  mc.innerHTML = html;
}

/* ============================================================
   LEARNING PATH VIEW
   ============================================================ */
function lrViewPath(pathId) {
  var path = null;
  for (var i = 0; i < LP_MOCK_PATHS.length; i++) {
    if (LP_MOCK_PATHS[i].id === pathId) { path = LP_MOCK_PATHS[i]; break; }
  }
  if (!path) return;
  var mc = document.getElementById('lr-paths-content');
  if (!mc) return;

  var enrolled = lpIsEnrolled(pathId);
  var completedCount = 0;
  for (var j = 0; j < path.steps.length; j++) {
    if (lpIsStepCompleted(pathId, path.steps[j].step_order)) completedCount++;
  }
  var progress = path.steps.length > 0 ? Math.round((completedCount / path.steps.length) * 100) : 0;
  var diffColor = path.difficulty === 'Easy' ? 'var(--accent-green)' : (path.difficulty === 'Hard' ? 'var(--accent-red)' : 'var(--accent-orange)');

  var html = '<button class="btn btn-ghost btn-sm" style="margin-bottom:var(--space-4);font-size:var(--text-xs)" data-action="lr:showTab:browse">&#8592; Back to Paths</button>';

  html += '<div class="glass-card" style="padding:var(--space-5);margin-bottom:var(--space-6)">';
  html += '<div style="display:flex;align-items:flex-start;gap:var(--space-4);flex-wrap:wrap">';
  html += '<div style="width:56px;height:56px;border-radius:var(--radius-lg);background:' + path.color + '20;display:flex;align-items:center;justify-content:center;font-size:2rem;border:2px solid ' + path.color + '40;flex-shrink:0">' + path.icon + '</div>';
  html += '<div style="flex:1;min-width:200px">';
  html += '<h1 style="font-size:var(--text-xl);font-weight:700;margin-bottom:4px">' + _U.sanitizeHTML(path.title) + '</h1>';
  html += '<div style="font-size:var(--text-xs);color:var(--text-secondary);margin-bottom:var(--space-2)">' + _U.sanitizeHTML(path.description) + '</div>';
  html += '<div style="display:flex;align-items:center;gap:var(--space-3);flex-wrap:wrap">';
  html += '<span style="font-size:var(--text-xs);padding:3px 10px;border-radius:var(--radius-full);background:' + path.color + '20;color:' + path.color + ';font-weight:500">' + _U.sanitizeHTML(path.subject_name) + '</span>';
  html += '<span style="font-size:var(--text-xs);padding:3px 10px;border-radius:var(--radius-full);background:' + diffColor + '20;color:' + diffColor + ';font-weight:500">' + path.difficulty + '</span>';
  html += '<span style="font-size:var(--text-xs);color:var(--text-secondary)">' + path.grade_level + '</span>';
  html += '<span style="font-size:var(--text-xs);color:var(--text-secondary)">' + path.total_steps + ' steps</span>';
  html += '<span style="font-size:var(--text-xs);color:var(--text-secondary)">' + path.estimated_duration_days + ' days</span>';
  html += '</div></div>';
  html += '<div style="text-align:center;flex-shrink:0">';
  html += '<div style="font-size:var(--text-2xl);font-weight:700;color:' + path.color + '">' + progress + '%</div>';
  html += '<div style="font-size:var(--text-xs);color:var(--text-secondary)">' + completedCount + '/' + path.total_steps + ' done</div>';
  html += '</div></div></div>';

  if (enrolled) {
    html += '<div class="glass-card" style="padding:var(--space-5);margin-bottom:var(--space-6)">';
    html += '<div style="display:flex;align-items:center;gap:var(--space-3);margin-bottom:var(--space-3)">';
    html += '<div style="width:36px;height:36px;border-radius:var(--radius-full);background:linear-gradient(135deg,#8b5cf6,#ec4899);display:flex;align-items:center;justify-content:center;font-size:1rem;flex-shrink:0">&#129302;</div>';
    html += '<div><div style="font-weight:600;font-size:var(--text-sm)">Your Progress</div>';
    html += '<div style="font-size:var(--text-xs);color:var(--text-secondary)">Click steps below to mark them complete</div></div></div>';
    html += '<div class="progress-bar" style="height:8px;margin-bottom:var(--space-2)"><div class="progress-bar-fill" style="width:' + progress + '%;background:' + path.color + '"></div></div>';
    html += '<div style="display:flex;justify-content:space-between">';
    html += '<span style="font-size:var(--text-xs);color:var(--text-secondary)">' + completedCount + ' of ' + path.total_steps + ' steps completed</span>';
    if (progress === 100) html += '<span style="font-size:var(--text-xs);color:var(--accent-green);font-weight:600">&#127881; Complete!</span>';
    html += '</div></div>';
  }

  html += '<div class="section-header" style="margin-bottom:var(--space-4)"><h3 style="font-size:var(--text-lg);font-weight:600">&#128218; Learning Steps</h3></div>';
  html += '<div class="lr-timeline" style="position:relative;padding-left:40px;margin-bottom:var(--space-8)">';
  html += '<div class="lr-timeline-line" style="position:absolute;left:18px;top:0;bottom:0;width:3px;background:linear-gradient(to bottom,var(--accent-green),var(--accent-blue),var(--text-muted));border-radius:2px"></div>';

  for (var si = 0; si < path.steps.length; si++) {
    var step = path.steps[si];
    var stepComplete = lpIsStepCompleted(pathId, step.step_order);
    var dotColor = stepComplete ? 'var(--accent-green)' : 'var(--text-muted)';
    var dotBg = stepComplete ? 'rgba(16,185,129,0.2)' : 'rgba(255,255,255,0.05)';
    var dotIcon = stepComplete ? '&#10003;' : '&#9675;';
    var cardBorder = stepComplete ? 'border-left:3px solid var(--accent-green);' : 'border-left:3px solid var(--text-muted);';
    var typeIcon = { lesson: '&#128218;', video: '&#128247;', quiz: '&#128220;', exam: '&#128221;', resource: '&#128196;', lab: '&#128300;' }[step.content_type] || '&#128218;';

    html += '<div class="lr-timeline-step" style="position:relative;margin-bottom:var(--space-4)">';
    html += '<div class="lr-timeline-dot" style="position:absolute;left:-40px;top:14px;width:36px;height:36px;border-radius:50%;background:' + dotBg + ';border:2px solid ' + dotColor + ';display:flex;align-items:center;justify-content:center;font-size:0.8rem;color:' + dotColor + ';z-index:2;flex-shrink:0">' + dotIcon + '</div>';
    html += '<div class="glass-card" style="padding:var(--space-4);' + cardBorder + (enrolled && !stepComplete ? 'box-shadow:0 0 12px ' + path.color + '15;' : '') + '">';
    html += '<div style="display:flex;align-items:flex-start;justify-content:space-between;gap:var(--space-3);flex-wrap:wrap">';
    html += '<div style="flex:1;min-width:180px">';
    html += '<div style="display:flex;align-items:center;gap:var(--space-2);margin-bottom:var(--space-1)">';
    html += '<span style="font-size:var(--text-xs);color:var(--text-secondary);font-weight:500">Step ' + step.step_order + '</span>';
    html += '<span style="font-size:1rem">' + typeIcon + '</span>';
    if (stepComplete) html += '<span style="font-size:0.65rem;padding:2px 8px;border-radius:var(--radius-full);background:rgba(16,185,129,0.15);color:var(--accent-green);font-weight:600">COMPLETE</span>';
    if (step.is_optional) html += '<span style="font-size:0.65rem;padding:2px 8px;border-radius:var(--radius-full);background:var(--bg-glass);color:var(--text-tertiary);font-weight:500">OPTIONAL</span>';
    html += '</div>';
    html += '<div style="font-weight:600;font-size:var(--text-sm);margin-bottom:var(--space-1)">' + _U.sanitizeHTML(step.title) + '</div>';
    html += '<div style="font-size:var(--text-xs);color:var(--text-secondary);margin-bottom:var(--space-1)">' + _U.sanitizeHTML(step.description || '') + '</div>';
    html += '<div style="display:flex;align-items:center;gap:var(--space-3);flex-wrap:wrap">';
    html += '<span style="font-size:var(--text-xs);color:var(--text-secondary)">&#9200; ' + step.estimated_minutes + ' min</span>';
    html += '<span style="font-size:var(--text-xs);padding:2px 8px;border-radius:var(--radius-full);background:var(--bg-glass);color:var(--text-secondary)">' + step.content_type + '</span>';
    html += '</div></div>';
    html += '<div style="flex-shrink:0">';
    if (enrolled) {
      html += '<button class="btn btn-sm" style="font-size:var(--text-xs;background:' + (stepComplete ? 'rgba(16,185,129,0.15)' : path.color + '20') + ';color:' + (stepComplete ? 'var(--accent-green)' : path.color) + ';border:1px solid ' + (stepComplete ? 'rgba(16,185,129,0.3)' : path.color + '40') + ')" data-action="lr:completeStep:' + pathId + ':' + step.step_order + '">' + (stepComplete ? '&#10003; Done' : '&#9654; Mark Complete') + '</button>';
    } else {
      html += '<span style="font-size:var(--text-xs);color:var(--text-muted)">Enroll to start</span>';
    }
    html += '</div></div></div></div>';
  }
  html += '</div>';

  if (!enrolled) {
    html += '<div style="text-align:center;padding:var(--space-6)">';
    html += '<button class="btn btn-primary btn-lg" style="background:' + path.color + ';border-color:' + path.color + '" data-action="lr:enroll:' + pathId + '">&#128640; Enroll in This Path</button>';
    html += '</div>';
  } else if (progress === 100) {
    html += '<div class="glass-card" style="padding:var(--space-6);text-align:center;margin-bottom:var(--space-8)">';
    html += '<div style="font-size:2.5rem;margin-bottom:var(--space-3)">&#127881;</div>';
    html += '<h3 style="font-size:var(--text-lg);font-weight:700;margin-bottom:var(--space-2);color:var(--accent-green)">Path Complete!</h3>';
    html += '<p style="font-size:var(--text-sm);color:var(--text-secondary)">Congratulations! You have completed all steps in ' + _U.sanitizeHTML(path.title) + '.</p>';
    html += '</div>';
  }

  mc.innerHTML = html;
}

/* ============================================================
   TAB 3: RECOMMENDED (AI-POWERED)
   ============================================================ */
function lrRenderRecommendedTab(mc) {
  var user = _Store.get('user') || {};
  var subjects = _MD.subjects || [];
  var userClass = user.class || 6;
  var userStream = user.stream || '';

  var userSubjects = [];
  for (var i = 0; i < subjects.length; i++) {
    var sub = subjects[i];
    if (sub.class == userClass) {
      if ((userClass == 11 || userClass == 12) && sub.stream && sub.stream !== userStream) continue;
      userSubjects.push(sub);
    }
  }

  var subjectProgress = [];
  for (var si = 0; si < userSubjects.length; si++) {
    var prog = lrGetSubjectProgress(userSubjects[si].id);
    subjectProgress.push({ subject: userSubjects[si], progress: prog });
  }
  subjectProgress.sort(function(a, b) { return a.progress.pct - b.progress.pct; });

  var weakest = subjectProgress.length > 0 ? subjectProgress[0] : null;
  var strongest = subjectProgress.length > 0 ? subjectProgress[subjectProgress.length - 1] : null;

  var unenrolledPaths = [];
  for (var pi = 0; pi < LP_MOCK_PATHS.length; pi++) {
    if (!lpIsEnrolled(LP_MOCK_PATHS[pi].id)) unenrolledPaths.push(LP_MOCK_PATHS[pi]);
  }
  unenrolledPaths.sort(function(a, b) {
    if (a.difficulty === 'Easy' && b.difficulty !== 'Easy') return -1;
    if (a.difficulty !== 'Easy' && b.difficulty === 'Easy') return 1;
    return 0;
  });

  var html = '';

  html += '<div class="glass-card" style="padding:var(--space-5);margin-bottom:var(--space-6)">';
  html += '<div style="display:flex;align-items:flex-start;gap:var(--space-3)">';
  html += '<div style="width:40px;height:40px;border-radius:var(--radius-full);background:linear-gradient(135deg,#3b82f6,#8b5cf6);display:flex;align-items:center;justify-content:center;font-size:1.1rem;flex-shrink:0">&#129302;</div>';
  html += '<div style="flex:1;min-width:0">';
  html += '<div style="font-weight:600;font-size:var(--text-sm);margin-bottom:4px">AI-Powered Recommendations</div>';
  html += '<div style="font-size:var(--text-xs);color:var(--text-secondary);line-height:1.6">Based on your learning progress, here are personalized suggestions to help you improve. We analyze your weakest subjects and recommend the best next steps.</div>';
  html += '</div></div></div>';

  if (weakest && weakest.progress.pct < 50) {
    html += '<div class="glass-card" style="padding:var(--space-5);margin-bottom:var(--space-6)">';
    html += '<div style="display:flex;align-items:center;gap:var(--space-2);margin-bottom:var(--space-3)">';
    html += '<span style="font-size:1.2rem">&#127919;</span>';
    html += '<h3 style="font-size:var(--text-sm);font-weight:600">Focus Area: ' + _U.sanitizeHTML(weakest.subject.name) + '</h3>';
    html += '<span style="font-size:0.65rem;padding:2px 8px;border-radius:var(--radius-full);background:rgba(239,68,68,0.15);color:var(--accent-red);font-weight:600">NEEDS ATTENTION</span>';
    html += '</div>';
    html += '<p style="font-size:var(--text-xs);color:var(--text-secondary);line-height:1.6;margin-bottom:var(--space-3)">';
    html += 'Your ' + _U.sanitizeHTML(weakest.subject.name) + ' progress is at ' + weakest.progress.pct + '%. ';
    if (weakest.progress.pct === 0) {
      html += 'You haven\'t started this subject yet. Begin with the first lesson to build a strong foundation.';
    } else {
      html += 'You have ' + (weakest.progress.total - weakest.progress.done) + ' lessons remaining. Focus on completing them to strengthen your understanding.';
    }
    html += '</p>';
    html += '<button class="btn btn-primary btn-sm" style="font-size:var(--text-xs)" data-action="lr:selectSubject:' + weakest.subject.id + '">Start Learning &#8594;</button>';
    html += '</div>';
  }

  html += '<div class="section-header" style="margin-bottom:var(--space-4)"><h3 style="font-size:var(--text-lg);font-weight:600">&#128200; Subject Progress Overview</h3></div>';
  html += '<div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(280px,1fr));gap:var(--space-3);margin-bottom:var(--space-6)">';

  for (var ri = 0; ri < subjectProgress.length; ri++) {
    var sp = subjectProgress[ri];
    var rec = '';
    if (sp.progress.pct === 0) rec = 'Start this subject now!';
    else if (sp.progress.pct < 30) rec = 'Keep going, build your foundation.';
    else if (sp.progress.pct < 70) rec = 'Great progress! Maintain momentum.';
    else if (sp.progress.pct < 100) rec = 'Almost done! Finish the last lessons.';
    else rec = 'Completed! Consider revising.';

    html += '<div class="glass-card" style="padding:var(--space-4);cursor:pointer" data-action="lr:selectSubject:' + sp.subject.id + '">';
    html += '<div style="display:flex;align-items:center;gap:var(--space-2);margin-bottom:var(--space-2)">';
    html += '<span style="font-size:1.2rem">' + (sp.subject.icon || '&#128218;') + '</span>';
    html += '<span style="font-weight:600;font-size:var(--text-sm)">' + _U.sanitizeHTML(sp.subject.name) + '</span>';
    html += '<span style="margin-left:auto;font-size:var(--text-xs);font-weight:600;color:' + (sp.subject.color || '#3b82f6') + '">' + sp.progress.pct + '%</span>';
    html += '</div>';
    html += '<div class="progress-bar" style="height:6px;margin-bottom:var(--space-2)"><div class="progress-bar-fill" style="width:' + sp.progress.pct + '%;background:' + (sp.subject.color || '#3b82f6') + '"></div></div>';
    html += '<div style="font-size:var(--text-xs);color:var(--text-secondary)">' + rec + '</div>';
    html += '</div>';
  }
  html += '</div>';

  var nextSteps = [];
  if (weakest && weakest.progress.pct < 100) {
    var chapters = _MD.chapters[weakest.subject.id] || [];
    for (var ni = 0; ni < chapters.length; ni++) {
      if (!lrIsLessonComplete(weakest.subject.id, ni)) {
        nextSteps.push({ subject: weakest.subject, chapter: chapters[ni], idx: ni });
        break;
      }
    }
  }
  if (nextSteps.length > 0) {
    html += '<div class="section-header" style="margin-bottom:var(--space-4)"><h3 style="font-size:var(--text-lg);font-weight:600">&#128161; Recommended Next Steps</h3></div>';
    for (var nsi = 0; nsi < nextSteps.length; nsi++) {
      var ns = nextSteps[nsi];
      html += '<div class="glass-card" style="padding:var(--space-4);margin-bottom:var(--space-3)">';
      html += '<div style="display:flex;align-items:center;justify-content:space-between;gap:var(--space-3);flex-wrap:wrap">';
      html += '<div>';
      html += '<div style="font-size:var(--text-xs);color:var(--accent-blue);font-weight:500;margin-bottom:2px">' + _U.sanitizeHTML(ns.subject.name) + '</div>';
      html += '<div style="font-weight:600;font-size:var(--text-sm)">' + _U.sanitizeHTML(ns.chapter.name) + '</div>';
      html += '</div>';
      html += '<button class="btn btn-primary btn-sm" style="font-size:var(--text-xs)" data-action="lr:startLesson:' + ns.subject.id + ':' + ns.idx + '">Start Lesson &#8594;</button>';
      html += '</div></div>';
    }
  }

  if (unenrolledPaths.length > 0) {
    html += '<div class="section-header" style="margin-bottom:var(--space-4);margin-top:var(--space-6)"><h3 style="font-size:var(--text-lg);font-weight:600">&#128218; Suggested Learning Paths</h3></div>';
    html += '<div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(300px,1fr));gap:var(--space-4)">';
    var showPaths = unenrolledPaths.slice(0, 3);
    for (var spi = 0; spi < showPaths.length; spi++) {
      var sp2 = showPaths[spi];
      var dColor = sp2.difficulty === 'Easy' ? 'var(--accent-green)' : (sp2.difficulty === 'Hard' ? 'var(--accent-red)' : 'var(--accent-orange)');
      html += '<div class="glass-card" style="padding:var(--space-5);cursor:pointer" data-action="lr:viewPath:' + sp2.id + '">';
      html += '<div style="display:flex;align-items:center;gap:var(--space-3);margin-bottom:var(--space-3)">';
      html += '<div style="width:48px;height:48px;border-radius:var(--radius-lg);background:' + sp2.color + '20;display:flex;align-items:center;justify-content:center;font-size:1.5rem;border:2px solid ' + sp2.color + '40">' + sp2.icon + '</div>';
      html += '<div style="flex:1;min-width:0">';
      html += '<div style="font-weight:600;font-size:var(--text-sm)">' + _U.sanitizeHTML(sp2.title) + '</div>';
      html += '<div style="font-size:var(--text-xs);color:var(--text-secondary)">' + _U.sanitizeHTML(sp2.subject_name) + '</div>';
      html += '</div></div>';
      html += '<div style="display:flex;align-items:center;gap:var(--space-3);margin-bottom:var(--space-3)">';
      html += '<span style="font-size:var(--text-xs);padding:2px 8px;border-radius:var(--radius-full);background:' + dColor + '20;color:' + dColor + ';font-weight:500">' + sp2.difficulty + '</span>';
      html += '<span style="font-size:var(--text-xs);color:var(--text-secondary)">&#128218; ' + sp2.total_steps + ' steps</span>';
      html += '</div>';
      html += '<button class="btn btn-sm" style="width:100%;background:' + sp2.color + '20;color:' + sp2.color + ';border:1px solid ' + sp2.color + '40;font-size:var(--text-xs);font-weight:600" data-action="lr:viewPath:' + sp2.id + '">View Path &#8594;</button>';
      html += '</div>';
    }
    html += '</div>';
  }

  mc.innerHTML = html;
}

/* ============================================================
   MAIN PAGE RENDERER - 3 tabs
   ============================================================ */
window.renderPage.learningRoute = function() {
  var mc = document.getElementById('main-content');
  var state = lpGetState();
  var activeTab = state.currentTab || 'route';

  var html = '<div class="page-container">';
  html += '<div class="page-header" style="margin-bottom:var(--space-6)">';
  html += '<div><h1 class="page-title" style="font-size:var(--text-2xl)">Learning Route</h1>';
  html += '<p class="page-subtitle" style="font-size:var(--text-sm);color:var(--text-secondary);margin-top:var(--space-1)">Your AI-powered learning roadmap for every subject</p></div>';
  html += '</div>';

  html += '<div style="display:flex;gap:var(--space-2);margin-bottom:var(--space-5)">';
  var mainTabs = [
    { key: 'route', label: '&#127919; My Route' },
    { key: 'paths', label: '&#128218; Learning Paths' },
    { key: 'recommended', label: '&#129302; Recommended' }
  ];
  for (var ti = 0; ti < mainTabs.length; ti++) {
    var isActive = activeTab === mainTabs[ti].key;
    html += '<button class="btn btn-sm" style="font-size:var(--text-xs);font-weight:600;background:' + (isActive ? 'var(--accent-blue)' : 'var(--bg-glass)') + ';color:' + (isActive ? '#fff' : 'var(--text-secondary)') + ';border:1px solid ' + (isActive ? 'var(--accent-blue)' : 'var(--border-color)') + '" data-action="lr:showTab:' + mainTabs[ti].key + '">' + mainTabs[ti].label + '</button>';
  }
  html += '</div>';

  html += '<div id="lr-tab-content"></div>';
  html += '</div>';

  mc.innerHTML = html;

  var tabContent = document.getElementById('lr-tab-content');
  if (tabContent) lrRenderTabContent(activeTab);
};

/* ============================================================
   ALIAS: sidebar nav pointing to paths tab
   ============================================================ */
window.renderPage.learningRoutePaths = function() {
  var state = lpGetState();
  state.currentTab = 'paths';
  state.lpSubTab = state.lpSubTab || 'browse';
  lpSetState(state);
  window.renderPage.learningRoute();
};

/* ============================================================
   SUBJECT DETAIL PAGE
   ============================================================ */
window.renderPage.learningRouteSubject = function(params) {
  var mc = document.getElementById('main-content');
  var subjectId = params.subjectId;
  var subjects = _MD.subjects || [];
  var subject = null;
  for (var i = 0; i < subjects.length; i++) {
    if (subjects[i].id === subjectId) { subject = subjects[i]; break; }
  }
  if (!subject) {
    mc.innerHTML = '<div class="flex flex-col items-center justify-center empty-state"><div class="empty-state-icon">&#128269;</div><h2 class="empty-state-title">Subject Not Found</h2><button class="btn btn-primary" data-action="lr:back">Back to Subjects</button></div>';
    return;
  }
  lrRenderSubjectPage(subjectId);
};

function lrRenderSubjectPage(subjectId) {
  var mc = document.getElementById('main-content');
  var subjects = _MD.subjects || [];
  var subject = null;
  for (var i = 0; i < subjects.length; i++) {
    if (subjects[i].id === subjectId) { subject = subjects[i]; break; }
  }
  if (!subject) return;

  var chapters = _MD.chapters[subjectId] || [];
  var progress = lrGetSubjectProgress(subjectId);
  var suggestion = lrGenSubjectSuggestion(subject);
  var difficulties = lrGetLessonDifficulties(chapters);

  var totalTime = 0, remainingTime = 0, remainingCount = 0;
  for (var ci = 0; ci < chapters.length; ci++) {
    totalTime += chapters[ci].duration || 60;
    if (!lrIsLessonComplete(subjectId, ci)) {
      remainingTime += chapters[ci].duration || 60;
      remainingCount++;
    }
  }

  var nextIdx = -1;
  for (var ni = 0; ni < chapters.length; ni++) {
    if (!lrIsLessonComplete(subjectId, ni)) { nextIdx = ni; break; }
  }

  var html = '<div class="page-container">';

  html += '<div style="margin-bottom:var(--space-6)">';
  html += '<button class="btn btn-ghost btn-sm" style="margin-bottom:var(--space-3);font-size:var(--text-xs)" data-action="lr:back">&#8592; All Subjects</button>';
  html += '<div class="glass-card" style="padding:var(--space-5)">';
  html += '<div style="display:flex;align-items:center;gap:var(--space-4);flex-wrap:wrap">';
  html += '<div style="width:56px;height:56px;border-radius:var(--radius-lg);background:' + (subject.color || '#3b82f6') + '20;display:flex;align-items:center;justify-content:center;font-size:2rem;border:2px solid ' + (subject.color || '#3b82f6') + '40">' + (subject.icon || '&#128218;') + '</div>';
  html += '<div style="flex:1;min-width:200px">';
  html += '<h1 style="font-size:var(--text-xl);font-weight:700;margin-bottom:2px">' + _U.sanitizeHTML(subject.name) + '</h1>';
  html += '<div style="font-size:var(--text-xs);color:var(--text-secondary)">Class ' + subject.class + ' &middot; ' + chapters.length + ' lessons &middot; ' + _U.formatDuration(totalTime) + ' total</div>';
  html += '</div>';
  html += '<div style="text-align:center;flex-shrink:0">';
  html += '<div style="font-size:var(--text-2xl);font-weight:700;color:' + (subject.color || '#3b82f6') + '">' + progress.pct + '%</div>';
  html += '<div style="font-size:var(--text-xs);color:var(--text-secondary)">' + progress.done + '/' + progress.total + ' complete</div>';
  html += '</div></div></div></div>';

  html += '<div class="glass-card" style="padding:var(--space-5);margin-bottom:var(--space-6)">';
  html += '<div style="display:flex;align-items:flex-start;gap:var(--space-3)">';
  html += '<div style="width:36px;height:36px;border-radius:var(--radius-full);background:linear-gradient(135deg,#8b5cf6,#ec4899);display:flex;align-items:center;justify-content:center;font-size:1rem;flex-shrink:0">&#129302;</div>';
  html += '<div style="flex:1;min-width:0">';
  html += '<div style="font-weight:600;font-size:var(--text-sm);margin-bottom:4px">AI Suggestion</div>';
  html += '<div style="font-size:var(--text-xs);color:var(--text-secondary);line-height:1.6">' + _U.sanitizeHTML(suggestion) + '</div>';
  if (nextIdx >= 0) {
    html += '<div style="margin-top:var(--space-3);padding:var(--space-3);background:var(--bg-glass);border-radius:var(--radius-md);border-left:3px solid var(--accent-blue)">';
    html += '<div style="font-size:var(--text-xs);color:var(--text-secondary);margin-bottom:2px">Recommended Next:</div>';
    html += '<div style="font-size:var(--text-sm);font-weight:600">' + _U.sanitizeHTML(chapters[nextIdx].name) + '</div>';
    html += '<button class="btn btn-primary btn-sm" style="margin-top:var(--space-2);font-size:var(--text-xs)" data-action="lr:startLesson:' + subjectId + ':' + nextIdx + '">Start Lesson &#8594;</button>';
    html += '</div>';
  }
  html += '</div></div></div>';

  html += '<div style="display:grid;grid-template-columns:repeat(3,1fr);gap:var(--space-3);margin-bottom:var(--space-6)">';
  html += '<div class="glass-card" style="padding:var(--space-4);text-align:center">';
  html += '<div style="font-size:var(--text-lg);font-weight:700;color:var(--accent-green)">' + progress.done + '</div>';
  html += '<div style="font-size:var(--text-xs);color:var(--text-secondary)">Completed</div></div>';
  html += '<div class="glass-card" style="padding:var(--space-4);text-align:center">';
  html += '<div style="font-size:var(--text-lg);font-weight:700;color:var(--accent-orange)">' + remainingCount + '</div>';
  html += '<div style="font-size:var(--text-xs);color:var(--text-secondary)">Remaining</div></div>';
  html += '<div class="glass-card" style="padding:var(--space-4);text-align:center">';
  html += '<div style="font-size:var(--text-lg);font-weight:700;color:var(--accent-blue)">' + _U.formatDuration(remainingTime) + '</div>';
  html += '<div style="font-size:var(--text-xs);color:var(--text-secondary)">Est. Time Left</div></div>';
  html += '</div>';

  html += '<div class="progress-bar" style="height:12px;margin-bottom:var(--space-6);border-radius:var(--radius-full)"><div class="progress-bar-fill" style="width:' + progress.pct + '%;background:' + (subject.color || '#3b82f6') + '"></div></div>';

  html += '<div class="section-header" style="margin-bottom:var(--space-4)"><h3 style="font-size:var(--text-lg);font-weight:600">&#128218; Learning Roadmap</h3></div>';

  html += '<div class="lr-timeline" style="position:relative;padding-left:40px;margin-bottom:var(--space-8)">';
  html += '<div class="lr-timeline-line" style="position:absolute;left:18px;top:0;bottom:0;width:3px;background:linear-gradient(to bottom,var(--accent-green),var(--accent-blue),var(--text-muted));border-radius:2px"></div>';

  for (var tli = 0; tli < chapters.length; tli++) {
    var ch = chapters[tli];
    var status = lrGetLessonStatus(subjectId, tli, chapters);
    var diff = difficulties[tli] || 'Medium';
    var estTime = ch.duration || 60;

    var dotColor = status === 'complete' ? 'var(--accent-green)' : (status === 'current' ? 'var(--accent-blue)' : (status === 'available' ? 'var(--accent-blue)' : 'var(--text-muted)'));
    var dotBg = status === 'complete' ? 'rgba(16,185,129,0.2)' : (status === 'current' ? 'rgba(59,130,246,0.2)' : (status === 'available' ? 'rgba(59,130,246,0.1)' : 'rgba(255,255,255,0.05)'));
    var dotIcon = status === 'complete' ? '&#10003;' : (status === 'current' ? '&#9654;' : (status === 'available' ? '&#9675;' : '&#128274;'));
    var cardOpacity = status === 'locked' ? 'opacity:0.5;' : '';
    var cardBorder = status === 'complete' ? 'border-left:3px solid var(--accent-green);' : (status === 'current' ? 'border-left:3px solid var(--accent-blue);' : (status === 'available' ? 'border-left:3px solid ' + (subject.color || '#3b82f6') + ';' : 'border-left:3px solid var(--text-muted);'));
    var isRecommended = (status === 'available' || status === 'current');

    html += '<div class="lr-timeline-step" style="position:relative;margin-bottom:var(--space-4)">';
    html += '<div class="lr-timeline-dot" style="position:absolute;left:-40px;top:14px;width:36px;height:36px;border-radius:50%;background:' + dotBg + ';border:2px solid ' + dotColor + ';display:flex;align-items:center;justify-content:center;font-size:0.8rem;color:' + dotColor + ';z-index:2;flex-shrink:0">' + dotIcon + '</div>';
    html += '<div class="glass-card" style="padding:var(--space-4);' + cardOpacity + cardBorder + (isRecommended ? 'box-shadow:0 0 12px ' + (subject.color || '#3b82f6') + '15;' : '') + '">';
    html += '<div style="display:flex;align-items:flex-start;justify-content:space-between;gap:var(--space-3);flex-wrap:wrap">';
    html += '<div style="flex:1;min-width:180px">';
    html += '<div style="display:flex;align-items:center;gap:var(--space-2);margin-bottom:var(--space-1)">';
    html += '<span style="font-size:var(--text-xs);color:var(--text-secondary);font-weight:500">Lesson ' + (tli + 1) + '</span>';
    if (status === 'complete') html += '<span style="font-size:0.65rem;padding:2px 8px;border-radius:var(--radius-full);background:rgba(16,185,129,0.15);color:var(--accent-green);font-weight:600">COMPLETE</span>';
    else if (status === 'current') html += '<span style="font-size:0.65rem;padding:2px 8px;border-radius:var(--radius-full);background:rgba(59,130,246,0.15);color:var(--accent-blue);font-weight:600">IN PROGRESS</span>';
    else if (status === 'available') html += '<span style="font-size:0.65rem;padding:2px 8px;border-radius:var(--radius-full);background:rgba(59,130,246,0.1);color:var(--accent-blue);font-weight:600">AVAILABLE</span>';
    else html += '<span style="font-size:0.65rem;padding:2px 8px;border-radius:var(--radius-full);background:rgba(255,255,255,0.05);color:var(--text-muted);font-weight:600">LOCKED</span>';
    html += '</div>';
    html += '<div style="font-weight:600;font-size:var(--text-sm);margin-bottom:var(--space-1)">' + _U.sanitizeHTML(ch.name) + '</div>';
    html += '<div style="display:flex;align-items:center;gap:var(--space-3);flex-wrap:wrap">';
    html += '<span style="font-size:var(--text-xs);color:var(--text-secondary)">&#9200; ' + estTime + ' min</span>';
    html += '<span style="font-size:var(--text-xs);padding:2px 8px;border-radius:var(--radius-full);background:var(--bg-glass);color:' + (diff === 'Easy' ? 'var(--accent-green)' : (diff === 'Hard' ? 'var(--accent-red)' : 'var(--accent-orange)')) + '">' + diff + '</span>';
    html += '<span style="font-size:var(--text-xs);color:var(--text-secondary)">' + (ch.topics || 4) + ' topics</span>';
    html += '</div></div>';
    html += '<div style="flex-shrink:0">';
    if (status === 'locked') {
      html += '<button class="btn btn-sm" disabled style="font-size:var(--text-xs);opacity:0.5;cursor:not-allowed">&#128274; Locked</button>';
    } else {
      html += '<button class="btn btn-primary btn-sm" style="font-size:var(--text-xs)" data-action="lr:startLesson:' + subjectId + ':' + tli + '">' + (status === 'complete' ? '&#128260; Review' : '&#9654; Start') + '</button>';
    }
    html += '</div></div></div></div>';
  }
  html += '</div>';

  html += '<div class="glass-card" style="padding:var(--space-6);text-align:center;margin-bottom:var(--space-8)">';
  if (progress.pct === 100) {
    html += '<div style="font-size:2.5rem;margin-bottom:var(--space-3)">&#127881;</div>';
    html += '<h3 style="font-size:var(--text-lg);font-weight:700;margin-bottom:var(--space-2);color:var(--accent-green)">Subject Complete!</h3>';
    html += '<p style="font-size:var(--text-sm);color:var(--text-secondary);margin-bottom:var(--space-4)">You have mastered ' + _U.sanitizeHTML(subject.name) + '! Excellent work on completing all ' + chapters.length + ' lessons.</p>';
    html += '<button class="btn btn-primary" data-action="lr:back">Explore More Subjects</button>';
  } else {
    html += '<div style="font-size:2.5rem;margin-bottom:var(--space-3)">&#128640;</div>';
    html += '<h3 style="font-size:var(--text-lg);font-weight:700;margin-bottom:var(--space-2)">Keep Going!</h3>';
    html += '<p style="font-size:var(--text-sm);color:var(--text-secondary)">You have completed ' + progress.done + ' of ' + progress.total + ' lessons. ' + remainingCount + ' more to go!</p>';
  }
  html += '</div></div>';

  mc.innerHTML = html;
}

/* ============================================================
   LESSON MODAL (12-step learning flow)
   ============================================================ */
function lrStartLesson(subjectId, chapterIdx) {
  var state = lrGetState();
  state.currentSubject = subjectId;
  state.currentLesson = chapterIdx;
  if (!state.inProgress) state.inProgress = {};
  state.inProgress[subjectId] = chapterIdx;
  lrSetState(state);
  lrRenderLessonModal(subjectId, chapterIdx);
}

function lrNextLesson() {
  var state = lrGetState();
  var chapters = _MD.chapters[state.currentSubject] || [];
  var nextIdx = (state.currentLesson || 0) + 1;
  if (nextIdx < chapters.length) {
    state.currentLesson = nextIdx;
    lrSetState(state);
    lrRenderLessonModal(state.currentSubject, nextIdx);
  } else {
    lrCloseModal();
    lrRenderSubjectPage(state.currentSubject);
  }
}

function lrPrevLesson() {
  var state = lrGetState();
  var prevIdx = (state.currentLesson || 0) - 1;
  if (prevIdx >= 0) {
    state.currentLesson = prevIdx;
    lrSetState(state);
    lrRenderLessonModal(state.currentSubject, prevIdx);
  }
}

function lrMarkAndRefresh(subjectId, chapterIdx) {
  var state = lrGetState();
  if (!state.completed) state.completed = {};
  var key = subjectId + '_' + chapterIdx;
  state.completed[key] = true;
  lrSetState(state);

  var stepPrefix = subjectId + '_' + chapterIdx + '_step_';
  var stored = _Store.get('lrSteps') || {};
  var types = ['notes','textbook','ppt','video','lab','practice','quiz','assignment','revision','mocktest','examready','complete'];
  for (var i = 0; i < types.length; i++) { stored[stepPrefix + types[i]] = true; }
  _Store.set('lrSteps', stored);

  var overlay = document.getElementById('lr-lesson-modal');
  if (overlay) overlay.remove();

  if (window.UI) window.UI.showToast('Lesson marked as complete!', 'success');

  var overlay2 = document.getElementById('lr-lesson-modal');
  if (!overlay2) lrRenderLessonModal(subjectId, chapterIdx);
}

function lrCloseModal() {
  var overlay = document.getElementById('lr-lesson-modal');
  if (overlay && overlay.parentNode) overlay.parentNode.removeChild(overlay);
  var state = lrGetState();
  if (state.currentSubject) lrRenderSubjectPage(state.currentSubject);
}

function lrRenderLessonModal(subjectId, chapterIdx) {
  var subjects = _MD.subjects || [];
  var subject = null;
  for (var i = 0; i < subjects.length; i++) {
    if (subjects[i].id === subjectId) { subject = subjects[i]; break; }
  }
  if (!subject) return;

  var chapters = _MD.chapters[subjectId] || [];
  var chapter = chapters[chapterIdx];
  if (!chapter) return;

  var totalSteps = 12;
  var completedSteps = 0;
  var stepKeyPrefix = subjectId + '_' + chapterIdx + '_step_';
  var storedSteps = _Store.get('lrSteps') || {};

  var overlay = document.createElement('div');
  overlay.id = 'lr-lesson-modal';
  overlay.style.cssText = 'position:fixed;inset:0;z-index:1000;display:flex;align-items:center;justify-content:center;background:rgba(0,0,0,0.7);backdrop-filter:blur(4px)';

  var modal = document.createElement('div');
  modal.style.cssText = 'background:var(--bg-secondary);border:1px solid var(--border-color);border-radius:var(--radius-xl);max-width:640px;width:95%;max-height:90vh;overflow-y:auto;padding:0;box-shadow:var(--shadow-xl)';

  var isComplete = lrIsLessonComplete(subjectId, chapterIdx);
  var diff = chapterIdx < chapters.length * 0.3 ? 'Easy' : (chapterIdx < chapters.length * 0.7 ? 'Medium' : 'Hard');
  var suggestion = lrGenLessonSuggestion(chapter, subject, chapterIdx, chapters.length);
  var isScience = (subject.id === 2 || subject.id === 7 || subject.id === 8);

  var mHtml = '';

  mHtml += '<div style="padding:var(--space-5);border-bottom:1px solid var(--border-color);display:flex;align-items:flex-start;justify-content:space-between;gap:var(--space-3)">';
  mHtml += '<div style="flex:1;min-width:0">';
  mHtml += '<div style="display:flex;align-items:center;gap:var(--space-2);margin-bottom:var(--space-1)">';
  mHtml += '<span style="font-size:var(--text-xs);color:var(--text-secondary)">Lesson ' + (chapterIdx + 1) + ' of ' + chapters.length + '</span>';
  mHtml += '<span style="font-size:0.65rem;padding:2px 8px;border-radius:var(--radius-full);background:var(--bg-glass);color:' + (diff === 'Easy' ? 'var(--accent-green)' : (diff === 'Hard' ? 'var(--accent-red)' : 'var(--accent-orange)')) + '">' + diff + '</span>';
  mHtml += '</div>';
  mHtml += '<h3 style="font-size:var(--text-lg);font-weight:700">' + _U.sanitizeHTML(chapter.name) + '</h3>';
  mHtml += '<div style="font-size:var(--text-xs);color:var(--text-secondary);margin-top:2px">&#9200; ~' + (chapter.duration || 60) + ' min &middot; ' + (chapter.topics || 4) + ' topics</div>';
  mHtml += '</div>';
  mHtml += '<div class="lr-modal-check" style="flex-shrink:0;width:40px;height:40px;border-radius:50%;display:flex;align-items:center;justify-content:center;background:var(--bg-glass)">';
  mHtml += isComplete ? '<span style="color:var(--accent-green);font-size:1.5rem">&#10003;</span>' : '<span style="color:var(--text-muted);font-size:0.9rem;opacity:0.4">&#9675;</span>';
  mHtml += '</div></div>';

  mHtml += '<div style="padding:var(--space-4);border-bottom:1px solid var(--border-color)">';
  mHtml += '<div style="display:flex;align-items:center;gap:var(--space-2);margin-bottom:var(--space-3)">';
  mHtml += '<div style="width:28px;height:28px;border-radius:50%;background:linear-gradient(135deg,#8b5cf6,#ec4899);display:flex;align-items:center;justify-content:center;font-size:0.75rem;flex-shrink:0">&#129302;</div>';
  mHtml += '<span style="font-size:var(--text-xs);font-weight:600;color:var(--accent-purple)">AI Suggestion for this lesson</span>';
  mHtml += '</div>';
  mHtml += '<p style="font-size:var(--text-xs);color:var(--text-secondary);line-height:1.6">' + _U.sanitizeHTML(suggestion) + '</p>';
  mHtml += '</div>';

  mHtml += '<div style="padding:var(--space-4)">';
  mHtml += '<div style="font-size:var(--text-sm);font-weight:600;margin-bottom:var(--space-3)">Learning Steps</div>';

  var steps = [
    { icon: '&#128221;', label: 'Quick Notes', desc: 'Review the key concepts and notes', type: 'notes' },
    { icon: '&#128218;', label: 'Textbook', desc: 'Read the relevant textbook section', type: 'textbook' },
    { icon: '&#128247;', label: 'PPT / Slides', desc: 'Go through the presentation slides', type: 'ppt' },
    { icon: '&#127916;', label: 'Video', desc: 'Watch the video lesson for this topic', type: 'video' }
  ];
  if (isScience) {
    steps.push({ icon: '&#128300;', label: 'Virtual Lab', desc: 'Perform virtual experiments', type: 'lab' });
  }
  steps.push(
    { icon: '&#9997;', label: 'Practice Questions', desc: 'Solve practice problems for this lesson', type: 'practice' },
    { icon: '&#128220;', label: 'Quiz', desc: 'Take the quiz to test your understanding', type: 'quiz' },
    { icon: '&#128203;', label: 'Assignment', desc: 'Complete the assignment for this lesson', type: 'assignment' },
    { icon: '&#128260;', label: 'Revision', desc: 'Revise all the concepts covered', type: 'revision' },
    { icon: '&#128225;', label: 'Mock Test', desc: 'Take a timed mock test for this lesson', type: 'mocktest' },
    { icon: '&#127942;', label: 'Exam Ready', desc: 'You are prepared for the exam on this topic!', type: 'examready' },
    { icon: '&#10004;', label: 'Complete', desc: 'Mark this lesson as fully completed', type: 'complete' }
  );

  for (var si = 0; si < steps.length; si++) {
    var step = steps[si];
    var stepKey = stepKeyPrefix + step.type;
    var stepDone = !!storedSteps[stepKey];
    if (stepDone) completedSteps++;

    mHtml += '<div style="display:flex;align-items:center;gap:var(--space-3);padding:var(--space-3);margin-bottom:var(--space-2);border-radius:var(--radius-md);background:' + (stepDone ? 'rgba(16,185,129,0.08)' : 'var(--bg-glass)') + ';border:1px solid ' + (stepDone ? 'rgba(16,185,129,0.2)' : 'var(--border-color)') + ';transition:all 0.2s">';
    mHtml += '<div style="font-size:1.1rem;width:28px;text-align:center;flex-shrink:0">' + (stepDone ? '<span style="color:var(--accent-green)">&#10003;</span>' : step.icon) + '</div>';
    mHtml += '<div style="flex:1;min-width:0">';
    mHtml += '<div style="font-size:var(--text-sm);font-weight:500;color:' + (stepDone ? 'var(--accent-green)' : 'var(--text-primary)') + '">' + step.label + '</div>';
    mHtml += '<div style="font-size:var(--text-xs);color:var(--text-tertiary)">' + step.desc + '</div>';
    mHtml += '</div>';
    mHtml += '<div>';
    if (step.type === 'notes' || step.type === 'textbook' || step.type === 'ppt' || step.type === 'video' || step.type === 'practice' || step.type === 'quiz') {
      mHtml += '<button class="btn btn-ghost btn-sm" style="font-size:var(--text-xs);padding:4px 10px" data-action="lr:resource:' + subjectId + ':' + step.type + '">' + (stepDone ? '&#128260; Review' : '&#8594; Open') + '</button>';
    } else {
      mHtml += '<button class="btn btn-ghost btn-sm" style="font-size:var(--text-xs);padding:4px 10px">' + (stepDone ? '&#128260; Review' : '&#8594; Start') + '</button>';
    }
    mHtml += '</div></div>';
  }

  var stepPct = Math.round((completedSteps / totalSteps) * 100);
  mHtml += '<div style="margin-top:var(--space-3)">';
  mHtml += '<div style="display:flex;justify-content:space-between;margin-bottom:var(--space-1)">';
  mHtml += '<span style="font-size:var(--text-xs);color:var(--text-secondary)">Lesson Progress</span>';
  mHtml += '<span style="font-size:var(--text-xs);font-weight:600">' + completedSteps + '/' + totalSteps + ' steps (' + stepPct + '%)</span>';
  mHtml += '</div>';
  mHtml += '<div class="progress-bar" style="height:6px"><div class="progress-bar-fill" style="width:' + stepPct + '%"></div></div>';
  mHtml += '</div></div>';

  mHtml += '<div style="padding:var(--space-4);border-top:1px solid var(--border-color);display:flex;gap:var(--space-3);flex-wrap:wrap;align-items:center;justify-content:space-between">';
  mHtml += '<div style="display:flex;gap:var(--space-2)">';
  if (chapterIdx > 0) mHtml += '<button class="btn btn-ghost btn-sm" style="font-size:var(--text-xs)" data-action="lr:prevLesson">&#8592; Previous</button>';
  if (chapterIdx < chapters.length - 1) mHtml += '<button class="btn btn-secondary btn-sm" style="font-size:var(--text-xs)" data-action="lr:nextLesson">Next &#8594;</button>';
  mHtml += '</div>';
  mHtml += '<div style="display:flex;gap:var(--space-2)">';
  if (!isComplete) mHtml += '<button class="btn btn-primary btn-sm" style="font-size:var(--text-xs)" data-action="lr:markComplete:' + subjectId + ':' + chapterIdx + '">&#10003; Mark Complete</button>';
  mHtml += '<button class="btn btn-ghost btn-sm" style="font-size:var(--text-xs)" data-action="lr:closeModal">&#10005; Close</button>';
  mHtml += '</div></div>';

  modal.innerHTML = mHtml;
  overlay.appendChild(modal);
  document.body.appendChild(overlay);

  overlay.addEventListener('click', function(e) {
    if (e.target === overlay) lrCloseModal();
  });
}

/* ============================================================
   STEP COMPLETION HELPERS
   ============================================================ */
(function() {
  var _stepsStoreKey = 'lrSteps';

  window._lrMarkStep = function(subjectId, chapterIdx, stepType) {
    var stored = _Store.get(_stepsStoreKey) || {};
    var key = subjectId + '_' + chapterIdx + '_step_' + stepType;
    stored[key] = true;
    _Store.set(_stepsStoreKey, stored);
  };

  window._lrGetStepCompletion = function(subjectId, chapterIdx) {
    var stored = _Store.get(_stepsStoreKey) || {};
    var prefix = subjectId + '_' + chapterIdx + '_step_';
    var total = 12;
    var done = 0;
    var types = ['notes','textbook','ppt','video','lab','practice','quiz','assignment','revision','mocktest','examready','complete'];
    for (var i = 0; i < types.length; i++) {
      if (stored[prefix + types[i]]) done++;
    }
    return { done: done, total: total, pct: Math.round((done / total) * 100) };
  };
})();
