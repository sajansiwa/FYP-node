import express from "express";
const bodyParser = require("body-parser");
import cookieParser from "cookie-parser";
import cors from "cors";
import http from "http";
import { Server } from "socket.io";
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

// import http


const app = express();
const server = http.createServer(app)
export const io = new Server(server);

io.on("connection", (socket) => {
  console.log("A user connected");

  // Listen for incoming data from the React app
  socket.on("data", (data) => {
    console.log(`Received data: ${data}`);

    // Send a notification to the React app
    socket.emit("notification", "New data received");
  });

  // Handle disconnections
  socket.on("disconnect", () => {
    console.log("A user disconnected");
  });
});


app.use(cors());
app.use(cookieParser());
app.use("/", express.static("profilePictures/"));
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

const port = process.env.PORT || 9000;

app.listen(port, () => console.log(`listening on port ${port}...`));
