const path = require("path");
const express = require("express");
const cloudinary = require('cloudinary').v2;
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const morgan = require("morgan");
const exphbs = require("express-handlebars");
const methodOverride = require('method-override')
const passport = require("passport");
const session = require("express-session");
const MongoDbStore = require("connect-mongo");
const connectDB = require("./config/db");
var multer  = require('multer')


//load the confin

dotenv.config({ path: "./config/config.env" });

//googleOAUTH20
require("./config/passport")(passport);

connectDB();

const app = express();

// body parser
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// Method override
app.use(
  methodOverride(function (req, res) {
    if (req.body && typeof req.body === 'object' && '_method' in req.body) {
      // look in urlencoded POST bodies and delete it
      let method = req.body._method
      delete req.body._method
      return method
    }
  })
)

//this is for logging when using dev
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

//handlebars helpers
const { formatDate, stripTags, truncate, editIcon, select } = require("./helpers/hbs");

// handlebars templating engine
app.engine(
  ".hbs",
  exphbs({
    helpers: {
      formatDate,
      stripTags,
      truncate,
      editIcon,
      select,
    },
    defaultLayout: "main",
    extname: ".hbs",
  })
);
app.set("view engine", ".hbs");

//sessions
app.use(
  session({
    secret: "pigeons",
    resave: false,
    saveUninitialized: false,
    store: MongoDbStore.create({
      mongoUrl: process.env.MONGO_URI,
    }),
  })
);

//passport middleware
app.use(passport.initialize());
app.use(passport.session());

//setting global variables, this is for the plantuser and plantID in the index.hbs, you will need to do this again with pots
app.use(function (req, res, next) {
  res.locals.user = req.user || null;
  next();
});

//static folder
app.use(express.static(path.join(__dirname, "public")));

//routes
app.use("/", require("./routes/index"));
app.use("/auth", require("./routes/auth"));
app.use("/plants", require("./routes/plants"));

const PORT = process.env.PORT || 3000;

app.listen(
  PORT,
  console.log(
    `server is running in ${process.env.NODE_ENV} mode on port ${PORT}`
  )
);
