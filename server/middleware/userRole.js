const userRole = (role) => {
  return (req, res, next) => {
    if (role === "admin") {
      if (req.session.admin) return next();
    } else if (role === "customer") {
      if (req.session.customer) return next();
    } else return;
    res
      .status(403)
      .json({ message: "You're not authorized to view this page" });
  };
};

module.exports = userRole;
