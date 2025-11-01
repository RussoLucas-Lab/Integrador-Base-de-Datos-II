import express from "express";
import {
  obtenerCarrito,
  agregarOActualizarItem,
  eliminarItem,
  vaciarCarrito,
  calcularTotalCarrito,
} from "../controllers/carritoController.js";

export const carritoRoutes = express.Router();

carritoRoutes
  .route("/:userId")
  .get(obtenerCarrito)
  .post(agregarOActualizarItem);

carritoRoutes.route("/:userId/:productoId").delete(eliminarItem);

carritoRoutes.route("/vaciar/:userId").delete(vaciarCarrito);
carritoRoutes.route("/:userId/total").get(calcularTotalCarrito);
