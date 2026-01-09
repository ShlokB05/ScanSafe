FROM python:3.12-slim     

WORKDIR /    

COPY api/requirements.txt .
RUN pip install -r api/requirements.txt   # build step

COPY . .                 

CMD gunicorn ScanSafe.wsgi:application --bind 0.0.0.0:$PORT
