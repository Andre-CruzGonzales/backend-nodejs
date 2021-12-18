const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const CatalogoSchema = new Schema({
  producto: {
    type: Schema.ObjectId,
    required: true,
    ref: "Producto",
  },
  estado: {
    type: String,
    required: true,
  },
  precio_venta: {
    type: Number,
    required: true,
  },
  usuario: {
    type: Schema.ObjectId,
    ref: "Usuario",
  },
});

module.exports = mongoose.model("Catalogo", CatalogoSchema);
