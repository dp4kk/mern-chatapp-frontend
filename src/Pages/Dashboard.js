import React, { useContext, useState, useEffect, useCallback } from "react";
import axios from "axios";
import { AppContext } from "../contexts/DataContext";
import {
  Button,
  IconButton,
  ListItem,
  ListItemIcon,
  ListItemSecondaryAction,
  ListItemText,
  makeStyles,
  Paper,
  TextField,
  ThemeProvider,
  Typography,
} from "@material-ui/core";
import RoomIcon from "@material-ui/icons/Room";
import { useHistory } from "react-router-dom";
import Brightness4Icon from "@material-ui/icons/Brightness4";
const useStyles = makeStyles((theme) => ({
  center: {
    display: "flex",
    alignItems: "center",
    flexDirection: "column",
    marginTop: theme.spacing(3),
    justifyContent: "center",
    listStyleType: "none",
  },
  toppaper: {
    position: "relative",
    width: "600px",
    height: "90px",
  },
  bottompaper: {
    position: "relative",
    width: "600px",
    marginTop: theme.spacing(3),
  },
  centering: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  button: {
    marginLeft: theme.spacing(2),
  },
  heightinput: {
    height: 14,
  },
  list: {
    marginLeft: theme.spacing(2),
  },
  image: {
    backgroundSize: "cover",
    minHeight: "100vh",
  },
  icon:{
  float:'right',
  marginRight:theme.spacing(1)
  }
}));

const Dashboard = () => {
  const history = useHistory();
  const classes = useStyles();
  const [chatrooms, setChatrooms] = useState([]);
  const { user,theme,darkMode,setDarkMode,setChatRoomName } = useContext(AppContext);
  // console.log(user.accessToken)
  const [roomName, setRoomName] = useState("");

  const handleRoomCreate =useCallback(async (e) => {
    e.preventDefault();

    const result = await (
      await fetch("https://mern-socketio-chatapp.herokuapp.com/chatroom", {
        method: "POST",
        credentials: "include",
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${user.accessToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          roomName,
        }),
      })
    ).json();
      setRoomName('')
    console.log(result);
  },[roomName,user.accessToken]);

 
  // console.log(chatrooms)

  useEffect(() => {
       const getChatrooms = () => {
         axios
           .get("https://mern-socketio-chatapp.herokuapp.com/getchatroom", {
             headers: {
               Authorization: "Bearer" + user.accessToken,
             },
           })
           .then((response) => {
             setChatrooms(response.data);
           })
           .catch((err) => {
             setTimeout(getChatrooms, 4000);
           });
       };
    getChatrooms();
  }, [handleRoomCreate,user.accessToken]);


  const handleRoomEntry=(data)=>{
      
      setChatRoomName(data.roomName)
      history.push(`/chatroom/${data._id}`);
  } 

  return (
    <ThemeProvider theme={theme}>
    <Paper className={classes.image}>
    <IconButton className={classes.icon} onClick={()=>setDarkMode(!darkMode)}><Brightness4Icon fontSize='large'/></IconButton>
      <Typography variant="h2" color="textSecondary" align="center">
        Dashboard
      </Typography>
      <div className={classes.center}>
        <Paper elevation={3} className={classes.toppaper}>
          <Typography variant="subtitle1" color="textSecondary">
            *Create a New Room
          </Typography>
          <div className={classes.centering}>
            <form>
              <TextField
                variant="filled"
                label="Enter the room name"
                autoComplete="off"
                size="small"
                value={roomName}
                onChange={(e) => setRoomName(e.target.value)}
                inputProps={{ className: classes.heightinput }}
              />
              <Button
                variant="outlined"
                color="primary"
                size="large"
                onClick={handleRoomCreate}
                className={classes.button}
              >
                Create
              </Button>
            </form>
          </div>
        </Paper>
        <Paper elevation={3} className={classes.bottompaper}>
        <Typography variant="subtitle1" color="textSecondary">
          *Join an Existing Room
        </Typography>
       
        {chatrooms.map((item) => {
          return (
            <ListItem key={item._id} className={classes.list}>
              <ListItemIcon>
                <RoomIcon />
              </ListItemIcon>
              <ListItemText primary={item.roomName} />
              <ListItemSecondaryAction>
                <Button
                  variant="outlined"
                  color="primary"
                  onClick={()=>{handleRoomEntry(item)}}
                >
                  Join
                </Button>
              </ListItemSecondaryAction>
            </ListItem>
          );
        })}
        </Paper>
      </div>
      </Paper>
      </ThemeProvider>
  );
};

export default Dashboard;
