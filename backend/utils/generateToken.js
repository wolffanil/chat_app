const jwt = require("jsonwebtoken");

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET_WORD, {
    expiresIn: "3d",
  });
};

module.exports = generateToken;
