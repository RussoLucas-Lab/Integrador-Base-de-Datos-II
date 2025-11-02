import express from "express";
import {
  crearPedido,
  listarPedidos,
  obtenerPedido,
  actualizarPedido,
  eliminarPedido,
  actualizarEstadoPedido,
} from "../controllers/pedidoController.js";
import { validateToken, requireAdmin } from "../services/auth.service.js";
export const pedidoRoutes = express.Router();

pedidoRoutes.route("/")
  .get(validateToken,listarPedidos)
  .post(validateToken, crearPedido);

pedidoRoutes
  .route("/:id")
  .get(validateToken, obtenerPedido)
  .put(validateToken, requireAdmin,actualizarPedido)
  .delete(validateToken, requireAdmin, eliminarPedido);

pedidoRoutes.route("/:id/estado").patch(validateToken, requireAdmin, actualizarEstadoPedido);
