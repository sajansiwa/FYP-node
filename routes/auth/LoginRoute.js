import { loginUser } from "../../controller/login";


export const loginRoute = (app) => {
  app.post("/api/Login", loginUser);
};
