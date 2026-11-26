const path = require('path');
const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config({ path: path.join(__dirname, '../.env') });

const connectDB = require('../config/db');
const { ensureStaticBranchUser, getStaticBranchAccount } = require('../utils/seedUsers');

async function run() {
  try {
    await connectDB();
    await ensureStaticBranchUser({ force: true });

    const account = getStaticBranchAccount();
    console.log('\n🔐 Static Branch Login Ready (products untouched):');
    console.log(`   - Branch:  ${account.storeLocation}`);
    console.log(`   - User ID: ${account.partnerId}`);
    console.log('');

    await mongoose.disconnect();
    process.exit(0);
  } catch (err) {
    console.error('❌ Failed to configure static branch user:', err);
    process.exit(1);
  }
}

run();
