from flask import Flask, request, jsonify
from flask_cors import CORS
import joblib
import numpy as np
from datetime import timedelta
import pandas as pd
import os

app = Flask(__name__)
CORS(app)  # Allow requests from Node.js

# =============================
# 🔹 Load Models Safely
# =============================
BASE_DIR = os.path.dirname(os.path.abspath(__file__))

try:
    models = joblib.load(os.path.join(BASE_DIR, "ml_models.pkl"))
    lookback = joblib.load(os.path.join(BASE_DIR, "lookback.pkl"))
    print("✅ ML Models Loaded Successfully")
except Exception as e:
    print("❌ Error loading model files:", str(e))
    models = []
    lookback = 1


# =============================
# 🔹 Prediction Route
# =============================
@app.route("/predict", methods=["POST"])
def predict():
    try:
        # 1️⃣ Receive JSON data
        data = request.get_json()

        if not data:
            return jsonify({"error": "No data received"}), 400

        # 2️⃣ Convert JSON to DataFrame
        df = pd.DataFrame(data)

        # 3️⃣ Validate required column
        if "minutes" not in df.columns:
            return jsonify({"error": "Required column 'minutes' missing"}), 400

        # 4️⃣ Ensure enough data for lookback
        if len(df) < lookback:
            return jsonify({
                "error": f"Not enough data. Required at least {lookback} records."
            }), 400

        # 5️⃣ Prepare input for model
        prediction_input = (
            df["minutes"]
            .tail(lookback)
            .values
            .reshape(1, -1)
        )

        predicted_on = []
        next_day = pd.Timestamp.now() + timedelta(days=1)

        # 6️⃣ Predict ON time
        for model in models:
            mins = float(model.predict(prediction_input)[0])

            total_seconds = int(mins * 60)
            h = total_seconds // 3600
            m = (total_seconds % 3600) // 60
            s = total_seconds % 60

            timestamp_str = f"{next_day.date()} {h:02d}:{m:02d}:{s:02d}"

            predicted_on.append({
                "Timestamp": timestamp_str,
                "State": "ON"
            })

        prediction_df = pd.DataFrame(predicted_on)

        # =============================
        # 🔥 OFF Time Logic
        # =============================
        average_duration_minutes = 31.5
        off_predictions = []

        for _, row in prediction_df.iterrows():
            off_time = pd.to_datetime(row["Timestamp"]) + timedelta(
                minutes=average_duration_minutes
            )

            off_predictions.append({
                "Timestamp": off_time.strftime("%Y-%m-%d %H:%M:%S"),
                "State": "OFF"
            })

        # 7️⃣ Combine ON and OFF predictions
        final_prediction = (
            pd.concat([prediction_df, pd.DataFrame(off_predictions)])
            .sort_values("Timestamp")
            .reset_index(drop=True)
        )

        # 8️⃣ Return JSON response
        return jsonify(final_prediction.to_dict("records")), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 500


# =============================
# 🔹 Run Flask App
# =============================
if __name__ == "__main__":
    app.run(host="127.0.0.1", port=5000, debug=True)
