const express = require("express")
const crypto = require("crypto")

const app = express()
const port = 3000

app.use(express.json())

app.get("/", (req, res) => {
  res.send("Hello World!")
})

app.post("/", (req, res) => {
  console.log("??")
  console.log(req.headers)

  const timestamp = req.headers["x-bonsale-webhook-timestamp"]

  let fromLocalClientBase64 = crypto.createHmac("sha256", "somethingsecret").update(timestamp).digest("base64")

  // console.log("str: ", fromLocalClientBase64)

  // console.log("isSame", fromLocalClientBase64 === req.headers["x-bonsale-webhook-signature"])

  console.log("body", req.body)

  res.json({ message: "OK" })
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})

app.on("error", (err) => {
  console.error("err", err)
})
