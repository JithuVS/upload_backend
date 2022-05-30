var express = require("express");
var cors = require("cors");
var app = express();
var bodyParser = require("body-parser");
const mongoose = require("mongoose");
const authRoutes = require("./Routes/authRoutes");
const cookieParser = require("cookie-parser");
const dotenv = require("dotenv");
dotenv.config();
app.use("/uploads", express.static("uploads"));

var port = process.env.PORT || 4000;

app.use(
  cors({
    origin: ["https://uplloads.herokuapp.com"],
    method: ["GET", "POST"],
    credentials: true,
  })
);

//  app.use((req, res, next) => {
//   res.setHeader(
//     "Access-Control-Allow-Origin",
//     "https://uplloads.herokuapp.com"
//   );

//   // Request headers you wish to allow
//   res.setHeader(
//     "Access-Control-Allow-Headers",
//     "X-Requested-With,content-type"
//   );

//   // Set to true if you need the website to include cookies in the requests sent
//   // to the API (e.g. in case you use sessions)
//   res.setHeader("Access-Control-Allow-Credentials", true);

//   if (req.method === "OPTIONS") {
//     res.header("Access-Control-Allow-Methods", "POST, GET");
//     return res.status(200).json({});
//   }
//   next();
// });

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
