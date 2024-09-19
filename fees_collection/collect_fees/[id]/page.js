"use client";

import { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Container, Paper, Grid, Button, Typography, Box, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Alert
} from '@mui/material';
import { useRouter } from 'next/navigation';
import { useParams } from 'next/navigation';

const CollectFeesDetailPage = () => {
  const [studentDetails, setStudentDetails] = useState({});
  const [feeDetails, setFeeDetails] = useState([]);
  const [error, setError] = useState('');
  const { id } = useParams();
  const router = useRouter();

  useEffect(() => {
    axios.get(`/api/fees_collection/student_fees/${id}`)
      .then(response => {
        setStudentDetails(response.data.studentDetails);
        setFeeDetails(response.data.feeDetails);
      })
      .catch(error => {
        console.error('Error fetching student fee details:', error);
        setError('Error fetching student fee details');
      });
  }, [id]);

  return (
    <Container>
      <Box mt={4} mb={4}>
        <Typography variant="h4" align="center" gutterBottom>
          Student Fees
        </Typography>
        {error && <Alert severity="error">{error}</Alert>}
        <Button onClick={() => router.back()} variant="contained" color="primary" style={{ marginBottom: '20px' }}>
          Back
        </Button>
        <Paper style={{ padding: '16px', marginBottom: '20px' }}>
          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <Typography variant="h6">Name: {studentDetails.firstname} {studentDetails.lastname}</Typography>
              <Typography>Father Name: {studentDetails.father_name}</Typography>
              <Typography>Mobile Number: {studentDetails.mobile_no}</Typography>
            </Grid>
            <Grid item xs={12} md={6}>
              <Typography>Class (Section): {studentDetails.class} ({studentDetails.section})</Typography>
              <Typography>Admission No: {studentDetails.roll_no}</Typography>
              <Typography>Category: {studentDetails.category}</Typography>
            </Grid>
          </Grid>
        </Paper>
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Fees Group</TableCell>
                <TableCell>Fees Code</TableCell>
                <TableCell>Due Date</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Amount</TableCell>
                <TableCell>Payment ID</TableCell>
                <TableCell>Mode</TableCell>
                <TableCell>Date</TableCell>
                <TableCell>Discount</TableCell>
                <TableCell>Fine</TableCell>
                <TableCell>Paid</TableCell>
                <TableCell>Balance</TableCell>
                <TableCell>Action</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {feeDetails.map((fee, index) => (
                <TableRow key={index}>
                  <TableCell>{fee.fee_group}</TableCell>
                  <TableCell>{fee.fee_type}</TableCell>
                  <TableCell>{fee.due_date}</TableCell>
                  <TableCell>{fee.status}</TableCell>
                  <TableCell>{fee.amount}</TableCell>
                  <TableCell>{fee.payment_id}</TableCell>
                  <TableCell>{fee.payment_mode}</TableCell>
                  <TableCell>{fee.payment_date}</TableCell>
                  <TableCell>{fee.amount_discount}</TableCell>
                  <TableCell>{fee.amount_fine}</TableCell>
                  <TableCell>{fee.amount_paid}</TableCell>
                  <TableCell>{fee.balance}</TableCell>
                  <TableCell>
                    <Button variant="contained" color="primary">
                      Collect Selected
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        <Box mt={2}>
          <Button variant="contained" color="primary">
            Print Selected
          </Button>
        </Box>
      </Box>
    </Container>
  );
};

export default CollectFeesDetailPage;
