const User = require("../users/user-model");

const restricted = (req, res, next) => {
  if (req.session && req.session.user) {
    next();
  } else {
    res.status(401).json("You shall not pass!");
  }
};

const checkPayload = (req, res, next) => {
  if (!req.body.username || !req.body.password) {
    res.status(401).json("Please include a valid username and password");
  } else {
    next();
  }
};

const checkUsernameUnique = async (req, res, next) => {
  try {
    const rows = await User.findBy({ username: req.body.username });
    if (!rows.length) {
      next();
    } else {
      res.status(401).json("Username already exists");
    }
  } catch (err) {
    res.status(500).json(err.message);
  }
};

const checkUsernameExists = async (req, res, next) => {
  try {
    const rows = await User.findBy({ username: req.body.username });
    if (rows.length) {
      req.userData = rows[0];
      next();
    } else {
      res.status(401).json("Invalid username or password");
    }
  } catch (err) {
    res.status(500).json(err.message);
  }
};

module.exports = {
  restricted,
  checkPayload,
  checkUsernameUnique,
  checkUsernameExists,
};
