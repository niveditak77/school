'use client';

import { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Container, Paper, Grid, TextField, Button, Typography, Box, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, IconButton, Alert, RadioGroup, FormControlLabel, Radio
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import { RiDiscountPercentFill } from "react-icons/ri";
import './discount.css';

const FeesDiscountPage = () => {
  const [feesDiscounts, setFeesDiscounts] = useState([]);
  const [session, setSession] = useState('2023-24'); // Example session
  const [name, setName] = useState('');
  const [code, setCode] = useState('');
  const [type, setType] = useState('percentage');
  const [percentage, setPercentage] = useState('');
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [editId, setEditId] = useState(null);
  const [search, setSearch] = useState('');
  const [error, setError] = useState('');

  const fetchFeesDiscounts = async () => {
    try {
      const response = await axios.get('/api/fees_collection/fees_discount');
      setFeesDiscounts(response.data);
      console.log('Fetched fees discounts:', response.data);
    } catch (error) {
      console.error('Error fetching fees discounts:', error);
    }
  };

  useEffect(() => {
    fetchFeesDiscounts();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      if (editId) {
        await axios.put(`/api/fees_collection/fees_discount`, { id: editId, session_id: session, name, code, type, percentage, amount, description });
      } else {
        await axios.post('/api/fees_collection/fees_discount', { session_id: session, name, code, type, percentage, amount, description });
      }
      setName('');
      setCode('');
      setType('percentage');
      setPercentage('');
      setAmount('');
      setDescription('');
      setEditId(null);
      fetchFeesDiscounts();
    } catch (error) {
      console.error('Error saving fees discount:', error.response?.data);
      setError(`Error saving fees discount: ${error.response?.data.error}`);
    }
  };

  const handleDelete = async (id) => {
    setError('');
    try {
      await axios.delete(`/api/fees_collection/fees_discount`, { params: { id } });
      fetchFeesDiscounts();
    } catch (error) {
      console.error('Error deleting fees discount:', error.response?.data);
      setError(`Error deleting fees discount: ${error.response?.data.error}`);
    }
  };

  const handleEdit = (feesDiscount) => {
    setName(feesDiscount.name);
    setCode(feesDiscount.code);
    setType(feesDiscount.type);
    setPercentage(feesDiscount.percentage);
    setAmount(feesDiscount.amount);
    setDescription(feesDiscount.description);
    setEditId(feesDiscount.id);
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
   
    {error && <Alert severity="error">{error}</Alert>}
    <Grid container spacing={2}>
      <Grid item xs={12} md={12}>
        <Paper elevation={3} style={{ padding: '16px', borderRadius: '8px' }}>
        <Typography
      variant="h5"
      align="left"
      marginBottom="25px"
      marginLeft="5px"
      fontFamily="Verdana, Geneva, Tahoma, sans-serif"
      gutterBottom
    >
      <RiDiscountPercentFill
        style={{
          marginRight: '9px',
          verticalAlign: 'middle',
          color: 'orange',
          fontSize: '32px',
          marginTop: '-7px',
          fontWeight: 'bold',
        }}
      />
      Fee Discount
    </Typography>
          <form onSubmit={handleSubmit}>
            <Grid container spacing={2}>
              {/* Name and Discount Code Inputs in One Row */}
              <Grid item xs={12} md={6}>
                <TextField
                  label="Name"
                  name="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  fullWidth
                  required
                  variant="outlined"
                  margin="normal"
                  sx={{ ...noBorderStyle, ...focusedLabelStyle }}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  label="Discount Code"
                  name="code"
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  fullWidth
                  required
                  variant="outlined"
                  margin="normal"
                  sx={{ ...noBorderStyle, ...focusedLabelStyle }}
                />
              </Grid>

              {/* Discount Type Radio Buttons */}
              <Grid item xs={12}>
  <Typography fontSize="16px" color="orange" marginLeft="5px" gutterBottom>
    Discount Type
  </Typography>
  <RadioGroup
    row // Aligns the radio buttons horizontally
    value={type}
    onChange={(e) => setType(e.target.value)}
    sx={{
      justifyContent: 'flex-start', // Aligns the radio buttons to the left
      marginLeft: '5px', // Adds some left margin for better alignment
    }}
  >
    <FormControlLabel
      value="percentage"
      control={
        <Radio
          sx={{
            color: 'gray',
            '&.Mui-checked': {
              color: 'orange', // Orange when checked
            },
          }}
        />
      }
      label="Percentage"
      sx={{ marginRight: '20px' }} // Adjusts space between labels
    />
    <FormControlLabel
      value="fix"
      control={
        <Radio
          sx={{
            color: 'gray',
            '&.Mui-checked': {
              color: 'orange', // Orange when checked
            },
          }}
        />
      }
      label="Fix Amount"
    />
  </RadioGroup>
</Grid>


              {/* Conditionally Rendered Inputs Based on Discount Type */}
              {type === 'percentage' && (
                <Grid item xs={12} md={12}>
                  <TextField
                    label="Percentage (%)"
                    name="percentage"
                    value={percentage}
                    onChange={(e) => setPercentage(e.target.value)}
                    fullWidth
                    variant="outlined"
                    margin="normal"
                    sx={{ ...noBorderStyle, ...focusedLabelStyle }}
                  />
                </Grid>
              )}
              {type === 'fix' && (
                <Grid item xs={12} md={12}>
                  <TextField
                    label="Amount"
                    name="amount"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    fullWidth
                    variant="outlined"
                    margin="normal"
                    sx={{ ...noBorderStyle, ...focusedLabelStyle }}
                  />
                </Grid>
              )}

              {/* Description Input */}
              <Grid item xs={12}>
                <TextField
                  label="Description"
                  name="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  fullWidth
                  variant="outlined"
                  margin="normal"
                  sx={{ ...noBorderStyle, ...focusedLabelStyle }}
                />
              </Grid>

              {/* Submit Button */}
              <Grid item xs={12}>
                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  className="disbtn"
                >
                  {editId ? 'Update' : 'Save'}
                </Button>
              </Grid>
            </Grid>
          </form>
        </Paper>
      </Grid>
      <Grid item xs={12} md={12}>
        <TextField
          label="Search"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          fullWidth
          variant="outlined"
          style={{ marginBottom: '16px' }}
          sx={{ ...noBorderStyle, ...focusedLabelStyle }}
        />
        <TableContainer component={Paper} className="disconatin">
          <Table className="distable">
            <TableHead>
              <TableRow>
                <TableCell>Name</TableCell>
                <TableCell>Discount Code</TableCell>
                <TableCell>Percentage (%)</TableCell>
                <TableCell>Amount</TableCell>
                <TableCell>Action</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {feesDiscounts
                .filter((fd) =>
                  fd.name?.toLowerCase().includes(search.toLowerCase())
                )
                .map((fd) => (
                  <TableRow key={fd.id}>
                    <TableCell>{fd.name}</TableCell>
                    <TableCell>{fd.code}</TableCell>
                    <TableCell>
                      {fd.type === 'percentage' ? fd.percentage : ''}
                    </TableCell>
                    <TableCell>
                      {fd.type === 'fix' ? fd.amount : ''}
                    </TableCell>
                    <TableCell>
                      <IconButton onClick={() => handleEdit(fd)}>
                        <EditIcon />
                      </IconButton>
                      <IconButton onClick={() => handleDelete(fd.id)}>
                        <DeleteIcon style={{ color: 'red' }} />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Grid>
    </Grid>
  </Box>
</Container>

  );
};

export default FeesDiscountPage;
