const express = require("express");
const router = express.Router();

const customerControllers = require("../controllers/customer");
const passwordValidator = require("../validation/password-validator");

const userRole = require("../middleware/userRole");

router.get("/shop-items", customerControllers.getShopItems);
router.get("/shop-items/:id", customerControllers.getSingleItem);
router.get("/shop-items/filter", customerControllers.filterShopItems);
router.post("/shop-items/search", customerControllers.searchShopItems);
router.get("/cart", userRole("customer"), customerControllers.getCustomerCart);
router.get(
  "/cart/:itemId",
  userRole("customer"),
  customerControllers.addItemToCart
);
router.get("/checkout", userRole("customer"), customerControllers.orderItems);

router.get("/signup", (_, res) => {
  res.render("auth/customer/signup");
});

router.get("/signin", (_, res) => {
  res.render("auth/customer/signin");
});

// authentication
router.post("/signup", passwordValidator, customerControllers.signup);
router.post("/signin", customerControllers.signin);
router.get("/signout", customerControllers.signout);

router.get("/orders", userRole("customer"), customerControllers.getOwnOrders);

router.put("/profile", userRole("customer"), customerControllers.updateProfile);

// The customer should be able to update their cart and do CRUD operations on it i.e. add items, remove items, update items by incrementing and decrementing the quantity, ...etc. through the /customer/cart endpoint.

router.delete(
  "/cart/:itemId",
  userRole("customer"),
  customerControllers.deleteItemFromCart
);

module.exports = router;
