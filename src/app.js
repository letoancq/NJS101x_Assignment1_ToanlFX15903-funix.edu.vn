const express = require("express");
const app = express();
const csrf = require("csurf");
const session = require("express-session");
const mongodbStore = require("connect-mongodb-session")(session);
const handlebars = require("express-handlebars");
const path = require("path");
const multer = require("multer");
const router = require("./router/index");
const db = require("./config/db");

const Staff = require("./models/staff");
const MONGODB_URI =
  "mongodb+srv://letoan:letoan410@cluster0.m09swex.mongodb.net/asm2?retryWrites=true&w=majority";

// Connect to MongoDB
db();

const fileStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./images");
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  },
});
const fileFilter = (req, file, cb) => {
  if (
    file.mimetype === "image/jpg" ||
    file.mimetype === "image/png" ||
    file.mimetype === "image/jpeg"
  ) {
    cb(null, true);
  } else {
    cb(null, false);
  }
};

// Set static: public
app.use(express.static(path.join(__dirname, "/public")));
app.use("/images", express.static(path.join(__dirname, "../images")));
app.use(
  multer({ storage: fileStorage, fileFilter: fileFilter }).single("image")
);

// Parse body
app.use(express.urlencoded({ extended: true }));

// View engine
app.engine(
  "handlebars",
  handlebars.engine({
    helpers: {
      compare: function (value) {
        return value == 0;
      },
      compare1: function (value) {
        return value < 1;
      },
      covert: function (value) {
        value = value
          .toFixed(0)
          .toString()
          .replace(/\B(?=(\d{3})+(?!\d))/g, ",");
        return value;
      },
      compare2: function (value) {
        return value == false;
      },
      compare3: function (value) {
        return value == null;
      },
      compare4: function (value) {
        return value !== "admin";
      },
    },
  })
);

app.set("view engine", "handlebars");
app.set("views", path.join(__dirname, "/views"));

// save session
const store = new mongodbStore({
  uri: MONGODB_URI,
  collection: "sessions",
});
app.use(
  session({
    secret: "my secret",
    resave: false,
    saveUninitialized: false,
    store,
  })
);

// Token
const csrfProtection = csrf();
app.use(csrfProtection);

// set token, authenticated
app.use((req, res, next) => {
  res.locals.isAuthenticated = req.session.isLoggedIn;
  res.locals.csrfToken = req.csrfToken();
  next();
});

// Add staff in request
app.use((req, res, next) => {
  if (!req.session.staff) {
    res.locals.role = false;
    return next();
  }
  Staff.findById(req.session.staff._id)
    .then((staff) => {
      if (!staff) {
        return next();
      }
      req.staff = staff;
      if (staff.role === "admin") {
        res.locals.role = "admin";
        return next();
      }
      res.locals.role = "staff";
      next();
    })
    .catch((error) => {
      console.log(error);
    });
});

// Init router
router(app);

app.listen(process.env.PORT || 3001, "0.0.0.0", () => {
  console.log("Server is running");
});
