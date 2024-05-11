import { createContext, useEffect, useState } from "react";
import config from "../../common/config";
import ServiceRequest from "../../utils/service-request";
import _const from "../../common/const";

export const UserContext = createContext();

export const UserContextComponent = ({ children }) => {
  const [user, setUser] = useState({});
  const [allUsers, setAllUsers] = useState([]);

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

  const fetchAllUsers = async () => {
    try {
      let url = `${config.baseurl}/users`;
      let resp = await ServiceRequest({ url });
      if (resp.data.status == _const.SERVICE_FAILURE) {
        return;
      }
      let data = resp.data.data;

      setAllUsers(data);
      console.log("allusers", data);
    } catch (error) {
      console.log("fetchAllChats=>", error);
    }
  };

  useEffect(() => {
    if (!user?.name && token) {
      getUserDetails();
    }
    if (user.name) {
      fetchAllUsers();
    }
  }, [user, token]);

  return (
    <UserContext.Provider value={{ user, updateUserDetails, allUsers }}>
      {children}
    </UserContext.Provider>
  );
};
