'use client';

import { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Container, Paper, Grid, TextField, Button, Typography, Box, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, IconButton, Alert
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import { useTheme } from '../../../../context/ThemeContext'; // Import useTheme

const TemplatePage = () => {
  const { theme } = useTheme(); // Use the theme context
  const [templates, setTemplates] = useState([]);
  const [name, setName] = useState('');
  const [orientation, setOrientation] = useState('P');
  const [description, setDescription] = useState('');
  const [marksheetType, setMarksheetType] = useState('');
  const [sessionId, setSessionId] = useState('');
  const [editId, setEditId] = useState(null);
  const [search, setSearch] = useState('');
  const [error, setError] = useState('');

  const fetchTemplates = async () => {
    try {
      const response = await axios.get('/api/cbse_examination/template');
      setTemplates(response.data);
    } catch (error) {
      console.error('Error fetching templates:', error);
    }
  };

  useEffect(() => {
    fetchTemplates();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      if (editId) {
        await axios.put(`/api/cbse_examination/template`, {
          id: editId, name, orientation, description, marksheet_type: marksheetType, session_id: sessionId
        });
      } else {
        await axios.post('/api/cbse_examination/template', {
          name, orientation, description, marksheet_type: marksheetType, session_id: sessionId
        });
      }
      resetForm();
      fetchTemplates();
    } catch (error) {
      console.error('Error saving template:', error.response?.data);
      setError(`Error saving template: ${error.response?.data.error}`);
    }
  };

  const handleDelete = async (id) => {
    setError('');
    try {
      await axios.delete(`/api/cbse_examination/template`, { params: { id } });
      fetchTemplates();
    } catch (error) {
      console.error('Error deleting template:', error.response?.data);
      setError(`Error deleting template: ${error.response?.data.error}`);
    }
  };

  const handleEdit = (template) => {
    setName(template.name);
    setOrientation(template.orientation);
    setDescription(template.description);
    setMarksheetType(template.marksheet_type);
    setSessionId(template.session_id);
    setEditId(template.id);
  };

  const resetForm = () => {
    setName('');
    setOrientation('P');
    setDescription('');
    setMarksheetType('');
    setSessionId('');
    setEditId(null);
  };

  return (
    <Container maxWidth="lg" style={{ backgroundColor: theme.background, color: theme.text }}>
      <Box mt={4} mb={4}>
        <Typography variant="h4" align="center" gutterBottom style={{ color: theme.text }}>
          Templates
        </Typography>
        {error && <Alert severity="error" style={{ backgroundColor: theme.errorBackground, color: theme.errorText }}>{error}</Alert>}
        <Grid container spacing={2}>
          <Grid item xs={12} md={4}>
            <Paper elevation={3} style={{ padding: '16px', borderRadius: '8px', backgroundColor: theme.formBackground, color: theme.text }}>
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
                  style={{ backgroundColor: theme.inputBackground, color: theme.inputText }}
                  InputLabelProps={{ style: { color: theme.inputText } }}
                />
                <TextField
                  label="Orientation"
                  name="orientation"
                  value={orientation}
                  onChange={(e) => setOrientation(e.target.value)}
                  fullWidth
                  required
                  variant="outlined"
                  margin="normal"
                  style={{ backgroundColor: theme.inputBackground, color: theme.inputText }}
                  InputLabelProps={{ style: { color: theme.inputText } }}
                />
                <TextField
                  label="Description"
                  name="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  fullWidth
                  variant="outlined"
                  margin="normal"
                  style={{ backgroundColor: theme.inputBackground, color: theme.inputText }}
                  InputLabelProps={{ style: { color: theme.inputText } }}
                />
                <TextField
                  label="Marksheet Type"
                  name="marksheetType"
                  value={marksheetType}
                  onChange={(e) => setMarksheetType(e.target.value)}
                  fullWidth
                  required
                  variant="outlined"
                  margin="normal"
                  style={{ backgroundColor: theme.inputBackground, color: theme.inputText }}
                  InputLabelProps={{ style: { color: theme.inputText } }}
                />
                <TextField
                  label="Session ID"
                  name="sessionId"
                  value={sessionId}
                  onChange={(e) => setSessionId(e.target.value)}
                  fullWidth
                  required
                  variant="outlined"
                  margin="normal"
                  style={{ backgroundColor: theme.inputBackground, color: theme.inputText }}
                  InputLabelProps={{ style: { color: theme.inputText } }}
                />
                <Button type="submit" fullWidth variant="contained" style={{ backgroundColor: theme.button, color: theme.buttonText }}>
                  {editId ? 'Update' : 'Save'}
                </Button>
              </form>
            </Paper>
          </Grid>
          <Grid item xs={12} md={8}>
            <TextField
              label="Search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              fullWidth
              variant="outlined"
              style={{ marginBottom: '16px', backgroundColor: theme.inputBackground, color: theme.inputText }}
              InputLabelProps={{ style: { color: theme.inputText } }}
            />
            <TableContainer component={Paper} style={{ backgroundColor: theme.formBackground }}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell style={{ color: theme.text }}>Name</TableCell>
                    <TableCell style={{ color: theme.text }}>Orientation</TableCell>
                    <TableCell style={{ color: theme.text }}>Description</TableCell>
                    <TableCell style={{ color: theme.text }}>Marksheet Type</TableCell>
                    <TableCell style={{ color: theme.text }}>Session ID</TableCell>
                    <TableCell style={{ color: theme.text }}>Action</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {templates.filter(template => template.name?.toLowerCase().includes(search.toLowerCase())).map((template) => (
                    <TableRow key={template.id}>
                      <TableCell style={{ color: theme.text }}>{template.name}</TableCell>
                      <TableCell style={{ color: theme.text }}>{template.orientation}</TableCell>
                      <TableCell style={{ color: theme.text }}>{template.description}</TableCell>
                      <TableCell style={{ color: theme.text }}>{template.marksheet_type}</TableCell>
                      <TableCell style={{ color: theme.text }}>{template.session_id}</TableCell>
                      <TableCell>
                        <IconButton onClick={() => handleEdit(template)} style={{ color: theme.button }}>
                          <EditIcon />
                        </IconButton>
                        <IconButton onClick={() => handleDelete(template.id)} style={{ color: theme.error }}>
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

export default TemplatePage;
