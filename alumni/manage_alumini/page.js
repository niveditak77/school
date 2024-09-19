'use client';

import { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Container, Paper, Grid, TextField, Button, Typography, Box, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Select, MenuItem, FormControl, InputLabel, Alert
} from '@mui/material';
import IconButton from '@mui/material/IconButton';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import { FaChildReaching } from "react-icons/fa6";
import './alumni.css';

const ManageAlumni = () => {
  const [alumniEvents, setAlumniEvents] = useState([]);
  const [title, setTitle] = useState('');
  const [eventFor, setEventFor] = useState('');
  const [sessionId, setSessionId] = useState('');
  const [classId, setClassId] = useState('');
  const [section, setSection] = useState('');
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');
  const [note, setNote] = useState('');
  const [photo, setPhoto] = useState('');
  const [isActive, setIsActive] = useState('');
  const [eventNotificationMessage, setEventNotificationMessage] = useState('');
  const [showOnWebsite, setShowOnWebsite] = useState('');
  const [error, setError] = useState('');
  const [classes, setClasses] = useState([]);
  const [sessions, setSessions] = useState([]);

  useEffect(() => {
    fetchAlumniEvents();
    fetchClassesAndSessions();
  }, []);

  const fetchAlumniEvents = async () => {
    try {
      const response = await axios.get('/api/alumni/manage_alumni');
      setAlumniEvents(response.data);
    } catch (error) {
      console.error('Error fetching alumni events:', error);
    }
  };

  const fetchClassesAndSessions = async () => {
    try {
      const classResponse = await axios.get('/api/academics/classes');
      setClasses(classResponse.data);

      const sessionResponse = await axios.get('/api/academics/sessions');
      setSessions(sessionResponse.data);
    } catch (error) {
      console.error('Error fetching classes and sessions:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!title || !eventFor || !sessionId || !classId || !section || !fromDate || !toDate || !note || !eventNotificationMessage) {
      setError('All fields are required');
      return;
    }

    try {
      await axios.post('/api/alumni/manage_alumni', {
        title,
        event_for: eventFor,
        session_id: sessionId,
        class_id: classId,
        section,
        from_date: fromDate,
        to_date: toDate,
        note,
        photo,
        is_active: isActive,
        event_notification_message: eventNotificationMessage,
        show_onwebsite: showOnWebsite
      });

      setTitle('');
      setEventFor('');
      setSessionId('');
      setClassId('');
      setSection('');
      setFromDate('');
      setToDate('');
      setNote('');
      setPhoto('');
      setIsActive('');
      setEventNotificationMessage('');
      setShowOnWebsite('');
      fetchAlumniEvents();
    } catch (error) {
      console.error('Error saving alumni event:', error);
      setError('Error saving alumni event');
    }
  };

  const handleDelete = async (id) => {
    setError('');
    try {
      await axios.delete(`/api/alumni/manage_alumni`, { params: { id } });
      fetchAlumniEvents();
    } catch (error) {
      console.error('Error deleting alumni event:', error);
      setError(`Error deleting alumni event: ${error.response?.data?.error || error.message}`);
    }
  };

  const focusedLabelStyle = {
    '& label.Mui-focused': {
      color: 'orange',
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

  return (
    <Container maxWidth="lg">
      <Box mt={4} mb={4}>
      
        {error && <Alert severity="error">{error}</Alert>}
        <Grid container spacing={2}>
          <Grid item xs={12} md={12}>
            <Paper elevation={3} style={{ padding: '16px', borderRadius: '8px' }}>
            <Typography variant="h5" align="left" marginBottom="30px" fontFamily="Verdana, Geneva, Tahoma, sans-serif" gutterBottom>
                <FaChildReaching style={{ marginRight: '7px', verticalAlign: 'middle', color: 'orange', fontSize: '30px', marginTop: '-10px' }} />
               Manage Alumni Events
              </Typography>
              <form onSubmit={handleSubmit}>
                <TextField
                  label="Title"
                  name="title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  fullWidth
                  required
                  variant="outlined"
                  margin="dense"
                  sx={{ ...noBorderStyle, ...focusedLabelStyle }}
                />
                <FormControl fullWidth variant="outlined" margin="dense">
                  <InputLabel sx={{ '&.Mui-focused': { color: 'orange' } }}>Event For</InputLabel>
                  <Select
                    value={eventFor}
                    onChange={(e) => setEventFor(e.target.value)}
                    label="Event For"
                    sx={{ ...noBorderStyle, ...focusedLabelStyle }}
                  >
                    <MenuItem value="">
                      <em>Select</em>
                    </MenuItem>
                    <MenuItem value="students">Students</MenuItem>
                    <MenuItem value="teachers">Teachers</MenuItem>
                  </Select>
                </FormControl>
                <Grid container spacing={2}>
                  <Grid item xs={12} md={4}>
                    <FormControl fullWidth variant="outlined" margin="dense">
                      <InputLabel sx={{ '&.Mui-focused': { color: 'orange' } }}>Session</InputLabel>
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
                  </Grid>
                  <Grid item xs={12} md={4}>
                    <FormControl fullWidth variant="outlined" margin="dense">
                      <InputLabel sx={{ '&.Mui-focused': { color: 'orange' } }}>Class</InputLabel>
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
                  </Grid>
                  <Grid item xs={12} md={4}>
                    <TextField
                      label="Section"
                      name="section"
                      value={section}
                      onChange={(e) => setSection(e.target.value)}
                      fullWidth
                      required
                      variant="outlined"
                      margin="dense"
                      sx={{ ...noBorderStyle, ...focusedLabelStyle }}
                    />
                  </Grid>
                </Grid>
                <Grid container spacing={2}>
                  <Grid item xs={12} md={6}>
                    <TextField
                      label="From Date"
                      type="datetime-local"
                      value={fromDate}
                      onChange={(e) => setFromDate(e.target.value)}
                      fullWidth
                      required
                      InputLabelProps={{ shrink: true }}
                      variant="outlined"
                      margin="dense"
                      sx={{ ...noBorderStyle, ...focusedLabelStyle }}
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <TextField
                      label="To Date"
                      type="datetime-local"
                      value={toDate}
                      onChange={(e) => setToDate(e.target.value)}
                      fullWidth
                      required
                      InputLabelProps={{ shrink: true }}
                      variant="outlined"
                      margin="dense"
                      sx={{ ...noBorderStyle, ...focusedLabelStyle }}
                    />
                  </Grid>
                </Grid>
                <TextField
                  label="Note"
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  fullWidth
                  multiline
                  rows={4}
                  variant="outlined"
                  margin="dense"
                  sx={{ ...noBorderStyle, ...focusedLabelStyle }}
                />
                <Grid container spacing={2}>
                  <Grid item xs={12} md={6}>
                    <TextField
                      label="Photo"
                      value={photo}
                      onChange={(e) => setPhoto(e.target.value)}
                      fullWidth
                      variant="outlined"
                      margin="dense"
                      sx={{ ...noBorderStyle, ...focusedLabelStyle }}
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <TextField
                      label="Is Active"
                      value={isActive}
                      onChange={(e) => setIsActive(e.target.value)}
                      fullWidth
                      variant="outlined"
                      margin="dense"
                      sx={{ ...noBorderStyle, ...focusedLabelStyle }}
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <TextField
                      label="Event Notification Message"
                      value={eventNotificationMessage}
                      onChange={(e) => setEventNotificationMessage(e.target.value)}
                      fullWidth
                      variant="outlined"
                      margin="dense"
                      sx={{ ...noBorderStyle, ...focusedLabelStyle,marginTop:"-5px" }}
                    />
                  </Grid>
              
                <Grid item xs={12} md={6}>
                <TextField
                  label="Show On Website"
                  value={showOnWebsite}
                  onChange={(e) => setShowOnWebsite(e.target.value)}
                  fullWidth
                  variant="outlined"
                  margin="dense"
                  sx={{ ...noBorderStyle, ...focusedLabelStyle ,marginTop:"-5px"}}
                />
                 </Grid>
                 </Grid>
                <Button type="submit" fullWidth variant="contained" className='alumnibtn'>
                  Save
                </Button>
              </form>
              <Grid item xs={12} md={12}>
            <TableContainer component={Paper} className='alumnicontainer'>
              <Table className='alumnitable'>
                <TableHead>
                  <TableRow>
                    <TableCell>Title</TableCell>
                    <TableCell>Event For</TableCell>
                    <TableCell>Session</TableCell>
                    <TableCell>Class</TableCell>
                    <TableCell>Section</TableCell>
                    <TableCell>From Date</TableCell>
                    <TableCell>To Date</TableCell>
                    <TableCell>Note</TableCell>
                    <TableCell>Photo</TableCell>
                    <TableCell>Is Active</TableCell>
                    <TableCell>Event Notification Message</TableCell>
                    <TableCell>Show On Website</TableCell>
                    <TableCell>Action</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {alumniEvents.map((event) => (
                    <TableRow key={event.id}>
                      <TableCell>{event.title}</TableCell>
                      <TableCell>{event.event_for}</TableCell>
                      <TableCell>{event.session_id}</TableCell>
                      <TableCell>{event.class_id}</TableCell>
                      <TableCell>{event.section}</TableCell>
                      <TableCell>{event.from_date}</TableCell>
                      <TableCell>{event.to_date}</TableCell>
                      <TableCell>{event.note}</TableCell>
                      <TableCell>{event.photo}</TableCell>
                      <TableCell>{event.is_active}</TableCell>
                      <TableCell>{event.event_notification_message}</TableCell>
                      <TableCell>{event.show_onwebsite}</TableCell>
                      <TableCell>
                        <IconButton onClick={() => handleDelete(event.id)}>
                          <DeleteIcon />
                        </IconButton>
                        <IconButton onClick={() => handleEdit(event.id)}>
                          <EditIcon />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Grid>
            </Paper>
          </Grid>
          
        </Grid>
      </Box>
    </Container>
  );
};

export default ManageAlumni;
