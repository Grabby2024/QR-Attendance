import React, { useState, useEffect } from "react";
import { UserPlus, X } from "lucide-react";
import { createUser } from "../api/Users";
import { getOffices } from "../api/Office"; // fetch offices for dropdown

function UserForm({ onAdd, onClose }) {
    const [form, setForm] = useState({
        name: "",
        position: "",
        office_id: "",
    });
    const [offices, setOffices] = useState([]);

    // Load offices for dropdown
    useEffect(() => {
        async function fetchOffices() {
            try {
                const data = await getOffices();
                setOffices(data);
            } catch (err) {
                console.error("❌ Failed to load offices:", err);
            }
        }
        fetchOffices();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!form.name || !form.position || !form.office_id) return;

        try {
            const newUser = await createUser(form);
            onAdd(newUser); // update parent state
            setForm({ name: "", position: "", office_id: "" });
            onClose(); // close modal
        } catch (err) {
            console.error("❌ Failed to create user:", err);
        }
    };

    return (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
            <form
                onSubmit={handleSubmit}
                className="relative w-full max-w-md bg-white rounded-2xl shadow-xl border border-gray-100 p-8 transition hover:shadow-2xl"
            >
                {/* Close Button */}
                <button
                    type="button"
                    onClick={onClose}
                    className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition"
                >
                    <X className="w-6 h-6" />
                </button>

                <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                    <UserPlus className="w-6 h-6 text-green-600" />
                    Add New User
                </h2>

                <div className="grid grid-cols-1 gap-5">
                    {/* Full Name */}
                    <div className="relative">
                        <input
                            type="text"
                            value={form.name}
                            onChange={(e) => setForm({ ...form, name: e.target.value })}
                            className="peer w-full border border-gray-300 rounded-lg px-4 pt-5 pb-2 text-gray-700 placeholder-transparent focus:border-green-500 focus:ring-2 focus:ring-green-200 outline-none transition"
                            placeholder="Full Name"
                            required
                        />
                        <label className="absolute left-4 top-2 text-gray-500 text-sm transition-all peer-placeholder-shown:top-3.5 peer-placeholder-shown:text-gray-400 peer-placeholder-shown:text-base peer-focus:top-2 peer-focus:text-sm peer-focus:text-green-600">
                            Full Name
                        </label>
                    </div>

                    {/* Position */}
                    <div className="relative">
                        <input
                            type="text"
                            value={form.position}
                            onChange={(e) => setForm({ ...form, position: e.target.value })}
                            className="peer w-full border border-gray-300 rounded-lg px-4 pt-5 pb-2 text-gray-700 placeholder-transparent focus:border-green-500 focus:ring-2 focus:ring-green-200 outline-none transition"
                            placeholder="Position"
                            required
                        />
                        <label className="absolute left-4 top-2 text-gray-500 text-sm transition-all peer-placeholder-shown:top-3.5 peer-placeholder-shown:text-gray-400 peer-placeholder-shown:text-base peer-focus:top-2 peer-focus:text-sm peer-focus:text-green-600">
                            Position
                        </label>
                    </div>

                    {/* Office Dropdown */}
                    <div className="relative">
                        <select
                            value={form.office_id}
                            onChange={(e) => setForm({ ...form, office_id: e.target.value })}
                            className="w-full border border-gray-300 rounded-lg px-4 py-3 text-gray-700 focus:border-green-500 focus:ring-2 focus:ring-green-200 outline-none transition"
                            required
                        >
                            <option value="">Select Office</option>
                            {offices.map((office) => (
                                <option key={office.id} value={office.id}>
                                    {office.name}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>

                <button
                    type="submit"
                    className="mt-6 w-full bg-green-600 hover:bg-green-700 text-white py-3 rounded-xl font-semibold shadow-md transition transform hover:-translate-y-0.5 hover:shadow-lg"
                >
                    Save User
                </button>
            </form>
        </div>
    );
}

export default UserForm;
