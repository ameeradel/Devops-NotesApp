const express = require("express");
const { Pool } = require("pg");

const app = express();
app.use(express.json());

const PORT = process.env.PORT || 3000;

const pool = new Pool({
  host: process.env.DB_HOST || "db",
  port: Number(process.env.DB_PORT) || 5432,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

async function connectWithRetry(retries = 10, delayMs = 3000) {
  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      const client = await pool.connect();
      console.log("Connected to PostgreSQL");
      client.release();
      return;
    } catch (error) {
      console.error(
        `Database connection failed (attempt ${attempt}/${retries}):`,
        error.message
      );

      if (attempt === retries) {
        throw error;
      }

      await new Promise((resolve) => setTimeout(resolve, delayMs));
    }
  }
}

app.get("/health", async (req, res) => {
  try {
    const result = await pool.query("SELECT 1");
    res.status(200).json({
      status: "ok",
      database: result.rowCount === 1 ? "up" : "unknown",
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      database: "down",
      message: error.message,
    });
  }
});

app.post("/notes", async (req, res) => {
  try {
    const { title, content } = req.body;

    if (!title || !content) {
      return res.status(400).json({
        error: "title and content are required",
      });
    }

    const query = `
      INSERT INTO notes (title, content)
      VALUES ($1, $2)
      RETURNING id, title, content, created_at
    `;

    const values = [title, content];
    const result = await pool.query(query, values);

    return res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error("Error creating note:", error.message);
    return res.status(500).json({
      error: "internal server error",
    });
  }
});

app.get("/notes", async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT id, title, content, created_at
      FROM notes
      ORDER BY id DESC
    `);

    return res.status(200).json(result.rows);
  } catch (error) {
    console.error("Error fetching notes:", error.message);
    return res.status(500).json({
      error: "internal server error",
    });
  }
});

async function startServer() {
  try {
    await connectWithRetry();
    app.listen(PORT, "0.0.0.0", () => {
      console.log(`Server is running on port ${PORT}`);
    });
  } catch (error) {
    console.error("Failed to start server:", error.message);
    process.exit(1);
  }
}

startServer();