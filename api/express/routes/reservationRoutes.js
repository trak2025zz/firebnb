const express = require("express");
const router = express.Router();
const Bnb = require("../models/bnb");
const Reservation = require("../models/reservation");
const { Op } = require("sequelize");
const User = require("../models/user");
const authenticateToken = require("../middleware/jwtMiddleware");
const { validate } = require("../middleware/validateMiddleware");
const {
  reservationCreateValidator,
} = require("../middleware/validator/reservationCreateValidator");
const {
  reservationUpdateValidator,
} = require("../middleware/validator/reservationUpdateValidator");
const {
  reservationParamIdValidator,
} = require("../middleware/validator/reservationParamIdValidator");
const {
  reservationListValidator,
} = require("../middleware/validator/reservationListValidator");
const {
  reservationUserListValidator,
} = require("../middleware/validator/reservationUserListValidator");

async function isConflicting(start, end, bnb_id, id = null) {
  let query = {
    where: {
      bnb_id: { [Op.eq]: bnb_id },
      [Op.or]: [
        {
          startDate: {
            [Op.gte]: start,
            [Op.lt]: end,
          },
          endDate: {
            [Op.gt]: start,
            [Op.lte]: end,
          },
          [Op.and]: {
            startDate: {
              [Op.lte]: start,
            },
            endDate: {
              [Op.gte]: end,
            },
          },
        },
      ],
    },
  };

  if (id !== null) {
    query.where.id = {
      [Op.ne]: id,
    };
  }

  const { count } = await Reservation.findAndCountAll(query);
  return count > 0;
}

router.post(
  "/create",
  [authenticateToken, validate(reservationCreateValidator)],
  async (req, res) => {
    const { start_date, end_date, bnb_id } = req.body;
    const user = await User.findOne({ where: { email: req.user.email } });
    const user_id = user.id;
    if (start_date > end_date) {
      return res
        .status(400)
        .json({ message: "reservation start is later than the end" });
    }
    const bnb = await Bnb.findById(bnb_id);
    if (bnb === null) {
      return res.status(404).json({ message: "bnb not found" });
    }
    if (await isConflicting(start_date, end_date, bnb_id)) {
      return res.status(400).json({ message: "reservation date is already reserved" });
    }
    const reservation = await Reservation.create({
      startDate: start_date,
      endDate: end_date,
      bnbId: bnb_id,
      userId: user_id,
    });
    return res.status(200).json({ message: "Reservation created", reservation });
  }
);
router.put(
  "/update",
  [authenticateToken, validate(reservationUpdateValidator)],
  async (req, res) => {
    const { id, start_date, end_date } = req.body;
    let reservation = await Reservation.findByPk(id);
    const user = await User.findOne({ where: { email: req.user.email } });
    
    if (!reservation) {
      return res.status(404).json({ message: "not found" });
    }
    if (reservation.userId !== user["id"]) {
      console.log(reservation.userId, user.id);
      return res.status(403).json({ message: "forbidden" });
    }
    if (start_date) {
      reservation.startDate = start_date;
    }
    if (end_date) {
      reservation.endDate = end_date;
    }
    if (reservation.endDate < reservation.startDate) {
      return res.status(422).json({ message: "reservation start is later than end" });
    }
    if (
      await isConflicting(
        reservation.startDate,
        reservation.endDate,
        reservation.bnbId,
        reservation.id
      )
    ) {
      return res.status(400).json({ message: "reservation date is already reserved" });
    }
    console.log(id, start_date, end_date, reservation, user);
    await reservation.save();
    return res.status(200).json({ message: "Successfully updated", reservation });
  }
);
router.get(
  "/index/:id",
  [validate(reservationParamIdValidator)],
  async (req, res) => {
    const reservation = await Reservation.findByPk(req.params.id);
    if (!reservation) {
      return res.status(404).json({ message: "Not Found" });
    }
    return res.status(200).json({ data: reservation });
  }
);
router.get("/list", validate(reservationListValidator), async (req, res) => {
  const { start_date, end_date, bnb_id } = req.query;
  let query = {
    where: {
      bnbId: { [Op.eq]: bnb_id },
    },
  };
  if (start_date !== undefined) {
    query.where.endDate = { [Op.gte]: start_date };
  }
  if (end_date !== undefined) {
    query.where.startDate = { [Op.lte]: end_date };
  }

  const reservations = await Reservation.findAll(query);
  return res.status(200).json({ data: reservations });
});
router.get(
  "/list/user",
  [authenticateToken, validate(reservationUserListValidator)],
  async (req, res) => {
    const { start_date, end_date } = req.query;

    const user = await User.findOne({ where: { email: req.user.email } });
    const user_id = user.id;

    let query = {
      where: {
        userId: { [Op.eq]: user_id },
      },
    };
    if (start_date !== undefined) {
      query.where.endDate = { [Op.gte]: start_date };
    }
    if (end_date !== undefined) {
      query.where.startDate = { [Op.lte]: end_date };
    }

    const reservations = await Reservation.findAll(query);
    const reservationsWithBnb = await Promise.all(
      reservations?.map(async (reservation) => {
        const bnb = await Bnb.findById(reservation?.dataValues?.bnbId);
        return { ...reservation?.get(), bnb: bnb };
      })
    );

    return res.status(200).json({ data: reservationsWithBnb });
  }
);
router.delete(
  "/delete/:id",
  [authenticateToken, validate(reservationParamIdValidator)],
  async (req, res) => {
    const { id } = req.params;
    const reservation = await Reservation.findByPk(id);
    if (reservation === null) {
      return res.status(404).json({ message: "reservation not found" });
    }
    const user = await User.findOne({ where: { email: req.user.email } });
    if (reservation.userId !== user.id) {
      return res.status(403).json({ message: "Forbidden" });
    }
    await reservation.destroy();
    return res.status(200).json({ message: "successfully deleted", reservation });
  }
);

module.exports = router;
