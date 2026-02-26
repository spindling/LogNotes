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
module.exports = { makeConnection, getAllNotes};