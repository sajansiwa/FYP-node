import {
  SignUpUser,
  changePassword,
  saveCoords,
  sendConfirmPassword,
  verifyUser,
} from "../../controller/signUpUser";

export const SignUp = (app) => {
  app.post("/api/signup", SignUpUser);
  app.post("/api/verify", verifyUser);
  app.post("/api/passwordreset", sendConfirmPassword);
  app.post("/api/reset", changePassword);
};
