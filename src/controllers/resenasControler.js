import { Resena } from '../models/resenaModel.js';
import { Producto } from '../models/productoModel.js'; 
import { Pedido } from '../models/pedidoModel.js';

export const crearResena = async (req, res) => {
   try {
        const { usuario, producto, calificacion, comentario } = req.body;

        //Verificar que el usuario haya comprado el producto
        const pedidos = await Pedido.find({
            usuario: usuario,
            "items.producto": producto
        });

        if (!pedidos || pedidos.length === 0) {
            return res.status(400).json({
                error: "No puedes reseñar un producto que no has comprado"
            });
        }
        const nuevaResena = await Resena.create({ usuario, producto, calificacion, comentario });

        res.status(201).json(nuevaResena);

    } catch (err) {
        if (err.name === 'ValidationError') {
            return res.status(400).json({ error: "Datos incompletos o inválidos", details: err.message });
        }
        return res.status(500).json({ error: "Error al crear reseña", details: err.message });
    }
}

export const listarResenasPorProducto = async (req, res) => {
    try {
        const { productoId } = req.params; 
        const resenas = await Resena.find({ producto: productoId })
            .populate('usuario', 'nombre email') 
            .sort({ fecha: -1 });

        return res.status(200).json(resenas);
    } catch (err) {
        if (err.name === 'CastError') {
            return res.status(400).json({ error: 'ID de producto no válido', details: err.message });
        }
        return res.status(500).json({ error: 'Error al obtener las reseñas', details: err.message });
    }
}

export const obtenerResena = async (req, res) => {
    try {
        const { id } = req.params;
        
        const resena = await Resena.findById(id)
            .populate('usuario', 'nombre')
            .populate('producto', 'nombre');

        if (!resena) {
            return res.status(404).json({ error: 'Reseña no encontrada' });
        }
        return res.status(200).json(resena);
    } catch (err) {
        if (err.name === 'CastError') {
            return res.status(400).json({ error: 'ID de reseña no válido', details: err.message });
        }
        return res.status(500).json({ error: 'Error al obtener reseña', details: err.message });
    }
}

export const actualizarResena = async (req, res) => {
    try {
        const { id } = req.params;
        const datos = req.body;
        const resenaActualizada = await Resena.findByIdAndUpdate(id, datos, { 
            new: true, 
            runValidators: true 
        })
        .populate('usuario', 'nombre');

        if (!resenaActualizada) {
            return res.status(404).json({ error: 'Reseña no encontrada' });
        }
        return res.status(200).json(resenaActualizada);
    } catch (err) {
        if (err.name === 'CastError' || err.name === 'ValidationError') {
            return res.status(400).json({ error: 'ID o datos de reseña no válidos', details: err.message });
        }
        return res.status(500).json({ error: 'Error al actualizar reseña', details: err.message });
    }
}

export const eliminarResena = async (req, res) => {
    try {
        const { id } = req.params;
        const resenaEliminada = await Resena.findByIdAndDelete(id);

        if (!resenaEliminada) {
            return res.status(404).json({ error: 'Reseña no encontrada' });
        }

        return res.status(200).json({ message: 'Reseña eliminada correctamente' });
    } catch (err) {
        if (err.name === 'CastError') {
            return res.status(400).json({ error: 'ID de reseña no válido', details: err.message });
        }
        return res.status(500).json({ error: 'Error al eliminar reseña', details: err.message });
    }
}

//Promedio de calificaciones por producto
export const promedioCalificacionesPorProducto = async (req, res) => {
    try {
        const resultado = await Resena.aggregate([
            {
                $group: {
                    _id: "$producto",
                    promedioCalificacion: { $avg: "$calificacion" },
                    totalResenas: { $sum: 1 }
                }
            },
            {
                $lookup: {
                    from: "productos",
                    localField: "_id",
                    foreignField: "_id",
                    as: "producto"
                }
            },
            { $unwind: "$producto" },
            {
                $project: {
                    _id: 0,
                    productoId: "$producto._id",
                    nombreProducto: "$producto.nombre",
                    promedioCalificacion: 1,
                    totalResenas: 1
                }
            }
        ]);

        res.status(200).json(resultado);
    } catch (err) {
        res.status(500).json({ error: "Error al calcular promedio", details: err.message });
    }
};