const express = require("express");
const router = express.Router();
const usuarioSchema = require("../models/Usuario");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
//validaciones
const Joi = require("@hapi/joi");

const schemaRegister = Joi.object({
  nombre: Joi.string().min(2).max(255).required(),
  email: Joi.string().min(6).max(255).required().email(),
  password: Joi.string().min(6).max(1024).required(),
  apellido: Joi.string().min(2).max(255).required(),
  estado: Joi.string().min(0).max(2).required(),
  rol: Joi.number().min(0).max(3).required(),
});
//usaurios
router.post("/usuarios/create", async (req, res) => {
  const { error } = schemaRegister.validate(req.body);

  if (error) {
    return res.status(401).json({ error: error.details[0].message });
  }

  const isEmailExist = await usuarioSchema.findOne({ email: req.body.email });
  if (isEmailExist) {
    return res.status(400).json({ error: "Email ya registrado" });
  }
  // hash contraseña
  const salt = await bcrypt.genSalt(10);
  const password = await bcrypt.hash(req.body.password, salt);
  const usuario = usuarioSchema({
    nombre: req.body.nombre,
    apellido: req.body.apellido,
    email: req.body.email,
    password: password,
    estado: req.body.estado,
    rol: req.body.rol,
  });
  usuario
    .save()
    .then((data) => res.json(data))
    .catch((error) => res.json({ message: error.message }));
});
//validacion de login
const schemaLogin = Joi.object({
  email: Joi.string().min(6).max(255).required().email(),
  password: Joi.string().min(6).max(1024).required(),
});
router.post("/login", async (req, res) => {
  const { error } = schemaLogin.validate(req.body);
  if (error) return res.status(400).json({ error: error.details[0].message });

  const user = await usuarioSchema.findOne({ email: req.body.email });
  if (!user) return res.status(400).json({ error: "Usuario no encontrado" });

  const validPassword = await bcrypt.compare(req.body.password, user.password);
  if (!validPassword)
    return res.status(400).json({ error: "contraseña no válida" });
  const token = jwt.sign(
    {
      nombre: user.nombre,
      apellido: user.apellido,
      id: user._id,
      email: user.email,
      rol: user.rol,
    },
    process.env.TOKEN_SECRET
  );
  const datos_muestra = {
    nombre: user.nombre,
    apellido: user.apellido,
    id: user._id,
    email: user.email,
    rol: user.rol,
  };
  res.json({
    error: null,
    data: "exito bienvenido",
    token: token,
    user: datos_muestra,
  });
});

/*
router.get("/usuarios/get", (req, res) => {
  usuarioSchema
    //.find({ estado: "A" })
    .find()
    .populate("producto")
    .then((data) => res.json(data))
    .catch((error) => res.json({ message: error.message }));
});
router.get("/usuarios/get/:id", (req, res) => {
  const { id } = req.params;
  usuarioSchema
    .findById(id)
    .then((data) => res.json(data))
    .catch((error) => res.json({ message: error.message }));
});
router.put("/usuarios/update/:id", (req, res) => {
  const { id } = req.params;
  const { precio } = req.body.precio;

  //console.log(imagen);
  usuarioSchema
    .updateOne(
      { _id: id },
      {
        $set: {
          precio: precio,
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
/*
router.put("/usuarios/visibility/:id", (req, res) => {
  const { id } = req.params;
  let estado = "";
  if (req.body.estado === "A") {
    estado = "A";
  }
  if (req.body.estado === "I") {
    estado = "I";
  }
  console.log("estadooo: " + estado);
  usuarioSchema
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
});*/
module.exports = router;
