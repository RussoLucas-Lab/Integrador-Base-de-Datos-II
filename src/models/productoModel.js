import mongoose from "mongoose";

const productoSchema = new mongoose.Schema({
  nombre: { type: String, required: true },
  descripcion: { type: String, required: true },
  precio: { type: Number, required: true, min: 0 },
  stock: { type: Number, required: true, min: 0 },
  categoria: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Categoria",
    required: true
  },
  reseñas: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Resena",
    },
  ]
});

export const Producto = mongoose.model("Producto", productoSchema);
