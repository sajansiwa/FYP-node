import database from "../database/databaseConfig"

export const hospCoordinates = async(req, res) => {
    try {
        const [longitude, latitude, email] = req.body

        try {
            database.query(hospCoordinates, [email, latitude, longitude])
        }
        catch (err) {
            res.send(err)
        }

    }
    catch (err) {
        res.send(err)
    }
}