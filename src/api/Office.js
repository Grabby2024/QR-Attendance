import api from "./api";

// Get all offices
export async function getOffices() {
    const res = await api.get("/offices");
    return res.data;
}

// Create office
export async function createOffice(office) {
    const res = await api.post("/offices", office);
    return res.data;
}

// Update office
export async function updateOffice(id, office) {
    const res = await api.put(`/offices/${id}`, office);
    return res.data;
}

// Delete office
export async function deleteOffice(id) {
    const res = await api.delete(`/offices/${id}`);
    return res.data;
}
