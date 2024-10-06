const fs = require('fs');
const PDFDocument = require('pdfkit');

async function createPdfFromText(text, outputPath) {
    return new Promise((resolve, reject) => {
        const doc = new PDFDocument();
        const stream = fs.createWriteStream(outputPath);

        doc.pipe(stream);
        doc.text(text);
        doc.end();

        stream.on('finish', () => {
            resolve();
        });

        stream.on('error', (error) => {
            reject(error);
        });
    });
}

module.exports = {
    createPdfFromText
};