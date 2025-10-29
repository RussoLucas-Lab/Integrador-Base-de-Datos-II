import mongoose from "mongoose";

const resenaSchema = new mongoose.Schema({
  usuario: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User", // referencia al  usuario
    required: true,
  },
  producto: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Producto", 
    required: true,
  },
  calificacion: {
    type: Number, //Calificacion entre 1 y 10
    min: 1,
    max: 10,
    required: true,
  },
  comentario: {
    type: String,
    required: true,
  },
  fecha: {
    type: Date,
    default: Date.now,
  },
});

export const Resena = mongoose.model("Resena", resenaSchema);
