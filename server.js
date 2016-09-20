var express = require('express');
var app = express();

//use routes defined in /routes folder
require('./routes/getProject')(app);
require('./routes/saveProject')(app);
require('./routes/getUsersProjects')(app);
require('./routes/deleteProject')(app);

//serve static files from current folder
app.use(express.static(__dirname + "/"));

//run server off localhost:3000
app.listen(3000);
console.log("Server running on port 3000");
