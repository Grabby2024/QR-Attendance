import api from "./api";

// Fetch all users
export async function getUsers() {
    try {
        const res = await api.get("/api/users"); // include /api here
        return res.data;
    } catch (err) {
        console.error("❌ Failed to fetch users:", err);
        throw err;
    }
}

// Create a new user
export async function createUser(user) {
    try {
        const res = await api.post("/api/users", user);
        return res.data;
    } catch (err) {
        console.error("❌ Failed to create user:", err);
        throw err;
    }
}

// Delete a user by ID
export async function deleteUser(id) {
    try {
        const res = await api.delete(`/api/users/${id}`);
        return res.data;
    } catch (err) {
        console.error("❌ Failed to delete user:", err);
        throw err;
    }
}
