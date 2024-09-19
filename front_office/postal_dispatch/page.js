'use client';

import { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Paper, Typography, TextField, Button, Box, Grid, Container, Table, TableBody, Tooltip, TableCell, TableContainer, TableHead, TableRow, IconButton, Snackbar, Alert, Menu, MenuItem, Checkbox, ListItemText
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import { GiPostOffice } from "react-icons/gi";
import { IoCopyOutline } from "react-icons/io5";
import { AiOutlineFileExcel } from "react-icons/ai";
import { BsFiletypeCsv, BsFiletypePdf, BsPrinter } from "react-icons/bs";
import { HiOutlineViewColumns } from "react-icons/hi2";
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import * as XLSX from 'xlsx';
import './postaldispatch.css';

const PostalDispatch = () => {
  const [dispatchList, setDispatchList] = useState([]);
  const [referenceNo, setReferenceNo] = useState('');
  const [toTitle, setToTitle] = useState('');
  const [type, setType] = useState('');
  const [address, setAddress] = useState('');
  const [note, setNote] = useState('');
  const [fromTitle, setFromTitle] = useState('');
  const [date, setDate] = useState('');
  const [editId, setEditId] = useState(null);
  const [error, setError] = useState(null);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const [columns, setColumns] = useState({
    referenceNo: true,
    toTitle: true,
    fromTitle: true,
    date: true,
    action: true,
  });

  useEffect(() => {
    fetchDispatchList();
  }, []);

  const fetchDispatchList = async () => {
    try {
      const response = await axios.get('/api/frontoffice/dispatch_receive');
      setDispatchList(response.data);
    } catch (error) {
      console.error('Error fetching dispatch list:', error);
    }
  };

  const handleCreateOrUpdateDispatch = async (event) => {
    event.preventDefault();
    try {
      if (editId) {
        await axios.put('/api/frontoffice/dispatch_receive', { id: editId, referenceNo, toTitle, type, address, note, fromTitle, date });
      } else {
        await axios.post('/api/frontoffice/dispatch_receive', { referenceNo, toTitle, type, address, note, fromTitle, date });
      }
      setReferenceNo('');
      setToTitle('');
      setType('');
      setAddress('');
      setNote('');
      setFromTitle('');
      setDate('');
      setEditId(null);
      fetchDispatchList();
      setOpenSnackbar(true);
    } catch (error) {
      console.error('Error creating or updating dispatch:', error);
      setError('Error creating or updating dispatch');
    }
  };

  const handleEdit = (dispatch) => {
    setEditId(dispatch.id);
    setReferenceNo(dispatch.reference_no);
    setToTitle(dispatch.to_title);
    setType(dispatch.type);
    setAddress(dispatch.address);
    setNote(dispatch.note);
    setFromTitle(dispatch.from_title);
    setDate(dispatch.date);
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete('/api/frontoffice/dispatch_receive', { data: { id } });
      fetchDispatchList();
    } catch (error) {
      console.error('Error deleting dispatch:', error);
    }
  };

  const handleCloseSnackbar = () => {
    setOpenSnackbar(false);
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
    const tableText = dispatchList.map(dispatch =>
      `${dispatch.reference_no}\t${dispatch.to_title}\t${dispatch.from_title}\t${dispatch.date}`).join('\n');
    navigator.clipboard.writeText(tableText).then(() => {
      alert('Table data copied to clipboard!');
    }).catch(err => {
      console.error('Error copying text: ', err);
    });
  };

  const handleExportToExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(dispatchList);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Dispatch List');
    XLSX.writeFile(workbook, 'dispatch_list.xlsx');
  };

  const handleExportToCSV = () => {
    const worksheet = XLSX.utils.json_to_sheet(dispatchList);
    const csv = XLSX.utils.sheet_to_csv(worksheet);
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'dispatch_list.csv';
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const handleExportToPDF = () => {
    const doc = new jsPDF();
    doc.autoTable({
      head: [['Reference No', 'To Title', 'From Title', 'Date']],
      body: dispatchList.map(dispatch => [
        dispatch.reference_no,
        dispatch.to_title,
        dispatch.from_title,
        dispatch.date,
      ]),
    });
    doc.save('dispatch_list.pdf');
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
            <GiPostOffice style={{ marginRight: '7px', marginLeft: '3px', verticalAlign: 'middle', color: 'orange', fontSize: '28px', marginTop: '-7px' }} />Postal Dispatch
          </Typography>

          <form onSubmit={handleCreateOrUpdateDispatch}>
            <Grid container spacing={2}>
              <Grid item xs={12} md={4}>
                <TextField
                  label="Reference No"
                  value={referenceNo}
                  onChange={(e) => setReferenceNo(e.target.value)}
                  fullWidth
                  variant="outlined"
                  margin="normal"
                  sx={{ ...noBorderStyle, ...focusedLabelStyle, marginTop: "2px" }}
                />
              </Grid>
              <Grid item xs={12} md={4}>
                <TextField
                  label="To Title"
                  value={toTitle}
                  onChange={(e) => setToTitle(e.target.value)}
                  fullWidth
                  required
                  variant="outlined"
                  margin="normal"
                  sx={{ ...noBorderStyle, ...focusedLabelStyle, marginTop: "2px" }}
                />
              </Grid>
              <Grid item xs={12} md={4}>
                <TextField
                  label="From Title"
                  value={fromTitle}
                  onChange={(e) => setFromTitle(e.target.value)}
                  fullWidth
                  variant="outlined"
                  margin="normal"
                  sx={{ ...noBorderStyle, ...focusedLabelStyle, marginTop: "2px" }}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  label="Type"
                  value={type}
                  onChange={(e) => setType(e.target.value)}
                  fullWidth
                  required
                  variant="outlined"
                  margin="normal"
                  sx={{ ...noBorderStyle, ...focusedLabelStyle, marginTop: "2px" }}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  label="Date"
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  fullWidth
                  variant="outlined"
                  margin="normal"
                  InputLabelProps={{ shrink: true }}
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
                <Button type="submit" fullWidth variant="contained" className="postalbtn" size="large">
                  {editId ? 'Update Postal Dispatch' : 'Create Postal Dispatch'}
                </Button>
              </Grid>
            </Grid>
          </form>

          <Box mt={4}>
            <Typography fontSize="17px" color="orange" marginTop="10px" marginBottom="0px">
              Postal Dispatch List
            </Typography>

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
                <Tooltip title="View Columns">
                  <IconButton
                    onClick={() => handleIconClick('view')}
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
                      referenceNo: true,
                      toTitle: true,
                      fromTitle: true,
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

            {/* Table and its contents */}
            <TableContainer className='postalcontainer'>
              <Table className='postaltable'>
                <TableHead>
                  <TableRow>
                    {columns.referenceNo && <TableCell>Reference No</TableCell>}
                    {columns.toTitle && <TableCell>To Title</TableCell>}
                    {columns.fromTitle && <TableCell>From Title</TableCell>}
                    {columns.date && <TableCell>Date</TableCell>}
                    {columns.action && <TableCell>Actions</TableCell>}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {dispatchList.map((dispatch) => (
                    <TableRow key={dispatch.id}>
                      {columns.referenceNo && <TableCell>{dispatch.reference_no}</TableCell>}
                      {columns.toTitle && <TableCell>{dispatch.to_title}</TableCell>}
                      {columns.fromTitle && <TableCell>{dispatch.from_title}</TableCell>}
                      {columns.date && <TableCell>{dispatch.date}</TableCell>}
                      {columns.action && (
                        <TableCell>
                          <IconButton onClick={() => handleEdit(dispatch)}>
                            <EditIcon />
                          </IconButton>
                          <IconButton 
                            onClick={() => handleDelete(dispatch.id)} 
                            sx={{ color: 'red' }}
                          >
                            <DeleteIcon />
                          </IconButton>
                        </TableCell>
                      )}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Box>
        </Paper>
      </Box>

      {/* Snackbar and error handling */}
      <Snackbar
        open={openSnackbar}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
      >
        <Alert onClose={handleCloseSnackbar} severity="success" sx={{ width: '100%' }}>
          {editId ? 'Dispatch updated successfully!' : 'Dispatch created successfully!'}
        </Alert>
      </Snackbar>

      {error && (
        <Snackbar
          open={!!error}
          autoHideDuration={6000}
          onClose={() => setError(null)}
        >
          <Alert onClose={() => setError(null)} severity="error" sx={{ width: '100%' }}>
            {error}
          </Alert>
        </Snackbar>
      )}
    </Container>
  );
};

export default PostalDispatch
