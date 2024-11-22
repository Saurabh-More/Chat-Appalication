import React, { useState } from 'react'
import { Button, Dialog, DialogTitle, Skeleton, Stack, Typography } from '@mui/material'
import {SampleUsers} from "../../constants/sampleData.js"
import UserItem from "../shared/UserItem.jsx"
import { useAsyncMutation, useErrors } from '../../hooks/hook.jsx'
import { useAddGroupMembersMutation, useAvailableFriendsQuery } from '../../redux/api/api.js'
import { useDispatch, useSelector } from 'react-redux'
import { setIsAddMember } from '../../redux/reducers/misc.js'

const AddMemberDialog = ({ chatId }) => {

    const dispatch = useDispatch();
  
    const { isAddMember } = useSelector((state) => state.misc);
    const { isLoading, data, isError, error } = useAvailableFriendsQuery(chatId);
    
    const [addMembers,isLoadingAddMembers] = useAsyncMutation(useAddGroupMembersMutation);
    
    const [selectedMembers,setSelectedMembers] = useState([]);
    
    const selectMemberHandler = (_id) =>
      {
      setSelectedMembers((prev) => prev.includes(_id)? prev.filter((id)=> id!==_id)
      :[...prev,_id]);
    };
    
    const closeHandler = () => dispatch(setIsAddMember(false));

    const addMemberSubmitHandler = () => {
      addMembers("Adding Members",{ members:selectedMembers , chatId});
      closeHandler();
    }


    useErrors([{ isError, error }]);

  return <Dialog open={isAddMember} onClose={closeHandler}>
    <Stack p={"2rem"} width={"20rem"} spacing={"2rem"}>
        <DialogTitle textAlign={"center"}>Add Member</DialogTitle>
        <Stack spacing={"1rem"}>
        { isLoading ? (
          <Skeleton/>
        ) : (
          data?.friends?.length > 0 ? (
            data?.friends?.map((i) => (
                <UserItem 
                  key={i._id} 
                  user={i} 
                  handler={selectMemberHandler} 
                  isAdded={selectedMembers.includes(i._id)}
                />
              ))
          ) : ( 
            <Typography textAlign={"center"}>
              No Friends
            </Typography>
          )
        )
        }
        </Stack>
        <Stack direction={"row"} alignItems={"center"} justifyContent={"space-evenly"}>
            <Button color="error" onClick={closeHandler}>Cancel</Button>
            <Button variant="contained" disabled={isLoadingAddMembers}
            onClick={addMemberSubmitHandler}>Submit</Button>
        </Stack>
    </Stack>
  </Dialog>
}

export default AddMemberDialog