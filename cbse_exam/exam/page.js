'use client';

import { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Container, Paper, Grid, TextField, Button, Typography, Box, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, IconButton, Dialog, DialogActions, DialogContent, DialogTitle
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import { useTheme } from '../../../../context/ThemeContext'; // Import useTheme

const ExamPage = () => {
  const { theme } = useTheme(); // Use the theme context
  const [exams, setExams] = useState([]);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [cbse_term_id, setCbseTermId] = useState('');
  const [cbse_exam_assessment_id, setCbseExamAssessmentId] = useState('');
  const [cbse_exam_grade_id, setCbseExamGradeId] = useState('');
  const [session_id, setSessionId] = useState('');
  const [is_publish, setIsPublish] = useState(0);
  const [editId, setEditId] = useState(null);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    fetchExams();
  }, []);

  const fetchExams = async () => {
    try {
      const response = await axios.get('/api/cbse_examination/exam');
      setExams(response.data);
    } catch (error) {
      console.error('Error fetching exams:', error);
    }
  };

  const handleSave = async () => {
    try {
      const data = { name, description, cbse_term_id, cbse_exam_assessment_id, cbse_exam_grade_id, session_id, is_publish };
      if (editId) {
        await axios.put(`/api/cbse_examination/exam`, { ...data, id: editId });
      } else {
        await axios.post('/api/cbse_examination/exam', data);
      }
      resetForm();
      fetchExams();
    } catch (error) {
      console.error('Error saving exam:', error);
    }
  };

  const handleEdit = (exam) => {
    setName(exam.name);
    setDescription(exam.description);
    setCbseTermId(exam.cbse_term_id);
    setCbseExamAssessmentId(exam.cbse_exam_assessment_id);
    setCbseExamGradeId(exam.cbse_exam_grade_id);
    setSessionId(exam.session_id);
    setIsPublish(exam.is_publish);
    setEditId(exam.id);
    setOpen(true);
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`/api/cbse_examination/exam`, { params: { id } });
      fetchExams();
    } catch (error) {
      console.error('Error deleting exam:', error);
    }
  };

  const resetForm = () => {
    setName('');
    setDescription('');
    setCbseTermId('');
    setCbseExamAssessmentId('');
    setCbseExamGradeId('');
    setSessionId('');
    setIsPublish(0);
    setEditId(null);
    setOpen(false);
  };

  const handleClose = () => {
    resetForm();
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
          Exams
        </Typography>
        <Button
          variant="contained"
          style={{ marginBottom: '16px', backgroundColor: theme.button, color: theme.buttonText }}
          onClick={() => setOpen(true)}
        >
          + Add Exam
        </Button>
        <TableContainer component={Paper} style={{ backgroundColor: theme.formBackground }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell style={{ color: theme.text }}>Exam Name</TableCell>
                <TableCell style={{ color: theme.text }}>Description</TableCell>
                <TableCell style={{ color: theme.text }}>Term</TableCell>
                <TableCell style={{ color: theme.text }}>Assessment</TableCell>
                <TableCell style={{ color: theme.text }}>Grade</TableCell>
                <TableCell style={{ color: theme.text }}>Publish</TableCell>
                <TableCell style={{ color: theme.text }}>Action</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {exams.map((exam) => (
                <TableRow key={exam.id}>
                  <TableCell style={{ color: theme.text }}>{exam.name}</TableCell>
                  <TableCell style={{ color: theme.text }}>{exam.description}</TableCell>
                  <TableCell style={{ color: theme.text }}>{exam.term_name}</TableCell>
                  <TableCell style={{ color: theme.text }}>{exam.assessment_name}</TableCell>
                  <TableCell style={{ color: theme.text }}>{exam.grade_name}</TableCell>
                  <TableCell style={{ color: theme.text }}>{exam.is_publish ? 'Yes' : 'No'}</TableCell>
                  <TableCell>
                    <IconButton onClick={() => handleEdit(exam)} style={{ color: theme.button }}>
                      <EditIcon />
                    </IconButton>
                    <IconButton onClick={() => handleDelete(exam.id)} style={{ color: theme.error }}>
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
      <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
        <DialogTitle style={{ backgroundColor: theme.background, color: theme.text }}>
          {editId ? 'Edit Exam' : 'Add Exam'}
        </DialogTitle>
        <DialogContent style={{ backgroundColor: theme.formBackground }}>
          <TextField
            label="Exam Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            fullWidth
            margin="normal"
            required
            style={{ backgroundColor: theme.inputBackground, color: theme.inputText }}
            InputLabelProps={{ style: { color: theme.inputText } }}
          />
          <TextField
            label="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            fullWidth
            margin="normal"
            multiline
            rows={4}
            style={{ backgroundColor: theme.inputBackground, color: theme.inputText }}
            InputLabelProps={{ style: { color: theme.inputText } }}
          />
          <TextField
            label="CBSE Term ID"
            value={cbse_term_id}
            onChange={(e) => setCbseTermId(e.target.value)}
            fullWidth
            margin="normal"
            required
            style={{ backgroundColor: theme.inputBackground, color: theme.inputText }}
            InputLabelProps={{ style: { color: theme.inputText } }}
          />
          <TextField
            label="CBSE Exam Assessment ID"
            value={cbse_exam_assessment_id}
            onChange={(e) => setCbseExamAssessmentId(e.target.value)}
            fullWidth
            margin="normal"
            required
            style={{ backgroundColor: theme.inputBackground, color: theme.inputText }}
            InputLabelProps={{ style: { color: theme.inputText } }}
          />
          <TextField
            label="CBSE Exam Grade ID"
            value={cbse_exam_grade_id}
            onChange={(e) => setCbseExamGradeId(e.target.value)}
            fullWidth
            margin="normal"
            required
            style={{ backgroundColor: theme.inputBackground, color: theme.inputText }}
            InputLabelProps={{ style: { color: theme.inputText } }}
          />
          <TextField
            label="Session ID"
            value={session_id}
            onChange={(e) => setSessionId(e.target.value)}
            fullWidth
            margin="normal"
            required
            style={{ backgroundColor: theme.inputBackground, color: theme.inputText }}
            InputLabelProps={{ style: { color: theme.inputText } }}
          />
          <TextField
            label="Publish"
            select
            SelectProps={{
              native: true,
            }}
            value={is_publish}
            onChange={(e) => setIsPublish(e.target.value)}
            fullWidth
            margin="normal"
            required
            style={{ backgroundColor: theme.inputBackground, color: theme.inputText }}
            InputLabelProps={{ style: { color: theme.inputText } }}
          >
            <option value={0}>No</option>
            <option value={1}>Yes</option>
          </TextField>
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
    </Container>
  );
};

export default ExamPage;
