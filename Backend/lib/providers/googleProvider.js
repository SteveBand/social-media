const passport = require("passport");
const { UserModel } = require("../../models/models");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const jwt = require("jsonwebtoken");
require("dotenv").config();

module.exports = (app) => {
  passport.use(
    new GoogleStrategy(
      {
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: "http://localhost:4000/auth/google/callback",
      },
      async (accessToken, refreshToken, profile, done) => {
        try {
          let user = await UserModel.findOne({
            email: profile.emails[0].value,
          });
          if (!user) {
            user = new UserModel({
              googleId: profile.id,
              name: profile.displayName,
              avatar_url: profile.photos[0].value,
              email: profile.emails[0].value,
            });
            await user.save();
          }
          return done(null, user);
        } catch (error) {
          return done(error);
        }
      }
    )
  );

  passport.serializeUser((user, done) => {
    try {
      done(null, user);
    } catch (error) {
      done(error);
    }
  });

  passport.deserializeUser(async (id, done) => {
    try {
      const user = await UserModel.findById(id);
      done(null, user);
    } catch (error) {
      done(error);
    }
  });

  app.get(
    "/auth/google",
    passport.authenticate("google", { scope: ["profile", "email"] })
  );

  app.get(
    "/auth/google/callback",
    passport.authenticate("google", {
      successRedirect: "http://localhost:3000",
      failureRedirect: "/login",
    })
  );
};
