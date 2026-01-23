const express = require("express");
const router = express.Router();
const requireAuth = require("../middleware/auth");
const {
  addLocation,
  updateLocation,
  deleteLocation,
  getLocations,
} = require("../controllers/locations");

router.get("/locations", requireAuth, getLocations);
router.post("/locations", requireAuth, addLocation);
router.patch("/locations/:id", requireAuth, updateLocation);
router.delete("/locations/:id", requireAuth, deleteLocation);

module.exports = router;
