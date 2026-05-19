# AI Travel Assistant - Complete Chatbot System

A full-stack AI-powered travel assistant chatbot with neural network-based responses, MySQL database integration, and modern web interface.

## 🚀 Quick Start

### Option 1: Automated Setup (Recommended)
```bash
# Run the setup script
setup-chatbot.bat

# Then start all services
start-all-services.bat
```

### Option 2: Manual Setup
See [CHATBOT_SETUP_GUIDE.md](CHATBOT_SETUP_GUIDE.md) for detailed instructions.

## 📋 System Requirements

- **Python**: 3.8 or higher
- **Node.js**: 16 or higher
- **MySQL**: 5.7 or higher
- **RAM**: Minimum 4GB (8GB recommended for model training)
- **Disk Space**: ~500MB for dependencies

## 🏗️ Architecture

```
Frontend (React) ←→ Node.js Backend ←→ Flask API ←→ AI Model (TensorFlow)
                           ↓
                    MySQL Database
```

## 📁 Project Structure

```
clone/
├── AI Chatbot model/          # Python AI chatbot
│   ├── intents.json          # Training data
│   ├── train.py              # Model training script
│   ├── chatbot.py            # Inference module
│   ├── app.py                # Flask API server
│   ├── requirements.txt      # Python dependencies
│   └── README.md             # AI model documentation
│
├── Backend/                   # Node.js Express backend
│   ├── controller/
│   │   └── chatController.js # Chatbot API integration
│   ├── model/
│   │   └── Chat.js           # Sequelize Chat model
│   ├── routes/
│   │   └── chat.js           # Chat routes
│   ├── .env                  # Environment variables
│   └── server.js             # Express server
│
├── frontend/                  # React frontend
│   └── src/
│       └── app/frontend/Pages/
│           └── AI CHATBOT PAGE/
│               ├── AIChatbotPage.jsx
│               └── Components/
│
├── CHATBOT_SETUP_GUIDE.md    # Detailed setup guide
├── setup-chatbot.bat         # Automated setup script
└── start-all-services.bat    # Start all services
```

## 🔧 Configuration

### Backend (.env)
```env
PORT=5000
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=root
DB_NAME=travel_db
JWT_SECRET=your_super_secret_jwt_key_here
NODE_ENV=development
CHATBOT_API_URL=http://localhost:5001/api/chat
```

### Ports
- **Frontend**: 5173 (Vite default)
- **Node.js Backend**: 5000
- **Flask API**: 5001
- **MySQL**: 3306

## 🎯 Features

### AI Chatbot
- ✅ Neural network-based responses (TensorFlow/Keras)
- ✅ Natural language understanding with NLTK
- ✅ Travel-specific intents (hotels, weather, itinerary, budget, etc.)
- ✅ Continuous learning capability
- ✅ Fallback responses for reliability

### Backend Integration
- ✅ RESTful API with Express.js
- ✅ MySQL database with Sequelize ORM
- ✅ Conversation history storage
- ✅ User authentication with JWT
- ✅ Error handling and logging

### Frontend
- ✅ Modern React UI with Framer Motion
- ✅ Real-time chat interface
- ✅ Chat history loading
- ✅ Typing indicators
- ✅ Quick suggestions
- ✅ Responsive design

## 📊 Database Schema

### Chat Table
```sql
CREATE TABLE Chats (
    id VARCHAR(36) PRIMARY KEY,
    userId VARCHAR(36) NOT NULL,
    message TEXT NOT NULL,
    response TEXT NOT NULL,
    createdAt DATETIME,
    updatedAt DATETIME,
    FOREIGN KEY (userId) REFERENCES Users(id)
);
```

## 🔌 API Endpoints

### Node.js Backend (Port 5000)

#### POST /api/v1/chat
Send a message to the chatbot
```json
Request:
{
  "message": "Best hotels in Paris?"
}

Response:
{
  "message": "I can help you find great hotels! Which city are you visiting?"
}
```

#### GET /api/v1/chat
Get chat history for authenticated user
```json
Response:
[
  {
    "id": "uuid",
    "userId": "user-uuid",
    "message": "Hello",
    "response": "Hi there! Ready to explore new destinations?",
    "createdAt": "2026-01-07T14:00:00.000Z"
  }
]
```

### Flask API (Port 5001)

#### POST /api/chat
Get AI response
```json
Request:
{
  "message": "What's the weather like?"
}

Response:
{
  "message": "You can check the weather forecast in the Weather section of your dashboard.",
  "status": "success"
}
```

#### GET /api/health
Health check
```json
Response:
{
  "status": "healthy",
  "message": "Chatbot API is running"
}
```

## 🧠 AI Model Details

### Architecture
- **Input Layer**: Bag of words (vocabulary size)
- **Hidden Layer 1**: 128 neurons, ReLU activation, 50% dropout
- **Hidden Layer 2**: 64 neurons, ReLU activation, 50% dropout
- **Output Layer**: Softmax (number of intent classes)

### Training
- **Optimizer**: SGD with Nesterov momentum
- **Loss Function**: Categorical crossentropy
- **Epochs**: 200
- **Batch Size**: 5

### Intents
- Greeting
- Goodbye
- Hotel recommendations
- Weather
- Itinerary planning
- Budget estimation
- Transport options
- Attractions
- Safety information
- Booking help
- General help

## 🛠️ Development

### Adding New Intents

1. Edit `AI Chatbot model/intents.json`:
```json
{
  "tag": "new_intent",
  "patterns": [
    "pattern 1",
    "pattern 2"
  ],
  "responses": [
    "response 1",
    "response 2"
  ]
}
```

2. Retrain the model:
```bash
cd "AI Chatbot model"
python train.py
```

3. Restart Flask server:
```bash
python app.py
```

### Testing

#### Test Flask API
```bash
curl -X POST http://localhost:5001/api/chat \
  -H "Content-Type: application/json" \
  -d '{"message":"Hello"}'
```

#### Test Backend API
```bash
curl -X POST http://localhost:5000/api/v1/chat \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{"message":"Hello"}'
```

## 🐛 Troubleshooting

### Common Issues

**1. Flask API not responding**
- Check if Python server is running on port 5001
- Verify model files exist (chatbot_model.h5, words.pkl, classes.pkl)
- Check Python dependencies are installed

**2. Backend can't connect to Flask**
- Verify CHATBOT_API_URL in .env
- Ensure Flask server is running
- Check firewall settings

**3. Database errors**
- Verify MySQL is running
- Check database credentials in .env
- Ensure travel_db database exists

**4. Model training errors**
- Check Python version (3.8+)
- Install all requirements: `pip install -r requirements.txt`
- Ensure sufficient RAM (4GB minimum)

**5. Port already in use**
- Change ports in respective config files
- Kill processes using the ports

## 📈 Performance

- **Response Time**: ~100-300ms (with AI model)
- **Fallback Response Time**: ~10-50ms
- **Model Accuracy**: ~85-95% (depends on training data)
- **Database Query Time**: ~10-50ms

## 🔒 Security

- JWT authentication for all chat endpoints
- SQL injection prevention with Sequelize ORM
- CORS configuration for frontend access
- Environment variables for sensitive data
- Input validation and sanitization

## 🚀 Deployment

### Production Checklist
- [ ] Use production database
- [ ] Set strong JWT_SECRET
- [ ] Enable HTTPS
- [ ] Use process manager (PM2)
- [ ] Set up reverse proxy (nginx)
- [ ] Configure firewall
- [ ] Set up logging and monitoring
- [ ] Use gunicorn for Flask
- [ ] Optimize model for production
- [ ] Set up database backups

## 📝 License

This project is part of an FYP (Final Year Project).

## 👥 Contributors

- Muhammad Faizan

## 📞 Support

For issues and questions:
1. Check [CHATBOT_SETUP_GUIDE.md](CHATBOT_SETUP_GUIDE.md)
2. Review error logs in terminal
3. Check database connection
4. Verify all services are running

---

**Note**: Make sure all three services (Flask API, Node.js Backend, Frontend) are running simultaneously for the chatbot to work properly.
