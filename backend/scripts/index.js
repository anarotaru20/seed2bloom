const seedPlants = require("./seedPlants");
const { logger } = require("../src/config/logger");

async function run() {
  logger.info("🚀 Running seeds...");
  await seedPlants(30);
  logger.info("✅ Seeds finished");
}

run()
  .then(() => process.exit(0))
  .catch((e) => {
    logger.error(e);
    process.exit(1);
  });
