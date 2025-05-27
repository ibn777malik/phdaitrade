const prisma = require('../prismaClient');
console.log('Prisma Client Models:', Object.keys(prisma));
const bcrypt = require('bcrypt');

async function main() {
  const email = 'phdai@abdallamalik.com';
  const password = '1234567ASD';
  const hashedPassword = await bcrypt.hash(password, 10);

  const existingUser = await prisma.user.findUnique({ where: { email } });

  if (!existingUser) {
    await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
      },
    });
    console.log('✅ Seeded admin user');
  } else {
    console.log('ℹ️ Admin user already exists');
  }

  const sampleTrade = await prisma.trade.create({
    data: {
      symbol: 'EURUSD',
      side: 'buy',
      volume: 0.01,
      status: 'open',
      profit: 0,
      stopLossPips: 30,
      takeProfitPips: 60,
    },
  });
  console.log('✅ Seeded sample trade:', sampleTrade);
}

main()
  .catch(e => {
    console.error('❌ Error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
