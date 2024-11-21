import { useInfiniteScrollTop } from "6pp";
import { AttachFile as AttachFileIcon, Send as SendIcon } from "@mui/icons-material";
import { IconButton, Skeleton, Stack } from '@mui/material';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import FileMenu from '../components/dialogs/FileMenu';
import AppLayout from '../components/Layout/AppLayout';
import MessageComponent from '../components/shared/MessageComponent';
import { InputBox } from '../components/styles/StyledComponents';
import { grayColor, orange } from '../constants/color';
import { ALERT, NEW_MESSAGE, START_TYPING, STOP_TYPING } from '../constants/events';
import { useErrors, useSocketEvents } from '../hooks/hook';
import { useChatDetailsQuery, useGetMessagesQuery } from '../redux/api/api';
import { getSocket } from '../socket';
import { useDispatch } from "react-redux";
import { setIsFileMenu } from "../redux/reducers/misc";
import { removeNewMessagesAlert } from "../redux/reducers/chat";
import { TypingLoader } from "../components/Layout/Loaders";



function Chat({chatId ,user}) {

  const socket = getSocket();
  const dispatch = useDispatch();

  const containerRef= useRef(null);
  const bottomRef = useRef(null);
  
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [page,setPage] = useState(1);
  const [fileMenuAnchor,setFileMenuAnchor] = useState(null);
  
  const [IamTyping,setIamTyping] = useState(false);
  const [userTyping,setUserTyping] = useState(false);
  const typingTimeout = useRef(null);

  const chatDetails = useChatDetailsQuery({ chatId, skip: !chatId });
  const members = chatDetails?.data?.chat?.members;
  
  // Gives 20 messages on page number is given 
  const oldMessagesChunk = useGetMessagesQuery({ chatId, page});

  const { data:oldMessages,setData : setOldMessage } = 
  useInfiniteScrollTop(
    containerRef,
    oldMessagesChunk?.data?.totalPages,
    page,
    setPage,
    oldMessagesChunk.data?.message
  );


  const errors = [
    { isError:chatDetails.isError,error:chatDetails.error},
    {isError:oldMessagesChunk.isError,error:oldMessagesChunk.error}
  ];
  
  useErrors(errors);

  const messageOnChangeHandler = (e) => 
  {
    setMessage(e.target.value);
    if(!IamTyping)
    {
      socket.emit(START_TYPING,{members,chatId});
      setIamTyping(true);
    }

    if(typingTimeout.current)clearTimeout(typingTimeout.current);

    typingTimeout.current = setTimeout(() => {
      socket.emit(STOP_TYPING,{members,chatId});
      setIamTyping(false);
    },[2000]);
  };

  const handleFileOpen = (e) => {
    dispatch(setIsFileMenu(true));
    setFileMenuAnchor(e.currentTarget);
  };
  
  const submitHandler = (e) =>
  {
      e.preventDefault();
      if(!message.trim()) return ;
      
      
      // Emitting the message to the server
      socket.emit(NEW_MESSAGE,{chatId,members,message})
      setMessage("");
  };
    
  useEffect(() => {

    dispatch(removeNewMessagesAlert(chatId));

    return () => {
      setMessage("");
      setMessages([]);
      setOldMessage([]);
      setPage(1);
    };
  },[chatId]);

  useEffect(() => {
    if(bottomRef.current) 
      bottomRef.current.scrollIntoView({ behavior : "smooth"});
  },[messages]);

  const newMessagesListener = useCallback((data) => {
    if(data.chatId !== chatId) return;
    setMessages(prev => [...prev,data.message]);
  },[chatId]);

  const startTypingListener = useCallback((data) => {
    if(data.chatId !== chatId) return;
    setUserTyping(true);
  },[chatId]);

  const stopTypingListener = useCallback((data) => {
    if(data.chatId !== chatId) return;
    setUserTyping(false);
  },[chatId]);

  const alertListener = useCallback((data) => {
    const messageForAlert = {
      content:data,
      sender:{
          _id:"asdfghjkl",
          name:"Admin",
      },
      chat:chatId,
      createdAt : new Date().toISOString,
    };
    setMessages((prev) => [...prev,messageForAlert]);
  },[chatId]);

  const eventHandler = { 
    [ALERT] : alertListener,
    [NEW_MESSAGE]: newMessagesListener,
    [START_TYPING]: startTypingListener,
    [STOP_TYPING]: stopTypingListener,
  };
  
  useSocketEvents(socket,eventHandler);
  
  
  const allMessages = [...oldMessages,...messages];

    
  return chatDetails.isLoading? ( 
      <Skeleton/>
  ) : (
    <>
        <Stack 
          ref={ containerRef }
          boxSizing={"border-box"}
          padding={"1rem"}
          spacing={"1rem"}
          bgcolor={ grayColor }
          height={"90%"}
          sx={{
            overflowX:"hidden",
            overflowY:"auto"
          }}  
        >
        {
          allMessages.map((i,index) => (
            <MessageComponent message={i} user={user} key={i._id || index}/>
          ))
        }

        {
          userTyping && <TypingLoader/>
        }

        {/* Auto scrolling */}
        <div ref={bottomRef}/>
        </Stack>

        <form 
          style={{height:"10%"}}
          onSubmit={submitHandler}
        >
          <Stack 
            direction={"row"} 
            height={"100%"}
            padding={"1rem"}
            alignItems={"center"}
            position={"relative"}
          >
            <IconButton sx={{
                position:"absolute",
                left:"1.5rem",
                rotate:"30deg"
              }}
              onClick={handleFileOpen}
            >
              <AttachFileIcon/>
            </IconButton>

            <InputBox placeholder="Type Message Here..." value={message} onChange={messageOnChangeHandler}/>

            <IconButton type="submit" sx={{
              backgroundColor:orange,
              color:"white",
              marginLeft:"1rem",
              padding:"0.5rem",
              "&:hover":{
                bgcolor:"error.dark"
              },
            }}>
              <SendIcon/>
            </IconButton>
          </Stack>
        </form>
        <FileMenu anchorE1={fileMenuAnchor} chatId={chatId}/>
    </>
  );
};

export default  AppLayout() (Chat);