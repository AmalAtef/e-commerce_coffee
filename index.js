const express = require("express");
const path = require("path");
const cors = require("cors");
const app = express();

require("express-async-errors");
require("./db");

const { port } = require("./config/config");

const machineRouter = require("./routes/machine");
const podRouter = require("./routes/pod");

const { query } = require("express-validator");
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routers
app.use(["/machine", "/machines"], machineRouter);
app.use(["/pod", "/pods"], podRouter);

app.use(function(req, res, next) {
  res.status(404).send("Sorry can't find that!");
  next();
});

app.use(function(err, req, res, next) {
  const status = res.statusCode == 200 ? 500 : res.statusCode;
  const message = res.statusCode == 200 ? "Something broke!" : err.message;
  res.status(status).json({
    message,
    errors: err
  });
  next();
});

app.listen(port, () => {
  console.info(`App Listening on port ${port}`);
});
