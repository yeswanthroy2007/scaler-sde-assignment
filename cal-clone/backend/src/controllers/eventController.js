const prisma = require('../utils/prisma');

const USER_ID = 1;

exports.getEvents = async (req, res) => {
    try {
        const events = await prisma.eventType.findMany({
            where: { userId: USER_ID },
            include: { questions: true }
        });
        res.json(events);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.createEvent = async (req, res) => {
    try {
        const { title, description, duration, slug, bufferBefore, bufferAfter } = req.body;

        await prisma.user.upsert({
            where: { id: USER_ID },
            update: {},
            create: { id: USER_ID, name: 'Default User', email: 'default@example.com' }
        });

        const event = await prisma.eventType.create({
            data: {
                title,
                description,
                duration: parseInt(duration),
                slug,
                bufferBefore: parseInt(bufferBefore) || 0,
                bufferAfter: parseInt(bufferAfter) || 0,
                userId: USER_ID
            }
        });
        res.status(201).json(event);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.updateEvent = async (req, res) => {
    try {
        const { id } = req.params;
        const { title, description, duration, slug, bufferBefore, bufferAfter } = req.body;
        const event = await prisma.eventType.update({
            where: { id: parseInt(id) },
            data: {
                title,
                description,
                duration: parseInt(duration),
                slug,
                bufferBefore: parseInt(bufferBefore) || 0,
                bufferAfter: parseInt(bufferAfter) || 0
            }
        });
        res.json(event);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.deleteEvent = async (req, res) => {
    try {
        const { id } = req.params;
        await prisma.eventType.delete({ where: { id: parseInt(id) } });
        res.status(204).send();
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.getEventBySlug = async (req, res) => {
    try {
        const { slug } = req.params;
        const event = await prisma.eventType.findUnique({
            where: { slug },
            include: { questions: true }
        });
        if (!event) return res.status(404).json({ error: 'Event not found' });
        res.json(event);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Custom Questions
exports.getQuestions = async (req, res) => {
    try {
        const { eventId } = req.params;
        const questions = await prisma.bookingQuestion.findMany({
            where: { eventTypeId: parseInt(eventId) }
        });
        res.json(questions);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.createQuestion = async (req, res) => {
    try {
        const { eventId } = req.params;
        const { question, required } = req.body;
        const newQ = await prisma.bookingQuestion.create({
            data: {
                eventTypeId: parseInt(eventId),
                question,
                required: !!required
            }
        });
        res.status(201).json(newQ);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
