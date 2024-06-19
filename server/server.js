const express = require('express');
const path = require('path');
const app = express();
const port = 3000;

// setting static path
app.use(express.static(path.join(__dirname, '../frontend')));

// setting routs for sound loading from server
app.get('/sounds/:file', (req, res) => {
    const file = req.params.file;
    const filePath = path.join(__dirname, '../frontend/resoursces/sounds/', file);
    res.sendFile(filePath);
});

// starting server
app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});