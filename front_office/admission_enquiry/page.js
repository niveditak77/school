'use client';

import { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Paper, Typography, TextField, Button, Box, Grid, Container, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, IconButton, Tooltip, Menu, MenuItem, Checkbox, ListItemText
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';

import { FaSchoolCircleCheck } from "react-icons/fa6";
import { IoCopyOutline } from "react-icons/io5";
import { AiOutlineFileExcel } from "react-icons/ai";
import { BsFiletypeCsv, BsFiletypePdf, BsPrinter } from "react-icons/bs";
import { HiOutlineViewColumns } from "react-icons/hi2";
import jsPDF from 'jspdf'; // Import jsPDF for PDF export
import 'jspdf-autotable'; // Import autotable plugin for jsPDF
import * as XLSX from 'xlsx';
import './admissionenquiry.css';

const AdmissionEnquiry = () => {
  const [enquiries, setEnquiries] = useState([]);
  const [name, setName] = useState('');
  const [contact, setContact] = useState('');
  const [address, setAddress] = useState('');
  const [reference, setReference] = useState('');
  const [date, setDate] = useState('');
  const [description, setDescription] = useState('');
  const [followUpDate, setFollowUpDate] = useState('');
  const [note, setNote] = useState('');
  const [source, setSource] = useState('');
  const [email, setEmail] = useState('');
  const [assigned, setAssigned] = useState('');
  const [classId, setClassId] = useState('');
  const [noOfChild, setNoOfChild] = useState('');
  const [status, setStatus] = useState('');
  const [editId, setEditId] = useState(null);
  const [anchorEl, setAnchorEl] = useState(null); 
  const [columns, setColumns] = useState({
    name: true,
    contact: true,
    date: true,
    followUpDate: true,
    action: true,
  });

  useEffect(() => {
    fetchEnquiries();
  }, []);

  const fetchEnquiries = async () => {
    try {
      const response = await axios.get('/api/frontoffice/enquiry');
      setEnquiries(response.data);
    } catch (error) {
      console.error('Error fetching enquiries:', error);
    }
  };

  const handleCreateOrUpdateEnquiry = async (event) => {
    event.preventDefault();
    try {
      if (editId) {
        await axios.put('/api/frontoffice/enquiry', {
          id: editId, name, contact, address, reference, date, description, follow_up_date: followUpDate, note, source, email, assigned, class_id: classId, no_of_child: noOfChild, status
        });
      } else {
        await axios.post('/api/frontoffice/enquiry', {
          name, contact, address, reference, date, description, follow_up_date: followUpDate, note, source, email, assigned, class_id: classId, no_of_child: noOfChild, status
        });
      }
      setName('');
      setContact('');
      setAddress('');
      setReference('');
      setDate('');
      setDescription('');
      setFollowUpDate('');
      setNote('');
      setSource('');
      setEmail('');
      setAssigned('');
      setClassId('');
      setNoOfChild('');
      setStatus('');
      setEditId(null);
      fetchEnquiries();
    } catch (error) {
      console.error('Error creating or updating enquiry:', error);
    }
  };

  const handleEdit = (enquiry) => {
    setEditId(enquiry.id);
    setName(enquiry.name);
    setContact(enquiry.contact);
    setAddress(enquiry.address);
    setReference(enquiry.reference);
    setDate(enquiry.date);
    setDescription(enquiry.description);
    setFollowUpDate(enquiry.follow_up_date);
    setNote(enquiry.note);
    setSource(enquiry.source);
    setEmail(enquiry.email);
    setAssigned(enquiry.assigned);
    setClassId(enquiry.class_id);
    setNoOfChild(enquiry.no_of_child);
    setStatus(enquiry.status);
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete('/api/frontoffice/enquiry', { data: { id } });
      fetchEnquiries();
    } catch (error) {
      console.error('Error deleting enquiry:', error);
    }
  };

  // Common functions for icons
  const handleIconClick = (action) => {
    switch (action) {
      case 'copy':
        handleCopy();
        break;
      case 'excel':
        handleExportToExcel();
        break;
      case 'csv':
        handleExportToCSV();
        break;
      case 'pdf':
        handleExportToPDF();
        break;
      case 'print':
        handlePrint();
        break;
      case 'view':
        handleMenuOpen();
        break;
      default:
        break;
    }
  };

  const handleCopy = () => {
    const tableText = enquiries.map(enquiry =>
      `${enquiry.id}\t${enquiry.name}\t${enquiry.contact}\t${enquiry.date}\t${enquiry.follow_up_date}`).join('\n');
    navigator.clipboard.writeText(tableText).then(() => {
      alert('Table data copied to clipboard!');
    }).catch(err => {
      console.error('Error copying text: ', err);
    });
  };

  const handleExportToExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(enquiries);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Admission Enquiries');
    XLSX.writeFile(workbook, 'admission_enquiries.xlsx');
  };

  const handleExportToCSV = () => {
    const worksheet = XLSX.utils.json_to_sheet(enquiries);
    const csv = XLSX.utils.sheet_to_csv(worksheet);
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'admission_enquiries.csv';
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const handleExportToPDF = () => {
    const doc = new jsPDF();
    doc.autoTable({
      head: [['Enquiry ID', 'Name', 'Contact', 'Date', 'Follow Up Date']],
      body: enquiries.map(enquiry => [
        enquiry.id,
        enquiry.name,
        enquiry.contact,
        enquiry.date,
        enquiry.follow_up_date
      ]),
    });
    doc.save('admission_enquiries.pdf');
  };

  const handlePrint = () => {
    window.print();
  };

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleColumnChange = (column) => {
    setColumns((prevColumns) => ({
      ...prevColumns,
      [column]: !prevColumns[column],
    }));
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
      color: 'orange',
      transform: 'translate(0, -15px) scale(0.75)',
      marginLeft: '10px',
    }
  };

  return (
    <Container maxWidth="lg">
      <Box mt={4} mb={4}>
        <Paper elevation={3} style={{ padding: '16px', borderRadius: '8px' }}>
          <Typography variant="h5" align="left" marginBottom="40px" fontFamily="Verdana, Geneva, Tahoma, sans-serif" gutterBottom>
            <FaSchoolCircleCheck style={{ marginRight: '2px', marginLeft: '3px', verticalAlign: 'middle', color: 'orange', fontSize: '30px', marginTop: '-7px' }}/> Admission Enquiry
          </Typography>
          
          {/* Form Section */}
          <form onSubmit={handleCreateOrUpdateEnquiry}>
            <Grid container spacing={2}>
              <Grid item xs={12} md={6}>
                <TextField
                  label="Name"
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
                  label="Contact"
                  value={contact}
                  onChange={(e) => setContact(e.target.value)}
                  fullWidth
                  required
                  variant="outlined"
                  margin="normal"
                  sx={{ ...noBorderStyle, ...focusedLabelStyle, marginTop: "2px" }}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  label="Address"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  fullWidth
                  multiline
                  rows={2}
                  variant="outlined"
                  margin="normal"
                  sx={{ ...noBorderStyle, ...focusedLabelStyle, marginTop: "2px" }}
                />
              </Grid>
          
              <Grid item xs={12} md={6}>
                <TextField
                  label="Reference"
                  value={reference}
                  onChange={(e) => setReference(e.target.value)}
                  fullWidth
                  required
                  variant="outlined"
                  margin="normal"
                  sx={{ ...noBorderStyle, ...focusedLabelStyle, marginTop: "2px" }}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  label="Class ID"
                  value={classId}
                  onChange={(e) => setClassId(e.target.value)}
                  fullWidth
                  variant="outlined"
                  margin="normal"
                  sx={{ ...noBorderStyle, ...focusedLabelStyle, marginTop: "2px" }}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  label="Date"
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  fullWidth
                  required
                  variant="outlined"
                  margin="normal"
                  InputLabelProps={{ shrink: true }}
                  sx={{ ...noBorderStyle, ...focusedLabelStyle, marginTop: "2px" }}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  label="Description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  fullWidth
                  multiline
                  rows={2}
                  variant="outlined"
                  margin="normal"
                  sx={{ ...noBorderStyle, ...focusedLabelStyle, marginTop: "2px" }}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  label="Follow Up Date"
                  type="date"
                  value={followUpDate}
                  onChange={(e) => setFollowUpDate(e.target.value)}
                  fullWidth
                  required
                  variant="outlined"
                  margin="normal"
                  InputLabelProps={{ shrink: true }}
                  sx={{ ...noBorderStyle, ...focusedLabelStyle, marginTop: "2px" }}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  label="Note"
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  fullWidth
                  multiline
                  rows={2}
                  variant="outlined"
                  margin="normal"
                  sx={{ ...noBorderStyle, ...focusedLabelStyle, marginTop: "2px" }}
                />
              </Grid>
              <Grid item xs={12} md={4}>
                <TextField
                  label="Source"
                  value={source}
                  onChange={(e) => setSource(e.target.value)}
                  fullWidth
                  required
                  variant="outlined"
                  margin="normal"
                  sx={{ ...noBorderStyle, ...focusedLabelStyle, marginTop: "2px" }}
                />
              </Grid>
              <Grid item xs={12} md={4}>
                <TextField
                  label="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  fullWidth
                  variant="outlined"
                  margin="normal"
                  sx={{ ...noBorderStyle, ...focusedLabelStyle, marginTop: "2px" }}
                />
              </Grid>
              <Grid item xs={12} md={4}>
                <TextField
                  label="Assigned"
                  value={assigned}
                  onChange={(e) => setAssigned(e.target.value)}
                  fullWidth
                  variant="outlined"
                  margin="normal"
                  sx={{ ...noBorderStyle, ...focusedLabelStyle, marginTop: "2px" }}
                />
              </Grid>
           
              <Grid item xs={12} md={6}>
                <TextField
                  label="Number of Children"
                  value={noOfChild}
                  onChange={(e) => setNoOfChild(e.target.value)}
                  fullWidth
                  variant="outlined"
                  margin="normal"
                  sx={{ ...noBorderStyle, ...focusedLabelStyle, marginTop: "2px" }}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  label="Status"
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                  fullWidth
                  required
                  variant="outlined"
                  margin="normal"
                  sx={{ ...noBorderStyle, ...focusedLabelStyle, marginTop: "2px" }}
                />
              </Grid>
              <Grid item xs={12}>
                <Button type="submit" fullWidth variant="contained" className='admissionenquirybtn' size="small">
                  {editId ? 'Update Enquiry' : 'Add Enquiry'}
                </Button>
              </Grid>
            </Grid>
          </form>

          {/* Action Icons */}
          <Typography fontSize="17px"   marginLeft="8px" marginTop="3px" color="orange" marginBottom="-50px">Enquiry List</Typography>
          <Grid container justifyContent="flex-end" spacing={1} style={{ marginTop: '10px', marginBottom: '-20px' }}>
         
            {/* Copy, Excel, CSV, PDF, Print, View Columns Icons */}
            <Grid item>
              <Tooltip title="Copy">
                <IconButton
                  onClick={() => handleIconClick('copy')}
                  size="small"
                  sx={{
                    margin: '0 1px',
                    borderRadius: '10px',
                    backgroundColor: '#44b8ab',
                    color: 'white',
                    '&:hover': {
                      backgroundColor: '#E0E0E0',
                      color: 'gray',
                    }
                  }}
                >
                  <IoCopyOutline size={17} />
                </IconButton>
              </Tooltip>
            </Grid>
            <Grid item>
              <Tooltip title="Export to Excel">
                <IconButton
                  onClick={() => handleIconClick('excel')}
                  size="small"
                  sx={{
                    margin: '0 1px',
                    borderRadius: '10px',
                    backgroundColor: '#44b8ab',
                    color: 'white',
                    '&:hover': {
                      backgroundColor: '#E0E0E0',
                      color: 'gray',
                    }
                  }}
                >
                  <AiOutlineFileExcel size={17} />
                </IconButton>
              </Tooltip>
            </Grid>
            <Grid item>
              <Tooltip title="Export to CSV">
                <IconButton
                  onClick={() => handleIconClick('csv')}
                  size="small"
                  sx={{
                    margin: '0 1px',
                    borderRadius: '10px',
                    backgroundColor: '#44b8ab',
                    color: 'white',
                    '&:hover': {
                      backgroundColor: '#E0E0E0',
                      color: 'gray',
                    }
                  }}
                >
                  <BsFiletypeCsv size={17} />
                </IconButton>
              </Tooltip>
            </Grid>
            <Grid item>
              <Tooltip title="Export to PDF">
                <IconButton
                  onClick={() => handleIconClick('pdf')}
                  size="small"
                  sx={{
                    margin: '0 1px',
                    borderRadius: '10px',
                    backgroundColor: '#44b8ab',
                    color: 'white',
                    '&:hover': {
                      backgroundColor: '#E0E0E0',
                      color: 'gray',
                    }
                  }}
                >
                  <BsFiletypePdf size={17} />
                </IconButton>
              </Tooltip>
            </Grid>
            <Grid item>
              <Tooltip title="Print">
                <IconButton
                  onClick={() => handleIconClick('print')}
                  size="small"
                  sx={{
                    margin: '0 1px',
                    borderRadius: '10px',
                    backgroundColor: '#44b8ab',
                    color: 'white',
                    '&:hover': {
                      backgroundColor: '#E0E0E0',
                      color: 'gray',
                    }
                  }}
                >
                  <BsPrinter size={17} />
                </IconButton>
              </Tooltip>
            </Grid>
            <Grid item>
              <Tooltip title="View Columns">
                <IconButton
                  onClick={handleMenuOpen}
                  size="small"
                  sx={{
                    margin: '0 1px',
                    borderRadius: '10px',
                    backgroundColor: '#44b8ab',
                    color: 'white',
                    '&:hover': {
                      backgroundColor: '#E0E0E0',
                      color: 'gray',
                    }
                  }}
                >
                  <HiOutlineViewColumns size={17} />
                </IconButton>
              </Tooltip>
              <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleMenuClose}
                PaperProps={{
                  style: {
                    padding: '8px',
                    borderRadius: '10px',
                    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.15)',
                  },
                }}
              >
                {Object.keys(columns).map((column) => (
                  <MenuItem
                    key={column}
                    sx={{
                      padding: '6px 16px',
                      '&:hover': {
                        backgroundColor: '#E0E0E0',
                      },
                    }}
                  >
                    <Checkbox
                      checked={columns[column]}
                      onChange={() => handleColumnChange(column)}
                      sx={{
                        padding: '0 8px',
                        color: 'gray',
                        '&.Mui-checked': {
                          color: 'orange',
                        },
                      }}
                    />
                    <ListItemText
                      primary={column.charAt(0).toUpperCase() + column.slice(1)}
                      sx={{
                        color: '#333',
                        fontSize: '14px',
                        fontWeight: '500',
                        marginLeft: '5px',
                      }}
                    />
                  </MenuItem>
                ))}
                <MenuItem
                  onClick={() => setColumns({
                    name: true,
                    contact: true,
                    date: true,
                    followUpDate: true,
                    action: true,
                  })}
                  sx={{
                    padding: '6px 16px',
                    '&:hover': {
                      backgroundColor: 'gray',
                    },
                  }}
                >
                  <ListItemText
                    primary="Restore visibility"
                    sx={{
                      color: 'orange',
                      fontSize: '14px',
                      fontWeight: '500',
                      marginLeft: '5px',
                    }}
                  />
                </MenuItem>
              </Menu>
            </Grid>
          </Grid>

          {/* Table Section */}
          <Box mt={4}>
           
            <TableContainer className='admissionenquirycontain'>
              <Table className='admissionenquirytable'>
                <TableHead>
                  <TableRow>
                    <TableCell>Name</TableCell>
                    <TableCell>Contact</TableCell>
                    <TableCell>Date</TableCell>
                    <TableCell>Follow Up Date</TableCell>
                    <TableCell>Action</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {enquiries.map((enquiry) => (
                    <TableRow key={enquiry.id}>
                      <TableCell>{enquiry.name}</TableCell>
                      <TableCell>{enquiry.contact}</TableCell>
                      <TableCell>{enquiry.date}</TableCell>
                      <TableCell>{enquiry.follow_up_date}</TableCell>
                      <TableCell>
                        <IconButton onClick={() => handleEdit(enquiry)}>
                          <EditIcon />
                        </IconButton>
                        <IconButton onClick={() => handleDelete(enquiry.id)} sx={{ color: "red" }}>
                          <DeleteIcon />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Box>
        </Paper>
      </Box>
    </Container>
  );
};

export default AdmissionEnquiry;
