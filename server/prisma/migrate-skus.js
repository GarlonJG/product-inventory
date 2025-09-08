// prisma/migrate-skus.js
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function migrateSkus() {
  try {
    // 1. Find all items with SKUs that need updating
    const items = await prisma.item.findMany({
        where: {
            sku: { not: undefined } 
        }, // All SKUs since we're converting from Int to String
    });

    console.log(`Found ${items.length} items to update`);

    // 2. Process each item
    for (const item of items) {
      let newSku;
      
      // Handle different SKU types (in case some are already strings)
      if (typeof item.sku === 'number') {
        // Pad number with leading zeros
        newSku = item.sku.toString().padStart(6, '0');
      } else if (typeof item.sku === 'string') {
        // Ensure it's exactly 6 digits
        newSku = item.sku.padStart(6, '0').slice(0, 6);
      } else {
        console.warn(`Skipping item ${item.id} with invalid SKU type:`, item.sku);
        continue;
      }

      // 3. Update the item
      await prisma.item.update({
        where: { id: item.id },
        data: { sku: newSku }
      });
      
      console.log(`Updated item ${item.id}: ${item.sku} -> ${newSku}`);
    }

    console.log('Migration completed successfully');
  } catch (error) {
    console.error('Migration failed:', error);
  } finally {
    await prisma.$disconnect();
  }
}

migrateSkus();