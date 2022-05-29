const mongoose = require("mongoose");
const Users = require("./userModel");

//asset_id, company, owner, name, resource_type, version, url, original_extension, language, note
const assetSchema = new mongoose.Schema({
  company: {
    type: String,
    required: [true, "comapny name is required"],
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: Users,
    required: true,
    index: true,
  },
  asset_id: {
    type: String,
    required: [true, "id is required"],
  },
  name: {
    type: String,
    required: [true, "name is required"],
  },
  url: {
    type: String,
    required: [true, "reference is required"],
  },
  version: {
    type: String,
    required: [true, "version is required"],
  },
  resource_type: {
    type: String,
    required: [true, "type  is required"],
  },
  original_extension: {
    type: String,
    required: [true, "extension  is required"],
  },
  language: {
    type: String,
    required: [true, "language is required"],
  },
  note: {
    type: String,
    required: [true, "note is required"],
  },
});

module.exports = mongoose.model("Assets", assetSchema);
