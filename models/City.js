const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const citySchema = new Schema({
  country: String,
  name: String,
  lat: String,
  lng: String,
});

module.exports = mongoose.model("city", citySchema);
