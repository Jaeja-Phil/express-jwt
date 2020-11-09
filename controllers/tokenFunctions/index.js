require("dotenv").config();
const { sign, verify } = require("jsonwebtoken");

module.exports = {
  generateAccessToken: (userId) => {
    return sign({ userId }, process.env.ACCESS_SECRET, { expiresIn: "1h" });
  },
  generateRefreshToken: (userId) => {
    return sign({ userId }, process.env.REFRESH_SECRET, { expiresIn: "1d" });
  },
  sendAccessToken: (req, res, accessToken) => {
    res.send({ accessToken, username: req.body.username });
  },
  sendRefreshToken: (res, token) => {
    res.cookie("refreshtoken", token, {
      httpOnly: true,
    });
  },
  isAuthorized: (req, res) => {
    const authorization = req.headers["authorization"];

    if (!authorization) {
      return null;
    }

    const token = authorization.split(" ")[1];
    try {
      const { userId } = verify(token, process.env.ACCESS_SECRET);
      return userId;
    } catch (err) {
      // return null if invalid token
      return null;
    }
  },
  checkRefeshToken: (refreshToken) => {
    let payload;
    try {
      payload = verify(refreshToken, process.env.REFRESH_SECRET);
      return payload;
    } catch (err) {
      // return null if refresh token is not valid
      return null;
    }
  },
};
