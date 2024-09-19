'use client';

import { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Paper, Typography, Box, IconButton, Tooltip
} from '@mui/material';
import { Delete } from '@mui/icons-material';
import withAuth from '../utils/withAuth';

const Dashboard = () => {
  const [notices, setNotices] = useState([]);

  useEffect(() => {
    fetchNotices();
  }, []);

  const fetchNotices = async () => {
    try {
      const response = await axios.get('/api/communicate/notice_board', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      setNotices(response.data);
    } catch (error) {
      console.error('Error fetching notices:', error);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`/api/communicate/notice_board/${id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      fetchNotices();
    } catch (error) {
      console.error('Error deleting notice:', error);
    }
  };

  return (
    <div style={{ padding: '20px' }}>
      <Typography variant="h6">Welcome to the Dashboard</Typography>
      {notices.length > 0 && (
        <Paper style={{ padding: '20px', marginTop: '20px' }}>
          <Typography variant="h5" gutterBottom>
            Latest Notices
          </Typography>
          <Box>
            {notices.map((notice) => (
              <Box key={notice.id} sx={{ marginBottom: 2, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box>
                  <Typography variant="h6">{notice.title}</Typography>
                  <Typography>{notice.content}</Typography>
                </Box>
                <Tooltip title="Delete">
                  <IconButton color="secondary" onClick={() => handleDelete(notice.id)}>
                    <Delete />
                  </IconButton>
                </Tooltip>
              </Box>
            ))}
          </Box>
        </Paper>
      )}
    </div>
  );
};

export default withAuth(Dashboard);
