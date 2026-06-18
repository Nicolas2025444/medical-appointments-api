const router = require('express').Router();
const { body } = require('express-validator');
const ctrl = require('../controllers/citas.controller');
const { verifyToken } = require('../middlewares/auth.middleware');
const { validate }    = require('../middlewares/validate.middleware');

router.use(verifyToken);

router.get('/',    ctrl.getAll);
router.get('/:id', ctrl.getById);

router.post('/',
  [
    body('paciente_id').isInt({ min: 1 }).withMessage('paciente_id requerido'),
    body('medico_id').isInt({ min: 1 }).withMessage('medico_id requerido'),
    body('fecha_hora').isISO8601().withMessage('Fecha inválida (ISO8601)'),
    body('motivo').trim().notEmpty().withMessage('Motivo requerido'),
  ],
  validate, ctrl.create
);

router.put('/:id',
  [
    body('fecha_hora').isISO8601(),
    body('motivo').trim().notEmpty(),
    body('estado').isIn(['programada', 'confirmada', 'cancelada', 'completada']),
  ],
  validate, ctrl.update
);

router.delete('/:id', ctrl.remove);

module.exports = router;
