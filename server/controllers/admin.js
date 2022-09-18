const ShopItems = require("../models/shop-item");
const Orders = require("../models/order");
const Admins = require("../models/admin");
const Customers = require("../models/customer");

const authControllers = require("./auth");

const adminControllers = {};

adminControllers.addShopItem = async (req, res) => {
  const { title, image, price, description, availableCount, category } =
    req.body;
  const newShopItem = await ShopItems.create({
    title,
    image,
    price,
    description,
    availableCount,
    category,
  });
  res.render("index", {
    items: await ShopItems.find(),
    admin: req.session.admin,
  });
};

adminControllers.updateShopItem = async (req, res) => {
  const { id } = req.params;
  try {
    const item = await ShopItems.findById(id);
    for (let key in req.body) {
      if (req.body[key]) {
        item[key] = req.body[key];
      }
    }
    await item.save();
    res.render("index", {
      items: await ShopItems.find(),
      admin: req.session.admin,
    });
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
};

adminControllers.deleteShopItem = async (req, res) => {
  const { id } = req.params;
  try {
    await ShopItems.findByIdAndDelete(id);
    res.render("index", {
      items: await ShopItems.find(),
      admin: req.session.admin,
    });
  } catch (err) {
    res.json({ message: err.message });
  }
};

adminControllers.searchShopItems = async (req, res) => {
  // console.log(req.query);
  // const fields = [
  //   "title",
  //   "image",
  //   "price",
  //   "description",
  //   "availableCount",
  //   "category",
  // ];

  // const queries = {};

  // for (let key in req.query) {
  //   if (!fields.includes(key)) return res.json({ message: "invalid query" });
  //   queries[key] = req.query[key];
  //   if (queries[key] === "")
  //     return res.json({ message: "Query can't be empty" });
  // }
  const title = req.body.search;
  try {
    const searchedItem = await ShopItems.findOne({ title });
    if (searchedItem)
      res.render("index", {
        searchedItem,
        user: req.session.customer,
        admin: req.session.admin,
      });
    else throw new Error(`No item found with title '${title}' `);
  } catch (err) {
    res.render("index", { error: err.message });
  }
};

// authentication
adminControllers.addNewAdmin = authControllers.signup(Admins, "admin");

adminControllers.signin = authControllers.signin(Admins, "admin");

adminControllers.signout = authControllers.signout;

adminControllers.getAllOrders = async (req, res) => {
  let orders = await Orders.find();
  res.render("auth/admin/orders.ejs", { orders, admin: req.session.admin });
};

adminControllers.getAllCustomers = async (req, res) => {
  let customers = await Customers.find();
  res.render("auth/admin/customers.ejs", {
    customers,
    admin: req.session.admin,
  });
};

module.exports = adminControllers;
