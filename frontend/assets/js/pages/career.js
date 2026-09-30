window.renderPage = window.renderPage || {};

(function() {
  var store = window.Store;
  var utils = window.Utils;
  var mockData = window.mockData;
  var router = window.Router;

  document.addEventListener('click', function(e) {
    var t = e.target.closest('[data-action^="career:"]');
    if (!t) return;
    var p = t.getAttribute('data-action').split(':');
    var c = p[1];
    if (c === 'showDetail') { var id = t.getAttribute('data-id'); if (id) window.renderPage.showCareerDetail(id); }
    if (c === 'filter') { var f = t.getAttribute('data-filter') || 'all'; var ef = t.getAttribute('data-edufilter') || 'all'; var s = (document.getElementById('career-search') || {}).value || ''; window.renderPage.career({ filter: f, search: s, eduFilter: ef }); }
    if (c === 'quiz') { window.renderPage.submitCareerQuiz(); }
    if (c === 'toast') { showToast(t.getAttribute('data-message') || '', t.getAttribute('data-type') || 'info'); }
    if (c === 'closeModal') { var overlay = t.closest('.modal-overlay'); if (overlay) overlay.remove(); }
  });
  document.addEventListener('keydown', function(e) {
    if (e.key !== 'Enter') return;
    var t = e.target.closest('[data-action="career:search"]');
    if (!t) return;
    var f = t.getAttribute('data-filter') || 'all';
    var ef = t.getAttribute('data-edufilter') || 'all';
    window.renderPage.career({ filter: f, search: t.value, eduFilter: ef });
  });

  var FILTERS = [
    { value: 'all', label: 'All', icon: '\uD83C\uDF1F' },
    { value: 'science', label: 'Science', icon: '\uD83D\uDD2C' },
    { value: 'commerce', label: 'Commerce', icon: '\uD83D\uDCBC' },
    { value: 'arts', label: 'Arts', icon: '\uD83C\uDFA8' },
    { value: 'technology', label: 'Technology', icon: '\uD83D\uDCBB' },
    { value: 'medical', label: 'Medical', icon: '\uD83C\uDFE5' }
  ];

  var EDU_FILTERS = [
    { value: 'all', label: 'All Levels' },
    { value: '10th', label: '10th Pass' },
    { value: '12th', label: '12th Pass' },
    { value: 'graduate', label: 'Graduate' }
  ];

  var STREAM_KEYWORDS = {
    science: ['engineer','physicist','chemist','biotechnolog','data scientist','aerospace','marine bio'],
    commerce: ['chartered accountant','financial analyst','investment banker','economist','actuary','management consultant'],
    arts: ['journalist','psychologist','fashion designer','content creator','graphic designer','interior designer','social worker','lawyer'],
    technology: ['software engineer','data engineer','cloud architect','ai/ml','game developer','blockchain','iot','ethical hacker','product manager','ux/ui'],
    medical: ['doctor','pharmacist','veterinarian','nutritionist','biotechnolog']
  };

  var STREAM_ICONS = { science:'\uD83D\uDD2C', commerce:'\uD83D\uDCBC', arts:'\uD83C\uDFA8', technology:'\uD83D\uDCBB', medical:'\uD83C\uDFE5' };

  var ASSESSMENT_QUESTIONS = [
    { q: 'Which subject do you enjoy the most?', options: [
      { val:'tech', label:'Mathematics & Computers' }, { val:'science', label:'Physics, Chemistry & Biology' },
      { val:'commerce', label:'Accountancy & Economics' }, { val:'arts', label:'Languages & Humanities' }
    ]},
    { q: 'What kind of work environment suits you?', options: [
      { val:'office', label:'Corporate Office' }, { val:'lab', label:'Laboratory/Research' },
      { val:'field', label:'Field/Outdoor Work' }, { val:'creative', label:'Creative Studio' }
    ]},
    { q: 'What is your preferred work style?', options: [
      { val:'analytical', label:'Analytical & Problem-solving' }, { val:'creative', label:'Creative & Design' },
      { val:'social', label:'Social & Helping Others' }, { val:'leadership', label:'Leadership & Management' }
    ]},
    { q: 'What is your career priority?', options: [
      { val:'money', label:'High Salary & Growth' }, { val:'stability', label:'Job Security & Stability' },
      { val:'impact', label:'Making a Difference' }, { val:'fame', label:'Recognition & Prestige' }
    ]},
    { q: 'Which skill comes naturally to you?', options: [
      { val:'logic', label:'Logic & Reasoning' }, { val:'empathy', label:'Empathy & Communication' },
      { val:'creativity', label:'Creativity & Innovation' }, { val:'organization', label:'Organization & Planning' }
    ]}
  ];

  var ROADMAP_STEPS = [
    { year: 'Class 10', label: 'Choose your stream', desc: 'Select Science, Commerce, or Arts based on interests', icon: '\uD83C\uDFAF' },
    { year: 'Class 11-12', label: 'Build foundation', desc: 'Focus on core subjects and prepare for entrance exams', icon: '\uD83D\uDCDA' },
    { year: 'Graduation', label: 'Pursue bachelor\'s degree', desc: 'Choose the right college and specialization', icon: '\uD83C\uDF93' },
    { year: 'Post-Grad', label: 'Advanced specialization', desc: 'Master\'s, certifications or professional courses', icon: '\uD83D\uDCDC' },
    { year: 'Early Career', label: 'Start working', desc: 'Entry-level roles, internships, and skill building', icon: '\uD83D\uDCBC' },
    { year: 'Mid Career', label: 'Grow & specialize', desc: 'Take on leadership roles or niche expertise', icon: '\uD83D\uDE80' },
    { year: 'Senior Level', label: 'Become an expert', desc: 'Lead teams, mentor juniors, drive strategy', icon: '\uD83C\uDFC6' }
  ];

  function getCareerIcon(title) {
    var t = (title || '').toLowerCase();
    for (var key in STREAM_KEYWORDS) {
      for (var i = 0; i < STREAM_KEYWORDS[key].length; i++) {
        if (t.indexOf(STREAM_KEYWORDS[key][i]) !== -1) return STREAM_ICONS[key];
      }
    }
    return '\uD83C\uDF1F';
  }

  function getStream(career) {
    var title = (career.title || '').toLowerCase();
    for (var key in STREAM_KEYWORDS) {
      var keywords = STREAM_KEYWORDS[key];
      for (var i = 0; i < keywords.length; i++) {
        if (title.indexOf(keywords[i]) !== -1) return key;
      }
    }
    return 'science';
  }

  function getEducationLevel(career) {
    var edu = (career.education || '').toLowerCase();
    if (edu.indexOf('10th') !== -1) return '10th';
    if (edu.indexOf('12th') !== -1 || edu.indexOf('intermediate') !== -1) return '12th';
    if (edu.indexOf('graduate') !== -1 || edu.indexOf('bachelor') !== -1 || edu.indexOf('master') !== -1 || edu.indexOf('degree') !== -1 || edu.indexOf('b.tech') !== -1 || edu.indexOf('b.sc') !== -1 || edu.indexOf('b.com') !== -1) return 'graduate';
    return 'all';
  }

  function getRecommendedCareers(allCareers, user) {
    var uClass = parseInt(user.class, 10);
    var isSL = user.stream === 'self-learner' || (!user.class && user.enrolled);
    var scored = [];
    for (var i = 0; i < allCareers.length; i++) {
      var c = allCareers[i];
      var score = 0;
      var edu = (c.education || '').toLowerCase();
      if (uClass === 10) {
        if (edu.indexOf('10th') !== -1) score += 3;
        if (edu.indexOf('12th') !== -1) score += 1;
      } else if (uClass === 12) {
        if (edu.indexOf('12th') !== -1) score += 3;
        if (edu.indexOf('graduate') !== -1 || edu.indexOf('bachelor') !== -1 || edu.indexOf('degree') !== -1) score += 2;
      } else if (isSL) {
        score += 2;
        var title = (c.title || '').toLowerCase();
        for (var ki = 0; ki < STREAM_KEYWORDS.technology.length; ki++) {
          if (title.indexOf(STREAM_KEYWORDS.technology[ki]) !== -1) { score += 1; break; }
        }
      }
      if (score > 0) {
        scored.push({ career: c, score: score });
      }
    }
    scored.sort(function(a, b) { return b.score - a.score; });
    return scored.slice(0, 4);
  }

  function matchCareerToAnswers(career, answers) {
    var score = 0;
    var text = ((career.title || '') + ' ' + (career.description || '')).toLowerCase();
    if (answers.indexOf('tech') !== -1 && /computer|software|data|engineer/.test(text)) score += 2;
    if (answers.indexOf('science') !== -1 && /biolog|chemist|physic|medical|research/.test(text)) score += 2;
    if (answers.indexOf('commerce') !== -1 && /finance|account|econom|investment/.test(text)) score += 2;
    if (answers.indexOf('arts') !== -1 && /design|journal|writer|creative|fashion/.test(text)) score += 2;
    if ((answers.indexOf('analytical') !== -1 || answers.indexOf('logic') !== -1 || answers.indexOf('lab') !== -1) && /research|analyst|scientist|engineer/.test(text)) score += 2;
    if ((answers.indexOf('creative') !== -1 || answers.indexOf('design') !== -1) && /design|creative|artist/.test(text)) score += 2;
    if ((answers.indexOf('social') !== -1 || answers.indexOf('empathy') !== -1) && /social|counsel|doctor|psychologist/.test(text)) score += 2;
    if ((answers.indexOf('leadership') !== -1 || answers.indexOf('organization') !== -1 || answers.indexOf('management') !== -1) && /manager|leader|consultant/.test(text)) score += 2;
    if (answers.indexOf('money') !== -1) {
      var numPart = parseInt((career.salaryRange || '').replace(/[^0-9]/g, '')) || 0;
      if (numPart >= 10) score += 1;
    }
    if (answers.indexOf('field') !== -1 && /field|outdoor|travel/.test(text)) score += 1;
    return score;
  }

  function showToast(message, type) {
    if (!type) type = 'info';
    var container = document.querySelector('.toast-container');
    if (!container) {
      container = document.createElement('div');
      container.className = 'toast-container';
      document.body.appendChild(container);
    }
    var toast = document.createElement('div');
    toast.className = 'toast toast-' + type;
    var icons = { success: '\u2713', error: '\u2715', info: '\u2139', warning: '\u26A0' };
    toast.innerHTML = '<span>' + (icons[type] || '\u2139') + '</span><span>' + message + '</span>';
    container.appendChild(toast);
    setTimeout(function() {
      if (toast.parentNode) toast.remove();
    }, 3000);
  }

  function openCareerModal(career) {
    var overlay = document.createElement('div');
    overlay.className = 'modal-overlay';
    var skillsHtml = '';
    for (var si = 0; si < (career.skills || []).length; si++) {
      skillsHtml += '<span class="c-tag c-tag-primary">' + utils.sanitizeHTML(career.skills[si]) + '</span>';
    }
    var examsHtml = '';
    if (career.exams) {
      var examList = typeof career.exams === 'string' ? career.exams.split(',') : career.exams;
      for (var ei = 0; ei < examList.length; ei++) {
        examsHtml += '<span class="c-tag c-tag-warning">' + utils.sanitizeHTML(examList[ei]) + '</span>';
      }
    }
    var sectorsHtml = '';
    for (var sci = 0; sci < (career.sectors || []).length; sci++) {
      sectorsHtml += '<span class="c-tag c-tag-success">' + utils.sanitizeHTML(career.sectors[sci]) + '</span>';
    }
    overlay.innerHTML = '\
<div class="modal c-modal">\
  <div class="modal-header c-modal-hdr">\
    <div class="c-flex-row-gap4">\
      <div class="c-icon-56">' + getCareerIcon(career.title) + '</div>\
      <div>\
        <h3 class="c-modal-ttl">' + utils.sanitizeHTML(career.title) + '</h3>\
        <div class="c-modal-meta">\
          <span class="c-hdr-salary">\uD83D\uDCB0 ' + utils.sanitizeHTML(career.salaryRange || 'N/A') + '</span>\
          <span class="c-hdr-demand">\uD83D\uDCC8 ' + utils.sanitizeHTML(career.demand || 'N/A') + ' Demand</span>\
        </div>\
      </div>\
    </div>\
    <button class="btn btn-ghost c-close-btn" data-action="career:closeModal">\u2715</button>\
  </div>\
  <div class="modal-body c-modal-bd">\
    <p class="c-modal-desc">' + utils.sanitizeHTML(career.description || '') + '</p>\
    <div class="c-grid-2">\
      <div class="c-info-box"><div class="c-info-lbl">\uD83C\uDF93 Education Required</div><div class="c-info-val">' + utils.sanitizeHTML(career.education || 'N/A') + '</div></div>\
      <div class="c-info-box"><div class="c-info-lbl">\uD83D\uDCCA Salary Range</div><div class="c-info-val">' + utils.sanitizeHTML(career.salaryRange || 'N/A') + '</div></div>\
    </div>\
    <div class="c-sec-gap"><div class="c-sec-ttl">\uD83D\uDEE0 Required Skills</div><div>' + skillsHtml + '</div></div>\
    <div class="c-sec-gap"><div class="c-sec-ttl">\uD83D\uDCCB Entrance Exams</div><div>' + (examsHtml || '<span class="c-text-dim">Varies by institution</span>') + '</div></div>\
    <div class="c-sec-gap"><div class="c-sec-ttl">\uD83C\uDFE2 Top Recruiting Sectors</div><div>' + (sectorsHtml || '<span class="c-text-dim">Diverse opportunities</span>') + '</div></div>\
    <div class="c-rec-box">\
      <div class="c-sec-ttl">\uD83D\uDCA1 Recommended Subjects (11-12)</div>\
      <div class="c-rec-val">' + getRecommendedSubjects(career.title) + '</div>\
    </div>\
  </div>\
</div>';
    overlay.addEventListener('click', function(e) {
      if (e.target === overlay) overlay.remove();
    });
    document.body.appendChild(overlay);
  }

  function getRecommendedSubjects(title) {
    var t = (title || '').toLowerCase();
    if (/doctor|pharmacist|veterinarian|nutritionist|biotechnolog/.test(t)) return 'Physics, Chemistry, Biology (PCB)';
    if (/software|data|engineer|cloud|ai\/ml|blockchain|iot|ethical|game|product manager|ux\/ui|technical/.test(t)) return 'Physics, Chemistry, Mathematics (PCM)';
    if (/chartered accountant|financial|economist|actuary|investment|management consultant|hr manager/.test(t)) return 'Commerce with Mathematics';
    if (/journalist|psychologist|fashion|content|graphic designer|interior|social worker|lawyer/.test(t)) return 'Arts/Humanities with any subject combination';
    if (/architect|urban/.test(t)) return 'PCM with Mathematics (B.Arch)';
    if (/pilot/.test(t)) return 'PCM (Physics & Mathematics mandatory)';
    if (/physicist|chemist|astronomer/.test(t)) return 'PCM (Science stream)';
    if (/marine|environment|geologist/.test(t)) return 'PCM or PCB with Geography';
    return 'Choose stream based on career interests';
  }

  function renderClassBadge(user) {
    var uClass = parseInt(user.class, 10);
    var isSL = user.stream === 'self-learner' || (!user.class && user.enrolled);
    var text = '';
    var icon = '';
    if (uClass === 10) { text = 'Class 10 Student'; icon = '\uD83C\uDF93'; }
    else if (uClass === 12) { text = 'Class 12 Student'; icon = '\uD83C\uDF93'; }
    else if (isSL) { text = 'Self Learner'; icon = '\uD83D\uDE80'; }
    else { return ''; }
    return '\
<div class="c-badge">\
  <span class="c-badge-ico">' + icon + '</span>\
  <span class="c-badge-txt">' + text + '</span>\
</div>';
  }

  function renderHeader(activeFilter, searchQuery, eduFilter) {
    var filterBtns = '';
    for (var fi = 0; fi < FILTERS.length; fi++) {
      var f = FILTERS[fi];
      filterBtns += '\
    <button class="btn ' + (f.value === activeFilter ? 'btn-primary' : 'btn-secondary') + ' c-filter-btn" data-action="career:filter" data-filter="' + f.value + '" data-edufilter="' + eduFilter + '">' + f.icon + ' ' + f.label + '</button>';
    }
    var eduBtns = '';
    for (var ei = 0; ei < EDU_FILTERS.length; ei++) {
      var ef = EDU_FILTERS[ei];
      eduBtns += '\
    <button class="btn ' + (ef.value === eduFilter ? 'btn-primary' : 'btn-secondary') + ' c-edu-btn" data-action="career:filter" data-filter="' + activeFilter + '" data-edufilter="' + ef.value + '">' + ef.label + '</button>';
    }
    return '\
<div class="c-section">\
  <div class="c-header-wrap">\
    <div>\
      <h1 class="c-heading-xl">Career Guidance</h1>\
      <p class="c-heading-sub">Discover your perfect career path with personalized guidance</p>\
    </div>\
    <div class="c-search-wrap">\
      <span class="c-search-ico">\uD83D\uDD0D</span>\
      <input id="career-search" type="text" placeholder="Search careers..." value="' + utils.sanitizeHTML(searchQuery) + '" class="c-search-inp" data-action="career:search" data-filter="' + activeFilter + '" data-edufilter="' + eduFilter + '">\
    </div>\
  </div>\
  <div class="c-filter-bar">' + filterBtns + '\
  </div>\
  <div class="c-edu-bar">\
    <span class="c-edu-lbl">\uD83D\uDCCB Level:</span>' + eduBtns + '\
  </div>\
</div>';
  }

  function renderRecommendedSection(allCareers, user) {
    var recommended = getRecommendedCareers(allCareers, user);
    if (recommended.length === 0) return '';
    var cardsHtml = '';
    for (var i = 0; i < recommended.length; i++) {
      cardsHtml += renderCareerCard(recommended[i].career);
    }
    return '\
<div class="c-section">\
  <div class="c-section-hdr">\
    <div>\
      <h2 class="c-section-ttl">\u2B50 Recommended for You</h2>\
      <p class="c-section-sub">Based on your education level and interests</p>\
    </div>\
  </div>\
  <div class="c-grid-1fr">' + cardsHtml + '\
  </div>\
</div>';
  }

  function renderCareerCard(career) {
    var skillsHtml = '';
    var skills = career.skills || [];
    for (var si = 0; si < Math.min(skills.length, 3); si++) {
      skillsHtml += '<span class="c-tag c-tag-primary c-card-skills-tag">' + utils.sanitizeHTML(skills[si]) + '</span>';
    }
    var demand = (career.demand || '').toLowerCase();
    var demandColor = '#34d399';
    if (demand.indexOf('high') !== -1 || demand.indexOf('very') !== -1) demandColor = '#fbbf24';
    if (demand.indexOf('niche') !== -1) demandColor = '#f472b6';
    return '\
<div class="c-card c-card-hover c-card-col">\
  <div class="c-flex-start">\
    <div class="c-icon-50">' + getCareerIcon(career.title) + '</div>\
    <div class="c-flex-1">\
      <h3 class="c-card-ttl">' + utils.sanitizeHTML(career.title) + '</h3>\
      <div class="c-flex-wrap-gap2 c-card-meta">\
        <span class="c-card-salary">\uD83D\uDCB0 ' + utils.sanitizeHTML(career.salaryRange || 'N/A') + '</span>\
        <span class="c-card-demand" style="color:' + demandColor + ';background:' + demandColor + '22">\uD83D\uDCC8 ' + utils.sanitizeHTML(career.demand || 'N/A') + '</span>\
      </div>\
    </div>\
  </div>\
  <p class="c-card-txt">' + utils.sanitizeHTML(utils.truncate(career.description || '', 100)) + '</p>\
  <div class="c-card-edu">\
    <div class="c-card-dur">\uD83C\uDF93 ' + utils.sanitizeHTML(career.education || '') + '</div>\
    <div class="c-card-skills">' + skillsHtml + '</div>\
  </div>\
  <button class="c-btn-view" data-action="career:showDetail" data-id="' + career.id + '">\uD83D\uDD0D View Details</button>\
</div>';
  }

  window.renderPage.showCareerDetail = function(id) {
    var careers = mockData.careers || [];
    for (var i = 0; i < careers.length; i++) {
      if (careers[i].id === id) { openCareerModal(careers[i]); return; }
    }
  };

  function renderAssessment() {
    var questionsHtml = '';
    for (var qi = 0; qi < ASSESSMENT_QUESTIONS.length; qi++) {
      var q = ASSESSMENT_QUESTIONS[qi];
      var optsHtml = '';
      for (var oi = 0; oi < q.options.length; oi++) {
        var opt = q.options[oi];
        optsHtml += '\
      <label class="c-opt-label">\
        <input type="radio" name="caq' + qi + '" value="' + opt.val + '" class="c-radio-inp">\
        <span class="c-opt-lbl-txt">' + opt.label + '</span>\
      </label>';
      }
      questionsHtml += '\
    <div class="c-assessment-q">\
      <div class="c-assessment-q-ttl">' + (qi + 1) + '. ' + q.q + '</div>\
      <div class="c-opt-wrap">' + optsHtml + '\
      </div>\
    </div>';
    }
    return '\
<div class="c-section">\
  <div class="c-section-hdr">\
    <div>\
      <h2 class="c-section-ttl">\uD83E\uDDED Career Assessment Quiz</h2>\
      <p class="c-section-sub">Answer 5 quick questions to find your ideal career path</p>\
    </div>\
  </div>\
  <div id="assessment-questions" class="c-questions-wrap">' + questionsHtml + '\
  </div>\
  <div id="assessment-result" class="c-assessment-rs c-hidden"></div>\
  <button class="c-quiz-btn" data-action="career:quiz">\uD83C\uDFAF See My Career Matches</button>\
</div>';
  }

  window.renderPage.submitCareerQuiz = function() {
    var answers = [];
    for (var qi = 0; qi < ASSESSMENT_QUESTIONS.length; qi++) {
      var radios = document.getElementsByName('caq' + qi);
      var checked = null;
      for (var ri = 0; ri < radios.length; ri++) {
        if (radios[ri].checked) { checked = radios[ri].value; break; }
      }
      if (!checked) { showToast('Please answer question ' + (qi + 1), 'warning'); return; }
      answers.push(checked);
    }
    var careers = mockData.careers || [];
    var scored = [];
    for (var ci = 0; ci < careers.length; ci++) {
      scored.push({ career: careers[ci], score: matchCareerToAnswers(careers[ci], answers) });
    }
    scored.sort(function(a, b) { return b.score - a.score; });
    var top3 = scored.slice(0, 3);
    var resultDiv = document.getElementById('assessment-result');
    if (!resultDiv) return;
    var html = '<div class="c-result-ttl">\uD83C\uDF89 Your Top Career Matches</div><div class="c-result-grid">';
    for (var ti = 0; ti < top3.length; ti++) {
      var c = top3[ti].career;
      var bars = [];
      for (var bi = 0; bi < 5; bi++) {
        bars.push('<div class="c-bar-seg ' + (bi < top3[ti].score ? 'c-bar-fill' : 'c-bar-empty') + '"></div>');
      }
      html += '\
    <div class="c-match-row" data-action="career:showDetail" data-id="' + c.id + '">\
      <div class="c-match-icon">' + getCareerIcon(c.title) + '</div>\
      <div class="c-flex-1">\
        <div class="c-match-name">' + utils.sanitizeHTML(c.title) + '</div>\
        <div class="c-match-bars">' + bars.join('') + '</div>\
      </div>\
      <div class="c-match-salary">' + utils.sanitizeHTML(c.salaryRange || '') + '</div>\
    </div>';
    }
    html += '</div>';
    resultDiv.classList.remove('c-hidden');
    resultDiv.innerHTML = html;
    resultDiv.scrollIntoView({ behavior: 'smooth', block: 'center' });
  };

  function renderInternships() {
    var internships = mockData.internships || [];
    var html = '';
    for (var i = 0; i < Math.min(internships.length, 6); i++) {
      var int = internships[i];
      var skillsHtml = '';
      var skills = int.skills || [];
      for (var si = 0; si < Math.min(skills.length, 3); si++) {
        skillsHtml += '<span class="c-tag c-tag-success c-card-skills-tag-xs">' + utils.sanitizeHTML(skills[si]) + '</span>';
      }
      var typeColor = int.type === 'remote' ? '#60a5fa' : int.type === 'hybrid' ? '#fbbf24' : '#a78bfa';
      html += '\
    <div class="c-card c-card-hover-blue c-card-pad-sm">\
      <div class="c-flex-row-gap3 c-mb-12">\
        <div class="c-icon-42 c-icon-44-blue">\uD83C\uDFE2</div>\
        <div class="c-flex-1">\
          <div class="c-company-ttl">' + utils.sanitizeHTML(int.company || '') + '</div>\
          <div class="c-company-role">' + utils.sanitizeHTML(int.title || '') + '</div>\
        </div>\
      </div>\
      <div class="c-intern-meta">\
        <span class="c-intern-pay">\uD83D\uDCB0 \u20B9' + (int.stipend || 0).toLocaleString() + '</span>\
        <span class="c-intern-dur">\u23F1 ' + utils.sanitizeHTML(int.duration || '') + '</span>\
        <span style="color:' + typeColor + '">\uD83D\uDCCD ' + utils.sanitizeHTML(int.type || '') + '</span>\
      </div>\
      <div class="c-intern-skills">' + skillsHtml + '</div>\
      <button class="c-btn-apply" data-action="career:toast" data-message="Applied to ' + utils.sanitizeHTML(int.company) + '" data-type="success">\uD83D\uDCE9 Apply Now</button>\
    </div>';
    }
    return '\
<div class="c-section">\
  <div class="c-section-hdr">\
    <div>\
      <h2 class="c-section-ttl">\uD83D\uDCBC Internship Opportunities</h2>\
      <p class="c-section-sub">Gain hands-on experience with top companies</p>\
    </div>\
  </div>\
  <div class="c-grid-1fr-sm">' + html + '\
  </div>\
</div>';
  }

  function renderExams() {
    var exams = mockData.competitiveExams || [];
    var html = '';
    for (var i = 0; i < Math.min(exams.length, 6); i++) {
      var ex = exams[i];
      var dates = ex.importantDates || {};
      var datesHtml = '';
      for (var dk in dates) {
        if (dates.hasOwnProperty(dk)) {
          datesHtml += '<div class="c-date-row"><span class="c-date-key">' + dk + '</span><span class="c-date-val">' + dates[dk] + '</span></div>';
        }
      }
      var subjects = ex.subjects || [];
      var subsHtml = '';
      for (var si = 0; si < subjects.length; si++) {
        subsHtml += '<span class="c-exam-tag">' + utils.sanitizeHTML(subjects[si]) + '</span>';
      }
      html += '\
    <div class="c-card c-card-hover-yellow c-card-pad">\
      <div class="c-exam-hdr">\
        <div class="c-icon-44 c-icon-44-yellow">\uD83D\uDCCB</div>\
        <div>\
          <h4 class="c-exam-ttl">' + utils.sanitizeHTML(ex.name || '') + '</h4>\
          <div class="c-exam-form">' + utils.sanitizeHTML(ex.fullForm || '') + '</div>\
        </div>\
      </div>\
      <p class="c-exam-desc">' + utils.sanitizeHTML(ex.description || '') + '</p>\
      <div class="c-exam-subs"><div class="c-exam-subs-lbl">\uD83D\uDCDA Subjects</div><div>' + subsHtml + '</div></div>\
      <div class="c-dates-box">\
        <div class="c-dates-lbl">\uD83D\uDCC5 Important Dates</div>' + datesHtml + '\
      </div>\
      <div class="c-exam-info-flex">\
        <div class="c-exam-info-box">\
          <div class="c-exam-info-lbl">Eligibility</div>\
          <div class="c-exam-info-val">' + utils.sanitizeHTML(utils.truncate(ex.eligibility || '', 40)) + '</div>\
        </div>\
        <div class="c-exam-info-box c-exam-info-box-green">\
          <div class="c-exam-info-lbl">Pattern</div>\
          <div class="c-exam-info-val">' + utils.sanitizeHTML(ex.examPattern || '') + '</div>\
        </div>\
      </div>\
    </div>';
    }
    return '\
<div class="c-section">\
  <div class="c-section-hdr">\
    <div>\
      <h2 class="c-section-ttl">\uD83D\uDCCB Competitive Exams</h2>\
      <p class="c-section-sub">Know your exams and plan your preparation</p>\
    </div>\
  </div>\
  <div class="c-grid-1fr">' + html + '\
  </div>\
</div>';
  }

  function renderSkills() {
    var skills = mockData.skills || [];
    var html = '';
    for (var i = 0; i < Math.min(skills.length, 8); i++) {
      var sk = skills[i];
      var progress = Math.min(Math.max(10, Math.floor(Math.random() * 80) + 20), 90);
      html += '\
    <div class="c-card c-card-hover-green c-card-pad">\
      <div class="c-flex-row-gap3 c-mb-14">\
        <div class="c-icon-44 c-icon-44-green">\u2B50</div>\
        <div class="c-flex-1">\
          <h4 class="c-skill-ttl">' + utils.sanitizeHTML(sk.name || '') + '</h4>\
          <span class="c-tag c-tag-primary c-skill-cat">' + utils.sanitizeHTML(sk.category || '') + '</span>\
        </div>\
      </div>\
      <p class="c-skill-desc">' + utils.sanitizeHTML(sk.description || '') + '</p>\
      <div class="c-skill-progress-lbl">\
        <span class="c-skill-dur">\u23F1 ' + utils.sanitizeHTML(sk.duration || '') + '</span>\
        <span class="c-skill-pct">' + progress + '% complete</span>\
      </div>\
      <div class="c-skill-bar">\
        <div class="c-skill-bar-fill" style="width:' + progress + '%"></div>\
      </div>\
      <button class="c-btn-start" data-action="career:toast" data-message="Starting ' + utils.sanitizeHTML(sk.name) + ' course..." data-type="success">\uD83D\uDE80 Start Learning</button>\
    </div>';
    }
    return '\
<div class="c-section">\
  <div class="c-section-hdr">\
    <div>\
      <h2 class="c-section-ttl">\u26A1 Skill Development</h2>\
      <p class="c-section-sub">Build skills that set you apart from the crowd</p>\
    </div>\
  </div>\
  <div class="c-grid-1fr-sm">' + html + '\
  </div>\
</div>';
  }

  function renderRoadmap() {
    var stepsHtml = '';
    for (var i = 0; i < ROADMAP_STEPS.length; i++) {
      var step = ROADMAP_STEPS[i];
      var isCurrent = i === 2;
      stepsHtml += '\
    <div class="c-rm-step">\
      <div class="c-rm-step-icon-col">\
        <div class="c-rm-circle ' + (isCurrent ? 'c-rm-circle-cur' : 'c-rm-circle-def') + '">' + step.icon + '</div>\
        ' + (i < ROADMAP_STEPS.length - 1 ? '<div class="c-rm-conn ' + (isCurrent ? 'c-rm-conn-cur' : 'c-rm-conn-def') + '"></div>' : '') + '\
      </div>\
      <div class="c-rm-body">\
        <div class="c-rm-hdr">\
          <span class="c-rm-year ' + (isCurrent ? 'c-rm-year-cur' : 'c-rm-year-def') + '">' + step.year + '</span>\
          <h4 class="c-rm-lbl">' + step.label + '</h4>\
          ' + (isCurrent ? '<span class="c-rm-cur-badge">You are here</span>' : '') + '\
        </div>\
        <p class="c-rm-desc">' + step.desc + '</p>\
      </div>\
    </div>';
    }
    return '\
<div class="c-section">\
  <div class="c-section-hdr c-mb-24">\
    <div>\
      <h2 class="c-section-ttl">\uD83D\uDDFA\uFE0F Career Roadmap</h2>\
      <p class="c-section-sub">Navigate your journey from school to professional success</p>\
    </div>\
  </div>\
  <div class="c-rm-box">\
    <div>' + stepsHtml + '\
    </div>\
  </div>\
</div>';
  }

  window.renderPage.career = function(params) {
    var mainContent = document.getElementById('main-content');
    if (!mainContent) return;

    var user = store.get('user') || {};
    var userClass = parseInt(user.class, 10);
    var isSelfLearner = user.stream === 'self-learner' || (!user.class && user.enrolled);
    var isEligible = userClass === 10 || userClass === 12 || isSelfLearner;

    if (!isEligible) {
      mainContent.innerHTML = '\
<style>\
' + STYLE_BLOCK + '\
</style>\
<div class="page-container-inner">\
  <div class="c-inner">\
    <div class="c-inner-icon">\uD83C\uDF93</div>\
    <h2 class="c-inner-ttl">Career Guidance</h2>\
    <p class="c-inner-sub">Career Guidance is available for Class 10, Class 12, and Self Learners. Explore our other learning resources!</p>\
  </div>\
</div>';
      return;
    }

    params = params || {};
    var activeFilter = params.filter || 'all';
    var searchQuery = params.search || '';
    var eduFilter = params.eduFilter || 'all';

    var careers = mockData.careers || [];
    var filtered = [];
    for (var ci = 0; ci < careers.length; ci++) {
      var c = careers[ci];
      if (activeFilter !== 'all' && getStream(c) !== activeFilter) continue;
      if (eduFilter !== 'all' && getEducationLevel(c) !== eduFilter) continue;
      if (searchQuery) {
        var q = searchQuery.toLowerCase();
        var text = (c.title + ' ' + (c.description || '') + ' ' + (c.education || '')).toLowerCase();
        var skillMatch = false;
        for (var si = 0; si < (c.skills || []).length; si++) {
          if (c.skills[si].toLowerCase().indexOf(q) !== -1) { skillMatch = true; break; }
        }
        if (text.indexOf(q) === -1 && !skillMatch) continue;
      }
      filtered.push(c);
    }

    var cardsHtml = '';
    for (var i = 0; i < Math.min(filtered.length, 12); i++) {
      cardsHtml += renderCareerCard(filtered[i]);
    }

    var html = '\
<style>\
' + STYLE_BLOCK + '\
</style>\
<div class="page-container-inner">\
  <div class="c-page-inner">' +
    renderClassBadge(user) +
    renderHeader(activeFilter, searchQuery, eduFilter) +
    renderRecommendedSection(careers, user) +
    renderAssessment() +
    '<div class="c-section">\
      <div class="c-section-hdr">\
        <div>\
          <h2 class="c-section-ttl">\uD83D\uDD0D Explore Careers</h2>\
          <p class="c-section-sub">' + filtered.length + ' career path' + (filtered.length !== 1 ? 's' : '') + ' found</p>\
        </div>\
      </div>\
      <div class="c-grid-1fr">' +
        (cardsHtml || '<div class="c-empty-msg"><div class="c-empty-ico">\uD83D\uDD0D</div><div class="c-empty-ttl">No careers found</div><p class="c-section-sub">Try adjusting your search or filter</p></div>') +
      '</div>\
    </div>' +
    renderInternships() +
    renderExams() +
    renderSkills() +
    renderRoadmap() + '\
  </div>\
</div>';
    mainContent.innerHTML = html;
  };

  var STYLE_BLOCK = '\
.c-card{background:linear-gradient(135deg,rgba(30,27,75,0.7),rgba(15,23,42,0.8));border-radius:18px;border:1px solid rgba(99,102,241,0.15);padding:24px;transition:all 0.3s}\
.c-tag{display:inline-block;padding:4px 12px;border-radius:20px;margin:3px 4px}\
.c-tag-primary{background:rgba(99,102,241,0.2);color:#818cf8;border:1px solid rgba(99,102,241,0.3)}\
.c-tag-warning{background:rgba(251,191,36,0.15);color:#fbbf24;border:1px solid rgba(251,191,36,0.25)}\
.c-tag-success{background:rgba(52,211,153,0.15);color:#34d399;border:1px solid rgba(52,211,153,0.25)}\
.c-info-box{background:rgba(255,255,255,0.04);border-radius:12px;padding:14px 16px;border:1px solid rgba(255,255,255,0.06)}\
.c-opt-label{display:flex;align-items:center;gap:10px;padding:10px 14px;border-radius:12px;background:rgba(255,255,255,0.04);border:1px solid rgba(255,255,255,0.08);cursor:pointer;flex:1;min-width:160px;transition:all 0.2s}\
.c-opt-label:hover{border-color:rgba(99,102,241,0.3);background:rgba(99,102,241,0.08)}\
.btn-primary{transition:all 0.2s}\
.btn-primary:hover{opacity:0.9;transform:translateY(-1px)}\
.c-card-col{display:flex;flex-direction:column}\
.c-card-hover{transition:all 0.3s;cursor:pointer}\
.c-card-hover:hover{border-color:rgba(99,102,241,0.4)!important;transform:translateY(-2px);box-shadow:0 12px 40px rgba(99,102,241,0.15)}\
.c-card-hover-yellow{transition:all 0.3s}\
.c-card-hover-yellow:hover{border-color:rgba(251,191,36,0.3)!important}\
.c-card-hover-green{transition:all 0.3s}\
.c-card-hover-green:hover{border-color:rgba(52,211,153,0.3)!important}\
.c-card-hover-blue{transition:all 0.3s}\
.c-card-hover-blue:hover{border-color:rgba(99,102,241,0.3)!important}\
.c-section{margin-bottom:40px}\
.c-section-hdr{margin-bottom:20px;display:flex;align-items:center;justify-content:space-between}\
.c-section-ttl{margin:0 0 4px;font-size:1.4rem;font-weight:700;color:#e2e8f0}\
.c-section-sub{margin:0;color:#64748b;font-size:0.85rem}\
.c-header-wrap{display:flex;justify-content:space-between;align-items:flex-start;flex-wrap:wrap;gap:16px;margin-bottom:20px}\
.c-heading-xl{display:inline-block;font-size:2rem;font-weight:800;background:linear-gradient(135deg,#818cf8,#c084fc);-webkit-background-clip:text;-webkit-text-fill-color:transparent;margin:0 0 4px}\
.c-heading-sub{margin:0;color:#94a3b8;font-size:0.95rem}\
.c-search-wrap{position:relative;width:320px;max-width:100%}\
.c-search-ico{position:absolute;left:14px;top:50%;transform:translateY(-50%);color:#64748b;font-size:1.1rem;pointer-events:none}\
.c-search-inp{width:100%;padding:12px 16px 12px 44px;border-radius:14px;background:rgba(255,255,255,0.06);border:1px solid rgba(255,255,255,0.1);color:#e2e8f0;font-size:0.9rem;outline:none}\
.c-filter-bar{display:flex;gap:8px;flex-wrap:wrap;margin-bottom:10px}\
.c-edu-bar{display:flex;gap:8px;flex-wrap:wrap;align-items:center}\
.c-edu-lbl{color:#94a3b8;font-size:0.85rem;font-weight:500;margin-right:4px}\
.c-filter-btn{padding:8px 18px;border-radius:12px;font-size:0.85rem;white-space:nowrap;cursor:pointer}\
.c-edu-btn{padding:6px 14px;border-radius:10px;font-size:0.8rem;white-space:nowrap;cursor:pointer}\
.c-badge{display:inline-flex;align-items:center;gap:8px;margin-bottom:20px;padding:10px 20px;background:linear-gradient(135deg,rgba(99,102,241,0.15),rgba(168,85,247,0.15));border-radius:12px;border:1px solid rgba(99,102,241,0.2)}\
.c-badge-ico{font-size:1.3rem}\
.c-badge-txt{color:#e2e8f0;font-size:0.95rem;font-weight:600}\
.c-grid-1fr{display:grid;grid-template-columns:repeat(auto-fill,minmax(320px,1fr));gap:18px}\
.c-grid-1fr-sm{display:grid;grid-template-columns:repeat(auto-fill,minmax(300px,1fr));gap:16px}\
.c-flex-start{display:flex;align-items:flex-start;gap:14px;margin-bottom:14px}\
.c-flex-row-gap2{display:flex;align-items:center;gap:8px}\
.c-flex-row-gap3{display:flex;align-items:center;gap:12px}\
.c-flex-row-gap4{display:flex;align-items:center;gap:16px}\
.c-flex-wrap-gap2{display:flex;flex-wrap:wrap;gap:8px}\
.c-flex-1{flex:1;min-width:0}\
.c-icon-56{width:56px;height:56px;border-radius:16px;display:flex;align-items:center;justify-content:center;font-size:2rem;flex-shrink:0;background:linear-gradient(135deg,rgba(99,102,241,0.3),rgba(168,85,247,0.3))}\
.c-icon-50{width:50px;height:50px;border-radius:14px;display:flex;align-items:center;justify-content:center;font-size:1.6rem;flex-shrink:0;background:linear-gradient(135deg,rgba(99,102,241,0.25),rgba(168,85,247,0.25))}\
.c-icon-44{width:44px;height:44px;border-radius:12px;display:flex;align-items:center;justify-content:center;font-size:1.3rem;flex-shrink:0}\
.c-icon-44-blue{background:linear-gradient(135deg,rgba(96,165,250,0.2),rgba(99,102,241,0.2))}\
.c-icon-44-yellow{background:linear-gradient(135deg,rgba(251,191,36,0.2),rgba(245,158,11,0.2))}\
.c-icon-44-green{background:linear-gradient(135deg,rgba(52,211,153,0.2),rgba(16,185,129,0.2))}\
.c-icon-42{width:42px;height:42px;border-radius:12px;display:flex;align-items:center;justify-content:center;font-size:1.2rem;flex-shrink:0}\
.c-modal{max-width:700px;background:linear-gradient(135deg,rgba(30,27,75,0.98),rgba(15,23,42,0.98));border:1px solid rgba(99,102,241,0.3);border-radius:20px;box-shadow:0 25px 50px rgba(0,0,0,0.5);backdrop-filter:blur(20px);max-height:85vh;overflow-y:auto}\
.c-modal-hdr{padding:24px 28px 16px;border-bottom:1px solid rgba(255,255,255,0.08);display:flex;align-items:center;justify-content:space-between}\
.c-modal-bd{padding:24px 28px}\
.c-modal-ttl{margin:0;font-size:1.35rem;font-weight:700;color:#fff}\
.c-modal-meta{display:flex;gap:12px;margin-top:6px;font-size:0.85rem}\
.c-modal-desc{color:#cbd5e1;font-size:0.95rem;line-height:1.6;margin:0 0 20px}\
.c-hdr-salary{color:#818cf8}\
.c-hdr-demand{color:#34d399}\
.c-close-btn{color:#94a3b8;font-size:1.5rem;border:none;background:none;cursor:pointer}\
.c-grid-2{display:grid;grid-template-columns:1fr 1fr;gap:16px;margin-bottom:20px}\
.c-info-lbl{color:#64748b;font-size:0.8rem;margin-bottom:4px}\
.c-info-val{color:#e2e8f0;font-size:0.9rem;font-weight:500}\
.c-sec-ttl{color:#94a3b8;font-size:0.85rem;font-weight:600;margin-bottom:8px}\
.c-sec-val{color:#e2e8f0;font-size:0.9rem}\
.c-sec-gap{margin-bottom:20px}\
.c-rec-box{background:linear-gradient(135deg,rgba(99,102,241,0.12),rgba(168,85,247,0.12));border-radius:14px;padding:18px 20px;border:1px solid rgba(99,102,241,0.2)}\
.c-rec-val{color:#e2e8f0;font-size:0.9rem}\
.c-card-ttl{margin:0 0 4px;font-size:1.1rem;font-weight:700;color:#e2e8f0}\
.c-card-txt{color:#94a3b8;font-size:0.85rem;line-height:1.5;margin:0 0 14px;flex:1}\
.c-card-meta{font-size:0.8rem}\
.c-card-salary{color:#818cf8}\
.c-card-demand{display:inline-block;padding:1px 8px;border-radius:8px}\
.c-card-edu{margin-bottom:14px}\
.c-card-dur{color:#64748b;font-size:0.75rem;margin-bottom:6px}\
.c-card-skills{display:flex;flex-wrap:wrap}\
.c-card-skills-tag{font-size:0.7rem;padding:3px 10px}\
.c-card-skills-tag-xs{font-size:0.7rem;padding:2px 8px;margin:1px 2px}\
.c-btn-view{width:100%;padding:10px;border-radius:12px;background:linear-gradient(135deg,rgba(99,102,241,0.25),rgba(168,85,247,0.25));border:1px solid rgba(99,102,241,0.3);color:#e2e8f0;font-size:0.9rem;font-weight:600;cursor:pointer}\
.c-btn-view:hover{background:linear-gradient(135deg,rgba(99,102,241,0.35),rgba(168,85,247,0.35))}\
.c-btn-apply{width:100%;padding:8px;border-radius:10px;background:linear-gradient(135deg,rgba(99,102,241,0.3),rgba(168,85,247,0.3));border:1px solid rgba(99,102,241,0.3);color:#e2e8f0;font-size:0.85rem;cursor:pointer}\
.c-btn-apply:hover{background:linear-gradient(135deg,rgba(99,102,241,0.4),rgba(168,85,247,0.4))}\
.c-btn-start{width:100%;padding:8px;border-radius:10px;background:linear-gradient(135deg,rgba(52,211,153,0.25),rgba(16,185,129,0.25));border:1px solid rgba(52,211,153,0.3);color:#e2e8f0;font-size:0.85rem;cursor:pointer}\
.c-btn-start:hover{background:linear-gradient(135deg,rgba(52,211,153,0.35),rgba(16,185,129,0.35))}\
.c-card-pad-sm{padding:18px}\
.c-card-pad{padding:20px}\
.c-company-ttl{color:#e2e8f0;font-weight:600;font-size:0.95rem}\
.c-company-role{color:#94a3b8;font-size:0.8rem}\
.c-intern-meta{display:flex;gap:12px;flex-wrap:wrap;font-size:0.8rem;margin-bottom:12px}\
.c-intern-pay{color:#34d399}\
.c-intern-dur{color:#94a3b8}\
.c-intern-skills{display:flex;flex-wrap:wrap;margin-bottom:12px}\
.c-exam-hdr{display:flex;align-items:center;gap:12px;margin-bottom:14px}\
.c-exam-ttl{margin:0 0 2px;color:#e2e8f0;font-size:1rem;font-weight:700}\
.c-exam-form{color:#94a3b8;font-size:0.75rem}\
.c-exam-desc{color:#94a3b8;font-size:0.8rem;line-height:1.5;margin:0 0 12px}\
.c-exam-subs{margin-bottom:10px}\
.c-exam-subs-lbl{color:#64748b;font-size:0.75rem;margin-bottom:4px}\
.c-exam-tag{background:rgba(251,191,36,0.1);color:#fbbf24;display:inline-block;padding:2px 8px;border-radius:20px;margin:2px;font-size:0.7rem}\
.c-dates-box{background:rgba(255,255,255,0.03);border-radius:10px;padding:12px;margin-bottom:12px}\
.c-dates-lbl{color:#64748b;font-size:0.75rem;margin-bottom:6px}\
.c-date-row{display:flex;justify-content:space-between;padding:4px 0;font-size:0.8rem}\
.c-date-key{color:#94a3b8;text-transform:capitalize}\
.c-date-val{color:#e2e8f0}\
.c-exam-info-flex{display:flex;gap:8px}\
.c-exam-info-box{flex:1;padding:6px 12px;border-radius:10px;background:rgba(99,102,241,0.1);border:1px solid rgba(99,102,241,0.2);text-align:center}\
.c-exam-info-box-green{background:rgba(52,211,153,0.1);border:1px solid rgba(52,211,153,0.2)}\
.c-exam-info-lbl{color:#94a3b8;font-size:0.7rem}\
.c-exam-info-val{color:#e2e8f0;font-size:0.75rem}\
.c-skill-ttl{margin:0 0 2px;color:#e2e8f0;font-size:1rem;font-weight:600}\
.c-skill-cat{font-size:0.7rem;padding:2px 10px}\
.c-skill-desc{color:#94a3b8;font-size:0.82rem;line-height:1.5;margin:0 0 14px}\
.c-skill-progress-lbl{display:flex;justify-content:space-between;font-size:0.75rem;margin-bottom:6px}\
.c-skill-dur{color:#64748b}\
.c-skill-pct{color:#34d399}\
.c-skill-bar{width:100%;height:6px;border-radius:3px;background:rgba(255,255,255,0.08);overflow:hidden;margin-bottom:14px}\
.c-skill-bar-fill{height:100%;border-radius:3px;background:linear-gradient(90deg,#34d399,#10b981)}\
.c-rm-step{display:flex;gap:16px;position:relative;padding-bottom:24px}\
.c-rm-step-icon-col{display:flex;flex-direction:column;align-items:center}\
.c-rm-circle{width:48px;height:48px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:1.2rem;flex-shrink:0;z-index:1}\
.c-rm-circle-cur{background:linear-gradient(135deg,#818cf8,#a855f7);border:2px solid rgba(129,140,248,0.5);box-shadow:0 0 20px rgba(99,102,241,0.3)}\
.c-rm-circle-def{background:rgba(255,255,255,0.08);border:2px solid rgba(255,255,255,0.1)}\
.c-rm-conn{width:2px;flex:1;margin:4px 0}\
.c-rm-conn-cur{background:linear-gradient(180deg,rgba(129,140,248,0.4),rgba(255,255,255,0.04))}\
.c-rm-conn-def{background:linear-gradient(180deg,rgba(255,255,255,0.08),rgba(255,255,255,0.04))}\
.c-rm-body{flex:1;padding-bottom:8px}\
.c-rm-hdr{display:flex;align-items:center;gap:10px;margin-bottom:6px}\
.c-rm-year{padding:2px 10px;border-radius:8px;font-size:0.75rem;font-weight:600}\
.c-rm-year-cur{background:rgba(129,140,248,0.2);color:#818cf8}\
.c-rm-year-def{background:rgba(255,255,255,0.06);color:#64748b}\
.c-rm-lbl{margin:0;color:#e2e8f0;font-size:0.95rem;font-weight:600}\
.c-rm-cur-badge{padding:2px 8px;border-radius:6px;background:rgba(52,211,153,0.15);color:#34d399;font-size:0.7rem}\
.c-rm-desc{margin:0;color:#94a3b8;font-size:0.82rem;line-height:1.4}\
.c-rm-box{background:rgba(30,27,75,0.4);border-radius:20px;border:1px solid rgba(255,255,255,0.06);padding:28px}\
.c-inner{max-width:1200px;margin:0 auto;padding:80px 16px;text-align:center}\
.c-inner-icon{font-size:5rem;margin-bottom:24px}\
.c-inner-ttl{color:#e2e8f0;font-size:1.8rem;font-weight:700;margin-bottom:12px}\
.c-inner-sub{color:#94a3b8;font-size:1.1rem;max-width:520px;margin:0 auto;line-height:1.6}\
.c-empty-msg{grid-column:1/-1;text-align:center;padding:60px 20px;color:#64748b}\
.c-empty-ico{font-size:3rem;margin-bottom:16px}\
.c-empty-ttl{font-size:1.1rem;font-weight:600;color:#94a3b8;margin-bottom:8px}\
.c-match-row{display:flex;align-items:center;gap:16px;background:rgba(255,255,255,0.04);border-radius:14px;padding:16px 20px;border:1px solid rgba(255,255,255,0.06);cursor:pointer}\
.c-match-row:hover{background:rgba(255,255,255,0.08)}\
.c-match-icon{width:44px;height:44px;border-radius:12px;background:linear-gradient(135deg,rgba(99,102,241,0.3),rgba(168,85,247,0.3));display:flex;align-items:center;justify-content:center;font-size:1.4rem;flex-shrink:0}\
.c-match-name{color:#e2e8f0;font-weight:600;font-size:0.95rem}\
.c-match-salary{color:#818cf8;font-size:0.85rem;font-weight:600}\
.c-match-bars{display:flex;gap:6px;margin-top:6px}\
.c-bar-seg{flex:1;height:8px;border-radius:4px}\
.c-bar-fill{background:linear-gradient(90deg,#818cf8,#a855f7)}\
.c-bar-empty{background:rgba(255,255,255,0.1)}\
.c-result-ttl{color:#e2e8f0;font-size:1.1rem;font-weight:700;margin-bottom:16px}\
.c-result-grid{display:grid;gap:14px}\
.c-assessment-q{background:rgba(255,255,255,0.03);border-radius:16px;padding:20px;border:1px solid rgba(255,255,255,0.06);margin-bottom:16px}\
.c-assessment-q-ttl{color:#e2e8f0;font-size:0.95rem;font-weight:600;margin-bottom:14px}\
.c-opt-wrap{display:flex;flex-wrap:wrap;gap:10px}\
.c-radio-inp{accent-color:#818cf8;width:16px;height:16px}\
.c-opt-lbl-txt{color:#cbd5e1;font-size:0.9rem}\
.c-assessment-rs{background:linear-gradient(135deg,rgba(99,102,241,0.1),rgba(168,85,247,0.1));border-radius:16px;padding:24px;border:1px solid rgba(99,102,241,0.2);margin-bottom:20px}\
.c-quiz-btn{padding:12px 32px;border-radius:14px;background:linear-gradient(135deg,#818cf8,#a855f7);border:none;color:#fff;font-size:1rem;font-weight:600;cursor:pointer}\
.c-quiz-btn:hover{opacity:0.9;transform:translateY(-1px)}\
.c-questions-wrap{margin-bottom:20px}\
.c-text-dim{color:#64748b;font-size:0.9rem}\
.c-hidden{display:none!important}\
.c-page-inner{max-width:1200px;margin:0 auto;padding:0 16px}\
.c-mb-12{margin-bottom:12px}\
.c-mb-14{margin-bottom:14px}\
.c-mb-24{margin-bottom:24px}';
})();
