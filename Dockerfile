FROM python:3.12-slim     


WORKDIR /

RUN apt-get update && apt-get install -y --no-install-recommends \
    libglib2.0-0 libgl1 \
 && rm -rf /var/lib/apt/lists/*

COPY api/requirements.txt /app/requirements.txt
RUN pip install --no-cache-dir -r /app/requirements.txt

COPY . /

CMD ["sh", "-c", "gunicorn ScanSafe.ScanSafe.wsgi:application --bind 0.0.0.0:${PORT:-8080} --workers 1 --timeout 180"]
