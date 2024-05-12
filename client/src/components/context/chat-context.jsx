import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import config from "../../common/config";
import _const from "../../common/const";
import ServiceRequest from "../../utils/service-request";
// ES modules
import { io } from "socket.io-client";
import { getUserFromChat } from "../../utils";

export const ChatContext = createContext();

export const ChatContextComponent = ({ children, user, allUsers }) => {
  const [userChats, setUserChats] = useState([]);
  const [currentChat, setCurrentChat] = useState({});
  const [currentChatUser, setCurrentChatUser] = useState({});
  const [socket, setSocket] = useState(null);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [isCurrentChatOnline, setIsCurrentChatOnline] = useState(false);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState({});
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    let newSocket = io("http://localhost:5000/");
    setSocket(newSocket);

    return () => newSocket.disconnect();
  }, [user]);

  //add online user

  useEffect(() => {
    if (socket == null) return;
    if (user._id) socket.emit("addNewUser", user._id);
    socket.on("getOnlineUsers", (res) => {
      setOnlineUsers(res);
      if (
        res.length &&
        res.some((onlineUser) => onlineUser.userId === currentChatUser._id)
      ) {
        setIsCurrentChatOnline(true);
      } else setIsCurrentChatOnline(false);
    });
    return () => socket.off("getOnlineUsers");
  }, [socket]);

  //send message
  useEffect(() => {
    if (socket == null) return;

    socket.emit("sendMessage", {
      ...newMessage,
      recepientId: currentChatUser._id,
    });
  }, [newMessage]);

  //receive message and notification
  useEffect(() => {
    if (socket == null) return;

    socket.on("getMessage", (res) => {
      console.log("getMessage=>", res);
      if (res.chatId !== currentChat._id) return;
      setMessages((prev) => {
        return [...prev, res];
      });
    });

    socket.on("getNotification", (res) => {
      console.log("getNotification=>", res);
      const isChatOpen = currentChat?.members?.some(
        (mem) => mem == res.senderId
      );
      if (isChatOpen) {
        setNotifications((prev) => [{ ...res, isRead: true }, ...prev]);
      } else {
        setNotifications((prev) => [res, ...prev]);
      }
    });

    return () => {
      socket.off("getMessage");
      socket.off("getNotification");
    };
  }, [socket, currentChat]);

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

      setNewMessage(resp?.data?.data || data);
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

  const updateCurrentChatAndUser = (chatInfo) => {
    setCurrentChat(chatInfo);
    const newChatUser = getUserFromChat(user._id, chatInfo.members, allUsers);
    setCurrentChatUser(newChatUser);

    if (
      onlineUsers.length &&
      onlineUsers.some((onlineUser) => onlineUser.userId === newChatUser._id)
    ) {
      setIsCurrentChatOnline(true);
    } else setIsCurrentChatOnline(false);
  };

  useEffect(() => {
    if (user?._id) {
      fetchAllChatsByUser(user._id);
    }
  }, [user]);

  const markAllNotificationsAsread = useCallback((allNotifications) => {
    console.log("allNotifications", allNotifications);
    const notificationsRead = allNotifications.map((n) => {
      return { ...n, isRead: true };
    });
    console.log("notificationsRead", notificationsRead);
    setNotifications([notificationsRead[0]]);
  }, []);
  console.log("notifications", notifications);
  return (
    <ChatContext.Provider
      value={{
        userChats,
        setUserChats,
        fetchAllChatsByUser,
        currentChat,
        setCurrentChat,
        updateCurrentChatAndUser,
        onlineUsers,
        currentChatUser,
        setCurrentChatUser,
        isCurrentChatOnline,
        sendMessageToUser,
        fetchMessagesByChatId,
        messages,
        setMessages,
        newMessage,
        setNewMessage,
        notifications,
        setNotifications,
        markAllNotificationsAsread,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};
