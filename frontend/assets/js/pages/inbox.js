window.renderPage = window.renderPage || {};

var _U = window.Utils;
var _MD = window.mockData;
var _Store = window.Store;

if (!window._inboxDelegate) {
  window._inboxDelegate = true;
  document.addEventListener('click', function(e) {
    var t = e.target.closest('[data-action^="inbox:"]');
    if (!t) return;
    var p = t.getAttribute('data-action').split(':');
    var c = p[1], a = p[2];
    if (c === 'folder' && a) { switchFolder(a); }
    if (c === 'msg' && a) { openMessage(a); }
    if (c === 'star' && a) { toggleStar(a); }
    if (c === 'important' && a) { toggleImportant(a); }
    if (c === 'delete' && a) { deleteMessage(a); }
    if (c === 'search') { searchMessages(); }
    if (c === 'compose') { openCompose(); }
    if (c === 'send') { sendMessage(); }
    if (c === 'closeMsg') { closeMessage(); }
    if (c === 'reply') { showToast('Reply feature coming soon!', 'info'); }
    if (c === 'forward') { showToast('Forward feature coming soon!', 'info'); }
    if (c === 'markRead' && a) { markAsRead(a); }
    if (c === 'refresh') { refreshInbox(); }
    if (c === 'label' && a) { filterByLabel(a); }
  });
}

window.renderPage.inbox = function(params) {
  var container = document.getElementById('main-content');
  if (!container) return;

  var activeFolder = 'inbox';
  var activeLabel = '';
  var activeMsgId = null;
  var searchQuery = '';
  var selectedIds = {};
  var composeOpen = false;
  var mobileView = 'list';

  var LABELS = {
    exams: { icon: '📝', color: '#f59e0b' },
    teachers: { icon: '👩\u200d🏫', color: '#3b82f6' },
    marketplace: { icon: '🛒', color: '#10b981' },
    scholarships: { icon: '🎓', color: '#8b5cf6' },
    assignments: { icon: '📋', color: '#f97316' },
    announcements: { icon: '📢', color: '#ec4899' },
    ai: { icon: '🤖', color: '#06b6d4' }
  };

  var FOLDERS = [
    { id: 'inbox', icon: '📥', label: 'Inbox' },
    { id: 'starred', icon: '⭐', label: 'Starred' },
    { id: 'important', icon: '❗', label: 'Important' },
    { id: 'sent', icon: '📤', label: 'Sent' },
    { id: 'drafts', icon: '📝', label: 'Drafts' },
    { id: 'trash', icon: '🗑️', label: 'Trash' }
  ];

  var mockMessages = [
    {
      id: 'MSG-001', from: 'Edu-Mentee Exams', email: 'exams@edumentee.com',
      subject: 'JEE Main 2026 Mock Test Results Available',
      preview: 'Your results for the JEE Main mock test #14 are now available. Check your scorecard and performance analysis.',
      body: '<p>Dear Student,</p><p>Your JEE Main 2026 Mock Test #14 results are now available on the platform.</p><p><strong>Score:</strong> 72/300</p><p><strong>Rank:</strong> 1,245 out of 15,000 students</p><p><strong>Subject Breakdown:</strong></p><ul><li>Physics: 28/100</li><li>Chemistry: 22/100</li><li>Mathematics: 22/100</li></ul><p>Review your detailed performance analysis and identify areas for improvement.</p><p>Best of luck!</p>',
      date: '2026-07-11T09:15:00Z', folder: 'inbox', label: 'exams',
      starred: false, important: true, read: false, hasAttachments: true,
      attachments: [{ name: 'JEE_Mock14_Scorecard.pdf', size: '2.4 MB' }]
    },
    {
      id: 'MSG-002', from: 'Dr. Priya Mehta', email: 'priya.mehta@edumentee.com',
      subject: 'Physics Assignment - Thermodynamics Chapter',
      preview: 'Please find the assignment for the Thermodynamics chapter. Deadline has been extended to July 18.',
      body: '<p>Dear Students,</p><p>I have uploaded the Thermodynamics assignment. Given the difficulty level, I am extending the deadline to <strong>July 18, 2026</strong>.</p><p><strong>Key topics to cover:</strong></p><ul><li>First Law of Thermodynamics</li><li>Entropy and Second Law</li><li>Carnot Engine efficiency</li><li>Reversible and Irreversible processes</li></ul><p>Please submit your answers as a PDF on the platform.</p><p>Warm regards,<br>Dr. Priya Mehta</p>',
      date: '2026-07-11T08:30:00Z', folder: 'inbox', label: 'teachers',
      starred: true, important: false, read: false, hasAttachments: true,
      attachments: [{ name: 'Thermodynamics_Assignment.pdf', size: '1.1 MB' }, { name: 'Reference_Solutions.pdf', size: '856 KB' }]
    },
    {
      id: 'MSG-003', from: 'Marketplace', email: 'orders@edumentee.com',
      subject: 'Order #MKP-4521 Confirmed - NCERT Books Bundle',
      preview: 'Your order for NCERT Complete Set (Class 12) has been confirmed and will be delivered within 5-7 business days.',
      body: '<p>Hi there!</p><p>Your marketplace order has been confirmed.</p><p><strong>Order ID:</strong> #MKP-4521</p><p><strong>Item:</strong> NCERT Complete Set - Class 12 (Science Stream)</p><p><strong>Price:</strong> ₹2,450</p><p><strong>Expected Delivery:</strong> July 18-20, 2026</p><p>You can track your order from the Marketplace section.</p>',
      date: '2026-07-10T16:45:00Z', folder: 'inbox', label: 'marketplace',
      starred: false, important: false, read: true, hasAttachments: false,
      attachments: []
    },
    {
      id: 'MSG-004', from: 'Scholarship Board', email: 'scholarships@edumentee.com',
      subject: 'New Scholarship Opportunity - Merit-Based ₹50,000',
      preview: 'A new merit-based scholarship worth ₹50,000 has been announced. Eligibility: Class 11-12 students with 85%+ in previous exams.',
      body: '<p>Dear Student,</p><p>We are pleased to announce a new scholarship opportunity:</p><p><strong>Scholarship:</strong> Edu-Mentee Academic Excellence Award 2026</p><p><strong>Amount:</strong> ₹50,000</p><p><strong>Eligibility:</strong></p><ul><li>Currently enrolled in Class 11 or 12</li><li>Minimum 85% in previous board exam</li><li>Active platform member for 3+ months</li></ul><p><strong>Application Deadline:</strong> July 31, 2026</p><p>Apply now through the Scholarships section.</p>',
      date: '2026-07-10T14:00:00Z', folder: 'inbox', label: 'scholarships',
      starred: true, important: true, read: false, hasAttachments: false,
      attachments: []
    },
    {
      id: 'MSG-005', from: 'Edu-Mentee Exams', email: 'exams@edumentee.com',
      subject: 'NEET Biology Practice Test Scheduled',
      preview: 'A new NEET Biology practice test has been scheduled for July 15. Register now to secure your slot.',
      body: '<p>Dear Student,</p><p>A new NEET Biology practice test has been scheduled:</p><p><strong>Date:</strong> July 15, 2026</p><p><strong>Time:</strong> 10:00 AM - 12:00 PM</p><p><strong>Syllabus:</strong> Human Physiology + Plant Physiology</p><p><strong>Questions:</strong> 100 MCQs</p><p>Register early as slots are limited to 500 students per session.</p>',
      date: '2026-07-10T11:00:00Z', folder: 'inbox', label: 'exams',
      starred: false, important: false, read: true, hasAttachments: false,
      attachments: []
    },
    {
      id: 'MSG-006', from: 'Prof. Amit Sharma', email: 'amit.sharma@edumentee.com',
      subject: 'Chemistry Doubt Session - Organic Reactions',
      preview: 'Special doubt clearing session on Organic Chemistry reactions this Thursday at 4 PM. Join via live class link.',
      body: '<p>Dear Students,</p><p>I am organizing a special doubt-clearing session focused on Organic Chemistry reactions.</p><p><strong>Date:</strong> Thursday, July 14, 2026</p><p><strong>Time:</strong> 4:00 PM - 5:30 PM</p><p><strong>Topics:</strong></p><ul><li>Named reactions (Aldol, Cannizzaro, etc.)</li><li>Reaction mechanisms</li><li>Reagent identification</li></ul><p>Please submit your doubts in advance through the platform so I can prepare better.</p><p>Regards,<br>Prof. Amit Sharma</p>',
      date: '2026-07-10T09:30:00Z', folder: 'inbox', label: 'teachers',
      starred: false, important: false, read: true, hasAttachments: false,
      attachments: []
    },
    {
      id: 'MSG-007', from: 'Marketplace', email: 'orders@edumentee.com',
      subject: 'Order #MKP-4498 Shipped - Study Materials',
      preview: 'Your study materials order has been shipped via BlueDart. Tracking number: BD123456789.',
      body: '<p>Great news!</p><p>Your order <strong>#MKP-4498</strong> has been shipped.</p><p><strong>Item:</strong> H.C. Verma - Concepts of Physics Vol 1 & 2</p><p><strong>Courier:</strong> BlueDart</p><p><strong>Tracking:</strong> BD123456789</p><p><strong>Estimated Delivery:</strong> July 13, 2026</p><p>Track your package in the Marketplace orders section.</p>',
      date: '2026-07-09T18:00:00Z', folder: 'inbox', label: 'marketplace',
      starred: false, important: false, read: true, hasAttachments: false,
      attachments: []
    },
    {
      id: 'MSG-008', from: 'Scholarship Board', email: 'scholarships@edumentee.com',
      subject: 'Application Status Update - Inspire Scholarship',
      preview: 'Your application for the INSPIRE Scholarship has been shortlisted. Please upload pending documents by July 20.',
      body: '<p>Dear Student,</p><p>We are happy to inform you that your application for the <strong>INSPIRE Scholarship 2026</strong> has been shortlisted!</p><p><strong>Status:</strong> Under Review (Documents Required)</p><p><strong>Pending Documents:</strong></p><ul><li>Income Certificate</li><li>Aadhar Card Copy</li><li>Previous Year Marksheet</li></ul><p><strong>Deadline:</strong> July 20, 2026</p><p>Please upload the documents through the Scholarship portal.</p>',
      date: '2026-07-09T15:20:00Z', folder: 'inbox', label: 'scholarships',
      starred: true, important: true, read: false, hasAttachments: false,
      attachments: []
    },
    {
      id: 'MSG-009', from: 'Edu-Mentee Assignments', email: 'assignments@edumentee.com',
      subject: 'New Assignment: Mathematics - Calculus Integration',
      preview: 'A new calculus assignment has been posted. 20 questions covering indefinite and definite integrals. Due in 5 days.',
      body: '<p>Hi!</p><p>A new assignment has been posted:</p><p><strong>Subject:</strong> Mathematics</p><p><strong>Topic:</strong> Calculus - Integration</p><p><strong>Questions:</strong> 20 (Indefinite + Definite Integrals)</p><p><strong>Difficulty:</strong> Medium-Hard</p><p><strong>Due Date:</strong> July 16, 2026</p><p><strong>Marks:</strong> 40</p><p>Solve on the platform and submit before the deadline. Partial marking is available.</p>',
      date: '2026-07-09T10:00:00Z', folder: 'inbox', label: 'assignments',
      starred: false, important: false, read: false, hasAttachments: false,
      attachments: []
    },
    {
      id: 'MSG-010', from: 'Edu-Mentee Admin', email: 'admin@edumentee.com',
      subject: 'Platform Maintenance - July 13 (2 AM - 5 AM)',
      preview: 'Scheduled maintenance for platform upgrade. All services will be temporarily unavailable during the window.',
      body: '<p>Dear Users,</p><p>We have scheduled a platform maintenance window for:</p><p><strong>Date:</strong> July 13, 2026</p><p><strong>Time:</strong> 2:00 AM - 5:00 AM IST</p><p><strong>Impact:</strong> All platform services will be temporarily unavailable.</p><p><strong>What we are doing:</strong></p><ul><li>Server upgrade for better performance</li><li>New feature deployment</li><li>Security patches</li></ul><p>We recommend saving your work before the maintenance window.</p><p>Thank you for your patience!</p>',
      date: '2026-07-09T08:00:00Z', folder: 'inbox', label: 'announcements',
      starred: false, important: true, read: true, hasAttachments: false,
      attachments: []
    },
    {
      id: 'MSG-011', from: 'AI Study Assistant', email: 'ai@edumentee.com',
      subject: 'Weekly Study Report - July 3 to July 9',
      preview: 'Your weekly study report is ready. You studied 14.5 hours across 5 subjects. Top performer: Physics.',
      body: '<p>Here is your weekly study report!</p><p><strong>Total Study Time:</strong> 14.5 hours</p><p><strong>Subjects Covered:</strong> 5</p><p><strong>Problems Solved:</strong> 87</p><p><strong>Accuracy Rate:</strong> 72%</p><p><strong>Subject Breakdown:</strong></p><ul><li>Physics: 4.2 hrs (Top subject)</li><li>Mathematics: 3.8 hrs</li><li>Chemistry: 2.5 hrs</li><li>English: 2.0 hrs</li><li>Biology: 2.0 hrs</li></ul><p><strong>Suggestion:</strong> Focus more on Chemistry to improve overall performance.</p>',
      date: '2026-07-09T07:00:00Z', folder: 'inbox', label: 'ai',
      starred: false, important: false, read: true, hasAttachments: true,
      attachments: [{ name: 'Weekly_Report_Jul9.pdf', size: '340 KB' }]
    },
    {
      id: 'MSG-012', from: 'Edu-Mentee Exams', email: 'exams@edumentee.com',
      subject: 'Board Exam Preparation - Free Mock Series',
      preview: 'Board exam preparation mock series starting August 1. Register now for free access to 25 full-length tests.',
      body: '<p>Dear Students,</p><p>Get ready for your board exams with our free mock test series!</p><p><strong>Series:</strong> Board Exam Prep 2027</p><p><strong>Tests:</strong> 25 full-length mock exams</p><p><strong>Start Date:</strong> August 1, 2026</p><p><strong>Fee:</strong> Free for all Edu-Mentee members</p><p><strong>Features:</strong></p><ul><li>AI-powered difficulty adaptation</li><li>Detailed solution for every question</li><li>Peer comparison leaderboard</li><li>Performance analytics</li></ul><p>Register through the Exams section.</p>',
      date: '2026-07-08T16:30:00Z', folder: 'inbox', label: 'exams',
      starred: false, important: false, read: true, hasAttachments: false,
      attachments: []
    },
    {
      id: 'MSG-013', from: 'Prof. Sneha Reddy', email: 'sneha.reddy@edumentee.com',
      subject: 'Biology Lab Report Guidelines',
      preview: 'Important guidelines for submitting your Biology lab reports. Follow the format strictly for full marks.',
      body: '<p>Dear Students,</p><p>Please follow these guidelines for your Biology lab report submission:</p><p><strong>Format:</strong></p><ul><li>Title page with name, roll number, and experiment title</li><li>Aim and objectives (max 3 sentences)</li><li>Theory background (1-2 paragraphs)</li><li>Procedure (numbered steps)</li><li>Observations in table format</li><li>Conclusion with analysis</li></ul><p><strong>Deadline:</strong> July 20, 2026</p><p><strong>Marks:</strong> 20</p><p>Non-compliance with format will result in 5 marks deduction.</p><p>Best,<br>Prof. Sneha Reddy</p>',
      date: '2026-07-08T12:15:00Z', folder: 'inbox', label: 'teachers',
      starred: false, important: false, read: true, hasAttachments: true,
      attachments: [{ name: 'Lab_Report_Template.docx', size: '128 KB' }]
    },
    {
      id: 'MSG-014', from: 'Edu-Mentee Assignments', email: 'assignments@edumentee.com',
      subject: 'Assignment Graded: Physics Wave Motion',
      preview: 'Your Physics Wave Motion assignment has been graded. Score: 35/40. Check detailed feedback.',
      body: '<p>Your assignment has been graded!</p><p><strong>Assignment:</strong> Physics - Wave Motion</p><p><strong>Score:</strong> 35/40</p><p><strong>Grade:</strong> A</p><p><strong>Feedback:</strong> Excellent understanding of wave equations. Minor errors in numerical calculations for Q4 and Q7. Review the propagation concepts for better accuracy.</p><p><strong>Class Average:</strong> 28/40</p><p>Keep up the great work!</p>',
      date: '2026-07-08T10:00:00Z', folder: 'inbox', label: 'assignments',
      starred: false, important: false, read: false, hasAttachments: false,
      attachments: []
    },
    {
      id: 'MSG-015', from: 'Edu-Mentee Announcements', email: 'announce@edumentee.com',
      subject: 'Edu-Mentee Summer Learning Festival',
      preview: 'Join the Summer Learning Festival from July 20-31. Free workshops, quizzes, and prizes worth ₹1,00,000!',
      body: '<p>Get ready for the biggest learning event of the summer!</p><p><strong>Edu-Mentee Summer Learning Festival 2026</strong></p><p><strong>Dates:</strong> July 20 - July 31</p><p><strong>Highlights:</strong></p><ul><li>50+ free workshops by top educators</li><li>Daily quiz challenges with coins</li><li>Subject-wise olympiad competitions</li><li>Live study sessions with AI mentors</li><li>Prizes worth ₹1,00,000</li></ul><p><strong>Register now</strong> to secure your spot!</p><p>Bring your friends and earn bonus XP for referrals.</p>',
      date: '2026-07-08T09:00:00Z', folder: 'inbox', label: 'announcements',
      starred: true, important: false, read: true, hasAttachments: false,
      attachments: []
    },
    {
      id: 'MSG-016', from: 'Edu-Mentee Assignments', email: 'assignments@edumentee.com',
      subject: 'New Assignment: English Essay Writing',
      preview: 'Write a 500-word essay on "Technology in Education - Boon or Bane?" Submissions open until July 17.',
      body: '<p>Dear Students,</p><p>A new English assignment has been posted:</p><p><strong>Task:</strong> Essay Writing</p><p><strong>Topic:</strong> "Technology in Education - Boon or Bane?"</p><p><strong>Word Limit:</strong> 500 words</p><p><strong>Submission Format:</strong> PDF or direct text input</p><p><strong>Due Date:</strong> July 17, 2026</p><p><strong>Marks:</strong> 25</p><p><strong>Assessment Criteria:</strong></p><ul><li>Content quality and argument strength</li><li>Grammar and language</li><li>Structure and coherence</li><li>Creativity and originality</li></ul>',
      date: '2026-07-07T14:00:00Z', folder: 'inbox', label: 'assignments',
      starred: false, important: false, read: true, hasAttachments: false,
      attachments: []
    },
    {
      id: 'MSG-017', from: 'AI Study Assistant', email: 'ai@edumentee.com',
      subject: 'AI Tutor Session Summary - Organic Chemistry',
      preview: 'Your AI tutoring session on Organic Chemistry has been summarized. Review key concepts and practice problems.',
      body: '<p>Here is a summary of your recent AI tutoring session:</p><p><strong>Topic:</strong> Organic Chemistry - GOC</p><p><strong>Duration:</strong> 45 minutes</p><p><strong>Concepts Covered:</strong></p><ul><li>Inductive and Resonance effects</li><li>Acidity and Basicity ordering</li><li>Reaction intermediates stability</li></ul><p><strong>Key Takeaways:</strong></p><ul><li>Always check for equivalent resonance structures before applying inductive effect</li><li>Carbocation stability: 3° > 2° > 1° > methyl</li><li>Practice problems recommended: 15 on Hyperconjugation</li></ul><p>Continue your practice to master GOC!</p>',
      date: '2026-07-07T11:30:00Z', folder: 'inbox', label: 'ai',
      starred: false, important: false, read: true, hasAttachments: false,
      attachments: []
    },
    {
      id: 'MSG-018', from: 'Edu-Mentee Exams', email: 'exams@edumentee.com',
      subject: 'JEE Advanced Practice - Problem Set 7',
      preview: 'New advanced-level problem set for JEE Advanced preparation. 30 questions with detailed solutions.',
      body: '<p>Challenge yourself with this advanced problem set!</p><p><strong>Set:</strong> JEE Advanced Practice #7</p><p><strong>Questions:</strong> 30 (Multi-correct + Integer type)</p><p><strong>Syllabus:</strong> Rotational Mechanics + Gravitation</p><p><strong>Time Limit:</strong> 90 minutes</p><p><strong>Difficulty:</strong> Hard</p><p>Solutions will be available after the deadline.</p>',
      date: '2026-07-07T08:00:00Z', folder: 'inbox', label: 'exams',
      starred: false, important: false, read: true, hasAttachments: false,
      attachments: []
    },
    {
      id: 'MSG-019', from: 'Prof. Amit Sharma', email: 'amit.sharma@edumentee.com',
      subject: 'Study Group Forming - Organic Chemistry',
      preview: 'I am forming an advanced study group for Organic Chemistry. 10 seats available. First come, first served.',
      body: '<p>Dear Students,</p><p>I am forming an advanced study group for Organic Chemistry enthusiasts.</p><p><strong>Details:</strong></p><ul><li>Group Size: 10 students max</li><li>Focus: Advanced GOC, Named Reactions, Reaction Mechanisms</li><li>Schedule: Tuesday and Thursday, 5:00 PM - 6:00 PM</li><li>Duration: 4 weeks</li></ul><p><strong>Prerequisites:</strong></p><ul><li>Minimum 70% in recent Chemistry tests</li><li>Commitment to attend 80%+ sessions</li></ul><p>Reply to this message to enroll. First come, first served!</p><p>Prof. Amit Sharma</p>',
      date: '2026-07-06T17:00:00Z', folder: 'inbox', label: 'teachers',
      starred: true, important: false, read: true, hasAttachments: false,
      attachments: []
    },
    {
      id: 'MSG-020', from: 'Edu-Mentee Announcements', email: 'announce@edumentee.com',
      subject: 'New Feature: AI-Powered Study Planner',
      preview: 'Introducing the AI Study Planner that creates personalized study schedules based on your exam dates and performance.',
      body: '<p>We are excited to announce a powerful new feature!</p><p><strong>AI Study Planner</strong></p><p>Our new AI Study Planner analyzes your:</p><ul><li>Exam schedule and deadlines</li><li>Current performance metrics</li><li>Weak areas and strong subjects</li><li>Available study hours</li></ul><p>It then generates a <strong>personalized daily study schedule</strong> that maximizes your preparation efficiency.</p><p><strong>How to access:</strong> Dashboard > Study Planner</p><p>Try it now and optimize your study routine!</p>',
      date: '2026-07-06T12:00:00Z', folder: 'inbox', label: 'announcements',
      starred: false, important: false, read: true, hasAttachments: false,
      attachments: []
    },
    {
      id: 'MSG-021', from: 'Marketplace', email: 'orders@edumentee.com',
      subject: 'New Listing Alert: Previous Year Papers Bundle',
      preview: 'A new listing matching your interests: Complete Previous Year Papers for JEE/NEET (2015-2025) at ₹399.',
      body: '<p>We found something you might like!</p><p><strong>New Listing:</strong> Complete Previous Year Papers Bundle</p><p><strong>Contents:</strong></p><ul><li>JEE Main Papers (2015-2025) - 22 papers</li><li>JEE Advanced Papers (2015-2025) - 11 papers</li><li>NEET Papers (2015-2025) - 11 papers</li></ul><p><strong>Price:</strong> ₹399 (MRP: ₹899)</p><p><strong>Format:</strong> PDF with detailed solutions</p><p>Check it out in the Marketplace!</p>',
      date: '2026-07-06T10:30:00Z', folder: 'inbox', label: 'marketplace',
      starred: false, important: false, read: true, hasAttachments: false,
      attachments: []
    },
    {
      id: 'MSG-022', from: 'Dr. Priya Mehta', email: 'priya.mehta@edumentee.com',
      subject: 'Physics Class Recording - Electromagnetic Induction',
      preview: 'The recording of yesterday\'s live class on Electromagnetic Induction is now available. Duration: 1hr 20min.',
      body: '<p>Dear Students,</p><p>The recording of yesterday\'s live class is now available.</p><p><strong>Topic:</strong> Electromagnetic Induction</p><p><strong>Duration:</strong> 1 hour 20 minutes</p><p><strong>Key Concepts Covered:</strong></p><ul><li>Faraday\'s Law</li><li>Lenz\'s Law</li><li>Motional EMF</li><li>Self and Mutual Inductance</li></ul><p>Watch the recording and complete the practice questions I shared during class.</p><p>Dr. Priya Mehta</p>',
      date: '2026-07-05T18:00:00Z', folder: 'inbox', label: 'teachers',
      starred: false, important: false, read: true, hasAttachments: true,
      attachments: [{ name: 'EMI_Class_Notes.pdf', size: '3.2 MB' }]
    },
    {
      id: 'MSG-023', from: 'Edu-Mentee Exams', email: 'exams@edumentee.com',
      subject: 'NEET Mock Test #8 Results Published',
      preview: 'Your NEET Mock Test #8 results are out. Score: 520/720. Improved by 35 marks from last attempt!',
      body: '<p>Results are in!</p><p><strong>NEET Mock Test #8</strong></p><p><strong>Your Score:</strong> 520/720</p><p><strong>Percentile:</strong> 89.5</p><p><strong>Improvement:</strong> +35 marks from Mock #7</p><p><strong>Subject-wise:</strong></p><ul><li>Physics: 155/180</li><li>Chemistry: 170/180</li><li>Biology: 195/360</li></ul><p><strong>Estimated Rank:</strong> ~15,000</p><p>Great improvement in Physics! Focus on Biology diagrams and ecology units.</p>',
      date: '2026-07-05T14:00:00Z', folder: 'inbox', label: 'exams',
      starred: false, important: false, read: true, hasAttachments: true,
      attachments: [{ name: 'NEET_Mock8_Analysis.pdf', size: '1.8 MB' }]
    },
    {
      id: 'MSG-024', from: 'Scholarship Board', email: 'scholarships@edumentee.com',
      subject: 'Scholarship Renewal Reminder',
      preview: 'Your current scholarship expires next month. Renewal applications are now open. Submit before July 25.',
      body: '<p>Dear Student,</p><p>This is a reminder about your scholarship renewal.</p><p><strong>Current Scholarship:</strong> Academic Merit Scholarship</p><p><strong>Expiry:</strong> August 31, 2026</p><p><strong>Renewal Requirements:</strong></p><ul><li>Maintain 80%+ aggregate</li><li>Regular platform engagement (10+ hours/month)</li><li>Good conduct record</li></ul><p><strong>Application Deadline:</strong> July 25, 2026</p><p>Submit your renewal through the Scholarships section.</p>',
      date: '2026-07-05T10:00:00Z', folder: 'inbox', label: 'scholarships',
      starred: false, important: true, read: true, hasAttachments: false,
      attachments: []
    },
    {
      id: 'MSG-025', from: 'Edu-Mentee Admin', email: 'admin@edumentee.com',
      subject: 'Welcome to Edu-Mentee Premium!',
      preview: 'Congratulations! You have been upgraded to Edu-Mentee Premium for 30 days as part of our loyalty reward.',
      body: '<p>Congratulations! 🎉</p><p>You have been upgraded to <strong>Edu-Mentee Premium</strong>!</p><p><strong>Duration:</strong> 30 days (July 5 - August 4, 2026)</p><p><strong>Premium Benefits Unlocked:</strong></p><ul><li>Unlimited AI tutoring sessions</li><li>Advanced performance analytics</li><li>Priority access to live classes</li><li>Ad-free experience</li><li>Exclusive study materials</li><li>Early access to new features</li></ul><p>This reward is for your consistent platform engagement. Keep up the great work!</p><p>Happy Learning! 📚</p>',
      date: '2026-07-05T09:00:00Z', folder: 'inbox', label: 'announcements',
      starred: true, important: true, read: true, hasAttachments: false,
      attachments: []
    }
  ];

  var sentMessages = [
    { id: 'SENT-001', from: 'You', email: 'me@edumentee.com', to: 'Dr. Priya Mehta', subject: 'Re: Physics Assignment - Thermodynamics Chapter', preview: 'Ma\'am, I had a doubt in Question 5 regarding entropy calculation...', body: '<p>Ma\'am, I had a doubt in Question 5 regarding entropy calculation. The process is irreversible, so should I use the Clausius inequality?</p>', date: '2026-07-11T10:00:00Z', folder: 'sent', label: 'teachers', starred: false, important: false, read: true, hasAttachments: false, attachments: [] },
    { id: 'SENT-002', from: 'You', email: 'me@edumentee.com', to: 'Scholarship Board', subject: 'Re: Scholarship Renewal Reminder', preview: 'I have uploaded all the required documents for the renewal...', body: '<p>I have uploaded all the required documents for the renewal. Please let me know if anything else is needed.</p>', date: '2026-07-05T12:00:00Z', folder: 'sent', label: 'scholarships', starred: false, important: false, read: true, hasAttachments: false, attachments: [] },
    { id: 'SENT-003', from: 'You', email: 'me@edumentee.com', to: 'Prof. Amit Sharma', subject: 'Re: Study Group Forming - Organic Chemistry', preview: 'Sir, I would like to join the Organic Chemistry study group...', body: '<p>Sir, I would like to join the Organic Chemistry study group. I scored 78% in my last Chemistry test and I am committed to attending all sessions.</p>', date: '2026-07-06T18:00:00Z', folder: 'sent', label: 'teachers', starred: false, important: false, read: true, hasAttachments: false, attachments: [] }
  ];

  var draftMessages = [
    { id: 'DRAFT-001', from: 'You', email: 'me@edumentee.com', to: 'Prof. Sneha Reddy', subject: 'Question about Lab Report', preview: 'Ma\'am, I wanted to ask about the observation table format...', body: '<p>Ma\'am, I wanted to ask about the observation table format. Should it include uncertainty values for each reading?', date: '2026-07-09T20:00:00Z', folder: 'drafts', label: 'teachers', starred: false, important: false, read: true, hasAttachments: false, attachments: [] }
  ];

  var trashMessages = [];

  function sanitize(str) {
    if (!str) return '';
    var map = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#x27;' };
    return String(str).replace(/[&<>"']/g, function(m) { return map[m]; });
  }

  function getAllMessages() {
    var all = mockMessages.concat(sentMessages).concat(draftMessages).concat(trashMessages);
    return all;
  }

  function getFilteredMessages() {
    var all = getAllMessages();
    var filtered = [];
    for (var i = 0; i < all.length; i++) {
      var m = all[i];
      if (activeFolder === 'inbox' && m.folder === 'inbox') filtered.push(m);
      else if (activeFolder === 'starred' && m.starred && m.folder !== 'trash') filtered.push(m);
      else if (activeFolder === 'important' && m.important && m.folder !== 'trash') filtered.push(m);
      else if (activeFolder === 'sent' && m.folder === 'sent') filtered.push(m);
      else if (activeFolder === 'drafts' && m.folder === 'drafts') filtered.push(m);
      else if (activeFolder === 'trash' && m.folder === 'trash') filtered.push(m);
    }
    if (activeLabel) {
      filtered = filtered.filter(function(m) { return m.label === activeLabel; });
    }
    if (searchQuery) {
      var q = searchQuery.toLowerCase();
      filtered = filtered.filter(function(m) {
        return (m.from && m.from.toLowerCase().indexOf(q) !== -1) ||
               (m.subject && m.subject.toLowerCase().indexOf(q) !== -1) ||
               (m.preview && m.preview.toLowerCase().indexOf(q) !== -1);
      });
    }
    filtered.sort(function(a, b) {
      return new Date(b.date) - new Date(a.date);
    });
    return filtered;
  }

  function getUnreadCount(folder) {
    var all = getAllMessages();
    var count = 0;
    for (var i = 0; i < all.length; i++) {
      var m = all[i];
      if (!m.read && m.folder !== 'trash') {
        if (folder === 'inbox' && m.folder === 'inbox') count++;
        else if (folder === 'starred' && m.starred) count++;
        else if (folder === 'important' && m.important) count++;
      }
    }
    return count;
  }

  function getLabelCounts() {
    var all = getAllMessages();
    var counts = {};
    for (var k in LABELS) { counts[k] = 0; }
    for (var i = 0; i < all.length; i++) {
      var m = all[i];
      if (m.folder !== 'trash' && m.label && counts[m.label] !== undefined) {
        counts[m.label]++;
      }
    }
    return counts;
  }

  function formatDate(isoStr) {
    if (!isoStr) return '';
    var d = new Date(isoStr);
    if (isNaN(d.getTime())) return '';
    var now = new Date();
    var diff = now - d;
    var oneDay = 86400000;
    if (diff < oneDay && d.getDate() === now.getDate()) {
      var hrs = d.getHours();
      var mins = d.getMinutes();
      var ampm = hrs >= 12 ? 'PM' : 'AM';
      hrs = hrs % 12 || 12;
      return hrs + ':' + (mins < 10 ? '0' : '') + mins + ' ' + ampm;
    }
    if (diff < 2 * oneDay) return 'Yesterday';
    if (diff < 7 * oneDay) {
      var days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
      return days[d.getDay()];
    }
    var months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    return months[d.getMonth()] + ' ' + d.getDate();
  }

  function formatFullDate(isoStr) {
    if (!isoStr) return '';
    var d = new Date(isoStr);
    if (isNaN(d.getTime())) return '';
    var months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    var days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    var hrs = d.getHours();
    var mins = d.getMinutes();
    var ampm = hrs >= 12 ? 'PM' : 'AM';
    hrs = hrs % 12 || 12;
    return days[d.getDay()] + ', ' + months[d.getMonth()] + ' ' + d.getDate() + ', ' + d.getFullYear() + ' at ' + hrs + ':' + (mins < 10 ? '0' : '') + mins + ' ' + ampm;
  }

  function getInitials(name) {
    if (!name) return '?';
    var parts = name.trim().split(/\s+/);
    if (parts.length === 1) return parts[0].charAt(0).toUpperCase();
    return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase();
  }

  var senderColors = ['#3b82f6', '#8b5cf6', '#ec4899', '#f97316', '#10b981', '#06b6d4', '#f59e0b', '#6366f1', '#14b8a6', '#f43f5e'];

  function getSenderColor(idx) {
    return senderColors[idx % senderColors.length];
  }

  function render() {
    var messages = getFilteredMessages();
    var unreadCount = getUnreadCount('inbox');
    var labelCounts = getLabelCounts();
    var folderIcon = '';
    var folderLabel = '';
    for (var fi = 0; fi < FOLDERS.length; fi++) {
      if (FOLDERS[fi].id === activeFolder) { folderIcon = FOLDERS[fi].icon; folderLabel = FOLDERS[fi].label; break; }
    }

    var html = '';
    html += '<div class="page-container animate-fadeInUp" style="height:calc(100vh - var(--header-height) - var(--space-8));display:flex;flex-direction:column;padding:0;overflow:hidden">';
    html += '<div class="page-header" style="padding:var(--space-4) var(--space-6) 0;flex-shrink:0;display:none"><div><h1 class="page-title">Inbox</h1><p class="page-subtitle">Notifications and messages from across the platform</p></div></div>';
    html += '<div class="flex flex-1" style="min-height:0;overflow:hidden;position:relative">';

    html += renderSidebar(labelCounts);
    html += renderMainList(messages, unreadCount, folderIcon, folderLabel);
    html += renderMessagePanel();

    html += '</div></div>';

    if (composeOpen) {
      html += renderComposeModal();
    }

    container.innerHTML = html;
    bindEvents();
  }

  function renderSidebar(labelCounts) {
    var html = '';
    html += '<div id="inbox-sidebar" class="glass-card" style="width:240px;flex-shrink:0;display:flex;flex-direction:column;overflow:hidden;border-radius:var(--radius-lg) 0 0 var(--radius-lg);border-right:none' + (mobileView === 'message' ? ';display:none' : '') + '">';

    html += '<div style="padding:var(--space-3) var(--space-4);flex-shrink:0">';
    html += '<button class="btn btn-primary btn-sm btn-block" data-action="inbox:compose" style="border-radius:var(--radius-full);font-weight:600">✏️ Compose</button>';
    html += '</div>';

    html += '<div style="flex:1;overflow-y:auto;padding:0 var(--space-2)">';
    for (var i = 0; i < FOLDERS.length; i++) {
      var f = FOLDERS[i];
      var isActive = activeFolder === f.id && !activeLabel;
      var count = 0;
      if (f.id === 'inbox') count = getUnreadCount('inbox');
      html += '<div class="inbox-folder-item" data-action="inbox:folder:' + f.id + '" style="display:flex;align-items:center;gap:var(--space-2);padding:var(--space-2) var(--space-3);border-radius:var(--radius-md);cursor:pointer;margin-bottom:2px;transition:background 0.15s;background:' + (isActive ? 'rgba(59,130,246,0.15)' : 'transparent') + ';color:' + (isActive ? 'var(--accent-blue)' : 'var(--text-secondary)') + '">';
      html += '<span style="font-size:1rem;flex-shrink:0">' + f.icon + '</span>';
      html += '<span class="text-sm" style="flex:1;font-weight:' + (isActive ? '600' : '400') + '">' + f.label + '</span>';
      if (count > 0 && f.id === 'inbox') {
        html += '<span class="badge" style="background:var(--accent-blue);color:#fff;font-size:10px;min-width:18px;height:18px;display:flex;align-items:center;justify-content:center;padding:0 5px;border-radius:var(--radius-full);font-weight:700">' + count + '</span>';
      }
      html += '</div>';
    }

    html += '<div style="border-top:1px solid rgba(255,255,255,0.06);margin:var(--space-3) var(--space-2)"></div>';

    html += '<div style="padding:var(--space-2) var(--space-3);margin-bottom:var(--space-1)"><span class="text-xs" style="color:var(--text-muted);font-weight:600;text-transform:uppercase;letter-spacing:0.05em">Labels</span></div>';

    for (var label in LABELS) {
      if (!LABELS.hasOwnProperty(label)) continue;
      var lb = LABELS[label];
      var lActive = activeLabel === label;
      var lCount = labelCounts[label] || 0;
      html += '<div class="inbox-label-item" data-action="inbox:label:' + label + '" style="display:flex;align-items:center;gap:var(--space-2);padding:var(--space-2) var(--space-3);border-radius:var(--radius-md);cursor:pointer;margin-bottom:2px;transition:background 0.15s;background:' + (lActive ? 'rgba(59,130,246,0.15)' : 'transparent') + ';color:' + (lActive ? 'var(--accent-blue)' : 'var(--text-secondary)') + '">';
      html += '<span style="font-size:0.85rem;flex-shrink:0">' + lb.icon + '</span>';
      html += '<span class="text-sm" style="flex:1;font-weight:' + (lActive ? '600' : '400') + '">' + label.charAt(0).toUpperCase() + label.slice(1) + '</span>';
      if (lCount > 0) {
        html += '<span class="text-xs" style="color:var(--text-muted);font-size:11px">' + lCount + '</span>';
      }
      html += '</div>';
    }

    html += '</div></div>';
    return html;
  }

  function renderMainList(messages, unreadCount, folderIcon, folderLabel) {
    var html = '';
    html += '<div id="inbox-list-panel" class="glass-card flex-1" style="display:flex;flex-direction:column;overflow:hidden;border-radius:0;border-right:none;' + (mobileView === 'message' ? ';display:none' : '') + '">';

    html += '<div style="padding:var(--space-3) var(--space-4);border-bottom:1px solid rgba(255,255,255,0.06);flex-shrink:0">';
    html += '<div class="flex items-center justify-between" style="margin-bottom:var(--space-2)">';
    html += '<div class="flex items-center gap-2">';
    html += '<span style="font-size:1.1rem">' + folderIcon + '</span>';
    html += '<h2 class="text-lg font-semibold" style="color:var(--text-primary)">' + folderLabel + '</h2>';
    if (activeFolder === 'inbox' && unreadCount > 0) {
      html += '<span class="badge" style="background:rgba(59,130,246,0.15);color:var(--accent-blue);font-size:var(--text-xs);padding:2px 8px;border-radius:var(--radius-full)">' + unreadCount + ' unread</span>';
    }
    if (activeLabel) {
      var lb = LABELS[activeLabel];
      html += '<span style="background:rgba(255,255,255,0.06);padding:2px 10px;border-radius:var(--radius-full);font-size:var(--text-xs);color:var(--text-secondary)">' + (lb ? lb.icon : '') + ' ' + activeLabel.charAt(0).toUpperCase() + activeLabel.slice(1) + '</span>';
    }
    html += '</div>';
    html += '<div class="flex items-center gap-1">';
    html += '<button class="btn btn-ghost btn-icon-sm" data-action="inbox:refresh" title="Refresh" style="font-size:1rem">🔄</button>';
    html += '<button class="btn btn-ghost btn-icon-sm" data-action="inbox:compose" title="Compose" style="font-size:1rem;display:none">✏️</button>';
    html += '</div>';
    html += '</div>';
    html += '<div class="input-with-icon"><span class="input-icon" style="font-size:0.8rem">🔍</span><input type="text" class="input-field" id="inbox-search" placeholder="Search messages..." value="' + sanitize(searchQuery) + '" style="width:100%;padding:0.4rem 0.6rem 0.4rem 1.8rem;font-size:var(--text-sm);border-radius:var(--radius-full)"></div>';
    html += '</div>';

    if (messages.length === 0) {
      html += '<div class="flex-1 flex items-center justify-center flex-col" style="padding:var(--space-8);gap:var(--space-3)">';
      html += '<div style="width:72px;height:72px;border-radius:50%;background:rgba(255,255,255,0.04);display:flex;align-items:center;justify-content:center;font-size:2rem;color:var(--text-tertiary)">' + (activeFolder === 'trash' ? '🗑️' : '📭') + '</div>';
      html += '<div class="text-base font-medium" style="color:var(--text-tertiary)">' + (searchQuery ? 'No messages match your search' : 'No messages here') + '</div>';
      html += '<div class="text-sm" style="color:var(--text-muted);text-align:center">' + (searchQuery ? 'Try a different search term' : 'When you receive new messages, they will appear here') + '</div>';
      html += '</div>';
    } else {
      html += '<div style="flex:1;overflow-y:auto" id="inbox-msg-list">';
      for (var i = 0; i < messages.length; i++) {
        html += renderMessageRow(messages[i], i);
      }
      html += '</div>';
    }

    html += '</div>';
    return html;
  }

  function renderMessageRow(msg, idx) {
    var isActive = activeMsgId === msg.id;
    var readStyle = msg.read ? '400' : '700';
    var rowBg = isActive ? 'rgba(59,130,246,0.12)' : (msg.read ? 'transparent' : 'rgba(255,255,255,0.02)');
    var senderColor = getSenderColor(idx);
    var labelData = LABELS[msg.label] || {};

    var html = '';
    html += '<div class="inbox-msg-row" data-msg-id="' + msg.id + '" style="display:flex;align-items:center;gap:var(--space-3);padding:var(--space-2) var(--space-4);cursor:pointer;border-bottom:1px solid rgba(255,255,255,0.03);transition:background 0.12s;background:' + rowBg + ';position:relative">';

    if (!msg.read) {
      html += '<div style="position:absolute;left:6px;top:50%;transform:translateY(-50%);width:6px;height:6px;border-radius:50%;background:var(--accent-blue)"></div>';
    }

    html += '<div style="display:flex;align-items:center;gap:var(--space-2);flex-shrink:0;min-width:40px">';
    html += '<button class="inbox-star-btn" data-action="inbox:star:' + msg.id + '" style="background:none;border:none;cursor:pointer;font-size:0.9rem;padding:2px;color:' + (msg.starred ? '#f59e0b' : 'var(--text-muted)') + ';opacity:' + (msg.starred ? '1' : '0.4') + ';transition:opacity 0.15s">' + (msg.starred ? '★' : '☆') + '</button>';
    html += '<button class="inbox-important-btn" data-action="inbox:important:' + msg.id + '" style="background:none;border:none;cursor:pointer;font-size:0.75rem;padding:2px;color:' + (msg.important ? '#ef4444' : 'var(--text-muted)') + ';opacity:' + (msg.important ? '1' : '0.3') + ';transition:opacity 0.15s">❗</button>';
    html += '</div>';

    html += '<div class="avatar" style="width:36px;height:36px;font-size:11px;flex-shrink:0;background:' + senderColor + '">' + getInitials(msg.from) + '</div>';

    html += '<div class="flex-1 min-w-0" style="overflow:hidden">';
    html += '<div class="flex items-center justify-between" style="margin-bottom:2px">';
    html += '<div class="flex items-center gap-2" style="min-width:0">';
    html += '<span class="text-sm" style="font-weight:' + readStyle + ';color:var(--text-primary);white-space:nowrap;overflow:hidden;text-overflow:ellipsis;max-width:140px">' + sanitize(msg.from) + '</span>';
    if (labelData.icon) {
      html += '<span style="font-size:0.7rem;flex-shrink:0" title="' + msg.label + '">' + labelData.icon + '</span>';
    }
    html += '</div>';
    html += '<span class="text-xs" style="color:var(--text-muted);flex-shrink:0;font-size:11px;white-space:nowrap">' + formatDate(msg.date) + '</span>';
    html += '</div>';
    html += '<div style="margin-bottom:1px">';
    html += '<span class="text-sm" style="font-weight:' + (msg.read ? '400' : '600') + ';color:' + (msg.read ? 'var(--text-secondary)' : 'var(--text-primary)') + ';white-space:nowrap;overflow:hidden;text-overflow:ellipsis;display:block">' + sanitize(msg.subject) + '</span>';
    html += '</div>';
    html += '<div class="flex items-center justify-between">';
    html += '<span class="text-xs" style="color:var(--text-muted);white-space:nowrap;overflow:hidden;text-overflow:ellipsis;max-width:320px">' + sanitize(msg.preview) + '</span>';
    html += '<div class="flex items-center gap-1" style="flex-shrink:0">';
    if (msg.hasAttachments) {
      html += '<span style="font-size:0.75rem;color:var(--text-muted)">📎</span>';
    }
    html += '<button class="inbox-delete-btn" data-action="inbox:delete:' + msg.id + '" style="background:none;border:none;cursor:pointer;font-size:0.8rem;padding:2px;color:var(--text-muted);opacity:0;transition:opacity 0.15s" title="Delete">🗑️</button>';
    html += '</div>';
    html += '</div>';
    html += '</div>';

    html += '<div class="inbox-msg-id" style="font-size:10px;color:var(--text-muted);flex-shrink:0;font-family:monospace;opacity:0.5">' + msg.id + '</div>';

    html += '</div>';
    return html;
  }

  function renderMessagePanel() {
    var html = '';
    html += '<div id="inbox-reader-panel" class="glass-card" style="width:0;flex-shrink:0;display:flex;flex-direction:column;overflow:hidden;border-radius:0 var(--radius-lg) var(--radius-lg) 0;transition:width 0.25s ease;border-left:none;' + (mobileView === 'list' ? ';display:none' : '') + '" class="glass-card">';

    if (!activeMsgId) {
      html += '<div style="width:460px;min-width:460px">';
      html += '<div class="flex-1 flex items-center justify-center flex-col" style="padding:var(--space-8);gap:var(--space-3);min-height:300px">';
      html += '<div style="width:80px;height:80px;border-radius:50%;background:rgba(255,255,255,0.04);display:flex;align-items:center;justify-content:center;font-size:2rem;color:var(--text-tertiary)">📭</div>';
      html += '<div class="text-base font-medium" style="color:var(--text-tertiary)">Select a message to read</div>';
      html += '<div class="text-sm" style="color:var(--text-muted);text-align:center">Click on any message from the list to view its full content</div>';
      html += '</div>';
      html += '</div>';
      html += '</div>';
      return html;
    }

    var msg = null;
    var all = getAllMessages();
    for (var i = 0; i < all.length; i++) {
      if (all[i].id === activeMsgId) { msg = all[i]; break; }
    }
    if (!msg) {
      activeMsgId = null;
      html += '<div style="width:460px;min-width:460px"><div class="flex items-center justify-center" style="padding:var(--space-8)"><span style="color:var(--text-tertiary)">Message not found</span></div></div></div>';
      return html;
    }

    html += '<div style="width:460px;min-width:460px;display:flex;flex-direction:column;height:100%">';
    html += '<div style="padding:var(--space-3) var(--space-4);border-bottom:1px solid rgba(255,255,255,0.06);flex-shrink:0;display:flex;align-items:center;justify-content:space-between">';
    html += '<div class="flex items-center gap-2">';
    if (mobileView === 'message') {
      html += '<button class="btn btn-ghost btn-icon-sm" data-action="inbox:folder:' + activeFolder + '" style="font-size:1rem">←</button>';
    }
    html += '<span style="font-size:1rem">' + (LABELS[msg.label] ? LABELS[msg.label].icon : '📧') + '</span>';
    html += '<span class="text-sm font-semibold" style="color:var(--text-primary)">Message</span>';
    html += '</div>';
    html += '<div class="flex items-center gap-1">';
    html += '<button class="btn btn-ghost btn-icon-sm" data-action="inbox:star:' + msg.id + '" title="' + (msg.starred ? 'Unstar' : 'Star') + '" style="font-size:0.9rem;color:' + (msg.starred ? '#f59e0b' : 'var(--text-muted)') + '">' + (msg.starred ? '★' : '☆') + '</button>';
    html += '<button class="btn btn-ghost btn-icon-sm" data-action="inbox:delete:' + msg.id + '" title="Delete" style="font-size:0.9rem">🗑️</button>';
    html += '<button class="btn btn-ghost btn-icon-sm" data-action="inbox:closeMsg" title="Close" style="font-size:0.9rem">✕</button>';
    html += '</div>';
    html += '</div>';

    html += '<div style="flex:1;overflow-y:auto;padding:var(--space-4) var(--space-5)">';

    html += '<h2 style="font-size:1.1rem;font-weight:600;color:var(--text-primary);margin-bottom:var(--space-4);line-height:1.4">' + sanitize(msg.subject) + '</h2>';

    html += '<div class="flex items-center gap-3" style="margin-bottom:var(--space-4)">';
    html += '<div class="avatar" style="width:42px;height:42px;font-size:12px;background:' + getSenderColor(i) + '">' + getInitials(msg.from) + '</div>';
    html += '<div class="flex-1">';
    html += '<div class="text-sm font-semibold" style="color:var(--text-primary)">' + sanitize(msg.from) + '</div>';
    html += '<div class="text-xs" style="color:var(--text-muted)">' + sanitize(msg.email) + '</div>';
    html += '</div>';
    html += '<div style="text-align:right">';
    html += '<div class="text-xs" style="color:var(--text-tertiary)">' + formatFullDate(msg.date) + '</div>';
    html += '</div>';
    html += '</div>';

    if (!msg.read) {
      html += '<div style="margin-bottom:var(--space-3)">';
      html += '<button class="btn btn-ghost btn-sm" data-action="inbox:markRead:' + msg.id + '" style="font-size:var(--text-xs);color:var(--accent-blue)">✓ Mark as read</button>';
      html += '</div>';
    }

    if (msg.hasAttachments && msg.attachments && msg.attachments.length > 0) {
      html += '<div style="background:rgba(255,255,255,0.03);border:1px solid rgba(255,255,255,0.06);border-radius:var(--radius-md);padding:var(--space-3);margin-bottom:var(--space-4)">';
      html += '<div class="flex items-center gap-2" style="margin-bottom:var(--space-2)">';
      html += '<span style="font-size:0.85rem">📎</span>';
      html += '<span class="text-xs font-medium" style="color:var(--text-secondary)">' + msg.attachments.length + ' Attachment' + (msg.attachments.length > 1 ? 's' : '') + '</span>';
      html += '</div>';
      for (var ai = 0; ai < msg.attachments.length; ai++) {
        var att = msg.attachments[ai];
        html += '<div class="inbox-attachment" style="display:flex;align-items:center;gap:var(--space-2);padding:var(--space-2);background:rgba(255,255,255,0.03);border-radius:var(--radius-sm);margin-bottom:4px;cursor:pointer;transition:background 0.15s">';
        html += '<span style="font-size:1.1rem">📄</span>';
        html += '<div class="flex-1 min-w-0">';
        html += '<div class="text-xs font-medium" style="color:var(--text-primary);white-space:nowrap;overflow:hidden;text-overflow:ellipsis">' + sanitize(att.name) + '</div>';
        html += '<div class="text-xs" style="color:var(--text-muted)">' + att.size + '</div>';
        html += '</div>';
        html += '<span style="font-size:0.75rem;color:var(--accent-blue)">⬇️</span>';
        html += '</div>';
      }
      html += '</div>';
    }

    html += '<div style="font-size:var(--text-sm);color:var(--text-secondary);line-height:1.7">' + msg.body + '</div>';

    html += '</div>';

    html += '<div style="padding:var(--space-3) var(--space-4);border-top:1px solid rgba(255,255,255,0.06);flex-shrink:0;display:flex;gap:var(--space-2)">';
    html += '<button class="btn btn-primary btn-sm" style="border-radius:var(--radius-full);font-size:var(--text-xs)" data-action="inbox:reply">↩️ Reply</button>';
    html += '<button class="btn btn-ghost btn-sm" style="border-radius:var(--radius-full);font-size:var(--text-xs)" data-action="inbox:forward">↪️ Forward</button>';
    html += '<button class="btn btn-ghost btn-sm" style="border-radius:var(--radius-full);font-size:var(--text-xs)">⋯ More</button>';
    html += '</div>';

    html += '</div>';

    html += '</div>';
    return html;
  }

  function renderComposeModal() {
    var html = '';
    html += '<div id="inbox-compose-overlay" class="modal-overlay" style="animation:fadeIn 0.2s ease">';
    html += '<div class="modal" style="max-width:560px;width:100%">';
    html += '<div class="modal-header">';
    html += '<div class="font-semibold text-lg">New Message</div>';
    html += '<button class="modal-close" data-action="inbox:closeMsg">✕</button>';
    html += '</div>';
    html += '<div class="modal-body">';
    html += '<div style="margin-bottom:var(--space-3)">';
    html += '<label class="text-xs font-medium" style="color:var(--text-secondary);display:block;margin-bottom:4px">To</label>';
    html += '<input type="text" class="input-field" id="inbox-compose-to" placeholder="Recipient email" style="width:100%;padding:0.5rem 0.75rem;font-size:var(--text-sm)">';
    html += '</div>';
    html += '<div style="margin-bottom:var(--space-3)">';
    html += '<label class="text-xs font-medium" style="color:var(--text-secondary);display:block;margin-bottom:4px">Subject</label>';
    html += '<input type="text" class="input-field" id="inbox-compose-subject" placeholder="Subject" style="width:100%;padding:0.5rem 0.75rem;font-size:var(--text-sm)">';
    html += '</div>';
    html += '<div style="margin-bottom:var(--space-3)">';
    html += '<label class="text-xs font-medium" style="color:var(--text-secondary);display:block;margin-bottom:4px">Message</label>';
    html += '<textarea class="input-field" id="inbox-compose-body" placeholder="Write your message..." rows="8" style="width:100%;padding:0.5rem 0.75rem;font-size:var(--text-sm);resize:vertical;line-height:1.6"></textarea>';
    html += '</div>';
    html += '<div style="margin-bottom:var(--space-2)">';
    html += '<button class="btn btn-ghost btn-sm" style="font-size:var(--text-xs);color:var(--text-muted)">📎 Attach file</button>';
    html += '</div>';
    html += '</div>';
    html += '<div class="modal-footer">';
    html += '<button class="btn btn-secondary" data-action="inbox:closeMsg">Discard</button>';
    html += '<button class="btn btn-primary" data-action="inbox:send">Send Message</button>';
    html += '</div>';
    html += '</div></div>';
    return html;
  }

  function bindEvents() {
    var searchInput = document.getElementById('inbox-search');
    if (searchInput) {
      searchInput.addEventListener('input', function() {
        searchQuery = this.value;
        render();
      });
    }

    var rows = document.querySelectorAll('.inbox-msg-row');
    for (var i = 0; i < rows.length; i++) {
      (function(row) {
        row.addEventListener('click', function(e) {
          if (e.target.closest('.inbox-star-btn') || e.target.closest('.inbox-important-btn') || e.target.closest('.inbox-delete-btn')) return;
          var msgId = row.getAttribute('data-msg-id');
          if (msgId) openMessage(msgId);
        });
        row.addEventListener('mouseenter', function() {
          var delBtn = row.querySelector('.inbox-delete-btn');
          if (delBtn) delBtn.style.opacity = '0.6';
        });
        row.addEventListener('mouseleave', function() {
          var delBtn = row.querySelector('.inbox-delete-btn');
          if (delBtn) delBtn.style.opacity = '0';
        });
      })(rows[i]);
    }

    var folderItems = document.querySelectorAll('.inbox-folder-item');
    for (var j = 0; j < folderItems.length; j++) {
      (function(item) {
        item.addEventListener('mouseenter', function() {
          if (!item.style.background || item.style.background === 'transparent' || item.style.background.indexOf('rgba(59,130,246') === -1) {
            item.style.background = 'rgba(255,255,255,0.04)';
          }
        });
        item.addEventListener('mouseleave', function() {
          if (item.style.background === 'rgba(255,255,255,0.04)') {
            item.style.background = 'transparent';
          }
        });
      })(folderItems[j]);
    }

    var attachments = document.querySelectorAll('.inbox-attachment');
    for (var k = 0; k < attachments.length; k++) {
      (function(att) {
        att.addEventListener('mouseenter', function() { att.style.background = 'rgba(255,255,255,0.06)'; });
        att.addEventListener('mouseleave', function() { att.style.background = 'rgba(255,255,255,0.03)'; });
      })(attachments[k]);
    }

    if (composeOpen) {
      var overlay = document.getElementById('inbox-compose-overlay');
      if (overlay) {
        overlay.addEventListener('click', function(e) {
          if (e.target === overlay) {
            composeOpen = false;
            render();
          }
        });
      }
    }

    var readerPanel = document.getElementById('inbox-reader-panel');
    if (readerPanel && activeMsgId) {
      readerPanel.style.width = '460px';
    }
  }

  function switchFolder(folderId) {
    activeFolder = folderId;
    activeLabel = '';
    activeMsgId = null;
    searchQuery = '';
    mobileView = 'list';
    render();
  }

  function openMessage(msgId) {
    activeMsgId = msgId;
    var all = getAllMessages();
    for (var i = 0; i < all.length; i++) {
      if (all[i].id === msgId) {
        all[i].read = true;
        break;
      }
    }
    if (window.innerWidth < 768) {
      mobileView = 'message';
    }
    render();
  }

  function closeMessage() {
    activeMsgId = null;
    composeOpen = false;
    mobileView = 'list';
    render();
  }

  function toggleStar(msgId) {
    var all = getAllMessages();
    for (var i = 0; i < all.length; i++) {
      if (all[i].id === msgId) {
        all[i].starred = !all[i].starred;
        break;
      }
    }
    render();
  }

  function toggleImportant(msgId) {
    var all = getAllMessages();
    for (var i = 0; i < all.length; i++) {
      if (all[i].id === msgId) {
        all[i].important = !all[i].important;
        break;
      }
    }
    render();
  }

  function deleteMessage(msgId) {
    var all = getAllMessages();
    for (var i = 0; i < all.length; i++) {
      if (all[i].id === msgId) {
        if (all[i].folder === 'trash') {
          trashMessages = trashMessages.filter(function(m) { return m.id !== msgId; });
          if (activeMsgId === msgId) activeMsgId = null;
          render();
          return;
        }
        all[i].folder = 'trash';
        if (activeMsgId === msgId) activeMsgId = null;
        break;
      }
    }
    render();
  }

  function markAsRead(msgId) {
    var all = getAllMessages();
    for (var i = 0; i < all.length; i++) {
      if (all[i].id === msgId) {
        all[i].read = true;
        break;
      }
    }
    render();
  }

  function searchMessages() {
    var input = document.getElementById('inbox-search');
    if (input) {
      searchQuery = input.value;
      render();
    }
  }

  function refreshInbox() {
    searchQuery = '';
    activeMsgId = null;
    render();
    if (window.UI && window.UI.showToast) {
      window.UI.showToast('Inbox refreshed', 'success');
    }
  }

  function filterByLabel(label) {
    if (activeLabel === label) {
      activeLabel = '';
    } else {
      activeLabel = label;
    }
    activeMsgId = null;
    render();
  }

  function openCompose() {
    composeOpen = true;
    render();
    setTimeout(function() {
      var toInput = document.getElementById('inbox-compose-to');
      if (toInput) toInput.focus();
    }, 100);
  }

  function sendMessage() {
    var toInput = document.getElementById('inbox-compose-to');
    var subjectInput = document.getElementById('inbox-compose-subject');
    var bodyInput = document.getElementById('inbox-compose-body');

    var to = toInput ? toInput.value.trim() : '';
    var subject = subjectInput ? subjectInput.value.trim() : '';
    var body = bodyInput ? bodyInput.value.trim() : '';

    if (!to) {
      if (window.UI && window.UI.showToast) window.UI.showToast('Please enter a recipient', 'warning');
      return;
    }
    if (!subject) {
      if (window.UI && window.UI.showToast) window.UI.showToast('Please enter a subject', 'warning');
      return;
    }

    var preview = body.length > 80 ? body.slice(0, 80) + '...' : body;
    sentMessages.unshift({
      id: 'SENT-' + String(sentMessages.length + 100).padStart(3, '0'),
      from: 'You',
      email: 'me@edumentee.com',
      to: to,
      subject: subject,
      preview: preview,
      body: '<p>' + sanitize(body).replace(/\n/g, '</p><p>') + '</p>',
      date: new Date().toISOString(),
      folder: 'sent',
      label: '',
      starred: false,
      important: false,
      read: true,
      hasAttachments: false,
      attachments: []
    });

    composeOpen = false;
    if (activeFolder === 'sent') {
      render();
    } else {
      render();
    }
    if (window.UI && window.UI.showToast) window.UI.showToast('Message sent successfully', 'success');
  }

  window.switchFolder = switchFolder;
  window.openMessage = openMessage;
  window.toggleStar = toggleStar;
  window.toggleImportant = toggleImportant;
  window.deleteMessage = deleteMessage;
  window.searchMessages = searchMessages;
  window.openCompose = openCompose;
  window.sendMessage = sendMessage;
  window.closeMessage = closeMessage;
  window.markAsRead = markAsRead;
  window.refreshInbox = refreshInbox;
  window.filterByLabel = filterByLabel;

  render();
};
