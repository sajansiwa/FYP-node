import { getAllHosp, nearestHosp } from "../controller/nearest";

export const geoRoute = (app) => {
  app.post("/api/get-nearest", nearestHosp);
  app.get("/api/get-all-hospital", getAllHosp);
};
