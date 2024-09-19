'use client';

import { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Container, Paper, Grid, TextField, Button, Typography, Box, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, IconButton, Alert
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import VisibilityIcon from '@mui/icons-material/Visibility';
import LinkIcon from '@mui/icons-material/Link';
import { PiUploadFill } from "react-icons/pi";
import './upload.css';

const UploadContents = () => {
  const [contents, setContents] = useState([]);
  const [sendTo, setSendTo] = useState('');
  const [title, setTitle] = useState('');
  const [shareDate, setShareDate] = useState('');
  const [validUpto, setValidUpto] = useState('');
  const [description, setDescription] = useState('');
  const [createdBy, setCreatedBy] = useState(''); // This should be an integer value
  const [error, setError] = useState('');

  const fetchContents = async () => {
    try {
      const response = await axios.get('/api/download_center/upload_contents');
      setContents(response.data);
    } catch (error) {
      console.error('Error fetching contents:', error);
      setError('Error fetching contents');
    }
  };

  useEffect(() => {
    fetchContents();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      await axios.post('/api/download_center/upload_contents', { send_to: sendTo, title, share_date: shareDate, valid_upto: validUpto, description, created_by: parseInt(createdBy) });
      setSendTo('');
      setTitle('');
      setShareDate('');
      setValidUpto('');
      setDescription('');
      setCreatedBy('');
      fetchContents();
    } catch (error) {
      console.error('Error sharing content:', error);
      setError(`Error sharing content: ${error.response.data?.error || 'Unknown error'}`);
    }
  };

  const handleDelete = async (id) => {
    setError('');
    try {
      await axios.delete(`/api/download_center/upload_contents`, { params: { id } });
      fetchContents();
    } catch (error) {
      console.error('Error deleting content:', error);
      setError(`Error deleting content: ${error.response.data?.error || 'Unknown error'}`);
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
            <Typography variant="h5" align="left" marginBottom="10px" fontFamily="Verdana, Geneva, Tahoma, sans-serif" gutterBottom>
          <PiUploadFill style={{ marginRight: '7px', verticalAlign: 'middle', color: 'orange', fontSize: '30px', marginTop: '-5px' }} />
          Upload Contents
        </Typography>
              <form onSubmit={handleSubmit}>
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      label="Send To"
                      name="send_to"
                      value={sendTo}
                      onChange={(e) => setSendTo(e.target.value)}
                      fullWidth
                      required
                      variant="outlined"
                      margin="normal"
                      sx={{ ...noBorderStyle, ...focusedLabelStyle }}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      label="Title"
                      name="title"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      fullWidth
                      required
                      variant="outlined"
                      margin="normal"
                      sx={{ ...noBorderStyle, ...focusedLabelStyle }}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      label="Share Date"
                      name="share_date"
                      type="date"
                      value={shareDate}
                      onChange={(e) => setShareDate(e.target.value)}
                      fullWidth
                      required
                      variant="outlined"
                      // margin="normal"
                      sx={{ ...noBorderStyle, ...focusedLabelStyle }}
                      InputLabelProps={{
                        shrink: true,
                      }}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      label="Valid Upto"
                      name="valid_upto"
                      type="date"
                      value={validUpto}
                      onChange={(e) => setValidUpto(e.target.value)}
                      fullWidth
                      required
                      variant="outlined"
                 
                      sx={{ ...noBorderStyle, ...focusedLabelStyle ,}}
                      InputLabelProps={{
                        shrink: true,
                      }}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      label="Description"
                      name="description"
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      fullWidth
                      required
                      variant="outlined"
                      // margin="normal"
                      sx={{ ...noBorderStyle, ...focusedLabelStyle }}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      label="Created By (ID)"
                      name="created_by"
                      type="number"
                      value={createdBy}
                      onChange={(e) => setCreatedBy(e.target.value)}
                      fullWidth
                      required
                      variant="outlined"
                   
                      sx={{ ...noBorderStyle, ...focusedLabelStyle }}
                    />
                  </Grid>
                </Grid>
                <Button type="submit" fullWidth variant="contained" className='uploadbtn'>
                  Save
                </Button>
              </form>
              <Grid item xs={12} md={12}>
            <TableContainer component={Paper} className='uploadcontainer'>
              <Table className='uploadtable'>
                <TableHead>
                  <TableRow>
                    <TableCell>Title</TableCell>
                    <TableCell>Send To</TableCell>
                    <TableCell>Share Date</TableCell>
                    <TableCell>Valid Upto</TableCell>
                    <TableCell>Shared By</TableCell>
                    <TableCell>Description</TableCell>
                    <TableCell>Action</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {contents.map((content) => (
                    <TableRow key={content.id}>
                      <TableCell>{content.title}</TableCell>
                      <TableCell>{content.send_to}</TableCell>
                      <TableCell>{content.share_date}</TableCell>
                      <TableCell>{content.valid_upto}</TableCell>
                      <TableCell>{content.created_by}</TableCell>
                      <TableCell>{content.description}</TableCell>
                      <TableCell>
                        <IconButton onClick={() => console.log('View content', content.id)} style={{color: 'gray'}}>
                          <VisibilityIcon />
                        </IconButton>
                        <IconButton onClick={() => console.log('Share content', content.id)} style={{color:'rgb(142, 213, 236)'}}>
                          <LinkIcon />
                        </IconButton>
                        <IconButton onClick={() => handleDelete(content.id)} style={{color:'red'}}>
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

export default UploadContents;
