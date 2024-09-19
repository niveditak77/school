'use client';

import { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Container, Paper, Grid, TextField, Button, Typography, Box, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, IconButton
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import { useTheme } from '../../../../context/ThemeContext'; // Import useTheme

const ObservationParameterPage = () => {
  const { theme } = useTheme(); // Use the theme context
  const [parameters, setParameters] = useState([]);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [editId, setEditId] = useState(null);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    fetchParameters();
  }, []);

  const fetchParameters = async () => {
    try {
      const response = await axios.get('/api/cbse_examination/observation_parameter');
      setParameters(response.data);
    } catch (error) {
      console.error('Error fetching observation parameters:', error);
    }
  };

  const handleSave = async () => {
    try {
      if (editId) {
        await axios.put(`/api/cbse_examination/observation_parameter`, { id: editId, name, description });
      } else {
        await axios.post('/api/cbse_examination/observation_parameter', { name, description });
      }
      setName('');
      setDescription('');
      setEditId(null);
      setOpen(false);
      fetchParameters();
    } catch (error) {
      console.error('Error saving observation parameter:', error);
    }
  };

  const handleEdit = (parameter) => {
    setName(parameter.name);
    setDescription(parameter.description);
    setEditId(parameter.id);
    setOpen(true);
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`/api/cbse_examination/observation_parameter`, { params: { id } });
      fetchParameters();
    } catch (error) {
      console.error('Error deleting observation parameter:', error);
    }
  };

  const handleClose = () => {
    setOpen(false);
    setName('');
    setDescription('');
    setEditId(null);
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
      <Box mt={4} mb={4}>
        <Typography variant="h4" align="center" gutterBottom style={{ color: theme.text }}>
          Observation Parameters
        </Typography>
        <Grid container spacing={4}>
          {/* Form Section */}
          <Grid item xs={12} md={4}>
            <Paper
              elevation={3}
              style={{
                padding: '16px',
                borderRadius: '8px',
                backgroundColor: theme.formBackground,
                color: theme.text,
              }}
            >
              <Typography variant="h6" gutterBottom style={{ color: theme.text }}>
                {editId ? 'Edit Observation Parameter' : 'Add Observation Parameter'}
              </Typography>
              <TextField
                label="Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                fullWidth
                margin="normal"
                required
                style={{ backgroundColor: theme.inputBackground, color: theme.inputText }}
                InputLabelProps={{ style: { color: theme.inputText } }}
              />
              <TextField
                label="Description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                fullWidth
                margin="normal"
                multiline
                rows={4}
                style={{ backgroundColor: theme.inputBackground, color: theme.inputText }}
                InputLabelProps={{ style: { color: theme.inputText } }}
              />
              <Box mt={2}>
                <Button
                  variant="contained"
                  onClick={handleSave}
                  fullWidth
                  style={{ backgroundColor: theme.button, color: theme.buttonText }}
                >
                  {editId ? 'Update' : 'Save'}
                </Button>
                <Button
                  variant="contained"
                  onClick={handleClose}
                  fullWidth
                  style={{ marginTop: '10px', backgroundColor: theme.error, color: theme.buttonText }}
                >
                  Cancel
                </Button>
              </Box>
            </Paper>
          </Grid>

          {/* Table Section */}
          <Grid item xs={12} md={8}>
            <TableContainer component={Paper} style={{ backgroundColor: theme.formBackground }}>
              <Table>
                <TableHead style={{ backgroundColor: theme.formBackground }}>
                  <TableRow>
                    <TableCell style={{ color: theme.text }}>Name</TableCell>
                    <TableCell style={{ color: theme.text }}>Description</TableCell>
                    <TableCell style={{ color: theme.text }}>Created At</TableCell>
                    <TableCell style={{ color: theme.text }}>Action</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {parameters.map((parameter) => (
                    <TableRow key={parameter.id}>
                      <TableCell style={{ color: theme.text }}>{parameter.name}</TableCell>
                      <TableCell style={{ color: theme.text }}>{parameter.description}</TableCell>
                      <TableCell style={{ color: theme.text }}>
                        {new Date(parameter.created_at).toLocaleDateString()}
                      </TableCell>
                      <TableCell>
                        <IconButton onClick={() => handleEdit(parameter)} style={{ color: theme.button }}>
                          <EditIcon />
                        </IconButton>
                        <IconButton onClick={() => handleDelete(parameter.id)} style={{ color: theme.error }}>
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

export default ObservationParameterPage;
