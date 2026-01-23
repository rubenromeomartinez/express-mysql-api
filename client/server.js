const express = require('express');
const path = require('path');
const app = express();

// Sirve el index.html y otros archivos en la carpeta
app.use(express.static(__dirname));

const PORT = 8080;
app.listen(PORT, () => {
    console.log(`🌐 Cliente web corriendo en http://localhost:${PORT}`);
});