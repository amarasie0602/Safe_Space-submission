const mongoose = require('mongoose');

// Accountability trail for admin-level moderation decisions (never for
// routine staff actions like resolving a content report — just the
// sensitive, hard-to-reverse ones). Lets a disputed suspension/ban or
// counselor decision be traced back to who made it, when, and why, instead
// of just the result being visible on the target's record.
const adminActionSchema = new mongoose.Schema({
  actor: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  action: {
    type: String,
    enum: [
      'user_suspended',
      'user_banned',
      'user_reinstated',
      'counselor_verified',
      'counselor_rejected',
    ],
    required: true,
  },
  targetType: { type: String, enum: ['user', 'counselor'], required: true },
  // Not a hard ref — a rejected counselor's document is deleted (see
  // counselorController.adminRejectCounselor), so this id may no longer
  // resolve. `metadata` below keeps a human-readable snapshot either way.
  targetId: { type: mongoose.Schema.Types.ObjectId, required: true },
  reason: { type: String, trim: true, maxlength: 500 },
  // Free-form context that doesn't deserve its own column: e.g. the
  // suspension length, or a rejected/deleted counselor's name + email.
  metadata: { type: mongoose.Schema.Types.Mixed },
}, { timestamps: true });

adminActionSchema.index({ createdAt: -1 });
adminActionSchema.index({ targetType: 1, targetId: 1 });

module.exports = mongoose.model('AdminAction', adminActionSchema);
