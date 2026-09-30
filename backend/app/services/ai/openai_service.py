import os
import random
from typing import Optional, List, Dict, Any

from app.services.ai.base import AIProvider, AIResponse


class OpenAIService(AIProvider):
    def __init__(self, api_key: str = None, model: str = "gpt-4"):
        self.api_key = api_key or os.getenv("OPENAI_API_KEY", "")
        self.model = model
        self.base_url = "https://api.openai.com/v1"

    def generate_response(self, prompt: str, context: dict = None) -> str:
        system_message = (
            "You are EduMentee AI, an intelligent educational assistant. "
            "Provide clear, accurate, and helpful explanations tailored to "
            "the student's level. Use examples and analogies when possible."
        )
        messages = [{"role": "system", "content": system_message}]
        if context:
            if "previous_conversations" in context:
                for conv in context["previous_conversations"][-5:]:
                    messages.append({"role": "user", "content": conv.get("user", "")})
                    messages.append({"role": "assistant", "content": conv.get("assistant", "")})
            if "subject" in context:
                system_message += f" Focus area: {context['subject']}."
        messages.append({"role": "user", "content": prompt})

        # In production, this would call:
        # import openai
        # client = openai.OpenAI(api_key=self.api_key, base_url=self.base_url)
        # response = client.chat.completions.create(
        #     model=self.model,
        #     messages=messages,
        #     temperature=0.7,
        #     max_tokens=1024,
        # )
        # return response.choices[0].message.content

        return self._mock_generate(prompt)

    def generate_embeddings(self, text: str) -> list:
        # In production:
        # import openai
        # client = openai.OpenAI(api_key=self.api_key, base_url=self.base_url)
        # response = client.embeddings.create(
        #     model="text-embedding-3-small",
        #     input=text
        # )
        # return response.data[0].embedding

        random.seed(hash(text) % (2**31))
        return [round(random.uniform(-1.0, 1.0), 6) for _ in range(1536)]

    def generate_study_plan(
        self, subject: str, topics: list, duration_days: int
    ) -> dict:
        if not topics:
            return {"error": "No topics provided for study plan"}
        days_per_topic = max(1, duration_days // len(topics))
        plan = {
            "subject": subject,
            "total_days": duration_days,
            "topics_count": len(topics),
            "daily_hours": 2,
            "schedule": [],
        }
        day_counter = 1
        for i, topic in enumerate(topics):
            start_day = day_counter
            end_day = min(day_counter + days_per_topic - 1, duration_days)
            days_allocated = end_day - start_day + 1
            plan["schedule"].append({
                "topic": topic,
                "start_day": start_day,
                "end_day": end_day,
                "days_allocated": days_allocated,
                "activities": [
                    {"type": "study", "description": f"Read and take notes on {topic}", "minutes": 60},
                    {"type": "practice", "description": f"Solve problems on {topic}", "minutes": 45},
                    {"type": "revision", "description": f"Revise key points of {topic}", "minutes": 30},
                ],
                "milestone": f"Complete practice test for {topic}",
            })
            day_counter = end_day + 1
            if day_counter > duration_days:
                break
        plan["revision_days"] = max(1, duration_days - day_counter + 1) if day_counter <= duration_days else 2
        plan["tips"] = [
            "Review previous day's topics before starting new ones",
            "Take short breaks every 45 minutes",
            "Practice active recall instead of passive reading",
            "Use flashcards for key formulas and definitions",
        ]
        return plan

    def explain_concept(self, topic: str, grade_level: str) -> str:
        level_descriptions = {
            "elementary": "simple terms with everyday examples",
            "middle": "moderate detail with some technical vocabulary",
            "high_school": "detailed explanations with proper terminology",
            "college": "in-depth analysis with advanced concepts",
        }
        explanation_style = level_descriptions.get(grade_level, "moderate detail")
        return (
            f"Topic: {topic}\n"
            f"Explanation Level: {explanation_style}\n\n"
            f"Great question! Let me explain {topic} in a way that's easy to understand.\n\n"
            f"The fundamental idea behind {topic} is that it forms a core building block "
            f"in your curriculum. Understanding this concept well will help you grasp more "
            f"advanced topics later.\n\n"
            f"Key Points:\n"
            f"1. {topic} is based on foundational principles that connect to real-world applications\n"
            f"2. Practice is essential — try solving at least 3-5 problems daily on this topic\n"
            f"3. Relate it to concepts you already know to build stronger understanding\n\n"
            f"Would you like me to go deeper into any specific aspect of {topic}?"
        )

    def generate_quiz_questions(
        self, topic: str, count: int, difficulty: str
    ) -> list:
        difficulty_templates = {
            "easy": {
                "prefix": "Basic",
                "options_count": 4,
                "time_seconds": 120,
            },
            "medium": {
                "prefix": "Intermediate",
                "options_count": 4,
                "time_seconds": 90,
            },
            "hard": {
                "prefix": "Advanced",
                "options_count": 4,
                "time_seconds": 60,
            },
        }
        template = difficulty_templates.get(difficulty, difficulty_templates["medium"])
        questions = []
        question_types = ["mcq", "true_false", "short_answer"]
        for i in range(count):
            q_type = random.choice(question_types)
            question = {
                "id": i + 1,
                "topic": topic,
                "difficulty": difficulty,
                "type": q_type,
                "points": {"easy": 1, "medium": 2, "hard": 3}.get(difficulty, 2),
                "time_seconds": template["time_seconds"],
            }
            if q_type == "mcq":
                question["question"] = (
                    f"[{template['prefix']}] Which of the following correctly "
                    f"describes a key aspect of {topic}?"
                )
                question["options"] = [
                    f"A) {topic} involves understanding core foundational principles",
                    f"B) {topic} is unrelated to other subjects in the curriculum",
                    f"C) {topic} can only be studied through memorization",
                    f"D) {topic} has no practical real-world applications",
                ]
                question["correct_answer"] = "A"
                question["explanation"] = (
                    f"{topic} is built on foundational principles that connect to "
                    f"many areas of study, making option A correct."
                )
            elif q_type == "true_false":
                question["question"] = (
                    f"[{template['prefix']}] True or False: A solid understanding "
                    f"of {topic} helps in learning more advanced concepts."
                )
                question["correct_answer"] = "True"
                question["explanation"] = (
                    f"True. {topic} forms a foundation upon which more complex "
                    f"topics are built."
                )
            else:
                question["question"] = (
                    f"[{template['prefix']}] Explain in 2-3 sentences why "
                    f"understanding {topic} is important in your studies."
                )
                question["correct_answer"] = (
                    f"An ideal answer should mention the foundational role of "
                    f"{topic}, its connections to other areas, and real-world applications."
                )
                question["explanation"] = (
                    f"There is no single correct answer, but a strong response "
                    f"will demonstrate conceptual understanding of {topic}."
                )
            questions.append(question)
        return questions

    def get_provider_name(self) -> str:
        return "openai"

    def _mock_generate(self, prompt: str) -> str:
        lower = prompt.lower()
        if "explain" in lower or "what is" in lower or "describe" in lower:
            return (
                f"Let me break this down for you:\n\n"
                f"This concept is fundamental to your subject. It involves understanding "
                f"the relationships between key components and how they interact. "
                f"Think of it as a building block — once you master this, more advanced "
                f"topics will become much easier to understand.\n\n"
                f"Here's a practical example to help you visualize it: imagine organizing "
                f"books in a library. The way we categorize and structure information directly "
                f"relates to this concept.\n\n"
                f"Would you like me to provide some practice problems to reinforce this?"
            )
        if "summarize" in lower or "summary" in lower:
            return (
                "Here's a concise summary:\n"
                "1. The topic covers foundational principles\n"
                "2. It connects to multiple areas in the curriculum\n"
                "3. Practice and application are key to mastery\n"
                "4. Real-world examples help solidify understanding"
            )
        return (
            "I understand your question. Let me provide a comprehensive answer.\n\n"
            "The key to understanding this topic is to focus on the underlying principles "
            "rather than rote memorization. When you understand the 'why' behind concepts, "
            "applying them becomes intuitive.\n\n"
            "I recommend the following approach:\n"
            "- Review the fundamental theory first\n"
            "- Work through guided examples\n"
            "- Attempt practice problems independently\n"
            "- Test yourself with quiz questions\n\n"
            "Shall I help you with any specific part of this topic?"
        )
