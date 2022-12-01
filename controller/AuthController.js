const UserModel = require("../models").user;
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
dotenv.config();
const crypto = require("crypto");
const sendEmail = require("../mail");
const ForgotPasswordModel = require("../models").forgotPassword;
const { Op } = require("sequelize");
const { OAuth2Client } = require("google-auth-library");
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

const googleAccountRegister = async (req, res) => {
  try {
    const data = await client.verifyIdToken({
      idToken: req.body.token,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const dataUser = data.getPayload();

    const payload = {
      name: dataUser.name,
      email: dataUser.email,
    };

    const cekUser = await UserModel.findOne({
      where: {
        email: dataUser.email,
      },
    });

    if (cekUser) {
      return res.status(422).json({
        status: "Fail",
        msg: "Email sudah terdaftar",
      });
    }

    await UserModel.create(payload);

    const user = await UserModel.findOne({
      where: {
        email: dataUser.email,
      },
    });

    const token = jwt.sign(
      {
        id: user.id,
        email: user.email,
      },
      process.env.JWT_ACCESS_TOKEN,
      {
        expiresIn: "1d",
      }
    );

    res.status(201).json({
      status: "Success",
      msg: "Register Berhasil",
      token: token,
    });
  } catch (err) {
    console.log(err);
    return res.status(403).json({
      status: "Fail",
      msg: "Token tidak valid",
    });
  }
};
const googleAccountLogin = async (req, res) => {
  res.send("google login");
  try {
    const data = await client.verifyIdToken({
      idToken: req.body.token,
    });

    const dataUser = data.getPayload();

    const payload = {
      name: dataUser.name,
      email: dataUser.email,
    };

    await UserModel.create(payload);

    res.status(201).json({
      status: "Success",
      msg: "Register Berhasil",
    });
  } catch (err) {
    console.log(err);
    return res.status(403).json({
      status: "Fail",
      msg: "Token tidak valid",
    });
  }
};

const lupaPassword = async (req, res) => {
  let { email } = req.body;

  const user = await UserModel.findOne({
    where: {
      email: email,
    },
  });

  if (!user) {
    return res.status(404).json({
      status: "fail",
      msg: "Email tidak ditemukan, Silahkan gunakan Email yang terdaftar",
    });
  }
  let token = crypto.randomBytes(32).toString("hex");

  const link = `${process.env.MAIL_CLIENT_URL}/reset-password/${user.id}/${token}`;
  const context = {
    link: link,
  };
  const mail = await sendEmail(
    user.email,
    "Password Reset",

    "lupa_password2",
    context
  );

  if (mail === "error") {
    return res.status(422).json({
      status: "Fail",
      msg: "Email tidak terkirim ",
    });
  }
  await ForgotPasswordModel.create({
    userId: user.id,
    token: token,
  });
  return res.json({
    status: "Success",
    msg: "Silahkan Periksa Email Masuk",
  });
};

const resetPassword = async (req, res) => {
  let { userId, token } = req.params;
  let { passwordBaru } = req.body;

  const verify = await ForgotPasswordModel.findOne({
    where: {
      [Op.and]: [{ userId: userId }, { token: token }],
    },
  });

  if (verify === null) {
    return res.json({
      status: "fail",
      msg: "Token tidak Valid",
    });
  }

  passwordBaru = await bcrypt.hashSync(passwordBaru, 10);
  await UserModel.update(
    {
      password: passwordBaru,
    },
    {
      where: {
        id: userId,
      },
    }
  );

  await ForgotPasswordModel.destroy({
    where: {
      userId: userId,
    },
  });

  return res.status(201).json({
    status: "Success",
    msg: "Password berhasil di perbaharui",
  });
};

const register = async (req, res) => {
  try {
    let body = req.body;
    body.password = await bcrypt.hashSync(body.password, 10);
    const users = await UserModel.create(body);
    console.log(users);

    res.status(201).json({
      status: "Success",
      msg: "Register Berhasil",
    });
  } catch (err) {
    console.log(err);
    return res.status(403).json({
      status: "Fail",
      msg: "Register Gagal",
    });
  }
};

const login = async (req, res) => {
  //cek email ada atau enggk
  //cek email dan password cocok seperti di db

  try {
    const { email, password } = req.body;

    console.log(req.body);
    const user = await UserModel.findOne({
      where: {
        email: email,
      },
    });

    if (user === null) {
      return res.status(422).json({
        status: "Fail",
        msg: "Email  belum terdaftar",
      });
    }

    if (user.password === null) {
      return res.status(422).json({
        status: "Fail",
        msg: "Email dan Password tidak cocok",
      });
    }
    const verify = bcrypt.compareSync(`${password}`, user.password);

    if (!verify) {
      return res.status(422).json({
        status: "Fail",
        msg: "Email dan Password tidak cocok",
      });
    }

    const token = jwt.sign(
      {
        id: user.id,
        email: user.email,
      },
      process.env.JWT_ACCESS_TOKEN,
      {

        expiresIn: "7d",

      }
    );

    return res.json({
      status: "Success",
      msg: "Anda berhasil login",
      token : token,
      user: user,

    });
  } catch (err) {
    console.error(err);
    return res.status(403).json({
      status: "Fail",
      msg: "Terjadi Kesalahan",
      err: err,
    });
  }
};

const authme = async (req, res) => {
  try {
    const email = req.email;
    const user = await UserModel.findOne({
      where: {
        email: email,
      },
    });

    const token = jwt.sign(
      {
        id: user.id,
        email: user.email,
      },
      process.env.JWT_ACCESS_TOKEN,
      {
        expiresIn: "60s",
      }
    );

    return res.json({
      status: "Success",
      msg: "Autentikasi Berhasil",
      token: token,
      user: user,
    });
  } catch (err) {
    return res.status(401).json({
      status: "fail",
      msg: "Unathotize",
    });
  }
};


module.exports = {
  register,
  login,
  authme,
  lupaPassword,
  resetPassword,
  googleAccountRegister,
  googleAccountLogin,
};