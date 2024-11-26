/** @format */
require("dotenv").config();
const nodemailer = require("nodemailer");
console.log(process.env.EMAIL_PASSWORD);
const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: {
    user: "besttutorvn@gmail.com",
    pass: process.env.EMAIL_PASSWORD,
  },
});
module.exports = transporter;
