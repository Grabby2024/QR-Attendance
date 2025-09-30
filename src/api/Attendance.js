import api from "./api";

// Record attendance
export async function recordAttendance({ user_id, office_id }) {
    const res = await api.post("/attendance", { user_id, office_id });
    return res.data;
}

// Get attendance records for a user
export async function getAttendanceByUser(user_id) {
    const res = await api.get(`/attendance/${user_id}`);
    return res.data;
}
