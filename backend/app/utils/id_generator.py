import random
import string
import time


def generate_id(prefix: str = "ID") -> str:
    timestamp = int(time.time() * 1000) % 1000000
    random_suffix = "".join(random.choices(string.ascii_uppercase + string.digits, k=4))
    return f"{prefix}{timestamp}{random_suffix}"
