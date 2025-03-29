FROM python:3.10-slim
WORKDIR /app

# Install system dependencies including build tools
RUN apt-get update && apt-get install -y \
    procps \
    curl \
    openjdk-17-jre-headless \
    gcc \
    g++ \
    make \
    && rm -rf /var/lib/apt/lists/*

# Copy Flask API code
COPY backend/flask_api .

# Copy shared utilities
COPY backend/shared ./shared

# Copy workflow directories
COPY workflow /workflow

# Install Python dependencies
RUN pip install flask flask-cors flasgger numpy scikit-learn
RUN pip install snakemake

# Install Nextflow
RUN curl -s https://get.nextflow.io | bash && \
    mv nextflow /usr/local/bin/

# Expose port
EXPOSE 5000

CMD ["python", "app.py"]