window.renderPage.aiRoute = function(params) {
  if (!window._airouteDelegated) {
    window._airouteDelegated = true;
    document.addEventListener('click', function(e) {
      var el = e.target.closest('[data-action^="airoute:"]');
      if (!el) return;
      var action = el.getAttribute('data-action');
      var fn;
      if (action === 'airoute:generateInteractive') fn = window.renderPage.aiRoute.generateInteractive;
      else if (action === 'airoute:regenerateInteractive') fn = window.renderPage.aiRoute.regenerateInteractive;
      else if (action === 'airoute:generate') fn = window.renderPage.aiRoute.generate;
      else if (action === 'airoute:regenerate') fn = window.renderPage.aiRoute.regenerate;
      else if (action === 'airoute:toggleWeak') fn = function() { window.renderPage.aiRoute.toggleWeak(el, el.getAttribute('data-subject-id')); };
      else if (action === 'airoute:toggleComplete') fn = function() { window.renderPage.aiRoute.toggleComplete(el.getAttribute('data-day-idx'), el.getAttribute('data-session-idx')); };
      if (fn) fn();
    });
  }
  var mainContent = document.getElementById('main-content');
  var store = window.Store;
  var api = window.API;
  var utils = window.Utils;
  var md = window.mockData;
  var user = store.get('user') || {};
  var studyPlan = store.get('studyPlan');
  var interactivePlan = store.get('aiStudyPlan');
  var subjects = md.subjects || [];
  var enrolledClass = user.class || 6;
  var enrolledStream = user.stream || '';

  var userSubjects = [];
  for (var i = 0; i < subjects.length; i++) {
    var sub = subjects[i];
    if (sub.class == enrolledClass) {
      if ((enrolledClass == 11 || enrolledClass == 12) && sub.stream && sub.stream !== enrolledStream) continue;
      userSubjects.push(sub);
    }
  }

  var planGenerated = false;
  var generating = false;

  function getSubjectName(id) {
    for (var i = 0; i < subjects.length; i++) {
      if (subjects[i].id === id) return subjects[i].name;
    }
    return id;
  }

  function getSubjectIcon(name) {
    for (var i = 0; i < subjects.length; i++) {
      if (subjects[i].name === name) return subjects[i].icon;
    }
    return '📚';
  }

  function getSubjectColor(name) {
    for (var i = 0; i < subjects.length; i++) {
      if (subjects[i].name === name) return subjects[i].color;
    }
    return '#3b82f6';
  }

  var subjectResources = {
    'Mathematics': ['NCERT Exemplar Problems', 'Khan Academy Series', 'Previous Year Papers', 'Formula Flashcards', 'Speed Math Worksheets'],
    'Science': ['Lab Simulation Videos', 'Concept Map Workbooks', 'MCQ Practice Banks', 'Science Quiz Apps', 'Experiment Guides'],
    'Physics': ['HC Verma Concepts', 'Numerical Practice Books', 'Formula Sheets', 'PhET Simulations', 'Problem-Solving Videos'],
    'Chemistry': ['Reaction Mechanism Charts', 'Periodic Table Games', 'Organic Flashcards', 'Mole Concept Worksheets', 'Lab Safety Guides'],
    'Biology': ['3D Anatomy Models', 'Diagram Practice', 'NEET-style MCQs', 'Bio Flashcards', 'Lab Manual Videos'],
    'English': ['Grammar Workbook', 'Vocabulary Builder', 'Comprehension Passages', 'Essay Templates', 'Literature Summaries'],
    'Social Studies': ['Map Practice Atlas', 'Timeline Charts', 'Case Study Collections', 'Map Labeling Sheets', 'Current Affairs Digest'],
    'History': ['Timeline Infographics', 'Documentary List', 'Key Events Cards', 'Biography Notes', 'Map Timeline Overlays'],
    'Geography': ['Atlas Exercises', 'Climate Zone Maps', 'Population Pyramids', 'Natural Disaster Studies', 'Map Marking Practice'],
    'Political Science': ['Constitution Charts', 'Political Theory Notes', 'Amendments Flashcards', 'Case Law Summaries', 'Policy Analysis'],
    'Economics': ['Graph Practice Sheets', 'Data Interpretation', 'Budget Analysis', 'Market Case Studies', 'Economic Formulas'],
    'Accountancy': ['Journal Entry Practice', 'Ledger Templates', 'Financial Statements', 'Ratio Flashcards', 'Trial Balance Sheets'],
    'Business Studies': ['Case Study Repository', 'Management Theories', 'Marketing Mix Charts', 'Org Structure Diagrams', 'Business Terminology']
  };

  function generateSubjectSchedule(plan) {
    var dailySchedule = [];
    var now = new Date();
    var examDt = new Date(plan.examDate);
    var daysUntil = Math.ceil((examDt - now) / 86400000);
    if (daysUntil < 1) daysUntil = 1;
    var revisionStart = Math.max(1, daysUntil - 13);
    var allSubjects = plan.weakSubjects.concat(plan.strongSubjects);
    var weakIds = {};
    for (var wi = 0; wi < plan.weakSubjects.length; wi++) weakIds[plan.weakSubjects[wi].id] = true;
    var weakNames = {};
    for (var wn = 0; wn < plan.weakSubjects.length; wn++) weakNames[plan.weakSubjects[wn].name] = true;

    var weakIdx = 0;
    var strongIdx = 0;
    var numWeakPerDay = Math.min(2, plan.weakSubjects.length || 1);
    var numStrongPerDay = Math.min(1, plan.strongSubjects.length || 1);

    for (var d = 0; d < daysUntil; d++) {
      var dayNum = d + 1;
      var isRevision = dayNum >= revisionStart;
      var date = new Date(now.getTime() + d * 86400000);
      var dateStr = date.toISOString().split('T')[0];
      var daySubjects = [];

      if (isRevision) {
        for (var ri = 0; ri < allSubjects.length; ri++) daySubjects.push(allSubjects[ri]);
      } else {
        if (plan.weakSubjects.length > 0) {
          for (var w = 0; w < numWeakPerDay; w++) {
            var ws = plan.weakSubjects[(weakIdx + w) % plan.weakSubjects.length];
            daySubjects.push(ws);
          }
          weakIdx = (weakIdx + numWeakPerDay) % plan.weakSubjects.length;
        }
        if (plan.strongSubjects.length > 0) {
          for (var st = 0; st < numStrongPerDay; st++) {
            var ss = plan.strongSubjects[(strongIdx + st) % plan.strongSubjects.length];
            daySubjects.push(ss);
          }
          strongIdx = (strongIdx + numStrongPerDay) % plan.strongSubjects.length;
        }
      }

      var dayWeakCount = 0;
      var dayStrongCount = 0;
      for (var dc = 0; dc < daySubjects.length; dc++) {
        if (weakIds[daySubjects[dc].id]) dayWeakCount++;
        else dayStrongCount++;
      }
      if (dayWeakCount === 0 && dayStrongCount === 0) {
        if (allSubjects.length > 0) { daySubjects.push(allSubjects[0]); dayWeakCount = weakIds[allSubjects[0].id] ? 1 : 0; dayStrongCount = dayWeakCount === 0 ? 1 : 0; }
      }

      var totalWeight = dayWeakCount * 2 + dayStrongCount * 1;
      var daySessions = [];
      var assignedHours = 0;

      for (var si = 0; si < daySubjects.length; si++) {
        var subj = daySubjects[si];
        var isWeak = weakIds[subj.id];
        var weight = isWeak ? 2 : 1;
        var rawHours = (weight / totalWeight) * plan.hoursPerDay;
        var rounded = Math.floor(rawHours * 2) / 2;
        if (rounded < 0.5) rounded = 0.5;
        if (si === daySubjects.length - 1) rounded = Math.round((plan.hoursPerDay - assignedHours) * 2) / 2;
        if (rounded < 0) rounded = 0;
        assignedHours += rounded;
        daySessions.push({ subjectId: subj.id, subjectName: subj.name, hours: rounded, type: isRevision ? 'revision' : 'study' });
      }

      dailySchedule.push({ day: dayNum, date: dateStr, isRevision: isRevision, sessions: daySessions });
    }
    return dailySchedule;
  }

  function buildWeeklyPlan(dailySchedule, plan) {
    var weekly = [];
    var currentWeek = [];
    var weekNum = 1;
    for (var di = 0; di < dailySchedule.length; di++) {
      currentWeek.push(dailySchedule[di]);
      if (currentWeek.length === 7 || di === dailySchedule.length - 1) {
        var subjHours = {};
        var totalH = 0;
        for (var ci = 0; ci < currentWeek.length; ci++) {
          for (var si = 0; si < currentWeek[ci].sessions.length; si++) {
            var s = currentWeek[ci].sessions[si];
            if (!subjHours[s.subjectName]) subjHours[s.subjectName] = 0;
            subjHours[s.subjectName] += s.hours;
            totalH += s.hours;
          }
        }
        var startDate = currentWeek[0].date;
        var endDate = currentWeek[currentWeek.length - 1].date;
        var isRev = currentWeek[0].isRevision;
        weekly.push({ week: weekNum, startDate: startDate, endDate: endDate, subjectHours: subjHours, totalHours: Math.round(totalH), isRevision: isRev });
        currentWeek = [];
        weekNum++;
      }
    }
    return weekly;
  }

  function buildMonthlyOverview(dailySchedule) {
    var months = {};
    for (var di = 0; di < dailySchedule.length; di++) {
      var monthKey = dailySchedule[di].date.substring(0, 7);
      if (!months[monthKey]) months[monthKey] = { subjects: {}, count: 0 };
      months[monthKey].count++;
      for (var si = 0; si < dailySchedule[di].sessions.length; si++) {
        var s = dailySchedule[di].sessions[si];
        if (!months[monthKey].subjects[s.subjectName]) months[monthKey].subjects[s.subjectName] = 0;
        months[monthKey].subjects[s.subjectName] += s.hours;
      }
    }
    var result = [];
    var monthNames = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
    for (var mk in months) {
      var parts = mk.split('-');
      var monthLabel = monthNames[parseInt(parts[1]) - 1] + ' ' + parts[0];
      var sorted = Object.keys(months[mk].subjects).sort(function(a, b) { return months[mk].subjects[b] - months[mk].subjects[a]; });
      var topSubjects = sorted.slice(0, 3);
      result.push({ month: monthLabel, monthKey: mk, days: months[mk].count, topSubjects: topSubjects, subjectHours: months[mk].subjects });
    }
    return result;
  }

  function buildProgressGoals(weeklyPlan, plan) {
    var goals = [];
    var goalTemplates = [
      'Complete foundational topics for ',
      'Master core concepts in ',
      'Practice advanced problems for ',
      'Complete 50%% syllabus for ',
      'Take practice test for ',
      'Complete 75%% syllabus for ',
      'Review and strengthen ',
      'Final revision of '
    ];
    for (var wi = 0; wi < weeklyPlan.length; wi++) {
      var wk = weeklyPlan[wi];
      if (wk.isRevision) {
        goals.push({ week: wk.week, milestone: 'Full revision of all subjects. Take mock tests.', date: wk.endDate, type: 'revision' });
      } else {
        var weakNames = [];
        for (var si = 0; si < plan.weakSubjects.length; si++) weakNames.push(plan.weakSubjects[si].name);
        var templateIdx = wi % goalTemplates.length;
        var subjectsStr = weakNames.length > 0 ? weakNames.join(', ') : (Object.keys(wk.subjectHours).join(', '));
        goals.push({ week: wk.week, milestone: goalTemplates[templateIdx] + subjectsStr, date: wk.endDate, type: 'study' });
      }
    }
    if (goals.length > 0) {
      goals.push({ week: 'Final', milestone: 'Exam Day - Stay confident and do your best!', date: weeklyPlan[weeklyPlan.length - 1].endDate, type: 'exam' });
    }
    return goals;
  }

  function getRecommendations(subjectNames) {
    var recs = [];
    for (var si = 0; si < subjectNames.length; si++) {
      var name = subjectNames[si];
      var resources = subjectResources[name] || ['Textbook Chapter Reviews', 'Practice Exercise Books', 'Online Tutorial Videos', 'Study Group Discussions', 'Flashcard Sets'];
      recs.push({ subjectName: name, resources: resources });
    }
    return recs;
  }

  function renderInteractivePlan(plan) {
    if (!plan || !plan.dailySchedule) { renderNoPlan(); return; }
    var dailySchedule = plan.dailySchedule;
    var weeklyPlan = buildWeeklyPlan(dailySchedule, plan);
    var monthlyOverview = buildMonthlyOverview(dailySchedule);
    var progressGoals = buildProgressGoals(weeklyPlan, plan);
    var weakSubjectNames = [];
    for (var wsi = 0; wsi < plan.weakSubjects.length; wsi++) weakSubjectNames.push(plan.weakSubjects[wsi].name);
    var recommendations = getRecommendations(weakSubjectNames.length > 0 ? weakSubjectNames : (plan.strongSubjects.length > 0 ? [plan.strongSubjects[0].name] : ['Mathematics']));
    var now = new Date();
    var examDt = new Date(plan.examDate);
    var daysLeft = Math.max(0, Math.ceil((examDt - now) / 86400000));
    var totalDays = dailySchedule.length;
    var completedDays = 0;
    for (var di = 0; di < dailySchedule.length; di++) {
      var allDone = true;
      for (var si = 0; si < dailySchedule[di].sessions.length; si++) {
        if (!dailySchedule[di].sessions[si].completed) { allDone = false; break; }
      }
      if (allDone) completedDays++;
    }
    var progressPct = totalDays > 0 ? Math.round((completedDays / totalDays) * 100) : 0;
    var weekDays = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];

    var html = '<div class="page-container">';
    html += '<div class="page-header">';
    html += '<div><h1 class="page-title">📋 Interactive Study Planner</h1><p class="page-subtitle">Your personalized study plan - ' + totalDays + ' days until ' + plan.examDate + '</p></div>';
    html += '<div class="flex items-center gap-3"><button class="btn btn-secondary" data-action="airoute:regenerateInteractive">🔄 Regenerate Plan</button></div>';
    html += '</div>';

    html += '<div class="stats-grid" style="margin-bottom:var(--space-6)">';
    html += '<div class="stat-card"><div class="stat-value">' + plan.hoursPerDay + 'h</div><div class="stat-label">Hours / Day</div></div>';
    html += '<div class="stat-card"><div class="stat-value">' + daysLeft + '</div><div class="stat-label">Days Left</div></div>';
    html += '<div class="stat-card"><div class="stat-value">' + progressPct + '%</div><div class="stat-label">Progress</div></div>';
    html += '<div class="stat-card"><div class="stat-value">' + (plan.weakSubjects.length + plan.strongSubjects.length) + '</div><div class="stat-label">Subjects</div></div>';
    html += '<div class="stat-card"><div class="stat-value">' + plan.preference + '</div><div class="stat-label">Preference</div></div>';
    html += '</div>';

    html += '<div class="progress-bar" style="height:12px;margin-bottom:var(--space-6);border-radius:var(--radius-full)"><div class="progress-bar-fill" style="width:' + progressPct + '%"></div></div>';

    html += '<div class="section-header"><h3 class="section-title">📅 Daily Plan</h3></div>';

    var currentDisplayDay = 0;
    var weekViewIdx = 0;
    while (currentDisplayDay < Math.min(dailySchedule.length, 28)) {
      var weekEnd = Math.min(currentDisplayDay + 7, dailySchedule.length);
      html += '<div class="glass-card" style="padding:var(--space-4);margin-bottom:var(--space-4)">';
      html += '<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:var(--space-3)">';
      html += '<h4 style="font-weight:600;font-size:var(--text-sm)">Week ' + (weekViewIdx + 1) + ' (' + dailySchedule[currentDisplayDay].date + ' - ' + dailySchedule[weekEnd - 1].date + ')</h4>';
      if (dailySchedule[currentDisplayDay].isRevision) html += '<span class="badge" style="background:var(--accent-orange);color:#000">🔄 Revision Week</span>';
      html += '</div>';
      html += '<div style="overflow-x:auto"><table style="width:100%;border-collapse:collapse;font-size:var(--text-sm)">';
      html += '<thead><tr style="border-bottom:1px solid var(--border-color)">';
      html += '<th style="padding:var(--space-2);text-align:left;color:var(--text-secondary)">Day</th>';
      html += '<th style="padding:var(--space-2);text-align:left;color:var(--text-secondary)">Date</th>';
      var allSubjSet = {};
      for (var di2 = currentDisplayDay; di2 < weekEnd; di2++) {
        for (var si2 = 0; si2 < dailySchedule[di2].sessions.length; si2++) {
          allSubjSet[dailySchedule[di2].sessions[si2].subjectName] = true;
        }
      }
      var colSubjects = Object.keys(allSubjSet);
      for (var ci = 0; ci < colSubjects.length; ci++) {
        html += '<th style="padding:var(--space-2);text-align:center;color:var(--text-secondary)">' + colSubjects[ci] + '</th>';
      }
      html += '<th style="padding:var(--space-2);text-align:center;color:var(--text-secondary)">Total</th>';
      html += '<th style="padding:var(--space-2);text-align:center;color:var(--text-secondary)"></th>';
      html += '</tr></thead><tbody>';
      for (var di3 = currentDisplayDay; di3 < weekEnd; di3++) {
        var day = dailySchedule[di3];
        var dow = weekDays[(now.getDay() + di3) % 7];
        html += '<tr style="border-bottom:1px solid var(--border-color)">';
        html += '<td style="padding:var(--space-2);font-weight:500">Day ' + day.day + '</td>';
        html += '<td style="padding:var(--space-2);color:var(--text-secondary)">' + dow + ', ' + day.date + '</td>';
        var subjMap = {};
        var dayTotal = 0;
        for (var si3 = 0; si3 < day.sessions.length; si3++) {
          subjMap[day.sessions[si3].subjectName] = day.sessions[si3].hours;
          dayTotal += day.sessions[si3].hours;
        }
        for (var ci2 = 0; ci2 < colSubjects.length; ci2++) {
          var h = subjMap[colSubjects[ci2]] || '-';
          var isWeak = false;
          for (var wi2 = 0; wi2 < plan.weakSubjects.length; wi2++) {
            if (plan.weakSubjects[wi2].name === colSubjects[ci2]) { isWeak = true; break; }
          }
          var cellStyle = isWeak && h !== '-' ? 'color:var(--accent-orange);font-weight:600' : '';
          html += '<td style="padding:var(--space-2);text-align:center;' + cellStyle + '">' + h + '</td>';
        }
        html += '<td style="padding:var(--space-2);text-align:center;font-weight:600">' + dayTotal + 'h</td>';
        html += '<td style="padding:var(--space-2);text-align:center">';
        if (day.isRevision) html += '<span style="font-size:0.75rem;color:var(--accent-orange)">🔄</span>';
        else html += '<span style="font-size:0.75rem;color:var(--accent-green)">📖</span>';
        html += '</td>';
        html += '</tr>';
      }
      html += '</tbody></table></div>';
      html += '</div>';
      currentDisplayDay = weekEnd;
      weekViewIdx++;
    }

    html += '<div class="section-header"><h3 class="section-title">📊 Weekly Plan</h3></div>';
    html += '<div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(280px,1fr));gap:var(--space-4);margin-bottom:var(--space-8)">';
    for (var wpi = 0; wpi < weeklyPlan.length; wpi++) {
      var wp = weeklyPlan[wpi];
      var borderColor = wp.isRevision ? 'var(--accent-orange)' : 'var(--accent-blue)';
      html += '<div class="glass-card" style="padding:var(--space-4);border-top:3px solid ' + borderColor + '">';
      html += '<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:var(--space-2)">';
      html += '<h4 style="font-weight:600;font-size:var(--text-sm)">Week ' + wp.week + '</h4>';
      if (wp.isRevision) html += '<span class="badge" style="background:var(--accent-orange);color:#000;font-size:0.7rem">REVISION</span>';
      html += '</div>';
      html += '<div style="font-size:0.75rem;color:var(--text-secondary);margin-bottom:var(--space-2)">' + wp.startDate + ' → ' + wp.endDate + '</div>';
      html += '<div style="font-size:0.75rem;color:var(--text-secondary);margin-bottom:var(--space-3)">Total: ' + wp.totalHours + ' hours</div>';
      var sortedSubjs = Object.keys(wp.subjectHours).sort(function(a,b) { return wp.subjectHours[b] - wp.subjectHours[a]; });
      for (var si4 = 0; si4 < sortedSubjs.length; si4++) {
        var sName = sortedSubjs[si4];
        var pct = wp.totalHours > 0 ? Math.round((wp.subjectHours[sName] / wp.totalHours) * 100) : 0;
        var isWkWeak = false;
        for (var wi3 = 0; wi3 < plan.weakSubjects.length; wi3++) {
          if (plan.weakSubjects[wi3].name === sName) { isWkWeak = true; break; }
        }
        var barColor = isWkWeak ? 'var(--accent-orange)' : '#3b82f6';
        html += '<div style="margin-bottom:var(--space-1)">';
        html += '<div style="display:flex;justify-content:space-between;font-size:0.7rem;margin-bottom:2px">';
        html += '<span>' + getSubjectIcon(sName) + ' ' + sName + '</span><span>' + wp.subjectHours[sName] + 'h</span>';
        html += '</div>';
        html += '<div class="progress-bar" style="height:4px"><div class="progress-bar-fill" style="width:' + pct + '%;background:' + barColor + '"></div></div>';
        html += '</div>';
      }
      html += '</div>';
    }
    html += '</div>';

    html += '<div class="section-header"><h3 class="section-title">🔄 Revision Plan</h3></div>';
    var revisionWeeks = [];
    for (var rwi = 0; rwi < weeklyPlan.length; rwi++) {
      if (weeklyPlan[rwi].isRevision) revisionWeeks.push(weeklyPlan[rwi]);
    }
    if (revisionWeeks.length === 0) {
      html += '<div class="glass-card" style="padding:var(--space-4);margin-bottom:var(--space-8);text-align:center">';
      html += '<p class="text-sm text-secondary">Revision period has not started yet. Your last 2 weeks before the exam will be marked for revision.</p>';
      html += '</div>';
    } else {
      html += '<div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(300px,1fr));gap:var(--space-4);margin-bottom:var(--space-8)">';
      for (var rwi2 = 0; rwi2 < revisionWeeks.length; rwi2++) {
        var rw = revisionWeeks[rwi2];
        html += '<div class="glass-card" style="padding:var(--space-4);border-top:3px solid var(--accent-orange);background:linear-gradient(135deg,rgba(245,158,11,0.05),transparent)">';
        html += '<div style="display:flex;align-items:center;gap:var(--space-2);margin-bottom:var(--space-2)">';
        html += '<span style="font-size:1.25rem">🔄</span>';
        html += '<h4 style="font-weight:600;font-size:var(--text-sm)">Week ' + rw.week + ' Revision</h4>';
        html += '</div>';
        html += '<div style="font-size:0.75rem;color:var(--text-secondary);margin-bottom:var(--space-2)">' + rw.startDate + ' → ' + rw.endDate + '</div>';
        html += '<div style="font-size:0.75rem;color:var(--text-secondary);margin-bottom:var(--space-2)">' + rw.totalHours + ' total hours</div>';
        var sortedR = Object.keys(rw.subjectHours).sort(function(a,b) { return rw.subjectHours[b] - rw.subjectHours[a]; });
        html += '<div style="display:flex;flex-wrap:wrap;gap:var(--space-1)">';
        for (var rs = 0; rs < sortedR.length; rs++) {
          html += '<span class="badge" style="background:rgba(245,158,11,0.15);color:var(--accent-orange);font-size:0.7rem">' + sortedR[rs] + ' (' + rw.subjectHours[sortedR[rs]] + 'h)</span>';
        }
        html += '</div>';
        html += '</div>';
      }
      html += '</div>';
    }

    html += '<div class="section-header"><h3 class="section-title">📆 Monthly Overview</h3></div>';
    html += '<div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(280px,1fr));gap:var(--space-4);margin-bottom:var(--space-8)">';
    for (var mi = 0; mi < monthlyOverview.length; mi++) {
      var mo = monthlyOverview[mi];
      html += '<div class="glass-card" style="padding:var(--space-4)">';
      html += '<h4 style="font-weight:600;font-size:var(--text-sm);margin-bottom:var(--space-2)">' + mo.month + '</h4>';
      html += '<div style="font-size:0.75rem;color:var(--text-secondary);margin-bottom:var(--space-3)">' + mo.days + ' study days</div>';
      html += '<div style="font-size:0.75rem;color:var(--text-secondary);margin-bottom:var(--space-2)">Top focus areas:</div>';
      for (var ti = 0; ti < mo.topSubjects.length; ti++) {
        var tSubj = mo.topSubjects[ti];
        var tHours = mo.subjectHours[tSubj];
        var isWk = false;
        for (var wi4 = 0; wi4 < plan.weakSubjects.length; wi4++) {
          if (plan.weakSubjects[wi4].name === tSubj) { isWk = true; break; }
        }
        html += '<div style="display:flex;align-items:center;gap:var(--space-2);margin-bottom:var(--space-1)">';
        html += '<span>' + getSubjectIcon(tSubj) + '</span>';
        html += '<span style="font-size:0.8rem;' + (isWk ? 'color:var(--accent-orange);font-weight:600' : '') + '">' + tSubj + '</span>';
        html += '<span style="font-size:0.7rem;color:var(--text-secondary)">' + tHours + 'h</span>';
        html += '</div>';
      }
      html += '</div>';
    }
    html += '</div>';

    html += '<div class="section-header"><h3 class="section-title">📚 Recommended Resources</h3></div>';
    html += '<div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(280px,1fr));gap:var(--space-4);margin-bottom:var(--space-8)">';
    for (var ri = 0; ri < recommendations.length; ri++) {
      var rec = recommendations[ri];
      html += '<div class="glass-card" style="padding:var(--space-4)">';
      html += '<div style="display:flex;align-items:center;gap:var(--space-2);margin-bottom:var(--space-3)">';
      html += '<span style="font-size:1.25rem">' + getSubjectIcon(rec.subjectName) + '</span>';
      html += '<h4 style="font-weight:600;font-size:var(--text-sm)">' + rec.subjectName + '</h4>';
      html += '</div>';
      html += '<ul style="list-style:none;padding:0;margin:0">';
      for (var ri2 = 0; ri2 < rec.resources.length; ri2++) {
        html += '<li style="display:flex;align-items:center;gap:var(--space-2);padding:var(--space-1) 0;font-size:0.8rem;color:var(--text-secondary)">';
        html += '<span style="color:var(--accent-blue)">▸</span> ' + rec.resources[ri2];
        html += '</li>';
      }
      html += '</ul>';
      html += '</div>';
    }
    html += '</div>';

    html += '<div class="section-header"><h3 class="section-title">🎯 Progress Goals</h3></div>';
    html += '<div style="margin-bottom:var(--space-8)">';
    for (var gi = 0; gi < progressGoals.length; gi++) {
      var g = progressGoals[gi];
      var gIcon = g.type === 'revision' ? '🔄' : (g.type === 'exam' ? '🎯' : '📌');
      var gColor = g.type === 'revision' ? 'var(--accent-orange)' : (g.type === 'exam' ? 'var(--accent-green)' : 'var(--accent-blue)');
      html += '<div class="glass-card" style="padding:var(--space-3);margin-bottom:var(--space-2);border-left:3px solid ' + gColor + '">';
      html += '<div style="display:flex;align-items:center;justify-content:space-between">';
      html += '<div style="display:flex;align-items:center;gap:var(--space-2)">';
      html += '<span>' + gIcon + '</span>';
      html += '<div><div style="font-size:var(--text-sm);font-weight:500">' + g.milestone + '</div>';
      html += '<div style="font-size:0.75rem;color:var(--text-secondary)">Week ' + g.week + ' — Target: ' + g.date + '</div></div>';
      html += '</div>';
      var checkId = 'goal-' + gi;
      html += '<input type="checkbox" id="' + checkId + '" style="width:18px;height:18px;accent-color:' + gColor + '" onchange="var cb=this;var items=JSON.parse(localStorage.getItem(\'edumentee_goal_checks\')||\'{}\');items[\'' + checkId + '\']=cb.checked;localStorage.setItem(\'edumentee_goal_checks\',JSON.stringify(items))"';
      try { var savedChecks = JSON.parse(localStorage.getItem('edumentee_goal_checks') || '{}'); if (savedChecks[checkId]) html += ' checked'; } catch(e) {}
      html += '>';
      html += '</div>';
      html += '</div>';
    }
    html += '</div>';

    html += '<div class="glass-card" style="padding:var(--space-6);text-align:center;margin-bottom:var(--space-8)">';
    html += '<div style="font-size:2rem;margin-bottom:var(--space-2)">' + (daysLeft === 0 ? '🎉' : '⏰') + '</div>';
    html += '<h4 style="font-weight:600;margin-bottom:var(--space-2)">' + (daysLeft === 0 ? 'Exam Day!' : daysLeft + ' Days Until Exam') + '</h4>';
    html += '<p class="text-sm text-secondary">' + (daysLeft === 0 ? 'You\'ve got this! Trust your preparation.' : 'Stay consistent with your plan. Every hour counts!') + '</p>';
    html += '</div>';

    html += '</div>';
    mainContent.innerHTML = html;
  }

  window.renderPage.aiRoute.generateInteractive = function() {
    var hoursPerDay = parseInt(document.getElementById('ip-hours').value) || 4;
    if (hoursPerDay < 1) hoursPerDay = 1;
    if (hoursPerDay > 16) hoursPerDay = 16;
    var examDateStr = document.getElementById('ip-exam-date').value;
    var preference = document.getElementById('ip-preference').value;

    if (!examDateStr) {
      examDateStr = new Date(Date.now() + 30 * 86400000).toISOString().split('T')[0];
    }
    var examDt = new Date(examDateStr);
    var now = new Date();
    if (examDt <= now) {
      examDt = new Date(now.getTime() + 30 * 86400000);
      examDateStr = examDt.toISOString().split('T')[0];
    }
    var daysUntilExam = Math.ceil((examDt - now) / 86400000);
    if (daysUntilExam < 1) daysUntilExam = 1;

    var weakCheckboxes = document.querySelectorAll('#ip-weak-subjects input[type="checkbox"]:checked');
    var strongCheckboxes = document.querySelectorAll('#ip-strong-subjects input[type="checkbox"]:checked');

    var weakSubjs = [];
    var strongSubjs = [];
    var usedIds = {};

    for (var wi = 0; wi < weakCheckboxes.length; wi++) {
      var subId = weakCheckboxes[wi].value;
      if (usedIds[subId]) continue;
      usedIds[subId] = true;
      for (var si = 0; si < userSubjects.length; si++) {
        if (userSubjects[si].id === subId) { weakSubjs.push(userSubjects[si]); break; }
      }
    }

    for (var si2 = 0; si2 < strongCheckboxes.length; si2++) {
      var subId2 = strongCheckboxes[si2].value;
      if (usedIds[subId2]) continue;
      usedIds[subId2] = true;
      for (var si3 = 0; si3 < userSubjects.length; si3++) {
        if (userSubjects[si3].id === subId2) { strongSubjs.push(userSubjects[si3]); break; }
      }
    }

    if (weakSubjs.length === 0 && strongSubjs.length === 0) {
      if (userSubjects.length > 0) {
        var half = Math.ceil(userSubjects.length / 2);
        for (var i = 0; i < Math.min(half, userSubjects.length); i++) weakSubjs.push(userSubjects[i]);
        for (var j = half; j < userSubjects.length; j++) strongSubjs.push(userSubjects[j]);
      }
    }

    var allSubjects = weakSubjs.concat(strongSubjs);
    if (allSubjects.length === 0) {
      alert('Please select at least one subject.');
      return;
    }

    var plan = {
      hoursPerDay: hoursPerDay,
      examDate: examDateStr,
      preference: preference,
      daysUntilExam: daysUntilExam,
      generatedAt: new Date().toISOString(),
      weakSubjects: weakSubjs,
      strongSubjects: strongSubjs,
      dailySchedule: []
    };

    plan.dailySchedule = generateSubjectSchedule(plan);

    store.set('aiStudyPlan', plan);

    renderInteractivePlan(plan);
  };

  window.renderPage.aiRoute.regenerateInteractive = function() {
    store.set('aiStudyPlan', null);
    interactivePlan = null;
    renderNoPlan();
  };

  window.renderPage.aiRoute.checkIPSubject = function() {
    var id = this ? (this.value || '') : '';
    var weakEl = document.getElementById('ip-weak-subjects');
    var strongEl = document.getElementById('ip-strong-subjects');
    if (weakEl && strongEl) {
      var allWeak = weakEl.querySelectorAll('input[type="checkbox"]:checked');
      var allStrong = strongEl.querySelectorAll('input[type="checkbox"]:checked');
    }
  };

  function renderNoPlan() {
    var html = '<div class="page-container">';

    html += '<div class="glass-card" style="padding:var(--space-8);max-width:720px;margin:2rem auto;text-align:center">';
    html += '<div style="font-size:4rem;margin-bottom:var(--space-4)">🤖</div>';
    html += '<h2 style="font-size:var(--text-2xl);font-weight:700;margin-bottom:var(--space-2)">Your AI-Powered Study Plan</h2>';
    html += '<p style="color:var(--text-secondary);margin-bottom:var(--space-6)">Create a personalized study plan tailored to your needs. Our AI analyzes your strengths, weaknesses, and goals to build the perfect schedule.</p>';
    html += '</div>';

    html += '<div class="glass-card" style="padding:var(--space-8);max-width:720px;margin:2rem auto">';
    html += '<div style="display:flex;align-items:center;gap:var(--space-3);margin-bottom:var(--space-6)">';
    html += '<span style="font-size:1.75rem">📋</span>';
    html += '<h3 style="font-size:var(--text-xl);font-weight:600">Interactive Study Planner</h3>';
    html += '</div>';

    html += '<div class="input-group" style="margin-bottom:var(--space-5)">';
    html += '<label class="input-label">Available Study Hours Per Day</label>';
    html += '<input type="number" id="ip-hours" min="1" max="16" value="4" class="input-field" style="background:var(--bg-glass);border:1px solid var(--border-color);border-radius:var(--radius-md);padding:var(--space-3);width:100%;color:var(--text-primary)">';
    html += '<div class="text-xs text-secondary" style="margin-top:var(--space-1)">Choose between 1-16 hours per day</div>';
    html += '</div>';

    html += '<div class="input-group" style="margin-bottom:var(--space-5)">';
    html += '<label class="input-label">Exam / Goal Date</label>';
    html += '<input type="date" id="ip-exam-date" class="input-field" style="background:var(--bg-glass);border:1px solid var(--border-color);border-radius:var(--radius-md);padding:var(--space-3);width:100%;color:var(--text-primary)" value="' + new Date(Date.now() + 30 * 86400000).toISOString().split('T')[0] + '">';
    html += '</div>';

    html += '<div class="input-group" style="margin-bottom:var(--space-5)">';
    html += '<label class="input-label">Weak Subjects (need more focus)</label>';
    html += '<div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(140px,1fr));gap:var(--space-2)" id="ip-weak-subjects">';
    for (var i = 0; i < userSubjects.length; i++) {
      html += '<label style="display:flex;align-items:center;gap:var(--space-2);padding:var(--space-2);border-radius:var(--radius-md);background:var(--bg-glass);cursor:pointer;font-size:var(--text-sm)">';
      html += '<input type="checkbox" value="' + userSubjects[i].id + '" style="accent-color:var(--accent-orange);width:16px;height:16px">';
      html += '<span>' + userSubjects[i].icon + ' ' + userSubjects[i].name + '</span>';
      html += '</label>';
    }
    html += '</div>';
    html += '</div>';

    html += '<div class="input-group" style="margin-bottom:var(--space-5)">';
    html += '<label class="input-label">Strong Subjects (already confident)</label>';
    html += '<div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(140px,1fr));gap:var(--space-2)" id="ip-strong-subjects">';
    for (var i = 0; i < userSubjects.length; i++) {
      html += '<label style="display:flex;align-items:center;gap:var(--space-2);padding:var(--space-2);border-radius:var(--radius-md);background:var(--bg-glass);cursor:pointer;font-size:var(--text-sm)">';
      html += '<input type="checkbox" value="' + userSubjects[i].id + '" style="accent-color:var(--accent-green);width:16px;height:16px">';
      html += '<span>' + userSubjects[i].icon + ' ' + userSubjects[i].name + '</span>';
      html += '</label>';
    }
    html += '</div>';
    html += '</div>';

    html += '<div class="input-group" style="margin-bottom:var(--space-6)">';
    html += '<label class="input-label">Study Preference</label>';
    html += '<select id="ip-preference" class="input-field" style="background:var(--bg-glass);border:1px solid var(--border-color);border-radius:var(--radius-md);padding:var(--space-3);width:100%;color:var(--text-primary)">';
    html += '<option value="Morning">🌅 Morning</option>';
    html += '<option value="Afternoon">☀️ Afternoon</option>';
    html += '<option value="Evening">🌆 Evening</option>';
    html += '<option value="Night">🌙 Night</option>';
    html += '<option value="Flexible" selected>🔄 Flexible</option>';
    html += '</select>';
    html += '</div>';

    html += '<button class="btn btn-primary btn-lg btn-block" data-action="airoute:generateInteractive">🚀 Generate Interactive Plan</button>';
    html += '</div>';

    html += '<div class="glass-card" style="padding:var(--space-8);max-width:640px;margin:2rem auto">';
    html += '<h3 style="font-size:var(--text-xl);font-weight:600;margin-bottom:var(--space-6)">Create Your Study Plan</h3>';

    html += '<div class="input-group" style="margin-bottom:var(--space-5)">';
    html += '<label class="input-label">Hours Available Per Day</label>';
    html += '<input type="range" id="ai-hours" min="1" max="12" value="4" class="input-field" style="padding:0" oninput="document.getElementById(\'ai-hours-val\').textContent=this.value+\'h\'">';
    html += '<div class="flex items-center justify-between text-sm text-secondary"><span>1h</span><span id="ai-hours-val">4h</span><span>12h</span></div>';
    html += '</div>';

    html += '<div class="input-group" style="margin-bottom:var(--space-5)">';
    html += '<label class="input-label">Weak Subjects (select subjects you need to focus on)</label>';
    html += '<div class="flex flex-wrap gap-2" id="ai-weak-subjects">';
    for (var i = 0; i < userSubjects.length; i++) {
      html += '<div class="tab" style="border-bottom:none;border-radius:var(--radius-full);padding:0.375rem 1rem;cursor:pointer" data-action="airoute:toggleWeak" data-subject-id="' + userSubjects[i].id + '">' + userSubjects[i].name + '</div>';
    }
    html += '</div>';
    html += '<input type="hidden" id="ai-weak-data" value="">';
    html += '</div>';

    html += '<div class="input-group" style="margin-bottom:var(--space-5)">';
    html += '<label class="input-label">Upcoming Exams (target date)</label>';
    html += '<input type="date" id="ai-exam-date" class="input-field" value="' + new Date(Date.now() + 30 * 86400000).toISOString().split('T')[0] + '">';
    html += '</div>';

    html += '<div class="input-group" style="margin-bottom:var(--space-5)">';
    html += '<label class="input-label">Current Confidence Level (1-10)</label>';
    html += '<input type="range" id="ai-confidence" min="1" max="10" value="5" class="input-field" style="padding:0" oninput="document.getElementById(\'ai-conf-val\').textContent=this.value">';
    html += '<div class="flex items-center justify-between text-sm text-secondary"><span>1 (Low)</span><span id="ai-conf-val">5</span><span>10 (High)</span></div>';
    html += '</div>';

    html += '<button class="btn btn-primary btn-lg btn-block" data-action="airoute:generate">🤖 Generate My Study Plan</button>';
    html += '</div>';
    html += '</div>';

    mainContent.innerHTML = html;
  }

  var weakSubjects = [];

  window.renderPage.aiRoute.toggleWeak = function(el, subjectId) {
    var idx = weakSubjects.indexOf(subjectId);
    if (idx === -1) {
      weakSubjects.push(subjectId);
      el.classList.add('active');
    } else {
      weakSubjects.splice(idx, 1);
      el.classList.remove('active');
    }
    document.getElementById('ai-weak-data').value = weakSubjects.join(',');
  };

  window.renderPage.aiRoute.generate = function() {
    if (generating) return;
    generating = true;
    var hoursPerDay = parseInt(document.getElementById('ai-hours').value) || 4;
    var confidence = parseInt(document.getElementById('ai-confidence').value) || 5;
    var examDate = document.getElementById('ai-exam-date').value;

    var weakSubjNames = [];
    for (var i = 0; i < weakSubjects.length; i++) {
      weakSubjNames.push(getSubjectName(weakSubjects[i]));
    }
    if (weakSubjNames.length === 0) {
      for (var j = 0; j < Math.min(userSubjects.length, 3); j++) {
        weakSubjNames.push(userSubjects[j].name);
      }
    }

    var html = '<div class="page-container"><div class="flex flex-col items-center justify-center" style="padding:4rem">';
    html += '<div class="animate-spin" style="width:48px;height:48px;border:3px solid var(--border-color);border-top-color:var(--accent-blue);border-radius:50%;margin-bottom:1.5rem"></div>';
    html += '<h3 style="font-size:var(--text-lg);font-weight:600;margin-bottom:var(--space-2)">🤖 Generating Your Study Plan</h3>';
    html += '<p class="text-sm text-secondary">Our AI is analyzing your requirements...</p>';
    html += '<div class="progress-bar" style="max-width:320px;width:100%;margin-top:var(--space-4);height:6px"><div class="progress-bar-fill" id="ai-progress-fill" style="width:0%;transition:width 0.3s"></div></div>';
    html += '</div></div>';
    mainContent.innerHTML = html;

    var progress = 0;
    var progressInterval = setInterval(function() {
      progress += Math.random() * 15 + 5;
      if (progress > 95) progress = 95;
      var fill = document.getElementById('ai-progress-fill');
      if (fill) fill.style.width = progress + '%';
    }, 300);

    api.generateStudyPlan({
      hoursPerDay: hoursPerDay,
      subjects: weakSubjNames,
      duration: 30,
      target: 'Exam Preparation',
      examDate: examDate,
      confidence: confidence
    }).then(function(res) {
      clearInterval(progressInterval);
      generating = false;
      if (res.success) {
        studyPlan = res.data;
        renderPlan();
      }
    });
  };

  function renderPlan() {
    if (!studyPlan) { renderNoPlan(); return; }

    var schedule = studyPlan.schedule || [];
    var tips = studyPlan.tips || [];
    var now = new Date();
    var dayOfWeek = now.getDay();
    var weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    var totalSessions = 0;
    var completedSessions = 0;

    for (var d = 0; d < schedule.length; d++) {
      var daySessions = schedule[d].sessions || [];
      for (var s = 0; s < daySessions.length; s++) {
        totalSessions++;
        if (daySessions[s].completed) completedSessions++;
      }
    }
    var progressPct = totalSessions > 0 ? Math.round((completedSessions / totalSessions) * 100) : 0;

    var html = '<div class="page-container">';
    html += '<div class="page-header">';
    html += '<div><h1 class="page-title">🤖 AI Study Route</h1><p class="page-subtitle">Your personalized AI-powered study plan</p></div>';
    html += '<div class="flex items-center gap-3"><button class="btn btn-secondary" data-action="airoute:regenerate">🔄 Regenerate Plan</button></div>';
    html += '</div>';

    html += '<div class="stats-grid">';
    html += '<div class="stat-card"><div class="stat-value">' + studyPlan.hoursPerDay + 'h</div><div class="stat-label">Hours / Day</div></div>';
    html += '<div class="stat-card"><div class="stat-value">' + studyPlan.duration + ' days</div><div class="stat-label">Plan Duration</div></div>';
    html += '<div class="stat-card"><div class="stat-value">' + progressPct + '%</div><div class="stat-label">Overall Progress</div></div>';
    html += '<div class="stat-card"><div class="stat-value">' + (studyPlan.subjects || []).length + '</div><div class="stat-label">Subjects</div></div>';
    html += '</div>';

    html += '<div class="progress-bar" style="height:12px;margin-bottom:var(--space-8);border-radius:var(--radius-full)"><div class="progress-bar-fill" style="width:' + progressPct + '%"></div></div>';

    html += '<div class="section-header"><h3 class="section-title">📅 Daily Study Plan</h3></div>';
    html += '<div class="timeline" style="margin-bottom:var(--space-8)">';
    if (schedule.length === 0) {
      html += '<div class="text-sm text-secondary">No schedule data available.</div>';
    } else {
      for (var d = 0; d < Math.min(schedule.length, 7); d++) {
        var day = schedule[d];
        html += '<div class="timeline-item">';
        html += '<div class="timeline-dot' + (d === 0 ? ' current' : '') + '"></div>';
        html += '<div class="timeline-content">';
        html += '<div class="flex items-center justify-between" style="margin-bottom:var(--space-2)">';
        html += '<h4 style="font-weight:600;font-size:var(--text-sm)">Day ' + day.day + ' (' + weekDays[(dayOfWeek + d) % 7] + ')</h4>';
        html += '<span class="badge badge-blue">' + (day.sessions || []).length + ' sessions</span>';
        html += '</div>';
        var sessions = day.sessions || [];
        for (var s = 0; s < sessions.length; s++) {
          var sess = sessions[s];
          html += '<div class="flex items-center justify-between" style="padding:var(--space-2);border-radius:var(--radius-sm);background:var(--bg-glass);margin-bottom:var(--space-2)">';
          html += '<div class="flex items-center gap-3">';
          html += '<span style="font-size:var(--text-lg)">' + (sess.completed ? '✅' : '📖') + '</span>';
          html += '<div><div style="font-size:var(--text-sm);font-weight:500">' + utils.sanitizeHTML(sess.subject || 'Study') + '</div><div class="text-xs text-secondary">' + utils.sanitizeHTML(sess.topic || '') + '</div></div>';
          html += '</div>';
          html += '<div class="flex items-center gap-2">';
          html += '<span class="text-xs text-secondary">' + (sess.duration || 30) + ' min</span>';
          html += '<button class="btn btn-sm btn-ghost" data-action="airoute:toggleComplete" data-day-idx="' + d + '" data-session-idx="' + s + '">' + (sess.completed ? 'Undo' : 'Done') + '</button>';
          html += '</div>';
          html += '</div>';
        }
        html += '</div>';
        html += '</div>';
      }
    }
    html += '</div>';

    html += '<div class="section-header"><h3 class="section-title">📊 Weekly Plan</h3></div>';
    html += '<div style="display:grid;grid-template-columns:repeat(7,1fr);gap:var(--space-2);margin-bottom:var(--space-8)">';
    for (var wd = 0; wd < 7; wd++) {
      var dayIdx = wd;
      var dayData = schedule[dayIdx];
      var dayTotal = dayData ? (dayData.sessions || []).length : 0;
      var dayDone = 0;
      if (dayData) {
        for (var ss = 0; ss < (dayData.sessions || []).length; ss++) {
          if (dayData.sessions[ss].completed) dayDone++;
        }
      }
      html += '<div class="glass-card" style="padding:var(--space-3);text-align:center;cursor:pointer">';
      html += '<div class="text-xs text-secondary" style="margin-bottom:var(--space-2)">' + weekDays[(dayOfWeek + wd) % 7] + '</div>';
      html += '<div style="font-size:var(--text-lg);font-weight:700">' + dayDone + '/' + dayTotal + '</div>';
      html += '<div class="text-xs text-secondary">sessions</div>';
      html += '</div>';
    }
    html += '</div>';

    html += '<div class="section-header"><h3 class="section-title">📚 Subjects Covered</h3></div>';
    html += '<div class="flex flex-wrap gap-2" style="margin-bottom:var(--space-8)">';
    var planSubjects = studyPlan.subjects || [];
    for (var ps = 0; ps < planSubjects.length; ps++) {
      html += '<span class="badge badge-blue">' + planSubjects[ps] + '</span>';
    }
    html += '</div>';

    html += '<div class="section-header"><h3 class="section-title">💡 Study Tips</h3></div>';
    html += '<div class="grid-cols-auto-sm" style="display:grid;gap:var(--space-4);margin-bottom:var(--space-8)">';
    for (var ti = 0; ti < tips.length; ti++) {
      html += '<div class="glass-card" style="padding:var(--space-4)"><div class="flex items-start gap-3"><span style="font-size:1.25rem">💡</span><div><div style="font-size:var(--text-sm);color:var(--text-secondary)">' + tips[ti] + '</div></div></div></div>';
    }
    html += '</div>';

    html += '<div class="section-header"><h3 class="section-title">🎯 Exam Prep Countdown</h3></div>';
    html += '<div class="glass-card" style="padding:var(--space-6);text-align:center;margin-bottom:var(--space-8)">';
    html += '<div style="font-size:3rem;margin-bottom:var(--space-3)">⏰</div>';
    html += '<h4 style="font-size:var(--text-lg);font-weight:600;margin-bottom:var(--space-2)">' + studyPlan.duration + ' Days Plan</h4>';
    html += '<p class="text-sm text-secondary">Stay consistent and follow your daily schedule. Review weak subjects regularly.</p>';
    html += '</div>';

    html += '<div class="glass-card" style="padding:var(--space-6);text-align:center;margin-bottom:var(--space-8)">';
    html += '<h4 style="font-size:var(--text-lg);font-weight:600;margin-bottom:var(--space-3)">Stay Motivated</h4>';
    html += '<div style="font-style:italic;color:var(--text-secondary);margin-bottom:var(--space-4)">"The secret of getting ahead is getting started. The secret of getting started is breaking your complex overwhelming tasks into small manageable tasks, and then starting on the first one."</div>';
    html += '<p class="text-sm text-secondary">- Mark Twain</p>';
    html += '</div>';

    html += '</div>';
    mainContent.innerHTML = html;
  }

  var toggleCompleteData = { day: null, session: null };

  window.renderPage.aiRoute.toggleComplete = function(dayIdx, sessionIdx) {
    if (studyPlan && studyPlan.schedule && studyPlan.schedule[dayIdx] && studyPlan.schedule[dayIdx].sessions[sessionIdx]) {
      studyPlan.schedule[dayIdx].sessions[sessionIdx].completed = !studyPlan.schedule[dayIdx].sessions[sessionIdx].completed;
      store.set('studyPlan', studyPlan);
      renderPlan();
    }
  };

  window.renderPage.aiRoute.regenerate = function() {
    store.set('studyPlan', null);
    studyPlan = null;
    renderNoPlan();
  };

  if (interactivePlan) {
    renderInteractivePlan(interactivePlan);
  } else if (studyPlan) {
    renderPlan();
  } else {
    renderNoPlan();
  }
};
