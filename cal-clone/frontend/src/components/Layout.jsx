import { useState } from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { Calendar, Clock, LayoutDashboard, User, Menu, X } from 'lucide-react';
// this is the code
export default function Layout() {
    const location = useLocation();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    const navigation = [
        { name: 'Event Types', href: '/', icon: LayoutDashboard },
        { name: 'Bookings', href: '/bookings', icon: Calendar },
        { name: 'Availability', href: '/availability', icon: Clock },
        { name: 'Date Overrides', href: '/date-overrides', icon: Clock }
    ];

    const toggleMobileMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);

    return (
        <div className="flex h-screen bg-gray-50 overflow-hidden">
            {/* Mobile Sidebar Overlay */}
            {isMobileMenuOpen && (
                <div
                    className="fixed inset-0 z-40 bg-gray-600 bg-opacity-75 md:hidden"
                    onClick={toggleMobileMenu}
                ></div>
            )}

            {/* Sidebar */}
            <div className={`
                fixed inset-y-0 left-0 z-50 w-64 bg-white border-r transform transition-transform duration-300 ease-in-out
                md:relative md:translate-x-0 ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}
            `}>
                <div className="h-16 flex items-center justify-between px-6 border-b text-xl font-bold">
                    <span>CalClone</span>
                    <button onClick={toggleMobileMenu} className="md:hidden">
                        <X className="h-6 w-6 text-gray-500" />
                    </button>
                </div>
                <nav className="p-4 space-y-1">
                    {navigation.map((item) => {
                        const isActive = location.pathname === item.href || (item.href === '/' && location.pathname.startsWith('/event-types'));
                        return (
                            <Link
                                key={item.name}
                                to={item.href}
                                onClick={() => setIsMobileMenuOpen(false)}
                                className={`flex items-center px-4 py-2 text-sm font-medium rounded-md ${isActive ? 'bg-gray-100 text-gray-900' : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'}`}
                            >
                                <item.icon className="mr-3 h-5 w-5" />
                                {item.name}
                            </Link>
                        );
                    })}
                </nav>
            </div>

            {/* Main Content */}
            <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
                <header className="h-16 bg-white border-b flex items-center justify-between px-4 md:px-8 flex-shrink-0">
                    <button onClick={toggleMobileMenu} className="p-2 -ml-2 text-gray-500 md:hidden">
                        <Menu className="h-6 w-6" />
                    </button>
                    <div className="flex-1"></div>
                    <div className="flex items-center space-x-2 text-gray-600">
                        <User className="h-5 w-5" />
                        <span className="text-sm font-medium hidden sm:inline">Demo User</span>
                    </div>
                </header>
                <main className="flex-1 relative overflow-y-auto focus:outline-none p-4 md:p-8">
                    <Outlet />
                </main>
            </div>
        </div>
    );
}
