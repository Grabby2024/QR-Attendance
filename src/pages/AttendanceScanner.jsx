import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import QRCodeScanner from "../components/QRCodeScanner";
import { fetchUsers, recordAttendance } from "../api/Users";

const AttendanceScanner = () => {
    const { officeId } = useParams(); // from URL
    const [userList, setUserList] = useState([]);
    const [showScanner, setShowScanner] = useState(false);
    const [message, setMessage] = useState("");
    const [isProcessing, setIsProcessing] = useState(false);

    // ✅ Load users once
    useEffect(() => {
        const loadUsers = async () => {
            try {
                const users = await fetchUsers();
                setUserList(users);
            } catch (err) {
                console.error("❌ Failed to load users:", err);
                setMessage("❌ Failed to fetch users.");
            }
        };
        loadUsers();
    }, []);

    // ✅ Handle QR scan
    const handleUserScan = async (scanned) => {
        setShowScanner(false);
        setIsProcessing(true);

        try {
            // Support camelCase & snake_case
            const userId = scanned.userId || scanned.user_id;
            const qrOfficeId = scanned.officeId || scanned.office_id;

            if (!userId) {
                setMessage("❌ Invalid QR code: missing user ID.");
                setIsProcessing(false);
                return;
            }

            // Match user regardless of string/number mismatch
            const user = userList.find(
                (u) =>
                    String(u.id) === String(userId) ||
                    String(u.user_id) === String(userId)
            );

            if (!user) {
                setMessage("❌ User not found.");
                setIsProcessing(false);
                return;
            }

            // Decide officeId (prefer QR → fallback to URL param)
            const officeToRecord = qrOfficeId || officeId;
            if (!officeToRecord) {
                setMessage("❌ Missing office ID.");
                setIsProcessing(false);
                return;
            }

            // Call backend
            const response = await recordAttendance({
                user_id: user.id || user.user_id,
                office_id: officeToRecord,
            });

            console.log("✅ Attendance response:", response);

            const { message, attendance } = response;
            let timeInfo = "";

            // Use backend’s PH timestamps directly (already formatted)
            if (attendance?.time_in) {
                timeInfo = ` (In: ${attendance.time_in})`;
            }
            if (attendance?.time_out) {
                timeInfo += ` (Out: ${attendance.time_out})`;
            }

            setMessage(`👤 ${user.name || user.full_name} → ${message}${timeInfo}`);
        } catch (err) {
            console.error("❌ handleUserScan error:", err);
            setMessage("❌ Failed to verify user or record attendance.");
        } finally {
            setIsProcessing(false);
            setTimeout(() => {
                // 🔧 Replace Google with your app’s success route later
                window.location.href = "https://www.google.com";
            }, 1500);
        }
    };

    return (
        <div className="p-6 text-center">
            <h1 className="text-2xl font-bold mb-4">📷 Attendance Scanner</h1>

            {message && (
                <div className="p-3 mb-4 border rounded bg-gray-100">{message}</div>
            )}

            {isProcessing && <p className="text-blue-500">⏳ Processing...</p>}

            {!showScanner && !isProcessing && (
                <button
                    onClick={() => setShowScanner(true)}
                    className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                >
                    🎯 Scan QR Code
                </button>
            )}

            {showScanner && (
                <QRCodeScanner
                    onScan={handleUserScan}
                    onClose={() => setShowScanner(false)}
                />
            )}
        </div>
    );
};

export default AttendanceScanner;
