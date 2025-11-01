import express from "express";
import {
  crearPedido,
  listarPedidos,
  obtenerPedido,
  actualizarPedido,
  eliminarPedido,
  actualizarEstadoPedido,
} from "../controllers/pedidoController.js";

export const pedidoRoutes = express.Router();

pedidoRoutes.route("/").get(listarPedidos).post(crearPedido);

pedidoRoutes
  .route("/:id")
  .get(obtenerPedido)
  .put(actualizarPedido)
  .delete(eliminarPedido);

pedidoRoutes.route("/:id/estado").put(actualizarEstadoPedido);
