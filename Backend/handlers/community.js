const { catchCookies } = require("../middlewares/catchCookies");
const { communityGuard } = require("../middlewares/communityGuard");
const { Community, CommunityPost } = require("../models/models");
module.exports = (app) => {
  app.get("/community/:id", catchCookies, async (req, res) => {
    const id = req.params.id;
    if (!id) {
      return res.send({ message: "Bad Request" }).status(400);
    }
    const community = await Community.findById(id);
    if (!community) {
      return res.send({ message: "Bad Request" }).status(400);
    }

    console.log(community);
    return res.send(community).status(200);
  });

  // app.get("/community/:id/posts", async (req, res) => {
  //   const id = req.params.id;
  //   if (!id) {
  //     return res.send({ message: "Bad Request" }).status(400);
  //   }
  // });

  app.post("/community/:id/new/post", communityGuard, async (req, res) => {
    const id = req.params.id;
    const newPost = req.body;
    if (!id) {
      return res.send({ message: "Community does not exist" }).status(404);
    }
  });
};
