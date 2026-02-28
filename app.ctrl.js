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
    const title = req.body.title;
    const content = req.body.content;
    const starred = req.body.starred;
    const timestamp = req.body.timestamp;

    const errors = Model.checkNoteErrors(title, content);
    //set error messages
      
   
    //if errors are not present, add note 
    let errorsPresent = (errors.length == 0) ? false: true;
    if (!errorsPresent)
    {
        await Model.addNote(title,
                        content,
                        starred,
                        timestamp);
    }
    
    const notesArray = await Model.getAllNotes();
    res.render("main_page", { notes: notesArray, errors: errors, errorbox: errorsPresent });
});

app.post("/editnote/:id", async function(req,res)
{
    const title = req.body.title;
    const content = req.body.content;
    const starred = req.body.starred;

    await Model.editNote(title, 
                         content,
                         starred,
                         req.params.id);

    const notesArray = await Model.getAllNotes();
    res.render("main_page", { notes: notesArray});
});

app.get("/replaceimageform/:id", async function(req,res)
{
 
    const notesArray = await Model.getAllNotes();

    res.render("main_page", { notes: notesArray, 
                                formdata: notesArray.find((x) => x.rowid == req.params.id),
                                replaceImage: true });
}); 

app.post("/replaceimage/:id", async function(req,res)
{
    await Model.replaceImage(req.body.image,
                         req.params.id);

    const notesArray = await Model.getAllNotes();
    res.render("main_page", { notes: notesArray});
});

app.get("/deleteimage/:id", async function(req,res)
{
    await Model.deleteImage(req.params.id);
    const notesArray = await Model.getAllNotes();
    res.render("main_page", { notes: notesArray});
});
 
app.get("/resetdatabase", async function(req,res)
{
    await Model.resetDatabase();
    const notesArray = await Model.getAllNotes();
    res.render("main_page", { notes: notesArray });
});

app.get("/sort", async function(req,res)
{   
    const sortby = req.query.sortby;
    const order = req.query.order;
    //Allow for sort options to remain checked on radio buttons after submit 
    let order_ascend = (order=="ASC") ? true: false;
    let order_descend= (order=="DESC") ? true: false;
    let sort_title = (sortby=="title") ? true: false;
    let sort_date = (sortby=="timestamp") ? true: false;
    let sort_charcount = (sortby=="charcount") ? true: false;
    
    const sortedNotes = await Model.sortDatabase(sortby, order);
    //res.send(req.query);
    res.render("main_page", { notes: sortedNotes, 
                              sortascend: order_ascend,
                              sortdescend: order_descend,
                              sorttitle: sort_title,
                              sortdate: sort_date,
                              sortcharcount: sort_charcount
                                 });
});

app.get("/filter", async function(req,res)
{   
    let checked = false;
    let notesArray = null;
    if (req.query.starred=="on")
        {  checked = true
            notesArray = await Model.filterDatabase(checked);
        }
    else
        {
            notesArray = await Model.getAllNotes();
        };
    
    //res.send(req.query);
    res.render("main_page", { notes: notesArray, checked: checked

     });
})//


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