window.renderPage = window.renderPage || {};

var _U = window.Utils;
var _MD = window.mockData;
var _Store = window.Store;

/* ===== EVENT DELEGATION ===== */

document.addEventListener('click', function(e) {
  var t = e.target.closest('[data-action^="subj:"]');
  if (!t) return;
  var p = t.getAttribute('data-action').split(':');
  var c = p[1], a = p[2], b = p[3], d = p[4], ev = p[5], f = p[6];
  if (c === 'detail' && a) { location.hash = '#/subject/' + a; }
  if (c === 'back') { location.hash = '#/dashboard'; }
  if (c === 'navigate' && a) { location.hash = a; }
  if (c === 'lesson' && a && b) { location.hash = '#/subject/' + a + '/lesson/' + b; }
  if (c === 'topic' && a && b && d) { location.hash = '#/subject/' + a + '/lesson/' + b + '/topic/' + d; }
  if (c === 'resource' && a && b && d) { window.renderPage.showLessonResource(a, b, d); }
  if (c === 'resDownload' && a) { window.renderPage.downloadLessonResource(a); }
  if (c === 'resPreview' && a) { window.renderPage.previewLessonResource(a); }
  if (c === 'resBookmark' && a) { window.renderPage.toggleLessonResourceBookmark(a, t); }
  if (c === 'resShare' && a) { window.renderPage.shareLessonResource(a); }
  if (c === 'tab' && a && b) { window.renderPage.switchSubjectTab(a, b); }
  if (c === 'topicTab' && a && b && d && ev) { window.renderPage.switchTopicTab(a, b, d, ev); }
  if (c === 'bookmark' && a) { window.renderPage.toggleTopicBookmark(a, t); }
  if (c === 'topicComplete' && a && b && d) { window.renderPage.toggleTopicComplete(a, b, d, t); }
  if (c === 'openVideo' && a) { window.renderPage.openVideoPlayer(a); }
  if (c === 'closeModal') { var m = t.closest('.modal-overlay'); if (m) m.remove(); }
  if (c === 'aiHelper' && a && b && d) { window.renderPage.openAIHelper(a, b, d); }
  if (c === 'askTeacher' && a && b && d) { window.renderPage.openAskTeacher(a, b, d); }
});

/* ===== HELPERS ===== */

function _findSubject(id) {
  var subs = _MD.subjects;
  if (!subs) return null;
  for (var si = 0; si < subs.length; si++) { if (subs[si].id === id) return subs[si]; }
  return null;
}

function _getChapters(sid) { return (_MD.chapters && _MD.chapters[sid]) || []; }

function _getTopics(sid, chId) { return (_MD.topics && _MD.topics[sid] && _MD.topics[sid][chId]) || []; }

function _calcSubjectProgress(sid) {
  var chs = _getChapters(sid);
  var totalTp = 0, doneTp = 0, totalCh = chs.length, doneCh = 0;
  for (var ci = 0; ci < chs.length; ci++) {
    var tops = _getTopics(sid, chs[ci].id);
    var chDone = 0;
    for (var ti = 0; ti < tops.length; ti++) { totalTp++; if (tops[ti].completed) { doneTp++; chDone++; } }
    if (tops.length > 0 && chDone === tops.length) doneCh++;
  }
  var pct = totalTp > 0 ? Math.round((doneTp / totalTp) * 100) : 0;
  return { totalCh: totalCh, doneCh: doneCh, totalTp: totalTp, doneTp: doneTp, pct: pct };
}

function _calcLessonProgress(sid, lessonId) {
  var tops = _getTopics(sid, lessonId);
  var done = 0;
  for (var ti = 0; ti < tops.length; ti++) { if (tops[ti].completed) done++; }
  var pct = tops.length > 0 ? Math.round((done / tops.length) * 100) : 0;
  return { total: tops.length, done: done, pct: pct };
}

function _findFirstIncomplete(sid) {
  var chs = _getChapters(sid);
  for (var ci = 0; ci < chs.length; ci++) {
    var tops = _getTopics(sid, chs[ci].id);
    for (var ti = 0; ti < tops.length; ti++) {
      if (!tops[ti].completed) return { lessonId: chs[ci].id, topicId: tops[ti].id };
    }
  }
  return null;
}

function _getTopicBookmarks() { return _Store.get('topicBookmarks') || []; }

function _isTopicBookmarked(tpId) {
  var bks = _getTopicBookmarks();
  for (var bi = 0; bi < bks.length; bi++) { if (bks[bi] === tpId) return true; }
  return false;
}

function _getFirstTeacher() {
  var users = _MD.users || [];
  for (var ui = 0; ui < users.length; ui++) { if (users[ui].role === 'teacher') return users[ui].name; }
  return 'Dr. Meera Joshi';
}

function _gradient(idx) {
  var g = ['linear-gradient(135deg,#3b82f6,#8b5cf6)','linear-gradient(135deg,#8b5cf6,#ec4899)','linear-gradient(135deg,#06b6d4,#3b82f6)','linear-gradient(135deg,#f97316,#ec4899)','linear-gradient(135deg,#10b981,#06b6d4)','linear-gradient(135deg,#f59e0b,#f97316)'];
  return g[idx % 6];
}

function _difficultyBadge(lvl) {
  var m = { beginner:'badge-green', intermediate:'badge-yellow', advanced:'badge-red' };
  return m[lvl] || 'badge-green';
}

/* ===== SKELETON ===== */

function _renderSkeleton() {
  var html = '<div class="c-flex-center" style="flex-direction:column;gap:var(--space-4);padding:var(--space-16)"><div class="c-w-40 c-h-40 c-radius-lg c-bg-glass" style="animation:pulse 1.5s ease-in-out infinite"></div><div style="width:160px;height:20px;border-radius:4px;background:var(--bg-glass);animation:pulse 1.5s ease-in-out infinite"></div><div style="width:240px;height:8px;border-radius:4px;background:var(--bg-glass);animation:pulse 1.5s ease-in-out infinite"></div></div>';
  return html;
}

/* ===== LEVEL 1: SUBJECT GRID (/dashboard/:classId) ===== */

window.renderPage.dashboardClass = function(params) {
  var mc = document.getElementById('main-content');
  if (!mc) return;
  var user = _Store.get('user');
  if (!user) { window.Router.navigate('/login'); return; }
  var classId = params.classId || user.class || 6;
  var subs = _MD.subjects || [];
  var filtered = [];
  for (var si = 0; si < subs.length; si++) {
    if (subs[si].class == classId) {
      if (classId >= 11 && subs[si].stream && user.stream && subs[si].stream !== user.stream) continue;
      filtered.push(subs[si]);
    }
  }
  mc.innerHTML = _renderSkeleton();
  setTimeout(function() {
    var html = '<div class="animate-fadeInUp">';
    html += '<div class="section-header mb-6"><h2 class="section-title">Your Subjects</h2><span class="c-fs-sm c-text-tertiary">Class ' + classId + '</span></div>';
    if (filtered.length === 0) {
      html += '<div class="empty-state"><div class="empty-state-icon">&#128218;</div><h3 class="empty-state-title">No Subjects Available</h3><p class="empty-state-text">There are no subjects configured for your class' + (classId >= 11 && user && user.stream ? ' and ' + user.stream + ' stream' : '') + '.</p></div>';
    } else {
      html += '<div class="grid grid-cols-4 gap-5">';
      for (var fi = 0; fi < filtered.length; fi++) {
        var sub = filtered[fi];
        var chs = _getChapters(sub.id);
        var first = _findFirstIncomplete(sub.id);
        var firstLesson = first ? first.lessonId : (chs.length > 0 ? chs[0].id : '');
        var prog = _calcSubjectProgress(sub.id);
        var color = sub.color || '#3b82f6';
        var continueLabel = 'Continue Learning';
        var continueAction = 'subj:lesson:' + sub.id + ':' + firstLesson;
        if (!first) { continueLabel = 'View Details'; continueAction = 'subj:detail:' + sub.id; }
        html += '<div class="glass-card c-overflow-hidden c-pointer c-transition" data-action="subj:detail:' + sub.id + '"><div class="c-flex-center c-flex-gap-3 c-relative c-overflow-hidden" style="padding:var(--space-5);flex-direction:column;text-align:center">';
        html += '<div class="c-absolute" style="top:-20px;right:-20px;font-size:120px;opacity:0.05;color:' + color + '">' + sub.icon + '</div>';
        html += '<div class="c-fs-xl" style="font-size:80px;line-height:1;margin-bottom:var(--space-1)">' + sub.icon + '</div>';
        html += '<h3 class="text-lg font-bold">' + _U.sanitizeHTML(sub.name) + '</h3>';
        html += '<div class="c-fs-xs c-text-tertiary">ID: SUBJ-' + sub.id + '</div>';
        html += '<div style="width:100%;max-width:200px"><div class="progress-bar"><div class="progress-bar-fill progress-fill-blue" style="width:' + prog.pct + '%;background:' + color + '"></div></div><div class="c-fs-xs c-text-tertiary c-mt-2">' + prog.doneCh + '/' + prog.totalCh + ' chapters</div></div>';
        if (firstLesson) {
          html += '<button class="btn btn-primary btn-sm" data-action="' + continueAction + '">' + continueLabel + '</button>';
        }
        html += '</div></div>';
      }
      html += '</div>';
    }
  html += '</div>';
  mc.innerHTML = html;
  }, 80);
};

/* ===== LEVEL 2: SUBJECT DETAIL (/subject/:id) ===== */

window.renderPage.subject = function(params) {
  var mc = document.getElementById('main-content');
  if (!mc) return;
  var sub = _findSubject(params.id);
  if (!sub) {
    mc.innerHTML = '<div class="animate-fadeInUp"><div class="empty-state"><div class="empty-state-icon">&#128269;</div><h3 class="empty-state-title">Subject Not Found</h3><p class="empty-state-text">The subject you are looking for does not exist.</p><button class="btn btn-primary" data-action="subj:back">Go to Dashboard</button></div></div>';
    return;
  }
  var user = _Store.get('user');
  var chs = _getChapters(sub.id);
  var teacherName = _getFirstTeacher();
  var prog = _calcSubjectProgress(sub.id);
  var xp = Math.round(prog.doneTp * 25 + prog.doneCh * 50);
  var color = sub.color || '#3b82f6';
  var first = _findFirstIncomplete(sub.id);

  var html = '<div class="animate-fadeInUp">';
  html += '<div class="c-flex-center c-flex-gap-2 c-mb-4"><span class="c-fs-sm c-text-secondary c-pointer" data-action="subj:navigate:#/dashboard/' + (user ? user.class || 6 : 6) + '">Dashboard</span><span class="c-fs-sm c-text-tertiary">/</span><span class="c-fs-sm c-text-primary c-fw-medium">' + _U.sanitizeHTML(sub.name) + '</span></div>';

  /* Continue Learning Banner */
  var lastView = _Store.get('lastViewed_' + sub.id);
  if (lastView && lastView.topicName && prog.doneTp < prog.totalTp) {
    html += '<div class="glass-card p-4 mb-4" style="border-left:4px solid var(--accent-blue);background:linear-gradient(135deg,var(--accent-blue)11,transparent)"><div class="c-flex-between c-flex-wrap" style="gap:var(--space-3)"><div class="c-flex-center c-flex-gap-3"><div class="c-fs-xl">&#128218;</div><div><div class="c-fs-sm c-fw-medium">Continue Learning</div><div class="c-fs-xs c-text-secondary">You were learning: <strong>' + _U.sanitizeHTML(lastView.topicName) + '</strong> in ' + _U.sanitizeHTML(lastView.lessonName) + '</div></div></div><button class="btn btn-primary btn-sm" data-action="subj:topic:' + sub.id + ':' + lastView.lessonId + ':' + lastView.topicId + '">&#9654; Continue</button></div></div>';
  }

  /* Header */
   html += '<div class="glass-card p-6 mb-4" style="border-left:4px solid ' + color + '"><div class="c-flex-between c-flex-wrap" style="gap:var(--space-4)"><div class="c-flex-center c-flex-gap-4"><div class="c-w-32 c-h-32 c-radius-lg c-flex-center" style="background:' + color + '22;font-size:1.75rem">' + sub.icon + '</div><div><h1 class="text-xl font-bold mb-1">' + _U.sanitizeHTML(sub.name) + '</h1><div class="c-fs-xs c-text-tertiary">ID: SUBJ-' + sub.id + '</div><div class="c-flex-center c-flex-gap-3 c-fs-xs c-text-secondary c-mt-1"><span>Class ' + sub.class + '</span><span>&#183;</span><span>' + _U.sanitizeHTML(teacherName) + '</span><span>&#183;</span><span>' + chs.length + ' Lessons</span></div></div></div>';
  if (first) {
    html += '<button class="btn btn-primary btn-sm" data-action="subj:lesson:' + sub.id + ':' + first.lessonId + '">Continue Learning</button>';
  }
  html += '</div></div>';

  /* Progress */
  html += '<div class="glass-card p-5 mb-4"><div class="c-flex-between c-mb-2"><span class="c-fs-sm c-fw-medium">Subject Progress</span><span class="c-fs-sm c-fw-bold" style="color:' + color + '">' + prog.pct + '%</span></div><div class="progress-bar"><div class="progress-bar-fill" style="width:' + prog.pct + '%;background:' + color + '"></div></div><div class="c-flex-center c-flex-gap-4 c-mt-2 c-fs-xs c-text-tertiary"><span>' + prog.doneCh + '/' + prog.totalCh + ' lessons completed</span><span>&#183;</span><span>' + prog.doneTp + '/' + prog.totalTp + ' topics mastered</span><span>&#183;</span><span>&#10024; ' + xp + ' XP earned</span></div></div>';

  /* Learning Path */
  html += _renderLearningPath(sub.id, sub);

  html += '<div id="subject-tab-content">' + _renderLessonsTab(sub.id) + '</div>';
  html += '</div>';
  mc.innerHTML = html;
};

function _renderLearningPath(sid, sub) {
  var chs = _getChapters(sid);
  var doneCh = 0;
  for (var ci = 0; ci < chs.length; ci++) {
    var p = _calcLessonProgress(sid, chs[ci].id);
    if (p.total > 0 && p.done === p.total) doneCh++;
  }
  var steps = [
    { label: _U.sanitizeHTML(sub.name), icon: sub.icon, status: 'done' },
    { label: 'Lesson ' + doneCh + '/' + chs.length, icon: '&#128214;', status: doneCh > 0 ? 'done' : 'active' },
    { label: 'Topic', icon: '&#128196;', status: 'upcoming' },
    { label: 'Learn', icon: '&#128218;', status: 'upcoming' },
    { label: 'Practice', icon: '&#9997;&#65039;', status: 'upcoming' },
    { label: 'Quiz', icon: '&#128221;', status: 'upcoming' },
    { label: 'Assessment', icon: '&#127891;', status: 'upcoming' },
    { label: 'Certificate', icon: '&#127942;', status: 'upcoming' }
  ];
  var pathCls = 'c-learning-path';
  if (_Store.get('theme') === 'dark') pathCls += ' c-learning-path-dark';
  var html = '<div class="glass-card p-5 mb-4"><div class="' + pathCls + '">';
  for (var si = 0; si < steps.length; si++) {
    var s = steps[si];
    html += '<div class="c-path-step c-path-' + s.status + '"><div class="c-path-icon">' + s.icon + '</div><div class="c-path-label">' + s.label + '</div></div>';
    if (si < steps.length - 1) html += '<div class="c-path-connector c-path-conn-' + s.status + '"></div>';
  }
  html += '</div></div>';
  return html;
}

function _renderSubjectTabs(sid, active) {
  return '';
}

function _renderLessonsTab(sid) {
  var chs = _getChapters(sid);
  if (chs.length === 0) {
    return '<div class="empty-state"><div class="empty-state-icon">&#128214;</div><h3 class="empty-state-title">No Lessons Available</h3><p class="empty-state-text">There are no lessons for this subject.</p></div>';
  }
  var html = '<div class="c-lesson-list">';
  for (var ci = 0; ci < chs.length; ci++) {
    var ch = chs[ci];
    html += _renderLessonCard(sid, ch, ci);
  }
  html += '</div>';
  return html;
}

function _renderLessonCard(sid, ch, idx) {
  var tops = _getTopics(sid, ch.id);
  var prog = _calcLessonProgress(sid, ch.id);
  var allDone = tops.length > 0 && prog.done === tops.length;
  var difficulty = 'beginner';
  if (idx % 3 === 1) difficulty = 'intermediate';
  if (idx % 3 === 2) difficulty = 'advanced';
  var duration = ch.duration || 45;

  var html = '<div class="glass-card c-overflow-hidden c-mb-3 c-pointer" data-action="subj:lesson:' + sid + ':' + ch.id + '">';
   html += '<div class="" style="padding:var(--space-5)"><div class="c-flex-between c-flex-wrap" style="gap:var(--space-3)"><div class="c-flex-center c-flex-gap-3"><div class="c-flex-center c-fw-bold c-fs-sm" style="width:40px;height:40px;border-radius:var(--radius-md);background:' + (allDone ? 'var(--accent-green)' : 'var(--bg-glass)') + ';color:' + (allDone ? 'white' : 'var(--text-secondary)') + '">' + ch.order + '</div><div><div class="c-fw-semibold">Lesson ' + ch.order + ': ' + _U.sanitizeHTML(ch.name) + '</div><div class="c-fs-xs c-text-tertiary c-mt-1">ID: LESS-' + sid + '-' + ch.id + '</div><div class="c-flex-center c-flex-gap-2 c-fs-xs c-text-tertiary c-mt-1"><span>&#9201;&#65039; ' + _U.formatDuration(duration) + '</span><span class="badge ' + _difficultyBadge(difficulty) + '">' + difficulty + '</span></div></div></div><div class="c-fs-sm c-fw-medium" style="color:var(--accent-blue)">' + prog.pct + '%</div></div>';
  html += '<div class="c-mt-3"><div class="progress-bar"><div class="progress-bar-fill" style="width:' + prog.pct + '%;background:' + (allDone ? 'var(--accent-green)' : 'var(--accent-blue)') + '"></div></div></div>';
  html += '</div></div>';
  return html;
}

/* ===== SUBJECT TAB SWITCHING ===== */

window.renderPage.switchSubjectTab = function(sid, tab) {
  var tabContent = document.getElementById('subject-tab-content');
  if (!tabContent) return;
  tabContent.innerHTML = _renderLessonsTab(sid);
};

/* ===== LEVEL 3: LESSON DETAIL (/subject/:id/lesson/:lessonId) ===== */

window.renderPage.chapter = function(params) {
  var lessonId = params.lessonId || params.chapterId;
  var mc = document.getElementById('main-content');
  if (!mc) return;
  var sub = _findSubject(params.id);
  if (!sub) {
    mc.innerHTML = '<div class="animate-fadeInUp"><div class="empty-state"><div class="empty-state-icon">&#128269;</div><h3 class="empty-state-title">Subject Not Found</h3><button class="btn btn-primary" data-action="subj:back">Go to Dashboard</button></div></div>';
    return;
  }
  var chs = _getChapters(sub.id);
  var ch = null;
  for (var ci = 0; ci < chs.length; ci++) { if (chs[ci].id === lessonId) { ch = chs[ci]; break; } }
  if (!ch) {
    mc.innerHTML = '<div class="animate-fadeInUp"><div class="empty-state"><div class="empty-state-icon">&#128269;</div><h3 class="empty-state-title">Lesson Not Found</h3><button class="btn btn-primary" data-action="subj:detail:' + params.id + '">Back to Subject</button></div></div>';
    return;
  }
  var tops = _getTopics(sub.id, ch.id);
  var prog = _calcLessonProgress(sub.id, ch.id);
  var color = sub.color || '#3b82f6';
  var difficulty = chs.indexOf(ch) % 3 === 0 ? 'beginner' : chs.indexOf(ch) % 3 === 1 ? 'intermediate' : 'advanced';
  var duration = ch.duration || 45;

  var html = '<div class="animate-fadeInUp">';
  html += '<div class="c-flex-center c-flex-gap-2 c-mb-4"><span class="c-fs-sm c-text-secondary c-pointer" data-action="subj:detail:' + sub.id + '">' + _U.sanitizeHTML(sub.name) + '</span><span class="c-fs-sm c-text-tertiary">/</span><span class="c-fs-sm c-text-primary c-fw-medium">' + _U.sanitizeHTML(ch.name) + '</span></div>';

   html += '<div class="glass-card p-6 mb-4" style="border-left:4px solid ' + color + '"><div class="c-flex-between c-flex-wrap" style="gap:var(--space-4)"><div><h1 class="text-lg font-bold mb-1">' + _U.sanitizeHTML(ch.name) + '</h1><div class="c-fs-xs c-text-tertiary c-mt-1">ID: LESS-' + sub.id + '-' + ch.id + '</div><div class="c-flex-center c-flex-gap-2 c-fs-xs c-text-secondary c-mt-1"><span>&#9201;&#65039; ' + _U.formatDuration(duration) + '</span><span class="badge ' + _difficultyBadge(difficulty) + '">' + difficulty + '</span><span>&#183;</span><span>' + prog.pct + '% complete</span></div></div></div></div>';

  html += '<div class="section-header mb-3"><h3 class="section-title">Learning Resources</h3></div>';
  html += '<div id="lesson-resources">' + _renderLessonResources(sub.id, ch.id) + '</div>';
  html += '</div>';
  mc.innerHTML = html;
};

function _renderLessonResources(sid, chId) {
  var itemId = 1;
  var types = ['Textbook', 'Quick Notes', 'PPT'];
  var icons = ['&#128214;', '&#128221;', '&#128202;'];
  var colors = ['#3b82f6', '#10b981', '#f97316'];
  var html = '<div class="grid grid-cols-auto gap-4">';
  for (var ti = 0; ti < types.length; ti++) {
    var rid = 'LR-' + sid + '-' + chId + '-' + (ti + 1);
    var resBms = _Store.get('lessonResourceBookmarks') || [];
    var isBm = false;
    for (var bi = 0; bi < resBms.length; bi++) { if (resBms[bi] === rid) { isBm = true; break; } }
    html += '<div class="glass-card c-overflow-hidden">';
    html += '<div class="c-flex-center" style="height:100px;background:linear-gradient(135deg,' + colors[ti] + '22,' + colors[ti] + '44);font-size:2.5rem">' + icons[ti] + '</div>';
    html += '<div style="padding:var(--space-4)"><div class="c-fw-semibold c-fs-sm c-mb-2">' + types[ti] + '</div>';
    html += '<div class="c-fs-xs c-text-tertiary c-mb-3">Resource ID: ' + rid + '</div>';
    html += '<div class="c-flex-center c-flex-gap-2 c-flex-wrap">';
    html += '<button class="btn btn-sm btn-ghost" data-action="subj:resPreview:' + rid + '" title="Preview">&#128065; Preview</button>';
    html += '<button class="btn btn-sm btn-ghost" data-action="subj:resDownload:' + rid + '" title="Download">&#11014; Download</button>';
    html += '<button class="btn btn-sm btn-ghost" data-action="subj:resBookmark:' + rid + '" title="Bookmark" style="color:' + (isBm ? 'var(--accent-yellow)' : 'var(--text-tertiary)') + '">' + (isBm ? '&#9733;' : '&#9734;') + '</button>';
    html += '<button class="btn btn-sm btn-ghost" data-action="subj:resShare:' + rid + '" title="Share">&#128279;</button>';
    html += '</div>';
    html += '<div class="c-mt-3"><div class="progress-bar"><div class="progress-bar-fill" style="width:0%;background:' + colors[ti] + '"></div></div><div class="c-fs-xs c-text-tertiary c-mt-1">0%</div></div>';
    html += '</div></div>';
  }
  html += '</div>';
  return html;
}

window.renderPage.showLessonResource = function(sid, chId, rid) {
  var overlay = document.createElement('div');
  overlay.className = 'modal-overlay';
  overlay.innerHTML = '<div class="modal" style="max-width:640px"><div class="modal-header"><h3 class="text-lg font-semibold">' + rid + '</h3><button class="btn btn-icon btn-ghost" data-action="subj:closeModal">&#10005;</button></div><div class="modal-body"><div class="c-flex-center" style="min-height:200px;background:var(--bg-glass);border-radius:var(--radius-lg);flex-direction:column;padding:var(--space-6)"><div class="c-fs-2xl c-mb-3">&#128214;</div><p class="c-fs-sm c-text-secondary c-text-center">Resource content preview for<br><strong>' + rid + '</strong></p></div></div></div>';
  overlay.addEventListener('click', function(e) { if (e.target === overlay) overlay.remove(); });
  document.body.appendChild(overlay);
};

window.renderPage.downloadLessonResource = function(rid) {
  if (window.showToast) window.showToast('Downloading ' + rid + '...', 'success');
  var dl = _Store.get('downloads') || [];
  dl.push({ id: rid, title: rid, type: 'pdf', size: '1.5 MB', date: new Date().toISOString(), status: 'downloaded', progress: 100 });
  _Store.set('downloads', dl);
};

window.renderPage.previewLessonResource = function(rid) {
  window.renderPage.showLessonResource(null, null, rid);
};

window.renderPage.toggleLessonResourceBookmark = function(rid, el) {
  var bms = _Store.get('lessonResourceBookmarks') || [];
  var found = false;
  for (var bi = 0; bi < bms.length; bi++) { if (bms[bi] === rid) { bms.splice(bi, 1); found = true; break; } }
  if (!found) bms.push(rid);
  _Store.set('lessonResourceBookmarks', bms);
  if (el) { el.innerHTML = found ? '&#9734;' : '&#9733;'; el.style.color = found ? 'var(--text-tertiary)' : 'var(--accent-yellow)'; }
};

window.renderPage.shareLessonResource = function(rid) {
  if (navigator.share) { navigator.share({ title: rid, text: 'Check out this resource: ' + rid, url: window.location.href }); }
  else if (window.showToast) window.showToast('Link copied to clipboard!', 'success');
};

/* ===== LEVEL 4: TOPIC DETAIL (/subject/:id/lesson/:lessonId/topic/:topicId) ===== */

window.renderPage.topic = function(params) {
  var mc = document.getElementById('main-content');
  if (!mc) return;
  var sub = _findSubject(params.id);
  if (!sub) {
    mc.innerHTML = '<div class="animate-fadeInUp"><div class="empty-state"><div class="empty-state-icon">&#128269;</div><h3 class="empty-state-title">Not Found</h3><button class="btn btn-primary" data-action="subj:back">Go to Dashboard</button></div></div>';
    return;
  }
  var lessonId = params.lessonId;
  var chs = _getChapters(sub.id);
  var ch = null;
  for (var ci = 0; ci < chs.length; ci++) { if (chs[ci].id === lessonId) { ch = chs[ci]; break; } }
  if (!ch) {
    mc.innerHTML = '<div class="animate-fadeInUp"><div class="empty-state"><div class="empty-state-icon">&#128269;</div><h3 class="empty-state-title">Lesson Not Found</h3><button class="btn btn-primary" data-action="subj:detail:' + params.id + '">Back</button></div></div>';
    return;
  }
  var tops = _getTopics(sub.id, ch.id);
  var tp = null;
  for (var ti = 0; ti < tops.length; ti++) { if (tops[ti].id === params.topicId) { tp = tops[ti]; break; } }
  if (!tp) {
    mc.innerHTML = '<div class="animate-fadeInUp"><div class="empty-state"><div class="empty-state-icon">&#128269;</div><h3 class="empty-state-title">Topic Not Found</h3><button class="btn btn-primary" data-action="subj:lesson:' + params.id + ':' + lessonId + '">Back to Lesson</button></div></div>';
    return;
  }

  var color = sub.color || '#3b82f6';
  var isBk = _isTopicBookmarked(tp.id);
  var tab = params.tab || 'theory';

  var html = '<div class="animate-fadeInUp">';
  html += '<div class="c-flex-center c-flex-gap-2 c-mb-4"><span class="c-fs-sm c-text-secondary c-pointer" data-action="subj:detail:' + sub.id + '">' + _U.sanitizeHTML(sub.name) + '</span><span class="c-fs-sm c-text-tertiary">/</span><span class="c-fs-sm c-text-secondary c-pointer" data-action="subj:lesson:' + sub.id + ':' + ch.id + '">' + _U.sanitizeHTML(ch.name) + '</span><span class="c-fs-sm c-text-tertiary">/</span><span class="c-fs-sm c-text-primary c-fw-medium">' + _U.sanitizeHTML(tp.name) + '</span></div>';

  /* Topic Header */
   html += '<div class="glass-card p-5 mb-4" style="border-left:4px solid ' + color + '"><div class="c-flex-between"><div><h1 class="text-xl font-bold mb-1">' + _U.sanitizeHTML(tp.name) + '</h1><div class="c-fs-xs c-text-tertiary c-mt-1">ID: TOP-' + sub.id + '-' + ch.id + '-' + tp.id + '</div><div class="c-flex-center c-flex-gap-3 c-fs-xs c-text-secondary c-mt-1"><span>&#128218; ' + _U.sanitizeHTML(sub.name) + '</span><span>&#183;</span><span>&#9201;&#65039; 15 min</span><span>&#183;</span><span class="badge badge-blue">Topic</span></div></div><div class="c-flex-center c-flex-gap-2"><span class="c-pointer c-fs-lg" data-action="subj:bookmark:' + tp.id + '" style="color:' + (isBk ? 'var(--accent-yellow)' : 'var(--text-tertiary)') + '">' + (isBk ? '&#9733;' : '&#9734;') + '</span><div class="c-flex-center c-fw-bold c-fs-xs c-pointer" data-action="subj:topicComplete:' + sub.id + ':' + ch.id + ':' + tp.id + '" style="width:24px;height:24px;border-radius:var(--radius-sm);border:2px solid ' + (tp.completed ? 'var(--accent-green)' : 'var(--border-color)') + ';background:' + (tp.completed ? 'var(--accent-green)22' : 'transparent') + ';color:' + (tp.completed ? 'var(--accent-green)' : 'transparent') + '">' + (tp.completed ? '&#10003;' : '') + '</div></div></div></div>';

  /* Topic Tabs */
  var topicTabs = ['theory','notes','textbook','videos','interactive','practiceQuestions','assignments','worksheets','questionBank','previousYear','flashcards','mindMap','summary','downloads'];
  var tabLabels = ['&#128218; Theory','&#128221; Notes','&#128214; Textbook','&#127916; Videos','&#9000;&#65039; Interactive','&#9997;&#65039; Practice','&#128203; Assignments','&#128196; Worksheets','&#10067; Question Bank','&#128220; Previous Year','&#128196; Flashcards','&#129504; Mind Map','&#128200; Summary','&#11014;&#65039; Downloads'];
  html += '<div class="tabs-enhanced mb-4" id="topic-tab-bar">';
  for (var tti = 0; tti < topicTabs.length; tti++) {
    html += '<button class="tab-enhanced' + (topicTabs[tti] === tab ? ' active' : '') + '" data-action="subj:topicTab:' + sub.id + ':' + ch.id + ':' + tp.id + ':' + topicTabs[tti] + '">' + tabLabels[tti] + '</button>';
  }
  html += '</div>';
  html += '<div id="topic-tab-content">' + _renderTopicTab(sub.id, ch.id, tp.id, tp.name, tab) + '</div>';

  /* AI Helper and Teacher Buttons */
  html += '<div class="c-flex-center c-flex-gap-3 c-mt-4 c-flex-wrap">';
  html += '<button class="btn btn-primary" data-action="subj:aiHelper:' + sub.id + ':' + ch.id + ':' + tp.id + '" style="background:linear-gradient(135deg,#8b5cf6,#3b82f6);color:white">&#129302; Ask AI Helper</button>';
  html += '<button class="btn btn-secondary" data-action="subj:askTeacher:' + sub.id + ':' + ch.id + ':' + tp.id + '">&#128489; Ask Teacher</button>';
  html += '</div>';
  html += '</div>';
  mc.innerHTML = html;

  _Store.set('lastViewed_' + sub.id, { topicId: tp.id, lessonId: ch.id, topicName: tp.name, lessonName: ch.name });
};

window.renderPage.switchTopicTab = function(sid, chId, tpId, tabName) {
  var tabContent = document.getElementById('topic-tab-content');
  if (!tabContent) return;
  var tabBar = document.getElementById('topic-tab-bar');
  if (tabBar) {
    var tops = _getTopics(sid, chId);
    var tp = null;
    for (var ti = 0; ti < tops.length; ti++) { if (tops[ti].id === tpId) { tp = tops[ti]; break; } }
    tabBar.outerHTML = _renderTopicTabBar(sid, chId, tpId, tabName);
  }
  var tpName = '';
  var allTops = _getTopics(sid, chId);
  for (var tii = 0; tii < allTops.length; tii++) { if (allTops[tii].id === tpId) { tpName = allTops[tii].name; break; } }
  tabContent.innerHTML = _renderTopicTab(sid, chId, tpId, tpName, tabName);
};

function _renderTopicTabBar(sid, chId, tpId, active) {
  var tabs = ['theory','notes','textbook','videos','interactive','practiceQuestions','assignments','worksheets','questionBank','previousYear','flashcards','mindMap','summary','downloads'];
  var labels = ['&#128218; Theory','&#128221; Notes','&#128214; Textbook','&#127916; Videos','&#9000;&#65039; Interactive','&#9997;&#65039; Practice','&#128203; Assignments','&#128196; Worksheets','&#10067; Question Bank','&#128220; Previous Year','&#128196; Flashcards','&#129504; Mind Map','&#128200; Summary','&#11014;&#65039; Downloads'];
  var html = '<div class="tabs-enhanced mb-4" id="topic-tab-bar">';
  for (var i = 0; i < tabs.length; i++) {
    html += '<button class="tab-enhanced' + (tabs[i] === active ? ' active' : '') + '" data-action="subj:topicTab:' + sid + ':' + chId + ':' + tpId + ':' + tabs[i] + '">' + labels[i] + '</button>';
  }
  html += '</div>';
  return html;
}

function _renderTopicTab(sid, chId, tpId, tpName, tab) {
  switch (tab) {
    case 'theory': return _generateTheory(sid, chId, tpId, tpName);
    case 'notes': return _generateNotes(tpId, tpName);
    case 'textbook': return _generateTextbook(tpId, tpName);
    case 'videos': return _generateVideos(sid, tpName);
    case 'interactive': return _generateInteractive(tpId, tpName);
    case 'practiceQuestions': return _generatePractice(tpId, tpName);
    case 'assignments': return _generateAssignments(tpName);
    case 'worksheets': return _generateWorksheets(tpName);
    case 'questionBank': return _generateQuestionBank(tpName);
    case 'previousYear': return _generatePreviousYear(tpName);
    case 'flashcards': return _generateFlashcards(tpName);
    case 'mindMap': return _generateMindMap(tpName);
    case 'summary': return _generateSummary(tpName);
    case 'downloads': return _generateDownloads(tpName);
    default: return _generateTheory(sid, chId, tpId, tpName);
  }
}

/* ===== TOPIC TAB CONTENT GENERATORS ===== */

function _generateTheory(sid, chId, tpId, tpName) {
  var sections = ['Introduction', 'Key Concepts', 'Detailed Explanation', 'Important Formulas', 'Examples', 'Common Mistakes'];
  var html = '<div class="glass-card p-5"><h3 class="c-fw-semibold c-mb-4">' + _U.sanitizeHTML(tpName) + ' - Theory</h3>';
  for (var si = 0; si < sections.length; si++) {
    var isOpen = si < 2 ? 'style="display:block"' : '';
    html += '<div class="c-border-bottom c-mb-3 c-pb-2"><div class="c-flex-between c-pointer c-py-2"><span class="c-fw-medium c-fs-sm">' + sections[si] + '</span><span class="c-text-tertiary">' + (si < 2 ? '&#9660;' : '&#9654;') + '</span></div><div class="c-fs-sm c-text-secondary c-py-2" ' + (si < 2 ? '' : 'style="display:none"') + '><p>This section covers the fundamental concepts of ' + _U.sanitizeHTML(tpName) + '. Understanding these core ideas is essential for building a strong foundation. The content includes detailed explanations, illustrations, and practical applications to help you grasp the material thoroughly.</p>';
    if (si === 2) html += '<p class="c-mt-2">Dive deeper into the mechanics and underlying principles. Each concept is broken down into digestible parts with step-by-step reasoning.</p>';
    if (si === 3) html += '<div class="c-bg-glass c-p-3 c-radius-md c-mt-2 c-fw-medium" style="font-family:var(--font-mono)">Key Formula: f(x) = ax&sup2; + bx + c</div>';
    if (si === 4) html += '<div class="c-bg-glass c-p-3 c-radius-md c-mt-2"><div class="c-fw-medium">Example 1:</div><p class="c-fs-xs c-text-secondary c-mt-1">Solve the equation with step-by-step solution showing all intermediate steps and final answer.</p></div>';
    if (si === 5) html += '<div class="c-bg-glass c-p-3 c-radius-md c-mt-2 c-text-warning">&#9888;&#65039; Common Mistake: Forgetting to apply the correct sign convention when solving equations.</div>';
    html += '</div></div>';
  }
  html += '</div>';
  return html;
}

function _generateNotes(tpId, tpName) {
  var bulletPoints = ['Main definition and key terminology explained in simple language', 'Important theorems and their practical applications', 'Step-by-step problem solving methodology', 'Key formulas and equations with derivations', 'Summary of important points to remember for exams', 'Connection to real-world scenarios and examples'];
  var html = '<div class="glass-card p-5"><div class="c-flex-between c-mb-4"><h3 class="c-fw-semibold">Study Notes - ' + _U.sanitizeHTML(tpName) + '</h3><span class="badge badge-blue">' + bulletPoints.length + ' points</span></div><div class="c-flex-center c-flex-gap-2" style="flex-direction:column;align-items:stretch">';
  for (var bi = 0; bi < bulletPoints.length; bi++) {
    html += '<div class="c-flex-center c-flex-gap-3 c-bg-glass c-p-3 c-radius-md"><div class="c-flex-center" style="width:24px;height:24px;border-radius:50%;background:var(--accent-blue);color:white;font-size:12px;flex-shrink:0">' + (bi + 1) + '</div><span class="c-fs-sm">' + bulletPoints[bi] + '</span></div>';
  }
  html += '</div></div>';
  return html;
}

function _generateTextbook(tpId, tpName) {
  var pages = ['Page 1: Introduction to ' + tpName, 'Page 2: Core Concepts', 'Page 3: Solved Examples', 'Page 4: Practice Problems', 'Page 5: Chapter Summary'];
  var html = '<div class="glass-card p-5"><h3 class="c-fw-semibold c-mb-4">Textbook - ' + _U.sanitizeHTML(tpName) + '</h3><div class="c-bg-glass c-p-6 c-radius-lg c-mb-4" style="min-height:300px;display:flex;flex-direction:column;align-items:center;justify-content:center;text-align:center"><div class="c-fs-2xl c-mb-4" style="font-size:3rem">&#128214;</div><h4 class="c-fw-semibold c-mb-2">' + _U.sanitizeHTML(tpName) + '</h4><p class="c-fs-sm c-text-secondary c-mb-4">Chapter content from NCERT &amp; reference books</p><div class="c-flex-center c-flex-gap-2"><span class="badge badge-blue">NCERT</span><span class="badge badge-purple">Reference</span></div></div>';
  for (var pi = 0; pi < pages.length; pi++) {
    html += '<div class="c-flex-center c-flex-gap-3 c-py-2 c-border-bottom"><span class="c-fw-medium c-fs-sm" style="color:var(--accent-blue)">' + (pi + 1) + '.</span><span class="c-fs-sm">' + _U.sanitizeHTML(pages[pi]) + '</span></div>';
  }
  html += '</div>';
  return html;
}

function _generateVideos(sid, tpName) {
  var videoTitles = ['Introduction to ' + tpName, tpName + ' Explained Simply', tpName + ' - Advanced Concepts', tpName + ' Problem Solving', tpName + ' Quick Revision'];
  var html = '<div class="glass-card p-5"><h3 class="c-fw-semibold c-mb-4">Related Videos</h3><div class="grid grid-cols-auto gap-4">';
  for (var vi = 0; vi < videoTitles.length; vi++) {
    html += '<div class="glass-card c-overflow-hidden c-pointer" data-action="subj:openVideo:v' + (vi + 1) + '"><div class="c-flex-center c-relative" style="height:130px;background:' + _gradient(vi) + '"><div class="c-flex-center c-fs-lg" style="width:40px;height:40px;border-radius:50%;background:rgba(255,255,255,0.2);color:white;backdrop-filter:blur(4px)">&#9654;</div><span class="badge c-absolute" style="bottom:6px;right:6px;background:rgba(0,0,0,0.6);color:white;font-size:10px">' + (10 + vi * 5) + ' min</span></div><div style="padding:var(--space-3)"><div class="c-fs-sm c-fw-semibold c-ellipsis">' + _U.sanitizeHTML(videoTitles[vi]) + '</div><div class="c-fs-xs c-text-tertiary c-mt-1">' + (1000 + vi * 500) + ' views</div></div></div>';
  }
  html += '</div></div>';
  return html;
}

function _generateInteractive(tpId, tpName) {
  var steps = ['Step 1: Identify the given values and what needs to be found', 'Step 2: Select the appropriate formula or approach', 'Step 3: Substitute the known values into the equation', 'Step 4: Solve step-by-step showing all calculations', 'Step 5: Verify your answer with the given conditions'];
  var html = '<div class="glass-card p-5"><h3 class="c-fw-semibold c-mb-4">Interactive Example - ' + _U.sanitizeHTML(tpName) + '</h3><div class="c-bg-glass c-p-4 c-radius-md c-mb-4"><div class="c-fw-medium c-mb-2">&#128295; Interactive Problem:</div><p class="c-fs-sm c-text-secondary">Work through this example interactively. Each step builds on the previous one.</p></div>';
  for (var si = 0; si < steps.length; si++) {
    html += '<div class="c-flex-center c-flex-gap-3 c-bg-glass c-p-3 c-radius-md c-mb-2"><div class="c-flex-center c-fw-bold c-fs-xs" style="width:28px;height:28px;border-radius:50%;background:var(--accent-blue);color:white;flex-shrink:0">' + (si + 1) + '</div><span class="c-fs-sm">' + steps[si] + '</span></div>';
  }
  html += '<div class="c-flex-center c-flex-gap-2 c-mt-4"><button class="btn btn-primary btn-sm">&#9654; Start Interactive</button><button class="btn btn-secondary btn-sm">&#128259; Show Solution</button></div></div>';
  return html;
}

function _generatePractice(tpId, tpName) {
  var questions = [
    { q: 'What is the primary concept discussed in ' + tpName + '?', opt: ['Definition A', 'Definition B', 'Definition C', 'Definition D'] },
    { q: 'Which of the following best describes ' + tpName + '?', opt: ['Option 1', 'Option 2', 'Option 3', 'Option 4'] },
    { q: 'Identify the correct statement about ' + tpName + '.', opt: ['Statement A', 'Statement B', 'Statement C', 'Statement D'] }
  ];
  var html = '<div class="glass-card p-5"><h3 class="c-fw-semibold c-mb-4">Practice Questions</h3>';
  for (var qi = 0; qi < questions.length; qi++) {
    var q = questions[qi];
    html += '<div class="c-bg-glass c-p-4 c-radius-md c-mb-3"><div class="c-fs-sm c-fw-medium c-mb-3">' + (qi + 1) + '. ' + _U.sanitizeHTML(q.q) + '</div>';
    for (var oi = 0; oi < q.opt.length; oi++) {
      html += '<div class="c-flex-center c-flex-gap-2 c-py-1 c-pointer"><div style="width:18px;height:18px;border-radius:50%;border:2px solid var(--border-color);flex-shrink:0"></div><span class="c-fs-sm">' + q.opt[oi] + '</span></div>';
    }
    html += '</div>';
  }
  html += '<button class="btn btn-primary btn-sm">&#128221; Submit Answers</button></div>';
  return html;
}

function _generateAssignments(tpName) {
  var items = [
    { title: tpName + ' - Basic Assignment', desc: 'Complete the fundamental exercises to reinforce core concepts.', due: '3 days' },
    { title: tpName + ' - Advanced Problems', desc: 'Challenge yourself with complex problem-solving tasks.', due: '1 week' },
    { title: tpName + ' - Research Project', desc: 'Explore real-world applications and prepare a brief report.', due: '2 weeks' }
  ];
  var html = '<div class="glass-card p-5"><h3 class="c-fw-semibold c-mb-4">Assignments</h3><div class="c-flex-center c-flex-gap-3" style="flex-direction:column;align-items:stretch">';
  for (var ai = 0; ai < items.length; ai++) {
    html += '<div class="glass-card c-p-4"><div class="c-flex-between c-mb-2"><h4 class="c-fw-medium c-fs-sm">' + _U.sanitizeHTML(items[ai].title) + '</h4><span class="badge badge-yellow">Due: ' + items[ai].due + '</span></div><p class="c-fs-xs c-text-secondary c-mb-2">' + items[ai].desc + '</p><button class="btn btn-primary btn-sm">Download Assignment</button></div>';
  }
  html += '</div></div>';
  return html;
}

function _generateWorksheets(tpName) {
  var sheets = ['Basic Practice Sheet', 'Advanced Problem Set', 'Revision Worksheet', 'Formula Practice Sheet'];
  var html = '<div class="glass-card p-5"><h3 class="c-fw-semibold c-mb-4">Worksheets</h3><div class="grid grid-cols-auto gap-4">';
  for (var wi = 0; wi < sheets.length; wi++) {
    html += '<div class="glass-card c-p-4 c-text-center"><div class="c-fs-2xl c-mb-2" style="font-size:2rem">&#128196;</div><h4 class="c-fw-medium c-fs-sm c-mb-2">' + _U.sanitizeHTML(sheets[wi]) + '</h4><p class="c-fs-xs c-text-tertiary c-mb-3">10 questions</p><button class="btn btn-sm btn-secondary">Download PDF</button></div>';
  }
  html += '</div></div>';
  return html;
}

function _generateQuestionBank(tpName) {
  var types = ['Multiple Choice Questions (25)', 'True or False (15)', 'Fill in the Blanks (20)', 'Short Answer (10)', 'Long Answer (5)', 'Match the Following (12)'];
  var html = '<div class="glass-card p-5"><h3 class="c-fw-semibold c-mb-4">Question Bank - ' + _U.sanitizeHTML(tpName) + '</h3><div class="c-flex-center c-flex-gap-3" style="flex-direction:column;align-items:stretch">';
  for (var qi = 0; qi < types.length; qi++) {
    html += '<div class="c-flex-between c-bg-glass c-p-3 c-radius-md"><span class="c-fs-sm">' + types[qi] + '</span><button class="btn btn-sm btn-ghost">&#128221; Practice</button></div>';
  }
  html += '</div></div>';
  return html;
}

function _generatePreviousYear(tpName) {
  var years = ['2024 Exam Paper', '2023 Exam Paper', '2022 Exam Paper', '2021 Exam Paper', '2020 Exam Paper'];
  var html = '<div class="glass-card p-5"><h3 class="c-fw-semibold c-mb-4">Previous Year Questions</h3><div class="c-flex-center c-flex-gap-3" style="flex-direction:column;align-items:stretch">';
  for (var yi = 0; yi < years.length; yi++) {
    html += '<div class="c-flex-between c-bg-glass c-p-3 c-radius-md"><div class="c-flex-center c-flex-gap-3"><span class="c-fs-lg">&#128220;</span><span class="c-fs-sm">' + years[yi] + ' - Related to ' + _U.sanitizeHTML(tpName) + '</span></div><div class="c-flex-center c-flex-gap-2"><span class="badge badge-green">Solved</span><button class="btn btn-sm btn-ghost">View</button></div></div>';
  }
  html += '</div></div>';
  return html;
}

function _generateFlashcards(tpName) {
  var cards = [
    { front: 'What is ' + tpName + '?', back: 'The core concept of ' + tpName + ' involves understanding the fundamental principles and their applications in various contexts.' },
    { front: 'Key Formula', back: 'The primary formula used in this topic helps solve a wide range of related problems efficiently.' },
    { front: 'Important Rule', back: 'Always follow the systematic approach: identify, analyze, solve, and verify for accurate results.' },
    { front: 'Common Application', back: 'This concept is widely applied in real-world scenarios including engineering, technology, and daily life.' }
  ];
  var html = '<div class="glass-card p-5"><div class="c-flex-between c-mb-4"><h3 class="c-fw-semibold">Flashcards</h3><span class="badge badge-blue">' + cards.length + ' cards</span></div><div class="grid grid-cols-auto gap-4">';
  for (var fi = 0; fi < cards.length; fi++) {
    html += '<div class="glass-card c-p-4 c-pointer" style="min-height:140px;display:flex;flex-direction:column;align-items:center;justify-content:center;text-align:center"><div class="c-fs-sm c-fw-medium c-mb-2">' + _U.sanitizeHTML(cards[fi].front) + '</div><div class="c-fs-xs c-text-tertiary">(click to reveal)</div></div>';
  }
  html += '</div></div>';
  return html;
}

function _generateMindMap(tpName) {
  var nodes = [
    { label: 'Core Concept', children: ['Definition', 'Properties', 'Examples'] },
    { label: 'Applications', children: ['Real World', 'Problem Solving', 'Advanced Topics'] },
    { label: 'Related Topics', children: ['Prerequisites', 'Extensions', 'Connections'] }
  ];
  var html = '<div class="glass-card p-5"><h3 class="c-fw-semibold c-mb-4">Mind Map - ' + _U.sanitizeHTML(tpName) + '</h3><div class="c-flex-center" style="flex-direction:column;gap:var(--space-4);padding:var(--space-4)"><div class="c-bg-glass c-px-4 c-py-3 c-radius-lg c-fw-bold" style="border:2px solid var(--accent-blue)">' + _U.sanitizeHTML(tpName) + '</div>';
  for (var mi = 0; mi < nodes.length; mi++) {
    html += '<div style="width:100%;max-width:500px"><div class="c-bg-glass c-px-3 c-py-2 c-radius-md c-fw-medium c-text-center c-mb-2" style="border:1px solid var(--accent-blue)">' + nodes[mi].label + '</div><div class="c-flex-center c-flex-gap-2 c-flex-wrap">';
    for (var ci = 0; ci < nodes[mi].children.length; ci++) {
      html += '<span class="badge badge-blue">' + nodes[mi].children[ci] + '</span>';
    }
    html += '</div></div>';
  }
  html += '</div></div>';
  return html;
}

function _generateSummary(tpName) {
  var points = [
    tpName + ' is a fundamental concept that forms the basis for advanced learning.',
    'Key principles include understanding definitions, formulas, and their applications.',
    'Regular practice with varied problems helps reinforce the concepts.',
    'Connecting theoretical knowledge with real-world examples enhances understanding.',
    'Review and revision are essential for long-term retention of the material.'
  ];
  var html = '<div class="glass-card p-5"><h3 class="c-fw-semibold c-mb-4">Summary - ' + _U.sanitizeHTML(tpName) + '</h3><div class="c-flex-center c-flex-gap-3" style="flex-direction:column;align-items:stretch">';
  for (var si = 0; si < points.length; si++) {
    html += '<div class="c-flex-center c-flex-gap-3 c-bg-glass c-p-3 c-radius-md"><span class="c-fs-lg">&#9989;</span><span class="c-fs-sm">' + _U.sanitizeHTML(points[si]) + '</span></div>';
  }
  html += '</div><div class="c-mt-4 c-p-4 c-bg-glass c-radius-md"><div class="c-fw-medium c-mb-2">&#128200; Key Takeaways</div><p class="c-fs-sm c-text-secondary">Mastering ' + _U.sanitizeHTML(tpName) + ' requires consistent effort and a structured approach to learning. Focus on understanding the core principles before moving to advanced applications.</p></div></div>';
  return html;
}

function _generateDownloads(tpName) {
  var items = [
    { name: tpName + ' - Study Notes PDF', type: 'pdf', size: '2.4 MB' },
    { name: tpName + ' - Practice Worksheet', type: 'worksheet', size: '1.1 MB' },
    { name: tpName + ' - Formula Sheet', type: 'reference', size: '0.8 MB' },
    { name: tpName + ' - Video Transcript', type: 'notes', size: '1.5 MB' },
    { name: tpName + ' - Mind Map PDF', type: 'mindmap', size: '0.5 MB' }
  ];
  var icons = { pdf:'&#128196;', worksheet:'&#128203;', reference:'&#128214;', notes:'&#128221;', mindmap:'&#129504;' };
  var html = '<div class="glass-card p-5"><h3 class="c-fw-semibold c-mb-4">Downloads</h3><div class="c-flex-center c-flex-gap-3" style="flex-direction:column;align-items:stretch">';
  for (var di = 0; di < items.length; di++) {
    html += '<div class="c-flex-between c-bg-glass c-p-3 c-radius-md"><div class="c-flex-center c-flex-gap-3"><span class="c-fs-lg">' + (icons[items[di].type] || '&#128196;') + '</span><div><div class="c-fs-sm c-fw-medium">' + _U.sanitizeHTML(items[di].name) + '</div><div class="c-fs-xs c-text-tertiary">ID: RES-' + (di + 1).toString().padStart(3, '0') + ' &middot; ' + items[di].size + '</div></div></div><button class="btn btn-sm btn-primary">&#11014; Download</button></div>';
  }
  html += '</div></div>';
  return html;
}

/* ===== TOPIC COMPLETION ===== */

window.renderPage.toggleTopicComplete = function(sid, chId, tpId, el) {
  if (tpId === 'all') {
    var tops = _getTopics(sid, chId);
    var allDone = true;
    for (var i = 0; i < tops.length; i++) { if (!tops[i].completed) { allDone = false; break; } }
    for (var j = 0; j < tops.length; j++) { tops[j].completed = !allDone; }
    window.Router.navigate('/subject/' + sid + '/lesson/' + chId);
    return;
  }
  var tops2 = _getTopics(sid, chId);
  for (var k = 0; k < tops2.length; k++) {
    if (tops2[k].id === tpId) { tops2[k].completed = !tops2[k].completed; break; }
  }
  window.Router.navigate('/subject/' + sid + '/lesson/' + chId + '/topic/' + tpId);
};

/* ===== BOOKMARK TOPIC ===== */

window.renderPage.toggleTopicBookmark = function(tpId, el) {
  var bks = _getTopicBookmarks();
  var found = false;
  for (var i = 0; i < bks.length; i++) { if (bks[i] === tpId) { bks.splice(i, 1); found = true; break; } }
  if (!found) bks.push(tpId);
  _Store.set('topicBookmarks', bks);
  if (el) {
    var nowBk = !found;
    el.innerHTML = nowBk ? '&#9733;' : '&#9734;';
    el.style.color = nowBk ? 'var(--accent-yellow)' : 'var(--text-tertiary)';
  }
};

/* ===== OVERLAY MODALS ===== */

window.renderPage.openVideoPlayer = function(vid) {
  var all = _MD.videos || [];
  var v = null;
  for (var i = 0; i < all.length; i++) { if (all[i].id === vid) { v = all[i]; break; } }
  if (!v) v = { title:'Sample Video', duration:15, instructor:'Dr. Instructor', views:5000, level:'beginner', description:'Educational video content.' };
  var overlay = document.createElement('div');
  overlay.className = 'modal-overlay';
  overlay.innerHTML = '<div class="modal" style="max-width:720px"><div class="modal-header"><h3 class="text-lg font-semibold">' + _U.sanitizeHTML(v.title) + '</h3><button class="btn btn-icon btn-ghost" data-action="subj:closeModal">&#10005;</button></div><div class="modal-body"><div class="video-player-container mb-4"><div class="video-player-placeholder c-flex-center c-flex-gap-3" style="height:360px;background:' + _gradient(Math.floor(Math.random() * 6)) + ';border-radius:var(--radius-lg);flex-direction:column"><div class="c-flex-center c-fs-2xl" style="width:64px;height:64px;border-radius:50%;background:rgba(255,255,255,0.2);color:white">&#9654;</div><span class="badge" style="background:rgba(0,0,0,0.5);color:white">' + _U.formatDuration(v.duration || 0) + '</span></div></div><div class="c-flex-center c-flex-gap-4 c-mb-3"><span class="c-fs-sm c-text-secondary">&#128100; ' + _U.sanitizeHTML(v.instructor || '') + '</span><span class="c-fs-sm c-text-secondary">&#128065; ' + _U.formatNumber(v.views || 0) + ' views</span><span class="badge ' + (v.level === 'beginner' ? 'badge-green' : v.level === 'intermediate' ? 'badge-yellow' : 'badge-red') + '">' + (v.level || 'beginner') + '</span></div><p class="c-fs-sm c-text-secondary">' + _U.sanitizeHTML(v.description || v.title) + '</p></div></div>';
  overlay.addEventListener('click', function(e) { if (e.target === overlay) overlay.remove(); });
  document.body.appendChild(overlay);
};

window.renderPage.openAIHelper = function(sid, chId, tpId) {
  var sub = _findSubject(sid);
  var subName = sub ? sub.name : '';
  var overlay = document.createElement('div');
  overlay.className = 'modal-overlay';
  overlay.innerHTML = '<div class="modal" style="max-width:600px"><div class="modal-header"><h3 class="text-lg font-semibold">&#129302; AI Learning Assistant</h3><button class="btn btn-icon btn-ghost" data-action="subj:closeModal">&#10005;</button></div><div class="modal-body"><p class="c-fs-sm c-text-secondary c-mb-4">Ask any question about this topic and get instant help from AI.</p><div class="c-flex-center c-flex-gap-3 c-mb-4"><input type="text" class="input-field" placeholder="Type your question about ' + _U.sanitizeHTML(subName) + '..." id="ai-question-input"><button class="btn btn-primary" data-action="subj:askAI">Ask</button></div><div class="c-bg-glass c-p-4 c-radius-md"><div class="c-fw-medium c-fs-sm c-mb-2">&#128172; Suggested Questions:</div><div class="c-flex-center c-flex-gap-2 c-flex-wrap"><span class="badge badge-blue c-pointer">Explain this concept</span><span class="badge badge-green c-pointer">Give me an example</span><span class="badge badge-purple c-pointer">Common mistakes</span><span class="badge badge-yellow c-pointer">Practice problems</span></div></div></div></div>';
  overlay.addEventListener('click', function(e) { if (e.target === overlay) overlay.remove(); });
  document.body.appendChild(overlay);
  var input = document.getElementById('ai-question-input');
  if (input) setTimeout(function() { input.focus(); }, 200);
};

window.renderPage.openAskTeacher = function(sid, chId, tpId) {
  var teacherName = _getFirstTeacher();
  var overlay = document.createElement('div');
  overlay.className = 'modal-overlay';
  overlay.innerHTML = '<div class="modal" style="max-width:600px"><div class="modal-header"><h3 class="text-lg font-semibold">&#128489; Ask Your Teacher</h3><button class="btn btn-icon btn-ghost" data-action="subj:closeModal">&#10005;</button></div><div class="modal-body"><div class="c-flex-center c-flex-gap-3 c-mb-4"><div class="c-flex-center c-fw-bold" style="width:48px;height:48px;border-radius:50%;background:var(--gradient-secondary);color:white">' + _U.getInitials(teacherName) + '</div><div><div class="c-fw-medium c-fs-sm">' + _U.sanitizeHTML(teacherName) + '</div><div class="c-fs-xs c-text-tertiary">Subject Teacher</div></div></div><textarea class="input-field" placeholder="Type your question for ' + _U.sanitizeHTML(teacherName) + '..." style="min-height:100px" id="teacher-question-input"></textarea><div class="c-flex-center c-flex-gap-2 c-mt-4"><button class="btn btn-primary" data-action="subj:sendTeacherQuestion">Send Question</button><button class="btn btn-secondary">&#128197; Schedule Meeting</button></div></div></div>';
  overlay.addEventListener('click', function(e) { if (e.target === overlay) overlay.remove(); });
  document.body.appendChild(overlay);
};
