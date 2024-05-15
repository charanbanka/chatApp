import { useContext, useEffect, useState } from "react";
import { ChatContext } from "../context/chat-context";
import { fetchMessagesByChatId } from "../../services/chat-service";
import _const from "../../common/const";

const useFetchLatestMessage = (chat) => {
  const { newMessage, notifications } = useContext(ChatContext);
  const [latestMessage, setLatestMessage] = useState(null);

  useEffect(() => {
    let getMessage = async () => {
      let resp = await fetchMessagesByChatId(chat._id);
      if (resp.status == _const.SERVICE_FAILURE) {
        console.log("fetchMessagesByChatId error=>", resp);
        return;
      }
      let messages = resp.data;
      setLatestMessage(messages[messages.length - 1]);
    };
    getMessage();
  }, [newMessage, notifications]);

  return { latestMessage };
};

export default useFetchLatestMessage;
