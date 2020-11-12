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
  const accessTokenData = isAuthorized(req);
  if (!accessTokenData) {
    return res.status(401).send("not authorized");
  }
  // now we know that the user has the verified token
  // check for refresh token
  const token = req.cookies.refreshToken;
  if (!token) return res.status(403).send("refresh token does not exist");
  // // we have refresh token
  const refreshTokenData = checkRefeshToken(token);
  if (!refreshTokenData) {
    return res.status(403).send("refresh token is not verified");
  }
  // refresh token verified, check if it matches with the server's refresh token
  const userId = accessTokenData.id;
  if (serverTokenStore[userId] !== token) {
    return res.status(403).send("refresh token has expired, try logging in again");
  }
  // create new refresh/access token
  delete accessTokenData.iat;
  delete accessTokenData.exp;

  const newAccessToken = generateAccessToken(accessTokenData);
  const newRefreshToken = generateRefreshToken(accessTokenData);
  serverTokenStore[userId] = newRefreshToken;
  sendRefreshToken(res, newRefreshToken);
  sendAccessToken(accessTokenData, res, newAccessToken);
};
