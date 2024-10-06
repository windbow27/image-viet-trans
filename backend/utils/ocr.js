const tesseract = require('tesseract.js');

const extractTextFromImage = async (imagePath) => {
    const { data: { text } } = await tesseract.recognize(imagePath, 'eng');
    return text;
};

module.exports = { extractTextFromImage };
