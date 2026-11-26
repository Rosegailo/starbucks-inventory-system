const User = require('../models/User');

function getStaticBranchAccount() {
  return {
    name: process.env.BRANCH_PARTNER_NAME || 'Branch Manager',
    partnerId: process.env.BRANCH_USER_ID || 'SBX-1001',
    email: process.env.BRANCH_USER_EMAIL || 'manager@starbucks.com',
    password: process.env.BRANCH_USER_PASSWORD || 'Starbucks123!',
    role: 'Store Manager',
    storeLocation: process.env.BRANCH_LOCATION || 'Starbucks Branch #1024'
  };
}

/**
 * Ensure the single static branch account exists when the users collection is empty
 * (or upsert when force=true) without touching the products collection.
 */
async function ensureStaticBranchUser({ force = false } = {}) {
  const existingCount = await User.countDocuments();
  if (existingCount > 0 && !force) {
    return { created: 0, existingCount };
  }

  const account = getStaticBranchAccount();

  if (force) {
    await User.deleteMany({});
  }

  const existing = await User.findOne({ partnerId: account.partnerId });
  if (!existing) {
    await User.create(account);
    console.log(`🔐 Initialized branch login account (${account.partnerId}).`);
    return { created: 1, existingCount };
  }

  existing.name = account.name;
  existing.email = account.email;
  existing.password = account.password;
  existing.role = account.role;
  existing.storeLocation = account.storeLocation;
  await existing.save();

  return { created: 0, existingCount };
}

module.exports = { ensureStaticBranchUser, getStaticBranchAccount };
