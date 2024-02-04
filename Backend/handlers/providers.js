module.exports = (app) => {
  const GitHubProvider = require("../lib/providers/githubProvider")(app);
  const GoogleProvider = require("../lib/providers/googleProvider")(app);
  const LocalProvider = require("../lib/providers/localProvider")(app);

  app.post("/logout", (req, res, next) => {
    req.logout((err) => {
      if (err) {
        res.status(500).send({ message: "Internal Error" });
        return next(err);
      } else {
        return res.status(200).send({ message: "Client logout successfuly" });
      }
    });
  });
};
