window.renderPage = window.renderPage || {};

(function() {
  var _U = window.Utils;
  var _Store = window.Store;

  var STORAGE_PREFIX = 'vl_';

  var _state = {
    view: 'subjects',
    selectedClass: '',
    selectedSubject: '',
    selectedLab: null,
    currentTab: 'aim',
    currentStep: 0,
    currentVivaIdx: 0,
    vivaAnswers: {},
    timerStart: 0,
    timerElapsed: 0,
    timerInterval: null,
    simRunning: false,
    simPaused: false,
    simSliderValues: {},
    searchQuery: '',
    filterDifficulty: '',
    showFavoritesOnly: false,
    showCompletedOnly: false
  };

  var _experiments = [
    {
      id: 'phy1', subjectId: 'physics', subject: 'Physics', title: 'Ohm\'s Law Verification',
      description: 'Verify Ohm\'s law by measuring voltage and current in a resistive circuit.',
      objective: 'To verify that the current through a conductor is directly proportional to the voltage across it.',
      materials: ['Resistor (10\u03A9)', 'Battery (9V)', 'Ammeter', 'Voltmeter', 'Connecting Wires', 'Rheostat'],
      procedure: ['Connect the circuit as shown in the diagram', 'Set the rheostat to maximum resistance', 'Note the ammeter and voltmeter readings', 'Decrease resistance gradually and record 5 readings', 'Plot V vs I graph on graph paper'],
      observations: ['V vs I graph is a straight line through origin', 'Slope of V-I graph = Resistance', 'Ratio V/I remains constant for all readings'],
      result: 'The graph of V vs I is a straight line passing through the origin, verifying Ohm\'s law. The resistance calculated from the slope is approximately 10\u03A9.',
      vivaQuestions: [
        { q: 'State Ohm\'s law.', opts: ['V = IR', 'F = ma', 'E = mc\u00B2', 'P = IV'], correct: 0 },
        { q: 'What is the SI unit of resistance?', opts: ['Volt', 'Ampere', 'Ohm', 'Watt'], correct: 2 },
        { q: 'What factors affect resistance of a conductor?', opts: ['Length only', 'Temperature only', 'Length, area, material, temperature', 'Voltage applied'], correct: 2 },
        { q: 'Define resistivity.', opts: ['Resistance per unit length', 'Resistance of a unit cube of material', 'Product of resistance and length', 'Ratio of voltage to current'], correct: 1 }
      ],
      difficulty: 'easy', duration: '30 min', icon: '\u26A1', subjectClass: ['10', '11', '12'],
      labCount: 4, simulationType: 'circuit'
    },
    {
      id: 'phy2', subjectId: 'physics', subject: 'Physics', title: 'Refraction Through Glass Slab',
      description: 'Study refraction of light through a rectangular glass slab and verify Snell\'s law.',
      objective: 'To trace the path of a ray of light passing through a glass slab and measure angles of incidence and refraction.',
      materials: ['Glass Slab', 'Drawing Board', 'White Paper', 'Pins (4)', 'Protractor', 'Scale', 'Pencil'],
      procedure: ['Fix white paper on the drawing board', 'Place the glass slab and draw its boundary', 'Draw an incident ray at 30\u00B0 and fix pins', 'View from the other side and fix pins for emergent ray', 'Remove slab, draw refracted ray, measure all angles'],
      observations: ['Angle of incidence equals angle of emergence', 'The emergent ray is laterally displaced', 'sin i / sin r is constant'],
      result: 'The ratio sin i / sin r gives a constant value equal to the refractive index of glass (~1.5). The emergent ray is parallel to the incident ray but laterally displaced.',
      vivaQuestions: [
        { q: 'What is Snell\'s law?', opts: ['n\u2081 sin\u03B8\u2081 = n\u2082 sin\u03B8\u2082', 'F = ma', 'PV = nRT', 'V = IR'], correct: 0 },
        { q: 'When light enters a denser medium, it bends:', opts: ['Away from normal', 'Towards the normal', 'Does not bend', 'Parallel to surface'], correct: 1 },
        { q: 'What is lateral displacement?', opts: ['Distance between incident and emergent ray', 'Angle of refraction', 'Wavelength change', 'Speed of light'], correct: 0 },
        { q: 'Refractive index of vacuum is:', opts: ['0', '0.5', '1', 'Infinity'], correct: 2 }
      ],
      difficulty: 'medium', duration: '45 min', icon: '\uD83D\uDD26', subjectClass: ['10', '11', '12'],
      labCount: 3, simulationType: 'optics'
    },
    {
      id: 'phy3', subjectId: 'physics', subject: 'Physics', title: 'Simple Pendulum',
      description: 'Determine the acceleration due to gravity using a simple pendulum.',
      objective: 'To find the value of g using the formula T = 2\u03C0\u221A(L/g).',
      materials: ['Pendulum bob', 'Thin string (1m)', 'Stopwatch', 'Meter scale', 'Stand with clamp'],
      procedure: ['Tie the bob to the string and suspend from the clamp', 'Measure the length L from point of suspension to center of bob', 'Displace the bob slightly and release', 'Measure time for 20 oscillations', 'Repeat for different lengths (0.5m, 0.7m, 0.9m, 1.0m)'],
      observations: ['Time period increases with length', 'T\u00B2 vs L graph is a straight line', 'Slope of T\u00B2-L graph = 4\u03C0\u00B2/g'],
      result: 'The value of acceleration due to gravity g is found to be approximately 9.8 m/s\u00B2 from the slope of T\u00B2 vs L graph.',
      vivaQuestions: [
        { q: 'What is the time period of a pendulum?', opts: ['Time for one oscillation', 'Time for 10 oscillations', 'Frequency of oscillation', 'Amplitude of swing'], correct: 0 },
        { q: 'Does the time period depend on mass of the bob?', opts: ['Yes, heavier = slower', 'Yes, lighter = slower', 'No, mass does not affect T', 'Depends on shape'], correct: 2 },
        { q: 'Formula for time period is:', opts: ['T = 2\u03C0\u221A(L/g)', 'T = 2\u03C0\u221A(g/L)', 'T = 2\u03C0(L/g)', 'T = 2\u03C0g/L'], correct: 0 },
        { q: 'Why use small angle displacement?', opts: ['Prevents string breaking', 'Simple harmonic motion approximation', 'Reduces air resistance', 'Increases accuracy'], correct: 1 }
      ],
      difficulty: 'easy', duration: '40 min', icon: '\u23F3', subjectClass: ['9', '10'],
      labCount: 3, simulationType: 'pendulum'
    },
    {
      id: 'phy4', subjectId: 'physics', subject: 'Physics', title: 'Lens Formula & Magnification',
      description: 'Determine the focal length of a convex lens using the distance method.',
      objective: 'To find the focal length of a convex lens by plotting a graph between u and v.',
      materials: ['Convex Lens', 'Lens Holder', 'Screen', 'Candle', 'Meter Scale', 'Optical Bench'],
      procedure: ['Place the lens in holder on the optical bench', 'Place candle on one side and screen on the other', 'Adjust positions to get sharp image on screen', 'Measure object distance (u) and image distance (v)', 'Repeat for different object distances'],
      observations: ['When u > 2f: real, inverted, diminished image', 'When u = 2f: real, inverted, same size image', 'When f < u < 2f: real, inverted, magnified image'],
      result: 'The focal length of the convex lens is found to be approximately 15 cm using the lens formula 1/f = 1/v - 1/u.',
      vivaQuestions: [
        { q: 'The lens formula is:', opts: ['1/f = 1/v + 1/u', '1/f = 1/v - 1/u', 'f = u + v', 'f = u \u00D7 v'], correct: 1 },
        { q: 'A convex lens is a:', opts: ['Diverging lens', 'Converging lens', 'Cylindrical lens', 'Flat lens'], correct: 1 },
        { q: 'Power of a lens is measured in:', opts: ['Watts', 'Newtons', 'Diopters', 'Hertz'], correct: 2 },
        { q: 'Virtual image formed by convex lens is:', opts: ['Real and inverted', 'Erect and magnified', 'Diminished', 'At infinity'], correct: 1 }
      ],
      difficulty: 'medium', duration: '40 min', icon: '\uD83D\uDD0D', subjectClass: ['10', '11', '12'],
      labCount: 4, simulationType: 'optics'
    },
    {
      id: 'phy5', subjectId: 'physics', subject: 'Physics', title: 'Archimedes Principle',
      description: 'Verify Archimedes principle using a spring balance and overflow can.',
      objective: 'To verify that the loss in weight of a body immersed in a fluid equals the weight of the fluid displaced.',
      materials: ['Spring balance', 'Overflow can', 'Metal block', 'Small beaker', 'Water', 'Eureka can'],
      procedure: ['Weigh the metal block in air using spring balance', 'Fill the overflow can with water up to the spout', 'Place the small beaker under the spout', 'Slowly lower the block into the water', 'Record the spring balance reading and weight of displaced water'],
      observations: ['Weight of block in air = W\u2081', 'Weight of block in water = W\u2082', 'Loss of weight = W\u2081 - W\u2082', 'Weight of displaced water = W\u2081 - W\u2082'],
      result: 'The loss in weight of the block when immersed in water is equal to the weight of the water displaced, verifying Archimedes principle.',
      vivaQuestions: [
        { q: 'State Archimedes principle.', opts: ['Loss in weight = Weight of displaced fluid', 'Weight = Volume \u00D7 Density', 'F = ma', 'Pressure = Force/Area'], correct: 0 },
        { q: 'A body floats when:', opts: ['Density > water density', 'Density < water density', 'Density = water density', 'Weight > buoyant force'], correct: 1 },
        { q: 'Buoyant force acts:', opts: ['Downwards', 'Sideways', 'Upwards', 'In all directions equally'], correct: 2 },
        { q: 'Relative density is:', opts: ['Weight in air / Weight in water', 'Density of substance / Density of water', 'Mass / Volume', 'Both A and B'], correct: 3 }
      ],
      difficulty: 'easy', duration: '30 min', icon: '\u2693', subjectClass: ['9', '10'],
      labCount: 3, simulationType: 'buoyancy'
    },

    {
      id: 'chem1', subjectId: 'chemistry', subject: 'Chemistry', title: 'Acid-Base Titration',
      description: 'Determine the concentration of an unknown acid by titrating with a standard base.',
      objective: 'To find the molarity of a given HCl solution using standard NaOH solution.',
      materials: ['Burette', 'Pipette', 'Conical Flask', 'HCl Solution', 'NaOH Solution', 'Phenolphthalein', 'White Tile'],
      procedure: ['Rinse the burette with NaOH solution and fill it', 'Pipette 20 ml of HCl into the conical flask', 'Add 2-3 drops of phenolphthalein indicator', 'Titrate by adding NaOH dropwise until permanent pink color', 'Record the burette reading; repeat for concordance'],
      observations: ['Solution turns from colorless to pink at endpoint', 'Endpoint = permanent pink color (30 sec)', 'Concordant readings within 0.1 ml'],
      result: 'The molarity of the HCl solution is found to be 0.1 M using the volume of NaOH used in titration.',
      vivaQuestions: [
        { q: 'What is an indicator?', opts: ['A substance that changes color at endpoint', 'A measuring instrument', 'A type of acid', 'A catalyst'], correct: 0 },
        { q: 'Phenolphthalein is colorless in:', opts: ['Acidic solution', 'Basic solution', 'Neutral solution', 'All solutions'], correct: 0 },
        { q: 'Titration is used to find:', opts: ['Melting point', 'Concentration of unknown', 'pH only', 'Boiling point'], correct: 1 },
        { q: 'Concordant readings mean:', opts: ['Different values', 'Values within 0.1 ml of each other', 'Zero reading', 'Maximum reading'], correct: 1 }
      ],
      difficulty: 'medium', duration: '45 min', icon: '\uD83E\uDDEA', subjectClass: ['11', '12'],
      labCount: 3, simulationType: 'titration'
    },
    {
      id: 'chem2', subjectId: 'chemistry', subject: 'Chemistry', title: 'pH Measurement',
      description: 'Measure the pH of various household substances using pH paper and meters.',
      objective: 'To determine the acidic, basic or neutral nature of common substances using pH indicators.',
      materials: ['pH Paper', 'pH Scale Chart', 'Test Tubes', 'Dropper', 'Lemon Juice', 'Soap Solution', 'Vinegar', 'Baking Soda Solution', 'Tap Water'],
      procedure: ['Take small quantities of each substance in separate test tubes', 'Dip a strip of pH paper into each solution', 'Compare the color change with the pH scale chart', 'Record the pH value for each substance', 'Classify as acidic, basic or neutral'],
      observations: ['Lemon juice: pH 2-3 (acidic)', 'Vinegar: pH 3-4 (acidic)', 'Tap water: pH 7 (neutral)', 'Soap solution: pH 8-9 (basic)', 'Baking soda: pH 9-10 (basic)'],
      result: 'Substances with pH < 7 are acidic, pH = 7 are neutral, and pH > 7 are basic. Stronger acids have lower pH values.',
      vivaQuestions: [
        { q: 'pH stands for:', opts: ['Power of Hydrogen', 'Percentage of Hydrogen', 'Potential of Hydroxide', 'Partial Hydrogen'], correct: 0 },
        { q: 'Neutral pH is:', opts: ['0', '5', '7', '14'], correct: 2 },
        { q: 'Stomach acid has pH around:', opts: ['1-2', '5-6', '7', '12-13'], correct: 0 },
        { q: 'Universal indicator shows:', opts: ['Only pH 7', 'Only acidic pH', 'Continuous range of pH values', 'Temperature'], correct: 2 }
      ],
      difficulty: 'easy', duration: '20 min', icon: '\uD83D\uDCC8', subjectClass: ['9', '10', '11'],
      labCount: 3, simulationType: 'ph'
    },
    {
      id: 'chem3', subjectId: 'chemistry', subject: 'Chemistry', title: 'Electrolysis of Water',
      description: 'Electrolyze water to produce hydrogen and oxygen and verify their volume ratio.',
      objective: 'To demonstrate the decomposition of water into hydrogen and oxygen by passing electric current.',
      materials: ['Hoffman Voltameter', 'Battery (6V)', 'Dilute H\u2082SO\u2084', 'Test Tubes', 'Matchstick'],
      procedure: ['Fill the Hoffman voltameter with acidulated water', 'Connect the battery to the electrodes', 'Observe bubbles forming at both electrodes', 'Collect gases in the graduated tubes', 'Test the gases using matchstick'],
      observations: ['Cathode: Hydrogen gas (colorless, burns with pop)', 'Anode: Oxygen gas (relabels glowing splint)', 'Volume ratio H\u2082:O\u2082 = 2:1', 'Acid acts as electrolyte to increase conductivity'],
      result: 'Water decomposes into hydrogen and oxygen gases in a 2:1 volume ratio, confirming the molecular formula H\u2082O.',
      vivaQuestions: [
        { q: 'What is electrolysis?', opts: ['Decomposition using electricity', 'Heating a substance', 'Cooling a substance', 'Mixing chemicals'], correct: 0 },
        { q: 'Which gas is produced at the cathode?', opts: ['Oxygen', 'Hydrogen', 'Nitrogen', 'Carbon dioxide'], correct: 1 },
        { q: 'Why add H\u2082SO\u2084 to water?', opts: ['To make it acidic', 'To increase conductivity', 'To cool it down', 'To slow the reaction'], correct: 1 },
        { q: 'Volume ratio H\u2082:O\u2082 is:', opts: ['1:1', '1:2', '2:1', '3:1'], correct: 2 }
      ],
      difficulty: 'medium', duration: '35 min', icon: '\uD83D\uDCA7', subjectClass: ['10', '11', '12'],
      labCount: 4, simulationType: 'electrolysis'
    },
    {
      id: 'chem4', subjectId: 'chemistry', subject: 'Chemistry', title: 'Flame Test for Metal Ions',
      description: 'Identify metal ions by the characteristic color they impart to a flame.',
      objective: 'To detect the presence of alkali and alkaline earth metal ions using a flame test.',
      materials: ['Platinum Wire', 'Bunsen Burner', 'Conc. HCl', 'Unknown Salt Samples', 'Watch Glass'],
      procedure: ['Clean the platinum wire by dipping in HCl and heating', 'Dip the wire into the salt sample', 'Place the wire in the Bunsen burner flame', 'Observe the color of the flame', 'Repeat for each sample'],
      observations: ['Sodium (Na): Golden yellow flame', 'Potassium (K): Lilac (pale violet)', 'Calcium (Ca): Brick red', 'Copper (Cu): Blue-green', 'Strontium (Sr): Crimson red'],
      result: 'Each metal ion produces a characteristic flame color due to excitation and subsequent de-excitation of electrons to ground state.',
      vivaQuestions: [
        { q: 'Why does flame test work?', opts: ['Chemical reaction', 'Electron excitation and de-excitation', 'Burning of metal', 'Reflection of light'], correct: 1 },
        { q: 'Why use HCl to clean the wire?', opts: ['To make it shiny', 'To remove previous metal residues', 'To heat it faster', 'To make flame brighter'], correct: 1 },
        { q: 'Sodium gives which color?', opts: ['Red', 'Blue', 'Golden yellow', 'Green'], correct: 2 },
        { q: 'Why is platinum wire used?', opts: ['It is cheap', 'It does not interfere with flame color', 'It glows brightly', 'It is magnetic'], correct: 1 }
      ],
      difficulty: 'easy', duration: '25 min', icon: '\uD83D\uDD25', subjectClass: ['11', '12'],
      labCount: 3, simulationType: 'flame'
    },
    {
      id: 'chem5', subjectId: 'chemistry', subject: 'Chemistry', title: 'Chromatography of Inks',
      description: 'Separate the pigments present in black ink using paper chromatography.',
      objective: 'To separate and identify the different pigments in a black ink sample.',
      materials: ['Filter Paper (Whatman)', 'Black Ink', 'Glass Jar', 'Water/Methanol Solvent', 'Capillary Tube', 'Pencil'],
      procedure: ['Cut a strip of filter paper and draw a base line with pencil', 'Apply a spot of black ink on the base line', 'Pour solvent in the jar without touching the spot', 'Place the paper in the jar and cover', 'Allow solvent to rise and observe separation'],
      observations: ['Different pigments travel at different rates', 'Multiple colored spots appear on the paper', 'Black ink contains blue, red, yellow, and green pigments', 'Calculate Rf values for each pigment'],
      result: 'Black ink is a mixture of at least 4 different colored pigments that separate based on their affinity for the solvent and paper.',
      vivaQuestions: [
        { q: 'What is the principle of chromatography?', opts: ['Boiling point difference', 'Partition between stationary and mobile phase', 'Magnetic separation', 'Centrifugal force'], correct: 1 },
        { q: 'Rf value is:', opts: ['Distance moved by pigment / Distance moved by solvent', 'Distance moved by solvent / Distance moved by pigment', 'Weight ratio', 'Volume ratio'], correct: 0 },
        { q: 'Why use pencil (not pen) for baseline?', opts: ['Pencil is cheaper', 'Ink in pen would also separate', 'Pencil is waterproof', 'Looks better'], correct: 1 },
        { q: 'Paper chromatography separates based on:', opts: ['Size only', 'Solubility and adsorption', 'Color only', 'Temperature'], correct: 1 }
      ],
      difficulty: 'medium', duration: '30 min', icon: '\uD83C\uDFA8', subjectClass: ['11', '12'],
      labCount: 3, simulationType: 'chromatography'
    },

    {
      id: 'bio1', subjectId: 'biology', subject: 'Biology', title: 'Plant Cell Under Microscope',
      description: 'Prepare a slide and observe plant cell structure under a compound microscope.',
      objective: 'To identify the different parts of a typical plant cell under a microscope.',
      materials: ['Compound Microscope', 'Onion Bulb', 'Slide', 'Cover Slip', 'Iodine Solution', 'Blade', 'Forceps'],
      procedure: ['Peel a thin layer from an onion scale leaf', 'Place it on a clean slide with a drop of water', 'Add a drop of iodine solution for staining', 'Place the cover slip carefully to avoid air bubbles', 'Observe under low power (10\u00D7) then high power (40\u00D7)'],
      observations: ['Rectangular cell wall clearly visible', 'Nucleus stained dark blue/brown by iodine', 'Cytoplasm visible around the nucleus', 'Large central vacuole occupies most of the cell'],
      result: 'Typical plant cells show a distinct cell wall, nucleus, cytoplasm, and large central vacuole, confirming the basic plant cell structure.',
      vivaQuestions: [
        { q: 'What is the function of the cell wall?', opts: ['Energy production', 'Provides structural support and shape', 'Stores food', 'Contains DNA'], correct: 1 },
        { q: 'Why are plant cells rectangular?', opts: ['Due to cell wall', 'Due to vacuole', 'Due to nucleus', 'Due to chloroplast'], correct: 0 },
        { q: 'Iodine is used for:', opts: ['Cleaning the slide', 'Staining the nucleus', 'Killing bacteria', 'Heating the sample'], correct: 1 },
        { q: 'What is the main difference between plant and animal cells?', opts: ['Size', 'Cell wall and large vacuole in plants', 'Color', 'Number of nucleus'], correct: 1 }
      ],
      difficulty: 'easy', duration: '30 min', icon: '\uD83C\uDF31', subjectClass: ['9', '10'],
      labCount: 3, simulationType: 'microscope'
    },
    {
      id: 'bio2', subjectId: 'biology', subject: 'Biology', title: 'Osmosis in Potato Cells',
      description: 'Demonstrate osmosis using potato strips in different solutions.',
      objective: 'To show the effect of hypotonic and hypertonic solutions on plant cells.',
      materials: ['Potato', 'Beakers (3)', 'Salt', 'Distilled Water', 'Knife', 'Digital Balance', 'Scale'],
      procedure: ['Cut 3 cylindrical strips of equal length from potato', 'Weigh each strip and record', 'Place one in distilled water, one in 5% salt solution, one in 10% salt solution', 'Leave for 30 minutes', 'Remove strips, blot dry, and weigh again'],
      observations: ['Distilled water strip: gains weight (turgid)', '5% salt solution strip: loses weight (flaccid)', '10% salt solution strip: loses more weight (plasmolysed)', 'Water moves by osmosis across cell membrane'],
      result: 'Water moves into cells in a hypotonic solution (increased weight) and out of cells in a hypertonic solution (decreased weight), demonstrating osmosis.',
      vivaQuestions: [
        { q: 'What is osmosis?', opts: ['Movement of solute', 'Movement of water across semi-permeable membrane from low to high concentration', 'Active transport', 'Diffusion of gas'], correct: 1 },
        { q: 'A hypotonic solution has:', opts: ['More solute than cell', 'Less solute than cell', 'Same solute as cell', 'No solute'], correct: 1 },
        { q: 'Plasmolysis occurs in:', opts: ['Hypotonic solution', 'Isotonic solution', 'Hypertonic solution', 'Pure water'], correct: 2 },
        { q: 'In distilled water, potato cells become:', opts: ['Shriveled', 'Turgid', 'Plasmolysed', 'Destroyed'], correct: 1 }
      ],
      difficulty: 'easy', duration: '40 min', icon: '\uD83E\uDD54', subjectClass: ['9', '10', '11'],
      labCount: 3, simulationType: 'osmosis'
    },
    {
      id: 'bio3', subjectId: 'biology', subject: 'Biology', title: 'Photosynthesis Light Reaction',
      description: 'Test whether light is necessary for photosynthesis using a variegated leaf.',
      objective: 'To prove that light is essential for photosynthesis by testing for starch production.',
      materials: ['Variegated Plant Leaf', 'Beaker', 'Alcohol', 'Iodine Solution', 'Water Bath', 'Forceps'],
      procedure: ['Destarch the plant by keeping in darkness for 48 hours', 'Expose to sunlight for 4-6 hours', 'Pluck a variegated leaf and boil in water to kill cells', 'Boil in alcohol using water bath to remove chlorophyll', 'Wash and test with iodine solution'],
      observations: ['Green areas (with chlorophyll) turn blue-black', 'White areas (without chlorophyll) remain brown', 'Only light-exposed green parts show starch', 'Chlorophyll and light both are necessary'],
      result: 'Iodine turns blue-black only in green areas that received light, proving that both light and chlorophyll are essential for photosynthesis.',
      vivaQuestions: [
        { q: 'What is photosynthesis?', opts: ['Respiration', 'Conversion of light energy to chemical energy', 'Digestion', 'Excretion'], correct: 1 },
        { q: 'Why destarch the plant first?', opts: ['To kill it', 'To ensure starch detected is newly formed', 'To make it stronger', 'To remove chlorophyll'], correct: 1 },
        { q: 'Iodine tests for:', opts: ['Protein', 'Fat', 'Starch', 'Sugar'], correct: 2 },
        { q: 'Why use water bath for alcohol?', opts: ['To heat faster', 'Alcohol is flammable - avoid direct flame', 'To cool it', 'To make it cleaner'], correct: 1 }
      ],
      difficulty: 'medium', duration: '60 min + destarching', icon: '\u2600\uFE0F', subjectClass: ['9', '10', '11'],
      labCount: 4, simulationType: 'photosynthesis'
    },
    {
      id: 'bio4', subjectId: 'biology', subject: 'Biology', title: 'DNA Extraction from Fruits',
      description: 'Extract visible DNA from a banana using household materials.',
      objective: 'To extract and observe DNA from fruit cells using simple laboratory techniques.',
      materials: ['Banana', 'Table Salt', 'Liquid Dish Soap', 'Cold Isopropyl Alcohol', 'Ziplock Bag', 'Strainer', 'Glass'],
      procedure: ['Mash the banana thoroughly in a ziplock bag', 'Add salt, dish soap, and warm water to the bag', 'Mix gently without forming bubbles', 'Strain the mixture through a strainer into a glass', 'Slowly pour cold alcohol along the side of the glass'],
      observations: ['White, thread-like DNA precipitates at the alcohol layer', 'DNA appears as cloudy, stringy substance', 'The DNA can be spooled with a glass rod', 'Soap breaks down cell membranes (lipid bilayer)'],
      result: 'DNA is visible as white, thread-like strands at the interface between the fruit mixture and alcohol layer, successfully extracted from banana cells.',
      vivaQuestions: [
        { q: 'What is the role of soap?', opts: ['Adds fragrance', 'Breaks down lipid cell membranes to release DNA', 'Kills bacteria', 'Stabilizes DNA'], correct: 1 },
        { q: 'Why cold alcohol?', opts: ['Feels nice', 'DNA precipitates better in cold alcohol', 'Prevents evaporation', 'Makes it colorless'], correct: 1 },
        { q: 'Where is DNA located in the cell?', opts: ['Cytoplasm', 'Cell membrane', 'Nucleus', 'Vacuole'], correct: 2 },
        { q: 'Why add salt?', opts: ['For taste', 'Helps DNA clump together by neutralizing charges', 'Kills bacteria', 'Makes it cold'], correct: 1 }
      ],
      difficulty: 'medium', duration: '25 min', icon: '\uD83E\uDDEC', subjectClass: ['10', '11', '12'],
      labCount: 3, simulationType: 'dna'
    },
    {
      id: 'bio5', subjectId: 'biology', subject: 'Biology', title: 'Stomatal Observation',
      description: 'Observe stomata in a leaf peel under the microscope.',
      objective: 'To observe stomata and understand their role in transpiration and gas exchange.',
      materials: ['Compound Microscope', 'Fresh Leaf (Dicot)', 'Slide', 'Cover Slip', 'Forceps', 'Water', 'Nail Polish'],
      procedure: ['Apply a thin layer of clear nail polish on the lower surface of a leaf', 'Let it dry completely (10 minutes)', 'Peel off the nail polish film carefully', 'Place the film on a slide with a drop of water', 'Cover and observe under the microscope'],
      observations: ['Kidney-shaped guard cells surround each stoma', 'Stomata are more concentrated on lower leaf surface', 'Guard cells contain chloroplasts (unlike epidermal cells)', 'Stomata open in light, close in darkness'],
      result: 'Stomata are present mainly on the lower epidermis of leaves. Each stoma is flanked by two guard cells that control the opening and closing of the pore.',
      vivaQuestions: [
        { q: 'What is the function of stomata?', opts: ['Photosynthesis only', 'Gas exchange and transpiration', 'Absorption of water', 'Structural support'], correct: 1 },
        { q: 'Guard cells differ from other epidermal cells because they:', opts: ['Have no cell wall', 'Have chloroplasts', 'Are dead', 'Are larger'], correct: 1 },
        { q: 'Stomata open during:', opts: ['Night only', 'Daytime (light)', 'Always closed', 'Only in winter'], correct: 1 },
        { q: 'Transpiration is:', opts: ['Absorption of water', 'Loss of water vapor through stomata', 'Transport of food', 'Root growth'], correct: 1 }
      ],
      difficulty: 'easy', duration: '25 min', icon: '\uD83C\uDF3F', subjectClass: ['9', '10'],
      labCount: 3, simulationType: 'microscope'
    },

    {
      id: 'math1', subjectId: 'mathematics', subject: 'Mathematics', title: 'Graph Plotting - Linear Equations',
      description: 'Plot and analyze linear equations on a coordinate plane.',
      objective: 'To draw the graph of a linear equation in two variables and interpret its slope and intercepts.',
      materials: ['Graph Paper', 'Scale', 'Pencil', 'Eraser', 'Ruler'],
      procedure: ['Take the linear equation y = 2x + 1', 'Create a table of (x, y) values for x = -3 to 3', 'Plot all the points on graph paper', 'Join the points with a straight line', 'Identify the slope and y-intercept from the graph'],
      observations: ['The graph is a straight line', 'y-intercept = 1 (line passes through (0, 1))', 'Slope = rise/run = 2/1 = 2', 'x-intercept = -0.5 (where y = 0)'],
      result: 'The graph of y = 2x + 1 is a straight line with slope 2 and y-intercept 1, extending infinitely in both directions.',
      vivaQuestions: [
        { q: 'What is the slope of y = 3x + 2?', opts: ['2', '3', '5', '1'], correct: 1 },
        { q: 'The y-intercept is where:', opts: ['x = 1', 'y = 0', 'x = 0', 'y = x'], correct: 2 },
        { q: 'A line with slope 0 is:', opts: ['Vertical', 'Horizontal', 'Diagonal', 'Curved'], correct: 1 },
        { q: 'Two parallel lines have:', opts: ['Different slopes', 'Same slope', 'Product of slopes = -1', 'No slope'], correct: 1 }
      ],
      difficulty: 'easy', duration: '25 min', icon: '\u2696\uFE0F', subjectClass: ['9', '10'],
      labCount: 3, simulationType: 'graph'
    },
    {
      id: 'math2', subjectId: 'mathematics', subject: 'Mathematics', title: 'Trigonometric Ratios Verification',
      description: 'Verify trigonometric ratios using a right triangle and a unit circle.',
      objective: 'To verify the values of sin, cos, and tan for standard angles (0\u00B0, 30\u00B0, 45\u00B0, 60\u00B0, 90\u00B0).',
      materials: ['Graph Paper', 'Protractor', 'Scale', 'Compass', 'Pencil'],
      procedure: ['Draw a unit circle (radius = 1) on graph paper', 'Mark angles 0\u00B0, 30\u00B0, 45\u00B0, 60\u00B0, 90\u00B0', 'For each angle, drop a perpendicular to the x-axis', 'Measure the x-coordinate (cos) and y-coordinate (sin)', 'Calculate tan = sin/cos for each angle'],
      observations: ['sin 30\u00B0 = 0.5, cos 30\u00B0 = 0.866', 'sin 45\u00B0 = cos 45\u00B0 = 0.707', 'sin 60\u00B0 = 0.866, cos 60\u00B0 = 0.5', 'sin\u00B2\u03B8 + cos\u00B2\u03B8 = 1 for all angles'],
      result: 'The measured values match the standard trigonometric ratios. The Pythagorean identity sin\u00B2\u03B8 + cos\u00B2\u03B8 = 1 is verified for all standard angles.',
      vivaQuestions: [
        { q: 'sin 90\u00B0 equals:', opts: ['0', '0.5', '1', '\u221A3/2'], correct: 2 },
        { q: 'tan 45\u00B0 equals:', opts: ['0', '0.5', '1', '\u221A3'], correct: 2 },
        { q: 'sin\u00B2\u03B8 + cos\u00B2\u03B8 equals:', opts: ['0', '1', '2', 'sin\u03B8'], correct: 1 },
        { q: 'cos 0\u00B0 equals:', opts: ['0', '0.5', '1', '-1'], correct: 2 }
      ],
      difficulty: 'medium', duration: '35 min', icon: '\u25B3', subjectClass: ['10', '11', '12'],
      labCount: 3, simulationType: 'trigonometry'
    },
    {
      id: 'math3', subjectId: 'mathematics', subject: 'Mathematics', title: 'Probability with Dice',
      description: 'Study experimental probability by rolling dice multiple times.',
      objective: 'To understand experimental probability and compare it with theoretical probability.',
      materials: ['Dice (2)', 'Notebook', 'Pen', 'Calculator'],
      procedure: ['Roll a single die 60 times and record each outcome', 'Calculate the frequency of each face (1-6)', 'Calculate experimental probability = frequency/60', 'Compare with theoretical probability (1/6 \u2248 0.167)', 'Repeat with two dice and analyze the sum distribution'],
      observations: ['Theoretical probability of each face = 1/6 \u2248 0.167', 'Experimental probability approaches theoretical with more trials', 'Sum of probabilities of all outcomes = 1', 'Two dice give 36 equally likely outcomes'],
      result: 'Experimental probability approaches theoretical probability as the number of trials increases, verifying the Law of Large Numbers.',
      vivaQuestions: [
        { q: 'Theoretical probability of getting a 6 on a fair die:', opts: ['1/2', '1/4', '1/6', '1/3'], correct: 2 },
        { q: 'Sum of all probabilities equals:', opts: ['0', '1', '6', 'Depends on trials'], correct: 1 },
        { q: 'Law of Large Numbers states:', opts: ['Probability decreases with trials', 'Experimental probability approaches theoretical as trials increase', 'Always use 100 trials', 'Dice are unfair'], correct: 1 },
        { q: 'P(not getting a 6) =', opts: ['1/6', '5/6', '0', '1'], correct: 1 }
      ],
      difficulty: 'easy', duration: '30 min', icon: '\uD83C\uDFB2', subjectClass: ['9', '10'],
      labCount: 3, simulationType: 'probability'
    },
    {
      id: 'math4', subjectId: 'mathematics', subject: 'Mathematics', title: 'Statistics - Central Tendency',
      description: 'Calculate and interpret mean, median, and mode for a given dataset.',
      objective: 'To find the mean, median, and mode of ungrouped data and understand their significance.',
      materials: ['Dataset', 'Notebook', 'Calculator', 'Graph Paper'],
      procedure: ['Use the given marks dataset of 20 students', 'Calculate the mean: sum of all marks / 20', 'Arrange in ascending order and find the median', 'Identify the mode (most frequent value)', 'Find the range and discuss outliers'],
      observations: ['Mean = sum/n = 1368/20 = 68.4', 'Median = average of 10th and 11th values = 67', 'Mode = 45 and 67 (bimodal)', 'Range = 92 - 34 = 58'],
      result: 'The mean is 68.4, median is 67, and the data is bimodal (modes 45 and 67). These measures describe the central tendency of the data.',
      vivaQuestions: [
        { q: 'Mean is affected by:', opts: ['All values equally', 'Only extreme values', 'Only the middle value', 'Nothing'], correct: 0 },
        { q: 'When is median preferred over mean?', opts: ['When data is symmetric', 'When data has outliers', 'When data is small', 'Never'], correct: 1 },
        { q: 'A dataset can have:', opts: ['Only one mode', 'At most two modes', 'Any number of modes', 'No mode possible'], correct: 2 },
        { q: 'Range = ', opts: ['Mean - Median', 'Maximum - Minimum', 'Sum / Count', 'Middle value'], correct: 1 }
      ],
      difficulty: 'easy', duration: '20 min', icon: '\uD83D\uDCCA', subjectClass: ['9', '10'],
      labCount: 3, simulationType: 'statistics'
    },

    {
      id: 'cs1', subjectId: 'cs', subject: 'Computer Science', title: 'Logic Gates Simulation',
      description: 'Understand and simulate basic logic gates: AND, OR, NOT, NAND, NOR, XOR.',
      objective: 'To understand the truth tables and behavior of fundamental logic gates.',
      materials: ['Computer', 'Code Editor', 'Logic Simulator Software'],
      procedure: ['Study the truth table for each logic gate', 'Implement AND, OR, NOT gates in code', 'Build NAND, NOR, XOR from basic gates', 'Test with all possible input combinations', 'Verify outputs match truth tables'],
      observations: ['AND: Output 1 only when both inputs are 1', 'OR: Output 1 when at least one input is 1', 'NOT: Inverts the input', 'NAND = NOT(AND), NOR = NOT(OR)'],
      result: 'All six basic logic gates implemented correctly. Truth tables verified for all possible input combinations.',
      vivaQuestions: [
        { q: 'AND gate output is 1 when:', opts: ['Both inputs are 0', 'At least one input is 1', 'Both inputs are 1', 'Inputs are different'], correct: 2 },
        { q: 'Which gate is called a universal gate?', opts: ['AND', 'OR', 'NAND', 'NOT'], correct: 2 },
        { q: 'XOR output is 1 when:', opts: ['Both inputs same', 'Both inputs 1', 'Inputs are different', 'Both inputs 0'], correct: 2 },
        { q: 'NOT gate has how many inputs?', opts: ['0', '1', '2', '3'], correct: 1 }
      ],
      difficulty: 'easy', duration: '25 min', icon: '\uD83D\uDD0C', subjectClass: ['11', '12'],
      labCount: 3, simulationType: 'logic'
    },
    {
      id: 'cs2', subjectId: 'cs', subject: 'Computer Science', title: 'Binary Number Operations',
      description: 'Convert between decimal and binary and perform binary arithmetic.',
      objective: 'To understand the binary number system and perform addition, subtraction in binary.',
      materials: ['Computer', 'Paper', 'Pencil', 'Calculator for verification'],
      procedure: ['Convert decimal numbers (10, 25, 100) to binary', 'Convert binary numbers (1010, 11001) to decimal', 'Perform binary addition with carry', 'Perform binary subtraction with borrow', 'Verify results by converting back to decimal'],
      observations: ['Binary uses only digits 0 and 1', 'Positional values are powers of 2', '10 + 5 = 1010 + 101 = 1111', 'Carry propagates like decimal addition'],
      result: 'Binary arithmetic verified. All conversions and arithmetic operations match expected results. Understanding of positional notation confirmed.',
      vivaQuestions: [
        { q: 'Binary number 1010 in decimal is:', opts: ['10', '12', '8', '15'], correct: 0 },
        { q: 'The base of binary number system is:', opts: ['8', '10', '2', '16'], correct: 2 },
        { q: '11 + 1 in binary =', opts: ['12', '100', '110', '111'], correct: 1 },
        { q: '1 byte equals:', opts: ['4 bits', '8 bits', '16 bits', '32 bits'], correct: 1 }
      ],
      difficulty: 'easy', duration: '20 min', icon: '\u0110', subjectClass: ['11', '12'],
      labCount: 3, simulationType: 'binary'
    },
    {
      id: 'cs3', subjectId: 'cs', subject: 'Computer Science', title: 'Sorting Algorithms Visualization',
      description: 'Implement and compare Bubble Sort, Selection Sort, and Insertion Sort.',
      objective: 'To understand different sorting algorithms and compare their time complexity.',
      materials: ['Computer', 'Code Editor', 'Python/JavaScript Compiler'],
      procedure: ['Implement Bubble Sort algorithm', 'Implement Selection Sort algorithm', 'Implement Insertion Sort algorithm', 'Test each with the same random array', 'Count and compare the number of comparisons and swaps'],
      observations: ['Bubble Sort: O(n\u00B2) - many swaps', 'Selection Sort: O(n\u00B2) - minimal swaps', 'Insertion Sort: O(n\u00B2) average, O(n) best case', 'All are comparison-based sorts'],
      result: 'All three sorting algorithms correctly sort the array. Insertion Sort is fastest for nearly sorted data. Bubble Sort is simplest but slowest overall.',
      vivaQuestions: [
        { q: 'Which sort has the best average case?', opts: ['Bubble Sort', 'Selection Sort', 'Insertion Sort', 'All are same'], correct: 2 },
        { q: 'Time complexity of Bubble Sort is:', opts: ['O(n)', 'O(n log n)', 'O(n\u00B2)', 'O(log n)'], correct: 2 },
        { q: 'Which sort makes minimum swaps?', opts: ['Bubble Sort', 'Selection Sort', 'Insertion Sort', 'All same'], correct: 1 },
        { q: 'Stable sorting means:', opts: ['Fast sort', 'Equal elements maintain relative order', 'Uses no extra memory', 'Always O(n\u00B2)'], correct: 1 }
      ],
      difficulty: 'medium', duration: '40 min', icon: '\uD83D\uDCC8', subjectClass: ['11', '12'],
      labCount: 3, simulationType: 'sorting'
    },

    {
      id: 'env1', subjectId: 'envscience', subject: 'Environmental Science', title: 'Water Quality Testing',
      description: 'Test water samples for pH, turbidity, dissolved oxygen, and contaminants.',
      objective: 'To assess the quality of water samples from different sources using standard tests.',
      materials: ['Water Samples (tap, river, pond, rain)', 'pH paper', 'Turbidity tube', 'DO test kit', 'TDS meter', 'Test tubes'],
      procedure: ['Collect water samples from 4 different sources', 'Test pH using pH paper for each sample', 'Measure turbidity using the turbidity tube', 'Test dissolved oxygen with the DO test kit', 'Measure total dissolved solids (TDS) with the meter'],
      observations: ['Tap water: pH ~7, low turbidity, good DO', 'River water: pH 6.5-7.5, variable turbidity', 'Pond water: pH 7-8, higher turbidity, lower DO', 'Rain water: pH ~5.6 (slightly acidic), low TDS'],
      result: 'Water quality varies significantly by source. Tap water generally meets drinking standards. Pond and river water may need treatment before consumption.',
      vivaQuestions: [
        { q: 'What does pH of water indicate?', opts: ['Temperature', 'Acidity or alkalinity', 'Hardness', 'Color'], correct: 1 },
        { q: 'Safe drinking water pH range:', opts: ['1-3', '4-5', '6.5-8.5', '10-12'], correct: 2 },
        { q: 'High TDS means:', opts: ['Very pure water', 'Many dissolved substances', 'Low temperature', 'High pressure'], correct: 1 },
        { q: 'Dissolved oxygen is important for:', opts: ['Taste only', 'Aquatic life survival', 'Color of water', 'Heating water'], correct: 1 }
      ],
      difficulty: 'easy', duration: '35 min', icon: '\uD83D\uDCA7', subjectClass: ['9', '10', '11'],
      labCount: 3, simulationType: 'water'
    },
    {
      id: 'env2', subjectId: 'envscience', subject: 'Environmental Science', title: 'Soil Analysis',
      description: 'Analyze soil samples for texture, pH, moisture content, and organic matter.',
      objective: 'To determine the physical and chemical properties of soil from different locations.',
      materials: ['Soil Samples (3 types)', 'pH paper', 'Beakers', 'Filter paper', 'Water', 'Balance', 'Oven/Drying rack', 'Sieve'],
      procedure: ['Collect soil samples from garden, field, and forest', 'Test soil pH by mixing soil with distilled water', 'Perform the jar test for texture (sand/silt/clay)', 'Measure moisture content by weighing before and after drying', 'Test for organic matter using the hydrogen peroxide test'],
      observations: ['Garden soil: slightly acidic pH, good organic matter', 'Field soil: neutral pH, higher sand content', 'Forest soil: slightly acidic, highest organic matter', 'Texture varies - affects water retention'],
      result: 'Soil properties vary by location. Forest soil has the most organic matter. Soil texture determines water-holding capacity and drainage.',
      vivaQuestions: [
        { q: 'Ideal soil pH for most plants:', opts: ['3-4', '5-6', '6.5-7.5', '9-10'], correct: 2 },
        { q: 'Sand in soil helps with:', opts: ['Water retention', 'Drainage', 'Nutrient storage', 'Color'], correct: 1 },
        { q: 'Organic matter in soil comes from:', opts: ['Rocks', 'Decomposed plants and animals', 'Sand', 'Water'], correct: 1 },
        { q: 'Clay soil has:', opts: ['Large particles', 'Poor drainage', 'No nutrients', 'High sand content'], correct: 1 }
      ],
      difficulty: 'easy', duration: '40 min', icon: '\uD83C\uDF3E', subjectClass: ['9', '10', '11'],
      labCount: 3, simulationType: 'soil'
    },
    {
      id: 'env3', subjectId: 'envscience', subject: 'Environmental Science', title: 'Air Quality Assessment',
      description: 'Monitor and assess air quality using particulate matter collectors and indicators.',
      objective: 'To measure and compare air quality at different locations using simple methods.',
      materials: ['Glass slides with Vaseline', 'Magnifying glass', ' Stopwatch', 'Data sheets', 'Pine leaves', 'Indicator plants'],
      procedure: ['Place vaseline-coated glass slides at 3 different locations', 'Leave exposed for 24 hours', 'Count particles under magnifying glass', 'Observe indicator plants for pollution signs', 'Compare readings across locations'],
      observations: ['Busy road: highest particle count', 'Park area: moderate particle count', 'Rural area: lowest particle count', 'Lichen absent near busy roads (SO\u2082 indicator)'],
      result: 'Air quality degrades significantly near traffic-heavy areas. Lichen serves as a good bio-indicator of SO\u2082 pollution levels.',
      vivaQuestions: [
        { q: 'PM2.5 refers to:', opts: ['Particles less than 2.5mm', 'Particles less than 2.5 micrometers', '2.5 grams of matter', '2.5 liters of air'], correct: 1 },
        { q: 'Lichen indicates air quality because:', opts: ['It is colorful', 'It is sensitive to SO\u2082', 'It grows fast', 'It is edible'], correct: 1 },
        { q: 'Cleanest air is found in:', opts: ['Industrial areas', 'Traffic junctions', 'Rural/forest areas', 'Underground'], correct: 2 },
        { q: 'Primary air pollutants include:', opts: ['Oxygen and nitrogen', 'CO, SO\u2082, NO\u2082, PM', 'Water vapor', 'Helium'], correct: 1 }
      ],
      difficulty: 'easy', duration: '30 min + 24hr exposure', icon: '\uD83C\uDF2C\uFE0F', subjectClass: ['9', '10', '11'],
      labCount: 3, simulationType: 'air'
    }
  ];

  function persist(key, val) { _Store.set(STORAGE_PREFIX + key, val); }
  function unpersist(key) { return _Store.get(STORAGE_PREFIX + key); }

  function getProgress(id) { return unpersist('progress_' + id) || { completed: false, timeSpent: 0, vivaScore: 0 }; }
  function saveProgress(id, data) { persist('progress_' + id, data); }
  function getFavorites() { return unpersist('favorites') || []; }
  function saveFavorites(f) { persist('favorites', f); }
  function getHistory() { return unpersist('history') || []; }
  function saveHistory(h) { persist('history', h); }
  function getBookmarks() { return unpersist('bookmarks') || []; }
  function saveBookmarks(b) { persist('bookmarks', b); }

  function isFavorite(id) { return getFavorites().indexOf(id) !== -1; }
  function isBookmarked(id) { return getBookmarks().indexOf(id) !== -1; }
  function isCompleted(id) { return getProgress(id).completed; }

  function toggleFavorite(id) {
    var favs = getFavorites();
    var idx = favs.indexOf(id);
    if (idx !== -1) favs.splice(idx, 1); else favs.push(id);
    saveFavorites(favs);
    _toast(isFavorite(id) ? 'Added to favorites' : 'Removed from favorites', 'success');
    _rerender();
  }

  function toggleBookmark(id) {
    var bm = getBookmarks();
    var idx = bm.indexOf(id);
    if (idx !== -1) bm.splice(idx, 1); else bm.push(id);
    saveBookmarks(bm);
    _toast(isBookmarked(id) ? 'Bookmarked' : 'Bookmark removed', 'success');
    _rerender();
  }

  function addToHistory(id) {
    var h = getHistory();
    for (var i = 0; i < h.length; i++) { if (h[i].id === id) { h.splice(i, 1); break; } }
    h.unshift({ id: id, time: Date.now() });
    if (h.length > 50) h = h.slice(0, 50);
    saveHistory(h);
  }

  var _subjMeta = {
    physics:      { icon: '\u26A1',              color: '#3b82f6', grad: 'linear-gradient(135deg,#3b82f6,#8b5cf6)', label: 'Physics' },
    chemistry:    { icon: '\uD83E\uDDEA',        color: '#8b5cf6', grad: 'linear-gradient(135deg,#8b5cf6,#ec4899)', label: 'Chemistry' },
    biology:      { icon: '\uD83C\uDF31',        color: '#10b981', grad: 'linear-gradient(135deg,#10b981,#06b6d4)', label: 'Biology' },
    mathematics:  { icon: '\u2696\uFE0F',        color: '#ec4899', grad: 'linear-gradient(135deg,#ec4899,#f97316)', label: 'Mathematics' },
    cs:           { icon: '\uD83D\uDD0C',        color: '#f59e0b', grad: 'linear-gradient(135deg,#f59e0b,#f97316)', label: 'Computer Science' },
    envscience:   { icon: '\uD83C\uDF0D',        color: '#06b6d4', grad: 'linear-gradient(135deg,#06b6d4,#10b981)', label: 'Environmental Science' }
  };

  function getSubjects() {
    var seen = {};
    var list = [];
    for (var i = 0; i < _experiments.length; i++) {
      var e = _experiments[i];
      if (!seen[e.subjectId]) { seen[e.subjectId] = true; list.push(e.subjectId); }
    }
    return list;
  }

  function getClasses() {
    var seen = {};
    var list = [];
    for (var i = 0; i < _experiments.length; i++) {
      var classes = _experiments[i].subjectClass;
      for (var j = 0; j < classes.length; j++) {
        if (!seen[classes[j]]) { seen[classes[j]] = true; list.push(classes[j]); }
      }
    }
    list.sort();
    return list;
  }

  function getFilteredExperiments() {
    var results = [];
    for (var i = 0; i < _experiments.length; i++) {
      var e = _experiments[i];
      if (_state.selectedClass && e.subjectClass.indexOf(_state.selectedClass) === -1) continue;
      if (_state.selectedSubject && e.subjectId !== _state.selectedSubject) continue;
      if (_state.filterDifficulty && e.difficulty !== _state.filterDifficulty) continue;
      if (_state.showFavoritesOnly && !isFavorite(e.id)) continue;
      if (_state.showCompletedOnly && !isCompleted(e.id)) continue;
      if (_state.searchQuery) {
        var q = _state.searchQuery.toLowerCase();
        if (e.title.toLowerCase().indexOf(q) === -1 && e.description.toLowerCase().indexOf(q) === -1 && e.subject.toLowerCase().indexOf(q) === -1) continue;
      }
      results.push(e);
    }
    return results;
  }

  function getSubjectExperimentCount(subjId, classFilter) {
    var count = 0;
    for (var i = 0; i < _experiments.length; i++) {
      var e = _experiments[i];
      if (e.subjectId !== subjId) continue;
      if (classFilter && e.subjectClass.indexOf(classFilter) === -1) continue;
      count++;
    }
    return count;
  }

  function getSubjectCompletedCount(subjId) {
    var count = 0;
    for (var i = 0; i < _experiments.length; i++) {
      if (_experiments[i].subjectId === subjId && isCompleted(_experiments[i].id)) count++;
    }
    return count;
  }

  function diffColor(d) {
    if (d === 'easy') return 'var(--accent-green)';
    if (d === 'hard') return 'var(--accent-red)';
    return 'var(--accent-yellow)';
  }
  function diffBadge(d) {
    if (d === 'easy') return 'badge-green';
    if (d === 'hard') return 'badge-red';
    return 'badge-yellow';
  }

  function _toast(msg, type) {
    if (window.showToast) { window.showToast(msg, type); return; }
    var el = document.createElement('div');
    var bg = type === 'success' ? 'var(--accent-green)' : type === 'error' ? 'var(--accent-red)' : 'var(--accent-blue)';
    el.style.cssText = 'position:fixed;bottom:80px;left:50%;transform:translateX(-50%);background:' + bg + ';color:white;padding:8px 16px;border-radius:var(--radius-md);font-size:var(--text-sm);z-index:9999;animation:fadeIn 0.3s ease;box-shadow:0 4px 12px rgba(0,0,0,0.3)';
    el.textContent = msg;
    document.body.appendChild(el);
    setTimeout(function() { el.remove(); }, 2500);
  }

  function _rerender() {
    if (_state.view === 'subjects') _renderSubjectGrid();
    else if (_state.view === 'labs') _renderLabListing();
    else if (_state.view === 'experiment') _renderExperimentView();
  }

  function _startTimer() {
    _stopTimer();
    _state.timerStart = Date.now() - (_state.timerElapsed * 1000);
    _state.timerInterval = setInterval(function() {
      _state.timerElapsed = Math.floor((Date.now() - _state.timerStart) / 1000);
      var el = document.getElementById('vl-timer-display');
      if (el) el.textContent = _fmtTime(_state.timerElapsed);
    }, 1000);
  }

  function _stopTimer() {
    if (_state.timerInterval) { clearInterval(_state.timerInterval); _state.timerInterval = null; }
  }

  function _fmtTime(sec) {
    var h = Math.floor(sec / 3600);
    var m = Math.floor((sec % 3600) / 60);
    var s = sec % 60;
    return (h > 0 ? h + ':' : '') + (h > 0 && m < 10 ? '0' : '') + m + ':' + (s < 10 ? '0' : '') + s;
  }

  function _getTarget(id) { return e.target.closest('[data-action="' + id + '"]'); }
  function _act(id) { return e.target.getAttribute('data-action') === id; }

  function _incStep() {
    var exp = _getExp(_state.selectedLab);
    if (!exp) return;
    if (_state.currentStep < exp.procedure.length - 1) {
      _state.currentStep++;
      _rerender();
    }
  }
  function _decStep() {
    if (_state.currentStep > 0) { _state.currentStep--; _rerender(); }
  }

  function _getExp(id) {
    for (var i = 0; i < _experiments.length; i++) { if (_experiments[i].id === id) return _experiments[i]; }
    return null;
  }

  function _completeExperiment() {
    var exp = _getExp(_state.selectedLab);
    if (!exp) return;
    var p = getProgress(exp.id);
    p.completed = true;
    p.timeSpent = _state.timerElapsed;
    saveProgress(exp.id, p);
    addToHistory(exp.id);
    _toast('Experiment "' + exp.title + '" completed!', 'success');
    _rerender();
  }

  function _resetSim() {
    _state.simRunning = false;
    _state.simPaused = false;
    _state.simSliderValues = {};
    _rerender();
  }

  function _toggleSim() {
    _state.simRunning = !_state.simRunning;
    _state.simPaused = false;
    _rerender();
  }

  function _pauseSim() {
    _state.simPaused = !_state.simPaused;
    _rerender();
  }

  function _selectSubject(subjId) {
    _state.selectedSubject = subjId;
    _state.view = 'labs';
    _state.currentStep = 0;
    _state.filterDifficulty = '';
    _state.showFavoritesOnly = false;
    _state.showCompletedOnly = false;
    _state.searchQuery = '';
    _rerender();
  }

  function _selectClass(cls) {
    _state.selectedClass = _state.selectedClass === cls ? '' : cls;
    _state.selectedSubject = '';
    _state.view = 'subjects';
    _rerender();
  }

  function _openLab(id) {
    _state.selectedLab = id;
    _state.view = 'experiment';
    _state.currentTab = 'aim';
    _state.currentStep = 0;
    _state.currentVivaIdx = 0;
    _state.vivaAnswers = {};
    _state.timerElapsed = 0;
    _state.simRunning = false;
    _state.simPaused = false;
    _state.simSliderValues = {};
    _startTimer();
    _rerender();
  }

  function _backToSubjects() {
    _stopTimer();
    _state.view = 'subjects';
    _state.selectedSubject = '';
    _state.selectedLab = null;
    _rerender();
  }

  function _backToLabs() {
    _stopTimer();
    _state.view = 'labs';
    _state.selectedLab = null;
    _rerender();
  }

  function _switchTab(tab) {
    _state.currentTab = tab;
    _rerender();
  }

  function _submitViva(qIdx, ansIdx) {
    var exp = _getExp(_state.selectedLab);
    if (!exp) return;
    var correct = exp.vivaQuestions[qIdx].correct === ansIdx;
    _state.vivaAnswers[qIdx] = { selected: ansIdx, correct: correct };
    _toast(correct ? 'Correct!' : 'Incorrect. The correct answer is: ' + exp.vivaQuestions[qIdx].opts[exp.vivaQuestions[qIdx].correct], correct ? 'success' : 'error');
    _rerender();
  }

  function _downloadReport() {
    var exp = _getExp(_state.selectedLab);
    if (!exp) return;
    var p = getProgress(exp.id);
    var report = 'VIRTUAL LAB REPORT\n';
    report += '==================\n\n';
    report += 'Experiment: ' + exp.title + '\n';
    report += 'Subject: ' + exp.subject + '\n';
    report += 'Difficulty: ' + exp.difficulty + '\n';
    report += 'Duration: ' + exp.duration + '\n';
    report += 'Status: ' + (p.completed ? 'COMPLETED' : 'IN PROGRESS') + '\n';
    report += 'Time Spent: ' + _fmtTime(_state.timerElapsed) + '\n\n';
    report += 'OBJECTIVE\n' + exp.objective + '\n\n';
    report += 'MATERIALS\n';
    for (var i = 0; i < exp.materials.length; i++) report += '  - ' + exp.materials[i] + '\n';
    report += '\nPROCEDURE\n';
    for (var j = 0; j < exp.procedure.length; j++) report += '  ' + (j + 1) + '. ' + exp.procedure[j] + '\n';
    report += '\nOBSERVATIONS\n';
    for (var k = 0; k < exp.observations.length; k++) report += '  - ' + exp.observations[k] + '\n';
    report += '\nRESULT\n' + exp.result + '\n';
    var blob = new Blob([report], { type: 'text/plain' });
    var a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = exp.title.replace(/[^a-zA-Z0-9]/g, '_') + '_Report.txt';
    a.click();
    URL.revokeObjectURL(a.href);
    _toast('Report downloaded!', 'success');
  }

  // === RENDERERS ===

  function _renderSubjectGrid() {
    var mc = document.getElementById('main-content');
    if (!mc) return;
    var subjects = getSubjects();
    var classes = getClasses();
    var totalExp = _experiments.length;
    var totalCompleted = 0;
    for (var ci = 0; ci < _experiments.length; ci++) { if (isCompleted(_experiments[ci].id)) totalCompleted++; }

    var h = '<div class="page-container c-animate-fadeInUp">';
    h += '<nav class="breadcrumb c-mb-4"><span class="breadcrumb-item">Home</span><span class="breadcrumb-sep">/</span><span class="breadcrumb-current">Virtual Labs</span></nav>';
    h += '<div class="page-header"><div><h1 class="page-title">\uD83D\uDD2C Virtual Labs</h1><p class="page-subtitle">Interactive experiments simulator for hands-on learning</p></div></div>';

    h += '<div class="c-flex c-flex-wrap c-flex-gap-3 c-mb-4">';
    h += '<div class="stat-card c-p-3" style="flex:1;min-width:100px"><div class="stat-card-icon">\uD83D\uDCE6</div><div class="stat-card-value">' + totalExp + '</div><div class="stat-card-label">Total Experiments</div></div>';
    h += '<div class="stat-card c-p-3" style="flex:1;min-width:100px"><div class="stat-card-icon">\u2705</div><div class="stat-card-value">' + totalCompleted + '</div><div class="stat-card-label">Completed</div></div>';
    h += '<div class="stat-card c-p-3" style="flex:1;min-width:100px"><div class="stat-card-icon">\u2B50</div><div class="stat-card-value">' + getFavorites().length + '</div><div class="stat-card-label">Favorites</div></div>';
    h += '<div class="stat-card c-p-3" style="flex:1;min-width:100px"><div class="stat-card-icon">\uD83D\uDCD6</div><div class="stat-card-value">' + getHistory().length + '</div><div class="stat-card-label">History</div></div>';
    h += '</div>';

    h += '<div class="c-fs-sm c-fw-semibold c-text-primary c-mb-3">\uD83C\uDFEB Select Your Class</div>';
    h += '<div class="c-flex c-flex-wrap c-flex-gap-2 c-mb-4">';
    for (var ci2 = 0; ci2 < classes.length; ci2++) {
      var cls = classes[ci2];
      var isActive = _state.selectedClass === cls;
      h += '<button class="c-pointer c-fs-sm c-fw-semibold c-radius-md c-transition-fast" style="padding:8px 20px;border:2px solid ' + (isActive ? 'var(--accent-blue)' : 'var(--border-color)') + ';background:' + (isActive ? 'rgba(59,130,246,0.15)' : 'var(--bg-glass)') + ';color:' + (isActive ? 'var(--accent-blue)' : 'var(--text-secondary)') + '" data-action="vl:selectClass:' + cls + '">Class ' + cls + '</button>';
    }
    h += '</div>';

    h += '<div class="c-fs-sm c-fw-semibold c-text-primary c-mb-3">\uD83D\uDCDA Select a Subject</div>';
    h += '<div class="c-grid" style="grid-template-columns:repeat(auto-fill,minmax(200px,1fr));gap:var(--space-4);margin-bottom:var(--space-6)">';
    for (var si = 0; si < subjects.length; si++) {
      var sid = subjects[si];
      var meta = _subjMeta[sid] || { icon: '\uD83D\uDCD6', color: '#666', grad: 'linear-gradient(135deg,#666,#999)', label: sid };
      var count = getSubjectExperimentCount(sid, _state.selectedClass);
      var done = getSubjectCompletedCount(sid);
      var pct = count > 0 ? Math.round((done / count) * 100) : 0;
      h += '<div class="glass-card c-p-4 c-pointer c-transition-fast" style="cursor:pointer;border:2px solid transparent;transition:all 0.3s ease" data-action="vl:selectSubject:' + sid + '" onmouseenter="this.style.transform=\'translateY(-4px)\';this.style.boxShadow=\'0 12px 40px rgba(0,0,0,0.3)\'" onmouseleave="this.style.transform=\'\';this.style.boxShadow=\'\'">';
      h += '<div style="width:56px;height:56px;border-radius:var(--radius-md);background:' + meta.grad + ';display:flex;align-items:center;justify-content:center;font-size:1.8rem;margin-bottom:var(--space-3);box-shadow:0 4px 15px ' + meta.color + '33">' + meta.icon + '</div>';
      h += '<div class="c-fs-sm c-fw-bold c-text-primary c-mb-1">' + meta.label + '</div>';
      h += '<div class="c-fs-xs c-text-tertiary c-mb-2">' + count + ' experiment' + (count !== 1 ? 's' : '') + '</div>';
      if (count > 0) {
        h += '<div style="height:4px;background:var(--bg-glass);border-radius:2px;overflow:hidden;margin-bottom:4px">';
        h += '<div style="height:100%;width:' + pct + '%;background:' + meta.grad + ';border-radius:2px;transition:width 0.3s ease"></div>';
        h += '</div>';
        h += '<div class="c-fs-xs c-text-tertiary">' + done + '/' + count + ' completed (' + pct + '%)</div>';
      }
      h += '</div>';
    }
    h += '</div>';

    if (getHistory().length > 0) {
      h += '<div class="c-fs-sm c-fw-semibold c-text-primary c-mb-3">\uD83D\uDCD6 Recent Experiment History</div>';
      h += '<div class="c-grid c-mb-4" style="grid-template-columns:repeat(auto-fill,minmax(280px,1fr));gap:var(--space-3)">';
      var hist = getHistory();
      var shown = Math.min(hist.length, 6);
      for (var hi = 0; hi < shown; hi++) {
        var hex = _getExp(hist[hi].id);
        if (!hex) continue;
        var hmeta = _subjMeta[hex.subjectId] || _subjMeta.physics;
        h += '<div class="glass-card c-p-3 c-flex c-flex-gap-3" style="align-items:center">';
        h += '<div style="width:36px;height:36px;border-radius:var(--radius-sm);background:' + hmeta.grad + ';display:flex;align-items:center;justify-content:center;font-size:1.1rem;flex-shrink:0">' + hmeta.icon + '</div>';
        h += '<div class="c-flex-1" style="min-width:0"><div class="c-fs-xs c-fw-semibold c-text-primary text-truncate">' + _U.sanitizeHTML(hex.title) + '</div>';
        h += '<div class="c-fs-xs c-text-tertiary">' + hmeta.label + ' \u00B7 ' + hex.duration + '</div></div>';
        h += '<button class="btn btn-sm btn-primary" style="padding:4px 12px;font-size:var(--text-xs)" data-action="vl:openLab:' + hex.id + '">View</button>';
        h += '</div>';
      }
      h += '</div>';
    }

    h += '</div>';
    mc.innerHTML = h;
    mc.style.opacity = '0';
    mc.style.transition = 'opacity 0.3s ease';
    setTimeout(function() { mc.style.opacity = '1'; }, 50);
  }

  function _renderLabListing() {
    var mc = document.getElementById('main-content');
    if (!mc) return;
    var filtered = getFilteredExperiments();
    var meta = _subjMeta[_state.selectedSubject] || _subjMeta.physics;

    var h = '<div class="page-container c-animate-fadeInUp">';
    h += '<nav class="breadcrumb c-mb-4"><span class="breadcrumb-item">Home</span><span class="breadcrumb-sep">/</span><span class="breadcrumb-item c-pointer" data-action="vl:backToSubjects" style="cursor:pointer">Virtual Labs</span><span class="breadcrumb-sep">/</span><span class="breadcrumb-current">' + meta.label + '</span></nav>';

    h += '<div class="c-flex-between c-flex-wrap c-mb-4" style="gap:var(--space-3)">';
    h += '<div class="c-flex c-flex-gap-3" style="align-items:center">';
    h += '<button class="btn btn-ghost btn-sm" data-action="vl:backToSubjects">\u2190 Back</button>';
    h += '<div style="width:44px;height:44px;border-radius:var(--radius-md);background:' + meta.grad + ';display:flex;align-items:center;justify-content:center;font-size:1.5rem">' + meta.icon + '</div>';
    h += '<div><h2 class="c-fs-lg c-fw-bold c-text-primary c-m-0">' + meta.label + '</h2><div class="c-fs-xs c-text-tertiary">' + filtered.length + ' lab' + (filtered.length !== 1 ? 's' : '') + ' available</div></div>';
    h += '</div></div>';

    h += '<div class="c-flex c-flex-wrap c-flex-gap-2 c-mb-3">';
    h += '<div class="c-relative" style="flex:1;min-width:180px;max-width:320px">';
    h += '<span class="c-absolute" style="left:12px;top:50%;transform:translateY(-50%);color:var(--text-tertiary);font-size:0.875rem;pointer-events:none">\uD83D\uDD0D</span>';
    h += '<input type="text" class="input-field c-w-full" id="vl-search" placeholder="Search labs..." style="padding-left:2.25rem" data-action="vl:search">';
    h += '</div>';
    h += '</div>';

    h += '<div class="c-flex c-flex-wrap c-flex-gap-2 c-mb-3">';
    var diffs = ['easy', 'medium', 'hard'];
    var diffIcons = { easy: '\u2705', medium: '\uD83D\uDD22', hard: '\uD83D\uDD25' };
    for (var di = 0; di < diffs.length; di++) {
      var d = diffs[di];
      var isD = _state.filterDifficulty === d;
      h += '<button class="c-pointer c-fs-xs c-fw-semibold c-radius-md c-transition-fast" style="padding:6px 14px;border:1px solid ' + (isD ? diffColor(d) : 'var(--border-color)') + ';background:' + (isD ? diffColor(d) + '22' : 'var(--bg-glass)') + ';color:' + (isD ? diffColor(d) : 'var(--text-secondary)') + '" data-action="vl:filterDiff:' + d + '">' + diffIcons[d] + ' ' + d.charAt(0).toUpperCase() + d.slice(1) + '</button>';
    }
    h += '<span style="width:1px;height:24px;background:var(--border-color);margin:0 var(--space-1)"></span>';
    h += '<button class="c-pointer c-fs-xs c-fw-semibold c-radius-md c-transition-fast" style="padding:6px 14px;border:1px solid ' + (_state.showFavoritesOnly ? 'var(--accent-yellow)' : 'var(--border-color)') + ';background:' + (_state.showFavoritesOnly ? 'rgba(245,158,11,0.12)' : 'var(--bg-glass)') + ';color:' + (_state.showFavoritesOnly ? 'var(--accent-yellow)' : 'var(--text-secondary)') + '" data-action="vl:filterFav">\u2B50 Favorites</button>';
    h += '<button class="c-pointer c-fs-xs c-fw-semibold c-radius-md c-transition-fast" style="padding:6px 14px;border:1px solid ' + (_state.showCompletedOnly ? 'var(--accent-green)' : 'var(--border-color)') + ';background:' + (_state.showCompletedOnly ? 'rgba(16,185,129,0.12)' : 'var(--bg-glass)') + ';color:' + (_state.showCompletedOnly ? 'var(--accent-green)' : 'var(--text-secondary)') + '" data-action="vl:filterComp">\u2705 Completed</button>';
    h += '<button class="c-pointer c-fs-xs c-fw-semibold c-radius-md c-transition-fast" style="padding:6px 14px;border:1px solid var(--border-color);background:var(--bg-glass);color:var(--text-secondary)" data-action="vl:clearFilters">\u21BA Reset</button>';
    h += '</div>';

    if (filtered.length === 0) {
      h += '<div class="text-center py-8"><div class="empty-state-icon">\uD83D\uDD0D</div><div class="empty-state-title">No labs found</div><div class="empty-state-text">Try adjusting your filters or search query</div><button class="btn btn-primary btn-sm mt-4" data-action="vl:clearFilters">Clear Filters</button></div>';
    } else {
      h += '<div class="c-grid" style="grid-template-columns:repeat(auto-fill,minmax(320px,1fr));gap:var(--space-4)">';
      for (var li = 0; li < filtered.length; li++) {
        h += _renderLabCard(filtered[li]);
      }
      h += '</div>';
    }
    h += '</div>';
    mc.innerHTML = h;
    mc.style.opacity = '0';
    mc.style.transition = 'opacity 0.3s ease';
    setTimeout(function() { mc.style.opacity = '1'; }, 50);
  }

  function _renderLabCard(exp) {
    var comp = isCompleted(exp.id);
    var fav = isFavorite(exp.id);
    var bm = isBookmarked(exp.id);
    var prog = getProgress(exp.id);
    var smeta = _subjMeta[exp.subjectId] || _subjMeta.physics;

    var h = '<div class="glass-card c-p-4 c-flex c-flex-col" style="transition:all 0.3s ease">';

    h += '<div class="c-flex-between" style="align-items:flex-start;margin-bottom:var(--space-3)">';
    h += '<div class="c-flex c-flex-gap-3" style="align-items:center">';
    h += '<div style="width:44px;height:44px;border-radius:var(--radius-md);background:' + smeta.grad + ';display:flex;align-items:center;justify-content:center;font-size:1.5rem;flex-shrink:0;box-shadow:0 4px 12px ' + smeta.color + '22">' + smeta.icon + '</div>';
    h += '<div style="min-width:0">';
    h += '<div class="c-fs-sm c-fw-semibold c-text-primary text-truncate" style="max-width:200px">' + _U.sanitizeHTML(exp.title) + '</div>';
    h += '<div class="c-fs-xs c-text-tertiary">' + smeta.label + ' \u00B7 ' + exp.duration + '</div>';
    h += '</div></div>';
    h += '<div class="c-flex c-flex-gap-1">';
    h += '<button class="c-pointer c-fs-sm c-transition-fast c-bg-transparent c-border-0 c-p-1" style="color:' + (fav ? 'var(--accent-yellow)' : 'var(--text-tertiary)') + '" data-action="vl:toggleFav:' + exp.id + '" title="' + (fav ? 'Unfavorite' : 'Favorite') + '">' + (fav ? '\u2B50' : '\u2606') + '</button>';
    h += '<button class="c-pointer c-fs-sm c-transition-fast c-bg-transparent c-border-0 c-p-1" style="color:' + (bm ? 'var(--accent-cyan)' : 'var(--text-tertiary)') + '" data-action="vl:toggleBm:' + exp.id + '" title="' + (bm ? 'Remove bookmark' : 'Bookmark') + '">\uD83D\uDCD1</button>';
    h += '</div></div>';

    h += '<p class="c-fs-xs c-text-secondary c-m-0" style="margin-bottom:var(--space-3);line-height:1.5;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden">' + _U.sanitizeHTML(exp.description) + '</p>';

    h += '<div class="c-flex c-flex-wrap c-flex-gap-2 c-mb-3">';
    h += '<span class="badge ' + diffBadge(exp.difficulty) + ' c-fs-xs">' + (exp.difficulty || 'medium') + '</span>';
    h += '<span class="c-fs-xs c-text-tertiary" style="padding:2px 8px;background:var(--bg-glass);border-radius:var(--radius-sm)">\u23F1\uFE0F ' + exp.duration + '</span>';
    h += '<span class="c-fs-xs c-text-tertiary" style="padding:2px 8px;background:var(--bg-glass);border-radius:var(--radius-sm)">\uD83C\uDF93 Class ' + exp.subjectClass.join(', ') + '</span>';
    h += '<span class="c-fs-xs c-text-tertiary" style="padding:2px 8px;background:var(--bg-glass);border-radius:var(--radius-sm)">\uD83D\uDCCA ' + exp.labCount + ' experiments</span>';
    h += '</div>';

    h += '<div style="margin-bottom:var(--space-3)">';
    h += '<div class="c-flex-between c-mb-1"><span class="c-fs-xs c-text-tertiary">Progress</span><span class="c-fs-xs c-fw-semibold" style="color:' + (comp ? 'var(--accent-green)' : 'var(--accent-blue)') + '">' + (comp ? '100%' : '0%') + '</span></div>';
    h += '<div style="height:6px;background:var(--bg-glass);border-radius:3px;overflow:hidden">';
    h += '<div style="height:100%;width:' + (comp ? '100' : '0') + '%;background:' + (comp ? 'var(--accent-green)' : smeta.grad) + ';border-radius:3px;transition:width 0.5s ease"></div>';
    h += '</div></div>';

    if (comp) {
      h += '<div class="c-fs-xs c-fw-medium c-mb-2" style="color:var(--accent-green)">\u2705 Completed</div>';
    }
    if (prog.timeSpent > 0) {
      h += '<div class="c-fs-xs c-text-tertiary c-mb-2">\u23F1\uFE0F Time spent: ' + _fmtTime(prog.timeSpent) + '</div>';
    }

    h += '<div class="c-mt-auto">';
    h += '<button class="btn btn-primary btn-sm" style="width:100%" data-action="vl:openLab:' + exp.id + '">' + (comp ? '\uD83D\uDD04 Revisit' : '\uD83D\uDE80 Start Lab') + '</button>';
    h += '</div></div>';
    return h;
  }

  function _renderExperimentView() {
    var mc = document.getElementById('main-content');
    if (!mc) return;
    var exp = _getExp(_state.selectedLab);
    if (!exp) { _backToLabs(); return; }
    var smeta = _subjMeta[exp.subjectId] || _subjMeta.physics;
    var comp = isCompleted(exp.id);

    var tabs = [
      { id: 'aim', icon: '\uD83C\uDFAF', label: 'Aim' },
      { id: 'theory', icon: '\uD83D\uDCD6', label: 'Theory' },
      { id: 'procedure', icon: '\uD83D\uDCCB', label: 'Procedure' },
      { id: 'simulation', icon: '\uD83E\uDDEA', label: 'Simulation' },
      { id: 'observations', icon: '\uD83D\uDCCA', label: 'Observations' },
      { id: 'results', icon: '\uD83C\uDFC6', label: 'Results' },
      { id: 'viva', icon: '\u2753', label: 'Viva' }
    ];

    var h = '<div style="display:flex;height:calc(100vh - var(--header-height) - 40px);overflow:hidden;border-radius:var(--radius-lg);border:1px solid var(--border-color);background:var(--bg-card)">';

    h += '<div style="width:260px;flex-shrink:0;background:var(--bg-secondary);border-right:1px solid var(--border-color);display:flex;flex-direction:column;overflow:hidden">';
    h += '<div class="c-p-3" style="border-bottom:1px solid var(--border-color)">';
    h += '<button class="btn btn-ghost btn-sm c-mb-2" style="width:100%" data-action="vl:backToLabs">\u2190 Back to Labs</button>';
    h += '<div class="c-flex c-flex-gap-2" style="align-items:center;margin-bottom:var(--space-2)">';
    h += '<div style="width:32px;height:32px;border-radius:var(--radius-sm);background:' + smeta.grad + ';display:flex;align-items:center;justify-content:center;font-size:1rem;flex-shrink:0">' + smeta.icon + '</div>';
    h += '<div style="min-width:0"><div class="c-fs-xs c-fw-bold c-text-primary text-truncate">' + _U.sanitizeHTML(exp.title) + '</div>';
    h += '<div class="c-fs-xs c-text-tertiary">' + smeta.label + '</div></div></div>';
    h += '<div class="c-flex c-flex-gap-2 c-flex-wrap">';
    h += '<span class="badge ' + diffBadge(exp.difficulty) + '" style="font-size:10px;padding:2px 8px">' + exp.difficulty + '</span>';
    if (comp) h += '<span class="badge badge-green" style="font-size:10px;padding:2px 8px">\u2705 Done</span>';
    h += '</div></div>';

    h += '<div style="padding:var(--space-2);border-bottom:1px solid var(--border-color)">';
    h += '<div class="c-flex c-flex-gap-2" style="align-items:center">';
    h += '<span style="color:var(--text-tertiary);font-size:var(--text-xs)">\u23F1\uFE0F</span>';
    h += '<span id="vl-timer-display" class="c-fs-sm c-fw-semibold c-text-primary font-mono">' + _fmtTime(_state.timerElapsed) + '</span>';
    h += '</div></div>';

    h += '<div class="c-fs-xs c-fw-semibold c-text-tertiary c-p-3 c-pb-1" style="text-transform:uppercase;letter-spacing:0.5px">Sections</div>';
    h += '<div style="flex:1;overflow-y:auto;padding:0 var(--space-2) var(--space-2)">';
    for (var ti = 0; ti < tabs.length; ti++) {
      var t = tabs[ti];
      var isActive = _state.currentTab === t.id;
      h += '<button class="c-pointer c-flex c-flex-gap-2" style="width:100%;padding:8px 12px;border-radius:var(--radius-sm);border:none;background:' + (isActive ? 'rgba(59,130,246,0.12)' : 'transparent') + ';color:' + (isActive ? 'var(--accent-blue)' : 'var(--text-secondary)') + ';font-size:var(--text-sm);font-weight:' + (isActive ? '600' : '500') + ';text-align:left;cursor:pointer;transition:all 0.2s ease;margin-bottom:2px" data-action="vl:tab:' + t.id + '">' + t.icon + ' ' + t.label + '</button>';
    }
    h += '</div>';

    h += '<div class="c-p-3" style="border-top:1px solid var(--border-color)">';
    h += '<div class="c-fs-xs c-text-tertiary c-mb-2">Quick Actions</div>';
    h += '<button class="btn btn-sm" style="width:100%;margin-bottom:6px;background:var(--bg-glass);border:1px solid var(--border-color);color:var(--text-secondary);font-size:var(--text-xs)" data-action="vl:downloadReport">\u2B07\uFE0F Download Report</button>';
    h += '<button class="btn btn-sm" style="width:100%;margin-bottom:6px;background:var(--bg-glass);border:1px solid var(--border-color);color:var(--text-secondary);font-size:var(--text-xs)" data-action="vl:toggleFav:' + exp.id + '">' + (isFavorite(exp.id) ? '\u2B50 Unfavorite' : '\u2606 Favorite') + '</button>';
    h += '<button class="btn btn-sm" style="width:100%;background:var(--bg-glass);border:1px solid var(--border-color);color:var(--text-secondary);font-size:var(--text-xs)" data-action="vl:toggleBm:' + exp.id + '">' + (isBookmarked(exp.id) ? '\uD83D\uDCD1 Unbookmark' : '\uD83D\uDCD1 Bookmark') + '</button>';
    h += '</div></div>';

    h += '<div style="flex:1;display:flex;flex-direction:column;overflow:hidden">';
    h += '<div class="c-p-4" style="border-bottom:1px solid var(--border-color);flex-shrink:0">';
    h += '<div class="c-flex-between c-flex-wrap" style="gap:var(--space-2)">';
    h += '<div><h3 class="c-fs-base c-fw-bold c-text-primary c-m-0">' + tabs.find(function(t) { return t.id === _state.currentTab; }).icon + ' ' + tabs.find(function(t) { return t.id === _state.currentTab; }).label + '</h3>';
    h += '<div class="c-fs-xs c-text-tertiary c-mt-1">' + _U.sanitizeHTML(exp.objective) + '</div></div>';
    h += '<div class="c-flex c-flex-gap-2">';
    if (!comp) {
      h += '<button class="btn btn-primary btn-sm" data-action="vl:complete">\u2705 Mark Complete</button>';
    } else {
      h += '<span class="badge badge-green" style="font-size:var(--text-xs)">\u2705 Experiment Complete</span>';
    }
    h += '<button class="btn btn-ghost btn-sm" data-action="vl:resetSim">\u21BA Reset</button>';
    h += '</div></div></div>';

    h += '<div class="c-p-4" style="flex:1;overflow-y:auto">';

    if (_state.currentTab === 'aim') h += _tabAim(exp, smeta);
    else if (_state.currentTab === 'theory') h += _tabTheory(exp, smeta);
    else if (_state.currentTab === 'procedure') h += _tabProcedure(exp);
    else if (_state.currentTab === 'simulation') h += _tabSimulation(exp, smeta);
    else if (_state.currentTab === 'observations') h += _tabObservations(exp);
    else if (_state.currentTab === 'results') h += _tabResults(exp);
    else if (_state.currentTab === 'viva') h += _tabViva(exp);

    h += '</div></div></div>';

    mc.innerHTML = h;
    mc.style.opacity = '0';
    mc.style.transition = 'opacity 0.3s ease';
    setTimeout(function() { mc.style.opacity = '1'; }, 50);
  }

  function _tabAim(exp, meta) {
    var h = '';
    h += '<div class="glass-card c-p-5 c-mb-4">';
    h += '<div class="c-flex c-flex-gap-3 c-mb-4" style="align-items:center">';
    h += '<div style="width:64px;height:64px;border-radius:var(--radius-lg);background:' + meta.grad + ';display:flex;align-items:center;justify-content:center;font-size:2rem;box-shadow:0 6px 20px ' + meta.color + '33">' + meta.icon + '</div>';
    h += '<div><div class="c-fs-xl c-fw-bold c-text-primary">' + _U.sanitizeHTML(exp.title) + '</div>';
    h += '<div class="c-fs-sm c-text-secondary c-mt-1">' + meta.label + ' \u00B7 ' + exp.duration + ' \u00B7 Class ' + exp.subjectClass.join(', ') + '</div></div></div>';
    h += '<div class="c-fs-sm c-text-primary" style="line-height:1.7">' + _U.sanitizeHTML(exp.description) + '</div></div>';

    h += '<div class="c-grid" style="grid-template-columns:1fr 1fr;gap:var(--space-4)">';
    h += '<div class="glass-card c-p-4"><div class="c-fs-sm c-fw-bold c-text-primary c-mb-3">\uD83C\uDFAF Objective</div>';
    h += '<div class="c-fs-sm c-text-secondary" style="line-height:1.6">' + _U.sanitizeHTML(exp.objective) + '</div></div>';

    h += '<div class="glass-card c-p-4"><div class="c-fs-sm c-fw-bold c-text-primary c-mb-3">\uD83E\uDDE9 Materials Required</div>';
    h += '<div class="c-flex c-flex-wrap c-flex-gap-2">';
    for (var mi = 0; mi < exp.materials.length; mi++) {
      h += '<span class="c-fs-xs c-text-secondary" style="padding:4px 10px;background:var(--bg-glass);border-radius:var(--radius-sm);border:1px solid var(--border-color)">\u2022 ' + _U.sanitizeHTML(exp.materials[mi]) + '</span>';
    }
    h += '</div></div></div>';

    if (exp.safetyInstructions) {
      h += '<div class="glass-card c-p-4 c-mt-4" style="border:1px solid rgba(245,158,11,0.2);background:rgba(245,158,11,0.05)">';
      h += '<div class="c-fs-sm c-fw-bold c-text-warning c-mb-2">\u26A0\uFE0F Safety Instructions</div>';
      h += '<ul class="c-m-0" style="padding-left:var(--space-4)">';
      for (var si = 0; si < exp.safetyInstructions.length; si++) {
        h += '<li class="c-fs-xs c-text-secondary c-mb-1">' + _U.sanitizeHTML(exp.safetyInstructions[si]) + '</li>';
      }
      h += '</ul></div>';
    }
    return h;
  }

  function _tabTheory(exp, meta) {
    var h = '<div class="glass-card c-p-5 c-mb-4">';
    h += '<div class="c-fs-sm c-fw-bold c-text-primary c-mb-3">\uD83D\uDCD6 Theory</div>';
    h += '<div class="c-fs-sm c-text-secondary" style="line-height:1.8">';
    h += '<p class="c-mb-3">This experiment demonstrates fundamental principles in <strong>' + meta.label + '</strong>. ' + _U.sanitizeHTML(exp.description) + '</p>';
    h += '<p class="c-mb-3"><strong>Key Concept:</strong> ' + _U.sanitizeHTML(exp.objective) + '</p>';
    h += '<p>The procedure involves systematic observation and measurement to verify the theoretical principles. Careful recording of data and analysis of results leads to a deeper understanding of the underlying science.</p>';
    h += '</div></div>';

    h += '<div class="glass-card c-p-4 c-mb-4">';
    h += '<div class="c-fs-sm c-fw-bold c-text-primary c-mb-2">\uD83C\uDFAF Learning Outcomes</div>';
    h += '<ul style="padding-left:var(--space-4);margin:0">';
    h += '<li class="c-fs-sm c-text-secondary c-mb-2">Understand the theoretical basis of ' + meta.label.toLowerCase() + ' principles</li>';
    h += '<li class="c-fs-sm c-text-secondary c-mb-2">Develop practical laboratory skills</li>';
    h += '<li class="c-fs-sm c-text-secondary c-mb-2">Analyze experimental data and draw conclusions</li>';
    h += '<li class="c-fs-sm c-text-secondary c-mb-2">Connect theory with practical observations</li>';
    h += '</ul></div>';

    h += '<div class="glass-card c-p-4">';
    h += '<div class="c-fs-sm c-fw-bold c-text-primary c-mb-2">\uD83D\uDCA1 Key Points</div>';
    for (var oi = 0; oi < exp.observations.length; oi++) {
      h += '<div class="c-flex c-flex-gap-2 c-mb-2" style="align-items:flex-start">';
      h += '<span style="color:' + meta.color + ';font-size:var(--text-sm)">&#9679;</span>';
      h += '<span class="c-fs-sm c-text-secondary">' + _U.sanitizeHTML(exp.observations[oi]) + '</span></div>';
    }
    h += '</div>';
    return h;
  }

  function _tabProcedure(exp) {
    var h = '<div class="c-fs-sm c-fw-bold c-text-primary c-mb-4">\uD83D\uDCCB Procedure \u2014 Step ' + (_state.currentStep + 1) + ' of ' + exp.procedure.length + '</div>';

    h += '<div style="position:relative;padding-left:24px">';
    for (var pi = 0; pi < exp.procedure.length; pi++) {
      var isCurrent = pi === _state.currentStep;
      var isDone = pi < _state.currentStep;
      var lineColor = isCurrent ? 'var(--accent-blue)' : isDone ? 'var(--accent-green)' : 'var(--border-color)';
      var dotColor = isCurrent ? 'var(--accent-blue)' : isDone ? 'var(--accent-green)' : 'var(--text-tertiary)';
      h += '<div class="c-mb-4" style="position:relative">';
      h += '<div style="position:absolute;left:-24px;top:4px;width:12px;height:12px;border-radius:50%;background:' + dotColor + ';border:2px solid ' + (isCurrent ? 'var(--accent-blue)' : isDone ? 'var(--accent-green)' : 'var(--bg-card)') + ';z-index:1"></div>';
      if (pi < exp.procedure.length - 1) {
        h += '<div style="position:absolute;left:-19px;top:18px;width:2px;height:calc(100% + 8px);background:' + lineColor + '"></div>';
      }
      h += '<div style="padding:12px 16px;border-radius:var(--radius-md);background:' + (isCurrent ? 'rgba(59,130,246,0.08)' : isDone ? 'rgba(16,185,129,0.05)' : 'transparent') + ';border:1px solid ' + (isCurrent ? 'rgba(59,130,246,0.2)' : 'transparent') + '">';
      h += '<div class="c-flex-between" style="align-items:flex-start">';
      h += '<div><span class="c-fs-xs c-fw-semibold" style="color:' + dotColor + '">Step ' + (pi + 1) + '</span>';
      h += '<div class="c-fs-sm c-text-primary c-mt-1">' + _U.sanitizeHTML(exp.procedure[pi]) + '</div></div>';
      if (isDone) h += '<span class="c-fs-sm">\u2705</span>';
      if (isCurrent) h += '<span class="badge badge-blue" style="font-size:10px;padding:2px 8px">Current</span>';
      h += '</div></div></div>';
    }
    h += '</div>';

    h += '<div class="c-flex c-flex-gap-2 c-mt-4">';
    h += '<button class="btn btn-secondary btn-sm" data-action="vl:prevStep" ' + (_state.currentStep === 0 ? 'disabled style="opacity:0.5;pointer-events:none"' : '') + '>\u25C0 Previous</button>';
    h += '<button class="btn btn-primary btn-sm" data-action="vl:nextStep" ' + (_state.currentStep >= exp.procedure.length - 1 ? 'disabled style="opacity:0.5;pointer-events:none"' : '') + '>Next Step \u25B6</button>';
    h += '</div>';
    return h;
  }

  function _tabSimulation(exp, meta) {
    var running = _state.simRunning;
    var paused = _state.simPaused;

    var h = '<div class="c-bg-glass c-radius-lg c-border c-p-4 c-mb-4" style="position:relative;overflow:hidden;min-height:350px">';
    h += '<div class="c-absolute c-inset-0" style="background:radial-gradient(circle at 50% 50%,' + meta.color + '08,transparent);pointer-events:none"></div>';
    h += '<div class="c-relative c-text-center">';
    h += '<div class="c-fs-sm c-fw-bold c-text-primary c-mb-2">\uD83C\uDF1F Interactive Simulation</div>';
    h += '<div class="c-fs-xs c-text-secondary c-mb-4">' + _U.sanitizeHTML(exp.title) + '</div>';

    h += '<div style="width:120px;height:120px;border-radius:var(--radius-xl);background:' + meta.grad + ';display:flex;align-items:center;justify-content:center;font-size:3.5rem;margin:0 auto var(--space-4);box-shadow:0 8px 30px ' + meta.color + '33;transition:all 0.3s ease;' + (running && !paused ? 'animation:pulse 2s infinite' : '') + '">' + meta.icon + '</div>';

    h += '<div class="c-grid c-mb-4" style="grid-template-columns:repeat(4,1fr);gap:var(--space-3)">';
    var stats = [
      { label: 'Status', value: running ? (paused ? 'Paused' : 'Running') : 'Idle', color: running ? (paused ? 'var(--accent-yellow)' : 'var(--accent-green)') : 'var(--text-tertiary)' },
      { label: 'Voltage', value: running ? '12.4V' : '0V', color: 'var(--accent-blue)' },
      { label: 'Current', value: running ? '1.24A' : '0A', color: 'var(--accent-cyan)' },
      { label: 'Power', value: running ? '15.4W' : '0W', color: 'var(--accent-purple)' }
    ];
    for (var si = 0; si < stats.length; si++) {
      h += '<div class="c-bg-card c-radius-md c-border c-p-3 c-text-center">';
      h += '<div class="c-fs-xs c-text-tertiary c-fw-medium">' + stats[si].label + '</div>';
      h += '<div class="c-fs-sm c-fw-bold c-mt-1" style="color:' + stats[si].color + '">' + stats[si].value + '</div></div>';
    }
    h += '</div>';

    h += '<div class="c-bg-card c-radius-md c-border c-p-3 c-mb-4 c-text-left">';
    h += '<div class="c-fs-xs c-fw-semibold c-text-secondary c-mb-2">\uD83D\uDCA1 Current: Step ' + (_state.currentStep + 1) + '</div>';
    h += '<div class="c-fs-sm c-text-primary">' + _U.sanitizeHTML(exp.procedure[_state.currentStep]) + '</div></div>';

    h += '<div class="c-grid c-mb-4" style="grid-template-columns:1fr 1fr;gap:var(--space-3)">';
    h += '<div class="c-bg-card c-radius-md c-border c-p-3">';
    h += '<div class="c-fs-xs c-text-tertiary c-mb-2">\uD83D\uDD04 Speed Control</div>';
    h += '<input type="range" min="0" max="100" value="50" style="width:100%;accent-color:' + meta.color + '" data-action="vl:setSpeed">';
    h += '<div class="c-flex-between c-mt-1"><span class="c-fs-xs c-text-tertiary">Slow</span><span class="c-fs-xs c-text-tertiary">Fast</span></div></div>';
    h += '<div class="c-bg-card c-radius-md c-border c-p-3">';
    h += '<div class="c-fs-xs c-text-tertiary c-mb-2">\uD83D\uDD06 Intensity</div>';
    h += '<input type="range" min="0" max="100" value="75" style="width:100%;accent-color:' + meta.color + '" data-action="vl:setIntensity">';
    h += '<div class="c-flex-between c-mt-1"><span class="c-fs-xs c-text-tertiary">Low</span><span class="c-fs-xs c-text-tertiary">High</span></div></div></div>';

    h += '<div class="c-flex-center c-flex-gap-3">';
    h += '<button class="btn btn-primary btn-sm" data-action="vl:toggleSim">' + (running ? '\u23F8\uFE0F Pause' : '\u25B6\uFE0F Start') + '</button>';
    h += '<button class="btn btn-secondary btn-sm" data-action="vl:pauseSim" ' + (!running ? 'disabled style="opacity:0.5;pointer-events:none"' : '') + '>' + (paused ? '\u25B6\uFE0F Resume' : '\u23F8\uFE0F Pause') + '</button>';
    h += '<button class="btn btn-ghost btn-sm" data-action="vl:resetSim">\u21BA Reset</button>';
    h += '</div></div></div>';

    if (exp.materials) {
      h += '<div class="glass-card c-p-4"><div class="c-fs-xs c-fw-bold c-text-tertiary c-mb-2">\uD83D\uDCE6 Materials</div>';
      h += '<div class="c-flex c-flex-wrap c-flex-gap-2">';
      for (var mi = 0; mi < exp.materials.length; mi++) {
        h += '<span class="c-fs-xs c-text-secondary" style="padding:4px 10px;background:var(--bg-glass);border-radius:var(--radius-sm);border:1px solid var(--border-color)">' + _U.sanitizeHTML(exp.materials[mi]) + '</span>';
      }
      h += '</div></div>';
    }
    return h;
  }

  function _tabObservations(exp) {
    var h = '<div class="c-fs-sm c-fw-bold c-text-primary c-mb-4">\uD83D\uDCCA Observations & Data Recording</div>';

    h += '<div class="glass-card c-p-4 c-mb-4 c-overflow-auto">';
    h += '<table class="c-w-full" style="border-collapse:collapse">';
    h += '<thead><tr>';
    h += '<th class="c-fs-xs c-text-tertiary c-fw-semibold c-p-2 c-px-3" style="border-bottom:2px solid var(--border-color);text-align:left">S.No.</th>';
    h += '<th class="c-fs-xs c-text-tertiary c-fw-semibold c-p-2 c-px-3" style="border-bottom:2px solid var(--border-color);text-align:left">Observation</th>';
    h += '<th class="c-fs-xs c-text-tertiary c-fw-semibold c-p-2 c-px-3" style="border-bottom:2px solid var(--border-color);text-align:left">Expected Value</th>';
    h += '<th class="c-fs-xs c-text-tertiary c-fw-semibold c-p-2 c-px-3" style="border-bottom:2px solid var(--border-color);text-align:left">Your Reading</th>';
    h += '</tr></thead><tbody>';
    for (var oi = 0; oi < exp.observations.length; oi++) {
      h += '<tr>';
      h += '<td class="c-fs-xs c-text-secondary c-p-2 c-px-3" style="border-bottom:1px solid var(--border-color)">' + (oi + 1) + '</td>';
      h += '<td class="c-fs-xs c-text-primary c-p-2 c-px-3" style="border-bottom:1px solid var(--border-color)">' + _U.sanitizeHTML(exp.observations[oi]) + '</td>';
      h += '<td class="c-fs-xs c-text-secondary c-p-2 c-px-3" style="border-bottom:1px solid var(--border-color)">As per theory</td>';
      h += '<td class="c-p-2 c-px-3" style="border-bottom:1px solid var(--border-color)"><input type="text" class="input-field" placeholder="Enter value..." style="width:100%;padding:4px 8px;font-size:var(--text-xs)" data-action="vl:obsInput:' + oi + '"></td>';
      h += '</tr>';
    }
    h += '</tbody></table></div>';

    h += '<div class="glass-card c-p-4">';
    h += '<div class="c-fs-xs c-fw-bold c-text-tertiary c-mb-2">\uD83D\uDCDD Lab Notes</div>';
    h += '<textarea class="input-field c-w-full" placeholder="Record your observations, anomalies, and thoughts here..." style="min-height:100px;resize:vertical" data-action="vl:labNotes"></textarea>';
    h += '</div>';
    return h;
  }

  function _tabResults(exp) {
    var comp = isCompleted(exp.id);
    var h = '<div class="c-fs-sm c-fw-bold c-text-primary c-mb-4">\uD83C\uDFC6 Results & Analysis</div>';

    h += '<div class="glass-card c-p-5 c-mb-4" style="border:1px solid rgba(16,185,129,0.2);background:rgba(16,185,129,0.05)">';
    h += '<div class="c-fs-sm c-fw-bold c-text-success c-mb-2">\u2705 Experimental Result</div>';
    h += '<div class="c-fs-sm c-text-primary" style="line-height:1.7">' + _U.sanitizeHTML(exp.result) + '</div></div>';

    h += '<div class="c-grid c-mb-4" style="grid-template-columns:1fr 1fr;gap:var(--space-4)">';
    h += '<div class="glass-card c-p-4"><div class="c-fs-xs c-fw-bold c-text-tertiary c-mb-3">\uD83C\uDFAF Key Findings</div>';
    for (var oi = 0; oi < Math.min(exp.observations.length, 4); oi++) {
      h += '<div class="c-flex c-flex-gap-2 c-mb-2" style="align-items:flex-start">';
      h += '<span style="color:var(--accent-green);font-size:var(--text-sm)">&#10003;</span>';
      h += '<span class="c-fs-xs c-text-secondary">' + _U.sanitizeHTML(exp.observations[oi]) + '</span></div>';
    }
    h += '</div>';

    h += '<div class="glass-card c-p-4"><div class="c-fs-xs c-fw-bold c-text-tertiary c-mb-3">\uD83D\uDCCA Score Summary</div>';
    var vivaTotal = exp.vivaQuestions.length;
    var vivaCorrect = 0;
    for (var vi = 0; vi < vivaTotal; vi++) { if (_state.vivaAnswers[vi] && _state.vivaAnswers[vi].correct) vivaCorrect++; }
    var scoreItems = [
      { label: 'Experiment Status', value: comp ? '\u2705 Complete' : '\u23F3 In Progress', color: comp ? 'var(--accent-green)' : 'var(--accent-yellow)' },
      { label: 'Viva Score', value: vivaCorrect + '/' + vivaTotal, color: 'var(--accent-blue)' },
      { label: 'Time Spent', value: _fmtTime(_state.timerElapsed), color: 'var(--accent-purple)' },
      { label: 'Overall', value: comp ? 'Passed' : 'In Progress', color: comp ? 'var(--accent-green)' : 'var(--accent-yellow)' }
    ];
    for (var si = 0; si < scoreItems.length; si++) {
      h += '<div class="c-flex-between c-py-2" style="border-bottom:1px solid var(--border-color)">';
      h += '<span class="c-fs-xs c-text-secondary">' + scoreItems[si].label + '</span>';
      h += '<span class="c-fs-xs c-fw-semibold" style="color:' + scoreItems[si].color + '">' + scoreItems[si].value + '</span></div>';
    }
    h += '</div></div>';

    if (exp.teacherNotes) {
      h += '<div class="glass-card c-p-4" style="background:rgba(59,130,246,0.05);border:1px solid rgba(59,130,246,0.15)">';
      h += '<div class="c-fs-xs c-fw-bold c-text-accent c-mb-2">\uD83D\uDCD6 Teacher\'s Notes</div>';
      h += '<div class="c-fs-xs c-text-secondary" style="line-height:1.6">' + _U.sanitizeHTML(exp.teacherNotes) + '</div></div>';
    }
    return h;
  }

  function _tabViva(exp) {
    var answered = 0;
    var correct = 0;
    for (var ai = 0; ai < exp.vivaQuestions.length; ai++) {
      if (_state.vivaAnswers[ai]) {
        answered++;
        if (_state.vivaAnswers[ai].correct) correct++;
      }
    }

    var h = '<div class="c-fs-sm c-fw-bold c-text-primary c-mb-3">\u2753 Viva Voce</div>';
    h += '<div class="c-flex c-flex-gap-3 c-mb-4">';
    h += '<div class="stat-card c-p-3" style="flex:1;min-width:80px;text-align:center"><div class="stat-card-value c-fs-lg">' + answered + '/' + exp.vivaQuestions.length + '</div><div class="stat-card-label">Answered</div></div>';
    h += '<div class="stat-card c-p-3" style="flex:1;min-width:80px;text-align:center"><div class="stat-card-value c-fs-lg" style="color:var(--accent-green)">' + correct + '</div><div class="stat-card-label">Correct</div></div>';
    h += '<div class="stat-card c-p-3" style="flex:1;min-width:80px;text-align:center"><div class="stat-card-value c-fs-lg" style="color:var(--accent-red)">' + (answered - correct) + '</div><div class="stat-card-label">Incorrect</div></div>';
    h += '</div>';

    for (var qi = 0; qi < exp.vivaQuestions.length; qi++) {
      var q = exp.vivaQuestions[qi];
      var ans = _state.vivaAnswers[qi];
      var isAnswered = !!ans;

      h += '<div class="glass-card c-p-4 c-mb-3" style="border-left:3px solid ' + (isAnswered ? (ans.correct ? 'var(--accent-green)' : 'var(--accent-red)') : 'var(--border-color)') + '">';
      h += '<div class="c-fs-sm c-fw-semibold c-text-primary c-mb-3">Q' + (qi + 1) + ': ' + _U.sanitizeHTML(q.q) + '</div>';

      for (var oi = 0; oi < q.opts.length; oi++) {
        var optBg = 'var(--bg-glass)';
        var optBorder = 'var(--border-color)';
        var optColor = 'var(--text-secondary)';
        if (isAnswered) {
          if (oi === q.correct) { optBg = 'rgba(16,185,129,0.12)'; optBorder = 'var(--accent-green)'; optColor = 'var(--accent-green)'; }
          else if (oi === ans.selected && !ans.correct) { optBg = 'rgba(239,68,68,0.12)'; optBorder = 'var(--accent-red)'; optColor = 'var(--accent-red)'; }
        }
        var cursor = isAnswered ? 'default' : 'pointer';
        h += '<div class="c-pointer c-fs-sm c-radius-sm c-mb-2" style="padding:10px 14px;background:' + optBg + ';border:1px solid ' + optBorder + ';color:' + optColor + ';cursor:' + cursor + ';transition:all 0.2s ease" ' + (isAnswered ? '' : 'data-action="vl:viva:' + qi + ':' + oi + '"') + '>';
        h += '<span class="c-fw-medium" style="margin-right:8px;color:var(--text-tertiary)">' + String.fromCharCode(65 + oi) + '.</span> ' + _U.sanitizeHTML(q.opts[oi]);
        if (isAnswered && oi === q.correct) h += ' <span style="float:right">\u2705</span>';
        if (isAnswered && oi === ans.selected && !ans.correct) h += ' <span style="float:right">\u274C</span>';
        h += '</div>';
      }
      h += '</div>';
    }

    if (answered === exp.vivaQuestions.length) {
      h += '<div class="c-flex-center c-flex-gap-3 c-mt-4 c-p-4" style="background:rgba(16,185,129,0.08);border-radius:var(--radius-lg);border:1px solid rgba(16,185,129,0.2)">';
      h += '<span class="c-fs-xl">\uD83C\uDF89</span>';
      h += '<div><div class="c-fs-sm c-fw-bold c-text-success">All questions answered!</div>';
      h += '<div class="c-fs-xs c-text-secondary">Score: ' + correct + '/' + exp.vivaQuestions.length + ' (' + Math.round((correct / exp.vivaQuestions.length) * 100) + '%)</div></div></div>';
    }
    return h;
  }

  // === EVENT DELEGATION ===

  document.addEventListener('click', function(e) {
    var t = e.target.closest('[data-action]');
    if (!t) return;
    var action = t.getAttribute('data-action');
    if (!action || action.indexOf('vl:') !== 0) return;
    var parts = action.split(':');
    var cmd = parts[1];
    var arg = parts[2];
    var arg2 = parts[3];

    switch (cmd) {
      case 'selectClass': if (arg) _selectClass(arg); break;
      case 'selectSubject': if (arg) _selectSubject(arg); break;
      case 'backToSubjects': _backToSubjects(); break;
      case 'backToLabs': _backToLabs(); break;
      case 'openLab': if (arg) _openLab(arg); break;
      case 'tab': if (arg) _switchTab(arg); break;
      case 'nextStep': _incStep(); break;
      case 'prevStep': _decStep(); break;
      case 'complete': _completeExperiment(); break;
      case 'toggleSim': _toggleSim(); break;
      case 'pauseSim': _pauseSim(); break;
      case 'resetSim': _resetSim(); break;
      case 'toggleFav': if (arg) toggleFavorite(arg); break;
      case 'toggleBm': if (arg) toggleBookmark(arg); break;
      case 'downloadReport': _downloadReport(); break;
      case 'filterDiff': if (arg) { _state.filterDifficulty = _state.filterDifficulty === arg ? '' : arg; _rerender(); } break;
      case 'filterFav': _state.showFavoritesOnly = !_state.showFavoritesOnly; _rerender(); break;
      case 'filterComp': _state.showCompletedOnly = !_state.showCompletedOnly; _rerender(); break;
      case 'clearFilters': _state.filterDifficulty = ''; _state.showFavoritesOnly = false; _state.showCompletedOnly = false; _state.searchQuery = ''; _rerender(); break;
      case 'viva': if (arg !== undefined && arg2 !== undefined) _submitViva(parseInt(arg), parseInt(arg2)); break;
      case 'search':
        var inp = document.getElementById('vl-search');
        if (inp) { _state.searchQuery = inp.value; _rerender(); }
        break;
    }
  });

  document.addEventListener('input', function(e) {
    if (e.target && e.target.getAttribute && e.target.getAttribute('data-action') === 'vl:search') {
      _state.searchQuery = e.target.value;
      _rerender();
    }
  });

  document.addEventListener('keydown', function(e) {
    if (e.target && e.target.getAttribute && e.target.getAttribute('data-action') === 'vl:search' && e.key === 'Enter') {
      _state.searchQuery = e.target.value;
      _rerender();
    }
  });

  // === PUBLIC RENDER ===

  window.renderPage.virtualLabs = function(params) {
    var mc = document.getElementById('main-content');
    if (!mc) return;
    _state.view = 'subjects';
    _state.selectedClass = '';
    _state.selectedSubject = '';
    _state.selectedLab = null;
    _stopTimer();
    _renderSubjectGrid();
  };

  window.renderPage.virtualLab = function(params) {
    var mc = document.getElementById('main-content');
    if (!mc) return;
    if (params && params.id) {
      _openLab(params.id);
    } else {
      window.renderPage.virtualLabs();
    }
  };

})();
