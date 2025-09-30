import React from "react";

function Footer() {
    return (
        <footer className="w-full bg-gray-100 border-t py-4 px-6 flex items-center justify-between">
            {/* Left: Copyright */}
            <p className="text-sm text-gray-600">
                © {new Date().getFullYear()} Attendance System. All rights reserved.
            </p>

            {/* Right: Links (optional) */}
            <div className="flex gap-4 text-sm text-gray-600">
                <a href="#" className="hover:text-indigo-600 transition">
                    Privacy Policy
                </a>
                <a href="#" className="hover:text-indigo-600 transition">
                    Terms of Service
                </a>
            </div>
        </footer>
    );
}

export default Footer;
