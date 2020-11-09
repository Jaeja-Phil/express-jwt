require("dotenv").config();
const fs = require("fs");
const https = require("https");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const privateKey = fs.readFileSync("sslcert/server.key", "utf8");
const certificate = fs.readFileSync("sslcert/server.crt", "utf8");

const credentials = { key: privateKey, cert: certificate };
const express = require("express");
const app = express();

const controllers = require("./controllers");

app.use(express.json());
app.use(cors());
app.use(cookieParser());
app.post("/login", controllers.login);
app.post("/signup", controllers.signup);
app.post("/mypage", controllers.mypage);

const PORT = process.env.PORT || 4000;
const httpsServer = https.createServer(credentials, app);

app.listen(PORT, () => console.log("https server running"));
