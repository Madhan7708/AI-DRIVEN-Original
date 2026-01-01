

import requests
import pandas as pd
import numpy as np
from sklearn.linear_model import LinearRegression
from datetime import timedelta
API_URL = "https://noninterpolative-ellen-unghostly.ngrok-free.dev/ml-data"

response = requests.get(API_URL)
data = response.json()

df = pd.DataFrame(data)
df["Timestamp"] = pd.to_datetime(df["Timestamp"])

on_df = df[df["State"] == "ON"].copy()

on_df["Date"] = on_df["Timestamp"].dt.date
on_df["Time_Minutes"] = (
    on_df["Timestamp"].dt.hour * 60 +
    on_df["Timestamp"].dt.minute +
    on_df["Timestamp"].dt.second / 60
)

on_df["Event_Num"] = on_df.groupby("Date").cumcount() + 1

daily_on_times = on_df.pivot(
    index="Date",
    columns="Event_Num",
    values="Time_Minutes"
)

daily_on_times.columns = [f"ON_Time_{i}" for i in daily_on_times.columns]
daily_on_times.index = pd.to_datetime(daily_on_times.index)
lookback = 5
num_events = daily_on_times.shape[1]

X = []
Y = [[] for _ in range(num_events)]

for i in range(lookback, len(daily_on_times)):
    X.append(daily_on_times.iloc[i-lookback:i].values.flatten())
    y = daily_on_times.iloc[i].values
    for j in range(num_events):
        Y[j].append(y[j])

X = np.array(X)

models = []
for j in range(num_events):
    model = LinearRegression()
    model.fit(X, Y[j])
    models.append(model)
prediction_input = daily_on_times.iloc[-lookback:].values.flatten().reshape(1, -1)
next_day = daily_on_times.index[-1] + timedelta(days=1)

predicted_on_minutes = [m.predict(prediction_input)[0] for m in models]

predicted_on = []

for mins in predicted_on_minutes:
    secs = mins * 60
    h = int(secs // 3600)
    m = int((secs % 3600) // 60)
    s = int(secs % 60)

    predicted_on.append({
        "Timestamp": f"{next_day.date()} {h:02d}:{m:02d}:{s:02d}",
        "State": "ON"
    })

prediction_df = pd.DataFrame(predicted_on)
prediction_df["Timestamp"] = pd.to_datetime(prediction_df["Timestamp"])

on_events = df[df["State"] == "ON"].reset_index(drop=True)
off_events = df[df["State"] == "OFF"].reset_index(drop=True)

min_len = min(len(on_events), len(off_events))
on_events = on_events.iloc[:min_len]
off_events = off_events.iloc[:min_len]

paired = pd.DataFrame({
    "ON": on_events["Timestamp"],
    "OFF": off_events["Timestamp"]
})

paired["Duration_Min"] = (
    (paired["OFF"] - paired["ON"]).dt.total_seconds() / 60
)

paired["Date"] = paired["ON"].dt.date
paired["Event_Num"] = paired.groupby("Date").cumcount() + 1

avg_duration = paired.groupby("Event_Num")["Duration_Min"].mean()

off_predictions = []

for i in range(len(prediction_df)):
    off_time = prediction_df.iloc[i]["Timestamp"] + timedelta(
        minutes=avg_duration.loc[i + 1]
    )
    off_predictions.append({
        "Timestamp": off_time,
        "State": "OFF"
    })

off_df = pd.DataFrame(off_predictions)

final_prediction = pd.concat([prediction_df, off_df])
final_prediction = final_prediction.sort_values("Timestamp").reset_index(drop=True)

print("Final Prediction:")
print(final_prediction)

final_prediction["Timestamp"] = final_prediction["Timestamp"].astype(str)
payload = final_prediction.to_dict("records")

POST_URL = "https://noninterpolative-ellen-unghostly.ngrok-free.dev/ml-response"

response = requests.post(POST_URL, json=payload)

print("Status Code:", response.status_code)
print("Server Response:", response.json())

