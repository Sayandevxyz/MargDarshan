from abc import ABC, abstractmethod
from typing import Dict, Any

class SourceAdapter(ABC):
    def __init__(self, name: str, source_label: str = "Prototype Mock"):
        self.name = name
        self.source_label = source_label  # E.g., 'Prototype Mock', 'Synthetic Dataset'
        self.simulation_mode = "NORMAL"   # NORMAL, MISMATCH, UNAVAILABLE, NOT_FOUND

    def set_simulation_mode(self, mode: str):
        self.simulation_mode = mode.upper()

    @abstractmethod
    async def verify(self, field: str, value: Dict[str, Any]) -> Dict[str, Any]:
        """
        Returns verification result dictionary:
        {
            "status": "MATCH" | "MISMATCH" | "NOT_FOUND" | "UNAVAILABLE",
            "confidence": float (0.0 to 1.0),
            "source": self.name,
            "evidence": dict,
            "label": self.source_label,
            "message": str
        }
        """
        pass
