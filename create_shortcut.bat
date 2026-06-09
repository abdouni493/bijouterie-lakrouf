@echo off
pushd "%~dp0"
powershell -ExecutionPolicy Bypass -NoProfile -File "%~dp0create_shortcut.ps1" -IconFileName "whatsapp.ico" -ShortcutName "Bijouterie.lnk"
popd
pause
