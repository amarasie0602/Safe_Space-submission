const User = require('../models/User');
const Post = require('../models/Post');

// Real, honestly-labeled community numbers for the homepage sidebar — no
// live-presence tracking exists in this app, so this is deliberately
// "members" and "posts shared" rather than anything implying who's online
// right now.
const getCommunityStats = async (req, res) => {
  const [members, postsShared] = await Promise.all([
    User.countDocuments({ role: 'user' }),
    Post.countDocuments({ status: 'visible' }),
  ]);

  res.json({ members, postsShared });
};

module.exports = { getCommunityStats };
