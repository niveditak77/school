'use client';

import { useEffect, useState } from 'react';
import {
  Box,
  Button,
  TextField,
  Typography,
  Switch,
  Grid,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  InputAdornment,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import DeleteIcon from '@mui/icons-material/Delete';
import axios from 'axios';
import FileUpload from '@mui/icons-material/CloudUpload';
import Image from 'next/image';

const StudentIDCardPage = () => {
  const [idCards, setIDCards] = useState([]);
  const [formData, setFormData] = useState({
    school_name: '',
    school_address: '',
    title: '',
    header_color: '',
    enable_vertical_card: false,
    enable_admission_no: false,
    enable_student_name: false,
    enable_class: false,
    enable_fathers_name: false,
    enable_mothers_name: false,
    enable_address: false,
    enable_phone: false,
    enable_dob: false,
    enable_blood_group: false,
    enable_student_barcode: false,
    background: null,
    logo: null,
    sign_image: null,
  });
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedCardId, setSelectedCardId] = useState(null);

  const fetchIDCards = async () => {
    try {
      const response = await axios.get('/api/certificate/student_id_card');
      setIDCards(response.data);
    } catch (error) {
      console.error('Error fetching ID cards:', error);
    }
  };

  useEffect(() => {
    fetchIDCards();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleFileChange = (e) => {
    const { name, files } = e.target;
    setFormData({
      ...formData,
      [name]: files[0],
    });
  };

  const handleSwitchChange = (e) => {
    const { name, checked } = e.target;
    setFormData({
      ...formData,
      [name]: checked,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const formDataToSend = new FormData();
      Object.keys(formData).forEach((key) => {
        formDataToSend.append(key, formData[key]);
      });

      await axios.post('/api/certificate/student_id_card', formDataToSend, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      fetchIDCards(); // Refresh the list
      setFormData({
        school_name: '',
        school_address: '',
        title: '',
        header_color: '',
        enable_vertical_card: false,
        enable_admission_no: false,
        enable_student_name: false,
        enable_class: false,
        enable_fathers_name: false,
        enable_mothers_name: false,
        enable_address: false,
        enable_phone: false,
        enable_dob: false,
        enable_blood_group: false,
        enable_student_barcode: false,
        background: null,
        logo: null,
        sign_image: null,
      }); // Clear form
    } catch (error) {
      console.error('Error adding ID card:', error);
    }
  };

  const handleDelete = async () => {
    try {
      await axios.delete(`/api/certificate/student_id_card?id=${selectedCardId}`);
      fetchIDCards(); // Refresh the list
      handleCloseDeleteDialog(); // Close the dialog
    } catch (error) {
      console.error('Error deleting ID card:', error);
    }
  };

  const handleOpenDeleteDialog = (id) => {
    setSelectedCardId(id);
    setDeleteDialogOpen(true);
  };

  const handleCloseDeleteDialog = () => {
    setDeleteDialogOpen(false);
    setSelectedCardId(null);
  };

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        padding: '20px',
        backgroundColor: '#f7f7f7',
      }}
    >
      {/* Add Student ID Card Form */}
      <Box
        sx={{
          width: '100%',
          maxWidth: '600px',
          padding: 3,
          border: '1px solid #ddd',
          borderRadius: '8px',
          backgroundColor: '#fff',
          boxShadow: 1,
          marginBottom: 4,
        }}
      >
        <Typography variant="h6" gutterBottom>
          Add Student ID Card
        </Typography>
        <form onSubmit={handleSubmit}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <Typography variant="body2" gutterBottom>
                Background Image
              </Typography>
              <Button
                variant="outlined"
                component="label"
                startIcon={<FileUpload />}
                fullWidth
                sx={{ marginBottom: 2 }}
              >
                Drag and drop a file here or click
                <input
                  type="file"
                  name="background"
                  hidden
                  onChange={handleFileChange}
                />
              </Button>
            </Grid>
            {/* Repeat similarly for Logo and Signature fields */}
            <Grid item xs={12}>
              <Typography variant="body2" gutterBottom>
                Logo
              </Typography>
              <Button
                variant="outlined"
                component="label"
                startIcon={<FileUpload />}
                fullWidth
                sx={{ marginBottom: 2 }}
              >
                Drag and drop a file here or click
                <input
                  type="file"
                  name="logo"
                  hidden
                  onChange={handleFileChange}
                />
              </Button>
            </Grid>
            <Grid item xs={12}>
              <Typography variant="body2" gutterBottom>
                Signature
              </Typography>
              <Button
                variant="outlined"
                component="label"
                startIcon={<FileUpload />}
                fullWidth
                sx={{ marginBottom: 2 }}
              >
                Drag and drop a file here or click
                <input
                  type="file"
                  name="sign_image"
                  hidden
                  onChange={handleFileChange}
                />
              </Button>
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="School Name"
                name="school_name"
                value={formData.school_name}
                onChange={handleChange}
                fullWidth
                margin="dense"
                size="small"
                required
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="School Address / Phone / Email"
                name="school_address"
                value={formData.school_address}
                onChange={handleChange}
                fullWidth
                margin="dense"
                size="small"
                required
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="ID Card Title"
                name="title"
                value={formData.title}
                onChange={handleChange}
                fullWidth
                margin="dense"
                size="small"
                required
              />
            </Grid>
            {/* Add Switches for enabling or disabling fields */}
            <Grid item xs={12} md={6}>
              <Typography variant="body2">Admission No</Typography>
              <Switch
                name="enable_admission_no"
                checked={formData.enable_admission_no}
                onChange={handleSwitchChange}
                color="primary"
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <Typography variant="body2">Student Name</Typography>
              <Switch
                name="enable_student_name"
                checked={formData.enable_student_name}
                onChange={handleSwitchChange}
                color="primary"
              />
            </Grid>
            {/* Add more switches here */}
            <Grid item xs={12}>
              <Button type="submit" variant="contained" color="primary" fullWidth>
                Add ID Card
              </Button>
            </Grid>
          </Grid>
        </form>
      </Box>

      {/* Student ID Card List */}
      <Box
        sx={{
          width: '100%',
          maxWidth: '800px',
          padding: 3,
          border: '1px solid #ddd',
          borderRadius: '8px',
          backgroundColor: '#fff',
          boxShadow: 1,
        }}
      >
        <Typography variant="h6" gutterBottom>
          Student ID Card List
        </Typography>
        <TextField
          variant="outlined"
          placeholder="Search..."
          fullWidth
          margin="dense"
          size="small"
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton>
                  <SearchIcon />
                </IconButton>
              </InputAdornment>
            ),
          }}
        />
        <TableContainer component={Paper} sx={{ maxHeight: '400px', overflow: 'auto', marginTop: 2 }}>
          <Table stickyHeader>
            <TableHead>
              <TableRow>
                <TableCell>ID Card Title</TableCell>
                <TableCell>Background Image</TableCell>
                <TableCell>Design Type</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {idCards.map((card) => (
                <TableRow key={card.id}>
                  <TableCell>{card.title}</TableCell>
                  <TableCell>
                    {card.background && (
                      <Image
                        src={`/uploads/${card.background}`}
                        alt={card.title}
                        width={50}
                        height={50}
                      />
                    )}
                  </TableCell>
                  <TableCell>{card.enable_vertical_card ? 'Vertical' : 'Horizontal'}</TableCell>
                  <TableCell>
                    <IconButton color="secondary" onClick={() => handleOpenDeleteDialog(card.id)}>
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onClose={handleCloseDeleteDialog}>
        <DialogTitle>Delete ID Card</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete this ID card? This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDeleteDialog} color="primary">
            Cancel
          </Button>
          <Button onClick={handleDelete} color="secondary" autoFocus>
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default StudentIDCardPage;
