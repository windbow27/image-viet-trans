const { extractTextFromImage } = require('./utils/ocr');
const { translateText } = require('./utils/translate');
const { createPdfFromText } = require('./utils/pdf');
const path = require('path');

let queue = [];

const processQueue = async (imagePath) => {
    const jobId = Date.now();
    queue.push({ jobId, imagePath, status: 'Pending' });

    setImmediate(async () => {
        try {
            const job = queue.find(job => job.jobId === jobId);
            if (!job) {
                throw new Error(`Job with ID ${jobId} not found`);
            }

            const text = await extractTextFromImage(job.imagePath);
            console.log('Extracted text:', text);

            const translatedText = await translateText(text);
            console.log('Translated text:', translatedText);

            const outputPath = path.join(__dirname, `output/${jobId}.pdf`);
            createPdfFromText(translatedText, outputPath);

            job.status = 'Complete';
            console.log(`Job ${jobId} completed successfully`);
        } catch (error) {
            console.error('Error processing job:', error);
            const job = queue.find(job => job.jobId === jobId);
            if (job) {
                job.status = 'Failed';
            }
        }
    });

    return jobId;
};

module.exports = { processQueue };