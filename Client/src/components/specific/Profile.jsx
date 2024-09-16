import React from 'react'
import { Avatar, Stack, Typography } from '@mui/material'
import {Face as FaceIcon, AlternateEmail as UserNameIcon,CalendarMonth as CalendarIcon} from "@mui/icons-material"
import moment from "moment"

const Profile = () => {
  return (
    <Stack spacing={"2rem"}  direction={"column"} alignItems={"center"}>
        <Avatar sx={{
            width:200,
            height:200,
            objectFit:"contain",
            marginBottom:"1rem",
            border:"5px solid white"
        }}/>
        <ProfileCard heading={"Bio"} text={"jdfhgbzkjnfc"}/>
        <ProfileCard heading={"Username"} text={"sk_1628_33"} Icon={<UserNameIcon/>}/>
        <ProfileCard heading={"Name"} text={"Saurabh  More"} Icon={<FaceIcon/>}/>
        <ProfileCard 
            heading={"joined"} 
            text={moment('2024-04-16T00:00:00.000Z').fromNow()} 
            Icon={<CalendarIcon/>}
        />
    </Stack>
  )
}

const ProfileCard = ({text,Icon,heading}) => (
    <Stack
    direction={"row"}
    alignItems={"center"}
    spacing={"1rem"}
    color={"white"}
    textAlign={"center"}
    >
        {Icon && Icon}
        <Stack>
            <Typography variant={"body1"}>{text}</Typography>
            <Typography variant={"caption"} color={"gray"}>{heading}</Typography>
        </Stack>
    </Stack>
);

export default Profile