const passport = require("passport");

module.exports = (app) => {
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
