"use client";

import { useState, useEffect } from 'react';
import axios from 'axios';
import {
    Container, Paper, Grid, Button, Typography, Box, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Alert, FormControl, InputLabel, Select, MenuItem
} from '@mui/material';
import { ImForward } from "react-icons/im";
import './forward.css';

const FeesCarryForwardPage = () => {
    const [classList, setClassList] = useState([]);
    const [sectionList, setSectionList] = useState([]);
    const [selectedClass, setSelectedClass] = useState('');
    const [selectedSection, setSelectedSection] = useState('');
    const [students, setStudents] = useState([]);
    const [error, setError] = useState('');

    useEffect(() => {
        // Fetch class list
        axios.get('/api/academics/classes')
            .then(response => {
                setClassList(response.data);
            })
            .catch(error => console.error('Error fetching classes:', error));
    }, []);

    const handleClassChange = (e) => {
        const classId = e.target.value;
        setSelectedClass(classId);

        // Fetch section list based on selected class
        axios.get(`/api/academics/sections?classId=${classId}`)
            .then(response => {
                setSectionList(response.data);
            })
            .catch(error => console.error('Error fetching sections:', error));
    };

    const handleSearch = () => {
        setError('');

        // Fetch students based on selected criteria
        axios.get('/api/fees_collection/fees_carry_forward', {
            params: {
                className: selectedClass || '', // Pass empty string if not selected
                sectionName: selectedSection || '', // Pass empty string if not selected
            }
        })
        .then(response => {
            setStudents(response.data);
        })
        .catch(error => {
            console.error('Error fetching fees carry forward:', error);
            setError('Error fetching fees carry forward');
        });
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
        <Container>
        <Box mt={4} mb={4}>
        
          {error && <Alert severity="error">{error}</Alert>}
          
          {/* Paper for Form */}
          <Paper elevation={3} style={{ padding: '16px', borderRadius: '8px', marginBottom: '20px' }}>
          <Typography
            variant="h5"
            align="left"
            marginBottom="25px"
            marginLeft="5px"
            fontFamily="Verdana, Geneva, Tahoma, sans-serif"
            gutterBottom
          >
            <ImForward
              style={{
                marginRight: '9px',
                verticalAlign: 'middle',
                color: 'orange',
                fontSize: '32px',
                marginTop: '-10px',
                fontWeight: 'bold',
              }}
            />
            Fee Carry Forward
          </Typography>
            <form>
              <Grid container spacing={2} className="mb-3">
                <Grid item xs={12} md={6}>
                  <FormControl fullWidth>
                    <InputLabel id="class-select-label" sx={{ '&.Mui-focused': { color: 'orange' } }}>
                      Class
                    </InputLabel>
                    <Select
                      labelId="class-select-label"
                      id="class-select"
                      value={selectedClass}
                      onChange={handleClassChange}
                      label="Class"
                      sx={{ ...noBorderStyle, ...focusedLabelStyle }}
                    >
                      <MenuItem value="">
                        <em>Select</em>
                      </MenuItem>
                      {classList.map((cls) => (
                        <MenuItem key={cls.id} value={cls.id}>
                          {cls.class}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12} md={6}>
                  <FormControl fullWidth>
                    <InputLabel id="section-select-label" sx={{ '&.Mui-focused': { color: 'orange' } }}>
                      Section
                    </InputLabel>
                    <Select
                      labelId="section-select-label"
                      id="section-select"
                      value={selectedSection}
                      onChange={(e) => setSelectedSection(e.target.value)}
                      label="Section"
                      sx={{ ...noBorderStyle, ...focusedLabelStyle }}
                    >
                      <MenuItem value="">
                        <em>Select</em>
                      </MenuItem>
                      {sectionList.map((sec) => (
                        <MenuItem key={sec.id} value={sec.id}>
                          {sec.section}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
              </Grid>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <Button variant="contained" className="forwardbtn" onClick={handleSearch}>
                    Search
                  </Button>
                </Grid>
              </Grid>
            </form>
          </Paper>
      
          <Typography fontSize="16px" align="left" style={{ marginTop: '10px', color: 'red' }}>
            Due Date: 10/07/2024
          </Typography>
          <TableContainer component={Paper} className="mt-4">
            <Table className="forwardtable">
              <TableHead>
                <TableRow>
                  <TableCell>Student Name</TableCell>
                  <TableCell>Admission No</TableCell>
                  <TableCell>Admission Date</TableCell>
                  <TableCell>Roll Number</TableCell>
                  <TableCell>Father Name</TableCell>
                  <TableCell>Balance</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {students.map((student) => (
                  <TableRow key={student.student_id}>
                    <TableCell>{student.student_name}</TableCell>
                    <TableCell>{student.admission_no}</TableCell>
                    <TableCell>{student.admission_date}</TableCell>
                    <TableCell>{student.roll_no}</TableCell>
                    <TableCell>{student.father_name}</TableCell>
                    <TableCell>{student.balance}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
          <Box mt={2}>
            <Button variant="contained" className="forwards">
              Save
            </Button>
          </Box>
        </Box>
      </Container>
      
    );
};

export default FeesCarryForwardPage;
