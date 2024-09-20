import React ,{useRef} from 'react'
import AppLayout from '../components/Layout/AppLayout'
import { IconButton, Stack } from '@mui/material';
import { grayColor, orange } from '../constants/color';
import {AttachFile as AttachFileIcon,Send as SendIcon} from "@mui/icons-material"
import { InputBox } from '../components/styles/StyledComponents';
import FileMenu from '../components/dialogs/FileMenu';
import MessageComponent from '../components/shared/MessageComponent';
import { SampleMessages } from '../constants/sampleData';


const user = {
  _id:"sffrwww",
  name:"Saurabh More",
}


function Chat() {

  const containerRef= useRef(null);

  return (
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
          SampleMessages.map((i) => (
            <MessageComponent message={i} user={user} key={i._id}/>
          ))
        }
        </Stack>

        <form style={{height:"10%"}}>
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

            <InputBox placeholder="Type Message Here..."/>

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