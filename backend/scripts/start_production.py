import os
import subprocess
import sys


def run(command: list[str]) -> None:
    result = subprocess.run(command, check=False)
    if result.returncode != 0:
        raise SystemExit(result.returncode)


def main() -> None:
    run([sys.executable, "-m", "alembic", "upgrade", "head"])
    port = os.getenv("PORT", "8000")
    run([sys.executable, "-m", "uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", port])


if __name__ == "__main__":
    main()
