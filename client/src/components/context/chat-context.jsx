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
import { getRandomColor, getUserFromChat } from "../../utils";

export const ChatContext = createContext();

export const ChatContextComponent = ({ children, user, allUsers }) => {
  const [userChats, setUserChats] = useState([]);
  const [currentChat, setCurrentChat] = useState({});
  const [currentChatUser, setCurrentChatUser] = useState({});
  const [newChat, setNewChat] = useState({});
  const [socket, setSocket] = useState(null);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [isCurrentChatOnline, setIsCurrentChatOnline] = useState(false);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState({});
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    let newSocket = io("http://localhost:5000/");
    setSocket(newSocket);
    if (user) {
      fetchAllChatsByUser(user._id);
    }
    return () => newSocket.disconnect();
  }, [user]);
  //add online user
  useEffect(() => {
    if (socket == null) return;
    if (user)
      socket.emit("addNewUser", {
        userId: user._id,
        bgcolor: getRandomColor(),
      });
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
      console.log("getMessage=>", res, currentChat);
      if (res.chatId !== currentChat._id) return;
      setMessages((prev) => {
        return [...prev, res];
      });
    });

    socket.on("getNotification", (res) => {
      console.log("getNotification=>", res);
      const isChatOpen = currentChat?.members?.some(
        (mem) => mem === res.senderId
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
  }, [socket,currentChat]);

  //send chat
  useEffect(() => {
    if (socket == null) return;

    socket.emit("sendChat", { ...newChat, senderId: user._id });
  }, [newChat]);

  //receive chat and notification
  useEffect(() => {
    if (socket == null) return;

    socket.on("getChat", (res) => {
      console.log("getChat=>", res);
      // if (res.chatId !== currentChat._id) return;
      setUserChats((prev) => {
        return [res, ...prev];
      });
    });

    // socket.on("getNotification", (res) => {
    //   console.log("getNotification=>", res);
    //   const isChatOpen = currentChat?.members?.some(
    //     (mem) => mem === res.senderId
    //   );
    //   if (isChatOpen) {
    //     setNotifications((prev) => [{ ...res, isRead: true }, ...prev]);
    //   } else {
    //     setNotifications((prev) => [res, ...prev]);
    //   }
    // });

    return () => {
      socket.off("getChat");
      // socket.off("getNotification");
    };
  }, [socket]);

  useEffect(() => {
    if (currentChat?._id) {
      fetchMessagesByChatId(currentChat._id);
    }
  }, [currentChat]);

  const fetchMessagesByChatId = async (_id) => {
    try {
      let obj = {
        url: `${config.baseurl}/messages/chat/${_id}`,
        method: "GET",
      };
      let resp = await ServiceRequest(obj);

      if (resp.data.status === _const.SERVICE_FAILURE) {
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

      if (resp.data.status === _const.SERVICE_FAILURE) {
        console.log("sendMessageToUser failure=>", resp?.data);
        return;
      }

      setNewMessage(resp?.data?.data || data);
      fetchMessagesByChatId(data.chatId);
    } catch (error) {
      console.log("sendMessageToUser error=>", error);
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

  const updateCurrentChatAndUser = (chatInfo) => {
    setCurrentChat(chatInfo);
    const newChatUser = getUserFromChat(user?._id, chatInfo.members, allUsers);
    setCurrentChatUser(newChatUser);

    if (
      onlineUsers.length &&
      onlineUsers.some((onlineUser) => onlineUser.userId === newChatUser._id)
    ) {
      setIsCurrentChatOnline(true);
    } else setIsCurrentChatOnline(false);
  };

  const markAllNotificationsAsRead = useCallback((allNotifications) => {
    console.log("allNotifications", allNotifications);
    const notificationsRead = allNotifications.map((n) => {
      return { ...n, isRead: true };
    });
    setNotifications(notificationsRead);
  }, []);

  const markNotificationAsRead = useCallback(
    (n, userChats, notifications, user) => {
      const curChat = userChats.find((chat) => {
        let members = [user._id, n.senderId];
        let isCurChat = chat.members.every((mem) => {
          return members.includes(mem);
        });
        return isCurChat;
      });
      console.log("curChat=>", curChat);
      const mNotifications = notifications.map((nt) => {
        if (nt.senderId === n.senderId) {
          return { ...nt, isRead: true };
        } else {
          return nt;
        }
      });
      setCurrentChat(curChat);
      setNotifications(mNotifications);
    },
    []
  );

  const handleCreateChat = async (user, newUser, userChats) => {
    const members = [user._id, newUser._id];
    let oldChat = userChats.find((chat) => {
      if (chat.members.some((_id) => newUser._id == _id)) return chat;
      // const sortedMembers = chat.members.slice().sort((a, b) => a - b); // Sort the members array
      // return JSON.stringify(sortedMembers) === JSON.stringify(members); // Compare sorted arrays as strings
    });

    if (oldChat) {
      setCurrentChat(oldChat);
      return;
    }

    let obj = {
      url: `${config.baseurl}/chats`,
      method: "POST",
      data: { members },
    };
    let resp = await ServiceRequest(obj);

    if (resp.data.status == _const.SERVICE_FAILURE) {
      console.log("handleCreateChat=>", resp.data);
      return;
    }
    setNewChat({ ...resp?.data?.data, recepientId: newUser._id });
    fetchAllChatsByUser(user?._id);
  };

  const logout = () => {
    setUserChats([]);
    setCurrentChat({});
    setCurrentChatUser({});
    setOnlineUsers([]);
    setIsCurrentChatOnline(false);
    setMessages([]);
    setNewMessage({});
    setNotifications([]);
    setNewChat({});
    if (socket) {
      socket.disconnect();
      setSocket(null);
    }
  };

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
        markAllNotificationsAsRead,
        markNotificationAsRead,
        handleCreateChat,
        logout, // Provide the logout function in the context
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};
