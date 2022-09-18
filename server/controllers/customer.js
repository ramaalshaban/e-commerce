const mongoose = require("mongoose");

const ShopItems = require("../models/shop-item");
const Cart = require("../models/cart");
const Customers = require("../models/customer");
const OrderModel = require("../models/order");

const adminControllers = require("./admin");
const authControllers = require("./auth");

const customerControllers = {};

customerControllers.getShopItems = async (req, res) => {
  let items = await ShopItems.find();
  res.render("index", {
    items,
    user: req.session.customer,
    admin: req.session.admin,
  });
};

customerControllers.getSingleItem = async (req, res) => {
  const item = await ShopItems.findOne({ _id: req.params.id });
  if (item) res.json(item);
  else res.status(404).json({ message: "item not found" });
};

customerControllers.filterShopItems = async (req, res) => {
  const { category, price: priceRange } = req.query;
  const ranges = priceRange.split("to");
  const min = +ranges[0];
  const max = +ranges[1];
  const filteredItems = await ShopItems.find({
    category,
    price: { $gt: min, $lt: max },
  });
  if (filteredItems.length !== 0) res.json(filteredItems);
  else
    res.status(404).json({
      message: `Items with category: ${category} and price range: ${priceRange} weren't found`,
    });
};

customerControllers.searchShopItems = adminControllers.searchShopItems;

customerControllers.getCustomerCart = async (req, res) => {
  const customerId = req.session.customer.id;
  try {
    const customerCart = await Cart.findOne({ customerId });
    res.render("auth/customer/cart", {
      items: customerCart.items,
      user: req.session.customer,
    });
  } catch (err) {
    res.json({ message: err.message });
  }
};

customerControllers.addItemToCart = async (req, res) => {
  const { itemId } = req.params;
  const customerId = req.session.customer.id;
  const quantity = 1;
  const cart = await Cart.findOne({ customerId });
  const itemInInventory = await ShopItems.findOne({
    _id: itemId,
  });
  let quantityInInventory = itemInInventory?.availableCount;
  if (cart) {
    if (quantityInInventory) {
      let itemIndex = cart.items.findIndex(
        (item) => item.itemId.toString() === itemId
      );
      if (itemIndex > -1) {
        let item = cart.items[itemIndex];
        item.quantity += quantity;
        cart.items[itemIndex] = item;
        await cart.save();
      } else {
        const { title, price, image, description } = itemInInventory;
        console.log(itemInInventory);
        cart.items.push({ itemId, quantity, title, price, image, description });
        await cart.save();
      }
      itemInInventory.availableCount -= quantity;
      await itemInInventory.save();
      return res.status(201).redirect("/customer/cart");
    } else res.status(404).json({ message: "Sorry :( Item isn't available" });
  } else {
    //no cart for customer, create new cart
    const { title, price, image, description } = itemInInventory;
    const newCart = await Cart.create({
      customerId,
      items: [{ itemId, quantity, title, price, image, description }],
    });
    return res.status(201).redirect("/customer/cart");
  }
};

customerControllers.orderItems = async (req, res) => {
  const customerId = req.session.customer.id;
  const customerCart = await Cart.findOne({ customerId });
  if (customerCart.items.length !== 0) {
    const bill = customerCart.items.reduce(
      (acc, current) => acc + current.price * current.quantity,
      0
    );
    const order = await OrderModel.create({
      customerId,
      orderItems: [...customerCart.items],
      bill,
    });
    customerCart.items = [];
    await customerCart.save();
    res.render("auth/customer/checkout", {
      order,
      user: req.session.customer,
    });
  } else {
    //empty Cart
    res.render("auth/customer/checkout", {
      user: req.session.customer,
    });
  }
};

// authentication
customerControllers.signup = authControllers.signup(Customers, "customer");

customerControllers.signin = authControllers.signin(Customers, "customer");

customerControllers.signout = authControllers.signout;

customerControllers.getOwnOrders = async (req, res) => {
  const customerId = req.session.customer.id;
  const orders = await OrderModel.findOne({ customerId });
  if (orders) {
    res.json(orders.orderItems);
  } else {
    res.status(404).json({ message: "no previous orders found" });
  }
};

customerControllers.updateProfile = async (req, res) => {
  const id = req.session.customer.id;
  const customer = await Customers.findOne({ id });
  try {
    for (let key in req.body) {
      customer[key] = req.body[key];
    }
    await customer.save();
    res.json(customer);
  } catch (err) {
    res.json({ error: err.message });
  }
};

customerControllers.deleteItemFromCart = async (req, res) => {
  const customerId = req.session.customer.id;
  const cart = await Cart.findOne({ customerId });
  const { itemId } = req.params;
  if (cart) {
    console.log("cart before", cart);
    let itemIndex = cart.items.findIndex(
      (item) => item.itemId.toString() === itemId
    );
    console.log(itemIndex);
    if (itemIndex > -1) {
      const itemsAfterDeletion = cart.items.filter((item, i) => {
        if (i !== itemIndex) return item;
      });
      console.log(itemsAfterDeletion);
      cart.items = [...itemsAfterDeletion];
      console.log("after", cart);
      await cart.save();
      res.json({ message: "item deleted successfully" });
    } else {
      res.json({ message: "item not found" });
    }
  } else {
    //no cart for customer
    res.json({ message: "can't delete from unexisted cart" });
  }
};

customerControllers.updateCartItemQuantity = async (req, res) => {};

module.exports = customerControllers;
