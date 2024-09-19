'use client';

import { useState, useEffect } from 'react';
import axios from 'axios';
import {
  TextField, Button, Paper, Typography, Table, TableBody, TableCell,
  TableContainer, TableHead, TableRow, IconButton, Box, Tooltip, Grid
} from '@mui/material';
import { Delete } from '@mui/icons-material';
import { TfiBlackboard } from "react-icons/tfi";
import './notice.css';

const NoticeBoard = () => {
  const [notices, setNotices] = useState([]);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');

  useEffect(() => {
    fetchNotices();
  }, []);

  const fetchNotices = async () => {
    try {
      const response = await axios.get('/api/communicate/notice_board');
      setNotices(response.data);
    } catch (error) {
      console.error('Error fetching notices:', error);
    }
  };

  const handleSave = async () => {
    try {
      await axios.post('/api/communicate/notice_board', {
        title,
        content,
      });
      setTitle('');
      setContent('');
      fetchNotices();
    } catch (error) {
      console.error('Error adding notice:', error);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`/api/communicate/notice_board/${id}`);
      fetchNotices();
    } catch (error) {
      console.error('Error deleting notice:', error);
    }
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
      color: 'orange', // Specify the color you want for the focused state
    }
  };

  return (
    <div style={{ padding: '20px' }}>
      <Typography variant="h5" align="left" marginBottom="20px" fontFamily="Verdana, Geneva, Tahoma, sans-serif" gutterBottom>
        <TfiBlackboard style={{ marginRight: '2px', marginLeft: '3px', verticalAlign: 'middle', color: 'orange', fontSize: '30px', marginTop: '-7px' }} /> Notice Board
      </Typography>
      <Grid container spacing={2}>
        <Grid item xs={12} md={12}>
          <Paper style={{ padding: '20px' }}>
            <Typography variant="h6" marginLeft="1px"  color="orange" marginBottom="50px" gutterBottom>
              Add Notice <hr className='noticeadd'/>
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <TextField
                label="Title"
                variant="outlined"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                fullWidth
                sx={{ ...noBorderStyle, ...focusedLabelStyle, marginTop: "2px" }}
              />
              <TextField
                label="Content"
                variant="outlined"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                fullWidth
                multiline
                rows={4}
                sx={{ ...noBorderStyle, ...focusedLabelStyle, marginTop: "2px" }}
              />
          
              <Button  variant="contained" className="noticebtn" onClick={handleSave}>
                 Save
                </Button>
            </Box>
          </Paper>
        </Grid>
        <Grid item xs={12} md={12}>
          <Paper style={{ padding: '20px' }}>
            <Typography variant="h6" color="orange" marginBottom="50px" gutterBottom>
              Notices <hr className='noticehr'/>
            </Typography>
            <TableContainer component={Paper} className='noticecontain'>
              <Table className='noticetables'>
                <TableHead>
                  <TableRow>
                    <TableCell>Title</TableCell>
                    <TableCell>Content</TableCell>
                    <TableCell>Action</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {notices.map((notice) => (
                    <TableRow key={notice.id}>
                      <TableCell>{notice.title}</TableCell>
                      <TableCell>{notice.content}</TableCell>
                      <TableCell>
                        <Tooltip title="Delete">
                          <IconButton color="red" onClick={() => handleDelete(notice.id)}>
                            <Delete />
                          </IconButton>
                        </Tooltip>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
        </Grid>
      </Grid>
    </div>
  );
};

export default NoticeBoard;
