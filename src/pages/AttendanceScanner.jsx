import { useState, useEffect, useCallback } from "react";
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
    const [scannedUser, setScannedUser] = useState(null);
    const [scanning, setScanning] = useState(false);
    const [userList, setUserList] = useState([]);

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

    //-----------------------------------------------------------------
    // SCAN VERIFICATION AND ATTENDANCE RECORDING LOGIC
    //-----------------------------------------------------------------
    const handleUserScan = useCallback(
        async (data) => {
            if (!data || processing) return;

            setScanning(false);
            setProcessing(true);

            try {
                // Parse scanned QR data
                let scanned;
                try {
                    scanned = JSON.parse(data);
                } catch {
                    setMessage("❌ Scan your ID QR Code.");
                    return;
                }

                const { userId, officeId: qrOfficeId } = scanned;
                if (!userId || !qrOfficeId) {
                    setMessage("❌ QR is missing required fields.");
                    return;
                }

                // ✅ Match user regardless of DB field name or type
                const user = userList.find(
                    (u) =>
                        String(u.id) === String(userId) ||
                        String(u.user_id) === String(userId) ||
                        String(u.userId) === String(userId)
                );

                if (!user) {
                    setMessage("❌ User Not Found.");
                    return;
                }

                // ✅ Use QR officeId if present, else URL officeId
                const officeToRecord = qrOfficeId || officeId;

                // 🔥 Record attendance
                const response = await recordAttendance({
                    user_id: user.id || user.user_id,
                    office_id: officeToRecord,
                });

                setScannedUser(user);

                // Display backend message + time info
                const { message, attendance } = response;
                let timeInfo = "";
                if (attendance?.time_in) {
                    timeInfo = ` (In: ${new Date(attendance.time_in).toLocaleTimeString()})`;
                }
                if (attendance?.time_out) {
                    timeInfo += ` (Out: ${new Date(attendance.time_out).toLocaleTimeString()})`;
                }

                setMessage(`${message} for ${user.name}${timeInfo}`);

                // ✅ Redirect after success
                setTimeout(() => {
                    window.location.href = "https://www.google.com";
                }, 1500);

            } catch (err) {
                console.error("❌ Error verifying or recording attendance:", err);
                setMessage("❌ Failed to verify user or record attendance.");
            } finally {
                setProcessing(false);
                setShowModal(true);
            }
        },
        [userList, officeId, processing]
    );

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header Bar */}
            <div className="bg-white border-b border-gray-200">
                <div className="max-w-5xl mx-auto px-6 py-6">
                    <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
                            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z" />
                            </svg>
                        </div>
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900">Attendance System</h1>
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
                                <svg className="w-4 h-4 text-red-600" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                                </svg>
                            </div>
                            <div>
                                <h3 className="font-semibold text-gray-900">Configuration Error</h3>
                                <p className="text-sm text-gray-600 mt-1">{message}</p>
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="space-y-6">
                        {/* Scanner Card */}
                        <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
                            <div className="px-8 py-6 border-b border-gray-100 flex justify-between items-center">
                                <div>
                                    <h2 className="text-lg font-bold text-gray-900">QR Scanner</h2>
                                    <p className="text-sm text-gray-500">
                                        {scanning ? "Camera active • Ready to scan" : "Start scanner to verify attendance"}
                                    </p>
                                </div>
                                {!scanning && (
                                    <button
                                        onClick={() => setScanning(true)}
                                        className="px-6 py-3 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition-all duration-200"
                                    >
                                        Start Scanning
                                    </button>
                                )}
                            </div>

                            {scanning && (
                                <div className="p-8">
                                    <div className="relative rounded-2xl overflow-hidden border-4 border-blue-600 bg-black">
                                        <QRCodeScanner onScan={handleUserScan} />
                                        <div className="absolute top-4 left-4 bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium flex items-center space-x-2">
                                            <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                                            <span>Scanning...</span>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </div>

            {/* Processing Modal */}
            {processing && (
                <Modal title="Verifying Attendance" onClose={() => { }}>
                    <div className="flex flex-col items-center justify-center py-10">
                        <div className="w-16 h-16 border-4 border-blue-600 rounded-full border-t-transparent animate-spin"></div>
                        <p className="text-gray-700 font-medium mt-6">Processing attendance record...</p>
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
                                    <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                    </svg>
                                </div>
                                <h3 className="text-2xl font-bold text-gray-900 mb-3">Attendance Recorded</h3>
                                {scannedUser && (
                                    <div className="bg-gray-50 rounded-xl p-4 mb-6">
                                        <p className="text-sm text-gray-500 mb-1">Welcome</p>
                                        <p className="text-xl font-bold text-blue-600">{scannedUser.name}</p>
                                    </div>
                                )}
                            </>
                        ) : (
                            <>
                                <div className="mx-auto w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mb-6">
                                    <svg className="w-10 h-10 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </div>
                                <h3 className="text-2xl font-bold text-gray-900 mb-3">Verification Failed</h3>
                                <p className="text-sm text-gray-600 mb-6">{message.replace("❌ ", "")}</p>
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
