const dns = require('dns');
// Configure reliable public DNS servers for Windows SRV record resolution
try {
  dns.setServers(['8.8.8.8', '8.8.4.4', '1.1.1.1']);
} catch (e) {
  // Ignore if restricted
}

const fs = require('fs');
const path = require('path');
const csv = require('csv-parser');
const mongoose = require('mongoose');
const dotenv = require('dotenv');

// Load environment variables from server/.env
dotenv.config({ path: path.join(__dirname, '../.env') });

const Product = require('../models/Product');

const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/starbucks_inventory';

// Candidate CSV locations
const candidatePaths = [
  path.join(__dirname, '../data/starbucks.csv'),
  path.join(__dirname, '../../starbucks.csv'),
  path.join(__dirname, '../../assets/starbucks.csv')
];

let csvFilePath = candidatePaths.find((p) => fs.existsSync(p));

if (!csvFilePath) {
  console.error('❌ Could not locate starbucks.csv in server/data or project root.');
  process.exit(1);
}

// Helper to determine size from Beverage_prep
function extractSize(prep) {
  const p = prep.toLowerCase();
  if (p.includes('venti')) return 'Venti';
  if (p.includes('grande')) return 'Grande';
  if (p.includes('tall')) return 'Tall';
  if (p.includes('short')) return 'Short';
  return 'Grande';
}

// Helper to derive realistic Starbucks pricing
function calculatePrice(category, size) {
  let basePrice = 3.95;
  const cat = category.toLowerCase();

  if (cat.includes('frappuccino') || cat.includes('signature')) {
    basePrice = 4.95;
  } else if (cat.includes('classic espresso')) {
    basePrice = 4.45;
  } else if (cat.includes('coffee')) {
    basePrice = 3.15;
  } else if (cat.includes('tea')) {
    basePrice = 3.45;
  }

  if (size === 'Short') basePrice -= 0.50;
  if (size === 'Grande') basePrice += 0.60;
  if (size === 'Venti') basePrice += 1.10;

  return Number(basePrice.toFixed(2));
}

// Generate realistic ingredient profiles based on beverage and prep
function generateIngredients(name, prep, category) {
  const ingredients = [];
  const prepLower = prep.toLowerCase();
  const nameLower = name.toLowerCase();

  // 1. Base liquid/coffee
  if (category.toLowerCase().includes('coffee') || nameLower.includes('brewed')) {
    ingredients.push({ name: 'Starbucks Dark Roast Ground Beans', amount: '24', unit: 'g' });
    ingredients.push({ name: 'Filtered Hot Water', amount: '16', unit: 'fl oz' });
  } else if (category.toLowerCase().includes('tea') || nameLower.includes('tea')) {
    ingredients.push({ name: 'Teavana Blend Tea Leaves', amount: '1', unit: 'sachet' });
    ingredients.push({ name: 'Filtered Boiling Water', amount: '16', unit: 'fl oz' });
  } else if (category.toLowerCase().includes('frappuccino')) {
    ingredients.push({ name: 'Frappuccino Roast Coffee Concentrate', amount: '3', unit: 'pumps' });
    ingredients.push({ name: 'Coffee Base Syrup', amount: '3', unit: 'pumps' });
    ingredients.push({ name: 'Filtered Ice', amount: '1', unit: 'scoop' });
  } else {
    // Espresso beverages
    const shots = prepLower.includes('venti') ? '3' : prepLower.includes('short') ? '1' : '2';
    ingredients.push({ name: 'Signature Espresso Roast', amount: shots, unit: 'shots' });
  }

  // 2. Milk component
  if (prepLower.includes('soymilk')) {
    ingredients.push({ name: 'Organic Soy Milk', amount: '10', unit: 'fl oz' });
  } else if (prepLower.includes('nonfat')) {
    ingredients.push({ name: 'Steamed Nonfat Milk', amount: '10', unit: 'fl oz' });
  } else if (prepLower.includes('whole milk')) {
    ingredients.push({ name: 'Steamed Whole Milk', amount: '10', unit: 'fl oz' });
  } else if (prepLower.includes('2% milk')) {
    ingredients.push({ name: 'Steamed 2% Reduced-Fat Milk', amount: '10', unit: 'fl oz' });
  }

  // 3. Syrups and flavors
  if (nameLower.includes('mocha')) {
    ingredients.push({ name: 'Bittersweet Mocha Sauce', amount: '4', unit: 'pumps' });
  } else if (nameLower.includes('caramel')) {
    ingredients.push({ name: 'Vanilla Syrup', amount: '3', unit: 'pumps' });
    ingredients.push({ name: 'Buttery Caramel Drizzle', amount: '1', unit: 'drizzle' });
  } else if (nameLower.includes('vanilla')) {
    ingredients.push({ name: 'Madagascar Vanilla Syrup', amount: '4', unit: 'pumps' });
  } else if (nameLower.includes('white chocolate')) {
    ingredients.push({ name: 'White Chocolate Mocha Sauce', amount: '4', unit: 'pumps' });
  } else if (nameLower.includes('cinnamon') || nameLower.includes('chai')) {
    ingredients.push({ name: 'Spiced Black Tea & Cinnamon Concentrate', amount: '4', unit: 'pumps' });
  }

  // Fallback if empty
  if (ingredients.length === 0) {
    ingredients.push({ name: 'Starbucks Proprietary Blend', amount: '1', unit: 'serving' });
  }

  return ingredients;
}

// Generate realistic stock quantities (some normal, some low stock < 15, some 0 out-of-stock for demonstration)
function generateStock(index) {
  if (index === 2 || index === 14) return 0; // Out of stock items
  if (index === 4 || index === 8 || index === 19 || index === 27) return Math.floor(Math.random() * 8) + 2; // Low stock (2-9)
  return Math.floor(Math.random() * 45) + 18; // Regular healthy stock (18-62)
}

function generateDescription(name, prep, category) {
  return `Handcrafted ${name} prepared with ${prep}. Authentic Starbucks recipe crafted with premium ingredients for the perfect rich taste and aroma.`;
}

async function seedData() {
  console.log(`\n======================================================`);
  console.log(`☕ STARBUCKS INVENTORY SEED SCRIPT`);
  console.log(`======================================================`);
  console.log(`📂 Reading dataset from: ${csvFilePath}`);

  try {
    await mongoose.connect(MONGO_URI);
    console.log(`✅ Connected to MongoDB at: ${MONGO_URI}`);

    const rawRows = [];

    await new Promise((resolve, reject) => {
      fs.createReadStream(csvFilePath)
        .pipe(csv())
        .on('data', (data) => rawRows.push(data))
        .on('end', resolve)
        .on('error', reject);
    });

    console.log(`📊 Found ${rawRows.length} total rows in CSV dataset.`);

    // Map rows into clean Product schema format
    const productsToInsert = rawRows.map((row, index) => {
      const category = (row['Beverage_category'] || 'Beverages').trim();
      const beverageName = (row['Beverage'] || 'Starbucks Beverage').trim();
      const prep = (row['Beverage_prep'] || 'Standard').trim();

      const fullName = `${beverageName} (${prep})`;
      const size = extractSize(prep);
      const price = calculatePrice(category, size);
      const stock = generateStock(index);
      const ingredients = generateIngredients(beverageName, prep, category);

      // Clean nutrition fields
      const calories = parseInt(row['Calories'], 10) || 0;
      const caffeine = (row['Caffeine (mg)'] || '0').trim();
      const sugars = parseFloat(row[' Sugars (g)']) || 0;
      const fat = parseFloat(row[' Total Fat (g)']) || 0;

      const skuPrefix = category.slice(0, 3).toUpperCase().replace(/[^A-Z]/g, 'SB');
      const sku = `${skuPrefix}-${1000 + index}`;

      return {
        name: fullName,
        category,
        size,
        price,
        stock,
        sku,
        description: generateDescription(beverageName, prep, category),
        ingredients,
        nutrition: {
          calories,
          caffeine: caffeine || 'N/A',
          sugars,
          fat
        },
        imageUrl: '/logo.png'
      };
    });

    // Delete existing products to ensure clean seed
    const deleteResult = await Product.deleteMany({});
    console.log(`🧹 Cleaned up ${deleteResult.deletedCount} prior records.`);

    // Insert all records
    const inserted = await Product.insertMany(productsToInsert);
    console.log(`✨ Successfully imported ${inserted.length} Starbucks inventory products!`);

    // Print summary stats
    const totalCategories = await Product.distinct('category');
    const outOfStockCount = await Product.countDocuments({ stock: 0 });
    const lowStockCount = await Product.countDocuments({ stock: { $gt: 0, $lt: 15 } });

    console.log(`\n📋 Inventory Summary:`);
    console.log(`   - Total Products:   ${inserted.length}`);
    console.log(`   - Categories:       ${totalCategories.length} (${totalCategories.join(', ')})`);
    console.log(`   - Out of Stock (0): ${outOfStockCount}`);
    console.log(`   - Low Stock (<15):  ${lowStockCount}`);
    console.log(`======================================================\n`);

    await mongoose.disconnect();
    console.log(`🔌 Disconnected from MongoDB cleanly.`);
    process.exit(0);
  } catch (err) {
    console.error(`❌ Seeding failed:`, err);
    process.exit(1);
  }
}

seedData();
