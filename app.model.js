const sqlite3 = require("sqlite3").verbose();
const sqlite = require("sqlite");

let db; 

async function makeConnection()
{
    db = await sqlite.open({
        filename: "notes.db",
        driver: sqlite3.Database
    });
}

async function getAllNotes()
{
    const results = await db.all("SELECT rowid, * FROM Notes");
    return results;
}

async function deleteNote(id)
{
    await db.run("DELETE FROM Notes WHERE rowid=?", [id]);
}

async function addNote(title, content, starred, image, timestamp, charcount) 
{
    await db.run("INSERT INTO Notes VALUES (?,?,?,?,?,?)",
        [title, content, starred, image, timestamp, charcount]);
}

async function editNote(title, content, starred, charcount, id) 
{
    await db.run("UPDATE Notes SET title=?, content=?, starred=?, charcount=? WHERE rowid=?",
        [title, content, starred, charcount, id]);
}

async function replaceImage(image, id)
{
    await db.run("UPDATE Notes SET image=? WHERE rowid=?",
        [image, id]);
    
}
async function deleteImage(id)
{
    await db.run("UPDATE Notes SET image=null WHERE rowid=?",
        [id]);
    
}

async function resetDatabase()
{
    await db.exec("DROP TABLE IF EXISTS Notes");
    await db.exec("CREATE TABLE Notes (title TEXT, content TEXT, starred INTEGER, image BLOB, timestamp TEXT, charcount INTEGER)");

}

async function sortDatabase(sortby, order)
{
    const select_statement = "SELECT rowid, * FROM Notes ORDER BY " + sortby + " " + order;
    const results = await db.all(select_statement);
    return results;
}

async function filterDatabase(checked)
{
   // const select_statement = ""+ checked;
    const results = await db.all("SELECT rowid, * FROM Notes  WHERE starred=?",[checked]);
    return results;
}

function checkNoteErrors(title, content)
{
    const errors = [];
     if (title.length > 30 || title.length < 1){
        errors.push({message: "Title must be between 1-30 characters in length."})
    }
    if (content.length > 200 || content.length < 1){
        errors.push({message: "Content must be between 1-200 characters"});
    }

    return errors;

}

async function loadImage(rowid)
{
    const result = await db.get("SELECT image FROM Notes WHERE rowid=?",[rowid]);
    return result;
}

module.exports = { makeConnection, getAllNotes, deleteNote, addNote, editNote, replaceImage, deleteImage, resetDatabase, sortDatabase,filterDatabase, checkNoteErrors, loadImage};