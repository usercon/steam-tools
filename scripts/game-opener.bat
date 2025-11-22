@echo off
title 
color 08
mode con cols=40 lines=3
set /a var=1
:loop
start hl2.exe
timeout /t 10
taskkill /f /im "hl2.exe"
timeout /t 5 >nul
echo(
echo        started %var% times
set /a var+=1
goto loop
