# ---------- Frontend build ----------
FROM node:20-alpine AS frontend
WORKDIR /app

COPY package*.json ./
RUN if [ -f package-lock.json ]; then npm ci; else npm install; fi

COPY . .
RUN npm run build


# ---------- Backend runtime ----------
FROM python:3.12-slim
ENV PYTHONUNBUFFERED=1
WORKDIR /app

COPY api/requirements.txt /app/requirements.txt
RUN pip install --no-cache-dir -r /app/requirements.txt

COPY . .

# Copy built frontend into places Django expects
COPY --from=frontend /app/dist /app/dist
RUN mkdir -p /app/templates /app/static \
 && cp -r /app/dist/* /app/static/ \
 && mv /app/static/index.html /app/templates/index.html

# Run DB + static at container start (NOT at build time)
COPY entrypoint.sh /entrypoint.sh
RUN chmod +x /entrypoint.sh

CMD ["/entrypoint.sh"]
