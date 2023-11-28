const express = require("express");
const app = express();
const session = require("express-session");
const loginRoutes = require("./loginRoutes/routes.js");
const { mailReply } = require("./controller.js");
require("dotenv").config();
const port = process.env.PORT || 3000;
app.set("view engine", "ejs");
//to store the session info
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
  })
);
//middlware to chechk wheteher we are login
const isLogin = (req, res, next) => {
  if (req.session.tokens) next();
  else res.redirect("/");
};
//routes for login
app.use("/api/google", loginRoutes);

// routes for auto reply of mails
app.use("/api/mailReply", isLogin, mailReply);

//to render a static web page
app.use("/", (req, res) => {
  res.render("pages/index");
});

app.listen(port, () => {
  console.log("listening on port: " + port);
});
