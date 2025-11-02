import express from "express";
import {
  listarProductos,
  obtenerProducto,
  crearProducto,
  actualizarProducto,
  actualizarStock,
  eliminarProducto,
  listarPorPrecioYMarca,
  productoMasResenado,
} from "../controllers/productoController.js";
import { validateToken, requireAdmin } from "../services/auth.service.js";

export const productoRoutes = express.Router();

productoRoutes.route("/top").get(productoMasResenado);

productoRoutes.route("/")
.get(listarProductos)
.post(validateToken,requireAdmin,crearProducto);


productoRoutes.route("/stock/:id")
  .put(validateToken, requireAdmin, actualizarStock)
productoRoutes.route("/filtro/:min/:max").get(listarPorPrecioYMarca);

productoRoutes
  .route("/:id")
  .get(validateToken, requireAdmin, obtenerProducto)
  .put(validateToken, requireAdmin, actualizarProducto)
  .delete(validateToken, requireAdmin ,eliminarProducto);
