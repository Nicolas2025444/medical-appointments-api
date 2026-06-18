require('dotenv').config();
const express      = require('express');
const swaggerUi    = require('swagger-ui-express');
const fs           = require('fs');
const path         = require('path');
const YAML         = require('yaml');
const { testConnection } = require('./config/database');

const app  = express();
const PORT = process.env.PORT || 3000;

// ── Middlewares globales ──────────────────────────────────────
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ── Swagger / OpenAPI ─────────────────────────────────────────
const swaggerFile = fs.readFileSync(
  path.join(__dirname, 'docs', 'openapi.yaml'), 'utf8'
);
const swaggerDoc = YAML.parse(swaggerFile);
app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(swaggerDoc));

// ── Rutas ─────────────────────────────────────────────────────
app.use('/api/auth',           require('./routes/auth.routes'));
app.use('/api/usuarios',       require('./routes/usuarios.routes'));
app.use('/api/especialidades', require('./routes/especialidades.routes'));
app.use('/api/medicos',        require('./routes/medicos.routes'));
app.use('/api/pacientes',      require('./routes/pacientes.routes'));
app.use('/api/citas',          require('./routes/citas.routes'));

// ── Health check ──────────────────────────────────────────────
app.get('/', (req, res) =>
  res.json({ success: true, message: 'Medical Appointments API', version: '1.0.0' })
);

// ── 404 ───────────────────────────────────────────────────────
app.use((req, res) =>
  res.status(404).json({ success: false, message: 'Ruta no encontrada' })
);

// ── Error handler ─────────────────────────────────────────────
app.use((err, req, res, _next) => {
  console.error(err.stack);
  res.status(500).json({ success: false, message: 'Error interno del servidor' });
});

// ── Inicio ────────────────────────────────────────────────────
testConnection().then(() => {
  app.listen(PORT, () => {
    console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
    console.log(`📄 Swagger UI en   http://localhost:${PORT}/api/docs`);
  });
});
