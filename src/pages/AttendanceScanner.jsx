import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import QRCodeScanner from "../components/QRCodeScanner";
import Modal from "./components/Modal";
import api from "../api/api";

function AttendanceScanner() {
    const { officeId } = useParams();
    const [message, setMessage] = useState("");
    const [showModal, setShowModal] = useState(false);
    const [scannedUser, setScannedUser] = useState(null);
    const [isProcessing, setIsProcessing] = useState(false); // prevent duplicate scans

    useEffect(() => {
        if (!officeId) {
            setMessage("❌ No office detected in URL.");
        }
    }, [officeId]);

    const handleUserScan = async (data) => {
        if (!data || isProcessing) return; // ignore empty/duplicate scans
        setIsProcessing(true);

        try {
            // Verify user exists
            const resUser = await api.get(`/users/${data}`);
            const user = resUser.data;

            // Record attendance
            await api.post("/attendance", {
                user_id: user.id,
                office_id: officeId,
            });

            setScannedUser(user);
            setMessage(`✅ Attendance recorded for ${user.name}`);
            setShowModal(true);
        } catch (err) {
            console.error("❌ Error verifying or recording attendance:", err);
            setMessage("❌ Invalid User ID or failed to record attendance.");
        } finally {
            // allow scanning again after a short delay
            setTimeout(() => setIsProcessing(false), 2000);
        }
    };

    return (
        <div className="p-6">
            <h1 className="text-xl font-bold mb-4">Attendance Scanner</h1>

            {!officeId ? (
                <p className="text-red-600">{message}</p>
            ) : (
                <div>
                    <h2 className="text-lg mb-2">Scan User QR Code</h2>
                    <QRCodeScanner onScan={handleUserScan} />
                </div>
            )}

            {message && <p className="mt-4">{message}</p>}

            {/* Modal Welcome */}
            {showModal && (
                <Modal onClose={() => setShowModal(false)} title="Attendance Time In">
                    <div className="text-center">
                        <p className="text-lg font-bold text-green-600">
                            Attendance Time In
                        </p>
                        <p className="mt-2">
                            Welcome, <span className="font-semibold">{scannedUser?.name}</span> 🎉
                        </p>
                        <button
                            onClick={() => setShowModal(false)}
                            className="mt-4 bg-blue-600 text-white px-4 py-2 rounded"
                        >
                            Close
                        </button>
                    </div>
                </Modal>
            )}
        </div>
    );
}

export default AttendanceScanner;
