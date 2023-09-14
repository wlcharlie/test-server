import XLSX from "xlsx"
import data from "./data.json"

async function createXLSX() {
  const wb = XLSX.utils.book_new()
  const orderInfoSheet = XLSX.utils.json_to_sheet([
    {
      printDate: new Date(),
      orderNo: data.transNo,
      orderStatus: data.isStatus,
      agent: data.saleAgent,
      toShipDate: data.possibleDate,
      orderDate: data.tranDate,
      orderTotal: data.total,
      purchaserName: data.memberInfo.memberName,
      purchaserPhone: data.phone,
      receiverName: data.orderShipInfo.receiveMan,
      receiverPhone: data.orderShipInfo.receivePhone,
      receiverAddress:
        data.orderShipInfo.residenceAddressZip +
        data.orderShipInfo.residenceAddressCounty +
        data.orderShipInfo.residenceAddressCity +
        data.orderShipInfo.residenceAddressStreet,
      description: data.description,
    },
  ])
  XLSX.utils.book_append_sheet(wb, orderInfoSheet, "OrderInfo")

  const orderDetailsSheet = XLSX.utils.json_to_sheet(data.customerOrdersDetails)
  XLSX.utils.book_append_sheet(wb, orderDetailsSheet, "OrderDetails")

  const orderShip = XLSX.utils.json_to_sheet([data.customerOrderShip])
  XLSX.utils.book_append_sheet(wb, orderShip, "OrderShip")

  XLSX.writeFile(wb, "data.xlsx")
}

createXLSX()
