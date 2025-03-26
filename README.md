# 🧠 NeuroOps — RESTful Neuroscience Platform

![License](https://img.shields.io/github/license/yourusername/neuroops)
![Build](https://img.shields.io/badge/build-passing-brightgreen)
![Docker](https://img.shields.io/badge/docker-ready-blue)

**NeuroOps** is a full-stack neuroscience platform featuring:

- RESTful APIs (Flask + Express)
- Machine learning pipelines (Snakemake + Nextflow)
- Interactive plots and trace views
- Secure token-based API
- Jupyter client integration

## 🚀 Quickstart

```bash
git clone https://github.com/YOUR_USERNAME/neuroops.git
cd neuroops
python data/download_data.py
cd docker
docker compose up --build
```

Then visit:
- Frontend: http://localhost:3000
- API Docs: http://localhost:5000/apidocs

## 🔐 Authentication
Use this token in Postman or the frontend:
```
Authorization: Bearer demo-token
```

## 🧪 Local Pipeline Test
```bash
# Run Snakemake pipeline
snakemake -s workflow/snakemake/Snakefile --cores 1

# Run Nextflow pipeline
nextflow run workflow/nextflow
```

## 🧰 Tech Stack
- React + Tailwind
- Flask + Express
- Snakemake + Nextflow
- scikit-learn + numpy
- Swagger + Jupyter

## 📄 License
MIT © 2025 Sidharth Hulyalkar
