/** @format */

const {
  CreateOrder,
  CreateOrderAndPayment,
  ConfirmPayment,
  GetOrder,
} = require("../Controller/OrderController");
const express = require("express");
const router = express.Router();
router.post("/creatOrder", CreateOrder);
router.post("/checkout", CreateOrderAndPayment);
router.post("/confirm", ConfirmPayment);
router.get("/getorder", GetOrder);
module.exports = router;
