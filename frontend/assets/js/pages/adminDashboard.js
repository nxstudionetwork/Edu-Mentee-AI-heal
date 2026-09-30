window.renderPage = window.renderPage || {};

window.renderPage.adminDashboard = function(params) {
  var mainContent = document.getElementById('main-content');
  if (!mainContent) return;
  var Store = window.Store;
  var Utils = window.Utils;
  var API = window.API;
  var md = window.mockData;
  var Router = window.Router;

  var currentTab = 'users';
  var searchQuery = '';
  var typeFilter = '';
  var categoryFilter = '';

  var sampleUsers = [
    { id: 'u1', name: 'Aarav Sharma', email: 'aarav.sharma@example.com', role: 'student', class: '10', status: 'active' },
    { id: 'u2', name: 'Priya Patel', email: 'priya.patel@example.com', role: 'student', class: '12', status: 'active' },
    { id: 'u3', name: 'Rahul Verma', email: 'rahul.verma@example.com', role: 'teacher', class: '11', status: 'active' },
    { id: 'u4', name: 'Ananya Gupta', email: 'ananya.gupta@example.com', role: 'student', class: '9', status: 'suspended' },
    { id: 'u5', name: 'Vikram Singh', email: 'vikram.singh@example.com', role: 'teacher', class: '10', status: 'active' },
    { id: 'u6', name: 'Neha Kapoor', email: 'neha.kapoor@example.com', role: 'student', class: '8', status: 'active' },
    { id: 'u7', name: 'Arjun Nair', email: 'arjun.nair@example.com', role: 'student', class: '11', status: 'active' },
    { id: 'u8', name: 'Meera Joshi', email: 'meera.joshi@example.com', role: 'teacher', class: '12', status: 'active' },
    { id: 'u9', name: 'Karan Mehta', email: 'karan.mehta@example.com', role: 'student', class: '10', status: 'suspended' },
    { id: 'u10', name: 'Sneha Reddy', email: 'sneha.reddy@example.com', role: 'student', class: '7', status: 'active' }
  ];

  var sampleResources = [
    { id: 'r1', title: 'Mathematics NCERT Solutions', type: 'pdf', subject: 'Mathematics', downloads: 2340, status: 'approved' },
    { id: 'r2', title: 'Physics Lab Manual Class 12', type: 'lab-manual', subject: 'Physics', downloads: 1560, status: 'approved' },
    { id: 'r3', title: 'Chemistry Formula Sheet', type: 'formula-sheet', subject: 'Chemistry', downloads: 3450, status: 'pending' },
    { id: 'r4', title: 'English Grammar Notes', type: 'notes', subject: 'English', downloads: 1200, status: 'approved' },
    { id: 'r5', title: 'Biology Question Bank', type: 'question-bank', subject: 'Biology', downloads: 980, status: 'pending' },
    { id: 'r6', title: 'History Mind Map', type: 'mind-map', subject: 'History', downloads: 670, status: 'rejected' },
    { id: 'r7', title: 'Geography Reference Book', type: 'reference', subject: 'Geography', downloads: 890, status: 'approved' },
    { id: 'r8', title: 'Computer Science Worksheets', type: 'worksheet', subject: 'Computer Science', downloads: 1450, status: 'pending' },
    { id: 'r9', title: 'Political Science Notes', type: 'notes', subject: 'Political Science', downloads: 560, status: 'approved' },
    { id: 'r10', title: 'Economics Formula Sheet', type: 'formula-sheet', subject: 'Economics', downloads: 780, status: 'approved' }
  ];

  var sampleProducts = [
    { id: 'p1', title: 'Board Exam Prep Bundle', category: 'exam-bundles', price: 1499, stock: 45, sales: 230, featured: true, status: 'active' },
    { id: 'p2', title: 'JEE Advanced Mock Tests', category: 'mock-tests', price: 999, stock: 120, sales: 450, featured: true, status: 'active' },
    { id: 'p3', title: 'NEET Practice Books Set', category: 'practice-books', price: 1299, stock: 60, sales: 180, featured: false, status: 'active' },
    { id: 'p4', title: 'Premium Stationery Kit', category: 'stationery', price: 499, stock: 200, sales: 560, featured: false, status: 'active' },
    { id: 'p5', title: 'Class 10 Science Notes', category: 'notes', price: 299, stock: 0, sales: 890, featured: false, status: 'inactive' },
    { id: 'p6', title: 'Calculus Video Course', category: 'courses', price: 2499, stock: 35, sales: 120, featured: true, status: 'active' },
    { id: 'p7', title: 'Organic Chemistry Guide', category: 'books', price: 599, stock: 80, sales: 310, featured: false, status: 'active' },
    { id: 'p8', title: 'Wireless Headphones', category: 'accessories', price: 1999, stock: 25, sales: 90, featured: false, status: 'active' },
    { id: 'p9', title: 'SSC Practice Workbook', category: 'practice-books', price: 399, stock: 55, sales: 160, featured: false, status: 'active' },
    { id: 'p10', title: 'English Literature Bundle', category: 'books', price: 899, stock: 40, sales: 200, featured: false, status: 'inactive' }
  ];

  var sampleScholarships = [
    { id: 's1', name: 'National Merit Scholarship', provider: 'Government of India', amount: 60000, deadline: '2026-09-15', applicants: 2340, status: 'active' },
    { id: 's2', name: 'STEM Excellence Award', provider: 'IIT Foundation', amount: 120000, deadline: '2026-08-30', applicants: 890, status: 'active' },
    { id: 's3', name: 'Need-Based Education Grant', provider: 'EduMentee Foundation', amount: 30000, deadline: '2026-10-01', applicants: 1560, status: 'active' },
    { id: 's4', name: 'Sports Talent Scholarship', provider: 'Sports Authority', amount: 45000, deadline: '2026-07-31', applicants: 450, status: 'pending' },
    { id: 's5', name: 'Girl Child Education Fund', provider: 'UNICEF India', amount: 25000, deadline: '2026-09-30', applicants: 1200, status: 'active' },
    { id: 's6', name: 'Research Innovation Grant', provider: 'DRDO', amount: 200000, deadline: '2026-11-15', applicants: 340, status: 'pending' },
    { id: 's7', name: 'State Topper Award', provider: 'State Education Board', amount: 50000, deadline: '2026-08-15', applicants: 780, status: 'active' },
    { id: 's8', name: 'Digital Learning Scholarship', provider: 'TechEdu Partners', amount: 15000, deadline: '2026-10-30', applicants: 2100, status: 'active' },
    { id: 's9', name: 'Merit cum Means Scholarship', provider: 'Minority Affairs Ministry', amount: 35000, deadline: '2026-09-01', applicants: 1670, status: 'active' },
    { id: 's10', name: 'Young Scientist Fellowship', provider: 'CSIR', amount: 150000, deadline: '2026-12-01', applicants: 290, status: 'pending' }
  ];

  var sampleExams = [
    { id: 'e1', name: 'Mid-Term Mathematics', type: 'mid-term', class: '10', date: '2026-07-20', participants: 120, status: 'scheduled' },
    { id: 'e2', name: 'Physics Unit Test', type: 'unit-test', class: '12', date: '2026-07-18', participants: 85, status: 'scheduled' },
    { id: 'e3', name: 'Chemistry Practical Assessment', type: 'practical', class: '11', date: '2026-07-25', participants: 60, status: 'scheduled' },
    { id: 'e4', name: 'English Literature Final', type: 'final', class: '10', date: '2026-08-05', participants: 150, status: 'upcoming' },
    { id: 'e5', name: 'Biology Weekly Quiz', type: 'quiz', class: '9', date: '2026-07-15', participants: 95, status: 'completed' },
    { id: 'e6', name: 'History Revision Test', type: 'unit-test', class: '8', date: '2026-07-22', participants: 70, status: 'scheduled' },
    { id: 'e7', name: 'Mathematics Board Exam Prep', type: 'mock-board', class: '12', date: '2026-08-10', participants: 200, status: 'upcoming' },
    { id: 'e8', name: 'Hindi Grammar Assessment', type: 'quiz', class: '7', date: '2026-07-16', participants: 55, status: 'completed' },
    { id: 'e9', name: 'Computer Science Practical', type: 'practical', class: '11', date: '2026-07-28', participants: 45, status: 'scheduled' },
    { id: 'e10', name: 'Social Studies Term Exam', type: 'mid-term', class: '9', date: '2026-08-01', participants: 110, status: 'upcoming' }
  ];

  var monthlyUsers = [320, 480, 560, 720, 890, 1050, 1120, 1240, 1380, 1520, 1680, 1800];
  var monthlyLabels = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
  var weeklyRevenue = [125000, 98000, 156000, 132000, 175000, 142000, 189000];
  var revenueDays = ['Mon','Tue','Wed','Thu','Fri','Sat','Sun'];
  var popularSubjects = [
    { name: 'Mathematics', count: 4560 },
    { name: 'Physics', count: 3200 },
    { name: 'Chemistry', count: 2980 },
    { name: 'Biology', count: 2450 },
    { name: 'English', count: 2100 },
    { name: 'Computer Science', count: 1800 }
  ];

  function renderModal(htmlContent) {
    var overlay = document.createElement('div');
    overlay.className = 'modal-overlay';
    overlay.style.cssText = 'position:fixed;top:0;left:0;right:0;bottom:0;background:rgba(0,0,0,0.6);backdrop-filter:blur(4px);z-index:1000;display:flex;align-items:center;justify-content:center;animation:fadeIn 0.2s ease';
    overlay.innerHTML = htmlContent;
    overlay.addEventListener('click', function(e) {
      if (e.target === overlay) overlay.remove();
    });
    document.body.appendChild(overlay);
    return overlay;
  }

  function closeModal(overlay) {
    if (overlay && overlay.parentNode) overlay.remove();
  }

  function showConfirmModal(message, callback) {
    var overlay = renderModal('\
<div class="modal" style="background:var(--bg-card);border:1px solid var(--border-color);border-radius:20px;padding:0;width:420px;max-width:90vw;box-shadow:0 25px 50px rgba(0,0,0,0.4);animation:slideUp 0.3s ease">\
  <div style="padding:32px 32px 24px;text-align:center">\
    <div style="width:56px;height:56px;border-radius:50%;background:rgba(245,158,11,0.15);display:flex;align-items:center;justify-content:center;margin:0 auto 16px;font-size:1.5rem">⚠️</div>\
    <div style="font-size:1.1rem;font-weight:600;margin-bottom:8px">Confirm Action</div>\
    <div style="font-size:0.875rem;color:var(--text-secondary);line-height:1.5">' + message + '</div>\
  </div>\
  <div style="padding:16px 32px 32px;display:flex;gap:12px;justify-content:center">\
    <button class="btn btn-secondary btn-sm" id="confirm-cancel" style="min-width:100px">Cancel</button>\
    <button class="btn btn-primary btn-sm" id="confirm-ok" style="min-width:100px;background:var(--accent-red);border-color:var(--accent-red)">Confirm</button>\
  </div>\
</div>');
    overlay.querySelector('#confirm-cancel').addEventListener('click', function() { overlay.remove(); });
    overlay.querySelector('#confirm-ok').addEventListener('click', function() { overlay.remove(); if (callback) callback(); });
  }

  function renderUserEditModal(user) {
    var overlay = renderModal('\
<div class="modal" style="background:var(--bg-card);border:1px solid var(--border-color);border-radius:20px;padding:0;width:480px;max-width:90vw;box-shadow:0 25px 50px rgba(0,0,0,0.4);animation:slideUp 0.3s ease">\
  <div style="padding:24px 32px;border-bottom:1px solid var(--border-color);display:flex;align-items:center;justify-content:space-between">\
    <div style="font-size:1.15rem;font-weight:600">Edit User</div>\
    <button class="btn btn-ghost btn-sm" id="modal-close" style="font-size:1.25rem;line-height:1">&times;</button>\
  </div>\
  <div style="padding:24px 32px">\
    <div style="margin-bottom:16px">\
      <label style="display:block;font-size:0.8rem;font-weight:600;margin-bottom:6px;color:var(--text-secondary)">Name</label>\
      <input class="input-field" id="edit-name" value="' + Utils.sanitizeHTML(user.name) + '" style="width:100%">\
    </div>\
    <div style="margin-bottom:16px">\
      <label style="display:block;font-size:0.8rem;font-weight:600;margin-bottom:6px;color:var(--text-secondary)">Email</label>\
      <input class="input-field" id="edit-email" value="' + Utils.sanitizeHTML(user.email) + '" style="width:100%">\
    </div>\
    <div style="margin-bottom:16px">\
      <label style="display:block;font-size:0.8rem;font-weight:600;margin-bottom:6px;color:var(--text-secondary)">Role</label>\
      <select class="input-field" id="edit-role" style="width:100%">\
        <option value="student"' + (user.role === 'student' ? ' selected' : '') + '>Student</option>\
        <option value="teacher"' + (user.role === 'teacher' ? ' selected' : '') + '>Teacher</option>\
        <option value="admin"' + (user.role === 'admin' ? ' selected' : '') + '>Admin</option>\
      </select>\
    </div>\
    <div style="margin-bottom:8px">\
      <label style="display:block;font-size:0.8rem;font-weight:600;margin-bottom:6px;color:var(--text-secondary)">Class</label>\
      <input class="input-field" id="edit-class" value="' + Utils.sanitizeHTML(user.class || '') + '" style="width:100%">\
    </div>\
  </div>\
  <div style="padding:16px 32px 24px;display:flex;gap:12px;justify-content:flex-end;border-top:1px solid var(--border-color)">\
    <button class="btn btn-secondary btn-sm" id="edit-cancel">Cancel</button>\
    <button class="btn btn-primary btn-sm" id="edit-save">Save Changes</button>\
  </div>\
</div>');
    overlay.querySelector('#modal-close').addEventListener('click', function() { overlay.remove(); });
    overlay.querySelector('#edit-cancel').addEventListener('click', function() { overlay.remove(); });
    overlay.querySelector('#edit-save').addEventListener('click', function() {
      var newName = overlay.querySelector('#edit-name').value.trim();
      var newEmail = overlay.querySelector('#edit-email').value.trim();
      if (newName && newEmail) {
        user.name = newName;
        user.email = newEmail;
        user.role = overlay.querySelector('#edit-role').value;
        user.class = overlay.querySelector('#edit-class').value.trim();
        overlay.remove();
        renderTabContent();
      }
    });
  }

  function renderAddScholarshipModal() {
    var overlay = renderModal('\
<div class="modal" style="background:var(--bg-card);border:1px solid var(--border-color);border-radius:20px;padding:0;width:520px;max-width:90vw;box-shadow:0 25px 50px rgba(0,0,0,0.4);animation:slideUp 0.3s ease;max-height:90vh;overflow-y:auto">\
  <div style="padding:24px 32px;border-bottom:1px solid var(--border-color);display:flex;align-items:center;justify-content:space-between;position:sticky;top:0;background:var(--bg-card);z-index:1">\
    <div style="font-size:1.15rem;font-weight:600">Add New Scholarship</div>\
    <button class="btn btn-ghost btn-sm" id="sch-close" style="font-size:1.25rem;line-height:1">&times;</button>\
  </div>\
  <div style="padding:24px 32px">\
    <div style="margin-bottom:16px">\
      <label style="display:block;font-size:0.8rem;font-weight:600;margin-bottom:6px;color:var(--text-secondary)">Scholarship Name</label>\
      <input class="input-field" id="sch-name" placeholder="e.g. National Merit Scholarship" style="width:100%">\
    </div>\
    <div style="margin-bottom:16px">\
      <label style="display:block;font-size:0.8rem;font-weight:600;margin-bottom:6px;color:var(--text-secondary)">Provider</label>\
      <input class="input-field" id="sch-provider" placeholder="e.g. Government of India" style="width:100%">\
    </div>\
    <div style="margin-bottom:16px;display:flex;gap:12px">\
      <div style="flex:1">\
        <label style="display:block;font-size:0.8rem;font-weight:600;margin-bottom:6px;color:var(--text-secondary)">Amount (₹)</label>\
        <input class="input-field" id="sch-amount" type="number" placeholder="e.g. 50000" style="width:100%">\
      </div>\
      <div style="flex:1">\
        <label style="display:block;font-size:0.8rem;font-weight:600;margin-bottom:6px;color:var(--text-secondary)">Deadline</label>\
        <input class="input-field" id="sch-deadline" type="date" style="width:100%">\
      </div>\
    </div>\
    <div style="margin-bottom:16px">\
      <label style="display:block;font-size:0.8rem;font-weight:600;margin-bottom:6px;color:var(--text-secondary)">Description</label>\
      <textarea class="input-field" id="sch-desc" rows="3" placeholder="Brief description of the scholarship" style="width:100%;resize:vertical;font-family:inherit"></textarea>\
    </div>\
    <div style="margin-bottom:8px">\
      <label style="display:block;font-size:0.8rem;font-weight:600;margin-bottom:6px;color:var(--text-secondary)">Eligibility</label>\
      <textarea class="input-field" id="sch-eligibility" rows="2" placeholder="Eligibility criteria" style="width:100%;resize:vertical;font-family:inherit"></textarea>\
    </div>\
  </div>\
  <div style="padding:16px 32px 24px;display:flex;gap:12px;justify-content:flex-end;border-top:1px solid var(--border-color)">\
    <button class="btn btn-secondary btn-sm" id="sch-cancel">Cancel</button>\
    <button class="btn btn-primary btn-sm" id="sch-save">Add Scholarship</button>\
  </div>\
</div>');
    overlay.querySelector('#sch-close').addEventListener('click', function() { overlay.remove(); });
    overlay.querySelector('#sch-cancel').addEventListener('click', function() { overlay.remove(); });
    overlay.querySelector('#sch-save').addEventListener('click', function() {
      var name = overlay.querySelector('#sch-name').value.trim();
      var provider = overlay.querySelector('#sch-provider').value.trim();
      var amount = overlay.querySelector('#sch-amount').value;
      var deadline = overlay.querySelector('#sch-deadline').value;
      if (name && provider && amount && deadline) {
        sampleScholarships.unshift({
          id: 's_new_' + Date.now(),
          name: name,
          provider: provider,
          amount: parseInt(amount),
          deadline: deadline,
          applicants: 0,
          status: 'pending'
        });
        overlay.remove();
        renderTabContent();
      }
    });
  }

  function renderScheduleExamModal() {
    var overlay = renderModal('\
<div class="modal" style="background:var(--bg-card);border:1px solid var(--border-color);border-radius:20px;padding:0;width:520px;max-width:90vw;box-shadow:0 25px 50px rgba(0,0,0,0.4);animation:slideUp 0.3s ease">\
  <div style="padding:24px 32px;border-bottom:1px solid var(--border-color);display:flex;align-items:center;justify-content:space-between">\
    <div style="font-size:1.15rem;font-weight:600">Schedule New Exam</div>\
    <button class="btn btn-ghost btn-sm" id="exam-close" style="font-size:1.25rem;line-height:1">&times;</button>\
  </div>\
  <div style="padding:24px 32px">\
    <div style="margin-bottom:16px">\
      <label style="display:block;font-size:0.8rem;font-weight:600;margin-bottom:6px;color:var(--text-secondary)">Exam Name</label>\
      <input class="input-field" id="exam-name" placeholder="e.g. Mid-Term Mathematics" style="width:100%">\
    </div>\
    <div style="margin-bottom:16px;display:flex;gap:12px">\
      <div style="flex:1">\
        <label style="display:block;font-size:0.8rem;font-weight:600;margin-bottom:6px;color:var(--text-secondary)">Type</label>\
        <select class="input-field" id="exam-type" style="width:100%">\
          <option value="mid-term">Mid-Term</option>\
          <option value="unit-test">Unit Test</option>\
          <option value="final">Final</option>\
          <option value="quiz">Quiz</option>\
          <option value="practical">Practical</option>\
          <option value="mock-board">Mock Board</option>\
        </select>\
      </div>\
      <div style="flex:1">\
        <label style="display:block;font-size:0.8rem;font-weight:600;margin-bottom:6px;color:var(--text-secondary)">Class</label>\
        <select class="input-field" id="exam-class" style="width:100%">\
          <option value="6">Class 6</option><option value="7">Class 7</option><option value="8">Class 8</option>\
          <option value="9">Class 9</option><option value="10">Class 10</option><option value="11">Class 11</option><option value="12">Class 12</option>\
        </select>\
      </div>\
    </div>\
    <div style="margin-bottom:16px;display:flex;gap:12px">\
      <div style="flex:1">\
        <label style="display:block;font-size:0.8rem;font-weight:600;margin-bottom:6px;color:var(--text-secondary)">Date</label>\
        <input class="input-field" id="exam-date" type="date" style="width:100%">\
      </div>\
      <div style="flex:1">\
        <label style="display:block;font-size:0.8rem;font-weight:600;margin-bottom:6px;color:var(--text-secondary)">Duration (min)</label>\
        <input class="input-field" id="exam-duration" type="number" placeholder="e.g. 60" style="width:100%">\
      </div>\
    </div>\
  </div>\
  <div style="padding:16px 32px 24px;display:flex;gap:12px;justify-content:flex-end;border-top:1px solid var(--border-color)">\
    <button class="btn btn-secondary btn-sm" id="exam-cancel">Cancel</button>\
    <button class="btn btn-primary btn-sm" id="exam-save">Schedule Exam</button>\
  </div>\
</div>');
    overlay.querySelector('#exam-close').addEventListener('click', function() { overlay.remove(); });
    overlay.querySelector('#exam-cancel').addEventListener('click', function() { overlay.remove(); });
    overlay.querySelector('#exam-save').addEventListener('click', function() {
      var name = overlay.querySelector('#exam-name').value.trim();
      var date = overlay.querySelector('#exam-date').value;
      if (name && date) {
        sampleExams.unshift({
          id: 'e_new_' + Date.now(),
          name: name,
          type: overlay.querySelector('#exam-type').value,
          class: overlay.querySelector('#exam-class').value,
          date: date,
          participants: 0,
          status: 'scheduled'
        });
        overlay.remove();
        renderTabContent();
      }
    });
  }

  function renderStatCard(label, value, icon, gradient, subtitle) {
    return '\
<div class="glass-card" style="padding:20px 24px;display:flex;align-items:center;gap:16px;cursor:default">\
   <div style="width:52px;height:52px;border-radius:16px;background:' + gradient + ';display:flex;align-items:center;justify-content:center;font-size:1.5rem;flex-shrink:0;box-shadow:0 4px 12px rgba(0,0,0,0.3)">' + icon + '</div>\
  <div>\
    <div style="font-size:1.5rem;font-weight:700;line-height:1.2">' + value + '</div>\
    <div style="font-size:0.8rem;color:var(--text-secondary);margin-top:2px">' + label + '</div>' + (subtitle ? '<div style="font-size:0.7rem;color:var(--text-tertiary);margin-top:1px">' + subtitle + '</div>' : '') + '\
  </div>\
</div>';
  }

  function renderBarChart(bars, labels, maxVal, barColor, height) {
    if (!height) height = 140;
    var max = maxVal || Math.max.apply(null, bars);
    var html = '<div style="display:flex;align-items:flex-end;gap:8px;height:' + height + 'px;padding:0 8px">';
    for (var i = 0; i < bars.length; i++) {
      var pct = max > 0 ? (bars[i] / max * 100) : 0;
      html += '\
<div style="flex:1;display:flex;flex-direction:column;align-items:center;gap:6px">\
  <div style="width:100%;height:' + pct + '%;background:' + barColor + ';border-radius:6px 6px 2px 2px;min-height:4px;transition:height 0.3s ease;position:relative">\
    <div style="position:absolute;top:-20px;left:50%;transform:translateX(-50%);font-size:0.65rem;font-weight:600;color:var(--text-secondary);white-space:nowrap">' + (typeof bars[i] === 'number' && bars[i] > 999 ? Utils.formatNumber(bars[i]) : bars[i]) + '</div>\
  </div>\
  <div style="font-size:0.6rem;color:var(--text-tertiary);white-space:nowrap">' + labels[i] + '</div>\
</div>';
    }
    html += '</div>';
    return html;
  }

  function renderHorizontalBarChart(items, barColor) {
    var maxVal = 0;
    for (var i = 0; i < items.length; i++) {
      if (items[i].count > maxVal) maxVal = items[i].count;
    }
    var html = '<div style="display:flex;flex-direction:column;gap:10px">';
    for (var i = 0; i < items.length; i++) {
      var item = items[i];
      var pct = maxVal > 0 ? (item.count / maxVal * 100) : 0;
      html += '\
<div>\
  <div style="display:flex;justify-content:space-between;font-size:0.75rem;margin-bottom:4px">\
    <span style="color:var(--text-primary)">' + Utils.sanitizeHTML(item.name) + '</span>\
    <span style="color:var(--text-secondary)">' + Utils.formatNumber(item.count) + '</span>\
  </div>\
  <div class="progress-bar" style="height:10px;border-radius:5px">\
    <div class="progress-bar-fill" style="width:' + pct + '%;height:100%;border-radius:5px;background:' + barColor + '"></div>\
  </div>\
</div>';
    }
    html += '</div>';
    return html;
  }

  function renderUsersTab() {
    var filtered = sampleUsers;
    if (searchQuery) {
      var q = searchQuery.toLowerCase();
      filtered = filtered.filter(function(u) {
        return u.name.toLowerCase().indexOf(q) !== -1 || u.email.toLowerCase().indexOf(q) !== -1;
      });
    }
    var html = '\
<div style="margin-bottom:20px">\
  <div class="input-with-icon" style="width:300px;max-width:100%">\
    <span class="input-icon">🔍</span>\
    <input type="text" class="input-field" id="user-search-input" placeholder="Search users by name or email..." value="' + Utils.sanitizeHTML(searchQuery) + '" style="width:100%">\
  </div>\
</div>\
<div style="overflow-x:auto">\
  <table class="admin-table" style="width:100%;border-collapse:separate;border-spacing:0">\
    <thead>\
      <tr style="background:var(--bg-glass);font-size:0.8rem;color:var(--text-secondary);text-transform:uppercase;letter-spacing:0.5px">\
        <th style="padding:12px 16px;text-align:left;border-bottom:1px solid var(--border-color)">Name</th>\
        <th style="padding:12px 16px;text-align:left;border-bottom:1px solid var(--border-color)">Email</th>\
        <th style="padding:12px 16px;text-align:left;border-bottom:1px solid var(--border-color)">Role</th>\
        <th style="padding:12px 16px;text-align:left;border-bottom:1px solid var(--border-color)">Class</th>\
        <th style="padding:12px 16px;text-align:left;border-bottom:1px solid var(--border-color)">Status</th>\
        <th style="padding:12px 16px;text-align:center;border-bottom:1px solid var(--border-color)">Actions</th>\
      </tr>\
    </thead>\
    <tbody>';
    for (var i = 0; i < filtered.length; i++) {
      var u = filtered[i];
      var isActive = u.status === 'active';
      var rowBg = i % 2 === 0 ? 'transparent' : 'var(--bg-glass)';
      html += '\
      <tr style="background:' + rowBg + ';transition:background 0.2s" onmouseover="this.style.background=\'var(--bg-glass-strong)\'" onmouseout="this.style.background=\'' + rowBg + '\'">\
        <td style="padding:12px 16px;font-weight:500;font-size:0.875rem">' + Utils.sanitizeHTML(u.name) + '</td>\
        <td style="padding:12px 16px;font-size:0.8rem;color:var(--text-secondary)">' + Utils.sanitizeHTML(u.email) + '</td>\
        <td style="padding:12px 16px"><span class="badge ' + (u.role === 'teacher' ? 'badge-purple' : u.role === 'admin' ? 'badge-red' : 'badge-blue') + '" style="text-transform:capitalize">' + u.role + '</span></td>\
        <td style="padding:12px 16px;font-size:0.8rem">' + (u.class ? 'Class ' + u.class : '—') + '</td>\
        <td style="padding:12px 16px"><span class="badge ' + (isActive ? 'badge-green' : 'badge-orange') + '">' + u.status + '</span></td>\
        <td style="padding:12px 16px;text-align:center">\
          <div class="flex gap-2" style="justify-content:center">\
            <button class="btn btn-ghost btn-sm user-edit-btn" data-id="' + u.id + '" style="font-size:0.75rem;padding:4px 10px" title="Edit">✏️</button>\
            <button class="btn btn-ghost btn-sm user-suspend-btn" data-id="' + u.id + '" style="font-size:0.75rem;padding:4px 10px;color:' + (isActive ? 'var(--accent-red)' : 'var(--accent-green)') + '" title="' + (isActive ? 'Suspend' : 'Reactivate') + '">' + (isActive ? '⛔' : '✅') + '</button>\
          </div>\
        </td>\
      </tr>';
    }
    html += '\
    </tbody>\
  </table>\
</div>';
    if (filtered.length === 0) {
      html += '\
<div class="empty-state" style="padding:48px 24px;text-align:center">\
  <div style="font-size:2rem;margin-bottom:12px">👥</div>\
  <div style="font-weight:600;margin-bottom:4px">No users found</div>\
  <div style="font-size:0.8rem;color:var(--text-secondary)">Try adjusting your search query.</div>\
</div>';
    }
    return html;
  }

  function renderResourcesTab() {
    var filtered = sampleResources;
    if (typeFilter) {
      filtered = filtered.filter(function(r) { return r.type === typeFilter; });
    }
    var typeOpts = [
      { value: '', label: 'All Types' },
      { value: 'pdf', label: 'PDF' },
      { value: 'notes', label: 'Notes' },
      { value: 'worksheet', label: 'Worksheet' },
      { value: 'lab-manual', label: 'Lab Manual' },
      { value: 'formula-sheet', label: 'Formula Sheet' },
      { value: 'mind-map', label: 'Mind Map' },
      { value: 'reference', label: 'Reference' },
      { value: 'question-bank', label: 'Question Bank' }
    ];
    var statusColors = { approved: 'badge-green', pending: 'badge-yellow', rejected: 'badge-red' };
    var html = '\
<div style="margin-bottom:20px">\
  <select class="input-field" id="resource-type-filter" style="width:200px;padding:8px 32px 8px 12px">';
    for (var ti = 0; ti < typeOpts.length; ti++) {
      html += '<option value="' + typeOpts[ti].value + '"' + (typeFilter === typeOpts[ti].value ? ' selected' : '') + '>' + typeOpts[ti].label + '</option>';
    }
    html += '\
  </select>\
</div>\
<div style="overflow-x:auto">\
  <table class="admin-table" style="width:100%;border-collapse:separate;border-spacing:0">\
    <thead>\
      <tr style="background:var(--bg-glass);font-size:0.8rem;color:var(--text-secondary);text-transform:uppercase;letter-spacing:0.5px">\
        <th style="padding:12px 16px;text-align:left;border-bottom:1px solid var(--border-color)">Title</th>\
        <th style="padding:12px 16px;text-align:left;border-bottom:1px solid var(--border-color)">Type</th>\
        <th style="padding:12px 16px;text-align:left;border-bottom:1px solid var(--border-color)">Subject</th>\
        <th style="padding:12px 16px;text-align:center;border-bottom:1px solid var(--border-color)">Downloads</th>\
        <th style="padding:12px 16px;text-align:left;border-bottom:1px solid var(--border-color)">Status</th>\
        <th style="padding:12px 16px;text-align:center;border-bottom:1px solid var(--border-color)">Actions</th>\
      </tr>\
    </thead>\
    <tbody>';
    for (var i = 0; i < filtered.length; i++) {
      var r = filtered[i];
      var rowBg = i % 2 === 0 ? 'transparent' : 'var(--bg-glass)';
      html += '\
      <tr style="background:' + rowBg + ';transition:background 0.2s" onmouseover="this.style.background=\'var(--bg-glass-strong)\'" onmouseout="this.style.background=\'' + rowBg + '\'">\
        <td style="padding:12px 16px;font-weight:500;font-size:0.875rem">' + Utils.sanitizeHTML(r.title) + '</td>\
        <td style="padding:12px 16px;font-size:0.8rem;color:var(--text-secondary)">' + r.type.replace('-', ' ') + '</td>\
        <td style="padding:12px 16px;font-size:0.8rem">' + Utils.sanitizeHTML(r.subject) + '</td>\
        <td style="padding:12px 16px;text-align:center;font-size:0.8rem">' + Utils.formatNumber(r.downloads) + '</td>\
        <td style="padding:12px 16px"><span class="badge ' + (statusColors[r.status] || 'badge-blue') + '">' + r.status + '</span></td>\
        <td style="padding:12px 16px;text-align:center">\
          <div class="flex gap-2" style="justify-content:center">\
            <button class="btn btn-ghost btn-sm resource-approve-btn" data-id="' + r.id + '" style="font-size:0.75rem;padding:4px 10px;color:var(--accent-green)" title="Approve">✓</button>\
            <button class="btn btn-ghost btn-sm resource-reject-btn" data-id="' + r.id + '" style="font-size:0.75rem;padding:4px 10px;color:var(--accent-red)" title="Reject">✕</button>\
            <button class="btn btn-ghost btn-sm resource-edit-btn" data-id="' + r.id + '" style="font-size:0.75rem;padding:4px 10px" title="Edit">✏️</button>\
            <button class="btn btn-ghost btn-sm resource-delete-btn" data-id="' + r.id + '" style="font-size:0.75rem;padding:4px 10px;color:var(--accent-red)" title="Delete">🗑️</button>\
          </div>\
        </td>\
      </tr>';
    }
    html += '\
    </tbody>\
  </table>\
</div>';
    return html;
  }

  function renderMarketplaceTab() {
    var filtered = sampleProducts;
    if (categoryFilter) {
      filtered = filtered.filter(function(p) { return p.category === categoryFilter; });
    }
    var cats = [
      { value: '', label: 'All Categories' },
      { value: 'books', label: 'Books' },
      { value: 'stationery', label: 'Stationery' },
      { value: 'notes', label: 'Premium Notes' },
      { value: 'courses', label: 'Courses' },
      { value: 'mock-tests', label: 'Mock Tests' },
      { value: 'exam-bundles', label: 'Exam Bundles' },
      { value: 'practice-books', label: 'Practice Books' },
      { value: 'accessories', label: 'Accessories' }
    ];
    var html = '\
<div style="margin-bottom:20px">\
  <select class="input-field" id="product-category-filter" style="width:200px;padding:8px 32px 8px 12px">';
    for (var ci = 0; ci < cats.length; ci++) {
      html += '<option value="' + cats[ci].value + '"' + (categoryFilter === cats[ci].value ? ' selected' : '') + '>' + cats[ci].label + '</option>';
    }
    html += '\
  </select>\
</div>\
<div style="overflow-x:auto">\
  <table class="admin-table" style="width:100%;border-collapse:separate;border-spacing:0">\
    <thead>\
      <tr style="background:var(--bg-glass);font-size:0.8rem;color:var(--text-secondary);text-transform:uppercase;letter-spacing:0.5px">\
        <th style="padding:12px 16px;text-align:left;border-bottom:1px solid var(--border-color)">Product</th>\
        <th style="padding:12px 16px;text-align:left;border-bottom:1px solid var(--border-color)">Category</th>\
        <th style="padding:12px 16px;text-align:right;border-bottom:1px solid var(--border-color)">Price</th>\
        <th style="padding:12px 16px;text-align:center;border-bottom:1px solid var(--border-color)">Stock</th>\
        <th style="padding:12px 16px;text-align:center;border-bottom:1px solid var(--border-color)">Sales</th>\
        <th style="padding:12px 16px;text-align:left;border-bottom:1px solid var(--border-color)">Status</th>\
        <th style="padding:12px 16px;text-align:center;border-bottom:1px solid var(--border-color)">Actions</th>\
      </tr>\
    </thead>\
    <tbody>';
    for (var i = 0; i < filtered.length; i++) {
      var p = filtered[i];
      var rowBg = i % 2 === 0 ? 'transparent' : 'var(--bg-glass)';
      html += '\
      <tr style="background:' + rowBg + ';transition:background 0.2s" onmouseover="this.style.background=\'var(--bg-glass-strong)\'" onmouseout="this.style.background=\'' + rowBg + '\'">\
        <td style="padding:12px 16px;font-weight:500;font-size:0.875rem">' + Utils.sanitizeHTML(p.title) + '</td>\
        <td style="padding:12px 16px;font-size:0.75rem;color:var(--text-secondary)">' + p.category.replace('-', ' ') + '</td>\
        <td style="padding:12px 16px;text-align:right;font-weight:600;font-size:0.875rem">' + Utils.formatCurrency(p.price) + '</td>\
        <td style="padding:12px 16px;text-align:center;font-size:0.8rem;color:' + (p.stock === 0 ? 'var(--accent-red)' : 'var(--text-primary)') + '">' + (p.stock === 0 ? 'Out of Stock' : p.stock) + '</td>\
        <td style="padding:12px 16px;text-align:center;font-size:0.8rem">' + Utils.formatNumber(p.sales) + '</td>\
        <td style="padding:12px 16px"><span class="badge ' + (p.status === 'active' ? 'badge-green' : 'badge-orange') + '">' + p.status + '</span></td>\
        <td style="padding:12px 16px;text-align:center">\
          <div class="flex gap-2" style="justify-content:center">\
            <button class="btn btn-ghost btn-sm product-feature-btn" data-id="' + p.id + '" style="font-size:0.75rem;padding:4px 10px;color:' + (p.featured ? 'var(--accent-yellow)' : 'var(--text-tertiary)') + '" title="' + (p.featured ? 'Unfeature' : 'Feature') + '">' + (p.featured ? '⭐' : '☆') + '</button>\
            <button class="btn btn-ghost btn-sm product-edit-btn" data-id="' + p.id + '" style="font-size:0.75rem;padding:4px 10px" title="Edit">✏️</button>\
            <button class="btn btn-ghost btn-sm product-remove-btn" data-id="' + p.id + '" style="font-size:0.75rem;padding:4px 10px;color:var(--accent-red)" title="Remove">🗑️</button>\
          </div>\
        </td>\
      </tr>';
    }
    html += '\
    </tbody>\
  </table>\
</div>';
    return html;
  }

  function renderScholarshipsTab() {
    var html = '\
<div style="margin-bottom:16px">\
  <button class="btn btn-primary btn-sm" id="add-scholarship-btn">+ Add New Scholarship</button>\
</div>\
<div style="overflow-x:auto">\
  <table class="admin-table" style="width:100%;border-collapse:separate;border-spacing:0">\
    <thead>\
      <tr style="background:var(--bg-glass);font-size:0.8rem;color:var(--text-secondary);text-transform:uppercase;letter-spacing:0.5px">\
        <th style="padding:12px 16px;text-align:left;border-bottom:1px solid var(--border-color)">Name</th>\
        <th style="padding:12px 16px;text-align:left;border-bottom:1px solid var(--border-color)">Provider</th>\
        <th style="padding:12px 16px;text-align:right;border-bottom:1px solid var(--border-color)">Amount</th>\
        <th style="padding:12px 16px;text-align:center;border-bottom:1px solid var(--border-color)">Deadline</th>\
        <th style="padding:12px 16px;text-align:center;border-bottom:1px solid var(--border-color)">Applicants</th>\
        <th style="padding:12px 16px;text-align:left;border-bottom:1px solid var(--border-color)">Status</th>\
        <th style="padding:12px 16px;text-align:center;border-bottom:1px solid var(--border-color)">Actions</th>\
      </tr>\
    </thead>\
    <tbody>';
    for (var i = 0; i < sampleScholarships.length; i++) {
      var s = sampleScholarships[i];
      var rowBg = i % 2 === 0 ? 'transparent' : 'var(--bg-glass)';
      var statusCls = s.status === 'active' ? 'badge-green' : s.status === 'pending' ? 'badge-yellow' : 'badge-red';
      html += '\
      <tr style="background:' + rowBg + ';transition:background 0.2s" onmouseover="this.style.background=\'var(--bg-glass-strong)\'" onmouseout="this.style.background=\'' + rowBg + '\'">\
        <td style="padding:12px 16px;font-weight:500;font-size:0.875rem">' + Utils.sanitizeHTML(s.name) + '</td>\
        <td style="padding:12px 16px;font-size:0.8rem;color:var(--text-secondary)">' + Utils.sanitizeHTML(s.provider) + '</td>\
        <td style="padding:12px 16px;text-align:right;font-weight:600;font-size:0.875rem;color:var(--accent-green)">' + Utils.formatCurrency(s.amount) + '</td>\
        <td style="padding:12px 16px;text-align:center;font-size:0.8rem">' + Utils.formatDate(s.deadline, 'dd mmm yyyy') + '</td>\
        <td style="padding:12px 16px;text-align:center;font-size:0.8rem">' + Utils.formatNumber(s.applicants) + '</td>\
        <td style="padding:12px 16px"><span class="badge ' + statusCls + '">' + s.status + '</span></td>\
        <td style="padding:12px 16px;text-align:center">\
          <div class="flex gap-2" style="justify-content:center">\
            <button class="btn btn-ghost btn-sm sch-approve-btn" data-id="' + s.id + '" style="font-size:0.75rem;padding:4px 10px;color:var(--accent-green)" title="Approve">✓</button>\
            <button class="btn btn-ghost btn-sm sch-reject-btn" data-id="' + s.id + '" style="font-size:0.75rem;padding:4px 10px;color:var(--accent-red)" title="Reject">✕</button>\
            <button class="btn btn-ghost btn-sm sch-edit-btn" data-id="' + s.id + '" style="font-size:0.75rem;padding:4px 10px" title="Edit">✏️</button>\
          </div>\
        </td>\
      </tr>';
    }
    html += '\
    </tbody>\
  </table>\
</div>';
    return html;
  }

  function renderExamsTab() {
    var statusColors = { scheduled: 'badge-blue', upcoming: 'badge-purple', completed: 'badge-green', cancelled: 'badge-red' };
    var html = '\
<div style="margin-bottom:16px">\
  <button class="btn btn-primary btn-sm" id="schedule-exam-btn">+ Schedule New Exam</button>\
</div>\
<div style="overflow-x:auto">\
  <table class="admin-table" style="width:100%;border-collapse:separate;border-spacing:0">\
    <thead>\
      <tr style="background:var(--bg-glass);font-size:0.8rem;color:var(--text-secondary);text-transform:uppercase;letter-spacing:0.5px">\
        <th style="padding:12px 16px;text-align:left;border-bottom:1px solid var(--border-color)">Exam Name</th>\
        <th style="padding:12px 16px;text-align:left;border-bottom:1px solid var(--border-color)">Type</th>\
        <th style="padding:12px 16px;text-align:center;border-bottom:1px solid var(--border-color)">Class</th>\
        <th style="padding:12px 16px;text-align:center;border-bottom:1px solid var(--border-color)">Date</th>\
        <th style="padding:12px 16px;text-align:center;border-bottom:1px solid var(--border-color)">Participants</th>\
        <th style="padding:12px 16px;text-align:left;border-bottom:1px solid var(--border-color)">Status</th>\
        <th style="padding:12px 16px;text-align:center;border-bottom:1px solid var(--border-color)">Actions</th>\
      </tr>\
    </thead>\
    <tbody>';
    for (var i = 0; i < sampleExams.length; i++) {
      var e = sampleExams[i];
      var rowBg = i % 2 === 0 ? 'transparent' : 'var(--bg-glass)';
      html += '\
      <tr style="background:' + rowBg + ';transition:background 0.2s" onmouseover="this.style.background=\'var(--bg-glass-strong)\'" onmouseout="this.style.background=\'' + rowBg + '\'">\
        <td style="padding:12px 16px;font-weight:500;font-size:0.875rem">' + Utils.sanitizeHTML(e.name) + '</td>\
        <td style="padding:12px 16px;font-size:0.75rem;color:var(--text-secondary);text-transform:capitalize">' + e.type.replace('-', ' ') + '</td>\
        <td style="padding:12px 16px;text-align:center;font-size:0.8rem">Class ' + e.class + '</td>\
        <td style="padding:12px 16px;text-align:center;font-size:0.8rem">' + Utils.formatDate(e.date, 'dd mmm yyyy') + '</td>\
        <td style="padding:12px 16px;text-align:center;font-size:0.8rem">' + Utils.formatNumber(e.participants) + '</td>\
        <td style="padding:12px 16px"><span class="badge ' + (statusColors[e.status] || 'badge-blue') + '">' + e.status + '</span></td>\
        <td style="padding:12px 16px;text-align:center">\
          <div class="flex gap-2" style="justify-content:center">\
            <button class="btn btn-ghost btn-sm exam-schedule-btn" data-id="' + e.id + '" style="font-size:0.75rem;padding:4px 10px;color:var(--accent-blue)" title="Schedule">📅</button>\
            <button class="btn btn-ghost btn-sm exam-cancel-btn" data-id="' + e.id + '" style="font-size:0.75rem;padding:4px 10px;color:var(--accent-red)" title="Cancel">⛔</button>\
            <button class="btn btn-ghost btn-sm exam-results-btn" data-id="' + e.id + '" style="font-size:0.75rem;padding:4px 10px;color:var(--accent-green)" title="Results">📊</button>\
          </div>\
        </td>\
      </tr>';
    }
    html += '\
    </tbody>\
  </table>\
</div>';
    return html;
  }

  function renderReportsTab() {
    var maxUser = Math.max.apply(null, monthlyUsers);
    var maxRev = Math.max.apply(null, weeklyRevenue);
    return '\
<div class="stats-grid" style="grid-template-columns:repeat(auto-fill,minmax(220px,1fr));margin-bottom:24px">\
  <div class="glass-card" style="padding:16px 20px">\
    <div style="font-size:0.75rem;color:var(--text-secondary);margin-bottom:4px">📈 Platform Uptime</div>\
    <div style="font-size:1.5rem;font-weight:700;color:var(--accent-green)">99.97%</div>\
    <div style="font-size:0.7rem;color:var(--text-tertiary)">Last 30 days</div>\
  </div>\
  <div class="glass-card" style="padding:16px 20px">\
    <div style="font-size:0.75rem;color:var(--text-secondary);margin-bottom:4px">⚡ Avg. Response Time</div>\
    <div style="font-size:1.5rem;font-weight:700;color:var(--accent-blue)">245ms</div>\
    <div style="font-size:0.7rem;color:var(--text-tertiary)">200ms - 320ms range</div>\
  </div>\
  <div class="glass-card" style="padding:16px 20px">\
    <div style="font-size:0.75rem;color:var(--text-secondary);margin-bottom:4px">👥 Active Users Today</div>\
    <div style="font-size:1.5rem;font-weight:700;color:var(--accent-purple)">' + Utils.formatNumber(892) + '</div>\
    <div style="font-size:0.7rem;color:var(--text-tertiary)">Peak: ' + Utils.formatNumber(1240) + '</div>\
  </div>\
  <div class="glass-card" style="padding:16px 20px">\
    <div style="font-size:0.75rem;color:var(--text-secondary);margin-bottom:4px">💾 Storage Used</div>\
    <div style="font-size:1.5rem;font-weight:700;color:var(--accent-yellow)">2.4 TB</div>\
    <div style="font-size:0.7rem;color:var(--text-tertiary)">Of 5 TB allocated</div>\
  </div>\
</div>\
<div class="stats-grid" style="grid-template-columns:repeat(auto-fill,minmax(340px,1fr));gap:20px;margin-bottom:24px">\
  <div class="glass-card" style="padding:20px">\
    <div style="font-size:0.9rem;font-weight:600;margin-bottom:16px">📊 User Growth (Monthly)</div>\
    ' + renderBarChart(monthlyUsers, monthlyLabels, maxUser, 'linear-gradient(180deg,#3b82f6,#8b5cf6)', 160) + '\
  </div>\
  <div class="glass-card" style="padding:20px">\
    <div style="font-size:0.9rem;font-weight:600;margin-bottom:16px">💰 Revenue Overview (Weekly)</div>\
    ' + renderBarChart(weeklyRevenue, revenueDays, maxRev, 'linear-gradient(180deg,#10b981,#06b6d4)', 160) + '\
  </div>\
</div>\
<div class="glass-card" style="padding:20px;margin-bottom:24px">\
  <div style="font-size:0.9rem;font-weight:600;margin-bottom:16px">📚 Popular Subjects</div>\
  ' + renderHorizontalBarChart(popularSubjects, 'linear-gradient(90deg,#f59e0b,#f97316)') + '\
</div>\
<div style="display:flex;gap:12px;flex-wrap:wrap">\
  <button class="btn btn-primary btn-sm" id="export-users-btn">📥 Export Users Report</button>\
  <button class="btn btn-secondary btn-sm" id="export-revenue-btn">📥 Export Revenue Report</button>\
  <button class="btn btn-secondary btn-sm" id="export-full-btn">📥 Export Full Report</button>\
</div>';
  }

  function renderTabContent() {
    var tabContent = document.getElementById('admin-tab-content');
    if (!tabContent) return;
    var content = '';
    switch (currentTab) {
      case 'users': content = renderUsersTab(); break;
      case 'resources': content = renderResourcesTab(); break;
      case 'marketplace': content = renderMarketplaceTab(); break;
      case 'scholarships': content = renderScholarshipsTab(); break;
      case 'exams': content = renderExamsTab(); break;
      case 'reports': content = renderReportsTab(); break;
    }
    tabContent.innerHTML = content;
    bindTableEvents();
  }

  function switchTab(tab) {
    currentTab = tab;
    var tabs = document.querySelectorAll('#admin-tabs .admin-tab');
    for (var i = 0; i < tabs.length; i++) {
      tabs[i].classList.toggle('active', tabs[i].getAttribute('data-tab') === tab);
    }
    renderTabContent();
  }

  function bindTabEvents() {
    var tabs = document.querySelectorAll('#admin-tabs .admin-tab');
    for (var i = 0; i < tabs.length; i++) {
      tabs[i].addEventListener('click', function() {
        switchTab(this.getAttribute('data-tab'));
      });
    }
  }

  function bindTableEvents() {
    var searchInput = document.getElementById('user-search-input');
    if (searchInput) {
      searchInput.addEventListener('input', function() {
        searchQuery = this.value;
        renderTabContent();
      });
    }
    var typeFilterEl = document.getElementById('resource-type-filter');
    if (typeFilterEl) {
      typeFilterEl.addEventListener('change', function() {
        typeFilter = this.value;
        renderTabContent();
      });
    }
    var catFilterEl = document.getElementById('product-category-filter');
    if (catFilterEl) {
      catFilterEl.addEventListener('change', function() {
        categoryFilter = this.value;
        renderTabContent();
      });
    }

    var editBtns = document.querySelectorAll('.user-edit-btn');
    for (var i = 0; i < editBtns.length; i++) {
      editBtns[i].addEventListener('click', function() {
        var id = this.getAttribute('data-id');
        for (var j = 0; j < sampleUsers.length; j++) {
          if (sampleUsers[j].id === id) {
            renderUserEditModal(sampleUsers[j]);
            break;
          }
        }
      });
    }

    var suspendBtns = document.querySelectorAll('.user-suspend-btn');
    for (var i = 0; i < suspendBtns.length; i++) {
      suspendBtns[i].addEventListener('click', function() {
        var id = this.getAttribute('data-id');
        for (var j = 0; j < sampleUsers.length; j++) {
          if (sampleUsers[j].id === id) {
            var u = sampleUsers[j];
            var isActive = u.status === 'active';
            var action = isActive ? 'suspend' : 'reactivate';
            showConfirmModal('Are you sure you want to ' + action + ' ' + u.name + '?', function() {
              u.status = isActive ? 'suspended' : 'active';
              renderTabContent();
            });
            break;
          }
        }
      });
    }

    var approveBtns = document.querySelectorAll('.resource-approve-btn');
    for (var i = 0; i < approveBtns.length; i++) {
      approveBtns[i].addEventListener('click', function() {
        var id = this.getAttribute('data-id');
        for (var j = 0; j < sampleResources.length; j++) {
          if (sampleResources[j].id === id) {
            sampleResources[j].status = 'approved';
            renderTabContent();
            break;
          }
        }
      });
    }

    var rejectBtns = document.querySelectorAll('.resource-reject-btn');
    for (var i = 0; i < rejectBtns.length; i++) {
      rejectBtns[i].addEventListener('click', function() {
        var id = this.getAttribute('data-id');
        for (var j = 0; j < sampleResources.length; j++) {
          if (sampleResources[j].id === id) {
            sampleResources[j].status = 'rejected';
            renderTabContent();
            break;
          }
        }
      });
    }

    var resourceEditBtns = document.querySelectorAll('.resource-edit-btn');
    for (var i = 0; i < resourceEditBtns.length; i++) {
      resourceEditBtns[i].addEventListener('click', function() {
        var id = this.getAttribute('data-id');
        for (var j = 0; j < sampleResources.length; j++) {
          if (sampleResources[j].id === id) {
            var newTitle = prompt('Edit title:', sampleResources[j].title);
            if (newTitle && newTitle.trim()) {
              sampleResources[j].title = newTitle.trim();
              renderTabContent();
            }
            break;
          }
        }
      });
    }

    var resourceDeleteBtns = document.querySelectorAll('.resource-delete-btn');
    for (var i = 0; i < resourceDeleteBtns.length; i++) {
      resourceDeleteBtns[i].addEventListener('click', function() {
        var id = this.getAttribute('data-id');
        showConfirmModal('Are you sure you want to delete this resource?', function() {
          for (var j = 0; j < sampleResources.length; j++) {
            if (sampleResources[j].id === id) {
              sampleResources.splice(j, 1);
              renderTabContent();
              break;
            }
          }
        });
      });
    }

    var featureBtns = document.querySelectorAll('.product-feature-btn');
    for (var i = 0; i < featureBtns.length; i++) {
      featureBtns[i].addEventListener('click', function() {
        var id = this.getAttribute('data-id');
        for (var j = 0; j < sampleProducts.length; j++) {
          if (sampleProducts[j].id === id) {
            sampleProducts[j].featured = !sampleProducts[j].featured;
            renderTabContent();
            break;
          }
        }
      });
    }

    var productEditBtns = document.querySelectorAll('.product-edit-btn');
    for (var i = 0; i < productEditBtns.length; i++) {
      productEditBtns[i].addEventListener('click', function() {
        var id = this.getAttribute('data-id');
        for (var j = 0; j < sampleProducts.length; j++) {
          if (sampleProducts[j].id === id) {
            var newPrice = prompt('Enter new price (₹):', sampleProducts[j].price);
            if (newPrice && !isNaN(parseInt(newPrice))) {
              sampleProducts[j].price = parseInt(newPrice);
              renderTabContent();
            }
            break;
          }
        }
      });
    }

    var productRemoveBtns = document.querySelectorAll('.product-remove-btn');
    for (var i = 0; i < productRemoveBtns.length; i++) {
      productRemoveBtns[i].addEventListener('click', function() {
        var id = this.getAttribute('data-id');
        showConfirmModal('Are you sure you want to remove this product?', function() {
          for (var j = 0; j < sampleProducts.length; j++) {
            if (sampleProducts[j].id === id) {
              sampleProducts.splice(j, 1);
              renderTabContent();
              break;
            }
          }
        });
      });
    }

    var schApproveBtns = document.querySelectorAll('.sch-approve-btn');
    for (var i = 0; i < schApproveBtns.length; i++) {
      schApproveBtns[i].addEventListener('click', function() {
        var id = this.getAttribute('data-id');
        for (var j = 0; j < sampleScholarships.length; j++) {
          if (sampleScholarships[j].id === id) {
            sampleScholarships[j].status = 'active';
            renderTabContent();
            break;
          }
        }
      });
    }

    var schRejectBtns = document.querySelectorAll('.sch-reject-btn');
    for (var i = 0; i < schRejectBtns.length; i++) {
      schRejectBtns[i].addEventListener('click', function() {
        var id = this.getAttribute('data-id');
        for (var j = 0; j < sampleScholarships.length; j++) {
          if (sampleScholarships[j].id === id) {
            sampleScholarships[j].status = 'rejected';
            renderTabContent();
            break;
          }
        }
      });
    }

    var schEditBtns = document.querySelectorAll('.sch-edit-btn');
    for (var i = 0; i < schEditBtns.length; i++) {
      schEditBtns[i].addEventListener('click', function() {
        var id = this.getAttribute('data-id');
        for (var j = 0; j < sampleScholarships.length; j++) {
          if (sampleScholarships[j].id === id) {
            var newAmt = prompt('Enter new amount (₹):', sampleScholarships[j].amount);
            if (newAmt && !isNaN(parseInt(newAmt))) {
              sampleScholarships[j].amount = parseInt(newAmt);
              renderTabContent();
            }
            break;
          }
        }
      });
    }

    var addSchBtn = document.getElementById('add-scholarship-btn');
    if (addSchBtn) {
      addSchBtn.addEventListener('click', renderAddScholarshipModal);
    }

    var scheduleExamBtn = document.getElementById('schedule-exam-btn');
    if (scheduleExamBtn) {
      scheduleExamBtn.addEventListener('click', renderScheduleExamModal);
    }

    var examScheduleBtns = document.querySelectorAll('.exam-schedule-btn');
    for (var i = 0; i < examScheduleBtns.length; i++) {
      examScheduleBtns[i].addEventListener('click', function() {
        var id = this.getAttribute('data-id');
        for (var j = 0; j < sampleExams.length; j++) {
          if (sampleExams[j].id === id) {
            sampleExams[j].status = 'scheduled';
            renderTabContent();
            break;
          }
        }
      });
    }

    var examCancelBtns = document.querySelectorAll('.exam-cancel-btn');
    for (var i = 0; i < examCancelBtns.length; i++) {
      examCancelBtns[i].addEventListener('click', function() {
        var id = this.getAttribute('data-id');
        showConfirmModal('Are you sure you want to cancel this exam?', function() {
          for (var j = 0; j < sampleExams.length; j++) {
            if (sampleExams[j].id === id) {
              sampleExams[j].status = 'cancelled';
              renderTabContent();
              break;
            }
          }
        });
      });
    }

    var examResultsBtns = document.querySelectorAll('.exam-results-btn');
    for (var i = 0; i < examResultsBtns.length; i++) {
      examResultsBtns[i].addEventListener('click', function() {
        var id = this.getAttribute('data-id');
        for (var j = 0; j < sampleExams.length; j++) {
          if (sampleExams[j].id === id) {
            alert('Results for "' + sampleExams[j].name + '" have been published successfully!');
            sampleExams[j].status = 'completed';
            renderTabContent();
            break;
          }
        }
      });
    }

    var exportUsersBtn = document.getElementById('export-users-btn');
    if (exportUsersBtn) {
      exportUsersBtn.addEventListener('click', function() { alert('Users report exported as CSV!'); });
    }
    var exportRevenueBtn = document.getElementById('export-revenue-btn');
    if (exportRevenueBtn) {
      exportRevenueBtn.addEventListener('click', function() { alert('Revenue report exported as CSV!'); });
    }
    var exportFullBtn = document.getElementById('export-full-btn');
    if (exportFullBtn) {
      exportFullBtn.addEventListener('click', function() { alert('Full platform report exported as PDF!'); });
    }
  }

  mainContent.innerHTML = '\
<div class="page-container animate-fadeInUp" style="padding:24px 32px">\
  <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:28px;flex-wrap:wrap;gap:16px">\
    <div>\
      <h1 style="font-size:1.5rem;font-weight:700;margin:0">Admin Dashboard</h1>\
      <p style="font-size:0.85rem;color:var(--text-secondary);margin:4px 0 0 0">Platform management and analytics overview</p>\
    </div>\
    <div style="display:flex;gap:8px;flex-wrap:wrap">\
      <button class="btn btn-secondary btn-sm" id="quick-manage-users" style="font-size:0.8rem">👥 Manage Users</button>\
      <button class="btn btn-secondary btn-sm" id="quick-manage-resources" style="font-size:0.8rem">📄 Manage Resources</button>\
      <button class="btn btn-secondary btn-sm" id="quick-view-reports" style="font-size:0.8rem">📊 View Reports</button>\
      <button class="btn btn-secondary btn-sm" id="quick-settings" style="font-size:0.8rem">⚙️ Platform Settings</button>\
    </div>\
  </div>\
  <div class="stats-grid" style="grid-template-columns:repeat(auto-fill,minmax(190px,1fr));margin-bottom:32px">\
    ' + renderStatCard('Total Students', '1,247', '👨‍🎓', 'linear-gradient(135deg,#3b82f6,#8b5cf6)', '+12% this month') + '\
    ' + renderStatCard('Total Teachers', '89', '👩‍🏫', 'linear-gradient(135deg,#8b5cf6,#ec4899)', '+5% this month') + '\
    ' + renderStatCard('Active Courses', '156', '📚', 'linear-gradient(135deg,#06b6d4,#3b82f6)', '+8 new courses') + '\
    ' + renderStatCard('Revenue', '₹12,45,000', '💰', 'linear-gradient(135deg,#10b981,#06b6d4)', '+18% this quarter') + '\
    ' + renderStatCard('Platform Rating', '4.8', '⭐', 'linear-gradient(135deg,#f59e0b,#f97316)', 'Based on 2.4k reviews') + '\
    ' + renderStatCard('Daily Active Users', '892', '🔥', 'linear-gradient(135deg,#f97316,#ec4899)', '+7% vs last week') + '\
  </div>\
  <div class="tabs" id="admin-tabs" style="margin-bottom:24px">\
    <div class="tab admin-tab active" data-tab="users">👥 User Management</div>\
    <div class="tab admin-tab" data-tab="resources">📄 Resource Management</div>\
    <div class="tab admin-tab" data-tab="marketplace">🛍️ Marketplace Management</div>\
    <div class="tab admin-tab" data-tab="scholarships">🎓 Scholarship Management</div>\
    <div class="tab admin-tab" data-tab="exams">📝 Exam Management</div>\
    <div class="tab admin-tab" data-tab="reports">📊 Reports</div>\
  </div>\
  <div class="glass-card" style="padding:24px;border-radius:20px;overflow:hidden" id="admin-tab-content">\
  </div>\
</div>';

  bindTabEvents();
  renderTabContent();

  var quickUsersBtn = document.getElementById('quick-manage-users');
  if (quickUsersBtn) {
    quickUsersBtn.addEventListener('click', function() { switchTab('users'); });
  }
  var quickResourcesBtn = document.getElementById('quick-manage-resources');
  if (quickResourcesBtn) {
    quickResourcesBtn.addEventListener('click', function() { switchTab('resources'); });
  }
  var quickReportsBtn = document.getElementById('quick-view-reports');
  if (quickReportsBtn) {
    quickReportsBtn.addEventListener('click', function() { switchTab('reports'); });
  }
  var quickSettingsBtn = document.getElementById('quick-settings');
  if (quickSettingsBtn) {
    quickSettingsBtn.addEventListener('click', function() { Router.navigate('/settings'); });
  }
};
