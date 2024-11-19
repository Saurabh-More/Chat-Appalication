import { Button, Dialog, DialogTitle, ListItem, Skeleton, Stack, Typography } from '@mui/material'
import React, { memo } from 'react'
import toast from 'react-hot-toast'
import { useDispatch, useSelector } from 'react-redux'
import { useErrors } from '../../hooks/hook'
import { useAcceptFriendRequestMutation, useGetNotificationsQuery } from '../../redux/api/api'
import { setIsNotification } from '../../redux/reducers/misc'
import AvatarCard from '../shared/AvatarCard'

const Notifications = () => {

  const dispatch=useDispatch();
  const { isNotification } = useSelector((state) => state.misc);

  const {isLoading, data, error, isError} = useGetNotificationsQuery();

  const [ acceptRequest ] = useAcceptFriendRequestMutation();

  const friendRequestHandler = async({_id,isAccept}) => 
  {
      dispatch(setIsNotification(false));
      try 
      {
          const res= await acceptRequest({requestId:_id,accept:isAccept});
          if(res.data?.success)
          {
            console.log("Use Socket Here");
            toast.success(res.data?.message);
          }
          else
          {
            toast.error("Something went wrong");
          }
      } 
      catch (error) 
      {
        console.log(error);
      }
  }

  const closeHandler = () => dispatch(setIsNotification(false))

  useErrors([{error, isError}]);

  return (
    <Dialog open={isNotification} onClose={closeHandler}>
        <Stack p={{xs:"1rem" , sm:"2rem"}} maxWidth={"45rem"}>
          <DialogTitle>Notifications</DialogTitle>

          {
            isLoading?<Skeleton /> :(<>
              {data?.allRequest?.length > 0 ? (
              data?.allRequest?.map((notification) => (
                <NotificationsItem 
                  sender={notification.sender} 
                  _id={notification._id} 
                  handler={friendRequestHandler}
                  key={notification._id} 
                />
              ))
            ) : (
              <Typography 
                textAlign={"center"} >0 Notifications
              </Typography>
            )}
          </>
        )}
        </Stack>
    </Dialog>
  )
}


const NotificationsItem = memo(({sender,_id,handler}) => {
  const {name,avatar} = sender;
  return (
    <ListItem>
        <Stack direction={"row"} alignItems={"center"} spacing={"0.5rem"} width={"100%"}>
            <AvatarCard avatar={avatar}/>
            
            <Typography
                variant="body1"
                sx={{
                    flexGrow:1,
                    display:"-webkit-box",
                    WebkitLineClamp:1,
                    WebkitBoxOrient:"vertical",
                    overflow:"hidden",
                    textOverflow:"ellipsis",
                    width:"100%"
                }}
            >
            {`${name} sent you a friend request.`}
            </Typography>

            <Stack direction={{
              xs:"column",
              sm:"row"
            }}
            gap={"1rem"}>
              <Button variant="contained" onClick={() => handler({_id,isAccept:true})}>Accept</Button>
              <Button color="error" onClick={() => handler({_id,isAccept:false})}>Reject</Button>
            </Stack>
        </Stack>
    </ListItem>
  )
})
export default Notifications