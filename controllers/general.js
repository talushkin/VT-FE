const Ads = require("../models/Property");
const User = require("../models/User");
const City = require("../models/City");

exports.getCities = async (req, res) => {
  try {
    const cities = await City.find();
    res.status(200).json({
      cities,
    });
  } catch (error) {
    console.log(err);
    res.status(500).json(err);
  }
};
exports.getCategories = async (req, res) => {
  try {
    const categories = await Ads.distinct("propertyType");
    res.status(200).json({
      categories,
    });
  } catch (error) {
    console.log(err);
    res.status(500).json(err);
  }
};
