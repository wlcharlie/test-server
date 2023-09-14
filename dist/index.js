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
const express_1 = __importDefault(require("express"));
const storage_1 = require("@google-cloud/storage");
const multer_1 = __importDefault(require("multer"));
const path_1 = __importDefault(require("path"));
const wrapAsyncMiddleware_1 = __importDefault(require("./utils/wrapAsyncMiddleware"));
const port = 3000;
const projectId = "drvet-server-sysstore-bonvies";
const storage = multer_1.default.diskStorage({
    destination: (req, file, cb) => cb(null, "uploads/"),
    filename: (req, file, cb) => {
        let extname = path_1.default.extname(file.originalname);
        file.originalname = path_1.default.basename(Buffer.from(file.originalname, "latin1").toString("utf8"), extname);
        const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
        const filename = file.fieldname + "-" + uniqueSuffix + extname;
        return cb(null, filename);
    },
});
const upload = (0, multer_1.default)({ storage });
const app = (0, express_1.default)();
app.use(express_1.default.json());
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
app.get("/", (0, wrapAsyncMiddleware_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const storage = new storage_1.Storage({
        projectId,
    });
    const [buckets] = yield storage.getBuckets();
    console.log("Buckets:");
    let list = "";
    for (const bucket of buckets) {
        list += `<li>${bucket.name}</li>`;
        console.log(`- ${bucket.name}`);
    }
    res.send(`<form action="/upload" method="POST" enctype="multipart/form-data">
    <input type="file" name="theFile" />
    <input type="submit" value="Upload" />
    </form>`);
})));
app.post("/upload", upload.single("theFile"), (req, res) => {
    console.log(req.file);
    res.send("ok");
});
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
    console.log(`Example app listening on port ${port}`);
});
app.on("error", (err) => {
    console.error("err", err);
});
