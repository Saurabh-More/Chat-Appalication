import { useInputValidation } from "6pp"
import { Button, Dialog, DialogTitle, Skeleton, Stack, TextField, Typography } from '@mui/material'
import React, { useState } from 'react'
import { SampleUsers } from "../../constants/sampleData.js"
import UserItem from '../shared/UserItem'
import { useDispatch, useSelector } from "react-redux"
import { useAvailableFriendsQuery, useNewGroupMutation } from "../../redux/api/api.js"
import { useAsyncMutation, useErrors } from "../../hooks/hook.jsx"
import { setIsNewGroup } from "../../redux/reducers/misc.js"
import toast from "react-hot-toast"

const NewGroup = () => {

  const { isNewGroup } = useSelector((state) => state.misc);
  const dispatch = useDispatch();

  const { isError, isLoading, error, data } = useAvailableFriendsQuery();
  
  const [ newGroup, isLoadingNewGroup] = useAsyncMutation(useNewGroupMutation);

  const groupName = useInputValidation('');
  const [selectedMembers,setSelectedMembers] = useState([]);

  const errors =[{ isError, error }];
  useErrors(errors);

  const selectMemberHandler = (_id) =>
  {
    setSelectedMembers((prev) => prev.includes(_id)? prev.filter((id)=> id!==_id)
    :[...prev,_id]);
  };
  
  const closeHandler = () =>dispatch(setIsNewGroup(false));
  
  const submitHandler = () => {
    if(!groupName.value) return toast.error("Group name is required");

    if(selectedMembers.length<2)return toast.error("Please select at least 2 Members");

    newGroup("Creating New Group...",{name:groupName.value , members: selectedMembers})

    closeHandler();
  };

  return (
    <Dialog open={isNewGroup} onClose={closeHandler}>
        <Stack p={{xs:"1rem" , sm:"2rem"}} width={"25rem"} spacing={"2rem"}>
          <DialogTitle textAlign={"center"} variant="h4">New Group</DialogTitle>

          <TextField label="Group Name" value={groupName.value} onChange={groupName.changeHandler}/>
          <Typography variant="body1">Members</Typography>

          <Stack>
            { isLoading ? (
                <Skeleton/>
              ) : ( 
                data?.friends?.map((i) =>(
                <UserItem user={i} key={i._id} handler={selectMemberHandler} isAdded={selectedMembers.includes(i._id)}/> 
                ))
              )
          }
          </Stack>

          <Stack direction={"row"} justifyContent={"space-evenly"}>
            <Button variant="text"  color="error" size="large" sx={{bgcolor:"rgba(0,0,0,0.3)"}} onClick={closeHandler}>Cancel</Button>
            <Button variant="contained" size="large" onClick={submitHandler} disabled={isLoadingNewGroup}>Create</Button>
          </Stack>

        </Stack>
    </Dialog>
  )
}

export default NewGroup