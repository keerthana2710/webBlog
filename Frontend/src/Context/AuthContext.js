import React, { useState, useEffect } from "react";
import api from "../api";
export const AuthContext = React.createContext();

const AuthContextProvider = (props) => {
  const [activeUser, setActiveUser] = useState(null);
  const [config, setConfig] = useState({
    headers: {
      "Content-Type": "application/json",
      authorization: `Bearer ${localStorage.getItem("authToken")}`,
    },
  });

  useEffect(() => {
    const token = localStorage.getItem("authToken");

    if (!token) {
      setActiveUser({});
      return;
    }

    const controlAuth = async () => {
      try {
        const { data } = await api.get("/auth/private", config);
        setActiveUser(data.user);
      } catch (error) {
        console.error("Authentication error:", error);
        localStorage.removeItem("authToken");
        setActiveUser({});
      }
    };

    controlAuth();
  }, [config]);

  useEffect(() => {
    // Update config whenever authToken changes
    const token = localStorage.getItem("authToken");
    setConfig((prevConfig) => ({
      ...prevConfig,
      headers: {
        ...prevConfig.headers,
        authorization: `Bearer ${token}`,
      },
    }));
  }, [localStorage.getItem("authToken")]);

  return (
    <AuthContext.Provider value={{ activeUser, setActiveUser, config, setConfig }}>
      {props.children}
    </AuthContext.Provider>
  );
};

export default AuthContextProvider;
