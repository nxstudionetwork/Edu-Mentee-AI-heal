window.renderPage = window.renderPage || {};

(function() {
  var store = window.Store;
  var utils = window.Utils;

  if (!window._fcDelegateAdded) {
    window._fcDelegateAdded = true;
    document.addEventListener('click', function(e) {
      var t = e.target.closest('[data-action^="fc:"]');
      if (!t) return;
      var p = t.getAttribute('data-action').split(':');
      var c = p[1], arg = p.slice(2).join(':');
      if (c === 'openDeck' && arg) { openDeck(arg); }
      else if (c === 'back') { renderDeckView(); }
      else if (c === 'flip') { flipCard(); }
      else if (c === 'prev') { navigateCard(-1); }
      else if (c === 'next') { navigateCard(1); }
      else if (c === 'shuffle') { shuffleCurrentDeck(); }
      else if (c === 'known') { markCard(true); }
      else if (c === 'unknown') { markCard(false); }
      else if (c === 'filterSubject' && arg) { currentFilter = arg; renderDeckView(); }
    });
  }

  var SUBJECTS = [
    { id: 'math', name: 'Mathematics', icon: '\uD83D\uDD22' },
    { id: 'physics', name: 'Physics', icon: '\uD83C\uDF0A' },
    { id: 'chemistry', name: 'Chemistry', icon: '\u2697\uFE0F' },
    { id: 'biology', name: 'Biology', icon: '\uD83E\uDDEC' },
    { id: 'english', name: 'English', icon: '\uD83D\uDCD6' },
    { id: 'history', name: 'History', icon: '\uD83C\uDFDB\uFE0F' },
    { id: 'geography', name: 'Geography', icon: '\uD83C\uDF0D' },
    { id: 'cs', name: 'Computer Science', icon: '\uD83D\uDCBB' },
    { id: 'economics', name: 'Economics', icon: '\uD83D\uDCB0' },
    { id: 'civics', name: 'Civics', icon: '\uD83C\uDFDB\uFE0F' }
  ];

  var MOCK_CARDS = {
    math: [
      { q: 'What is the derivative of x\u00B2?', a: '2x. The power rule states that the derivative of x\u207F is n\u00B7x\u207F\u207B\u00B9.' },
      { q: 'What is the Pythagorean theorem?', a: 'In a right triangle, a\u00B2 + b\u00B2 = c\u00B2, where c is the hypotenuse.' },
      { q: 'What is the quadratic formula?', a: 'x = (-b \u00B1 \u221A(b\u00B2 - 4ac)) / 2a' },
      { q: 'What is the value of \u03C0 (pi) to 2 decimal places?', a: '3.14. It is the ratio of a circle\'s circumference to its diameter.' },
      { q: 'What is an integral?', a: 'An integral represents the area under a curve. The indefinite integral is the antiderivative of a function.' },
      { q: 'What are prime numbers?', a: 'Numbers greater than 1 that have no positive divisors other than 1 and themselves. Examples: 2, 3, 5, 7, 11.' },
      { q: 'What is the formula for the area of a circle?', a: 'A = \u03C0r\u00B2, where r is the radius.' },
      { q: 'What is a matrix?', a: 'A rectangular array of numbers arranged in rows and columns, used in linear algebra.' },
      { q: 'What is the sum of angles in a triangle?', a: '180 degrees (or \u03C0 radians).' },
      { q: 'What is a logarithm?', a: 'The inverse of exponentiation. log\u2099(x) = y means n\u1D65 = x.' },
      { q: 'What is the discriminant of a quadratic?', a: 'D = b\u00B2 - 4ac. It determines the nature of the roots.' }
    ],
    physics: [
      { q: 'What is Newton\'s Second Law?', a: 'F = ma. The net force on an object equals its mass times its acceleration.' },
      { q: 'What is the speed of light?', a: 'Approximately 3 \u00D7 10\u2078 m/s (299,792,458 m/s) in vacuum.' },
      { q: 'What is kinetic energy?', a: 'KE = \u00BDmv\u00B2, where m is mass and v is velocity.' },
      { q: 'What is Ohm\'s Law?', a: 'V = IR. Voltage equals current times resistance.' },
      { q: 'What is the unit of force?', a: 'The Newton (N). 1 N = 1 kg\u00B7m/s\u00B2.' },
      { q: 'What is gravitational potential energy?', a: 'GPE = mgh, where m is mass, g is gravitational acceleration, and h is height.' },
      { q: 'What is the law of conservation of energy?', a: 'Energy cannot be created or destroyed, only transformed from one form to another.' },
      { q: 'What is electromagnetic induction?', a: 'The production of voltage across a conductor moving through a magnetic field, described by Faraday\'s law.' },
      { q: 'What is momentum?', a: 'p = mv. It is a vector quantity representing mass in motion.' },
      { q: 'What is the frequency unit?', a: 'Hertz (Hz). It measures the number of cycles per second.' }
    ],
    chemistry: [
      { q: 'What is the pH scale?', a: 'A scale from 0-14 measuring acidity. pH 7 is neutral, below 7 is acidic, above 7 is basic.' },
      { q: 'What is Avogadro\'s number?', a: '6.022 \u00D7 10\u00B2\u00B3. The number of particles in one mole of a substance.' },
      { q: 'What is the periodic table?', a: 'A tabular arrangement of chemical elements organized by atomic number, electron configuration, and recurring properties.' },
      { q: 'What is an ionic bond?', a: 'A chemical bond formed by the electrostatic attraction between oppositely charged ions.' },
      { q: 'What is oxidation?', a: 'The loss of electrons in a chemical reaction. Often involves gaining oxygen or losing hydrogen.' },
      { q: 'What is the ideal gas law?', a: 'PV = nRT, relating pressure, volume, moles, gas constant, and temperature.' },
      { q: 'What is a catalyst?', a: 'A substance that increases the rate of a chemical reaction without being consumed itself.' },
      { q: 'What is the atomic number?', a: 'The number of protons in the nucleus of an atom, defining the element.' },
      { q: 'What is a covalent bond?', a: 'A bond formed by sharing electron pairs between atoms.' },
      { q: 'What is the molar mass of water (H\u2082O)?', a: '18 g/mol. Two hydrogen atoms (1 \u00D7 2) plus one oxygen atom (16).' },
      { q: 'What is electrolysis?', a: 'The use of electric current to drive a non-spontaneous chemical reaction.' }
    ],
    biology: [
      { q: 'What is DNA?', a: 'Deoxyribonucleic acid. The molecule that carries genetic instructions for development and function of living things.' },
      { q: 'What is photosynthesis?', a: '6CO\u2082 + 6H\u2082O \u2192 C\u2086H\u2081\u2082O\u2086 + 6O\u2082. Plants convert light energy into chemical energy (glucose).' },
      { q: 'What is mitosis?', a: 'Cell division producing two identical daughter cells from one parent cell. Used for growth and repair.' },
      { q: 'What are mitochondria?', a: 'The powerhouse of the cell. They generate ATP through cellular respiration.' },
      { q: 'What is natural selection?', a: 'Darwin\'s mechanism of evolution where organisms with favorable traits survive and reproduce more.' },
      { q: 'What is the function of red blood cells?', a: 'To transport oxygen from the lungs to body tissues and carry carbon dioxide back.' },
      { q: 'What is DNA replication?', a: 'The process by which DNA makes a copy of itself before cell division, using DNA polymerase.' },
      { q: 'What is an enzyme?', a: 'A biological catalyst, typically a protein, that speeds up chemical reactions in living organisms.' },
      { q: 'What is the largest organ?', a: 'The skin. It protects against pathogens, regulates temperature, and provides sensation.' },
      { q: 'What is osmosis?', a: 'The movement of water molecules through a semi-permeable membrane from low to high solute concentration.' }
    ],
    english: [
      { q: 'What is a metaphor?', a: 'A figure of speech that directly compares two unlike things without using "like" or "as".' },
      { q: 'What is alliteration?', a: 'The repetition of initial consonant sounds in closely connected words (e.g., "Peter Piper picked").' },
      { q: 'What is an oxymoron?', a: 'A figure of speech combining contradictory terms (e.g., "deafening silence").' },
      { q: 'What is a simile?', a: 'A comparison using "like" or "as" (e.g., "brave as a lion").' },
      { q: 'What is a thesis statement?', a: 'A sentence that presents the main argument or claim of an essay, usually in the introduction.' },
      { q: 'What is personification?', a: 'Attributing human qualities to non-human things (e.g., "the wind whispered").' },
      { q: 'What is a narrative arc?', a: 'The structure of a story: exposition, rising action, climax, falling action, and resolution.' },
      { q: 'What is irony?', a: 'When the outcome is different from what is expected. Verbal, situational, or dramatic.' },
      { q: 'What is a protagonist?', a: 'The main character in a story, often the hero or central figure.' },
      { q: 'What is hyperbole?', a: 'Exaggerated statements not meant to be taken literally (e.g., "I\'m so hungry I could eat a horse").' }
    ],
    history: [
      { q: 'When did World War II end?', a: '1945. V-E Day was May 8, V-J Day was August 15 (formal surrender September 2).' },
      { q: 'Who was the first President of India?', a: 'Dr. Rajendra Prasad, serving from 1950 to 1962.' },
      { q: 'What was the French Revolution?', a: 'A period of radical political and social change in France (1789-1799) that overthrew the monarchy.' },
      { q: 'What was the Industrial Revolution?', a: 'The transition to new manufacturing processes in Europe and America, roughly 1760-1840.' },
      { q: 'When was Indian independence?', a: 'August 15, 1947. India gained independence from British colonial rule.' },
      { q: 'What was the Renaissance?', a: 'A cultural movement spanning the 14th-17th centuries, marked by a revival of art, literature, and learning.' },
      { q: 'Who was Mahatma Gandhi?', a: 'Leader of India\'s independence movement using nonviolent civil disobedience (1869-1948).' },
      { q: 'What was the Cold War?', a: 'Geopolitical tension between the US and USSR from ~1947 to 1991, without direct military conflict.' },
      { q: 'What was the Silk Road?', a: 'Ancient trade routes connecting East and West, facilitating the exchange of goods, ideas, and culture.' },
      { q: 'When was the Mughal Empire founded?', a: '1526, when Babur defeated Ibrahim Lodi at the First Battle of Panipat.' }
    ],
    geography: [
      { q: 'What is the largest continent?', a: 'Asia, covering approximately 44.58 million sq km.' },
      { q: 'What are the layers of the atmosphere?', a: 'Troposphere, stratosphere, mesosphere, thermosphere, and exosphere (from ground up).' },
      { q: 'What is the longest river?', a: 'The Nile River at approximately 6,650 km (though some measurements suggest the Amazon is longer).' },
      { q: 'What causes earthquakes?', a: 'The sudden release of energy in the Earth\'s lithosphere that creates seismic waves, usually at tectonic plate boundaries.' },
      { q: 'What is the Ring of Fire?', a: 'A horseshoe-shaped zone of frequent earthquakes and volcanic eruptions around the Pacific Ocean.' },
      { q: 'What is the water cycle?', a: 'The continuous movement of water: evaporation, condensation, precipitation, collection, and flow.' },
      { q: 'What is the smallest country?', a: 'Vatican City, at approximately 0.44 sq km.' },
      { q: 'What are tectonic plates?', a: 'Large segments of the Earth\'s lithosphere that move and interact at their boundaries.' },
      { q: 'What is the greenhouse effect?', a: 'The trapping of heat by greenhouse gases in the atmosphere, warming the Earth\'s surface.' },
      { q: 'What is a monsoon?', a: 'A seasonal wind pattern causing wet and dry seasons, especially prominent in South Asia.' }
    ],
    cs: [
      { q: 'What is a variable?', a: 'A named storage location in memory that holds a value which can change during program execution.' },
      { q: 'What is an algorithm?', a: 'A step-by-step procedure or set of rules for solving a problem or accomplishing a task.' },
      { q: 'What is a loop?', a: 'A control structure that repeats a block of code. Types: for, while, do-while.' },
      { q: 'What is a function?', a: 'A reusable block of code that performs a specific task, accepting inputs and returning outputs.' },
      { q: 'What is an array?', a: 'A data structure that stores a collection of elements in contiguous memory locations.' },
      { q: 'What is the difference between HTTP and HTTPS?', a: 'HTTPS is secure HTTP. It uses TLS/SSL encryption to protect data in transit.' },
      { q: 'What is OOP?', a: 'Object-Oriented Programming: a paradigm based on objects containing data and methods. Key principles: encapsulation, inheritance, polymorphism, abstraction.' },
      { q: 'What is a compiler?', a: 'A program that translates source code into machine code before execution, all at once.' },
      { q: 'What is recursion?', a: 'A technique where a function calls itself to solve smaller instances of the same problem.' },
      { q: 'What is a database?', a: 'An organized collection of structured data stored electronically, managed by a DBMS.' },
      { q: 'What is SQL?', a: 'Structured Query Language, used to manage and query relational databases.' }
    ],
    economics: [
      { q: 'What is demand and supply?', a: 'Demand: quantity consumers want. Supply: quantity producers offer. Price equilibrium is where they meet.' },
      { q: 'What is GDP?', a: 'Gross Domestic Product. The total monetary value of all finished goods and services produced within a country.' },
      { q: 'What is inflation?', a: 'A general increase in prices and fall in the purchasing value of money over time.' },
      { q: 'What is a recession?', a: 'A significant decline in economic activity lasting more than a few months, typically marked by falling GDP.' },
      { q: 'What is fiscal policy?', a: 'Government use of taxation and spending to influence the economy.' },
      { q: 'What is monetary policy?', a: 'Central bank actions to manage money supply and interest rates to control inflation and growth.' },
      { q: 'What is opportunity cost?', a: 'The value of the next best alternative that is given up when making a choice.' },
      { q: 'What is a budget deficit?', a: 'When government spending exceeds revenue in a given period.' },
      { q: 'What is a monopoly?', a: 'A market structure where a single seller dominates the market with no close substitutes.' },
      { q: 'What is the law of diminishing returns?', a: 'As more units of a variable input are added to fixed inputs, the marginal product eventually declines.' }
    ],
    civics: [
      { q: 'What is a democracy?', a: 'A system of government where citizens exercise power by voting, either directly or through elected representatives.' },
      { q: 'What is the Indian Parliament?', a: 'A bicameral legislature consisting of the Lok Sabha (lower house) and Rajya Sabha (upper house).' },
      { q: 'What are fundamental rights?', a: 'Basic rights guaranteed by the Constitution: equality, freedom, against exploitation, religion, culture, education, and constitutional remedies.' },
      { q: 'What is the Indian Constitution?', a: 'The supreme law of India, adopted on January 26, 1950. It is the longest written constitution of any country.' },
      { q: 'What is the executive branch?', a: 'The branch that implements laws, headed by the President, with the PM and Council of Ministers.' },
      { q: 'What is secularism?', a: 'The principle of separation of religion from state affairs. All religions are treated equally.' },
      { q: 'What is the Right to Information Act?', a: 'A 2005 law giving citizens the right to access information from public authorities to promote transparency.' },
      { q: 'What is the judiciary\'s role?', a: 'To interpret laws, administer justice, protect fundamental rights, and act as guardian of the Constitution.' },
      { q: 'What is Panchayati Raj?', a: 'The system of local self-government in rural India, with elected councils at village, block, and district levels.' },
      { q: 'What is the voting age in India?', a: '18 years, as amended by the 61st Constitutional Amendment Act of 1989.' }
    ]
  };

  var currentFilter = 'all';
  var currentDeckSubject = null;
  var currentCards = [];
  var currentCardIndex = 0;
  var isFlipped = false;

  function getState() {
    return store.get('flashcardState') || { known: {}, unknown: {}, reviewedToday: 0, lastReviewDate: '', totalKnown: 0, totalUnknown: 0, streak: 0, lastStreakDate: '' };
  }

  function saveState(s) {
    store.set('flashcardState', s);
  }

  function ensureToday(s) {
    var today = new Date().toDateString();
    if (s.lastReviewDate !== today) {
      if (s.lastReviewDate && s.reviewedToday > 0) {
        if (s.lastStreakDate !== today) {
          var prev = new Date(s.lastReviewDate);
          var now = new Date(today);
          var diff = Math.floor((now - prev) / 86400000);
          if (diff === 1) { s.streak++; }
          else if (diff > 1) { s.streak = 0; }
        }
      }
      s.reviewedToday = 0;
      s.lastReviewDate = today;
      saveState(s);
    }
    return s;
  }

  function getAccuracy() {
    var s = getState();
    var total = s.totalKnown + s.totalUnknown;
    if (total === 0) return 0;
    return Math.round((s.totalKnown / total) * 100);
  }

  function getDeckProgress(subjectId) {
    var s = getState();
    var cards = MOCK_CARDS[subjectId] || [];
    var known = 0;
    for (var i = 0; i < cards.length; i++) {
      if (s.known[subjectId + '_' + i]) known++;
    }
    return { known: known, total: cards.length };
  }

  function shuffleArray(arr) {
    var result = arr.slice();
    for (var i = result.length - 1; i > 0; i--) {
      var j = Math.floor(Math.random() * (i + 1));
      var temp = result[i];
      result[i] = result[j];
      result[j] = temp;
    }
    return result;
  }

  function renderDeckView() {
    var mc = document.getElementById('main-content');
    if (!mc) return;
    var s = ensureToday(getState());
    var acc = getAccuracy();
    var filteredSubjects = currentFilter === 'all' ? SUBJECTS : SUBJECTS.filter(function(sub) { return sub.id === currentFilter; });

    var html = '<div style="padding:var(--space-5);max-width:1200px;margin:0 auto;">';
    html += '<div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:var(--space-5);flex-wrap:wrap;gap:var(--space-3)">';
    html += '<div><h2 style="font-size:var(--text-xl);font-weight:700;color:var(--text-primary);margin:0">&#x1F4D6; Flashcards</h2>';
    html += '<p style="font-size:var(--text-sm);color:var(--text-tertiary);margin:var(--space-1) 0 0 0">Master concepts one card at a time</p></div>';
    html += '<select class="input-field" style="width:auto;min-width:160px" data-action="fc:filterSubject">';
    html += '<option value="all"' + (currentFilter === 'all' ? ' selected' : '') + '>All Subjects</option>';
    for (var fi = 0; fi < SUBJECTS.length; fi++) {
      html += '<option value="' + SUBJECTS[fi].id + '"' + (currentFilter === SUBJECTS[fi].id ? ' selected' : '') + '>' + SUBJECTS[fi].icon + ' ' + SUBJECTS[fi].name + '</option>';
    }
    html += '</select></div>';

    html += '<div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(180px,1fr));gap:var(--space-3);margin-bottom:var(--space-5)">';
    var statCards = [
      { label: 'Reviewed Today', value: s.reviewedToday, color: 'var(--accent-blue)' },
      { label: 'Accuracy', value: acc + '%', color: acc >= 70 ? 'var(--accent-green)' : 'var(--accent-yellow)' },
      { label: 'Streak', value: s.streak + ' days', color: 'var(--accent-orange)' },
      { label: 'Total Known', value: s.totalKnown, color: 'var(--accent-green)' }
    ];
    for (var si = 0; si < statCards.length; si++) {
      var sc = statCards[si];
      html += '<div class="glass-card" style="padding:var(--space-4);text-align:center">';
      html += '<div style="font-size:var(--text-2xl);font-weight:700;color:' + sc.color + '">' + sc.value + '</div>';
      html += '<div style="font-size:var(--text-xs);color:var(--text-tertiary);margin-top:var(--space-1)">' + sc.label + '</div>';
      html += '</div>';
    }
    html += '</div>';

    html += '<div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(260px,1fr));gap:var(--space-4)">';
    for (var di = 0; di < filteredSubjects.length; di++) {
      var sub = filteredSubjects[di];
      var prog = getDeckProgress(sub.id);
      var pct = prog.total > 0 ? Math.round((prog.known / prog.total) * 100) : 0;
      html += '<div class="glass-card" style="padding:var(--space-5);cursor:pointer" data-action="fc:openDeck:' + sub.id + '">';
      html += '<div style="display:flex;align-items:center;gap:var(--space-3);margin-bottom:var(--space-3)">';
      html += '<div style="width:48px;height:48px;border-radius:var(--radius-md);display:flex;align-items:center;justify-content:center;font-size:24px;background:rgba(59,130,246,0.1)">' + sub.icon + '</div>';
      html += '<div><div style="font-weight:600;color:var(--text-primary)">' + sub.name + '</div>';
      html += '<div style="font-size:var(--text-xs);color:var(--text-tertiary)">' + prog.total + ' cards</div></div>';
      html += '</div>';
      html += '<div style="margin-bottom:var(--space-2)"><div style="display:flex;justify-content:space-between;font-size:var(--text-xs);color:var(--text-tertiary);margin-bottom:var(--space-1)">';
      html += '<span>Progress</span><span>' + prog.known + '/' + prog.total + ' (' + pct + '%)</span></div>';
      html += '<div class="progress-bar"><div class="progress-bar-fill" style="width:' + pct + '%;background:' + (pct >= 70 ? 'var(--accent-green)' : 'var(--accent-blue)') + '"></div></div></div>';
      html += '<div style="display:flex;gap:var(--space-1);flex-wrap:wrap">';
      for (var ci = 0; ci < Math.min(prog.total, 10); ci++) {
        var known = store.get('flashcardState') && store.get('flashcardState').known && store.get('flashcardState').known[sub.id + '_' + ci];
        html += '<div style="width:18px;height:18px;border-radius:3px;background:' + (known ? 'var(--accent-green)' : 'var(--bg-glass-strong)') + '"></div>';
      }
      html += '</div></div>';
    }
    html += '</div></div>';

    mc.innerHTML = html;
  }

  function openDeck(subjectId) {
    currentDeckSubject = subjectId;
    var cards = MOCK_CARDS[subjectId] || [];
    currentCards = shuffleArray(cards);
    currentCardIndex = 0;
    isFlipped = false;
    renderFlashcardView();
  }

  function renderFlashcardView() {
    var mc = document.getElementById('main-content');
    if (!mc) return;
    var subject = SUBJECTS.filter(function(s) { return s.id === currentDeckSubject; })[0];
    var card = currentCards[currentCardIndex];
    var total = currentCards.length;
    var prog = getDeckProgress(currentDeckSubject);

    var html = '<div style="padding:var(--space-5);max-width:700px;margin:0 auto;">';
    html += '<div style="display:flex;align-items:center;gap:var(--space-3);margin-bottom:var(--space-4)">';
    html += '<button class="btn btn-ghost btn-sm" data-action="fc:back">&#8592; Back</button>';
    html += '<span style="font-weight:600;color:var(--text-primary)">' + (subject ? subject.icon + ' ' + subject.name : '') + '</span>';
    html += '<span style="font-size:var(--text-xs);color:var(--text-tertiary);margin-left:auto">Card ' + (currentCardIndex + 1) + ' of ' + total + '</span>';
    html += '</div>';

    html += '<div class="progress-bar" style="margin-bottom:var(--space-4)"><div class="progress-bar-fill" style="width:' + Math.round(((currentCardIndex + 1) / total) * 100) + '%;background:var(--accent-blue)"></div></div>';

    html += '<div style="perspective:1000px;margin-bottom:var(--space-4);cursor:pointer" data-action="fc:flip">';
    html += '<div style="min-height:280px;border-radius:var(--radius-lg);padding:var(--space-6);display:flex;flex-direction:column;align-items:center;justify-content:center;text-align:center;transition:transform 0.5s;transform-style:preserve-3d;position:relative;border:1px solid var(--border-color);background:' + (isFlipped ? 'rgba(16,185,129,0.08)' : 'rgba(59,130,246,0.08)') + '">';
    if (!isFlipped) {
      html += '<div style="font-size:var(--text-xs);color:var(--accent-blue);margin-bottom:var(--space-3);font-weight:600;text-transform:uppercase;letter-spacing:1px">Question</div>';
      html += '<div style="font-size:var(--text-lg);font-weight:600;color:var(--text-primary);line-height:1.5">' + utils.sanitizeHTML(card.q) + '</div>';
      html += '<div style="margin-top:var(--space-4);font-size:var(--text-xs);color:var(--text-tertiary)">Tap to reveal answer</div>';
    } else {
      html += '<div style="font-size:var(--text-xs);color:var(--accent-green);margin-bottom:var(--space-3);font-weight:600;text-transform:uppercase;letter-spacing:1px">Answer</div>';
      html += '<div style="font-size:var(--text-base);color:var(--text-primary);line-height:1.6;max-width:500px">' + utils.sanitizeHTML(card.a) + '</div>';
      html += '<div style="margin-top:var(--space-4);font-size:var(--text-xs);color:var(--text-tertiary)">Tap to see question</div>';
    }
    html += '</div></div>';

    html += '<div style="display:flex;align-items:center;justify-content:center;gap:var(--space-3);margin-bottom:var(--space-4)">';
    html += '<button class="btn btn-secondary btn-sm" data-action="fc:prev"' + (currentCardIndex === 0 ? ' disabled' : '') + '>&#8592; Prev</button>';
    html += '<button class="btn btn-secondary btn-sm" data-action="fc:shuffle">&#x1F500; Shuffle</button>';
    html += '<button class="btn btn-secondary btn-sm" data-action="fc:next"' + (currentCardIndex === total - 1 ? ' disabled' : '') + '>Next &#8594;</button>';
    html += '</div>';

    html += '<div style="display:flex;justify-content:center;gap:var(--space-3);margin-bottom:var(--space-5)">';
    html += '<button class="btn btn-green btn-sm" data-action="fc:known">&#10003; Mark Known</button>';
    html += '<button class="btn btn-danger btn-sm" data-action="fc:unknown">&#10007; Mark Unknown</button>';
    html += '</div>';

    html += '<div class="glass-card" style="padding:var(--space-4)">';
    html += '<div style="display:flex;justify-content:space-between;align-items:center">';
    html += '<div style="font-size:var(--text-sm);color:var(--text-secondary)">Deck Progress</div>';
    html += '<div style="font-size:var(--text-xs);color:var(--text-tertiary)">' + prog.known + ' / ' + prog.total + ' known (' + (prog.total > 0 ? Math.round((prog.known / prog.total) * 100) : 0) + '%)</div>';
    html += '</div>';
    html += '<div class="progress-bar" style="margin-top:var(--space-2)"><div class="progress-bar-fill" style="width:' + (prog.total > 0 ? Math.round((prog.known / prog.total) * 100) : 0) + '%;background:var(--accent-green)"></div></div>';
    html += '</div>';

    html += '</div>';
    mc.innerHTML = html;
  }

  function flipCard() {
    isFlipped = !isFlipped;
    renderFlashcardView();
  }

  function navigateCard(dir) {
    var newIndex = currentCardIndex + dir;
    if (newIndex < 0 || newIndex >= currentCards.length) return;
    currentCardIndex = newIndex;
    isFlipped = false;
    renderFlashcardView();
  }

  function shuffleCurrentDeck() {
    currentCards = shuffleArray(currentCards);
    currentCardIndex = 0;
    isFlipped = false;
    renderFlashcardView();
    window.showToast && window.showToast('Deck shuffled!', 'info');
  }

  function markCard(known) {
    var s = getState();
    var key = currentDeckSubject + '_' + currentCardIndex;
    if (known) {
      if (!s.known) s.known = {};
      s.known[key] = true;
      delete (s.unknown || {})[key];
      s.totalKnown = (s.totalKnown || 0) + 1;
    } else {
      if (!s.unknown) s.unknown = {};
      s.unknown[key] = true;
      delete (s.known || {})[key];
      s.totalUnknown = (s.totalUnknown || 0) + 1;
    }
    s.reviewedToday = (s.reviewedToday || 0) + 1;
    s.lastReviewDate = new Date().toDateString();
    saveState(s);
    if (currentCardIndex < currentCards.length - 1) {
      currentCardIndex++;
      isFlipped = false;
      renderFlashcardView();
    } else {
      window.showToast && window.showToast('Deck complete! Great job!', 'success');
      renderDeckView();
    }
  }

  window.renderPage.flashcards = function() {
    currentFilter = 'all';
    renderDeckView();
  };
})();
