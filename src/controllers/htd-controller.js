const { StatusCodes } = require("http-status-codes");
const response = require(`../middlewares/response`);
const { logger } = require(`../middlewares/winston`);
const htdService = require(`../services/htd`);

const postContractCtl = async (req, res, next) => {
  try {
    let result = await htdService.postContractService(req);
    console.log("result", result);
    return res
      .status(StatusCodes.OK)
      .json(response.Success("page_info", result));
  } catch (e) {
    console.error(e);
    logger.error("testApi error");
    return res.status(StatusCodes.BAD_REQUEST).json(response.CustomError(e));
  }
};

const getContractCtl = async (req, res, next) => {
  try {
    let result = await htdService.getContractService(req);
    console.log("result", result);
    return res
      .status(StatusCodes.OK)
      .json(response.Success("page_info", result));
  } catch (e) {
    console.error(e);
    logger.error("testApi error");
    return res.status(StatusCodes.BAD_REQUEST).json(response.CustomError(e));
  }
};

const registerToiletCtl = async (req, res, next) => {
  try {
    let result = await htdService.registerToiletService(req);
    console.log("result", result);
    return res
      .status(StatusCodes.OK)
      .json(response.Success("page_info", result));
  } catch (e) {
    console.error(e);
    logger.error("testApi error");
    return res.status(StatusCodes.BAD_REQUEST).json(response.CustomError(e));
  }
};

const registerToiletOwnCtl = async (req, res, next) => {
  try {
    let result = await htdService.registerToiletServiceOwn(req);
    console.log("result", result);
    return res
      .status(StatusCodes.OK)
      .json(response.Success("page_info", result));
  } catch (e) {
    console.error(e);
    logger.error("testApi error");
    return res.status(StatusCodes.BAD_REQUEST).json(response.CustomError(e));
  }
};

const associateCtl = async (req, res, next) => {
  try {
    let result = await htdService.associateService(req);
    console.log("result", result);
    return res
      .status(StatusCodes.OK)
      .json(response.Success("page_info", result));
  } catch (e) {
    console.error(e);
    logger.error("testApi error");
    return res.status(StatusCodes.BAD_REQUEST).json(response.CustomError(e));
  }
};

const approveallCtl = async (req, res, next) => {
  try {
    let result = await htdService.approveAllService(req);
    console.log("result", result);
    return res
      .status(StatusCodes.OK)
      .json(response.Success("page_info", result));
  } catch (e) {
    console.error(e);
    logger.error("testApi error");
    return res.status(StatusCodes.BAD_REQUEST).json(response.CustomError(e));
  }
};

const ftTransferCtl = async (req, res, next) => {
  try {
    let result = await htdService.ftTransferService(req);
    console.log("result", result);
    return res
      .status(StatusCodes.OK)
      .json(response.Success("page_info", result));
  } catch (e) {
    console.error(e);
    logger.error("testApi error");
    return res.status(StatusCodes.BAD_REQUEST).json(response.CustomError(e));
  }
};
const nftTransferCtl = async (req, res, next) => {
  try {
    let result = await htdService.nftTransferService(req);
    console.log("result", result);
    return res
      .status(StatusCodes.OK)
      .json(response.Success("page_info", result));
  } catch (e) {
    console.error(e);
    logger.error("testApi error");
    return res.status(StatusCodes.BAD_REQUEST).json(response.CustomError(e));
  }
};

const toiletMasterInitCtl = async (req, res, next) => {
  try {
    let result = await htdService.toiletMasterInitService(req);
    console.log("result", result);
    return res
      .status(StatusCodes.OK)
      .json(response.Success("page_info", result));
  } catch (e) {
    console.error(e);
    logger.error("testApi error");
    return res.status(StatusCodes.BAD_REQUEST).json(response.CustomError(e));
  }
};

module.exports = {
  postContractCtl,
  getContractCtl,
  registerToiletCtl,
  associateCtl,
  approveallCtl,
  ftTransferCtl,
  toiletMasterInitCtl,
  nftTransferCtl,
  registerToiletOwnCtl,
};
