@echo off
echo ========================================
echo AI Chatbot - Simple Test
echo ========================================
echo.

echo Checking Python...
python --version
if %errorlevel% neq 0 (
    echo ERROR: Python not found! Please install Python 3.8+
    pause
    exit /b 1
)
echo Python OK!
echo.

echo Checking Node.js...
node --version
if %errorlevel% neq 0 (
    echo ERROR: Node.js not found! Please install Node.js 16+
    pause
    exit /b 1
)
echo Node.js OK!
echo.

echo Checking MySQL...
mysql --version
if %errorlevel% neq 0 (
    echo WARNING: MySQL command not found in PATH
    echo Make sure MySQL is installed and running
)
echo.

echo ========================================
echo All prerequisites checked!
echo ========================================
echo.
echo Next steps:
echo.
echo 1. Open 3 PowerShell terminals
echo.
echo 2. Terminal 1 - Flask API:
echo    cd "d:\FYP project 2\clone\AI Chatbot model"
echo    pip install numpy nltk tensorflow flask flask-cors python-dotenv
echo    python train.py
echo    python app.py
echo.
echo 3. Terminal 2 - Backend:
echo    cd "d:\FYP project 2\clone\Backend"
echo    npm run dev
echo.
echo 4. Terminal 3 - Frontend:
echo    cd "d:\FYP project 2\clone\frontend"
echo    npm run dev
echo.
pause
