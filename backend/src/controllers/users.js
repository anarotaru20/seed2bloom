const { admin, db } = require("../config/db");
const { signJwt } = require("../config/jwt");

async function register(req, res) {
  try {
    const { idToken, profile } = req.body;
    if (!idToken)
      return res.status(400).json({ message: "idToken is required" });

    const decoded = await admin.auth().verifyIdToken(idToken);
    const uid = decoded.uid;

    const safeProfile = profile && typeof profile === "object" ? profile : {};

    const firstName = safeProfile.firstName ?? null;
    const lastName = safeProfile.lastName ?? null;
    const birthDate = safeProfile.birthDate ?? null;
    const email = decoded.email || safeProfile.email || null;

    if (!email) return res.status(400).json({ message: "email is required" });

    const userRef = db.collection("users").doc(uid);
    const snap = await userRef.get();
    const existing = snap.exists ? snap.data() : null;

    const userData = {
      uid,
      email,
      firstName,
      lastName,
      birthDate,
      provider: decoded.firebase?.sign_in_provider || "password",
      createdAt: existing?.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    await userRef.set(userData, { merge: true });

    const token = signJwt({ uid, email });

    return res.status(201).json({
      token,
      user: userData,
    });
  } catch (e) {
    return res.status(401).json({ message: "Invalid Firebase token" });
  }
}

async function login(req, res) {
  try {
    const { idToken } = req.body;
    if (!idToken)
      return res.status(400).json({ message: "idToken is required" });

    const decoded = await admin.auth().verifyIdToken(idToken);
    const uid = decoded.uid;
    const email = decoded.email || null;

    const userRef = db.collection("users").doc(uid);
    const snap = await userRef.get();
    const existing = snap.exists ? snap.data() : {};

    const userData = {
      ...existing,
      uid,
      email,
      provider:
        decoded.firebase?.sign_in_provider || existing?.provider || "password",
      lastLoginAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    await userRef.set(userData, { merge: true });

    const token = signJwt({ uid, email });

    return res.json({
      token,
      user: userData,
    });
  } catch (e) {
    return res.status(401).json({ message: "Invalid Firebase token" });
  }
}

async function profile(req, res) {
  try {
    const uid = req.user?.uid;
    if (!uid) return res.status(401).json({ message: "Unauthorized" });

    const snap = await db.collection("users").doc(uid).get();
    const data = snap.exists ? snap.data() : null;

    return res.json({ user: data });
  } catch (e) {
    return res.status(500).json({ message: "Failed to load profile" });
  }
}

async function updateProfile(req, res) {
  try {
    const uid = req.user?.uid;
    if (!uid) return res.status(401).json({ message: "Unauthorized" });

    const body = req.body && typeof req.body === "object" ? req.body : {};

    const allowed = [
      "displayName",
      "address",
      "phone",
      "photoURL",
      "preferences",
    ];

    const patch = {};
    for (const key of allowed) {
      if (Object.prototype.hasOwnProperty.call(body, key)) {
        patch[key] = body[key];
      }
    }

    if (Object.keys(patch).length === 0) {
      return res.status(400).json({ message: "No valid fields to update" });
    }

    patch.updatedAt = new Date().toISOString();

    await db.collection("users").doc(uid).set(patch, { merge: true });

    if (patch.displayName !== undefined || patch.photoURL !== undefined) {
      const authPatch = {};
      if (patch.displayName !== undefined)
        authPatch.displayName = patch.displayName || null;
      if (patch.photoURL !== undefined)
        authPatch.photoURL = patch.photoURL || null;

      await admin.auth().updateUser(uid, authPatch);
    }

    const snap = await db.collection("users").doc(uid).get();
    const user = snap.exists ? snap.data() : null;

    return res.json({ user });
  } catch (e) {
    return res.status(500).json({ message: "Failed to update profile" });
  }
}

async function deleteAccount(req, res) {
  try {
    const uid = req.user?.uid;
    if (!uid) return res.status(401).json({ message: "Unauthorized" });

    await admin
      .firestore()
      .recursiveDelete(admin.firestore().collection("users").doc(uid));

    try {
      await admin.auth().deleteUser(uid);
    } catch (e) {}

    return res.json({ success: true });
  } catch (e) {
    return res.status(500).json({ message: "Failed to delete account" });
  }
}

async function updateEmail(req, res) {
  try {
    const uid = req.user?.uid;
    if (!uid) return res.status(401).json({ message: "Unauthorized" });

    const { idToken, email } = req.body || {};
    if (!idToken)
      return res.status(400).json({ message: "idToken is required" });
    if (!email) return res.status(400).json({ message: "email is required" });

    const decoded = await admin.auth().verifyIdToken(idToken);
    if (decoded.uid !== uid)
      return res.status(403).json({ message: "Forbidden" });

    await admin.auth().updateUser(uid, { email });

    const patch = { email, updatedAt: new Date().toISOString() };
    await db.collection("users").doc(uid).set(patch, { merge: true });

    const snap = await db.collection("users").doc(uid).get();
    const user = snap.exists ? snap.data() : null;

    return res.json({ user });
  } catch (e) {
    return res.status(500).json({ message: "Failed to update email" });
  }
}

async function updatePassword(req, res) {
  try {
    const uid = req.user?.uid;
    if (!uid) return res.status(401).json({ message: "Unauthorized" });

    const { idToken, password } = req.body || {};
    if (!idToken)
      return res.status(400).json({ message: "idToken is required" });
    if (!password)
      return res.status(400).json({ message: "password is required" });

    const decoded = await admin.auth().verifyIdToken(idToken);
    if (decoded.uid !== uid)
      return res.status(403).json({ message: "Forbidden" });

    await admin.auth().updateUser(uid, { password });

    await db
      .collection("users")
      .doc(uid)
      .set({ updatedAt: new Date().toISOString() }, { merge: true });

    return res.json({ success: true });
  } catch (e) {
    return res.status(500).json({ message: "Failed to update password" });
  }
}

module.exports = {
  register,
  login,
  profile,
  updateProfile,
  deleteAccount,
  updateEmail,
  updatePassword,
};
