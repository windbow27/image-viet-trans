const express = require('express');
const multer = require('multer');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
const { processQueue } = require('./queue');

const app = express();
const upload = multer({ dest: 'uploads/' });
const PORT = 3000;

app.use(cors());

// Serve static files from the 'output' directory
app.use('/output', express.static(path.join(__dirname, 'output')));

// Upload route
app.post('/upload', upload.single('image'), async (req, res) => {
    try {
        const imagePath = req.file.path;
        console.log('File uploaded:', imagePath);

        const jobId = await processQueue(imagePath);
        console.log('Job ID:', jobId);

        res.json({ jobId });
    } catch (error) {
        console.error('Error in /upload route:', error);
        res.status(500).json({ error: 'Failed to process file' });
    }
});

// Status check route
app.get('/status/:id', (req, res) => {
    try {
        const jobId = req.params.id;
        const outputPath = path.join(__dirname, `output/${jobId}.pdf`);
        console.log('Checking status for job ID:', jobId);

        if (fs.existsSync(outputPath)) {
            console.log('File exists:', outputPath);
            res.json({ status: 'Complete', url: `http://localhost:3000/output/${jobId}.pdf` });
        } else {
            console.log('File not found, still processing:', outputPath);
            res.json({ status: 'Processing' });
        }
    } catch (error) {
        console.error('Error in /status route:', error);
        res.status(500).json({ error: 'Failed to check status' });
    }
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));