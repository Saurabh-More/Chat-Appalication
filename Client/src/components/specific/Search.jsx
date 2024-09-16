import { Dialog, DialogTitle, Stack, TextField } from '@mui/material'
import React from 'react'

const Search = () => {
  return (
    <Dialog open>
      <Stack p={"2rem"} width={"25rem"} direction={"column"}>
        <DialogTitle textAlign={"center"}>Find People</DialogTitle>
        <TextField></TextField>
      </Stack>
    </Dialog>
  )
}

export default Search