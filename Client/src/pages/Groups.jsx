import React, { memo, useState,useEffect, lazy, Suspense } from 'react'
import {Backdrop, Box,Button,Drawer,Grid, IconButton, Menu, Stack, TextField, Tooltip, Typography} from "@mui/material"
import {KeyboardBackspace as KeyboardBackspaceIcon,Menu as MenuIcon,Edit as EditIcon,Done as DoneIcon, Delete as DeleteIcon, Add as AddIcon} from "@mui/icons-material"
import { bgGradient, matBlack } from '../constants/color';
import {useNavigate,useSearchParams} from "react-router-dom";
import {Link} from "../components/styles/StyledComponents";
import AvatarCard from "../components/shared/AvatarCard"
import {samplechats, SampleUsers} from "../constants/sampleData"
import UserItem from '../components/shared/UserItem.jsx';

const ConfirmDeleteDialog = lazy(() => import("../components/dialogs/ConfirmDeleteDialog.jsx"))

const AddMemberDialog = lazy(() => import("../components/dialogs/AddMemberDialog.jsx"))

const isAddMember = false;


function Groups() {

  const chatId = useSearchParams()[0].get("group");
  const navigate = useNavigate();
  const [isMobileMenuOpen,setIsMobileMenuOpen] = useState(false);
  const [isEdit,setIsEdit] = useState(false);
  const [confirmDeleteDialog,setConfirmDeleteDialog] = useState(false);

  const [groupName,setGroupName] = useState("");
  const [groupNameUpdatedValue,setGroupNameUpdatedValue] = useState("");

  const navigateBack = () =>{
      navigate("/");
  };
  const handleMobile = () => {
    setIsMobileMenuOpen((prev) => !prev); 
  };

  const handleMobileClose = () => setIsMobileMenuOpen(false);

  const updateGroupName = () =>{
    setIsEdit(false);
  }

  const openConfirmDeleteHandler = () =>{
    setConfirmDeleteDialog(true);
  }

  const closeConfirmDeleteHandler = () =>{
    setConfirmDeleteDialog(false);
  }

  const openAddMemberHandler = () =>{

  }

  const deleteHandler = () => {
    closeConfirmDeleteHandler();
  }

  const removeMemberHandler = () =>{

  }

  useEffect(() => {
    if(chatId)
    {
      setGroupName(`Group Name ${chatId}`);
      setGroupNameUpdatedValue(`Group Name ${chatId}`);
    }
    return()=>{
      setIsEdit(false);
      setGroupName("");
      setGroupNameUpdatedValue("");
    }
  }, [chatId])
  

  const IconBtns = <>
  <Box sx={{
      display:{
        xs:"block",
        sm:"none",
        position:"fixed",
        right:"1rem",
        top:"1rem"
      }
    }}>
    <IconButton onClick={handleMobile}>
      <MenuIcon/>
    </IconButton>
  </Box>


    <Tooltip title="back">
      <IconButton
        sx={{
          position:"absolute",
          top:"2rem",
          left:"2rem",
          bgcolor:matBlack,
          color:"white",
          ":hover":{
            bgcolor:"rgba(0,0,0,0.7)"
          }
        }}  
        onClick={navigateBack}
      >
        <KeyboardBackspaceIcon/>
      </IconButton>
    </Tooltip>
  </>;

  const GroupName = 
  <Stack direction={"row"} alignItems={"center"} justifyContent={"center"} spacing={"1rem"}padding={"3rem"}>
    {
      isEdit? <>
        <TextField value={groupNameUpdatedValue} onChange={(e) => setGroupNameUpdatedValue(e.target.value)}/>
        <IconButton onClick={updateGroupName}>
          <DoneIcon/>
        </IconButton>
      </> : <>
        <Typography variant='h4'>{groupName}</Typography>
        <IconButton onClick={() => setIsEdit(true)}>
          <EditIcon />
        </IconButton>
      </>
    }
  </Stack>

const ButtonGroup = (
  <Stack 
    direction={{
      sm:"row",
      xs:"column-reverse"
    }}
    spacing={"1rem"}
    p={{
      xs:"0",
      sm:"1rem",
      md:"1rem 4rem"
    }} >
    <Button size="large" color="error" startIcon={<DeleteIcon/>} onClick={openConfirmDeleteHandler}>Delete Group</Button>
    <Button size="large" variant="contained" startIcon={<AddIcon/>} onClick={openAddMemberHandler}>Add Member</Button>
    </Stack>
)
  return (
    <Grid container height={"100vh"}>
      <Grid 
        item 
        sx={{
          display:{
            xs:"none",
            sm:"block"}}} 
        sm={4}
        >
          <GroupsList myGroups={samplechats} chatId={chatId}/>
      </Grid>
      <Grid item xs={12} sm={8} sx={{
        display:"flex",
        flexDirection:"column",
        alignItems:"center",
        position:"relative",
        padding:"1rem 3rem",
      }}>

      {IconBtns}

      {groupName && 
      <>
        {GroupName}

        <Typography margin={"2rem"} alignSelf={"flex-start"} variant="body1">Members </Typography>
        <Stack
          maxWidth={"45rem"}
          width={"100%"}
          boxSizing={"border-box"}
          padding={{
            sm:"1rem",
            xs:"0",
            md:"1rem 4rem"
          }}
          spacing={"2rem"}
          height={"50vh"}
          overflow={"auto"}
        >
        {
          SampleUsers.map((i) =>(
            <UserItem user={i} key={i._id} isAdded styling={{
                boxShadow:"0 0 0.5rem rgba(0,0,0,0.2)",
                padding:"1rem 2rem",
                borderRadius : "1rem"
              }}
              handler={removeMemberHandler}
            />
          ))
        }
        </Stack>
        {ButtonGroup}

      </>}

      </Grid>
      
      {
        isAddMember && <Suspense fallback={<Backdrop open/>}>
          <AddMemberDialog/>
        </Suspense>
      }

      {
        confirmDeleteDialog && ( <Suspense fallback={<Backdrop open/>}>
          <ConfirmDeleteDialog isOpen={confirmDeleteDialog} handleClose={closeConfirmDeleteHandler} deleteHandler={deleteHandler}/>
        </Suspense>
      )}

      <Drawer sx={{
        display:{
          xs:"block",
          sm:"none"
        }
      }} open={isMobileMenuOpen} onClose={handleMobileClose}>
       <GroupsList myGroups={samplechats} chatId={chatId} w={"50vw"}/>
      </Drawer>
    </Grid>
  )
}

const GroupsList = ({w="100%",myGroups=[],chatId}) =>(
  <Stack 
    width={w} 
    overflow={"auto"}
    sx={{ 
      backgroundImage:"linear-gradient(rgb(225 125 109),rgb(249 159 159))",
      height:"100vh"}}
  >
    {
      myGroups.length > 0 ? myGroups.map((group) => <GroupListItem group={group} chatId={chatId} key={group._id}/>) :(
        <Typography textAlign={"center"} padding={"1rem"}>
          No Groups
        </Typography>)
    }
  </Stack>
)

const GroupListItem = memo(({group,chatId}) => {
  const {name,avatar,_id}=group;

  return (
  <Link to={`?group=${_id}`} onClick={e=>{
    if(chatId === _id) e.preventDefault();
  }}>
    <Stack direction={"row"} spacing={"1rem"} alignItems={"center"}>
      <AvatarCard avatar={avatar}/>
      <Typography>{name}</Typography>
    </Stack>
  </Link>
  )
});

export default Groups