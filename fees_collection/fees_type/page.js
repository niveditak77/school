'use client';

import { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Container, Paper, Grid, TextField, Button, Typography, Box, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, IconButton, Alert
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import { GiMoneyStack } from "react-icons/gi";
import './ftype.css';

const FeesTypePage = () => {
  const [feeTypes, setFeeTypes] = useState([]);
  const [type, setType] = useState('');
  const [code, setCode] = useState('');
  const [description, setDescription] = useState('');
  const [editId, setEditId] = useState(null);
  const [search, setSearch] = useState('');
  const [error, setError] = useState('');

  const fetchFeeTypes = async () => {
    try {
      const response = await axios.get('/api/fees_collection/fees_type');
      setFeeTypes(response.data);
    } catch (error) {
      console.error('Error fetching fee types:', error);
    }
  };

  useEffect(() => {
    fetchFeeTypes();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      if (editId) {
        await axios.put(`/api/fees_collection/fees_type`, { id: editId, type, code, description });
      } else {
        await axios.post('/api/fees_collection/fees_type', { type, code, description });
      }
      setType('');
      setCode('');
      setDescription('');
      setEditId(null);
      fetchFeeTypes();
    } catch (error) {
      console.error('Error saving fee type:', error.response?.data);
      setError(`Error saving fee type: ${error.response?.data.error}`);
    }
  };

  const handleDelete = async (id) => {
    setError('');
    try {
      await axios.delete(`/api/fees_collection/fees_type`, { params: { id } });
      fetchFeeTypes();
    } catch (error) {
      console.error('Error deleting fee type:', error.response?.data);
      setError(`Error deleting fee type: ${error.response?.data.error}`);
    }
  };

  const handleEdit = (feeType) => {
    setType(feeType.type);
    setCode(feeType.code);
    setDescription(feeType.description);
    setEditId(feeType.id);
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
          <GiMoneyStack  style={{ marginRight: '9px', verticalAlign: 'middle', color: 'orange', fontSize: '35px', marginTop: '-7px', fontWeight: 'bold' }} />
         Fee Type
        </Typography>
        {error && <Alert severity="error">{error}</Alert>}
        <Grid container spacing={2}>
          <Grid item xs={12} md={4}>
            <Paper elevation={3} style={{ padding: '16px', borderRadius: '8px' }}>
              <form onSubmit={handleSubmit}>
                <TextField
                  label="Type"
                  name="type"
                  value={type}
                  onChange={(e) => setType(e.target.value)}
                  fullWidth
                  required
                  variant="outlined"
                  margin="normal"
                  sx={{ ...noBorderStyle, ...focusedLabelStyle }}
                />
                <TextField
                  label="Code"
                  name="code"
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
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
                <Button type="submit" fullWidth variant="contained" className='typbtn'>
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
              style={{ marginBottom: '16px' }}
              sx={{ ...noBorderStyle, ...focusedLabelStyle }}
            />
            <TableContainer component={Paper} className='typecontainer'>
              <Table className='typetable'>
                <TableHead>
                  <TableRow>
                    <TableCell>Type</TableCell>
                    <TableCell>Code</TableCell>
                    <TableCell>Description</TableCell>
                    <TableCell>Action</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {feeTypes.filter(ft => ft.type?.toLowerCase().includes(search.toLowerCase())).map((ft) => (
                    <TableRow key={ft.id}>
                      <TableCell>{ft.type}</TableCell>
                      <TableCell>{ft.code}</TableCell>
                      <TableCell>{ft.description}</TableCell>
                      <TableCell>
                        <IconButton onClick={() => handleEdit(ft)}>
                          <EditIcon />
                        </IconButton>
                        <IconButton onClick={() => handleDelete(ft.id)}>
                          <DeleteIcon  style={{color:'red'}}/>
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

export default FeesTypePage;
