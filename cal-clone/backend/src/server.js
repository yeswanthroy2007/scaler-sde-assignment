const express = require('express');
const cors = require('cors');
require('dotenv').config();

const eventRoutes = require('./routes/events');
const availabilityRoutes = require('./routes/availability');
const bookingRoutes = require('./routes/bookings');
const dateOverrideRoutes = require('./routes/dateOverrides');

const app = express();

// Update CORS to allow all origins for now or your specific Vercel URL
app.use(cors());
app.use(express.json());

app.use('/api/events', eventRoutes);
app.use('/api/availability', availabilityRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/date-overrides', dateOverrideRoutes);

// Export for Vercel
module.exports = app;

const PORT = process.env.PORT || 5000;

// Only listen if not running as a Vercel function
if (process.env.NODE_ENV !== 'production') {
    app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
    });
}
