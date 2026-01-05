const logger = {
  info: (message) => {
    console.log(`[INFO] [${new Date().toISOString()}] ${message}`);
  },
  error: (error) => {
    console.error(`[ERROR] [${new Date().toISOString()}]`, error);
  },
};

module.exports = { logger };