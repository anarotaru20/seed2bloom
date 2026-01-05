const express = require('express');
const cors = require('cors');
const testRoute = require('./routes/test.js');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 4500;

// middleware
app.use(cors());
app.use(express.json());

// logger
app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  next();
});

// test route
app.use("/", testRoute);

// start server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV}`);
});