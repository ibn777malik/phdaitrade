const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  // Create a user
  const user = await prisma.user.create({
    data: {
         email: 'phdaitrade@abdallamalik.com',
      password: '1234567ASD',
    },
  });

  // Create some trades linked to this user (if you later add user relation)
  const trades = await prisma.trade.createMany({
    data: [
      {
        symbol: 'EURUSD',
        side: 'buy',
        volume: 1.2,
        status: 'open',
        profit: 0,
        stopLossPips: 30,
        takeProfitPips: 60,
      },
      {
        symbol: 'GBPUSD',
        side: 'sell',
        volume: 0.8,
        status: 'closed',
        profit: 25.5,
        closedAt: new Date(),
      },
    ],
  });

  console.log(`✅ Seeded 1 user and ${trades.count} trades`);
}

main()
  .then(() => {
    console.log('✅ Done seeding');
    return prisma.$disconnect();
  })
  .catch((e) => {
    console.error('❌ Error during seed:', e);
    prisma.$disconnect();
    process.exit(1);
  });


