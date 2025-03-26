install:
	pip install -r requirements.txt || true

test:
	python tests/test_api_endpoints.py

data:
	python data/download_data.py

run:
	docker compose -f docker/docker-compose.yml up --build

snakemake:
	snakemake -s workflow/snakemake/Snakefile --cores 1

nextflow:
	nextflow run workflow/nextflow

.PHONY: install test data run snakemake nextflow