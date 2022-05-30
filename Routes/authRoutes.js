var multer = require("multer");
var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./uploads");
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});
var upload = multer({ storage: storage });

const { register, login, uploads, getDetails } = require("../Controllers/authController");
const { checkUser } = require("../Middlewares/authMiddleware");
const router = require("express").Router();

router.post("/", checkUser);
router.get("/get", getDetails);
router.post("/register", register);
router.post("/login", login);
router.post("/upload", upload.single("fileName"), uploads);

module.exports = router;
