const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");

const Property = require("../models/Property.model");

// GET /public/properties - Listar inmuebles disponibles
router.get("/properties", (req, res, next) => {
  const { propertyType, operationType, maxPrice } = req.query;
  const page = parseInt(req.query.page) || 1;
  const limit = 10;
  const skip = (page - 1) * limit;

  const filter = {
    isArchived: false,
    status: "disponible",
  };

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

  Promise.all([
    Property.find(filter)
      .select("-address -owner -realOwner -isArchived")
      .populate("agency", "name city")
      .skip(skip)
      .limit(limit),
    Property.countDocuments(filter)
  ])
    .then(([properties, total]) => {
      res.json({
        properties,
        totalPages: Math.ceil(total / limit),
        currentPage: page,
      });
    })
    .catch((err) => {
      console.log("Error getting public properties \n\n", err);
      res.status(500).json({ message: "Error getting public properties" });
    });
});

// GET /public/properties/:propertyId - Detalle público
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