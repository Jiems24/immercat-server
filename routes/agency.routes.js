const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");

const Agency = require("../models/Agency.model");
const { isAuthenticated } = require("../middleware/jwt.middleware.js");

// POST /api/agencies - Crear inmobiliaria
router.post("/agencies", isAuthenticated, (req, res, next) => {
  Agency.create(req.body)
    .then((response) => res.status(201).json(response))
    .catch((err) => {
      console.log("Error creating an agency \n\n", err);
      res.status(500).json({ message: "Error creating an agency" });
    });
});

// GET /api/agencies - Listar todas las inmobiliarias
router.get("/agencies", isAuthenticated, (req, res, next) => {
  Agency.find()
    .then((allAgencies) => res.json(allAgencies))
    .catch((err) => {
      console.log("Error getting the list of agencies \n\n", err);
      res.status(500).json({ message: "Error getting the list of agencies" });
    });
});

// GET /api/agencies/:agencyId - Detalle de una inmobiliaria
router.get("/agencies/:agencyId", isAuthenticated, (req, res, next) => {
  const { agencyId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(agencyId)) {
    res.status(400).json({ message: "Specified id is not valid" });
    return;
  }

  Agency.findById(agencyId)
    .then((agency) => {
      if (!agency) {
        return res.status(404).json({ message: "Agency not found" });
      }
      res.status(200).json(agency);
    })
    .catch((err) => {
      console.log("Error getting the agency details \n\n", err);
      res.status(500).json({ message: "Error getting the agency details" });
    });
});

// PUT /api/agencies/:agencyId - Editar inmobiliaria
router.put("/agencies/:agencyId", isAuthenticated, (req, res, next) => {
  const { agencyId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(agencyId)) {
    res.status(400).json({ message: "Specified id is not valid" });
    return;
  }

  Agency.findByIdAndUpdate(agencyId, req.body, { new: true })
    .then((updatedAgency) => {
      if (!updatedAgency) {
        return res.status(404).json({ message: "Agency not found" });
      }
      res.json(updatedAgency);
    })
    .catch((err) => {
      console.log("Error updating the agency \n\n", err);
      res.status(500).json({ message: "Error updating the agency" });
    });
});

// DELETE /api/agencies/:agencyId - Eliminar inmobiliaria
router.delete("/agencies/:agencyId", isAuthenticated, (req, res, next) => {
  const { agencyId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(agencyId)) {
    res.status(400).json({ message: "Specified id is not valid" });
    return;
  }

  Agency.findByIdAndDelete(agencyId)
    .then((deletedAgency) => {
      if (!deletedAgency) {
        return res.status(404).json({ message: "Agency not found" });
      }
      res.json({ message: "Agency deleted successfully" });
    })
    .catch((err) => {
      console.log("Error deleting the agency \n\n", err);
      res.status(500).json({ message: "Error deleting the agency" });
    });
});

module.exports = router;