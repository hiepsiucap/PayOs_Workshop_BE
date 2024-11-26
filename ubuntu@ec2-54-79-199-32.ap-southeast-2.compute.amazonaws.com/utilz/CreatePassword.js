/** @format */

function generateRandomPassword(length = 10) {
  const chars =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789"; // Bộ ký tự
  let password = "";

  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * chars.length); // Chọn ký tự ngẫu nhiên
    password += chars[randomIndex];
  }

  return password;
}
module.exports = { generateRandomPassword };
