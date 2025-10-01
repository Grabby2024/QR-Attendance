import api from "./api";

// Record attendance
export async function recordAttendance({ user_id, office_id }) {
    try {
        const res = await api.post("/api/attendance", { user_id, office_id });
        return res.data;
    } catch (err) {
        console.error("❌ Failed to record attendance:", err);
        throw err;
    }
}

// Get attendance records for a user
export async function getAttendanceByUser(user_id) {
    try {
        const res = await api.get(`/api/attendance/${user_id}`);
        return res.data;
    } catch (err) {
        console.error("❌ Failed to fetch attendance for user:", err);
        throw err;
    }
}
