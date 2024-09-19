
"use client"
import { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Paper, Typography, TextField, Button, Box, Grid, FormControlLabel, Checkbox, MenuItem, Container
} from '@mui/material';
import { TbDeviceMobileMessage } from "react-icons/tb";
import './sendsms.css';

const SendSMS = () => {
  const [smsTemplates, setSmsTemplates] = useState([]);
  const [selectedTemplate, setSelectedTemplate] = useState('');
  const [title, setTitle] = useState('');
  const [message, setMessage] = useState('');
  const [sendThrough, setSendThrough] = useState({
    SMS: false,
    'Mobile App': false,
  });

  const [recipients, setRecipients] = useState({
    Students: false,
    Guardians: false,
    Admin: false,
    Teacher: false,
    Accountant: false,
    Librarian: false,
    Receptionist: false,
    'Super Admin': false,
  });

  useEffect(() => {
    const fetchSmsTemplates = async () => {
      const response = await axios.get('/api/communicate/sms_templates');
      setSmsTemplates(response.data);
    };

    fetchSmsTemplates();
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();
    const selectedRecipients = Object.keys(recipients).filter(key => recipients[key]);
    const selectedSendThrough = Object.keys(sendThrough).filter(key => sendThrough[key]);
    
    const data = {
      templateId: selectedTemplate,
      title,
      message,
      sendThrough: selectedSendThrough,
      recipients: selectedRecipients
    };

    try {
      await axios.post('/api/communicate/send_sms', data);
      alert('SMS sent successfully!');
    } catch {
      alert('Failed to send SMS.');
    }
  };

  const handleRecipientChange = (event) => {
    setRecipients({
      ...recipients,
      [event.target.name]: event.target.checked,
    });
  };

  const handleSendThroughChange = (event) => {
    setSendThrough({
      ...sendThrough,
      [event.target.name]: event.target.checked,
    });
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

  const textFieldStyle = {
    backgroundColor: '#f4f4f5',
    borderRadius: '20px',
    '& .MuiOutlinedInput-root': {
      '& fieldset': {
        borderColor: 'transparent', // Initial border color
      },
      '&:hover fieldset': {
        borderColor: 'transparent', // Hover border color
      },
      '&.Mui-focused fieldset': {
        borderColor: 'transparent', // Focused border color
      },
      '& input': {
        color: '#f4f4f5', // Text color inside the input
      },
    },
  };

  return (
    <Container maxWidth="lg" style={{ padding: '20px 40px' }}>
      <Box mt={4} mb={4}>
        <Paper elevation={3} style={{ padding: '30px 40px', borderRadius: '8px', marginTop: '-20px' }}>
          <Typography variant="h5" align="left" marginBottom="25px" marginTop="1px" fontFamily="Verdana, Geneva, Tahoma, sans-serif" gutterBottom>
            <TbDeviceMobileMessage style={{ marginRight: '6px', verticalAlign: 'middle', color: 'orange', fontSize: '34px', marginTop: '-7px' }} />Send SMS
          </Typography>
          <form onSubmit={handleSubmit}>
            <Grid container spacing={4}>
              <Grid item xs={12} sm={6}>
                <TextField
                  select
                  label="SMS Template"
                  value={selectedTemplate}
                  onChange={(e) => setSelectedTemplate(e.target.value)}
                  fullWidth
                  variant="outlined"
                  sx={{ ...noBorderStyle, ...focusedLabelStyle, marginTop: "2px" }}
                >
                  <MenuItem value=""><em>Select</em></MenuItem>
                  {smsTemplates.map(template => (
                    <MenuItem key={template.id} value={template.id}>
                      {template.title}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  fullWidth
                  required
                  variant="outlined"
                  sx={{ ...textFieldStyle, ...focusedLabelStyle,marginTop: "2px" }} // Apply the custom style here
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  label="Template ID (This field is required Only For Indian SMS Gateway)"
                  fullWidth
                  variant="outlined"
                  sx={{ ...noBorderStyle, ...focusedLabelStyle, marginTop: "2px" }}
                />
              </Grid>
              <Grid item xs={12}>
                <Typography variant="h6" marginLeft='4px' color="orange" marginBottom="25px">Send Through <hr className='sendsmshr' /></Typography>
                <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={sendThrough.SMS}
                        onChange={handleSendThroughChange}
                        name="SMS"
                        sx={{
                          color: 'grey',
                          '&.Mui-checked': {
                            color: 'orange',
                          },
                        }}
                      />
                    }
                    label="SMS"
                    sx={{ marginLeft: '-5px' }} // Align to the left
                  />
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={sendThrough['Mobile App']}
                        onChange={handleSendThroughChange}
                        name="Mobile App"
                        sx={{
                          color: 'grey',
                          '&.Mui-checked': {
                            color: 'orange',
                          },
                        }}
                      />
                    }
                    label="Mobile App"
                    sx={{ marginLeft: '-5px' }} // Align to the left
                  />
                </Box>
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
                  sx={{ ...noBorderStyle, ...focusedLabelStyle, marginTop: "2px" }}
                />
              </Grid>
              <Grid item xs={12}>
                <Typography variant="h6" color="orange" marginBottom="30px">Message To<hr className='sendsmshr2' /></Typography>
                <Grid container spacing={1}>
                  {Object.keys(recipients).map((recipient) => (
                    <Grid item xs={12} sm={6} md={4} key={recipient}>
                      <FormControlLabel
                        control={
                          <Checkbox
                            checked={recipients[recipient]}
                            onChange={handleRecipientChange}
                            name={recipient}
                            sx={{
                              color: 'grey',
                              '&.Mui-checked': {
                                color: 'orange',
                              },
                            }}
                          />
                        }
                        label={recipient}
                      />
                    </Grid>
                  ))}
                </Grid>
              </Grid>
              <Grid item xs={12}>
                <Button type="submit" fullWidth variant="contained" className='sendsmsbtn' size="large">
                  Send SMS
                </Button>
              </Grid>
            </Grid>
          </form>
        </Paper>
      </Box>
    </Container>
  );
};

export default SendSMS;
