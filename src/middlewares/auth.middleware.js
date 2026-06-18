const jwt = require('jsonwebtoken');

const verifyToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Bearer <token>

  if (!token) {
    return res.status(401).json({ success: false, message: 'Token requerido' });
  }

  try {
    // CAMBIO AQUÍ: Se usa la misma clave fija de respaldo si el .env falla
    const secretKey = process.env.JWT_SECRET || 'MiClaveSecretaUltraSegura123!';
    
    const decoded = jwt.verify(token, secretKey);
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(403).json({ success: false, message: 'Token inválido o expirado' });
  }
};

const isAdmin = (req, res, next) => {
  if (req.user?.rol !== 'admin') {
    return res.status(403).json({ success: false, message: 'Acceso restringido a administradores' });
  }
  next();
};

module.exports = { verifyToken, isAdmin };