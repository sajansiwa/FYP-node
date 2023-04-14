import express from "express";
const bodyParser = require("body-parser");
import cookieParser from "cookie-parser";
import cors from "cors";
import http from "http";
//routes import
import { SignUp } from "./routes/auth/SignupRoute";
import { loginRoute } from "./routes/auth/LoginRoute";
import { geoRoute } from "./routes/locationRoute";
import { update } from "./routes/updateDetailsRoute";
import { logout } from "./routes/logOutRoutes";
import { uploadPPRoute } from "./routes/uploadPPRoutes";
import { getCoRoutes } from "./routes/hospCoorRoutes";
import { notiRoute } from "./routes/notiRoute";
import { vsRoute } from "./routes/visitedPRoute";
import path from "path";

// import http

const app = express();
const server = http.createServer(app);

app.use(cors());
app.use(cookieParser());
// app.use("/", express.static("profilePictures/"));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

SignUp(app);
loginRoute(app);
geoRoute(app);
update(app);
logout(app);
uploadPPRoute(app);
getCoRoutes(app);
notiRoute(app);
vsRoute(app);

app.use(express.static(path.join(__dirname, "./profilePictures")));

const port = process.env.PORT || 9000;

app.listen(port, () => console.log(`listening on port ${port}...`));
