FROM python:3.10-slim
WORKDIR /app

# Copy Flask code
COPY backend/flask_api .

# Copy shared utilities
COPY backend/shared ./shared

RUN pip install flask flask-cors flasgger numpy scikit-learn

CMD ["python", "app.py"]