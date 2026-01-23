// src/controllers.js
const pool = require('./database');

// Ejemplo: Obtener todos los elementos (posts, usuarios, etc.)
const getAllItems = async (req, res) => {
    const searchTerm = req.query.q; // Capturamos el parámetro ?q=...
    
    try {
        let query = 'SELECT * FROM items';
        let params = [];

        if (searchTerm) {
            // Usamos LIKE para búsquedas parciales y % para comodines
            query += ' WHERE name LIKE ? OR description LIKE ?';
            params = [`%${searchTerm}%`, `%${searchTerm}%`];
        }

        const [rows] = await pool.query(query, params);
        res.json(rows);
    } catch (error) {
        res.status(500).json({ error: "Error en la búsqueda" });
    }
};

// Ejemplo: Obtener un elemento por ID
const getItemById = async (req, res) => {
  const { id } = req.params;
  try {
    const [rows] = await pool.query('SELECT * FROM items WHERE id = ?', [id]);
    
    if (rows.length === 0) { 
      return res.status(404).json({ message: `Elemento con ID ${id} no encontrado.` });
    }
    
    res.json(rows[0]);
  } catch (error) {
    console.error(`Error al obtener elemento ${id}:`, error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
};

// Ejemplo: Crear un nuevo elemento
const createItem = async (req, res) => {
  const { name, description } = req.body;
  if (!name) {
    return res.status(400).json({ message: 'El campo "name" es obligatorio' });
  }

  try {
    const [result] = await pool.query(
      'INSERT INTO items (name, description) VALUES (?, ?)',
      [name, description]
    );
    res.status(201).json({ 
      id: result.insertId, 
      name, 
      description,
      message: 'Elemento creado con éxito' 
    });
  } catch (error) {
    console.error('Error al crear elemento:', error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
};

// Ejemplo: Actualizar un elemento
const updateItem = async (req, res) => {
  const { id } = req.params;
  const { name, description } = req.body;

  if (!name && !description) {
    return res.status(400).json({ message: 'Se requiere al menos el campo "name" o "description" para actualizar.' });
  }

  // Construir la consulta de forma dinámica para actualizar solo los campos presentes
  let fields = [];
  let values = [];

  if (name !== undefined) {
    fields.push('name = ?');
    values.push(name);
  }
  if (description !== undefined) {
    fields.push('description = ?');
    values.push(description);
  }

  const query = `UPDATE items SET ${fields.join(', ')} WHERE id = ?`;
  values.push(id);

  try {
    const [result] = await pool.query(query, values);

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: `Elemento con ID ${id} no encontrado para actualizar.` });
    }

    res.json({ 
      id: id, 
      message: 'Elemento actualizado con éxito',
      fieldsUpdated: fields.length
    });
  } catch (error) {
    console.error(`Error al actualizar elemento ${id}:`, error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
};

// Ejemplo: Eliminar un elemento
const deleteItem = async (req, res) => {
  const { id } = req.params;

  try {
    const [result] = await pool.query('DELETE FROM items WHERE id = ?', [id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: `Elemento con ID ${id} no encontrado para eliminar.` });
    }

    res.json({ message: `Elemento con ID ${id} eliminado con éxito.` });
  } catch (error) {
    console.error(`Error al eliminar elemento ${id}:`, error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
};


module.exports = {
  getAllItems,
  getItemById, // Asegúrate de exportarlo
  createItem,
  updateItem, // Añadir a la exportación
  deleteItem  // Añadir a la exportación
};