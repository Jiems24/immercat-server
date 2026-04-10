const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");

const Owner = require("../models/Owner.model");
const { isAuthenticated } = require("../middleware/jwt.middleware.js");

// POST /api/owners - Crear propietario (asigna agency desde el token)
router.post("/owners", isAuthenticated, (req, res, next) => {
  const newOwner = {
    ...req.body,
    agency: req.payload.agency,
  };

  Owner.create(newOwner)
    .then((response) => res.status(201).json(response))
    .catch((err) => {
      console.log("Error creating an owner \n\n", err);
      res.status(500).json({ message: "Error creating an owner" });
    });
});

// GET /api/owners - Listar activos de la agency del usuario
router.get("/owners", isAuthenticated, (req, res, next) => {
  Owner.find({ isArchived: false, agency: req.payload.agency })
    .then((allOwners) => res.json(allOwners))
    .catch((err) => {
      console.log("Error getting the list of owners \n\n", err);
      res.status(500).json({ message: "Error getting the list of owners" });
    });
});

// GET /api/owners/archived - Listar archivados de la agency del usuario
router.get("/owners/archived", isAuthenticated, (req, res, next) => {
  Owner.find({ isArchived: true, agency: req.payload.agency })
    .then((archivedOwners) => res.json(archivedOwners))
    .catch((err) => {
      console.log("Error getting archived owners \n\n", err);
      res.status(500).json({ message: "Error getting archived owners" });
    });
});

// GET /api/owners/:ownerId - Detalle (solo si pertenece a su agency)
router.get("/owners/:ownerId", isAuthenticated, (req, res, next) => {
  const { ownerId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(ownerId)) {
    res.status(400).json({ message: "Specified id is not valid" });
    return;
  }

  Owner.findOne({ _id: ownerId, agency: req.payload.agency })
    .then((owner) => {
      if (!owner) {
        return res.status(404).json({ message: "Owner not found" });
      }
      res.status(200).json(owner);
    })
    .catch((err) => {
      console.log("Error getting the owner details \n\n", err);
      res.status(500).json({ message: "Error getting the owner details" });
    });
});

// PUT /api/owners/:ownerId - Editar (solo si pertenece a su agency)
router.put("/owners/:ownerId", isAuthenticated, (req, res, next) => {
  const { ownerId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(ownerId)) {
    res.status(400).json({ message: "Specified id is not valid" });
    return;
  }

  Owner.findOneAndUpdate(
    { _id: ownerId, agency: req.payload.agency },
    req.body,
    { new: true }
  )
    .then((updatedOwner) => {
      if (!updatedOwner) {
        return res.status(404).json({ message: "Owner not found" });
      }
      res.json(updatedOwner);
    })
    .catch((err) => {
      console.log("Error updating the owner \n\n", err);
      res.status(500).json({ message: "Error updating the owner" });
    });
});

// PUT /api/owners/:ownerId/archive - Archivar (solo si pertenece a su agency)
router.put("/owners/:ownerId/archive", isAuthenticated, (req, res, next) => {
  const { ownerId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(ownerId)) {
    res.status(400).json({ message: "Specified id is not valid" });
    return;
  }

  Owner.findOneAndUpdate(
    { _id: ownerId, agency: req.payload.agency },
    { isArchived: true },
    { new: true }
  )
    .then((archivedOwner) => {
      if (!archivedOwner) {
        return res.status(404).json({ message: "Owner not found" });
      }
      res.json(archivedOwner);
    })
    .catch((err) => {
      console.log("Error archiving the owner \n\n", err);
      res.status(500).json({ message: "Error archiving the owner" });
    });
});

// DELETE /api/owners/:ownerId - Eliminar (solo si pertenece a su agency)
router.delete("/owners/:ownerId", isAuthenticated, (req, res, next) => {
  const { ownerId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(ownerId)) {
    res.status(400).json({ message: "Specified id is not valid" });
    return;
  }

  Owner.findOneAndDelete({ _id: ownerId, agency: req.payload.agency })
    .then((deletedOwner) => {
      if (!deletedOwner) {
        return res.status(404).json({ message: "Owner not found" });
      }
      res.json({ message: "Owner deleted successfully" });
    })
    .catch((err) => {
      console.log("Error deleting the owner \n\n", err);
      res.status(500).json({ message: "Error deleting the owner" });
    });
});

module.exports = router;