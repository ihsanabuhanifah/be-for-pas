const { sequelize } = require("../models");
const { QueryTypes } = require("sequelize");

const userList = async (req, res) => {
  try {
    const { name, email } = req.query;

    const users = await sequelize.query(
      "SELECT * FROM users WHERE name LIKE :name AND email = :email ",
      {
        type: QueryTypes.SELECT,
        raw: true,
        replacements: {
          name: `%${name === undefined ? "" : name}%`,
          email: email === undefined ? "" : email,
        },
      }
    );

    if (users.length === 0) {
      return res.json({
        status: "Fail",
        msg: "Tidak ada users yang terdaftar",
      });
    }
    return res.json({
      status: "Success",
      msg: "users ditemukan",
      data: users,
    });
  } catch (err) {
    console.log(err);
    return res.status(403).json({
      status: "Fail",
      msg: "Ada kesalahan",
    });
  }
};

module.exports = { userList };
