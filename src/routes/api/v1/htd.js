const express = require("express");
const router = express.Router();

const htdController = require(`../../../controllers/htd-controller`);
const { validatorErrorChecker } = require(`../../../middlewares/validator`);

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

//registerToiletOwnCtl
router.post(
  "/register-toilet-own",
  validatorErrorChecker,
  htdController.registerToiletOwnCtl
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

//toilet master init
router.post(
  "/toilet-master-init",
  validatorErrorChecker,
  htdController.toiletMasterInitCtl
);

//ft token transfer
router.post(
  "/post-ft-transfer",
  validatorErrorChecker,
  htdController.ftTransferCtl
);

//nft token transfer
router.post(
  "/post-nft-transfer",
  validatorErrorChecker,
  htdController.nftTransferCtl
);

// nft tokenlist
//getNftAllCtl
router.get("/get-nft-all", validatorErrorChecker, htdController.getNftAllCtl);

// nft token detail

module.exports = router;
