const express = require("express");
const router = express.Router();

const validationMiddleware = require("../middleware/validationMiddleware");
const {
  validationRegister,
  validationLogin,
} = require("../validators/authValidator");
const paginatioMiddleware = require("../middleware/paginationMiddleware");
const {
  createManyProduk,
  listProduk,
  detailProduk,
  getKategori
} = require("../controller/ProdukController");

const { tambahBeli, getBeli } = require("../controller/BeliController");
const {
  tambahKeranjang,
  getKeranjang,
  tambahJumlahItem,
  destroyKeranjang
} = require("../controller/KeranjangController");
const {
  index,
  detail,
  detailByEmail,
  destroy,
  update,
  createMany,
  userRole,
  roleUser,
} = require("../controller/UserController");
const jwtMiddleware = require("../middleware/jwtMiddleware");
const { userList } = require("../controller/UserRawQueryController");

const {
  register,
  login,
  authme,
  lupaPassword,
  resetPassword,
  googleAccountRegister,
  googleAccountLogin,
} = require("../controller/AuthController");

//produk
router.post("/produk/tambah", createManyProduk);
router.get("/produk/list", paginatioMiddleware, listProduk);
router.get("/produk/detail/:uuid", detailProduk);
router.get("/kategori", getKategori);

//auth
router.post("/lupa-password", lupaPassword);
router.post("/reset-password/:userId/:token", resetPassword);
router.post("/register", validationRegister, validationMiddleware, register);
router.post("/login", validationLogin, login);
router.post("/users/create", createMany);
router.post("/google-account/register", googleAccountRegister);
router.post("/google-account/login", googleAccountLogin);

//users

router.use(jwtMiddleware);
//keranjang

router.post("/keranjang/tambah", tambahKeranjang);
router.delete("/keranjang/hapus/:id", destroyKeranjang);
router.get("/keranjang", getKeranjang);
router.put("/keranjang/ubah-jumlah-item", tambahJumlahItem);
router.post("/beli/tambah", tambahBeli);
router.get("/beli/history", getBeli);
router.use(paginatioMiddleware);
router.get("/users", index);
router.get("/authme", authme);
router.get("/users/:id", detail);
router.get("/users/email/:email", detailByEmail);
router.delete("/users/:id", destroy);
router.put("/users/update/:id", update);
router.get("/users/role/user-role", userRole);
router.get("/roles/user/user-role", roleUser);

//raw query
router.get("/users/query/list", userList);

module.exports = router;
