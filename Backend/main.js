const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const app = express();
const cookieParser = require("cookie-parser");

async function main() {
  const dbConnection = await mongoose.connect(
    "mongodb://localhost:27017/social-media"
  );
  console.log("Established connection to dataBase on port 27017");
  return dbConnection;
}
main().catch((err) => console.log(err));

app.use(express.json());
app.use(cookieParser());

app.use(
  cors({
    origin: true,
    credentials: true,
    methods: "GET, PUT, POST, DELETE",
    allowedHeaders: "Content-Type, Accpet, Authorization",
  })
);

app.listen("4000", () => {
  console.log("Connection to server established on port 4000");
});

require("./handlers/post")(app);
require("./handlers/like")(app);
