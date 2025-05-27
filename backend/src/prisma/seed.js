const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting seed process...');
  
  try {
    // Test the connection first
    await prisma.$connect();
    console.log('✅ Connected to phdaitrade database successfully');
    
    // Create admin user
    const email = 'phdai@abdallamalik.com';
    const password = '1234567ASD';
    const hashedPassword = await bcrypt.hash(password, 10);

    console.log('👤 Checking for existing user...');
    const existingUser = await prisma.user.findUnique({ 
      where: { email } 
    });

    if (!existingUser) {
      console.log('👤 Creating admin user...');
      const user = await prisma.user.create({
        data: {
          email,
          password: hashedPassword,
        },
      });
      console.log('✅ Seeded admin user:', user.email);
    } else {
      console.log('ℹ️ Admin user already exists:', existingUser.email);
    }

    // Create sample trades
    console.log('📈 Creating sample trades...');
    
    const trades = [
      {
        symbol: 'EURUSD',
        side: 'buy',
        volume: 0.01,
        status: 'open',
        profit: 12.50,
        stopLossPips: 30,
        takeProfitPips: 60,
      },
      {
        symbol: 'GBPUSD',
        side: 'sell',
        volume: 0.02,
        status: 'closed',
        profit: -8.75,
        stopLossPips: 25,
        takeProfitPips: 50,
        closedAt: new Date(),
      },
      {
        symbol: 'USDJPY',
        side: 'buy',
        volume: 0.01,
        status: 'open',
        profit: 5.25,
        stopLossPips: 35,
        takeProfitPips: 70,
      }
    ];

    for (const tradeData of trades) {
      const trade = await prisma.trade.create({
        data: tradeData,
      });
      console.log(`✅ Created ${tradeData.status} trade: ${tradeData.side.toUpperCase()} ${tradeData.symbol}`);
    }

    console.log('🎉 Seeding completed successfully!');

  } catch (error) {
    console.error('❌ Error during seeding:', error);
    throw error;
  } finally {
    console.log('🔌 Disconnecting from database...');
    await prisma.$disconnect();
  }
}

main()
  .catch(e => {
    console.error('❌ Seed script failed:', e.message);
    process.exit(1);
  });