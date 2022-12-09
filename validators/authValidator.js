const { check } = require("express-validator");
const UserModel = require("../models").user;
const validationRegister = [
  check("name").isLength({ min: 1 }).withMessage("Nama Wajib diisi"),
  check("email")
    .isEmail()
    .withMessage("Gunakan Email Valid")
    .custom((value) => {
      return UserModel.findOne({
        where: {
          email: value,
        },
      }).then((user) => {
        if (user) {
          return Promise.reject("Email sudah digunakan");
        }
      });
    }),

  check("password").isLength({ min: 8 }).withMessage("Password wajib 8 huruf"),
  check("status")
    .isIn(["active", "nonactive"])
    .withMessage("status bukan emum"),
  check("jenisKelamin")
    .isIn(["laki-laki", "perempuan"])
    .withMessage("jenis kelamin hanya laki-laki peempuan"),
];


const validationLogin = [

  check("email")
    .isEmail()
    .withMessage("Gunakan Email Valid"),
  check("password").isLength({ min: 8 }).withMessage("Password wajib 8 huruf"),
  
];

module.exports = { validationRegister, validationLogin };
