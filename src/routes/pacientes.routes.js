const router = require('express').Router();
const { body } = require('express-validator');
const ctrl = require('../controllers/pacientes.controller');
const { verifyToken } = require('../middlewares/auth.middleware');
const { validate }    = require('../middlewares/validate.middleware');

router.use(verifyToken);

router.get('/',    ctrl.getAll);
router.get('/:id', ctrl.getById);

router.post('/',
  [
    body('usuario_id').isInt({ min: 1 }),
    body('fecha_nac').isDate().withMessage('Fecha inválida (YYYY-MM-DD)'),
    body('genero').isIn(['M', 'F', 'otro']).withMessage('Género: M, F u otro'),
  ],
  validate, ctrl.create
);

router.put('/:id',
  [
    body('fecha_nac').isDate(),
    body('genero').isIn(['M', 'F', 'otro']),
  ],
  validate, ctrl.update
);

router.delete('/:id', ctrl.remove);

module.exports = router;
