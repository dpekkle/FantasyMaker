@echo on
del ".\dev.min.js"
java -jar compiler.jar --js *.js --jscomp_off=uselessCode --js_output_file dev.min.js
timeout 20