@echo off
set ROOT=%~dp0
start "ScamShield API" cmd.exe /k "cd /d %ROOT%server && npm.cmd run dev"
start "ScamShield Frontend" cmd.exe /k "cd /d %ROOT%client && npm.cmd run dev -- --host 127.0.0.1"
exit /b
