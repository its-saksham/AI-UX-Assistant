# app.py

from flask import Flask, request, jsonify
from flask_cors import CORS
from openai_utils import generate_ui_suggestion

app = Flask(__name__)
CORS(app)

@app.route("/api/ui-suggest", methods=["POST"])
def ui_suggest():
    data = request.get_json()
    prompt = data.get("prompt")

    if not prompt:
        return jsonify({"error": "Prompt is required"}), 400

    try:
        suggestion = generate_ui_suggestion(prompt)
        return jsonify({"suggestion": suggestion})
    except Exception as e:
        print("Error:", e)
        return jsonify({"error": "Failed to generate UI suggestion"}), 500

if __name__ == "__main__":
    app.run(debug=True, port=5000)
