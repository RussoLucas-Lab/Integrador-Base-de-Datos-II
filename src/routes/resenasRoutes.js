import express from "express";
import {
  crearResena,
  listarResenasPorProducto,
  obtenerResena,
  actualizarResena,
  eliminarResena,
  promedioCalificacionesPorProducto
} from "../controllers/resenasControler.js";
import { validateToken, requireAdmin } from "../services/auth.service.js";

export const resenaRoutes = express.Router();

resenaRoutes.route("/top")
  .get(promedioCalificacionesPorProducto)

resenaRoutes
  .route("/productos/:productoId")
  .post(validateToken, crearResena) //ENVIAR EL USUARIO EN EL BODY DEL REQUEST {"usuario": "userId"}
  .get(listarResenasPorProducto);

resenaRoutes
  .route("/:id")
  .get(obtenerResena)
  .put(validateToken, requireAdmin, actualizarResena)
  .delete(validateToken, requireAdmin, eliminarResena);
