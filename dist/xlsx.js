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
const data_json_1 = __importDefault(require("./data.json"));
function createXLSX() {
    return __awaiter(this, void 0, void 0, function* () {
        const wb = xlsx_1.default.utils.book_new();
        const orderInfoSheet = xlsx_1.default.utils.json_to_sheet([
            {
                printDate: new Date(),
                orderNo: data_json_1.default.transNo,
                orderStatus: data_json_1.default.isStatus,
                agent: data_json_1.default.saleAgent,
                toShipDate: data_json_1.default.possibleDate,
                orderDate: data_json_1.default.tranDate,
                orderTotal: data_json_1.default.total,
                purchaserName: data_json_1.default.memberInfo.memberName,
                purchaserPhone: data_json_1.default.phone,
                receiverName: data_json_1.default.orderShipInfo.receiveMan,
                receiverPhone: data_json_1.default.orderShipInfo.receivePhone,
                receiverAddress: data_json_1.default.orderShipInfo.residenceAddressZip +
                    data_json_1.default.orderShipInfo.residenceAddressCounty +
                    data_json_1.default.orderShipInfo.residenceAddressCity +
                    data_json_1.default.orderShipInfo.residenceAddressStreet,
                description: data_json_1.default.description,
            },
        ]);
        xlsx_1.default.utils.book_append_sheet(wb, orderInfoSheet, "OrderInfo");
        const orderDetailsSheet = xlsx_1.default.utils.json_to_sheet(data_json_1.default.customerOrdersDetails);
        xlsx_1.default.utils.book_append_sheet(wb, orderDetailsSheet, "OrderDetails");
        const orderShip = xlsx_1.default.utils.json_to_sheet([data_json_1.default.customerOrderShip]);
        xlsx_1.default.utils.book_append_sheet(wb, orderShip, "OrderShip");
        xlsx_1.default.writeFile(wb, "data.xlsx");
    });
}
createXLSX();
