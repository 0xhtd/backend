const express = require("express");
const router = express.Router();

const htdController = require(`../../../controllers/htd-controller`);
const {
  validatorErrorChecker,
} = require(`../../../middlewares/validator`);

// get contract id
router.get(
  "/get-contract",
  validatorErrorChecker,
  htdController.getContractCtl
);

//post contract
router.post(
  "/post-contract",
  validatorErrorChecker,
  htdController.postContractCtl
);

//nft minting
router.post(
  "/register-toilet",
  validatorErrorChecker,
  htdController.registerToiletCtl
);

//associate,
router.post(
  "/post-associate",
  validatorErrorChecker,
  htdController.associateCtl
);

//nft token allowance
router.post(
  "/post-allowance",
  validatorErrorChecker,
  htdController.approveallCtl
);

//nft token transfer
router.post("/post-transfer", validatorErrorChecker, htdController.transferCtl);

// nft tokenlist

// nft token detail

module.exports = router;
