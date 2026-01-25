const { db } = require("../config/db");

const str = (v) => (typeof v === "string" ? v.trim() : "");

const isHttpUrl = (v) => {
  if (!v) return true;
  if (typeof v !== "string") return false;
  const s = v.trim();
  if (!s) return true;
  try {
    const u = new URL(s);
    return u.protocol === "http:" || u.protocol === "https:";
  } catch {
    return false;
  }
};

async function addPlant(req, res) {
  try {
    const uid = req.user?.uid;
    if (!uid) return res.status(401).json({ message: "Unauthorized" });

    const templateId = str(req.body?.templateId);
    const location = str(req.body?.location);
    const waterEveryDays = Number(req.body?.waterEveryDays);
    const notes = str(req.body?.notes);
    const photoUrlRaw = str(req.body?.photoUrl);
    const photoUrl = photoUrlRaw || null;

    if (!templateId)
      return res.status(400).json({ message: "templateId is required" });
    if (!location)
      return res.status(400).json({ message: "location is required" });
    if (!Number.isFinite(waterEveryDays) || waterEveryDays <= 0)
      return res.status(400).json({ message: "waterEveryDays must be > 0" });
    if (!isHttpUrl(photoUrl))
      return res.status(400).json({ message: "photoUrl must be a valid http(s) URL" });

    const tplSnap = await db.collection("plantCatalog").doc(templateId).get();
    if (!tplSnap.exists)
      return res.status(400).json({ message: "Invalid templateId" });

    const tpl = tplSnap.data();
    const now = new Date().toISOString();

    const doc = {
      template: {
        id: templateId,
        slug: tpl.slug || null,
        commonName: tpl.commonName || null,
        species: tpl.species || null,
        tags: Array.isArray(tpl.tags) ? tpl.tags : [],
        care: {
          light: tpl.light || null,
          water: tpl.water || null,
          petSafe: Boolean(tpl.petSafe),
        },
        imageUrl: tpl.imageUrl || null,
        description: tpl.description || null,
      },
      photoUrl: photoUrl || tpl.imageUrl || null,
      settings: {
        location,
        waterEveryDays: Math.trunc(waterEveryDays),
        notes: notes || null,
      },
      timestamps: {
        lastWateredAt: now,
        createdAt: now,
        updatedAt: now,
      },
    };

    const ref = await db
      .collection("users")
      .doc(uid)
      .collection("myPlants")
      .add(doc);

    return res.status(201).json({ plant: { id: ref.id, ...doc } });
  } catch {
    return res.status(500).json({ message: "Failed to add plant" });
  }
}

async function updatePlant(req, res) {
  try {
    const uid = req.user?.uid;
    if (!uid) return res.status(401).json({ message: "Unauthorized" });

    const id = str(req.params?.id);
    if (!id) return res.status(400).json({ message: "id is required" });

    const ref = db.collection("users").doc(uid).collection("myPlants").doc(id);
    const snap = await ref.get();
    if (!snap.exists) return res.status(404).json({ message: "Plant not found" });

    const now = new Date().toISOString();
    const patch = {};

    if ("location" in (req.body || {})) {
      const location = str(req.body?.location);
      if (!location) return res.status(400).json({ message: "location is required" });
      patch["settings.location"] = location;
    }

    if ("waterEveryDays" in (req.body || {})) {
      const waterEveryDays = Number(req.body?.waterEveryDays);
      if (!Number.isFinite(waterEveryDays) || waterEveryDays <= 0)
        return res.status(400).json({ message: "waterEveryDays must be > 0" });
      patch["settings.waterEveryDays"] = Math.trunc(waterEveryDays);
    }

    if ("notes" in (req.body || {})) {
      const notes = str(req.body?.notes);
      patch["settings.notes"] = notes || null;
    }

    if ("photoUrl" in (req.body || {})) {
      const photoUrlRaw = str(req.body?.photoUrl);
      const photoUrl = photoUrlRaw || null;
      if (!isHttpUrl(photoUrl))
        return res.status(400).json({ message: "photoUrl must be a valid http(s) URL" });
      patch["photoUrl"] = photoUrl;
    }

    if ("timestamps" in (req.body || {})) {
      const last = req.body?.timestamps?.lastWateredAt;
      const lastStr = typeof last === "string" ? last.trim() : "";
      if (!lastStr)
        return res.status(400).json({ message: "timestamps.lastWateredAt is required" });
      patch["timestamps.lastWateredAt"] = lastStr;
    }

    if ("lastWateredAt" in (req.body || {})) {
      const last = str(req.body?.lastWateredAt);
      if (!last) return res.status(400).json({ message: "lastWateredAt is required" });
      patch["timestamps.lastWateredAt"] = last;
    }

    if (!Object.keys(patch).length)
      return res.status(400).json({ message: "No valid fields to update" });

    patch["timestamps.updatedAt"] = now;

    await ref.update(patch);

    const updated = await ref.get();
    const data = updated.data();
    return res.status(200).json({ plant: { id: updated.id, ...data } });
  } catch {
    return res.status(500).json({ message: "Failed to update plant" });
  }
}

async function deletePlant(req, res) {
  try {
    const uid = req.user?.uid;
    if (!uid) return res.status(401).json({ message: "Unauthorized" });

    const id = str(req.params?.id);
    if (!id) return res.status(400).json({ message: "id is required" });

    const ref = db.collection("users").doc(uid).collection("myPlants").doc(id);
    const snap = await ref.get();
    if (!snap.exists) return res.status(404).json({ message: "Plant not found" });

    await ref.delete();
    return res.status(204).send();
  } catch {
    return res.status(500).json({ message: "Failed to delete plant" });
  }
}

async function getPlants(req, res) {
  try {
    const uid = req.user?.uid;
    if (!uid) return res.status(401).json({ message: "Unauthorized" });

    const snap = await db
      .collection("users")
      .doc(uid)
      .collection("myPlants")
      .orderBy("timestamps.createdAt", "desc")
      .get();

    const plants = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
    return res.status(200).json({ plants });
  } catch {
    return res.status(500).json({ message: "Failed to fetch plants" });
  }
}

module.exports = { addPlant, updatePlant, deletePlant, getPlants };
