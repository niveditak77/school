'use client';

import { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Container, Paper, Grid, TextField, Button, Typography, Box, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, IconButton, Alert
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import { SiGoogleclassroom } from "react-icons/si";
import './section.css';

const Sections = () => {
  const [sections, setSections] = useState([]);
  const [sectionName, setSectionName] = useState('');
  const [editId, setEditId] = useState(null);
  const [search, setSearch] = useState('');
  const [error, setError] = useState('');
  const [isFocused, setIsFocused] = useState(false); 

  const fetchSections = async () => {
    try {
      const response = await axios.get('/api/academics/sections');
      setSections(response.data);
    } catch (error) {
      console.error('Error fetching sections:', error);
    }
  };

  useEffect(() => {
    fetchSections();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      if (editId) {
        await axios.put(`/api/academics/sections`, { id: editId, section: sectionName });
      } else {
        await axios.post('/api/academics/sections', { section: sectionName });
      }
      setSectionName('');
      setEditId(null);
      fetchSections();
    } catch (error) {
      console.error('Error saving section:', error.response?.data);
      setError(`Error saving section: ${error.response?.data.error}`);
    }
  };

  const handleDelete = async (id) => {
    setError('');
    try {
      await axios.delete(`/api/academics/sections`, { params: { id } });
      fetchSections();
    } catch (error) {
      console.error('Error deleting section:', error.response?.data);
      setError(`Error deleting section: ${error.response?.data.error}`);
    }
  };

  const handleEdit = (sec) => {
    setSectionName(sec.section);
    setEditId(sec.id);
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
        <Typography variant="h5" align="left" marginBottom="20px" fontFamily="Verdana, Geneva, Tahoma, sans-serif" gutterBottom>
        <SiGoogleclassroom style={{ marginRight: '7px', marginLeft: '3px', verticalAlign: 'middle', color: 'orange', fontSize: '28px', marginTop: '-7px' }}/>Add Sections
        </Typography>
        {error && <Alert severity="error">{error}</Alert>}
        <Grid container spacing={2}>
          <Grid item xs={12} md={4}>
            <Paper elevation={3} style={{ padding: '16px', borderRadius: '8px' }}>
              <form onSubmit={handleSubmit}>
                <TextField
                  label="Section Name"
                  name="sectionName"
                  value={sectionName}
                  onChange={(e) => setSectionName(e.target.value)}
                  fullWidth
                  required
                  variant="outlined"
                  margin="normal"
                  sx={{ ...noBorderStyle, ...focusedLabelStyle ,marginTop:"2px"}}
                />
                <Button type="submit" fullWidth variant="contained" className="sectionbtn">
                  {editId ? 'Update' : 'Save'}
                </Button>
              </form>
            </Paper>
          </Grid>
          <Grid item xs={12} md={8}>
          <TextField
      label="Search..."
      variant="outlined"
      className="searchsection"
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
            <TableContainer component={Paper} className='sectioncontainer'>
              <Table className='sectiontables'>
                <TableHead>
                  <TableRow>
                    <TableCell>Section Name</TableCell>
                    <TableCell>Action</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {sections.filter(sec => sec.section?.toLowerCase().includes(search.toLowerCase())).map((sec) => (
                    <TableRow key={sec.id}>
                      <TableCell>{sec.section}</TableCell>
                      <TableCell>
                        <IconButton onClick={() => handleEdit(sec)}>
                          <EditIcon />
                        </IconButton>
                        <IconButton onClick={() => handleDelete(sec.id)}>
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

export default Sections;
