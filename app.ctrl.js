const express = require ("express");
const app = express();
const mustacheExpress = require("mustache-express");

app.engine("mustache", mustacheExpress());
app.set("view_engine", "mustache");
app.set("views", __dirname + "/views");

app.get("/", function(req, res) {

    res.send("TEST");
});

app.listen(3000, () => {console.log("Server listening on port 3000...")});