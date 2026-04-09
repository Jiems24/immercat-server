const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");

const Property = require("../models/Property.model");

const { isAuthenticated } = require("../middleware/jwt.middleware.js");

// POST /api/properties - Crear un inmueble
router.post("/properties", isAuthenticated, (req, res, next) => {
  const newProperty = {
    ...req.body,
    owner: req.payload._id,
  };

  Property.create(newProperty)
    .then((response) => res.status(201).json(response))
    .catch((err) => {
      console.log("Error creating a property \n\n", err);
      res.status(500).json({ message: "Error creating a property" });
    });
});

// GET /api/properties - Listar inmuebles activos
router.get("/properties", isAuthenticated, (req, res, next) => {
  Property.find({ isArchived: false })
    .populate("owner", "name email")
    .then((allProperties) => res.json(allProperties))
    .catch((err) => {
      console.log("Error getting the list of properties \n\n", err);
      res.status(500).json({ message: "Error getting the list of properties" });
    });
});

// GET /api/properties/archived - Listar inmuebles archivados (historial)
router.get("/properties/archived", isAuthenticated, (req, res, next) => {
  Property.find({ isArchived: true })
    .populate("owner", "name email")
    .then((archivedProperties) => res.json(archivedProperties))
    .catch((err) => {
      console.log("Error getting archived properties \n\n", err);
      res.status(500).json({ message: "Error getting archived properties" });
    });
});

// GET /api/properties/:propertyId - Detalle de un inmueble
router.get("/properties/:propertyId", isAuthenticated, (req, res, next) => {
  const { propertyId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(propertyId)) {
    res.status(400).json({ message: "Specified id is not valid" });
    return;
  }

  Property.findById(propertyId)
    .populate("owner", "name email")
    .then((property) => res.status(200).json(property))
    .catch((err) => {
      console.log("Error getting the property details \n\n", err);
      res.status(500).json({ message: "Error getting the property details" });
    });
});

// PUT /api/properties/:propertyId - Editar un inmueble
router.put("/properties/:propertyId", isAuthenticated, (req, res, next) => {
  const { propertyId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(propertyId)) {
    res.status(400).json({ message: "Specified id is not valid" });
    return;
  }

  Property.findByIdAndUpdate(propertyId, req.body, { new: true })
    .then((updatedProperty) => res.json(updatedProperty))
    .catch((err) => {
      console.log("Error updating the property \n\n", err);
      res.status(500).json({ message: "Error updating the property" });
    });
});

// PUT /api/properties/:propertyId/archive - Archivar un inmueble
router.put("/properties/:propertyId/archive", isAuthenticated, (req, res, next) => {
  const { propertyId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(propertyId)) {
    res.status(400).json({ message: "Specified id is not valid" });
    return;
  }

  Property.findByIdAndUpdate(propertyId, { isArchived: true }, { new: true })
    .then((archivedProperty) => res.json(archivedProperty))
    .catch((err) => {
      console.log("Error archiving the property \n\n", err);
      res.status(500).json({ message: "Error archiving the property" });
    });
});

// DELETE /api/properties/:propertyId - Eliminar un inmueble definitivamente
router.delete("/properties/:propertyId", isAuthenticated, (req, res, next) => {
  const { propertyId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(propertyId)) {
    res.status(400).json({ message: "Specified id is not valid" });
    return;
  }

  Property.findByIdAndDelete(propertyId)
    .then(() => res.json({ message: "Property deleted successfully" }))
    .catch((err) => {
      console.log("Error deleting the property \n\n", err);
      res.status(500).json({ message: "Error deleting the property" });
    });
});

module.exports = router;