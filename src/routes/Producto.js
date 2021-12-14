const express = require("express");
const multer = require("multer");
const router = express.Router();
const productoSchema = require("../models/Producto");
const path = require("path");
let storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "public/files");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});
const upload = multer({
  storage: storage,
});
//creacion de articulos

router.post("/productos/create", upload.single("file"), (req, res) => {
  const host = req.protocol + "://" + req.get("host");
  const imagen = `${host}/app/files/${req.file.filename}`;
  console.log(imagen);
  req.body.imagen = imagen;
  const producto = productoSchema(req.body);
  producto
    .save()
    .then((data) => res.json(data))
    .catch((error) => res.json({ message: error.message }));
});
router.get("/productos/get", (req, res) => {
  productoSchema
    .find({ estado: "A" })
    .populate("categoria")

    .then((data) => res.json(data))
    .catch((error) => res.json({ message: error.message }));
});
router.get("/productos/get/:id", (req, res) => {
  const { id } = req.params;
  productoSchema
    .findById(id)
    .then((data) => res.json(data))
    .catch((error) => res.json({ message: error.message }));
});
router.put("/productos/update/:id", upload.single("file"), (req, res) => {
  const host = req.protocol + "://" + req.get("host");

  const { id } = req.params;
  const { nombre } = req.body.nombre;

  //console.log(imagen);
  productoSchema
    .updateOne(
      { _id: id },
      {
        $set: {
          nombre: nombre,
          imagen: `${host}/app/files/${req.file.filename}`,
        },
      }
    )
    .then((data) => res.json(data))
    .catch((error) => res.json({ message: error }));
});
router.delete("/categorias/delete/:id", (req, res) => {
  const { id } = req.params;
  const estado = "I";
  productoSchema
    .updateOne({ _id: id }, { $set: { estado } })
    .then((data) => res.json(data))
    .catch((error) => res.json({ message: error }));
});
router.delete("/categorias/destroy/:id", (req, res) => {
  const { id } = req.params;
  productoSchema
    .remove({ _id: id })
    .then((data) => res.json(data))
    .catch((error) => res.json({ message: error }));
});
module.exports = router;
