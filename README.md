📘 AI-Driven Behavioral and Motion-Based Control of Electrical Appliances
🧠 Overview

This project implements an AI-powered smart automation system that automatically controls electrical appliances based on motion, behavior, and environmental data.

The system collects sensor inputs, processes them using a Machine Learning model, and intelligently decides when to turn ON/OFF appliances such as lights and fans to improve energy efficiency and user comfort.

This project is inspired by research work published in IJCRT and SAS Publishers.

🚀 Key Features
✨ Intelligent Decision Making

Uses AI/ML models to learn behavioral patterns

Predicts appliance usage based on motion and context

Automatically triggers appliances when needed

🔌 Appliance Control

Controls electrical appliances using relay modules / IoT actuators

ON/OFF control based on ML prediction results

📊 Sensor Integration

Motion sensors (PIR)

Environmental inputs (light level, temperature – optional)

Data is sent to ML model for prediction

📈 Logging & Analytics

Stores predictions and user behavior in MongoDB

Useful for analysis and future optimization

🏗️ System Architecture
Sensors → Express.js Backend → ML Model (Google Colab)
                    ↓
               MongoDB Database
                    ↓
              Appliance Control (Relay)

📥 Step 1: Clone the GitHub Repository

Open Command Prompt / Terminal and run:

git clone https://github.com/Madhan7708/AI-DRIVEN-BEHAVIORAL-AND-MOTION-BASED-CONTROL-OF-ELECTRICAL-APPLIANCE.git


Move into the project directory:

cd AI-DRIVEN-BEHAVIORAL-AND-MOTION-BASED-CONTROL-OF-ELECTRICAL-APPLIANCE


✅ You are now inside the project folder.

📂 Step 2: Project Structure
AI-DRIVEN-BEHAVIORAL-AND-MOTION-BASED-CONTROL-OF-ELECTRICAL-APPLIANCE
├── backend/
│   ├── server.js              # Express.js server
│   ├── package.json
│   ├── models/
│   │   ├── userModel.js
│   │   └── predictionModel.js
└── README.md


⚙️ Step 3: Run the Express.js Backend
1️⃣ Navigate to backend folder
cd backend

2️⃣ Install dependencies
npm install

3️⃣ Install nodemon (optional but recommended)
npm install -g nodemon

4️⃣ Start the server
npm run dev

✅ Expected Output
Server running on port 8000
MongoDB connected successfully


📌 Backend runs at:

http://localhost:8000

🌐 Step 4: Expose Express Server using ngrok

Since Google Colab needs a public URL, we use ngrok.

1️⃣ Install ngrok globally
npm install -g ngrok

2️⃣ Start ngrok tunnel
ngrok http 8000

3️⃣ Copy the public URL

Example:

https://noninterpolative-ellen-unghostly.ngrok-free.dev


📌 Your ML endpoint will be:

https://noninterpolative-ellen-unghostly.ngrok-free.dev/ml-data

🧠 Step 5: Run Machine Learning Server in Google Colab
1️⃣ Open Google Colab

👉 https://colab.research.google.com

2️⃣ Upload ML file

Upload:

Main(Colab).py
