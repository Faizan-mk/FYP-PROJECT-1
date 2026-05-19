@echo off
echo ========================================
echo AI Chatbot Setup Script
echo ========================================
echo.

echo Step 1: Installing Python dependencies...
cd "AI Chatbot model"
pip install -r requirements.txt
if %errorlevel% neq 0 (
    echo Error: Failed to install Python dependencies
    pause
    exit /b 1
)
echo.

echo Step 2: Building travel knowledge base (20k+ Q&A)...
python faq_builder.py
if %errorlevel% neq 0 (
    echo Error: Failed to build FAQ knowledge base
    pause
    exit /b 1
)
echo.

echo Step 3: Training the chatbot model...
echo This may take 5-10 minutes...
python train.py
if %errorlevel% neq 0 (
    echo Error: Failed to train model
    pause
    exit /b 1
)
echo.

echo Step 4: Installing Node.js backend dependencies...
cd ..\Backend
npm install
if %errorlevel% neq 0 (
    echo Error: Failed to install backend dependencies
    pause
    exit /b 1
)
echo.

echo ========================================
echo Setup Complete!
echo ========================================
echo.
echo To run the chatbot system, you need to start 3 services:
echo.
echo 1. Flask API (Python):
echo    cd "AI Chatbot model"
echo    python app.py
echo.
echo 2. Node.js Backend:
echo    cd Backend
echo    npm run dev
echo.
echo 3. Frontend:
echo    cd frontend
echo    npm run dev
echo.
echo Press any key to exit...
pause
