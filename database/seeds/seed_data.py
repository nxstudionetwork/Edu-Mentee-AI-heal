import sys
import os
from datetime import datetime, timedelta, time
from pathlib import Path

sys.path.insert(0, str(Path(__file__).parent.parent))

from sqlalchemy.orm import Session
from app.database import SessionLocal, engine, Base
from app.models.user import User, Teacher, Student, UserRole, Gender
from app.models.content import Subject, Lesson, Topic, Resource, Video, ResourceType, VideoDifficulty
from app.models.community import Community, Channel, Post, Comment, Notification, ChannelType, PostType
from app.models.quiz import Quiz, QuizQuestion, QuizAttempt
from app.models.exam import Exam, ExamRegistration, ExamResult
from app.models.event import CalendarEvent, EventType
from app.models.virtual_lab import VirtualLab, Experiment
from app.models.marketplace import Category, Product, Order, OrderItem
from app.models.gamification import Achievement, Badge, UserBadge, Reward, Leaderboard
from app.models.scholarship import Scholarship
from app.models.download import ResourceDownload

_id_counters = {}

def make_id(prefix: str, key: str = None) -> str:
    k = key or prefix
    _id_counters[k] = _id_counters.get(k, 0) + 1
    return f"{prefix}-{_id_counters[k]:04d}"


def seed():
    db: Session = SessionLocal()

    if db.query(User).first():
        print("Database already seeded. Skipping.")
        db.close()
        return

    print("Seeding database...")

    now = datetime.utcnow()
    pwd_hash = "$2b$12$LJ3m4ys1Lz0vUxjqYqkz5uQz1xQz1xQz1xQz1xQz1xQz1xQz"

    # ── Users ────────────────────────────────────────────────────────────
    admin = User(
        uid="USR-0001", login_id="admin", full_name="Admin User",
        email="admin@edumentee.com", hashed_password=pwd_hash, phone="9000000001",
        gender=Gender.male, school="Edu-Mentee HQ", role=UserRole.admin,
        is_active=True, is_verified=True, city="New Delhi", state="Delhi",
        coins=0, xp=0, level=10,
    )
    student1 = User(
        uid="USR-0002", login_id="aarav.sharma", student_id="STU-2024-001",
        full_name="Aarav Sharma", email="aarav.sharma@email.com",
        hashed_password=pwd_hash, phone="9876543210",
        date_of_birth=datetime(2009, 5, 15), gender=Gender.male,
        school="Delhi Public School", class_name="Class 10", section="A",
        city="New Delhi", state="Delhi", pincode="110001",
        parent_name="Vikram Sharma", parent_phone="9876543211",
        parent_email="vikram.sharma@email.com",
        role=UserRole.student, is_active=True, is_verified=True,
        coins=250, xp=1500, level=5,
    )
    student2 = User(
        uid="USR-0003", login_id="priya.patel", student_id="STU-2024-002",
        full_name="Priya Patel", email="priya.patel@email.com",
        hashed_password=pwd_hash, phone="9876543220",
        date_of_birth=datetime(2007, 11, 22), gender=Gender.female,
        school="St. Mary's Convent", class_name="Class 12", section="B",
        stream="Science", city="Mumbai", state="Maharashtra", pincode="400001",
        parent_name="Rajesh Patel", parent_phone="9876543221",
        parent_email="rajesh.patel@email.com",
        role=UserRole.student, is_active=True, is_verified=True,
        coins=400, xp=3200, level=8,
    )
    teacher = User(
        uid="USR-0004", login_id="rajesh.kumar", full_name="Dr. Rajesh Kumar",
        email="rajesh.kumar@email.com", hashed_password=pwd_hash,
        phone="9876543230", date_of_birth=datetime(1980, 3, 10),
        gender=Gender.male, school="Kendriya Vidyalaya",
        role=UserRole.teacher, is_active=True, is_verified=True,
        city="New Delhi", state="Delhi", pincode="110075",
        coins=0, xp=0, level=10,
    )
    db.add_all([admin, student1, student2, teacher])
    db.flush()

    teacher_profile = Teacher(
        uid="TCHR-0001", user_id=teacher.id,
        qualification="Ph.D. Mathematics, IIT Delhi",
        experience_years=15,
        subjects=["Mathematics", "Physics"],
        bio="Dr. Rajesh Kumar is a distinguished mathematics educator with over 15 years of experience teaching CBSE and competitive exam students.",
        is_available=True,
    )
    student_profile1 = Student(uid="STU-0001", user_id=student1.id)
    student_profile2 = Student(uid="STU-0002", user_id=student2.id)
    db.add_all([teacher_profile, student_profile1, student_profile2])
    db.flush()

    print("  Users seeded.")

    # ── Subjects ─────────────────────────────────────────────────────────
    subjects_data = [
        ("Mathematics", "MAT-01", "Core mathematical concepts for CBSE curriculum", "#3B82F6", "Class 10", None),
        ("Science", "SCI-01", "Physics, Chemistry and Biology fundamentals", "#10B981", "Class 10", None),
        ("English", "ENG-01", "English Language and Literature", "#8B5CF6", "Class 10", None),
        ("History", "HIS-01", "Indian and World History for CBSE", "#F59E0B", "Class 10", None),
        ("Geography", "GEO-01", "Physical and Human Geography of India", "#EF4444", "Class 10", None),
        ("Computer Science", "CS-01", "Programming fundamentals and digital literacy", "#06B6D4", "Class 12", "Science"),
    ]
    subject_objs = {}
    for i, (name, code, desc, color, cls, stream) in enumerate(subjects_data, 1):
        s = Subject(
            uid=f"SUBJ-{i:04d}", name=name, code=code, description=desc,
            color=color, class_name=cls, stream=stream, order_index=i,
        )
        db.add(s)
        db.flush()
        subject_objs[code] = s

    print("  Subjects seeded.")

    # ── Lessons & Topics ─────────────────────────────────────────────────
    lessons_data = {
        "MAT-01": [
            ("Polynomials", "Introduction to polynomials, degrees and zeroes", 45, [
                ("What is a Polynomial", "Definition and types of polynomials", 15),
                ("Degree of a Polynomial", "Finding degree of monomials, binomials and trinomials", 10),
                ("Zeroes of a Polynomial", "Understanding zeroes and their geometric meaning", 10),
                ("Factor Theorem", "Using factor theorem to factorize polynomials", 10),
            ]),
            ("Quadratic Equations", "Solving quadratic equations by various methods", 60, [
                ("Standard Form", "Writing equations in ax\u00b2 + bx + c = 0 form", 10),
                ("Factorization Method", "Solving by splitting the middle term", 15),
                ("Quadratic Formula", "Using the formula x = (-b \u00b1 \u221a(b\u00b2-4ac)) / 2a", 15),
                ("Nature of Roots", "Discriminant analysis and nature of roots", 10),
                ("Word Problems", "Real-life applications of quadratic equations", 10),
            ]),
            ("Arithmetic Progressions", "Understanding sequences and series", 50, [
                ("Introduction to AP", "Definition, first term and common difference", 10),
                ("nth Term of AP", "Formula for finding the nth term", 15),
                ("Sum of n Terms", "Sum formulas for arithmetic progressions", 15),
                ("Applications of AP", "Solving real-world problems using AP", 10),
            ]),
        ],
        "SCI-01": [
            ("Light - Reflection and Refraction", "Understanding behavior of light", 55, [
                ("Reflection of Light", "Laws of reflection and plane mirrors", 10),
                ("Spherical Mirrors", "Concave and convex mirrors", 15),
                ("Refraction of Light", "Snell's law and refractive index", 15),
                ("Lenses", "Converging and diverging lenses", 10),
                ("Lens Formula and Magnification", "1/v - 1/u = 1/f and magnification", 5),
            ]),
            ("Acids, Bases and Salts", "Chemical properties of acids and bases", 50, [
                ("Acids and Bases", "Properties, definitions and pH scale", 10),
                ("Reactions of Acids and Bases", "Neutralization reactions", 10),
                ("pH Scale", "Measuring acidity and alkalinity", 10),
                ("Salts", "Common salt and its industrial uses", 10),
                ("Types of Salts", "Normal, acidic, basic and double salts", 10),
            ]),
            ("Life Processes", "Fundamental biological processes", 55, [
                ("Nutrition in Organisms", "Autotrophic and heterotrophic nutrition", 10),
                ("Respiration", "Aerobic and anaerobic respiration", 10),
                ("Transportation in Humans", "Circulatory system and blood", 15),
                ("Excretion", "Excretory system and its functions", 10),
                ("Excretion in Plants", "How plants remove waste", 10),
            ]),
        ],
        "ENG-01": [
            ("Footprints Without Feet", "Prose chapter study guide", 40, [
                ("Chapter Summary", "Detailed summary of the chapter", 10),
                ("Key Vocabulary", "Important words and their meanings", 10),
                ("Comprehension Questions", "Answering questions based on the text", 10),
                ("Character Analysis", "Understanding character motivations", 10),
            ]),
            ("Poetry - Amanda", "Poetry appreciation and analysis", 35, [
                ("Poem Summary", "Line-by-line explanation", 10),
                ("Literary Devices", "Identifying metaphors, alliteration and irony", 10),
                ("Theme and Tone", "Understanding the poet's message", 8),
                ("Thinking Questions", "Critical thinking and interpretation", 7),
            ]),
            ("Grammar - Tenses", "Mastering English tenses", 45, [
                ("Present Tenses", "Simple present, continuous, perfect", 10),
                ("Past Tenses", "Simple past, continuous, perfect", 10),
                ("Future Tenses", "Simple future, going to, will/shall", 10),
                ("Tense Exercises", "Practice exercises and worksheets", 15),
            ]),
        ],
        "HIS-01": [
            ("The Rise of Nationalism in Europe", "Nationalist movements in 19th century Europe", 50, [
                ("French Revolution and Liberalism", "Impact of French Revolution on nationalism", 10),
                ("Nation Building in Europe", "Germany, Italy and Great Britain", 15),
                ("Nationalist Movements in Balkans", "Rise of Balkan nationalism", 10),
                ("Visualizing the Nation", "Allegory and nationalism", 5),
                ("Legacy of Nationalism", "Impact on modern Europe", 10),
            ]),
            ("Nationalism in India", "Indian freedom struggle and nationalism", 55, [
                ("First World War and Khilafat", "Impact of WWI on Indian nationalism", 10),
                ("Non-Cooperation Movement", "Gandhi's first mass movement", 15),
                ("Civil Disobedience Movement", "Salt March and beyond", 15),
                ("Quit India Movement", "Final phase of freedom struggle", 10),
                ("Impact on Indian Society", "Social and economic effects", 5),
            ]),
        ],
        "GEO-01": [
            ("Resources and Development", "Understanding natural resources", 45, [
                ("Types of Resources", "Natural, human and human-made resources", 10),
                ("Resource Conservation", "Sustainable development and conservation", 10),
                ("Land Resources", "Land use patterns in India", 10),
                ("Soil Types", "Major soil types and their distribution", 10),
                ("Land Degradation", "Causes and conservation measures", 5),
            ]),
            ("Agriculture", "Farming practices in India", 50, [
                ("Types of Farming", "Subsistence and commercial farming", 10),
                ("Cropping Patterns", "Kharif, Rabi and Zaid crops", 10),
                ("Major Crops", "Rice, wheat, cotton, tea, coffee", 15),
                ("Green Revolution", "Impact on Indian agriculture", 10),
                ("Food Security", "Challenges and government initiatives", 5),
            ]),
        ],
        "CS-01": [
            ("Python Fundamentals", "Introduction to Python programming", 60, [
                ("Python Basics", "Variables, data types and operators", 10),
                ("Control Flow", "If-else, for and while loops", 15),
                ("Functions", "Defining and calling functions", 15),
                ("Lists and Tuples", "Working with sequences", 10),
                ("Dictionary and Sets", "Mapping and set operations", 10),
            ]),
            ("Data Structures", "Core data structures in Python", 55, [
                ("Lists In-Depth", "Slicing, methods and list comprehensions", 10),
                ("Stacks", "LIFO data structure implementation", 15),
                ("Queues", "FIFO data structure implementation", 10),
                ("Linked Lists", "Singly linked list operations", 10),
                ("Trees", "Binary tree basics", 10),
            ]),
            ("Object-Oriented Programming", "OOP concepts in Python", 60, [
                ("Classes and Objects", "Defining classes and creating objects", 10),
                ("Inheritance", "Single, multiple and multilevel inheritance", 15),
                ("Polymorphism", "Method overloading and overriding", 15),
                ("Encapsulation", "Data hiding and access modifiers", 10),
                ("Abstraction", "Abstract classes and interfaces", 10),
            ]),
        ],
    }

    lesson_objs = {}
    for code, lessons in lessons_data.items():
        subj = subject_objs[code]
        for li, (title, desc, dur, topics) in enumerate(lessons, 1):
            lesson = Lesson(
                uid=f"LESS-{code.split('-')[1]}-{li:02d}",
                subject_id=subj.id, title=title, description=desc,
                order_index=li, duration_minutes=dur,
            )
            db.add(lesson)
            db.flush()
            lesson_objs[f"{code}-L{li}"] = lesson

            for ti, (ttitle, tdesc, tdur) in enumerate(topics, 1):
                topic = Topic(
                    uid=f"TOP-{code.split('-')[1]}-{li:02d}-{ti:02d}",
                    lesson_id=lesson.id, title=ttitle, content=tdesc,
                    order_index=ti, duration_minutes=tdur,
                )
                db.add(topic)

    db.flush()
    print("  Lessons & Topics seeded.")

    # ── Resources ────────────────────────────────────────────────────────
    resources_data = [
        ("Mathematics Textbook - Chapter 1", "Polynomials chapter from NCERT textbook", ResourceType.textbook, "MAT-01", None, 2048000, 150),
        ("Mathematics Notes - Quadratic Equations", "Handwritten notes on quadratic equations", ResourceType.notes, "MAT-01", None, 512000, 85),
        ("Quadratic Equations PPT", "Presentation covering all methods of solving", ResourceType.ppt, "MAT-01", "MAT-01-L2", 3072000, 120),
        ("AP Worksheet", "Practice problems on Arithmetic Progressions", ResourceType.worksheet, "MAT-01", "MAT-01-L3", 256000, 60),
        ("Light and Optics Textbook", "NCERT Chapter on Light", ResourceType.textbook, "SCI-01", None, 1536000, 95),
        ("Acids Bases Notes", "Comprehensive revision notes", ResourceType.notes, "SCI-01", "SCI-01-L2", 384000, 70),
        ("Life Processes PPT", "Visual presentation of biological processes", ResourceType.ppt, "SCI-01", "SCI-01-L3", 4096000, 110),
        ("Science Lab Worksheet", "Virtual lab activity sheets", ResourceType.worksheet, "SCI-01", None, 192000, 45),
        ("Footprints Without Feet Notes", "Chapter notes and summary", ResourceType.notes, "ENG-01", "ENG-01-L1", 320000, 65),
        ("English Grammar Worksheets", "Tenses practice workbook", ResourceType.worksheet, "ENG-01", "ENG-01-L3", 448000, 55),
        ("Nationalism in Europe Textbook", "NCERT History chapter", ResourceType.textbook, "HIS-01", None, 1024000, 80),
        ("Nationalism in India Notes", "Detailed chapter notes", ResourceType.notes, "HIS-01", "HIS-01-L2", 384000, 75),
        ("History Timeline PPT", "Visual timeline of nationalist movements", ResourceType.ppt, "HIS-01", None, 2048000, 40),
        ("Resources and Development Notes", "Geography revision notes", ResourceType.notes, "GEO-01", "GEO-01-L1", 256000, 50),
        ("Agriculture PPT", "Agricultural practices in India", ResourceType.ppt, "GEO-01", "GEO-01-L2", 3072000, 35),
        ("Geography Map Worksheet", "Map pointing and analysis", ResourceType.worksheet, "GEO-01", None, 192000, 30),
        ("Python Fundamentals Textbook", "Introduction to Python programming", ResourceType.textbook, "CS-01", None, 1536000, 200),
        ("Python Exercises Worksheet", "Coding exercises for beginners", ResourceType.worksheet, "CS-01", "CS-01-L1", 128000, 175),
        ("OOP Concepts PPT", "Object-Oriented Programming slides", ResourceType.ppt, "CS-01", "CS-01-L3", 2048000, 90),
        ("Data Structures Notes", "Notes on stacks, queues, linked lists", ResourceType.notes, "CS-01", "CS-01-L2", 384000, 140),
    ]
    for ri, (title, desc, rtype, code, lesson_key, fsize, dl) in enumerate(resources_data, 1):
        subj = subject_objs[code]
        lesson = lesson_objs.get(lesson_key) if lesson_key else None
        res = Resource(
            uid=f"RES-{ri:04d}", subject_id=subj.id,
            lesson_id=lesson.id if lesson else None,
            title=title, description=desc, type=rtype,
            file_url=f"/uploads/resources/{rtype.value}_{ri}.pdf",
            file_size=fsize, mime_type="application/pdf",
            is_featured=(dl > 100), download_count=dl, is_active=True,
        )
        db.add(res)

    db.flush()
    print("  Resources seeded.")

    # ── Videos ───────────────────────────────────────────────────────────
    videos_data = [
        ("Polynomials Introduction", "MAT-01", "MAT-01-L1", 720, VideoDifficulty.easy, 1200),
        ("Quadratic Formula Explained", "MAT-01", "MAT-01-L2", 900, VideoDifficulty.medium, 850),
        ("AP Solved Examples", "MAT-01", "MAT-01-L3", 600, VideoDifficulty.medium, 620),
        ("Reflection of Light", "SCI-01", "SCI-01-L1", 840, VideoDifficulty.easy, 950),
        ("pH Scale Demonstration", "SCI-01", "SCI-01-L2", 540, VideoDifficulty.easy, 780),
        ("Circulatory System 3D", "SCI-01", "SCI-01-L3", 960, VideoDifficulty.medium, 1100),
        ("Footprints Without Feet Summary", "ENG-01", "ENG-01-L1", 480, VideoDifficulty.easy, 520),
        ("Tenses Made Easy", "ENG-01", "ENG-01-L3", 660, VideoDifficulty.easy, 430),
        ("French Revolution and Nationalism", "HIS-01", "HIS-01-L1", 780, VideoDifficulty.medium, 340),
        ("Non-Cooperation Movement", "HIS-01", "HIS-01-L2", 900, VideoDifficulty.medium, 410),
        ("Types of Resources", "GEO-01", "GEO-01-L1", 540, VideoDifficulty.easy, 290),
        ("Green Revolution Impact", "GEO-01", "GEO-01-L2", 720, VideoDifficulty.medium, 250),
        ("Python for Beginners", "CS-01", "CS-01-L1", 1080, VideoDifficulty.easy, 2200),
        ("Understanding OOP", "CS-01", "CS-01-L3", 960, VideoDifficulty.hard, 980),
        ("Stacks and Queues Explained", "CS-01", "CS-01-L2", 840, VideoDifficulty.medium, 750),
    ]
    for vi, (title, code, lesson_key, dur, diff, views) in enumerate(videos_data, 1):
        subj = subject_objs[code]
        lesson = lesson_objs.get(lesson_key)
        vid = Video(
            uid=f"VID-{vi:04d}", subject_id=subj.id,
            lesson_id=lesson.id if lesson else None,
            title=title,
            description=f"Educational video on {title.lower()}",
            url=f"https://www.youtube.com/watch?v=demo{vi:04d}",
            thumbnail_url=f"/uploads/thumbnails/vid_{vi}.jpg",
            duration_seconds=dur, difficulty=diff,
            is_featured=(views > 800), view_count=views, is_active=True,
        )
        db.add(vid)

    db.flush()
    print("  Videos seeded.")

    # ── Quizzes & Questions ──────────────────────────────────────────────
    quiz_data = [
        {
            "title": "Polynomials Quiz", "subject": "MAT-01", "lesson": "MAT-01-L1",
            "difficulty": "easy", "time_limit": 15, "passing": 60.0,
            "questions": [
                ("What is the degree of the polynomial 3x\u00b2 + 2x + 1?",
                 ["1", "2", "3", "0"], 1, "The highest power of x is 2"),
                ("Which of the following is a binomial?",
                 ["x + 1", "x\u00b2 + x + 1", "x\u00b3", "5"], 0, "A binomial has exactly two terms"),
                ("If p(x) = x\u00b2 - 5x + 6, then p(2) = ?",
                 ["0", "2", "-2", "4"], 0, "p(2) = 4 - 10 + 6 = 0"),
                ("The zeroes of x\u00b2 - 5x + 6 are:",
                 ["2 and 3", "-2 and -3", "2 and -3", "-2 and 3"], 0, "Factorizing: (x-2)(x-3) = 0"),
                ("A polynomial of degree 3 is called:",
                 ["Linear", "Quadratic", "Cubic", "Biquadratic"], 2, "Degree 3 polynomial is cubic"),
            ],
        },
        {
            "title": "Light - Reflection & Refraction Quiz", "subject": "SCI-01", "lesson": "SCI-01-L1",
            "difficulty": "medium", "time_limit": 20, "passing": 50.0,
            "questions": [
                ("The angle of incidence equals the angle of ______.",
                 ["Refraction", "Reflection", "Diffraction", "Dispersion"], 1, "First law of reflection"),
                ("A concave mirror is used in:",
                 ["Road safety mirrors", "Solar cookers", "Periscopes", "None"], 1, "Concave mirrors converge light for heating"),
                ("The refractive index of water is approximately:",
                 ["1.0", "1.33", "1.5", "2.0"], 1, "Water has refractive index ~1.33"),
                ("A convex lens always forms:",
                 ["Virtual image", "Real image", "Depends on object position", "No image"], 2, "Nature of image depends on object position"),
                ("Snell's law relates:",
                 ["Speed and frequency", "Angles of incidence and refraction", "Wavelength and amplitude", "None"], 1, "n\u2081sin\u03b8\u2081 = n\u2082sin\u03b8\u2082"),
            ],
        },
        {
            "title": "Python Programming Quiz", "subject": "CS-01", "lesson": "CS-01-L1",
            "difficulty": "easy", "time_limit": 15, "passing": 60.0,
            "questions": [
                ("Which keyword is used to define a function in Python?",
                 ["function", "func", "def", "define"], 2, "'def' is the keyword for function definition"),
                ("What is the output of print(type([]))?",
                 ["<class 'tuple'>", "<class 'list'>", "<class 'dict'>", "<class 'set'>"], 1, "[] creates an empty list"),
                ("Which of these is not a valid Python data type?",
                 ["int", "float", "char", "bool"], 2, "Python has no separate char type"),
                ("What does len() return for 'Hello'?",
                 ["4", "5", "6", "Error"], 1, "'Hello' has 5 characters"),
                ("Which operator is used for exponentiation in Python?",
                 ["^", "**", "^^", "pow"], 1, "** is the exponentiation operator"),
            ],
        },
    ]
    for qi, qd in enumerate(quiz_data, 1):
        subj = subject_objs[qd["subject"]]
        lesson = lesson_objs.get(qd["lesson"])
        quiz = Quiz(
            uid=f"QIZ-{qi:04d}", subject_id=subj.id,
            lesson_id=lesson.id if lesson else None,
            title=qd["title"], description=f"Test your knowledge on {qd['title'].lower()}",
            difficulty=qd["difficulty"], time_limit_minutes=qd["time_limit"],
            total_questions=len(qd["questions"]), passing_score=qd["passing"],
            is_active=True,
        )
        db.add(quiz)
        db.flush()
        for qi2, (qtext, opts, correct, expl) in enumerate(qd["questions"], 1):
            qq = QuizQuestion(
                uid=f"QUES-{qi:04d}-{qi2:02d}", quiz_id=quiz.id,
                question_text=qtext, options=opts,
                correct_answer=correct, explanation=expl,
                marks=1, order_index=qi2,
            )
            db.add(qq)

    db.flush()
    print("  Quizzes seeded.")

    # ── Exams ────────────────────────────────────────────────────────────
    exam1 = Exam(
        uid="EXAM-0001", subject_id=subject_objs["MAT-01"].id,
        title="Mid-Term Mathematics Examination",
        description="Half-yearly examination covering Chapters 1-4",
        exam_date=now + timedelta(days=30),
        duration_minutes=180, total_marks=80, passing_marks=33,
        is_active=True,
    )
    exam2 = Exam(
        uid="EXAM-0002", subject_id=subject_objs["SCI-01"].id,
        title="Science Unit Test - Light",
        description="Unit test on Light - Reflection and Refraction",
        exam_date=now + timedelta(days=15),
        duration_minutes=60, total_marks=40, passing_marks=16,
        is_active=True,
    )
    db.add_all([exam1, exam2])
    db.flush()

    for exam in [exam1, exam2]:
        for user in [student1, student2]:
            reg = ExamRegistration(
                uid=make_id("EREG"), exam_id=exam.id, user_id=user.id,
                is_attended=False,
            )
            db.add(reg)

    result1 = ExamResult(
        uid=make_id("ERES"), exam_id=exam1.id, user_id=student2.id,
        marks_obtained=72.0, total_marks=80, percentage=90.0,
        grade="A+", rank=1, is_passed=True,
        completed_at=now - timedelta(days=5),
    )
    db.add(result1)
    db.flush()
    print("  Exams seeded.")

    # ── Marketplace ──────────────────────────────────────────────────────
    cat_books = Category(uid="CAT-0001", name="Books", description="Textbooks, guides and reference materials", icon="book-icon")
    cat_stationery = Category(uid="CAT-0002", name="Stationery", description="Pens, pencils, notebooks and more", icon="pen-icon")
    cat_electronics = Category(uid="CAT-0003", name="Electronics", description="Calculators, tablets and educational gadgets", icon="laptop-icon")
    db.add_all([cat_books, cat_stationery, cat_electronics])
    db.flush()

    products_data = [
        ("NCERT Mathematics Class 10", "Complete NCERT textbook for Class 10 Mathematics", 245.0, 199.0, 50, "BOOK-001", cat_books.id, 4.5, 120),
        ("NCERT Science Class 10", "Complete NCERT Science textbook", 265.0, 210.0, 45, "BOOK-002", cat_books.id, 4.6, 95),
        ("RS Aggarwal Maths Guide", "Comprehensive maths reference book", 450.0, 380.0, 30, "BOOK-003", cat_books.id, 4.8, 200),
        ("Classmate Notebook Set (5 pack)", "Quad ruled and lined notebooks", 175.0, 149.0, 200, "STAT-001", cat_stationery.id, 4.3, 350),
        ("Cello Gripper Pens (10 pack)", "Smooth ballpoint pens", 85.0, 69.0, 300, "STAT-002", cat_stationery.id, 4.2, 420),
        ("Camlin Geometry Box", "Complete geometry box with compass and protractor", 180.0, 145.0, 150, "STAT-003", cat_stationery.id, 4.4, 280),
        ("Casio fx-991EX Calculator", "Scientific calculator for Class 11-12", 1295.0, 1099.0, 60, "ELEC-001", cat_electronics.id, 4.7, 180),
        ("Fire-Boltt Phoenix Smartwatch", "Smartwatch with health tracking", 4999.0, 3499.0, 40, "ELEC-002", cat_electronics.id, 4.1, 90),
        ("Samsung Galaxy Tab A8", "Android tablet for online learning", 17999.0, 14999.0, 25, "ELEC-003", cat_electronics.id, 4.3, 65),
        ("JBL Wave 100 TWS Earbuds", "Wireless earbuds for online classes", 3999.0, 2499.0, 80, "ELEC-004", cat_electronics.id, 4.4, 150),
    ]
    product_objs = []
    for pi, (name, desc, price, dprice, stock, sku, cat_id, rating, reviews) in enumerate(products_data, 1):
        p = Product(
            uid=f"PROD-{pi:04d}", category_id=cat_id, name=name, description=desc,
            price=price, discount_price=dprice,
            image_url=f"/uploads/products/{sku}.jpg",
            stock=stock, is_featured=(reviews > 150), rating=rating, review_count=reviews,
        )
        db.add(p)
        product_objs.append(p)

    db.flush()
    print("  Marketplace seeded.")

    # ── Orders ───────────────────────────────────────────────────────────
    order1 = Order(
        uid="ORD-0001", user_id=student1.id,
        total_amount=510.0, discount_amount=50.0, final_amount=460.0,
        status="delivered", shipping_address="Vikram Sharma, 12-A Lajpat Nagar, New Delhi - 110024",
        tracking_number="IND123456789",
    )
    db.add(order1)
    db.flush()

    oi1 = OrderItem(uid="OITM-0001", order_id=order1.id, product_id=product_objs[0].id,
                    product_name="NCERT Mathematics Class 10", quantity=1, unit_price=199.0, total_price=199.0)
    oi2 = OrderItem(uid="OITM-0002", order_id=order1.id, product_id=product_objs[3].id,
                    product_name="Classmate Notebook Set (5 pack)", quantity=2, unit_price=149.0, total_price=298.0)
    db.add_all([oi1, oi2])

    order2 = Order(
        uid="ORD-0002", user_id=student2.id,
        total_amount=1650.0, discount_amount=151.0, final_amount=1499.0,
        status="shipped", shipping_address="Rajesh Patel, 45 Andheri West, Mumbai - 400058",
        tracking_number="IND987654321",
    )
    db.add(order2)
    db.flush()

    oi3 = OrderItem(uid="OITM-0003", order_id=order2.id, product_id=product_objs[6].id,
                    product_name="Casio fx-991EX Calculator", quantity=1, unit_price=1099.0, total_price=1099.0)
    oi4 = OrderItem(uid="OITM-0004", order_id=order2.id, product_id=product_objs[5].id,
                    product_name="Camlin Geometry Box", quantity=2, unit_price=145.0, total_price=290.0)
    db.add_all([oi3, oi4])
    db.flush()
    print("  Orders seeded.")

    # ── Community ────────────────────────────────────────────────────────
    community = Community(
        uid="COMM-0001", name="Edu-Mentee Study Hub",
        description="A community for students and teachers to collaborate",
        member_count=3, is_active=True,
    )
    db.add(community)
    db.flush()

    ch1 = Channel(uid="CHAN-0001", community_id=community.id,
                  name="general", description="General discussion", type=ChannelType.text)
    ch2 = Channel(uid="CHAN-0002", community_id=community.id,
                  name="math-help", description="Ask math questions here", type=ChannelType.qa)
    db.add_all([ch1, ch2])
    db.flush()

    posts_data = [
        (ch1.id, student1.id, "Welcome to Edu-Mentee!", "Excited to join this learning platform. Let's study together!", PostType.text, True),
        (ch1.id, student2.id, "Tips for Board Exam Preparation", "Here are some tips I follow: 1) Start early 2) Make a timetable 3) Revise daily 4) Practice previous year papers", PostType.text, False),
        (ch2.id, student1.id, "Help with Quadratic Formula", "Can someone explain when to use the discriminant method vs factorization?", PostType.text, False),
        (ch1.id, teacher.id, "Weekly Study Schedule", "I've prepared a study schedule for Class 10 students. Check it out and share feedback.", PostType.text, True),
        (ch2.id, student2.id, "Interesting Math Problem", "What is the sum of all two-digit numbers divisible by 3? Solve using AP.", PostType.text, False),
    ]
    post_objs = []
    for ci, ui, title, content, ptype, pinned in posts_data:
        post = Post(
            uid=make_id("POST"), channel_id=ci, user_id=ui,
            title=title, content=content, type=ptype, is_pinned=pinned,
        )
        db.add(post)
        post_objs.append(post)

    db.flush()

    comments_data = [
        (post_objs[0].id, student2.id, "Welcome Aarav! Great to have you here."),
        (post_objs[0].id, teacher.id, "Glad to see students engaging. Keep learning!"),
        (post_objs[2].id, student2.id, "Use discriminant when factorization is not easy. b\u00b2 - 4ac > 0 means two real roots."),
        (post_objs[2].id, teacher.id, "Good question! Factorization works when roots are rational. Otherwise, use the quadratic formula."),
        (post_objs[4].id, student1.id, "The answer is 1665! Using AP: first term 12, last term 99, n = 30."),
    ]
    for pi, ui, content in comments_data:
        comment = Comment(uid=make_id("CMNT"), post_id=pi, user_id=ui, content=content)
        db.add(comment)

    db.flush()
    print("  Community seeded.")

    # ── Notifications ────────────────────────────────────────────────────
    notifications_data = [
        (student1.id, "Welcome to Edu-Mentee!", "Your account has been created successfully.", "system", now - timedelta(days=10)),
        (student1.id, "New Assignment Posted", "Dr. Rajesh Kumar posted a new Mathematics assignment.", "assignment", now - timedelta(days=5)),
        (student1.id, "Quiz Reminder", "Polynomials Quiz is due tomorrow. Good luck!", "quiz_reminder", now - timedelta(hours=12)),
        (student1.id, "Order Shipped", "Your order ORD-0001 has been delivered.", "order", now - timedelta(days=2)),
        (student2.id, "Welcome to Edu-Mentee!", "Your account has been created successfully.", "system", now - timedelta(days=10)),
        (student2.id, "New Video Available", "Python for Beginners video has been uploaded.", "content", now - timedelta(days=7)),
        (student2.id, "Exam Registration Open", "Register for Mid-Term Mathematics Examination.", "exam", now - timedelta(days=3)),
        (student2.id, "Badge Earned", "Congratulations! You earned the 'Quick Learner' badge.", "achievement", now - timedelta(days=1)),
        (teacher.id, "New Student Enrolled", "Aarav Sharma has enrolled in Class 10.", "enrollment", now - timedelta(days=8)),
        (teacher.id, "Assignment Submissions", "3 students have submitted the Quadratic Equations assignment.", "submission", now - timedelta(hours=6)),
    ]
    for ui, title, body, ntype, created in notifications_data:
        notif = Notification(
            uid=make_id("NOTIF"), user_id=ui, title=title,
            body=body, type=ntype, is_read=False, created_at=created,
        )
        db.add(notif)

    db.flush()
    print("  Notifications seeded.")

    # ── Calendar Events ──────────────────────────────────────────────────
    events_data = [
        (student1.id, "Mathematics Class", "Quadratic Equations lecture by Dr. Kumar",
         EventType.class_, now + timedelta(days=1), time(9, 0), time(10, 30), "#3B82F6"),
        (student1.id, "Science Unit Test", "Light - Reflection and Refraction test",
         EventType.exam, now + timedelta(days=15), time(10, 0), time(11, 0), "#EF4444"),
        (student2.id, "Board Exam Preparation", "Self-study session for Physics",
         EventType.personal, now + timedelta(days=2), time(14, 0), time(17, 0), "#10B981"),
        (student1.id, "Assignment Due Date", "Quadratic Equations worksheet submission",
         EventType.assignment, now + timedelta(days=7), time(23, 59), None, "#F59E0B"),
        (teacher.id, "Parent-Teacher Meeting", "Monthly PTM for Class 10 Section A",
         EventType.meeting, now + timedelta(days=20), time(15, 0), time(17, 0), "#8B5CF6"),
    ]
    for ui, title, desc, etype, edate, stime, etime, color in events_data:
        event = CalendarEvent(
            uid=make_id("EVT"), user_id=ui, title=title, description=desc,
            event_type=etype, event_date=edate, start_time=stime, end_time=etime,
            color=color, is_all_day=False, is_recurring=False,
        )
        db.add(event)

    db.flush()
    print("  Calendar events seeded.")

    # ── Virtual Lab ──────────────────────────────────────────────────────
    vlab = VirtualLab(
        uid="LAB-0001", subject_id=subject_objs["SCI-01"].id,
        title="Science Virtual Lab",
        description="Interactive virtual experiments for Class 10 Science",
        icon="flask-icon", is_active=True,
    )
    db.add(vlab)
    db.flush()

    experiments_data = [
        ("Reflection by Plane Mirror", "Verify the laws of reflection using a plane mirror simulation",
         "1. Place the plane mirror on the board\n2. Shine a laser along the normal\n3. Measure angle of incidence and reflection\n4. Repeat for different angles",
         "easy", 20),
        ("Ohm's Law Verification", "Verify V = IR relationship using virtual circuit",
         "1. Set up the virtual circuit with resistor\n2. Vary the voltage\n3. Record current readings\n4. Plot V vs I graph",
         "medium", 30),
        ("pH Measurement", "Measure pH of various solutions using virtual pH meter",
         "1. Select a solution from the dropdown\n2. Dip the pH probe into the solution\n3. Record the pH value\n4. Classify as acidic, basic or neutral",
         "easy", 15),
    ]
    for ei, (title, desc, instr, diff, dur) in enumerate(experiments_data, 1):
        exp = Experiment(
            uid=f"EXPT-{ei:04d}", lab_id=vlab.id,
            title=title, description=desc, instructions=instr,
            simulation_url=f"/simulations/exp_{ei}.html",
            difficulty=diff, duration_minutes=dur, is_active=True,
        )
        db.add(exp)

    db.flush()
    print("  Virtual lab seeded.")

    # ── Scholarships ─────────────────────────────────────────────────────
    sch1 = Scholarship(
        uid="SCHL-0001",
        title="CBSE Merit Scholarship 2024",
        description="Scholarship for students scoring above 90% in Class 10 board exams. Covers tuition fees and provides monthly stipend.",
        organization="Central Board of Secondary Education",
        amount=50000.0,
        eligibility="Class 10 students with 90%+ marks in board examination. Must be enrolled in a recognized school.",
        deadline=now + timedelta(days=90),
        application_url="https://cbse.gov.in/scholarships",
        is_active=True,
    )
    sch2 = Scholarship(
        uid="SCHL-0002",
        title="National Means-cum-Merit Scholarship (NMMSS)",
        description="Government scholarship for economically weaker students to prevent drop-out at Class 8 and encourage merit.",
        organization="Ministry of Education, Government of India",
        amount=12000.0,
        eligibility="Students from families with annual income below \u20b93,50,000. Must pass Class 8 exam with 55%+ marks.",
        deadline=now + timedelta(days=120),
        application_url="https://scholarships.gov.in",
        is_active=True,
    )
    db.add_all([sch1, sch2])
    db.flush()
    print("  Scholarships seeded.")

    # ── Gamification ─────────────────────────────────────────────────────
    achievements_data = [
        ("First Steps", "Complete your first lesson", "star-icon", 50, 10, "learning"),
        ("Quiz Master", "Score 100% on any quiz", "trophy-icon", 100, 25, "quiz"),
        ("Bookworm", "Download 10 resources", "book-icon", 75, 15, "resource"),
        ("Community Star", "Post 5 messages in community", "community-icon", 50, 10, "social"),
        ("Streak Champion", "7-day login streak", "fire-icon", 200, 50, "engagement"),
    ]
    achievement_objs = []
    for ai, (name, desc, icon, xp_r, coin_r, cat) in enumerate(achievements_data, 1):
        ach = Achievement(
            uid=f"ACHV-{ai:04d}", name=name, description=desc, icon=icon,
            xp_reward=xp_r, coin_reward=coin_r, category=cat,
        )
        db.add(ach)
        achievement_objs.append(ach)

    badges_data = [
        ("Bronze Learner", "Complete 5 lessons", "bronze", 25),
        ("Silver Scholar", "Complete 20 lessons", "silver", 100),
        ("Gold Achiever", "Score 90%+ on 5 quizzes", "gold", 200),
        ("Quick Learner", "Complete a lesson in under 10 minutes", "bronze", 50),
        ("Top Contributor", "Most active community member", "platinum", 300),
    ]
    badge_objs = []
    for bi, (name, desc, tier, xp_r) in enumerate(badges_data, 1):
        badge = Badge(
            uid=f"BDG-{bi:04d}", name=name, description=desc,
            icon=f"{tier}-badge-icon", tier=tier, xp_reward=xp_r,
        )
        db.add(badge)
        badge_objs.append(badge)

    db.flush()

    user_badges_data = [
        (student1.id, badge_objs[0].id, achievement_objs[0].id),
        (student1.id, badge_objs[3].id, None),
        (student2.id, badge_objs[0].id, achievement_objs[0].id),
        (student2.id, badge_objs[1].id, None),
        (student2.id, badge_objs[2].id, achievement_objs[1].id),
        (student2.id, badge_objs[4].id, None),
    ]
    for ui, bi, ai in user_badges_data:
        ub = UserBadge(user_id=ui, badge_id=bi, achievement_id=ai)
        db.add(ub)

    rewards_data = [
        (student1.id, "quiz_bonus", 25, "Bonus coins for completing Polynomials Quiz", "quiz", None),
        (student1.id, "daily_login", 5, "Daily login reward", None, None),
        (student2.id, "quiz_bonus", 25, "Bonus coins for completing Science Quiz", "quiz", None),
        (student2.id, "achievement_unlock", 50, "Coins earned for Quick Learner badge", "badge", None),
        (student2.id, "referral", 100, "Referral bonus for inviting a friend", None, None),
    ]
    for ui, rtype, amt, desc, reft, refi in rewards_data:
        reward = Reward(
            uid=make_id("RWRD"), user_id=ui, type=rtype,
            amount=amt, description=desc,
            reference_type=reft, reference_id=refi,
        )
        db.add(reward)

    leaderboards_data = [
        (student2.id, "overall", 3200, 1, "monthly"),
        (student1.id, "overall", 1500, 2, "monthly"),
        (student2.id, "quiz_score", 450, 1, "weekly"),
        (student1.id, "quiz_score", 320, 2, "weekly"),
        (student1.id, "community", 120, 1, "weekly"),
    ]
    for ui, cat, score, rank, period in leaderboards_data:
        lb = Leaderboard(
            uid=make_id("LBRD"), user_id=ui, category=cat,
            score=score, rank=rank, period=period,
        )
        db.add(lb)

    db.flush()
    print("  Gamification seeded.")

    # ── Resource Downloads ───────────────────────────────────────────────
    resources_in_db = db.query(Resource).limit(5).all()
    for ri, res in enumerate(resources_in_db[:3]):
        dl = ResourceDownload(
            uid=make_id("DL"), user_id=student1.id, resource_id=res.id,
        )
        db.add(dl)
    for ri, res in enumerate(resources_in_db[3:5]):
        dl = ResourceDownload(
            uid=make_id("DL"), user_id=student2.id, resource_id=res.id,
        )
        db.add(dl)

    db.flush()
    print("  Downloads seeded.")

    # ── Commit ───────────────────────────────────────────────────────────
    db.commit()
    print("\nDatabase seeded successfully!")
    print("  - 4 Users (1 admin, 2 students, 1 teacher)")
    print("  - 6 Subjects with lessons and topics")
    print("  - 20 Resources, 15 Videos")
    print("  - 3 Quizzes (15 questions total)")
    print("  - 2 Exams with registrations")
    print("  - 3 Categories, 10 Products")
    print("  - 2 Orders with items")
    print("  - 1 Community, 2 Channels, 5 Posts, 5 Comments")
    print("  - 10 Notifications")
    print("  - 5 Calendar Events")
    print("  - 1 Virtual Lab, 3 Experiments")
    print("  - 2 Scholarships")
    print("  - 5 Achievements, 5 Badges, 6 User Badges")
    print("  - 5 Rewards, 5 Leaderboard entries")
    print("  - 5 Resource Downloads")

    db.close()


if __name__ == "__main__":
    Base.metadata.create_all(bind=engine)
    seed()
