const Post = require('../models/Post');

// Safety-critical: keywords that trigger auto-flagging for moderation review.
// Any post whose content matches one of these is hidden from the public feed
// until a moderator/admin clears it. False positives are preferred over
// missed risk content.
const RISK_KEYWORDS = [
  'suicide',
  'self-harm',
  'self harm',
  'kill myself',
  'end my life',
  'want to die',
];

// Safety-critical: called on every post creation. Do not weaken this check
// without moderator sign-off — it is the only gate before content is public.
const containsRiskKeyword = (content) => {
  const lower = content.toLowerCase();
  return RISK_KEYWORDS.some((keyword) => lower.includes(keyword));
};

const createPost = async (req, res) => {
  const { category, content } = req.body;
  const flagged = containsRiskKeyword(content);

  const created = await Post.create({
    author: req.user.id,
    category,
    content,
    flagged,
    status: flagged ? 'under_review' : 'visible',
  });

  const post = await Post.findById(created._id).populate('author', 'pseudonym avatarId');
  res.status(201).json(post);
};

const getPosts = async (req, res) => {
  const page = Math.max(parseInt(req.query.page, 10) || 1, 1);
  const limit = Math.min(Math.max(parseInt(req.query.limit, 10) || 10, 1), 50);

  const [posts, total] = await Promise.all([
    Post.find({ status: 'visible' })
      .populate('author', 'pseudonym avatarId')
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit),
    Post.countDocuments({ status: 'visible' }),
  ]);

  res.json({ posts, page, hasMore: page * limit < total, total });
};

const adminGetPosts = async (req, res) => {
  const posts = await Post.find()
    .populate('author', 'pseudonym avatarId')
    .sort({ createdAt: -1 });

  res.json(posts);
};

const updatePostStatus = async (req, res) => {
  const { status } = req.body;
  const post = await Post.findByIdAndUpdate(req.params.id, { status }, { new: true });

  if (!post) {
    return res.status(404).json({ message: 'Post not found' });
  }

  res.json(post);
};

const adminDeletePost = async (req, res) => {
  const post = await Post.findByIdAndDelete(req.params.id);

  if (!post) {
    return res.status(404).json({ message: 'Post not found' });
  }

  res.status(204).send();
};

const emptyCounts = () => Object.fromEntries(Post.REACTION_TYPES.map((t) => [t, 0]));

const countReactions = (reactions) => {
  const counts = emptyCounts();
  reactions.forEach((r) => { counts[r.type] = (counts[r.type] || 0) + 1; });
  return counts;
};

const toggleReaction = async (req, res) => {
  const { type } = req.body;
  if (!Post.REACTION_TYPES.includes(type)) {
    return res.status(400).json({ message: `type must be one of: ${Post.REACTION_TYPES.join(', ')}` });
  }

  const post = await Post.findById(req.params.id).select('reactions');
  if (!post) {
    return res.status(404).json({ message: 'Post not found' });
  }

  const userId = req.user.id;
  const existing = post.reactions.find((r) => r.user.toString() === userId);

  if (existing && existing.type === type) {
    post.reactions = post.reactions.filter((r) => r.user.toString() !== userId);
  } else if (existing) {
    existing.type = type;
  } else {
    post.reactions.push({ user: userId, type });
  }
  await post.save();

  const userReaction = post.reactions.find((r) => r.user.toString() === userId);
  res.json({ counts: countReactions(post.reactions), userReaction: userReaction ? userReaction.type : null });
};

const getCategoryCounts = async (req, res) => {
  const results = await Post.aggregate([
    { $match: { status: 'visible' } },
    { $group: { _id: '$category', count: { $sum: 1 } } },
  ]);

  res.json(Object.fromEntries(results.map((r) => [r._id, r.count])));
};

module.exports = {
  createPost,
  getPosts,
  adminGetPosts,
  updatePostStatus,
  adminDeletePost,
  toggleReaction,
  getCategoryCounts,
};
