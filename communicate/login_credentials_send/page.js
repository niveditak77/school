'use client';

import { useState, useEffect } from 'react';
import axios from 'axios';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import {
  Paper, Typography, TextField, Button, Box, MenuItem, Grid
} from '@mui/material';
import { BiSolidSelectMultiple } from "react-icons/bi";
import './logincredit.css';

const LoginCredentialsSend = () => {
  const [classes, setClasses] = useState([]);
  const [sections, setSections] = useState([]);
  const [selectedClass, setSelectedClass] = useState('');
  const [selectedSection, setSelectedSection] = useState('');



  useEffect(() => {
    fetchClasses();
  }, []);

  const fetchClasses = async () => {
    try {
      const response = await axios.get('/api/classes');
      setClasses(response.data);
    } catch (error) {
      console.error('Error fetching classes:', error);
    }
  };

  const fetchSections = async (classId) => {
    try {
      const response = await axios.get(`/api/sections?classId=${classId}`);
      setSections(response.data);
    } catch (error) {
      console.error('Error fetching sections:', error);
    }
  };

  const handleClassChange = (event) => {
    const classId = event.target.value;
    setSelectedClass(classId);
    setSelectedSection('');
    fetchSections(classId);
  };

  const handleSectionChange = (event) => {
    setSelectedSection(event.target.value);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    // Add your form submission logic here
    console.log('Class:', selectedClass, 'Section:', selectedSection);
  };

  return (
    <Box style={{ padding: '20px' }}>
      <Typography variant="h5" align="left" marginBottom="20px" fontFamily="Verdana, Geneva, Tahoma, sans-serif" gutterBottom>
        <BiSolidSelectMultiple style={{ marginRight: '2px', verticalAlign: 'middle', color: 'orange', fontSize: '28px', marginTop: '-7px' }} /> Select Criteria
      </Typography>
      <Paper style={{ padding: '20px', marginTop: '20px' }}>
        <form onSubmit={handleSubmit}>
          <Grid container spacing={2}>
            <Grid item xs={6}>
              <TextField
                select
                label="Class"
                value={selectedClass}
                onChange={handleClassChange}
                fullWidth
                required
                variant="outlined"
                margin="normal"
                sx={{
                  backgroundColor: '#f0f0f0',
                  borderRadius: '20px',
                  border: 'none',
                  '& .MuiOutlinedInput-notchedOutline': {
                    border: 'none'
                  },
                  '&:hover .MuiOutlinedInput-notchedOutline': {
                    border: 'none'
                  },
                  '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                    border: 'none',
                    boxShadow: 'none'
                  },
                  '& label.Mui-focused': {
                    color: 'orange',
                  },
                  marginTop: '10px',
                }}
              >
                {classes.map((cls) => (
                  <MenuItem key={cls.id} value={cls.id}>
                    {cls.class}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
            <Grid item xs={6}>
              <TextField
                select
                label="Section"
                value={selectedSection}
                onChange={handleSectionChange}
                fullWidth
                required
                variant="outlined"
                margin="normal"
                sx={{
                  backgroundColor: '#f0f0f0',
                  borderRadius: '20px',
                  border: 'none',
                  '& .MuiOutlinedInput-notchedOutline': {
                    border: 'none'
                  },
                  '&:hover .MuiOutlinedInput-notchedOutline': {
                    border: 'none'
                  },
                  '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                    border: 'none',
                    boxShadow: 'none'
                  },
                  '& label.Mui-focused': {
                    color: 'orange',
                  },
                  marginTop: '10px',
                }}
              >
                {sections.map((sec) => (
                  <MenuItem key={sec.id} value={sec.id}>
                    {sec.section}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
            <Grid item xs={12}>
            <Button type="submit" fullWidth variant="contained" className='logincreditbtn' size="large">
  Search
</Button>

            </Grid>
          </Grid>
        </form>
      </Paper>
    </Box>
  );
};

export default LoginCredentialsSend;
