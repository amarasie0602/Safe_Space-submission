require('dotenv').config({ quiet: true });
const mongoose = require('mongoose');

// One-off: Post.supporters (a plain array of user ids) became
// Post.reactions ({ user, type }[]) so the homepage can show three distinct
// reaction types instead of one generic "support" toggle. Existing
// supporters are migrated forward as type: 'support' rather than reset to
// zero, so seeded/real engagement numbers aren't lost. Purely additive to
// documents that still have the old field — never deletes anything, and is
// safe to run more than once (it skips posts that already have reactions
// and no leftover supporters field).
const migrate = async () => {
  await mongoose.connect(process.env.MONGO_URI);
  console.log('MongoDB connected');

  const db = mongoose.connection.db;
  const posts = db.collection('posts');

  const cursor = posts.find({ supporters: { $exists: true } });
  let migrated = 0;

  while (await cursor.hasNext()) {
    const post = await cursor.next();
    const legacySupporters = post.supporters || [];
    const reactions = legacySupporters.map((user) => ({ user, type: 'support' }));

    await posts.updateOne(
      { _id: post._id },
      { $set: { reactions }, $unset: { supporters: '' } }
    );
    migrated += 1;
  }

  console.log(`Migrated ${migrated} post(s) from supporters -> reactions`);

  await mongoose.disconnect();
  console.log('Disconnected. Done.');
};

migrate().catch((err) => {
  console.error('migrateReactions failed:', err);
  process.exit(1);
});
