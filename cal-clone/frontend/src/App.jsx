import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import EventTypeForm from './pages/EventTypeForm';
import AvailabilitySettings from './pages/AvailabilitySettings';
import BookingsDashboard from './pages/BookingsDashboard';
import PublicBookingPage from './pages/PublicBookingPage';
import DateOverrides from './pages/DateOverrides';

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/book/:slug" element={<PublicBookingPage />} />

                <Route path="/" element={<Layout />}>
                    <Route index element={<Dashboard />} />
                    <Route path="event-types/new" element={<EventTypeForm />} />
                    <Route path="event-types/:id" element={<EventTypeForm />} />
                    <Route path="availability" element={<AvailabilitySettings />} />
                    <Route path="date-overrides" element={<DateOverrides />} />
                    <Route path="bookings" element={<BookingsDashboard />} />
                </Route>
            </Routes>
        </Router>
    );
}

export default App;
