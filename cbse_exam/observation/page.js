'use client';

import { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Container, Paper, Grid, TextField, Button, Typography, Box, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, IconButton, Dialog, DialogActions, DialogContent, DialogTitle
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import { useTheme } from '../../../../context/ThemeContext'; // Import useTheme

const ObservationPage = () => {
  const { theme } = useTheme(); // Use the theme context
  const [observations, setObservations] = useState([]);
  const [parameters, setParameters] = useState([]);
  const [observationName, setObservationName] = useState('');
  const [observationDescription, setObservationDescription] = useState('');
  const [observationParameters, setObservationParameters] = useState([{ parameter_id: '', maximum_marks: '' }]);
  const [editId, setEditId] = useState(null);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    fetchObservations();
    fetchParameters();
  }, []);

  const fetchObservations = async () => {
    try {
      const response = await axios.get('/api/cbse_examination/observation');
      setObservations(response.data);
    } catch (error) {
      console.error('Error fetching observations:', error);
    }
  };

  const fetchParameters = async () => {
    try {
      const response = await axios.get('/api/cbse_examination/observation_parameter');
      setParameters(response.data);
    } catch (error) {
      console.error('Error fetching parameters:', error);
    }
  };

  const handleSave = async () => {
    try {
      const data = {
        name: observationName,
        description: observationDescription,
        parameters: observationParameters
      };
      if (editId) {
        await axios.put(`/api/cbse_examination/observation`, { ...data, id: editId });
      } else {
        await axios.post('/api/cbse_examination/observation', data);
      }
      setObservationName('');
      setObservationDescription('');
      setObservationParameters([{ parameter_id: '', maximum_marks: '' }]);
      setEditId(null);
      setOpen(false);
      fetchObservations();
    } catch (error) {
      console.error('Error saving observation:', error);
    }
  };

  const handleEdit = (observation) => {
    setObservationName(observation.name);
    setObservationDescription(observation.description);
    setObservationParameters(observation.parameters ? observation.parameters.split(', ').map(param => {
      const [parameter_id, maximum_marks] = param.split('|');
      return { parameter_id, maximum_marks };
    }) : [{ parameter_id: '', maximum_marks: '' }]);
    setEditId(observation.id);
    setOpen(true);
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`/api/cbse_examination/observation`, { params: { id } });
      fetchObservations();
    } catch (error) {
      console.error('Error deleting observation:', error);
    }
  };

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setObservationName('');
    setObservationDescription('');
    setObservationParameters([{ parameter_id: '', maximum_marks: '' }]);
    setEditId(null);
  };

  const addParameterField = () => {
    setObservationParameters([...observationParameters, { parameter_id: '', maximum_marks: '' }]);
  };

  const removeParameterField = (index) => {
    setObservationParameters(observationParameters.filter((_, i) => i !== index));
  };

  const handleParameterChange = (index, field, value) => {
    const newParameters = [...observationParameters];
    newParameters[index][field] = value;
    setObservationParameters(newParameters);
  };

  return (
    <Container
      maxWidth="lg"
      style={{
        backgroundColor: theme.background,
        color: theme.text,
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <Box mt={4} mb={4} style={{ flexGrow: 1 }}>
        <Typography variant="h4" align="center" gutterBottom style={{ color: theme.text }}>
          Observations
        </Typography>
        <Button
          variant="contained"
          color="primary"
          onClick={handleOpen}
          style={{ backgroundColor: theme.button, color: theme.buttonText }}
        >
          + Add Observation
        </Button>
        <Dialog open={open} onClose={handleClose} fullWidth>
          <DialogTitle style={{ backgroundColor: theme.background, color: theme.text }}>
            {editId ? 'Edit Observation' : 'Add Observation'}
          </DialogTitle>
          <DialogContent style={{ backgroundColor: theme.formBackground }}>
            <TextField
              label="Observation Name"
              value={observationName}
              onChange={(e) => setObservationName(e.target.value)}
              fullWidth
              margin="normal"
              required
              style={{ backgroundColor: theme.inputBackground, color: theme.inputText }}
              InputLabelProps={{ style: { color: theme.inputText } }}
            />
            <TextField
              label="Observation Description"
              value={observationDescription}
              onChange={(e) => setObservationDescription(e.target.value)}
              fullWidth
              margin="normal"
              multiline
              rows={4}
              style={{ backgroundColor: theme.inputBackground, color: theme.inputText }}
              InputLabelProps={{ style: { color: theme.inputText } }}
            />
            {observationParameters.map((parameter, index) => (
              <Grid container spacing={2} key={index}>
                <Grid item xs={5}>
                  <TextField
                    label="Parameter"
                    select
                    SelectProps={{
                      native: true,
                    }}
                    value={parameter.parameter_id}
                    onChange={(e) => handleParameterChange(index, 'parameter_id', e.target.value)}
                    fullWidth
                    margin="normal"
                    required
                    style={{ backgroundColor: theme.inputBackground, color: theme.inputText }}
                    InputLabelProps={{ style: { color: theme.inputText } }}
                  >
                    <option value="" disabled>Select a parameter</option>
                    {parameters.map((p) => (
                      <option key={p.id} value={p.id}>{p.name}</option>
                    ))}
                  </TextField>
                </Grid>
                <Grid item xs={5}>
                  <TextField
                    label="Maximum Marks"
                    value={parameter.maximum_marks}
                    onChange={(e) => handleParameterChange(index, 'maximum_marks', e.target.value)}
                    fullWidth
                    margin="normal"
                    required
                    style={{ backgroundColor: theme.inputBackground, color: theme.inputText }}
                    InputLabelProps={{ style: { color: theme.inputText } }}
                  />
                </Grid>
                <Grid item xs={2}>
                  <IconButton onClick={() => removeParameterField(index)} style={{ color: theme.error }}>
                    <DeleteIcon />
                  </IconButton>
                </Grid>
              </Grid>
            ))}
            <Button onClick={addParameterField} variant="contained" style={{ backgroundColor: theme.button, color: theme.buttonText }}>
              Add More
            </Button>
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

        <TableContainer component={Paper} style={{ marginTop: '16px', backgroundColor: theme.formBackground }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell style={{ color: theme.text }}>Observation</TableCell>
                <TableCell style={{ color: theme.text }}>Observation Description</TableCell>
                <TableCell style={{ color: theme.text }}>Parameters</TableCell>
                <TableCell style={{ color: theme.text }}>Action</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {observations.map((observation) => (
                <TableRow key={observation.id}>
                  <TableCell style={{ color: theme.text }}>{observation.name}</TableCell>
                  <TableCell style={{ color: theme.text }}>{observation.description}</TableCell>
                  <TableCell style={{ color: theme.text }}>
                    {observation.parameters ? observation.parameters.split(', ').map((param, index) => (
                      <Box key={index}>
                        {param}
                      </Box>
                    )) : 'No Parameters'}
                  </TableCell>
                  <TableCell>
                    <IconButton onClick={() => handleEdit(observation)} style={{ color: theme.button }}>
                      <EditIcon />
                    </IconButton>
                    <IconButton onClick={() => handleDelete(observation.id)} style={{ color: theme.error }}>
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
    </Container>
  );
};

export default ObservationPage;
