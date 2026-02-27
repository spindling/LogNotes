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

async function editNote(title, content, starred, id) 
{
    await db.run("UPDATE Notes SET title=?, content=?, starred=?, image=?, timestamp=?, charcount=? WHERE rowid=?",
        [title, content, starred, id]);
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


module.exports = { makeConnection, getAllNotes, deleteNote, addNote, editNote, replaceImage, deleteImage, resetDatabase};