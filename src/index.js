import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import { usuarioRoutes } from "./routes/usuarioRoutes.js";
import { categoriaRoutes } from "./routes/categoriasRoutes.js";
import { carritoRoutes} from "./routes/carritoRoutes.js";
import { resenaRoutes } from "./routes/resenasRoutes.js";
import { productoRoutes } from "./routes/productosRoutes.js";
import { pedidoRoutes } from "./routes/pedidosRoutes.js";
const app = express();
dotenv.config();

const PORT = process.env.PORT || 5000;
const MONGO_URL = process.env.MONGO_URL;
app.use(express.json());
mongoose
  .connect(MONGO_URL)
  .then(() => {
    console.log("Conexión exitosa a la base de datos");
  })
  .catch((e) => console.log(`Error al conectarse a la base de datos: ${e}`));

app.use("/usuario", usuarioRoutes);
app.use("/categoria", categoriaRoutes);
app.use("/resenas", resenaRoutes);
app.use("/producto", productoRoutes);
app.use("/pedido", pedidoRoutes);
app.use("/carrito", carritoRoutes);

app.listen(PORT, () => {
  console.log(`servcerr escuchando en puerto : ${PORT}`);
});
