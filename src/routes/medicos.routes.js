const router = require('express').Router();
const { body } = require('express-validator');
const ctrl = require('../controllers/medicos.controller');
const { verifyToken, isAdmin } = require('../middlewares/auth.middleware');
const { validate } = require('../middlewares/validate.middleware');

router.get('/',    verifyToken, ctrl.getAll);
router.get('/:id', verifyToken, ctrl.getById);

router.post('/',
  verifyToken, isAdmin,
  [
    body('usuario_id').isInt({ min: 1 }).withMessage('usuario_id inválido'),
    body('especialidad_id').isInt({ min: 1 }).withMessage('especialidad_id inválido'),
    body('numero_licencia').trim().notEmpty().withMessage('Número de licencia requerido'),
  ],
  validate, ctrl.create
);

router.put('/:id',
  verifyToken, isAdmin,
  [
    body('especialidad_id').isInt({ min: 1 }),
    body('numero_licencia').trim().notEmpty(),
    body('activo').isBoolean(),
  ],
  validate, ctrl.update
);

router.delete('/:id', verifyToken, isAdmin, ctrl.remove);

module.exports = router;
