const ProdukModel = require("../models").Produk;
const { v4: uuidv4 } = require("uuid");

async function createManyProduk(req, res) {
  try {
    let { payload } = req.body;

    let countBerhasil = 0;

    let countGagal = 0;

    await Promise.all(
      payload.map(async (data) => {
        try {
          data.uuid = uuidv4();
          data.gambarProduk = JSON.stringify(data.gambarProduk);

          console.log("da", data);
          await ProdukModel.create(data);
          countBerhasil = countBerhasil + 1;
        } catch (err) {
          console.log(err);
          countGagal = countGagal + 1;
        }
      })
    );

    return res.status(201).json({
      status: "Success",
      msg: "Produk berhasil ditambahkan",
      status: `Berhasil menambah ${countBerhasil} data dan gagal ${countGagal} data`,
    });
  } catch (err) {
    console.log(err);
    return res.status(403).json({
      status: "fail",
      msg: "Ada Kesalahan",
    });
  }

  res.json({
    data: req.body.payload,
  });
}

const listProduk = async (req, res) => {
  try {
    let { keyword, page, pageSize, orderBy, sortBy, pageActive } = req.query;

    const produk = await ProdukModel.findAndCountAll({
      order: [[sortBy, orderBy]], // untuk order sama kaya ORDER BY
      offset: page, // 'mulai dari tambah 1'
      limit: pageSize, // 'banyak data yang ditampillan'
    });

    return res.json({
      status: "Success",
      msg: "Daftar Produk Ditemukan",
      data: produk,
      pagination: {
        page: pageActive,
        nextPage: pageActive + 1,
        previousPage: pageActive - 1,
        pageSize: pageSize,
        //   jumlah: users.rows.length,
        //   total: users.count,
      },
    });
  } catch (err) {
    console.log(err);
    return res.status(403).json({
      status: "fail",
      msg: "Ada Kesalahan",
    });
  }
};

const detailProduk = async (req, res) => {
  try {
    // const id = req.params.id
    const { uuid } = req.params;

    const produk = await ProdukModel.findOne({
      where: {
        uuid: uuid,
      },
    });
    if (produk === null) {
      return res.json({
        status: "Fail",
        msg: "Produk Tidak Ditemukan",
      });
    }
    return res.json({
      status: "Success",
      msg: "Detail Produk Ditemukan",
      data: produk,
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
  createManyProduk,
  listProduk,
  detailProduk,
};
