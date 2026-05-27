import { createContext, useContext, useEffect, useState } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [admin, setAdmin] = useState(null);

  const [token, setToken] = useState(localStorage.getItem("token") || null);

  useEffect(() => {
    const storedAdmin = localStorage.getItem("admin");

    if (storedAdmin) {
      setAdmin(JSON.parse(storedAdmin));
    }
  }, []);

  // Login function
  const login = (adminData, jwtToken) => {
    localStorage.setItem("admin", JSON.stringify(adminData));

    localStorage.setItem("token", jwtToken);

    setAdmin(adminData);

    setToken(jwtToken);
  };

  // Logout function
  const logout = () => {
    localStorage.removeItem("admin");

    localStorage.removeItem("token");

    setAdmin(null);

    setToken(null);
  };

  return (
    <AuthContext.Provider
      value={{
        admin,
        token,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
