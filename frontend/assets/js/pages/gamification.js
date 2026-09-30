window.renderPage = window.renderPage || {};

var _U = window.Utils;
var _MD = window.mockData;
var _Store = window.Store;

if (!window._gamDelegateAdded) {
  window._gamDelegateAdded = true;
  document.addEventListener('click', function(e) {
    var t = e.target.closest('[data-action^="gam:"]');
    if (!t) return;
    var a = t.getAttribute('data-action');
    var p = a.split(':');
    var c = p[1], arg = p.slice(2).join(':');
    if (c === 'tab' && arg) { switchTab(arg); }
    if (c === 'claim' && arg) { claimReward(arg); }
    if (c === 'buy' && arg) { buyItem(arg); }
    if (c === 'challenge' && arg) { startChallenge(arg); }
    if (c === 'share') { shareProgress(); }
    if (c === 'filterLeaderboard' && arg) { filterLeaderboard(arg); }
    if (c === 'goto') { if (arg) window.Router.navigate(arg); }
    if (c === 'startChallenge' && arg) { startChallenge(arg); }
    if (c === 'challengeFilter' && arg) { window.switchChallengeFilter(arg); }
    if (c === 'dismiss') { t.parentElement.remove(); }
  });
}

function getLevelTitle(level) {
  if (level >= 20) return 'Diamond Master';
  if (level >= 15) return 'Platinum Pro';
  if (level >= 10) return 'Gold Achiever';
  if (level >= 5) return 'Silver Learner';
  return 'Bronze Scholar';
}

function getLevelIcon(level) {
  if (level >= 20) return '\uD83D\uDC8E';
  if (level >= 15) return '\uD83C\uDFC6';
  if (level >= 10) return '\uD83E\uDD47';
  if (level >= 5) return '\uD83E\uDD48';
  return '\uD83E\uDD49';
}

function xpForLevel(level) {
  return level * level * 100;
}

function xpInLevel(xp, level) {
  var base = (level - 1) * (level - 1) * 100;
  return Math.max(0, xp - base);
}

function xpToNext(level) {
  return (2 * level - 1) * 100;
}

var GAM_BADGES = [
  { id:'bg1', category:'Learning', name:'Fast Learner', icon:'\u26A1', desc:'Complete 5 lessons in one day', unlocked:false },
  { id:'bg2', category:'Learning', name:'Quiz Master', icon:'\uD83C\uDFC6', desc:'Score 100% on any quiz', unlocked:false },
  { id:'bg3', category:'Learning', name:'Math Wizard', icon:'\uD83E\uDDE0', desc:'Complete all Math chapters for a class', unlocked:false },
  { id:'bg4', category:'Learning', name:'Science Explorer', icon:'\uD83D\uDD2D', desc:'Complete all Science chapters', unlocked:false },
  { id:'bg5', category:'Learning', name:'Grammar Guru', icon:'\uD83D\uDCDD', desc:'Score 90%+ on 5 English quizzes', unlocked:false },
  { id:'bg6', category:'Learning', name:'Code Breaker', icon:'\uD83D\uDCBB', desc:'Complete first programming lesson', unlocked:false },
  { id:'bg7', category:'Learning', name:'History Buff', icon:'\uD83C\uDFDB\uFE0F', desc:'Complete all History chapters', unlocked:false },
  { id:'bg8', category:'Streak', name:'7-Day Streak', icon:'\uD83D\uDD25', desc:'Maintain a 7-day study streak', unlocked:false },
  { id:'bg9', category:'Streak', name:'30-Day Streak', icon:'\uD83D\uDCA5', desc:'Maintain a 30-day study streak', unlocked:false },
  { id:'bg10', category:'Streak', name:'100-Day Streak', icon:'\uD83C\uDF1F', desc:'Maintain a 100-day study streak', unlocked:false },
  { id:'bg11', category:'Streak', name:'Consistent Scholar', icon:'\uD83C\uDFAF', desc:'Study 7 days in a row without break', unlocked:false },
  { id:'bg12', category:'Performance', name:'Top Performer', icon:'\uD83D\uDC51', desc:'Reach rank 1 on the leaderboard', unlocked:false },
  { id:'bg13', category:'Performance', name:'Subject Topper', icon:'\uD83C\uDF93', desc:'Score highest in any subject quiz', unlocked:false },
  { id:'bg14', category:'Performance', name:'Class Champion', icon:'\uD83C\uDFC5', desc:'Top 3 on class leaderboard', unlocked:false },
  { id:'bg15', category:'Performance', name:'Perfect Score', icon:'\uD83D\uDCAF', desc:'Score 100% on 3 quizzes in a row', unlocked:false },
  { id:'bg16', category:'Performance', name:'Rising Star', icon:'\u2B50', desc:'Gain 1000 XP in one week', unlocked:false },
  { id:'bg17', category:'Special', name:'Early Bird', icon:'\uD83C\uDF05', desc:'Complete a lesson before 7 AM', unlocked:false },
  { id:'bg18', category:'Special', name:'Night Owl', icon:'\uD83E\uDD89', desc:'Study after 11 PM for 5 days', unlocked:false },
  { id:'bg19', category:'Special', name:'Helping Hand', icon:'\uD83E\uDD1D', desc:'Answer 10 questions in community', unlocked:false },
  { id:'bg20', category:'Special', name:'Trendsetter', icon:'\uD83D\uDCAB', desc:'Share your progress 5 times', unlocked:false },
  { id:'bg21', category:'Special', name:'Explorer', icon:'\uD83D\uDED4', desc:'Visit all sections of the app', unlocked:false },
  { id:'bg22', category:'Special', name:'Veteran', icon:'\uD83C\uDF96\uFE0F', desc:'Stay active on the platform for 1 year', unlocked:false },
  { id:'bg23', category:'Special', name:'Legendary', icon:'\uD83D\uDC51', desc:'Reach level 25', unlocked:false }
];

var GAM_CHALLENGES = {
  daily: [
    { id:'ch_d1', title:'Complete 1 Lesson', desc:'Finish any lesson from your subjects', icon:'\uD83D\uDCD6', xp:50, coins:10, target:1, duration:86400 },
    { id:'ch_d2', title:'Watch 2 Videos', desc:'Watch any two educational videos', icon:'\uD83C\uDFAC', xp:40, coins:8, target:2, duration:86400 },
    { id:'ch_d3', title:'Score 80% on Quiz', desc:'Take any quiz and score 80% or above', icon:'\uD83D\uDCDD', xp:80, coins:15, target:1, duration:86400 },
    { id:'ch_d4', title:'Study 30 Minutes', desc:'Spend 30 minutes on the platform', icon:'\u23F1\uFE0F', xp:30, coins:5, target:30, duration:86400 },
    { id:'ch_d5', title:'Help a Friend', desc:'Answer a question in the community', icon:'\uD83E\uDD1D', xp:60, coins:12, target:1, duration:86400 }
  ],
  weekly: [
    { id:'ch_w1', title:'Complete 5 Lessons', desc:'Finish any five lessons this week', icon:'\uD83D\uDCDA', xp:300, coins:50, target:5, duration:604800 },
    { id:'ch_w2', title:'Score 90% on 3 Quizzes', desc:'Take three quizzes with 90%+ score', icon:'\uD83C\uDFC6', xp:500, coins:80, target:3, duration:604800 },
    { id:'ch_w3', title:'7-Day Streak', desc:'Study every day this week', icon:'\uD83D\uDD25', xp:400, coins:60, target:7, duration:604800 }
  ],
  monthly: [
    { id:'ch_m1', title:'Complete 20 Lessons', desc:'Finish twenty lessons this month', icon:'\uD83C\uDFAF', xp:1500, coins:200, target:20, duration:2592000 },
    { id:'ch_m2', title:'Top 10 on Leaderboard', desc:'Reach top 10 on the monthly leaderboard', icon:'\uD83C\uDF1F', xp:2000, coins:300, target:1, duration:2592000 }
  ]
};

var GAM_STORE_ITEMS = [
  { id:'theme_dark_neon', type:'theme', name:'Dark Neon Theme', icon:'\uD83C\uDF1F', cost:500, desc:'A sleek neon-dark theme' },
  { id:'theme_ocean', type:'theme', name:'Ocean Blue Theme', icon:'\uD83C\uDF0A', cost:400, desc:'Calming ocean blue tones' },
  { id:'theme_forest', type:'theme', name:'Forest Green Theme', icon:'\uD83C\uDF33', cost:400, desc:'Refreshing forest green' },
  { id:'theme_sunset', type:'theme', name:'Sunset Theme', icon:'\uD83C\uDF07', cost:450, desc:'Warm sunset gradient' },
  { id:'avatar_a1', type:'avatar', name:'Ninja Avatar', icon:'\uD83E\uDD77', cost:200, desc:'Sneaky ninja style' },
  { id:'avatar_a2', type:'avatar', name:'Wizard Avatar', icon:'\uD83E\uDDD9', cost:250, desc:'Magical wizard look' },
  { id:'avatar_a3', type:'avatar', name:'Astronaut Avatar', icon:'\uD83E\uDDDE', cost:300, desc:'Space explorer suit' },
  { id:'avatar_a4', type:'avatar', name:'Robot Avatar', icon:'\uD83E\uDD16', cost:200, desc:'Futuristic robot' },
  { id:'avatar_a5', type:'avatar', name:'Superhero Avatar', icon:'\uD83E\uDDB8', cost:300, desc:'Caped crusader' },
  { id:'avatar_a6', type:'avatar', name:'Pirate Avatar', icon:'\uD83C\uDFF4', cost:250, desc:'Ahoy matey!' },
  { id:'avatar_a7', type:'avatar', name:'Artist Avatar', icon:'\uD83C\uDFA8', cost:200, desc:'Creative artist' },
  { id:'avatar_a8', type:'avatar', name:'Scientist Avatar', icon:'\uD83E\uDDEC', cost:250, desc:'Lab coat look' },
  { id:'avatar_a9', type:'avatar', name:'Athlete Avatar', icon:'\uD83C\uDFC3', cost:200, desc:'Sports star' },
  { id:'avatar_a10', type:'avatar', name:'Royal Avatar', icon:'\uD83D\uDC51', cost:300, desc:'Fit for a king' },
  { id:'frame_gold', type:'frame', name:'Gold Badge Frame', icon:'\uD83C\uDF1F', cost:800, desc:'Premium gold frame for badges' },
  { id:'frame_silver', type:'frame', name:'Silver Badge Frame', icon:'\uD83C\uDF19', cost:500, desc:'Shiny silver frame' },
  { id:'frame_bronze', type:'frame', name:'Bronze Badge Frame', icon:'\uD83C\uDF20', cost:300, desc:'Classic bronze frame' },
  { id:'frame_rainbow', type:'frame', name:'Rainbow Badge Frame', icon:'\uD83C\uDF08', cost:1000, desc:'Colorful rainbow frame' },
  { id:'premium_notes', type:'notes', name:'Premium Notes Pack', icon:'\uD83D\uDCDD', cost:350, desc:'Exclusive premium notes' },
  { id:'wp_galaxy', type:'wallpaper', name:'Galaxy Wallpaper', icon:'\uD83C\uDF0C', cost:250, desc:'Stunning galaxy view' },
  { id:'wp_mountains', type:'wallpaper', name:'Mountain Wallpaper', icon:'\uD83C\uDFD4\uFE0F', cost:250, desc:'Majestic mountains' },
  { id:'wp_city', type:'wallpaper', name:'City Night Wallpaper', icon:'\uD83C\uDF06', cost:250, desc:'City lights at night' },
  { id:'title_achiever', type:'title', name:'Achiever Title', icon:'\uD83C\uDFC6', cost:500, desc:'Display "The Achiever" on your profile' },
  { id:'title_legend', type:'title', name:'Legend Title', icon:'\uD83D\uDC51', cost:500, desc:'Display "The Legend" on your profile' }
];

function generateMockLeaderboard() {
  var names = ['Aarav Sharma','Priya Patel','Vihaan Verma','Ananya Singh','Arjun Reddy','Sneha Nair','Rohan Joshi','Divya Iyer','Kabir Mehta','Kavita Thakur','Advik Kumar','Neha Gupta','Vivaan Desai','Meera Choudhury','Rayan Mishra','Pooja Pandey','Ayaan Rajput','Deepa Yadav','Ishaan Tiwari','Shreya Saxena','Dhruv Chauhan','Vaishali Dwivedi','Krishna Bhatia','Nandini Kapoor','Abhinav Malhotra'];
  var arr = [];
  var baseXp = 9500;
  for (var i = 0; i < 25; i++) {
    var xp = baseXp - i * 350 + Math.floor(Math.random() * 100);
    var lvl = _U.calculateLevel(xp);
    arr.push({
      rank: i + 1,
      name: names[i] || 'Student ' + (i + 1),
      xp: xp,
      level: lvl,
      streak: Math.floor(Math.random() * 60) + 1,
      badges: Math.floor(Math.random() * 15) + 1,
      avatar: null
    });
  }
  return arr;
}

function getChallengeProgress(chId) {
  var prog = _Store.get('gam_challenges') || {};
  return prog[chId] || { progress:0, started:false, claimed:false };
}

function setChallengeProgress(chId, data) {
  var prog = _Store.get('gam_challenges') || {};
  prog[chId] = data;
  _Store.set('gam_challenges', prog);
}

function getPurchasedItems() {
  return _Store.get('gam_purchased') || [];
}

function addPurchasedItem(id) {
  var items = getPurchasedItems();
  if (items.indexOf(id) === -1) {
    items.push(id);
    _Store.set('gam_purchased', items);
  }
}

function toast(msg, type) {
  if (window.UI && window.UI.showToast) {
    window.UI.showToast(msg, type || 'success');
  } else {
    var c = document.querySelector('.toast-container');
    if (!c) { c = document.createElement('div'); c.className = 'toast-container'; document.body.appendChild(c); }
    var t = document.createElement('div');
    t.className = 'toast toast-' + (type || 'success');
    t.innerHTML = '<span class="toast-icon">' + (type === 'error' ? '\u2717' : '\u2713') + '</span><span class="toast-message">' + msg + '</span><button class="toast-dismiss" data-action="gam:dismiss">\u2715</button>';
    c.appendChild(t);
    setTimeout(function() { if (t.parentNode) { t.classList.add('toast-hide'); setTimeout(function() { if (t.parentNode) t.remove(); }, 300); } }, 3000);
  }
}

function switchTab(tabId) {
  var tabs = document.querySelectorAll('.gam-tab');
  for (var i = 0; i < tabs.length; i++) { tabs[i].classList.remove('active'); }
  var activeTab = document.querySelector('.gam-tab[data-tab="' + tabId + '"]');
  if (activeTab) activeTab.classList.add('active');
  var contents = document.querySelectorAll('.gam-tab-content');
  for (var j = 0; j < contents.length; j++) { contents[j].style.display = 'none'; }
  var content = document.getElementById('gam-content-' + tabId);
  if (content) content.style.display = 'block';
}

function claimReward(chId) {
  var data = getChallengeProgress(chId);
  if (data.claimed) { toast('Already claimed!', 'warning'); return; }
  if (data.progress < 1) { toast('Challenge not yet complete!', 'error'); return; }
  var allCh = [].concat(GAM_CHALLENGES.daily, GAM_CHALLENGES.weekly, GAM_CHALLENGES.monthly);
  var ch = null;
  for (var i = 0; i < allCh.length; i++) { if (allCh[i].id === chId) { ch = allCh[i]; break; } }
  if (!ch) return;
  data.claimed = true;
  setChallengeProgress(chId, data);
  if (window.App) {
    window.App.awardXP(ch.xp);
    window.App.awardCoins(ch.coins);
  }
  toast('Claimed ' + ch.xp + ' XP & ' + ch.coins + ' coins!', 'success');
  var renderFn = window.renderPage.gamification;
  if (renderFn) renderFn({ refresh: true });
}

function startChallenge(chId) {
  var data = getChallengeProgress(chId);
  if (data.started) { toast('Challenge already started!', 'info'); return; }
  data.started = true;
  data.progress = 0;
  data.startTime = Date.now();
  setChallengeProgress(chId, data);
  toast('Challenge started! Good luck!', 'info');
  var renderFn = window.renderPage.gamification;
  if (renderFn) renderFn({ refresh: true });
}

function buyItem(itemId) {
  var item = null;
  for (var i = 0; i < GAM_STORE_ITEMS.length; i++) {
    if (GAM_STORE_ITEMS[i].id === itemId) { item = GAM_STORE_ITEMS[i]; break; }
  }
  if (!item) return;
  var owned = getPurchasedItems();
  if (owned.indexOf(itemId) !== -1) { toast('You already own this!', 'info'); return; }
  var user = _Store.get('user');
  var coins = user.coins || 0;
  if (coins < item.cost) { toast('Not enough coins! Need ' + item.cost + ' coins.', 'error'); return; }
  user.coins = coins - item.cost;
  _Store.set('user', user);
  addPurchasedItem(itemId);
  if (window.App && window.App.refreshUserDisplay) window.App.refreshUserDisplay();
  toast('Purchased ' + item.name + '!', 'success');
  var renderFn = window.renderPage.gamification;
  if (renderFn) renderFn({ refresh: true });
}

function shareProgress() {
  var text = 'I\'m level ' + (_Store.get('user').level || 1) + ' on EduMentee! Total XP: ' + (_Store.get('user').xp || 0) + '. Join me at EduMentee!';
  if (navigator.share) {
    navigator.share({ title: 'EduMentee Progress', text: text });
  } else {
    _U.copyToClipboard(text);
    toast('Progress copied to clipboard!', 'success');
  }
}

function filterLeaderboard(filter) {
  var btns = document.querySelectorAll('.lb-filter-btn');
  for (var i = 0; i < btns.length; i++) { btns[i].classList.remove('active'); }
  var btn = document.querySelector('.lb-filter-btn[data-filter="' + filter + '"]');
  if (btn) btn.classList.add('active');
  var container = document.getElementById('gam-leaderboard-list');
  if (!container) return;
  var data = generateMockLeaderboard();
  if (filter === 'weekly') { data.sort(function(a,b){return (b.streak||0)-(a.streak||0);}); for (var j=0;j<data.length;j++) data[j].rank=j+1; }
  if (filter === 'monthly') { data.sort(function(a,b){return (b.badges||0)-(a.badges||0);}); for (var j=0;j<data.length;j++) data[j].rank=j+1; }
  if (filter === 'friends') { data = data.slice(0, 8); }
  container.innerHTML = renderLeaderboardList(data);
}

function renderLeaderboardList(data) {
  var html = '';
  var userId = _Store.get('user') ? _Store.get('user').id : null;
  for (var i = 0; i < data.length; i++) {
    var e = data[i];
    var isMe = e.id === userId || (i === 0 && !userId);
    var r = e.rank;
    var rankStr = r;
    if (r === 1) rankStr = '\uD83D\uDC51';
    else if (r === 2) rankStr = '\uD83E\uDD48';
    else if (r === 3) rankStr = '\uD83E\uDD49';
    var rankCls = '';
    if (r === 1) rankCls = ' gold';
    else if (r === 2) rankCls = ' silver';
    else if (r === 3) rankCls = ' bronze';
    var initials = _U.getInitials(e.name);
    html += '\
<div class="leaderboard-item c-pointer' + (isMe ? ' c-bg-glass' : '') + '" data-action="gam:goto:/profile">\
  <div class="leaderboard-rank' + rankCls + '" style="width:36px;font-size:' + (r <= 3 ? '1.25rem' : 'var(--text-sm)') + '">' + rankStr + '</div>\
  <div class="avatar avatar-sm" style="background:' + _U.getGradient(i) + '">' + initials + '</div>\
  <div class="leaderboard-info">\
    <div class="leaderboard-name c-fs-sm">' + _U.sanitizeHTML(e.name) + (isMe ? ' <span class="c-fs-xs c-text-accent c-fw-medium">(You)</span>' : '') + '</div>\
    <div class="leaderboard-points">Level ' + e.level + ' \u2022 ' + e.streak + ' day streak \u2022 ' + e.badges + ' badges</div>\
  </div>\
  <div class="leaderboard-xp">' + _U.formatNumber(e.xp) + ' XP</div>\
</div>';
  }
  return html;
}

function renderTopThree(data) {
  if (!data || data.length === 0) return '';
  var top = data.slice(0, 3);
  var icons = ['\uD83D\uDC51', '\uD83E\uDD48', '\uD83E\uDD49'];
  var colors = ['var(--accent-yellow)', 'var(--text-tertiary)', 'var(--accent-orange)'];
  var html = '<div class="c-flex-center c-mb-5 c-flex-wrap" style="gap:var(--space-4)">';
  for (var i = 0; i < top.length; i++) {
    var e = top[i];
    var pos = i === 0 ? 1 : (i === 1 ? 0 : 2);
    var orderStyle = i === 0 ? 'order:1;transform:scale(1.1)' : (i === 1 ? 'order:0' : 'order:2');
    var initials = _U.getInitials(e.name);
    html += '\
<div class="c-text-center c-p-4 c-radius-lg c-bg-glass c-border" style="flex:1;min-width:140px;max-width:200px;' + orderStyle + '">\
  <div style="font-size:2.5rem;margin-bottom:var(--space-2)">' + icons[i] + '</div>\
  <div class="avatar avatar-lg mx-auto c-mb-2" style="background:' + _U.getGradient(i) + '">' + initials + '</div>\
  <div class="c-fs-sm c-fw-semibold">' + _U.sanitizeHTML(e.name) + '</div>\
  <div class="c-fs-xs c-text-secondary">Level ' + e.level + '</div>\
  <div class="c-fw-bold" style="color:' + colors[i] + ';font-size:var(--text-lg)">' + _U.formatNumber(e.xp) + ' XP</div>\
</div>';
  }
  html += '</div>';
  return html;
}

function renderWeeklyChart() {
  var days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  var vals = [];
  var max = 0;
  for (var i = 0; i < 7; i++) {
    var v = Math.floor(Math.random() * 120) + 20;
    vals.push(v);
    if (v > max) max = v;
  }
  var today = new Date().getDay();
  var startIdx = today === 0 ? 1 : today - 1;
  var html = '<div class="c-flex-between c-mb-3 c-fs-xs c-text-tertiary"><span>This Week</span><span>Total: ' + _U.formatNumber(vals.reduce(function(a,b){return a+b;},0)) + ' XP</span></div>';
  html += '<div style="display:flex;align-items:flex-end;gap:var(--space-3);height:120px;padding:var(--space-2) 0">';
  for (var j = 0; j < 7; j++) {
    var idx = (startIdx + j) % 7;
    var h = max > 0 ? Math.round((vals[idx] / max) * 100) : 0;
    var isToday = j === 6;
    html += '\
<div class="c-flex-col c-items-center c-flex-1" style="height:100%;justify-content:flex-end">\
  <div class="c-fs-xs c-text-tertiary c-mb-1 c-fw-semibold" style="color:' + (isToday ? 'var(--accent-blue)' : '') + '">' + _U.formatNumber(vals[idx]) + '</div>\
  <div class="c-radius-sm c-w-full" style="height:' + h + 'px;max-width:32px;background:' + (isToday ? 'var(--gradient-primary)' : 'var(--bg-glass-strong)') + ';transition:height 0.5s ease"></div>\
  <div class="c-fs-xs c-text-tertiary c-mt-1 c-fw-semibold" style="color:' + (isToday ? 'var(--accent-blue)' : '') + '">' + days[idx] + '</div>\
</div>';
  }
  html += '</div>';
  return html;
}

function renderChallengeCard(ch) {
  var data = getChallengeProgress(ch.id);
  var pct = ch.target > 0 ? Math.min(100, Math.round((data.progress / ch.target) * 100)) : 0;
  var done = data.progress >= ch.target && data.started;
  var claimed = data.claimed;
  var canClaim = done && !claimed;
  var canStart = !data.started;

  var remaining = ch.duration || 86400;
  var hours = Math.floor(remaining / 3600);
  var mins = Math.floor((remaining % 3600) / 60);
  var timeStr = hours > 0 ? hours + 'h ' + mins + 'm' : mins + 'm';
  if (hours >= 24) {
    var days = Math.floor(hours / 24);
    timeStr = days + 'd ' + (hours % 24) + 'h';
  }

  return '\
<div class="glass-card c-p-5 c-mb-4 c-border" style="background:var(--bg-card)">\
  <div class="c-flex-between c-mb-3 c-flex-wrap" style="gap:var(--space-3)">\
    <div class="c-flex-gap-3">\
      <div style="font-size:2rem">' + ch.icon + '</div>\
      <div>\
        <div class="c-fs-base c-fw-semibold">' + _U.sanitizeHTML(ch.title) + '</div>\
        <div class="c-fs-xs c-text-secondary">' + _U.sanitizeHTML(ch.desc) + '</div>\
      </div>\
    </div>\
    <div class="c-flex-gap-2 c-items-center">\
      <span class="badge badge-blue">+' + ch.xp + ' XP</span>\
      <span class="badge badge-yellow">+' + ch.coins + ' \uD83E\uDE99</span>\
    </div>\
  </div>\
  <div class="c-flex-between c-mb-2 c-fs-xs c-text-tertiary">\
    <span>Progress: ' + data.progress + '/' + ch.target + '</span>\
    <span>' + pct + '%</span>\
  </div>\
  <div class="progress-bar c-mb-3"><div class="progress-bar-fill ' + (done ? 'progress-fill-green' : 'progress-fill-blue') + '" style="width:' + pct + '%"></div></div>\
  <div class="c-flex-between c-flex-wrap" style="gap:var(--space-3)">\
    <div class="c-fs-xs c-text-tertiary">\u23F3 ' + timeStr + ' remaining</div>\
    <div class="c-flex-gap-2">\
      ' + (canStart ? '<button class="btn btn-primary btn-sm" data-action="gam:startChallenge:' + ch.id + '">Start</button>' : '') + '\
      ' + (canClaim ? '<button class="btn btn-green btn-sm" data-action="gam:claim:' + ch.id + '">Claim Reward</button>' : '') + '\
      ' + (claimed ? '<span class="badge badge-green">\u2705 Claimed</span>' : '') + '\
      ' + (done && claimed ? '' : (!canStart && !canClaim ? '<span class="badge badge-cyan">In Progress</span>' : '')) + '\
    </div>\
  </div>\
</div>';
}

function renderChallengesSection(type) {
  var list = GAM_CHALLENGES[type];
  if (!list || list.length === 0) return '<div class="c-text-center c-p-6 c-text-tertiary">No challenges available.</div>';
  var html = '';
  for (var i = 0; i < list.length; i++) {
    html += renderChallengeCard(list[i]);
  }
  return html;
}

function renderBadgesGrid() {
  var userBadges = (_Store.get('user') && _Store.get('user').badges) || [];
  var userBadgeMap = {};
  for (var i = 0; i < userBadges.length; i++) {
    var b = userBadges[i];
    if (typeof b === 'string') userBadgeMap[b] = true;
    else if (b && b.id) userBadgeMap[b.id] = b.unlockedAt || true;
  }
  var cats = ['Learning', 'Streak', 'Performance', 'Special'];
  var html = '';
  for (var ci = 0; ci < cats.length; ci++) {
    var cat = cats[ci];
    var items = [];
    for (var j = 0; j < GAM_BADGES.length; j++) {
      if (GAM_BADGES[j].category === cat) items.push(GAM_BADGES[j]);
    }
    if (items.length === 0) continue;
    html += '<div class="c-mb-6">';
    html += '<h3 class="c-fs-base c-fw-semibold c-mb-3 c-text-secondary" style="text-transform:uppercase;letter-spacing:0.5px">' + cat + '</h3>';
    html += '<div class="c-flex-wrap" style="display:flex;gap:var(--space-3)">';
    for (var k = 0; k < items.length; k++) {
      var badge = items[k];
      var unlocked = !!userBadgeMap[badge.id];
      html += '\
<div class="c-text-center c-pointer tooltip c-transition" data-tooltip="' + (unlocked ? badge.desc + ' \u2705' : badge.desc) + '" style="transition-property:all" data-action="gam:goto:/profile">\
  <div class="badge-card' + (unlocked ? '' : ' locked') + '">\
    <div class="badge-icon">' + badge.icon + '</div>\
    <div class="badge-name">' + _U.sanitizeHTML(badge.name) + '</div>\
  </div>\
  ' + (unlocked ? '<div class="c-fs-xs c-text-success c-mt-1" style="font-size:10px">\u2705 Unlocked</div>' : '<div class="c-fs-xs c-text-tertiary c-mt-1" style="font-size:10px">Locked</div>') + '\
</div>';
    }
    html += '</div></div>';
  }
  return html;
}

function renderStoreGrid() {
  var owned = getPurchasedItems();
  var user = _Store.get('user');
  var coins = user ? (user.coins || 0) : 0;
  var html = '';
  var types = [
    { key:'theme', label:'\uD83C\uDFA8 Themes' },
    { key:'avatar', label:'\uD83D\uDC64 Avatars' },
    { key:'frame', label:'\uD83D\uDEF8 Badge Frames' },
    { key:'notes', label:'\uD83D\uDCDD Premium' },
    { key:'wallpaper', label:'\uD83D\uDDFA\uFE0F Wallpapers' },
    { key:'title', label:'\uD83C\uDFC6 Titles' }
  ];
  for (var ti = 0; ti < types.length; ti++) {
    var t = types[ti];
    var items = [];
    for (var i = 0; i < GAM_STORE_ITEMS.length; i++) {
      if (GAM_STORE_ITEMS[i].type === t.key) items.push(GAM_STORE_ITEMS[i]);
    }
    if (items.length === 0) continue;
    html += '<div class="c-mb-6">';
    html += '<h3 class="c-fs-base c-fw-semibold c-mb-3">' + t.label + '</h3>';
    html += '<div class="stats-grid" style="grid-template-columns:repeat(auto-fill,minmax(180px,1fr))">';
    for (var j = 0; j < items.length; j++) {
      var item = items[j];
      var isOwned = owned.indexOf(item.id) !== -1;
      var canBuy = coins >= item.cost && !isOwned;
      html += '\
<div class="glass-card c-p-4 c-text-center c-transition" style="transition-property:all">\
  <div style="font-size:2.5rem;margin-bottom:var(--space-3)">' + item.icon + '</div>\
  <div class="c-fs-sm c-fw-semibold c-mb-1">' + _U.sanitizeHTML(item.name) + '</div>\
  <div class="c-fs-xs c-text-tertiary c-mb-3">' + _U.sanitizeHTML(item.desc) + '</div>\
  <div class="c-fs-sm c-fw-bold c-text-warning c-mb-2">' + item.cost + ' \uD83E\uDE99</div>\
  ' + (isOwned ? '<span class="badge badge-green">\u2705 Owned</span>' : '<button class="btn btn-sm ' + (canBuy ? 'btn-primary' : 'btn-secondary') + '" data-action="gam:buy:' + item.id + '"' + (!canBuy ? ' disabled' : '') + '>Buy</button>') + '\
</div>';
    }
    html += '</div></div>';
  }
  return html;
}

window.renderPage.gamification = function(params) {
  var mc = document.getElementById('main-content');
  if (!mc) return;
  var user = _Store.get('user');
  if (!user) { window.Router.navigate('/login'); return; }

  var xp = user.xp || 0;
  var level = user.level || 1;
  var coins = user.coins || 0;
  var streak = _Store.get('user') ? (_Store.get('user').streak || 0) : 0;
  var levelTitle = getLevelTitle(level);
  var levelIcon = getLevelIcon(level);
  var xpCurrent = xpInLevel(xp, level);
  var xpNext = xpToNext(level);
  var xpPct = xpNext > 0 ? Math.min(100, Math.round((xpCurrent / xpNext) * 100)) : 0;
  var lbData = generateMockLeaderboard();
  var top3 = lbData.slice(0, 3);

  var userBadges = user.badges || [];
  var challengesActive = 0;
  var challengesCompleted = 0;
  var allChList = [].concat(GAM_CHALLENGES.daily, GAM_CHALLENGES.weekly, GAM_CHALLENGES.monthly);
  for (var ci = 0; ci < allChList.length; ci++) {
    var d = getChallengeProgress(allChList[ci].id);
    if (d.started) challengesActive++;
    if (d.claimed) challengesCompleted++;
  }

  var todayXP = 0;
  var todayCoins = 0;
  if (window.App && window.App.getDailyStats) {
    var ds = window.App.getDailyStats();
    todayXP = ds.xp || 0;
    todayCoins = ds.coins || 0;
  }

  var html = '\
<div class="page-container" style="max-width:1200px;margin:0 auto">\
  <div class="c-flex-between c-mb-4 c-flex-wrap" style="gap:var(--space-3)">\
    <div>\
      <div class="page-title c-fs-2xl c-fw-bold">\uD83C\uDFC6 Gamification</div>\
      <div class="page-subtitle c-fs-sm c-text-secondary">Complete challenges, earn badges, and climb the leaderboard</div>\
    </div>\
  </div>\
  <div class="c-radius-xl c-p-5 c-mb-6 c-relative c-overflow-hidden" style="background:var(--gradient-glass);border:1px solid var(--border-accent)">\
    <div class="c-flex-wrap" style="display:flex;align-items:center;justify-content:space-between;gap:var(--space-4);position:relative;z-index:1">\
      <div class="c-flex-gap-3">\
        <div style="width:70px;height:70px;border-radius:var(--radius-full);background:var(--gradient-gold);display:flex;align-items:center;justify-content:center;font-size:2rem;box-shadow:0 0 30px rgba(245,158,11,0.3)">' + levelIcon + '</div>\
        <div>\
          <div class="c-fs-xs c-text-tertiary c-uppercase c-fw-semibold" style="letter-spacing:1px">Level ' + level + '</div>\
          <div class="c-fs-xl c-fw-bold">' + levelTitle + '</div>\
          <div class="c-fs-xs c-text-secondary">' + _U.formatNumber(xp) + ' Total XP</div>\
        </div>\
      </div>\
      <div class="c-flex-gap-3 c-flex-wrap">\
        <div class="c-text-center c-px-3">\
          <div class="c-fs-lg c-fw-bold c-text-warning">' + _U.formatNumber(coins) + '</div>\
          <div class="c-fs-xs c-text-tertiary">\uD83E\uDE99 Coins</div>\
        </div>\
        <div class="c-text-center c-px-3">\
          <div class="c-fs-lg c-fw-bold c-text-accent">' + streak + '</div>\
          <div class="c-fs-xs c-text-tertiary">\uD83D\uDD25 Streak</div>\
        </div>\
        <div class="c-text-center c-px-3">\
          <div class="c-fs-lg c-fw-bold c-text-success">' + userBadges.length + '</div>\
          <div class="c-fs-xs c-text-tertiary">\uD83C\uDFC5 Badges</div>\
        </div>\
      </div>\
      <button class="btn btn-secondary btn-sm" data-action="gam:share">\uD83D\uDCE4 Share Progress</button>\
    </div>\
    <div class="c-mt-4 c-relative" style="z-index:1">\
      <div class="c-flex-between c-fs-xs c-text-tertiary c-mb-1">\
        <span>Level ' + level + ' \u2192 ' + (level + 1) + '</span>\
        <span>' + xpPct + '% \u2022 ' + _U.formatNumber(xpCurrent) + ' / ' + _U.formatNumber(xpNext) + ' XP</span>\
      </div>\
      <div class="progress-bar" style="height:12px"><div class="progress-bar-fill progress-fill-blue xp-bar-fill" id="gam-xp-bar" style="width:' + xpPct + '%;transition:width 1s ease"></div></div>\
    </div>\
  </div>\
  <div class="tabs c-mb-5">\
    <div class="tab gam-tab active" data-tab="dashboard" data-action="gam:tab:dashboard">\uD83D\uDCCA Dashboard</div>\
    <div class="tab gam-tab" data-tab="challenges" data-action="gam:tab:challenges">\uD83C\uDFF7\uFE0F Challenges</div>\
    <div class="tab gam-tab" data-tab="badges" data-action="gam:tab:badges">\uD83C\uDFC5 Badges</div>\
    <div class="tab gam-tab" data-tab="leaderboard" data-action="gam:tab:leaderboard">\uD83C\uDFC6 Leaderboard</div>\
    <div class="tab gam-tab" data-tab="store" data-action="gam:tab:store">\uD83D\uDECD\uFE0F Rewards Store</div>\
  </div>\
  <div id="gam-content-dashboard" class="gam-tab-content">' + renderDashboardContent() + '</div>\
  <div id="gam-content-challenges" class="gam-tab-content" style="display:none">' + renderChallengesContent() + '</div>\
  <div id="gam-content-badges" class="gam-tab-content" style="display:none">' + renderBadgesContent() + '</div>\
  <div id="gam-content-leaderboard" class="gam-tab-content" style="display:none">' + renderLeaderboardContent() + '</div>\
  <div id="gam-content-store" class="gam-tab-content" style="display:none">' + renderStoreContent() + '</div>\
</div>';

  mc.innerHTML = html;
  animateXPBar();

  var initialTab = params && params.tab ? params.tab : 'dashboard';
  if (params && params.refresh) {
    var activeTabEl = document.querySelector('.gam-tab.active');
    if (activeTabEl) initialTab = activeTabEl.getAttribute('data-tab') || 'dashboard';
  }
  switchTab(initialTab);

  function animateXPBar() {
    setTimeout(function() {
      var bar = document.getElementById('gam-xp-bar');
      if (bar) {
        bar.style.width = '0%';
        setTimeout(function() { bar.style.width = xpPct + '%'; }, 100);
      }
    }, 200);
  }

  function renderDashboardContent() {
    return '\
<div class="c-mb-6">\
  <div class="stats-grid" style="grid-template-columns:repeat(auto-fill,minmax(160px,1fr))">\
    <div class="stat-card c-text-center">\
      <div class="stat-icon" style="margin:0 auto;background:rgba(59,130,246,0.15);color:var(--accent-blue)">\u2B50</div>\
      <div class="stat-value count-up" data-target="' + todayXP + '">' + _U.formatNumber(todayXP) + '</div>\
      <div class="stat-label">XP Earned Today</div>\
    </div>\
    <div class="stat-card c-text-center">\
      <div class="stat-icon" style="margin:0 auto;background:rgba(245,158,11,0.15);color:var(--accent-yellow)">\uD83E\uDE99</div>\
      <div class="stat-value count-up" data-target="' + todayCoins + '">' + _U.formatNumber(todayCoins) + '</div>\
      <div class="stat-label">Coins Earned Today</div>\
    </div>\
    <div class="stat-card c-text-center">\
      <div class="stat-icon" style="margin:0 auto;background:rgba(16,185,129,0.15);color:var(--accent-green)">\u2705</div>\
      <div class="stat-value count-up" data-target="' + challengesCompleted + '">' + challengesCompleted + '</div>\
      <div class="stat-label">Challenges Done</div>\
    </div>\
    <div class="stat-card c-text-center">\
      <div class="stat-icon" style="margin:0 auto;background:rgba(139,92,246,0.15);color:var(--accent-purple)">\uD83D\uDD25</div>\
      <div class="stat-value count-up" data-target="' + streak + '">' + streak + '</div>\
      <div class="stat-label">Day Streak</div>\
    </div>\
    <div class="stat-card c-text-center">\
      <div class="stat-icon" style="margin:0 auto;background:rgba(6,182,212,0.15);color:var(--accent-cyan)">\uD83D\uDCD6</div>\
      <div class="stat-value count-up" data-target="' + challengesActive + '">' + challengesActive + '</div>\
      <div class="stat-label">Active Challenges</div>\
    </div>\
    <div class="stat-card c-text-center">\
      <div class="stat-icon" style="margin:0 auto;background:rgba(236,72,153,0.15);color:var(--accent-pink)">\uD83C\uDFC6</div>\
      <div class="stat-value count-up" data-target="' + (lbData[0] ? lbData[0].rank : '-') + '">' + (lbData[0] ? '#' + lbData[0].rank : '-') + '</div>\
      <div class="stat-label">Your Rank</div>\
    </div>\
  </div>\
  <div class="c-mb-5">\
    <h3 class="c-fs-lg c-fw-semibold c-mb-3">\uD83C\uDFC6 Weekly Progress</h3>\
    <div class="glass-card c-p-5">' + renderWeeklyChart() + '</div>\
  </div>\
  <div class="c-mb-5">\
    <h3 class="c-fs-lg c-fw-semibold c-mb-3">\uD83C\uDFF7\uFE0F Daily Challenges</h3>\
    ' + renderDailyChallengeCards() + '\
  </div>\
  <div class="c-mb-5">\
    <h3 class="c-fs-lg c-fw-semibold c-mb-3">\u26A1 Quick Stats</h3>\
    <div class="stats-grid" style="grid-template-columns:repeat(auto-fill,minmax(180px,1fr))">\
      <div class="glass-card c-p-4 c-text-center">\
        <div class="c-fs-xl c-fw-bold c-text-accent">' + _U.formatNumber(xp) + '</div>\
        <div class="c-fs-xs c-text-tertiary">Total XP</div>\
      </div>\
      <div class="glass-card c-p-4 c-text-center">\
        <div class="c-fs-xl c-fw-bold c-text-warning">' + _U.formatNumber(coins) + '</div>\
        <div class="c-fs-xs c-text-tertiary">Total Coins</div>\
      </div>\
      <div class="glass-card c-p-4 c-text-center">\
        <div class="c-fs-xl c-fw-bold c-text-success">' + userBadges.length + '</div>\
        <div class="c-fs-xs c-text-tertiary">Badges Unlocked</div>\
      </div>\
      <div class="glass-card c-p-4 c-text-center">\
        <div class="c-fs-xl c-fw-bold c-text-purple">' + (user.level || 1) + '</div>\
        <div class="c-fs-xs c-text-tertiary">Current Level</div>\
      </div>\
    </div>\
  </div>\
</div>';
  }

  function renderDailyChallengeCards() {
    var dailies = GAM_CHALLENGES.daily;
    var html = '';
    for (var i = 0; i < dailies.length; i++) {
      var ch = dailies[i];
      var data = getChallengeProgress(ch.id);
      var pct = ch.target > 0 ? Math.min(100, Math.round((data.progress / ch.target) * 100)) : 0;
      var done = data.progress >= ch.target && data.started;
      var claimed = data.claimed;
      html += '\
<div class="glass-card c-p-4 c-mb-3 c-flex-gap-3 c-flex-wrap" style="display:flex;align-items:center;justify-content:space-between">\
  <div class="c-flex-gap-3" style="display:flex;align-items:center;flex:1;min-width:200px">\
    <div style="font-size:1.75rem">' + ch.icon + '</div>\
    <div style="flex:1">\
      <div class="c-fs-sm c-fw-semibold">' + _U.sanitizeHTML(ch.title) + '</div>\
      <div class="c-fs-xs c-text-secondary">+' + ch.xp + ' XP \u2022 +' + ch.coins + ' coins</div>\
    </div>\
  </div>\
  <div style="flex:1;min-width:120px">\
    <div class="c-flex-between c-fs-xs c-text-tertiary c-mb-1"><span>' + data.progress + '/' + ch.target + '</span><span>' + pct + '%</span></div>\
    <div class="progress-bar"><div class="progress-bar-fill ' + (done ? 'progress-fill-green' : 'progress-fill-blue') + '" style="width:' + pct + '%"></div></div>\
  </div>\
  <div>\
    ' + (claimed ? '<span class="badge badge-green">\u2705 Done</span>' : (done ? '<button class="btn btn-green btn-sm" data-action="gam:claim:' + ch.id + '">Claim</button>' : (!data.started ? '<button class="btn btn-primary btn-sm" data-action="gam:startChallenge:' + ch.id + '">Start</button>' : '<span class="badge badge-cyan">In Progress...</span>'))) + '\
  </div>\
</div>';
    }
    return html;
  }

  function renderChallengesContent() {
    return '\
<div class="tabs-enhanced c-mb-4">\
  <button class="tab-enhanced gam-challenge-tab active" data-action="gam:challengeFilter:daily">\uD83D\uDCC5 Daily</button>\
  <button class="tab-enhanced gam-challenge-tab" data-action="gam:challengeFilter:weekly">\uD83D\uDCC6 Weekly</button>\
  <button class="tab-enhanced gam-challenge-tab" data-action="gam:challengeFilter:monthly">\uD83C\uDF86 Monthly</button>\
</div>\
<div id="gam-challenges-list">' + renderChallengesSection('daily') + '</div>';
  }

  window.switchChallengeFilter = function(type) {
    var btns = document.querySelectorAll('.gam-challenge-tab');
    for (var i = 0; i < btns.length; i++) btns[i].classList.remove('active');
    var activeBtn = document.querySelector('.gam-challenge-tab[data-action="gam:challengeFilter:' + type + '"]');
    if (activeBtn) {
      activeBtn.classList.add('active');
    } else {
      var allBtns = document.querySelectorAll('.gam-challenge-tab');
      for (var j = 0; j < allBtns.length; j++) {
        if (allBtns[j].textContent.toLowerCase().indexOf(type) !== -1) {
          allBtns[j].classList.add('active');
          break;
        }
      }
    }
    var container = document.getElementById('gam-challenges-list');
    if (container) container.innerHTML = renderChallengesSection(type);
  };

  function renderBadgesContent() {
    return '\
<div class="c-mb-4">\
  <div class="c-flex-between c-mb-4 c-flex-wrap" style="gap:var(--space-3)">\
    <div>\
      <div class="c-fs-lg c-fw-semibold">\uD83C\uDFC5 Achievement Badges</div>\
      <div class="c-fs-xs c-text-secondary">Collect all ' + GAM_BADGES.length + ' badges by completing various achievements</div>\
    </div>\
    <div class="c-fs-sm c-text-secondary">' + userBadges.length + ' / ' + GAM_BADGES.length + ' Unlocked</div>\
  </div>\
  <div class="c-progress-bar c-mb-4">\
    <div class="progress-bar"><div class="progress-bar-fill progress-fill-purple" style="width:' + (GAM_BADGES.length > 0 ? Math.round((userBadges.length / GAM_BADGES.length) * 100) : 0) + '%"></div></div>\
  </div>\
  ' + renderBadgesGrid() + '\
</div>';
  }

  function renderLeaderboardContent() {
    return '\
<div class="c-mb-4">\
  <div class="c-flex-between c-mb-4 c-flex-wrap" style="gap:var(--space-3)">\
    <div>\
      <div class="c-fs-lg c-fw-semibold">\uD83C\uDFC6 Leaderboard</div>\
      <div class="c-fs-xs c-text-secondary">Top performers across the platform</div>\
    </div>\
    <div class="c-flex-gap-2 c-flex-wrap">\
      <button class="btn btn-sm lb-filter-btn active" data-filter="all" data-action="gam:filterLeaderboard:all">All Time</button>\
      <button class="btn btn-sm btn-ghost lb-filter-btn" data-filter="weekly" data-action="gam:filterLeaderboard:weekly">Weekly</button>\
      <button class="btn btn-sm btn-ghost lb-filter-btn" data-filter="monthly" data-action="gam:filterLeaderboard:monthly">Monthly</button>\
      <button class="btn btn-sm btn-ghost lb-filter-btn" data-filter="friends" data-action="gam:filterLeaderboard:friends">Friends</button>\
    </div>\
  </div>\
  ' + renderTopThree(lbData) + '\
  <div class="glass-card c-p-3" style="background:var(--bg-card)">\
    <div id="gam-leaderboard-list">' + renderLeaderboardList(lbData) + '</div>\
  </div>\
</div>';
  }

  function renderStoreContent() {
    return '\
<div class="c-mb-4">\
  <div class="c-flex-between c-mb-4 c-flex-wrap" style="gap:var(--space-3)">\
    <div>\
      <div class="c-fs-lg c-fw-semibold">\uD83D\uDECD\uFE0F Rewards Store</div>\
      <div class="c-fs-xs c-text-secondary">Spend your coins on exclusive items</div>\
    </div>\
    <div class="c-flex-gap-2 c-items-center">\
      <span class="c-fs-sm c-text-tertiary">Your Balance:</span>\
      <span class="c-fs-lg c-fw-bold c-text-warning">' + _U.formatNumber(coins) + ' \uD83E\uDE99</span>\
    </div>\
  </div>\
  ' + renderStoreGrid() + '\
</div>';
  }

  function initCountUp() {
    var els = mc.querySelectorAll('.count-up');
    for (var ci2 = 0; ci2 < els.length; ci2++) {
      var el = els[ci2];
      var target = parseInt(el.getAttribute('data-target'), 10);
      if (isNaN(target)) continue;
      var duration = 800;
      var startTime = null;
      function step(timestamp) {
        if (!startTime) startTime = timestamp;
        var progress = Math.min((timestamp - startTime) / duration, 1);
        var eased = 1 - Math.pow(1 - progress, 3);
        var current = Math.round(eased * target);
        el.textContent = current.toLocaleString();
        if (progress < 1) {
          requestAnimationFrame(step);
        } else {
          el.textContent = target.toLocaleString();
        }
      }
      requestAnimationFrame(step);
    }
  }

  setTimeout(function() { initCountUp(); }, 300);
};
