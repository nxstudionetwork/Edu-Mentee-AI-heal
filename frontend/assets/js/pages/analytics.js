window.renderPage = window.renderPage || {};

window.renderPage.analytics = function(params) {
  var mainContent = document.getElementById('main-content');
  if (!mainContent) return;

  var Utils = window.Utils;
  var md = window.mockData;
  var user = window.Store.get('user');

  var now = new Date();

  document.addEventListener('click', function(e) {
    var t = e.target.closest('[data-action^="analytics:"]');
    if (!t) return;
    var p = t.getAttribute('data-action').split(':');
    var c = p[1], a = p[2];
    if (c === 'setPeriod' && a) { window.analyticsSetPeriod(a); }
    if (c === 'generateReport') { window.analyticsGenerateReport(); }
    if (c === 'loadMore') { window.analyticsLoadMore(); }
    if (c === 'setCustomDate' && a && p[3]) { window.analyticsSetCustomDate(a, p[3]); }
  });

  function pad2(n) {
    return n < 10 ? '0' + n : '' + n;
  }

  function formatDateKey(d) {
    return d.getFullYear() + '-' + pad2(d.getMonth() + 1) + '-' + pad2(d.getDate());
  }

  function formatTimeAgo(hours) {
    if (hours < 1) return 'Just now';
    if (hours < 24) return hours + ' hours ago';
    var days = Math.round(hours / 24);
    return days + ' days ago';
  }

  var todayStr = formatDateKey(now);
  var days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  var fullDays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  var months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

  function loadStudyData() {
    var stored;
    try {
      stored = localStorage.getItem('analytics_study_data');
      if (stored) {
        var parsed = JSON.parse(stored);
        if (parsed.length === 365) return parsed;
      }
    } catch (e) {}
    return generateStudyData();
  }

  function generateStudyData() {
    var data = [];
    var startDate = new Date(now);
    startDate.setDate(startDate.getDate() - 364);
    for (var i = 0; i < 365; i++) {
      var d = new Date(startDate);
      d.setDate(d.getDate() + i);
      var isWeekend = d.getDay() === 0 || d.getDay() === 6;
      var baseMinutes = isWeekend ? Math.round(Math.random() * 60 + 20) : Math.round(Math.random() * 120 + 45);
      var skipDay = Math.random() < 0.08;
      var studyMinutes = skipDay ? 0 : Math.min(baseMinutes, 360);
      var quizzesAttempted = (studyMinutes > 30 && Math.random() < 0.35) ? Math.floor(Math.random() * 3) + 1 : 0;
      var totalScore = 0;
      for (var q = 0; q < quizzesAttempted; q++) {
        totalScore += Math.round(Math.random() * 30 + 65);
      }
      var avgScore = quizzesAttempted > 0 ? Math.round(totalScore / quizzesAttempted) : 0;
      data.push({
        date: formatDateKey(d),
        studyMinutes: studyMinutes,
        quizzesAttempted: quizzesAttempted,
        quizzesScore: avgScore,
        xpEarned: Math.round(studyMinutes * 1.5 + quizzesAttempted * 40),
        coinsEarned: Math.round(studyMinutes * 0.3 + quizzesAttempted * 8)
      });
    }
    try {
      localStorage.setItem('analytics_study_data', JSON.stringify(data));
    } catch (e) {}
    return data;
  }

  var studyData = loadStudyData();

  var studyDataMap = {};
  for (var dmi = 0; dmi < studyData.length; dmi++) {
    studyDataMap[studyData[dmi].date] = studyData[dmi];
  }

  var subjects = md.subjects || [];
  var userClass = (user && user.class) || 6;
  var userStream = user && user.stream;
  var userSubjects = subjects.filter(function(s) { return s.class == userClass; });
  if ((userClass == 11 || userClass == 12) && userStream) {
    userSubjects = userSubjects.filter(function(s) { return !s.stream || s.stream === userStream; });
  }
  if (userSubjects.length === 0 && Utils && Utils.classSubjects && Utils.classSubjects[userClass]) {
    userSubjects = Utils.classSubjects[userClass].map(function(name, idx) {
      return { id: 'cs_' + idx, name: name, icon: ['\u0040\u0040EMOJI_BOOK',
'\u0040\u0040EMOJI_FLASK',
'\u0040\u0040EMOJI_BOOK2',
'\u0040\u0040EMOJI_GLOBE',
'\u0040\u0040EMOJI_LIGHTNING',
'\u0040\u0040EMOJI_MICRO',
'\u0040\u0040EMOJI_LEAF'][idx % 7], color: ['#3b82f6','#8b5cf6','#06b6d4','#10b981','#f59e0b','#ec4899','#f97316'][idx % 7] };
    });
  }

  function computeStats(filterFn) {
    var filtered = filterFn ? studyData.filter(filterFn) : studyData;
    var totalMinutes = 0;
    var totalQuizzes = 0;
    var totalScores = 0;
    var scoreCount = 0;
    var totalXP = 0;
    var studyDays = 0;
    for (var i = 0; i < filtered.length; i++) {
      var entry = filtered[i];
      totalMinutes += entry.studyMinutes;
      totalQuizzes += entry.quizzesAttempted;
      if (entry.quizzesScore > 0) {
        totalScores += entry.quizzesScore;
        scoreCount++;
      }
      totalXP += entry.xpEarned;
      if (entry.studyMinutes > 0) studyDays++;
    }
    return {
      totalHours: Math.round(totalMinutes / 60 * 10) / 10,
      avgDailyHours: filtered.length > 0 ? Math.round(totalMinutes / filtered.length / 60 * 10) / 10 : 0,
      quizzesDone: totalQuizzes,
      avgScore: scoreCount > 0 ? Math.round(totalScores / scoreCount) : 0,
      xpEarned: totalXP,
      studyDays: studyDays,
      totalDays: filtered.length
    };
  }

  var allStats = computeStats();

  function getPeriodFilter(period) {
    var start = new Date(now);
    if (period === 'today') {
      var startStr = todayStr;
      return function(e) { return e.date === startStr; };
    } else if (period === 'week') {
      start.setDate(start.getDate() - start.getDay());
      var startStr = formatDateKey(start);
      return function(e) { return e.date >= startStr; };
    } else if (period === 'month') {
      start.setDate(1);
      var startStr = formatDateKey(start);
      return function(e) { return e.date >= startStr; };
    } else {
      start.setMonth(0, 1);
      var startStr = formatDateKey(start);
      return function(e) { return e.date >= startStr; };
    }
  }

  var periodStats = {
    today: computeStats(getPeriodFilter('today')),
    week: computeStats(getPeriodFilter('week')),
    month: computeStats(getPeriodFilter('month')),
    year: computeStats(getPeriodFilter('year'))
  };

  function calcStreak() {
    var current = 0;
    var longest = 0;
    var temp = 0;
    for (var si = studyData.length - 1; si >= 0; si--) {
      if (studyData[si].studyMinutes > 0) {
        temp++;
        if (temp > longest) longest = temp;
        if (si === studyData.length - 1 || current > 0) current = temp;
      } else {
        temp = 0;
        if (current > 0 && si < studyData.length - 1) break;
      }
    }
    return { current: current, longest: longest };
  }

  var streak = calcStreak();
  var totalXP = allStats.xpEarned;
  var level = Math.floor(totalXP / 1000) + 1;
  var xpInLevel = totalXP % 1000;
  var xpProgressPct = (xpInLevel / 1000) * 100;
  var nextLevelXP = (level) * 1000;
  var xpNeeded = 1000 - xpInLevel;

  var todayEntry = studyDataMap[todayStr] || { studyMinutes: 0, quizzesAttempted: 0, quizzesScore: 0 };
  var studiedToday = todayEntry.studyMinutes > 0;

  var subjectList = userSubjects.slice(0, 8).map(function(s, i) {
    var base = [30, 22, 18, 15, 10, 8, 6, 4];
    var colors = ['#3b82f6','#8b5cf6','#06b6d4','#10b981','#f59e0b','#ec4899','#f97316','#14b8a6'];
    return { name: s.name, value: base[i % base.length], color: s.color || colors[i % colors.length], progress: Math.round(60 + Math.random() * 40) };
  });

  var totalSubjectVal = 0;
  for (var sv = 0; sv < subjectList.length; sv++) {
    totalSubjectVal += subjectList[sv].value;
  }

  var quizHistory = [];
  for (var qi = 0; qi < studyData.length; qi++) {
    if (studyData[qi].quizzesAttempted > 0 && studyData[qi].quizzesScore > 0) {
      quizHistory.push(studyData[qi]);
    }
  }
  var recentQuizzes = quizHistory.slice(-10);
  var recentQuizzesAvg = recentQuizzes.length > 0 ? Math.round(recentQuizzes.reduce(function(a, b) { return a + b.quizzesScore; }, 0) / recentQuizzes.length) : 0;
  var bestQuizScore = 0;
  for (var bq = 0; bq < recentQuizzes.length; bq++) {
    if (recentQuizzes[bq].quizzesScore > bestQuizScore) bestQuizScore = recentQuizzes[bq].quizzesScore;
  }

  var examScores = [];
  (function() {
    var examNames = ['Midterm', 'Final', 'Practice Test', 'Chapter Test', 'Quarterly', 'Half-Yearly', 'Mock Test', 'Pre-Board', 'Unit Test', 'Revision Test'];
    for (var ei = 0; ei < 10; ei++) {
      var score = Math.round(40 + Math.random() * 60);
      var d = new Date(now);
      d.setDate(d.getDate() - ei * 14 - Math.round(Math.random() * 7));
      examScores.push({
        name: examNames[ei % examNames.length],
        score: score,
        passed: score >= 40,
        date: formatDateKey(d),
        subject: userSubjects[ei % userSubjects.length].name
      });
    }
  })();

  var recentExams = examScores.slice(-5);
  var examAvg = Math.round(recentExams.reduce(function(a, b) { return a + b.score; }, 0) / recentExams.length);

  function getAchievements() {
    return [
      { name: 'First Study', desc: 'Complete your first study session', icon: '\u0040\u0040EMOJI_ROCKET', unlocked: true, date: studyData[0].date, xp: 50 },
      { name: 'Week Warrior', desc: 'Study 7 days in a row', icon: '\u0040\u0040EMOJI_FIRE', unlocked: streak.longest >= 7, date: streak.longest >= 7 ? studyData[6].date : '', xp: 100 },
      { name: 'Century Mark', desc: 'Study 100 hours total', icon: '\u0040\u0040EMOJI_100', unlocked: allStats.totalHours >= 100, date: allStats.totalHours >= 100 ? studyData[30].date : '', xp: 200 },
      { name: 'Quiz Master', desc: 'Complete 50 quizzes', icon: '\u0040\u0040EMOJI_NOTE', unlocked: allStats.quizzesDone >= 50, date: allStats.quizzesDone >= 50 ? studyData[45].date : '', xp: 150 },
      { name: 'Perfect Score', desc: 'Score 100% on any quiz', icon: '\u0040\u0040EMOJI_STAR2', unlocked: false, xp: 300 },
      { name: 'Consistent Scholar', desc: '30-day study streak', icon: '\u0040\u0040EMOJI_TROPHY', unlocked: streak.longest >= 30, xp: 500 },
      { name: 'Dedicated Learner', desc: 'Study 200 hours total', icon: '\u0040\u0040EMOJI_MEDAL', unlocked: allStats.totalHours >= 200, xp: 400 },
      { name: 'Knowledge Seeker', desc: 'Complete 100 quizzes', icon: '\u0040\u0040EMOJI_GRAD', unlocked: allStats.quizzesDone >= 100, xp: 350 }
    ];
  }

  var achievements = getAchievements();
  var unlockedAchievements = achievements.filter(function(a) { return a.unlocked; });
  var lockedAchievements = achievements.filter(function(a) { return !a.unlocked; });

  function getRecentActivity() {
    var activities = [];
    for (var ai = 0; ai < quizHistory.length; ai++) {
      var q = quizHistory[ai];
      var d = new Date(q.date);
      var hoursAgo = Math.round((now - d) / 3600000);
      if (hoursAgo < 0) hoursAgo = 0;
      activities.push({
        icon: '\u0040\u0040EMOJI_NOTE',
        text: 'Completed Quiz - Score: ' + q.quizzesScore + '/10',
        time: hoursAgo,
        date: q.date
      });
    }
    for (var si2 = 0; si2 < studyData.length; si2 += 7) {
      if (studyData[si2].studyMinutes > 0) {
        var d2 = new Date(studyData[si2].date);
        var hoursAgo2 = Math.round((now - d2) / 3600000);
        if (hoursAgo2 < 0) hoursAgo2 = 0;
        var hrs = Math.round(studyData[si2].studyMinutes / 60 * 10) / 10;
        activities.push({
          icon: '\u0040\u0040EMOJI_BOOK',
          text: 'Studied ' + hrs + ' hours',
          time: hoursAgo2,
          date: studyData[si2].date
        });
      }
    }
    for (var ei2 = 0; ei2 < examScores.length; ei2++) {
      var e = examScores[ei2];
      var d3 = new Date(e.date);
      var hoursAgo3 = Math.round((now - d3) / 3600000);
      if (hoursAgo3 < 0) hoursAgo3 = 0;
      activities.push({
        icon: '\u0040\u0040EMOJI_CLIP',
        text: 'Completed ' + e.name + ' - ' + e.score + '% (' + (e.passed ? 'Pass' : 'Fail') + ')',
        time: hoursAgo3,
        date: e.date
      });
    }
    activities.sort(function(a, b) { return a.time - b.time; });
    return activities;
  }

  var allActivity = getRecentActivity();
  var maxActivity = 8;

  function getSparkline() {
    var data = [];
    for (var si3 = 0; si3 < 10; si3++) {
      data.push(Math.round(Math.random() * 100));
    }
    return data;
  }

  function getHourlyData() {
    var hours = [];
    var totalToday = periodStats.today.totalHours * 60;
    var pattern = [5, 8, 12, 15, 18, 20, 25, 30, 35, 40, 35, 30, 25, 20, 18, 15, 10];
    var patternTotal = 0;
    for (var pi = 0; pi < pattern.length; pi++) patternTotal += pattern[pi];
    if (patternTotal === 0) patternTotal = 1;
    for (var hi = 6; hi <= 22; hi++) {
      var minutes = Math.round(totalToday * (pattern[hi - 6] / patternTotal));
      hours.push({ hour: hi, minutes: minutes, label: hi > 12 ? (hi - 12) + 'PM' : (hi === 12 ? '12PM' : hi + 'AM') });
    }
    return hours;
  }

  function getWeekData() {
    var data = [];
    for (var di = 6; di >= 0; di--) {
      var d = new Date(now);
      d.setDate(d.getDate() - di);
      var ds = formatDateKey(d);
      var entry = studyDataMap[ds] || { studyMinutes: 0 };
      data.push({ date: ds, minutes: entry.studyMinutes, label: days[d.getDay()], fullDay: fullDays[d.getDay()], isToday: ds === todayStr });
    }
    return data;
  }

  function getMonthData() {
    var data = [];
    for (var di = 29; di >= 0; di--) {
      var d = new Date(now);
      d.setDate(d.getDate() - di);
      var ds = formatDateKey(d);
      var entry = studyDataMap[ds] || { studyMinutes: 0 };
      data.push({ date: ds, minutes: entry.studyMinutes, dayNum: d.getDate() });
    }
    return data;
  }

  function getYearData() {
    var data = [];
    var currentYear = now.getFullYear();
    for (var mi = 0; mi < 12; mi++) {
      var totalMin = 0;
      for (var di2 = 0; di2 < studyData.length; di2++) {
        var d = new Date(studyData[di2].date);
        if (d.getFullYear() === currentYear && d.getMonth() === mi) {
          totalMin += studyData[di2].studyMinutes;
        }
      }
      data.push({ month: months[mi], minutes: totalMin, hours: Math.round(totalMin / 60 * 10) / 10 });
    }
    return data;
  }

  function getHeatmapData() {
    var cells = [];
    var endDate = new Date(now);
    endDate.setDate(endDate.getDate() - endDate.getDay());
    var startDate = new Date(endDate);
    startDate.setDate(startDate.getDate() - 48);
    var cur = new Date(startDate);
    while (cur <= endDate) {
      var ds = formatDateKey(cur);
      var entry = studyDataMap[ds] || { studyMinutes: 0 };
      cells.push({ date: ds, minutes: entry.studyMinutes, day: cur.getDay() });
      cur.setDate(cur.getDate() + 1);
    }
    return cells;
  }

  var heatmapCells = getHeatmapData();

  function heatColor(minutes) {
    if (minutes >= 240) return '#065f46';
    if (minutes >= 120) return '#059669';
    if (minutes >= 60) return '#34d399';
    if (minutes >= 30) return '#6ee7b7';
    if (minutes >= 1) return '#a7f3d0';
    return '#1f2937';
  }

  function getWeakAreas() {
    var weak = [];
    for (var wi = 0; wi < subjectList.length; wi++) {
      if (subjectList[wi].progress < 70) {
        weak.push({ name: subjectList[wi].name, progress: subjectList[wi].progress, color: subjectList[wi].color });
      }
    }
    weak.sort(function(a, b) { return a.progress - b.progress; });
    return weak;
  }

  function getStrongAreas() {
    var strong = [];
    for (var sii = 0; sii < subjectList.length; sii++) {
      if (subjectList[sii].progress >= 70) {
        strong.push({ name: subjectList[sii].name, progress: subjectList[sii].progress, color: subjectList[sii].color });
      }
    }
    strong.sort(function(a, b) { return b.progress - a.progress; });
    return strong;
  }

  function getAIRecommendations() {
    var weak = getWeakAreas();
    var recs = [];
    if (weak.length > 0) {
      recs.push({ icon: '\u0040\u0040EMOJI_BOOK', text: 'Focus on ' + weak[0].name + ' - your weakest subject (' + weak[0].progress + '%). Try daily practice for 30 min.' });
      recs.push({ icon: '\u0040\u0040EMOJI_VIDEO', text: 'Watch video tutorials for ' + (weak.length > 1 ? weak[1].name : weak[0].name) + ' to improve conceptual clarity.' });
      recs.push({ icon: '\u0040\u0040EMOJI_NOTE', text: 'Take chapter-wise quizzes in ' + (weak.length > 1 ? weak[1].name : weak[0].name) + ' to identify specific weak topics.' });
      recs.push({ icon: '\u0040\u0040EMOJI_CLOCK', text: 'Increase study time by 20 min daily to build consistency and improve retention.' });
    } else {
      recs.push({ icon: '\u0040\u0040EMOJI_STAR2', text: 'Great job! All subjects are above 70%. Focus on advanced topics and mock tests.' });
      recs.push({ icon: '\u0040\u0040EMOJI_BOOK', text: 'Try teaching concepts to others - it strengthens your understanding further.' });
    }
    if (streak.current < 7) {
      recs.push({ icon: '\u0040\u0040EMOJI_FIRE', text: 'Build your streak! Study at least 15 min each day to unlock the Week Warrior achievement.' });
    }
    if (recentQuizzesAvg < 80) {
      recs.push({ icon: '\u0040\u0040EMOJI_NOTE', text: 'Review incorrect quiz answers and retry. Target ' + (80 - recentQuizzesAvg) + '% improvement in average score.' });
    }
    return recs;
  }

  var styles = '\
<style>\
@keyframes fadeInUp{from{opacity:0;transform:translateY(15px)}to{opacity:1;transform:translateY(0)}}\
@keyframes barRise{from{height:0!important}}\
@keyframes progressFill{from{width:0%}}\
@keyframes xpGlow{0%,100%{box-shadow:0 0 8px rgba(6,182,212,0.3)}50%{box-shadow:0 0 20px rgba(6,182,212,0.6)}}\
@keyframes pulse{0%,100%{opacity:1}50%{opacity:0.5}}\
.dash-card{background:rgba(255,255,255,0.03);border:1px solid rgba(255,255,255,0.06);border-radius:16px;padding:var(--space-6);transition:all 0.3s}\
.dash-card:hover{border-color:rgba(255,255,255,0.1)}\
.period-tab{background:transparent;border:none;padding:8px 20px;font-size:var(--text-sm);color:var(--text-tertiary);cursor:pointer;border-radius:10px;transition:all 0.3s;font-weight:500}\
.period-tab:hover{color:var(--text-primary);background:rgba(255,255,255,0.04)}\
.period-tab-active{background:linear-gradient(135deg,rgba(6,182,212,0.15),rgba(59,130,246,0.15));color:var(--accent-cyan)!important;font-weight:600}\
.bar-elm{transition:height 0.6s cubic-bezier(0.4,0,0.2,1);animation:barRise 0.6s ease-out;border-radius:4px 4px 2px 2px;min-height:2px}\
.progress-fill{animation:progressFill 0.8s ease-out}\
.spark-bar{width:4px;border-radius:2px;transition:all 0.3s}\
.stat-card{animation:fadeInUp 0.5s ease-out}\
.heat-cell{aspect-ratio:1;border-radius:3px;cursor:pointer;transition:all 0.15s;border:1px solid transparent}\
.heat-cell:hover{transform:scale(1.3);border-color:rgba(255,255,255,0.3);z-index:3;position:relative}\
.achieve-badge{transition:all 0.3s}\
.achieve-badge:hover{transform:translateY(-3px)}\
.activity-item{transition:all 0.2s;border-radius:10px}\
.activity-item:hover{background:rgba(255,255,255,0.04)}\
.load-more-btn{background:rgba(255,255,255,0.04);border:1px solid rgba(255,255,255,0.06);padding:10px 24px;border-radius:12px;color:var(--text-secondary);cursor:pointer;font-size:var(--text-sm);transition:all 0.3s;font-weight:500}\
.load-more-btn:hover{background:rgba(255,255,255,0.08);color:var(--text-primary)}\
.report-btn{background:linear-gradient(135deg,var(--accent-cyan),var(--accent-blue));border:none;padding:10px 24px;border-radius:12px;color:#fff;font-weight:600;cursor:pointer;transition:all 0.3s;font-size:var(--text-sm)}\
.report-btn:hover{transform:translateY(-2px);box-shadow:0 6px 20px rgba(6,182,212,0.3)}\
.summary-stat-val{font-size:var(--text-2xl);font-weight:700}\
.rec-card{background:linear-gradient(135deg,rgba(6,182,212,0.08),rgba(59,130,246,0.05));border:1px solid rgba(6,182,212,0.12);border-radius:12px;padding:var(--space-4);transition:all 0.3s}\
.rec-card:hover{background:linear-gradient(135deg,rgba(6,182,212,0.12),rgba(59,130,246,0.08))}\
.achievement-card{transition:all 0.3s;border-radius:12px}\
.achievement-card:hover{transform:translateY(-2px)}\
.dash-table{width:100%;border-collapse:collapse}\
.dash-table th{text-align:left;padding:var(--space-2) var(--space-3);font-size:var(--text-xs);color:var(--text-tertiary);font-weight:600;text-transform:uppercase;letter-spacing:0.5px;border-bottom:1px solid rgba(255,255,255,0.06)}\
.dash-table td{padding:var(--space-2) var(--space-3);font-size:var(--text-sm);border-bottom:1px solid rgba(255,255,255,0.04)}\
.dash-table tr:hover td{background:rgba(255,255,255,0.02)}\
@media (max-width:768px){.dash-grid-6{grid-template-columns:repeat(2,1fr)!important}.dash-grid-3{grid-template-columns:1fr!important}.dash-grid-2{grid-template-columns:1fr!important}}\
</style>';

  function buildHTML(period) {
    var chartData;
    var chartMax = 1;
    var chartLabel = '';

    if (period === 'today') {
      chartData = getHourlyData();
      chartLabel = 'Hourly Study (6AM - 10PM)';
      for (var ci = 0; ci < chartData.length; ci++) { if (chartData[ci].minutes > chartMax) chartMax = chartData[ci].minutes; }
    } else if (period === 'week') {
      chartData = getWeekData();
      chartLabel = 'Daily Study (7 Days)';
      for (var ci2 = 0; ci2 < chartData.length; ci2++) { if (chartData[ci2].minutes > chartMax) chartMax = chartData[ci2].minutes; }
    } else if (period === 'month') {
      chartData = getMonthData();
      chartLabel = 'Daily Study (30 Days)';
      for (var ci3 = 0; ci3 < chartData.length; ci3++) { if (chartData[ci3].minutes > chartMax) chartMax = chartData[ci3].minutes; }
    } else {
      chartData = getYearData();
      chartLabel = 'Monthly Study (12 Months)';
      for (var ci4 = 0; ci4 < chartData.length; ci4++) { if (chartData[ci4].minutes > chartMax) chartMax = chartData[ci4].minutes; }
    }
    if (chartMax < 1) chartMax = 1;

    var ps = periodStats[period];

    var sp1 = getSparkline();
    var sp2 = getSparkline();
    var sp3 = getSparkline();
    var sp4 = getSparkline();
    var sp5 = getSparkline();
    var sp6 = getSparkline();

    function sparklineHTML(data, color) {
      var maxS = 1;
      for (var si = 0; si < data.length; si++) { if (data[si] > maxS) maxS = data[si]; }
      var h = '';
      for (var si2 = 0; si2 < data.length; si2++) {
        var pct = (data[si2] / maxS) * 100;
        h += '<div class="spark-bar" style="height:' + pct + '%;background:' + color + ';opacity:' + (0.4 + (data[si2] / maxS) * 0.6) + '"></div>';
      }
      return h;
    }

    var periodLabels = { today: 'Today', week: 'This Week', month: 'This Month', year: 'This Year' };
    var periods = ['today', 'week', 'month', 'year'];

    var weakAreas = getWeakAreas();
    var strongAreas = getStrongAreas();
    var aiRecs = getAIRecommendations();

    var html = '';
    html += styles;

    // Header with date range selector
    html += '\
<div class="page-container" style="max-width:1400px;margin:0 auto;padding:var(--space-6)">\
  <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:var(--space-5);animation:fadeInUp 0.3s ease-out;flex-wrap:wrap;gap:var(--space-3)">\
    <div>\
      <div style="font-size:var(--text-2xl);font-weight:700;color:var(--text-primary)">\u0040\u0040EMOJI_CHART Study Analytics</div>\
      <div class="c-fs-xs c-text-tertiary" style="margin-top:2px">' + periodLabels[period] + ' overview \u2022 ' + ps.totalHours + 'h studied</div>\
    </div>\
    <div class="c-flex c-flex-gap-3" style="flex-wrap:wrap">\
      <div style="display:flex;gap:2px;background:rgba(255,255,255,0.03);border-radius:12px;padding:3px;border:1px solid rgba(255,255,255,0.06)">';
    for (var pi = 0; pi < periods.length; pi++) {
      html += '\
        <button class="period-tab ' + (period === periods[pi] ? 'period-tab-active' : '') + '" data-period="' + periods[pi] + '" data-action="analytics:setPeriod:' + periods[pi] + '">' + periodLabels[periods[pi]] + '</button>';
    }
    html += '\
      </div>\
      <button class="report-btn" data-action="analytics:generateReport">\u0040\u0040EMOJI_FILE Download Report</button>\
    </div>\
  </div>';

    // Summary Cards Row (6 cards)
    html += '\
  <div class="dash-grid-6" style="display:grid;grid-template-columns:repeat(6,1fr);gap:var(--space-4);margin-bottom:var(--space-5);animation:fadeInUp 0.4s ease-out">\
    <div class="dash-card stat-card" style="padding:var(--space-4)">\
      <div class="c-text-tertiary c-fs-xs c-mb-1">\u0040\u0040EMOJI_BOOK Study Hours</div>\
      <div class="c-fs-2xl c-fw-bold c-text-accent">' + ps.totalHours + 'h</div>\
      <div class="c-fs-2xs c-text-secondary">Avg ' + ps.avgDailyHours + 'h/day</div>\
    </div>\
    <div class="dash-card stat-card" style="padding:var(--space-4)">\
      <div class="c-text-tertiary c-fs-xs c-mb-1">\u0040\u0040EMOJI_NOTE Quiz Avg</div>\
      <div class="c-fs-2xl c-fw-bold" style="color:var(--accent-purple)">' + ps.avgScore + '%</div>\
      <div class="c-fs-2xs c-text-secondary">' + ps.quizzesDone + ' quizzes</div>\
    </div>\
    <div class="dash-card stat-card" style="padding:var(--space-4)">\
      <div class="c-text-tertiary c-fs-xs c-mb-1">\u0040\u0040EMOJI_CLIP Exams Taken</div>\
      <div class="c-fs-2xl c-fw-bold" style="color:var(--accent-orange)">' + recentExams.length + '</div>\
      <div class="c-fs-2xs c-text-secondary">Avg ' + examAvg + '%</div>\
    </div>\
    <div class="dash-card stat-card" style="padding:var(--space-4)">\
      <div class="c-text-tertiary c-fs-xs c-mb-1">\u0040\u0040EMOJI_FIRE Current Streak</div>\
      <div class="c-fs-2xl c-fw-bold c-text-warning">' + streak.current + ' days</div>\
      <div class="c-fs-2xs c-text-secondary">Best ' + streak.longest + ' days</div>\
    </div>\
    <div class="dash-card stat-card" style="padding:var(--space-4)">\
      <div class="c-text-tertiary c-fs-xs c-mb-1">\u0040\u0040EMOJI_STAR2 XP Earned</div>\
      <div class="c-fs-2xl c-fw-bold c-text-success">' + totalXP.toLocaleString() + '</div>\
      <div class="c-fs-2xs c-text-secondary">Level ' + level + '</div>\
    </div>\
    <div class="dash-card stat-card" style="padding:var(--space-4)">\
      <div class="c-text-tertiary c-fs-xs c-mb-1">\u0040\u0040EMOJI_CLOCK Weekly Avg</div>\
      <div class="c-fs-2xl c-fw-bold" style="color:var(--accent-cyan)">' + periodStats.week.avgDailyHours + 'h</div>\
      <div class="c-fs-2xs c-text-secondary">This week</div>\
    </div>\
  </div>';

    // Row 1: Study Hours Bar Chart (full width)
    html += '\
  <div class="dash-card" style="margin-bottom:var(--space-5);animation:fadeInUp 0.45s ease-out">\
    <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:var(--space-4)">\
      <div>\
        <div class="c-fs-lg c-fw-semibold c-text-primary">\u0040\u0040EMOJI_CHART ' + chartLabel + '</div>\
        <div class="c-fs-xs c-text-tertiary" style="margin-top:2px">' + ps.totalHours + ' total hours</div>\
      </div>\
      <div class="c-fs-xs c-text-secondary">Avg: ' + ps.avgDailyHours + ' hrs/day</div>\
    </div>\
    <div style="display:flex;align-items:flex-end;gap:' + (period === 'year' ? 'var(--space-3)' : 'var(--space-2)') + ';height:200px;padding:var(--space-3) 0;border-bottom:1px solid rgba(255,255,255,0.06)">';

    for (var bi = 0; bi < chartData.length; bi++) {
      var item = chartData[bi];
      var val = item.minutes || item.hours * 60 || 0;
      var pct = (val / chartMax) * 100;
      if (pct < 2 && val > 0) pct = 2;
      var label = item.label || item.month || item.dayNum || '';
      var isActive = item.isToday || false;
      var barGrad = period === 'today'
        ? 'linear-gradient(180deg,var(--accent-cyan),var(--accent-blue))'
        : 'linear-gradient(180deg,rgba(6,182,212,0.7),rgba(59,130,246,0.4))';
      if (isActive) {
        barGrad = 'linear-gradient(180deg,var(--accent-green),var(--accent-cyan))';
      }
      var valDisplay = period === 'year' ? item.hours + 'h' : (Math.round(val / 60 * 10) / 10) + 'h';
      var tooltip = period === 'today' ? item.hour + ':00 - ' + val + ' min'
        : period === 'week' ? item.fullDay + ': ' + val + ' min'
        : period === 'month' ? 'Day ' + item.dayNum + ': ' + val + ' min'
        : item.month + ': ' + item.hours + ' hours';

      html += '\
      <div style="flex:1;display:flex;flex-direction:column;align-items:center;height:100%;justify-content:flex-end">\
        <div style="font-size:9px;font-weight:' + (isActive ? '700' : '400') + ';color:' + (isActive ? 'var(--accent-green)' : 'var(--text-tertiary)') + ';margin-bottom:4px">' + valDisplay + '</div>\
        <div class="bar-elm" style="width:100%;max-width:' + (period === 'year' ? '48' : '36') + 'px;height:' + pct + '%;background:' + barGrad + ';' + (isActive ? 'box-shadow:0 0 10px rgba(6,182,212,0.25)' : '') + '" title="' + tooltip + '"></div>\
        <div class="c-text-tertiary c-ellipsis c-text-center" style="font-size:8px;margin-top:var(--space-2);max-width:100%">' + label + '</div>\
      </div>';
    }

    html += '\
    </div>\
  </div>';

    // Row 2: Two columns - Weekly Progress line chart (left) + Monthly Progress (right)
    html += '\
  <div style="display:grid;grid-template-columns:1fr 1fr;gap:var(--space-5);margin-bottom:var(--space-5);animation:fadeInUp 0.5s ease-out" class="dash-grid-2">\
    <div class="dash-card">\
      <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:var(--space-4)">\
        <div class="c-fs-lg c-fw-semibold c-text-primary">\u0040\u0040EMOJI_CHART2 Weekly Progress</div>\
        <div class="c-fs-xs c-text-secondary">' + periodStats.week.studyDays + '/' + periodStats.week.totalDays + ' days active</div>\
      </div>\
      <div style="position:relative;height:160px">\
        <svg width="100%" height="160" viewBox="0 0 360 160" style="position:absolute;top:0;left:0">';
    var wkData = getWeekData();
    var wkMax = 1;
    for (var wki = 0; wki < wkData.length; wki++) { if (wkData[wki].minutes > wkMax) wkMax = wkData[wki].minutes; }
    if (wkMax < 1) wkMax = 1;
    var wkPts = [];
    var wkDots = [];
    for (var wki2 = 0; wki2 < wkData.length; wki2++) {
      var wx = 20 + wki2 * 48;
      var wy = 140 - (wkData[wki2].minutes / wkMax) * 120;
      wkPts.push(wx + ',' + wy);
      wkDots.push({ x: wx, y: wy, val: Math.round(wkData[wki2].minutes / 60 * 10) / 10 + 'h', label: wkData[wki2].label, isToday: wkData[wki2].isToday });
    }
    html += '\
          <polyline points="' + wkPts.join(' ') + '" fill="none" stroke="var(--accent-green)" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" opacity="0.8"/>\
          <polygon points="' + wkPts.join(' ') + ' ' + wkPts[wkPts.length - 1].split(',')[0] + ',140 20,140" fill="url(#wkGrad)" opacity="0.15"/>\
          <defs><linearGradient id="wkGrad" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="var(--accent-green)" stop-opacity="0.3"/><stop offset="100%" stop-color="var(--accent-green)" stop-opacity="0"/></linearGradient></defs>';
    for (var wdi = 0; wdi < wkDots.length; wdi++) {
      var dot = wkDots[wdi];
      html += '\
          <circle cx="' + dot.x + '" cy="' + dot.y + '" r="12" fill="transparent" cursor="pointer"><title>' + dot.val + ' - ' + dot.label + '</title></circle>\
          <circle cx="' + dot.x + '" cy="' + dot.y + '" r="4" fill="' + (dot.isToday ? 'var(--accent-green)' : 'var(--accent-cyan)') + '" stroke="#0f172a" stroke-width="1.5"/>';
    }
    html += '\
        </svg>\
      </div>\
    </div>\
    <div class="dash-card">\
      <div class="c-fs-lg c-fw-semibold c-text-primary c-mb-4">\u0040\u0040EMOJI_CALENDAR Monthly Progress</div>\
      <div style="display:flex;flex-direction:column;gap:var(--space-2)">';
    var moData = getMonthData();
    var moMax = 1;
    for (var moi = 0; moi < moData.length; moi++) { if (moData[moi].minutes > moMax) moMax = moData[moi].minutes; }
    if (moMax < 1) moMax = 1;
    for (var moi2 = Math.max(0, moData.length - 10); moi2 < moData.length; moi2++) {
      var moItem = moData[moi2];
      var moPct = (moItem.minutes / moMax) * 100;
      if (moPct < 2 && moItem.minutes > 0) moPct = 2;
      html += '\
        <div style="display:flex;align-items:center;gap:var(--space-2)">\
          <div class="c-fs-xs c-text-tertiary" style="min-width:50px">' + (moItem.dayNum <= 9 ? '0' : '') + moItem.dayNum + '</div>\
          <div style="flex:1;height:8px;background:rgba(255,255,255,0.06);border-radius:6px;overflow:hidden">\
            <div class="progress-fill" style="height:100%;width:' + moPct + '%;background:linear-gradient(90deg,var(--accent-cyan),var(--accent-blue));border-radius:6px"></div>\
          </div>\
          <div class="c-fs-xs c-text-secondary" style="min-width:36px;text-align:right">' + (Math.round(moItem.minutes / 60 * 10) / 10) + 'h</div>\
        </div>';
    }
    html += '\
      </div>\
    </div>\
  </div>';

    // Row 3: Subject Performance grid + Quiz Performance table + Exam Performance table
    html += '\
  <div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:var(--space-5);margin-bottom:var(--space-5);animation:fadeInUp 0.55s ease-out" class="dash-grid-3">\
    <div class="dash-card">\
      <div class="c-fs-lg c-fw-semibold c-text-primary c-mb-4">\u0040\u0040EMOJI_TARGET Subject Performance</div>\
      <div style="display:flex;flex-direction:column;gap:var(--space-3)">';
    var perfSubjects = subjectList.slice(0, 6);
    var perfMax = 1;
    for (var pi = 0; pi < perfSubjects.length; pi++) {
      if (perfSubjects[pi].progress > perfMax) perfMax = perfSubjects[pi].progress;
    }
    for (var pi2 = 0; pi2 < perfSubjects.length; pi2++) {
      var ps2 = perfSubjects[pi2];
      var barW = (ps2.progress / perfMax) * 100;
      html += '\
        <div>\
          <div style="display:flex;justify-content:space-between;margin-bottom:var(--space-1)">\
            <div class="c-fs-xs c-text-secondary">' + (Utils ? Utils.sanitizeHTML(ps2.name) : ps2.name) + '</div>\
            <div style="font-size:var(--text-xs);font-weight:600;color:' + ps2.color + '">' + ps2.progress + '%</div>\
          </div>\
          <div style="height:8px;background:rgba(255,255,255,0.06);border-radius:6px;overflow:hidden">\
            <div class="progress-fill" style="height:100%;width:' + barW + '%;background:linear-gradient(90deg,' + ps2.color + ',rgba(255,255,255,0.2));border-radius:6px;transition:width 0.6s"></div>\
          </div>\
        </div>';
    }
    html += '\
      </div>\
    </div>\
    <div class="dash-card">\
      <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:var(--space-4)">\
        <div class="c-fs-lg c-fw-semibold c-text-primary">\u0040\u0040EMOJI_NOTE Quiz Performance</div>\
        <div style="padding:3px 10px;border-radius:8px;font-size:9px;font-weight:600;background:rgba(59,130,246,0.1);color:var(--accent-blue)">Avg: ' + recentQuizzesAvg + '%</div>\
      </div>\
      <table class="dash-table">\
        <thead><tr><th>Date</th><th>Subject</th><th>Score</th></tr></thead>\
        <tbody>';
    var quizRows = recentQuizzes.slice(-5);
    for (var qri = 0; qri < quizRows.length; qri++) {
      var qr = quizRows[qri];
      var subjName = userSubjects[qri % userSubjects.length].name;
      html += '\
          <tr><td class="c-text-secondary">' + qr.date + '</td><td>' + subjName + '</td><td style="color:' + (qr.quizzesScore >= 80 ? 'var(--accent-green)' : qr.quizzesScore >= 50 ? 'var(--accent-orange)' : 'var(--accent-red)') + ';font-weight:600">' + qr.quizzesScore + '%</td></tr>';
    }
    html += '\
        </tbody>\
      </table>\
    </div>\
    <div class="dash-card">\
      <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:var(--space-4)">\
        <div class="c-fs-lg c-fw-semibold c-text-primary">\u0040\u0040EMOJI_CLIP Exam Performance</div>\
        <div style="padding:3px 10px;border-radius:8px;font-size:9px;font-weight:600;background:rgba(139,92,246,0.1);color:var(--accent-purple)">Avg: ' + examAvg + '%</div>\
      </div>\
      <table class="dash-table">\
        <thead><tr><th>Date</th><th>Exam</th><th>Score</th></tr></thead>\
        <tbody>';
    for (var eri = 0; eri < recentExams.length; eri++) {
      var er = recentExams[eri];
      html += '\
          <tr><td class="c-text-secondary">' + er.date + '</td><td>' + er.name + '</td><td style="color:' + (er.passed ? 'var(--accent-green)' : 'var(--accent-red)') + ';font-weight:600">' + er.score + '% ' + (er.passed ? '\u0040\u0040EMOJI_CHECKMARK' : '\u0040\u0040EMOJI_X') + '</td></tr>';
    }
    html += '\
        </tbody>\
      </table>\
    </div>\
  </div>';

    // Row 4: Learning Heatmap (full width) + Streak Calendar
    html += '\
  <div style="display:grid;grid-template-columns:2fr 1fr;gap:var(--space-5);margin-bottom:var(--space-5);animation:fadeInUp 0.6s ease-out" class="dash-grid-2">\
    <div class="dash-card">\
      <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:var(--space-4)">\
        <div class="c-fs-lg c-fw-semibold c-text-primary">\u0040\u0040EMOJI_HEATMAP Learning Heatmap</div>\
        <div class="c-fs-xs c-text-secondary">7 weeks \u2022 ' + heatmapCells.filter(function(c) { return c.minutes > 0; }).length + ' active days</div>\
      </div>\
      <div style="overflow-x:auto;padding-bottom:var(--space-2)">\
        <div style="display:grid;grid-template-columns:repeat(7,1fr);gap:3px;min-width:400px">';
    var dayLabels = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];
    for (var dli = 0; dli < 7; dli++) {
      html += '<div class="c-fs-2xs c-text-tertiary c-text-center" style="font-size:8px">' + dayLabels[dli] + '</div>';
    }
    for (var hci = 0; hci < heatmapCells.length; hci++) {
      var cell = heatmapCells[hci];
      html += '<div class="heat-cell" style="width:100%;aspect-ratio:1;background:' + heatColor(cell.minutes) + '" title="' + cell.date + ': ' + cell.minutes + ' min (' + (Math.round(cell.minutes / 60 * 10) / 10) + 'h)"></div>';
    }
    html += '\
        </div>\
      </div>\
      <div style="display:flex;align-items:center;gap:var(--space-2);margin-top:var(--space-3);font-size:8px;color:var(--text-tertiary)">\
        <span>Less</span>\
        <div style="width:10px;height:10px;border-radius:2px;background:#1f2937"></div>\
        <div style="width:10px;height:10px;border-radius:2px;background:#a7f3d0"></div>\
        <div style="width:10px;height:10px;border-radius:2px;background:#6ee7b7"></div>\
        <div style="width:10px;height:10px;border-radius:2px;background:#34d399"></div>\
        <div style="width:10px;height:10px;border-radius:2px;background:#059669"></div>\
        <div style="width:10px;height:10px;border-radius:2px;background:#065f46"></div>\
        <span>More</span>\
      </div>\
    </div>\
    <div class="dash-card">\
      <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:var(--space-4)">\
        <div class="c-fs-lg c-fw-semibold c-text-primary">\u0040\u0040EMOJI_FIRE Learning Streak</div>\
      </div>\
      <div class="c-text-center c-mb-4">\
        <div style="font-size:var(--text-4xl);font-weight:800;color:var(--accent-orange)">' + streak.current + '</div>\
        <div class="c-fs-sm c-text-secondary">Current Streak (days)</div>\
      </div>\
      <div class="c-text-center c-mb-4">\
        <div style="font-size:var(--text-2xl);font-weight:700;color:var(--accent-green)">' + streak.longest + '</div>\
        <div class="c-fs-sm c-text-secondary">Best Streak</div>\
      </div>\
      <div class="c-flex c-flex-gap-1 c-mb-3" style="justify-content:center;flex-wrap:wrap">';
    // Mini calendar: last 30 days
    for (var mi = 29; mi >= 0; mi--) {
      var d = new Date(now);
      d.setDate(d.getDate() - mi);
      var ds = formatDateKey(d);
      var entry = studyDataMap[ds] || { studyMinutes: 0 };
      var isToday2 = ds === todayStr;
      html += '\
        <div style="width:8px;height:8px;border-radius:2px;background:' + (isToday2 ? 'var(--accent-blue)' : heatColor(entry.studyMinutes)) + ';' + (isToday2 ? 'border:1px solid rgba(255,255,255,0.5)' : '') + '" title="' + ds + ': ' + entry.studyMinutes + ' min"></div>';
    }
    html += '\
      </div>\
      <div style="font-size:var(--text-xs);color:var(--text-secondary);text-align:center">\
        <span>Today: <strong style="color:' + (studiedToday ? 'var(--accent-green)' : 'var(--text-tertiary)') + '">' + (studiedToday ? 'Studied \u0040\u0040EMOJI_CHECKMARK' : 'Not yet') + '</strong></span>\
      </div>\
    </div>\
  </div>';

    // Row 5: Achievement Timeline + Weak Areas + Strong Areas
    html += '\
  <div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:var(--space-5);margin-bottom:var(--space-5);animation:fadeInUp 0.65s ease-out" class="dash-grid-3">\
    <div class="dash-card">\
      <div class="c-fs-lg c-fw-semibold c-text-primary c-mb-4">\u0040\u0040EMOJI_TROPHY Achievement Timeline</div>\
      <div style="display:flex;flex-direction:column;gap:var(--space-3)">';
    var displayAch = unlockedAchievements.slice(0, 4);
    if (displayAch.length > 0) {
      for (var ti = 0; ti < displayAch.length; ti++) {
        var ach = displayAch[ti];
        var d = new Date(ach.date);
        var dateStr = months[d.getMonth()] + ' ' + d.getDate();
        html += '\
        <div class="achievement-card c-flex c-flex-gap-3 c-p-3" style="background:rgba(16,185,129,0.06);border:1px solid rgba(16,185,129,0.1)">\
          <div class="c-flex-center c-fs-lg" style="width:40px;height:40px;border-radius:10px;background:rgba(16,185,129,0.1);flex-shrink:0">' + ach.icon + '</div>\
          <div style="flex:1;min-width:0">\
            <div class="c-fs-sm c-fw-semibold c-text-primary">' + ach.name + '</div>\
            <div class="c-fs-xs c-text-secondary">' + ach.desc + '</div>\
            <div class="c-fs-2xs c-text-tertiary c-mt-1">' + dateStr + ' \u2022 +' + ach.xp + ' XP</div>\
          </div>\
        </div>';
      }
      if (lockedAchievements.length > 0) {
        html += '\
        <div class="c-fs-xs c-text-tertiary c-text-center c-mt-2">' + lockedAchievements.length + ' more locked \u0040\u0040EMOJI_LOCK</div>';
      }
    } else {
      html += '\
        <div class="c-text-center c-py-6">\
          <div class="c-fs-2xl c-mb-2">\u0040\u0040EMOJI_TROPHY</div>\
          <div class="c-fs-sm c-text-secondary">No achievements unlocked yet</div>\
        </div>';
    }
    html += '\
      </div>\
    </div>\
    <div class="dash-card">\
      <div class="c-fs-lg c-fw-semibold c-text-primary c-mb-4">\u0040\u0040EMOJI_WARNING Weak Areas</div>\
      <div style="display:flex;flex-direction:column;gap:var(--space-3)">';
    if (weakAreas.length > 0) {
      for (var wai = 0; wai < weakAreas.length; wai++) {
        var wa = weakAreas[wai];
        html += '\
        <div>\
          <div style="display:flex;justify-content:space-between;margin-bottom:var(--space-1)">\
            <div class="c-fs-xs c-text-secondary">' + wa.name + '</div>\
            <div class="c-fs-xs c-fw-semibold" style="color:var(--accent-red)">' + wa.progress + '%</div>\
          </div>\
          <div style="height:6px;background:rgba(255,255,255,0.06);border-radius:3px;overflow:hidden">\
            <div class="progress-fill" style="height:100%;width:' + (wa.progress / 100) * 100 + '%;background:linear-gradient(90deg,var(--accent-red),rgba(239,68,68,0.3));border-radius:3px"></div>\
          </div>\
        </div>';
      }
    } else {
      html += '\
        <div class="c-text-center c-py-6">\
          <div class="c-fs-2xl c-mb-2">\u0040\u0040EMOJI_STAR2</div>\
          <div class="c-fs-sm c-text-secondary c-text-success">No weak areas! Keep up the great work.</div>\
        </div>';
    }
    html += '\
      </div>\
    </div>\
    <div class="dash-card">\
      <div class="c-fs-lg c-fw-semibold c-text-primary c-mb-4">\u0040\u0040EMOJI_STAR2 Strong Areas</div>\
      <div style="display:flex;flex-direction:column;gap:var(--space-3)">';
    if (strongAreas.length > 0) {
      for (var sai = 0; sai < strongAreas.length; sai++) {
        var sa = strongAreas[sai];
        html += '\
        <div>\
          <div style="display:flex;justify-content:space-between;margin-bottom:var(--space-1)">\
            <div class="c-fs-xs c-text-secondary">' + sa.name + '</div>\
            <div class="c-fs-xs c-fw-semibold" style="color:var(--accent-green)">' + sa.progress + '%</div>\
          </div>\
          <div style="height:6px;background:rgba(255,255,255,0.06);border-radius:3px;overflow:hidden">\
            <div class="progress-fill" style="height:100%;width:' + (sa.progress / 100) * 100 + '%;background:linear-gradient(90deg,var(--accent-green),rgba(16,185,129,0.3));border-radius:3px"></div>\
          </div>\
        </div>';
      }
    } else {
      html += '\
        <div class="c-text-center c-py-6">\
          <div class="c-fs-2xl c-mb-2">\u0040\u0040EMOJI_BOOK</div>\
          <div class="c-fs-sm c-text-secondary">Keep studying to build strong areas!</div>\
        </div>';
    }
    html += '\
      </div>\
    </div>\
  </div>';

    // Row 6: AI Recommendations
    html += '\
  <div class="dash-card" style="margin-bottom:var(--space-5);animation:fadeInUp 0.7s ease-out">\
    <div class="c-fs-lg c-fw-semibold c-text-primary c-mb-4">\u0040\u0040EMOJI_ROBOT AI Recommendations</div>\
    <div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(280px,1fr));gap:var(--space-3)">';
    for (var ri = 0; ri < aiRecs.length; ri++) {
      var rec = aiRecs[ri];
      html += '\
      <div class="rec-card c-flex c-flex-gap-3">\
        <div class="c-fs-lg c-flex-shrink-0">' + rec.icon + '</div>\
        <div class="c-fs-sm c-text-secondary" style="line-height:1.5">' + rec.text + '</div>\
      </div>';
    }
    html += '\
    </div>\
  </div>';

    // Row 7: Recent Activity
    var showActivities = allActivity.slice(0, maxActivity);
    var hasMore = allActivity.length > maxActivity;

    html += '\
  <div class="dash-card" style="animation:fadeInUp 0.75s ease-out" id="analytics-activity-card">\
    <div class="c-fs-lg c-fw-semibold c-text-primary c-mb-4">\u0040\u0040EMOJI_CLOCK Recent Activity</div>\
    <div id="activity-container">';

    for (var aci = 0; aci < showActivities.length; aci++) {
      var act = showActivities[aci];
      html += '\
      <div class="activity-item c-flex c-flex-gap-3 c-p-3" style="margin-bottom:2px">\
        <div style="width:36px;height:36px;border-radius:10px;background:rgba(255,255,255,0.04);font-size:1.1rem;flex-shrink:0" class="c-flex-center">' + act.icon + '</div>\
        <div class="c-flex-1" style="min-width:0">\
          <div class="c-fs-sm c-text-primary c-fw-medium c-ellipsis">' + act.text + '</div>\
        </div>\
        <div class="c-fs-xs c-text-tertiary c-flex-shrink-0">' + formatTimeAgo(act.time) + '</div>\
      </div>';
    }

    html += '\
    </div>';

    if (hasMore) {
      html += '\
    <div style="text-align:center;margin-top:var(--space-3)">\
      <button class="load-more-btn" id="load-more-btn" data-action="analytics:loadMore">Load More (' + (allActivity.length - maxActivity) + ' more)</button>\
    </div>';
    }

    html += '\
  </div>\
</div>';

    return html;
  }

  var currentPeriod = 'week';

  window.analyticsSetPeriod = function(period) {
    currentPeriod = period;
    mainContent.innerHTML = buildHTML(period);
  };

  window.analyticsGenerateReport = function() {
    var s = allStats;
    var report = '';
    report += '=== STUDY ANALYTICS REPORT ===\n';
    report += 'Generated: ' + now.toLocaleDateString() + '\n\n';
    report += 'TOTAL STATS\n';
    report += '  Total Study Hours: ' + s.totalHours + '\n';
    report += '  Average Daily: ' + s.avgDailyHours + ' hours\n';
    report += '  Quizzes Completed: ' + s.quizzesDone + '\n';
    report += '  Average Quiz Score: ' + s.avgScore + '%\n';
    report += '  Current Streak: ' + streak.current + ' days\n';
    report += '  Longest Streak: ' + streak.longest + ' days\n';
    report += '  XP Earned: ' + s.xpEarned + '\n\n';
    report += 'WEEKLY STATS\n';
    report += '  Hours This Week: ' + periodStats.week.totalHours + '\n';
    report += '  Quizzes This Week: ' + periodStats.week.quizzesDone + '\n\n';
    report += 'MONTHLY STATS\n';
    report += '  Hours This Month: ' + periodStats.month.totalHours + '\n';
    report += '  Study Days: ' + periodStats.month.studyDays + '/' + periodStats.month.totalDays + '\n\n';
    report += 'SUBJECT BREAKDOWN\n';
    for (var rs = 0; rs < subjectList.length; rs++) {
      report += '  ' + subjectList[rs].name + ': ' + subjectList[rs].progress + '%\n';
    }
    report += '\nWEAK AREAS\n';
    var weakAreas = getWeakAreas();
    if (weakAreas.length > 0) {
      for (var wri = 0; wri < weakAreas.length; wri++) {
        report += '  - ' + weakAreas[wri].name + ' (' + weakAreas[wri].progress + '%)\n';
      }
    } else {
      report += '  No weak areas identified.\n';
    }
    report += '\nRECOMMENDATIONS\n';
    var aiRecs = getAIRecommendations();
    for (var rri = 0; rri < aiRecs.length; rri++) {
      report += '  - ' + aiRecs[rri].text + '\n';
    }
    report += '\nACHIEVEMENTS\n';
    for (var ra = 0; ra < achievements.length; ra++) {
      var a = achievements[ra];
      report += '  ' + (a.unlocked ? '[\u2713]' : '[ ]') + ' ' + a.name + ' (' + a.desc + ')\n';
    }
    var win = window.open('', '_blank');
    if (!win) { alert('Please allow pop-ups to generate report.'); return; }
    win.document.write('<html><head><title>Study Analytics Report</title>');
    win.document.write('<style>body{font-family:monospace;padding:40px;background:#0f172a;color:#e2e8f0;line-height:1.6}');
    win.document.write('h1{color:#06b6d4;border-bottom:2px solid rgba(6,182,212,0.3);padding-bottom:10px}');
    win.document.write('h2{color:#8b5cf6;margin-top:30px}');
    win.document.write('pre{white-space:pre-wrap;font-size:14px}');
    win.document.write('.footer{margin-top:40px;padding-top:20px;border-top:1px solid rgba(255,255,255,0.1);font-size:12px;color:#64748b}');
    win.document.write('@media print{body{background:#fff;color:#333}button{display:none}}');
    win.document.write('button{padding:10px 24px;background:linear-gradient(135deg,#06b6d4,#3b82f6);border:none;border-radius:8px;color:#fff;cursor:pointer;font-size:14px;margin-bottom:20px}');
    win.document.write('button:hover{opacity:0.9}');
    win.document.write('</style></head><body>');
    win.document.write('<button id="print-btn">\u0040\u0040EMOJI_PRINT Print / Save PDF</button>');
    win.document.write('<h1>\u0040\u0040EMOJI_CHART Study Analytics Report</h1>');
    win.document.write('<pre>' + report.replace(/\n/g, '<br>') + '</pre>');
    win.document.write('<div class="footer">Generated by Edu-Mentee Analytics</div>');
    win.document.write('</body></html>');
    win.document.close();
    win.document.getElementById('print-btn').onclick = function() { win.print(); };
  };

  window.analyticsLoadMore = function() {
    var container = document.getElementById('activity-container');
    var btn = document.getElementById('load-more-btn');
    if (!container) return;
    var currentCount = container.children.length;
    var remaining = allActivity.slice(currentCount, currentCount + maxActivity);
    for (var ami = 0; ami < remaining.length; ami++) {
      var act = remaining[ami];
      var item = document.createElement('div');
      item.className = 'activity-item c-flex c-flex-gap-3 c-p-3';
      item.style.cssText = 'margin-bottom:2px';
      item.innerHTML = '\
        <div style="width:36px;height:36px;border-radius:10px;background:rgba(255,255,255,0.04);font-size:1.1rem;flex-shrink:0" class="c-flex-center">' + act.icon + '</div>\
        <div class="c-flex-1" style="min-width:0">\
          <div class="c-fs-sm c-text-primary c-fw-medium c-ellipsis">' + act.text + '</div>\
        </div>\
        <div class="c-fs-xs c-text-tertiary c-flex-shrink-0">' + formatTimeAgo(act.time) + '</div>';
      container.appendChild(item);
    }
    if (btn && container.children.length >= allActivity.length) {
      btn.style.display = 'none';
    }
  };

  mainContent.innerHTML = buildHTML('week');
};
