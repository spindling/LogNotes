const express = require ("express");
const app = express();
const mustacheExpress = require("mustache-express");

const Model = require("./app.model.js");

app.engine("mustache", mustacheExpress());
app.set("view_engine", "mustache");
app.set("views", __dirname + "/views");

Model.makeConnection(); //TODO make sure this runs before app.listen

app.get("/", async function(req, res) {

    const notesArray = await Model.getAllNotes();

    const TPL = { notes: notesArray };
    res.render("main_page", TPL);
});

app.listen(3000, () => {console.log("Server listening on port 3000...")});