from typing import List, Optional

from app.services.ai.base import AIProvider
from app.services.ai.openai_service import OpenAIService
from app.services.ai.gemini_service import GeminiService
from app.services.ai.copilot_service import CopilotService
from app.services.ai.mock_provider import MockAIService


class AIProviderFactory:
    _instances: dict = {}

    @classmethod
    def get_provider(cls, provider_name: str = "mock") -> AIProvider:
        if provider_name in cls._instances:
            return cls._instances[provider_name]

        if provider_name == "openai":
            provider = OpenAIService()
        elif provider_name == "gemini":
            provider = GeminiService()
        elif provider_name == "copilot":
            provider = CopilotService()
        else:
            provider = MockAIService()

        cls._instances[provider_name] = provider
        return provider

    @classmethod
    def get_available_providers(cls) -> List[str]:
        return ["mock", "openai", "gemini", "copilot"]

    @classmethod
    def clear_instances(cls) -> None:
        cls._instances.clear()

    @classmethod
    def register_provider(cls, name: str, provider: AIProvider) -> None:
        cls._instances[name] = provider

    @classmethod
    def get_provider_info(cls) -> dict:
        providers = {}
        for name in cls.get_available_providers():
            try:
                provider = cls.get_provider(name)
                providers[name] = {
                    "name": provider.get_provider_name(),
                    "class": provider.__class__.__name__,
                    "instantiated": name in cls._instances,
                }
            except Exception:
                providers[name] = {
                    "name": name,
                    "class": "Unknown",
                    "instantiated": False,
                }
        return providers
