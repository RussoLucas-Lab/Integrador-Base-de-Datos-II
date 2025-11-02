import mongoose from "mongoose";

const userSchema = mongoose.Schema({
    nombre: { type: String, require: true },
    email: { type: String, require: true },
    contrasena: { type: String, require: true },
    rol: { type: String, enum: ["cliente", "administrador"], require: true },
    direccion: {
        //Direccion embebido en usuario.
        calle: { type: String, required: true },
        ciudad: { type: String, required: true },
        codigoPostal: { type: String, required: true },
    },
    telefono: { type: String, require: true },
});

export const Usuario = mongoose.model("Usuario", userSchema, "usuarios");
