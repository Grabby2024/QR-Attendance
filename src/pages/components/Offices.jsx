import React, { useState, useEffect, useRef, useCallback } from "react";
import { QRCodeSVG } from "qrcode.react";
import { getOffices, createOffice, deleteOffice, updateOffice } from "../../api/Office";
import * as htmlToImage from "html-to-image";

function Offices() {
    const [offices, setOffices] = useState([]);
    const [name, setName] = useState("");
    const [selectedOffice, setSelectedOffice] = useState(null);
    const [previewOffice, setPreviewOffice] = useState(null);
    const [editOffice, setEditOffice] = useState(null);
    const [editName, setEditName] = useState("");
    const modalContentRef = useRef(null);

    useEffect(() => {
        fetchOffices();
    }, []);

    const fetchOffices = async () => {
        try {
            const data = await getOffices();
            setOffices(data);
        } catch (err) {
            console.error("❌ Failed to fetch offices:", err);
        }
    };

    const handleAddOffice = async () => {
        if (!name.trim()) return;
        try {
            const office = await createOffice({ name });
            setOffices([...offices, office]);
            setName("");
        } catch (err) {
            console.error("❌ Failed to create office:", err);
        }
    };

    const handleDelete = async (id) => {
        try {
            await deleteOffice(id);
            setOffices(offices.filter((o) => o.id !== id));
            if (selectedOffice?.id === id) setSelectedOffice(null);
            if (previewOffice?.id === id) setPreviewOffice(null);
        } catch (err) {
            console.error("❌ Failed to delete office:", err);
        }
    };

    const handleEditSave = async () => {
        if (!editName.trim() || !editOffice) return;
        try {
            const updated = await updateOffice(editOffice.id, { name: editName });
            setOffices(offices.map((o) => (o.id === updated.id ? updated : o)));
            setEditOffice(null);
            setEditName("");
        } catch (err) {
            console.error("❌ Failed to update office:", err);
        }
    };

    const handleDownloadFromModal = useCallback(async () => {
        if (!modalContentRef.current || !previewOffice) return;

        try {
            const dataUrl = await htmlToImage.toPng(modalContentRef.current, {
                backgroundColor: "white",
                pixelRatio: 2,
            });

            const link = document.createElement("a");
            link.href = dataUrl;
            link.download = `${previewOffice.name.replace(/\s+/g, "_")}_QR.png`;
            link.click();
        } catch (err) {
            console.error("❌ Download failed:", err);
        }
    }, [previewOffice]);

    return (
        <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-2xl font-bold text-gray-900">Office Management</h1>
                    <p className="text-sm text-gray-600">Manage your office locations and QR codes</p>
                </div>

                {/* Add Office Form */}
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
                    <h2 className="text-lg font-semibold text-gray-900 mb-4">Add New Office</h2>
                    <div className="flex flex-col sm:flex-row gap-3">
                        <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="Enter office name..."
                            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-colors"
                            onKeyPress={(e) => e.key === "Enter" && handleAddOffice()}
                        />
                        <button
                            onClick={handleAddOffice}
                            disabled={!name.trim()}
                            className="px-6 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 text-white font-medium rounded-lg transition-colors"
                        >
                            Add Office
                        </button>
                    </div>
                </div>

                {/* Office Grid */}
                {offices.length === 0 ? (
                    <div className="text-center py-12">
                        <h3 className="text-lg font-medium text-gray-900 mb-2">No offices yet</h3>
                        <p className="text-gray-500">Add your first office location to get started</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {offices.map((office) => (
                            <div
                                key={office.id}
                                className={`bg-white rounded-lg border transition-all duration-200 hover:shadow-md ${selectedOffice?.id === office.id
                                    ? "border-blue-500 ring-2 ring-blue-200 shadow-md"
                                    : "border-gray-200 hover:border-gray-300"
                                    }`}
                                onClick={() => setSelectedOffice(office)}
                            >
                                <div className="p-6">
                                    <h3 className="text-lg font-semibold text-gray-900 mb-4">{office.name}</h3>

                                    {/* QR preview */}
                                    <div className="flex justify-center mb-4">
                                        <div className="p-3 bg-white rounded-lg border border-gray-200">
                                            <QRCodeSVG value={office.qr_code} size={120} includeMargin />
                                        </div>
                                    </div>

                                    <div className="flex gap-2">
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                setPreviewOffice(office);
                                            }}
                                            className="flex-1 px-3 py-2 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 text-sm font-medium rounded-lg border border-indigo-200 transition-colors"
                                        >
                                            Preview
                                        </button>
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                setEditOffice(office);
                                                setEditName(office.name);
                                            }}
                                            className="flex-1 px-3 py-2 bg-yellow-50 hover:bg-yellow-100 text-yellow-700 text-sm font-medium rounded-lg border border-yellow-200 transition-colors"
                                        >
                                            Edit
                                        </button>
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                if (confirm(`Delete "${office.name}"?`)) {
                                                    handleDelete(office.id);
                                                }
                                            }}
                                            className="px-3 py-2 bg-red-50 hover:bg-red-100 text-red-700 text-sm font-medium rounded-lg border border-red-200 transition-colors"
                                        >
                                            Delete
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Edit Modal */}
            {editOffice && (
                <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-xl shadow-xl max-w-sm w-full">
                        <div className="p-4 border-b">
                            <h3 className="text-lg font-semibold text-gray-900">Edit Office</h3>
                        </div>
                        <div className="p-4">
                            <input
                                type="text"
                                value={editName}
                                onChange={(e) => setEditName(e.target.value)}
                                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                            />
                        </div>
                        <div className="p-4 border-t flex justify-end gap-3">
                            <button
                                onClick={() => setEditOffice(null)}
                                className="px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleEditSave}
                                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                            >
                                Save
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* QR Preview Modal */}
            {previewOffice && (
                <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-xl shadow-xl max-w-md w-full max-h-[90vh] overflow-auto">
                        {/* Header */}
                        <div className="flex justify-between items-center p-4 border-b">
                            <h3 className="text-lg font-semibold text-gray-900">QR Code Preview</h3>
                            <button
                                onClick={() => setPreviewOffice(null)}
                                className="text-gray-500 hover:text-gray-700"
                            >
                                ✕
                            </button>
                        </div>

                        {/* Body */}
                        <div ref={modalContentRef} className="p-6 flex flex-col items-center bg-white">
                            <h2 className="text-xl font-bold text-gray-900 mb-4 text-center">
                                {previewOffice.name}
                            </h2>
                            <div className="p-4 border border-gray-200 rounded-lg">
                                <QRCodeSVG value={previewOffice.qr_code} size={240} level="M" includeMargin />
                            </div>
                        </div>

                        {/* Footer */}
                        <div className="p-4 border-t flex justify-end gap-3">
                            <button
                                onClick={() => setPreviewOffice(null)}
                                className="px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                            >
                                Close
                            </button>
                            <button
                                onClick={handleDownloadFromModal}
                                className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white font-medium rounded-lg transition-colors"
                            >
                                Download
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default Offices;
