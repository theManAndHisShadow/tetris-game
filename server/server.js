const path = require('path');
const express = require('express');
const faviconLoader = require('serve-favicon');
const app = express();
const port = 3000;

// setting static path
app.use(express.static(path.join(__dirname, '../frontend')));

// some loadings
const favicon = faviconLoader(path.join(__dirname, 'favicon.ico'));

// setting site favicon
app.use(favicon);

// setting routs for sound loading from server
app.get('/sounds/:file', (req, res) => {
    const file = req.params.file;
    const filePath = path.join(__dirname, '../frontend/resoursces/sounds/', file);
    res.sendFile(filePath);
});

// setting routs for image loading from server
app.get('/images/:file', (req, res) => {
    const file = req.params.file;
    const filePath = path.join(__dirname, '../frontend/resoursces/sounds/', file);
    res.sendFile(filePath);
});

// starting server
app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});