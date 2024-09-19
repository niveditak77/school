'use client';

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Container, Paper, Grid, TextField, Button, Typography, Box, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, IconButton, Dialog, DialogActions, DialogContent, DialogTitle, Select, MenuItem
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import { useTheme } from '../../../../context/ThemeContext'; // Import useTheme

const AssignObservationPage = () => {
  const { theme } = useTheme(); // Use the theme context
  const [assignments, setAssignments] = useState([]);
  const [observations, setObservations] = useState([]);
  const [terms, setTerms] = useState([]);
  const [sessions, setSessions] = useState([]);
  const [observationId, setObservationId] = useState('');
  const [termId, setTermId] = useState('');
  const [sessionId, setSessionId] = useState('');
  const [description, setDescription] = useState('');
  const [editId, setEditId] = useState(null);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    fetchAssignments();
    fetchObservations();
    fetchTerms();
    fetchSessions();
  }, []);

  const fetchAssignments = async () => {
    try {
      const response = await axios.get('/api/cbse_examination/assign_observation');
      setAssignments(response.data);
    } catch (error) {
      console.error('Error fetching assignments:', error);
    }
  };

  const fetchObservations = async () => {
    try {
      const response = await axios.get('/api/cbse_examination/observation');
      setObservations(response.data);
    } catch (error) {
      console.error('Error fetching observations:', error);
    }
  };

  const fetchTerms = async () => {
    try {
      const response = await axios.get('/api/cbse_examination/terms');
      setTerms(response.data);
    } catch (error) {
      console.error('Error fetching terms:', error);
    }
  };

  const fetchSessions = async () => {
    try {
      const response = await axios.get('/api/cbse_examination/sessions');
      setSessions(response.data);
    } catch (error) {
      console.error('Error fetching sessions:', error);
    }
  };

  const handleSave = async () => {
    try {
      const payload = {
        cbse_exam_observation_id: observationId,
        cbse_term_id: termId,
        session_id: sessionId,
        description,
      };
      
      if (editId) {
        await axios.put(`/api/cbse_examination/assign_observation`, { ...payload, id: editId });
      } else {
        await axios.post('/api/cbse_examination/assign_observation', payload);
      }
      
      resetForm();
      fetchAssignments();
    } catch (error) {
      console.error('Error saving assignment:', error);
    }
  };

  const handleEdit = (assignment) => {
    setObservationId(assignment.cbse_exam_observation_id);
    setTermId(assignment.cbse_term_id);
    setSessionId(assignment.session_id);
    setDescription(assignment.description);
    setEditId(assignment.id);
    setOpen(true);
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`/api/cbse_examination/assign_observation`, { params: { id } });
      fetchAssignments();
    } catch (error) {
      console.error('Error deleting assignment:', error);
    }
  };

  const resetForm = () => {
    setObservationId('');
    setTermId('');
    setSessionId('');
    setDescription('');
    setEditId(null);
    setOpen(false);
  };

  const handleClose = () => {
    resetForm();
  };

  return (
    <Container
      maxWidth="lg"
      style={{
        backgroundColor: theme.background,
        color: theme.text,
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column'
      }}
    >
      <Box mt={4} mb={4} style={{ flexGrow: 1 }}>
        <Typography variant="h4" align="center" gutterBottom style={{ color: theme.text }}>
          Assign Observations to Terms
        </Typography>
        <Button
          variant="contained"
          color="primary"
          style={{ marginBottom: '16px', backgroundColor: theme.button, color: theme.buttonText }}
          onClick={() => setOpen(true)}
        >
          + Assign Observation
        </Button>
        <TableContainer component={Paper} style={{ backgroundColor: theme.formBackground, flexGrow: 1 }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell style={{ color: theme.text }}>Observation</TableCell>
                <TableCell style={{ color: theme.text }}>Term</TableCell>
                <TableCell style={{ color: theme.text }}>Session</TableCell>
                <TableCell style={{ color: theme.text }}>Description</TableCell>
                <TableCell style={{ color: theme.text }}>Action</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {assignments.map((assignment) => (
                <TableRow key={assignment.id}>
                  <TableCell style={{ color: theme.text }}>{assignment.observation_name}</TableCell>
                  <TableCell style={{ color: theme.text }}>{assignment.term_name}</TableCell>
                  <TableCell style={{ color: theme.text }}>{assignment.session_name}</TableCell>
                  <TableCell style={{ color: theme.text }}>{assignment.description}</TableCell>
                  <TableCell>
                    <IconButton onClick={() => handleEdit(assignment)} style={{ color: theme.button }}>
                      <EditIcon />
                    </IconButton>
                    <IconButton onClick={() => handleDelete(assignment.id)} style={{ color: theme.error }}>
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>

      {/* Add/Edit Dialog */}
      {editId !== null && (
        <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
          <DialogTitle style={{ backgroundColor: theme.background, color: theme.text }}>
            {editId ? 'Edit Assignment' : 'Assign Observation'}
          </DialogTitle>
          <DialogContent style={{ backgroundColor: theme.formBackground }}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <Select
                  value={observationId}
                  onChange={(e) => setObservationId(e.target.value)}
                  fullWidth
                  required
                  displayEmpty
                  style={{ backgroundColor: theme.inputBackground, color: theme.inputText }}
                >
                  <MenuItem value="" disabled>Select Observation</MenuItem>
                  {observations.map((obs) => (
                    <MenuItem key={obs.id} value={obs.id}>{obs.name}</MenuItem>
                  ))}
                </Select>
              </Grid>
              <Grid item xs={12}>
                <Select
                  value={termId}
                  onChange={(e) => setTermId(e.target.value)}
                  fullWidth
                  required
                  displayEmpty
                  style={{ backgroundColor: theme.inputBackground, color: theme.inputText }}
                >
                  <MenuItem value="" disabled>Select Term</MenuItem>
                  {terms.map((term) => (
                    <MenuItem key={term.id} value={term.id}>{term.name}</MenuItem>
                  ))}
                </Select>
              </Grid>
              <Grid item xs={12}>
                <Select
                  value={sessionId}
                  onChange={(e) => setSessionId(e.target.value)}
                  fullWidth
                  required
                  displayEmpty
                  style={{ backgroundColor: theme.inputBackground, color: theme.inputText }}
                >
                  <MenuItem value="" disabled>Select Session</MenuItem>
                  {sessions.map((session) => (
                    <MenuItem key={session.id} value={session.id}>{session.name}</MenuItem>
                  ))}
                </Select>
              </Grid>
              <Grid item xs={12}>
                <TextField
                  label="Description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  fullWidth
                  multiline
                  rows={4}
                  style={{ backgroundColor: theme.inputBackground, color: theme.inputText }}
                  InputLabelProps={{ style: { color: theme.inputText } }}
                />
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions style={{ backgroundColor: theme.background }}>
            <Button onClick={handleClose} color="secondary" style={{ color: theme.text }}>
              Cancel
            </Button>
            <Button onClick={handleSave} color="primary" style={{ backgroundColor: theme.button, color: theme.buttonText }}>
              Save
            </Button>
          </DialogActions>
        </Dialog>
      )}
    </Container>
  );
};

export default AssignObservationPage;
