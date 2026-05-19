@echo off
echo Starting AI Chatbot System...
echo.

start "Flask API" cmd /k "cd /d "%~dp0AI Chatbot model" && python app.py"
timeout /t 3 /nobreak >nul

start "Node.js Backend" cmd /k "cd /d "%~dp0Backend" && npm run dev"
timeout /t 3 /nobreak >nul

start "Frontend" cmd /k "cd /d "%~dp0frontend" && npm run dev"

echo.
echo All services started!
echo Check the opened terminal windows for status.
echo.
echo Press any key to exit this window...
pause
