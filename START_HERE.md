# 🎯 CHATBOT SYSTEM - FINAL GUIDE

## 📋 Complete Kya Hua Hai

✅ **AI Chatbot Model** - Python + TensorFlow
✅ **Flask API Server** - Port 5001
✅ **Backend Integration** - Node.js + Express
✅ **Database Setup** - MySQL + Sequelize
✅ **Frontend** - Already working
✅ **Complete Documentation** - 5 guide files

## 🚀 KAISE RUN KAREIN - 3 SIMPLE STEPS

### 📍 STEP 1: Flask API Start Karein

**Naya PowerShell Terminal kholen:**

```powershell
cd "d:\FYP project 2\clone\AI Chatbot model"
```

**Pehli baar (one-time setup):**
```powershell
pip install numpy nltk tensorflow flask flask-cors python-dotenv
python train.py
```
⏱️ **Wait**: 5-10 minutes (model train hoga)

**Har baar (to start server):**
```powershell
python app.py
```

✅ **Success**: Dikhega "Running on http://0.0.0.0:5001"

---

### 📍 STEP 2: Backend Start Karein

**Dusra naya PowerShell Terminal kholen:**

```powershell
cd "d:\FYP project 2\clone\Backend"
npm run dev
```

✅ **Success**: Dikhega "Server running on port 5000"

---

### 📍 STEP 3: Frontend Start Karein (Already Running)

**Teesra PowerShell Terminal:**

```powershell
cd "d:\FYP project 2\clone\frontend"
npm run dev
```

✅ **Success**: Dikhega "Local: http://localhost:5173"

---

## 🌐 Browser Mein Test Karein

1. Open: **http://localhost:5173**
2. Login karein
3. **AI Chatbot** page par jayein
4. Type karein: **"Hello"**
5. AI response milega! 🎉

---

## 📊 System Check

### ✅ Sab kuch sahi hai agar:

- [ ] 3 terminals chal rahe hain
- [ ] Terminal 1: "Running on port 5001"
- [ ] Terminal 2: "Server running on port 5000"  
- [ ] Terminal 3: "Local: http://localhost:5173"
- [ ] Browser mein frontend load ho raha hai
- [ ] Chatbot respond kar raha hai

---

## 🐛 Common Problems & Solutions

### Problem 1: "pip is not recognized"
```powershell
python -m pip install numpy nltk tensorflow flask flask-cors python-dotenv
```

### Problem 2: "Port already in use"
```powershell
# Find process
netstat -ano | findstr :5001

# Kill process (replace PID)
taskkill /PID <PID_NUMBER> /F
```

### Problem 3: "MySQL connection failed"
- MySQL start karein
- Backend/.env file check karein
- Database credentials verify karein

### Problem 4: Model training error
```powershell
# Try with specific TensorFlow version
pip install tensorflow==2.13.0
```

### Problem 5: Backend not connecting to Flask
- Check Flask terminal - running hona chahiye
- Check .env file: `CHATBOT_API_URL=http://localhost:5001/api/chat`
- Backend will use fallback responses if Flask is down

---

## 📁 Important Files

```
AI Chatbot model/
├── intents.json          ← Training data
├── train.py              ← Train model
├── app.py                ← Flask server
└── chatbot_model.h5      ← Trained model (generated)

Backend/
├── controller/chatController.js  ← Chat logic
├── .env                          ← Configuration
└── package.json                  ← Dependencies

frontend/
└── src/app/frontend/Pages/AI CHATBOT PAGE/
    └── AIChatbotPage.jsx         ← Chat UI
```

---

## 📚 Documentation Files

1. **RUN_STEP_BY_STEP.md** ← Detailed manual steps
2. **CHATBOT_SETUP_GUIDE.md** ← Complete setup guide
3. **QUICK_REFERENCE.md** ← Quick commands
4. **README.md** ← Project overview
5. **THIS FILE** ← Simple guide

---

## 🎯 Quick Commands

### Check if Python installed:
```powershell
python --version
```

### Check if Node.js installed:
```powershell
node --version
```

### Check if MySQL running:
```powershell
mysql --version
```

### Test Flask API:
```powershell
curl -X POST http://localhost:5001/api/chat -H "Content-Type: application/json" -d '{\"message\":\"Hello\"}'
```

---

## 🔄 Restart Services

Agar koi service crash ho jaye:

**Flask API:**
```powershell
cd "d:\FYP project 2\clone\AI Chatbot model"
python app.py
```

**Backend:**
```powershell
cd "d:\FYP project 2\clone\Backend"
npm run dev
```

**Frontend:**
```powershell
cd "d:\FYP project 2\clone\frontend"
npm run dev
```

---

## 💡 Pro Tips

1. **3 terminals chahiye** - Ek mein sab nahi chal sakta
2. **Order important** - Flask → Backend → Frontend
3. **MySQL running** hona chahiye pehle se
4. **Terminals band mat karein** - Running rehne dein
5. **Logs dekhein** - Errors samajhne ke liye

---

## ✅ Success Checklist

Sab kuch working hai agar:

- ✅ Flask API running (port 5001)
- ✅ Backend running (port 5000)
- ✅ Frontend running (port 5173)
- ✅ MySQL connected
- ✅ Browser mein login ho sakta hai
- ✅ Chatbot respond kar raha hai
- ✅ Messages database mein save ho rahe hain

---

## 🆘 Need Help?

1. Check terminal logs for errors
2. Read **RUN_STEP_BY_STEP.md** for detailed guide
3. Verify MySQL is running
4. Check all 3 services are running
5. Try restarting services

---

## 🎉 FINAL NOTES

**System Complete Hai!** ✅

Bas 3 terminals mein commands run karein aur chatbot ready hai!

**Terminals:**
1. Flask API (Python)
2. Backend (Node.js)
3. Frontend (React)

**Browser:**
- http://localhost:5173

**Enjoy your AI Travel Chatbot!** 🚀

---

**Created by**: Muhammad Faizan  
**Date**: January 7, 2026  
**Project**: FYP - Travel Management System
