import { Menu } from '@mui/material'
import React from 'react'

const FileMenu = ({anchorE1}) => {
  return (
    <Menu  anchorEl={anchorE1} open={false}>
      <div style={{width:"10rem"}}>
        Lorem ipsum dolor, sit amet consectetur adipisicing elit. Ipsa quidem, aut eaque eos unde cum veritatis repudiandae veniam ut accusantium totam magnam inventore quo reprehenderit, modi magni, voluptatem enim beatae!
      </div>
    </Menu>
  )
}

export default FileMenu