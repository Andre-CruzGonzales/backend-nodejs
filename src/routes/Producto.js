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
    //.find({ estado: "A" })
    .find()
    .populate("categoria")

    .then((data) => res.json(data))
    .catch((error) => res.json({ message: error.message }));
});
router.get("/productos/get/:id", (req, res) => {
  const { id } = req.params;
  productoSchema
    .findById(id)
    .populate("categoria")
    .then((data) => res.json(data))
    .catch((error) => res.json({ message: error.message }));
});
router.put("/productos/update/:id", upload.single("file"), (req, res) => {
  const host = req.protocol + "://" + req.get("host");
  const file = req.file;
  //console.log(imagen);
  const { id } = req.params;
  if (file) {
    productoSchema
      .updateOne(
        { _id: id },
        {
          $set: {
            nombre: req.body.nombre,
            imagen: `${host}/app/files/${req.file.filename}`,
            descripcion: req.body.descripcion,
            categoria: req.body.categoria,
          },
        }
      )
      .then((data) => res.json(data))
      .catch((error) => res.json({ message: error }));
  } else {
    productoSchema
      .updateOne(
        { _id: id },
        {
          $set: {
            nombre: req.body.nombre,
            descripcion: req.body.descripcion,
            categoria: req.body.categoria,
          },
        }
      )
      .then((data) => res.json(data))
      .catch((error) => res.json({ message: error }));
  }
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
router.put("/productos/visibility/:id", (req, res) => {
  const { id } = req.params;
  let estado = "";
  if (req.body.estado === "A") {
    estado = "A";
  }
  if (req.body.estado === "I") {
    estado = "I";
  }
  console.log("estadooo: " + estado);
  productoSchema
    .updateOne(
      { _id: id },
      {
        $set: {
          estado: estado,
        },
      }
    )
    .then((data) => res.json(data))
    .catch((error) => res.json({ message: error }));
});
module.exports = router;
