from flask import Flask, request, jsonify
import joblib
import numpy as np
from datetime import timedelta
import pandas as pd
import os

app = Flask(__name__)

# Load pickle files
models = joblib.load("ml_models.pkl")
daily_on_times = joblib.load("daily_on_times.pkl")
lookback = joblib.load("lookback.pkl")

@app.route("/predict", methods=["POST"])
def predict():
    try:
        # 🔮 Predict ON times
        prediction_input = daily_on_times.iloc[-lookback:].values.flatten().reshape(1, -1)
        next_day = daily_on_times.index[-1] + timedelta(days=1)

        predicted_on = []

        for model in models:
            mins = model.predict(prediction_input)[0]
            secs = mins * 60
            h = int(secs // 3600)
            m = int((secs % 3600) // 60)
            s = int(secs % 60)

            predicted_on.append({
                "Timestamp": pd.to_datetime(f"{next_day.date()} {h:02d}:{m:02d}:{s:02d}"),
                "State": "ON"
            })

        prediction_df = pd.DataFrame(predicted_on)

        # 🔥 FIXED AVERAGE DURATION (example 31.5 minutes)
        # You can adjust this value
        average_duration_minutes = 31.5

        off_predictions = []

        for i, row in prediction_df.iterrows():
            off_time = row["Timestamp"] + timedelta(
                minutes=average_duration_minutes
            )

            off_predictions.append({
                "Timestamp": off_time,
                "State": "OFF"
            })

        off_df = pd.DataFrame(off_predictions)

        # 🔄 Combine ON + OFF
        final_prediction = (
            pd.concat([prediction_df, off_df])
            .sort_values("Timestamp")
            .reset_index(drop=True)
        )

        final_prediction["Timestamp"] = final_prediction["Timestamp"].astype(str)

        return jsonify(final_prediction.to_dict("records"))

    except Exception as e:
        return jsonify({"error": str(e)}), 500
if __name__ == "__main__":
    port = int(os.environ.get("PORT", 5000))
    app.run(host="0.0.0.0", port=port)
