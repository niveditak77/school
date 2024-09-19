"use client"
import { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Paper, Typography, TextField, Button, Checkbox, FormControlLabel, Box, Grid, MenuItem, FormGroup, Container, Tabs, Tab, Divider
} from '@mui/material';
import { useRouter } from 'next/navigation';
import { DropzoneArea } from 'mui-file-dropzone';
import { HiOutlineMailOpen } from "react-icons/hi";
import './sendemail.css';

const SendEmail = () => {
  const router = useRouter();
  const [emailTemplate, setEmailTemplate] = useState('');
  const [emailTemplates, setEmailTemplates] = useState([]);
  const [title, setTitle] = useState('');
  const [attachment, setAttachment] = useState([]);
  const [message, setMessage] = useState('');
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
    const fetchEmailTemplates = async () => {
      try {
        const response = await axios.get('/api/communicate/email_templates');
        setEmailTemplates(response.data);
      } catch (error) {
        console.error('Error fetching email templates:', error);
      }
    };

    fetchEmailTemplates();
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();
    const formData = new FormData();
    formData.append('emailTemplate', emailTemplate);
    formData.append('title', title);
    formData.append('message', message);
    attachment.forEach(file => {
      formData.append('attachment', file);
    });
    formData.append('recipients', JSON.stringify(Object.keys(recipients).filter(key => recipients[key])));

    try {
      await axios.post('/api/communicate/send_email', formData);
      alert('Email sent successfully!');
      router.push('/dashboard');
    } catch (error) {
      console.error('Error sending email:', error);
      alert('Failed to send email.');
    }
  };

  const handleRecipientChange = (event) => {
    setRecipients({
      ...recipients,
      [event.target.name]: event.target.checked,
    });
  };

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
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
    <Container maxWidth="lg"> {/* Adjusted to lg for wider width */}
      <Box mt={2} mb={2}>
        <Typography variant="h5" align="left" marginBottom="25px" marginTop="30px" fontFamily="Verdana, Geneva, Tahoma, sans-serif" gutterBottom>
          <HiOutlineMailOpen style={{ marginRight: '6px', verticalAlign: 'middle', color: 'orange', fontSize: '34px', marginTop: '-7px' }} /> Send Email
        </Typography>
        <Paper elevation={3} style={{ padding: '32px', borderRadius: '8px', width: '93.5%' }}> {/* Adjusted padding and width */}
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
                  label="Email Template"
                  value={emailTemplate}
                  onChange={(e) => setEmailTemplate(e.target.value)}
                  fullWidth
                  variant="outlined"
                  margin="normal"
                  sx={{ ...noBorderStyle, ...focusedLabelStyle, marginTop: "2px" }}
                >
                  <MenuItem value=""><em>Select</em></MenuItem>
                  {emailTemplates.map(template => (
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
                  margin="normal"
                  sx={{ ...noBorderStyle, ...focusedLabelStyle, marginTop: "2px" }}
                />
              </Grid>
              <Grid item xs={12}>
                <DropzoneArea
                  filesLimit={1}
                  acceptedFiles={['image/*', 'application/*']}
                  dropzoneText="Drag and drop a file here or click"
                  onChange={(files) => setAttachment(files)}
                  showPreviewsInDropzone={false}
                  showFileNamesInPreview={true}
                  dropzoneClass="custom-dropzone"
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
                  sx={{ ...noBorderStyle, ...focusedLabelStyle, marginTop: "2px" }}
                />
              </Grid>
              <Grid item xs={12}>
                <Typography variant="h6" style={{ marginBottom: '35px',marginLeft:'2px',color:'orange' }}>Message To<hr className='emailsndhr'/></Typography>
                <FormGroup>
                  <Grid container spacing={2}> {/* Increased spacing between columns */}
                    {Object.keys(recipients).map((recipient) => (
                      <Grid item xs={12} sm={4} key={recipient}> {/* Adjusted to sm={4} for three columns */}
                        <FormControlLabel
                          control={
                            <Checkbox
                              checked={recipients[recipient]}
                              onChange={handleRecipientChange}
                              name={recipient}
                              color="primary"
                         
                             sx={{ '&.Mui-checked': {
                              color: 'orange',
                            
                            },}}
                            />
                          }
                          label={recipient}
                          sx={{ marginLeft: '-9px' }} // Space between checkbox and label
                        />
                      </Grid>
                    ))}
                  </Grid>
                </FormGroup>
              </Grid>
            </Grid>
            <Grid container spacing={2} style={{ marginTop: '16px' }}>
              <Grid item xs={12}>
                <Button type="submit" fullWidth variant="contained" className='sendemailbtn' size="large">
                  Send Email
                </Button>
              </Grid>
            </Grid>
          </form>
        </Paper>
      </Box>
    </Container>
  );
};

export default SendEmail;
