import React, { useState } from 'react'
import { Button, Dialog, DialogTitle, Stack, Typography } from '@mui/material'
import {SampleUsers} from "../../constants/sampleData.js"
import UserItem from "../shared/UserItem.jsx"

const AddMemberDialog = (addMember,isLoadingAddMember,chatId) => {

    const [members,setMembers] = useState(SampleUsers);
    const [selectedMembers,setSelectedMembers] = useState([]);
  
  
    const selectMemberHandler = (_id) =>
    {
      setSelectedMembers((prev) => prev.includes(_id)? prev.filter((id)=> id!==_id)
      :[...prev,_id]);
    };

    const closeHandler = () => {
        setMembers([]);
        setSelectedMembers([]);
    };
    const addMemberSubmitHandler = () => {
        closeHandler();
    }



  return <Dialog open onClose={closeHandler}>
    <Stack p={"2rem"} width={"20rem"} spacing={"2rem"}>
        <DialogTitle textAlign={"center"}>Add Member</DialogTitle>
        <Stack spacing={"1rem"}>
        { members.length > 0 ? members.map((i) => (
                <UserItem key={i._id} user={i} handler={selectMemberHandler} isAdded={selectedMembers.includes(i._id)}/>
            )):<Typography textAlign={"center"}>No Friends</Typography>
        }
        </Stack>
        <Stack direction={"row"} alignItems={"center"} justifyContent={"space-evenly"}>
            <Button color="error" onClick={closeHandler}>Cancel</Button>
            <Button variant="contained" disabled={isLoadingAddMember}
            onClick={addMemberSubmitHandler}>Submit</Button>
        </Stack>
    </Stack>
  </Dialog>
}

export default AddMemberDialog