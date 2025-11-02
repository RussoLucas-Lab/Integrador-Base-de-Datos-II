import { Categoria } from "../models/categoriaModel.js";
import {Producto} from "../models/productoModel.js";
//CREATE 
export const crearCategoria = async (req, res) => {
    try {
        const { nombre, descripcion } = req.body;
        if (!nombre || !descripcion) {
            return res.status(400).json({ message: "Faltan parámetros" });
        }

        const nuevaCategoria = new Categoria({ nombre, descripcion });
        await nuevaCategoria.save();
        res.status(201).json(nuevaCategoria);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

//READ - todas las categorias
export const listarCategorias = async (req, res) => {
    try {
        const categorias = await Categoria.find().populate("productos");
        if (categorias.length === 0) return res.status(204).json([]);
        res.status(200).json(categorias);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

//READ- por id
export const obtenerCategoriaPorId = async (req, res) => {
    try {
        const { id } = req.params;
        const categoria = await Categoria.findById(id).populate("productos");
        if (!categoria) return res.status(404).json({ message: "Categoría no encontrada" });
        res.status(200).json(categoria);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

//UPDATE
export const actualizarCategoria = async (req, res) => {
    try {
        const { id } = req.params;
        const { nombre, descripcion } = req.body;

        const categoriaActualizada = await Categoria.findByIdAndUpdate(
            id,
            { nombre, descripcion },
            { new: true }
        );

        if (!categoriaActualizada)
            return res.status(404).json({ message: "Categoría no encontrada" });

        res.status(200).json(categoriaActualizada);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

//DELETE
export const eliminarCategoria = async (req, res) => {
    try {
        const { id } = req.params;
        const categoriaEliminada = await Categoria.findByIdAndDelete(id);

        if (!categoriaEliminada)
            return res.status(404).json({ message: "Categoría no encontrada" });

        //Borrar en cascada todos los productos con esta categoría
        await Producto.deleteMany({ categoria: id });

        res.status(200).json({ message: `Categoría ${id} eliminada correctamente` });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

//Prdouctos por caterogria
export const contarProductosPorCategoria = async (req, res) => {
  try {
    const resultado = await Categoria.aggregate([
      {
        $lookup: {
          from: "productos",
          localField: "_id",
          foreignField: "categoria",
          as: "productos"
        }
      },
      {
        $project: {
          nombre: 1,
          cantidadProductos: { $size: "$productos" }
        }
      }
    ]);

    res.status(200).json(resultado);
  } catch (error) {
    res.status(500).json({ message: "Error al contar productos por categoría", details: error.message });
  }
};