import express from "express";
import { validateToken, requireAdmin } from "../services/auth.service.js";
import {
  createUsuario,
  readUsuario,
  updateUsuario,
  deleteUsuario,
  login,
} from "../controllers/usuarioController.js";

export const usuarioRoutes = express.Router();

usuarioRoutes
  .post("/crear", createUsuario)
  .get("/listar",validateToken,requireAdmin, readUsuario)
  .put("/actualizar/:id", validateToken,requireAdmin, updateUsuario)
  .delete("/eliminar/:id", validateToken, requireAdmin, deleteUsuario)
  .post("/login", login);
