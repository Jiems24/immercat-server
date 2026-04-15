const { Schema, model } = require("mongoose");

const linkedNoteSchema = new Schema(
  {
    text: {
      type: String,
      required: [true, "Text is required."],
      trim: true,
    },
    client: {
      type: Schema.Types.ObjectId,
      ref: "ClientLead",
      required: [true, "Client is required."],
    },
    property: {
      type: Schema.Types.ObjectId,
      ref: "Property",
      required: [true, "Property is required."],
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

const LinkedNote = model("LinkedNote", linkedNoteSchema);

module.exports = LinkedNote;