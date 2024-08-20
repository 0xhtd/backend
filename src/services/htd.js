console.clear();
const path = require("path");
const { logger } = require(`../middlewares/winston`);
console.clear();
require("dotenv").config();
const fs = require("fs");
const {
  AccountId,
  PrivateKey,
  Client,
  ContractCreateFlow,
  ContractExecuteTransaction,
  ContractFunctionParameters,
  TokenAssociateTransaction,
  TransferTransaction,
} = require("@hashgraph/sdk");

const toHexString = (bytes) => {
  return (
    "0x" +
    bytes.reduce((str, byte) => str + byte.toString(16).padStart(2, "0"), "")
  );
};

async function postContractService(req) {
  try {
    const operatorKey = PrivateKey.fromString(process.env.MY_PRIVATE_KEY);
    const operatorId = AccountId.fromString(process.env.MY_ACCOUNT_ID);
    const client = Client.forTestnet().setOperator(operatorId, operatorKey);

    const bytecodePath = path.join(__dirname, "..", "binaries", "Toilet.bin");
    const bytecode = fs.readFileSync(bytecodePath);

    const createContract = new ContractCreateFlow()
      .setGas(4000000)
      .setBytecode(bytecode);

    const createContractTx = await createContract.execute(client);
    const createContractRx = await createContractTx.getReceipt(client);
    const contractId = createContractRx.contractId;

    const outputFilePath = path.join(
      __dirname,
      "..",
      "contractInfo",
      "contractId.txt"
    );

    if (!fs.existsSync(path.dirname(outputFilePath))) {
      fs.mkdirSync(path.dirname(outputFilePath), { recursive: true });
    }

    fs.writeFileSync(outputFilePath, `${contractId.toString()}`);

    return createContractRx;
  } catch (e) {
    logger.error("testApi error");
    throw e;
  }
}

async function getContractService(req) {
  try {
    const filePath = path.join(
      __dirname,
      "..",
      "contractInfo",
      "contractId.txt"
    );

    if (!fs.existsSync(filePath)) {
      throw new Error(`File not found: ${filePath}`);
    }

    const contractId = fs.readFileSync(filePath, "utf8").trim();

    console.log(`Contract ID retrieved from file: ${contractId}`);

    return contractId;
  } catch (e) {
    console.error("Error reading contract ID from file: ", e.message);
    throw e;
  }
}

async function registerToiletService(req) {
  try {
    const operatorKey = PrivateKey.fromString(process.env.MY_PRIVATE_KEY);
    const operatorId = AccountId.fromString(process.env.MY_ACCOUNT_ID);

    const filePath = path.join(
      __dirname,
      "..",
      "contractInfo",
      "contractId.txt"
    );

    if (!fs.existsSync(filePath)) {
      throw new Error(`File not found: ${filePath}`);
    }

    const contractId = fs.readFileSync(filePath, "utf8").trim();
    console.log("req.body", req.body);

    let name = req.body.name;
    let symbol = req.body.symbol;
    let memo = req.body.memo;
    let maxSupply = req.body.maxSupply;

    const createToken = new ContractExecuteTransaction()
      .setContractId(contractId)
      .setGas(4000000) // Increase if revert
      .setPayableAmount(50) // Increase if revert
      .setFunction(
        "registerToilet",
        new ContractFunctionParameters()
          .addString(name) // NFT name
          .addString(symbol) // NFT symbol
          .addString(memo) // NFT memo
          .addInt64(maxSupply) // NFT max supply
          .addString(
            "ipfs://bafyreie3ichmqul4xa7e6xcy34tylbuq2vf3gnjf7c55trg3b6xyjr4bku/metadata.json"
          )
      );

    result = toHexString(createToken.toBytes());
    return result;
  } catch (e) {
    logger.error("testApi error");
    throw e;
  }
}

async function associateService(req) {
  try {
    const operatorKey = PrivateKey.fromString(process.env.MY_PRIVATE_KEY);
    const operatorId = AccountId.fromString(process.env.MY_ACCOUNT_ID);
    const client = Client.forTestnet().setOperator(operatorId, operatorKey);

    const filePath = path.join(
      __dirname,
      "..",
      "contractInfo",
      "contractId.txt"
    );

    if (!fs.existsSync(filePath)) {
      throw new Error(`File not found: ${filePath}`);
    }

    let change_tokenId = AccountId.fromString(req.body.tokenId);
    let aliceId2 = AccountId.fromString(req.body.accountId);

    const transaction = await new TokenAssociateTransaction()
      .setAccountId(aliceId2)
      .setTokenIds([`${change_tokenId}`])
      .freezeWith(client);

    result = toHexString(transaction.toBytes());

    return result;
  } catch (e) {
    logger.error("testApi error");
    throw e;
  }
}

async function approveAllService(req) {
  try {
    const operatorKey = PrivateKey.fromString(process.env.MY_PRIVATE_KEY);
    const operatorId = AccountId.fromString(process.env.MY_ACCOUNT_ID);
    const client = Client.forTestnet().setOperator(operatorId, operatorKey);

    const filePath = path.join(
      __dirname,
      "..",
      "contractInfo",
      "contractId.txt"
    );

    if (!fs.existsSync(filePath)) {
      throw new Error(`File not found: ${filePath}`);
    }

    const tokenId = AccountId.fromString(req.body.tokenId);
    let aliceId2 = AccountId.fromString(req.body.spenderId);

    const transaction = await new TokenAssociateTransaction()
      .setAccountId(aliceId2)
      .setTokenIds([`${tokenId}`])
      .freezeWith(client);

    result = toHexString(transaction.toBytes());
    return result;
  } catch (e) {
    logger.error("approveAllService error");
    throw e;
  }
}

async function ftTransferService(req) {
  try {
    const operatorKey = PrivateKey.fromString(process.env.MY_PRIVATE_KEY);
    const operatorId = AccountId.fromString(process.env.MY_ACCOUNT_ID);
    const client = Client.forTestnet().setOperator(operatorId, operatorKey);

    const filePath = path.join(
      __dirname,
      "..",
      "contractInfo",
      "contractId.txt"
    );

    if (!fs.existsSync(filePath)) {
      throw new Error(`File not found: ${filePath}`);
    }

    const tokenId = AccountId.fromString(req.body.tokenId);
    const senderId = AccountId.fromString(req.body.senderId);
    const receiverId = AccountId.fromString(req.body.receiverId);
    const amount = req.body.amount;

    const transaction = await new TransferTransaction()
      .addTokenTransfer(tokenId, senderId, amount)
      .addTokenTransfer(tokenId, receiverId, amount)
      .freezeWith(client);

    result = toHexString(transaction.toBytes());
    return result;
  } catch (e) {
    logger.error("approveAllService error");
    throw e;
  }
}

async function nftTransferService(req) {
  try {
    const operatorKey = PrivateKey.fromString(process.env.MY_PRIVATE_KEY);
    const operatorId = AccountId.fromString(process.env.MY_ACCOUNT_ID);
    const client = Client.forTestnet().setOperator(operatorId, operatorKey);

    const filePath = path.join(
      __dirname,
      "..",
      "contractInfo",
      "contractId.txt"
    );

    if (!fs.existsSync(filePath)) {
      throw new Error(`File not found: ${filePath}`);
    }

    const tokenId = AccountId.fromString(req.body.tokenId);
    const senderId = AccountId.fromString(req.body.senderId);
    const receiverId = AccountId.fromString(req.body.receiverId);
    const amount = req.body.amount;

    const transaction = await new TransferTransaction()
      .addTokenTransfer(tokenId, senderId, amount)
      .addTokenTransfer(tokenId, receiverId, amount)
      .freezeWith(client);

    result = toHexString(transaction.toBytes());
    return result;
  } catch (e) {
    logger.error("approveAllService error");
    throw e;
  }
}

//associate
//approveall
//transfer
async function toiletMasterInitService(req) {
  try {
    const operatorKey = PrivateKey.fromString(process.env.MY_PRIVATE_KEY);
    const operatorId = AccountId.fromString(process.env.MY_ACCOUNT_ID);
    const client = Client.forTestnet().setOperator(operatorId, operatorKey);

    const filePath = path.join(
      __dirname,
      "..",
      "contractInfo",
      "contractId.txt"
    );

    if (!fs.existsSync(filePath)) {
      throw new Error(`File not found: ${filePath}`);
    }

    const tokenId = AccountId.fromString(req.body.tokenId);
    const toiletMasterId = AccountId.fromString(req.body.toiletMasterId);
    const receiverId = AccountId.fromString(req.body.receiverId);
    const amount = req.body.amount;

    //associate
    //private key를 어소시에이트하려는 계정이 해야해서 서버의 마스터가 할 수 없음

    //approveall
    //private key를 어소시에이트하려는 계정이 해야해서 서버의 마스터가 할 수 없음

    //nft transfer
    // const transaction = await new TransferTransaction()
    // .addTokenTransfer(tokenId, senderId, amount)
    // .addTokenTransfer(tokenId, receiverId, amount)
    // .freezeWith(client);
    //private key를 어소시에이트하려는 계정이 해야해서 서버의 마스터가 할 수 없음

    result = toHexString(transaction.toBytes());
    return result;
  } catch (e) {
    logger.error("approveAllService error");
    throw e;
  }
}

module.exports = {
  postContractService,
  getContractService,
  registerToiletService,
  associateService,
  approveAllService,
  ftTransferService,
  toiletMasterInitService,
  nftTransferService,
};
