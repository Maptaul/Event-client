import { createContext, useEffect, useState } from "react";

export const AuthContext = createContext(null);

// Backend API URL - adjust this to match your backend URL
const API_BASE_URL = "http://localhost:5000"; // Change this to your deployed backend URL when needed

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Initialize authentication state
  useEffect(() => {
    const initializeAuth = () => {
      try {
        const token = localStorage.getItem("auth_token");
        const userData = localStorage.getItem("user_data");

        if (token && userData) {
          const parsedUser = JSON.parse(userData);
          setUser(parsedUser);
        }
      } catch (error) {
        console.error("Error initializing auth:", error);
        localStorage.removeItem("auth_token");
        localStorage.removeItem("user_data");
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();
  }, []);

  // Create new user (Registration)
  const createUser = async (email, password, name = "", photoURL = "") => {
    return new Promise(async (resolve, reject) => {
      setLoading(true);

      try {
        // Prepare request body - only include photoURL if it's a valid non-empty string
        const requestBody = {
          name,
          email,
          password,
        };

        // Only add photoURL if it's provided and not empty
        if (photoURL && photoURL.trim()) {
          requestBody.photoURL = photoURL.trim();
        }

        const response = await fetch(`${API_BASE_URL}/auth/register`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(requestBody),
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || "Registration failed");
        }

        if (data.success) {
          // Store token and user data
          localStorage.setItem("auth_token", data.token);
          localStorage.setItem(
            "user_data",
            JSON.stringify({
              uid: data.user.id,
              email: data.user.email,
              displayName: data.user.name,
              photoURL: data.user.photoURL,
              role: data.user.role,
            })
          );

          const userForState = {
            uid: data.user.id,
            email: data.user.email,
            displayName: data.user.name,
            photoURL: data.user.photoURL,
            role: data.user.role,
          };

          setUser(userForState);
          setLoading(false);
          resolve({ user: userForState });
        } else {
          throw new Error(data.message || "Registration failed");
        }
      } catch (error) {
        setLoading(false);
        reject(error);
      }
    });
  };

  // Sign in user
  const signIn = async (email, password) => {
    return new Promise(async (resolve, reject) => {
      setLoading(true);

      try {
        const response = await fetch(`${API_BASE_URL}/auth/login`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email,
            password,
          }),
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || "Login failed");
        }

        if (data.success) {
          // Store token and user data
          localStorage.setItem("auth_token", data.token);
          localStorage.setItem(
            "user_data",
            JSON.stringify({
              uid: data.user.id,
              email: data.user.email,
              displayName: data.user.name,
              photoURL: data.user.photoURL,
              role: data.user.role,
            })
          );

          const userForState = {
            uid: data.user.id,
            email: data.user.email,
            displayName: data.user.name,
            photoURL: data.user.photoURL,
            role: data.user.role,
          };

          setUser(userForState);
          setLoading(false);
          resolve({ user: userForState });
        } else {
          throw new Error(data.message || "Login failed");
        }
      } catch (error) {
        setLoading(false);
        reject(error);
      }
    });
  };

  // Log out user
  const logOut = async () => {
    return new Promise(async (resolve) => {
      setLoading(true);

      try {
        const token = localStorage.getItem("auth_token");

        if (token) {
          // Call backend logout endpoint
          await fetch(`${API_BASE_URL}/auth/logout`, {
            method: "POST",
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          });
        }
      } catch (error) {
        console.error("Logout API error:", error);
      } finally {
        // Clear local storage regardless of API call result
        localStorage.removeItem("auth_token");
        localStorage.removeItem("user_data");
        setUser(null);
        setLoading(false);
        resolve();
      }
    });
  };

  // Update user profile
  const updateUserProfile = async (name, photoURL) => {
    return new Promise(async (resolve, reject) => {
      try {
        if (!user) {
          throw new Error("No user is currently signed in");
        }

        const token = localStorage.getItem("auth_token");
        if (!token) {
          throw new Error("No authentication token found");
        }

        // For now, just update locally since backend doesn't have profile update endpoint
        // You can add this endpoint to the backend if needed
        const updatedUser = {
          ...user,
          displayName: name || user.displayName,
          photoURL: photoURL || user.photoURL,
        };

        localStorage.setItem("user_data", JSON.stringify(updatedUser));
        setUser(updatedUser);

        resolve();
      } catch (error) {
        reject(error);
      }
    });
  };

  // Get authentication token for API calls
  const getAuthToken = () => {
    return localStorage.getItem("auth_token");
  };

  // These methods are no longer supported in custom auth
  const googleSignIn = async () => {
    throw new Error(
      "Social authentication is not supported in custom auth mode"
    );
  };

  const githubSignIn = async () => {
    throw new Error(
      "Social authentication is not supported in custom auth mode"
    );
  };

  const authInfo = {
    user,
    loading,
    createUser,
    signIn,
    logOut,
    updateUserProfile,
    googleSignIn,
    githubSignIn,
    getAuthToken, // Add this for API calls
  };

  return (
    <AuthContext.Provider value={authInfo}>{children}</AuthContext.Provider>
  );
};

export default AuthProvider;
