from flask import Flask, request, jsonify
import joblib
import numpy as np
from datetime import timedelta
import pandas as pd
import os

app = Flask(__name__)

BASE_DIR = os.path.dirname(os.path.abspath(__file__))

models = joblib.load(os.path.join(BASE_DIR, "ml_models.pkl"))
lookback = joblib.load(os.path.join(BASE_DIR, "lookback.pkl"))

@app.route("/predict", methods=["POST"])
def predict():
    try:
        # 🔹 Receive data from Node
        data = request.get_json()

        if not data:
            return jsonify({"error": "No data received"}), 400

        # 🔹 Convert JSON to DataFrame
        df = pd.DataFrame(data)

        # 🔹 Example: Assume 'minutes' column exists
        if "minutes" not in df.columns:
            return jsonify({"error": "Required column 'minutes' missing"}), 400

        # 🔹 Take last 'lookback' values
        prediction_input = (
            df["minutes"]
            .tail(lookback)
            .values
            .reshape(1, -1)
        )

        predicted_on = []
        next_day = pd.Timestamp.now() + timedelta(days=1)

        for model in models:
            mins = model.predict(prediction_input)[0]

            secs = mins * 60
            h = int(secs // 3600)
            m = int((secs % 3600) // 60)
            s = int(secs % 60)

            predicted_on.append({
                "Timestamp": f"{next_day.date()} {h:02d}:{m:02d}:{s:02d}",
                "State": "ON"
            })

        prediction_df = pd.DataFrame(predicted_on)

        # 🔥 OFF time logic
        average_duration_minutes = 31.5

        off_predictions = []

        for _, row in prediction_df.iterrows():
            off_time = pd.to_datetime(row["Timestamp"]) + timedelta(
                minutes=average_duration_minutes
            )

            off_predictions.append({
                "Timestamp": str(off_time),
                "State": "OFF"
            })

        final_prediction = (
            pd.concat([prediction_df, pd.DataFrame(off_predictions)])
            .sort_values("Timestamp")
            .reset_index(drop=True)
        )

        return jsonify(final_prediction.to_dict("records"))

    except Exception as e:
        return jsonify({"error": str(e)}), 500


if __name__ == "__main__":
    port = int(os.environ.get("PORT", 5000))
    app.run(host="0.0.0.0", port=port)
