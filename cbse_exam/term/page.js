'use client';

import { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Container, Paper, Grid, TextField, Button, Typography, Box, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, IconButton, Alert
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import { useTheme } from '../../../../context/ThemeContext'; // Import useTheme

const TermPage = () => {
  const { theme } = useTheme(); // Use the theme context
  const [terms, setTerms] = useState([]);
  const [name, setName] = useState('');
  const [termCode, setTermCode] = useState('');
  const [description, setDescription] = useState('');
  const [editId, setEditId] = useState(null);
  const [search, setSearch] = useState('');
  const [error, setError] = useState('');

  const fetchTerms = async () => {
    try {
      const response = await axios.get('/api/cbse_examination/term');
      setTerms(response.data);
    } catch (error) {
      console.error('Error fetching terms:', error);
    }
  };

  useEffect(() => {
    fetchTerms();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      if (editId) {
        await axios.put(`/api/cbse_examination/term`, { id: editId, name, termCode, description });
      } else {
        await axios.post('/api/cbse_examination/term', { name, termCode, description });
      }
      resetForm();
      fetchTerms();
    } catch (error) {
      console.error('Error saving term:', error.response?.data);
      setError(`Error saving term: ${error.response?.data.error}`);
    }
  };

  const handleDelete = async (id) => {
    setError('');
    try {
      await axios.delete(`/api/cbse_examination/term`, { params: { id } });
      fetchTerms();
    } catch (error) {
      console.error('Error deleting term:', error.response?.data);
      setError(`Error deleting term: ${error.response?.data.error}`);
    }
  };

  const handleEdit = (term) => {
    setName(term.name);
    setTermCode(term.term_code);
    setDescription(term.description);
    setEditId(term.id);
  };

  const resetForm = () => {
    setName('');
    setTermCode('');
    setDescription('');
    setEditId(null);
  };

  return (
    <Container maxWidth="lg" style={{ backgroundColor: theme.background, color: theme.text, minHeight: '100vh' }}>
      <Box mt={4} mb={4}>
        <Typography variant="h4" align="center" gutterBottom style={{ color: theme.text }}>
          Terms
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
                  label="Term Code"
                  name="termCode"
                  value={termCode}
                  onChange={(e) => setTermCode(e.target.value)}
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
                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  style={{ backgroundColor: theme.button, color: theme.buttonText, marginTop: '10px' }}
                >
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
                    <TableCell style={{ color: theme.text }}>Term Code</TableCell>
                    <TableCell style={{ color: theme.text }}>Description</TableCell>
                    <TableCell style={{ color: theme.text }}>Created At</TableCell>
                    <TableCell style={{ color: theme.text }}>Action</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {terms.filter(term => term.name?.toLowerCase().includes(search.toLowerCase())).map((term) => (
                    <TableRow key={term.id}>
                      <TableCell style={{ color: theme.text }}>{term.name}</TableCell>
                      <TableCell style={{ color: theme.text }}>{term.term_code}</TableCell>
                      <TableCell style={{ color: theme.text }}>{term.description}</TableCell>
                      <TableCell style={{ color: theme.text }}>{new Date(term.created_at).toLocaleDateString()}</TableCell>
                      <TableCell>
                        <IconButton onClick={() => handleEdit(term)} style={{ color: theme.button }}>
                          <EditIcon />
                        </IconButton>
                        <IconButton onClick={() => handleDelete(term.id)} style={{ color: theme.error }}>
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

export default TermPage;
