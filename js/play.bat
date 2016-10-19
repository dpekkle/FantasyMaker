@echo on
del ".\play\play.min.js"
CALL .\compile.bat
set files=.\main\dev.min.js .\play\show.js .\play\play_httpRequests.js
java -jar compiler.jar --js %files% --jscomp_off=uselessCode --js_output_file .\play\play.min.js
timeout 20
