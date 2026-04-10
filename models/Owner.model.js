const { Schema, model } = require("mongoose");

const ownerSchema = new Schema(
  {
    firstName: {
      type: String,
      required: [true, "First name is required."],
      trim: true,
    },
    lastName: {
      type: String,
      required: [true, "Last name is required."],
      trim: true,
    },
    phone: {
      type: String,
      required: [true, "Phone is required."],
      trim: true,
    },
    email: {
      type: String,
      lowercase: true,
      trim: true,
    },
    dni: {
      type: String,
      required: [true, "DNI is required."],
      trim: true,
    },
    address: {
      type: String,
      trim: true,
    },
    isArchived: {
      type: Boolean,
      default: false,
    },
    agency: {
      type: Schema.Types.ObjectId,
      ref: "Agency",
      required: [true, "Agency is required."],
    },
  },
  {
    timestamps: true,
  }
);

const Owner = model("Owner", ownerSchema);

module.exports = Owner;