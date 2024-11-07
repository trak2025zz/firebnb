const express = require("express");
const User = require("../models/user");
const jwt = require("jsonwebtoken");
const router = express.Router();
const authenticateToken = require("../middleware/jwtMiddleware");
const hashing = require("../utils/hashing");

router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ where: { email: email } });

  if (!user) {
    return res.status(403).json({ message: "unauthenticated" });
  }

  if (!(await hashing.verifyHash(password, user.password))) {
    return res.status(403).json({ message: "unauthenticated" });
  }

  const token = jwt.sign({ email: user.email }, process.env.TOKEN_SECRET, {
    expiresIn: 3600,
  });
  return res.status(200).json({ token });
});

router.get("/me", authenticateToken, async (req, res) => {
  const user = await User.findOne({ where: { email: req?.user?.email } });
  const user_id = user?.dataValues?.id;

  return res.send({ ...req.user, id: user_id });
});

module.exports = router;
