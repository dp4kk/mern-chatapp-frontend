import React, { createContext, useState } from "react";
import { io } from "socket.io-client";
import { createMuiTheme } from "@material-ui/core/styles";
export const AppContext = createContext();

const DataContext = ({ children }) => {
  const [chatRoomName,setChatRoomName]=useState('')
  //theme
  const [darkMode, setDarkMode] = useState(false);

  const theme = createMuiTheme({
    palette: {
      type: darkMode ? "dark" : "light",
    },
  });


  //users
  const [user, setUser] = useState('');

  const [socket, setSocket] = useState(null);

  const setupSocket = () => {
    const token = user.accessToken;
    if (token && !socket) {
      const newSocket = io("https://mern-socketio-chatapp.herokuapp.com", {
        query: {
          token: user.accessToken,
        },
        transports: ["websocket"],
      });

      newSocket.on("disconnect", () => {
        setSocket(null);
        setTimeout(setupSocket, 3000);
        console.log("socket disconnected");
      });

      newSocket.on("connect", () => {
        console.log("success");
      });
      setSocket(newSocket);
    }
  };

 
  const contexts = {
    user,
    setUser,
    setupSocket,
    socket,
    darkMode,
    setDarkMode,
    theme,
    chatRoomName,
    setChatRoomName
  };
  return <AppContext.Provider value={contexts}>{children}</AppContext.Provider>;
};

export default DataContext;
