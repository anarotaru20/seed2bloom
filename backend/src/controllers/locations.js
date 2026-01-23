const { db } = require("../config/db");

const str = (v) => (typeof v === "string" ? v.trim() : "");

const allowedLights = new Set([
  "Low light",
  "Medium light",
  "Bright light",
  "Direct light",
]);

async function addLocation(req, res) {
  try {
    const uid = req.user?.uid;
    if (!uid) return res.status(401).json({ message: "Unauthorized" });

    const name = str(req.body?.name);
    const room = str(req.body?.room);
    const light = str(req.body?.light);
    const notes = str(req.body?.notes);

    if (!name) return res.status(400).json({ message: "name is required" });
    if (!room) return res.status(400).json({ message: "room is required" });
    if (!light) return res.status(400).json({ message: "light is required" });

    if (name.length > 60)
      return res.status(400).json({ message: "name must be <= 60 chars" });
    if (room.length > 60)
      return res.status(400).json({ message: "room must be <= 60 chars" });
    if (light.length > 40)
      return res.status(400).json({ message: "light must be <= 40 chars" });
    if (notes && notes.length > 240)
      return res.status(400).json({ message: "notes must be <= 240 chars" });

    if (light && !allowedLights.has(light))
      return res.status(400).json({
        message: `light must be one of: ${Array.from(allowedLights).join(", ")}`,
      });

    const now = new Date().toISOString();

    const doc = {
      name,
      room,
      light,
      notes: notes || null,
      timestamps: {
        createdAt: now,
        updatedAt: now,
      },
    };

    const ref = await db
      .collection("users")
      .doc(uid)
      .collection("locations")
      .add(doc);

    return res.status(201).json({ location: { id: ref.id, ...doc } });
  } catch {
    return res.status(500).json({ message: "Failed to add location" });
  }
}

async function updateLocation(req, res) {
  try {
    const uid = req.user?.uid;
    if (!uid) return res.status(401).json({ message: "Unauthorized" });

    const id = str(req.params?.id);
    if (!id) return res.status(400).json({ message: "id is required" });

    const name = str(req.body?.name);
    const room = str(req.body?.room);
    const light = str(req.body?.light);
    const notes = str(req.body?.notes);

    if (!name) return res.status(400).json({ message: "name is required" });
    if (!room) return res.status(400).json({ message: "room is required" });
    if (!light) return res.status(400).json({ message: "light is required" });

    if (name.length > 60)
      return res.status(400).json({ message: "name must be <= 60 chars" });
    if (room.length > 60)
      return res.status(400).json({ message: "room must be <= 60 chars" });
    if (light.length > 40)
      return res.status(400).json({ message: "light must be <= 40 chars" });
    if (notes && notes.length > 240)
      return res.status(400).json({ message: "notes must be <= 240 chars" });

    if (light && !allowedLights.has(light))
      return res.status(400).json({
        message: `light must be one of: ${Array.from(allowedLights).join(", ")}`,
      });

    const ref = db.collection("users").doc(uid).collection("locations").doc(id);
    const snap = await ref.get();
    if (!snap.exists)
      return res.status(404).json({ message: "Location not found" });

    const now = new Date().toISOString();

    await ref.update({
      name,
      room,
      light,
      notes: notes || null,
      "timestamps.updatedAt": now,
    });

    const updated = await ref.get();
    return res
      .status(200)
      .json({ location: { id: updated.id, ...updated.data() } });
  } catch {
    return res.status(500).json({ message: "Failed to update location" });
  }
}

async function deleteLocation(req, res) {
  try {
    const uid = req.user?.uid;
    if (!uid) return res.status(401).json({ message: "Unauthorized" });

    const id = str(req.params?.id);
    if (!id) return res.status(400).json({ message: "id is required" });

    const ref = db.collection("users").doc(uid).collection("locations").doc(id);
    const snap = await ref.get();
    if (!snap.exists)
      return res.status(404).json({ message: "Location not found" });

    await ref.delete();
    return res.status(204).send();
  } catch {
    return res.status(500).json({ message: "Failed to delete location" });
  }
}

async function getLocations(req, res) {
  try {
    const uid = req.user?.uid;
    if (!uid) return res.status(401).json({ message: "Unauthorized" });

    const snap = await db
      .collection("users")
      .doc(uid)
      .collection("locations")
      .orderBy("timestamps.createdAt", "desc")
      .get();

    const locations = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
    return res.status(200).json({ locations });
  } catch {
    return res.status(500).json({ message: "Failed to fetch locations" });
  }
}

module.exports = { addLocation, updateLocation, deleteLocation, getLocations };
