import express from "express";
import pg from "pg";
import "dotenv/config";

const app = express();
const port = process.env.PORT;
const { Pool } = pg;

import bodyParser from "body-parser";
app.use(bodyParser.json());

const db = new Pool({
  user: process.env.USER,
  host: process.env.HOST,
  database: process.env.DATABASE,
  password: process.env.PASSWORD,
  port: process.env.DB_PORT,
});

app.get("/customers", (req, res) => {
  db.query("SELECT * FROM customers")
    .then((result) => {
      res.json(result.rows);
      console.log(result);
    })
    .catch((error) => {
      console.log(error);
    });
});
// get by id
app.get("/customers/:id", function (req, res) {
  const custId = parseInt(req.params.id);
  db.query("SELECT * FROM customers WHERE id = $1", [custId])
    .then((result) => {
      res.status(200).send(result.rows);
    })
    .catch((error) => {
      console.log(error);
      res.status(500).json({
        error: {
          message: "internal server error",
          type: "database error",
        },
      });
    });
});

// find all customers with same first name

app.get("/customers/:name", (req, res) => {
  const customersName = req.params.name;
  db.query("SELECT * FROM customers WHERE lower(name) LIKE $1 || '%'", [
    customersName,
  ]).then((result) => res.send(result.rows));
});

// SQL COMMAND = SELECT * FROM customers WHERE lower(name) LIKE 'su%';
// WITHOUT SQL INJECTION PREVENTION = `SELECT * FROM customers WHERE lower(name) LIKE ${customersName%}`
// WITH SQL INJECTION PREVENTION = "SELECT * FROM customers WHERE lower(name) LIKE $1 || %"

//get by city
app.get("/customers/by_city/:city", (req, res) => {
  const custCity = req.params.city;
  db.query("SELECT * FROM customers WHERE city LIKE $1 || '%'", [custCity])
    .then((result) => {
      res.status(200).send(result.rows);
    })
    .catch((error) => {
      console.log(error);
      res.status(500).json({
        error: {
          message: "internal server error",
          type: "database error",
        },
      });
    });
});
// test endpoint using try and catch method
app.get("/customers/address", async (req, res) => {
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

//post endpoint
app.post("/customers", (req, res) => {
  const name = req.body.name;
  const email = req.body.email;
  const phone = req.body.phone;
  const address = req.body.address;
  const city = req.body.city;
  const postCode = req.body.postcode;
  const country = req.body.country;

  const query = `INSERT INTO customers(name, email, phone, address, city, postcode,country)VALUES($1,$2,$3,$4,$5,$6,$7)`;
  db.query(query, [name, email, phone, address, city, postCode, country])
    .then(() => {
      res.status(200).send("created a new customer was successfully !");
    })
    .catch((error) =>
      res.status(500).json({
        error: error,
      })
    );
});

app.listen(port, () => {
  console.log(`server listening on port ${port}`);
});
