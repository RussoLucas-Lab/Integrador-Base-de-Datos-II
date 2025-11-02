import { Pedido } from '../models/pedidoModel.js'; 
import { Producto } from '../models/productoModel.js'; 

export const crearPedido = async (req, res) => {
    try {
    const { usuario, items, metodoPago } = req.body;

    if (!usuario || !items?.length || !metodoPago) {
      return res.status(400).json({ error: "Faltan datos del pedido" });
    }

    let total = 0;
    const itemsConSubtotal = [];

    for (const item of items) {
      const producto = await Producto.findById(item.producto);
      if (!producto) {
        return res.status(404).json({ error: `Producto con ID ${item.producto} no encontrado` });
      }

      const subtotal = producto.precio * item.cantidad;
      total += subtotal;

      itemsConSubtotal.push({
        producto: producto._id,
        cantidad: item.cantidad,
        subtotal,
      });
    }

    const nuevoPedido = new Pedido({
      usuario,
      items: itemsConSubtotal,
      total,
      metodoPago,
      estado: "pendiente",
    });

    await nuevoPedido.save();

    return res.status(201).json(nuevoPedido);
  } catch (err) {
    if (err.name === "ValidationError") {
      return res.status(400).json({
        error: "Datos del pedido incompletos o inválidos",
        details: err.message,
      });
    }
    return res.status(500).json({
      error: "Error al crear el pedido",
      details: err.message,
    });
  }
};

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
    const { items, metodoPago, estado } = req.body;

    const pedidoExistente = await Pedido.findById(id);
    if (!pedidoExistente) {
      return res.status(404).json({ error: "Pedido no encontrado" });
    }

    // Si se envían nuevos items, recalcular subtotales y total
    let total = pedidoExistente.total;
    let itemsActualizados = pedidoExistente.items;

    if (items && items.length > 0) {
      total = 0;
      itemsActualizados = [];

      for (const item of items) {
        const producto = await Producto.findById(item.producto);
        if (!producto) {
          return res.status(404).json({ error: `Producto con ID ${item.producto} no encontrado` });
        }

        const subtotal = producto.precio * item.cantidad;
        total += subtotal;

        itemsActualizados.push({
          producto: producto._id,
          cantidad: item.cantidad,
          subtotal,
        });
      }
    }

    pedidoExistente.items = itemsActualizados;
    pedidoExistente.total = total;
    if (metodoPago) pedidoExistente.metodoPago = metodoPago;
    if (estado) pedidoExistente.estado = estado;

    const pedidoActualizado = await pedidoExistente.save();

    const pedidoFinal = await Pedido.findById(pedidoActualizado._id)
      .populate("usuario", "nombre email")
      .populate("items.producto", "nombre precio");

    return res.status(200).json(pedidoFinal);
  } catch (err) {
    if (err.name === "CastError") {
      return res.status(400).json({ error: "ID de pedido no válido", details: err.message });
    }
    if (err.name === "ValidationError") {
      return res.status(400).json({ error: "Datos de actualización inválidos", details: err.message });
    }
    return res.status(500).json({ error: "Error al actualizar pedido", details: err.message });
  }
};


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

//Actualizar estado del pedido
export const actualizarEstadoPedido = async (req, res) => {
    try {
        const { id } = req.params;
        const { estado } = req.body;

        if (!estado) {
            return res.status(400).json({ error: "Debe indicar un estado válido" });
        }

        const pedidoActualizado = await Pedido.findByIdAndUpdate(
            id,
            { estado },
            { new: true, runValidators: true }
        )
        .populate('usuario', 'nombre email')
        .populate('items.producto', 'nombre precio');

        if (!pedidoActualizado) {
            return res.status(404).json({ error: "Pedido no encontrado" });
        }

        return res.status(200).json(pedidoActualizado);
    } catch (err) {
        if (err.name === 'CastError') {
            return res.status(400).json({ error: "ID de pedido no válido", details: err.message });
        }
        if (err.name === 'ValidationError') {
            return res.status(400).json({ error: "Estado inválido", details: err.message });
        }
        return res.status(500).json({ error: "Error al actualizar estado del pedido", details: err.message });
    }
};