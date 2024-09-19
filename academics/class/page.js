'use client';

import { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Container, Paper, Grid, TextField, Button, Typography, Box, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, IconButton, Alert, Checkbox, FormControlLabel
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import { orange,grey } from '@mui/material/colors';
import './class.css';
import { PiChalkboardTeacherDuotone } from "react-icons/pi";


const Classes = () => {
  const [classes, setClasses] = useState([]);
  const [className, setClassName] = useState('');
  const [sections, setSections] = useState([]);
  const [selectedSections, setSelectedSections] = useState([]);
  const [editId, setEditId] = useState(null);
  const [search, setSearch] = useState('');
  const [error, setError] = useState('');
  const [isFocused, setIsFocused] = useState(false); 

  const fetchClasses = async () => {
    try {
      const response = await axios.get('/api/academics/classes');
      setClasses(response.data);
    } catch (error) {
      console.error('Error fetching classes:', error);
    }
  };

  const fetchSections = async () => {
    try {
      const response = await axios.get('/api/academics/sections');
      setSections(response.data);
    } catch (error) {
      console.error('Error fetching sections:', error);
    }
  };

  useEffect(() => {
    fetchClasses();
    fetchSections();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      if (editId) {
        await axios.put(`/api/academics/classes`, { id: editId, className, sections: selectedSections });
      } else {
        await axios.post('/api/academics/classes', { className, sections: selectedSections });
      }
      setClassName('');
      setSelectedSections([]);
      setEditId(null);
      fetchClasses();
    } catch (error) {
      console.error('Error saving class:', error.response?.data);
      setError(`Error saving class: ${error.response?.data.error}`);
    }
  };

  const handleDelete = async (id) => {
    setError('');
    try {
      await axios.delete(`/api/academics/classes`, { params: { id } });
      fetchClasses();
    } catch (error) {
      console.error('Error deleting class:', error.response?.data);
      setError(`Error deleting class: ${error.response?.data.error}`);
    }
  };

  const handleEdit = (cls) => {
    setClassName(cls.class);
    setSelectedSections(cls.sections.split(', '));
    setEditId(cls.id);
  };

  const handleSectionChange = (event) => {
    const value = event.target.value;
    setSelectedSections((prev) => prev.includes(value) ? prev.filter((section) => section !== value) : [...prev, value]);
  };

  const noBorderStyle = {
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
    }
  };
  const focusedLabelStyle = {
    '& label.Mui-focused': {
      color: 'orange', // Specify the color you want for the focused state
    }
  };

  return (
    <Container maxWidth="lg">
      <Box mt={4} mb={4}>
        <Typography variant="h5" align="left" marginBottom="20px" fontFamily="Verdana, Geneva, Tahoma, sans-serif"  gutterBottom>
        <PiChalkboardTeacherDuotone style={{ marginRight: '4px', marginLeft: '3px', verticalAlign: 'middle', color: 'orange', fontSize: '38px', marginTop: '-7px' }}/>Add Class
        </Typography>
        {error && <Alert severity="error">{error}</Alert>}
        <Grid container spacing={2}>
          <Grid item xs={12} md={4}>
            <Paper elevation={3} style={{ padding: '16px', borderRadius: '8px' }}>
              <form onSubmit={handleSubmit}>
                <TextField
                  label="Class"
                  name="className"
                  value={className}
                  onChange={(e) => setClassName(e.target.value)}
                  fullWidth
                  required
                  variant="outlined"
                  margin="normal"
                  sx={{ ...noBorderStyle, ...focusedLabelStyle ,marginTop:"2px"}}
                />
               <Typography color="grey" fontSize="14.5px" marginLeft="5px">Sections*</Typography>
               <Box sx={{ display: 'flex', flexDirection: 'column',marginLeft:'5PX' }}>
               {sections.map((section) => (
  <FormControlLabel
    key={section.id}
    control={
      <Checkbox
        checked={selectedSections.includes(section.id.toString())}
        onChange={handleSectionChange}
        value={section.id.toString()}
        sx={{
          color: grey[500], // Default color
          '&.Mui-checked': {
            color: orange[700], // Color when checked
          },
        }}
      />
    }
    label={section.section}
  />
))}


</Box>
                <Button type="submit" fullWidth variant="contained" className="classbtn">
                  {editId ? 'Update' : 'Save'}
                </Button>
              </form>
            </Paper>
          </Grid>
          <Grid item xs={12} md={8}>
          <TextField
      label="Search..."
      variant="outlined"
      className="searchclass"
      sx={{ ...noBorderStyle, ...focusedLabelStyle }}
      InputProps={{
        className: 'search-input',
        onFocus: () => setIsFocused(true),  // Handle focus to hide the label
        onBlur: () => setIsFocused(false)  // Handle blur to show the label
      }}
      InputLabelProps={{
        className: isFocused ? 'search-label search-label-hidden' : 'search-label'  // Apply the hiding class conditionally
      }}
    />
            <TableContainer component={Paper} className='classcontainer'>
              <Table className='classtables'>
                <TableHead>
                  <TableRow>
                    <TableCell>Class</TableCell>
                    <TableCell>Sections</TableCell>
                    <TableCell>Action</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {classes.filter(cls => cls.class?.toLowerCase().includes(search.toLowerCase())).map((cls) => (
                    <TableRow key={cls.id}>
                      <TableCell>{cls.class}</TableCell>
                      <TableCell>{cls.sections}</TableCell>
                      <TableCell>
                        <IconButton onClick={() => handleEdit(cls)}>
                          <EditIcon />
                        </IconButton>
                        <IconButton onClick={() => handleDelete(cls.id)}>
                          <DeleteIcon />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Grid>
        </Grid>
      </Box>
    </Container>
  );
};

export default Classes;
