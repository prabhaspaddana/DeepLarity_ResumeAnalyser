import React, { useState } from 'react';
import { AppBar, Tabs, Tab, Box, Typography, Button, Container } from '@mui/material';
import axios from 'axios';
import ResumeList from './ResumeList'; // Import the ResumeList component
import './App.css';

function TabPanel(props) {
  const { children, value, index, isLoading, error, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          {isLoading ? (
            <Typography>Loading...</Typography>
          ) : error ? (
            <Typography color="error">{error}</Typography>
          ) : (
            <Typography>{children}</Typography>
          )}
        </Box>
      )}
    </div>
  );
}

function App() {
  const [tabValue, setTabValue] = useState(0);
  const [file, setFile] = useState(null);
  const [analysis, setAnalysis] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
  };

  const handleUpload = async () => {
    if (!file) {
      alert('Please select a file first');
      return;
    }
    setIsLoading(true);
    setError(null);
    const formData = new FormData();
    formData.append('file', file);
    try {
      const response = await axios.post('http://localhost:8000/upload-resume/', formData);
      console.log('Response data:', response.data); // Log the response data
      setAnalysis(response.data.analysis); // Set the nested analysis object
    } catch (error) {
      setError(error.response?.data?.message || 'Error uploading resume. Please try again.');
      console.error('Error uploading resume:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Container maxWidth="lg" className="dashboard-container">
      <AppBar position="static" sx={{ borderRadius: '8px 8px 0 0' }}>
        <Tabs value={tabValue} onChange={handleTabChange} aria-label="resume tabs">
          <Tab label="Upload Resume" />
          <Tab label="Resume List" /> {/* Add a new tab for Resume List */}
        </Tabs>
      </AppBar>
      <TabPanel value={tabValue} index={0} isLoading={isLoading} error={error}>
        <div className="dashboard-section">
          <div className="section-header">
            <Typography variant="h5">Upload Your Resume</Typography>
          </div>
          <input
            accept=".pdf,.doc,.docx"
            style={{ display: 'none' }}
            id="raised-button-file"
            type="file"
            onChange={handleFileChange}
            disabled={isLoading}
          />
          <label htmlFor="raised-button-file">
            <Button 
              variant="contained" 
              component="span" 
              disabled={isLoading}
              sx={{ mr: 2 }}
            >
              Choose File
            </Button>
          </label>
          {file && <Typography variant="body1">{file.name}</Typography>}
          <Button 
            onClick={handleUpload} 
            variant="contained" 
            color="primary" 
            sx={{ mt: 2 }}
            disabled={isLoading}
          >
            {isLoading ? 'Uploading...' : 'Upload'}
          </Button>
        </div>

        {error && (
          <Box sx={{ mt: 2, color: 'error.main' }}>
            <Typography>{error}</Typography>
          </Box>
        )}

        {analysis && (
          <div className="dashboard-section">
            <div className="section-header">
              <Typography variant="h5">Analysis Result</Typography>
            </div>
            <div className="analysis-result">
              <div className="analysis-item">
                <span className="analysis-label">Name:</span>
                <Typography component="span">{analysis.name || 'N/A'}</Typography>
              </div>
              <div className="analysis-item">
                <span className="analysis-label">Email:</span>
                <Typography component="span">{analysis.email || 'N/A'}</Typography>
              </div>
              <div className="analysis-item">
                <span className="analysis-label">Core Skills:</span>
                <div className="skills-list">
                  {analysis.core_skills && analysis.core_skills.map((skill, index) => (
                    <span key={index} className="skill-tag">{skill}</span>
                  ))}
                </div>
              </div>
              <div className="analysis-item">
                <span className="analysis-label">Soft Skills:</span>
                <div className="skills-list">
                  {analysis.soft_skills && analysis.soft_skills.map((skill, index) => (
                    <span key={index} className="skill-tag">{skill}</span>
                  ))}
                </div>
              </div>
              <div className="analysis-item">
                <span className="analysis-label">Resume Rating:</span>
                <Typography component="span">{analysis.rating || 'N/A'}</Typography>
              </div>
              <div className="analysis-item">
                <span className="analysis-label">Improvement Areas:</span>
                <Typography component="span">{analysis.improvements || 'N/A'}</Typography>
              </div>
              <div className="analysis-item">
                <span className="analysis-label">Upskill Suggestions:</span>
                <Typography component="span">{analysis.upskill || 'N/A'}</Typography>
              </div>
            </div>
          </div>
        )}
      </TabPanel>
      <TabPanel value={tabValue} index={1}>
        <ResumeList /> {/* Add the ResumeList component */}
      </TabPanel>
    </Container>
  );
}

export default App;