import mongoose from "mongoose";
import { Usuario } from "./src/models/usuarioModel.js";
import { Categoria } from "./src/models/categoriaModel.js";
import { Producto } from "./src/models/productoModel.js";
import { Resena } from "./src/models/resenaModel.js";
import { Pedido } from "./src/models/pedidoModel.js";
import { Carrito } from "./src/models/carritoModel.js";
import { encriptPass } from "./src/services/password.service.js";

async function seed() {
  try {
    await mongoose.connect("mongodb://localhost:27017/IntegradorBDII", {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("✅ Conectado a MongoDB. Limpiando colecciones...");

    await Usuario.deleteMany({});
    await Categoria.deleteMany({});
    await Producto.deleteMany({});
    await Resena.deleteMany({});
    await Pedido.deleteMany({});
    await Carrito.deleteMany({});

    // --- Usuarios ---
    const usuarios = await Promise.all([
      {
        nombre: "Lucas Russo",
        email: "lucas@email.com",
        contrasena: await encriptPass("123456"),
        rol: "cliente",
        direccion: {
          calle: "Calle 1",
          ciudad: "Mendoza",
          codigoPostal: "5500",
        },
        telefono: "2611234567",
      },
      {
        nombre: "María Pérez",
        email: "maria@email.com",
        contrasena: await encriptPass("123456"),
        rol: "cliente",
        direccion: {
          calle: "Calle 2",
          ciudad: "Mendoza",
          codigoPostal: "5501",
        },
        telefono: "2617654321",
      },
      {
        nombre: "Juan González",
        email: "juan@email.com",
        contrasena: await encriptPass("123456"),
        rol: "administrador",
        direccion: {
          calle: "Calle 3",
          ciudad: "Mendoza",
          codigoPostal: "5502",
        },
        telefono: "2611122334",
      },
    ]);

    const usuariosInsertados = await Usuario.insertMany(usuarios);

    // --- Categorías ---
    const categorias = await Categoria.insertMany([
      { nombre: "Libros", descripcion: "Todo tipo de libros" },
      { nombre: "Electrónica", descripcion: "Dispositivos electrónicos" },
      { nombre: "Ropa", descripcion: "Indumentaria y accesorios" },
    ]);

    // --- Productos ---
    const productos = await Producto.insertMany([
      {
        nombre: "Libro de Node.js",
        descripcion: "Aprende Node",
        precio: 500,
        stock: 10,
        categoria: categorias[0]._id,
      },
      {
        nombre: "Smartphone",
        descripcion: "Teléfono moderno",
        precio: 15000,
        stock: 5,
        categoria: categorias[1]._id,
      },
      {
        nombre: "Remera Azul",
        descripcion: "Remera de algodón",
        precio: 800,
        stock: 20,
        categoria: categorias[2]._id,
      },
      {
        nombre: "Libro de MongoDB",
        descripcion: "Aprende MongoDB",
        precio: 600,
        stock: 8,
        categoria: categorias[0]._id,
      },
      {
        nombre: "Auriculares",
        descripcion: "Auriculares inalámbricos",
        precio: 2000,
        stock: 15,
        categoria: categorias[1]._id,
      },
    ]);

    // Actualizar productos en categorías
    for (const cat of categorias) {
      const prods = productos.filter(
        (p) => p.categoria.toString() === cat._id.toString()
      );
      cat.productos = prods.map((p) => p._id);
      await cat.save();
    }

    // --- Reseñas ---
    await Resena.insertMany([
      {
        usuario: usuariosInsertados[0]._id,
        producto: productos[0]._id,
        calificacion: 9,
        comentario: "Excelente libro!",
      },
      {
        usuario: usuariosInsertados[1]._id,
        producto: productos[1]._id,
        calificacion: 8,
        comentario: "Muy buen teléfono",
      },
      {
        usuario: usuariosInsertados[0]._id,
        producto: productos[3]._id,
        calificacion: 7,
        comentario: "Libro útil",
      },
    ]);

    for (const resena of resenas) {
      await Producto.findByIdAndUpdate(resena.producto, {
        $push: { reseñas: resena._id },
      });
    }

    // --- Pedidos ---
    await Pedido.insertMany([
      {
        usuario: usuariosInsertados[0]._id,
        items: [
          {
            producto: productos[0]._id,
            cantidad: 1,
            subtotal: productos[0].precio,
          },
          {
            producto: productos[1]._id,
            cantidad: 2,
            subtotal: productos[1].precio * 2,
          },
        ],
        total: productos[0].precio + productos[1].precio * 2,
        metodoPago: "tarjeta",
        estado: "pendiente",
      },
      {
        usuario: usuariosInsertados[1]._id,
        items: [
          {
            producto: productos[2]._id,
            cantidad: 3,
            subtotal: productos[2].precio * 3,
          },
        ],
        total: productos[2].precio * 3,
        metodoPago: "efectivo",
        estado: "procesando",
      },
    ]);

    // --- Carritos ---
    await Carrito.insertMany([
      {
        usuario: usuariosInsertados[0]._id,
        items: [
          { producto: productos[4]._id, cantidad: 1 },
          { producto: productos[3]._id, cantidad: 2 },
        ],
      },
      {
        usuario: usuariosInsertados[1]._id,
        items: [
          { producto: productos[1]._id, cantidad: 1 },
          { producto: productos[2]._id, cantidad: 2 },
        ],
      },
    ]);

    console.log("🌱 Seed completado correctamente!");
  } catch (err) {
    console.error("❌ Error en el seed:", err);
  } finally {
    mongoose.connection.close();
  }
}

seed();
