const { query } = require("express-validator");

const reservationUserListValidator = [
  query("start_date").optional().isDate(),
  query("end_date").optional().isDate(),
];
module.exports = {
  reservationUserListValidator,
};
