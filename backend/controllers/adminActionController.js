const AdminAction = require('../models/AdminAction');

// Admin-only (not staffOnly): who-did-what-to-whom is itself sensitive
// operational metadata, kept to full admins rather than the whole
// moderator+admin staff tier.
const getAdminActions = async (req, res) => {
  const actions = await AdminAction.find()
    .populate('actor', 'pseudonym')
    .sort({ createdAt: -1 })
    .limit(100);

  res.json(actions);
};

module.exports = { getAdminActions };
