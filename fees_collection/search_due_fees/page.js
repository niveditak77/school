"use client";

import { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Container, Paper, Grid, Button, Typography, Box, Alert, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, MenuItem, Select, InputLabel, FormControl
} from '@mui/material';
import { IoSearchCircle } from "react-icons/io5";
import './pay.css';

const SearchDueFees = () => {
  const [classList, setClassList] = useState([]);
  const [sectionList, setSectionList] = useState([]);
  const [feesGroupList, setFeesGroupList] = useState([]);
  const [selectedClass, setSelectedClass] = useState('');
  const [selectedSection, setSelectedSection] = useState('');
  const [selectedFeesGroup, setSelectedFeesGroup] = useState('');
  const [students, setStudents] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    // Fetch class list
    axios.get('/api/academics/classes')
      .then(response => {
        setClassList(response.data);
      })
      .catch(error => console.error('Error fetching classes:', error));

    // Fetch fees group list
    axios.get('/api/fees_collection/fees_group')
      .then(response => {
        setFeesGroupList(response.data);
      })
      .catch(error => console.error('Error fetching fees groups:', error));
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
    if (!selectedFeesGroup || !selectedClass) {
      setError('Fees Group and Class are required');
      return;
    }

    setError('');

    // Fetch due fees based on selected criteria
    axios.get('/api/fees_collection/search_due_fees', {
      params: {
        feesGroup: selectedFeesGroup,
        className: selectedClass,
        sectionName: selectedSection
      }
    })
    .then(response => {
      setStudents(response.data);
    })
    .catch(error => {
      console.error('Error fetching due fees:', error);
      setError('Error fetching due fees');
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
        <Typography variant="h5" align="left" marginBottom="25px" fontFamily="Verdana, Geneva, Tahoma, sans-serif" gutterBottom>
          <IoSearchCircle  style={{ marginRight: '5px', verticalAlign: 'middle', color: 'orange', fontSize: '34px', marginTop: '-7px', fontWeight: 'bold' }} />
          Search Due Fee
        </Typography>
        {error && <Alert severity="error">{error}</Alert>}

        {/* Added Paper component for the form */}
        <Paper style={{ padding: '16px', marginBottom: '20px' }}>
          <form>
            <Grid container spacing={2} className="mb-3">
              <Grid item xs={12} md={4}>
                <FormControl fullWidth>
                  <InputLabel id="fees-group-select-label" sx={{ '&.Mui-focused': { color: 'orange' } }}>Fees Group</InputLabel>
                  <Select
                    labelId="fees-group-select-label"
                    id="fees-group-select"
                    value={selectedFeesGroup}
                    onChange={(e) => setSelectedFeesGroup(e.target.value)}
                    label="Fees Group"
                    sx={{ ...noBorderStyle, ...focusedLabelStyle }}
                  >
                    <MenuItem value="">
                      <em>Select</em>
                    </MenuItem>
                    {feesGroupList.map((group) => (
                      <MenuItem key={group.id} value={group.id}>{group.name}</MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} md={4}>
                <FormControl fullWidth>
                  <InputLabel id="class-select-label" sx={{ '&.Mui-focused': { color: 'orange' } }}>Class</InputLabel>
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
                      <MenuItem key={cls.id} value={cls.id}>{cls.class}</MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} md={4}>
                <FormControl fullWidth>
                  <InputLabel id="section-select-label" sx={{ '&.Mui-focused': { color: 'orange' } }}>Section</InputLabel>
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
                      <MenuItem key={sec.id} value={sec.id}>{sec.section}</MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
            </Grid>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <Button variant="contained" className='duebtn' onClick={handleSearch}>
                  Search
                </Button>
              </Grid>
            </Grid>
          </form>
        </Paper>

        <TableContainer component={Paper} className="mt-4">
          <Table className='duetable'>
            <TableHead>
              <TableRow>
                <TableCell>Class</TableCell>
                <TableCell>Admission No</TableCell>
                <TableCell>Student Name</TableCell>
                <TableCell>Fees Group</TableCell>
                <TableCell>Amount</TableCell>
                <TableCell>Paid</TableCell>
                <TableCell>Discount</TableCell>
                <TableCell>Fine</TableCell>
                <TableCell>Balance</TableCell>
                <TableCell>Action</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {students.map((student) => (
                <TableRow key={student.student_id}>
                  <TableCell>{student.class}</TableCell>
                  <TableCell>{student.admission_no}</TableCell>
                  <TableCell>{student.student_name}</TableCell>
                  <TableCell>{student.fees_group}</TableCell>
                  <TableCell>{student.amount}</TableCell>
                  <TableCell>{student.amount_paid}</TableCell>
                  <TableCell>{student.amount_discount}</TableCell>
                  <TableCell>{student.amount_fine}</TableCell>
                  <TableCell>{student.balance}</TableCell>
                  <TableCell>
                    <Button variant="contained" color="primary">
                      Add Fees
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
    </Container>
  );
};

export default SearchDueFees;
