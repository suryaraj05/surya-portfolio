import json
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(ROOT))

from app.main import app


def export_openapi(path: str = "../contracts/openapi.json") -> None:
    schema = app.openapi()
    with open(path, "w", encoding="utf-8") as file:
        json.dump(schema, file, indent=2)
    print(f"OpenAPI exported to {path}")


if __name__ == "__main__":
    export_openapi()
