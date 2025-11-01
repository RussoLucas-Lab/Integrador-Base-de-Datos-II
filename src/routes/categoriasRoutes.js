import express from "express";
import {
  crearCategoria,
  listarCategorias,
  obtenerCategoriaPorId,
  actualizarCategoria,
  eliminarCategoria,
  contarProductosPorCategoria
} from "../controllers/categoriaController.js";

export const categoriaRoutes = express.Router();

categoriaRoutes
  .route("/")  
  .post(crearCategoria)
  .get(listarCategorias);

categoriaRoutes
  .route("/:id")
  .get(obtenerCategoriaPorId)
  .put(actualizarCategoria)
  .delete(eliminarCategoria);

  categoriaRoutes
  .route("/stats")
  .get(contarProductosPorCategoria)