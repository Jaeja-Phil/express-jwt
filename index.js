require("dotenv").config();
const fs = require("fs");
const https = require("https");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const privateKey = fs.readFileSync("sslcert/localhost.com+4-key.pem", "utf8");
const certificate = fs.readFileSync("sslcert/localhost.com+4.pem", "utf8");
const credentials = { key: privateKey, cert: certificate };

const express = require("express");
const app = express();

const controllers = require("./controllers");

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(
  cors({
    origin: ["http://localhost:3000"],
    credentials: true,
    methods: ["GET", "POST", "OPTIONS"],
  })
);
app.use(cookieParser());
app.post("/login", controllers.login);
app.post("/signup", controllers.signup);
app.get("/mypage", controllers.mypage);

const HTTPS_PORT = process.env.HTTPS_PORT || 4000;
const httpsServer = https.createServer(credentials, app);
httpsServer.listen(HTTPS_PORT, () => console.log("server runnning"));
