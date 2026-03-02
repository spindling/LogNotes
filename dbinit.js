const sqlite3 = require("sqlite3");
const sqlite = require("sqlite");
const fs = require("fs").promises;

async function dbinit()
{
  const db = await sqlite.open({
    filename: "notes.db",
    driver: sqlite3.Database
  });

 
  const plantsImage = await fs.readFile("./images/plants.jpg");
  const animalsImage = await fs.readFile("./images/animals.jpg");
  const mushroomsImage = await fs.readFile("./images/mushrooms.jpg");
  await db.exec("DROP TABLE IF EXISTS Notes");
  await db.exec("CREATE TABLE Notes (title TEXT, content TEXT, starred INTEGER, image BLOB, timestamp TEXT, charcount INTEGER)");

  await db.run("INSERT INTO Notes VALUES (?,?,?,?,?,?)", ['Plants', 'Plants are nice! Plants are the eukaryotic organisms that constitute the kingdom Plantae.', 1, plantsImage, '2024-02-26 02:02:02', 89 ] );
  await db.run("INSERT INTO Notes VALUES (?,?,?,?,?,?)", ['Animals', 'Animals are nice! Animals first appeared in the fossil record in the late Cryogenian period.', 0, animalsImage, '2024-02-23 02:02:01', 92 ] );
  await db.run("INSERT INTO Notes VALUES (?,?,?,?,?,?)", ['Mushrooms', 'Mushrooms are not nice! A mushroom is the fleshy, spore-bearing fruiting body of a fungus.', 1, mushroomsImage, '2024-02-21 02:02:00', 90 ] );

}

dbinit();