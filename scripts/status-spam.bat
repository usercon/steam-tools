@echo off
title 
color 08
mode con: cols=35 lines=5
:start

choice /c:123 /n > nul
if errorlevel 3 goto AWAY
if errorlevel 2 goto INVISIBLE
if errorlevel 1 goto ONLINE

:LOOP
:ONLINE
rundll32 url.dll,FileProtocolHandler steam://friends/status/online

:INVISIBLE
rundll32 url.dll,FileProtocolHandler steam://friends/status/invisible

:AWAY
rundll32 url.dll,FileProtocolHandler steam://friends/status/away
goto LOOP
