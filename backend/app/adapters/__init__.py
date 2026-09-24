from backend.app.adapters.base import SourceAdapter
from backend.app.adapters.adapters import (
    MockDigiLockerAdapter,
    MockUIDAIAdapter,
    MockUDISEAdapter,
    MockAISHEAdapter,
    MockAPAARAdapter,
    MockEDistrictAdapter,
    MockUGCNTAAdapter,
    MockNSPAdapter,
    MockSFMPAdapter,
    MockNOSAdapter,
)

# Registry of singleton mock adapters
ADAPTER_REGISTRY = {
    "DigiLocker": MockDigiLockerAdapter(),
    "UIDAI": MockUIDAIAdapter(),
    "UDISE+": MockUDISEAdapter(),
    "AISHE": MockAISHEAdapter(),
    "APAAR": MockAPAARAdapter(),
    "e-District": MockEDistrictAdapter(),
    "UGC/NTA": MockUGCNTAAdapter(),
    "NSP": MockNSPAdapter(),
    "SFMP": MockSFMPAdapter(),
    "NOS Portal": MockNOSAdapter(),
}

def set_global_adapter_mode(source_name: str, mode: str):
    if source_name in ADAPTER_REGISTRY:
        ADAPTER_REGISTRY[source_name].set_simulation_mode(mode)
    elif source_name == "ALL":
        for adapter in ADAPTER_REGISTRY.values():
            adapter.set_simulation_mode(mode)
