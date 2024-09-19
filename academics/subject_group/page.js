'use client';

import { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Container, Paper, Grid, TextField, Button, Typography, Box, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Select, MenuItem, FormControl, InputLabel, Alert, IconButton
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import { GiBookshelf } from "react-icons/gi";
import './subgrp.css';

const SubjectGroups = () => {
  const [subjectGroups, setSubjectGroups] = useState([]);
  const [name, setName] = useState('');
  const [sessionId, setSessionId] = useState('');
  const [classId, setClassId] = useState('');
  const [sectionId, setSectionId] = useState('');
  const [subjectIds, setSubjectIds] = useState([]);
  const [error, setError] = useState('');
  const [classes, setClasses] = useState([]);
  const [sections, setSections] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [sessions, setSessions] = useState([]);

  const fetchSubjectGroups = async () => {
    try {
      const response = await axios.get('/api/academics/subject_groups');
      setSubjectGroups(response.data);
    } catch (error) {
      console.error('Error fetching subject groups:', error);
    }
  };

  const fetchClassesSectionsSubjects = async () => {
    try {
      const classResponse = await axios.get('/api/academics/classes');
      setClasses(classResponse.data);
      const sectionResponse = await axios.get('/api/academics/sections');
      setSections(sectionResponse.data);
      const subjectResponse = await axios.get('/api/academics/subjects');
      setSubjects(subjectResponse.data);
      const sessionResponse = await axios.get('/api/sessions');
      setSessions(sessionResponse.data);
    } catch (error) {
      console.error('Error fetching classes, sections, subjects, or sessions:', error);
    }
  };

  useEffect(() => {
    fetchClassesSectionsSubjects();
    fetchSubjectGroups();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!name || !classId || !sectionId || subjectIds.length === 0) {
      setError('All fields are required');
      return;
    }

    try {
      await axios.post('/api/academics/subject_groups', { name, sessionId, classId, sectionId, subjectIds });
      setName('');
      setSessionId('');
      setClassId('');
      setSectionId('');
      setSubjectIds([]);
      fetchSubjectGroups();
    } catch (error) {
      console.error('Error saving subject group:', error);
      setError(`Error saving subject group: ${error.response?.data?.error || error.message}`);
    }
  };

  const handleDelete = async (id) => {
    setError('');
    try {
      await axios.delete(`/api/academics/subject_groups`, { params: { id } });
      fetchSubjectGroups();
    } catch (error) {
      console.error('Error deleting subject group:', error);
      setError(`Error deleting subject group: ${error.response?.data?.error || error.message}`);
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
        <Typography variant="h5" align="left" marginBottom="20px" fontFamily="Verdana, Geneva, Tahoma, sans-serif" gutterBottom>
        <GiBookshelf style={{ marginRight: '1px', marginLeft: '3px', verticalAlign: 'middle', color: 'orange', fontSize: '38px', marginTop: '-7px' }} /> Subject Groups
        
        </Typography>
        {error && <Alert severity="error">{error}</Alert>}
        <Grid container spacing={2}>
          <Grid item xs={12} md={4}>
            <Paper elevation={3} style={{ padding: '16px', borderRadius: '8px' }}>
              <form onSubmit={handleSubmit}>
                <TextField
                  label="Name"
                  name="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  fullWidth
                  required
                  variant="outlined"
                  margin="normal"
                  sx={{ ...noBorderStyle, ...focusedLabelStyle }}
                />
                <FormControl fullWidth variant="outlined" style={{ marginBottom: '16px' }}>
                  <InputLabel sx={{
      '&.Mui-focused': {
        color: 'orange', // Change the color to orange when focused
      },
    }}>Session</InputLabel>
                  <Select
                    value={sessionId}
                    onChange={(e) => setSessionId(e.target.value)}
                    label="Session"
                    sx={{ ...noBorderStyle, ...focusedLabelStyle }}
                  >
                    <MenuItem value="">
                      <em>Select</em>
                    </MenuItem>
                    {sessions.map((session) => (
                      <MenuItem key={session.id} value={session.id}>{session.session}</MenuItem>
                    ))}
                  </Select>
                </FormControl>
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
                    sx={{ ...noBorderStyle, ...focusedLabelStyle }}
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
                    sx={{ ...noBorderStyle, ...focusedLabelStyle }}
                  >
                    <MenuItem value="">
                      <em>Select</em>
                    </MenuItem>
                    {sections.map((sec) => (
                      <MenuItem key={sec.id} value={sec.id}>{sec.section}</MenuItem>
                    ))}
                  </Select>
                </FormControl>
                <FormControl fullWidth variant="outlined" style={{ marginBottom: '16px' }}>
                  <InputLabel sx={{
      '&.Mui-focused': {
        color: 'orange', // Change the color to orange when focused
      },
    }}>Subjects</InputLabel>
                  <Select
                    multiple
                    value={subjectIds}
                    onChange={(e) => setSubjectIds(e.target.value)}
                    label="Subjects"
                    sx={{ ...noBorderStyle, ...focusedLabelStyle }}
                  >
                    {subjects.map((sub) => (
                      <MenuItem key={sub.id} value={sub.id}>{sub.name}</MenuItem>
                    ))}
                  </Select>
                </FormControl>
                <Button type="submit" fullWidth variant="contained"  className="subjectgrpbtn" color="primary">
                  Save
                </Button>
              </form>
            </Paper>
          </Grid>
          <Grid item xs={12} md={8}>
            <TableContainer component={Paper} className='subjectcontain'>
              <Table className='subjecttable'>
                <TableHead>
                  <TableRow>
                    <TableCell>Name</TableCell>
                    <TableCell>Class (Section)</TableCell>
                    <TableCell>Subjects</TableCell>
                    <TableCell>Action</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {subjectGroups.map((group) => (
                    <TableRow key={group.id}>
                      <TableCell>{group.name}</TableCell>
                      <TableCell>{`${group.class_id} (${group.section_id})`}</TableCell>
                      <TableCell>{Array.isArray(group.subject_ids) ? group.subject_ids.join(', ') : ''}</TableCell>
                      <TableCell>
                        <IconButton onClick={() => handleDelete(group.id)}>
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

export default SubjectGroups;
