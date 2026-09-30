window.renderPage.notifications = function(params) {
  if (!window._notifDelegated) {
    window._notifDelegated = true;
    document.addEventListener('click', function(e) {
      var t = e.target.closest('[data-action^="notif:"]');
      if (!t) return;
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'SELECT') return;
      var p = t.getAttribute('data-action').split(':');
      var c = p[1], a = p[2];
      if (c === 'closeDrawer') { window.closeNotifDrawer(); }
      else if (c === 'openDrawer' && a) { window.openNotifDrawer(a); }
      else if (c === 'markRead' && a) { window.markReadNotif(a); }
      else if (c === 'markUnread' && a) { window.markUnreadNotif(a); }
      else if (c === 'delete' && a) { window.deleteNotif(a); }
      else if (c === 'togglePin' && a) { window.togglePinNotif(a); }
      else if (c === 'share' && a) { window.shareNotif(a); }
      else if (c === 'togglePinClose' && a) { window.togglePinNotif(a); window.closeNotifDrawer(); }
      else if (c === 'shareClose' && a) { window.shareNotif(a); window.closeNotifDrawer(); }
      else if (c === 'toggleGroup' && a) { window.toggleGroup(a); }
      else if (c === 'toggleSelectMode') { window.toggleSelectMode(); }
      else if (c === 'markAllRead') { window.markAllNotifRead(); }
      else if (c === 'clearAll') { window.clearAllNotif(); }
      else if (c === 'deleteAllRead') { window.deleteAllReadNotif(); }
      else if (c === 'switchTab' && a) { window.switchNotifTab(a); }
      else if (c === 'bulkMarkRead') { window.bulkMarkRead(); }
      else if (c === 'bulkDelete') { window.bulkDelete(); }
      else if (c === 'bulkPin') { window.bulkPin(); }
      else if (c === 'deselectAll') { window.deselectAll(); }
      else if (c === 'selectAllVisible') { window.selectAllVisible(); }
      else if (c === 'loadMore') { window.loadMoreNotif(); }
      else if (c === 'confirmOk') { if (_confirmResolve) { _confirmResolve(true); _confirmResolve = null; var co = document.getElementById('notif-confirm-overlay'); if (co) co.remove(); } }
      else if (c === 'confirmCancel') { if (_confirmResolve) { _confirmResolve(false); _confirmResolve = null; var co = document.getElementById('notif-confirm-overlay'); if (co) co.remove(); } }
    });
  }
  var store = window.Store;
  var utils = window.Utils;
  var mc = document.getElementById('main-content');
  if (!mc) return;

  var activeTab = 'all';
  var searchQuery = '';
  var categoryFilter = '';
  var dateFilter = 'all';
  var readFilter = 'all';
  var sortOrder = 'newest';
  var selectMode = false;
  var selectedIds = {};
  var currentPage = 1;
  var pageSize = 20;
  var openDrawerId = null;
  var groupCollapsed = {};
  var _confirmResolve = null;

  function es(icon, title, msg) {
    return '<div class="empty-state" style="text-align:center;padding:40px 20px"><div class="empty-state-icon" style="font-size:3rem;margin-bottom:16px">' + icon + '</div><div class="empty-state-title" style="font-size:1.1rem;font-weight:600;color:var(--text-primary);margin-bottom:8px">' + title + '</div><div class="empty-state-text" style="font-size:0.875rem;color:var(--text-secondary)">' + msg + '</div></div>';
  }

  var typeConfig = {
    achievement: { icon: '🏆', color: 'rgba(245,158,11,0.15)', border: 'rgba(245,158,11,0.3)', label: 'Achievement' },
    quiz: { icon: '📝', color: 'rgba(59,130,246,0.15)', border: 'rgba(59,130,246,0.3)', label: 'Quiz' },
    exam: { icon: '📋', color: 'rgba(239,68,68,0.15)', border: 'rgba(239,68,68,0.3)', label: 'Exam' },
    community: { icon: '💬', color: 'rgba(16,185,129,0.15)', border: 'rgba(16,185,129,0.3)', label: 'Community' },
    scholarship: { icon: '🎓', color: 'rgba(139,92,246,0.15)', border: 'rgba(139,92,246,0.3)', label: 'Scholarship' },
    system: { icon: '⚙️', color: 'rgba(100,116,139,0.15)', border: 'rgba(100,116,139,0.3)', label: 'System' },
    announcement: { icon: '📢', color: 'rgba(139,92,246,0.15)', border: 'rgba(139,92,246,0.3)', label: 'Announcement' },
    meeting: { icon: '🎥', color: 'rgba(6,182,212,0.15)', border: 'rgba(6,182,212,0.3)', label: 'Meeting' },
    calendar: { icon: '📅', color: 'rgba(251,146,60,0.15)', border: 'rgba(251,146,60,0.3)', label: 'Calendar' },
    marketplace: { icon: '🛍️', color: 'rgba(236,72,153,0.15)', border: 'rgba(236,72,153,0.3)', label: 'Marketplace' },
    study: { icon: '📚', color: 'rgba(59,130,246,0.15)', border: 'rgba(59,130,246,0.3)', label: 'Study' },
    assignment: { icon: '📄', color: 'rgba(251,146,60,0.15)', border: 'rgba(251,146,60,0.3)', label: 'Assignment' }
  };

  var actionConfig = {
    achievement: { label: 'View Achievement', link: '/profile' },
    quiz: { label: 'Open Quiz', link: '/quizzes' },
    exam: { label: 'View Exam', link: '/exams' },
    community: { label: 'Open Discussion', link: '/community' },
    scholarship: { label: 'View Scholarship', link: '/scholarship' },
    system: { label: 'Go to Settings', link: '/settings' },
    announcement: { label: 'View Details', link: '' },
    meeting: { label: 'Join Meeting', link: '/live-classes' },
    calendar: { label: 'View Schedule', link: '/schedule' },
    marketplace: { label: 'View Item', link: '/marketplace' },
    study: { label: 'View Dashboard', link: '/dashboard' },
    assignment: { label: 'View Assignment', link: '/assignments' }
  };

  function generateMockNotifications() {
    var mocks = [
      { id: 'm1', type: 'achievement', title: 'Quick Learner Badge Unlocked', message: 'You completed 5 lessons in a single day! Keep up the great momentum.', time: new Date(Date.now() - 30 * 60000).toISOString(), read: false, pinned: false, snoozedUntil: null, link: '/profile', category: 'Achievement' },
      { id: 'm2', type: 'quiz', title: 'Mathematics Quiz Result', message: 'You scored 8/10 on "Quadratic Equations" quiz. Great improvement!', time: new Date(Date.now() - 2 * 3600000).toISOString(), read: false, pinned: false, snoozedUntil: null, link: '/quizzes', category: 'Quiz' },
      { id: 'm3', type: 'exam', title: 'Physics Mock Test Tomorrow', message: 'Your Physics Mock Test "Electrostatics" is scheduled for tomorrow at 10:00 AM.', time: new Date(Date.now() - 4 * 3600000).toISOString(), read: false, pinned: false, snoozedUntil: null, link: '/exams', category: 'Exam' },
      { id: 'm4', type: 'community', title: 'New Reply on Your Post', message: 'Priya responded to your discussion "Best ways to memorize formulas?" with a helpful tip.', time: new Date(Date.now() - 8 * 3600000).toISOString(), read: false, pinned: true, snoozedUntil: null, link: '/community', category: 'Community' },
      { id: 'm5', type: 'scholarship', title: 'Scholarship Deadline Approaching', message: 'The "Future Scientists" scholarship application closes in 3 days. Apply now!', time: new Date(Date.now() - 12 * 3600000).toISOString(), read: false, pinned: false, snoozedUntil: null, link: '/scholarship', category: 'Scholarship' },
      { id: 'm6', type: 'system', title: 'Account Security Update', message: 'Your account was logged in from a new device. If this was not you, change your password immediately.', time: new Date(Date.now() - 18 * 3600000).toISOString(), read: false, pinned: false, snoozedUntil: null, link: '/settings', category: 'System' },
      { id: 'm7', type: 'announcement', title: 'New Course: Advanced Calculus', message: 'We have added a new Advanced Calculus course for Class 12 Science students. Enroll now!', time: new Date(Date.now() - 24 * 3600000).toISOString(), read: false, pinned: false, snoozedUntil: null, link: '/marketplace', category: 'Announcement' },
      { id: 'm8', type: 'meeting', title: 'Live Class: Trigonometry Masterclass', message: 'Your live class with Prof. Sharma starts in 30 minutes. Join the meeting room now!', time: new Date(Date.now() - 26 * 3600000).toISOString(), read: false, pinned: false, snoozedUntil: null, link: '/live-classes', category: 'Meeting' },
      { id: 'm9', type: 'calendar', title: 'Study Session Reminder', message: 'You have a scheduled study session "Chemistry - Organic Reactions" at 4:00 PM today.', time: new Date(Date.now() - 28 * 3600000).toISOString(), read: false, pinned: false, snoozedUntil: null, link: '/schedule', category: 'Calendar' },
      { id: 'm10', type: 'marketplace', title: 'Item on Your Wishlist is on Sale', message: '"Complete Physics Bundle" is now 30% off! Limited time offer.', time: new Date(Date.now() - 30 * 3600000).toISOString(), read: false, pinned: false, snoozedUntil: null, link: '/marketplace', category: 'Marketplace' },
      { id: 'm11', type: 'study', title: 'Daily Study Goal Achieved', message: 'You studied for 2 hours and 15 minutes today. You have completed your daily goal!', time: new Date(Date.now() - 36 * 3600000).toISOString(), read: true, pinned: false, snoozedUntil: null, link: '/dashboard', category: 'Study' },
      { id: 'm12', type: 'assignment', title: 'New Assignment: Biology Lab Report', message: 'Your Biology teacher has posted a new assignment "Cell Division Lab Report". Due in 5 days.', time: new Date(Date.now() - 40 * 3600000).toISOString(), read: false, pinned: false, snoozedUntil: null, link: '/assignments', category: 'Assignment' },
      { id: 'm13', type: 'achievement', title: 'Streak Master: 7 Days!', message: 'You maintained a 7-day study streak! You earned the "Streak Master" badge.', time: new Date(Date.now() - 48 * 3600000).toISOString(), read: true, pinned: false, snoozedUntil: null, link: '/profile', category: 'Achievement' },
      { id: 'm14', type: 'quiz', title: 'Chemistry Quiz Available', message: 'A new quiz "Periodic Table Trends" is now available. Test your knowledge!', time: new Date(Date.now() - 52 * 3600000).toISOString(), read: false, pinned: false, snoozedUntil: null, link: '/quizzes', category: 'Quiz' },
      { id: 'm15', type: 'community', title: 'Your Post Received 15 Likes!', message: 'Your study guide "Tips for Board Exam Preparation" is trending in the community.', time: new Date(Date.now() - 60 * 3600000).toISOString(), read: true, pinned: false, snoozedUntil: null, link: '/community', category: 'Community' },
      { id: 'm16', type: 'system', title: 'Profile Updated Successfully', message: 'Your profile information and preferences have been updated.', time: new Date(Date.now() - 72 * 3600000).toISOString(), read: true, pinned: false, snoozedUntil: null, link: '/profile', category: 'System' },
      { id: 'm17', type: 'announcement', title: 'Platform Maintenance Tonight', message: 'Scheduled maintenance from 2 AM to 4 AM. The platform may be temporarily unavailable.', time: new Date(Date.now() - 78 * 3600000).toISOString(), read: true, pinned: false, snoozedUntil: null, link: '', category: 'Announcement' },
      { id: 'm18', type: 'meeting', title: 'Doubt Session Rescheduled', message: 'Your doubt-clearing session with Dr. Verma has been moved to Friday 5:00 PM.', time: new Date(Date.now() - 84 * 3600000).toISOString(), read: true, pinned: false, snoozedUntil: null, link: '/live-classes', category: 'Meeting' },
      { id: 'm19', type: 'study', title: 'Weekly Study Report', message: 'You studied 12 hours this week! That is 20% more than last week. Great improvement!', time: new Date(Date.now() - 96 * 3600000).toISOString(), read: true, pinned: false, snoozedUntil: null, link: '/analytics', category: 'Study' },
      { id: 'm20', type: 'assignment', title: 'Assignment Graded: English Essay', message: 'Your English essay "The Impact of Technology" has been graded. You scored 85/100.', time: new Date(Date.now() - 100 * 3600000).toISOString(), read: false, pinned: false, snoozedUntil: null, link: '/assignments', category: 'Assignment' },
      { id: 'm21', type: 'scholarship', title: 'Scholarship Application Received', message: 'Your application for the "National Merit Scholarship" has been received and is under review.', time: new Date(Date.now() - 108 * 3600000).toISOString(), read: true, pinned: false, snoozedUntil: null, link: '/scholarship', category: 'Scholarship' },
      { id: 'm22', type: 'calendar', title: 'Exam Schedule Published', message: 'Your final exam schedule for Class 12 has been published. Check the dates now.', time: new Date(Date.now() - 120 * 3600000).toISOString(), read: false, pinned: false, snoozedUntil: null, link: '/schedule', category: 'Calendar' },
      { id: 'm23', type: 'marketplace', title: 'Free Resource Available', message: 'New free study material "Organic Chemistry Mind Maps" has been added to the marketplace.', time: new Date(Date.now() - 132 * 3600000).toISOString(), read: true, pinned: false, snoozedUntil: null, link: '/marketplace', category: 'Marketplace' },
      { id: 'm24', type: 'achievement', title: 'Top Performer of the Week', message: 'You ranked in the top 10% of all learners this week! Outstanding performance!', time: new Date(Date.now() - 144 * 3600000).toISOString(), read: false, pinned: false, snoozedUntil: null, link: '/profile', category: 'Achievement' },
      { id: 'm25', type: 'exam', title: 'Practice Test: Biology', message: 'A new practice test "Genetics & Evolution" is available. Take it to assess your preparation.', time: new Date(Date.now() - 156 * 3600000).toISOString(), read: true, pinned: false, snoozedUntil: null, link: '/exams', category: 'Exam' },
      { id: 'm26', type: 'community', title: 'You Were Mentioned in a Post', message: 'Rahul mentioned you in a post about "Effective Revision Techniques."', time: new Date(Date.now() - 168 * 3600000).toISOString(), read: false, pinned: false, snoozedUntil: null, link: '/community', category: 'Community' },
      { id: 'm27', type: 'system', title: 'New Feature: AI Study Planner', message: 'We have launched the AI Study Planner! Create personalized study plans with artificial intelligence.', time: new Date(Date.now() - 180 * 3600000).toISOString(), read: false, pinned: true, snoozedUntil: null, link: '/ai-route', category: 'System' },
      { id: 'm28', type: 'study', title: 'Recommended: Focus Session', message: 'Based on your study pattern, a 45-minute focus session on "Calculus" is recommended now.', time: new Date(Date.now() - 192 * 3600000).toISOString(), read: true, pinned: false, snoozedUntil: null, link: '/study-rooms', category: 'Study' },
      { id: 'm29', type: 'quiz', title: 'Quiz Reminder: History', message: 'Your "Modern Indian History" quiz is still pending. Complete it before the deadline!', time: new Date(Date.now() - 204 * 3600000).toISOString(), read: true, pinned: false, snoozedUntil: null, link: '/quizzes', category: 'Quiz' },
      { id: 'm30', type: 'announcement', title: 'Holiday Notice: Diwali Break', message: 'The platform will have reduced support during Diwali (Nov 12-16). All deadlines extended by 3 days.', time: new Date(Date.now() - 240 * 3600000).toISOString(), read: true, pinned: false, snoozedUntil: null, link: '', category: 'Announcement' },
      { id: 'm31', type: 'meeting', title: 'Group Study Invitation', message: 'You have been invited to join a group study session for "Organic Chemistry" on Saturday.', time: new Date(Date.now() - 264 * 3600000).toISOString(), read: true, pinned: false, snoozedUntil: null, link: '/study-rooms', category: 'Meeting' },
      { id: 'm32', type: 'achievement', title: 'Century Milestone: 100 Quizzes', message: 'You have completed 100 quizzes on EduMentee! You are a true knowledge seeker!', time: new Date(Date.now() - 300 * 3600000).toISOString(), read: false, pinned: false, snoozedUntil: null, link: '/profile', category: 'Achievement' },
      { id: 'm33', type: 'marketplace', title: 'New Arrival: Practice Workbooks', message: 'New practice workbooks for Physics, Chemistry, and Mathematics are now available.', time: new Date(Date.now() - 336 * 3600000).toISOString(), read: true, pinned: false, snoozedUntil: null, link: '/marketplace', category: 'Marketplace' },
      { id: 'm34', type: 'exam', title: 'Board Exam Registration Open', message: 'Registration for the final board examinations is now open. Complete your registration by Dec 15.', time: new Date(Date.now() - 408 * 3600000).toISOString(), read: true, pinned: false, snoozedUntil: null, link: '/exams', category: 'Exam' },
      { id: 'm35', type: 'achievement', title: 'Night Owl Badge', message: 'You studied past midnight for 3 consecutive days! The Night Owl badge is yours.', time: new Date(Date.now() - 44 * 3600000).toISOString(), read: false, pinned: false, snoozedUntil: null, link: '/profile', category: 'Achievement' },
      { id: 'm36', type: 'quiz', title: 'Physics Quiz: Optics', message: 'A new quiz on "Optics: Reflection & Refraction" is available. Test your understanding!', time: new Date(Date.now() - 50 * 3600000).toISOString(), read: false, pinned: false, snoozedUntil: null, link: '/quizzes', category: 'Quiz' },
      { id: 'm37', type: 'community', title: 'Study Group Invite', message: 'You have been invited to join "Board Exam 2025 Prep Group" by your classmate Ananya.', time: new Date(Date.now() - 55 * 3600000).toISOString(), read: false, pinned: false, snoozedUntil: null, link: '/community', category: 'Community' },
      { id: 'm38', type: 'study', title: 'Study Streak Alert', message: 'You are on a 5-day study streak! Keep going to unlock the Streak Master badge.', time: new Date(Date.now() - 38 * 3600000).toISOString(), read: false, pinned: false, snoozedUntil: null, link: '/dashboard', category: 'Study' },
      { id: 'm39', type: 'assignment', title: 'Math Assignment Due Tomorrow', message: 'Your "Calculus: Integration" assignment is due tomorrow at 11:59 PM.', time: new Date(Date.now() - 42 * 3600000).toISOString(), read: false, pinned: false, snoozedUntil: null, link: '/assignments', category: 'Assignment' },
      { id: 'm40', type: 'system', title: 'Storage Almost Full', message: 'Your account storage is at 85%. Consider clearing old files to free up space.', time: new Date(Date.now() - 70 * 3600000).toISOString(), read: true, pinned: false, snoozedUntil: null, link: '/settings', category: 'System' },
      { id: 'm41', type: 'achievement', title: 'Social Butterfly', message: 'You have participated in 10 community discussions! The Social Butterfly badge is unlocked.', time: new Date(Date.now() - 46 * 3600000).toISOString(), read: false, pinned: false, snoozedUntil: null, link: '/profile', category: 'Achievement' },
      { id: 'm42', type: 'study', title: 'Focus Score: 92%', message: 'Your focus score for this week is 92%. You are in the top 5% of focused learners!', time: new Date(Date.now() - 34 * 3600000).toISOString(), read: false, pinned: false, snoozedUntil: null, link: '/analytics', category: 'Study' },
      { id: 'm43', type: 'quiz', title: 'Biology Quiz: Genetics', message: 'A new quiz "Mendelian Genetics" is now available. Score above 80% to earn a bonus badge!', time: new Date(Date.now() - 54 * 3600000).toISOString(), read: false, pinned: false, snoozedUntil: null, link: '/quizzes', category: 'Quiz' },
      { id: 'm44', type: 'meeting', title: 'Revision Class: Physics', message: 'A revision class for "Electrostatics & Magnetism" starts in 1 hour.', time: new Date(Date.now() - 22 * 3600000).toISOString(), read: false, pinned: false, snoozedUntil: null, link: '/live-classes', category: 'Meeting' },
      { id: 'm45', type: 'achievement', title: 'Perfect Score: Mathematics', message: 'You scored 100% on the "Advanced Calculus" quiz! Perfect Score badge earned.', time: new Date(Date.now() - 130 * 3600000).toISOString(), read: true, pinned: false, snoozedUntil: null, link: '/profile', category: 'Achievement' },
      { id: 'm46', type: 'community', title: 'Tip of the Day', message: 'Community tip: Use spaced repetition for better long-term retention of concepts.', time: new Date(Date.now() - 14 * 3600000).toISOString(), read: false, pinned: false, snoozedUntil: null, link: '/community', category: 'Community' },
      { id: 'm47', type: 'marketplace', title: 'Flash Sale: Workbooks', message: 'All practice workbooks are at 50% off for the next 24 hours. Grab your copies!', time: new Date(Date.now() - 32 * 3600000).toISOString(), read: false, pinned: false, snoozedUntil: null, link: '/marketplace', category: 'Marketplace' },
      { id: 'm48', type: 'exam', title: 'Mock Test: Chemistry', message: 'Full syllabus mock test for Chemistry is now available. Take it to assess your readiness.', time: new Date(Date.now() - 160 * 3600000).toISOString(), read: true, pinned: false, snoozedUntil: null, link: '/exams', category: 'Exam' },
      { id: 'm49', type: 'system', title: 'Weekly Digest Available', message: 'Your weekly learning digest is ready. See your progress, streaks, and recommendations.', time: new Date(Date.now() - 6 * 3600000).toISOString(), read: false, pinned: false, snoozedUntil: null, link: '/analytics', category: 'System' },
      { id: 'm50', type: 'achievement', title: 'Marathon Learner', message: 'You completed 50 hours of learning this month! Marathon Learner badge unlocked!', time: new Date(Date.now() - 3 * 3600000).toISOString(), read: false, pinned: false, snoozedUntil: null, link: '/profile', category: 'Achievement' }
    ];
    return mocks;
  }

  function loadNotifications() {
    var data = store.get('notifications');
    if (!data || data.length === 0) {
      data = generateMockNotifications();
      store.set('notifications', data);
    } else {
      for (var i = 0; i < data.length; i++) {
        if (data[i].pinned === undefined) data[i].pinned = false;
        if (data[i].snoozedUntil === undefined) data[i].snoozedUntil = null;
      }
    }
    return data;
  }

  var notifications = loadNotifications();

  function saveAndSync(data) {
    store.set('notifications', data);
    notifications = data;
    updateHeaderBadge();
  }

  function showToast(message, type) {
    type = type || 'info';
    var existing = document.querySelector('.custom-toast');
    if (existing) existing.remove();
    var toast = document.createElement('div');
    toast.className = 'custom-toast';
    var bgColor = type === 'success' ? 'rgba(16,185,129,0.95)' : type === 'error' ? 'rgba(239,68,68,0.95)' : 'rgba(59,130,246,0.95)';
    toast.style.cssText = 'position:fixed;bottom:24px;right:24px;padding:12px 20px;border-radius:12px;background:' + bgColor + ';color:#fff;font-size:0.85rem;font-weight:500;z-index:99999;box-shadow:0 8px 32px rgba(0,0,0,0.3);animation:fadeInUp 0.3s ease;max-width:360px';
    toast.textContent = message;
    document.body.appendChild(toast);
    setTimeout(function() {
      toast.style.opacity = '0';
      toast.style.transition = 'opacity 0.3s';
      setTimeout(function() { toast.remove(); }, 300);
    }, 2500);
  }

  function confirmDialog(message, confirmText, cancelText) {
    confirmText = confirmText || 'Yes';
    cancelText = cancelText || 'Cancel';
    var overlay = document.createElement('div');
    overlay.id = 'notif-confirm-overlay';
    overlay.style.cssText = 'position:fixed;inset:0;background:rgba(0,0,0,0.6);z-index:99999;display:flex;align-items:center;justify-content:center;animation:fadeIn 0.2s ease';
    var box = document.createElement('div');
    box.style.cssText = 'background:var(--bg-card);border:1px solid var(--border-color);border-radius:var(--radius-lg);padding:var(--space-8);max-width:400px;width:90%;text-align:center';
    box.innerHTML = '<div style="font-size:2rem;margin-bottom:var(--space-4)">⚠️</div><div style="font-size:var(--text-lg);font-weight:600;margin-bottom:var(--space-2)">' + message + '</div><div style="display:flex;gap:var(--space-3);justify-content:center;margin-top:var(--space-6)">\
      <button class="btn btn-secondary btn-sm" data-action="notif:confirmCancel">' + cancelText + '</button>\
      <button class="btn btn-danger btn-sm" data-action="notif:confirmOk">' + confirmText + '</button>\
    </div>';
    overlay.appendChild(box);
    document.body.appendChild(overlay);
    return new Promise(function(resolve) {
      _confirmResolve = resolve;
      overlay.onclick = function(e) { if (e.target === overlay) { _confirmResolve(false); _confirmResolve = null; overlay.remove(); } };
    });
  }

  function updateHeaderBadge() {
    var unread = notifications.filter(function(n) { return !n.read; }).length;
    var headerBtn = document.querySelector('.header-btn[title="Notifications"]');
    if (headerBtn) {
      var badge = headerBtn.querySelector('.notif-badge');
      if (unread > 0) {
        if (badge) {
          badge.textContent = unread;
        } else {
          var newBadge = document.createElement('span');
          newBadge.className = 'notif-badge';
          newBadge.textContent = unread;
          headerBtn.appendChild(newBadge);
        }
      } else {
        if (badge) badge.remove();
      }
    }
    var dot = document.getElementById('notif-dot');
    if (dot) dot.style.display = unread > 0 ? 'block' : 'none';
  }

  function escapeHtml(str) {
    if (!str) return '';
    return String(str).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#039;');
  }

  function safeStr(str) {
    return utils.sanitizeHTML ? utils.sanitizeHTML(str) : escapeHtml(str);
  }

  function highlightText(text, query) {
    if (!query || !text) return safeStr(text);
    var safe = safeStr(text);
    var q = query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    var parts = safe.split(new RegExp('(' + q + ')', 'gi'));
    for (var i = 1; i < parts.length; i += 2) {
      parts[i] = '<mark class="search-highlight">' + parts[i] + '</mark>';
    }
    return parts.join('');
  }

  function formatRelativeTime(time) {
    if (utils.formatRelativeTime) return utils.formatRelativeTime(time);
    var diff = Date.now() - new Date(time).getTime();
    var mins = Math.floor(diff / 60000);
    if (mins < 1) return 'Just now';
    if (mins < 60) return mins + 'm ago';
    var hours = Math.floor(mins / 60);
    if (hours < 24) return hours + 'h ago';
    var days = Math.floor(hours / 24);
    if (days < 7) return days + 'd ago';
    var d = new Date(time);
    return (d.getMonth() + 1) + '/' + d.getDate();
  }

  function getDateSeparator(time) {
    var now = new Date();
    var date = new Date(time);
    var today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    var yesterday = new Date(today.getTime() - 86400000);
    var weekStart = new Date(today.getTime() - today.getDay() * 86400000);
    var d = new Date(date.getFullYear(), date.getMonth(), date.getDate());
    var diffDays = Math.round((today - d) / 86400000);
    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Yesterday';
    if (d >= weekStart) return 'This Week';
    var months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    return months[date.getMonth()] + ' ' + date.getDate() + ', ' + date.getFullYear();
  }

  function getTabKeyCounts() {
    var all = notifications.length;
    var unread = 0;
    var study = 0;
    var community = 0;
    var achievements = 0;
    var system = 0;
    var readCount = 0;
    for (var i = 0; i < notifications.length; i++) {
      var n = notifications[i];
      if (!n.read) unread++;
      if (n.read) readCount++;
      var t = n.type;
      if (t === 'study' || t === 'exam' || t === 'quiz' || t === 'assignment') study++;
      else if (t === 'community') community++;
      else if (t === 'achievement') achievements++;
      else if (t === 'system' || t === 'announcement' || t === 'meeting' || t === 'calendar' || t === 'scholarship') system++;
    }
    return { all: all, unread: unread, read: readCount, study: study, community: community, achievements: achievements, system: system };
  }

  function isInDateRange(time, filter) {
    if (filter === 'all') return true;
    var now = new Date();
    var d = new Date(time);
    var today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    var notifDate = new Date(d.getFullYear(), d.getMonth(), d.getDate());
    if (filter === 'today') return notifDate.getTime() === today.getTime();
    if (filter === 'week') {
      var weekStart = new Date(today.getTime() - today.getDay() * 86400000);
      return notifDate.getTime() >= weekStart.getTime();
    }
    if (filter === 'month') {
      return notifDate.getMonth() === now.getMonth() && notifDate.getFullYear() === now.getFullYear();
    }
    return true;
  }

  function getFilteredData() {
    var data = notifications.filter(function(n) {
      if (n.snoozedUntil && new Date(n.snoozedUntil).getTime() > Date.now()) return false;
      return true;
    });
    if (activeTab === 'unread') data = data.filter(function(n) { return !n.read; });
    else if (activeTab === 'read') data = data.filter(function(n) { return n.read; });
    else if (activeTab === 'study') data = data.filter(function(n) { return n.type === 'study' || n.type === 'exam' || n.type === 'quiz' || n.type === 'assignment'; });
    else if (activeTab === 'community') data = data.filter(function(n) { return n.type === 'community'; });
    else if (activeTab === 'achievements') data = data.filter(function(n) { return n.type === 'achievement'; });
    else if (activeTab === 'system') data = data.filter(function(n) { return n.type === 'system' || n.type === 'announcement' || n.type === 'meeting' || n.type === 'calendar' || n.type === 'scholarship'; });
    if (searchQuery) {
      var q = searchQuery.toLowerCase();
      data = data.filter(function(n) { return n.title.toLowerCase().indexOf(q) !== -1 || n.message.toLowerCase().indexOf(q) !== -1; });
    }
    if (categoryFilter) {
      data = data.filter(function(n) { return n.type === categoryFilter; });
    }
    if (dateFilter !== 'all') {
      data = data.filter(function(n) { return isInDateRange(n.time, dateFilter); });
    }
    if (readFilter === 'read') {
      data = data.filter(function(n) { return n.read; });
    } else if (readFilter === 'unread') {
      data = data.filter(function(n) { return !n.read; });
    }
    data.sort(function(a, b) {
      var aPinned = a.pinned ? 1 : 0;
      var bPinned = b.pinned ? 1 : 0;
      if (aPinned !== bPinned) return bPinned - aPinned;
      if (sortOrder === 'oldest') return new Date(a.time).getTime() - new Date(b.time).getTime();
      return new Date(b.time).getTime() - new Date(a.time).getTime();
    });
    return data;
  }

  function buildGroups(data) {
    if (data.length === 0) return [];
    var result = [];
    var currentGroup = null;
    for (var i = 0; i < data.length; i++) {
      var n = data[i];
      if (currentGroup && n.type === currentGroup.type && (new Date(n.time).getTime() - new Date(currentGroup.lastTime).getTime()) <= 3600000) {
        currentGroup.items.push(n);
        currentGroup.lastTime = n.time;
      } else {
        if (currentGroup) {
          if (currentGroup.items.length > 1) {
            result.push({ isGroup: true, items: currentGroup.items, type: currentGroup.type });
          } else {
            result.push({ isGroup: false, item: currentGroup.items[0] });
          }
        }
        currentGroup = { type: n.type, items: [n], lastTime: n.time };
      }
    }
    if (currentGroup) {
      if (currentGroup.items.length > 1) {
        result.push({ isGroup: true, items: currentGroup.items, type: currentGroup.type });
      } else {
        result.push({ isGroup: false, item: currentGroup.items[0] });
      }
    }
    return result;
  }

  function getNotifById(id) {
    for (var i = 0; i < notifications.length; i++) {
      if (notifications[i].id === id) return notifications[i];
    }
    return null;
  }

  function markRead(id) {
    var n = getNotifById(id);
    if (n) {
      n.read = true;
      saveAndSync(notifications);
      render();
    }
  }

  function markUnread(id) {
    var n = getNotifById(id);
    if (n) {
      n.read = false;
      saveAndSync(notifications);
      render();
    }
  }

  function togglePin(id) {
    var n = getNotifById(id);
    if (n) {
      n.pinned = !n.pinned;
      saveAndSync(notifications);
      showToast(n.pinned ? 'Notification pinned' : 'Notification unpinned', 'success');
      render();
    }
  }

  function shareNotif(id) {
    var n = getNotifById(id);
    if (!n) return;
    var url = window.location.origin + (n.link || '/notifications');
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(url).then(function() {
        showToast('Link copied to clipboard!', 'success');
      }, function() {
        showToast('Failed to copy link', 'error');
      });
    } else {
      var ta = document.createElement('textarea');
      ta.value = url;
      ta.style.position = 'fixed';
      ta.style.opacity = '0';
      document.body.appendChild(ta);
      ta.select();
      try {
        document.execCommand('copy');
        showToast('Link copied to clipboard!', 'success');
      } catch (e) {
        showToast('Failed to copy link', 'error');
      }
      document.body.removeChild(ta);
    }
  }

  function snoozeNotif(id, duration) {
    var n = getNotifById(id);
    if (!n) return;
    var ms = 0;
    var label = '';
    if (duration === '1h') { ms = 3600000; label = '1 hour'; }
    else if (duration === 'tomorrow') { ms = 86400000; label = 'tomorrow'; }
    else if (duration === 'week') { ms = 604800000; label = 'next week'; }
    if (ms > 0) {
      n.snoozedUntil = new Date(Date.now() + ms).toISOString();
      saveAndSync(notifications);
      showToast('Snoozed for ' + label, 'success');
      render();
    }
  }

  function deleteNotif(id) {
    notifications = notifications.filter(function(n) { return n.id !== id; });
    if (selectedIds[id]) delete selectedIds[id];
    saveAndSync(notifications);
    render();
  }

  function openDrawer(id) {
    var n = getNotifById(id);
    if (!n) return;
    n.read = true;
    saveAndSync(notifications);
    renderDrawer(n);
    render();
  }

  function closeDrawer() {
    var drawer = document.getElementById('notif-drawer');
    var overlay = document.getElementById('notif-drawer-overlay');
    if (drawer) {
      drawer.style.transform = 'translateX(100%)';
      drawer.style.opacity = '0';
    }
    if (overlay) {
      overlay.style.opacity = '0';
    }
    setTimeout(function() {
      if (drawer) drawer.remove();
      if (overlay) overlay.remove();
    }, 300);
  }

  function renderDrawer(n) {
    var existingOverlay = document.getElementById('notif-drawer-overlay');
    var existingDrawer = document.getElementById('notif-drawer');
    if (existingOverlay) existingOverlay.remove();
    if (existingDrawer) existingDrawer.remove();
    var tc = typeConfig[n.type] || { icon: '🔔', color: 'var(--bg-glass)', border: 'transparent', label: 'Notification' };
    var ac = actionConfig[n.type] || { label: 'View Details', link: n.link || '' };
    var actionLink = n.link || ac.link;
    var overlay = document.createElement('div');
    overlay.id = 'notif-drawer-overlay';
    overlay.style.cssText = 'position:fixed;inset:0;background:rgba(0,0,0,0.5);z-index:99998;opacity:0;transition:opacity 0.3s ease';
    overlay.onclick = closeDrawer;
    document.body.appendChild(overlay);
    setTimeout(function() { overlay.style.opacity = '1'; }, 10);
    var drawer = document.createElement('div');
    drawer.id = 'notif-drawer';
    drawer.style.cssText = 'position:fixed;top:0;right:0;bottom:0;width:440px;max-width:100vw;background:var(--bg-card);border-left:1px solid var(--border-color);z-index:99999;transform:translateX(100%);opacity:0;transition:all 0.3s ease;overflow-y:auto;box-shadow:-4px 0 24px rgba(0,0,0,0.15)';
    var d = new Date(n.time);
    var dateStr = d.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
    var timeStr = d.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
    drawer.innerHTML = '<div style="padding:var(--space-6)">\
      <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:var(--space-6)">\
        <h2 style="font-size:var(--text-xl);font-weight:700;margin:0">Notification</h2>\
        <button data-action="notif:closeDrawer" style="width:36px;height:36px;border-radius:50%;border:none;background:var(--bg-glass);cursor:pointer;font-size:1.2rem;display:flex;align-items:center;justify-content:center;color:var(--text-secondary)">✕</button>\
      </div>\
      <div style="display:flex;align-items:center;gap:var(--space-3);margin-bottom:var(--space-5)">\
        <div style="width:48px;height:48px;border-radius:var(--radius-md);background:' + tc.color + ';border:1px solid ' + tc.border + ';display:flex;align-items:center;justify-content:center;font-size:1.5rem">' + tc.icon + '</div>\
        <div>\
          <div style="font-size:var(--text-sm);font-weight:600;color:var(--accent)">' + tc.label + '</div>\
          <div style="font-size:var(--text-xs);color:var(--text-tertiary)">' + dateStr + ' at ' + timeStr + '</div>\
        </div>\
      </div>\
      <h3 style="font-size:var(--text-lg);font-weight:600;margin:0 0 var(--space-3) 0;line-height:1.4">' + safeStr(n.title) + '</h3>\
      <p style="font-size:var(--text-sm);color:var(--text-secondary);line-height:1.7;margin:0 0 var(--space-6) 0">' + safeStr(n.message) + '</p>\
      <div style="display:flex;flex-wrap:wrap;gap:var(--space-2);margin-bottom:var(--space-6)">\
        <span style="padding:4px 12px;border-radius:999px;font-size:var(--text-xs);font-weight:500;background:var(--bg-glass);color:var(--text-secondary)">' + (n.read ? '✅ Read' : '🔵 Unread') + '</span>\
        <span style="padding:4px 12px;border-radius:999px;font-size:var(--text-xs);font-weight:500;background:var(--bg-glass);color:var(--text-secondary)">' + tc.icon + ' ' + tc.label + '</span>\
        ' + (n.pinned ? '<span style="padding:4px 12px;border-radius:999px;font-size:var(--text-xs);font-weight:500;background:var(--bg-glass);color:var(--text-secondary)">📌 Pinned</span>' : '') + '\
      </div>\
      ' + (actionLink ? '<a href="' + actionLink + '" class="btn btn-primary btn-sm" style="text-decoration:none;display:inline-flex;align-items:center;gap:6px;width:100%;justify-content:center" data-action="notif:closeDrawer">' + ac.label + ' →</a>' : '') + '\
      <div style="margin-top:var(--space-4);padding-top:var(--space-4);border-top:1px solid var(--border-color)">\
        <div style="display:flex;gap:var(--space-2)">\
          <button class="btn btn-secondary btn-sm" data-action="notif:togglePinClose:' + n.id + '" style="flex:1">' + (n.pinned ? '📌 Unpin' : '📌 Pin') + '</button>\
          <button class="btn btn-secondary btn-sm" data-action="notif:shareClose:' + n.id + '" style="flex:1">🔗 Share</button>\
        </div>\
      </div>\
    </div>';
    document.body.appendChild(drawer);
    setTimeout(function() {
      drawer.style.transform = 'translateX(0)';
      drawer.style.opacity = '1';
    }, 20);
  }

  function renderSkeleton() {
    var items = '';
    for (var i = 0; i < 6; i++) {
      items += '<div class="notification-item" style="border:none;padding:16px 20px">\
        <div class="notification-icon" style="background:transparent">\
          <div class="skeleton skeleton-circle" style="width:44px;height:44px"></div>\
        </div>\
        <div class="notification-content">\
          <div class="skeleton skeleton-text skeleton-text-lg" style="margin-bottom:6px"></div>\
          <div class="skeleton skeleton-text skeleton-text-sm"></div>\
        </div>\
      </div>';
    }
    return '<div class="notifications-page">\
      <div class="page-header"><div><div class="skeleton" style="width:200px;height:32px;margin-bottom:8px"></div><div class="skeleton" style="width:300px;height:16px"></div></div></div>\
      <div class="notifications-list glass-card">' + items + '</div>\
    </div>';
  }

  function renderEmpty(tab, search) {
    var configs = {
      all: { icon: '🔔', title: 'No Notifications', text: 'You\'re all caught up! Come back later for updates.' },
      unread: { icon: '📭', title: 'No Unread Notifications', text: 'You\'ve read all your notifications. Great job staying on top of things!' },
      read: { icon: '✅', title: 'No Read Notifications', text: 'You haven\'t read any notifications yet.' },
      study: { icon: '📚', title: 'No Study Notifications', text: 'No study-related notifications at the moment.' },
      community: { icon: '💬', title: 'No Community Notifications', text: 'No community activity to show yet.' },
      achievements: { icon: '🏆', title: 'No Achievement Notifications', text: 'Complete lessons and quizzes to earn achievements!' },
      system: { icon: '⚙️', title: 'No System Notifications', text: 'No system updates or announcements.' }
    };
    var cfg = configs[tab] || configs.all;
    if (search) {
      cfg = { icon: '🔍', title: 'No Results Found', text: 'No notifications match your search "' + safeStr(search) + '". Try different keywords.' };
    }
    var illustration = cfg.icon === '🔍' ? '🔍' : '📋';
    return '<div class="empty-state" style="text-align:center;padding:var(--space-12) var(--space-4)">\
      <div style="font-size:4rem;margin-bottom:var(--space-4);opacity:0.5">' + illustration + '</div>\
      <div style="width:120px;height:120px;border-radius:50%;background:var(--bg-glass);display:flex;align-items:center;justify-content:center;margin:0 auto var(--space-5);font-size:3.5rem">' + cfg.icon + '</div>\
      <h2 style="font-size:var(--text-xl);font-weight:600;margin:0 0 var(--space-2)">' + cfg.title + '</h2>\
      <p style="font-size:var(--text-sm);color:var(--text-tertiary);max-width:360px;margin:0 auto;line-height:1.6">' + cfg.text + '</p>\
    </div>';
  }

  function renderNotifCard(n, index) {
    var tc = typeConfig[n.type] || { icon: '🔔', color: 'var(--bg-glass)', border: 'transparent' };
    var timeStr = formatRelativeTime(n.time);
    var highlightedTitle = searchQuery ? highlightText(n.title, searchQuery) : safeStr(n.title);
    var highlightedMsg = searchQuery ? highlightText(n.message, searchQuery) : safeStr(n.message);
    var isSelected = selectedIds[n.id] ? true : false;
    var checkboxHtml = selectMode ? '<div style="display:flex;align-items:center;padding-right:var(--space-2)">\
      <input type="checkbox" class="notif-checkbox" ' + (isSelected ? 'checked' : '') + ' onchange="window.toggleSelectNotif(\'' + n.id + '\', this.checked)" data-action="notif:noop" style="width:18px;height:18px;cursor:pointer;accent-color:var(--accent)">\
    </div>' : '';
    var pinIcon = n.pinned ? '📌' : '📌';
    var pinTitle = n.pinned ? 'Unpin' : 'Pin';
    var readIcon = n.read ? '🔵' : '✅';
    var readTitle = n.read ? 'Mark Unread' : 'Mark Read';
    var readAction = n.read ? 'window.markUnreadNotif' : 'window.markReadNotif';
    return '<div class="notification-item' + (n.read ? '' : ' unread') + (n.pinned ? ' pinned' : '') + (isSelected ? ' selected' : '') + ' animate-fadeInUp" data-id="' + n.id + '" style="animation-delay:' + (index * 0.03) + 's;cursor:pointer;' + (n.pinned ? 'border-top:2px solid var(--accent);' : '') + '" data-action="notif:openDrawer:' + n.id + '">\
      ' + checkboxHtml + '\
      <div class="notification-icon" style="background:' + tc.color + ';border-color:' + tc.border + ';position:relative">\
        ' + tc.icon + '\
        ' + (n.pinned ? '<span style="position:absolute;top:-6px;right:-6px;font-size:0.7rem">📌</span>' : '') + '\
      </div>\
      <div class="notification-content" style="flex:1;min-width:0">\
        <div class="flex items-center justify-between" style="margin-bottom:4px">\
          <div class="notification-title" style="display:flex;align-items:center;gap:var(--space-2)">\
            ' + highlightedTitle + '\
            <span class="notification-type-badge" style="font-size:0.65rem;padding:1px 6px;border-radius:999px;background:var(--bg-glass);color:var(--text-tertiary);white-space:nowrap">' + tc.icon + ' ' + tc.label + '</span>\
            <span class="c-fs-xs c-text-tertiary">ID: NOTIF-' + n.id + '</span>\
          </div>\
          <div class="flex items-center" style="gap:4px;flex-shrink:0">\
            ' + (n.read ? '' : '<span class="notification-dot"></span>') + '\
            <span class="notification-time">' + timeStr + '</span>\
            <button class="notification-delete" data-action="notif:delete:' + n.id + '" title="Delete notification">✕</button>\
          </div>\
        </div>\
        <div class="notification-message" style="margin-bottom:var(--space-2)">' + highlightedMsg + '</div>\
        <div class="notif-quick-actions" style="display:flex;gap:4px;opacity:0;transition:opacity 0.15s" onmouseover="this.style.opacity=1" onmouseout="this.style.opacity=0">\
          <button class="notif-quick-btn" data-action="notif:' + (n.read ? 'markUnread' : 'markRead') + ':' + n.id + '" title="' + readTitle + '" style="padding:2px 6px;border:none;border-radius:4px;background:var(--bg-glass);cursor:pointer;font-size:0.75rem">' + readIcon + '</button>\
          <button class="notif-quick-btn" data-action="notif:togglePin:' + n.id + '" title="' + pinTitle + '" style="padding:2px 6px;border:none;border-radius:4px;background:var(--bg-glass);cursor:pointer;font-size:0.75rem">📌</button>\
          <button class="notif-quick-btn" data-action="notif:share:' + n.id + '" title="Share" style="padding:2px 6px;border:none;border-radius:4px;background:var(--bg-glass);cursor:pointer;font-size:0.75rem">🔗</button>\
          <select class="notif-quick-btn" onchange="event.stopPropagation();window.snoozeNotif(\'' + n.id + '\', this.value);this.value=\'\'" title="Snooze" style="padding:2px 4px;border:none;border-radius:4px;background:var(--bg-glass);cursor:pointer;font-size:0.7rem;appearance:none;-webkit-appearance:none;color:var(--text-secondary)" data-action="notif:noop">\
            <option value="">⏰</option>\
            <option value="1h">1 Hour</option>\
            <option value="tomorrow">Tomorrow</option>\
            <option value="week">Next Week</option>\
          </select>\
        </div>\
      </div>\
    </div>';
  }

  function renderGroupHeader(group, index) {
    var tc = typeConfig[group.type] || { icon: '🔔', label: 'Notification' };
    var groupKey = 'g_' + group.type + '_' + index;
    var isCollapsed = groupCollapsed[groupKey] ? true : false;
    var firstItem = group.items[0];
    var lastItem = group.items[group.items.length - 1];
    var timeRange = formatRelativeTime(firstItem.time) + ' - ' + formatRelativeTime(lastItem.time);
    return '<div class="notif-group" data-group-key="' + groupKey + '" style="margin-bottom:var(--space-1)">\
      <div class="notif-group-header" data-action="notif:toggleGroup:' + groupKey.replace(/'/g, "\\'") + '" style="display:flex;align-items:center;gap:var(--space-3);padding:var(--space-3) var(--space-4);cursor:pointer;border-radius:var(--radius-md);background:var(--bg-glass);margin:var(--space-2) 0;transition:background 0.15s">\
        <span style="transform:rotate(' + (isCollapsed ? '0' : '90') + 'deg);transition:transform 0.2s;font-size:0.75rem;color:var(--text-tertiary)">▶</span>\
        <span style="font-size:1rem">' + tc.icon + '</span>\
        <div style="flex:1">\
          <span style="font-weight:600;font-size:var(--text-sm)">' + group.items.length + ' new ' + tc.label + (group.items.length > 1 ? 's' : '') + '</span>\
          <span style="font-size:var(--text-xs);color:var(--text-tertiary);margin-left:var(--space-2)">' + timeRange + '</span>\
        </div>\
        <span style="font-size:var(--text-xs);color:var(--text-tertiary)">' + (isCollapsed ? 'Expand' : 'Collapse') + '</span>\
      </div>\
      <div class="notif-group-items" style="' + (isCollapsed ? 'display:none' : '') + '">';
  }

  function renderGroupFooter() {
    return '</div></div>';
  }

  function render() {
    mc.innerHTML = renderSkeleton();

    setTimeout(function() {
      var data = getFilteredData();
      var counts = getTabKeyCounts();
      var totalFiltered = data.length;
      var selectedCount = 0;
      for (var sid in selectedIds) {
        if (selectedIds[sid]) selectedCount++;
      }
      var h = '';

      h += '<div class="notifications-page">';

      h += '<div class="page-header">\
        <div>\
          <h1 class="page-title">Notifications</h1>\
          <p class="page-subtitle">Stay updated with your learning journey</p>\
        </div>\
        <div class="flex gap-3" style="flex-wrap:wrap">\
          <button class="btn btn-secondary btn-sm" data-action="notif:toggleSelectMode" title="Toggle select mode">\
            ' + (selectMode ? '☑️ Exit Select' : '☐ Select') + '\
          </button>\
          <button class="btn btn-secondary btn-sm" data-action="notif:markAllRead">✓ Mark All Read</button>\
          <button class="btn btn-secondary btn-sm" data-action="notif:clearAll">🗑️ Clear All</button>\
          <button class="btn btn-secondary btn-sm" data-action="notif:deleteAllRead">✕ Delete Read</button>\
        </div>\
      </div>';

      h += '<div class="notif-controls" style="display:flex;gap:var(--space-2);margin-bottom:var(--space-4);flex-wrap:wrap;align-items:center">\
        <div style="position:relative;flex:1;min-width:180px">\
          <svg class="search-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="position:absolute;left:12px;top:50%;transform:translateY(-50%);color:var(--text-tertiary);pointer-events:none"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>\
          <input type="text" class="input-field" id="notif-search" placeholder="Search notifications..." value="' + safeStr(searchQuery) + '" style="padding-left:36px;padding-right:8px;font-size:0.85rem" oninput="window.searchNotif(this.value)">\
        </div>\
        <select class="input-field" id="notif-date-filter" style="min-width:120px;cursor:pointer;font-size:0.85rem" onchange="window.setDateFilter(this.value)">\
          <option value="all"' + (dateFilter === 'all' ? ' selected' : '') + '>All Time</option>\
          <option value="today"' + (dateFilter === 'today' ? ' selected' : '') + '>Today</option>\
          <option value="week"' + (dateFilter === 'week' ? ' selected' : '') + '>This Week</option>\
          <option value="month"' + (dateFilter === 'month' ? ' selected' : '') + '>This Month</option>\
        </select>\
        <select class="input-field" id="notif-read-filter" style="min-width:100px;cursor:pointer;font-size:0.85rem" onchange="window.setReadFilter(this.value)">\
          <option value="all"' + (readFilter === 'all' ? ' selected' : '') + '>All</option>\
          <option value="read"' + (readFilter === 'read' ? ' selected' : '') + '>Read</option>\
          <option value="unread"' + (readFilter === 'unread' ? ' selected' : '') + '>Unread</option>\
        </select>\
        <select class="input-field" id="notif-sort" style="min-width:120px;cursor:pointer;font-size:0.85rem" onchange="window.setSortOrder(this.value)">\
          <option value="newest"' + (sortOrder === 'newest' ? ' selected' : '') + '>Newest First</option>\
          <option value="oldest"' + (sortOrder === 'oldest' ? ' selected' : '') + '>Oldest First</option>\
        </select>\
      </div>';

      var tabs = [
        { key: 'all', label: 'All' },
        { key: 'unread', label: 'Unread' },
        { key: 'read', label: 'Read' },
        { key: 'study', label: 'Study' },
        { key: 'community', label: 'Community' },
        { key: 'achievements', label: 'Achievements' },
        { key: 'system', label: 'System' }
      ];
      h += '<div class="tabs" id="notif-tabs" style="margin-bottom:var(--space-4)">';
      for (var ti = 0; ti < tabs.length; ti++) {
        var count = counts[tabs[ti].key] || 0;
        h += '<div class="tab' + (activeTab === tabs[ti].key ? ' active' : '') + '" data-tab="' + tabs[ti].key + '" data-action="notif:switchTab:' + tabs[ti].key + '">\
          ' + tabs[ti].label + '\
          <span class="tab-count" style="font-size:0.7rem;opacity:0.7;margin-left:4px">(' + count + ')</span>\
        </div>';
      }
      h += '</div>';

      if (selectMode && selectedCount > 0) {
        h += '<div class="bulk-action-bar" style="display:flex;align-items:center;gap:var(--space-3);padding:var(--space-3) var(--space-4);background:var(--accent);color:#fff;border-radius:var(--radius-md);margin-bottom:var(--space-3);animation:slideDown 0.2s ease">\
          <span style="font-weight:600;font-size:var(--text-sm)">' + selectedCount + ' selected</span>\
          <div style="flex:1"></div>\
          <button class="btn btn-sm" style="background:rgba(255,255,255,0.2);color:#fff;border:1px solid rgba(255,255,255,0.3)" data-action="notif:bulkMarkRead">✓ Read</button>\
          <button class="btn btn-sm" style="background:rgba(255,255,255,0.2);color:#fff;border:1px solid rgba(255,255,255,0.3)" data-action="notif:bulkDelete">✕ Delete</button>\
          <button class="btn btn-sm" style="background:rgba(255,255,255,0.2);color:#fff;border:1px solid rgba(255,255,255,0.3)" data-action="notif:bulkPin">📌 Pin</button>\
          <button class="btn btn-sm" style="background:rgba(255,255,255,0.2);color:#fff;border:1px solid rgba(255,255,255,0.3)" data-action="notif:deselectAll">Deselect All</button>\
        </div>';
      } else if (selectMode) {
        h += '<div class="bulk-action-bar" style="display:flex;align-items:center;gap:var(--space-3);padding:var(--space-3) var(--space-4);background:var(--bg-glass);border:1px solid var(--border-color);border-radius:var(--radius-md);margin-bottom:var(--space-3);animation:slideDown 0.2s ease">\
          <span style="font-weight:500;font-size:var(--text-sm);color:var(--text-secondary)">Select notifications</span>\
          <div style="flex:1"></div>\
          <button class="btn btn-secondary btn-xs" data-action="notif:selectAllVisible">Select All</button>\
        </div>';
      }

      if (totalFiltered === 0) {
        h += renderEmpty(activeTab, searchQuery);
      } else {
        var displayData = data.slice(0, currentPage * pageSize);
        var grouped = buildGroups(displayData);
        h += '<div class="notifications-list glass-card">';
        var lastSeparator = '';
        for (var gi = 0; gi < grouped.length; gi++) {
          var entry = grouped[gi];
          if (entry.isGroup) {
            var firstItemTime = entry.items[0].time;
            var sep = getDateSeparator(firstItemTime);
            if (sep !== lastSeparator) {
              h += '<div class="notif-date-sep"><span>' + sep + '</span></div>';
              lastSeparator = sep;
            }
            h += renderGroupHeader(entry, gi);
            for (var gii = 0; gii < entry.items.length; gii++) {
              h += renderNotifCard(entry.items[gii], gi * 100 + gii);
            }
            h += renderGroupFooter();
          } else {
            var sep2 = getDateSeparator(entry.item.time);
            if (sep2 !== lastSeparator) {
              h += '<div class="notif-date-sep"><span>' + sep2 + '</span></div>';
              lastSeparator = sep2;
            }
            h += renderNotifCard(entry.item, gi);
          }
        }
        h += '</div>';

        if (data.length > currentPage * pageSize) {
          h += '<div style="text-align:center;padding:var(--space-6)">\
            <button class="btn btn-secondary" data-action="notif:loadMore" style="min-width:160px">Load More (' + (data.length - currentPage * pageSize) + ' remaining)</button>\
          </div>';
        }

        h += '<div style="text-align:center;padding:var(--space-3) 0 var(--space-6);font-size:var(--text-xs);color:var(--text-tertiary)">\
          Showing ' + Math.min(currentPage * pageSize, data.length) + ' of ' + data.length + ' notification' + (data.length !== 1 ? 's' : '') + '\
        </div>';
      }

      h += '</div>';

      mc.innerHTML = h;

      var qaEls = document.querySelectorAll('.notif-quick-actions');
      for (var qai = 0; qai < qaEls.length; qai++) {
        (function(el) {
          var parent = el.parentElement;
          if (parent) {
            var container = parent.closest('.notification-item');
            if (container) {
              container.addEventListener('mouseenter', function() { el.style.opacity = '1'; });
              container.addEventListener('mouseleave', function() { el.style.opacity = '0'; });
            }
          }
        })(qaEls[qai]);
      }

      window.switchNotifTab = function(tab) {
        activeTab = tab;
        currentPage = 1;
        selectedIds = {};
        render();
      };

      window.searchNotif = function(value) {
        searchQuery = value;
        currentPage = 1;
        render();
      };

      window.setDateFilter = function(value) {
        dateFilter = value;
        currentPage = 1;
        render();
      };

      window.setReadFilter = function(value) {
        readFilter = value;
        currentPage = 1;
        render();
      };

      window.setSortOrder = function(value) {
        sortOrder = value;
        currentPage = 1;
        render();
      };

      window.markAllNotifRead = function() {
        for (var k = 0; k < notifications.length; k++) {
          notifications[k].read = true;
        }
        saveAndSync(notifications);
        showToast('All notifications marked as read', 'success');
        render();
      };

      window.clearAllNotif = function() {
        if (notifications.length === 0) {
          showToast('No notifications to clear', 'info');
          return;
        }
        confirmDialog('Are you sure you want to clear all notifications? This action cannot be undone.', 'Yes, Clear All', 'Cancel').then(function(confirmed) {
          if (confirmed) {
            saveAndSync([]);
            showToast('All notifications cleared', 'success');
            render();
          }
        });
      };

      window.deleteAllReadNotif = function() {
        var readNotifs = notifications.filter(function(n) { return n.read; });
        if (readNotifs.length === 0) {
          showToast('No read notifications to delete', 'info');
          return;
        }
        confirmDialog('Delete all ' + readNotifs.length + ' read notification' + (readNotifs.length !== 1 ? 's' : '') + '? This action cannot be undone.', 'Delete All Read', 'Cancel').then(function(confirmed) {
          if (confirmed) {
            notifications = notifications.filter(function(n) { return !n.read; });
            saveAndSync(notifications);
            showToast('All read notifications deleted', 'success');
            render();
          }
        });
      };

      window.deleteNotif = function(id) {
        notifications = notifications.filter(function(n) { return n.id !== id; });
        if (selectedIds[id]) delete selectedIds[id];
        saveAndSync(notifications);
        render();
      };

      window.markReadNotif = function(id) {
        markRead(id);
      };

      window.markUnreadNotif = function(id) {
        markUnread(id);
      };

      window.togglePinNotif = function(id) {
        togglePin(id);
      };

      window.shareNotif = function(id) {
        shareNotif(id);
      };

      window.snoozeNotif = function(id, duration) {
        if (!duration) return;
        snoozeNotif(id, duration);
      };

      window.openNotifDrawer = function(id) {
        openDrawer(id);
      };

      window.closeNotifDrawer = function() {
        closeDrawer();
      };

      window.toggleSelectMode = function() {
        selectMode = !selectMode;
        if (!selectMode) selectedIds = {};
        render();
      };

      window.toggleSelectNotif = function(id, checked) {
        if (checked) {
          selectedIds[id] = true;
        } else {
          delete selectedIds[id];
        }
        render();
      };

      window.selectAllVisible = function() {
        var visibleIds = document.querySelectorAll('.notification-item[data-id]');
        for (var si = 0; si < visibleIds.length; si++) {
          var vid = visibleIds[si].getAttribute('data-id');
          if (vid) selectedIds[vid] = true;
        }
        render();
      };

      window.deselectAll = function() {
        selectedIds = {};
        render();
      };

      window.bulkMarkRead = function() {
        for (var id in selectedIds) {
          if (selectedIds[id]) {
            var n = getNotifById(id);
            if (n) n.read = true;
          }
        }
        saveAndSync(notifications);
        showToast('Selected notifications marked as read', 'success');
        selectedIds = {};
        render();
      };

      window.bulkDelete = function() {
        var ids = [];
        for (var id in selectedIds) {
          if (selectedIds[id]) ids.push(id);
        }
        if (ids.length === 0) return;
        confirmDialog('Delete ' + ids.length + ' selected notification' + (ids.length !== 1 ? 's' : '') + '?', 'Delete', 'Cancel').then(function(confirmed) {
          if (confirmed) {
            notifications = notifications.filter(function(n) { return ids.indexOf(n.id) === -1; });
            saveAndSync(notifications);
            showToast(ids.length + ' notification' + (ids.length !== 1 ? 's' : '') + ' deleted', 'success');
            selectedIds = {};
            render();
          }
        });
      };

      window.bulkPin = function() {
        for (var id in selectedIds) {
          if (selectedIds[id]) {
            var n = getNotifById(id);
            if (n) n.pinned = true;
          }
        }
        saveAndSync(notifications);
        showToast('Selected notifications pinned', 'success');
        selectedIds = {};
        render();
      };

      window.loadMoreNotif = function() {
        currentPage++;
        render();
      };

      window.toggleGroup = function(key) {
        if (groupCollapsed[key]) {
          delete groupCollapsed[key];
        } else {
          groupCollapsed[key] = true;
        }
        render();
      };

      var notifItems = document.querySelectorAll('.notification-item');
      for (var ni = 0; ni < notifItems.length; ni++) {
        notifItems[ni].addEventListener('mouseenter', function() {
          var qa = this.querySelector('.notif-quick-actions');
          if (qa) qa.style.opacity = '1';
        });
        notifItems[ni].addEventListener('mouseleave', function() {
          var qa = this.querySelector('.notif-quick-actions');
          if (qa) qa.style.opacity = '0';
        });
      }

    }, 400);
  }

  render();
};
