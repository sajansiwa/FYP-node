import { authenticateToken } from "../controller/middleware/tokenAuth"
import { uploadPP } from "../controller/uploadProfilePicture"
// import { upload } from "./updateDetailsRoute"
import multer from "multer";
import fs from "node:fs";
import { constants } from "node:buffer";

const _storage = multer.diskStorage({
  destination: (req, file, cb) => {
    var dir = "./profilePictures/";
    if (!fs.access(dir, constants.F_OK, (err) => {})) {
      fs.mkdir(dir, { recursive: true }, (err) => {});
    }

    cb(null, dir);
  },
  filename: (req, file, cb) => {
    cb(null, req.params.id + "_" + file.originalname);
  },
});

export const upload = multer({ storage: _storage });


export const uploadPPRoute = (app) => {
    app.post("/api/upload-pp/:id",upload.single('file'), authenticateToken,uploadPP)
}