const prisma = require('../utils/prisma');
const { parse, addMinutes, isBefore, startOfDay, endOfDay } = require('date-fns');

exports.generateSlots = async (dateStr, eventType, userId) => {
    const date = new Date(dateStr);
    const dayOfWeek = date.getDay();

    const startOfDate = new Date(dateStr);
    startOfDate.setUTCHours(0, 0, 0, 0);
    const endOfDate = new Date(dateStr);
    endOfDate.setUTCHours(23, 59, 59, 999);

    const override = await prisma.dateOverride.findFirst({
        where: { userId, date: startOfDate }
    });

    let startTimeStr, endTimeStr;

    if (override) {
        if (override.isBlocked) return [];
        startTimeStr = override.startTime;
        endTimeStr = override.endTime;
    } else {
        const availability = await prisma.availability.findFirst({
            where: { userId, dayOfWeek }
        });
        if (!availability) return [];
        startTimeStr = availability.startTime;
        endTimeStr = availability.endTime;
    }

    const slots = [];
    const startObj = parse(startTimeStr, 'HH:mm', date);
    const endObj = parse(endTimeStr, 'HH:mm', date);

    let current = startObj;
    const slotDuration = eventType.duration || 30;

    while (isBefore(addMinutes(current, slotDuration), endObj) || current.getTime() + slotDuration * 60000 === endObj.getTime()) {
        slots.push({
            start: current.toISOString(),
            end: addMinutes(current, slotDuration).toISOString(),
            bufferedStart: addMinutes(current, -(eventType.bufferBefore || 0)).toISOString(),
            bufferedEnd: addMinutes(current, slotDuration + (eventType.bufferAfter || 0)).toISOString()
        });
        // Original logic jumped by duration
        current = addMinutes(current, 15); // changed to 15 to allow better slot finding with buffers
    }

    // Include surrounding days to catch overlapping buffers
    const bookings = await prisma.booking.findMany({
        where: {
            eventType: { userId },
            status: 'CONFIRMED',
            startTime: { gte: addMinutes(startOfDate, -1440), lte: addMinutes(endOfDate, 1440) }
        },
        include: { eventType: true }
    });

    const availableSlots = slots.filter(slot => {
        const slotStart = new Date(slot.bufferedStart).getTime();
        const slotEnd = new Date(slot.bufferedEnd).getTime();

        return !bookings.some(b => {
            const bStart = new Date(b.startTime).getTime() - (b.eventType.bufferBefore || 0) * 60000;
            const bEnd = new Date(b.endTime).getTime() + (b.eventType.bufferAfter || 0) * 60000;
            return (slotStart < bEnd && slotEnd > bStart);
        });
    });

    const now = new Date();
    // deduplicate the starts to avoid multiple slots at same time
    const uniqueSlots = [];
    const seen = new Set();
    for (const s of availableSlots) {
        if (!seen.has(s.start) && new Date(s.start) > now && isBefore(addMinutes(new Date(s.start), slotDuration), addMinutes(endObj, 1))) {
            seen.add(s.start);
            uniqueSlots.push({ start: s.start, end: s.end });
        }
    }

    return uniqueSlots;
};
