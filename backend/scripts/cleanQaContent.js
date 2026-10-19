// Preview by default; --apply archives and removes only positively identified QA content.
require('dotenv').config({ quiet: true });
const mongoose = require('mongoose');

async function run() {
  await mongoose.connect(process.env.MONGO_URI, { serverSelectionTimeoutMS: 15000 });
  const db = mongoose.connection.db;
  const users = await db.collection('users').find(
    { pseudonym: /^qav?_/i }, { projection: { _id: 1, pseudonym: 1 } }
  ).toArray();
  const author = { $in: users.map(user => user._id) };
  const posts = await db.collection('posts').find({ author, content: /^QA\b/i }).toArray();
  const threads = await db.collection('threads').find({ author, title: /^QA\b/i, body: /^QA\b/i }).toArray();
  const postIds = posts.map(post => post._id);
  const threadIds = threads.map(thread => thread._id);
  const replies = await db.collection('replies').find({
    $or: [{ post: { $in: postIds } }, { thread: { $in: threadIds } }],
  }).toArray();
  console.log(JSON.stringify({
    posts: posts.map(post => ({ id: post._id, content: post.content })),
    threads: threads.map(thread => ({ id: thread._id, title: thread.title })),
    replies: replies.length,
    apply: process.argv.includes('--apply'),
  }, null, 2));
  if (!process.argv.includes('--apply')) return;

  // Archive every affected document before any delete; original IDs make retries safe.
  for (const [collection, documents] of [['posts', posts], ['threads', threads], ['replies', replies]]) {
    for (const document of documents) {
      await db.collection('qa_content_archive').updateOne(
        { _id: `${collection}:${document._id}` },
        { $setOnInsert: { collection, document, archivedAt: new Date() } },
        { upsert: true }
      );
    }
  }
  for (const [collection, documents] of [['replies', replies], ['posts', posts], ['threads', threads]]) {
    const result = await db.collection(collection).deleteMany({ _id: { $in: documents.map(document => document._id) } });
    console.log(`${collection}: removed ${result.deletedCount}`);
  }
  console.log('QA content archived in qa_content_archive. User accounts retained.');
}

run().catch(error => {
  console.error(error.message);
  process.exitCode = 1;
}).finally(() => mongoose.disconnect());
