const express = require("express");
const cors = require("cors");
const userRoutes = require("./routes/users");
const { logger } = require("./config/logger");
require("dotenv").config();
require("./config/db");

const app = express();
const PORT = 5000;

const plantCatalogRoutes = require("./routes/plantCatalog");
const plantRoutes = require("./routes/plants");
const locationRoutes = require("./routes/locations");

// middleware
app.use(cors());
app.use(express.json());

// logger
app.use((req, res, next) => {
  logger.info(`${req.method} ${req.url}`);
  next();
});

// routes
app.use("/", userRoutes, plantRoutes, locationRoutes);
app.use("/plants", plantCatalogRoutes);

// start server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV}`);
});
