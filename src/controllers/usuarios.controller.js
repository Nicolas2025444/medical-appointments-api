const bcrypt = require('bcryptjs');
const { pool } = require('../config/database');

const getAll = async (req, res) => {
  try {
    const [rows] = await pool.query(
      'SELECT id, nombre, email, rol, activo, created_at FROM usuarios ORDER BY id'
    );
    res.json({ success: true, data: rows });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

const getById = async (req, res) => {
  try {
    const [rows] = await pool.query(
      'SELECT id, nombre, email, rol, activo, created_at FROM usuarios WHERE id = ?',
      [req.params.id]
    );
    if (rows.length === 0) return res.status(404).json({ success: false, message: 'Usuario no encontrado' });
    res.json({ success: true, data: rows[0] });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

const create = async (req, res) => {
  try {
    const { nombre, email, password, rol = 'paciente' } = req.body;
    const [exists] = await pool.query('SELECT id FROM usuarios WHERE email = ?', [email]);
    if (exists.length > 0) return res.status(409).json({ success: false, message: 'Email ya existe' });

    const hash = await bcrypt.hash(password, 10);
    const [result] = await pool.query(
      'INSERT INTO usuarios (nombre, email, password, rol) VALUES (?, ?, ?, ?)',
      [nombre, email, hash, rol]
    );
    res.status(201).json({ success: true, message: 'Usuario creado', data: { id: result.insertId, nombre, email, rol } });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

const update = async (req, res) => {
  try {
    const { nombre, email, rol, activo } = req.body;
    const [exists] = await pool.query('SELECT id FROM usuarios WHERE id = ?', [req.params.id]);
    if (exists.length === 0) return res.status(404).json({ success: false, message: 'Usuario no encontrado' });

    await pool.query(
      'UPDATE usuarios SET nombre=?, email=?, rol=?, activo=? WHERE id=?',
      [nombre, email, rol, activo, req.params.id]
    );
    res.json({ success: true, message: 'Usuario actualizado' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

const remove = async (req, res) => {
  try {
    const [exists] = await pool.query('SELECT id FROM usuarios WHERE id = ?', [req.params.id]);
    if (exists.length === 0) return res.status(404).json({ success: false, message: 'Usuario no encontrado' });

    await pool.query('DELETE FROM usuarios WHERE id = ?', [req.params.id]);
    res.json({ success: true, message: 'Usuario eliminado' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

module.exports = { getAll, getById, create, update, remove };
