const fileFormat = (url="") => {
  const fileExt =url.split(".").pop();
  if(fileExt==="mp4" || fileExt==="webm" || fileExt==="ogg")return "video";
  if(fileExt==="mp3" || fileExt==="wev")return "audio";
  if(fileExt==="png" || fileExt==="jpg" || fileExt==="jpeg" || fileExt==="gif")return "image";
  return "file";
};

const transformImage = (url="",width=100) => 
{
  const newUrl = url.replace("upload/",`upload/dpr_auto/w_${width}/`);
  return  newUrl;
}

const getOrSaveFromLStorage = ({key, value, get}) => 
{
  if(get) 
    return  localStorage.getItem(key) 
      ? JSON.parse(localStorage.getItem(key)) 
      : null;
  else localStorage.setItem(key,JSON.stringify(value));
}

export {fileFormat,transformImage,getOrSaveFromLStorage};