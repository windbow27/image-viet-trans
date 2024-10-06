import React, { useState } from 'react';
import axios from 'axios';

const FileUpload = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [status, setStatus] = useState('');
  const [pdfUrl, setPdfUrl] = useState('');

  const handleFileChange = (e) => {
    setSelectedFile(e.target.files[0]);
  };

  const handleFileUpload = async (e) => {
    e.preventDefault();

    if (!selectedFile) {
      setStatus('Please select a file.');
      return;
    }

    setStatus('Uploading file...');
    
    const formData = new FormData();
    formData.append('image', selectedFile);

    try {
      // Send image to backend for processing
      const response = await axios.post('http://localhost:3000/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      const { jobId } = response.data;

      // Poll backend to check the status of the job
      pollStatus(jobId);
    } catch (error) {
      console.error('Error uploading file:', error);
      setStatus('Error uploading file.');
    }
  };

  const pollStatus = async (jobId) => {
    setStatus('Processing file...');

    const interval = setInterval(async () => {
      try {
        const statusResponse = await axios.get(`http://localhost:3000/status/${jobId}`);
        if (statusResponse.data.status === 'Complete') {
          setStatus('File processed successfully.');
          setPdfUrl(statusResponse.data.url);
          clearInterval(interval);
        }
      } catch (error) {
        console.error('Error checking status:', error);
        setStatus('Error processing file.');
        clearInterval(interval);
      }
    }, 3000); // Poll every 3 seconds
  };

  return (
    <div>
      <h2>Upload an Image to Convert to PDF</h2>
      <form onSubmit={handleFileUpload}>
        <input type="file" accept="image/*" onChange={handleFileChange} />
        <button type="submit">Upload</button>
      </form>
      <p>{status}</p>
      {pdfUrl && <a href={pdfUrl} target="_blank" rel="noopener noreferrer">Download PDF</a>}
    </div>
  );
};

export default FileUpload;