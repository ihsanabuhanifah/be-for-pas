const BeliModel = require("../models").Beli;
const KeranjangModel = require("../models").Keranjang;
const models = require("../models");
const { v4: uuidv4 } = require("uuid");

async function tambahBeli(req, res) {
  try {
    let { data } = req.body;

    let countBerhasil = 0;

    let countGagal = 0;

    await Promise.all(
      data.map(async (data) => {
        try {
          let beli = {
            produkId: data.produkId,
            jumlah: data.jumlah,
            harga: data?.produk?.harga,
            total: parseFloat(data?.produk?.harga) * parseFloat(data.jumlah),
            userId : req.id
          };

          await BeliModel.create(beli);
          await KeranjangModel.destroy({
            where: {
              id: data.id,
            },
          });
          countBerhasil = countBerhasil + 1;
        } catch (err) {
          console.log(err);
          countGagal = countGagal + 1;
        }
      })
    );

    return res.status(201).json({
      status: "Success",
      msg: "Transaksi Berhasil",
      status: `Berhasil menambah ${countBerhasil} data dan gagal ${countGagal} data`,
    });
  } catch (err) {
    console.log(err);
    return res.status(403).json({
      status: "fail",
      msg: "Ada Kesalahan",
    });
  }
}

async function getBeli(req, res) {
  try {
    const beli = await BeliModel.findAll({
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
      msg: "History Transaksi ditemukan",
      data: beli,
    });
  } catch (err) {
    console.log(err);
    return res.status(403).json({
      status: "fail",
      msg: "Ada Kesalahan",
    });
  }
}

module.exports = {
  tambahBeli,
  getBeli
};
