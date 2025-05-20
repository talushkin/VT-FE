const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const PropertySchema = new Schema(
  {
    title: {
      type: String,
      required: false,
    },
    description: {
      type: String,
      required: false,
    },
    featured: {
      type: Boolean,
      default: false,
      required: false,
    },
    hot: {
      type: Boolean,
      default: false,
      required: false,
    },
    trending: {
      type: Boolean,
      default: false,
      required: false,
    },
    purpose: {
      type: String,
      required: false,
    },
    propertyType: {
      type: String,
      required: false,
    },
    area: {
      type: String,
      required: false,
    },
    address: {
      type: String,
      required: false,
    },
    unit: {
      type: String,
      required: false,
    },
    images: Array,
    price: Number,
    expireAfter: {
      type: Number,
      default: false,
    },
    expired: {
      type: Boolean,
      required: false,
      default: false,
    },
    approved: {
      type: Boolean,
      default: false,
    },
    city: {
      type: Schema.Types.ObjectId,
      ref: "city",
      required: false,
    },

    edited: {
      type: Boolean,
      default: false,
    },
    rejected: {
      type: Boolean,
      default: false,
    },
    estate: {
      type: Schema.Types.ObjectId,
      ref: "user",
      required: true,
    },
    owner: {
      type: Schema.Types.ObjectId,
      ref: "user",
      required: true,
    },
    newTitle: String,
    newDescription: String,
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("property", PropertySchema);
