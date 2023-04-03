import { hospCoordinates } from "../controller/hospitalLocation"

export const getCoRoutes = (app) => {
 app.post('/api/coordinates', hospCoordinates)
}