const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const ProductoSchema = new Schema({
  nombre: {
    type: String,
    required: true,
  },
  estado: {
    type: String,
    required: true,
  },
  imagen: {
    type: String,
    required: false,
  },
  categoria: {
    type: Schema.ObjectId,
    ref: "Categoria",
  },
  descripcion:{
    type:String,
    required:false,
  }
});

module.exports = mongoose.model("Producto", ProductoSchema);
