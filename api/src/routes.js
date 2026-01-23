// src/routes.js
const express = require('express');
const router = express.Router();
const itemController = require('./controllers');

// Rutas GET
router.get('/items', itemController.getAllItems);
router.get('/items/:id', itemController.getItemById); // Ruta para obtener por ID

// Ruta POST (Crear)
router.post('/items', itemController.createItem);

// Ruta PUT/PATCH (Actualizar)
router.put('/items/:id', itemController.updateItem);

// Ruta DELETE (Eliminar)
router.delete('/items/:id', itemController.deleteItem);

module.exports = router;