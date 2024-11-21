/** @format */

const Subscription = require("../model/Subscription");
const CustomApiError = require("../errors");
const PayOS = require("@payos/node");
const Order = require("../model/Order");
const crypto = require("crypto");
require("dotenv").config();
const User = require("../model/User");
const { generateRandomPassword } = require("../utilz/CreatePassword");
const { StatusCodes } = require("http-status-codes");
const CreateOrderAndPayment = async (req, res) => {
  const { email, name, subscriptionId } = req.body;
  const subscirption = await Subscription.findOne({ _id: subscriptionId });
  if (!subscirption) {
    throw new CustomApiError.BadRequestError(
      "Kiểm tra lại gói đăng kí của bạn"
    );
  }
  if (!email || !name) {
    throw new CustomApiError.BadRequestError("Kiểm tra lại thông tin cá nhân");
  }
  const password = generateRandomPassword();
  const user = await User.create({ password, name, email });
  const order = await Order.create({
    User: user,
    Subscription: subscirption,
    total: subscirption.price * subscirption.time,
    description: `ĐK gói ${subscirption.title} ${subscirption.time} tháng `,
  });
  if (!order) {
    throw new CustomApiError.BadRequestError(
      "Tạo đơn hàng không thành công vui lòng thử lại"
    );
  }
  const params = {
    amount: Number(order.total),
    orderCode: Number(order._id),
    description: order.description,
    buyerName: user.name,
    buyerEmail: user.email,
    cancelUrl: "http://localhost:5173/cancel",
    returnUrl: "https://flenvn.netlify.app/wordbank",
  };
  console.log(params);
  const payos = new PayOS(
    process.env.CLIENT_ID,
    process.env.API_KEY,
    process.env.CHECK_SUM
  );
  console.log(payos);
  const data = await payos.createPaymentLink(params);
  console.log(data);
  res.status(StatusCodes.OK).json({ data });
};
const CreateOrder = async (req, res) => {
  const { User, Subscription, status, total, description } = req.body;
  const order = await Order.create({
    User,
    Subscription,
    status,
    total,
    description,
  });
  res.status(StatusCodes.OK).json({ order });
};
const ConfirmPayment = async (req, res) => {
  const payos = new PayOS(
    process.env.CLIENT_ID,
    process.env.API_KEY,
    process.env.CHECK_SUM
  );
  const webhookBody = req.body;
  if (webhookBody) {
    const paymentData = payos.verifyPaymentWebhookData(webhookBody);
    console.log(paymentData);
    return res.status(StatusCodes.OK).json({ paymentData });
  }
  return res.status(StatusCodes.OK).json({ msg });
};
module.exports = { CreateOrder, CreateOrderAndPayment, ConfirmPayment };
