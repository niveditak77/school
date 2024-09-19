'use client';

import { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Container, Paper, Grid, TextField, Button, Typography, Box, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, IconButton, Alert
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import { BiSolidBookContent } from "react-icons/bi";
import './type.css';

const ContentTypes = () => {
  const [contentTypes, setContentTypes] = useState([]);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [error, setError] = useState('');
  const [editId, setEditId] = useState(null);

  const fetchContentTypes = async () => {
    try {
      const response = await axios.get('/api/download_center/content_types');
      setContentTypes(response.data);
    } catch (error) {
      console.error('Error fetching content types:', error);
    }
  };

  useEffect(() => {
    fetchContentTypes();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (editId) {
      // Update existing content type
      try {
        await axios.put('/api/download_center/content_types', { id: editId, newName: name, newDescription: description });
        setName('');
        setDescription('');
        setEditId(null);
        fetchContentTypes();
      } catch (error) {
        console.error('Error updating content type:', error);
        setError(`Error updating content type: ${error.response.data.error}`);
      }
    } else {
      // Add new content type
      try {
        await axios.post('/api/download_center/content_types', { name, description });
        setName('');
        setDescription('');
        fetchContentTypes();
      } catch (error) {
        console.error('Error saving content type:', error);
        setError(`Error saving content type: ${error.response.data.error}`);
      }
    }
  };

  const handleEdit = (id, name, description) => {
    setEditId(id);
    setName(name);
    setDescription(description);
  };

  const handleDelete = async (id) => {
    setError('');
    try {
      await axios.delete(`/api/download_center/content_types`, { params: { deleteId: id } });
      fetchContentTypes();
    } catch (error) {
      console.error('Error deleting content type:', error);
      setError(`Error deleting content type: ${error.response.data.error}`);
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
        <BiSolidBookContent style={{ marginRight: '7px', verticalAlign: 'middle', color: 'orange', fontSize: '28px', marginTop: '-5px' }}/>Content Types
        </Typography>
              <form onSubmit={handleSubmit}>
                <TextField
                  label="Name"
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
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  fullWidth
                  variant="outlined"
                  margin="normal"
                  
                  sx={{ ...noBorderStyle, ...focusedLabelStyle }}
                />
                <Button type="submit" fullWidth variant="contained" className='typebtn'>
                  {editId ? 'Update' : 'Save'}
                </Button>
              </form>
              <Grid item xs={12} md={12}>
            <TableContainer component={Paper} className='typecontainer'>
              <Table className='typetable'>
                <TableHead>
                  <TableRow>
                    <TableCell>Name</TableCell>
                    <TableCell>Description</TableCell>
                    <TableCell>Action</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {contentTypes.map((contentType) => (
                    <TableRow key={contentType.id}>
                      <TableCell>{contentType.name}</TableCell>
                      <TableCell>{contentType.description || 'No Description'}</TableCell>
                      <TableCell>
                        <IconButton onClick={() => handleEdit(contentType.id, contentType.name, contentType.description)}>
                          <EditIcon />
                        </IconButton>
                        <IconButton onClick={() => handleDelete(contentType.id)} style={{color:'red'}}>
                          <DeleteIcon />
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

export default ContentTypes;
