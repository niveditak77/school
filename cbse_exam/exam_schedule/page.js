'use client';

import { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Container, Paper, Typography, Box, Table, TableBody, TableCell, TableContainer, TableHead, TableRow
} from '@mui/material';
import { useTheme } from '../../../../context/ThemeContext'; // Import useTheme

const ExamSchedulePage = () => {
  const { theme } = useTheme(); // Use the theme context
  const [schedule, setSchedule] = useState([]);

  useEffect(() => {
    const fetchSchedule = async () => {
      try {
        const response = await axios.get('/api/cbse_examination/exam_schedule', {
          params: { exam_id: 20 } // Pass the appropriate exam_id
        });
        setSchedule(response.data);
      } catch (error) {
        console.error('Error fetching exam schedule:', error);
      }
    };

    fetchSchedule();
  }, []);

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
      <Box mt={4} mb={4} style={{ flexGrow: 1 }}>
        <Typography variant="h4" align="center" gutterBottom style={{ color: theme.text }}>
          Exam Schedule
        </Typography>
        <TableContainer component={Paper} style={{ marginTop: '16px', backgroundColor: theme.formBackground }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell style={{ color: theme.text }}>Subject</TableCell>
                <TableCell style={{ color: theme.text }}>Date</TableCell>
                <TableCell style={{ color: theme.text }}>Start Time</TableCell>
                <TableCell style={{ color: theme.text }}>Duration (minute)</TableCell>
                <TableCell style={{ color: theme.text }}>Room No.</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {schedule.map((item) => (
                <TableRow key={item.id}>
                  <TableCell style={{ color: theme.text }}>{item.subject_name}</TableCell>
                  <TableCell style={{ color: theme.text }}>{new Date(item.date).toLocaleDateString()}</TableCell>
                  <TableCell style={{ color: theme.text }}>{item.start_time}</TableCell>
                  <TableCell style={{ color: theme.text }}>{item.duration}</TableCell>
                  <TableCell style={{ color: theme.text }}>{item.room_no}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
    </Container>
  );
};

export default ExamSchedulePage;
