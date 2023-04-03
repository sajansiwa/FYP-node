import database from "../database/databaseConfig"
import { vUsers } from "../database/queries"

export const  visitedUsers = async (req, res) => {
    try {
        const hosp_email = req.body.hosp_email
        const patient_email = req.body.patient_email

        await database.query(vUsers, [hosp_email, patient_email]);
        
        res.send('data received')
        
    }
    catch (err) {
        res.send(err)
    }
}