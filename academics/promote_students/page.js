'use client';

import { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Container, Paper, Grid, Button, Typography, Box, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Checkbox, FormControl, InputLabel, Select, MenuItem, Alert
} from '@mui/material';
import { GiPlayerNext } from "react-icons/gi";
import './promote.css';

const PromoteStudents = () => {
  const [classes, setClasses] = useState([]);
  const [students, setStudents] = useState([]);
  const [fromClassId, setFromClassId] = useState('');
  const [toClassId, setToClassId] = useState('');
  const [selectedStudents, setSelectedStudents] = useState([]);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    fetchClasses();
  }, []);

  useEffect(() => {
    if (fromClassId) {
      fetchStudents(fromClassId);
    }
  }, [fromClassId]);

  const fetchClasses = async () => {
    try {
      const response = await axios.get('/api/academics/classes');
      setClasses(response.data);
    } catch (error) {
      console.error('Error fetching classes:', error);
    }
  };

  const fetchStudents = async (classId) => {
    try {
      const response = await axios.get(`/api/academics/students?classId=${classId}`);
      setStudents(response.data);
    } catch (error) {
      console.error('Error fetching students:', error);
    }
  };

  const handlePromote = async () => {
    setError('');
    setSuccess('');
    if (!fromClassId || !toClassId || selectedStudents.length === 0) {
      setError('Please select the from class, to class, and at least one student.');
      return;
    }

    try {
      await axios.post('/api/academics/promote_students', { fromClassId, toClassId, studentIds: selectedStudents });
      setSuccess('Students promoted successfully');
      setFromClassId('');
      setToClassId('');
      setSelectedStudents([]);
      setStudents([]);
    } catch (error) {
      console.error('Error promoting students:', error);
      setError('Error promoting students');
    }
  };

  const handleSelectStudent = (studentId) => {
    setSelectedStudents((prev) =>
      prev.includes(studentId) ? prev.filter((id) => id !== studentId) : [...prev, studentId]
    );
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
        <Typography variant="h5" align="left"  marginBottom="32px" fontFamily="Verdana, Geneva, Tahoma, sans-serif"  gutterBottom>
        <GiPlayerNext style={{ marginRight: '7px', marginLeft:'3px', verticalAlign: 'middle', color: 'orange', fontSize: '30px', marginTop: '-7px' }}/>Promote Students
        </Typography>
        {error && <Alert severity="error">{error}</Alert>}
        {success && <Alert severity="success">{success}</Alert>}
        <Grid container spacing={2}>
          <Grid item xs={12} md={6}>
            <FormControl fullWidth variant="outlined" margin="normal">
              <InputLabel sx={{
      '&.Mui-focused': {
        color: 'orange', // Change the color to orange when focused
      },
    }}>From Class</InputLabel>
              <Select
                value={fromClassId}
                onChange={(e) => setFromClassId(e.target.value)}
                label="From Class"
                sx={{ ...noBorderStyle ,
                  ...focusedLabelStyle,}}
              >
                {classes.map((cls) => (
                  <MenuItem key={cls.id} value={cls.id}>
                    {cls.class}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} md={6}>
            <FormControl fullWidth variant="outlined" margin="normal">
              <InputLabel sx={{
      '&.Mui-focused': {
        color: 'orange', // Change the color to orange when focused
      },
    }}>To Class</InputLabel>
              <Select
                value={toClassId}
                onChange={(e) => setToClassId(e.target.value)}
                label="To Class"
                sx={{ ...noBorderStyle ,
                  ...focusedLabelStyle,}}
              >
                {classes.map((cls) => (
                  <MenuItem key={cls.id} value={cls.id}>
                    {cls.class}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
        </Grid>
        <TableContainer component={Paper} className="promotecontain" style={{ marginTop: '16px' }}>
          <Table className='promotetable'>
            <TableHead>
              <TableRow>
                <TableCell padding="checkbox">
                  <Checkbox
                    indeterminate={selectedStudents.length > 0 && selectedStudents.length < students.length}
                    checked={students.length > 0 && selectedStudents.length === students.length}
                    onChange={(e) => setSelectedStudents(e.target.checked ? students.map((s) => s.id) : [])}
                  />
                </TableCell>
                <TableCell>Admission No</TableCell>
                <TableCell>Student Name</TableCell>
                <TableCell>Class</TableCell>
                <TableCell>Section</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {students.map((student) => (
                <TableRow key={student.id}>
                  <TableCell padding="checkbox">
                    <Checkbox
                      checked={selectedStudents.includes(student.id)}
                      onChange={() => handleSelectStudent(student.id)}
                    />
                  </TableCell>
                  <TableCell>{student.admission_no}</TableCell>
                  <TableCell>{student.name}</TableCell>
                  <TableCell>{student.class}</TableCell>
                  <TableCell>{student.section}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        <Button
          variant="contained"
          color="primary"
          className='promotebtn'
          onClick={handlePromote}
          style={{ marginTop: '16px' }}
        >
          Promote Students
        </Button>
      </Box>
    </Container>
  );
};

export default PromoteStudents;
