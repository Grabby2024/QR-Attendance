import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import QRCodeScanner from "../components/QRCodeScanner";
import Modal from "./components/Modal";
import { getUsers } from "../api/Users";
import { recordAttendance } from "../api/Attendance";

function AttendanceScanner() {
    const { officeId } = useParams();
    const [message, setMessage] = useState("");
    const [showModal, setShowModal] = useState(false);
    const [processing, setProcessing] = useState(false);
    const [scanning, setScanning] = useState(false);
    const [userList, setUserList] = useState([]);
    const [scannedUser, setScannedUser] = useState(null);

    // ✅ Fetch users once
    useEffect(() => {
        if (!officeId) setMessage("❌ No office detected in URL.");

        const fetchUsers = async () => {
            try {
                const users = await getUsers();
                setUserList(users);
            } catch (err) {
                console.error("❌ Failed to fetch users:", err);
            }
        };
        fetchUsers();
    }, [officeId]);

    //-----------------------------------------------------------------------------------------------------------------
    // SCAN VERIFICATION AND ATTENDANCE RECORDING LOGIC
    //-----------------------------------------------------------------------------------------------------------------
    const handleUserScan = async (scanned) => {
        setProcessing(true);

        try {
            // ✅ Support both camelCase & snake_case from QR
            const userId = scanned.userId || scanned.user_id;
            const qrOfficeId = scanned.officeId || scanned.office_id;

            if (!userId) {
                setMessage("❌ Invalid QR code: missing user ID.");
                setProcessing(false);
                setShowModal(true);
                return;
            }

            // ✅ Match user regardless of string mismatch
            const user = userList.find(
                (u) =>
                    String(u.id) === String(userId) ||
                    String(u.user_id) === String(userId)
            );

            if (!user) {
                setMessage("❌ User not found.");
                setProcessing(false);
                setShowModal(true);
                return;
            }

            // ✅ Office ID fallback (QR > URL param)
            const officeToRecord = qrOfficeId || officeId;
            if (!officeToRecord) {
                setMessage("❌ Missing office ID.");
                setProcessing(false);
                setShowModal(true);
                return;
            }

            // ✅ Call backend
            const response = await recordAttendance({
                user_id: user.id || user.user_id,
                office_id: officeToRecord,
            });

            console.log("✅ Attendance response:", response);

            const { message, attendance } = response;
            let timeInfo = "";

            if (attendance?.time_in) {
                timeInfo = ` (In: ${attendance.time_in})`;
            }
            if (attendance?.time_out) {
                timeInfo += ` (Out: ${attendance.time_out})`;
            }

            setScannedUser(user);
            setMessage(`👤 ${user.name || user.full_name} → ${message}${timeInfo}`);
        } catch (err) {
            console.error("❌ handleUserScan error:", err);
            setMessage("❌ Failed to verify user or record attendance.");
        } finally {
            setProcessing(false);
            setShowModal(true);
        }
    };

    //-----------------------------------------------------------------------------------------------------------------
    // UI
    //-----------------------------------------------------------------------------------------------------------------
    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header Bar */}
            <div className="bg-white border-b border-gray-200">
                <div className="max-w-5xl mx-auto px-6 py-6">
                    <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
                            <svg
                                className="w-6 h-6 text-white"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z"
                                />
                            </svg>
                        </div>
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900">
                                Attendance System
                            </h1>
                            <p className="text-sm text-gray-500">QR Code Verification</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="max-w-5xl mx-auto px-6 py-10">
                {!officeId ? (
                    <div className="bg-white rounded-2xl border border-red-200 p-6">
                        <div className="flex items-start space-x-3">
                            <div className="flex-shrink-0 w-6 h-6 rounded-full bg-red-100 flex items-center justify-center">
                                <svg
                                    className="w-4 h-4 text-red-600"
                                    fill="currentColor"
                                    viewBox="0 0 20 20"
                                >
                                    <path
                                        fillRule="evenodd"
                                        d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                                        clipRule="evenodd"
                                    />
                                </svg>
                            </div>
                            <div>
                                <h3 className="font-semibold text-gray-900">
                                    Configuration Error
                                </h3>
                                <p className="text-sm text-gray-600 mt-1">{message}</p>
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="space-y-6">
                        {/* Scanner Card */}
                        <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
                            {/* Card Header */}
                            <div className="px-8 py-6 border-b border-gray-100">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center space-x-3">
                                        <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center">
                                            <svg
                                                className="w-6 h-6 text-blue-600"
                                                fill="none"
                                                stroke="currentColor"
                                                viewBox="0 0 24 24"
                                            >
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth={2}
                                                    d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 00-1 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z"
                                                />
                                            </svg>
                                        </div>
                                        <div>
                                            <h2 className="text-lg font-bold text-gray-900">
                                                QR Scanner
                                            </h2>
                                            <p className="text-sm text-gray-500">
                                                {scanning
                                                    ? "Camera active • Ready to scan"
                                                    : "Start scanner to verify attendance"}
                                            </p>
                                        </div>
                                    </div>

                                    {!scanning && (
                                        <button
                                            onClick={() => setScanning(true)}
                                            className="px-6 py-3 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition-all duration-200 flex items-center space-x-2 shadow-sm"
                                        >
                                            <svg
                                                className="w-5 h-5"
                                                fill="none"
                                                stroke="currentColor"
                                                viewBox="0 0 24 24"
                                            >
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth={2}
                                                    d="M14 5l7 7m0 0l-7 7m7-7H3"
                                                />
                                            </svg>
                                            <span>Start Scanning</span>
                                        </button>
                                    )}
                                </div>
                            </div>

                            {/* Scanner Area */}
                            {scanning && (
                                <div className="p-8">
                                    <div className="relative rounded-2xl overflow-hidden border-4 border-blue-600 bg-black">
                                        <QRCodeScanner onScan={handleUserScan} />
                                        <div className="absolute top-4 left-4 right-4 flex justify-between items-start">
                                            <div className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium flex items-center space-x-2">
                                                <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                                                <span>Scanning...</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="mt-6 flex items-center justify-center space-x-2 text-sm text-gray-600">
                                        <svg
                                            className="w-5 h-5 text-blue-600"
                                            fill="none"
                                            stroke="currentColor"
                                            viewBox="0 0 24 24"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={2}
                                                d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                                            />
                                        </svg>
                                        <span>
                                            Position QR code within the frame for automatic detection
                                        </span>
                                    </div>
                                </div>
                            )}

                            {/* Empty State */}
                            {!scanning && (
                                <div className="px-8 py-16">
                                    <div className="text-center">
                                        <div className="mx-auto w-20 h-20 bg-gray-100 rounded-2xl flex items-center justify-center mb-4">
                                            <svg
                                                className="w-10 h-10 text-gray-400"
                                                fill="none"
                                                stroke="currentColor"
                                                viewBox="0 0 24 24"
                                            >
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth={1.5}
                                                    d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 00-1 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z"
                                                />
                                            </svg>
                                        </div>
                                        <h3 className="text-lg font-semibold text-gray-900 mb-2">
                                            Ready to Scan
                                        </h3>
                                        <p className="text-sm text-gray-500 max-w-md mx-auto">
                                            Click the "Start Scanning" button above to activate your
                                            camera and begin verifying attendance
                                        </p>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Info Card */}
                        <div className="bg-white rounded-2xl border border-gray-200 p-6">
                            <div className="flex items-start space-x-3">
                                <div className="flex-shrink-0 w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center mt-0.5">
                                    <svg
                                        className="w-4 h-4 text-blue-600"
                                        fill="currentColor"
                                        viewBox="0 0 20 20"
                                    >
                                        <path
                                            fillRule="evenodd"
                                            d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                                            clipRule="evenodd"
                                        />
                                    </svg>
                                </div>
                                <div className="flex-1">
                                    <h3 className="font-semibold text-gray-900 mb-3">How to Use</h3>
                                    <div className="space-y-3">
                                        <div className="flex items-start space-x-3">
                                            <span className="flex-shrink-0 w-6 h-6 bg-gray-100 rounded-lg flex items-center justify-center text-xs font-bold text-gray-700">
                                                1
                                            </span>
                                            <p className="text-sm text-gray-600 pt-0.5">
                                                Click "Start Scanning" to activate the camera
                                            </p>
                                        </div>
                                        <div className="flex items-start space-x-3">
                                            <span className="flex-shrink-0 w-6 h-6 bg-gray-100 rounded-lg flex items-center justify-center text-xs font-bold text-gray-700">
                                                2
                                            </span>
                                            <p className="text-sm text-gray-600 pt-0.5">
                                                Hold the QR code steady within the camera frame
                                            </p>
                                        </div>
                                        <div className="flex items-start space-x-3">
                                            <span className="flex-shrink-0 w-6 h-6 bg-gray-100 rounded-lg flex items-center justify-center text-xs font-bold text-gray-700">
                                                3
                                            </span>
                                            <p className="text-sm text-gray-600 pt-0.5">
                                                Wait for automatic verification and confirmation
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* Processing Modal */}
            {processing && (
                <Modal title="Verifying Attendance" onClose={() => { }}>
                    <div className="flex flex-col items-center justify-center py-10">
                        <div className="relative">
                            <div className="w-16 h-16 border-4 border-gray-200 rounded-full"></div>
                            <div className="w-16 h-16 border-4 border-blue-600 rounded-full border-t-transparent animate-spin absolute top-0 left-0"></div>
                        </div>
                        <p className="text-gray-700 font-medium mt-6">
                            Processing attendance record...
                        </p>
                        <p className="text-sm text-gray-500 mt-2">Please wait a moment</p>
                    </div>
                </Modal>
            )}

            {/* Result Modal */}
            {showModal && !processing && (
                <Modal onClose={() => setShowModal(false)} title="">
                    <div className="text-center py-8 px-6">
                        {message.includes("✅") ? (
                            <>
                                <div className="mx-auto w-20 h-20 bg-blue-600 rounded-full flex items-center justify-center mb-6">
                                    <svg
                                        className="w-10 h-10 text-white"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={3}
                                            d="M5 13l4 4L19 7"
                                        />
                                    </svg>
                                </div>
                                <h3 className="text-2xl font-bold text-gray-900 mb-3">
                                    Attendance Recorded
                                </h3>
                                {scannedUser && (
                                    <div className="bg-gray-50 rounded-xl p-4 mb-6">
                                        <p className="text-sm text-gray-500 mb-1">Welcome</p>
                                        <p className="text-xl font-bold text-blue-600">
                                            {scannedUser.name || scannedUser.full_name}
                                        </p>
                                    </div>
                                )}
                                <p className="text-sm text-gray-600 mb-6">
                                    Your attendance has been successfully verified and recorded
                                </p>
                            </>
                        ) : (
                            <>
                                <div className="mx-auto w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mb-6">
                                    <svg
                                        className="w-10 h-10 text-red-600"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M6 18L18 6M6 6l12 12"
                                        />
                                    </svg>
                                </div>
                                <h3 className="text-2xl font-bold text-gray-900 mb-3">
                                    Verification Failed
                                </h3>
                                <p className="text-sm text-gray-600 mb-6">
                                    {message.replace("❌ ", "")}
                                </p>
                            </>
                        )}
                        <button
                            onClick={() => setShowModal(false)}
                            className="w-full bg-blue-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-blue-700 transition-colors duration-200"
                        >
                            {message.includes("✅") ? "Done" : "Try Again"}
                        </button>
                    </div>
                </Modal>
            )}
        </div>
    );
}

export default AttendanceScanner;
