import { Pedido } from '../models/pedidoModel.js'; 
import { Producto } from '../models/productoModel.js'; 

export const crearPedido = async (req, res) => {
    try {
        const nuevoPedido = await Pedido.create(req.body);
        return res.status(201).json(nuevoPedido);
    } catch (err) {
        if (err.name === 'ValidationError') {
            return res.status(400).json({ 
                error: 'Datos del pedido incompletos o inválidos', 
                details: err.message 
            });
        }
        return res.status(500).json({ 
            error: 'Error al crear el pedido', 
            details: err.message 
        });
    }
}

export const listarPedidos = async (req, res) => {
    try {
        const pedidos = await Pedido.find()
            .populate('usuario', 'nombre email') 
            .populate('items.producto', 'nombre precio');
        
        return res.status(200).json(pedidos);
    } catch (err) {
        return res.status(500).json({ error: 'Error al obtener pedidos', details: err.message });
    }
}

export const obtenerPedido = async (req, res) => {
    try {
        const { id } = req.params;
        
        const pedido = await Pedido.findById(id)
            .populate('usuario', 'nombre email')
            .populate('items.producto', 'nombre precio');

        if (!pedido) {
            return res.status(404).json({ error: 'Pedido no encontrado' });
        }
        return res.status(200).json(pedido);
    } catch (err) {
        if (err.name === 'CastError') {
            return res.status(400).json({ error: 'ID de pedido no válido', details: err.message });
        }
        return res.status(500).json({ error: 'Error al obtener pedido', details: err.message });
    }
}

export const actualizarPedido = async (req, res) => {
    try {
        const { id } = req.params;
        const datos = req.body;
        
        const pedidoActualizado = await Pedido.findByIdAndUpdate(id, datos, { 
            new: true, 
            runValidators: true 
        })
        .populate('usuario', 'nombre email')
        .populate('items.producto', 'nombre precio');

        if (!pedidoActualizado) {
            return res.status(404).json({ error: 'Pedido no encontrado' });
        }
        return res.status(200).json(pedidoActualizado);
    } catch (err) {
        if (err.name === 'CastError') {
            return res.status(400).json({ error: 'ID de pedido no válido', details: err.message });
        }
        if (err.name === 'ValidationError') {
            return res.status(400).json({ error: 'Datos de actualización inválidos', details: err.message });
        }
        return res.status(500).json({ error: 'Error al actualizar pedido', details: err.message });
    }
}


export const eliminarPedido = async (req, res) => {
    try {
        const { id } = req.params;
        const pedidoEliminado = await Pedido.findByIdAndDelete(id);

        if (!pedidoEliminado) {
            return res.status(404).json({ error: 'Pedido no encontrado' });
        }
        return res.status(200).json({ message: 'Pedido eliminado correctamente' });
    } catch (err) {
        if (err.name === 'CastError') {
            return res.status(400).json({ error: 'ID de pedido no válido', details: err.message });
        }
        return res.status(500).json({ error: 'Error al eliminar pedido', details: err.message });
    }
}