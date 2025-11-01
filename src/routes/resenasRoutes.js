import express from "express";
import {
  crearResena,
  listarResenasPorProducto,
  obtenerResena,
  actualizarResena,
  eliminarResena,
  promedioCalificacionesPorProducto
} from "../controllers/resenasControler.js";

export const resenaRoutes = express.Router();

resenaRoutes
  .route("/productos/:productoId")
  .post(crearResena) //ENVIAR EL USUARIO EN EL BODY DEL REQUEST {"usuario": "userId"}
  .get(listarResenasPorProducto);

resenaRoutes
  .route("/:id")
  .get(obtenerResena)
  .put(actualizarResena)
  .delete(eliminarResena);
resenaRoutes.route("/top").get(promedioCalificacionesPorProducto)