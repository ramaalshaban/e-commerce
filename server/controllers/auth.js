const Admins = require("../models/admin");
const Customers = require("../models/customer");
const bcrypt = require("bcrypt");

const { validationResult } = require("express-validator");

const authControllers = {};

authControllers.signup = (roleModel, role) => {
  return async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const alert = errors.array();
      return res.status(400).render("auth/customer/signup", { alert });
    } else {
      const { email, password, password2, firstname, lastname } = req.body;
      let user = await roleModel.findOne({ email });
      if (user)
        return res.status(400).json({ error: `${email}: email already used` });

      const password_hash = await bcrypt.hash(password, 10);

      user = await roleModel.create({
        firstname,
        lastname,
        email,
        password_hash,
      });

      if (role === "admin") req.session.admin = user;
      else if (role === "customer") req.session.customer = user;

      res.render("index", { user, admin: req.session.admin });
    }
  };
};

authControllers.signin = (roleModel, role) => {
  return async (req, res) => {
    const { email, password, rememberme } = req.body;
    let user = await roleModel.findOne({ email });
    if (!user) return res.status(403).json({ message: "Forbidden" });

    const valid = await bcrypt.compare(password, user.password_hash);
    if (!valid)
      return res.status(400).json({ error: "wrong email or password" });

    if (rememberme) {
      req.session.cookie.maxAge = 1000 * 60 * 60 * 24 * 14;
    }
    if (role === "admin") req.session.admin = user;
    else if (role === "customer") req.session.customer = user;
    res.render("index", { user, admin: req.session.admin });
  };
};

authControllers.signout = async (req, res) => {
  req.session.destroy((err) => {
    if (err) return res.redirect("/");
    res.clearCookie("sid");
    res.redirect("/");
  });
};

module.exports = authControllers;
