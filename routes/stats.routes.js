const express = require("express");
const router = express.Router();

const Property = require("../models/Property.model");
const ClientLead = require("../models/ClientLead.model");
const Owner = require("../models/Owner.model");
const { isAuthenticated } = require("../middleware/jwt.middleware.js");

// GET /api/stats - Estadísticas del dashboard
router.get("/stats", isAuthenticated, async (req, res, next) => {
  const agency = req.payload.agency;

  try {
    const [
      propertiesActive,
      propertiesArchived,
      clientsActive,
      clientsArchived,
      ownersActive,
      ownersArchived,
      propertiesByType,
      propertiesByOperation,
      propertiesByStatus,
    ] = await Promise.all([
      Property.countDocuments({ agency, isArchived: false }),
      Property.countDocuments({ agency, isArchived: true }),
      ClientLead.countDocuments({ agency, isArchived: false }),
      ClientLead.countDocuments({ agency, isArchived: true }),
      Owner.countDocuments({ agency, isArchived: false }),
      Owner.countDocuments({ agency, isArchived: true }),
      Property.aggregate([
        { $match: { agency: agency, isArchived: false } },
        { $group: { _id: "$propertyType", count: { $sum: 1 } } },
      ]),
      Property.aggregate([
        { $match: { agency: agency, isArchived: false } },
        { $group: { _id: "$operationType", count: { $sum: 1 } } },
      ]),
      Property.aggregate([
        { $match: { agency: agency, isArchived: false } },
        { $group: { _id: "$status", count: { $sum: 1 } } },
      ]),
    ]);

    res.json({
      propertiesActive,
      propertiesArchived,
      clientsActive,
      clientsArchived,
      ownersActive,
      ownersArchived,
      propertiesByType,
      propertiesByOperation,
      propertiesByStatus,
    });
  } catch (err) {
    console.log("Error getting stats \n\n", err);
    res.status(500).json({ message: "Error getting stats" });
  }
});

module.exports = router;