const { EntityIdHelper } = require("@hashgraph/sdk");
const crypto = require("crypto");
const dataSet = require(`../metadata/dataSet`);

function isNull(data, replace) {
    return data === undefined || data === '' ? replace : data;
}

function isEmptyObject(value) {
    return value && typeof value === 'object' && Object.keys(value).length === 0;
}

function isEmptyArray(value) {
    return Array.isArray(value) && value.length === 0;
}

function convertEvm(address) {
    let evmAddress = address;
    if (!address.startsWith('0x')){
        const { shard, realm, num } = EntityIdHelper.fromString(address);
        let evm_address = EntityIdHelper.toSolidityAddress([shard, realm, num])
        evmAddress = `0x${evm_address}`;
    }
    return evmAddress;
}

function convertHts(address) {
    return (EntityIdHelper.fromSolidityAddress(address));
}

function getDateFull() {
    let date = new Date();

    let yyyy = date.getFullYear().toString();
    let MM = pad(date.getMonth() + 1, 2);
    let dd = pad(date.getDate(), 2);
    let hh = pad(date.getHours(), 2);
    let mm = pad(date.getMinutes(), 2);
    let ss = pad(date.getSeconds(), 2);

    return yyyy + MM + dd + hh + mm + ss;
}

function genDateFull(time, timezoneOffset) {
  let date = new Date(time);

  if (timezoneOffset) {
    date.setTime(date.getTime() + timezoneOffset * 60 * 1000);
  }

  let yyyy = date.getFullYear().toString();
  let MM = pad(date.getMonth() + 1, 2);
  let dd = pad(date.getDate(), 2);
  let hh = pad(date.getHours(), 2);
  let mm = pad(date.getMinutes(), 2);
  let ss = pad(date.getSeconds(), 2);

  return `${yyyy}-${MM}-${dd} ${hh}:${mm}:${ss}`;
}

function pad(number, length) {
    let str = '' + number;
    while (str.length < length) {
        str = '0' + str;
    }
    return str;
}

function encryptAES128(plainText, key, iv) {
    const cipher = crypto.createCipheriv(dataSet.PLAINTEXT, key, iv);
    let encrypted = cipher.update(plainText, 'utf8', 'base64');
    encrypted += cipher.final('base64');
    return encrypted;
}

function decryptAES128(encText, key, iv) {
    const decipher = crypto.createDecipheriv(dataSet.PLAINTEXT, key, iv);
    let decrypted = decipher.update(encText, 'base64');
    decrypted += decipher.final();
    return decrypted;
}

function generateHmac(key, payload) {
    return crypto.createHmac('sha256', key).update(payload).digest('base64');
}

function generateAuchCode() {
    return Math.random().toString(36).substring(2, 8);
}

function mergeObject(obj1, obj2) {
    const merged = {};

    const keys = new Set([...Object.keys(obj1), ...Object.keys(obj2)]);

    keys.forEach(key => {
        const values1 = obj1[key] || [];
        const values2 = obj2[key] || [];
        const mergedValues = Array.from(new Set([...values1, ...values2]));
        merged[key] = mergedValues;
    });

    return merged;
}

module.exports = {
    isNull,
    isEmptyObject,
    isEmptyArray,
    convertEvm,
    convertHts,
    getDateFull,
    genDateFull,
    encryptAES128,
    decryptAES128,
    generateHmac,
    generateAuchCode,
    mergeObject,
};