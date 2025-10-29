import express from "express";
import { Usuario } from "../models/usuarioModel.js";
import { encriptPass, validatePass } from "../services/password.service.js";
import { checkToken, generateToken } from "../services/auth.service.js";

export const usuarioRoutes = express.Router();

//Validacion del token
const validateToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];
  const decode = checkToken(token);
  req.user = decode;
  next();
};

//CRUD
//CREATE
usuarioRoutes.post("/crearUsuario", async (req, res) => {
  try {
    const { nombre, email, contrasena, rol, direccion, telefono } = req.body;

    if (!nombre || !email || !contrasena || !rol || !direccion || !telefono) {
      return res
        .status(400)
        .json({ message: "alguno de los parametros esta faltante" });
    }
    const password = await encriptPass(contrasena);
    const user = new Usuario({
      nombre,
      email,
      contrasena: password,
      rol,
      direccion,
      telefono,
    });
    const newUser = await user.save();
    const token = generateToken(newUser);
    return res.status(201).json({ newUser, token });
  } catch (e) {
    res.status(500).json({ message: `Error en la peticion: ${e}` });
  }
});

//READ
usuarioRoutes.get("/listarUsuarios", validateToken, async (req, res) => {
  try {
    const users = await Usuario.find();
    if (users.length === 0) {
      res.status(204).json([]);
    }
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: `Error en la peticion: ${error}` });
  }
});

//UPDATE
usuarioRoutes.put("/actualizarUsuario/:id", validateToken, async (req, res) => {
  try {
    const { nombre, email, direccion, telefono } = req.body;
    const { id } = req.params;
    const usrUpdate = await User.findByIdAndUpdate(
      id,
      {
        nombre,
        edad,
        email,
        direccion,
        telefono,
      },
      { new: true }
    );
    if (!usrUpdate) {
      return res
        .status(400)
        .json({ message: `El usuario con id ${id} no fue encontrado` });
    }
    res.status(200).json(usrUpdate);
  } catch (e) {
    res.status(500).json({ message: `Error en la peticion: ${e}` });
  }
});

//DELETE
usuarioRoutes.delete("/eliminarUsuario/:id", async (req, res) => {
  const { id } = req.params;
  const usrDelete = await Usuario.findByIdAndDelete(id);
  if (!usrDelete) {
    return res
      .status(400)
      .json({ message: `El usuario con id ${id} no fue encontrado` });
  }
  res
    .status(200)
    .json({ message: `El usuario con id ${id} fue eliminado correctamente` });
});

//LOGIN
usuarioRoutes.post("/login", async (req, res) => {
  const { email, contrasena } = req.body;
  if (!email || !contrasena) {
    return res.status(400).json({ message: "Email o contraseña faltante" });
  }
  const user = await Usuario.findOne({ email });
  const validPass = await validatePass(contrasena, user.contrasena);
  const token = generateToken(user);
  return res.status(201).json({ user, token });
});
