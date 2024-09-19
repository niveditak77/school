'use client';

import { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Paper, Typography, TextField, Button, Box, Grid, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, IconButton
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import { TfiEmail } from "react-icons/tfi";
import './emailtmp.css';

const EmailTemplates = () => {
  const [templates, setTemplates] = useState([]);
  const [title, setTitle] = useState('');
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetchTemplates();
  }, []);

  const fetchTemplates = async () => {
    try {
      const response = await axios.get('/api/communicate/email_templates');
      setTemplates(response.data);
    } catch (error) {
      console.error('Error fetching email templates:', error);
    }
  };

  const handleCreateTemplate = async (event) => {
    event.preventDefault();
    try {
      const response = await axios.post('/api/communicate/create_email_template', { title, message });
      setTemplates([...templates, response.data]);
      setTitle('');
      setMessage('');
    } catch (error) {
      console.error('Error creating email template:', error);
    }
  };

  const handleDeleteTemplate = async (id) => {
    try {
      await axios.delete(`/api/communicate/delete_email_template?id=${id}`);
      setTemplates(templates.filter(template => template.id !== id));
    } catch (error) {
      console.error('Error deleting email template:', error);
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
  const focusedLabelStyle = {
    '& label.Mui-focused': {
      color: 'orange', // Specify the color you want for the focused state
    }
  };
  return (
    <Box style={{ padding: '20px' }}>
      <Typography variant="h5" align="left" marginBottom="20px" fontFamily="Verdana, Geneva, Tahoma, sans-serif" gutterBottom>
      <TfiEmail  style={{ marginRight: '5px', marginLeft: '3px', verticalAlign: 'middle', color: 'orange', fontSize: '28px', marginTop: '-7px' }}/> Email Templates
      </Typography>
      <Grid container spacing={3}>
        <Grid item xs={12} md={12}>
          <Paper style={{ padding: '20px' }}>
            <form onSubmit={handleCreateTemplate}>
              <Typography variant="h6" color="orange" marginBottom="30px" gutterBottom>
                Create Template<hr className='emailtmphr'/>
              </Typography>
              <TextField
                label="Title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                fullWidth
                required
                margin="normal"
                sx={{ ...noBorderStyle, ...focusedLabelStyle ,marginTop:"10px"}}
              />
              <TextField
                label="Message"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                fullWidth
                multiline
                rows={4}
                required
                margin="normal"
                sx={{ ...noBorderStyle, ...focusedLabelStyle ,marginTop:"10px",marginBottom:"20px"}}
              />
              <Button type="submit" fullWidth variant="contained" className='emailtmpbtn' >
                Create Template
              </Button>
            </form>
          </Paper>
        </Grid>
        <Grid item xs={12} md={12}>
          <Paper style={{ padding: '20px' }}>
            <Typography variant="h6" marginBottom= "40px" color="orange" gutterBottom>
              Email Template List<hr className='emaillisthr'/>
            </Typography>
            <TableContainer className='emailtempcontain'>
              <Table className='emailtemptable'>
                <TableHead>
                  <TableRow>
                    <TableCell>Title</TableCell>
                    <TableCell>Message</TableCell>
                    <TableCell>Action</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {templates.map((template) => (
                    <TableRow key={template.id}>
                      <TableCell>{template.title}</TableCell>
                      <TableCell>{template.message}</TableCell>
                      <TableCell>
                        <IconButton
                          color="secondary"
                          onClick={() => handleDeleteTemplate(template.id)}
                          style={{ color: '#d32f2f' }}
                        >
                          <DeleteIcon />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default EmailTemplates;
