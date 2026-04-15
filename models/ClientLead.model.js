const { Schema, model } = require("mongoose");

const clientLeadSchema = new Schema(
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
    email: {
      type: String,
      lowercase: true,
      trim: true,
    },
    phone: {
      type: String,
      required: [true, "Phone is required."],
      trim: true,
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
    notes: {
  type: [
    {
      text: { type: String, required: true },
      createdAt: { type: Date, default: Date.now },
    }
  ],
  default: [],
},
  },
  {
    timestamps: true,
  }
);

const ClientLead = model("ClientLead", clientLeadSchema);

module.exports = ClientLead;