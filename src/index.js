const express = require("express");
const mongoose = require("mongoose");
const app = express();
require("dotenv").config();
const CategoriaRoutes = require("./routes/Categoria");
const ProductoRoutes = require("./routes/Producto");
const UsuarioRoutes = require("./routes/Usuario");
const CatalogoRoutes = require("./routes/Catalogo");
const path = require("path");
const verifyToken = require("./routes/ValidateToken");
//prueba
const prueba = require("./routes/Prueba");
const port = process.env.PORT || 10801;
//swagger
const swaggerUI = require("swagger-ui-express");
const swaggerJsDoc = require("swagger-jsdoc");
const cors = require("cors");
const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Librerias Apis - CERTUS",
      version: "1.0.0",
      //description: "Demo de Librerias de Ventas API",
    },
    servers: [
      {
        url: "http://localhost:10801",
      },
    ],
  },
  apis: [`${path.join(__dirname, "./routes/*.js")}`],
};
//acceso publico al server de imagenes
app.use("/app", express.static("public"));
// cors

var corsOptions = {
  origin: "*", // Reemplazar con dominio
  optionsSuccessStatus: 200, // some legacy browsers (IE11, various SmartTVs) choke on 204
};
app.use(cors(corsOptions));
//middleware
app.use(express.json());

app.use("/api", CategoriaRoutes);
app.use("/api", ProductoRoutes);
app.use("/api", UsuarioRoutes);
app.use("/api", verifyToken, CatalogoRoutes);
app.use("/api", verifyToken, prueba);
//app.use("/api/auth", );

app.use("/api-doc", swaggerUI.serve, swaggerUI.setup(swaggerJsDoc(options)));
app.use("/", (req, res) => {
  res.send("bienvenido a nuestra api");
});

//conexion a la BD
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => console.log("Conectado a MongoDB Atlas"))
  .catch((error) => console.log(error.message));
//puerto de escucha
app.listen(port, () => console.log("server escuchando en el puerto", port));
