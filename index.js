const fs = require("fs");
const https = require("https");
const cors = require("cors");
const jwt = require("jsonwebtoken");
const privateKey = fs.readFileSync("sslcert/server.key", "utf8");
const certificate = fs.readFileSync("sslcert/server.crt", "utf8");

const credentials = { key: privateKey, cert: certificate };
const express = require("express");
const app = express();

const httpsServer = https.createServer(credentials, app);

const token = jwt.sign(
  {
    data: "this is my data portion",
  },
  privateKey,
  { algorithm: "RS256", expiresIn: "1h" }
  // (err, token) => console.log(token)
);

httpsServer.listen(4001, () => console.log("https server running"));
