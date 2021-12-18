const express = require("express");
const multer = require("multer");
const router = express.Router();
const categoriaSchema = require("../models/Categoria");
const path = require("path");
const { find } = require("../models/Categoria");
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

/**
 * @swagger
 * components:
 *  schemas:
 *      Categoria:
 *          type: object
 *          properties:
 *              nombre:
 *                  type: string
 *                  description: El nombre de la categoria
 *              file:
 *                  type: file,
 *                  description: La imagen de la categoria
 *              estado:
 *                  type: string
 *                  description: El estado de la categoria
 *
 *          required:
 *              - nombre
 *              - file
 *              - estado
 *
 *          example:
 *              nombre: Categoria 1
 *              file: multipart
 *              estado: A
 *
 */

/**
 * @swagger
 * tags:
 *  name: Categoria
 *  description: API Lista de Categorias
 */

/**
 * @swagger
 * /api/categorias/create:
 *  post:
 *      summary: crea un nueva categoria
 *      tags: [Categoria]
 *      requestBody:
 *          required: true
 *          content:
 *              application/json:
 *              schema:
 *                  type: object
 *                  $ref: '#/components/schemas/Articulo'
 *      responses:
 *          200:
 *              description: nueva categoria creado!
 *
 *
 */
router.post("/categorias/create", upload.single("file"), (req, res) => {
  const host = req.protocol + "://" + req.get("host");
  const imagen = `${host}/app/files/${req.file.filename}`;
  console.log(imagen);
  req.body.imagen = imagen;
  const categoria = categoriaSchema(req.body);
  categoria
    .save()
    .then((data) => res.json(data))
    .catch((error) => res.json({ message: error.message }));
});
router.get("/categorias/get", (req, res) => {
  categoriaSchema
    //.find({ estado: "A" })
    .find()
    .then((data) => res.json(data))
    .catch((error) => res.json({ message: error.message }));
});
router.get("/categorias/get/:id", (req, res) => {
  const { id } = req.params;
  categoriaSchema
    .findById(id)
    .then((data) => res.json(data))
    .catch((error) => res.json({ message: error.message }));
});
router.put("/categorias/update/:id", upload.single("file"), (req, res) => {
  const host = req.protocol + "://" + req.get("host");
  const file = req.file;
  const { id } = req.params;
  //const { nombre } = req.body.nombre;
  //console.log(file);
  //console.log(imagen);
  //console.log(req.body.nombre);
  if (!file) {
    console.log("ingreso a no file");
    categoriaSchema
      .updateOne(
        { _id: id },
        {
          $set: {
            nombre: req.body.nombre,
          },
        }
      )
      .then((data) => res.json(data))
      .catch((error) => res.json({ message: error }));
  }
  if (file) {
    console.log("ingresa a file");
    categoriaSchema
      .updateOne(
        { _id: id },
        {
          $set: {
            nombre: req.body.nombre,
            imagen: `${host}/app/files/${req.file.filename}`,
          },
        }
      )
      .then((data) => res.json(data))
      .catch((error) => res.json({ message: error }));
  }
});
router.put("/categorias/visibility/:id", (req, res) => {
  const { id } = req.params;
  let estado = "";
  if (req.body.estado === "A") {
    estado = "A";
  }
  if (req.body.estado === "I") {
    estado = "I";
  }
  console.log("estadooo: " + estado);
  categoriaSchema
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
router.delete("/categorias/delete/:id", (req, res) => {
  const { id } = req.params;
  const estado = "I";
  categoriaSchema
    .updateOne({ _id: id }, { $set: { estado } })
    .then((data) => res.json(data))
    .catch((error) => res.json({ message: error }));
});
router.delete("/categorias/destroy/:id", (req, res) => {
  const { id } = req.params;
  categoriaSchema
    .remove({ _id: id })
    .then((data) => res.json(data))
    .catch((error) => res.json({ message: error }));
});
module.exports = router;
