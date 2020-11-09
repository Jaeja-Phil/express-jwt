const {
  isAuthorized,
  checkRefeshToken,
  generateAccessToken,
  generateRefreshToken,
  sendRefreshToken,
  sendAccessToken,
} = require("./tokenFunctions");
const serverTokenStore = require("./serverTokenStore");
module.exports = (req, res) => {
  const userId = isAuthorized(req, res);
  if (!userId) {
    return res.status(401).send("not authorized");
  }
  // now we know that the user has the verified token
  // check for refresh token
  const token = req.cookies.refreshtoken;
  if (!token) res.status(403).send("refresh token does not exist");
  // // we have refresh token
  const payload = checkRefeshToken(token);
  if (!payload) {
    return res.status(403).send("refresh token is not verified");
  }
  // refresh token verified, check if it matches with the server's refresh token
  if (serverTokenStore[userId] !== token) {
    return res.status(403).send("refresh token has expired, try logging in again");
  }
  // create new refresh/access token
  const newAccessToken = generateAccessToken(userId);
  const newRefreshToken = generateRefreshToken(userId);
  serverTokenStore[userId] = newRefreshToken;
  sendRefreshToken(res, newRefreshToken);
  sendAccessToken(req, res, newAccessToken);
};
