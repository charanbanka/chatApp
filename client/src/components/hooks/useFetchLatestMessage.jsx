import { useContext, useEffect, useState } from "react";
import { fetchLatestMessageByChatId } from "../../services/chat-service";
import _const from "../../common/const";

const useFetchLatestMessage = (chatId, newMessage, thisUserNotification,isCurrentUserNotification) => {
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
  }, [newMessage, chatId, thisUserNotification, isCurrentUserNotification]);

  return { latestMessage };
};

export default useFetchLatestMessage;
