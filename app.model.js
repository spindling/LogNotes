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

async function addNote(data) 
{
    await db.run("INSERT INTO Notes VALUES (?,?,?,?,?,?)",
        [data.title, data.content, data.starred, data.image, data.timestamp, data.charcount]);
}

async function editNote(data, id) 
{
    await db.run("UPDATE Notes SET title=?, content=?, starred=?, image=?, timestamp=?, charcount=? WHERE rowid=?",
        [data.title, data.content, data.starred, data.image, data.timestamp, data.charcount, id]);
}

module.exports = { makeConnection, getAllNotes, deleteNote, addNote, editNote};