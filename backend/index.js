const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');
const cors = require('cors');  // Import CORS middleware

const app = express();
const PORT = 3002;

// Enable CORS for all origins (you can specify allowed origins if needed)
app.use(cors());

// Middleware to handle JSON requests
app.use(bodyParser.json({ limit: '10mb' }));

// POST route to receive the image
app.post('/upload', (req, res) => {
    const { image } = req.body;

    // Check if image is provided
    if (!image) {
        return res.status(400).json({ message: 'No image provided' });
    }

    // Extract the base64 part of the image string
    const base64Data = image.replace(/^data:image\/png;base64,/, '');

    // Generate a unique filename
    const fileName = `image-${Date.now()}.png`;
    const filePath = path.join(__dirname, 'uploads', fileName);

    // Write the image to the uploads folder
    fs.writeFile(filePath, base64Data, 'base64', (err) => {
        if (err) {
            console.error('Error saving the image:', err);
            return res.status(500).json({ message: 'Failed to save image' });
        }

        console.log(`Image saved as ${filePath}`);
        res.json({ message: 'Image uploaded and saved successfully!' });
    });
});

// Ensure the uploads directory exists
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir);
}

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
