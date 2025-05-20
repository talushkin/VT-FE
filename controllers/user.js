const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const User = require("../models/User");

exports.signUp = (req, res, next) => {
  try {
    const email = req.body.email.toLowerCase();
    const password = req.body.password;
    // const role = req.body.role;

    console.log("password", password.length);

    User.findOne({ email }).then((user) => {
      if (user) {
        return res.status(400).json({
          message: "User with this Email already Exists",
        });
      } else {
        // if (password.length >= 6) {
        //   return res.status(400).json({
        //     message: "Password must be greater than and equal to 6 characters",
        //   });
        // } else {
        bcrypt.hash(password, 12).then((hashedPassword) => {
          let payload = {
            ...req.body,
            user: req.userId,
            email,
            password: hashedPassword,
          };
          User.create(payload)
            .then(() => {
              res.status(200).json({
                message: "Created Successfully!",
              });
            })
            .catch((err) => {
              console.log(err);
              res.status(500).json({
                message: "Error Registering User",
              });
            });
        });
        // }
      }
    });
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
};

exports.login = (req, res, next) => {
  const email = req.body.email.toLowerCase();
  const password = req.body.password;
  let loadedUser = "";

  User.findOne({ email })
    // .select("-password")
    .then((user) => {
      if (!user) {
        const error = new Error("Email doesn't exist");
        error.statusCode = 401;
        throw error;
      }
      loadedUser = user;
      return bcrypt.compare(password, user.password);
    })
    .then((isEqual) => {
      if (!isEqual) {
        const error = new Error("Invalid Password");
        error.statusCode = 401;
        throw error;
      }

      const token = jwt.sign(
        {
          // user: loadedUser,
          userId: loadedUser._id,
        },
        "4=?ADE56GJMC2%7&kF%HTqy8CfTZuj5e2aTKy2g!^F-W%7uP$cUqfuWcQxyVP*ez"
      );

      return res.status(200).json({
        message: "Logged In Successfully",
        token: token,
        user: loadedUser,
      });
    })
    .catch((err) => {
      if (err.statusCode === 401) {
        res.status(401).json({
          message: "Invalid Email or Password",
        });
      } else {
        return res.status(500).json({
          message: "Internal Server Error",
        });
      }
    });
};

exports.addUser = (req, res, next) => {
  try {
    console.log(req.body);
    const email = req.body.email.toLowerCase();
    const password = req.body.password;
    // const role = req.body.role;

    console.log("password", password.length);

    User.findOne({ email }).then((user) => {
      if (user) {
        return res.status(400).json({
          message: "User with this Email already Exists",
        });
      } else {
        if (password.length < 6) {
          return res.status(400).json({
            message: "Password must be greater than and equal to 6 characters",
          });
        } else {
          bcrypt.hash(password, 12).then((hashedPassword) => {
            let image = "";
            if (req.file) {
              image = req.file.filename;
            }
            let payload = {
              ...req.body,
              owner: req.userId,
              email,
              userImage: image,
              password: hashedPassword,
            };
            User.create(payload)
              .then(() => {
                res.status(200).json({
                  message: "Created Successfully!",
                });
              })
              .catch((err) => {
                console.log(err);
                res.status(500).json({
                  message: "Error Registering User",
                });
              });
          });
        }
      }
    });
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
};

exports.forgetPassword = async (req, res, next) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });
    if (user) {
      let code = Math.random() * 10000;
      code = Math.floor(code);
      user.code = code;
      user.save().then(() => {
        res.status(200).json({
          code,
        });
      });
    } else {
      res.status(200).json({
        message: "No user found By this email",
      });
    }
  } catch (error) {
    res.status(500).json({
      message: "Internal Server Error",
    });
  }
};
exports.verifyCode = async (req, res, next) => {
  try {
    const { code, email } = req.body;
    const user = await User.findOne({ email });
    if (user) {
      if (parseInt(code) === user.code) {
        res.status(200).json({
          message: "Code Verified!",
        });
      } else {
        res.status(200).json({
          message: "Incorrect Code!",
        });
      }
    } else {
      res.status(200).json({
        message: "No user found By this email",
      });
    }
  } catch (error) {
    res.status(500).json({
      message: "Internal Server Error",
    });
  }
};
exports.changePassword = async (req, res, next) => {
  try {
    const { confirm_password, new_password, email } = req.body;
    const user = await User.findOne({ email });
    if (user) {
      if (confirm_password !== new_password) {
        const error = new Error("Passwords Don't Match!");
        error.statusCode = 422;
        throw error;
      }
      bcrypt.hash(new_password, 12).then(async (hashedPassword) => {
        user.password = hashedPassword;
        await user.save();
        res.status(200).json({
          message: "Password Updated Successfully",
        });
      });
    } else {
      res.status(200).json({
        message: "No user found By this email",
      });
    }
  } catch (error) {
    if (error.statusCode === 422) {
      res.status(422).json({
        message: "Passwords Don't Match",
      });
    } else {
      res.status(500).json({
        message: "Internal Server Error",
      });
    }
  }
};
exports.getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    res.status(200).json({
      user,
    });
  } catch (error) {
    res.status(500).json(error);
  }
};
exports.getProfileById = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findById(id).populate("city");
    res.status(200).json({
      user,
    });
  } catch (error) {
    res.status(500).json(error);
  }
};
exports.updateProfile = (req, res, next) => {
  const { id } = req.body;
  try {
    let data;
    // if (req.file) {
    if (req.body) {
      data = {
        ...req.body,
        // userImage: req.file.filename,
        userImage: req.body.filename,
      };
    } else {
      data = {
        ...req.body,
      };
    }
    User.findByIdAndUpdate(id, data, { new: true }, (err, doc) => {
      if (err) {
        return res.json(400).json({ message: err });
      } else {
        console.log("269", doc);
      }
      return res.status(200).json({
        message: "Profile Updated",
        doc,
      });
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json(err);
  }
};
exports.updatePassword = (req, res, next) => {
  console.log(req.userId);
  try {
    const { newPass, ConfirmPass } = req.body;
    if (newPass !== ConfirmPass) {
      return res.status(400).json({
        message: "New & Confirm Password Doesn't Matched",
      });
    } else {
      User.findById(req.userId, (err, doc) => {
        // const validate = bcrypt.compareSync(oldPass, doc.password);
        // if (!validate) {
        //   return res.status(400).json({ message: "Old Password is Incorrect" });
        // }
        bcrypt.hash(newPass, 12).then((hashedPassword) => {
          doc.password = hashedPassword;
          doc.save();
          return res.status(200).json({
            message: "Password Changed!",
          });
        });
      });
    }
  } catch (err) {
    return res.status(500).json(err);
  }
};
exports.getUsersAdmin = async (req, res, next) => {
  try {
    let users = [];
    let count = 0;
    User.find({ role: "vendor" })
      .populate("user")
      .then(async (vendor) => {
        vendor.map(async (user) => {
          await User.find({ user: user._id })
            .populate("user")
            .then((result) => {
              count = count + 1;
              users.push(...result);
            });
          if (vendor.length === count) {
            // console.log(users);
            return res.status(200).json({
              vendors: vendor,
              users: users,
            });
          }
        });
      });
  } catch (err) {
    return res.status(500).json(err);
  }
};
exports.getUsers = async (req, res, next) => {
  try {
    User.find({ owner: req.userId })
      .populate("user city")
      .then(async (user) => {
        res.status(200).json({
          users: user,
        });
      });
  } catch (err) {
    return res.status(500).json(err);
  }
};
