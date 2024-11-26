/** @format */

module.exports = function formatDate(date) {
  // Kiểm tra nếu date là string hoặc timestamp thì convert sang Date object
  if (!(date instanceof Date)) {
    // Nếu là timestamp (number)
    if (typeof date === "number") {
      date = new Date(date);
    }
    // Nếu là string
    else if (typeof date === "string") {
      date = new Date(date);
    }
    // Nếu không phải các kiểu trên thì trả về null
    else {
      return null;
    }
  }

  // Kiểm tra date có hợp lệ không
  if (isNaN(date.getTime())) {
    return null;
  }

  // Lấy ngày, tháng, năm
  const day = date.getDate().toString().padStart(2, "0");
  const month = (date.getMonth() + 1).toString().padStart(2, "0"); // getMonth() trả về 0-11
  const year = date.getFullYear();

  // Trả về định dạng dd/mm/yyyy
  return `${day}/${month}/${year}`;
};
