// JAVASCRIPT SERVER STUFF AND ALL THAT MAGIC GOES HERE
const express = require('express');
const bodyParser = require('body-parser');

// Requiring our models for syncing
// This is the pointer to the sequelize template 
var db = require("./models");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.static("public"));

require("./routes/html-routes.js")(app);
require("./routes/api-routes.js")(app); 

// app.listen(PORT, () => {
//     console.log("👽 app is listening on port: " + PORT);
// })

// Syncing our sequelize models and then starting our Express app
// =============================================================
db.sequelize.sync({ force: false }).then(function() {
    app.listen(PORT, function() {
        console.log("👽 app is listening on port: " + PORT);
    });
  });