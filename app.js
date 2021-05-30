const path = require("path");
const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const morgan = require("morgan");
const exphbs = require("express-handlebars");
const passport = require("passport");
const session = require("express-session");
const MongoDbStore = require("connect-mongo");
const connectDB = require("./config/db");

//load the confin

dotenv.config({ path: "./config/config.env" });

//googleOAUTH20
require("./config/passport")(passport);

connectDB();

const app = express();

// body parser
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

//this is for logging when using dev
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

//handlebars helpers
const { formatDate } = require("./helpers/hbs");

// handlebars templating engine
app.engine(
  ".hbs",
  exphbs({ helpers: {formatDate}, defaultLayout: "main", extname: ".hbs" })
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
