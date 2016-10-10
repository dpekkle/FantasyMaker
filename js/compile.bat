@echo on
del ".\main\dev.min.js"
set files=.\main\*.js .\play\playgame.js
java -jar compiler.jar --js %files% --jscomp_off=uselessCode --js_output_file .\main\dev.min.js
timeout 20
