const sqlite3 = require("sqlite3");
const sqlite = require("sqlite");

async function dbinit()
{
  const db = await sqlite.open({
    filename: "notes.db",
    driver: sqlite3.Database
  });

  await db.exec("DROP TABLE IF EXISTS Notes");
  await db.exec("CREATE TABLE Notes (title TEXT, content TEXT, starred INTEGER, image BLOB, timestamp TEXT, charcount INTEGER)");

  await db.run("INSERT INTO Notes VALUES (?,?,?,?,?,?)", ['Plants', 'Plants are nice!', 1, '', '2024-02-26 02:02:02', 16 ] );
  await db.run("INSERT INTO Notes VALUES (?,?,?,?,?,?)", ['Animals', 'Animals are nice!', 0, '', '2024-02-23 02:02:01', 17 ] );
  await db.run("INSERT INTO Notes VALUES (?,?,?,?,?,?)", ['Mushrooms', 'Mushrooms are not nice!', 1, '', '2024-02-21 02:02:00', 24 ] );

}

dbinit();