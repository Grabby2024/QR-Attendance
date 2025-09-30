import React, { useState, useEffect, useRef } from "react";
import { PlusCircle, Trash2, Users, Briefcase, Eye, Download, X } from "lucide-react";
import { QRCodeSVG } from "qrcode.react";
import * as htmlToImage from "html-to-image";
import UserForm from "../../components/UserForm";
import { getUsers, deleteUser } from "../../api/Users";

function Home() {
    const [users, setUsers] = useState([]);
    const [showForm, setShowForm] = useState(false);
    const [loading, setLoading] = useState(true);
    const [selectedUser, setSelectedUser] = useState(null);
    const qrRef = useRef(null);

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            setLoading(true);
            const data = await getUsers();
            setUsers(data);
        } catch (err) {
            console.error("❌ Failed to fetch users:", err);
        } finally {
            setLoading(false);
        }
    };

    const addUser = (user) => {
        setUsers((prev) => [...prev, user]);
        setShowForm(false);
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure you want to delete this user?")) return;
        try {
            await deleteUser(id);
            setUsers((prev) => prev.filter((u) => u.id !== id));
        } catch (err) {
            console.error("❌ Failed to delete user:", err);
        }
    };

    const handleViewQR = (user) => setSelectedUser(user);

    const handleDownloadQR = () => {
        if (!qrRef.current) return;
        htmlToImage.toPng(qrRef.current)
            .then((dataUrl) => {
                const link = document.createElement("a");
                link.download = `${selectedUser.name.replace(/\s+/g, "_")}-QR.png`;
                link.href = dataUrl;
                link.click();
            })
            .catch((err) => console.error("❌ Failed to download QR:", err));
    };

    return (
        <div className="min-h-screen bg-slate-50">
            <div className="max-w-7xl mx-auto p-8">
                {/* Header Section */}
                <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8 mb-8">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <div className="w-14 h-14 bg-blue-600 rounded-xl flex items-center justify-center">
                                <Users size={28} className="text-white" />
                            </div>
                            <div>
                                <h1 className="text-3xl font-bold text-slate-900">User Management</h1>
                                <p className="text-slate-600 mt-1">Manage your organization's users and QR codes</p>
                            </div>
                        </div>
                        <button
                            onClick={() => setShowForm(true)}
                            className="flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl shadow-md hover:shadow-lg transition-all duration-200"
                        >
                            <PlusCircle size={20} /> Add New User
                        </button>
                    </div>
                </div>

                {/* User Form Modal */}
                {showForm && <UserForm onAdd={addUser} onClose={() => setShowForm(false)} />}

                {/* User List Section */}
                <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
                    {loading ? (
                        <div className="flex items-center justify-center py-20">
                            <div className="text-center">
                                <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                                <p className="text-slate-600 font-medium">Loading users...</p>
                            </div>
                        </div>
                    ) : users.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-20">
                            <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mb-4">
                                <Users size={32} className="text-slate-400" />
                            </div>
                            <p className="text-slate-600 font-medium text-lg">No users found</p>
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead>
                                    <tr className="bg-slate-50 border-b border-slate-200">
                                        <th className="px-8 py-4 text-left text-xs font-bold text-slate-700 uppercase tracking-wider">Name</th>
                                        <th className="px-8 py-4 text-left text-xs font-bold text-slate-700 uppercase tracking-wider">Position</th>
                                        <th className="px-8 py-4 text-center text-xs font-bold text-slate-700 uppercase tracking-wider">QR Code</th>
                                        <th className="px-8 py-4 text-center text-xs font-bold text-slate-700 uppercase tracking-wider">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-200">
                                    {users.map((user) => {
                                        const qrValue = JSON.stringify({ userId: user.id, officeId: user.office_id || null });
                                        return (
                                            <tr key={user.id} className="hover:bg-slate-50 transition-colors duration-150">
                                                <td className="px-8 py-5 flex items-center gap-3">
                                                    <div className="w-11 h-11 bg-blue-100 rounded-full flex items-center justify-center">
                                                        <span className="text-blue-700 font-bold text-sm">
                                                            {user.name.split(" ").map(n => n[0]).join("").slice(0, 2).toUpperCase()}
                                                        </span>
                                                    </div>
                                                    <div>
                                                        <p className="font-semibold text-slate-900">{user.name}</p>
                                                    </div>
                                                </td>
                                                <td className="px-8 py-5">
                                                    <span className="inline-flex items-center gap-2 px-3 py-1.5 bg-slate-100 text-slate-700 rounded-lg text-sm font-medium">
                                                        <Briefcase size={14} /> {user.position}
                                                    </span>
                                                </td>
                                                <td className="px-8 py-5 text-center">
                                                    <QRCodeSVG value={qrValue} size={48} className="border-2 border-slate-200 rounded-lg p-1 cursor-pointer" onClick={() => handleViewQR(user)} />
                                                </td>
                                                <td className="px-8 py-5 flex items-center justify-center gap-2">
                                                    <button
                                                        onClick={() => handleViewQR(user)}
                                                        className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-100 font-medium text-sm"
                                                    >
                                                        <Eye size={16} /> Preview
                                                    </button>
                                                    <button
                                                        onClick={() => handleDelete(user.id)}
                                                        className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 font-medium text-sm"
                                                    >
                                                        <Trash2 size={16} /> Delete
                                                    </button>
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>

            {/* QR Preview Modal (Only QR centered) */}
            {selectedUser && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-2xl shadow-2xl max-w-sm w-full flex flex-col items-center p-6">
                        <button
                            onClick={() => setSelectedUser(null)}
                            className="self-end w-8 h-8 flex items-center justify-center rounded-lg hover:bg-slate-100 mb-4"
                        >
                            <X size={20} />
                        </button>
                        <div ref={qrRef} className="p-6 bg-white rounded-lg flex items-center justify-center">
                            <QRCodeSVG
                                value={JSON.stringify({ userId: selectedUser.id, officeId: selectedUser.office_id || null })}
                                size={250}
                                level="H"
                                includeMargin={true}
                            />
                        </div>
                        <button
                            onClick={handleDownloadQR}
                            className="mt-6 flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl shadow-md"
                        >
                            <Download size={20} /> Download QR
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}

export default Home;
