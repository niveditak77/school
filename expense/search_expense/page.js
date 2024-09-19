"use client"
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Paper, Typography, TextField, Button, Grid, Container, MenuItem, Select, InputLabel, FormControl, Dialog, DialogTitle, DialogContent, DialogActions, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, IconButton
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { styled } from '@mui/system';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { Box } from '@mui/system';
import { FaSearchDollar } from "react-icons/fa";
import './searchexpense.css';

const theme = createTheme({
  palette: {
    text: {
      primary: '#000000',  // Ensure this is defined
      secondary: '#585858'
    }
  }
});

const StyledTableCell = styled(TableCell)({
  fontFamily: "Arial, sans-serif",
  fontSize: '16px',
  color: '#000000',
  borderBottom: '1px solid #e0e0e0',
  padding: '10px 16px',
});

const StyledTableRow = styled(TableRow)({
  '&:nth-of-type(odd)': {
    backgroundColor: 'white',
  },
  '&:nth-of-type(even)': {
    backgroundColor: 'white',
  },
  '&:hover': {
    backgroundColor: '#f2f2f2',
  },
  cursor: 'pointer',
});

const StyledTableHeadRow = styled(TableRow)({
  backgroundColor: '#F4F4F5',
  fontWeight: 'bold',
  fontFamily: "Arial, sans-serif",
});

const StyledTableContainer = styled(TableContainer)({
  backgroundColor: '#FFFFFF',
  boxShadow: '0 5px 15px rgba(0, 0, 0, 0.1)',
  borderRadius: '10px',
  marginTop: '20px',
});

const SearchExpense = () => {
  const [searchType, setSearchType] = useState('');
  const [searchValue, setSearchValue] = useState('');
  const [expenseList, setExpenseList] = useState([]);
  const [editingExpense, setEditingExpense] = useState(null);
  const [openModal, setOpenModal] = useState(false);

  useEffect(() => {
    fetchExpenseList();
  }, []);

  const fetchExpenseList = async () => {
    try {
      const response = await axios.get('/api/expense');
      setExpenseList(response.data);
    } catch (error) {
      console.error('Error fetching expense list:', error);
    }
  };

  const handleSearch = async () => {
    try {
      const response = await axios.get('/api/expense/search', {
        params: {
          type: searchType,
          value: searchValue
        }
      });
      setExpenseList(response.data);
    } catch (error) {
      console.error('Error searching expenses:', error);
    }
  };

  // const onDelete = async (id) => {
  //   try {
  //     await axios.delete(`/api/expense/${id}`);
  //     const updatedExpenses = expenseList.filter(expense => expense.id !== id);
  //     setExpenseList(updatedExpenses);
  //   } catch (error) {
  //     console.error('Error deleting expense:', error);
  //   }
  // };
  const onDelete = async (id) => {
    try {
      const response = await axios.delete(`/api/expense/${id}`);
      if(response.status === 200) {
        const updatedExpenses = expenseList.filter(expense => expense.id !== id);
        setExpenseList(updatedExpenses);
      } else {
        console.error('Failed to delete the expense with status:', response.status);
      }
    } catch (error) {
      console.error('Error deleting expense:', error);
    }
  };
  
  const onEdit = (expense) => {
    setEditingExpense(expense);
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
    setEditingExpense(null);
  };

  const handleUpdateExpense = async (updatedExpense) => {
    try {
      const response = await axios.put(`/api/expense/${updatedExpense.id}`, updatedExpense);
      const newList = expenseList.map(expense =>
        expense.id === updatedExpense.id ? { ...expense, ...response.data } : expense
      );
      setExpenseList(newList);
      handleCloseModal();
    } catch (error) {
      console.error('Error updating expense:', error);
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <Container maxWidth="lg">
        <Box mt={4} mb={4}>
          <Paper elevation={3} style={{ padding: '16px', borderRadius: '8px' , marginBottom:'10%'}}>
          <Typography variant="h4" align="left" style={{ fontSize: '30px', marginBottom: '20px' }} gutterBottom>  
  <FaSearchDollar style={{ fontSize: "22px", marginRight: '10px', color: 'orange' }} />
  Search Expense
</Typography>

            <Grid container spacing={2}>
              <Grid item xs={12} md={6}>
                <FormControl fullWidth variant="outlined" margin="normal">
                  <InputLabel htmlFor="search-type">Search Type</InputLabel>
                  <Select
                    id="search-type"
                    value={searchType}
                    onChange={(e) => setSearchType(e.target.value)}
                    label="Search Type"
                    required
                    sx={{
                      background: '#f0f0f0',
                      borderRadius: '20px',
                      '& .MuiOutlinedInput-notchedOutline': {
                        border: 'none',
                      },
                      '&:hover .MuiInputLabel-root': { color: 'orange' },
                      '& .Mui-focused .MuiInputLabel-root': { color: 'orange' },
                    }}
                  >
                  <MenuItem value="name" className="menuItemName">Name</MenuItem>
<MenuItem value="invoice_no" className="menuItemInvoiceNo">Invoice Number</MenuItem>
<MenuItem value="exp_category" className="menuItemExpCategory">Expense Head</MenuItem>
<MenuItem value="date" className="menuItemDate">Date</MenuItem>

                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  label="Search"
                  value={searchValue}
                  onChange={(e) => setSearchValue(e.target.value)}
                  fullWidth
                  variant="outlined"
                  margin="normal"
                  required
                  sx={{
                    background: '#f0f0f0',
                    borderRadius: '20px !important',
                    '& .MuiOutlinedInput-notchedOutline': {
                      border: 'none',
                    },
                    '&:hover .MuiInputLabel-root': { color: 'orange' },
                    '& .Mui-focused .MuiInputLabel-root': { color: 'orange' },
                    '.MuiOutlinedInput-input': {
                      color: 'black',
                    }
                  }}
                />
              </Grid>
              <Grid item xs={12} container justifyContent="flex-end">
                <Button
                  onClick={handleSearch}
                  type="submit"
                  variant="contained"
                  size="medium"
                  sx={{
                    float: 'right',
                    textTransform: 'none',
                    width: '15%',
                    fontSize: '15px',
                    borderRadius: '20px',
                    backgroundColor: '#44b8ab',
                    color: 'white',
                    '&:hover': {
                      backgroundColor: '#89d6cd'
                    }
                  }}
                >
                  Search
                </Button>
              </Grid>
              <Grid item xs={12} style={{ marginTop: '16px' }}>
  <Box display="flex" alignItems="center" ml={1}>
    <Typography variant="h6" style={{ color: 'orange' }}>Expense List</Typography>
    <Box flexGrow={1} ml={2} borderBottom="1.2px solid grey" />
  </Box>
</Grid>

              <Grid item xs={12}>
                <StyledTableContainer component={Paper} sx={{ marginTop: '10px', color: 'orange' }}>
                  <Table>
                    <TableHead>
                      <StyledTableHeadRow>
                        <StyledTableCell>Name</StyledTableCell>
                        <StyledTableCell>Invoice Number</StyledTableCell>
                        <StyledTableCell>Expense Head</StyledTableCell>
                        <StyledTableCell>Amount</StyledTableCell>
                        <StyledTableCell>Date</StyledTableCell>
                        <StyledTableCell align="center">Action</StyledTableCell>
                      </StyledTableHeadRow>
                    </TableHead>
                    <TableBody>
                      {expenseList.map((expense) => (
                        <StyledTableRow key={expense.id}>
                          <StyledTableCell component="th" scope="row">{expense.name}</StyledTableCell>
                          <StyledTableCell>{expense.invoice_no}</StyledTableCell>
                          <StyledTableCell>{expense.exp_category}</StyledTableCell>
                          <StyledTableCell>{expense.amount}</StyledTableCell>
                          <StyledTableCell>{expense.date}</StyledTableCell>
                          <StyledTableCell align="center">
                          <IconButton onClick={() => onEdit(expense)} size="small" style={{ color: '#89d6cd' }}>
  <EditIcon />
</IconButton>
<IconButton onClick={() => onDelete(expiece.id)} size="small" style={{ color: 'red' }}>
  <DeleteIcon />
</IconButton>


                          </StyledTableCell>
                        </StyledTableRow>
                      ))}
                    </TableBody>
                  </Table>
                </StyledTableContainer>
              </Grid>
            </Grid>
          </Paper>
        </Box>
        <Dialog open={openModal} onClose={handleCloseModal}>
          <DialogTitle>Edit Expense</DialogTitle>
          <DialogContent>
            <form style={{ display: "flex", flexDirection: "column", gap: "20px",marginTop:"10px" }}>
              <TextField
                label="Name"
                variant="outlined"
                fullWidth
                value={editingExpense?.name || ''}
                onChange={(e) => setEditingExpense({ ...editingExpense, name: e.target.value })}
                required
              />
              <TextField
                label="Invoice Number"
                variant="outlined"
                fullWidth
                value={editingExpense?.invoice_no || ''}
                onChange={(e) => setEditingExpense({ ...editingExpense, invoice_no: e.target.value })}
                required
              />
              <TextField
                label="Expense Head"
                variant="outlined"
                fullWidth
                value={editingExpense?.exp_category || ''}
                onChange={(e) => setEditingExpense({ ...editingExpense, exp_category: e.target.value })}
                required
              />
              <TextField
                label="Amount"
                variant="outlined"
                fullWidth
                value={editingExpense?.amount || ''}
                onChange={(e) => setEditingExpense({ ...editingExpense, amount: e.target.value })}
                required
              />
              <TextField
                label="Date"
                type="date"
                InputLabelProps={{
                  shrink: true,
                }}
                variant="outlined"
                fullWidth
                value={editingExpense?.date || ''}
                onChange={(e) => setEditingExpense({ ...editingExpense, date: e.target.value })}
                required
              />
            </form>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseModal} color="primary">
              Cancel
            </Button>
            <Button onClick={handleUpdateExpense} color="primary">
              Save
            </Button>
          </DialogActions>
        </Dialog>
      </Container>
    </ThemeProvider>
  );
};

export default SearchExpense;
