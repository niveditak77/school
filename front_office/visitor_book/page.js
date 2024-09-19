'use client';

import { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Paper, Typography, TextField, Button, Box, Grid, Container, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, IconButton, Tooltip, Menu, MenuItem, Checkbox, ListItemText
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import { FaAddressBook } from "react-icons/fa";
import { IoCopyOutline } from "react-icons/io5";
import { AiOutlineFileExcel } from "react-icons/ai";
import { BsFiletypeCsv, BsFiletypePdf, BsPrinter } from "react-icons/bs";
import { HiOutlineViewColumns } from "react-icons/hi2";
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import * as XLSX from 'xlsx';
import './visitor.css';

const VisitorBook = () => {
  const [visitors, setVisitors] = useState([]);
  const [purpose, setPurpose] = useState('');
  const [meetingWith, setMeetingWith] = useState('');
  const [visitorName, setVisitorName] = useState('');
  const [phone, setPhone] = useState('');
  const [idCard, setIdCard] = useState('');
  const [numberOfPersons, setNumberOfPersons] = useState('');
  const [date, setDate] = useState('');
  const [inTime, setInTime] = useState('');
  const [outTime, setOutTime] = useState('');
  const [editId, setEditId] = useState(null);
  const [anchorEl, setAnchorEl] = useState(null);
  const [columns, setColumns] = useState({
    purpose: true,
    meetingWith: true,
    visitorName: true,
    phone: true,
    date: true,
    action: true,
  });

  useEffect(() => {
    fetchVisitors();
  }, []);

  const fetchVisitors = async () => {
    try {
      const response = await axios.get('/api/frontoffice/visitor_book');
      setVisitors(response.data);
    } catch (error) {
      console.error('Error fetching visitors:', error);
    }
  };

  const handleCreateOrUpdateVisitor = async (event) => {
    event.preventDefault();
    try {
      if (editId) {
        await axios.put('/api/frontoffice/visitor_book', {
          id: editId, purpose, meeting_with: meetingWith, visitor_name: visitorName, phone, id_card: idCard, number_of_persons: numberOfPersons, date, in_time: inTime, out_time: outTime
        });
      } else {
        await axios.post('/api/frontoffice/visitor_book', {
          purpose, meeting_with: meetingWith, visitor_name: visitorName, phone, id_card: idCard, number_of_persons: numberOfPersons, date, in_time: inTime, out_time: outTime
        });
      }
      setPurpose('');
      setMeetingWith('');
      setVisitorName('');
      setPhone('');
      setIdCard('');
      setNumberOfPersons('');
      setDate('');
      setInTime('');
      setOutTime('');
      setEditId(null);
      fetchVisitors();
    } catch (error) {
      console.error('Error creating or updating visitor:', error);
    }
  };

  const handleEdit = (visitor) => {
    setEditId(visitor.id);
    setPurpose(visitor.purpose);
    setMeetingWith(visitor.meeting_with);
    setVisitorName(visitor.visitor_name);
    setPhone(visitor.phone);
    setIdCard(visitor.id_card);
    setNumberOfPersons(visitor.number_of_persons);
    setDate(visitor.date);
    setInTime(visitor.in_time);
    setOutTime(visitor.out_time);
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete('/api/frontoffice/visitor_book', { data: { id } });
      fetchVisitors();
    } catch (error) {
      console.error('Error deleting visitor:', error);
    }
  };

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
    const tableText = visitors.map(visitor =>
      `${visitor.id}\t${visitor.purpose}\t${visitor.meeting_with}\t${visitor.visitor_name}\t${visitor.phone}`).join('\n');
    navigator.clipboard.writeText(tableText).then(() => {
      alert('Table data copied to clipboard!');
    }).catch(err => {
      console.error('Error copying text: ', err);
    });
  };

  const handleExportToExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(visitors);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Visitors');
    XLSX.writeFile(workbook, 'visitors.xlsx');
  };

  const handleExportToCSV = () => {
    const worksheet = XLSX.utils.json_to_sheet(visitors);
    const csv = XLSX.utils.sheet_to_csv(worksheet);
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'visitors.csv';
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const handleExportToPDF = () => {
    const doc = new jsPDF();
    doc.autoTable({
      head: [['Visitor ID', 'Purpose', 'Meeting With', 'Visitor Name', 'Phone']],
      body: visitors.map(visitor => [
        visitor.id,
        visitor.purpose,
        visitor.meeting_with,
        visitor.visitor_name,
        visitor.phone
      ]),
    });
    doc.save('visitors.pdf');
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
    }
  };

  return (
    <Container maxWidth="lg">
      <Box mt={4} mb={4}>
        {/* Form Section */}
        <Paper elevation={3} style={{ padding: '16px', borderRadius: '8px', marginBottom: '24px' }}>
          <Typography variant="h5" align="left" marginBottom="40px" fontFamily="Verdana, Geneva, Tahoma, sans-serif" gutterBottom>
            <FaAddressBook style={{ marginRight: '2px', marginLeft: '3px', verticalAlign: 'middle', color: 'orange', fontSize: '30px', marginTop: '-7px' }} /> Visitor Book
          </Typography>

          <form onSubmit={handleCreateOrUpdateVisitor}>
            <Grid container spacing={2}>
              <Grid item xs={12} md={4}>
                <TextField
                  label="Purpose"
                  value={purpose}
                  onChange={(e) => setPurpose(e.target.value)}
                  fullWidth
                  required
                  variant="outlined"
                  margin="normal"
                  sx={{ ...noBorderStyle, ...focusedLabelStyle, marginTop: "2px" }}
                />
              </Grid>
              <Grid item xs={12} md={4}>
                <TextField
                  label="Meeting With"
                  value={meetingWith}
                  onChange={(e) => setMeetingWith(e.target.value)}
                  fullWidth
                  required
                  variant="outlined"
                  margin="normal"
                  sx={{ ...noBorderStyle, ...focusedLabelStyle, marginTop: "2px" }}
                />
              </Grid>
              <Grid item xs={12} md={4}>
                <TextField
                  label="Visitor Name"
                  value={visitorName}
                  onChange={(e) => setVisitorName(e.target.value)}
                  fullWidth
                  required
                  variant="outlined"
                  margin="normal"
                  sx={{ ...noBorderStyle, ...focusedLabelStyle, marginTop: "2px" }}
                />
              </Grid>
              <Grid item xs={12} md={4}>
                <TextField
                  label="Phone"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  fullWidth
                  required
                  variant="outlined"
                  margin="normal"
                  sx={{ ...noBorderStyle, ...focusedLabelStyle, marginTop: "2px" }}
                />
              </Grid>
              <Grid item xs={12} md={4}>
                <TextField
                  label="ID Card"
                  value={idCard}
                  onChange={(e) => setIdCard(e.target.value)}
                  fullWidth
                  variant="outlined"
                  margin="normal"
                  sx={{ ...noBorderStyle, ...focusedLabelStyle, marginTop: "2px" }}
                />
              </Grid>
              <Grid item xs={12} md={4}>
                <TextField
                  label="Number of Persons"
                  value={numberOfPersons}
                  onChange={(e) => setNumberOfPersons(e.target.value)}
                  fullWidth
                  required
                  variant="outlined"
                  margin="normal"
                  sx={{ ...noBorderStyle, ...focusedLabelStyle, marginTop: "2px" }}
                />
              </Grid>
              <Grid item xs={12} md={4}>
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
              <Grid item xs={12} md={4}>
                <TextField
                  label="In Time"
                  type="time"
                  value={inTime}
                  onChange={(e) => setInTime(e.target.value)}
                  fullWidth
                  required
                  variant="outlined"
                  margin="normal"
                  InputLabelProps={{ shrink: true }}
                  sx={{ ...noBorderStyle, ...focusedLabelStyle, marginTop: "2px" }}
                />
              </Grid>
              <Grid item xs={12} md={4}>
                <TextField
                  label="Out Time"
                  type="time"
                  value={outTime}
                  onChange={(e) => setOutTime(e.target.value)}
                  fullWidth
                  required
                  variant="outlined"
                  margin="normal"
                  InputLabelProps={{ shrink: true }}
                  sx={{ ...noBorderStyle, ...focusedLabelStyle, marginTop: "2px" }}
                />
              </Grid>
              <Grid item xs={12} md={4}>
                <Button type="submit" fullWidth variant="contained" className='visitorbutton' size="large">
                  {editId ? 'Update Visitor' : 'Add Visitor'}
                </Button>
              </Grid>
            </Grid>
          </form>
        </Paper>

        {/* Visitor List and Icons Section */}
        <Paper elevation={3} style={{ padding: '16px', borderRadius: '8px' }}>
          <Typography fontSize="17px" marginLeft="8px" marginTop="3px" color="orange" marginBottom="15px">Visitor List</Typography>
          
          {/* Action Icons */}
          <Grid container justifyContent="flex-end" spacing={1} style={{ marginTop: '-50px', marginBottom: '20px' }}>
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
                    purpose: true,
                    meetingWith: true,
                    visitorName: true,
                    phone: true,
                    date: true,
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
          <TableContainer className='visitorcontain'>
            <Table className='visitortable'>
              <TableHead>
                <TableRow>
                  <TableCell>Purpose</TableCell>
                  <TableCell>Meeting With</TableCell>
                  <TableCell>Visitor Name</TableCell>
                  <TableCell>Phone</TableCell>
                  <TableCell>ID Card</TableCell>
                  <TableCell>Number of Persons</TableCell>
                  <TableCell>Date</TableCell>
                  <TableCell>In Time</TableCell>
                  <TableCell>Out Time</TableCell>
                  <TableCell>Action</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {visitors.map((visitor) => (
                  <TableRow key={visitor.id}>
                    <TableCell>{visitor.purpose}</TableCell>
                    <TableCell>{visitor.meeting_with}</TableCell>
                    <TableCell>{visitor.visitor_name}</TableCell>
                    <TableCell>{visitor.phone}</TableCell>
                    <TableCell>{visitor.id_card}</TableCell>
                    <TableCell>{visitor.number_of_persons}</TableCell>
                    <TableCell>{visitor.date}</TableCell>
                    <TableCell>{visitor.in_time}</TableCell>
                    <TableCell>{visitor.out_time}</TableCell>
                    <TableCell>
                      <IconButton onClick={() => handleEdit(visitor)}>
                        <EditIcon />
                      </IconButton>
                      <IconButton onClick={() => handleDelete(visitor.id)} sx={{ color: "red" }}>
                        <DeleteIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>
      </Box>
    </Container>
  );
};

export default VisitorBook;
