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

export const Usuario = mongoose.model("Usuario", userSchema);

//RESENAS
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

//PRODUCTO

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
//PEDIDO

const pedidoSchema = new mongoose.Schema({
  usuario: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  items: [
    {
      producto: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Producto",
        required: true
      },
      cantidad: { type: Number, required: true, min: 1 },
      subtotal: { type: Number, required: true, min: 0 }
    }
  ],
  fecha: { type: Date, default: Date.now },
  estado: {
    type: String,
    enum: ["pendiente", "procesando", "enviado", "entregado", "cancelado"],
    default: "pendiente"
  },
  total: { type: Number, required: true, min: 0 },
  metodoPago: {
    type: String,
    enum: ["efectivo", "tarjeta", "transferencia"],
    required: true
  }
});

export const Pedido = mongoose.model("Pedido", pedidoSchema);

//CATEGORIA

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
//CARRITO


const carritoSchema = new mongoose.Schema({
  usuario: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
    unique: true
  },
  items: [
    {
      producto: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Producto",
        required: true
      },
      cantidad: { type: Number, required: true, min: 1 }
    }
  ],
  fechaCreacion: { type: Date, default: Date.now }
});

export const Carrito = mongoose.model("Carrito", carritoSchema);
