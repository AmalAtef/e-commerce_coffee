const mongoose = require("mongoose");
const _ = require("lodash");

// coffee machines Schema
const schema = new mongoose.Schema(
  {
    type: {
      type: String,
      required: [true, "product_type is required"]
    },
    water_line: {
      type: Number
    }
  },
  {
    timestamps: true,
    toJSON: {
      transform: (doc, ret) => _.omit(ret, ["__v", "createdAt"]),
      virtuals: true
    }
  }
);
const machine = mongoose.model("coffee_machine", schema);

module.exports = machine;
