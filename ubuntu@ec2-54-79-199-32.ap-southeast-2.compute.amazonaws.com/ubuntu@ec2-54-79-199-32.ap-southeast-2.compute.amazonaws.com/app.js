/** @format */

var createError = require("http-errors");
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
const cors = require("cors");
var indexRouter = require("./routes/index");
var usersRouter = require("./routes/users");
var PaymentRouter = require("./routes/PaymentRoute");
var app = express();
const { ErrorHandler } = require("./Middleware/ErrorHandler");
const NotFound = require("./Middleware/Notfound");
// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "jade");
const corsOptions = {
  origin: true,
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization", "X-refresh-token"],
  exposedHeaders: ["X-refresh-token", "Authorization"],
  credentials: true,
  optionsSuccessStatus: 200,
};

app.use(cors(corsOptions));
app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

app.use("/", indexRouter);
app.use("/users", usersRouter);
app.use("/api/payment", PaymentRouter);
app.use(function (req, res, next) {
  next(createError(404));
});
app.use(NotFound);
app.use(ErrorHandler);

module.exports = app;
