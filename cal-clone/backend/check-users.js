const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function checkUsers() {
    try {
        const users = await prisma.user.findMany({
            include: { _count: { select: { dateOverrides: true, availability: true } } }
        });
        console.log('--- Users ---');
        console.log(JSON.stringify(users, null, 2));

        const overrides = await prisma.dateOverride.findMany();
        console.log('--- All Overrides ---');
        console.log(JSON.stringify(overrides, null, 2));

    } catch (e) {
        console.error(e);
    } finally {
        await prisma.$disconnect();
    }
}

checkUsers();
