@echo on
del ".\index.min.js"
set files=.\main\http_loginSignup.js .\main\loginSignup.js .\main\prompts.js
java -jar compiler.jar --js %files% --jscomp_off=uselessCode --js_output_file .\index.min.js
timeout 20
