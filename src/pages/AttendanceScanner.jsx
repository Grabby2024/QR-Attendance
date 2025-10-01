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
    const [scannedUser, setScannedUser] = useState(null);
    const [isProcessing, setIsProcessing] = useState(false);
    const [scanning, setScanning] = useState(false);

    useEffect(() => {
        if (!officeId) {
            setMessage("❌ No office detected in URL.");
        }
    }, [officeId]);

    const handleUserScan = async (data) => {
        if (!data || isProcessing) return;
        setIsProcessing(true);
        try {
            const userList = await getUsers();
            const user = userList.find(u => u.id === data);

            if (!user) {
                setMessage("❌ User not found.");
                return;
            }

            await recordAttendance({ user_id: user.id, office_id: officeId });
            setScannedUser(user);
            setMessage(`✅ Attendance recorded for ${user.name}`);
            setShowModal(true);
        } catch (err) {
            console.error("❌ Error verifying or recording attendance:", err);
            setMessage("❌ Failed to verify user or record attendance.");
        } finally {
            setTimeout(() => setIsProcessing(false), 2000);
        }
    };

    return (
        <div className="min-h-screen bg-white">
            {/* Header */}
            <div className="bg-blue-600 text-white shadow-sm">
                <div className="max-w-4xl mx-auto px-6 py-8">
                    <h1 className="text-3xl font-bold tracking-tight">Attendance Scanner</h1>
                    <p className="mt-2 text-blue-100">Scan QR codes to record attendance</p>
                </div>
            </div>

            {/* Main Content */}
            <div className="max-w-4xl mx-auto px-6 py-12">
                {!officeId ? (
                    <div className="bg-red-50 border border-red-200 rounded-lg p-6">
                        <div className="flex items-center">
                            <svg className="w-6 h-6 text-red-600 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <p className="text-red-800 font-medium">{message}</p>
                        </div>
                    </div>
                ) : (
                    <div className="space-y-8">
                        {/* Scanner Control */}
                        <div className="bg-white border border-gray-200 rounded-xl p-8 shadow-sm">
                            <div className="flex items-center justify-between mb-6">
                                <div>
                                    <h2 className="text-xl font-semibold text-gray-900">QR Code Scanner</h2>
                                    <p className="text-sm text-gray-500 mt-1">
                                        {scanning ? "Scanner is active" : "Click to start scanning"}
                                    </p>
                                </div>
                                <button
                                    onClick={() => setScanning(!scanning)}
                                    className={`px-6 py-3 rounded-lg font-medium transition-all duration-200 shadow-sm ${scanning
                                        ? "bg-black text-white hover:bg-gray-800"
                                        : "bg-blue-600 text-white hover:bg-blue-700"
                                        }`}
                                >
                                    {scanning ? "Stop Scanner" : "Start Scanner"}
                                </button>
                            </div>

                            {/* Scanner Area */}
                            {scanning && (
                                <div className="border-2 border-blue-600 rounded-xl overflow-hidden bg-black/5">
                                    <QRCodeScanner onScan={handleUserScan} />
                                </div>
                            )}

                            {/* Processing Indicator */}
                            {isProcessing && (
                                <div className="mt-6 flex items-center justify-center">
                                    <div className="flex items-center space-x-3 bg-blue-50 px-6 py-3 rounded-lg">
                                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600"></div>
                                        <span className="text-blue-900 font-medium">Processing...</span>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Status Message */}
                        {message && !showModal && (
                            <div className={`rounded-lg p-6 border ${message.includes("✅")
                                ? "bg-green-50 border-green-200"
                                : "bg-red-50 border-red-200"
                                }`}>
                                <div className="flex items-center">
                                    {message.includes("✅") ? (
                                        <svg className="w-6 h-6 text-green-600 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                    ) : (
                                        <svg className="w-6 h-6 text-red-600 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                    )}
                                    <p className={`font-medium ${message.includes("✅") ? "text-green-800" : "text-red-800"
                                        }`}>
                                        {message}
                                    </p>
                                </div>
                            </div>
                        )}

                        {/* Instructions */}
                        <div className="bg-gray-50 border border-gray-200 rounded-xl p-6">
                            <h3 className="font-semibold text-gray-900 mb-3">Instructions</h3>
                            <ul className="space-y-2 text-sm text-gray-600">
                                <li className="flex items-start">
                                    <span className="text-blue-600 font-bold mr-2">1.</span>
                                    <span>Click "Start Scanner" to activate the QR code reader</span>
                                </li>
                                <li className="flex items-start">
                                    <span className="text-blue-600 font-bold mr-2">2.</span>
                                    <span>Position the QR code within the scanner frame</span>
                                </li>
                                <li className="flex items-start">
                                    <span className="text-blue-600 font-bold mr-2">3.</span>
                                    <span>Wait for automatic detection and attendance confirmation</span>
                                </li>
                            </ul>
                        </div>
                    </div>
                )}
            </div>

            {/* Success Modal */}
            {showModal && (
                <Modal onClose={() => setShowModal(false)} title="Attendance Recorded">
                    <div className="text-center py-6">
                        <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
                            <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                        </div>

                        <h3 className="text-2xl font-bold text-gray-900 mb-2">
                            Time In Recorded
                        </h3>

                        <p className="text-gray-600 mb-6">
                            Welcome, <span className="font-semibold text-blue-600">{scannedUser?.name}</span>
                        </p>

                        <button
                            onClick={() => setShowModal(false)}
                            className="bg-blue-600 text-white px-8 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors duration-200 shadow-sm"
                        >
                            Continue
                        </button>
                    </div>
                </Modal>
            )}
        </div>
    );
}

export default AttendanceScanner;