const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");

const Owner = require("../models/Owner.model");

const { isAuthenticated } = require("../middleware/jwt.middleware.js");

// POST /api/owners - Crear un propietario
router.post("/owners", isAuthenticated, (req, res, next) => {
  Owner.create(req.body)
    .then((response) => res.status(201).json(response))
    .catch((err) => {
      console.log("Error creating an owner \n\n", err);
      res.status(500).json({ message: "Error creating an owner" });
    });
});

// GET /api/owners - Listar propietarios activos
router.get("/owners", isAuthenticated, (req, res, next) => {
  Owner.find({ isArchived: false })
    .then((allOwners) => res.json(allOwners))
    .catch((err) => {
      console.log("Error getting the list of owners \n\n", err);
      res.status(500).json({ message: "Error getting the list of owners" });
    });
});

// GET /api/owners/archived - Listar propietarios archivados
router.get("/owners/archived", isAuthenticated, (req, res, next) => {
  Owner.find({ isArchived: true })
    .then((archivedOwners) => res.json(archivedOwners))
    .catch((err) => {
      console.log("Error getting archived owners \n\n", err);
      res.status(500).json({ message: "Error getting archived owners" });
    });
});

// GET /api/owners/:ownerId - Detalle de un propietario
router.get("/owners/:ownerId", isAuthenticated, (req, res, next) => {
  const { ownerId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(ownerId)) {
    res.status(400).json({ message: "Specified id is not valid" });
    return;
  }

  Owner.findById(ownerId)
    .then((owner) => res.status(200).json(owner))
    .catch((err) => {
      console.log("Error getting the owner details \n\n", err);
      res.status(500).json({ message: "Error getting the owner details" });
    });
});

// PUT /api/owners/:ownerId - Editar un propietario
router.put("/owners/:ownerId", isAuthenticated, (req, res, next) => {
  const { ownerId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(ownerId)) {
    res.status(400).json({ message: "Specified id is not valid" });
    return;
  }

  Owner.findByIdAndUpdate(ownerId, req.body, { new: true })
    .then((updatedOwner) => res.json(updatedOwner))
    .catch((err) => {
      console.log("Error updating the owner \n\n", err);
      res.status(500).json({ message: "Error updating the owner" });
    });
});

// PUT /api/owners/:ownerId/archive - Archivar un propietario
router.put("/owners/:ownerId/archive", isAuthenticated, (req, res, next) => {
  const { ownerId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(ownerId)) {
    res.status(400).json({ message: "Specified id is not valid" });
    return;
  }

  Owner.findByIdAndUpdate(ownerId, { isArchived: true }, { new: true })
    .then((archivedOwner) => res.json(archivedOwner))
    .catch((err) => {
      console.log("Error archiving the owner \n\n", err);
      res.status(500).json({ message: "Error archiving the owner" });
    });
});

// DELETE /api/owners/:ownerId - Eliminar un propietario definitivamente
router.delete("/owners/:ownerId", isAuthenticated, (req, res, next) => {
  const { ownerId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(ownerId)) {
    res.status(400).json({ message: "Specified id is not valid" });
    return;
  }

  Owner.findByIdAndDelete(ownerId)
    .then(() => res.json({ message: "Owner deleted successfully" }))
    .catch((err) => {
      console.log("Error deleting the owner \n\n", err);
      res.status(500).json({ message: "Error deleting the owner" });
    });
});

module.exports = router;