import axios from "axios";

const api = axios.create({
    baseURL: import.meta.env.VITE_REACT_APP_URL, // load from .env
});

export default api;
