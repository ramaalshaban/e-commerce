const express = require("express");
const ShopItems = require("../models/shop-item");
const router = express.Router();
const passwordValidator = require("../validation/password-validator");

const userRole = require("../middleware/userRole");

const adminControllers = require("../controllers/admin");

router.post("/add-item", userRole("admin"), adminControllers.addShopItem);
// put request for update but just for viewing in ejs we made it post
router.post("/update/:id", userRole("admin"), adminControllers.updateShopItem);
router.get("/delete/:id", userRole("admin"), adminControllers.deleteShopItem);
router.post("/search", userRole("admin"), adminControllers.searchShopItems);

router.get("/new-admin", (_, res) => {
  res.render("auth/admin/new-admin");
});

router.get("/signin", (_, res) => {
  res.render("auth/admin/signin");
});

router.get("/add-item", (_, res) => {
  res.render("auth/admin/add-item");
});

router.get("/update/:id", async (req, res) => {
  res.render("auth/admin/update-item", {
    item: await ShopItems.findById(req.params.id),
  });
});

// authentication
router.post(
  "/new-admin",
  userRole("admin"),
  passwordValidator,
  adminControllers.addNewAdmin
);
router.post("/signin", adminControllers.signin);
router.get("/signout", adminControllers.signout);

router.get("/orders", userRole("admin"), adminControllers.getAllOrders);
router.get("/customers", userRole("admin"), adminControllers.getAllCustomers);

module.exports = router;
