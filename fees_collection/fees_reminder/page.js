'use client';

import { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Container, Paper, Grid, TextField, Button, Typography, Box, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Checkbox, FormControlLabel, Alert, IconButton
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import { IoNotifications } from "react-icons/io5";
import './rem.css';

const FeesReminderPage = () => {
  const [feesReminders, setFeesReminders] = useState([]);
  const [reminderType, setReminderType] = useState('before');
  const [day, setDay] = useState('');
  const [isActive, setIsActive] = useState(false);
  const [editId, setEditId] = useState(null);
  const [error, setError] = useState('');

  const fetchFeesReminders = async () => {
    try {
      const response = await axios.get('/api/fees_collection/fees_reminder');
      setFeesReminders(response.data);
    } catch (error) {
      console.error('Error fetching fees reminders:', error);
    }
  };

  useEffect(() => {
    fetchFeesReminders();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      if (editId) {
        await axios.put(`/api/fees_collection/fees_reminder`, { id: editId, reminder_type: reminderType, day, is_active: isActive });
      } else {
        await axios.post('/api/fees_collection/fees_reminder', { reminder_type: reminderType, day, is_active: isActive });
      }
      setReminderType('before');
      setDay('');
      setIsActive(false);
      setEditId(null);
      fetchFeesReminders();
    } catch (error) {
      console.error('Error saving fees reminder:', error.response?.data);
      setError(`Error saving fees reminder: ${error.response?.data.error}`);
    }
  };

  const handleDelete = async (id) => {
    setError('');
    try {
      await axios.delete(`/api/fees_collection/fees_reminder`, { params: { id } });
      fetchFeesReminders();
    } catch (error) {
      console.error('Error deleting fees reminder:', error.response?.data);
      setError(`Error deleting fees reminder: ${error.response?.data.error}`);
    }
  };

  const handleEdit = (feesReminder) => {
    setReminderType(feesReminder.reminder_type);
    setDay(feesReminder.day);
    setIsActive(feesReminder.is_active);
    setEditId(feesReminder.id);
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
      color: 'orange',
    }
  };

  return (
    <Container maxWidth="lg">
  <Box mt={4} mb={4}>
    <Typography
      variant="h5"
      align="left"
      marginBottom="25px"
      marginLeft="5px"
      fontFamily="Verdana, Geneva, Tahoma, sans-serif"
      gutterBottom
    >
      <IoNotifications
        style={{
          marginRight: '9px',
          verticalAlign: 'middle',
          color: 'orange',
          fontSize: '32px',
          marginTop: '-10px',
          fontWeight: 'bold',
        }}
      />
      Fee Reminder
    </Typography>
    {error && <Alert severity="error">{error}</Alert>}
    <Grid container spacing={2}>
      <Grid item xs={12} md={12}>
        <Paper elevation={3} style={{ padding: '16px', borderRadius: '8px' }}>
          <form onSubmit={handleSubmit}>
            <Grid container spacing={2}>
              {/* TextFields in a Single Row */}
              <Grid item xs={12} md={6}>
                <TextField
                  label="Reminder Type"
                  name="reminder_type"
                  value={reminderType}
                  onChange={(e) => setReminderType(e.target.value)}
                  fullWidth
                  required
                  variant="outlined"
                  margin="normal"
                  sx={{ ...noBorderStyle, ...focusedLabelStyle }}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  label="Day"
                  name="day"
                  type="number"
                  value={day}
                  onChange={(e) => setDay(e.target.value)}
                  fullWidth
                  required
                  variant="outlined"
                  margin="normal"
                  sx={{ ...noBorderStyle, ...focusedLabelStyle }}
                />
              </Grid>
            </Grid>

            {/* Grid Container for Checkbox and Button */}
            <Grid container spacing={1} alignItems="center">
              <Grid item>
                <FormControlLabel
                  control={
                    <Checkbox
                    checked={isActive}
                    onChange={(e) => setIsActive(e.target.checked)}
                    name="is_active"
                    sx={{
                      color: 'gray', // Default color
                      '&.Mui-checked': {
                        color: 'orange', // Color when checked
                      },
                      marginLeft: '5px', // Adds left margin
                    }}
                  />
                }
                label="Active"
              />
              </Grid>
              <Grid item xs={12}>
                <Button type="submit" fullWidth variant="contained" className="remainderbtn">
                  {editId ? 'Update' : 'Save'}
                </Button>
              </Grid>
            </Grid>
          </form>
        </Paper>
      </Grid>
      <Grid item xs={12} md={12}>
        <TableContainer component={Paper} className="remcontain">
          <Table className="remtable">
            <TableHead>
              <TableRow>
                <TableCell>Action</TableCell>
                <TableCell>Reminder Type</TableCell>
                <TableCell>Days</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {feesReminders.map((fr) => (
                <TableRow key={fr.id}>
                  <TableCell>
                    <FormControlLabel
                      control={<Checkbox checked={fr.is_active} />}
                      label="Active"
                      disabled
                    />
                  </TableCell>
                  <TableCell>{fr.reminder_type}</TableCell>
                  <TableCell>{fr.day}</TableCell>
                  <TableCell>
                    <IconButton onClick={() => handleEdit(fr)}>
                      <EditIcon />
                    </IconButton>
                    <IconButton onClick={() => handleDelete(fr.id)}>
                      <DeleteIcon style={{color:'red'}}/>
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

export default FeesReminderPage;
