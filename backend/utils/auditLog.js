const AdminAction = require('../models/AdminAction');

// Shared by every controller that performs a sensitive admin-level action
// (suspend/ban/reinstate a user, verify/reject a counselor). Intentionally
// never throws — a logging failure should never block or roll back the
// moderation action itself, just get reported so it can be investigated.
const logAdminAction = async ({ actor, action, targetType, targetId, reason, metadata }) => {
  try {
    await AdminAction.create({ actor, action, targetType, targetId, reason, metadata });
  } catch (err) {
    console.error('Failed to write admin audit log entry:', err);
  }
};

module.exports = { logAdminAction };
