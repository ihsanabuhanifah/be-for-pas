const UserModel = require("../models").user;
const RoleModel = require("../models").role;
const models = require("../models");
const bcrypt = require("bcrypt");
const { Op } = require("sequelize");

const index = async (req, res) => {
  try {
    let { keyword, page, pageSize, orderBy, sortBy, pageActive } = req.query;

    const users = await UserModel.findAndCountAll({
      attributes: ["id", ["name", "nama"], "email", "status", "jenisKelamin"],
      where: {
        ...(keyword !== undefined && {
          [Op.or]: [
            {
              name: {
                [Op.like]: `%${keyword}%`,
              },
            },
            {
              email: {
                [Op.like]: `%${keyword}%`,
              },
            },
            {
              jenisKelamin: {
                [Op.like]: `%${keyword}%`,
              },
            },
          ],
        }),
      },
      include: [
        {
          model: models.identitas,
          require: true,
          as: "identitas",
          attributes: ["id", "nama", "alamat", "tempatLahir", "tanggalLahir"],
        },
        {
          model: models.nilai,
          require: true,
          as: "nilai",
          attributes: ["id", "nilai"],
        },
      ],

      order: [[sortBy, orderBy]], // untuk order sama kaya ORDER BY
      offset: page, // 'mulai dari tambah 1'
      limit: pageSize, // 'banyak data yang ditampillan'
    });

    return res.json({
      status: "Success",
      msg: "Daftar User Ditemukan",
      data: users,
      pagination: {
        page: pageActive,
        nextPage: pageActive + 1,
        previousPage: pageActive - 1,
        pageSize: pageSize,
        jumlah: users.rows.length,
        total: users.count,
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

const detail = async (req, res) => {
  try {
    // const id = req.params.id
    const { id } = req.params;

    const users = await UserModel.findByPk(id);
    if (users === null) {
      return res.json({
        status: "Fail",
        msg: "Daftar User Tidak Ditemukan",
      });
    }
    return res.json({
      status: "Success",
      msg: "Daftar User Ditemukan",
      data: users,
    });
  } catch (err) {
    console.log(err);
    return res.status(403).json({
      status: "fail",
      msg: "Ada Kesalahan",
    });
  }
};

const detailByEmail = async (req, res) => {
  try {
    const email = req.params.email;
    // const {email} = req.params
    const users = await UserModel.findOne({
      where: {
        email: email,
      },
    });

    if (users === null) {
      return res.json({
        status: "Fail",
        msg: "Daftar User Tidak Ditemukan",
      });
    }
    return res.json({
      status: "Success",
      msg: "Daftar User Ditemukan",
      data: users,
    });
  } catch (err) {
    console.log(err);
    return res.status(403).json({
      status: "fail",
      msg: "Ada Kesalahan",
    });
  }
};

const destroy = async (req, res) => {
  try {
    const { id } = req.params;
    // const {email} = req.params
    const users = await UserModel.destroy({
      where: {
        id: id,
      },
    });

    if (users === 0) {
      return res.json({
        status: "Fail",
        msg: "User Tidak Ditemukan",
      });
    }
    return res.json({
      status: "Success",
      msg: "User Berhasil dihapus",
    });
  } catch (err) {
    console.log(err);
    return res.status(403).json({
      status: "fail",
      msg: "Ada Kesalahan",
    });
  }
};

const update = async (req, res) => {
  try {
    const { id } = req.params;
    const { name } = req.body;
    const users = await UserModel.findByPk(id);
    if (users === null) {
      return res.json({
        status: "Fail",
        msg: " User Tidak Ditemukan",
      });
    }

    await UserModel.update(
      {
        name: name,
      },
      {
        where: {
          id: id,
        },
      }
    );

    return res.json({
      status: "Success",
      msg: "Data User berhasil diperbaharui",
    });
  } catch (err) {
    return res.status(403).json({
      status: "fail",
      msg: "Ada Kesalahan",
    });
  }
};

async function createMany(req, res) {
  // payload.map((data)=> {
  //   data.password = await bcrypt.hashSync(`${data.password}` , 10)
  // })
  // return res.json({
  //   data : payload
  // })
  try {
    let { payload } = req.body;
    // payload.map((data)=> {

    // })

    for (let i = 0; i < payload.length; i++) {
      payload[i].password = await bcrypt.hashSync(`${payload[i].password}`, 10);
    }
    // await UserModel.bulkCreate(payload);
    let countBerhasil = 0;

    let countGagal = 0;

    await Promise.all(
      payload.map(async (data) => {
        try {
          await UserModel.create(data);
          countBerhasil = countBerhasil + 1;
        } catch (err) {
          console.log(err);
          countGagal = countGagal + 1;
        }
      })
    );

    return res.status(201).json({
      status: "Success",
      msg: "Users berhasil ditambahkan",
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

async function userRole(req, res) {
  try {
    const { role } = req.query;
    const data = await UserModel.findAndCountAll({
      attributes: ["id", "name", "email"],
      include: [
        {
          model: models.role,
          require: true,
          as: "roles",
          attributes: ["id", "namaRole"],
          where: {
            ...(role !== undefined && {
              namaRole: {
                [Op.like]: `%${role}%`,
              },
            }),
          },
          through: {
            attributes: [],
          },
        },
      ],
    });
    return res.json({
      data: data,
    });
  } catch (err) {
    console.log(err);
    return res.sendStatus(403);
  }
}

async function roleUser(req, res) {
  try {
    const data = await RoleModel.findAndCountAll({
      attributes: ["id", "namaRole"],
      include: [
        {
          model: models.user,
          require: true,
          as: "users",
          attributes: ["id", "name", "email"],
          through: {
            attributes: [],
          },
        },
      ],
    });

    return res.json({
      data: data,
    });
  } catch (err) {
    console.log(err);
    return res.sendStatus(403);
  }
}

module.exports = {
  index,
  createMany,
  detail,
  detailByEmail,
  destroy,
  update,
  userRole,
  roleUser,
};
