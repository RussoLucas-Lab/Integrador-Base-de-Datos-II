

import jwt from "jsonwebtoken";

const secret = process.env.JWT_SECRET || "default-secret";

export const generateToken = (user) => {
  return jwt.sign({ id: user._id, rol: user.rol }, secret, { expiresIn: "1h" });
};

export const validateToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) return res.status(401).json({ message: "Token requerido" });

  jwt.verify(token, secret, (err, decoded) => {
    if (err) return res.status(403).json({ message: "Token inválido" });
    req.user = decoded; // aquí guardamos id y rol
    next();
  });
};

// Middleware para admin
export const requireAdmin = (req, res, next) => {
  if (req.user.rol !== "administrador")
    return res.status(403).json({ message: "Se requiere rol de administrador" });
  next();
};

// Middleware para dueño o admin
export const requireOwnerOrAdmin = (paramUserIdField) => {
  return (req, res, next) => {
    const userId = req.params[paramUserIdField];
    if (req.user.id !== userId && req.user.rol !== "administrador") {
      return res.status(403).json({ message: "No autorizado" });
    }
    next();
  };
};