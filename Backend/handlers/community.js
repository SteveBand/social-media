const mongoose = require("mongoose");
const { authGuard } = require("../middlewares/authGuard");
const { catchCookies } = require("../middlewares/catchCookies");
const { communityGuard } = require("../middlewares/communityGuard");
const {
  Community,
  CommunityMember,
  Post,
  LikesModel,
  CommunityModerator,
  UserModel,
} = require("../models/models");
const {
  fetchCommunity,
  fetchCommunityPosts,
  fetchModerators,
  fetchCommunityMembers,
} = require("../lib/aggregations/communityAgg");

module.exports = (app) => {
  app.get("/community/:id", catchCookies, async (req, res) => {
    if (!req.params.id) {
      return res.status(400).send({ message: "Bad Request" });
    }

    const id = new mongoose.Types.ObjectId(req.params.id);
    const user = await UserModel.findOne({
      email: req.userData?.email || null,
    });

    const userId = req.userData && new mongoose.Types.ObjectId(user?._id);

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

  app.get("/community/:id/posts", catchCookies, async (req, res) => {
    const id = req.params?.id;
    const userData = req.userData || null;
    try {
      if (!id) {
        return res.send({ message: "Bad Request" }).status(400);
      }

      const community = await Community.findById(
        new mongoose.Types.ObjectId(id)
      );

      if (!community) {
        return res.status(404).send({ message: "Community does not exist" });
      }

      const user =
        userData && (await UserModel.findOne({ email: userData.email }));

      if (community.membership === "private" && !user) {
        return res
          .status(403)
          .send({ message: "Community is Private, You need to be a member" });
      }

      const isMember = CommunityMember.findOne({
        parentId: new mongoose.Types.ObjectId(user._id),
        communityId: new mongoose.Types.ObjectId(id),
      });

      if (community.membership === "private" && !isMember) {
        return res
          .status(403)
          .send({ message: "Community is Privat, You need to be a member" });
      }
    } catch (err) {
      console.log(
        "An error has occured at /community/:id/posts at data verification",
        err
      );
      return res.status(500).send({ message: "An error has Occured!" });
    }

    try {
      if (!userData) {
        const posts = await Post.aggregate([
          { $match: { communityId: id } },
          {
            $lookup: {
              from: "users",
              localField: "parentId",
              foreignField: "email",
              as: "user_info",
            },
          },
          { $unwind: "$user_info" },
        ]);
        console.log(posts);
        return res.status(200).send(posts);
      } else {
        const postsArr = await Post.aggregate(
          fetchCommunityPosts(userData, id)
        );
        console.log(postsArr);
        return res.send(postsArr).status(200);
      }
    } catch (err) {
      console.log("An error has occured at /community/:id/posts", err);
      return res.send({ message: "An error has occured" }).status(500);
    }
  });

  app.post("/community/:id/new/member", authGuard, async (req, res) => {
    const id = req.params.id;

    if (!id) {
      return res.send({ message: "Bad Request" }).status(400);
    }

    try {
      const loggedUser = await UserModel.findOne({ email: req.userData.email });

      if (!loggedUser) {
        return res.send({ message: "User not found" }).status(404);
      }

      const newMember = await new CommunityMember({
        parentId: new mongoose.Types.ObjectId(loggedUser._id),
        communityId: new mongoose.Types.ObjectId(id),
      });

      await newMember.save();

      await Community.findOneAndUpdate(
        { _id: new mongoose.Types.ObjectId(id) },
        { $inc: { membersCount: 1 } }
      );

      return res.send({ newMember: true }).status(200);
    } catch (error) {
      console.log(
        "An error has Occured at /community/:id/new/member",
        error.name
      );
    }
  });

  app.post("/community/:id/delete/member", authGuard, async (req, res) => {
    const id = req.params.id;
    const userData = req.userData;

    if (!id) {
      return res.send({ message: "Bad Request" }).status(400);
    }

    if (!userData || userData === undefined) {
      return res.send({ message: "Unauthorized" }).status(401);
    }

    try {
      const loggedUser = await UserModel.findOne({ email: userData.email });

      if (!loggedUser) {
        return res.send({ message: "User not found!" }).status(404);
      }

      await CommunityMember.findOneAndDelete({
        parentId: loggedUser._id,
        communityId: new mongoose.Types.ObjectId(id),
      });

      await Community.findOneAndUpdate(
        { _id: new mongoose.Types.ObjectId(id) },
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
    const userData = req.userData || null;
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

      if (!userData) {
        return res.status(401).send({ message: "Unauthorized" });
      }

      const user = await UserModel.findOne({ email: userData.email });

      if (!user) {
        return res.status(401).send({ message: "Unauthorized" });
      }

      if (community.admin.equals(user._id)) {
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
    const parentId = req.query.parentId;
    if (!id || !content || !parentId) {
      return res.send({ message: "Bad Requst" }).status(404);
    }

    try {
      const newPost = await new Post({
        parentId,
        content,
        communityId: id,
      });
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

  app.post("/community/post/:id/new/like", authGuard, async (req, res) => {
    const postId = req.params.id;
    const userData = req.userData;
    const communityId = req.query.communityId;
    if (!postId || !communityId) {
      return res.send({ message: "Bad Request" }).status(400);
    }
    const existingLike = await LikesModel.findOne({
      parentId: userData.email,
      postId: postId,
    });
    if (existingLike) {
      return res.send({ message: "User already liked this post" }).status(400);
    }
    try {
      const newLike = await new LikesModel({
        parentId: userData.email,
        communityId,
        postId,
      });
      await newLike.save();
      await Post.findOneAndUpdate(
        { _id: new mongoose.Types.ObjectId(postId) },
        {
          $inc: { likesCount: 1 },
        }
      );
      return res.send({ message: "new Like Generated" }).status(200);
    } catch (error) {
      console.log(
        "An error has occured at /community/post/:id/new/like",
        error
      );
      return res.send({ message: "Server error" }).status(500);
    }
  });

  app.post("/community/post/:id/remove/like", authGuard, async (req, res) => {
    const postId = req.params.id;
    const communityId = req.query.communityId;
    if (!postId) {
      return res.send({ message: "Bad Request" }).status(400);
    }
    try {
      await LikesModel.findOneAndDelete({
        postId: postId,
      });
      await Post.findOneAndUpdate(
        {
          _id: new mongoose.Types.ObjectId(postId),
        },
        { $inc: { likesCount: -1 } }
      );
      return res.send({ message: "Disliked successfully" }).status(200);
    } catch (error) {
      console.log(
        "An error has occured at /community/post/:id/remove/like",
        error
      );
      return res.send({ message: "A server error has occured" }).status(500);
    }
  });

  app.post("/community/:id/new/moderator", async (req, res) => {
    const id = req.params.id;
    const userData = req.userData;
    const applicableUser = req.query.user;
    if (!id) {
      return res.send({ message: "Bad Request" }).status(400);
    }

    const user = await UserModel.findById(applicableUser);

    if (!user) {
      return res.send({ message: "User not found" }).status(404);
    }

    const newModerator = {
      parentId: new mongoose.Types.ObjectId(applicableUser),
      communityId: id,
    };
    try {
      const moderator = await new CommunityModerator(newModerator);
      await moderator.save();
      return res.send(moderator).status(200);
    } catch (error) {
      console.log(
        "An error has occured at /community/:id/new/moderator",
        error
      );
      return res.send({ message: "An error has occured" }).status(500);
    }
  });

  app.get("/community/:id/moderators", catchCookies, async (req, res) => {
    const id = req.params.id;
    const loggedUserId = req.userData.email;
    if (!id) {
      return res.send({ message: "Bad Request" }).status(400);
    }
    try {
      const moderators = await CommunityModerator.aggregate(
        fetchModerators(loggedUserId, id)
      );
      return res.send(moderators).status(200);
    } catch (error) {
      console.log("An error has occured at /community/:id/moderators", error);
      return res.send({ message: "An error has occured" }).status(500);
    }
  });

  app.get("/community/:id/members", catchCookies, async (req, res) => {
    const id = new mongoose.Types.ObjectId(req.params.id);
    const loggedUserId = req.userData === undefined ? null : req.userData.email;
    if (!id) {
      return res.send({ message: "Bad Request" }).status(400);
    }
    try {
      const members = await CommunityMember.aggregate(
        fetchCommunityMembers(id, loggedUserId)
      );
      return res.send(members).status(200);
    } catch (error) {
      console.log("An error has occured at /community/:id/members", error);
      return res.send({ message: "An error has occured" }).status(500);
    }
  });

  app.get("/communities", catchCookies, async (req, res) => {
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
      const admin = await UserModel.findOne({ email: req.userData.email });
      const obj = {
        membership,
        title,
        about,
        image: image || "",
        admin: new mongoose.Types.ObjectId(admin._id),
        rules: rules || [],
      };
      const newCommunity = await new Community(obj);
      newCommunity.save();
      const newMember = await new CommunityMember({
        parentId: new mongoose.Types.ObjectId(admin._id),
        communityId: new mongoose.Types.ObjectId(newCommunity._id),
      });
      newMember.save();
      const newModerator = await new CommunityModerator({
        parentId: new mongoose.Types.ObjectId(admin._id),
        communityId: new mongoose.Types.ObjectId(newCommunity._id),
      });
      newModerator.save();
      return res.send({ id: newCommunity._id }).status(200);
    } catch (error) {
      console.log("An error has occured at /community/new", error);
      return res.send({ message: "An error has occured" }).status(500);
    }
  });

  app.put("/community/:id/edit", authGuard, async (req, res) => {
    const id = new mongoose.Types.ObjectId(req.params.id);
    const body = req.body;
    if (!body || !id) {
      return res.send({ message: "Bad Request" }).status(400);
    }
    const user = await UserModel.findOne({ email: req.userData.email });
    if (!user) {
      return res.send({ message: "Unauthorized" }).status(401);
    }
    const community = await Community.findById(id);
    if (!community.admin.equals(user._id)) {
      return res.send({ message: "Unauthorized" }).status(401);
    }
    try {
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

//   {
// "parentId": {
//   "$oid": "65957d3fc9b437a6ed6f5c00"
// },
// "communityId": {
//   "$oid": "65ae8ee9db04703ed46bc180"
// }
// }
