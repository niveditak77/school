'use client';

import { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Container, Paper, Grid, TextField, Button, Typography, Box, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, IconButton, Alert, RadioGroup, FormControlLabel, Radio
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import { PiBooksDuotone } from "react-icons/pi";
import './subjects.css'

const Subjects = () => {
  const [subjects, setSubjects] = useState([]);
  const [name, setName] = useState('');
  const [code, setCode] = useState('');
  const [type, setType] = useState('Theory');
  const [editId, setEditId] = useState(null);
  const [search, setSearch] = useState('');
  const [error, setError] = useState('');
  const [isFocused, setIsFocused] = useState(false); 

  const fetchSubjects = async () => {
    try {
      const response = await axios.get('/api/academics/subjects');
      setSubjects(response.data);
    } catch (error) {
      console.error('Error fetching subjects:', error);
    }
  };

  useEffect(() => {
    fetchSubjects();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      if (editId) {
        await axios.put(`/api/academics/subjects`, { id: editId, name, code, type });
      } else {
        await axios.post('/api/academics/subjects', { name, code, type });
      }
      setName('');
      setCode('');
      setType('Theory');
      setEditId(null);
      fetchSubjects();
    } catch (error) {
      console.error('Error saving subject:', error.response.data);
      setError(`Error saving subject: ${error.response.data.error}`);
    }
  };

  const handleDelete = async (id) => {
    setError('');
    try {
      await axios.delete(`/api/academics/subjects`, { data: { id } });
      fetchSubjects();
    } catch (error) {
      console.error('Error deleting subject:', error.response.data);
      setError(`Error deleting subject: ${error.response.data.error}`);
    }
  };

  const handleEdit = (subj) => {
    setName(subj.name);
    setCode(subj.code);
    setType(subj.type);
    setEditId(subj.id);
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
        <PiBooksDuotone style={{ marginRight: '4px', marginLeft: '3px', verticalAlign: 'middle', color: 'orange', fontSize: '38px', marginTop: '-7px' }}/>Subjects
        </Typography>
        {error && <Alert severity="error">{error}</Alert>}
        <Grid container spacing={2}>
          <Grid item xs={12} md={4}>
            <Paper elevation={3} style={{ padding: '16px', borderRadius: '8px' }}>
              <form onSubmit={handleSubmit}>
                <TextField
                  label="Subject Name"
                  name="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  fullWidth
                  required
                  variant="outlined"
                  margin="normal"
                  sx={{ ...noBorderStyle, ...focusedLabelStyle }}
                />
                <TextField
                  label="Subject Code"
                  name="code"
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  fullWidth
                  required
                  variant="outlined"
                  margin="normal"
                  sx={{ ...noBorderStyle, ...focusedLabelStyle }}
                />
                <RadioGroup
                  row
                  name="type"
                  value={type}
                  onChange={(e) => setType(e.target.value)}
                  style={{ marginTop: '16px', marginBottom: '16px' ,marginLeft:'5px'}}
                >
                  <FormControlLabel value="Theory" control={<Radio sx={{ color: 'grey', '&.Mui-checked': { color: '#FFA500' } }} />} label="Theory" /><br/>
                  <FormControlLabel value="Practical" control={<Radio sx={{ color: 'grey', '&.Mui-checked': { color: '#FFA500' } }}/>} label="Practical" />
                </RadioGroup>
                <Button type="submit" fullWidth variant="contained"className="subjectsbtn" >
                  {editId ? 'Update' : 'Save'}
                </Button>
              </form>
            </Paper>
          </Grid>
          <Grid item xs={12} md={8}>
          <TextField
      label="Search..."
      variant="outlined"
      className="searchsubjects"
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
            <TableContainer component={Paper} className='subjectcontainer'>
              <Table className='subjecttables'>
                <TableHead>
                  <TableRow>
                    <TableCell>Subject</TableCell>
                    <TableCell>Subject Code</TableCell>
                    <TableCell>Subject Type</TableCell>
                    <TableCell>Action</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {subjects.filter(subj => subj.name.toLowerCase().includes(search.toLowerCase())).map((subj) => (
                    <TableRow key={subj.id}>
                      <TableCell>{subj.name}</TableCell>
                      <TableCell>{subj.code}</TableCell>
                      <TableCell>{subj.type}</TableCell>
                      <TableCell>
                        <IconButton onClick={() => handleEdit(subj)}>
                          <EditIcon />
                        </IconButton>
                        <IconButton onClick={() => handleDelete(subj.id)}>
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

export default Subjects;
