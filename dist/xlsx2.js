"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const xlsx_1 = __importDefault(require("xlsx"));
const date_fns_1 = require("date-fns");
const data_json_1 = __importDefault(require("./data.json"));
/**
 * printDate
 * salesAgentName
 * transNo
 * orderStatus
 * salesAgentName
 * shipDate
 * consignmentNo
 * orderDate
 * purchaserName
 * purchaserPhone
 * receiverName
 * receiverPhone
 * receiverAddress
 * invoiceNo
 * invoiceDate
 * shipMethod
 * total
 * description
 */
function generateData() {
    return {
        printDate: (0, date_fns_1.format)(new Date(), "yyyy-MM-dd"),
        salesAgentName: data_json_1.default.saleAgentInfo.realName,
        transNo: data_json_1.default.transNo,
        orderStatus: data_json_1.default.isStatus,
        shipDate: data_json_1.default.possibleDate,
        consignmentNo: data_json_1.default.customerOrderShip.consignmentNo,
        orderDate: data_json_1.default.tranDate,
        purchaserName: data_json_1.default.memberInfo.memberName,
        purchaserPhone: data_json_1.default.phone,
        receiverName: data_json_1.default.customerOrderShip.receiveMan,
        receiverPhone: data_json_1.default.customerOrderShip.receivePhone,
        receiverAddress: data_json_1.default.orderShipInfo.residenceAddressZip +
            data_json_1.default.orderShipInfo.residenceAddressCounty +
            data_json_1.default.orderShipInfo.residenceAddressCity +
            data_json_1.default.orderShipInfo.residenceAddressStreet,
        // invoiceNo: data.sales.invoiceNo,
        // invoiceDate: data.sales.invoiceDate,
        shipMethod: data_json_1.default.customerOrderShip.transportUnitId,
        total: data_json_1.default.total,
        description: data_json_1.default.description,
        // orderDetails
        orderDetails: data_json_1.default.customerOrdersDetails,
    };
}
function main() {
    return __awaiter(this, void 0, void 0, function* () {
        // generate data
        const data = generateData();
        // read file
        const workbook = xlsx_1.default.readFile("data3.xlsx");
        const sheetName = workbook.SheetNames[0];
        const sheet = workbook.Sheets[sheetName];
        const detailPosition = { r: 0, c: 0 };
        const detailKeys = [];
        // deal with regular cell
        const range = xlsx_1.default.utils.decode_range(sheet["!ref"]);
        for (let row = range.s.r; row <= range.e.r; row++) {
            for (let col = range.s.c; col <= range.e.c; col++) {
                const cellAddress = xlsx_1.default.utils.encode_cell({ r: row, c: col });
                const cell = sheet[cellAddress];
                // log the H2
                if (cellAddress === "I2") {
                    console.log(cell);
                }
                if (cell && cell.v.startsWith("$$")) {
                    if (cell.v.startsWith("$$detail-")) {
                        detailKeys.push(cell.v.replace("$$detail-", ""));
                        detailPosition.r = row;
                        detailPosition.c = col;
                        continue;
                    }
                    const key = cell.v.replace("$$", "");
                    if (key in data) {
                        cell.v = data[key];
                    }
                }
            }
        }
        // deal with list cell
        // if detailPosition.r or detailPosition.c is > 0, means need to loop detail section
        // if (detailPosition.r > 0 && detailPosition.c > 0 && detailKeys.length > 0) {
        //   // replace the value
        //   const rowIndex = data.orderDetails.length
        //   for (let row = range.e.r; row >= rowIndex; row--) {
        //     for (let col = range.s.c; col <= range.e.c; col++) {
        //       const cellAddress = XLSX.utils.encode_cell({ r: row, c: col })
        //       const newCellAddress = XLSX.utils.encode_cell({ r: row + 1, c: col })
        //       sheet[newCellAddress] = sheet[cellAddress]
        //       delete sheet[cellAddress]
        //     }
        //   }
        // }
        xlsx_1.default.writeFile(workbook, "data3-new.xlsx");
    });
}
main()
    .then(() => { })
    .catch((err) => console.log(err));
