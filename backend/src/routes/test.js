const express = require("express");
const router = express.Router();
const db = require('../config/db');

// test
router.get("/", (req, res) => {
  res.json({
    message: "TEST running",
  });
});

// test firebase
router.get("/db-test", async (req, res) => {
  try {
    const ref = await db.collection("ping").add({
      ok: true,
      at: new Date().toISOString(),
    })

    res.json({ ok: true, id: ref.id })
  } catch (err) {
    res.status(500).json({ ok: false, message: err.message })
  }
})

module.exports = router;