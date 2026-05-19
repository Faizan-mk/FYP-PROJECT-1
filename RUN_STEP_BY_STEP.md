# 🚀 Step-by-Step Manual Run Guide

Agar automated scripts kaam nahi kar rahe, toh manually ye steps follow karein:

## ✅ Step 1: Python Dependencies Install Karein

### Terminal 1 mein:
```powershell
cd "d:\FYP project 2\clone\AI Chatbot model"
pip install -r requirements.txt
```

**Wait**: 2-3 minutes (packages install honge)

## ✅ Step 2: AI Model Train Karein

### Same Terminal 1 mein:
```powershell
python train.py
```

**Wait**: 5-10 minutes (model train hoga)

**Output**: Aapko ye dikhega:
- "Training model..."
- Progress bars
- "Model trained and saved successfully!"

**Files Generated**:
- `chatbot_model.h5`
- `words.pkl`
- `classes.pkl`

## ✅ Step 3: Flask API Start Karein

### Same Terminal 1 mein:
```powershell
python app.py
```

**Expected Output**:
```
Starting Flask chatbot server on port 5001...
 * Running on http://0.0.0.0:5001
```

**✋ IMPORTANT**: Is terminal ko band mat karein! Running rehne dein.

## ✅ Step 4: Backend Dependencies Install Karein

### Terminal 2 (naya) mein:
```powershell
cd "d:\FYP project 2\clone\Backend"
npm install
```

**Wait**: 1-2 minutes

## ✅ Step 5: Backend Start Karein

### Same Terminal 2 mein:
```powershell
npm run dev
```

**Expected Output**:
```
Server running on port 5000
Database connected successfully
```

**✋ IMPORTANT**: Is terminal ko bhi running rehne dein!

## ✅ Step 6: Frontend Start Karein

### Terminal 3 (naya) mein:
```powershell
cd "d:\FYP project 2\clone\frontend"
npm run dev
```

**Expected Output**:
```
VITE ready in XXX ms
Local: http://localhost:5173
```

**✋ IMPORTANT**: Ye bhi running rehne dein!

## 🎯 Ab Test Karein

1. **Browser mein open karein**: http://localhost:5173
2. **Login karein** apne account se
3. **AI Chatbot page** par jayein
4. **Message type karein**: "Hello"
5. **Response milega**: AI se reply aayega!

## 🔍 Verification Checklist

Har step ke baad check karein:

### ✅ After Step 1:
```powershell
# Check if packages installed
pip list | Select-String "tensorflow|nltk|flask"
```

### ✅ After Step 2:
```powershell
# Check if model files exist
ls "d:\FYP project 2\clone\AI Chatbot model\chatbot_model.h5"
ls "d:\FYP project 2\clone\AI Chatbot model\words.pkl"
ls "d:\FYP project 2\clone\AI Chatbot model\classes.pkl"
```

### ✅ After Step 3:
```powershell
# Test Flask API (naye terminal mein)
curl -X POST http://localhost:5001/api/chat -H "Content-Type: application/json" -d '{\"message\":\"Hello\"}'
```

### ✅ After Step 5:
```powershell
# Check backend health (naye terminal mein)
curl http://localhost:5000
```

### ✅ After Step 6:
- Browser mein http://localhost:5173 open hona chahiye

## 🐛 Common Errors & Solutions

### Error 1: "pip is not recognized"
**Solution**:
```powershell
python -m pip install -r requirements.txt
```

### Error 2: "Python not found"
**Solution**: Python install karein from python.org (3.8+)

### Error 3: "Port 5001 already in use"
**Solution**:
```powershell
# Find and kill process
netstat -ano | findstr :5001
taskkill /PID <PID_NUMBER> /F
```

### Error 4: "MySQL connection failed"
**Solution**:
- MySQL start karein
- `.env` file check karein
- Database credentials verify karein

### Error 5: "Module not found"
**Solution**:
```powershell
# Backend
cd Backend
npm install

# Frontend
cd frontend
npm install
```

## 📊 Expected Terminal States

### Terminal 1 (Flask):
```
 * Serving Flask app 'app'
 * Running on http://0.0.0.0:5001
 * Press CTRL+C to quit
```

### Terminal 2 (Backend):
```
[nodemon] starting `node server.js`
Server running on port 5000
Database connected successfully
```

### Terminal 3 (Frontend):
```
VITE v5.x.x ready in XXX ms
➜  Local:   http://localhost:5173/
➜  Network: use --host to expose
```

## 🎯 Quick Commands Reference

### Stop All Services:
- Terminal 1: `Ctrl + C`
- Terminal 2: `Ctrl + C`
- Terminal 3: `Ctrl + C`

### Restart Individual Service:
```powershell
# Flask
cd "d:\FYP project 2\clone\AI Chatbot model"
python app.py

# Backend
cd "d:\FYP project 2\clone\Backend"
npm run dev

# Frontend
cd "d:\FYP project 2\clone\frontend"
npm run dev
```

## 📝 Notes

1. **3 Terminals chahiye**: Ek hi terminal mein sab nahi chal sakta
2. **Order important hai**: Flask → Backend → Frontend
3. **MySQL running hona chahiye**: Backend start hone se pehle
4. **Ports free hone chahiye**: 5000, 5001, 5173

## ✅ Success Indicators

Sab kuch sahi chal raha hai agar:
- ✅ 3 terminals running hain
- ✅ Koi error nahi dikha raha
- ✅ Browser mein frontend load ho raha hai
- ✅ Login kar sakte hain
- ✅ Chatbot respond kar raha hai

## 🆘 Still Having Issues?

1. Check all terminals for error messages
2. Verify MySQL is running
3. Check `.env` file in Backend folder
4. Ensure all ports are free
5. Try restarting all services

---

**Pro Tip**: Har terminal ko alag window mein rakhein taake sab logs dikh sakein!
