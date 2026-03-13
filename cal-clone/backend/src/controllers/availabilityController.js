const prisma = require('../utils/prisma');

const USER_ID = 1;

exports.getAvailability = async (req, res) => {
    try {
        const availability = await prisma.availability.findMany({
            where: { userId: USER_ID }
        });
        res.json(availability);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.saveAvailability = async (req, res) => {
    try {
        const { availabilities } = req.body;

        await prisma.user.upsert({
            where: { id: USER_ID },
            update: {},
            create: { id: USER_ID, name: 'Default User', email: 'default@example.com' }
        });

        await prisma.$transaction([
            prisma.availability.deleteMany({ where: { userId: USER_ID } }),
            prisma.availability.createMany({
                data: availabilities.map(a => ({ ...a, userId: USER_ID }))
            })
        ]);

        res.json({ message: 'Availability updated' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
