'use client';

import { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Paper, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TablePagination, TextField, Container, Box
} from '@mui/material';
import './email_sms.css';
import { IoIosSend } from "react-icons/io";

const EmailSmsLog = () => {
  const [logs, setLogs] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [search, setSearch] = useState('');
  const [isFocused, setIsFocused] = useState(false); 


  useEffect(() => {
    const fetchLogs = async () => {
      const response = await axios.get('/api/communicate/email_sms_logs');
      setLogs(response.data);
    };

    fetchLogs();
  }, []);

  const handleSearchChange = (event) => {
    setSearch(event.target.value);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const filteredLogs = logs.filter(log =>
    log.title.toLowerCase().includes(search.toLowerCase()) ||
    log.description.toLowerCase().includes(search.toLowerCase())
  );

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

  return (
    <Container maxWidth="lg" style={{ padding: '20px 40px' }}>
      <Box mt={4} mb={4}>
        <Typography variant="h5" align="left" marginBottom="20px" marginTop="-20px" fontFamily="Verdana, Geneva, Tahoma, sans-serif"gutterBottom>
        <IoIosSend style={{ verticalAlign: 'middle', color: 'orange', fontSize: '33px', marginTop: '-7px' }}/> Email / SMS Log
        </Typography>
        <Paper elevation={3} style={{ padding: '30px 40px', borderRadius: '8px' }}>
        <TextField
            label="Search..."
            className="searchemailsms"
            value={search}
            onChange={handleSearchChange}
            fullWidth
            sx={{ ...noBorderStyle, ...focusedLabelStyle }}
            variant="outlined"
            style={{ marginBottom: '20px' }}
            InputProps={{
              className: 'search-input',
              onFocus: () => setIsFocused(true),  // Handle focus to hide the label
              onBlur: () => setIsFocused(false)  // Handle blur to show the label
            }}
            InputLabelProps={{
              className: isFocused ? 'search-label search-label-hidden' : 'search-label'  // Apply the hiding class conditionally
            }}
          />
          <TableContainer className='emailsmscont'>
            <Table className='emailsmstable'>
              <TableHead>
                <TableRow>
                  <TableCell>Title</TableCell>
                  <TableCell>Description</TableCell>
                  <TableCell>Date</TableCell>
                  <TableCell>Email</TableCell>
                  <TableCell>SMS</TableCell>
                  <TableCell>Group</TableCell>
                  <TableCell>Individual</TableCell>
                  <TableCell>Class</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredLogs.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((log) => (
                  <TableRow key={log.id}>
                    <TableCell>{log.title}</TableCell>
                    <TableCell>{log.description}</TableCell>
                    <TableCell>{log.date}</TableCell>
                    <TableCell>{log.email}</TableCell>
                    <TableCell>{log.sms}</TableCell>
                    <TableCell>{log.group}</TableCell>
                    <TableCell>{log.individual}</TableCell>
                    <TableCell>{log.class}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
          <TablePagination
            rowsPerPageOptions={[10, 25, 50]}
            component="div"
            count={filteredLogs.length}
            rowsPerPage={rowsPerPage}
            page={page}
            className="emailsmsrow"
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </Paper>
      </Box>
    </Container>
  );
};

export default EmailSmsLog;
