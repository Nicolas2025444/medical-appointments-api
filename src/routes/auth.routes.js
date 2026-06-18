const router = require('express').Router();
const { body } = require('express-validator');
const { register, login, me } = require('../controllers/auth.controller');
const { verifyToken } = require('../middlewares/auth.middleware');
const { validate }    = require('../middlewares/validate.middleware');

router.post('/register',
  [
    body('nombre').trim().notEmpty().withMessage('Nombre requerido'),
    body('email').isEmail().withMessage('Email inválido'),
    body('password').isLength({ min: 6 }).withMessage('Mínimo 6 caracteres'),
    body('rol').optional().isIn(['admin', 'medico', 'paciente']).withMessage('Rol inválido'),
  ],
  validate,
  register
);

router.post('/login',
  [
    body('email').isEmail().withMessage('Email inválido'),
    body('password').notEmpty().withMessage('Password requerido'),
  ],
  validate,
  login
);

router.get('/me', verifyToken, me);

module.exports = router;
