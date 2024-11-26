/** @format */

const Subscription = require("../model/Subscription");
const CustomApiError = require("../errors");
const PayOS = require("@payos/node");
const Order = require("../model/Order");
const crypto = require("crypto");
const SendBill = require("../utilz/SendBill");
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
  const check = await User.findOne({ email: email });
  if (check)
    throw new CustomApiError.BadRequestError(
      "Email đã tồn tại vui lòng thử email khác"
    );
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
  order.paymentLinkId = data.paymentLinkId;
  await order.save();
  res.status(StatusCodes.OK).json({ data });
};
const DeleteOrder = async (req, res) => {
  const { id, orderCode } = req.query;
  if (!id || !orderCode) {
    throw new CustomApiError.BadRequestError("Không tìm thấy đơn hàng của bạn");
  }
  const order = await Order.findOne({
    paymentLinkId: id,
    _id: orderCode,
  });
  if (!order) {
    throw new CustomApiError.BadRequestError("Hoá đơn không tồn tại");
  }
  const user = await User.findByIdAndDelete({ _id: order.User });
  order.deleteOne();
  res.status(StatusCodes.OK).json({ msg: "xoá thành công" });
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
  if (!order) {
    throw new CustomApiError.BadRequestError("Hoá đơn không tồn tại");
  }
  if (order.status !== "PROCESSING") {
    throw new CustomApiError.BadRequestError("Hoá đơn của bạn đã hết hạn ");
  } else {
    const password = generateRandomPassword();
    const subscription = await Subscription.findOne({
      _id: order.Subscription,
    });
    const user = await User.findOne({ _id: order.User });
    if (!subscription || !user)
      throw new CustomApiError.BadRequestError(
        "Không tồn tại user và subscription"
      );
    user.password = password;
    user.IsVerification = true;
    user.subscription = subscription;
    user.validDay.setMonth(user.validDay.getMonth() + subscription.time);
    await user.save();
    order.status = "COMPLETED";
    order.save();
    SendBill({
      name: user.name,
      user: user.email,
      password: password,
      price: order.total,
      billId: order._id,
      title: subscription.title,
      endDate: user.validDay,
      email: user.email,
      startDate: new Date(),
    });
    return res.status(StatusCodes.OK).json({
      subscription,
      name: user.name,
      email: user.email,
      password,
      order,
    });
  }
};
module.exports = {
  CreateOrder,
  DeleteOrder,
  CreateOrderAndPayment,
  ConfirmPayment,
  GetOrder,
};
