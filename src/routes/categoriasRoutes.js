import express from "express";
import {
  crearCategoria,
  listarCategorias,
  obtenerCategoriaPorId,
  actualizarCategoria,
  eliminarCategoria,
  contarProductosPorCategoria
} from "../controllers/categoriaController.js";
import { validateToken, requireAdmin } from "../services/auth.service.js";

export const categoriaRoutes = express.Router();

categoriaRoutes
  .route("/")  
  .post(validateToken, requireAdmin, crearCategoria)
  .get(validateToken, requireAdmin, listarCategorias);

  categoriaRoutes
  .route("/stats")
  .get(validateToken, requireAdmin, contarProductosPorCategoria)

  categoriaRoutes
  .route("/:id")
  .get(validateToken, requireAdmin, obtenerCategoriaPorId)
  .put(validateToken, requireAdmin, actualizarCategoria)
  .delete(validateToken, requireAdmin, eliminarCategoria);