#!/bin/sh
set -e

python manage.py migrate --noinput
python manage.py collectstatic --noinput

exec gunicorn ScanSafe.wsgi:application \
  --bind 0.0.0.0:${PORT:-8080} \
  --timeout 300 \
  --workers 2
