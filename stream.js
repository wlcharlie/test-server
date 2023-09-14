const fs = require("fs")
const Stream = require("stream")

async function logChunks(readable) {
  for await (const chunk of readable) {
    console.log("=====")
    console.log(chunk)
  }
}

const readableStream = new Stream.Readable({ encoding: "utf8" })
readableStream.push("hi!\n")
readableStream.push("ho!\n")
readableStream.push(null) // No more data

logChunks(readableStream)
