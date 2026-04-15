const { Schema, model } = require("mongoose");

const propertySchema = new Schema(
  {
    title: {
      type: String,
      required: [true, "Title is required."],
      trim: true,
    },
    propertyType: {
      type: String,
      enum: ["piso", "casa", "local", "oficina"],
      required: [true, "Property type is required."],
    },
    operationType: {
      type: String,
      enum: ["venta", "alquiler"],
      required: [true, "Operation type is required."],
    },
    price: {
      type: Number,
      required: [true, "Price is required."],
      min: 1,
    },
    location: {
      type: String,
      trim: true,
    },
    address: {
      type: String,
      trim: true,
    },
    squareMeters: {
      type: Number,
    },
    rooms: {
      type: Number,
    },
    bathrooms: {
      type: Number,
    },
    description: {
      type: String,
      trim: true,
    },
    images: {
      type: [String],
    },
    status: {
      type: String,
      enum: ["disponible", "reservado", "vendido", "alquilado"],
      default: "disponible",
    },
    isArchived: {
      type: Boolean,
      default: false,
    },
    owner: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    realOwner: {
      type: Schema.Types.ObjectId,
      ref: "Owner",
    },
    agency: {
      type: Schema.Types.ObjectId,
      ref: "Agency",
      required: [true, "Agency is required."],
    },
    notes: {
      type: [String],
      default: [],
    },
  },
  {
    timestamps: true,
  }
);

const Property = model("Property", propertySchema);

module.exports = Property;