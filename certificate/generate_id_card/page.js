'use client';

import { useState, useEffect } from 'react';
import {
  Box, Button, TextField, Typography, Select, MenuItem, FormControl, InputLabel, Table,
  TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Checkbox, Grid, IconButton
} from '@mui/material';
import axios from 'axios';

const GenerateIDCardPage = () => {
  const [classes, setClasses] = useState([]);
  const [sections, setSections] = useState([]);
  const [templates, setTemplates] = useState([]);
  const [selectedClass, setSelectedClass] = useState('');
  const [selectedSection, setSelectedSection] = useState('');
  const [selectedTemplate, setSelectedTemplate] = useState('');
  const [students, setStudents] = useState([]);
  const [selectedStudents, setSelectedStudents] = useState([]);

  useEffect(() => {
    // Fetch classes, sections, and templates
    const fetchData = async () => {
      try {
        const classResponse = await axios.get('/api/academics/classes');
        setClasses(classResponse.data);

        const sectionResponse = await axios.get('/api/academics/sections');
        setSections(sectionResponse.data);

        const templateResponse = await axios.get('/api/certificate/student_id_card');
        setTemplates(templateResponse.data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  const handleGenerate = async () => {
    try {
      // Call the API to generate the ID cards
      const response = await axios.post('/api/certificate/generate_id_card', {
        selectedStudents,
        templateId: selectedTemplate,
      });
      console.log('ID Cards Generated:', response.data);
    } catch (error) {
      console.error('Error generating ID Cards:', error);
    }
  };

  const handleFetchStudents = async () => {
    if (!selectedClass || !selectedSection || !selectedTemplate) {
      alert('Please select all criteria.');
      return;
    }
    
    try {
      const response = await axios.get('/api/certificate/generate_id_card', {
        params: { classId: selectedClass, sectionId: selectedSection, templateId: selectedTemplate }
      });
      setStudents(response.data.students);
    } catch (error) {
      console.error('Error fetching students:', error);
    }
  };

  return (
    <Box sx={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: 4 }}>
      {/* Select Criteria Form */}
      <Box
        sx={{
          width: '100%',
          padding: 3,
          border: '1px solid #ddd',
          borderRadius: '8px',
          backgroundColor: '#fff',
          boxShadow: 1,
        }}
      >
        <Typography variant="h6" gutterBottom>
          Select Criteria
        </Typography>
        <Grid container spacing={2}>
          <Grid item xs={12} md={4}>
            <FormControl fullWidth>
              <InputLabel>Class</InputLabel>
              <Select value={selectedClass} onChange={(e) => setSelectedClass(e.target.value)}>
                {classes.map((cls) => (
                  <MenuItem key={cls.id} value={cls.id}>{cls.name}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} md={4}>
            <FormControl fullWidth>
              <InputLabel>Section</InputLabel>
              <Select value={selectedSection} onChange={(e) => setSelectedSection(e.target.value)}>
                {sections.map((section) => (
                  <MenuItem key={section.id} value={section.id}>{section.name}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} md={4}>
            <FormControl fullWidth>
              <InputLabel>ID Card Template</InputLabel>
              <Select value={selectedTemplate} onChange={(e) => setSelectedTemplate(e.target.value)}>
                {templates.map((template) => (
                  <MenuItem key={template.id} value={template.id}>{template.title}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12}>
            <Button variant="contained" color="primary" onClick={handleFetchStudents}>
              Search
            </Button>
          </Grid>
        </Grid>
      </Box>

      {/* Student List */}
      <Box
        sx={{
          width: '100%',
          padding: 3,
          border: '1px solid #ddd',
          borderRadius: '8px',
          backgroundColor: '#fff',
          boxShadow: 1,
        }}
      >
        <Typography variant="h6" gutterBottom>
          Student List
        </Typography>
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Admission No</TableCell>
                <TableCell>Student Name</TableCell>
                <TableCell>Class</TableCell>
                <TableCell>Father Name</TableCell>
                <TableCell>Date Of Birth</TableCell>
                <TableCell>Gender</TableCell>
                <TableCell>Mobile Number</TableCell>
                <TableCell>Select</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {students.map((student) => (
                <TableRow key={student.id}>
                  <TableCell>{student.admission_no}</TableCell>
                  <TableCell>{student.name}</TableCell>
                  <TableCell>{student.class}</TableCell>
                  <TableCell>{student.father_name}</TableCell>
                  <TableCell>{student.dob}</TableCell>
                  <TableCell>{student.gender}</TableCell>
                  <TableCell>{student.mobile}</TableCell>
                  <TableCell>
                    <Checkbox
                      checked={selectedStudents.includes(student.id)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setSelectedStudents([...selectedStudents, student.id]);
                        } else {
                          setSelectedStudents(selectedStudents.filter((id) => id !== student.id));
                        }
                      }}
                    />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        <Button variant="contained" color="primary" onClick={handleGenerate} sx={{ marginTop: 2 }}>
          Generate
        </Button>
      </Box>
    </Box>
  );
};

export default GenerateIDCardPage;
