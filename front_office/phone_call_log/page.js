'use client';

import { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Paper, Typography, TextField, Button, Box, Grid, Container, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, IconButton, RadioGroup, FormControlLabel, Radio, Tooltip, Menu, MenuItem, Checkbox, ListItemText
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import { BiSolidPhoneCall } from "react-icons/bi";
import { IoCopyOutline } from "react-icons/io5";
import { AiOutlineFileExcel } from "react-icons/ai";
import { BsFiletypeCsv, BsFiletypePdf, BsPrinter } from "react-icons/bs";
import { HiOutlineViewColumns } from "react-icons/hi2";
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import * as XLSX from 'xlsx';
import './phonecall.css';

const PhoneCallLog = () => {
  const [callLogs, setCallLogs] = useState([]);
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [date, setDate] = useState('');
  const [description, setDescription] = useState('');
  const [nextFollowUpDate, setNextFollowUpDate] = useState('');
  const [callDuration, setCallDuration] = useState('');
  const [note, setNote] = useState('');
  const [callType, setCallType] = useState('Incoming');
  const [editId, setEditId] = useState(null);
  const [anchorEl, setAnchorEl] = useState(null);
  const [columns, setColumns] = useState({
    name: true,
    phone: true,
    date: true,
    description: true,
    nextFollowUpDate: true,
    callDuration: true,
    note: true,
    callType: true,
    action: true,
  });

  useEffect(() => {
    fetchCallLogs();
  }, []);

  const fetchCallLogs = async () => {
    try {
      const response = await axios.get('/api/frontoffice/phone_call_log');
      setCallLogs(response.data);
    } catch (error) {
      console.error('Error fetching call logs:', error);
    }
  };

  const handleCreateOrUpdateCallLog = async (event) => {
    event.preventDefault();
    const callLogData = {
      name,
      phone,
      date,
      description,
      next_follow_up_date: nextFollowUpDate,
      call_duration: callDuration,
      note,
      call_type: callType,
    };

    try {
      if (editId) {
        await axios.put('/api/frontoffice/phone_call_log', { id: editId, ...callLogData });
      } else {
        await axios.post('/api/frontoffice/phone_call_log', callLogData);
      }
      setName('');
      setPhone('');
      setDate('');
      setDescription('');
      setNextFollowUpDate('');
      setCallDuration('');
      setNote('');
      setCallType('Incoming');
      setEditId(null);
      fetchCallLogs();
    } catch (error) {
      console.error('Error creating or updating call log:', error);
    }
  };

  const handleEdit = (log) => {
    setEditId(log.id);
    setName(log.name);
    setPhone(log.phone);
    setDate(log.date);
    setDescription(log.description);
    setNextFollowUpDate(log.next_follow_up_date);
    setCallDuration(log.call_duration);
    setNote(log.note);
    setCallType(log.call_type);
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete('/api/frontoffice/phone_call_log', { data: { id } });
      fetchCallLogs();
    } catch (error) {
      console.error('Error deleting call log:', error);
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
    const tableText = callLogs.map(log =>
      `${log.name}\t${log.phone}\t${log.date}`).join('\n');
    navigator.clipboard.writeText(tableText).then(() => {
      alert('Table data copied to clipboard!');
    }).catch(err => {
      console.error('Error copying text: ', err);
    });
  };

  const handleExportToExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(callLogs);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Call Logs');
    XLSX.writeFile(workbook, 'call_logs.xlsx');
  };

  const handleExportToCSV = () => {
    const worksheet = XLSX.utils.json_to_sheet(callLogs);
    const csv = XLSX.utils.sheet_to_csv(worksheet);
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'call_logs.csv';
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const handleExportToPDF = () => {
    const doc = new jsPDF();
    doc.autoTable({
      head: [['Name', 'Phone', 'Date']],
      body: callLogs.map(log => [
        log.name,
        log.phone,
        log.date
      ]),
    });
    doc.save('call_logs.pdf');
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
        {/* Combined everything within a single Paper component */}
        <Paper elevation={3} style={{ padding: '16px', borderRadius: '8px' }}>
          <Typography variant="h5" align="left" marginBottom="40px" fontFamily="Verdana, Geneva, Tahoma, sans-serif" gutterBottom>
            <BiSolidPhoneCall style={{ marginRight: '2px', marginLeft: '3px', verticalAlign: 'middle', color: 'orange', fontSize: '30px', marginTop: '-7px' }} /> Phone Call Log
          </Typography>

         
          <Grid container spacing={4}>
            <Grid item xs={12} md={12}>
              <form onSubmit={handleCreateOrUpdateCallLog}>
                <Grid container spacing={2}>
                  <Grid item xs={12} md={4}>
                    <TextField
                      label="Name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      fullWidth
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
                  <Grid item xs={12} md={6}>
                    <TextField
                      label="Next Follow Up Date"
                      type="date"
                      value={nextFollowUpDate}
                      onChange={(e) => setNextFollowUpDate(e.target.value)}
                      fullWidth
                      variant="outlined"
                      margin="normal"
                      InputLabelProps={{ shrink: true }}
                      sx={{ ...noBorderStyle, ...focusedLabelStyle, marginTop: "2px" }}
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <TextField
                      label="Call Duration"
                      value={callDuration}
                      onChange={(e) => setCallDuration(e.target.value)}
                      fullWidth
                      variant="outlined"
                      margin="normal"
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
                  <Grid item xs={12}>
                    <RadioGroup
                      value={callType}
                      onChange={(e) => setCallType(e.target.value)}
                      row
                    >
                      <FormControlLabel
                        value="Incoming"
                        control={<Radio sx={{
                          color: 'grey',
                          '&.Mui-checked': {
                            color: 'orange',
                          },
                          marginLeft: '9px',
                        }} />}
                        label="Incoming"
                      />
                      <FormControlLabel
                        value="Outgoing"
                        control={<Radio sx={{
                          color: 'grey',
                          '&.Mui-checked': {
                            color: 'orange',
                          },
                        }} />}
                        label="Outgoing"
                      />
                    </RadioGroup>
                  </Grid>
                  <Grid item xs={12}>
                    <Button type="submit" fullWidth variant="contained" className="phonebtn" size="large">
                      {editId ? 'Update Call Log' : 'Create Call Log'}
                    </Button>
                  </Grid>
                </Grid>
              </form>
            </Grid>
            <Grid item xs={12} md={12}>
              
             
             <Typography fontSize="17px" color="orange" marginBottom="10px">Phone Call Log List</Typography>
             {/* Action Icons */}
          <Grid container justifyContent="flex-end" spacing={1} style={{ marginTop: '-40px', marginBottom: '20px' }}>
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
                    phone: true,
                    date: true,
                    description: true,
                    nextFollowUpDate: true,
                    callDuration: true,
                    note: true,
                    callType: true,
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

              <TableContainer className='phonecontainer'>
                <Table className='phonetable'>
                  <TableHead>
                    <TableRow>
                      <TableCell>Name</TableCell>
                      <TableCell>Phone</TableCell>
                      <TableCell>Date</TableCell>
                      <TableCell>Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {callLogs.map((log) => (
                      <TableRow key={log.id}>
                        <TableCell>{log.name}</TableCell>
                        <TableCell>{log.phone}</TableCell>
                        <TableCell>{log.date}</TableCell>
                        <TableCell>
                          <IconButton onClick={() => handleEdit(log)}>
                            <EditIcon />
                          </IconButton>
                          <IconButton onClick={() => handleDelete(log.id)}>
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
        </Paper>
      </Box>
    </Container>
  );
};

export default PhoneCallLog;
