import React, { memo } from 'react'
import { Avatar, Button, Dialog, DialogTitle, ListItem, Stack, Typography } from '@mui/material'
import { SampleNotifications } from '../../constants/sampleData'

const Notifications = () => {

  const friendRequestHandler = ({_id,isAccept}) =>
  {

  }

  return (
    <Dialog open>
        <Stack p={{xs:"1rem" , sm:"2rem"}} maxWidth={"25rem"}>
          <DialogTitle>Notifications</DialogTitle>

        {
          SampleNotifications.length>0 ? (
            SampleNotifications.map((notification) => (
              <NotificationsItem key={notification._id} sender={notification.sender} _id={notification._id} handler={friendRequestHandler}/>
            ))
          ) :(<Typography textAlign={"center"} >0 Notifications</Typography>)
        }

        </Stack>
    </Dialog>
  )
}


const NotificationsItem = memo(({sender,_id,handler}) => {
  const {name,avatar} = sender;
  return (
    <ListItem>
        <Stack direction={"row"} alignItems={"center"} spacing={"1rem"} width={"100%"}>
            <Avatar/>
            
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
            }}>
              <Button onClick={() => handler({_id,isAccept:true})}>Accept</Button>
              <Button color="error" onClick={() => handler({_id,isAccept:false})}>Reject</Button>
            </Stack>
        </Stack>
    </ListItem>
  )
})
export default Notifications