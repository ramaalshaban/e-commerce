const { check } = require("express-validator");

const passwordValidator = [
  check("password")
    .not()
    .isEmpty()
    .withMessage("Password should not be empty")
    .isLength({ min: 8 })
    .withMessage("Password must be at least 8 characters long")
    .matches(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/)
    .withMessage("Password must contain a number, uppercase and lowercase")
    .custom((password, { req }) => {
      const { password2 } = req.body;
      if (password !== password2) {
        throw new Error("Passwords don't match");
      }
      return true;
    }),
];

module.exports = passwordValidator;
