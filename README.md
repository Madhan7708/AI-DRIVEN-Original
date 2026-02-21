# 📘 AI-Driven Behavioral and Motion-Based Control of Electrical Appliances

## 🧠 Overview

This project implements an AI-powered smart automation system that automatically controls electrical appliances based on motion, behavior, and environmental data.

The system collects sensor inputs, processes them using a Machine Learning model, and intelligently decides when to turn ON/OFF appliances such as lights and fans to improve energy efficiency and user comfort.

This project is inspired by research work published in IJCRT and SAS Publishers.

## 🚀 Live Deployment

### Deployed Services:
- **🤖 ML Service**: [https://ml-service-kacd.onrender.com](https://ml-service-kacd.onrender.com)
- **🔧 Backend Service**: [https://ai-backend-8f2z.onrender.com/DBdata](https://ai-backend-8f2z.onrender.com/DBdata)
- **💻 Frontend Application**: [https://aicontrolapplicances.vercel.app/](https://aicontrolapplicances.vercel.app/)

## ✨ Key Features

### 🧠 Intelligent Decision Making
- Uses AI/ML models to learn behavioral patterns
- Predicts appliance usage based on motion and context
- Automatically triggers appliances when needed

### 🔌 Appliance Control
- Controls electrical appliances using relay modules / IoT actuators
- ON/OFF control based on ML prediction results

### 📊 Sensor Integration
- Motion sensors (PIR)
- Environmental inputs (light level, temperature – optional)
- Data is sent to ML model for prediction

### 📈 Logging & Analytics
- Stores predictions and user behavior in MongoDB
- Useful for analysis and future optimization

## 🏗️ System Architecture

```
Sensors → Express.js Backend → ML Model (Python)
              ↓                      ↓
        MongoDB Database      Predictions
              ↓
      Frontend Dashboard
              ↓
      Appliance Control
```

## 🛠️ Technology Stack

### Frontend
- **React.js** - UI Framework
- **Vite** - Build tool
- **CSS** - Styling
- **Deployed on**: Vercel

### Backend
- **Node.js** - Runtime
- **Express.js** - Web framework
- **MongoDB** - Database
- **Deployed on**: Render

### Machine Learning
- **Python** - ML Framework
- **TensorFlow/Sklearn** - ML Libraries
- **Deployed on**: Render

## 📋 Project Structure

```
AI-DRIVEN-BEHAVIORAL-AND-MOTION-BASED-CONTROL-OF-ELECTRICAL-APPLIANCE
├── frontend/                    # React frontend application
│   ├── src/
│   │   ├── components/
│   │   │   ├── Dashboard.jsx
│   │   │   ├── Login.jsx
│   │   │   └── Sidebar.jsx
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── package.json
│   └── vite.config.js
├── Server/                      # Express.js backend
│   ├── server.js
│   ├── modal/
│   │   ├── user.js
│   │   └── predictionResponseModal.js
│   └── package.json
├── ml-service/                  # Python ML service
│   ├── app.py
│   ├── requirements.txt
│   └── Procfile.txt
├── package.json
└── README.md
```

## 🚀 Installation & Setup

### Prerequisites
- Node.js (v14+)
- Python (v3.8+)
- MongoDB (local or cloud)
- Git

### Step 1: Clone the Repository

```bash
git clone https://github.com/Madhan7708/AI-DRIVEN-BEHAVIORAL-AND-MOTION-BASED-CONTROL-OF-ELECTRICAL-APPLIANCE.git
cd AI-DRIVEN-BEHAVIORAL-AND-MOTION-BASED-CONTROL-OF-ELECTRICAL-APPLIANCE
```

### Step 2: Setup Backend (Express.js)

```bash
cd Server
npm install
npm run dev
```

The backend will run on `http://localhost:8000`

**Environment Variables Required:**
- `MONGODB_URI` - MongoDB connection string
- `PORT` - Server port (default: 8000)

### Step 3: Setup Frontend (React)

```bash
cd frontend
npm install
npm run dev
```

The frontend will run on `http://localhost:5173`

### Step 4: Setup ML Service (Python)

```bash
cd ml-service
pip install -r requirements.txt
python app.py
```

The ML service will run on `http://localhost:5000`

## 📡 API Endpoints

### Backend Service
- **Base URL**: `https://ai-backend-8f2z.onrender.com`
- **Get Data**: `/DBdata`
- **Prediction**: `/predict`
- **User Data**: `/user`

### ML Service
- **Base URL**: `https://ml-service-kacd.onrender.com`
- **Health Check**: `/health`
- **Predict**: `/predict`

## 🌐 Live Demo

- **Frontend**: [https://aicontrolapplicances.vercel.app/](https://aicontrolapplicances.vercel.app/)
- **Backend API**: [https://ai-backend-8f2z.onrender.com/DBdata](https://ai-backend-8f2z.onrender.com/DBdata)
- **ML Service**: [https://ml-service-kacd.onrender.com](https://ml-service-kacd.onrender.com)

## 🔐 Authentication

The system uses JWT-based authentication. Users must login through the frontend to access protected routes.

## 📊 Database

MongoDB is used to store:
- User information
- Sensor readings
- Prediction history
- Appliance control logs

## 🧪 Testing

To test the system:

1. Open the frontend application
2. Create an account or login
3. Add sensors and appliances
4. Monitor predictions in real-time

## 🛡️ Security

- JWT tokens for API authentication
- Environment variables for sensitive data
- CORS enabled for frontend only
- MongoDB connection strings secured

## 📝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

- Inspired by research published in IJCRT and SAS Publishers
- Built with Node.js, React.js, Python, and MongoDB
- Deployed on Render (Backend & ML) and Vercel (Frontend)

## 📧 Contact

For questions or support, please open an issue on the GitHub repository.

---

**Last Updated**: February 2026 | **Status**: Active & Deployed
