'use client';

import { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Paper, Typography, TextField, Button, Box, Grid, Container, Divider, IconButton
} from '@mui/material';
import { Edit, Delete } from '@mui/icons-material';
import { RiMessage3Fill } from "react-icons/ri";
import './smstemplet.css';

const SMSTemplate = () => {
  const [title, setTitle] = useState('');
  const [message, setMessage] = useState('');
  const [smsTemplates, setSmsTemplates] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [currentId, setCurrentId] = useState(null);

  useEffect(() => {
    const fetchSmsTemplates = async () => {
      const response = await axios.get('/api/communicate/sms_templates');
      setSmsTemplates(response.data);
    };

    fetchSmsTemplates();
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (isEditing) {
      await axios.put('/api/communicate/sms_templates', { id: currentId, title, message });
      setSmsTemplates(smsTemplates.map(template => template.id === currentId ? { ...template, title, message } : template));
      setIsEditing(false);
      setCurrentId(null);
    } else {
      const response = await axios.post('/api/communicate/sms_templates', { title, message });
      setSmsTemplates([...smsTemplates, response.data]);
    }
    setTitle('');
    setMessage('');
  };

  const handleEdit = (template) => {
    setTitle(template.title);
    setMessage(template.message);
    setCurrentId(template.id);
    setIsEditing(true);
  };

  const handleDelete = async (id) => {
    await axios.delete(`/api/communicate/sms_templates?id=${id}`);
    setSmsTemplates(smsTemplates.filter(template => template.id !== id));
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
    <Container maxWidth="lg" style={{ padding: '20px' }}>
      <Box mt={2} mb={2}>
        <Typography variant="h5" align="left" marginBottom="20px" fontFamily="Verdana, Geneva, Tahoma, sans-serif" gutterBottom>
        <RiMessage3Fill style={{ marginRight: '7px', marginLeft: '3px', verticalAlign: 'middle', color: 'orange', fontSize: '32px', marginTop: '-12px' }}/>SMS Templates
        </Typography>
        <Grid container spacing={4}>
          <Grid item xs={12} md={12}>
            <Paper elevation={3} style={{ padding: '16px', borderRadius: '8px' }}>
              <form onSubmit={handleSubmit}>
                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <TextField
                      label="Title"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      fullWidth
                      required
                      variant="outlined"
                      margin="normal"
                      sx={{ ...noBorderStyle, ...focusedLabelStyle ,marginTop:"10px"}}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      label="Message"
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      fullWidth
                      multiline
                      rows={4}
                      required
                      variant="outlined"
                      margin="normal"
                      sx={{ ...noBorderStyle, ...focusedLabelStyle ,marginTop:"2px"}}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <Button type="submit" fullWidth variant="contained" className='smstmpbtn' size="large">
                      {isEditing ? 'Update Template' : 'Create Template'}
                    </Button>
                  </Grid>
                </Grid>
              </form>
            </Paper>
          </Grid>
          <Grid item xs={12} md={12}>
            <Paper elevation={3} style={{ padding: '16px', borderRadius: '8px' }}>
              <Typography variant="h6" color="orange" marginBottom="40px" marginTop="10px">Existing Templates<hr className='existinghr'/></Typography>
             
              <Grid container spacing={3}>
  {smsTemplates.map((template) => (
    <Grid item xs={12} key={template.id}>
      <Paper
        elevation={3}
        style={{
          padding: '10px',
          borderRadius: '12px',
          display: 'flex',
          backgroundColor:'#f4f4f5',
          justifyContent: 'space-between',
          alignItems: 'center',
          cursor:'pointer',
          transition: 'transform 0.3s, box-shadow 0.3s',
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = 'scale(1.012)';
          e.currentTarget.style.boxShadow = '0px 4px 20px rgba(0, 0, 0, 0.1)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = 'scale(1)';
          e.currentTarget.style.boxShadow = '0px 2px 10px rgba(0, 0, 0, 0.05)';
        }}
      >
        <Box>
          <Typography variant="h6" style={{ fontWeight: '600', color: 'grey' }}>
            {template.title}
          </Typography>
          <Typography style={{ color: '#555', marginTop: '4px' }}>
            {template.message}
          </Typography>
        </Box>
        <Box>
          <IconButton onClick={() => handleEdit(template)} style={{ color: 'grey' }}>
            <Edit />
          </IconButton>
          <IconButton onClick={() => handleDelete(template.id)} style={{ color: '#d32f2f' }}>
            <Delete />
          </IconButton>
        </Box>
      </Paper>
    </Grid>
  ))}
</Grid>

            </Paper>
          </Grid>
        </Grid>
      </Box>
    </Container>
  );
};

export default SMSTemplate;
