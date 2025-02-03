import { primaryApi } from '../api';


// Sign up API call
export const signUp = async (data) => {
    try {
        const response = await primaryApi.post('/auth/sign-up', data);
        return { status: true, data: response.data };
    } catch (error) {
        console.error("Error in signup service:", error);
        if (error.response && error.response.data) {
            const { errCode, errMsg } = error.response.data;
            return {
                status: false,
                errCode: errCode || 500,
                message: errMsg || "An unexpected error occurred"
            };
        }
        return { status: false, message: "An unexpected error occurred" };
    }
};

// Verify OTP API call
export const verifyOtp = async (data) => {
    try {
        const response = await primaryApi.post('/auth/verify-otp', data);
        return { status: true, data: response.data };
    } catch (error) {
        console.error("Error in verify OTP service:", error);
        if (error.response && error.response.data) {
            const { errCode, errMsg } = error.response.data;
            return {
                status: false,
                errCode: errCode || 500,
                message: errMsg || "An unexpected error occurred"
            };
        }
        return { status: false, message: "An unexpected error occurred" };
    }
};

// Resend OTP API call
export const resendOtp = async (data) => {
    try {
        const response = await primaryApi.post('/auth/resend-otp', data);
        return { status: true, data: response.data };
    } catch (error) {
        console.error("Error in resend OTP service:", error);
        if (error.response && error.response.data) {
            const { errCode, errMsg } = error.response.data;
            return {
                status: false,
                errCode: errCode || 500,
                message: errMsg || "An unexpected error occurred"
            };
        }
        return { status: false, message: "An unexpected error occurred" };
    }
};

// Login API call
export const login = async (data) => {
    try {
        const response = await primaryApi.post('/auth/login', data);
        return { status: true, data: response.data };
    } catch (error) {
        console.error("Error during login:", error);
        if (error.response && error.response.data) {
            const { errCode, errMsg } = error.response.data;
            return {
                status: false,
                message: errMsg || "An unexpected error occurred",
            };
        }
        return { status: false, message: "An unexpected error occurred" };
    }
};

// Forgot password API call
export const forgotPassword = async (data) => {
    try {
        const response = await primaryApi.post('/auth/forgot-password', data);
        return { status: true, data: response.data };
    } catch (error) {
        console.error("Error in forgot password service:", error);
        if (error.response && error.response.data) {
            const { errCode, errMsg } = error.response.data;
            return {
                status: false,
                errCode: errCode || 500,
                message: errMsg || "An unexpected error occurred"
            };
        }
        return { status: false, message: "An unexpected error occurred" };
    }
};

// Reset password API call
export const resetPassword = async (data) => {
    try {
        const response = await primaryApi.post('/auth/reset-password', data);
        return { status: true, data: response.data };
    } catch (error) {
        console.error("Error in reset password service:", error);
        if (error.response && error.response.data) {
            const { errCode, errMsg } = error.response.data;
            return {
                status: false,
                errCode: errCode || 500,
                message: errMsg || "An unexpected error occurred"
            };
        }
        return { status: false, message: "An unexpected error occurred" };
    }
};


// Fetch roles list from the API
export const getRolesList = async () => {
    try {
        const response = await primaryApi.get('/auth/roles');
        return { status: true, data: response.data };
    } catch (error) {
        console.error("Error fetching roles:", error);
        if (error.response && error.response.data) {
            const { errCode, errMsg } = error.response.data;
            return {
                status: false,
                errCode: errCode || 500,
                message: errMsg || "An unexpected error occurred"
            };
        }
        return { status: false, message: "An unexpected error occurred" };
    }
};

export const fetchRolesById = async (personUuid) => {
    try {
        const response = await primaryApi.get(`auth/person-role/${personUuid}`);
        if (Array.isArray(response.data.data)) {
            return { status: true, data: response.data.data };

        } else {
            return { status: false, message: "Invalid data format" };
        }
    } catch (error) {
        return { status: false, message: error.message };
    }
};

// Fetch sign-up data
export const getSignUpData = async (token) => {
    try {
        const response = await primaryApi.get(`/auth?token=${token}`);
        return { status: true, data: response.data };
    } catch (error) {
        console.error("Error in fetching persons:", error);
        return { status: false, message: "Failed to fetch persons" };
    }
};


// Fetch menu by Role ID
export const fecthMenuByRoleId = async (roleId) => {
    try {
        const response = await primaryApi.get(`menu/${roleId}`);
        return { status: true, data: response.data };
    } catch (error) {
        return { status: false, message: error.message };
    }
};

