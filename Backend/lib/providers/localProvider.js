const passport = require("passport");
const { UserModel } = require("../../models/models");
const LocalStrategy = require("passport-local").Strategy;
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
require("dotenv").config();

module.exports = (app) => {
  passport.use(
    new LocalStrategy({ usernameField: "email" }, async function (
      email,
      password,
      done
    ) {
      try {
        const user = await UserModel.findOne({ email });
        if (!user)
          return done(null, false, {
            message: "Username or password are incorrect",
          });

        const validate = await bcrypt.compare(password, user.password);
        if (!validate) {
          return done(null, false, {
            message: "Username or password are incorrect",
          });
        }

        return done(null, userObject);
      } catch (err) {
        console.log("An error occured in localProvider.js");
        return done(null, false, {
          message: "Internal Server error",
        });
      }
    })
  );

  passport.serializeUser((user, done) => {
    done(null, user._id);
  });

  passport.deserializeUser(async (id, done) => {
    try {
      const user = await UserModel.findById(id);
      done(null, user);
    } catch (error) {
      done(error, null);
    }
  });

  app.post("/login", passport.authenticate("local"), (req, res) => {
    return res.status(200).send(req.user);
  });

  app.get("/login", (req, res) => {
    if (req.isAuthenticated()) {
      return res.status(200).send(req.user);
    } else {
      return res.status(401).send({ message: "Unauthorised" });
    }
  });
};