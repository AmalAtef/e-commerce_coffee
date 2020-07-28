const express = require("express");
const router = express.Router();

const { body } = require("express-validator");
const Machine = require("../models/coffee_machine");

//Add machine
router.post("/", async (req, res) => {
  const { type, water_line } = req.body;
  const machine = new Machine({
    type,
    water_line
  });
  await machine.save();
  res.status(201).json({ machine, message: "Machine added successfully" });
});

// Get all machines or by filter using (product_type - water_line)
router.get("/", async (req, res) => {
  const filterType = req.query.filterType;
  const w_line = req.query.w_line;

  //filter by product_type not water_line
  if (filterType && !w_line) {
    let machines = await Machine.find({
      $text: { $search: filterType }
    });
    if (machines.length === 0)
      return res.json({
        message: "No machines with such name",
        machines: []
      });
    machines = machines.map(m => `${m.type + "0" + m.water_line}`);
    res.json({ machines });
  } else if (filterType && w_line) {
    //filter by product_type and water_line
    let machines = await Machine.find({
      $and: [{ $text: { $search: filterType }, $text: { $search: w_line } }]
    });
    if (machines.length === 0)
      return res.json({
        message: "No machines with such type or water line",
        machines: []
      });
    machines = machines.map(m => `${m.type + "0" + m.water_line}`);
    res.json({ machines });
  } else {
    //Get All machines
    let machines = await Machine.find();
    if (machines.length === 0)
      return res.json({
        message: "No machines",
        machines: []
      });
    machines = machines.map(m => `${m.type + "0" + m.water_line}`);
    res.json({ machines });
  }
});

module.exports = router;
