'use client';

import { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Container, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Box
} from '@mui/material';
import { useTheme } from '../../../../context/ThemeContext'; // Import useTheme

const ReportPage = () => {
  const { theme } = useTheme(); // Use the theme context
  const [subjectMarks, setSubjectMarks] = useState([]);
  const [templateMarks, setTemplateMarks] = useState([]);

  useEffect(() => {
    fetchReportData();
  }, []);

  const fetchReportData = async () => {
    try {
      const response = await axios.get('/api/cbse_examination/report', {
        params: {
          exam_id: 20,       // Replace with dynamic value as needed
          session_id: 19     // Replace with dynamic value as needed
        }
      });
      setSubjectMarks(response.data.subjectMarks);
      setTemplateMarks(response.data.templateMarks);
    } catch (error) {
      console.error('Error fetching report data:', error);
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
        flexDirection: 'column',
      }}
    >
      <Box mt={4} mb={4}>
        <Typography variant="h4" align="center" gutterBottom style={{ color: theme.text }}>
          Reports
        </Typography>

        <Typography variant="h6" gutterBottom style={{ color: theme.text }}>
          Subject Marks Report
        </Typography>
        <TableContainer component={Paper} style={{ backgroundColor: theme.formBackground }}>
          <Table>
            <TableHead style={{ backgroundColor: theme.inputBackground }}>
              <TableRow>
                <TableCell style={{ color: theme.text }}>Subject</TableCell>
                <TableCell style={{ color: theme.text }}>Date</TableCell>
                <TableCell style={{ color: theme.text }}>Start Time</TableCell>
                <TableCell style={{ color: theme.text }}>Duration</TableCell>
                <TableCell style={{ color: theme.text }}>Room No.</TableCell>
                <TableCell style={{ color: theme.text }}>Student Name</TableCell>
                <TableCell style={{ color: theme.text }}>Marks</TableCell>
                <TableCell style={{ color: theme.text }}>Absent</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {subjectMarks.map((row, index) => (
                <TableRow key={index}>
                  <TableCell style={{ color: theme.text }}>{row.subject_name}</TableCell>
                  <TableCell style={{ color: theme.text }}>{row.date}</TableCell>
                  <TableCell style={{ color: theme.text }}>{row.time_from}</TableCell>
                  <TableCell style={{ color: theme.text }}>{row.duration}</TableCell>
                  <TableCell style={{ color: theme.text }}>{row.room_no}</TableCell>
                  <TableCell style={{ color: theme.text }}>{row.student_name}</TableCell>
                  <TableCell style={{ color: theme.text }}>{row.marks}</TableCell>
                  <TableCell style={{ color: theme.text }}>{row.is_absent ? 'Yes' : 'No'}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        <Box mt={4}>
          <Typography variant="h6" gutterBottom style={{ color: theme.text }}>
            Template Marks Report
          </Typography>
          <TableContainer component={Paper} style={{ backgroundColor: theme.formBackground }}>
            <Table>
              <TableHead style={{ backgroundColor: theme.inputBackground }}>
                <TableRow>
                  <TableCell style={{ color: theme.text }}>Template</TableCell>
                  <TableCell style={{ color: theme.text }}>Class Section</TableCell>
                  <TableCell style={{ color: theme.text }}>Rank</TableCell>
                  <TableCell style={{ color: theme.text }}>Rank Percentage</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {templateMarks.map((row, index) => (
                  <TableRow key={index}>
                    <TableCell style={{ color: theme.text }}>{row.template_name}</TableCell>
                    <TableCell style={{ color: theme.text }}>{row.class_section_name}</TableCell>
                    <TableCell style={{ color: theme.text }}>{row.rank}</TableCell>
                    <TableCell style={{ color: theme.text }}>{row.rank_percentage}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>
      </Box>
    </Container>
  );
};

export default ReportPage;
