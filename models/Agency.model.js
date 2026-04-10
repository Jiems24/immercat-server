const { Schema, model } = require("mongoose");

const agencySchema = new Schema(
  {
    name: {
      type: String,
      required: [true, "Agency name is required."],
      trim: true,
    },
    city: {
      type: String,
      required: [true, "City is required."],
      trim: true,
    },
    phone: {
      type: String,
      trim: true,
    },
    email: {
      type: String,
      lowercase: true,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

const Agency = model("Agency", agencySchema);

module.exports = Agency;