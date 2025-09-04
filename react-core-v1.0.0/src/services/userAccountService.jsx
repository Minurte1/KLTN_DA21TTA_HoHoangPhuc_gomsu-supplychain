import { toast } from "react-toastify";
import axiosInstance from "../authentication/axiosInstance";
import Cookies from "js-cookie";
import axios from "axios";
import { enqueueSnackbar } from "notistack";
import spService from "../share-service/spService";
import authService from "../redux/redux-service/authServices";
const apiUrl = process.env.REACT_APP_URL_SERVER;

// Login User
export const login = async (account) => {
  try {
    const response = await axiosInstance.post(`${apiUrl}/users/login`, {
      account,
    });

    if (response.data.EC === 200) {
      // Cookies.set("accessToken", response.data.DT.accessToken, {
      //   expires: 7,
      //   path: "",
      // });
      spService.handleAxiosResponse(response);
      return response.data;
    } else {
      return response.data;
    }
  } catch (error) {
    toast.error(error.response.data.EM);
  }
};
export const sendOtpEmail = async (email) => {
  try {
    const response = await axiosInstance.post(`${apiUrl}/send-otp`, {
      email,
    });

    if (response.data.EC === 200) {
      spService.handleAxiosResponse(response);
      return response.data;
    } else {
      return response.data;
    }
  } catch (error) {
    toast.error(error.response.data.EM);
  }
};
export const checkOtpEmail = async (email, otp) => {
  try {
    const response = await axiosInstance.post(`${apiUrl}/check-otp`, {
      email,
      otp,
    });

    if (response.data.EC === 200) {
      spService.handleAxiosResponse(response);
      return response.data;
    } else {
      return response.data;
    }
  } catch (error) {
    toast.error(error.response.data.EM);
  }
};
export const registerUser = async (
  fullName,
  email,
  password,
  confirmPassword
) => {
  try {
    const response = await axiosInstance.post(`${apiUrl}/register`, {
      fullName,
      email,
      password,
      confirmPassword,
    });

    if (response.data.EC === 200) {
      spService.handleAxiosResponse(response);
      return response.data;
    } else {
      return response.data;
    }
  } catch (error) {
    toast.error(error.response.data.EM);
  }
};
export const resetPasswordWithOtpEmail = async (email, otp, newPassword) => {
  try {
    const response = await axiosInstance.post(
      `${apiUrl}/reset-password-with-otp`,
      {
        email,
        otp,
        newPassword,
      }
    );

    if (response.data.EC === 200) {
      spService.handleAxiosResponse(response);
      return response.data;
    } else {
      return response.data;
    }
  } catch (error) {
    toast.error(error.response.data.EM);
  }
};

// Get List of Users
export const getAllUsers = async (ID_COMPANY) => {
  try {
    // Gửi ID_COMPANY nếu có
    const response = await axiosInstance.get(`${apiUrl}/user`, {
      params: ID_COMPANY ? { ID_COMPANY } : {},
    });
    //    spService.handleAxiosResponse(response);
    if (response.data.EC === 1) {
      return response.data.DT;
    }

    return [];
  } catch (error) {
    console.error("Error fetching the list of users:", error);
    return [];
  }
};

export const getUserById = async (id) => {
  try {
    const response = await axiosInstance.get(`${apiUrl}/user/${id}`);
    //    spService.handleAxiosResponse(response);
    if (response.data.EC === 1) {
      return response.data.DT; // Returns the list of users
    }
    return [];
  } catch (error) {
    console.error("Error fetching the list of users:", error);
    return [];
  }
};
// Create New User
export const createUser = async (newUser) => {
  try {
    const formData = new FormData();

    // Append các field thông tin user
    for (const key in newUser) {
      formData.append(key, newUser[key]);
    }

    const response = await axiosInstance.post(
      `${apiUrl}/create-users`,
      formData
    );
    spService.handleAxiosResponse(response);
    if (response.data.EC === 201) {
      return true; // User created successfully
    }
    return false;
  } catch (error) {
    console.error("Error creating new user:", error);
    return false;
  }
};

// Update User
// services/userAccountService.js
export const updateUserById = async (id, updatedUser, avatarFile) => {
  try {
    const formData = new FormData();

    // Append các field thông tin user
    for (const key in updatedUser) {
      formData.append(key, updatedUser[key]);
    }

    // Nếu có file avatar
    if (avatarFile) {
      formData.append("AVATAR", avatarFile);
    }

    const response = await axiosInstance.put(`${apiUrl}/user/${id}`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    spService.handleAxiosResponse(response);
    return response.data;
  } catch (error) {
    console.error("Error updating user:", error);
    throw error;
  }
};

// Delete User
export const deleteUserById = async (userId) => {
  try {
    const response = await axiosInstance.delete(
      `${apiUrl}/user/delete/${userId}`
    );
    spService.handleAxiosResponse(response);
    if (response.data.EC === 200) {
      return true; // User deleted successfully
    }
    return false;
  } catch (error) {
    console.error("Error deleting user:", error);
    return false;
  }
};
export const verifyAdmin = async (accessToken) => {
  if (!accessToken) {
    return false;
  }

  try {
    const response = await axiosInstance.post(
      `${process.env.REACT_APP_URL_SERVER}/verify-admin`,
      {
        token: accessToken,
      }
    );
    spService.handleAxiosResponse(response);
    // Kết quả phản hồi từ backend

    if (response.data.DT.isAdmin) {
      // console.log("User is admin");
      return true;
    } else {
      // console.log("User is not admin");
      return false;
    }
  } catch (error) {
    localStorage.removeItem("accessToken");

    authService.logout();
    enqueueSnackbar(error?.response?.data?.EM, { variant: "info" });
    console.error("Error verifying admin:", error);
    return false;
  }
};
