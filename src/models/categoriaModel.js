import mongoose from "mongoose";

const categoriaSchema = new mongoose.Schema({
  nombre: { type: String, required: true, unique: true, trim: true },
  descripcion: { type: String, required: true, trim: true },

  productos: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Producto"
    }
  ]
});

export const Categoria = mongoose.model("Categoria", categoriaSchema);