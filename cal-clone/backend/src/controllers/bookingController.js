const prisma = require('../utils/prisma');
const slotService = require('../services/slotService');
const emailService = require('../utils/emailService');

const USER_ID = 1;

exports.getBookings = async (req, res) => {
    try {
        const bookings = await prisma.booking.findMany({
            include: { eventType: true, answers: { include: { question: true } } },
            orderBy: { startTime: 'desc' }
        });
        res.json(bookings);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.getAvailableSlots = async (req, res) => {
    try {
        const { date, eventTypeId } = req.query;

        if (!date || !eventTypeId) {
            return res.status(400).json({ error: 'Date and eventTypeId are required' });
        }

        const eventType = await prisma.eventType.findUnique({
            where: { id: parseInt(eventTypeId) }
        });

        if (!eventType) return res.status(404).json({ error: 'Event type not found' });

        const slots = await slotService.generateSlots(date, eventType, USER_ID);
        res.json(slots);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.createBooking = async (req, res) => {
    try {
        const { eventTypeId, name, email, startTime, endTime, answers } = req.body;

        const eventType = await prisma.eventType.findUnique({ where: { id: parseInt(eventTypeId) } });

        const overlapping = await prisma.booking.findFirst({
            where: {
                eventType: { userId: USER_ID },
                status: 'CONFIRMED',
                OR: [
                    { startTime: { lt: new Date(endTime), gte: new Date(startTime) } },
                    { endTime: { gt: new Date(startTime), lte: new Date(endTime) } }
                ]
            }
        });

        if (overlapping) {
            return res.status(400).json({ error: 'Time slot is already booked' });
        }

        const bookingData = {
            eventTypeId: parseInt(eventTypeId),
            name,
            email,
            startTime: new Date(startTime),
            endTime: new Date(endTime)
        };

        if (answers && answers.length > 0) {
            bookingData.answers = {
                create: answers.map(a => ({
                    questionId: parseInt(a.questionId),
                    answer: a.answer
                }))
            };
        }

        const booking = await prisma.booking.create({
            data: bookingData,
            include: { eventType: true }
        });

        await emailService.sendBookingConfirmation(email, {
            title: eventType.title,
            bookerName: name,
            startTime: booking.startTime,
            duration: eventType.duration
        });

        res.status(201).json(booking);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.deleteBooking = async (req, res) => {
    try {
        const { id } = req.params;
        const booking = await prisma.booking.update({
            where: { id: parseInt(id) },
            data: { status: 'CANCELLED' },
            include: { eventType: true }
        });

        await emailService.sendCancellationEmail(booking.email, {
            title: booking.eventType.title,
            startTime: booking.startTime
        });

        res.status(204).send();
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.rescheduleBooking = async (req, res) => {
    try {
        const { id } = req.params;
        const { newStartTime, newEndTime } = req.body;

        const existingBooking = await prisma.booking.findUnique({
            where: { id: parseInt(id) },
            include: { eventType: true }
        });

        if (!existingBooking) {
            return res.status(404).json({ error: 'Booking not found' });
        }

        const overlapping = await prisma.booking.findFirst({
            where: {
                id: { not: parseInt(id) },
                eventType: { userId: USER_ID },
                status: 'CONFIRMED',
                OR: [
                    { startTime: { lt: new Date(newEndTime), gte: new Date(newStartTime) } },
                    { endTime: { gt: new Date(newStartTime), lte: new Date(newEndTime) } }
                ]
            }
        });

        if (overlapping) {
            return res.status(400).json({ error: 'Time slot is already booked' });
        }

        const updatedBooking = await prisma.booking.update({
            where: { id: parseInt(id) },
            data: {
                startTime: new Date(newStartTime),
                endTime: new Date(newEndTime)
            },
            include: { eventType: true }
        });

        await emailService.sendRescheduleEmail(updatedBooking.email, {
            title: updatedBooking.eventType.title,
            startTime: updatedBooking.startTime
        });

        res.json(updatedBooking);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
