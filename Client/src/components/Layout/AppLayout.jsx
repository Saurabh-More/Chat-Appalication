import { Drawer, Grid, Skeleton } from "@mui/material";
import React, { useCallback, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { NEW_MESSAGE_ALERT, NEW_REQUEST } from "../../constants/events";
import { useErrors, useSocketEvents } from "../../hooks/hook";
import { getOrSaveFromLStorage } from "../../lib/features";
import { useMyChatsQuery } from "../../redux/api/api";
import { incrementNotification, setNewMessagesAlert } from "../../redux/reducers/chat";
import { setIsMobile } from "../../redux/reducers/misc";
import { getSocket } from "../../socket";
import Title from "../shared/Title";
import ChatList from "../specific/ChatList";
import Profile from "../specific/Profile";
import Header from "./Header";

const AppLayout = () => (WrappedComponent) => {
    return (props) => {

        const params = useParams();
        const dispatch = useDispatch();
        const chatId = params.chatId;

        const socket = getSocket();

        const { isMobile } = useSelector((state) => state.misc);
        const { user } = useSelector((state) => state.auth);

        const { newMessagesAlert } = useSelector((state) => state.chat);

        const  { isLoading,data,isError,error } = useMyChatsQuery("");

        useErrors([{ isError , error }]);
        
        
        useEffect(() => {
            getOrSaveFromLStorage({key:NEW_MESSAGE_ALERT,value:newMessagesAlert});
        },[newMessagesAlert]);


        const handleDeleteChat =(e , _id,groupChat) =>{
            e.preventDefault();
            console.log("Delete ChatItem",_id,groupChat);
        }

        const handleMobileClose = () => dispatch(setIsMobile(false));

        const newMessagesAlertHandler = useCallback((data) => {
            if(data.chatId === chatId)return;
            dispatch(setNewMessagesAlert(data));
        },[chatId]);
        
        const newRequestHandler = useCallback(() => {
            dispatch(incrementNotification());
        },[dispatch]);

        const eventHandlers = { 
            [NEW_MESSAGE_ALERT]: newMessagesAlertHandler,
            [NEW_REQUEST]: newRequestHandler,
        };
  
        useSocketEvents(socket,eventHandlers);

        return (
            <>
                <Title />
                <Header />

                {
                    isLoading?(
                        <Skeleton/>
                    ) : (
                        <Drawer open={isMobile} onClose={ handleMobileClose}>
                            <ChatList
                                w="70vw" 
                                chats={data?.chats} 
                                chatId={chatId}
                                handleDeleteChat={handleDeleteChat}
                                newMessagesAlert={newMessagesAlert}
                            />
                        </Drawer>
                    )
                }

                <Grid container height={"calc(100vh - 4rem)"}>
                    <Grid
                        item
                        sm={4}
                        md={3}
                        sx={{
                            display: { xs: "none", sm: "block" },
                        }}
                        height={"100%"}
                    >
                        {isLoading ? (
                            <Skeleton/>
                        ) : (
                           <ChatList 
                                chats={data?.chats} 
                                chatId={chatId}
                                handleDeleteChat={handleDeleteChat}
                                newMessagesAlert={newMessagesAlert}
                            />
                        )}
                    </Grid>
                    <Grid item xs={12} sm={8} md={5} lg={6} height={"100%"}>
                        <WrappedComponent {...props} chatId={chatId} user={user}/>
                    </Grid>
                    <Grid
                        item
                        md={4}
                        lg={3}
                        height={"100%"}
                        sx={{
                            display: { xs: "none", md: "block" },
                            padding: "2rem",
                            bgcolor: "rgba(0,0,0,0.85)",
                        }}
                    >
                        <Profile user={user}/>
                    </Grid>
                </Grid>
            </>
        );
    };
};

export default AppLayout;
