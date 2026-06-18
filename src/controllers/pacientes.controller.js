const { pool } = require('../config/database');

const SELECT_PACIENTE = `
  SELECT p.id, p.fecha_nac, p.genero, p.telefono, p.direccion, p.created_at,
         u.nombre, u.email
  FROM pacientes p
  JOIN usuarios u ON u.id = p.usuario_id
`;

const getAll = async (req, res) => {
  try {
    const [rows] = await pool.query(SELECT_PACIENTE + ' ORDER BY u.nombre');
    res.json({ success: true, data: rows });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

const getById = async (req, res) => {
  try {
    const [rows] = await pool.query(SELECT_PACIENTE + ' WHERE p.id = ?', [req.params.id]);
    if (rows.length === 0) return res.status(404).json({ success: false, message: 'Paciente no encontrado' });
    res.json({ success: true, data: rows[0] });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

const create = async (req, res) => {
  try {
    const { usuario_id, fecha_nac, genero, telefono, direccion } = req.body;
    const [result] = await pool.query(
      'INSERT INTO pacientes (usuario_id, fecha_nac, genero, telefono, direccion) VALUES (?, ?, ?, ?, ?)',
      [usuario_id, fecha_nac, genero, telefono || null, direccion || null]
    );
    res.status(201).json({ success: true, message: 'Paciente creado', data: { id: result.insertId } });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

const update = async (req, res) => {
  try {
    const { fecha_nac, genero, telefono, direccion } = req.body;
    const [exists] = await pool.query('SELECT id FROM pacientes WHERE id = ?', [req.params.id]);
    if (exists.length === 0) return res.status(404).json({ success: false, message: 'Paciente no encontrado' });

    await pool.query(
      'UPDATE pacientes SET fecha_nac=?, genero=?, telefono=?, direccion=? WHERE id=?',
      [fecha_nac, genero, telefono, direccion, req.params.id]
    );
    res.json({ success: true, message: 'Paciente actualizado' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

const remove = async (req, res) => {
  try {
    const [exists] = await pool.query('SELECT id FROM pacientes WHERE id = ?', [req.params.id]);
    if (exists.length === 0) return res.status(404).json({ success: false, message: 'Paciente no encontrado' });

    await pool.query('DELETE FROM pacientes WHERE id = ?', [req.params.id]);
    res.json({ success: true, message: 'Paciente eliminado' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

module.exports = { getAll, getById, create, update, remove };
