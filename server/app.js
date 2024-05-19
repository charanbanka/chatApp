const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bodyParser = require("body-parser");
const dotnev = require("dotenv");
const router = require("./routes");

dotnev.config();

const app = express();

app.use(bodyParser.json({ limit: "800kb", extended: true }));
app.use(bodyParser.urlencoded({ limit: "800kb", extended: true }));

app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "token"],
    credentials: true,
    maxAge: 86400, // 1 day
  })
);

app.get("/", (req, res) => {
  res.send("Success");
});

app.use("/", router);

const PORT = process.env.PORT;

const DB_CON = process.env.DB_CON;
mongoose
  .connect(DB_CON)
  .then(() => console.log(`Mongoose Connected`))
  .catch((error) => console.log(error));

app.listen(PORT, () => console.log(`Server running on port: ${PORT}`));
