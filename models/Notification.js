const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const notificationSchema = new Schema({
  message: String,
  user: {
    type: Schema.Types.ObjectId,
    ref: "user",
    required: false,
  },
});

module.exports = mongoose.model("notifications", notificationSchema);
