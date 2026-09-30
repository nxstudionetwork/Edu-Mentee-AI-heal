import random
from typing import Optional, List, Dict

from app.services.ai.base import AIProvider


class MockAIService(AIProvider):
    def __init__(self):
        self.name = "EduMentee AI"
        self._learning_paths: Dict[str, List[Dict]] = {
            "Mathematics": [
                {
                    "order": 1,
                    "title": "Number Systems",
                    "description": "Understanding integers, fractions, and decimals",
                    "topics": ["Natural Numbers", "Integers", "Rational Numbers", "Irrational Numbers"],
                },
                {
                    "order": 2,
                    "title": "Algebra Fundamentals",
                    "description": "Variables, expressions, and basic equations",
                    "topics": ["Variables & Expressions", "Linear Equations", "Quadratic Equations"],
                },
                {
                    "order": 3,
                    "title": "Geometry Basics",
                    "description": "Shapes, angles, and spatial reasoning",
                    "topics": ["Lines & Angles", "Triangles", "Circles", "Mensuration"],
                },
                {
                    "order": 4,
                    "title": "Statistics & Probability",
                    "description": "Data handling and chance",
                    "topics": ["Mean, Median, Mode", "Probability", "Data Representation"],
                },
            ],
            "Science": [
                {
                    "order": 1,
                    "title": "Matter & Its Properties",
                    "description": "States of matter, atoms, and molecules",
                    "topics": ["States of Matter", "Atomic Structure", "Chemical Bonding"],
                },
                {
                    "order": 2,
                    "title": "Forces & Motion",
                    "description": "Newton's laws, energy, and work",
                    "topics": ["Newton's Laws", "Energy & Work", "Simple Machines"],
                },
                {
                    "order": 3,
                    "title": "Living World",
                    "description": "Biology fundamentals and ecosystems",
                    "topics": ["Cell Biology", "Human Body Systems", "Ecosystems"],
                },
                {
                    "order": 4,
                    "title": "Earth Science",
                    "description": "Planet earth, weather, and space",
                    "topics": ["Solar System", "Weather Patterns", "Natural Resources"],
                },
            ],
            "English": [
                {
                    "order": 1,
                    "title": "Grammar Essentials",
                    "description": "Parts of speech, sentence structure, and punctuation",
                    "topics": ["Parts of Speech", "Tenses", "Active & Passive Voice"],
                },
                {
                    "order": 2,
                    "title": "Reading Comprehension",
                    "description": "Strategies for understanding texts",
                    "topics": ["Main Idea & Details", "Inference", "Author's Purpose"],
                },
                {
                    "order": 3,
                    "title": "Creative Writing",
                    "description": "Essay writing, storytelling, and expression",
                    "topics": ["Paragraph Writing", "Essay Structure", "Narrative Writing"],
                },
            ],
            "History": [
                {
                    "order": 1,
                    "title": "Ancient Civilizations",
                    "description": "Early human societies and empires",
                    "topics": ["Indus Valley", "Mesopotamia", "Ancient Egypt"],
                },
                {
                    "order": 2,
                    "title": "Medieval Period",
                    "description": "Feudalism, culture, and major events",
                    "topics": ["Feudal System", "The Renaissance", "Trade Routes"],
                },
                {
                    "order": 3,
                    "title": "Modern History",
                    "description": "Revolutions, world wars, and independence movements",
                    "topics": ["Industrial Revolution", "World Wars", "Independence Movements"],
                },
            ],
            "Computer Science": [
                {
                    "order": 1,
                    "title": "Introduction to Programming",
                    "description": "Basic programming concepts and logic",
                    "topics": ["Variables & Data Types", "Control Flow", "Functions"],
                },
                {
                    "order": 2,
                    "title": "Data Structures",
                    "description": "Fundamental data organization methods",
                    "topics": ["Arrays", "Linked Lists", "Stacks & Queues", "Trees"],
                },
                {
                    "order": 3,
                    "title": "Algorithms",
                    "description": "Problem-solving approaches and complexity",
                    "topics": ["Sorting Algorithms", "Searching", "Recursion", "Complexity Analysis"],
                },
            ],
        }

    def generate_response(self, prompt: str, context: dict = None) -> str:
        return self._get_mock_response(prompt)

    def generate_embeddings(self, text: str) -> list:
        random.seed(hash(text) % (2**31))
        embeddings = [round(random.uniform(-1.0, 1.0), 6) for _ in range(128)]
        return embeddings

    def get_provider_name(self) -> str:
        return "mock"

    def get_study_recommendations(self, weak_areas: list, strengths: list) -> list:
        recommendations = []
        for area in weak_areas:
            recommendations.append({
                "type": "video",
                "title": f"Concept Clarification: {area}",
                "description": f"Watch this tutorial to strengthen your understanding of {area}",
                "priority": "high",
                "estimated_time_minutes": 15,
            })
            recommendations.append({
                "type": "practice",
                "title": f"Practice Exercises: {area}",
                "description": f"Solve targeted problems to master {area}",
                "priority": "high",
                "estimated_time_minutes": 20,
            })
        for area in weak_areas[:3]:
            recommendations.append({
                "type": "quiz",
                "title": f"Quick Quiz: {area}",
                "description": f"Test your understanding of {area} with a short quiz",
                "priority": "medium",
                "estimated_time_minutes": 10,
            })
        for area in strengths:
            recommendations.append({
                "type": "challenge",
                "title": f"Advanced Challenge: {area}",
                "description": f"Push your limits with advanced problems in {area}",
                "priority": "low",
                "estimated_time_minutes": 25,
            })
        return recommendations

    def get_learning_path(self, subject: str, grade: int) -> list:
        path = self._learning_paths.get(subject)
        if path is None:
            return [
                {
                    "order": 1,
                    "title": f"Introduction to {subject}",
                    "description": f"Build a solid foundation in {subject}",
                    "topics": ["Fundamentals", "Core Concepts", "Practice"],
                }
            ]
        grade_adjusted = []
        for item in path:
            adjusted = dict(item)
            if grade <= 6:
                adjusted["difficulty"] = "beginner"
            elif grade <= 9:
                adjusted["difficulty"] = "intermediate"
            else:
                adjusted["difficulty"] = "advanced"
            adjusted["estimated_hours"] = max(2, len(item.get("topics", [])) * 2)
            grade_adjusted.append(adjusted)
        return grade_adjusted

    def _get_mock_response(self, prompt: str) -> str:
        lower = prompt.lower()
        if any(word in lower for word in ["hello", "hi", "hey"]):
            return (
                "Hello! I'm your AI study assistant. I can help you understand "
                "concepts, create study plans, and prepare for exams. What subject "
                "are you working on today?"
            )
        if "math" in lower or "equation" in lower or "algebra" in lower:
            return (
                "Mathematics builds logically — each concept builds on the previous one. "
                "For algebra, remember that an equation is like a balance scale: whatever "
                "you do to one side, you must do to the other. Would you like me to walk "
                "you through a specific problem?"
            )
        if "science" in lower or "physics" in lower or "chemistry" in lower:
            return (
                "Science is all about understanding the world through observation and "
                "experimentation. A great way to learn is to connect concepts to real-life "
                "examples. For instance, Newton's Third Law explains why you push backward "
                "when you throw a ball forward. Shall I explain a specific topic?"
            )
        if "english" in lower or "grammar" in lower or "writing" in lower:
            return (
                "Strong communication skills are valuable in every field. To improve "
                "your writing, focus on clarity, structure, and vocabulary. Start with "
                "a clear thesis, support it with evidence, and conclude with a strong "
                "summary. Would you like me to review a piece of writing?"
            )
        if "history" in lower or "civilization" in lower:
            return (
                "History helps us understand how societies evolve and learn from the past. "
                "Try to connect events to their causes and consequences. For example, the "
                "Industrial Revolution transformed economies from agrarian to manufacturing-based. "
                "Which historical period interests you?"
            )
        if "programming" in lower or "code" in lower or "computer" in lower:
            return (
                "Programming is best learned by doing. Start with understanding variables, "
                "loops, and conditionals — they form the building blocks of every program. "
                "Would you like a beginner-friendly exercise in Python or another language?"
            )
        if "exam" in lower or "test" in lower or "prepare" in lower:
            return (
                "Here's a proven exam preparation strategy:\n"
                "1. Review your syllabus and identify high-weight topics\n"
                "2. Practice past papers under timed conditions\n"
                "3. Focus on weak areas but don't neglect strengths\n"
                "4. Use spaced repetition for revision\n"
                "5. Get adequate sleep before the exam\n"
                "Would you like me to create a customized study schedule?"
            )
        if "thank" in lower:
            return "You're welcome! Feel free to ask if you need more help with your studies."
        responses = [
            (
                "That's a great question! Let me explain this concept step by step. "
                "The key idea is to break down complex topics into smaller, manageable "
                "parts. Could you tell me which specific aspect you'd like to explore?"
            ),
            (
                "Here's a simplified way to understand this topic: think of it as "
                "building blocks. Each concept connects to the next, and once you "
                "grasp the fundamentals, the advanced topics become much clearer. "
                "What level are you currently at?"
            ),
            (
                "Think of it this way: the core concept here involves understanding "
                "relationships between different elements. Practice problems are the "
                "best way to solidify your understanding. Shall I suggest some exercises?"
            ),
            (
                "This is an important topic in your curriculum. Here's what you need "
                "to know: focus on the underlying principles rather than memorizing "
                "facts. Once you understand the 'why', the 'how' becomes intuitive. "
                "Want me to create a mini study plan for this topic?"
            ),
        ]
        return random.choice(responses)
