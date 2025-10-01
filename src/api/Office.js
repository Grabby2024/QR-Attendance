import api from "./api";

// Fetch all offices
export async function getOffices() {
    try {
        const res = await api.get("/api/offices");
        return res.data;
    } catch (err) {
        console.error("❌ Failed to fetch offices:", err);
        throw err;
    }
}

// Create a new office
export async function createOffice(office) {
    try {
        const res = await api.post("/api/offices", office);
        return res.data;
    } catch (err) {
        console.error("❌ Failed to create office:", err);
        throw err;
    }
}

// Update an office by ID
export async function updateOffice(id, office) {
    try {
        const res = await api.put(`/api/offices/${id}`, office);
        return res.data;
    } catch (err) {
        console.error("❌ Failed to update office:", err);
        throw err;
    }
}

// Delete an office by ID
export async function deleteOffice(id) {
    try {
        const res = await api.delete(`/api/offices/${id}`);
        return res.data;
    } catch (err) {
        console.error("❌ Failed to delete office:", err);
        throw err;
    }
}
