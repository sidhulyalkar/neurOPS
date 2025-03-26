FROM python:3.10-slim
WORKDIR /app
COPY . .
RUN pip install flask flask-cors flasgger numpy scikit-learn
CMD ["python", "app.py"]
