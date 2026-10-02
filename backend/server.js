const express = require("express");
const cors = require("cors");
const Database = require("better-sqlite3");


const app = express();
const PORT = 3000;

//Crear la base de datos//
const db = new Database("database.sqlite");
db.prepare(`
  CREATE TABLE IF NOT EXISTS games (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    genre TEXT NOT NULL,
    platform TEXT NOT NULL
  )
`).run();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.json({ message: "Game API funcionando" });
});

//API GET//
app.get("/api/games", (req, res) => {
    try {

  const { genre } = req.query;
  const { platform } = req.query; 
  const { search } = req.query;
  const { sort } = req.query;
  const { order } = req.query;
  const { limit } = req.query;

  let sql = "SELECT * FROM games";
  //Array//
  let params = [];
  
  if (search) {
    sql += " WHERE title LIKE ?";
    params.push(`%${search}%`);
  }

  

  if (genre) {
    sql += " WHERE LOWER(genre) = LOWER(?)";
    params.push(genre);
  }


  if (platform) {
    if (genre) {
      sql += " AND LOWER(platform) = LOWER(?)";
    } else {
      sql += " WHERE LOWER(platform) = LOWER(?)";
    }
    params.push(platform);
  }  

  if (sort === "title") {

    if (order === "asc") {
      sql += " ORDER BY title ASC";
    } else {
      sql += " ORDER BY title DESC";
    } 
  }
  
  if (sort === "genre") {

  if (order === "asc") {
    sql += " ORDER BY genre ASC";
  } else {
    sql += " ORDER BY genre DESC";
  }
}

  if (sort === "platform") {

  if (order === "asc") {
    sql += " ORDER BY platform ASC";
  } else {
    sql += " ORDER BY platform DESC";
  }
}

if (limit) {
  sql += " LIMIT ?";
  params.push(Number(limit));
}

  const games = db.prepare(sql).all(...params);

  res.json(games);
  } catch (error) {
    console.error("Internal server error", error);
    res.status(500).json({ message: "Internal server error" 
    });
  }
});
//API GET ID//
app.get("/api/games/:id", (req, res) => {
    try {
  const game = db
    .prepare("SELECT * FROM games WHERE id = ?")
    .get(req.params.id);

  if (!game) {
    return res.status(404).json({ error: "Videojuego no encontrado" });
  }

  res.json(game);
  } catch (error) {
    console.error("Internal server error:", error);
    res.status(500).json({ 
      message: "Internal server error" });
  }
});

//API POST//
app.post("/api/games", (req, res) => {
    try {
  const { title, genre, platform } = req.body;
  
  //Validar//
  if (!title || !genre || !platform) {
    return res.status(400).json({
      message: "Title, genre and platform are required"
    });
  }
  const result = db.prepare(`
    INSERT INTO games (title, genre, platform)
    VALUES (?, ?, ?)
  `).run(title, genre, platform);

  res.status(201).json({
    id: result.lastInsertRowid,
    title,
    genre,
    platform
  });
  } catch (error) {
    console.error("Internal server error:", error);
    res.status(500).json({ 
      message: "Internal server error" });
  }
});

//API PUT//
app.put("/api/games/:id", (req, res) => {
    try {
    const { title, genre, platform } = req.body;
    
  //Validar//
  if (!title || !genre || !platform) {
    return res.status(400).json({
      message: "Title, genre and platform are required"
    });
  }
    const updateGame = db.prepare(`
    UPDATE games
    SET title = ?, genre = ?, platform = ?
    WHERE id = ?
  `);

  const result = updateGame.run(
    title,
    genre,
    platform,
    req.params.id
  );

  if (result.changes === 0) {
    return res.status(404).json({
        message: "Game not found"
    });
  }

  res.json({
    id: req.params.id,
    title,
    genre,
    platform
  });
  } catch (error){
    console.error("Internal server error:", error);
    res.status(500).json({ 
      message: "Internal server error" });
  }
});

//API DELETE//
app.delete("/api/games/:id", (req, res) => {
    try {

    const deleteGame = db.prepare(`
        DELETE FROM games WHERE id = ?
    `);

    const result = deleteGame.run(
        req.params.id
    );

    if (result.changes === 0) {
    return res.status(404).json({
        message: "Game not found"
    });
  }

  res.json({
    message: "Game deleted"
  });
} catch (error){
    console.error("Internal server error:", error);
    res.status(500).json({ 
      message: "Internal server error" });
  }
});

app.listen(PORT, () => {
  console.log(`Servidor ejecutándose en http://localhost:${PORT}`);
});