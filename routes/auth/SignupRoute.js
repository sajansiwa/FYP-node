import { SignUpUser } from "../../controller/signUpUser";

export const SignUp = (app) => {
    app.post("/api/signup", SignUpUser);
}