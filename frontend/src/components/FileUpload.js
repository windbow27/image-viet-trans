import React, { useState } from 'react';
import axios from 'axios';

const FileUpload = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [status, setStatus] = useState({ message: '', type: '' });
  const [pdfUrl, setPdfUrl] = useState('');

  const handleFileChange = (e) => {
    setSelectedFile(e.target.files[0]);
  };

  const handleFileUpload = async (e) => {
    e.preventDefault();

    if (!selectedFile) {
      setStatus({ message: 'Please select a file.', type: 'error' });
      return;
    }

    setStatus({ message: 'Uploading file...', type: 'info' });

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
      setStatus({ message: 'Error uploading file.', type: 'error' });
    }
  };

  const pollStatus = async (jobId) => {
    setStatus({ message: 'Processing file...', type: 'info' });

    const interval = setInterval(async () => {
      try {
        const statusResponse = await axios.get(`http://localhost:3000/status/${jobId}`);
        if (statusResponse.data.status === 'Complete') {
          setStatus({ message: 'File processed successfully.', type: 'success' });
          setPdfUrl(statusResponse.data.url);
          clearInterval(interval);
        }
      } catch (error) {
        console.error('Error checking status:', error);
        setStatus({ message: 'Error processing file.', type: 'error' });
        clearInterval(interval);
      }
    }, 3000); // Poll every 3 seconds
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen ">
      <div className="text-center">
        <h2 className="text-2xl font-semibold text-neutral-900 mb-6">
          Upload an Image to Convert to Vietnamese PDF
        </h2>
      </div>
      <form onSubmit={handleFileUpload} className="w-full max-w-md p-4 bg-white shadow-md rounded-lg">
        <label
          htmlFor="file-upload"
          className="w-full h-48 flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-indigo-500"
        >
          <div className="text-center">
            <p className="text-gray-500">Paste an image, click to select, or drag and drop</p>
          </div>
          <input
            id="file-upload"
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleFileChange}
          />
        </label>
        <button
          type="submit"
          className="w-full mt-4 btn btn-primary"
        >
          Upload
        </button>
      </form>
      <p className={`mt-4 ${status.type === 'error' ? 'text-error' : status.type === 'success' ? 'text-success' : 'text-info'}`}>
        {status.message}
      </p>
      {pdfUrl && (
        <a href={pdfUrl} target="_blank" rel="noopener noreferrer" className="mt-2 text-info underline">
          Download PDF
        </a>
      )}
    </div>
  );
};

export default FileUpload;