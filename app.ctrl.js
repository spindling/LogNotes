const express = require ("express");
const app = express();
const mustacheExpress = require("mustache-express");

const Model = require("./app.model.js");

app.engine("mustache", mustacheExpress());
app.set("view engine", "mustache");
app.set("views", __dirname + "/views");

app.use( express.urlencoded({extended: false}) ); //makes form data available in req.body

Model.makeConnection(); //TODO make sure this runs before app.listen

app.get("/deletenote/:id", async function(req,res)
{
    await Model.deleteNote(req.params.id);
    const notesArray = await Model.getAllNotes();
    res.render("main_page", { notes: notesArray });
})

app.get("/addnoteform", async function(req,res)
{
    const notesArray = await Model.getAllNotes();
    res.render("main_page", { notes: notesArray, addNote: true });
});

app.get("/editnoteform/:id", async function(req,res)
{
    const notesArray = await Model.getAllNotes();

     //filtering by rowid
    res.render("main_page", { notes: notesArray, 
                                formdata: notesArray.find((x) => x.rowid == req.params.id),
                                editNote: true });
});

app.post("/addnote", async function(req,res)
{
    await Model.addNote(req.body);
    const notesArray = await Model.getAllNotes();
    res.render("main_page", { notes: notesArray });
});

app.post("/editnote/:id", async function(req,res)
{
    await Model.editNote(req.body, req.params.id);
    const notesArray = await Model.getAllNotes();
    res.render("main_page", { notes: notesArray});
});

app.get("/style.css", function (req,res){
  res.sendFile( __dirname + "/style.css")
});

app.get("/", async function(req, res) {

    const notesArray = await Model.getAllNotes();
    res.render("main_page", { notes: notesArray });
});

app.listen(3000, () => {console.log("Server listening on port 3000...")});