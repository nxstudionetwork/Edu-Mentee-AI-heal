import json
import logging
import sys
from datetime import datetime, timezone
from pathlib import Path

LOG_DIR = Path("logs")
LOG_DIR.mkdir(exist_ok=True)


class JSONFormatter(logging.Formatter):
    def format(self, record: logging.LogRecord) -> str:
        log_entry = {
            "timestamp": datetime.now(timezone.utc).isoformat(),
            "level": record.levelname,
            "logger": record.name,
            "message": record.getMessage(),
            "module": record.module,
            "function": record.funcName,
            "line": record.lineno,
        }
        if hasattr(record, "request_id"):
            log_entry["request_id"] = record.request_id
        if record.exc_info and record.exc_info[0]:
            log_entry["exception"] = self.formatException(record.exc_info)
        return json.dumps(log_entry)


def setup_logging(debug: bool = True) -> logging.Logger:
    root_logger = logging.getLogger("edumentee")
    root_logger.setLevel(logging.DEBUG if debug else logging.INFO)

    console_handler = logging.StreamHandler(sys.stdout)
    console_handler.setFormatter(JSONFormatter())
    root_logger.addHandler(console_handler)

    file_handler = logging.FileHandler(LOG_DIR / "app.log")
    file_handler.setFormatter(JSONFormatter())
    root_logger.addHandler(file_handler)

    return root_logger


logger = setup_logging()


def get_logger(name: str) -> logging.Logger:
    return logging.getLogger(f"edumentee.{name}")
