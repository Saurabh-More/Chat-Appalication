import { useInputValidation } from "6pp"
import { Button, Dialog, DialogTitle, Stack, TextField, Typography } from '@mui/material'
import React, { useState } from 'react'
import { SampleUsers } from "../../constants/sampleData.js"
import UserItem from '../shared/UserItem'

const NewGroup = () => {
  
  const groupName=useInputValidation("");
  const [members,setMembers] = useState(SampleUsers);
  const [selectedMembers,setSelectedMembers] = useState([]);


  const selectMemberHandler = (_id) =>
  {
    setSelectedMembers((prev) => prev.includes(_id)? prev.filter((id)=> id!==_id)
    :[...prev,_id]);
  };
  
  const submitHandler = () => {};
  const closeHandler = () =>{};


  return (
    <Dialog open onClose={closeHandler}>
        <Stack p={{xs:"1rem" , sm:"2rem"}} width={"25rem"} spacing={"2rem"}>
          <DialogTitle textAlign={"center"} variant="h4">New Group</DialogTitle>

          <TextField label="Group Name" value={groupName.value} onChange={groupName.changeHandler}/>
          <Typography variant="body1">Members</Typography>

          <Stack>
            {members.map((i) =>(
            <UserItem user={i} key={i._id} handler={selectMemberHandler} isAdded={selectedMembers.includes(i._id)}/> 
          ))}
          </Stack>

          <Stack direction={"row"} justifyContent={"space-evenly"}>
            <Button variant="text"  color="error" size="large" sx={{bgcolor:"rgba(0,0,0,0.3)"}}>Cancel</Button>
            <Button variant="contained" size="large" onClick={submitHandler}>Create</Button>
          </Stack>

        </Stack>
    </Dialog>
  )
}

export default NewGroup