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
      delete data.dataValues.password;
      const userId = data.dataValues.id;
      const accessToken = generateAccessToken(data.dataValues);
      const refreshToken = generateRefreshToken(data.dataValues);
      serverTokenStore[userId] = refreshToken;
      sendRefreshToken(res, refreshToken);
      sendAccessToken(data.dataValues, res, accessToken);
    })
    .catch((err) => {
      console.log(err);
    });
};
