'use client';

import { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Container, Paper, Grid, TextField, Button, Typography, Box, Card, CardMedia, CardContent, CardActions, Select, MenuItem, FormControl, InputLabel, Alert, IconButton
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import { HiVideoCamera } from "react-icons/hi2";
import './video.css';

const VideoTutorials = () => {
  const [videoTutorials, setVideoTutorials] = useState([]);
  const [title, setTitle] = useState('');
  const [vidTitle, setVidTitle] = useState('');
  const [description, setDescription] = useState('');
  const [thumbPath, setThumbPath] = useState('');
  const [dirPath, setDirPath] = useState('');
  const [imgName, setImgName] = useState('');
  const [thumbName, setThumbName] = useState('');
  const [videoLink, setVideoLink] = useState('');
  const [createdBy, setCreatedBy] = useState('');
  const [error, setError] = useState('');
  const [staff, setStaff] = useState([]);
  const [classes, setClasses] = useState([]);
  const [sections, setSections] = useState([]);
  const [classId, setClassId] = useState('');
  const [sectionId, setSectionId] = useState('');
  const [searchTitle, setSearchTitle] = useState('');

  const fetchVideoTutorials = async () => {
    try {
      const response = await axios.get('/api/download_center/video_tutorials');
      setVideoTutorials(response.data);
    } catch (error) {
      console.error('Error fetching video tutorials:', error);
    }
  };

  const fetchStaffClassesSections = async () => {
    try {
      const staffResponse = await axios.get('/api/staff');
      setStaff(staffResponse.data);
      const classResponse = await axios.get('/api/academics/classes');
      setClasses(classResponse.data);
      const sectionResponse = await axios.get('/api/academics/sections');
      setSections(sectionResponse.data);
    } catch (error) {
      console.error('Error fetching staff, classes, or sections:', error);
    }
  };

  useEffect(() => {
    fetchStaffClassesSections();
    fetchVideoTutorials();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      await axios.post('/api/download_center/video_tutorials', {
        title, vidTitle, description, thumbPath, dirPath, imgName, thumbName, videoLink, createdBy
      });
      setTitle('');
      setVidTitle('');
      setDescription('');
      setThumbPath('');
      setDirPath('');
      setImgName('');
      setThumbName('');
      setVideoLink('');
      setCreatedBy('');
      fetchVideoTutorials();
    } catch (error) {
      console.error('Error saving video tutorial:', error);
      setError(`Error saving video tutorial: ${error.response.data.error}`);
    }
  };

  const handleDelete = async (id) => {
    setError('');
    try {
      await axios.delete(`/api/download_center/video_tutorials`, { params: { id } });
      fetchVideoTutorials();
    } catch (error) {
      console.error('Error deleting video tutorial:', error);
      setError(`Error deleting video tutorial: ${error.response.data.error}`);
    }
  };

  const filteredVideoTutorials = videoTutorials.filter(tutorial => 
    (classId ? tutorial.class_id === classId : true) &&
    (sectionId ? tutorial.section_id === sectionId : true) &&
    (searchTitle ? tutorial.title.toLowerCase().includes(searchTitle.toLowerCase()) : true)
  );

  const focusedLabelStyle = {
    '& label.Mui-focused': {
      color: 'orange',
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

  return (
    <Container maxWidth="lg">
      <Box mt={4} mb={4}>
        {error && <Alert severity="error">{error}</Alert>}
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <Paper elevation={3} style={{ padding: '16px', borderRadius: '8px' }}>
              <Typography variant="h5" align="left" marginBottom="10px" fontFamily="Verdana, Geneva, Tahoma, sans-serif" gutterBottom>
                <HiVideoCamera style={{ marginRight: '7px', verticalAlign: 'middle', color: 'orange', fontSize: '30px', marginTop: '-5px' }} />
                Video Tutorials
              </Typography>
              <Typography variant="h6" marginTop="30px" marginLeft="5px" color="orange" marginBottom="20px" gutterBottom>
                Add Video Tutorial
              </Typography>
              <form onSubmit={handleSubmit}>
                <Grid container spacing={1}>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      label="Title"
                      name="title"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      fullWidth
                      required
                      variant="outlined"
                      sx={{ ...noBorderStyle, ...focusedLabelStyle, marginBottom: '8px' }}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      label="Video Title"
                      name="vidTitle"
                      value={vidTitle}
                      onChange={(e) => setVidTitle(e.target.value)}
                      fullWidth
                      variant="outlined"
                      sx={{ ...noBorderStyle, ...focusedLabelStyle, marginBottom: '8px' }}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      label="Description"
                      name="description"
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      fullWidth
                      variant="outlined"
                      sx={{ ...noBorderStyle, ...focusedLabelStyle, marginBottom: '8px' }}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      label="Thumbnail Path"
                      name="thumbPath"
                      value={thumbPath}
                      onChange={(e) => setThumbPath(e.target.value)}
                      fullWidth
                      variant="outlined"
                      sx={{ ...noBorderStyle, ...focusedLabelStyle, marginBottom: '8px' }}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      label="Directory Path"
                      name="dirPath"
                      value={dirPath}
                      onChange={(e) => setDirPath(e.target.value)}
                      fullWidth
                      variant="outlined"
                      sx={{ ...noBorderStyle, ...focusedLabelStyle, marginBottom: '8px' }}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      label="Image Name"
                      name="imgName"
                      value={imgName}
                      onChange={(e) => setImgName(e.target.value)}
                      fullWidth
                      variant="outlined"
                      sx={{ ...noBorderStyle, ...focusedLabelStyle, marginBottom: '8px' }}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      label="Thumbnail Name"
                      name="thumbName"
                      value={thumbName}
                      onChange={(e) => setThumbName(e.target.value)}
                      fullWidth
                      variant="outlined"
                      sx={{ ...noBorderStyle, ...focusedLabelStyle, marginBottom: '8px' }}
                    />
                  </Grid>
                  <Grid item xs={12} sm={8}>
                    <TextField
                      label="Video Link"
                      name="videoLink"
                      value={videoLink}
                      onChange={(e) => setVideoLink(e.target.value)}
                      fullWidth
                      required
                      variant="outlined"
                      sx={{ ...noBorderStyle, ...focusedLabelStyle, marginBottom: '8px', marginTop: '0px' }}
                    />
                  </Grid>
                  <Grid item xs={12} sm={4}>
                    <FormControl fullWidth variant="outlined" style={{ marginBottom: '8px' }}>
                      <InputLabel sx={{ '&.Mui-focused': { color: 'orange' } }}>Created By</InputLabel>
                      <Select
                        value={createdBy}
                        onChange={(e) => setCreatedBy(e.target.value)}
                        label="Created By"
                        sx={{ ...noBorderStyle, ...focusedLabelStyle }}
                      >
                        <MenuItem value="">
                          <em>Select</em>
                        </MenuItem>
                        {staff.map((stf) => (
                          <MenuItem key={stf.id} value={stf.id}>{stf.name}</MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Grid>
                  <Grid item xs={12}>
                    <Button type="submit" fullWidth variant="contained" className='videobtn'>
                      Save
                    </Button>
                  </Grid>
                </Grid>
              </form>
            </Paper>
          </Grid>
          <Grid item xs={12}>
            <Paper elevation={3} style={{ padding: '16px', borderRadius: '8px' }}>
             
              <FormControl fullWidth variant="outlined" style={{ marginBottom: '16px' }}>
                <InputLabel sx={{ '&.Mui-focused': { color: 'orange' } }}>Class</InputLabel>
                <Select
                  value={classId}
                  onChange={(e) => setClassId(e.target.value)}
                  label="Class"
                  sx={{ ...noBorderStyle, ...focusedLabelStyle }}
                >
                  <MenuItem value="">
                    <em>Select</em>
                  </MenuItem>
                  {classes.map((cls) => (
                    <MenuItem key={cls.id} value={cls.id}>{cls.class}</MenuItem>
                  ))}
                </Select>
              </FormControl>
              <FormControl fullWidth variant="outlined" style={{ marginBottom: '16px' }}>
                <InputLabel sx={{ '&.Mui-focused': { color: 'orange' } }}>Section</InputLabel>
                <Select
                  value={sectionId}
                  onChange={(e) => setSectionId(e.target.value)}
                  label="Section"
                  sx={{ ...noBorderStyle, ...focusedLabelStyle }}
                >
                  <MenuItem value="">
                    <em>Select</em>
                  </MenuItem>
                  {sections.map((sec) => (
                    <MenuItem key={sec.id} value={sec.id}>{sec.section}</MenuItem>
                  ))}
                </Select>
              </FormControl>
              <TextField
                label="Search By Title"
                name="searchTitle"
                value={searchTitle}
                onChange={(e) => setSearchTitle(e.target.value)}
                fullWidth
                variant="outlined"
                margin="normal"
                sx={{ ...noBorderStyle, ...focusedLabelStyle }}
              />
              <Button variant="contained" color="primary" onClick={fetchVideoTutorials} className='videosearch'>
                Search
              </Button>
            </Paper>
          </Grid>
          <Grid item xs={12}>
            <Box mt={4}>
              <Grid container spacing={3}>
                {filteredVideoTutorials.map((tutorial) => (
                  <Grid item xs={12} sm={6} md={4} key={tutorial.id}>
                    <Card>
                      <CardMedia
                        component="img"
                        height="140"
                        image={tutorial.thumb_path}
                        alt={tutorial.title}
                      />
                      <CardContent>
                        <Typography gutterBottom variant="h5" component="div">
                          {tutorial.title}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {tutorial.description}
                        </Typography>
                      </CardContent>
                      <CardActions>
                        <Button size="small" color="primary" href={tutorial.video_link} target="_blank">
                          View
                        </Button>
                        <IconButton onClick={() => handleDelete(tutorial.id)}>
                          <DeleteIcon />
                        </IconButton>
                      </CardActions>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            </Box>
          </Grid>
        </Grid>
      </Box>
    </Container>
  );
};

export default VideoTutorials;
