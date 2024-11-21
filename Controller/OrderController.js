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
    cancelUrl: `${process.env.FRONTEND_API}/cancel`,
    returnUrl: `${process.env.FRONTEND_API}/success/12`,
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
  if (!webhookBody) {
    throw new CustomApiError.BadRequestError(
      "Không thành công vui lòng thử lại"
    );
  }
  const paymentData = payos.verifyPaymentWebhookData(webhookBody);
  if (!paymentData) {
    throw new CustomApiError.BadRequestError(
      "Dữ liệu không đúng vui lòng thử lại"
    );
  }
  if (paymentData.desc !== "success")
    throw new CustomApiError.BadRequestError("Thanh toán không thành công");
  const order = await Order.findOne({ _id: paymentData.orderCode });
  if (!order)
    throw new CustomApiError.BadRequestError("Không tìm thấy đơn hàng");
  order.status = "PROCESSING";
  order.paymentLinkId = paymentData.paymentLinkId;
  await order.save();
  return res.status(StatusCodes.OK).json({ paymentData });
};
const GetOrder = async (req, res) => {
  const { id, orderCode } = req.query;
  if (!id || !orderCode) {
    throw new CustomApiError.BadRequestError("Không tìm thấy đơn hàng của bạn");
  }
  const order = await Order.findOne({
    paymentLinkId: id,
    _id: orderCode,
  });
  if (order.status !== "PROCESSING")
    throw new CustomApiError.BadRequestError("Hoá đơn của bạn đã hết hạn ");
  const password = generateRandomPassword();
  const subscription = await Subscription.findOne({ _id: order.Subscription });
  const user = await User.findOne({ _id: order.User });
  user.password = password;
  user.subscription = subscription;
  user.validDay.setMonth(user.validDay.getMonth() + subscription.time);
  await user.save();
  return res
    .status(StatusCodes.OK)
    .json({ subscription, email: user.email, password });
};
module.exports = {
  CreateOrder,
  CreateOrderAndPayment,
  ConfirmPayment,
  GetOrder,
};
