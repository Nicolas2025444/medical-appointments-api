const router = require('express').Router();
const { body } = require('express-validator');
const ctrl = require('../controllers/especialidades.controller');
const { verifyToken, isAdmin } = require('../middlewares/auth.middleware');
const { validate } = require('../middlewares/validate.middleware');

router.get('/',    verifyToken, ctrl.getAll);
router.get('/:id', verifyToken, ctrl.getById);

router.post('/',
  verifyToken, isAdmin,
  [body('nombre').trim().notEmpty().withMessage('Nombre requerido')],
  validate, ctrl.create
);

router.put('/:id',
  verifyToken, isAdmin,
  [
    body('nombre').trim().notEmpty(),
    body('activo').isBoolean(),
  ],
  validate, ctrl.update
);

router.delete('/:id', verifyToken, isAdmin, ctrl.remove);

module.exports = router;
