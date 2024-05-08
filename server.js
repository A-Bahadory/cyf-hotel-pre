const express = require("express");
const app = express();
port = 3000;
const { Pool } = require("pg");

const db = new Pool({
  user: "Damoon",
  host: "localhost",
  database: "cyf_hotel",
  password: "",
  post: 5432,
});

app.get("/customers", (req, res) => {
  db.query("SELECT name FROM customers")
    .then((result) => {
      res.json(result.rows);
    })
    .catch((error) => {
      console.log(error);
    });
});

app.get("/customers/address", async (_, res) => {
  try {
    const data = await db.query("SELECT address FROM customers");

    res.status(200).send(data.rows);
  } catch (error) {
    console.error("Error fetching videos:", error);
    res.status(500).json({
      error: {
        message: "Internal Server Error",
        type: "Database Error",
      },
    });
  }
});

app.listen(port, () => {
  console.log(`server listening on port ${port}`);
});
