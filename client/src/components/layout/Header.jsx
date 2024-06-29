import { AppBar, Box, IconButton, Toolbar, Typography } from "@mui/material";
import React from "react";
import { orange } from "../../constants/color";
import MenuIcon from '@mui/icons-material/Menu';

const Header = () => {
  const handleMobile = () => {};
  return (
    <>
      <Box sx={{ flexFlow: "1" }} height={"4rem"}>
        <AppBar
          position="static"
          sx={{
            bgcolor: orange,
          }}
        >
          <Toolbar>
            <Typography
              variant="h6"
              sx={{ display: { xs: "none", sm: "block" } }}
            >
              TalkWave
            </Typography>
            <Box sx={{ display: { xs: "block", sm: "none" } }}>
              <IconButton color="inherit" onClick={handleMobile}>
                <MenuIcon />
              </IconButton>
            </Box>
            <Box sx={{ flexGrow: "1" }} />
            <Box>
              <IconButton color="inherit" onClick={handleMobile}>
                <MenuIcon />
              </IconButton>
            </Box>
          </Toolbar>
        </AppBar>
      </Box>
    </>
  );
};

export default Header;
