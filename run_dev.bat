@echo off
echo =======================================================
echo   MANAKSETU: From Requirement to the Right Standard
echo   Starting FastAPI Backend and Vite Frontend...
echo =======================================================

set "PATH=D:\JIET\Node;%PATH%"

start "ManakSetu Backend (FastAPI)" cmd /k "cd /d "%~dp0backend" && python -m uvicorn app.main:app --host 127.0.0.1 --port 8000 --reload"

start "ManakSetu Frontend (Vite)" cmd /k "cd /d "%~dp0frontend" && npm run dev"

echo.
echo Both servers have been launched in separate windows!
echo - Frontend UI:  http://localhost:5173
echo - Backend API:  http://127.0.0.1:8000
echo - Swagger Docs: http://127.0.0.1:8000/docs
echo =======================================================
