const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();

// Middleware to parse JSON bodies
app.use(express.json({ limit: '50mb' })); // You may adjust the limit as per your needs

app.post('/save-image', (req, res) => {
    const fileName = req.body.fileName;
    const imageData = new Uint8Array(req.body.imageData);

    // Create Buffer from byte array
    const buffer = Buffer.from(imageData);

    // Define the path to save the image
    const savePath = path.join('E:/images/onlyfans', fileName);

    // Save the image
    fs.writeFile(savePath, buffer, (err) => {
        if (err) {
            console.error(err);
            res.status(500).send('Error occurred while saving image');
        } else {
            res.send('Image saved successfully');
        }
    });
});

app.listen(3000, () => {
    console.log('Server is running on port 3000');
});
