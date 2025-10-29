import { Usuario } from "../models/usuarioModel.js";
import { encriptPass, validatePass } from "../services/password.service.js";
import express from "express"

export const usuarioRoutes = express.Router();

//CREATE
export const createUsuario = async (req, res) => {
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
};

//READ
export const readUsuario = async (req, res) => {
  try {
    const users = await Usuario.find();
    if (users.length === 0) {
      res.status(204).json([]);
    }
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: `Error en la peticion: ${error}` });
  }
};

//UPDATE
export const updateUsuario = async (req, res) => {
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
}; 

//DELETE
export const deleteUsuario =  async (req, res) => {
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
};

//LOGIN
export const login = async (req, res) => {
  const { email, contrasena } = req.body;
  if (!email || !contrasena) {
    return res.status(400).json({ message: "Email o contraseña faltante" });
  }
  const user = await Usuario.findOne({ email });
  const validPass = await validatePass(contrasena, user.contrasena);
  const token = generateToken(user);
  return res.status(201).json({ user, token });
};