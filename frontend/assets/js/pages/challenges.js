window.renderPage = window.renderPage || {};

(function() {
  var store = window.Store;
  var utils = window.Utils;

  if (!window._chDelegateAdded) {
    window._chDelegateAdded = true;
    document.addEventListener('click', function(e) {
      var t = e.target.closest('[data-action^="ch:"]');
      if (!t) return;
      var p = t.getAttribute('data-action').split(':');
      var c = p[1], arg = p.slice(2).join(':');
      if (c === 'tab' && arg) { currentChallengeTab = arg; renderChallengesView(); }
      else if (c === 'join' && arg) { joinChallenge(arg); }
      else if (c === 'progress' && arg) { addProgress(arg); }
      else if (c === 'claim' && arg) { claimReward(arg); }
    });
  }

  var DAILY_CHALLENGES = [
    { id: 'dc1', title: 'Early Bird Learner', desc: 'Complete a lesson before 9 AM', icon: '\uD83C\uDF05', xpReward: 100, coinReward: 20, target: 1, deadline: 'daily' },
    { id: 'dc2', title: 'Quiz Warrior', desc: 'Score 80% or above on any quiz', icon: '\uD83D\uDCDD', xpReward: 150, coinReward: 30, target: 1, deadline: 'daily' },
    { id: 'dc3', title: 'Video Marathon', desc: 'Watch 3 educational videos', icon: '\uD83C\uDFAC', xpReward: 80, coinReward: 15, target: 3, deadline: 'daily' },
    { id: 'dc4', title: 'Flashcard Master', desc: 'Review 20 flashcards today', icon: '\uD83C\uDF1F', xpReward: 120, coinReward: 25, target: 20, deadline: 'daily' },
    { id: 'dc5', title: 'Problem Solver', desc: 'Solve 5 practice problems', icon: '\uD83D\uDD22', xpReward: 110, coinReward: 22, target: 5, deadline: 'daily' }
  ];

  var WEEKLY_CHALLENGES = [
    { id: 'wc1', title: 'Consistent Learner', desc: 'Study every day this week', icon: '\uD83D\uDD25', xpReward: 500, coinReward: 100, target: 7, deadline: 'weekly' },
    { id: 'wc2', title: 'Quiz Champion', desc: 'Score 90%+ on 3 different quizzes', icon: '\uD83C\uDFC6', xpReward: 600, coinReward: 120, target: 3, deadline: 'weekly' },
    { id: 'wc3', title: 'Resource Collector', desc: 'Download 5 study resources', icon: '\uD83D\uDCC4', xpReward: 350, coinReward: 70, target: 5, deadline: 'weekly' },
    { id: 'wc4', title: 'Community Helper', desc: 'Answer 3 questions in the community', icon: '\uD83E\uDD1D', xpReward: 400, coinReward: 80, target: 3, deadline: 'weekly' }
  ];

  var MONTHLY_CHALLENGES = [
    { id: 'mc1', title: 'Knowledge Seeker', desc: 'Complete 20 lessons across all subjects', icon: '\uD83D\uDCDA', xpReward: 2000, coinReward: 400, target: 20, deadline: 'monthly' },
    { id: 'mc2', title: 'Perfect Month', desc: 'Score 90%+ on all quizzes this month', icon: '\uD83D\uDCAB', xpReward: 3000, coinReward: 600, target: 10, deadline: 'monthly' },
    { id: 'mc3', title: 'Social Butterfly', desc: 'Make 15 community posts or comments', icon: '\uD83D\uDCAC', xpReward: 1500, coinReward: 300, target: 15, deadline: 'monthly' }
  ];

  var currentChallengeTab = 'daily';

  function getAllChallenges() {
    return DAILY_CHALLENGES.concat(WEEKLY_CHALLENGES).concat(MONTHLY_CHALLENGES);
  }

  function getChallengeState() {
    return store.get('challengeState') || {
      accepted: {},
      progress: {},
      completed: {},
      claimed: {},
      xpEarned: 0,
      coinsEarned: 0
    };
  }

  function saveChallengeState(s) {
    store.set('challengeState', s);
  }

  function joinChallenge(id) {
    var s = getChallengeState();
    if (s.accepted[id]) return;
    s.accepted[id] = true;
    s.progress[id] = 0;
    saveChallengeState(s);
    window.showToast && window.showToast('Challenge accepted!', 'success');
    renderChallengesView();
  }

  function addProgress(id) {
    var s = getChallengeState();
    if (!s.accepted[id] || s.completed[id]) return;
    var allCh = getAllChallenges();
    var ch = null;
    for (var i = 0; i < allCh.length; i++) {
      if (allCh[i].id === id) { ch = allCh[i]; break; }
    }
    if (!ch) return;
    s.progress[id] = (s.progress[id] || 0) + 1;
    if (s.progress[id] >= ch.target && !s.completed[id]) {
      s.completed[id] = true;
      window.showToast && window.showToast('Challenge completed! Claim your reward!', 'success');
    }
    saveChallengeState(s);
    renderChallengesView();
  }

  function claimReward(id) {
    var s = getChallengeState();
    if (!s.completed[id] || s.claimed[id]) return;
    var allCh = getAllChallenges();
    var ch = null;
    for (var i = 0; i < allCh.length; i++) {
      if (allCh[i].id === id) { ch = allCh[i]; break; }
    }
    if (!ch) return;
    s.claimed[id] = true;
    s.xpEarned = (s.xpEarned || 0) + ch.xpReward;
    s.coinsEarned = (s.coinsEarned || 0) + ch.coinReward;
    saveChallengeState(s);
    if (window.App && window.App.awardXP) window.App.awardXP(ch.xpReward);
    if (window.App && window.App.awardCoins) window.App.awardCoins(ch.coinReward);
    window.showToast && window.showToast('+' + ch.xpReward + ' XP, +' + ch.coinReward + ' Coins claimed!', 'success');
    renderChallengesView();
  }

  function renderChallengeCard(ch, state) {
    var prog = state.progress[ch.id] || 0;
    var isAccepted = !!state.accepted[ch.id];
    var isCompleted = !!state.completed[ch.id];
    var isClaimed = !!state.claimed[ch.id];
    var pct = Math.min(100, Math.round((prog / ch.target) * 100));

    var borderStyle = isClaimed ? 'border-color:rgba(16,185,129,0.3);background:rgba(16,185,129,0.04)' : isCompleted ? 'border-color:rgba(245,158,11,0.3);background:rgba(245,158,11,0.04)' : 'border-color:var(--border-color)';

    var html = '<div class="glass-card" style="padding:var(--space-5);' + borderStyle + '">';
    html += '<div style="display:flex;align-items:start;justify-content:space-between;margin-bottom:var(--space-3)">';
    html += '<div style="display:flex;align-items:center;gap:var(--space-3)">';
    html += '<div style="width:48px;height:48px;border-radius:var(--radius-md);background:rgba(59,130,246,0.1);display:flex;align-items:center;justify-content:center;font-size:24px;flex-shrink:0">' + ch.icon + '</div>';
    html += '<div><div style="font-weight:600;color:var(--text-primary);margin-bottom:2px">' + ch.title + '</div>';
    html += '<div style="font-size:var(--text-xs);color:var(--text-tertiary);line-height:1.4">' + ch.desc + '</div>';
    html += '</div></div>';
    html += '<div style="text-align:right;flex-shrink:0">';
    html += '<div style="font-size:var(--text-xs);color:var(--accent-blue);font-weight:600">+' + ch.xpReward + ' XP</div>';
    html += '<div style="font-size:10px;color:var(--accent-yellow)">+' + ch.coinReward + ' Coins</div>';
    html += '</div></div>';

    if (isAccepted) {
      html += '<div style="margin-bottom:var(--space-3)">';
      html += '<div style="display:flex;justify-content:space-between;font-size:var(--text-xs);color:var(--text-tertiary);margin-bottom:var(--space-1)">';
      html += '<span>Progress</span><span>' + prog + ' / ' + ch.target + '</span>';
      html += '</div>';
      html += '<div class="progress-bar"><div class="progress-bar-fill progress-fill-blue" style="width:' + pct + '%"></div></div>';
      html += '</div>';
    }

    html += '<div style="display:flex;align-items:center;justify-content:space-between">';
    html += '<span class="badge badge-' + (ch.deadline === 'daily' ? 'yellow' : ch.deadline === 'weekly' ? 'blue' : 'purple') + '">' + ch.deadline + '</span>';

    if (isClaimed) {
      html += '<span class="badge badge-green">&#10003; Claimed</span>';
    } else if (isCompleted) {
      html += '<button class="btn btn-green btn-sm" data-action="ch:claim:' + ch.id + '">Claim Reward</button>';
    } else if (isAccepted) {
      html += '<button class="btn btn-primary btn-sm" data-action="ch:progress:' + ch.id + '">Progress +1</button>';
    } else {
      html += '<button class="btn btn-accent btn-sm" data-action="ch:join:' + ch.id + '">Join</button>';
    }

    html += '</div></div>';
    return html;
  }

  function renderChallengesView() {
    var mc = document.getElementById('main-content');
    if (!mc) return;
    var s = getChallengeState();

    var totalChallenges = getAllChallenges().length;
    var completedCount = 0;
    for (var ck in s.completed) {
      if (s.completed[ck]) completedCount++;
    }

    var html = '<div style="padding:var(--space-5);max-width:1000px;margin:0 auto;">';
    html += '<div style="margin-bottom:var(--space-5)">';
    html += '<h2 style="font-size:var(--text-xl);font-weight:700;color:var(--text-primary);margin:0">&#x1F3C3; Challenges</h2>';
    html += '<p style="font-size:var(--text-sm);color:var(--text-tertiary);margin:var(--space-1) 0 0 0">Complete challenges to earn XP and coins</p>';
    html += '</div>';

    html += '<div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(180px,1fr));gap:var(--space-3);margin-bottom:var(--space-5)">';
    var summary = [
      { label: 'Completed', value: completedCount + '/' + totalChallenges, icon: '\u2705', color: 'var(--accent-green)' },
      { label: 'XP Earned', value: s.xpEarned || 0, icon: '\u2B50', color: 'var(--accent-blue)' },
      { label: 'Coins Earned', value: s.coinsEarned || 0, icon: '\uD83E\uDE99', color: 'var(--accent-yellow)' }
    ];
    for (var si = 0; si < summary.length; si++) {
      var sc = summary[si];
      html += '<div class="glass-card" style="padding:var(--space-4);text-align:center">';
      html += '<div style="font-size:20px;margin-bottom:var(--space-1)">' + sc.icon + '</div>';
      html += '<div style="font-size:var(--text-lg);font-weight:700;color:' + sc.color + '">' + sc.value + '</div>';
      html += '<div style="font-size:var(--text-xs);color:var(--text-tertiary)">' + sc.label + '</div>';
      html += '</div>';
    }
    html += '</div>';

    html += '<div style="display:flex;gap:var(--space-2);margin-bottom:var(--space-4)">';
    var tabs = [
      { id: 'daily', label: '\uD83C\uDF05 Daily' },
      { id: 'weekly', label: '\uD83D\uDCC5 Weekly' },
      { id: 'monthly', label: '\uD83C\uDFC6 Monthly' }
    ];
    for (var ti = 0; ti < tabs.length; ti++) {
      html += '<button class="btn ' + (currentChallengeTab === tabs[ti].id ? 'btn-primary' : 'btn-ghost') + ' btn-sm" data-action="ch:tab:' + tabs[ti].id + '">' + tabs[ti].label + '</button>';
    }
    html += '</div>';

    html += '<div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(340px,1fr));gap:var(--space-4)">';

    var challenges = currentChallengeTab === 'daily' ? DAILY_CHALLENGES : currentChallengeTab === 'weekly' ? WEEKLY_CHALLENGES : MONTHLY_CHALLENGES;
    for (var ci = 0; ci < challenges.length; ci++) {
      html += renderChallengeCard(challenges[ci], s);
    }

    html += '</div></div>';
    mc.innerHTML = html;
  }

  window.renderPage.challenges = function() {
    currentChallengeTab = 'daily';
    renderChallengesView();
  };
})();
