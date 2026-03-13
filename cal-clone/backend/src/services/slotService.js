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

    const [startH, startM] = startTimeStr.split(':').map(Number);
    const [endH, endM] = endTimeStr.split(':').map(Number);

    const startObj = new Date(startOfDate);
    startObj.setUTCHours(startH, startM, 0, 0);

    const endObj = new Date(startOfDate);
    endObj.setUTCHours(endH, endM, 0, 0);

    const slots = [];
    let current = new Date(startObj);
    const slotDuration = eventType.duration || 30;

    while (isBefore(addMinutes(current, slotDuration), endObj) || current.getTime() + slotDuration * 60000 === endObj.getTime()) {
        const slotEnd = addMinutes(current, slotDuration);

        // Ensure the slot remains within the same UTC day as the startObj 
        // to avoid "next day" slots showing up unexpectedly
        if (slotEnd.getUTCDate() === startObj.getUTCDate()) {
            slots.push({
                start: current.toISOString(),
                end: slotEnd.toISOString(),
                bufferedStart: addMinutes(current, -(eventType.bufferBefore || 0)).toISOString(),
                bufferedEnd: addMinutes(slotEnd, (eventType.bufferAfter || 0)).toISOString()
            });
        }
        current = addMinutes(current, 15);
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
