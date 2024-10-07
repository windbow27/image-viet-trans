const PDFDocument = require('pdfkit');
const fs = require('fs');
const path = require('path');

async function createPdfFromText(text, outputPath) {
    return new Promise((resolve, reject) => {
        const doc = new PDFDocument({ size: 'A4', margin: 50 });
        const stream = fs.createWriteStream(outputPath);

        doc.pipe(stream);

        const fontPath = path.join(__dirname, '..', 'fonts', 'NotoSans-Regular.ttf');
        doc.font(fontPath)
           .fontSize(12)
           .text(text, {
               align: 'left',
               indent: 30,
               height: 300,
               ellipsis: true
           });

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