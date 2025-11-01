import express from "express";
import {
  listarProductos,
  obtenerProducto,
  crearProducto,
  actualizarProducto,
  actualizarStock,
  eliminarProducto,
  listarPorPrecioYMarca,
  productoMasReseñado
} from "../controllers/productoController.js";

export const productoRoutes = express.Router();

productoRoutes.route("/").get(listarProductos).post(crearProducto);

productoRoutes
  .route("/:id")
  .get(obtenerProducto)
  .put(actualizarProducto)
  .put(actualizarStock)
  .delete(eliminarProducto);

productoRoutes.route("/filtro/:min/:max/:marca").get(listarPorPrecioYMarca);
productoRoutes.route("/top").get(productoMasReseñado)
