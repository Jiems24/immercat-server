const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");

const ClientLead = require("../models/ClientLead.model");
const { isAuthenticated } = require("../middleware/jwt.middleware.js");

// POST /api/clients - Crear cliente
router.post("/clients", isAuthenticated, (req, res, next) => {
  const newClient = {
    ...req.body,
    agency: req.payload.agency,
  };

  ClientLead.create(newClient)
    .then((response) => res.status(201).json(response))
    .catch((err) => {
      console.log("Error creating a client \n\n", err);
      res.status(500).json({ message: "Error creating a client" });
    });
});

// GET /api/clients - Listar activos
router.get("/clients", isAuthenticated, (req, res, next) => {
  const page = parseInt(req.query.page) || 1;
  const limit = 10;
  const skip = (page - 1) * limit;

  const filter = { isArchived: false, agency: req.payload.agency };

  Promise.all([
    ClientLead.find(filter).skip(skip).limit(limit),
    ClientLead.countDocuments(filter)
  ])
    .then(([clients, total]) => {
      res.json({
        clients,
        totalPages: Math.ceil(total / limit),
        currentPage: page,
      });
    })
    .catch((err) => {
      console.log("Error getting the list of clients \n\n", err);
      res.status(500).json({ message: "Error getting the list of clients" });
    });
});

// GET /api/clients/archived - Listar archivados
router.get("/clients/archived", isAuthenticated, (req, res, next) => {
  const page = parseInt(req.query.page) || 1;
  const limit = 10;
  const skip = (page - 1) * limit;

  const filter = { isArchived: true, agency: req.payload.agency };

  Promise.all([
    ClientLead.find(filter).skip(skip).limit(limit),
    ClientLead.countDocuments(filter)
  ])
    .then(([clients, total]) => {
      res.json({
        clients,
        totalPages: Math.ceil(total / limit),
        currentPage: page,
      });
    })
    .catch((err) => {
      console.log("Error getting archived clients \n\n", err);
      res.status(500).json({ message: "Error getting archived clients" });
    });
});

// GET /api/clients/:clientId - Detalle
router.get("/clients/:clientId", isAuthenticated, (req, res, next) => {
  const { clientId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(clientId)) {
    res.status(400).json({ message: "Specified id is not valid" });
    return;
  }

  ClientLead.findOne({ _id: clientId, agency: req.payload.agency })
    .then((client) => {
      if (!client) {
        return res.status(404).json({ message: "Client not found" });
      }
      res.status(200).json(client);
    })
    .catch((err) => {
      console.log("Error getting the client details \n\n", err);
      res.status(500).json({ message: "Error getting the client details" });
    });
});

// PUT /api/clients/:clientId - Editar
router.put("/clients/:clientId", isAuthenticated, (req, res, next) => {
  const { clientId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(clientId)) {
    res.status(400).json({ message: "Specified id is not valid" });
    return;
  }

  ClientLead.findOneAndUpdate(
    { _id: clientId, agency: req.payload.agency },
    req.body,
    { new: true }
  )
    .then((updatedClient) => {
      if (!updatedClient) {
        return res.status(404).json({ message: "Client not found" });
      }
      res.json(updatedClient);
    })
    .catch((err) => {
      console.log("Error updating the client \n\n", err);
      res.status(500).json({ message: "Error updating the client" });
    });
});

// PUT /api/clients/:clientId/archive - Archivar
router.put("/clients/:clientId/archive", isAuthenticated, (req, res, next) => {
  const { clientId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(clientId)) {
    res.status(400).json({ message: "Specified id is not valid" });
    return;
  }

  ClientLead.findOneAndUpdate(
    { _id: clientId, agency: req.payload.agency },
    { isArchived: true },
    { new: true }
  )
    .then((archivedClient) => {
      if (!archivedClient) {
        return res.status(404).json({ message: "Client not found" });
      }
      res.json(archivedClient);
    })
    .catch((err) => {
      console.log("Error archiving the client \n\n", err);
      res.status(500).json({ message: "Error archiving the client" });
    });
});

// PUT /api/clients/:clientId/notes - Añadir nota
router.put("/clients/:clientId/notes", isAuthenticated, (req, res, next) => {
  const { clientId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(clientId)) {
    res.status(400).json({ message: "Specified id is not valid" });
    return;
  }

  const { notes } = req.body;

  ClientLead.findOneAndUpdate(
    { _id: clientId, agency: req.payload.agency },
    { notes },
    { new: true }
  )
    .then((updatedClient) => {
      if (!updatedClient) {
        return res.status(404).json({ message: "Client not found" });
      }
      res.json(updatedClient);
    })
    .catch((err) => {
      console.log("Error updating notes \n\n", err);
      res.status(500).json({ message: "Error updating notes" });
    });
});

// DELETE /api/clients/:clientId - Eliminar
router.delete("/clients/:clientId", isAuthenticated, (req, res, next) => {
  const { clientId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(clientId)) {
    res.status(400).json({ message: "Specified id is not valid" });
    return;
  }

  ClientLead.findOneAndDelete({ _id: clientId, agency: req.payload.agency })
    .then((deletedClient) => {
      if (!deletedClient) {
        return res.status(404).json({ message: "Client not found" });
      }
      res.json({ message: "Client deleted successfully" });
    })
    .catch((err) => {
      console.log("Error deleting the client \n\n", err);
      res.status(500).json({ message: "Error deleting the client" });
    });
});

module.exports = router;