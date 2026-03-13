const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const user = await prisma.user.upsert({
    where: { email: 'john@example.com' },
    update: {},
    create: {
      name: 'John Doe',
      email: 'john@example.com',
    },
  });

  await prisma.eventType.upsert({
    where: { slug: '15-min-meeting' },
    update: {},
    create: {
      title: '15 Min Meeting',
      description: 'Quick sync',
      duration: 15,
      slug: '15-min-meeting',
      userId: user.id
    }
  });

  await prisma.eventType.upsert({
    where: { slug: '30-min-chat' },
    update: {},
    create: {
      title: '30 Min Chat',
      description: 'Extended discussion',
      duration: 30,
      slug: '30-min-chat',
      userId: user.id
    }
  });

  const days = [1, 2, 3, 4, 5];
  for (const day of days) {
    const exists = await prisma.availability.findFirst({
        where: { userId: user.id, dayOfWeek: day }
    });
    if (!exists) {
        await prisma.availability.create({
        data: {
            dayOfWeek: day,
            startTime: '09:00',
            endTime: '17:00',
            timezone: 'UTC',
            userId: user.id
        }
        });
    }
  }

  console.log('Database seeded successfully');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
