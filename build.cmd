@echo off
ng build -prod
cd ..\..\quran-together-server\public
del /f /q /s *
rmdir /s /q assets
xcopy ..\..\..\quran-together-test version\dist\* . /e /s /h
cd ..\..\..\quran-together-test version
