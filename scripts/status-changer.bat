@echo off
title 
color 08
mode con: cols=30 lines=15
:start
echo.
echo     (1) = ONLINE
echo     (2) = INVISIBLE
echo     (3) = AWAY
echo     (4) = LOOKING TO TRADE
echo     (5) = LOOKING TO PLAY
echo     (6) = BUSY
echo     (7) = OFFLINE
echo.
echo     (S) = START STEAM
echo     (X) = EXIT STEAM
echo.
echo     (P) = MY PROFILE
echo.

:: "LOOKING TO PLAY"
:: "LOOKING TO TRADE"
:: "BUSY"
:: ----------------------------
:: ARE NO LONGER A THING (2017)

choice /c:1234567SXP /n > nul
if errorlevel 10 goto PROFILE
if errorlevel 9 goto EXIT
if errorlevel 8 goto START
if errorlevel 7 goto OFFLINE
if errorlevel 6 goto BUSY
if errorlevel 5 goto LOOKING_TO_PLAY
if errorlevel 4 goto LOOKING_TO_TRADE
if errorlevel 3 goto AWAY
if errorlevel 2 goto INVISIBLE
if errorlevel 1 goto ONLINE

:ONLINE
rundll32 url.dll,FileProtocolHandler steam://friends/status/online
cls
goto start

:INVISIBLE
rundll32 url.dll,FileProtocolHandler steam://friends/status/invisible
cls
goto start

:AWAY
rundll32 url.dll,FileProtocolHandler steam://friends/status/away
cls
goto start

:LOOKING_TO_TRADE
rundll32 url.dll,FileProtocolHandler steam://friends/status/trade
cls
goto start

:LOOKING_TO_PLAY
rundll32 url.dll,FileProtocolHandler steam://friends/status/play
cls
goto start

:BUSY
rundll32 url.dll,FileProtocolHandler steam://friends/status/busy
cls
goto start

:OFFLINE
rundll32 url.dll,FileProtocolHandler steam://friends/status/offline
cls
goto start

:START
rundll32 url.dll,FileProtocolHandler steam://start
cls
goto start

:EXIT
taskkill /f /IM "steam.exe"
cls
goto start

:PROFILE
rundll32 url.dll,FileProtocolHandler steam://openurl/https://steamcommunity.com/my
rundll32 url.dll,FileProtocolHandler https://steamcommunity.com/my
cls
goto start
