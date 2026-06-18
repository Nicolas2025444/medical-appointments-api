const { pool } = require('../config/database');

const SELECT_MEDICO = `
  SELECT m.id, m.numero_licencia, m.telefono, m.activo,
         u.nombre, u.email,
         e.id AS especialidad_id, e.nombre AS especialidad
  FROM medicos m
  JOIN usuarios      u ON u.id = m.usuario_id
  JOIN especialidades e ON e.id = m.especialidad_id
`;

const getAll = async (req, res) => {
  try {
    const [rows] = await pool.query(SELECT_MEDICO + ' ORDER BY u.nombre');
    res.json({ success: true, data: rows });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

const getById = async (req, res) => {
  try {
    const [rows] = await pool.query(SELECT_MEDICO + ' WHERE m.id = ?', [req.params.id]);
    if (rows.length === 0) return res.status(404).json({ success: false, message: 'Médico no encontrado' });
    res.json({ success: true, data: rows[0] });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

const create = async (req, res) => {
  try {
    const { usuario_id, especialidad_id, numero_licencia, telefono } = req.body;
    const [result] = await pool.query(
      'INSERT INTO medicos (usuario_id, especialidad_id, numero_licencia, telefono) VALUES (?, ?, ?, ?)',
      [usuario_id, especialidad_id, numero_licencia, telefono || null]
    );
    res.status(201).json({ success: true, message: 'Médico creado', data: { id: result.insertId } });
  } catch (err) {
    if (err.code === 'ER_DUP_ENTRY') return res.status(409).json({ success: false, message: 'Número de licencia ya registrado' });
    res.status(500).json({ success: false, message: err.message });
  }
};

const update = async (req, res) => {
  try {
    const { especialidad_id, numero_licencia, telefono, activo } = req.body;
    const [exists] = await pool.query('SELECT id FROM medicos WHERE id = ?', [req.params.id]);
    if (exists.length === 0) return res.status(404).json({ success: false, message: 'Médico no encontrado' });

    await pool.query(
      'UPDATE medicos SET especialidad_id=?, numero_licencia=?, telefono=?, activo=? WHERE id=?',
      [especialidad_id, numero_licencia, telefono, activo, req.params.id]
    );
    res.json({ success: true, message: 'Médico actualizado' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

const remove = async (req, res) => {
  try {
    const [exists] = await pool.query('SELECT id FROM medicos WHERE id = ?', [req.params.id]);
    if (exists.length === 0) return res.status(404).json({ success: false, message: 'Médico no encontrado' });

    await pool.query('DELETE FROM medicos WHERE id = ?', [req.params.id]);
    res.json({ success: true, message: 'Médico eliminado' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

module.exports = { getAll, getById, create, update, remove };
