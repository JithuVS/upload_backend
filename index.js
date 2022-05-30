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

var port = process.env.PORT;

// app.options('*', cors());
// app.use(
//   cors({
//     origin: ["https://uplooads.herokuapp.com"],
//     credentials: true,
//   })
// );
app.use(cors());
app.use((req,res,next)=>{
    res.header('Access-Control-Allow-Credentials, Access-Control-Allow-Headers, *, Access-Control-Allow-Origin', 'Origin, X-Requested-with, Content_Type,Accept,Authorization','https://uplooads.herokuapp.com');
    if(req.method === 'OPTIONS') {
        res.header('Access-Control-Allow-Methods','PUT,POST,PATCH,DELETE,GET');
        return res.status(200).json({});
    }
    next();
});


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
app.listen(port || 4000, () => console.log(`Server running on port ${port}!`));
