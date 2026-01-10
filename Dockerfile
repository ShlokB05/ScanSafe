# ---------- build frontend ----------
FROM node:20-alpine AS frontend
WORKDIR /frontend

COPY FrontEnd/package*.json ./
RUN npm ci

COPY FrontEnd/ ./
RUN npm run build

# ---------- backend ----------
FROM python:3.12-slim
WORKDIR /app

ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1

COPY api/requirements.txt /app/requirements.txt
RUN pip install --no-cache-dir -r /app/requirements.txt

COPY . /app

# Copy built frontend into backend image
RUN mkdir -p /app/frontend_dist
COPY --from=frontend /frontend/dist/ /app/frontend_dist/

COPY start.sh /app/start.sh
RUN chmod +x /app/start.sh

CMD ["/app/start.sh"]
