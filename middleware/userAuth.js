const jwt = require("jsonwebtoken");

const User = require("../models/User");

module.exports = (req, res, next) => {
  let token = req.get("Authorization");
  token = token.split(" ")[1];

  //   console.log(token);

  let decodedToken = "";
  try {
    decodedToken = jwt.verify(
      token,
      "4=?ADE56GJMC2%7&kF%HTqy8CfTZuj5e2aTKy2g!^F-W%7uP$cUqfuWcQxyVP*ez"
    );
  } catch (err) {
    err.statusCode = 401;
    err.message = "login token not verified";
    res.status(401).json({
      message: err.message,
    });
    throw err.message;
  }

  if (!decodedToken) {
    const err = new Error("Not Authenticated");
    err.statusCode = 401;
    err.message = "User Not Authenticated";
    res.status(401).json({
      message: err.message,
    });
    throw err.message;
  } else {
    // console.log(decodedToken);
    User.findById(decodedToken.userId)
      .then((user) => {
        req.userId = decodedToken.userId;
        next();
      })
      .catch((err) => {
        res.status(401).json("Not Authenticated");
      });
  }
};
