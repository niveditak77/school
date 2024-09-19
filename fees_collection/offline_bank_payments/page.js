"use client";

import { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Container, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography, Box, Button, Alert, TextField, InputAdornment
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import { BsBank } from "react-icons/bs";
import './bank.css';

const OfflineBankPayments = () => {
  const [payments, setPayments] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    axios.get('/api/fees_collection/offline_bank_payments')
      .then(response => {
        setPayments(response.data);
      })
      .catch(error => {
        console.error('Error fetching offline bank payments:', error);
        setError('Error fetching offline bank payments');
      });
  }, []);

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
  };

  const filteredPayments = payments.filter(payment =>
    payment.name.toLowerCase().includes(searchTerm.toLowerCase())
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
      color: 'orange',
    }
  };

  return (
    <Container>
      <Box mt={4} mb={4}>
        <Typography variant="h5" align="left" marginBottom="40px" fontFamily="Verdana, Geneva, Tahoma, sans-serif" gutterBottom>
          <BsBank style={{ marginRight: '9px', verticalAlign: 'middle', color: 'orange', fontSize: '26px', marginTop: '-10px', fontWeight: 'bold' }} />
          Offline Bank Payments
        </Typography>
        {error && <Alert severity="error">{error}</Alert>}
        <TextField
          label="Search..."
          value={searchTerm}
          onChange={handleSearch}
          fullWidth
          variant="outlined"
          sx={{ ...noBorderStyle, ...focusedLabelStyle }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
          InputLabelProps={{
            style: { color: 'orange' }  // Make the label orange
          }}
          style={{ marginBottom: '20px' }}
        />
        <TableContainer component={Paper} className='bankcontain'>
          <Table className='banktable'>
            <TableHead>
              <TableRow>
                <TableCell>Request ID</TableCell>
                <TableCell>Admission No</TableCell>
                <TableCell>Name</TableCell>
                <TableCell>Class</TableCell>
                <TableCell>Payment Date</TableCell>
                <TableCell>Submit Date</TableCell>
                <TableCell>Amount</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Status Date</TableCell>
                <TableCell>Payment ID</TableCell>
                <TableCell>Action</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredPayments.map((payment) => (
                <TableRow key={payment.request_id}>
                  <TableCell>{payment.request_id}</TableCell>
                  <TableCell>{payment.admission_no}</TableCell>
                  <TableCell>{payment.name}</TableCell>
                  <TableCell>{`${payment.class}(${payment.section})`}</TableCell>
                  <TableCell>{payment.payment_date}</TableCell>
                  <TableCell>{payment.submit_date}</TableCell>
                  <TableCell>{payment.amount}</TableCell>
                  <TableCell>
                    <span style={{ color: payment.status === 'Approved' ? 'green' : 'red' }}>
                      {payment.status}
                    </span>
                  </TableCell>
                  <TableCell>{payment.status_date}</TableCell>
                  <TableCell>{payment.payment_id}</TableCell>
                  <TableCell>
                    <Button variant="contained" className="bankbtn" color="primary">
                      View
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
    </Container>
  );
};

export default OfflineBankPayments;
