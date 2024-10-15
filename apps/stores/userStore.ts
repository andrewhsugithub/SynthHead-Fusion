import { create } from "zustand";
import { registerUserResponse } from "@packages/types/jwt";
import { type RegisterUserFormSchema } from "@packages/schema/registerSchema";
import { persist } from "zustand/middleware";
import axios from "axios";

// Types
type States = {
  hasUserLogin: boolean;
};

type Actions = {
  onCreateUser: (data: RegisterUserFormSchema) => void;
  getAccessToken: () => string | null;
  onRefresh: () => Promise<void>;
};

// Initial state
const initialState: States = {
  hasUserLogin: false,
};

// Zustand store
const useUserStore = create<States & Actions>((set) => ({
  ...initialState,

  getAccessToken: () => {
    return localStorage.getItem("accessToken");
  },

  // Function to handle user login, stores access token and updates state
  onCreateUser: async (data) => {
    // TODO: add retry logic
    try {
      // TODO: turn axios
      const response = await axios.post("/api/auth/register", data, {
        headers: {
          "Content-Type": "application/json",
        },
      });
      const userResponse: registerUserResponse = response.data;
      console.log(userResponse);
      set({
        hasUserLogin: true,
      });

      localStorage.setItem("accessToken", userResponse.accessToken);
    } catch (e) {
      console.error("Error creating user:", e);
    }
  },

  // Function to refresh the token (typically called when an API call fails due to token expiration)
  onRefresh: async () => {
    try {
      const response = await axios.post(
        "/api/auth/refresh",
        {}, // Empty body (if needed, replace with appropriate data)
        {
          withCredentials: true, // Ensures cookies (like refresh tokens) are sent
        }
      );

      if (response.status === 200) {
        const userResponse = response.data;
        console.log(userResponse);
        // Update access token in localStorage
        localStorage.setItem("accessToken", userResponse.accessToken);
      } else {
        console.error("Failed to refresh token");
        set({ hasUserLogin: false });
        localStorage.removeItem("accessToken");
      }
    } catch (error) {
      console.error("Error refreshing token:", error);
    }
  },
}));

export default useUserStore;
