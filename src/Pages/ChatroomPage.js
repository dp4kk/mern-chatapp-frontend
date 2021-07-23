import {IconButton, makeStyles, Paper, TextField, Typography } from '@material-ui/core'
import React, { useContext,useState,useEffect, useRef } from 'react'
import {AppContext} from '../contexts/DataContext'
import SendIcon from "@material-ui/icons/Send";
import base64 from 'base-64'
import { ThemeProvider } from '@material-ui/core/styles'
import Brightness4Icon from "@material-ui/icons/Brightness4";
import PowerSettingsNewIcon from "@material-ui/icons/PowerSettingsNew";
 const useStyles = makeStyles((theme) => ({
   mainpaper: {
     height: "100vh",
   },
   center: {
     display: "flex",
     alignItems: "center",
     justifyContent: "center",
     marginTop: theme.spacing(2),
     flexDirection: "column",
   },
   paper: {
     position: "relative",
     width: "600px",
     height: "600px",
   },
   papertwo: {
     position: "relative",
     width: "600px",
     height: "40px",
   },
   input: {
     height: 5,
     width: 380,
   },
   inputbox: {
     position: "absolute",
     bottom: 0,
     left: 0,
     right: 0,
     paddingLeft: theme.spacing(2),
     paddingBottom: theme.spacing(0.5),
     marginLeft: "auto",
     marginRight: "auto",
   },
   chatbox: {
     overflow: "auto",
     position: "absolute",
     left: 0,
     right: 0,
     top: 0,
     height: "65vh",
     padding: theme.spacing(2),
   },
   ownmessagediv:{
    float:'right',
    clear:'both',
    
   },
   ownmessage: {
     margin: 'auto',
     padding: theme.spacing(1),
     display:'block',
     backgroundColor: "#D6EAF8",
     border: "0.5px solid #778899",
     borderRadius: "15px",
     float: "right",
     overflow:'hidden',
     maxWidth:'50%',
     wordWrap:'break-word',
     
   },
   ownmessagename: {
     float: "right",
     margin: theme.spacing(0.5),
     padding: theme.spacing(1),
     paddingLeft: theme.spacing(0),
   },
   othermessagediv: {
     float: "left",
     clear: "both",
   },
   othermessagename: {
     float: "left",
     margin: theme.spacing(0.5),
     padding: theme.spacing(1),
     paddingRight: theme.spacing(0),
   },
   othermessage: {
     margin: theme.spacing(0.5),
     padding: theme.spacing(1),
     backgroundColor: "#FADBD8",
     border: "0.5px solid #778899",
     borderRadius: "15px",
     display: "inline-block",
     float: "left",
     overflow:'hidden',
     maxWidth:'50%',
     wordWrap:'break-word',
     
   },
   notification: {
     clear: "both",
     float: "left",
     marginTop: theme.spacing(2),
     marginLeft: theme.spacing(22),
   },
   icon: {
     float: "right",
     marginRight: theme.spacing(1),
   },
   title: {
     marginLeft: theme.spacing(15),
   },
   circle: {
     paddingLeft: theme.spacing(1),
     color: "green",
   },
 }));   

const ChatroomPage = ({match}) => {
    const classes=useStyles()
    const {user,socket,theme,darkMode,setDarkMode,chatRoomName}=useContext(AppContext)
    const chatroomId=match.params.id
    const [messageInput,setMessageInput]=useState('')
    const [messages,setMessages]=useState([])
    const [userId,setUserId]=useState('')
      const messageEndRef = useRef(null);

      console.log(chatRoomName)
    const sendMessage=(e)=>{
        e.preventDefault()
        if(socket){
            socket.emit('chatroomMessage',{chatroomId,message:messageInput})
            
        }
        setMessageInput("");
    }
      
    const handleKeyPress=(e)=>{
        if(e.keyCode === 13){
            sendMessage()
        }
    }

    useEffect(()=>{
        const token=user.accessToken
        if(token){
            const payload=JSON.parse(base64.decode(token.split('.')[1]))
            setUserId(payload.userId)
        }
        if(socket){
            socket.on('newMessage',(messageInput)=>{
                const newMessages=[...messages,messageInput]
                setMessages(newMessages)
            })
        }
          
        return()=>{
            if(socket){
            socket.off('newMessage')}
        }}
        //eslint-disable-next-line
    ,[messages])
    
    useEffect(() => {
      if(messageEndRef.current){
          messageEndRef.current.scrollIntoView({behaviour:'smooth'})
      }
     
    }, [messages]);

    useEffect(()=>{
        if(socket){
            socket.emit('joinRoom',{
                chatroomId
            })
        }
        return()=>{
            if(socket){
                socket.emit('leaveRoom',{chatroomId})   
            }
        }
        //eslint-disable-next-line
    },[])

      
    return (
      <React.Fragment>
        <ThemeProvider theme={theme}>
          <Paper className={classes.mainpaper}>
            <IconButton
              className={classes.icon}
              onClick={() => window.location.reload()}
              color="secondary"
            >
              <PowerSettingsNewIcon fontSize="large" />
            </IconButton>
            <IconButton
              className={classes.icon}
              onClick={() => setDarkMode(!darkMode)}
            >
              <Brightness4Icon fontSize="large" />
            </IconButton>

            <Typography
              variant="h2"
              color="textSecondary"
              align="center"
              className={classes.title}
            >
              {chatRoomName.toUpperCase()}
            </Typography>
            <div className={classes.center}>
              <Paper className={classes.paper}>
                <div className={classes.chatbox}>
                  {messages.map((message, i) => (
                    <div key={i}>
                      {message.userId === userId ? (
                        <div className={classes.ownmessagediv}>
                          <Typography
                            className={classes.ownmessagename}
                            variant="subtitle2"
                            color="primary"
                          >
                            :{message.name}
                          </Typography>
                          <Typography variant="subtitle2" color="primary" className={classes.ownmessage}>
                            {message.message}
                          </Typography>
                          <div ref={messageEndRef} />
                        </div>
                      ) : !message.userId ? (
                        <div className={classes.notification}>
                          <Typography variant="subtitle2" color="textSecondary">
                            {message.data}
                          </Typography>
                        </div>
                      ) : (
                        <div className={classes.othermessagediv}>
                          <Typography
                            className={classes.othermessagename}
                            variant="subtitle2"
                            color="secondary"
                          >
                            {message.name}:
                          </Typography>
                          <div className={classes.othermessage}>
                            <Typography variant="subtitle2" color="secondary">
                              {message.message}
                            </Typography>
                            <div ref={messageEndRef} />
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
                <div className={classes.inputbox}>
                  <form>
                    <TextField
                      variant="filled"
                      label="Type your Message"
                      onChange={(e) => setMessageInput(e.target.value)}
                      required
                      value={messageInput}
                      inputProps={{ className: classes.input }}
                      onKeyPress={handleKeyPress}
                    />

                    <IconButton
                      type="submit"
                      onClick={sendMessage}
                      color="primary"
                    >
                      <SendIcon fontSize="small" />
                    </IconButton>
                  </form>
                </div>
              </Paper>
            </div>
          </Paper>
        </ThemeProvider>
      </React.Fragment>
    );
}

export default ChatroomPage

