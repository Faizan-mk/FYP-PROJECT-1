# Complete AI Chatbot Setup Guide

This guide will help you set up the complete AI chatbot system with Python model training, Flask API, Node.js backend, and MySQL database.

## Prerequisites

- Python 3.8 or higher
- Node.js 16 or higher
- MySQL Server
- npm or yarn

## Step 1: Setup Python Chatbot Model

### 1.1 Navigate to AI Chatbot folder
```bash
cd "AI Chatbot model"
```

### 1.2 Install Python dependencies
```bash
pip install -r requirements.txt
```

### 1.3 Train the chatbot model
```bash
python train.py
```

This will:
- Process the intents.json file
- Create training data
- Train a neural network model
- Save the model as `chatbot_model.h5`
- Generate `words.pkl` and `classes.pkl` files

**Note:** Training may take 5-10 minutes depending on your system.

### 1.4 Test the chatbot (Optional)
```bash
python chatbot.py
```

Type messages to test the chatbot. Type 'quit' to exit.

## Step 2: Start Flask API Server

### 2.1 Run the Flask server
```bash
python app.py
```

The server will start on `http://localhost:5001`

**Keep this terminal running!**

### 2.2 Test the API (Optional)
Open a new terminal and test:
```bash
curl -X POST http://localhost:5001/api/chat -H "Content-Type: application/json" -d "{\"message\":\"Hello\"}"
```

## Step 3: Setup Node.js Backend

### 3.1 Navigate to Backend folder
Open a new terminal:
```bash
cd Backend
```

### 3.2 Install Node.js dependencies
```bash
npm install
```

This will install axios and other required packages.

### 3.3 Configure Database
Make sure MySQL is running and update `.env` file if needed:
```
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=root
DB_NAME=travel_db
CHATBOT_API_URL=http://localhost:5001/api/chat
```

### 3.4 Start the backend server
```bash
npm run dev
```

The backend will start on `http://localhost:5000`

**Keep this terminal running!**

## Step 4: Start Frontend

### 4.1 Navigate to Frontend folder
Open a new terminal:
```bash
cd frontend
```

### 4.2 Start the frontend (if not already running)
```bash
npm run dev
```

The frontend will start on `http://localhost:5173` (or another port)

## Step 5: Test the Complete System

1. Open your browser and go to the frontend URL
2. Login to your account
3. Navigate to the AI Chatbot page
4. Start chatting!

## Architecture Overview

```
┌─────────────────┐
│   Frontend      │
│  (React/Vite)   │
│  Port: 5173     │
└────────┬────────┘
         │
         │ HTTP Requests
         │
┌────────▼────────┐
│  Node.js        │
│  Backend        │◄──────────┐
│  Port: 5000     │           │
└────────┬────────┘           │
         │                    │
         │ Saves to DB        │ HTTP Request
         │                    │
┌────────▼────────┐    ┌──────▼──────┐
│     MySQL       │    │   Flask     │
│   Database      │    │   API       │
│                 │    │  Port: 5001 │
└─────────────────┘    └──────┬──────┘
                              │
                              │ Uses
                              │
                       ┌──────▼──────┐
                       │  AI Model   │
                       │ (TensorFlow)│
                       └─────────────┘
```

## Data Flow

1. User sends message from Frontend
2. Frontend calls Node.js Backend API (`/api/v1/chat`)
3. Backend calls Flask API (`http://localhost:5001/api/chat`)
4. Flask API uses trained AI model to generate response
5. Response sent back to Backend
6. Backend saves conversation to MySQL database
7. Response sent back to Frontend
8. User sees AI response

## Troubleshooting

### Flask API not responding
- Make sure Python server is running on port 5001
- Check if all Python dependencies are installed
- Verify the model files exist (chatbot_model.h5, words.pkl, classes.pkl)

### Backend can't connect to Flask
- Check CHATBOT_API_URL in .env file
- Make sure Flask server is running
- Backend will use fallback responses if Flask is down

### Database errors
- Make sure MySQL is running
- Check database credentials in .env
- Verify travel_db database exists

### Model training errors
- Make sure all Python packages are installed
- Check Python version (3.8+)
- Try running with administrator/sudo privileges

## Running All Services

You need 3 terminals running simultaneously:

**Terminal 1 - Flask API:**
```bash
cd "AI Chatbot model"
python app.py
```

**Terminal 2 - Node.js Backend:**
```bash
cd Backend
npm run dev
```

**Terminal 3 - Frontend:**
```bash
cd frontend
npm run dev
```

## Features

- ✅ AI-powered responses using trained neural network
- ✅ Conversation history saved to MySQL database
- ✅ Fallback responses if AI service is unavailable
- ✅ Real-time chat interface
- ✅ User authentication
- ✅ Travel-specific intents and responses

## Adding New Intents

1. Edit `AI Chatbot model/intents.json`
2. Add new intent with patterns and responses
3. Retrain the model: `python train.py`
4. Restart Flask server: `python app.py`

## Production Deployment

For production:
1. Use a process manager like PM2 for Node.js
2. Use gunicorn for Flask API
3. Set up proper environment variables
4. Use a reverse proxy (nginx)
5. Enable HTTPS
6. Use production database credentials

## Support

If you encounter any issues, check:
- All services are running
- Ports 5000, 5001, and 5173 are available
- Database connection is working
- Python and Node.js versions are correct
