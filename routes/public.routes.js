const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");

const Property = require("../models/Property.model");

// GET /public/properties - Listar inmuebles disponibles (con nombre de inmobiliaria)
router.get("/properties", (req, res, next) => {
  const { propertyType, operationType, maxPrice } = req.query;

  const filter = {
    isArchived: false,
    status: "disponible",
  };

  // propertyType puede ser un valor o varios separados por coma: "piso,casa"
  if (propertyType) {
    const types = propertyType.split(",");
    filter.propertyType = { $in: types };
  }

  if (operationType) {
    filter.operationType = operationType;
  }

  if (maxPrice) {
    filter.price = { $lte: Number(maxPrice) };
  }

  Property.find(filter)
    .select("-address -owner -realOwner -isArchived")
    .populate("agency", "name city")
    .then((properties) => res.json(properties))
    .catch((err) => {
      console.log("Error getting public properties \n\n", err);
      res.status(500).json({ message: "Error getting public properties" });
    });
});

// GET /public/properties/:propertyId - Detalle público (con nombre de inmobiliaria)
router.get("/properties/:propertyId", (req, res, next) => {
  const { propertyId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(propertyId)) {
    res.status(400).json({ message: "Specified id is not valid" });
    return;
  }

  Property.findById(propertyId)
    .select("-address -owner -realOwner -isArchived")
    .populate("agency", "name city")
    .then((property) => {
      if (!property) {
        return res.status(404).json({ message: "Property not found" });
      }
      res.status(200).json(property);
    })
    .catch((err) => {
      console.log("Error getting public property details \n\n", err);
      res.status(500).json({ message: "Error getting public property details" });
    });
});

module.exports = router;