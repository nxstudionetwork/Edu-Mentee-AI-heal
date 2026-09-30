import re
from typing import Tuple


def validate_email(email: str) -> bool:
    pattern = r"^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$"
    return bool(re.match(pattern, email.strip()))


def validate_phone(phone: str) -> bool:
    cleaned = re.sub(r"\D", "", phone)
    return len(cleaned) == 10 and cleaned[0] in "6789"


def validate_password(password: str) -> Tuple[bool, str]:
    if len(password) < 8:
        return False, "Password must be at least 8 characters long"
    if not re.search(r"[A-Z]", password):
        return False, "Password must contain at least one uppercase letter"
    if not re.search(r"[a-z]", password):
        return False, "Password must contain at least one lowercase letter"
    if not re.search(r"\d", password):
        return False, "Password must contain at least one digit"
    if not re.search(r"[!@#$%^&*(),.?\":{}|<>_\-+=~`\[\];'\\\/]", password):
        return False, "Password must contain at least one special character"
    return True, ""


def sanitize_string(s: str) -> str:
    if not s:
        return s
    s = s.strip()
    s = re.sub(r"<[^>]*>", "", s)
    s = re.sub(r"\s+", " ", s)
    return s
