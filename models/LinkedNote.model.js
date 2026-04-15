const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");

const LinkedNote = require("../models/LinkedNote.model");
const { isAuthenticated } = require("../middleware/jwt.middleware.js");

// POST /api/linked-notes - Crear nota vinculada
router.post("/linked-notes", isAuthenticated, (req, res, next) => {
  const { text, client, property } = req.body;

  if (!text || !client || !property) {
    return res.status(400).json({ message: "Text, client and property are required." });
  }

  LinkedNote.create({
    text,
    client,
    property,
    agency: req.payload.agency,
  })
    .then((note) => res.status(201).json(note))
    .catch((err) => {
      console.log("Error creating linked note \n\n", err);
      res.status(500).json({ message: "Error creating linked note" });
    });
});

// GET /api/linked-notes/client/:clientId - Notas de un cliente
router.get("/linked-notes/client/:clientId", isAuthenticated, (req, res, next) => {
  const { clientId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(clientId)) {
    return res.status(400).json({ message: "Specified id is not valid" });
  }

  LinkedNote.find({ client: clientId, agency: req.payload.agency })
    .populate("property", "title location")
    .sort({ createdAt: -1 })
    .then((notes) => res.json(notes))
    .catch((err) => {
      console.log("Error getting linked notes \n\n", err);
      res.status(500).json({ message: "Error getting linked notes" });
    });
});

// GET /api/linked-notes/property/:propertyId - Notas de un inmueble
router.get("/linked-notes/property/:propertyId", isAuthenticated, (req, res, next) => {
  const { propertyId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(propertyId)) {
    return res.status(400).json({ message: "Specified id is not valid" });
  }

  LinkedNote.find({ property: propertyId, agency: req.payload.agency })
    .populate("client", "firstName lastName phone")
    .sort({ createdAt: -1 })
    .then((notes) => res.json(notes))
    .catch((err) => {
      console.log("Error getting linked notes \n\n", err);
      res.status(500).json({ message: "Error getting linked notes" });
    });
});

module.exports = router;