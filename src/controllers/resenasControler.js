import { Resena } from '../models/resenaModel.js';
import { Producto } from '../models/productoModel.js'; 


export const crearResena = async (req, res) => {
    try {
        const nuevaResena = await Resena.create(req.body);
        return res.status(201).json(nuevaResena);
    } catch (err) {
        if (err.name === 'ValidationError') {
            return res.status(400).json({ 
                error: 'Datos de reseña incompletos o inválidos', 
                details: err.message 
            });
        }
        return res.status(500).json({ 
            error: 'Error al crear la reseña', 
            details: err.message 
        });
    }
}

export const listarResenasPorProducto = async (req, res) => {
    try {
        const { productoId } = req.params; // Suponiendo una ruta como /api/productos/:productoId/resenas
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