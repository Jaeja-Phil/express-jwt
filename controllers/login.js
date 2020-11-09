const { User } = require("../models");
const {
  generateAccessToken,
  generateRefreshToken,
  sendRefreshToken,
  sendAccessToken,
} = require("./tokenFunctions");
const serverTokenStore = require("./serverTokenStore");

module.exports = (req, res) => {
  const { username, password } = req.body;
  console.log(username, password);
  User.findOne({
    where: {
      username,
      password,
    },
  })
    .then((data) => {
      if (!data) {
        return res.status(403).send("Could not find a user with given username and password");
      }
      const userId = data.dataValues.id;
      const accessToken = generateAccessToken(userId);
      const refreshToken = generateRefreshToken(userId);

      serverTokenStore[userId] = refreshToken;
      sendRefreshToken(res, refreshToken);
      sendAccessToken(req, res, accessToken);
    })
    .catch((err) => {
      console.log(err);
    });
};
