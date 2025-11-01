import express from "express";
import { checkToken } from "../services/auth.service.js";
import {
  createUsuario,
  readUsuario,
  updateUsuario,
  deleteUsuario,
  login,
} from "../controllers/usuarioController.js";

export const usuarioRoutes = express.Router();

//Validacion del token
const validateToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];
  const decode = checkToken(token);
  req.user = decode;
  next();
};

usuarioRoutes
  .post("/crear", createUsuario)
  .get("/listar", validateToken, readUsuario)
  .put("/actualizar/:id", validateToken, updateUsuario)
  .delete("/eliminar/:id", deleteUsuario)
  .post("/login", login);
