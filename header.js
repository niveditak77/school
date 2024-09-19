import React, { useState } from 'react';
import { AppBar, Toolbar, Typography, Grid, InputBase, Tooltip, Menu, MenuItem, Avatar, Divider } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import { TbUserSquareRounded, TbSwitchHorizontal,TbCoinRupee } from "react-icons/tb";
import { FaWhatsapp ,FaRupeeSign } from "react-icons/fa";
import { RiLogoutCircleRFill } from "react-icons/ri";
import { FcMoneyTransfer, FcCalendar, FcTodoList, FcGlobe,  FcPrivacy, FcManager } from "react-icons/fc";
import Image from 'next/image'; // Correct import for Next.js Image component
import './header.css';

const Header = () => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [langAnchorEl, setLangAnchorEl] = useState(null);
  const [currencyAnchorEl, setCurrencyAnchorEl] = useState(null);

  const handleUserMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
    setLangAnchorEl(null);
    setCurrencyAnchorEl(null);
  };

  const handleLangMenu = (event) => {
    setLangAnchorEl(event.currentTarget);
  };

  const handleCurrencyMenu = (event) => {
    setCurrencyAnchorEl(event.currentTarget);
  };

  return (
    <AppBar position="static" className="appBar">
      <Toolbar>
        <Grid container alignItems="center" justifyContent="space-between">
          <Grid item xs={6} sm={4}>
          <Image
                src="https://edutech.drighna.com/uploads/school_content/admin_logo/1722920976-181276738266b1b01071f3f!Drighna.png?1724241153"
                alt="Logo"
                width={120}
                height={70}
                style={{ marginLeft: '10px' ,}}
              />
          </Grid>
          <Grid item xs={6} sm={6} style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end' }}>
            <div className="search">
              <div className="searchIcon">
                <SearchIcon />
              </div>
              <InputBase
                placeholder="Search By Student Name…"
                classes={{
                  root: 'inputRoot',
                  input: 'inputInput',
                }}
                inputProps={{ 'aria-label': 'search' }}
              />
            </div>
            <div className="NavIcons" style={{ display: 'flex', gap: '20px', marginLeft: '20px' }}>

              <Tooltip title="Currency" placement="bottom">
                <span onClick={handleCurrencyMenu}><FcMoneyTransfer size="1.5em" /></span>
              </Tooltip>
              <Menu
                className="currencyMenu"
                anchorEl={currencyAnchorEl}
                keepMounted
                open={Boolean(currencyAnchorEl)}
                onClose={handleClose}
              >
            <MenuItem onClick={handleClose} style={{ backgroundColor: 'black', color: 'White' }}><FaRupeeSign size= "1.2em"/>INR</MenuItem>

              </Menu>


              <Tooltip title="Language" placement="bottom">
                <span onClick={handleLangMenu}><FcGlobe size="1.4em" /></span>
              </Tooltip>
              <Menu
               className="languageMenu"
               anchorEl={langAnchorEl}
               keepMounted
               open={Boolean(langAnchorEl)}
               onClose={handleClose}
              >
             <MenuItem onClick={handleClose}><img src="https://upload.wikimedia.org/wikipedia/commons/thumb/a/a4/Flag_of_the_United_States.svg/1200px-Flag_of_the_United_States.svg.png?20240524035322" alt="Indian Flag" style={{ width: '22px', height: 'auto' }} />English</MenuItem>
             <MenuItem onClick={handleClose}><img src="https://upload.wikimedia.org/wikipedia/commons/thumb/4/47/Flag_of_Karnataka_%282018_proposed%29.svg/768px-Flag_of_Karnataka_%282018_proposed%29.svg.png?20201212085658" alt="Indian Flag" style={{ width: '22px', height: 'auto' }} />Kannada</MenuItem>
             <MenuItem onClick={handleClose}><img src="https://upload.wikimedia.org/wikipedia/commons/thumb/f/ff/Flag_of_Maharashtra.svg/1200px-Flag_of_Maharashtra.svg.png?20230123145228" alt="Indian Flag" style={{ width: '22px', height: 'auto' }} />Marathi</MenuItem>
             </Menu>

              <Tooltip title="Switch Branch" placement="bottom">
                <span><TbSwitchHorizontal size="1.5em" style={{color:"gray"}}/></span>
              </Tooltip>
              
              
                <Tooltip title="Calendar" placement="bottom">
                  <span><FcCalendar size="1.4em"/></span>
                </Tooltip>
              
      
              <Tooltip title="Tasks" placement="bottom">
                <span><FcTodoList size="1.5em" /></span>
              </Tooltip>  
              <Tooltip title="Chat" placement="bottom">
                <span><FaWhatsapp size="1.4em" style={{ color: "lightgreen" }}/></span>
              </Tooltip>
              <Tooltip title="User" placement="bottom">
                <span onClick={handleUserMenu}><TbUserSquareRounded size="1.5em" style={{color:"gray"}}/></span>  
              </Tooltip>
              <Menu
                anchorEl={anchorEl}
                keepMounted
                open={Boolean(anchorEl)}
                onClose={handleClose}
                className="userMenu"
              >
                <MenuItem onClick={handleClose}>
                  <Avatar className="avatar" /> Super Admin
                </MenuItem>
                <Divider />
                <div className="horizontalMenuItems">
                  <MenuItem onClick={handleClose} style={{ fontSize: '0.9rem', gap: '5px' }}>
                    <FcManager size="1.4em"/>Profile 
                  </MenuItem>
                  <MenuItem onClick={handleClose} style={{ fontSize: '0.85rem', gap: '5px' }}>
                    <FcPrivacy size="1.4em"/>Password
                  </MenuItem>
                  <MenuItem onClick={handleClose} style={{ fontSize: '0.9rem', gap: '5px' }}>
                    <RiLogoutCircleRFill size="1.4em"/>Logout
                  </MenuItem>
                </div>
              </Menu>
            </div>
          </Grid>
        </Grid>
      </Toolbar>
    </AppBar>
  );
};

export default Header;
