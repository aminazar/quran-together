ng build -prod
cd ..\..\quran-together-server\public
del /f /q /s *
rmdir /s /q assets
xcopy "..\..\test-pics\quran-together-test version\dist\*" . /e /s /h
cd "..\..\test-pics\quran-together-test version"
