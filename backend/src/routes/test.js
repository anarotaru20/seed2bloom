const express = require("express");
const router = express.Router();

// test
router.get("/", (req, res) => {
  res.json({
    message: "TEST running",
  });
});

module.exports = router;