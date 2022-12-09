const KeranjangModel = require("../models").Keranjang;
const models = require("../models");
const { v4: uuidv4 } = require("uuid");

async function tambahKeranjang(req, res) {
  try {
    const { produkId } = req.body;

    let payload = {
      userId: req.id,
      jumlah: 1,
      produkId: produkId,
    };

    await KeranjangModel.create(payload);

    return res.status(201).json({
      status: "Success",
      msg: "Produk berhasil ditambahkan",
    });
  } catch (err) {
    console.log(err);
    return res.status(403).json({
      status: "fail",
      msg: "Ada Kesalahan",
    });
  }
}

async function tambahJumlahItem(req, res) {
  try {
    const { id, jumlah } = req.body;

    await KeranjangModel.update(
      {
        jumlah: jumlah,
      },
      {
        where: {
          id: id,
        },
      }
    );

    return res.status(201).json({
      status: "Success",
      msg: "Item Produk berhasil di ubah",
    });
  } catch (err) {
    console.log(err);
    return res.status(403).json({
      status: "fail",
      msg: "Ada Kesalahan",
    });
  }
}

async function getKeranjang(req, res) {
  try {
    const keranjang = await KeranjangModel.findAll({
      where: {
        userId: req.id,
      },
      include: [
        {
          model: models.Produk,
          require: true,
          as: "produk",
          attributes: ["namaProduk", "harga", "stok", "rating", "gambarProduk"],
        },
      ],
    });

    return res.status(201).json({
      status: "Success",
      msg: "Keranjang berhasil ditemukan",
      data: keranjang,
    });
  } catch (err) {
    console.log(err);
    return res.status(403).json({
      status: "fail",
      msg: "Ada Kesalahan",
    });
  }
}

const destroyKeranjang = async (req, res) => {
  try {
    const { id } = req.params;
    // const {email} = req.params
    const users = await KeranjangModel.destroy({
      where: {
        id: id,
      },
    });

    if (users === 0) {
      return res.json({
        status: "Fail",
        msg: "Id Keranjang Tidak Ditemukan",
      });
    }
    return res.json({
      status: "Success",
      msg: "Keranjang Berhasil dihapus",
    });
  } catch (err) {
    console.log(err);
    return res.status(403).json({
      status: "fail",
      msg: "Ada Kesalahan",
    });
  }
};

module.exports = {
  tambahKeranjang,
  getKeranjang,

  tambahJumlahItem,
  destroyKeranjang,
};
