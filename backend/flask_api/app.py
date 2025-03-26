from flask import Flask, request, jsonify
from flask_cors import CORS
from flasgger import Swagger
from functools import wraps
from backend.shared.utils import load_trace, apply_filter

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

@app.route("/sessions", methods=["GET"])
@require_auth
def get_sessions():
    return jsonify(["session_1", "session_2"])

@app.route("/sessions/<session_id>/neurons/<neuron_id>", methods=["GET"])
@require_auth
def get_trace(session_id, neuron_id):
    filter = request.args.get("filter")
    trace = load_trace(session_id, neuron_id)
    if filter:
        trace = apply_filter(trace, filter)
    return jsonify({"trace": trace.tolist()})

if __name__ == "__main__":
    app.run(debug=True)
