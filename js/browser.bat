@echo on
del ".\browser\browser.min.js"
set files=.\browser\*.js .\main\users.js
java -jar compiler.jar --js %files% --jscomp_off=uselessCode --js_output_file .\browser\browser.min.js
timeout 20