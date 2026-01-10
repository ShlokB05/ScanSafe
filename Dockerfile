# ---------- build frontend ----------
FROM node:20-alpine AS frontend
WORKDIR /frontend

# IMPORTANT: your package.json is in FrontEnd/
COPY FrontEnd/package*.json ./
RUN npm ci

COPY FrontEnd/ ./
RUN npm run build


# ---------- backend ----------
FROM python:3.12-slim AS backend
WORKDIR /app

ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1

COPY api/requirements.txt /app/requirements.txt
RUN pip install --no-cache-dir -r /app/requirements.txt

# copy backend source
COPY . /app

# copy built frontend into Django template + static source dirs
RUN mkdir -p /app/templates /app/static
COPY --from=frontend /frontend/dist/index.html /app/templates/index.html
COPY --from=frontend /frontend/dist/assets /app/static/assets

# (optional) if dist has other root files like vite.svg
# COPY --from=frontend /frontend/dist/vite.svg /app/static/vite.svg

# collect static (writes into STATIC_ROOT)
RUN python manage.py collectstatic --noinput

# run migrations at container start (NOT at build time)
CMD sh -c "python manage.py migrate --noinput && gunicorn ScanSafe.wsgi:application --bind 0.0.0.0:${PORT:-8080} --timeout 300 --workers 2"
