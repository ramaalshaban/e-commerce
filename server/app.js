const express = require("express");
const path = require("path");
require("dotenv").config();

const connectToMongo = require("./db/connection");

const cookieParser = require("cookie-parser");
const sessions = require("express-session");

const adminRoutes = require("./routes/admin");
const customerRouter = require("./routes/customer");

const app = express();
const port = process.env.NODE_LOCAL_PORT;

// Set view engine and views dir
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.use(cookieParser());
app.use(
  sessions({
    name: "sid",
    secret: process.env.APP_SECRET,
    saveUninitialized: false,
    resave: false,
    cookie: {},
  })
);

app.get("/", (req, res) => {
  res.render("index");
});

// renders sign in page
app.get("/signin", (_, res) => {
  res.render("signin");
});

app.use("/admin", adminRoutes);
app.use("/customer", customerRouter);

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
  connectToMongo();
});

module.exports = app;
