from abc import ABC, abstractmethod
from typing import Optional, List, Dict, Any


class AIProvider(ABC):

    @abstractmethod
    def generate_response(self, prompt: str, context: Optional[Dict] = None) -> str:
        pass

    @abstractmethod
    def generate_embeddings(self, text: str) -> List[float]:
        pass

    @abstractmethod
    def get_provider_name(self) -> str:
        pass


class AIResponse:
    def __init__(
        self,
        content: str,
        provider: str,
        tokens_used: int = 0,
        model: str = "",
    ):
        self.content = content
        self.provider = provider
        self.tokens_used = tokens_used
        self.model = model

    def to_dict(self) -> Dict[str, Any]:
        return {
            "content": self.content,
            "provider": self.provider,
            "tokens_used": self.tokens_used,
            "model": self.model,
        }

    def __repr__(self) -> str:
        return (
            f"AIResponse(provider={self.provider!r}, model={self.model!r}, "
            f"tokens_used={self.tokens_used})"
        )
