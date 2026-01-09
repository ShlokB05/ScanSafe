FROM python:3.12-slim

WORKDIR /app

COPY api/requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .


RUN python manage.py collectstatic --noinput

RUN python manage.py migrate


CMD gunicorn ScanSafe.wsgi:application --bind 0.0.0.0:$PORT --timeout 300 --workers 4