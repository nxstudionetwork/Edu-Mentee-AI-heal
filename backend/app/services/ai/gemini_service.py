import os
import random
from datetime import datetime, timedelta
from typing import Optional, List, Dict, Any

from app.services.ai.base import AIProvider


class GeminiService(AIProvider):
    def __init__(self, api_key: str = None, model: str = "gemini-pro"):
        self.api_key = api_key or os.getenv("GEMINI_API_KEY", "")
        self.model = model
        self.base_url = "https://generativelanguage.googleapis.com/v1beta"

    def generate_response(self, prompt: str, context: dict = None) -> str:
        # In production, this would call:
        # import google.generativeai as genai
        # genai.configure(api_key=self.api_key)
        # model = genai.GenerativeModel(self.model)
        # if context and "history" in context:
        #     chat = model.start_chat(history=context["history"])
        #     response = chat.send_message(prompt)
        # else:
        #     response = model.generate_content(prompt)
        # return response.text

        return self._mock_generate(prompt, context)

    def generate_embeddings(self, text: str) -> list:
        # In production:
        # import google.generativeai as genai
        # genai.configure(api_key=self.api_key)
        # result = genai.embed_content(
        #     model="models/embedding-001",
        #     content=text
        # )
        # return result["embedding"]

        random.seed(hash(text) % (2**31))
        return [round(random.uniform(-1.0, 1.0), 6) for _ in range(768)]

    def analyze_weak_areas(self, quiz_results: list) -> dict:
        if not quiz_results:
            return {
                "weak_areas": [],
                "strengths": [],
                "overall_score": 0,
                "recommendation": "No quiz data available. Take a quiz to get started!",
            }
        topic_scores: Dict[str, List[float]] = {}
        for result in quiz_results:
            topic = result.get("topic", "Unknown")
            score = result.get("score", 0)
            max_score = result.get("max_score", 100)
            normalized = (score / max_score * 100) if max_score > 0 else 0
            topic_scores.setdefault(topic, []).append(normalized)
        topic_averages: Dict[str, float] = {}
        for topic, scores in topic_scores.items():
            topic_averages[topic] = sum(scores) / len(scores)
        all_scores = list(topic_averages.values())
        overall_score = sum(all_scores) / len(all_scores) if all_scores else 0
        weak = []
        strong = []
        for topic, avg in topic_averages.items():
            entry = {
                "topic": topic,
                "average_score": round(avg, 1),
                "attempts": len(topic_scores[topic]),
            }
            if avg < 60:
                entry["severity"] = "critical"
                entry["suggestion"] = f"Focus on fundamentals of {topic}. Review notes and rewatch lectures."
                weak.append(entry)
            elif avg < 75:
                entry["severity"] = "moderate"
                entry["suggestion"] = f"Practice more problems in {topic} to build confidence."
                weak.append(entry)
            else:
                entry["mastery_level"] = "proficient" if avg >= 90 else "developing"
                strong.append(entry)
        weak.sort(key=lambda x: x["average_score"])
        strong.sort(key=lambda x: x["average_score"], reverse=True)
        recommendation = ""
        if overall_score < 40:
            recommendation = (
                "Your overall performance suggests you need to revisit fundamental concepts. "
                "Consider scheduling extra study sessions and seeking help from a tutor."
            )
        elif overall_score < 60:
            recommendation = (
                "You're making progress but have some gaps. Focus on your weakest topics first, "
                "then build from your strengths."
            )
        elif overall_score < 80:
            recommendation = (
                "Good foundation! Targeted practice on weak areas can help you reach excellence. "
                "Try challenging yourself with harder problems."
            )
        else:
            recommendation = (
                "Excellent work! You have a strong grasp of the material. "
                "Consider exploring advanced topics to stay challenged."
            )
        return {
            "weak_areas": weak,
            "strengths": strong,
            "overall_score": round(overall_score, 1),
            "total_topics": len(topic_averages),
            "recommendation": recommendation,
        }

    def generate_revision_plan(self, weak_areas: list, exam_date: str) -> dict:
        try:
            exam = datetime.strptime(exam_date, "%Y-%m-%d")
        except (ValueError, TypeError):
            exam = datetime.now() + timedelta(days=30)
        today = datetime.now()
        days_left = max(1, (exam - today).days)
        if not weak_areas:
            return {
                "error": "No weak areas identified. Take a quiz to generate a revision plan.",
                "days_until_exam": days_left,
            }
        areas = sorted(weak_areas, key=lambda x: x.get("score", 0))
        daily_plan = []
        topics_per_day = max(1, len(areas) // max(1, days_left - 2))
        revision_days = max(1, days_left - 2)
        day_counter = 0
        for i, area in enumerate(areas):
            topic = area.get("topic", f"Topic {i+1}")
            score = area.get("score", 50)
            if score < 40:
                hours = 3
                priority = "high"
            elif score < 60:
                hours = 2
                priority = "high"
            else:
                hours = 1
                priority = "medium"
            if day_counter < revision_days:
                plan_day = today + timedelta(days=day_counter)
                daily_plan.append({
                    "date": plan_day.strftime("%Y-%m-%d"),
                    "topic": topic,
                    "priority": priority,
                    "hours": hours,
                    "activities": [
                        {"type": "review", "duration_minutes": 30, "description": f"Review notes on {topic}"},
                        {"type": "practice", "duration_minutes": 45, "description": f"Solve practice problems on {topic}"},
                        {"type": "self_test", "duration_minutes": 15, "description": f"Quick self-test on {topic}"},
                    ],
                })
                day_counter += 1
        review_day = today + timedelta(days=max(0, days_left - 2))
        revision_day = today + timedelta(days=max(0, days_left - 1))
        daily_plan.append({
            "date": review_day.strftime("%Y-%m-%d"),
            "topic": "Full Revision",
            "priority": "high",
            "hours": 4,
            "activities": [
                {"type": "revision", "duration_minutes": 120, "description": "Revise all weak areas"},
                {"type": "practice", "duration_minutes": 90, "description": "Solve mixed practice set"},
                {"type": "flashcards", "duration_minutes": 30, "description": "Review key formulas and definitions"},
            ],
        })
        daily_plan.append({
            "date": revision_day.strftime("%Y-%m-%d"),
            "topic": "Exam Preparation",
            "priority": "high",
            "hours": 2,
            "activities": [
                {"type": "light_review", "duration_minutes": 60, "description": "Light review of key concepts"},
                {"type": "rest", "duration_minutes": 60, "description": "Relax and get proper rest before exam"},
            ],
        })
        return {
            "exam_date": exam_date,
            "days_until_exam": days_left,
            "total_topics": len(areas),
            "daily_plan": daily_plan,
            "study_tips": [
                "Use the Pomodoro technique: 25 minutes study, 5 minutes break",
                "Practice active recall: test yourself without looking at notes",
                "Teach concepts to someone else to solidify understanding",
                "Get at least 7-8 hours of sleep during exam preparation",
                "Stay hydrated and eat brain-boosting foods",
            ],
        }

    def get_provider_name(self) -> str:
        return "gemini"

    def _mock_generate(self, prompt: str, context: dict = None) -> str:
        lower = prompt.lower()
        if "analyze" in lower or "weak" in lower or "performance" in lower:
            return (
                "Based on my analysis of the available data, I can identify patterns "
                "in learning performance. I recommend focusing on foundational concepts "
                "before moving to advanced topics. Would you like me to generate a "
                "detailed performance report?"
            )
        if "revision" in lower or "study plan" in lower or "schedule" in lower:
            return (
                "I'll create a personalized revision plan based on your exam timeline "
                "and weak areas. A balanced approach covering all topics with extra time "
                "for challenging areas works best. Shall I generate the plan?"
            )
        return (
            "I'm Gemini-powered EduMentee AI, ready to assist with your learning journey. "
            "I can analyze your performance, create personalized study plans, and explain "
            "complex concepts in simple terms. What would you like help with?"
        )
