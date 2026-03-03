const express = require('express');
const path = require('path');
const app = express();

// Sirve el index.html y otros archivos en la carpeta
app.use(express.static(__dirname));


const PORT = process.env.PORT || 3000; // 8080 para el cliente

app.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 Cliente web  corriendo en el puerto ${PORT}`);
});

