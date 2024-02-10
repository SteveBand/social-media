const mongoose = require("mongoose");
const { authGuard } = require("../middlewares/authGuard");
const { communityGuard } = require("../middlewares/communityGuard");
const {
  Community,
  CommunityMember,
  Post,
  LikesModel,
  UserModel,
} = require("../models/models");
const {
  fetchCommunity,
  fetchCommunityPosts,
  fetchCommunityMembers,
} = require("../lib/aggregations/communityAgg");

module.exports = (app) => {
  app.get("/community/:id", async (req, res) => {
    if (!req.params.id) {
      return res.status(400).send({ message: "Bad Request" });
    }

    const id = new mongoose.Types.ObjectId(req.params.id);
    const userId = req.user ? new mongoose.Types.ObjectId(req.user._id) : null;

    try {
      const community = await Community.aggregate(fetchCommunity(id, userId));

      if (!community) {
        return res.status(400).send({ message: "Bad Request" });
      }

      return res.status(200).send(community.pop());
    } catch (error) {
      console.log(error, "An error has occured at /community/:id");
      return res.status(500).send({ message: "An error has occured" });
    }
  });

  app.get("/community/:id/posts", async (req, res) => {
    try {
      const id = req.params.id && new mongoose.Types.ObjectId(req.params.id);
      const userId = req.user ? req.user._id : null;

      const isMember = userId
        ? await CommunityMember.findOne({
            parentId: new mongoose.Types.ObjectId(userId),
            communityId: new mongoose.Types.ObjectId(id),
          })
        : null;

      const community = await Community.findById(id);
      if (!community) {
        return res.status(404).send({ message: "Community does not exist" });
      }

      if (community.membership === "private" && !userId) {
        return res
          .status(403)
          .send({ message: "Community is Private, You need to be a member" });
      }

      if (community.membership === "private" && !isMember) {
        return res
          .status(403)
          .send({ message: "Community is Private, You need to be a member" });
      }

      if (!userId) {
        const posts = await Post.aggregate([
          { $match: { communityId: id } },
          {
            $lookup: {
              from: "users",
              localField: "parentId",
              foreignField: "_id",
              as: "user_info",
            },
          },
          { $unwind: "$user_info" },
        ]);
        return res.status(200).send(posts);
      } else {
        const postsArr = await Post.aggregate(fetchCommunityPosts(id, userId));
        return res.send(postsArr).status(200);
      }
    } catch (err) {
      console.log(
        "An error has occured at /community/:id/posts at data verification",
        err
      );
      return res.status(500).send({ message: "An error has Occured!" });
    }
  });

  app.post("/community/:id/new/member", authGuard, async (req, res) => {
    const id = new mongoose.Types.ObjectId(req.params.id);
    const userId = new mongoose.Types.ObjectId(req.user._id);

    const community = Community.findById(id);

    try {
      const newMember = await new CommunityMember({
        parentId: new mongoose.Types.ObjectId(userId),
        communityId: new mongoose.Types.ObjectId(id),
      });

      await newMember.save();

      await Community.findOneAndUpdate(
        { _id: new mongoose.Types.ObjectId(id) },
        { $inc: { membersCount: 1 } }
      );

      return res.status(200).send({ newMember: true });
    } catch (error) {
      console.log(
        "An error has Occured at /community/:id/new/member",
        error.name
      );
    }
  });

  app.post("/community/:id/delete/member", authGuard, async (req, res) => {
    const id = new mongoose.Types.ObjectId(req.params.id);
    const userId = req.user ? new mongoose.Types.ObjectId(req.user._id) : null;

    if (!userId) {
      return res.send({ message: "Unauthorized" }).status(401);
    }

    try {
      await CommunityMember.findOneAndDelete({
        parentId: userId,
        communityId: id,
      });

      await Community.findOneAndUpdate(
        { _id: id },
        { $inc: { membersCount: -1 } }
      );
      return res.send({ newMember: false }).status(200);
    } catch (error) {
      console.log(
        "An error has Occured at /community/:id/delete/member",
        error
      );
      return res.status(500);
    }
  });

  app.post("/community/:id/remove/member", authGuard, async (req, res) => {
    const id = req.params.id;
    const userId = req.user._id;
    const memberId = req.query.memberId;
    try {
      if (!id) {
        return res.status(400).send({ message: "Bad request" });
      }

      const community = await Community.findById(
        new mongoose.Types.ObjectId(id)
      );

      if (!community) {
        return res.status(404).send({ message: "Community Not found!" });
      }

      if (community.admin.equals(userId)) {
        const removedMember = await CommunityMember.findOneAndDelete({
          parentId: new mongoose.Types.ObjectId(memberId),
          communityId: new mongoose.Types.ObjectId(id),
        });
        console.log(removedMember);
        return res.status(200).send({ message: "Member successfuly removed" });
      } else {
        return res.status(401).send({ message: "Unauthorized" });
      }
    } catch (error) {
      console.log(
        "An error has occured at /community/:id/remove/member",
        error
      );
      return res.status(500).send({ message: "Internal Server Error" });
    }
  });

  app.post("/community/:id/new/post", communityGuard, async (req, res) => {
    const id = req.params.id;
    const content = req.query.content;
    const parentId = req.user._id;

    try {
      const newPost = await new Post({
        parentId,
        content,
        communityId: id,
      });
      await newPost.save();

      const post = {
        ...newPost._doc,
        user_info: req.user,
      };
      return res.status(200).send(post);
    } catch (error) {
      console.log(
        "An error has Occured at /community/:id/new/post path",
        error
      );
      return res.status(500).send({ message: "Server Error" });
    }
  });

  app.get("/community/:id/members", async (req, res) => {
    const id = new mongoose.Types.ObjectId(req.params.id);
    const userId = req.user ? new mongoose.Types.ObjectId(req.user._id) : null;

    try {
      const members = await CommunityMember.aggregate(
        fetchCommunityMembers(id, userId)
      );
      return res.send(members).status(200);
    } catch (error) {
      console.log("An error has occured at /community/:id/members", error);
      return res.send({ message: "An error has occured" }).status(500);
    }
  });

  app.get("/communities", async (req, res) => {
    try {
      const communities = await Community.find().limit(10);
      return res.send(communities).status(200);
    } catch (error) {
      console.log("An error has occured at /communities", error);
      return res.send({ message: "An error has occured at " }).status(500);
    }
  });

  app.post("/community/new", authGuard, async (req, res) => {
    const { membership, title, about, image, rules } = req.body;
    const userId = req.user._id;
    if (!membership || !title || !about) {
      return res.send({ message: "Bad Request" }).status(400);
    }

    try {
      const exisitingTitle = await Community.findOne({ title });
      if (exisitingTitle) {
        return res
          .send({
            message:
              "Community with the same name already exists , pick another ",
          })
          .status(400);
      }

      const obj = {
        membership,
        title,
        about,
        image: image || "",
        admin: new mongoose.Types.ObjectId(userId),
        rules: rules || [],
      };

      const newCommunity = await new Community(obj);
      newCommunity.save();

      const newMember = await new CommunityMember({
        parentId: new mongoose.Types.ObjectId(admin._id),
        communityId: new mongoose.Types.ObjectId(newCommunity._id),
      });

      newMember.save();
      return res.send({ id: newCommunity._id }).status(200);
    } catch (error) {
      console.log("An error has occured at /community/new", error);
      return res.send({ message: "An error has occured" }).status(500);
    }
  });

  app.put("/community/:id/edit", authGuard, async (req, res) => {
    const id = new mongoose.Types.ObjectId(req.params.id);
    const userId = new mongoose.Types.ObjectId(req.user._id);
    const body = req.body;

    if (!body || !id) {
      return res.send({ message: "Bad Request" }).status(400);
    }

    const community = await Community.findById(id);

    try {
      if (!community.admin.equals(userId)) {
        return res.send({ message: "Unauthorized" }).status(401);
      }

      const updatedCommunity = await Community.findOneAndUpdate(
        { _id: id },
        body,
        {
          new: true,
        }
      );
      const newObj = updatedCommunity.toObject();
      newObj.isAdmin = true;
      newObj.isMember = true;
      return res.send(newObj);
    } catch (error) {
      console.log("An error has occured at /community/:id/edit", error);
      return res.send({ message: "An error has Occured" }).status(500);
    }
  });
};
