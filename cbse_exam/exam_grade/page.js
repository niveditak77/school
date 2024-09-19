'use client';

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Container, Paper, Grid, Button, Typography, Box, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, IconButton, Dialog, DialogTitle, DialogContent, DialogActions, TextField
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import { useTheme } from '../../../../context/ThemeContext'; // Import useTheme

const ExamGradePage = () => {
  const { theme } = useTheme(); // Use the theme context
  const [grades, setGrades] = useState([]);
  const [open, setOpen] = useState(false);
  const [currentGrade, setCurrentGrade] = useState({
    name: '',
    description: '',
    ranges: [{ name: '', minimum_percentage: '', maximum_percentage: '', description: '' }]
  });

  useEffect(() => {
    fetchGrades();
  }, []);

  const fetchGrades = async () => {
    try {
      const response = await axios.get('/api/cbse_examination/exam_grade');
      setGrades(response.data);
    } catch (error) {
      console.error('Error fetching grades:', error);
    }
  };

  const handleAdd = () => {
    setCurrentGrade({
      name: '',
      description: '',
      ranges: [{ name: '', minimum_percentage: '', maximum_percentage: '', description: '' }]
    });
    setOpen(true);
  };

  const handleEdit = (grade) => {
    setCurrentGrade(grade);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setCurrentGrade(null);
  };

  const handleSave = async () => {
    try {
      if (currentGrade.id) {
        await axios.put('/api/cbse_examination/exam_grade', currentGrade);
      } else {
        await axios.post('/api/cbse_examination/exam_grade', currentGrade);
      }
      handleClose();
      fetchGrades();
    } catch (error) {
      console.error('Error saving grade:', error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCurrentGrade((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleRangeChange = (index, e) => {
    const { name, value } = e.target;
    const ranges = [...currentGrade.ranges];
    ranges[index][name] = value;
    setCurrentGrade({ ...currentGrade, ranges });
  };

  const handleAddRange = () => {
    setCurrentGrade((prev) => ({
      ...prev,
      ranges: [...prev.ranges, { name: '', minimum_percentage: '', maximum_percentage: '', description: '' }]
    }));
  };

  const handleRemoveRange = (index) => {
    const ranges = [...currentGrade.ranges];
    ranges.splice(index, 1);
    setCurrentGrade({ ...currentGrade, ranges });
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`/api/cbse_examination/exam_grade?id=${id}`);
      fetchGrades();
    } catch (error) {
      console.error('Error deleting grade:', error);
    }
  };

  return (
    <Container
      maxWidth="lg"
      style={{
        backgroundColor: theme.background,
        color: theme.text,
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column'
      }}
    >
      <Box mt={4} mb={4} style={{ flexGrow: 1 }}>
        <Typography variant="h4" align="center" gutterBottom style={{ color: theme.text }}>
          Exam Grades
        </Typography>
        <Button
          variant="contained"
          color="primary"
          style={{ marginBottom: '16px', backgroundColor: theme.button, color: theme.buttonText }}
          onClick={handleAdd}
        >
          + Add Exam Grade
        </Button>
        <TableContainer component={Paper} style={{ backgroundColor: theme.formBackground, flexGrow: 1 }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell style={{ color: theme.text }}>Grade Name</TableCell>
                <TableCell style={{ color: theme.text }}>Description</TableCell>
                <TableCell style={{ color: theme.text }}>Ranges</TableCell>
                <TableCell style={{ color: theme.text }}>Action</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {grades.map((grade) => (
                <TableRow key={grade.id}>
                  <TableCell style={{ color: theme.text }}>{grade.name}</TableCell>
                  <TableCell style={{ color: theme.text }}>{grade.description}</TableCell>
                  <TableCell style={{ color: theme.text }}>
                    {Array.isArray(grade.ranges) && grade.ranges.map((range, index) => (
                      <Box key={index} mb={1}>
                        <strong>{range.name}</strong> ({range.minimum_percentage}% - {range.maximum_percentage}%): {range.description}
                      </Box>
                    ))}
                  </TableCell>
                  <TableCell>
                    <IconButton onClick={() => handleEdit(grade)} style={{ color: theme.button }}>
                      <EditIcon />
                    </IconButton>
                    <IconButton onClick={() => handleDelete(grade.id)} style={{ color: theme.button }}>
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>

      {/* Add/Edit Dialog */}
      {currentGrade && (
        <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
          <DialogTitle style={{ backgroundColor: theme.background, color: theme.text }}>
            {currentGrade.id ? 'Edit Exam Grade' : 'Add Exam Grade'}
          </DialogTitle>
          <DialogContent style={{ backgroundColor: theme.formBackground }}>
            <TextField
              margin="dense"
              name="name"
              label="Grade Name"
              value={currentGrade.name}
              onChange={handleChange}
              fullWidth
              required
              style={{ backgroundColor: theme.inputBackground, color: theme.inputText }}
              InputLabelProps={{ style: { color: theme.inputText } }}
            />
            <TextField
              margin="dense"
              name="description"
              label="Description"
              value={currentGrade.description}
              onChange={handleChange}
              fullWidth
              style={{ backgroundColor: theme.inputBackground, color: theme.inputText }}
              InputLabelProps={{ style: { color: theme.inputText } }}
            />
            {currentGrade.ranges.map((range, index) => (
              <Grid container spacing={2} key={index} alignItems="center">
                <Grid item xs={3}>
                  <TextField
                    margin="dense"
                    name="name"
                    label="Range Name"
                    value={range.name}
                    onChange={(e) => handleRangeChange(index, e)}
                    fullWidth
                    required
                    style={{ backgroundColor: theme.inputBackground, color: theme.inputText }}
                    InputLabelProps={{ style: { color: theme.inputText } }}
                  />
                </Grid>
                <Grid item xs={2}>
                  <TextField
                    margin="dense"
                    name="minimum_percentage"
                    label="Minimum Percentage"
                    value={range.minimum_percentage}
                    onChange={(e) => handleRangeChange(index, e)}
                    fullWidth
                    required
                    style={{ backgroundColor: theme.inputBackground, color: theme.inputText }}
                    InputLabelProps={{ style: { color: theme.inputText } }}
                  />
                </Grid>
                <Grid item xs={2}>
                  <TextField
                    margin="dense"
                    name="maximum_percentage"
                    label="Maximum Percentage"
                    value={range.maximum_percentage}
                    onChange={(e) => handleRangeChange(index, e)}
                    fullWidth
                    required
                    style={{ backgroundColor: theme.inputBackground, color: theme.inputText }}
                    InputLabelProps={{ style: { color: theme.inputText } }}
                  />
                </Grid>
                <Grid item xs={3}>
                  <TextField
                    margin="dense"
                    name="description"
                    label="Description"
                    value={range.description}
                    onChange={(e) => handleRangeChange(index, e)}
                    fullWidth
                    style={{ backgroundColor: theme.inputBackground, color: theme.inputText }}
                    InputLabelProps={{ style: { color: theme.inputText } }}
                  />
                </Grid>
                <Grid item xs={2}>
                  <IconButton onClick={() => handleRemoveRange(index)} style={{ color: theme.error }}>
                    <DeleteIcon />
                  </IconButton>
                </Grid>
              </Grid>
            ))}
            <Button color="primary" onClick={handleAddRange} style={{ backgroundColor: theme.button, color: theme.buttonText }}>
              Add More
            </Button>
          </DialogContent>
          <DialogActions style={{ backgroundColor: theme.background }}>
            <Button onClick={handleClose} color="secondary" style={{ color: theme.text }}>
              Cancel
            </Button>
            <Button onClick={handleSave} color="primary" style={{ backgroundColor: theme.button, color: theme.buttonText }}>
              Save
            </Button>
          </DialogActions>
        </Dialog>
      )}
    </Container>
  );
};

export default ExamGradePage;
