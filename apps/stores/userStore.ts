import { create } from "zustand";
import { registerUserResponse } from "@packages/types/jwt";
import { type RegisterUserFormSchema } from "@packages/schema/registerSchema";

// Types
type States = {
  hasUserLogin: boolean;
};

type Actions = {
  onCreateUser: (data: RegisterUserFormSchema) => void;
  checkLoginStatus: () => void;
  onRefresh: () => Promise<void>;
};

// Initial state
const initialState: States = {
  hasUserLogin: false,
};

// Zustand store
const useUserStore = create<States & Actions>((set) => ({
  ...initialState,

  // Function to handle user login, stores access token and updates state
  onCreateUser: async (data) => {
    // TODO: add retry logic
    try {
      // TODO: turn axios
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });
      const userResponse: registerUserResponse = await response.json();
      console.log(userResponse);
      set({
        hasUserLogin: true,
      });

      // Store access token in localStorage
      localStorage.setItem("accessToken", userResponse.accessToken);
    } catch (e) {
      console.error("Error creating user:", e);
    }
  },

  // Function to check login status (e.g., on app load)
  checkLoginStatus: () => {
    const accessToken = localStorage.getItem("accessToken");

    if (accessToken) {
      set({
        hasUserLogin: true,
      });
    }
  },

  // Function to refresh the token (typically called when an API call fails due to token expiration)
  onRefresh: async () => {
    try {
      const response = await fetch("/api/auth/refresh", {
        method: "POST",
        credentials: "include", // This ensures the refresh token is sent via cookies
      });

      if (response.ok) {
        const userResponse = await response.json();

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
