const express = require("express");
const cors = require("cors");
const pool = require("./db");
const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Start the server
app.listen(4000, () => {
  console.log("Server is running on http://localhost:4000");
});

// Routes
// Get all games
app.get("/", async (req, res) => {
  try {
    const allGames = await pool.query(
      "SELECT g.*, COUNT(r.id) AS review_count FROM games g LEFT JOIN reviews r ON g.name = r.app_name GROUP BY g.rank ORDER BY g.rank"
    );
    res.json(allGames.rows);
  } catch (err) {
    console.error(err.message);
  }
});

// Add a new game
app.post("/", async (req, res) => {
  const {
    rank,
    name,
    platform,
    year,
    genre,
    publisher,
    na_sales,
    eu_sales,
    jp_sales,
    other_sales,
    global_sales,
  } = req.body;

  try {
    const newGame = await pool.query(
      "INSERT INTO games (rank, name, platform, year, genre, publisher, na_sales, eu_sales, jp_sales, other_sales, global_sales) VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11) RETURNING *",
      [
        rank,
        name,
        platform,
        year,
        genre,
        publisher,
        na_sales,
        eu_sales,
        jp_sales,
        other_sales,
        global_sales,
      ]
    );
    res.status(200).json(newGame.rows[0]);
  } catch (err) {
    res.status(400).json({ message: err.message });
    console.error(err.message);
  }
});

// Get reviews for a specific game
app.get("/:name", async (req, res) => {
  try {
    const { name } = req.params;
    const gameReviews = await pool.query(
      `SELECT * FROM reviews WHERE reviews.app_name = '${name}'`
    );
    res.json(gameReviews.rows);
  } catch (err) {
    console.error(err.message);
  }
});

// Edit game info
app.put("/:rank", async (req, res) => {
  try {
    const rank = req.params.rank;
    const updatedGame = req.body;

    const response = await pool.query(
      "UPDATE games SET rank = $1, name = $2, platform = $3, year = $4, genre = $5, publisher = $6, na_sales = $7, eu_sales = $8, jp_sales = $9, other_sales = $10, global_sales = $11 WHERE rank = $12",
      [
        updatedGame.rank,
        updatedGame.name,
        updatedGame.platform,
        updatedGame.year,
        updatedGame.genre,
        updatedGame.publisher,
        updatedGame.na_sales,
        updatedGame.eu_sales,
        updatedGame.jp_sales,
        updatedGame.other_sales,
        updatedGame.global_sales,
        rank,
      ]
    );
    res.status(200).json(response);
  } catch (err) {
    res.status(400).json({ message: err.message });
    console.error(err.message);
  }
});

// Add a new review
app.post("/add-review", async (req, res) => {
  const { app_id, app_name, review_text, review_score, review_votes } =
    req.body;

  try {
    const newReview = await pool.query(
      "INSERT INTO reviews (app_id, app_name, review_text, review_score, review_votes) VALUES($1, $2, $3, $4, $5) RETURNING *",
      [app_id, app_name, review_text, review_score, review_votes]
    );
    res.status(200).json(newReview.rows[0]);
  } catch (err) {
    res.status(400).json({ message: err.message });
    console.error(err.message);
  }
});

// Delete a review
app.delete("/delete-review/:id", async (req, res) => {
  const id = req.params.id;

  try {
    const result = await pool.query("DELETE FROM reviews WHERE id = $1", [id]);
    res.status(200).json(result);
  } catch (err) {
    res.status(400).json({ message: err.message });
    console.error(err.message);
  }
});

// Edit a review
app.put("/edit-review/:id", async (req, res) => {
  try {
    const updatedReview = req.body;
    const response = await pool.query(
      "UPDATE reviews SET id = $1, app_id = $2, app_name = $3, review_text = $4, review_score = $5, review_votes = $6 WHERE id = $1",
      [
        updatedReview.id,
        updatedReview.app_id,
        updatedReview.app_name,
        updatedReview.review_text,
        updatedReview.review_score,
        updatedReview.review_votes,
      ]
    );
    res.status(200).json(response);
  } catch (err) {
    res.status(400).json({ message: err.message });
    console.error(err.message);
  }
});
