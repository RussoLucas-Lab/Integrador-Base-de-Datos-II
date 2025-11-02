import { Producto } from "../models/productoModel.js";
import { Categoria } from "../models/categoriaModel.js";
// Listar todos los productos
export const listarProductos = async (req, res) => {
  try {
    const productos = await Producto.find();
    return res.status(200).json(productos);
  } catch (err) {
    return res
      .status(500)
      .json({ error: "Error al obtener productos", details: err.message });
  }
};

// Obtener un producto por ID
export const obtenerProducto = async (req, res) => {
  try {
    const { id } = req.params;
    const producto = await Producto.findById(id);
    if (!producto)
      return res.status(404).json({ error: "Producto no encontrado" });
    return res.status(200).json(producto);
  } catch (err) {
    return res
      .status(500)
      .json({ error: "Error al obtener producto", details: err.message });
  }
};

// Crear un nuevo producto
export const crearProducto = async (req, res) => {
  try {
    const productoGuardado = await Producto.create(req.body);


    if (req.body.categoria) {
      const categoria = await Categoria.findById(req.body.categoria);
      if (categoria) {
        categoria.productos = categoria.productos || [];
        categoria.productos.push(productoGuardado._id);
        await categoria.save();
      }
    }

    return res.status(201).json(productoGuardado);
  } catch (err) {
    if (err.name === "ValidationError") {
      return res.status(400).json({
        error: "Datos de producto incompletos o inválidos",
        details: err.message,
      });
    }
    return res.status(500).json({
      error: "Error al crear el producto",
      details: err.message,
    });
  }
};

// Actualizar un producto por ID
export const actualizarProducto = async (req, res) => {
  try {
    const { id } = req.params;
    const datos = req.body;
    const productoActualizado = await Producto.findByIdAndUpdate(id, datos, {
      new: true,
      runValidators: true,
    });
    if (!productoActualizado)
      return res.status(404).json({ error: "Producto no encontrado" });
    return res.status(200).json(productoActualizado);
  } catch (err) {
    return res
      .status(500)
      .json({ error: "Error al actualizar producto", details: err.message });
  }
};

//Actualizar stock
export const actualizarStock = async (req, res) => {
  try {
    const { id } = req.params;
    const { stock } = req.body;

    if (stock === undefined || stock < 0) {
      return res.status(400).json({ message: "Stock inválido" });
    }

    const productoActualizado = await Producto.findByIdAndUpdate(
      id,
      { stock },
      { new: true, runValidators: true }
    );

    if (!productoActualizado) {
      return res.status(404).json({ message: `Producto con id ${id} no encontrado` });
    }

    res.status(200).json(productoActualizado);
  } catch (err) {
    res.status(500).json({ message: "Error al actualizar el stock", details: err.message });
  }
};

// Eliminar un producto por ID
export const eliminarProducto = async (req, res) => {
  try {
    const { id } = req.params;
    const productoEliminado = await Producto.findByIdAndDelete(id);
    if (!productoEliminado)
      return res.status(404).json({ error: "Producto no encontrado" });
    return res
      .status(200)
      .json({ message: "Producto eliminado correctamente" });
  } catch (err) {
    return res
      .status(500)
      .json({ error: "Error al eliminar producto", details: err.message });
  }
};

//Buscar por rango de precio
export const listarPorPrecioYMarca = async (req, res) => {
  try {
     const { min, max, marca } = req.params; 
    const filtro = {};

    // Filtrar por rango de precio
    if (min || max) {
      filtro.precio = {};
      if (min) filtro.precio.$gte = Number(min);
      if (max) filtro.precio.$lte = Number(max);
    }

    const productos = await Producto.find(filtro);
    return res.status(200).json(productos);
  } catch (err) {
    return res.status(500).json({
      error: "Error al obtener productos",
      details: err.message,
    });
  }
};

//Producto mas resenado

export const productoMasResenado = async (req, res) => {
  try {
    const resultado = await Producto.aggregate([
      {
        $lookup: {
          from: "resenas",
          localField: "_id",
          foreignField: "producto",
          as: "reseñas"
        }
      },
      {
        $addFields: {
          cantidadResenas: { $size: "$reseñas" }
        }
      },
      { $sort: { cantidadResenas: -1 } },
      { $limit: 1 },
      {
        $project: {
          nombre: 1,
          descripcion: 1,
          precio: 1,
          cantidadResenas: 1
        }
      }
    ]);

    if (!resultado.length) {
      return res.status(404).json({ message: "No hay productos con reseñas" });
    }

    res.status(200).json(resultado[0]);
  } catch (err) {
    res.status(500).json({ message: "Error al obtener el producto más reseñado", details: err.message });
  }
};
