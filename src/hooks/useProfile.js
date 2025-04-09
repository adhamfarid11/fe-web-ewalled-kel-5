import { useState, useEffect } from "react";
import axiosInstance from "../api/axiosInstance";

const useProfile = (userId) => {
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchProfile = async () => {
        try {
            setLoading(true);
            const response = await axiosInstance.get(`/users/me`);

            setProfile(response.data);
        } catch (err) {
            setError(err);
        } finally {
            setLoading(false);
        }
    };

    return { profile, fetchProfile, loading, error };
};

export default useProfile;
