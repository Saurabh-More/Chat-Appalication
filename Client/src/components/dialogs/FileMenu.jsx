import { ListItemText, Menu, MenuItem, MenuList, Tooltip } from '@mui/material'
import React, { useRef } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { setIsFileMenu, setUploadingLoader } from '../../redux/reducers/misc';
import { Image as ImageIcon,AudioFile as AudioFileIcon, VideoFile as VideoFileIcon, UploadFile as UploadFileIcon } from "@mui/icons-material";
import toast from 'react-hot-toast';
import { useSendAttachmentsMutation } from '../../redux/api/api';

const FileMenu = ({ anchorE1,chatId }) => {

  const { isFileMenu } = useSelector((state) => state.misc);
  const dispatch =useDispatch();

  const imageRef = useRef(null);
  const audioRef = useRef(null);
  const videoRef = useRef(null);
  const fileRef = useRef(null);

  const [sendAttachments] = useSendAttachmentsMutation();

  const handleCloseFileMenu = () => dispatch(setIsFileMenu(false));

  const selectRef = (ref) => ref.current?.click();


  const fileChangeHandler = async(e,key) => {

    const files = Array.from(e.target.files);
    if(files.length<=0)return ; 
    if(files.length>5) return toast.error(`You can send maximum 5 ${key} at a time`);

    dispatch(setUploadingLoader(true));

    const toastId = toast.loading(`Sending ${key}...`);
    handleCloseFileMenu();

    try 
    {
      // fetching Here
      const myForm  = new FormData();

      myForm.append("chatId", chatId);
      files.forEach((file) => myForm.append("files",file));

      const res= await sendAttachments(myForm);
      
      if(res.data)
      {
        toast.success(`${key} sent successfully`, {id: toastId});
      }
      else
      {
        toast.error(`Failed to send ${key}`, {id: toastId});
      }
      
    } 
    catch (error) 
    {
        toast.error(error,{id:toastId});
    }
    finally
    {
        dispatch(setUploadingLoader(false));
    }

  }


  return (
    <Menu  anchorEl={anchorE1} open={isFileMenu} onClose={handleCloseFileMenu} >
      <div style={{width:"10rem"}} >

        <MenuList>
            <MenuItem onClick={() => selectRef(imageRef)}>
                <Tooltip title={"Image"}>
                    <ImageIcon/>
                </Tooltip>
                <ListItemText style={{ marginLeft:"0.5rem" }}>Image</ListItemText>
                <input 
                  type="file" 
                  multiple 
                  accept="image/png, image/jpeg, image/gif"
                  style={{display:"none"}}
                  onChange={(e) => fileChangeHandler(e,"Images")}
                  ref={imageRef}
                >
                </input>
            </MenuItem>
        
            <MenuItem onClick={() => selectRef(audioRef)}>
                <Tooltip title={"Audio"}>
                    <AudioFileIcon/>
                </Tooltip>
                <ListItemText style={{ marginLeft:"0.5rem" }}>Audio</ListItemText>
                <input 
                  type="file" 
                  multiple 
                  accept="audio/mpej, audio/wav"
                  style={{display:"none"}}
                  onChange={(e) => fileChangeHandler(e,"Audios")}
                  ref={audioRef}
                >
                </input>
            </MenuItem>
        
            <MenuItem onClick={() => selectRef(videoRef)}>
                <Tooltip title={"Video"}>
                    <VideoFileIcon/>
                </Tooltip>
                <ListItemText style={{ marginLeft:"0.5rem" }}>Video</ListItemText>
                <input 
                  type="file" 
                  multiple 
                  accept="video/mp4, video/webm, video/ogg"
                  style={{display:"none"}}
                  onChange={(e) => fileChangeHandler(e,"Videos")}
                  ref={videoRef}
                >
                </input>
            </MenuItem>

            <MenuItem onClick={() => selectRef(fileRef)}>
                <Tooltip title={"File"}>
                    <UploadFileIcon/>
                </Tooltip>
                <ListItemText style={{ marginLeft:"0.5rem" }}>File</ListItemText>
                <input 
                  type="file" 
                  multiple 
                  accept="*"
                  style={{display:"none"}}
                  onChange={(e) => fileChangeHandler(e,"Files")}
                  ref={fileRef}
                >
                </input>
            </MenuItem>
        </MenuList>

      </div>
    </Menu>
  )
}

export default FileMenu;