if (process.env.MODE_ENV !== "production") {
  require("dotenv").config();
}

const express = require("express");
const app = express();

const expressLayouts = require("express-ejs-layouts");
const bcrypt = require("bcrypt");
const passport = require("passport");
const flash = require("express-flash");
const session = require("express-session");
const methodOverride = require("method-override");
const mongoose = require("mongoose");
const path = require("path");

const User = require("./models/User");

const initializePassport = require("./passport-config");
initializePassport(
  passport,
  (email) => {
    return User.findOne({ email: email });
  },
  (id) => {  
    return User.findById(id);
  }
);

const homeRouter = require("./routes/index");
const loginRouter = require("./routes/login");
const registerRouter = require("./routes/register");
const booksRouter = require("./routes/books");
const electronicsRouter = require("./routes/electronics");
const vehiclesRouter = require("./routes/vehicles");
const sportsRouter = require("./routes/sports");
const othersRouter = require("./routes/others");
const sellRouter = require("./routes/sell");
const profileRouter = require("./routes/profile");
const cartRouter = require("./routes/cart");

app.set("view engine", "ejs");
app.set("views", __dirname + "/views");
app.set("layout", "layouts/layout");
app.use(expressLayouts);
app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({ extended: false, limit: "50mb" }));
app.use(express.json());
app.use(flash());
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
  })
);
app.use(passport.initialize());
app.use(passport.session());
app.use(methodOverride("_method"));

app.use("/", homeRouter);
app.use("/login", loginRouter);
app.use("/register", registerRouter);
app.use("/books", booksRouter);
app.use("/electronics", electronicsRouter);
app.use("/vehicles", vehiclesRouter);
app.use("/sports", sportsRouter);
app.use("/others", othersRouter);
app.use("/sell", sellRouter);
app.use("/profile", profileRouter);
app.use("/cart", cartRouter);

app.delete("/logout", (req, res) => {
  req.logOut();
  res.redirect("/login");
});

mongoose.connect(process.env.DATABASE_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
const db = mongoose.connection;
db.on("error", (error) => console.error(error));
db.once("open", () => console.log("Connected to Mongoose"));

app.listen(process.env.PORT || 3000);
