const passport = require("passport");
const GitHubStrategy = require("passport-github2").Strategy;
const { UserModel } = require("../../models/models");
const jwt = require("jsonwebtoken");
require("dotenv").config();
module.exports = (app) => {
  passport.use(
    new GitHubStrategy(
      {
        clientID: process.env.GITHUB_CLIENT_ID,
        clientSecret: process.env.GITHUB_CLIENT_SECRET,
        callbackURL: "http://localhost:3000/auth/github/callback",
      },
      async (accessToken, refreshToken, profile, done) => {
        try {
          let user = await UserModel.findOne({
            email: profile.emails[0].value,
          });
          if (!user) {
            user = new UserModel({
              githubId: profile.id,
              name: profile.displayName,
              avatar_url: profile.photos[0].value,
              email: profile.emails[0].value,
              bio: profile.bio,
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
    "/auth/github/callback",
    passport.authenticate("github", {
      successRedirect: "http://localhost:3000",
      failureRedirect: "/login",
    })
  );

  app.get("/auth/logout", (req, res) => {
    const { logout } = passport;
    req.logout();
  });
};
