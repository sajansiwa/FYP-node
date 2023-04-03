
import { visitedUsers } from "../controller/visited"

export const vsRoute = (app) => {
    app.post("/api/visitedHosp", visitedUsers);
}