/** @format */

const CustomAPIError = require("./Custom-API");
const { StatusCodes } = require("http-status-codes");
class BadRequestError extends CustomAPIError {
  constructor(message) {
    super(message);
    this.StatusCodes = StatusCodes.BAD_REQUEST;
  }
}
module.exports = BadRequestError;
