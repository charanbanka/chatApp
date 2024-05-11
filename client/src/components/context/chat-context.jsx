import React, { createContext, useContext, useEffect, useState } from "react";
import config from "../../common/config";
import _const from "../../common/const";
import ServiceRequest from "../../utils/service-request";

export const ChatContext = createContext();

export const ChatContextComponent = ({ children, user }) => {
  const [userChats, setUserChats] = useState([]);
  const [currentChat, setCurrentChat] = useState({});

  const fetchAllChats = async () => {
    try {
      let url = `${config.baseurl}/chats`;
      let resp = await ServiceRequest({ url });
      if (resp.data.status === _const.SERVICE_FAILURE) {
        return;
      }
      let data = resp.data.data;
      setAllChats(data);

      let allChatsByUser = data.filter((item) =>
        item.members.includes(user._id)
      );
      setChatsByUser(allChatsByUser);
    } catch (error) {
      console.log("fetchAllChats=>", error);
    }
  };

  const fetchAllChatsByUser = async (user_id) => {
    try {
      let url = `${config.baseurl}/chats/${user_id}`;
      let resp = await ServiceRequest({ url });
      if (resp.data.status === _const.SERVICE_FAILURE) {
        return;
      }
      let data = resp.data.data;
      setUserChats(data);
    } catch (error) {
      console.log("fetchAllChats=>", error);
    }
  };

  useEffect(() => {
    console.log("user", user);
    if (user?._id) {
      fetchAllChatsByUser(user._id);
    }
  }, [user]);

  return (
    <ChatContext.Provider
      value={{
        userChats,
        setUserChats,
        fetchAllChatsByUser,
        currentChat,
        setCurrentChat,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};
