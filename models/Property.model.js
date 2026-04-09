const { Schema, model } = require("mongoose");

const propertySchema = new Schema(
  {
    title: {
      type: String,
      required: true,
    },
    propertyType: {
      type: String,
      enum: ["piso", "casa", "local", "oficina"],
      required: true,
    },
    operationType: {
      type: String,
      enum: ["venta", "alquiler"],
      required: true,
    },
    price: {
      type: Number,
      required: true,
      min: 1,
    },
    location: {
      type: String,
    },
    address: {
      type: String,
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
  },
  {
    timestamps: true,
  }
);

module.exports = model("Property", propertySchema);