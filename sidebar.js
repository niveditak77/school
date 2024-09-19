'use client';

import { useEffect, useState } from 'react';
import {
  List, ListItem, ListItemText, ListItemIcon, Collapse, Typography, Box, Modal, Grid, Paper
} from '@mui/material';
import { ExpandLess, ExpandMore } from '@mui/icons-material';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { library } from '@fortawesome/fontawesome-svg-core';
import { fas } from '@fortawesome/free-solid-svg-icons';
import { fab } from '@fortawesome/free-brands-svg-icons';
import ArrowRightIcon from '@mui/icons-material/ArrowRight';
import Link from 'next/link';
import { useTheme } from '../../context/ThemeContext';
import { ClipLoader } from 'react-spinners'; // Import a spinner component

library.add(fas, fab);

const Sidebar = () => {
  const { theme } = useTheme();
  const [data, setData] = useState([]);
  const [open, setOpen] = useState({});
  const [lang, setLang] = useState({});
  const [openQuickLinks, setOpenQuickLinks] = useState(false);
  const [loading, setLoading] = useState(true); // State for loading indicator

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true); // Start loading
      try {
        const response = await fetch('/api/getSidebarMenus');
        const result = await response.json();

        if (Array.isArray(result)) {
          setData(result);

          const initialOpenState = result.reduce((acc, menu) => {
            acc[menu.id] = false;
            return acc;
          }, {});
          setOpen(initialOpenState);
        } else {
          console.error('API response is not an array:', result);
        }
      } catch (error) {
        console.error('Error fetching sidebar menus:', error);
      }
      setLoading(false); // Stop loading
    };

    const fetchLang = async () => {
      try {
        const langResponse = await fetch('/lang/lang_en.json');
        const langJson = await langResponse.json();
        setLang(langJson);
      } catch (error) {
        console.error('Error fetching language strings:', error);
      }
    };

    fetchData();
    fetchLang();
  }, []);

  const handleClick = (id) => {
    setOpen((prevOpen) => {
      const newOpenState = Object.keys(prevOpen).reduce((acc, key) => {
        acc[key] = false; // Close all menus
        return acc;
      }, {});
      return { ...newOpenState, [id]: !prevOpen[id] }; // Open the clicked menu
    });
  };

  const handleOpenQuickLinks = () => {
    setOpenQuickLinks(true);
  };

  const handleCloseQuickLinks = () => {
    setOpenQuickLinks(false);
  };

  const handleLinkClick = () => {
    handleCloseQuickLinks(); // Close modal when any link is clicked
  };

  const menuRouteMap = {
    'Human Resource': 'human_resource/',
    'Communicate': 'communicate/',
    'Front Office': 'front_office/',
    'Income': 'income/',
    'Expense': 'expense/',
    'Student Information': 'student_information/',
    'Online Examinations': 'online_examinations/',
    'Academics': 'academics/',
    'Homework': 'homework/',
    'Hostel': 'hostel/',
    'Download Center': 'download_center/',
    'Library': 'library/',
    'Alumni': 'alumni/',
    'Fees Collection': 'fees_collection/',
    'Online Course': 'online_course/',
    'Transport': 'transport/',
    'Behaviour Records': 'behaviour_records/',
    'Gmeet Live Classes': 'gmeet_live_classes/',
    'System Settings': 'system_settings/',
    'Attendance': 'attendance/',
    'Multi Branch': 'multi_branch/',
    'CBSE Examination': 'cbse_exam/',
    'Lesson Plan': 'lesson_plan/',
    'Inventory': 'inventory/',
    'Front CMS': 'front_cms/',
    'Examinations': 'examinations/',
    'Zoom Live Classes': 'zoom_live_classes/',
    'Reports': 'reports/',
    'Certificate': 'certificate/'
  };

  const formatMenuText = (text) => {
    return text.replace(/_/g, ' ').replace(/\b\w/g, char => char.toUpperCase());
  };
  
  const extractIconName = (iconClass) => {
    const iconName = iconClass.split(' ').find((cls) => cls.startsWith('fa-'));
    return iconName ? iconName.replace('fa-', '') : null;
  };
  
  return (
    <Box>
      {/* Sidebar with Quick Links */}
      <List
        sx={{
          backgroundColor: theme.sidebar,
          color: theme.sidebarText,
          width: {
            xs: '100%', // 100% width on extra small screens
            sm: '240px', // Fixed width on small and larger screens
          },
          maxWidth: '235px',
          height: 'calc(100vh - 60px)', // Full viewport height minus header
          overflowY: 'auto', // Scroll if the content is too long
          transition: 'width 0.3s ease', // Smooth transition for responsiveness
          position: 'fixed', // Sidebar is fixed on the side
          top: '60px', // Starts below the header
          left: 0,
          zIndex: 1000, // Ensure sidebar is above other content
        }}
      >
        {/* Loading Indicator */}
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
            <ClipLoader color={theme.sidebarText} size={30} />
          </Box>
        ) : (
          <>
            {/* Quick Links at the top */}
            <ListItem button onClick={handleOpenQuickLinks}>
              <ListItemIcon>
                <FontAwesomeIcon icon={['fas', 'th']} style={{ color: theme.sidebarText }} />
              </ListItemIcon>
              <ListItemText
                primary={
                  <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
                    Quick Links
                  </Typography>
                }
              />
            </ListItem>
  
            {/* Sidebar Menu Items */}
            {data.map((menu) => (
              <div key={menu.id}>
                <ListItem button onClick={() => handleClick(menu.id)}>
                  <ListItemIcon>
                    <FontAwesomeIcon icon={['fas', extractIconName(menu.icon)]} style={{ color: theme.sidebarText }} />
                  </ListItemIcon>
                  <ListItemText
                    primary={
                      <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
                        {lang[menu.menu.toLowerCase().replace(/ /g, '_')] || formatMenuText(menu.menu)}
                      </Typography>
                    }
                  />
                  {open[menu.id] ? <ExpandLess /> : <ExpandMore />}
                </ListItem>
                <Collapse in={open[menu.id]} timeout="auto" unmountOnExit>
                  <List component="div" disablePadding>
                    {menu.subMenus.map((subMenu) => {
                      const route = menuRouteMap[menu.menu] || '';
                      const href = `/dashboard/${route}${subMenu.menu.toLowerCase().replace(/ /g, '_')}`;
                      return (
                        <Link href={href} key={subMenu.id} passHref onClick={handleLinkClick}>
                          <ListItem button sx={{ pl: 5 }}>
                            <ListItemIcon>
                              <ArrowRightIcon style={{ color: theme.sidebarText }} />
                            </ListItemIcon>
                            <ListItemText
                              primary={
                                <Typography variant="body2" sx={{ color: theme.sidebarText }}>
                                  {lang[subMenu.menu.toLowerCase().replace(/ /g, '_')] || formatMenuText(subMenu.menu)}
                                </Typography>
                              }
                            />
                          </ListItem>
                        </Link>
                      );
                    })}
                  </List>
                </Collapse>
              </div>
            ))}
          </>
        )}
      </List>
  
      {/* Quick Links Modal */}
      <Modal
        open={openQuickLinks}
        onClose={handleCloseQuickLinks}
        sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'center', mt: '80px' }}
      >
        <Paper sx={{
          width: '70%',
          maxHeight: '70vh',
          overflowY: 'auto',
          padding: 2,
          backgroundColor: theme.background, // Use theme for modal background
          color: theme.text // Use theme for modal text color
        }}>
          <Typography variant="h6" gutterBottom>
            Quick Links
          </Typography>
          <Grid container spacing={2} sx={{ position: 'relative' }}>
            {data.map((menu, index) => (
              <Grid
                item
                xs={6}
                sm={3}
                key={menu.id}
                sx={{
                  borderRight: index !== data.length - 1 ? `1px solid ${theme.sidebarText}` : 'none',
                  pr: 2,
                }}
              >
                <Typography variant="subtitle2" sx={{ fontWeight: 'bold', color: theme.text }}>
                  {formatMenuText(menu.menu)}
                </Typography>
                {menu.subMenus.map((subMenu) => (
                  <Link
                    href={`/dashboard/${menuRouteMap[menu.menu] || ''}${subMenu.menu.toLowerCase().replace(/ /g, '_')}`}
                    key={subMenu.id}
                    passHref
                    onClick={handleLinkClick}
                  >
                    <Typography
                      variant="body2"
                      sx={{ cursor: 'pointer', color: theme.sidebarText, textDecoration: 'none' }}
                    >
                      {formatMenuText(subMenu.menu)}
                    </Typography>
                  </Link>
                ))}
              </Grid>
            ))}
          </Grid>
        </Paper>
      </Modal>
    </Box>
    );
  };
  
  export default Sidebar;