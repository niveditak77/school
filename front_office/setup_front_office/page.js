'use client';

import { useState, useEffect } from 'react';
import axios from 'axios';
import { Paper, Typography, TextField, Button, Box, Grid, Container, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, IconButton, Tabs, Tab } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import { FaSchoolFlag } from "react-icons/fa6";
import './setup.css';

const SetupFrontOffice = () => {
  const [tabValue, setTabValue] = useState(0);

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const noBorderStyle = {
    backgroundColor: '#f0f0f0',
    borderRadius: '20px',
    border: 'none',
    '& .MuiOutlinedInput-notchedOutline': {
      border: 'none',
    },
    '&:hover .MuiOutlinedInput-notchedOutline': {
      border: 'none',
    },
    '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
      border: 'none',
      boxShadow: 'none',
    },
  };

  const focusedLabelStyle = {
    '& label.Mui-focused': {
      color: 'orange',
    },
  };

  return (
    <Container maxWidth="lg">
      <Box mt={4} mb={4}>
        <Typography variant="h5" align="left" marginBottom="30px" fontFamily="Verdana, Geneva, Tahoma, sans-serif" gutterBottom>
          <FaSchoolFlag style={{ marginRight: '7px', marginLeft: '3px', verticalAlign: 'middle', color: 'orange', fontSize: '30px', marginTop: '-10px' }} /> Setup Front Office
        </Typography>
        <Paper elevation={3} style={{ padding: '16px', borderRadius: '8px' }}>
        <Tabs 
  value={tabValue} 
  onChange={handleTabChange} 
  centered 
  sx={{
    '& .MuiTabs-indicator': {
      display: 'none', // Hide the default indicator
    },
    '& .MuiTab-root': {
      textTransform: 'none',
      margin: '0 10px',
      fontSize: '16px',
      color: '#555', // Text color when not selected
      padding: '12px 16px',
      borderBottom: '2px solid transparent',
      transition: 'all 0.3s ease',
    },
    '& .Mui-selected': {
      color: 'orange !important', // Text color when selected
      borderBottom: '2px solid #44b8ab', // Border bottom when selected
    },
    '& .MuiTab-root:not(.Mui-selected):hover': {
      borderBottom: '2px solid #44b8ab',
      transform: 'scale(1.05)',
    }
  }}
>
  <Tab label="Purpose" />
  <Tab label="Complaint Type" />
  <Tab label="Source" />
  <Tab label="Reference" />
</Tabs>


          <Box mt={3}>
            {tabValue === 0 && <Purpose noBorderStyle={noBorderStyle} focusedLabelStyle={focusedLabelStyle} />}
            {tabValue === 1 && <ComplaintType noBorderStyle={noBorderStyle} focusedLabelStyle={focusedLabelStyle} />}
            {tabValue === 2 && <Source noBorderStyle={noBorderStyle} focusedLabelStyle={focusedLabelStyle} />}
            {tabValue === 3 && <Reference noBorderStyle={noBorderStyle} focusedLabelStyle={focusedLabelStyle} />}
          </Box>
        </Paper>
      </Box>
    </Container>
  );
};

const Purpose = ({ noBorderStyle, focusedLabelStyle }) => {
  const [purposes, setPurposes] = useState([]);
  const [purpose, setPurpose] = useState('');
  const [description, setDescription] = useState('');
  const [editId, setEditId] = useState(null);

  useEffect(() => {
    fetchPurposes();
  }, []);

  const fetchPurposes = async () => {
    const response = await axios.get('/api/frontoffice/purpose');
    setPurposes(response.data);
  };

  const handleCreateOrUpdatePurpose = async (event) => {
    event.preventDefault();
    if (editId) {
      await axios.put('/api/frontoffice/purpose', { id: editId, purpose, description });
    } else {
      await axios.post('/api/frontoffice/purpose', { purpose, description });
    }
    setPurpose('');
    setDescription('');
    setEditId(null);
    fetchPurposes();
  };

  const handleEdit = (purpose) => {
    setEditId(purpose.id);
    setPurpose(purpose.purpose);
    setDescription(purpose.description);
  };

  const handleDelete = async (id) => {
    await axios.delete('/api/frontoffice/purpose', { data: { id } });
    fetchPurposes();
  };

  return (
    <Grid container spacing={2}>
      <Grid item xs={12}>
        <Typography variant="h6" color="orange" marginLeft="5px" marginTop="20px" marginBottom="30px">Add Purpose<hr className='setuphr' /></Typography>
        <form onSubmit={handleCreateOrUpdatePurpose}>
          <TextField
            label="Purpose"
            value={purpose}
            onChange={(e) => setPurpose(e.target.value)}
            fullWidth
            required
            margin="normal"
            sx={{ ...noBorderStyle, ...focusedLabelStyle, marginTop: "2px" }}
          />
          <TextField
            label="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            fullWidth
            multiline
            rows={4}
            required
            margin="normal"
            sx={{ ...noBorderStyle, ...focusedLabelStyle, marginTop: "2px" }}
          />
          <Button type="submit" fullWidth variant="contained" className='setupbtn'>
            Save
          </Button>
        </form>
      </Grid>
      <Grid item xs={12}>
        <Typography variant="h6" color="orange" marginBottom="30px">Purpose List<hr className='setup2hr' /></Typography>
        <TableContainer className='setupcontainer'>
          <Table className='setuptable'>
            <TableHead>
              <TableRow>
                <TableCell>Purpose</TableCell>
                <TableCell>Description</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {purposes.map((purpose) => (
                <TableRow key={purpose.id}>
                  <TableCell>{purpose.purpose}</TableCell>
                  <TableCell>{purpose.description}</TableCell>
                  <TableCell>
                    <IconButton onClick={() => handleEdit(purpose)}>
                      <EditIcon />
                    </IconButton>
                    <IconButton onClick={() => handleDelete(purpose.id)} style={{ color: 'red' }}>
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
  );
};

const ComplaintType = ({ noBorderStyle, focusedLabelStyle }) => {
  const [complaintTypes, setComplaintTypes] = useState([]);
  const [complaintType, setComplaintType] = useState('');
  const [description, setDescription] = useState('');
  const [editId, setEditId] = useState(null);

  useEffect(() => {
    fetchComplaintTypes();
  }, []);

  const fetchComplaintTypes = async () => {
    const response = await axios.get('/api/frontoffice/complaint_type');
    setComplaintTypes(response.data);
  };

  const handleCreateOrUpdateComplaintType = async (event) => {
    event.preventDefault();
    if (editId) {
      await axios.put('/api/frontoffice/complaint_type', { id: editId, complaint_type: complaintType, description });
    } else {
      await axios.post('/api/frontoffice/complaint_type', { complaint_type: complaintType, description });
    }
    setComplaintType('');
    setDescription('');
    setEditId(null);
    fetchComplaintTypes();
  };

  const handleEdit = (complaint) => {
    setEditId(complaint.id);
    setComplaintType(complaint.complaint_type);
    setDescription(complaint.description);
  };

  const handleDelete = async (id) => {
    await axios.delete('/api/frontoffice/complaint_type', { data: { id } });
    fetchComplaintTypes();
  };

  return (
    <Grid container spacing={2}>
      <Grid item xs={12}>
        <Typography variant="h6" color="orange" marginLeft="5px" marginTop="20px" marginBottom="30px">Add Complaint Type<hr className='addcomplainthr' /></Typography>
        <form onSubmit={handleCreateOrUpdateComplaintType}>
          <TextField
            label="Complaint Type"
            value={complaintType}
            onChange={(e) => setComplaintType(e.target.value)}
            fullWidth
            required
            margin="normal"
            sx={{ ...noBorderStyle, ...focusedLabelStyle, marginTop: "2px" }}
          />
          <TextField
            label="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            fullWidth
            multiline
            rows={4}
            required
            margin="normal"
            sx={{ ...noBorderStyle, ...focusedLabelStyle, marginTop: "2px" }}
          />
          <Button type="submit" fullWidth variant="contained" className='addcomplaintsetupbtn'>
            Save
          </Button>
        </form>
      </Grid>
      <Grid item xs={12}>
        <Typography variant="h6" color="orange" marginBottom="35px">Complaint Type List <hr className='compalainytype2' /></Typography>
        <TableContainer className='complainttypecontainer'>
          <Table className='complaintlisttable'>
            <TableHead>
              <TableRow>
                <TableCell>Complaint Type</TableCell>
                <TableCell>Description</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {complaintTypes.map((complaint) => (
                <TableRow key={complaint.id}>
                  <TableCell>{complaint.complaint_type}</TableCell>
                  <TableCell>{complaint.description}</TableCell>
                  <TableCell>
                    <IconButton onClick={() => handleEdit(complaint)}>
                      <EditIcon />
                    </IconButton>
                    <IconButton onClick={() => handleDelete(complaint.id)} style={{ color: 'red' }}>
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
  );
};

const Source = ({ noBorderStyle, focusedLabelStyle }) => {
  const [sources, setSources] = useState([]);
  const [source, setSource] = useState('');
  const [description, setDescription] = useState('');
  const [editId, setEditId] = useState(null);

  useEffect(() => {
    fetchSources();
  }, []);

  const fetchSources = async () => {
    const response = await axios.get('/api/frontoffice/source');
    setSources(response.data);
  };

  const handleCreateOrUpdateSource = async (event) => {
    event.preventDefault();
    if (editId) {
      await axios.put('/api/frontoffice/source', { id: editId, source, description });
    } else {
      await axios.post('/api/frontoffice/source', { source, description });
    }
    setSource('');
    setDescription('');
    setEditId(null);
    fetchSources();
  };

  const handleEdit = (source) => {
    setEditId(source.id);
    setSource(source.source);
    setDescription(source.description);
  };

  const handleDelete = async (id) => {
    await axios.delete('/api/frontoffice/source', { data: { id } });
    fetchSources();
  };

  return (
    <Grid container spacing={2}>
      <Grid item xs={12}>
        <Typography variant="h6" color="orange" marginLeft="5px" marginTop="20px" marginBottom="30px">Add Source<hr className='sourcehr' /></Typography>
        <form onSubmit={handleCreateOrUpdateSource}>
          <TextField
            label="Source"
            value={source}
            onChange={(e) => setSource(e.target.value)}
            fullWidth
            required
            margin="normal"
            sx={{ ...noBorderStyle, ...focusedLabelStyle, marginTop: "2px" }}
          />
          <TextField
            label="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            fullWidth
            multiline
            rows={4}
            required
            margin="normal"
            sx={{ ...noBorderStyle, ...focusedLabelStyle, marginTop: "2px" }}
          />
          <Button type="submit" fullWidth variant="contained" className='setupbutton2'>
            Save
          </Button>
        </form>
      </Grid>
      <Grid item xs={12}>
        <Typography variant="h6" color="orange" className='sourcebtn9' marginBottom = "40px">Source List<hr className='sourcelist10hr'/></Typography>
        <TableContainer className='sourcecontainer'>
          <Table className='sourcetable'>
            <TableHead>
              <TableRow>
                <TableCell>Source</TableCell>
                <TableCell>Description</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {sources.map((source) => (
                <TableRow key={source.id}>
                  <TableCell>{source.source}</TableCell>
                  <TableCell>{source.description}</TableCell>
                  <TableCell>
                    <IconButton onClick={() => handleEdit(source)}>
                      <EditIcon />
                    </IconButton>
                    <IconButton onClick={() => handleDelete(source.id)} style={{ color: 'red' }}>
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
  );
};

const Reference = ({ noBorderStyle, focusedLabelStyle }) => {
  const [references, setReferences] = useState([]);
  const [reference, setReference] = useState('');
  const [description, setDescription] = useState('');
  const [editId, setEditId] = useState(null);

  useEffect(() => {
    fetchReferences();
  }, []);

  const fetchReferences = async () => {
    const response = await axios.get('/api/frontoffice/reference');
    setReferences(response.data);
  };

  const handleCreateOrUpdateReference = async (event) => {
    event.preventDefault();
    if (editId) {
      await axios.put('/api/frontoffice/reference', { id: editId, reference, description });
    } else {
      await axios.post('/api/frontoffice/reference', { reference, description });
    }
    setReference('');
    setDescription('');
    setEditId(null);
    fetchReferences();
  };

  const handleEdit = (reference) => {
    setEditId(reference.id);
    setReference(reference.reference);
    setDescription(reference.description);
  };

  const handleDelete = async (id) => {
    await axios.delete('/api/frontoffice/reference', { data: { id } });
    fetchReferences();
  };

  return (
    <Grid container spacing={2}>
      <Grid item xs={12}>
        <Typography variant="h6" color="orange" marginLeft="5px" marginTop="20px" marginBottom="30px">Add Reference<hr className='referencehr' /></Typography>
        <form onSubmit={handleCreateOrUpdateReference}>
          <TextField
            label="Reference"
            value={reference}
            onChange={(e) => setReference(e.target.value)}
            fullWidth
            required
            margin="normal"
            sx={{ ...noBorderStyle, ...focusedLabelStyle, marginTop: "2px" }}
          />
          <TextField
            label="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            fullWidth
            multiline
            rows={4}
            required
            margin="normal"
            sx={{ ...noBorderStyle, ...focusedLabelStyle, marginTop: "2px" }}
          />
          <Button type="submit" fullWidth variant="contained" className='referencebtn'>
            Save
          </Button>
        </form>
      </Grid>
      <Grid item xs={12}>
        <Typography variant="h6" color="orange" marginBottom="40px">Reference List<hr className='setuphrlist'/></Typography>
        <TableContainer className='referencecontainer'>
          <Table className='referencetable'>
            <TableHead>
              <TableRow>
                <TableCell>Reference</TableCell>
                <TableCell>Description</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {references.map((reference) => (
                <TableRow key={reference.id}>
                  <TableCell>{reference.reference}</TableCell>
                  <TableCell>{reference.description}</TableCell>
                  <TableCell>
                    <IconButton onClick={() => handleEdit(reference)}>
                      <EditIcon />
                    </IconButton>
                    <IconButton onClick={() => handleDelete(reference.id)} style={{ color: 'red' }}>
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
  );
};

export default SetupFrontOffice;
