import express from "express";
import {
  crearCategoria,
  listarCategorias,
  obtenerCategoriaPorId,
  actualizarCategoria,
  eliminarCategoria
} from "../controllers/categoriaController.js";

export const categoriaRoutes = express.Router();

categoriaRoutes.post("/crear", crearCategoria);
categoriaRoutes.get("/listar", listarCategorias);
categoriaRoutes.get("/listarPorId/:id", obtenerCategoriaPorId);
categoriaRoutes.put("/actualizar/:id", actualizarCategoria);
categoriaRoutes.delete("/eliminar/:id", eliminarCategoria);


