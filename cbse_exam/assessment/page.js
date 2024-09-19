'use client';

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Container, Paper, Grid, Button, Typography, Box, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, IconButton, Dialog, DialogTitle, DialogContent, DialogActions, TextField
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { useTheme } from '../../../../context/ThemeContext'; // Import useTheme

const AssessmentList = () => {
  const { theme } = useTheme(); // Use the theme context
  const [assessments, setAssessments] = useState([]);
  const [open, setOpen] = useState(false);
  const [currentAssessment, setCurrentAssessment] = useState({
    name: '',
    description: '',
    assessmentTypes: [{ name: '', code: '', maximum_marks: '', pass_percentage: '', description: '' }]
  });

  useEffect(() => {
    fetchAssessments();
  }, []);

  const fetchAssessments = async () => {
    try {
      const response = await axios.get('/api/cbse_examination/assessment');
      setAssessments(response.data);
    } catch (error) {
      console.error('Error fetching assessments:', error);
    }
  };

  const handleAdd = () => {
    setCurrentAssessment({
      name: '',
      description: '',
      assessmentTypes: [{ name: '', code: '', maximum_marks: '', pass_percentage: '', description: '' }]
    });
    setOpen(true);
  };

  const handleEdit = (assessment) => {
    setCurrentAssessment(assessment);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setCurrentAssessment(null);
  };

  const handleSave = async () => {
    try {
      if (currentAssessment.id) {
        await axios.put('/api/cbse_examination/assessment', currentAssessment);
      } else {
        await axios.post('/api/cbse_examination/assessment', currentAssessment);
      }
      handleClose();
      fetchAssessments();
    } catch (error) {
      console.error('Error saving assessment:', error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCurrentAssessment((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`/api/cbse_examination/assessment?id=${id}`);
      fetchAssessments(); // Refresh the list after deletion
    } catch (error) {
      console.error('Error deleting assessment:', error);
    }
  };

  const handleAssessmentTypeChange = (index, e) => {
    const { name, value } = e.target;
    const types = [...currentAssessment.assessmentTypes];
    types[index][name] = value;
    setCurrentAssessment({ ...currentAssessment, assessmentTypes: types });
  };

  const handleAddType = () => {
    setCurrentAssessment((prev) => ({
      ...prev,
      assessmentTypes: [...prev.assessmentTypes, { name: '', code: '', maximum_marks: '', pass_percentage: '', description: '' }]
    }));
  };

  const handleRemoveType = (index) => {
    const types = [...currentAssessment.assessmentTypes];
    types.splice(index, 1);
    setCurrentAssessment({ ...currentAssessment, assessmentTypes: types });
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
          Assessment List
        </Typography>
        <Button
          variant="contained"
          color="primary"
          style={{ marginBottom: '16px', backgroundColor: theme.button, color: theme.buttonText }}
          onClick={handleAdd}
        >
          + Add
        </Button>
        <TableContainer component={Paper} style={{ backgroundColor: theme.formBackground, flexGrow: 1 }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell style={{ color: theme.text }}>Assessment</TableCell>
                <TableCell style={{ color: theme.text }}>Assessment Description</TableCell>
                <TableCell style={{ color: theme.text }}>Assessment Type</TableCell>
                <TableCell style={{ color: theme.text }}>Action</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {assessments.map((assessment) => (
                <TableRow key={assessment.id}>
                  <TableCell style={{ color: theme.text }}>{assessment.name}</TableCell>
                  <TableCell style={{ color: theme.text }}>{assessment.description}</TableCell>
                  <TableCell style={{ color: theme.text }}>
                    {Array.isArray(assessment.assessmentTypes) && assessment.assessmentTypes.map((type, index) => (
                      <Box key={index} mb={1}>
                        <strong>{type.name}</strong> ({type.code}): Max Marks: {type.maximum_marks}, Pass Percentage: {type.pass_percentage}%
                      </Box>
                    ))}
                  </TableCell>
                  <TableCell>
                    <IconButton onClick={() => handleEdit(assessment)} style={{ color: theme.button }}>
                      <EditIcon />
                    </IconButton>
                    <IconButton onClick={() => handleDelete(assessment.id)} style={{ color: theme.button }}>
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
      {currentAssessment && (
        <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
          <DialogTitle style={{ backgroundColor: theme.background, color: theme.text }}>
            {currentAssessment.id ? 'Edit Assessment' : 'Add Assessment'}
          </DialogTitle>
          <DialogContent style={{ backgroundColor: theme.formBackground }}>
            <TextField
              margin="dense"
              name="name"
              label="Assessment Name"
              value={currentAssessment.name}
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
              value={currentAssessment.description}
              onChange={handleChange}
              fullWidth
              style={{ backgroundColor: theme.inputBackground, color: theme.inputText }}
              InputLabelProps={{ style: { color: theme.inputText } }}
            />
            {currentAssessment.assessmentTypes.map((type, index) => (
              <Grid container spacing={2} key={index} alignItems="center">
                <Grid item xs={3}>
                  <TextField
                    margin="dense"
                    name="name"
                    label="Assessment Type"
                    value={type.name}
                    onChange={(e) => handleAssessmentTypeChange(index, e)}
                    fullWidth
                    required
                    style={{ backgroundColor: theme.inputBackground, color: theme.inputText }}
                    InputLabelProps={{ style: { color: theme.inputText } }}
                  />
                </Grid>
                <Grid item xs={2}>
                  <TextField
                    margin="dense"
                    name="code"
                    label="Code"
                    value={type.code}
                    onChange={(e) => handleAssessmentTypeChange(index, e)}
                    fullWidth
                    required
                    style={{ backgroundColor: theme.inputBackground, color: theme.inputText }}
                    InputLabelProps={{ style: { color: theme.inputText } }}
                  />
                </Grid>
                <Grid item xs={2}>
                  <TextField
                    margin="dense"
                    name="maximum_marks"
                    label="Maximum Marks"
                    value={type.maximum_marks}
                    onChange={(e) => handleAssessmentTypeChange(index, e)}
                    fullWidth
                    required
                    style={{ backgroundColor: theme.inputBackground, color: theme.inputText }}
                    InputLabelProps={{ style: { color: theme.inputText } }}
                  />
                </Grid>
                <Grid item xs={2}>
                  <TextField
                    margin="dense"
                    name="pass_percentage"
                    label="Pass Percentage"
                    value={type.pass_percentage}
                    onChange={(e) => handleAssessmentTypeChange(index, e)}
                    fullWidth
                    required
                    style={{ backgroundColor: theme.inputBackground, color: theme.inputText }}
                    InputLabelProps={{ style: { color: theme.inputText } }}
                  />
                </Grid>
                <Grid item xs={2}>
                  <TextField
                    margin="dense"
                    name="description"
                    label="Description"
                    value={type.description}
                    onChange={(e) => handleAssessmentTypeChange(index, e)}
                    fullWidth
                    style={{ backgroundColor: theme.inputBackground, color: theme.inputText }}
                    InputLabelProps={{ style: { color: theme.inputText } }}
                  />
                </Grid>
                <Grid item xs={1}>
                  <IconButton onClick={() => handleRemoveType(index)} style={{ color: theme.error }}>
                    <DeleteIcon />
                  </IconButton>
                </Grid>
              </Grid>
            ))}
            <Button color="primary" onClick={handleAddType} style={{ backgroundColor: theme.button, color: theme.buttonText }}>
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

export default AssessmentList;
