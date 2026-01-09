import os
from dotenv import load_dotenv
import dj_database_url
from pathlib import Path

load_dotenv()
BASE_DIR = Path(__file__).resolve().parent.parent

ROOT_URLCONF = os.environ.get('ROOT_URLCONF')

def csv_env(name: str) -> list[str]:
    return [x.strip() for x in os.getenv(name, "").split(",") if x.strip()]

SECRET_KEY = os.getenv("SECRET_KEY", "")
DEBUG = os.getenv("DEBUG", "False").lower() == "true"

ALLOWED_HOSTS = csv_env("ALLOWED_HOSTS")
CORS_ALLOWED_ORIGINS = csv_env("CORS_ALLOWED_ORIGINS")
CSRF_TRUSTED_ORIGINS = csv_env("CSRF_TRUSTED_ORIGINS")

CORS_ALLOW_CREDENTIALS = True

# Cloud Run sits behind a proxy; Django must trust X-Forwarded-Proto
SECURE_PROXY_SSL_HEADER = ("HTTP_X_FORWARDED_PROTO", "https")

if not DEBUG:
    SESSION_COOKIE_SECURE = True
    CSRF_COOKIE_SECURE = True
    SESSION_COOKIE_SAMESITE = "None"
    CSRF_COOKIE_SAMESITE = "None"
    SECURE_SSL_REDIRECT = True
