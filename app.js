const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const mail_router = require("./src/mail_route");

const app = express();
require("dotenv").config();
app.use(cors({ origin: "*" }));
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use("/reset_mail", mail_router);
app.listen(5000);
