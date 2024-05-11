import React, { createContext, useContext, useEffect, useState } from "react";
import config from "../../common/config";
import _const from "../../common/const";
import ServiceRequest from "../../utils/service-request";
import { UserContext } from "./user-context";

export const ChatContext = createContext();

export const ChatContextComponent = ({ children }) => {
  const [allChats, setAllChats] = useState([]);
  const [chatsByUser, setChatsByUser] = useState([]);
  const [chatBox, setChatBox] = useState({});

  const { user } = useContext(UserContext);

  const fetchAllChats = async () => {
    try {
      let url = `${config.baseurl}/chats`;
      let resp = await ServiceRequest({ url });
      if (resp.data.status === _const.SERVICE_FAILURE) {
        return;
      }
      let data = resp.data.data;
      setAllChats(data);
      console.log("fetchAllChats allchats", data);
      let allChatsByUser = data.filter((item) =>
        item.members.includes(user._id)
      );
      console.log("allChatsByUser", allChatsByUser);
      setChatsByUser(allChatsByUser);
    } catch (error) {
      console.log("fetchAllChats=>", error);
    }
  };

  const updateChatBox = (data) => {
    setChatBox(data);
  };

  useEffect(() => {
    if (user.name) {
      fetchAllChats();
    }
  }, [user]);

  return (
    <ChatContext.Provider
      value={{ allChats, chatsByUser, chatBox, fetchAllChats, updateChatBox }}
    >
      {children}
    </ChatContext.Provider>
  );
};
