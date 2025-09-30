import api from "./api";

// Get all users
export async function getUsers() {
    const res = await api.get("/users");
    return res.data;
}

// Create user
export async function createUser(user) {
    const res = await api.post("/users", user);
    return res.data;
}

// Delete user
export async function deleteUser(id) {
    const res = await api.delete(`/users/${id}`);
    return res.data;
}
