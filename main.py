import pandas as pd
import numpy as np
from sklearn.linear_model import LinearRegression
from datetime import timedelta

# --- 1. Data Loading and Preprocessing ---
# Load the dataset
df = pd.read_csv('repetitive_usage_pattern.csv')
df['Timestamp'] = pd.to_datetime(df['Timestamp'])

# Filter for 'ON' states and calculate minutes since midnight
on_df = df[df['State'] == 'ON'].copy()
on_df['Date'] = on_df['Timestamp'].dt.date
on_df['Time_in_Minutes'] = on_df['Timestamp'].dt.hour * 60 + on_df['Timestamp'].dt.minute + on_df['Timestamp'].dt.second / 60

# Reshape data to have one row per day, with columns for each ON event time
on_df['Event_Num'] = on_df.groupby('Date').cumcount() + 1
daily_on_times = on_df.pivot(index='Date', columns='Event_Num', values='Time_in_Minutes')
daily_on_times.columns = [f'ON_Time_{i}' for i in daily_on_times.columns]

# Ensure the Date index is datetime for time series operations
daily_on_times.index = pd.to_datetime(daily_on_times.index)

# --- 2. Training Linear Regression Models for 'ON' Times ---
lookback = 5
num_events = daily_on_times.shape[1]

X = []
Y = [[] for _ in range(num_events)]
dates = daily_on_times.index

# Create features (3 days prior) and targets (current day)
for i in range(lookback, len(daily_on_times)):
    # Features (ON times from t-3, t-2, t-1)
    x_features = daily_on_times.iloc[i-lookback : i].values.flatten()
    X.append(x_features)

    # Targets (ON times from t)
    y_targets = daily_on_times.iloc[i].values
    for j in range(num_events):
        Y[j].append(y_targets[j])

X = np.array(X)
models = []

# Train a separate Linear Regression model for each of the 3 ON times
for j in range(num_events):
    model = LinearRegression()
    model.fit(X, Y[j])
    models.append(model)

# --- 3. Prediction for the Next Day's 'ON' Times ---
prediction_input = daily_on_times.iloc[-lookback:].values.flatten().reshape(1, -1)
next_day_date = daily_on_times.index[-1] + timedelta(days=1)
predicted_on_times_minutes = []

for model in models:
    prediction = model.predict(prediction_input)[0]
    predicted_on_times_minutes.append(prediction)

# Convert predicted minutes to Timestamp
predicted_results = []
for minutes in predicted_on_times_minutes:
    total_seconds = minutes * 60
    hours = int(total_seconds // 3600)
    minutes_part = int((total_seconds % 3600) // 60)
    seconds_part = int(total_seconds % 60)

    time_str = f"{hours:02d}:{minutes_part:02d}:{seconds_part:02d}"
    predicted_datetime = f"{next_day_date.strftime('%Y-%m-%d')} {time_str}"
    predicted_results.append((predicted_datetime, 'ON'))

prediction_df = pd.DataFrame(predicted_results, columns=['Timestamp', 'State'])
prediction_df['Timestamp'] = pd.to_datetime(prediction_df['Timestamp'])

# --- 4. Predicting 'OFF' Times using Average Duration ---

# Pair ON and OFF events
on_events = df[df['State'] == 'ON'].reset_index(drop=True).rename(columns={'Timestamp': 'ON_Timestamp'})
off_events = df[df['State'] == 'OFF'].reset_index(drop=True).rename(columns={'Timestamp': 'OFF_Timestamp'})

if len(on_events) > len(off_events):
    on_events = on_events.iloc[:len(off_events)]

paired_events = pd.concat([on_events['ON_Timestamp'], off_events['OFF_Timestamp']], axis=1)
paired_events['Duration'] = paired_events['OFF_Timestamp'] - paired_events['ON_Timestamp']
paired_events['Date'] = paired_events['ON_Timestamp'].dt.date
paired_events['Event_Num'] = paired_events.groupby('Date').cumcount() + 1
paired_events['Duration_Minutes'] = paired_events['Duration'].dt.total_seconds() / 60

# Calculate the mean duration for each event
average_durations = paired_events.groupby('Event_Num')['Duration_Minutes'].mean()

# Add the average duration to the predicted ON times to get OFF times
predicted_off_times = []
for i in range(len(prediction_df)):
    on_timestamp = prediction_df['Timestamp'].iloc[i]
    event_num = i + 1
    avg_duration_min = average_durations.loc[event_num]
    duration_delta = pd.Timedelta(minutes=avg_duration_min)
    
    off_timestamp = on_timestamp + duration_delta
    
    predicted_off_times.append({
        'Timestamp': off_timestamp,
        'State': 'OFF'
    })

off_prediction_df = pd.DataFrame(predicted_off_times)

# Combine the ON and OFF predictions
combined_prediction_df = pd.concat([prediction_df, off_prediction_df]).sort_values(by='Timestamp').reset_index(drop=True)

# Display final results
print("\nFinal Combined Predicted ON and OFF Status for the Next Day:")
print(combined_prediction_df)

# Note: The output will match the previously provided prediction for 2025-10-08.