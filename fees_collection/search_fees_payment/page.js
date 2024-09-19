"use client";

import { useState } from 'react';
import axios from 'axios';
import {
  Container, Paper, Grid, Button, Typography, Box, TextField, Alert
} from '@mui/material';
import { FaSearchDollar } from "react-icons/fa";
import { styled } from '@mui/material/styles';

const SearchFeesPayment = () => {
  const [paymentId, setPaymentId] = useState('');
  const [paymentDetails, setPaymentDetails] = useState(null);
  const [error, setError] = useState('');

  const handleSearch = () => {
    if (!paymentId) {
      setError('Payment ID is required');
      return;
    }

    setError('');
    setPaymentDetails(null);

    axios.get(`/api/fees_collection/search_fees_payment?paymentId=${paymentId}`)
      .then(response => {
        setPaymentDetails(response.data);
      })
      .catch(error => {
        console.error('Error fetching payment details:', error);
        setError('Error fetching payment details');
      });
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

  const PayButton = styled(Button)({
    borderRadius: '20px',
    backgroundColor: '#44b8ab',
    textTransform: 'none',
    width: '100px',
    fontSize: '15px',
    '&:hover': {
      backgroundColor: '#89d6cd',
    },
  });

  return (
    <Container>
      <Box mt={4} mb={4}>
        <Typography
          variant="h5"
          align="left"
          marginBottom="25px"
          fontFamily="Verdana, Geneva, Tahoma, sans-serif"
          gutterBottom
        >
          <FaSearchDollar
            style={{
              marginRight: '9px',
              verticalAlign: 'middle',
              color: 'orange',
              fontSize: '26px',
              marginTop: '-10px',
              fontWeight: 'bold',
            }}
          />
          Search Fee Payment
        </Typography>
        {error && <Alert severity="error">{error}</Alert>}
        <Paper style={{ padding: '16px', marginBottom: '20px' }}>
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} md={12}>
              <TextField
                label="Payment ID"
                value={paymentId}
                onChange={(e) => setPaymentId(e.target.value)}
                fullWidth
                variant="outlined"
                sx={{ ...noBorderStyle, ...focusedLabelStyle }}
                required
              />
            </Grid>
            <Grid item xs={12} md={2}>
              <PayButton onClick={handleSearch} style={{color:'white'}}>Search</PayButton>
            </Grid>
          </Grid>
        </Paper>
        {paymentDetails && (
          <Paper style={{ padding: '16px', marginBottom: '20px' }}>
            <Typography variant="h6">Payment Details</Typography>
            <Grid container spacing={2}>
              <Grid item xs={12} md={6}>
                <Typography>Admission No: {paymentDetails.admission_no}</Typography>
                <Typography>Name: {paymentDetails.name}</Typography>
                <Typography>Class (Section): {paymentDetails.class} ({paymentDetails.section})</Typography>
              </Grid>
              <Grid item xs={12} md={6}>
                <Typography>Payment Date: {paymentDetails.payment_date}</Typography>
                <Typography>Amount: {paymentDetails.amount}</Typography>
                <Typography>Status: {paymentDetails.status}</Typography>
              </Grid>
            </Grid>
          </Paper>
        )}
      </Box>
    </Container>
  );
};

export default SearchFeesPayment;
