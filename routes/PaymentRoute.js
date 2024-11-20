/** @format */

const {
  CreateOrder,
  CreateOrderAndPayment,
} = require("../Controller/OrderController");
const express = require("express");
const router = express.Router();
router.post("/creatOrder", CreateOrder);
router.post("/checkout", CreateOrderAndPayment);
module.exports = router;
