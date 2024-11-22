import { useFileHandler, useInputValidation } from "6pp";
import { CameraAlt as CameraAltIcon } from '@mui/icons-material';
import { Avatar, Button, Container, IconButton, Paper, Stack, TextField, Typography } from '@mui/material';
import axios from 'axios';
import React, { useState } from 'react';
import toast from 'react-hot-toast';
import { useDispatch } from 'react-redux';
import { VisuallyHiddenInput } from '../components/styles/StyledComponents.jsx';
import { bgGradient } from '../constants/color.js';
import { server } from '../constants/config.js';
import { userExists } from '../redux/reducers/auth.js';
import { usernameValidator } from "../utils/validators.js";

function Login() {

  const [isLogin,setIsLogin]=useState(true);
  const [isLoading,setIsLoading]= useState(false);

  const toggleLogin=()=> setIsLogin((prev)=> !prev);

  const name=useInputValidation("");
  const username=useInputValidation("",usernameValidator);
  const password=useInputValidation("");
  const boi=useInputValidation("");
  const avatar=useFileHandler("single");

  const dispatch = useDispatch();

  const HandleLogin = async (e)=>
  {
      e.preventDefault();

      const toastId = toast.loading("Logging In...");
      setIsLoading(true);

      const config = {
        withCredentials:true,
        headers : {
          "Content-Type":"application/json"
        },
      };

      try 
      {
        const { data } = await axios.post(
            `${server}/api/v1/user/login`,
            {
              username : username.value,
              password : password.value,
            },
            config,
        );
        dispatch(userExists(data.user));
        toast.success(data.message,{id:toastId});

      } 
      catch (error) 
      {
        toast.error(error?.response?.data?.message || "Something Went Wrong",{id:toastId});
      }
      finally
      {
        setIsLoading(false);
      }
  };

  const HandleSignUp = async (e)=>
  {
    e.preventDefault();

    const toastId = toast.loading("Signing Up...");
    
    setIsLoading(true);

    const formData = new FormData();
    formData.append("avatar",avatar.file);
    formData.append("name",name.value);
    formData.append("bio",boi.value);
    formData.append("username",username.value);
    formData.append("password",password.value);


    const config = {
      withCredentials:true,
      headers : {
        "Content-Type":"multipart/form-data",
      },
    };

    try 
    {
        const { data } = await axios.post(
          `${server}/api/v1/user/new`,
          formData , 
          config
      );  

      dispatch(userExists(true));
      toast.success(data.message,{id:toastId});

    } 
    catch (error) 
    {
        toast.error(error?.response?.data?.message || "Something Went Wrong",{id:toastId});
    }
    finally
    {
      setIsLoading(false);
    }

  };



  return (
  <div 
    style={{backgroundImage:bgGradient}}
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
                  disabled={isLoading}
                  >
                  Login
                </Button>
                <Typography textAlign={"center"} m={"1rem"}>OR</Typography>
                <Button 
                  variant="text"
                  onClick={toggleLogin}
                  fullWidth
                  disabled={isLoading}
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
                  disabled={isLoading}
                  >
                  Sign Up
                </Button>
                <Typography textAlign={"center"} marginTop={"1rem"}>OR</Typography>
                <Button 
                  variant="text"
                  onClick={toggleLogin}
                  fullWidth
                  disabled={isLoading}
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