/** @format */

// /** @format */

// // utils/axios.ts
// import axios from "axios";

// const api = axios.create({
//     baseURL: process.env.NEXT_PUBLIC_API_URL,
// });

// api.interceptors.request.use((config) => {
//     // If config.headers['Authorization'] is explicitly set to false, skip token
//     if (config.headers && config.headers["Authorization"] === false) {
//         delete config.headers["Authorization"];
//         return config;
//     }

//     const token = localStorage.getItem("token");
//     if (token) {
//         config.headers.Authorization = `Bearer ${token}`;
//     }
//     return config;
// });

// api.interceptors.response.use(
//     (res) => res,
//     (err) => {
//         if (err.response?.status === 401) {
//             localStorage.removeItem("token");
//             window.location.href = "/login";
//         }
//         return Promise.reject(err);
//     }
// );

// export default api;
