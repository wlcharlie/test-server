import ExcelJS, { CellValue } from "exceljs"
import { format } from "date-fns"
import DATA from "./data.json"
import { de } from "date-fns/locale"

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

async function readExcelFile() {
  const data = generateData()

  const workbook = new ExcelJS.Workbook()
  await workbook.xlsx.readFile("data3.xlsx")

  const worksheet = workbook.getWorksheet(workbook.worksheets[0].name)

  const detailPosition = { r: 0, c: 0 }
  const detailKeys: string[] = []

  // write regular data

  worksheet.eachRow((row, rowNumber) => {
    row.eachCell((cell, colNumber) => {
      if (typeof cell.value === "string") {
        if (cell.value.startsWith("$$")) {
          if (cell.value.startsWith("$$detail-")) {
            detailKeys.push(cell.value.replace("$$detail-", ""))
            if (detailPosition.r === 0) {
              detailPosition.r = rowNumber
              detailPosition.c = colNumber
            }

            return
          }

          const key = cell.value.replace("$$", "")
          if (key in data) {
            cell.value = data[key as keyof typeof data].toString()
          }
        }
      }
    })
  })

  // write orderDetails
  const totalRows = data.orderDetails.length
  // make room for orderDetails
  worksheet.duplicateRow(detailPosition.r, totalRows - 1, true)
  // write orderDetails
  data.orderDetails.forEach((orderDetail, index) => {
    //gen the row data with key
    const rowData = detailKeys.map((key) => {
      if (key === "orderSeq") {
        return index + 1
      }
      return orderDetail[key as keyof typeof orderDetail]
    })

    const rowNumber = detailPosition.r + index
    const row = worksheet.getRow(rowNumber)
    // row.values = ["", ...rowData] as CellValue[]
    // replace one by one
    row.eachCell((cell, colNumber) => {
      console.log(1 + detailPosition.c)
      cell.value = rowData[colNumber - detailPosition.c] as CellValue
    })
  })

  await workbook.xlsx.writeFile("data3-new.xlsx")
}

readExcelFile()
