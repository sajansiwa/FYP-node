import {
  loginUser,
  updateUserProfile,
  userProfile,
} from "../../controller/login";

export const loginRoute = (app) => {
  app.post("/api/Login", loginUser);
  app.get("/api/user", userProfile);
  app.post("/api/updateUser", updateUserProfile);
};
