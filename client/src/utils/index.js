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
