const express = require ("express");
const app = express();
const mustacheExpress = require("mustache-express");

const Model = require("./app.model.js");

app.engine("mustache", mustacheExpress());
app.set("view engine", "mustache");
app.set("views", __dirname + "/views");

Model.makeConnection(); //TODO make sure this runs before app.listen

app.get("/delete/:id", async function(req,res)
{
    await Model.deleteNote(req.params.id);
    const notesArray = await Model.getAllNotes();
    res.render("main_page", { notes: notesArray });
})


app.get("/style.css", function (req,res){
  res.sendFile( __dirname + "/style.css")
});

app.get("/", async function(req, res) {

    const notesArray = await Model.getAllNotes();
    res.render("main_page", { notes: notesArray });
});

app.listen(3000, () => {console.log("Server listening on port 3000...")});