const express = require("express");

const router = express.Router();

const User = require("../users/user-model");
const bcrypt = require("bcryptjs");
const middleware = require("../middleware/middleware");

router.post(
  "/register",
  middleware.checkPayload,
  middleware.checkUsernameUnique,
  async (req, res) => {
    try {
      const hash = bcrypt.hashSync(req.body.password, 10);
      const newUser = await User.add({
        username: req.body.username,
        password: hash,
      });
      res.status(201).json(newUser);
    } catch (err) {
      res.status(500).json(err.message);
    }
  }
);

router.post(
  "/login",
  middleware.checkPayload,
  middleware.checkUsernameExists,
  async (req, res) => {
    try {
      const verifies = bcrypt.compareSync(
        req.body.password,
        req.userData.password
      );
      if (verifies) {
        req.session.user = req.userData;
        res.json(`Welcome back, ${req.userData.username}`);
      } else {
        res.status(401).json("You shall not pass!");
      }
    } catch (err) {
      res.status(500).json(err.message);
    }
  }
);

router.get("/logout", (req, res) => {
  if (req.session) {
    req.session.destroy((err) => {
      if (err) {
        res.json("There was an error logging out");
      } else {
        res.json("Goodbye!");
      }
    });
  } else {
    res.json("There was no session");
  }
});

module.exports = router;
