const SerialPort = require("serialport");
const { Buffer } = require("buffer");

// const port = new SerialPort("/dev/ttyUSB0", { baudRate: 9600 });

const calculateCRC = (data) => {
  var crc = 0xffff;
  var polynomial = 0x1021;
  for (var i = 0; i < data.length; i++) {
    crc ^= data[i] << 8;
    for (var j = 0; j < 8; j++) {
      if ((crc & 0x8000) !== 0) {
        crc = (crc << 1) ^ polynomial;
      } else {
        crc <<= 1;
      }
    }
  }
  return [crc & 0xff, (crc >> 8) & 0xff];
};

const data = Buffer.from([
  0xc3, 0x3c, 0x01, 0x21, 0x05, 0x00, 0x04, 0xdb, 0x0f,
]);
const DLE = 0xc3;
const SOH = 0x3c;
const ID = 0x01;
const CMD = 0x21;
const DL1 = 0x00;
const DL2 = 0x00;
const dataWithoutCRC = data.slice(2, data.length - 2);
const [CRC1, CRC2] = calculateCRC(dataWithoutCRC);

const rapierData = Buffer.concat([
  Buffer.from([DLE, SOH, ID, CMD, DL1, DL2]),
  dataWithoutCRC,
  Buffer.from([CRC1, CRC2]),
]);

console.log(rapierData, data.length);

const checkProtocol = (data) => {
  if (data[0] == 0xc3) {
    if (data[1] == 0x3c) {
      if (data[2] == 0x01) {
        if (data[3] == 0x21) {
          let dataLength = data[4];
          console.log(toString(dataLength, 16));
        }
      }
    }
  }
};

checkProtocol(data);
