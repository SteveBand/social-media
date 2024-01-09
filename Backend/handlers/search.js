const { Post, UserModel, CommentModel } = require("../models/models");
const { catchCookies } = require("../middlewares/catchCookies");
module.exports = (app) => {
  app.get("/search", catchCookies, async (req, res) => {
    const userData = req.userData || null;
    const query = req.query.query;
    const action = req.query.action;

    if (!query && !action) {
      return res.send({ message: "Bed Request" }).status(400);
    }

    // switch (action) {
    //   case "posts":
    //     const postsArray = await Post.find({ $text: { $search: query } });
    //     return res.send(postsArray).status(200);
    // }
  });
};
