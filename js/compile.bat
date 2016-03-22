@echo off
del ".\dev.min.js"
java -jar compiler.jar --js *.js --js_output_file dev.min.js
PAUSE