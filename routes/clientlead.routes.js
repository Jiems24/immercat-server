const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");

const ClientLead = require("../models/ClientLead.model");

const { isAuthenticated } = require("../middleware/jwt.middleware.js");

// POST /api/clients - Crear un cliente
router.post("/clients", isAuthenticated, (req, res, next) => {
  ClientLead.create(req.body)
    .then((response) => res.status(201).json(response))
    .catch((err) => {
      console.log("Error creating a client ", err);
      res.status(500).json({ message: "Error creating a client" });
    });
});

// GET /api/clients - Listar clientes activos
router.get("/clients", isAuthenticated, (req, res, next) => {
  ClientLead.find({ isArchived: false })
    .then((allClients) => res.json(allClients))
    .catch((err) => {
      console.log("Error getting the list of clients ", err);
      res.status(500).json({ message: "Error getting the list of clients" });
    });
});

// GET /api/clients/archived - Listar clientes archivados (historial)
router.get("/clients/archived", isAuthenticated, (req, res, next) => {
  ClientLead.find({ isArchived: true })
    .then((archivedClients) => res.json(archivedClients))
    .catch((err) => {
      console.log("Error getting archived clients \n\n", err);
      res.status(500).json({ message: "Error getting archived clients" });
    });
});

// GET /api/clients/:clientId - Detalle de un cliente
router.get("/clients/:clientId", isAuthenticated, (req, res, next) => {
  const { clientId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(clientId)) {
    res.status(400).json({ message: "Specified id is not valid" });
    return;
  }

  ClientLead.findById(clientId)
    .then((client) => res.status(200).json(client))
    .catch((err) => {
      console.log("Error getting the client details ", err);
      res.status(500).json({ message: "Error getting the client details" });
    });
});

// PUT /api/clients/:clientId - Editar un cliente
router.put("/clients/:clientId", isAuthenticated, (req, res, next) => {
  const { clientId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(clientId)) {
    res.status(400).json({ message: "Specified id is not valid" });
    return;
  }

  ClientLead.findByIdAndUpdate(clientId, req.body, { new: true })
    .then((updatedClient) => res.json(updatedClient))
    .catch((err) => {
      console.log("Error updating the client ", err);
      res.status(500).json({ message: "Error updating the client" });
    });
});

// PUT /api/clients/:clientId/archive - Archivar un cliente
router.put("/clients/:clientId/archive", isAuthenticated, (req, res, next) => {
  const { clientId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(clientId)) {
    res.status(400).json({ message: "Specified id is not valid" });
    return;
  }

  ClientLead.findByIdAndUpdate(clientId, { isArchived: true }, { new: true })
    .then((archivedClient) => res.json(archivedClient))
    .catch((err) => {
      console.log("Error archiving the client ", err);
      res.status(500).json({ message: "Error archiving the client" });
    });
});

// DELETE /api/clients/:clientId - Eliminar un cliente definitivamente
router.delete("/clients/:clientId", isAuthenticated, (req, res, next) => {
  const { clientId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(clientId)) {
    res.status(400).json({ message: "Specified id is not valid" });
    return;
  }

  ClientLead.findByIdAndDelete(clientId)
    .then(() => res.json({ message: "Client deleted successfully" }))
    .catch((err) => {
      console.log("Error deleting the client \n\n", err);
      res.status(500).json({ message: "Error deleting the client" });
    });
});

module.exports = router;