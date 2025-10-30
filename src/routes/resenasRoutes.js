import express from 'express';
import * as resenaController from '../controllers/resenaController.js'; 

const router = express.Router();

router.route('/productos/:productoId/resenas')
    .post(resenaController.crearResena)
    .get(resenaController.listarResenasPorProducto);

router.route('/resenas/:id')
    .get(resenaController.obtenerResena)
    .put(resenaController.actualizarResena)
    .delete(resenaController.eliminarResena);

export default router;