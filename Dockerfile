# Use a standard Debian-based image (NOT Alpine)
FROM python:3.12-slim

# Install system dependencies required for Postgres
RUN apt-get update && apt-get install -y \
    libpq-dev \
    gcc \
    && rm -rf /var/lib/apt/lists/*

# Set work directory
WORKDIR /app

COPY app/requirements.txt .
RUN pip install --no-cache-dir -r app/requirements.txt

COPY . .

CMD ["gunicorn", "--bind", "0.0.0.0:8080", "ScanSafe.wsgi:application"]