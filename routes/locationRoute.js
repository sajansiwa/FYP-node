import { nearestHosp } from "../controller/nearest";

export const geoRoute = (app) => {
    app.post("/api/get-nearest", nearestHosp);
}