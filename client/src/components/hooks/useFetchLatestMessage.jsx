import { useContext, useEffect, useState } from "react";
import { ChatContext } from "../context/chat-context";
import { fetchLatestMessageByChatId } from "../../services/chat-service";
import _const from "../../common/const";

const useFetchLatestMessage = (chatId) => {
  const { newMessage, notifications } = useContext(ChatContext);
  const [latestMessage, setLatestMessage] = useState(null);

  useEffect(() => {
    if (!chatId) return;

    const getMessage = async () => {
      try {
        const resp = await fetchLatestMessageByChatId(chatId);
        if (resp.status === _const.SERVICE_FAILURE) {
          console.error("fetchLatestMessageByChatId error=>", resp);
          return;
        }
        setLatestMessage(resp.data);
      } catch (error) {
        console.error("Error fetching latest message", error);
      }
    };

    getMessage();
  }, [chatId, newMessage, notifications]);

  return { latestMessage };
};

export default useFetchLatestMessage;
