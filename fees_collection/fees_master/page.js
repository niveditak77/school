'use client';

import { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Container, Paper, Grid, TextField, Button, Typography, Box, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, IconButton, Alert, MenuItem, Select, InputLabel, FormControl, RadioGroup, FormControlLabel, Radio
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import { FaRegMoneyBill1 } from "react-icons/fa6";
import './master.css';

const FeesMasterPage = () => {
  const [feesMasters, setFeesMasters] = useState([]);
  const [feeGroups, setFeeGroups] = useState([]);
  const [feeTypes, setFeeTypes] = useState([]);
  const [filteredFeeTypes, setFilteredFeeTypes] = useState([]);
  const [feeGroup, setFeeGroup] = useState('');
  const [feeType, setFeeType] = useState('');
  const [session, setSession] = useState('2023-24'); // Example session
  const [amount, setAmount] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [fineType, setFineType] = useState('none');
  const [finePercentage, setFinePercentage] = useState('');
  const [fineAmount, setFineAmount] = useState('');
  const [description, setDescription] = useState('');
  const [editId, setEditId] = useState(null);
  const [search, setSearch] = useState('');
  const [error, setError] = useState('');

  const fetchFeesMasters = async () => {
    try {
      const response = await axios.get('/api/fees_collection/fees_master');
      setFeesMasters(response.data);
      console.log('Fetched fees masters:', response.data);
    } catch (error) {
      console.error('Error fetching fees masters:', error);
    }
  };

  const fetchFeeGroups = async () => {
    try {
      const response = await axios.get('/api/fees_collection/fees_group');
      setFeeGroups(response.data);
      console.log('Fetched fee groups:', response.data);
    } catch (error) {
      console.error('Error fetching fee groups:', error);
    }
  };

  const fetchFeeTypes = async () => {
    try {
      const response = await axios.get('/api/fees_collection/fees_type');
      setFeeTypes(response.data);
      console.log('Fetched fee types:', response.data);
    } catch (error) {
      console.error('Error fetching fee types:', error);
    }
  };

  useEffect(() => {
    fetchFeesMasters();
    fetchFeeGroups();
    fetchFeeTypes();
  }, []);

  useEffect(() => {
    if (feeGroup) {
      const filteredTypes = feeTypes.filter(type => type.group_id === parseInt(feeGroup));
      setFilteredFeeTypes(filteredTypes);
      console.log('Filtered fee types:', filteredTypes);
    } else {
      setFilteredFeeTypes([]);
    }
  }, [feeGroup, feeTypes]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      if (editId) {
        await axios.put(`/api/fees_collection/fees_master`, { id: editId, fee_groups_id: feeGroup, feetype_id: feeType, session_id: session, amount, fine_type: fineType, due_date: dueDate, fine_percentage: finePercentage, fine_amount: fineAmount, description });
      } else {
        await axios.post('/api/fees_collection/fees_master', { fee_groups_id: feeGroup, feetype_id: feeType, session_id: session, amount, fine_type: fineType, due_date: dueDate, fine_percentage: finePercentage, fine_amount: fineAmount, description });
      }
      setFeeGroup('');
      setFeeType('');
      setSession('');
      setAmount('');
      setDueDate('');
      setFineType('none');
      setFinePercentage('');
      setFineAmount('');
      setDescription('');
      setEditId(null);
      fetchFeesMasters();
    } catch (error) {
      console.error('Error saving fees master:', error.response?.data);
      setError(`Error saving fees master: ${error.response?.data.error}`);
    }
  };

  const handleDelete = async (id) => {
    setError('');
    try {
      await axios.delete(`/api/fees_collection/fees_master`, { params: { id } });
      fetchFeesMasters();
    } catch (error) {
      console.error('Error deleting fees master:', error.response?.data);
      setError(`Error deleting fees master: ${error.response?.data.error}`);
    }
  };

  const handleEdit = (feesMaster) => {
    setFeeGroup(feesMaster.fee_groups_id);
    setFeeType(feesMaster.feetype_id);
    setSession(feesMaster.session_id);
    setAmount(feesMaster.amount);
    setDueDate(feesMaster.due_date);
    setFineType(feesMaster.fine_type);
    setFinePercentage(feesMaster.fine_percentage);
    setFineAmount(feesMaster.fine_amount);
    setDescription(feesMaster.description);
    setEditId(feesMaster.id);
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
            <Typography variant="h5" align="left" marginBottom="25px" marginLeft='5px' fontFamily="Verdana, Geneva, Tahoma, sans-serif" gutterBottom>
          <FaRegMoneyBill1  style={{ marginRight: '9px', verticalAlign: 'middle', color: 'orange', fontSize: '30px', marginTop: '-4px', fontWeight: 'bold' }} />
         Fee Master
        </Typography>
        <form onSubmit={handleSubmit}>
  <Grid container spacing={2}>
    {/* Fees Group Select */}
    <Grid item xs={12} md={6}>
      <FormControl fullWidth variant="outlined" margin="normal">
        <InputLabel sx={{ '&.Mui-focused': { color: 'orange' } }}>Fees Group</InputLabel>
        <Select
          value={feeGroup}
          onChange={(e) => setFeeGroup(e.target.value)}
          label="Fees Group"
          sx={{ ...noBorderStyle, ...focusedLabelStyle }}
        >
          {feeGroups.map((group) => (
            <MenuItem key={group.id} value={group.id}>
              {group.name}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </Grid>

    {/* Fees Type Select */}
    <Grid item xs={12} md={6}>
      <FormControl fullWidth variant="outlined" margin="normal">
        <InputLabel sx={{ '&.Mui-focused': { color: 'orange' } }}>Fees Type</InputLabel>
        <Select
          value={feeType}
          onChange={(e) => setFeeType(e.target.value)}
          label="Fees Type"
          sx={{ ...noBorderStyle, ...focusedLabelStyle }}
        >
          {filteredFeeTypes.map((type) => (
            <MenuItem key={type.id} value={type.id}>
              {type.type}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </Grid>

    {/* Row with Two Inputs: Due Date and Amount */}
    <Grid item xs={12} md={6}>
      <TextField
        label="Due Date"
        name="due_date"
        type="date"
        value={dueDate}
        onChange={(e) => setDueDate(e.target.value)}
        fullWidth
        variant="outlined"
        margin="normal"
        sx={{ ...noBorderStyle, ...focusedLabelStyle }}
        InputLabelProps={{
          shrink: true,
        }}
      />
    </Grid>
    <Grid item xs={12} md={6}>
      <TextField
        label="Amount"
        name="amount"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
        fullWidth
        required
        variant="outlined"
        margin="normal"
        sx={{ ...noBorderStyle, ...focusedLabelStyle }}
      />
    </Grid>

    {/* Fine Type RadioGroup */}
    <Grid item xs={12}>
      <Typography fontSize="17px" marginLeft="9px" marginTop="20px" color="orange" gutterBottom>
        Fine Type
      </Typography>
      <RadioGroup
        value={fineType}
        onChange={(e) => setFineType(e.target.value)}
        row
        sx={{ ml: 1 }}
      >
        <FormControlLabel
          value="none"
          control={<Radio sx={{ color: 'gray', '&.Mui-checked': { color: 'orange' } }} />}
          label="None"
          sx={{ color: 'orange', '& .MuiFormControlLabel-label': { color: 'gray' } }}
        />
        <FormControlLabel
          value="percentage"
          control={<Radio sx={{ color: 'gray', '&.Mui-checked': { color: 'orange' } }} />}
          label="Percentage"
          sx={{ color: 'orange', '& .MuiFormControlLabel-label': { color: 'gray' } }}
        />
        <FormControlLabel
          value="fix"
          control={<Radio sx={{ color: 'gray', '&.Mui-checked': { color: 'orange' } }} />}
          label="Fix Amount"
          sx={{ color: 'orange', '& .MuiFormControlLabel-label': { color: 'gray' } }}
        />
      </RadioGroup>
    </Grid>

    {/* Additional Inputs for Fine Details */}
    {fineType === 'percentage' && (
      <Grid item xs={12} md={12}>
        <TextField
          label="Percentage (%)"
          name="fine_percentage"
          value={finePercentage}
          onChange={(e) => setFinePercentage(e.target.value)}
          fullWidth
          variant="outlined"
          margin="normal"
          sx={{ ...noBorderStyle, ...focusedLabelStyle }}
        />
      </Grid>
    )}
    {fineType === 'fix' && (
      <Grid item xs={12} md={12}>
        <TextField
          label="Fix Amount"
          name="fine_amount"
          value={fineAmount}
          onChange={(e) => setFineAmount(e.target.value)}
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
      <Button type="submit" fullWidth variant="contained" className="masterbtn">
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
            <TableContainer component={Paper} className='masterconatin'>
              <Table className='mastertable'>
                <TableHead>
                  <TableRow>
                    <TableCell>Fees Group</TableCell>
                    <TableCell>Fees Code</TableCell>
                    <TableCell>Amount</TableCell>
                    <TableCell>Fine Type</TableCell>
                    <TableCell>Due Date</TableCell>
                    <TableCell>Fine Percentage</TableCell>
                    <TableCell>Fine Amount</TableCell>
                    <TableCell>Action</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {feesMasters
                    .filter((fm) => fm.fee_type?.toLowerCase().includes(search.toLowerCase()))
                    .map((fm) => (
                      <TableRow key={fm.id}>
                        <TableCell>{fm.fee_group}</TableCell>
                        <TableCell>{fm.fee_code} ({fm.fee_type})</TableCell>
                        <TableCell>{fm.amount}</TableCell>
                        <TableCell>{fm.fine_type}</TableCell>
                        <TableCell>{fm.due_date}</TableCell>
                        <TableCell>{fm.fine_percentage}</TableCell>
                        <TableCell>{fm.fine_amount}</TableCell>
                        <TableCell>
                          <IconButton onClick={() => handleEdit(fm)}>
                            <EditIcon />
                          </IconButton>
                          <IconButton onClick={() => handleDelete(fm.id)}>
                            <DeleteIcon style={{color:'red'}}/>
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

export default FeesMasterPage;
