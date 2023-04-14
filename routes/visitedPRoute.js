import {
  incoming,
  incomingHospital,
  markAsCompleted,
} from "../controller/incoming_hospital";
import { visitedUsers } from "../controller/visited";

export const vsRoute = (app) => {
  app.post("/api/visitedHosp", visitedUsers);
  app.post("/api/incoming", incomingHospital);
  app.get("/api/get-visited", incoming);
  app.post("/api/markAsComplete", markAsCompleted);
};
