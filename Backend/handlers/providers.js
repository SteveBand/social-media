module.exports = (app) => {
  const GitHubProvider = require("../lib/providers/githubProvider")(app);
  const GoogleProvider = require("../lib/providers/googleProvider")(app);
};
