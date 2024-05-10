import { createContext, useEffect, useState } from "react";
import config from "../../common/config";
import ServiceRequest from "../../utils/service-request";

export const UserContext = createContext();

export const UserContextComponent = ({ children }) => {
  const [user, setUser] = useState({});

  function updateUserDetails(data) {
    console.log("updateUserDetails", data);
    setUser(data);
  }
  const token = localStorage.getItem("token");

  const getUserDetails = async () => {
    let url = `${config.baseurl}/getuserbytoken`;

    let resp = await ServiceRequest({ url, method: "GET" });
    console.log("getUserDetails=>", resp.data);
    setUser(resp.data.data);
  };

  useEffect(() => {
    if (!user?.name && token) {
      getUserDetails();
    }
  }, [user, token]);

  return (
    <UserContext.Provider value={{ user, updateUserDetails }}>
      {children}
    </UserContext.Provider>
  );
};
