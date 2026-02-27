const express = require ("express");
const app = express();
const mustacheExpress = require("mustache-express");

const Model = require("./app.model.js");

app.engine("mustache", mustacheExpress());
app.set("view engine", "mustache");
app.set("views", __dirname + "/views");

app.use( express.urlencoded({extended: false}) ); //makes form data available in req.body


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
    await Model.addNote(req.body.title, 
                         req.body.content,
                         req.body.starred,
                         req.body.image,
                         req.body.timestamp,
                         req.body.charcount);
    const notesArray = await Model.getAllNotes();
    res.render("main_page", { notes: notesArray });
});

app.post("/editnote/:id", async function(req,res)
{
    await Model.editNote(req.body.title, 
                         req.body.content,
                         req.body.starred,
                         req.body.image,
                         req.body.timestamp,
                         req.body.charcount,
                         req.params.id);

    const notesArray = await Model.getAllNotes();
    res.render("main_page", { notes: notesArray});
});

app.post("/replaceimage/:id", async function(req,res)
{
    await Model.editNote(req.body.image, req.params.id);
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

async function startServer()
{
    await Model.makeConnection();
    app.listen(3000, () => {console.log("Server listening on port 3000...")});
}

startServer();