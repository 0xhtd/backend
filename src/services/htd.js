console.clear();
const path = require("path");
const axios = require("axios");
const { logger } = require(`../middlewares/winston`);
require("dotenv").config();
const sync_request = require("sync-request");

const fs = require("fs");
let {
  AccountId,
  PrivateKey,
  Client,
  ContractCreateFlow,
  ContractExecuteTransaction,
  ContractFunctionParameters,
  TokenAssociateTransaction,
  TransferTransaction,
  AccountBalanceQuery,
} = require("@hashgraph/sdk");
const mysql = require("mysql2/promise"); // mysql2의 promise 기반 API 사용

// MySQL 데이터베이스 연결 설정
const dbClient = mysql.createPool({
  host: process.env.HOST || "localhost",
  user: "newuser",
  password: process.env.PASSWORD,
  database: process.env.DATABASE,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

console.log("process.env.USER", process.env.USER);
console.log("process.env.USER", process.env);
async function fetchAndStoreNFTData(tokenId) {
  try {
    console.log("dbClient", dbClient);

    // Hedera Mirror Node API에서 NFT 데이터 가져오기
    const req_url = `https://testnet.mirrornode.hedera.com/api/v1/tokens/${tokenId}/nfts`;

    const response = sync_request("GET", req_url, {});
    console.log("response", response);

    // Buffer를 문자열로 변환하여 JSON 파싱
    const result = JSON.parse(response.getBody().toString());
    console.log("result", result);

    const nftData = result.nfts;

    if (nftData.length === 0) {
      console.log("No NFTs found for the given token ID.");
      return;
    }

    console.log("nftData", nftData);

    for (let nft of nftData) {
      const query = `
        INSERT INTO nfts (account_id, created_timestamp, delegating_spender, deleted, metadata, modified_timestamp, serial_number, spender, token_id)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
      `;

      const values = [
        nft.account_id,
        new Date(Number(nft.created_timestamp) * 1000),
        nft.delegating_spender,
        nft.deleted,
        nft.metadata,
        new Date(Number(nft.modified_timestamp) * 1000),
        nft.serial_number,
        nft.spender,
        nft.token_id,
      ];

      await dbClient.execute(query, values);
      console.log(
        `NFT with Serial Number ${nft.serial_number} inserted into database.`
      );
    }
  } catch (error) {
    console.error("Error fetching or storing NFT data", error);
  }
}

const fromHexString = (hexString) => {
  const target = hexString.replace("0x", "");
  return Uint8Array.from(
    target.match(/.{1,2}/g).map((byte) => parseInt(byte, 16))
  );
};

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

async function getNftAllService(req, res) {
  try {
    console.log("getNftAllService");

    // 데이터베이스에서 nfts 테이블의 모든 데이터 조회
    const [rows] = await dbClient.execute("SELECT * FROM nfts");

    console.log("result", rows);

    // 조회된 데이터를 JSON 형식으로 클라이언트에 반환
    return rows; //res.json(rows);
  } catch (e) {
    logger.error("nft get all error", e);
    throw e;
  }
}

async function registerToiletService(req) {
  try {
    const operatorKey = PrivateKey.fromString(process.env.MY_PRIVATE_KEY);
    const operatorId = AccountId.fromString(process.env.MY_ACCOUNT_ID);
    const client = Client.forTestnet().setOperator(operatorId, operatorKey);

    name = req.body.name;
    symbol = req.body.symbol;
    memo = req.body.memo;
    maxSupply = req.body.maxSupply;
    metadata = req.body.metadata;

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

    const tx = req.body.tx;
    const decodeTx = ContractExecuteTransaction.fromBytes(fromHexString(tx));

    console.log("decodeTx", decodeTx);

    const createTokenTx = await decodeTx.execute(client);
    console.log(`createTokenTx: ${createTokenTx} \n`);

    const createTokenRx = await createTokenTx.getRecord(client);
    console.log(`createTokenRx: ${createTokenRx} \n`);

    const tokenIdSolidityAddr =
      createTokenRx.contractFunctionResult.getAddress(0);
    console.log(`tokenIdSolidityAddr: ${tokenIdSolidityAddr} \n`);

    const tokenId = AccountId.fromSolidityAddress(tokenIdSolidityAddr);
    console.log(`Token created with ID: ${tokenId} \n`);
    result = `Token created with ID: ${tokenId} \n`;

    // console.log("dbClient", dbClient);

    // Hedera Mirror Node API에서 NFT 데이터 가져오기
    const req_url = `https://testnet.mirrornode.hedera.com/api/v1/tokens/${tokenId}/nfts`;

    const response = sync_request("GET", req_url, {});
    console.log("response", response);

    // Buffer를 문자열로 변환하여 JSON 파싱
    const resultStr = JSON.parse(response.getBody().toString());
    console.log("resultStr", resultStr);

    const nftData = resultStr.nfts;

    if (nftData.length === 0) {
      console.log("No NFTs found for the given token ID.");
      return;
    }

    console.log("nftData", nftData);

    //metadata ="https://90435dc40a621a9fa78ca7622125cd00.ipfscdn.io/ipfs/bafybeibcuj2ibcbbzbrjxsodgb2245qsomedigpu647zjrgilojhkifqhy/0/";

    const query = `
          INSERT INTO nfts2 (name, symbol, memo, deleted, maxSupply, metadata, created_at)
          VALUES (?, ?, ?, ?, ?, ?, ?)
        `;

    const values = [
      name,
      symbol,
      memo,
      maxSupply,
      metadata,
      new Date(Number(nft.created_timestamp) * 1000),
    ];

    await dbClient.execute(query, values);
    console.log(
      `NFT with Serial Number ${nft.serial_number} inserted into database.`
    );

    //console.log("result2", result2);

    return result;
  } catch (e) {
    logger.error("testApi error");
    throw e;
  }
}

async function registerToiletServiceOwn(req) {
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

    const createTokenTx = await createToken.execute(client);
    console.log(`createTokenTx: ${createTokenTx} \n`);

    const createTokenRx = await createTokenTx.getRecord(client);
    console.log(`createTokenRx: ${createTokenRx} \n`);

    const tokenIdSolidityAddr =
      createTokenRx.contractFunctionResult.getAddress(0);
    console.log(`tokenIdSolidityAddr: ${tokenIdSolidityAddr} \n`);

    const tokenId = AccountId.fromSolidityAddress(tokenIdSolidityAddr);
    console.log(`Token created with ID: ${tokenId} \n`);

    result = toHexString(createToken.toBytes());
    res = `Token created with ID: ${tokenId} \n`;
    return res;
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

    const contractId = fs.readFileSync(filePath, "utf8").trim();
    console.log(req.body);

    const tokenId = AccountId.fromString(req.body.tokenId);
    const receiverId = AccountId.fromString(req.body.receiverId);

    const tokenTransferTx = await new TransferTransaction()
      .addNftTransfer(tokenId, 1, contractId, receiverId)
      .freezeWith(client)
      .sign(operatorKey);

    const tokenTransferSubmit = await tokenTransferTx.execute(client);
    const tokenTransferRx = await tokenTransferSubmit.getReceipt(client);

    console.log(
      `\nNFT transfer from Treasury to Alice: ${tokenTransferRx.status} \n`
    );
  } catch (e) {
    logger.error("nft transfer error");
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
  registerToiletServiceOwn,
  getNftAllService,
};
