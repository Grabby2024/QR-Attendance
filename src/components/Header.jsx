import React from "react";
import { CalendarCheck, Search } from "lucide-react";

function Header() {
    return (
        <header className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 shadow-md px-6 py-4 flex items-center justify-between">
            {/* Logo + Title */}
            <div className="flex items-center gap-3">
                <CalendarCheck className="text-white w-8 h-8" />
                <h1 className="text-white text-2xl font-semibold tracking-wide">
                    Attendance System
                </h1>
            </div>

            {/* Search Bar */}
            <div className="relative w-80">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                    type="text"
                    placeholder="Search..."
                    className="w-full rounded-full bg-white/90 border border-gray-200 py-2.5 pl-12 pr-4 text-sm text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-sm transition"
                />
            </div>
        </header>
    );
}

export default Header;
