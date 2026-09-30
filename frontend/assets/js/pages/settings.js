document.addEventListener('click', function(e) {
  var t = e.target.closest('[data-action^="settings:"]');
  if (!t) return;
  var p = t.getAttribute('data-action').split(':');
  var c = p[1], a = p[2], b = p[3];
  if (c === 'tab' && a) { window.switchTab(a); }
  if (c === 'save') { window.saveAllSettings(); }
  if (c === 'theme' && a) { window.setTheme(a); }
  if (c === 'logout') { window.confirmLogout(); }
});

window.renderPage.settings = function(params) {
  var store = window.Store;
  var utils = window.Utils;
  var mc = document.getElementById('main-content');
  if (!mc) return;

  var activeCategory = 'personal';

  function getSettings() {
    var s = store.get('settings') || {};
    var u = store.get('user') || {};
    return {
      fullName: s.fullName || u.name || 'Arjun Mehta',
      email: s.email || u.email || 'arjun.mehta@edumentee.com',
      phone: s.phone || u.phone || '+91 98765 43210',
      dateOfBirth: s.dateOfBirth || '2008-05-15',
      gender: s.gender || 'Male',
      bloodGroup: s.bloodGroup || 'B+',
      address: s.address || '42 MG Road, Sector 15',
      city: s.city || u.city || 'New Delhi',
      state: s.state || u.state || 'Delhi',
      pincode: s.pincode || '110015',
      country: s.country || 'India',
      parentName: s.parentName || 'Rajesh Mehta',
      parentPhone: s.parentPhone || '+91 98765 12345',
      parentEmail: s.parentEmail || 'rajesh.mehta@gmail.com',
      parentOccupation: s.parentOccupation || 'Software Engineer',
      emergencyName: s.emergencyName || 'Sunita Mehta',
      emergencyPhone: s.emergencyPhone || '+91 91234 56789',
      emergencyRelation: s.emergencyRelation || 'Mother',
      language: s.language || 'en',
      autoDetect: s.autoDetect || false,
      emailNotifications: s.emailNotifications !== false,
      pushNotifications: s.pushNotifications !== false,
      soundEffects: s.soundEffects !== false,
      notifAssignments: s.notifAssignments !== false,
      notifQuizzes: s.notifQuizzes !== false,
      notifExams: s.notifExams !== false,
      notifCommunity: s.notifCommunity !== false,
      notifAnnouncements: s.notifAnnouncements !== false,
      profileVisibility: s.profileVisibility || 'public',
      showOnlineStatus: s.showOnlineStatus !== false,
      showProgress: s.showProgress !== false,
      showAchievements: s.showAchievements !== false,
      twoFactorAuth: s.twoFactorAuth || false,
      loginAlerts: s.loginAlerts !== false,
      theme: s.theme || store.get('theme') || 'dark'
    };
  }

  var current = getSettings();

  function saveSetting(key, value) {
    var s = store.get('settings') || {};
    s[key] = value;
    store.set('settings', s);
    if (key === 'fullName' || key === 'email' || key === 'phone' || key === 'city' || key === 'state') {
      var user = store.get('user') || {};
      user[key === 'fullName' ? 'name' : key] = value;
      store.set('user', user);
    }
  }

  function showSavedMsg() {
    var el = document.getElementById('saved-toast');
    if (!el) {
      el = document.createElement('div');
      el.id = 'saved-toast';
      el.className = 'c-fixed c-z-1000 c-bg-success c-text-primary c-p-3 c-px-4 c-radius-lg c-fs-sm c-transition';
      el.style.bottom = '20px';
      el.style.right = '20px';
      el.style.opacity = '0';
      document.body.appendChild(el);
    }
    el.textContent = '\u2713 Settings saved successfully!';
    el.style.opacity = '1';
    setTimeout(function() { el.style.opacity = '0'; }, 2000);
  }

  function renderSidebar() {
    var cats = [
      { id: 'personal', label: 'Personal Details', icon: '\uD83D\uDC64' },
      { id: 'address', label: 'Address', icon: '\uD83C\uDFE0' },
      { id: 'parent', label: 'Parent Details', icon: '\uD83D\uDC68\u200D\uD83D\uDC69\u200D\uD83D\uDC67' },
      { id: 'emergency', label: 'Emergency Contact', icon: '\uD83D\uDEA8' },
      { id: 'language', label: 'Language', icon: '\uD83C\uDF10' },
      { id: 'notifications', label: 'Notifications', icon: '\uD83D\uDD14' },
      { id: 'privacy', label: 'Privacy', icon: '\uD83D\uDD12' },
      { id: 'security', label: 'Security', icon: '\uD83D\uDEE1\uFE0F' }
    ];
    var h = '';
    for (var i = 0; i < cats.length; i++) {
      h += '<div class="settings-nav-item' + (cats[i].id === activeCategory ? ' active' : '') + '" data-cat="' + cats[i].id + '" data-action="settings:tab:' + cats[i].id + '">\
  <span>' + cats[i].icon + '</span>\
  <span>' + cats[i].label + '</span>\
</div>';
    }
    return h;
  }

  function renderInput(id, label, value, type, placeholder) {
    return '<div class="input-group mb-3"><label class="input-label">' + label + '</label><input type="' + (type || 'text') + '" class="input-field" id="' + id + '" value="' + (value || '').replace(/"/g, '&quot;') + '" placeholder="' + (placeholder || '') + '" onchange="window._saveSetting(\'' + id + '\', this.value)"></div>';
  }

  function renderSelect(id, label, value, options) {
    var h = '<div class="input-group mb-3"><label class="input-label">' + label + '</label><select class="input-field" id="' + id + '" onchange="window._saveSetting(\'' + id + '\', this.value)">';
    for (var oi = 0; oi < options.length; oi++) {
      h += '<option value="' + options[oi].value + '"' + (value === options[oi].value ? ' selected' : '') + '>' + options[oi].label + '</option>';
    }
    h += '</select></div>';
    return h;
  }

  function renderToggle(id, label, checked) {
    return '<div class="flex items-center justify-between py-3">\
  <span class="text-sm">' + label + '</span>\
  <label class="toggle-switch">\
    <input type="checkbox" ' + (checked ? 'checked' : '') + ' onchange="window._toggleSetting(\'' + id + '\', this.checked)">\
    <span class="toggle-slider"></span>\
  </label>\
</div>';
  }

  function renderContent(cat) {
    var h = '<div class="settings-content animate-fadeInUp">';
    if (cat === 'personal') {
      h += '<h3 class="section-title mb-6">Personal Details</h3>\
  <div class="glass-card p-6">\
    <div class="flex items-center gap-4 mb-6">\
      <div class="c-w-40 c-h-40 c-radius-full c-bg-accent c-flex-center c-text-primary" style="font-size:32px">' + current.fullName.charAt(0).toUpperCase() + '</div>\
      <div><div class="text-lg font-semibold">' + current.fullName + '</div><div class="text-sm text-secondary">' + current.email + '</div></div>\
    </div>\
    <div class="grid grid-cols-2 gap-4">\
      ' + renderInput('fullName', 'Full Name', current.fullName, 'text', 'Enter your full name') + '\
      ' + renderInput('email', 'Email', current.email, 'email', 'Enter your email') + '\
      ' + renderInput('phone', 'Phone', current.phone, 'tel', '+91 98765 43210') + '\
      ' + renderInput('dateOfBirth', 'Date of Birth', current.dateOfBirth, 'date', 'DD/MM/YYYY') + '\
      ' + renderSelect('gender', 'Gender', current.gender, [{value:'Male',label:'Male'},{value:'Female',label:'Female'},{value:'Other',label:'Other'}]) + '\
      ' + renderSelect('bloodGroup', 'Blood Group', current.bloodGroup, [{value:'A+',label:'A+'},{value:'A-',label:'A-'},{value:'B+',label:'B+'},{value:'B-',label:'B-'},{value:'AB+',label:'AB+'},{value:'AB-',label:'AB-'},{value:'O+',label:'O+'},{value:'O-',label:'O-'}]) + '\
    </div>\
    <button class="btn btn-primary btn-block mt-4" data-action="settings:save">Save All</button>\
  </div>';
    } else if (cat === 'address') {
      h += '<h3 class="section-title mb-6">Address</h3>\
  <div class="glass-card p-6">\
    <div class="grid grid-cols-2 gap-4">\
      ' + renderInput('address', 'Street Address', current.address, 'text', 'Enter your address') + '\
      ' + renderInput('city', 'City', current.city, 'text', 'Enter your city') + '\
      ' + renderInput('state', 'State', current.state, 'text', 'Enter your state') + '\
      ' + renderInput('pincode', 'Pincode', current.pincode, 'text', 'Enter pincode') + '\
      ' + renderInput('country', 'Country', current.country, 'text', 'Enter your country') + '\
    </div>\
    <button class="btn btn-primary btn-block mt-4" data-action="settings:save">Save All</button>\
  </div>';
    } else if (cat === 'parent') {
      h += '<h3 class="section-title mb-6">Parent Details</h3>\
  <div class="glass-card p-6">\
    <div class="grid grid-cols-2 gap-4">\
      ' + renderInput('parentName', 'Parent Name', current.parentName, 'text', 'Enter parent name') + '\
      ' + renderInput('parentPhone', 'Parent Phone', current.parentPhone, 'tel', '+91 98765 12345') + '\
      ' + renderInput('parentEmail', 'Parent Email', current.parentEmail, 'email', 'parent@email.com') + '\
      ' + renderInput('parentOccupation', 'Occupation', current.parentOccupation, 'text', 'Enter occupation') + '\
    </div>\
    <button class="btn btn-primary btn-block mt-4" data-action="settings:save">Save All</button>\
  </div>';
    } else if (cat === 'emergency') {
      h += '<h3 class="section-title mb-6">Emergency Contact</h3>\
  <div class="glass-card p-6">\
    <div class="c-bg-glass c-p-4 c-radius-md c-mb-4"><div class="c-fs-sm c-fw-medium c-mb-2">Important</div><div class="c-fs-xs c-text-secondary">This contact will be reached in case of an emergency. Please ensure the details are accurate.</div></div>\
    <div class="grid grid-cols-2 gap-4">\
      ' + renderInput('emergencyName', 'Contact Name', current.emergencyName, 'text', 'Enter contact name') + '\
      ' + renderInput('emergencyPhone', 'Phone', current.emergencyPhone, 'tel', '+91 91234 56789') + '\
      ' + renderSelect('emergencyRelation', 'Relationship', current.emergencyRelation, [{value:'Mother',label:'Mother'},{value:'Father',label:'Father'},{value:'Guardian',label:'Guardian'},{value:'Sibling',label:'Sibling'},{value:'Other',label:'Other'}]) + '\
    </div>\
    <button class="btn btn-primary btn-block mt-4" data-action="settings:save">Save All</button>\
  </div>';
    } else if (cat === 'language') {
      h += '<h3 class="section-title mb-6">Language</h3>\
  <div class="glass-card p-6">\
    ' + renderSelect('language', 'Display Language', current.language, [{value:'en',label:'English'},{value:'hi',label:'Hindi'},{value:'ta',label:'Tamil'},{value:'te',label:'Telugu'},{value:'kn',label:'Kannada'},{value:'ml',label:'Malayalam'},{value:'mr',label:'Marathi'},{value:'gu',label:'Gujarati'},{value:'bn',label:'Bengali'},{value:'pa',label:'Punjabi'}]) + '\
    ' + renderToggle('autoDetect', 'Auto-detect Language', current.autoDetect) + '\
    <button class="btn btn-primary btn-block mt-4" data-action="settings:save">Save All</button>\
  </div>';
    } else if (cat === 'notifications') {
      h += '<h3 class="section-title mb-6">Notification Preferences</h3>\
  <div class="glass-card p-6 mb-4">\
    <div class="section-header mb-4"><h4 class="font-semibold">General</h4></div>\
    <div class="flex flex-col gap-2">\
      ' + renderToggle('emailNotifications', 'Email Notifications', current.emailNotifications) + '\
      <div class="divider m-0"></div>\
      ' + renderToggle('pushNotifications', 'Push Notifications', current.pushNotifications) + '\
      <div class="divider m-0"></div>\
      ' + renderToggle('soundEffects', 'Sound Effects', current.soundEffects) + '\
    </div>\
  </div>\
  <div class="glass-card p-6">\
    <div class="section-header mb-4"><h4 class="font-semibold">Notification Types</h4></div>\
    <div class="flex flex-col gap-2">\
      ' + renderToggle('notifAssignments', 'Assignments', current.notifAssignments) + '\
      <div class="divider m-0"></div>\
      ' + renderToggle('notifQuizzes', 'Quizzes', current.notifQuizzes) + '\
      <div class="divider m-0"></div>\
      ' + renderToggle('notifExams', 'Exams', current.notifExams) + '\
      <div class="divider m-0"></div>\
      ' + renderToggle('notifCommunity', 'Community', current.notifCommunity) + '\
      <div class="divider m-0"></div>\
      ' + renderToggle('notifAnnouncements', 'Announcements', current.notifAnnouncements) + '\
    </div>\
    <button class="btn btn-primary btn-block mt-4" data-action="settings:save">Save All</button>\
  </div>';
    } else if (cat === 'privacy') {
      h += '<h3 class="section-title mb-6">Privacy</h3>\
  <div class="glass-card p-6">\
    <div class="flex items-center justify-between py-3">\
      <div><div class="text-sm font-medium">Profile Visibility</div><div class="text-xs text-secondary">' + (current.profileVisibility === 'public' ? 'Public - Anyone can see your profile' : 'Private - Only you can see your profile') + '</div></div>\
      <label class="toggle-switch">\
        <input type="checkbox" ' + (current.profileVisibility === 'public' ? 'checked' : '') + ' onchange="window._toggleSetting(\'profileVisibility\', this.checked ? \'public\' : \'private\')">\
        <span class="toggle-slider"></span>\
      </label>\
    </div>\
    <div class="divider"></div>\
    ' + renderToggle('showOnlineStatus', 'Show Online Status', current.showOnlineStatus) + '\
    <div class="divider"></div>\
    ' + renderToggle('showProgress', 'Show Progress on Profile', current.showProgress) + '\
    <div class="divider"></div>\
    ' + renderToggle('showAchievements', 'Show Achievements', current.showAchievements) + '\
    <button class="btn btn-primary btn-block mt-4" data-action="settings:save">Save All</button>\
  </div>';
    } else if (cat === 'security') {
      h += '<h3 class="section-title mb-6">Security</h3>\
  <div class="glass-card p-6">\
    <div class="section-header mb-4"><h4 class="font-semibold">Two-Factor Authentication</h4></div>\
    ' + renderToggle('twoFactorAuth', 'Enable Two-Factor Auth', current.twoFactorAuth) + '\
    <div class="divider"></div>\
    ' + renderToggle('loginAlerts', 'Login Alerts', current.loginAlerts) + '\
    <button class="btn btn-primary btn-block mt-4" data-action="settings:save">Save All</button>\
  </div>';
    }
    h += '</div>';
    return h;
  }

  function render() {
    mc.innerHTML = '\
<div class="settings-page">\
  <div class="page-header">\
    <div><h1 class="page-title">Settings</h1><p class="page-subtitle">Customize your experience</p></div>\
  </div>\
  <div class="settings-layout">\
    <div class="settings-sidebar glass-card p-4" id="settings-sidebar">' + renderSidebar() + '</div>\
    <div class="settings-main" id="settings-main">' + renderContent(activeCategory) + '</div>\
  </div>\
</div>';

    window.switchTab = function(cat) {
      activeCategory = cat;
      current = getSettings();
      var items = document.querySelectorAll('.settings-nav-item');
      for (var i = 0; i < items.length; i++) {
        items[i].classList.toggle('active', items[i].dataset.cat === cat);
      }
      document.getElementById('settings-main').innerHTML = renderContent(cat);
    };

    window._saveSetting = function(key, value) {
      var mapping = {
        fullName: 'fullName', email: 'email', phone: 'phone',
        dateOfBirth: 'dateOfBirth', gender: 'gender', bloodGroup: 'bloodGroup',
        address: 'address', city: 'city', state: 'state', pincode: 'pincode', country: 'country',
        parentName: 'parentName', parentPhone: 'parentPhone', parentEmail: 'parentEmail', parentOccupation: 'parentOccupation',
        emergencyName: 'emergencyName', emergencyPhone: 'emergencyPhone', emergencyRelation: 'emergencyRelation',
        language: 'language'
      };
      var saveKey = mapping[key] || key;
      saveSetting(saveKey, value);
      current[key] = value;
      showSavedMsg();
    };

    window._toggleSetting = function(key, value) {
      saveSetting(key, value);
      current[key] = value;
      showSavedMsg();
    };

    window.saveAllSettings = function() {
      var fields = ['fullName','email','phone','dateOfBirth','gender','bloodGroup','address','city','state','pincode','country','parentName','parentPhone','parentEmail','parentOccupation','emergencyName','emergencyPhone','emergencyRelation','language'];
      for (var fi = 0; fi < fields.length; fi++) {
        var el = document.getElementById(fields[fi]);
        if (el) saveSetting(fields[fi], el.value);
      }
      showSavedMsg();
    };

    window.setTheme = function(color) {
      saveSetting('accentColor', color);
      current.accentColor = color;
      showSavedMsg();
    };

    window.confirmLogout = function() {
      if (window.App && window.App.logout) {
        window.App.logout();
      } else {
        store.set('isAuthenticated', false);
        window.location.hash = '#/';
      }
    };
  }

  render();
};
