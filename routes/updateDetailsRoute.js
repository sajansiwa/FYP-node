import { changeName } from "../controller/updateName";
import { changeAdd } from "../controller/changeAddress";
import { authenticateToken } from "../controller/middleware/tokenAuth";
import { changeNum } from "../controller/changeNumber";
import { changePass } from "../controller/changePasword";
import { changePP } from "../controller/changeProfilePicture";
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


export const  update = (app) => {
    app.put("/userDetails/api/update-name",authenticateToken, changeName);
    app.put("/userDetails/api/update-address", authenticateToken, changeAdd);
    app.put("/userDetails/api/update-number", authenticateToken, changeNum);
    app.put("/userDetails/api/update-password", authenticateToken, changePass);
    app.post("/userDetails/api/update-profile-picture/:id", upload.single('file'), authenticateToken, changePP);
}



