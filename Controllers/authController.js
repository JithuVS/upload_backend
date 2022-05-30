const User = require("../Models/userModel");
const Assets = require("../Models/assetModel");
const jwt = require("jsonwebtoken");
const cloudinary = require("cloudinary").v2;
const fs = require("fs");
const dotenv = require("dotenv");
dotenv.config();

const maxAge = 3 * 24 * 60 * 60;
const createToken = (id) => {
  return jwt.sign({ id }, process.env.secret_key, {
    expiresIn: maxAge,
  });
};

const handleErrors = (err) => {
  let errors = { email: "", password: "" };

  console.log(err);
  if (err.message === "incorrect email") {
    errors.email = "That email is not registered";
  }

  if (err.message === "incorrect password") {
    errors.password = "That password is incorrect";
  }

  if (err.code === 11000) {
    errors.email = "Email is already registered";
    return errors;
  }

  if (err.message && err.message.includes("Users validation failed")) {
    Object.values(err.errors).forEach(({ properties }) => {
      errors[properties.path] = properties.message;
    });
  }

  return errors;
};

module.exports.register = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await User.create({ email, password });
    const token = createToken(user._id);

    res.cookie("jwt", token, {
      domain: '.netlify.app',
      withCredentials: true,
      httpOnly: true,
      maxAge: maxAge * 1000,
      sameSite: 'none',
      secure: true
    });

    res.status(201).json({ user: user._id, created: true });
  } catch (err) {
    console.log(err);
    const errors = handleErrors(err);
    res.json({ errors, created: false });
  }
};

module.exports.login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.login(email, password);
    const token = createToken(user._id);
    res.cookie("jwt", token, {
      domain: '.netlify.app',
      withCredentials: true,
      httpOnly: true,
      maxAge: maxAge * 1000,
      sameSite: 'none',
      secure: true
    });
    res.status(200).json({ user: user._id, status: true });
  } catch (err) {
    const errors = handleErrors(err);
    res.json({ errors, status: false });
  }
};

module.exports.uploads = async (req, res) => {
  try {
    var locaFilePath = req.file.path;
    const token = req.cookies.jwt;
    const data = req.body;
    if (token) {
      jwt.verify(token, process.env.secret_key, async (err, decodedToken) => {
        user = await User.findById(decodedToken.id);
        if (user) {
          let owner = decodedToken.id;
          var result = await uploadToCloudinary(locaFilePath, {
            ...data,
            owner,
          });
          return res.status(200).json(result);
        } else {
          res.json({ error: "user not found", status: false });
        }
      });
    }
  } catch (err) {
    const errors = handleErrors(err);
    res.json({ errors, status: false });
  }
};

cloudinary.config({
  cloud_name: process.env.cloud_name,
  api_key: process.env.api_key,
  api_secret: process.env.api_secret,
});

async function uploadToCloudinary(locaFilePath, data) {
  var mainFolderName = "main";
  var filePathOnCloudinary = mainFolderName + "/" + locaFilePath;
  return cloudinary.uploader
    .upload(locaFilePath, { public_id: filePathOnCloudinary })
    .then(async (result) => {
      fs.unlinkSync(locaFilePath);
      const { company, name, language, note, owner } = data;
      const { asset_id, resource_type, version, original_extension, url } =
        result;
      await Assets.create({
        company,
        owner,
        asset_id,
        name,
        resource_type,
        version,
        url,
        original_extension,
        language,
        note,
      });
      return {
        message: "Success",
        url: result.url,
      };
    })
    .catch((error) => {
      fs.unlinkSync(locaFilePath);
      return { message: "Fail" };
    });
}

module.exports.getDetails = async (req, res) => {
  try {
    const token = req.cookies.jwt;
    console.log(token, "token");
    if (token) {
      jwt.verify(token, process.env.secret_key, async (err, decodedToken) => {
        user = await User.findById(decodedToken.id);
        let id = decodedToken.id;
        if (user) {
          let result = await Assets.find({ owner: id });
          return res.status(200).json(result);
        }
      });
    }
  } catch (err) {
    const errors = handleErrors(err);
    res.json({ errors, status: false });
  }
};
