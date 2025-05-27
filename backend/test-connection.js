// backend/test-connection.js
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient({
  log: ['query', 'info', 'warn', 'error'],
});

async function testConnection() {
  try {
    console.log('🔌 Testing connection to MongoDB...');
    console.log('📍 Server: 109.199.101.147:27017');
    console.log('🗄️ Database: phdaitrade');
    console.log('👤 User: phdaitrade');
    
    await prisma.$connect();
    console.log('✅ Connection successful!');
    
    // Test a simple query
    console.log('🧪 Testing database query...');
    const userCount = await prisma.user.count();
    console.log(`📊 Current user count: ${userCount}`);
    
    const tradeCount = await prisma.trade.count();
    console.log(`📊 Current trade count: ${tradeCount}`);
    
  } catch (error) {
    console.error('❌ Connection failed:', error.message);
    
    if (error.code === 'ENOTFOUND') {
      console.error('🌐 DNS resolution failed - check server IP');
    } else if (error.code === 'ECONNREFUSED') {
      console.error('🚫 Connection refused - check if MongoDB is running on port 27017');
    } else if (error.message.includes('authentication')) {
      console.error('🔐 Authentication failed - check username/password');
    }
  } finally {
    await prisma.$disconnect();
  }
}

testConnection();