import { createContext, useEffect, useState } from "react";

export const AuthContext = createContext(null);

// Custom authentication utilities
const USERS_STORAGE_KEY = "learnbridge_users";
const CURRENT_USER_KEY = "learnbridge_current_user";
const SESSION_KEY = "learnbridge_session";

// Helper functions for user management
const getUsersFromStorage = () => {
  try {
    const users = localStorage.getItem(USERS_STORAGE_KEY);
    return users ? JSON.parse(users) : [];
  } catch (error) {
    console.error("Error reading users from storage:", error);
    return [];
  }
};

const saveUsersToStorage = (users) => {
  try {
    localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users));
  } catch (error) {
    console.error("Error saving users to storage:", error);
  }
};

const generateUserId = () => {
  return "user_" + Date.now() + "_" + Math.random().toString(36).substr(2, 9);
};

const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

const validatePassword = (password) => {
  const errors = [];
  if (password.length < 6) {
    errors.push("Password must be at least 6 characters long");
  }
  if (!/[A-Z]/.test(password)) {
    errors.push("Password must contain at least one uppercase letter");
  }
  if (!/[a-z]/.test(password)) {
    errors.push("Password must contain at least one lowercase letter");
  }
  return errors;
};

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Initialize authentication state
  useEffect(() => {
    const initializeAuth = () => {
      try {
        const currentUser = localStorage.getItem(CURRENT_USER_KEY);
        const session = localStorage.getItem(SESSION_KEY);

        if (currentUser && session) {
          const userData = JSON.parse(currentUser);
          const sessionData = JSON.parse(session);

          // Check if session is still valid (24 hours)
          const sessionExpiry = new Date(sessionData.expires);
          if (new Date() < sessionExpiry) {
            setUser(userData);
          } else {
            // Session expired, clear data
            localStorage.removeItem(CURRENT_USER_KEY);
            localStorage.removeItem(SESSION_KEY);
          }
        }
      } catch (error) {
        console.error("Error initializing auth:", error);
        localStorage.removeItem(CURRENT_USER_KEY);
        localStorage.removeItem(SESSION_KEY);
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();
  }, []);

  // Create new user
  const createUser = async (email, password, name = "", photo = "") => {
    return new Promise((resolve, reject) => {
      setLoading(true);

      try {
        // Validate inputs
        if (!email || !password) {
          throw new Error("Email and password are required");
        }

        if (!validateEmail(email)) {
          throw new Error("Invalid email format");
        }

        const passwordErrors = validatePassword(password);
        if (passwordErrors.length > 0) {
          throw new Error(passwordErrors[0]);
        }

        const users = getUsersFromStorage();

        // Check if user already exists
        const existingUser = users.find(
          (u) => u.email.toLowerCase() === email.toLowerCase()
        );
        if (existingUser) {
          throw new Error("An account with this email already exists");
        }

        // Create new user
        const newUser = {
          uid: generateUserId(),
          email: email.toLowerCase(),
          displayName: name || email.split("@")[0],
          photoURL: photo || "",
          role: "student", // default role
          createdAt: new Date().toISOString(),
          lastLogin: new Date().toISOString(),
        };

        // Save password separately (in real app, this would be hashed on server)
        const userWithPassword = {
          ...newUser,
          password: password, // In production, this should be hashed
        };

        users.push(userWithPassword);
        saveUsersToStorage(users);

        // Create session
        const sessionData = {
          expires: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(), // 24 hours
        };

        localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(newUser));
        localStorage.setItem(SESSION_KEY, JSON.stringify(sessionData));

        setUser(newUser);
        setLoading(false);

        resolve({ user: newUser });
      } catch (error) {
        setLoading(false);
        reject(error);
      }
    });
  };

  // Sign in user
  const signIn = async (email, password) => {
    return new Promise((resolve, reject) => {
      setLoading(true);

      try {
        // Validate inputs
        if (!email || !password) {
          throw new Error("Email and password are required");
        }

        if (!validateEmail(email)) {
          throw new Error("Invalid email format");
        }

        const users = getUsersFromStorage();

        // Find user
        const existingUser = users.find(
          (u) =>
            u.email.toLowerCase() === email.toLowerCase() &&
            u.password === password
        );

        if (!existingUser) {
          throw new Error("Invalid email or password");
        }

        // Update last login
        existingUser.lastLogin = new Date().toISOString();
        saveUsersToStorage(users);

        // Create user object without password
        const userForSession = {
          uid: existingUser.uid,
          email: existingUser.email,
          displayName: existingUser.displayName,
          photoURL: existingUser.photoURL,
          role: existingUser.role,
          createdAt: existingUser.createdAt,
          lastLogin: existingUser.lastLogin,
        };

        // Create session
        const sessionData = {
          expires: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(), // 24 hours
        };

        localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(userForSession));
        localStorage.setItem(SESSION_KEY, JSON.stringify(sessionData));

        setUser(userForSession);
        setLoading(false);

        resolve({ user: userForSession });
      } catch (error) {
        setLoading(false);
        reject(error);
      }
    });
  };

  // Log out user
  const logOut = async () => {
    return new Promise((resolve) => {
      setLoading(true);

      try {
        localStorage.removeItem(CURRENT_USER_KEY);
        localStorage.removeItem(SESSION_KEY);
        setUser(null);
        setLoading(false);
        resolve();
      } catch (error) {
        console.error("Error logging out:", error);
        setLoading(false);
        resolve();
      }
    });
  };

  // Update user profile
  const updateUserProfile = async (name, photo) => {
    return new Promise((resolve, reject) => {
      try {
        if (!user) {
          throw new Error("No user is currently signed in");
        }

        const users = getUsersFromStorage();
        const userIndex = users.findIndex((u) => u.uid === user.uid);

        if (userIndex === -1) {
          throw new Error("User not found");
        }

        // Update user data
        users[userIndex].displayName = name || users[userIndex].displayName;
        users[userIndex].photoURL = photo || users[userIndex].photoURL;

        saveUsersToStorage(users);

        // Update current user state
        const updatedUser = {
          ...user,
          displayName: name || user.displayName,
          photoURL: photo || user.photoURL,
        };

        localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(updatedUser));
        setUser(updatedUser);

        resolve();
      } catch (error) {
        reject(error);
      }
    });
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
  };

  return (
    <AuthContext.Provider value={authInfo}>{children}</AuthContext.Provider>
  );
};

export default AuthProvider;
