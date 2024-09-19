'use client';

import { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Paper, Typography, TextField, Button, Checkbox, FormControlLabel, Box, Grid, MenuItem, FormGroup, Container, Divider, Tabs, Tab
} from '@mui/material';
import { useRouter } from 'next/navigation';

const SendSMS = () => {
  const router = useRouter();
  const [smsTemplate, setSmsTemplate] = useState('');
  const [smsTemplates, setSmsTemplates] = useState([]);
  const [title, setTitle] = useState('');
  const [message, setMessage] = useState('');
  const [sendThrough, setSendThrough] = useState({
    SMS: false,
    MobileApp: false,
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
  const [tabValue, setTabValue] = useState(0);

  useEffect(() => {
    const fetchSmsTemplates = async () => {
      try {
        const response = await axios.get('/api/communicate/sms_templates');
        setSmsTemplates(response.data);
      } catch (error) {
        console.error('Error fetching SMS templates:', error);
      }
    };

    fetchSmsTemplates();
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();
    const formData = new FormData();
    formData.append('smsTemplate', smsTemplate);
    formData.append('title', title);
    formData.append('message', message);
    formData.append('sendThrough', JSON.stringify(Object.keys(sendThrough).filter(key => sendThrough[key])));
    formData.append('recipients', JSON.stringify(Object.keys(recipients).filter(key => recipients[key])));

    try {
      await axios.post('/api/communicate/send_sms', formData);
      alert('SMS sent successfully!');
      router.push('/dashboard');
    } catch (error) {
      console.error('Error sending SMS:', error);
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

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  return (
    <Container maxWidth="md">
      <Box mt={2} mb={2}>
        <Typography variant="h4" align="center" gutterBottom>
          Send SMS
        </Typography>
        <Paper elevation={3} style={{ padding: '16px', borderRadius: '8px' }}>
          <Tabs
            value={tabValue}
            onChange={handleTabChange}
            indicatorColor="primary"
            textColor="primary"
            variant="fullWidth"
            centered
          >
            <Tab label="Group" />
            <Tab label="Individual" />
            <Tab label="Class" />
            <Tab label="Today's Birthday" />
          </Tabs>
          <Divider />
          <form onSubmit={handleSubmit}>
            <Grid container spacing={2} style={{ marginTop: '16px' }}>
              <Grid item xs={12} sm={6}>
                <TextField
                  select
                  label="SMS Template"
                  value={smsTemplate}
                  onChange={(e) => setSmsTemplate(e.target.value)}
                  fullWidth
                  variant="outlined"
                  margin="normal"
                >
                  <MenuItem value=""><em>Select</em></MenuItem>
                  {smsTemplates.map(template => (
                    <MenuItem key={template.id} value={template.id}>
                      {template.title}
                    </MenuItem>
                  ))}
                </TextField>
                <TextField
                  label="Title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  fullWidth
                  required
                  variant="outlined"
                  margin="normal"
                />
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
                />
                <Typography variant="h6" style={{ marginTop: '16px' }}>Send Through</Typography>
                <FormGroup>
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={sendThrough.SMS}
                        onChange={handleSendThroughChange}
                        name="SMS"
                        color="primary"
                      />
                    }
                    label="SMS"
                  />
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={sendThrough.MobileApp}
                        onChange={handleSendThroughChange}
                        name="MobileApp"
                        color="primary"
                      />
                    }
                    label="Mobile App"
                  />
                </FormGroup>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="h6" style={{ marginBottom: '8px' }}>Message To</Typography>
                <FormGroup>
                  <Grid container spacing={1}>
                    {Object.keys(recipients).map((recipient) => (
                      <Grid item xs={12} sm={6} md={4} key={recipient}>
                        <FormControlLabel
                          control={
                            <Checkbox
                              checked={recipients[recipient]}
                              onChange={handleRecipientChange}
                              name={recipient}
                              color="primary"
                            />
                          }
                          label={recipient}
                        />
                      </Grid>
                    ))}
                  </Grid>
                </FormGroup>
              </Grid>
            </Grid>
            <Grid container spacing={2} style={{ marginTop: '16px' }}>
              <Grid item xs={12}>
                <Button type="submit" fullWidth variant="contained" color="primary" size="large">
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
