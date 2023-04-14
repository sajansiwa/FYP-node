import { updateUserPassword } from "../../controller/login";
import {
  SignUpUser,
  changePassword,
  saveCoords,
  sendConfirmPassword,
  verifyUser,
} from "../../controller/signUpUser";
import { updatePassword } from "../../database/queries";

export const SignUp = (app) => {
  app.post("/api/signup", SignUpUser);
  app.post("/api/verify", verifyUser);
  app.post("/api/passwordreset", sendConfirmPassword);
  app.post("/api/reset", changePassword);
  app.post("/api/updatePassword", updateUserPassword);
};
