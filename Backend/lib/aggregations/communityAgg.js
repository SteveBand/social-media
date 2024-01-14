const mongoose = require("mongoose");
function fetchCommunity(id, userId) {
  return [
    { $match: { _id: new mongoose.Types.ObjectId(id) } },
    {
      $lookup: {
        from: "communitymembers",
        let: { parentId: userId, communityId: id },
        pipeline: [
          {
            $match: {
              $expr: {
                $and: [
                  { $eq: ["$communityId", "$$communityId"] },
                  { $eq: ["$parentId", "$$parentId"] },
                ],
              },
            },
          },
        ],
        as: "members",
      },
    },
    {
      $addFields: {
        isMember: { $gt: [{ $size: "$members" }, 0] },
      },
    },
    {
      $project: {
        members: 0,
      },
    },
  ];
}

function fetchCommunityPosts(userData, id) {
  return [
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
    {
      $lookup: {
        from: "communitylikes",
        let: { parentId: userData.email, postId: "$_id" },
        pipeline: [
          {
            $match: {
              $expr: {
                $and: [
                  {
                    $eq: [{ $toString: "$postId" }, { $toString: "$$postId" }],
                  },
                  {
                    $eq: ["$$parentId", "$parentId"],
                  },
                ],
              },
            },
          },
        ],
        as: "likes",
      },
    },
    {
      $addFields: {
        isLiked: { $gt: [{ $size: "$likes" }, 0] },
      },
    },
    {
      $project: {
        likes: 0,
      },
    },
  ];
}

exports.fetchCommunity = fetchCommunity;
exports.fetchCommunityPosts = fetchCommunityPosts;
