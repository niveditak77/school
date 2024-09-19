'use client';

import { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Container, Paper, Grid, Button, Typography, Box, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Checkbox, FormControl, InputLabel, Select, MenuItem, Alert, IconButton, TextField
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import { LiaChalkboardTeacherSolid } from "react-icons/lia";
import './assign.css';

const AssignClassTeacher = () => {
  const [classes, setClasses] = useState([]);
  const [sections, setSections] = useState([]);
  const [staff, setStaff] = useState([]);
  const [classId, setClassId] = useState('');
  const [sectionId, setSectionId] = useState('');
  const [teacherId, setTeacherId] = useState('');
  const [classTeachers, setClassTeachers] = useState([]);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isFocused, setIsFocused] = useState(false); 

  useEffect(() => {
    fetchClasses();
    fetchStaff();
    fetchClassTeachers();
  }, []);

  useEffect(() => {
    if (classId) {
      fetchSections(classId);
    }
  }, [classId]);

  const fetchClasses = async () => {
    try {
      const response = await axios.get('/api/academics/classes');
      setClasses(response.data);
    } catch (error) {
      console.error('Error fetching classes:', error);
    }
  };

  const fetchSections = async (classId) => {
    try {
      const response = await axios.get(`/api/academics/sections?classId=${classId}`);
      setSections(response.data);
    } catch (error) {
      console.error('Error fetching sections:', error);
    }
  };

  const fetchStaff = async () => {
    try {
      const response = await axios.get('/api/academics/staff');
      setStaff(response.data);
    } catch (error) {
      console.error('Error fetching staff:', error);
    }
  };

  const fetchClassTeachers = async () => {
    try {
      const response = await axios.get('/api/academics/class_teachers');
      setClassTeachers(response.data);
    } catch (error) {
      console.error('Error fetching class teachers:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!classId || !sectionId || !teacherId) {
      setError('Please select the class, section, and teacher.');
      return;
    }

    try {
      await axios.post('/api/academics/class_teachers', { classId, sectionId, teacherId });
      setSuccess('Class teacher assigned successfully');
      fetchClassTeachers();
      setClassId('');
      setSectionId('');
      setTeacherId('');
    } catch (error) {
      console.error('Error assigning class teacher:', error);
      setError('Error assigning class teacher');
    }
  };

  const handleDelete = async (id) => {
    setError('');
    setSuccess('');

    try {
      await axios.delete('/api/academics/class_teachers', { data: { id } });
      setSuccess('Class teacher deleted successfully');
      fetchClassTeachers();
    } catch (error) {
      console.error('Error deleting class teacher:', error);
      setError('Error deleting class teacher');
    }
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
  const SearchBar = () => {
    const [isFocused, setIsFocused] = useState(false);
  }
  return (
    <Container maxWidth="lg">
    <Box mt={4} mb={4}>
      
      {error && <Alert severity="error">{error}</Alert>}
      {success && <Alert severity="success">{success}</Alert>}
      
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <Paper elevation={3} style={{ padding: '16px', borderRadius: '8px' }}>
          <Typography variant="h5" align="left" marginBottom="20px" fontFamily="Verdana, Geneva, Tahoma, sans-serif" gutterBottom>
        <LiaChalkboardTeacherSolid style={{ marginRight: '7px', marginLeft: '3px', verticalAlign: 'middle', color: 'orange', fontSize: '35px', marginTop: '-7px' }} />
        Assign Class Teacher
      </Typography>
      <form onSubmit={handleSubmit}>
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={4}>
                    <FormControl fullWidth variant="outlined" margin="normal">
                      <InputLabel sx={{
      '&.Mui-focused': {
        color: 'orange', // Change the color to orange when focused
      },
    }}>Class</InputLabel>
                      <Select
                        value={classId}
                        onChange={(e) => setClassId(e.target.value)}
                        label="Class"
                        sx={{ ...noBorderStyle, ...focusedLabelStyle }}
                      >
                        {classes.map((cls) => (
                          <MenuItem key={cls.id} value={cls.id}>{cls.class}</MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Grid>
                  <Grid item xs={12} sm={4}>
                    <FormControl fullWidth variant="outlined" margin="normal">
                      <InputLabel sx={{
      '&.Mui-focused': {
        color: 'orange', // Change the color to orange when focused
      },
    }}>Section</InputLabel>
                      <Select
                        value={sectionId}
                        onChange={(e) => setSectionId(e.target.value)}
                        label="Section"
                        sx={{ ...noBorderStyle, ...focusedLabelStyle }}
                      >
                        {sections.map((sec) => (
                          <MenuItem key={sec.id} value={sec.id}>{sec.section}</MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Grid>
                  <Grid item xs={12} sm={4}>
                    <FormControl fullWidth variant="outlined" margin="normal">
                      <InputLabel sx={{
      '&.Mui-focused': {
        color: 'orange', // Change the color to orange when focused
      },
    }}>Class Teacher</InputLabel>
                      <Select
                        value={teacherId}
                        onChange={(e) => setTeacherId(e.target.value)}
                        label="Class Teacher"
                        sx={{ ...noBorderStyle, ...focusedLabelStyle }}
                      >
                        {staff.map((teacher) => (
                          <MenuItem key={teacher.id} value={teacher.id}>
                            {teacher.name} ({teacher.code})
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Grid>
                  <Grid item xs={12}>
              <Button type="submit" variant="contained" className="assignbtn" color="primary">
                Assign
              </Button>
              </Grid>
                </Grid>
              </form>
            </Paper>
          </Grid>

        <Grid item xs={12}>
        <TextField
      label="Search..."
      variant="outlined"
      className="search-bar"
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
          <TableContainer component={Paper} className='assigncontain'>
            <Table className='assigntable'>
              <TableHead>
                <TableRow>
                  <TableCell>Class</TableCell>
                  <TableCell>Section</TableCell>
                  <TableCell>Class Teacher</TableCell>
                  <TableCell>Action</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {classTeachers.map((ct) => (
                  <TableRow key={ct.id}>
                    <TableCell>{ct.class}</TableCell>
                    <TableCell>{ct.section}</TableCell>
                    <TableCell>{ct.teacher_name} ({ct.teacher_code})</TableCell>
                    <TableCell>
                      <IconButton onClick={() => handleDelete(ct.id)}>
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

export default AssignClassTeacher;
