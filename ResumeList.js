import React, { useState, useEffect } from 'react';
import { Box, Typography, Paper, CircularProgress } from '@mui/material';
import axios from 'axios';

const ResumeList = () => {
  const [resumes, setResumes] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchResumes = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${process.env.REACT_APP_API_URL}/resumes/`);
      setResumes(response.data);
    } catch (err) {
      setError('Failed to fetch resumes');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchResumes();
  }, []);

  const handleUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('file', file);

    setLoading(true);
    setError(null);

    try {
      await axios.post(`${process.env.REACT_APP_API_URL}/upload-resume/`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      fetchResumes(); // Refresh the list
    } catch (err) {
      setError(err.response?.data?.detail || 'Upload failed');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Paper elevation={3} sx={{ p: 3 }}>
      <Box className="upload-section">
        <input
          type="file"
          accept=".pdf"
          onChange={handleUpload}
          disabled={loading}
        />
        {loading && <CircularProgress />}
        {error && (
          <Box sx={{ mt: 2, color: 'error.main' }}>
            <Typography>{error}</Typography>
          </Box>
        )}
      </Box>

      <Typography variant="h6" gutterBottom>
        Uploaded Resumes
      </Typography>
      {resumes.map((resume) => (
        <Box key={resume.id} sx={{ mt: 2 }}>
          <Typography variant="body1"><strong>Filename:</strong> {resume.filename}</Typography>
          <Typography variant="body2"><strong>Uploaded:</strong> {new Date(resume.uploaded_at).toLocaleString()}</Typography>
          {resume.analysis && (
            <Box sx={{ mt: 1 }}>
              <Typography variant="body2"><strong>Name:</strong> {resume.analysis.name}</Typography>
              <Typography variant="body2"><strong>Email:</strong> {resume.analysis.email}</Typography>
              <Typography variant="body2"><strong>Core Skills:</strong> {resume.analysis.core_skills.join(', ')}</Typography>
              <Typography variant="body2"><strong>Soft Skills:</strong> {resume.analysis.soft_skills.join(', ')}</Typography>
              <Typography variant="body2"><strong>Rating:</strong> {resume.analysis.rating || 'N/A'}</Typography>
              <Typography variant="body2"><strong>Improvements:</strong> {resume.analysis.improvements || 'N/A'}</Typography>
              <Typography variant="body2"><strong>Upskill Suggestions:</strong> {resume.analysis.upskill || 'N/A'}</Typography>
            </Box>
          )}
        </Box>
      ))}
    </Paper>
  );
};

export default ResumeList;