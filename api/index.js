// index.js
const express = require('express');
const cors = require('cors'); // <--- IMPORTANTE
const appRoutes = require('./src/routes');
const pool = require('./src/database'); // Importar para asegurar la conexión



// Cargar variables de entorno (solo si ejecutas localmente sin Docker)
// require('dotenv').config(); 

const app = express();

// Middleware CORS: Esto le dice al navegador que acepte peticiones
// provenientes de otros dominios/puertos (como el 8080 de tu cliente).
app.use(cors());

const PORT = process.env.APP_PORT || 3000;

// Middleware para parsear el cuerpo de las peticiones como JSON
app.use(express.json());

// Montar las rutas bajo el prefijo /api
app.use('/api', appRoutes);

// Endpoint de prueba
app.get('/', (req, res) => {
  res.send('API REST funcionando!');
});

// Inicialización de la DB (verificación) y Creación de la tabla (opcional)
async function initializeDatabase() {
  try {
    // Verificar la conexión
    await pool.query('SELECT 1');
    console.log('✅ Conexión a la base de datos MySQL establecida correctamente.');
    
    // Crear la tabla 'items' si no existe (opcional, pero útil para empezar)
    await pool.query(`
      CREATE TABLE IF NOT EXISTS items (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        description TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log('✅ Tabla "items" verificada/creada.');

    // Iniciar el servidor Express
    app.listen(PORT, () => {
      console.log(`🚀 Servidor Express escuchando en el puerto ${PORT}`);
    });

  } catch (error) {
    console.error('❌ Error al iniciar la aplicación o conectar a la DB:', error.message);
    // En un entorno de producción, puedes intentar reconectar.
    process.exit(1); 
  }
}

initializeDatabase();