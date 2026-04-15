const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");

const Property = require("../models/Property.model");
const { isAuthenticated } = require("../middleware/jwt.middleware.js");
const uploadImages = require("../config/cloudinary.config.js"); // NUEVO

// POST /api/properties - Crear inmueble
router.post("/properties", isAuthenticated, uploadImages.array("images", 4), (req, res, next) => {
  const imageUrls = req.files ? req.files.map((file) => file.path) : [];

  const newProperty = {
    ...req.body,
    owner: req.payload._id,
    agency: req.payload.agency,
    images: imageUrls,
  };

  Property.create(newProperty)
    .then((response) => res.status(201).json(response))
    .catch((err) => {
      console.log("Error creating a property \n\n", err);
      res.status(500).json({ message: "Error creating a property" });
    });
});

// GET /api/properties - Listar activos
router.get("/properties", isAuthenticated, (req, res, next) => {
  Property.find({ isArchived: false, agency: req.payload.agency })
    .populate("owner", "name email")
    .populate("realOwner", "firstName lastName")
    .populate("agency", "name city")
    .then((allProperties) => res.json(allProperties))
    .catch((err) => {
      console.log("Error getting the list of properties \n\n", err);
      res.status(500).json({ message: "Error getting the list of properties" });
    });
});

// GET /api/properties/archived - Listar archivados
router.get("/properties/archived", isAuthenticated, (req, res, next) => {
  Property.find({ isArchived: true, agency: req.payload.agency })
    .populate("owner", "name email")
    .populate("realOwner", "firstName lastName")
    .populate("agency", "name city")
    .then((archivedProperties) => res.json(archivedProperties))
    .catch((err) => {
      console.log("Error getting archived properties \n\n", err);
      res.status(500).json({ message: "Error getting archived properties" });
    });
});

// GET /api/properties/:propertyId - Detalle
router.get("/properties/:propertyId", isAuthenticated, (req, res, next) => {
  const { propertyId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(propertyId)) {
    res.status(400).json({ message: "Specified id is not valid" });
    return;
  }

  Property.findOne({ _id: propertyId, agency: req.payload.agency })
    .populate("owner", "name email")
    .populate("realOwner", "firstName lastName phone email")
    .populate("agency", "name city")
    .then((property) => {
      if (!property) {
        return res.status(404).json({ message: "Property not found" });
      }
      res.status(200).json(property);
    })
    .catch((err) => {
      console.log("Error getting the property details \n\n", err);
      res.status(500).json({ message: "Error getting the property details" });
    });
});

// PUT /api/properties/:propertyId - Editar
router.put("/properties/:propertyId", isAuthenticated, uploadImages.array("images", 4), (req, res, next) => {
  const { propertyId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(propertyId)) {
    res.status(400).json({ message: "Specified id is not valid" });
    return;
  }

  const imageUrls = req.files ? req.files.map((file) => file.path) : [];
  const updateData = { ...req.body };
  if (imageUrls.length > 0) {
    updateData.images = imageUrls;
  }

  Property.findOneAndUpdate(
    { _id: propertyId, agency: req.payload.agency },
    updateData,
    { new: true }
  )
    .then((updatedProperty) => {
      if (!updatedProperty) {
        return res.status(404).json({ message: "Property not found" });
      }
      res.json(updatedProperty);
    })
    .catch((err) => {
      console.log("Error updating the property \n\n", err);
      res.status(500).json({ message: "Error updating the property" });
    });
});

// PUT /api/properties/:propertyId/archive - Archivar
router.put("/properties/:propertyId/archive", isAuthenticated, (req, res, next) => {
  const { propertyId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(propertyId)) {
    res.status(400).json({ message: "Specified id is not valid" });
    return;
  }

  Property.findOneAndUpdate(
    { _id: propertyId, agency: req.payload.agency },
    { isArchived: true },
    { new: true }
  )
    .then((archivedProperty) => {
      if (!archivedProperty) {
        return res.status(404).json({ message: "Property not found" });
      }
      res.json(archivedProperty);
    })
    .catch((err) => {
      console.log("Error archiving the property \n\n", err);
      res.status(500).json({ message: "Error archiving the property" });
    });
});

// DELETE /api/properties/:propertyId - Eliminar
router.delete("/properties/:propertyId", isAuthenticated, (req, res, next) => {
  const { propertyId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(propertyId)) {
    res.status(400).json({ message: "Specified id is not valid" });
    return;
  }

  Property.findOneAndDelete({ _id: propertyId, agency: req.payload.agency })
    .then((deletedProperty) => {
      if (!deletedProperty) {
        return res.status(404).json({ message: "Property not found" });
      }
      res.json({ message: "Property deleted successfully" });
    })
    .catch((err) => {
      console.log("Error deleting the property \n\n", err);
      res.status(500).json({ message: "Error deleting the property" });
    });
});

module.exports = router;