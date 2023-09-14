// import iCal from "ical-generator"
const { ICalCalendar, ICalAlarmType } = require("ical-generator")

const calendar = new ICalCalendar({ name: "My Calendar" })

// from: 2023-08-15T13:00:00.000Z
//  to : 2023-08-15T14:00:00.000Z
calendar.createEvent({
  start: new Date(2023, 7, 15, 15, 0, 0),
  end: new Date(2023, 7, 15, 16, 0, 0),
  summary: "My First Event",
  description: "Hello, world!",
})

// from: 2023-08-21T13:00:00.000Z
//  to : 2023-08-21T14:00:00.000Z
const event2 = calendar.createEvent({
  start: new Date(2023, 7, 24, 15, 0, 0),
  end: new Date(2023, 7, 24, 16, 0, 0),
  summary: "My Second Event",
  description: "Hello, world!",
})

const alarm = event2.createAlarm({
  type: ICalAlarmType.display,
  trigger: 1800,
})

// save as file
calendar.saveSync("./cal2.ics")
