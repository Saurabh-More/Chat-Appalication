import { useInfiniteScrollTop } from "6pp";
import { AttachFile as AttachFileIcon, Send as SendIcon } from "@mui/icons-material";
import { IconButton, Skeleton, Stack } from '@mui/material';
import React, { useCallback, useRef, useState } from 'react';
import FileMenu from '../components/dialogs/FileMenu';
import AppLayout from '../components/Layout/AppLayout';
import MessageComponent from '../components/shared/MessageComponent';
import { InputBox } from '../components/styles/StyledComponents';
import { grayColor, orange } from '../constants/color';
import { NEW_MESSAGE } from '../constants/events';
import { useErrors, useSocketEvents } from '../hooks/hook';
import { useChatDetailsQuery, useGetMessagesQuery } from '../redux/api/api';
import { getSocket } from '../socket';



function Chat({chatId ,user}) {

  const containerRef= useRef(null);
  const socket = getSocket();
  
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [page,setPage] = useState(1);
  
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

  const newMessagesHandler = useCallback((data) => {setMessages(prev => [...prev,data.message]);},[]);

  const eventHandler = { [NEW_MESSAGE]: newMessagesHandler};
  
  useSocketEvents(socket,eventHandler);
  
  
  const allMessages = [...oldMessages,...messages];
  
  const submitHandler = (e) =>
    {
      e.preventDefault();
      if(!message.trim()) return ;
      
      
      // Emitting the message to the server
      socket.emit(NEW_MESSAGE,{chatId,members,message})
      setMessage("");
    };
    
    
    
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
          allMessages.map((i) => (
            <MessageComponent message={i} user={user} key={i._id}/>
          ))
        }
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
            >
              <AttachFileIcon/>
            </IconButton>

            <InputBox placeholder="Type Message Here..." value={message} onChange={e=>setMessage(e.target.value)}/>

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
        <FileMenu />
    </>
  );
};

export default  AppLayout() (Chat);