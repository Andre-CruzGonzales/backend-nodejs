const express = require("express");
const router = express.Router();
const catalogoSchema = require("../models/Catalogo");
const productoSchema = require("../models/Producto");
//creacion de articulos
router.get("/catalogos/productos/get", (req, res) => {
  productoSchema
    .find({ estado: "A" })
    .populate("categoria")

    .then((data) => res.json(data))
    .catch((error) => res.json({ message: error.message }));
});
//catalogo
router.post("/catalogos/create", (req, res) => {
  const user = req.user;
  req.body.usuario = user.id;
  const catalogo = catalogoSchema(req.body);

  catalogo
    .save()
    .then((data) => res.json(data))
    .catch((error) => res.json({ message: error.message }));
});
//debe ser una ruta protegida y traer el rq del user
router.get("/catalogos/get", (req, res) => {
  catalogoSchema
    //.find({ estado: "A" })
    .find({ usuario: req.user.id })
    .populate({
      path: "producto",
      populate: {
        path: "categoria",
      },
    })

    //.populate("usuario")
    .then((data) => res.json(data))
    .catch((error) => res.json({ message: error.message }));
});
router.get("/catalogo/get/:id", (req, res) => {
  const { id } = req.params;
  catalogoSchema
    .findById(id)
    .then((data) => res.json(data))
    .catch((error) => res.json({ message: error.message }));
});
router.put("/catalogos/update/:id", (req, res) => {
  const { id } = req.params;
  const { precio } = req.body.precio;

  //console.log(imagen);
  catalogoSchema
    .updateOne(
      { _id: id },
      {
        $set: {
          precio_venta: req.body.precio,
        },
      }
    )
    .then((data) => res.json(data))
    .catch((error) => res.json({ message: error }));
});
/*router.delete("/catalogos/delete/:id", (req, res) => {
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
});*/
router.put("/catalogos/visibility/:id", (req, res) => {
  const { id } = req.params;
  let estado = "";
  if (req.body.estado === "A") {
    estado = "A";
  }
  if (req.body.estado === "I") {
    estado = "I";
  }
  console.log("estadooo: " + estado);
  catalogoSchema
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
