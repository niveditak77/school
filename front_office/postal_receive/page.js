'use client';

import { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  Paper, 
  Typography, 
  TextField, 
  Button, 
  Box, 
  Grid, 
  Container, 
  Table, 
  TableBody, 
  TableCell, 
  TableContainer, 
  TableHead, 
  TableRow, 
  IconButton, 
  Snackbar,
  CircularProgress
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import MuiAlert from '@mui/material/Alert';
import { BsFillEnvelopeCheckFill } from "react-icons/bs";
import './postalReceive.css';

const Alert = (props) => {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
};

const PostalReceive = () => {
  const [postalReceives, setPostalReceives] = useState([]);
  const [fromTitle, setFromTitle] = useState('');
  const [referenceNo, setReferenceNo] = useState('');
  const [address, setAddress] = useState('');
  const [note, setNote] = useState('');
  const [toTitle, setToTitle] = useState('');
  const [date, setDate] = useState('');
  const [editId, setEditId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('success');

  useEffect(() => {
    fetchPostalReceives();
  }, []);

  const fetchPostalReceives = async () => {
    setLoading(true);
    try {
      const response = await axios.get('/api/frontoffice/postal_receive');
      setPostalReceives(response.data);
    } catch (error) {
      console.error('Error fetching postal receives:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateOrUpdatePostalReceive = async (event) => {
    event.preventDefault();
    setLoading(true);
    try {
      if (editId) {
        await axios.put('/api/frontoffice/postal_receive', { id: editId, fromTitle, referenceNo, address, note, toTitle, date });
      } else {
        await axios.post('/api/frontoffice/postal_receive', { fromTitle, referenceNo, address, note, toTitle, date });
      }
      setFromTitle('');
      setReferenceNo('');
      setAddress('');
      setNote('');
      setToTitle('');
      setDate('');
      setEditId(null);
      fetchPostalReceives();
      setSnackbarMessage('Postal receive saved successfully');
      setSnackbarSeverity('success');
    } catch (error) {
      setSnackbarMessage('Error creating or updating postal receive');
      setSnackbarSeverity('error');
      console.error('Error creating or updating postal receive:', error);
    } finally {
      setLoading(false);
      setOpenSnackbar(true);
    }
  };

  const handleEdit = (postalReceive) => {
    setEditId(postalReceive.id);
    setFromTitle(postalReceive.from_title);
    setReferenceNo(postalReceive.reference_no);
    setAddress(postalReceive.address);
    setNote(postalReceive.note);
    setToTitle(postalReceive.to_title);
    setDate(postalReceive.date);
  };

  const handleDelete = async (id) => {
    setLoading(true);
    try {
      await axios.delete('/api/frontoffice/postal_receive', { data: { id } });
      fetchPostalReceives();
      setSnackbarMessage('Postal receive deleted successfully');
      setSnackbarSeverity('success');
    } catch (error) {
      setSnackbarMessage('Error deleting postal receive');
      setSnackbarSeverity('error');
      console.error('Error deleting postal receive:', error);
    } finally {
      setLoading(false);
      setOpenSnackbar(true);
    }
  };

  const handleCloseSnackbar = () => {
    setOpenSnackbar(false);
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
      color: 'orange', // Specify the color you want for the focused state
    }
  };

  return (
    <Container maxWidth="lg">
      <Box mt={4} mb={4}>
        <Paper elevation={3} style={{ padding: '16px', borderRadius: '8px' }}>
          <Typography variant="h5" align="left" marginBottom="40px" fontFamily="Verdana, Geneva, Tahoma, sans-serif" gutterBottom>
            <BsFillEnvelopeCheckFill style={{ marginRight: '7px', marginLeft: '3px', verticalAlign: 'middle', color: 'orange', fontSize: '28px', marginTop: '-7px' }} /> 
            Postal Receive
          </Typography>

          <form onSubmit={handleCreateOrUpdatePostalReceive}>
            <Grid container spacing={2}>
              <Grid item xs={12} md={6}>
                <TextField
                  label="From Title"
                  value={fromTitle}
                  onChange={(e) => setFromTitle(e.target.value)}
                  fullWidth
                  required
                  variant="outlined"
                  margin="normal"
                  sx={{ ...noBorderStyle, ...focusedLabelStyle, marginTop: "2px" }}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  label="Reference No"
                  value={referenceNo}
                  onChange={(e) => setReferenceNo(e.target.value)}
                  fullWidth
                  variant="outlined"
                  margin="normal"
                  sx={{ ...noBorderStyle, ...focusedLabelStyle, marginTop: "2px" }}
                />
              </Grid>
              <Grid item xs={12} >
                <TextField
                  label="Address"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  fullWidth
                  variant="outlined"
                  margin="normal"
                  sx={{ ...noBorderStyle, ...focusedLabelStyle, marginTop: "2px" }}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  label="Note"
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  fullWidth
                  variant="outlined"
                  margin="normal"
                  sx={{ ...noBorderStyle, ...focusedLabelStyle, marginTop: "2px" }}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  label="To Title"
                  value={toTitle}
                  onChange={(e) => setToTitle(e.target.value)}
                  fullWidth
                  variant="outlined"
                  margin="normal"
                  sx={{ ...noBorderStyle, ...focusedLabelStyle, marginTop: "2px" }}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  label="Date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  fullWidth
                  type="date"
                  variant="outlined"
                  margin="normal"
                  sx={{ ...noBorderStyle, ...focusedLabelStyle, marginTop: "2px" }}
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>
              <Grid item xs={12}>
                <Button type="submit" fullWidth variant="contained" className='postalreceivebtn' size="large" style={{ marginTop: '16px' }}>
                  {editId ? 'Update Postal Receive' : 'Create Postal Receive'}
                </Button>
              </Grid>
            </Grid>
          </form>

          <Box mt={4}>
            <Typography variant="h6" marginBottom="40px" color="orange">
              Postal Receive List
              <hr className='receivehr'/>
            </Typography>
            {loading ? (
              <Box display="flex" justifyContent="center" alignItems="center" height="100%">
                <CircularProgress />
              </Box>
            ) : (
              <TableContainer className='receivecontainer'>
                <Table className='receivetable'>
                  <TableHead>
                    <TableRow>
                      <TableCell>From Title</TableCell>
                      <TableCell>Reference No</TableCell>
                      <TableCell>To Title</TableCell>
                      <TableCell>Date</TableCell>
                      <TableCell>Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {postalReceives.map((postalReceive) => (
                      <TableRow key={postalReceive.id}>
                        <TableCell>{postalReceive.from_title}</TableCell>
                        <TableCell>{postalReceive.reference_no}</TableCell>
                        <TableCell>{postalReceive.to_title}</TableCell>
                        <TableCell>{postalReceive.date}</TableCell>
                        <TableCell>
                          <IconButton onClick={() => handleEdit(postalReceive)}>
                            <EditIcon />
                          </IconButton>
                          <IconButton onClick={() => handleDelete(postalReceive.id)} sx={{ color: 'red' }}>
                            <DeleteIcon />
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            )}
          </Box>
        </Paper>

        <Snackbar open={openSnackbar} autoHideDuration={6000} onClose={handleCloseSnackbar}>
          <Alert onClose={handleCloseSnackbar} severity={snackbarSeverity}>
            {snackbarMessage}
          </Alert>
        </Snackbar>
      </Box>
    </Container>
  );
};

export default PostalReceive;
