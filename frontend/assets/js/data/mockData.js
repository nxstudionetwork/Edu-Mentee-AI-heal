(function() {
  var MALE_NAMES = ['Aarav','Vihaan','Vivaan','Advik','Kabir','Arjun','Rohan','Ayaan','Ishaan','Shaurya','Yash','Raj','Aditya','Krishna','Varun','Abhinav','Pranav','Harsh','Karan','Nikhil','Rahul','Ravi','Sameer','Manoj','Suresh','Deepak','Vijay','Sanjay','Amit','Anil','Ashok','Ramesh','Rajesh','Sunil','Arvind','Shyam','Dinesh','Mahesh','Jatin','Vikas','Gaurav','Pradeep','Sandeep','Naveen','Tarun','Alok','Mohit','Vivek','Akash','Dhruv','Kartik'];
  var FEMALE_NAMES = ['Priya','Ananya','Kavita','Sneha','Pooja','Neha','Deepa','Meera','Radhika','Shreya','Divya','Nandini','Aishwarya','Vaishali','Swati','Pallavi','Shweta','Anjali','Ritu','Sapna','Jyoti','Manisha','Sunita','Rekha','Asha','Lata','Usha','Geeta','Seema','Arti','Neelam','Smita','Nita','Rashmi','Madhu','Archana','Shobha','Kamla','Sudha','Reena','Poonam','Anita','Shalini','Bhavna','Vandana','Laxmi','Sushma','Namrata','Karishma','Ishita','Tanya','Riya','Komal','Preeti','Nidhi','Garima','Kiran','Bhavna','Rupali','Shilpa','Maya','Tara','Gita','Kala','Sita','Rama','Lalita','Anju','Babita','Chhaya','Deepali','Esha','Falguni','Hema','Isha','Jaya','Kamini','Lata','Madhuri','Naina','Ojaswita','Parul','Qamar','Roshni','Sakshi','Tripti','Uma','Varsha','Yamini','Zara'];
  var LAST_NAMES = ['Sharma','Patel','Verma','Gupta','Singh','Reddy','Nair','Joshi','Iyer','Mehta','Kumar','Thakur','Menon','Desai','Choudhury','Mishra','Pandey','Rajput','Yadav','Tiwari','Saxena','Chauhan','Dwivedi','Bhatia','Kapoor','Malhotra','Bajaj','Khanna','Arora','Agarwal','Jain','Shah','Jha','Sinha','Das','Ghosh','Banerjee','Mukherjee','Chatterjee','Bose','Sen','Roy','Chakraborty','Dutta','Saha','Kaur','Gill','Bhat','Wani','Patil','Kulkarni','Srinivasan','Pillai','Rao','Naidu','Murthy','Rajan','Venkatesh','Iyengar','Raghavan','Subramanian','Acharya','Bhargava','Chopra','Dhawan','Gandhi','Hegde','Kulkarni','Luthra','Mangeshkar','Narang','Parekh','Qureshi','Rattan','Sachdev','Talwar','Upadhyay','Vohra','Wagh','Zachariah'];
  var CITIES = ['Mumbai','Delhi','Bangalore','Hyderabad','Chennai','Kolkata','Pune','Ahmedabad','Jaipur','Lucknow','Surat','Chandigarh','Bhopal','Indore','Nagpur','Patna','Ranchi','Bhubaneswar','Guwahati','Dehradun','Varanasi','Agra','Amritsar','Ludhiana','Visakhapatnam','Coimbatore','Kochi','Thiruvananthapuram','Mysore','Udaipur'];
  var STATES = ['Maharashtra','Delhi','Karnataka','Telangana','Tamil Nadu','West Bengal','Gujarat','Rajasthan','Uttar Pradesh','Madhya Pradesh','Bihar','Jharkhand','Odisha','Assam','Uttarakhand','Punjab','Andhra Pradesh','Kerala','Haryana','Himachal Pradesh'];
  var SCHOOLS = ['Delhi Public School','Kendriya Vidyalaya','St. Xavier School','DAV Public School','Ryan International','St. Joseph School','Bishop Cotton School','Springdales School','Modern School','National Public School','Birla Public School','Army Public School','Navodaya Vidyalaya','Chinmaya Vidyalaya','St. Paul School','Mount Carmel School','Don Bosco School','Jawahar Navodaya Vidyalaya','The Shri Ram School','Vidyashilp Academy'];
  var BOARDS = ['CBSE','ICSE','State Board'];
  var CHANNELS = ['Khan Academy','Physics Wallah','Unacademy','BYJUS','Vedantu','CodeWithHarry','Neso Academy','Crash Course','TED-Ed','freeCodeCamp','Magnet Brains','Learnohub','Let Crack It','Physics Galaxy','MathonGo','Apna Teacher','Professor Dave','Fireship','Academind','Great Learning'];
  var INSTRUCTORS = ['Dr. Meera Joshi','Prof. Anil Kumar','Ms. Sunita Reddy','Mr. Rajesh Verma','Dr. Alok Sharma','Prof. Kavita Singh','Mr. Rohan Gupta','Ms. Priya Patel','Dr. Vikram Desai','Prof. Sneha Iyer','Mr. Manish Thakur','Ms. Deepa Menon','Dr. Aditya Verma','Prof. Neha Kapoor','Mr. Sameer Nair','Ms. Ananya Choudhury','Dr. Karan Mehta','Prof. Vaishali Saxena','Mr. Abhinav Bajaj','Ms. Shreya Kulkarni','Dr. Vivek Joshi','Prof. Pooja Malhotra','Mr. Rahul Khanna','Ms. Divya Bhatt','Dr. Arjun Arora','Prof. Nandini Jain','Mr. Jatin Agarwal','Ms. Ishita Shah'];
  var AUTHORS = ['R.D. Sharma','H.C. Verma','S.L. Loney','I.E. Irodov','O.P. Tandon','P. Bahadur','Trueman','Pradeep','Nelson','Halliday','Resnick','Morrison','Boyle','Laxmi','S. Chand','R.S. Aggarwal','M.L. Aggarwal','R.K. Bansal','D.C. Pandey','Arihant'];
  var PUBLISHERS = ['NCERT','S. Chand','Laxmi Publications','Arihant','Pradeep Publications','Oxford University Press','Cambridge University Press','Pearson','McGraw Hill','PHI Learning','Vikas Publishing','New Age International','Tata McGraw Hill','Rastogi Publications'];

  function pick(a) { return a[Math.floor(Math.random() * a.length)]; }
  function rand(m, n) { return Math.floor(Math.random() * (n - m + 1)) + m; }
  function randDate() { var d = new Date(); d.setDate(d.getDate() - rand(0, 365)); return d.toISOString().split('T')[0]; }
  function randDateTime() { var d = new Date(); d.setDate(d.getDate() - rand(0, 90)); return d.toISOString(); }

  var CHAPTER_NAMES = {
    's1': ['Knowing Our Numbers','Whole Numbers','Playing with Numbers','Basic Geometrical Ideas','Understanding Elementary Shapes','Integers','Fractions','Decimals','Data Handling','Mensuration','Algebra','Ratio and Proportion'],
    's2': ['Food: Where Does It Come From','Components of Food','Fibre to Fabric','Sorting Materials into Groups','Separation of Substances','Changes Around Us','Getting to Know Plants','Body Movements','The Living Organisms and Their Surroundings','Motion and Measurement of Distances'],
    's3': ['A Tale of Two Birds','The Friendly Mongoose','The Shepherd Treasure','The Old-Clock Shop','Tansen','The Monkey and the Crocodile','The Wonder Called Sleep','A Pact with the Sun'],
    's4': ['The Earth in the Solar System','Globe: Latitudes and Longitudes','Motions of the Earth','Maps','Major Domains of the Earth','Major Landforms of the Earth','Our Country India','India: Climate, Vegetation and Wildlife'],
    's5': ['Integers','Fractions and Decimals','Data Handling','Simple Equations','Lines and Angles','The Triangle and its Properties','Congruence of Triangles','Comparing Quantities','Rational Numbers','Practical Geometry','Perimeter and Area','Algebraic Expressions','Exponents and Powers','Symmetry'],
    's6': ['Nutrition in Plants','Nutrition in Animals','Fibre to Fabric','Heat','Acids, Bases and Salts','Physical and Chemical Changes','Weather, Climate and Adaptations','Winds, Storms and Cyclones','Soil','Respiration in Organisms','Transportation in Animals and Plants','Reproduction in Plants'],
    's7': ['The Tiny Teacher','Bringing Up Kari','The Desert','The Cop and the Anthem','Golu Grows a Nose','I Want Something in a Cage','Chandni','The Bear Story','A Tiger in the House','An Alien Hand'],
    's8': ['How, When and Where','From Trade to Territory','Ruling the Countryside','Tribals, Dikus and the Vision','When People Rebel','Colonialism and the City','Weavers, Iron Smelters and Factory Owners','Civilising the Native','Women, Caste and Reform','The Changing World'],
    's9': ['Rational Numbers','Linear Equations in One Variable','Understanding Quadrilaterals','Practical Geometry','Data Handling','Squares and Square Roots','Cubes and Cube Roots','Comparing Quantities','Algebraic Expressions and Identities','Visualising Solid Shapes','Mensuration','Exponents and Powers','Direct and Inverse Proportions','Factorisation','Introduction to Graphs','Playing with Numbers'],
    's10': ['Crop Production and Management','Microorganisms: Friend and Foe','Synthetic Fibres and Plastics','Materials: Metals and Non-Metals','Coal and Petroleum','Combustion and Flame','Conservation of Plants and Animals','Cell Structure and Functions','Reproduction in Animals','Reaching the Age of Adolescence','Force and Pressure','Friction','Sound','Light'],
    's11': ['The Best Christmas Present','The Tsunami','Glimpses of the Past','Bepin Choudhury Lapse of Memory','The Summit Within','This is Jody Fawn','A Visit to Cambridge','A Short Monsoon Diary','The Great Stone Face I','The Great Stone Face II'],
    's12': ['The Indian Constitution','Understanding Secularism','Why Do We Need a Parliament','Understanding Laws','Judiciary','Understanding Our Criminal Justice System','Understanding Marginalisation','Confronting Marginalisation','Public Facilities','Law and Social Justice'],
    's13': ['Number Systems','Polynomials','Coordinate Geometry','Linear Equations in Two Variables','Introduction to Euclid Geometry','Lines and Angles','Triangles','Quadrilaterals','Areas of Parallelograms and Triangles','Circles','Constructions','Heron Formula'],
    's14': ['Motion','Force and Laws of Motion','Gravitation','Work and Energy','Sound'],
    's15': ['Matter in Our Surroundings','Is Matter Around Us Pure','Atoms and Molecules','Structure of the Atom'],
    's16': ['The Fundamental Unit of Life','Tissues','Diversity in Living Organisms','Natural Resources','Improvement in Food Resources'],
    's17': ['The Fun They Had','The Sound of Music','The Little Girl','A Truly Beautiful Mind','The Snake and the Mirror','My Childhood','Packing','Reach for the Top','The Bond of Love','Kathmandu'],
    's18': ['The French Revolution','Socialism in Europe','Nazism and the Rise of Hitler','Forest Society and Colonialism','Pastoralists in the Modern World','India: Size and Location','Physical Features of India','Drainage','Climate','Natural Vegetation and Wildlife','Population','What is Democracy'],
    's19': ['Real Numbers','Polynomials','Pair of Linear Equations in Two Variables','Quadratic Equations','Arithmetic Progressions','Triangles','Coordinate Geometry','Introduction to Trigonometry','Some Applications of Trigonometry','Circles','Constructions','Areas Related to Circles','Surface Areas and Volumes','Statistics'],
    's20': ['Light - Reflection and Refraction','The Human Eye and the Colourful World','Electricity','Magnetic Effects of Electric Current','Sources of Energy'],
    's21': ['Chemical Reactions and Equations','Acids, Bases and Salts','Metals and Non-metals','Carbon and its Compounds','Periodic Classification of Elements'],
    's22': ['Life Processes','Control and Coordination','How do Organisms Reproduce','Heredity and Evolution','Our Environment'],
    's23': ['A Letter to God','Nelson Mandela: Long Walk to Freedom','Two Stories about Flying','From the Diary of Anne Frank','The Hundred Dresses I','The Hundred Dresses II','Glimpses of India','Mijbil the Otter','Madam Rides the Bus','The Sermon at Benares'],
    's24': ['The Rise of Nationalism in Europe','Nationalism in India','The Making of a Global World','The Age of Industrialisation','Print Culture and the Modern World','Resources and Development','Water Resources','Agriculture','Minerals and Energy Resources','Manufacturing Industries','Lifelines of National Economy','Power Sharing'],
    's25': ['Physical World','Units and Measurements','Motion in a Straight Line','Motion in a Plane','Laws of Motion','Work, Energy and Power','System of Particles and Rotational Motion','Gravitation','Mechanical Properties of Solids','Mechanical Properties of Fluids','Thermal Properties of Matter','Thermodynamics','Kinetic Theory','Oscillations','Waves'],
    's26': ['Some Basic Concepts of Chemistry','Structure of Atom','Classification of Elements and Periodicity','Chemical Bonding and Molecular Structure','States of Matter','Thermodynamics','Equilibrium','Redox Reactions','Hydrogen','The s-Block Elements','The p-Block Elements','Organic Chemistry: Basic Principles','Hydrocarbons','Environmental Chemistry'],
    's27': ['The Living World','Biological Classification','Plant Kingdom','Animal Kingdom','Morphology of Flowering Plants','Anatomy of Flowering Plants','Structural Organization in Animals','Cell: The Unit of Life','Biomolecules','Cell Cycle and Cell Division','Transport in Plants','Mineral Nutrition','Photosynthesis in Higher Plants','Respiration in Plants','Plant Growth and Development','Digestion and Absorption','Breathing and Exchange of Gases','Body Fluids and Circulation','Excretory Products and Elimination','Locomotion and Movement','Neural Control and Coordination','Chemical Coordination and Integration'],
    's28': ['Sets','Relations and Functions','Trigonometric Functions','Principle of Mathematical Induction','Complex Numbers and Quadratic Equations','Linear Inequalities','Permutations and Combinations','Binomial Theorem','Sequences and Series','Straight Lines','Conic Sections','Introduction to Three Dimensional Geometry','Limits and Derivatives','Mathematical Reasoning','Statistics','Probability'],
    's29': ['The Portrait of a Lady','We Not Afraid to Die','Discovering Tut: The Saga Continues','Landscape of the Soul','The Ailing Planet: The Green Movements Role','The Browning Version','The Adventure','Silk Road'],
    's30': ['Introduction to Accounting','Theory Base of Accounting','Recording of Transactions I','Recording of Transactions II','Bank Reconciliation Statement','Trial Balance and Rectification of Errors','Depreciation, Provisions and Reserves','Bills of Exchange','Financial Statements I','Financial Statements II','Accounts from Incomplete Records','Applications of Computers in Accounting','Computerised Accounting System'],
    's31': ['Business, Trade and Commerce','Forms of Business Organisation','Private, Public and Global Enterprises','Business Services','Emerging Modes of Business','Social Responsibilities of Business','Formation of a Company','Sources of Business Finance','MSME and Business Entrepreneurship','Internal Trade','International Business'],
    's32': ['Indian Economy on the Eve of Independence','Indian Economy 1950-1990','Liberalisation, Privatisation and Globalisation','Poverty','Human Capital Formation in India','Rural Development','Employment: Growth, Informalisation','Infrastructure','Environment and Sustainable Development','Comparative Development Experience'],
    's33': ['From the Beginning of Time','Writing and City Life','An Empire Across Three Continents','The Central Islamic Lands','Nomadic Empires','The Three Orders','Changing Cultural Traditions','Confrontation of Cultures','The Industrial Revolution','Displacing Indigenous Peoples','Paths to Modernisation'],
    's34': ['Geography as a Discipline','The Origin and Evolution of the Earth','Interior of the Earth','Distribution of Oceans and Continents','Geomorphic Processes','Landforms and their Evolution','Composition and Structure of Atmosphere','Solar Radiation, Heat Balance and Temperature','Atmospheric Circulation and Weather Systems','Water in the Atmosphere'],
    's35': ['Constitution: Why and How?','Rights in the Indian Constitution','Election and Representation','Executive','Legislature','Judiciary','Federalism','Local Governments','Constitution as a Living Document','The Philosophy of the Constitution'],
    's36': ['Electric Charges and Fields','Electrostatic Potential and Capacitance','Current Electricity','Moving Charges and Magnetism','Magnetism and Matter','Electromagnetic Induction','Alternating Current','Electromagnetic Waves','Ray Optics and Optical Instruments','Wave Optics','Dual Nature of Radiation and Matter','Atoms','Nuclei','Semiconductor Electronics: Materials, Devices'],
    's37': ['The Solid State','Solutions','Electrochemistry','Chemical Kinetics','Surface Chemistry','General Principles and Processes of Isolation of Elements','The p-Block Elements','The d and f Block Elements','Coordination Compounds','Haloalkanes and Haloarenes','Alcohols, Phenols and Ethers','Aldehydes, Ketones and Carboxylic Acids','Amines','Biomolecules','Polymers','Chemistry in Everyday Life'],
    's38': ['Reproduction in Organisms','Sexual Reproduction in Flowering Plants','Human Reproduction','Reproductive Health','Principles of Inheritance and Variation','Molecular Basis of Inheritance','Evolution','Human Health and Disease','Strategies for Enhancement in Food Production','Microbes in Human Welfare','Biotechnology: Principles and Processes','Biotechnology and its Applications','Organisms and Populations','Ecosystem','Biodiversity and Conservation','Environmental Issues'],
    's39': ['Relations and Functions','Inverse Trigonometric Functions','Matrices','Determinants','Continuity and Differentiability','Applications of Derivatives','Integrals','Applications of Integrals','Differential Equations','Vector Algebra','Three Dimensional Geometry','Linear Programming','Probability'],
    's40': ['Accounting for Partnership Firms: Fundamentals','Goodwill: Nature and Valuation','Change in Profit Sharing Ratio','Admission of a Partner','Retirement or Death of a Partner','Dissolution of Partnership Firm','Accounting for Share Capital','Issue of Debentures','Analysis of Financial Statements','Cash Flow Statement'],
    's41': ['Nature and Significance of Management','Principles of Management','Business Environment','Planning','Organising','Staffing','Directing','Controlling','Financial Management','Financial Markets','Marketing Management','Consumer Protection'],
    's42': ['Introduction to Macroeconomics','National Income Accounting','Money and Banking','Determination of Income and Employment','Government Budget and the Economy','Open Economy Macroeconomics','Development Experience of India','Economic Reforms Since 1991','Current Challenges Facing Indian Economy','Development Experience of India and Its Neighbours'],
    's43': ['Bricks, Beads and Bones','Kings, Farmers and Towns','Kinship, Caste and Class','Thinkers, Beliefs and Buildings','Through the Eyes of Travellers','Bhakti-Sufi Traditions','An Imperial Capital: Vijayanagara','Peasants, Zamindars and the State','Kings and Chronicles','Colonialism and the Countryside','Rebels and the Raj','Colonial Cities','Mahatma Gandhi and the Nationalist Movement','Understanding Partition','Framing the Constitution'],
    's44': ['Human Geography: Nature and Scope','The World Population Distribution, Density and Growth','Population Composition','Human Development','Primary Activities','Secondary Activities','Tertiary and Quaternary Activities','Transport and Communication','International Trade','Human Settlements','India: Population','India: Human Settlements'],
    's45': ['The Cold War Era','The End of Bipolarity','US Hegemony in World Politics','Alternative Centres of Power','Contemporary South Asia','International Organisations','Security in the Contemporary World','Environment and Natural Resources','Globalisation','Challenges of Nation Building'],
    's46': ['A Happy Child','Three Little Pigs','After a Bath','The Bubble the Straw and the Shoe','One Little Kitten','Lalu and Peelu','Once I Saw a Little Bird','Merry Go Round'],
    's47': ['Kaa Aa Kaa','Aam Ki Kahani','Aam Ka Ped','Bandar aur Gilhari','Patte Hi Patte','Chand Se Thodi Si Gappe','Mera Ghar','Rani Bhi'],
    's48': ['Shapes and Space','Numbers 1-9','Addition','Subtraction','Numbers 10-20','Numbers 21-50','Measurement','Time','Data Handling','Patterns'],
    's49': ['My Family and Me','My Body','Food We Eat','Clothes We Wear','School and Play','Plants Around Us','Animals Around Us','My Neighbourhood'],
    's50': ['Our Country India','Festivals of India','Famous Personalities','Animals and Birds','Colors and Shapes','Our Helpers'],
    's51': ['First Day at School','Haldi Adventure','I Am Lucky','I Want','The Wind and the Sun','Funny Bunny','Strange Talk','The Magic Porridge Pot','Strawberries','Bottles and Jars'],
    's52': ['Aam Ke Bachche','Bade Miyan Chhote Miyan','Khilonewala','Aksharo Ka Mela','Mausam','Ginti','Rang','Varn aur Varnamala'],
    's53': ['What is Long What is Round','Counting in Groups','How Much Can You Carry','Counting in Tens','Patterns','Footprints','Jugs and Mugs','Tens and Ones','My Funday','Add Our Points','Lines and Lines','Give and Take'],
    's54': ['Me and My Body','My Family','Our Food','Our Water','Our Shelter','Our Environment','Transport and Communication','Air','Plants','Animals'],
    's55': ['Our National Symbols','Famous Indians','Animal Kingdom','Plant Kingdom','Solar System','Good Habits','Traffic Rules','Festivals'],
    's56': ['Good Morning','The Magic Garden','Bird Talk','Little by Little','Sea Song','A Little Fish Story','The Yellow Butterfly','Trains','Puppy and I','What is in the Mailbox'],
    's57': ['Kavita Ka Jadu','Shekhibaaz Makkhi','Chanda Mama Door Ke','Gun Gun Gun','Mere Pitaji','Bada Kaam','Sundar Saptak','Kya Hua','Aksharo Ki Duniya','Vyakti aur Vachan'],
    's58': ['Where to Look From','Fun with Numbers','Give and Take','Long and Short','Shapes and Designs','Fun with Give and Take','Time Goes On','Who is Heavier','How Many Times','Play with Patterns','Jugs and Mugs','Smart Charts'],
    's59': ['Poonam Day Out','The Plant Fairy','Water O Water','Our First School','Chhotu House','Foods We Eat','Saying Without Speaking','Flying High','It Raining','What is Cooking'],
    's60': ['India and Its Neighbours','Great Leaders','Science and Technology','Sports and Games','Books and Authors','World Geography','Body and Health','Our Environment'],
    's61': ['Wake Up','Neha Alarm Clock','Noses','Run','Nasruddins Aim','Alice in Wonderland','Helen Keller','Hiawatha','Pinocchio','A Watering Rhyme'],
    's62': ['Hum Sab Suman Ek Upavan','Jaisa Sawal Waisa Jawab','Mann Ke Bhole Bhale Badal','Papa Jab Bachche The','Dost Ki Poshak','Ek Din ki Badshahat','Gudiya','Main Kaun Hoon','Patang','Choti si Hamari Nadi'],
    's63': ['Building with Bricks','Long and Short','A Trip to Bhopal','Tick Tick Tick','The Way the World Looks','The Junk Seller','Jugs and Mugs','Carts and Wheels','Halves and Quarters','Play with Patterns','Tables and Shares','Smart Charts'],
    's64': ['Going to School','Ear to Ear','A Day with Nandu','Story of Amrita','Anita and the Honeybees','Omana Journey','From the Window','Reaching Grandmother House','Changing Families','Hu Tu Tu'],
    's65': ['Family and Relationships','Work and Play','Our Government','Our Heritage','Our Rights and Duties','India: Our Motherland','Transport and Communication','Natural Resources','Agriculture','Our Environment'],
    's66': ['Ice Cream Man','Wonderful Waste','Teamwork','Flying Together','My Shadow','Crying','Rip Van Winkle','The Little Bully','Sing a Song of People','Around the World'],
    's67': ['Rakh ki Rassi','Faslon ke Tyohar','Khilonewala','Bharat ke Bache','Joote Bade Aamir Ke','Duniya Ek Gaon','Mera Gaon','Hum Bharat Ke Bache','Chhota Bada','Ginti aur Ank'],
    's68': ['The Fish Tale','Shapes and Angles','How Many Squares','Parts and Wholes','Does it Look the Same','Be My Multiple','Can You See the Pattern','Mapping Your Way','Boxes and Sketches','Tenths and Hundredths','Area and Its Boundary','Smart Charts','Ways to Multiply and Divide','How Big How Heavy'],
    's69': ['Super Senses','A Snake Charmers Story','From Tasting to Digesting','Mangoes Round the Year','Seeds and Seeds','Every Drop Counts','Experiments with Water','A Treat for Mosquitoes','Up You Go','Whose Forests','Sunita in Space','What if it Finishes'],
    's70': ['The Earth and Its People','Latitudes and Longitudes','Movements of the Earth','Climate','Natural Vegetation','Major Landforms','Our Country India','Natural Disasters','Our Government','Our Heritage and Culture'],
    's71': ['Vah Chidiya Jo','Bachpan','Nadaan Dost','Chand se Thodi si Gappe','Aksharo ka Mahatva','Paar Nazar ke','Sathi Hath Badhana','Aise Aise','Ticket Album','Jhaansi ki Rani'],
    's72': ['Hum Panchhi Unmukt Gagan Ke','Dadi Maa','Himalaya ki Bhetiyan','Kadamb ka Ped','Mithaiwala','Shaam Ek Kisan','Apoorv Anubhav','Rahim ke Dohe','Khel','Ek Tinka'],
    's73': ['Dhvani','Lakh ki Chudiyan','Basant ki Duniya','Bus ki Yatra','Chitthiyon ki Anoothi Duniya','Bhagwan ke Dakiye','Kya Nirash Hua Jaye','Yeh Dharti Kitna Deti Hai','Kabeer ki Sakhiyan','Ek Bus ki Sawaari'],
    's74': ['Ganga Jal','Kallu Kacheri','Tum Kab Jaoge Atithi','Jallianwala Bagh','Shukra Tare ke Saman','Premchand ke Phaate','Mere Sang ki Aurtein','Ek Do Teen','Geet Ageet','Sanwale Sapno ki Yaad'],
    's75': ['Maihu Mahaan','Tulsidas','Aatmkatha','Manavta','Utsah','Yah Danturit Muskan','Bhagwan ke Dakiye','Kanyadaan','Sakhi','Naye Ilake Mein'],
    's76': ['Introduction to Computers','Parts of a Computer','Using a Mouse','Using a Keyboard','Introduction to Windows','Paint Program','File Management','Internet Basics'],
    's77': ['Computer Hardware','Software Concepts','Operating Systems','Word Processing','Spreadsheets','Presentations','Email and Internet','Social Media Safety'],
    's78': ['Computer Networking','HTML Basics','More on HTML','Cyber Safety','Database Concepts','MS Access','Introduction to Python','Python Programming Basics'],
    's79': ['Computer System Basics','Input Output Devices','Memory and Storage','Software Types','Operating System','HTML and CSS','Introduction to Python','Python Data Types','Control Structures','Functions in Python'],
    's80': ['Python Revision','Functions','File Handling','Data Structures','Database Concepts','SQL Basics','Networking Concepts','Cyber Ethics','Society Law and Ethics','Project Work'],
    's81': ['Python Programming','Programming Methodology','Data Structures','Computational Thinking','Computer Networks','Database Management','Boolean Algebra','Cloud Computing','Python Libraries','Data Visualization','Society Law and Ethics','Project Based Learning'],
    's82': ['Object Oriented Programming','Python Revision Tour','Functions','File Handling','Data Structures','Computer Networks','Database Query using SQL','Interface Python with SQL','Data Structures II','Network Protocols','Cyber Security','Project Work'],
    's83': ['Computer Systems','Input Output Memory','Software Concepts','Programming in Python','Data Structures','Database Concepts','SQL Commands','Networking','Web Development','Project Work'],
    's84': ['Computer Systems','Programming Python','Data Handling','Database Query SQL','Data Structures','Networking','Web Technologies','Society Ethics','Project Based Learning','Practical Exam Prep'],
    's85': ['What is Psychology','Methods of Enquiry','Bases of Human Behaviour','Sensation Attention Perception','Learning','Human Memory','Thinking','Motivation and Emotion'],
    's86': ['Variations in Psychological Attributes','Self and Personality','Meeting Life Challenges','Psychological Disorders','Therapeutic Approaches','Attitude and Social Cognition','Social Influence and Group Processes','Psychology and Life','Developing Psychological Skills'],
    's87': ['Sets and Functions','Algebra','Coordinate Geometry','Calculus','Mathematical Reasoning','Statistics and Probability','Relations and Functions','Trigonometry','Linear Inequalities','Permutations and Combinations','Binomial Theorem','Sequence and Series'],
    's88': ['Relations and Functions','Algebra','Calculus I','Calculus II','Vectors and 3D Geometry','Linear Programming','Probability','Inverse Trigonometric Functions','Matrices and Determinants','Applications of Integrals','Differential Equations','Statistics']
  };

  var SUBJECTS = [
    { id:'s1', name:'Mathematics', class:6, icon:'📐', color:'#3b82f6', chapters:12, description:'Learn numbers, geometry, algebra basics' },
    { id:'s2', name:'Science', class:6, icon:'🔬', color:'#10b981', chapters:10, description:'Explore the world of science' },
    { id:'s3', name:'English', class:6, icon:'📖', color:'#8b5cf6', chapters:8, description:'Grammar, literature, and writing skills' },
    { id:'s4', name:'Social Studies', class:6, icon:'🌍', color:'#f59e0b', chapters:8, description:'History, Geography, Civics' },
    { id:'s5', name:'Mathematics', class:7, icon:'📐', color:'#3b82f6', chapters:14, description:'Advanced arithmetic, algebra, geometry' },
    { id:'s6', name:'Science', class:7, icon:'🔬', color:'#10b981', chapters:12, description:'Physics, Chemistry, Biology basics' },
    { id:'s7', name:'English', class:7, icon:'📖', color:'#8b5cf6', chapters:10, description:'Literature and language' },
    { id:'s8', name:'Social Studies', class:7, icon:'🌍', color:'#f59e0b', chapters:10, description:'Medieval history, geography, governance' },
    { id:'s9', name:'Mathematics', class:8, icon:'📐', color:'#3b82f6', chapters:16, description:'Algebra, geometry, mensuration' },
    { id:'s10', name:'Science', class:8, icon:'🔬', color:'#10b981', chapters:14, description:'Force, light, cells, materials' },
    { id:'s11', name:'English', class:8, icon:'📖', color:'#8b5cf6', chapters:10, description:'Reading comprehension and grammar' },
    { id:'s12', name:'Social Studies', class:8, icon:'🌍', color:'#f59e0b', chapters:10, description:'Modern history, resources, constitution' },
    { id:'s13', name:'Mathematics', class:9, icon:'📐', color:'#3b82f6', chapters:12, description:'Number systems, polynomials, geometry' },
    { id:'s14', name:'Physics', class:9, icon:'⚡', color:'#06b6d4', chapters:5, description:'Motion, force, gravitation, sound' },
    { id:'s15', name:'Chemistry', class:9, icon:'🧪', color:'#ec4899', chapters:4, description:'Matter, atoms, molecules' },
    { id:'s16', name:'Biology', class:9, icon:'🧬', color:'#10b981', chapters:5, description:'Cells, tissues, diversity' },
    { id:'s17', name:'English', class:9, icon:'📖', color:'#8b5cf6', chapters:10, description:'Literature and language skills' },
    { id:'s18', name:'Social Studies', class:9, icon:'🌍', color:'#f59e0b', chapters:12, description:'History, Geography, Economics, Polity' },
    { id:'s19', name:'Mathematics', class:10, icon:'📐', color:'#3b82f6', chapters:14, description:'Real numbers, trigonometry, statistics' },
    { id:'s20', name:'Physics', class:10, icon:'⚡', color:'#06b6d4', chapters:5, description:'Light, electricity, magnetism' },
    { id:'s21', name:'Chemistry', class:10, icon:'🧪', color:'#ec4899', chapters:5, description:'Chemical reactions, acids, carbon' },
    { id:'s22', name:'Biology', class:10, icon:'🧬', color:'#10b981', chapters:5, description:'Life processes, reproduction, evolution' },
    { id:'s23', name:'English', class:10, icon:'📖', color:'#8b5cf6', chapters:10, description:'Board exam focus literature' },
    { id:'s24', name:'Social Studies', class:10, icon:'🌍', color:'#f59e0b', chapters:12, description:'Nationalism, development, democracy' },
    { id:'s25', name:'Physics', class:11, stream:'science', icon:'⚡', color:'#06b6d4', chapters:15, description:'Mechanics, thermodynamics, waves' },
    { id:'s26', name:'Chemistry', class:11, stream:'science', icon:'🧪', color:'#ec4899', chapters:14, description:'Atomic structure, equilibrium, organic' },
    { id:'s27', name:'Biology', class:11, stream:'science', icon:'🧬', color:'#10b981', chapters:22, description:'Botany and zoology fundamentals' },
    { id:'s28', name:'Mathematics', class:11, stream:'science', icon:'📐', color:'#3b82f6', chapters:16, description:'Sets, calculus, vectors, probability' },
    { id:'s29', name:'English', class:11, icon:'📖', color:'#8b5cf6', chapters:8, description:'Advanced literature and writing' },
    { id:'s30', name:'Accountancy', class:11, stream:'commerce', icon:'💰', color:'#f59e0b', chapters:13, description:'Financial accounting basics' },
    { id:'s31', name:'Business Studies', class:11, stream:'commerce', icon:'🏢', color:'#3b82f6', chapters:11, description:'Business organization and management' },
    { id:'s32', name:'Economics', class:11, stream:'commerce', icon:'📊', color:'#10b981', chapters:10, description:'Microeconomics and statistics' },
    { id:'s33', name:'History', class:11, stream:'arts', icon:'🏛️', color:'#f59e0b', chapters:11, description:'World history themes' },
    { id:'s34', name:'Geography', class:11, stream:'arts', icon:'🗺️', color:'#10b981', chapters:10, description:'Physical and human geography' },
    { id:'s35', name:'Political Science', class:11, stream:'arts', icon:'⚖️', color:'#8b5cf6', chapters:10, description:'Constitution and political theory' },
    { id:'s36', name:'Physics', class:12, stream:'science', icon:'⚡', color:'#06b6d4', chapters:14, description:'Electrostatics, optics, modern physics' },
    { id:'s37', name:'Chemistry', class:12, stream:'science', icon:'🧪', color:'#ec4899', chapters:16, description:'Electrochemistry, organic, biomolecules' },
    { id:'s38', name:'Biology', class:12, stream:'science', icon:'🧬', color:'#10b981', chapters:16, description:'Genetics, ecology, biotechnology' },
    { id:'s39', name:'Mathematics', class:12, stream:'science', icon:'📐', color:'#3b82f6', chapters:13, description:'Calculus, algebra, probability' },
    { id:'s40', name:'Accountancy', class:12, stream:'commerce', icon:'💰', color:'#f59e0b', chapters:10, description:'Partnership and company accounts' },
    { id:'s41', name:'Business Studies', class:12, stream:'commerce', icon:'🏢', color:'#3b82f6', chapters:12, description:'Finance, marketing, HR' },
    { id:'s42', name:'Economics', class:12, stream:'commerce', icon:'📊', color:'#10b981', chapters:10, description:'Macroeconomics and development' },
    { id:'s43', name:'History', class:12, stream:'arts', icon:'🏛️', color:'#f59e0b', chapters:15, description:'Indian history themes' },
    { id:'s44', name:'Geography', class:12, stream:'arts', icon:'🗺️', color:'#10b981', chapters:12, description:'India and world geography' },
    { id:'s45', name:'Political Science', class:12, stream:'arts', icon:'⚖️', color:'#8b5cf6', chapters:10, description:'World politics and India' },
    { id:'s46', name:'English', class:1, icon:'📖', color:'#8b5cf6', chapters:8, description:'Basic English reading and writing' },
    { id:'s47', name:'Hindi', class:1, icon:'📖', color:'#f59e0b', chapters:8, description:'Basic Hindi reading and writing' },
    { id:'s48', name:'Mathematics', class:1, icon:'📐', color:'#3b82f6', chapters:10, description:'Basic numbers and shapes' },
    { id:'s49', name:'Environmental Studies', class:1, icon:'🌿', color:'#10b981', chapters:8, description:'Our surroundings and nature' },
    { id:'s50', name:'General Knowledge', class:1, icon:'💡', color:'#ec4899', chapters:6, description:'Awareness and general facts' },
    { id:'s51', name:'English', class:2, icon:'📖', color:'#8b5cf6', chapters:10, description:'English grammar and comprehension' },
    { id:'s52', name:'Hindi', class:2, icon:'📖', color:'#f59e0b', chapters:10, description:'Hindi language and stories' },
    { id:'s53', name:'Mathematics', class:2, icon:'📐', color:'#3b82f6', chapters:12, description:'Addition, subtraction, multiplication' },
    { id:'s54', name:'Environmental Studies', class:2, icon:'🌿', color:'#10b981', chapters:10, description:'Plants, animals and environment' },
    { id:'s55', name:'General Knowledge', class:2, icon:'💡', color:'#ec4899', chapters:8, description:'Basic world knowledge' },
    { id:'s56', name:'English', class:3, icon:'📖', color:'#8b5cf6', chapters:10, description:'English literature and grammar' },
    { id:'s57', name:'Hindi', class:3, icon:'📖', color:'#f59e0b', chapters:10, description:'Hindi language and grammar' },
    { id:'s58', name:'Mathematics', class:3, icon:'📐', color:'#3b82f6', chapters:12, description:'Arithmetic and geometry basics' },
    { id:'s59', name:'Environmental Studies', class:3, icon:'🌿', color:'#10b981', chapters:10, description:'Science and social basics' },
    { id:'s60', name:'General Knowledge', class:3, icon:'💡', color:'#ec4899', chapters:8, description:'General awareness' },
    { id:'s61', name:'English', class:4, icon:'📖', color:'#8b5cf6', chapters:10, description:'Advanced English skills' },
    { id:'s62', name:'Hindi', class:4, icon:'📖', color:'#f59e0b', chapters:10, description:'Advanced Hindi skills' },
    { id:'s63', name:'Mathematics', class:4, icon:'📐', color:'#3b82f6', chapters:12, description:'Advanced arithmetic and geometry' },
    { id:'s64', name:'Science', class:4, icon:'🔬', color:'#10b981', chapters:10, description:'Basic science concepts' },
    { id:'s65', name:'Social Studies', class:4, icon:'🌍', color:'#f59e0b', chapters:10, description:'History and geography basics' },
    { id:'s66', name:'English', class:5, icon:'📖', color:'#8b5cf6', chapters:10, description:'English proficiency' },
    { id:'s67', name:'Hindi', class:5, icon:'📖', color:'#f59e0b', chapters:10, description:'Hindi proficiency' },
    { id:'s68', name:'Mathematics', class:5, icon:'📐', color:'#3b82f6', chapters:14, description:'Advanced arithmetic and intro to algebra' },
    { id:'s69', name:'Science', class:5, icon:'🔬', color:'#10b981', chapters:12, description:'Intermediate science' },
    { id:'s70', name:'Social Studies', class:5, icon:'🌍', color:'#f59e0b', chapters:10, description:'Indian history and geography' },
    { id:'s71', name:'Hindi', class:6, icon:'📖', color:'#f59e0b', chapters:10, description:'Hindi language and literature' },
    { id:'s72', name:'Hindi', class:7, icon:'📖', color:'#f59e0b', chapters:12, description:'Hindi language and literature' },
    { id:'s73', name:'Hindi', class:8, icon:'📖', color:'#f59e0b', chapters:12, description:'Hindi language and literature' },
    { id:'s74', name:'Hindi', class:9, icon:'📖', color:'#f59e0b', chapters:10, description:'Hindi course A' },
    { id:'s75', name:'Hindi', class:10, icon:'📖', color:'#f59e0b', chapters:10, description:'Hindi course A' },
    { id:'s76', name:'Computer Science', class:6, icon:'💻', color:'#06b6d4', chapters:8, description:'Introduction to computers' },
    { id:'s77', name:'Computer Science', class:7, icon:'💻', color:'#06b6d4', chapters:8, description:'Computer fundamentals' },
    { id:'s78', name:'Computer Science', class:8, icon:'💻', color:'#06b6d4', chapters:10, description:'Computer applications' },
    { id:'s79', name:'Computer Science', class:9, icon:'💻', color:'#06b6d4', chapters:10, description:'Python programming basics' },
    { id:'s80', name:'Computer Science', class:10, icon:'💻', color:'#06b6d4', chapters:10, description:'Python and database' },
    { id:'s81', name:'Computer Science', class:11, stream:'science', icon:'💻', color:'#06b6d4', chapters:12, description:'Computer Science with Python' },
    { id:'s82', name:'Computer Science', class:12, stream:'science', icon:'💻', color:'#06b6d4', chapters:12, description:'Advanced Computer Science' },
    { id:'s83', name:'Informatics Practices', class:11, stream:'commerce', icon:'💻', color:'#06b6d4', chapters:10, description:'IP with Python' },
    { id:'s84', name:'Informatics Practices', class:12, stream:'commerce', icon:'💻', color:'#06b6d4', chapters:10, description:'Advanced IP' },
    { id:'s85', name:'Psychology', class:11, stream:'arts', icon:'🧠', color:'#ec4899', chapters:9, description:'Introduction to psychology' },
    { id:'s86', name:'Psychology', class:12, stream:'arts', icon:'🧠', color:'#ec4899', chapters:9, description:'Advanced psychology' },
    { id:'s87', name:'Mathematics', class:11, stream:'commerce', icon:'📐', color:'#3b82f6', chapters:12, description:'Business mathematics' },
    { id:'s88', name:'Mathematics', class:12, stream:'commerce', icon:'📐', color:'#3b82f6', chapters:12, description:'Business mathematics and statistics' }
  ];

  var SUBJECT_LIST = ['s1','s2','s3','s4','s5','s6','s7','s8','s9','s10','s11','s12','s13','s14','s15','s16','s17','s18','s19','s20','s21','s22','s23','s24','s25','s26','s27','s28','s29','s30','s31','s32','s33','s34','s35','s36','s37','s38','s39','s40','s41','s42','s43','s44','s45','s46','s47','s48','s49','s50','s51','s52','s53','s54','s55','s56','s57','s58','s59','s60','s61','s62','s63','s64','s65','s66','s67','s68','s69','s70','s71','s72','s73','s74','s75','s76','s77','s78','s79','s80','s81','s82','s83','s84','s85','s86','s87','s88'];

  var COURSES = [
    { id:'c1', title:'Class 6 Complete Curriculum', description:'Full year curriculum for Class 6 covering all major subjects with interactive lessons and assessments.', class:6, image:null, price:0, isFree:true, students:15420, rating:4.7, lessons:240, duration:365 },
    { id:'c2', title:'Class 7 Complete Curriculum', description:'Comprehensive learning program for Class 7 students with engaging multimedia content.', class:7, image:null, price:0, isFree:true, students:12800, rating:4.6, lessons:260, duration:365 },
    { id:'c3', title:'Class 8 Complete Curriculum', description:'Master Class 8 topics with expert-curated content and interactive exercises.', class:8, image:null, price:0, isFree:true, students:11200, rating:4.8, lessons:280, duration:365 },
    { id:'c4', title:'Class 9 Complete Curriculum', description:'Build a strong foundation for board exams with Class 9 material.', class:9, image:null, price:0, isFree:true, students:18900, rating:4.5, lessons:320, duration:365 },
    { id:'c5', title:'Class 10 Board Prep', description:'Complete preparation for Class 10 board examinations with mock tests.', class:10, image:null, price:0, isFree:true, students:25600, rating:4.9, lessons:350, duration:365 },
    { id:'c6', title:'Class 11 Science Bundle', description:'Physics, Chemistry, Biology and Mathematics for Class 11 Science.', class:11, stream:'science', image:null, price:4999, isFree:false, students:8900, rating:4.7, lessons:400, duration:365 },
    { id:'c7', title:'Class 11 Commerce Bundle', description:'Accountancy, Business Studies, Economics for Class 11 Commerce.', class:11, stream:'commerce', image:null, price:4499, isFree:false, students:6700, rating:4.6, lessons:320, duration:365 },
    { id:'c8', title:'Class 11 Arts Bundle', description:'History, Geography, Political Science for Class 11 Arts.', class:11, stream:'arts', image:null, price:3999, isFree:false, students:3400, rating:4.5, lessons:280, duration:365 },
    { id:'c9', title:'Class 12 Science Bundle', description:'Complete Class 12 Science with board exam focus and practice papers.', class:12, stream:'science', image:null, price:5999, isFree:false, students:12400, rating:4.8, lessons:450, duration:365 },
    { id:'c10', title:'Class 12 Commerce Bundle', description:'Master Accountancy, Business Studies, Economics for Class 12.', class:12, stream:'commerce', image:null, price:5499, isFree:false, students:9100, rating:4.7, lessons:380, duration:365 },
    { id:'c11', title:'Class 12 Arts Bundle', description:'Complete Arts stream curriculum for Class 12 board preparation.', class:12, stream:'arts', image:null, price:4499, isFree:false, students:5200, rating:4.6, lessons:340, duration:365 },
    { id:'c12', title:'NEET Foundation Course', description:'Early preparation for NEET with Class 11-12 Biology and Chemistry focus.', class:null, image:null, price:8999, isFree:false, students:4500, rating:4.9, lessons:200, duration:180 },
    { id:'c13', title:'JEE Foundation Course', description:'Build strong Physics, Chemistry and Math foundations for JEE.', class:null, image:null, price:9999, isFree:false, students:6200, rating:4.8, lessons:250, duration:180 }
  ];

  function generateStudents() {
    var arr = [];
    arr.push({ id:'u1', name:'Admin EduMentee', email:'admin@edumentee.com', password:'admin123', avatar:null, class:null, stream:null, role:'admin', xp:0, coins:0, level:1, joinDate:'2024-01-01', badges:[], achievements:[], school:null, city:null, state:null, board:null, studyHours:0, quizzesTaken:0, examsPassed:0 });
    for (var i = 2; i <= 301; i++) {
      var gender = i % 2 === 0 ? 'male' : 'female';
      var fn = pick(gender === 'male' ? MALE_NAMES : FEMALE_NAMES);
      var ln = pick(LAST_NAMES);
      var cls = rand(1, 12);
      var st = cls >= 11 ? pick(['science','commerce','arts']) : null;
      arr.push({
        id:'u' + i, name:fn + ' ' + ln,
        email:fn.toLowerCase() + '.' + ln.toLowerCase() + i + '@example.com',
        password:'password123', avatar:null, class:cls, stream:st, role:'student',
        xp:rand(100, 5000), coins:rand(50, 3000), level:rand(1, 15),
        joinDate:randDate(), badges:[], achievements:[],
        school:pick(SCHOOLS), city:pick(CITIES), state:pick(STATES), board:pick(BOARDS),
        studyHours:rand(1, 10), quizzesTaken:rand(0, 50), examsPassed:rand(0, 20)
      });
    }
    return arr;
  }

  function generateTeachers() {
    var arr = [];
    for (var i = 1; i <= 100; i++) {
      var gender = i % 2 === 0 ? 'male' : 'female';
      var fn = pick(gender === 'male' ? MALE_NAMES : FEMALE_NAMES);
      var ln = pick(LAST_NAMES);
      var subs = [];
      var count = rand(1, 4);
      for (var j = 0; j < count; j++) subs.push(pick(SUBJECTS).name);
      subs = subs.filter(function(v,idx,a){return a.indexOf(v)===idx;});
      var quals = [];
      var qualCount = rand(1, 3);
      var degs = ['B.Ed','M.Ed','M.Sc','Ph.D','MA','BA','B.Sc','MBA'];
      for (var k = 0; k < qualCount; k++) quals.push(pick(degs));
      arr.push({
        id:'tch' + i, name:fn + ' ' + ln,
        email:fn.toLowerCase() + '.' + ln.toLowerCase() + '@edumentee.com',
        password:'password123', avatar:null, role:'teacher',
        subjects:subs, qualifications:quals, experience:rand(1, 30),
        rating:(Math.random() * 2 + 3).toFixed(1), bio:'Experienced educator passionate about teaching ' + subs[0] + '.',
        specialization:pick(['Classroom Teaching','Online Education','Exam Prep','Curriculum Design','Subject Expert']),
        availability:pick(['Weekdays','Weekends','Both']), coursesTaught:rand(1, 8)
      });
    }
    return arr;
  }

  function generateChapters() {
    var ch = {};
    var counter = 1;
    for (var idx = 0; idx < SUBJECT_LIST.length; idx++) {
      var sid = SUBJECT_LIST[idx];
      ch[sid] = [];
      var names = CHAPTER_NAMES[sid] || ['Chapter 1','Chapter 2','Chapter 3','Chapter 4','Chapter 5'];
      for (var i = 0; i < names.length; i++) {
        ch[sid].push({ id:'ch' + counter++, subjectId:sid, name:names[i], order:i + 1, topics:rand(4, 10), videoCount:rand(2, 6), duration:rand(30, 150) });
      }
    }
    return ch;
  }

  function generateTopics(chapters) {
    var topics = {};
    var counter = 1;
    for (var idx = 0; idx < SUBJECT_LIST.length; idx++) {
      var sid = SUBJECT_LIST[idx];
      topics[sid] = {};
      var chs = chapters[sid] || [];
      for (var j = 0; j < chs.length; j++) {
        topics[sid][chs[j].id] = [];
        var count = rand(3, 6);
        for (var k = 1; k <= count; k++) {
          topics[sid][chs[j].id].push({ id:'tp' + counter++, chapterId:chs[j].id, name:'Topic ' + k + ': ' + chs[j].name, order:k, completed:Math.random() > 0.5 });
        }
      }
    }
    return topics;
  }

  function generateVideos(chapters) {
    var arr = [];
    var titles = ['Introduction to the Chapter','Concept Explained','Problem Solving Session','Revision and Practice','Advanced Concepts','Real World Applications','Quick Recap','Exam Tips and Tricks','Numerical Problems','Interactive Session','Complete Chapter Overview','Step by Step Derivation','Formula Breakdown','Previous Year Questions','Menti Quiz Live','Mind Map Revision','Case Study Analysis','Practical Experiment Demo','Graph Plotting and Interpretation','Important Definitions','Short Tricks for Exams','NCERT Exercise Solutions','Competitive Exam Level Problems','Concept Map Explanation','Handwritten Notes Walkthrough','Board Exam Special','Assertion Reason Practice','MCQ Practice Session','Fill in the Blanks Exercise','True False Discussion','Match the Following','Diagram Based Questions','Lab Experiment Demonstration','Project Work Guide','Group Discussion Session','Doubt Clearing Session','Weekly Test Analysis','Speed Problem Solving','Chapter in 15 Minutes','Quick Revision Notes','Previous Year Paper Walkthrough','Expert Interview Series','Career Guidance Talk','Motivational Session','Study Plan Discussion','Time Management Tips','Memory Techniques','Common Mistakes to Avoid','Scoring Topics Breakdown','Weightage Analysis','Important Question Discussion'];
    var langs = ['Hindi','English','Hinglish'];
    var tagsPool = ['ncert','cbse','exam-prep','concept','revision','practice','advanced','beginner','board-exam','competitive','important','tricks','formula','numerical','diagram','previous-year'];
    var descriptions = [
      'In this comprehensive video lesson, we dive deep into the core concepts with step-by-step explanations and practical examples to ensure thorough understanding.',
      'Master the key topics of this chapter with expert guidance. This video covers everything you need to know for exams with solved examples.',
      'Learn through detailed animations and real-world applications. Perfect for building strong fundamentals and scoring high in examinations.',
      'This session focuses on problem-solving techniques and common exam patterns. Practice along with the instructor for best results.',
      'A complete walkthrough of the chapter with emphasis on important questions and marking schemes. Ideal for last-minute revision.',
      'Understand the underlying principles with intuitive explanations and visual aids. Designed to make complex topics simple and enjoyable.',
      'Get exam-ready with this focused session covering high-weightage topics, previous year questions, and expert tips for maximum scores.',
      'Explore this topic through interactive examples and engaging discussions. Perfect for both beginners and advanced learners.',
      'Crack your exams with this power-packed revision session covering all key concepts, formulas, and shortcut techniques.',
      'Build a rock-solid foundation with this beginner-friendly explanation. Gradually progress to advanced applications and problem solving.'
    ];
    for (var i = 1; i <= 900; i++) {
      var sid = pick(SUBJECT_LIST);
      var chs = chapters[sid] || [];
      var ch = chs.length > 0 ? chs[Math.floor(Math.random() * chs.length)] : null;
      var tags = [];
      var tcount = rand(1, 4);
      for (var t = 0; t < tcount; t++) tags.push(pick(tagsPool));
      arr.push({
        id:'v' + i, title:pick(titles) + ' - ' + (ch ? ch.name : 'General'),
        subjectId:sid, chapterId:ch ? ch.id : null,
        duration:rand(5, 60), thumbnail:null,
        views:rand(500, 500000), rating:(Math.random() * 2 + 3).toFixed(1),
        instructor:pick(INSTRUCTORS), channelName:pick(CHANNELS),
        level:pick(['beginner','intermediate','advanced']), isFree:i % 4 !== 0,
        youtubeId:null, description:pick(descriptions),
        tags:tags, language:pick(langs)
      });
    }
    return arr;
  }

  function generateResources(chapters) {
    var arr = [];
    var types = ['pdf','notes','worksheet','reference','solution','mindmap','flashcards','cheatsheet','question-bank','previous-paper','assignment','project','lab-manual'];
    var tagsPool = ['ncert','cbse','important','practice','revision','exam','beginner','advanced','board','competitive','formula','diagram','summary','numerical'];
    var descs = ['Comprehensive study material covering all key concepts.','Practice problems with detailed solutions.','Quick reference guide for last-minute revision.','In-depth notes curated by subject experts.','Collection of important questions for exam preparation.','Chapter-wise summary with all important formulas and definitions.','Previous year board questions with step-by-step solutions.','Topic-wise practice worksheets for mastery learning.','Visual mind maps connecting all concepts in the chapter.','Exam-oriented question bank with marking scheme analysis.'];
    var langOpts = ['Hindi','English','Hinglish'];
    for (var i = 1; i <= 900; i++) {
      var sid = pick(SUBJECT_LIST);
      var chs = chapters[sid] || [];
      var ch = chs.length > 0 ? chs[Math.floor(Math.random() * chs.length)] : null;
      var tags = [];
      var tcount = rand(1, 4);
      for (var t = 0; t < tcount; t++) tags.push(pick(tagsPool));
      var isFree = i % 3 !== 0;
      var tp = pick(types);
      arr.push({
        id:'r' + i, title:tp.charAt(0).toUpperCase() + tp.slice(1) + ' - ' + (ch ? ch.name : 'General'),
        type:tp, subjectId:sid, chapterId:ch ? ch.id : null,
        size:(Math.random() * 50 + 0.5).toFixed(1) + ' MB',
        pages:rand(5, 150), downloads:rand(50, 50000),
        isFree:isFree, price:isFree ? 0 : rand(20, 500),
        rating:(Math.random() * 2 + 3).toFixed(1),
        description:pick(descs), tags:tags, language:pick(langOpts)
      });
    }
    return arr;
  }

  function generateMarketplace() {
    var arr = [];
    var cats = ['books','stationery','courses','premium-notes','exam-kits','practice-papers','mock-tests','electronics','calculators','science-kits','art-supplies','programming','languages'];
    var sellers = ['EduStore','BookBee','StudyMart','LearnShop','PrepZone','SkillCart','EduHub','KnowledgePoint','AcademicStore','SmartStudy'];
    var titles = [
      { cat:'books', t:['NCERT Textbook Set','Reference Book','Guide Book','Practice Workbook','Question Bank'] },
      { cat:'stationery', t:['Premium Notebook Pack','Geometry Box','Drawing Kit','Exam Stationery Kit','Whiteboard Set'] },
      { cat:'courses', t:['Online Live Course','Recorded Video Course','Crash Course','Weekend Batch','Fast Track Course'] },
      { cat:'premium-notes', t:['Handwritten Notes','Digital Notes PDF','Topic Wise Notes','Formula Sheet','Revision Notes'] },
      { cat:'exam-kits', t:['Complete Exam Kit','Practice Kit','Mock Test Series','Previous Year Papers','Sample Paper Set'] },
      { cat:'practice-papers', t:['Chapter-wise Tests','Sample Papers','Model Test Papers','Practice Worksheets','Daily Practice Problems'] },
      { cat:'mock-tests', t:['Full Length Mock Test','Sectional Test','Subject Wise Test','Online Test Series','Adaptive Test'] },
      { cat:'electronics', t:['Scientific Calculator','Digital Pen','Tablet for Study','Noise Cancelling Headphones','Smart Watch'] },
      { cat:'calculators', t:['Scientific Calculator','Graphing Calculator','Basic Calculator','Financial Calculator','Programmable Calculator'] },
      { cat:'science-kits', t:['Chemistry Lab Kit','Physics Experiment Kit','Biology Kit','Robotics Kit','Microscope Set'] },
      { cat:'art-supplies', t:['Sketching Set','Watercolor Kit','Oil Pastels','Drawing Board','Art Paper Pack'] },
      { cat:'programming', t:['Python Course Bundle','Web Development Kit','DSA Course','Coding Challenge Set','Project Templates'] },
      { cat:'languages', t:['Spoken English Course','French Language Kit','German Course','Spanish Learning Set','Japanese Beginner Kit'] }
    ];
    for (var i = 1; i <= 800; i++) {
      var cat = pick(cats);
      var catTitles = titles.filter(function(x){return x.cat===cat;})[0];
      var catTitleList = catTitles ? catTitles.t : ['Study Product'];
      var title = pick(catTitleList);
      var op = rand(199, 5000);
      var dp = Math.floor(op * (1 - Math.random() * 0.5));
      arr.push({
        id:'m' + i, title:title + ' - ' + i, category:cat,
        description:'High quality ' + cat.slice(0, -1) + ' designed for students. Perfect for exam preparation and daily practice.',
        price:dp, originalPrice:op, rating:(Math.random() * 2 + 3).toFixed(1),
        reviews:rand(5, 1000), image:null, inStock:i % 7 !== 0,
        quantity:rand(1, 100), seller:pick(sellers),
        deliveryInfo:pick(['Free delivery','2-3 business days','Express shipping available','Standard delivery']),
        isFeatured:i < 20, discountPercent:Math.round((1 - dp/op) * 100)
      });
    }
    return arr;
  }

  function generateBooks() {
    var arr = [];
    var bookCategories = ['Textbook','Reference','Guide','Workbook','Practice Book','Question Bank','Dictionary','Encyclopedia','Novel','Biography'];
    var bookTitles = ['Mathematics for Class ','Science Textbook ','English Reader ','Social Studies ','Physics ','Chemistry ','Biology ','Accountancy ','Business Studies ','Economics ','History ','Geography ','Political Science '];
    var subjects = ['Mathematics','Science','English','Social Studies','Physics','Chemistry','Biology','Accountancy','Business Studies','Economics','History','Geography','Political Science'];
    var bookNamePrefixes = [
      'NCERT Based', 'Comprehensive', 'Complete Course', 'Exam Oriented', 'Perfect Guide',
      'Mastering', 'Foundation', 'Advanced Learning', 'Concept Wise', 'Step by Step',
      'Quick Learning', 'Smart Study', 'Easy Understanding', 'Expert Series', 'Success Series',
      'Score High', 'Board Special', 'Chapterwise', 'Topicwise', 'Practice Perfect',
      'Ultimate Guide', 'Essential Concepts', 'Simplified', 'Visual Learning', 'Rapid Revision',
      'Self Study', 'Crack the Exam', 'Golden Series', 'Target', 'Achievers'
    ];
    for (var i = 1; i <= 700; i++) {
      var cls = rand(1, 12);
      var sub = pick(subjects);
      var cat = pick(bookCategories);
      var prefix = pick(bookNamePrefixes);
      var title = prefix + ' ' + sub + ' ' + cat + ' for Class ' + cls;
      var isbn = '978-' + rand(0, 9) + rand(10, 99) + '-' + rand(1000, 9999) + '-' + rand(1000, 9999) + '-' + rand(0, 9);
      arr.push({
        id:'b' + i, title:title,
        author:pick(AUTHORS), publisher:pick(PUBLISHERS),
        edition:rand(1, 15), isbn:isbn,
        class:cls, subject:sub,
        description:'Comprehensive ' + cat.toLowerCase() + ' for ' + sub + ' Class ' + cls + ' covering complete syllabus as per NCERT guidelines. ' + prefix + ' edition with updated content and practice exercises.',
        pages:rand(50, 800), language:pick(['English','Hindi']),
        price:rand(100, 2000), rating:(Math.random() * 2 + 3).toFixed(1),
        cover:null, category:cat,
        tags:[sub.toLowerCase(), 'class' + cls, cat.toLowerCase(), 'cbse', 'ncert'],
        googleBooksId:null, openLibraryId:null,
        previewLink:null, downloadCount:rand(100, 100000)
      });
    }
    return arr;
  }

  function generateScholarships() {
    var arr = [];
    var types = ['merit','need','sports','research','international','engineering','medical','commerce','arts'];
    var providers = ['Government of India','EduMentee Foundation','UNESCO','IIT Alumni Association','Sports Authority of India','AICTE','UGC','ICMR','CSIR','Indian Council of Cultural Relations','State Education Board','Tata Trusts','Reliance Foundation','Infosys Foundation','Google India','Microsoft India','Adobe India','Zerodha Foundation','Wipro Education','HDFC Bank','SBI Foundation','L&T Education Trust','Bharti Foundation','Azim Premji Foundation','ONGC Scholarship Cell'];
    var names = ['National Merit Scholarship','Future Leaders Scholarship','Girl Child Education Fund','STEM Excellence Award','Sports Quota Scholarship','Research Innovation Grant','International Studies Fellowship','Engineering Excellence Award','Medical Aspirants Scholarship','Commerce Talent Hunt','Arts & Culture Scholarship','Digital India Scholarship','Rural Education Fund','Women in STEM Scholarship','Young Innovators Grant','Visually Impaired Student Support','Single Girl Child Scholarship','Defence Personnel Ward Scholarship','Minority Community Scholarship','SC/ST Welfare Scholarship','OBC Merit Scholarship','Economically Weaker Section Grant','State Topper Scholarship','District Excellence Award','Merit cum Means Scholarship','National Overseas Scholarship','Post Matric Scholarship','School Education Enhancement Grant','Vocational Training Support','Research Fellowship for Students'];
    for (var i = 1; i <= 150; i++) {
      var tp = pick(types);
      var seats = rand(50, 10000);
      arr.push({
        id:'sch' + i, name:pick(names) + (i > 20 ? ' ' + rand(2025, 2027) : ''),
        provider:pick(providers), amount:rand(5000, 150000),
        deadline:'2026-' + (rand(1, 12).toString().padStart(2,'0')) + '-' + (rand(1, 28).toString().padStart(2,'0')),
        eligibility:'Students of Class ' + rand(6, 12) + ' with minimum ' + rand(60, 95) + '% marks. ' + pick(['Family income below 2.5L preferred.', 'Open to all backgrounds.', 'Special consideration for rural students.']),
        description:'This scholarship aims to support deserving students in their academic journey. ' + tp.charAt(0).toUpperCase() + tp.slice(1) + '-based scholarship with comprehensive financial support.',
        seats:seats, applicants:rand(seats, seats * 10), type:tp,
        documents: pick([['Marksheets','ID Proof','Income Certificate','Recommendation Letter'],['Application Form','Essays','Portfolio'],['Marksheets','Sports Certificate','Medical Certificate'],['Identity Proof','Address Proof','Previous Year Marksheet','Income Declaration']]),
        applicationProcess:pick(['Online application with document upload','Apply through school portal','Direct submission to provider office','Register and submit essays','Apply through National Scholarship Portal']),
        website:null
      });
    }
    return arr;
  }

  var QPOOLS = {
    math: [
      { q:'What is the value of {a} + {b}?', opts:['{c0}','{c1}','{c2}','{c3}'], ans:0, gen:function(){var a=rand(1,99),b=rand(1,99),c=a+b;return{a:a,b:b,c0:c+rand(1,5),c1:c-rand(1,5),c2:c+rand(6,10),c3:c-rand(6,10),ca:c};} },
      { q:'If x + {a} = {b}, what is x?', opts:['{c0}','{c1}','{c2}','{c3}'], ans:0, gen:function(){var a=rand(1,50),b=rand(a+1,a+100),c=b-a;return{a:a,b:b,c0:c,c1:c+1,c2:c-1,c3:c+2,ca:c};} },
      { q:'What is the area of a rectangle with length {a} cm and width {b} cm?', opts:['{c0} sq cm','{c1} sq cm','{c2} sq cm','{c3} sq cm'], ans:0, gen:function(){var a=rand(2,20),b=rand(2,20),c=a*b;return{a:a,b:b,c0:c,c1:a+b,c2:2*(a+b),c3:c*2,ca:c};} },
      { q:'Find the perimeter of a square with side {a} cm.', opts:['{c0} cm','{c1} cm','{c2} cm','{c3} cm'], ans:0, gen:function(){var a=rand(3,25),c=4*a;return{a:a,c0:c,c1:a,c2:2*a,c3:a*a,ca:c};} },
      { q:'Simplify: {a}x + {b}x', opts:['{c0}x','{c1}x','{c2}x','{c3}x'], ans:0, gen:function(){var a=rand(1,10),b=rand(1,10),c=a+b;return{a:a,b:b,c0:c,c1:a-b,c2:a*b,c3:a,ca:c};} },
      { q:'What is {a} + {b} + {c}?', opts:['{d0}','{d1}','{d2}','{d3}'], ans:0, gen:function(){var a=rand(10,50),b=rand(10,50),c=rand(10,50),d=a+b+c;return{a:a,b:b,c:c,d0:d,d1:d+rand(1,5),d2:d-rand(1,5),d3:d+rand(6,10),ca:d};} },
      { q:'What is {a}% of {b}?', opts:['{c0}','{c1}','{c2}','{c3}'], ans:0, gen:function(){var a=rand(5,50),b=rand(20,200),c=Math.round(a*b/100);return{a:a,b:b,c0:c,c1:c+rand(1,5),c2:c-rand(1,5),c3:c*2,ca:c};} },
      { q:'If a={a} and b={b}, what is a² + b²?', opts:['{c0}','{c1}','{c2}','{c3}'], ans:0, gen:function(){var a=rand(1,15),b=rand(1,15),c=a*a+b*b;return{a:a,b:b,c0:c,c1:(a+b)*(a+b),c2:a*a-b*b,c3:(a-b)*(a-b),ca:c};} },
      { q:'What is the value of {a} × {b}?', opts:['{c0}','{c1}','{c2}','{c3}'], ans:0, gen:function(){var a=rand(5,25),b=rand(5,25),c=a*b;return{a:a,b:b,c0:c,c1:c+rand(1,10),c2:c-rand(1,10),c3:rand(1,200),ca:c};} },
      { q:'What is the average of {a}, {b} and {c}?', opts:['{d0}','{d1}','{d2}','{d3}'], ans:0, gen:function(){var a=rand(10,50),b=rand(10,50),c=rand(10,50),s=a+b+c,d=Math.round(s/3);return{a:a,b:b,c:c,d0:d,d1:s,d2:d+rand(1,3),d3:d-rand(1,3),ca:d};} }
    ],
    science: [
      { q:'Which of the following is a physical change?', opts:['Melting of ice','Burning of wood','Rusting of iron','Cooking of food'], ans:'opt0', st:true },
      { q:'What is the SI unit of force?', opts:['Newton','Joule','Watt','Pascal'], ans:'opt0', st:true },
      { q:'The acceleration due to gravity on Earth is approximately:', opts:['9.8 m/s²','10 m/s²','8.9 m/s²','9 m/s²'], ans:'opt0', st:true },
      { q:'Which of these is a conductor of electricity?', opts:['Copper','Rubber','Plastic','Wood'], ans:'opt0', st:true },
      { q:'What is the pH of pure water?', opts:['7','0','14','1'], ans:'opt0', st:true },
      { q:'Which gas is most abundant in Earth atmosphere?', opts:['Nitrogen','Oxygen','Carbon dioxide','Argon'], ans:'opt0', st:true },
      { q:'What is the chemical symbol for gold?', opts:['Au','Ag','Go','Gd'], ans:'opt0', st:true },
      { q:'Which part of the cell contains genetic material?', opts:['Nucleus','Cytoplasm','Cell membrane','Mitochondria'], ans:'opt0', st:true },
      { q:'What is the speed of light in vacuum?', opts:['3 × 10⁸ m/s','3 × 10⁶ m/s','3 × 10¹⁰ m/s','3 × 10⁴ m/s'], ans:'opt0', st:true },
      { q:'Which vitamin is produced by sunlight on skin?', opts:['Vitamin D','Vitamin C','Vitamin A','Vitamin B12'], ans:'opt0', st:true },
      { q:'Blood cells are produced in the:', opts:['Bone marrow','Liver','Heart','Kidney'], ans:'opt0', st:true },
      { q:'Which planet is known as the Red Planet?', opts:['Mars','Venus','Jupiter','Saturn'], ans:'opt0', st:true },
      { q:'What is the formula of water?', opts:['H₂O','CO₂','NaCl','H₂SO₄'], ans:'opt0', st:true },
      { q:'The smallest unit of matter is:', opts:['Atom','Molecule','Cell','Electron'], ans:'opt0', st:true },
      { q:'Which organ pumps blood in human body?', opts:['Heart','Brain','Liver','Lungs'], ans:'opt0', st:true },
      { q:'What is the atomic number of Carbon?', opts:['6','12','8','4'], ans:'opt0', st:true },
      { q:'Which gas is used in balloons to make them float?', opts:['Helium','Hydrogen','Oxygen','Nitrogen'], ans:'opt0', st:true },
      { q:'The process of photosynthesis takes place in:', opts:['Chloroplast','Nucleus','Mitochondria','Ribosome'], ans:'opt0', st:true },
      { q:'What type of lens is used in magnifying glass?', opts:['Convex','Concave','Plano','Cylindrical'], ans:'opt0', st:true },
      { q:'Which of these is a greenhouse gas?', opts:['Carbon dioxide','Oxygen','Nitrogen','Hydrogen'], ans:'opt0', st:true }
    ],
    english: [
      { q:'Choose the correct spelling:', opts:['Beautiful','Beautifull','Bautiful','Beauteful'], ans:'opt0', st:true },
      { q:'Which is a synonym of happy?', opts:['Joyful','Sad','Angry','Tired'], ans:'opt0', st:true },
      { q:'Identify the antonym of bright:', opts:['Dark','Shiny','Light','Glowing'], ans:'opt0', st:true },
      { q:'Which word is a noun?', opts:['Happiness','Quickly','Run','Beautiful'], ans:'opt0', st:true },
      { q:'Choose the correct article: ___ apple a day keeps the doctor away.', opts:['An','A','The','No article'], ans:'opt0', st:true },
      { q:'What is the past tense of go?', opts:['Went','Goed','Gone','Going'], ans:'opt0', st:true },
      { q:'Which of these is a conjunction?', opts:['And','Quickly','Beautiful','Run'], ans:'opt0', st:true },
      { q:'Identify the adjective in: The tall man walked slowly.', opts:['Tall','Man','Walked','Slowly'], ans:'opt0', st:true },
      { q:'Which sentence is correct?', opts:['She is going to school.','She going to school.','She go to school.','She goes to school. yesterday'], ans:'opt0', st:true },
      { q:'What is the plural of child?', opts:['Children','Childs','Childes','Children'], ans:'opt0', st:true },
      { q:'Choose the correct preposition: He is afraid ___ spiders.', opts:['of','from','with','about'], ans:'opt0', st:true },
      { q:'Which is an adverb?', opts:['Quickly','Happy','Table','Run'], ans:'opt0', st:true },
      { q:'What is a group of lions called?', opts:['Pride','Pack','Flock','Herd'], ans:'opt0', st:true },
      { q:'Identify the correct form: She ___ been studying for two hours.', opts:['has','have','had','is'], ans:'opt0', st:true },
      { q:'Which word is opposite in meaning to generous?', opts:['Stingy','Kind','Charitable','Liberal'], ans:'opt0', st:true }
    ],
    social: [
      { q:'Who was the first Prime Minister of India?', opts:['Jawaharlal Nehru','Mahatma Gandhi','Sardar Patel','Rajendra Prasad'], ans:'opt0', st:true },
      { q:'What is the capital of France?', opts:['Paris','London','Berlin','Madrid'], ans:'opt0', st:true },
      { q:'The Indian Constitution was adopted on:', opts:['26 January 1950','15 August 1947','26 November 1949','30 January 1948'], ans:'opt0', st:true },
      { q:'Which river is the longest in India?', opts:['Ganges','Yamuna','Brahmaputra','Godavari'], ans:'opt0', st:true },
      { q:'The Himalayan mountain range is an example of:', opts:['Young fold mountains','Old fold mountains','Block mountains','Volcanic mountains'], ans:'opt0', st:true },
      { q:'The concept of democracy originated in:', opts:['Ancient Greece','Ancient Rome','India','China'], ans:'opt0', st:true },
      { q:'Who wrote the Indian National Anthem?', opts:['Rabindranath Tagore','Bankim Chandra','Mahatma Gandhi','Prem Chand'], ans:'opt0', st:true },
      { q:'Which is the largest continent?', opts:['Asia','Africa','North America','Europe'], ans:'opt0', st:true },
      { q:'The United Nations was founded in which year?', opts:['1945','1919','1950','1939'], ans:'opt0', st:true },
      { q:'Which Indian state has the highest population?', opts:['Uttar Pradesh','Maharashtra','Bihar','West Bengal'], ans:'opt0', st:true },
      { q:'The Green Revolution in India focused on:', opts:['Agriculture','Industry','Education','Healthcare'], ans:'opt0', st:true },
      { q:'Who is known as the Father of the Indian Constitution?', opts:['Dr. B.R. Ambedkar','Mahatma Gandhi','Jawaharlal Nehru','Sardar Patel'], ans:'opt0', st:true },
      { q:'Which ocean is the deepest?', opts:['Pacific','Atlantic','Indian','Arctic'], ans:'opt0', st:true },
      { q:'The right to vote in India is given at the age of:', opts:['18','21','16','25'], ans:'opt0', st:true },
      { q:'Which Mughal emperor built the Taj Mahal?', opts:['Shah Jahan','Akbar','Aurangzeb','Humayun'], ans:'opt0', st:true },
      { q:'The currency of Japan is:', opts:['Yen','Won','Yuan','Ringgit'], ans:'opt0', st:true },
      { q:'Which gas makes up most of the Sun?', opts:['Hydrogen','Helium','Oxygen','Carbon'], ans:'opt0', st:true },
      { q:'The Indian economy is a type of:', opts:['Mixed economy','Socialist economy','Capitalist economy','Traditional economy'], ans:'opt0', st:true },
      { q:'Who discovered the sea route to India?', opts:['Vasco da Gama','Columbus','Magellan','Cook'], ans:'opt0', st:true },
      { q:'Which is the largest democracy in the world?', opts:['India','USA','China','Brazil'], ans:'opt0', st:true }
    ],
    account: [
      { q:'What does accounting record?', opts:['Financial transactions','Inventory','Employees','Production'], ans:'opt0', st:true },
      { q:'Which is an asset?', opts:['Cash','Loan','Expenses','Revenue'], ans:'opt0', st:true },
      { q:'What does a debit entry increase?', opts:['Asset account','Liability account','Revenue account','Capital account'], ans:'opt0', st:true },
      { q:'The accounting equation is:', opts:['Assets = Liabilities + Equity','Assets = Liabilities - Equity','Assets + Liabilities = Equity','Assets + Equity = Liabilities'], ans:'opt0', st:true },
      { q:'Which of these is a liability?', opts:['Accounts Payable','Accounts Receivable','Cash','Equipment'], ans:'opt0', st:true },
      { q:'Depreciation is:', opts:['Reduction in asset value','Increase in asset value','Cost of asset','Profit on sale'], ans:'opt0', st:true },
      { q:'What is the full form of GST?', opts:['Goods and Services Tax','General Sales Tax','Government Services Tax','Gross Sales Tax'], ans:'opt0', st:true },
      { q:'Which financial statement shows profit or loss?', opts:['Income Statement','Balance Sheet','Cash Flow','Trial Balance'], ans:'opt0', st:true },
      { q:'What does a credit entry increase?', opts:['Liability account','Asset account','Expense account','Drawings account'], ans:'opt0', st:true },
      { q:'Goodwill is classified as:', opts:['Intangible asset','Current asset','Fixed asset','Liability'], ans:'opt0', st:true }
    ],
    business: [
      { q:'What is the primary goal of a business?', opts:['Profit maximization','Employee satisfaction','Social service','Market dominance'], ans:'opt0', st:true },
      { q:'Which type of business has limited liability?', opts:['Company','Sole proprietorship','Partnership','HUF'], ans:'opt0', st:true },
      { q:'Marketing mix includes:', opts:['Product, Price, Place, Promotion','Product, Price, Profit, Promotion','Price, Place, People, Process','Product, Price, People, Promotion'], ans:'opt0', st:true },
      { q:'What is management by objectives?', opts:['Goal setting by managers','Employee evaluation','Cost cutting','Market research'], ans:'opt0', st:true },
      { q:'Which function of management involves setting goals?', opts:['Planning','Organising','Staffing','Directing'], ans:'opt0', st:true },
      { q:'The term entrepreneur comes from which language?', opts:['French','Latin','Greek','German'], ans:'opt0', st:true },
      { q:'What is a franchise?', opts:['Business license','Partnership','Joint venture','Merger'], ans:'opt0', st:true },
      { q:'Which is a source of short-term finance?', opts:['Bank overdraft','Equity shares','Debentures','Retained earnings'], ans:'opt0', st:true },
      { q:'What does SWOT stand for?', opts:['Strengths, Weaknesses, Opportunities, Threats','Sales, Workforce, Operations, Technology','Strategy, Work, Output, Time','System, Workflow, Output, Target'], ans:'opt0', st:true },
      { q:'Stock exchange is a market for:', opts:['Securities','Commodities','Foreign exchange','Real estate'], ans:'opt0', st:true }
    ],
    economics: [
      { q:'What is the central problem of an economy?', opts:['Scarcity','Inflation','Unemployment','Poverty'], ans:'opt0', st:true },
      { q:'Demand curve slopes:', opts:['Downward','Upward','Horizontal','Vertical'], ans:'opt0', st:true },
      { q:'GDP stands for:', opts:['Gross Domestic Product','Gross Development Product','General Domestic Product','Gross Domestic Profit'], ans:'opt0', st:true },
      { q:'Which is a direct tax?', opts:['Income tax','GST','Excise duty','Customs duty'], ans:'opt0', st:true },
      { q:'Inflation means:', opts:['Rise in general price level','Fall in prices','Increase in production','Growth in employment'], ans:'opt0', st:true },
      { q:'The law of supply states that as price increases:', opts:['Supply increases','Supply decreases','Demand increases','Demand decreases'], ans:'opt0', st:true },
      { q:'What is meant by monopoly?', opts:['Single seller','Many sellers','Two sellers','Few sellers'], ans:'opt0', st:true },
      { q:'Bank rate is also known as:', opts:['Discount rate','Interest rate','Exchange rate','Inflation rate'], ans:'opt0', st:true },
      { q:'Which sector contributes most to India GDP?', opts:['Service sector','Agriculture sector','Industrial sector','Manufacturing sector'], ans:'opt0', st:true },
      { q:'The father of Economics is:', opts:['Adam Smith','John Keynes','Karl Marx','Alfred Marshall'], ans:'opt0', st:true }
    ]
  };

  function getSubjectCategory(sid) {
    var s = null;
    for (var i = 0; i < SUBJECTS.length; i++) { if (SUBJECTS[i].id === sid) { s = SUBJECTS[i]; break; } }
    if (!s) return 'science';
    var n = s.name;
    if (n === 'Mathematics') return 'math';
    if (n === 'Physics' || n === 'Chemistry' || n === 'Biology' || n === 'Science') return 'science';
    if (n === 'English') return 'english';
    if (n === 'Social Studies' || n === 'History' || n === 'Geography' || n === 'Political Science') return 'social';
    if (n === 'Accountancy') return 'account';
    if (n === 'Business Studies') return 'business';
    if (n === 'Economics') return 'economics';
    return 'science';
  }

  function generateQuestion(qt, idx) {
    if (qt.st) {
      return { id:'qzq' + idx, text:qt.q, options:[{ id:'opt0',text:qt.opts[0] },{ id:'opt1',text:qt.opts[1] },{ id:'opt2',text:qt.opts[2] },{ id:'opt3',text:qt.opts[3] }], correctAnswer:qt.ans, explanation:'The correct answer is ' + qt.opts[0] + '.' };
    }
    var vals = qt.gen();
    var opts = [];
    for (var j = 0; j < 4; j++) {
      var txt = qt.opts[j].replace(/\{c(\d)\}/g, function(m, p1) { return vals['c' + p1]; });
      opts.push({ id:'opt' + j, text:txt });
    }
    return { id:'qzq' + idx, text:qt.q.replace(/\{([a-z])\}/g, function(m, p1) { return vals[p1]; }), options:opts, correctAnswer:'opt' + qt.ans, explanation:'The correct answer is ' + vals.ca + '.' };
  }

  function generateQuizzes() {
    var arr = [];
    var qid = 1;
    for (var i = 1; i <= 100; i++) {
      var sid = pick(SUBJECT_LIST);
      var cat = getSubjectCategory(sid);
      var pool = QPOOLS[cat] || QPOOLS.science;
      var qCount = rand(10, 15);
      var questions = [];
      for (var j = 0; j < qCount; j++) {
        var qt = pool[j % pool.length];
        questions.push(generateQuestion(qt, qid++));
      }
      var subj = null;
      for (var k = 0; k < SUBJECTS.length; k++) { if (SUBJECTS[k].id === sid) { subj = SUBJECTS[k]; break; } }
      arr.push({
        id:'quiz' + i, title:'Quiz on ' + (subj ? subj.name : 'Subject') + ' - ' + i,
        subjectId:sid, questions:questions,
        timeLimit:qCount * 2, passingScore:Math.ceil(qCount * 0.4),
        attempts:rand(50, 2000), difficulty:pick(['easy','medium','hard'])
      });
    }
    return arr;
  }

  function generateExams() {
    var arr = [];
    var examTypes = ['board','competitive','mock'];
    var examNames = ['JEE Main Mock Test','NEET Practice Test','CBSE Class 10 Board Exam','CBSE Class 12 Board Exam','CUET Mock Test','Olympiad Practice','Weekly Assessment','Monthly Test','Half Yearly Exam','Final Examination','SAT Practice','NTSE Stage 1','KVPY Mock','BITSAT Practice','ICSE Board Exam'];
    var subjects = [['s25','s26','s28'],['s27','s26'],['s19','s20','s21','s22','s23','s24'],['s36','s37','s38','s39','s29'],['s29','s28','s36'],['s28','s25','s26','s27']];
    for (var i = 1; i <= 30; i++) {
      var en = pick(examNames);
      var cls = rand(6, 12);
      var dur = rand(60, 180);
      var tm = rand(50, 300);
      var subjGroup = pick(subjects);
      var secs = subjGroup.map(function(s, idx) {
        var marksArr = [Math.round(tm * 0.4), Math.round(tm * 0.35), Math.round(tm * 0.25)];
        var qArr = [rand(10, 20), rand(8, 15), rand(5, 10)];
        return { name:'Section ' + String.fromCharCode(65 + idx), marks:marksArr[idx] || 30, questions:qArr[idx] || 10 };
      });
      arr.push({
        id:'exam' + i, title:en + ' ' + i,
        type:pick(examTypes), class:cls, subjectId:subjGroup[0],
        duration:dur, totalMarks:tm, sections:secs,
        instructions:['Read all questions carefully before attempting.','Each question carries equal marks unless specified.','Negative marking applies for incorrect answers.','Use only blue or black pen for answers.','Electronic devices are not permitted.'],
        scheduledDate:new Date(Date.now() + rand(1, 90) * 86400000).toISOString()
      });
    }
    return arr;
  }

  function generateCommunityPosts(students) {
    var arr = [];
    var topics = ['Study Tips','Doubt Solving','Career Guidance','Exam Prep','Time Management','Subject Help','Motivation','Resources','College Admission','Skill Development','Online Learning','Study Groups'];
    var contents = [
      'I have been struggling with {topic} lately. Can anyone share their experience and tips on how to improve?',
      'Here is my complete guide on {topic}. I have spent months researching and practicing. Hope it helps everyone!',
      'What are the best resources for {topic}? Looking for recommendations from fellow students.',
      'Just discovered an amazing technique for {topic}. Sharing it with the community because we all grow together!',
      'Can someone explain the key concepts of {topic}? I am preparing for exams and need clarity.',
      'Quick poll: How many hours do you dedicate to {topic} daily? Let us share and motivate each other!',
      'Success story: How I mastered {topic} in just 30 days. Consistency is the key!',
      'Stuck on a problem related to {topic}. Can someone help me understand the approach?',
      'Top 10 books I recommend for {topic}. These completely changed my understanding.',
      'Mistakes to avoid when studying {topic}. Learn from my experience!'
    ];
    var studentsArr = students || [{ name:'Anonymous' }];
    for (var i = 1; i <= 100; i++) {
      var tp = pick(topics);
      var ct = pick(contents).replace('{topic}', tp.toLowerCase());
      var author = pick(studentsArr);
      var replyCount = rand(0, 10);
      var replies = [];
      for (var r = 0; r < replyCount; r++) {
        replies.push({
          id:'cpr' + i + '_' + r,
          author:pick(studentsArr).name || 'Anonymous',
          content:pick(['Great point! Thanks for sharing.','I completely agree with this.','Can you elaborate more?','This is very helpful, thank you!','I have a different perspective on this.','Thanks for the tip!','Very informative post.']),
          createdAt:randDateTime(), likes:rand(0, 15)
        });
      }
      arr.push({
        id:'cp' + i, title:'Discussion: ' + tp,
        content:ct, author:author.name || 'Anonymous',
        authorAvatar:author.avatar || null,
        tags:[tp, pick(['learning','exams','study-tips','resources','motivation','career'])],
        replies:replies, likes:rand(5, 100),
        createdAt:randDateTime(), isPinned:i < 4, isResolved:Math.random() > 0.5
      });
    }
    return arr;
  }

  function generateFeedPosts(students) {
    var arr = [];
    var contents = [
      { text:'Just completed my Mathematics chapter on Trigonometry! Feeling confident for the exams.', type:'achievement' },
      { text:'Anyone else preparing for the Science Olympiad? Looking for study partners.', type:'question' },
      { text:'Top 5 tips for scoring 95%+ in Class 10 Board Exams: 1) Start early 2) Practice daily 3) Revise weekly 4) Solve PYQs 5) Stay consistent', type:'tip' },
      { text:'Day 15 of my 30-day study challenge! Consistency is key. Who else is with me?', type:'update' },
      { text:'Just discovered an amazing trick to memorize the periodic table! Sharing in the community section.', type:'achievement' },
      { text:'Stuck on Physics numericals. Can someone explain the concept of torque?', type:'question' },
      { text:'Happy to share that I scored 98/100 in my mock test! Hard work pays off.', type:'achievement' },
      { text:'Taking a break after 4 hours of study. Remember to rest your mind too!', type:'update' },
      { text:'Resource Alert: Found free downloadable worksheets for Class 12 Chemistry. Check the resources section!', type:'resource' },
      { text:'Goal for this week: Complete 3 chapters of Physics and 2 of Chemistry.', type:'milestone' },
      { text:'Just finished my first coding project in Python! Built a calculator app from scratch.', type:'achievement' },
      { text:'Does anyone have recommendations for good YouTube channels for Biology?', type:'question' },
      { text:'Study tip: Use the Pomodoro technique - 25 mins study, 5 mins break. Game changer!', type:'tip' },
      { text:'Week 2 of my NEET preparation complete. 200+ questions solved this week!', type:'update' },
      { text:'Shared my revision notes for Organic Chemistry in the resources section.', type:'resource' },
      { text:'100 days until Board Exams! Who else is starting their countdown?', type:'milestone' },
      { text:'Just earned the Quiz Master badge! So proud right now!', type:'achievement' },
      { text:'How do you stay motivated during long study sessions? Need advice.', type:'question' },
      { text:'Morning study routine: Wake up at 5 AM, revise for 2 hours before school. Works wonders!', type:'tip' },
      { text:'Completed my first full-length mock test. Scored 85% with room for improvement!', type:'update' },
      { text:'Day 30 of my 100-day challenge! Halfway through the syllabus and feeling great.', type:'milestone' },
      { text:'Just aced my Chemistry test on Organic Reactions! All those hours of practice paid off.', type:'achievement' },
      { text:'Which is better for JEE prep - online coaching or self-study? Share your thoughts.', type:'question' },
      { text:'Pro tip: Create mind maps for each chapter. They help immensely during revision!', type:'tip' },
      { text:'Week 4 of my preparation: Completed Modern Physics and started Electrochemistry.', type:'update' },
      { text:'Free resource: Compiled all important formulas for Class 12 Physics. Link in bio!', type:'resource' },
      { text:'Goal: Solve 50 JEE Main level problems daily. Day 1 done!', type:'milestone' },
      { text:'Finally understood the concept of electromagnetic induction! Visualization is the key.', type:'achievement' },
      { text:'How do you guys handle distraction while studying from home? I really need some tips.', type:'question' },
      { text:'Study hack: Teach what you learn to someone else. It reinforces concepts like nothing else!', type:'tip' },
      { text:'Completed my first revision cycle of all subjects. Time for mock tests now!', type:'update' },
      { text:'Uploaded my handwritten notes for Chemical Bonding. Hope it helps someone!', type:'resource' },
      { text:'50 days to Boards! Created a strict timetable. Who wants to be my study partner?', type:'milestone' },
      { text:'Scored 100/100 in my Maths pre-board! Hard work and consistency really matter.', type:'achievement' },
      { text:'Struggling with Organic Chemistry mechanisms. Any good resources to recommend?', type:'question' },
      { text:'The Feynman Technique is a game changer for understanding complex topics. Try it!', type:'tip' },
      { text:'Month 2 of JEE prep: 5000+ questions solved across PCM. Consistency works!', type:'update' },
      { text:'Created a revision planner for the next 30 days. Sharing it in the community section.', type:'resource' },
      { text:'Goal update: Completed 80% of my syllabus with 60 days to go!', type:'milestone' },
      { text:'Just got my first rank in the weekly test! Top 10 on the leaderboard!', type:'achievement' },
      { text:'Any tips for improving speed in Physics numericals? I take too much time per question.', type:'question' },
      { text:'Stop memorizing, start understanding. This mindset shift changed everything for me.', type:'tip' },
      { text:'Finished all NCERT exercises for Class 12 Chemistry. Moving to advanced problems!', type:'update' },
      { text:'Found an amazing app for practicing MCQs. Daily practice has improved my accuracy.', type:'resource' },
      { text:'Exactly 1 month until finals. Time to go all in! No distractions from now on.', type:'milestone' },
      { text:'Scored in the top 5% of the All India Mock Test! Feeling motivated!', type:'achievement' },
      { text:'Should I take a drop year for NEET or settle for a private college? Need advice.', type:'question' },
      { text:'Productivity tip: Keep your phone in another room while studying. Works like magic!', type:'tip' },
      { text:'Day 60 of my study streak! Never felt more disciplined in my life.', type:'update' },
      { text:'Compiled all important dates for History into a single timeline. Check resources!', type:'resource' }
    ];
    var studentsArr = students || [{ name:'Anonymous' }];
    for (var i = 1; i <= 300; i++) {
      var c = contents[i % contents.length];
      var author = pick(studentsArr);
      arr.push({
        id:'fp' + i, content:c.text, type:c.type,
        author:author.name || 'Anonymous',
        authorAvatar:author.avatar || null,
        likes:rand(5, 200), comments:rand(0, 20),
        shares:rand(0, 15), createdAt:randDateTime(),
        isLiked:i % 4 === 0
      });
    }
    return arr;
  }

  function generateCommunityMessages() {
    var arr = [];
    var communities = [
      { id:'comm1', name:'Class 10 Board Prep', icon:'📚', members:rand(50, 200) },
      { id:'comm2', name:'JEE/NEET Aspirants', icon:'🎯', members:rand(80, 300) },
      { id:'comm3', name:'Coding & Programming', icon:'💻', members:rand(30, 150) },
      { id:'comm4', name:'English Communication', icon:'🗣️', members:rand(40, 180) },
      { id:'comm5', name:'Study Tips & Motivation', icon:'⚡', members:rand(60, 250) }
    ];
    var chatContents = [
      'Hey everyone! How is your preparation going?',
      'I just finished Chapter 5. It was quite challenging but worth it!',
      'Can someone explain the concept of resonance in chemistry?',
      'Has anyone tried solving the previous year papers? They are really helpful.',
      'Good morning everyone! Today I plan to complete 3 chapters.',
      'I found an amazing shortcut for integration problems!',
      'What are the most important topics for the upcoming exam?',
      'Let us have a study session together tomorrow at 6 PM.',
      'Just scored 95% in my mock test! So happy right now!',
      'Does anyone have notes for Organic Chemistry? Please share!',
      'Staying consistent is the key. Let us all motivate each other!',
      'Which YouTube channel is best for learning Calculus?',
      'I am struggling with time management. Any tips?',
      'Completed my daily target of 6 hours! Consistency matters!',
      'The sample paper released by CBSE is very helpful. Must solve!',
      'Can we form a WhatsApp group for daily discussions?',
      'I recommend solving NCERT exemplar for strong fundamentals.',
      'Tomorrow is the deadline for the scholarship application!',
      'Taking a break today after studying non-stop for a week.',
      'Just discovered an incredible trick to memorize formulas!',
      'How many hours do you all study daily? I do around 5-6 hours.',
      'Important: The exam schedule has been updated. Check the portal.',
      'Who else is targeting IIT? Let us connect and prepare together!',
      'My physics teacher explained torque in such a simple way today.',
      'Does anyone want to practice MCQs together on a call?',
      'Revision is more important than covering new topics now!',
      'I made a complete mind map of the Periodic Table. Sharing soon!',
      'Feeling burnt out. How do you all deal with study fatigue?',
      'The key is to study smart, not just hard. Focus on weak areas.',
      'Today I solved 30 problems in 2 hours. New personal record!',
      'Can anyone help me with the concept of hybridization?',
      'Just enrolled in a new course on Data Structures! Excited!',
      'Weekend study plan: Complete revision of all science chapters.',
      'Does anyone have the previous year question bank for Maths?',
      'Pro tip: Use the Pomodoro technique for better concentration!',
      'Our class teacher recommended solving 10 years of question papers.',
      'I am thinking of starting a study vlog. Would anyone watch it?',
      'Let us create a thread where we share one tip each day!',
      'Finally understand the Doppler effect after watching 3 videos!',
      'Which books are best for Class 12 Board preparation?',
      'Consistency > Intensity. Small daily efforts add up big time!',
      'Who is appearing for NTSE this year? Let us prepare together!',
      'Just finished my assignment on SQL queries. Feeling accomplished!',
      'The mock test series on this platform is really good. Try it!',
      'Does anyone have tips for improving English writing skills?',
      'Goal for this week: Finish 2 chapters of Physics and practice problems.',
      'Remember to take care of your health alongside studies!',
      'I have compiled all important diagrams for Biology. DM for link!',
      'Study playlist suggestion: Lo-fi beats really help me focus.',
      'Never give up! Every expert was once a beginner. Keep pushing!',
      'What is everyone score in the latest quiz? I got 24/30.',
      'Can we discuss the most frequently asked questions in exams?',
      'Just started learning Python. The basics are so interesting!',
      'I need a study partner for Chemistry revision. Anyone interested?',
      'The key to organic chemistry is practice. Solve reactions daily!',
      'Happy to share that I improved my score by 15% this month!',
      'Does anyone know when the application forms for JEE will release?',
      'Study tip: Explain concepts to your friends to solidify understanding.',
      'Today I crossed 100 hours of study on this platform! Milestone!',
      'I am creating a formula sheet for all chapters. Will share once done.',
      'How do you stay motivated when you do not see immediate results?',
      'Let us all share our study timetables and help each other improve!',
      'Important topics for the board exam: Focus on high-weightage chapters.',
      'Just attended a live class on thermodynamics. Crystal clear now!',
      'What are the best online resources for learning German language?',
      'My accuracy in MCQs has improved from 60% to 85%! Practice works!',
      'Does anyone have tips for memorizing long answers in Biology?',
      'Creating a shared Google Drive folder with all study materials.',
      'The journey of a thousand miles begins with a single step. Start today!',
      'We should have a weekly quiz competition within this group!',
      'Just solved my first ever coding problem on LeetCode! So happy!',
      'How do you all manage school homework along with exam prep?',
      'Flashcards are incredibly effective for revising definitions.',
      'Exam tip: Always attempt the questions you know first, then come back.',
      'I am aiming for 95%+ in boards. Who else has the same goal?',
      'Let us share our favorite educational YouTube channels!',
      'Does anyone have experience with the CUET exam? Share your insights.',
      'Today I learned that studying in a group is way more productive!',
      'Important announcement: There will be a guest lecture on AI next week!',
      'What is the best way to revise the entire syllabus in one month?',
      'Just discovered that writing notes by hand improves memory retention!',
      'My parents are so supportive of my study goals. Grateful!',
      'Who else finds Biology diagrams calming to draw and label?',
      'The community feature on this platform is amazing! Love the support!'
    ];
    for (var ci = 0; ci < communities.length; ci++) {
      var comm = communities[ci];
      var members = [];
      var memberCount = rand(5, 15);
      for (var m = 0; m < memberCount; m++) {
        members.push(pick(students.filter(function(s){return s.role==='student';})).name);
      }
      members = members.filter(function(v,i,a){return a.indexOf(v)===i;});
      var messages = [];
      var msgCount = 50;
      for (var j = 0; j < msgCount; j++) {
        messages.push({
          id:'cmsg_' + comm.id + '_' + (j + 1),
          sender:pick(members),
          content:pick(chatContents),
          timestamp:randDateTime(),
          likes:rand(0, 8),
          isPinned:j === 0
        });
      }
      messages.sort(function(a,b){return new Date(a.timestamp)-new Date(b.timestamp);});
      arr.push({
        id:comm.id,
        name:comm.name,
        icon:comm.icon,
        members:comm.members,
        onlineCount:rand(5, Math.floor(comm.members * 0.4)),
        participantNames:members,
        messages:messages,
        createdAt:randDate()
      });
    }
    return arr;
  }

  function generateNotifications() {
    var arr = [];
    var msgTypes = [
      { msgs:['Your quiz score is ready! Check your results.','New study material added for your class.','Reminder: Live class starts in 30 minutes.','Your study plan has been updated.','Download your progress report for this week.'], type:'info' },
      { msgs:['Congratulations! You scored 95% on your quiz.','You earned a new badge! Check your profile.','You completed your daily goal! Keep it up.','Your assignment has been graded. Great work!','Level up! You reached a new milestone.'], type:'success' },
      { msgs:['Your streak is about to expire! Study now.','You have pending assignments to submit.','Your subscription is expiring soon. Renew now.','Low on coins. Complete tasks to earn more.'], type:'warning' },
      { msgs:['You earned the Fast Learner badge!','New achievement unlocked: Quiz Master!','You reached rank #10 on leaderboard!','Achievement unlocked: Streak King!','New milestone: 100 questions solved!'], type:'achievement' }
    ];
    var moreMsgs = [
      { msgs:['Your progress report for this month is ready!','New learning path recommended based on your performance.','Weekly learning summary is now available.','Take a break! You have studied 5 hours straight.','Complete your profile to get personalised recommendations.'], type:'info' },
      { msgs:['You have mastered 5 topics this week! Excellent progress.','Your study streak reached 30 days! Unbelievable dedication!','You completed all assignments ahead of schedule!','Your mentor praised your recent performance!','Top 3 in this week leaderboard! Keep it up!'], type:'success' },
      { msgs:['Your study goal for this week is behind schedule. Catch up!','You have 3 pending assignments. Submit them soon.','Your free trial ends in 3 days. Upgrade to continue.','Incomplete topics detected. Review them before exams.'], type:'warning' },
      { msgs:['Achievement unlocked: Study Marathon!','New badge earned: Subject Topper!','You reached rank #5 on the monthly leaderboard!','Achievement unlocked: Early Riser!','New milestone: 500 practice questions solved!'], type:'achievement' }
    ];
    msgTypes = msgTypes.concat(moreMsgs);
    for (var i = 1; i <= 200; i++) {
      var mt = pick(msgTypes);
      var msg = pick(mt.msgs);
      arr.push({
        id:'n' + i, message:msg,
        type:mt.type, read:i > 150,
        createdAt:randDateTime()
      });
    }
    return arr;
  }

  function generateLeaderboard(students) {
    var arr = [];
    var studentsArr = students.filter(function(s){return s.role === 'student';});
    for (var i = 0; i < 50 && i < studentsArr.length; i++) {
      arr.push({
        rank:i + 1, name:studentsArr[i].name,
        avatar:null, xp:rand(1000, 10000),
        level:rand(1, 20), streak:rand(1, 60),
        badges:rand(0, 12)
      });
    }
    arr.sort(function(a, b) { return b.xp - a.xp; });
    for (var j = 0; j < arr.length; j++) arr[j].rank = j + 1;
    return arr;
  }

  function generateAchievements() {
    return [
      { id:'ach1', name:'First Steps', description:'Complete your first lesson', icon:'👣', xp:50, unlocked:true },
      { id:'ach2', name:'Quick Learner', description:'Complete 5 lessons in a day', icon:'⚡', xp:100, unlocked:false },
      { id:'ach3', name:'Quiz Master', description:'Score 100% on any quiz', icon:'🏆', xp:200, unlocked:false },
      { id:'ach4', name:'Streak King', description:'Maintain a 7-day study streak', icon:'🔥', xp:150, unlocked:false },
      { id:'ach5', name:'Bookworm', description:'Read 10 resources', icon:'📚', xp:75, unlocked:false },
      { id:'ach6', name:'Helping Hand', description:'Answer 5 community questions', icon:'🤝', xp:100, unlocked:false },
      { id:'ach7', name:'Math Whiz', description:'Complete all Math chapters', icon:'🧮', xp:300, unlocked:false },
      { id:'ach8', name:'Science Star', description:'Complete all Science chapters', icon:'🔬', xp:300, unlocked:false },
      { id:'ach9', name:'Top Performer', description:'Reach rank 1 on leaderboard', icon:'👑', xp:500, unlocked:false },
      { id:'ach10', name:'Century Mark', description:'Score 100 marks in any exam', icon:'💯', xp:250, unlocked:false },
      { id:'ach11', name:'Social Butterfly', description:'Make 10 friends on the platform', icon:'🦋', xp:80, unlocked:false },
      { id:'ach12', name:'Dedicated Scholar', description:'Study for 30 days straight', icon:'🎯', xp:400, unlocked:false },
      { id:'ach13', name:'Problem Solver', description:'Solve 100 practice problems', icon:'💡', xp:180, unlocked:false },
      { id:'ach14', name:'Early Bird', description:'Complete morning study goals for a week', icon:'🌅', xp:120, unlocked:false },
      { id:'ach15', name:'Night Owl', description:'Study after 10 PM for 5 days', icon:'🦉', xp:120, unlocked:false },
      { id:'ach16', name:'Team Player', description:'Participate in group study sessions', icon:'🤝', xp:90, unlocked:false },
      { id:'ach17', name:'Explorer', description:'Explore all subject categories', icon:'🧭', xp:160, unlocked:false },
      { id:'ach18', name:'Gold Medalist', description:'Score gold in any mock exam', icon:'🥇', xp:350, unlocked:false },
      { id:'ach19', name:'Grammar Guru', description:'Complete all English grammar topics', icon:'📝', xp:200, unlocked:false },
      { id:'ach20', name:'Lab Expert', description:'Complete all practical science topics', icon:'🧪', xp:220, unlocked:false },
      { id:'ach21', name:'History Buff', description:'Complete all History chapters', icon:'🏛️', xp:200, unlocked:false },
      { id:'ach22', name:'Code Breaker', description:'Complete your first coding lesson', icon:'💻', xp:150, unlocked:false },
      { id:'ach23', name:'Marathoner', description:'Study 8 hours in a single day', icon:'🏃', xp:280, unlocked:false },
      { id:'ach24', name:'Note Master', description:'Create and save 20 sets of notes', icon:'📋', xp:130, unlocked:false },
      { id:'ach25', name:'All Rounder', description:'Score above 80% in all subjects', icon:'🎓', xp:450, unlocked:false },
      { id:'ach26', name:'Video Learner', description:'Watch 50 educational videos', icon:'▶️', xp:100, unlocked:false },
      { id:'ach27', name:'Researcher', description:'Download 30 resources', icon:'🔍', xp:110, unlocked:false },
      { id:'ach28', name:'Champion', description:'Win a weekly challenge', icon:'🏅', xp:320, unlocked:false },
      { id:'ach29', name:'Mentor', description:'Help 5 students with their doubts', icon:'🧑‍🏫', xp:250, unlocked:false },
      { id:'ach30', name:'Grand Master', description:'Achieve level 20 on the platform', icon:'👑', xp:600, unlocked:false }
    ];
  }

  function generateAssignments() {
    var arr = [];
    var statuses = ['pending','submitted','graded','overdue'];
    var solutions = [
      'Step 1: Identify the given values and what needs to be found. Step 2: Apply the relevant formula. Step 3: Substitute the values carefully. Step 4: Calculate and verify the result. The final answer can be obtained by following these steps systematically.',
      'Solution approach: First, understand the problem statement and identify the key concepts involved. Then, break down the problem into smaller manageable parts. Solve each part sequentially and combine the results at the end.',
      'To solve this problem, start by listing all the given data. Draw a diagram if applicable. Write the equation that relates the variables. Substitute the known values and solve for the unknown. Always check units and significant figures.',
      'This problem requires understanding of the fundamental principle involved. Let us denote the unknown variable as x. Set up the equation based on the given conditions. Solve the equation using algebraic manipulation. Verify the solution by substituting back.',
      'Begin by converting all units to the standard system. Apply the conservation principle or relevant law. Derive the expression for the required quantity. Plug in the numerical values. The computed answer matches the expected result within reasonable tolerance.',
      'The solution involves multiple steps: (1) Analyse the given data, (2) Choose the appropriate theorem or formula, (3) Perform the calculations step by step, (4) Interpret the result in the context of the problem. Double-check all calculations.',
      'Let us work through this systematically. First, identify the type of problem and recall the relevant theory. Set up the necessary equations. Solve simultaneously if needed. Present the final answer with proper units and explanation.',
      'Key steps: Read the problem carefully. Identify the input and output variables. Apply the correct mathematical operation. Show all intermediate steps for partial credit. Highlight the final answer clearly.'
    ];
    for (var i = 1; i <= 100; i++) {
      var sid = pick(SUBJECT_LIST);
      arr.push({
        id:'asn' + i, title:'Assignment ' + i + ' - ' + (pick(CHAPTER_NAMES[sid] || ['General'])),
        subjectId:sid, chapterId:null,
        description:'Complete the following problems and submit before the deadline. This assignment covers key concepts from the chapter.',
        dueDate:new Date(Date.now() + rand(-5, 20) * 86400000).toISOString().split('T')[0],
        totalMarks:rand(10, 50), type:pick(['homework','project','assignment','lab-report']),
        class:rand(6, 12), status:pick(statuses),
        solution:pick(solutions)
      });
    }
    return arr;
  }

  function generateExamResults(students) {
    var arr = [];
    var studentList = students.filter(function(s){return s.role === 'student';});
    var subjects = ['Mathematics','Science','English','Social Studies','Physics','Chemistry','Biology'];
    var grades = ['A+','A','B+','B','C+','C','D','F'];
    for (var i = 0; i < 50 && i < studentList.length; i++) {
      var s = studentList[i];
      var numSubjects = rand(3, 6);
      var subjectResults = [];
      var totalMarks = 0;
      var totalObtained = 0;
      for (var j = 0; j < numSubjects; j++) {
        var maxMarks = pick([80, 100, 100, 100, 80, 50]);
        var obtained = rand(Math.floor(maxMarks * 0.3), maxMarks);
        subjectResults.push({
          subject:pick(subjects),
          maxMarks:maxMarks,
          obtained:obtained,
          grade: obtained >= maxMarks * 0.9 ? 'A+' : obtained >= maxMarks * 0.8 ? 'A' : obtained >= maxMarks * 0.7 ? 'B+' : obtained >= maxMarks * 0.6 ? 'B' : obtained >= maxMarks * 0.5 ? 'C+' : obtained >= maxMarks * 0.4 ? 'C' : 'D',
          status: obtained >= maxMarks * 0.35 ? 'Pass' : 'Fail'
        });
        totalMarks += maxMarks;
        totalObtained += obtained;
      }
      var percentage = Math.round((totalObtained / totalMarks) * 100);
      arr.push({
        id:'er' + (i + 1),
        studentId:s.id,
        studentName:s.name,
        examName:pick(['Mid Term Examination','Final Examination','Weekly Test','Monthly Assessment','Quarterly Exam','Half Yearly Exam','Pre Board Exam','Mock Test 1','Mock Test 2','Unit Test']),
        class:s.class,
        stream:s.stream,
        results:subjectResults,
        totalMarks:totalMarks,
        totalObtained:totalObtained,
        percentage:percentage,
        overallGrade: percentage >= 90 ? 'A+' : percentage >= 80 ? 'A' : percentage >= 70 ? 'B+' : percentage >= 60 ? 'B' : percentage >= 50 ? 'C+' : percentage >= 40 ? 'C' : 'D',
        rank:rand(1, 300),
        passed:percentage >= 35,
        examDate:randDate(),
        remarks: percentage >= 90 ? 'Outstanding Performance!' : percentage >= 75 ? 'Excellent Work!' : percentage >= 60 ? 'Good Effort!' : percentage >= 45 ? 'Needs Improvement' : 'Requires Extra Attention'
      });
    }
    return arr;
  }

  function generateEvents() {
    var arr = [];
    var types = ['exam','workshop','seminar','webinar','holiday','competition','meeting','study-group','hackathon','cultural-fest','workshop','seminar','webinar'];
    var titles = ['Science Exhibition','Math Olympiad Training','Career Guidance Workshop','Parent Teacher Meeting','Annual Day Celebration','Guest Lecture on AI','Study Skills Workshop','Debate Competition','Quiz Competition','Coding Bootcamp','Art Competition','Literature Festival','Sports Day','Health Awareness Camp','Environment Club Meeting','Robotics Workshop','Innovation Challenge','Startup Pitch Competition','Photography Exhibition','Music Competition','Drama Festival','Yoga and Meditation Camp','Personality Development Workshop','Public Speaking Workshop','Group Discussion Practice','Essay Writing Competition','Poster Making Contest','Science Quiz Bowl','Maths Puzzle Challenge','Coding Hackathon','App Development Workshop','Cyber Security Awareness','Financial Literacy Camp','Leadership Summit','Cultural Exchange Program','Language Learning Fair','Career in Defence Seminar','Astronomy Night','Wildlife Conservation Talk','Film Making Workshop','3D Printing Workshop','AI and Robotics Expo','Entrepreneurship Bootcamp','MUN Conference','Debate Championship','Spelling Bee Competition','Talent Show','Fitness Challenge','Community Service Day','Alumni Meet'];
    for (var i = 1; i <= 100; i++) {
      var d = new Date(Date.now() + rand(1, 90) * 86400000);
      arr.push({
        id:'ev' + i, title:pick(titles) + ' - ' + d.getFullYear(),
        description:'An engaging event designed to enhance learning and skill development. Open to all students. ' + pick(['Guest speakers will share their expertise.', 'Interactive sessions with hands-on activities.', 'Certificates will be awarded to participants.', 'Limited seats available. Register early!']),
        date:d.toISOString().split('T')[0],
        time:rand(8, 18) + ':00 ' + (Math.random() > 0.5 ? 'AM' : 'PM'),
        location:pick(['School Auditorium','Online Zoom','Room 101','Library Hall','Conference Room','Google Meet','Microsoft Teams','Community Hall','Open Air Theatre','Lab Complex']),
        type:pick(types), organizer:pick(['School Administration','Science Club','Student Council','Cultural Committee','PTA','Tech Club','Debate Society','Art Club','Sports Department','Alumni Association']),
        class:rand(6, 12)
      });
    }
    return arr;
  }

  function generateAnnouncements() {
    var arr = [];
    var priorities = ['high','medium','low'];
    var contents = [
      'The school will remain closed on {date} due to the annual festival. All classes will be rescheduled.',
      'Results for the mid-term examinations have been published. Check your dashboard for detailed scorecards.',
      'Online classes will start at 9 AM sharp tomorrow. Please ensure stable internet connection.',
      'New study materials have been uploaded for Class {class} students. Access them from the resources section.',
      'Guest lecture by Dr. {name} on Career Opportunities in STEM fields. Date: {date}. Do not miss it!',
      'The deadline for scholarship applications has been extended to {date}. Apply now!',
      'Congratulations to all students who participated in the Science Olympiad! Results are out.',
      'Parent-teacher meetings are scheduled for next week. Check your email for the schedule.',
      'Library will remain open till 6 PM during exam season for extended study hours.',
      'Final exam schedule has been released. Download the timetable from the exams section.'
    ];
    for (var i = 1; i <= 30; i++) {
      var ct = pick(contents).replace('{date}', new Date(Date.now() + rand(1, 30) * 86400000).toISOString().split('T')[0]).replace('{class}', rand(6, 12)).replace('{name}', pick(MALE_NAMES) + ' ' + pick(LAST_NAMES));
      arr.push({
        id:'ann' + i, title:'Announcement: ' + ct.slice(0, 40) + '...',
        content:ct, date:randDate(),
        author:pick(['Admin','Principal','Academic Coordinator','Department Head','Exam Cell']),
        priority:pick(priorities), targetAudience:pick(['All Students','Class ' + rand(6, 12), 'Science Stream','Commerce Stream','Arts Stream','All Users'])
      });
    }
    return arr;
  }

  function generateMeetings() {
    var arr = [];
    for (var i = 1; i <= 30; i++) {
      var sid = pick(SUBJECT_LIST);
      var subj = null;
      for (var k = 0; k < SUBJECTS.length; k++) { if (SUBJECTS[k].id === sid) { subj = SUBJECTS[k]; break; } }
      arr.push({
        id:'mt' + i, title:'Live Class: ' + (subj ? subj.name : 'Subject') + ' - Session ' + i,
        description:'Interactive live session covering important topics with real-time doubt solving.',
        date:new Date(Date.now() + rand(1, 30) * 86400000).toISOString().split('T')[0],
        time:rand(9, 17) + ':00',
        duration:rand(30, 90), meetingLink:null,
        instructor:pick(INSTRUCTORS), subjectId:sid,
        class:subj ? subj.class : rand(6, 12), registeredCount:rand(10, 200)
      });
    }
    return arr;
  }

  function generateCertificates() {
    return [
      { id:'cert1', name:'Course Completion Certificate', description:'Awarded upon completing all lessons in a course.', template:null, fields:['Student Name','Course Name','Date','Grade'], icon:'🎓', xpRequired:500 },
      { id:'cert2', name:'Excellence in Mathematics', description:'Awarded for exceptional performance in Mathematics.', template:null, fields:['Student Name','Score','Date'], icon:'🏆', xpRequired:1000 },
      { id:'cert3', name:'Science Proficiency', description:'Awarded for demonstrating strong understanding of science subjects.', template:null, fields:['Student Name','Subject','Grade','Date'], icon:'🔬', xpRequired:1000 },
      { id:'cert4', name:'Quiz Champion', description:'Awarded for winning quiz competitions.', template:null, fields:['Student Name','Quiz Title','Rank','Date'], icon:'🏅', xpRequired:750 },
      { id:'cert5', name:'Perfect Attendance', description:'Awarded for maintaining 100% attendance for a month.', template:null, fields:['Student Name','Month','Year'], icon:'✅', xpRequired:300 },
      { id:'cert6', name:'Community Contributor', description:'Awarded for active participation in community discussions.', template:null, fields:['Student Name','Contributions','Date'], icon:'🤝', xpRequired:400 },
      { id:'cert7', name:'Coding Bootcamp Graduate', description:'Awarded upon completing the coding bootcamp program.', template:null, fields:['Student Name','Projects Completed','Date'], icon:'💻', xpRequired:1500 },
      { id:'cert8', name:'Language Learner', description:'Awarded for completing a language learning course.', template:null, fields:['Student Name','Language','Level','Date'], icon:'🗣️', xpRequired:600 },
      { id:'cert9', name:'Mock Test Topper', description:'Awarded for scoring highest in mock tests.', template:null, fields:['Student Name','Test Name','Score','Date'], icon:'🥇', xpRequired:800 },
      { id:'cert10', name:'All-Rounder Achievement', description:'Awarded for excellence across all subjects and activities.', template:null, fields:['Student Name','Subjects','Overall Grade','Date'], icon:'🌟', xpRequired:2000 }
    ];
  }

  function generateCareers() {
    var arr = [];
    var careers = [
      { title:'Software Engineer', edu:'B.Tech/B.E in Computer Science', skills:['Programming','Algorithms','System Design'], salary:'6-25 LPA', growth:'High', sectors:['IT','Product Companies','Startups'] },
      { title:'Data Scientist', edu:'B.Tech/M.Tech in CS/Statistics', skills:['Python','Machine Learning','Statistics'], salary:'8-30 LPA', growth:'Very High', sectors:['IT','Finance','Healthcare'] },
      { title:'Doctor (MBBS)', edu:'MBBS, MD/MS specialization', skills:['Medical Knowledge','Patient Care','Diagnosis'], salary:'6-40 LPA', growth:'High', sectors:['Healthcare','Hospitals','Private Practice'] },
      { title:'Chartered Accountant', edu:'CA from ICAI', skills:['Accounting','Auditing','Taxation'], salary:'7-30 LPA', growth:'High', sectors:['Finance','Audit Firms','Corporate'] },
      { title:'Civil Services (IAS/IPS)', edu:'Graduation in any discipline', skills:['Administration','Leadership','Policy'], salary:'8-20 LPA', growth:'Stable', sectors:['Government'] },
      { title:'Lawyer', edu:'LL.B after graduation', skills:['Legal Knowledge','Argumentation','Research'], salary:'5-50 LPA', growth:'Medium', sectors:['Law Firms','Corporate','Courts'] },
      { title:'Architect', edu:'B.Arch', skills:['Design','AutoCAD','Construction'], salary:'5-20 LPA', growth:'Medium', sectors:['Architecture Firms','Real Estate'] },
      { title:'Management Consultant', edu:'MBA from top B-school', skills:['Analytics','Strategy','Communication'], salary:'12-40 LPA', growth:'High', sectors:['Consulting','Corporate Strategy'] },
      { title:'Engineer (Core)', edu:'B.Tech/B.E in relevant branch', skills:['Technical Knowledge','Problem Solving','Project Management'], salary:'4-18 LPA', growth:'Medium', sectors:['Manufacturing','Infrastructure','Energy'] },
      { title:'Professor/Academician', edu:'Ph.D in relevant field', skills:['Research','Teaching','Writing'], salary:'6-25 LPA', growth:'Stable', sectors:['Universities','Colleges','Research'] },
      { title:'Entrepreneur', edu:'Any background', skills:['Business Acumen','Leadership','Risk Taking'], salary:'Variable', growth:'Variable', sectors:['All Sectors'] },
      { title:'Financial Analyst', edu:'B.Com/MBA/CFA', skills:['Financial Modeling','Analysis','Excel'], salary:'6-20 LPA', growth:'High', sectors:['Banking','Investment','Corporate'] },
      { title:'UX/UI Designer', edu:'Design degree or certification', skills:['Design Thinking','Figma','User Research'], salary:'6-22 LPA', growth:'Very High', sectors:['IT','E-commerce','Design Agencies'] },
      { title:'Biotechnologist', edu:'B.Tech/M.Sc in Biotechnology', skills:['Lab Techniques','Research','Data Analysis'], salary:'4-15 LPA', growth:'Medium', sectors:['Pharma','Research Labs','Healthcare'] },
      { title:'Journalist', edu:'BA in Journalism/Mass Comm', skills:['Writing','Research','Communication'], salary:'3-15 LPA', growth:'Medium', sectors:['Media','Publishing','Digital'] },
      { title:'Psychologist', edu:'MA/M.Sc in Psychology', skills:['Counseling','Research','Empathy'], salary:'4-12 LPA', growth:'Growing', sectors:['Healthcare','Education','Private Practice'] },
      { title:'Environmental Scientist', edu:'B.Sc/M.Sc Environmental Science', skills:['Field Research','Data Analysis','Report Writing'], salary:'4-12 LPA', growth:'Growing', sectors:['Government','NGO','Consulting'] },
      { title:'Product Manager', edu:'B.Tech/MBA preferred', skills:['Product Strategy','Analytics','Communication'], salary:'15-40 LPA', growth:'Very High', sectors:['IT','E-commerce','Technology'] },
      { title:'Content Creator', edu:'Any background with creative skills', skills:['Writing','Video Production','Social Media'], salary:'2-50 LPA', growth:'High', sectors:['Media','Marketing','Freelance'] },
      { title:'Aerospace Engineer', edu:'B.Tech Aerospace Engineering', skills:['Aerodynamics','CAD','Simulation'], salary:'8-30 LPA', growth:'High', sectors:['Defense','Space','Aviation'] },
      { title:'Marine Biologist', edu:'M.Sc Marine Biology', skills:['Research','Diving','Ecology'], salary:'4-12 LPA', growth:'Niche', sectors:['Research','Conservation','Aquaculture'] },
      { title:'Economist', edu:'MA/M.Sc Economics', skills:['Economic Modeling','Statistics','Research'], salary:'6-25 LPA', growth:'Medium', sectors:['Government','Banking','Research'] },
      { title:'Graphic Designer', edu:'Design degree or certification', skills:['Adobe Suite','Typography','Creativity'], salary:'3-15 LPA', growth:'High', sectors:['Agencies','Corporate','Freelance'] },
      { title:'Ethical Hacker', edu:'B.Tech CS + Certifications', skills:['Cybersecurity','Penetration Testing','Networking'], salary:'8-35 LPA', growth:'Very High', sectors:['IT Security','Consulting','Government'] },
      { title:'Robotics Engineer', edu:'B.Tech Robotics/Mechanical', skills:['Mechanics','Programming','Electronics'], salary:'6-22 LPA', growth:'High', sectors:['Manufacturing','Research','Automation'] },
      { title:'Urban Planner', edu:'B.Plan/M.Plan', skills:['Planning','GIS','Policy'], salary:'5-15 LPA', growth:'Medium', sectors:['Government','Consulting','Real Estate'] },
      { title:'Pharmacist', edu:'B.Pharm/M.Pharm', skills:['Pharmacy','Patient Care','Research'], salary:'3-10 LPA', growth:'Stable', sectors:['Healthcare','Pharma'] },
      { title:'Veterinarian', edu:'B.V.Sc & A.H', skills:['Animal Healthcare','Surgery','Diagnosis'], salary:'4-15 LPA', growth:'Medium', sectors:['Animal Health','Farming','Zoos'] },
      { title:'Nutritionist', edu:'B.Sc/M.Sc Nutrition', skills:['Diet Planning','Counseling','Research'], salary:'3-10 LPA', growth:'Growing', sectors:['Healthcare','Fitness','Food Industry'] },
      { title:'Actuary', edu:'B.Sc/M.Sc + Actuarial Exams', skills:['Mathematics','Statistics','Risk Analysis'], salary:'10-40 LPA', growth:'High', sectors:['Insurance','Finance','Consulting'] },
      { title:'Game Developer', edu:'B.Tech CS + Game Dev skills', skills:['Unity/Unreal','C++','3D Modeling'], salary:'6-25 LPA', growth:'High', sectors:['Gaming','Entertainment'] },
      { title:'Astronomer', edu:'Ph.D in Astronomy/Physics', skills:['Research','Data Analysis','Programming'], salary:'6-18 LPA', growth:'Niche', sectors:['Research','Observatories','ISRO'] },
      { title:'Fashion Designer', edu:'NIFT/Design degree', skills:['Design','Sketching','Textiles'], salary:'3-20 LPA', growth:'Medium', sectors:['Fashion','Retail','Film'] },
      { title:'HR Manager', edu:'MBA in HR', skills:['Recruitment','Employee Relations','Communication'], salary:'6-20 LPA', growth:'Medium', sectors:['Corporate','Consulting'] },
      { title:'Data Engineer', edu:'B.Tech CS', skills:['SQL','Python','Big Data'], salary:'8-28 LPA', growth:'Very High', sectors:['IT','E-commerce','Finance'] },
      { title:'Cloud Architect', edu:'B.Tech + Cloud certifications', skills:['AWS/Azure','DevOps','Architecture'], salary:'15-45 LPA', growth:'Very High', sectors:['IT','All Tech Companies'] },
      { title:'AI/ML Engineer', edu:'M.Tech/Ph.D preferred', skills:['Deep Learning','Python','NLP/CV'], salary:'12-40 LPA', growth:'Very High', sectors:['IT','Research','Automotive'] },
      { title:'Investment Banker', edu:'MBA from top B-school', skills:['Financial Analysis','Deal Making','Networking'], salary:'15-60 LPA', growth:'High', sectors:['Banking','Finance'] },
      { title:'Physicist', edu:'M.Sc/Ph.D Physics', skills:['Research','Mathematical Modeling','Experimentation'], salary:'6-20 LPA', growth:'Niche', sectors:['Research','Academia','ISRO'] },
      { title:'Chemist', edu:'M.Sc Chemistry', skills:['Lab Work','Analysis','Research'], salary:'4-12 LPA', growth:'Stable', sectors:['Pharma','Chemicals','Research'] },
      { title:'Social Worker', edu:'MA/MSW', skills:['Counseling','Community Work','Advocacy'], salary:'3-8 LPA', growth:'Steady', sectors:['NGO','Government','CSR'] },
      { title:'Pilot', edu:'Commercial Pilot License', skills:['Flying','Navigation','Communication'], salary:'15-60 LPA', growth:'High', sectors:['Aviation','Defense'] },
      { title:'Interior Designer', edu:'Design degree', skills:['Space Planning','AutoCAD','Creativity'], salary:'4-18 LPA', growth:'Medium', sectors:['Design Firms','Real Estate','Freelance'] },
      { title:'Digital Marketer', edu:'Any + Marketing certifications', skills:['SEO','SEM','Social Media','Analytics'], salary:'4-20 LPA', growth:'High', sectors:['All Businesses','Agencies'] },
      { title:'Technical Writer', edu:'B.Tech/BA English', skills:['Writing','Documentation','Technical Knowledge'], salary:'5-15 LPA', growth:'Medium', sectors:['IT','Documentation','Consulting'] },
      { title:'Blockchain Developer', edu:'B.Tech CS', skills:['Solidity','Ethereum','Cryptography'], salary:'10-35 LPA', growth:'Very High', sectors:['Fintech','Startups','Blockchain'] },
      { title:'IoT Engineer', edu:'B.Tech ECE/CS', skills:['Embedded Systems','Networking','Sensors'], salary:'6-20 LPA', growth:'High', sectors:['Automation','Smart Devices','Manufacturing'] },
      { title:'Patent Attorney', edu:'B.Tech + LL.B', skills:['IP Law','Technical Knowledge','Writing'], salary:'8-30 LPA', growth:'High', sectors:['Law Firms','Corporate','IP Firms'] },
      { title:'Geologist', edu:'M.Sc Geology', skills:['Field Work','Surveying','Analysis'], salary:'5-15 LPA', growth:'Medium', sectors:['Mining','Oil & Gas','Research'] },
      { title:'Statistician', edu:'M.Sc Statistics', skills:['Statistical Modeling','R/Python','Data Analysis'], salary:'6-22 LPA', growth:'High', sectors:['Government','Research','Finance'] }
    ];
    for (var i = 0; i < careers.length; i++) {
      var c = careers[i];
      arr.push({
        id:'car' + (i + 1), title:c.title,
        description:'A comprehensive career path in ' + c.title + ' with excellent growth prospects in India.',
        education:c.edu, skills:c.skills,
        salaryRange:c.salary, demand:pick(['High','Medium','Very High','Growing']),
        sectors:c.sectors, exams:pick([['JEE Advanced','GATE'],['NEET PG'],['UPSC','State PSC'],['CA Foundation'],['CLAT'],['CAT','GMAT'],['Other']])
      });
    }
    return arr;
  }

  function generateInternships() {
    var arr = [];
    var companies = ['Google','Microsoft','Amazon','Flipkart','Zomato','Swiggy','Paytm','Byjus','Unacademy','Physics Wallah','TCS','Infosys','Wipro','Deloitte','PwC','Goldman Sachs','Morgan Stanley','Adobe','Salesforce','Uber','Ola','Razorpay','CRED','Zerodha'];
    var types = ['remote','onsite','hybrid'];
    var skillsPool = ['Python','Java','JavaScript','C++','Data Science','Machine Learning','Web Development','App Development','Digital Marketing','Content Writing','Graphic Design','Finance','Accounting','Research','Teaching','Communication'];
    for (var i = 1; i <= 50; i++) {
      var skills = [];
      var sc = rand(2, 5);
      for (var j = 0; j < sc; j++) skills.push(pick(skillsPool));
      skills = skills.filter(function(v,idx,a){return a.indexOf(v)===idx;});
      arr.push({
        id:'int' + i, title:pick(['Summer Internship','Winter Intern','Research Intern','Tech Intern','Marketing Intern','Content Intern','Finance Intern','Teaching Intern']) + ' - ' + pick(companies),
        company:pick(companies), location:pick(CITIES),
        stipend:rand(5000, 50000), duration:rand(1, 6) + ' months',
        skills:skills, eligibility:'Pursuing B.Tech/B.Sc/BA/B.Com in any year.',
        deadline:new Date(Date.now() + rand(15, 120) * 86400000).toISOString().split('T')[0],
        type:pick(types), postedDate:randDate()
      });
    }
    return arr;
  }

  function generateCompetitiveExams() {
    return [
      { id:'ce1', name:'JEE Main', fullForm:'Joint Entrance Examination Main', description:'National level engineering entrance exam for admission to NITs, IIITs and other engineering colleges.', subjects:['Physics','Chemistry','Mathematics'], eligibility:'Class 12 with Physics, Chemistry, Mathematics', examPattern:'MCQ and Numerical questions', duration:'180 minutes', totalMarks:300, markingScheme:'+4 for correct, -1 for incorrect', importantDates:{ application:'January 2027', exam:'April 2027', result:'May 2027' }, website:null },
      { id:'ce2', name:'JEE Advanced', fullForm:'Joint Entrance Examination Advanced', description:'For admission to IITs. Only JEE Main qualifiers can appear.', subjects:['Physics','Chemistry','Mathematics'], eligibility:'Top 2.5 lakh JEE Main rankers', examPattern:'MCQ and Numerical questions', duration:'180 minutes each paper', totalMarks:360, markingScheme:'Variable marking scheme', importantDates:{ application:'June 2027', exam:'July 2027', result:'August 2027' }, website:null },
      { id:'ce3', name:'NEET', fullForm:'National Eligibility cum Entrance Test', description:'National level medical entrance exam for MBBS, BDS, AYUSH courses.', subjects:['Physics','Chemistry','Biology'], eligibility:'Class 12 with PCB', examPattern:'MCQ based', duration:'200 minutes', totalMarks:720, markingScheme:'+4 for correct, -1 for incorrect', importantDates:{ application:'February 2027', exam:'May 2027', result:'June 2027' }, website:null },
      { id:'ce4', name:'CUET', fullForm:'Common University Entrance Test', description:'Common entrance test for admission to central universities across India.', subjects:['Language','Domain Subjects','General Test'], eligibility:'Class 12 pass', examPattern:'MCQ based', duration:'Variable per section', totalMarks:'Variable', markingScheme:'+5 for correct, -1 for incorrect', importantDates:{ application:'March 2027', exam:'May-June 2027', result:'July 2027' }, website:null },
      { id:'ce5', name:'CAT', fullForm:'Common Admission Test', description:'National level MBA entrance exam for IIMs and other B-schools.', subjects:['Quantitative Aptitude','Data Interpretation','Verbal Ability','Logical Reasoning'], eligibility:'Graduation with 50% marks', examPattern:'MCQ and TITA', duration:'120 minutes', totalMarks:300, markingScheme:'+3 for correct, -1 for incorrect', importantDates:{ application:'August 2027', exam:'November 2027', result:'December 2027' }, website:null },
      { id:'ce6', name:'UPSC Civil Services', fullForm:'Union Public Service Commission Civil Services Examination', description:'Prestigious exam for IAS, IPS, IFS and other central services.', subjects:'Multiple subjects across Prelims, Mains and Interview', eligibility:'Graduation, age 21-32', examPattern:'Prelims (MCQ), Mains (Descriptive), Interview', duration:'Multiple stages over 1 year', totalMarks:2025, markingScheme:'Variable across stages', importantDates:{ notification:'February 2027', prelims:'June 2027', mains:'September 2027' }, website:null },
      { id:'ce7', name:'GATE', fullForm:'Graduate Aptitude Test in Engineering', description:'For admission to M.Tech and PSU recruitment.', subjects:['Engineering subjects based on branch'], eligibility:'B.Tech/B.E or equivalent', examPattern:'MCQ, MSQ, Numerical', duration:'180 minutes', totalMarks:100, markingScheme:'Variable', importantDates:{ application:'September 2027', exam:'February 2028', result:'March 2028' }, website:null },
      { id:'ce8', name:'CLAT', fullForm:'Common Law Admission Test', description:'For admission to NLUs and other law colleges.', subjects:['English','Current Affairs','Legal Reasoning','Logical Reasoning','Quantitative Techniques'], eligibility:'Class 12 (UG) or LL.B (PG)', examPattern:'MCQ based', duration:'120 minutes', totalMarks:150, markingScheme:'+1 for correct, -0.25 for incorrect', importantDates:{ application:'January 2027', exam:'May 2027', result:'June 2027' }, website:null },
      { id:'ce9', name:'NDA', fullForm:'National Defence Academy Examination', description:'For entry into Army, Navy and Air Force wings of NDA.', subjects:['Mathematics','General Ability Test'], eligibility:'Class 12, age 16.5-19.5', examPattern:'MCQ based', duration:'150 minutes each paper', totalMarks:900, markingScheme:'+4 for correct, -1 for incorrect (Maths), +4 for correct, -1.33 for incorrect (GAT)', importantDates:{ application:'January 2027', exam:'April 2027', result:'June 2027' }, website:null },
      { id:'ce10', name:'NTSE', fullForm:'National Talent Search Examination', description:'National level scholarship exam for Class 10 students.', subjects:['Mental Ability Test','Scholastic Aptitude Test'], eligibility:'Class 10 students', examPattern:'MCQ based', duration:'120 minutes each', totalMarks:200, markingScheme:'+1 for correct', importantDates:{ stage1:'November 2027', stage2:'December 2027' }, website:null }
    ];
  }

  function generateLanguages() {
    var arr = [];
    var langs = [
      { name:'English Communication', level:'Beginner to Advanced', lessons:40, duration:'12 weeks' },
      { name:'French Language', level:'A1 to B2', lessons:50, duration:'16 weeks' },
      { name:'German Language', level:'A1 to B1', lessons:45, duration:'14 weeks' },
      { name:'Spanish Language', level:'A1 to B1', lessons:45, duration:'14 weeks' },
      { name:'Japanese Language', level:'N5 to N3', lessons:55, duration:'20 weeks' },
      { name:'Hindi Language', level:'Basic to Advanced', lessons:30, duration:'10 weeks' },
      { name:'Sanskrit Language', level:'Beginner to Intermediate', lessons:35, duration:'12 weeks' },
      { name:'Mandarin Chinese', level:'HSK 1 to HSK 3', lessons:50, duration:'18 weeks' },
      { name:'Korean Language', level:'Beginner to Intermediate', lessons:40, duration:'14 weeks' },
      { name:'Italian Language', level:'A1 to B1', lessons:40, duration:'14 weeks' }
    ];
    for (var i = 0; i < langs.length; i++) {
      var l = langs[i];
      arr.push({
        id:'lang' + (i + 1), name:l.name, level:l.level,
        lessons:l.lessons, duration:l.duration,
        instructor:pick(INSTRUCTORS), rating:(Math.random() * 1.5 + 3.5).toFixed(1),
        students:rand(500, 15000)
      });
    }
    return arr;
  }

  function generateCodingCourses() {
    var arr = [];
    var courses = [
      { name:'Python Programming', lang:'Python', level:'Beginner', lessons:30, projects:8, price:0, isFree:true },
      { name:'JavaScript Mastery', lang:'JavaScript', level:'Beginner to Advanced', lessons:45, projects:12, price:2999, isFree:false },
      { name:'Web Development Bootcamp', lang:'HTML, CSS, JS', level:'Beginner', lessons:60, projects:15, price:4999, isFree:false },
      { name:'C++ for Beginners', lang:'C++', level:'Beginner', lessons:35, projects:6, price:1999, isFree:false },
      { name:'Java Programming', lang:'Java', level:'Beginner to Intermediate', lessons:40, projects:8, price:2499, isFree:false },
      { name:'Data Structures and Algorithms', lang:'Python/Java', level:'Intermediate', lessons:50, projects:20, price:3999, isFree:false },
      { name:'Machine Learning with Python', lang:'Python', level:'Advanced', lessons:45, projects:10, price:5999, isFree:false },
      { name:'React.js Frontend Development', lang:'JavaScript', level:'Intermediate', lessons:35, projects:8, price:3499, isFree:false },
      { name:'Node.js Backend Development', lang:'JavaScript', level:'Intermediate', lessons:30, projects:6, price:3499, isFree:false },
      { name:'Flutter App Development', lang:'Dart', level:'Beginner to Advanced', lessons:40, projects:5, price:4499, isFree:false },
      { name:'SQL and Database Management', lang:'SQL', level:'Beginner', lessons:25, projects:5, price:1999, isFree:false },
      { name:'DevOps and Cloud Computing', lang:'Multiple', level:'Advanced', lessons:35, projects:8, price:6999, isFree:false },
      { name:'Python Projects: Build 10 Real Apps', lang:'Python', level:'Intermediate', lessons:40, projects:10, price:2499, isFree:false },
      { name:'Web Development with Django', lang:'Python', level:'Intermediate', lessons:35, projects:5, price:3999, isFree:false },
      { name:'Full Stack Web Development', lang:'JavaScript/Python', level:'Advanced', lessons:70, projects:12, price:6999, isFree:false },
      { name:'Machine Learning Projects', lang:'Python', level:'Advanced', lessons:30, projects:8, price:5499, isFree:false },
      { name:'Deep Learning with TensorFlow', lang:'Python', level:'Advanced', lessons:35, projects:6, price:6499, isFree:false },
      { name:'Natural Language Processing', lang:'Python', level:'Advanced', lessons:25, projects:5, price:4999, isFree:false },
      { name:'Computer Vision with OpenCV', lang:'Python', level:'Advanced', lessons:28, projects:6, price:5499, isFree:false },
      { name:'Android App Development with Kotlin', lang:'Kotlin', level:'Intermediate', lessons:40, projects:6, price:4499, isFree:false },
      { name:'iOS Development with Swift', lang:'Swift', level:'Intermediate', lessons:38, projects:5, price:4999, isFree:false },
      { name:'Go Programming Language', lang:'Go', level:'Intermediate', lessons:30, projects:5, price:2999, isFree:false },
      { name:'Rust Systems Programming', lang:'Rust', level:'Advanced', lessons:35, projects:6, price:4499, isFree:false },
      { name:'TypeScript for Large Applications', lang:'TypeScript', level:'Intermediate', lessons:25, projects:4, price:2999, isFree:false },
      { name:'GraphQL API Development', lang:'JavaScript', level:'Intermediate', lessons:20, projects:4, price:3499, isFree:false },
      { name:'Docker and Kubernetes', lang:'Multiple', level:'Advanced', lessons:30, projects:5, price:5999, isFree:false },
      { name:'Cybersecurity Fundamentals', lang:'Multiple', level:'Beginner', lessons:25, projects:5, price:3999, isFree:false },
      { name:'Blockchain Development', lang:'Solidity', level:'Advanced', lessons:30, projects:4, price:6999, isFree:false },
      { name:'Data Science with R', lang:'R', level:'Intermediate', lessons:35, projects:7, price:4499, isFree:false },
      { name:'Competitive Programming', lang:'C++/Java', level:'Advanced', lessons:50, projects:25, price:4999, isFree:false }
    ];
    for (var i = 0; i < courses.length; i++) {
      var c = courses[i];
      arr.push({
        id:'cc' + (i + 1), name:c.name, language:c.lang,
        level:c.level, duration:c.lessons * 2 + ' hours',
        lessons:c.lessons, projects:c.projects,
        instructor:pick(INSTRUCTORS), rating:(Math.random() * 1.5 + 3.5).toFixed(1),
        price:c.price, isFree:c.isFree
      });
    }
    return arr;
  }

  function generateSkills() {
    var arr = [];
    var skillsData = [
      { name:'Public Speaking', cat:'Soft Skills', desc:'Learn to speak confidently in front of audiences and present ideas effectively.', dur:'6 weeks', prospects:'Leadership, Management, Sales' },
      { name:'Critical Thinking', cat:'Soft Skills', desc:'Develop analytical thinking and problem-solving abilities for academic and professional success.', dur:'8 weeks', prospects:'Research, Management, Analytics' },
      { name:'Time Management', cat:'Soft Skills', desc:'Master techniques to manage time efficiently and boost productivity.', dur:'4 weeks', prospects:'All careers' },
      { name:'Creative Writing', cat:'Writing', desc:'Explore various forms of creative writing including poetry, short stories, and essays.', dur:'10 weeks', prospects:'Content creation, Journalism, Publishing' },
      { name:'Communication Skills', cat:'Soft Skills', desc:'Enhance verbal and written communication for professional success.', dur:'6 weeks', prospects:'All careers' },
      { name:'Leadership Skills', cat:'Soft Skills', desc:'Develop leadership qualities including team management, decision making, and motivation.', dur:'8 weeks', prospects:'Management, Entrepreneurship, Politics' },
      { name:'Financial Literacy', cat:'Finance', desc:'Understand personal finance, investments, budgeting, and financial planning.', dur:'6 weeks', prospects:'Banking, Finance, Investment' },
      { name:'Digital Marketing', cat:'Marketing', desc:'Learn SEO, SEM, social media marketing, content marketing, and analytics.', dur:'12 weeks', prospects:'Marketing, Business, Entrepreneurship' },
      { name:'Data Analysis', cat:'Technical', desc:'Master data analysis using Excel, SQL, Python, and visualization tools.', dur:'10 weeks', prospects:'Data Science, Business Analysis, Research' },
      { name:'Emotional Intelligence', cat:'Soft Skills', desc:'Understanding and managing emotions for better personal and professional relationships.', dur:'4 weeks', prospects:'Management, HR, Counseling' }
    ];
    for (var i = 0; i < skillsData.length; i++) {
      var s = skillsData[i];
      arr.push({
        id:'sk' + (i + 1), name:s.name, category:s.cat,
        description:s.desc, courses:rand(3, 8),
        duration:s.dur, careerProspects:s.prospects
      });
    }
    return arr;
  }

  function generateSubscriptions() {
    return [
      { id:'sub1', name:'Free Plan', price:0, duration:0, features:['Access to free courses','Basic quizzes','Community access','Limited resources','5 video lessons/month'], isPopular:false, badge:'free' },
      { id:'sub2', name:'Basic Plan', price:99, duration:1, features:['All free features','Unlimited video lessons','Download resources','Practice tests','Progress tracking'], isPopular:false, badge:'basic' },
      { id:'sub3', name:'Pro Plan', price:299, duration:1, features:['All Basic features','Live classes access','Mock test series','Personalized study plan','Doubt solving sessions','Certificate of completion'], isPopular:true, badge:'pro' },
      { id:'sub4', name:'Premium Plan', price:599, duration:1, features:['All Pro features','1-on-1 mentoring','Priority support','Career counseling','Internship opportunities','Premium content access','Parent dashboard'], isPopular:false, badge:'premium' },
      { id:'sub5', name:'Yearly Premium', price:4999, duration:12, features:['All Premium features','2 months free','Exclusive webinars','Early access to new content','Special discounts on marketplace','Offline access','Family sharing up to 3 accounts'], isPopular:false, badge:'yearly' }
    ];
  }

  var students = generateStudents();
  var teachers = generateTeachers();
  var chapters = generateChapters();
  var topics = generateTopics(chapters);
  var videos = generateVideos(chapters);
  var resources = generateResources(chapters);
  var marketplace = generateMarketplace();
  var books = generateBooks();
  var scholarships = generateScholarships();
  var quizzes = generateQuizzes();
  var exams = generateExams();
  var communityPosts = generateCommunityPosts(students);
  var feedPosts = generateFeedPosts(students);
  var notifications = generateNotifications();
  var leaderboard = generateLeaderboard(students);
  var achievements = generateAchievements();
  var assignments = generateAssignments();
  var events = generateEvents();
  var announcements = generateAnnouncements();
  var meetings = generateMeetings();
  var certificates = generateCertificates();
  var careers = generateCareers();
  var internships = generateInternships();
  var competitiveExams = generateCompetitiveExams();
  var languages = generateLanguages();
  var codingCourses = generateCodingCourses();
  var skills = generateSkills();
  var subscriptions = generateSubscriptions();
  var communityMessages = generateCommunityMessages();
  var examResults = generateExamResults(students);

  // ==================== ENHANCED DATA ADDITIONS ====================

  // 1. Generate chapters & topics for new subjects (s46-s88)
  (function() {
    var chCounter = 1000, tpCounter = 5000;
    SUBJECT_LIST.forEach(function(sid) {
      if (chapters[sid] && chapters[sid].length > 0) return;
      var names = CHAPTER_NAMES[sid] || [];
      if (names.length === 0) return;
      chapters[sid] = [];
      topics[sid] = {};
      names.forEach(function(name, idx) {
        var chId = 'ch' + (chCounter++);
        var topCount = 5 + Math.floor(Math.random() * 11);
        chapters[sid].push({ id:chId, subjectId:sid, name:name, order:idx + 1, topics:topCount, videoCount:2 + Math.floor(Math.random() * 5), duration:30 + Math.floor(Math.random() * 120) });
        topics[sid][chId] = [];
        for (var t = 1; t <= topCount; t++) {
          topics[sid][chId].push({ id:'tp' + (tpCounter++), chapterId:chId, name:name + ' - Topic ' + t, order:t, completed:Math.random() > 0.5 });
        }
      });
    });
  })();

  // 2. Generate videos for new subjects
  (function() {
    var newSubjects = [];
    SUBJECT_LIST.forEach(function(sid) {
      if (!videos.some(function(v) { return v.subjectId === sid; })) newSubjects.push(sid);
    });
    if (newSubjects.length === 0) return;
    var vtitles = ['Introduction to the Chapter','Concept Explained','Problem Solving Session','Revision and Practice','Advanced Concepts','Real World Applications','Quick Recap','Exam Tips and Tricks','Numerical Problems','Interactive Session','Complete Chapter Overview','Step by Step Derivation','Formula Breakdown','Previous Year Questions','Menti Quiz Live','Mind Map Revision','Case Study Analysis','Practical Experiment Demo'];
    var vlangs = ['Hindi','English','Hinglish'];
    var vtagsPool = ['ncert','cbse','exam-prep','concept','revision','practice','advanced','beginner','board-exam','competitive','important','tricks','formula','numerical'];
    var vdescs = ['In this comprehensive video lesson, we dive deep into the core concepts with step-by-step explanations and practical examples to ensure thorough understanding.','Master the key topics of this chapter with expert guidance. This video covers everything you need to know for exams with solved examples.','Learn through detailed animations and real-world applications. Perfect for building strong fundamentals and scoring high in examinations.','This session focuses on problem-solving techniques and common exam patterns. Practice along with the instructor for best results.','A complete walkthrough of the chapter with emphasis on important questions and marking schemes. Ideal for last-minute revision.'];
    newSubjects.forEach(function(sid) {
      var chs = chapters[sid] || [];
      var count = Math.min(chs.length, 3 + Math.floor(Math.random() * 8));
      for (var i = 0; i < count; i++) {
        var ch = chs[i % chs.length];
        var tags = [];
        for (var t = 0; t < rand(1, 4); t++) tags.push(pick(vtagsPool));
        videos.push({
          id:'v' + (videos.length + 1), title:pick(vtitles) + ' - ' + ch.name,
          subjectId:sid, chapterId:ch.id, duration:rand(5, 60), thumbnail:null,
          views:rand(500, 50000), rating:(Math.random() * 2 + 3).toFixed(1),
          instructor:pick(INSTRUCTORS), channelName:pick(CHANNELS),
          level:pick(['beginner','intermediate','advanced']), isFree:Math.random() > 0.25,
          youtubeId:null, description:pick(vdescs), tags:tags, language:pick(vlangs)
        });
      }
    });
  })();

  // 3. Generate resources for new subjects
  (function() {
    var newSubjects = [];
    SUBJECT_LIST.forEach(function(sid) {
      if (!resources.some(function(r) { return r.subjectId === sid; })) newSubjects.push(sid);
    });
    if (newSubjects.length === 0) return;
    var rtypes = ['pdf','notes','worksheet','reference','solution','mindmap','flashcards','cheatsheet','question-bank','previous-paper','assignment','project','lab-manual'];
    var rtagsPool = ['ncert','cbse','important','practice','revision','exam','beginner','advanced','board','competitive','formula','diagram','summary','numerical'];
    var rdescs = ['Comprehensive study material covering all key concepts.','Practice problems with detailed solutions.','Quick reference guide for last-minute revision.','In-depth notes curated by subject experts.','Collection of important questions for exam preparation.','Chapter-wise summary with all important formulas and definitions.'];
    newSubjects.forEach(function(sid) {
      var chs = chapters[sid] || [];
      var count = Math.min(chs.length, 2 + Math.floor(Math.random() * 5));
      for (var i = 0; i < count; i++) {
        var ch = chs[i % chs.length];
        var tags = [];
        for (var t = 0; t < rand(1, 4); t++) tags.push(pick(rtagsPool));
        var tp = pick(rtypes);
        resources.push({
          id:'r' + (resources.length + 1), title:tp.charAt(0).toUpperCase() + tp.slice(1) + ' - ' + ch.name,
          type:tp, subjectId:sid, chapterId:ch.id, size:(Math.random() * 50 + 0.5).toFixed(1) + ' MB',
          pages:rand(5, 80), downloads:rand(50, 5000), isFree:Math.random() > 0.33,
          price:Math.random() > 0.33 ? 0 : rand(20, 200), rating:(Math.random() * 2 + 3).toFixed(1),
          description:pick(rdescs), tags:tags, language:pick(['Hindi','English','Hinglish'])
        });
      }
    });
  })();

  // 4. Add 500+ more topics to existing chapters
  (function() {
    var tpCounter = 5000 + Object.keys(topics).reduce(function(max, sid) {
      var tps = topics[sid] || {};
      return Object.keys(tps).reduce(function(m, cid) { return Math.max(m, tps[cid].reduce(function(mx, tp) { return Math.max(mx, parseInt(tp.id.replace('tp',''))); }, 0)); }, max);
    }, 0) + 1;
    var subjectKeys = Object.keys(chapters);
    for (var si = 0; si < subjectKeys.length; si++) {
      var sid = subjectKeys[si];
      var chs = chapters[sid] || [];
      for (var ci = 0; ci < chs.length; ci++) {
        var ch = chs[ci];
        var existingTopics = topics[sid][ch.id] || [];
        var addCount = rand(3, 8);
        for (var ti = 0; ti < addCount; ti++) {
          existingTopics.push({
            id:'tp' + (tpCounter++), chapterId:ch.id,
            name:pick(['Detailed Explanation of Concepts','Solved Examples Walkthrough','Practice Problems Set','Important Formulae','Common Mistakes to Avoid','Previous Year Questions Discussion','Quick Revision Notes','Mind Map and Summary','NCERT Exercise Solutions','Competitive Exam Level Problems','Assertion Reason Questions','Case Based Questions','Diagram Based Learning','Practical Applications','Real Life Examples','Step by Step Derivation','Key Definitions','Chapter at a Glance','Exam Oriented Questions','Concept Map']),
            order:existingTopics.length + 1, completed:Math.random() > 0.5
          });
        }
        topics[sid][ch.id] = existingTopics;
      }
    }
  })();

  // 5. More Teachers (100 additional → total 200)
  (function() {
    for (var i = 101; i <= 200; i++) {
      var gender = i % 2 === 0 ? 'male' : 'female';
      var fn = pick(gender === 'male' ? MALE_NAMES : FEMALE_NAMES);
      var ln = pick(LAST_NAMES);
      var subs = [];
      var scount = rand(1, 4);
      for (var j = 0; j < scount; j++) subs.push(pick(SUBJECTS).name);
      subs = subs.filter(function(v,idx,a){return a.indexOf(v)===idx;});
      var quals = [];
      var qualCount = rand(1, 3);
      var degs = ['B.Ed','M.Ed','M.Sc','Ph.D','MA','BA','B.Sc','MBA'];
      for (var k = 0; k < qualCount; k++) quals.push(pick(degs));
      teachers.push({
        id:'tch' + i, name:fn + ' ' + ln,
        email:fn.toLowerCase() + '.' + ln.toLowerCase() + i + '@edumentee.com',
        password:'password123', avatar:null, role:'teacher',
        subjects:subs, qualifications:quals, experience:rand(1, 30),
        rating:(Math.random() * 2 + 3).toFixed(1), bio:'Experienced educator passionate about teaching ' + subs[0] + '.',
        specialization:pick(['Classroom Teaching','Online Education','Exam Prep','Curriculum Design','Subject Expert']),
        availability:pick(['Weekdays','Weekends','Both']), coursesTaught:rand(1, 8)
      });
    }
  })();

  // 6. More Events (100 additional → total 200)
  (function() {
    var etitles = ['Science Exhibition','Math Olympiad Training','Career Guidance Workshop','Parent Teacher Meeting','Annual Day Celebration','Guest Lecture on AI','Study Skills Workshop','Debate Competition','Quiz Competition','Coding Bootcamp','Art Competition','Literature Festival','Sports Day','Health Awareness Camp','Environment Club Meeting','Robotics Workshop','Innovation Challenge','Startup Pitch Competition','Photography Exhibition','Music Competition','Drama Festival','Yoga and Meditation Camp','Personality Development Workshop','Public Speaking Workshop','Group Discussion Practice','Essay Writing Competition','Poster Making Contest','Science Quiz Bowl','Maths Puzzle Challenge','Coding Hackathon','App Development Workshop','Cyber Security Awareness','Financial Literacy Camp','Leadership Summit','Cultural Exchange Program','Language Learning Fair','Career in Defence Seminar','Astronomy Night','Wildlife Conservation Talk','Film Making Workshop','3D Printing Workshop','AI and Robotics Expo','Entrepreneurship Bootcamp','MUN Conference','Debate Championship','Spelling Bee Competition','Talent Show','Fitness Challenge','Community Service Day','Alumni Meet','Hackathon','Science Fair','Book Fair','Robotics Competition','Coding Contest','Startup Weekend','Photography Walk','Music Band Competition','Art Exhibition','Dance Competition','Theatre Workshop','MUN Workshop','Public Speaking Contest','Group Dance Competition','Solo Singing Competition','Fashion Show','Food Festival','Magic Show','Puppet Show','Science Magic Show','Quiz Bowl','Mathletics','Spell Bee','Creative Writing Workshop','Poetry Recitation','Story Telling Competition','Clay Modelling','Rangoli Competition','Mehendi Competition','Yoga Championship','Chess Tournament','Table Tennis Tournament','Badminton Championship','Cricket Tournament','Football Match','Basketball Tournament','Kho Kho Competition','Athletics Meet','Swimming Competition','Tug of War','Treasure Hunt','Escape Room Challenge','Lego Building Competition','Drone Racing','3D Modelling Contest','Game Development Workshop','VR Experience','AI Workshop','Robotics Hackathon','IoT Workshop','App Building Contest','Web Design Competition'];
    var etypes = ['workshop','exam','workshop','seminar','webinar','holiday','competition','meeting','study-group','hackathon','cultural-fest','workshop','seminar','webinar','competition','field-trip','parent-meeting','sports-day'];
    var elocations = ['School Auditorium','Online Zoom','Room 101','Library Hall','Conference Room','Google Meet','Microsoft Teams','Community Hall','Open Air Theatre','Lab Complex','Sports Ground','Art Room','Science Lab','Computer Lab','Music Room','Dance Studio','Auditorium','Online','Main Hall','Cafeteria'];
    for (var i = 101; i <= 200; i++) {
      var d = new Date(Date.now() + rand(1, 90) * 86400000);
      events.push({
        id:'ev' + i, title:pick(etitles) + ' - ' + d.getFullYear(),
        description:'An engaging event designed to enhance learning and skill development. Open to all students. ' + pick(['Guest speakers will share their expertise.','Interactive sessions with hands-on activities.','Certificates will be awarded to participants.','Limited seats available. Register early!']),
        date:d.toISOString().split('T')[0],
        time:rand(7, 19) + ':00 ' + (Math.random() > 0.5 ? 'AM' : 'PM'),
        location:pick(elocations),
        type:pick(etypes), organizer:pick(['School Administration','Science Club','Student Council','Cultural Committee','PTA','Tech Club','Debate Society','Art Club','Sports Department','Alumni Association','Music Club','Drama Club','Literary Society','Eco Club','Health Club']),
        class:rand(1, 12)
      });
    }
  })();

  // 7. More Assignments (100 additional → total 200)
  (function() {
    var statuses = ['pending','submitted','graded','overdue'];
    var solutions = [
      'Step 1: Identify the given values and what needs to be found. Step 2: Apply the relevant formula. Step 3: Substitute the values carefully. Step 4: Calculate and verify the result. The final answer can be obtained by following these steps systematically.',
      'Solution approach: First, understand the problem statement and identify the key concepts involved. Then, break down the problem into smaller manageable parts. Solve each part sequentially and combine the results at the end.',
      'To solve this problem, start by listing all the given data. Draw a diagram if applicable. Write the equation that relates the variables. Substitute the known values and solve for the unknown.',
      'This problem requires understanding of the fundamental principle involved. Let us denote the unknown variable as x. Set up the equation based on the given conditions. Solve the equation using algebraic manipulation.',
      'Begin by converting all units to the standard system. Apply the conservation principle or relevant law. Derive the expression for the required quantity. Plug in the numerical values.',
      'The solution involves multiple steps: Analyse the given data, Choose the appropriate theorem or formula, Perform the calculations step by step, Interpret the result in the context of the problem.',
      'Let us work through this systematically. First, identify the type of problem and recall the relevant theory. Set up the necessary equations. Solve simultaneously if needed. Present the final answer with proper units.',
      'Key steps: Read the problem carefully. Identify the input and output variables. Apply the correct mathematical operation. Show all intermediate steps for partial credit. Highlight the final answer clearly.',
      'Start with the fundamental equation. Rearrange to isolate the unknown. Substitute known values with correct units. Perform dimensional analysis to verify. Calculate the final numerical answer with appropriate precision.',
      'Break the problem into sub-problems. Solve each sub-problem using appropriate methods. Combine the solutions. Verify the final answer by checking against given conditions or using alternative methods.'
    ];
    for (var i = 101; i <= 200; i++) {
      var sid = pick(SUBJECT_LIST);
      assignments.push({
        id:'asn' + i, title:'Assignment ' + i + ' - ' + (pick(CHAPTER_NAMES[sid] || ['General'])),
        subjectId:sid, chapterId:null,
        description:'Complete the following problems and submit before the deadline. This assignment covers key concepts from the chapter and tests your understanding through various question types.',
        dueDate:new Date(Date.now() + rand(-5, 30) * 86400000).toISOString().split('T')[0],
        totalMarks:rand(10, 50), type:pick(['homework','project','assignment','lab-report','practice-set','worksheet']),
        class:rand(1, 12), status:pick(statuses),
        solution:pick(solutions)
      });
    }
  })();

  // 8. Teacher Doubt Responses (per subject)
  var teacherResponses = {
    math: [
      { question:'How do I solve quadratic equations using the quadratic formula?', answer:'The quadratic formula is x = [-b ± sqrt(b²-4ac)] / 2a. First identify a, b, c from ax²+bx+c=0, then substitute into the formula. The discriminant (b²-4ac) determines the nature of roots.', teacherId:'tch15', date:'2025-11-15' },
      { question:'What is the difference between permutation and combination?', answer:'Permutation (nPr) considers order - arranging items in sequence. Combination (nCr) does not consider order - selecting items. For example, arranging 3 books on a shelf is permutation, selecting 3 books from 10 is combination.', teacherId:'tch23', date:'2025-11-20' },
      { question:'How do I find the area of a circle?', answer:'Area of a circle = πr² where r is the radius. If diameter is given, first find radius by dividing diameter by 2. Remember to use the correct units (square units).', teacherId:'tch8', date:'2025-11-18' },
      { question:'What are trigonometric ratios and how to remember them?', answer:'The six trigonometric ratios are sin, cos, tan, cosec, sec, cot. Remember SOH CAH TOA: Sin = Opposite/Hypotenuse, Cos = Adjacent/Hypotenuse, Tan = Opposite/Adjacent. The reciprocals are cosec, sec, cot respectively.', teacherId:'tch42', date:'2025-11-22' },
      { question:'How to solve linear equations in two variables?', answer:'There are three methods: Substitution method - express one variable in terms of the other and substitute. Elimination method - add or subtract equations to eliminate one variable. Cross-multiplication method - use formula for direct solution.', teacherId:'tch31', date:'2025-11-25' },
      { question:'What is Pythagoras theorem?', answer:'In a right-angled triangle, the square of the hypotenuse equals the sum of squares of the other two sides: a² + b² = c² where c is the hypotenuse (longest side).', teacherId:'tch56', date:'2025-12-01' },
      { question:'How do I find the LCM and HCF of two numbers?', answer:'LCM is the smallest number divisible by both numbers. HCF is the largest number dividing both numbers. Use prime factorization method: list prime factors and take highest/lowest common powers. Or use division method for HCF.', teacherId:'tch14', date:'2025-12-03' },
      { question:'What is the distance formula in coordinate geometry?', answer:'Distance between points (x1,y1) and (x2,y2) = √[(x2-x1)² + (y2-y1)²]. This is derived from Pythagoras theorem applied to the coordinate plane.', teacherId:'tch29', date:'2025-12-05' }
    ],
    science: [
      { question:'What is the difference between potential and kinetic energy?', answer:'Potential energy is stored energy due to position (e.g., a ball at height has gravitational PE). Kinetic energy is energy of motion (e.g., a moving car). PE = mgh, KE = ½mv².', teacherId:'tch11', date:'2025-11-16' },
      { question:'How does a rainbow form?', answer:'Rainbow forms due to dispersion of sunlight through water droplets in the atmosphere. When sunlight enters a water droplet, it refracts, reflects internally, and disperses into its constituent colors - VIBGYOR (Violet, Indigo, Blue, Green, Yellow, Orange, Red).', teacherId:'tch37', date:'2025-11-19' },
      { question:'What is Newton third law of motion?', answer:'Every action has an equal and opposite reaction. When you push a wall, the wall pushes you back with equal force. When a bird flies, it pushes air downward and air pushes it upward.', teacherId:'tch25', date:'2025-11-21' },
      { question:'What is photosynthesis?', answer:'Photosynthesis is the process by which plants convert light energy into chemical energy. It occurs in chloroplasts: 6CO₂ + 6H₂O → C₆H₁₂O₆ + 6O₂. Sunlight, chlorophyll, water and carbon dioxide are essential.', teacherId:'tch48', date:'2025-11-24' },
      { question:'What are acids and bases?', answer:'Acids release H+ ions in water (sour taste, turn blue litmus red) e.g., HCl, H₂SO₄. Bases release OH- ions (bitter taste, turn red litmus blue) e.g., NaOH, KOH. pH scale measures acidity/alkalinity (0-14).', teacherId:'tch19', date:'2025-11-27' },
      { question:'How does the human heart work?', answer:'The heart has 4 chambers: 2 atria (upper) and 2 ventricles (lower). Deoxygenated blood enters right atrium → right ventricle → lungs for oxygenation. Oxygenated blood returns to left atrium → left ventricle → body. The heart beats about 72 times per minute.', teacherId:'tch63', date:'2025-11-29' },
      { question:'What is the difference between speed and velocity?', answer:'Speed is scalar - only magnitude (e.g., 60 km/h). Velocity is vector - magnitude with direction (e.g., 60 km/h north). Speed is distance/time, velocity is displacement/time.', teacherId:'tch52', date:'2025-12-02' },
      { question:'How do vaccines work?', answer:'Vaccines contain weakened or inactive parts of a pathogen. When injected, they stimulate the immune system to produce antibodies. The body develops memory cells that quickly respond if the real pathogen attacks later.', teacherId:'tch71', date:'2025-12-04' }
    ],
    english: [
      { question:'What is the difference between active and passive voice?', answer:'In active voice, the subject performs the action: "The cat chased the mouse." In passive voice, the subject receives the action: "The mouse was chased by the cat." Passive voice uses "be" verb + past participle.', teacherId:'tch16', date:'2025-11-17' },
      { question:'How to identify parts of speech?', answer:'8 parts of speech: Noun (person/place/thing), Pronoun (replaces noun), Verb (action/state), Adjective (describes noun), Adverb (describes verb), Preposition (shows relationship), Conjunction (connects), Interjection (exclamation).', teacherId:'tch44', date:'2025-11-20' },
      { question:'What is the difference between direct and indirect speech?', answer:'Direct speech quotes exact words: She said, "I am happy." Indirect speech reports without quotes: She said that she was happy. Tense, pronouns and time words change in indirect speech.', teacherId:'tch28', date:'2025-11-23' },
      { question:'How to write a good essay?', answer:'Structure: Introduction (hook + thesis), Body paragraphs (topic sentence + evidence + explanation), Conclusion (restate + summarize + closing thought). Use transitional words and maintain coherence throughout.', teacherId:'tch67', date:'2025-11-26' },
      { question:'What are tenses and their types?', answer:'Three main tenses: Past, Present, Future. Each has four aspects: Simple (habitual), Continuous (ongoing), Perfect (completed), Perfect Continuous (ongoing until a point). Total 12 tense variations.', teacherId:'tch55', date:'2025-11-28' },
      { question:'How to improve English vocabulary?', answer:'Read widely (newspapers, books), maintain a vocabulary journal, learn word roots (prefixes/suffixes), use flashcards (Anki), practice with word games, use new words in daily conversation and writing.', teacherId:'tch83', date:'2025-12-01' },
      { question:'What is the difference between simile and metaphor?', answer:'Simile uses "like" or "as" to compare: "She sings like a nightingale." Metaphor directly states comparison: "She is a nightingale." Both are figures of speech used for vivid descriptions.', teacherId:'tch38', date:'2025-12-03' }
    ],
    hindi: [
      { question:'"à¤ªà¥�à¤°à¥‡à¤®à¤šà¤‚à¤¦ à¤•à¥€ à¤•à¤¹à¤¾à¤¨à¤¿à¤¯à¥‹à¤‚ à¤•à¥€ à¤®à¥�à¤–à¥�à¤¯ à¤µà¤¿à¤¶à¥‡à¤·à¤¤à¤¾à¤à¤‚ à¤•à¥�à¤¯à¤¾ à¤¹à¥ˆà¤‚?', answer:'à¤ªà¥�à¤°à¥‡à¤®à¤šà¤‚à¤¦ à¤¨à¥‡ à¤—à¤¾à¤�à¤µ à¤”à¤° à¤¶à¤¹à¤° à¤•à¥‡ à¤œà¥€à¤µà¤¨ à¤•à¥‹ à¤¯à¤¥à¤¾à¤°à¥�à¤¥ à¤šà¤¿à¤¤à¥�à¤°à¤¿à¤¤ à¤•à¤¿à¤¯à¤¾ à¤¹à¥ˆà¥¤ à¤‰à¤¨à¤•à¥€ à¤•à¤¹à¤¾à¤¨à¤¿à¤¯à¥‹à¤‚ à¤®à¥‡à¤‚ à¤¸à¤¾à¤®à¤¾à¤œà¤¿à¤• à¤¯à¥�à¤¥à¥�à¤¯à¥‹à¤‚, à¤®à¤¾à¤¨à¤µà¥€à¤¯ à¤®à¥‚à¤²à¥�à¤¯à¥‹à¤‚ à¤”à¤° à¤¯à¤¥à¤¾à¤°à¥�à¤¥à¤¤à¤¾ à¤•à¤¾ à¤šà¤¿à¤¤à¥�à¤°à¤£ à¤®à¤¿à¤²à¤¤à¤¾ à¤¹à¥ˆà¥¤', teacherId:'tch59', date:'2025-11-18' },
      { question:'à¤µà¤¿à¤¶à¥‡à¤·à¤£ à¤•à¥�à¤¯à¤¾ à¤¹à¥‹à¤¤à¥‡ à¤¹à¥ˆà¤‚?', answer:'à¤µà¤¿à¤¶à¥‡à¤·à¤£ à¤µà¥‡ à¤¶à¤¬à¥�à¤¦ à¤¹à¥ˆà¤‚ à¤œà¥‹ à¤¸à¤‚à¤œà¥�à¤žà¤¾ à¤¯à¤¾ à¤¸à¤°à¥�à¤µà¤¨à¤¾à¤® à¤•à¥€ à¤µà¤¿à¤¶à¥‡à¤·à¤¤à¤¾ à¤¬à¤¤à¤¾à¤¤à¥‡ à¤¹à¥ˆà¤‚à¥¤ à¤œà¥ˆà¤¸à¥‡ - à¤²à¤¾à¤² à¤«à¥‚à¤², à¤¸à¥�à¤¦à¤° à¤²à¤¡à¤¼à¤•à¥€à¥¤ à¤µà¤¿à¤¶à¥‡à¤·à¤£ à¤šà¤¾à¤° à¤ªà¥�à¤°à¤•à¤¾à¤° à¤•à¥‡ à¤¹à¥‹à¤¤à¥‡ à¤¹à¥ˆà¤‚: à¤—à¥�à¤£à¤µà¤¾à¤šà¤•, à¤ªà¤°à¤¿à¤®à¤¾à¤£à¤µà¤¾à¤šà¤•, à¤¸à¤°à¥�à¤µà¤¨à¤¾à¤®à¤¿à¤•, à¤¸à¤‚à¤–à¥�à¤¯à¤¾à¤µà¤¾à¤šà¤•à¥¤', teacherId:'tch35', date:'2025-11-22' }
    ],
    social: [
      { question:'What were the causes of the French Revolution?', answer:'Main causes: Social inequality (Three Estates system), Economic crisis (heavy taxes, bankruptcy), Political causes (absolute monarchy), Intellectual causes (Enlightenment ideas), Immediate cause (calling of Estates General in 1789).', teacherId:'tch12', date:'2025-11-16' },
      { question:'How does the Indian parliamentary system work?', answer:'India has a bicameral parliament: Lok Sabha (lower house, directly elected) and Rajya Sabha (upper house, indirectly elected). The President is head of state, PM is head of government. Bills must pass both houses and get Presidential assent.', teacherId:'tch47', date:'2025-11-19' },
      { question:'What are the major rivers of India?', answer:'Major Himalayan rivers: Indus, Ganges, Brahmaputra (perennial). Major Peninsular rivers: Godavari, Krishna, Kaveri, Narmada, Tapi (seasonal). Ganges is the longest river in India at 2525 km.', teacherId:'tch34', date:'2025-11-23' },
      { question:'What is democracy and its features?', answer:'Democracy is government of the people, by the people, for the people. Features: Free and fair elections, Fundamental rights, Independent judiciary, Rule of law, Multi-party system, Universal adult franchise, Accountability and transparency.', teacherId:'tch21', date:'2025-11-25' },
      { question:'What were the effects of British rule in India?', answer:'Economic: Drain of wealth, deindustrialization, commercialization of agriculture. Social: Western education, social reforms, railway/telegraph. Political: Nationalism grew, unified administration, modern bureaucracy. Economic exploitation led to poverty and famines.', teacherId:'tch72', date:'2025-11-28' },
      { question:'How are mountains formed?', answer:'Mountains form through tectonic plate movements. Three types: Fold mountains (Himalayas - collision of Indian & Eurasian plates), Block mountains (faulting), Volcanic mountains (volcanic eruptions). Young fold mountains are the tallest.', teacherId:'tch58', date:'2025-12-02' }
    ],
    physics: [
      { question:'What is Ohms law?', answer:'Ohm law states that current through a conductor is directly proportional to voltage across it, provided physical conditions remain constant. V = IR, where V is voltage, I is current, R is resistance. SI unit of resistance is ohm (Ω).', teacherId:'tch18', date:'2025-11-17' },
      { question:'How does an electric motor work?', answer:'An electric motor converts electrical energy to mechanical energy. It works on the principle that a current-carrying conductor placed in a magnetic field experiences a force (Fleming left-hand rule). The coil rotates due to this force.', teacherId:'tch41', date:'2025-11-20' },
      { question:'What is the law of conservation of energy?', answer:'Energy cannot be created nor destroyed, only converted from one form to another. Total energy of an isolated system remains constant. Example: In a pendulum, potential energy converts to kinetic energy and back.', teacherId:'tch33', date:'2025-11-24' },
      { question:'How do lenses work?', answer:'Convex lens converges light rays (used in magnifying glass, camera). Concave lens diverges light rays (used in spectacles for nearsightedness). Lens formula: 1/f = 1/v - 1/u. Power of lens: P = 1/f (diopters).', teacherId:'tch61', date:'2025-11-27' },
      { question:'What is the difference between series and parallel circuits?', answer:'Series: Same current flows through all components, voltage divides, R_total = R1+R2+... Parallel: Same voltage across all components, current divides, 1/R_total = 1/R1+1/R2+... Most household circuits are parallel.', teacherId:'tch45', date:'2025-11-30' },
      { question:'What is Archimedes principle?', answer:'When a body is immersed partially or fully in a fluid, it experiences an upward buoyant force equal to the weight of the fluid displaced by it. This explains why ships float and balloons rise.', teacherId:'tch76', date:'2025-12-03' }
    ],
    chemistry: [
      { question:'What is the difference between mixtures and compounds?', answer:'Mixtures: substances combined physically, variable composition, can be separated by physical methods. Compounds: elements combined chemically, fixed composition, can only be separated by chemical methods. Example: Air (mixture), Water (compound).', teacherId:'tch22', date:'2025-11-18' },
      { question:'How does a chemical reaction occur?', answer:'Reactant molecules collide with sufficient energy (activation energy) and proper orientation. Bonds break and form, creating products. Factors affecting rate: Temperature, concentration, surface area, catalyst, pressure.', teacherId:'tch39', date:'2025-11-21' },
      { question:'What is the periodic law?', answer:'Mendeleev periodic law: Properties of elements are periodic functions of their atomic masses. Modern periodic law: Properties are periodic functions of their atomic numbers. Elements in same group have similar chemical properties.', teacherId:'tch54', date:'2025-11-25' },
      { question:'How to balance chemical equations?', answer:'Count atoms of each element on both sides. Adjust coefficients (numbers before formulas) to make them equal. Start with elements that appear in only one reactant and one product. Leave hydrogen and oxygen for last. Check that total atoms match on both sides.', teacherId:'tch68', date:'2025-11-28' },
      { question:'What are isotopes?', answer:'Isotopes are atoms of the same element with same number of protons but different number of neutrons. Same atomic number, different mass number. Example: Carbon-12, Carbon-13, Carbon-14. They have similar chemical properties but different physical properties.', teacherId:'tch77', date:'2025-12-01' },
      { question:'What is the pH scale?', answer:'pH scale ranges from 0-14. pH < 7: acidic (lower pH = stronger acid). pH = 7: neutral (pure water). pH > 7: basic/alkaline (higher pH = stronger base). pH = -log[H+]. Indicators like litmus, phenolphthalein measure pH.', teacherId:'tch91', date:'2025-12-04' }
    ],
    biology: [
      { question:'What is mitosis and meiosis?', answer:'Mitosis: Cell division producing 2 identical daughter cells (growth, repair). Meiosis: Cell division producing 4 genetically different gametes (reproduction). Mitosis has 1 division, meiosis has 2 divisions. Meiosis reduces chromosome number by half.', teacherId:'tch24', date:'2025-11-19' },
      { question:'How does DNA replicate?', answer:'DNA replication is semi-conservative. The double helix unwinds (helicase), each strand serves as template. DNA polymerase adds complementary nucleotides. Results in two identical DNA molecules, each with one old and one new strand.', teacherId:'tch43', date:'2025-11-22' },
      { question:'What is the function of different human organ systems?', answer:'Digestive: breaks down food. Respiratory: gas exchange (O₂/CO₂). Circulatory: transports nutrients and oxygen. Nervous: controls body functions. Excretory: removes waste. Endocrine: hormone regulation. Muscular: movement. Skeletal: support and protection.', teacherId:'tch36', date:'2025-11-26' },
      { question:'What is evolution and natural selection?', answer:'Evolution is change in species over time. Darwin theory of natural selection: Individuals with favorable traits survive and reproduce more. Over generations, these traits become more common in the population. Survival of the fittest.', teacherId:'tch62', date:'2025-11-29' },
      { question:'How do ecosystems function?', answer:'Ecosystems consist of biotic (living) and abiotic (non-living) components. Energy flows through food chains: Producers (plants) → Primary consumers → Secondary consumers → Tertiary consumers → Decomposers. Nutrients cycle through biogeochemical cycles.', teacherId:'tch75', date:'2025-12-02' }
    ]
  };

  // 9. Teacher Replies (200+ step-by-step explanations)
  var teacherReplies = [];
  (function() {
    var trQuestions = [
      'How to solve quadratic equations?','What is the difference between mitosis and meiosis?','How to find the area of a triangle?','What is Newton first law?','How to balance chemical equations?','What is the Pythagorean theorem?','How does the water cycle work?','What are rational numbers?','How to write a formal letter?','What is the structure of an atom?','How to solve linear inequalities?','What is the greenhouse effect?','How to conjugate verbs in English?','What is the law of reflection?','How to calculate percentage?','What are polynomials?','How does digestion work?','What is the solar system?','How to simplify algebraic expressions?','What is the cell theory?','How to calculate mean median mode?','What are electromagnetic waves?','How to identify acids and bases?','What is the food chain?','How to solve probability problems?','What is friction?','How to write a book review?','What are the layers of the Earth?','How to solve trigonometry problems?','What is the circulatory system?','How to find HCF and LCM?','What is the Doppler effect?','How to use prepositions correctly?','What is sedimentation and decantation?','How to calculate simple interest?','What is the periodic table?','How to write a story?','What is the human eye structure?','How to solve mensuration problems?','What are natural resources?'
    ];
    var trAnswers = [
      'Step 1: Write the equation in standard form ax²+bx+c=0. Step 2: Identify a, b, c. Step 3: Apply quadratic formula: x = [-b ± sqrt(b²-4ac)]/2a. Step 4: Simplify under the square root. Step 5: Solve for both values of x.',
      'Mitosis: Single division producing 2 identical diploid cells for growth/repair. Prophase, Metaphase, Anaphase, Telophase. Meiosis: Two divisions producing 4 haploid gametes for reproduction. Meiosis I separates homologous chromosomes, Meiosis II separates sister chromatids.',
      'Area of triangle = ½ × base × height. For right triangles: ½ × (product of legs). Using Herons formula when all sides known: s = (a+b+c)/2, Area = sqrt[s(s-a)(s-b)(s-c)].',
      'Newton First Law (Law of Inertia): An object at rest stays at rest, and an object in motion stays in motion with same speed and direction, unless acted upon by an external unbalanced force.',
      'Step 1: Write unbalanced equation. Step 2: Count atoms of each element on both sides. Step 3: Add coefficients to balance, starting with elements appearing least frequently. Step 4: Verify hydrogen and oxygen balance. Step 5: Check all atoms match.',
      'In a right triangle: a² + b² = c² where c is the hypotenuse (longest side). Used to find unknown side lengths. Example: 3² + 4² = 5² (9+16=25).',
      'Water evaporates from oceans/lakes → Forms clouds (condensation) → Falls as rain (precipitation) → Runs into rivers/oceans → Repeats. Transpiration from plants also adds water vapor to atmosphere.',
      'Rational numbers are numbers that can be expressed as p/q where p,q are integers and q≠0. Includes integers, fractions, terminating decimals, repeating decimals. Examples: -3, ½, 0.75, 0.333...',
      'Sender address (top right), Date, Recipient address (left), Subject line, Salutation (Dear Sir/Madam), Body, Closing (Yours faithfully), Signature. Keep paragraphs short and language formal.',
      'Atom consists of: Nucleus (protons + neutrons) at center, surrounded by electrons in shells/ orbitals. Protons (+) and electrons (-) are equal in number overall. Neutrons have no charge.',
      'Step 1: Treat inequality as equation to find boundary points. Step 2: Plot points on number line. Step 3: Test points in each region. Step 4: Shade region satisfying inequality. For compound inequalities, find intersection of solution sets.',
      'Greenhouse gases (CO₂, CH₄, H₂O) trap heat in Earth atmosphere. Sunlight enters, Earth radiates infrared heat, greenhouse gases absorb and re-radiate some back. Natural greenhouse effect keeps Earth warm, but excess causes global warming.',
      'Remove -ar, -er, -ir endings to get stem. Add appropriate endings based on subject and tense. Present tense: -o, -as, -a, -amos, -áis, -an for -ar verbs. Practice with common verbs like hablar, comer, vivir.',
      'Law of Reflection: Angle of incidence = Angle of reflection (∠i = ∠r). Incident ray, reflected ray and normal all lie in same plane. Used in mirrors and optical instruments.',
      'Percentage = (Part/Whole) × 100%. To find percentage of a number: multiply by percentage/100. To find what percent one number is of another: divide and multiply by 100.',
      'Polynomials are algebraic expressions with variables raised to non-negative integer powers. Degree is highest power. Types: Monomial (1 term), Binomial (2 terms), Trinomial (3 terms). Standard form arranges terms by descending degree.',
      'Digestion begins in mouth (chewing + enzymes). Food goes through esophagus to stomach (acid + enzymes break down). Small intestine absorbs nutrients (villi increase surface area). Large intestine absorbs water. Undigested material exits as feces.',
      'Sun at center, 8 planets: Mercury, Venus, Earth, Mars (inner rocky), Jupiter, Saturn, Uranus, Neptune (outer gas giants). Dwarf planets include Pluto. Planets orbit in elliptical paths due to gravity.',
      'Use distributive property: a(b+c) = ab+ac. Combine like terms (same variables and exponents). Add/subtract coefficients. Simplify step by step. Example: 3x+2y-5x+y = -2x+3y.',
      'All living things are made of cells. Cells are basic unit of life. All cells arise from pre-existing cells. Three parts: Cell membrane, cytoplasm, nucleus. Organelles perform specific functions.',
      'Mean = sum of values / number of values. Median = middle value when sorted (average of two middle if even count). Mode = most frequent value. Range = maximum - minimum.',
      'Electromagnetic waves have electric and magnetic fields oscillating perpendicularly. Travel at speed of light (3×10⁸ m/s). Spectrum: Radio, Microwave, Infrared, Visible, UV, X-ray, Gamma (increasing frequency/decreasing wavelength).',
      'Use litmus paper: Acids turn blue litmus red. Bases turn red litmus blue. pH paper gives numerical value. Common acids: HCl, H₂SO₄, CH₃COOH. Common bases: NaOH, KOH, Ca(OH)₂.',
      'Food chain: Producers (plants) → Primary consumers (herbivores) → Secondary consumers (carnivores) → Tertiary consumers (top predators) → Decomposers break down dead matter. Energy decreases at each trophic level (10% rule).',
      'P(event) = favorable outcomes / total outcomes. Range 0 to 1. For independent events: P(A and B) = P(A) × P(B). For mutually exclusive events: P(A or B) = P(A) + P(B).',
      'Friction is force opposing relative motion between surfaces. Types: Static (prevents motion), Kinetic/sliding (opposes motion), Rolling (least friction). Factors: Surface roughness, normal force. Can be reduced by lubrication.',
      'Summary of book without spoilers. Include: Title, author, genre, main characters, plot overview, themes, writing style. Give honest opinion with examples. Rate and recommend to suitable readers. Avoid excessive plot details.',
      'Crust (outermost: continental/oceanic), Mantle (thickest: semi-solid rock), Outer core (liquid iron-nickel), Inner core (solid iron-nickel, ~5500°C). Lithosphere = crust + upper mantle.',
      'SOH CAH TOA: sinθ = opposite/hypotenuse, cosθ = adjacent/hypotenuse, tanθ = opposite/adjacent. Use calculator for values. Find angles using inverse functions (sin⁻¹, cos⁻¹, tan⁻¹).',
      'Heart pumps blood through vessels: Arteries carry oxygenated blood away (except pulmonary), Veins carry deoxygenated blood toward heart (except pulmonary), Capillaries exchange nutrients/waste. Pulmonary circuit: heart-lungs. Systemic circuit: heart-body.',
      'HCF: Largest number dividing all given numbers. Use prime factorization (common lowest powers) or Euclid algorithm (divide repeatedly). LCM: Smallest number divisible by all given numbers. Use prime factorization (highest powers).',
      'Change in observed frequency when source and observer move relative to each other. Source approaching: higher frequency (blue shift). Source receding: lower frequency (red shift). Used in radar, astronomy.',
      'Prepositions show relationships of time (at 5pm, on Monday, in June), place (at school, on table, in room), direction (to, from, into), manner (by bus, with care). Learn common collocations.',
      'Sedimentation: heavier particles settle at bottom when mixture is left undisturbed. Decantation: carefully pouring out clear liquid after sedimentation. Used for separating insoluble solids from liquids.',
      'SI = P × R × T / 100. P = Principal (initial amount), R = Rate of interest (per annum), T = Time (years). Amount = P + SI. For compound interest: CI = P(1+R/100)^T - P.',
      'Periodic table arranges elements by atomic number. Periods (rows): same number of electron shells. Groups (columns): same number of valence electrons, similar chemical properties. Metals left, non-metals right, metalloids along staircase.',
      'Beginning: Hook readers, introduce characters and setting. Middle: Develop conflict, build tension, show character growth. End: Resolve conflict, show consequences, satisfying conclusion. Use dialogue, description, varied sentence structures.',
      'Parts: Cornea (bends light), Iris (controls pupil size), Lens (focuses), Retina (contains photoreceptors - rods for dim light, cones for color), Optic nerve (transmits signals to brain). Accommodation: lens changes shape for near/far objects.',
      'Mensuration deals with geometric measurements. Area of 2D shapes: rectangle (l×b), circle (πr²), triangle (½bh). Volume of 3D shapes: cube (s³), cuboid (l×b×h), cylinder (πr²h), sphere (4/3πr³). Surface area formulas also needed.',
      'Renewable: Solar, wind, hydro, geothermal, biomass (replenished naturally). Non-renewable: Coal, petroleum, natural gas, minerals (limited, millions of years to form). Sustainable use of resources is crucial for future generations.'
    ];
    var subjForReply = ['Mathematics','Science','English','Hindi','Social Studies','Physics','Chemistry','Biology','Computer Science','Accountancy','Business Studies','Economics'];
    var replyVariations = [
      ' Here is a detailed walkthrough to help you understand better.',
      ' I hope this step-by-step explanation clarifies the concept.',
      ' Let me break this down for easier understanding.',
      ' This is a common question that many students ask.',
      ' The key is to understand the fundamental principle first.',
      ' Practice these steps and you will master this topic.',
      ' Remember to review the prerequisites before attempting this.',
      ' I have explained this in a simplified manner for quick understanding.',
      ' Focus on understanding the logic behind each step.',
      ' This concept builds upon previous topics covered in the curriculum.'
    ];
    for (var i = 0; i < 200; i++) {
      var idx = i % trQuestions.length;
      teacherReplies.push({
        id:'tr' + (i + 1),
        teacherId:'tch' + rand(1, 200),
        question:trQuestions[idx] + ' (variant ' + (Math.floor(i/trQuestions.length) + 1) + ')',
        reply:trAnswers[idx] + pick(replyVariations),
        subject:pick(subjForReply),
        timestamp:new Date(Date.now() - rand(0, 90) * 86400000).toISOString()
      });
    }
  })();

  // 10. Doubt Questions (100+)
  var doubtQuestions = [];
  (function() {
    var doubtStatuses = ['pending','answered','resolved'];
    var doubtSubjects = ['Mathematics','Science','English','Hindi','Social Studies','Physics','Chemistry','Biology','Computer Science'];
    var doubtTitles = [
      'Help me understand this concept please','Cannot solve this problem','Need clarification on the chapter','Explanation required for this topic','Stuck on this question','Please help me with this doubt','I am confused about this concept','Need step by step solution','Can someone explain this?','This is very difficult for me','I dont understand this at all','Please provide detailed explanation','Urgent help needed','Exam tomorrow need help','Practice question doubt','Concept not clear','Need teacher assistance','Please resolve my doubt']
    var doubtDetails = [
      'I have been trying to solve this but cannot figure out the approach. Please provide step by step solution.',
      'This concept was taught in class but I could not understand it fully. Can you explain in simpler terms?',
      'I am preparing for my exams and this topic is very important. Please help me understand it.',
      'The textbook explanation is too complicated. Can someone explain in a simple way with examples?',
      'I tried multiple methods but keep getting the wrong answer. Where am I going wrong?'];
    for (var i = 1; i <= 120; i++) {
      var status = pick(doubtStatuses);
      doubtQuestions.push({
        id:'dq' + i,
        studentId:'u' + rand(2, 301),
        teacherId: status !== 'pending' ? 'tch' + rand(1, 200) : null,
        subject:pick(doubtSubjects),
        title:pick(doubtTitles) + ' - ' + i,
        detail:pick(doubtDetails) + ' This is doubt number ' + i + '.',
        attachments: Math.random() > 0.7 ? [{ name:'image' + i + '.jpg', url:null }] : [],
        status:status,
        date:new Date(Date.now() - rand(0, 60) * 86400000).toISOString().split('T')[0],
        rating: status !== 'pending' ? rand(1, 5) : null
      });
    }
  })();

  // 11. Playlists (20+)
  var playlists = [];
  (function() {
    var plData = [
      { name:'Class 10 Mathematics Complete Guide', desc:'All chapters covered with NCERT solutions and previous year questions', subjectId:'s19', ids:[1,2,3,4,5,6,7,8,9,10,11,12,13,14] },
      { name:'Physics - Motion and Forces', desc:'Comprehensive playlist covering motion, force and laws of motion', subjectId:'s14', ids:[15,16,17,18,19,20] },
      { name:'Chemistry - Organic Chemistry Basics', desc:'Fundamental organic chemistry concepts for Class 11-12', subjectId:'s26', ids:[21,22,23,24,25,26,27,28,29,30] },
      { name:'Biology - Human Physiology', desc:'Complete human physiology chapter playlist', subjectId:'s38', ids:[31,32,33,34,35,36,37,38] },
      { name:'English Grammar Mastery', desc:'All grammar topics from basics to advanced', subjectId:'s3', ids:[39,40,41,42,43,44,45,46,47,48,49,50] },
      { name:'Trigonometry for Beginners', desc:'Learn trigonometry from scratch with solved examples', subjectId:'s19', ids:[51,52,53,54,55] },
      { name:'Calculus - Limits and Derivatives', desc:'Master limits and derivatives with step by step explanation', subjectId:'s28', ids:[56,57,58,59,60,61,62] },
      { name:'Chemical Reactions and Equations', desc:'Class 10 Chemistry Chapter 1 complete playlist', subjectId:'s21', ids:[63,64,65,66,67] },
      { name:'Indian History - Modern India', desc:'Modern Indian history for competitive exams', subjectId:'s24', ids:[68,69,70,71,72,73] },
      { name:'Science Experiments at Home', desc:'Fun and educational science experiments using household items', subjectId:'s2', ids:[74,75,76,77,78] },
      { name:'Vedic Mathematics Tricks', desc:'Speed math techniques for competitive exams', subjectId:'s1', ids:[79,80,81,82,83,84] },
      { name:'Cell Biology Complete Series', desc:'From cell theory to cell division - everything covered', subjectId:'s27', ids:[85,86,87,88,89,90] },
      { name:'Python Programming for Beginners', desc:'Learn Python from scratch with practical examples', subjectId:'s79', ids:[91,92,93,94,95,96,97] },
      { name:'Accountancy Basics', desc:'Journal entries, ledger, trial balance and financial statements', subjectId:'s30', ids:[98,99,100,101,102] },
      { name:'Economics - Microeconomics', desc:'Supply demand market equilibrium and more', subjectId:'s32', ids:[103,104,105,106,107,108] },
      { name:'Hindi Literature - Important Chapters', desc:'Key chapters from Hindi course with summaries', subjectId:'s71', ids:[109,110,111,112,113] },
      { name:'Geometry - Triangles and Circles', desc:'Properties, theorems and constructions', subjectId:'s13', ids:[114,115,116,117,118,119,120] },
      { name:'Environmental Science', desc:'Ecosystem, biodiversity and environmental issues', subjectId:'s38', ids:[121,122,123,124,125] },
      { name:'Grammar - Tenses and Voice', desc:'Complete tense system and active/passive voice', subjectId:'s3', ids:[126,127,128,129,130,131] },
      { name:'Mensuration Formulas and Problems', desc:'Area, volume and surface area of all shapes', subjectId:'s9', ids:[132,133,134,135,136,137,138,139] },
      { name:'Electrostatics and Current Electricity', desc:'Complete electrostatics and current electricity for Class 12', subjectId:'s36', ids:[140,141,142,143,144,145,146,147,148] },
      { name:'Social Studies - Indian Constitution', desc:'The Indian Constitution explained simply', subjectId:'s12', ids:[149,150,151,152,153,154,155] }
    ];
    var videoCount = videos.length;
    for (var i = 0; i < plData.length; i++) {
      var d = plData[i];
      var vids = d.ids.map(function(x) { return 'v' + (x <= videoCount ? x : rand(1, videoCount)); });
      playlists.push({
        id:'pl' + (i + 1), name:d.name, description:d.desc,
        subjectId:d.subjectId, videoIds:vids,
        createdBy:pick(['Admin','Teacher Panel','Curriculum Team','Subject Expert']),
        videoCount:vids.length
      });
    }
  })();

  // 12. More Feed Comments (500+)
  var feedComments = [];
  (function() {
    var commentTexts = [
      'Great post! Very helpful.','Thanks for sharing this information.','I learned a lot from this.','Can you explain more?','This is exactly what I needed.','Very informative! Keep it up.','I have been looking for this.','Excellent explanation!','Thanks a ton!','This helped me clear my doubts.','Please post more such content.','Wonderful! Bookmarked this.','So well explained.','I was struggling with this.','Now I understand better.','Very useful for exam preparation.','This should be pinned!','Amazing work!','Really appreciate your effort.','This is gold!','Sharing this with my friends.','Best explanation I have seen.','Kudos to the team!','Very well structured.','Can we get more examples?','This simplified everything.','I wish I found this earlier.','Perfect for revision.','Clear and concise.','Subscribed for more content!','This deserves more views.','Mind blown! So simple now.','Thank you so much!','Very practical approach.','Loved the way you explained.','This made my day!','Finally I get it.','Such an important topic.','Well researched content.','Please make a video on this.','Is this available as PDF?','Can you share the notes?','Very detailed explanation.','I recommend this to everyone.','This is underrated.','Quality content right here.','You are doing great work!','Please continue this series.','This changed my perspective.','Very helpful for beginners.','Advanced level explanation needed?','Can you solve more problems?','I want to practice more.','Where can I find worksheets?','Please share practice questions.','This is better than my textbook.','Very intuitive explanation.','You made it look easy!','I struggled with this for weeks.','Now it all makes sense.','Brilliant explanation!','Super helpful!','Thank you for the detailed walkthrough.','Excellent resource for students.','This should be in the curriculum.','Very thoughtfully written.','I appreciate the effort.','Please make more such posts.','This is a game changer.','Very valuable information.','Thanks for helping the community.'
    ];
    var feedPostPool = feedPosts || [];
    for (var i = 0; i < feedPostPool.length; i++) {
      var extraCount = rand(0, 3);
      for (var j = 0; j < extraCount; j++) {
        var nestedReplies = [];
        var nestedCount = rand(0, 2);
        for (var k = 0; k < nestedCount; k++) {
          nestedReplies.push({
            id:'fcr_' + i + '_' + j + '_' + k,
            author:pick(students.filter(function(s){return s.role==='student';})).name || 'Anonymous',
            content:pick(commentTexts),
            createdAt:randDateTime(), likes:rand(0, 5)
          });
        }
        feedPostPool[i].comments = (feedPostPool[i].comments || 0) + 1;
      }
    }
    var extraComments = [];
    for (var ci = 0; ci < 500; ci++) {
      var targetPost = feedPostPool[Math.floor(Math.random() * feedPostPool.length)];
      if (!targetPost) continue;
      var hasNested = Math.random() > 0.7;
      extraComments.push({
        id:'fc' + (ci + 1),
        postId:targetPost.id,
        author:pick(students.filter(function(s){return s.role==='student';})).name || 'Anonymous',
        content:pick(commentTexts),
        createdAt:randDateTime(), likes:rand(0, 15),
        replies: hasNested ? [
          { id:'fcr_' + ci + '_0', author:pick(students.filter(function(s){return s.role==='student';})).name, content:pick(commentTexts), createdAt:randDateTime(), likes:rand(0, 3) }
        ] : []
      });
    }
    feedComments = extraComments;
  })();

  // 13. Teacher Schedules (50 teachers)
  var teacherSchedules = [];
  (function() {
    var days = ['Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];
    var times = ['8:00 AM','9:00 AM','10:00 AM','11:00 AM','12:00 PM','1:00 PM','2:00 PM','3:00 PM','4:00 PM'];
    var subjects = []; SUBJECTS.forEach(function(s) { if (s.name) subjects.push(s); });
    var classLevels = [1,2,3,4,5,6,7,8,9,10,11,12];
    var topicWords = ['Introduction','Fundamentals','Advanced Concepts','Problem Solving','Revision','Practice Session','Doubt Clearing','Quick Review','Assessment','Group Discussion','Lab Work','Project Work','Case Study','Quiz','Test'];
    for (var i = 1; i <= 50; i++) {
      var tchId = 'tch' + rand(1, 200);
      var dayCount = rand(3, 6);
      for (var d = 0; d < dayCount; d++) {
        var subj = pick(subjects);
        teacherSchedules.push({
          id:'tsch' + teacherSchedules.length + 1,
          teacherId:tchId,
          day:days[d % days.length],
          time:pick(times),
          subject:subj.name,
          class:pick(classLevels),
          topic:pick(topicWords) + ' of ' + (pick(CHAPTER_NAMES[subj.id] || ['Chapter'])) + ' - ' + subj.name
        });
      }
    }
  })();

  // 14. Calendar Events (100+)
  var calendarEvents = [];
  (function() {
    var ceTypes = ['study-session','assignment','exam','personal'];
    var ceTitles = ['Study Session: ','Complete Assignment: ','Exam Preparation: ','Personal Study Time','Group Study: ','Math Practice Session','Science Revision','English Grammar Practice','Hindi Writing Practice','History Timeline Review','Geography Map Practice','Physics Numerical Session','Chemistry Formula Revision','Biology Diagram Practice','Computer Lab Session','Weekly Revision Plan','Mock Test Practice','Doubt Clearing Session','Chapter Review','Topic Wise Practice','Previous Year Paper Solving','Formula Memorization Session','Diagram Labelling Practice','Speed Test','Concept Map Creation','Mind Map Revision','Flashcard Review Session','Peer Teaching Session','Online Class','Doubt Solving Marathon'];
    var ceNotes = ['Focus on understanding concepts rather than memorization.','Practice at least 10 problems from this chapter.','Create revision notes for quick reference before exams.','Use Pomodoro technique: 25 min study + 5 min break.','Review previous year questions for better preparation.','Make sure to solve NCERT exercises first.','Draw diagrams and label them properly.','Practice writing answers within time limit.','Use flashcards for important formulas and definitions.','Discuss difficult concepts with study group.'];
    for (var i = 1; i <= 120; i++) {
      var startDate = new Date(Date.now() + rand(0, 90) * 86400000);
      var endDate = new Date(startDate.getTime() + rand(30, 180) * 60000);
      var tp = pick(ceTypes);
      calendarEvents.push({
        id:'cev' + i,
        title:pick(ceTitles) + (i > 20 ? pick(SUBJECTS).name : ''),
        start:startDate.toISOString(),
        end:endDate.toISOString(),
        type:tp,
        description:pick(ceNotes) + ' This event is scheduled for effective time management.',
        allDay:Math.random() > 0.8,
        subjectId:pick(SUBJECT_LIST),
        color: tp === 'study-session' ? '#3b82f6' : tp === 'assignment' ? '#f59e0b' : tp === 'exam' ? '#ef4444' : '#10b981'
      });
    }
  })();

  var coupons = [
    { code:'STUDY10', discount:10, type:'percentage', minAmount:500, validUntil:'2027-12-31', usageLimit:1000, used:234 },
    { code:'FIRST50', discount:50, type:'flat', minAmount:200, validUntil:'2026-12-31', usageLimit:500, used:128 },
    { code:'FREESHIP', discount:100, type:'flat', minAmount:299, validUntil:'2026-12-31', usageLimit:300, used:89, description:'Free shipping' },
    { code:'SUMMER25', discount:25, type:'percentage', minAmount:999, validUntil:'2026-09-30', usageLimit:200, used:45 },
    { code:'PRO10', discount:10, type:'percentage', minAmount:0, validUntil:'2026-12-31', usageLimit:1000, used:567, description:'Pro plan discount' },
    { code:'MEGA50', discount:50, type:'percentage', minAmount:2000, validUntil:'2026-08-31', usageLimit:100, used:12 }
  ];

  var enrolledClasses = [
    { userId:'u2', classId:11, stream:'science', enrolledAt:'2025-04-01', progress:35 },
    { userId:'u3', classId:10, stream:null, enrolledAt:'2025-03-15', progress:52 },
    { userId:'u4', classId:12, stream:'commerce', enrolledAt:'2025-02-01', progress:68 },
    { userId:'u5', classId:9, stream:null, enrolledAt:'2025-04-10', progress:22 },
    { userId:'u6', classId:11, stream:'arts', enrolledAt:'2025-04-05', progress:15 },
    { userId:'u7', classId:8, stream:null, enrolledAt:'2025-05-01', progress:8 },
    { userId:'u8', classId:12, stream:'science', enrolledAt:'2025-01-20', progress:80 },
    { userId:'u9', classId:10, stream:null, enrolledAt:'2025-04-12', progress:41 },
    { userId:'u10', classId:11, stream:'commerce', enrolledAt:'2025-03-01', progress:55 }
  ];

  var categories = ['books','stationery','courses','premium-notes','exam-kits','practice-papers','mock-tests','electronics','calculators','science-kits','art-supplies','programming','languages'];

  // ==================== VIRTUAL LABS ====================
  var virtualLabs = [
    // --- Physics (s20 - Class 10) ---
    { id:'vl1', subjectId:'s20', title:'Ohm\'s Law', description:'Verify Ohm\'s law and determine the resistance of a given wire using a voltmeter and ammeter.', objective:'To establish the relationship between potential difference and current in a conductor.', materials:['Battery 6V','Connecting wires','Resistor (10Ω)','Ammeter (0-1A)','Voltmeter (0-6V)','Rheostat','Switch','Key'], procedure:['Set up the circuit with battery, ammeter, resistor and rheostat in series, voltmeter in parallel across the resistor.','Keep the rheostat at maximum resistance and close the switch.','Note the ammeter and voltmeter readings.','Slide the rheostat to vary the resistance and record 5 sets of V and I values.','Plot a graph of V vs I.','Calculate the slope to find resistance R = V/I.'], observations:[{ V:0.5, I:0.05 },{ V:1.0, I:0.10 },{ V:1.5, I:0.15 },{ V:2.0, I:0.20 },{ V:2.5, I:0.25 }], result:'The V-I graph is a straight line passing through origin, confirming Ohm\'s law. Resistance calculated = 10Ω.', vivaQuestions:['State Ohm\'s law.','What is the SI unit of resistance?','What factors affect the resistance of a conductor?','What is the difference between ohmic and non-ohmic conductors?'], safetyInstructions:['Do not touch bare wires with wet hands.','Do not exceed the voltage rating of components.','Switch off the circuit when not in use.'], difficulty:'beginner', duration:45, image:null },
    { id:'vl2', subjectId:'s20', title:'Refraction of Light Through Glass Slab', description:'Trace the path of light through a rectangular glass slab and verify Snell\'s law.', objective:'To study refraction of light and verify Snell\'s law of refraction.', materials:['Rectangular glass slab','Drawing board','White paper sheet','Drawing pins','Protractor','Scale','Pencil'], procedure:['Place a white paper on the drawing board and fix the glass slab at the centre.','Draw the outline ABCD of the slab.','Draw an incident ray at an angle of 30° and fix two pins P1, P2 on it.','Look through the opposite side and fix pins P3, P4 to appear in line with P1, P2.','Remove the slab and join the pin pricks to get emergent ray.','Measure angles of incidence, refraction and emergence.'], observations:[{ angleIncidence:30, angleRefraction:19, angleEmergence:30 },{ angleIncidence:45, angleRefraction:28, angleEmergence:45 },{ angleIncidence:60, angleRefraction:35, angleEmergence:60 }], result:'The angle of incidence equals the angle of emergence. The refracted ray bends towards the normal.', vivaQuestions:['What is Snell\'s law?','What is the refractive index of glass?','What happens when light travels from rarer to denser medium?','Define critical angle.'], safetyInstructions:['Handle glass slab carefully to avoid breakage.','Use sharp pins carefully.'], difficulty:'beginner', duration:50, image:null },
    { id:'vl3', subjectId:'s20', title:'Simple Pendulum', description:'Determine the acceleration due to gravity using a simple pendulum.', objective:'To find the value of g (acceleration due to gravity) using a simple pendulum.', materials:['String (1m)','Metal bob','Stopwatch','Clamp stand','Meter scale','Protractor'], procedure:['Tie the bob to the string and suspend it from the clamp.','Measure the length L of the pendulum from the point of suspension to the centre of the bob.','Displace the bob by a small angle (less than 15°) and release it.','Measure the time for 20 oscillations using stopwatch.','Repeat for different lengths (80cm, 90cm, 100cm).','Calculate T² and plot L vs T² graph to find g.'], observations:[{ length:0.80, time20:35.8, period:1.79 },{ length:0.90, time20:38.0, period:1.90 },{ length:1.00, time20:40.0, period:2.00 }], result:'g = 4π²L/T² = 9.8 m/s². The graph of L vs T² is a straight line.', vivaQuestions:['What is a simple pendulum?','On what factors does the time period depend?','What is the effect of amplitude on time period?','Define second\'s pendulum.'], safetyInstructions:['Ensure the clamp is tight to prevent the pendulum from falling.','Do not displace the bob by more than 15°.'], difficulty:'beginner', duration:40, image:null },
    { id:'vl4', subjectId:'s20', title:'Focal Length of Convex Lens', description:'Determine the focal length of a convex lens using the distant object method and u-v method.', objective:'To find the focal length of a convex lens.', materials:['Convex lens','Lens holder','Screen','Candle','Meter scale','Optical bench'], procedure:['Mount the lens in front of a distant window (or sun) and focus the image on a screen.','Measure the distance between lens and screen - this gives approximate focal length.','Place the lens on optical bench with object (candle) at one end.','Move the screen to get a sharp image.','Measure u (object distance) and v (image distance).','Repeat for 5 positions and calculate f = uv/(u+v).'], observations:[{ u:30, v:30, f:15 },{ u:25, v:37.5, f:15 },{ u:35, v:26.25, f:15 },{ u:20, v:60, f:15 }], result:'Focal length of the given convex lens = 15 cm (mean value).', vivaQuestions:['What is the lens formula?','What is the difference between convex and concave lenses?','What is the power of a lens?','Define 1 dioptre.'], safetyInstructions:['Do not look directly at the sun through the lens.','Handle the lens by the edges to avoid smudging.'], difficulty:'intermediate', duration:50, image:null },
    { id:'vl5', subjectId:'s20', title:'Resistance of a Wire', description:'Determine the resistance per cm of a given wire using a metre bridge.', objective:'To find the resistance and resistivity of a given wire using metre bridge (Wheatstone bridge).', materials:['Metre bridge','Galvanometer','Battery (2V)','Rheostat','Resistance box','Connecting wires','Given wire','Jockey'], procedure:['Set up the metre bridge circuit with the wire in the left gap and resistance box in the right gap.','Close the key and touch jockey near the middle of the wire.','Adjust the resistance box to get null point at centre.','Note the balancing length L and resistance R.','Repeat for 4 different resistances.','Calculate unknown resistance using X = R(100-L)/L.'], observations:[{ resistanceBox:5, balancingLength:58.8, unknownX:3.5 },{ resistanceBox:10, balancingLength:41.2, unknownX:3.5 },{ resistanceBox:15, balancingLength:31.6, unknownX:3.5 }], result:'Mean resistance of the wire = 3.5Ω. Resistivity = RA/l = 1.1×10⁻⁶ Ωm.', vivaQuestions:['What is the principle of a Wheatstone bridge?','What is the condition for a balanced bridge?','How is resistivity calculated?','What are the applications of metre bridge?'], safetyInstructions:['Ensure proper connections to avoid short circuits.','Do not press the jockey too hard on the wire.'], difficulty:'intermediate', duration:55, image:null },
    { id:'vl6', subjectId:'s20', title:'Archimedes\' Principle', description:'Verify Archimedes\' principle and determine the relative density of a solid.', objective:'To verify Archimedes\' principle and find the relative density of a solid using a spring balance.', materials:['Spring balance (0-500g)','Solid metal cylinder','Overflow can','Measuring cylinder','Water','Thread','Beaker'], procedure:['Suspend the metal cylinder from the spring balance and note its weight in air (W₁).','Fill the overflow can with water up to the spout.','Completely immerse the cylinder in water and note the apparent weight (W₂).','Collect the displaced water in a measuring cylinder.','Find the weight of the displaced water (W₃).','Compare W₁ - W₂ with W₃.'], observations:[{ weightInAir:2.94, weightInWater:2.55, lossInWeight:0.39, displacedWaterWeight:0.39 }], result:'Loss in weight of the object = Weight of water displaced, verifying Archimedes\' principle. Relative density = W₁/(W₁-W₂) = 7.8.', vivaQuestions:['State Archimedes\' principle.','What is buoyancy?','Why does a ship float in water?','What is relative density?'], safetyInstructions:['Ensure the spring balance is calibrated.','Avoid parallax error while taking readings.'], difficulty:'beginner', duration:40, image:null },
    { id:'vl7', subjectId:'s20', title:'Velocity of Sound', description:'Determine the velocity of sound in air using a resonance tube.', objective:'To determine the velocity of sound in air at room temperature using a resonance tube.', materials:['Resonance tube','Tuning fork (512 Hz)','Water','Measuring cylinder','Rubber pad','Thermometer'], procedure:['Set up the resonance tube and fill it with water so that the water level is near the top.','Strike the tuning fork on a rubber pad and hold it near the mouth of the tube.','Lower the water level until the sound becomes loudest (first resonance).','Measure the length L₁ of the air column.','Lower the water further until second resonance is heard and measure L₂.','Velocity = 2ν(L₂ - L₁).'], observations:[{ frequency:512, firstResonance:16.2, secondResonance:50.0, velocity:346 },{ frequency:480, firstResonance:17.5, secondResonance:53.5, velocity:346 }], result:'Velocity of sound in air at room temperature = 346 m/s.', vivaQuestions:['What is a resonance tube?','What is the nature of sound waves in air?','How does temperature affect the velocity of sound?','What is an end correction?'], safetyInstructions:['Strike the tuning fork gently on the rubber pad.','Do not strike the fork on hard surfaces.'], difficulty:'advanced', duration:50, image:null },
    { id:'vl8', subjectId:'s20', title:'Newton\'s Second Law', description:'Verify Newton\'s second law of motion using an inclined plane or dynamics trolley.', objective:'To verify that acceleration is directly proportional to force and inversely proportional to mass.', materials:['Dynamics trolley','Pulley','Slotted weights (50g each)','String','Tickertape timer','Ruler','Inclined plane (optional)'], procedure:['Place the trolley on a smooth surface and connect it to weights via a string passing over a pulley.','Mark the tickertape and start the timer.','Release the trolley by adding a known mass on the weight hanger.','Analyse the tickertape to find acceleration.','Repeat with different forces (masses) and then with different trolley masses.','Plot graphs of a vs F and a vs 1/m.'], observations:[{ force:0.49, mass:1.0, acceleration:0.49 },{ force:0.98, mass:1.0, acceleration:0.98 },{ force:1.47, mass:1.0, acceleration:1.47 }], result:'Acceleration is directly proportional to force (a ∝ F) and inversely proportional to mass (a ∝ 1/m).', vivaQuestions:['State Newton\'s second law of motion.','What is the SI unit of force?','What is inertia?','How does friction affect the experiment?'], safetyInstructions:['Ensure the trolley does not fall off the table.','Use a controlled release mechanism.'], difficulty:'intermediate', duration:55, image:null },
    // --- Chemistry (s21 - Class 10) ---
    { id:'vl9', subjectId:'s21', title:'Acid-Base Titration', description:'Perform acid-base titration to determine the strength of a given sodium hydroxide solution.', objective:'To determine the concentration of NaOH solution by titrating it against a standard HCl solution.', materials:['Burette (50 mL)','Pipette (20 mL)','Conical flask (250 mL)','Standard HCl solution (0.1M)','NaOH solution (unknown)','Phenolphthalein indicator','Funnel','White tile'], procedure:['Wash and rinse the burette with HCl solution and fill it.','Pipette 20 mL of NaOH solution into the conical flask.','Add 2-3 drops of phenolphthalein indicator (pink colour appears).','Titrate by adding HCl from burette dropwise.','Stop when the pink colour just disappears (endpoint).','Note the volume of HCl used and calculate strength.'], observations:[{ titre1:18.5, titre2:18.4, titre3:18.5, meanTitre:18.47 }], result:'Strength of NaOH = (M₁V₁)/V₂ = (0.1×18.47)/20 = 0.09235 M.', vivaQuestions:['What is the endpoint in titration?','Why is phenolphthalein used?','What is a standard solution?','Define molarity.'], safetyInstructions:['Wear safety goggles and gloves.','Handle acids and bases carefully.','Dispose of chemicals properly.'], difficulty:'intermediate', duration:60, image:null },
    { id:'vl10', subjectId:'s21', title:'pH Test of Common Solutions', description:'Test the pH of various household solutions using universal indicator and pH paper.', objective:'To determine the pH of common solutions and classify them as acidic, basic or neutral.', materials:['Test tubes','Test tube stand','pH paper','Universal indicator solution','Hydrochloric acid (dilute)','Sodium hydroxide (dilute)','Vinegar','Lemon juice','Water','Soap solution','Baking soda solution','Lemon juice'], procedure:['Take 5 mL of each solution in separate labelled test tubes.','Dip a pH paper strip into each solution.','Compare the colour with the pH scale chart.','Alternatively, add 2 drops of universal indicator to each test tube.','Record the pH value and classify as acidic (0-6), neutral (7), or basic (8-14).'], observations:[{ solution:'Hydrochloric Acid', pH:1, nature:'Strongly acidic' },{ solution:'Lemon Juice', pH:3, nature:'Acidic' },{ solution:'Vinegar', pH:4, nature:'Acidic' },{ solution:'Pure Water', pH:7, nature:'Neutral' },{ solution:'Soap Solution', pH:9, nature:'Basic' },{ solution:'Baking Soda', pH:8, nature:'Weakly basic' },{ solution:'NaOH Solution', pH:13, nature:'Strongly basic' }], result:'Acids have pH < 7, bases have pH > 7, and neutral solutions have pH = 7.', vivaQuestions:['What is pH scale?', 'What does pH 7 indicate?', 'How does pH affect our daily life?', 'What is the pH of human blood?'], safetyInstructions:['Avoid contact with strong acids and bases.','Wash hands after the experiment.'], difficulty:'beginner', duration:30, image:null },
    { id:'vl11', subjectId:'s21', title:'Flame Test of Metal Ions', description:'Identify metal ions by the characteristic colour they impart to a Bunsen burner flame.', objective:'To identify the presence of metal ions using their characteristic flame colours.', materials:['Bunsen burner','Platinum/nichrome wire','Conc. HCl','Metal salt solutions (NaCl, KCl, CaCl₂, CuSO₄, BaCl₂, SrCl₂)','Watch glass'], procedure:['Clean the nichrome wire by dipping in conc. HCl and heating in the burner flame until colourless.','Dip the wire in NaCl solution and place it in the flame.','Observe and note the flame colour.','Repeat for each salt solution, cleaning the wire between tests.'], observations:[{ salt:'Sodium Chloride (NaCl)', flameColor:'Golden yellow', metalIon:'Na⁺' },{ salt:'Potassium Chloride (KCl)', flameColor:'Lilac/Pale violet', metalIon:'K⁺' },{ salt:'Calcium Chloride (CaCl₂)', flameColor:'Brick red', metalIon:'Ca²⁺' },{ salt:'Copper Sulphate (CuSO₄)', flameColor:'Blue-green', metalIon:'Cu²⁺' },{ salt:'Barium Chloride (BaCl₂)', flameColor:'Apple green', metalIon:'Ba²⁺' },{ salt:'Strontium Chloride (SrCl₂)', flameColor:'Crimson red', metalIon:'Sr²⁺' }], result:'Each metal ion imparts a characteristic colour to the flame, used for identification.', vivaQuestions:['Why do different metals give different flame colours?', 'What is the role of HCl in the experiment?', 'What is the atomic emission spectrum?', 'Why is nichrome wire used?'], safetyInstructions:['Use tongs while handling hot wires.','Perform the experiment in a well-ventilated area.','Do not touch the burner flame.'], difficulty:'beginner', duration:40, image:null },
    { id:'vl12', subjectId:'s21', title:'Preparation of Oxygen', description:'Prepare oxygen gas in the laboratory and test its properties.', objective:'To prepare oxygen gas by heating potassium chlorate and manganese dioxide mixture and test its properties.', materials:['Potassium chlorate (KClO₃)','Manganese dioxide (MnO₂)','Hard glass test tube','Delivery tube','Gas jar','Trough with water','Splinter','Bunsen burner'], procedure:['Mix KClO₃ and MnO₂ in a 3:1 ratio in a hard glass test tube.','Set up the apparatus with a delivery tube into a water trough.','Heat the test tube gently.','Collect the oxygen gas in a gas jar by downward displacement of water.','Test the gas with a glowing splinter.','Repeat the collection and test for other properties.'], observations:[{ test:'Glowing splinter test', result:'Splinter rekindles/burns brightly', property:'Oxygen supports combustion' },{ test:'Colour and odour', result:'Colourless, odourless gas', property:'Physical property' }], result:'Oxygen gas is prepared. It is colourless, odourless and supports combustion.', vivaQuestions:['What is the role of MnO₂?', 'Why is oxygen collected by downward displacement of water?', 'State two uses of oxygen.', 'What is a catalyst?'], safetyInstructions:['Heat the test tube gently and evenly.','Ensure no water enters the hot test tube.','Avoid direct inhalation of gases.'], difficulty:'intermediate', duration:50, image:null },
    { id:'vl13', subjectId:'s21', title:'Electrolysis of Water', description:'Electrolyse water using carbon electrodes and identify the gases evolved at each electrode.', objective:'To demonstrate the decomposition of water into hydrogen and oxygen gases by electrolysis.', materials:['Water','Battery (6V)','Carbon/graphite electrodes','Beaker','Test tubes (2)','Connecting wires','Dilute H₂SO₄','Splinter','Matchbox'], procedure:['Fill a beaker with water and add a few drops of dilute H₂SO₄ to make it conducting.','Place two carbon electrodes in the beaker and connect them to a battery.','Fill two test tubes with water and invert them over the electrodes.','Switch on the current and observe gas bubbles collecting in the test tubes.','After sufficient gas collects, test the gases near each electrode.','The cathode produces hydrogen (pops with burning splinter), anode produces oxygen (rekindles glowing splinter).'], observations:[{ electrode:'Cathode (negative)', gasVolume:'2x volume', test:'Burning splinter - pops', gas:'Hydrogen (H₂)' },{ electrode:'Anode (positive)', gasVolume:'1x volume', test:'Glowing splinter - rekindles', gas:'Oxygen (O₂)' }], result:'Water decomposes into H₂ (at cathode) and O₂ (at anode) in a 2:1 volume ratio, proving water is H₂O.', vivaQuestions:['What is electrolysis?', 'Why is H₂SO₄ added to water?', 'Why is hydrogen collected at the cathode?', 'What precaution is needed while testing gases?'], safetyInstructions:['Do not touch the electrodes when current is on.','Perform hydrogen test away from the apparatus.'], difficulty:'intermediate', duration:40, image:null },
    { id:'vl14', subjectId:'s21', title:'Types of Chemical Reactions', description:'Perform and identify different types of chemical reactions - combination, decomposition, displacement, and double displacement.', objective:'To observe and classify various types of chemical reactions.', materials:['Test tubes','Bunsen burner','Magnesium ribbon','Copper sulphate solution','Iron nails','Sodium carbonate','Hydrochloric acid','Silver nitrate','Sodium chloride','Zinc granules','Sulphuric acid'], procedure:['Combination: Burn magnesium ribbon in air - forms MgO white ash.','Decomposition: Heat ferrous sulphate crystals - colour changes from green to brown.','Displacement: Place iron nail in CuSO₄ solution - blue colour fades, brown coating on nail.','Double displacement: Mix AgNO₃ and NaCl solutions - white precipitate of AgCl forms.'], observations:[{ reaction:'Mg + O₂ → MgO', type:'Combination', observation:'Bright white flame, white ash' },{ reaction:'FeSO₄ → Fe₂O₃ + SO₂ + SO₃', type:'Decomposition', observation:'Green crystals turn brown, pungent smell' },{ reaction:'Fe + CuSO₄ → FeSO₄ + Cu', type:'Displacement', observation:'Blue colour fades, brown Cu deposit' },{ reaction:'AgNO₃ + NaCl → AgCl↓ + NaNO₃', type:'Double displacement', observation:'White precipitate forms' }], result:'Chemical reactions can be classified as combination, decomposition, displacement, and double displacement based on the changes observed.', vivaQuestions:['What is a combination reaction?', 'What is the difference between displacement and double displacement?', 'What is a redox reaction?', 'Give an example of an exothermic reaction.'], safetyInstructions:['Do not touch the burning magnesium ribbon.','Handle acids with care.','Use test tube holders for heating.'], difficulty:'beginner', duration:45, image:null },
    { id:'vl15', subjectId:'s21', title:'Separation of Mixtures', description:'Separate a mixture of sand, salt and iron filings using physical methods.', objective:'To separate a mixture of sand, common salt and iron filings using appropriate separation techniques.', materials:['Mixture (sand + salt + iron filings)','Magnet','Beaker','Water','Filter paper','Funnel','Evaporating dish','Bunsen burner','Watch glass'], procedure:['Use a magnet to separate iron filings from the mixture (magnetic separation).','Add water to the remaining mixture of sand and salt - salt dissolves.','Filter the mixture using filter paper - sand remains on the filter paper as residue.','Heat the filtrate (salt solution) in an evaporating dish to obtain salt crystals.','Collect all three components separately.'], observations:[{ component:'Iron filings', method:'Magnetic separation', result:'Separated using magnet' },{ component:'Sand', method:'Filtration', result:'Residue on filter paper' },{ component:'Salt', method:'Evaporation', result:'Salt crystals in dish' }], result:'The mixture can be completely separated into its three components using physical methods.', vivaQuestions:['What is a mixture?', 'How is a mixture different from a compound?', 'What is the principle of magnetic separation?', 'What is crystallization?'], safetyInstructions:['Handle the hot evaporating dish with tongs.','Avoid inhaling dust from the mixture.'], difficulty:'beginner', duration:35, image:null },
    { id:'vl16', subjectId:'s21', title:'Crystallization of Copper Sulphate', description:'Prepare crystals of copper sulphate from an impure sample using crystallization.', objective:'To purify copper sulphate by crystallisation and obtain its crystals.', materials:['Copper sulphate (impure)','Beaker (250 mL)','Water','Glass rod','Filter paper','Funnel','Evaporating dish','Bunsen burner','Tripod stand','Wire gauze'], procedure:['Dissolve impure copper sulphate in hot water to make a saturated solution.','Filter the solution to remove insoluble impurities.','Heat the filtrate gently to concentrate it (do not boil to dryness).','Cover the solution and leave it undisturbed overnight.','Observe the blue coloured copper sulphate crystals formed.'], observations:[{ stage:'Before', observation:'Impure greenish-blue powder' },{ stage:'After filtration', observation:'Clear blue solution' },{ stage:'After crystallisation', observation:'Well-defined blue rhomboidal crystals' }], result:'Pure blue copper sulphate crystals (CuSO₄·5H₂O) are obtained by crystallisation.', vivaQuestions:['What is crystallisation?', 'Why is the solution not boiled to dryness?', 'What are hydrated salts?', 'What is the colour of anhydrous copper sulphate?'], safetyInstructions:['Handle hot solutions carefully.','Do not inhale copper sulphate dust.'], difficulty:'intermediate', duration:120, image:null },
    // --- Biology (s22 - Class 10) ---
    { id:'vl17', subjectId:'s22', title:'Microscope Study of Onion Cells', description:'Prepare and observe onion peel cells under a compound microscope.', objective:'To prepare a temporary mount of onion peel and observe its cells under a microscope.', materials:['Compound microscope','Onion','Glass slide','Cover slip','Forceps','Blade','Iodine solution','Dropper','Needle','Filter paper'], procedure:['Peel a thin layer from the concave side of an onion bulb using forceps.','Place the peel on a clean glass slide.','Add a drop of iodine solution to stain the cells.','Place a cover slip carefully to avoid air bubbles.','Observe under low power and then high power of the microscope.'], observations:[{ magnification:'Low power (10x)', observation:'Rectangular cells arranged in rows, cell wall visible' },{ magnification:'High power (40x)', observation:'Cell wall, nucleus (stained dark), cytoplasm visible' }], result:'Onion cells are rectangular with a distinct cell wall, nucleus and cytoplasm. No chloroplasts are visible.', vivaQuestions:['What is the unit of life?', 'Why is iodine used to stain onion cells?', 'What is the function of the cell wall?', 'Why are chloroplasts absent in onion cells?'], safetyInstructions:['Handle the microscope carefully.','Use a sharp blade under adult supervision.','Clean the slide after use.'], difficulty:'beginner', duration:40, image:null },
    { id:'vl18', subjectId:'s22', title:'Osmosis in Potato Strips', description:'Demonstrate osmosis using potato strips placed in sugar solution and water.', objective:'To demonstrate the process of osmosis using potato strips in hypertonic and hypotonic solutions.', materials:['Potato','Beakers (2)','Sugar solution (concentrated)','Distilled water','Knife','Ruler','Weighing balance','Paper towels'], procedure:['Cut two equal-sized strips of potato (5 cm × 1 cm).','Weigh both strips and record their initial masses.','Place one strip in beaker A with distilled water.','Place the other strip in beaker B with concentrated sugar solution.','Leave for 30 minutes.','Remove, dry gently and weigh both strips again.'], observations:[{ beaker:'A (Distilled water)', initialMass:10.5, finalMass:12.8, change:'Increased (swollen, turgid)' },{ beaker:'B (Sugar solution)', initialMass:10.5, finalMass:8.2, change:'Decreased (shrivelled, flaccid)' }], result:'Water moves from low solute concentration (hypotonic) to high solute concentration (hypertonic) through a semi-permeable membrane.', vivaQuestions:['What is osmosis?', 'What is a semi-permeable membrane?', 'What is plasmolysis?', 'Differentiate between osmosis and diffusion.'], safetyInstructions:['Use a clean knife for cutting.','Avoid touching eyes after handling solutions.'], difficulty:'beginner', duration:40, image:null },
    { id:'vl19', subjectId:'s22', title:'Photosynthesis - Starch Test', description:'Demonstrate that starch is produced during photosynthesis in green leaves.', objective:'To prove that photosynthesis produces starch in the presence of sunlight and chlorophyll.', materials:['Pot plant (kept in dark for 2 days)','Beaker','Alcohol','Iodine solution','Water bath','Forceps','Watch glass','Black paper','Pins'], procedure:['Destarch a pot plant by keeping it in darkness for 48 hours.','Cover a part of a leaf with black paper strips.','Expose the plant to sunlight for 6-8 hours.','Pluck the leaf and boil it in water for 2-3 minutes to kill cells.','Boil the leaf in alcohol (water bath) until it becomes colourless.','Test with iodine solution - blue-black colour indicates starch.'], observations:[{ part:'Covered part of leaf', iodineTest:'No blue-black colour (no starch)' },{ part:'Uncovered part of leaf', iodineTest:'Blue-black colour appears (starch present)' }], result:'Starch is produced only in the parts of the leaf that were exposed to sunlight, proving photosynthesis requires light.', vivaQuestions:['What is photosynthesis?', 'What is the equation for photosynthesis?', 'What is the role of chlorophyll?', 'Why is the leaf boiled in alcohol?'], safetyInstructions:['Use a water bath for heating alcohol - it is highly flammable.','Handle the hot beaker with care.'], difficulty:'intermediate', duration:120, image:null },
    { id:'vl20', subjectId:'s22', title:'Human Heart Model (Virtual)', description:'Study the structure of the human heart using a 3D virtual model and trace blood flow.', objective:'To understand the structure and working of the human heart through a virtual dissection.', materials:['Virtual heart model (3D)','Software/App','Labels for chambers and vessels'], procedure:['Load the virtual heart model in the simulation software.','Identify the four chambers: right/left atria and ventricles.','Trace the path of deoxygenated blood from body to lungs.','Trace the path of oxygenated blood from lungs to body.','Identify major blood vessels: aorta, vena cava, pulmonary artery and veins.','Observe the heart valves in action.'], observations:[{ component:'Right Atrium', function:'Receives deoxygenated blood from body via vena cava' },{ component:'Right Ventricle', function:'Pumps deoxygenated blood to lungs via pulmonary artery' },{ component:'Left Atrium', function:'Receives oxygenated blood from lungs via pulmonary veins' },{ component:'Left Ventricle', function:'Pumps oxygenated blood to body via aorta' }], result:'The heart is a double pump - right side pumps deoxygenated blood to lungs, left side pumps oxygenated blood to the body.', vivaQuestions:['How many chambers does the human heart have?', 'What is the function of heart valves?', 'What is the difference between arteries and veins?', 'What is cardiac cycle?'], safetyInstructions:[], difficulty:'beginner', duration:30, image:null },
    { id:'vl21', subjectId:'s22', title:'DNA Extraction from Onion', description:'Extract DNA from onion cells using simple household chemicals.', objective:'To isolate and visualise DNA from onion cells.', materials:['Onion','Blender','Detergent (dish soap)','Salt','Water','Strainer','Glass beaker','Chilled isopropyl alcohol','Glass rod'], procedure:['Chop the onion into small pieces.','Blend it with 100 mL water, 1 tsp salt, and 1 tbsp detergent.','Strain the mixture into a beaker.','Slowly pour chilled isopropyl alcohol down the side of the beaker.','Observe the white stringy DNA precipitate at the interface.','Wind the DNA around a glass rod.'], observations:[{ step:'After blending', observation:'Cloudy mixture' },{ step:'After adding alcohol', observation:'White thread-like precipitate at interface' },{ step:'DNA collection', observation:'Sticky, stringy DNA wound on rod' }], result:'DNA can be extracted from onion cells using detergent to break cell membranes and alcohol to precipitate DNA.', vivaQuestions:['What is DNA?', 'Where is DNA found in the cell?', 'What is the role of detergent in the experiment?', 'Why is cold alcohol used?'], safetyInstructions:['Handle the blender safely.','Do not ingest any chemicals.','Isopropyl alcohol is flammable - keep away from flame.'], difficulty:'intermediate', duration:45, image:null },
    { id:'vl22', subjectId:'s22', title:'Stomata Observation', description:'Prepare a leaf peel to observe stomata under a microscope.', objective:'To observe the structure of stomata on the leaf surface using a temporary mount.', materials:['Fresh leaf (Rhoe discolor or lily)','Glass slide','Cover slip','Forceps','Needle','Water','Microscope','Safranin stain'], procedure:['Peel the lower epidermis from a fresh leaf using forceps.','Place the peel on a clean slide with a drop of water.','Add a drop of safranin stain if needed.','Place a cover slip gently.','Observe under low and high power of microscope.','Identify the stomatal guard cells and the pore.'], observations:[{ magnification:'Low power (10x)', observation:'Many stomata distributed across the surface' },{ magnification:'High power (40x)', observation:'Two kidney-shaped guard cells with a pore (stoma) in between, green chloroplasts visible in guard cells' }], result:'Stomata consist of two guard cells surrounding a pore. Guard cells contain chloroplasts and regulate transpiration.', vivaQuestions:['What are stomata?', 'What is the function of stomata?', 'What are guard cells?', 'How does transpiration occur through stomata?'], safetyInstructions:['Handle the microscope carefully.','Use a sharp blade or forceps safely.'], difficulty:'beginner', duration:35, image:null },
    { id:'vl23', subjectId:'s22', title:'Fermentation (CO₂ Production)', description:'Demonstrate anaerobic respiration (fermentation) by yeast using a glucose solution.', objective:'To demonstrate that yeast produces carbon dioxide during anaerobic respiration (fermentation).', materials:['Active dry yeast (1 tsp)','Sugar/glucose (2 tbsp)','Warm water (100 mL)','Conical flask','One-holed rubber cork','Delivery tube','Lime water (Ca(OH)₂)','Test tube'], procedure:['Dissolve sugar in warm water in a conical flask.','Add yeast to the solution and mix well.','Fit the flask with a cork and delivery tube.','Dip the other end of the delivery tube into a test tube of lime water.','Keep the setup undisturbed at room temperature for 2-3 hours.','Observe the lime water turning milky.'], observations:[{ time:'0 min', observation:'Clear sugar-yeast solution, clear lime water' },{ time:'60 min', observation:'Bubbles appear in lime water' },{ time:'120 min', observation:'Lime water turns milky white' },{ time:'180 min', observation:'Strong alcoholic smell from flask' }], result:'CO₂ produced during fermentation turns lime water milky, confirming anaerobic respiration in yeast.', vivaQuestions:['What is fermentation?', 'What are the products of anaerobic respiration in yeast?', 'What is the equation for fermentation?', 'Commercial uses of fermentation?'], safetyInstructions:['Use warm (not hot) water to avoid killing yeast.','Wash all glassware thoroughly after use.'], difficulty:'intermediate', duration:180, image:null },
    { id:'vl24', subjectId:'s22', title:'Plant Growth Hormones', description:'Study the effect of auxin (plant hormone) on the growth of plant shoots.', objective:'To demonstrate the effect of auxin (IAA) on the growth and curvature of plant shoots.', materials:['Potted bean/pea seedlings','IAA (indole-3-acetic acid) solution','Lanolin paste','Marker','Ruler','Cotton','Protractor'], procedure:['Take 10 uniform seedlings and divide into two groups of 5.','Apply IAA-lanolin paste to one side of the shoot tip of the experimental group.','Apply plain lanolin to the control group.','Keep both groups in a growth chamber with uniform light.','Measure the angle of curvature after 24, 48, 72 hours.','Record the results.'], observations:[{ time:'24 hours', experimentalCurvature:15, controlCurvature:0 },{ time:'48 hours', experimentalCurvature:35, controlCurvature:0 },{ time:'72 hours', experimentalCurvature:55, controlCurvature:0 }], result:'Auxin promotes cell elongation on the side it is applied, causing the shoot to bend away from that side.', vivaQuestions:['What are plant hormones?', 'What is the function of auxin?', 'What is phototropism?', 'How do auxins help agriculture?'], safetyInstructions:['Wear gloves while handling auxin solution.','Dispose of chemical waste properly.'], difficulty:'advanced', duration:96, image:null },
    // --- Computer Science (s80 - Class 10) ---
    { id:'vl25', subjectId:'s80', title:'Binary Search Visualization', description:'Visualise the binary search algorithm on a sorted array step by step.', objective:'To understand how binary search works by dividing the search space in half at each step.', materials:['Browser with simulation','Array of sorted numbers','Step control (forward/backward)'], procedure:['Enter a sorted array of 15-20 integers.','Enter the target value to search.','Click "Start Search" to begin.','Observe how the algorithm checks the middle element and eliminates half the array.','Watch the search range narrow down until the element is found or the range is empty.'], observations:[{ step:1, low:0, high:15, mid:7, action:'Check arr[7]=42 > target 25, search left half' },{ step:2, low:0, high:6, mid:3, action:'Check arr[3]=18 < target 25, search right half' },{ step:3, low:4, high:6, mid:5, action:'Check arr[5]=25 = target, found!' }], result:'Binary search found the target in 3 steps (vs 6 steps for linear search). Time complexity: O(log n).', vivaQuestions:['What is the prerequisite for binary search?', 'What is the time complexity of binary search?', 'How is binary search different from linear search?', 'What is the recurrence relation for binary search?'], safetyInstructions:[], difficulty:'beginner', duration:20, image:null },
    { id:'vl26', subjectId:'s80', title:'Linear Search Visualization', description:'Visualise the linear search algorithm as it checks each element sequentially.', objective:'To understand linear search by sequentially checking each element until the target is found.', materials:['Browser with simulation','Array of numbers','Animation controls'], procedure:['Enter an array of numbers (any order).','Specify the target element to find.','Click "Start" to begin the animation.','Watch each element being checked one by one from left to right.','Note the number of comparisons made.'], observations:[{ step:1, index:0, element:45, match:false },{ step:2, index:1, element:23, match:false },{ step:3, index:2, element:67, match:false },{ step:4, index:3, element:12, match:true }], result:'Element found at index 3 after 4 comparisons. Worst case: O(n) comparisons.', vivaQuestions:['What is linear search?', 'What is the time complexity of linear search?', 'When is linear search preferred over binary search?', 'What is the best case for linear search?'], safetyInstructions:[], difficulty:'beginner', duration:15, image:null },
    { id:'vl27', subjectId:'s80', title:'Bubble Sort Visualization', description:'Visualise how bubble sort progressively moves larger elements to the end.', objective:'To understand bubble sort by visualising how adjacent elements are compared and swapped.', materials:['Browser with simulation','Array of unsorted numbers','Step control','Speed slider'], procedure:['Enter an unsorted array of 8-12 numbers.','Click "Start Sort" to begin.','Observe how adjacent elements are compared.','Notice the larger elements "bubble up" to the end.','Track the number of comparisons and swaps.'], observations:[{ pass:1, comparisons:11, swaps:4, arrayState:'[12, 25, 8, 42, 18, 30, 5, 22, 37, 15, 45, 10]' },{ pass:6, comparisons:6, swaps:1, arrayState:'[5, 8, 10, 12, 15, 18, 22, 25, 30, 37, 42, 45]' }], result:'Array sorted in 6 passes (optimised). Total comparisons: 66. Time complexity: O(n²).', vivaQuestions:['How does bubble sort work?', 'What is the time complexity of bubble sort?', 'Can bubble sort be optimised?', 'Is bubble sort stable?'], safetyInstructions:[], difficulty:'beginner', duration:20, image:null },
    { id:'vl28', subjectId:'s80', title:'Selection Sort Visualization', description:'Visualise selection sort repeatedly finding the minimum element from the unsorted part.', objective:'To understand selection sort by visualising how the minimum element is selected and placed at the correct position.', materials:['Browser with simulation','Unsorted array','Animation controls'], procedure:['Load an unsorted array into the simulator.','Click "Start Selection Sort".','Watch the algorithm scan for the minimum element in the unsorted portion.','Observe the swap that places the minimum at the beginning.','Repeat until the entire array is sorted.'], observations:[{ pass:1, minIndex:6, swaps:1, arrayState:'[5, 42, 25, 18, 30, 12, 8, 22] — 5 swapped with first element' },{ pass:4, minIndex:5, swaps:1, arrayState:'[5, 8, 12, 18, 30, 42, 25, 22] — 30 swapped with 18' }], result:'Array sorted in 7 passes. Time complexity: O(n²) in all cases. Does fewer swaps than bubble sort.', vivaQuestions:['How does selection sort differ from bubble sort?', 'What is the time complexity of selection sort?', 'How many swaps does selection sort make in the worst case?', 'Is selection sort adaptive?'], safetyInstructions:[], difficulty:'beginner', duration:20, image:null },
    { id:'vl29', subjectId:'s80', title:'Stack Operations (Push/Pop)', description:'Visualise stack data structure operations - push, pop, and peek with LIFO behaviour.', objective:'To understand the LIFO (Last In, First Out) principle of a stack through visualisation.', materials:['Browser with simulation','Stack visualisation applet','Operation buttons'], procedure:['Click "Push" to add elements to the stack — observe them placed on top.','Click "Pop" to remove elements — observe the top element being removed.','Use "Peek" to view the top element without removing it.','Try pushing 5 elements then popping 3 — note the order.','Attempt to pop from an empty stack to see underflow.'], observations:[{ operation:'Push(10)', stackState:'[10]', top:10 },{ operation:'Push(25)', stackState:'[10, 25]', top:25 },{ operation:'Push(37)', stackState:'[10, 25, 37]', top:37 },{ operation:'Pop()', stackState:'[10, 25]', removed:37 },{ operation:'Pop()', stackState:'[10]', removed:25 }], result:'Stack follows LIFO - the last element pushed (37) is the first one popped. Push: O(1), Pop: O(1), Peek: O(1).', vivaQuestions:['What is a stack?', 'What is LIFO?', 'Give real-world examples of stack.','What is stack overflow and underflow?'], safetyInstructions:[], difficulty:'beginner', duration:15, image:null },
    { id:'vl30', subjectId:'s80', title:'Queue Operations (Enqueue/Dequeue)', description:'Visualise queue data structure operations - enqueue and dequeue with FIFO behaviour.', objective:'To understand the FIFO (First In, First Out) principle of a queue through visualisation.', materials:['Browser with simulation','Queue visualisation applet','Operation buttons'], procedure:['Click "Enqueue" to add elements — observe them added at the rear.','Click "Dequeue" to remove elements — observe removal from the front.','Enqueue 4 elements and dequeue 2 — note the order matches entry order.','Check front element without removing using "Front".','Try dequeue from empty queue to see underflow.'], observations:[{ operation:'Enqueue(A)', queueState:'[A]', front:'A', rear:'A' },{ operation:'Enqueue(B)', queueState:'[A, B]', front:'A', rear:'B' },{ operation:'Enqueue(C)', queueState:'[A, B, C]', front:'A', rear:'C' },{ operation:'Dequeue()', queueState:'[B, C]', removed:'A' },{ operation:'Dequeue()', queueState:'[C]', removed:'B' }], result:'Queue follows FIFO — the first element enqueued (A) is the first one dequeued. Enqueue: O(1), Dequeue: O(1).', vivaQuestions:['What is a queue?', 'What is FIFO?', 'Give real-world examples of queue.','What are the types of queues?'], safetyInstructions:[], difficulty:'beginner', duration:15, image:null },
    // --- Mathematics (s19 - Class 10) ---
    { id:'vl31', subjectId:'s19', title:'Pythagoras Theorem Visualisation', description:'Interactive visual proof of Pythagoras theorem using area comparison of squares.', objective:'To visualise and verify Pythagoras theorem (a² + b² = c²) through geometric construction.', materials:['Browser with HTML5 canvas','Interactive triangle with adjustable sides','Area display panels'], procedure:['Drag the vertices of the right triangle to change its sides.','Observe the squares drawn on each side (a², b², c²).','Watch as the sum of areas of smaller squares (a² + b²) equals the area of the large square (c²).','Use the angle slider to adjust the triangle and verify for different right triangles.','Note the relationship holds true for all right-angled triangles.'], observations:[{ a:3, b:4, c:5, aSquared:9, bSquared:16, cSquared:25, verification:'9 + 16 = 25 ✓' },{ a:6, b:8, c:10, aSquared:36, bSquared:64, cSquared:100, verification:'36 + 64 = 100 ✓' },{ a:5, b:12, c:13, aSquared:25, bSquared:144, cSquared:169, verification:'25 + 144 = 169 ✓' }], result:'Pythagoras theorem is verified: in any right triangle, the square of the hypotenuse equals the sum of squares of the other two sides.', vivaQuestions:['What is the Pythagoras theorem?', 'How is it used in real life?', 'What are Pythagorean triplets?', 'State the converse of Pythagoras theorem.'], safetyInstructions:[], difficulty:'beginner', duration:20, image:null },
    { id:'vl32', subjectId:'s19', title:'Graph Plotter (Linear Equations)', description:'Plot and explore linear equations in two variables interactively.', objective:'To understand the graphical representation of linear equations and the concept of slope and intercept.', materials:['Browser app','Coordinate grid','Equation input field'], procedure:['Enter a linear equation (y = mx + c) in the input box.','Observe the straight line plotted on the coordinate grid.','Adjust the slope (m) using a slider — see the line become steeper or flatter.','Adjust the y-intercept (c) — see the line shift up/down.','Plot two equations simultaneously and find their intersection point.'], observations:[{ equation:'y = 2x + 3', slope:2, yIntercept:3, lineType:'Rising steeply' },{ equation:'y = -x + 5', slope:-1, yIntercept:5, lineType:'Falling' },{ equation:'y = 4', slope:0, yIntercept:4, lineType:'Horizontal' },{ equation:'x = 3', slope:'undefined', yIntercept:'none', lineType:'Vertical' }], result:'Linear equations plot as straight lines. The slope determines steepness, the intercept determines vertical position.', vivaQuestions:['What is the slope of a line?', 'How do you find the x-intercept?', 'What does a zero slope indicate?', 'How do you solve two linear equations graphically?'], safetyInstructions:[], difficulty:'beginner', duration:25, image:null },
    { id:'vl33', subjectId:'s19', title:'Trigonometric Circle Explorer', description:'Explore the unit circle and understand trigonometric functions visually.', objective:'To understand how trigonometric ratios (sin, cos, tan) relate to the unit circle.', materials:['Browser app','Unit circle diagram','Angle slider'], procedure:['Move the angle slider to change θ from 0° to 360°.','Watch the point move along the unit circle.','Observe how sin θ changes as the y-coordinate of the point.','Observe how cos θ changes as the x-coordinate of the point.','See the tangent value change as sin/cos ratio.','Note how values repeat after 360° (periodicity).'], observations:[{ angle:0, sin:0, cos:1, tan:0 },{ angle:30, sin:0.5, cos:0.866, tan:0.577 },{ angle:45, sin:0.707, cos:0.707, tan:1 },{ angle:60, sin:0.866, cos:0.5, tan:1.732 },{ angle:90, sin:1, cos:0, tan:'infinite' },{ angle:180, sin:0, cos:-1, tan:0 },{ angle:270, sin:-1, cos:0, tan:'infinite' },{ angle:360, sin:0, cos:1, tan:0 }], result:'Trigonometric functions are periodic. sin θ = y-coordinate, cos θ = x-coordinate on the unit circle. Range: sin, cos ∈ [-1,1].', vivaQuestions:['What is the unit circle?', 'What are the domains of sin and cos?', 'What is the period of sin and cos functions?', 'Why is tan 90° not defined?'], safetyInstructions:[], difficulty:'intermediate', duration:25, image:null },
    { id:'vl34', subjectId:'s19', title:'3D Shapes Explorer', description:'Explore 3D geometric shapes - rotate, zoom and view surface area and volume calculations.', objective:'To visualise 3D shapes and understand their surface area and volume formulas.', materials:['Browser with WebGL/Three.js','3D shape selector','Interactive controls'], procedure:['Select a 3D shape (cube, cuboid, cylinder, cone, sphere, etc.).','Rotate the shape using mouse drag to view from all angles.','Adjust dimensions (radius, height, length) using sliders.','Observe how surface area and volume change in real time.','Unfold the net of the shape to see its 2D components.'], observations:[{ shape:'Cube', side:5, surfaceArea:150, volume:125 },{ shape:'Cylinder', radius:3, height:10, surfaceArea:245.04, volume:282.74 },{ shape:'Cone', radius:4, height:9, surfaceArea:185.41, volume:150.8 },{ shape:'Sphere', radius:7, surfaceArea:615.75, volume:1436.76 }], result:'Formulas verified: Cube SA=6a² V=a³, Cylinder SA=2πr(r+h) V=πr²h, Cone SA=πr(r+l) V=⅓πr²h, Sphere SA=4πr² V=⁴⁄₃πr³.', vivaQuestions:['What is the difference between surface area and volume?', 'Why is cone volume one-third of cylinder?', 'What is the formula for the total surface area of a cylinder?', 'How do you find the slant height of a cone?'], safetyInstructions:[], difficulty:'beginner', duration:25, image:null },
    { id:'vl35', subjectId:'s19', title:'Probability Simulator (Coin/Dice)', description:'Simulate random experiments (coin toss, dice roll) and compare experimental vs theoretical probability.', objective:'To understand probability through simulation and see how experimental probability approaches theoretical probability with more trials.', materials:['Browser app','Coin and dice simulator','Trial counter'], procedure:['Select experiment: coin toss or dice roll.','Set the number of trials (10, 100, 1000, 10000).','Click "Simulate" to run the experiment.','Observe the frequency of each outcome.','Compare experimental probability with theoretical probability.','Note how more trials give closer results to theory.'], observations:[{ experiment:'Coin Toss - 10 trials', heads:4, tails:6, experimentalHeads:0.4, theoreticalHeads:0.5 },{ experiment:'Coin Toss - 1000 trials', heads:498, tails:502, experimentalHeads:0.498, theoreticalHeads:0.5 },{ experiment:'Dice Roll - 600 trials', count1:98, count2:102, count3:99, count4:101, count5:100, count6:100, experimentalEach:0.166, theoreticalEach:0.1667 }], result:'Law of Large Numbers: As the number of trials increases, experimental probability converges to theoretical probability.', vivaQuestions:['What is probability?', 'What is the Law of Large Numbers?', 'Why does the theoretical probability of heads = 0.5?', 'What is the sample space of rolling two dice?'], safetyInstructions:[], difficulty:'beginner', duration:25, image:null },
    { id:'vl36', subjectId:'s19', title:'Quadratic Equation Visualiser', description:'Visualise how changing coefficients a, b, c affects the parabola of a quadratic equation.', objective:'To understand how coefficients a, b, and c affect the shape and position of the parabola y = ax² + bx + c.', materials:['Browser app','Graphing canvas','Coefficient sliders a, b, c'], procedure:['Start with the standard parabola y = x² (a=1, b=0, c=0).','Adjust slider "a" — see parabola become wider/ narrower or flip (a<0).','Adjust slider "b" — see the vertex move left/right.','Adjust slider "c" — see the parabola shift up/down.','Observe how the discriminant D = b²-4ac determines the number of real roots.'], observations:[{ equation:'y = x²', a:1, b:0, c:0, vertex:'(0,0)', opens:'Upwards', roots:1 },{ equation:'y = 2x²', a:2, b:0, c:0, vertex:'(0,0)', opens:'Narrower', roots:1 },{ equation:'y = -x² + 4', a:-1, b:0, c:4, vertex:'(0,4)', opens:'Downwards', roots:2 },{ equation:'y = x² - 6x + 9', a:1, b:-6, c:9, vertex:'(3,0)', opens:'Upwards', roots:1 },{ equation:'y = x² + 2x + 5', a:1, b:2, c:5, vertex:'(-1,4)', opens:'Upwards', roots:0 }], result:'Coefficient a controls opening direction and width, b shifts vertex horizontally, c shifts parabola vertically. D>0 = 2 roots, D=0 = 1 root, D<0 = 0 real roots.', vivaQuestions:['What is a quadratic equation?', 'What is the discriminant?', 'How do you find the vertex of a parabola?', 'What does a negative coefficient a indicate?'], safetyInstructions:[], difficulty:'intermediate', duration:30, image:null }
  ];

  // ==================== GAMIFICATION DATA ====================
  var gamification = {
    achievements: [
      { id:'gamAch1', name:'First Login', description:'Log in to your account for the first time', icon:'🚪', xpReward:50, category:'milestone' },
      { id:'gamAch2', name:'Quick Starter', description:'Complete your first lesson', icon:'📚', xpReward:100, category:'learning' },
      { id:'gamAch3', name:'Quiz Champion', description:'Score 100% on any quiz', icon:'🏆', xpReward:250, category:'assessment' },
      { id:'gamAch4', name:'Streak Master', description:'Maintain a 7-day study streak', icon:'🔥', xpReward:200, category:'consistency' },
      { id:'gamAch5', name:'Century Scorer', description:'Score 100 marks in any practice test', icon:'💯', xpReward:300, category:'assessment' },
      { id:'gamAch6', name:'Video Buff', description:'Watch 20 educational videos', icon:'▶️', xpReward:150, category:'learning' },
      { id:'gamAch7', name:'Helping Hand', description:'Answer 10 community questions', icon:'🤝', xpReward:175, category:'community' },
      { id:'gamAch8', name:'Math Wizard', description:'Complete 5 Mathematics practice sets', icon:'🧮', xpReward:225, category:'subject' },
      { id:'gamAch9', name:'Science Genius', description:'Complete 5 Science practice sets', icon:'🔬', xpReward:225, category:'subject' },
      { id:'gamAch10', name:'Code Breaker', description:'Complete a programming lab', icon:'💻', xpReward:200, category:'subject' },
      { id:'gamAch11', name:'Lab Explorer', description:'Complete 5 virtual labs', icon:'🧪', xpReward:275, category:'learning' },
      { id:'gamAch12', name:'Early Bird', description:'Complete a study session before 7 AM', icon:'🌅', xpReward:100, category:'consistency' },
      { id:'gamAch13', name:'Night Owl', description:'Study after 10 PM for 3 consecutive days', icon:'🦉', xpReward:120, category:'consistency' },
      { id:'gamAch14', name:'Social Butterfly', description:'Make 5 study friends on the platform', icon:'🦋', xpReward:100, category:'community' },
      { id:'gamAch15', name:'Gold Medalist', description:'Achieve rank 1 in a weekly challenge', icon:'🥇', xpReward:500, category:'competitive' },
      { id:'gamAch16', name:'Dedicated Scholar', description:'Study for 30 consecutive days', icon:'🎯', xpReward:400, category:'consistency' },
      { id:'gamAch17', name:'Top Performer', description:'Reach the top 3 on the leaderboard', icon:'👑', xpReward:350, category:'competitive' },
      { id:'gamAch18', name:'Resource Collector', description:'Download 15 study resources', icon:'📥', xpReward:130, category:'learning' },
      { id:'gamAch19', name:'Challenge Accepted', description:'Complete 10 daily challenges', icon:'⚡', xpReward:280, category:'competitive' },
      { id:'gamAch20', name:'Grand Master', description:'Reach level 25 on the platform', icon:'🌟', xpReward:600, category:'milestone' }
    ],
    dailyChallenges: [
      { id:'dc1', title:'Complete 3 Lessons', description:'Finish any 3 lessons from any subject to earn bonus XP.', xpReward:100, icon:'📖', difficulty:'easy' },
      { id:'dc2', title:'Quiz Sprint', description:'Complete 5 quiz questions with 80%+ accuracy.', xpReward:75, icon:'🎯', difficulty:'easy' },
      { id:'dc3', title:'Watch & Learn', description:'Watch 2 educational videos and take notes.', xpReward:60, icon:'▶️', difficulty:'easy' },
      { id:'dc4', title:'Practice Makes Perfect', description:'Solve 10 practice questions in any subject.', xpReward:90, icon:'✏️', difficulty:'medium' },
      { id:'dc5', title:'Community Contributor', description:'Help someone by answering their doubt in the community.', xpReward:80, icon:'💬', difficulty:'medium' },
      { id:'dc6', title:'Lab Day', description:'Complete one virtual lab experiment.', xpReward:120, icon:'🔬', difficulty:'medium' },
      { id:'dc7', title:'Streak Saver', description:'Log in and study for at least 30 minutes today.', xpReward:50, icon:'🔥', difficulty:'easy' },
      { id:'dc8', title:'Subject Focus', description:'Study only one subject for 2 hours straight.', xpReward:110, icon:'🎯', difficulty:'medium' },
      { id:'dc9', title:'Speed Quiz', description:'Complete a timed quiz with 10 questions in 5 minutes.', xpReward:130, icon:'⏱️', difficulty:'hard' },
      { id:'dc10', title:'Revision Master', description:'Revise 3 previously completed chapters today.', xpReward:95, icon:'🔄', difficulty:'medium' }
    ],
    weeklyChallenges: [
      { id:'wc1', title:'Weekly Warrior', description:'Complete 20 lessons and 5 quizzes this week.', xpReward:500, icon:'⚔️', difficulty:'hard' },
      { id:'wc2', title:'Subject Master', description:'Complete all practice sets for one subject this week.', xpReward:400, icon:'📚', difficulty:'hard' },
      { id:'wc3', title:'Perfect Attendance', description:'Log in and study every day for 7 days.', xpReward:350, icon:'✅', difficulty:'medium' },
      { id:'wc4', title:'Lab Scientist', description:'Complete 3 virtual labs from any subject this week.', xpReward:450, icon:'🧪', difficulty:'hard' },
      { id:'wc5', title:'Top Scorer', description:'Score 90%+ in at least 3 quizzes this week.', xpReward:550, icon:'🏅', difficulty:'hard' }
    ],
    monthlyChallenges: [
      { id:'mc1', title:'30-Day Streak', description:'Study every single day for the entire month.', xpReward:1500, icon:'🔥', difficulty:'extreme' },
      { id:'mc2', title:'Curriculum Completer', description:'Complete the entire syllabus for one subject this month.', xpReward:2000, icon:'🎓', difficulty:'extreme' },
      { id:'mc3', title:'Knowledge Champion', description:'Score above 85% in 10 quizzes, complete 5 labs, and help 5 students.', xpReward:2500, icon:'👑', difficulty:'extreme' }
    ],
    rewards: [
      { id:'rew1', name:'Dark Theme', description:'Unlock the dark mode theme for your dashboard.', cost:200, type:'theme', icon:'🌙' },
      { id:'rew2', name:'Golden Avatar Frame', description:'A premium golden frame for your profile avatar.', cost:500, type:'avatarFrame', icon:'🖼️' },
      { id:'rew3', name:'Scholar Badge Frame', description:'A distinguished frame showing your scholar status.', cost:300, type:'badgeFrame', icon:'🏅' },
      { id:'rew4', name:'Space Wallpaper', description:'A cosmic space-themed background for your dashboard.', cost:400, type:'wallpaper', icon:'🌌' },
      { id:'rew5', name:'Quiz Master Title', description:'Display the title "Quiz Master" on your profile.', cost:350, type:'title', icon:'🎯' },
      { id:'rew6', name:'Ocean Theme', description:'A calming ocean blue theme for the platform.', cost:250, type:'theme', icon:'🌊' },
      { id:'rew7', name:'Diamond Avatar Frame', description:'An exclusive diamond-studded frame for your avatar.', cost:800, type:'avatarFrame', icon:'💎' },
      { id:'rew8', name:'Forest Wallpaper', description:'A serene forest nature wallpaper for your dashboard.', cost:350, type:'wallpaper', icon:'🌿' },
      { id:'rew9', name:'Lab Expert Title', description:'Display the title "Lab Expert" on your profile.', cost:450, type:'title', icon:'🔬' },
      { id:'rew10', name:'Ruby Badge Frame', description:'A premium ruby red badge frame for achievements.', cost:600, type:'badgeFrame', icon:'💠' }
    ],
    leaderboard: [
      { rank:1, name:'Aarav Sharma', xp:28450, level:42, streak:65, avatar:null },
      { rank:2, name:'Priya Patel', xp:27120, level:40, streak:58, avatar:null },
      { rank:3, name:'Rohan Verma', xp:25980, level:39, streak:52, avatar:null },
      { rank:4, name:'Ananya Singh', xp:24560, level:38, streak:47, avatar:null },
      { rank:5, name:'Arjun Gupta', xp:23100, level:36, streak:44, avatar:null },
      { rank:6, name:'Kavita Reddy', xp:21890, level:35, streak:41, avatar:null },
      { rank:7, name:'Vihaan Kumar', xp:20540, level:33, streak:38, avatar:null },
      { rank:8, name:'Sneha Joshi', xp:19870, level:32, streak:35, avatar:null },
      { rank:9, name:'Aditya Nair', xp:18430, level:30, streak:31, avatar:null },
      { rank:10, name:'Divya Mehta', xp:17210, level:29, streak:28, avatar:null },
      { rank:11, name:'Kabir Thakur', xp:16540, level:28, streak:25, avatar:null },
      { rank:12, name:'Neha Desai', xp:15280, level:26, streak:22, avatar:null },
      { rank:13, name:'Ishaan Choudhury', xp:14900, level:25, streak:20, avatar:null },
      { rank:14, name:'Meera Iyer', xp:13850, level:24, streak:18, avatar:null },
      { rank:15, name:'Dhruv Mishra', xp:12760, level:23, streak:16, avatar:null },
      { rank:16, name:'Radhika Pandey', xp:11540, level:21, streak:14, avatar:null },
      { rank:17, name:'Vivaan Saxena', xp:10890, level:20, streak:12, avatar:null },
      { rank:18, name:'Shreya Chauhan', xp:9750, level:19, streak:11, avatar:null },
      { rank:19, name:'Tanvi Bajaj', xp:8920, level:18, streak:9, avatar:null },
      { rank:20, name:'Krishna Malhotra', xp:8150, level:17, streak:8, avatar:null },
      { rank:21, name:'Amit Khanna', xp:7320, level:15, streak:7, avatar:null },
      { rank:22, name:'Nandini Jain', xp:6540, level:14, streak:6, avatar:null },
      { rank:23, name:'Pranav Arora', xp:5710, level:12, streak:5, avatar:null },
      { rank:24, name:'Vaishali Shah', xp:4950, level:11, streak:4, avatar:null },
      { rank:25, name:'Sameer Agarwal', xp:4120, level:10, streak:3, avatar:null }
    ]
  };

  // ==================== PRACTICE QUESTIONS PER SUBJECT ====================
  var practice = {
    's19': [ // Mathematics Class 10
      { id:'ps19-1', subjectId:'s19', chapterId:'ch183', title:'Real Numbers - Practice Set 1', questions:[
        { id:'ps19q1', type:'mcq', question:'The decimal expansion of 17/8 is:', options:['2.125','2.025','2.225','1.125'], correctAnswer:'2.125', explanation:'17/8 = 2.125, terminating decimal because denominator is 2³.', difficulty:'easy', points:5 },
        { id:'ps19q2', type:'mcq', question:'Which of the following is an irrational number?', options:['√2','√4','³√27','√1'], correctAnswer:'√2', explanation:'√2 = 1.4142... non-terminating non-repeating decimal.', difficulty:'easy', points:5 },
        { id:'ps19q3', type:'fillBlank', question:'The HCF of 36 and 48 is ____.', options:null, correctAnswer:'12', explanation:'36=2²×3², 48=2⁴×3, HCF=2²×3=12.', difficulty:'easy', points:5 },
        { id:'ps19q4', type:'trueFalse', question:'The product of two irrational numbers is always irrational.', options:['True','False'], correctAnswer:'False', explanation:'√2 × √2 = 2, which is rational.', difficulty:'medium', points:5 },
        { id:'ps19q5', type:'shortAnswer', question:'Find the LCM of 18, 24, and 36.', options:null, correctAnswer:'72', explanation:'18=2×3², 24=2³×3, 36=2²×3², LCM=2³×3²=72.', difficulty:'medium', points:10 },
        { id:'ps19q6', type:'mcq', question:'If p is a prime number and p divides k², then p divides:', options:['k','2k','k²','k³'], correctAnswer:'k', explanation:'By the fundamental theorem of arithmetic, if p|k² then p|k.', difficulty:'hard', points:5 },
        { id:'ps19q7', type:'fillBlank', question:'The decimal representation of 1/7 is ____ (non-terminating repeating).', options:null, correctAnswer:'0.142857', explanation:'1/7 = 0.142857142857...', difficulty:'medium', points:5 },
        { id:'ps19q8', type:'longAnswer', question:'Prove that √3 is irrational.', options:null, correctAnswer:'Assume √3 = p/q in simplest form. Then 3q² = p² so 3|p, let p=3r, then 3q²=9r², q²=3r² so 3|q. Contradiction since p,q are coprime.', explanation:'Standard proof by contradiction using prime factorization.', difficulty:'hard', points:15 }
      ] },
      { id:'ps19-2', subjectId:'s19', chapterId:'ch184', title:'Polynomials - Practice Set 2', questions:[
        { id:'ps19q9', type:'mcq', question:'The degree of polynomial x³ - 3x² + 5x - 7 is:', options:['3','2','1','0'], correctAnswer:'3', explanation:'Highest power of x is 3.', difficulty:'easy', points:5 },
        { id:'ps19q10', type:'fillBlank', question:'The zero of the polynomial p(x) = 2x + 5 is ____.', options:null, correctAnswer:'-5/2', explanation:'2x+5=0 => x=-5/2.', difficulty:'easy', points:5 }
      ] },
      { id:'ps19-3', subjectId:'s19', chapterId:'ch186', title:'Quadratic Equations - Practice Set 3', questions:[
        { id:'ps19q11', type:'mcq', question:'The discriminant of x² - 4x + 3 = 0 is:', options:['4','16','8','2'], correctAnswer:'4', explanation:'D = b²-4ac = 16-12 = 4.', difficulty:'medium', points:5 }
      ] }
    ],
    's20': [ // Physics Class 10
      { id:'ps20-1', subjectId:'s20', chapterId:'ch197', title:'Light - Reflection and Refraction', questions:[
        { id:'ps20q1', type:'mcq', question:'The focal length of a concave mirror is 15 cm. Its radius of curvature is:', options:['30 cm','15 cm','7.5 cm','45 cm'], correctAnswer:'30 cm', explanation:'R = 2f = 2×15 = 30 cm.', difficulty:'easy', points:5 },
        { id:'ps20q2', type:'fillBlank', question:'The refractive index of diamond is ____.', options:null, correctAnswer:'2.42', explanation:'Diamond has the highest refractive index of 2.42.', difficulty:'medium', points:5 },
        { id:'ps20q3', type:'trueFalse', question:'A convex lens always forms a real image.', options:['True','False'], correctAnswer:'False', explanation:'When object is between focus and lens, the image is virtual and erect.', difficulty:'medium', points:5 }
      ] },
      { id:'ps20-2', subjectId:'s20', chapterId:'ch199', title:'Electricity - Practice Set', questions:[
        { id:'ps20q4', type:'mcq', question:'Three 6Ω resistors are connected in parallel. The equivalent resistance is:', options:['2Ω','3Ω','6Ω','18Ω'], correctAnswer:'2Ω', explanation:'1/R = 1/6+1/6+1/6 = 3/6 = 1/2, R=2Ω.', difficulty:'easy', points:5 },
        { id:'ps20q5', type:'shortAnswer', question:'A 100W bulb operates at 220V. Calculate the current drawn.', options:null, correctAnswer:'0.455A', explanation:'P=VI => I=P/V = 100/220 = 0.455 A.', difficulty:'medium', points:10 }
      ] }
    ],
    's21': [ // Chemistry Class 10
      { id:'ps21-1', subjectId:'s21', chapterId:'ch202', title:'Chemical Reactions & Equations', questions:[
        { id:'ps21q1', type:'mcq', question:'Which of the following is a decomposition reaction?', options:['2H₂O → 2H₂ + O₂','Mg + O₂ → MgO','NaOH + HCl → NaCl + H₂O','Fe + CuSO₄ → FeSO₄ + Cu'], correctAnswer:'2H₂O → 2H₂ + O₂', explanation:'A single compound breaks down into two or more simpler substances.', difficulty:'easy', points:5 },
        { id:'ps21q2', type:'fillBlank', question:'The colour of ferrous sulphate crystals is ____.', options:null, correctAnswer:'Light green', explanation:'FeSO₄·7H₂O is light green. On heating, it turns white then brown.', difficulty:'easy', points:5 }
      ] },
      { id:'ps21-2', subjectId:'s21', chapterId:'ch203', title:'Acids, Bases and Salts', questions:[
        { id:'ps21q3', type:'mcq', question:'The pH of a solution is 3. It is:', options:['Acidic','Basic','Neutral','Amphoteric'], correctAnswer:'Acidic', explanation:'pH < 7 indicates acidic solution.', difficulty:'easy', points:5 }
      ] }
    ],
    's22': [ // Biology Class 10
      { id:'ps22-1', subjectId:'s22', chapterId:'ch207', title:'Life Processes', questions:[
        { id:'ps22q1', type:'mcq', question:'Which enzyme breaks down starch in the mouth?', options:['Amylase','Pepsin','Trypsin','Lipase'], correctAnswer:'Amylase', explanation:'Salivary amylase breaks down starch into maltose in the mouth.', difficulty:'easy', points:5 },
        { id:'ps22q2', type:'fillBlank', question:'The pigment that gives blood its red colour is ____.', options:null, correctAnswer:'Haemoglobin', explanation:'Haemoglobin in RBCs contains iron and gives blood its red colour.', difficulty:'easy', points:5 }
      ] },
      { id:'ps22-2', subjectId:'s22', chapterId:'ch208', title:'Control and Coordination', questions:[
        { id:'ps22q3', type:'mcq', question:'Which part of the brain controls balance and coordination?', options:['Cerebellum','Cerebrum','Medulla','Hypothalamus'], correctAnswer:'Cerebellum', explanation:'Cerebellum controls voluntary movements, balance and posture.', difficulty:'medium', points:5 }
      ] }
    ],
    's23': [ // English Class 10
      { id:'ps23-1', subjectId:'s23', chapterId:'ch212', title:'A Letter to God - Comprehension', questions:[
        { id:'ps23q1', type:'mcq', question:'Who wrote the letter to God in the story?', options:['Lencho','Postmaster','Farmer\'s wife','The priest'], correctAnswer:'Lencho', explanation:'Lencho, a poor farmer, wrote to God asking for money after his crop was destroyed by hail.', difficulty:'easy', points:5 },
        { id:'ps23q2', type:'shortAnswer', question:'What did Lencho hope for after the rain?', options:null, correctAnswer:'A good harvest', explanation:'Lencho\'s cornfield needed rain for a good harvest.', difficulty:'easy', points:5 }
      ] },
      { id:'ps23-2', subjectId:'s23', chapterId:'ch216', title:'Grammar - Tenses Practice', questions:[
        { id:'ps23q3', type:'fillBlank', question:'She ____ (study) for two hours before the exam started.', options:null, correctAnswer:'had been studying', explanation:'Past perfect continuous tense for an action ongoing before another past action.', difficulty:'medium', points:5 },
        { id:'ps23q4', type:'mcq', question:'Identify the tense: "They will have finished the project by Monday."', options:['Future Perfect','Future Continuous','Simple Future','Future Perfect Continuous'], correctAnswer:'Future Perfect', explanation:'"Will have + past participle" indicates future perfect tense.', difficulty:'medium', points:5 }
      ] }
    ],
    's14': [ // Physics Class 9
      { id:'ps14-1', subjectId:'s14', chapterId:'ch147', title:'Motion - Practice Set', questions:[
        { id:'ps14q1', type:'mcq', question:'A car moves 60 km in 1 hour. Its speed is:', options:['60 km/h','30 km/h','120 km/h','15 km/h'], correctAnswer:'60 km/h', explanation:'Speed = Distance/Time = 60/1 = 60 km/h.', difficulty:'easy', points:5 },
        { id:'ps14q2', type:'fillBlank', question:'The SI unit of acceleration is ____.', options:null, correctAnswer:'m/s²', explanation:'Acceleration = change in velocity / time, unit = m/s².', difficulty:'easy', points:5 },
        { id:'ps14q3', type:'shortAnswer', question:'A train starting from rest attains a velocity of 72 km/h in 5 minutes. Find its acceleration.', options:null, correctAnswer:'0.067 m/s²', explanation:'u=0, v=72×5/18=20 m/s, t=300s, a=(20-0)/300=0.067 m/s².', difficulty:'medium', points:10 }
      ] },
      { id:'ps14-2', subjectId:'s14', chapterId:'ch149', title:'Gravitation - Practice Set', questions:[
        { id:'ps14q4', type:'mcq', question:'The value of G (universal gravitational constant) is:', options:['6.67×10⁻¹¹ Nm²/kg²','9.8 m/s²','6.67×10¹¹ Nm²/kg²','9.8 N/kg'], correctAnswer:'6.67×10⁻¹¹ Nm²/kg²', explanation:'G = 6.67×10⁻¹¹ Nm²/kg² is the universal gravitational constant.', difficulty:'medium', points:5 },
        { id:'ps14q5', type:'trueFalse', question:'The weight of a body on the moon is 1/6th of its weight on Earth.', options:['True','False'], correctAnswer:'True', explanation:'Moon\'s gravity is 1/6th of Earth\'s gravity.', difficulty:'easy', points:5 }
      ] }
    ],
    's15': [ // Chemistry Class 9
      { id:'ps15-1', subjectId:'s15', chapterId:'ch152', title:'Matter in Our Surroundings', questions:[
        { id:'ps15q1', type:'mcq', question:'The state of matter with highest compressibility is:', options:['Gas','Solid','Liquid','Plasma'], correctAnswer:'Gas', explanation:'Gases are highly compressible due to large intermolecular spaces.', difficulty:'easy', points:5 },
        { id:'ps15q2', type:'fillBlank', question:'The temperature at which a liquid boils at standard pressure is called ____.', options:null, correctAnswer:'Boiling point', explanation:'Boiling point is the temperature at which vapour pressure equals atmospheric pressure.', difficulty:'easy', points:5 }
      ] },
      { id:'ps15-2', subjectId:'s15', chapterId:'ch153', title:'Is Matter Around Us Pure', questions:[
        { id:'ps15q3', type:'mcq', question:'Which of these is a pure substance?', options:['Iron','Air','Milk','Salt solution'], correctAnswer:'Iron', explanation:'Iron is an element, a pure substance with fixed composition.', difficulty:'easy', points:5 },
        { id:'ps15q4', type:'shortAnswer', question:'Define Tyndall effect with an example.', options:null, correctAnswer:'Scattering of light by colloidal particles. Example: sunlight through a forest canopy.', explanation:'Tyndall effect is the scattering of light by particles in a colloid or suspension.', difficulty:'medium', points:10 }
      ] }
    ],
    's16': [ // Biology Class 9
      { id:'ps16-1', subjectId:'s16', chapterId:'ch156', title:'The Fundamental Unit of Life', questions:[
        { id:'ps16q1', type:'mcq', question:'Which organelle is known as the powerhouse of the cell?', options:['Mitochondria','Nucleus','Ribosome','Golgi body'], correctAnswer:'Mitochondria', explanation:'Mitochondria produce ATP through cellular respiration.', difficulty:'easy', points:5 },
        { id:'ps16q2', type:'fillBlank', question:'The fluid inside the cell is called ____.', options:null, correctAnswer:'Cytoplasm', explanation:'Cytoplasm is the semi-fluid substance between cell membrane and nucleus.', difficulty:'easy', points:5 }
      ] },
      { id:'ps16-2', subjectId:'s16', chapterId:'ch157', title:'Tissues - Practice Set', questions:[
        { id:'ps16q3', type:'mcq', question:'Which tissue connects bones to muscles?', options:['Tendon','Ligament','Cartilage','Areolar'], correctAnswer:'Tendon', explanation:'Tendons connect muscles to bones; ligaments connect bones to bones.', difficulty:'medium', points:5 },
        { id:'ps16q4', type:'trueFalse', question:'Meristematic tissue is found only in mature plant parts.', options:['True','False'], correctAnswer:'False', explanation:'Meristematic tissue is found in growing regions like tips of roots and shoots.', difficulty:'medium', points:5 }
      ] }
    ]
  };

  // ==================== LESSONS DATA ====================
  var lessons = {
    's19': [
      { id:'lsn19-1', subjectId:'s19', chapterId:'ch183', title:'Introduction to Real Numbers', description:'Learn about Euclid\'s division lemma, fundamental theorem of arithmetic, and properties of real numbers.', duration:45, difficulty:'beginner', order:1 },
      { id:'lsn19-2', subjectId:'s19', chapterId:'ch184', title:'Polynomials and Their Graphs', description:'Understand polynomial expressions, degrees, zeros, and graphical representation.', duration:50, difficulty:'beginner', order:2 },
      { id:'lsn19-3', subjectId:'s19', chapterId:'ch186', title:'Solving Quadratic Equations', description:'Master solving quadratic equations using factorization, completing square, and quadratic formula.', duration:55, difficulty:'intermediate', order:3 },
      { id:'lsn19-4', subjectId:'s19', chapterId:'ch190', title:'Introduction to Trigonometry', description:'Learn trigonometric ratios, identities, and their applications in real life.', duration:50, difficulty:'intermediate', order:4 },
      { id:'lsn19-5', subjectId:'s19', chapterId:'ch196', title:'Statistics - Mean, Median, Mode', description:'Understand measures of central tendency and how to calculate them for grouped data.', duration:45, difficulty:'beginner', order:5 }
    ],
    's20': [
      { id:'lsn20-1', subjectId:'s20', chapterId:'ch197', title:'Light - Reflection Basics', description:'Study laws of reflection, image formation by mirrors, and mirror formula.', duration:50, difficulty:'beginner', order:1 },
      { id:'lsn20-2', subjectId:'s20', chapterId:'ch198', title:'The Human Eye', description:'Understand the structure and working of the human eye, defects and corrections.', duration:45, difficulty:'beginner', order:2 },
      { id:'lsn20-3', subjectId:'s20', chapterId:'ch199', title:'Electric Current and Circuits', description:'Learn about electric current, Ohm\'s law, resistance and circuit diagrams.', duration:55, difficulty:'intermediate', order:3 },
      { id:'lsn20-4', subjectId:'s20', chapterId:'ch200', title:'Magnetic Effects of Current', description:'Study magnetic field patterns, electromagnets, and electric motors.', duration:50, difficulty:'intermediate', order:4 }
    ],
    's21': [
      { id:'lsn21-1', subjectId:'s21', chapterId:'ch202', title:'Chemical Reactions', description:'Learn about types of chemical reactions, balancing equations, and oxidation-reduction.', duration:50, difficulty:'beginner', order:1 },
      { id:'lsn21-2', subjectId:'s21', chapterId:'ch203', title:'Acids, Bases and Salts', description:'Study pH scale, properties of acids and bases, reactions and their everyday applications.', duration:50, difficulty:'beginner', order:2 },
      { id:'lsn21-3', subjectId:'s21', chapterId:'ch205', title:'Carbon and Its Compounds', description:'Explore covalent bonding, allotropes of carbon, and functional groups in organic chemistry.', duration:55, difficulty:'intermediate', order:3 },
      { id:'lsn21-4', subjectId:'s21', chapterId:'ch206', title:'Periodic Classification', description:'Understand the development of periodic table and trends in properties of elements.', duration:45, difficulty:'intermediate', order:4 }
    ],
    's22': [
      { id:'lsn22-1', subjectId:'s22', chapterId:'ch207', title:'Life Processes - Nutrition', description:'Study modes of nutrition, photosynthesis, and the human digestive system.', duration:55, difficulty:'beginner', order:1 },
      { id:'lsn22-2', subjectId:'s22', chapterId:'ch207', title:'Life Processes - Respiration', description:'Learn about aerobic and anaerobic respiration, human respiratory system.', duration:50, difficulty:'beginner', order:2 },
      { id:'lsn22-3', subjectId:'s22', chapterId:'ch208', title:'Control and Coordination', description:'Understand nervous system, reflex actions, hormones and plant movements.', duration:50, difficulty:'intermediate', order:3 },
      { id:'lsn22-4', subjectId:'s22', chapterId:'ch209', title:'How Do Organisms Reproduce', description:'Study modes of reproduction in plants and animals, and human reproductive system.', duration:55, difficulty:'intermediate', order:4 },
      { id:'lsn22-5', subjectId:'s22', chapterId:'ch211', title:'Our Environment', description:'Learn about ecosystems, food chains, waste management and environmental issues.', duration:45, difficulty:'beginner', order:5 }
    ],
    's23': [
      { id:'lsn23-1', subjectId:'s23', chapterId:'ch212', title:'A Letter to God - Prose Study', description:'Read and analyze the story by GL Fuentes, exploring themes of faith and human nature.', duration:45, difficulty:'beginner', order:1 },
      { id:'lsn23-2', subjectId:'s23', chapterId:'ch213', title:'Nelson Mandela - Long Walk to Freedom', description:'Study Mandela\'s autobiography, understanding apartheid and the struggle for freedom.', duration:45, difficulty:'beginner', order:2 },
      { id:'lsn23-3', subjectId:'s23', chapterId:'ch215', title:'Grammar - Tenses and Voice', description:'Master the 12 tenses and the active-passive voice conversion rules.', duration:50, difficulty:'intermediate', order:3 },
      { id:'lsn23-4', subjectId:'s23', chapterId:'ch216', title:'Writing Skills - Formal Letters', description:'Learn the format and style of formal letters, including complaints and inquiries.', duration:40, difficulty:'intermediate', order:4 }
    ]
  };

  // ==================== LEARNING PATHS ====================
  var learningPaths = {
    's19': { subjectId:'s19', stages:[
      { stage:1, name:'Subject Overview', description:'Get introduced to the Mathematics (Class 10) curriculum and exam pattern.', items:[], type:'introduction' },
      { stage:2, name:'Lesson Progression', description:'Follow sequential lessons from Real Numbers to Statistics.', items:[{ itemId:'lsn19-1', type:'lesson' },{ itemId:'lsn19-2', type:'lesson' },{ itemId:'lsn19-3', type:'lesson' },{ itemId:'lsn19-4', type:'lesson' },{ itemId:'lsn19-5', type:'lesson' }], type:'learning' },
      { stage:3, name:'Topic Mastery', description:'Deep dive into specific topics with detailed notes and video explanations.', items:[{ itemId:'ch183', type:'chapter' },{ itemId:'ch184', type:'chapter' },{ itemId:'ch186', type:'chapter' }], type:'topic' },
      { stage:4, name:'Learn & Understand', description:'Watch curated video playlists and read study materials for each chapter.', items:[], type:'learn' },
      { stage:5, name:'Practice & Apply', description:'Solve practice sets to reinforce your understanding of each chapter.', items:[{ itemId:'ps19-1', type:'practice' },{ itemId:'ps19-2', type:'practice' },{ itemId:'ps19-3', type:'practice' }], type:'practice' },
      { stage:6, name:'Quiz Yourself', description:'Take chapter-wise quizzes to test your knowledge and track progress.', items:[], type:'quiz' },
      { stage:7, name:'Assessment', description:'Attempt full-length assessments with mixed questions from the entire syllabus.', items:[], type:'assessment' },
      { stage:8, name:'Completion & Review', description:'Review weak areas, celebrate milestones, and proceed to the next subject.', items:[], type:'completion' }
    ] },
    's20': { subjectId:'s20', stages:[
      { stage:1, name:'Subject Overview', description:'Introduction to Class 10 Physics syllabus covering Light, Electricity, and Magnetism.', items:[], type:'introduction' },
      { stage:2, name:'Lesson Progression', description:'Complete physics lessons in sequence from optics to electricity.', items:[{ itemId:'lsn20-1', type:'lesson' },{ itemId:'lsn20-2', type:'lesson' },{ itemId:'lsn20-3', type:'lesson' },{ itemId:'lsn20-4', type:'lesson' }], type:'learning' },
      { stage:3, name:'Virtual Labs', description:'Perform virtual experiments to understand physics concepts hands-on.', items:[{ itemId:'vl1', type:'lab' },{ itemId:'vl2', type:'lab' },{ itemId:'vl4', type:'lab' },{ itemId:'vl8', type:'lab' }], type:'topic' },
      { stage:4, name:'Concept Learning', description:'Watch video explanations and read detailed notes on each topic.', items:[], type:'learn' },
      { stage:5, name:'Numerical Practice', description:'Solve physics numerical problems for each chapter.', items:[{ itemId:'ps20-1', type:'practice' },{ itemId:'ps20-2', type:'practice' }], type:'practice' },
      { stage:6, name:'Chapter Quizzes', description:'Test your conceptual understanding with chapter-wise quizzes.', items:[], type:'quiz' },
      { stage:7, name:'Full Assessment', description:'Take comprehensive tests covering all physics chapters.', items:[], type:'assessment' },
      { stage:8, name:'Lab Report & Review', description:'Compile lab observations and review all key concepts.', items:[], type:'completion' }
    ] },
    's21': { subjectId:'s21', stages:[
      { stage:1, name:'Subject Overview', description:'Introduction to Class 10 Chemistry - reactions, acids, bases, carbon compounds.', items:[], type:'introduction' },
      { stage:2, name:'Lesson Progression', description:'Follow the structured chemistry lesson plan.', items:[{ itemId:'lsn21-1', type:'lesson' },{ itemId:'lsn21-2', type:'lesson' },{ itemId:'lsn21-3', type:'lesson' },{ itemId:'lsn21-4', type:'lesson' }], type:'learning' },
      { stage:3, name:'Lab Experiments', description:'Perform virtual chemistry experiments to observe reactions firsthand.', items:[{ itemId:'vl9', type:'lab' },{ itemId:'vl10', type:'lab' },{ itemId:'vl11', type:'lab' },{ itemId:'vl14', type:'lab' }], type:'topic' },
      { stage:4, name:'Learn Concepts', description:'Watch demonstration videos and study mechanism of reactions.', items:[], type:'learn' },
      { stage:5, name:'Practice Questions', description:'Solve reaction-based and calculation-based chemistry problems.', items:[{ itemId:'ps21-1', type:'practice' },{ itemId:'ps21-2', type:'practice' }], type:'practice' },
      { stage:6, name:'Quiz', description:'Test your knowledge of chemical equations and periodic trends.', items:[], type:'quiz' },
      { stage:7, name:'Unit Assessment', description:'Full-length chemistry assessment covering all chapters.', items:[], type:'assessment' },
      { stage:8, name:'Lab Journal & Summary', description:'Document all lab results and create a chemistry revision guide.', items:[], type:'completion' }
    ] },
    's22': { subjectId:'s22', stages:[
      { stage:1, name:'Subject Overview', description:'Introduction to Biology - life processes, control systems, reproduction, and environment.', items:[], type:'introduction' },
      { stage:2, name:'Lesson Progression', description:'Complete sequential biology lessons from cell to ecosystem.', items:[{ itemId:'lsn22-1', type:'lesson' },{ itemId:'lsn22-2', type:'lesson' },{ itemId:'lsn22-3', type:'lesson' },{ itemId:'lsn22-4', type:'lesson' },{ itemId:'lsn22-5', type:'lesson' }], type:'learning' },
      { stage:3, name:'Lab & Observation', description:'Perform virtual biology experiments and observe specimens.', items:[{ itemId:'vl17', type:'lab' },{ itemId:'vl18', type:'lab' },{ itemId:'vl19', type:'lab' },{ itemId:'vl22', type:'lab' }], type:'topic' },
      { stage:4, name:'Study Diagrams', description:'Learn through labeled diagrams and animations of biological processes.', items:[], type:'learn' },
      { stage:5, name:'Practice Questions', description:'Answer descriptive and diagram-based biology questions.', items:[{ itemId:'ps22-1', type:'practice' },{ itemId:'ps22-2', type:'practice' }], type:'practice' },
      { stage:6, name:'Chapter Quizzes', description:'Test understanding of each biological system with quizzes.', items:[], type:'quiz' },
      { stage:7, name:'Comprehensive Test', description:'Full biology assessment with diagrams, MCQs, and long answer questions.', items:[], type:'assessment' },
      { stage:8, name:'Lab Report & Revision', description:'Review lab observations and create summary notes for exams.', items:[], type:'completion' }
    ] },
    's23': { subjectId:'s23', stages:[
      { stage:1, name:'Subject Overview', description:'Introduction to Class 10 English - prose, poetry, grammar, and writing skills.', items:[], type:'introduction' },
      { stage:2, name:'Lesson Progression', description:'Study prose chapters and poems in the prescribed sequence.', items:[{ itemId:'lsn23-1', type:'lesson' },{ itemId:'lsn23-2', type:'lesson' },{ itemId:'lsn23-3', type:'lesson' },{ itemId:'lsn23-4', type:'lesson' }], type:'learning' },
      { stage:3, name:'Literature Analysis', description:'Deep reading and analysis of each prose and poetry piece.', items:[{ itemId:'ch212', type:'chapter' },{ itemId:'ch213', type:'chapter' },{ itemId:'ch215', type:'chapter' }], type:'topic' },
      { stage:4, name:'Grammar & Writing', description:'Master grammar rules and practice various writing formats.', items:[], type:'learn' },
      { stage:5, name:'Practice Exercises', description:'Solve comprehension passages, grammar exercises, and writing prompts.', items:[{ itemId:'ps23-1', type:'practice' },{ itemId:'ps23-2', type:'practice' }], type:'practice' },
      { stage:6, name:'Vocabulary Quiz', description:'Test your vocabulary, idioms, and phrases knowledge.', items:[], type:'quiz' },
      { stage:7, name:'Mock Exam', description:'Full English paper with reading, writing, grammar, and literature sections.', items:[], type:'assessment' },
      { stage:8, name:'Review & Improve', description:'Identify weak areas in writing and literature for focused improvement.', items:[], type:'completion' }
    ] }
  };

  // ==================== ADDITIONAL STATIC DATA ====================

  // 40 Additional Videos
  (function() {
    var videoTitles = ['Understanding the Core Concepts','Step by Step Problem Solving','Complete Chapter Walkthrough','Important Formulas Explained','Previous Year Questions Solved','Quick Revision in 15 Minutes','Practice Session with Solutions','Real Life Applications','Concept Mapping and Visualization','Exam Strategy and Tips','Numerical Problems Explained','Diagram Based Learning','Lab Experiment Demonstration','Interactive Quiz Session','Doubt Clearing Session','Mind Map Revision','Common Mistakes to Avoid','Chapter Summary and Key Points','Competitive Exam Level Problems','Board Exam Special Revision','NCERT Exercise Solutions','Assertion Reason Practice','Case Study Analysis','Speed Problem Solving Techniques','Weekly Test Analysis','Group Discussion Session','Project Work Guide','Time Management Tips','Memory Techniques','Important Question Discussion','Formula Breakdown Session','Handwritten Notes Walkthrough','Board Exam Special','MCQ Practice Session','True False Discussion','Match the Following Exercise','Diagram Based Questions','Expert Interview Series','Career Guidance Talk','Motivational Session'];
    var descriptions = [
      'In this comprehensive video lesson, we dive deep into the core concepts with step-by-step explanations and practical examples to ensure thorough understanding.',
      'Master the key topics of this chapter with expert guidance. This video covers everything you need to know for exams with solved examples.',
      'Learn through detailed animations and real-world applications. Perfect for building strong fundamentals and scoring high in examinations.',
      'This session focuses on problem-solving techniques and common exam patterns. Practice along with the instructor for best results.',
      'A complete walkthrough of the chapter with emphasis on important questions and marking schemes. Ideal for last-minute revision.',
      'Understand the underlying principles with intuitive explanations and visual aids. Designed to make complex topics simple and enjoyable.',
      'Get exam-ready with this focused session covering high-weightage topics, previous year questions, and expert tips for maximum scores.',
      'Explore this topic through interactive examples and engaging discussions. Perfect for both beginners and advanced learners.'
    ];
    for (var vi = 0; vi < 40; vi++) {
      var sid = pick(SUBJECT_LIST);
      var chs = chapters[sid] || [];
      var ch = chs.length > 0 ? chs[Math.floor(Math.random() * chs.length)] : null;
      videos.push({
        id:'v' + (videos.length + 1), title:pick(videoTitles) + ' - ' + (ch ? ch.name : 'General'),
        subjectId:sid, chapterId:ch ? ch.id : null,
        duration:rand(300, 3600), thumbnail:null,
        views:rand(500, 500000), rating:(Math.random() * 2 + 3).toFixed(1),
        instructor:pick(INSTRUCTORS), channelName:pick(CHANNELS),
        level:pick(['beginner','intermediate','advanced']), isFree:Math.random() > 0.25,
        youtubeId:null, url:'#', description:pick(descriptions),
        tags:['ncert','cbse','exam-prep','concept','revision','practice'], language:pick(['Hindi','English','Hinglish'])
      });
    }
  })();

  // 30 Additional Resources
  (function() {
    var resTypes = ['pdf','notes','worksheet','reference','question-bank','previous-paper','assignment'];
    var resTitles = ['Comprehensive Study Notes','Practice Problem Set','Quick Revision Guide','Chapter Summary','Important Questions Bank','Sample Paper with Solutions','Formula Sheet','Mind Map','Lab Manual','Case Study Collection','Previous Year Question Paper','Topic Wise Worksheet','NCERT Solutions','Concept Map','Self Assessment Test'];
    var resDescs = ['Comprehensive study material covering all key concepts with detailed explanations.','Practice problems with step-by-step solutions for thorough understanding.','Quick reference guide for last-minute revision before exams.','In-depth notes curated by subject experts covering the entire syllabus.','Collection of important questions with marking scheme analysis.','Chapter-wise summary with all important formulas, definitions and diagrams.','Previous year board questions with detailed solutions and answer keys.'];
    for (var ri = 0; ri < 30; ri++) {
      var sid = pick(SUBJECT_LIST);
      var chs = chapters[sid] || [];
      var ch = chs.length > 0 ? chs[Math.floor(Math.random() * chs.length)] : null;
      var tp = pick(resTypes);
      resources.push({
        id:'r' + (resources.length + 1), subjectId:sid, chapterId:ch ? ch.id : null,
        type:tp, title:pick(resTitles) + ' - ' + (ch ? ch.name : 'General'),
        description:pick(resDescs), size:(Math.random() * 50 + 0.5).toFixed(1) + ' MB',
        pages:rand(5, 150), url:null
      });
    }
  })();

  // 20 Additional Marketplace Items
  (function() {
    var cats = ['books','stationery','courses','electronics','accessories','notes','practice-books','mock-tests'];
    var sellers = ['EduStore','BookBee','StudyMart','LearnShop','PrepZone','SkillCart','EduHub','KnowledgePoint','AcademicStore','SmartStudy'];
    var productNames = [
      { cat:'books', names:['NCERT Mathematics Textbook','Science Reference Book','English Grammar Guide','Social Studies Textbook Set','Physics Concept Book'] },
      { cat:'stationery', names:['Premium Notebook Pack','Geometry Box','Art and Drawing Kit','Exam Stationery Kit','Whiteboard and Markers Set'] },
      { cat:'courses', names:['Online Live Course Bundle','Recorded Video Course','Crash Course for Exams','Weekend Batch Program','Fast Track Revision Course'] },
      { cat:'electronics', names:['Scientific Calculator','Noise Cancelling Headphones','Digital Study Tablet','Smart Pen Recorder','USB Microscope'] },
      { cat:'accessories', names:['Laptop Bag','Study Lamp','Desk Organizer','Ergonomic Chair','Book Stand'] },
      { cat:'notes', names:['Handwritten Notes PDF','Digital Notes Bundle','Topic Wise Notes','Formula Revision Notes','Chapter Summary Notes'] },
      { cat:'practice-books', names:['Practice Workbook','Problem Set Book','Daily Practice Problems','Chapterwise Practice Book','Sample Paper Practice Book'] },
      { cat:'mock-tests', names:['Full Length Mock Test','Sectional Test Series','Subject Wise Test Pack','Online Test Series','Adaptive Practice Tests'] }
    ];
    for (var mi = 0; mi < 20; mi++) {
      var cat = pick(cats);
      var catProducts = null;
      for (var pci = 0; pci < productNames.length; pci++) { if (productNames[pci].cat === cat) { catProducts = productNames[pci]; break; } }
      var name = catProducts ? pick(catProducts.names) : 'Study Product';
      var op = rand(199, 5000);
      var dp = Math.floor(op * (1 - Math.random() * 0.5));
      var subjCount = rand(1, 4);
      var subjIds = [];
      for (var si = 0; si < subjCount; si++) { var s = pick(SUBJECTS); if (subjIds.indexOf(s.id) === -1) subjIds.push(s.id); }
      marketplace.push({
        id:'m' + (marketplace.length + 1), name:name + ' - ' + (marketplace.length + 1),
        category:cat, price:dp, originalPrice:op,
        rating:(Math.random() * 2 + 3).toFixed(1), reviewCount:rand(5, 1000),
        image:'product.png', description:'High quality ' + cat.slice(0, -1) + ' designed for students. Perfect for exam preparation and daily practice.',
        inStock:Math.random() > 0.2, seller:pick(sellers),
        specs:{ brand:pick(['EduMentee','Classmate','Navneet','Parker','Casio','HP','Dell']), warranty:pick(['1 Year','2 Years','No Warranty','Lifetime']) },
        subjects:subjIds
      });
    }
  })();

  window.mockData = {
    users: students,
    students: students,
    teachers: teachers,
    courses: COURSES,
    subjects: SUBJECTS,
    chapters: chapters,
    topics: topics,
    videos: videos,
    resources: resources,
    marketplace: marketplace,
    books: books,
    quizzes: quizzes,
    exams: exams,
    scholarships: scholarships,
    communityPosts: communityPosts,
    feedPosts: feedPosts,
    notifications: notifications,
    leaderboard: leaderboard,
    achievements: achievements,
    coupons: coupons,
    categories: categories,
    enrolledClasses: enrolledClasses,
    assignments: assignments,
    events: events,
    announcements: announcements,
    meetings: meetings,
    certificates: certificates,
    careers: careers,
    internships: internships,
    competitiveExams: competitiveExams,
    languages: languages,
    codingCourses: codingCourses,
    skills: skills,
    subscriptions: subscriptions,
    communityMessages: communityMessages,
    examResults: examResults,
    teacherResponses: teacherResponses,
    teacherReplies: teacherReplies,
    doubtQuestions: doubtQuestions,
    playlists: playlists,
    feedComments: feedComments,
    teacherSchedules: teacherSchedules,
    calendarEvents: calendarEvents,
    virtualLabs: virtualLabs,
    gamification: gamification,
    practice: practice,
    lessons: lessons,
    learningPaths: learningPaths
  };

  window.mockData.chapterNames = CHAPTER_NAMES;
})();
