@echo on
del ".\index.min.js"
set files=.\main\http_loginSignup.js .\main\loginSignup.js .\main\prompts.js .\main\users.js .\main\host.js .\main\navigation.js .\main\hotkeys.js .\index\indexMain.js
java -jar compiler.jar --js %files% --jscomp_off=uselessCode --js_output_file .\index.min.js
timeout 20
