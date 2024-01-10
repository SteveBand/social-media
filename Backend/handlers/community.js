const { authGuard } = require("../middlewares/authGuard");
const { catchCookies } = require("../middlewares/catchCookies");
const { communityGuard } = require("../middlewares/communityGuard");
const {
  Community,
  CommunityPost,
  CommunityMember,
} = require("../models/models");
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

  app.get("/community/:id/posts", async (req, res) => {
    const id = req.params.id;
    if (!id) {
      return res.send({ message: "Bad Request" }).status(400);
    }
  });

  app.post("/community/:id/new/member", authGuard, async (req, res) => {
    const id = req.params.id;
    if (!id) {
      return res.send({ message: "Bad Request" }).status(400);
    }
    try {
      const newMember = new CommunityMember({
        parentId: req.userData.email,
        communityId: id,
      });
    } catch (error) {}
  });

  app.post("/community/:id/new/post", communityGuard, async (req, res) => {
    const id = req.params.id;
    const content = req.query.content;
    const parentId = req.query.parentId;
    if (!id || !content || !parentId) {
      return res.send({ message: "Bad Requst" }).status(404);
    }

    try {
      const newPost = await new CommunityPost({ parentId, content });
      await newPost.save();
      return res.send(newPost).status(200);
    } catch (error) {
      console.log(
        "An error has Occured at /community/:id/new/post path",
        err.name
      );
      return res.send({ message: "Server Error" }).status(500);
    }
  });
};
