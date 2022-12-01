const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
dotenv.config();
const UserModel = require("../models").user;

async function jwtMiddleware(req, res, next) {
  const { authorization } = req.headers;
  const token = authorization?.split(" ")[1];

  if (authorization === undefined) {
    return res.sendStatus(401);
  }
 

  jwt.verify(token, process.env.JWT_ACCESS_TOKEN, async (err, decoded) => {
    if (err) {
      return res.status(401).json({
        status: "fail",
        msg: "Invalid Token",
        data: err,
      });
    } else {
      const user = await UserModel.findOne({
        where: {
          email: decoded?.email,
        },
      });

      if (user === null)
        return res.status(422).json({
          status: "Fail",
          msg: "User sudah dihapus",
        });
      req.id = decoded?.id;
      req.email = decoded?.email;
      
      next();
    }
  });
}

module.exports = jwtMiddleware;
