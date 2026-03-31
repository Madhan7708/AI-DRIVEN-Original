from flask import Flask, request, jsonify
import joblib
import numpy as np
from datetime import timedelta
import pandas as pd
import os

app = Flask(__name__)

# 🔥 Load Pickle Files (make sure they are in same folder)
models = joblib.load("ml_models.pkl")
daily_on_times = joblib.load("daily_on_times.pkl")
lookback = joblib.load("lookback.pkl")



@app.route("/", methods=["GET"])
def home():
    return jsonify({
        "message": "Flask API is running successfully 🚀",
        "usage": "Send POST request to /predict for predictions"
})
@app.route("/predict", methods=["POST"])
def predict():
    try:
        print("📥 Request received from Express")

        # 🔮 Prepare input for prediction
        prediction_input = daily_on_times.iloc[-lookback:].values.flatten().reshape(1, -1)

        # 📅 Predict for next day
        next_day = daily_on_times.index[-1] + timedelta(days=1)

        predicted_on = []

        # 🔥 Predict ON times using ML models
        for model in models:
            mins = model.predict(prediction_input)[0]
            secs = mins * 60

            h = int(secs // 3600)
            m = int((secs % 3600) // 60)
            s = int(secs % 60)

            predicted_on.append({
                "Timestamp": pd.to_datetime(
                    f"{next_day.date()} {h:02d}:{m:02d}:{s:02d}"
                ),
                "State": "ON"
            })

        prediction_df = pd.DataFrame(predicted_on)

        # 🔥 Generate OFF times using fixed average duration
        average_duration_minutes = 31.5  # adjust if needed

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

        # Convert Timestamp to string for JSON response
        final_prediction["Timestamp"] = final_prediction["Timestamp"].astype(str)

        print("✅ Prediction completed")

        return jsonify(final_prediction.to_dict("records"))

    except Exception as e:
        print("❌ Error:", str(e))
        return jsonify({"error": str(e)}), 500


if __name__ == "__main__":
    app.run()