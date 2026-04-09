const { Schema, model } = require("mongoose");

const clientLeadSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
    },
    phone: {
      type: String,
       required: true,
    },
    demandType: {
      type: String,
      enum: ["compra", "alquiler"],
    },
    demandPropertyType: {
      type: String,
      enum: ["piso", "casa", "local", "oficina"],
    },
    demandBudget: {
      type: Number,
    },
    demandZone: {
      type: String,
    },
    isArchived: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = model("ClientLead", clientLeadSchema);