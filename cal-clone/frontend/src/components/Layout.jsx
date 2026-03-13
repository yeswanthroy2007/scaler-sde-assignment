import { Outlet, Link, useLocation } from 'react-router-dom';
import { Calendar, Clock, LayoutDashboard, User } from 'lucide-react';

export default function Layout() {
    const location = useLocation();

    const navigation = [
        { name: 'Event Types', href: '/', icon: LayoutDashboard },
        { name: 'Bookings', href: '/bookings', icon: Calendar },
        { name: 'Availability', href: '/availability', icon: Clock },
        { name: 'Date Overrides', href: '/date-overrides', icon: Clock }
    ];

    return (
        <div className="flex h-screen bg-gray-50">
            <div className="w-64 bg-white border-r">
                <div className="h-16 flex items-center px-6 border-b text-xl font-bold">
                    CalClone
                </div>
                <nav className="p-4 space-y-1">
                    {navigation.map((item) => {
                        const isActive = location.pathname === item.href || (item.href === '/' && location.pathname.startsWith('/event-types'));
                        return (
                            <Link
                                key={item.name}
                                to={item.href}
                                className={`flex items-center px-4 py-2 text-sm font-medium rounded-md ${isActive ? 'bg-gray-100 text-gray-900' : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                                    }`}
                            >
                                <item.icon className="mr-3 h-5 w-5" />
                                {item.name}
                            </Link>
                        );
                    })}
                </nav>
            </div>

            <div className="flex-1 overflow-auto">
                <header className="h-16 bg-white border-b flex items-center justify-end px-8">
                    <div className="flex items-center space-x-2 text-gray-600">
                        <User className="h-5 w-5" />
                        <span className="text-sm font-medium">Demo User</span>
                    </div>
                </header>
                <main className="p-8">
                    <Outlet />
                </main>
            </div>
        </div>
    );
}
