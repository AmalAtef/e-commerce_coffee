const mongoose = require("mongoose");
const _ = require("lodash");

// coffee pods Schema
const schema = new mongoose.Schema(
  {
    type: {
      type: String,
      required: [true, "product_type is required"]
    },
    flavor: {
      type: Number
    },
    pack_size: {
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
const pod = mongoose.model("coffee_pod", schema);

module.exports = pod;
