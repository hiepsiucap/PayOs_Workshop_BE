/** @format */

const {
  CreateOrder,
  CreateOrderAndPayment,
  ConfirmPayment,
  GetOrder,
  DeleteOrder,
} = require("../Controller/OrderController");
const express = require("express");
const router = express.Router();
router.post("/creatOrder", CreateOrder);
router.post("/checkout", CreateOrderAndPayment);
router.post("/confirm", ConfirmPayment);
router.get("/getorder", GetOrder);
router.delete("/deleteorder", DeleteOrder);
module.exports = router;
