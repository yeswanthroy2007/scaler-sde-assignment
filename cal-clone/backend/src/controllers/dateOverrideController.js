const prisma = require('../utils/prisma');

const USER_ID = 1;

exports.getDateOverrides = async (req, res) => {
    try {
        const overrides = await prisma.dateOverride.findMany({
            where: { userId: USER_ID },
            orderBy: { date: 'asc' }
        });
        res.json(overrides);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.createDateOverride = async (req, res) => {
    try {
        const { date, startTime, endTime, isBlocked } = req.body;

        await prisma.user.upsert({
            where: { id: USER_ID },
            update: {},
            create: { id: USER_ID, name: 'Default User', email: 'default@example.com' }
        });

        // Ensure we only store the date without time components (normalize to UTC midnight)
        const overrideDate = new Date(date);
        overrideDate.setUTCHours(0, 0, 0, 0);

        // Use upsert to prevent duplicates for the same date
        const override = await prisma.dateOverride.upsert({
            where: {
                userId_date: {
                    userId: USER_ID,
                    date: overrideDate
                }
            },
            update: {
                startTime: isBlocked ? null : startTime,
                endTime: isBlocked ? null : endTime,
                isBlocked: !!isBlocked
            },
            create: {
                date: overrideDate,
                startTime: isBlocked ? null : startTime,
                endTime: isBlocked ? null : endTime,
                isBlocked: !!isBlocked,
                userId: USER_ID
            }
        });
        res.status(201).json(override);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.deleteDateOverride = async (req, res) => {
    try {
        const { id } = req.params;
        await prisma.dateOverride.delete({
            where: { id: parseInt(id) }
        });
        res.status(204).send();
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
