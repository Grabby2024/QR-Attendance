import axios from "axios";

const api = axios.create({
    baseURL: import.meta.env.VITE_REACT_APP_URL, // e.g. https://qr-attendance-server-1gss.onrender.com
});

export default api;
