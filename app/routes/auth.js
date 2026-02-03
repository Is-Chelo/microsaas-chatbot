const express = require("express");
const { check } = require("express-validator");

const router = express.Router();
const authController = require("../controllers/AuthController");
const { validateFields } = require("../middlewares/validateFields");

router.post(
  "/signUp",
  [
    check("nombre", "El nombre es Requerido").trim().escape().not().isEmpty(),
    check("correo", "El correo es Requerido").trim().escape().not().isEmpty(),
    check("correo", "El correo debe tener un formato correcto")
      .trim()
      .escape()
      .isEmail(),
    check("usuario", "El usuario es requerido").trim().escape().not().isEmpty(),
    check("clave", "La clave es requerida").trim().escape().not().isEmpty(),
    check("clave", "La clave debe ser mayor a 6 caracteres").isLength({
      min: 6,
    }),
    check("sexo", "Los valores admitidos son Masculino, Femenino")
      .isIn(["Masculino", "Femenino"])
      .optional({ nullable: true }),
    validateFields,
  ],
  authController.register
);

router.post(
  "/login",
  [
    check("usuario", "El usuario es requerido").trim().escape().not().isEmpty(),
    check("clave", "La clave es requerida").trim().escape().not().isEmpty(),
    check("clave", "La clave debe ser mayor a 6 caracteres").isLength({
      min: 6,
    }),
    validateFields,
  ],
  authController.login
);
module.exports = router;
