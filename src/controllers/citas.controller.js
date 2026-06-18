const { pool } = require('../config/database');

const SELECT_CITA = `
  SELECT c.id, c.fecha_hora, c.motivo, c.estado, c.notas, c.created_at,
         p.id AS paciente_id,  up.nombre AS paciente,
         m.id AS medico_id,    um.nombre AS medico,
         e.nombre  AS especialidad
  FROM citas c
  JOIN pacientes    p  ON p.id  = c.paciente_id
  JOIN usuarios     up ON up.id = p.usuario_id
  JOIN medicos      m  ON m.id  = c.medico_id
  JOIN usuarios     um ON um.id = m.usuario_id
  JOIN especialidades e ON e.id = m.especialidad_id
`;

const getAll = async (req, res) => {
  try {
    const [rows] = await pool.query(SELECT_CITA + ' ORDER BY c.fecha_hora DESC');
    res.json({ success: true, data: rows });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

const getById = async (req, res) => {
  try {
    const [rows] = await pool.query(SELECT_CITA + ' WHERE c.id = ?', [req.params.id]);
    if (rows.length === 0) return res.status(404).json({ success: false, message: 'Cita no encontrada' });
    res.json({ success: true, data: rows[0] });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

const create = async (req, res) => {
  try {
    const { paciente_id, medico_id, fecha_hora, motivo, notas } = req.body;

    // Verificar que no haya conflicto de horario para el médico
    const [conflict] = await pool.query(
      `SELECT id FROM citas
       WHERE medico_id = ? AND fecha_hora = ? AND estado NOT IN ('cancelada')`,
      [medico_id, fecha_hora]
    );
    if (conflict.length > 0) {
      return res.status(409).json({ success: false, message: 'El médico ya tiene una cita en ese horario' });
    }

    const [result] = await pool.query(
      'INSERT INTO citas (paciente_id, medico_id, fecha_hora, motivo, notas) VALUES (?, ?, ?, ?, ?)',
      [paciente_id, medico_id, fecha_hora, motivo, notas || null]
    );
    res.status(201).json({ success: true, message: 'Cita programada', data: { id: result.insertId } });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

const update = async (req, res) => {
  try {
    const { fecha_hora, motivo, estado, notas } = req.body;
    const [exists] = await pool.query('SELECT id FROM citas WHERE id = ?', [req.params.id]);
    if (exists.length === 0) return res.status(404).json({ success: false, message: 'Cita no encontrada' });

    await pool.query(
      'UPDATE citas SET fecha_hora=?, motivo=?, estado=?, notas=? WHERE id=?',
      [fecha_hora, motivo, estado, notas, req.params.id]
    );
    res.json({ success: true, message: 'Cita actualizada' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

const remove = async (req, res) => {
  try {
    const [exists] = await pool.query('SELECT id FROM citas WHERE id = ?', [req.params.id]);
    if (exists.length === 0) return res.status(404).json({ success: false, message: 'Cita no encontrada' });

    await pool.query('DELETE FROM citas WHERE id = ?', [req.params.id]);
    res.json({ success: true, message: 'Cita eliminada' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

module.exports = { getAll, getById, create, update, remove };
