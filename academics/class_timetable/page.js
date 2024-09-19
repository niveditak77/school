'use client';

import { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Container, Paper, Grid, TextField, Button, Typography, Box, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, IconButton, Select, MenuItem, FormControl, InputLabel, Alert
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import { BsTable } from "react-icons/bs";
import './timetable.css';

const ClassTimetable = () => {
  const [timetables, setTimetables] = useState([]);
  const [classId, setClassId] = useState('');
  const [sectionId, setSectionId] = useState('');
  const [error, setError] = useState('');
  const [classes, setClasses] = useState([]);
  const [sections, setSections] = useState([]);

  const fetchTimetables = async () => {
    if (!classId || !sectionId) return;
    try {
      const response = await axios.get('/api/academics/class_timetable', { params: { class_id: classId, section_id: sectionId } });
      setTimetables(response.data);
    } catch (error) {
      console.error('Error fetching timetables:', error);
    }
  };

  const fetchClassesAndSections = async () => {
    try {
      const classResponse = await axios.get('/api/academics/classes');
      setClasses(classResponse.data);

      const sectionResponse = await axios.get('/api/academics/sections');
      setSections(sectionResponse.data);
    } catch (error) {
      console.error('Error fetching classes and sections:', error);
    }
  };

  useEffect(() => {
    fetchClassesAndSections();
  }, []);

  useEffect(() => {
    fetchTimetables();
  }, [classId, sectionId]);

  const handleDelete = async (id) => {
    setError('');
    try {
      await axios.delete(`/api/academics/class_timetable`, { params: { id } });
      fetchTimetables();
    } catch (error) {
      console.error('Error deleting timetable entry:', error);
      setError(`Error deleting timetable entry: ${error.response.data.error}`);
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
  return (
    <Container maxWidth="lg">
      <Box mt={4} mb={4}>
        <Typography variant="h5" align="left"  marginBottom="40px" fontFamily="Verdana, Geneva, Tahoma, sans-serif" gutterBottom>
        <BsTable style={{ marginRight: '7px', marginLeft:'3px', verticalAlign: 'middle', color: 'orange', fontSize: '25px', marginTop: '-7px' }} />Class Timetable
        </Typography>
        {error && <Alert severity="error">{error}</Alert>}
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <FormControl fullWidth variant="outlined" style={{ marginBottom: '16px' }}>
              <InputLabel sx={{
      '&.Mui-focused': {
        color: 'orange', // Change the color to orange when focused
      },
    }}>Class</InputLabel>
              <Select
                value={classId}
                onChange={(e) => setClassId(e.target.value)}
                label="Class"
                sx={{ ...noBorderStyle ,
                  ...focusedLabelStyle,}}
              >
                <MenuItem value="">
                  <em>Select</em>
                </MenuItem>
                {classes.map((cls) => (
                  <MenuItem key={cls.id} value={cls.id}>{cls.class}</MenuItem>
                ))}
              </Select>
            </FormControl>
            <FormControl fullWidth variant="outlined" style={{ marginBottom: '16px' }}>
              <InputLabel sx={{
      '&.Mui-focused': {
        color: 'orange', // Change the color to orange when focused
      },
    }}>Section</InputLabel>
              <Select
                value={sectionId}
                onChange={(e) => setSectionId(e.target.value)}
                label="Section"
                sx={{ ...noBorderStyle ,
                  ...focusedLabelStyle,}}
              >
                <MenuItem value="">
                  <em>Select</em>
                </MenuItem>
                {sections.map((sec) => (
                  <MenuItem key={sec.id} value={sec.id}>{sec.section}</MenuItem>
                ))}
              </Select>
              
            </FormControl>
            <Button variant="contained" color="primary" className="my-button" startIcon={<AddIcon />}>Search</Button>
            <TableContainer component={Paper} className="table-container">
              <Table className="table">
                <TableHead>
                  <TableRow>
                    <TableCell>Subject</TableCell>
                    <TableCell>Day</TableCell>
                    <TableCell>Time</TableCell>
                    <TableCell>Room No</TableCell>
                    <TableCell>Action</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {timetables.map((timetable) => (
                    <TableRow key={timetable.id}>
                      <TableCell>{Array.isArray(timetable.subject_group_subject_id) ? timetable.subject_group_subject_id.join(', ') : ''}</TableCell>
                      <TableCell>{timetable.day}</TableCell>
                      <TableCell>{`${timetable.time_from} - ${timetable.time_to}`}</TableCell>
                      <TableCell>{timetable.room_no}</TableCell>
                      <TableCell>
                        <IconButton onClick={() => handleDelete(timetable.id)}>
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

export default ClassTimetable;
