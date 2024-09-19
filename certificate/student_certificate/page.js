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

const StudentCertificatePage = () => {
  const [certificates, setCertificates] = useState([]);
  const [formData, setFormData] = useState({
    certificate_name: '',
    certificate_text: '',
    left_header: '',
    center_header: '',
    right_header: '',
    left_footer: '',
    center_footer: '',
    right_footer: '',
    header_height: '',
    footer_height: '',
    content_height: '',
    content_width: '',
    enable_student_image: false,
    enable_image_height: '',
    background_image: null,
  });

  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedCertificateId, setSelectedCertificateId] = useState(null);

  const fetchCertificates = async () => {
    try {
      const response = await axios.get('/api/certificate/student_certificate');
      setCertificates(response.data);
    } catch (error) {
      console.error('Error fetching certificates:', error);
    }
  };

  useEffect(() => {
    fetchCertificates();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleFileChange = (e) => {
    setFormData({
      ...formData,
      background_image: e.target.files[0],
    });
  };

  const handleSwitchChange = (e) => {
    setFormData({
      ...formData,
      enable_student_image: e.target.checked,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const formDataToSend = new FormData();
      Object.keys(formData).forEach((key) => {
        formDataToSend.append(key, formData[key]);
      });

      await axios.post('/api/certificate/student_certificate', formDataToSend, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      fetchCertificates(); // Refresh the list
      setFormData({
        ...formData,
        certificate_name: '',
        certificate_text: '',
        left_header: '',
        center_header: '',
        right_header: '',
        left_footer: '',
        center_footer: '',
        right_footer: '',
        header_height: '',
        footer_height: '',
        content_height: '',
        content_width: '',
        enable_student_image: false,
        enable_image_height: '',
        background_image: null,
      }); // Clear form
    } catch (error) {
      console.error('Error adding certificate:', error);
    }
  };

  const handleDelete = async () => {
    try {
      await axios.delete(`/api/certificate/student_certificate?id=${selectedCertificateId}`);
      fetchCertificates(); // Refresh the list
      handleCloseDeleteDialog(); // Close the dialog
    } catch (error) {
      console.error('Error deleting certificate:', error);
    }
  };

  const handleOpenDeleteDialog = (id) => {
    setSelectedCertificateId(id);
    setDeleteDialogOpen(true);
  };

  const handleCloseDeleteDialog = () => {
    setDeleteDialogOpen(false);
    setSelectedCertificateId(null);
  };

  return (
    <Box sx={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: 4, marginLeft: '250px' }}>
      {/* Adjust the marginLeft to offset the sidebar width */}

      {/* Add Certificate Form */}
      <Box
        sx={{
          width: '100%',
          padding: 3,
          border: '1px solid #ddd',
          borderRadius: '8px',
          backgroundColor: '#fff',
          boxShadow: 1,
        }}
      >
        <Typography variant="h6" gutterBottom>
          Add Student Certificate
        </Typography>
        <form onSubmit={handleSubmit}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                label="Certificate Name"
                name="certificate_name"
                value={formData.certificate_name}
                onChange={handleChange}
                fullWidth
                margin="dense"
                size="small"
                required
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <TextField
                label="Header Left Text"
                name="left_header"
                value={formData.left_header}
                onChange={handleChange}
                fullWidth
                margin="dense"
                size="small"
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <TextField
                label="Header Center Text"
                name="center_header"
                value={formData.center_header}
                onChange={handleChange}
                fullWidth
                margin="dense"
                size="small"
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <TextField
                label="Header Right Text"
                name="right_header"
                value={formData.right_header}
                onChange={handleChange}
                fullWidth
                margin="dense"
                size="small"
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Body Text"
                name="certificate_text"
                value={formData.certificate_text}
                onChange={handleChange}
                fullWidth
                margin="dense"
                size="small"
                multiline
                rows={3}
                required
              />
              <Typography variant="body2" sx={{ mb: 2 }}>
                [name] [dob] [present_address] [guardian] [created_at] [admission_no] [roll_no] [class] [section] [gender] [admission_date] [category] [cast] [father_name] [mother_name] [religion] [email] [phone]
              </Typography>
            </Grid>
            <Grid item xs={12} md={4}>
              <TextField
                label="Footer Left Text"
                name="left_footer"
                value={formData.left_footer}
                onChange={handleChange}
                fullWidth
                margin="dense"
                size="small"
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <TextField
                label="Footer Center Text"
                name="center_footer"
                value={formData.center_footer}
                onChange={handleChange}
                fullWidth
                margin="dense"
                size="small"
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <TextField
                label="Footer Right Text"
                name="right_footer"
                value={formData.right_footer}
                onChange={handleChange}
                fullWidth
                margin="dense"
                size="small"
              />
            </Grid>
            <Grid item xs={12} md={3}>
              <TextField
                label="Header Height"
                name="header_height"
                value={formData.header_height}
                onChange={handleChange}
                fullWidth
                margin="dense"
                size="small"
              />
            </Grid>
            <Grid item xs={12} md={3}>
              <TextField
                label="Footer Height"
                name="footer_height"
                value={formData.footer_height}
                onChange={handleChange}
                fullWidth
                margin="dense"
                size="small"
              />
            </Grid>
            <Grid item xs={12} md={3}>
              <TextField
                label="Body Height"
                name="content_height"
                value={formData.content_height}
                onChange={handleChange}
                fullWidth
                margin="dense"
                size="small"
              />
            </Grid>
            <Grid item xs={12} md={3}>
              <TextField
                label="Body Width"
                name="content_width"
                value={formData.content_width}
                onChange={handleChange}
                fullWidth
                margin="dense"
                size="small"
              />
            </Grid>
            <Grid item xs={12}>
              <Box display="flex" alignItems="center" mt={2}>
                <Typography variant="body2" sx={{ flex: 1 }}>
                  Student Photo
                </Typography>
                <Switch
                  checked={formData.enable_student_image}
                  onChange={handleSwitchChange}
                  color="primary"
                />
              </Box>
            </Grid>
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
                  hidden
                  onChange={handleFileChange}
                />
              </Button>
            </Grid>
            <Grid item xs={12}>
              <Button type="submit" variant="contained" color="primary" fullWidth>
                Add Certificate
              </Button>
            </Grid>
          </Grid>
        </form>
      </Box>

      {/* Certificate List */}
      <Box
        sx={{
          width: '100%',
          padding: 3,
          border: '1px solid #ddd',
          borderRadius: '8px',
          backgroundColor: '#fff',
          boxShadow: 1,
        }}
      >
        <Typography variant="h6" gutterBottom>
          Student Certificate List
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
                <TableCell>Certificate Name</TableCell>
                <TableCell>Background Image</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {certificates.map((certificate) => (
                <TableRow key={certificate.id}>
                  <TableCell>{certificate.certificate_name}</TableCell>
                  <TableCell>
                    {certificate.background_image && (
                      <Image
                        src={`/uploads/${certificate.background_image}`}
                        alt={certificate.certificate_name}
                        width={50}
                        height={50}
                      />
                    )}
                  </TableCell>
                  <TableCell>
                    <IconButton color="secondary" onClick={() => handleOpenDeleteDialog(certificate.id)}>
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
      <Dialog
        open={deleteDialogOpen}
        onClose={handleCloseDeleteDialog}
      >
        <DialogTitle>Delete Certificate</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete this certificate? This action cannot be undone.
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

export default StudentCertificatePage;
