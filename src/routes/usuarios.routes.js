const router = require('express').Router();
const { body } = require('express-validator');
const ctrl = require('../controllers/usuarios.controller');
const { verifyToken, isAdmin } = require('../middlewares/auth.middleware');
const { validate } = require('../middlewares/validate.middleware');

router.use(verifyToken, isAdmin);

router.get('/',    ctrl.getAll);
router.get('/:id', ctrl.getById);

router.post('/',
  [
    body('nombre').trim().notEmpty().withMessage('Nombre requerido'),
    body('email').isEmail().withMessage('Email inválido'),
    body('password').isLength({ min: 6 }).withMessage('Mínimo 6 caracteres'),
    body('rol').optional().isIn(['admin', 'medico', 'paciente']),
  ],
  validate, ctrl.create
);

router.put('/:id',
  [
    body('nombre').trim().notEmpty(),
    body('email').isEmail(),
    body('rol').isIn(['admin', 'medico', 'paciente']),
    body('activo').isBoolean(),
  ],
  validate, ctrl.update
);

router.delete('/:id', ctrl.remove);

module.exports = router;
