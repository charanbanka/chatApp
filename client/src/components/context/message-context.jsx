import { createContext, useEffect, useState } from "react";
import config from "../../common/config";
import ServiceRequest from "../../utils/service-request";
import _const from "../../common/const";

export const MessageContext = createContext();

export const MessageContextComponent = ({ children, user, currentChat }) => {
  const [messages, setMessages] = useState([]);
  const fetchMessagesByChatId = async (_id) => {
    try {
      let obj = {
        url: `${config.baseurl}/messages/chat/${_id}`,
        method: "GET",
      };
      let resp = await ServiceRequest(obj);

      if (resp.data.status == _const.SERVICE_FAILURE) {
        console.log("fetchMessagesByChatId failure=>", resp?.data);
        return;
      }
      setMessages(resp.data.data);
    } catch (error) {
      console.log("fetchMessagesByChatId error=>", error);
    }
  };

  const sendMessageToUser = async (data) => {
    try {
      let obj = {
        url: `${config.baseurl}/messages`,
        method: "POST",
        data,
      };
      let resp = await ServiceRequest(obj);

      if (resp.data.status == _const.SERVICE_FAILURE) {
        console.log("sendMessageToUser failure=>", resp?.data);
        return;
      }
      fetchMessagesByChatId(data.chatId);
    } catch (error) {
      console.log("sendMessageToUser error=>", error);
    }
  };

  useEffect(() => {
    if (currentChat?._id) {
      fetchMessagesByChatId(currentChat._id);
    }
  }, [currentChat]);

  return (
    <MessageContext.Provider
      value={{ messages, fetchMessagesByChatId, sendMessageToUser }}
    >
      {children}
    </MessageContext.Provider>
  );
};
