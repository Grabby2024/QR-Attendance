import React from "react";
import {
    Home,
    ClipboardList,
    BarChart3,
    User,
    LogOut,
    ChevronRight,
    Clock,
} from "lucide-react";
import { NavLink } from "react-router-dom";

function Sidebar() {
    const menuItems = [
        { name: "Home", icon: Home, path: "/admin" },
        { name: "List of Attendance", icon: ClipboardList, path: "/admin/attendance-list" },
        { name: "Statistical Data", icon: BarChart3, path: "/admin/statistics" },
        { name: "Offices", icon: Home, path: "/admin/offices" }, // added Offices
    ];

    return (
        <aside className="h-screen w-72 bg-white border-r border-gray-200 flex flex-col">
            {/* Logo / Header */}
            <div className="p-6 border-b border-gray-200">
                <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center">
                        <div className="w-7 h-7 bg-white rounded flex items-center justify-center">
                            <div className="w-4 h-4 bg-blue-600 rounded-sm"></div>
                        </div>
                    </div>
                    <div>
                        <h2 className="text-xl font-semibold text-black">Attendance</h2>
                        <p className="text-sm text-gray-600 font-medium">Management System</p>
                    </div>
                </div>
            </div>

            {/* Navigation */}
            <nav className="flex-1 p-6">
                <ul className="space-y-2">
                    {menuItems.map((item) => {
                        const Icon = item.icon;
                        return (
                            <li key={item.name}>
                                <NavLink
                                    to={item.path}
                                    end={item.path === "/admin"}
                                    className={({ isActive }) =>
                                        `w-full flex items-center justify-between p-4 rounded-lg cursor-pointer transition-all duration-200 ${isActive
                                            ? "bg-blue-600 text-white"
                                            : "text-gray-700 hover:bg-blue-50 hover:text-blue-700"
                                        }`
                                    }
                                >
                                    {({ isActive }) => (
                                        <>
                                            <div className="flex items-center gap-4">
                                                <Icon
                                                    className={`w-5 h-5 ${isActive
                                                        ? "text-white"
                                                        : "text-gray-500"
                                                        }`}
                                                />
                                                <span className="text-sm font-medium">{item.name}</span>
                                            </div>
                                            {isActive && (
                                                <ChevronRight className="w-4 h-4 text-white" />
                                            )}
                                        </>
                                    )}
                                </NavLink>
                            </li>
                        );
                    })}
                </ul>
            </nav>

            {/* User Profile Section */}
            <div className="p-6 border-t border-gray-200">
                <div className="flex items-center gap-3 p-4 rounded-lg bg-gray-50 mb-4">
                    <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center">
                        <span className="text-white text-sm font-semibold">AD</span>
                    </div>
                    <div className="flex-1">
                        <p className="text-sm font-semibold text-black">Admin User</p>
                        <p className="text-xs text-gray-600">admin@company.com</p>
                    </div>
                </div>

                {/* Logout Button */}
                <button className="flex items-center gap-3 w-full p-4 rounded-lg text-red-600 hover:bg-red-50 hover:text-red-700 transition-all duration-200">
                    <LogOut className="w-5 h-5" />
                    <span className="text-sm font-medium">Sign Out</span>
                </button>
            </div>
        </aside>
    );
}

export default Sidebar;
