"use client"
import { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Paper, Typography, TextField, Button, Box, Grid, Container, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, IconButton
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import { GiTakeMyMoney } from "react-icons/gi";
import EditIcon from '@mui/icons-material/Edit';
import './expensehead.css';

const ExpenseHead = () => {
  const [expenseHeads, setExpenseHeads] = useState([]);
  const [expCategory, setExpCategory] = useState('');
  const [description, setDescription] = useState('');
  const [editId, setEditId] = useState(null);

  useEffect(() => {
    fetchExpenseHeads();
  }, []);

  const fetchExpenseHeads = async () => {
    try {
      const response = await axios.get('/api/expense/expense_head');
      setExpenseHeads(response.data);
    } catch (error) {
      console.error('Error fetching expense heads:', error);
    }
  };

  const handleCreateOrUpdateExpenseHead = async (event) => {
    event.preventDefault();
    try {
      if (editId) {
        await axios.put('/api/expense/expense_head', { id: editId, exp_category: expCategory, description });
      } else {
        await axios.post('/api/expense/expense_head', { exp_category: expCategory, description });
      }
      setExpCategory('');
      setDescription('');
      setEditId(null);
      fetchExpenseHeads();
    } catch (error) {
      console.error('Error creating or updating expense head:', error);
    }
  };

  const handleEdit = (head) => {
    setEditId(head.id);
    setExpCategory(head.exp_category);
    setDescription(head.description);
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete('/api/expense/expense_head', { data: { id } });
      fetchExpenseHeads();
    } catch (error) {
      console.error('Error deleting expense head:', error);
    }
  };

  return (
    <Container maxWidth="lg">
      <Paper elevation={3} style={{ padding: '16px', borderRadius: '8px', marginTop: '30px', marginBottom: '90px' }}>
        <Box mt={4} mb={4}>
          <Typography variant="h4" align="left" marginTop= "-30px" gutterBottom>
            <GiTakeMyMoney style={{ marginRight: '10px', verticalAlign: 'middle', color: 'orange', fontSize: '35px', marginTop: '-12px' }}/>
            Expense Head
          </Typography>
          <Grid container spacing={4}>
            <Grid item xs={12}>
              <form onSubmit={handleCreateOrUpdateExpenseHead} style={{ display: 'flex', width: '100%', marginBottom: '20px' }}>
                <TextField
                  label="Expense Category"
                  value={expCategory}
                  onChange={(e) => setExpCategory(e.target.value)}
                  fullWidth
                  required
                  variant="outlined"
                  margin="normal"
                  style={{ marginRight: '10px',marginTop:'40px' }}
                  className="expense-category-field"
                  InputLabelProps={{
                    classes: {
                      root: 'label-root',
                      focused: 'label-focused'
                    }
                  }}
                  InputProps={{
                    classes: {
                      root: 'input-root',
                      focused: 'input-focused',
                      notchedOutline: 'notched-outline'
                    }
                  }}
                />
                <TextField
                  label="Description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  fullWidth
                  multiline
                  rows={1}
                  variant="outlined"
                  margin="normal"
                  style={{ marginRight: '10px',marginTop:'40px' }}
                  className="description-field"
                  InputLabelProps={{
                    classes: {
                      root: 'label-root',
                      focused: 'label-focused'
                    }
                  }}
                  InputProps={{
                    classes: {
                      root: 'input-root',
                      focused: 'input-focused',
                      notchedOutline: 'notched-outline'
                    }
                  }}
                />
                <Button className="expenseadd" type="submit" variant="contained" color="primary" size="small"
                  style={{ minWidth: '130px', fontSize: '0.7rem', padding: '3px 6px', textTransform: 'none',marginTop:'40px' }}
                >
                  {editId ? 'Update Expense Head' : 'Add Expense Head'}
                </Button>
              </form>
            </Grid>
            <Grid item xs={12}>
              <div style={{ display: 'flex', alignItems: 'center', marginBottom: '10px' }}>
                <Typography variant="h6" className='subtitle' style={{ marginRight: '10px' ,marginTop:'1px',}}>
                  Expense Head List
                </Typography>
                <hr style={{ flexGrow: 1 , marginTop:'-40px', marginLeft:'-5px'}} />
              </div>
              <Paper elevation={3} style={{ padding: '16px', borderRadius: '8px', backgroundColor:'#F4F4F5',marginTop:'-33px',width:'95.5%',marginLeft:'10px', }}>
              <TableContainer className="table-container">
  <Table>
    <TableHead className="table-header">
      <TableRow className="table-row">
        <TableCell className="table-header-cell">Expense Category</TableCell>
        <TableCell className="table-header-cell">Description</TableCell>
        <TableCell className="table-header-cell">Action</TableCell>
      </TableRow>
    </TableHead>
    <TableBody>
      {expenseHeads.map((head) => (
        <TableRow key={head.id} className="table-row">
          <TableCell className="table-cell">{head.exp_category}</TableCell>
          <TableCell className="table-cell">{head.description}</TableCell>
          <TableCell className="table-cell">
            <IconButton onClick={() => handleEdit(head)}>
              <EditIcon sx={{ color: '#89d6cd' , cursor:'pointer' }} />
            </IconButton>
            <IconButton onClick={() => handleDelete(head.id)}>
              <DeleteIcon sx={{ color: 'red' , cursor:'pointer'}}/>
            </IconButton>
          </TableCell>
        </TableRow>
      ))}
    </TableBody>
  </Table>
</TableContainer>

              </Paper>
            </Grid>
          </Grid>
        </Box>
      </Paper>
    </Container>
  );
};

export default ExpenseHead;
