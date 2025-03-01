import { createContext, useState } from "react";
import axios from "axios";
import baseURL from "../assets/API_URL";
export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  const signup = async (userData) => {
    const { data } = await axios.post(`${baseURL}/api/auth/signup`, userData);
    localStorage.setItem("token", data.token);
    setUser(data.user);
  };

  const signin = async (userData) => {
    const { data } = await axios.post(`${baseURL}/api/auth/signin`, userData);
    localStorage.setItem("token", data.token);
    setUser(data.user);
  };

  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, signup, signin, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
