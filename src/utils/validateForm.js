// Helper function to validate email and password
const validateForm = (formData) => {
    const { email, password, phoneNumber } = formData;

    // Email regex
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    // Password regex: at least 8 characters, one uppercase, one lowercase, one number
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;
    const phoneRegex = /^\+?\d+$/; // allows optional '+' at start and only digits

    if (email && !emailRegex.test(email)) {
        return "Email tidak valid.";
    }

    if (password && !passwordRegex.test(password)) {
        return "Password harus memiliki minimal 8 karakter, mengandung huruf besar, huruf kecil, dan angka.";
    }

    if (phoneNumber && !phoneRegex.test(phoneNumber)) {
        return "Nomor telepon hanya boleh mengandung angka dan boleh diawali dengan '+'.";
    }
    return "";
};

export default validateForm;
