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

exports.fetchCommunity = fetchCommunity;
