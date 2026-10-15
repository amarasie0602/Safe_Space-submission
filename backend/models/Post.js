const mongoose = require('mongoose');

const REACTION_TYPES = ['heard', 'support', 'beenthere'];

const postSchema = new mongoose.Schema({
  author: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  category: {
    type: String,
    enum: ['mental_health', 'relationships', 'family', 'financial', 'work_burnout', 'gratitude'],
    required: true,
  },
  content: { type: String, required: true, trim: true, maxlength: 5000 },
  // Auto-set true when the content matches a risk-keyword pattern on creation.
  // Drives the moderation queue in the admin Safety & Analytics dashboard.
  flagged: { type: Boolean, default: false },
  status: {
    type: String,
    enum: ['visible', 'under_review', 'removed'],
    default: 'visible',
  },
  // One reaction per user per post — picking a new type replaces whichever
  // one they'd picked before, same toggle semantics as every other
  // reaction/upvote in this app. REACTION_TYPES below is the source of
  // truth other modules import from, rather than re-listing the enum.
  reactions: [{
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    type: { type: String, enum: REACTION_TYPES, required: true },
  }],
}, { timestamps: true });

postSchema.index({ category: 1, createdAt: -1 });

// Safety-critical: guarantees a flagged post always lands in the moderation
// queue even if a future code path forgets to set status explicitly.
postSchema.pre('save', function () {
  if (this.flagged && this.status === 'visible') {
    this.status = 'under_review';
  }
});

const Post = mongoose.model('Post', postSchema);
Post.REACTION_TYPES = REACTION_TYPES;

module.exports = Post;
