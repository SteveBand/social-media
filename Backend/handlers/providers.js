module.exports = (app) => {
  const GitHubProvider = require("../lib/providers/githubProvider")(app);
  const GoogleProvider = require("../lib/providers/googleProvider")(app);
  const LocalProvider = require("../lib/providers/localProvider")(app);
};
