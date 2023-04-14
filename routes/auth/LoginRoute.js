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
    cb(null, new Date().getMilliseconds() + "_" + file.originalname);
  },
});
import {
  loginUser,
  updateProfilePic,
  updateUserProfile,
  userProfile,
} from "../../controller/login";
export const upload = multer({ storage: _storage });

export const loginRoute = (app) => {
  app.post("/api/Login", loginUser);
  app.get("/api/user", userProfile);
  app.post("/api/updateUser", updateUserProfile);
  app.post("/api/updateProfilePic", upload.single("file"), updateProfilePic);
};
