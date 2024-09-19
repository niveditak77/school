"use client";

import { useState, useEffect } from 'react';
import axios from 'axios';
import {
    Container, Paper, Grid, TextField, Button, Typography, Box, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Alert, MenuItem, Select, InputLabel, FormControl
} from '@mui/material';
import { useRouter } from 'next/navigation';
import { FaHandHoldingUsd } from "react-icons/fa";

const CollectFeesPage = () => {
    const [classList, setClassList] = useState([]);
    const [sectionList, setSectionList] = useState([]);
    const [selectedClass, setSelectedClass] = useState('');
    const [selectedSection, setSelectedSection] = useState('');
    const [students, setStudents] = useState([]);
    const [searchKeyword, setSearchKeyword] = useState('');
    const [error, setError] = useState('');
    const router = useRouter();

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
        axios.get('/api/academics/students', {
            params: {
                className: selectedClass || '', // Pass empty string if not selected
                sectionName: selectedSection || '', // Pass empty string if not selected
                keyword: searchKeyword
            }
        })
        .then(response => {
            setStudents(response.data);
        })
        .catch(error => {
            console.error('Error fetching students:', error);
            setError('Error fetching students');
        });
    };

    const handleCollectFees = (studentId) => {
        router.push(`/dashboard/fees_collection/collect_fees/${studentId}`);
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

    const feeButtonStyle = {
        marginTop: '20px',
        marginBottom: '30px',
        borderRadius: '20px',
        backgroundColor: '#44b8ab',
        textTransform: 'none',
        width: '100px',
        fontSize: '15px',
        marginLeft: '2px',
        '&:hover': {
            backgroundColor: '#89d6cd',
        }
    };

    const tableStyle = {
        width: '100%',
        borderCollapse: 'collapse',
        cursor: 'pointer',
    };

    const tableHeaderStyle = {
        backgroundColor: '#f5f5f5 !important',
        color: '#333',
        fontWeight: 'bold',
    };

    const tableCellStyle = {
        textAlign: 'left',
        padding: '12px 15px',
        borderBottom: '1px solid #e0e0e0',
    };

    const tableRowHoverStyle = {
        '&:hover': {
            backgroundColor: '#f9f9f9',
        }
    };

    return (
        <Container>
            <Box mt={4} mb={4}>
                <Paper elevation={3} sx={{ padding: '20px', borderRadius: '10px' }}>
                    <Typography variant="h5" align="left" marginBottom="20px" fontFamily="Verdana, Geneva, Tahoma, sans-serif" gutterBottom>
                        <FaHandHoldingUsd style={{ marginRight: '9px', verticalAlign: 'middle', color: 'orange', fontSize: '30px', marginTop: '-10px', fontWeight: 'bold' }} />
                        Collect Fees
                    </Typography>
                    {error && <Alert severity="error">{error}</Alert>}
                    <form>
                        <Grid container spacing={2} className="mb-3">
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
                            <Grid item xs={12} md={4}>
                                <TextField
                                    label="Search By Keyword"
                                    placeholder="Search by student name, roll number, etc."
                                    value={searchKeyword}
                                    onChange={(e) => setSearchKeyword(e.target.value)}
                                    fullWidth
                                    variant="outlined"
                                    sx={{ ...noBorderStyle, ...focusedLabelStyle }}
                                />
                            </Grid>
                        </Grid>
                        <Grid container spacing={2}>
                            <Grid item xs={12}>
                                <Button variant="contained" sx={feeButtonStyle} onClick={handleSearch}>
                                    Search
                                </Button>
                            </Grid>
                        </Grid>
                    </form>
                    <TableContainer component={Paper} className="mt-4">
                        <Table sx={tableStyle}>
                            <TableHead>
                                <TableRow>
                                    <TableCell sx={tableHeaderStyle}>Class</TableCell>
                                    <TableCell sx={tableHeaderStyle}>Section</TableCell>
                                    <TableCell sx={tableHeaderStyle}>Admission No</TableCell>
                                    <TableCell sx={tableHeaderStyle}>Student Name</TableCell>
                                    <TableCell sx={tableHeaderStyle}>Father Name</TableCell>
                                    <TableCell sx={tableHeaderStyle}>Date of Birth</TableCell>
                                    <TableCell sx={tableHeaderStyle}>Mobile No.</TableCell>
                                    <TableCell sx={tableHeaderStyle}>Action</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {students.map((student) => (
                                    <TableRow key={student.id} sx={tableRowHoverStyle}>
                                        <TableCell sx={tableCellStyle}>{student.class}</TableCell>
                                        <TableCell sx={tableCellStyle}>{student.section}</TableCell>
                                        <TableCell sx={tableCellStyle}>{student.roll_no}</TableCell>
                                        <TableCell sx={tableCellStyle}>{`${student.firstname} ${student.lastname}`}</TableCell>
                                        <TableCell sx={tableCellStyle}>{student.father_name}</TableCell>
                                        <TableCell sx={tableCellStyle}>{student.date_of_birth}</TableCell>
                                        <TableCell sx={tableCellStyle}>{student.mobile_no}</TableCell>
                                        <TableCell sx={tableCellStyle}>
                                            <Button variant="contained" color="primary" onClick={() => handleCollectFees(student.id)}>
                                                Collect Fees
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </Paper>
            </Box>
        </Container>
    );
};

export default CollectFeesPage;
