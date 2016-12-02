var express = require('express');

var app = express();

//use routes defined in /routes folder
require('./routes/getProject')(app);
require('./routes/saveProject')(app);
require('./routes/getUsersProjects')(app);
require('./routes/deleteProject')(app);
require('./routes/signUp')(app);
require('./routes/login')(app);
require('./routes/play')(app);
require('./routes/playAuth')(app);
require('./routes/getAllUsersProjects')(app)
require('./routes/validateToken')(app)
require('./routes/publish')(app)

//serve static files from current folder
app.use(express.static(__dirname + "/"));

//run server off localhost:3000
app.listen(3000);
console.log("Server running on port 3000");
