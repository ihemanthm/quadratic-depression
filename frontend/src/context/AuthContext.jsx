import { createContext, useContext, useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import axios from "axios";

export const AuthContext = createContext();

export const useAuthContext = () => {
  return useContext(AuthContext);
};

export const AuthContextProvider = ({ children }) => {
  const [authUser, setAuthUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [check, setCheck] = useState(false);

  useEffect(() => {
    const checkUserLoggedIn = async (e) => {
      setLoading(true);
      // if(check){  
        try {
          const token = localStorage.getItem("token");
          if (!token) {
            throw new Error("No token found");
          }

          const res = await axios.get("/user/get/", {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          const data = res.data;
          setAuthUser(data);
        }
        catch (error) {
          if (error.response && error.response.status === 401) {
            e.preventDefault();
            toast.error("Not authorized. Please log in.");
            window.location.href = "/login/";
          } else {
            toast.error(error.message);
          }
          setAuthUser(null);
        }
        finally {
          setLoading(false);
          setCheck(true);
        }
      // }
    };

    if (!check) {
      checkUserLoggedIn();
    }
  }, [setCheck]);

  return (
    <AuthContext.Provider value={{ authUser, setAuthUser, loading }}>
      {children}
    </AuthContext.Provider>
  );
};
