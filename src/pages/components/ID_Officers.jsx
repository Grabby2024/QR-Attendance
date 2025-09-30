import React, { useState } from "react";
import { User, Mail, Phone, Briefcase, X } from "lucide-react";

function ID_Officers() {
    const [selectedOfficer, setSelectedOfficer] = useState(null);

    // Dummy officer data
    const officers = [
        {
            id: 1,
            name: "Juan Dela Cruz",
            role: "President",
            email: "juan.cruz@example.com",
            phone: "+63 912 345 6789",
            department: "Student Council",
            avatar: "https://i.pravatar.cc/150?img=32",
        },
        {
            id: 2,
            name: "Maria Santos",
            role: "Vice President",
            email: "maria.santos@example.com",
            phone: "+63 923 456 7890",
            department: "Student Council",
            avatar: "https://i.pravatar.cc/150?img=47",
        },
        {
            id: 3,
            name: "Carlos Rodriguez",
            role: "Secretary",
            email: "carlos.rodriguez@example.com",
            phone: "+63 934 567 8901",
            department: "Student Council",
            avatar: "https://i.pravatar.cc/150?img=15",
        },
        {
            id: 4,
            name: "Ana Reyes",
            role: "Treasurer",
            email: "ana.reyes@example.com",
            phone: "+63 945 678 9012",
            department: "Student Council",
            avatar: "https://i.pravatar.cc/150?img=28",
        },
    ];

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="max-w-7xl mx-auto px-6 py-8">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-light text-gray-900 mb-2">Officer Directory</h1>
                    <div className="w-16 h-0.5 bg-blue-600"></div>
                </div>

                {/* ID Cards Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {officers.map((officer) => (
                        <div
                            key={officer.id}
                            onClick={() => setSelectedOfficer(officer)}
                            className="group cursor-pointer bg-white border border-gray-200 hover:border-blue-300 rounded-lg overflow-hidden transition-all duration-200 hover:shadow-lg"
                        >
                            {/* Card Header */}
                            <div className="bg-white p-6 text-center border-b border-gray-100">
                                <div className="relative inline-block mb-4">
                                    <img
                                        src={officer.avatar}
                                        alt={officer.name}
                                        className="w-20 h-20 rounded-lg object-cover border-4 border-white shadow-md"
                                    />
                                </div>
                                <h3 className="text-lg font-semibold text-gray-900 mb-1">
                                    {officer.name}
                                </h3>
                                <p className="text-blue-600 font-medium text-sm mb-1">
                                    {officer.role}
                                </p>
                                <p className="text-gray-500 text-xs uppercase tracking-wide">
                                    {officer.department}
                                </p>
                            </div>

                            {/* Card Footer */}
                            <div className="px-6 py-4 bg-gray-50 group-hover:bg-blue-50 transition-colors duration-200">
                                <div className="flex items-center justify-center text-xs text-gray-600 group-hover:text-blue-600">
                                    <span>Click to view details</span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Modal */}
                {selectedOfficer && (
                    <div className="fixed inset-0 bg-blur bg-opacity-50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
                        <div className="bg-white rounded-lg shadow-2xl w-full max-w-md overflow-hidden">
                            {/* Modal Header */}
                            <div className="relative bg-white px-6 py-4 border-b border-gray-200">
                                <h2 className="text-lg font-semibold text-gray-900">
                                    Officer Details
                                </h2>
                                <button
                                    onClick={() => setSelectedOfficer(null)}
                                    className="absolute top-4 right-4 p-1 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors"
                                >
                                    <X size={20} />
                                </button>
                            </div>

                            {/* Modal Content */}
                            <div className="p-6">
                                <div className="text-center mb-6">
                                    <img
                                        src={selectedOfficer.avatar}
                                        alt={selectedOfficer.name}
                                        className="w-24 h-24 rounded-lg object-cover mx-auto mb-4 border-4 border-white shadow-md"
                                    />
                                    <h3 className="text-xl font-semibold text-gray-900 mb-1">
                                        {selectedOfficer.name}
                                    </h3>
                                    <p className="text-blue-600 font-medium mb-1">
                                        {selectedOfficer.role}
                                    </p>
                                    <p className="text-gray-500 text-sm">
                                        {selectedOfficer.department}
                                    </p>
                                </div>

                                {/* Contact Information */}
                                <div className="space-y-4">
                                    <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                                        <div className="flex-shrink-0">
                                            <Mail size={18} className="text-blue-600" />
                                        </div>
                                        <div className="min-w-0 flex-1">
                                            <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">
                                                Email
                                            </p>
                                            <p className="text-sm text-gray-900 truncate">
                                                {selectedOfficer.email}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                                        <div className="flex-shrink-0">
                                            <Phone size={18} className="text-blue-600" />
                                        </div>
                                        <div className="min-w-0 flex-1">
                                            <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">
                                                Phone
                                            </p>
                                            <p className="text-sm text-gray-900">
                                                {selectedOfficer.phone}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                                        <div className="flex-shrink-0">
                                            <Briefcase size={18} className="text-blue-600" />
                                        </div>
                                        <div className="min-w-0 flex-1">
                                            <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">
                                                Department
                                            </p>
                                            <p className="text-sm text-gray-900">
                                                {selectedOfficer.department}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Modal Footer */}
                            <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
                                <button
                                    onClick={() => setSelectedOfficer(null)}
                                    className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors font-medium text-sm"
                                >
                                    Close
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

export default ID_Officers;