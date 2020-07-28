const express = require("express");
const router = express.Router();

const { body } = require("express-validator");
const Pod = require("../models/coffee_pods");

//Add pod
router.post("/", async (req, res) => {
  const { type, flavor, pack_size } = req.body;
  const pod = new Pod({
    type,
    flavor,
    pack_size
  });
  await pod.save();
  res.status(201).json({ pod, message: "pod added successfully" });
});

// Get all machines or by filter using (product_type - flavor - pack_size )
router.get("/", async (req, res) => {
  const filterType = req.query.filterType;
  const flavor = req.query.flavor;
  const packSize = req.query.packSize;

  //filter by product_type not flavor or pack_size
  if (filterType && !flavor && !packSize) {
    let pods = await Pod.find({
      $text: { $search: filterType }
    });
    if (pods.length === 0)
      return res.json({
        message: "No pods with such name",
        pods: []
      });
    pods = pods.map(m => `${m.type}${m.flavor}${m.pack_size}`);
    res.json({ pods });
  } else if (filterType && flavor && !packSize) {
    //filter by product_type and flavor not packSize
    let pods = await Pod.find({
      $and: [{ $text: { $search: filterType } }, { flavor: flavor }]
    });
    if (pods.length === 0)
      return res.json({
        message: "No pods with such type or flavor",
        pods: []
      });
    pods = pods.map(m => `${m.type}${m.flavor}${m.pack_size}`);
    res.json({ pods });
  } else if (filterType && !flavor && packSize) {
    //filter by product_type and packSize not flavor
    let pods = await Pod.find({
      $and: [{ $text: { $search: filterType } }, { pack_size: packSize }]
    });
    if (pods.length === 0)
      return res.json({
        message: "No pods with such type or packSize",
        pods: []
      });
    pods = pods.map(p => `${p.type}${p.flavor}${p.pack_size}`);
    res.json({ pods });
  } else if (filterType && flavor && packSize) {
    //filter by product_type and flavor and packSize
    let pods = await Pod.find({
      $and: [
        { $text: { $search: filterType } },
        { flavor: flavor },
        { pack_size: packSize }
      ]
    });
    if (pods.length === 0)
      return res.json({
        message: "No pods with such type or flavor or packSize",
        pods: []
      });
    pods = pods.map(p => `${p.type}${p.flavor}${p.pack_size}`);
    res.json({ pods });
  } else {
    //Get All pods
    let pods = await Pod.find();
    if (pods.length === 0)
      return res.json({
        pods: "No pods",
        pods: []
      });
    pods = pods.map(p => `${p.type}${p.flavor}${p.pack_size}`);
    res.json({ pods });
  }
});

module.exports = router;
