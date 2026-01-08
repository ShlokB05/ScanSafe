FROM python:3.12-slim     

WORKDIR /app             

COPY api/requirements.txt .
RUN pip install -r requirements.txt   

COPY . .                 

CMD gunicorn app.wsgi:application --bind 0.0.0.0:$PORT
