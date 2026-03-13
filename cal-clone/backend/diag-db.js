const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function listOverrides() {
    try {
        const overrides = await prisma.dateOverride.findMany({
            orderBy: { date: 'asc' }
        });
        console.log('--- Date Overrides ---');
        overrides.forEach(o => {
            console.log(`ID: ${o.id}, Date: ${o.date.toISOString()}, Time: ${o.startTime} - ${o.endTime}, Blocked: ${o.isBlocked}`);
        });
        console.log('----------------------');

        const availability = await prisma.availability.findMany({
            where: { userId: 1 }
        });
        console.log('--- Weekly Availability ---');
        availability.forEach(a => {
            console.log(`Day: ${a.dayOfWeek}, Time: ${a.startTime} - ${a.endTime}`);
        });
        console.log('---------------------------');

    } catch (e) {
        console.error(e);
    } finally {
        await prisma.$disconnect();
    }
}

listOverrides();
