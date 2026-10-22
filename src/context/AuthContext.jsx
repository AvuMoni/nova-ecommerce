import {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";
import API_URL from "../api";

const AuthContext = createContext(null);


const TOKEN_KEY = "nova_token";

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  /*
   * Get the currently authenticated user
   */
  const fetchCurrentUser = async (token) => {
    try {
      const response = await fetch(
        `${API_URL}/auth/me`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message ||
            "Unable to load your account."
        );
      }

      setUser(data.user);

      return data.user;
    } catch (error) {
      localStorage.removeItem(TOKEN_KEY);
      setUser(null);

      return null;
    }
  };

  /*
   * Check for an existing login when the app starts
   */
  useEffect(() => {
    const token =
      localStorage.getItem(TOKEN_KEY);

    if (!token) {
      setLoading(false);
      return;
    }

    fetchCurrentUser(token).finally(() => {
      setLoading(false);
    });
  }, []);

  /*
   * Register
   */
  const register = async ({
    name,
    email,
    password,
  }) => {
    const response = await fetch(
      `${API_URL}/auth/register`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          email,
          password,
        }),
      }
    );

    const data = await response.json();

    if (!response.ok) {
      throw new Error(
        data.message ||
          "Registration failed."
      );
    }

    localStorage.setItem(
      TOKEN_KEY,
      data.token
    );

    setUser(data.user);

    return data.user;
  };

  /*
   * Login
   */
  const login = async ({
    email,
    password,
  }) => {
    const response = await fetch(
      `${API_URL}/auth/login`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          password,
        }),
      }
    );

    const data = await response.json();

    if (!response.ok) {
      throw new Error(
        data.message ||
          "Login failed."
      );
    }

    localStorage.setItem(
      TOKEN_KEY,
      data.token
    );

    setUser(data.user);

    return data.user;
  };

  /*
   * Logout
   */
  const logout = () => {
    localStorage.removeItem(TOKEN_KEY);
    setUser(null);
  };

  /*
   * Update profile
   */
  const updateProfile = async ({
    name,
  }) => {
    const token =
      localStorage.getItem(TOKEN_KEY);

    if (!token) {
      throw new Error(
        "Authentication required."
      );
    }

    const response = await fetch(
      `${API_URL}/auth/profile`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          name,
        }),
      }
    );

    const data = await response.json();

    if (!response.ok) {
      throw new Error(
        data.message ||
          "Unable to update your profile."
      );
    }

    setUser(data.user);

    return data.user;
  };

  /*
   * Forgot password
   *
   * The backend reset-email system will be
   * implemented in a later phase.
   */
  const forgotPassword = async (email) => {
    if (!email) {
      throw new Error(
        "Please enter your email address."
      );
    }

    throw new Error(
      "Password reset is not available yet. We will add email-based password recovery in the next authentication phase."
    );
  };

  const value = {
    user,
    loading,
    isAuthenticated: Boolean(user),

    register,
    login,
    logout,
    updateProfile,
    forgotPassword,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context =
    useContext(AuthContext);

  if (!context) {
    throw new Error(
      "useAuth must be used inside AuthProvider."
    );
  }

  return context;
}