import XLSX from "xlsx"
import { format } from "date-fns"

import DATA from "./data.json"

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
    printDate: format(new Date(), "yyyy-MM-dd"),
    salesAgentName: DATA.saleAgentInfo.realName,
    transNo: DATA.transNo,
    orderStatus: DATA.isStatus,
    shipDate: DATA.possibleDate,
    consignmentNo: DATA.customerOrderShip.consignmentNo,
    orderDate: DATA.tranDate,
    purchaserName: DATA.memberInfo.memberName,
    purchaserPhone: DATA.phone,
    receiverName: DATA.customerOrderShip.receiveMan,
    receiverPhone: DATA.customerOrderShip.receivePhone,
    receiverAddress:
      DATA.orderShipInfo.residenceAddressZip +
      DATA.orderShipInfo.residenceAddressCounty +
      DATA.orderShipInfo.residenceAddressCity +
      DATA.orderShipInfo.residenceAddressStreet,
    // invoiceNo: data.sales.invoiceNo,
    // invoiceDate: data.sales.invoiceDate,
    shipMethod: DATA.customerOrderShip.transportUnitId, //TODO
    total: DATA.total,
    description: DATA.description,

    // orderDetails
    orderDetails: DATA.customerOrdersDetails,
  }
}

async function main() {
  // generate data
  const data = generateData()

  // read file
  const workbook = XLSX.readFile("data3.xlsx")
  const sheetName = workbook.SheetNames[0]
  const sheet = workbook.Sheets[sheetName]

  const detailPosition = { r: 0, c: 0 }
  const detailKeys: string[] = []

  // deal with regular cell
  const range = XLSX.utils.decode_range(sheet["!ref"]!)
  for (let row = range.s.r; row <= range.e.r; row++) {
    for (let col = range.s.c; col <= range.e.c; col++) {
      const cellAddress = XLSX.utils.encode_cell({ r: row, c: col })
      const cell = sheet[cellAddress]

      // log the H2
      if (cellAddress === "I2") {
        console.log(cell)
      }

      if (cell && cell.v.startsWith("$$")) {
        if (cell.v.startsWith("$$detail-")) {
          detailKeys.push(cell.v.replace("$$detail-", ""))
          detailPosition.r = row
          detailPosition.c = col
          continue
        }
        const key = cell.v.replace("$$", "")
        if (key in data) {
          cell.v = data[key as keyof typeof data]
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

  XLSX.writeFile(workbook, "data3-new.xlsx")
}

main()
  .then(() => {})
  .catch((err) => console.log(err))
