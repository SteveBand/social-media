const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const app = express();
const cookieParser = require("cookie-parser");
const session = require("express-session");
const SessionDbStore = require("connect-mongodb-session")(session);
const passport = require("passport");
require("dotenv").config();

async function main() {
  const dbConnection = await mongoose.connect(
    "mongodb://localhost:27017/social-media"
  );
  console.log("Established connection to dataBase on port 27017");
  return dbConnection;
}
main().catch((err) => console.log(err));

const store = new SessionDbStore({
  uri: "mongodb://localhost:27017/social-media",
  collection: "sessions",
});

app.use(
  cors({
    origin: true,
    credentials: true,
    methods: "GET, PUT, POST, DELETE",
    allowedHeaders: "Content-Type, Accept, Authorization",
  })
);
app.use(express.json());
app.use(cookieParser());
app.use(
  session({
    secret: "StevesProject",
    resave: false,
    saveUninitialized: false,
    store: store,
    cookie: {
      secure: false,
      maxAge: 60 * 1000 * 60 * 2,
    },
  })
);

app.use(passport.initialize());
app.use(passport.session());

app.listen("4000", () => {
  console.log("Connection to server established on port 4000");
});

require("./handlers/post")(app);
require("./handlers/like")(app);
require("./handlers/comment")(app);
require("./handlers/community")(app);
require("./handlers/user")(app);
require("./handlers/follow")(app);
require("./handlers/search")(app);
require("./handlers/providers")(app);
