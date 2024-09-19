'use client';

import { useState, useEffect } from 'react';
import axios from 'axios';
import { Paper, Typography, TextField, Button, Box, Grid, Container, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, IconButton, FormControl, InputLabel, Select, MenuItem, Snackbar, Alert } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import { BsExclamationOctagonFill } from "react-icons/bs";
import './complain.css';

const Complaint = () => {
  const [complaints, setComplaints] = useState([]);
  const [complaintTypes, setComplaintTypes] = useState([]);
  const [sources, setSources] = useState([]);
  const [complaintType, setComplaintType] = useState('');
  const [source, setSource] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [date, setDate] = useState('');
  const [description, setDescription] = useState('');
  const [actionTaken, setActionTaken] = useState('');
  const [assigned, setAssigned] = useState('');
  const [note, setNote] = useState('');
  const [editId, setEditId] = useState(null);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('success');

  useEffect(() => {
    fetchComplaintTypes();
    fetchSources();
    fetchComplaints();
  }, []);

  const fetchComplaintTypes = async () => {
    const response = await axios.get('/api/frontoffice/complaint_type');
    setComplaintTypes(response.data);
  };

  const fetchSources = async () => {
    const response = await axios.get('/api/frontoffice/source');
    setSources(response.data);
  };

  const fetchComplaints = async () => {
    const response = await axios.get('/api/frontoffice/complaint');
    setComplaints(response.data);
  };

  const handleCreateOrUpdateComplaint = async (event) => {
    event.preventDefault();
    try {
      const complaintData = {
        complaint_type: complaintType,
        source,
        name,
        contact: phone,
        email,
        date,
        description,
        action_taken: actionTaken,
        assigned,
        note
      };

      if (editId) {
        await axios.put('/api/frontoffice/complaint', { id: editId, ...complaintData });
        setSnackbarMessage('Complaint updated successfully');
      } else {
        await axios.post('/api/frontoffice/complaint', complaintData);
        setSnackbarMessage('Complaint created successfully');
      }
      setSnackbarSeverity('success');
      fetchComplaints();
    } catch (error) {
      console.error('Error creating or updating complaint:', error);
      setSnackbarMessage('Error creating or updating complaint');
      setSnackbarSeverity('error');
    }
    setOpenSnackbar(true);
    setEditId(null);
    setComplaintType('');
    setSource('');
    setName('');
    setPhone('');
    setEmail('');
    setDate('');
    setDescription('');
    setActionTaken('');
    setAssigned('');
    setNote('');
  };

  const handleEdit = (complaint) => {
    setEditId(complaint.id);
    setComplaintType(complaint.complaint_type);
    setSource(complaint.source);
    setName(complaint.name);
    setPhone(complaint.contact);
    setEmail(complaint.email);
    setDate(complaint.date);
    setDescription(complaint.description);
    setActionTaken(complaint.action_taken);
    setAssigned(complaint.assigned);
    setNote(complaint.note);
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete('/api/frontoffice/complaint', { data: { id } });
      setSnackbarMessage('Complaint deleted successfully');
      setSnackbarSeverity('success');
      fetchComplaints();
    } catch (error) {
      console.error('Error deleting complaint:', error);
      setSnackbarMessage('Error deleting complaint');
      setSnackbarSeverity('error');
    }
    setOpenSnackbar(true);
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
          <Grid container spacing={2}>
            <Grid item xs={12} md={12}>
              <Typography variant="h5" align="left" marginBottom="30px" fontFamily="Verdana, Geneva, Tahoma, sans-serif" gutterBottom>
                <BsExclamationOctagonFill style={{ marginRight: '7px', marginLeft: '3px', verticalAlign: 'middle', color: 'orange', fontSize: '28px', marginTop: '-7px' }}/> Add Complaint
              </Typography>
              <form onSubmit={handleCreateOrUpdateComplaint}>
                <Grid container spacing={2}>
                  <Grid item xs={12} md={6}>
                    <FormControl variant="outlined" fullWidth required margin="normal">
                      <InputLabel sx={{ '&.Mui-focused': { color: 'orange' }}}>Complaint Type</InputLabel>
                      <Select value={complaintType} onChange={(e) => setComplaintType(e.target.value)} label="Complaint Type" sx={{ ...noBorderStyle, ...focusedLabelStyle, marginTop: "2px" }}>
                        {complaintTypes.map((type) => (
                          <MenuItem key={type.id} value={type.complaint_type}>
                            {type.complaint_type}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <FormControl variant="outlined" fullWidth required margin="normal" sx={{ ...noBorderStyle, ...focusedLabelStyle,  }}>
                      <InputLabel sx={{ '&.Mui-focused': { color: 'orange' }}}>Source</InputLabel>
                      <Select value={source} onChange={(e) => setSource(e.target.value)} label="Source" sx={{ ...noBorderStyle, ...focusedLabelStyle, marginTop: "2px" }}>
                        {sources.map((source) => (
                          <MenuItem key={source.id} value={source.source}>
                            {source.source}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <TextField
                      label="Complain By"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      fullWidth
                      required
                      variant="outlined"
                      margin="normal"
                      sx={{ ...noBorderStyle, ...focusedLabelStyle, marginTop: "2px" }}
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <TextField
                      label="Phone"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      fullWidth
                      required
                      variant="outlined"
                      margin="normal"
                      sx={{ ...noBorderStyle, ...focusedLabelStyle, marginTop: "2px" }}
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <TextField
                      label="Email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      fullWidth
                      required
                      variant="outlined"
                      margin="normal"
                      sx={{ ...noBorderStyle, ...focusedLabelStyle, marginTop: "2px" }}
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <TextField
                      label="Date"
                      type="date"
                      value={date}
                      onChange={(e) => setDate(e.target.value)}
                      fullWidth
                      required
                      variant="outlined"
                      margin="normal"
                      sx={{ ...noBorderStyle, ...focusedLabelStyle, marginTop: "2px" }}
                      InputLabelProps={{
                        shrink: true,
                      }}
                    />
                  </Grid>
                  <Grid item xs={12} md={12}>
                    <TextField
                      label="Description"
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      fullWidth
                      multiline
                      rows={4}
                      required
                      variant="outlined"
                      margin="normal"
                      sx={{ ...noBorderStyle, ...focusedLabelStyle, marginTop: "2px" }}
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <TextField
                      label="Action Taken"
                      value={actionTaken}
                      onChange={(e) => setActionTaken(e.target.value)}
                      fullWidth
                      required
                      variant="outlined"
                      margin="normal"
                      sx={{ ...noBorderStyle, ...focusedLabelStyle, marginTop: "2px" }}
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <TextField
                      label="Assigned"
                      value={assigned}
                      onChange={(e) => setAssigned(e.target.value)}
                      fullWidth
                      required
                      variant="outlined"
                      margin="normal"
                      sx={{ ...noBorderStyle, ...focusedLabelStyle, marginTop: "2px" }}
                    />
                  </Grid>
                  <Grid item xs={12} md={12}>
                    <TextField
                      label="Note"
                      value={note}
                      onChange={(e) => setNote(e.target.value)}
                      fullWidth
                      multiline
                      rows={4}
                      required
                      variant="outlined"
                      margin="normal"
                      sx={{ ...noBorderStyle, ...focusedLabelStyle, marginTop: "2px" }}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <Button type="submit" fullWidth variant="contained" className='complainbtn' size="large">
                      {editId ? 'Update Complaint' : 'Create Complaint'}
                    </Button>
                  </Grid>
                </Grid>
              </form>
            </Grid>
            <Grid item xs={12} md={12}>
              <Typography variant="h6" color="orange" marginBottom="40px">Complaint List <hr className='complainthr'/></Typography>
              <TableContainer className='complaincontain'>
                <Table className='complaintable'>
                  <TableHead>
                    <TableRow>
                      <TableCell>Complaint Type</TableCell>
                      <TableCell>Source</TableCell>
                      <TableCell>Name</TableCell>
                      <TableCell>Phone</TableCell>
                      <TableCell>Email</TableCell>
                      <TableCell>Date</TableCell>
                      <TableCell>Description</TableCell>
                      <TableCell>Action Taken</TableCell>
                      <TableCell>Assigned</TableCell>
                      <TableCell>Note</TableCell>
                      <TableCell>Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {complaints.map((complaint) => (
                      <TableRow key={complaint.id}>
                        <TableCell>{complaint.complaint_type}</TableCell>
                        <TableCell>{complaint.source}</TableCell>
                        <TableCell>{complaint.name}</TableCell>
                        <TableCell>{complaint.contact}</TableCell>
                        <TableCell>{complaint.email}</TableCell>
                        <TableCell>{complaint.date}</TableCell>
                        <TableCell>{complaint.description}</TableCell>
                        <TableCell>{complaint.action_taken}</TableCell>
                        <TableCell>{complaint.assigned}</TableCell>
                        <TableCell>{complaint.note}</TableCell>
                        <TableCell>
                          <IconButton onClick={() => handleEdit(complaint)}>
                            <EditIcon />
                          </IconButton>
                          <IconButton onClick={() => handleDelete(complaint.id)} style={{color:'red'}}>
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
        </Paper>
      </Box>
      <Snackbar open={openSnackbar} autoHideDuration={6000} onClose={handleCloseSnackbar}>
        <Alert onClose={handleCloseSnackbar} severity={snackbarSeverity} sx={{ width: '100%' }}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default Complaint;
