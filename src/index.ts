import express, { Request, Response } from "express"
import { Storage } from "@google-cloud/storage"
import multer from "multer"
import path from "path"
import wrapAsyncMiddleware from "./utils/wrapAsyncMiddleware"

const port = 3000
const projectId = "drvet-server-sysstore-bonvies"
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/"),
  filename: (req, file, cb) => {
    let extname = path.extname(file.originalname)
    file.originalname = path.basename(Buffer.from(file.originalname, "latin1").toString("utf8"), extname)
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9)
    const filename = file.fieldname + "-" + uniqueSuffix + extname
    return cb(null, filename)
  },
})
const upload = multer({ storage })

const app = express()

app.use(express.json())
// app.use(
//   wrapAsyncMiddleware(async (req, res, next) => {
//     const storage = new Storage({
//       projectId,
//     })
//     const [buckets] = await storage.getBuckets()
//     console.log("Buckets:")

//     for (const bucket of buckets) {
//       console.log(`- ${bucket.name}`)
//     }

//     console.log("Listed all storage buckets.")
//     next()
//   })
// )

app.get(
  "/",
  wrapAsyncMiddleware(async (req, res) => {
    const storage = new Storage({
      projectId,
    })
    const [buckets] = await storage.getBuckets()
    console.log("Buckets:")
    let list = ""
    for (const bucket of buckets) {
      list += `<li>${bucket.name}</li>`
      console.log(`- ${bucket.name}`)
    }

    res.send(`<form action="/upload" method="POST" enctype="multipart/form-data">
    <input type="file" name="theFile" />
    <input type="submit" value="Upload" />
    </form>`)
  })
)

app.post("/upload", upload.single("theFile"), (req, res) => {
  console.log(req.file)
  res.send("ok")
})

// ics
// app.get("/test", (req, res) => {
//   console.log("TEST")
//   const downloadPath = Path.join(__dirname, "../cal2.ics")
//   console.log(downloadPath)

//   res.set({
//     "Content-Type": "text/calendar",
//     "Content-Disposition": "attachment; filename=cal2.ics",
//   })

//   res.download(downloadPath)
// })

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})

app.on("error", (err) => {
  console.error("err", err)
})
