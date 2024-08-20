const express = require("express");
const router = express.Router();

const userController = require(`../../../controllers/user-controller`);
const {
  header,
  query,
  body,
  param,
  oneOf,
  validatorErrorChecker,
  oneValueExists,
} = require(`../../../middlewares/validator`);
const {
  authorizationUser,
  authorizationOper,
  authorizationSys,
  checkAuthorization,
} = require(`../../../middlewares/authorize`);

router.post("/login", validatorErrorChecker, userController.login);

module.exports = router;
