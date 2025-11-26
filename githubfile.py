# -------------------------------
# 1. Mount Google Drive
# -------------------------------
from google.colab import drive
drive.mount('/content/drive')

import pandas as pd
import numpy as np
from sklearn.linear_model import LinearRegression
from datetime import timedelta

# -------------------------------
# 2. Load CSV from Google Drive
# -------------------------------
csv_path = "/content/drive/My Drive/Colab_data/repetitive_usage_pattern.csv"

df = pd.read_csv(csv_path)
df['Timestamp'] = pd.to_datetime(df['Timestamp'])


# -------------------------------
# 3. Preprocessing for ON Times
# -------------------------------

# Filter ON states and calculate minutes since midnight
on_df = df[df['State'] == 'ON'].copy()
on_df['Date'] = on_df['Timestamp'].dt.date
on_df['Time_in_Minutes'] = (
    on_df['Timestamp'].dt.hour * 60 +
    on_df['Timestamp'].dt.minute +
    on_df['Timestamp'].dt.second / 60
)

# Reshape to one row per day
on_df['Event_Num'] = on_df.groupby('Date').cumcount() + 1
daily_on_times = on_df.pivot(index='Date', columns='Event_Num', values='Time_in_Minutes')
daily_on_times.columns = [f'ON_Time_{i}' for i in daily_on_times.columns]

# Set index to datetime
daily_on_times.index = pd.to_datetime(daily_on_times.index)


# -------------------------------
# 4. Training Linear Regression Model
# -------------------------------
lookback = 5
num_events = daily_on_times.shape[1]

X = []
Y = [[] for _ in range(num_events)]
dates = daily_on_times.index

for i in range(lookback, len(daily_on_times)):
    X.append(daily_on_times.iloc[i - lookback : i].values.flatten())
    y_targets = daily_on_times.iloc[i].values
    for j in range(num_events):
        Y[j].append(y_targets[j])

X = np.array(X)

# Train separate models for each ON event
models = []
for j in range(num_events):
    model = LinearRegression()
    model.fit(X, Y[j])
    models.append(model)


# -------------------------------
# 5. Predict Next Day ON Times
# -------------------------------
prediction_input = daily_on_times.iloc[-lookback:].values.flatten().reshape(1, -1)
next_day_date = daily_on_times.index[-1] + timedelta(days=1)

predicted_on_times_minutes = [model.predict(prediction_input)[0] for model in models]

# Convert minutes to timestamps
predicted_results = []
for minutes in predicted_on_times_minutes:
    total_seconds = minutes * 60
    hours = int(total_seconds // 3600)
    minutes_part = int((total_seconds % 3600) // 60)
    seconds_part = int(total_seconds % 60)

    time_str = f"{hours:02d}:{minutes_part:02d}:{seconds_part:02d}"
    predicted_datetime = f"{next_day_date.strftime('%Y-%m-%d')} {time_str}"
    predicted_results.append((predicted_datetime, "ON"))

prediction_df = pd.DataFrame(predicted_results, columns=["Timestamp", "State"])
prediction_df["Timestamp"] = pd.to_datetime(prediction_df["Timestamp"])


# -------------------------------
# 6. Predict OFF Times (Average Duration)
# -------------------------------
on_events = df[df["State"] == "ON"].reset_index(drop=True)
on_events = on_events.rename(columns={"Timestamp": "ON_Timestamp"})

off_events = df[df["State"] == "OFF"].reset_index(drop=True)
off_events = off_events.rename(columns={"Timestamp": "OFF_Timestamp"})

if len(on_events) > len(off_events):
    on_events = on_events.iloc[:len(off_events)]

paired_events = pd.concat([on_events["ON_Timestamp"], off_events["OFF_Timestamp"]], axis=1)
paired_events["Duration"] = paired_events["OFF_Timestamp"] - paired_events["ON_Timestamp"]
paired_events["Date"] = paired_events["ON_Timestamp"].dt.date
paired_events["Event_Num"] = paired_events.groupby("Date").cumcount() + 1
paired_events["Duration_Minutes"] = paired_events["Duration"].dt.total_seconds() / 60

average_durations = paired_events.groupby("Event_Num")["Duration_Minutes"].mean()

predicted_off_times = []
for i in range(len(prediction_df)):
    event_num = i + 1
    avg_duration_min = average_durations.loc[event_num]
    off_timestamp = prediction_df["Timestamp"].iloc[i] + timedelta(minutes=avg_duration_min)

    predicted_off_times.append({
        "Timestamp": off_timestamp,
        "State": "OFF"
    })

off_prediction_df = pd.DataFrame(predicted_off_times)


# -------------------------------
# 7. Combine ON + OFF predictions
# -------------------------------
combined_prediction_df = pd.concat([prediction_df, off_prediction_df])
combined_prediction_df = combined_prediction_df.sort_values(by="Timestamp").reset_index(drop=True)

print("\nFinal Combined Predicted ON and OFF Status for the Next Day:")
print(combined_prediction_df)
