const mongoose = require("mongoose");
const categoriaSchema = mongoose.Schema({
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
});

module.exports = mongoose.model("Categoria", categoriaSchema);
