require('dotenv').config({ quiet: true });
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const User = require('../models/User');
const Post = require('../models/Post');
const Thread = require('../models/Thread');
const Reply = require('../models/Reply');

// Purely additive: never deletes anything, safe to run against a database
// that already has real/seeded content. Adds more users, posts, threads,
// and — the point of this script — layers replies and likes/upvotes onto
// *all* existing posts/threads (not just the new ones) so the feed reads
// as an active, lived-in community rather than a handful of lonely posts.
const SEED_PASSWORD = 'password123';

const NEW_PSEUDONYMS = [
  'patient_otter',
  'morning_finch',
  'resolute_birch',
  'gentle_tide',
  'late_bloomer22',
  'small_steps_sam',
  'quietly_coping',
  'still_here_99',
];

const shuffle = (arr) => [...arr].sort(() => Math.random() - 0.5);
const pick = (arr, n) => shuffle(arr).slice(0, Math.min(n, arr.length));
const randomInt = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;

const POSTS = [
  {
    category: 'mental_health',
    content:
      "Started therapy for the first time last month. I spent the first two sessions apologizing for crying. My therapist finally said 'this room is allowed to be for that' and something in me just loosened.",
  },
  {
    category: 'mental_health',
    content:
      "Does anyone else's anxiety show up as irritability instead of worry? I snap at the smallest things and then feel awful about it afterward. Trying to catch it earlier in the cycle.",
  },
  {
    category: 'work_burnout',
    content:
      "Handed in my two weeks today. No new job lined up, just couldn't keep pouring from an empty cup. Terrified and relieved in roughly equal measure.",
  },
  {
    category: 'work_burnout',
    content:
      "My manager asked why my output dropped this quarter. I didn't have the words to explain that surviving each day was the output. Saying it out loud here feels safer than saying it to HR.",
  },
  {
    category: 'relationships',
    content:
      "Realized this week that I've been apologizing for existing in my own home. Setting a boundary for the first time tonight and my hands won't stop shaking.",
  },
  {
    category: 'family',
    content:
      "My sibling and I haven't spoken in eight months over something that, looking back, wasn't even that big. Thinking about reaching out but scared it'll just reopen things.",
  },
  {
    category: 'family',
    content:
      "Became a caregiver for my dad this year on top of everything else. Nobody prepares you for grieving someone who's still alive, just different now.",
  },
  {
    category: 'financial',
    content:
      "Paid off my credit card in full for the first time in four years today. It's not a huge number to most people but I sat in my car afterward and cried from relief.",
  },
  {
    category: 'financial',
    content:
      "Had to say no to a friend's destination wedding because I genuinely can't afford it. The guilt is eating at me more than the money would have.",
  },
  {
    category: 'gratitude',
    content:
      "A stranger paid for my coffee today because my card declined and I was having the worst morning. Didn't even let me say thank you properly. Paying it forward this week.",
  },
  {
    category: 'gratitude',
    content:
      "One year sober today. Not going to pretend it's been easy, but I'm here, and a year ago I didn't think I would be. Thank you to everyone on here who talked me through the hard nights.",
  },
  {
    category: 'mental_health',
    content:
      "Learning that 'I don't have the capacity for this right now' is a complete sentence and I don't owe anyone an essay explaining why.",
  },
  {
    category: 'relationships',
    content:
      "Twelve years married and we just had our first real fight in front of a counselor. Strange to say but it felt like progress — we actually heard each other for once.",
  },
  {
    category: 'work_burnout',
    content:
      "Took my first sick day in two years for my mental health, not a cold. Told my team the truth instead of making something up. Nobody blinked. Wish I'd done it sooner.",
  },
  {
    category: 'gratitude',
    content:
      "Small thing: I watered a plant I've kept alive for six months today. A year ago I couldn't keep myself fed most days. Noticing how far that distance actually is.",
  },
];

const THREADS = [
  {
    category: 'mental_health',
    title: 'How did you know it was time to actually start therapy?',
    body: "I've been circling the idea for two years. What made you finally book the first session, and was it as scary as I'm imagining?",
  },
  {
    category: 'work_burnout',
    title: 'Did changing jobs actually fix your burnout, or just delay it?',
    body: "Considering quitting to 'fix' how I feel but a part of me worries the burnout will just follow me to the next place if I don't deal with the underlying stuff first.",
  },
  {
    category: 'relationships',
    title: 'How do you rebuild trust after a long period of dishonesty?',
    body: "Not about infidelity, just years of small omissions that added up. We're trying to work through it together but I don't know what rebuilding actually looks like day to day.",
  },
  {
    category: 'family',
    title: 'Scripts for setting a boundary with a parent who takes everything personally',
    body: "Every boundary I try to set turns into them being hurt and me backing down to manage their feelings instead of mine. Looking for actual phrasing that's worked for people.",
  },
  {
    category: 'financial',
    title: "What's one money habit that actually stuck for you?",
    body: "I've tried every budgeting app and none of them last more than a month. Looking for something low-effort that became automatic instead of a chore.",
  },
  {
    category: 'gratitude',
    title: 'What got you through the hardest year of your life?',
    body: "Not looking for advice, just curious what people held onto. Could be a person, a routine, a song, anything.",
  },
  {
    category: 'mental_health',
    title: 'Grounding techniques that work when breathing exercises don’t',
    body: "Everyone recommends breathing but in a full panic it just makes me more aware I can't control my breath. What else actually brings you back down?",
  },
  {
    category: 'work_burnout',
    title: 'How do you switch off when your job follows you home on your phone?',
    body: "Deleted Slack from my phone once and lasted four days before reinstalling it out of anxiety. Looking for what's actually worked long-term, not just willpower.",
  },
];

const REPLY_BANK = [
  "Sending you so much strength for this — you're not alone in it.",
  'Thank you for putting this into words. I’ve felt exactly this and never knew how to say it.',
  'This resonates more than I expected it to. Rooting for you.',
  'Be gentle with yourself through this — you’re doing better than you think.',
  'I went through something similar and want you to know it does get lighter, even if it doesn’t feel like it right now.',
  'Saving this reply for myself honestly. Needed to hear it today too.',
  'Proud of you for naming this out loud. That’s not a small thing.',
  'No advice, just want you to know I read this and I’m with you.',
  'This is such a real way to put it. Thank you for sharing.',
  'The fact that you noticed this about yourself is already progress.',
  'Sitting with you in this one. Sending care.',
  'I don’t have the right words, just wanted you to know you were heard.',
  'This gave me a lot to think about today. Thank you for your honesty.',
  'You deserve support through this, not just survival. Hope you find it.',
  'Been there. It’s heavier than people realize from the outside.',
];

const seedMore = async () => {
  await mongoose.connect(process.env.MONGO_URI);
  console.log('MongoDB connected');

  const passwordHash = await bcrypt.hash(SEED_PASSWORD, 10);

  const newUsers = [];
  for (const pseudonym of NEW_PSEUDONYMS) {
    const existing = await User.findOne({ pseudonym });
    if (existing) {
      newUsers.push(existing);
      continue;
    }
    const user = await User.create({
      pseudonym,
      passwordHash,
      avatarId: randomInt(0, 9),
    });
    newUsers.push(user);
  }
  console.log(`Ensured ${newUsers.length} additional users exist`);

  const allUsers = await User.find({ role: 'user' });
  if (allUsers.length === 0) {
    throw new Error('No regular users found to author content as — run scripts/seed.js first.');
  }

  const createdPosts = await Post.create(
    POSTS.map((p) => ({ ...p, author: allUsers[randomInt(0, allUsers.length - 1)]._id }))
  );
  console.log(`Added ${createdPosts.length} new posts`);

  const createdThreads = await Thread.create(
    THREADS.map((t) => ({ ...t, author: allUsers[randomInt(0, allUsers.length - 1)]._id }))
  );
  console.log(`Added ${createdThreads.length} new threads`);

  // Layer replies + likes/upvotes onto EVERY visible post and EVERY thread
  // already in the database, old and new alike, so the whole feed looks
  // active rather than just the content this script itself added.
  const allPosts = await Post.find({ status: 'visible' });
  const allThreads = await Thread.find();

  let replyCount = 0;

  for (const post of allPosts) {
    const replyAuthors = pick(allUsers, randomInt(1, 4));
    for (const author of replyAuthors) {
      await Reply.create({
        post: post._id,
        author: author._id,
        body: REPLY_BANK[randomInt(0, REPLY_BANK.length - 1)],
        upvotes: randomInt(0, 8),
      });
      replyCount += 1;
    }

    const supporters = pick(
      allUsers.map((u) => u._id),
      randomInt(2, Math.min(10, allUsers.length))
    );
    post.supporters = Array.from(new Set([...post.supporters.map(String), ...supporters.map(String)]));
    await post.save();
  }

  for (const thread of allThreads) {
    const replyAuthors = pick(allUsers, randomInt(2, 5));
    for (const author of replyAuthors) {
      await Reply.create({
        thread: thread._id,
        author: author._id,
        body: REPLY_BANK[randomInt(0, REPLY_BANK.length - 1)],
        upvotes: randomInt(0, 8),
      });
      replyCount += 1;
    }

    const upvoters = pick(
      allUsers.map((u) => u._id),
      randomInt(3, Math.min(14, allUsers.length))
    );
    const upvotedByIds = new Set([...thread.upvotedBy.map(String), ...upvoters.map(String)]);
    thread.upvotedBy = Array.from(upvotedByIds);
    thread.upvotes = thread.upvotedBy.length;
    await thread.save();
  }

  console.log(`Added ${replyCount} replies across ${allPosts.length} posts and ${allThreads.length} threads`);
  console.log('Layered likes/upvotes onto all existing + new posts and threads');

  console.log('\nseedMore complete — existing data was not touched, only added to.');

  await mongoose.disconnect();
  console.log('Disconnected. Done.');
};

seedMore().catch((err) => {
  console.error('seedMore failed:', err);
  process.exit(1);
});
