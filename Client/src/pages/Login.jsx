import React,{ useState } from 'react';
import {Avatar, Button, Container, IconButton, Paper, Stack, TextField, Typography} from '@mui/material'
import {CameraAlt as CameraAltIcon} from '@mui/icons-material'
import { VisuallyHiddenInput } from '../components/styles/StyledComponents.jsx';
import {useFileHandler, useInputValidation} from "6pp";
import {usernameValidator} from "../utils/validators.js"

function Login() {

  const [isLogin,setIsLogin]=useState(true);
  const toggleLogin=()=> setIsLogin((prev)=> !prev);

  const name=useInputValidation("");
  const username=useInputValidation("",usernameValidator);
  const password=useInputValidation("");
  const boi=useInputValidation("");
  const avatar=useFileHandler("single");

  const HandleLogin = (e)=>
  {
      e.preventDefault();
  }

  const HandleSignUp = (e)=>
  {
    e.preventDefault();
  }



  return (
  <div 
    style={{backgroundImage:"linear-gradient(rgba(100,200,200,0.5),rgba(120,100,220,0.5))"}}
  >
    <Container 
      component="main" 
      maxWidth="xs"
      
      sx={{
        height:"100vh",
        display:"flex",
        justifyContent:"center",
        alignItems:"center"
      }}

    >
      <Paper 
        elevation={5} 
        sx={{
          padding:4, 
          paddingTop:0 , // Extra added
          display:"flex", 
          flexDirection:"column", 
          alignItems:"center"}}
      >
        {isLogin?(
          <>
              <Typography variant="h5" marginTop={"2.5rem"}>Login</Typography>
              <form style={{
                width:"100%",
                marginTop:"1rem"
              }}
              onSubmit={HandleLogin}
              >
                <TextField 
                  required 
                  fullWidth 
                  label="Username" 
                  margin="normal" 
                  variant='outlined'
                  value={username.value}
                  onChange={username.changeHandler}
                />
                <TextField
                  required 
                  fullWidth 
                  label="Password" 
                  type='password' 
                  margin="normal"
                  variant='outlined'
                  value={password.value}
                  onChange={password.changeHandler}
                />
                <Button 
                  sx={{marginTop:"1rem"}}
                  variant="contained" 
                  color="primary" 
                  type="submit"
                  fullWidth
                  >
                  Login
                </Button>
                <Typography textAlign={"center"} m={"1rem"}>OR</Typography>
                <Button 
                  variant="text"
                  onClick={toggleLogin}
                  fullWidth
                  >
                  Sign up Instead
                </Button>
              </form>
          </>
        ):(
          <>
              <Typography variant='h5' marginTop={"1rem"} marginBottom={"0.5rem"}>Sign Up</Typography>
              <form 
                style={{
                  width:"100%",
                  // marginTop:"1rem"
                }}
                onSubmit={HandleSignUp}
              >

              <Stack position={"relative"} width={"10rem"} margin={"auto"}>
                <Avatar 
                  sx={{
                    width:"9rem",
                    height:"9rem",
                    objectFit:"contain",
                  }}
                  src={avatar.preview}
                />


                <IconButton
                  sx={{
                    position:"absolute",
                    bottom:"0",
                    right:"0.85rem",
                    color:"white",
                    bgcolor:"rgba(0,0,0,0.5)",
                    ":hover":{bgcolor:"rgba(0,0,0,0.7)"}
                    }}
                    component="label"
                >
                  <>
                    <CameraAltIcon/>
                    <VisuallyHiddenInput type="file" onChange={avatar.changeHandler}/>
                  </>
                </IconButton>
              </Stack>

                {avatar.error && (
                  <Typography 
                    m={"1rem auto"} 
                    display={"block"}
                    width={"fit-content"}
                    color="error"
                    variant="caption"
                  >
                    {avatar.error}
                  </Typography>
                )}

                <TextField 
                  required 
                  fullWidth 
                  label="Name" 
                  margin="normal" 
                  variant='outlined'
                  value={name.value}
                  onChange={name.changeHandler}
                />
                <TextField 
                  required 
                  fullWidth 
                  label="Bio" 
                  margin="normal" 
                  variant='outlined'
                  value={boi.value}
                  onChange={boi.changeHandler}
                />
                <TextField 
                  required 
                  fullWidth 
                  label="Username" 
                  margin="normal" 
                  variant='outlined'
                  value={username.value}
                  onChange={username.changeHandler}
                />

                {username.error && (
                  <Typography color="error" variant='caption'>
                    {username.error}
                  </Typography>
                )}

                <TextField
                  required 
                  fullWidth 
                  label="Password" 
                  margin="normal"
                  type='password' 
                  variant='outlined'
                  value={password.value}
                  onChange={password.changeHandler}
                />
                <Button 
                  sx={{marginTop:"1rem"}}
                  variant="contained" 
                  color="primary" 
                  type="submit"
                  fullWidth
                  >
                  Sign Up
                </Button>
                <Typography textAlign={"center"} marginTop={"1rem"}>OR</Typography>
                <Button 
                  variant="text"
                  onClick={toggleLogin}
                  fullWidth
                  >
                  Login Instead
                </Button>
              </form>
          </>
        )}
      </Paper>
    </Container>
  </div>
  );
}

export default Login