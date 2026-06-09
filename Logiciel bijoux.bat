@echo off
REM Run-app.bat: installs deps if needed and starts the dev server
pushd "%~dp0"
IF NOT EXIST "node_modules" (
  echo Installing dependencies...
  npm install
)
echo Ensure local CSS is built...
call npm run build:css
echo Starting development server in a new window...
start "Vite Dev" cmd /k "cd /d %~dp0 && npm run dev"
echo Waiting briefly for the server to start...
timeout /t 3 /nobreak >nul
echo Opening default browser to http://localhost:3000
start "" "http://localhost:3000"
popd
pause
