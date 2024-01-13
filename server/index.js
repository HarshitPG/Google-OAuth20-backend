// app.js
require("dotenv").config();
const express = require("express");
const cors = require("cors");
const session = require("express-session");
const passport = require("passport");
const connectDb = require("./db/conn");
const authRoutes = require("../server/routes/authRoutes");

const app = express();
const PORT = 8080;

connectDb();

app.use(
  cors({
    origin: "http://localhost:3000",
    methods: "GET,POST,PUT,DELETE",
    credentials: true,
  })
);

app.use(express.json());

app.use(
  session({
    secret: "qwe123asd456zxc789",
    resave: false,
    saveUninitialized: true,
  })
);

app.use(passport.initialize());
app.use(passport.session());
app.use("/", authRoutes);

app.listen(PORT, () => {
  console.log(`server is listening on port ${PORT}`);
});
