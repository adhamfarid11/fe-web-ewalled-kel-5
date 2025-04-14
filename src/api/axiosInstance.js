import axios from "axios";

// Create an Axios instance

const axiosInstance = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
    headers: {
        "Content-Type": "application/json",
    },
});

// Add a request interceptor
axiosInstance.interceptors.request.use(
    (config) => {
        // Add Authorization token if available
        const token = localStorage.getItem("token");
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        // Handle request errors
        return Promise.reject(error);
    },
);

// Add a response interceptor
axiosInstance.interceptors.response.use(
    (response) => {
        // Return response data directly
        return response.data;
    },
    (error) => {
        // Handle response errors
        if (error.response) {
            const { status } = error.response;

            // Handle authentication errors
            if (status === 401) {
                // Redirect to login or handle token refresh
                console.error("Unauthorized. Redirecting to login...");
                localStorage.removeItem("token");
                window.location.href = "/login";
            }

            // Handle other errors
            console.error(
                `Error: ${error.response.data.message || "An error occurred"}`,
            );
        } else {
            console.error("Network error or server is unreachable.");
        }

        return Promise.reject(error);
    },
);

export default axiosInstance;
