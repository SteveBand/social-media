const { catchCookies } = require("../middlewares/catchCookies");
const { Community } = require("../models/models");
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
};
