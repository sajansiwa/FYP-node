import { noti } from "../controller/notification"

export const notiRoute = (app) => {
    app.post('/api/notification', noti)
}