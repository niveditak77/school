'use client';

import { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Container, Paper, Grid, TextField, Button, Typography, Box, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, IconButton, Alert
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import { TiGroup } from "react-icons/ti";
import './grp.css';

const FeesGroupPage = () => {
  const [feeGroups, setFeeGroups] = useState([]);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [editId, setEditId] = useState(null);
  const [search, setSearch] = useState('');
  const [error, setError] = useState('');

  const fetchFeeGroups = async () => {
    try {
      const response = await axios.get('/api/fees_collection/fees_group');
      setFeeGroups(response.data);
    } catch (error) {
      console.error('Error fetching fee groups:', error);
    }
  };

  useEffect(() => {
    fetchFeeGroups();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      if (editId) {
        await axios.put(`/api/fees_collection/fees_group`, { id: editId, name, description });
      } else {
        await axios.post('/api/fees_collection/fees_group', { name, description });
      }
      setName('');
      setDescription('');
      setEditId(null);
      fetchFeeGroups();
    } catch (error) {
      console.error('Error saving fee group:', error.response?.data);
      setError(`Error saving fee group: ${error.response?.data.error}`);
    }
  };

  const handleDelete = async (id) => {
    setError('');
    try {
      await axios.delete(`/api/fees_collection/fees_group`, { params: { id } });
      fetchFeeGroups();
    } catch (error) {
      console.error('Error deleting fee group:', error.response?.data);
      setError(`Error deleting fee group: ${error.response?.data.error}`);
    }
  };

  const handleEdit = (feeGroup) => {
    setName(feeGroup.name);
    setDescription(feeGroup.description);
    setEditId(feeGroup.id);
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
      <Typography variant="h5" align="left" marginBottom="25px" marginLeft='5px' fontFamily="Verdana, Geneva, Tahoma, sans-serif" gutterBottom>
          <TiGroup  style={{ marginRight: '9px', verticalAlign: 'middle', color: 'orange', fontSize: '35px', marginTop: '-7px', fontWeight: 'bold' }} />
         Fee Groups
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
                <TextField
                  label="Description"
                  name="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  fullWidth
                  variant="outlined"
                  margin="normal"
                  sx={{ ...noBorderStyle, ...focusedLabelStyle }}
                />
                <Button type="submit" fullWidth variant="contained" className='grpbtn'>
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
              sx={{ ...noBorderStyle, ...focusedLabelStyle }}
              style={{ marginBottom: '16px' }}
            />
            <TableContainer component={Paper} className='grpcontain'>
              <Table className='grptable'>
                <TableHead>
                  <TableRow>
                    <TableCell>Name</TableCell>
                    <TableCell>Description</TableCell>
                    <TableCell>Action</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {feeGroups.filter(fg => fg.name?.toLowerCase().includes(search.toLowerCase())).map((fg) => (
                    <TableRow key={fg.id}>
                      <TableCell>{fg.name}</TableCell>
                      <TableCell>{fg.description}</TableCell>
                      <TableCell>
                        <IconButton onClick={() => handleEdit(fg)}>
                          <EditIcon />
                        </IconButton>
                        <IconButton onClick={() => handleDelete(fg.id)}>
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

export default FeesGroupPage;
