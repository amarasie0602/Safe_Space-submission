require('dotenv').config({ quiet: true });
const mongoose = require('mongoose');

// There's no local mongod in this environment, so tests run against the same
// Atlas cluster as dev — but in a dedicated `safespace_test` database, never
// the real one. Run with --runInBand (see package.json) so test files don't
// race each other clearing/dropping this shared test database in parallel.
const TEST_DB_NAME = 'safespace_test';

const buildTestUri = (uri) => uri.replace(/\/([^/?]+)(\?|$)/, `/${TEST_DB_NAME}$2`);

const connectTestDb = async () => {
  process.env.JWT_SECRET = process.env.JWT_SECRET || 'test-secret';
  mongoose.set('bufferTimeoutMS', 30000);
  await mongoose.connect(buildTestUri(process.env.MONGO_URI), { serverSelectionTimeoutMS: 30000 });
};

const clearTestDb = async () => {
  const { collections } = mongoose.connection;
  await Promise.all(Object.values(collections).map((collection) => collection.deleteMany({})));
};

const disconnectTestDb = async () => {
  // Drop each collection rather than the whole database: `dropDatabase`
  // needs a privilege (dbAdmin/atlasAdmin) that a least-privilege
  // readWrite database user — the kind you'd actually want scoped to a
  // shared Atlas cluster, and the kind most CI Mongo services start with —
  // doesn't have. Dropping every collection leaves the test database just
  // as empty without requiring that extra grant.
  const { collections } = mongoose.connection;
  await Promise.all(
    Object.values(collections).map((collection) => collection.drop().catch(() => {}))
  );
  await mongoose.disconnect();
};

module.exports = { connectTestDb, clearTestDb, disconnectTestDb };
