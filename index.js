var express = require("express");
var cors = require("cors");
var app = express();
var bodyParser = require("body-parser");
const mongoose = require("mongoose");
const authRoutes = require("./Routes/authRoutes");
const cookieParser = require("cookie-parser");
const dotenv = require('dotenv');
dotenv.config();
app.use("/uploads", express.static("uploads"));

var port = process.env.port;

app.use(
  cors({
    origin: ["http://localhost:3000"],
    method: ["GET", "POST"],
    credentials: true,
  })
);

app.use(express.json());
app.use(bodyParser.json());
app.use(cookieParser());

const url = process.env.url;
mongoose
  .connect(url, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("DB Connection Successfull");
  })
  .catch((error) => {
    console.log(error.message);
  });
app.use("/", authRoutes);
app.listen(port, () => console.log(`Server running on port ${port}!`));
