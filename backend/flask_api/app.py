from flask import Flask, request, jsonify
from flask_cors import CORS
from flasgger import Swagger
from functools import wraps
from shared.utils import load_trace, apply_filter
import subprocess
import os

app = Flask(__name__)
CORS(app)
Swagger(app)

API_KEY = "demo-token"

def require_auth(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        auth = request.headers.get("Authorization")
        if not auth or auth != f"Bearer {API_KEY}":
            return jsonify({"error": "Unauthorized"}), 401
        return f(*args, **kwargs)
    return decorated

@app.route("/", methods=["GET"])
def root():
    return jsonify({
        "name": "NeuroOps Flask API",
        "version": "1.0.0",
        "endpoints": [
            "/sessions",
            "/sessions/<session_id>/neurons/<neuron_id>",
            "/pipeline/snakemake",
            "/pipeline/nextflow"
        ]
    })

@app.route("/sessions", methods=["GET"])
@require_auth
def get_sessions():
    return jsonify(["session_1", "session_2"])

@app.after_request
def add_headers(response):
    response.headers['Cache-Control'] = 'no-store, no-cache, must-revalidate, max-age=0'
    response.headers['Pragma'] = 'no-cache'
    response.headers['Expires'] = '0'
    return response

@app.route("/sessions/<session_id>/neurons/<neuron_id>", methods=["GET"])
@require_auth
def get_trace(session_id, neuron_id):
    filter = request.args.get("filter")
    trace = load_trace(session_id, neuron_id)
    if filter:
        trace = apply_filter(trace, filter)
    return jsonify({"trace": trace.tolist()})

@app.route("/pipeline/snakemake", methods=["POST"])
@require_auth
def run_snakemake():
    """
    Run Snakemake pipeline
    ---
    parameters:
      - name: Authorization
        in: header
        type: string
        required: true
        description: Bearer token for authentication
    responses:
      200:
        description: Pipeline execution results
      401:
        description: Unauthorized
    """
    try:
        # Run the Snakemake pipeline
        result = subprocess.run(
            ["snakemake", "-s", "../workflow/snakemake/Snakefile", "--cores", "1"],
            capture_output=True,
            text=True,
            check=False
        )
        
        return jsonify({
            "success": result.returncode == 0,
            "stdout": result.stdout,
            "stderr": result.stderr,
            "returncode": result.returncode
        })
    except Exception as e:
        return jsonify({
            "success": False,
            "error": str(e)
        }), 500

@app.route("/pipeline/nextflow", methods=["POST"])
@require_auth
def run_nextflow():
    """
    Run Nextflow pipeline
    ---
    parameters:
      - name: Authorization
        in: header
        type: string
        required: true
        description: Bearer token for authentication
    responses:
      200:
        description: Pipeline execution results
      401:
        description: Unauthorized
    """
    try:
        # Run the Nextflow pipeline
        result = subprocess.run(
            ["nextflow", "run", "../workflow/nextflow"],
            capture_output=True,
            text=True,
            check=False
        )
        
        return jsonify({
            "success": result.returncode == 0,
            "stdout": result.stdout,
            "stderr": result.stderr,
            "returncode": result.returncode
        })
    except Exception as e:
        return jsonify({
            "success": False,
            "error": str(e)
        }), 500

if __name__ == "__main__":
    print("Starting Flask application...")
    print("Binding to all interfaces (0.0.0.0) on port 5000")
    app.run(debug=True, host='0.0.0.0', port=5000)