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
const exceljs_1 = __importDefault(require("exceljs"));
const date_fns_1 = require("date-fns");
const data_json_1 = __importDefault(require("./data.json"));
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
function readExcelFile() {
    return __awaiter(this, void 0, void 0, function* () {
        const data = generateData();
        const workbook = new exceljs_1.default.Workbook();
        yield workbook.xlsx.readFile("data3.xlsx");
        const worksheet = workbook.getWorksheet(workbook.worksheets[0].name);
        const detailPosition = { r: 0, c: 0 };
        const detailKeys = [];
        // write regular data
        worksheet.eachRow((row, rowNumber) => {
            row.eachCell((cell, colNumber) => {
                if (typeof cell.value === "string") {
                    if (cell.value.startsWith("$$")) {
                        if (cell.value.startsWith("$$detail-")) {
                            detailKeys.push(cell.value.replace("$$detail-", ""));
                            if (detailPosition.r === 0) {
                                detailPosition.r = rowNumber;
                                detailPosition.c = colNumber;
                            }
                            return;
                        }
                        const key = cell.value.replace("$$", "");
                        if (key in data) {
                            cell.value = data[key].toString();
                        }
                    }
                }
            });
        });
        // write orderDetails
        const totalRows = data.orderDetails.length;
        // make room for orderDetails
        worksheet.duplicateRow(detailPosition.r, totalRows - 1, true);
        // write orderDetails
        data.orderDetails.forEach((orderDetail, index) => {
            //gen the row data with key
            const rowData = detailKeys.map((key) => {
                if (key === "orderSeq") {
                    return index + 1;
                }
                return orderDetail[key];
            });
            const rowNumber = detailPosition.r + index;
            const row = worksheet.getRow(rowNumber);
            // row.values = ["", ...rowData] as CellValue[]
            // replace one by one
            row.eachCell((cell, colNumber) => {
                console.log(1 + detailPosition.c);
                cell.value = rowData[colNumber - detailPosition.c];
            });
        });
        yield workbook.xlsx.writeFile("data3-new.xlsx");
    });
}
readExcelFile();
