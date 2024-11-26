/** @format */
const formatDate = require("./ConfigDate");
const SendEmail = require("./SendEmail");
const SendBill = ({
  name,
  user,
  startDate,
  endDate,
  password,
  title,
  price,
  email,
  billId,
}) => {
  const subject = `Đơn hàng của ${name} tại FLEN`;
  const text = `Chào ${name}`;
  const html = `<!DOCTYPE html>
<html lang="vi">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Hoá Đơn Tài Khoản VIP</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            line-height: 1.6;
            margin: 0;
            padding: 20px;
            background-color: #f9f9f9;
        }
        .invoice {
            max-width: 800px;
            margin: 0 auto;
            background: white;
            padding: 30px;
            border-radius: 8px;
            box-shadow: 0 0 10px rgba(0,0,0,0.1);
        }
        .header {
            text-align: center;
            margin-bottom: 30px;
            border-bottom: 2px solid #eee;
            padding-bottom: 20px;
        }
        .invoice-details {
            margin-bottom: 30px;
        }
        .account-info {
            background-color: #f8f9fa;
            padding: 20px;
            border-radius: 5px;
            margin: 20px 0;
        }
        .total {
            font-size: 1.5em;
            font-weight: bold;
            margin-top: 20px;
            text-align: right;
        }
        table {
            width: 100%;
            border-collapse: collapse;
            margin: 20px 0;
        }
        th, td {
            padding: 12px;
            text-align: left;
            border-bottom: 1px solid #ddd;
        }
        th {
            background-color: #f5f5f5;
        }
        .copy-btn {
            background-color: #4CAF50;
            color: white;
            border: none;
            padding: 5px 10px;
            border-radius: 4px;
            cursor: pointer;
            margin-left: 10px;
            font-size: 14px;
        }
        .copy-btn:hover {
            background-color: #45a049;
        }
        .credential-row {
            display: flex;
            align-items: center;
            margin-bottom: 10px;
        }
        .toast {
            position: fixed;
            bottom: 20px;
            left: 50%;
            transform: translateX(-50%);
            background-color: #333;
            color: white;
            padding: 10px 20px;
            border-radius: 5px;
            display: none;
            z-index: 1000;
        }
        .logo{
            width:80px;
            height:80px;
        }
    </style>
</head>
<body>
    <div class="invoice">
        <div class="header">
            <h1>HOÁ ĐƠN THANH TOÁN</h1>
            <img src="https://res.cloudinary.com/dhhuv7n0h/image/upload/v1730138485/iconen_kuoewc.png" class="logo">
        </div>
    
        <div class="invoice-details">
            <p><strong>Số hoá đơn:</strong> ${billId}</p>
            <p><strong>Ngày:</strong>${formatDate(startDate)}</p>
            <p><strong>Phương thức thanh toán:</strong> Chuyển khoản</p>
        </div>

        <table>
            <thead>
                <tr>
                    <th>Mô tả</th>
                    <th>Thời hạn</th>
                    <th>Đơn giá</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td>Tài khoản ${title}</td>
                    <td>6 tháng</td>
                    <td>${price.toLocaleString("vi-VN")} VNĐ</td>
                </tr>
            </tbody>
        </table>

        <div class="account-info">
            <h3>Thông tin tài khoản</h3>
            <p><strong>Tên đăng nhập:</strong> <span id="username">${user}</span></p>
            <p><strong>Mật khẩu:</strong> <span id="">${password}</span></p>
            <p><strong>Website truy cập:</strong> <a href="https://flenvn.netlify.app/">https://flenvn.netlify.app</a></p>
            <p><strong>Ngày bắt đầu:</strong> ${formatDate(startDate)}</p>
            <p><strong>Ngày kết thúc:</strong> ${formatDate(endDate)}</p>
        </div>

        <div class="total">
            <p>Tổng cộng: ${price.toLocaleString("vi-VN")} VNĐ</p>
        </div>

        <div style="margin-top: 40px; text-align: center; color: #666;">
            <p>Cảm ơn quý khách đã sử dụng dịch vụ của chúng tôi!</p>
            <p>Mọi thắc mắc xin vui lòng liên hệ: hotro@congty.com</p>
        </div>
    </div>
</body>
</html>
  `;
  SendEmail({
    html,
    text,
    subject,
    to: email,
  });
};

module.exports = SendBill;
