"use client"
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Paper, Typography, TextField, Button, Grid, Container, MenuItem, Select, InputLabel, FormControl, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, IconButton, ThemeProvider, createTheme
} from '@mui/material';
import { GiPayMoney } from "react-icons/gi";
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { styled } from '@mui/system';


import './addexpense.css';

// Create a theme instance to override MUI styles globally
const theme = createTheme({
  components: {
    MuiTextField: {
      styleOverrides: {
        root: {
          borderRadius: '20px', // Rounded corners for all TextField components
          border: 'none', // Remove border
          backgroundColor: '#f0f0f0',
          // Apply a background color with the same border-radius
        },
      },
    },
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          borderRadius: '20px', // Ensure that the outline also has the border radius
          border: 'none', // Remove border
          backgroundColor: '#f0f0f0',
           // Consistent background color for all outlined inputs
          '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
            border: 'none', // Remove the border when the input is focused to avoid overlapping the label
          }
        },
        notchedOutline: {
          border: 'none', // Remove the notched outline border altogether
        },
      },
    },
    MuiSelect: {
      styleOverrides: {
        select: {
          borderRadius: '20px', // Specific for select dropdown components
          backgroundColor: '#f0f0f0', // Background color for select
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: '20px', // Apply border-radius to all Paper components
          backgroundColor: '#f0f0f0', // Consistent background for Paper components
        },
      },
    },
  },
});

// Custom styled TableCell to mimic the rounded cell look
const StyledTableCell = styled(TableCell)(({ theme }) => ({
  backgroundColor: 'rgba(255, 255, 255, 0.8)', // Light background for cells
  color: '#000', // Black text
  fontFamily: "'Trebuchet MS', 'Lucida Sans Unicode', 'Lucida Grande', 'Lucida Sans', Arial, sans-serif",
  border: 'none', // Remove default borders
  borderRadius: '8px', // Rounded corners for the cells
  padding: '10px', // Adjust padding as needed
 
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  backgroundColor: '#ffffff', // White background
  borderRadius: '8px', // Rounded corners for the row
  boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)', // Subtle shadow
  marginBottom: '8px', // Spacing between rows
  fontWeight:'bold',
  '&:hover': {
    backgroundColor: '#f7f7f7', 
   
  },
  '& > *': {
    padding: '16px', // Consistent padding for cells
  },
}));

// Custom styled TableContainer to hold the table
const StyledTableContainer = styled(TableContainer)(({ theme }) => ({
  backgroundColor: '#F4F4F5', // Background color for the table container
  borderRadius: '15px', // Rounded corners for the container
  boxShadow: '0 5px 3px rgba(0, 0, 0, 0.2)', // Shadow effect
  padding: '14px', // Padding around the table
}));

const StyledTableHeadRow = styled(TableRow)(({ theme }) => ({
  backgroundColor: '#F4F4F5', // Background color for headers
  cursor: 'pointer',
  fontWeight: 'bold', // Make text bold
  fontFamily: 'Times of Roman', // Maintain the font family
}));

const AddExpense = () => {
  const [expenseHeads, setExpenseHeads] = useState([]);
  const [expenseList, setExpenseList] = useState([]);
  const [selectedExpense, setSelectedExpense] = useState(null);
  const [expHeadId, setExpHeadId] = useState('');
  const [name, setName] = useState('');
  const [invoiceNo, setInvoiceNo] = useState('');
  const [date, setDate] = useState('');
  const [amount, setAmount] = useState('');
  const [note, setNote] = useState('');

  useEffect(() => {
    fetchExpenseHeads();
    fetchExpenseList();
  }, []);

  const fetchExpenseHeads = async () => {
    try {
      const response = await axios.get('/api/expense/expense_head');
      const additionalHeads = [
        { id: 'sports', exp_category: 'Sports accessories' }, // assuming unique id and name for the category
       
      ];setExpenseHeads([...response.data, ...additionalHeads]);
    
    } catch (error) {
      console.error('Error fetching expense heads:', error);
    }
  };

  const fetchExpenseList = async () => {
    try {
      const response = await axios.get('/api/expense');
      setExpenseList(response.data);
    } catch (error) {
      console.error('Error fetching expense list:', error);
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const formData = { exp_head_id: expHeadId, name, invoice_no: invoiceNo, date, amount, note };
    try {
      if (selectedExpense) {
        const response = await axios.put(`/api/expense/${selectedExpense.id}`, formData);
        setExpenseList(expenseList.map(exp => exp.id === selectedExpense.id ? response.data : exp));
      } else {
        const response = await axios.post('/api/expense', formData);
        setExpenseList([...expenseList, response.data]);
      }
      handleReset();
    } catch (error) {
      console.error('Error managing expense:', error);
    }
  };

  const handleEdit = (expense) => {
    setSelectedExpense(expense);
    setExpHeadId(expense.exp_head_id);
    setName(expense.name);
    setInvoiceNo(expense.invoice_no);
    setDate(expense.date);
    setAmount(expense.amount);
    setNote(expense.note);
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`/api/expense/${id}`);
      setExpenseList(expenseList.filter(exp => exp.id !== id));
    } catch (error) {
      console.error('Error deleting expense:', error);
    }
  };

  const handleReset = () => {
    setSelectedExpense(null);
    setExpHeadId('');
    setName('');
    setInvoiceNo('');
    setDate('');
    setAmount('');
    setNote('');
  };

  return (
    <ThemeProvider theme={theme}>
      <Container maxWidth="lg">
        <Paper elevation={3} sx={{ padding: '30px', borderRadius: '12px', backgroundColor: 'white', marginBottom: '80px', color: 'black', marginTop: '30px' }}>
          <Typography variant="h4" align="left" style={{ fontSize:'30px'}} gutterBottom>
            <GiPayMoney style={{ marginRight: '10px', verticalAlign: 'middle', color: 'orange', fontSize:'35px',marginTop:'5px'}} />
            Add Expense
          </Typography>

          <Typography variant="h6" align="left" style={{ marginTop: '40px',color:'orange'}} gutterBottom>
            Expense Details<hr style={{ display: 'inline-block', width: 'calc(100% - 150px)', verticalAlign: 'middle', marginLeft: '155px', marginTop: '-55px', }} />
          </Typography>
          <form onSubmit={handleSubmit}>
            <Grid container spacing={2}>
              <Grid item xs={10} md={5}>
                <FormControl fullWidth variant="outlined" margin="normal">
                  <InputLabel sx={{ color: '#aaa' }}>Expense Head</InputLabel>
                  <Select
                    value={expHeadId}
                    onChange={(e) => setExpHeadId(e.target.value)}
                    label="Expense Head"
                    required
                  >
                    {expenseHeads.map((head) => (
                      <MenuItem key={head.id} value={head.id}>
                        {head.exp_category}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={11} md={4}>
                <TextField
                  label="Name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  fullWidth
                  required
                  variant="outlined"
                  margin="normal"
                />
              </Grid>
              <Grid item xs={12} md={3}>
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
                />
              </Grid>
              <Grid item xs={12} md={3}>
                <TextField
                  label="Invoice Number"
                  value={invoiceNo}
                  onChange={(e) => setInvoiceNo(e.target.value)}
                  fullWidth
                  variant="outlined"
                  margin="normal"
                />
              </Grid>
              <Grid item xs={12} md={3}>
                <TextField
                  label="Amount"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  fullWidth
                  required
                  variant="outlined"
                  margin="normal"
                />
              </Grid>
              <Grid item xs={9} md={6}>
                <TextField
                  label="Note"
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  fullWidth
                  multiline
                  rows={1}
                  variant="outlined"
                  margin="normal"
                />
              </Grid>
              <Grid item xs={12}>
                <Button type="submit" variant="contained" color="primary" size="medium" sx={{ float: 'right' ,textTransform: 'none',fontSize:'15px'}}>
                  {selectedExpense ? 'Update Expense' : 'Add Expense'}
                </Button>
              </Grid>
            </Grid>
          </form>

          <Typography variant="h6" align="left" style={{ marginTop: '30px',color:'orange',marginBottom:'20px'}} gutterBottom>
            Expense List
            <hr style={{ display: 'inline-block', width: 'calc(98% - 110px)', verticalAlign: 'middle', marginLeft: '11px',}} />
          </Typography>
          <StyledTableContainer component={Paper} sx={{transform: 'translateX(-10px)', marginLeft:'9px', width:'98%'}}>
      <Table >
        <TableHead>
          <StyledTableHeadRow sx={{ backgroundColor: '#F4F4F5' , cursor:'pointer',fontWeight:'bold' ,fontFamily:'Times of Roman'}}>
            <TableCell align="left" >Name</TableCell>
            <TableCell align="left">Invoice Number</TableCell>
            <TableCell align="left">Date</TableCell>
            <TableCell align="left">Expense Head</TableCell>
            <TableCell align="left">Amount</TableCell>
            <TableCell align="left">Action</TableCell>
          </StyledTableHeadRow>
        </TableHead>
        <TableBody sx={{  cursor:'pointer' }}>
          {expenseList.map((expense) => (
            <StyledTableRow key={expense.id} >
              <TableCell align="left" >{expense.name}</TableCell>
              <TableCell align="left">{expense.invoice_no}</TableCell>
              <TableCell align="left">{expense.date}</TableCell>
              <TableCell align="left">{expense.exp_category}</TableCell>
              <TableCell align="left">{expense.amount}</TableCell>
              <TableCell align="left">
              <IconButton onClick={() => onEdit(expense)} aria-label="edit">
                  <EditIcon sx={{ color: '#89d6cd' , cursor:'pointer' }} />
                </IconButton>
                <IconButton onClick={() => onDelete(expense.id)} aria-label="delete">
                  <DeleteIcon sx={{ color: 'red' , cursor:'pointer'}} />
                </IconButton>
              </TableCell>
            </StyledTableRow>
          ))}
        </TableBody>
      </Table>
    </StyledTableContainer>
        </Paper>
      </Container>
    </ThemeProvider>
  );
};

export default AddExpense;
