@echo off
setlocal
echo =======================================================
echo   MANAKSETU: From Requirement to the Right Standard
echo   Starting FastAPI Backend and Vite Frontend...
echo =======================================================

REM Verify Python is available
where python >nul 2>nul
if %errorlevel% neq 0 (
    echo [ERROR] Python was not found in your system PATH.
    echo Please install Python 3.10+ and ensure it is added to PATH.
    pause
    exit /b 1
)

REM Verify Node.js is available
where npm >nul 2>nul
if %errorlevel% neq 0 (
    echo [ERROR] npm / Node.js was not found in your system PATH.
    echo Please install Node.js 18+ and ensure npm is added to PATH.
    pause
    exit /b 1
)

REM Start Backend in separate window
start "ManakSetu Backend (FastAPI)" cmd /k "cd /d "%~dp0backend" && python -m uvicorn app.main:app --host 127.0.0.1 --port 8000 --reload"

REM Start Frontend in separate window
start "ManakSetu Frontend (Vite)" cmd /k "cd /d "%~dp0frontend" && npm run dev"

echo.
echo Both servers have been launched in separate windows!
echo - Frontend UI:  http://localhost:5173
echo - Backend API:  http://127.0.0.1:8000
echo - Swagger Docs: http://127.0.0.1:8000/docs
echo =======================================================
endlocal
