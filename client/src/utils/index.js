import moment from "moment";
import "moment/locale/en-au"; // Import locale if needed

export const getRandomColor = () => {
  const colors = [
    "#ff5722",
    "#673ab7",
    "#2196f3",
    "#4caf50",
    "#ff9800",
    "#e91e63",
    "#9c27b0",
    "#03a9f4",
    "#8bc34a",
    "#ffc107",
    "#f44336",
    "#3f51b5",
    "#00bcd4",
    "#cddc39",
    "#ffeb3b",
    "#9e9e9e",
    "#607d8b",
    "#795548",
    "#9e9e9e",
    "#607d8b",
    "#795548",
    "#9e9e9e",
    "#607d8b",
    "#795548",
    "#9e9e9e",
    "#607d8b",
    "#795548",
    "#9e9e9e",
    "#607d8b",
    "#795548",
    "#9e9e9e",
    "#607d8b",
    "#795548",
    "#9e9e9e",
    "#607d8b",
    "#795548",
    "#9e9e9e",
    "#607d8b",
    "#795548",
    "#9e9e9e",
    "#607d8b",
    "#795548",
    "#9e9e9e",
    "#607d8b",
    "#795548",
    "#9e9e9e",
    "#607d8b",
    "#795548",
  ];

  return colors[Math.floor(Math.random() * colors.length)];
};

export const getUserById = (_id, data) => {
  return data?.find((item) => {
    return item._id == _id;
  });
};

export const getUserIdFromMembers = (user_id, members) => {
  if (members[0] == user_id) {
    return members[1];
  }
  return members[0];
};

export const getUserFromChat = (user_id, members, users) => {
  return getUserById(getUserIdFromMembers(user_id, members), users);
};

export const getFormattedTime = (date) => {
  const createdAt = moment(date);
  let formattedTime = createdAt.format("h:mm A");

  // Check if created today
  if (moment().isSame(createdAt, "day")) {
    formattedTime = "Today, " + formattedTime;
  } else if (moment().subtract(1, "day").isSame(createdAt, "day")) {
    // Check if created yesterday
    formattedTime = "Yesterday, " + formattedTime.toLowerCase();
  } else if (moment().subtract(7, "days").isBefore(createdAt)) {
    // Check if created within the last week
    formattedTime = createdAt.format("dddd, ") + formattedTime;
  } else if (moment().subtract(1, "month").isBefore(createdAt)) {
    // Check if created within the last month
    formattedTime = createdAt.format("MMM D, ") + formattedTime;
  } else {
    // For older messages, display date
    formattedTime = createdAt.format("MMM D, YYYY") + ", " + formattedTime;
  }
  return formattedTime.toLowerCase();
};

export const getFormattedTimeForMessages = (date) => {
  const createdAt = moment(date);
  let formattedTime = createdAt.format("h:mm A");

  // Check if created today
  if (moment().isSame(createdAt, "day")) {
    formattedTime = "Today& " + formattedTime;
  } else if (moment().subtract(1, "day").isSame(createdAt, "day")) {
    // Check if created yesterday
    formattedTime = "Yesterday& " + formattedTime.toLowerCase();
  } else if (moment().subtract(7, "days").isBefore(createdAt)) {
    // Check if created within the last week
    formattedTime = createdAt.format("dddd& ") + formattedTime;
  } else if (moment().subtract(1, "month").isBefore(createdAt)) {
    // Check if created within the last month
    formattedTime = createdAt.format("MMM D& ") + formattedTime;
  } else {
    // For older messages, display date
    formattedTime = createdAt.format("MMM D, YYYY") + "& " + formattedTime;
  }
  return formattedTime.toLowerCase();
};

export const getFormattedTimeForUserChats = (date) => {
  const createdAt = moment(date);
  let formattedTime = createdAt.format("h:mm A");

  // Check if created today
  if (moment().isSame(createdAt, "day")) {
    formattedTime = formattedTime; // same day
  } else if (moment().subtract(1, "day").isSame(createdAt, "day")) {
    // Check if created yesterday
    formattedTime = "Yesterday"; //yesterday
  } else if (moment().subtract(7, "days").isBefore(createdAt)) {
    // Check if created within the last week
    formattedTime = createdAt.format("dddd");
  } else if (moment().subtract(1, "month").isBefore(createdAt)) {
    // Check if created within the last month
    formattedTime = createdAt.format("MMM D");
    // For older messages, display date
    formattedTime = createdAt.format("MMM D, YYYY");
  }
  return formattedTime;
};

export const checkIsUserOnline = (userId, users = []) => {
  return users.some((user) => user.userId === userId);
};

export const unreadNotificationsFunc = (notifications) => {
  return notifications.filter((notfication) => notfication.isRead === false);
};
