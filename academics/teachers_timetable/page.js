'use client';

import { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Container, Paper, Grid, TextField, Button, Typography, Box, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, IconButton, Select, MenuItem, FormControl, InputLabel, Alert
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import './teacher_tt.css';
import { GiTeacher } from "react-icons/gi";

const TeachersTimetable = () => {
  const [timetables, setTimetables] = useState([]);
  const [teacherId, setTeacherId] = useState('');
  const [error, setError] = useState('');
  const [teachers, setTeachers] = useState([]);

  const fetchTimetables = async () => {
    if (!teacherId) return;
    try {
      const response = await axios.get('/api/academics/teachers_timetable', { params: { teacher_id: teacherId } });
      setTimetables(response.data);
    } catch (error) {
      console.error('Error fetching timetables:', error);
    }
  };

  const fetchTeachers = async () => {
    try {
      const response = await axios.get('/api/academics/teachers');
      setTeachers(response.data);
    } catch (error) {
      console.error('Error fetching teachers:', error);
    }
  };

  useEffect(() => {
    fetchTeachers();
  }, []);

  useEffect(() => {
    fetchTimetables();
  }, [teacherId]);

  const handleDelete = async (id) => {
    setError('');
    try {
      await axios.delete(`/api/academics/teachers_timetable`, { params: { id } });
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
        <GiTeacher  style={{ marginRight: '7px', marginLeft:'3px', verticalAlign: 'middle', color: 'orange', fontSize: '29px', marginTop: '-7px' }}/>Teachers Timetable
        </Typography>
        {error && <Alert severity="error">{error}</Alert>}
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <FormControl fullWidth variant="outlined" style={{ marginBottom: '16px' }}>
              <InputLabel sx={{
      '&.Mui-focused': {
        color: 'orange', // Change the color to orange when focused
      },
    }}>Teacher</InputLabel>
              <Select
                value={teacherId}
                onChange={(e) => setTeacherId(e.target.value)}
                label="Teacher"
                sx={{ ...noBorderStyle ,
                  ...focusedLabelStyle,}}
              >
                <MenuItem value="">
                  <em>Select</em>
                </MenuItem>
                {teachers.map((teacher) => (
                  <MenuItem key={teacher.id} value={teacher.id}>{teacher.name}</MenuItem>
                ))}
              </Select>
            </FormControl>
            <Button variant="contained" color="primary" className="teachtt" onClick={fetchTimetables} startIcon={<AddIcon />}>Search</Button>
            <TableContainer component={Paper} className='teachcontain'>
              <Table className="teachtable">
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

export default TeachersTimetable;
