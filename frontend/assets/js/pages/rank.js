window.renderPage = window.renderPage || {};

window.renderPage.rank = function(params) {
  var mainContent = document.getElementById('main-content');
  if (!mainContent) return;
  var store = window.Store;
  var utils = window.Utils;
  var md = window.mockData;

  var user = store.get('user') || {};
  var xp = user.xp || 2850;
  var coins = user.coins || 1240;
  var level = utils.calculateLevel(xp);
  var userClass = user.class || 6;
  var userName = user.name || 'Student';
  var userStream = user.stream || '';

  var leaderboard = [
    { rank: 1, name: 'Aarav Patel', xp: 4200, coins: 2100, level: 7, avatar: 'AP' },
    { rank: 2, name: 'Priya Sharma', xp: 3850, coins: 1890, level: 6, avatar: 'PS' },
    { rank: 3, name: 'Rohan Gupta', xp: 3620, coins: 1750, level: 6, avatar: 'RG' },
    { rank: 4, name: 'Ananya Singh', xp: 3400, coins: 1620, level: 6, avatar: 'AS' },
    { rank: 5, name: 'Vikram Reddy', xp: 3180, coins: 1500, level: 5, avatar: 'VR' },
    { rank: 6, name: userName, xp: xp, coins: coins, level: level, avatar: utils.getInitials(userName), isUser: true },
    { rank: 7, name: 'Neha Kumari', xp: 2700, coins: 1100, level: 5, avatar: 'NK' },
    { rank: 8, name: 'Karan Mehta', xp: 2550, coins: 980, level: 5, avatar: 'KM' },
    { rank: 9, name: 'Sneha Verma', xp: 2400, coins: 920, level: 4, avatar: 'SV' },
    { rank: 10, name: 'Arjun Nair', xp: 2250, coins: 870, level: 4, avatar: 'AN' },
    { rank: 11, name: 'Divya Joshi', xp: 2100, coins: 810, level: 4, avatar: 'DJ' },
    { rank: 12, name: 'Rahul Das', xp: 1950, coins: 750, level: 4, avatar: 'RD' },
    { rank: 13, name: 'Isha Banerjee', xp: 1800, coins: 690, level: 4, avatar: 'IB' },
    { rank: 14, name: 'Aditya Rao', xp: 1650, coins: 620, level: 3, avatar: 'AR' },
    { rank: 15, name: 'Meera Iyer', xp: 1500, coins: 560, level: 3, avatar: 'MI' },
    { rank: 16, name: 'Sanjay Pillai', xp: 1350, coins: 500, level: 3, avatar: 'SP' },
    { rank: 17, name: 'Pooja Menon', xp: 1200, coins: 440, level: 3, avatar: 'PM' },
    { rank: 18, name: 'Ravi Shankar', xp: 1050, coins: 380, level: 3, avatar: 'RS' },
    { rank: 19, name: 'Deepa Krishnan', xp: 900, coins: 320, level: 2, avatar: 'DK' },
    { rank: 20, name: 'Suresh Rajan', xp: 750, coins: 260, level: 2, avatar: 'SR' },
    { rank: 21, name: 'Lakshmi Devi', xp: 600, coins: 200, level: 2, avatar: 'LD' },
    { rank: 22, name: 'Ganesh Patil', xp: 450, coins: 150, level: 2, avatar: 'GP' },
    { rank: 23, name: 'Kavita Bose', xp: 300, coins: 100, level: 1, avatar: 'KB' },
    { rank: 24, name: 'Manish Tiwari', xp: 200, coins: 60, level: 1, avatar: 'MT' },
    { rank: 25, name: 'Sunita Agarwal', xp: 100, coins: 30, level: 1, avatar: 'SA' }
  ];

  leaderboard.sort(function(a, b) { return b.xp - a.xp; });
  for (var li = 0; li < leaderboard.length; li++) { leaderboard[li].rank = li + 1; }

  var userRank = 6;
  var classRank = 3;
  var schoolRank = 12;
  var weeklyRank = 5;
  var monthlyRank = 4;

  var quizRankings = [
    { subject: 'Mathematics', rank: 2, totalStudents: 45, score: 92 },
    { subject: 'Science', rank: 5, totalStudents: 42, score: 85 },
    { subject: 'English', rank: 8, totalStudents: 40, score: 78 },
    { subject: 'Social Studies', rank: 3, totalStudents: 38, score: 88 },
    { subject: 'Hindi', rank: 6, totalStudents: 44, score: 82 }
  ];

  var examRankings = [
    { subject: 'Mathematics', rank: 1, totalStudents: 45, score: 95 },
    { subject: 'Science', rank: 4, totalStudents: 42, score: 88 },
    { subject: 'English', rank: 7, totalStudents: 40, score: 80 },
    { subject: 'Social Studies', rank: 2, totalStudents: 38, score: 91 },
    { subject: 'Hindi', rank: 5, totalStudents: 44, score: 85 }
  ];

  var xpLevels = [
    { level: 1, xpNeeded: 100, label: 'Beginner' },
    { level: 2, xpNeeded: 400, label: 'Explorer' },
    { level: 3, xpNeeded: 900, label: 'Learner' },
    { level: 4, xpNeeded: 1600, label: 'Scholar' },
    { level: 5, xpNeeded: 2500, label: 'Achiever' },
    { level: 6, xpNeeded: 3600, label: 'Expert' },
    { level: 7, xpNeeded: 4900, label: 'Master' },
    { level: 8, xpNeeded: 6400, label: 'Champion' }
  ];

  function getMaxXp() { return 4900; }

  function renderBarChart() {
    var maxXP = getMaxXp();
    var html = '<div class="glass-card p-5">';
    html += '<h3 class="c-fw-semibold c-mb-4">XP Ranking Progress</h3>';
    html += '<div style="display:flex;align-items:flex-end;gap:8px;height:200px;padding:var(--space-4) 0">';
    for (var bi = 0; bi < xpLevels.length; bi++) {
      var lvl = xpLevels[bi];
      var heightPct = Math.min(100, Math.round((lvl.xpNeeded / maxXP) * 100));
      var isCurrent = lvl.level === level;
      var barColor = isCurrent ? 'var(--accent-blue)' : lvl.level < level ? 'var(--accent-green)' : 'var(--bg-glass)';
      var textColor = isCurrent ? 'var(--accent-blue)' : 'var(--text-secondary)';
      html += '<div style="flex:1;display:flex;flex-direction:column;align-items:center;gap:4px">';
      html += '<div class="c-fs-xs c-fw-medium" style="color:' + textColor + '">' + lvl.xpNeeded + '</div>';
      html += '<div style="width:100%;height:' + heightPct + '%;background:' + barColor + ';border-radius:4px 4px 0 0;min-height:8px;transition:height 0.3s"></div>';
      html += '<div class="c-fs-xs c-text-tertiary" style="text-align:center">Lv ' + lvl.level + '</div>';
      html += '</div>';
    }
    html += '</div>';
    html += '<div class="c-fs-xs c-text-secondary c-mt-2">Your current XP: <span class="c-fw-bold" style="color:var(--accent-blue)">' + utils.formatNumber(xp) + '</span></div>';
    html += '</div>';
    return html;
  }

  function renderRankTable(title, data, icon) {
    var html = '<div class="glass-card p-5">';
    html += '<h3 class="c-fw-semibold c-mb-4">' + icon + ' ' + title + '</h3>';
    html += '<div style="overflow-x:auto">';
    html += '<table style="width:100%;border-collapse:collapse">';
    html += '<thead><tr style="border-bottom:2px solid var(--border-color)">';
    html += '<th style="padding:8px 12px;text-align:left;font-size:0.75rem;color:var(--text-secondary);font-weight:600">Subject</th>';
    html += '<th style="padding:8px 12px;text-align:center;font-size:0.75rem;color:var(--text-secondary);font-weight:600">Rank</th>';
    html += '<th style="padding:8px 12px;text-align:center;font-size:0.75rem;color:var(--text-secondary);font-weight:600">Score</th>';
    html += '<th style="padding:8px 12px;text-align:center;font-size:0.75rem;color:var(--text-secondary);font-weight:600">Total</th>';
    html += '</tr></thead><tbody>';
    for (var ri = 0; ri < data.length; ri++) {
      var r = data[ri];
      var rankBadge = r.rank <= 3 ? (r.rank === 1 ? 'badge-yellow' : r.rank === 2 ? 'badge-blue' : 'badge-green') : 'badge-gray';
      html += '<tr style="border-bottom:1px solid var(--border-light)">';
      html += '<td style="padding:8px 12px;font-size:0.85rem;font-weight:500">' + r.subject + '</td>';
      html += '<td style="padding:8px 12px;text-align:center"><span class="badge ' + rankBadge + '" style="font-size:0.75rem">#' + r.rank + '</span></td>';
      html += '<td style="padding:8px 12px;text-align:center;font-size:0.85rem;font-weight:600;color:var(--accent-blue)">' + r.score + '%</td>';
      html += '<td style="padding:8px 12px;text-align:center;font-size:0.8rem;color:var(--text-secondary)">' + r.rank + '/' + r.totalStudents + '</td>';
      html += '</tr>';
    }
    html += '</tbody></table></div></div>';
    return html;
  }

  function renderLeaderboard() {
    var html = '<div class="glass-card p-5">';
    html += '<h3 class="c-fw-semibold c-mb-4">Top 25 Leaderboard</h3>';
    html += '<div style="display:flex;flex-direction:column;gap:8px">';
    for (var lbi = 0; lbi < leaderboard.length; lbi++) {
      var lb = leaderboard[lbi];
      var rankBg = lb.rank === 1 ? 'rgba(255,215,0,0.15)' : lb.rank === 2 ? 'rgba(192,192,192,0.15)' : lb.rank === 3 ? 'rgba(205,127,50,0.15)' : 'transparent';
      var rankColor = lb.rank === 1 ? '#FFD700' : lb.rank === 2 ? '#C0C0C0' : lb.rank === 3 ? '#CD7F32' : 'var(--text-secondary)';
      var rowBg = lb.isUser ? 'rgba(59,130,246,0.1)' : rankBg;
      var rowBorder = lb.isUser ? '2px solid var(--accent-blue)' : '1px solid var(--border-light)';
      html += '<div style="display:flex;align-items:center;gap:12px;padding:10px 14px;background:' + rowBg + ';border:' + rowBorder + ';border-radius:var(--radius-md)">';
      html += '<div class="c-fw-bold c-fs-sm" style="width:28px;text-align:center;color:' + rankColor + '">#' + lb.rank + '</div>';
      html += '<div class="c-radius-full c-flex-center c-fw-bold c-fs-xs" style="width:36px;height:36px;background:var(--gradient-primary);color:white;flex-shrink:0">' + lb.avatar + '</div>';
      html += '<div style="flex:1;min-width:0">';
      html += '<div class="c-fs-sm c-fw-semibold" style="' + (lb.isUser ? 'color:var(--accent-blue)' : '') + '">' + (lb.isUser ? userName + ' (You)' : lb.name) + '</div>';
      html += '<div class="c-fs-xs c-text-tertiary">Level ' + lb.level + ' \u00B7 ' + utils.formatNumber(lb.xp) + ' XP</div>';
      html += '</div>';
      html += '<div style="text-align:right">';
      html += '<div class="c-fs-sm c-fw-semibold" style="color:var(--accent-yellow)">' + utils.formatNumber(lb.coins) + ' coins</div>';
      html += '</div>';
      html += '</div>';
    }
    html += '</div></div>';
    return html;
  }

  var gradients = [
    'linear-gradient(135deg,#FFD700,#FFA500)',
    'linear-gradient(135deg,#C0C0C0,#808080)',
    'linear-gradient(135deg,#CD7F32,#8B4513)'
  ];

  var html = '<div class="animate-fadeInUp">';
  html += '<div class="page-header mb-6"><div><h1 class="page-title">Rank & Leaderboard</h1><p class="page-subtitle">Your ranking across class, school, and more</p></div>';
  html += '<button class="btn btn-ghost" data-action="rank:back">Back to Profile</button></div>';

  html += '<div class="grid grid-cols-4 gap-4 c-mb-6">';
  html += '<div class="glass-card p-5" style="text-align:center;border-left:4px solid var(--accent-blue)"><div class="c-fs-xs c-text-secondary c-mb-1">Overall Rank</div><div class="c-fs-2xl c-fw-bold" style="color:var(--accent-blue)">#' + userRank + '</div><div class="c-fs-xs c-text-tertiary">of 45 students</div></div>';
  html += '<div class="glass-card p-5" style="text-align:center;border-left:4px solid var(--accent-green)"><div class="c-fs-xs c-text-secondary c-mb-1">Class Rank</div><div class="c-fs-2xl c-fw-bold" style="color:var(--accent-green)">#' + classRank + '</div><div class="c-fs-xs c-text-tertiary">Class ' + userClass + '</div></div>';
  html += '<div class="glass-card p-5" style="text-align:center;border-left:4px solid var(--accent-purple)"><div class="c-fs-xs c-text-secondary c-mb-1">School Rank</div><div class="c-fs-2xl c-fw-bold" style="color:var(--accent-purple)">#' + schoolRank + '</div><div class="c-fs-xs c-text-tertiary">of 520 students</div></div>';
  html += '<div class="glass-card p-5" style="text-align:center;border-left:4px solid var(--accent-yellow)"><div class="c-fs-xs c-text-secondary c-mb-1">Coins</div><div class="c-fs-2xl c-fw-bold" style="color:var(--accent-yellow)">' + utils.formatNumber(coins) + '</div><div class="c-fs-xs c-text-tertiary">Total earned</div></div>';
  html += '</div>';

  html += '<div class="grid grid-cols-2 gap-4 c-mb-6">';
  html += '<div class="glass-card p-5" style="text-align:center"><div class="c-fs-xs c-text-secondary c-mb-1">Weekly Rank</div><div class="c-fs-xl c-fw-bold" style="color:var(--accent-blue)">#' + weeklyRank + '</div><div class="c-fs-xs c-text-tertiary">This week</div></div>';
  html += '<div class="glass-card p-5" style="text-align:center"><div class="c-fs-xs c-text-secondary c-mb-1">Monthly Rank</div><div class="c-fs-xl c-fw-bold" style="color:var(--accent-purple)">#' + monthlyRank + '</div><div class="c-fs-xs c-text-tertiary">This month</div></div>';
  html += '</div>';

  html += renderBarChart();

  html += '<div class="grid grid-cols-2 gap-4 c-mt-6">';
  html += renderRankTable('Quiz Rankings', quizRankings, '\uD83D\uDCDD');
  html += renderRankTable('Exam Rankings', examRankings, '\uD83D\uDCCA');
  html += '</div>';

  html += '<div class="c-mt-6">';
  html += renderLeaderboard();
  html += '</div>';

  html += '</div>';

  mainContent.innerHTML = html;

  document.addEventListener('click', function(e) {
    var t = e.target.closest('[data-action^="rank:"]');
    if (!t) return;
    var p = t.getAttribute('data-action').split(':');
    var a = p[1];
    if (a === 'back') { window.location.hash = '#/profile'; }
  });
};
