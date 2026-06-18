const { pool } = require('../config/database');

const getAll = async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM especialidades ORDER BY nombre');
    res.json({ success: true, data: rows });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

const getById = async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM especialidades WHERE id = ?', [req.params.id]);
    if (rows.length === 0) return res.status(404).json({ success: false, message: 'Especialidad no encontrada' });
    res.json({ success: true, data: rows[0] });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

const create = async (req, res) => {
  try {
    const { nombre, descripcion } = req.body;
    const [exists] = await pool.query('SELECT id FROM especialidades WHERE nombre = ?', [nombre]);
    if (exists.length > 0) return res.status(409).json({ success: false, message: 'Especialidad ya existe' });

    const [result] = await pool.query(
      'INSERT INTO especialidades (nombre, descripcion) VALUES (?, ?)',
      [nombre, descripcion || null]
    );
    res.status(201).json({ success: true, message: 'Especialidad creada', data: { id: result.insertId, nombre, descripcion } });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

const update = async (req, res) => {
  try {
    const { nombre, descripcion, activo } = req.body;
    const [exists] = await pool.query('SELECT id FROM especialidades WHERE id = ?', [req.params.id]);
    if (exists.length === 0) return res.status(404).json({ success: false, message: 'Especialidad no encontrada' });

    await pool.query(
      'UPDATE especialidades SET nombre=?, descripcion=?, activo=? WHERE id=?',
      [nombre, descripcion, activo, req.params.id]
    );
    res.json({ success: true, message: 'Especialidad actualizada' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

const remove = async (req, res) => {
  try {
    const [exists] = await pool.query('SELECT id FROM especialidades WHERE id = ?', [req.params.id]);
    if (exists.length === 0) return res.status(404).json({ success: false, message: 'Especialidad no encontrada' });

    await pool.query('DELETE FROM especialidades WHERE id = ?', [req.params.id]);
    res.json({ success: true, message: 'Especialidad eliminada' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

module.exports = { getAll, getById, create, update, remove };
